---
title: "Lecture 24 · Synchronization: Basics：共享变量、竞争条件与 POSIX 信号量"
description: "CSAPP 第 24 讲：Synchronization: Basics：共享变量、竞争条件与 POSIX 信号量"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 24
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P24 ｜ **时长**：56:31  
> **所属模块**：Module 10: 并发编程 (Concurrent Programming)（L23 - L26 · 多进程、I/O 多路复用、多线程、信号量同步与并行加速比）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=24](https://www.bilibili.com/video/BV1iW411d7hd/?p=24)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 多线程中的共享变量与非确定性交错

*(参考时间：00:03:00 · [视频跳转 (P24 00:03:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=24&t=180))*

![多线程中的共享变量与非确定性交错 官方讲义图解](</attachments/csapp-5feddcf145eabb2d2303164f.png>)

多个线程并发执行一个极为简单的共享变量自增 `cnt++`：
```c
volatile long cnt = 0;
void *thread(void *vargp) {
    long i, niters = *((long *)vargp);
    for (i = 0; i < niters; i++) cnt++;
    return NULL;
}
```
当传入 `niters = 100000`、启动两个线程时，最终的 `cnt` 结果往往远小于 200000！为什么？
因为 C 语言的 `cnt++` 在机器底层被分解为 3 条指令：
1. **$H_i$ (加载)**：`movq cnt(%rip), %rdx`
2. **$L_i$ (更新)**：`incq %rdx`
3. **$S_i$ (写回)**：`movq %rdx, cnt(%rip)`

当两个线程的微指令发生交错（Interleaving）时，线程 2 会把线程 1 刚加完但未写回的值直接覆写丢弃，发生**竞争条件（Race Condition）**！

## 2. 进度图 (Progress Graphs) 与临界区 (Critical Section)

*(参考时间：00:16:40 · [视频跳转 (P24 00:16:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=24&t=1000))*

![进度图 (Progress Graphs) 与临界区 (Critical Section) 官方讲义图解](</attachments/csapp-1b409166fe2db66e3b506b38.png>)

进度图用 $n$ 维笛卡尔坐标系直观展现 $n$ 个并发线程的执行轨迹。
* 访问共享变量 `cnt` 的指令区域被称为**临界区（Critical Section）**。
* 两个线程的临界区在进度图上重叠构成的矩形区域被称为**不安全区（Unsafe Region）**。
* **互斥铁律（Mutual Exclusion）**：任何合法的并发控制机制，必须确保多线程执行的轨迹绝对不能穿过不安全区！

## 3. 经典互斥基石：Dijkstra 信号量 (Semaphores)

*(参考时间：00:30:15 · [视频跳转 (P24 00:30:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=24&t=1815))*

![经典互斥基石：Dijkstra 信号量 (Semaphores) 官方讲义图解](</attachments/csapp-45cf69b830c3afd74604f1c2.png>)

Edsger Dijkstra 提出了优雅的**信号量（Semaphore）**机制。信号量 $s$ 是一个非负整数全局变量，只能由两个不可分割的**原子操作（Atomic Operations）**修改：
* **$P(s)$（等待 / Wait）**：若 $s > 0$，则将 $s$ 减 1 并立即返回；若 $s = 0$，则挂起当前线程，将其放入等待队列休眠，直到被唤醒。
* **$V(s)$（发送 / Signal / Post）**：将 $s$ 加 1。若等待队列中有休眠线程，唤醒其中一个线程使其完成 $P$ 操作。

> **二元信号量（互斥锁 Mutex）**：将信号量初值设为 1。临界区代码两端包裹 `P(m)` 与 `V(m)`，使任何时刻至多只有 1 个线程能够身处临界区，彻底粉碎竞争条件！

## 4. POSIX 信号量实战：保护共享计数器

*(参考时间：00:43:20 · [视频跳转 (P24 00:43:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=24&t=2600))*

![POSIX 信号量实战：保护共享计数器 官方讲义图解](</attachments/csapp-417b2d36a1fe1675a7e3abc6.png>)

在 C 程序中利用 `<semaphore.h>` 实现线程安全计数：
```c
sem_t mutex;
sem_init(&mutex, 0, 1); /* 初始化互斥信号量为 1 */

void *thread(void *vargp) {
    for (int i = 0; i < niters; i++) {
        sem_wait(&mutex); /* P 操作 */
        cnt++;            /* 临界区保护 */
        sem_post(&mutex); /* V 操作 */
    }
    return NULL;
}
```
通过信号量加锁，最终 `cnt` 结果永远严丝合缝等于期待的 200000。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Synchronization: Basics：共享变量、竞争条件与 POSIX 信号量」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
