---
title: Lecture 03 · Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱
description: CSAPP 第 3 讲：Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 3
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P3 ｜ **时长**：01:16:35  
> **所属模块**：Module 1: 信息的表示与处理 (Representing & Manipulating Information)（L02 - L04 · 整数表示、位运算与 IEEE 浮点数）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=3](https://www.bilibili.com/video/BV1iW411d7hd/?p=3)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 有符号数与无符号数的类型转换陷阱

*(参考时间：00:03:10 · [视频跳转 (P3 00:03:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=190))*

![有符号数与无符号数的类型转换陷阱 官方讲义图解](</attachments/csapp-72fe60df89a61c10a8b7be5a.png>)

在 C 语言中，当有符号整数与无符号整数进行比较或运算时，C 语言会**隐式将有符号数强制提升为无符号数**！
这种位模式不变、解释规则突变的特性会带来极其危险的反直觉行为：

| 表达式 | 比较类型 | 结果 | 背后原因 |
|---|---|---|---|
| `0 == 0U` | Unsigned | 1 (True) | 0 转换为 0U |
| `-1 < 0` | Signed | 1 (True) | 标准有符号比较 |
| `-1 < 0U` | **Unsigned** | **0 (False!)** | `-1` 的补码 `0xFFFFFFFF` 被解释为无符号数 $2^{32}-1 = 4294967296$，因而远大于 0！ |
| `2147483647 > -2147483647-1` | Signed | 1 (True) | $TMax > TMin$ |
| `2147483647U > -2147483647-1` | **Unsigned** | **0 (False!)** | 右侧转换为无符号数 $2147483648U$，比左侧大 1！ |

## 2. 位扩展与截断运算 (Sign Extension & Truncation)

*(参考时间：00:18:40 · [视频跳转 (P3 00:18:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=1120))*

![位扩展与截断运算 (Sign Extension & Truncation) 官方讲义图解](</attachments/csapp-e971f842c8f8fd9d9fe5159d.png>)

* **符号扩展（Sign Extension）**：将一个短位宽有符号数（如 `short`, 16 位）转换为长位宽（如 `int`, 32 位），只需将原本的最高符号位向高位复制填满。数学上可以严格证明，高位全部补填符号位后，新向量的补码数值与原数值完全相等。
* **截断（Truncation）**：将高位长整数强制转换为短整数（如 `int` 转 `short`），高位直接被丢弃。无符号数截断等价于模运算 $x \pmod{2^k}$；有符号数截断则在取模后重新按补码最高位解释正负号。

## 3. 补码加法与溢出判断

*(参考时间：00:32:15 · [视频跳转 (P3 00:32:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=1935))*

![补码加法与溢出判断 官方讲义图解](</attachments/csapp-664655c5ff7dbde2c2e459b8.png>)

两个 $w$ 位有符号整数相加时，理论和可能落在区间 $[-2^w, 2^w - 2]$ 内。由于结果必须截断为 $w$ 位：
* **正溢出（Positive Overflow）**：两个正数相加（$x > 0, y > 0$），结果却变为了负数（$s < 0$）。
* **负溢出（Negative Overflow）**：两个负数相加（$x < 0, y < 0$），结果却变为了正数（$s \ge 0$）。
* **合法区间**：一正一负相加绝不会发生溢出。

```c
/* 严谨检测有符号加法是否溢出的函数 */
int tadd_ok(int x, int y) {
    int sum = x + y;
    int neg_over = x < 0 && y < 0 && sum >= 0;
    int pos_over = x > 0 && y > 0 && sum < 0;
    return !neg_over && !pos_over;
}
```

## 4. 乘法优化：移位加法替代与除法偏置

*(参考时间：00:49:00 · [视频跳转 (P3 00:49:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=3&t=2940))*

![乘法优化：移位加法替代与除法偏置 官方讲义图解](</attachments/csapp-15dbc35120a32931c6110237.png>)

在早期和现代 CPU 中，整数乘法指令通常需要 3 甚至更多时钟周期，而移位加法仅需 1 个周期。现代编译器会自动将乘以常数转换为左移与加减法的组合：
* 乘以 14：$14 = 2^4 - 2^1$，代码 `x * 14` 会被编译为 `(x << 4) - (x << 1)`。
* 乘以 13：$13 = 2^3 + 2^2 + 2^0$，优化为 `(x << 3) + (x << 2) + x`。

有符号整数除以 2 的幂次采用算术右移时，由于整数除法规则是**向零舍入（Round toward Zero）**，负数直接右移会导致**向下舍入（Round down）**。因此必须加入偏置量（Bias）：
$$(x + (1 \ll k) - 1) \gg k$$
这样便保证了负数在移位截断时能够正确向零取整。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Bits, Bytes, and Integers cont：补码算术、符号扩展与转换陷阱」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
