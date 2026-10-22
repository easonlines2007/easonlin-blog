---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 31 · 软件工程 II：架构设计模式与工程解耦：高内聚低耦合、工厂模式、观察者模式、装饰器模式与大型系统重构
description: CS61B 第 31 讲：软件工程 II：架构设计模式与工程解耦：高内聚低耦合、工厂模式、观察者模式、装饰器模式与大型系统重构
topic: CS61B
order: 31
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：54:00 ｜ **官方原版**：Lecture 31 - Software Engineering II  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P31)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=31) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1P1Uc8phy1GW1M4A8PA7mJJMWqb2QgOfewwwB1wMnFlU/edit#slide=id.g2c95eb66b0d_0_7) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/31.-software-engineering-ii)  
> **快速导航**：[← 上一讲 (P30 排序 II：插入排序与归并排序)](/notes/cs61b/lecture-30) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P32 排序 III：快速排序与荷兰国旗三向切分) →](/notes/cs61b/lecture-32)

---

## 1. 软件架构终极准则：高内聚与低耦合（Cohesion & Coupling）

*(参考时间：00:01:20 · [视频跳转 (P31 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=31&t=80))*

随着代码规模扩大，软件腐化的根本标志是“牵一发而动全身”。

优秀的软件架构追求两大黄金指标：
1. **高内聚（High Cohesion）**：一个类或模块内部的各项职责紧密相关，只专注做纯粹的一件事（单一职责原则 SRP）；
2. **低耦合（Low Coupling）**：模块之间的依赖关系尽可能脆弱而抽象，通过契约接口通信，彼此不依赖对方的内部具体实现。

## 2. 经典设计模式实战：工厂模式与装饰器模式

*(参考时间：00:11:00 · [视频跳转 (P31 00:11:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=31&t=660))*

### 工厂模式（Factory Pattern）
将对象的创建逻辑与业务使用逻辑解耦。客户端无需直接 `new ConcreteClass()`，而是通过工厂接口获取实例，方便在测试时无缝注入模拟对象（Mocking）。

### 装饰器模式（Decorator Pattern）
动态地为现有对象附加额外的功能职责，而无需修改其原有代码（如 Java I/O 体系中的 `new BufferedReader(new FileReader("file.txt"))`）。

## 3. 本讲小结与课后自测

*(参考时间：00:22:00 · [视频跳转 (P31 00:22:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=31&t=1320))*

### 课后自测
为什么应该面向接口编程，而不是面向具体实现编程？  
**答案**：面向接口能够使系统具备弹性插拔能力，底层实现发生替换升级时，上层调用方完全无感知，维护成本降至最低。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 31. Software Engineering II

By Thomas Lee and Mihir Mirchandani

---

## 31.1 Complexity II

Complexity comshmexity.

In the previous Software Engineering lecture, we introduced the concept of complexity. 

We define complexity as: anything related to the structure of a software system that makes it hard to understand and modify the system.

Project 3: Build Your own World provides the first opportunity to create complex code. We do not explicitly define what constitutes a room and what constitutes a hallway. There is a great deal of freedom for not just the implementation but the entire architecture of the project. As a result, it is of utmost importance to understand how to manage the complexity. 

In this chapter, we will use examples from Project 3: BYoW to illustrate cases of poorly managed complexity. Consider the following code snippet:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FiiGu5PN9feYP1ucw45fU%2Fcomplex%20code.png?alt=media&amp;token=3f2dc863-81bf-498b-8153-0ecf70c1d8b3" alt=""><figcaption></figcaption></figure>

There are multiple complexity issues with this code:

1. It lacks readability. The code itself is not narrative. It is not immediately clear to someone looking at the code for the first time to figure out what it does.

2. There are many complex manual computations of moving in each direction. The details of these should be hidden away.

3. The code is very repetitive. It will be difficult to make changes because the programmer will need to make certain that all of the updates have been fixed.

Ultimately, there is no *right* answer for what the best practice is for coding in this movement functionality. One could argue that this code could benefit from having helper methods to check if a move in a certain direction is valid and helper methods to do the updates. However, it could also be argued that this code is simple enough to not have any helper methods. It is up to the programmer to decide what would be easiest to write and maintain.

---

## 31.2 Sources of Complexity

There are two primary sources of complexity:

* Dependencies: when a piece of code cannot be read, understood, or modified independently.

* Obscurity: when important information is not obvious. 

In the last section, we showed a code snippet from Project 3 BYoW:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FiiGu5PN9feYP1ucw45fU%2Fcomplex%20code.png?alt=media&amp;token=3f2dc863-81bf-498b-8153-0ecf70c1d8b3" alt=""><figcaption></figcaption></figure>

The complex manual computation of whether a move is valid is an example of obscurity. In order to understand the code, we would also need to understand things about the structure of the `world` array. We also do not know if `player.yycenter+1` is for moving in the up direction or down direction. The repetitive code is an example of dependencies. The updates cannot be modified independently--they all have to be modified in conjunction, or else the behavior is incorrect.

In order to create good systems that last, it is best to keep dependencies and obscurity at a minimum.

#### Tactical Programming

Tactical programming describes a linear approach to writing code, where functions are written only when they are needed. In other words, just trying to get something working instead of first thinking about the overall architecture. It is impractical to use this style of programming when writing anything larger than a small script. 

---

## 31.3 Modular Design

A tool for managing complexity.

Modular design is a powerful tool for managing complexity because it divides the project complexity into manageable pieces. One way to implement modular design is to create helper methods or interfaces. This way, the programmer can individually handle each component of complexity rather than having to always keep track of the details of every piece of code that they write. 

#### Modules should be simple:

In an ideal world, every module is totally independent from one another. Unfortunately, this is not possible because code from each module needs to call other modules. However, we can still try to  minimize these dependencies between modules! In other words, we want to minimize how many *things* you need to know about a given module in order to use it. This is exactly what we mean when we talk about the difference between *implementation* versus *interface*. A good module will not require the user to know the specific implementation in order to use it. Rather, it should be sufficient to just know the interface of the module. Changing the implementation of a module should not affect the interface.

John Ousterhout once said: "The best modules are those whose interfaces are much simpler than their implementation." This is a good rule to swear by, and putting it into practice will save a lot of headache. 

One other technique of minimizing complexity is to restrict what the user can do. If a user does not *need* to interact with an instance variable, then don't give them access to it. 

#### Interface rules:

Interfaces have a further set of rules. These rules are divided into *formal* and *informal* rules. The difference between the two is that informal rules are not enforced by the compiler. 

Formal rules are the list of method signatures. If a method is not implemented in a class that implements the interface, then the compiler will give an error. 

Some examples of informal rules are:

* If your iterator class does not call hasNext() on its own (for some reason) and instead requires the user to call it. 

* Any exceptions that are thrown.

* Any runtime specifications.

Be especially wary of informal rules! They are hard to keep track of. 

#### Modules should be deep

Another cool idea is that Modules should be deep. Their simple interfaces but powerful functionality. We do this a lot like thats the 61B story! A set for example is a deep module that has power functioanlity and simple interfaces. So Red Black BSTs is very deep. I can add, contain, and delete, and there is nothing informal I need to know, it's all under the hood. Powerful functionality means that all operations are efficient. Tree balancing is maintained using sophisticated yet subtle rules. They are tricky and we hide them under the surface. The most important way to keep modules deep is by practicing information hiding.

#### Information Hiding

That is, make your variables private, don't let anyone see what's inside the module as much as you can. Embed all the cleverness inside the modules. So that will keep your interfaces simple. And also it would keep it easy to modify your system. If I made a mistake, I can go fix that without thinking about it in another context. The opposite of hiding information is leaking information.

#### Leaking Information

This occurs when design decisions are reflected across multiple modules.

* Any change to one module requires a change to all modules

* Information leakage is one of the most important red flags in software design

* One of the best skills you can learn as a software designed is a high level of sensitivity to information leakage

#### Temporal Decomposotion

One of the biggest causes of information leaking is "temporal decomposition," especially in BYOW. The structure of your system very much reflects the order in which events occur.

For example, student often do the following in BYOW:

* Game is started with an input string, so call interactWithInputString()

  * Parse the String and find the seed by extracting N#####S (example code that contains the seed.)¹

  * Generate the world

  * Process each character using move(World, char)

  * etc.

* Game is started with no input String, so call interactWithKeyboard

  * Display a menu and collect the seed (number we are using to generate the world).¹

  * Generate the world

  * Until done, call moveWithKeyboard(World)

  * etc.

¹ Because the temporal discussion of when you worked on the project and the temporal decomposition of when these things happen, you don't really recognize that they should be sharing code that collects and extracts the seed for example.

#### Summary

* Buld classes that provide functionality needed in many places in your code.

* Create deep modules, classes with simple interfaces that do complicated things

* avoid over-reliance on temporal decomposition where your decomposition is driven primarily by the order in which things occur.

  * It’s OK to use some temporal decomposition, but try to fix any information leakage that occurs!

* Be strategic, not tactical.

* Most importantly: Hide information from yourself when unneeded!

---

## 31.4 Teamwork

"There is no I in TEAM"

In this project, CS 61B really pushes you to work together just like in our last project 2B. We are doing teams of 2 this semester so that there is more creativity in the open-endedness of this Software Engineering Project.

Ancillary reason: Also reduces programming workload per person, but the project is small enough that a single person can handle it. So please work well together and coordinate how you would like to work together through the small time you have in finishing this project.

Typically, we have done another project, Gitlet, which is a solo software engineering project in the year 2015. In 2016, the software engineering project was to make an Editor which was again, solo. In 2017, we had an amazing project called Databases which was a partner-project! And since 2018 to now, 2022, we have now been doing BYOW with a partner. I personallu, actually had Professor Hilfinger in Spring 2022 where I did Gitlet, but we are now back to BYOW. A majority of partnerships have gone well, but some have not unfortunately. In the real world, some tasks are much too large to be handled by a single person. When faced with the same task, some teams succeed, where others may fail. We ask that you do your best to partner up. Remember to take turns in coding and communicate efficiently and effectively. Please treat each other with respect and be open and honest with each other. Make sure to set clear expectations and please start early on. If these expectations are not met, confront this fact head on. 

#### Reflexivity

* “A group’s ability to collectively reflect upon team objectives, strategies, and processes, and to adapt to them accordingly.”

* Recommended that you “cultivate a collaborative environment in which giving and receiving feedback on an ongoing basis is seen as a mechanism for reflection and learning.”

  * It’s OK and even expected for you and your partner to be a bit unevenly matched in terms of programming ability

#### Feedback (especially negative)

Sometimes we recieve feedback that makes our day and cheers us up. Sometimes we recieve criticism which feel judgemental or in bad faith. Thus we personally sometimes fear giving feedback in fear that our feedback is misconstrued as an attack or taken offensively. Please do not take negative feedback to heart. Please always remember  feedback is about listening actively and being patient and then responding by improving what can be fixed. All of you are amazing students and I know all of you are capable of making good decisions. So please make sure to be responsible and respectful of your peers and always feel free to talk to a member of course staff if you are not feeling okay about something. We are always here to help.

#### Team Reflection

We ask that you please reflect on this software engineering project and the teamwork that was present in this project.

* This partnership has worked well for me.

* This partnership has worked well for my partner.

* Estimate the balance of work between you and your partner, briefly explain.

  * 50/50 means you estimate you each contributed about equally.

  * Note, contributing does not mean lines of code. We mean contribution in a more general sense.

* If applicable, give a particularly great moment from your partnership.

* What’s something you could do better?

* What’s something your partner could do better?

Note: Except in extreme cases, we will not be penalizing partners who contributed less! 

Everyone on course staff hopes you use this advice to only benefit you in your final and memorable software engineering project and hopefully the software engineering projects that are yet to come in your lives! Happy coding everyone!<br>

---

## 31.5 Exerises

### Factual

1. For each of the following, state whether they prevent, exacerbate, or have no effect on information leakage.

   * using unnecessary print statements to show the state of the program while it's running

   * employing temporal decomposition when architecting your code

   * creating deep modules

   * using helper methods and classes

2. In Woolley's study, which factors correlated with the quality of a team's output?

<details>

<summary>Problem 1</summary>

The key to remember is that information leakage is *not* related to the state of the program. Instead, it's when multiple pieces of code reflect a single design decision/module, introducing unnecessary complexity and dependencies.

* **Using unnecessary print statements to show the state of the program while it's running:** no effect on information leakage. 

* **Employing temporal decomposition when architecting your code**: exacerbates information leakage.

* **Creating deep modules**: prevents information leakage.

* **Using helper methods and classes**: prevents information leakage.

</details>

<details>

<summary>Problem 2</summary>

The two most important factors were *turn-taking* during conversations and the average ability of the group members to *recognize emotional state* from a person's eyes.

</details>

### Metacognitive

1. Give some examples of unnecessary obscurity that contributes to complexity.

2. Give some examples of unnnecessary dependencies that contribute to complexity.

<details>

<summary>Problem 1</summary>

There are many kinds of obscurity that can contribute to complexity. These include putting too much code into one function or module, having a large amount of variables that need to be maniuplated, and not breaking up your code or having helper functions.

</details>

<details>

<summary>Problem 2</summary>

One example is copy-pasting code across different modules. This means that to change this block of code, you have to change every location that this code appears in.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 II：插入排序与归并排序](/notes/cs61b/lecture-30) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 III：快速排序与荷兰国旗三向切分 →](/notes/cs61b/lecture-32) | [🎬 在 B 站观看本讲 (P31)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=31) |
