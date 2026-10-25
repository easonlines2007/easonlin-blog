---
kind: notes
source: cs61b/lecture-14
title: "Lecture 14 · Union-Find I: Dynamic Connectivity, Quick Find, and Quick Union"
description: "CS61B Lecture 14: Union-Find I: Dynamic Connectivity and Tree
  Structure Evolution: Union-Find ADT Contract, Quick Find Architecture, Quick
  Union Tree Model and Degenerate Bottlenecks"
sourceHash: 1fd791c0be0a619d5e0044f8c21acbad0abd14b1f97b82c18c01a65de7ba94ca
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 3: Asymptotics & Disjoint Sets  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 51:00 ｜ **Official original version**: Lecture 14 - Disjoint Sets  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P14)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/18pzklQAvV94ODFpjeB60Rzj79wFHdkIB-ePWR_MeClk) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/14.-disjoint-sets)  
> **Quick navigation**: [← Previous lecture (P13 midterm review: Midterm 1 core test points sand table and analysis of major questions)](/en/notes/cs61b/lecture-13) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P15 Union-find II: Weighted union-find, path compression and amortization analysis) →](/en/notes/cs61b/lecture-15)

---

## 1. Dynamic Connectivity: and look up the definition of ADT

*(Reference time: 00:01:30 · [Video jump (P14 00:01:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=90))*

In actual computer networks, social relationship graphs or physical connectivity simulations, we often face the following core requirements:
- The system initially contains  $N$  mutually isolated element objects (numbered  $0, 1, 2, \dots, N-1$); 
- Over time, new connections are constantly established between two objects;
- The system needs to use extreme performance to quickly determine whether there is a connected path between any two objects.

This is the famous **Dynamic Connectivity Problem**.

### Mathematical equivalence of connectivity relations (Equivalence Relation)
"Connectivity" in dynamic connectivity is a strict equivalence relationship that satisfies three mathematical axioms:
1. **Reflexive**: object  $p$  Always connected to itself ($p \sim p$); 
2. **Symmetric**:If  $p$  with  $q$  connected, then  $q$  also with  $p$  connected ($p \sim q \implies q \sim p$); 
3. **Transitive**:If  $p$  with  $q$  connected, and  $q$  with  $r$  connected, then  $p$  with  $r$  Necessarily indirectly connected ($p \sim q \land q \sim r \implies p \sim r$).

Disjoint subsets divided by equivalence relations are called **Connected Components**.

## 2. Disjoint set abstract data type (ADT) interface contract: DisjointSets

*(Reference time: 00:08:40 · [Video jump (P14 00:08:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=520))*

We define the highest abstraction interface that supports this problem -`DisjointSets`: 

```java
public interface DisjointSets {
    /** 
     * 在元素 p 和元素 q 之间建立连接（将两者所在的集合合并）
     */
    void connect(int p, int q);

    /** 
     * 判断元素 p 和元素 q 是否连通（是否属于同一个集合）
     */
    boolean isConnected(int p, int q);
}
```

Note: Concurrently lookup ADT  **Doesn't care about how the specific connection path is laid out.** (That belongs to the shortest path topic of graph traversal), it **We only care about whether the two points are connected or not (macro-connected state)**!

## 3. Evolution stage one: Quick Find architecture design (array storage collection ID)

*(Reference time: 00:15:30 · [Video jump (P14 00:15:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=930))*

Our first implementation idea pursues extremely simple query performance——**Quick Find**.

### core physical model
Use an integer array  `int[] id`, the array subscript represents the element number, and the value of the array represents the **Set ID**.
> **core principles**: **if and only if  `id[p] == id[q]`  when, element  $p$  and  $q$  Connected!**

```java
public class QuickFindDS implements DisjointSets {
    private int[] id;

    public QuickFindDS(int N) {
        id = new int[N];
        // 初始时，每个元素自成一个独立集合
        for (int i = 0; i < N; i++) {
            id[i] = i;
        }
    }

    @Override
    public boolean isConnected(int p, int q) {
        // 瞬时 O(1) 判定！
        return id[p] == id[q];
    }

    @Override
    public void connect(int p, int q) {
        int pid = id[p];
        int qid = id[q];
        if (pid == qid) return;

        // 必须遍历整个数组，将所有属于 pid 的元素全部“刷漆”改为 qid！
        for (int i = 0; i < id.length; i++) {
            if (id[i] == pid) {
                id[i] = qid;
            }
        }
    }
}
```

### Complexity Analysis and Fatal Flaws
- **Query operation  `isConnected`**: Just one array index read, the time complexity is amazing  **$\Theta(1)$**; 
- **connection operation  `connect`**: Every time you merge two collections, you must use one  `for`  The length of the entire loop traversal is  $N$  The time complexity of the entire array is extremely heavy  **$\Theta(N)$**!
- if we want to  $N$  elements executed  $N$  connection operations, the total time overhead is  $\Theta(N^2)$,Performance collapse in large-scale dynamic networks.

## 4. Evolution stage two: Quick Union architecture (tree topology and parent pointer model)

*(Reference time: 00:24:10 · [Video jump (P14 00:24:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=1450))*

In order to avoid every time  `connect`  To traverse the entire array, algorithm masters proposed **Tree Forest Model——Quick Union**.

### core physical model
- Instead of storing set IDs in tiles, we organize each connected set into a tree **Tree**; 
- Also use an integer array  `int[] parent`, but what is saved in the array is no longer the collection ID, but **The parent index of the current node**!
- **Root node**: The root node of the tree has no parent node, and it is agreed that its parent pointer points to itself (i.e.  `parent[root] == root`), or stored as a negative number;
- **connected equivalence rule**: **Two elements are connected if and only if they have exactly the same tree root node (Same Root) upwards!**

```mermaid
graph TD
    subgraph Tree1 ["collection A (root node: 0)"]
        0((0)) --> 0
        1((1)) --> 0
        2((2)) --> 0
        4((4)) --> 1
    end
    subgraph Tree2 ["collection B (root node: 3)"]
        3((3)) --> 3
        5((5)) --> 3
    end
```

## 5. Quick Union code implementation and connection constant breakthrough

*(Reference time: 00:32:00 · [Video jump (P14 00:32:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=1920))*

Let's write the core logic of Quick Union:

```java
public class QuickUnionDS implements DisjointSets {
    private int[] parent;

    public QuickUnionDS(int N) {
        parent = new int[N];
        for (int i = 0; i < N; i++) {
            parent[i] = i; // 初始时，每个节点都是自己的根
        }
    }

    /** 寻找元素 p 所在树的根节点 */
    private int find(int p) {
        while (parent[p] != p) {
            p = parent[p]; // 顺着父指针向上攀爬
        }
        return p;
    }

    @Override
    public boolean isConnected(int p, int q) {
        return find(p) == find(q);
    }

    @Override
    public void connect(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        if (rootP == rootQ) return;

        // 绝妙的常数连接：只需让其中一个根节点成为另一个根节点的子节点！
        parent[rootP] = rootQ;
    }
}
```

### Why Quick Union  `connect`  Potentially better performance?
observe  `connect(p, q)`: After finding two root nodes, **Only need to perform a single assignment  `parent[rootP] = rootQ;`  You can merge two big trees**! No more using a for loop to traverse the entire array like Quick Find!

## 6. Extreme degradation disaster: Slender bamboo trees cause a single operation to degrade to O(N)

*(Reference time: 00:40:15 · [Video jump (P14 00:40:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=2415))*

Does Quick Union really solve the performance problem?  
Not really! At worst, it's even worse than Quick Find.

### fatal worst-case construct
Suppose we perform joins consecutively in the following order:
```java
connect(0, 1);
connect(1, 2);
connect(2, 3);
...
connect(N - 2, N - 1);
```

Because we blindly let  `parent[rootP] = rootQ`, the shape of the tree degenerated completely uncontrollably into a line **Extremely long and slender linear singly linked list (Tall Spindly Tree)**!

```text
0 -> 1 -> 2 -> 3 -> ... -> (N - 1)
```

At this time:
- The height of the tree expanded to  $N$; 
- every call  `find(0)`, you have to climb up from the beginning  $N$  layer;
- `isConnected`  and  `connect`  The time complexity of all degenerates into miserable  **$O(N)$**!

How to break the curse of trees growing out of control? We will introduce the ultimate evolution of union-find sets in the next lecture - weighting and path compression!

## 7. Summary of this lecture and self-test after class

*(Reference time: 00:46:00 · [Video jump (P14 00:46:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14&t=2760))*

### Early union lookup performance showdown

| Algorithm architecture | Construction complexity | Query complexity  `isConnected` | Connection complexity  `connect` |
| :--- | :--- | :--- | :--- |
| **Quick Find** | $\Theta(N)$ | $\Theta(1)$  (Check in seconds) | $\Theta(N)$  (slow brush) |
| **Quick Union** | $\Theta(N)$ | $O(H)$  (depends on tree height  $H$) | $O(H)$  (depends on tree height  $H$, the worst  $O(N)$) |

---

### Comprehensive self-test questions after class

#### Question 1 (Status Tracking)
Given a Quick Find collection with an initial size of 6. Execute in sequence  `connect(0, 1)`, `connect(2, 3)`, `connect(0, 2)`. Please write this time  `id`  The contents of the array (assuming  `connect(p, q)`  will belong to  `id[p]`  Change all items of  `id[q]`).  
**Answers and analysis**:   
1. `connect(0, 1)`: `id[0]`  becomes 1. Array: `[1, 1, 2, 3, 4, 5]`;   
2. `connect(2, 3)`: `id[2]`  becomes 3. Array: `[1, 1, 3, 3, 4, 5]`;   
3. `connect(0, 2)`: `pid = id[0] = 1`, `qid = id[2] = 3`. Change all items with a value of 1 to 3. The array becomes: `[3, 3, 3, 3, 4, 5]`. At this time 0, 1, 2, 3 belong to the same set 3.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 14. Disjoint Sets

By Dhruti Pandya and Mihir Mirchandani

---

## 14.1 Introduction

🚨 New Data Structure Alert 🚨: Disjoint Sets

People like you and I reside in our countries and live here. We can think of each country as a set and all of the people within it as elements within that set. The same person cannot live in two different countries simultaneously. What we have just modeled is a **disjoint set**. 

> Two sets are named *disjoint sets* if they have no elements in common. A Disjoint-Sets (or Union-Find) data structure keeps track of a fixed number of elements partitioned into a number of *disjoint sets*. The data structure has two operations:

1. `connect(x, y)`: connect `x` and `y`. Also known as `union`

2. `isConnected(x, y)`: returns true if `x` and `y` are connected (i.e. part of the same set).

Professor Hug's Explanation of an Introduction to Disjoin Sets



A Disjoint Sets data structure has a fixed number of elements that each start out in their own subset. By calling `connect(x, y)` for some elements `x` and `y`, we merge subsets together.

For example, say we have four elements which we'll call A, B, C, D. To start off, each element is in its own set:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxsyREPB2xGzGzysImVi8%2Fimage.png?alt=media&amp;token=0db9231c-5ad3-4a15-9544-a8e05b15a3e3" alt=""><figcaption><p>{A} {B} {C} {D}</p></figcaption></figure>

After calling `connect(A, B)`:

\ <br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FcK0IfTA8wVVpfQwvbo21%2Fimage.png?alt=media&amp;token=d02dcfa4-ff7b-41a7-b69d-f622fb5e7f91" alt=""><figcaption><p>{A, B} {C} {D}</p></figcaption></figure>

Note that the subsets A and B were merged. Let's check the output some `isConnected` calls:

\

`isConnected(A, B) -> true`

`isConnected(A, C) -> false`

After calling `connect(A, D)`:

\ <br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FHFBnkVIp8P9SFO5BUuwM%2Fimage.png?alt=media&amp;token=fc98c635-c615-4697-837e-5e7f00546b5f" alt=""><figcaption><p>{A, B, D} {C}</p></figcaption></figure>

\

We find the set A is part of and merge it with the set D is part of, creating one big A, B, D set. C is left alone.

`isConnected(A, D) -> true`\

`isConnected(A, C) -> false`

<br>

With this intuition in mind, let's formally define what our DisjointSets interface looks like. As a reminder, an **interface** determines *what* behaviors a data structure should have (but not *how* to accomplish it). In this way, any class that implements the `DisjointSets` interface knows to always include functions: `connect(int p, int q)` and `isConnected(int p, int q)` as seen below. For now, we'll only deal with sets of non-negative integers. This is not a limitation because in production we can assign integer values to anything we would like to represent.

```java

public interface DisjointSets {

    /** connects two items P and Q */

    void connect(int p, int q);

    /** checks to see if two items are connected */

    boolean isConnected(int p, int q); 

}

```

\

But how are we going to save data for these Disjoint sets to see which member belongs to it's corresponding set? What data structures are we going to use to represent this awesome data structure? In addition to learning about how to implement a fascinating data structure, this chapter will be a chance to see how an implementation of a data structure evolves. We will discuss four iterations of a Disjoint Sets design before being satisfied: [*Quick Find*](https://cs61b-2.gitbook.io/cs61b-textbook/14.-disjoint-sets/14.2-quick-find) *→* [*Quick Union*](https://cs61b-2.gitbook.io/cs61b-textbook/14.-disjoint-sets/14.3-quick-union) *→* [*Weighted Quick Union (WQU)*](https://cs61b-2.gitbook.io/cs61b-textbook/14.-disjoint-sets/14.4-weighted-quick-union-wqu) *→* [*WQU with Path Compression*](https://cs61b-2.gitbook.io/cs61b-textbook/14.-disjoint-sets/14.5-weighted-quick-union-with-path-compression). **We will see how design decisions greatly affect asymptotic runtime and code complexity.**

---

## 14.2 Quick Find

Keeping track of set membership...

Professor Hug's explanation on Quick Find



#### List of Sets

Intuitively, we might first consider representing Disjoint Sets as a list of sets, e.g, `List<Set<Integer>>`.

For instance, if we have N=6 elements and nothing has been connected yet, our list of sets looks like: `[{0}, {1}, {2}, {3}, {4}, {5}, {6}]`. Looks good. However, consider how to complete an operation like `connect(5, 6)`. We'd have to iterate through up to `N` sets to find 5 and `N` sets to find 6. Our runtime becomes `O(N)`. And, if you were to try and implement this, the code would be quite complex.

> The lesson to take away is that **initial design decisions determine our code complexity and runtime.**

#### Quick Find

Let's consider another approach using a *single array of integers*.

* The **indices of the array** represent the elements of our set.

* The **value at an index** is the set number it belongs to.

For example, we represent `{0, 1, 2, 4}, {3, 5}, {6}` as:<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FhbKp07TfM6BGDUoJ5w7D%2Fimage.png?alt=media&amp;token=1242953a-0b42-4ca2-9d2d-c9c4e5e12b76" alt=""><figcaption><p>Set 4: {0, 1, 2, 4} | Set 5: {3, 5} | Set 6: {6}</p></figcaption></figure>

The array indices (0...6) are the elements. The value at `id[i]` is the set it belongs to. *The specific set number doesn't matter as long as all elements in the same set share the same id.*

#### **`connect(x, y)`**

Let's see how the connect operation would work. Right now, `id[2] = 4` and `id[3] = 5`. After calling `connect(2, 3)`, all the elements with id 4 and 5 should have the same id. Let's assign them all the value 5 for now:<br>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F8wgaJLZGOKYIbMeP5uiI%2Fimage.png?alt=media&amp;token=c0eda17a-7255-4eb2-bfd6-cf1c6153f812" alt=""><figcaption><p>Set 5: {0, 1, 2, 3, 4, 5} | Set 6: {6}</p></figcaption></figure>

**`isConnected(x, y)`**

To check `isConnected(x, y)`, we simply check if `id[x] == id[y]`. Note this is a constant time operation!

\

We call this implementation "Quick Find" because finding if elements are connected takes constant time.

#### Code & Runtimes

```java

public class QuickFindDS implements DisjointSets {

    private int[] id;

    /* Θ(N) */

    public QuickFindDS(int N){

        id = new int[N];

        for (int i = 0; i < N; i++){

            id[i] = i;

        }

    }

    /* need to iterate through the array => Θ(N) */

    public void connect(int p, int q){

        int pid = id[p];

        int qid = id[q];

        for (int i = 0; i < id.length; i++){

            if (id[i] == pid){

                id[i] = qid;

            }

        }

    }

    /* Θ(1) */

    public boolean isConnected(int p, int q){

        return (id[p] == id[q]);

    }

}

```

N = number of elements in our DisjointSets data structure<br>

| Implementation | Constructor    | `connect` | `isConnected` |

| -------------- | -------------- | --------- | ------------- |

| ListOfSets     | Θ(N)[¹](/en/notes/cs61b/lecture-14#note) | O(N)      | O(N)          |

| QuickFind      | Θ(N)           | Θ(N)      | Θ(1)          |

#### Note

1\. We didn't discuss this but you can reason that having to create N distinct sets initially is Θ(N)[ ↩](https://joshhug.gitbooks.io/hug61b/content/chap9/chap92.html#reffn_1)

---

## 14.3 Quick Union

Professor Hug's explanation on Quick Union



Suppose we prioritize making the `connect` operation fast. We will still represent our sets with an array. Instead of an id, we assign each item the index of its parent. If an item has no parent, then it is a 'root' and we assign it a negative value.

This approach allows us to imagine each of our sets as a tree. For example, we represent `{0, 1, 2, 4}, {3, 5}, {6}` as:

 Note that we represent the sets using **only an array**. We visualize it ourselves as trees.

<figure><img src="https://joshhug.gitbooks.io/hug61b/content/chap9/9.3.1.png" alt=""><figcaption></figcaption></figure>

For QuickUnion we define a helper function `find(int item)` which returns the root of the tree `item` is in. For example, for the sets above, `find(4) == 0`, `find(1) == 0`, `find(5) == 3`, etc. Each element has a unique root.

**`connect(x, y)`**

To connect two items, we find the set that each item belongs to (the roots of their respective trees), and make one the child of the other. Example:

`connect(5, 2)`:

1. `find(5)` -> 3

2. `find(2)` -> 0

3. Set `find(5)`'s value to `find(2)` aka `parent[3] = 0`

 Note how element 3 now points to element 0, combining the two trees/sets into one.

<figure><img src="https://joshhug.gitbooks.io/hug61b/content/chap9/9.3.2.png" alt=""><figcaption></figcaption></figure>

In the best case, if `x` and `y` are both roots of their trees, then `connect(x, y)` just makes `x` point to `y`, a Θ(1) operation! (Hence the name QuickUnion)

**`isConnected(x, y)`**

If two elements are part of the same set, then they will be in the same tree. Thus, they will have the same root. So for `isConnected(x, y)` we simply check if `find(x) == find(y)`.

#### Performance 

There is a potential performance issue with QuickUnion: the tree can become very long. In this case, finding the root of an item (`find(item)`) becomes very expensive. Consider the tree below:

![](https://joshhug.gitbooks.io/hug61b/content/chap9/9.3.3.png)

In the worst case, we have to traverse all the items to get to the root, which is a Θ(N) runtime. Since we have to call `find` for both `connect` and `isConnected`, the runtime for both is upper bounded by O(N).

#### Summary and Code 

N = number of elements in our DisjointSets data structure

| Implementation | Constructor | `connect` | `isConnected` |

| -------------- | ----------- | --------- | ------------- |

| QuickUnion     | Θ(N)        | O(N)      | O(N)          |

| QuickFind      | Θ(N)        | Θ(N)      | Θ(1)          |

| QuickUnion     | Θ(N)        | O(N)      | O(N)          |

From the runtime chart, QuickUnion seems worse than QuickFind! Note however that O(N) as an **upper bound**. When our trees are balanced, both `connect` and `isConnected` perform reasonably well. In the next section we'll see how to *guarantee* they perform well.

```java

public class QuickUnionDS implements DisjointSets {

    private int[] parent;

    public QuickUnionDS(int num) {

        parent = new int[num];

        for (int i = 0; i < num; i++) {

            parent[i] = -1;

        }

    }

    private int find(int p) {

        while (parent[p] >= 0) {

            p = parent[p];

        }

        return p;

    }

    @Override

    public void connect(int p, int q) {

        int i = find(p);

        int j= find(q);

        parent[i] = j;

    }

    @Override

    public boolean isConnected(int p, int q) {

        return find(p) == find(q);

    }

}

```

---

## 14.4 Weighted Quick Union (WQU)

Improving on Quick Union relies on a key insight: whenever we call `find`, we have to climb to the root of a tree. Thus, the shorter the tree the faster it takes!

**New rule:** whenever we call `connect`, we always link the root of the smaller tree to the larger tree.

Following this rule will give your trees a maximum height of $$log N$$, where N is the number of elements in our Disjoint Sets. How does this affect the runtime of `connect` and `isConnected`?

Professor Hug's explanation on Weighted Quick Union



Let's illustrate the benefit of this with an example. Consider connecting the two sets T1 and T2 below:

![](https://joshhug.gitbooks.io/hug61b/content/chap9/9.4.1.png)

We have two options for connecting them:

 The first option we link T1 to T2. In the second, we link T2 to T1.

<figure><img src="https://joshhug.gitbooks.io/hug61b/content/chap9/9.4.2.png" alt=""><figcaption></figcaption></figure>

The **second option is preferable** as it only has a height of 2, rather than 3. By our new rule, we would choose the second option as well because T2 is smaller than T1 (size of 3 compared to 6).

We determine smaller / larger by the number of items in a tree. Thus, when connecting two trees we need to know their size (or weight). We can store this information in the root of the tree by replacing the `-1`'s with `-(size of tree)`. 

**Maximum height: Log N**

Following the above rule ensures that the *maximum* height of any tree is Θ(log N). N is the number of elements in our Disjoint Sets. **By extension, the runtimes of `connect` and `isConnected` are bounded by O(log N).** 

Why $$logN$$? The video above presents a more visual explanation. Here's an optional mathematical explanation why the maximum height is $$log\_{2}N$$. Imagine any element $$x$$ in tree $$T1$$. The depth of $$x$$ increases by 1 only when $$T1$$ is placed below another tree $$T2$$. When that happens, the size of the resulting tree will be at least double the size of $$T1$$ because $$size(T2)\geq size(T1)$$. The tree with $$x$$ can double at most $$log\_{2}N$$ times until we've reached a total of N items ($$2^{log\_{2}N} = N$$). So we can double up to $$log\_{2}N$$​​ times and each time, our tree adds a level → maximum $$log\_{2}N$$ levels. 

You may be wondering why we don't link trees based off of height instead of weight. It turns out this is more complicated to implement and gives us the same Θ(log N) height limit.

#### Summary 

| Implementation       | Constructor | `connect` | `isConnected` |

| -------------------- | ----------- | --------- | ------------- |

| QuickUnion           | Θ(N)        | O(N)      | O(N)          |

| QuickFind            | Θ(N)        | Θ(N)      | Θ(1)          |

| QuickUnion           | Θ(N)        | O(N)      | O(N)          |

| Weighted Quick Union | Θ(N)        | O(log N)  | O(log N)      |

N = number of elements in our DisjointSets data structure

---

## 14.5 Weighted Quick Union with Path Compression

Weighted Quick Union is pretty good, but we can do even better!

Professor Hug's explanation on Weighted Quick Union with Path Compression



The clever insight is realizing that whenever we call `find(x)` we have to traverse the path from `x` to root. So, along the way we can connect all the items we visit to their root at no extra asymptotic cost.

Connecting all the items along the way to the root will help make our tree shorter with each call to `find`.

Recall that **both `connect(x, y)` and `isConnected(x, y)` always call `find(x)` and `find(y)`.** Thus, after calling `connect` or `isConnected` enough, essentially all elements will point directly to their root.

By extension, the average runtime of `connect` and `isConnected` becomes **almost constant** in the long term! This is called the *amortized runtime*.

More specifically, for M operations on N elements, WQU with Path Compression is in $$O(N + M (lg\cdot  N))$$. lg\* is the [iterated logarithm](https://en.wikipedia.org/wiki/Iterated_logarithm) which is less than 5 for any real-world input.

#### Summary 

N: number of elements in Disjoint Set

| Implementation             | `isConnected` | `connect` |

| -------------------------- | ------------- | --------- |

| Quick Find                 | Θ(1)          | Θ(N)      |

| Quick Union                | O(N)          | O(N)      |

| Weighted Quick Union (WQU) | O(log N)      | O(log N)  |

| WQU with Path Compression  | O(α(N))\*     | O(α(N))\* |

\*behaves as constant in long term.

---

## 14.6 Exercises

### Factual

1. [Problem 2](https://drive.google.com/file/d/1GuTG5O-2SSudWgm47rIi4orkmmpU4Apa/view?usp=share_link) from the Spring 2016 Midterm 2.

2. [Problem 1d ](https://drive.google.com/file/d/1uE1QlF4YguWVp8m8UJ97R2xPC4b1NnQ5/view?usp=sharing)from the Spring 2015 Midterm 2.

3. Suppose we have the following WQU with path compression. What is the height of the tree after we call `isConnected(8, 9)`?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FrEYpCw5iIiY7YE1egI68%2Fch14-exercises-pathcompression.png?alt=media&amp;token=9598428e-259c-4e0a-ab9d-32cde5a60fdb" alt=""><figcaption></figcaption></figure>

<details>

<summary>Problem 1</summary>

[Solutions](https://drive.google.com/file/d/1KXLkjx1e8QPiu-waBJFwmcT5IToMHQK5/view?usp=sharing) are linked here and on the course website.

</details>

<details>

<summary>Problem 2</summary>

[Solutions](https://drive.google.com/file/d/1IYt4VbzdX4dTekh6cYAC8tigpJ_LgljV/view?usp=sharing) are linked here and on the course website.

</details>

<details>

<summary>Problem 3</summary>

The resulting tree will have height 1. Every node along the path from `0` to `9` will now have parent `0`, and similarly every node along the path from `0` to `8` will also have parent `0`.

</details>

### Conceptual

1. Which of the following arrays could represent a valid weighted quick union structure?

   * [ ] `[8, 0, 4, 0, 0, 4, 0, 4, 2, 0]`

   * [ ] `[4, -8, 8, 2, 1, -2, 1, 1, 4, 5]`

   * [ ] `[3, 3, 5, 9, 3, 6, 3, 4, 1, -10]`

   * [ ] `[2, -10, 1, 1, 1, 1, 1, 2, 1, 7]`

<details>

<summary>Problem 1</summary>

* [ ] `[8, 0, 4, 0, 0, 4, 0, 4, 2, 0]`: invalid. There is a cycle 8 --> 2 --> 4 --> 0 --> 8.

* [ ] `[4, -8, 8, 2, 1, -2, 1, 1, 4, 5]`: invalid. The maximum height is $$4 > \log\_2 (10)$$.

* [ ] `[3, 3, 5, 9, 3, 6, 3, 4, 1, -10]`: invalid. The size of the tree rooted at 9 (excluding the subtree rooted at 3) is less than the size of the tree rooted at 3. As such, when we connected the two trees, 3 should have been the parent of 9 instead of the other way around.

* [ ] `[2, -10, 1, 1, 1, 1, 1, 2, 1, 7]`: valid.

</details>

### Procedural

1. Define a *fully connected* WQU as one where all elements are in the same set. What is the maximum and minimum height of a fully connected WQU with 6 elements?

2. Suppose we have a WQU of height H. What is the minimum number of elements that must be in the WQU?

<details>

<summary>Problem 1</summary>

The minimum height is always 1 (all elements are connected to the root). The maximum height is 2 (we take the floor of $$\log\_2 6$$).

</details>

<details>

<summary>Problem 2</summary>

We know that $$H \leq \log\_2 N$$, where $$N$$ is the number of elements in the WQU. As such, $$N \geq 2^H$$.

</details>

### Metacognitive

1. [Problem 3](https://drive.google.com/file/d/1yWyRp7QTizspTp9dsKz5yxE6bSf9YUIi/view?usp=sharing) from the Spring 2017 Midterm 2.

2. Suppose we create a WQU with $$N$$items, then we perform $$M\_C$$ union operations and $$M\_U$$ union operations. Using big O notation, what is the runtime of this sequence of operations?

3. Using the same variables as problem 2, describe a sequence of operations that would result in a runtime of $$O(N + M\_U + M\_C)$$.

4. Write a `int find(int p)` method for the WQU with path compression. It should perform path compression as described in lecture: any node on the path from root to our target node should have its parent reset to the root. It takes in the target node `p` and returns the root of the tree `p` is in.

<details>

<summary>Problem 1</summary>

[Solutions](https://drive.google.com/file/d/1b99XARlZxg3NMfeSAVt2yzDzwSEcASq3/view?usp=sharing) are linked here and on the course website.

</details>

<details>

<summary>Problem 2</summary>

$$O(N + (M\_U + M\_C)\log N)$$. Each operation takes $$\log N$$ time, and we need $$N$$ time to initialize an empty array of size $$N$$.

</details>

<details>

<summary>Problem 3</summary>

Initialize the array as usual. Then, connect the items in sequence: `connect(0, 1)`, `connect(0, 2)`, `connect(0, 3)`, up to `connect(0, N)`. This results in a height-1 tree, on which `connect` and `isConnected` run in constant time.

</details>

<details>

<summary>Problem 4</summary>

```java

public int find(int p) {

    int root = p;

    while (root != parent[root]) {

        root = parent[root];

    }

    while (p != root) {

        int newp = parent[p];

        parent[p] = root;

        p = newp;

    }

    return root;

}

```

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Midterm review: Midterm 1 core test points sand table and analysis of major questions](/en/notes/cs61b/lecture-13) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Union-find II: Weighted union-find, path compression and amortized analysis →](/en/notes/cs61b/lecture-15) | [🎬Watch this lecture on Bilibili (P14)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=14) |
