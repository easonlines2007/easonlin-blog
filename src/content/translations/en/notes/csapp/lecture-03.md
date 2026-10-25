---
kind: notes
source: csapp/lecture-03
title: "Lecture 03 · Bits, Bytes, and Integers, Continued: Two’s Complement,
  Sign Extension, and Conversions"
description: "CSAPP Lecture 3: Bits, Bytes, and Integers cont: Complementary
  Arithmetic, Sign Extension, and Conversion Traps"
sourceHash: 058ccade9cb0b190ae50261bdd9359e5c52db3e0e4b8f56b936d033985fe4967
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: Randal E. Bryant ｜ **Original video**: Bilibili points P3 \| **duration**: 01:16:35  
> **Module**: Module 1: Representing & Manipulating Information (L02 - L04 · Integer representation, bit operations and IEEE floating point numbers)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=3](https://www.bilibili.com/video/BV1iW411d7hd/?p=3)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. The underlying mechanism of type conversion between signed and unsigned numbers: bit pattern conservation law

*(Reference time: 00:02:40 · [Video jump (P3 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=160))*

![The underlying mechanism of type conversion between signed and unsigned numbers: bit pattern conservation law official handout illustration](</attachments/csapp-b2fc675fc43bab72943a4931.png>)

In C language, signed numbers (`int`) and unsigned numbers (`unsigned int`) can occur freely between explicit or implicit type conversions.
The first iron rule of underlying hardware must be kept in mind: **Casting never changes any bits in physical memory (bit pattern conservation)**!
Conversion changes only **How the compiler mathematically interprets this string of binary bit patterns**.

Set  $w$  bit vector  $\vec{x}$: 
* Convert from complement to unsigned: $T2U_w(x) = B2U_w(T2B_w(x))$
* Mathematical derivation: 
  $$T2U_w(x) = \begin{cases} x, & x \ge 0 \\ x + 2^w, & x < 0 \end{cases}$$
 When a negative number ($x < 0$) is cast to an unsigned number, it is added  $2^w$. For example, in 32-bit: 
$$-1 \implies -1 + 2^{32} = 4,294,967,295 \quad (0\text{xFFFFFFFF})$$
 Converting from unsigned number to complement is its inverse operation  $U2T_w(u)$: Greater than  $TMax$  The unsigned number becomes a negative number directly after conversion.

## 2. The huge trap of implicit type promotion in C language (The Signed-Unsigned Comparison Trap)

*(Reference time: 00:14:20 · [Video jump (P3 00:14:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=860))*

![The Signed-Unsigned Comparison Trap (The Signed-Unsigned Comparison Trap) official lecture notes in C language](</attachments/csapp-72fe60df89a61c10a8b7be5a.png>)

A secret rule of C language: **When one of the two operands of an operator is a signed number and the other is an unsigned number, the C language will implicitly cast the signed number to an unsigned number and perform a pure unsigned operation!**

This leads to a series of code traps that are extremely contrary to human mathematical common sense:

```c
int i = -1;
unsigned int u = 0;
if (i < u) {
    printf("符合直觉: -1 < 0\n");
} else {
    printf("震惊发现: -1 >= 0U !\n"); /* 实际执行该分支！ */
}
```
**Reason analysis**: Since the right side is  `0U`, the C compiler quietly changes the left  `-1`  promoted to  `unsigned int`, whose bit pattern  `0xFFFFFFFF`  became  $4294967295$! Therefore  $4294967295 < 0$  judged to be false.

This trap has led to major security vulnerabilities in real open source industrial code. For example, the standard library  `strlen()`  The function return type is  `size_t` (unsigned integer):
```c
/* 致命的代码示例：比较两个字符串长度差 */
int str_longer(char *s, char *t) {
    return strlen(s) - strlen(t) > 0;
}
```
If  `s`  length is 3, `t`  length 5, subtract two unsigned numbers  $3 - 5$  Underflow occurs, resulting in a very large positive number  $2^{64}-2$, the expression always returns true (True)!
The correct way to write it should be  `strlen(s) > strlen(t)`.

## 3. Sign Extension and Truncation

*(Reference time: 00:27:10 · [Video jump (P3 00:27:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=1630))*

![Sign Extension and Truncation Official Lecture Notes Illustrations](</attachments/csapp-e971f842c8f8fd9d9fe5159d.png>)

#### 1. Sign extension (small-width to large-width)
When converting a short integer (e.g. 16-bit  `short`) to a long integer (such as 32-bit  `int`):
* **Unsigned numbers (Zero Extension)**: Fill in all high positions  `0`; 
* **Two's complement signed numbers (Sign Extension)**: Copy and fill the most significant bit (sign bit) of the original number to the high bit.

*Rigorous mathematical proof*:
Suppose we want to have a  $w$  The bit vector expands to  $w+1$  bit, copy the highest bit  $x_{w-1}$  As the new highest bit: 
$$B2T_{w+1}([x_{w-1}, x_{w-1}, x_{w-2}, \dots, x_0]) = -x_{w-1} 2^w + x_{w-1} 2^{w-1} + \sum_{i=0}^{w-2} x_i 2^i$$
 due to  $-x_{w-1} 2^w + x_{w-1} 2^{w-1} = -x_{w-1} 2^{w-1}$, the sum of the new weights is completely equivalent to the original value  $B2T_w(\vec{x})$! Regardless of whether it is a positive or negative number, the numerical value remains absolutely unchanged.

#### 2. Truncation operation (converting large width to small width)
When putting a 32-bit  `int`  Force conversion to 16-bit  `short` , the upper 16 bits are simply and rudely discarded.
* Truncation of unsigned numbers is equivalent to modulo: $x \pmod{2^k}$; 
* Signed truncation leaves low  $k$  bit, re-turn low  $k$  The highest bit of the bit is reinterpreted as the sign bit, which may cause the original positive number to become negative instantly.

## 4. Two's Complement Addition and overflow detection criteria (Two's Complement Addition)

*(Reference time: 00:39:45 · [Video jump (P3 00:39:45)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=2385))*

![Two's Complement Addition and Overflow Detection Criteria (Two's Complement Addition) Official Handout Illustration](</attachments/csapp-664655c5ff7dbde2c2e459b8.png>)

Let two  $w$  bit signed integer  $x, y \in [-2^{w-1}, 2^{w-1}-1]$, whose actual algebraic sum satisfies: 
$$-2^w \le x + y \le 2^w - 2$$
 Add two numbers in binary and discard the first  $w+1$  Bit carry to get the hardware calculation result  $x +^t_w y$: 

$$
x +^t_w y = \begin{cases}
x + y - 2^w, & TMax < x + y \quad (\text{正溢出 Positive Overflow}) \\
x + y, & TMin \le x + y \le TMax \quad (\text{正常范围}) \\
x + y + 2^w, & x + y < TMin \quad (\text{负溢出 Negative Overflow})
\end{cases}
$$

```text
       x > 0, y > 0, 但 sum < 0  ===> 正溢出 (Positive Overflow)
       x < 0, y < 0, 但 sum >= 0 ===> 负溢出 (Negative Overflow)
       一正一负相加             ===> 绝无溢出可能！
```

When writing high-quality low-level libraries, addition overflows must be accurately captured:
```c
/* 工业级安全检测有符号加法是否溢出 */
int tadd_ok(int x, int y) {
    int sum = x + y;
    int neg_over = (x < 0) && (y < 0) && (sum >= 0);
    int pos_over = (x > 0) && (y > 0) && (sum < 0);
    return !neg_over && !pos_over;
}
```

## 5. Multiplication optimization and division arithmetic right shift offset (Multiplication & Shift)

*(Reference time: 00:52:15 · [Video jump (P3 00:52:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=3135))*

![Multiplication Optimization and Division Arithmetic Right Shift Offset (Multiplication & Shift) Official Lecture Notes Illustrations](</attachments/csapp-15dbc35120a32931c6110237.png>)

#### 1. Shift addition replaces expensive multiplication
In the periodic table of processor instructions, integer addition and subtraction only takes 1 clock cycle, while integer multiplication instructions  `imull`  It usually takes 3~5 clock cycles. The GCC compiler is optimizing  `-O2`  The following will automatically replace the multiplicative constant with a shift:
* Multiply by 14: $14 = 2^4 - 2^1$, code  `x * 14`  will be compiled as  `(x << 4) - (x << 1)`; 
* Multiply by 31: $31 = 2^5 - 1$, compiled as  `(x << 5) - x`.

#### 2. Signed division  $2^k$  Biasing is a magic touch
unsigned integer division  $2^k$  Can be directly logically shifted to the right  $k$  bit (i.e.  $\lfloor x / 2^k \rfloor$).
But for signed negative numbers, the C language standard states that integer division must **Round toward Zero** (e.g.  $-3 / 2 = -1$).
If we perform an arithmetic right shift directly on negative numbers: 
$$-3 \text{ 的补码} = 11111101_2 \xrightarrow{\text{算术右移 1 位}} 11111110_2 = -2 \quad (\text{向下舍入，错误！})$$

In order for the arithmetic right shift to correctly implement rounding towards zero, it must be added before the right shift **Bias (Bias = $2^k - 1$)**: 
$$(x + (1 \ll k) - 1) \gg k$$
 to  $-3$  For example, divide by 2 ($k = 1$, Bias = 1): 
$$(-3 + 1) \gg 1 = -2 \gg 1 = -1 \quad (\text{完全正确！})$$
 When the compiler translates a negative number divided by a power of 2, it will automatically inject two lines of instructions: use the sign bit to generate an offset and add it to the original number, and then perform an arithmetic right shift.


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Bits, Bytes, and Integers cont: complement arithmetic, sign extension and conversion traps" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
