---
title: Lecture 34 · 软件工程 III：技术伦理与经典设计模式：软件危害清单、成瘾性架构反思与工厂/策略/装饰器模式
description: CS61B 第 34 讲：软件工程 III：技术伦理与经典设计模式：软件危害清单、成瘾性架构反思与工厂/策略/装饰器模式
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 34
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：54:00 ｜ **官方原版**：Lecture 34 - Software Engineering III  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P34)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1nE_oD8Mx6tRcO6zOnz7KbSxCtaZpaoDlcPhKzfNXrqI/edit?usp=sharing) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/33.-software-engineering-iii)  
> **快速导航**：[← 上一讲 (P33 排序 IV：比较排序的理论下界证明)](/notes/cs61b/lecture-33) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P35 排序 V：基数排序与非比较排序) →](/notes/cs61b/lecture-35)

---

## 1. 程序员的技术伦理：软件危害清单（The Ledger of Harms）

*(参考时间：00:02:15 · [视频跳转 (P34 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=135))*

软件工程师不仅是打字的打工者，更是数字世界的规则制定者。随着算法统治日常生活，代码的负面外部性日益凸显：
- **注意力经济与成瘾设计**：为了拉长用户在线时长（Screen Time），算法故意推送极端偏激的言论挑动对立；
- **暗黑模式（Dark Patterns）**：在退订、取消续费页面故意隐藏按钮，诱导用户点击；
- **算法歧视与偏见复制**：训练数据中的历史偏见被机器学习模型无限放大。

主讲教师呼吁每一位伯克利学子在编写算法时，主动对照《软件危害清单》，守住作为技术创造者的职业道德底线。

## 2. 工厂模式（Factory Pattern）：解耦实例化逻辑

*(参考时间：00:13:40 · [视频跳转 (P34 00:13:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=820))*

当对象的创建逻辑包含复杂的配置、环境判定或依赖注入时，直接在业务代码中到处写 `new Dog(1, 2, "a", ...)` 会产生剧烈耦合。

**静态工厂方法（Static Factory Method）**：
```java
public class ComplexNumber {
    private double real, imag;
    private ComplexNumber(double r, double i) { real = r; imag = i; }

    // 表达明确意图的工厂方法
    public static ComplexNumber fromCartesian(double r, double i) {
        return new ComplexNumber(r, i);
    }
    public static ComplexNumber fromPolar(double r, double theta) {
        return new ComplexNumber(r * Math.cos(theta), r * Math.sin(theta));
    }
}
```

## 3. 策略模式（Strategy Pattern）：算法自由替换

*(参考时间：00:25:20 · [视频跳转 (P34 00:25:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=1520))*

我们在 Module 2 学到的 `Comparator` 正是策略模式的典范应用：
> 将具体的算法族封装成独立的策略对象，使算法可以在不影响调用方的前提下自由切换。

例如一个地图导航引擎：
```java
public interface RouteStrategy {
    Path findRoute(Point start, Point end);
}
// 自由装配最短距离策略、避开拥堵策略或高速优先策略
```

## 4. 装饰器模式（Decorator Pattern）：无侵入增强

*(参考时间：00:36:50 · [视频跳转 (P34 00:36:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=2210))*

当我们需要为一个对象动态添加职责（如日志记录、数据加密、结果缓存），而又不想通过继承创建庞杂子类时，**装饰器模式（Decorator）**是最佳选择。

Java 标准 I/O 流体系正是装饰器模式的教科书级实战：
```java
// 基础原始字节流 -> 缓冲增强流 -> 字符转码流 -> 数据对象流
InputStream in = new BufferedInputStream(new FileInputStream("data.txt"));
```
装饰器类和被装饰对象实现完全相同的接口，并在内部持有原对象的引用，在转发调用前后穿插增强逻辑。

## 5. 本讲小结与模式避坑指南

*(参考时间：00:46:15 · [视频跳转 (P34 00:46:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=2775))*

- **拒绝设计模式过载（Pattern Over-engineering）**：设计模式是为了解决现实痛点而总结的经验方剂，不要为了用模式而凭空臆造复杂度；
- **技术向善**：优秀的软件不仅架构优雅，更应当尊重用户的隐私、时间和身心健康。

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 IV：比较排序的理论下界证明](/notes/cs61b/lecture-33) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 V：基数排序与非比较排序 →](/notes/cs61b/lecture-35) | [🎬 在 B 站观看本讲 (P34)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34) |
