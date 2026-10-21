---
title: Lecture 22 · 树与图遍历：DFS、BFS 与连通性探索：树遍历四大家族、图模型数学抽象与深度优先搜索 DFS
description: CS61B 第 22 讲：树与图遍历：DFS、BFS 与连通性探索：树遍历四大家族、图模型数学抽象与深度优先搜索 DFS
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:47 ｜ **官方原版**：Lecture 22 - Tree and Graph Traversals  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P22)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1Gyke5ZMrgcMuBTa7qHAoklWZB3yf_yqQAymK2nV-Nqs) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/22.-tree-traversals-and-graphs)  
> **快速导航**：[← 上一讲 (P21 堆与优先队列：二叉堆与数组表示)](/notes/cs61b/lecture-21) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P23 图的表示与实现：邻接表与 BFS 最短路径) →](/notes/cs61b/lecture-23)

---

## 1. 树遍历全谱系：DFS 深度优先 vs BFS 广度优先

*(参考时间：00:02:15 · [视频跳转 (P22 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=135))*

遍历（Traversal）是指按照某种系统规则，不重不漏地访问数据结构中的每一个节点。

### 深度优先遍历（DFS）三大流派（递归自然实现）
1. **前序遍历（Pre-order）**：`当前节点 -> 左子树 -> 右子树`（常用于树的复制与序列化）；
2. **中序遍历（In-order）**：`左子树 -> 当前节点 -> 右子树`（对于 BST，中序遍历天然输出严格升序键序列）；
3. **后序遍历（Post-order）**：`左子树 -> 右子树 -> 当前节点`（常用于自底向上计算树高、目录占用空间统计）。

### 广度优先遍历（BFS / Level-order）
按层推进，先访问深度为 0 的根，再访问深度为 1 的所有节点，依此类推。基于**先进先出队列（Queue）**实现。

## 2. 图（Graph）的数学抽象与真实世界建模

*(参考时间：00:13:40 · [视频跳转 (P22 00:13:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=820))*

图是比树更为通用和强大的离散数学结构。树本质上只是一种**特殊的图（无环连通图）**。

一个图 $G = (V, E)$ 由两个基本集合构成：
- **顶点集（Vertices, $V$）**：系统中的实体实体（城市、网页、社交用户、计算机主机）；
- **边集（Edges, $E$）**：实体之间的关联纽带（公路、超链接、好友关系、网络线缆）。

### 核心属性维度
- **有向（Directed）vs 无向（Undirected）**：边是否存在单向流转箭头；
- **加权（Weighted）vs 无权（Unweighted）**：边是否承载距离、过路费或带宽等数值权重；
- **环（Cycles）**：是否存在一条路径能够沿着边绕回到出发点。

## 3. 图遍历的最大挑战：环路死循环危机

*(参考时间：00:25:20 · [视频跳转 (P22 00:25:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=1520))*

在树结构中，因为没有环且每个节点只有一个父节点，遍历算法永远不会走回头路。  
但在通用的图中，**环路无处不在**！如果直接照搬树的递归遍历，程序将沿着环路陷入无休止的死循环，最终引发 `StackOverflowError` 崩溃。

**破局法宝：访问标记数组 `boolean[] marked`**！  
在探索任何顶点之前，先检查它是否已被点亮；只有未曾造访过的节点，才允许进入探索，确保**每个顶点与每条边仅被处理有限次**。

## 4. 深度优先搜索（DFS）经典算法模板

*(参考时间：00:36:10 · [视频跳转 (P22 00:36:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=2170))*

DFS 模仿了古希腊神话中忒修斯探索迷宫的思想（借助阿里阿德涅之线）：一路勇往直前探索，遇到死胡同则逐步原路回溯（Backtrack）。

```java
public class DepthFirstPaths {
    private boolean[] marked; // 记录已被访问的顶点
    private int[] edgeTo;     // edgeTo[w] = v 表示沿着 v -> w 的边首次到达 w
    private final int s;      // 起始源点

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
                edgeTo[w] = v; // 记录路径回溯前驱
                dfs(G, w);     // 深入递归探索邻居
            }
        }
    }

    public boolean hasPathTo(int v) { return marked[v]; }
}
```

## 5. 本讲小结与路径回溯

*(参考时间：00:46:50 · [视频跳转 (P22 00:46:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22&t=2810))*

- **路径重构**：通过 `edgeTo` 数组，我们可以从目标终点 $v$ 开始一路反向顺藤摸瓜：`v -> edgeTo[v] -> edgeTo[edgeTo[v]] ... -> s`，将栈中的顶点逆序弹出即可精准得到从 $s$ 到 $v$ 的完整连通路径；
- **时间复杂度**：每个顶点被标记一次，每条边在无向图中被检查两次，总时间为严格的 $\Theta(V + E)$ 线性时间。

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：堆与优先队列：二叉堆与数组表示](/notes/cs61b/lecture-21) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：图的表示与实现：邻接表与 BFS 最短路径 →](/notes/cs61b/lecture-23) | [🎬 在 B 站观看本讲 (P22)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=22) |
