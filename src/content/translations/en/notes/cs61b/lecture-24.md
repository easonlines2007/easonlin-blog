---
kind: notes
source: cs61b/lecture-24
title: "Lecture 24 · Shortest Paths: Dijkstra’s Algorithm and A* Search"
description: "CS61B Lecture 24: Shortest path algorithm: Dijkstra and A*
  heuristic search: single source shortest path, edge relaxation operation,
  Dijkstra greedy proof and A* Manhattan heuristic"
sourceHash: 488d3a2ca35498934d0f59baf61fd7419a1ae8d38e7fb2d4e2d3248e48e3424b
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 5: Priority Queues & Graph Algorithms  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 51:37 ｜ **Official original version**: Lecture 24 - Shortest Paths  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P24)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1mT-F0fxm-sVZj9EQS_E_QMv5SVfeCGptI9vsKpyp57Y) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/24.-shortest-paths)  
> **Quick navigation**: [← Previous lecture (P23 Graph traversal practice: DFS, BFS and topological sorting)](/en/notes/cs61b/lecture-23) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P25 Minimum spanning tree: Cut theorem and Prim/Kruskal algorithm) →](/en/notes/cs61b/lecture-25)

---

## 1. Single-Source Shortest Paths (SSSP)

*(Reference time: 00:01:25 · [Video jump (P24 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=85))*

In a weighted directed graph, each edge  $e = (u \to v)$  All come with a non-negative weight  $w(e)$ (Representing physical distance or fuel consumption).

given starting point  $s$, the goal of the single-source shortest path problem is: **Calculate from starting point  $s$  Starting from, the minimum total weight path to every other vertex in the graph (Shortest Path Tree, SPT)**.

## 2. Algorithm general engine: edge relaxation operation (Edge Relaxation)

*(Reference time: 00:09:40 · [Video jump (P24 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=580))*

The underlying core atomic operations of all shortest path algorithms are on an edge  $e = (v \to w, \text{weight})$  execute **Relaxation**: 

```java
private void relax(DirectedEdge e) {
    int v = e.from(), w = e.to();
    // 核心三角不等式检验
    if (distTo[w] > distTo[v] + e.weight()) {
        distTo[w] = distTo[v] + e.weight(); // 找到更短捷径，更新距离！
        edgeTo[w] = e;                      // 更新到达 w 的最佳前驱边
    }
}
```

The physical meaning of relaxation: if via vertices  $v$  Walk further  $e$  Arrive  $w$  distance than is currently known to reach  $w$  The shortest distance is still shorter, then we "relax" this constraint and tighten the upper bound of the shortest path!

## 3. Full process deduction of Dijkstra's Algorithm

*(Reference time: 00:19:00 · [Video jump (P24 00:19:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=1140))*

Turing Award winner Edsger Dijkstra proposed a classic greedy algorithm using a priority queue:

### Five steps of algorithm execution
1. Initialization: `distTo[s] = 0`, all other vertices  `distTo[v] = \infty`; 
2. Insert starting point into priority queue  `pq.insert(s, 0)`; 
3. **Loop out of queue**: Remove the current value from the priority queue  `distTo`  smallest unconfirmed vertex  $v$; 
4. **Greedy Determined**: at this time  `distTo[v]`  It has been absolutely determined to be the global optimal solution and cannot be optimized anymore!
5. **Relax all outgoing edges**: pair vertex  $v$  All starting edges are relaxed and the weights in the priority queue are dynamically updated.

```mermaid
graph TD
    A["from PQ pop up distTo smallest vertex v"] --> B["establish v The shortest path is locked"]
    B --> C["Traverse v all neighbor sides of (v -> w)"]
    C --> D{"distTo[w] > distTo[v] + weight ?"}
    D -->|Yes| E["update distTo[w]，and will w Insert/Update to PQ"]
    D -->|No| F["ignore"]
```

### Complexity:
When using binary heap optimization, the total algorithm time is  **$O((V + E) \log V)$**!

## 4. Why does Dijkstra strictly prohibit negative weight edges?

*(Reference time: 00:28:40 · [Video jump (P24 00:28:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=1720))*

The correctness of Dijkstra's algorithm is based on the greedy assumption: **As you continue to move forward along a path, the total weight will only increase monotonically and never decrease!**

If there is a negative weight edge (for example, the weight of an edge is  $-10$): 
- A vertex that has been ejected from the PQ and marked as "locked shortest" may become shorter due to the sudden appearance of a high negative return channel behind it;
- The greedy strategy completely failed, causing serious errors in the calculation results! The Bellman-Ford algorithm must be used to deal with negative weight edges.

## 5. A\* heuristic search algorithm (A\* Search): a compass guiding the course

*(Reference time: 00:36:20 · [Video jump (P24 00:36:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=2180))*

In electronic map navigation, if we want to find the shortest driving route from San Francisco to New York, the Dijkstra algorithm will blindly spread 360 degrees around like water waves, and will even search the Pacific Ocean to the west first!

Peter Hart et al. proposed  **A*  search algorithm*\*: 
- The priority criterion for Dijkstra's priority queue is purely the actual distance traveled: $f(v) = g(v) = \text{distTo}[v]$; 
- **A*  Introduced heuristic estimation function  $h(v)$ (Heuristic Estimate)\*\*: From the vertex  $v$  to target end point  $t$  The estimated straight-line distance!
- The sorting priority of the priority queue is changed to the comprehensive score: 
  $$f(v) = g(v) + h(v)$$

By firmly pulling the exploration direction toward the end point, A\* sharply narrows the search range from a "big disk" that spreads randomly into a "thin ellipse" that accurately rushes toward the target, greatly reducing the navigation calculation time!

## 6. Summary of this lecture and post-class self-assessment

*(Reference time: 00:44:00 · [Video jump (P24 00:44:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24&t=2640))*

### Comprehensive self-test questions after class
The A\* algorithm must ensure that the shortest path found is absolutely correct, and the heuristic function  $h(v)$  What mathematical conditions must be met?  
**Answers and analysis**:   
The heuristic function must satisfy **Admissibility**: that is  $h(v)$  estimated distance **Never exceed the real physical shortest distance ($h(v) \le h^*(v)$, never overestimate the cost)**! For example, in map navigation, the straight-line distance (Euclidean distance) between two points is always less than or equal to the real road curve distance, so the straight-line distance is an excellent heuristic to adopt.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 24. Shortest Paths

By: Mihir Mirchandani and Teresa Luo

---

## 24.1 Introduction

### Shortest Paths 

#### Recalls 

So far, we have methods to do the following

* find a path from a given vertex, `s`, to every reachable vertex in the graph.

* find a **shortest** path from a given vertex, `s`, to every reachable vertex in the graph. (...or do we?)

Before we answer the mysterious question posed below, let's further recall the two types of searches we could use to do the above two things: BFS or DFS.

Are both going to always be correct? Yes. Does one give better results? BFS finds you the **shortest** paths whereas DFS does not. Is one more efficient than the other, runtime-wise? No. Is one more efficient than the other, space-wise?

* DFS is worse for spindly graphs. Imagine a graph with 10000 nodes all spindly. We'll end up making 10000 recursive calls, which is bad for space.

* BFS is worse for "bushy" graphs, because our queue gets used a lot.

#### Answering the mysterious question 

Did we develop an algorithm to find the **shortest** path from a given vertex to every other reachable vertex? Well, kind of. We developed an algorithm that works well on graphs with no edge labels. Here's what we did: we developed an algorithm that finds us the shortest (**where shortest means the fewest number of edges**) paths from a given source vertex.

But that's not always the correct definition of shortest. Sometimes, our graph edges might have 'weights', and A-B is considered farther than A-C if the A-B edge has weight, say, 5 and the A-C edge only has weight, say, 3.

That is why we need a different algorithm for finding the shortest path when we have the edge weights in the graph.

---

## 24.2 Dijkstra's Algorithm

Professor Hug's Lecture on Shortest Paths



In [Chapter 23.1](https://cs61b-2.gitbook.io/cs61b-textbook/23.-graph-traversals-and-implementations/23.1-bfs-and-dfs) we have implemented BFS & DFS. We discussed the idea of using BFS for finding the shortest path trees however when the graph edges have weight, BFS will upset us. 

Consider the following example. You are on campus and playing a game with your friends around Hearst Memorial Mining Building. You start at the location `s` and you want to go to the location `t`. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxzpKygRCaSkngJwoCLdT%2Fdj.png?alt=media&amp;token=5ea88ee0-a3f3-4fbb-abe3-8d73c7e47ed8" alt=""><figcaption></figcaption></figure>

BFS will yield a route of length 330 m instead of therefore we need an algorithm that takes into account edge distances, also known as “edge weights”.

<div><figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FGI1nX4Nm3ZAUc9kaw7Ob%2Fimage1.png?alt=media&amp;token=5db1c532-bfe6-4079-8777-885479aeeab0" alt=""><figcaption><p>Correct Result</p></figcaption></figure> <figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FPFJWmPg62SiIO5bk1wtI%2Fimage2.png?alt=media&amp;token=e49217f2-d064-472a-b705-2fa01052f875" alt=""><figcaption><p>BFS result</p></figcaption></figure></div>

#### Observations 

Note that the shortest path (for a graph whose edges have weights) can have many, many edges. What we care to minimize is the sum of the weights of the edges on the selected path.

Secondly, note the fact that the shortest paths tree from a source `s` can be created in the following way:

* For every vertex `v` (which is not `s`) in the graph, find the shortest path from `s` to `v`.

* "Combine"/"Union" all the edges that you found above. Tada!

Thirdly, note that the "Shortest Path Tree" will **always be a tree**. Why? Well, let's think about our original solution, where we maintained an edgeToedgeTo array. For every node, there was exactly one "parent" in the edgeToedgeTo array. (Why does this imply that the "Shortest Path Tree" will be a tree? Hint: A tree has `V-1` edges, where `V` is the number of nodes in the tree.)

#### Dijkstra's Algorithm \[\[/ˈdaɪkstrə/]] 

Dijkstra's algorithm takes in an input vertex �s, and outputs the shortest path tree from �s. How does it work?

1. Create a priority queue.

2. Add `s` to the priority queue with priority 00. Add all other vertices to the priority queue with priority ∞∞.

3. While the priority queue is not empty: pop a vertex out of the priority queue, and **relax** all of the edges going out from the vertex.

#### What does it mean to **relax**? 

Suppose the vertex we just popped from the priority queue was `v`. We'll look at all of `v`'s edges. Say, we're looking at edge (`v`,`w`) (the edge that goes from `v` to `w`). We're going to try and relax this edge.

What that means is: Look at your current best distance to `w` from the source, call it **curBestDistToW**. Now, look at your **curBestDistToV**+weight(`v`,`w`) (let's call it **potentialDistToWUsing**).

Is **potentialDistToWUsing** **better, i.e., smaller** than **curBestDistToW**? In that case, set **curBestDistToW=potentialDistToWUsingV**, and update the **edgeTo\[`w`]** to be `v`.

**Important note: we never relax edges that point to already visited vertices.**

This whole process of calculating the potential distance, checking if it's better, and potentially updating is called relaxing.

#### Pseudocode 

```

def dijkstras(source):

    PQ.add(source, 0)

    For all other vertices, v, PQ.add(v, infinity)

    while PQ is not empty:

        p = PQ.removeSmallest()

        relax(all edges from p)

```

```

def relax(edge p,q):

   if q is visited (i.e., q is not in PQ):

       return

   if distTo[p] + weight(edge) < distTo[q]:

       distTo[q] = distTo[p] + w

       edgeTo[q] = p

       PQ.changePriority(q, distTo[q])

```

Guarantees

As long as the edges are all non-negative, Dijkstra's is guaranteed to be optimal.

#### Proofs and Intuitions 

Assume all edges are non-negative.

* At start, distTo\[source] = 0. This is optimal.

* After relaxing all edges from source, let vertex $$v\_1$$ be the vertex with the minimum weight (i.e., the one that's closest to the source.) **Claim: distTo\[**$$v\_1$$**​​] is optimal, i.e., whatever the value of distTo\[**$$v\_1$$**​​] is at this point is the shortest distance from** $$s$$ **to** $$v\_1$$**​​**. Why?

  * Let's try to see why this **MUST** be the case.

  * Suppose that it isn't the case. Then that means that there is some other path from $$s$$ to $$v\_1$$

    which is shorter than the direct path ($$s$$,​​ $$v\_1$$). Ok, so let's consider this hypothetical cool shorter path... it would have to look like ($$s$$, $$v\_a$$​​, $$v\_b$$​​,…, $$v\_1$$​​). But... ($$s$$, $$v\_a$$) is **already** bigger than ($$s$$, $$v\_1$$). (Note that this is true because $$v\_1$$ is the vertex that is closest to $$s$$ from above.) So how can such a path exist which is actually shorter? It can't!

* Now, the next vertex to be popped will be $$v\_1$$​​. (Why? Note that it currently has the lowest priority in the PQ!)

* So now, we can make this same argument for $$v\_1$$​​ and all the relaxation it does. (This is called "proof by induction". It's kind of like recursion for proofs.) And that's it; we're done.

#### Negative Edges? 

Things can go pretty badly when negative edges come into the picture. Consider the following image.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FHwPMHevk4XVzaycft4nL%2Fimage.png?alt=media&amp;token=78ff03ab-25af-4f37-b4bd-1add7021165b" alt=""><figcaption></figcaption></figure>

Suppose you're at that vertex labeled 34. Now you're going to try to relax all your edges. You have only one outgoing edge from yourself to 33 with weight −67. Ah, but note: vertex 33 is already visited (it's marked with white.) So... we don't relax it. (Recall the pseudocode for the relax method.)

Now we go home thinking that the shortest distance to 33 is 82 (marked in pink.) But really, we should have taken the path **through** 34 because that would have given us a distance of 101−67=34. Oops.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FuQcIYrjQT6Psn98MNxFp%2Fimage.png?alt=media&amp;token=442e9801-9cb0-4aee-9adc-d080f21acb42" alt=""><figcaption></figcaption></figure>

**Dijkstra's algorithm is not guaranteed to be correct for negative edges. It might work... but it isn't guaranteed to work.**

Try this out: suppose that your graph has negative edges, but all the negative edges only go out of the source vertex `s` that you were passed in. Does Dijkstra's work? Why / Why not?

#### A noteworthy invariant 

Observe that once a vertex is popped off the priority queue, it is never re-added. Its distance is never re-updated. So, in other words, once a vertex is popped from the priority queue, we **know** the true shortest distance to that vertex from the source.

One nice consequence of this fact is "short-circuiting". Suppose... that I didn't care about the shortest-paths tree, but just wanted to find the shortest path from some source to some other target. Suppose that you wanted to take, like, the cities of the world on a graph, and find the shortest path from Berkeley to Oakland. Running `dijkstra(Berkeley)` will mean that you can't actually stop this powerful beast of an algorithm... you have to let it run... till it finds the shortest path to LA, and Houston, and New York City, and everywhere possible!

Well. Once `Oakland` is popped off the priority queue in the algorithm, we can just stop. We can just return the distance and the path we have at that point, and it will be correct. So **sometimes** `dijkstra` takes in not only a source, but also a target. This is for the purposes of short-circuiting.

#### [Demo](https://docs.google.com/presentation/d/1_bw2z1ggUkquPdhl7gwdVBoTaoJmaZdpkV6MoAgxlJc/pub?start=false\&loop=false\&delayms=3000\&slide=id.g771336078_0_180)

\ <br>

---

## 24.3 A\* Algorithm

Professor Hug's Lecture on Shortest Paths



### A\* 

We ended the section on Dijkstra's by discussing a possible way to make Dijkstra's short-circuit and just stop once it hits a given target. Is this good enough?

To answer the above question, we need to sit down and think about how dijkstra's really works. Pictorially, Dijkstra's starts at the source node (imagine the source node being the center of a circle.) And Dijkstra's algorithm now makes concentric circles around this point, in increasing radii, and 'sweeps' these circles, capturing points.

So... the first node Dijkstra's visits is the city closest to the source, then the city next-closest, then the city next-closest, and so on. This sounds like a good idea. What Dijkstra's is doing is first visiting all the cities that are 1-unit distance away, then 2 unit-distance away, and so on. In concentric circles.

Now imagine the following: on a map of the US, start somewhere in the center, say, Denver. Now I want you to find me a path to New York using Dijkstra's. You'll end up traversing nodes in 'closest concentric circle' order.

*The link to the picture in the original textbook is no longer valid, please refer to [Dijkstra search range and A\* schematic description](https://cs61b-2.gitbook.io/cs61b-textbook/24.-shortest-paths/24.3-a-algorithm).*

You'll make a small circle first, just around Denver, visiting all the cities in that circle. Eventually, your circles will get bigger, and you'll make a circle that passes through Las Vegas (and would have visited, by now, all the other cities that fall within the circle.) Then, your circle will be big enough to engulf Los Angeles and Dallas... but you're nowhere close to New York yet. All this effort, all these circles, but still... so far from the target. Short-circuiting helps, but only if you actually hit the target node fast.

If only there existed a way to use your prior knowledge: the fact that new-york was eastwards, so you could "hint" your algorithm to prefer nodes that are on the east instead of those that are on the west.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FrhvlH5Vi4VDBvxTXJv7x%2Fimage.png?alt=media&amp;token=11c4dc71-d1dd-4657-ae3d-f46b0c1177ca" alt=""><figcaption><p>A*</p></figcaption></figure>

#### Introducing: A Star 

No, not the sun. It's an algorithm called A\*.

Observe the following: Dijkstra's is a "true" (i.e., not an estimate) measure of the distance **to** a node from the source. So, say, you visit a city in Illinois and your source was Denver, then by that time, you have a true measure of the distance **to** Denver. What we're missing is: some janky, rough estimate of the distance from a node **to** the target node, New York. That would complete the picture. Because then, if you sum these two things up (the measure from the source to the node + the estimate from the node to the target), you get (an estimate from the source to the target.) Of course, the better your original estimate from the node to the target, the better your estimate from the source to the target, the better your A\* algorithm runs.

So, let's modify our Dijkstra's algorithm slightly. In Dijkstra's, we used **bestKnownDistToV** as the priority in our algorithm. This time, we'll use **bestKnownDistToV+estimateFromVToGoal** as our heuristic.

Here is a [demo](https://docs.google.com/presentation/d/177bRUTdCa60fjExdr9eO04NHm0MRfPtCzvEup1iMccM/edit#slide=id.g771336078_0_180)!

#### Chicken And Egg 

We have a problem. How do we know what the estimate is? I mean, the estimate itself is a **distance**, and we're using A\* to **find** the distance from some node to some other node.

It seems like we're in an instance of the classic chicken and egg problem. "What came first? The chicken or the egg?" Aside, FYI, one reddit user had an [idea](https://www.reddit.com/r/dadjokes/comments/97768x/i_ordered_a_chicken_and_an_egg_from_amazon_ill/) about this.

Well, it's called an estimate because it's exactly that. We use A\* to get the **true** shortest path from a source to a target, but the estimate is something we approximate. Coming up with good estimates is hard sometimes.

But to give you an example in our Denver - New York case. What we might do is just look up the GPS Coordinates of these cities, and calculate the straight line distance between those somehow. Of course, this wouldn't be correct because there's probably no straight line that one could take from Denver to NYC, but it's a fairly good estimate!

#### Bad Heuristics 

Suppose that the shortest path from Denver to New York goes through some city $$C$$. Suppose that my GPS is broken, and so I think that this city $$C$$ is infinity far away from everything, and I set the estimated distance to $$C$$ from every other node in the graph to ∞.

What will happen? Well A\* will basically never want to visit this city. (Remember what our priorities are in the priority queue; for this city, the priority will always be ∞∞, even if I visit the immediate neighbors of this city. The estimated distances from the immediate neighbors of this city to this city were set to ∞∞ after all.)

So... now what? We lose. A\* breaks. We get the wrong answer back. Oops.

The takeaway here is that heuristics need to be good. There are two definitions required for goodness.

1. Admissibility. heuristic(v, target) ≤≤ trueDistance(v, target). (Think about the problem above. The true distance from the neighbor of $$C$$ to $$C$$ wasn't infinity, it was much, much smaller. But our heuristic said it was ∞∞, so we broke this rule.)

2. Consistency. For each neighbor $$v$$ of $$w$$:

   * heuristic(v, target) ≤≤ dist(v, w) + heuristic(w, target)

   * where dist(v, w) is the weight of the edge from v to w.

---

## 24.4 Summary

**Dijktra’s Algorithm and Single-Source Shortest Paths.** Suppose we want to record the shortest paths from some source to every single other vertex (so that we can rapidly found a route from s to X, from s to Y, and so forth). We already know how to do this if we’re only counting the number of edges, we just use BFS.

But if edges have weights (representing, for example road lengths), we have to do something else. It turns out that even considering edge weights, we can preprocess the shortest route from the source to every vertex very efficiently. We store the answer as a “shortest paths tree”. Typically, a shortest paths tree is stored as an array of edgeTo\[\] values (and optionally distTo\[\] values if we want a constant time distTo() operation).

To find the SPT, we can use Dijkstra’s algorithm, which is quite simple once you understand it. Essentially, we visit each vertex in order of its distance from the source, where each visit consists of relaxing every edge. Informally, relaxing an edge means using it if its better than the best known distance to the target vertex, otherwise ignoring it. Or in pseudocode:

```

Dijkstra(G, s):

    while not every vertex has been visited:

        visit(unmarked vertex v for which distTo(v) is minimized)

```

Where visit is given by the following pseudocode:

```

visit(v):

    mark(v)

    for each edge e of s:

        relax(e)

```

And finally, relax is given by:

```

relax(e):

    v = e.source

    w = e.target        

    currentBestKnownWeight = distTo(w)

    possiblyBetterWeight = distTo(v) + e.weight

    if possiblyBetterWeight < currentBestKnownWeight

        Use e instead of whatever we were using before

```

Runtime is $$O(V \cdot  logV + V \cdot  log V + E \cdot  logV)$$, and since $$E > V$$ for any graph we’d run Dijkstra’s algorithm on, this can be written as more simply O(E log V). See slides for runtime description.

**A\* Single-Target Shortest Paths.** If we need only the path to a single target, then Dijkstra’s is inefficient as it explores many many edges that we don’t care about (e.g. when routing from Denver to NYC, we’d explore everything within more than a thousand miles in all directions before reaching NYC).

To fix this, we make a very minor change to Dijkstra’s, where instead of visiting vertices in order of distance from the source, we visit them in order of distance from the source + h(v), where h(v) is some heuristic.

Or in pseudocode:

```

A*(G, s):

    while not every vertex has been visited:

        visit(unmarked vertex v for which distTo(v) + h(v) is minimized)

```

It turns out (but we did not prove), that as long as h(v) is less than the true distance from s to v, then the result of A\* will always be correct.

Note: In the version in class, we did not use an explicit ‘mark’. Instead, we tossed everything in the PQ, and we effectively considered a vertex marked if it had been removed from the PQ.

---

## 24.5 Exercises

### Procedural

Questions 1 and 2, suppose we run Dijkstra's from A. Break ties alphabetically. Breaking ties alphabetically means that if we insert B into the fringe, and C is in the fringe with the same priority, we have a tie! To break this tie, we will do so alphabetically, putting B before C.

1. What is the order that vertices are visited? Please separate vertices with spaces, e.g. A B C ....

2. Select all the edges in the shortest paths tree. \*

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F4IbqLAKWqD0YUr9tpO4X%2Fimage.png?alt=media&amp;token=c349e991-3d4c-4181-b608-8f093d7295ae" alt=""><figcaption></figcaption></figure>

<details>

<summary>Problem 1</summary>

A B E C F D G

For this, and all questions on this check in, refer to this walkthrough video for an explanation: [https://youtu.be/5MFOu8bNvd8](https://www.google.com/url?q=https://youtu.be/5MFOu8bNvd8\&sa=D\&source=editors\&ust=1679291837950894\&usg=AOvVaw3zdQsT2ly7PQQGYjid7E6m)

</details>

<details>

<summary>Problem 2</summary>

AE

AB

CE

DF

EG

EF

</details>

For questions 3-5, suppose we run A\* from A to D. Break ties alphabetically

3. What is the order that vertices are visited? Note that not all vertices need be visited. Please separate vertices with spaces, e.g. A B C ....

4. Select all the edges in the shortest path from A -> D, as determined by A\*. Note that this may not be the correct shortest path. Also note that we are NOT finding the shortest path tree, but just the edges on the shortest path!

5. In the previous question, you probably noticed that the actual shortest path from A -> D was not found! The reason for this is because the value of one heuristic is too high. Determine which heuristic this is, and what is the maximum its value can be so that A\* returns the correct shortest path.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FVPLS3QYwI6trHjr7TPRk%2Fimage.png?alt=media&amp;token=236841bd-77b2-48cc-9b65-b0dead02b505" alt=""><figcaption></figcaption></figure>

<details>

<summary>Problem 3</summary>

A E C B D

</details>

<details>

<summary>Problem 4</summary>

AE

CD

CE

</details>

<details>

<summary>Problem 5</summary>

F:2

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Graph traversal in practice: DFS, BFS and topological sorting](/en/notes/cs61b/lecture-23) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Minimum spanning tree: Cut theorem and Prim/Kruskal algorithm →](/en/notes/cs61b/lecture-25) | [🎬Watch this lecture on Bilibili (P24)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=24) |
