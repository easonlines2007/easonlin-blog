---
kind: notes
source: cs61b/lecture-23
title: "Lecture 23 · Graph Traversal in Practice: DFS, BFS, and Topological Sorting"
description: "CS61B Lecture 23: Graph traversal practice: DFS, BFS and
  topological sorting: maze search rules, visited markers to prevent infinite
  loops, the shortest number of steps and topological sequences"
sourceHash: f9a86d7ed0d70704d6d56b8a985216c195a336a8c70ce8d6fbe4dd02f8b4abcb
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 5: Priority Queues & Graph Algorithms  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 51:42 ｜ **Official original version**: Lecture 23 - Graph Traversals and Implementations  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P23)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1NKWnXSJ8pUn1E2Cw6zidxMRuXf_aINKCpW7XpEkyz6c) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/23.-graph-traversals-and-implementations)  
> **Quick navigation**: [← Previous lecture (P22 Tree and graph traversal theory)](/en/notes/cs61b/lecture-22) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P24 Shortest path algorithm: Dijkstra and A\* heuristic search) →](/en/notes/cs61b/lecture-24)

---

## 1. Depth First Search (DFS): Maze Backtracking and Call Stack Mechanism

*(Reference time: 00:01:20 · [Video jump (P23 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=80))*

In graph traversal, the biggest disaster is **Infinite loops caused by Cycles**!

Unlike trees, nodes in graphs may form closed loops. If you recurse blindly, the program will spin around in the same loop repeatedly and eventually trigger  `StackOverflowError`  collapse.

### The Law of the Labyrinth of Theseus: `visited[]`  Boolean tag array
The only rule for solving the loop is to simulate the ancient Greek hero Theseus exploring the maze: **Every time you step onto a new vertex, immediately draw a mark on the ground. Never step onto an already marked vertex!**

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

## 2. Breadth-first search (BFS): the shortest path with the least number of edges

*(Reference time: 00:11:30 · [Video jump (P23 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=690))*

When all edge weights are equal (unweighted graph), find the starting point  $s$  to the end  $t$  of **Minimum number of steps path**, BFS must be used:

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
**Theorem**: BFS visits the vertex for the first time  $w$  When , the number of edges passed must be the starting point  $s$  Arrive  $w$  of **Global minimum number of edges**!

## 3. Topological Sort: Task arrangement of directed acyclic graph (DAG)

*(Reference time: 00:22:15 · [Video jump (P23 00:22:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=1335))*

In university course selection prerequisites, software engineering compilation dependencies (Makefile/Gradle), or workflow scheduling, there are sequence dependencies between tasks.

### formal definition
for a **Directed Acyclic Graph (DAG, Directed Acyclic Graph)**, topological sorting is to arrange all vertices into a linear sequence such that for any directed edge in the graph  $u \to v$, **vertex  $u$  appear at the vertex in the sequence  $v$  in front of**!

### Minimalist algorithm based on DFS Reverse Post-Order
1. Run DFS on each unvisited vertex in the DAG;
2. **At the moment of DFS recursive backtracking (that is, after all downstream neighbors of a vertex have been processed), the node is pushed onto a stack** (Sequence);
3. After the traversal is completed, the sequence popped from the top of the stack to the bottom of the stack, **It happens to be an absolutely legal topological sorting sequence!**

Only takes perfect linear time  **$\Theta(V + E)$**!

## 4. Summary of this lecture and self-assessment after class

*(Reference time: 00:32:00 · [Video jump (P23 00:32:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23&t=1920))*

### Comprehensive self-test questions after class
If a directed graph contains cycles, can topological sorting still be performed? Why?  
**Answers and analysis**:   
**Absolutely not!**  Assume there is a cycle  $A \to B \to C \to A$. Topological sorting requirements  $A$  in  $B$  in front, $B$  in  $C$  in front, $C$  in  $A$  Previously, this constitutes an irreconcilable paradox in mathematical logic. A necessary and sufficient condition for the existence of topological sorting is that the graph must be an acyclic graph (DAG).

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

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

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Traversal theory of trees and graphs](/en/notes/cs61b/lecture-22) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Shortest path algorithm: Dijkstra and A\* heuristic search →](/en/notes/cs61b/lecture-24) | [🎬Watch this lecture on Bilibili (P23)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=23) |
