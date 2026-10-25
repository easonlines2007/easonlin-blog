---
kind: notes
source: csapp/lecture-22
title: "Lecture 22 · Network Programming II: Sockets, getaddrinfo, and the Tiny
  Web Server"
description: "CSAPP Lecture 22: Network Programming: Part II (Socket Interface
  API, getaddrinfo protocol-independent design and Tiny Web server)"
sourceHash: f146cdc9db2e7ea158038cd330d8ca5b8eaa360a2af0c8036d1b2de95f584886
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: David R. O'Hallaron ｜ **Original video**: Bilibili points P22 \| **duration**: 01:18:00  
> **Module**: Module 9: Network Programming (L21 - L22 · Client-server model, Sockets API, Web server construction)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=22](https://www.bilibili.com/video/BV1iW411d7hd/?p=22)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. Network connection decryption: Socket Pair and endpoint abstraction

*(Reference time: 00:02:10 · [Video jump (P22 00:02:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=130))*

![Network Connection Decryption: Socket Pair and Endpoint Abstraction Official Handout Illustration](</attachments/csapp-cf0abf452ae910a366c94c98.png>)

A reliable TCP connection across the Internet is uniquely determined by a \*\*Socket Pair\*\* composed of the client socket address and the server socket address: 
$$\text{Socket Pair} = (\text{cliaddr}:\text{cliport}, \; \text{servaddr}:\text{servport})$$

### Well-Known Ports vs Ephemeral Ports
* **Server-side uses well-known ports (0 to 1023)**: Distributed globally by IANA, well-known services are permanently monitored on fixed ports:
  * `80`: HTTP Hypertext Transfer Protocol;
  * `443`: HTTPS encrypted secure transmission;
  * `22`: SSH remote secure login;
  * `25`: SMTP mail transfer;
  * `53`: DNS domain name query.
* **Clients use ephemeral ports (usually between 1024 and 65535)**: The moment the client initiates a connection, it is automatically randomly selected and allocated by the operating system kernel protocol stack, and is recycled after the connection is disconnected.

## 2. Unification of socket system calls: from socket and bind to listen and accept

*(Reference time: 00:15:30 · [Video jump (P22 00:15:30)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=930))*

![Unification of socket system calls: from socket, bind to listen and accept official handout illustration](</attachments/csapp-9c348dbea3a6edce3560229f.png>)

The Sockets Interface is a system call facade for applications to interact with the kernel TCP/IP protocol stack:

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

### Core troubleshooting: listening descriptor (listenfd) vs connected descriptor (connfd)
This is the most confusing concept for network programming beginners:
* **listen descriptor (`listenfd`)**: 
  * Called by server  `socket()`  and execute  `listen()`  produce; produce
  * on the server **It is only created once during the entire life cycle and exists permanently.**; 
  * Its only responsibility is to act as a gatekeeper for connection requests (like a receptionist at a switchboard), always listening for external connections and knocking on the door.
* **connected descriptor (`connfd`)**: 
  * every time  `accept()`  When successfully responding to a client's three-way handshake, **A dedicated socket descriptor newly returned by the kernel**; 
  * It only represents the current specific client connection (just like the receptionist arranges for the dedicated customer service manager to enter an independent conference room with the customer);
  * All data sent and received between the server and the client passes  `connfd`  Expand; expand it as soon as the transaction is completed  `close`  Destroy.
* **Why is physical isolation necessary?**
   This design makes it easy for servers to implement **Concurrency and high response**: A main listening descriptor continuously receives new customers, and at the same time derives hundreds of thousands of independent connected descriptors for concurrent data throughput!

## 3. Modern network programming standards: getaddrinfo protocol-independent and elegant design

*(Reference time: 00:31:40 · [Video jump (P22 00:31:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=1900))*

![Modern network programming standards: getaddrinfo protocol-independent elegant design official handout illustrations](</attachments/csapp-146cd2f6a741d1b019ae2204.png>)

Early networking code was littered with things like  `gethostbyname`  Such as unsafe old interfaces, which not only do not support thread concurrency, but also tie the code tightly to IPv4.
The absolute standard for modern systems programming is  **`getaddrinfo`**: 
```c
int getaddrinfo(const char *host, const char *service,
                const struct addrinfo *hints, struct addrinfo **result);
void freeaddrinfo(struct addrinfo *result);
```

### `getaddrinfo`  design art
* **Completely smooth out differences in agreements**: Automatically complete domain name resolution and port service binding in the background, and return a configuration file containing all available configurations.  `addrinfo`  Structure linked list;
* **Transparent compatibility of IPv4 and IPv6**: No need to write the code manually  `AF_INET`  or  `AF_INET6`, just set  `hints.ai_family = AF_UNSPEC`, the system will automatically select the optimal protocol based on the network environment;
* **Client Standard Mode (`open_clientfd`)**: Traverse the returned linked list and try to call it on each entry  `socket`  and  `connect`, as long as there is one success, it will be returned immediately;
* **Server-side standards mode (`open_listenfd`)**: Traverse the linked list and find the first one that can be executed successfully  `socket`, `bind`  and  `listen`  Entries are enough!

## 4. HTTP protocol core anatomy and in-depth deduction of Tiny Web server source code

*(Reference time: 00:48:15 · [Video jump (P22 00:48:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=22&t=2895))*

![Core anatomy of HTTP protocol and in-depth deduction of Tiny Web server source code Official handout illustration](</attachments/csapp-109a0c78d710d1491a63be2c.png>)

Hypertext Transfer Protocol (HTTP) is the universal application layer language of the World Wide Web (WWW).

### 1. HTTP request message format (HTTP Request)
```http
GET /index.html HTTP/1.1
Host: www.cmu.edu
User-Agent: Mozilla/5.0


```
* **Request Line**: `方法 (Method) + URI + 协议版本`; 
* **Request Headers**: `Header-Name: Value`, provide additional context;
* **blank line (`\r\n`)**: Used to mark the end of the head, extremely critical!
* **Request body**: For POST requests containing form or JSON data.

### 2. HTTP response message format (HTTP Response)
```http
HTTP/1.1 200 OK
Server: Tiny Web Server
Content-Length: 128
Content-Type: text/html



<html><body><h1>Welcome to 15-213!</h1></body></html>
```
* **Status Line**: `协议版本 + 状态码 (Status Code) + 状态描述` (such as  `200 OK`, `404 Not Found`, `500 Internal Error`); 
* **response header**: Inform the content length and MIME type;
* **response body**: The web page or image binary data returned to the browser.

### The underlying implementation of Tiny Web server serving static content and dynamic content
* **Static Content Service (Static Content)**:
Tiny reads the requested local disk path (e.g.  `./adder.html`), call  `open()`  To open the file, use  `mmap`  Map the contents of the disk file directly into the process virtual memory, and then a line  `rio_writen(connfd, srcp, filesize)`  Flash zero copy of page data directly to the network socket!
* **Dynamic Content / CGI**:
Tiny parses out the CGI executable program requested by the client and its parameters, and calls  `fork()`  Fork a child process; call the child process  `dup2(connfd, STDOUT_FILENO)`  Redirect standard output to a network socket and finally execute  `execve()`  Run the CGI script. All output generated by the script is magically injected directly into the client's browser!

> \[!TIP\] The core cornerstone of Proxy Lab
The final experiment of CSAPP  **Proxy Lab**  Students are required to implement a man-in-the-middle proxy server (Web Proxy) that can cache Web pages and filter concurrent traffic.
A thorough understanding of Tiny Web Server  `doit`  Transaction parsing and socket reading and writing are the absolute prerequisites for conquering Proxy Lab!


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Network Programming: Part II (socket interface API, getaddrinfo protocol-independent design and Tiny Web server)" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
