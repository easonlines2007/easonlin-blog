---
title: Lecture 31 · 代码即数据与元编程 (Programs as Data)
description: CS61A 第 31 讲：代码即数据与元编程 (Programs as Data)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 31
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：18:06 ｜ **视频回链**：[B 站对应单集 (P31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31)

## 1. 代码即数据：同像性原理 (Programs as Data & Homoiconicity)

Scheme 的所有非基础表达式（组合式，Combination）在内存中都是通过标准列表（链表）表示的：

```scheme
;; 构造一个二元除法代码列表
(list 'quotient 10 2) ; => (quotient 10 2)
```

![代码即数据：同像性原理 (Programs as Data & Homoiconicity) · 课堂板书演示 (00:00:30)](</attachments/cs61a-0e6dc1f9fcddff27819bb9c9.png>)
*⏱ 时间戳：00:00:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:00:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=30)*

求值该列表并不会立即执行除法，它仅仅生成了一个包含三个元素（符号 `quotient`、数字 `10`、数字 `2`）的普通列表数据。

---

## 2. 内置 `eval`：数据与代码的任意转换 (The `eval` Procedure)

如果一个列表的结构符合合法的 Scheme 语法，我们就可以将其传递给内置的 `eval` 过程：

```scheme
(define expr (list 'quotient 10 2))
(eval expr) ; => 5
```

![内置 eval：数据与代码的任意转换 (The eval Procedure) · 课堂板书演示 (00:01:29)](</attachments/cs61a-da7accd49b1fd5227fc0f690.png>)
*⏱ 时间戳：00:01:29 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:01:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=89)*

- Python 虽然也有内置的 `eval("10 // 2")`，但 Python 只能解析非结构化的文本字符串；
- Scheme 的独特威力在于：**代码天生就是结构化的链表数据**。你可以使用所有的列表操作函数（`cons`、`car`、`cdr`、`map`、`filter`）任意操纵、组装和变换程序的抽象语法树（AST），然后一键调用 `eval` 执行它！

---

## 3. 符号引用与表达式求值机制

在交互式解释器中，我们可以清晰分辨普通表达式求值与构造代码列表的区别：

![符号引用与表达式求值机制 · 课堂板书演示 (00:02:29)](</attachments/cs61a-6eb161605a9f6f3ba0eb98ca.png>)
*⏱ 时间戳：00:02:29 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:02:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=149)*

```scheme
(+ 1 2)         ; => 3 (立即执行加法)
(list '+ 1 2)   ; => (#[primitive:+] 1 2) (直接求值了 + 符号)
(list '+ 1 2)   ; 传递带引用的符号: (list '+ 1 2) => (+ 1 2)
```

只要通过单引号 `'` 阻止操作符被立即求值，它就能以符号形式安全地嵌入到新建的表达式列表中。

---

## 4. 计算数值 vs 生成表达式：阶乘的两种视角

考虑经典的递归阶乘函数。我们不仅可以编写返回计算结果数值的函数，还可以编写**返回完整计算表达式树**的元程序：

```scheme
;; 常规版本：返回数值 120
(define (fact n)
  (if (zero? n)
      1
      (* n (fact (- n 1)))))

;; 元编程版本：返回计算表达式树
(define (fact-exp n)
  (if (zero? n)
      1
      (list '* n (fact-exp (- n 1)))))
```

![计算数值 vs 生成表达式：阶乘的两种视角 · 课堂板书演示 (00:03:57)](</attachments/cs61a-2888b064572f0e15e4862599.png>)
*⏱ 时间戳：00:03:57 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:03:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=237)*

运行测试对比：
```scheme
(fact 5)     ; => 120
(fact-exp 5) ; => (* 5 (* 4 (* 3 (* 2 (* 1 1)))))
```

![计算数值 vs 生成表达式：阶乘的两种视角 · 课堂板书演示 (00:04:57)](</attachments/cs61a-151a6fd12efdd1ca1b74073c.png>)
*⏱ 时间戳：00:04:57 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:04:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=297)*

生成的表达式直观呈现了阶乘递归展开的完整计算全貌！如果对该表达式调用 `(eval (fact-exp 5))`，即可立即得到 `120`。

---

## 5. 树递归表达式展开：斐波那契数列

同样的技巧可以应用于树形递归。我们可以编写 `fib-exp` 来可视化斐波那契数的加法展开树：

```scheme
(define (fib-exp n)
  (if (<= n 1)
      n
      (list '+ (fib-exp (- n 2)) (fib-exp (- n 1)))))
```

![树递归表达式展开：斐波那契数列 · 课堂板书演示 (00:06:00)](</attachments/cs61a-01146c30e2d2d747adb03285.png>)
*⏱ 时间戳：00:06:00 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:06:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=360)*

![树递归表达式展开：斐波那契数列 · 课堂板书演示 (00:07:01)](</attachments/cs61a-f6548e4e26d9e5aa0aa40726.png>)
*⏱ 时间戳：00:07:01 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:07:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=421)*

执行 `(fib-exp 6)` 会生成一个由 `+` 与基线数值 `0`、`1` 组成的庞大嵌套列表；而对其求值 `(eval (fib-exp 6))` 则精确得到 Fibonacci 第 6 项的值 `8`。

---

## 6. 准引用语法：Backtick 与 Unquote (Quasi-quotation)

手动使用 `list` 和 `'` 拼接复杂代码极易引发括号混乱。为此，Scheme 提供了强大的模板语法——**准引用（Quasi-quotation）**：

| 语法符号 | 名称 | 语义 |
| :--- | :--- | :--- |
| **反引号 \`** | Quasi-quote (准引用) | 类似于普通单引号引用，但允许内部进行局部求值插入 |
| **逗号 ,** | Unquote (解引用) | 仅在准引用内部有效，强制解释器对其后面的子表达式进行即时求值并替换 |

![准引用语法：Backtick 与 Unquote (Quasi-quotation) · 课堂板书演示 (00:08:01)](</attachments/cs61a-38eac3ceeac1129f53b9b689.png>)
*⏱ 时间戳：00:08:01 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:08:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=481)*

### 静态引用 vs 准引用对比

假设先在环境中绑定 `(define b 4)`：

```scheme
'(a (+ b 1))  ; => (a (+ b 1)) (全部视为字面符号，不求值)
`(a ,(+ b 1)) ; => (a 5)       (a 保持字面符号，(+ b 1) 被动态求值替换为 5!)
```

![静态引用 vs 准引用对比 · 课堂板书演示 (00:09:26)](</attachments/cs61a-e6028822983d3035ece2de37.png>)
*⏱ 时间戳：00:09:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:09:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=566)*

### 代码模板工厂：`make-add-procedure`

利用准引用，我们可以动态生成特定参数的函数定义代码：

```scheme
(define (make-add-procedure n)
  `(lambda (d) (+ d ,n)))

(make-add-procedure 2) ; => (lambda (d) (+ d 2))
```

![代码模板工厂：make-add-procedure · 课堂板书演示 (00:10:54)](</attachments/cs61a-eb1c21f23f347c7da3e9b393.png>)
*⏱ 时间戳：00:10:54 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:10:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=654)*

这里的参数 `n` 在代码生成阶段被精确替换为常数 `2`，从而生成了一个专用的单参数自增过程源代码！

---

## 7. 实践挑战：用代码生成填补语言特性缺失 (Simulating While Loops)

Scheme 语言为了保持极简内核，没有提供 `while` 循环语句。假设我们需要计算前几个偶数的平方和：

```python
# Python 原生写法
x, total = 2, 0
while x < 10:
    total += x * x
    x += 2
# total => 120
```

![total => 120 · 课堂板书演示 (00:11:53)](</attachments/cs61a-2ce5e168324adecec89abeb9.png>)
*⏱ 时间戳：00:11:53 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:11:53)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=713)*

在 Scheme 中，程序员每次都需要手工编写繁琐的尾递归辅助函数：

```scheme
(define (f x total)
  (if (< x 10)
      (f (+ x 2) (+ total (* x x)))
      total))
(f 2 0) ; => 120
```

如果我们有成百上千个不同的循环计算需求，每次都手写递归极其冗长乏味。能否让 Scheme 自动为我们生成并执行这段样板代码？

![total => 120 · 课堂板书演示 (00:13:21)](</attachments/cs61a-6db908953280e7caa1ac8fc7.png>)
*⏱ 时间戳：00:13:21 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:13:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=801)*

---

## 8. 通用循环代码生成器：`sum-while`

通过准引用模板，我们可以编写一个通用的 `sum-while` 元过程：

```scheme
(define (sum-while initial-x condition add-term update-x)
  `(begin
     (define (f x total)
       (if ,condition
           (f ,update-x (+ total ,add-term))
           total))
     (f ,initial-x 0)))
```

![通用循环代码生成器：sum-while · 课堂板书演示 (00:14:21)](</attachments/cs61a-9fb115acf141015e32a7ceab.png>)
*⏱ 时间戳：00:14:21 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:14:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=861)*

![通用循环代码生成器：sum-while · 课堂板书演示 (00:15:48)](</attachments/cs61a-711c4b2b7417e71d4536a629.png>)
*⏱ 时间戳：00:15:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:15:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=948)*

### 代码生成与动态求值运行

测试 1：计算 $1 + 2 + \dots + 7 = 28$（在 $x^2 < 50$ 范围内的整数和）：
```scheme
(define code (sum-while 1 '(< (* x x) 50) 'x '(+ x 1)))
(eval code) ; => 28
```

测试 2：计算偶数平方和 $2^2 + 4^2 + 6^2 + 8^2 = 120$：
```scheme
(define code2 (sum-while 2 '(< x 10) '(* x x) '(+ x 2)))
(eval code2) ; => 120
```

![代码生成与动态求值运行 · 课堂板书演示 (00:16:48)](</attachments/cs61a-00bda44828124845767866f5.png>)
*⏱ 时间戳：00:16:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:16:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=1008)*

解释器接收 `sum-while` 生成的列表代码结构，使用 `eval` 动态定义局部尾递归函数 `f` 并发起初始调用，最终精确返回 `120`！

---

## 9. 总结：元编程的无上威力 (The Power of Metaprogramming)

Lisp 与 Scheme 之所以在计算机科学史上占据神圣地位，正是源于这种“能够编写程序的程序”的终极表现力。

![总结：元编程的无上威力 (The Power of Metaprogramming) · 课堂板书演示 (00:17:50)](</attachments/cs61a-959e8bc9d6f211750d98b192.png>)
*⏱ 时间戳：00:17:50 · 📷 课堂截图 · [在 B 站观看对应片段 (P31 00:17:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=1070)*

- 程序可以像处理普通数据一样审视自身、重构自身、生成新的抽象；
- 这种代码生成模式正是下一讲宏（**Macros**）的基础；
- 它将程序员从机械的重复劳动中彻底解放，赋予了我们在已有语言中创造新语言构造的造物主能力。

---

## 关键知识点速查

| 概念 | 核心功能与语法 | 典型使用场景 |
| :--- | :--- | :--- |
| **代码即数据 (Homoiconicity)** | 组合式即 Scheme 链表数据 | 允许直接使用链表操作函数构建与分析 AST |
| **`eval` 过程** | `(eval expr)` | 执行动态构建或生成的 Scheme 列表表达式 |
| **准引用 (Quasi-quote)** | 语法符号 \` | 声明一个允许局部动态插值的代码模板 |
| **解引用 (Unquote)** | 语法符号 `,` | 在模板中强行求值指定子表达式并将结果填入 |
| **代码生成 (Code Generation)** | 接受参数生成语法树 | 自动消除样板递归代码，构建高级语法结构 |

---

