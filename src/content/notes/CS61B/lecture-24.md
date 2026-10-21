---
title: Lecture 24 · 单源最短路径：Dijkstra 算法与边松弛：加权图最短路径、边松弛操作 Edge Relaxation 与贪心策略
description: CS61B 第 24 讲：单源最短路径：Dijkstra 算法与边松弛：加权图最短路径、边松弛操作 Edge Relaxation 与贪心策略
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 24
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:37 ｜ **官方原版**：Lecture 24 - Shortest Paths  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P24)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1mT-F0fxm-sVZj9EQS_E_QMv5SVfeCGptI9vsKpyp57Y) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/24.-shortest-paths)  
> **快速导航**：[← 上一讲 (P23 图的表示与实现：邻接表与 BFS 最短路径)](/notes/cs61b/lecture-23) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P25 最小生成树：割性质与 Prim 算法) →](/notes/cs61b/lecture-25)

---

## 1. 加权图最短路径问题（Single-Source Shortest Paths）

*(参考时间：00:02:10 · [视频跳转 (P24 00:02:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=130))*

在现实应用中，路线往往带有时长、过路费或物理里程等权重。BFS 只能计算边数最少的路径，无法处理边权重不相等的加权图。

**加权单源最短路径（SSSP）定义**：  
给定一个有向/无向加权图 $G = (V, E, w)$ 和一个起始源点 $s$，寻找从 $s$ 出发到达图中任意其他顶点 $v$ 的**总边权重之和最小的路径**。

## 2. 最短路径的核心操作原语：边松弛（Edge Relaxation）

*(参考时间：00:12:30 · [视频跳转 (P24 00:12:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=750))*

所有最短路径算法的共同灵魂操作是**边松弛（Relaxation）**。

维护两个核心数组：
- `double[] distTo`：记录当前已知的从源点 $s$ 到各顶点的最短距离预估值（初值全为 $\infty$，`distTo[s] = 0`）；
- `int[] edgeTo`：记录最短路径树上的前驱顶点。

**对边 $e: v \to w$ 执行松弛操作**：
> 检查“通过顶点 $v$ 中转前往 $w$”是否比目前已知的到达 $w$ 的路径更短？  
> 若 `distTo[v] + weight < distTo[w]`，则果断更新 `distTo[w]`，并将 `edgeTo[w] = v`！

```mermaid
graph LR
    S["源点 s"] --> V["v (distTo = 5)"]
    V -->|"边权 = 2"| W["w (原 distTo = 10 -> 松弛后更新为 7!)"]
```

```java
private void relax(DirectedEdge e) {
    int v = e.from(), w = e.to();
    if (distTo[v] + e.weight() < distTo[w]) {
        distTo[w] = distTo[v] + e.weight();
        edgeTo[w] = v;
        // 若优先队列包含 w 则更新其优先级，若无则插入
        pq.changePriority(w, distTo[w]);
    }
}
```

## 3. 伟大的 Dijkstra 算法流程

*(参考时间：00:24:45 · [视频跳转 (P24 00:24:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=1485))*

计算机科学先驱 Edsger Dijkstra 于 1956 年提出了著名的 Dijkstra 贪心算法：

1. 初始化 `distTo[s] = 0`，其余所有顶点的 `distTo` 置为 $\infty$；
2. 将所有顶点放入一个基于 `distTo` 排序的**最小优先队列（MinPQ）**中；
3. 进入循环，每次从优先队列中弹出当前 `distTo` 最小的顶点 $u$；
4. 遍历 $u$ 的所有出边 $(u, v)$，对每条出边执行**松弛操作（relax）**；
5. 重复直至优先队列排空！

```java
public class DijkstraSP {
    private double[] distTo;
    private DirectedEdge[] edgeTo;
    private IndexMinPQ<Double> pq;

    public DijkstraSP(EdgeWeightedDigraph G, int s) {
        distTo = new double[G.V()];
        edgeTo = new DirectedEdge[G.V()];
        pq = new IndexMinPQ<>(G.V());

        Arrays.fill(distTo, Double.POSITIVE_INFINITY);
        distTo[s] = 0.0;
        pq.insert(s, 0.0);

        while (!pq.isEmpty()) {
            int v = pq.delMin(); // 贪心弹出当前离源点最近的顶点
            for (DirectedEdge e : G.adj(v)) {
                relax(e);
            }
        }
    }
}
```

## 4. 算法正确性基石与负权边禁区

*(参考时间：00:36:20 · [视频跳转 (P24 00:36:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=2180))*

**Dijkstra 算法不变量（Invariant）**：
> **当一个顶点 $v$ 从优先队列中出队（delMin）时，从源点 $s$ 到 $v$ 的最短距离已被彻底盖棺定论，后续绝不可能再出现更短的路径！**

**致命红线：严禁包含负权重边（Negative Edge Weights）！**  
如果图中存在负权重边，未来可能通过绕经负权边把总路径缩短，从而彻底粉碎 Dijkstra 的贪心不变量！在有负权边的场景中，必须使用代价更高的 **Bellman-Ford 算法**。

## 5. 本讲小结与运行复杂度

*(参考时间：00:46:30 · [视频跳转 (P24 00:46:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=2790))*

- **操作次数统计**：
  - 每个顶点出队一次：$V$ 次 `delMin`，每次耗时 $O(\log V)$；
  - 每条边最多被松弛一次：$E$ 次 `changePriority`，每次耗时 $O(\log V)$；
- **总时间复杂度**：**$\Theta((V + E) \log V)$**；在稀疏图（$E \approx V$）下，接近令人惊叹的极速对数线性时间 $\Theta(V \log V)$！

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：图的表示与实现：邻接表与 BFS 最短路径](/notes/cs61b/lecture-23) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：最小生成树：割性质与 Prim 算法 →](/notes/cs61b/lecture-25) | [🎬 在 B 站观看本讲 (P24)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24) |
