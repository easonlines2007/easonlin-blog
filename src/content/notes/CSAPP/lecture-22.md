---
date: 2026-10-21
tags:
  - csapp
status: completed
publish: true
title: "Lecture 22 · Network Programming: Part II（套接字接口 API、getaddrinfo 协议无关设计与
  Tiny Web 服务器）"
description: "CSAPP 第 22 讲：Network Programming: Part II（套接字接口 API、getaddrinfo
  协议无关设计与 Tiny Web 服务器）"
topic: CSAPP
order: 22
updated: 2026-10-22
---

> **讲师**：David R. O'Hallaron ｜ **原视频**：Bilibili 分 P22 ｜ **时长**：01:18:00  
> **所属模块**：Module 9: 网络编程 (Network Programming)（L21 - L22 · 客户端-服务器模型、套接字接口 (Sockets API)、Web 服务器构建）  
> **原视频地址**：[https://www.bilibili.com/video/BV1iW411d7hd/?p=22](https://www.bilibili.com/video/BV1iW411d7hd/?p=22)  
> **课程官方归属**：Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **对应教材**：*Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **字幕与讲义出处**：字幕由 EugeneLiu/translationCSAPP 团队翻译校订（CC BY-NC 4.0 开源协议），幻灯片版权归 CMU 课程组所有。  

---

## 1. 网络连接解密：套接字对 (Socket Pair) 与端点抽象

*(参考时间：00:02:10 · [视频跳转 (P22 00:02:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=130))*

![网络连接解密：套接字对 (Socket Pair) 与端点抽象 官方讲义图解](</attachments/csapp-cf0abf452ae910a366c94c98.png>)

一个跨越因特网的可靠 TCP 连接，是由客户端套接字地址和服务器套接字地址组成的**套接字对（Socket Pair）**唯一确定的：
$$\text{Socket Pair} = (\text{cliaddr}:\text{cliport}, \; \text{servaddr}:\text{servport})$$

### 知名端口 (Well-Known Ports) vs 临时端口 (Ephemeral Ports)
* **服务器端使用知名端口（0 到 1023）**：由 IANA 全球统一分配，知名服务长久监听在固定端口上：
  * `80`: HTTP 超文本传输协议；
  * `443`: HTTPS 加密安全传输；
  * `22`: SSH 远程安全登录；
  * `25`: SMTP 邮件传输；
  * `53`: DNS 域名查询。
* **客户端使用临时端口（Ephemeral Ports，通常在 1024 到 65535 之间）**：在客户端发起连接的一瞬间，由操作系统内核协议栈自动随机挑选分配，连接断开后回收。

## 2. 套接字系统调用大一统：从 socket、bind 到 listen 与 accept

*(参考时间：00:15:30 · [视频跳转 (P22 00:15:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=930))*

![套接字系统调用大一统：从 socket、bind 到 listen 与 accept 官方讲义图解](</attachments/csapp-9c348dbea3a6edce3560229f.png>)

套接字接口（Sockets Interface）是应用程序与内核 TCP/IP 协议栈交互的系统调用门面：

```
       [ 客户端流程 ]                                  [ 服务器流程 ]
                                                     socket() 创建套接字描述符
                                                     bind() 绑定固定端口
                                                     listen() 设为监听被动模式
                                                     accept() 阻塞等待客户端到来...
  socket() 创建套接字描述符                                 |
  connect() 发起 TCP 三次握手 =============================> 唤醒 accept() 返回已连接描述符 connfd
        |                                                   |
  rio_writen() 发送 HTTP 请求 -----------------------------> rio_readlineb() 读取请求
  rio_readlineb() 读取响应 <-------------------------------- rio_writen() 写回网页数据
  close() 关闭连接 =========================================> 读到 EOF，close(connfd)
```

### 核心疑难辨析：监听描述符 (listenfd) vs 已连接描述符 (connfd)
这是网络编程初学者最容易产生混淆的概念：
* **监听描述符 (`listenfd`)**：
  * 由服务器调用 `socket()` 并执行 `listen()` 产生；
  * 在服务器的**整个生命周期内只被创建一次，恒定存在**；
  * 它的唯一职责是：作为连接请求的守门人（如同总机前台接待员），永远监听外部的连接叩门。
* **已连接描述符 (`connfd`)**：
  * 每次 `accept()` 成功响应一个客户端的三次握手时，**内核全新返回的一个专属套接字描述符**；
  * 它只代表当前特定的这一个客户端连接（如同前台接待员安排专属客服经理与客户进入独立会议室）；
  * 服务器与该客户端的所有数据收发全部通过 `connfd` 展开；事务完成后立即将其 `close` 销毁。
* **为什么必须物理隔离？**
  这种设计使得服务器能够轻而易举地实现**并发高响应**：一个主监听描述符源源不断接待新客户，同时派生出数十万个独立的已连接描述符进行并发数据吞吐！

## 3. 现代化网络编程标准：getaddrinfo 协议无关优雅设计

*(参考时间：00:31:40 · [视频跳转 (P22 00:31:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=1900))*

![现代化网络编程标准：getaddrinfo 协议无关优雅设计 官方讲义图解](</attachments/csapp-146cd2f6a741d1b019ae2204.png>)

早期的网络代码充斥着诸如 `gethostbyname` 等不安全的旧接口，它们不仅不支持线程并发，而且将代码死死捆绑在 IPv4 上。
现代系统编程的绝对标准是 **`getaddrinfo`**：
```c
int getaddrinfo(const char *host, const char *service,
                const struct addrinfo *hints, struct addrinfo **result);
void freeaddrinfo(struct addrinfo *result);
```

### `getaddrinfo` 的设计艺术
* **彻底抹平协议差异**：自动在后台完成域名解析、端口服务绑定，并返回一个包含了所有可用配置的 `addrinfo` 结构体链表；
* **IPv4 与 IPv6 的透明兼容**：代码中不需要手动写死 `AF_INET` 或 `AF_INET6`，只需设定 `hints.ai_family = AF_UNSPEC`，系统会自动根据网络环境选择最优协议；
* **客户端标准模式 (`open_clientfd`)**：遍历返回的链表，尝试对每个条目调用 `socket` 和 `connect`，只要有一个成功即刻返回；
* **服务器端标准模式 (`open_listenfd`)**：遍历链表，找到第一个能够成功执行 `socket`、`bind` 和 `listen` 的条目即可！

## 4. HTTP 协议核心解剖与 Tiny Web 服务器源码深度推演

*(参考时间：00:48:15 · [视频跳转 (P22 00:48:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=2895))*

![HTTP 协议核心解剖与 Tiny Web 服务器源码深度推演 官方讲义图解](</attachments/csapp-109a0c78d710d1491a63be2c.png>)

超文本传输协议（HTTP）是全球万维网（WWW）的通用应用层语言。

### 1. HTTP 请求报文格式 (HTTP Request)
```http
GET /index.html HTTP/1.1
Host: www.cmu.edu
User-Agent: Mozilla/5.0


```
* **请求行 (Request Line)**：`方法 (Method) + URI + 协议版本`；
* **请求头 (Request Headers)**：`Header-Name: Value`，提供额外上下文；
* **空行 (`\r\n`)**：用于标志头部结束，极其关键！
* **请求体 (Body)**：对于 POST 请求包含表单或 JSON 数据。

### 2. HTTP 响应报文格式 (HTTP Response)
```http
HTTP/1.1 200 OK
Server: Tiny Web Server
Content-Length: 128
Content-Type: text/html



<html><body><h1>Welcome to 15-213!</h1></body></html>
```
* **状态行 (Status Line)**：`协议版本 + 状态码 (Status Code) + 状态描述`（如 `200 OK`, `404 Not Found`, `500 Internal Error`）；
* **响应头**：告知内容长度与 MIME 类型；
* **响应体**：返回给浏览器的网页或图片二进制数据。

### Tiny Web 服务器服务静态内容与动态内容的底层实现
* **静态内容服务 (Static Content)**：
  Tiny 读取请求的本地磁盘路径（如 `./adder.html`），调用 `open()` 打开文件，使用 `mmap` 将磁盘文件内容直接映射到进程虚拟内存，然后一行 `rio_writen(connfd, srcp, filesize)` 将页面数据零拷贝直接刷向网络套接字！
* **动态内容服务 (Dynamic Content / CGI)**：
  Tiny 解析出客户端请求的 CGI 可执行程序及其参数，调用 `fork()` 派生子进程；子进程调用 `dup2(connfd, STDOUT_FILENO)` 将标准输出重定向到网络套接字，最后执行 `execve()` 运行 CGI 脚本。脚本生成的所有输出便神奇地直接注入了客户端的浏览器！

> [!TIP] Proxy Lab 的核心基石
> CSAPP 的最终压轴实验 **Proxy Lab** 要求同学们实现一个能够缓存 Web 页面、过滤并发流量的中间人代理服务器（Web Proxy）。
> 彻底搞懂 Tiny Web 服务器的 `doit` 事务解析与套接字读写，是攻克 Proxy Lab 的绝对先决条件！


---

### 本讲小结与核心思考 (Takeaways)

1. **系统视角的本质转变**：本讲从底层机制剖析了「Network Programming: Part II（套接字接口 API、getaddrinfo 协议无关设计与 Tiny Web 服务器）」的核心实现原理。
2. **软硬件协同设计**：理解底层规则不仅能消除潜在的难以调试的隐蔽 Bug，更是编写极致性能工业级代码的前提。
3. **动手实践验证**：推荐配合 CSAPP 对应章节课后习题与官方实验（Lab），在 Linux 终端环境下使用 GDB 与性能分析工具亲自印证理论。
