---
title: "Lecture 21 · Network Programming: Part 1：客户端-服务器模型与 IP/TCP 基础"
description: "CSAPP 第 21 讲：Network Programming: Part 1：客户端-服务器模型与 IP/TCP 基础"
date: 2026-10-21
topic: CSAPP
tags:
  - csapp
status: completed
publish: true
order: 21
---

> **讲师**：Randal E. Bryant ｜ **原视频**：Bilibili 分 P21 ｜ **时长**：01:17:03  
> **所属模块**：Module 9: 网络编程 (Network Programming)（L21 - L22 · 客户端-服务器模型、套接字接口 (Sockets API)、Web 服务器构建）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=21](https://www.bilibili.com/video/BV1iW411d7hd/?p=21)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 客户端-服务器事务模型 (Client-Server Transaction)

*(参考时间：00:02:40 · [视频跳转 (P21 00:02:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=21&t=160))*

![客户端-服务器事务模型 (Client-Server Transaction) 官方讲义图解](</attachments/csapp-56beab0580fead47767b5022.png>)

几乎所有的网络应用都基于**客户端-服务器模型（Client-Server Model）**。一个标准的网络事务包含四步：
1. **客户端发起请求（Request）**：例如浏览器请求一个网页。
2. **服务器处理事务（Process）**：读取数据库或准备 HTML。
3. **服务器返回响应（Response）**。
4. **客户端接收并渲染处理**。
需要注意：客户端和服务器是**进程（Processes）**而非物理机器，同一台物理计算机上可以同时并发运行多个客户端与服务器。

## 2. 网络硬件拓扑与互联网互联

*(参考时间：00:16:15 · [视频跳转 (P21 00:16:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=21&t=975))*

![网络硬件拓扑与互联网互联 官方讲义图解](</attachments/csapp-41b2f63aaf302bb467c62375.png>)

对于应用程序员而言，底层复杂交错的局域网（Ethernet LAN）、交换机（Switches）、网桥（Bridges）和广域网（WAN）全部被屏蔽。**互联网络（Internetwork / Internet）**通过路由器（Routers）将异构的物理硬件联结在一起，TCP/IP 协议族在所有硬件之上构筑了统一平整的端到端通信信道。

## 3. 全球 IP 地址与大小端网络字节序 (Network Byte Order)

*(参考时间：00:29:50 · [视频跳转 (P21 00:29:50)](https://www.bilibili.com/video/BV1iW411d7hd/?p=21&t=1790))*

![全球 IP 地址与大小端网络字节序 (Network Byte Order) 官方讲义图解](</attachments/csapp-ac990024d7684cb182248ce2.png>)

每个互联网主机都有一个 32 位的 IPv4 地址（或 128 位的 IPv6 地址）。
* **字节序冲突**：Intel x86-64 体系采用**小端字节序（Little-Endian）**（低位字节存放在低地址）；而网络协议标准规定网络传输必须采用**大端字节序（Big-Endian / Network Byte Order）**（高位字节存放在低地址）！
* 程序员必须显式调用转换函数：
  * `htonl()` / `ntohl()`：Host to Network Long（32 位转换）
  * `htons()` / `ntohs()`：Host to Network Short（16 位转换，常用于端口号）
  * `inet_pton()` / `inet_ntop()`：点分十进制字符串（如 `"128.2.220.10"`）与网络二进制字节序的互转。

## 4. 域名系统 (DNS) 与可靠 TCP 连接

*(参考时间：00:44:00 · [视频跳转 (P21 00:44:00)](https://www.bilibili.com/video/BV1iW411d7hd/?p=21&t=2640))*

![域名系统 (DNS) 与可靠 TCP 连接 官方讲义图解](</attachments/csapp-909b3857e18da7dd032e7cb3.png>)

人类难以记忆冗长的 IP 地址，**域名系统（DNS）**维护着全世界的主机名到 IP 地址的双向分布式映射。
* **TCP 连接的三大特性**：
  1. **点对点（Point-to-Point）**：连接恰好有两个端点。
  2. **全双工（Full-Duplex）**：数据可以同时在两个方向上并发传输。
  3. **可靠字节流（Reliable Stream）**：底层自动执行丢包重传、流量控制与拥塞控制，应用程序看到的是完美无差错的连续字节流。
* **套接字对（Socket Pair）**：全球唯一的网络连接由一个四元组唯一标识：
$$(CliAddr:CliPort, ServAddr:ServPort)$$


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Network Programming: Part 1：客户端-服务器模型与 IP/TCP 基础」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
