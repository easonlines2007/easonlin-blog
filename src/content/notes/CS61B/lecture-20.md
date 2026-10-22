---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 20 · 散列 II：负载因子、动态扩容与 Java HashMap 内核：负载因子 lambda、均摊 O(1)
  数学证明、可变键陷阱与工业级红黑树优化
description: CS61B 第 20 讲：散列 II：负载因子、动态扩容与 Java HashMap 内核：负载因子 lambda、均摊 O(1)
  数学证明、可变键陷阱与工业级红黑树优化
topic: CS61B
order: 20
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 4: 树结构与散列表 (Search Trees & Hashing)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:44 ｜ **官方原版**：Lecture 20 - Hashing 2  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1EGP_BWIbha4xQ4A5PJLAVIQaK6G0RbWZfrVDd0GmS08) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii)  
> **快速导航**：[← 上一讲 (P19 散列 I：哈希表原理、散列函数与碰撞解决)](/notes/cs61b/lecture-19) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P21 优先队列与二叉堆) →](/notes/cs61b/lecture-21)

---

## 1. 散列表性能分析：负载因子（Load Factor $\lambda$）的核心意义

*(参考时间：00:01:25 · [视频跳转 (P20 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=85))*

在拉链法散列表中，操作的耗时取决于链表的平均长度。

我们定义散列表最重要的运行指标——**负载因子（Load Factor $\lambda$）**：
$$\lambda = \frac{N}{M}$$
其中：
- $N$ 是当前散列表中存储的键值对总数；
- $M$ 是底层桶数组的物理长度（Bucket Count）。

### 负载因子的物理含义
$\lambda$ 代表**每个哈希桶平均挂载的链表节点个数**。
- 如果哈希函数分布足够均匀，单次查找或插入的平均耗时为：
  $$\text{Time} = \Theta(1 + \lambda) = \Theta(1 + \frac{N}{M})$$
- 如果桶数组大小固定为 $M = 10$，而我们存入了 $N = 10,000,000$ 个数据，$\lambda$ 高达一百万，哈希表将彻底退化为耗时 $\Theta(N)$ 的超长大单链表！

## 2. 动态调整容量：散列表的 Resize 扩容与二次散列（Rehashing）

*(参考时间：00:10:40 · [视频跳转 (P20 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=640))*

为了保证 $\Theta(1)$ 的瞬时性能，我们必须**将负载因子 $\lambda$ 严格锁死在一个极小的常数上限以下**（Java 官方默认阈值为 $\lambda_{\max} = 0.75$）：

> **动态扩容铁律**：  
> 当插入新元素后发现 $\frac{N}{M} > 0.75$ 时，立即将底层桶数组容量**翻倍（$M_{\text{new}} = 2M$）**！

### 为什么扩容时必须进行二次散列（Rehashing）？
初学者常常误以为只需要用 `System.arraycopy` 把旧链表拷过去。  
**这是致命的错误！**
- 因为桶下标的计算公式是 `Math.floorMod(code, M)`；
- 当 $M$ 从 4 变为 8 时，同一个对象的哈希码对 8 取模的结果与对 4 取模的结果完全不同！
- 必须将旧表中的每一个节点逐一取下，重新计算其在新容量 $2M$ 下的全新桶下标，并挂载入新桶中。

## 3. 均摊常数时间 $\Theta(1)$ 的数学证明

*(参考时间：00:19:15 · [视频跳转 (P20 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=1155))*

类似于 AList 的几何扩容，散列表的翻倍扩容工作量同样遵循等比数列：
- 偶发的一次扩容虽然需要花费 $\Theta(N)$ 遍历全表重新挂载；
- 但随后的连续插入都在非常短的链表（平均长度 $< 0.75$）中执行；
- **总均摊成本**：
  $$\text{Amortized Cost per Operation} = \frac{\Theta(N) + \Theta(N)}{N} = \Theta(1)$$
散列表在均摊意义下真正实现了梦寐以求的 **$\Theta(1)$ 查找与插入**！

## 4. 经典工业级陷阱：使用可变对象（Mutable Objects）作为 Key 的灾难

*(参考时间：00:27:00 · [视频跳转 (P20 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=1620))*

这是全 Java 工业界最惨烈的隐形 Bug 根源之一：**千万不要使用状态可变的对象作为 HashMap 的键或 HashSet 的元素！**

### 惊心动魄的蒸发惨剧
```java
List<String> keyList = new ArrayList<>();
keyList.add("Berkeley");

Map<List<String>, Integer> map = new HashMap<>();
map.put(keyList, 100);

System.out.println(map.containsKey(keyList)); // 输出 true，完美找到

// 致命突变：在外部修改了该 List 的内部状态！
keyList.add("Cal");

// 诡异事件发生：同一个对象，竟然找不到了！
System.out.println(map.containsKey(keyList)); // 输出 false！数据人间蒸发！
```

### 为什么数据会人间蒸发？
1. 当我们 `put` 时，JVM 根据当时的 `keyList` 内容（仅包含 "Berkeley"）计算出哈希码（假设为 105），并将其放入 105 号桶；
2. 随后外部向 `keyList` 中追加了 "Cal"，其内容发生变化，导致其 `hashCode()` 重新计算后变为了 999；
3. 当执行 `map.containsKey(keyList)` 时，HashMap 根据新哈希码 999 直奔 999 号桶，发现那里空空如也，直接断定键不存在！
4. 而原先存入的键值对依然静静躺在 105 号桶里，成为了系统永远无法检索、也无法通过常规手段删除的“幽灵僵尸内存”！

> **黄金法则**：在 HashMap 中做 Key 的对象，**必须保证其参与哈希计算的所有字段在生命周期内绝对不可变（Immutable）**！最理想的 Key 是 `String` 或 `Integer`。

## 5. 工业级深度剖析：Java 8 HashMap 树化优化（Treeification）

*(参考时间：00:35:30 · [视频跳转 (P20 00:35:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2130))*

在 Java 7 及以前，HashMap 的每个桶纯粹由单向链表构成。如果在遇到恶意伪造哈希碰撞攻击（Hash Collision DoS）时，大量键被故意聚集在同一个桶中，查询性能会从 $O(1)$ 瞬间暴跌到 $O(N)$。

Java 8 做出了划时代的重大工业优化：
- **树化阈值（Treeify Threshold = 8）**：当单个哈希桶内的链表长度超过 8 时，JVM 会自动将该单向链表就地**转化为一棵自平衡红黑树（Red-Black Tree）**！
- 这一机制保证了即使发生极端最坏的哈希碰撞，单桶内部的查找性能最差也不会超过 **$O(\log N)$**，彻底封死了 DoS 攻击漏洞。

## 6. 本讲小结与课后自测

*(参考时间：00:43:00 · [视频跳转 (P20 00:43:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2580))*

### 课后综合自测题
`java.util.TreeMap` 与 `java.util.HashMap` 应该如何选型？  
**对比决策**：  
- 如果需要数据天然保持大小排序、需要按范围查询（如找大于 50 的所有项）、或者对象的键无法计算优秀的哈希码：选择基于红黑树的 **`TreeMap`**（稳定 $O(\log N)$）；  
- 如果只需要单点精准查找与极速读写：选择 **`HashMap`**（均摊 $O(1)$）。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 20. Hashing II

By Mihir Mirchandani and William Lee

---

## 20.1 Hash Table Recap, Default Hash Function

"The whole point is that we have a bunch of lists that are all short." - Professor Hug.

Hash Table Recap, Default Hash Function



Let's continue understanding Hashing. We've now seen implementations for sets and maps.

1. Red-Black Based Tree Approach: TreeSet/TreeMap

   • requires the items to be comparable (the notion of less or greater than)

   • logarithmic time complexity

2. HashTable based approach: HashSet/HashMap

   • constant time operations if the hashCode spreads the item nicely (few collisions)

Recall that with a hash table, the idea is that for any piece of data, like a String (or any other type of object) we want to store in our hash table, we need to turn this into a number called a hash code. So a string like "Mihir" can be converted to -2101281024. 

**补充说明**

Fun Fact: And that integer is anything between about negative two billion and about two billion, the space of all Java Integers. This range yields about 4 billion integers or 2^32 integers. If you are interested in why this is the case, please take CS 61C!



Once we have our number, we want to convert this number to our bucket number (i.e. which of the many linked lists I want to add this new entry to). In the first example, we will use the`Math.floorMod(x, 4)`, since the length of the underlying buckets array has length 4.

If we take the converted hash code for "Mihir", -2101281024, and then mod this by 4, we get 0. This reduces our hash code, -2101281024 to a valid index, 0. This means that we would use the 0th bucket to place our data, "Mihir", in our LinkedList at the 0th bucket.

> You can essentially think of Java HashTables as just an array of LinkedLists categorized under bucket labels and hopefully have better performance by utilizing these LinkedLists. 

But how many LinkedLists/Buckets should we use? This is an important question, because as we insert more and more items into our buckets, the length of the LinkedLists will inevitably grow, which in turn compromises the runtime for the hash table's operations. 

For example, let's say we inserted strings like "Mihir", "Mirchandani", "loves", and "61B", all of which yielded hash codes that were divisible by 4. In this case, all strings would be put into the 0th index bucket and all strings would be inserted into the same LinkedList. What happens to the runtime for a search operation? Well, we would have to search through an entire LinkedList to look up our data! This runs in linear time and is too slow for HashMap's famous title of holding fast lookup times.

Last time, we saw that we can have a variable number of LinkedLists. The idea is that we resize that array of linked lists whenever the load factor (N/M, where N is the number of elements in our table and M is the number of buckets) exceeds some constant. Java picks 0.75 as we'll see later. This prevents collisions from happening too frequently. So long as our items are spread out nicely, between the buckets, the LinkedLists at each bucket for the most part have a very small size, which means we'll on average get constant run time! 

Example: If the HashTable has load factor 3, and our `hashCode()` function spreads out the entries evenly, we are going to end up with just 3 items per bucket, and our search operation takes $$\Theta(1)$$time. 

#### Comparing Data Structure Run Times! 

|                                               | contains(x) | add(x)   |

| --------------------------------------------- | ----------- | -------- |

| Bushy BSTs                                    | Θ(log N)    | Θ(log N) |

| Separate Chaining Hash Table with NO resizing | Θ(N)        | Θ(N)     |

| Separate Chaining Hash Table with resizing    | Θ(1)        | Θ(1)     |

---

## 20.2 Distribution By Other Hash Functions

HashMaps/Tables have fast lookup times, but behind that "superpower" is a hash function.

Distribution by other Hash Functions



Suppose our `hashCode()` implementation simply returns 0.

```

@Override

public int hashCode() {

    return 0;

}

```

<details>

<summary>What distribution do we expect?</summary>

We would expect all of the items in our Hash Table to be in bucket 0. As we discussed in the [previous section](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.1-hash-table-recap-default-hash-function), our Hash Table would place all elements in the 0th bucket because the hashCode tells it to. In the 0th bucket, there will be a LinkedList of all elements from the data yielding a very inefficient linear lookup time compared to the constant time we are expecting. No matter what key we provide, our hashCode always tells the HashMap to only add to the 0th bucket which is why we get this long LinkedList. So what do we do to make sure we get constant lookup time? We use a better hash function!

</details>

In order to get a more even distribution, what we can do is something to what we tried in the [previous section](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.1-hash-table-recap-default-hash-function) where we utilize modulo. Let's say that we define the size of our Hash Table to have 4 buckets. This means it has 4 corresponding LinkedLists and 4 bucket indices labeled {0, 1, 2, 3}. The modding is not required in our `hashCode()` function as it is being done for us in the hash table to guarantee we can add to that bucket. As we said the hash code could really be any integer in the range of 4 billion unique values!

By using modulo, we ensure that our hashcode yields a number that can be represented as an index and clearly identifies which LinkedList to add to. Additionally, when adding a series of numbers at once, we see that we get an even distribution of numbers in our LinkedList yielding a constant lookup time.

```

@Override

public int hashCode() {

    return num;

}

```

This hash function should yield a much more even distribution! Objects with different `num` will now be more spread out across the buckets instead of all living in the 0th bucket. If our class does not explicitly override the `hashCode()` function, Java will use the default implementation, which returns the object's address in memory as its hash code!

### Why Bother With Custom Hash Functions?

Let's discuss if the default hashCode function is a good hashCode function! It actually is a good spread as it relies on the fact that different objects will live in different places in the memory, and the memory address is effectively random. We will get a good distribution, since objects are basically assigned random indices to insert into the hash table.

This really raises an interesting question: why do we care about other custom hash functions when the default hashcode gets good spread? We'll read about this in the [next section.](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.3-contains-and-duplicate-items) 

---

## 20.3 Contains & Duplicate Items

### Contains

#### The `equals()` Method for a ColoredNumber Object

Suppose the `equals()` method for ColoredNumber is as below, i.e. two ColoredNumbers are equal if they have the same num.

```java

@Override

public boolean equals(Object o) {

   if (o instanceof ColoredNumber otherCn) {

       return this.num == otherCn.num;

   }

   return false;

}

```

#### HashSet Behavior for Checking `contains()`

Suppose the `equals()` method for ColoredNumber is on the previous slide, i.e. two ColoredNumbers are equal if they have the same num. 

```java

int N = 20;

HashSet<ColoredNumber> hs = new HashSet<>();

for (int i = 0; i < N; i += 1) {

    hs.add(new ColoredNumber(i));

}

```

Suppose we now check whether 12 is in the hash table.

```java

ColoredNumber twelve = new ColoredNumber(12);

hs.contains(twelve); //returns true

```

**补充说明**

What do we **expect** to be returned by `contains`?



<details>

<summary>Answer</summary>

We expect the `contains` call to be true, all `12`s are created equal!

</details>

#### Finding an Item Using the Default Hashcode

Suppose we are using the default hash function (uses memory address):

```java

int N = 20;

HashSet<ColoredNumber> hs = new HashSet<>();

for (int i = 0; i < N; i += 1) {

   hs.add(new ColoredNumber(i));

}

ColoredNumber twelve = new ColoredNumber(12);

hs.contains(twelve); // returns ??

```

which yields the table below:

![](https://lh4.googleusercontent.com/cFvLVhOYg31lSg1a8moftrr30qpThw3Bc7drJWVLNrSTCgTdO4yxjis1epmRlRMLWIkh73alL6OrblQxqGGrjMo1XMoOfPjSFH3tPDDbaxSbLXe1-HXJcfQOglsU4Dp74PiDDqMWXNOmYeQu_D7-l_B2SBcdTVohYMYLZdnzzMVn8_hAbvSKDAKyC-_ev3nN=s2048)

Suppose equals returns true if two ColoredNumbers have the same num (as we've defined previously).

**补充说明**

What is actually returned by `contains`?



<details>

<summary>Answer</summary>

Returns false with probability 5/6ths.

Default `hashCode()` is based on memory address. equals is based on `num`.

There are two ColoredNumber objects with `num = 12`. One of them is in the HashSet and one of them was created by the code above.

Each memory address is random, with only a 1/6th chance they modulo to the same bucket.

Example: If the `ColoredNumber` object `twelve` created by the code above is in memory location 6000000, its hashCode % 6 is 0. HashSet looks in bucket zero, and doesn't find 12.

</details>

**补充说明**

Hard Question: If the default hash code achieves a good spread, why do we even bother to create custom hash functions? 



<details>

<summary>Answer</summary>

It is necessary to have consistency between `equals()` and `hashCode()` for the hash table's operations to function.

</details>

**Basic rule (also definition of deterministic property of a valid hashcode):** If two objects are equal, they **must** have the same hash code so the hash table can find it.

### Duplicate Values

#### Overriding `equals()` but Not `hashCode()`

Suppose we have the same `equals()` method (comparing `num`), but we do not override `hashCode()`.

```java

public boolean equals(Object o) {

   ...  return this.num == otherCn.num; ...

}

```

The result of adding 0 through 19 is shown below:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F4fu6DoHEV2cHF676lazQ%2Fimage.png?alt=media\&token=b0930dfa-44c0-4f39-8628-219ad789f1ee)

```java

ColoredNumber zero = new ColoredNumber(0);

hs.add(zero); // does another zero appear?

```

**补充说明**

Which can happen when we call add(zero)?

Answer Choices:

1. We get a 0 to bin zero.

2. We add another 0 to bin one.

3. We add a 0 to some other bin.

4. We do not get a duplicate zero

   

<details>

<summary>Answer </summary>

3 Choices are Correct: 

\#1, #3, #4.

We get a 0 to bin zero, We add a 0 to some other bin, and we do not get a duplicate zero.

The new zero ends up in a random bin.

* 5/6ths chance: In bin 0, 2, 3, 4, or 5. Duplicate!

* 1/6 chance: In bin 1, no duplicate! (`equals()` blocks it)

</details>

### Key Takeaway: `equals()` and `hashCode()`

Bottom line: If your class override equals, you should also override hashCode in a consistent manner.

* If two objects are equal, they must always have the same hash code.<br>

If you don’t, everything breaks:

* `Contains` can’t find objects (unless it gets lucky).

* `Add` results in duplicates.

---

## 20.4 Mutable vs. Immutable Types

### Immutable Data Types

An immutable data type is one for which an instance cannot change in any observable way after instantiation.

Examples:

* Mutable: ArrayDeque, Percolation.

* Immutable: Integer, String, Date.

```java

public class Date {

   public final int month;

   public final int day;

   public final int year;

   private boolean contrived = true;

   public Date(int m, int d, int y) {

       month = m; day = d; year = y;

   }

}

```

The `final` keyword will help the compiler ensure immutability.

* `final` variable means you may assign a value once (either in the constructor of the class or in the initializer), but after it can never change.

* `final` is neither sufficient nor necessary for a class to be immutable.

#### Advantages vs. Disadvantages of Immutability:

Advantage: Less to think about; avoids bugs and makes debugging easier.

* Analogy: Immutable classes have some buttons you can press / windows you can look inside. Results are ALWAYS the same, no matter what.

Disadvantage: Must create a new object anytime anything changes.

* Example: String concatenation is slow!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxntDEehjkP4E4EE6wmqz%2Fimage.png?alt=media&amp;token=690427cc-9f86-478f-81fa-323eac3d2268" alt=""><figcaption></figcaption></figure>

### Mutable Types

#### **Mutable HashSet Keys**

In principle, we can create a HashSet\<List>.

Weird stuff happens if:

* We insert a List into a HashSet.

* We later mutate that List.

**Key Point**: Never mutate (modify) an object being used as a key. Incorrect results arise, and the item gets lost. [The slides for the Hashing II Lecture ](https://docs.google.com/presentation/d/1U_-RQCJB3j9B-k-kY8I4nS-FuxIvO8EgVIrOthx2InU/edit#slide=id.g2165b69ef3f_0_291)provide a very thorough visual example of this point.

#### Actual Implementation of HashSet/Map in Java

In this last section, Professor Hug gives a quick walkthrough of the code for HashSets and HashMaps in Java's official implementation.


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：散列 I：哈希表原理、散列函数与碰撞解决](/notes/cs61b/lecture-19) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：优先队列与二叉堆 →](/notes/cs61b/lecture-21) | [🎬 在 B 站观看本讲 (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) |
