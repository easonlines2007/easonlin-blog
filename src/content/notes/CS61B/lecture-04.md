---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 04 · 链表 II：单向链表、封装与哨兵节点：SLList 封装、访问控制、静态嵌套类、类不变量与哨兵模式
description: CS61B 第 4 讲：链表 II：单向链表、封装与哨兵节点：SLList 封装、访问控制、静态嵌套类、类不变量与哨兵模式
topic: CS61B
order: 4
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 1: Java 语言基石与链表结构 (Java Fundamentals & Lists)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：49:11 ｜ **官方原版**：Lecture 4 - Lists II SLLists  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P4)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1Uty7XFuhRuCg3SoaSaViXzJhPTZDoYUV878L2I_pe_k) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/4.-sllists)  
> **快速导航**：[← 上一讲 (P03 链表 I：引用传递、内存模型与递归链表)](/notes/cs61b/lecture-03) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P05 链表 III：双向链表、泛型与原生数组) →](/notes/cs61b/lecture-05)

---

## 1. 从 IntList 到 SLList：面向对象封装演进的必然性

*(参考时间：00:01:40 · [视频跳转 (P04 00:01:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=100))*

在上一讲中，我们构建的裸递归链表 `IntList` 存在严重的工程可用性缺陷：
- 客户端使用者必须深刻理解递归才能正确构造链表（如嵌套使用 `new IntList(5, new IntList(10, null))`）；
- 链表无法自然地表达“空链表”状态（只能用 `null` 表示，但对 `null` 调用方法会立即崩溃）；
- 数据结构内部的节点指针毫无保护地暴露给外部。

为了向客户端提供一个友好、安全且符合直觉的数据结构，我们进行面向对象的二次抽象：**构建一个外层包装类 `SLList`（Singly Linked List，单向链表）**。

### 包装类的基本构架
在最基础的形态下，`SLList` 充当链表的管理器，其内部维护一个指向第一个节点的指针：

```java
public class SLList {
    // 内部节点定义
    public class IntNode {
        public int item;
        public IntNode next;

        public IntNode(int i, IntNode n) {
            item = i;
            next = n;
        }
    }

    // 指向链表第一个节点的引用
    public IntNode first;

    // 构造函数：初始化含有一个元素的链表
    public SLList(int x) {
        first = new IntNode(x, null);
    }

    // 在链表头部快速插入元素
    public void addFirst(int x) {
        first = new IntNode(x, first);
    }

    // 获取链表头部元素
    public int getFirst() {
        return first.item;
    }
}
```

### 客户端调用对比
现在，外部使用者的代码变得无比优雅：
```java
SLList L = new SLList(15);
L.addFirst(10);
L.addFirst(5);
int x = L.getFirst(); // 得到 5
```
使用者再也不需要关心链表内部是如何利用 `next` 指针相互连接的，他们面对的是一个完整的抽象数据类型（ADT）。

## 2. 访问控制与信息隐藏：`public` 与 `private` 的架构威慑力

*(参考时间：00:09:10 · [视频跳转 (P04 00:09:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=550))*

在上述初步实现中，依然潜藏着一个极其危险的漏洞：`first` 变量是 `public` 的！

如果一个心怀不轨或粗心的程序员写出如下代码：
```java
SLList L = new SLList(15);
L.addFirst(10);
L.first.next.next = L.first; // 灾难！制造了无限环形链表！
```
外部代码可以随意绕过 `SLList` 提供的合法操作，直接篡改底层节点指针，造成死循环或内存破坏。

### 封装（Encapsulation）与信息隐藏（Information Hiding）
面向对象设计原则的核心法则之一是：**只向外部暴露极简的操作契约（Interface / API），把内部的所有实现细节与数据存储机制彻底隐藏起来**。

我们将 `first` 声明为 `private`：
```java
public class SLList {
    private IntNode first;
    ...
```

### `private` 关键字的本质安全防线
- 一旦字段被声明为 `private`，**只有在该类（SLList）自身的代码块内部才被允许访问和修改它**；
- 任何外部类（如 `SLListLauncher`）尝试执行 `L.first`，都会在 `javac` 编译阶段被直接报错拒绝：`error: first has private access in SLList`。
- 这在编译器层面彻底杜绝了外部篡改内部拓扑的可能性！

## 3. 嵌套类（Nested Classes）设计与 `static` 内存优化

*(参考时间：00:16:30 · [视频跳转 (P04 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=990))*

在 `SLList` 中，`IntNode` 类是专门为 `SLList` 提供底层节点支撑的工具，外部使用者根本不需要知道它的存在。因此，将 `IntNode` 嵌套在 `SLList` 内部是极佳的设计实践。

不仅如此，我们还应当将 `IntNode` 声明为 `private static class`：

```java
public class SLList {
    /** 静态私有嵌套节点类 */
    private static class IntNode {
        public int item;
        public IntNode next;

        public IntNode(int i, IntNode n) {
            item = i;
            next = n;
        }
    }

    private IntNode first;
    ...
```

### 关键抉择：为什么要给嵌套类加上 `static`？
许多初学者忽略了非静态内部类与静态嵌套类之间的巨大内存差异：

1. **非静态内部类（Inner Class）**：
   - 如果不写 `static`，Java 编译器会在每个 `IntNode` 对象的底层结构中，**隐式悄悄塞入一个指向外部 `SLList` 实例的隐藏指针**（通常记为 `this$0`）；
   - 这不仅导致每个节点白白多浪费 64 位的物理内存，还会延长垃圾回收周期，降低 CPU 缓存命中率。
2. **静态嵌套类（Static Nested Class）**：
   - 加上 `static` 之后，`IntNode` 彻底断绝了与外部 `SLList` 实例的隐式联系，它不能也不需要访问外部类的实例变量；
   - 它变成了一个完全独立的纯净数据载荷单元，节约内存，提高性能。

> **架构法则**：如果一个嵌套类在其生命周期内**完全不需要访问外层包装类的实例变量或方法**，必须果断将其声明为 `static`！

## 4. 空间换时间：缓存 `size` 字段与类不变量（Class Invariants）

*(参考时间：00:23:50 · [视频跳转 (P04 00:23:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=1430))*

考虑在 `SLList` 中实现 `size()` 方法：获取当前链表中的元素个数。

### 朴素实现：每次遍历链表（耗时 $O(N)$）
我们可以像上一讲一样，写一个辅助递归或迭代方法去遍历数数：
```java
private static int size(IntNode p) {
    if (p.next == null) return 1;
    return 1 + size(p.next);
}

public int size() {
    return size(first);
}
```
**严重缺陷**：如果链表包含 1,000,000 个元素，每次调用 `L.size()` 都必须花费数百万次指令去遍历整个链表！随着数据规模扩大，系统会急剧变慢。

### 空间换时间（Space-Time Trade-off）：维护缓存字段
我们可以在 `SLList` 中额外增加一个整型变量 `size`：
```java
public class SLList {
    ...
    private IntNode first;
    private int size; // 实时缓存链表大小

    public SLList(int x) {
        first = new IntNode(x, null);
        size = 1;
    }

    public void addFirst(int x) {
        first = new IntNode(x, first);
        size += 1; // 维护缓存
    }

    public int size() {
        return size; // 瞬间 O(1) 返回！
    }
}
```

### 核心概念：类不变量（Class Invariants）
类不变量是面向对象系统稳定性的基石，指**在对象的整个生命周期中，不论经历何种操作，都必须恒成立的状态真理**。

对于 `SLList`，我们确立的核心类不变量是：
> **类不变量 1**：`first` 变量永远指向链表的第一个真实数据节点。  
> **类不变量 2**：`size` 变量的值永远精确等于链表当前实际包含的数据节点总数。

只要每一个可能修改链表状态的方法（构造器、`addFirst`、`addLast`、`removeFirst` 等）在结束时都严格确保该真理成立，那么读取方法（如 `size()`）就可以 100% 信任该缓存字段，以 $O(1)$ 的极致速度直接返回结果！

## 5. 空链表危机（The Empty List Problem）与边界崩溃

*(参考时间：00:31:00 · [视频跳转 (P04 00:31:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=1860))*

现实世界中，我们经常需要创建一开始没有任何元素的**空链表**：
```java
SLList L = new SLList(); // 创建空链表
```

我们很容易写出如下的空链表构造器：
```java
public SLList() {
    first = null;
    size = 0;
}
```

紧接着，我们来实现 `addLast(int x)` 方法：在链表末尾追加新元素。
```java
public void addLast(int x) {
    size += 1;
    IntNode p = first;
    // 遍历到链表的最后一个节点
    while (p.next != null) {
        p = p.next;
    }
    p.next = new IntNode(x, null);
}
```

### 灾难降临：空链表上的 NullPointerException 崩溃！
让我们用客户端代码测试：
```java
SLList L = new SLList(); // first 是 null
L.addLast(42);           // 瞬间崩溃！抛出 NullPointerException！
```

**为什么会崩溃？**
仔细看循环条件：`while (p.next != null)`。  
由于此时链表为空，`first` 是 `null`，因此 `p = first` 导致 `p` 也是 `null`！  
当执行 `p.next` 时，JVM 尝试对一个空引用解引用，瞬间引发异常崩溃！

### 丑陋的打补丁尝试（Special Casing）
初学者通常会写 `if (first == null)` 来打补丁：
```java
public void addLast(int x) {
    size += 1;
    if (first == null) {
        first = new IntNode(x, null);
        return;
    }
    IntNode p = first;
    while (p.next != null) {
        p = p.next;
    }
    p.next = new IntNode(x, null);
}
```
**为什么说这种补丁代码是劣质的？**
因为一旦你对空链表做特殊处理，随之而来的 `removeLast`、`getLast`、`insert` 等几乎每一个方法内部，你都必须写大量的 `if (first == null)` 分支！代码充斥着边界特判，极易漏写，滋生无数 bug。

计算机大师们提出了一个无比优雅的终极解决方案——**哨兵节点模式（The Sentinel Node Pattern）**！

## 6. 哨兵节点模式（The Sentinel Node Pattern）：消除边界特判

*(参考时间：00:38:20 · [视频跳转 (P04 00:38:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=2300))*

哨兵节点（Sentinel Node，也称哑节点 Dummy Node）的核心思想是：**在链表的头部永远放置一个不存放有效业务数据的特殊节点**。

无论链表是空的、还是有 1 个元素、或是 10,000 个元素，这个哨兵节点都岿然不动地存在！

### 带有哨兵节点的 SLList 拓扑结构
```text
空链表结构 (Empty SLList):
+----------+      +-------------------------+
| sentinel | ---> | IntNode (哨兵节点)       |
+----------+      | item: 63 (任意哑数据)    |
| size: 0  |      | next: null              |
+----------+      +-------------------------+

包含元素 5, 10 的链表结构:
+----------+      +-------------------+      +-------------------+      +-------------------+
| sentinel | ---> | 哨兵节点 (item:63)| ---> | 数据节点 (item: 5)| ---> | 数据节点 (item:10)| ---> null
+----------+      | next: 0x100       |      | next: 0x200       |      | next: null        |
| size: 2  |      +-------------------+      +-------------------+      +-------------------+
+----------+
```

### 哨兵模式下的重构代码
```java
public class SLList {
    private static class IntNode {
        public int item;
        public IntNode next;
        public IntNode(int i, IntNode n) { item = i; next = n; }
    }

    // 哨兵节点永远不为 null！
    private IntNode sentinel;
    private int size;

    /** 构造空链表 */
    public SLList() {
        sentinel = new IntNode(63, null); // 63 是任意占位数据
        size = 0;
    }

    /** 构造含单元素的链表 */
    public SLList(int x) {
        sentinel = new IntNode(63, null);
        sentinel.next = new IntNode(x, null);
        size = 1;
    }

    public void addFirst(int x) {
        sentinel.next = new IntNode(x, sentinel.next);
        size += 1;
    }

    public int getFirst() {
        return sentinel.next.item;
    }

    /** 优雅绝伦的 addLast：无需任何 if 语句特判！ */
    public void addLast(int x) {
        size += 1;
        IntNode p = sentinel; // 从哨兵节点开始往后走
        while (p.next != null) {
            p = p.next;
        }
        // 无论是空链表还是非空链表，代码完全一致！
        p.next = new IntNode(x, null);
    }

    public int size() {
        return size;
    }
}
```

### 哨兵模式带来的全新类不变量
> **神圣不变量**：  
> 1. `sentinel` 引用永远且绝对不为 `null`！它永远指向那个忠诚的哨兵节点。  
> 2. 链表的第一个真实数据节点，永远是 `sentinel.next`（若链表为空，则 `sentinel.next == null`）。  
> 3. `size` 始终精确记录有效数据节点的数量（不计入哨兵本身）。

## 7. 官方课件研讨题：不变量破坏与反思

*(参考时间：00:46:10 · [视频跳转 (P04 00:46:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=2770))*

Josh Hug 教授在 Lecture 4 课件中呈现了若干道精妙的讨论题，用于检测学生对封装与不变量的理解深度。

### 研讨题：如何彻底防止不变量被破坏？
**讨论场景**：假设我们在 `SLList` 中增加了一个方法：
```java
public IntNode getFirstNode() {
    return sentinel.next;
}
```
这个方法声明为 `public`，返回第一个节点的引用。这种设计是否破坏了面向对象的封装？

**深入分析**：
- **致命破坏！** 虽然 `sentinel` 和 `IntNode` 内部字段可能是私有的，但一旦将内部节点的直接引用返回给外部客户端，外部客户端就可以写出：
  ```java
  SLList L = new SLList(10);
  IntNode n = L.getFirstNode();
  n.next = n; // 外部直接将内部节点改写为死循环环形！
  ```
- 此时，`SLList` 的内部结构在不知情的情况下被彻底摧毁，后续调用 `L.addLast(20)` 将陷入死循环。
- **最佳实践原则**：**容器类的数据结构向外暴露接口时，绝对不要将内部私有节点对象（Node Objects）的引用泄漏给外界**！只应当向外传递用户的数据项（`item`，如整数或对象载荷）。

## 8. 本讲架构小结与综合实战自测题

*(参考时间：00:51:00 · [视频跳转 (P04 00:51:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=3060))*

### 核心知识对比全景图

| 架构特性 | 裸递归 IntList | 封装后的 SLList (无哨兵) | 终极版 SLList (带哨兵) |
| :--- | :--- | :--- | :--- |
| **空链表支持** | 不支持（只能为 `null`） | 支持，但需大量 `if(first==null)` | 完美支持，拓扑结构天然统一 |
| **首尾操作** | 头部插入需手动赋值 | 提供 `addFirst` / `addLast` | 提供统一操作，代码无特判 |
| **`size()` 性能** | 递归或遍历 $\Theta(N)$ | 缓存字段，瞬时 $\Theta(1)$ | 缓存字段，瞬时 $\Theta(1)$ |
| **封装安全性** | 暴露内部指针，极度脆弱 | 私有化字段，建立不变量防护 | 私有化静态嵌套类，彻底安全 |

---

### 课后综合自测题

#### 题目 1（哨兵机制追踪）
对于带哨兵节点的 `SLList`，当链表包含 3 个元素时，内存堆中一共有多少个 `IntNode` 实例对象？如果链表为空，堆中又有多少个 `IntNode` 实例？  
**答案与解析**：  
- 包含 3 个元素时，堆中共有 **4 个** `IntNode` 对象（1 个哨兵节点 + 3 个真实数据节点）；  
- 链表为空时，堆中共有 **1 个** `IntNode` 对象（即那个永不消逝的哨兵节点自身）。

#### 题目 2（代码实战：实现 `deleteFirst()`）
请为带哨兵节点的 `SLList` 补充实现一个实例方法 `public void deleteFirst()`，删除链表的第一个真实元素。若链表为空，则什么都不做。要求严格维护 `size` 和哨兵不变量。
**参考实现代码**：
```java
public void deleteFirst() {
    // 如果链表本身为空，sentinel.next 为 null，无需删除
    if (sentinel.next == null) {
        return;
    }
    // 让哨兵跳过第一个节点，直接指向第二个节点
    sentinel.next = sentinel.next.next;
    // 严格维护 size 不变量
    size -= 1;
}
```
**内存分析**：被跳过的那个原本的第一节点失去了被引用的根（GC Root unreachable），将在随后的 Java 垃圾回收（Garbage Collection）过程中被 JVM 自动回收释放，杜绝内存泄漏！

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 4. SLLists

In Chapter 3, we built the `IntList` class, a list data structure that can technically do all the things a list can do. However, in practice, the `IntList` suffers from the fact that it is fairly awkward to use, resulting in code that is hard to read and maintain.

Fundamentally, the issue is that the `IntList` is what I call a **naked recursive** data structure. In order to use an `IntList` correctly, the programmer must understand and utilize recursion even for simple list related tasks. This limits its usefulness to novice programmers, and potentially introduces a whole new class of tricky errors that programmers might run into, depending on what sort of helper methods are provided by the `IntList` class.

Inspired by our experience with the `IntList`, we'll now build a new class `SLList`, which much more closely resembles the list implementations that programmers use in modern languages. We'll do so by iteratively adding a sequence of improvements.

##### Improvement #1: Rebranding 

Our `IntList` class from last time was as follows, with helper methods omitted:

```java

public class IntList {

    public int first;

    public IntList rest;

    public IntList(int f, IntList r) {

        first = f;

        rest = r;

    }

...

```

Our first step will be to simply rename everything and throw away the helper methods. This probably doesn't seem like progress, but trust me, I'm a professional.

```java

public class IntNode {

    public int item;

    public IntNode next;

    public IntNode(int i, IntNode n) {

        item = i;

        next = n;

    }

}

```

##### Improvement #2: Bureaucracy 

Knowing that `IntNodes` are hard to work with, we're going to create a separate class called `SLList` that the user will interact with. The basic class is simply:

```java

public class SLList {

    public IntNode first;

    public SLList(int x) {

        first = new IntNode(x, null);

    }

}

```

Already, we can get a vague sense of why a `SLList` is better. Compare the creation of an `IntList` of one item to the creation of a `SLList` of one item.

```java

IntList L1 = new IntList(5, null);

SLList L2  = new SLList(5);

```

The `SLList` hides the detail that there exists a null link from the user. The `SLList` class isn't very useful yet, so let's add an `addFirst` and `getFirst` method as simple warmup methods. Consider trying to write them yourself before reading on.

##### addFirst and getFirst 

`addFirst` is relatively straightforward if you understood chapter 2.1. With `IntLists`, we added to the front with the line of code `L = new IntList(5, L)`. Thus, we end up with:

```java

public class SLList {

    public IntNode first;

    public SLList(int x) {

        first = new IntNode(x, null);

    }

    /** Adds an item to the front of the list. */

    public void addFirst(int x) {

        first = new IntNode(x, first);

    }

}

```

`getFirst` is even easier. We simply return `first.item`:

```java

/** Retrieves the front item from the list. */

public int getFirst() {

    return first.item;

}

```

The resulting `SLList` class is much easier to use. Compare:

```java

SLList L = new SLList(15);

L.addFirst(10);

L.addFirst(5);

int x = L.getFirst();

```

to the `IntList` equivalent:

```java

IntList L = new IntList(15, null);

L = new IntList(10, L);

L = new IntList(5, L);

int x = L.first;

```

Comparing the two data structures visually, we have: (with the `IntList` version on top and `SLList` version below it)

![IntList\_vs\_SLList.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig22/IntList_vs_SLList.png)

Essentially, the `SLList` class acts as a middleman between the list user and the naked recursive data structure. As suggested above in the `IntList` version, there is a potentially undesireable possibility for the `IntList` user to have variables that point to the middle of the `IntList`. As Ovid said: [Mortals cannot look upon a god without dying](https://en.wikipedia.org/wiki/Semele), so perhaps it is best that the `SLList` is there to act as our intermediary.

**Exercise 2.2.1**: The curious reader might object and say that the `IntList` would be just as easy to use if we simply wrote an `addFirst` method. Try to write an `addFirst` method to the `IntList` class. You'll find that the resulting method is tricky as well as inefficient.

##### Improvement #3: Public vs. Private 

Unfortunately, our `SLList` can be bypassed and the raw power of our naked data structure (with all its dangers) can be accessed. A programmer can easily modify the list directly, without going through the kid-tested, mother-approved `addFirst` method, for example:

```java

SLList L = new SLList(15);

L.addFirst(10);

L.first.next.next = L.first.next;

```

![bad\_SLList.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig22/bad_SLList.png)

This results in a malformed list with an infinite loop. To deal with this problem, we can modify the `SLList` class so that the `first` variable is declared with the `private` keyword.

```java

public class SLList {

    private IntNode first;

...

```

Private variables and methods can only be accessed by code inside the same `.java` file, e.g. in this case `SLList.java`. That means that a class like `SLLTroubleMaker` below will fail to compile, yielding a `first has private access in SLList` error.

```java

public class SLLTroubleMaker {

    public static void main(String[] args) {

        SLList L = new SLList(15);

        L.addFirst(10);

        L.first.next.next = L.first.next;

    }

}

```

By contrast, any code inside the `SLList.java` file will be able to access the `first` variable.

It may seem a little silly to restrict access. After all, the only thing that the `private` keyword does is break programs that otherwise compile. However, in large software engineering projects, the `private` keyword is an invaluable signal that certain pieces of code should be ignored (and thus need not be understood) by the end user. Likewise, the `public` keyword should be thought of as a declaration that a method is available and will work **forever** exactly as it does now.

As an analogy, a car has certain `public` features, e.g. the accelerator and brake pedals. Under the hood, there are `private` details about how these operate. In a gas powered car, the accelerator pedal might control some sort of fuel injection system, and in a battery powered car, it may adjust the amount of battery power being delivered to the motor. While the private details may vary from car to car, we expect the same behavior from all accelerator pedals. Changing these would cause great consternation from users, and quite possibly terrible accidents.

**When you create a `public` member (i.e. method or variable), be careful, because you're effectively committing to supporting that member's behavior exactly as it is now, forever.**

##### Improvement #4: Nested Classes 

At the moment, we have two `.java` files: `IntNode` and `SLList`. However, the `IntNode` is really just a supporting character in the story of `SLList`.

Java provides us with the ability to embed a class declaration inside of another for just this situation. The syntax is straightforward and intuitive:

```java

public class SLList {

       public class IntNode {

            public int item;

            public IntNode next;

            public IntNode(int i, IntNode n) {

                item = i;

                next = n;

            }

       }

       private IntNode first; 

       public SLList(int x) {

           first = new IntNode(x, null);

       } 

...

```

Having a nested class has no meaningful effect on code performance, and is simply a tool for keeping code organized. For more on nested classes, see [Oracle's official documentation](https://docs.oracle.com/javase/tutorial/java/javaOO/nested.html).

If the nested class has no need to use any of the instance methods or variables of `SLList`, you may declare the nested class `static`, as follows. Declaring a nested class as `static` means that methods inside the static class can not access any of the members of the enclosing class. In this case, it means that no method in `IntNode` would be able to access `first`, `addFirst`, or `getFirst`.

```java

public class SLList {

       public static class IntNode {

            public int item;

            public IntNode next;

            public IntNode(int i, IntNode n) {

                item = i;

                next = n;

            }

       }

       private IntNode first;

...

```

This saves a bit of memory, because each `IntNode` no longer needs to keep track of how to access its enclosing `SLList`.

Put another way, if you examine the code above, you'll see that the `IntNode` class never uses the `first` variable of `SLList`, nor any of `SLList`'s methods. As a result, we can use the static keyword, which means the `IntNode` class doesn't get a reference to its boss, saving us a small amount of memory.

If this seems a bit technical and hard to follow, try Exercise 2.2.2. A simple rule of thumb is that *if you don't use any instance members of the outer class, make the nested class static*.

**Exercise 2.2.2** Delete the word `static` as few times as possible so that [this program](https://joshhug.gitbooks.io/hug61b/content/chap2/exercises/Government.java) compiles (Refresh the page after clicking the link and making sure the url changed). Make sure to read the comments at the top before doing the exercise.

##### addLast() and size() 

To motivate our remaining improvements and also demonstrate some common patterns in data structure implementation, we'll add `addLast(int x)` and `size()` methods. You're encouraged to take the [starter code](https://github.com/Berkeley-CS61B/lectureCode/blob/master/lists2/DIY/addLastAndSize/SLList.java) and try it yourself before reading on. I especially encourage you to try to write a recursive implementation of `size`, which will yield an interesting challenge.

I'll implement the `addLast` method iteratively, though you could also do it recursively. The idea is fairly straightforward, we create a pointer variable `p` and have it iterate through the list to the end.

```java

/** Adds an item to the end of the list. */

public void addLast(int x) {

    IntNode p = first;

    /* Advance p to the end of the list. */

    while (p.next != null) {

        p = p.next;

    }

    p.next = new IntNode(x, null);

}

```

By contrast, I'll implement `size` recursively. This method will be somewhat similar to the `size` method we implemented in section [2.1](https://joshhug.gitbooks.io/hug61b/content/chap2/chap21.html) for `IntList`.

The recursive call for `size` in `IntList` was straightforward: `return 1 + this.rest.size()`. For a `SLList`, this approach does not make sense. A `SLList` has no `rest` variable. Instead, we'll use a common pattern that is used with middleman classes like `SLList` -- we'll create a private helper method that interacts with the underlying naked recursive data structure.

This yields a method like the following:

```java

/** Returns the size of the list starting at IntNode p. */

private static int size(IntNode p) {

    if (p.next == null) {

        return 1;

    }

    return 1 + size(p.next);

}

```

Using this method, we can easily compute the size of the entire list:

```java

public int size() {

    return size(first);

}

```

Here, we have two methods, both named `size`. This is allowed in Java, since they have different parameters. We say that two methods with the same name but different signatures are **overloaded**. For more on overloaded methods, see Java's [official documentation](https://docs.oracle.com/javase/tutorial/java/javaOO/methods.html).

An alternate approach is to create a non-static helper method in the `IntNode` class itself. Either approach is fine, though I personally prefer not having any methods in the `IntNode` class.

### Improvement #5: Caching 

Consider the `size` method we wrote above. Suppose `size` takes 2 seconds on a list of size 1,000. We expect that on a list of size 1,000,000, the `size` method will take 2,000 seconds, since the computer has to step through 1,000 times as many items in the list to reach the end. Having a `size` method that is very slow for large lists is unacceptable, since we can do better.

It is possible to rewrite `size` so that it takes the same amount of time, no matter how large the list.

To do so, we can simply add a `size` variable to the `SLList` class that tracks the current size, yielding the code below. This practice of saving important data to speed up retrieval is sometimes known as **caching**.

```java

public class SLList {

    ... /* IntNode declaration omitted. */

    private IntNode first;

    private int size;

    public SLList(int x) {

        first = new IntNode(x, null);

        size = 1;

    }

    public void addFirst(int x) {

        first = new IntNode(x, first);

        size += 1;

    }

    public int size() {

        return size;

    }

    ...

}

```

This modification makes our `size` method incredibly fast, no matter how large the list. Of course, it will also slow down our `addFirst` and `addLast` methods, and also increase the memory of usage of our class, but only by a trivial amount. In this case, the tradeoff is clearly in favor of creating a cache for size.

##### Improvement #6: The Empty List 

Our `SLList` has a number of benefits over the simple `IntList` from chapter 2.1:

* Users of a `SLList` never see the `IntList` class.

  * Simpler to use.

  * More efficient `addFirst` method (exercise 2.2.1).

  * Avoids errors or malfeasance by `IntList` users.

* Faster `size` method than possible with `IntList`.

Another natural advantage is that we will be able to easily implement a constructor that creates an empty list. The most natural way is to set `first` to `null` if the list is empty. This yields the constructor below:

```java

public SLList() {

    first = null;

    size = 0;

}

```

Unfortunately, this causes our `addLast` method to crash if we insert into an empty list. Since `first` is `null`, the attempt to access `p.next` in `while (p.next != null)` below causes a null pointer exception.

```java

public void addLast(int x) {

    size += 1;

    IntNode p = first;

    while (p.next != null) {

        p = p.next;

    }

    p.next = new IntNode(x, null);

}

```

**Exercise 2.2.3** Fix the `addLast` method. Starter code [here](https://github.com/Berkeley-CS61B/lectureCode/blob/master/lists2/DIY/fixAddLast/SLList.java).

##### Improvement #6b: Sentinel Nodes 

One solution to fix `addLast` is to create a special case for the empty list, as shown below:

```java

public void addLast(int x) {

    size += 1;

    if (first == null) {

        first = new IntNode(x, null);

        return;

    }

    IntNode p = first;

    while (p.next != null) {

        p = p.next;

    }

    p.next = new IntNode(x, null);

}

```

This solution works, but special case code like that shown above should be avoided when necessary. Human beings only have so much working memory, and thus we want to keep complexity under control wherever possible. For a simple data structure like the `SLList`, the number of special cases is small. More complicated data structures like trees can get much, much uglier.

A cleaner, though less obvious solution, is to make it so that all `SLLists` are the "same", even if they are empty. We can do this by creating a special node that is always there, which we will call a **sentinel node**. The sentinel node will hold a value, which we won't care about.

For example, the empty list created by `SLList L = new SLList()` would be as shown below:

![empty\_sentinelized\_SLList.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig22/empty_sentinelized_SLList.png)

And a `SLList` with the items 5, 10, and 15 would look like:

![three\_item\_sentenlized\_SLList.png](https://joshhug.gitbooks.io/hug61b/content/chap2/fig22/three_item_sentenlized_SLList.png)

In the figures above, the lavender ?? value indicates that we don't care what value is there. Since Java does not allow us to fill in an integer with question marks, we just pick some abitrary value like -518273 or 63 or anything else.

Since a `SLList` without a sentinel has no special cases, we can simply delete the special case from our `addLast` method, yielding:

```java

public void addLast(int x) {

    size += 1;

    IntNode p = sentinel;

    while (p.next != null) {

        p = p.next;

    }

    p.next = new IntNode(x, null);

}

```

As you can see, this code is much much cleaner!

##### Invariants 

An invariant is a fact about a data structure that is guaranteed to be true (assuming there are no bugs in your code).

A `SLList` with a sentinel node has at least the following invariants:

* The `sentinel` reference always points to a sentinel node.

* The front item (if it exists), is always at `sentinel.next.item`.

* The `size` variable is always the total number of items that have been added.

Invariants make it easier to reason about code, and also give you specific goals to strive for in making sure your code works.

A true understanding of how convenient sentinels are will require you to really dig in and do some implementation of your own. You'll get plenty of practice in Project 1. However, we recommend that you wait until after you've finished the next section of this book before beginning Project 1.


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：链表 I：引用传递、内存模型与递归链表](/notes/cs61b/lecture-03) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：链表 III：双向链表、泛型与原生数组 →](/notes/cs61b/lecture-05) | [🎬 在 B 站观看本讲 (P04)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4) |
