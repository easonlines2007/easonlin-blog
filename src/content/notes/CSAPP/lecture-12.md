---
title: Lecture 12 · Cache Memories：高速缓存存储器组织与缓存友好编程
description: CSAPP 第 12 讲：Cache Memories：高速缓存存储器组织与缓存友好编程
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 12
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P12 ｜ **时长**：01:18:43  
> **所属模块**：Module 4: 存储器层次结构 (The Memory Hierarchy & Cache)（L11 - L12 · 局部性原理、存储金字塔、Cache 组织与缓存友好代码）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=12](https://www.bilibili.com/video/BV1iW411d7hd/?p=12)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 高速缓存通用组织架构：S 组、E 行、B 字节

*(参考时间：00:02:40 · [视频跳转 (P12 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=12&t=160))*

![高速缓存通用组织架构：S 组、E 行、B 字节 官方讲义图解](</attachments/csapp-afe32be6e543b909dcb3f461.png>)

一个通用的 Cache 参数用元组 $(S, E, B, m)$ 完整刻画：
* 内存地址共有 $m$ 位（虚拟或物理地址空间）。
* Cache 划分为 $S = 2^s$ 个**组（Sets）**。
* 每个组包含 $E$ 个**行（Lines / Cache Lines）**。
* 每个行包含一个有效位（Valid Bit）、$t$ 位标记（Tag）以及 $B = 2^b$ 字节的**数据块（Block）**。
* Cache 总容量 $C = S \times E \times B$ 字节。

对于任意一个 $m$ 位内存地址，硬件将其精准切分为三段：
1. **标记位（Tag, $t = m - (s + b)$ 位）**：匹配组内的具体行。
2. **组索引（Set Index, $s$ 位）**：散列定位到哪一个 Set。
3. **块偏移（Block Offset, $b$ 位）**：确定数据块内的起始字节。

## 2. 直接映射、组相联与全相联 Cache

*(参考时间：00:19:15 · [视频跳转 (P12 00:19:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=12&t=1155))*

![直接映射、组相联与全相联 Cache 官方讲义图解](</attachments/csapp-3a7a9ecd38343d584dcb7964.png>)

根据每个组内拥有的行数 $E$：
* **直接映射 Cache（Direct-Mapped, $E = 1$）**：每个组只有一行。硬件实现最简单、查找最快，但当两个交替访问的变量映射到同一个组时，会发生毁灭性的“抖动（Thrashing）”冲突缺失。
* **组相联 Cache（Set-Associative, $1 < E < C/B$）**：每个组有 $E$ 行（如常见的 8 路组相联）。硬件并行比较组内所有行的 Tag。若组满，采用**最近最少使用算法（LRU）**进行替换淘汰。
* **全相联 Cache（Fully-Associative, $S = 1$）**：只有一个组，包含所有行。任意数据块可放入任意位置，彻底杜绝冲突缺失，但并行比较电路成本高昂，常用于小容量的页表转换后援缓冲器（TLB）。

## 3. 写入策略：写命中与写缺失

*(参考时间：00:33:00 · [视频跳转 (P12 00:33:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=12&t=1980))*

![写入策略：写命中与写缺失 官方讲义图解](</attachments/csapp-92f84e5eef12fa058979758c.png>)

当 CPU 执行写操作时：
* **写命中（Write Hit）**：
  * **直写（Write-through）**：立即同时写回下一层主存。简单但浪费总线带宽。
  * **写回（Write-back）**：只写入 Cache，并将该行标记为“脏位（Dirty Bit）”。只有当该行被替换淘汰时，才一次性写入主存。极大节省带宽，现代 CPU 广泛采用。
* **写缺失（Write Miss）**：
  * **写分配（Write-allocate）**：先把对应块从主存载入 Cache，再更新。配合写回策略使用。
  * **非写分配（No-write-allocate）**：直接绕过 Cache 写入主存。

## 4. 编写 Cache 友好代码：步长 1 访问与矩阵乘法分块 (Blocking)

*(参考时间：00:46:40 · [视频跳转 (P12 00:46:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=12&t=2800))*

![编写 Cache 友好代码：步长 1 访问与矩阵乘法分块 (Blocking) 官方讲义图解](</attachments/csapp-d333b4d637441bfedeb1156b.png>)

* **金律一：让最内层循环以步长为 1（Stride-1）顺序遍历数据**。空间局部性使得一次冷缺失载入的 64 字节数据块能连续支撑接下来十几次访存命中。
* **金律二：二维矩阵乘法分块（Tiling / Blocking）**。
  朴素矩阵乘法 $C = A \times B$ 会导致矩阵 $B$ 发生严重的跨列跳跃访问，超出 Cache 容量后缺失率激增。通过将大矩阵划分为 $B \times B$ 的微型子块，让整个子块恰好常驻在 L1 缓存中完成局部乘加，使得大矩阵乘法性能提升数倍至数十倍！这就是 Cache Lab 的核心优化精髓。


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Cache Memories：高速缓存存储器组织与缓存友好编程」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
