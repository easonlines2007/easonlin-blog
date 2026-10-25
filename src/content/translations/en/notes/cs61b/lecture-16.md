---
kind: notes
source: cs61b/lecture-16
title: "Lecture 16 · Trees I: Binary Search Trees, Recursive Operations, and
  Hibbard Deletion"
description: "CS61B Lecture 16: Tree Structure I: Binary search tree, operation
  implementation and Hibbard deletion: ADT evolution, binary search tree
  properties, recursive search insertion, Hibbard deletion and balanced
  degradation"
sourceHash: b7269e75266a4ac20e911cbc61cb0a80b51e39b4650b695aa7344cd1d3860a2a
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 4: Tree Structure and Hash Table (Search Trees & Hashing)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 50:58 ｜ **Official original version**: Lecture 16 - BST 1  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P16)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1tAXgjwVKsnH7AR-iCvkDM-rQFwrg4OnKVZzqPixZWI8) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/16.-adts-and-bsts)  
> **Quick navigation**: [← Previous lecture (P15 Union-find II: Weighted union-find, path compression and amortization analysis)](/en/notes/cs61b/lecture-15) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P17 Tree Structure II: The absolute self-balancing philosophy of B-tree and 2-3 tree) →](/en/notes/cs61b/lecture-17)

---

## 1. The twin stars of abstract data types (ADT): Set (collection) and Map (dictionary)

*(Reference time: 00:01:20 · [Video jump (P16 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=80))*

Before we dive into tree structures, let’s first examine the two most frequently used abstract data types (ADTs) in modern software:

### 1. Set
- Formal Contract: An unordered or ordered set that does not contain any duplicate elements;
- Core operations: `add(x)`, `contains(x)`, `remove(x)`.

### 2. Map (map / dictionary / associative array)
- Formal contract: stores key-value pairs (Key-Value Pairs), each unique key corresponds to a value;
- Core operations: `put(key, val)`, `get(key)`, `containsKey(key)`.

### The performance dilemma of linear structures
- **Linked list (DLList)**: Inserting the head is fast though ($O(1)$), but finding elements must be traversed linearly, which is time-consuming  $\Theta(N)$; 
- **Sorted Array**: With the help of binary search (Binary Search), searching for elements can be achieved extremely quickly.  $\Theta(\log N)$!  
  **However: to insert a new element into an ordered array, all elements after the insertion point must be shifted backwards by one, which is still extremely slow.  $\Theta(N)$**!

Can we design a method that can enjoy binary search?  $\Theta(\log N)$  Extremely fast retrieval, and can be searched like a linked list  $\Theta(1)$  Local pointer reconnection completes dynamically inserted data structure?  
**The answer is Binary Search Tree (BST)!**

## 2. Formal definition and structural invariants of binary search tree (BST)

*(Reference time: 00:09:40 · [Video jump (P16 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=580))*

A \*\*Binary Tree\*\* is a finite hierarchical collection of nodes. Each node has at most two child nodes (called left child nodes and right child nodes respectively).

### Core invariants of binary search trees (BST)
> **BST structure theorem**:   
> For any node in the tree  $X$:   
> 1. its **The key values of all nodes in the Left Subtree are strictly less than ($<$) node  $X$  key value**;   
> 2. its **The key values of all nodes in the right subtree are strictly greater than ($>$) node  $X$  key value**;   
> 3. Its left subtree and right subtree themselves must also be legal binary search trees.

```mermaid
graph TD
    8((8)) --> 3((3))
    8 --> 10((10))
    3 --> 1((1))
    3 --> 6((6))
    6 --> 4((4))
    6 --> 7((7))
    10 --> 14((14))
    14 --> 13((13))
```

### The mathematical miracle of In-order Traversal
If you perform on a binary search tree **inorder traversal** (Left subtree  $\to$  current root node  $\to$  right subtree):
The output sequence must be **Strictly monotonically increasing ordered sequence**!
- Perform an in-order traversal on the above graph: `1, 3, 4, 6, 7, 8, 10, 13, 14`.

## 3. Core operation implementation: `find(key)`  with  `insert(key)`  recursive algorithm

*(Reference time: 00:17:30 · [Video jump (P16 00:17:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=1050))*

The topology of BST is inherently recursive, so its core algorithm can be implemented with extremely symmetrical and elegant recursive code:

```java
public class BST<Key extends Comparable<Key>, Value> {
    private class Node {
        private Key key;
        private Value val;
        private Node left, right;

        public Node(Key k, Value v) {
            key = k;
            val = v;
        }
    }

    private Node root;

    /** 检索操作 */
    public Value get(Key key) {
        return get(root, key);
    }

    private Value get(Node x, Key key) {
        if (x == null) return null;
        int cmp = key.compareTo(x.key);
        if (cmp < 0) {
            return get(x.left, key);  // 往左找
        } else if (cmp > 0) {
            return get(x.right, key); // 往右找
        } else {
            return x.val;             // 命中！
        }
    }

    /** 插入操作：永远返回更新后的子树根节点 */
    public void put(Key key, Value val) {
        root = put(root, key, val);
    }

    private Node put(Node x, Key key, Value val) {
        if (x == null) return new Node(key, val); // 到底空位，诞生新节点
        int cmp = key.compareTo(x.key);
        if (cmp < 0) {
            x.left = put(x.left, key, val);
        } else if (cmp > 0) {
            x.right = put(x.right, key, val);
        } else {
            x.val = val; // 键已存在，更新值
        }
        return x;
    }
}
```

## 4. The ultimate challenge of node deletion operation: Hibbard Deletion algorithm

*(Reference time: 00:26:15 · [Video jump (P16 00:26:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=1575))*

In BST, delete node (`delete`) is the most complex logic, because after deleting a node, the branches must be rejoined and the size order invariants of the BST must not be destroyed.

Thomas Hibbard proposed the classic  **Hibbard Deletion Algorithm**, divided into three types of scenarios according to the number of children of the deleted node:

### Scenario 1: The deleted node is a leaf node (0 children)
- The easiest! Directly set the pointer pointed to by its parent node to  `null`  That’s it.

### Scenario 2: The deleted node has only 1 child (single-parent family)
- Let the parent node of the deleted node directly cross the node and point to its only child node.

```text
    P                 P
    |                 |
  [Del]     ===>      C
    |
    C
```

### Scenario 3: The deleted node has 2 children at the same time (the most difficult!)
if node  $X$  If there are both left and right children at the same time, delete them.  $X$  After that, who should inherit?  $X$  of the throne?  
**Answer: It must be the closest to the global  $X$  Nodes of different sizes to replace!**  
Usually choose  **$X$  Inorder Successor - that is  $X$  The smallest node in the right subtree of**!

```java
public void delete(Key key) {
    root = delete(root, key);
}

private Node delete(Node x, Key key) {
    if (x == null) return null;
    int cmp = key.compareTo(x.key);
    if (cmp < 0)      x.left = delete(x.left, key);
    else if (cmp > 0) x.right = delete(x.right, key);
    else {
        // 场景 1 & 2：只有 0 或 1 个孩子
        if (x.right == null) return x.left;
        if (x.left == null)  return x.right;

        // 场景 3：拥有 2 个孩子
        Node t = x;
        x = min(t.right); // 找到右子树中的最小值（中序后继）
        x.right = deleteMin(t.right); // 删掉原来的后继，并作为 x 的新右子树
        x.left = t.left;              // 继承原来的左子树
    }
    return x;
}
```

## 5. Random insertion vs worst-case degradation analysis: The nightmare of the bamboo tree

*(Reference time: 00:35:00 · [Video jump (P16 00:35:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=2100))*

The operational performance of BST depends entirely on the height of the tree (Height  $H$): 
- In a perfectly balanced BST, the height of the tree is approx.  $\log_2 N$; 
- Each comparison can cut the search space in half, `get`  and  `put`  time consuming is strictly  **$\Theta(\log N)$**.

### Extreme degradation disaster
However, the tree shape of naive BST is completely constrained by **Arrival order of input data**!

Suppose we insert data in ascending order: `1, 2, 3, 4, 5, 6, 7`: 
```text
1
 \
  2
   \
    3
     \
      4 ...
```
The tree has completely degenerated into a one-way linked list! tree height  $H = N$!  
At this point, the time it takes to find or insert an element degrades to miserable  **$\Theta(N)$  linear time**.

### Why must we pursue self-balance?
In actual business, data is often imported in partial order or in batches. Naive BST cannot self-correct. In order to ensure logarithmic performance, an advanced tree structure with "self-balancing repair capability" must be invented!

## 6. Summary of this lecture and post-class self-assessment

*(Reference time: 00:43:00 · [Video jump (P16 00:43:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16&t=2580))*

### Comprehensive self-test questions after class

#### Question 1 (BST invariant analysis)
Observe the following tree structure and determine whether it is a legal BST?
```text
      10
     /  \
    5    15
        /  \
       6    20
```
**Answers and analysis**:   
- **Not legal BST!**
- **deadly trap**: Although node 6 is smaller than its direct parent node 15 (satisfying that the local left child is smaller than the parent node), node 6 is located at the root node 10 **Inside the right subtree**!
- BST invariant requirements: **Every node in the right subtree of the root node must be absolutely and strictly larger than the root node!**  due to  $6 < 10$, its appearance in the right subtree completely destroys the global invariant of BST.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 16. ADTs and BSTs

In this Chapter we will discuss:

* Abstract Data Types

* Binary Search Tree

* BST Definitions

* BST Operations

* Sets vs. Maps, Summary

Additionally the video playlist is one that accompanies this chapter is the following:

---

## 16.1 Abstract Data Types

An Abstract Data Type (ADT) is defined only by its operations, not by its implementation. 

For example in Project 1A, we developed an `ArrayDeque` and a `LinkedListDeque` that had the same methods, but how those methods were written was very different. In this case, we say that `ArrayDeque` and `LinkedListDeque` are *implementations* of the `Deque` ADT. 

From this description, we see that ADT's and interfaces are somewhat related. Conceptually, `Deque` is an interface for which `ArrayDeque` and `LinkedListDeque` are its implementations. In code, in order to express this relationship, we have the `ArrayDeque` and `LinkedListDeque` classes inherit from the `Deque` interface.

Some commonly used ADT's are:

* Stacks: Structures that support last-in first-out retrieval of elements

  * `push(int x)`: puts x on the top of the stack

  * `int pop()`: takes the element on the top of the stack

* **Lists**: an ordered set of elements

  * `add(int i)`: adds an element

  * `int get(int i)`: gets element at index i

* **Sets**: an unordered set of unique elements (no repeats)

  * `add(int i)`: adds an element

  * `contains(int i)`: returns a boolean for whether or not the set contains the value

* **Maps**: set of key/value pairs

  * `put(K key, V value)`: puts a key value pair into the map

  * `V get(K key)`: gets the value corresponding to the key

Note: the bolded ADT's are a subinterfaces of a bigger overarching interface called `Collections.`

Below we show the relationships between the interfaces and classes. Interfaces are in white, classes are in blue.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fq0C4VwT6WuLbkdKqTbII%2Fimage.png?alt=media&amp;token=78a974a6-11d9-48a2-be55-196f63834a47" alt=""><figcaption><p>Common interfaces in Java and their implementations</p></figcaption></figure>

ADT's allow us to make use of object oriented programming in an efficient and elegant way. For example, you saw in Project 1C how you can use an ArrayDeque or a LinkedListArrayDeque interchangeably because they are both part of the Deque ADT.

In the following chapters, we will work on defining some more ADT's and enumerating their different implementations.

---

## 16.2 Binary Search Trees

Linked Lists are great, but it takes a long time to search for an item, even if the list is sorted! What if the item is at the end of the list? That would take linear time!

We know that for an array, we can use binary search to find an element faster. Specifically, in $$\log n$$ time. For a short explanation of binary search, check out this [link](https://www.geeksforgeeks.org/binary-search/).

In binary search, we know the list is sorted, so we can use this information to narrow our search. First, we look at the middle element. If it is bigger than the element we are searching for, we look to the left of it. If it is smaller than the element we are searching for, we look to the right. We then look at the middle element of the respective halves and repeat the process until we find the element we are looking for (or don't find it because the list doesn't contain it).

But how do we run binary search for a linked list? We would have to traverse all the way to the middle in order to check the element there, which takes linear time just on its own!

One optimization we can implement is to have a reference to the middle node. This way, we can get to the middle in constant time. Then, if we flip the nodes' pointers, which allows us to traverse to both the left and right halves, we can decrease our runtime by half!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fea2vGuGgCAxAXI5XmJer%2Fimage.png?alt=media&amp;token=58325cec-e6ed-4821-9132-d87d7d3023c8" alt=""><figcaption><p>A linked list with a middle pointer</p></figcaption></figure>

But we can further optimize by adding pointers to the middle of each recursive half like so. Now, if you stretch this structure vertically, you will see a tree! This specific tree is called a **binary tree** because each juncture splits in 2.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FIjAIQCgBgQJBl9ZbRKPs%2Fimage.png?alt=media&amp;token=06178af3-cc2f-4602-a86d-c51bd682b792" alt=""><figcaption><p>A linked list with recursive middle pointers is a binary tree!</p></figcaption></figure>

---

## 16.3 BST Definitions

Trees are composed of nodes and edges that connect those nodes. 

**Constraint**: there is only one path between any two nodes.

In some trees, we select a **root** node which is a node that has no parents.

A tree also has **leaves**, which are nodes with no children.

In the picture below, the green structures are valid trees, while the pink structure is not (since it has a cycle).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fb7UyyezwVquoNj6oxqu7%2Fimage.png?alt=media&amp;token=51cc99db-bf70-4a36-841d-028c4ba6054a" alt=""><figcaption><p>Examples of valid and invalid trees</p></figcaption></figure>

Relating this to the original tree structure we came up with earlier, we can now introduce new constraints to the already existing constraints. This creates more specific types of trees, two examples being Binary Trees and Binary Search Trees.

* **Binary Trees**: in addition to the above requirements, also hold the binary property constraint. That is, each node has either 0, 1, or 2 children.

* **Binary Search Trees**: in addition to all of the above requirements, also hold the property that For every node X in the tree:

  * Every key in the left subtree is less than X’s key.

  * Every key in the right subtree is greater than X’s key. \*\*Remember this property!! We will reference it a lot throughout the duration of this module and 61B.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F356lrM1RjLrJ6XZ6pb1U%2Fimage.png?alt=media&amp;token=7eabd466-151c-4905-81ac-741e72bc3c7e" alt=""><figcaption><p>A valid BST: every key in the left subtree is smaller than its parent, and every key in the right subtree is larger.</p></figcaption></figure>

Here is the BST module we'll be using for the rest of this chapter:

```java

private class BST<Key> {

    private Key key;

    private BST left;

    private BST right;

    public BST(Key key, BST left, BST Right) {

        this.key = key;

        this.left = left;

        this.right = right;

    }

    public BST(Key key) {

        this.key = key;

    }

}

```

---

## 16.4 BST Operations

#### Search

To search for something, we employ binary search, which is made easy due to the BST property. 

We know that the BST is structured such that all elements to the right of a node are greater and all elements to the left are smaller. Knowing this, we can start at the root node and compare it with the element, X, that we are looking for. If X is greater to the root, we move on to the root's right child. If its smaller, we move on to the root's left child. We repeat this process recursively until we either find the item or we get to a leaf, in which case the tree does not contain the item.

```java

static BST find(BST T, Key sk) {

   if (T == null)

      return null;

   if (sk.equals(T.key))

      return T;

   else if (sk < T.key)

      return find(T.left, sk);

   else

      return find(T.right, sk);

}

```

If our tree is relatively "bushy", the find operation will run in $$\log n$$ time because the height of the tree is $$\log n$$.

#### Insert

We **always** insert at a leaf node!

First, we search in the tree for the node. If we find it, then we don't do anything. If we don't find it, we will be at a leaf node already. At this point, we can just add the new element to either the left or right of the leaf, preserving the BST property.

```java

static BST insert(BST T, Key ik) {

  if (T == null)

    return new BST(ik);

  if (ik < T.key)

    T.left = insert(T.left, ik);

  else if (ik > T.key)

    T.right = insert(T.right, ik);

  return T;

}

```

#### Delete

Deleting from a binary tree is a little bit more complicated because whenever we delete, we need to make sure we reconstruct the tree and still maintain its BST property. Let's break this problem down into three categories:

* the node we are trying to delete has no children

* has 1 child

* has 2 children

##### Deletion: No Children

If the node has no children, it is a leaf, and we can just delete its parent pointer and the node will eventually be swept away by the [garbage collector](https://stackoverflow.com/questions/3798424/what-is-the-garbage-collector-in-java).

##### Deletion: One Child

If the node only has one child, we know that the child maintains the BST property with the parent of the node because the property is recursive to the right and left subtrees. Therefore, we can just reassign the parent's child pointer to the node's child and the node will eventually be garbage collected.

##### Deletion: Two Children

If the node has two children, the process becomes a little more complicated because we can't just assign one of the children to be the new root. This might break the BST property.

Instead, we choose a new node to replace the deleted one.

We know that the new node must:

* be > than everything in left subtree.

* be < than everything right subtree.

In the below tree, we show which nodes would satisfy these requirements given that we are trying to delete the `dog` node.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F8owv3DhVpUTJBRcfd2uI%2Fimage.png?alt=media&amp;token=820d3ba3-92bb-460f-aa4c-fbf2e6d1eccd" alt=""><figcaption><p>Possible candidates to replace <code>dog</code> after deletion</p></figcaption></figure>

To find these nodes, you can just take the right-most node in the left subtree or the left-most node in the right subtree. Then, we replace the `dog` node with either `cat` or `elf` and then remove the old `cat` or `elf` node.

This is called **Hibbard deletion**, and it gloriously maintains the BST property amidst a deletion.

---

## 16.5 BSTs as Sets and Maps

We can use a BST to implement the `Set` ADT. If we use a BST, we can decrease the runtime of `contains` to $$\log(n)$$ because of the BST property which enables us to use binary search!

We can also make a binary tree into a map by having each BST node hold `(key,value)` pairs instead of singular values. We will compare each element's key in order to determine where to place it within our tree.

---

## 16.6 Summary

Abstract data types (ADTs) are defined in terms of operations, not implementation.Several useful ADTs:

* Disjoint Sets, Map, Set, List.

* Java provides Map, Set, List interfaces, along with several implementations.

We’ve seen two ways to implement a Set (or Map):

* ArraySet: Θ(N) operations in the worst case.

* BST: Θ(logN) operations if tree is balanced.

BST Implementations:

* Search and insert are straightforward (but insert is a little tricky).

* Deletion is more challenging. Typical approach is “Hibbard deletion”.

---

## 16.7 Exercises

### Factual

1. What is the best and worst-case height of a BST?

<details>

<summary>Problem 1</summary>

If we insert everything in order, the worst-case height of $$\Theta(N)$$ results. In the best case of a perfectly balanced BST, the best-case height is $$\Theta(\log N)$$.

</details>

### Procedural

1. Suppose that a certain BST has keys that are integers between 1 and 10. During the search for 5, which of the following sequences of keys are possible?

   * [ ] 10, 9, 8, 7, 6, 5

   * [ ] 4, 10, 8, 7, 5, 3

   * [ ] 1, 10, 2, 9, 3, 8, 4, 7, 6, 5

   * [ ] 1, 2, 6, 8, 9, 5

2. Consider the below BST. What is the result after deleting 4 using Hibbard deletion, choosing the sucessor as the replacement?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FQmSdjdoB2F22oh1DIXWK%2Fimage.png?alt=media&amp;token=d34f3bed-06c8-4e7e-b1f2-f6d43b4a3004" alt=""><figcaption></figcaption></figure>

3. Suppose we implement the Stack ADT using an array. What is the worst case runtime of a `push` operation with this underlying data structure?

<details>

<summary>Problem 1</summary>

* [x] `10, 9, 8, 7, 6, 5`: possible; this is the situation where we have a worst-case linear BST.

* [ ] `4, 10, 8, 7, 5, 3`: not possible; we terminate our search once we reach the desired node.

* [x] `1, 10, 2, 9, 3, 8, 4, 7, 6, 5`: possible; the idea is that we should always search in the correct "direction" of our target node. If our target node is greater than our current node, then we should go to the right, and our next node should be larger. If our target node is less than our current node, then we should go to the left, and our next node should be smaller.

* [ ] `1, 2, 6, 8, 9, 5`: not possible; note that this violates the constraint described above. When we reach `8`, we should move to its left branch since our target node `5` is smaller, so we would never search `9`.

</details>

<details>

<summary>Problem 2</summary>

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FARL9Ks2idZkYpp7N6eFb%2Fimage.png?alt=media\&token=2441f693-e8ef-4d1b-b90d-c9516c094a0b)

</details>

<details>

<summary>Problem 3</summary>

The worst-case runtime is $$\Theta(N)$$, since a `push` might cause us to resize the underlying array.

</details>

### Metacognitive

1. If inserting our data into a BST in random order yields $$\log N$$ height with high probability, why don't we just shuffle our data before inserting into the BST?

2. When we do Hibbard deletion from a BST, we always choose the successor as a replacement. The successor is guaranteed to only have zero or one child--why?

<details>

<summary>Problem 1</summary>

Often in real-world applications, we don't have all our data at once. For example, imagine you're collecting time-based data that you insert into a BST each time a new value is reported. There is no easy way to shuffle your data when you only get one or a few points at a time.

</details>

<details>

<summary>Problem 2</summary>

By definition, the successor is the maximum value in the subtree. Suppose, for the sake of contradiction, that the sucessor had two children. Then, it is not the maximum, since it is less than its right child. This is a contradiction, since we said the sucessor is the maximum value in the subtree. As such, the successor is guaranteed to have one child or less (if it has one child, it is its left child). Previous 16.6 Summary Next 17. Tree Traversals and Graphs

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Union-find II: Weighted union-find, path compression and amortization analysis](/en/notes/cs61b/lecture-15) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Tree Structure II: The absolute self-balancing philosophy of B-trees and 2-3 trees →](/en/notes/cs61b/lecture-17) | [🎬Watch this lecture on Bilibili (P16)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=16) |
