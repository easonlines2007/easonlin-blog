---
title: Lecture 09 · 继承 II：实现继承、类型转换与高阶函数：extends 机制、构造链 super()、动态方法选择与强转
description: CS61B 第 9 讲：继承 II：实现继承、类型转换与高阶函数：extends 机制、构造链 super()、动态方法选择与强转
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 9
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 2: 继承与面向对象体系 (Inheritance, Interfaces & Subtyping)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:35 ｜ **官方原版**：Lecture 9 - Inheritance II Extends Casting Higher Order Functions  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P9)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1jVqC44HVViVtajnF18KsZ6MdIfseTfOSerfvxH4pzP0) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/10.-inheritance-ii-extends-casting-higher-order-functions)  
> **快速导航**：[← 上一讲 (P08 继承 I：接口继承与默认方法)](/notes/cs61b/lecture-08) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P10 继承 III：子类型多态、Comparable 与 Comparator) →](/notes/cs61b/lecture-10)

---

## 1. 实现继承与 extends 关键字

*(参考时间：00:02:30 · [视频跳转 (P09 00:02:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9&t=150))*

接口主要解决**行为契约**的共享，而类与类之间的**实现继承（Class-Level Implementation Inheritance）**通过 `extends` 关键字实现。子类自动继承父类所有的公有与受保护成员变量和方法。

```java
public class RotatingSLList<Item> extends SLList<Item> {
    /** 将链表末尾元素旋转至最前端 */
    public void rotateRight() {
        Item x = removeLast();
        addFirst(x);
    }
}
```

通过简单的几行代码，`RotatingSLList` 瞬间拥有了 `SLList` 所有的已有功能，同时扩展了全新的业务能力。

## 2. 构造函数链与 super() 调用

*(参考时间：00:13:10 · [视频跳转 (P09 00:13:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9&t=790))*

对象的构建必须遵从自顶向下的严格顺序：**子类对象在初始化自身特有状态前，必须先完成父类状态的构造！**

在 Java 中，如果子类构造函数没有显式调用 `super(...)`，编译器会在第一行自动插入无参构造调用 `super()`：

```java
public class VengefulSLList<Item> extends SLList<Item> {
    private SLList<Item> deletedItems;

    public VengefulSLList() {
        super(); // 显式或隐式调用父类构造函数
        deletedItems = new SLList<>();
    }

    @Override
    public Item removeLast() {
        Item x = super.removeLast(); // 调用父类的原生移除逻辑
        deletedItems.addLast(x);     // 记录被删除的复仇元素
        return x;
    }
}
```

## 3. 编译期类型（Static Type）vs 运行期类型（Dynamic Type）

*(参考时间：00:25:20 · [视频跳转 (P09 00:25:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9&t=1520))*

理解多态运行机制的核心钥匙在于厘清变量的两种类型：

```java
SLList<Integer> sl = new VengefulSLList<>();
```

1. **编译期类型（Static Type / Compile-Time Type）**：  
   变量在声明时的类型（此处为 `SLList<Integer>`）。编译器只根据编译期类型检查方法调用的合法性！
2. **运行期类型（Dynamic Type / Run-Time Type）**：  
   内存中被实例化的真实对象类型（此处为 `VengefulSLList`）。实际执行哪个覆写方法完全由运行期类型决定！

### 动态方法选择（Dynamic Method Selection）
当执行 `sl.removeLast()` 时：
- **编译阶段**：编译器检查静态类型 `SLList` 是否存在 `removeLast()` 方法，验证通过；
- **运行阶段**：JVM 探查到 `sl` 实际指向 `VengefulSLList` 实例，因此动态派发并执行 `VengefulSLList` 中覆写后的版本！

## 4. 类型强制转换（Casting）与安全性

*(参考时间：00:36:40 · [视频跳转 (P09 00:36:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9&t=2200))*

假设子类有一个特有方法 `printLostItems()`，通过父类引用变量是无法直接调用的：

```java
SLList<Integer> sl = new VengefulSLList<>();
// sl.printLostItems(); // 编译错误！SLList 类型中没有此方法！
```

通过显式类型强制转换（Casting），我们命令编译器信任该引用的真实类型：
```java
VengefulSLList<Integer> vsl = (VengefulSLList<Integer>) sl;
vsl.printLostItems(); // 编译通过并正常执行！
```

> **编者警示（ClassCastException 风险）**：  
> 强转并不改变堆中的实际对象。如果对一个真正的普通 `SLList` 对象执行强转为 `VengefulSLList`，编译期不会报错，但运行瞬间必定触发 `ClassCastException` 崩溃！在必须强转时，应先使用 `instanceof` 进行安全校验。

## 5. 本讲小结与高阶函数启示

*(参考时间：00:46:15 · [视频跳转 (P09 00:46:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9&t=2775))*

- **复用法则**：优先通过组合（Composition）建立系统关系，当且仅当存在严密的 `Is-a` 逻辑且需要多态时才采用 `extends`；
- **多态铁律**：编译器检查静态类型，虚拟机派发运行动态类型；
- **高阶函数模型**：在 Java 语言中，函数无法作为裸露的一等公民传递，通常通过定义单方法接口（函数式接口）来传递行为策略。

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：继承 I：接口继承与默认方法](/notes/cs61b/lecture-08) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：继承 III：子类型多态、Comparable 与 Comparator →](/notes/cs61b/lecture-10) | [🎬 在 B 站观看本讲 (P09)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=9) |
