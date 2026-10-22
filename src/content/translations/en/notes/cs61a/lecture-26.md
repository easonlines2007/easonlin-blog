---
kind: notes
source: cs61a/lecture-26
title: "Lecture 26 · Scheme: Introduction to a Functional Language"
description: "CS61A Lecture 26: Fundamentals of the Scheme functional programming language."
sourceHash: aaf5d330884cb31323323bcd29fe67137fe1111da9b622190e7e278f27275996
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-26).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 31:14 ｜ **Video link back**: [B station response unit set (P26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26)

## 1. Core mind model and architecture

From this talk, the course officially entered the fourth core milestone **Interpreters & Scheme) is a software development platform for the development of functional programming and interpreting.** By learning the Scheme language, we will see how computational core psychology moves freely between languages and ultimately develops a complete Scheme interpreter in Python for Project 4.

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

### The legendary aesthetics of Lisp and Scheme

![The legendary aesthetics of Lisp and Scheme · lecture board illustration (00:00:55)](</attachments/cs61a-3f9e935696fd7966714cc8b4.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P26 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=55)*

> *"Lisp is over half a century old, and it still has a timeless air about it. Elegant weapons for a more civilized age."* —— XKCD
- **Historical sources** Lisp: Founded in 1958 by John McCarthy, a Turing Prize winner, is the oldest living language outside Fortran in computer science history.
- **Underlying principle** The code is data (Homoiconicity), the core of syntax is extremely pure, and the entire set of core syntax can be mastered in a day, but it can build an extremely sophisticated and complex abstraction system.

---

## 2. Scheme Grammar and Expressions & Combinations

The Scheme is a program that has been developed by the National Institute of Standards and Technology (NIST) to help develop the system. **expression**: 

![Scheme Syntax and Expressions & Combinations · lecture board illustration (00:02:15)](</attachments/cs61a-089b6a574dec64171e169358.png>)
*⏱ Timestamp: 00:02:15 · 📷 Lecture screenshot · [Watch clip (P26 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=135)*

![Scheme Syntax and Expressions & Combinations · lecture board illustration (00:03:45)](</attachments/cs61a-a463b9c6d4d750f9cadb5837.png>)
*⏱ Timestamp: 00:03:45 · 📷 Lecture screenshot · [Watch clip (P26 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=225)*

### The rules of expression evaluation

1. **Basic from evaluation expression (Self-evaluating)** The number of words `2`, `3.14` (Bull value) `#t`  The word "true" is used to describe the `#f`  The name of the game is False.
2. **The symbols** The following is a list of the most commonly used methods for calculating the value of a data set.  `+`  The first is the process of binding to the underlying additive.
3. **Call Expressions**: 
   - The wording: `(<operator> <operand_0> <operand_1> ... <operand_k>)`
   - evaluation: First recursionevaluation operator and all operands, then the resulting process is applied to the argument list.

![The rules of expression evaluation · lecture board illustration (00:05:45)](</attachments/cs61a-1fa0e7dfe2f8b7b1897d804c.png>)
*⏱ Timestamp: 00:05:45 · 📷 Lecture screenshot · [Watch clip (P26 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=345)*

### Interactive REPL demonstration and transformation process

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

### Predicates is a word-naming convention.

![The first is the "Predicates" lecture board illustration (00:07:15)](</attachments/cs61a-787ecd117a9f8247c85c9977.png>)
*⏱ Timestamp: 00:07:15 · 📷 Lecture screenshot · [Watch clip (P26 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=435)*

In Scheme, the process of returning a Bul value is usually done by asking  `?`  Finally, this is the legal component of the symbol's name:

```scheme
(number? 3)       ; #t
(zero? (- 2 2))   ; #t
(integer? 2.2)    ; #f
```

---

## 3. Core Special Forms: Conditions and symbol binding

Any combination of the operator that does not follow a pre-evaluation operation with all operand standard rules is called **The following is a list of the most common types of forms:**.

![Core special form: Conditional Forms lecture board illustration (00:09:15)](</attachments/cs61a-7730751cdbf1c678203e4359.png>)
*⏱ Timestamp: 00:09:15 · 📷 Lecture screenshot · [Watch clip (P26 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=555)*

![The following is a list of the most common types of lecture board illustration (00:10:45)](</attachments/cs61a-d5a59ac3954f40c569b47d8d.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P26 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=645)*

### 1. `if`  Conditional Branches

```scheme
(if <predicate> <consequent> <alternative>)
```
- **short-circuit evaluation** The first evaluation  `<predicate>` If true, except  `#f`  All values outside are true) **Just evaluation** `<consequent>` It will never be fulfilled.  `<alternative>`.

### 2. `define`  Symbol binding and process definition

![Definition of the symbols and process definitions · lecture board illustration (00:12:45)](</attachments/cs61a-43c5fa98227ab96120f010f9.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P26 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=765)*

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

### Babylon for the square root: nested definition and lexicalscope

![Babylon for the Square Roots: Nested Definition with lexical scope · lecture board illustration (00:14:45)](</attachments/cs61a-7cdea10d2a82248d5d01e385.png>)
*⏱ Timestamp: 00:14:45 · 📷 Lecture screenshot · [Watch clip (P26 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=885)*

The Scheme fully supports lexicalscope (Lexical Scope), and the internal auxiliary process allows free closure capture of external parameters:

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

## Lambda Anonymous Process with First Class Citizens (Lambda Expressions)

![Lambda Anonymous Process with First Class Citizens (Lambda Expressions) · lecture board illustration (00:16:15)](</attachments/cs61a-91fe4a2cc216fec04a19d0d4.png>)
*⏱ Timestamp: 00:16:15 · 📷 Lecture screenshot · [Watch clip (P26 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=975)*

Used in Scheme  `lambda`  The first is the creation of an anonymous process:

```scheme
(lambda (<param1> <param2> ...) <body>)
```

At the bottom, process defining statements is simply a way to  `lambda`  The syntax of the symbols is:

```scheme
;; 语法糖写法
(define (plus4 x) (+ x 4))

;; 等价的原始 lambda 绑定
(define plus4 (lambda (x) (+ x 4)))

;; 直接作为组合式操作符即时调用
((lambda (x y z) (+ x y (square z))) 1 2 3)  ; 1 + 2 + 9 = 12
```

---

## 5. High-level special form:cond, begin and let

![High-level special form: second, start with let · lecture board illustration (00:18:15)](</attachments/cs61a-b153e09175ccb7fca9e28cfa.png>)
*⏱ Timestamp: 00:18:15 · 📷 Lecture screenshot · [Watch clip (P26 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1095)*

### 1. `cond`  Maybe the conditioned expression

It's the equivalent of Python.  `if ... elif ... else`: 

```scheme
(cond
  ((> x 10) 'big)
  ((> x 5)  'medium)
  (else     'small))
```

### 2. `begin`  expression

![Start the sequence of composition expression · lecture board illustration (00:20:15)](</attachments/cs61a-11e2ba8d09ca2a568d104cd7.png>)
*⏱ Timestamp: 00:20:15 · 📷 Lecture screenshot · [Watch clip (P26 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1215)*

When multiple sentences are required to be executed in a sequence of sentences (usually for printing or side effects) in a grammatical slot that can only place a single expression:

```scheme
(begin
  (print 'first)
  (print 'second)
  (+ 2 3))  ; 整个 begin 表达式的值为最后一条子表达式的结果 5
```

### 3. `let`  Temporary local binding

![lecture board illustration (00:22:15)](</attachments/cs61a-843c1b0a4444521334c0b2e9.png>)
*⏱ Timestamp: 00:22:15 · 📷 Lecture screenshot · [Watch clip (P26 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1335)*

`let`  Allows the introduction of local variables that are only valid on current code blocks, destroys them immediately after computation and eliminates all-national naming space contamination:

```scheme
;; 计算直角三角形斜边：局部绑定 a 与 b
(define c
  (let ((a 3)
        (b (+ 2 2)))
    (sqrt (+ (square a) (square b)))))

;; 此处 a 与 b 不存在，只有 c = 5 永久保留
```

---

## 6. Scheme in Practice: Turtle Graphics and the Sierpinski Triangle

The course environment has a Logo-style turtle mapping (Turtle Graphics) module, which presents a perfect geometry of the higher-order process that is different from recursion:

![Scheme: Real War: Seahawks and the Serb Trilogy · lecture board illustration (00:24:45)](</attachments/cs61a-5b8a5e1512a5da83ab7be0dc.png>)
*⏱ Timestamp: 00:24:45 · 📷 Lecture screenshot · [Watch clip (P26 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1485)*

![Scheme: Real War: Seahawks and the Serb Trilogy · lecture board illustration (00:26:45)](</attachments/cs61a-34904a1f446d6913ecf6edff.png>)
*⏱ Timestamp: 00:26:45 · 📷 Lecture screenshot · [Watch clip (P26 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1605)*

![Scheme: Real War: Seahawks and the Serbinsky Triangle · lecture board illustration (00:28:45)](</attachments/cs61a-1b79081d46e6884e47933aa7.png>)
*⏱ Timestamp: 00:28:45 · 📷 Lecture screenshot · [Watch clip (P26 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1725)*

![Scheme: Real War: Seahawks and the Serb Trilogy · lecture board illustration (00:30:15)](</attachments/cs61a-db55c6b749a98c6296d2e0b0.png>)
*⏱ Timestamp: 00:30:15 · 📷 Lecture screenshot · [Watch clip (P26 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1815)*

### Recursion triangle to code

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

- **The base case $d=1$)** The first is the direct drawing of a length as  $k$  The straight line;
- **The recursion step $d>1$)** The three sides of the present triangle are made up of smaller Sherbinski triangles, with a raised pencil. `penup` (Laughter) `fd` I'm not going to say anything. `pendown` The painting is a remarkable fragmentary structure.

---

## Chapter 7 Summary and Core Points

1. **Syntax and syntax** Scheme: Strictly uniform using the front-end brackets to represent a combination; code is completely consistent with data formats.
2. **Common Calls vs. Special Forms** The following is a list of commonly used evaluation sub-expressions: `if`, `define`, `lambda`, `cond`, `let` The system is designed to be a unique execution control flow.
3. **lexicalscope and first-order processes** The process can be used as a parameter, return value, local closure and lay the foundation for subsequent automated interpreters.

---

