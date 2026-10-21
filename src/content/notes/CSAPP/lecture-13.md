---
title: Lecture 13 · Linking：静态链接、符号解析与动态共享库
description: CSAPP 第 13 讲：Linking：静态链接、符号解析与动态共享库
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 13
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P13 ｜ **时长**：01:21:33  
> **所属模块**：Module 5: 链接 (Linking)（L13 · 静态链接、重定位、符号解析、共享库与动态链接）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=13](https://www.bilibili.com/video/BV1iW411d7hd/?p=13)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 链接器的角色：让独立编译与软件工程成为可能

*(参考时间：00:02:30 · [视频跳转 (P13 00:02:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=13&t=150))*

![链接器的角色：让独立编译与软件工程成为可能 官方讲义图解](</attachments/csapp-cfcf83efc9fb27a20dbcf079.png>)

大型软件系统不可能全部写在一个 `.c` 单文件中。**链接（Linking）**是将各种代码和数据片段收集并组合为一个单一文件的过程：
* 链接可以在**编译时（Compile time）**由静态链接器执行；
* 可以在**加载时（Load time）**由动态链接加载器执行；
* 甚至可以在**运行时（Run time）**由应用程序通过 `dlopen()` 动态加载执行。

链接器的存在使得模块化编程与分离编译成为现实：修改一个模块只需要重新编译该 `.c` 文件为 `.o`，再通过链接器极速组装，而无需耗费数小时全量重编整个操作系统。

## 2. 可执行与可链接格式 (ELF) 全景

*(参考时间：00:16:50 · [视频跳转 (P13 00:16:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=13&t=1010))*

![可执行与可链接格式 (ELF) 全景 官方讲义图解](</attachments/csapp-c4588db5f30bed63e4e19b78.png>)

现代 Linux 系统采用统一的 **ELF（Executable and Linkable Format）** 格式：
* **`.text`**：已编译程序的机器可执行代码。
* **`.rodata`**：只读数据段（如字符串字面量、`switch` 跳转表）。
* **`.data`**：已初始化的全局变量和静态 C 变量。
* **`.bss`**：未初始化的全局和静态 C 变量（在文件中不占任何实际磁盘空间，仅记录大小，运行时由操作系统分配并清零，**Better Save Space**）。
* **`.symtab`**：符号表，记录模块定义和引用的函数与全局变量名及其地址。
* **`.rel.text / .rel.data`**：重定位节，记录所有在链接时需要修正的目标地址。

## 3. 符号解析与强弱符号裁决铁律

*(参考时间：00:31:40 · [视频跳转 (P13 00:31:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=13&t=1900))*

![符号解析与强弱符号裁决铁律 官方讲义图解](</attachments/csapp-6a284d2ef065b58308927f82.png>)

链接器解析符号时将全局符号划分为两类：
* **强符号（Strong Symbols）**：函数和已初始化的全局变量。
* **弱符号（Weak Symbols）**：未初始化的全局变量（声明带 `extern` 的是外部引用而非定义）。

> **链接器处理重复符号名称的三大铁律**：
> 1. **同名的强符号只能有一个**（否则报链接错误：`multiple definition of 'x'`）。
> 2. **若有一个强符号与多个弱符号同名，选择强符号**。
> 3. **若有多个弱符号同名，从中任意挑选一个**！
>
> *致命隐患*：如果在 `file1.c` 中定义 `double x;`（弱符号），在 `file2.c` 中定义 `int x;`（弱符号），链接器默默合并它们，当向 `double x` 写入 8 字节时，会无声无息覆写相邻的无关全局变量！因此编译时务必开启 `-fno-common` 或 `-Wall`。

## 4. 重定位过程与动态链接共享库 (.so)

*(参考时间：00:46:10 · [视频跳转 (P13 00:46:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=13&t=2770))*

![重定位过程与动态链接共享库 (.so) 官方讲义图解](</attachments/csapp-4b25b82b7a1d7ace4a3664ee.png>)

* **重定位（Relocation）**：链接器将所有输入 `.o` 的同类节（如所有的 `.text`）合并为单一的大节，为每个全局符号赋予最终的运行时绝对虚拟地址，并修补所有原本填 0 的代码引用（PC 相对寻址与绝对寻址重定位）。
* **动态共享库（Shared Libraries, `.so` / `.dll`）**：静态库（`.a`）会将代码拷贝一份硬编码进每一个生成的可执行文件，浪费海量磁盘与物理内存。动态共享库在物理内存中只常驻一份副本，通过**位置无关代码（PIC, Position-Independent Code）**配合**全局偏移量表（GOT）与过程链接表（PLT）**实现延迟绑定（Lazy Binding），按需动态链接。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Linking：静态链接、符号解析与动态共享库」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
