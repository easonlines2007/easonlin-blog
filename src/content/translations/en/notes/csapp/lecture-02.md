---
kind: notes
source: csapp/lecture-02
title: "Lecture 02 · Bits, Bytes, and Integers: Binary Representation and
  Boolean Algebra"
description: "CSAPP Lecture 2: Bits, Bytes, and Integers: Binary storage of
  information, Boolean algebra, and integer encoding"
sourceHash: 548e766f6136256c48b6baabcf2b015dc8cbb3849f589da90a4e3448a49cef7c
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: Randal E. Bryant ｜ **Original video**: Bilibili points P2 \| **duration**: 01:11:05  
> **Module**: Module 1: Representing & Manipulating Information (L02 - L04 · Integer representation, bit operations and IEEE floating point numbers)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=2](https://www.bilibili.com/video/BV1iW411d7hd/?p=2)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. The cornerstone of information storage in modern computers: Bytes and hexadecimal coding

*(Reference time: 00:02:15 · [Video jump (P2 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=135))*

![The cornerstone of information storage in modern computers: Bytes and hexadecimal encoding Official handout illustration](</attachments/csapp-397a4d6bef9dcdb21fe165e8.png>)

At an isolated physical level, there are only bistable circuits inside a computer chip: a high level means  `1`, low level indicates  `0`. The amount of information carried by a single bit (Bit) is too poor, and modern computer systems unanimously adopt **Byte (8 bits) **as** smallest addressable memory unit**.

One byte owns  $2^8 = 256$  A discrete state:
* The range expressed in binary is  `00000000_2`  Arrive  `11111111_2`; 
* The range expressed in decimal is  $0$  Arrive  $255$.

However, in system programming and disassembly analysis, binary is too long and decimal cannot see the bit structure clearly. \*\*Hexadecimal (base 16)\*\* has become the industry de facto standard:
* Hexadecimal takes digits  `0`~`9`  and letters  `A`~`F` (not case sensitive);
* Each hexadecimal character exactly corresponds to  **4 binary bits (called nibble)**; 
* Two hexadecimal characters fit tightly together into a complete 8-bit byte.

| Hexadecimal characters | Binary value (Nibble) | decimal value | Hexadecimal characters | Binary value (Nibble) | decimal value |
|:---:|:---:|:---:|:---:|:---:|:---:|
| `0` | `0000` | 0 | `8` | `1000` | 8 |
| `1` | `0001` | 1 | `9` | `1001` | 9 |
| `2` | `0010` | 2 | `A` | `1010` | 10 |
| `3` | `0011` | 3 | `B` | `1011` | 11 |
| `4` | `0100` | 4 | `C` | `1100` | 12 |
| `5` | `0101` | 5 | `D` | `1101` | 13 |
| `6` | `0110` | 6 | `E` | `1110` | 14 |
| `7` | `0111` | 7 | `F` | `1111` | 15 |

> **Extreme mental algorithm**:
memory  `0xA` (`10`), `0xC` (`12`), `0xF` (`15`).
When seeing a hexadecimal number  `0x5C`  When, it is disassembled instantly: `5`  Yes  `0101`, `C`  Yes  `1100`, spelled into complete bytes, that is  `01011100`, the decimal system is  $5 \times 16 + 12 = 92$.

## 2. Comparison of word lengths of common C data types in 32-bit and 64-bit machines

*(Reference time: 00:09:40 · [Video jump (P2 00:09:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=580))*

![Comparison of word lengths of common C data types in 32-bit and 64-bit machines Official handout illustration](</attachments/csapp-cc0772411467a17e28ca9050.png>)

The machine's "Word Size" is determined by the width of the CPU's general registers and virtual memory addressing pointers.
Evolving from 32-bit machines to 64-bit x86-64 architecture, there are key differences in the physical width of data types:

| C data type | Typical 32-bit system (IA32) | Typical 64-bit system (x86-64 / LP64) | Assembly opcode suffix |
|:---|:---:|:---:|:---:|
| `char` | 1 byte (8 bits) | 1 byte (8 bits) | `b` (byte) |
| `short` | 2 bytes (16 bits) | 2 bytes (16 bits) | `w` (word) |
| `int` | 4 bytes (32 bits) | 4 bytes (32 bits) | `l` (long word) |
| `long` | **4 bytes (32 bits)** | **8 bytes (64 bits)** | `q` (quad word) |
| `long long` | 8 bytes (64 bits) | 8 bytes (64 bits) | `q` (quad word) |
| **pointer type (`char*`, `void*`)** | **4 bytes (32 bits)** | **8 bytes (64 bits)** | `q` (quad word) |
| `float` | 4 bytes (32 bits) | 4 bytes (32 bits) | `s` (single) |
| `double` | 8 bytes (64 bits) | 8 bytes (64 bits) | `l` (double precision) |

> **Key architectural differences**:
Under a 32-bit system, the pointer is only 4 bytes, and the upper limit of the maximum virtual address space of the entire process is deadlocked at  $2^{32} = 4\text{GB}$;
Under a 64-bit system, the pointer is expanded to 8 bytes, and the theoretical virtual addressing capability reaches  $2^{64} = 16\text{EB}$ (Exabytes), which is why modern large databases and servers have adopted 64-bit architecture.

## 3. Boolean Algebra & Bit Vectors

*(Reference time: 00:18:10 · [Video jump (P2 00:18:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=1090))*

![Boolean Algebra & Bit Vectors Official Lecture Notes Illustrations](</attachments/csapp-df635eeb206f5b8b8af6d079.png>)

In the mid-19th century, mathematician George Boole created **Boolean algebra**. in by  $\{0, 1\}$  Four basic operations are defined on the system:
* **AND,  $\&$)**: All 1’s are 1($1 \& 1 = 1$, otherwise 0);
* **or (OR,  $\mid$)**: If there is 1, it is 1 ($0 \mid 0 = 0$, otherwise 1);
* **NOT (NOT,  $\sim$)**:Inverted bit($\sim 1 = 0, \sim 0 = 1$); 
* **XOR,  $\oplus$  or  `^`)**: 1 if they are different, 0 if they are the same ($1 \oplus 0 = 1, 1 \oplus 1 = 0, 0 \oplus 0 = 0$).

When we extend Boolean operations to length  $w$  of **Bit Vectors **When , it shows amazing mathematical isomorphism:
Bit vectors can be used directly** Efficient and compact representation of mathematical sets (Set Representation)**!
* Suppose we encode the set with an 8-bit vector  $\{0, 1, 2, 3, 4, 5, 6, 7\}$  A subset of:
  * Ruodi  $i$  The bit is 1, representing a number  $i$  Belongs to this collection.
  * vector  `01100010`  represents a set  $\{1, 5, 6\}$; 
  * vector  `01010100`  represents a set  $\{2, 4, 6\}$; 
* At this time:
  * **Bitwise AND  `&`**  Corresponding to the set **Intersection**: `01000000` $\to \{6\}$; 
  * **Bitwise OR  `|`**  Corresponding to the set **Union**: `01110110` $\to \{1, 2, 4, 5, 6\}$; 
  * **Bitwise NOT  `~`**  Corresponding to the set **Complement**; 
  * **Bitwise XOR  `^`**  Corresponding to the set **Symmetric Difference**.
This technique is widely used in operating system bitmap management (Bitmap Allocation) and high-concurrency publishing filters.

## 4. Bit-level operations in C language vs the deep water of logical operations

*(Reference time: 00:27:50 · [Video jump (P2 00:27:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=1670))*

![Bit-level operations in C language vs. the deep waters of logical operations Official handout illustrations](</attachments/csapp-7e9ee91664799eb1a1c2e8f9.png>)

C language strictly distinguishes two groups of symbol systems, and confusing them is the most fatal grammatical disaster for beginners:
1. **Bit-level operators (`&`, `|`, `~`, `^`)**:
Bit by bit independent parallel calculation, no matter what the value of the operand is, the gate operation is performed exactly according to the bit pattern.
   ```c
   unsigned char a = 0x69; // 01101001
   unsigned char b = 0x55; // 01010101
   a & b; // 01000001 (0x41)
   a | b; // 01111101 (0x7D)
   ~a;    // 10010110 (0x96)
   ```

2. **logical operator (`&&`, `||`, `!`)**:
It only cares whether the operand as a whole is "true (non-zero)" or "false (zero)", and the result of the operation is always normalized to pure  `1`  or  `0`.
   ```c
   !0x41   == 0; // 非零值的逻辑非是 0
   !0x00   == 1; // 零值的逻辑非是 1
   !!0x41  == 1; // 双重逻辑非将任意非零值转换为标准布尔 1
   0x69 && 0x55 == 1; // 两个非零值相与，结果是 1
   ```

> **Short-Circuit Evaluation (Short-Circuit Evaluation)**:
Logical operators are executed from left to right. If the first operand can already determine the reasoning result, the subsequent expression **Will never be executed**!
> ```c
> if (p != NULL && *p > 0) { ... }
> ```
> This classic defensive code relies entirely on short-circuit evaluation. If mistakenly written as bitwise AND  `if (p != NULL & *p > 0)`, regardless of  `p`  Whether it is a null pointer, the one on the right  `*p`  All will be forcibly dereferenced, causing a segfault in an instant and causing the program to crash!

## 5. In-depth analysis of shift operation: logical right shift vs arithmetic right shift and undefined behavior

*(Reference time: 00:38:20 · [Video jump (P2 00:38:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=2300))*

![In-depth analysis of shift operations: logical right shift vs arithmetic right shift and undefined behavior Official handout illustration](</attachments/csapp-6bef512916518d195b03feee.png>)

The bit shift operation shifts the binary bits to the specified offset  $k$  Overall sliding:
* **Left shift operation  `x << k`**:
Shift all bits to the left  $k$  bit, discard the ones that overflow the highest bit  $k$  bits, and pad the right side of the low bit  $k$  a  `0`. Shift left  $k$  equivalent to multiplying by  $2^k$.
* **right shift operation  `x >> k`**  There are two completely different hardware strategies:
  1. **Logical Shift**: All the vacant positions in the highest position on the left **fill  `0`**.
  2. **Arithmetic Shift**: All the vacant positions in the highest position on the left **Copy the original sign bit (Sign Bit Extension)**! If the highest bit of the original number is 1, then all 1s are added; if the highest bit is 0, all 0s are added.

```text
原始 8 位向量 x: [ 1 1 0 0 0 1 0 0 ]  (最高位是 1，有符号负数)

逻辑右移 2 位:   [ 0 0 1 1 0 0 0 1 ]  (填 0，无符号数 0x31)
算术右移 2 位:   [ 1 1 1 1 0 0 0 1 ]  (填 1，保持负号 0xF1)
```

> **C language standard undefined behavior trap (Undefined Behavior, UB)**: 
> 1. for **unsigned number**, the C standard mandates that the right shift must be **Logical right shift**; 
> 2. for **signed number**, almost all modern compilers (GCC, Clang, MSVC) use it by default **arithmetic right shift**; 
> 3. **Shift amount out of bounds**: If the bit width of an integer is  $w$  bit (e.g. 32-bit), execute  `x << 32`  or  `x << -1`, in the C standard belongs to **Undefined behavior (UB)**! At the x86-64 hardware level, the CPU will only take the lower 5 bits of the shift amount (i.e.  `k % 32`), execute  `x << 32`  actually equivalent to  `x << 0`, the variables originally thought to be cleared remain unchanged!

## 6. Mathematical derivation of integer coding system: unsigned number B2U and signed complement B2T

*(Reference time: 00:49:10 · [Video jump (P2 00:49:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=2950))*

![Mathematical derivation of integer coding system: unsigned number B2U and signed complement B2T official handout illustration](</attachments/csapp-12ae8a8b09d1859c4ed1f0b7.png>)

For a bit width of  $w$  binary bit vector of  $\vec{x} = [x_{w-1}, x_{w-2}, \dots, x_0]$: 

#### 1. Binary to Unsigned (B2U)
Each bit is assigned a positive weight  $2^i$: 
$$B2U_w(\vec{x}) = \sum_{i=0}^{w-1} x_i 2^i$$
* Minimum value (all 0s): $UMin = 0$
* Maximum value (all 1s): $UMax = \sum_{i=0}^{w-1} 2^i = 2^w - 1$
* For 32-bit unsigned numbers: $UMax = 2^{32} - 1 = 4,294,967,295$.

#### 2. Binary to Two's Complement (B2T)
The most exquisite invention of complement code is to convert the most significant bit  $x_{w-1}$  called **Sign Bit**, and give it **negative weight** $-2^{w-1}$: 
$$B2T_w(\vec{x}) = -x_{w-1} 2^{w-1} + \sum_{i=0}^{w-2} x_i 2^i$$

* **minimum value  $TMin$** (The highest bit is 1, the rest are all 0): 
  $$\vec{x} = [1, 0, 0, \dots, 0] \implies TMin_w = -2^{w-1}$$
   (For 32-bit systems, $TMin = -2^{31} = -2,147,483,648$)
* **maximum value  $TMax$** (The highest bit is 0, the rest are all 1): 
  $$\vec{x} = [0, 1, 1, \dots, 1] \implies TMax_w = \sum_{i=0}^{w-2} 2^i = 2^{w-1} - 1$$
   (For 32-bit systems, $TMax = 2^{31} - 1 = 2,147,483,647$)
* **numerical value  `-1`  bit pattern** (all 1): 
  $$\vec{x} = [1, 1, 1, \dots, 1] \implies -2^{w-1} + (2^{w-1} - 1) = -1$$

#### Core mathematical properties and asymmetry of complement codes
1. **$|TMin| = TMax + 1$**: The range of negative numbers is 1 larger than the absolute value of positive numbers! because  `0`  An all-zero encoding that occupies the positive range.
2. **Reverse high-speed bit-level formulas for negative numbers**:
for any complement number  $x$, its opposite  $-x$  can pass **Negate everything bitwise and add 1**  Get it very quickly: 
   $$-x = \sim x + 1$$
   *prove*: Because  $x + \sim x = [1, 1, \dots, 1] = -1$, so  $\sim x = -x - 1 \implies -x = \sim x + 1$.


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Bits, Bytes, and Integers: Binary storage of information, Boolean algebra and integer encoding" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
