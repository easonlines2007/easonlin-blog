---
title: Lecture 02 · Bits, Bytes, and Integers：位运算、字节级表示与整数编码
description: CSAPP 第 2 讲：Bits, Bytes, and Integers：位运算、字节级表示与整数编码
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 2
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P2 ｜ **时长**：01:11:05  
> **所属模块**：Module 1: 信息的表示与处理 (Representing & Manipulating Information)（L02 - L04 · 整数表示、位运算与 IEEE 浮点数）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=2](https://www.bilibili.com/video/BV1iW411d7hd/?p=2)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 信息的存储基石：字节与十六进制编码

*(参考时间：00:02:40 · [视频跳转 (P2 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=160))*

![信息的存储基石：字节与十六进制编码 官方讲义图解](</attachments/csapp-397a4d6bef9dcdb21fe165e8.png>)

现代计算机系统以**字节（Byte，8 个比特位）**作为最小的可寻址内存单元。一个字节能够表示 $2^8 = 256$ 个不同的离散值（二进制从 `00000000` 到 `11111111`）。

在阅读机器级程序和内存转储时，二进制过于冗长，而十进制无法直接反映底层的位模式。因此，系统编程广泛采用**十六进制（Hexadecimal）**。每个十六进制字符（`0` - `9` 以及 `A` - `F`）恰好对应 4 个比特（半字节，Nibble）：
* `0x0` = `0000`, `0x7` = `0111`, `0xA` = `1010`, `0xF` = `1111`
* 两个十六进制字符恰好拼成一个完整的 8 位字节。

## 2. C 语言中的位级运算 vs 逻辑运算

*(参考时间：00:15:20 · [视频跳转 (P2 00:15:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=920))*

![C 语言中的位级运算 vs 逻辑运算 官方讲义图解](</attachments/csapp-778c71ddb414f9c34d910df0.png>)

C 语言明确区分了两套布尔操作：
1. **位级运算（Bit-level Operations）**：`&` (AND), `|` (OR), `~` (NOT), `^` (XOR)。作用于操作数的每一个对应比特位。例如 `~0x41` 等于 `0xBE`。
2. **逻辑运算（Logical Operations）**：`&&`, `||`, `!`。将任意非零值视为真（TRUE/1），零视为假（FALSE/0）。逻辑运算具备**短路求值（Short-circuit evaluation）**特性，若第一个操作数已能确定结果，绝不执行第二个表达式。

> **经典位运算技巧：异或交换律**
> 任何数与自身异或为 0（$x \oplus x = 0$），任何数与 0 异或为其自身（$x \oplus 0 = x$）。利用这一性质，无需临时变量即可原地交换两数：
> ```c
> void inplace_swap(int *x, int *y) {
>     *y = *x ^ *y; // step 1
>     *x = *x ^ *y; // step 2
>     *y = *x ^ *y; // step 3
> }
> ```

## 3. 移位运算：逻辑移位 vs 算术移位

*(参考时间：00:28:40 · [视频跳转 (P2 00:28:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=1720))*

![移位运算：逻辑移位 vs 算术移位 官方讲义图解](</attachments/csapp-6bef512916518d195b03feee.png>)

位移运算将二进制位向左或向右平移：
* **左移运算 `x << k`**：所有位向左移动 $k$ 位，右侧补填 $k$ 个 0。左移 $k$ 位等价于乘以 $2^k$。
* **右移运算 `x >> k`** 存在两种截然不同的策略：
  1. **逻辑右移（Logical Shift）**：左侧最高位补 0。通常用于**无符号数（Unsigned）**。
  2. **算术右移（Arithmetic Shift）**：左侧最高位补充**符号位的副本（Sign Bit Replication）**。若最高位是 1 则补 1，是 0 则补 0。通常用于**有符号数（Signed）**，以保持数值的负号正确性。

```c
// 假设 8 位数：
unsigned char u = 0xC4; // 11000100
u >> 2;                 // 逻辑右移：00110001 (0x31)

signed char s = 0xC4;   // 11000100 (负数)
s >> 2;                 // 算术右移：11110001 (0xF1，保持负数)
```

## 4. 整数编码体系：无符号编码 (B2U) 与补码编码 (B2T)

*(参考时间：00:41:10 · [视频跳转 (P2 00:41:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=2&t=2470))*

![整数编码体系：无符号编码 (B2U) 与补码编码 (B2T) 官方讲义图解](</attachments/csapp-12ae8a8b09d1859c4ed1f0b7.png>)

对于一个 $w$ 位的二进制向量 $\vec{x} = [x_{w-1}, x_{w-2}, \dots, x_0]$：
* **无符号编码（Binary to Unsigned, B2U）**：
$$B2U_w(\vec{x}) = \sum_{i=0}^{w-1} x_i 2^i$$
取值范围从 $UMin = 0$ 到 $UMax = 2^w - 1$。

* **补码编码（Binary to Two's Complement, B2T）**：
将最高有效位 $x_{w-1}$ 赋予**负权重** $-2^{w-1}$：
$$B2T_w(\vec{x}) = -x_{w-1} 2^{w-1} + \sum_{i=0}^{w-2} x_i 2^i$$
取值范围从 $TMin = -2^{w-1}$ 到 $TMax = 2^{w-1} - 1$。

> **核心观察与不对称性**：
> 补码表示中，负数范围比正数范围多一个：$|TMin| = TMax + 1$。因为 $0$ 占用了非负数的一个编码位（最高位为 0 且其余全为 0）。例如对于 16 位整数，$TMin = -32768$，$TMax = 32767$。这一不对称性是无数底层安全溢出漏洞的根源。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Bits, Bytes, and Integers：位运算、字节级表示与整数编码」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
