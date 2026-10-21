---
title: Lecture 36 · 排序 VI：基数排序进阶与排序大决战：最高有效位 MSD 基数排序、分治处理与全排序算法硬件级对比
description: CS61B 第 36 讲：排序 VI：基数排序进阶与排序大决战：最高有效位 MSD 基数排序、分治处理与全排序算法硬件级对比
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 36
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:32 ｜ **官方原版**：Lecture 36 - Sorting VI  Radix vs Comparison Sorting  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P36)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1wSTXwNB-D75VbHCtKqnr7QlOQtV-3wg6vTLNpNw7Qwk) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/36.-sorting-and-data-structures-conclusion)  
> **快速导航**：[← 上一讲 (P35 排序 V：基数排序与非比较排序)](/notes/cs61b/lecture-35) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P37 软件工程 IV：并发控制与线程安全) →](/notes/cs61b/lecture-37)

---

## 1. 最高有效位优先（MSD Radix Sort）原理

*(参考时间：00:02:15 · [视频跳转 (P36 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=135))*

LSD 要求所有输入字符串必须是严格定长的。而现实世界中的文本、网址和域名绝大多数是**变长字符串（Variable-length Strings）**。

为此我们引入**最高有效位优先（Most Significant Digit, MSD）基数排序**：
- 模仿字典词条检索的习惯，**从最左侧的最高有效位开始处理**；
- 按照首字符将所有单词划分到 $R$ 个不同的桶子中；
- **对每一个桶内部的子数组，递归地按照下一个字符位继续 MSD 细分**（典型的分治架构！）。

## 2. MSD 的提前决胜与小数组开销陷阱

*(参考时间：00:13:40 · [视频跳转 (P36 00:13:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=820))*

### MSD 的巨大优势：提前终止
对于两个首字母完全不同的单词（如 `"apple"` 与 `"zebra"`），在第一轮划分时它们就已经被分流到不同的桶中，后续的数千个字符位**完全无需再做任何多余比较**！

### MSD 的隐蔽陷阱：小数组递归爆炸
随着递归深入，产生海量只包含 1~2 个单词的微小桶。为每个微小桶重新分配大小为 $R$ 的计数数组会导致严重的内存分配开销。  
**工业级混合优化（Hybrid Sort）**：当子数组规模跌破阈值（如 $N \le 15$）时，立即切换为极度轻巧的**插入排序（Insertion Sort）**！

## 3. 理论复杂度 vs 硬件现实：为什么快排依然不可撼动

*(参考时间：00:26:10 · [视频跳转 (P36 00:26:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=1570))*

从渐进理论上看，基数排序是 $O(W \cdot N)$ 的线性时间，似乎应当把 $O(N \log N)$ 的快速排序按在地上摩擦。但在工业级现代硬件测试中，快速排序往往胜出，原因深植于计算机底层硬件架构：

1. **CPU 缓存局部性（Cache Locality）**：  
   快排的分区双指针在连续的物理内存块上单向滑行，能够最大化触发 CPU 硬件预取（Hardware Prefetching）和 L1/L2 高速缓存命中；而基数排序与哈希一样存在大量的离散内存跳跃写入；
2. **隐藏常数项系数**：  
   基数排序的系数包含 $W$ 次内存数组重新分配与频次累加，其内部循环指令开销远高于快速排序极其紧凑的两条寄存器比对指令。

## 4. 全排序算法终极大阅兵与选型决策树

*(参考时间：00:38:15 · [视频跳转 (P36 00:38:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=2295))*

| 排序算法 | 最好时间 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 | 核心主场应用场景 |
| :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **选择排序** | $\Theta(N^2)$ | $\Theta(N^2)$ | $\Theta(N^2)$ | $O(1)$ | 不稳定 | 教学原型，极小内存写入 |
| **插入排序** | **$\Theta(N)$** | $\Theta(N^2)$ | $\Theta(N^2)$ | $O(1)$ | **稳定** | **几乎有序数据**、微小数组（$N < 15$） |
| **归并排序** | $\Theta(N \log N)$ | $\Theta(N \log N)$ | $\Theta(N \log N)$ | $O(N)$ | **稳定** | **外排序**、需绝对稳定保障的对象排序 |
| **就地堆排序** | $\Theta(N)$ | $O(N \log N)$ | $O(N \log N)$ | **$O(1)$** | 不稳定 | 嵌入式系统、对内存极度敏感的场景 |
| **快速排序** | $\Theta(N \log N)$ | **$\Theta(N \log N)$** | $O(N^2)$ | $O(\log N)$ | 不稳定 | **通用内存排序王者**（CPU 缓存极佳） |
| **基数排序** | $\Theta(N)$ | $\Theta(W \cdot N)$ | $\Theta(W \cdot N)$ | $O(N + R)$ | **稳定** | 定长小字母表字符串、数字键 |

## 5. 本讲小结与排序篇终章

*(参考时间：00:46:50 · [视频跳转 (P36 00:46:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=2810))*

没有一种排序算法能在所有维度（时间、空间、稳定性、实现复杂度、硬件局部性）上统统称霸。工程的精髓正是在于深刻洞察现实业务数据的特征（数据量级、有序程度、键的类型、内存硬限制），为其挑选出最恰到好处的最优解！

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 V：基数排序与非比较排序](/notes/cs61b/lecture-35) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：软件工程 IV：并发控制与线程安全 →](/notes/cs61b/lecture-37) | [🎬 在 B 站观看本讲 (P36)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36) |
