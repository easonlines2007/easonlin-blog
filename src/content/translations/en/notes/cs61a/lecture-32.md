---
kind: notes
source: cs61a/lecture-32
title: Lecture 32 · Macros and Syntax Extensions
description: "CS61A Lecture 32: Macros and syntax extensions."
sourceHash: 590d78ee4914c49d37085ab0782330cb16b78e6687fdf9d8aceb4b22fb47d3f0
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 28:53 ｜ **Video link back**: [B station response unit set (P32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32)

## 1. Quasi-quotation Practice (Quasi-quoted) - The practice of using a hot body and symbol to manipulate the expression.

Before the formal exploration of the macro, the fire must be controlled with precision and accuracy.

![Allows the reference to warm-up and symbol expression (Quasi-quatation Practice) lecture board illustration (00:00:27)](</attachments/cs61a-477918271f46de4a8e3ab0a2.png>)
*⏱ Timestamp: 00:00:27 · 📷 Lecture screenshot · [Watch clip (P32 00:00:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=27)*

### The concept of integrated thinking: constructing squares and expressions

Objective: To fill in the blanks with reference and decryptation symbols so that accurate representations can be generated after a call  $a^2 + b^2$  List of Scheme code  `(+ (* a a) (* b b))`: 

```scheme
;; 目标：定义 square-expr 并生成代码列表
(define (square-expr term)
  `(* ,term ,term))

`(+ ,(square-expr 'a) ,(square-expr 'b))
;; => (+ (* a a) (* b b))
```

![Integrated thinking: Constructing squares and expression lecture board illustration (00:01:50)](</attachments/cs61a-edb5f1802463133861403e54.png>)
*⏱ Timestamp: 00:01:50 · 📷 Lecture screenshot · [Watch clip (P32 00:01:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=110)*

![Integrated thinking topics: Constructing squares and expression lecture board illustration (00:03:44)](</attachments/cs61a-a0cf033369abc53c65344124.png>)
*⏱ Timestamp: 00:03:44 · 📷 Lecture screenshot · [Watch clip (P32 00:03:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=224)*

- **Key analysis**: 
  1. `square-expr`  It's a good idea to get back to the  `(* a a)`  The list of the topics in this article is not complete, and therefore the outer layer must be added to the reference.
  2. parameter  `term`  The word "symbol" is not used as a literal symbol, but it must be added to the reference.  `,term` The argument symbols are then added to the multiplication expression.
  3. The outside  `+`  The expression must be a reference to the whole, while the internal call  `(square-expr 'a)`  The value of the data is calculated by using a reference evaluation to obtain the list of generated multiplication expressions.

---

## What Are Macros? 2. What are macros?

In a normal function call, the interpreter follows **Application evaluation (Application-Order Employment)** The first evaluation operator with all operands, then enters the function body. This determines the number of times and times that an ordinary function cannot control a parameter for evaluation.

![What Are Macros? · lecture board illustration (00:05:35)](</attachments/cs61a-fba3e7d4b244905e0adfa75e.png>)
*⏱ Timestamp: 00:05:35 · 📷 Lecture screenshot · [Watch clip (P32 00:05:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=335)*

![What Are Macros? · lecture board illustration (00:07:06)](</attachments/cs61a-d6cc73b76b6c8d93df6a83c3.png>)
*⏱ Timestamp: 00:07:06 · 📷 Lecture screenshot · [Watch clip (P32 00:07:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=426)*

**Macro is the process of transforming the source code itself.**: 
1. The macro receives **List of expressions without evaluation** The following is a list of the parameters:
2. The macro generates a whole new section of Scheme expression code by code spelling;
3. The interpreter performs a second evaluation of the generated code.

---

## 3. Classic macro case 1: execution of two  `twice`  The Hungarian

Suppose we need a syntax structure that can perform any operation twice.

```scheme
;; 错误尝试：普通过程
(define (twice expr)
  (begin expr expr))

(twice (print 2))
```

![Classic macro case 1: Two-time twice macro lecture board illustration (00:08:03)](</attachments/cs61a-2f982076b911060e7fddbb63.png>)
*⏱ Timestamp: 00:08:03 · 📷 Lecture screenshot · [Watch clip (P32 00:08:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=483)*

The P is going to execute the argument immediately before calling.  `(print 2)` It's only one screen output.  `2` And then we'll  `print`  The return value  `undefined`  Input  `twice` The first two executions were not possible.

### The answer is: `define-macro`

```scheme
(define-macro (twice expr)
  `(begin ,expr ,expr))

(twice (print 2))
```

![Macro solution: Devine-macro lecture board illustration (00:09:03)](</attachments/cs61a-41f3d1e68676943129c88f34.png>)
*⏱ Timestamp: 00:09:03 · 📷 Lecture screenshot · [Watch clip (P32 00:09:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=543)*

![Macro-decro lecture board illustration (00:10:30)](</attachments/cs61a-02201baade893426c554120b.png>)
*⏱ Timestamp: 00:10:30 · 📷 Lecture screenshot · [Watch clip (P32 00:10:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=630)*

- Interpreters encounter macro calls  `twice`  When the **Not at all, evaluation.  `(print 2)`**; 
- The macro-functional body receives  `expr`  It's the original list.  `(print 2)`; 
- The macro template generates code: `(begin (print 2) (print 2))`; 
- interpreter evaluation The code was successfully printed twice on the screen  `2`!

---

## 4. Classic macro case 2: Assert test macro with source report  `check`

When writing a unit test assertion, the ordinary function receives only the boolean value and cannot know exactly which line of expression fails:

```scheme
;; 普通过程测试：失败时仅能输出 "failed"，丢失了上下文
(define (check val)
  (if val 'passed 'failed))
```

![Classic macro case 2: Assert testing with source reporting of the macro check · lecture board illustration (00:12:30)](</attachments/cs61a-78089d0769b05279dd98c172.png>)
*⏱ Timestamp: 00:12:30 · 📷 Lecture screenshot · [Watch clip (P32 00:12:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=750)*

And we can get it at the same time with macros. **Testing the code of an expression** Instead **The results of execution**: 

```scheme
(define-macro (check expr)
  `(if ,expr
       'passed
       (list 'failed ',expr)))
```

![Classic macro case 2: Assert test with source reporting of macro check lecture board illustration (00:14:05)](</attachments/cs61a-419a135b55fc82b351d069f9.png>)
*⏱ Timestamp: 00:14:05 · 📷 Lecture screenshot · [Watch clip (P32 00:14:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=845)*

And I'm not going to say.  `',expr`: 
- The external single quotation allows the original expression to be cited in the generated code;
- When the claim fails, output not only includes  `'failed` The first is that the original expression of a failure is directly printed.  `(> x 0)` This is absolutely impossible for ordinary functions.

---

## 5. Classic macro case 3: Add to the Scheme  `for`  Cyclical language

The Scheme language itself is not  `for ... in ...`  With the help of macros, we can create a new set of code for Scheme with just a few lines.  `for`  The language features of circularity!

![Classic macro case 3: Adding for to Scheme a looping grammar · lecture board illustration (00:15:42)](</attachments/cs61a-202f18f55125d8cc94eda6c5.png>)
*⏱ Timestamp: 00:15:42 · 📷 Lecture screenshot · [Watch clip (P32 00:15:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=942)*

The target grammar:
```scheme
(for x in '(2 3 4 5) (* x x))
;; 预期输出 => (4 9 16 25)
```

The goal of conversion to bottom-up equity:
```scheme
(map (lambda (x) (* x x)) '(2 3 4 5))
```

![Classic macro case 3: Add for Scheme for Circulation Syntax: lecture board illustration (00:17:41)](</attachments/cs61a-589aa61c92831715054e7a97.png>)
*⏱ Timestamp: 00:17:41 · 📷 Lecture screenshot · [Watch clip (P32 00:17:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1061)*

### `for`  Full implementation of the macro

```scheme
(define-macro (for sym in vals expr)
  `(map (lambda (,sym) ,expr) ,vals))
```

Testing performed:
```scheme
(for x in '(2 3 4 5) (* x x)) ; => (4 9 16 25)
```
By simply defining a simple macro, we have unknowingly extended the advanced loop control structure of the Scheme language!

---

## 6. Progressive Challenge: Dynamic tracking of recursion processes (`trace`)

In Python, we can use  `@trace`  The decorator prints the input and return values for each layer of recursion calls:

![Progress Challenge: recursion Process dynamic tracking macros (trace) lecture board illustration (00:19:36)](</attachments/cs61a-0885350d8aa5b37dae7b049c.png>)
*⏱ Timestamp: 00:19:36 · 📷 Lecture screenshot · [Watch clip (P32 00:19:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1176)*

![Progress Challenge: recursion Process dynamic tracking macros (trace) lecture board illustration (00:21:42)](</attachments/cs61a-6ba3c09d63ff8cb47d58a39c.png>)
*⏱ Timestamp: 00:21:42 · 📷 Lecture screenshot · [Watch clip (P32 00:21:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1302)*

In Scheme, the macro is the only final leverage if you want to execute a single tracking recursion function on demand without permanently changing the function definition because there is no built-in language decorator grammar.

### Tracking design ideas

![lecture board illustration (00:24:24)](</attachments/cs61a-6e6702e2dcb4770c5157778f.png>)
*⏱ Timestamp: 00:24:24 · 📷 Lecture screenshot · [Watch clip (P32 00:24:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1464)*

In the execution  `(trace (fact 5))`  The first is the water supply system, which will be used to provide the following water supplies:
1. Save the day  `fact`  The original process is defined as a temporary variable  `original`; 
2. I will  `fact`  The process of re-defining packaging with printed logs;
3. execute  `(fact 5)` The first is that the internal recursion calls trigger printing.
4. I will  `fact`  Restored to the original process  `original`; 
5. Returning the results of the calculations  `120`.

### `trace`  Macro code implementation

```scheme
(define-macro (trace expr)
  (let ((op (car expr)))
    `(begin
       (define original ,op)
       (define ,op (lambda (n)
                     (print (list ',op n))
                     (original n)))
       (define result ,expr)
       (define ,op original)
       result)))
```

![lecture board illustration (00:26:20)](</attachments/cs61a-99cde604985623be1437152d.png>)
*⏱ Timestamp: 00:26:20 · 📷 Lecture screenshot · [Watch clip (P32 00:26:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1580)*

![lecture board illustration (00:27:40)](</attachments/cs61a-247966756ed7f7da2e55addf.png>)
*⏱ Timestamp: 00:27:40 · 📷 Lecture screenshot · [Watch clip (P32 00:27:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1660)*

### Why is the macro tracking of Scheme more flexible than Python decorator?

- Python decorator is statically bound when defining a function, and once decorated all subsequent calls will be required to print logs;
- The Scheme  `trace`  The Hungarian **Call for a dynamic intervention**: 
  - Call when you want to track  `(trace (fact 5))` The screen output is the full call chain;
  - Write when you call regularly  `(fact 5)` It's a total day off!

---

## Core differences in the macro and P passing path

| Dimension | The process of the procedure | Macros |
| :--- | :--- | :--- |
| **Defining the syntax** | `(define (f x) ...)` | `(define-macro (f x) ...)` |
| **argument evaluation** | Before entering the function, arguments **Immediate evaluation** | The argument **In the original, it was introduced as an expression list.** |
| **Return to meaning** | Returns the final calculation results | The return value is a fraction of the **New code**, interpreter immediately repeats to evaluation |
| **The limits of ability** | Data computing and logical abstraction | Expanded syntax, control flow customization, and sub-programming |
| **Control of side effects** | Side effects of not being able to block particle expression | The ability to delay, repeat or completely skip expression evaluation |

---

