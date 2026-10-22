---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 29 · 排序 I：选择排序与原地堆排序：选择排序原地化、堆排序设计、Bottom-Up 线性建堆与 O(N log N) 原地实现
description: CS61B 第 29 讲：排序 I：选择排序与原地堆排序：选择排序原地化、堆排序设计、Bottom-Up 线性建堆与 O(N log N) 原地实现
topic: CS61B
order: 29
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：53:00 ｜ **官方原版**：Lecture 29 - Sorting I  Selection Sort  Heapsort  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1aleYBt-L8bwyaxw9tXPN3bMI5XxWxmpgfvvSEo9KxD0) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts)  
> **快速导航**：[← 上一讲 (P28 字典树：Tries 与前缀检索)](/notes/cs61b/lecture-28) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P30 排序 II：插入排序与归并排序) →](/notes/cs61b/lecture-30)

---

## 1. 排序问题的核心地位与分类全景

*(参考时间：00:01:25 · [视频跳转 (P29 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=85))*

排序是计算机科学中最核心的基础问题。将无序数据整理为有序序列，能够使二分查找、去重、集合运算等后续算法的性能获得飞跃。

评价排序算法的三大核心维度：
1. **时间复杂度（Time Complexity）**：最好、最坏与平均情况下的操作步数；
2. **空间复杂度（Space Complexity / In-Place）**：是否能在原数组内部就地（In-Place）完成，无需额外大量内存；
3. **稳定性（Stability）**：键值相等的两个元素，在排序前后的相对次序是否绝对不变。

## 2. 选择排序（Selection Sort）原地化改造

*(参考时间：00:09:40 · [视频跳转 (P29 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=580))*

在 Lecture 6 中，我们实现了选择排序：
- 每次在未排序区间找到全局最小值；
- 将其与未排序区间的首个元素交换。

由于无论输入是什么形态，每次都必须扫描剩余全部区间，其比较次数恒为：
$$\sum_{i=1}^N i = \frac{N(N-1)}{2} = \Theta(N^2)$$
最好、最坏、平均情况均牢牢锁定在笨拙的 $\Theta(N^2)$。

## 3. 堆排序（Heapsort）：利用最大堆加速极值检索

*(参考时间：00:18:20 · [视频跳转 (P29 00:18:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=1100))*

选择排序之所以慢，是因为“寻找未排序区间的最小值”花费了 $\Theta(N)$ 的代价。  
**如果我们用堆来维护这些数据，寻找极值只需 $O(1)$，调整只需 $O(\log N)$！**

### 原地堆排序（In-Place Heapsort）精妙构想
为了避免额外开辟内存堆，我们直接在待排序的输入数组 `a[]` 上就地构建**最大堆（Max-Heap）**：
1. 将原数组逻辑上视为一棵完全二叉树；
2. 执行**自底向上堆化（Bottom-Up Heapify）**；
3. 循环将堆顶最大值（`a[0]`）与堆末尾元素交换，并将有效堆大小减 1；
4. 对新的堆顶执行下沉（Sink），恢复最大堆性质。

## 4. Bottom-Up 堆化的线性时间奇迹：为什么建堆只需 $\Theta(N)$？

*(参考时间：00:27:00 · [视频跳转 (P29 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=1620))*

初学者通常认为建堆需要向空堆插入 $N$ 个元素，耗时 $O(N \log N)$。  
然而，采用从最后一个非叶子节点（$N/2$）向前扫描执行 `sink` 的自底向上建堆法，其复杂度是惊人的**线性时间 $\Theta(N)$**！

### 严格数学求和证明：
树中最底层的叶子节点占了一半（$N/2$），下沉距离为 0；  
倒数第二层节点占 $N/4$，下沉距离最多为 1；  
倒数第三层节点占 $N/8$，下沉距离最多为 2；  
总工作量为等差等比复合级数：
$$\text{Total Sink Work} = \sum_{h=1}^{\log N} \frac{N}{2^{h+1}} \times h = \frac{N}{2} \sum_{h=1}^{\infty} \frac{h}{2^h} = \frac{N}{2} \times 2 = N = \Theta(N)$$

**建堆只需 $\Theta(N)$，随后 $N$ 次下沉耗费 $\Theta(N \log N)$，总时间严格为 $\Theta(N \log N)$，且空间开销为纯粹的 $O(1)$ 原地！**

## 5. 本讲小结与课后自测

*(参考时间：00:35:00 · [视频跳转 (P29 00:35:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=2100))*

### 课后综合自测题
堆排序是稳定的排序算法吗？为什么？  
**答案与解析**：  
**堆排序是不稳定的（Not Stable）！**  
在首尾交换和跨层下沉比较时，两个相等元素的相对顺序极易发生翻转。例如包含键值相同的项，末尾的项可能在交换时直接越过前面相等的项，导致原有顺序被破坏。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 29. Basic Sorts

- [29.1 The Sorting Problem](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.1-the-sorting-problem.md)

- [29.2 Selection Sort & Heapsort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.2-selection-sort-and-heapsort.md)

- [29.3 Mergesort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.3-mergesort.md)

- [29.4 Insertion Sort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.4-insertion-sort.md)

- [29.5 Summary](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.5-summary.md)

- [29.6 Exercises](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.6-exercises.md)

---

## 29.1 The Sorting Problem

### Sorting

For the remaining part of this textbook, we'll discuss the sorting problem, which can be informally defined as putting a given set of items in a particular order.

This is a useful task in its own right, but can also be a subproblem in larger algorithmic problems. Sorting can be applied to problems like duplicate finding (after sorting, equivalent items are adjacent), binary search, and balancing data structures.

The other reason we introduce sorting is that the different sorts provide general ideas about how to approach computational problems. The solution(s) to sorting problems will often involve data structures covered in the earlier parts of this course.

#### Sorting: Definitions

An **ordering relation** $$<$$ for keys a, b, and c has the following properties:

* *Law of Trichotomy*: Exactly one of a $$<$$ b, a = b, b $$<$$ a is true.

* *Law of Transitivity*: If a $$<$$ b, and b $$<$$ c, then a $$<$$ c.

An ordering relation with the properties above is also known as a **total order**. 

A **sort** is a permutation of a sequence of elements that puts the keys into non-decreasing order relative to a given ordering relation, such that x1 ≤ x2 ≤ x3≤ ...≤ xN.

##### Example: String Length

One example of a ordering relation is the length of strings. To see how the two laws apply:

* *trichotomy*: only one of the following can be true for two strings `a` and `b`--`len(a)` < `len(b)`, `len(a)` = `len(b)`, or `len(a)` > `len(b)`.

* *transitivity:* if `len(a)` < `len(b)` and `len(b)` < `len(c)`, then clearly `len(a)` < `len(c)`.

Suppose we use the ordering relation above to sort `["cows", "get", "going", "the"]`. Then two valid sorts would be `["the", "get", "cows", "going"]` and `["get", "the", "cows", "going"]`. Note that in this sort, `the` and `get` are equivalent since their lengths are equal.

#### Ordering Relations in Java

In Java, ordering relations are typically given by the `compareTo` or `compare` methods. For example:

```java

import java.util.Comparator;

public class LengthComparator implements Comparator<String> {

    public int compare(String x, String b) {

        return x.length() - b.length();

    }

}

```

Note by the relation above, `the` and `get` are equal in ordering, but *not* equal by the `.equals()` method.

#### Inversions

An alternate way to view sorting is as fixing inversions within a sequence of elements. An **inversion** is a pair of elements that are out of order with respect to the defined ordering relation.

For example, in the following sequence of 11 elements, there are 55 possible inversions at most (11 choose 2), and the sequence itself has 6 inversions.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FX1G7yqiEeVcmLV34Vzuk%2Fimage.png?alt=media&amp;token=405fd0bb-3c66-4334-9cda-ea90b2790e0f" alt=""><figcaption><p>The sequence above has 6 inversions</p></figcaption></figure>

Sorting, then, can be viewed as follows: given a sequence of elements with Z inversions, perform some sequence of operations to reduce the total number of inversions to zero.

#### Sorting: Performance

Previously, we have seen characterizations of of the runtime efficiency of an algorithm, also called the **time complexity** of an algorithm. For example, we can say that Dijkstra’s has time complexity O(E log V).

Characterizations of the “extra” memory usage of an algorithm is sometimes called the **space complexity** of an algorithm. For example, Dijkstra’s has space complexity Θ(V) to store the queue, `distTo`, and `edgeTo` arrays. Note that the graph takes up space Θ(V+E), but we don’t count this as part of the space complexity of Dijkstra since the graph is an input to Dijkstra’s. In other words, we are only concerned with the *extra* space used by the algorithm.

---

## 29.2 Selection Sort & Heapsort

### Selection Sort

Selection sort uses the following algorithm:

1. Find the smallest item.

2. Swap that item to the front.

3. Repeat until all items are fixed (there are no inversions).

You can see a demo of the sorting algorithm [here](https://docs.google.com/presentation/u/1/d/1p6g3r9BpwTARjUylA0V0yspP2temzHNJEJjCG41I4r0/edit?usp=sharing).

Selection sort runs in $$\Theta(N^2)$$ time using an array or similar data structure. 

You may have noticed that selection sort seems inefficient, and you'd be right--we look through the entire remaining array each time to find the minimum, examining the same items over and over.

### Heapsort

#### Naive Heapsort

To avoid the inefficiency mentioned above regarding selection sort, we can leverage a max-oriented heap instead of scanning over the array linearly. 

*Note: Because of the array-based representation of a heap, using a max heap results in a simpler implementation where we can maintain a "sorted" and "unsorted" portion of the array. This will be explained further in the next section.*

Then, to heapsort N items, we can insert all the items into a max heap and create and output array. Then, we repeatedly delete the largest item from the max heap and put the largest item at the end part of the output array.

##### Naive Heapsort Analysis

The overall runtime of this algorithm is $$\Theta(N \log N)$$. There are three main components to this runtime:

* Inserting N items into the heap: $$O(N \log N)$$.

* Selecting the largest item: $$\Theta(1)$$.

* Removing the largest item: $$O(\log N)$$.

This is a large improvement over selection sort's $$\Theta(N^2)$$ runtime.

In terms of memory usage, the output array takes an extra $$\Theta(N)$$space. This is worse than selection sort, which uses no extra space, but the improvement in runtime far outweighs this downside.

Even more, we can use a trick with heapsort to get rid of the extra output array.

#### In-place Heapsort

As an alternate approach, we can use the input array itself to form the heap and output array.

Rather than inserting into a new array that represents our heap, we can use a process known as *bottom-up heapification* to convert the input array into a heap. Bottom-up heapification involves moving in reverse level order up the heap, sinking nodes to their appropriate location as you move up.

By using this approach, we avoid the need for an extra copy of the data. Once heapified, we use the naive heapsort approach of popping off the maximum and placing it at the end of our array. In doing so, we maintain an "unsorted" front portion of the array (representing the heap) and a "sorted" back portion of the the array (representing the sorted items so far).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FwTPb8gFQNpzXjf7qMCU0%2Fimage.png?alt=media&amp;token=ca63358e-2f20-4b76-aa74-24f7a244c968" alt=""><figcaption><p>Bottom-up heapfication</p></figcaption></figure>

You can see a demo of this algorithm [here](https://docs.google.com/presentation/d/1SzcQC48OB9agStD0dFRgccU-tyjD6m3esrSC-GLxmNc/edit?usp=sharing).

##### In-place Heapsort Runtime

This process overall is still $$O(N \log N)$$, since bottom-up heapification requires at most $$N$$ sink-down operations that take at most $$\log N$$ time each.

*Note: it is possible to prove that bottom-up heapficiation is bounded by* $$\Theta(N)$$. *However, this proof is out of scope for this class.*

##### In-place Heapsort Memory

Using in-place heapsort, we reduce the memory usage of heapsort to $$\Theta(1)$$. Since we are reusing the input array, no additional space is used (and remember that we do not count the input when assessing memory complexity).

---

## 29.3 Mergesort

We've covered mergesort in the past, but as a reminder, the algorithm is as follows:

1. Split the items into half.

2. Mergesort each half.

3. Merge the two sorted halves to form the final result.

You can see a demo of the algorithm [here](https://docs.google.com/presentation/d/1h-gS13kKWSKd_5gt2FPXLYigFY4jf5rBkNFl3qZzRRw/edit#slide=id.g463de7561_042). 

Mergesort has a runtime of $$\Theta(N \log N)$$-- we will not reanalyze the algorithm here but you may refer to this [link](https://docs.google.com/presentation/u/1/d/1_LhI5V5JlcRHYU55_SF7ZHxPemBr9OVlNzj7ScYdg64/edit#slide=id.g84271d11b_2_77) if you'd like to remind yourself.

The auxiliary array used during the merge step requires $$\Theta(N)$$ extra space. Note that in-place mergesort is possible; however it is very complex and the runtime suffers by a significant constant factor, so we will not cover it here.

---

## 29.4 Insertion Sort

### Naive Insertion Sort

In insertion sort, we start with an empty output sequence. Then, we select an item from the input, inserting into the output array at the correct location.

Naively, we can do this by creating a completely seperate output array and simply putting items from the input there. You can see a demo of this algorithm [here](http://goo.gl/bVyVCS).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F9VFlMN2LcKDjSI9FdOjZ%2Fimage.png?alt=media&amp;token=bef2ccaa-7332-4ac3-ab9e-79f3d669d60f" alt=""><figcaption><p>Naive insertion sort with a seperate output array</p></figcaption></figure>

For the naive approach, if the output sequence contains $$k$$ items so far, then an insertion takes $$O(k)$$ time (shifting every item over in the output array).

### In-place Insertion Sort

We can improve the time and space complexity of insertion sort by using in-place swaps instead of building a seperate output array. 

You can see a demo of this algorithm [here](https://docs.google.com/presentation/d/10b9aRqpGJu8pUk8OpfqUIEEm8ou-zmmC7b_BE5wgNg0/edit#slide=id.g463de7561_042).

Essentially, we move from left to right in the array, selecting an item to be swapped each time. Then, we swap that item as far to the front as it can go. The front of our array gradually becomes sorted until the entire array is sorted.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F5r5BqnkjNwBr8g0yDqOq%2Fimage.png?alt=media&amp;token=22afa9a3-e2b9-4938-87f5-361a5424cd6b" alt=""><figcaption><p>Insertion sort algorithm. Purple items are the selected item being swapped to the front, and black items are the ones with which the purple items are being swapped.</p></figcaption></figure>

### Insertion Sort Runtime

The best-case runtime of insertion sort is $$\Theta(N)$$--when there are no swaps, we simply do a linear scan through the array. The worst-case runtime of insertion sort is $$\Theta(N^2)$$--in a reverse-sorted array, we have to swap every item all the way to the front. 

#### Insertion Sort Advantages

Note that on sorted or almost-sorted arrays, insertion sort does very little work. In fact, the number of swaps that it does is equal to the number of inversions in the array.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FaloSvhMKKvHo4YJdDJqz%2Fimage.png?alt=media&amp;token=9d614fb0-6334-4587-b4f4-bc85b4a23459" alt=""><figcaption><p>The left array has only 5 inversions, and the right array has only 3. Insertion sort does very little work.</p></figcaption></figure>

In other words, on arrays with a small number of inversions, insertion sort is probably the fastest sorting algorithm. The runtime is $$\Theta(N + K)$$, where $$K$$ is the number of inversions in the array. If we define an almost-sorted array as one where the number of inversions $$K < cN$$ for some constant $$c$$, then insertion sort runs in linear time.

A less obvious empirical fact is that insertion sort is extremely fast on small arrays, usually of size 15 or less. The analysis of this is beyond the scope of the course, but the general idea is that divide-and-conquer algorithms (like heapsort and mergesort) spend too much time on the "dividing" phase, whereas insertion sort starts sorting immediately. In fact, the Java [implementation](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/util/Arrays.java#Arrays.mergeSort%28java.lang.Object%5B%5D%2Cjava.lang.Object%5B%5D%2Cint%2Cint%2Cint%29) of mergesort uses insertion sort when the split becomes less than 15 items. 

---

## 29.5 Summary

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FbNbM9PbratgX0zP1Ali1%2Fimage.png?alt=media&amp;token=9dda719f-1187-498f-a998-d66890e2624e" alt=""><figcaption><p>A summary of the sorts covered so far.</p></figcaption></figure>

#### Overview 

**Inversions.** The number of pairs of elements in a sequence that are out of order. An array with no inversions is ordered.

**Selection sort.** One way to sort is by selection: Repeatedly identifying the most extreme element and moving it to the end of the unsorted section of the array. The naive implementation of such an algorithm is in place.

**Naive Heapsort.** A variant of selection sort is to use a heap based PQ to sort the items. To do this, insert all items into a MaxPQ and then remove them one by one. The first such item removed is placed at the end of the array, the next item right before the end, and so forth until that last item deleted is placed in position 0 of the array. Each insertion and deletion takes O(log N) time, and there are N insertions and deletions, resulting in a O(N log N) runtime. With some more work, we can show that heapsort is θ(N log N) in the worst case. This naive version of heapsort uses θ(N) for the PQ. Creation of the MaxPQ requires O(N) memory. It is also possible to use a MinPQ instead.

**In place heapsort.** When sorting an array, we can avoid the θ(N) memory cost by treating the array itself as a heap. To do this, we first heapify the array using bottom-up heap construction (taking θ(N) time). We then repeatedly delete the max item, swapping it with the last item in the heap. Over time, the heap shrinks from N items to 0 items, and the sorted list from 0 items to N items. The resulting version is also θ(N log N).

**Mergesort.** We can sort by merging, as discussed in an earlier lecture. Mergesort is θ(N log N) and uses θ(N) memory.

**Insertion Sort.** For each item, insert into the output sequence in the appropriate place. Naive solution involves creation of a separate data structure. The memory efficient version of this algorithm swaps items one-by-one towards the left until they land in the right place. The invariant for this type of insertion sort is that every item to the left of position i is in sorted order, and everything to the right has not yet been examined. Every swap fixes exactly one inversion.

**Insertion Sort Runtime.** In the best case, insertion sort takes θ(N) time. In the worst case, θ(N^2) time. More generally, runtime is no worse than the number of inversions.

---

## 29.6 Exercises

### Factual

1. How many inversions are there in the array `[10, 100, 60, 40, 50]`?

2. What is the space complexity of selection sort?

<details>

<summary>Problem 1</summary>

5; the violations are 100 > 60, 100 > 40, 100 > 50, 60 > 40, and 60 > 50.

</details>

<details>

<summary>Problem 2</summary>

$$\Theta(1)$$. All swaps in selection sort happen in-place.

</details>

### Procedural

1. Draw the process of heapsort on the array `[5, 9, 2]`, starting with the heapified array and removing the maximum each time.

2. If we are insertion sorting `[5, 6, 7, 1, 8, 9, 2]`, how many total swaps will occur?

<details>

<summary>Problem 1</summary>

After heapification: `[9, 5, 2]`. We sink in reverse level order, which means that we swap `5` with `9`.

Then, the algorithm proceeds by popping off `9` (`[5, 2 | 9]`), then `5` (`[2 | 5, 9]`), then `2` (`[2, 5, 9]`).

</details>

<details>

<summary>Problem 2</summary>

8; simply count the number of inversions (5 > 1, 5 > 2, 6 > 1, 6 > 2, 7 > 1, 7 > 2, 8 > 2, 9 > 2).

</details>

### Metacognitive

1. Which sort do you expect to run more quickly on a reversed array, selection sort or insertion sort?

<details>

<summary>Problem 1</summary>

Asymptotically, both selection and insertion sort run in $$\Theta(N^2)$$ on a reverse-sorted array. However, note that selection sort only does $$N$$ total swaps (finding the maximum, then swapping to the front), while insertion sort does on the order of $$N^2$$ swaps (swapping each item to the front), so insertion sort will actually be slower by a constant factor.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：字典树：Tries 与前缀检索](/notes/cs61b/lecture-28) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 II：插入排序与归并排序 →](/notes/cs61b/lecture-30) | [🎬 在 B 站观看本讲 (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) |
