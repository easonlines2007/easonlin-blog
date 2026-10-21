---
title: "Lecture 09 · Machine Level Programming V: Advanced Topics：缓冲区溢出与安全攻防"
description: "CSAPP 第 9 讲：Machine Level Programming V: Advanced Topics：缓冲区溢出与安全攻防"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 9
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P9 ｜ **时长**：01:18:49  
> **所属模块**：Module 2: 机器级程序表示 (Machine-Level Representation of Programs)（L05 - L09 · x86-64 汇编、控制流、过程调用与数据结构）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=9](https://www.bilibili.com/video/BV1iW411d7hd/?p=9)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 进程内存空间布局与缓冲区溢出之源

*(参考时间：00:02:45 · [视频跳转 (P9 00:02:45)](https://www.bilibili.com/video/BV1iW411d7hd/?p=9&t=165))*

![进程内存空间布局与缓冲区溢出之源 官方讲义图解](</attachments/csapp-029a2975aa949e589c8b5aae.png>)

Linux 64 位进程的典型虚拟内存空间由低到高为：
* `.text`（只读机器代码）
* `.data / .bss`（全局变量与静态数据）
* **堆（Heap）**（向高地址动态生长）
* 共享库内存映射区
* **用户栈（Stack）**（从高地址向低地址向下生长）
* 内核空间

标准 C 库中存在许多不检查目标缓冲区长度的危险函数，如 `gets()`, `strcpy()`, `sprintf()`, `scanf("%s")`。当用户输入长度超过栈上局部数组分配的容量时，输入字节便会越界向上溢出，发生**缓冲区溢出（Buffer Overflow）**。

## 2. 经典攻击：砸烂栈帧（Smashing the Stack）与代码注入

*(参考时间：00:17:30 · [视频跳转 (P9 00:17:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=9&t=1050))*

![经典攻击：砸烂栈帧（Smashing the Stack）与代码注入 官方讲义图解](</attachments/csapp-92b093582b3455369323c3d3.png>)

由于局部变量存放在栈顶，而主调函数的返回地址存放在更高地址处，恶意攻击者精心构造一段超长 payload：
1. 填满本地缓冲区；
2. 覆写掉保存的寄存器；
3. **精准将栈上的返回地址（Return Address）改写为注入在栈中的恶意机器指令（Shellcode）地址**！
4. 当函数执行 `ret` 指令时，CPU 以为是在返回主调函数，实际上却跳转到了攻击者注入的 Shellcode，一举夺取系统的 Root Shell 权限！

## 3. 现代操作系统的三大防御盾牌

*(参考时间：00:31:00 · [视频跳转 (P9 00:31:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=9&t=1860))*

![现代操作系统的三大防御盾牌 官方讲义图解](</attachments/csapp-3262beda2652209097946c29.png>)

为彻底封堵缓冲区溢出，现代编译器与操作系统构筑了三重防线：
1. **栈金丝雀（Stack Canaries / Protectors）**：在函数栈帧的局部变量与返回地址之间悄悄插入一个特殊随机值（Canary）。函数返回前检查 Canary 是否被破坏，若被篡改则立即终止进程（`*** stack smashing detected ***`）。
2. **栈不可执行（NX / DEP, Non-Executable Stack）**：通过硬件页表的 NX 位，将堆栈区域标记为只读或可读写，但**严禁执行代码（$W \oplus X$）**。即便注入了 Shellcode，执行也会立即引发段错误。
3. **地址空间布局随机化（ASLR, Address Space Layout Randomization）**：每次启动程序时，栈、堆和共享库的基地址随机变动，攻击者无法预测注入代码的具体内存指针。

## 4. 矛之反击：面向返回的编程 (ROP, Return-Oriented Programming)

*(参考时间：00:46:15 · [视频跳转 (P9 00:46:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=9&t=2775))*

![矛之反击：面向返回的编程 (ROP, Return-Oriented Programming) 官方讲义图解](</attachments/csapp-943835920ef414bd62cdf664.png>)

在 NX 保护下，攻击者无法在栈上执行新代码。攻击者转而使用系统既有的合法可执行代码段（如 `libc`）：
* 在海量二进制代码中搜寻以 `ret` 结尾的极短指令片段，称为 **Gadget**（例如 `pop %rdi; ret`）。
* 攻击者在栈上仅写入一连串 Gadget 地址与伪造的参数，利用连续的 `ret` 指令像多米诺骨牌一样顺次触发各个 Gadget 执行，最终调用 `execve("/bin/sh", ...)` 成功绕过 NX 保护！这也是 Attack Lab 阶段四的核心攻防思想。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Machine Level Programming V: Advanced Topics：缓冲区溢出与安全攻防」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
