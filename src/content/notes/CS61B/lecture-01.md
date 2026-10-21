---
title: Lecture 01 · 课程导论与 Java 初探：面向对象、静态类型与编译执行模型
description: CS61B 第 1 讲：课程导论与 Java 初探：面向对象、静态类型与编译执行模型
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 1
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 1: Java 语言基石与链表结构 (Java Fundamentals & Lists)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：48:50 ｜ **官方原版**：Lecture 1 - Introduction  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P1)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/19NEzpJJ-a0lI-tdz9yC1kP-8Apt2oZm-918IsDiqgYQ) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/1.-introduction)  
> **快速导航**：<span>上一讲：无（第一讲）</span> ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P02 类与对象的定义与使用) →](/notes/cs61b/lecture-02)

---

## 1. CS 61B 课程愿景与学习目标

*(参考时间：00:01:15 · [视频跳转 (P01 00:01:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1&t=75))*

本课程是加利福尼亚大学伯克利分校（UC Berkeley）计算机科学系列核心课程的核心组成部分。承接 CS 61A 所建立的抽象思维与程序设计基础，CS 61B 的核心聚焦点转移到**“如何编写高质量、大规模且运行高效的软件”**。

在课程开篇，主讲教师将 61B 的教学目标精炼概括为两大支柱：
1. **编写运行高效的代码（Writing code that runs efficiently）**：
   - 掌握经典数据结构（链表、树、散列表、优先队列、图等）；
   - 掌握算法设计与分析（渐进时间复杂度、分治、贪心、动态规划思想）；
   - 理解空间与时间之间的经典权衡（Space-Time Trade-off）。
2. **高效地编写工程级代码（Writing code efficiently）**：
   - 掌握工程级软件工具链（git 版本控制、IntelliJ IDEA 工业级集成开发环境、JUnit 自动化单元测试框架）；
   - 掌握模块化设计原则与设计模式，具备组织数千行规模代码的工程架构能力；
   - 掌握大型代码库的调试与排错方法论。

> **编者说明**：课程虽然以 Java 语言展开，但 Java 本身并不是本课程的核心目的。Java 是一门工业界广泛验证、拥有强静态类型系统与现代垃圾回收机制的语言，能够严谨呈现内存指针、类型多态与封装边界。

## 2. Java 语言特性：静态类型与编译模型

*(参考时间：00:09:40 · [视频跳转 (P01 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1&t=580))*

与 Python 动态类型解释执行机制截然不同，Java 是一门**强类型、静态检查、编译与虚拟机解释执行相结合**的语言。

### 静态类型（Static Typing）的本质
在 Java 中，每一个变量、表达式和字面量都必须在编译期确定其数据类型，且类型一旦声明便不可更改：

```java
int count = 10;
// count = "hello"; // 编译错误：类型不兼容！
```

静态类型系统在编译器层面构筑了坚固的第一道防线，能够在程序正式运行前捕获绝大部分类型不匹配与笔误错误。

### 编译与虚拟机执行流
Java 源码不会直接编译为特定 CPU 架构的机器码，而是先通过 `javac` 编译器编译为平台无关的**字节码（Bytecode, `.class` 文件）**，再由**Java 虚拟机（JVM）**加载并解释/即时编译（JIT）执行：

```mermaid
graph LR
    A["Hello.java (源码)"] -->|"javac 编译器"| B["Hello.class (字节码)"]
    B -->|"JVM (Mac / Linux / Windows)"| C["机器指令 & 硬件执行"]
```

这一架构完美实现了 Java 著名的哲学口号：“一次编写，到处运行（Write Once, Run Anywhere）”。

## 3. 第一个 Java 程序：Hello World 剖析

*(参考时间：00:18:25 · [视频跳转 (P01 00:18:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1&t=1105))*

Java 的所有代码逻辑都必须从属于某一个类（Class），没有全局裸露的函数或变量。我们从最基础的控制台打印程序切入：

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

每个关键字都承载着严格的语言规范：
- `public class HelloWorld`：定义一个公开类。**铁律**：Java 源码文件名必须与文件内的公开类名完全一致（即 `HelloWorld.java`）。
- `public static void main(String[] args)`：程序的唯一标准入口方法。
  - `public`：允许 JVM 外部调用；
  - `static`：无需实例化该类即可由运行时直接启动；
  - `void`：该方法不返回任何值；
  - `String[] args`：接收终端启动时传入的命令行字符串数组。
- `System.out.println(...)`：标准输出流打印并在末尾自动换行。

在终端中执行此程序的标准两步工作流：
```bash
javac HelloWorld.java    # 编译源码生成 HelloWorld.class
java HelloWorld          # 启动 JVM 执行主类
```

## 4. 基础控制结构：变量、循环与方法定义

*(参考时间：00:29:10 · [视频跳转 (P01 00:29:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1&t=1750))*

讲师通过计算和打印数值的经典案例演示了 Java 的基础流程控制：

```java
public class HelloNumbers {
    public static void main(String[] args) {
        int x = 0;
        int total = 0;
        while (x < 10) {
            total = total + x;
            System.out.print(total + " ");
            x = x + 1;
        }
        System.out.println();
    }
}
```

### 独立方法的抽取与签名定义
与 Python 的 `def larger(x, y):` 相比，Java 方法必须严格声明返回类型与形参类型：

```java
public class LargerDemo {
    /** 返回两个整数中的较大者 */
    public static int larger(int x, int y) {
        if (x > y) {
            return x;
        }
        return y;
    }

    public static void main(String[] args) {
        System.out.println(larger(5, 10)); // 输出 10
    }
}
```

> **编者说明**：静态方法中的 `public static` 标识着这是一个属于类本身的独立工具方法，在第 2 讲深入面向对象之前，我们所定义的所有辅助函数都暂时带有 `static` 修饰符。

## 5. 本讲小结与课后自检

*(参考时间：00:43:00 · [视频跳转 (P01 00:43:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1&t=2580))*

| 核心概念 | 要点总结 |
| :--- | :--- |
| **编译机制** | 源码 `.java` 经 `javac` 转化为字节码 `.class`，由 JVM 执行 |
| **静态强类型** | 所有变量使用前必须显式声明类型，编译期进行严格类型安全检查 |
| **类封装** | 所有可执行代码与函数必须依附于 class，文件名需与 public 类名保持一致 |
| **主函数入口** | `public static void main(String[] args)` 是标准的虚拟机运行入口 |

**自检思考题**：
1. 为什么 Java 要在编译器与底层操作系统之间引入一层 JVM 字节码架构？这种设计带来了哪些利弊？
2. 如果把 `larger` 方法中的 `int x, int y` 改为浮点数，Java 编译器会做出什么反应？如何支持不同类型参数的比较？

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| 第一讲 | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：类与对象的定义与使用 →](/notes/cs61b/lecture-02) | [🎬 在 B 站观看本讲 (P01)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=1) |
