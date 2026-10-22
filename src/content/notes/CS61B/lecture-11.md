---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 11 · 继承 IV：迭代器与 Object 根基方法：Iterable 与 Iterator 架构、for-each
  编译脱糖、toString、equals 与 hashCode
description: CS61B 第 11 讲：继承 IV：迭代器与 Object 根基方法：Iterable 与 Iterator 架构、for-each
  编译脱糖、toString、equals 与 hashCode
topic: CS61B
order: 11
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 2: 继承与面向对象体系 (Inheritance, Interfaces & Subtyping)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：59:15 ｜ **官方原版**：Lecture 11 - Inheritance IV Iterators Object Methods  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P11)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1bahvjVtbMcc2kuyzYQfQtD8EJyIiIkWnSALVSMuyQhI) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/12.-exceptions-iterators-object-methods)  
> **快速导航**：[← 上一讲 (P10 继承 III：子类型多态、Comparable 与 Comparator)](/notes/cs61b/lecture-10) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P12 渐进分析 I：算法效率度量与大 O 阶梯) →](/notes/cs61b/lecture-12)

---

## 1. 容器遍历的通用哲学：从索引循环到迭代器抽象

*(参考时间：00:01:20 · [视频跳转 (P11 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=80))*

我们经常需要遍历访问一个容器中的每一个元素。对于基于数组的容器，使用传统的下标循环非常高效：
```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

### 为什么下标循环不是通用的解法？
1. **对链表性能极度低下**：在单向链表或双向链表中，`get(i)` 必须从头遍历 $i$ 步。使用上述下标循环遍历一个长度为 $N$ 的链表，总时间开销是恐怖的 $\Theta(N^2)$！
2. **对无序集合完全失效**：对于集合（`Set`）、哈希表（`Map`）或树形结构（`Tree`），概念上根本不存在“第 $i$ 个元素”的整数下标！

面向对象设计模式提出了著名的**迭代器模式（Iterator Pattern）**：提供一种统一的方法，顺序访问一个聚合对象中的各个元素，而又不需要暴露该对象的内部底层拓扑表示。

## 2. 迭代器接口双子星：`Iterator<T>` vs `Iterable<T>`

*(参考时间：00:09:45 · [视频跳转 (P11 00:09:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=585))*

Java 通过两个名字极其相似但职责完全不同的核心接口定义了迭代器体系：

### 角色一：游标裁判员 `java.util.Iterator<T>`
负责维护具体的游标遍历状态：
```java
public interface Iterator<T> {
    /** 是否还有下一个可用元素？ */
    boolean hasNext();

    /** 步进游标，并返回下一个元素 */
    T next();
}
```

### 角色二：可迭代容器 `java.lang.Iterable<T>`
表示“我这个数据结构能够支持被遍历”：
```java
public interface Iterable<T> {
    /** 产生并返回一个专属于本容器的全新游标迭代器 */
    Iterator<T> iterator();
}
```

> **形象比喻**：`Iterable` 就像一本长篇小说（具有被阅读的属性），而 `Iterator` 就像一张书签游标（记录当前读到了哪一页，提供翻向下一页的能力）。一本小说可以同时插上多张不同的书签各自独立翻阅！

## 3. 语法糖解密：Java `for-each` 增强循环的底层编译脱糖

*(参考时间：00:17:30 · [视频跳转 (P11 00:17:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1050))*

在日常开发中，我们最喜欢写清爽的 `for-each` 增强循环：
```java
for (String word : wordsList) {
    System.out.println(word);
}
```

### 编译器的魔术真相（Desugaring）
任何类只要实现了 `java.lang.Iterable<T>` 接口，Java 编译器 `javac` 就会在编译阶段，**将上面的 `for-each` 语法糖自动精确脱糖（Desugar）翻译为底层的 while 迭代器调用代码**：

```java
Iterator<String> seer = wordsList.iterator();
while (seer.hasNext()) {
    String word = seer.next();
    System.out.println(word);
}
```
这就是为什么如果一个类没有实现 `Iterable` 接口，强行对其使用 `for-each` 会报编译错误：`foreach not applicable to type`！

## 4. 自定义数据结构的迭代器完整实战实现（以 ArraySet 为例）

*(参考时间：00:25:00 · [视频跳转 (P11 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1500))*

让我们跟随课件，为一个简易动态集合 `ArraySet<T>` 亲手实现完整的迭代器支持：

```java
import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {
    private T[] items;
    private int size;

    public ArraySet() {
        items = (T[]) new Object[100];
        size = 0;
    }

    public void add(T x) {
        if (x == null || contains(x)) return;
        items[size++] = x;
    }

    public boolean contains(T x) {
        for (int i = 0; i < size; i++) {
            if (items[i].equals(x)) return true;
        }
        return false;
    }

    /** 1. 实现 Iterable 接口要求的方法 */
    @Override
    public Iterator<T> iterator() {
        return new ArraySetIterator();
    }

    /** 2. 定义内部专用嵌套迭代器类 */
    private class ArraySetIterator implements Iterator<T> {
        private int wizardIndex; // 记录当前游标扫描位置

        public ArraySetIterator() {
            wizardIndex = 0;
        }

        @Override
        public boolean hasNext() {
            return wizardIndex < size;
        }

        @Override
        public T next() {
            T returnItem = items[wizardIndex];
            wizardIndex += 1;
            return returnItem;
        }
    }
}
```
此时，`ArraySet` 完美支持原生的 `for (T item : set)` 遍历语法！

## 5. 对象的基石方法一：`toString()` 优雅实现与 `StringBuilder` 性能优化

*(参考时间：00:33:10 · [视频跳转 (P11 00:33:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1990))*

在 Java 的面向对象世界中，所有类都隐式继承自终极始祖类 `java.lang.Object`。  
`Object` 默认的 `toString()` 实现极为简陋：返回类名加上十六进制哈希码（如 `ArraySet@15db9742`）。

我们希望将其格式化打印为如同 Python 风格的清爽文本：`{1, 2, 3}`。

### 致命陷阱：在循环中直接使用字符串拼接 `+`
```java
// 极其低效的写法！
String result = "{";
for (T item : this) {
    result += item.toString() + ", ";
}
```
在 Java 中，`String` 是**不可变对象（Immutable）**！每次执行 `result += ...`，JVM 都必须在堆中重新分配一个更大的全新字符串，并把旧内容全部拷贝过去！在长度为 $N$ 的循环中，字符串拼接会产生 $O(N^2)$ 的内存分配开销，严重拖垮系统。

### 工业级标准实现：`StringBuilder`
```java
@Override
public String toString() {
    StringBuilder returnSB = new StringBuilder("{");
    for (int i = 0; i < size - 1; i++) {
        returnSB.append(items[i].toString());
        returnSB.append(", ");
    }
    if (size > 0) {
        returnSB.append(items[size - 1].toString());
    }
    returnSB.append("}");
    return returnSB.toString(); // 极致的线性 O(N) 性能！
}
```

## 6. 对象的基石方法二：`equals(Object o)` 五大数学契约与工业级模板

*(参考时间：00:41:20 · [视频跳转 (P11 00:41:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=2480))*

判断两个容器是否内容相等，必须重写 `equals` 方法。

### Java 官方规定的 `equals` 五大数学等价公理
1. **自反性（Reflexive）**：对于任何非空引用 `x`，`x.equals(x)` 必须为 `true`；
2. **对称性（Symmetric）**：对于任何非空引用 `x` 和 `y`，当且仅当 `y.equals(x)` 为 `true` 时，`x.equals(y)` 才为 `true`；
3. **传递性（Transitive）**：若 `x.equals(y)` 为真且 `y.equals(z)` 为真，则 `x.equals(z)` 必须为真；
4. **一致性（Consistent）**：只要对象内部比较状态未改变，多次调用结果必须严格恒定；
5. **非空性（Non-nullity）**：对于任何非空引用 `x`，`x.equals(null)` 必须恒为 `false`。

### 工业级无懈可击的标准五步重写模板
```java
@Override
public boolean equals(Object o) {
    // 步骤 1：同一性检查（性能极速短路）
    if (this == o) {
        return true;
    }
    // 步骤 2：非空与类型防御（排除了 null 以及类型不兼容的对象）
    if (o == null || this.getClass() != o.getClass()) {
        return false;
    }
    // 步骤 3：强制类型转换
    ArraySet<T> other = (ArraySet<T>) o;
    // 步骤 4：前置简单状态比对
    if (this.size != other.size) {
        return false;
    }
    // 步骤 5：逐项内容等价性深层比对
    for (T item : this) {
        if (!other.contains(item)) {
            return false;
        }
    }
    return true;
}
```

## 7. 对象的基石方法三：`hashCode()` 铁律与散列表生存法则

*(参考时间：00:49:00 · [视频跳转 (P11 00:49:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=2940))*

在重写 `equals` 方法时，Java 语言规范中隐藏着一条**至高无上的强制契约**：

> **`hashCode` 黄金法则**：  
> **如果两个对象通过 `equals` 比较结果为 `true`，那么这两个对象的 `hashCode()` 返回的整型哈希值必须绝对完全相同！**

### 为什么这条铁律违背不得？
Java 的哈希集合（`HashSet`）和哈希映射表（`HashMap`）在存储和查找对象时，会**首先计算对象的 `hashCode()` 来决定将其放入哪一个哈希桶（Bucket）**。

如果你重写了 `equals` 但没有重写 `hashCode`：
- 两个内容完全相等的对象会生成两个完全随机的旧内存地址哈希码；
- 它们会被存入不同的哈希桶中；
- 当你调用 `set.contains(target)` 时，哈希表根据 `target` 的哈希码去错误的桶里寻找，即使该对象明明在集合中，也会报不存在！直接摧毁所有哈希数据结构的正确性。

```java
import java.util.Objects;

@Override
public int hashCode() {
    // 使用 Java 标准库实用工具类自动组合计算字段哈希
    return Objects.hash(size, java.util.Arrays.hashCode(items));
}
```

## 8. 本讲全景总结与进阶自测题

*(参考时间：00:54:30 · [视频跳转 (P11 00:54:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=3270))*

### 课后综合自测题

#### 题目 1（equals 签名陷阱辨析）
某位同学在类中编写了如下 equals 方法：
```java
public class Point {
    public int x, y;
    public boolean equals(Point p) { // 注意形参类型是 Point
        return this.x == p.x && this.y == p.y;
    }
}
```
当把两个逻辑相等的 `Point` 对象放入 `ArrayList<Point>` 并调用 `list.contains(p)` 时，为什么会得到 `false`？  
**答案与解析**：  
- **致命的重载而非重写**！`ArrayList.contains` 内部调用的是 `Object.equals(Object o)`；  
- 该同学的方法参数是 `Point`，导致他并没有重写 `Object` 的 `equals(Object)`，而是定义了一个重载方法；  
- `ArrayList` 依然会调用继承自 `Object` 的默认比较物理地址的 `equals`，导致内容相等的判定失败！必须严格声明为 `public boolean equals(Object o)` 并添加 `@Override`。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 12. Inheritance IV: Iterators, Object Methods

This section covers Lists and Sets, how to throw informative exceptions, iterations, and object methods. Its contents correspond to Lecture 11.

---

## 12.1 Lists and Sets in Java

In this section, we will learn about how to use Java's built-in `List` and `Set` data structures as well as build our own `ArraySet`.

#### Getting Started

In this course, we've already built two kinds of lists: `AList` and `SLList`. We also built an interface `List61B` to enforce specific list methods `AList` and `SLList` had to implement. You can find the code at the following links:

* [`List61B`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec9_inheritance2/List61B.java)

* [`AList`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec8_inheritance1/AList.java)

* [`SLList`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec9_inheritance2/SLList.java)

This is how we might use `List61B` type:

```java

List61B<Integer> L = new AList<>();

L.addLast(5);

L.addLast(10);

L.addLast(15);

L.print();

```

#### Lists in Real Java Code

We built a list from scratch, but Java provides a built-in `List` interface and several implementations, e.g. `ArrayList`. Remember, since `List` is an interface we can't instantiate it! We must instantiate one of its implementations.

To access this, we can use the full name ('canonical name') of classes/interfaces:

```java

java.util.List<Integer> L = new java.util.ArrayList<>();

```

However, this is a bit verbose. Instead, we can import java libraries:

```java

import java.util.List;

import java.util.ArrayList;

public class Example {

    public static void main(String[] args) {

        List<Integer> L = new ArrayList<>();

        L.add(5);

        L.add(10);

        System.out.println(L);

    }

}

```

#### Sets

Sets are a collection of unique elements - you can only have one copy of each element. Unlike Lists, there is also no sense of order: you can't index into a set, nor can you control where each element is inserted into the set.

##### Java Sets

Java has the `Set` interface along with implementations, e.g. `HashSet`. Remember to import them if you don't want to use the full name!

```java

import java.util.Set;

import java.util.HashSet;

```

Example use:

```java

Set<String> s = new HashSet<>();

s.add("Tokyo");

s.add("Lagos");

System.out.println(s.contains("Tokyo")); // true

```

##### Python Equivalent

In python, we simply call `set()`. To check for `contains` we don't use a method but the keyword `in`. Here's an example:

```python

s = set()

s.add("Tokyo")

s.add("Lagos")

print("Tokyo" in s) // True

```

#### DIY: ArraySet

Our goal is to make our own set, `ArraySet`, with the following methods:

* `add(value)`: add the value to the set if not already present

* `contains(value)`: check to see if ArraySet contains the key

* `size()`: return number of values

If you would like to try it yourself, find 'Do It Yourself' `ArraySet starter code` [here](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/DIY/ArraySet.java). In the lecture clip below, Professor Hug goes develops the solution:

---

## 12.2 Exceptions

In this section, we will learn how to throw exceptions to effectively handle errors that may arise in our code.

Our `ArraySet` implementation from the previous section has a small error. When we add `null` to our ArraySet, we get a NullPointerException.

The probelm lies in the `contains` method where we check `items[i].equals(x)`. If the value at `items[i]` is null, then we are calling `null.equals(x)` -> NullPointerException.

Exceptions cause normal flow of control to stop. We can in fact choose to throw our own exceptions. In python you may have seen this with the `raise` keyword. In Java, Exceptions are objects and we throw exceptions using the following format:

`throw new ExceptionObject(parameter1, ...)`

\

Let's throw an exception when a user tries to add null to our `ArraySet`. We'll throw an `IllegalArgumentException` which takes in one parameter (a `String` message).

Our updated `add` method:

```java

/* Associates the specified value with the specified key in this map.

   Throws an IllegalArgumentException if the key is null. */

public void add(T x) {

    if (x == null) {

        throw new IllegalArgumentException("can't add null");

    }

    if (contains(x)) {

        return;

    }

    items[size] = x;

    size += 1;

}

```

We get an Exception either way - why does this better?

1. We have control of our code: we consciously decide at what point to stop the flow of our program

2. More useful Exception type and helpful error message for those using our code

However, it would be better if the program doesn't crash at all. There are different things we could do in this case. Here are some below:

**Approach 1**: Don't add `null` to the array if it is passed into `add` 

**Approach 2**: Change the `contains` method to account for the case if `items[i] == null`.

Whatever you decide, it is important that users know what to expect. That is why documentation (such as comments about your methods) is very important.<br>

---

## 12.3 Iteration

We can use a clean enhanced for loop with Java's `HashSet`

```java

Set<String> s = new HashSet<>();

s.add("Tokyo");

s.add("Lagos");

for (String city : s) {

    System.out.println(city);

}

```

However, if we try to do the same with our `ArraySet`, we get an error. How can we enable this functionality?

### Enhanced For Loop 

Let's first understand what is happening when we use an enhanced for loop. We can "translate" an enhanced for loop into an ugly, manual approach.

```java

Set<String> s = new HashSet<>();

...

for (String city : s) {

    ...

}

```

The above code translates to:

```java

Set<String> s = new HashSet<>();

...

Iterator<String> seer = s.iterator();

while (seer.hasNext()) {

    String city = seer.next();

    ...

}

```

Let’s strip away the magic so we can build our own classes that support this.

The key here is an object called an *iterator*.

For our example, in List.java we might define an `iterator()` method that returns an iterator object.

```java

public Iterator<E> iterator();

```

Now, we can use that object to loop through all the entries in our list:

```java

List<Integer> friends = new ArrayList<Integer>();

...

Iterator<Integer> seer = friends.iterator();

while (seer.hasNext()) {

System.out.println(seer.next());

}

```

This code behaves identically to the foreach loop version above.

There are three key methods in our iterator approach:

First, we get a new iterator object with `Iterator<Integer> seer = friends.iterator();`

Next, we loop through the list with our while loop. We check that there are still items left with `seer.hasNext()`, which will return true if there are unseen items remaining, and false if all items have been processed.

Last, `seer.next()` does two things at once. It returns the next element of the list, and here we print it out. It also advances the iterator by one item. In this way, the iterator will only inspect each item once. 

### Implementing Iterators 

In this section, we are going to talk about how to build a class to support iteration.

Let's start by thinking about what the compiler needs to know in order to successfully compile the following iterator example:

```java

List<Integer> friends = new ArrayList<Integer>();

Iterator<Integer> seer = friends.iterator();

while(seer.hasNext()) {

    System.out.println(seer.next());

}

```

We can look at the static types of each object that calls a relevant method. `friends` is a List, on which `iterator()` is called, so we must ask:

* Does the List interface have an iterator() method?

`seer` is an Iterator, on which `hasNext()` and `next()` are called, so we must ask:

* Does the Iterator interface have next/hasNext() methods?

So how do we implement these requirements?

The List interface extends the Iterable interface, inheriting the abstract iterator() method. (Actually, List extends Collection which extends Iterable, but it's easier to codethink of this way to start.)

```java

public interface Iterable<T> {

    Iterator<T> iterator();

}

```

```java

public interface List<T> extends Iterable<T>{

    ...

}

```

Next, the compiler checks that Iterators have `hasNext()` and `next()`. The Iterator interface specifies these abstract methods explicitly:

```java

public interface Iterator<T> {

    boolean hasNext();

    T next();

}

```

**What if someone calls `next` when `hasNext` returns false?**

```

This behavior is undefined. However, a common convention is to throw a `NoSuchElementException`. See [Discussion 5](https://sp19.datastructur.es/materials/discussion/disc05sol.pdf) for examples.

```

**Will `hasNext` always be called before `next`?**

```

Not necessarily. This is sometimes the case when someone using the iterator knows exactly how many elements are in the sequence. Thus, we can't rely on the user calling `hasNext` before `next`. However, you can always call `hasNext` from within your `next` function.

```

Specific classes will implement their own iteration behaviors for the interface methods. Let's look at an example. (Note: if you want to build this up from the start, follow along with the live coding in the video.)

We are going to add iteration through keys to our `ArraySet` class. First, we write a new class called ArraySetIterator, nested inside of ArraySet:

```java

private class ArraySetIterator implements Iterator<T> {

    private int wizPos;

    public ArraySetIterator() {

        wizPos = 0;

    }

    public boolean hasNext() {

        return wizPos < size;

    }

    public T next() {

        T returnItem = items[wizPos];

        wizPos += 1;

        return returnItem;

    }

}

```

This ArraySetIterator implements `Iterator<T>`, which means it implements a `hasNext()` method, and a `next()` method, using a `wizPos` position as an index to keep track of its position in the array. For a different data structure, we might implement these two methods differently.

**Thought Exercise:** How would you design `hasNext()` and `next()` for a linked list?

Now that we have the appropriate methods, we could use a ArraySetIterator to iterate through an `ArraySet`:

```java

ArraySet<Integer> aset = new ArraySet<>();

aset.add(5);

aset.add(23);

aset.add(42);

Iterator<Integer> iter = aset.iterator();

while(iter.hasNext()) {

    System.out.println(iter.next());

}

```

We still want to be able to support the enhanced for loop, though, to make our calls cleaner. So, we need to make `ArraySet` implement the Iterable interface. The essential method of the Iterable interface is `iterator()`, which returns an Iterator object for that class. All we have to do is return an instance of our `ArraySetIterator` that we just wrote!

```java

public Iterator<T> iterator() {

    return new ArraySetIterator();

}

```

Now we can use enhanced for loops with our `ArrraySet`!

```java

ArraySet<Integer> aset = new ArraySet<>();

...

for (int i : aset) {

    System.out.println(i);

}

```

Here we've seen **Iterable**, the interface that makes a class able to be iterated on, and requires the method `iterator()`, which returns an Iterator object. And we've seen **Iterator**, the interface that defines the object with methods to actually do that iteration. You can think of an Iterator as a machine that you put onto an iterable that facilitates the iteration. Any iterable is the object on which the iterator is performing.

With these two components, you can make fancy for loops for your classes!

`ArraySet` code with iteration support is below:

```java

import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {

    private T[] items;

    private int size; // the next item to be added will be at position size

    public ArraySet() {

        items = (T[]) new Object[100];

        size = 0;

    }

    /* Returns true if this map contains a mapping for the specified key.

     */

    public boolean contains(T x) {

        for (int i = 0; i < size; i += 1) {

            if (items[i].equals(x)) {

                return true;

            }

        }

        return false;

    }

    /* Associates the specified value with the specified key in this map.

       Throws an IllegalArgumentException if the key is null. */

    public void add(T x) {

        if (x == null) {

            throw new IllegalArgumentException("can't add null");

        }

        if (contains(x)) {

            return;

        }

        items[size] = x;

        size += 1;

    }

    /* Returns the number of key-value mappings in this map. */

    public int size() {

        return size;

    }

    /** returns an iterator (a.k.a. seer) into ME */

    public Iterator<T> iterator() {

        return new ArraySetIterator();

    }

    private class ArraySetIterator implements Iterator<T> {

        private int wizPos;

        public ArraySetIterator() {

            wizPos = 0;

        }

        public boolean hasNext() {

            return wizPos < size;

        }

        public T next() {

            T returnItem = items[wizPos];

            wizPos += 1;

            return returnItem;

        }

    }

    public static void main(String[] args) {

        ArraySet<Integer> aset = new ArraySet<>();

        aset.add(5);

        aset.add(23);

        aset.add(42);

        //iteration

        for (int i : aset) {

            System.out.println(i);

        }

    }

}

```

---

## 12.4 Object Methods

All classes inherit from the overarching Object class. The methods that are inherited are as follows:

* `String toString()`

* `boolean equals(Object obj)`

* `Class <?> getClass()`

* `int hashCode()`

* `protected Objectclone()`

* `protected void finalize()`

* `void notify()`

* `void notifyAll()`

* `void wait()`

* `void wait(long timeout)`

* `void wait(long timeout, int nanos)`

We are going to focus on the first two in this chapter. We will take advantage of inheritance to override these two methods in our classes to behave in the ways we want them to.

### toString() 

The `toString()` method provides a string representation of an object. The `System.out.println()` function implicitly calls this method on whatever object is passed to it and prints the string returned. When you run `System.out.println(dog)`, it's actually doing this:

```java

String s = dog.toString()

System.out.println(s)

```

The default `Object` class' `toString()` method prints the location of the object in memory. This is a hexadecimal string. Classes like Arraylist and java arrays have their own overridden versions of the `toString()` method. This is why, when you were working with and writing tests for Arraylist, errors would always return the list in a nice format like this (1, 2, 3, 4) instead of returning the memory location.

For classes that we've written by ourselves like `ArrayDeque`, `LinkedListDeque`, etc, we need to provide our own `toString()` method if we want to be able to see the objects printed in a readable format.

Let's try to write this method for an `ArraySet` class. Read the `ArraySet` class below and make sure you understand what the various methods do. Feel free to plug the code into java visualizer to get a better understanding!

```java

import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {

    private T[] items;

    private int size; // the next item to be added will be at position size

    public ArraySet() {

        items = (T[]) new Object[100];

        size = 0;

    }

    /* Returns true if this map contains a mapping for the specified key.

     */

    public boolean contains(T x) {

        for (int i = 0; i < size; i += 1) {

            if (items[i].equals(x)) {

                return true;

            }

        }

        return false;

    }

    /* Associates the specified value with the specified key in this map.

       Throws an IllegalArgumentException if the key is null. */

    public void add(T x) {

        if (x == null) {

            throw new IllegalArgumentException("can't add null");

        }

        if (contains(x)) {

            return;

        }

        items[size] = x;

        size += 1;

    }

    /* Returns the number of key-value mappings in this map. */

    public int size() {

        return size;

    }

    /** returns an iterator (a.k.a. seer) into ME */

    public Iterator<T> iterator() {

        return new ArraySetIterator();

    }

    private class ArraySetIterator implements Iterator<T> {

        private int wizPos;

        public ArraySetIterator() {

            wizPos = 0;

        }

        public boolean hasNext() {

            return wizPos < size;

        }

        public T next() {

            T returnItem = items[wizPos];

            wizPos += 1;

            return returnItem;

        }

    }

    @Override

    public String toString() {

        /* hmmm */

    }

    @Override

    public boolean equals(Object other) {

        /* hmmm */

    }

    public static void main(String[] args) {

        ArraySet<Integer> aset = new ArraySet<>();

        aset.add(5);

        aset.add(23);

        aset.add(42);

        //iteration

        for (int i : aset) {

            System.out.println(i);

        }

        //toString

        System.out.println(aset);

        //equals

        ArraySet<Integer> aset2 = new ArraySet<>();

        aset2.add(5);

        aset2.add(23);

        aset2.add(42);

        System.out.println(aset.equals(aset2));

        System.out.println(aset.equals(null));

        System.out.println(aset.equals("fish"));

        System.out.println(aset.equals(aset));

}

```

You can find the [solutions here (ArraySet.java)](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/ArraySet.java)

**Exercise 6.4.1:** Write the toString() method so that when we print an ArraySet, it prints the elements separated by commas inside of curly braces. i.e {1, 2, 3, 4}. Remember, the toString() method should return a string.

**Solution**

```java

public String toString() {

    String returnString = "{";

    for (int i = 0; i < size; i += 1) {

        returnString += keys[i];

        returnString += ", ";

    }

    returnString += "}";

    return returnString;

}

```

This solution, although seemingly simple and elegant, is actually very naive. This is because when you use string concatenation in Java like so: `returnString += keys[i];` you are actually not just appending to `returnString`, you are creating an entirely new string. This is incredibly inefficient because creating a new string object takes time too! Specifically, linear in the length of the string (we'll discuss why in a later chapter!).

**Bonus Question:** Let's say concatenating one character to a string takes 1 second. If we have an ArraySet of size 5: `{1, 2, 3, 4, 5}`, how long would it take to run the `toString()` method?

**Answer:** We set `returnString` to the left bracket which takes one second because this involves adding `{` to the empty string `""`. Adding the first element will involve creating an entirely new string, adding } and 1 which would take 2 seconds. Adding the second element takes 3 seconds because we need to add `{`, `1`, `2`. This process continues, so for the entire array set the total time is `1 + 2 + 3 + 4 + 5 + 6 + 7.`

To remedy this, Java has a special class called `StringBuilder`. It creates a string object that is mutable, so you can continue appending to the same string object instead of creating a new one each time.

**Exercise 6.4.2:** Rewrite the toString() method using StringBuilder.

**Solution**

```java

public String toString() {

        StringBuilder returnSB = new StringBuilder("{");

        for (int i = 0; i < size - 1; i += 1) {

            returnSB.append(items[i].toString());

            returnSB.append(", ");

        }

        returnSB.append(items[size - 1]);

        returnSB.append("}");

        return returnSB.toString();

    }

```

Now you've successfully overridden the `toString()` method! Try printing the ArraySet to see the fruits of your work.

Next we will override another important object method: `equals()`

### equals() 

`equals()` and `==` have different behaviors in Java. `==` Checks if two objects are actually the same object in memory. Remember, pass-by-value! `==` checks if two boxes hold the same thing. For primitives, this means checking if the values are equal. For objects, this means checking if the address/pointer is equal.

Say we have this `Doge` class:

```java

public class Doge {

   public int age;

   public String name;

   public Doge(int age, String name){

      this.age = age;

      this.name = name;

   }

   public static void main(String[] args) {

      int x = 5;

      int y = 5;

      int z = 6;

      Doge fido = new Doge(5, "Fido");

      Doge doggo = new Doge(6, "Doggo");

      Doge fidoTwin = new Doge(5, "Fido");

      Doge fidoRealTwin = fido;

   }

}

```

If we plug this code into the java visualizer, we will see the box in pointer diagram shown below.

![](https://joshhug.gitbooks.io/hug61b/content/assets/Doge.png)

**Exercise 6.4.3:** What would java return if we ran the following?

* `x == y`

* `x == z`

* `fido == doggo`

* `fido == fidoTwin`

* `fido == fidoRealTwin`

**Answers**

* `True`

* `False`

* `False`

* `False`

* `True`

`fido` and `fidoTwin` are not considered `==` because they point to different objects. However, this is quite silly since all their attributes are the same. You can see how `==` can cause some problems in Java testing. When we write tests for our ArrayList and want to check if expected is the same as what is returned by our function, we create expected as a new arraylist. If we used `==` in our test, it would always return false. This is what `equals(Object o)` is for.

### `equals(Object o)` 

`equals(Object o)` is a method in the Object class that, by default, acts like == in that it checks if the memory address of the this is the same as o. However, we can override it to define equality in whichever way we wish! For example, for two Arraylists to be considered equal, they just need to have the same elements in the same order.

**Exercise 6.4.4:** Let's write an equals method for the ArraySet class. Remember, a set is an unordered collection of unique elements. So, for two sets to be considered equal, you just need to check if they have the same elements.

**Solution**

```java

public boolean equals(Object other) {

        if (this == other) {

            return true;

        }

        if (other == null) {

            return false;

        }

        if (other.getClass() != this.getClass()) {

            return false;

        }

        ArraySet<T> o = (ArraySet<T>) other;

        if (o.size() != this.size()) {

            return false;

        }

        for (T item : this) {

            if (!o.contains(item)) {

                return false;

            }

        }

        return true;

    }

```

We added a few checks in the beginning of the method to make sure our `.equals()` can handle nulls and objects of a different class. We also optimized the function by returning true right away if the == methods returns true. This way, we avoid the extra work of iterating through the set.

**Rules for Equals in Java:** Overriding a `.equals()` method may sometimes be trickier than it seems. A couple of rules to adhere to while implementing your `.equals()` method are as follows:

1.) `equals` must be an equivalence relation

* **reflexive**: `x.equals(x)` is true

* **symmetric**: `x.equals(y)` if and only if `y.equals(x)`

* **transitive**: `x.equals(y)` and `y.equals(z)` implies `x.equals(z)`

2.) It must take an Object argument, in order to override the original `.equals()` method

3.) It must be consistent if `x.equals(y)`, then as long as `x` and `y` remain unchanged: `x` must continue to equal `y`

4.) It is never true for null `x.equals(null)` must be false

### Bonus video 

Create an even better `toString` method and `ArraySet.of`:

Link to the [bonus code](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/ArraySet.java)

---

## 12.5 Chapter Summary

Summary of the main points in this chapter.

You can find the code from this lecture [here](https://github.com/Berkeley-CS61B/lectureCode-sp23/tree/main/lec12_inheritance4). 

#### Exceptions

Most likely you have encountered an exception in your code such as a `NullPointerException` or an `IndexOutOfBoundsException`. Now we will learn about how we can “throw” exceptions ourselves. Here is an example of an exception that we throw:

```

throw new RuntimeException("For no reason.");

```

This is useful to ensure reasonable functioning of our code, even when facing unexpected behavior.

#### Iteration

##### Difference between Iterators and Iterables

These two words are very closely related, but have two different meanings that are often easy to confuse. The first thing to know is that these are both Java interfaces, with different methods that need to be implemented. Here is a simplified interface for Iterator:

```

public interface Iterator<T> {

  boolean hasNext();

  T next();

}

```

Here is a simplified interface for Iterable:

```

public interface Iterable<T> {

    Iterator<T> iterator();

}

```

Notice that in order for an object (for example an ArrayList or LinkedList) to be *iterable*, it must include a method that returns an *iterator*. The iterator is the object that actively steps through an iterable object. Keep this relationship and distinction in mind as you work with these two interfaces.

#### Object Methods

##### toString

The `toString()` method returns a string representation of objects. For example, `System.out.println(someObject)` calls the `toString()` method of `someObject`, and prints to console whatever string it returns. 

This is most helpful when we are debugging, as it allows us to much more easily understand the current state of our Objects.

##### == vs .equals

We have two concepts of equality in Java- “==” and the “.equals()” method. The key difference is that when using ==, we are checking if two objects have the same address in memory (that they point to the same instance or object). On the other hand, .equals() is a method that can be overridden by a class and can be used to define some custom way of determining equality. This permits the class to utilize the additional knowledge it has about itself to more accurately answer questions of equality.

For example, say we wanted to check if two stones are equal:

```

public class Stone{

  int weight;

  public Stone(int weight){

    this.weight = weight;

  }

}

Stone s = new Stone(100);

Stone r = new Stone(100);

```

If we want to consider s and r equal because they have the same weight. If we do check equality using ==, these Stones would not be considered equal because they do not have the same memory address.

On the other hand, if you override the equals method of Stone as follows

```

public boolean equals(Object o){

  return this.weight == ((Stone) o).weight

}

```

We would have that the stones would be considered equal because they have the same weight.

---

## 12.6 Exercises

#### Factual

1. What methods are required for a class that is Iterable?

2. Which of the following is true about the `java.util.Se`t and the `java.util.List` interfaces?

   * [ ] If we add `String[][]` objects to a `Set` and a `List`, the size of the set will always be less than or equal to the size of the list.

   * [ ] The `java.util.ArrayList` class is an implementation of the `java.util.List` interface.

   * [ ] The `Set` and `List` interfaces extend the `Iterator` interface.

   * [ ] The `Set` and `List` interfaces extend the `Iterable` interface.

3. Suppose we have a class that implements `Iterator`. What methods must it override in order to compile?

<details>

<summary>Problem 1</summary>

An `Iterable` is required to have the `iterator()` method, which returns an `Iterator`.

</details>

<details>

<summary>Problem 2</summary>

* **If we add `String[][]` objects to a `Set` and a `List`, the size of the set will always be less than or equal to the size of the list.** Sets only have unique items, while lists can have duplicates, so if we add the same elements to both the list will always have at least as many elements as the set.

* **The `java.util.ArrayList` class is an implementation of the `java.util.List` interface.** One implementation of the `List` interface in Java is the ArrayList class.

* **The `Set` and `List` interfaces extend the `Iterable` interface.** Sets and Lists in Java can be used in enhanced for loops, which means that they are `Iterable`.

</details>

<details>

<summary>Problem 3</summary>

An `Iterator` must override `hasNext()`, which returns a boolean indicating whether there are more elements in the `Iterator`, and `next()`, which returns the next item.

</details>

#### Conceptual

1. Why do we want to override the `.equals` method?

<details>

<summary>Problem 1</summary>

The `.equals()` method inherited from `Object` only checks if two items have the same memory address. This is undesireable behavior for many user-written classes in Java.

</details>

### Metacognitive

1. In lecture, you built the `ArraySetIterator` class. Modify the lecture class to take in a `Comparator<T>` and an item of generic type `T` called `ref` in the constructor. This new iterator should only return items greater than `T`. For reference, the code for `ArraySetIterator` is included below.

```java

private class ArraySetIterator implements Iterator<T> {

	private int pos;

	public ArraySetIterator() { 

		pos = 0; 

	}

	public boolean hasNext() { 

		return pos < size; 

	}

	public T next() {

	 	T returnItem = items[pos];

	 	pos += 1;

	 	return returnItem;

	}

}

```

2. Problem 7 from the Spring 2018 Midterm 2

<details>

<summary>Problem 1</summary>

```java

public class ArraySetGreaterIterator implements Iterator<T> {

    private int pos;

    private T ref;

    private Comparator<T> comp;

    public ArraySetGreaterIterator(T ref, Comparator<T> comp) {

        this.ref = ref;

        this.comp = comp;

    }

    @Override

    public boolean hasNext() {

        return pos < size;

    }

    @Override

    public T next() {

        T returnItem = items[pos];

        while (comp.compare(returnItem, ref) <= 0) {

            pos += 1;

            returnItem = items[pos];

        }

        return returnItem;

    }

}

```

</details>

<details>

<summary>Problem 2</summary>

[Solutions](https://drive.google.com/file/d/1LIyFXwHYCWXNqIgKTsTyKiOYnB79_ykk/view) and [walkthrough](https://www.youtube.com/watch?v=nMZn4EV0gGw) are linked here and on the course website.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：继承 III：子类型多态、Comparable 与 Comparator](/notes/cs61b/lecture-10) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：渐进分析 I：算法效率度量与大 O 阶梯 →](/notes/cs61b/lecture-12) | [🎬 在 B 站观看本讲 (P11)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11) |
