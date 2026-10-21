---
title: Lecture 33 · 排序 IV：比较排序的理论下界证明：决策树模型、全排列与树高对数、Omega(N log N) 理论极限
description: CS61B 第 33 讲：排序 IV：比较排序的理论下界证明：决策树模型、全排列与树高对数、Omega(N log N) 理论极限
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 33
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:52 ｜ **官方原版**：Lecture 33 - Sorting IV： Theoretical Bounds  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P33)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1sqpg9sM-0719KGcWzYmmrWlj0azaafgIAiM8U98jKi4/edit) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/34.-sorting-and-algorithmic-bounds)  
> **快速导航**：[← 上一讲 (P32 排序 III：快速排序与分区机制)](/notes/cs61b/lecture-32) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P34 软件工程 III：技术伦理与经典设计模式) →](/notes/cs61b/lecture-34)

---

## 1. 世纪之问：我们还能发明更快的比较排序算法吗？

*(参考时间：00:02:15 · [视频跳转 (P33 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=135))*

回顾我们学过的所有基于两两比较的排序算法：
- 归并排序：最坏 $\Theta(N \log N)$；
- 堆排序：最坏 $\Theta(N \log N)$；
- 快速排序：平均 $\Theta(N \log N)$。

无论计算机科学家多么绞尽脑汁，基于比较的排序算法似乎都被一堵无形的“厚墙”死死阻挡在 $N \log N$ 之外。这究竟是人类算法设计者的智慧局限，还是自然界底层的数学物理法则所决定的极限？

## 2. 决策树模型（Decision Tree Model）

*(参考时间：00:13:20 · [视频跳转 (P33 00:13:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=800))*

为了证明一切潜在算法的极限，我们必须构建一个能够涵盖所有比较排序算法的抽象数学模型——**决策树（Decision Tree）**。

在任何基于比较的排序算法中：
- 算法的每次执行，本质上都是一次“比较两个元素大小”的二选一分支判断（$A_i < A_j$？）；
- 判定结果只有两种：是（走左分支）或 否（走右分支）；
- 最终，算法必须得出这组输入元素的**唯一合法排列顺序**。

因此，**任何比较排序算法在数学上都可以等价映射为一棵巨大的二叉决策树！**
- 树的每一个内部节点代表一次比对操作；
- 树的每一片叶子节点代表一种最终输出的有序排列。

## 3. 叶子节点总数：输入的全排列 N!

*(参考时间：00:25:10 · [视频跳转 (P33 00:25:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=1510))*

对于包含 $N$ 个不同元素的数组，其潜在的初始无序状态共有多少种可能？  
答案是全部的可能排列数：**$N!$（$N$ 的阶乘）**！

为了保证算法在面对任意输入时都能给出绝对正确的有序结果：
> **决策树上的叶子节点总数 $L$，必须绝对不少于所有的潜在全排列数！**  
> $$L \ge N!$$

如果叶子数少于 $N!$，根据鸽巢原理，必然至少存在两种不同的输入排列被误导进了同一片叶子，导致算法输出错误的排序结果！

## 4. 树高下界的数学证明：Omega(N log N)

*(参考时间：00:36:30 · [视频跳转 (P33 00:36:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=2190))*

算法在最坏情况下执行的比较次数，正好等于**从根节点走到最深叶子节点的路径长度，即决策树的高度 $h$！**

**推导过程**：
1. 一棵高度为 $h$ 的二叉树，最多能容纳的叶子节点数为 $2^h$；
2. 结合叶子总数约束，得不等式：  
   $$2^h \ge L \ge N!$$
3. 两边同时取以 2 为底的对数：  
   $$h \ge \log_2(N!)$$
4. 展开阶乘的对数和：  
   $$\log_2(N!) = \log 1 + \log 2 + \dots + \log N$$
   根据数学积分放缩或斯特林公式（Stirling's Approximation）：  
   $$\log_2(N!) \ge \frac{N}{2} \log_2\left(\frac{N}{2}\right) = \Omega(N \log N)$$

**伟大的数学铁律**：  
**任何基于比较的排序算法，在最坏情况下的比较次数至少是 $\Omega(N \log N)$！没有任何人能够打破这个宇宙物理定律！**

## 5. 本讲小结与超越极限的唯二生路

*(参考时间：00:46:15 · [视频跳转 (P33 00:46:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=2775))*

- 归并排序和堆排序在最坏情况下的耗时为 $O(N \log N)$，由于下界也是 $\Omega(N \log N)$，因此它们在渐进复杂度意义上已经是**渐进最优（Asymptotically Optimal）算法**！
- 如果我们未来想要打破 $N \log N$ 的壁垒，**唯一的办法就是彻底打破“基于元素两两比较”的前提假设！** 这直接催生了下一讲震撼登场的非比较排序——基数排序！

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 III：快速排序与分区机制](/notes/cs61b/lecture-32) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：软件工程 III：技术伦理与经典设计模式 →](/notes/cs61b/lecture-34) | [🎬 在 B 站观看本讲 (P33)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33) |
