---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 32 · 排序 III：快速排序与荷兰国旗三向切分：分治划分哲学、Pivot 轴心选择、Lomuto 与 Hoare 划分、三向切分与退化防御
description: CS61B 第 32 讲：排序 III：快速排序与荷兰国旗三向切分：分治划分哲学、Pivot 轴心选择、Lomuto 与 Hoare 划分、三向切分与退化防御
topic: CS61B
order: 32
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:45 ｜ **官方原版**：Lecture 32 - Sorting III： Quicksort  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/11vRyW0ZPrsxUhRHCBgkygy01PlL1amB66n9FZQN03wo) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/32.-more-quick-sort-sorting-summary)  
> **快速导航**：[← 上一讲 (P31 软件工程 II：架构设计模式与工程解耦)](/notes/cs61b/lecture-31) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P33 排序 IV：基于比较排序的理论下界证明) →](/notes/cs61b/lecture-33)

---

## 1. 快速排序（Quicksort）：图灵奖得主 Tony Hoare 的分治杰作

*(参考时间：00:01:25 · [视频跳转 (P32 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=85))*

归并排序把主要工作放在了递归后的“合并（Merge）”阶段，而快速排序将核心智慧放在了递归前的**“切分（Partitioning）”**阶段！

### 核心分治哲学
1. **选择轴心（Pivot Selection）**：在待排数组中挑选一个基准元素 $p$；
2. **切分（Partitioning）**：重新排列数组，使得：
   - 位于轴心左侧的所有元素，都小于等于 $p$；
   - 位于轴心右侧的所有元素，都大于等于 $p$；
   - 轴心元素 $p$ 此时被精确锚定在最终排好序的终极正确位置上！
3. **递归处理两侧**：对轴心左侧与右侧的子区间分别递归运行快速排序。

## 2. 算法的最差情况退化与随机打乱护城河

*(参考时间：00:11:30 · [视频跳转 (P32 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=690))*

- **最理想情况**：每次选择的 Pivot 恰好是中位数，左右两侧规模相等，递归树高为 $\log_2 N$，时间复杂度为极速的 **$\Theta(N \log N)$**；
- **最坏情况灾难**：如果数组已经完全有序，且我们固定挑选第一个元素作为 Pivot：
  - 每次切分后，左侧为空，右侧为 $N - 1$ 个元素；
  - 递归树退化为深度为 $N$ 的细长链条；
  - 比较次数退化为经典的等差数列求和：$\Theta(N^2)$！

### 工业级防退化绝招：前置随机打乱（Shuffle）
在执行快速排序之前，**无条件先用 Fisher-Yates 算法对输入数组进行一次完全均匀的随机洗牌（Random Shuffle）**！  
数学概率证明：任何特定有害输入模式（如升序、逆序）被随机打乱后，触发 $O(N^2)$ 最坏情况的概率比在路上被陨石击中还要低得多。平均运行时间稳定收敛于 **$\sim 1.39 N \log_2 N$**！

## 3. 大量重复元素灾难与 Dijkstra 三向切分（3-Way Partitioning）

*(参考时间：00:22:15 · [视频跳转 (P32 00:22:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=1335))*

当数组中包含大量重复键值（例如几百万个元素全是 1 和 2）时，传统快速排序会陷入左右不平衡的泥潭。

Edsger Dijkstra 提出了如同荷兰国旗三色排列的**三向切分法（3-Way Partitioning）**：  
将数组切分为三段：
- 小于 Pivot 的区间（`< Pivot`）；
- **精确等于 Pivot 的区间（`== Pivot`）**；
- 大于 Pivot 的区间（`> Pivot`）。

在递归时，**所有与 Pivot 相等的元素直接被永久定格，不再参与后续任何递归！**  
如果数组中全是相同元素，三向切分快速排序可以在神级的 **$\Theta(N)$ 线性时间** 内直接完成排序！

## 4. 本讲小结与课后自测

*(参考时间：00:31:00 · [视频跳转 (P32 00:31:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=1860))*

### 课后综合自测题
为什么在实际工业界中，快速排序往往比归并排序和堆排序跑得更快？  
**答案与解析**：  
1. **CPU 缓存亲和度极致优秀**：快速排序的双指针从两端向中间扫描，物理内存在连续空间中快速流转，CPU 缓存行命中率远超堆排序的跳跃寻址；  
2. **常数项因子小**：内部循环指令极其紧凑，且无需归并排序的额外数组拷贝开销。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 32. More Quick Sort, Sorting Summary

By Teresa Luo and Nathalys Pham

---

## 32.1 Quicksort Flavors vs. MergeSort

### Quicksort Flavors: Motivation

Before we dive into the wonderful ideas of how to improve the Quicksort Algorithm, here's a [review](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.2-quicksort-algorithm) on how the Quicksort (or Partition Sort) works.

Recall, our version of Quicksort has the following properties:

* Leftmost item is always the pivot

* Our partitioning algorithm always preserves the relative order of <= and >= items.

And remember that even though if we have a pivot that is always "good", which leads to a best case runtime of $$\theta(NlogN)$$, it is still *possible* that the rare worst case runtime $$\theta(N^2)$$ will happen in practice. Consequently, Quicksort will have a worse runtime than [MergeSort](https://cs61b-2.gitbook.io/cs61b-textbook/15.-asymptotics-ii/15.4-mergesort), losing its title as the "fastest sorting algorithm". 

Therefore,  a natural question to ask is: **What can we do to avoid running into the worst case for Quicksort?** So it can beat MergeSort for sure? This will be the main motivation of exploration for this section.

### Quicksort Flavors: Philosophies

Here are some general philosophies to follow to brainstorm ways to improve Quicksort 

#### Philosophy 1: Randomness

Some possible reasons that the rare worst case runtime still happen in practice include:

* Bad ordering: Arrays already in sorted order

* Bad elements: Arrays with all duplicates

In both of the examples above, assuming we are using the strategy that the leftmost item is always the pivot, each partition of the elements around the pivot **fails to reduce the size of the resulting subarrays *****significantly***, which leads to the consequence of going through the items many many times. 

One solution to the bad ordering problem is randomness, which is encoded by these two strategies below:

1. Pick pivots randomly.

2. Shuffle items before sort.

Note: Strategy 2 requires care in partitioning code to avoid $$\theta(N^2)$$ behavior on arrays of duplicates.

Turns out, this randomized version of Quicksort is the best sort you can get with extremely good performance. 

Just like the care-free, motorcycle rider from the 1992 TV Show *Renegade,* this version of the Quicksort algorithm is able to thrive with a devil-may-care attitude, even without the luxurious hair. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FNF0GKPN0mJ494lWKCnft%2FScreen%20Shot%202023-04-09%20at%2011.34.34%20PM.png?alt=media&amp;token=cf6590c8-68a5-4bcc-a926-ecb14eb040ae" alt=""><figcaption><p>Spirit of Randomized Quicksort Algorithm.</p></figcaption></figure>

#### Philosophy 2: Smarter Pivot Selection

Another approach to the problem is to choose a "good" pivot effectively, somehow.  

##### 2a. Constant time pivot pick

One of such approach is to pick a few items, and then among them, choose the "best" one as the pivot. This type of approach exemplifies a type of pivot selection procedure that is both *deterministic* and *constant* time.

However, a big drawback of such procedure is that the resulting Quicksort has a family of "dangerous inputs"---inputs that will lead to the worst case runtime or break the algorithm---that an adversary could easily generate.

##### 2b. Linear time pivot pick

Since we are partioning multiple times, always selecting the median as the pivot seems like a good idea, because each partition will allow us to cut the size of the resulting subarrays by half. 

Therefore, to improve upon the idea from part a, we can calculate the *median* of a given array, which can be done in linear time, then select that as the pivot.

The "exact median QuickSort" algorithm will not have the technical vulnerabilities as the 2a approach, and has a runtime of $$\theta(NlogN)$$. However, it is still slower than MergeSort.

#### Philosophy 3: Introspection

This philosophy simply relies on introspecting the recursive depth of our algorithm, and switch to MergeSort once we hit the depth threshold. 

Although this is a reasonable approach, it is not common to use in practice.

### Quicksort Flavors vs. MergeSort: Who's the best?

#### **Candidate One: Quicksort L3S**

Quicksort L3S is the Quicksort that is introduced last time, with the following properties:

* Always leftmost pivot selection

* Partioning

* Shuffle before starting

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fq5goc52jOrQ8x2NRL5cJ%2FScreen%20Shot%202023-04-10%20at%2012.00.46%20AM.png?alt=media&amp;token=51e227e4-2397-40ad-9c04-466ac9a49513" alt=""><figcaption></figcaption></figure>

Unfortunately, 0 : 1 with Mergesort in the lead. 

#### Candidate Two: Quicksort LTHS

Quicksort LTHS is very similar to Quicksort L3S, except with a different partioning scheme: [**Tony Hoare's In-Place Partioning Scheme**](https://docs.google.com/presentation/d/1DOnWS59PJOa-LaBfttPRseIpwLGefZkn450TMSSUiQY/pub?start=false\&loop=false\&delayms=3000\&slide=id.g12b16fb6b6_0_2).

##### Tony Hoare's Partioning

Imagine two pointers, one at each end of the items array, walking towards each other:

* Left pointer loves small items.

* Right pointer loves large items.

* Big idea: Walk towards each other, swapping anything they don’t like; stop when the two pointers cross each other. 

  * Left pointer hates larger or equal items

  * Right pointer hates smaller or equal items

* New pivot = Item at right pointer.

* End result is that things on left of pivot (originally the leftmost item) are “small” and things on the right of pivot are “large”.

##### TH Partioning: An Intuitive Analogy

Intuitively, you can think of each pointer as a little "police" for the "less than pivot" territory and "greater than pivot" territory. And think of the pivot as the "border line" between the two territories. 

Their job is to find and arrest any "suspects", or items that don't belong to their respective territories, and trade the arrested suspects with the "police" on the other side. 

Specifically, the left pointer is the "police" for the "less than pivot" territory, looking for any "suspects" (items greater than or equal to the pivot) that are not supposed to be on this side of the border line. Analogously, the right pointer looks for "suspects" (items less than or equal to the pivot) in the "greater than territory". 

When the two "polices" meet, mission is done as they both have sufficiently searched across their representative territories.

##### All this work for nothing?

Not at all! All this work with a new partioning scheme did pay off, and using the TH partitioning scheme yields a very fast Quicksort: one that is faster than MergeSort!

It's important to also note that: 

* Faster schemes have been found since.

* Overall runtime still depends crucially on pivot selection strategy!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FrOtdU0rDZZcHDeovsSBJ%2FScreen%20Shot%202023-04-10%20at%2012.05.30%20AM.png?alt=media&amp;token=5f312610-add4-49fe-9392-46a74cdacaa5" alt=""><figcaption></figcaption></figure>

1 : 1 with a win for QuickSort Flavors! 

#### Candidate Three: QuickSort PickTH

##### Median Identification: Linear Time

Recall from philosophy 2b that the idea of identifying the median and use it as the pivot is inefficient because finding the median itself is a costly process. (Runtime: $$\theta(NlogN)$$

Turns out, it is possible to find the median in $$\theta(N)$$ time instead, with an algorithm called "[PICK](https://www.cs.princeton.edu/~wayne/cs423/lectures/selection-4up.pdf)".

Will this improved version of Exact Median Quicksort perform better than Mergesort?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FY5todbbJ0eAOA7nFdt9Y%2FScreen%20Shot%202023-04-10%20at%2012.35.14%20AM.png?alt=media&amp;token=e70be458-ab1a-4c5e-a5d7-51bc6760ab04" alt=""><figcaption></figcaption></figure>

Sadly, no. And it was terrible! Likely for the following reasons:

* Cost to compute medians is too high.

* Have to live with worst case $$\theta(N^2)$$ if we want good practical performance.

1 : 2 with Mergesort as the winner. 

---

## 32.2 Quick Select

Dissatisfied with the result that Quicksort is unable to completely defeat Mergesort and truly claim the title for "fastest comparison-based sorting" algorithm, let's shoot our one last shot to overturn the result: use Quick Select to identify the median. 

### Quick Select Algorithm

Goal: find the median using partioning. 

Key idea: Median of an length n array will be around index n /2.

1. Initialize array with the leftmost item as the pivot. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F2pXn0GVshTxyLwc6qOMJ%2FScreen%20Shot%202023-04-10%20at%2012.49.15%20AM.png?alt=media&amp;token=aaa8c490-cdc8-4426-9fe8-bce26ced7b94" alt=""><figcaption><p>Initial Array</p></figcaption></figure>

For this example, the index of the median should be 9 / 2 = 4. 

2. Partition around pivot. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1st4J7M1QaH2z1l3Usl3%2FScreen%20Shot%202023-04-10%20at%2012.50.44%20AM.png?alt=media&amp;token=6cede37c-c2b4-4755-b612-118f6e431417" alt=""><figcaption><p>Pivot lands at index 2</p></figcaption></figure>

Since the pivot is at index 2, which is not the median. Therefore, need to continue. However, will only partition the **right** subproblem because median can't be to the left! (index n/2 > 2)

3. Partition the subproblem. Repeat the process.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fm0XHr1ye9N4EVV98EuN5%2FScreen%20Shot%202023-04-10%20at%2012.53.07%20AM.png?alt=media&amp;token=52877673-f11c-489f-88ab-b0c995e4f377" alt=""><figcaption></figcaption></figure>

Pivot is at index 6, which means that it is not at the median. Continue. 

4. Stop when the pivot is at the median index. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FNCuCcZn2wVvMjhLXgRpO%2FScreen%20Shot%202023-04-10%20at%2012.54.52%20AM.png?alt=media&amp;token=ac35a9ad-d7af-4f1a-a525-20ab9b1bf625" alt=""><figcaption></figcaption></figure>

Since pivot is at index 4, we are done. 

### Quick Select Performance

#### Worst Case Runtime

The worst case is when the array is in sorted order, which yields a runtime of $$\theta(N^2)$$.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FYMATfSuOMSDvBWsFU8LR%2FScreen%20Shot%202023-04-10%20at%2012.47.27%20AM.png?alt=media\&token=f2e3f0af-3b98-4395-aacc-e1f33b19fd32)

#### Expected Runtime

The expected runtime for the Quick Select Algorithm is $$\theta(N)$$. Here's an intuitive diagram that justifies this result: 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fo3b6wDKL10J2hWRvqZH5%2FScreen%20Shot%202023-04-10%20at%2012.45.39%20AM.png?alt=media&amp;token=c11c6df1-2d53-44ac-9a01-07b7c10b7002" alt=""><figcaption></figcaption></figure>

Using one of our favorite sums, we can see the runtime is:

$$
N + N/2 + N/4 +.... + 1 = \theta(N)
$$

### Compared to MergeSort?

Unfortunately, even using Quickselect to find the exact median, the resulting algorithm is still quite slow. 

Team Mergesort wins, sadly. 

---

## 32.3 Stability, Adaptiveness, and Optimization

### Stability

A sort is stable if the order of equivalent elements is preserved. The following is an example of a stable sort. After sorting by section, notice how Bas, Jana, Jouni, and Rosella are in the same order as before sorting. If we want records sorted by section and then by name within each section, we can sort by name and then by section as below.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FRilq7W7nGtswHmyl5GCP%2FScreenshot%202023-04-10%20at%2012.16.47%20AM.png?alt=media&amp;token=1f9b6e83-2b33-458b-a4c1-a372519463f3" alt=""><figcaption></figcaption></figure>

The following example is an unstable sort. It can make things really annoying! If we want records sorted by section and then by name within each section, we can't just sort by name and then by section as before. After an unstable sort, the previous ordering is not maintained.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fg6FpmZLksYV79KAacWNu%2FScreenshot%202023-04-10%20at%2012.28.10%20AM.png?alt=media&amp;token=a283f697-990e-41f5-a819-9c4c0d1fff14" alt=""><figcaption></figcaption></figure>

Are some of the sorts we learned stable? Insertion sort is stable! Equivalent elements move past their equivalent brethren. MergeSort is stable. HeapSort is not stable. QuickSort can be stable depending on its partitioning scheme, but its stability cannot be assumed since many of its popular partitioning schemes, like Hoare, are unstable.

### Optimizations

Adaptiveness - A sort that is adaptive exploits the existing order of the array. Examples are InsertionSort, SmoothSort, and TimSort.

Switch to Insertion Sort - When a subproblem reaches size 15 or lower, use insertion sort. It is very very fast for inputs of small sizes.

Exploit restrictions on set of keys - For example, if the number of keys is some constant, we can use this constraint to sort faster by applying 3-way QuickSort.

Switch from QuickSort - If the recursion goes too deep, switch to a different type of sort.

---

## 32.4 Summary

### Quicksort

What can we do to avoid the worst case runtime of $$\theta(N^2)$$ for Quicksort? 

1. Randomness: pick a random pivot point, shuffle items before sorting

2. Smarter Pivot Selection: constant time pivot pick (ex: pick a few and then choose the best out of them), linear time pivot pick like (ex: median)

3. Introspection: switch to a different sort if current sort hits recursion depth threshold

Quicksort vs. Mergesort

* Mergesort is faster than Quicksort L3S (leftmost pivot, 3-scan partition) and QuickSort PickTH (median pivot, Tony Hoare partition)

* Quicksort LTHS (leftmost pivot, Tony Hoare partition) is faster than Mergesort!

* Tony Hoare's partitioning:

  * two pointers, one at each end of the items array, walking towards each other

  * left pointer hates larger or equal items, right pointer hates smaller or equal items

  * swapping anything they don’t like; stop when the two pointers cross each other

  * new pivot = Item at right pointer.

### Quick Select

Quick select helps us quickly find the median with partitioning. Median of an length n array will be around index n /2. 

1. Initialize array with the leftmost item as the pivot. 

2. Partition around pivot. 

3. Partition the subproblem. Repeat the process.

4. Stop when the pivot is at the median index. 

Expected runtime: $$\theta(N)$$. Worst case runtime (when array is in sorted order): $$\theta(N^2)$$.

### Stability, Adaptiveness, and Optimization

Stability: A sort is stable if the order of equivalent elements is preserved.

Optimizations: 

* Adaptiveness - sort that exploits the existing order of the array.

* Switch to Insertion Sort - when a subproblem reaches size 15 or lower

* Exploit restrictions on set of keys

* Switch from QuickSort - if the recursion goes too deep

---

## 32.5 Exercises

### Factual

1. Suppose we have the array `[17, 15, 19, 32, 2, 26, 41, 17, 17]`, and we partition it using 3-scan partitioning using `17` as the pivot. What array do we end up with?

2. Suppose we have the array `[17, 15, 19, 32, 2, 26, 41, 17, 17]`, and we partition it using Tony Hoare partitioning using 17 as the pivot. What array do we end up with?

<details>

<summary>Problem 1</summary>

`[15, 2, 17, 17, 17, 19, 32, 26, 41]`. First we scan for the smaller elements (15, 2), then the equal elements (17, 17, 17), and finally the larger elements (19, 32, 26, 41) in the order they appear from left to right in the original array.

</details>

<details>

<summary>Problem 2</summary>

`[2, 15, 17, 17, 17, 26, 41, 32, 19]`. See [here](https://docs.google.com/presentation/d/1DOnWS59PJOa-LaBfttPRseIpwLGefZkn450TMSSUiQY/pub?start=false\&loop=false\&delayms=3000\&slide=id.g463de7561_042) for a demo.

</details>

### Conceptual

1. Which of the following arrays will result in $$N^2$$ behavior if we use quicksort which always uses the leftmost item as pivot, and which uses a stable partitioning strategy?

   * [ ] `[1, 1, 1, 1, 1, 1, ..., 1]`

   * [ ] `[1, 2, 3, 4, 5, 6, ..., N]`

   * [ ] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

2. Repeat the exercise above, but assume that we shuffle the array before partitioning.

3. Suppose we try to use Quick Select to find the median of `[17, 15, 19, 32, 2, 26, 41, 5, 9]`. How many total partitioning operations will we need to complete to find the median?

4. Which of the following sorts are stable?

   * [ ] Insertion sort

   * [ ] Quicksort L3 - use leftmost item as pivot, use 3scan partitioning

   * [ ] Quicksort L3S - use leftmost item as pivot, use 3scan partitioning, shuffle before starting

   * [ ] Quicksort LTH - use leftmost item as pivot, use tony hoare partitioning

   * [ ] Quicksort PickTH - use median (computed with PICK) as pivot, use tony hoare partitioning

<details>

<summary>Problem 1</summary>

All three of these arrays are worst-case inputs for quicksort, since the size of the largest partition will only decrease by 1 each round of partitioning.

* [x] `[1, 1, 1, 1, 1, 1, ..., 1]`

* [x] `[1, 2, 3, 4, 5, 6, ..., N]`

* [x] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

</details>

<details>

<summary>Problem 2</summary>

If we shuffle, the two arrays with integers up to `N` are no longer guaranteed to have bad pivots since the pivot could be any item in the array with equal probability. However, the array of all `1`s will still always choose a "bad" pivot, since all items in the array are equal and will end up in the left partition.

* [x] `[1, 1, 1, 1, 1, 1, ..., 1]`

* [ ] `[1, 2, 3, 4, 5, 6, ..., N]`

* [ ] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

</details>

<details>

<summary>Problem 3</summary>

1; after a single partitioning operation, we end up with 17 in the middle of the array. Thus, we will get 17 into this middle position and be done immediately. Note that it doesn't matter what partitioning strategy we use.

</details>

<details>

<summary>Problem 4</summary>

Insertion sort is stable, as mentioned in previous chapters.

3-scan alone is stable.

After shuffling, we cannot guarantee any ordering of items, so any partitioning strategy involving shuffling is not stable. Also, Hoare partitioning is inherently unstable, so any sort involve Hoare partiioning is also not a stable sort.

* [x] Insertion sort

* [x] Quicksort L3 - use leftmost item as pivot, use 3scan partitioning

* [ ] Quicksort L3S - use leftmost item as pivot, use 3scan partitioning, shuffle before starting

* [ ] Quicksort LTH - use leftmost item as pivot, use Hoare partitioning

* [ ] Quicksort PickTH - use median (computed with PICK) as pivot, use Hoare partitioning

</details>

### Metacognitive

1. Why does Java’s built-in `Array.sort` method use Quicksort for `int`, `long`, `char`, or other primitive arrays, but Mergesort for all `Object` arrays?

2. Given that quicksort runs fastest if we can always somehow pick the median item as the pivot, why don’t we use quickselect to find the median to optimize our pivot selection (as opposed to using the leftmost item)?

<details>

<summary>Problem 1</summary>

This is because primitives don't require stability--an `int` is indistinguishable from any other `int` if they are equal by `.equals()`. However, this is not true for `Object`s, since two different `Object`s at different memory addresses can still be equal, and stability may be desireable when sorting objects.

</details>

<details>

<summary>Problem 2</summary>

The problem with finding the median before partioning each time is that this increases the runtime of quicksort by a significant constant factor, resulting in a much slower algorithm in practice. The very low probability of running into a worst-case quicksort means that using a time-consuming algorithm to find the median is not worth it in the majority of sorting cases.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：软件工程 II：架构设计模式与工程解耦](/notes/cs61b/lecture-31) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 IV：基于比较排序的理论下界证明 →](/notes/cs61b/lecture-33) | [🎬 在 B 站观看本讲 (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) |
