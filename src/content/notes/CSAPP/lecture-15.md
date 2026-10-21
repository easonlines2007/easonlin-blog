---
title: "Lecture 15 · Exceptional Control Flow: Signals and Nonlocal Jumps：信号处理与非局部跳转"
description: "CSAPP 第 15 讲：Exceptional Control Flow: Signals and Nonlocal Jumps：信号处理与非局部跳转"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 15
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P15 ｜ **时长**：01:19:27  
> **所属模块**：Module 6: 异常控制流 (Exceptional Control Flow)（L14 - L15 · 硬件异常、系统调用、进程上下文切换、信号与非局部跳转）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=15](https://www.bilibili.com/video/BV1iW411d7hd/?p=15)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. Unix 信号机制：软件层面的中断通知

*(参考时间：00:02:40 · [视频跳转 (P15 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=15&t=160))*

![Unix 信号机制：软件层面的中断通知 官方讲义图解](</attachments/csapp-f3f5ed80865fb958f9cdf310.png>)

信号（Signal）是一种纯软件形式的高级异常，允许内核或其它进程中断目标进程的正常执行。常用核心信号：
* `SIGINT` (2)：用户按键盘 `Ctrl+C` 触发，默认终止前台进程。
* `SIGKILL` (9)：强制杀死进程（**不可被捕获、阻塞或忽略**）。
* `SIGSEGV` (11)：段错误（非法解引用内存指针）。
* `SIGCHLD` (17)：子进程终止或停止时，内核自动向父进程发送该信号，用于异步收尸。

## 2. 信号的生命周期：发送、待处理 (Pending) 与阻塞 (Blocked)

*(参考时间：00:17:15 · [视频跳转 (P15 00:17:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=15&t=1035))*

![信号的生命周期：发送、待处理 (Pending) 与阻塞 (Blocked) 官方讲义图解](</attachments/csapp-501e60e65a06fbc088dcbf93.png>)

内核在进程控制块中用两组位向量维护信号状态：
* **待处理位向量（Pending Bit Vector）**：记录当前已发送但尚未被目标进程处理的信号。同类型信号**不会排队**！若已有该类型信号 Pending，后续到达的相同信号会被**直接丢弃**！
* **阻塞位向量（Blocked Bit Vector / Signal Mask）**：记录当前被阻塞屏蔽的信号。程序可以通过 `sigprocmask()` 显式阻止某些信号的递送，在关键临界区结束后再解除阻塞。

## 3. 编写安全信号处理函数的七大铁律

*(参考时间：00:32:50 · [视频跳转 (P15 00:32:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=15&t=1970))*

![编写安全信号处理函数的七大铁律 官方讲义图解](</attachments/csapp-a921619b228847371fc6537e.png>)

信号处理函数（Signal Handler）是并发执行的异步回调，极易引发竞争条件与死锁。编写 Handler 必须严格遵守：
1. **保持极其简短**（如只设置一个标志位并退出）。
2. **只调用异步信号安全（Async-signal-safe）函数**（如 `write`, `_exit`；**严禁调用 `printf`, `malloc`, `free`**，否则可能发生内部锁重入死锁！）。
3. **保存并恢复 `errno`**。
4. **访问全局共享标志必须使用 `volatile sig_atomic_t`**（确保原子读写，防止编译器寄存器优化缓存）。
5. **在父进程 `fork` 之前必须先阻塞 `SIGCHLD`**，防止子进程瞬间结束触发 handler 导致父进程在添加作业前就提前删除了作业（Shell Lab 经典竞争 Bug）。

## 4. 非局部跳转：setjmp 与 longjmp

*(参考时间：00:48:30 · [视频跳转 (P15 00:48:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=15&t=2910))*

![非局部跳转：setjmp 与 longjmp 官方讲义图解](</attachments/csapp-0367a70102a69a517511da9c.png>)

C 语言的 `goto` 只能在同一个函数内部跳转。而 `setjmp` 与 `longjmp` 实现了跨越函数栈帧层级的**非局部跳转（Nonlocal Jumps）**：
* `setjmp(env)`：保存当前 CPU 寄存器上下文与调用栈顶状态，初次调用返回 0。
* `longjmp(env, val)`：无视中间所有函数调用层次，直接将调用栈回滚恢复到 `setjmp` 点，并让其返回非零值 `val`！
这是 C++ `try-catch` 异常捕获机制与用户态协程上下文切换的底层原型。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Exceptional Control Flow: Signals and Nonlocal Jumps：信号处理与非局部跳转」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
