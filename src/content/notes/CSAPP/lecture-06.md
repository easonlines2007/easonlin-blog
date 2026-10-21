---
title: "Lecture 06 · Machine Level Programming II: Control：条件码与控制流转移"
description: "CSAPP 第 6 讲：Machine Level Programming II: Control：条件码与控制流转移"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 6
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P6 ｜ **时长**：01:13:50  
> **所属模块**：Module 2: 机器级程序表示 (Machine-Level Representation of Programs)（L05 - L09 · x86-64 汇编、控制流、过程调用与数据结构）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=6](https://www.bilibili.com/video/BV1iW411d7hd/?p=6)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 处理器核心状态：单比特条件码 (Condition Codes)

*(参考时间：00:03:30 · [视频跳转 (P6 00:03:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=6&t=210))*

![处理器核心状态：单比特条件码 (Condition Codes) 官方讲义图解](</attachments/csapp-dd5c95669aa7decaa398cd2b.png>)

CPU 内部维护着一组单比特的条件码寄存器，描述最近一次算术或逻辑操作的属性：
* **CF (Carry Flag, 进位标志)**：最高位产生了进位或借位，用于检测**无符号整数溢出**。
* **ZF (Zero Flag, 零标志)**：最近操作的结果恰好为 0。
* **SF (Sign Flag, 符号标志)**：最近操作的结果小于 0（最高位为 1）。
* **OF (Overflow Flag, 溢出标志)**：检测**补码有符号整数溢出**（如两正得负、两负得正）。

`cmpq %rax, %rbx` 指令内部计算 `%rbx - %rax` 并设置条件码，但不保存差值结果；`testq %rax, %rax` 通过位与测试数值的正负与是否为零。

## 2. 条件跳转 vs 条件传送 (cmov)：分支预测的威力

*(参考时间：00:18:15 · [视频跳转 (P6 00:18:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=6&t=1095))*

![条件跳转 vs 条件传送 (cmov)：分支预测的威力 官方讲义图解](</attachments/csapp-8c496696b5e9c5d275a71dfd.png>)

在现代高度流水线化的处理器中，条件分支跳转（如 `jle`, `jg`）需要分支预测器（Branch Predictor）提前猜测执行路径。一旦猜测失败（Misprediction），流水线中的后续数十条指令必须全部作废清空，代价极其高昂（惩罚可达 15-30 个时钟周期）。

为此，x86-64 引入了**条件传送指令（Conditional Move, `cmov`）**：
* 无论分支如何，把两侧的值都提前算出来；
* 最后仅用一条 `cmov` 指令根据条件码决定把哪一个值送入目标寄存器。
* 彻底消除了分支预测失败惩罚！但需要注意，如果其中一侧计算可能引发异常（如空指针解引用 `*p`），则不能使用条件传送。

## 3. 循环的汇编结构：do-while、while 与 for

*(参考时间：00:32:40 · [视频跳转 (P6 00:32:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=6&t=1960))*

![循环的汇编结构：do-while、while 与 for 官方讲义图解](</attachments/csapp-b629d6acb5a6ac6a8c7aa9d5.png>)

汇编语言底层根本没有 `while` 或 `for`，一切循环都是通过**标签（Label）与条件跳转**构建的：
1. **Jump-to-middle 模式**：先直接无条件跳到循环体末尾进行条件判断，满足条件再往上跳回循环体首。
2. **Guarded-do 模式（现代 GCC 优化常用）**：先在循环开始前判断一次初始条件，不满足直接跳过；一旦进入循环，内部转化为纯粹高效的 `do-while` 循环体，减少内部无谓跳转。

## 4. Switch 语句与跳转表 (Jump Tables)

*(参考时间：00:46:10 · [视频跳转 (P6 00:46:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=6&t=2770))*

![Switch 语句与跳转表 (Jump Tables) 官方讲义图解](</attachments/csapp-fae8f99cd21755c4a01450fe.png>)

当 `switch` 语句中 case 分支较多且取值密集时，编译器绝不会生成长串低效的 `if-else` 判断链，而是构建一个**跳转表（Jump Table）**：
* 在只读数据段 `.rodata` 中开辟一个指针数组，每个元素保存对应 case 代码块的绝对内存地址。
* 运行时先用 `ja` 检查索引是否越界，随后执行单条间接跳转：
```assembly
jmp *.L4(,%rdi,8)  # 根据 %rdi 索引查表跳转
```
无论有 5 个分支还是 50 个分支，查表跳转耗时完全是 $O(1)$ 常数时间！


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Machine Level Programming II: Control：条件码与控制流转移」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
