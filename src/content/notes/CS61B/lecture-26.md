---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 26 · 图论总结与 DAG 最短路径：拓扑序边松弛、O(V+E) 最短路径与图论算法选型全景矩阵
description: CS61B 第 26 讲：图论总结与 DAG 最短路径：拓扑序边松弛、O(V+E) 最短路径与图论算法选型全景矩阵
topic: CS61B
order: 26
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：49:51 ｜ **官方原版**：Lecture 26 - MSTs (continued)  Directed Acyclic Graphs  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P26)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1UHVEYtQhV7EQ74ETn5MvCsnRzsCzmp3MvXL84hXbw-g) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/28.-reductions-and-decomposition)  
> **快速导航**：[← 上一讲 (P25 最小生成树：割定理与 Prim/Kruskal 算法)](/notes/cs61b/lecture-25) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P27 软件工程 I：版本控制与 Gitlet 架构设计) →](/notes/cs61b/lecture-27)

---

## 1. 有向无环图（DAG）的超强特性：拓扑序线性松弛

*(参考时间：00:01:25 · [视频跳转 (P26 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26&t=85))*

在带权有向图中，Dijkstra 算法需要借助复杂的优先队列，耗时 $O(E \log V)$，且不能处理负权边。

但如果这张图**没有环路（DAG）**，我们将拥有神级加速能力！

### 核心算法定理
> **DAG 最短路径定理**：  
> **按照拓扑排序的顺序，依次对每个顶点的所有出边进行松弛，只需线性时间 $\Theta(V + E)$，即可求出单源最短路径！且完全支持负权边！**

## 2. 算法执行推演与极速性能证明

*(参考时间：00:10:00 · [视频跳转 (P26 00:10:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26&t=600))*

```java
public class AcyclicSP {
    public AcyclicSP(EdgeWeightedDigraph G, int s) {
        // 1. 线性时间计算拓扑序列
        Topological top = new Topological(G);
        // 2. 依次遍历拓扑序列中的每个顶点
        for (int v : top.order()) {
            for (DirectedEdge e : G.adj(v)) {
                relax(e); // 单次遍历即可收敛！
            }
        }
    }
}
```

### 为什么一次遍历就能绝对收敛？
因为在拓扑序列中，所有指向顶点 $w$ 的前驱依赖节点，在序列中必然排在 $w$ 的前面！  
当轮到顶点 $w$ 执行出边松弛时，**所有可能影响到 $w$ 的上游路径必然已经全部计算完毕且彻底冻结**！因此根本不需要优先队列反复调整，单向平推即可达成全局最优。

## 3. 关键路径法（Critical Path Method）与最长路径问题

*(参考时间：00:19:15 · [视频跳转 (P26 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26&t=1155))*

在一般图中，寻找无环的最长路径是一个 NP-Hard 难题。  
但在 DAG 中，求解最长路径轻而易举：只需要将所有边的权重乘以 $-1$，然后运行上述 DAG 最短路径算法即可！

这在大型工业工程规划中被称为**关键路径法（CPM）**：决定工程工期瓶颈的最长流水线路径。

## 4. 全课程图论核心算法大汇总全景天梯表

*(参考时间：00:28:00 · [视频跳转 (P26 00:28:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26&t=1680))*

| 算法名称 | 适用问题 | 图的限制条件 | 核心底层机制 | 时间复杂度 |
| :--- | :--- | :--- | :--- | :--- |
| **DFS** | 连通性、环路检测、路径寻找 | 无限制 | 递归 / 显式调用栈 | $\Theta(V + E)$ |
| **BFS** | 最少边数最短路径 | 无限制 | 先进先出队列 Queue | $\Theta(V + E)$ |
| **Topological Sort** | 任务编排依赖解析 | 有向无环图 (DAG) | DFS 反向后序 | $\Theta(V + E)$ |
| **Dijkstra** | 单源最短路径 (SSSP) | 边权重非负 | 最小优先队列 PQ | $O((V+E) \log V)$ |
| **A* Search** | 单对单启发式极速寻路 | 边权非负，启发式可采纳 | 优先队列 + $h(v)$ 启发 | 取决于启发式质量 |
| **DAG-SP** | DAG 最短路径 / 最长路径 | 有向无环 (可支持负权) | 拓扑序线性松弛 | **$\Theta(V + E)$** |
| **Prim** | 最小生成树 (MST) | 无向连通加权图 | 割定理 + 优先队列 | $O(E \log V)$ |
| **Kruskal** | 最小生成树 (MST) | 无向连通加权图 | 割定理 + 并查集防环 | $O(E \log V)$ |

## 5. 本讲小结与课后自测

*(参考时间：00:36:00 · [视频跳转 (P26 00:36:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26&t=2160))*

### 课后综合自测题
为什么普通带环图不能像 DAG 一样单向松弛求解最短路径？  
**答案与解析**：  
因为在有环图中，顶点的依赖关系存在循环递归（例如 $A$ 依赖 $B$，$B$ 依赖 $C$，$C$ 又依赖 $A$）。在数学上不存在一个线性排序能够让前驱始终排在后继前面，无法通过单趟线性遍历完成状态收敛。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 28. Reductions and Decomposition

By Mihir Mirchandani

---

## 28.1 Topological Sorts and DAGs

We have covered a tremendous amount of material so far. Programming practices, using an IDE, designing data structures, asymptotic analysis, implementing a ton of different abstract data types (e.g. using a BST, Trie, or HashTable to implement a map, heaps to implement a Priority Queue), and finally algorithms on graphs.

> Why is this knowledge useful?

You may have heard people say that CS 61B teaches much of what you need to solve standard interview questions at tech companies - but why do companies seek candidates with this specific knowledge?

One major reason is that many real world problems can be formulated in such a way that they're solvable with the data structures and algorithms we've learned. This chapter is about working through some tricky problems using the tools we have already learned.

### Topological Sorting 

Suppose we have a collection of different tasks or activities, some of which must happen before another. How do we find sort the tasks such that for each task ***v***, the tasks that happen before ***v*** come earlier in our sort?

We can first view our collection of tasks as a graph in which each node represents a task. An edge ***v*****→*****w*** indicates that ***v*** must happen before ***w***. Now our original problem is reduced to finding a **topological sort**.

> **Topological Sort:** an ordering of a graph's vertices such that for every directed edge ***u***→***v***, ***u*** comes before ***v*** in the ordering.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FsGWaKmlNZ4zuIPiX1A3m%2Fimage.png?alt=media&amp;token=21589191-8d22-4a23-b99a-485f0b856a45" alt=""><figcaption><p>Question 1</p></figcaption></figure>

<details>

<summary><strong>Question 1.1:</strong> What are some valid topological orderings of the above graph?</summary>

**Answer:** Valid orderings include: \[D,B,A,E,C,F] and \[E,D,C,B,A,F].

</details>

An important note is that it only makes sense to topological sort certain types of graphs. To see this, consider the following graph:

<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FmYdplPDr3QYtvnBU3Eu3%2Fimage.png?alt=media&amp;token=946c89d3-0d18-48fd-9eae-cd1675f8b87e" alt=""><figcaption></figcaption></figure>

<details>

<summary>What is a valid topological sorting of this?</summary>

There isn't one! D comes before B but B comes before C, E, D. Since we have a cycle, topological sort is not defined. We also can't topologically sort an undirected graph since each edge in an undirected graph creates a cycle.

</details>

<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FjrX2kiUKRQECHfIPNL7v%2Fimage.png?alt=media&amp;token=a3aca9b6-4979-4d25-b186-98c0087f5602" alt=""><figcaption></figcaption></figure>

So topological sorts only apply to **directed, acyclic (no cycles) graphs** - or **DAG**s.

> **Topological Sort:** an ordering of a **DAG**'s vertices such that for every directed edge ***u***→***v***, ***u*** comes before ***v*** in the ordering.

For any topological ordering, you can redraw the graph so that the vertices are all in one line. Thus, topological sort is sometimes called a **linearization** of the graph. For example, here's the earlier example linearized for one of the topological orderings.

<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fd3ZGryKhN07x7A4Ci9EC%2Fimage.png?alt=media&amp;token=6716339c-91a8-4f48-9f67-f5a2965a7276" alt=""><figcaption></figcaption></figure>

Notice that the topological sort for the above DAG has to start with either D or E and must end with F or C. For this reason, D and E are called *sources*, and F and C are called *sinks*.

\

[#topological-sorting](#topological-sorting "mention")

How can we find a topological sort? Take a moment to think of existing graph algorithms you already know could be helpful in solving this problem.

Topological Sort Algorithm:

* Perform a DFS traversal from every vertex in the graph, **not** clearing markings in between traversals.

* Record DFS postorder along the way.

* Topological ordering is the reverse of the postorder.

**Why it works:** Each vertex ***v*** gets added to the end of the postorder list only after considering **all** descendants of ***v***. Thus, when any ***v*** is added to the postorder list, all its descendants are already on the list. Thus reversing this list gives a topological ordering.

Since we're simply using DFS, the runtime of this is **O(V+E)** where **V** and **E** are the number of nodes and edges in the graph respectively.

##### Pseudocode 

```

topological(DAG):

    initialize marked array

    initialize postOrder list

    for all vertices in DAG:

        if vertex is not marked:

            dfs(vertex, marked, postOrder)

    return postOrder reversed

dfs(vertex, marked, postOrder):

    marked[vertex] = true

    for neighbor of vertex:

        dfs(neighbor, marked, postOrder)

    postOrder.add(vertex)

```

<details>

<summary><strong>(Out of scope) Extra question:</strong> How could we implement topological sort using BFS? <em>Hint 1: We'd definitely need to store some extra information.</em> <em>Hint 2: Think about keeping track of the in-degrees of each vertex.</em></summary>

**Solution:**

1. Calculate in-degree of all vertices.

2. Pick any vertex �v which has in-degree of 0.

3. Add �v to our topological sort list. Remove the vertex �v and all edges coming out of it. Decrement in-degrees of all neighbors of vertex �v by 1.

4. Repeat steps 2 and 3 until all vertices are removed.

How can we accomplish Step 2 efficiently? We can use a min Priority Queue of vertices with priority equal to the in-degrees.

</details>

#### Review 

* Topological sorts are a way of linearizing **Directed, Acyclic Graphs (DAGs)**.

* We can find a topological sort of any DAG in **O(V+E)** time using **DFS** (or **BFS**).

---

## 28.2 Shortest Paths on DAGs

Recall from the previous section that **DAGs** are **directed, acyclic graphs**. If we wanted to find the shortest path on DAGs we could use [Dijkstra's](https://cs61b-2.gitbook.io/cs61b-textbook/24.-shortest-paths/24.2-dijkstras-algorithm). However, with DAGs there's a simple shortest path algorithm which also handles negative edge weights!

#### Dijkstra's Negative Edge Weight Failure

Recall that Dijkstra's can fail if negative edges exist because it relies on the assumption that once we visit an edge, we've found the shortest path to that edge. But if negative edge weights can exist ahead of where we can see, then this assumption fails. Consider the following example:

<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FLHHswZMlTTUO0WH4YE6K%2Fimage.png?alt=media&amp;token=98c17b52-e234-4e93-aeed-1786785c65c9" alt=""><figcaption></figcaption></figure>

Starting from A, Dijkstra's will visit C first, then B (never even considering the edge ***B→C***&#xB9;

Of course, negative edge weights do not mean Dijkstra's is guaranteed to fail. Dijkstra's succeeds with the following example:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxBTYozRH3bDSBzpJR8XP%2Fimage.png?alt=media&amp;token=3f23605e-0d85-4d62-ad4c-3b38a44717a9" alt=""><figcaption></figcaption></figure>

> ¹. This technically depends on your implementation of Dijkstra's. If we ensure that the relaxation step only considers neighbors that are still in the queue (haven't been visited yet), then it is true that ***B→C*** will never be considered. If you don't have that check, then technically when we pop the last node (B) from the queue, we'd consider B's neighbors and update C which gives us the right answer for this specific example. However, in that case one could argue that the graph breaks the Dijkstra invariant and thus Dijkstra has 'failed'. Note, the Dijkstra invariant: *once a node is deleted from the queue (visited) then you've found the shortest path to that node.*[ ↩](https://joshhug.gitbooks.io/hug61b/content/chap21/chap212.html#reffn_1)

#### Shortest Path Algorithm for DAGs

Visit vertices in topological order:

* On each visit, relax all outgoing edges

Recall the definition for relaxing an edge ***u→v*** with weight w:

```

if distTo[u] + w < distTo[v]:

    distTo[v] = distTo[u] + w

    edgeTo[v] = u

```

Since we visit vertices in topological order, a vertex is visited only when all possible info about it has been considered. This means that if negative edge weights exist along a path to v, then those have been taken into account by the time we get to �v!

Finding a topological sort takes O(V+E) time while relaxation from each vertex also takes O(V+E) time in total. Thus, the overall runtime is O(V+E). Recall that Dijkstra's takes O((V+E)logV) time because of our min-heap operations.

What if we want to solve the shortest path problem on graphs that aren't DAGs and also may have negative edges? An extension of Dijkstra's called [Bellman Ford](https://en.wikipedia.org/wiki/Bellman%E2%80%93Ford_algorithm) can suit your needs, though it is out of scope for this course.

---

## 28.3 Longest Path

### In General 

Consider the problem of finding the longest path from a start vertex to every other vertex. The path must be simple (contain no cycles).

It turns out that best known algorithm is exponential (impractically inefficient).

Negating all the edge weights and finding the shortest path leaves us in a tricky situation because then we could have negative cycles and we could go around and around them indefinitely.

### Longest Paths on DAGs 

But what if we are dealing with DAGs? In that case, we have no cycles so we can do as suggested above:

1. Form a new copy of the graph, called G', with all edge weights negated (signs flipped).

2. Run DAG shortest paths on G' yielding result X

3. Flip the signs of all values in X.distTo. X.edgeTo is already correct.

Alternatively, we could modify the DAG shortest path algorithm from the previous section to choose the larger distTo when relaxing an edge. While this would make more sense in practice, the benefit of thinking of the first approach is that wree a able to use an existing algorithm as a "[black box](https://en.wikipedia.org/wiki/Black_box)" to solve a new problem. We'll learn more about this kind of problem solving in the next section: [Reductions](https://joshhug.gitbooks.io/hug61b/content/chap214.md).

---

## 28.4 Reductions and Decomposition

Recall in previous section that to solve one problem (longest paths), we created a new graph G' and fed it into a different algorithm and then interpreted the result.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FdSjjBCcLWyVPZd3Hiye1%2Fimage.png?alt=media&amp;token=e86b519e-7dc8-40c0-85fe-2424abdadbec" alt=""><figcaption></figcaption></figure>

This process is known as **reduction**. Since DAG-SPT can be used to solve DAG-LPT, we say that "DAG-LPT reduces to DAG-SPT."

In other words, the problem of DAG-LPT can be reduced to the problem of DAG-SPT.

A problem like DAG-LPT can potentially be reduced to multiple other problems. As a real-world analogy, consider climbing a hill. There are many ways we can solve the problem of "climbing a hill."

* "Climbing a hill" reduces to "riding a ski lift"

* "Climbing a hill" reduces to "being shot out of a cannon"

* "Climbing a hill" reduces to "riding a bike up the hill"

Formally, **if any subroutine for task Q can be used to solve P, we say P reduces to Q.**

This definition is visualized below:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FZm8bQh3WXBYAotENpY2w%2Fimage.png?alt=media&amp;token=beef99c2-f7ba-4caa-83e9-ce94b75024da" alt=""><figcaption></figcaption></figure>

Note that this is simply a generalization of the first graphic on this page. P reduces to Q since Q is used to solve P. This works by preprocessing the input �x into �y, running the algorithm Q on �y, and postprocessing the output into a solution for P. This is what we did for reducing DAG-LPT to DAG-SPT.

##### Example 

Here we'll show how one problem can reduce to a seemingly unrelated different problem. First, the two problems:

**Independent Set Problem**

An independent set is a set of vertices in which no two vertices are adjacent.

The Independent Set Problem: Does there exist an independent set of size k? In other words, can we color k vertices red, such that none touch?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FH9hAfqOEHmHMlZTHJkTj%2Fimage.png?alt=media&amp;token=dfb32e3d-1370-441d-9eea-25cbc2329a12" alt=""><figcaption><p>Example of independent sets solutions for k=2 and k=4</p></figcaption></figure>

**3SAT Problem**

What values of `x1`, `x2`, `x3`, `x4` satisfy the following boolean formula: `(x1 || x2 || !x3) && (x1 || !x1 || x1) && (x2 || x3 || x4)`?

The 3SAT Problem: Given a boolean formula, does there exist a truth value for boolean variables that obeys a set of 3-variable disjunctive constraints?

Terminology clarification:

* Constraints are True/False values.

* **Disjunctive** means separated by OR. 3SAT has a set of "clauses," each made up of 3 literals with each literal separated by an OR. For example, the first clause above is `(x1 || x2 || !x3)`.

* In the 3SAT problem we must satisfy the entire set of clauses (combine each clause with AND).

**e.g.:** `(x1 || x2 || !x3) && (x1 || !x1 || x1) && (x2 || x3 || x4)`       Yes, a solution for x1, x2, x3, x4 exists       Solution: x1 = true, x2 = true, x3 = true, x4 = false

**Reduction**

**CLAIM**: 3SAT reduces to Independent Set

* Recall this means we claim we can solve 3SAT by using the Independent Set algorithm!

**PROOF**: To prove the reduction, we need to argue that we can:

1. Preprocess a given 3SAT problem

2. Solve it with Independent Set

3. Postprocess the output of part 2 into a solution to the original 3SAT problem.

Let's do it!

***Preprocess a given 3SAT problem*** Given an instance X of 3SAT, preprocess it into a graph G:

1. For each clause in X, create 3 vertices in a triangle

2. Add an edge between each literal and its negation<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fp66CZTfHExZqY7CoBZiF%2Fimage.png?alt=media&amp;token=5d2a1485-6de0-4c06-8f6a-11cf1a3fc154" alt=""><figcaption></figcaption></figure>

***Solve with Independent Sets*** On graph G, find an independent set of *size = number of clauses in 3SAT*.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fcnfx8vsjpkC3VpPuQXgf%2Fimage.png?alt=media&amp;token=0ad3e129-1525-4810-bba8-3e78152e4831" alt=""><figcaption></figcaption></figure>

***Postprocess the output*** Elements in the independent set are considered "True", while elements outside are considered "False." If you can find an independent set of size = number of clauses in 3SAT, then you've successfully solved 3SAT (using independent sets whoo!).

In the above example, since `x3`, `!x2`, `x3`, `x4` were picked for the independent set, we consider each of those literals to be True and values for the rest don't matter. Therefore, `x3 = True, x2 = False, x4 = True, x1 = doesn't matter.`

**Why this works:** We'll reference the below example when going through the proof.

`(x1 || x2 || !x3) && (x1 || !x1 || x1) && (x2 || x3 || x4)`

The above 3SAT problem has 3 clauses. To form a satisfying truth assignment we must pick one literal from each clause and give it the value True. Of course, we must be consistent. If we choose `x1` to be True in the first clause, we can't choose `!x1` to be True in the third clause (x1 can't both be True and False!).

Representing a clause by a triangle forces us to pick only literal in a clause for the independent set. Repeat this for every clause and and finding an independent set of *size = number of clauses* means exactly one literal will be picked from each clause (we'll consider a picked node to be True).

We also make sure to add an edge from each literal to its negation to prevent us from choosing opposite literals (e.g. both `x1` and `!x1`) in different clauses. This may also have the effect of finding an independent set impossible - in this case, 3SAT is also not solvable.

Here's a visualization of the above reduction:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FvImcp6SHd5bMsgZ64No6%2Fimage.png?alt=media&amp;token=51d7576c-855a-4cdd-a1aa-288d85ae6aa3" alt=""><figcaption></figcaption></figure>

Note that reductions are a general concept and apply to many different types of problems (they don't always involve creating graphs!)

#### Reflection 

One can argue that we have been doing reduction all throughout the course.

* Abstract Lists reduce to arrays or linked lists

* Percolation reduces to Disjoint Sets

* Maze generation reduces to \[your solution here ;)]

However these aren't exactly reductions because you aren't using a single other algorithm to solve your problem. Notably, in the earlier reduction example we used the Independent Sets algorithm as a '[black box](https://en.wikipedia.org/wiki/Black_box)' to solve 3SAT.

Perhaps a better term for what we've been accomplishing earlier in the course is *decomposition* - breaking a complex task into smaller parts. Using abstraction to make problem solving easier. This is the heart of computer science.

---

## 28.5 Exercises

### Factual

1. Which of the following statements about reductions are true?

   * [ ] DAG-LPT reduces to DAG-SPT.

   * [ ] 3SAT reduces to Independent Set.

   * [ ] Percolation on an NxN grid reduces to Disjoint Sets on an NxN grid.

   * [ ] Disjoint Sets on an NxN grid reduces to Percolation on an NxN grid.

<details>

<summary>Problem 1</summary>

* [x] DAG-LPT reduces to DAG-SPT.

* [x] 3SAT reduces to Independent Set.

* [x] Percolation on an NxN grid reduces to Disjoint Sets on an NxN grid.

* [ ] Disjoint Sets on an NxN grid reduces to Percolation on an NxN grid.

</details>

### Procedural

1. What ordering of vertices do we get if we use the topological sort algorithm from lecture on the graph below? Assume that all ties are broken in numerical order. For example, if there are multiple vertices with in-degree zero, use the smallest first. For example, if a node has multiple outgoing edges, use the smallest first.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FPlZbMoHjmX7TskbEG9Pr%2Fimage.png?alt=media\&token=3bd39a74-7b01-4ae4-ac77-f162b531d995)

2. Now suppose we add weights to the edges. If we use Dijkstra's algorithm to find the SPT from 0, what is the second vertex we will visit? That is, after visiting vertex 0, which one comes next?

3. The graph from part 2 is a DAG (i.e. contains no cycles). If we use the DAG Shortest Paths algorithm from lecture, what vertex will be visited after vertex 0?

4. According to the DAG Shortest Paths algorithm from lecture, the first vertex we should visit is vertex 6. After relaxing the edge from 6 to 1, what is distTo\[1]? Assume 0 is the start vertex.

5. How many edges are in the longest paths tree for the graph above if we start from vertex 0?

<details>

<summary>Problem 1</summary>

The DFS Post Order is `3 2 4 5 1 0 6`. The reverse of this is `6 0 1 5 4 2 3`. Thus, the topological sort we get is `6 0 1 5 4 2 3`.

</details>

<details>

<summary>Problem 2</summary>

2, it has the shortest distance from the start vertex. 

</details>

<details>

<summary>Problem 3</summary>

1, because it is the next in the topological order that we got in question 1.

</details>

<details>

<summary>Problem 4</summary>

Infinity. Recall that when relaxing the edge from `6` to `1` in a shortest paths algorithm, the new distance to be considered is `distTo[6] + w(6, 1)` where `w(6, 1)` is the weight of the edge from `6` to `1`. Since `distTo[6]` is infinity, the sum is `infinity + 9`. Since this is no better than the original value of `distTo[1]`, which is also infinity, `distTo[1]` does not change.

</details>

<details>

<summary>Problem 5</summary>

5. There are 6 reachable vertex from 0, so the LPT will have V - 1 = 5 edges.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：最小生成树：割定理与 Prim/Kruskal 算法](/notes/cs61b/lecture-25) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：软件工程 I：版本控制与 Gitlet 架构设计 →](/notes/cs61b/lecture-27) | [🎬 在 B 站观看本讲 (P26)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=26) |
