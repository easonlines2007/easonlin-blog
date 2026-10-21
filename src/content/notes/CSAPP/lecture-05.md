---
title: "Lecture 05 · Machine Level Programming I: Basics：x86-64 架构与寄存器体系"
description: "CSAPP 第 5 讲：Machine Level Programming I: Basics：x86-64 架构与寄存器体系"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 5
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P5 ｜ **时长**：01:13:29  
> **所属模块**：Module 2: 机器级程序表示 (Machine-Level Representation of Programs)（L05 - L09 · x86-64 汇编、控制流、过程调用与数据结构）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=5](https://www.bilibili.com/video/BV1iW411d7hd/?p=5)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 从 C 源码到机器指令：编译流水线拆解

*(参考时间：00:03:00 · [视频跳转 (P5 00:03:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=5&t=180))*

![从 C 源码到机器指令：编译流水线拆解 官方讲义图解](</attachments/csapp-0c885c2f19438501e6069429.png>)

计算机无法直接执行 C 语言文本，必须经历完整的编译系统链条：
1. **预处理器（cpp）**：展开宏定义、包含头文件，生成 `.i` 文本文件。
2. **编译器（ccl）**：将高级语言词法语法分析翻译为汇编语言 `.s`。
3. **汇编器（as）**：将文本汇编指令逐条编码为二进制可重定位目标文件 `.o`（机器码）。
4. **链接器（ld）**：合并多个目标文件与系统库（如 `libc`），解析符号引用，生成最终的可执行二进制文件。

## 2. x86-64 的 16 个 64 位通用寄存器格局

*(参考时间：00:16:45 · [视频跳转 (P5 00:16:45)](https://www.bilibili.com/video/BV1iW411d7hd/?p=5&t=1005))*

![x86-64 的 16 个 64 位通用寄存器格局 官方讲义图解](</attachments/csapp-6dbe353ee82f854d747a4931.png>)

x86-64 架构提供了 16 个 64 位宽的通用寄存器，其命名反映了历史演进兼容性：
* `%rax`：主累加器与函数返回值寄存器（其低 32 位为 `%eax`，低 16 位为 `%ax`，低 8 位为 `%al`）。
* `%rdi, %rsi, %rdx, %rcx, %r8, %r9`：**函数调用的前 6 个入参传递寄存器**（彻底淘汰了 32 位时代所有参数压栈的低效方式！）。
* `%rsp`：栈顶指针寄存器（Stack Pointer），由硬件压栈出栈指令直接维护。
* `%rbx, %rbp, %r12 - %r15`：被调用者保存寄存器（Callee-saved）。
* `%r10, %r11`：调用者保存临时寄存器（Caller-saved）。

## 3. 核心寻址模式与 mov 指令

*(参考时间：00:30:20 · [视频跳转 (P5 00:30:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=5&t=1820))*

![核心寻址模式与 mov 指令 官方讲义图解](</attachments/csapp-089c8b6fbeb43f6d23cd63db.png>)

x86-64 拥有功能完备的复合内存寻址公式：
$$Address = Imm(R_b, R_i, s) = Imm + R_b + R_i \times s$$
* $Imm$：立即数偏移量
* $R_b$：基址寄存器（Base Register）
* $R_i$：变址寄存器（Index Register，不能是 `%rsp`）
* $s$：比例因子（Scale factor），取值只能是 $1, 2, 4, 8$（完美匹配指针和基础类型字节大小）。

> **数据传送金律**：一条 `mov` 指令**绝不能同时让源和目的都是内存地址**（内存到内存必须经过寄存器中转）。

## 4. leaq 指令的“算术计算”妙用

*(参考时间：00:48:30 · [视频跳转 (P5 00:48:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=5&t=2910))*

![leaq 指令的“算术计算”妙用 官方讲义图解](</attachments/csapp-32538f82888719414db28e6f.png>)

`leaq` 本名“加载有效地址”（Load Effective Address），其最初目的是将内存地址赋给指针。但编译器发现它本质上是一个拥有**加法器与移位器**的专用高速运算硬件！
因此，编译器广泛利用 `leaq` 极速完成形如 $x \times 3, x \times 5, x \times 9$ 的算术运算，且**完全不改变条件码寄存器**：

```assembly
leaq (%rdi, %rdi, 2), %rax  # %rax = %rdi + %rdi * 2 = 3 * %rdi
leaq (%rsi, %rax, 4), %rdx  # %rdx = %rsi + 4 * %rax = %rsi + 12 * %rdi
```


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Machine Level Programming I: Basics：x86-64 架构与寄存器体系」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
