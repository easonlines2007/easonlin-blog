---
kind: notes
source: csapp/lecture-08
title: "Lecture 08 · Machine-Level Programming IV: Arrays, Structure Alignment,
  and Unions"
description: "CSAPP Lecture 8: Machine-Level Programming IV: Data (array
  row-major layout, structure alignment rules and unions)"
sourceHash: 9fe998738462a9faee1d3c3c2a0bf734848273d58ad2ed426fd02883970641de
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: Randal E. Bryant & David R. O'Hallaron ｜ **Original video**: Bilibili points P8 \| **duration**: 01:19:45  
> **Module**: Module 2: Machine-Level Representation of Programs (L05 - L09 · x86-64 assembly, control flow, procedure calls and data structures)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=8](https://www.bilibili.com/video/BV1iW411d7hd/?p=8)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. Memory allocation and addressing scaling factors for one-dimensional arrays

*(Reference time: 00:02:40 · [Video jump (P8 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=8&t=160))*

![Memory allocation and addressing scaling factors of one-dimensional arrays official handout illustrations](</attachments/csapp-e0514040cab00e7a2cea8d49.png>)

In C language, an array is a data structure that closely arranges elements of the same data type in a contiguous block of memory.
Statement  `T A[N]`  It has two core attributes:
1. **continuous space allocation**: Allocate a contiguous  $L = N \times S$  byte space, where  $S = \text{sizeof}(T)$  is the size of a single element;
2. **Identifiers degenerate into pointers**: array name  $A$  In most expressions, it directly degenerates into pointing to the first element of the array (starting address  $x_A$) pointer.

### Assembly mapping of array subscript addressing
For one-dimensional array  `T A[N]`, No.  $i$  elements  $A[i]$  The physical memory address is: 
$$\text{Addr}(A[i]) = x_A + i \times S$$
 Memory addressing modes of modern x86-64 architectures  `Imm(Rb, Ri, S)`  There is a natural hardware-level correspondence with array addressing:
* base address register  $R_b$  Store the starting pointer of the array  $x_A$; 
* index register  $R_i$  Store element index subscript  $i$; 
* **scale factor  $S$(Scale Factor)**  can only be taken  `1, 2, 4, 8`  Four values, which perfectly correspond to the C language  `char (1)`, `short (2)`, `int / float (4)`, `long / double / pointer (8)`!
* read  `A[i]`  Only a single machine instruction is required:
  ```assembly
  # 假设 %rdi 存储数组首地址 A, %rsi 存储整数下标 i (int 型数组，S=4)
  movl    (%rdi, %rsi, 4), %eax   # %eax = A[i]
  ```
* Calculate  `&A[i]` (Getting the address) also only requires a single instruction:
  ```assembly
  leaq    (%rdi, %rsi, 4), %rax   # %rax = &A[i]
  ```

## 2. Two-dimensional and multi-dimensional arrays: Row-Major row-major arrangement and nested loop optimization

*(Reference time: 00:16:15 · [Video jump (P8 00:16:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=8&t=975))*

![Two-dimensional and multi-dimensional arrays: Row-Major row-major arrangement and nested loop optimization official handout illustrations](</attachments/csapp-401e7df20c75744b74fdef08.png>)

### Row-Major Order
Multi-dimensional arrays in C language are arranged continuously in memory strictly in row-major order.
for statement  `int A[R][C]`($R$  OK  $C$  column, each element occupies  $K$  bytes):
* All elements of the entire 0th row are first stored continuously at the beginning of the memory;
* This is followed by all elements of row 1, and so on;
* element  `A[i][j]`  The formula for calculating the memory linear offset row first address is: 
  $$\text{Addr}(A[i][j]) = x_A + (i \times C + j) \times K$$

```c
#define R 3
#define C 5
int A[R][C];
```
visit  `A[i][j]` , the compiler must calculate the offset  $i \times 5 + j$. In assembly, multiplication is usually converted to shift and addition: 
$5 \times i = (4 \times i) + i$: 
```assembly
# %rdi = A, %rsi = i, %rdx = j
leaq    (%rsi, %rsi, 4), %rax   # %rax = 5 * i
addq    %rdx, %rax              # %rax = 5 * i + j
movl    (%rdi, %rax, 4), %eax   # 读取 A[i][j] (4 字节)
```

### The essential difference between multilevel array and multidimensional array
Beginners often get confused  `int A[R][C]`  with secondary pointer array  `int *B[R]`: 
1. **Multidimensional continuous array  `int A[R][C]`**: 
   * Memory is a single contiguous block of size  $R \times C \times 4$  Bytes;
   * visit  `A[i][j]`  Just need **One multiply-add address calculation + one memory dereference**.
2. **Multilevel pointer array  `int *B[R]`**: 
   * $B$  itself is an inclusion  $R$  An array of pointers; each pointer independently points to a segment on the heap or stack with a length of  $C$  memory area;
   * visit  `B[i][j]`  need **Two consecutive memory accesses**: 
     ```assembly
     # 先读出 B[i] 指针，再通过该指针读取第 j 个元素
     movq    (%rdi, %rsi, 8), %rax   # %rax = B[i] (内存读 1)
     movl    (%rax, %rdx, 4), %eax   # %eax = B[i][j] (内存读 2)
     ```
   * Performance difference: The multi-level pointer array has one more indirect memory addressing, which not only destroys the spatial locality, but also makes it easier to cause CPU Cache Miss!

## 3. Memory layout and field offset calculation of structures

*(Reference time: 00:32:50 · [Video jump (P8 00:32:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=8&t=1970))*

![Memory layout and field offset calculation of structures (Structures) Official handout illustration](</attachments/csapp-6ffa6d3e7d03e5c93a18f731.png>)

C language structure (`struct`) combines variables of different types into a single composite object.
Basic machine-level rules for structures:
* **Fields arranged in order**: The storage order of all fields in memory **Strictly follow the order of declarations**; 
* **Start address alignment**: The pointer to the structure points to the first field of the structure;
* The compiler allocates a fixed byte offset (Offset) to each field during compilation. In the assembly code, each member is accessed through the base address plus the fixed offset.

```c
struct rec {
    int i;        /* 4 bytes */
    int a[2];     /* 8 bytes */
    int *p;       /* 8 bytes */
};
```
when defined  `struct rec *r`  When:
* `r->i`  Located at offset  `0`  place;
* `r->a[0]`  Located at offset  `4`  place, `r->a[1]`  Located at offset  `8`  place;
* `r->p`  Located at offset  `16`  (need to consider the memory alignment described next!).

## 4. Data Alignment: Hardware Limitations and Memory Filling Secrets

*(Reference time: 00:44:20 · [Video jump (P8 00:44:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=8&t=2660))*

![Data Alignment: Hardware Limitations and Memory Filling Behind the Scenes Official Handout Illustration](</attachments/csapp-ae56c282bc585446bef769d4.png>)

Many programmers mistakenly believe that the size of a structure is simply the sum of the sizes of its members.
However, on an x86-64 system, running the following code yields shocking results:
```c
struct S1 {
    char c;     /* 1 byte */
    int i;      /* 4 bytes */
    char d;     /* 1 byte */
};
printf("%zu\n", sizeof(struct S1)); // 输出竟然是 12，而不是 6！
```
The underlying reason for this huge space expansion is **Hardware data alignment requirements (Data Alignment Requirements)**!

### Why does hardware need to be aligned?
The computer's memory bus and cache lines carry data to the CPU in 4-byte, 8-byte, or 64-byte blocks.
If an 8-byte  `double`  Or the pointer is placed at an odd address that is not a multiple of 8 (spans two 8-byte bus blocks or crosses a Cache line boundary):
* The CPU must issue **Two expensive memory read instructions**; 
* Shifting and mask splicing must be performed in the internal pipeline, and performance plummets;
* On some architectures (such as ARM or early SPARC), unaligned access may even directly cause a hardware bus exception (Bus Error) and cause the program to crash!

### x86-64 alignment guidelines
any size  $K$  The basic data type of byte, its storage address must be  **$K$  an integer multiple of**: 
* 1 byte (`char`): Any address alignment;
* 2 bytes (`short`): The lowest bit of the address is 0 (2-byte alignment);
* 4 bytes (`int`, `float`): The lowest 2 bits of the address are 0 (4-byte alignment);
* 8 bytes (`long`, `double`, pointer): the lowest 3 bits of the address are 0 (8-byte alignment);
* 16 bytes (`long double`  or AVX vector): the lowest 4 bits of the address are 0 (16-byte aligned).

### Structure internal padding (Internal Padding) and end padding (External Padding)
In order to meet alignment requirements, the compiler will automatically insert useless space between and at the end of the structure members. **Padding**: 
1. **internal padding**: The offset of each member must be the member's own alignment requirement  $K$  multiples;
2. **End padding**: **The total size of the entire structure must be the largest member alignment requirement in the structure  $K_{\max}$  an integer multiple of**!
   * Why do I need trailing padding? Because if you define an array of structures  `struct S a[10]`, when accessing the 1st element  `a[1]` , its starting address is  `a[0]`  The address plus the total size of the structure. If the total size of the structure is not  $K_{\max}$  Multiples of, the member alignment of all subsequent elements in the array will completely collapse!

### Tips for optimizing arrangement of structure fields
Filling holes can be greatly reduced by placing large aligned members at the front and small aligned members at the back:
```c
/* 糟糕的排布：消耗 12 字节 (6 字节有效，6 字节填充垃圾) */
struct S1 {
    char c;     /* 1 byte + 3 bytes padding */
    int i;      /* 4 bytes */
    char d;     /* 1 byte + 3 bytes trailing padding */
};

/* 极致优化排布：仅消耗 8 字节 (6 字节有效，仅 2 字节填充) */
struct S2 {
    int i;      /* 4 bytes */
    char c;     /* 1 byte */
    char d;     /* 1 byte + 2 bytes trailing padding */
};
```

## 5. Unions: Memory multiplexing and binary bit-level type punning

*(Reference time: 01:05:40 · [Video jump (P8 01:05:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=8&t=3940))*

![Unions: Memory Multiplexing and Binary Bit Level Type Punning Official Handout Illustration](</attachments/csapp-d9a479c90cdb8bd67c1da6b6.png>)

Consortium (`union`) is similar in syntax to a structure, but its memory allocation strategy is essentially different:
* **All fields share the same memory physical space**!
* The total size of the union is equal to **the size of its largest member**, and meet the maximum alignment requirements.

### Two typical engineering applications of the consortium

1. **Variant types (save memory)**:
When an object can only be in one of several mutually exclusive states at a certain time, using a union can avoid memory expansion. For example, a binary tree node: internal nodes need two child node pointers, while leaf nodes only need to store data values.

2. **Type Punning: Bit-level inversion and floating-point bit operations**:
In C language, if you directly  `double`  forced to  `unsigned long`(`val = (unsigned long) d`), the hardware will perform a numerical conversion instruction (rounding the decimal to an integer value).
But if we need **View the 64 original 0/1 bits of a floating point number in memory intact** (For example, analyzing IEEE 754 exponents and mantissas), the union is a classic weapon:

```c
typedef union {
    double d;
    unsigned long u;
} bit_caster;

unsigned long get_double_bits(double val) {
    bit_caster bc;
    bc.d = val;
    return bc.u; // 零开销读取原始二进制比特！
}
```
In modern system programming, the union is a powerful scalpel that breaks through the limitations of advanced type systems and directly controls the bit expression of the underlying hardware!


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Machine-Level Programming IV: Data (array row-first layout, structure alignment rules and unions)" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
