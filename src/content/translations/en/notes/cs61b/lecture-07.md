---
kind: notes
source: cs61b/lecture-07
title: "Lecture 07 · Linked Lists IV: Array Lists, Resizing, and Amortized Analysis"
description: "CS61B Lecture 7: Linked List IV: Array List, Dynamic Expansion and
  Amortization Analysis: AList Architecture Design, Arithmetic Expansion
  Disaster, Geometric Expansion Amortization O(1), Memory Free and Generic
  Erase"
sourceHash: 8cad6e30d6363fcc5485d792a2b9481725a117aecac63c00dbf264cad7bd18f9
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 1: Java Fundamentals & Lists  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 48:53 ｜ **Official original version**: Lecture 7 - Lists IV Arrays and Lists  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P7)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1RJuwap1NZDYFUS7eiPy_SZu7oWHJladwuhKQpQcTjt8) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/8.-arraylist)  
> **Quick navigation**: [← Previous lecture (P06 Cornerstone of software engineering: unit testing and test-driven development)](/en/notes/cs61b/lecture-06) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P08 Inheritance I: Interface inheritance and default methods) →](/en/notes/cs61b/lecture-08)

---

## 1. The ultimate trade-off between linked lists and arrays: Why do you need an array list (AList)?

*(Reference time: 00:01:20 · [Video jump (P07 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=80))*

After reviewing the advantages of linked list (DLList), we know that its performance of adding and deleting at the beginning and end of the sequence is perfect ($\Theta(1)$). However, linked lists have an insurmountable fatal physical weakness: **Lack of fast random access capabilities**.

When we need to frequently retrieve or update data based on the index (such as implementing  `get(int i)`  or  `set(int i, x)`), the linked list must proceed along the pointer  $O(N)$  A lengthy memory addressing step.

Native Java arrays have hardware-level  $\Theta(1)$  Random access performance, but once it is created, **Size is fixed and cannot be changed**.

Can we combine the best of both worlds?  
**The answer is to build an array list that can automatically and dynamically expand its size——`AList` (Array-based List, that is, in the Java standard library  `ArrayList`  kernel predecessor)!**

## 2. AList core architecture design and three unshakable class invariants

*(Reference time: 00:08:45 · [Video jump (P07 00:08:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=525))*

Let's design from scratch  `AList`  The internal state of

```java
public class AList {
    private int[] items;
    private int size;

    /** 创建一个初始容量为 100 的空列表 */
    public AList() {
        items = new int[100];
        size = 0;
    }
}
```

### Establish three sacred class invariants (Class Invariants)
In object-oriented design, class invariants are the compass for writing bug-free code. for  `AList`, we have established the following three iron laws of physics that must be absolutely true at any time:

> **Invariant 1**: `size`  variable value **is always exactly equal to** The actual number of valid elements in the current list.  
> **Invariant 2**: The next new element to be inserted, in the underlying array  `items`  physical storage location in **always exactly  `items[size]`**!  
> **Invariant 3**: The last valid element in the current list, the physical position in the underlying array **always exactly  `items[size - 1]`**.

Based on these three invariants, the implementation of basic operations becomes extremely refreshing and all are instantaneous.  $\Theta(1)$: 

```java
    /** 瞬时末尾插入 */
    public void addLast(int x) {
        // 暂不考虑扩容
        items[size] = x; // 不变量 2 的直接应用
        size += 1;       // 维护不变量 1
    }

    /** 瞬时获取末尾元素 */
    public int getLast() {
        return items[size - 1]; // 不变量 3 的直接应用
    }

    /** 瞬时随机访问 */
    public int get(int i) {
        return items[i];
    }

    /** 瞬时删除末尾元素 */
    public int removeLast() {
        int returnItem = getLast();
        size -= 1; // 仅需缩减 size 即可！
        return returnItem;
    }
```

## 3. The Resizing Problem: Arithmetic expansion (+1) leads to the mathematical derivation of O(N^2) disaster

*(Reference time: 00:16:30 · [Video jump (P07 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=990))*

There is a fatal assumption in the above code: the capacity of the underlying array is always sufficient. When called continuously  `addLast`  When it exceeds 100 times, `items[size]`  Inevitably triggered  `ArrayIndexOutOfBoundsException`!

When the array is full, we must open a new, larger array and copy all the old data there.

### Stupid intuition: only expand by 1 position per full (+1 arithmetic expansion)
```java
private void resize(int capacity) {
    int[] a = new int[capacity];
    System.arraycopy(items, 0, a, 0, size);
    items = a;
}
```
if in  `addLast`  Chinese writing: `if (size == items.length) resize(size + 1);`

### Rigorous mathematical disaster derivation
Suppose we want to continuously insert into this list with an initial capacity of 1  $N$  elements.
- The first insertion: takes 1;
- The second insertion: the array is full, copy 1 element to a new array with a capacity of 2, and the insertion takes 1;
- The third insertion: the array is full, copy 2 elements to a new array with a capacity of 3, the insertion takes 1;
- ...
- No.  $N$  Insertion time: array full, copy  $N-1$  elements to a capacity of  $N$  new array, insertion takes 1.

The total number of times elements are copied in the entire process is the sum of the classic arithmetic sequences: 
$$\text{Total Work} = 1 + 2 + 3 + \dots + (N - 1) = \frac{(N - 1)N}{2} = \frac{N^2 - N}{2} = \Theta(N^2)$$

**Performance Conclusion**: When arithmetic expansion is used, the average time taken for a single insertion degenerates into linear time.  $\Theta(N)$, it would take hours to build a list of one million lengths!

## 4. Mathematical proof of geometric expansion (x 2) and amortized constant time (Amortized Analysis)

*(Reference time: 00:25:00 · [Video jump (P07 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=1500))*

The solution given by the pioneers of computer science to break the situation is **Geometric Resizing**: 
> **rules**: When the underlying array is exhausted, **Double the capacity of the new array (Multiply by 2)**!

```java
public void addLast(int x) {
    if (size == items.length) {
        resize(items.length * 2); // 翻倍扩容！
    }
    items[size] = x;
    size += 1;
}
```

### The mathematical miracle of geometric expansion
Analyze again and continuously insert into the empty list  $N$  Total copy cost of elements:
Expansion occurs when the capacity reaches  $1, 2, 4, 8, 16, \dots, N$  moment. The total number of elements copied is a geometric series (geometric sequence): 
$$\text{Total Copy Work} = 1 + 2 + 4 + 8 + \dots + \frac{N}{2} = 2 \times \frac{N}{2} - 1 = N - 1 = \Theta(N)$$

plus  $N$  The cost of actual assignments  $N$, insert  $N$  The total workload of elements is: 
$$\text{Total Work} = \Theta(N) + \Theta(N) = \Theta(N)$$

### Amortized Time Complexity
Although the occasional doubling expansion call consumes  $\Theta(N)$  time, but this high cost was replaced thousands of times before and after cheap  $\Theta(1)$  Regular insertions are evenly distributed!

$$\text{Amortized Cost per Operation} = \frac{\Theta(N)}{N} = \Theta(1)$$

**Conclusion**: Under the geometric expansion mechanism, `AList`  of  `addLast`  operating in **Strict constant time in the Amortized sense  $\Theta(1)$**!

## 5. Type erasure barrier for generic arrays: why it can’t be written  `new Item[capacity]`?

*(Reference time: 00:33:45 · [Video jump (P07 00:33:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2025))*

will  `AList`  Transformed into a generic container that supports any type  `AList<Item>` , we encounter the extremely mean side of the Java compiler:

```java
public class AList<Item> {
    private Item[] items;
    private int size;

    public AList() {
        // items = new Item[100]; // 编译当场报错：generic array creation！
```

### Why does Java strictly prohibit creating generic arrays?
This is due to Java's historical baggage and \*\*Type Erasure\*\* mechanism:
- Java arrays maintain strong type checking (Reified) at runtime. When the array object is born in the heap, the exact type of its internal elements must be known to prevent illegal writing;
- Java's generics were introduced in JDK 5 for forward compatibility. After being compiled into bytecode, all generic placeholders  `<Item>`  will be ruthlessly erased by the compiler as  `Object`!
- The compiler cannot conjure a native array of unknown type out of thin air at runtime, so it is strictly prohibited  `new Item[]`.

### Industrial-grade official solution: forced transformation and suppressed warnings
We have to pass the generic ancestor class  `Object`  Create the underlying array, then cast:
```java
    @SuppressWarnings("unchecked")
    public AList() {
        items = (Item[]) new Object[100]; // 工业级标准写法
        size = 0;
    }

    @SuppressWarnings("unchecked")
    private void resize(int capacity) {
        Item[] a = (Item[]) new Object[capacity];
        System.arraycopy(items, 0, a, 0, size);
        items = a;
    }
```

## 6. Memory Loiting and Java Garbage Collection (GC) Leakage Prevention Philosophy

*(Reference time: 00:41:10 · [Video jump (P07 00:41:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2470))*

in basic types  `int`  of AList, `removeLast()`  Just put  `size`  Minus 1 is enough. But in generic  `AList<Item>` , if you continue to use this way of writing, it will trigger the famous **Loitering invisible memory leaks**!

### The thrilling memory dissociation phenomenon
Consider a walrus object that stores  `AList<Walrus>`: 
```java
public Item removeLast() {
    Item returnItem = getLast();
    size -= 1; // 仅缩减 size
    return returnItem;
}
```

```text
底层数组 items:
index 0: [Walrus A]
index 1: [Walrus B]
index 2: [Walrus C (刚刚被逻辑删除了)] <--- 危险！底层数组依然持有该对象的内存指针！
size = 2
```

### In-depth analysis of hazards
- The client thinks that it has removed Walrus C from the list, and there is no longer any external variable referencing Walrus C;
- However: `items[2]`  The memory address of Walrus C in the heap is still stored in the slot!
- Java garbage collector (GC) works through reachability analysis: due to  `items`  The array is alive, and Walrus C is considered "still in use". **Can never be freed by the garbage collector**!
- If tens of millions of large objects are frequently inserted and deleted, the physical memory will be completely exhausted by these zombie objects and eventually explode.  `OutOfMemoryError`.

### Defensive Shorting Criterion
When performing a delete operation, the internal pointer must be actively cut off:
```java
public Item removeLast() {
    Item returnItem = getLast();
    items[size - 1] = null; // 斩断引用，归还垃圾回收器！
    size -= 1;
    return returnItem;
}
```

## 7. Capacity reduction strategy (Downsizing): Thrashing and lower usage limit

*(Reference time: 00:48:00 · [Video jump (P07 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2880))*

If the user  `AList`  Ten million elements were inserted into the array, and the array capacity was expanded to tens of millions. Then the user deleted 9.9 million elements. At this time, the underlying array was still huge, wasting a huge amount of memory.

Therefore, `AList`  Not only does it need automatic expansion, but it also needs **Downsizing**.

### Fatal Trap: Halving at 50%
Beginners will intuitively write: when  `size == items.length / 2` , reduce the capacity by half.  
**Why is this a catastrophic error?**  
This will cause the system to go into a horrible state **Thrashing**!
- Assume that the current array capacity is 100 and the number of elements is exactly 50;
- Client executes once  `addLast`: Not enough capacity? No, just put it down and the capacity is still 100;
- The client executes it again  `removeLast`: The element drops to 50, triggering shrinkage and consuming  $\Theta(N)$  Copy all data to create a new array with a capacity of 50;
- Then the client executes it again  `addLast`: Capacity 50 is full, triggering capacity expansion, consumption  $\Theta(N)$  Copy all data to create a new array with a capacity of 100!
- The client repeatedly executes alternately  `addLast`  and  `removeLast`, **Each operation will be forced to perform a full array copy, and the amortized complexity will decrease from  $\Theta(1)$  Plunge to terrifying  $\Theta(N)$**!

### Scientific shrinkage lag strategy
In order to prevent shocks, the common rule in the industry is that when the utilization rate is lower (such as the utilization rate  $R = \frac{\text{size}}{\text{capacity}} < 0.25$) before the execution capacity is halved:
```java
if (items.length >= 16 && size < items.length / 4) {
    resize(items.length / 2);
}
```
This ensures that before the next expansion is triggered, at least  $N/4$  times, thus maintaining an elegant even distribution  $\Theta(1)$  performance.

## 8. AList vs DLList Ultimate Showdown Panoramic Comparison and Post-Class Self-Assessment

*(Reference time: 00:53:30 · [Video jump (P07 00:53:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=3210))*

### The ultimate selection panorama table for linear data structures

| Core features | Array List (AList) | Doubly Linked List (DLList) |
| :--- | :--- | :--- |
| **Insert ( at the end `addLast`)** | Share equally  $\Theta(1)$ (occasional expansion) | Strictly the worst  $\Theta(1)$ |
| **Head insertion (`addFirst`)** | $\Theta(N)$ (Requires full backward translation) | Strictly the worst  $\Theta(1)$ |
| **Random search (`get(i)`)** | hardware level  $\Theta(1)$ | traversal jump  $\Theta(N)$ |
| **Physical memory compactness** | Extremely high, no pointer overhead for contiguous memory | Lower, twice the additional pointer overhead per node |
| **Applicable business scenarios** | Read more and write less, high-frequency random checking and modification, large amount of data | Frequent additions and deletions at both ends, queues and double-ended queues (Deque) |

---

### Comprehensive self-test questions after class

#### Question 1 (Amortized complexity calculation)
A classmate implemented an expansion strategy: when the array is full, the new capacity becomes 1.5 times the original (i.e.  $\text{newCap} = \text{oldCap} \times 1.5$). Under this expansion strategy, continuous insertion  $N$  The amortized time complexity of elements is still  $\Theta(1)$ ?  
**Answers and analysis**:   
- **Still  $\Theta(1)$!**  
- **mathematical reasons**: As long as the expansion coefficient  $\alpha > 1.0$ (regardless of  $\alpha = 2.0, 1.5$  Still  $1.2$), the capacity growth is **Geometric series (geometric sequence)**. geometric series summation  $\sum_{k} \alpha^k$  The sum of is always dominated by the last term, and the total workload is  $N$  There is a linear proportional relationship, and the evenly amortized single cost is always  $\frac{\Theta(N)}{N} = \Theta(1)$. The only difference is the factor of the constant term.

#### Question 2 (Code Practice: Implementing Universal  `insert(Item x, int index)`)
please for  `AList<Item>`  implement a method  `public void insert(Item x, int index)`, inserts an element at the specified index. It is required to correctly maintain the underlying data and handle out-of-bounds and expansion. 
**Reference implementation code**: 
```java
public void insert(Item x, int index) {
    if (index < 0 || index > size) {
        throw new IndexOutOfBoundsException("Index: " + index + ", Size: " + size);
    }
    if (size == items.length) {
        resize(items.length * 2);
    }
    // 将 index 及之后的所有元素向后移动一位
    System.arraycopy(items, index, items, index + 1, size - index);
    items[index] = x;
    size += 1;
}
```

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 8. ArrayList

In this section, we'll build a new class called `AList` that can be used to store arbitrarily long lists of data, similar to our `DLList`. Unlike the `DLList`, the `AList` will use arrays to store data instead of a linked list.

##### Linked List Performance Puzzle 

Suppose we wanted to write a new method for `DLList` called `int get(int i)`. Why would `get` be slow for long lists compared to `getLast`? For what inputs would it be especially slow?

You may find the figure below useful for thinking about your answer.

![dllist\_circular\_sentinel\_size\_2.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig23/dllist_circular_sentinel_size_2.png)

##### Linked List Performance Puzzle Solution 

It turns out that no matter how clever you are, the `get` method will usually be slower than `getBack` if we're using the doubly linked list structure described in section 2.3.

This is because, since we only have references to the first and last items of the list, we'll always need to walk through the list from the front or back to get to the item that we're trying to retrieve. For example, if we want to get item #417 in a list of length 10,000, we'll have to walk across 417 forward links to get to the item we want.

In the very worst case, the item is in the very middle and we'll need to walk through a number of items proportional to the length of the list (specifically, the number of items divided by two). In other words, our worst case execution time for `get` is linear in the size of the entire list. This in contrast to the runtime for `getBack`, which is constant, no matter the size of the list. Later in the course, we'll formally define runtimes in terms of big O and big Theta notation. For now, we'll stick to an informal understanding.

##### Our First Attempt: The Naive Array Based List 

Accessing the `i`th element of an array takes constant time on a modern computer. This suggests that an array-based list would be capable of much better performance for `get` than a linked-list based solution, since it can simply use bracket notation to get the item of interest.

If you'd like to know **why** arrays have constant time access, check out this [Quora post](https://www.quora.com/Why-does-accessing-an-array-element-take-constant-time).

**Optional Exercise 2.5.1:** Try to build an AList class that supports `addLast`, `getLast`, `get`, and `size` operations. Your AList should work for any size array up to 100. For starter code, see <https://github.com/Berkeley-CS61B/lectureCode/tree/master/lists4/DIY>.

[My solution](https://github.com/Berkeley-CS61B/lectureCode/tree/master/lists4/naive) has the following handy invariants.

* The position of the next item to be inserted (using `addLast`) is always `size`.

* The number of items in the AList is always `size`.

* The position of the last item in the list is always `size - 1`.

Other solutions might be slightly different.

##### removeLast 

The last operation we need to support is `removeLast`. Before we start, we make the following key observation: Any change to our list must be reflected in a change in one or more memory boxes in our implementation.

This might seem obvious, but there is some profundity to it. The list is an abstract idea, and the `size`, `items`, and `items[i]` memory boxes are the concrete representation of that idea. Any change the user tries to make to the list using the abstractions we provide (`addLast`, `removeLast`) must be reflected in some changes to these memory boxes in a way that matches the user's expectations. Our invariants provide us with a guide for what those changes should look like.

**Optional Exercise 2.5.2:** Try to write `removeLast`. Before starting, decide which of `size`, `items`, and `items[i]` needs to change so that our invariants are preserved after the operation, i.e. so that future calls to our methods provide the user of the list class with the behavior they expect.

##### Naive Resizing Arrays 

**Optional Exercise 2.5.3:** Suppose we have an AList in the state shown in the figure below. What will happen if we call `addLast(11)`? What should we do about this problem?

![dllist\_circular\_sentinel\_size\_2.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig25/full_naive_alist.png)

The answer, in Java, is that we simply build a new array that is big enough to accomodate the new data. For example, we can imagine adding the new item as follows:

```java

int[] a = new int[size + 1];

System.arraycopy(items, 0, a, 0, size);

a[size] = 11;

items = a;

size = size + 1;

```

The process of creating a new array and copying items over is often referred to as "resizing". It's a bit of a misnomer since the array doesn't actually change size, we are just making a **new** one that has a bigger size.

**Exercise 2.5.4:** Try to implement the `addLast(int i)` method to work with resizing arrays.

##### Analyzing the Naive Resizing Array 

The approach that we attempted in the previous section has terrible performance. By running a simple computational experiment where we call `addLast` 100,000 times, we see that the `SLList` completes so fast that we can't even time it. By contrast our array based list takes several seconds.

To understand why, consider the following exercise:

**Exercise 2.5.5:** Suppose we have an array of size 100. If we call insertBack two times, how many total boxes will we need to create and fill throughout this entire process? How many total boxes will we have at any one time, assuming that garbage collection happens as soon as the last reference to an array is lost?

**Exercise 2.5.6:** Starting from an array of size 100, approximately how many memory boxes get created and filled if we call `addLast` 1,000 times?

Creating all those memory boxes and recopying their contents takes time. In the graph below, we plot total time vs. number of operations for an SLList on the top, and for a naive array based list on the bottom. The SLList shows a straight line, which means for each `add` operation, the list takes the same additional amount of time. This means each single operation takes constant time! You can also think of it this way: the graph is linear, indicating that each operation takes constant time, since the integral of a constant is a line.

By contrast, the naive array list shows a parabola, indicating that each operation takes linear time, since the integral of a line is a parabola. This has significant real world implications. For inserting 100,000 items, we can roughly compute how much longer by computing the ratio of N^2/N. Inserting 100,000 items into our array based list takes (100,000^2)/100,000 or 100,000 times as long. This is obviously unacceptable.

![fig25/insert\_experiment.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig25/insert_experiment.png)

##### Geometric Resizing 

We can fix our performance problems by growing the size of our array by a multiplicative amount, rather than an additive amount. That is, rather than **adding** a number of memory boxes equal to some resizing factor `RFACTOR`:

```java

public void insertBack(int x) {

    if (size == items.length) {

           resize(size + RFACTOR);

    }

    items[size] = x;

    size += 1;

}

```

We instead resize by **multiplying** the number of boxes by `RFACTOR`.

```java

public void insertBack(int x) {

    if (size == items.length) {

           resize(size * RFACTOR);

    }

    items[size] = x;

    size += 1;

}

```

Repeating our computational experiment from before, we see that our new `AList` completes 100,000 inserts in so little time that we don't even notice. We'll defer a full analysis of why this happens until the final chapter of this book.

##### Memory Performance 

Our `AList` is almost done, but we have one major issue. Suppose we insert 1,000,000,000 items, then later remove 990,000,000 items. In this case, we'll be using only 10,000,000 of our memory boxes, leaving 99% completely unused.

To fix this issue, we can also downsize our array when it starts looking empty. Specifically, we define a "usage ratio" R which is equal to the size of the list divided by the length of the `items` array. For example, in the figure below, the usage ratio is 0.04.

![fig25/usage\_ratio.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig25/usage_ratio.png)

In a typical implementation, we halve the size of the array when R falls to less than 0.25.

##### Generic ALists 

Just as we did before, we can modify our `AList` so that it can hold any data type, not just integers. To do this, we again use the special angle braces notation in our class and substitute our arbitrary type parameter for integer wherever appropriate. For example, below, we use `Glorp` as our type parameter.

There is one significant syntactical difference: Java does not allow us to create an array of generic objects due to an obscure issue with the way generics are implemented. That is, we cannot do something like:

```java

Glorp[] items = new Glorp[8];

```

Instead, we have to use the awkward syntax shown below:

```java

Glorp[] items = (Glorp []) new Object[8];

```

This will yield a compilation warning, but it's just something we'll have to live with. We'll discuss this in more details in a later chapter.

The other change we make is that we null out any items that we "delete". Whereas before, we had no reason to zero out elements that were deleted, with generic objects, we do want to null out references to the objects that we're storing. This is to avoid "loitering". Recall that Java only destroys objects when the last reference has been lost. If we fail to null out the reference, then Java will not garbage collect the objects that have been added to the list.

This is a subtle performance bug that you're unlikely to observe unless you're looking for it, but in certain cases could result in a significant wastage of memory.


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Cornerstone of software engineering: unit testing and test-driven development](/en/notes/cs61b/lecture-06) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Inheritance I: Interface inheritance and default methods →](/en/notes/cs61b/lecture-08) | [🎬Watch this lecture on Bilibili (P07)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7) |
