---
title: Lecture 04 · Floating Point：IEEE 754 浮点数表示与舍入机制
description: CSAPP 第 4 讲：Floating Point：IEEE 754 浮点数表示与舍入机制
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 4
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P4 ｜ **时长**：01:11:33  
> **所属模块**：Module 1: 信息的表示与处理 (Representing & Manipulating Information)（L02 - L04 · 整数表示、位运算与 IEEE 浮点数）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=4](https://www.bilibili.com/video/BV1iW411d7hd/?p=4)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 定点数的局限与 IEEE 754 浮点标准

*(参考时间：00:02:15 · [视频跳转 (P4 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=135))*

![定点数的局限与 IEEE 754 浮点标准 官方讲义图解](</attachments/csapp-b10ab3b0b49a6a66e3f5eca3.png>)

二进制小数可以表示为形如 $b_m b_{m-1} \dots b_0 . b_{-1} b_{-2} \dots b_{-n}$ 的形式，其数值为 $\sum_{i=-n}^m b_i 2^i$。例如 $101.11_2 = 4 + 1 + 0.5 + 0.25 = 5.75$。
但固定小数点的表示法无法兼顾极大值（如光速 $3 \times 10^8$）与极小值（如电子电荷 $1.6 \times 10^{-19}$）。

为此，1985 年 IEEE 推出了 754 浮点数标准，成为全行业统一的规范。浮点数采用科学计数法形式表示：
$$V = (-1)^s \times M \times 2^E$$
1. **符号位 (Sign, $s$)**：1 表示负数，0 表示正数。
2. **阶码字段 (Exponent, $exp$)**：编码指数 $E$（单精度 8 位，双精度 11 位）。
3. **小数字段 (Fraction/Mantissa, $frac$)**：编码尾数有效值 $M$（单精度 23 位，双精度 52 位）。

## 2. 规格化数 vs 非规格化数：平滑过渡的设计智慧

*(参考时间：00:18:30 · [视频跳转 (P4 00:18:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=1110))*

![规格化数 vs 非规格化数：平滑过渡的设计智慧 官方讲义图解](</attachments/csapp-6bf57cfaec526143c4663c90.png>)

IEEE 754 根据阶码字段 $exp$ 的位模式划分出三种不同的数值形态：
1. **规格化数（Normalized Values, $exp \ne 0$ 且 $exp \ne 255$）**：
   * 指数采用**偏置码（Biased Exponent）**：$E = exp - Bias$，其中 $Bias = 2^{k-1} - 1$（单精度 127，双精度 1023）。
   * 尾数采用**隐含前导 1（Implicit Leading 1）**：$M = 1.f$。无需显式存储开头的 1，白白免费赚到了 1 个比特的高精度！

2. **非规格化数（Denormalized Values, $exp = 0$）**：
   * 指数固定为 $E = 1 - Bias$（而不是 $-Bias$！这一精妙的 $+1$ 确保了非规格化数与最小规格化数之间的**无缝平滑衔接**）。
   * 尾数无隐含前导 1：$M = 0.f$。
   * 用途：表示 $+0.0$ 与 $-0.0$；同时实现**逐渐下溢（Gradual Underflow）**，让接近 0 的极小数均匀分布。

## 3. 特殊值：无穷大 (Infinity) 与非数 (NaN)

*(参考时间：00:31:00 · [视频跳转 (P4 00:31:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=1860))*

![特殊值：无穷大 (Infinity) 与非数 (NaN) 官方讲义图解](</attachments/csapp-d83ab6671ae27ff9f9f824ad.png>)

当阶码字段全为 1（$exp = 255$ 或 $2047$）时：
* 若 $frac$ 全为 0：表示**正负无穷大（$+\infty, -\infty$）**。当运算发生溢出（如被零除 $1.0 / 0.0$）时产生。
* 若 $frac$ 不全为 0：表示**非数（NaN, Not a Number）**。当遇到无意义非法数学运算（如 $\sqrt{-1}$、$\infty - \infty$）时产生。

## 4. 舍入规则：向偶数舍入 (Round-to-Even) 消除系统偏差

*(参考时间：00:46:15 · [视频跳转 (P4 00:46:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=4&t=2775))*

![舍入规则：向偶数舍入 (Round-to-Even) 消除系统偏差 官方讲义图解](</attachments/csapp-ba86f37125003a15ada6f05d.png>)

当有限位宽无法精确保存实数时必须进行舍入。IEEE 754 规定了 4 种舍入策略，其中默认是**向偶数舍入（Round-to-even / Nearest Even）**：
* 只有当数值恰好落在两个可选代表值的正中间一半处时，才看最后一位：使舍入后的最低有效位为 0（偶数）。
* **为何不采用简单“四舍五入”？** 在大量统计金融计算中，四舍五入会导致整体均值向上系统性漂移；向偶数舍入有 50% 向上进位、50% 向下舍弃，完美抵消了累积系统统计误差！


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Floating Point：IEEE 754 浮点数表示与舍入机制」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
