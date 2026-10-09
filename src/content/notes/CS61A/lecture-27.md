---
title: Lecture 27 · Scheme 列表与符号计算 (Scheme Lists)
description: CS61A 第 27 讲：Scheme 列表与符号计算 (Scheme Lists)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 27
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：24:44 ｜ **视频回链**：[B 站对应单集 (P27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27)

## 1. 核心心智模型与架构图解

在 Python 中，内置了列表、元组、字典与集合等繁多的数据结构；而在 Scheme 中，**列表（List）即一切**。

Scheme 的列表在底层是严格的**单向链表（Linked List）**结构。它由最精炼的“三位一体”原语所支撑：

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

- **底层同构**：每个列表都是一个或多个嵌套的 `cons` 单元，右格递归指向剩余列表，末尾以 `nil` 终结。
- **呈现分离**：虽然底层是复杂的指针网格，但 Scheme 解释器在 REPL 中统一以扁平带括号的空格分隔形式输出，如 `(1 2 3 4)`。

---

## 2. 列表基础操作：Cons, Car, Cdr 与 Nil

![列表基础操作：Cons, Car, Cdr 与 Nil · 课堂板书演示 (00:00:55)](</attachments/cs61a-296a49efc1f146739c2e9769.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=55)*

![列表基础操作：Cons, Car, Cdr 与 Nil · 课堂板书演示 (00:02:15)](</attachments/cs61a-8fb490fdf0b82d4df0c4b384.png>)
*⏱ 时间戳：00:02:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=135)*

### 核心原语定义

- `(cons first rest)`：构造一个新节点。`first` 可为任意数据，良构列表中 `rest` 必须是另一个列表或 `nil`。
- `(car s)`：获取链表的首个元素（First）。
- `(cdr s)`（读作 "could-er"）：获取链表的剩余部分（Rest）。
- `nil`：代表空链表（`'()`）。

![核心原语定义 · 课堂板书演示 (00:03:45)](</attachments/cs61a-c26587502dc456721fdbe35d.png>)
*⏱ 时间戳：00:03:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=225)*

### 嵌套构造演练与可视化 (Draw)

![嵌套构造演练与可视化 (Draw) · 课堂板书演示 (00:04:45)](</attachments/cs61a-f0290b44cf973ae04f7f41b4.png>)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=285)*

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

![嵌套构造演练与可视化 (Draw) · 课堂板书演示 (00:06:15)](</attachments/cs61a-f4a463edcdf2514bcd4029eb.png>)
*⏱ 时间戳：00:06:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=375)*

### 构造器 `list` 与常用谓词

使用嵌套 `cons` 构造长列表过于冗长，Scheme 提供了变参构造器 `list`：

```scheme
(list 1 2 3 4)  ; 等价于 (cons 1 (cons 2 (cons 3 (cons 4 nil))))

(list? '(1 2))  ; #t
(null? nil)     ; #t (判定是否为空列表)
(null? '(1))    ; #f
```

---

## 3. 符号计算与引用机制 (Symbolic Programming & Quotation)

在传统编程语言中，符号（变量名）始终在求值时被替换为它所绑定的值；但在人工智能和定理证明中，我们需要**程序能够将符号本身作为数据进行操纵**（符号计算 Symbolic Manipulation）。

![符号计算与引用机制 (Symbolic Programming & Quotation) · 课堂板书演示 (00:07:45)](</attachments/cs61a-1df3ee6a7c51502e356edbe2.png>)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=465)*

### 单引号引用语法 (Quotation)

![单引号引用语法 (Quotation) · 课堂板书演示 (00:09:15)](</attachments/cs61a-5cd2d972b8656086b816fa8b.png>)
*⏱ 时间戳：00:09:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=555)*

单引号 `'` 是特殊形式 `quote` 的语法糖，它通知解释器：**不要对后续表达式进行求值，直接将其原样作为数据返回！**

![单引号引用语法 (Quotation) · 课堂板书演示 (00:10:45)](</attachments/cs61a-21b175c62bdeb5f716b2ab78.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=645)*

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

> **经典索引推导**：
> 求值 `(car (cdr (car (cdr '(1 (2 3) 4)))))`：
> 1. `(cdr '(1 (2 3) 4))` $\to$ `'((2 3) 4)`
> 2. `(car ...)` $\to$ `'(2 3)`
> 3. `(cdr ...)` $\to$ `'(3)`
> 4. `(car ...)` $\to$ 整数 `3`！

---

## 4. 高阶列表处理过程：Append, Map, Filter 与 Apply

Scheme 拥有极其强大的函数式列表内置库：

![高阶列表处理过程：Append, Map, Filter 与 Apply · 课堂板书演示 (00:12:15)](</attachments/cs61a-36cba99d57b862332207f11e.png>)
*⏱ 时间戳：00:12:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:12:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=735)*

![高阶列表处理过程：Append, Map, Filter 与 Apply · 课堂板书演示 (00:13:45)](</attachments/cs61a-cac95ca1234a4f430cf2230d.png>)
*⏱ 时间戳：00:13:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=825)*

![高阶列表处理过程：Append, Map, Filter 与 Apply · 课堂板书演示 (00:15:15)](</attachments/cs61a-ed47348ae462df4c3cf32422.png>)
*⏱ 时间戳：00:15:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=915)*

| 过程 | 语法签名 | 语义与功能 |
| :--- | :--- | :--- |
| `append` | `(append s1 s2 ...)` | 将多个列表中的元素扁平拼接到一个单一列表中 |
| `map` | `(map proc s)` | 将单参过程 `proc` 映射到 `s` 的每个元素上，收集为新列表 |
| `filter` | `(filter pred s)` | 仅保留使得谓词 `pred` 返回 `#t` 的元素 |
| `apply` | `(apply proc s)` | **拆包实参列表**：将列表 `s` 解构为各个形参，调用 `proc` |

### Apply vs Map 核心辨析

- `(map + '(1 2 3 4))`：相当于对每个数字分别调用 `(+ 1)`, `(+ 2)`... 无法完成累加；
- `(apply + '(1 2 3 4))`：相当于求值 `(+ 1 2 3 4)`，直接求得全列表总和 `10`！因此在 Scheme 中无需额外定义 `sum` 函数。

---

## 5. 递归大题实战：偶数子集算法 (Even Subsets)

![递归大题实战：偶数子集算法 (Even Subsets) · 课堂板书演示 (00:16:45)](</attachments/cs61a-40bd8c109655fb731dfb82e0.png>)
*⏱ 时间戳：00:16:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1005)*

需求：给定一个整数列表 $S$，求出其所有**元素之和为偶数**的非空子集列表。

![递归大题实战：偶数子集算法 (Even Subsets) · 课堂板书演示 (00:18:45)](</attachments/cs61a-07dfbcf974dd697635927afb.png>)
*⏱ 时间戳：00:18:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1125)*

### 递归数学结构分析

对于列表 $S$ 的偶数子集：
1. **不包含首项 `(car S)`**：即剩余部分 `(cdr S)` 的所有偶数子集；
2. **包含首项 `(car S)`**：
   - 若 `(car S)` 为偶数：将 `(car S)` 拼接在 `(cdr S)` 的**偶数子集**前面（偶 + 偶 = 偶）；
   - 若 `(car S)` 为奇数：将 `(car S)` 拼接在 `(cdr S)` 的**奇数子集**前面（奇 + 奇 = 偶）；
3. **单元素子集**：若 `(car S)` 自身为偶数，则 `(list (car S))` 自身构成一个合法子集。

![递归数学结构分析 · 课堂板书演示 (00:20:45)](</attachments/cs61a-217915c2b2375b5d9bcdecfa.png>)
*⏱ 时间戳：00:20:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1245)*

![递归数学结构分析 · 课堂板书演示 (00:22:15)](</attachments/cs61a-083875ba63c0523477b4db12.png>)
*⏱ 时间戳：00:22:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1335)*

### 优雅的管道化解法 (The Pipeline Solution)

借助 `filter` 与 `apply`，我们可以将复杂的多分支递归重构为极其纯粹的函数式流水线：

![优雅的管道化解法 (The Pipeline Solution) · 课堂板书演示 (00:23:45)](</attachments/cs61a-8dc8a9fcd552444e581e65ee.png>)
*⏱ 时间戳：00:23:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P27 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1425)*

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

> **代码赏析**：
> 这一实现完全摒弃了繁琐的奇偶互递归状态维护，将“生成所有候选子集”与“判定子集和是否为偶数”彻底解耦，尽显函数式架构的抽象威力和纯粹美感。

---

## 6. 章节总结与核心考点

1. **链表本源**：牢记 `(cons car cdr)` 的指针拓扑；区分直接元素与嵌套列表的括号层级。
2. **引用之门**：单引号 `'` 阻止求值，是 Lisp 实现元编程与符号计算的关键机制。
3. **高阶组合技**：熟练掌握 `map`、`filter` 与 `apply` 的协同配合，能够用几行声明式代码优雅解决复杂的组合数学问题。

---

