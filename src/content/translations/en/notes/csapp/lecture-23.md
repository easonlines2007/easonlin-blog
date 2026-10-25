---
kind: notes
source: csapp/lecture-23
title: "Lecture 23 · Concurrent Programming: Processes, I/O Multiplexing, and
  Pthreads"
description: "CSAPP Lecture 23: Concurrent Programming (Three Musketeers of
  Concurrent Programming: Multi-process, I/O Multiplexing and Multi-Thread
  Pthreads)"
sourceHash: 1cdb505d0433e6f29927830f23021f0b8229bb3d0602be1285a9447f62551cd9
publish: true
translationMethod: machine-assisted
---

> **Lecturer**: Randal E. Bryant & David R. O'Hallaron ｜ **Original video**: Bilibili points P23 \| **duration**: 01:11:38  
> **Module**: Module 10: Concurrent Programming (L23 - L26 · Multi-process, I/O multiplexing, multi-threading, semaphore synchronization and parallel acceleration ratio)  
> **Original video address**: [https://www.bilibili.com/video/BV1iW411d7hd/?p=23](https://www.bilibili.com/video/BV1iW411d7hd/?p=23)  
> **Course official ownership**: Carnegie Mellon University (CMU) 15-213 / 18-213 / 15-513: Introduction to Computer Systems (CSAPP Fall 2015)  
> **Corresponding teaching materials**: *Computer Systems: A Programmer's Perspective (3rd Edition)* by R. Bryant & D. O'Hallaron  
> **Source of subtitles and handouts**: The subtitles were translated and edited by the EugeneLiu/translationCSAPP team (CC BY-NC 4.0 open source license), and the copyright of the slides belongs to the CMU course group.  

---

## 1. Core concepts of concurrency: Concurrency vs Parallelism

*(Reference time: 00:02:15 · [Video jump (P23 00:02:15)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=135))*

![The core concept of concurrency: Concurrency vs Parallelism Official handout illustration](</attachments/csapp-2cae12922bdec97f9d946509.png>)

If logical control flows overlap in time, we call these logical flows **Concurrent**.
* **Concurrency**: It’s about the program **structure** design. It emphasizes that the program is split into multiple logical execution flows that can be executed independently. The program logic can be established whether on a single-core CPU (time-sharing execution through time slice rotation) or a multi-core CPU;
* **Parallelism**: It’s about the program **execute** physical state. It emphasizes multiple logical flows at the physical level **Running simultaneously on multiple independent CPU hardware cores at the same absolute physical moment**! Parallelism is the perfect physical embodiment of concurrency on multi-core hardware.

### Three classic Unix schools for building concurrent programs
1. **Process-Based Concurrency**; 
2. **Event-Driven I/O Multiplexing**; 
3. **Thread-Based Concurrency / Pthreads**.

## 2. School 1: Analysis of process-based concurrent servers and their advantages and disadvantages

*(Reference time: 00:14:20 · [Video jump (P23 00:14:20)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=860))*

![School 1: Analysis of process-based concurrent servers and their advantages and disadvantages Official handout illustration](</attachments/csapp-b28dac1842f75bb977d014cb.png>)

The most intuitive concurrency model in the Unix tradition: **Whenever the server  `accept`  When a new client connection is connected, it is called immediately  `fork()`  Split a dedicated child process to serve it**!

```c
/* 基于进程的并发服务器骨架 */
while (1) {
    connfd = accept(listenfd, (SA *)&clientaddr, &clientlen);
    if (fork() == 0) {
        close(listenfd);  /* 子进程关闭多余的监听套接字引用 */
        doit(connfd);     /* 处理客户端请求事务 */
        close(connfd);    /* 子进程完成通信后关闭已连接描述符 */
        exit(0);          /* 子进程生命周期结束，退出 */
    }
    close(connfd);        /* 极其关键！父进程必须立即关闭其持有的 connfd 副本 */
}
```

### An in-depth analysis of two engineering hazards that are easily overlooked
1. **Parent process shuts down  `connfd`  necessity**: 
   `fork()`  The descriptor table of the parent process is copied so that the reference count of the open file table entry in the kernel becomes 2. If the parent process does not call explicitly at the end of the loop  `close(connfd)`, the reference count of this entry can never be reset to zero, causing the underlying TCP connection to never be able to send a FIN packet and be completely disconnected. **Causing extremely serious socket file descriptor leaks**!
2. **Zombie child process collects corpses**: Must register  `SIGCHLD`  Handle functions and use them internally with  `WNOHANG`  of  `waitpid`  The child process exits after loop convergence.

### Summary of advantages and disadvantages
* **An indestructible advantage**: The parent and child processes have completely independent virtual address spaces. A child process crashes with a segmentation fault, leaks memory, or is attacked by a hacker. **Has no impact on the main server and other client processes**!
* **fatal weakness**: Creation of process (`fork`), destruction and context switching are extremely expensive; due to memory isolation, complex IPC (inter-process communication: pipes, shared memory, message queues) must be used to share state (such as shared cache, chat room information) between processes.

## 3. Genre 2: Event-driven concurrency based on I/O multiplexing (select / epoll)

*(Reference time: 00:28:40 · [Video jump (P23 00:28:40)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=1720))*

![Genre 2: Event-driven concurrency based on I/O multiplexing (select / epoll) Official handout illustration](</attachments/csapp-ee576eaa54142d174123ff0f.png>)

As Internet traffic explodes, thousands of concurrent connections pour in at the same time, and the overhead of creating processes and even threads instantly overwhelms the system (the famous C10K bottleneck). 
**I/O Multiplexing**  It came into being and became the absolute core base of modern ultra-high-performance network frameworks (such as Nginx, Redis, Node.js, Netty)!

### Core mechanism: Let the kernel act as a sentinel
* Thoughts: **No multiple processes or threads are created at all! The entire server only runs a single process and single thread!**
* The application registers an interested descriptor set (Read Set/Write Set) with the kernel;
* Application calls system functions (early  `select()`, modern Linux uses extremely fast  `epoll`), the process goes to sleep;
* When the kernel triggers a hardware network card event, once it finds that one or more sockets have data to read, **Wake up the process immediately and accurately, and clearly tell which descriptors are ready**!
* The process reads the ready data sequentially in the user mode in the form of a state machine, without any unnecessary blocking and waiting.

### Summary of advantages and disadvantages
* **Shocking advantage**: 
  * Single process single thread, **There is no context switching overhead at all, and there is no trouble with thread locks, condition variables, and race conditions.**!
  * The memory overhead is extremely small, and a single server can easily maintain hundreds of thousands or even millions of long connections;
* **fatal weakness**: 
  * **The code is extremely anti-human**: Control flow is chopped into small event-driven state machines (Callback Hell);
  * **Single point of obstruction**: If one of the event processing logic accidentally performs a long-term CPU-intensive calculation or disk-blocking I/O, **All clients on the entire server are instantly stuck and suspended in suspended animation.**!
  * The parallel computing capabilities of multi-core CPUs cannot be naturally exploited.

## 4. Genre 3: Thread-based concurrency (Pthreads) and lightweight context

*(Reference time: 00:44:10 · [Video jump (P23 00:44:10)](https://www.bilibili.com/video/BV1iW411d7hd/?p=23&t=2650))*

![Genre 3: Thread-based concurrency (Pthreads) and lightweight context Official handout illustration](</attachments/csapp-b84eb28ff822ec0cb2abe778.png>)

In order to combine the simplicity and intuition of multi-processing with the high throughput of event-driven, the most common compromise used in modern system design is **Thread-Based Concurrency**.

### What is a thread?
**A thread is a logical flow of execution running in the context of a process**.
In modern operating systems such as Linux, threads are called **Lightweight Process (LWP: Lightweight Process)**, which is the smallest independent unit of operating system kernel scheduling.

### Thread sharing vs thread private state review
* **All threads share the entire virtual address space of the same process**: 
  * share the same code snippet (`.text`); 
  * Share all global and static variables (`.data` / `.bss`); 
  * Shared dynamically allocated runtime heap (`heap`); 
  * Share the set of all open file descriptors;
* **Minimalist state private to each thread**: 
  * Thread Independent ID (TID);
  * Independent set of CPU register contexts (including independent program counter  `%rip`  and stack pointer  `%rsp`); 
  * independent **Call Stack (User Stack)**.

### POSIX Threads (Pthreads) Core API Quartet
```c
#include <pthread.h>
/* 1. 创建线程 */
int pthread_create(pthread_t *tid, const pthread_attr_t *attr,
                   void *(*func)(void *), void *arg);
/* 2. 获取自身线程 ID */
pthread_t pthread_self(void);
/* 3. 显式退出当前线程 */
void pthread_exit(void *retval);
/* 4. 等待指定线程终止并收割其栈空间 (类似 waitpid) */
int pthread_join(pthread_t tid, void **thread_return);
/* 5. 分离线程 (Detached Thread)：宣告自我独立，退出时内核自动回收，无需等待 join */
int pthread_detach(pthread_t tid);
```


---

### Summary and core thoughts of this lecture (Takeaways)

1. **Essential changes in systems perspective**: This lecture analyzes the core implementation principles of "Concurrent Programming (Three Musketeers of Concurrent Programming: multi-process, I/O multiplexing and multi-threaded Pthreads)" from the underlying mechanism.
2. **Software and hardware co-design**: Understanding the underlying rules can not only eliminate potential hidden bugs that are difficult to debug, but is also a prerequisite for writing industrial-grade code with ultimate performance.
3. **Hands-on verification**: It is recommended to cooperate with the after-school exercises and official experiments (Lab) of the corresponding chapters of CSAPP, and use GDB and performance analysis tools in the Linux terminal environment to personally verify the theory.
