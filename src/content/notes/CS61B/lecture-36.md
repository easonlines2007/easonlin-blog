---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 36 · 排序 VI：基数排序 vs 比较排序终极对决：理论复杂度与硬件物理性能、字长 W 的真实代价、缓存局部性与综合选型指南
description: CS61B 第 36 讲：排序 VI：基数排序 vs 比较排序终极对决：理论复杂度与硬件物理性能、字长 W 的真实代价、缓存局部性与综合选型指南
topic: CS61B
order: 36
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:32 ｜ **官方原版**：Lecture 36 - Sorting VI  Radix vs Comparison Sorting  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P36)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1wSTXwNB-D75VbHCtKqnr7QlOQtV-3wg6vTLNpNw7Qwk) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/36.-sorting-and-data-structures-conclusion)  
> **快速导航**：[← 上一讲 (P35 排序 V：非比较排序与基数排序（LSD / MSD）)](/notes/cs61b/lecture-35) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P37 软件工程 IV：大规模系统演进与技术债务) →](/notes/cs61b/lecture-37)

---

## 1. 理论与现实的碰撞：基数排序真的永远比快速排序快吗？

*(参考时间：00:01:25 · [视频跳转 (P36 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=85))*

许多教科书宣称：“基数排序是 $O(N)$ 的，而快速排序是 $O(N \log N)$ 的，因此基数排序必然击败快速排序”。

**这是极具误导性的教条主义！**

### 隐藏在 $O(N)$ 背后的字长因子 $W$
基数排序的真实复杂度是：
$$\Theta(W \cdot N)$$
在 64 位操作系统中，一个普通的整型或指针的二进制位宽是 $W = 64$ 或 $W = 32$。
- 当 $N = 1,000,000$ 时，$\log_2 N \approx 20$；
- 此时比较排序的 $\log_2 N = 20$，**反而远小于字长常数 $W = 32$**！
- 加上基数排序在每一轮中频繁读写计数数组造成的 CPU 缓存未命中（Cache Misses），快速排序的实际运行速度往往显著碾压基数排序！

## 2. 全课程排序算法终极天梯选型决策全景表

*(参考时间：00:11:00 · [视频跳转 (P36 00:11:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=660))*

| 排序算法 | 最好时间 | 平均时间 | 最坏时间 | 空间复杂度 | 稳定性 | 核心适用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **选择排序** | $\Theta(N^2)$ | $\Theta(N^2)$ | $\Theta(N^2)$ | $O(1)$ | 不稳定 | 教学演示、微小内存 |
| **插入排序** | $\Theta(N)$ | $\Theta(N^2)$ | $\Theta(N^2)$ | $O(1)$ | **稳定** | 几乎已有序数组、小规模切片 |
| **堆排序** | $\Theta(N)$ | $\Theta(N \log N)$ | $\Theta(N \log N)$ | **$O(1)$** | 不稳定 | 内存严苛受限、杜绝最坏退化 |
| **归并排序** | $\Theta(N \log N)$ | $\Theta(N \log N)$ | $\Theta(N \log N)$ | $O(N)$ | **稳定** | 稳定对象排序（Java 对象的 TimSort 底座） |
| **快速排序** | $\Theta(N \log N)$ | **$\sim 1.39 N \log N$** | $O(N^2)$ | $O(\log N)$ | 不稳定 | 通用原始基本类型排序（硬件速度之王） |
| **LSD 基数排序** | $\Theta(W N)$ | $\Theta(W N)$ | $\Theta(W N)$ | $O(N + R)$ | **稳定** | 定长短键（身份证号、IP 地址、电话号） |

## 3. 本讲小结与课后自测

*(参考时间：00:20:00 · [视频跳转 (P36 00:20:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36&t=1200))*

### 课后自测
Java 标准库中的 `Arrays.sort()` 在底层是如何选型的？  
**答案**：Java 采用了混合双重策略：  
1. 对基本原始类型（`int[]`, `double[]`）：采用双轴快速排序（Dual-Pivot Quicksort），追求极致的缓存局部性与速度；  
2. 对引用对象类型（`Object[]`）：采用结合了归并排序与插入排序的 **TimSort**，绝对保障排序的稳定性与 $O(N \log N)$ 安全。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 36. Sorting and Data Structures Conclusion

By Mihir Mirchandani and William Lee

---

## 36.1 Radix vs. Comparison Sorting

### Intuitive Analysis

#### Merge Sort Runtime

Merge Sort requires Θ(N log N) compares.

A key concept here is that Merge Sort’s runtime on strings of length W is Θ(N log N) if each comparison takes constant time or Θ(WN log N) if each comparison takes Θ(W) time. 

Example of Θ(N log N): Strings are all different in top character. 

Example of Θ(WN log N): Strings are all equal.

#### LSD vs. Merge Sort

The facts:

Treating alphabet size as constant, LSD Sort has runtime Θ(WN). Merge Sort has runtime between Θ(N log N) and Θ(WN log N).

Which is better? It depends.

##### When might LSD sort be faster?

* When W is sufficiently smaller than N (or equivalently, N is really really big, or as you get to larger and larger numbers of strings, we expect LSD to pull ahead).

* Worst case strings for mergesort, the more similar they are, the more we expect LSD sort to do better. 

* Sufficiently large N.

* If strings are very similar to each other.

  *  Each Merge Sort comparison costs Θ(W) time.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fl8Xcm0AGxxMcn8aUSjeF%2Fimage.png?alt=media&amp;token=8cd61b4b-9e5b-4825-8a02-44cb21b0ecc3" alt=""><figcaption></figcaption></figure>

##### When might Merge Sort be faster?

* Strings are different, especially at the beginning.

* If strings are highly dissimilar from each other

  * Each merge sort comparison is very fast

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fv3m69FnKEbP1PUhgxB8U%2Fimage.png?alt=media&amp;token=bdd6e36a-d46d-410a-a62c-d865704aef77" alt=""><figcaption></figcaption></figure>

### Cost Model Analysis

#### Alternate Approach: Picking a Cost Model

An alternate approach is to pick a cost model.

* We’ll use number of characters examined.

* By “examined”, we mean:

  * Radix Sort: Calling charAt in order to count occurrences of each character.

  * Merge Sort: Calling charAt in order to compare two Strings.

#### MSD vs. Mergesort

Suppose we have 100 strings of 1000 characters each.

For MSD Radix Sort, in the worst case (all strings equal), every character is examined exactly once. Thus, we have exactly 100,000 total character examinations.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FPMp2WMZlfbOKobA69PIu%2Fimage.png?alt=media&amp;token=cf82e97f-6b3b-45b9-8327-6f620e9794c3" alt=""><figcaption></figcaption></figure>

For Merge Sort, estimate the total number of characters examined if all strings are equal.

Merging 100 items, assuming equal items results in always picking left:

* Comparing A\[0] to A\[50]: 2000 character examinations.

* Comparing A\[1] to A\[50]: 2000 character examinations.

* … Comparing A\[49] to A\[50]: 2000 character examinations.

* Total characters examined: 50 \* 2000 = 100000.

* Merging N strings of 1000 characters requires N/2 \* 2000 = 1000N examinations.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FicsTCVNOHVY4LnqihEuT%2Fscreenshot%202023-04-19%20at%2012.46.58%20AM.png?alt=media&amp;token=25ee1bd7-b153-4a80-9fc4-fc78385b86a6" alt=""><figcaption></figcaption></figure>

In total, we must examine approximately 1000N log2 N total characters.

* 100000 + 50000\*2 + 25000 \* 4 + … = \~660,000 characters.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FypgoaHyQK7t05ozMEdEv%2Fimage.png?alt=media&amp;token=2435aca3-60f9-4340-a57e-d6497c871bfe" alt=""><figcaption></figcaption></figure>

#### MSD vs. Mergesort Character Examinations

For N equal strings of length 1000, we found that:

* MSD radix sort will examine \~1000N characters (For N= 100: 100,000).

* Merge sort will examine \~1000Nlog2(N) characters (For N=100: 660,000).<br>

  If character examination are an appropriate cost model, we’d expect Merge Sort to be slower by a factor of log2N.<br>

  To see if we’re right, we’ll need to do a computational experiment.

### Empirical Study: Radix Sort vs. Comparison Sorting

#### Computational Experiment Results (Your Answers)

Computational experiment for W = 100.

* [MSD](https://algs4.cs.princeton.edu/51radix/MSD.java.html) and [merge sort](https://algs4.cs.princeton.edu/22mergesort/MergeX.java.html) implementations are highly optimized versions taken from our optional algorithms textbook.

* Does our data match our runtime hypothesis? No! Why not?

  * Maybe when MSD makes partitions, the divide and conquer cost is not accounted for.

  * Is mergesort optimized to do the timesort optimization? Unclear.

  * Maybe this is caching performance, Josh mentioned MSD has bad cache performance.

  * Maybe string comparison is not linear time somehow (keep in mind every string compare does the SAME thing. Repeated work on real machines these days tends to get optimized away).

  * Our cost model isn’t representative of everything that is happening.

  * One particularly thorny issue: **The “Just In Time” Compiler.**

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FeKflgE7iGuAEK7xOr5hT%2Fimage.png?alt=media&amp;token=12a32b94-38e1-409b-84b9-333491483a3e" alt=""><figcaption></figcaption></figure>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FrZ95YFXDJJVh0pXRLXNL%2Fscreenshot%202023-04-19%20at%201.01.54%20AM.png?alt=media&amp;token=7c1e0b96-1e17-4311-aa30-21839e4aa56c" alt=""><figcaption></figcaption></figure>

---

## 36.2 The Just-In-Time Compiler

Java’s Just-In-Time Compiler secretly optimizes your code when it runs.

* The code you write is not necessarily the code that executes!

* As your code runs, the “interpreter” is watching everything that happens.

  * If some segment of code is called many times, the interpreter actually studies and re-implements your code based on what it learned by watching WHILE ITS RUNNING (!!).

    * Example: Performing calculations whose results are unused.

    * See [this video](https://www.youtube.com/watch?v=oH4_unx8eJQ) if you’re curious.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FDttFIcU4rM7lsTU6dh71%2Fimage.png?alt=media&amp;token=1b549d73-198a-43f5-aecf-65f471c71ba7" alt=""><figcaption></figcaption></figure>

### JIT Example

The code below creates Linked Lists, 1000 at a time.

* Repeating this 500 times yields an interesting result.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FDMhOIbzXpvuhvHs3g1CB%2Fimage.png?alt=media&amp;token=bffbfc80-7e98-4b3c-993c-1aa7fcf89da7" alt=""><figcaption></figcaption></figure>

* First optimization: Not sure what it does.

* Second optimization: Stops creating linked lists since we’re not actually using them.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxtUdru0AZHxHyNmHNDAn%2Fimage.png?alt=media&amp;token=3a01e626-c19e-4ae3-b13c-29892aebf644" alt=""><figcaption></figcaption></figure>

### … So Which is Better? MSD or MergeSort?

The performance of the merge sort algorithm is highly dependent on the presence of just-in-time (JIT) compilation. Specifically, when JIT is enabled, merge sort is faster in cases where the strings being sorted are equal, but slower when JIT is disabled. This suggests that merge sort is generally more effective for this specific case, given that JIT is typically enabled. However, there are numerous other scenarios to consider, including the sorting of almost equal strings, randomized strings, and real-world data from specific datasets. When assessing the effectiveness of merge sort for these alternative cases, it is important to conduct careful experimentation and profiling to determine which sorting algorithm is most suitable. The lectureCode repository provides code for running these experiments, allowing for more precise assessment of algorithm performance under various conditions. Ultimately, real-world applications will require a thorough analysis of different implementations on actual data in order to select the optimal algorithm for the task at hand.

### Bottom Line: Algorithms Can Be Hard to Compare

Comparing algorithms that have the same order of growth can be a difficult task, as it requires conducting computational experiments to determine their relative performance. However, modern programming environments can introduce additional challenges to this process, as certain optimizations such as just-in-time (JIT) compilation in Java can impact the results of experiments. It is worth noting that even small optimizations to an algorithm can have a significant impact on its performance. For instance, a change to the Quicksort algorithm suggested by Vladimir Yaroslavskiy has been shown to provide notable improvements, as discussed briefly in the Quicksort lecture. Therefore, when comparing algorithms with similar growth rates, it is crucial to remain vigilant of potential optimizations and variations that may influence their performance.

### JIT Compilers Are Always Evolving

The JIT (just-in-time) compiler is a highly complex and essential component of modern compilers, and is an active area of research and development in this field. However, the older JIT compiler known as C2 has become increasingly difficult to maintain and extend, with no major improvements implemented in recent years. The codebase for C2 is written in a specific dialect of C++, making it challenging for new engineers to understand and work with. As a result, the codebase is being abandoned in favor of newer and more maintainable alternatives. For individuals interested in this area of study, CS164 offers a course on compilers and there are opportunities for involvement in ongoing research. It is worth noting that the reasons for the improved performance of merge sort with the JIT are not yet fully understood, making it an interesting topic for further research.

---

## 36.3 Radix Sorting Integers

ft. Obama

Obama knows Bubble sort! This is amazing!



**补充说明**

BTW: A 32-bit integer is a normal integer in Java and other programming languages that spans 4 billion values. This is something we learned in Hashing chapter 20 and is a 61C concept!



#### Summary of Video above

Barack Obama gets a Google Interview question: What is the most efficient way to sort a million 32-bit integers? Obama says that he would recommend not using Bubble sort! That's right folks! Obama knows his 61B :smile:.

#### What's the answer?

The answer to this question actually is Radix sort because we know that in a very large N limit, Radix sort is simply fastest as it is linear with runtime Θ(WN) where W is the number of digits and N is the number of integers we are sorting. This is much faster than any Comparison Sort we learned about since the fastest runtimes seem to be Θ(N\*log(N)).

#### But how do we do it?

We don't have a charAt() for every integer. And if we converted all integers to strings, that's a very time expensive operation as well. So how would you LSD radix sort an array of integers? Instead of using charAt, maybe write a helper method like getDthDigit(int N, int d). Example: getDthDigit(15009, 2) = 5.

#### LSD Radix Sort on Integers

Note that we don't have to work with base 10. What we can instead do is increase this base to have less digits in our total number. This is really getting into 61C territory as we haven't really discussed binary representation of integers yet, but essentially what we want to do is convert to hexadecimal, a base 16 number that is represented with the following digits: {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, A, B, C, D, E, F}. Note that A is 10 and F is 15. 0 - 15 is 16 possible values for a digit! To convert a number from decimal (base 10) to hexadecimal (base 16), we do the following:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fuvf9JmlLIkE1hznYq3hl%2FScreen%20Shot%202023-04-19%20at%201.18.26%20AM.png?alt=media&amp;token=bba29e6f-60e1-45f2-80cf-363cae683800" alt=""><figcaption><p>Decimal to Hexadecimal</p></figcaption></figure>

Notice that our original number had 6 digits in base 10 and our resulting number has 5 digits! Notice we don't have to go to just base 16. We can go even bigger to base 256 to only have 3 digits! There are small yet amazing optimizations!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FeCzQGo5LX6fW6lDiFG6Y%2FScreen%20Shot%202023-04-19%20at%201.21.11%20AM.png?alt=media&amp;token=05d91fc2-7a34-45c7-a370-f05c7f1a269b" alt=""><figcaption><p>Decimal to Ducentohexaquinquagesimal (Base 256)</p></figcaption></figure>

Please do not worry about memorizing what "ducentohexaquinquagesimal" is. The only important thing to learn here is that this conversion to higher bases may result in fewer digits for our LSD and MSD Radix sorts to have faster traversals.

However, there is a tradeoff between W, the size of each integer, and the size of the array we need to maintain the counts. The most oprtimal is actually base 256!

---

## 36.4 Summary

**Radix Sort vs. Comparison Sorts.** In lecture, we used the number of characters examined as a cost model to compare radix sort and comparison sort. For MSD Radix Sort, the worst case is that each character is examined once for NM characters examined. For merge sort, MNlogN is the worst case characters examined. Thus, we can see that merge sort is slower by a factor of logN if character comparisons are an appropriate cost model. Using an empirical analysis, however, we saw that this does not hold true because of lots of background reasons such as the cache, optimized methods, extra copy operations, and overall because our cost model does not account for everything happening.

**Just-In-Time Compiler.** The “interpreter” studies your code as it runs so that when a sequence of code is run many times, it studies and re-implements based on what it learns while running to optimize it. For example, if a LinkedList is created many times in a loop and left unused, it eventually learns to stop creating the LinkedLists since they are never used. With the Just-In-Time compiler disabled, merge sort, from the previous section, is indeed slower than MSD Radix Sort.

**Radix Sorting Integers.** When radix sorting integers, we no longer have a charAt method. There are lots of alternative options are stilizing mods and division to write your own getDigit() method or to make each Integer into a String. However, we don’t actually have to stick to base 10 and can instead treat the numbers as base 16, 256, or even base 65536 numbers. Thus, we can reduce the number of digits, which can reduces the runtime since runtime for radix sort depends on alphabet size.

---

## 36.5 Exercises

### Factual

1. What happens when a Java file is compiled? HINT: Think about `.java` and `.class` files.

2. Why can a block of code run faster the second time it executes as compared to the first time?

3. What's the optimal way to sort an array of integers? Assume the integers are uniformly randomly distributed.

<details>

<summary>Problem 1</summary>

When a Java file is compiled, it is transformed from its human-readable `.java` source code format into byte code in a `.class` file format that can be executed by the Java Virtual Machine (JVM).

</details>

<details>

<summary>Problem 2</summary>

If some segment of code is called many times, the interpreter studies and re-implements your code based on what is observed while the code is running. For example, if you create many unused data structures, they might be optimized out of your code.

</details>

<details>

<summary>Problem 3</summary>

As we saw in lecture, LSD sort outperforms quicksort for an array of integers, particularly if we optimize for a better base than base 10.

</details>

### Metacognitive

1. Under what conditions would LSD sort be faster than mergesort?

<details>

<summary>Problem 1</summary>

There are two main cases when LSD sort is much faster than mergesort: when there are a large number of strings (large N), and when all strings are very similar to each other.

When N is really large, we see the asymptotic behavior of LSD sort beat the asymptotic behavior of merge sort, which is slower with a runtime of $$N \log N$$.

When the strings are very similar, then each comparison in merge sort is slow, roughly linear time in the length of the string. Instead of comparing each letter in each string at every merge, LSD only examines the letters of each string once.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 V：非比较排序与基数排序（LSD / MSD）](/notes/cs61b/lecture-35) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：软件工程 IV：大规模系统演进与技术债务 →](/notes/cs61b/lecture-37) | [🎬 在 B 站观看本讲 (P36)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=36) |
