---
title: Lecture 08 · 继承 I：接口继承与默认方法：方法重载的局限、接口契约与 @Override 规范
description: CS61B 第 8 讲：继承 I：接口继承与默认方法：方法重载的局限、接口契约与 @Override 规范
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 8
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 2: 继承与面向对象体系 (Inheritance, Interfaces & Subtyping)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：49:47 ｜ **官方原版**：Lecture 8 - Inheritance I  Interface and Implementation Inheritance  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P8)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1LxnOVy_k13llkePdQIdBrZ5jEpgRmbrvMilD-ppRjlc) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/9.-inheritance-i-interface-and-implementation-inheritance)  
> **快速导航**：[← 上一讲 (P07 列表 IV：泛型支持与动态数组 AList)](/notes/cs61b/lecture-07) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P09 继承 II：实现继承、类型转换与高阶函数) →](/notes/cs61b/lecture-09)

---

## 1. 抽象层级危机：重复代码与方法重载

*(参考时间：00:02:15 · [视频跳转 (P08 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8&t=135))*

在前面的课程中，我们分别独立实现了基于链表的 `SLList` 和基于动态数组的 `AList`。  
假设我们现在需要编写一个工具函数，打印任意列表的前缀内容：

```java
public static void printPrefix(SLList list) { ... }
public static void printPrefix(AList list) { ... }
```

这种依赖**方法重载（Method Overloading）**的方案存在严重的工程缺陷：
1. **代码冗余**：两份方法内部的算法逻辑完全相同，却必须因为参数类型不同而机械性复制粘贴；
2. **难以扩展**：如果我们后续开发了循环链表、双向链表或跳表，就必须为每一种全新容器重复编写重载方法！

根本原因在于：**程序缺乏对“列表（List）”这一通用行为特征的高层抽象！**

## 2. 接口定义：List61B<Item> 契约

*(参考时间：00:12:40 · [视频跳转 (P08 00:12:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8&t=760))*

Java 提供了**接口（Interface）**机制来定义抽象的行为规格。接口只关注“**能做什么（What to do）**”，而不关心底层具体的物理存储细节（“**怎么做 How to do it**”）。

```java
public interface List61B<Item> {
    void addFirst(Item x);
    void addLast(Item x);
    Item getFirst();
    Item getLast();
    Item get(int i);
    int size();
    Item removeLast();
}
```

接口中声明的方法默认是 `public abstract` 的。它就像一份具有法律效力的技术合同：任何声称自己是 `List61B` 的类，都必须如实实现其中列出的所有方法。

## 3. 接口实现（implements）与抽象屏障

*(参考时间：00:23:10 · [视频跳转 (P08 00:23:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8&t=1390))*

让 `AList` 和 `SLList` 实现该契约：

```java
public class AList<Item> implements List61B<Item> {
    // 必须实现 List61B 中声明的所有方法，否则无法通过编译！
}

public class SLList<Item> implements List61B<Item> {
    // 同样实现全部接口方法
}
```

### 抽象多态的威力
现在，我们的前缀打印方法只需要面向**高层抽象接口 `List61B`** 编程即可：

```java
public static void printPrefix(List61B<String> list) {
    for (int i = 0; i < Math.min(3, list.size()); i++) {
        System.out.println(list.get(i));
    }
}
```
无论是传入 `AList` 还是 `SLList`，该方法都能完美无缝运行！

## 4. 默认方法（default）与 @Override 注解

*(参考时间：00:34:25 · [视频跳转 (P08 00:34:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8&t=2065))*

从 Java 8 开始，接口允许通过 `default` 关键字提供通用默认实现，直接实现**实现继承（Implementation Inheritance）**：

```java
public interface List61B<Item> {
    // ... 核心抽象方法 ...

    /** 提供全量通用的默认打印实现 */
    default void print() {
        for (int i = 0; i < size(); i++) {
            System.out.print(get(i) + " ");
        }
        System.out.println();
    }
}
```

如果子类具有更高效的特化实现（例如链表顺序遍历打印避免多次调用 `get(i)`），子类可以显式覆写该方法：

```java
public class SLList<Item> implements List61B<Item> {
    @Override
    public void print() {
        // 利用链表节点指针直接遍历，时间复杂度仅为 O(N)，无需反复 O(N^2) 寻址！
        for (Node p = sentinel.next; p != null; p = p.next) {
            System.out.print(p.item + " ");
        }
        System.out.println();
    }
}
```

> **编者说明（为什么必须写 @Override 注解？）**：  
> `@Override` 是给编译器看的提示标签。如果不小心拼错方法名（如写成了 `pritn()`），加上注解编译器会立即标红报错，避免静默引入无法覆写默认行为的隐蔽 Bug。

## 5. 本讲小结与设计哲学

*(参考时间：00:45:50 · [视频跳转 (P08 00:45:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8&t=2750))*

| 特性 | 说明 |
| :--- | :--- |
| **接口继承 (Interface Inheritance)** | 继承方法签名契约，强调外部视角“是一个（Is-a）”的关系 |
| **实现继承 (Implementation Inheritance)** | 继承默认可执行逻辑，消除子类通用功能的重复代码 |
| **面向接口编程** | 方法入参与返回值优先声明为顶层接口类型，提升系统解耦度 |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：列表 IV：泛型支持与动态数组 AList](/notes/cs61b/lecture-07) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：继承 II：实现继承、类型转换与高阶函数 →](/notes/cs61b/lecture-09) | [🎬 在 B 站观看本讲 (P08)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=8) |
