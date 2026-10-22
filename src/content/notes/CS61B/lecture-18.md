---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 18 · 树结构 III：左倾红黑树（LLRB）与等价同构映射：2-3 树等价同构、红色链接法则、左旋右旋颜色翻转与级联修复
description: CS61B 第 18 讲：树结构 III：左倾红黑树（LLRB）与等价同构映射：2-3 树等价同构、红色链接法则、左旋右旋颜色翻转与级联修复
topic: CS61B
order: 18
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 4: 树结构与散列表 (Search Trees & Hashing)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:25 ｜ **官方原版**：Lecture 18 - Red Black Trees  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P18)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1WJze5Odoy4ZR1vqPM8X6duaZ5GGm_D7SaYrtOa5RnsA) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/18.-red-black-trees)  
> **快速导航**：[← 上一讲 (P17 树结构 II：B 树与 2-3 树的绝对自平衡哲学)](/notes/cs61b/lecture-17) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P19 散列 I：哈希表原理、散列函数与碰撞解决) →](/notes/cs61b/lecture-19)

---

## 1. 2-3 树的工程困境与红黑树的同构诞生

*(参考时间：00:01:25 · [视频跳转 (P18 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18&t=85))*

在上一讲中，2-3 树展示了完美的对数平衡性。但如果尝试用 Java 编写 2-3 树，你会遭遇代码实现的噩梦：需要针对 2-节点和 3-节点设计不同的类，裂变时指针重新组装极其繁琐。

计算机先驱 Robert Sedgewick 提出了惊艳全球的创见：
> **核心命题**：  
> **我们能否使用最普通、最简单的标准二叉搜索树（BST），来 1:1 完美模拟 2-3 树的全部拓扑逻辑？**

**答案就是左倾红黑树（Left-Leaning Red-Black Trees, LLRB）！**

## 2. 红色链接法则（Red Links）与 2-3 树的等价同构映射（Isometry）

*(参考时间：00:10:00 · [视频跳转 (P18 00:10:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18&t=600))*

如何用普通的二叉节点表示 2-3 树中的 3-节点 `[ A | B ]`？
- 我们将 3-节点拆成两个普通的二叉树节点：$A$ 和 $B$；
- 让较小的节点 $A$ 作为较大节点 $B$ 的**左孩子**；
- 用一条**红色的链接指针（Red Link）**将它们紧紧捆绑在一起！

```mermaid
graph TD
    subgraph ThreeNode ["2-3 树中的 3-节点"]
        N["[ A | B ]"]
    end
    subgraph LLRB ["LLRB 中的等价同构表示"]
        B((B)) -->|"红色左链接 (捆绑一体)"| A((A))
        style A fill:#ff9999,stroke:#ff0000
    end
```

### 左倾红黑树（LLRB）的三大神圣规则
1. **红色链接必须且只能向左倾斜（Left-Leaning）**；
2. **没有任何一个节点可以同时拥有两条红色链接**（即严禁连续红链接，模拟不能出现 4-节点）；
3. **黑平衡公理（Black Balance）**：从根节点到任意外部空链接（`null`）的路径上，**所经过的黑色链接数量绝对完全相同**（直接继承自 2-3 树的完美平衡性）！

## 3. 保持同构的核心三板斧：左旋、右旋与颜色翻转

*(参考时间：00:19:30 · [视频跳转 (P18 00:19:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18&t=1170))*

在插入新节点时，可能会暂时破坏红黑树的规则。我们仅仅依靠三项极简的原语操作即可瞬间完成拓扑修复：

### 原语 1：左旋（Rotate Left）
- **触发场景**：出现了一条**右倾的红色链接**；
- **操作**：将右孩子提升为父节点，原父节点变为左孩子。

```java
private Node rotateLeft(Node h) {
    Node x = h.right;
    h.right = x.left;
    x.left = h;
    x.color = h.color;
    h.color = RED;
    return x;
}
```

### 原语 2：右旋（Rotate Right）
- **触发场景**：出现**连续两条向左倾斜的红色链接**；
- **操作**：将左孩子提升为根，原父节点变为右孩子。

```java
private Node rotateRight(Node h) {
    Node x = h.left;
    h.left = x.right;
    x.right = h;
    x.color = h.color;
    h.color = RED;
    return x;
}
```

### 原语 3：颜色翻转（Flip Colors）
- **触发场景**：一个节点的左右两个孩子**同时都是红色链接**（等价于 2-3 树中的临时 4-节点）；
- **操作**：将左右孩子的链接变为黑色，将当前节点本身的链接变为红色（向上冒泡）！

```java
private void flipColors(Node h) {
    h.color = RED;
    h.left.color = BLACK;
    h.right.color = BLACK;
}
```

## 4. 极致紧凑的 LLRB 插入算法与级联修复代码

*(参考时间：00:29:40 · [视频跳转 (P18 00:29:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18&t=1780))*

借助上述三大原语，Sedgewick 将原本需要数百行复杂分支的自平衡树插入代码，精炼为仅仅三条优雅的 `if` 守卫语句：

```java
public class LLRB<Key extends Comparable<Key>, Value> {
    private static final boolean RED = true;
    private static final boolean BLACK = false;

    private class Node {
        Key key;
        Value val;
        Node left, right;
        boolean color; // 其父链接指向它的颜色
        public Node(Key k, Value v, boolean c) { key = k; val = v; color = c; }
    }

    private Node root;

    private boolean isRed(Node x) {
        if (x == null) return false;
        return x.color == RED;
    }

    public void put(Key key, Value val) {
        root = put(root, key, val);
        root.color = BLACK; // 根节点链接永远是黑色
    }

    private Node put(Node h, Key key, Value val) {
        // 1. 标准 BST 递归插入：新诞生节点默认赋予红色链接！
        if (h == null) return new Node(key, val, RED);
        int cmp = key.compareTo(h.key);
        if (cmp < 0)      h.left = put(h.left, key, val);
        else if (cmp > 0) h.right = put(h.right, key, val);
        else              h.val = val;

        // 2. 递归回溯时的三道守卫级联修复！
        // 守卫 1：右红左黑 -> 左旋修复
        if (isRed(h.right) && !isRed(h.left))      h = rotateLeft(h);
        // 守卫 2：连续两代左红 -> 右旋修复
        if (isRed(h.left) && isRed(h.left.left))   h = rotateRight(h);
        // 守卫 3：左右双红 -> 颜色翻转 (分裂冒泡)
        if (isRed(h.left) && isRed(h.right))       flipColors(h);

        return h;
    }
}
```

这十几行代码便完整实现了工业级最高标准的自平衡二叉搜索树！无论插入顺序如何凌乱，树高永远锁定在 $O(\log N)$，运行速度极致飞快。

## 5. 本讲总结与课后自测

*(参考时间：00:38:00 · [视频跳转 (P18 00:38:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18&t=2280))*

### 课后综合自测题

#### 题目 1（红黑树性质推导）
一棵包含 $N$ 个键值的合法左倾红黑树（LLRB），其最大可能的高度是多少？  
**答案与解析**：  
- **最大高度约为 $2 \log_2 N$**！  
- **原因**：在最极端情况下，最长的一条搜索路径上交替出现黑色链接与红色链接（即每个 3-节点都贡献了 2 层深度），而最短的一条路径全为黑色链接。根据黑平衡性质，两者的黑色节点数必须完全相等。因此最长路径长度不会超过最短路径的 2 倍，依然严格保持渐进对数阶 $\Theta(\log N)$！

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 18. Red Black Trees

Time for some colors.

This chapter will continue our discussion on self-balancing trees through a more colorful lens.

---

## 18.1 Rotating Trees

Just like Ferris Wheels.

Wonderfully balanced as they are, B-Trees are really difficult to implement. We need to keep track of the different nodes and the splitting process is pretty complicated. As computer scientists who appreciate clean code and a good challenge, let's find another way to create a balanced tree.

### Multiple Structures of BST

For any BST, there are multiple ways to structure it so that you maintain the BST invariants. Earlier, we talked about how **inserting** elements in different orders will result in a different BST. The sequence in which one inserts into a BST will affect its structure. The BSTs below all consist of the elements 1, 2, and 3, yet all have different structures. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FRKaWz7VCtilheqdiKoEd%2FScreen%20Shot%202023-02-27%20at%207.32.00%20PM.png?alt=media&amp;token=1555c42b-8960-4534-9480-b353e5b68341" alt=""><figcaption></figcaption></figure>

<details>

<summary>Exercise:  For each tree shown above, provide an order of insertion that yields the structure.</summary>

1. insert(1), insert(2), insert(3)

2. insert(1), insert(3), insert(2)

3. insert(2), insert(1), insert(3) or insert(2), insert(3), insert(1)

4. insert(3), insert(1), insert(2)

5. insert(3), insert(2), insert(1)

</details>

### Tree Rotation

The formal definition of rotation is:

```

rotateLeft(G): Let x be the right child of G. Make G the new left child of x.

```

```

rotateRight(G): Let x be the left child of G. Make G the new right child of x.

```

We will slowly demystify this process in the next few paragraphs.

Below is a graphical description of what happens in a left rotation on the node G:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FOOfgzuYox1ReFiUXwZn8%2FScreen%20Shot%202023-02-27%20at%207.38.06%20PM.png?alt=media&amp;token=5482c2d8-64ab-42a9-903d-94914897a805" alt=""><figcaption><p>rotateLeft(G)</p></figcaption></figure>

The written description of what happened above is this:

* G's right child, P, merges with G, bringing its children along.

* P then passes its left child to G and G goes down to the left to become P's left child.

You can see that the structure of the tree changes as well as its height. We can also rotate on a non-root node. We just disconnect the node from the parent temporarily, rotate the subtree at the node, then reconnect the new root.

#### Implementation

Here are the implementations of `rotateRight` and `rotateLeft:`

```

private Node rotateRight(Node h) {

    // assert (h != null) && isRed(h.left);

    Node x = h.left;

    h.left = x.right;

    x.right = h;

    return x;

}

// make a right-leaning link lean to the left

private Node rotateLeft(Node h) {

    // assert (h != null) && isRed(h.right);

    Node x = h.right;

    h.right = x.left;

    x.left = h;

    return x;

}

```

You may be wondering how does the parent node know about which node to point to after we rotate? That's why we are returning x, and other parts of our code will make use of this information to correctly update the parent node's pointer.

### Balancing BSTs with Tree Rotation

With rotations, we can actually balance a tree. 

Consider the example below:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FpUeIK1a8HB0IfomQ2Spi%2Fimage.png?alt=media&amp;token=f76ce4ec-e461-4884-a9fd-2b09b7b16f5a" alt=""><figcaption></figcaption></figure>

We can do balance the given BST on the left by calling:

1. `rotateRight(3)`

2. `rotateLeft(1)`

The main observation to make for tree rotation is that it is possible to **shorten** or **lengthen** a tree, while maintaining the search tree's property.

For more examples, see the demo in [these slides](https://docs.google.com/presentation/d/1pfkQENfIBwiThGGFVO5xvlVp7XAUONI2BwBqYxib0A4/edit#slide=id.g465b5392c_00).

---

## 18.2 Creating LLRB Trees

Software Engineers? More like Tree Engineers

We said in the previous section that we really like 2-3 trees because they always remain balanced, but they are very hard to implement. On the other hand, BSTs can be unbalanced, but we like how simple and intuitive they are. Is there a way to combine the best of two worlds? Why not create a tree that is implemented using a BST, but is structurally identical to a 2-3 tree and thus stays balanced? 

(Note that in this chapter we will be honing in on 2-3 Trees specifically, not 2-3-4 trees)

### Entering Red Black Trees

#### From 2-3 Tree to What?

We are going to create this tree by looking at a 2-3 tree and asking ourselves what kind of modifications we can make in order to convert it into a BST.

For a 2-3 tree that only has 2-nodes (nodes with 2 children), we already have a BST, so we don't need to make any modifications!

However, what happens when we get a 3-node?

One thing we could do is create a "glue" node that doesn't hold any information and only serves to show that its 2 children are actually a part of one node.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FtnGTpoMiFBi7pFs0jdm4%2FScreen%20Shot%202023-02-27%20at%208.28.55%20PM.png?alt=media&amp;token=fa2db6c5-e6c3-464b-93ed-7f2708ae1f1b" alt=""><figcaption><p>Naive Solution: Dummy "glue" node </p></figcaption></figure>

However, this is not an elegant solution because we are taking up more space and the code will be ugly. So, instead of using glue nodes we will use **glue links** instead!

#### To LLRB Tree

To transform dummy glue nodes to glue links, we choose arbitrarily to make the left element a child of the right one. This results in a **left-leaning** tree. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FlabuuQaI8JtqYfMAMXy1%2FScreen%20Shot%202023-02-27%20at%208.31.57%20PM.png?alt=media&amp;token=cefe9441-1594-4265-bace-d3f9700cab64" alt=""><figcaption><p>Left Leaning Red-Black Tree</p></figcaption></figure>

We show that a link is a glue link by making it red. Normal links are black. Because of this, we call these structures **left-leaning red-black trees (LLRB)**. We will be using left-leaning trees in this course.

#### One-to-One Correspondence:

Left-Leaning Red-Black trees have a **1-1 correspondence with 2-3 trees.** Every 2-3 tree has a **unique** LLRB red-black tree associated with it. 

As for 2-3-4 trees, they maintain correspondence with standard Red-Black trees.

### Properties of LLRBs

Below is a summary of the properties/invariants of LLRB Trees: 

* 1-1 correspondence with 2-3 trees.

* No node has 2 red links.

* There are no red right-links.

* Every path from root to leaf has the same number of black links (because 2-3 trees have the same number of links to every leaf).

* Height is no more than 2x height + 1 of the corresponding 2-3 tree. 

* The height of a red-black tree is proportional to the log of the number of entries.

---

## 18.3 Inserting LLRB Trees

Some Tree Maintenance.

We can always insert into an LLRB tree by inserting into a 2-3 tree and converting it as we've done before. However, this would be contrary to our original purpose of creating LLRBs, which was to avoid the complicated implementation of a 2-3 tree! 

Instead, we **insert into the LLRB as we would with a normal BST.** However, this could break its 1-1 mapping to a 2-3 tree, so we will use **rotations** to massage the tree back into a proper structure.

### Maintaining Proper Structure

When inserting into an LLRB tree, we always insert the new node with a **red link** to its parent node. This is because in a 2-3 tree, we are always inserting by adding to a leaf node, the color of the link we add should always be red.

But sometimes, inserting red links at certain places might lead to cases where we break one of the invariants of LLRBs. 

Below are three such cases where we need to perform certain tasks address in order to maintain the LLRB tree's proper structure:

* Case 1: **Insertion results in a right leaning "3-node -> Left Leaning Violation**

  * **Task 1: rotateLeft(node)**

  * Recall, we are using *left-leaning* red black trees, which means we can never have a right red link. 

  * To address this, we will need to use a **rotation** in order to maintain the LLRB invariant: "There are no right red links". 

  * If the left child is *also* a red link, then we will temporarily allow it for purposes that will become clearer in case 2.

  <figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FokHHZtbRyLXccIEFaOY4%2FScreen%20Shot%202023-02-27%20at%208.57.00%20PM.png?alt=media&amp;token=d0499fb0-2fdb-4263-b2b0-6b20c605c26b" alt=""><figcaption><p>Case 1: Inserting a Right Red Link</p></figcaption></figure>

* Case 2: **Double Insertion on the Left -> Incorrect 4 Node Violation**

  * **Task 2: rotateRight(node)**

  * If there are 2 left red links, then we have a 4-node which is illegal. 

  * To address this, we will first **rotate** to create the same tree seen in case 1 above.  Then, in both situations, we will address the temporary issue of having an illegal 4-node in case 3. 

  <figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FEnMUNTPORQi12PX7wMqC%2FScreen%20Shot%202023-02-27%20at%208.58.30%20PM.png?alt=media&amp;token=425edbb2-91c0-4321-a738-a71484e30adc" alt=""><figcaption><p>Case 2: Double Insertion on the Left</p></figcaption></figure>

* Case 3: **Node has Two Red Children -> Temporary 4 Node**

  * **Task 3: Color Flip**

  * Finally, to address the issue of having illegal 4-node by **flipping the colors** of all edges touching "S" above. 

  * This is equivalent to pushing up the middle node in a 2-3 tree.

  <figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1ZlL0yP2Mxr4ZBWUEqyY%2FScreen%20Shot%202023-02-27%20at%209.02.17%20PM.png?alt=media&amp;token=544c407f-5a49-43b7-9b4d-dfcd1df71421" alt=""><figcaption><p>Case 3: Two Red Links</p></figcaption></figure>

Note: You may need to go through a series of rotations in order to complete the transformation. It's possible that one operation will result in additional LLRB rule violations, which we can fix with the corresponding operation.

The process is: while the LLRB tree does not satisfy the 1-1 correspondence with a 2-3 tree or breaks the LLRB invariants, perform task 1, 2, or 3 depending on the condition of the tree until you get a legal LLRB.

#### Summary of Maintenance Operations

* When inserting: Use a **red link**. Insert in the same way as inserting into a BST.

* If there is a right-leaning “3-node”, we have a **Left Leaning Violation**.

  * **Rotate left** the appropriate node to fix.

* If there are two consecutive left links, we have an **Incorrect 4 Node Violation**.

  * **Rotate right** the appropriate node to fix.

* If there are any nodes with two red children, we have a **Temporary 4 Node**.

  * **Color flip** the node to emulate the split operation.

---

## 18.4 Runtime Analysis

Short and Sweet.

Because a left-leaning red-black tree has a 1-1 correspondence with a 2-3 tree and will always remain within 2x the height of its 2-3 tree, the runtimes of the operations will take $$log(N)$$time.

Here's the abstracted code for insertion into a LLRB:

```

private Node put(Node h, Key key, Value val) {

    if (h == null) { return new Node(key, val, RED); }

    int cmp = key.compareTo(h.key);

    if (cmp < 0)      { h.left  = put(h.left,  key, val); }

    else if (cmp > 0) { h.right = put(h.right, key, val); }

    else              { h.val   = val;                    }

    if (isRed(h.right) && !isRed(h.left))      { h = rotateLeft(h);  }

    if (isRed(h.left)  &&  isRed(h.left.left)) { h = rotateRight(h); }

    if (isRed(h.left)  &&  isRed(h.right))     { flipColors(h);      } 

    return h;

}

```

---

## 18.5 Summary

* Binary search trees are simple, but they are subject to imbalance which leads to crappy runtime. 2-3 Trees (B Trees) are balanced, but painful to implement.

* LLRB insertion is simple to implement (deletion is a bit harder to implement, we won't go over the specifics in this course).

  * Use three basic operations to maintain the balanced structure, namely rotateLeft, rotateRight, and color flip.

* LLRBs maintain correspondence with 2-3 trees, Standard Red-Black trees maintain correspondence with 2-3-4 trees.

  * Java’s [TreeMap](https://github.com/AdoptOpenJDK/openjdk-jdk11/blob/999dbd4192d0f819cb5224f26e9e7fa75ca6f289/src/java.base/share/classes/java/util/TreeMap.java) is a red-black tree that corresponds to 2-3-4 trees.

  * 2-3-4 trees allow glue links on either side (see [Red-Black Tree](http://en.wikipedia.org/wiki/Red%E2%80%93black_tree)).

  * More complex implementation, but faster.

---

## 18.6 Exercises

### Factual

1. Consider the tree below. If we call `rotateLeft(C)`, which operation reverts the tree back to its original form?

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F7PKxQWLKU3ast39LMctz%2Fimage.png?alt=media\&token=010961b9-10f5-4e06-bfa5-8741b1271c59)

2. When you rotate a nodes in a tree, which of the following can happen?

   * [ ] If the tree was previously a valid search tree, it can become invalid.

   * [ ] The height can stay the same.

   * [ ] The height can increase.

   * [ ] The height can decrease.

   * [ ] The number of nodes can change.

   * [ ] The root of the tree can change.

<details>

<summary>Problem 1</summary>

`rotateRight(D)`. The inverse of any `rotateLeft` operation is a `rotateRight` on the node's left child.

</details>

<details>

<summary>Problem 2</summary>

* [ ] **If the tree was previously a valid search tree, it can become invalid.** Rotation always preserves search tree properties.

* [x] **The height can stay the same.** If the rotation does not affect any leaf nodes on the bottommost level, the height will stay the same.  

* [x] **The height can increase.** If the rotation affects a leaf on the bottommost level, the height can increase.

* [x] **The height can decrease.** If the rotation affects a leaf on the bottommost level, the height can increase.

* [ ] **The number of nodes can change.** Rotation only changes the structure of the tree, not the nodes.

* [x] **The root of the tree can change.** For example, rotating the root.

</details>

### Procedural

1. Consider the following LLRB. What is the height of the corresponding 2-3 tree and how many 3-nodes does it have?

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FA2z0qYcCYP7z6kk72VTu%2Fimage.png?alt=media\&token=6134098f-151b-48ff-b114-2b6951908f00)

2. Suppose we insert `15` in the LLRB above. What is the first operation that must be applied to maintain the LLRB invariants?

3. Suppose in the process of insertion, we end up with the following temporary 4-node. What is the corresponding LLRB representation of this node?

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FXUDlyE6JIydS0nY8daiZ%2Fimage.png?alt=media\&token=fc3c2c2f-b2fd-45c5-a02b-c650e2e303e9)

<details>

<summary>Problem 1</summary>

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F5V0vVGxJHCgnvuyVL8PP%2FCheck-in%2018%20Q3%20Answer%20Img.png?alt=media\&token=702a9453-e545-448a-a4fb-21e65a670232)

The corresponding 2-3 tree has height 1 and has two 3-nodes (`17 25` and `39 43`).

</details>

<details>

<summary>Problem 2</summary>

`15` is inserted to the right of `13`. Since we cannot have a right-leaning red link, we must `rotateLeft(13)`.

</details>

<details>

<summary>Problem 3</summary>

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fxu3WTXgEe0OCECMr4TRP%2Fimage.png?alt=media\&token=2f613884-3a27-4bae-9c42-727adaba830f)

</details>

### Metacognitive

1. Give a range of values, when inserted into the LLRB below, results in a `rotateRight` operation as the first balancing operation. Assume that values are distinct, but not necessarily integers.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FA2z0qYcCYP7z6kk72VTu%2Fimage.png?alt=media\&token=6134098f-151b-48ff-b114-2b6951908f00)

<details>

<summary>Problem 1</summary>

`rotateRight` occurs when we have two red links in a row. This occurs when we insert to the left of `39`. This value must be larger than `25` (since it is in its right branch) but less than `39` (since it is the left child of 39). So our final range is $$(25, 39)$$.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：树结构 II：B 树与 2-3 树的绝对自平衡哲学](/notes/cs61b/lecture-17) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：散列 I：哈希表原理、散列函数与碰撞解决 →](/notes/cs61b/lecture-19) | [🎬 在 B 站观看本讲 (P18)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=18) |
