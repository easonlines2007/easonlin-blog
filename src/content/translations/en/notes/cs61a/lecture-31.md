---
kind: notes
source: cs61a/lecture-31
title: Lecture 31 · Programs as Data and Metaprogramming
description: "CS61A Lecture 31: Code as data and metaprogramming."
sourceHash: 1907bfc90f911b782c869246dfae024d879f96bc71cb445a38725ee45b7f5d0d
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-31).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 18:06 ｜ **Video link back**: [B station response unit set (P31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31)

## 1. Code is data: Programs as Data & Homoiconicity

All non-basic expressions of the Scheme (combination, combination) are represented in memory by a standard list (linked list):

```scheme
;; 构造一个二元除法代码列表
(list 'quotient 10 2) ; => (quotient 10 2)
```

![Code: Data: The Principle of Sameness (Programs as Data & Homoecology) lecture board illustration (00:00:30)](</attachments/cs61a-0e6dc1f9fcddff27819bb9c9.png>)
*⏱ Timestamp: 00:00:30 · 📷 Lecture screenshot · [Watch clip (P31 00:00:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=30)*

evaluation The list does not execute the deferral immediately, it only generates a symbol containing three elements:  `quotient` The numbers  `10` The numbers  `2` The following is a list of common data.

---

## 2. Internally installed  `eval`: Converting Between Data and Code (The  `eval` Procedure)

If the structure of a list is in line with legal Scheme grammar, we can pass it on to built-in  `eval`  The process:

```scheme
(define expr (list 'quotient 10 2))
(eval expr) ; => 5
```

![The eval Procedure: the lecture board illustration (00:01:29)](</attachments/cs61a-da7accd49b1fd5227fc0f690.png>)
*⏱ Timestamp: 00:01:29 · 📷 Lecture screenshot · [Watch clip (P31 00:01:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=89)*

- Python is also built-in.  `eval("10 // 2")` Python can only solve unstructured text strings.
- The unique strength of the Scheme is: **Code is a structured, linked list data.** You can use all the listing functions. `cons`, `car`, `cdr`, `map`, `filter` (AST) abstraction grammar tree of arbitrary manipulation, assembly and transformation of the program, then call  `eval`  Do it!

---

## 3. Symbol reference and expression evaluation mechanisms

In an interactive interpreter, we can clearly distinguish between ordinary expression evaluation and constructing a list of code:

![Symbol Quoted with expression evaluation Mechanism lecture board illustration (00:02:29)](</attachments/cs61a-6eb161605a9f6f3ba0eb98ca.png>)
*⏱ Timestamp: 00:02:29 · 📷 Lecture screenshot · [Watch clip (P31 00:02:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=149)*

```scheme
(+ 1 2)         ; => 3 (立即执行加法)
(list '+ 1 2)   ; => (#[primitive:+] 1 2) (直接求值了 + 符号)
(list '+ 1 2)   ; 传递带引用的符号: (list '+ 1 2) => (+ 1 2)
```

The only way to get a single quote  `'`  Stops the operator from being immediately placed in evaluation so that it can be safely embedded as a symbol in the newly created expression list.

---

## 4. Calculating numerical values vs. generating expression: two perspectives of the scalar

Consider the classic recursion step function. We can not only write a function that returns the numerical value of the computed result, but we can also write a function which returns the result. **Returns the full computed expression tree** The program:

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

![Calculate values vs generated expression : Two perspectives of the factoring... lecture board illustration (00:03:57)](</attachments/cs61a-2888b064572f0e15e4862599.png>)
*⏱ Timestamp: 00:03:57 · 📷 Lecture screenshot · [Watch clip (P31 00:03:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=237)*

The first is the test of the same name.
```scheme
(fact 5)     ; => 120
(fact-exp 5) ; => (* 5 (* 4 (* 3 (* 2 (* 1 1)))))
```

![Calculating values vs generate expression: two angles of multiplier lecture board illustration (00:04:57)](</attachments/cs61a-151a6fd12efdd1ca1b74073c.png>)
*⏱ Timestamp: 00:04:57 · 📷 Lecture screenshot · [Watch clip (P31 00:04:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=297)*

The resulting expression intuition presents the complete computational overview of a stepwise recursion!  `(eval (fact-exp 5))` It's a very simple thing to do.  `120`.

---

## 5. tree recursione expression: Fibonacci sequence

The same technique can be applied to tree-shaped recursion.  `fib-exp`  The graph of the Fibonacci number is shown in Figure 1.

```scheme
(define (fib-exp n)
  (if (<= n 1)
      n
      (list '+ (fib-exp (- n 2)) (fib-exp (- n 1)))))
```

![tree recursion expression Expand: Fibonacci series lecture board illustration (00:06:00)](</attachments/cs61a-01146c30e2d2d747adb03285.png>)
*⏱ Timestamp: 00:06:00 · 📷 Lecture screenshot · [Watch clip (P31 00:06:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=360)*

![tree recursion expression Expand: Fibonacci series lecture board illustration (00:07:01)](</attachments/cs61a-f6548e4e26d9e5aa0aa40726.png>)
*⏱ Timestamp: 00:07:01 · 📷 Lecture screenshot · [Watch clip (P31 00:07:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=421)*

execute  `(fib-exp 6)`  It will generate a  `+`  with baseline values  `0`, `1`  A large nested list; for evaluation  `(eval (fib-exp 6))`  The value of Fibonacci numbers 6 is exactly what it is.  `8`.

---

## 6. Quasi-quotation: Backtick and Unquote (quasi-quoted)

Handheld use  `list`  and  `'`  Complex code is extremely easy to spell out in brackets. Scheme provides a powerful template syntax for this. **The first is the "Class of the Fury".**: 

| The syntax | Name | The meaning |
| :--- | :--- | :--- |
| **The reverse is** | Quasi-quote (quasi quotation) | Similar to a common single quotation citation, but allowing internal local evaluation insertion |
| **The comma .** | Unquote (deleted quotes) | interpreter is valid only by allowing internal references to force interpreter to perform immediate evaluation replacements for the sub expression behind it |

![Para-citation syntax: Backtick and Unquatte (Quasi-quatation) lecture board illustration (00:08:01)](</attachments/cs61a-38eac3ceeac1129f53b9b689.png>)
*⏱ Timestamp: 00:08:01 · 📷 Lecture screenshot · [Watch clip (P31 00:08:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=481)*

### Static reference vs. Quadratic reference

If we were to bind ourselves in the environment  `(define b 4)`: 

```scheme
'(a (+ b 1))  ; => (a (+ b 1)) (全部视为字面符号，不求值)
`(a ,(+ b 1)) ; => (a 5)       (a 保持字面符号，(+ b 1) 被动态求值替换为 5!)
```

![Static citation vs Para-reference lecture board illustration (00:09:26)](</attachments/cs61a-e6028822983d3035ece2de37.png>)
*⏱ Timestamp: 00:09:26 · 📷 Lecture screenshot · [Watch clip (P31 00:09:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=566)*

### The code template factory: `make-add-procedure`

Using reference, we can dynamically generate function-definition codes for specific parameters:

```scheme
(define (make-add-procedure n)
  `(lambda (d) (+ d ,n)))

(make-add-procedure 2) ; => (lambda (d) (+ d 2))
```

![The first is the "Code Template Factory: Make-add-procedure" lecture board illustration (00:10:54)](</attachments/cs61a-eb1c21f23f347c7da3e9b393.png>)
*⏱ Timestamp: 00:10:54 · 📷 Lecture screenshot · [Watch clip (P31 00:10:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=654)*

The parameters here  `n`  The code is replaced with a constant at the code generation stage  `2` This is a unique single-parameter process that generates the source code for itself!

---

## 7. Practical challenge: Simulating While Loops (SIM) to generate code that fills in language characteristics.

Scheme languages are not available to keep the core minimal  `while`  The circular statement. Suppose we need to calculate the square of the previous even numbers and:

```python
# Python 原生写法
x, total = 2, 0
while x < 10:
    total += x * x
    x += 2
# total => 120
```

![The first is the "Total =\> 120" lecture board illustration (00:11:53)](</attachments/cs61a-2ce5e168324adecec89abeb9.png>)
*⏱ Timestamp: 00:11:53 · 📷 Lecture screenshot · [Watch clip (P31 00:11:53)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=713)*

In Scheme, programmers are required to manually write a cumbersome tail recursion auxiliary function each time:

```scheme
(define (f x total)
  (if (< x 10)
      (f (+ x 2) (+ total (* x x)))
      total))
(f 2 0) ; => 120
```

If we had hundreds of different cyclical computing needs, and it was always a long time ago to write recursion by hand, would the Scheme automatically generate and execute this template code for us?

![The first is the "Total =\> 120" lecture board illustration (00:13:21)](</attachments/cs61a-6db908953280e7caa1ac8fc7.png>)
*⏱ Timestamp: 00:13:21 · 📷 Lecture screenshot · [Watch clip (P31 00:13:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=801)*

---

## 8. General loop code generator: `sum-while`

The first is that we can write a general reference template.  `sum-while`  The first step:

```scheme
(define (sum-while initial-x condition add-term update-x)
  `(begin
     (define (f x total)
       (if ,condition
           (f ,update-x (+ total ,add-term))
           total))
     (f ,initial-x 0)))
```

![The general loop code generator: sum-while · lecture board illustration (00:14:21)](</attachments/cs61a-9fb115acf141015e32a7ceab.png>)
*⏱ Timestamp: 00:14:21 · 📷 Lecture screenshot · [Watch clip (P31 00:14:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=861)*

![The general loop code generator: sum-while · lecture board illustration (00:15:48)](</attachments/cs61a-711c4b2b7417e71d4536a629.png>)
*⏱ Timestamp: 00:15:48 · 📷 Lecture screenshot · [Watch clip (P31 00:15:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=948)*

### Code generation and dynamic evaluation run

Test 1: Calculating  $1 + 2 + \dots + 7 = 28$ (in  $x^2 < 50$  The following are the numbers:
```scheme
(define code (sum-while 1 '(< (* x x) 50) 'x '(+ x 1)))
(eval code) ; => 28
```

Test 2: Calculate the number of even squares and  $2^2 + 4^2 + 6^2 + 8^2 = 120$: 
```scheme
(define code2 (sum-while 2 '(< x 10) '(* x x) '(+ x 2)))
(eval code2) ; => 120
```

![Code Generation and Dynamic evaluation Run lecture board illustration (00:16:48)](</attachments/cs61a-00bda44828124845767866f5.png>)
*⏱ Timestamp: 00:16:48 · 📷 Lecture screenshot · [Watch clip (P31 00:16:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=1008)*

The interpreter receives  `sum-while`  The generated list code structure, used  `eval`  Dynamic defining local tail recursion function  `f`  The first is to send out the initial call and then return it exactly.  `120`!

---

## 9. Summary: The Power of Metaprogramming

The ultimate performance of the programming language that can write programs is what has made Lisp and Scheme sacred in computer science history.

![The Power of Metaprogramming (00:17:50) · lecture board illustration](</attachments/cs61a-959e8bc9d6f211750d98b192.png>)
*⏱ Timestamp: 00:17:50 · 📷 Lecture screenshot · [Watch clip (P31 00:17:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=31&t=1070)*

- The process can examine itself, reconstruct itself and generate new abstractions like ordinary data.
- This is the next big thing in code generation. **Macros** The following is a list of the countries:
- It completely frees programmers from the repetitive work of machines, giving us creators the ability to create new languages in existing languages.

---

## Quickly check key knowledge points

| Concepts | Core functions and syntax | Typical use scenarios |
| :--- | :--- | :--- |
| **The code is data (Homoiconicity).** | Combined data is Scheme linked list data. | Allows the direct use of linked list operation functions to build and analyze ASTs |
| **`eval`  The process** | `(eval expr)` | Expression of Scheme lists that are dynamically constructed or generated |
| **Quasi-quote** | The language is not a language. | Declares a code template that allows local dynamic insertion |
| **Unquote** | The syntax  `,` | Enforce evaluation specifying sub-expression in the template and fill out results |
| **Code generation is a term used to describe the generation of code.** | Accepting parameters to generate syntax trees | Automatically eliminate template recursion code to build advanced syntax structures |

---

