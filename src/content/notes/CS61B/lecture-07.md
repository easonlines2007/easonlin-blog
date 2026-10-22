---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 07 · 链表 IV：数组列表、动态扩容与均摊分析：AList 架构设计、算术扩容灾难、几何扩容均摊 O(1)、内存游离与泛型擦除
description: CS61B 第 7 讲：链表 IV：数组列表、动态扩容与均摊分析：AList 架构设计、算术扩容灾难、几何扩容均摊 O(1)、内存游离与泛型擦除
topic: CS61B
order: 7
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 1: Java 语言基石与链表结构 (Java Fundamentals & Lists)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：48:53 ｜ **官方原版**：Lecture 7 - Lists IV Arrays and Lists  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P7)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1RJuwap1NZDYFUS7eiPy_SZu7oWHJladwuhKQpQcTjt8) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/8.-arraylist)  
> **快速导航**：[← 上一讲 (P06 软件工程基石：单元测试与测试驱动开发)](/notes/cs61b/lecture-06) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P08 继承 I：接口继承与默认方法) →](/notes/cs61b/lecture-08)

---

## 1. 链表与数组的终极权衡：为什么需要数组列表（AList）？

*(参考时间：00:01:20 · [视频跳转 (P07 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=80))*

在回顾了链表（DLList）的优势之后，我们清楚其在序列首尾的增删性能堪称完美（$\Theta(1)$）。然而，链表有一个无法逾越的致命物理弱点：**缺乏快速的随机访问能力**。

当我们需要频繁根据索引检索或更新数据（例如实现 `get(int i)` 或 `set(int i, x)`）时，链表必须顺着指针进行 $O(N)$ 步漫长的内存寻址。

而原生 Java 数组具备硬件级的 $\Theta(1)$ 随机访问性能，但它一旦创建，**尺寸固定不可改变**。

我们能否将两者的长处熔于一炉？  
**答案就是构建一个能够自动动态伸缩尺寸的数组列表——`AList`（Array-based List，即 Java 标准库中 `ArrayList` 的内核前身）！**

## 2. AList 核心架构设计与三大不可动摇的类不变量

*(参考时间：00:08:45 · [视频跳转 (P07 00:08:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=525))*

让我们从零设计 `AList` 的内部状态表示：

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

### 确立三大神圣类不变量（Class Invariants）
在面向对象设计中，类不变量是编写无 Bug 代码的罗盘。对于 `AList`，我们确立以下三条必须在任何时刻绝对成立的物理铁律：

> **不变量 1**：`size` 变量的值**永远精确等于**当前列表中有效元素的真实个数。  
> **不变量 2**：下一个要插入的新元素，在底层数组 `items` 中的物理存放位置**永远正好是 `items[size]`**！  
> **不变量 3**：当前列表中的最后一个有效元素，在底层数组中的物理位置**永远正好是 `items[size - 1]`**。

基于这三大不变量，基础操作的实现变得极致清爽且全部是瞬时的 $\Theta(1)$：

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

## 3. 扩容危机（The Resizing Problem）：算术扩容（+1）导致 O(N^2) 灾难的数学推导

*(参考时间：00:16:30 · [视频跳转 (P07 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=990))*

上述代码存在一个致命假定：底层数组容量永远够用。当连续调用 `addLast` 超过 100 次时，`items[size]` 必然触发 `ArrayIndexOutOfBoundsException`！

当数组装满时，我们必须开辟一个更大的新数组，将旧数据全部复制过去。

### 愚蠢的直觉：每次满时仅扩容 1 个位置（+1 算术扩容）
```java
private void resize(int capacity) {
    int[] a = new int[capacity];
    System.arraycopy(items, 0, a, 0, size);
    items = a;
}
```
如果在 `addLast` 中写：`if (size == items.length) resize(size + 1);`

### 严谨的数学灾难推导
假设我们要向这个初始容量为 1 的列表中连续插入 $N$ 个元素。
- 第 1 次插入：耗时 1；
- 第 2 次插入：数组满，拷贝 1 个元素到容量为 2 的新数组，插入耗时 1；
- 第 3 次插入：数组满，拷贝 2 个元素到容量为 3 的新数组，插入耗时 1；
- ...
- 第 $N$ 次插入：数组满，拷贝 $N-1$ 个元素到容量为 $N$ 的新数组，插入耗时 1。

整个过程拷贝元素的总次数为经典的等差数列求和：
$$\text{Total Work} = 1 + 2 + 3 + \dots + (N - 1) = \frac{(N - 1)N}{2} = \frac{N^2 - N}{2} = \Theta(N^2)$$

**性能结论**：采用算术扩容时，单次插入的平均耗时退化为线性时间 $\Theta(N)$，构建一个长度为一百万的列表需要耗时数小时！

## 4. 几何扩容（x 2）与均摊常数时间（Amortized Analysis）的数学证明

*(参考时间：00:25:00 · [视频跳转 (P07 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=1500))*

计算机科学先驱给出的破局方案是**几何扩容（Geometric Resizing）**：
> **法则**：当底层数组耗尽时，**将新数组的容量翻倍（Multiply by 2）**！

```java
public void addLast(int x) {
    if (size == items.length) {
        resize(items.length * 2); // 翻倍扩容！
    }
    items[size] = x;
    size += 1;
}
```

### 几何扩容的数学奇迹
再次分析向空列表连续插入 $N$ 个元素的总拷贝成本：
扩容发生在容量达到 $1, 2, 4, 8, 16, \dots, N$ 的瞬间。拷贝的总元素次数为几何级数（等比数列）：
$$\text{Total Copy Work} = 1 + 2 + 4 + 8 + \dots + \frac{N}{2} = 2 \times \frac{N}{2} - 1 = N - 1 = \Theta(N)$$

加上 $N$ 次实际赋值的开销 $N$，插入 $N$ 个元素的全部工作量总计为：
$$\text{Total Work} = \Theta(N) + \Theta(N) = \Theta(N)$$

### 均摊分析（Amortized Time Complexity）
虽然偶发的那一次翻倍扩容调用耗费了 $\Theta(N)$ 时间，但这笔高昂的成本被之前和之后成千上万次廉价的 $\Theta(1)$ 常规插入均匀分摊了！

$$\text{Amortized Cost per Operation} = \frac{\Theta(N)}{N} = \Theta(1)$$

**结论**：在几何扩容机制下，`AList` 的 `addLast` 操作在**均摊（Amortized）意义下是严格的常数时间 $\Theta(1)$**！

## 5. 泛型数组的类型擦除障碍：为什么不能写 `new Item[capacity]`？

*(参考时间：00:33:45 · [视频跳转 (P07 00:33:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2025))*

将 `AList` 改造成支持任意类型的泛型容器 `AList<Item>` 时，我们会遭遇 Java 编译器极其刻薄的一面：

```java
public class AList<Item> {
    private Item[] items;
    private int size;

    public AList() {
        // items = new Item[100]; // 编译当场报错：generic array creation！
```

### 为什么 Java 严禁创建泛型数组？
这是由于 Java 的历史包袱与**类型擦除（Type Erasure）**机制导致的：
- Java 的数组是在运行时保持强类型检查的（Reified），数组对象在堆中诞生时必须知道其内部元素的准确类型，以防止非法写入；
- 而 Java 的泛型是在 JDK 5 为了向前兼容而引入的，在编译成字节码后，所有的泛型占位符 `<Item>` 都会被编译器无情擦除为 `Object`！
- 编译器无法在运行时凭空变出一个未知类型的原生数组，因此严禁 `new Item[]`。

### 工业级官方解决方案：强制转型与抑制警告
我们必须通过通用祖先类 `Object` 创建底层数组，然后进行强制类型转换：
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

## 6. 内存游离（Loitering）与 Java 垃圾回收（GC）防漏哲学

*(参考时间：00:41:10 · [视频跳转 (P07 00:41:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2470))*

在基本类型 `int` 的 AList 中，`removeLast()` 仅仅把 `size` 减 1 就足够了。但在泛型 `AList<Item>` 中，如果继续沿用这种写法，就会引发著名的**内存游离（Loitering）隐形内存泄漏**！

### 惊心动魄的内存游离现象
考虑一个存储海象对象的 `AList<Walrus>`：
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

### 危害深度剖析
- 客户端认为自己已经把海象 C 从列表中移除了，外部不再有任何变量引用海象 C；
- 但是：`items[2]` 的槽位里依然死死保存着海象 C 在堆中的内存地址！
- Java 垃圾回收器（GC）通过可达性分析（Reachability Analysis）工作：由于 `items` 数组是活着的，海象 C 就被认定为“仍在使用中”，**永远无法被垃圾回收器释放**！
- 如果频繁插入和删除上千万个大对象，物理内存将被这些僵尸对象彻底耗尽，最终爆发 `OutOfMemoryError`。

### 防御性置空准则
在执行删除操作时，必须主动斩断内部指针：
```java
public Item removeLast() {
    Item returnItem = getLast();
    items[size - 1] = null; // 斩断引用，归还垃圾回收器！
    size -= 1;
    return returnItem;
}
```

## 7. 容量缩容策略（Downsizing）：震荡颠簸（Thrashing）与使用率下限

*(参考时间：00:48:00 · [视频跳转 (P07 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=2880))*

如果用户向 `AList` 中插入了一千万个元素，数组容量扩充到了上千万；随后用户删除了九百九十万个元素，此时底层数组依然庞大无比，浪费巨量内存。

因此，`AList` 不仅需要自动扩容，还需要**自动缩容（Downsizing）**。

### 致命陷阱：在容量利用率达到 50% 时立即减半（Halving at 50%）
初学者直觉会写：当 `size == items.length / 2` 时，将容量减半。  
**为什么这是灾难级的错误？**  
这会导致系统陷入恐怖的**颠簸震荡（Thrashing）**！
- 假设当前数组容量为 100，元素个数刚好为 50；
- 客户端执行一次 `addLast`：容量不够？不，刚好放下，容量仍为 100；
- 客户端再执行一次 `removeLast`：元素降到 50，触发缩容，耗费 $\Theta(N)$ 拷贝全部数据创建容量为 50 的新数组；
- 紧接着客户端又执行一次 `addLast`：容量 50 满了，触发扩容，耗费 $\Theta(N)$ 拷贝全部数据创建容量为 100 的新数组！
- 客户端反复交替执行 `addLast` 和 `removeLast`，**每一次操作都会被迫进行全量数组拷贝，均摊复杂度从 $\Theta(1)$ 暴跌至恐怖的 $\Theta(N)$**！

### 科学的缩容滞后策略
为了防止震荡，业界通行的法则是在利用率更低时（如利用率 $R = \frac{\text{size}}{\text{capacity}} < 0.25$）才执行容量减半：
```java
if (items.length >= 16 && size < items.length / 4) {
    resize(items.length / 2);
}
```
这保证了在下一次触发扩容之前，必须连续插入至少 $N/4$ 次，从而维持了优雅的均摊 $\Theta(1)$ 性能。

## 8. AList vs DLList 终极对决全景对比与课后自测

*(参考时间：00:53:30 · [视频跳转 (P07 00:53:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7&t=3210))*

### 线性数据结构终极选型全景表

| 核心特性 | 数组列表 (AList) | 双向链表 (DLList) |
| :--- | :--- | :--- |
| **末尾插入 (`addLast`)** | 均摊 $\Theta(1)$（偶发扩容） | 严格最坏 $\Theta(1)$ |
| **头部插入 (`addFirst`)** | $\Theta(N)$（需全量向后平移） | 严格最坏 $\Theta(1)$ |
| **随机检索 (`get(i)`)** | 硬件级 $\Theta(1)$ | 遍历跳跃 $\Theta(N)$ |
| **物理内存紧凑度** | 极高，连续内存无指针开销 | 较低，每个节点额外两倍指针开销 |
| **适用业务场景** | 读多写少、高频随机查改、数据量大 | 频繁在两端增删、队列与双端队列（Deque） |

---

### 课后综合自测题

#### 题目 1（均摊复杂度计算）
某同学实现了一种扩容策略：当数组满时，新容量变为原来的 1.5 倍（即 $\text{newCap} = \text{oldCap} \times 1.5$）。请问这种扩容策略下，连续插入 $N$ 个元素的均摊时间复杂度依然是 $\Theta(1)$ 吗？  
**答案与解析**：  
- **依然是 $\Theta(1)$！**  
- **数学原因**：只要扩容系数 $\alpha > 1.0$（无论 $\alpha = 2.0, 1.5$ 还是 $1.2$），容量的增长都是**几何级数（等比数列）**。几何级数求和 $\sum_{k} \alpha^k$ 的总和始终由最后一项主导，总工作量与 $N$ 成线性比例关系，均摊单次成本始终为 $\frac{\Theta(N)}{N} = \Theta(1)$。唯一的区别是常数项因子的不同。

#### 题目 2（代码实战：实现通用的 `insert(Item x, int index)`）
请为 `AList<Item>` 实现一个方法 `public void insert(Item x, int index)`，在指定索引处插入元素。要求正确维护底层数据并处理越界与扩容。
**参考实现代码**：
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

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

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

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：软件工程基石：单元测试与测试驱动开发](/notes/cs61b/lecture-06) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：继承 I：接口继承与默认方法 →](/notes/cs61b/lecture-08) | [🎬 在 B 站观看本讲 (P07)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=7) |
