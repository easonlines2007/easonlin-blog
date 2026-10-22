---
kind: notes
source: cs61a/lecture-27
title: Lecture 27 · Scheme Lists and Symbolic Computation
description: "CS61A Lecture 27: Scheme lists and symbolic computation."
sourceHash: b9c00ba287c71f173354561f7b9d0a6c8f92df9cf6dbbbd64a573916e043daeb
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-27).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 24:44 ｜ **Video link back**: [B station response unit (P27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27)

## 1. Core mind model and architecture

In Python, there is a wide array of data structures such as lists, cells, dictionarys and collections; and in Scheme, there is a large number of data structures, such as lists, cells, dictionarys and collections. **List is everything.**.

The Scheme's list at the bottom is a strict\*\* single-directional linked list structure. It is supported by the most refined Trinity Primitive:

```
                    ┌──────────────────────────────────────────────┐
                    │            Scheme 列表的底层双格模型         │
                    └──────────────────────┬───────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────────────┬───────────────────┐
         ▼                   ▼                             ▼                   ▼
  ┌───────────────┐   ┌───────────────┐             ┌───────────────┐   ┌───────────────┐
  │   (cons a b)  │   │    (car p)    │             │    (cdr p)    │   │      nil      │
  ├───────────────┤   ├───────────────┤             ├───────────────┤   ├───────────────┤
  │ 构造一个序对  │   │ 提取左格元素  │             │ 提取右格后续  │   │ 空列表哨兵 /  │
  │ (Contents of  │   │ (Contents of  │             │ (Contents of  │   │ (绘制为斜杠)  │
  │  Address/Dec) │   │  Address Reg) │             │  Dec Reg)     │   │               │
  └───────────────┘   └───────────────┘             └───────────────┘   └───────────────┘

盒指针图解 (Box-and-Pointer): (cons 1 (cons 2 nil))
       ┌───┬───┐       ┌───┬───┐
       │ 1 │ ──┼──────►│ 2 │ / │
       └───┴───┘       └───┴───┘
       控制台紧凑显示: (1 2)
```

- **The underlying composition** Each list is one or more nested  `cons`  The unit, the right-hand recursion pointing to the rest of the list, ends with  `nil`  The end.
- **Presentation of separation** Although the bottom is a complex pointer grid, the Scheme interpreter is unified in REPL by an output of spaced separation with flat brackets such as:  `(1 2 3 4)`.

---

## List of basic operations: Cons, Car, Cdr and Nil

![List of basic operations: Cons, Car, Cdr and Nil · lecture board illustration (00:00:55)](</attachments/cs61a-296a49efc1f146739c2e9769.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P27 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=55)*

![List of basic operations: Cons, Car, Cdr and Nil · lecture board illustration (00:02:15)](</attachments/cs61a-8fb490fdf0b82d4df0c4b384.png>)
*⏱ Timestamp: 00:02:15 · 📷 Lecture screenshot · [Watch clip (P27 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=135)*

### Core primitive definition

- `(cons first rest)` The first is to create a new node. `first`  The data can be used for any given data in a well-structured list  `rest`  It must be another list or  `nil`.
- `(car s)` The first element of the linked list is:
- `(cdr s)` (read "could-er"): Rest of the linked list to get rest)
- `nil`: represent empty linked list (`'()`).

![The first is the "Core Primitive Definition" lecture board illustration (00:03:45)](</attachments/cs61a-c26587502dc456721fdbe35d.png>)
*⏱ Timestamp: 00:03:45 · 📷 Lecture screenshot · [Watch clip (P27 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=225)*

### Embedded Construction Exercises and Visualization (Draw)

![Draw lecture board illustration (00:04:45)](</attachments/cs61a-f0290b44cf973ae04f7f41b4.png>)
*⏱ Timestamp: 00:04:45 · 📷 Lecture screenshot · [Watch clip (P27 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=285)*

```scheme
(define s (cons 1 (cons 2 nil)))  ; 构成列表 (1 2)

(car s)         ; 1
(cdr s)         ; (2)
(car (cdr s))   ; 2

;; 头部插入新元素
(cons 3 s)      ; (3 1 2)

;; 列表作为首项元素 (构造嵌套列表)
(cons (cons 4 (cons 3 nil)) s)
;; 结果为 3 元素列表: ((4 3) 1 2)
```

![Draw lecture board illustration (00:06:15)](</attachments/cs61a-f4a463edcdf2514bcd4029eb.png>)
*⏱ Timestamp: 00:06:15 · 📷 Lecture screenshot · [Watch clip (P27 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=375)*

### constructor  `list`  The commonly used phrase

Use of nesting  `cons`  The list of constructors is too long, and Scheme provides a variable constructor.  `list`: 

```scheme
(list 1 2 3 4)  ; 等价于 (cons 1 (cons 2 (cons 3 (cons 4 nil))))

(list? '(1 2))  ; #t
(null? nil)     ; #t (判定是否为空列表)
(null? '(1))    ; #f
```

---

## 3. Symbolic Programming & Quotation (SPC) and the symbols are used to compute and references.

In traditional programming languages, the symbol (nomination variable) is always replaced by its bound value when evaluation; but in AI and proof of theory we need to **The program is able to manipulate the symbols themselves as data** (Symbolic Manipulation is a symbol calculation.)

![Symbolic Programming & Quotation (SPC) · lecture board illustration (00:07:45)](</attachments/cs61a-1df3ee6a7c51502e356edbe2.png>)
*⏱ Timestamp: 00:07:45 · 📷 Lecture screenshot · [Watch clip (P27 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=465)*

### Single-Quote Syntax for Quotation

![Single quote syntax (Quotation) lecture board illustration (00:09:15)](</attachments/cs61a-5cd2d972b8656086b816fa8b.png>)
*⏱ Timestamp: 00:09:15 · 📷 Lecture screenshot · [Watch clip (P27 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=555)*

The single quotation  `'`  It's a special form.  `quote`  The syntax of sugar, it informs the interpreter: **Do not conduct evaluation on the follow-up expression, return it as data!**

![Single quote syntax (Quotation) lecture board illustration (00:10:45)](</attachments/cs61a-21b175c62bdeb5f716b2ab78.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P27 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=645)*

```scheme
(define a 1)
(define b 2)

(list a b)      ; (1 2)  (符号求值，丢失符号本身)
(list 'a 'b)    ; (a b)  (保留符号 a 和 b 本身！)
(list 'a b)     ; (a 2)  (符号 a 与求值结果 2 的混合列表)

;; 引用整个组合式构建嵌套符号列表
(define expr '(+ 1 (* 2 3)))
(car expr)        ; 符号 +
(cdr expr)        ; 列表 (1 (* 2 3))
```

> **The classic index guides**:evaluation  `(car (cdr (car (cdr '(1 (2 3) 4)))))`: 
> 1. `(cdr '(1 (2 3) 4))` $\to$ `'((2 3) 4)`
> 2. `(car ...)` $\to$ `'(2 3)`
> 3. `(cdr ...)` $\to$ `'(3)`
> 4. `(car ...)` $\to$  The whole number  `3`!

---

## 4. higher-order list processing process: Append, Map, Filter and Apply

Scheme has a very powerful built-in library of functional lists:

![The process of processing higher-order lists: Append, Map, Filter and Apply · lecture board illustration (00:12:15)](</attachments/cs61a-36cba99d57b862332207f11e.png>)
*⏱ Timestamp: 00:12:15 · 📷 Lecture screenshot · [Watch clip (P27 00:12:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=735)*

![The process of processing higher-order lists: Append, Map, Filter and Apply · lecture board illustration (00:13:45)](</attachments/cs61a-cac95ca1234a4f430cf2230d.png>)
*⏱ Timestamp: 00:13:45 · 📷 Lecture screenshot · [Watch clip (P27 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=825)*

![The process of processing higher-order lists: Append, Map, Filter and Apply · lecture board illustration (00:15:15)](</attachments/cs61a-ed47348ae462df4c3cf32422.png>)
*⏱ Timestamp: 00:15:15 · 📷 Lecture screenshot · [Watch clip (P27 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=915)*

| The process | Signature of the syntax | Meaning and Function |
| :--- | :--- | :--- |
| `append` | `(append s1 s2 ...)` | Plate the elements in multiple lists into a single list |
| `map` | `(map proc s)` | The process of unification  `proc`  Map to  `s`  Each element of the new list is collected |
| `filter` | `(filter pred s)` | The only thing that makes the word  `pred`  Return  `#t`  The elements |
| `apply` | `(apply proc s)` | **List of disassembly arguments** The list:  `s`  The first is the decomposition of parameters into calls.  `proc` |

### Apply vs Map Core resolution

- `(map + '(1 2 3 4))` The following is the list of numbers:  `(+ 1)`, `(+ 2)`...can't finish the addition;
- `(apply + '(1 2 3 4))` It's the equivalent of evaluation.  `(+ 1 2 3 4)` Get the full list straight  `10` So there is no need for any additional definition in the Scheme!  `sum`  function.

---

## 5. Recursive Problem Solving: Even Subsets

![recursion Major Event: Even Subsets lecture board illustration (00:16:45)](</attachments/cs61a-40bd8c109655fb731dfb82e0.png>)
*⏱ Timestamp: 00:16:45 · 📷 Lecture screenshot · [Watch clip (P27 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1005)*

Requirements: Give a list of integers  $S$ And they're asking for it all. **Elements and even numbers** List of non-empty subset

![recursion Major Event: Even Subsets lecture board illustration (00:18:45)](</attachments/cs61a-07dfbcf974dd697635927afb.png>)
*⏱ Timestamp: 00:18:45 · 📷 Lecture screenshot · [Watch clip (P27 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1125)*

### Recursion mathematical structural analysis

For the list  $S$  The set of even numbers:
1. **Not including the first item  `(car S)`** The rest of the story:  `(cdr S)`  The set of all even numbers;
2. **Includes the first item  `(car S)`**: 
   - If  `(car S)`  The number of pairs:  `(car S)`  The word "s" `(cdr S)`  of **The set of even numbers** The first is the "P" (the "P") and the second is the "D".
   - If  `(car S)`  The number of miracles:  `(car S)`  The word "s" `(cdr S)`  of **The set of odd numbers** The first is the "C" + "C" = "par";
3. **The single element subset** If:  `(car S)`  The number itself is even, and the  `(list (car S))`  The first is the "Self-Collection".

![recursion Mathematical structure analysis. lecture board illustration (00:20:45)](</attachments/cs61a-217915c2b2375b5d9bcdecfa.png>)
*⏱ Timestamp: 00:20:45 · 📷 Lecture screenshot · [Watch clip (P27 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1245)*

![recursion Mathematical structure analysis. lecture board illustration (00:22:15)](</attachments/cs61a-083875ba63c0523477b4db12.png>)
*⏱ Timestamp: 00:22:15 · 📷 Lecture screenshot · [Watch clip (P27 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1335)*

### The Pipeline Solution is a modern, innovative pipeline solution.

With help  `filter`  and  `apply` We can reconstruct complex multi-recursion lines into extremely pure functional flow lines:

![The Pipeline Solution (00:23:45) · lecture board illustration](</attachments/cs61a-8dc8a9fcd552444e581e65ee.png>)
*⏱ Timestamp: 00:23:45 · 📷 Lecture screenshot · [Watch clip (P27 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1425)*

```scheme
;; 1. 生成所有非空子集 (经典组合递归)
(define (nonempty-subsets s)
  (if (null? s) nil
      (let ((rest (nonempty-subsets (cdr s))))
        (append rest
                (map (lambda (t) (cons (car s) t)) rest)
                (list (list (car s)))))))

;; 2. 流水线过滤：仅保留求和为偶数的子集
(define (even-subsets s)
  (filter (lambda (subset) (even? (apply + subset)))
          (nonempty-subsets s)))

;; 测试运行
(even-subsets '(3 4 5 7))
;; 返回: ((4) (3 5) (3 7) (5 7) (3 4 5) (3 4 7) (4 5 7))
```

> **Code evaluation** This implementation completely abandoned the maintenance of a cumbersome odd-numbered interrecursion state, generating all candidate subset sets with a random determining subset and whether or not to dissolve the set completely, demonstrating abstraction power and pure beauty in functional architecture.

---

## Chapter 6 Summary and Core Points

1. **Linked list source** Remember:  `(cons car cdr)`  The point topology of the direct element is distinguished from the bracket level of the nested list.
2. **The Gate of Reference** The single quotation  `'`  The critical mechanism for Lisp to implement metric programming and symbol computation is to block evaluation.
3. **higher-order combinations** The following is a list of the top 10 best places to work in:  `map`, `filter`  and  `apply`  The syntax of the algorithm is a combination of several lines of declarative code that can be used to solve complex combinatorial mathematical problems.

---

