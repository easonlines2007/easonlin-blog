---
title: Lecture 32 · 排序 III：快速排序与分区机制：Tony Hoare 的天才设计、Lomuto 与 Hoare 分区、最坏退化与三向切分
description: CS61B 第 32 讲：排序 III：快速排序与分区机制：Tony Hoare 的天才设计、Lomuto 与 Hoare 分区、最坏退化与三向切分
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 32
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:45 ｜ **官方原版**：Lecture 32 - Sorting III： Quicksort  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/11vRyW0ZPrsxUhRHCBgkygy01PlL1amB66n9FZQN03wo) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/32.-more-quick-sort-sorting-summary)  
> **快速导航**：[← 上一讲 (P31 软件工程 II：API 设计与防御性编程)](/notes/cs61b/lecture-31) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P33 排序 IV：比较排序的理论下界证明) →](/notes/cs61b/lecture-33)

---

## 1. 快速排序的核心哲学：基于分区的分治

*(参考时间：00:02:15 · [视频跳转 (P32 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=135))*

快速排序（Quicksort）由图灵奖得主 Tony Hoare 于 1959 年发明，被誉为 20 世纪最伟大的十大算法之一。

与归并排序“先分、再治、最后辛苦合并”的流派截然相反，**快速排序把全部智慧都倾注在前面的“分区（Partitioning）”阶段**：
1. **挑基准（Pivot）**：从数组中挑选一个元素作为基准元；
2. **就地分区（Partition）**：重新排列数组，将所有**小于等于基准元的元素挪到左边**，所有**大于等于基准元的元素挪到右边**，基准元本身精准归位！
3. **递归征战**：对左右两个独立子区间分别递归执行快速排序，**当递归结束时，无需任何额外的合并操作，整张数组天然已经绝对有序！**

## 2. 经典分区算法：Hoare 双指针双向夹击

*(参考时间：00:13:30 · [视频跳转 (P32 00:13:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=810))*

Hoare 提出的双指针分区法是原地分区的极致典范：
- 设最左端元素为基准元 `pivot = a[lo]`；
- 左指针 `i` 从左向右扫描，寻找**大于等于**基准元的元素；
- 右指针 `j` 从右向左扫描，寻找**小于等于**基准元的元素；
- 交换 `a[i]` 与 `a[j]`，继续扫描直至两指针相遇；
- 最后将基准元与 `a[j]` 交换，分区大功告成！

```mermaid
graph LR
    P["Pivot (5)"]
    L["<= 5 的左半部分"]
    P_MID["Pivot (5) 归位"]
    R[">= 5 的右半部分"]
    L --> P_MID
    P_MID --> R
```

## 3. 快速排序的致命死穴：退化为 $O(N^2)$ 链表

*(参考时间：00:25:40 · [视频跳转 (P32 00:25:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=1540))*

快速排序的性能完全维系在**分区是否足够均衡**上：
- **最好情况**：每次 pivot 恰好平分数组，递归树高为 $\log N$，总时间为惊艳的 $\Theta(N \log N)$；
- **最坏情况灾难**：如果输入数组本来就有序，而我们傻乎乎地每次都选最左端元素作为 pivot：
  - 左半部分为空，右半部分包含 $N-1$ 个元素；
  - 递归树退化为一条深达 $N$ 的单链表！
  - **运行时间直接暴跌为灾难性的 $\Theta(N^2)$，并且极易触发调用栈溢出！**

### 解决方案：打乱平衡之道
1. **随机选取基准元（Random Pivot）**：彻底粉碎任何预设输入序列的最坏攻击；
2. **三数取中（Median-of-Three）**：取左端、中端和右端三个元素的中位数作为 pivot，极大提升在近似有序数据上的划分对称性。

## 4. 绝招：三向切分快速排序（3-Way Partitioning）

*(参考时间：00:36:50 · [视频跳转 (P32 00:36:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=2210))*

当数组中包含**海量重复元素（如对包含数亿个 0 和 1 的数组排序）**时，传统的快速排序性能依然会剧烈恶化。

Edsger Dijkstra 提出了优雅的**三向切分法（荷兰国旗问题 Dutch National Flag）**：
将数组一分为三：**`< pivot`、`== pivot` 和 `> pivot`**！
- 递归时，中间与 pivot 相等的一大片区间**完全无需再做任何递归处理**！
- 对于包含常数种互异键的数组，三向切分快排能将时间直接降维至令人窒息的**真线性时间 $\Theta(N)$**！

## 5. 本讲小结与工业级王者地位

*(参考时间：00:46:30 · [视频跳转 (P32 00:46:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=2790))*

尽管在最坏情况下快排存在理论 $O(N^2)$ 的可能，但在配合随机化与三数取中后，最坏情况出现的概率比地球被小行星撞击还要低得多！  
更关键的是：**快排的代码循环内部极度精简，没有辅助内存分配，且对硬件 CPU 的缓存局部性（Cache Locality）极为友好！**  
因此，C 标准库的 `qsort`、Java 的 `Arrays.sort(primitive[])`（双轴快排 Dual-Pivot Quicksort）均默认采用快速排序作为核心引擎。

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：软件工程 II：API 设计与防御性编程](/notes/cs61b/lecture-31) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 IV：比较排序的理论下界证明 →](/notes/cs61b/lecture-33) | [🎬 在 B 站观看本讲 (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) |
