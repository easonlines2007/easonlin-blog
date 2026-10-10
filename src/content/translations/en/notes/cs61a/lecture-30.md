---
kind: notes
source: cs61a/lecture-30
title: Lecture 30 · Tail Calls and Tail Recursion
description: "CS61A Lecture 30: Tail recursion and tail-call optimization."
sourceHash: 1386b8fb80109170d57baa450d1889481b19920d59eef8ffaa3a75b33a0c10f9
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 32:50 ｜ **Video link back**: [B station response unit set (P30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30)

## 1. The commitment to efficiency paradox of functional programming (Functional Programming & Referential Transparency)

Functional programming has extraordinary theoretical advantages:
1. **Pure functions without side effects** Function behavior depends only on the input argument.
2. **The report also highlights the importance of transparency in the country's economy.** Any subexpression can be directly replaced with its evaluation results without changing the program's semantics. This is called automatic parallel computation (Automatic Parallelization). **and** The first is the memoization cache, which was created in 2002 and is now a very popular tool for memorizing memory.
3. **Remove the mutable status**: No variable re-couping, total elimination and competition.

![Function programming commitment and efficiency paradox (Fundamental Programing & Technical Transport) lecture board illustration (00:00:35)](</attachments/cs61a-a44f15508422661db959c1be.png>)
*⏱ Timestamp: 00:00:35 · 📷 Lecture screenshot · [Watch clip (P30 00:00:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=35)*

However, the lack of mutable circulatory control flow raises a critical question: **No, not yet.  `for`  and  `while`  How can functional languages achieve high-efficiency iterative computing?**  Tail recursion is the perfect answer to this problem.

---

## 2. recursion vs iteration: gap in space complexity (Recursion vs Iteration in Python)

In order to calculate the auxiliary function  $k \times n!$  For example, in Python we compare recursion and iteration to two different writing methods:

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

![The first is the "Iterative with While" lecture board illustration (00:02:32).](</attachments/cs61a-388a3ae7bb95e02ff8eac420.png>)
*⏱ Timestamp: 00:02:32 · 📷 Lecture screenshot · [Watch clip (P30 00:02:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=152)*

- **time complexity** Both are:  $O(n)$ The same number of times multiply and subtract.
- **Space complexity**: 
  - `factorial_iter`  Only use two fixed local variables  `n`  and  `k` and occupied  **$O(1)$  The space of constant numbers**; 
  - `factorial_rec`  In Python, each call is assigned a new string and occupies the same number of rows.  **$O(n)$  Linear space**.

---

## 3. Scheme Language Regulation: tail recursion Forced (Properly Tail Recursive)

The official language standard for the Scheme (Revised^n Report on the Algorithmic Language Scheme) states:
> **Scheme must be real. tail recursion It's the most popular one in the world.**  
> This allows iterative computation to be expressed as a pure recursion process, while only occupying constant space when executed.

![Scheme Language Regulation: tail recursion Compulsory (Properly Tail Recursive) lecture board illustration (00:04:34)](</attachments/cs61a-81a64244e05290ccdd1d522e.png>)
*⏱ Timestamp: 00:04:34 · 📷 Lecture screenshot · [Watch clip (P30 00:04:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=274)*

The Scheme is written as follows:
```scheme
(define (factorial n k)
  (if (zero? n)
      k
      (factorial (- n 1) (* k n))))
```
The interpreter must ensure that the process is executed with the underlying  `while`  The cycle consumes the same constant space.

---

## 4. Eliminating Redundant Frames

Why Python's? recursion Call unrecoverable space? We observe. environment model (Environ Model):

![The first is the "Eliminating Redundant Frames" lecture board illustration (00:05:38).](</attachments/cs61a-458c2805f928873a44d59489.png>)
*⏱ Timestamp: 00:05:38 · 📷 Lecture screenshot · [Watch clip (P30 00:05:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=338)*

In  `factorial(4, 1)`  The execution process:
- $F_1(n=4, k=1)$  Calling  $F_2(n=3, k=4)$; 
- $F_2$  Calling  $F_3(n=2, k=12)$; 
- $F_3$  Calling  $F_4(n=1, k=24)$; 
- $F_4$  Calling  $F_5(n=0, k=24)$  Return  `24`- At this point, $F_4$  I'm not going to  $F_5$  The return value is passed to  $F_3$  I'm not sure. **No subsequent calculations**!$F_3$, $F_2$, $F_1$  The same is true of the "speakers" who are just as much a messenger.

The historical local variable in the upper tier of the grid has no remaining value at the time recursion calls are initiated. **Direct discard or reuse of current activity tags**.

---

## 5. Formalised definition of tail calls and context (Tail Calls & Tail Contexts)

### What is a tail call?

> **The first is the "Tail Call".**  It refers to the process call expression in the context of Tail Context at the end of \*\*.

![What is a tail call? · lecture board illustration (00:07:13)](</attachments/cs61a-ae5dd5c9ae04d2a68be38d29.png>)
*⏱ Timestamp: 00:07:13 · 📷 Lecture screenshot · [Watch clip (P30 00:07:13)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=433)*

If a process call is the current process needs to be done before returning **The last thing.** (i.e., the return value after the call is completed becomes directly the return value of the current process without any secondary calculation), then the call is a tail call.

### The Tail Context Rules are the rules that define the context.

Whether an expression is in the tail context depends on its grammatical position in the parent expression:

![End context determination rule (Tail Context Rules) lecture board illustration (00:08:43)](</attachments/cs61a-8991a546b81557fd378af443.png>)
*⏱ Timestamp: 00:08:43 · 📷 Lecture screenshot · [Watch clip (P30 00:08:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=523)*

1. **Lambda functional body**: `lambda`  In the body of expression **The last sub-expression** The following is the text of the letter:
2. **If the condition branch** If the whole:  `if`  The expression is in the context of the tail, and its \*\* second sub-expression ((Consequent) and third sub-expansion ((Alternative) \*\* are also in the context; note: Predicate preposition expression is never in the context!)
3. **Cond branch** The following is the text:  `cond`  In an expression, the non-syntactic result of each sentence is in the context at the end;
4. **And/or logical** The following is the text:  `and`/`or`  The expression **The last sub-expression** The following is the text of the letter:
5. **Begin the code block** The following is the text:  `begin`  In the block **The last sub-expression** The following is the text of the letter.

---

## 6. Linear recursion is rewritten as tail recursion: List length (Rewriting)  `length` with Accumulator)

### The classic writing of non-tail recursion

```scheme
(define (length s)
  (if (null? s)
      0
      (+ 1 (length (cdr s)))))
```

![Non-tail recursion classic lecture board illustration (00:10:46)](</attachments/cs61a-98464887f214432f27a836a5.png>)
*⏱ Timestamp: 00:10:46 · 📷 Lecture screenshot · [Watch clip (P30 00:10:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=646)*

- The whole thing  `if`  The following is a list of the most commonly used names for the name "Spanish" in the English language.  `0`  and  `(+ 1 (length (cdr s)))`  The following is the text of the letter:
- But the most outward appeal is to add.  `+` The internal recursion calls  `(length (cdr s))`  The operand of the add-on operator is **In the nested call expression, it is not a tail call**!
- When recursion returns the remaining length of the list, the current frame must also be kept on the stack to wait for the execution of the plus one operation. Therefore, space complexity is  $O(n)$.

### The tail recursion is a type of accumulator pattern.

By introducing the auxiliary process and the aggregator parameters, add backwards to the aggregate before moving forward:

```scheme
(define (length-tail s)
  (define (length-iter s n)
    (if (null? s)
        n
        (length-iter (cdr s) (+ n 1))))
  (length-iter s 0))
```

![tail recursion rewrite: Accumulator Patterson lecture board illustration (00:12:49)](</attachments/cs61a-88d60895892bce2b0ced5d6a.png>)
*⏱ Timestamp: 00:12:49 · 📷 Lecture screenshot · [Watch clip (P30 00:12:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=769)*

In  `length-iter`  In the middle, recursion calls  `(length-iter (cdr s) (+ n 1))`  Located in  `if`  The alternative branch top floor is a complete tail call! So space complexity goes straight to  $O(1)$.

---

## 7. interpreter real-time: call for optimized demonstration (`scheme.py`)

In the Extra Credit section of CS61A Project 4 (Scheme interpreter), we need to add tail calling support for the interpreter.

![interpreter Field: Relay Optimization Demonstration (scheme.py) . lecture board illustration (00:15:26)](</attachments/cs61a-7d8ac2a5447c17ad78ccf4a5.png>)
*⏱ Timestamp: 00:15:26 · 📷 Lecture screenshot · [Watch clip (P30 00:15:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=926)*

### Crash tests when not optimised

In ordinary interpreters, the step function is run:
```scheme
(factorial 10)   ; => 3628800
(factorial 100)  ; => 正常返回
(factorial 1000) ; => 报错: RuntimeError: maximum recursion depth exceeded!
```

Python interpreter default call up to 1000 layers, and when called to 673 or so, the stack is depleted and causes an abnormal collapse.

![The first is the "Class Test" of the lecture board illustration (00:17:06)](</attachments/cs61a-5ccf06014712fe12d4d72266.png>)
*⏱ Timestamp: 00:17:06 · 📷 Lecture screenshot · [Watch clip (P30 00:17:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1026)*

### Unlimited execution after optimization

After starting the end call optimization (by rotating a loop trampoline or directly updating the local evaluation environment) even after calculating  `(factorial 10000 1)` The interpreter will never add any activity string, but will constantly complete a mass recursion in the instant or evenly in a constant space!

---

## Diagnostic Exercises: The first step in the process of tail recursion is to diagnose and treat a tail recurrence.

Please analyze the following four Scheme processes to determine which are true tail recursions (running in a constant space):

![The first is the diagnosis of tail recursion (Diagnostic Exercises) and the second is the lecture board illustration (00:18:36).](</attachments/cs61a-35b14a27ca54ac52b0a571e7.png>)
*⏱ Timestamp: 00:18:36 · 📷 Lecture screenshot · [Watch clip (P30 00:18:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1116)*

### Case 1: The first one. `contains?`

```scheme
(define (contains? s x)
  (cond ((null? s) #f)
        ((= (car s) x) #t)
        (else (contains? (cdr s) x))))
```

![Example 1: Contains? · lecture board illustration (00:20:08)](</attachments/cs61a-c61e25c53b3776c8ebea7d07.png>)
*⏱ Timestamp: 00:20:08 · 📷 Lecture screenshot · [Watch clip (P30 00:20:08)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1208)*

- **The analysis**: `cond`  of  `else`  The branch returns the recursion call results directly without any operation being suspended.
- **Conclusion**: **It's a tail recursion.** Space complexity  $O(1)$.

### Case 2: The first is the second. `has-repeat?`

```scheme
(define (has-repeat? s)
  (if (null? s)
      #f
      (if (contains? (cdr s) (car s))
          #t
          (has-repeat? (cdr s)))))
```

- **The analysis** Yes, I did.  `has-repeat?`  The recursion calls are embedded  `if`  The alternative is in the background; call  `contains?`  The report also highlights the importance of the new rules.  `contains?`  It is a  $O(1)$  Space.
- **Conclusion**: **It's a tail recursion.** Space complexity  $O(1)$.

### Example 3: `fib-iter`

```scheme
(define (fib-iter n)
  (define (helper k current prev)
    (if (= k n)
        current
        (helper (+ k 1) (+ current prev) current)))
  (if (zero? n) 0 (helper 1 1 0)))
```

![Case 3: fib-iter lecture board illustration (00:22:11)](</attachments/cs61a-933bd483b2f1a97c6d8b0af1.png>)
*⏱ Timestamp: 00:22:11 · 📷 Lecture screenshot · [Watch clip (P30 00:22:11)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1331)*

- **The analysis** All parameters are calculated as:  `(+ current prev)`) All completed before entering the next rotation, recursion call  `helper`  The following is the text of the letter.
- **Conclusion**: **It's a tail recursion.** Space complexity  $O(1)$.

---

## 9. Tail recursion modification of higher-order function: `reduce`  and  `map`

### The tail recursion  `reduce`

```scheme
(define (reduce fn s start)
  (if (null? s)
      start
      (reduce fn (cdr s) (fn start (car s)))))
```

![The tail recursion of the reduction lecture board illustration (00:23:41)](</attachments/cs61a-b802cfb766fb0d17b8a37186.png>)
*⏱ Timestamp: 00:23:41 · 📷 Lecture screenshot · [Watch clip (P30 00:23:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1421)*

recursion call  `reduce`  The value of the new add-on is in the context of the last  `(fn start (car s))`  Input as an argument.  `fn`  The whole thing is running in constant space.  `reduce`  I'm just going to  $O(1)$  It's a spacecraft.

---

## 10. High difficulty challenge: tail recursion of constant space  `map` (Tail Recursive `map`)

Standards  `map`  The traditional recursion definition must wait for the subsequent sublist to be executed after returning  `cons` And so it is.  $O(n)$  Linear space:

```scheme
(define (map fn s)
  (if (null? s)
      nil
      (cons (fn (car s)) (map fn (cdr s))))) ; 非尾调用！
```

![The challenge of difficulty: the space of constants tail recursion (Tail Recursive Map) lecture board illustration (00:26:20)](</attachments/cs61a-3a434c73aa137a5cad39404c.png>)
*⏱ Timestamp: 00:26:20 · 📷 Lecture screenshot · [Watch clip (P30 00:26:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1580)*

How to achieve this without using extra space  `map`?

### Tip: First reverse add up, then reverse the tail recursion

![Skills: Reverse cumulative, then tail recursion Reverse lecture board illustration (00:28:19)](</attachments/cs61a-b84f217adbd76a51db6ee429.png>)
*⏱ Timestamp: 00:28:19 · 📷 Lecture screenshot · [Watch clip (P30 00:28:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1699)*

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

The additive is then pressed into the elements in a sequential order at the head while constructing new lists, and the reverse list is obtained; it then uses tail recursion to form a linear linear line.  `reverse`  All recursion calls throughout the process are in context, and space spending is strictly a constant!

---

## 11. Philosophy of Enhancement: The program is a dedicated machine and the interpreter is a universal computing machine

At the end of this talk, Professor John DeNero gives a highly inspirational perspective on computational essence:

![Philosophy: The program is a dedicated machine. interpreter Universal Commanding Machine. lecture board illustration (00:30:58)](</attachments/cs61a-31a5e3ea34b926bb157b2a7c.png>)
*⏱ Timestamp: 00:30:58 · 📷 Lecture screenshot · [Watch clip (P30 00:30:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=30&t=1858)*

- **The first is the special purpose machine.** Each specific program (such as a computational scaled function) is like a physical turning device with a specific function, and input  $5$ Internal flow lines, operation and output  $120$.
- **The following is a list of the most commonly used computer programs in the United States.** Interpreters do not, in themselves, consolidate any specific business logic. **Both inputs**: 
  1. Source code programming (describing a blueprint for a specific machine);
  2. The program requires the input data. The interpreter dynamically simulates the physical operation of this machine in memory!

This is the very core of the idea of the Universal Turing Machine, proposed by Alan Turing in 1936. The Scheme interpreter we wrote for Project 4 was essentially a general-purpose computer capable of simulating any computable process in the universe.

---

## The key points of the review

| Key terms | Core definitions and key rules |
| :--- | :--- |
| **The following is a list of the most common types of tail calls:** | The process call in context is located at the tail. Its return value is the final return value of the outer process, and no subsequent calculation is required after the call. |
| **The following is a list of the most common types of tail:** | The last sentence of the processor is in the context at the end.  `if`  The two branches of expression are the expression, etc. |
| **The following is a list of the most common types of mobile phone users:** | Compilationist/interpreter uses the current call frame to support endless calls and consume only  $O(1)$  The space of constant numbers. |
| **The accumulator mode** | The intermediate computation results are passed as arguments to the next round of recursion calls, so that the calculation occurs when the curve is downward and deep, thus converting the linear recursion into a tail recursion. |
| **General computer** | The interpreter accepts program text and data as inputs, with the ability to simulate arbitrary computing processes. |

---

