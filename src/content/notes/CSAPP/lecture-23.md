---
date: 2026-10-21
tags:
  - csapp
status: completed
publish: true
title: Lecture 23 · Concurrent Programming（并发编程三剑客：多进程、I/O 多路复用与多线程 Pthreads）
description: CSAPP 第 23 讲：Concurrent Programming（并发编程三剑客：多进程、I/O 多路复用与多线程 Pthreads）
topic: CSAPP
order: 23
updated: 2026-10-22
---

> **讲师**：Randal E. Bryant & David R. O'Hallaron ｜ **原视频**：Bilibili 分 P23 ｜ **时长**：01:11:38  
> **所属模块**：Module 10: 并发编程 (Concurrent Programming)（L23 - L26 · 多进程、I/O 多路复用、多线程、信号量同步与并行加速比）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=23](https://www.bilibili.com/video/BV1iW411d7hd/?p=23)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 并发的核心概念：并发 (Concurrency) vs 并行 (Parallelism)

*(参考时间：00:02:15 · [视频跳转 (P23 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=135))*

![并发的核心概念：并发 (Concurrency) vs 并行 (Parallelism) 官方讲义图解](</attachments/csapp-2cae12922bdec97f9d946509.png>)

如果逻辑控制流在时间上产生重叠，我们称这些逻辑流是**并发的（Concurrent）**。
* **并发 (Concurrency)**：是关于程序**结构**的设计。它强调程序被拆分为多个可以独立执行的逻辑执行流，无论在单核 CPU（通过时间片轮转分时执行）还是多核 CPU 上，程序逻辑均可成立；
* **并行 (Parallelism)**：是关于程序**执行**的物理状态。它强调多个逻辑流在物理层面上**于同一个绝对物理时刻、在多个独立的 CPU 硬件核心上同时运转**！并行是并发在多核硬件上的完美物理体现。

### 构建并发程序的 Unix 三大经典流派
1. **基于进程的并发 (Process-Based Concurrency)**；
2. **基于 I/O 多路复用的事件驱动并发 (Event-Driven I/O Multiplexing)**；
3. **基于线程的并发 (Thread-Based Concurrency / Pthreads)**。

## 2. 流派一：基于进程的并发服务器及其优劣势分析

*(参考时间：00:14:20 · [视频跳转 (P23 00:14:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=860))*

![流派一：基于进程的并发服务器及其优劣势分析 官方讲义图解](</attachments/csapp-b28dac1842f75bb977d014cb.png>)

在 Unix 传统中最直观的并发模型：**每当服务器 `accept` 接入一个新的客户端连接，就立即调用 `fork()` 分裂出一个专属的子进程为其服务**！

```c
/* 基于进程的并发服务器骨架 */
while (1) {
    connfd = accept(listenfd, (SA *)&clientaddr, &clientlen);
    if (fork() == 0) {
        close(listenfd);  /* 子进程关闭多余的监听套接字引用 */
        doit(connfd);     /* 处理客户端请求事务 */
        close(connfd);    /* 子进程完成通信后关闭已连接描述符 */
        exit(0);          /* 子进程生命周期结束，退出 */
    }
    close(connfd);        /* 极其关键！父进程必须立即关闭其持有的 connfd 副本 */
}
```

### 深度剖析两大极易忽略的工程隐患
1. **父进程关闭 `connfd` 的必要性**：
   `fork()` 会复制父进程的描述符表，使得内核中该打开文件表项的引用计数变为 2。如果父进程在循环末尾不显式调用 `close(connfd)`，该表项的引用计数永远无法归零，导致底层 TCP 连接永远无法发送 FIN 包彻底断开，**造成极其严重的套接字文件描述符泄露**！
2. **僵尸子进程收尸**：必须注册 `SIGCHLD` 处理函数并在内部使用带 `WNOHANG` 的 `waitpid` 循环收敛退出的子进程。

### 优劣势总结
* **坚不可摧的优势**：父子进程拥有完全独立的虚拟地址空间。一个子进程发生段错误崩溃、内存泄露或遭遇黑客攻击，**对主服务器及其他客户进程毫无半点影响**！
* **致命弱点**：进程的创建（`fork`）、销毁和上下文切换开销极其高昂；由于内存隔离，进程之间要想共享状态（如共享缓存、聊天室信息）必须动用复杂的 IPC（进程间通信：管道、共享内存、消息队列）。

## 3. 流派二：基于 I/O 多路复用的事件驱动并发 (select / epoll)

*(参考时间：00:28:40 · [视频跳转 (P23 00:28:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=1720))*

![流派二：基于 I/O 多路复用的事件驱动并发 (select / epoll) 官方讲义图解](</attachments/csapp-ee576eaa54142d174123ff0f.png>)

随着互联网流量爆炸，成千上万个并发连接同时涌入，进程甚至线程的创建开销瞬间将系统压垮（著名的 C10K 瓶颈）。
**I/O 多路复用（I/O Multiplexing）** 应运而生，成为现代超高性能网络框架（如 Nginx, Redis, Node.js, Netty）的绝对核心底座！

### 核心机制：让内核当哨兵
* 思想：**完全不创建多个进程或线程！整个服务器只运行单进程、单线程！**
* 应用程序向内核注册一个感兴趣的描述符集合（Read Set / Write Set）；
* 应用程序调用系统函数（早期为 `select()`, 现代 Linux 采用极速的 `epoll`），进程进入休眠；
* 内核在硬件网卡事件触发时，一旦发现有一个或多个套接字有数据可读，**立刻精准唤醒进程，并明确告知哪些描述符已经准备就绪**！
* 进程在用户态以状态机（State Machine）的形式依次读取就绪的数据，绝不发生任何无谓的阻塞等待。

### 优劣势总结
* **震撼优势**：
  * 单进程单线程，**完全没有上下文切换开销，没有任何线程锁、条件变量与竞态条件的困扰**！
  * 内存开销极小，单个服务器可以轻松维持数十万甚至上百万个长连接；
* **致命弱点**：
  * **代码极度反人类**：控制流被切碎为细小的事件驱动状态机（回调地狱 Callback Hell）；
  * **单点阻塞死穴**：如果其中某一个事件处理逻辑中不小心执行了一个耗时较长的 CPU 密集型计算或磁盘阻塞 I/O，**整个服务器的所有客户全部瞬间卡死假死**！
  * 无法天然利用多核 CPU 的并行计算能力。

## 4. 流派三：基于线程的并发 (Pthreads) 与轻量级上下文

*(参考时间：00:44:10 · [视频跳转 (P23 00:44:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=2650))*

![流派三：基于线程的并发 (Pthreads) 与轻量级上下文 官方讲义图解](</attachments/csapp-b84eb28ff822ec0cb2abe778.png>)

为了兼具多进程的简单直观与事件驱动的高吞吐，现代系统设计最常采用的折中方案是**基于线程的并发（Thread-Based Concurrency）**。

### 什么是线程 (Thread)？
**线程是运行在进程上下文中的逻辑执行流**。
在现代操作系统（如 Linux）中，线程被称为**轻量级进程（LWP: Lightweight Process）**，它是操作系统内核调度的最小独立单元。

### 线程共享 vs 线程私有状态大盘点
* **所有线程共享同一个进程的全部虚拟地址空间**：
  * 共享同一段代码段（`.text`）；
  * 共享所有全局变量与静态变量（`.data` / `.bss`）；
  * 共享动态分配的运行时堆（`heap`）；
  * 共享所有打开的文件描述符集合；
* **每个线程私有的极简状态**：
  * 独立的线程 ID（TID）；
  * 独立的 CPU 寄存器上下文集合（包括独立的程序计数器 `%rip` 和栈指针 `%rsp`）；
  * 独立的**调用栈（User Stack）**。

### POSIX 线程 (Pthreads) 核心 API 四重奏
```c
#include <pthread.h>
/* 1. 创建线程 */
int pthread_create(pthread_t *tid, const pthread_attr_t *attr,
                   void *(*func)(void *), void *arg);
/* 2. 获取自身线程 ID */
pthread_t pthread_self(void);
/* 3. 显式退出当前线程 */
void pthread_exit(void *retval);
/* 4. 等待指定线程终止并收割其栈空间 (类似 waitpid) */
int pthread_join(pthread_t tid, void **thread_return);
/* 5. 分离线程 (Detached Thread)：宣告自我独立，退出时内核自动回收，无需等待 join */
int pthread_detach(pthread_t tid);
```


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Concurrent Programming（并发编程三剑客：多进程、I/O 多路复用与多线程 Pthreads）」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
