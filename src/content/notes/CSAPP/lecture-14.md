---
title: "Lecture 14 · Exceptional Control Flow: Exceptions and Processes：硬件异常与进程抽象"
description: "CSAPP 第 14 讲：Exceptional Control Flow: Exceptions and Processes：硬件异常与进程抽象"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 14
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P14 ｜ **时长**：01:12:09  
> **所属模块**：Module 6: 异常控制流 (Exceptional Control Flow)（L14 - L15 · 硬件异常、系统调用、进程上下文切换、信号与非局部跳转）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=14](https://www.bilibili.com/video/BV1iW411d7hd/?p=14)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 控制流突变：异常控制流 (ECF) 的四种类型

*(参考时间：00:03:00 · [视频跳转 (P14 00:03:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=14&t=180))*

![控制流突变：异常控制流 (ECF) 的四种类型 官方讲义图解](</attachments/csapp-b640cd18a32be4f4ecb1ffef.png>)

从开机到关机，CPU 只是在不断地读取 `%rip` 指针处的指令并递增执行。为了响应系统外部硬件事件（如网络包到达）或内部特殊事件（如除以零），硬件与操作系统协作提供了**异常控制流（Exceptional Control Flow, ECF）**。

异常分为四大类别：
1. **中断（Interrupt, 异步）**：由外部 I/O 设备引脚触发（如时钟定时器、磁盘完成读写、网卡接收包）。处理完成后**返回下一条指令**。
2. **陷阱（Trap, 同步有意的）**：用户程序故意调用 `syscall` 陷入内核（如 `read`, `fork`, `exit`）。处理完成后**返回下一条指令**。
3. **故障（Fault, 同步潜在可恢复的）**：由错误条件引发（如缺页异常 Page Fault、浮点溢出）。若操作系统修复了故障（如从磁盘调入内存页），**重新执行当前发生故障的指令**；否则终止进程。
4. **终止（Abort, 同步不可恢复的）**：硬件致命错误（如 DRAM 奇偶校验损坏），直接强行终止程序。

## 2. 进程（Process）两大经典抽象：独立逻辑流与私有地址空间

*(参考时间：00:19:40 · [视频跳转 (P14 00:19:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=14&t=1180))*

![进程（Process）两大经典抽象：独立逻辑流与私有地址空间 官方讲义图解](</attachments/csapp-4e643bc11033149e8940dfe6.png>)

进程是计算机科学史上最深刻、最成功的抽象之一。一个进程给应用程序提供了两大极其美妙的假象：
1. **独立的逻辑控制流（Logical Control Flow）**：好像我们独占了整颗 CPU，指令可以无休止地连续运行。实际上操作系统通过**上下文切换（Context Switch）**，在纳秒级周期内利用分时调度让数百个进程轮流在 CPU 上快速切换。
2. **私有的地址空间（Private Address Space）**：好像我们的程序独占了整个高达数十 TB 的内存空间，彼此之间互不干扰、物理隔离。这由虚拟内存分页硬件提供坚固保障。

## 3. 进程控制精髓：fork 的“调用一次，返回两次”

*(参考时间：00:34:10 · [视频跳转 (P14 00:34:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=14&t=2050))*

![进程控制精髓：fork 的“调用一次，返回两次” 官方讲义图解](</attachments/csapp-24adcbd381c42f812ec6e29a.png>)

在 Unix 中，新进程通过 `fork()` 系统调用创建：
```c
pid_t pid = fork();
if (pid == 0) {
    /* 子进程执行分支 */
    printf("Hello from Child!\n");
} else if (pid > 0) {
    /* 父进程执行分支 */
    printf("Hello from Parent, child PID = %d\n", pid);
}
```
* **调用一次，返回两次（Call once, return twice）**：父进程中 `fork` 返回子进程的 PID；新创建的子进程中 `fork` 返回 0。
* **并发执行**：父子进程拥有完全独立的虚拟地址空间副本（虽然共享已打开的文件描述符），它们的指令交错执行次序完全不确定。

## 4. 僵尸进程收尸与 execve 换血重生

*(参考时间：00:49:00 · [视频跳转 (P14 00:49:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=14&t=2940))*

![僵尸进程收尸与 execve 换血重生 官方讲义图解](</attachments/csapp-59901eea9321bb06a262c182.png>)

* **僵尸进程（Zombie）**：子进程终止后并不会立即从系统中抹除，内核保留了它的退出状态码和 PID 记录，等待父进程调用 `wait()` 或 `waitpid()` 来**收尸（Reaping）**。若父进程提前退出，孤儿进程会被 1 号 `init / systemd` 进程收养并代为收尸。
* **`execve(filename, argv, envp)`**：**“调用一次，永不返回”**！它彻底抹掉当前进程的用户栈、堆和数据段，用全新的可执行文件重新覆盖初始化地址空间，但保持原进程 PID 不变，开始运行新程序的 `main` 函数。Unix Shell 的运行机制正是经典的 `fork` + `execve` 循环！


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Exceptional Control Flow: Exceptions and Processes：硬件异常与进程抽象」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
