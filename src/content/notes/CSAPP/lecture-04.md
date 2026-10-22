---
date: 2026-10-21
tags:
  - csapp
status: completed
publish: true
title: Lecture 04 · Floating Point：IEEE 754 浮点数表示、舍入机制与数值异常
description: CSAPP 第 4 讲：Floating Point：IEEE 754 浮点数表示、舍入机制与数值异常
topic: CSAPP
order: 4
updated: 2026-10-22
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P4 ｜ **时长**：01:11:33  
> **所属模块**：Module 1: 信息的表示与处理 (Representing & Manipulating Information)（L02 - L04 · 整数表示、位运算与 IEEE 浮点数）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=4](https://www.bilibili.com/video/BV1iW411d7hd/?p=4)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 定点表示的困境与浮点计数法的诞生

*(参考时间：00:02:15 · [视频跳转 (P4 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=135))*

![定点表示的困境与浮点计数法的诞生 官方讲义图解](</attachments/csapp-b10ab3b0b49a6a66e3f5eca3.png>)

如何用有限的二进制比特表示小数？
最原始的方案是**定点数（Fixed Point）**：固定小数点的位置。例如规定高 16 位表示整数部分，低 16 位表示小数部分。
定点数的致命缺陷在于动态范围极度狭窄：
* 它既无法表示极大的物理量（如阿伏伽德罗常数 $6.02 \times 10^{23}$）；
* 也无法表示极微小的原子尺度（如普朗克常数 $6.626 \times 10^{-34}$）。

为了兼顾浩瀚的动态范围与极高局部的有效精度，计算机借鉴了科学计数法，诞生了**浮点数（Floating Point）**：
让小数点根据指数大小自由“浮动”！
1985 年，由图灵奖得主 William Kahan 主导制定的 **IEEE 754 浮点标准** 成为全行业统一遵循的黄金标准。

## 2. IEEE 754 浮点数的三大核心构成字段

*(参考时间：00:11:40 · [视频跳转 (P4 00:11:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=700))*

![IEEE 754 浮点数的三大核心构成字段 官方讲义图解](</attachments/csapp-9987e6b6d5f351b24f8715e6.png>)

IEEE 754 将任意实数编码为三元组：
$$V = (-1)^s \times M \times 2^E$$

1. **符号位 (Sign, $s$)**：1 比特。$s = 1$ 表示负数，$s = 0$ 表示正数。
2. **阶码字段 (Exponent, $exp$)**：$k$ 比特。编码指数 $E$。
3. **小数字段 (Fraction/Mantissa, $frac$)**：$n$ 比特。编码尾数有效值 $M$。

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

## 3. 规格化数 (Normalized) 与隐藏位设计 (Implicit Leading 1)

*(参考时间：00:22:30 · [视频跳转 (P4 00:22:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=1350))*

![规格化数 (Normalized) 与隐藏位设计 (Implicit Leading 1) 官方讲义图解](</attachments/csapp-6bf57cfaec526143c4663c90.png>)

当阶码字段不全为 0 且不全为 1 时（$0 < exp < 2^k - 1$），属于**规格化数**：

1. **偏置指数（Biased Exponent）**：
   指数 $E$ 不采用补码，而是采用偏置码：
   $$E = exp - Bias \quad \text{其中 } Bias = 2^{k-1} - 1$$
   * 单精度 float ($k = 8$)：$Bias = 127$，$exp \in [1, 254]$，实际指数 $E \in [-126, 127]$；
   * 双精度 double ($k = 11$)：$Bias = 1023$，$exp \in [1, 2046]$，实际指数 $E \in [-1022, 1023]$。
   * **为什么采用偏置码？** 使得指数全为正数表示，硬件可以直接用纯无符号比较器极速对比两个浮点数的大小，无需做昂贵的补码转换！

2. **隐含前导 1（Implicit Leading 1）**：
   尾数 $M$ 的数学定义为：
   $$M = 1.f = 1 + f = 1 + \sum_{i=1}^n frac_i 2^{-i}$$
   在二进制科学计数法中，规格化数的最高有效位一定是 1（如 $1.011_2 \times 2^3$）。既然永远是 1，那就**干脆不把它保存在物理内存中**！
   这让原本 23 位的单精度物理字段免费白赚了 24 位的精度表现力。

## 4. 非规格化数 (Denormalized) 与逐渐下溢设计 (Gradual Underflow)

*(参考时间：00:35:15 · [视频跳转 (P4 00:35:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=2115))*

![非规格化数 (Denormalized) 与逐渐下溢设计 (Gradual Underflow) 官方讲义图解](</attachments/csapp-e841502f0924b31d48a3c327.png>)

当阶码字段全为 0 时（$exp = 0$），属于**非规格化数**。IEEE 754 在这里展现了令人拍案叫绝的数学精妙：
* **指数规定为**：$E = 1 - Bias$（**注意：绝不是 $0 - Bias$！**）；
* **尾数无前导 1**：$M = 0.f$。

两大神圣使命：
1. **精确表示数值 $0.0$**：
   * 当 $s = 0, exp = 0, frac = 0$ 时，表示 $+0.0$；
   * 当 $s = 1, exp = 0, frac = 0$ 时，表示 $-0.0$。
2. **实现数值平滑过渡（Gradual Underflow）**：
   * 最大非规格化数：$exp = 0, frac = 11\dots1 \implies M = 1 - 2^{-n}, E = 1 - Bias$；
   * 最小规格化数：$exp = 1, frac = 00\dots0 \implies M = 1.0, E = 1 - Bias$；
   因为非规格化数的指数设计为 $1 - Bias$，两者的间距严丝合缝完全一致！彻底根除了早期浮点系统中数值一旦小于下限就瞬间跳变为 0 的毁灭性截断阶跃。

## 5. 特殊值：正负无穷大 (Infinity) 与非数 (NaN)

*(参考时间：00:46:10 · [视频跳转 (P4 00:46:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=2770))*

![特殊值：正负无穷大 (Infinity) 与非数 (NaN) 官方讲义图解](</attachments/csapp-d83ab6671ae27ff9f9f824ad.png>)

当阶码字段全为 1 时（$exp = 255$ 或 $2047$）：
* **无穷大（Infinity, $\pm\infty$）**：若 $frac = 0$。
  * 当计算结果溢出（例如被零除 $1.0 / 0.0 = +\infty$），浮点数不会像整型除以零那样引发硬件崩溃，而是优雅输出 $\infty$；
  * 参与后续运算保持数学正确性：$1.0 / \infty = 0.0$。
* **非数（NaN, Not a Number）**：若 $frac \ne 0$。
  * 当遇到没有数学定义的非法运算时产生：如 $\sqrt{-1.0}$、$\infty - \infty$、$0.0 / 0.0$；
  * **NaN 具备传染性**：任何包含 NaN 的算术运算结果永远是 NaN；
  * **NaN 的独特属性**：`NaN == NaN` 结果永远为假（False）！在代码中判断一个浮点数是否是 NaN 的经典写法就是 `if (x != x)`。

## 6. 浮点舍入法则：向偶数舍入 (Round-to-Even) 消除系统累积偏差

*(参考时间：00:58:30 · [视频跳转 (P4 00:58:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=3510))*

![浮点舍入法则：向偶数舍入 (Round-to-Even) 消除系统累积偏差 官方讲义图解](</attachments/csapp-ba86f37125003a15ada6f05d.png>)

当实际计算出的无限实数无法放入有限尾数字段时，必须执行舍入（Rounding）。IEEE 754 规定了 4 种舍入模式：
1. 向零舍入（Round toward Zero）
2. 向下舍入（Round toward $-\infty$）
3. 向上舍入（Round toward $+\infty$）
4. **向偶数舍入（Round-to-Even / Nearest Even，默认黄金法则）**

> **为什么日常的“四舍五入”在计算机科学中被弃用？**
> 考虑一组包含大量以 `.5` 结尾的测量数据。若全部向上进位，在进行数百万次物理碰撞模拟或金融计算累加时，统计总和将产生严重的系统性向上漂移！
> **向偶数舍入规则**：
> * 只有当数值恰好处于两个可能结果正中间的一半（Halfway）时，才触发该规则：
> * **保证舍入后的最低有效数字是偶数（最低比特位是 0）**！
> * 示例（十进制舍入到整数）：
>   * $1.5 \to 2$（2 是偶数，向上进位）
>   * $2.5 \to 2$（2 是偶数，向下舍去！）
>   * $3.5 \to 4$（4 是偶数，向上进位）
>   * $4.5 \to 4$（4 是偶数，向下舍去！）
> * 在统计学上，向上与向下的几率严格均等各占 50%，系统偏差被完美相互抵消。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Floating Point：IEEE 754 浮点数表示、舍入机制与数值异常」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
