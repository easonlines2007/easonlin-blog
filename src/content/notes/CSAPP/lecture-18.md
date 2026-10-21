---
title: Lecture 18 · Virtual Memory Systems：Linux 虚拟内存系统与内存映射
description: CSAPP 第 18 讲：Virtual Memory Systems：Linux 虚拟内存系统与内存映射
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 18
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P18 ｜ **时长**：01:17:48  
> **所属模块**：Module 7: 系统级 I/O 与虚拟内存 (System-Level I/O & Virtual Memory)（L16 - L18 · Unix I/O、虚拟内存地址翻译、页表与多级缓存保护）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=18](https://www.bilibili.com/video/BV1iW411d7hd/?p=18)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. Intel Core i7 / x86-64 真实内存系统架构

*(参考时间：00:02:50 · [视频跳转 (P18 00:02:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=18&t=170))*

![Intel Core i7 / x86-64 真实内存系统架构 官方讲义图解](</attachments/csapp-f7c788afabc6560e5d329fab.png>)

以现代 64 位 x86-64 处理器为例：
* 虚拟地址使用 48 位，划分为 4 级页表索引（每级 9 位：$9 \times 4 = 36$ 位 VPN）以及 12 位页内偏移量（$2^{12} = 4096$ 字节 = 4KB 页面）。
* CR3 控制寄存器保存顶级页表（Page Global Directory, PGD）的物理基地址。
* 完整的访存经过：**TLB 查验 -> 多级页表查验 -> L1/L2/L3 Cache 查找 -> 物理 DRAM 读取**。整个流水线设计严丝合缝，兼顾了极致速度与完备安全保护。

## 2. Linux 虚拟内存组织：mm_struct 与 vm_area_struct

*(参考时间：00:17:30 · [视频跳转 (P18 00:17:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=18&t=1050))*

![Linux 虚拟内存组织：mm_struct 与 vm_area_struct 官方讲义图解](</attachments/csapp-f77cb3b905d292d43e3ae0e3.png>)

Linux 内核通过两套核心结构管理进程内存：
* `mm_struct`：描述整个进程的内存总览（代码段、数据段、堆栈边界，以及指向第一级页表 PGD 的指针）。
* `vm_area_struct`（虚拟内存区域，VMA）：以链表和红黑树组织，记录连续的内存段（如代码段、已初始化数据段、共享库、堆、用户栈）。每个 VMA 记录了起始地址 `vm_start`、结束地址 `vm_end` 以及访问权限 `vm_prot`。
* 当发生段错误（Segmentation Fault）时，内核遍历该红黑树：若访问地址不在任何合法的 VMA 内，或者写入了只读 VMA，内核立即向进程发送 `SIGSEGV`。

## 3. 内存映射 (mmap) 与写时复制 (COW, Copy-On-Write)

*(参考时间：00:32:00 · [视频跳转 (P18 00:32:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=18&t=1920))*

![内存映射 (mmap) 与写时复制 (COW, Copy-On-Write) 官方讲义图解](</attachments/csapp-8bf1eafdfb2112459cbfb599.png>)

Linux 提供了强大的 `mmap()` 系统调用，允许应用程序将一个磁盘文件直接映射到一段连续的虚拟内存区域：
* 无需多次调用 `read()`/`write()` 产生用户空间与内核空间的反复数据拷贝，读写指针即直接读写文件！
* **共享对象 vs 私有写时复制（Copy-On-Write, COW）对象**：
  当父进程调用 `fork()` 时，内核**根本不会傻傻地把几百 MB 的整个内存数据深度复制一份给子进程**！
  内核仅仅把父进程的页表项复制给子进程，并将所有可写页面标记为**只读（Read-Only）**。父子进程共享同一份物理内存！
  只有当某一方真正试图去修改写入某个页面时，硬件抛出保护异常，内核这才拦截并**单独复制发生写操作的那一个 4KB 物理页**给修改方。这种精妙的“写时复制”让 `fork()` 的创建开销趋近于零！

## 4. 用户级动态内存分配：brk 指针演化

*(参考时间：00:45:30 · [视频跳转 (P18 00:45:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=18&t=2730))*

![用户级动态内存分配：brk 指针演化 官方讲义图解](</attachments/csapp-29b7f5651996066fdf86a8e3.png>)

堆（Heap）是紧跟在未初始化数据段（BSS）之后、向高地址延伸的连续虚拟地址区域。
内核用一个指针 `brk`（Break 指针）标记堆的最顶端。当应用程序调用 `sbrk(incr)` 时，内核将 `brk` 指针向上抬升若干字节，从而在用户空间扩展出更多可供分配器（Allocator）自由切分的可用内存，奠定了下一讲 `malloc` 的底层基石。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Virtual Memory Systems：Linux 虚拟内存系统与内存映射」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
