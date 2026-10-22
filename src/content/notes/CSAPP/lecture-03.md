---
date: 2026-10-21
tags:
  - csapp
status: completed
publish: true
title: Lecture 03 · Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱
description: CSAPP 第 3 讲：Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱
topic: CSAPP
order: 3
updated: 2026-10-22
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P3 ｜ **时长**：01:16:35  
> **所属模块**：Module 1: 信息的表示与处理 (Representing & Manipulating Information)（L02 - L04 · 整数表示、位运算与 IEEE 浮点数）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=3](https://www.bilibili.com/video/BV1iW411d7hd/?p=3)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 有符号数与无符号数的类型转换底层机制：位模式守恒律

*(参考时间：00:02:40 · [视频跳转 (P3 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=160))*

![有符号数与无符号数的类型转换底层机制：位模式守恒律 官方讲义图解](</attachments/csapp-b2fc675fc43bab72943a4931.png>)

在 C 语言中，有符号数（`int`）与无符号数（`unsigned int`）之间可以自由发生显式或隐式类型转换。
必须牢记底层硬件的第一铁律：**强制类型转换绝不改变物理内存中的任何一个比特位（位模式守恒）**！
转换改变的，仅仅是**编译器对这串二进制位模式的数学解读方式**。

设 $w$ 位向量 $\vec{x}$：
* 从补码转为无符号数：$T2U_w(x) = B2U_w(T2B_w(x))$
* 数学推导：
  $$T2U_w(x) = \begin{cases} x, & x \ge 0 \\ x + 2^w, & x < 0 \end{cases}$$
当一个负数（$x < 0$）被强转为无符号数时，它加上了 $2^w$。例如在 32 位下：
$$-1 \implies -1 + 2^{32} = 4,294,967,295 \quad (0\text{xFFFFFFFF})$$
从无符号数转为补码则是其逆运算 $U2T_w(u)$：大于 $TMax$ 的无符号数在转换后直接变成了负数。

## 2. C 语言中隐式类型提升的巨大陷阱 (The Signed-Unsigned Comparison Trap)

*(参考时间：00:14:20 · [视频跳转 (P3 00:14:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=860))*

![C 语言中隐式类型提升的巨大陷阱 (The Signed-Unsigned Comparison Trap) 官方讲义图解](</attachments/csapp-72fe60df89a61c10a8b7be5a.png>)

C 语言的一条隐秘规则：**当一个操作符的两个操作数一个是有符号数、一个是无符号数时，C 语言会隐式将有符号数强制转换为无符号数，并执行纯无符号运算！**

这导致了一连串极其违背人类数学常理的代码陷阱：

```c
int i = -1;
unsigned int u = 0;
if (i < u) {
    printf("符合直觉: -1 < 0\n");
} else {
    printf("震惊发现: -1 >= 0U !\n"); /* 实际执行该分支！ */
}
```
**原因剖析**：由于右侧是 `0U`，C 编译器悄悄将左侧的 `-1` 提升为 `unsigned int`，其位模式 `0xFFFFFFFF` 变成了 $4294967295$！因此 $4294967295 < 0$ 判定为假。

在真实开源工业代码中，这一陷阱曾引发重大安全漏洞。例如标准库的 `strlen()` 函数返回类型是 `size_t`（无符号整数）：
```c
/* 致命的代码示例：比较两个字符串长度差 */
int str_longer(char *s, char *t) {
    return strlen(s) - strlen(t) > 0;
}
```
若 `s` 长度为 3，`t` 长度为 5，两个无符号数相减 $3 - 5$ 发生下溢，产生极大的正数 $2^{64}-2$，表达式永远返回真（True）！
正确的写法应当是 `strlen(s) > strlen(t)`。

## 3. 符号扩展 (Sign Extension) 与截断 (Truncation)

*(参考时间：00:27:10 · [视频跳转 (P3 00:27:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=1630))*

![符号扩展 (Sign Extension) 与截断 (Truncation) 官方讲义图解](</attachments/csapp-e971f842c8f8fd9d9fe5159d.png>)

#### 1. 符号扩展（小宽转大宽）
当把一个短整数（如 16 位 `short`）转换为长整数（如 32 位 `int`）时：
* **无符号数（零扩展 Zero Extension）**：高位全部填 `0`；
* **补码有符号数（符号扩展 Sign Extension）**：将原数字的最高有效位（符号位）向高位复制填满。

*严密数学证明*：
假设我们要把一个 $w$ 位向量扩展为 $w+1$ 位，复制最高位 $x_{w-1}$ 作为新最高位：
$$B2T_{w+1}([x_{w-1}, x_{w-1}, x_{w-2}, \dots, x_0]) = -x_{w-1} 2^w + x_{w-1} 2^{w-1} + \sum_{i=0}^{w-2} x_i 2^i$$
由于 $-x_{w-1} 2^w + x_{w-1} 2^{w-1} = -x_{w-1} 2^{w-1}$，新权值求和完全等价于原数值 $B2T_w(\vec{x})$！无论是正数还是负数，数值保持绝对不变。

#### 2. 截断运算（大宽转小宽）
当把一个 32 位 `int` 强制强转为 16 位 `short` 时，高 16 位被简单粗暴地直接抛弃。
* 无符号数截断等价于求模：$x \pmod{2^k}$；
* 有符号数截断则在保留低 $k$ 位后，重新将低 $k$ 位的最高位作为符号位重新进行补码解释，可能导致原本的正数瞬间变负数。

## 4. 补码加法与溢出检测判据 (Two's Complement Addition)

*(参考时间：00:39:45 · [视频跳转 (P3 00:39:45)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=2385))*

![补码加法与溢出检测判据 (Two's Complement Addition) 官方讲义图解](</attachments/csapp-664655c5ff7dbde2c2e459b8.png>)

设两个 $w$ 位有符号整数 $x, y \in [-2^{w-1}, 2^{w-1}-1]$，其实际代数和满足：
$$-2^w \le x + y \le 2^w - 2$$
将两数按二进制相加后丢弃第 $w+1$ 位进位，得到硬件计算结果 $x +^t_w y$：

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

编写高质量底层库时，必须精准捕获加法溢出：
```c
/* 工业级安全检测有符号加法是否溢出 */
int tadd_ok(int x, int y) {
    int sum = x + y;
    int neg_over = (x < 0) && (y < 0) && (sum >= 0);
    int pos_over = (x > 0) && (y > 0) && (sum < 0);
    return !neg_over && !pos_over;
}
```

## 5. 乘法优化与除法算术右移的偏置量 (Multiplication & Shift)

*(参考时间：00:52:15 · [视频跳转 (P3 00:52:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=3135))*

![乘法优化与除法算术右移的偏置量 (Multiplication & Shift) 官方讲义图解](</attachments/csapp-15dbc35120a32931c6110237.png>)

#### 1. 移位加法替代高开销乘法
在处理器指令周期表中，整数加减法只需 1 个时钟周期，而整数乘法指令 `imull` 往往需要 3~5 个时钟周期。GCC 编译器在优化 `-O2` 下会自动将乘常数替换为移位：
* 乘以 14：$14 = 2^4 - 2^1$，代码 `x * 14` 会被编译为 `(x << 4) - (x << 1)`；
* 乘以 31：$31 = 2^5 - 1$，编译为 `(x << 5) - x`。

#### 2. 有符号除以 $2^k$ 的偏置量（Biasing）神来之笔
无符号整数除以 $2^k$ 可以直接逻辑右移 $k$ 位（即 $\lfloor x / 2^k \rfloor$）。
但对于有符号负数，C 语言标准规定整数除法必须**向零舍入（Round toward Zero）**（例如 $-3 / 2 = -1$）。
如果我们直接对负数执行算术右移：
$$-3 \text{ 的补码} = 11111101_2 \xrightarrow{\text{算术右移 1 位}} 11111110_2 = -2 \quad (\text{向下舍入，错误！})$$

为了让算术右移也能正确实现向零舍入，必须在右移前加入**偏置量（Bias = $2^k - 1$）**：
$$(x + (1 \ll k) - 1) \gg k$$
以 $-3$ 除以 2 为例（$k = 1$, Bias = 1）：
$$(-3 + 1) \gg 1 = -2 \gg 1 = -1 \quad (\text{完全正确！})$$
编译器在翻译负数除以 2 的幂时，都会自动注入两行指令：利用符号位产生偏置并加到原数上，再执行算术右移。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
