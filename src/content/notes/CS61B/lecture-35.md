---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 35 · 排序 V：非比较排序与基数排序（LSD / MSD）：计数排序原理、稳定性保障、低位优先 LSD、高位优先 MSD 与字符集分治
description: CS61B 第 35 讲：排序 V：非比较排序与基数排序（LSD / MSD）：计数排序原理、稳定性保障、低位优先 LSD、高位优先 MSD 与字符集分治
topic: CS61B
order: 35
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:18 ｜ **官方原版**：Lecture 35. Sorting V - More Quicksort Radix Sorts  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/14jNEZC-YKUuxIr3Cxsvz1Kb6eX0jCjvjevb1zD8NRj4) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/35.-radix-sorts)  
> **快速导航**：[← 上一讲 (P34 软件工程 III：软件工程伦理与技术反思)](/notes/cs61b/lecture-34) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P36 排序 VI：基数排序 vs 比较排序终极对决) →](/notes/cs61b/lecture-36)

---

## 1. 打破下界枷锁：非比较排序（Non-Comparison Sorting）的登场

*(参考时间：00:01:25 · [视频跳转 (P35 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=85))*

在上一讲中，我们证明了比较排序的理论下界是 $\Omega(N \log N)$。  
但是，如果我们排序的元素不是抽象的黑盒对象，而是具有固定位长结构的数字或定长字符串，我们能否突破这道封印？

**答案是：非比较排序能够在 $O(N)$ 线性时间内完成排序！**

## 2. 计数排序（Counting Sort）：基于频率统计的绝对线性排序

*(参考时间：00:09:40 · [视频跳转 (P35 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=580))*

假设待排序数组中的所有数值都在有限的小范围 $[0, R-1]$ 内（如学生考试分数 $0 \sim 100$）：
1. **频率统计**：创建一个大小为 $R$ 的计数数组 `count[]`，统计每个数值出现的总频次；
2. **前缀和累计**：将 `count[]` 转化为累积起始索引位置；
3. **稳定写回**：从原数组反向扫描，按索引将元素直接放入辅助数组。

总时间复杂度为极致的 **$\Theta(N + R)$**！当基数 $R$ 远小于数据量 $N$ 时，这是纯粹的线性时间！

## 3. 基数排序之低位优先（LSD Radix Sort）

*(参考时间：00:19:15 · [视频跳转 (P35 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=1155))*

如果要排序长度为 $W$ 的长字符串或大整数，直接做计数排序会导致 $R$ 极其庞大。

**LSD（Least Significant Digit First）算法**从最不重要的最低位开始，依次向最高位推进：
> **核心法则**：  
> **从右向左，对每一位分别运行一次稳定的计数排序（Stable Counting Sort）！**

### 为什么从右往左是正确的？
因为计数排序是**稳定（Stable）**的！当按照更高有效位进行排序时，如果两者的当前位相同，之前低位排好的相对顺序会被完整保留下来！  
进行 $W$ 轮稳定计数排序后，整体必然完全有序！总时间严格为 **$\Theta(W \cdot (N + R))$**！

## 4. 基数排序之高位优先（MSD Radix Sort）

*(参考时间：00:28:30 · [视频跳转 (P35 00:28:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=1710))*

**MSD（Most Significant Digit First）算法**从最高位向低位推进，类似字典树分治：
1. 根据第一位字符将数据分流到 $R$ 个不同的桶中；
2. 递归地对每一个桶内部的数据按下一位字符继续排序。

适用于变长字符串排序，但需要注意当递归到小切片时，切换为插入排序以消除递归调用开销。

## 5. 本讲小结与课后自测

*(参考时间：00:36:00 · [视频跳转 (P35 00:36:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2160))*

### 课后综合自测题
如果对 LSD 基数排序中的子排序使用不稳定的堆排序，LSD 还能正确工作吗？  
**答案与解析**：  
**绝对不能！** LSD 的正确性 100% 依赖于子排序的**稳定性（Stability）**。如果不稳定，高位排序会瞬间打乱之前低位排序建立的相对次序，导致最终结果完全错误。

## 6. LSD 基数排序完整 Java 算法实现与逐行解析

*(参考时间：00:42:00 · [视频跳转 (P35 00:42:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2520))*

让我们编写一个用于对定长字符串（每个字符串长度恰好为 $W$）进行升序排序的完整 LSD 实现：

```java
public class LSD {
    private static final int R = 256; // 扩展 ASCII 字符集大小

    /** 对定长为 W 的字符串数组 a 进行 LSD 基数排序 */
    public static void sort(String[] a, int W) {
        int N = a.length;
        String[] aux = new String[N];

        // 核心铁律：从右往左（最低位 d = W-1 到最高位 d = 0）
        for (int d = W - 1; d >= 0; d--) {
            int[] count = new int[R + 1];

            // 1. 统计当前第 d 个字符出现的频率
            for (int i = 0; i < N; i++) {
                char c = a[i].charAt(d);
                count[c + 1]++;
            }

            // 2. 计算前缀和：将频率转化为目标索引区间
            for (int r = 0; r < R; r++) {
                count[r + 1] += count[r];
            }

            // 3. 稳定写回辅助数组
            for (int i = 0; i < N; i++) {
                char c = a[i].charAt(d);
                aux[count[c]++] = a[i];
            }

            // 4. 将辅助数组拷回原数组
            System.arraycopy(aux, 0, a, 0, N);
        }
    }
}
```
经过严格的 $W$ 轮稳定计数排序，原数组在 $O(W(N + R))$ 内完全排好！

## 7. 深入三向字符串快速排序（3-Way String Quicksort）

*(参考时间：00:48:30 · [视频跳转 (P35 00:48:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2910))*

MSD 基数排序虽然快，但在遇到大量公共长前缀时会创建过多小数组。结合了 MSD 与快速排序智慧的巅峰之作是**三向字符串快速排序（3-Way String Quicksort）**：

### 算法执行逻辑
在当前字符位置 $d$ 上，挑选一个字符作为 Pivot：
- 小于 Pivot 字符的字符串分流到左侧；
- **精确等于 Pivot 字符的字符串分流到中间，在递归时字符指针步进到 $d + 1$**！
- 大于 Pivot 字符的字符串分流到右侧。

它兼具快速排序原地原地划分的极低内存开销，与基数排序在公共前缀跳跃的优势，是全 Java 字符串排序的顶级工程解。

## 8. MSD 基数排序递归分流与小数组插入排序平滑切换

*(参考时间：00:54:00 · [视频跳转 (P35 00:54:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=3240))*

在工业级 MSD 基数排序实现中，必须警惕“小数组递归陷阱”：
- 随着递归向下推进，字符集不断分裂，子数组规模会缩减到仅有几个元素；
- 为这几个元素反复分配大小为 $R = 256$ 的计数数组，会导致时间和空间开销急剧失控！
- **工业级平滑切换策略**：
  ```java
  private static final int CUTOFF = 15; // 阈值常数
  if (hi <= lo + CUTOFF) {
      insertionSort(a, lo, hi, d); // 切换为插入排序
      return;
  }
  ```
通过在小切片上切换为插入排序，消除了高达 90% 的小数组递归开销，性能达到极致。

## 9. 工业级基数排序优化：32 位整数的掩码提取与 4 轮超高速字节分桶

*(参考时间：00:58:30 · [视频跳转 (P35 00:58:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=3510))*

在工业界对海量 32 位整型数据（`int[]`）进行极速排序时，最快的方案并非按十进制取模，而是将 32 位划分为 **4 个 8 位的字节（Byte）**：
- 基数 $R = 2^8 = 256$；
- 轮数 $W = 4$；
- 通过硬件位移与掩码提取字节：`int digit = (a[i] >> (d * 8)) & 0xFF;`
- 处理负数符号位：在最后一轮最高字节时，将最高符号位进行偏置反转（Flip sign bit `^ 0x80`）；
- 此方案完全规避了慢速的除法与取模运算，直接通过 CPU 硬件位移与 L1 缓存命中完成，每秒可对上千万个整数完成排序！

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 35. Radix Sorts

By Mihir Mirchandani

---

## 35.1 Counting Sort

Imagine if instead of driving a slow Honda Civic, we started driving a fast Ferrari. Unfortunately, we won't actually be driving in a Ferrari today, but we will witness a blazing fast algorithm that's just as fast called Radix Sorts. 

When sorting an array, sorting requires $$\Omega(N \log N)$$compare operations in the worst case (array is sorted in descending order). Thus, the ultimate comparison based sorting algorithm has a worst case runtime of $$\Theta(N \log N)$$.

From an asymptotic perspective, that means no matter how clever we are, we can never beat Merge Sort’s worst case runtime of $$\Theta(N \log N)$$. But what if we don't compare at all?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FfO3Soswe0bCDHeCuMipB%2FScreen%20Shot%202023-04-15%20at%202.26.42%20AM.png?alt=media&amp;token=d0524a55-9ab4-45fa-a7d0-e267facc29bd" alt=""><figcaption><p>Left is original, right is ordered output</p></figcaption></figure>

Essentially what just happened is that we first made a new array of the same size and then just copied all of the # indexes to the correct location. So first we look at 5 Sandra Vanilla Grimes and then copy this over to the 5th index in our new array.

This does guarantee $$\Theta(N)$$ worst case time. However what if we were working with 

* Non-unique keys.

* Non-consecutive keys.

* Non-numerical keys.

All of these cases are complex cases that aren't so simple to deal with. Essentially what we can do is create a simpler method which is to:

* Count number of occurrences of each item.

* Iterate through list, using count array to decide where to put everything.

Bottom line, we can use counting sort to sort $$N$$ objects in $$\Theta(N)$$ time. 

---

## 35.2 LSD Radix Sort

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F17vIG2wxJU2Fahu8r2Lb%2FScreen%20Shot%202023-04-15%20at%202.44.24%20AM.png?alt=media&amp;token=2613ad28-5c06-429b-93d4-cdb5949ce42d" alt=""><figcaption><p>Least Significant Digit Radix Sort -- Using Count Sort</p></figcaption></figure>

Notice in the above picture that we had a completely random input of numbers 22, 34, 41, etc. Then in the second box, we had sorted by right most digit, so 41, 41, 31 would come first as 1 is the lowest rightmost digit. Next would come 32, 22, 12, as 2 is the second least rightmost digit. Notice that we still have to take care of sorting 32, 22, and 12 which is why we move to the second right most digit in our last box which has everything sorted. 

What is the runtime of LSD sort?

* $$\Theta(WN+WR)$$

* $$N$$: Number of items, $$R$$: size of alphabet, $$W$$: Width of each item in # digits

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FzLGidJKP8E2n2Fn1CpRU%2FScreen%20Shot%202023-04-15%20at%202.49.06%20AM.png?alt=media&amp;token=e803ef6a-a8f4-4a69-bb65-c4c110da338b" alt=""><figcaption><p>Non-equal Key Lengths</p></figcaption></figure>

---

## 35.3 MSD Radix Sort

Basic idea: Just like LSD, but sort from leftmost digit towards the right.

<details>

<summary>Suppose we sort by topmost digit, then middle digit, then rightmost digit. Will we arrive at the correct result?    </summary>

No, this will result in sorting the array by right most digit only as we are not saving the topmost and middle digit.

</details>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FhqNX7UJTdZgipXuyMSuP%2FScreen%20Shot%202023-04-15%20at%202.55.34%20AM.png?alt=media&amp;token=dcc41166-3464-4114-8ded-10f7239ada3f" alt=""><figcaption><p>MSD Radix Sort (correct edition)</p></figcaption></figure>

Notice first we sorted by leftmost digit. Then we grouped the data by the leftmost digit, so one group would start with a's, then the next group would start with b's, and so on and so forth. Then within our subgroups we would order by middle digit, and create newer subgroups. And finally we would break this up into further subgroups until we have all individual subproblems. This final result would be sorted.

#### Runtimes

Best Case. 

* We finish in one counting sort pass, looking only at the top digit: $$\Theta(N+R)$$

Worst Case.

* We have to look at every character, degenerating to LSD sort: $$\Theta(WN+WR)$$

#### Summary of Runtimes

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FcfQFyXOaFTfZA88SQO84%2FScreen%20Shot%202023-04-15%20at%202.58.27%20AM.png?alt=media&amp;token=d1f1cd73-4039-44fd-acd9-75fa91285246" alt=""><figcaption></figcaption></figure>

---

## 35.4 Summary

**Terminology.**

* Radix - just another word for ‘base’ as in the base of a number system. For example, the radix for words written in lowercase English letters is 26. For number written in Arabic numerals it is 10.

* Radix sort - a sort that works with one character at a time (by grouping objects that have the same digit in the same position).

* Note: I will use ‘character’ and ‘digit’ interchangably in this study guide.

**Counting Sort.** Allows you to sort $$N$$ keys that are integers between $$0$$ and $$R-1$$ in $$\Theta(N+R)$$time. Beats linearithmic lower bound by avoiding any binary compares. This is a completely different philosophy for how things should be sorted. This is the most important concept for this lecture.

**LSD.** In the LSD algorithm, we sort by each digit, working from right to left. Requires examination of $$\Theta(WN)$$digits, where $$W$$is the length of the longest key. Runtime is $$\Theta(WN+WR)$$, though we usually think of $$R$$ as a constant and just say $$\Theta(WN)$$. The $$\Theta(WR)$$ part of the runtime is due to the creation fo length $$R$$ arrows for counting sort. We usually do LSD sort using counting sort as a subroutine, but it’s worth thinking about whether other sorts might work as well.

**LSD vs Comparison Sorting.** Our comparison sorts, despite requiring $$\Theta(N\cdot logN)$$ time, can still be faster than LSD sort. For extremely large N, LSD sort will naturally win, but log N is typically pretty small. Know which algorithm is best in the two extreme cases of very long dissimilar strings and very long, nearly equal strings.

**MSD.** In MSD sorting, we work from left to right, and solve each resulting subproblem independently. Thus, for each problem, we may have as many as $$R$$ subproblem. Worst case runtime is exactly the same as LSD sort, $$\Theta(WN+WR)$$, though can be much better. In the very best case, where we only have to look at the top character (only possible for $$R>N$$), we have a runtime of $$\Theta(N+R)$$.

---

## 35.5 Exercises

### Factual

1. If we use counting sort to sort all 61B students by the number of siblings they have, how long will the counting array be? Let $$N$$ be the total number of students and $$M$$ be the maximum number of siblings a student has.

2. When performing a radix sort like LSD or MSD, which of the following sorting algorithms could we use for each digit?

   * [ ] Counting sort

   * [ ] Heapsort

   * [ ] Mergesort

   * [ ] Selection sort

3. If we're sorting N lowercase english strings using MSD sort, what is the maximum number of subproblems after considering only the the most significant digit?

<details>

<summary>Problem 1</summary>

The counting array will have $$M$$ entries. In general for counting sort, the count array's length only needs to be equal to the maximum number of unique elements we are counting.

</details>

<details>

<summary>Problem 2</summary>

Recall that the sub-sort for each digit must be stable. This rules out heapsort and selection sort.

* [x] Counting sort

* [ ] Heapsort

* [x] Mergesort

* [ ] Selection sort

</details>

<details>

<summary>Problem 3</summary>

26, since there are 26 possible values for the first digit we're sorting on.

</details>

### Metacognitive

1. What are some advantages of counting sort over quicksort?

2. Why do we use LSD over counting sort?

3. If we use MSD radix sort, we start with a single problem of size N, where N is the number of strings. Depending on the results on the most significant digit, we end up with a larger number of smaller subproblems, i.e. we're doing some divide and conquer. In the worst case, we end up with only one subproblem, also of size N. When does this happen?

<details>

<summary>Problem 1</summary>

Many correct answers, but some advantages include:

* For sufficiently large N, counting sort is faster (since it is linear as compared to N log N).

* Counting sort is stable, since we scan from the first element to the last.

* Counting sort doesn't use comparisons between elements, which might be useful if elements are not comparable.

</details>

<details>

<summary>Problem 2</summary>

Counting sort is technically faster than LSD, since counting sort doesn't require splitting up items by digits/letters. However, counting sort can require extremely large amounts of memory in some cases (for example, when sorting `String`s, you need one entry in an array for every possible `String`). 

</details>

<details>

<summary>Problem 3</summary>

This happens when items start with the same digit. In this case, all items end up in the same subgroup after the first iteration of MSD, and we recurse on a problem of size N.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：软件工程 III：软件工程伦理与技术反思](/notes/cs61b/lecture-34) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 VI：基数排序 vs 比较排序终极对决 →](/notes/cs61b/lecture-36) | [🎬 在 B 站观看本讲 (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) |
