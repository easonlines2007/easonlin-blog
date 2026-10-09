---
title: Lecture 30 · 尾递归与尾调用优化 (Tail Calls & Tail Recursion)
description: CS61A 第 30 讲：尾递归与尾调用优化 (Tail Calls & Tail Recursion)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 30
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：32:50 ｜ **视频回链**：[B 站对应单集 (P30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30)

## 1. 函数式编程的承诺与效率悖论 (Functional Programming & Referential Transparency)

函数式编程具有非凡的理论优势：
1. **纯函数无副作用**：函数的行为只取决于输入实参；
2. **引用透明（Referential Transparency）**：任何子表达式都可以直接用其求值结果替换，而不会改变程序的语义。这为**自动并行化计算（Automatic Parallelization）**和**记忆化缓存（Memoization）**奠定了坚实基础；
3. **消除可变状态**：没有变量重绑定，彻底消除了并发竞态。

![函数式编程的承诺与效率悖论 (Functional Programming & Referential Transparency) · 课堂板书演示 (00:00:35)](</attachments/cs61a-a44f15508422661db959c1be.png>)
*⏱ 时间戳：00:00:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:00:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=35)*

然而，缺乏可变循环控制流引发了一个关键质疑：**没有 `for` 和 `while` 循环，函数式语言如何实现高效率的迭代计算？** 尾递归正是这一难题的完美答案。

---

## 2. 递归 vs 迭代：空间复杂度的鸿沟 (Recursion vs Iteration in Python)

以阶乘计算辅助函数 $k \times n!$ 为例，我们在 Python 中对比递归与迭代两种写法：

```python
# 递归版本 (Linear Recursive in Python)
def factorial_rec(n, k):
    if n == 0:
        return k
    return factorial_rec(n - 1, k * n)

# 迭代版本 (Iterative with while)
def factorial_iter(n, k):
    while n > 0:
        n, k = n - 1, k * n
    return k
```

![迭代版本 (Iterative with while) · 课堂板书演示 (00:02:32)](</attachments/cs61a-388a3ae7bb95e02ff8eac420.png>)
*⏱ 时间戳：00:02:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:02:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=152)*

- **时间复杂度**：两者均为 $O(n)$，执行相同次数的乘法和递减。
- **空间复杂度**：
  - `factorial_iter` 仅使用固定的两个局部变量 `n` 和 `k`，占用 **$O(1)$ 常数空间**；
  - `factorial_rec` 在 Python 中每次调用都分配一个新帧，占用 **$O(n)$ 线性空间**。

---

## 3. Scheme 语言规范：尾递归强制要求 (Properly Tail Recursive)

Scheme 语言正式标准（Revised^n Report on the Algorithmic Language Scheme）明确规定：
> **Scheme 的实现必须是真尾递归的（Properly Tail Recursive）。**  
> 这允许将迭代计算以纯递归过程的形式表达，而执行时仅占用恒定的常数空间。

![Scheme 语言规范：尾递归强制要求 (Properly Tail Recursive) · 课堂板书演示 (00:04:34)](</attachments/cs61a-81a64244e05290ccdd1d522e.png>)
*⏱ 时间戳：00:04:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:04:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=274)*

在 Scheme 中书写如下过程：
```scheme
(define (factorial n k)
  (if (zero? n)
      k
      (factorial (- n 1) (* k n))))
```
解释器必须保证该过程在执行时与底层的 `while` 循环消耗相同的常数空间。

---

## 4. 消除调用栈冗余帧 (Eliminating Redundant Frames)

为什么 Python 的递归调用无法复用空间？我们观察环境模型（Environment Model）：

![消除调用栈冗余帧 (Eliminating Redundant Frames) · 课堂板书演示 (00:05:38)](</attachments/cs61a-458c2805f928873a44d59489.png>)
*⏱ 时间戳：00:05:38 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:05:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=338)*

在 `factorial(4, 1)` 执行过程中：
- $F_1(n=4, k=1)$ 调用 $F_2(n=3, k=4)$；
- $F_2$ 调用 $F_3(n=2, k=12)$；
- $F_3$ 调用 $F_4(n=1, k=24)$；
- $F_4$ 调用 $F_5(n=0, k=24)$ 返回 `24`。
此时，$F_4$ 除了直接将 $F_5$ 的返回值传递给 $F_3$ 之外，**没有任何后续计算**！$F_3$、$F_2$、$F_1$ 同样只是充当“中转传话人”。

在递归调用发起的那一刻，上层帧的历史局部变量已经没有任何残留价值。尾调用优化的核心就是**直接丢弃或复用当前活动帧**。

---

## 5. 尾调用与尾上下文的形式化定义 (Tail Calls & Tail Contexts)

### 什么是尾调用 (Tail Call)？

> **尾调用（Tail Call）** 是指位于**尾上下文（Tail Context）**中的过程调用表达式。

![什么是尾调用 (Tail Call)？ · 课堂板书演示 (00:07:13)](</attachments/cs61a-ae5dd5c9ae04d2a68be38d29.png>)
*⏱ 时间戳：00:07:13 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:07:13)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=433)*

如果一个过程调用是当前过程返回前需要做的**最后一件事情**（即调用完成后的返回值直接成为当前过程的返回值，无需进行任何二次计算），那么该调用就是尾调用。

### 尾上下文判定规则 (Tail Context Rules)

一个表达式是否处于尾上下文，取决于其在父表达式中的语法位置：

![尾上下文判定规则 (Tail Context Rules) · 课堂板书演示 (00:08:43)](</attachments/cs61a-8991a546b81557fd378af443.png>)
*⏱ 时间戳：00:08:43 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:08:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=523)*

1. **Lambda 函数体**：`lambda` 表达式体中的**最后一个子表达式**处于尾上下文；
2. **If 条件分支**：若整个 `if` 表达式处于尾上下文，则其**第 2 个子表达式（Consequent）和第 3 个子表达式（Alternative）**也处于尾上下文；（注意：Predicate 谓词表达式绝不在尾上下文中！）
3. **Cond 分支**：处于尾上下文的 `cond` 表达式中，各子句的非谓词结果表达式处于尾上下文；
4. **And / Or 逻辑式**：处于尾上下文的 `and`/`or` 表达式的**最后一个子表达式**处于尾上下文；
5. **Begin 代码块**：处于尾上下文的 `begin` 块中的**最后一个子表达式**处于尾上下文。

---

## 6. 线性递归改写为尾递归：列表长度 (Rewriting `length` with Accumulator)

### 非尾递归的经典写法

```scheme
(define (length s)
  (if (null? s)
      0
      (+ 1 (length (cdr s)))))
```

![非尾递归的经典写法 · 课堂板书演示 (00:10:46)](</attachments/cs61a-98464887f214432f27a836a5.png>)
*⏱ 时间戳：00:10:46 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:10:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=646)*

- 整个 `if` 处于尾上下文，因此分支 `0` 和 `(+ 1 (length (cdr s)))` 处于尾上下文；
- 但是，最外层的调用是加法 `+`，内部的递归调用 `(length (cdr s))` 是加法操作符的操作数，**处于嵌套调用表达式中，绝非尾调用**！
- 当递归返回列表剩余长度后，当前帧还必须保留在栈上以等待执行加 1 操作。因此空间复杂度为 $O(n)$。

### 尾递归改写：累加器技术 (Accumulator Pattern)

通过引入辅助过程与累加器参数，把“回溯时累加”提前为“前进时累加”：

```scheme
(define (length-tail s)
  (define (length-iter s n)
    (if (null? s)
        n
        (length-iter (cdr s) (+ n 1))))
  (length-iter s 0))
```

![尾递归改写：累加器技术 (Accumulator Pattern) · 课堂板书演示 (00:12:49)](</attachments/cs61a-88d60895892bce2b0ced5d6a.png>)
*⏱ 时间戳：00:12:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:12:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=769)*

在 `length-iter` 中，递归调用 `(length-iter (cdr s) (+ n 1))` 位于 `if` 的 alternative 分支顶层，是完完全全的尾调用！因此空间复杂度直接降为 $O(1)$。

---

## 7. 解释器实战：尾调用优化演示 (`scheme.py`)

在 CS61A Project 4（Scheme 解释器）的 Extra Credit 部分，我们需要为解释器增加尾调用优化支持。

![解释器实战：尾调用优化演示 (scheme.py) · 课堂板书演示 (00:15:26)](</attachments/cs61a-7d8ac2a5447c17ad78ccf4a5.png>)
*⏱ 时间戳：00:15:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:15:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=926)*

### 未开启优化时的崩溃测试

在普通解释器中运行阶乘函数：
```scheme
(factorial 10)   ; => 3628800
(factorial 100)  ; => 正常返回
(factorial 1000) ; => 报错: RuntimeError: maximum recursion depth exceeded!
```

Python 解释器默认调用栈上限约为 1000 层，当调用到第 673 层左右时，因堆栈耗尽直接抛出异常崩溃。

![未开启优化时的崩溃测试 · 课堂板书演示 (00:17:06)](</attachments/cs61a-5ccf06014712fe12d4d72266.png>)
*⏱ 时间戳：00:17:06 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:17:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1026)*

### 开启优化后的无限制执行

开启尾调用优化（通过迭代循环 trampoline 或直接更新局部求值环境）后，即使计算 `(factorial 10000 1)`，解释器也绝不会新增任何活动栈帧，而是恒定以常数空间瞬时或平稳完成海量递归！

---

## 8. 诊断测试：辨析尾递归过程 (Diagnostic Exercises)

请分析以下四个 Scheme 过程，判断哪些是真正的尾递归（在常数空间内运行）：

![诊断测试：辨析尾递归过程 (Diagnostic Exercises) · 课堂板书演示 (00:18:36)](</attachments/cs61a-35b14a27ca54ac52b0a571e7.png>)
*⏱ 时间戳：00:18:36 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:18:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1116)*

### 案例 1：`contains?`

```scheme
(define (contains? s x)
  (cond ((null? s) #f)
        ((= (car s) x) #t)
        (else (contains? (cdr s) x))))
```

![案例 1：contains? · 课堂板书演示 (00:20:08)](</attachments/cs61a-c61e25c53b3776c8ebea7d07.png>)
*⏱ 时间戳：00:20:08 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:20:08)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1208)*

- **分析**：`cond` 的 `else` 分支直接返回递归调用结果，没有任何挂起操作。
- **结论**：**是尾递归**，空间复杂度 $O(1)$。

### 案例 2：`has-repeat?`

```scheme
(define (has-repeat? s)
  (if (null? s)
      #f
      (if (contains? (cdr s) (car s))
          #t
          (has-repeat? (cdr s)))))
```

- **分析**：对 `has-repeat?` 的递归调用处于嵌套 `if` 的 alternative 尾上下文中；调用 `contains?` 虽非尾调用，但 `contains?` 自身为 $O(1)$ 空间。
- **结论**：**是尾递归**，空间复杂度 $O(1)$。

### 案例 3：`fib-iter`

```scheme
(define (fib-iter n)
  (define (helper k current prev)
    (if (= k n)
        current
        (helper (+ k 1) (+ current prev) current)))
  (if (zero? n) 0 (helper 1 1 0)))
```

![案例 3：fib-iter · 课堂板书演示 (00:22:11)](</attachments/cs61a-933bd483b2f1a97c6d8b0af1.png>)
*⏱ 时间戳：00:22:11 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:22:11)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1331)*

- **分析**：所有参数计算（如 `(+ current prev)`）均在进入下一轮调用前完成，递归调用 `helper` 处于尾上下文。
- **结论**：**是尾递归**，空间复杂度 $O(1)$。

---

## 9. 高阶函数的尾递归改造：`reduce` 与 `map`

### 尾递归的 `reduce`

```scheme
(define (reduce fn s start)
  (if (null? s)
      start
      (reduce fn (cdr s) (fn start (car s)))))
```

![尾递归的 reduce · 课堂板书演示 (00:23:41)](</attachments/cs61a-b802cfb766fb0d17b8a37186.png>)
*⏱ 时间戳：00:23:41 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:23:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1421)*

递归调用 `reduce` 处于尾上下文，新累加值 `(fn start (car s))` 作为实参传入。只要传入的过程 `fn` 本身运行在常数空间，整个 `reduce` 就在 $O(1)$ 空间内运行。

---

## 10. 高难度挑战：常数空间的尾递归 `map` (Tail Recursive `map`)

标准 `map` 的传统递归定义必须等待后续子列表返回后执行 `cons`，因而占用 $O(n)$ 线性空间：

```scheme
(define (map fn s)
  (if (null? s)
      nil
      (cons (fn (car s)) (map fn (cdr s))))) ; 非尾调用！
```

![高难度挑战：常数空间的尾递归 map (Tail Recursive map) · 课堂板书演示 (00:26:20)](</attachments/cs61a-3a434c73aa137a5cad39404c.png>)
*⏱ 时间戳：00:26:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:26:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1580)*

如何在不消耗额外帧空间的前提下实现 `map`？

### 技巧：先逆序累加，再尾递归反转

![技巧：先逆序累加，再尾递归反转 · 课堂板书演示 (00:28:19)](</attachments/cs61a-b84f217adbd76a51db6ee429.png>)
*⏱ 时间戳：00:28:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:28:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1699)*

```scheme
;; 1. 尾递归的逆序 map
(define (map-reverse fn s acc)
  (if (null? s)
      acc
      (map-reverse fn (cdr s) (cons (fn (car s)) acc))))

;; 2. 尾递归的列表反转
(define (reverse s acc)
  (if (null? s)
      acc
      (reverse (cdr s) (cons (car s) acc))))

;; 3. 组合出真正的尾递归 map
(define (map-tail fn s)
  (reverse (map-reverse fn s nil) nil))
```

在构造新列表的同时，累加器顺次在头部压入元素，得到逆序列表；随后利用尾递归的 `reverse` 将其翻转。整个过程中所有递归调用均处于尾上下文，空间开销严格保持常数！

---

## 11. 哲学升华：程序是专用机器，解释器是通用机器 (Universal Computing Machine)

在本讲的结尾，John DeNero 教授给出了一个极富启发的计算本质视角：

![哲学升华：程序是专用机器，解释器是通用机器 (Universal Computing Machine) · 课堂板书演示 (00:30:58)](</attachments/cs61a-31a5e3ea34b926bb157b2a7c.png>)
*⏱ 时间戳：00:30:58 · 📷 课堂截图 · [在 B 站观看对应片段 (P30 00:30:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1858)*

- **专用计算机器（Special-Purpose Machine）**：每一个具体程序（如计算阶乘的函数）就像一台特定功能的物理齿轮装置，输入 $5$，内部流水线运转，输出 $120$。
- **通用计算机器（Universal Machine / Interpreter）**：解释器本身并不固化任何具体的业务逻辑。它同时接受**两样输入**：
  1. 源代码程序（描述某台特定机器的蓝图）；
  2. 该程序所需的输入数据。
  解释器在内存中动态模拟这台机器的物理运转！

这正是阿兰·图灵（Alan Turing）在 1936 年提出的**通用图灵机（Universal Turing Machine）**的思想内核。我们在 Project 4 中亲手编写的 Scheme 解释器，本质上就是一台能够模拟宇宙中任何可计算过程的通用计算机。

---

## 核心复习要点总结

| 核心术语 | 核心定义与关键法则 |
| :--- | :--- |
| **尾调用 (Tail Call)** | 位于尾上下文中的过程调用。其返回值即为外层过程的最终返回值，调用后无需后续计算。 |
| **尾上下文 (Tail Context)** | 过程体最后一条语句、处于尾上下文的 `if` 表达式的两个分支表达式等。 |
| **尾调用优化 (TCO)** | 编译器/解释器复用当前调用帧，支持无限次尾调用而仅消耗 $O(1)$ 常数空间。 |
| **累加器模式 (Accumulator)** | 将中间计算结果作为实参传递给下一轮递归调用，使计算在“向下深入”时发生，从而将线性递归转为尾递归。 |
| **通用计算机器** | 解释器接受程序文本与数据作为输入，具备模拟任意计算过程的能力。 |

---

