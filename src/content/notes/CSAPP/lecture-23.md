---
title: Lecture 23 · Concurrent Programming：并发编程、I/O 多路复用与多线程模型
description: CSAPP 第 23 讲：Concurrent Programming：并发编程、I/O 多路复用与多线程模型
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 23
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P23 ｜ **时长**：01:11:38  
> **所属模块**：Module 10: 并发编程 (Concurrent Programming)（L23 - L26 · 多进程、I/O 多路复用、多线程、信号量同步与并行加速比）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=23](https://www.bilibili.com/video/BV1iW411d7hd/?p=23)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 并发（Concurrency）的三大核心应用场景

*(参考时间：00:02:40 · [视频跳转 (P23 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=160))*

![并发（Concurrency）的三大核心应用场景 官方讲义图解](</attachments/csapp-2cae12922bdec97f9d946509.png>)

当程序需要在逻辑上同时应对多个活动时，就需要并发：
1. **响应多个异步网络客户端**：服务器绝不能被单个慢速客户端的 `read` 阻塞而拒绝服务所有其他用户。
2. **响应外部异步中断与信号**。
3. **在现代多核 CPU 上利用并行硬件加速计算**。

## 2. 方法一：基于进程的并发服务器 (Process-Based)

*(参考时间：00:15:30 · [视频跳转 (P23 00:15:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=930))*

![方法一：基于进程的并发服务器 (Process-Based) 官方讲义图解](</attachments/csapp-e0e7b0935215fa4589c51e5d.png>)

在主循环中，每当 `accept()` 返回一个新的客户端连接，主进程立即 `fork()` 一个子进程单独处理该客户端请求：
* **优点**：每个子进程拥有完全独立的虚拟地址空间，一个客户端崩溃绝对不会影响其他客户端；物理内存完全隔离，非常安全。
* **缺点**：
  1. 进程创建、上下文切换与销毁开销较大；
  2. 进程间通信（IPC，如套接字、管道、共享内存）相对繁琐笨重。

## 3. 方法二：基于 I/O 多路复用的事件驱动服务器 (Event-Driven)

*(参考时间：00:28:45 · [视频跳转 (P23 00:28:45)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=1725))*

![方法二：基于 I/O 多路复用的事件驱动服务器 (Event-Driven) 官方讲义图解](</attachments/csapp-c53126e73d970f40ca73c1e1.png>)

使用 `select()` 或 `epoll()` 系统调用由单个进程统一监控数百个文件描述符的可读可写状态：
* **优点**：完全运行在单个进程的单线程上下文中，零进程/线程切换开销，吞吐率极高（现代 Nginx、Node.js、Redis 的底层基石）。
* **缺点**：编码复杂度极高（必须将逻辑拆分成细粒度的状态机，任何一个步骤一旦被磁盘 I/O 阻塞，整个服务器所有客户端全部卡死）；无法利用多核 CPU 的并行计算能力。

## 4. 方法三：基于线程的并发服务器 (Thread-Based, Pthreads)

*(参考时间：00:42:10 · [视频跳转 (P23 00:42:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=2530))*

![方法三：基于线程的并发服务器 (Thread-Based, Pthreads) 官方讲义图解](</attachments/csapp-92695350a8b8500ea0bcf430.png>)

线程（Thread）是运行在进程上下文中的逻辑流，是现代操作系统的最小调度单位：
* 每个线程拥有自己私有的**线程 ID、程序计数器 `%rip`、条件码与私有调用栈**。
* 但同一进程内的所有线程**共享全部的代码段、全局变量、堆空间以及已打开的文件描述符**！
* 兼具进程的轻量（创建比进程快数十倍）与数据共享的便捷。调用 `pthread_create()` 创建工作线程，调用 `pthread_detach()` 分离线程让其终止后自动回收资源，是 Proxy Lab 的核心模式。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Concurrent Programming：并发编程、I/O 多路复用与多线程模型」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
