---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 21 · 优先队列与二叉堆：PQ 接口契约、二叉堆性质、Swim/Sink 算法与数组紧凑表示
description: CS61B 第 21 讲：优先队列与二叉堆：PQ 接口契约、二叉堆性质、Swim/Sink 算法与数组紧凑表示
topic: CS61B
order: 21
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 5: 优先队列与图算法 (Priority Queues & Graph Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：52:37 ｜ **官方原版**：Lecture 21 - Heaps and Priority Queues  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P21)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1XVJfoSYH2ItiD1rz9yvyEf_HelejbfkYxQgukbgclSY) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/21.-heaps-and-priority-queues)  
> **快速导航**：[← 上一讲 (P20 散列 II：负载因子、动态扩容与 Java HashMap 内核)](/notes/cs61b/lecture-20) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P22 树与图的遍历理论) →](/notes/cs61b/lecture-22)

---

## 1. 优先队列抽象数据类型（Priority Queue ADT）

*(参考时间：00:01:25 · [视频跳转 (P21 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21&t=85))*

在普通队列（Queue）中，元素遵循先进先出（FIFO）规则。而在现实世界中，事件往往带有轻重缓急：
- 医院急诊室：病情最危急的患者必须优先治疗，而非先排队的患者；
- 操作系统的进程调度器：高优先级进程抢占 CPU；
- 图的最短路径算法（Dijkstra）：每次必须选出距离最近的下一个顶点。

### 优先队列（Priority Queue）契约
```java
public interface PriorityQueue<Item> {
    void add(Item x);      // 插入元素
    Item getSmallest();    // 查看优先级最高（键值最小）的元素
    Item removeSmallest(); // 弹出优先级最高的元素
    int size();
}
```

### 朴素实现对比
- **无序数组/链表**：`add` 是 $O(1)$，但 `removeSmallest` 必须扫描全表，耗时 $O(N)$；
- **有序数组/链表**：`removeSmallest` 是 $O(1)$，但 `add` 插入时必须维持顺序，耗时 $O(N)$；
- **自平衡二叉搜索树（BST/LLRB）**：`add` 和 `removeSmallest` 都是 $O(\log N)$，但树结构复杂，指针开销大，且我们并不需要全局完全有序。

我们能否有一种比平衡树更加轻量、物理存储更紧凑的专职结构？  
**答案就是二叉堆（Binary Heap）！**

## 2. 二叉堆（Binary Heap）的形式化定义与结构不变量

*(参考时间：00:10:15 · [视频跳转 (P21 00:10:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21&t=615))*

一个二叉最小堆（Binary Min-Heap）是一棵满足两项严苛物理约束的二叉树：

### 约束 1：完全二叉树性质（Completeness Property）
树必须是**完全二叉树（Complete Binary Tree）**：
- 除了最底下一层，所有其他层的节点必须完全填满；
- 最底下一层的叶子节点必须**严格从左至右紧密排布**，中间绝对不允许留有任何空隙！

### 约束 2：最小堆序性（Min-Heap Property）
树中的每一个节点的值，都必须**小于等于其任意子节点的值**（$Parent \le Children$）：
- 根节点永远是全局绝对的最小值！
- 注意：左右子节点之间没有任何大小顺序要求！

```mermaid
graph TD
    1((1)) --> 3((3))
    1 --> 2((2))
    3 --> 6((6))
    3 --> 7((7))
    2 --> 5((5))
    2 --> 4((4))
```

## 3. 二叉堆核心操作算法：上浮（Swim）与下沉（Sink）

*(参考时间：00:19:30 · [视频跳转 (P21 00:19:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21&t=1170))*

### 1. 插入操作：末尾追加与上浮（Swim / Sift Up）
1. 将新元素放置在完全二叉树的**最末尾可用空位**（满足完全二叉树性质）；
2. 检查新节点与其父节点的大小：若新节点小于父节点，违背堆序性！
3. **上浮修复（Swim）**：将该节点与其父节点交换位置，重复向上比较，直到大于等于父节点或到达根节点。

### 2. 删除最小操作：首尾置换与下沉（Sink / Sift Down）
1. 根节点即为最小值，暂存用于返回；
2. **将完全二叉树的最后一个叶子节点挪到根节点位置**；
3. **下沉修复（Sink）**：
   - 将当前节点与其**两个孩子中的较小者**进行比较；
   - 若当前节点大于较小的孩子，违背堆序性，将其与该孩子交换位置；
   - 沿着较小分支持续向下沉降，直到小于等于两个孩子或成为叶子节点。

由于完全二叉树的高度严格等于 $\lfloor\log_2 N\rfloor$，因此 `add` 和 `removeSmallest` 的最坏时间复杂度均为严格的 **$O(\log N)$**！

## 4. 堆的极致数组紧凑表示：指针消除与硬件级寻址

*(参考时间：00:29:00 · [视频跳转 (P21 00:29:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21&t=1740))*

因为二叉堆是绝对严格的完全二叉树，**我们根本不需要任何指向左右孩子的指针对象引用**！可以直接将其平铺存放于一个普通原生数组中！

### 1-Based 索引寻址公式
采用从索引 1 开始存放根节点的规范（索引 0 空置）：

```text
数组索引:  [0]  [1]  [2]  [3]  [4]  [5]  [6]  [7]
存储元素:  --    1    3    2    6    7    5    4
```

对于索引为 $k$ 的任意节点：
- **父节点（Parent）索引**：`k / 2`（整数除法截断）；
- **左孩子（Left Child）索引**：`2 * k`；
- **右孩子（Right Child）索引**：`2 * k + 1`！

```java
public class MinHeap<Item extends Comparable<Item>> {
    private Item[] pq;
    private int size;

    public MinHeap(int capacity) {
        pq = (Item[]) new Comparable[capacity + 1];
        size = 0;
    }

    private void swim(int k) {
        while (k > 1 && greater(k / 2, k)) {
            swap(k / 2, k);
            k = k / 2;
        }
    }

    private void sink(int k) {
        while (2 * k <= size) {
            int j = 2 * k;
            if (j < size && greater(j, j + 1)) j++; // 挑出左右孩子中的较小者
            if (!greater(k, j)) break;
            swap(k, j);
            k = j;
        }
    }
}
```

没有任何多余的指针内存开销，物理地址连续，CPU 缓存命中率极高！

## 5. 本讲小结与课后自测

*(参考时间：00:38:00 · [视频跳转 (P21 00:38:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21&t=2280))*

### 课后综合自测题
给定包含元素 `[1, 3, 2, 6, 7, 5, 4]` 的最小堆（1-indexed）。现在调用 `removeSmallest()`，写出移除后的堆数组状态。  
**答案与解析**：  
1. 弹出根节点 1；  
2. 将末尾元素 4 移到根节点位置（此时根为 4，size 变为 6）；  
3. 下沉根节点 4：比较孩子 3 和 2，较小者是 2（索引 3）；4 > 2，交换 4 与 2；  
4. 节点 4 下沉到索引 3，其左孩子为 5（索引 6），右孩子不存在；4 < 5，下沉终止；  
5. 最终数组状态（从索引 1 开始）：`[2, 3, 4, 6, 7, 5]`。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 21. Heaps and Priority Queues

By Dhruti Pandya and Angel Aldaco

---

## 21.1 Priority Queues

Binary Search Trees allowed us to efficiently search trees, only taking $$log(N)$$ time. This was because we could eliminate half of the elements of the tree at every step of our search. What if we cared more about quickly finding the *smallest* or *largest* element instead of quickly searching?

Introducing the Priority Queue



Now we come to the Abstract Data Type of a *Priority Queue*. To understand this ADT, consider a bag of items. You can add items to this bag, you can remove items from this bag, etc. The one caveat is that you can only interact with the smallest items of this bag.

```java

/** (Min) Priority Queue: Allowing tracking and removal of 

  * the smallest item in a priority queue. */

public interface MinPQ<Item> {

    /** Adds the item to the priority queue. */

    public void add(Item x);

    /** Returns the smallest item in the priority queue. */

    public Item getSmallest();

    /** Removes the smallest item from the priority queue. */

    public Item removeSmallest();

    /** Returns the size of the priority queue. */

    public int size();

}

```

#### Using Priority 

Where would we actually use this structure or need it?

* Consider the scenario where we are monitoring text messages between citizens and want to keep track of unharmonious conversations.

* Each day, you prepare a report of $$M$$ messages that are the most unharmonious using a `HarmoniousnessComparator`.

Let's take this approach: Collect all of the messages that we receive throughout the day into a single list. Sort this list and return the first $$M$$ messages.

```java

public List<String> unharmoniousTexts(Sniffer sniffer, int M) {

    ArrayList<String>allMessages = new ArrayList<String>();

    for (Timer timer = new Timer(); timer.hours() < 24; ) {

        allMessages.add(sniffer.getNextMessage());

    }

    Comparator<String> cmptr = new HarmoniousnessComparator();

    Collections.sort(allMessages, cmptr, Collections.reverseOrder());

    return allMessages.sublist(0, M);

```

Potential downsides? This approach will use $$Θ(N)$$ space when actuality we only really need to use $$Θ(M)$$ space.

**Exercise 13.1.1.** Complete the method listed above, `unharmoniousTexts` with the same functionality as described using only Θ(M) space.

#### Priority Queue Implementation 

We solved the same problem using the Priority Queue ADT, making memory more efficient. We can observe that the code is slightly more complicated, but this is not always the case.

Remember that ADT are similar interfaces and the implementation is still to be defined. Let's consider possible implementations using the data structure implementations we already know, analyzing the **worst case** runtimes of our desired operations:

* Ordered Array

  * `add`: $$Θ(N)$$

  * `getSmallest`: $$Θ(1)$$

  * `removeSmallest`: $$Θ(1)$$

* Bushy BST

  * `add`: $$Θ(logN)$$

  * `getSmallest`: $$Θ(logN)$$

  * `removeSmallest`: $$Θ(logN)$$

* HashTable

  * `add`: $$Θ(1)$$

  * `getSmallest`: $$Θ(N)$$

  * `removeSmallest`: $$Θ(N)$$

**Exercise 13.1.2.** Explain each of the runtimes above. What are the downfalls of each data structure? Describe a way of modifying one of these data structures to improve performance.

Can we do better than these suggested data structures?

#### Summary 

* Priority Queue is an Abstract Data Type that optimizes for handling minimum or maximum elements.

* There can be space/memory benefits to using this specialized data structure.

* Implementations for ADTs that we currently know don't give us efficient runtimes for PQ operations.

  * A binary search tree is the most efficient among the other structures

---

## 21.2 Heaps

Introducing the Heap



We previously saw that our known data structures with the best runtime for our PQ operations was the *binary search tree*. Modifying its structure and the constraints, we can further improve the runtime and efficiency of these operations.

We will define our binary min-heap as being **complete** and obeying **min-heap** property:

* Min-heap: Every node is less than or equal to both of its children

* Complete: Missing items only at the bottom level (if any), all nodes are as far left as possible.

![](https://joshhug.gitbooks.io/hug61b/content/assets/heap-13.2.1.png)

As we can see in the figures above, the green colored heaps are valid and the red ones aren't. The last two aren't because they violate at least one of the properties that we defined above.

Now let's consider how this structure lends itself to the abstract data type we described in the previous chapter. We will do this through analyzing our desired operations.

**Exercise 13.2.1.** Determine how each method of our Priority Queue interface will be implemented given this heap structure. Don't write actual code, just pseudocode!

#### Heap Operations 

Heap Operations



The three methods we care about for the PriorityQueue ADT are `add`, `getSmallest`, and `removeSmallest`. We will start by conceptually describing how these methods can be implemented given our given schema of a heap.

* `add`: Add to the end of heap temporarily. Swim up the hierarchy to the proper place.

  * Swimming involves swapping nodes if child < parent

* `getSmallest`: Return the root of the heap (This is guaranteed to be the minimum by our *min-heap* property

* `removeSmallest`: Swap the last item in the heap into the root. Sink down the hierarchy to the proper place.

  * Sinking involves swapping nodes if parent > child. Swap with the smallest child to preserve *min-heap* property.

Great! We have determined how we will approach the operations specified by the PriorityQueue interface in an efficient way. But how do we actually code this?

**Exercise 13.2.2.** Give the runtime for each of the methods specified above. Worst cases and best cases.

#### Tree Representation 

Tree representation



There are many approaches we can take to representing trees.

##### Approach 1a, 1b, and 1c 

Let us consider the most intuitive and previously used representation for trees. We will create mappings between nodes and their children. There are several ways to do this which we will explore right now.

* In approach **Tree1A**, we consider creating pointers to our children and storing the value inside of the node object. These are hardwired links that give us fixed-width nodes. We can observe the code:

```java

public class Tree1A<Key> {

  Key k;

  Tree1A left;

  Tree1A middle;

  Tree1A right;

  ...

}

```

The visualization of this type of structure is shown below.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FGPQICfSMvLaxRltFOxMF%2Fimage.png?alt=media&amp;token=e3f459a8-363c-4601-920d-819d966e7115" alt=""><figcaption><p>1a: Fixed-Width Nodes (BSTMap used this approach)</p></figcaption></figure>

* Alternatively, in **Tree1B**, we explore the use of arrays as representing the mapping between children and nodes. This would give us variable-width nodes, but also awkward traversals and performance will be worse.

```java

public class Tree1B<Key> {

  Key k;

  Tree1B[] children;

  ...

```

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fl1NhbH8IuDKlHe9ji7rV%2Fimage.png?alt=media&amp;token=43d3d27e-3946-4924-95e9-20af802a8494" alt=""><figcaption><p>1b: Variable-Width Nodes</p></figcaption></figure>

* Lastly, we can use the approach for **Tree1C**. This will be slightly different from the usual approaches that we've seen. Instead of only representing a node's children, we say that nodes can also maintain a reference to their siblings.

```java

public class Tree1C<Key> {

  Key k;

  Tree1C favoredChild;

  Tree1C sibling;

  ...

}

```

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FWSjeCjdRvb3jzTlV6wz2%2Fimage.png?alt=media&amp;token=fda06ad4-4535-47bd-9c7f-b2d23d521609" alt=""><figcaption><p>1c: Sibling Tree</p></figcaption></figure>

In all of these approaches, we store explicit references to who is below us. These explicit references take the form of pointers to the actual Tree objects that are our children. Let's think of more exotic approaches that don't store explicit references to children.

##### Approach 2 

Recall the Disjoint Sets ADT. The way that we represented this Weighted Quick Union structure was through arrays. For representing a tree, we can store the *keys* array as well as a *parents* array. The keys array represent which index maps to which key, and the parents array represents which key is a child of another key.

```java

public class Tree2<Key> {

  Key[] keys;

  int[] parents;

  ...

}

```

Take some time to ensure that the tree on the left corresponds to the representation in the arrays on the right.

It's time to make a very important observation! Based on the structure of the tree and the relationship between the array representations and the diagram of the tree, we can see:

1. The tree is **complete**. This is a property we have defined earlier.

2. The parents array has a sort of redundant pattern where elements are just doubled.

3. Reading the level-order of the tree, we see that it matches exactly the order of the keys in the *keys* array.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fi99NVIANpmuo1ZNdpp0Z%2Fimage.png?alt=media&amp;token=ddcc934c-d7e7-436b-9053-9a60d8e9cf12" alt=""><figcaption><p>Approach 2</p></figcaption></figure>

What does this all mean? We know the parents array is redundant so we can ignore it and we know that a tree can be represented by level order in an array.

##### Approach 3 

In this approach, we assume that our tree is complete. This is to ensure that there are no "gaps" inside of our array representation. Thus, we will take this complex 2D structure of the tree and flatten it into an array.

```java

public class TreeC<Key> {

  Key[] keys;

  ...

}

```

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FgBdGBgTxIlozZMklfxkm%2Fimage.png?alt=media&amp;token=c3728dc4-5dea-4111-aa35-0591f331daf6" alt=""><figcaption></figcaption></figure>

##### Swim 

Given this implementation, we define the following code for the "swim" described in the Heap Operations section.

```java

public void swim(int k) {

    if (keys[parent(k)] > keys[k]) {

       swap(k, parent(k));

       swim(parent(k));              

    }

}

```

What does the parent method do? It returns the parent of the given k using the representation in Approach 3.

**Exercise 13.2.3.** Write the parent method. For extra challenge, try to write the methods for finding the left child and right child of a given item.

---

## 21.3 PQ Implementation

PQ Implementation Considerations



The actual implementation, which we will use and the book uses, is quite similar to the representation we discussed at the end of the previous chapter. The one difference is that we will leave one empty spot at the beginning of the array to simplify computation.

* `leftChild(k)`= $$k \cdot  2$$

* `rightChild(k)`= $$k \cdot  2 + 1$$

* `parent(k)`= $$k / 2$$

#### Comparing to alternative implementations 

| Methods          | Ordered Array | Bushy BST   | Hash Table | Heap        |

| ---------------- | ------------- | ----------- | ---------- | ----------- |

| `add`            | $$Θ(N)$$      | $$Θ(logN)$$ | $$Θ(1)$$   | $$Θ(logN)$$ |

| `getSmallest`    | $$Θ(1)$$      | $$Θ(logN)$$ | $$Θ(N)$$   | $$Θ(1)$$    |

| `removeSmallest` | $$Θ(N)$$      | $$Θ(logN)$$ | $$Θ(N)$$   | $$Θ(logN)$$ |

Awesome! We can see that we have improved our runtime and we have also solved the problem of duplicate elements. Couple notes:

* Heap operations are **amortized** analysis, since the array will have to resize (not a big deal)

* BST's can have constant time `getSmallest` if pointer is stored to smallest element

* Array-based heaps take around 1/3rd the memory it takes to represent a heap using approach 1A (direct pointers to children)

**Exercise 13.3.1** Some lingering implementation questions:

1. How will the PQ know how to order the items? Say we had a PQ of dogs, would it order by weight or breed?

2. Is there a way to allow for a flexibility of orderings?

3. What could we do to make a MinPQ into a MaxPQ?

---

## 21.4 Summary

**Priority Queue.** A Max Priority Queue (or PQ for short) is an ADT that supports at least the insert and delete-max operations. A MinPQ supposert insert and delete-min.

**Heaps.** A max (min) heap is an array representation of a binary tree such that every node is larger (smaller) than all of its children. This definition naturally applies recursively, i.e. a heap of height 5 is composed of two heaps of height 4 plus a parent.

**Tree Representations.** Know that there are many ways to represent a tree, and that we use Approach 3b (see lecture slides) for representing heaps, since we know they are complete.

**Running times of various PQ implementations.** Know the running time of the three primary PQ operations for an unordered array, ordered array, and heap implementation.

---

## 21.5 Exercises

### Procedural

1. Represent the following heap as an array.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fprim3CbSir4PR0hLJkAB%2Fimage.png?alt=media\&token=d4bf80e9-5f7d-442f-a1c2-fe40b84b85ca)

2. Consider the above heap. What range of values, when inserted, will cause the maximum number of swaps?

<details>

<summary>Problem 1</summary>

To convert a heap into an array, we simply read the values top-to-bottom and left-to-right. As such, the correct representation is `[0, 5, 1, 8, 8, 6, 2]`.

</details>

<details>

<summary>Problem 2</summary>

Since `0` is currently the root, any value `< 0` when inserted will have to swapped to from the bottom of the tree to the top, resulting in the maximum number of swaps. Thus, the range is $$\[-\infty, 0)$$.

</details>

### Metacognitive

1. Consider an externally-chained hashmap. If there are many hash collisions, what data structure would be most efficient in storing the key-value pairs at each bucket?

2. Consider an array sorted in descending order. Is this a valid heap? If so, which type: min-heap, or max-heap?

3. Suppose that we store the root of a heap at the `0`th index in our array. For an arbitrary index `k`, compute the indices of its children and parent.

4. Explain how you would implement a stack using a priority queue.

<details>

<summary>Problem 1</summary>

An LLRB would be the best choice. Even if all items end up in same bucket, the LLRB will be balanced, resulting in a $$O(\log n)$$ search time where $$n$$ is the number of items in the bucket. Any other choice of data structure (linked list, array, binary search tree) could have linear search time in the word case within the bucket.

Note: Using an LLRB to store buckets requires that the keys be comparable.

</details>

<details>

<summary>Problem 2</summary>

An array sorted in descending order is a max-heap (the root is the maximum value, and values decrease in level order).

</details>

<details>

<summary>Problem 3</summary>

The children would be `2k + 1` and `2k + 2`. The parent would be `(k - 1) / 2` (note that this assumes integer division).

</details>

<details>

<summary>Problem 4</summary>

To implement a stack using a priority queue, keep a counter that increments each time you insert an item. Recently inserted items will always have higher priority, so they will be removed first.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：散列 II：负载因子、动态扩容与 Java HashMap 内核](/notes/cs61b/lecture-20) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：树与图的遍历理论 →](/notes/cs61b/lecture-22) | [🎬 在 B 站观看本讲 (P21)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=21) |
