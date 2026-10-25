---
kind: notes
source: cs61b/lecture-04
title: "Lecture 04 · Linked Lists II: SLList, Encapsulation, Invariants, and
  Sentinels"
description: "CS61B Lecture 4: Linked List II: One-way Linked List,
  Encapsulation and Sentinel Node: SLList Encapsulation, Access Control, Static
  Nested Classes, Class Invariants and Sentinel Pattern"
sourceHash: 5fdddbec594be373086c775b456b60f078bb5ea8d7a79aa448f263453106a787
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 1: Java Fundamentals & Lists  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 49:11 ｜ **Official original version**: Lecture 4 - Lists II SLLists  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P4)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1Uty7XFuhRuCg3SoaSaViXzJhPTZDoYUV878L2I_pe_k) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/4.-sllists)  
> **Quick navigation**: [← Previous lecture (P03 Linked List I: Reference passing, memory model and recursive linked list)](/en/notes/cs61b/lecture-03) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P05 Linked List III: Doubly Linked List, Generics and Native Arrays) →](/en/notes/cs61b/lecture-05)

---

## 1. From IntList to SLList: The inevitability of the evolution of object-oriented encapsulation

*(Reference time: 00:01:40 · [Video jump (P04 00:01:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=100))*

In the previous lecture, the naked recursive linked list we constructed  `IntList`  There are serious engineering usability flaws:
- Client users must have a deep understanding of recursion to correctly construct linked lists (such as nested use  `new IntList(5, new IntList(10, null))`); 
- A linked list cannot naturally express the "empty linked list" state (you can only use  `null`  means, but for  `null`  Calling the method will crash immediately);
- The node pointers inside the data structure are exposed to the outside without protection.

In order to provide the client with a friendly, safe and intuitive data structure, we perform object-oriented secondary abstraction: **Build an outer wrapper class  `SLList` (Singly Linked List, one-way linked list)**.

### The basic structure of the packaging class
In its most basic form, `SLList`  Acts as the manager of the linked list and maintains a pointer to the first node internally:

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

### Client call comparison
Now, the external consumer's code becomes extremely elegant:
```java
SLList L = new SLList(15);
L.addFirst(10);
L.addFirst(5);
int x = L.getFirst(); // 得到 5
```
Users no longer need to care about how the linked list is used internally  `next`  Pointers are connected to each other and they face a complete abstract data type (ADT).

## 2. Access control and information hiding: `public`  with  `private`  architectural deterrence

*(Reference time: 00:09:10 · [Video jump (P04 00:09:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=550))*

In the above preliminary implementation, there is still an extremely dangerous vulnerability hidden: `first`  The variable is  `public`  Yes!

If a malicious or careless programmer writes the following code:
```java
SLList L = new SLList(15);
L.addFirst(10);
L.first.next.next = L.first; // 灾难！制造了无限环形链表！
```
External code can be bypassed at will  `SLList`  The legal operations provided directly tamper with the underlying node pointer, causing an infinite loop or memory damage.

### Encapsulation and Information Hiding
One of the core rules of object-oriented design principles is: **Only expose a minimalist operation contract (Interface/API) to the outside, completely hiding all internal implementation details and data storage mechanisms.**.

we will  `first`  declared as  `private`: 
```java
public class SLList {
    private IntNode first;
    ...
```

### `private`  Keyword intrinsic safety line of defense
- Once a field is declared as  `private`, **Only within the code block of the class (SLList) itself are you allowed to access and modify it**; 
- Any external class (such as  `SLListLauncher`) try to execute  `L.first`, will all be there  `javac`  The compilation phase was rejected by a direct error: `error: first has private access in SLList`.
- This completely eliminates the possibility of external tampering with the internal topology at the compiler level!

## 3. Nested Classes design and  `static`  Memory optimization

*(Reference time: 00:16:30 · [Video jump (P04 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=990))*

in  `SLList`  in, `IntNode`  class is specialized for  `SLList`  A tool that provides underlying node support, and external users do not need to know its existence at all. Therefore, it will  `IntNode`  nested in  `SLList`  The interior is a superb design exercise.

Not only that, we should also  `IntNode`  declared as  `private static class`: 

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

### Key Choice: Why Add to Nested Classes  `static`?
Many beginners overlook the huge memory difference between non-static inner classes and static nested classes:

1. **Non-static inner class (Inner Class)**: 
   - if not write  `static`, the Java compiler will  `IntNode`  In the underlying structure of the object, **Implicitly insert a pointer to the outside  `SLList`  Hidden pointer to instance** (usually written as  `this$0`); 
   - This not only causes an extra 64 bits of physical memory to be wasted on each node, but also prolongs the garbage collection cycle and reduces the CPU cache hit rate.
2. **Static Nested Class**: 
   - plus  `static`  After that, `IntNode`  Completely cut off from the outside world  `SLList`  Implicit connection of instances, it cannot and does not need to access instance variables of external classes;
   - It becomes a completely independent pure data load unit, saving memory and improving performance.

> **architectural rules**: If a nested class is within its life cycle **No need to access instance variables or methods of the outer wrapper class at all**, it must be declared decisively as  `static`!

## 4. Space for time: caching  `size`  Fields and Class Invariants

*(Reference time: 00:23:50 · [Video jump (P04 00:23:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=1430))*

consider in  `SLList`  realized in  `size()`  Method: Get the number of elements in the current linked list.

### Simple implementation: traverse the linked list each time (time consuming  $O(N)$)
We can write an auxiliary recursive or iterative method to iterate over the count as we did in the previous lecture:
```java
private static int size(IntNode p) {
    if (p.next == null) return 1;
    return 1 + size(p.next);
}

public int size() {
    return size(first);
}
```
**Serious defects**: If the linked list contains 1,000,000 elements, each call  `L.size()`  It must take millions of instructions to traverse the entire linked list! As the size of the data increases, the system will slow down dramatically.

### Space-Time Trade-off: Maintain cache fields
we can  `SLList`  Add an additional integer variable to  `size`: 
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

### Core concept: Class Invariants
Class invariants are the cornerstone of the stability of object-oriented systems. **Throughout the entire life cycle of an object, no matter what operations it undergoes, it must be a constant state truth.**.

for  `SLList`, the core class invariants we established are:
> **Class invariant 1**: `first`  The variable always points to the first real data node of the linked list.  
> **Class invariant 2**: `size`  The value of the variable is always exactly equal to the total number of data nodes currently contained in the linked list.

As long as every method that may modify the state of the linked list (constructor, `addFirst`, `addLast`, `removeFirst`  etc.) strictly ensure that this truth holds at the end, then the reading method (such as  `size()`) you can trust the cached field 100% to  $O(1)$  The ultimate speed returns the results directly!

## 5. The Empty List Problem and boundary collapse

*(Reference time: 00:31:00 · [Video jump (P04 00:31:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=1860))*

In the real world, we often need to create a **Empty linked list**: 
```java
SLList L = new SLList(); // 创建空链表
```

We can easily write the following empty linked list constructor:
```java
public SLList() {
    first = null;
    size = 0;
}
```

Next, let's implement  `addLast(int x)`  Method: Append new elements to the end of the linked list.
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

### Disaster strikes: NullPointerException crash on empty linked list!
Let's test it with client code:
```java
SLList L = new SLList(); // first 是 null
L.addLast(42);           // 瞬间崩溃！抛出 NullPointerException！
```

**Why does it crash?**
 Take a closer look at the loop condition: `while (p.next != null)`.  
Since the linked list is empty at this time, `first`  Yes  `null`, therefore  `p = first`  cause  `p`  Also  `null`!  
when executing  `p.next`  When, the JVM tries to dereference a null reference, causing an exception and crash in an instant!

### Ugly patching attempt (Special Casing)
Beginners usually write  `if (first == null)`  To patch:
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
**Why is this patch code said to be inferior?**
 Because once you do special processing for the empty linked list, what follows  `removeLast`, `getLast`, `insert`  So inside almost every method, you have to write a lot of  `if (first == null)`  Branch! The code is full of boundary specializations, which are easily missed and breed numerous bugs.

Computer masters came up with an extremely elegant ultimate solution——**The Sentinel Node Pattern**!

## 6. The Sentinel Node Pattern: Eliminate boundary special judgments

*(Reference time: 00:38:20 · [Video jump (P04 00:38:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=2300))*

The core idea of Sentinel Node (also called Dummy Node) is: **Always place a special node at the head of the linked list that does not store valid business data.**.

Whether the linked list is empty, has 1 element, or has 10,000 elements, this sentinel node remains unchanged!

### SLList topology with sentinel nodes
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

### Refactored code in sentinel mode
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

### New class invariants brought by sentry mode
> **sacred invariants**:   
> 1. `sentinel`  Quotes are never and never for  `null`! It always points to that loyal sentinel node.  
> 2. The first real data node of the linked list is always  `sentinel.next` (If the linked list is empty, then  `sentinel.next == null`).  
> 3. `size`  The number of valid data nodes is always recorded exactly (not counting the sentinels themselves).

## 7. Official courseware seminar question: Invariant destruction and reflection

*(Reference time: 00:46:10 · [Video jump (P04 00:46:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=2770))*

Professor Josh Hug presented several exquisite discussion questions in the Lecture 4 courseware to test students' depth of understanding of encapsulation and invariants.

### Discussion question: How to completely prevent invariants from being destroyed?
**Discussion scene**: Suppose we are in  `SLList`  A method has been added:
```java
public IntNode getFirstNode() {
    return sentinel.next;
}
```
This method is declared as  `public`, returns a reference to the first node. Does this design break object-oriented encapsulation?

**in-depth analysis**: 
- **Fatal destruction!**  Although  `sentinel`  and  `IntNode`  Internal fields may be private, but once a direct reference to the internal node is returned to the external client, the external client can write:
  ```java
  SLList L = new SLList(10);
  IntNode n = L.getFirstNode();
  n.next = n; // 外部直接将内部节点改写为死循环环形！
  ```
- At this time, `SLList` 's internal structure was completely destroyed without knowing it, and subsequent calls to  `L.addLast(20)`  will be trapped in an infinite loop.
- **best practice principles**: **When the data structure of the container class exposes the interface to the outside world, never leak references to the internal private node objects (Node Objects) to the outside world.**! Only the user's data items should be passed out (`item`, such as integer or object load).

## 8. Summary of the structure of this lecture and comprehensive practical self-test questions

*(Reference time: 00:51:00 · [Video jump (P04 00:51:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4&t=3060))*

### Core knowledge comparison panorama

| Architectural features | Naked recursion IntList | Wrapped SLList (no sentinels) | Ultimate SLList (with Sentry) |
| :--- | :--- | :--- | :--- |
| **Empty linked list support** | Not supported (can only be used for  `null`) | Supported, but requires a large amount  `if(first==null)` | Perfect support, natural and unified topology |
| **First and last operations** | Header insertion requires manual assignment | provide  `addFirst` / `addLast` | Provide unified operation, no special code judgment |
| **`size()`  Performance** | recursion or traversal  $\Theta(N)$ | Cache fields, transient  $\Theta(1)$ | Cache fields, transient  $\Theta(1)$ |
| **Encapsulating security** | Exposed internal pointers, extremely vulnerable | Privatize fields and establish invariant protection | Private static nested classes, completely safe |

---

### Comprehensive self-test questions after class

#### Question 1 (Sentinel Mechanism Tracking)
For those with sentinel nodes  `SLList`, when the linked list contains 3 elements, how many elements are there in the memory heap?  `IntNode`  Instance object? If the linked list is empty, how many are there in the heap?  `IntNode`  Example?  
**Answers and analysis**:   
- When it contains 3 elements, there are a total of  **4** `IntNode`  Object (1 sentinel node + 3 real data nodes);  
- When the linked list is empty, there are total  **1** `IntNode`  Object (that is, the sentinel node itself that never dies).

#### Question 2 (Code Practice: Implementation  `deleteFirst()`)
Please provide a sentinel node  `SLList`  Supplementary implementation of an instance method  `public void deleteFirst()`, delete the first real element of the linked list. If the linked list is empty, do nothing. Requires strict maintenance  `size`  and sentinel invariants. 
**Reference implementation code**: 
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
**Memory analysis**: The original first node that was skipped has lost its referenced root (GC Root unreachable) and will be automatically recycled and released by the JVM during the subsequent Java garbage collection (Garbage Collection) process, eliminating memory leaks!

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

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

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous Lecture: Linked List I: Reference Passing, Memory Model and Recursive Linked List](/en/notes/cs61b/lecture-03) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Linked List III: Doubly Linked List, Generics and Native Arrays →](/en/notes/cs61b/lecture-05) | [🎬Watch this lecture on Bilibili (P04)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=4) |
