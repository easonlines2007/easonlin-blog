---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 39 · 计算复杂性理论：规约与 P 与 NP 问题：多项式时间 P、非确定性多项式时间 NP、NP 完全性与千禧年数学猜想
description: CS61B 第 39 讲：计算复杂性理论：规约与 P 与 NP 问题：多项式时间 P、非确定性多项式时间 NP、NP 完全性与千禧年数学猜想
topic: CS61B
order: 39
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 7: 软件工程、高级算法与计算理论 (Software Engineering & Complexity)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：47:54 ｜ **官方原版**：Lecture 39 - Computability P=NP  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P39)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1QFwbmMVE0Wlvg-gnWnemTxRX_t7h6IlhCQU69dcAkaA) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np)  
> **快速导航**：[← 上一讲 (P38 数据压缩理论：哈夫曼编码与前缀无关码)](/notes/cs61b/lecture-38) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P40 课程总结与未来航向：61B 之后的大道探索) →](/notes/cs61b/lecture-40)

---

## 1. 问题的可解性边界：多项式时间（Class P）

*(参考时间：00:01:25 · [视频跳转 (P39 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=85))*

在 CS 61B 中，我们见识了许多在多项式时间内能够解决的算法：
- 排序（$O(N \log N)$）；
- 最短路径 Dijkstra（$O(E \log V)$）；
- 动态连通性并查集（$O(N \alpha(N))$）。

### 复杂性类别 P（Polynomial Time）
所有能够在**多项式时间（Polynomial Time, $O(N^k)$ 其中 $k$ 为常数）**内被确定性计算机完全求解的判定问题，统称为 **P 类问题**。这是计算机科学家眼中有现实可行解（Tractable）的基石问题集合。

## 2. 验证与求解的鸿沟：复杂性类别 NP

*(参考时间：00:10:40 · [视频跳转 (P39 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=640))*

考虑一个数独（Sudoku）游戏、或者经典的旅行商问题（TSP, Traveling Salesperson Problem）：
- 如果让你从零找出一个最优解，可能需要指数级 $O(2^N)$ 的暴力穷举搜索；
- **但是：如果别人直接给你一份填好的答案，让你验证这份答案对不对，你只需要几毫秒的多项式时间即可验证完毕！**

### 复杂性类别 NP（Nondeterministic Polynomial Time）
所有能够在**多项式时间内被验证其解答正确性（Polynomial-Time Verifiable）**的判定问题集合，统称为 **NP 类问题**。  
显然，$P \subseteq NP$（任何能在多项式内求解的问题，必然也能在多项式内验证）。

## 3. 规约（Reduction）与 NP-Complete 完全问题

*(参考时间：00:20:15 · [视频跳转 (P39 00:20:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=1215))*

如果我们不知道问题 A 怎么解，但我们能够将问题 A 在多项式时间内**转换为（Reduce to）**已知的问题 B：
那么只要能解出问题 B，就相当于攻克了问题 A！

### 库克-列文定理（Cook-Levin Theorem）与 NP-Complete
1971 年，斯蒂芬·库克证明了布尔可满足性问题（3-SAT）具有超凡的普遍性：**所有的 NP 问题都可以在多项式时间内规约到 3-SAT！**

这诞生了计算机科学最危险的类别——**NP-Complete（NP 完全问题）**：
- NP 完全问题是整个 NP 家族中最艰难的核心硬核堡垒；
- **惊天连锁反应**：**只要有人能在多项式时间内解出任意一个 NP-Complete 问题，那么全人类已知的所有成千上万个 NP 问题都将在瞬间被多项式时间彻底攻破！**

## 4. 千禧年世纪难题：P 是否等于 NP（P vs NP）？

*(参考时间：00:29:30 · [视频跳转 (P39 00:29:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=1770))*

克雷数学研究所将 **P vs NP** 列为世界七大千禧年数学难题之首，悬赏百万美元。

- 如果 $P = NP$：意味着“能够被轻易验证的事物，必然能够被同样轻易地创造出来”！现代基于大数分解的 RSA 密码体系将瞬间瓦解，蛋白质折叠与新药发现将迎来指数级突破；
- 绝大多数计算机科学家倾向于相信 $P \neq NP$，即创造解的难度在本质上远高于验证解。

## 5. 本讲小结与课后自测

*(参考时间：00:37:00 · [视频跳转 (P39 00:37:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=2220))*

### 课后自测思考
当我们在现实工作中遇到一个被证明为 NP-Hard 的问题时，工程师应当放弃吗？  
**答案**：绝对不要放弃！不能求出严格全局最优解，并不妨碍我们设计**多项式近似算法（Approximation Algorithms）**或启发式搜索（如遗传算法、模拟退火），在工程上几秒内求出 99.9% 接近最优的实用解！

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 39. Compression, Complexity, P = NP

- [39.1 Models of Compression](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.1-models-of-compression.md)

- [39.2 Optimal Compression, Kolmogorov Complexity](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.2-optimal-compression-kolmogorov-complexity.md)

- [39.3 Space/Time-Bounded Compression](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.3-space-time-bounded-compression.md)

- [39.4 P = NP](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.4-p-np.md)

- [39.5 Exercises](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.5-exercises.md)

---

## 39.1 Models of Compression

### Comparing Compression Algorithms

In the last chapter, we saw many approaches to compression. This raises an interesting question: for a given bitstream, what is the best algorithm for compression?

For example, consider compression the text of Moby Dick using different compression formats. In this case, `bzip2` yields the best compression.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FO7UqH9ubjgskBevPScdz%2Fimage.png?alt=media&amp;token=3e947dc1-ed7b-4403-a5b2-7dcc1c672412" alt=""><figcaption><p>Different compression formats applied to <code>mobydick.txt</code></p></figcaption></figure>

One might argue, however, that the best possible compression algorithm for `mobydick.txt` is simply as follows:

<pre><code>D(B):

<strong>    if input == 0:

</strong>        return "Call me Ishamel. ...."

    else:

        return the text as is

</code></pre>

Using this as our decompression function, we can condense all of Moby Dick into a single bit!

However, there is a problem with this approach. If we include the code for the decompression algorithm as part of the compressed model (recall compression model 2 from the previous chapter), we see that Moby Dick is not compressed to one bit, but actually requires *more* bits than the original text!

### Decompression Algorithms

Ultimately, the goal of a compresion algorithm is to find short sequences of bits that generate desired longer sequences of bits. Formally stated, our problem is as follows:

* Given a sequence of bits `B`, find a shorter sequence `DA + C(B)` that produces `B` when fed into an interpreter. `DA` represents the bits for the decompression algorithm, while `C(B)` represents the compressed version of `B`.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FMCYkJqoXfJQjA9H4QEtj%2Fimage.png?alt=media&amp;token=8a2f85f6-19f2-410b-a7c4-57ff339cd5c2" alt=""><figcaption><p>Our compression model applied to <code>mobydick.txt</code>.</p></figcaption></figure>

### Improving Compression

Recall the `HugPlant` example from the previous chapter. Using Huffman encoding, we can achieve a compression ratio of 25%. 

However, using another algorithm we'll call `MysteryX` for now, we can compress `HugPlant.bmp` down to 29,432 bits! This achieves a 0.35% compression ratio. Out of the $$2^{8389594}$$ possible bistreams of length $$8,389,594$$, only one in $$2^{8360151}$$ can achieve such a compression ratio.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FhQU7fNItG1XxGIxo6VRl%2Fimage.png?alt=media&amp;token=42238a0b-5344-4478-8f31-00b7716240c0" alt=""><figcaption><p>A mystery compression algorithm that outperforms Huffman encoding by a large margin.</p></figcaption></figure>

What is `MysteryX`? Well, it's simply the Java code `HugPlant.java` written to generate the `.bmp` file! Going back to the model of self-extracting bits, we see the power of code and interpreters in compression. This leads us to two interesting questions:

* **comprehensible compression:** given a target bitstream `B`, can we create an algorithm that outputs useful, readable Java code?

* **optimal compression**: given a target bitstream `B`, can we find the *shortest* possible program that outputs this bitstream?

---

## 39.2 Optimal Compression, Kolmogorov Complexity

### Kolmogorov Complexity

We define the **Kolmogorov complexity** of a bitstream `B` to be the shortest bitstream $$C\_B$$ that outputs `B`. Let the *Java-Kolmogorov complexity* $$K\_J(B)$$ be the shortest Java program that generates `B`.

Note that for any bitstream $$B$$, $$K(B)$$ definitely exists. However, finding and proving $$K(B)$$ might be difficult or even impossible.

#### Languages and Complexity

An important thing to note is that Kolmogorov complexity is language-independent. To run any program in one language in another, all I have to do is write an interpreter. For example, if I want to run a Python program that is not easily translatable to Java, I could instead just write a Java interpreter to read the text of the Python program and run it. In this case, $$K\_J(B) \leq K\_P(B) + I$$, where $$I$$ is the length of the interpreter (a constant value).

This highlights a very deep fact about Kolmogorov complexity: most bitstreams are fundamentally incompressible no matter which language we choose for our compression algorithm.

Consider a bitstream of 1,000,000 bits. Out of all compression algorithms possible, only 1 in $$2^{4999999}$$ bitstreams have a change of being compressed by more than 50% (499,999 bits or less).

#### Uncomputability

Another important fact regarding Kolmogorov complexity is that it is impossible to compute. A proof of this fact is provided [here](https://en.wikipedia.org/w/index.php?title=Kolmogorov_complexity#Uncomputability_of_Kolmogorov_complexity).

Practically, this means that it is impossible to write a "perfect" (optimal) compression algorithm, since we can't even compute the length of the shortest program!

---

## 39.3 Space/Time-Bounded Compression

As described in the previous chapter, it is impossible to write the "perfect" compression algorithm that requires the fewest bits to output some bitstream $$B$$. 

### Space-Bounded Compression

However, what about the problem of space-bounded compression? In this problem, we take in two inputs: a bitstream $$B$$ and a target size $$S$$. The goal, then, is to find a program of length $$\leq S$$ that outputs $$B$$. 

It turns out that such a problem is also uncomputable. If it were, then we could simply binary search on different values of $$S$$ to find the optimal compression program size, which is impossible as shown in te previous section.

### Space-Time-Bounded Compression

What if we take our problem from above, and add a constraint that we can run at most $$T$$ lines of bytecode?

It might seem unintuitive, but this kind of problem is actually solvable. We will use the following algorithm:

```

for length L = 1....S:

    for each possible program P of length L:

        while (P is running && !(B is outputted) && lines_executed < T):

            run the next line of P

```

The runtime of this algorithm is $$O(T \cdot  2^S)$$, and in the end, it will either output some program `P` that has the correct output and is bounded by $$T$$ and $$S$$, or return that no such program is possible.

### Efficient Bounded Compression

The runtime above is exponential in $$S$$. Thus, we might ask if it's possible to solve the space-time-bounded compression problem *efficiently*. As we'll see in the next chapter, this depends on our definition of efficiency.

---

## 39.4 P = NP

### Reductions

It turns out that space-time-bounded compression reduces to 3SAT, INDSET, LONGESTPATH, and many other hard problems. (The actual proof of such reductions is incredibly complex and ommitted from this textbook).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FzNxXfJvAA7l9tDxIlBQK%2Fimage.png?alt=media&amp;token=d3fbfeff-3071-4176-aed8-f47f8ff2e337" alt=""><figcaption><p>Space-time-bounded compresion can be solved with LONGEST_PATH.</p></figcaption></figure>

The reason that space-time-compression can be turned into longest paths (or any other problem mentioned above) is that all these problems are part of a **complexity class** known as **NP**. A property of such problem is that any NP problem can be reduced to any NP-complete problem, including longest paths.

In subsequent section, we will briefly cover what P, NP, and complexity classes are. However, most of these topics are far beyond the scope of this textbook or course, and would be better served by taking an upper-level algorithms course.

### P and NP

All yes/no problems can be divided into two main classes:

* P: efficiently solvable problems.

* NP: problems with solutions that are efficiently verifiable. This means that given an answer to the problem, you can efficiently check whether the answer is correct or not.

Examples of problems in P include (note that P is a subset of NP):

* Is this array sorted? 

  * This can be solved by sorting the array using any sorting algorithm, and verified by checking that adjacent elements are increasing.

* Does this array have duplicates?

  * This can be solved with a double for-loop, and verified in a similar manner.

Examples of problems in NP include:

* Is there a solution to this 3SAT problem?

  * Generating a solution to a 3SAT problem is difficult, but given an assignment of symbols to booleans, you can simply plug in the values and check that the equation is satisfied.

* In graph G, does there exist a path from s to t of weight > k?

  * Genearting a solution to this (essentially longest paths) is difficult, but given a path, you can easily verify if it is a valid path from s to t and that its weight is > k.

Examples of problems not in NP include:

* Is this the best chest move I can make next?

  * There is no efficient way to verify that a chess move is indeed optimal, unless you draw out all possibilities for all subsequent moves.

* What is the longest path?

  * This is not a yes-no question.

### NP-Completeness

An unexpected property of NP problems is that every NP problem reduces to every NP-complete problem. This reduction is also "efficient", in that the problem can be transformed (pre-processed and post-processed) in polynomial time.

This also means that solving any NP-complete problem essentially solves all problems in NP. As of today, there are tens of thousands of known NP-complete problems, but none of them have been solved yet.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F2dBm6rom80OW1pQ3AQyZ%2Fimage.png?alt=media&amp;token=7c685324-f9fb-45ad-84bc-c66f41a47c3b" alt=""><figcaption><p>NP-complete problems and reductions.</p></figcaption></figure>

### P = NP?

An open question in computer science is whether P = NP; in other words, are all problems with efficiently verifiable problems (NP) also efficiently solvable (P)?

One reason to suggest that P = NP might be true is that checking an answer is always efficient. Thus, given the right pruning, could we efficiently zero in on an answer?

---

## 39.5 Exercises

### Factual

1. True/false: suppose we have a 45000-bit program in Python that outputs a bitstream B. What is the maximum size of an interpreter written in Java that proves the Java-Kolmogorov complexity is less than 100,000?

2. What are the two defining properties of an NP problem?

<details>

<summary>Problem 1</summary>

The interpreter must be 55,000 bits or less. If it is, we can simply decompress the bitstream by running the Python program in the interpreter, using less than 100000 bits total (program + interpreter).

</details>

<details>

<summary>Problem 2</summary>

* The problem is a yes-no problem.

* A solution to the problem is efficiently verifiable.

</details>

### Procedural

1. What is the probability that some sequence of 1 million bits could be compressed to 900,000 bits or less?

<details>

<summary>Problem 1</summary>

There are $$2^{1000000}$$ bit sequences of length 1 million, but only $$2^0 + 2^1 + ... 2^{899999} + 2^{900000} = 2(2^{900000}) - 1 \approx 2^{900001}$$ bit sequences of length 900,000 or less. This means that the probability of any bitsequence being compressed to 900,000 bits or less is $$\frac{2^{900001}}{2^{1000000}} = \frac{1}{2^{99999}}$$.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：数据压缩理论：哈夫曼编码与前缀无关码](/notes/cs61b/lecture-38) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：课程总结与未来航向：61B 之后的大道探索 →](/notes/cs61b/lecture-40) | [🎬 在 B 站观看本讲 (P39)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39) |
