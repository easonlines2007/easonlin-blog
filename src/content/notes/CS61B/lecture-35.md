---
title: Lecture 35 · 排序 V：基数排序与非比较排序：绕过下界的秘诀、计数排序原理与最低有效位 LSD 基数排序
description: CS61B 第 35 讲：排序 V：基数排序与非比较排序：绕过下界的秘诀、计数排序原理与最低有效位 LSD 基数排序
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 35
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:18 ｜ **官方原版**：Lecture 35. Sorting V - More Quicksort Radix Sorts  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/14jNEZC-YKUuxIr3Cxsvz1Kb6eX0jCjvjevb1zD8NRj4) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/35.-radix-sorts)  
> **快速导航**：[← 上一讲 (P34 软件工程 III：技术伦理与经典设计模式)](/notes/cs61b/lecture-34) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P36 排序 VI：基数排序进阶与排序大决战) →](/notes/cs61b/lecture-36)

---

## 1. 绕过理论下界：放弃元素两两比较！

*(参考时间：00:02:15 · [视频跳转 (P35 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=135))*

在 Lecture 33 中，我们严密证明了任何基于比较的排序算法都无法打破 $\Omega(N \log N)$ 的铁律。

**关键破局点**：那个数学证明的前提是“**算法只能通过比较两个元素的大小来获取信息**”。  
如果我们将待排数据的物理结构（例如字符串是由单个字符组成，数字是由十进制数位组成）纳入考量，**直接根据数据的每一位特征进行散列分配，就能彻底推翻比较模型，实现奇迹般的线性时间排序！**

## 2. 计数排序（Counting Sort）：数组作为桶

*(参考时间：00:13:30 · [视频跳转 (P35 00:13:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=810))*

假设我们要对一组取值范围在 $[0, R-1]$ 之间的小整数进行排序（如考试分数 $0 \sim 100$）：

1. **统计频次**：开辟一个大小为 $R$ 的计数数组 `count[]`，扫描一遍输入，统计每个数值出现的次数；
2. **计算索引累加和**：将 `count[]` 转化为前缀累加和，由此精准推算出每个数值在最终有序数组中的起始落点区间；
3. **回写数据**：倒序扫描原数组，根据 `count[]` 计算出的落点直接将元素放入输出数组！

```java
// 核心复杂度分析
// 统计耗时 O(N)，累加和耗时 O(R)，输出耗时 O(N)
// 总时间复杂度为绝对的线性时间：Theta(N + R)！
```

## 3. 最低有效位优先（LSD Radix Sort）算法

*(参考时间：00:25:40 · [视频跳转 (P35 00:25:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=1540))*

如果数据取值范围很大（例如 32 位整数或超长字符串），直接开辟巨大的计数数组是不可能的。  
**最低有效位优先（Least Significant Digit, LSD）基数排序**展示了极其迷人的数学巧思：

> **算法流程**：  
> 假设所有字符串长度均为定长 $W$。  
> **从最右侧的最低有效位（个位）开始，自右向左，对每一位分别执行一次稳定的计数排序！**  
> 依次处理完所有 $W$ 个字符位后，整个数组奇迹般地达到完全有序！

## 4. 为什么必须依赖稳定性（Stability）？

*(参考时间：00:36:20 · [视频跳转 (P35 00:36:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2180))*

LSD 排序能成功的核心数学支柱在于**基步骤的排序算法必须是绝对稳定的（Stable）**！

**直觉验证**：
假设当前正在对第 1 位（十位）进行排序。如果两个单词在十位上的字母相同，**由于计数排序具有稳定性，它们在处理个位时所排出的先后顺序将被原汁原味地保留下来！**  
随着扫描向高位推进，高位的比较具有最高决定权，而低位相同的元素依然保持着之前比较出的次序。如果底层计数排序不稳定，之前的低位排序成果将被彻底打乱！

## 5. 本讲小结与 LSD 运行复杂度

*(参考时间：00:46:15 · [视频跳转 (P35 00:46:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2775))*

- **总时间复杂度**：共有 $W$ 个字符位，每一位执行一次耗时 $O(N + R)$ 的计数排序，总时间为：
  $$\Theta(W \cdot (N + R))$$
- 当字符串长度 $W$ 相对较小（为常数），且字符集大小 $R$ 不大时，LSD 基数排序的实际耗时**与数据规模 $N$ 严格成线性比例！直接超越一切比较排序！**

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：软件工程 III：技术伦理与经典设计模式](/notes/cs61b/lecture-34) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 VI：基数排序进阶与排序大决战 →](/notes/cs61b/lecture-36) | [🎬 在 B 站观看本讲 (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) |
