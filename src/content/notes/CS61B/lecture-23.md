---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 23 · 图遍历实战：DFS、BFS 与拓扑排序：迷宫搜索法则、visited 标记防死循环、最短步数与拓扑序列
description: CS61B 第 23 讲：图遍历实战：DFS、BFS 与拓扑排序：迷宫搜索法则、visited 标记防死循环、最短步数与拓扑序列
topic: CS61B
order: 23
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:42 ｜ **官方原版**：Lecture 23 - Graph Traversals and Implementations  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P23)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1NKWnXSJ8pUn1E2Cw6zidxMRuXf_aINKCpW7XpEkyz6c) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/23.-graph-traversals-and-implementations)  
> **快速导航**：[← 上一讲 (P22 树与图的遍历理论)](/notes/cs61b/lecture-22) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P24 最短路径算法：Dijkstra 与 A* 启发式搜索) →](/notes/cs61b/lecture-24)

---

## 1. 深度优先搜索（DFS）：迷宫回溯与调用栈机制

*(参考时间：00:01:20 · [视频跳转 (P23 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=80))*

在图遍历中，最大的灾难是**环路（Cycles）引发的无限死循环**！

与树不同，图中的节点可能形成闭环回路。如果盲目递归，程序将在同一个环上反复打转，最终触发 `StackOverflowError` 崩溃。

### 特修斯迷宫法则：`visited[]` 布尔标记数组
解决环路的唯一法则，是模拟古希腊英雄特修斯探索迷宫：**每踏入一个新顶点，立即在地上画一个记号，永远不要踏入已经标记过的顶点！**

```java
public class DepthFirstPaths {
    private boolean[] marked; // 访问标记
    private int[] edgeTo;     // 记录路径树上的父节点
    private final int s;      // 起点

    public DepthFirstPaths(Graph G, int s) {
        this.s = s;
        marked = new boolean[G.V()];
        edgeTo = new int[G.V()];
        dfs(G, s);
    }

    private void dfs(Graph G, int v) {
        marked[v] = true;
        for (int w : G.adj(v)) {
            if (!marked[w]) {
                edgeTo[w] = v; // 记录是从 v 走到了 w
                dfs(G, w);
            }
        }
    }
}
```

## 2. 广度优先搜索（BFS）：最少边数最短路径

*(参考时间：00:11:30 · [视频跳转 (P23 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=690))*

当所有的边权值都相等（无权图）时，寻找从起点 $s$ 到终点 $t$ 的**最少步数路径**，必须使用 BFS：

```java
public class BreadthFirstPaths {
    private boolean[] marked;
    private int[] edgeTo;
    private int[] distTo;

    public BreadthFirstPaths(Graph G, int s) {
        marked = new boolean[G.V()];
        edgeTo = new int[G.V()];
        distTo = new int[G.V()];
        bfs(G, s);
    }

    private void bfs(Graph G, int s) {
        Queue<Integer> q = new ArrayDeque<>();
        marked[s] = true;
        distTo[s] = 0;
        q.add(s);

        while (!q.isEmpty()) {
            int v = q.poll();
            for (int w : G.adj(v)) {
                if (!marked[w]) {
                    edgeTo[w] = v;
                    distTo[w] = distTo[v] + 1;
                    marked[w] = true;
                    q.add(w);
                }
            }
        }
    }
}
```
**定理**：BFS 第一次访问到顶点 $w$ 时，所经过的边数必然是起点 $s$ 到 $w$ 的**全局最少边数**！

## 3. 拓扑排序（Topological Sort）：有向无环图（DAG）的任务编排

*(参考时间：00:22:15 · [视频跳转 (P23 00:22:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=1335))*

在大学选课先修要求、软件工程编译依赖（Makefile / Gradle）、或工作流调度中，任务之间存在先后次序依赖。

### 形式化定义
对于一个**有向无环图（DAG, Directed Acyclic Graph）**，拓扑排序是将所有顶点排列为一个线性序列，使得对于图中的任意有向边 $u \to v$，**顶点 $u$ 在序列中都出现在顶点 $v$ 的前面**！

### 基于 DFS 反向后序（Reverse Post-Order）的极简算法
1. 对 DAG 中的每个未访问顶点运行 DFS；
2. **在 DFS 递归回溯的瞬间（即一个顶点的所有下游邻居全部处理完毕后），将该节点压入一个栈中**（后序）；
3. 遍历结束后，从栈顶到栈底弹出的序列，**恰好就是绝对合法的拓扑排序序列！**

耗时仅需完美的线性时间 **$\Theta(V + E)$**！

## 4. 本讲小结与课后自测

*(参考时间：00:32:00 · [视频跳转 (P23 00:32:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=1920))*

### 课后综合自测题
如果一个有向图中包含环路（Cycle），还能进行拓扑排序吗？为什么？  
**答案与解析**：  
**绝对不能！** 假设有环 $A \to B \to C \to A$。拓扑排序要求 $A$ 在 $B$ 前面，$B$ 在 $C$ 前面，$C$ 在 $A$ 前面，这在数学逻辑上构成不可调和的矛盾悖论。拓扑排序存在的充分必要条件是该图必须是无环图（DAG）。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 23. Graph Traversals and Implementations

By William Lee and Mihir Mirchandani

---

## 23.1 BFS & DFS

Professor Hug's Lecture on Graphs



In [Chapter 22.4](https://cs61b-2.gitbook.io/cs61b-textbook/22.-tree-traversals-and-graphs/22.4-graph-problems), we developed DFS (Depth First Search) Traversal for graphs. In DFS, we visit down the entire lineage of our first child before we even begin to look at our second child - we literally search ***depth first***.

Here, we will talk about BFS (Breadth First Search) (also known as Level Order Traversal). In BFS, we visit all of our immediate children before continuing on to any of our grandchildren. In other words, we visit all nodes 1 edges from our source. Then, all nodes 2 edges from our source, etc.

The pseudocode for BFS is as follows:

```

Initialize the fringe, an empty queue 

    add the starting vertex to the fringe

    mark the starting vertex

    while fringe is not empty:

        remove vertex v from the fringe

        for each neighbor n of vertex v:

            if n is not marked:

                add n to fringe

                mark n

                set edgeTo[n] = v

                set distTo[n] = distTo[v] + 1

```

A *fringe* is just a term we use for the data structure we are using to store the nodes on the frontier of our traversal's discovery process (the next nodes it is waiting to look at). For BFS, we use a queue for our fringe.

`edgeTo[...]` is a map that helps us track how we got to node `n`; we got to it by following the edge from `v` to to `n`.

`distTo[...]` is a map that helps us track how far `n` is from the starting vertex. Assuming that each edge is worth a distance of `1`, then the distance to `n` is just one more than the distance to get to `v`. Why? We can use the way we know how to get to `v`, then pay one more to arrive at `n` via the edge that necessarily exists between `v` and `n` (it must exist since in the `for` loop header, `n` is defined as a neighbor of `v`).

This [slide deck](https://docs.google.com/presentation/d/1JoYCelH4YE6IkSMq_LfTJMzJ00WxDj7rEa49gYmAtc4/edit#slide=id.g76e0dad85_2_380) illustrates how this pseudocode can be carried out on an example graph.

##### DFS vs BFS 

<details>

<summary><strong>Question 18.1</strong>: What graph traversal algorithm uses a stack rather than a queue for its fringe?</summary>

**Answer 18.1**: DFS traversal.

</details>

Note however that DFS and BFS differ in more than just their fringe data structure. They differ in the order of marking nodes. For DFS we mark nodes only once we visit a node - aka pop it from the fringe. As a result, it's possible to have multiple instances of the same node on the stack at a time if that node has been queued but not visited yet. With BFS we mark nodes as soon as we add them to the fringe so this is not possible.

Recursive DFS implements this naturally via the recursive stack frames; iterative DFS implements it manually:

```

Initialize the fringe, an empty stack

    push the starting vertex on the fringe

    while fringe is not empty:

        pop a vertex off the fringe

        if vertex is not marked:

            mark the vertex

            visit vertex

            for each neighbor of vertex:

                if neighbor not marked:

                    push neighbor to fringe

```

<br>

---

## 23.2 Representing Graphs

How do we create a graph in Java?

Professor Hug's Lecture on Graphs



We will discuss our choice of **API**, and also the **underlying data structures** used to represent the graph. Our decisions can have profound implications on our *runtime*, *memory usage*, and *difficulty of implementing various graph algorithms*.

#### Graph API 

An API (Application Programming Interface) is a list of methods available to a user of our class, including the method signatures (what arguments/parameters each function accepts) and information regarding their behaviors. You have already seen APIs from the Java developers for the classes they provide, such as the [Deque](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/Deque.html).

For our Graph API, let's use the common convention of assigning each unique node to an integer number. This can be done by maintaining a map which can tell us the integer assigned to each original node label. Doing so allows us to define our API to work with integers specifically, rather than introducing the need for generic types.

We can then define our API to look something like this perhaps:

```

public class Graph {

  public Graph(int V):               // Create empty graph with v vertices

  public void addEdge(int v, int w): // add an edge v-w

  Iterable<Integer> adj(int v):      // vertices adjacent to v

  int V():                           // number of vertices

  int E():                           // number of edges

...

```

Clients (people who wish to use our Graph data structure), can then use any of the functions we provide to implement their own algorithms. The methods we provide can have a significant impact on how easy/difficult it may be for our clients to implement particular algorithms.

Now that we know how to draw a graph on paper and understand the basic concepts and definitions, we can now consider how a graph should be represented inside of a computer. We want to be able to get quick answers for the following questions about a graph:

* Are given vertices `u` and `v` adjacent?

* Is vertex `v` incident to a particular edge `e`?

* What vertices are adjacent to `v`?

* What edges are incident to `v`?

Imagine that we want to represent a graph that looks like this:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FotR7OR4kDVbDRuqPotD3%2Fimage.png?alt=media\&token=c12f8f57-069b-4d59-b6c9-9a21078fb1db)

One data structure we could use to implement this graph is called an *array of adjacency lists*.

### The Adjacency List

In an adjacency list, an array is created that has the same size as the number of vertices in the graph. Each position in the array represents one of the vertices in the graph. Each of these positions point to a list. These lists are called adjacency lists, as each element in the list represents a neighbor of the vertex.

The array of adjacency lists that represents the above graph looks like this:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FpVeHXM5IcM7fJlcyyKPx%2Fimage.png?alt=media\&token=99f034f7-08a4-4d3e-8af5-e5f841fddea3)

\

Another data structure we could use to represent the edges in a graph is called an *adjacency matrix*.

### The Adjacency Matrix

In this data structure, we have a two dimensional array of size N×N (where N is the number of vertices) which contains boolean values. The (*i*, *j*)th entry of this matrix is true when there is an edge from *i* to *j* and false when no edge exists. Thus, each vertex has a row and a column in the matrix, and the value in that table says true or false whether or not that edge exists.

The adjacency matrix that represents the above graph looks like this:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F8dyGvwoBmKKlFVKq9vxv%2Fimage.png?alt=media\&token=fde1a72d-1051-4999-8ced-15b999e62c93)

### Efficiency 

Your choice of underlying data structure can impact the runtime and memory usage of your graph. This table from the [slides](https://docs.google.com/presentation/d/11iacyiFt3QUrzo1yAU_xoXAjGTH4UzV7o6CR04HYRrI/edit#slide=id.g54593997ea_0_422) summarizes the efficiencies of each representation for various operations. It is strongly not recommended to directly just copy this on to your cheatsheet for the exams without taking the time to first understand where and how these bounds fundamentally came to be. The lecture contains walkthroughs explaining the rationale in detail behind several of these cells.

Further, DFS/BFS on a graph backed by adjacency lists runs in O(V+E), while on a graph backed by an adjacency matrix runs in O(V^2). See the [slides](https://docs.google.com/presentation/d/11iacyiFt3QUrzo1yAU_xoXAjGTH4UzV7o6CR04HYRrI/) for help in understanding why.

---

## 23.3 Summary

### Graph Traversals Overview

* The same traversals that we used on trees can be generalized to graphs. Given a source vertex, we can visit vertices in:

  * DFS preorder: the order in which DFS is called on each vertex.

  * DFS postorder: the order in which DFS returns from each vertex.

  * BFS: the order of distance from the source node (this is level-order in trees). 

### BFS

* Unlike DFS, BFS has a natural solution that is iterative, not recursive. BFS visits a source vertex `s`, then every vertex at distance `1` from `s`, then every vertex at distance `2` from `s`, and so on.

* BFS uses a *fringe* of vertices that are next to be explored. In BFS, this fringe is a queue. We enqueue new vertices at the end, and dequeue vertices to visit from the front.

* BFS can be used to solve the shortest paths problem, given that we want to minimize the number of edges from source to each other vertex. If we want to recover the shortest path from BFS, we need to track the `edgeTo` each vertex during our traversal.

### Graph Implementation

* The choice of API for a graph determines how clients must write their code. Certain APIs make some tasks easier and other tasks harder. The choice of API can also affect runtime and memory.

* Choice of graph implementations include adjacency matrices, lists of edges, and adjacency lists. An adjacency matrix is a 2D boolean array indicating whether any pair of vertices are adjacent. A list of edges is a collection of all edges in the graph. 

* The most common approach to graph representation is an adjacency list. In this representation, we maintain a array of lists indexed by vertex number; each index stores all vertices connected to the given vertex.

---

## 23.4 Exercises

### Factual

1. Suppose we want to find the vertex with minimal degree (fewest neighbors). Is an adjacency matrix or adjacency list better?

<details>

<summary>Problem 1</summary>

An adjacency list would be better: we can just assess the size of each list in constant time versus iterating over all $$V$$ vertices in each row of the adjacency matrix to count the number of neighbors.

</details>

### Procedural

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F0Aox0I7F64CusVOWwyns%2Fimage.png?alt=media\&token=b71e9663-f601-4b4c-9b1d-4dc5e703709d)

1. For the graph above, write the representation for the adjacency matrix representation.

2. Repeat (1) for the list of edges representation.

3. Repeat (1) for the adjacency list representation.

4. Run BFS starting from A for the graph above, and list the order in which vertices are visited. Break ties alphabetically.

5. Run DFS starting from A for the graph above, and list the postorder/postorder traversals. Break ties alphabetically.

<details>

<summary>Problem 1</summary>

<pre><code><strong>    A  B  C  D  E  F

</strong><strong>   

</strong><strong>A   F  T  F  F  F  F

</strong><strong>B   T  F  T  T  T  F

</strong><strong>C   F  T  F  F  F  T

</strong><strong>D   F  T  F  F  F  T

</strong><strong>E   F  T  F  F  F  F

</strong><strong>F   F  F  T  T  F  F

</strong></code></pre>

</details>

<details>

<summary>Problem 2</summary>

```

[{A, B}, 

{B, A}, {B, C}, {B, D}, {B, E}, 

{C, B}, {C, F},

{D, B}, {D, F},

{E, B}, 

{F, C}, {F, D}]

```

</details>

<details>

<summary>Problem 3</summary>

```

A: [B]

B: [A, C, D, E]

C: [B, F]

D: [B, F]

E: [B]

F: [C, D]

```

</details>

<details>

<summary>Problem 4</summary>

`[A, B, C, D, E, F]`

</details>

<details>

<summary>Problem 5</summary>

preorder: `[A, B, C, F, D, E]`

postorder: `[D, F, C, E, B, A]`

</details>

### Metacognitive

1. Suppose we find some shortest path from `a` to `b` using BFS. Consider a vertex `c` that is on the path between `a` and `b`. What can we say about the shortest path from `c` to `b`?

2. Problem 4c from the [Spring 2015 Midterm 2](https://drive.google.com/file/d/1uE1QlF4YguWVp8m8UJ97R2xPC4b1NnQ5/view?usp=sharing).

<details>

<summary>Problem 1</summary>

Call the original shortest path from `a` to `b` $$p\_{ab}$$, and the path from `c` to `b` along this path $$p^{\cdot }*{cb}$$. If there is some shorter path between `c` and `b` $$p'*{cb}$$, then we could simply take the path from `a` to `c` in the original $$p\_{ab}$$, then take $$p'\_{cb}$$ to find an even shorter path between `a` and `b`. 

However, we stated earlier that $$p\_{ab}$$ is the shortest path between `a` and `b`. This is a contradiction.

Thus, the shortest path between `c` and `b` must be on the shortest path between `a` and `b`.

</details>

<details>

<summary>Problem 2</summary>

[Solutions](https://drive.google.com/file/d/1IYt4VbzdX4dTekh6cYAC8tigpJ_LgljV/view?usp=sharing) are linked here and on the course website.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：树与图的遍历理论](/notes/cs61b/lecture-22) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：最短路径算法：Dijkstra 与 A* 启发式搜索 →](/notes/cs61b/lecture-24) | [🎬 在 B 站观看本讲 (P23)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23) |
