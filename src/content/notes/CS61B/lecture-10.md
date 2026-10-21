---
title: Lecture 10 · 继承 III：子类型多态、Comparable 与 Comparator：子类型多态机制、自然排序契约与外部比较策略解耦
description: CS61B 第 10 讲：继承 III：子类型多态、Comparable 与 Comparator：子类型多态机制、自然排序契约与外部比较策略解耦
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 10
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 2: 继承与面向对象体系 (Inheritance, Interfaces & Subtyping)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:50 ｜ **官方原版**：Lecture 10 - Inheritance III Subtype Polymorphism Comparators Comparable  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1WpISEkGajVCwARZy6w-XDF5sofm1cITUhfAlPUnnnos) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/11.-subtype-polymorphism-comparators-comparable)  
> **快速导航**：[← 上一讲 (P09 继承 II：实现继承、类型转换与高阶函数)](/notes/cs61b/lecture-09) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P11 继承 IV：迭代器模式与 Object 核心规范) →](/notes/cs61b/lecture-11)

---

## 1. 多态的双重视野：显式高阶函数 vs 子类型多态

*(参考时间：00:02:10 · [视频跳转 (P10 00:02:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=130))*

在函数式编程语言（如 Python / Scheme）中，编写通用比较算法通常直接传递一个比较函数对象（显式高阶函数）。  
而在面向对象范式中，解决此类问题的经典武器是**子类型多态（Subtype Polymorphism）**：
> 编写一个操作超类型对象（如 `Comparable`）的高层算法，使得该算法无需感知具体子类型的细节，就能直接适用未来派生出的任意全新对象！

## 2. 寻找最大者：为什么对象不能直接使用 > 运算符

*(参考时间：00:11:30 · [视频跳转 (P10 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=690))*

考虑编写一个通用的 `max(Object[] items)` 函数：

```java
public static Object max(Object[] items) {
    int maxDex = 0;
    for (int i = 0; i < items.length; i++) {
        // if (items[i] > items[maxDex]) { ... } // 编译绝对报错！
    }
}
```

Java 中原始数值类型可以使用 `>`, `<`, `==`，但对象引用变量如果直接比较大小，编译器完全不知道“两本书”或“两只狗”谁更大。我们必须为具备可比性的对象确立标准接口。

## 3. Comparable 接口与自然排序契约

*(参考时间：00:22:45 · [视频跳转 (P10 00:22:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=1365))*

Java 标准库提供了 `java.lang.Comparable<T>` 泛型接口：

```java
public interface Comparable<T> {
    /**
     * 将当前对象与传入对象比较
     * 返回负数：this < o
     * 返回零值：this.equals(o)
     * 返回正数：this > o
     */
    int compareTo(T o);
}
```

让 `Dog` 类实现自然大小比较：
```java
public class Dog implements Comparable<Dog> {
    private String name;
    private int size;

    @Override
    public int compareTo(Dog other) {
        return this.size - other.size;
    }
}
```

通用极值求解算法实现：
```java
public static Comparable max(Comparable[] items) {
    int maxDex = 0;
    for (int i = 0; i < items.length; i++) {
        if (items[i].compareTo(items[maxDex]) > 0) {
            maxDex = i;
        }
    }
    return items[maxDex];
}
```

## 4. Comparator 比较器：策略模式与多维排序

*(参考时间：00:33:50 · [视频跳转 (P10 00:33:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2030))*

`Comparable` 虽然优雅，但存在一个严重的局限性：**每个类只能实现一次 `compareTo`，定义出一种固定的“自然排序（Natural Order）”**。

如果某些业务场景需要按 `name` 字母序排狗，另外的场景需要按 `age` 排，该怎么办？  
答案是使用策略模式：引入外部比较器接口 **`java.util.Comparator<T>`**！

```java
import java.util.Comparator;

public class Dog implements Comparable<Dog> {
    // 自然排序按 size
    @Override
    public int compareTo(Dog other) { return this.size - other.size; }

    // 提供静态内部比较器：按名字字典序比较
    private static class NameComparator implements Comparator<Dog> {
        @Override
        public int compare(Dog a, Dog b) {
            return a.name.compareTo(b.name);
        }
    }

    public static Comparator<Dog> getNameComparator() {
        return new NameComparator();
    }
}
```

调用时自由切换排序维度：
```java
Comparator<Dog> nc = Dog.getNameComparator();
if (nc.compare(dogA, dogB) > 0) { ... }
```

## 5. 本讲小结与接口对比速查

*(参考时间：00:46:00 · [视频跳转 (P10 00:46:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2760))*

| 维度 | `Comparable<T>` | `Comparator<T>` |
| :--- | :--- | :--- |
| **所属包** | `java.lang` | `java.util` |
| **设计定位** | 类自身的“内部自然排序” | 外部独立的“排序策略对象” |
| **核心方法** | `int compareTo(T o)` (一元操作，this 与 o 比) | `int compare(T o1, T o2)` (二元操作，比两个对象) |
| **修改要求** | 必须修改目标类的源代码实现接口 | 无需修改原类代码，外部按需随时创建 |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：继承 II：实现继承、类型转换与高阶函数](/notes/cs61b/lecture-09) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：继承 IV：迭代器模式与 Object 核心规范 →](/notes/cs61b/lecture-11) | [🎬 在 B 站观看本讲 (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) |
