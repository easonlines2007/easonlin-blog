---
kind: notes
source: csapp/lecture-04
title: "Lecture 04 · Floating Point: IEEE 754, Rounding, and Numerical Exceptions"
description: "CSAPP Lecture 4: Floating Point: IEEE 754 floating point number
  representation, rounding mechanism and numerical exceptions"
sourceHash: bfa9abe9b278b0585b30474fe9549c9871400cedfa1c4119eb88bdc9d2a85d4c
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: David R. O'Hallaron ｜ **Original video**: Bilibili points P4 \| **duration**: 01:11:33  
> **Module**: Module 1: Representing & Manipulating Information (L02 - L04 · Integer representation, bit operations and IEEE floating point numbers)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=4](https://www.bilibili.com/video/BV1iW411d7hd/?p=4)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. The dilemma of fixed-point representation and the birth of floating-point counting method

*(Reference time: 00:02:15 · [Video jump (P4 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=135))*

![The Dilemma of Fixed-Point Representation and the Birth of Floating-Point Counting Official Lecture Notes](</attachments/csapp-b10ab3b0b49a6a66e3f5eca3.png>)

How to represent decimals with finite binary bits?
The most original solution is **Fixed Point**: Fixed decimal point position. For example, it is specified that the upper 16 bits represent the integer part and the lower 16 bits represent the decimal part.
The fatal flaw of fixed-point numbers is that the dynamic range is extremely narrow:
* It cannot represent extremely large physical quantities (such as Avogadro's constant  $6.02 \times 10^{23}$); 
* Nor can it represent extremely small atomic scales (such as Planck’s constant  $6.626 \times 10^{-34}$).

In order to take into account the vast dynamic range and extremely high local effective accuracy, the computer borrowed scientific notation and was born. **Floating Point**:
Let the decimal point "float" freely according to the size of the exponent!
In 1985, it was led by Turing Award winner William Kahan.  **IEEE 754 floating point standard**  It has become the gold standard that the entire industry follows uniformly.

## 2. The three core fields of IEEE 754 floating point numbers

*(Reference time: 00:11:40 · [Video jump (P4 00:11:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=700))*

![The three core fields of IEEE 754 floating point numbers Official handout illustration](</attachments/csapp-9987e6b6d5f351b24f8715e6.png>)

IEEE 754 encodes any real number as a triple: 
$$V = (-1)^s \times M \times 2^E$$

1. **Sign bit (Sign,  $s$)**:1 bit. $s = 1$  represents a negative number, $s = 0$  Represents a positive number.
2. **Exponent,  $exp$)**: $k$  bits. coding index  $E$.
3. **Decimal field (Fraction/Mantissa,  $frac$)**: $n$  bits. Encoded mantissa valid value  $M$.

```text
单精度 float (32 位):
 31 30         23 22                                  0
+--+-------------+------------------------------------+
|s |   exp (8位) |            frac (23位)             |
+--+-------------+------------------------------------+

双精度 double (64 位):
 63 62                 52 51                          0
+--+---------------------+----------------------------+
|s |     exp (11位)      |         frac (52位)        |
+--+---------------------+----------------------------+
```

## 3. Normalized numbers (Normalized) and hidden bit design (Implicit Leading 1)

*(Reference time: 00:22:30 · [Video jump (P4 00:22:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=1350))*

![Normalized Numbers (Normalized) and Hidden Bit Design (Implicit Leading 1) Official Handout Illustration](</attachments/csapp-6bf57cfaec526143c4663c90.png>)

When the exponent field is not all 0 and not all 1 ($0 < exp < 2^k - 1$), belongs to **Normalized number**: 

1. **Biased Exponent**:
index  $E$  Instead of using the complement code, use the offset code: 
   $$E = exp - Bias \quad \text{其中 } Bias = 2^{k-1} - 1$$
   * single precision float ($k = 8$): $Bias = 127$, $exp \in [1, 254]$, the actual index  $E \in [-126, 127]$; 
   * double($k = 11$): $Bias = 1023$, $exp \in [1, 2046]$, the actual index  $E \in [-1022, 1023]$.
   * **Why use offset codes?**  This makes the exponents all represented by positive numbers, and the hardware can directly use a pure unsigned comparator to compare the sizes of two floating point numbers very quickly, without the need for expensive complement conversion!

2. **Implicit Leading 1**:
mantissa  $M$  The mathematical definition of is: 
   $$M = 1.f = 1 + f = 1 + \sum_{i=1}^n frac_i 2^{-i}$$
    In binary scientific notation, the most significant digit of the normalized number must be 1 (e.g.  $1.011_2 \times 2^3$). Since it is always 1, then **Just don't save it in physical memory**!
This allows the original 23-bit single-precision physical field to gain 24-bit precision expressiveness for free.

## 4. Denormalized numbers (Denormalized) and Gradual Underflow design (Gradual Underflow)

*(Reference time: 00:35:15 · [Video jump (P4 00:35:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=2115))*

![Denormalized numbers (Denormalized) and Gradual Underflow design (Gradual Underflow) official handout illustration](</attachments/csapp-e841502f0924b31d48a3c327.png>)

When the exponent field is all 0 ($exp = 0$), belongs to **denormalized number**. IEEE 754 demonstrates amazing mathematical subtleties here:
* **The index is specified as**: $E = 1 - Bias$(**Note: definitely not  $0 - Bias$!**); 
* **Mantissa without leading 1**: $M = 0.f$.

Two sacred missions:
1. **Precise representation of numerical value  $0.0$**: 
   * when  $s = 0, exp = 0, frac = 0$  when, it means  $+0.0$; 
   * when  $s = 1, exp = 0, frac = 0$  when, it means  $-0.0$.
2. **Achieve numerical smooth transition (Gradual Underflow)**: 
   * Maximum denormalized number: $exp = 0, frac = 11\dots1 \implies M = 1 - 2^{-n}, E = 1 - Bias$; 
   * Minimum normalized number: $exp = 1, frac = 00\dots0 \implies M = 1.0, E = 1 - Bias$;
Because the exponent of a denormalized number is designed to be  $1 - Bias$, the distance between the two is exactly the same! Completely eradicated the devastating truncation step in early floating point systems that instantly jumped to 0 once the value was less than the lower limit.

## 5. Special values: positive and negative infinity (Infinity) and not a number (NaN)

*(Reference time: 00:46:10 · [Video jump (P4 00:46:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=2770))*

![Special values: positive and negative infinity (Infinity) and not-a-number (NaN) official handout illustrations](</attachments/csapp-d83ab6671ae27ff9f9f824ad.png>)

When the exponent field is all 1 ($exp = 255$  or  $2047$): 
* **Infinity,  $\pm\infty$)**:If  $frac = 0$.
  * When a calculation overflows (e.g. division by zero  $1.0 / 0.0 = +\infty$), floating point numbers will not cause hardware crashes like integer division by zero, but will be output gracefully  $\infty$; 
  * Participate in subsequent operations to maintain mathematical correctness: $1.0 / \infty = 0.0$.
* **Not a number (NaN, Not a Number)**:If  $frac \ne 0$.
  * Produced when an illegal operation without mathematical definition is encountered: such as  $\sqrt{-1.0}$, $\infty - \infty$, $0.0 / 0.0$; 
  * **NaN is contagious**: The result of any arithmetic operation containing NaN is always NaN;
  * **Unique properties of NaN**: `NaN == NaN`  The result is always False! The classic way to determine whether a floating point number is NaN in code is  `if (x != x)`.

## 6. Floating point rounding rule: Round-to-Even to eliminate system cumulative deviation

*(Reference time: 00:58:30 · [Video jump (P4 00:58:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=3510))*

![Floating-point rounding rule: Round-to-Even to eliminate system cumulative deviation Official handout illustration](</attachments/csapp-ba86f37125003a15ada6f05d.png>)

When the actually calculated infinite real number cannot fit into the finite mantissa field, rounding must be performed. IEEE 754 specifies 4 rounding modes:
1. Round toward Zero
2. Round toward  $-\infty$)
3. Round toward  $+\infty$)
4. **Round-to-Even / Nearest Even, default golden rule**

> **Why is everyday "rounding" deprecated in computer science?**
 Consider a group containing a large number of  `.5`  Ending measurements. If all were rounded up, when accumulated over millions of physics collision simulations or financial calculations, the statistical sum would have a serious and systematic upward drift! 
> **Rounding rules towards even numbers**: 
> * This rule is only triggered if the value is exactly halfway between two possible outcomes:
> * **Guaranteed that the least significant digit after rounding is an even number (the lowest bit is 0)**!
> * Example (decimal rounding to integer):
>   * $1.5 \to 2$ (2 is an even number, carry up)
>   * $2.5 \to 2$ (2 is an even number, round down!)
>   * $3.5 \to 4$ (4 is an even number, carry up)
>   * $4.5 \to 4$ (4 is an even number, round down!)
> * Statistically speaking, the chances of up and down are strictly equal at 50% each, and the systematic biases cancel each other out perfectly.


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Floating Point: IEEE 754 floating point number representation, rounding mechanism and numerical exceptions" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
