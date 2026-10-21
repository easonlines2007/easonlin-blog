---
title: "Lecture 25 · Synchronization: Advanced：经典同步问题、线程安全与死锁"
description: "CSAPP 第 25 讲：Synchronization: Advanced：经典同步问题、线程安全与死锁"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 25
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P25 ｜ **时长**：01:20:43  
> **所属模块**：Module 10: 并发编程 (Concurrent Programming)（L23 - L26 · 多进程、I/O 多路复用、多线程、信号量同步与并行加速比）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=25](https://www.bilibili.com/video/BV1iW411d7hd/?p=25)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 经典同步模型：生产者-消费者问题 (Producer-Consumer)

*(参考时间：00:03:00 · [视频跳转 (P25 00:03:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=25&t=180))*

![经典同步模型：生产者-消费者问题 (Producer-Consumer) 官方讲义图解](</attachments/csapp-52afac8e26691d64d01588a5.png>)

生产者线程不断产生项目放入有限大小的缓冲区（Bounded Buffer），消费者线程不断取出消费：
* **三个信号量完美配合**：
  1. `mutex`（初值 1）：保护缓冲区存取指针的互斥访问。
  2. `slots`（初值 $N$）：记录缓冲区剩余空闲槽位数。当槽位为 0 时生产者阻塞等待。
  3. `items`（初值 0）：记录缓冲区已有可用数据项数。当无项目时消费者阻塞等待。
这种基于槽位与可用项的信号量协作设计是网络应用事件队列与线程池任务分发的心脏。

## 2. 经典同步模型：读者-写者问题 (Readers-Writers)

*(参考时间：00:17:20 · [视频跳转 (P25 00:17:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=25&t=1040))*

![经典同步模型：读者-写者问题 (Readers-Writers) 官方讲义图解](</attachments/csapp-256b0e5d7ff910cf80d0d17e.png>)

在许多系统（如数据库、DNS 缓存）中，读操作频繁且互不干扰，写操作修改数据必须独占排他：
* 允许多个读者同时并发读取；
* 写者写入时，严禁任何其他写者或读者进入。
* **读者优先（Reader-Preference）**：利用 `readcnt` 计数器。第一个到达的读者负责加独占锁 `P(w)`，后续读者直接递增 `readcnt` 进场；最后一个离开的读者负责释放 `V(w)`。
* 缺点：若读者源源不断到来，写者可能陷入长期的饥饿（Starvation）！

## 3. 线程安全（Thread Safety）与可重入函数（Reentrancy）

*(参考时间：00:31:40 · [视频跳转 (P25 00:31:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=25&t=1900))*

![线程安全（Thread Safety）与可重入函数（Reentrancy） 官方讲义图解](</attachments/csapp-2db26e1bb50fff1ec54c9f54.png>)

四类经典的**线程不安全函数**：
1. **不保护共享变量的函数**。
2. **跨越调用保持内部静态状态的函数**（如 `rand()`、`strtok()`，其后继调用依赖内部隐式静态指针！必须使用其可重入版本 `rand_r()`、`strtok_r()`）。
3. **返回指向静态内存缓冲区指针的函数**（如 `ctime()`, `gethostbyname()`）。
4. **调用了线程不安全函数的函数**。

**可重入函数（Reentrant Functions）**是一类极高阶的线程安全子集：它们完全不引用任何静态或共享数据，所有状态均保存在调用栈的局部变量中，无需任何互斥锁即可安全并发调用。

## 4. 死锁（Deadlock）的成因与互斥锁加锁顺序铁律

*(参考时间：00:46:10 · [视频跳转 (P25 00:46:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=25&t=2770))*

![死锁（Deadlock）的成因与互斥锁加锁顺序铁律 官方讲义图解](</attachments/csapp-3b9567abdb00110a9a3cc3db.png>)

当两个线程各自持有一把锁、又互相渴望获得对方手中的锁时，就会陷入永久等待的**死锁（Deadlock）**：
* 线程 1：`P(s0)` -> `P(s1)`
* 线程 2：`P(s1)` -> `P(s0)`
当两个线程交错执行完第一条指令后，线程 1 拿着 `s0` 等 `s1`，线程 2 拿着 `s1` 等 `s0`，系统瞬间死锁卡死！

> **死锁预防的黄金法则：全序加锁（Global Lock Ordering）**
> 为系统中的所有互斥锁定义一个全局唯一的严格偏序关系（例如规定必须先锁编号小的锁、再锁编号大的锁）。只要所有线程都**严格按照相同的顺序依次申请加锁**，死锁在数学上就绝对不可能发生！


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Synchronization: Advanced：经典同步问题、线程安全与死锁」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
