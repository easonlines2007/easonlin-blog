---
title: Lecture 29 · 排序 I：选择排序与就地堆排序：排序三维度分析、选择排序原理与就地堆排序 Bottom-up 优化
description: CS61B 第 29 讲：排序 I：选择排序与就地堆排序：排序三维度分析、选择排序原理与就地堆排序 Bottom-up 优化
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 29
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：53:00 ｜ **官方原版**：Lecture 29 - Sorting I  Selection Sort  Heapsort  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1aleYBt-L8bwyaxw9tXPN3bMI5XxWxmpgfvvSEo9KxD0) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts)  
> **快速导航**：[← 上一讲 (P28 前缀树：Trie 结构与字符串极速检索)](/notes/cs61b/lecture-28) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P30 排序 II：归并排序与插入排序) →](/notes/cs61b/lecture-30)

---

## 1. 排序算法的三大评判维度

*(参考时间：00:02:15 · [视频跳转 (P29 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=135))*

在正式进入算法界最庞大的家族——排序算法之前，必须确立三大核心评判标尺：

1. **时间复杂度（Time Complexity）**：最好、最坏与平均情况下的运行阶；
2. **原地性（In-place / Space Complexity）**：算法是否能在原数组内部通过元素交换直接完成排序，还是需要开辟 $O(N)$ 的额外辅助数组？
3. **稳定性（Stability）**：对于键值相同的两个元素，排序后它们在数组中的**相对先后顺序是否保持绝对不变**？（对于多关键字排序至关重要！）。

## 2. 选择排序（Selection Sort）机制与局限

*(参考时间：00:12:45 · [视频跳转 (P29 00:12:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=765))*

选择排序遵循最纯粹的直觉逻辑：
- 在未排序区间中线性扫描找到最小元素；
- 将其与未排序区间的第一个元素交换；
- 未排序区间向后收缩 1 位，重复直至全数组有序。

```java
public static void selectionSort(int[] a) {
    for (int i = 0; i < a.length; i++) {
        int minIdx = i;
        for (int j = i + 1; j < a.length; j++) {
            if (a[j] < a[minIdx]) minIdx = j;
        }
        swap(a, i, minIdx);
    }
}
```

**性能与特性**：  
- **比较次数**：恒为 $\frac{N(N-1)}{2} = \Theta(N^2)$，即使输入数组本来就有序，也必须机械比完全部；
- **原地性**：$O(1)$ 完美原地；
- **稳定性**：**不稳定**！远距离交换会粗暴跨越相同元素破坏相对位置。

## 3. 堆排序（Heapsort）：从朴素到就地蜕变

*(参考时间：00:25:20 · [视频跳转 (P29 00:25:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=1520))*

选择排序之所以慢，是因为每次找最小值都要花费 $O(N)$ 进行盲目线性扫描。  
**回忆我们在 Lecture 21 学习的二叉堆！堆找极值仅需 $O(1)$！**

### 朴素堆排序
把数组全部塞入一个新 `MinPQ`，再依次弹出 $N$ 次写入目标数组。  
- 时间：建堆 $O(N \log N)$，弹出 $O(N \log N)$，总时间 $O(N \log N)$；
- 痛点：需要额外开辟一个堆数组，非原地（$O(N)$ 辅助空间）。

## 4. 就地堆排序核心步骤：自底向上就地下沉

*(参考时间：00:36:30 · [视频跳转 (P29 00:36:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=2190))*

Josh Hug 教授揭示了原地堆排序的终极魔法：**直接把原输入数组视作一个最大堆（Max-Heap）！**

### 阶段一：自底向上就地建堆（Bottom-up Heapification）
从最后一个非叶子节点（下标 $\lfloor N/2 \rfloor$）开始，从右向左逐个执行 `sink()` 下沉操作：
```java
for (int k = N / 2; k >= 1; k--) {
    sink(a, k, N);
}
```
> **极其惊人的数学定理**：自底向上建堆的总时间复杂度**不是 $O(N \log N)$，而是严格的线性时间 $\Theta(N)$！**（因为大部分节点分布在底层，其下沉高度极小）。

### 阶段二：反复交换与下沉
1. 将堆顶最大元素 `a[1]` 与当前堆底元素 `a[N]` 交换（最大值归位到数组末尾正确位置）；
2. 逻辑堆大小减 1，对新堆顶执行 `sink()`；
3. 重复直至堆排空！

```java
int k = N;
while (k > 1) {
    swap(a, 1, k--);
    sink(a, 1, k);
}
```

## 5. 本讲小结与堆排序特性速查

*(参考时间：00:46:15 · [视频跳转 (P29 00:46:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=2775))*

| 维度 | 选择排序 | 就地堆排序 (Heapsort) |
| :--- | :---: | :---: |
| **最坏时间复杂度** | $\Theta(N^2)$ | **$O(N \log N)$** |
| **最好时间复杂度** | $\Theta(N^2)$ | $O(N)$ (全部元素相同时) |
| **空间复杂度** | $O(1)$ (原地) | **$O(1)$ (原地)** |
| **稳定性** | 不稳定 | **不稳定** (长距离下沉破坏相对序) |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：前缀树：Trie 结构与字符串极速检索](/notes/cs61b/lecture-28) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 II：归并排序与插入排序 →](/notes/cs61b/lecture-30) | [🎬 在 B 站观看本讲 (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) |
