---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 40 · 课程总结与未来航向：61B 之后的大道探索：40 讲全景知识复盘、十大工程心法、后续进阶课程与成为卓越架构师之路
description: CS61B 第 40 讲：课程总结与未来航向：61B 之后的大道探索：40 讲全景知识复盘、十大工程心法、后续进阶课程与成为卓越架构师之路
topic: CS61B
order: 40
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 7: 软件工程、高级算法与计算理论 (Software Engineering & Complexity)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：55:47 ｜ **官方原版**：Lecture 40 - Summary  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1MmnYUoi-4Wyt6_3BcBdt_WkrL1XECZ9ypCyUmhW7e2U)  
> **快速导航**：[← 上一讲 (P39 计算复杂性理论：规约与 P 与 NP 问题)](/notes/cs61b/lecture-39) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ <span>下一讲：无（全书完结）</span>

---

## 1. 漫长而辉煌的旅程：CS 61B 40 讲全景知识树复盘

*(参考时间：00:01:25 · [视频跳转 (P40 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=85))*

恭喜你！经过 40 讲高强度的智力洗礼，你已经完整攀登了 UC Berkeley 计算机科学本科体系中最具份量的一座高峰。

让我们回顾这幅波澜壮阔的知识全景图：
1. **语言基石与内存拓扑**：Java 静态编译架构、比特盒模型、等号黄金法则、栈堆内存分离、裸指针与 IntList；
2. **面向对象与工程封装**：哨兵节点模式、类不变量、访问控制、双向循环链表、动态扩容 AList 均摊分析；
3. **类型体系与抽象屏障**：接口继承与实现继承、多态分派、`Comparable` 与 `Comparator` 策略模式、迭代器模式、Object 基石契约；
4. **渐进分析与并查集**：Big-Theta 形式化推导、树高对数绑定证明、加权快速并查集、路径压缩与阿克曼反函数；
5. **树形结构与自平衡之美**：BST 与 Hibbard 删除、2-3 树向上生长哲学、左倾红黑树（LLRB）旋转同构、哈希表与鸽巢碰撞；
6. **图论与网络流**：DFS 递归栈、BFS 最短步数、拓扑排序、Dijkstra 最短路径、A* 启发式导航、最小生成树割定理与 Prim/Kruskal；
7. **排序与计算复杂性**：堆排序、归并排序、快速排序三向切分、$\Omega(N \log N)$ 理论下界、基数排序、哈夫曼压缩与 P vs NP。

## 2. 终身受用的 CS 61B 十大工程心法

*(参考时间：00:12:00 · [视频跳转 (P40 00:12:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=720))*

走出 61B 的课堂，Java 语法可能会随着时间淡忘，但以下十大工程心法将融入你的工程师血液中，伴随你的整个职业生涯：

1. **测试驱动开发（TDD）**：永远在动手写业务代码之前编写测试，测试套件是重构的最大底气；
2. **类不变量高于一切**：明确定义对象状态的不可动摇公理，让每个方法收尾时维护不变量；
3. **哨兵节点消除特判**：用统一的物理拓扑消除丑陋的 `if (null)` 特殊分支；
4. **几何扩容均摊常数**：翻倍是均摊 $O(1)$ 的数学秘密，算术加法是性能泥潭；
5. **组合优于继承**：谨防脆弱基类，优先使用接口契约与策略对象；
6. **防范内存游离**：在容器中删除引用对象时，主动置空斩断指针，保护垃圾回收器；
7. **可变对象不作哈希键**：避免哈希表幽灵僵尸内存惨剧；
8. **树高决定算法生死**：小树挂大树、旋转同构、对数高度是效率的永恒护城河；
9. **内容寻址与哈希指纹**：SHA-1 与不可变有向无环图是分布式系统与区块链的共同基石；
10. **拥抱抽象，直面底层**：既具备在最高层抽象设计接口的架构眼光，又拥有直透操作系统与硬件内存比特的微观洞察力。

## 3. 伯克利后续航向：从 61B 出发能走多远？

*(参考时间：00:23:45 · [视频跳转 (P40 00:23:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=1425))*

征服 61B 之后，你已经掌握了计算机世界通用的数据结构罗盘。以下是 UC Berkeley 为勇士铺设的下一站进阶殿堂：

- **CS 61C: Great Ideas in Computer Architecture**（计算机体系结构）：  
  钻入硬件深处，学习 C 语言、汇编指令集（RISC-V）、数字逻辑电路、流水线 CPU、多核并行与 GPU 加速；
- **CS 170: Efficient Algorithms and Intractable Problems**（高效算法与复杂性）：  
  理论算法殿堂，深入线性规划、网络流、动态规划数学证明、随机算法与 NP 完全性；
- **CS 162: Operating Systems and System Programming**（操作系统）：  
  从零编写一个工业级操作系统内核，搞定进程线程调度、虚拟内存映射、并发锁与分布式文件系统。

## 4. 寄语：走向卓越软件架构师之路

*(参考时间：00:33:00 · [视频跳转 (P40 00:33:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=1980))*

Josh Hug 教授在结课时曾深情寄语：  
“计算机科学最令人心醉神迷之处，在于你只需要一张键盘、一个终端和纯粹的逻辑思维，就能够从虚无中凭空构建出运行精密、造福数以亿计人类的庞大软件宇宙。”

带着 61B 赋予你的严谨、勇气与对优雅架构的执着追求，勇敢地去构建属于你的软件传奇吧！

---

## 附录：官方课件核心考点与研讨全景 (In-Class Discussion & Problem Walkthroughs)

> **导读说明**：本节内容提炼自 UC Berkeley CS61B 官方幻灯片课件，收录了教授在课堂上深度互动的核心思考题、代码追踪题与期中总结考点。

### 官方课件全景研讨与逐题剖析 (Slide Questions & Exam Review)


#### Wrapping Things Up


#### Lecture 40


#### CS61B, Spring 2024 @ UC Berkeley


#### Slide Credit: Josh Hug


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### 61B in 12 Minutes or Less


#### Where We Started

- Just 14 weeks ago:
- What We’ve Learned about Programming Languages
- Object based programming: Organize around objects.
- Object oriented programming:
- Interface Inheritance.
- Implementation inheritance.
- Dynamic vs. static typing.
- Generic Programming, e.g. ArrayList<Integer>, etc.
- The model of memory as boxes containing bits.
- Bit representation of positive integers.
- Java.
- Some standard programming idioms/patterns:
- Objects as function containers (e.g. Comparators, IntUnaryFunctions).
- Default method specification in interfaces (Link).
- Iterators.
- Example: Programmer only needs to know List API, doesn’t have to know that ArrayList secretly does array resizing.
- Example: Array is a sequence of boxes. An array variable is a box containing address of sequences of boxes.

#### Important Data Structures in Java

- Important data structure interfaces:
- java.util.Collection (and its subtypes).
- With a special emphasis on Map (and its subtypes).
- Our own Collections (e.g. Map61B, Deque): Didn’t actually extend Collection.
- Concrete implementations of these abstract implementations:
- Examples: ArrayDeque implements Deque.
- Mathematical Analysis of Data Structure/Algorithm Performance
- Asymptotic analysis.
- O(·), Ω(·), Θ(·), and tilde notation.
- Worst case vs. average case vs. best case.
- Exemplar of usefulness of average case: Quicksort
- Determining the runtime of code through inspection (often requires deep thought).
- Multiplicative resizing is much better than additive resizing.
- Multiplicative resizing results in Θ(1) add runtime for ArrayLists.
- Additive resizing results in Θ(N) add runtime for ArrayLists.

#### PQ


#### List


#### Set


#### Map


#### DisjointSets


#### Chaining HT


#### LinkedList


#### Resizing Array


#### Heap


#### Red Black


#### BST (no balancing)


#### B-Trees (2-3 / 2-3-4)


#### Heap


#### Ordered Linked List


#### Balanced Tree


#### Resizing Array


#### LinkedList


#### Quick Find


#### Quick Union


#### WeightedQuickUnionUF


#### WQUPC

- Some Examples of Implementations for ADTs

#### Trie


#### Graph


#### Adjacency Matrix


#### Edge List


#### Adjacency Lists


#### Arrays vs. Linked Data Structures

- Array-Based Data Structures:

#### ArrayLists and ArrayDeque

- HashSets, HashMaps, MyHashMap: Arrays of ‘buckets’
- ArrayHeap (tree represented as an array)

#### Linked Data Structures


#### Linked Lists

- LinkedList, IntList, LinkedListDeque, SLList, DLList
- Trees: Hierarchical generalization of a linked list. Aim for bushiness.
- TreeSet, TreeMap, BSTMap, Tries (trie links often stored as arrays)
- Graphs: Generalization of a tree (including many algorithms).
- Tradeoffs of array-based vs. linked data structures.
- Write out code that inserts into a tree, for example. How find 5th largest, that sort of thing.

#### Tractable Graph Problems and Algorithms


#### Reachability


#### Topological Sort


#### Multiple Target


#### Shortest Paths by Total Edge Weight

- Single Target Shortest Paths by Total Edge Weight

#### Multiple Target


#### Shortest Paths by # of Edges


#### BFS Traversal


#### DFS Traversal


#### Dijkstra’s


#### A*


#### Bipartiteness


#### Cycle Detection


#### Minimum Spanning Tree


#### Minimum Spanning Tree


#### shortest path


#### shortest paths tree


#### Prim’s


#### Kruskal’s


#### shortest paths tree


#### vertex markings


#### vertex ordering


#### Discussed in section


#### DAGSPT

- Search-By-Key-Identity Data Structures:

#### Set


#### 2-3 Tree


#### RedBlack


#### External Chains


#### Linear Probing


#### Map


#### Searches using compareTo()


#### Analogous to Comparison-Based


#### Searches using hashCode() and equals()


#### Roughly Analogous to Integer Sorting

- Comparison Based Sorting Algorithms: Ω(N log N) worst case

#### Selection


#### Insertion


#### Merge


#### Partition


#### Counting


#### LSD


#### MSD


#### Counting

- Radix Sorting Algorithms: Θ(NW) worst case:
- Small-Alphabet (Integer) Sorting Algorithms: Θ(N) worst case

#### (require a sorting subroutine)


#### If store in helper BST, eq. to


#### If heapify first


#### Heapsort


#### Trie / TST

- Searches by digit. Analogous to Radix Sorting

#### Fun/Weird Topics (This Week)

- Compression:
- Huffman Coding, and selection of data structures for Huffman Coding.
- Other approaches: LZW and Run Length Encoding (extra slides).
- Compression, Complexity, and P=NP:
- Optimal compression is impossible.
- Bounded space/time compression is possible if P=NP.
- Allows you to find arbitrarily short programs that produce a given output in a given runtime.
- If P = NP, we could also solve all kinds of other interesting problems.

#### The Practice of Programming

- Java syntax and idioms.
- Unit testing (and its more extreme form: Test-driven development).
- Mining the web for code.
- Debugging:
- Identify the simplest case affected by the bug.
- Hunt it down, giving it no place to hide.
- With the right methodology, can find bugs even when finding bug through manual code inspection is impossible.
- Tactical vs. Strategic Programming.
- Avoid information leakage. Build deep modules. Minimize dependencies. Minimize obscurity.
- Real tools: IntelliJ, git, Truth, command line.
- Data structure selection (and API Design)
- Drive the performance and implementation of your entire program.

#### 13 minutes of a rant


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### Your Future


#### Your Life

- Two immediate questions:
- What classes should I take next semester?

#### How should I prepare for the final?

- Two long-term questions:

#### What am I capable of achieving?


#### What should I do with my life?


#### Class Poll (Your Answer)

- How many students are happy with the grade they are on track to receive?

#### Class Poll (Your Answer)

- What does a good grade in this class mean? How will a good grade in this class affect you?
- You understood the concepts in the class
- You can apply the concepts in this class in new and innovative exams
- Good grade -> leads to becoming a TA/jobs/Graduate School

#### Lets you declare the major


#### Proof of hard work


#### Different number on resume


#### Class Poll (My Answer)

- What does a good grade in this class mean? How will a good grade in this class affect you?
- A grade in this course is not a measure of your worth/intelligence.
- Several ways your grade could affect your future:

#### Future job prospects/grad school?

- While GPA is a factor, it's often not a very important one. Once you get into industry, job experience matters much more than college GPA.

#### GPA requirement to enter the CS major

- Unfortunately, this is a big determinator of getting into the major. Every faculty member and lecturer hates the GPA requirement because it incentivizes the wrong way to think about your grades
- Fortunately, students admitted after FA23 won't have that GPA requirement.

#### What does your grade mean?

- I would argue that the most important thing your grade tells you is how hard your next semester will be.
- Most of the time, you don't truly master a concept until you're forced to use it to solve something new. A lot of the concepts we've covered in the last half of the course will only solidify when you start taking 61C, 170, or any other "next step" class.
- The grade you get in this course is my message to you saying how difficult I predict it will be to develop that mastery in your next class.

#### What does your grade mean?

- An A in this class is a signifier of mastery. If you take a sequel course, you will likely do well even with other work on your plate. So you can take more/harder courses.
- A B in this class is a signifier of comprehension. If you take a sequel course, you will likely do well if you dedicate sufficient time to the class.
- A C in this class is a signifier of competence. If you take a sequel course, you will likely need to devote more time than usual to do well. So try to avoid taking too many courses at the same time
- Anything below a C is a signifier that you will struggle in a sequel course. Going directly to a sequel course will likely not be worthwhile. It may be good to retake the course so you get more time to digest concepts.
- Like surfing: Once you're behind a wave, it's difficult to climb it
- But if you're ahead of the wave, it pushes you forward
- If you're behind the wave, it may be best to wait for the next wave
- A Supporting Experiment for “Everyone Can Do Well”
- In Sp16, Josh gave students the option to fail intentionally to retake the course.
- On average, students were 2.5 letter grades higher the second time, e.g. someone in the middle of the B range got an A the second time.
- My interpretation: Even if you're not on pace for the grade you want, you have learned a lot from this course. That foundation will make it much easier to relearn the course material at a later time.
- Bottom line: You’re capable of achieving more than you might think possible.

#### The core "goal" of 61B

- Ultimately, 61A's main goal was to teach you how to program:
- Go from problem description to a code solution
- 61B's goal is to teach you why you program:
- You have a problem, and you need to decide that code is the best way to solve that problem
- 61C and 170 mainly focus on making the code you write efficient (170 by focusing on the theoretical algorithm design, and 61C by focusing on the reality of how a physical computer works).
- After that, most classes in the CS major focus on one tiny facet of CS (specialization)
- At this point, you have everything you need to build whatever you want from code.
- The best way to learn CS from now is to make something by yourself, and to play with code.
- How to have fun with CS: Competitive Programming and CTFs (Links in Speaker Notes)
- https://adventofcode.com/, https://icpc.global/, https://projecteuler.net/, https://codeforces.com/, https://cryptopals.com/, https://ctftime.org/, https://nsa-codebreaker.org/home
- How to have fun with CS: Programming Video Games
- https://www.zachtronics.com/, https://store.steampowered.com/app/370360/TIS100/, https://store.steampowered.com/app/2262930/Bombe/
- How to have fun with CS: Hackathons (https://www.calhacks.io/)

#### Your Life

- Two long-term questions:

#### What am I capable of achieving?

- Almost anything given time and motivation

#### What should I do with my life?

- You will be in high demand by everyone.
- Your skills will enable you to affect the world, possibly profoundly.
- Technology will continually to radically reshape the way we live our lives.

#### Choices (Yup)

- How you use your skills is up to you.

#### Choices (Yup)

- How you use your skills is up to you.

#### Using Your Powers for Good

- My request: Use your superpowers in a way that is a net positive for the lives of your fellow humans.
- I’m not saying that you must work for relatively low wages to uplift the downtrodden (though that’d be great, of course).
- …. but keep in mind that your work will profoundly affect the world.
- (Wanna talk about this stuff more? Take CS195!)

#### Josh: Does this seem surprising?


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### AMA

- Questions About Anything for Peyrin and Me?

#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### Course Reflections


#### Feedback Request

- We read all of your feedback, especially on the end of course evaluations.
- There is an official form from the university, and an internal survey for 61B that we’ll send out ourselves.
- Course evaluations factor heavily into lecturer reviews, and let us know what bits of the class we can improve.
- Academic interning: Learn more, help others, get units.
- Watch out for an announcement on the Spring 2024 61B Ed.

#### 61B Would Love to Have You Next Fall

- Special Thanks to the Staff (who keep the wheels on the bus)

#### Closing Thoughts (Peyrin)


#### Closing Thoughts

- It is a terrifying and awesome responsibility to decide how you should spend hundreds of your precious hours here at Berkeley.
- Don't worry about how others are doing, or focus on perfectly optimizing your college experience. Chances are, the choices you make now will lead to a good outcome. All you need to do is to be better than the person you were a year ago.
- Personally, I teach because I believe that I am doing the most good for the world in this position. Please, prove me right.


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：计算复杂性理论：规约与 P 与 NP 问题](/notes/cs61b/lecture-39) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | 全书完结 | [🎬 在 B 站观看本讲 (P40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40) |
