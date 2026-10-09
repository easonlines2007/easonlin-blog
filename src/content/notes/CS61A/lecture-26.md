---
title: Lecture 26 · 函数式语言 Scheme 基础 (Scheme)
description: CS61A 第 26 讲：函数式语言 Scheme 基础 (Scheme)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 26
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：31:14 ｜ **视频回链**：[B 站对应单集 (P26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26)

## 1. 核心心智模型与架构图解

从本讲开始，课程正式进入第四个核心里程碑——**函数式编程与解释器构造（Interpreters & Scheme）**。通过学习 Scheme 语言，我们将看到计算的核心理念如何在不同语言之间自由迁移，并最终在 Project 4 中亲手用 Python 实现一个完整的 Scheme 解释器。

```
                    ┌──────────────────────────────────────────────┐
                    │            Scheme 表达式分类体系             │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │   基本表达式 (Primitives)   │               │     组合式 (Combinations)   │
     ├─────────────────────────────┤               ├─────────────────────────────┤
     │ • 自求值: 2, 3.14, #t, #f   │               │ 形式: (operator operand...) │
     │ • 符号 (Symbols): +, abs    │               │ 括号前置，空格无关         │
     └─────────────────────────────┘               └──────────────┬──────────────┘
                                                                  │
                                   ┌──────────────────────────────┴──────────────────────────────┐
                                   ▼                                                             ▼
                    ┌─────────────────────────────┐                               ┌─────────────────────────────┐
                    │    调用表达式 (Call Expr)   │                               │     特殊形式 (Special Form) │
                    ├─────────────────────────────┤                               ├─────────────────────────────┤
                    │ • 先求值操作符与全部操作数  │                               │ • 特殊求值规则 (不全求值)   │
                    │ • 应用过程于参数            │                               │ • if, and, or, define       │
                    │ • 示例: (+ 1 2) -> 3        │                               │ • cond, begin, let, lambda  │
                    └─────────────────────────────┘                               └─────────────────────────────┘
```

### Lisp 与 Scheme 的传奇美学

![Lisp 与 Scheme 的传奇美学 · 课堂板书演示 (00:00:55)](</attachments/cs61a-3f9e935696fd7966714cc8b4.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=55)*

> *"Lisp is over half a century old, and it still has a timeless air about it. Elegant weapons for a more civilized age."* —— XKCD
- **历史渊源**：Lisp 由图灵奖得主 John McCarthy 于 1958 年创立，是计算机科学史上除 Fortran 之外最古老的现役语言。
- **哲学基石**：代码即数据（Homoiconicity），语法核心极其纯粹，全套核心语法仅需一天即可掌握，却能构建出极为精巧复杂的抽象体系。

---

## 2. Scheme 语法与前缀组合式 (Expressions & Combinations)

Scheme 程序的全部构成单位都是**表达式**：

![Scheme 语法与前缀组合式 (Expressions & Combinations) · 课堂板书演示 (00:02:15)](</attachments/cs61a-089b6a574dec64171e169358.png>)
*⏱ 时间戳：00:02:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=135)*

![Scheme 语法与前缀组合式 (Expressions & Combinations) · 课堂板书演示 (00:03:45)](</attachments/cs61a-a463b9c6d4d750f9cadb5837.png>)
*⏱ 时间戳：00:03:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=225)*

### 表达式求值规则

1. **基本自求值表达式 (Self-evaluating)**：数值（`2`, `3.14`）、布尔值（`#t` 表示 True，`#f` 表示 False）。
2. **符号 (Symbols)**：在环境中查找其绑定的值（如 `+` 绑定到底层加法过程）。
3. **调用表达式 (Call Expressions)**：
   - 语法：`(<operator> <operand_0> <operand_1> ... <operand_k>)`
   - 求值：先递归求值操作符和所有操作数，然后将得到的过程应用（Apply）于实参列表。

![表达式求值规则 · 课堂板书演示 (00:05:45)](</attachments/cs61a-1fa0e7dfe2f8b7b1897d804c.png>)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=345)*

### 交互式 REPL 演示与变参过程

```scheme
;; 前缀算术表达
(+ 1 2 3 4)     ; 10 (加法过程支持任意多个参数)
(+)             ; 0  (加法单位元)
(*)             ; 1  (乘法单位元)
(* 2 2 2 3 3 3) ; 216

;; 嵌套表达式 (缩进只为人类易读，解释器只关注括号闭合)
(+ (* 3 (+ (* 2 4) (+ 3 5)))
   (+ (- 10 7) 6))  ; 57
```

### 谓词命名惯例 (Predicates)

![谓词命名惯例 (Predicates) · 课堂板书演示 (00:07:15)](</attachments/cs61a-787ecd117a9f8247c85c9977.png>)
*⏱ 时间戳：00:07:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=435)*

在 Scheme 中，返回布尔值的过程通常以问号 `?` 结尾，这是符号名称的合法组成部分：

```scheme
(number? 3)       ; #t
(zero? (- 2 2))   ; #t
(integer? 2.2)    ; #f
```

---

## 3. 核心特殊形式：条件与符号绑定 (Special Forms)

凡是不遵循“先求值操作符与所有操作数”标准规则的组合式，统称为**特殊形式（Special Forms）**。

![核心特殊形式：条件与符号绑定 (Special Forms) · 课堂板书演示 (00:09:15)](</attachments/cs61a-7730751cdbf1c678203e4359.png>)
*⏱ 时间戳：00:09:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=555)*

![核心特殊形式：条件与符号绑定 (Special Forms) · 课堂板书演示 (00:10:45)](</attachments/cs61a-d5a59ac3954f40c569b47d8d.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=645)*

### 1. `if` 条件分支

```scheme
(if <predicate> <consequent> <alternative>)
```
- **短路求值**：先求值 `<predicate>`；若为真（除 `#f` 外的一切值均为真），则**仅求值** `<consequent>`，绝不执行 `<alternative>`。

### 2. `define` 符号绑定与过程定义

![define 符号绑定与过程定义 · 课堂板书演示 (00:12:45)](</attachments/cs61a-43c5fa98227ab96120f010f9.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=765)*

```scheme
;; 绑定常量符号
(define pi 3.14)

;; 定义过程语法糖：(define (<name> <param1> ...) <body>)
(define (square x)
  (* x x))

(define (average x y)
  (/ (+ x y) 2))

(square 16)      ; 256
(average 3 7)    ; 5
```

### 3. 巴比伦求平方根：嵌套定义与词法作用域

![巴比伦求平方根：嵌套定义与词法作用域 · 课堂板书演示 (00:14:45)](</attachments/cs61a-7cdea10d2a82248d5d01e385.png>)
*⏱ 时间戳：00:14:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=885)*

Scheme 完全支持词法作用域（Lexical Scope），内部辅助过程可自由闭包捕获外部形参：

```scheme
(define (sqrt x)
  (define (update guess)
    (if (= (square guess) x)
        guess
        (update (average guess (/ x guess)))))
  (update 1))

(sqrt 256)  ; 16
```

---

## 4. Lambda 匿名过程与一等公民 (Lambda Expressions)

![Lambda 匿名过程与一等公民 (Lambda Expressions) · 课堂板书演示 (00:16:15)](</attachments/cs61a-91fe4a2cc216fec04a19d0d4.png>)
*⏱ 时间戳：00:16:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=975)*

Scheme 中使用 `lambda` 特殊形式创建匿名过程：

```scheme
(lambda (<param1> <param2> ...) <body>)
```

在底层，过程定义语句仅仅是将一个 `lambda` 绑定到指定符号的语法糖：

```scheme
;; 语法糖写法
(define (plus4 x) (+ x 4))

;; 等价的原始 lambda 绑定
(define plus4 (lambda (x) (+ x 4)))

;; 直接作为组合式操作符即时调用
((lambda (x y z) (+ x y (square z))) 1 2 3)  ; 1 + 2 + 9 = 12
```

---

## 5. 高级特殊形式：cond, begin 与 let

![高级特殊形式：cond, begin 与 let · 课堂板书演示 (00:18:15)](</attachments/cs61a-b153e09175ccb7fca9e28cfa.png>)
*⏱ 时间戳：00:18:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1095)*

### 1. `cond` 多分支条件表达式

相当于 Python 中的 `if ... elif ... else`：

```scheme
(cond
  ((> x 10) 'big)
  ((> x 5)  'medium)
  (else     'small))
```

### 2. `begin` 顺序复合表达式

![begin 顺序复合表达式 · 课堂板书演示 (00:20:15)](</attachments/cs61a-11e2ba8d09ca2a568d104cd7.png>)
*⏱ 时间戳：00:20:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1215)*

当需要在只能放置单一表达式的语法槽中依次执行多条语句（通常用于打印或副作用）时使用：

```scheme
(begin
  (print 'first)
  (print 'second)
  (+ 2 3))  ; 整个 begin 表达式的值为最后一条子表达式的结果 5
```

### 3. `let` 局部临时绑定

![let 局部临时绑定 · 课堂板书演示 (00:22:15)](</attachments/cs61a-843c1b0a4444521334c0b2e9.png>)
*⏱ 时间戳：00:22:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1335)*

`let` 允许引入仅在当前代码块生效的局部变量，计算结束后立即销毁，杜绝全局命名空间污染：

```scheme
;; 计算直角三角形斜边：局部绑定 a 与 b
(define c
  (let ((a 3)
        (b (+ 2 2)))
    (sqrt (+ (square a) (square b)))))

;; 此处 a 与 b 不存在，只有 c = 5 永久保留
```

---

## 6. Scheme 实战：海龟绘图与谢尔宾斯基分形三角

课程环境内置了 Logo 式的海龟绘图（Turtle Graphics）模块，完美展现了高阶过程与递归分形的几何之美：

![Scheme 实战：海龟绘图与谢尔宾斯基分形三角 · 课堂板书演示 (00:24:45)](</attachments/cs61a-5b8a5e1512a5da83ab7be0dc.png>)
*⏱ 时间戳：00:24:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1485)*

![Scheme 实战：海龟绘图与谢尔宾斯基分形三角 · 课堂板书演示 (00:26:45)](</attachments/cs61a-34904a1f446d6913ecf6edff.png>)
*⏱ 时间戳：00:26:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1605)*

![Scheme 实战：海龟绘图与谢尔宾斯基分形三角 · 课堂板书演示 (00:28:45)](</attachments/cs61a-1b79081d46e6884e47933aa7.png>)
*⏱ 时间戳：00:28:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1725)*

![Scheme 实战：海龟绘图与谢尔宾斯基分形三角 · 课堂板书演示 (00:30:15)](</attachments/cs61a-db55c6b749a98c6296d2e0b0.png>)
*⏱ 时间戳：00:30:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P26 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1815)*

### 互递归分形三角实现代码

```scheme
;; 高阶重复执行过程
(define (repeat k fn)
  (fn)
  (if (> k 1) (repeat (- k 1) fn)))

;; 绘制任意边长三角形
(define (tri fn)
  (repeat 3 (lambda () (fn) (right 120))))

;; 谢尔宾斯基分形三角形
(define (sier d k)
  (tri (lambda () (if (= d 1) (fd k) (leg d k)))))

(define (leg d k)
  (sier (- d 1) (/ k 2))
  (penup) (fd k) (pendown))
```

- **基例（$d=1$）**：直接绘制一条长度为 $k$ 的直线；
- **递归步（$d>1$）**：当前三角形的每条边由更小规模的谢尔宾斯基三角构成，通过抬笔（`penup`）、前进（`fd`）、落笔（`pendown`）在画板上绽放出令人惊叹的分形结构。

---

## 7. 章节总结与核心考点

1. **同构性与语法极简**：Scheme 严格统一使用前缀括号表示组合式；代码与数据形式完全一致。
2. **常规调用 vs 特殊形式**：常规调用求值所有子表达式；特殊形式（`if`, `define`, `lambda`, `cond`, `let`）具有独特的执行控制流。
3. **词法作用域与一等过程**：过程可以作为参数、返回值、局部闭包存在，为后续自制解释器奠定基础。

---

