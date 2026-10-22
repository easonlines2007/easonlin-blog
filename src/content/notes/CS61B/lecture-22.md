---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 22 · 树与图的遍历理论：DFS 前中后序、BFS 层序遍历、图的分类与三大表示法对比
description: CS61B 第 22 讲：树与图的遍历理论：DFS 前中后序、BFS 层序遍历、图的分类与三大表示法对比
topic: CS61B
order: 22
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:47 ｜ **官方原版**：Lecture 22 - Tree and Graph Traversals  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P22)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1Gyke5ZMrgcMuBTa7qHAoklWZB3yf_yqQAymK2nV-Nqs) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/22.-tree-traversals-and-graphs)  
> **快速导航**：[← 上一讲 (P21 优先队列与二叉堆)](/notes/cs61b/lecture-21) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P23 图遍历实战：DFS、BFS 与拓扑排序) →](/notes/cs61b/lecture-23)

---

## 1. 树的深度优先遍历（DFS）全家桶：前序、中序与后序

*(参考时间：00:01:25 · [视频跳转 (P22 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=85))*

树的遍历指按照某种系统化的顺序，不重复地访问树中的每一个节点。

深度优先遍历（DFS, Depth-First Search）沿着每一个分支一直走到最深处，根据访问当前根节点的时机不同，分为三种经典遍历：

1. **前序遍历（Pre-order Traversal）**：**根节点 $\to$ 左子树 $\to$ 右子树**。常用于复制整棵树或输出具有层级缩进的目录树；
2. **中序遍历（In-order Traversal）**：**左子树 $\to$ 根节点 $\to$ 右子树**。作用于 BST 时必定输出单调递增序列；
3. **后序遍历（Post-order Traversal）**：**左子树 $\to$ 右子树 $\to$ 根节点**。常用于自底向上的计算（例如计算目录磁盘占用总大小、自底向上销毁节点）。

## 2. 广度优先层序遍历（BFS / Level-Order）

*(参考时间：00:10:40 · [视频跳转 (P22 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=640))*

广度优先遍历（Breadth-First Search）按照与根节点的距离（深度），**逐层水平横向扫描**：先访问根节点（第 0 层），再访问第 1 层的所有节点，接着访问第 2 层。

### 队列机制（Queue-Based Implementation）
由于层序遍历需要“先发现的节点先访问其子节点”，必须借助**先进先出（FIFO）的队列**：
```java
public void levelOrder(Node root) {
    if (root == null) return;
    Queue<Node> q = new ArrayDeque<>();
    q.add(root);
    while (!q.isEmpty()) {
        Node curr = q.poll();
        System.out.print(curr.item + " ");
        if (curr.left != null)  q.add(curr.left);
        if (curr.right != null) q.add(curr.right);
    }
}
```

## 3. 图（Graph）的形式化分类与抽象

*(参考时间：00:19:10 · [视频跳转 (P22 00:19:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=1150))*

图是树的终极超集。图 $G = (V, E)$ 由一组**顶点（Vertices, $V$）**和连接顶点的**边（Edges, $E$）**组成：
- **无向图（Undirected Graph）**：边没有方向（$A - B$ 等价于 $B - A$）；
- **有向图（Directed Graph）**：边具有单向流动性（$A \to B$ 不等于 $B \to A$）；
- **带权图（Weighted Graph）**：边附带权值（距离、通行成本、网络延迟）；
- **简单图（Simple Graph）**：不包含自环（Self-loops）和重边（Parallel edges）。

## 4. 图的计算机内部三大表示法全景对决

*(参考时间：00:28:30 · [视频跳转 (P22 00:28:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=1710))*

如何在内存中表示图的连接关系？

### 1. 边的列表（Edge List）
- 直接使用一个线性表存放所有的边：`[(0, 1), (1, 2), (2, 0)]`；
- 空间极省（$O(E)$），但查询“顶点 $v$ 和 $w$ 是否相邻”需要遍历全表，耗时 $O(E)$。

### 2. 邻接矩阵（Adjacency Matrix）
- 使用一个二维布尔数组 `boolean[][] adj = new boolean[V][V]`；
- `adj[v][w] = true` 表示存在边 $v \to w$；
- 优点：查询两点是否相邻是瞬时的 $O(1)$；
- 致命缺点：**空间开销是巨大的 $O(V^2)$**！对于百万顶点的稀疏图，内存瞬间耗尽；寻找一个顶点的所有邻居必须扫描一整行，耗时 $O(V)$。

### 3. 邻接表（Adjacency Lists）——工业级绝对主流！
- 使用一个数组，数组每个槽位是一个线性列表（如 `List<Integer>[]`）；
- `adj[v]` 存储所有与顶点 $v$ 相邻的顶点集合；
- **空间开销**：严格与图的真实规模成正比——$\Theta(V + E)$！
- **寻找邻居**：仅需 $\Theta(\text{deg}(v))$ 时间，极其高效。

## 5. 本讲小结与课后自测

*(参考时间：00:36:00 · [视频跳转 (P22 00:36:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=2160))*

### 课后综合自测题
假设一个社交网络包含 10 亿用户（$V = 10^9$），平均每个用户有 500 个好友（$E = 2.5 \times 10^{11}$）。为什么邻接矩阵在该场景下绝对不可用？  
**答案与解析**：  
邻接矩阵需要 $V^2 = (10^9)^2 = 10^{18}$ 个布尔位。即便每个布尔位只占 1 个比特，也需要 **$1.25 \times 10^8$ GB（约 125 PB）的连续物理内存**！而邻接表仅需存储实际存在的 $2.5 \times 10^{11}$ 条边，几百 GB 即可轻松容纳。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 22. Tree Traversals and Graphs

By Mihir Mirchandani and Dhruti Pandya

---

## 22.1 Tree Recap

### Trees and Traversals 

Professor Hug's review of 17.1 and 17.2



#### What is a Tree?

Recall that a tree consists of:

* A set of connected nodes (or vertices). We use both terms interchangeably.

* A set of edges that connect those nodes. No edges can form a cycle.

  * **Constraint:** There is exactly one path between any two nodes.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FMRSCeKgcRRuyRdHpJB3n%2FScreen%20Shot%202023-02-26%20at%206.04.39%20AM.png?alt=media&amp;token=fb076097-be00-4ea6-b330-88614e164bd5" alt=""><figcaption><p>Graph Examples (Some Trees, some not...)</p></figcaption></figure>

Graph #1 is a tree. It has a node. It has no edges. That's *OK*!

The second and third structures are trees. Notice that the third is a LinkedList. A LinkedList is still a tree as it is a connected acyclic graph.

The fourth is not a tree. Why? There are two paths from the top node to the bottom node, and so this does not obey our constraint.

**Exercise 17.1.1.** Determine the reason why the fifth structure is not a tree. Also, modify the invalid trees above so that they are valid.

#### What is a rooted tree? 

\

Recall that a rooted tree is a tree with a designated root (typically drawn as the top most node.)

This gives us the notion of two more definitions

* A parent. Every node except the root has exactly one parent.

  * What if a node had 2 parents? Would it be a tree? (Hint: No.)

* A child. A node can have 0 or more children.

  * What if a node has 0 children? It's called a leaf.

#### What are trees useful for? 

\

So far, we've looked at Search Trees, Tries, Heaps, Disjoint Sets, etc. These were extremely useful in our journey to create efficient algorithms: speeding up searching for items, allowing prefixing, checking connectedness, and so on.

But the fact of the matter is that they are even more ubiquitous than we realize. Consider an organization chart. Here, the President is the 'root'. The 'VP's are children of the root, and so on.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1TH8K145QWb6t6wvVhWU%2Fimage.png?alt=media&amp;token=05f356be-d9df-46ae-b0fd-ee136398db8b" alt=""><figcaption><p>Organization Chart</p></figcaption></figure>

\

Another tree structure is the `61b/` directory on your Desktop (it is on your Desktop, isn't it?). As we can see, when you traverse to a subfolder it goes to subsequent subfolders and so on. This is exactly tree-like!

\

**Exercise 17.1.2.** Think of other common uses of trees that weren't mentioned above. Try and determine possible implementations or designs of these trees. 

[<br>](https://joshhug.gitbooks.io/hug61b/content/chap17/)

---

## 22.2 Tree Traversals

### Tree ~~Iteration~~ Traversal 

Remember how we learned to iterate through lists? There was a way to iterate through lists that felt natural. Just start at the beginning... and keep going.

Or maybe we did some things that were a little strange, like iterate through the reverse of the list. Recall we also wrote iterators in [discussion](https://sp19.datastructur.es/materials/discussion/disc05.pdf) to skip over students who didn't write descriptions on the Office Hours queue.

Now how do you iterate over a tree? What's the correct 'order'?

Before we answer that question, we must not use the word iteration. Instead, we'll call it 'traversing through a tree' or a 'tree traversal'. Why? No **real** reason, except that everyone calls iteration through trees 'traversals'. Maybe it's because the world likes alliterations.

So what are some natural ways to 'traverse' through a tree? As it turns out, there are a few –– unlike a list which basically has one natural way to iterate through it:

1. Level order traversal. Breadth First Search (BFS)

2. Depth-First traversals –– of which there are three: pre-order, in-order and post-order. (DFS)

Let's test out these traversals mentioned above on the tree below.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FPHdNGVHUsajCLGWRLpTn%2FScreen%20Shot%202023-02-26%20at%206.29.34%20AM.png?alt=media&amp;token=3d6fb6b3-23ac-41e1-ae5b-0fa17b076b8d" alt=""><figcaption><p>Different Traversals on One Tree...</p></figcaption></figure>

###

#### Level Order Traversal

\

We'll iterate by levels, left to right. Level 0? D. Level 1? B and then F. Level 2? A, C, E, and G.

This gives us `D B F A C E G`.

Imagine each level was a sentence in an english book, and we just read it off line by line.

**Exercise 17.2.1.** Write the code for performing a level order traversal (warning, this is more difficult than the writing the other traversals). *Hint*: You will want to keep track of what level you are at.

#### Pre-order Traversal

Here's the idea behind pre-order traversal. Start at the root. **Visit the root** (aka, do the **action** you want to do.) The action here is "print".

So, we'll print the root. D. There we go.

Now, go left, and recurse. Then, go right and recurse.

So now we've gone left. We're at the B node. Print it. B. We'll go left after printing. (Remember, after we're done with B's left branch, we'll come back up and visit B's right.)

Keep following this logic, and you get `D B A C F E G`.<br>

```java

preOrder(BSTNode x) {

    if (x == null) return;

    print(x.key)

    preOrder(x.left)

    preOrder(x.right)

}

```

<br>

#### In-order Traversal

Slightly different, but same big-picture idea. Here, instead of **visiting** (aka **printing**) first, we'll first visit the left branch. Then we'll print. Then we'll visit the right branch.

So we start at D. We don't print. We go left.

We start at B. We don't print. We go left.

We start at A. We don't print. We go left. We find nothing. We come back up, and print A.

Then go to A's right. Find nothing. Go back up. Now we're at B. Remember, we print after visiting left and before visiting right, so now we'll print B, then we'll visit right.

Keep following this and you get `A B C D E F G`.

**An alternative** way to think about this is as follows:

First, we're at D. We know we'll print out the items from left, then D, then items from right.

\[items from left] D \[items from right].

Now what's \[items from left] equal to? We'll start at B, print out left, then print B, then print stuff from right of B.

\[items from left] = \[items from B's left] B \[items from B's right] = A B C.

A B C D \[stuff from right] = A B C D E F G.

```java

inOrder(BSTNode x) {

    if (x == null) return;    

    inOrder(x.left)

    print(x.key)

    inOrder(x.right)

}

```

#### Post-order Traversal

Again, same big-picture idea, but now we'll print left branch, then right branch, then ourselves.

Using the method we devised earlier, the result looks like:

\[items from left] \[items from right] D.

What's \[items from left]? It's the output from the B subtree.

If we're at B, we'd get \[items from left of B] \[items from right of B] B, which is equal to A C B.

Following this through, we get: `A C B E G F D`

```java

postOrder(BSTNode x) {

    if (x == null) return;    

    postOrder(x.left)

    postOrder(x.right)

    print(x.key)   

}

```

---

## 22.3 Graphs

Trees are great, aren't they? But as we saw, we could draw some things using nodes and edges that weren't trees. Specifically, our restriction that there can only be one path between any two nodes didn't fit every situation. Let's see what happens when we get rid of that restriction.

Graph Definition



#### What is a graph? 

A graph consists of:

* A set of nodes (or vertices)

* A set of zero of more edges, each of which connects two nodes.

That's it! No other restrictions.

All of the structures below in green? Everything is a valid graph! The second one is also a tree, but none of the others are.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FP17PH3N4x75Nyr89oZBQ%2FScreen%20Shot%202023-02-26%20at%202.02.16%20PM.png?alt=media&amp;token=747b7e3f-3885-4193-8639-41ce9fe4247f" alt=""><figcaption><p>Graphs</p></figcaption></figure>

In general, note that **all trees are also graphs, but not all graphs are trees.**

#### Simple Graphs only 

Graphs can be divided into two categories: *simple* graphs and *multigraphs* (or complicated graphs, a term I invented, because that's how I like to think of them.) Fortunately, in this course (and almost all applications and research) focuses only on simple graphs. So when we say "graph" in this course, you should always think of a "simple graph" (unless we say otherwise.)

Well, it's time to address the elephant in the room. What's a simple graph?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FkFi0NSV7P1V55xHZP1oq%2FScreen%20Shot%202023-02-26%20at%202.03.21%20PM.png?alt=media&amp;token=0fb24066-ef8d-47fa-9822-82fc7d82dadc" alt=""><figcaption><p>Simple Graphs and Multigraphs</p></figcaption></figure>

Look at the graphs in red. The graph in the middle has 2 distinct edges going from/to bottom-next to/from bottom-left node. In other words, there are multiple edges between two nodes. This is **not** a simple graph, and we ignore their existence unless specified otherwise. Graphs like these are called multigraphs.

Look at the third graph. It has a loop! An edge from a node to itself! We don't allow this either. Graphs like these are sometimes categorized as multigraphs, and sometimes, even multigraphs explicitly ban self-loops.

#### More categorizations. 

Graphs are simple in the following text, and in this course, unless specified otherwise. But there are more categorizations.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FgqtlS7TmIYJ2SGZBF7to%2FScreen%20Shot%202023-02-26%20at%202.04.26%20PM.png?alt=media&amp;token=f4c10a65-f481-42f5-86c8-11cab59470e2" alt=""><figcaption></figcaption></figure>

There are undirected graphs, where an edge `(u, v)` can mean that the edge goes from the nodes u to v and from the nodes v to u too. There are directed graphs, where the edge `(u, v)` means that the edge starts at u, and goes to v (and the vice versa is not true, unless the edge `(v, u)` also exists.) Edges in directed graphs have an arrow.

There are also acyclic graphs. These are graphs that don't have any cycles. And then there are cyclic graphs, i.e., there exists a way to start at a node, follow some **unique** edges, and return back to the same node you started from.

In the above picture, we can clearly see the difference between how we draw directed and undirected edges.

Take a look at the cyclic graphs. If you start at `a`, you can run back around using only distinct edges and get back to `a`. Thus, the graph is cyclic.

Take a look at the top-left graph. Is there any node `n`, such that if you start at `n`, you can follow some distinct edges, and get back to `n`? Nope! (Remember than for directed edges, you must follow the directions. You can go from `a` to `b` but not `b` to `a`.)

---

## 22.4 Graph Problems

Graph Problems



There are many questions we can ask about a graph.

For example,

* **s-t Path**: Is there a path between vertices s and t?

* **Connectivity**: Is the graph connected, i.e. is there a path between all vertices?

* **Biconnectivity**: Is there a vertex whose removal disconnects the graph?

* **Shortest s-t Path**: What is the shortest path between vertices s and t?

* **Cycle Detection**: Does the graph contain any cycles?

* **Euler Tour**: Is there a cycle that uses every edge exactly once?

* **Hamilton Tour**: Is there a cycle that uses every vertex exactly once?

* **Planarity**: Can you draw the graph on paper with no crossing edges?

* **Isomorphism**: Are two graphs isomorphic (the same graph in disguise)?

What's cool and also weird about graph problems is that it's very hard to *tell* which problems are very hard, and which ones aren't all that hard.

For example, consider the Euler Tour and the Hamilton Tour problems. The former... is a solved problem. It was solved as early as 1873. The solution runs in O(E) where E is the number of edges in the graph.

The latter? If you were to solve it efficiently today, you would win every Math award there was, become one of the most famous computer scientists, win a million dollars, etc. No one has been able to solve this **efficiently**. The best known algorithms run in exponential times. People have been working on it for many decades!

#### One step at a time! 

Alright, well, before we solve the million dollar problem, let's solve the first one on the list. Given a source vertex s and a target vertex t, is there a path between s and t?

Graph Connectivity



In other words, write a function `connected(s, t)` that takes in two vertices and returns whether there exists a path between the two.

To begin, let's guess that we have the following code:

```java

if (s == t):

    return true;

for child in neighbors(s):

    if isconnected(child, t):

        return true;

return false;

```

**Exercise 17.4.1.** Before you move on, please read the code above, and spend time thinking about it. Does it work? Is it efficient? Run through a couple scenarios.

Alright, so, let's try it out.

We start with `connected(0, 7)`? That recursively calls `connected(1, 7)`, which then recursively calls `connected(0, 7)`. Uh-oh. Infinite looping has occurred.

**Exercise 17.4.2.** How could we fix this? Once again, thinking about this. What was the problem? We visited `s` again... but did we need to?

Alright, let's try a "remember what we visited" approach.

```java

mark s  // i.e., remember that you visited s already

if (s == t):

    return true;

for child in unmarked_neighbors(s): // if a neighbor is marked, ignore!

    if isconnected(child, t):

        return true;

return false;

```

As it turns out, this does work! Follow the example in [these slides](https://docs.google.com/presentation/d/1OHRI7Q_f8hlwjRJc8NPBUc1cMu5KhINH1xGXWDfs_dA/edit#slide=id.g76e0dad85_2_380) to see how.

#### Woah, what did we just develop? 

Depth First Paths



You may not have realized it, but we just developed a **depth-first traversal** (like pre-order, post-order, in-order) but for graphs. What did we do? Well, we marked ourself. Then we visited our first child. Then our first child marked itself, and visited its children. Then our first child's first child marked itself, and visited its children.

Intuitively, we're going deep (i.e., down our family tree to our first child, our first child's first child aka our first grandchild, our first grandchild's first child, and so on... visiting this entire lineage), before we even touch our second child.

Up next, we'll see the opposite notion, where first we visit all our children, then our grandchildren, and so on.


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：优先队列与二叉堆](/notes/cs61b/lecture-21) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：图遍历实战：DFS、BFS 与拓扑排序 →](/notes/cs61b/lecture-23) | [🎬 在 B 站观看本讲 (P22)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22) |
