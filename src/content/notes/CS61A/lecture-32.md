---
title: Lecture 32 · 宏与语法扩展 (Macros)
description: CS61A 第 32 讲：宏与语法扩展 (Macros)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 32
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：28:53 ｜ **视频回链**：[B 站对应单集 (P32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32)

## 1. 准引用热身与符号表达式操纵 (Quasi-quotation Practice)

在正式探索宏之前，必须炉火纯青地掌握准引用（\`）与解引用（,）的精确控制。

![准引用热身与符号表达式操纵 (Quasi-quotation Practice) · 课堂板书演示 (00:00:27)](</attachments/cs61a-477918271f46de4a8e3ab0a2.png>)
*⏱ 时间戳：00:00:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:00:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=27)*

### 综合思考题：构造平方和表达式

目标：补全空白处的准引用与解引用符号，使得调用后能精确生成表示 $a^2 + b^2$ 的 Scheme 代码列表 `(+ (* a a) (* b b))`：

```scheme
;; 目标：定义 square-expr 并生成代码列表
(define (square-expr term)
  `(* ,term ,term))

`(+ ,(square-expr 'a) ,(square-expr 'b))
;; => (+ (* a a) (* b b))
```

![综合思考题：构造平方和表达式 · 课堂板书演示 (00:01:50)](</attachments/cs61a-edb5f1802463133861403e54.png>)
*⏱ 时间戳：00:01:50 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:01:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=110)*

![综合思考题：构造平方和表达式 · 课堂板书演示 (00:03:44)](</attachments/cs61a-a0cf033369abc53c65344124.png>)
*⏱ 时间戳：00:03:44 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:03:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=224)*

- **关键解析**：
  1. `square-expr` 需要返回形如 `(* a a)` 的列表，因此外层必须加上准引用 \`；
  2. 形参 `term` 不能作为字面符号保留，必须加上解引用 `,term`，才能将实参符号填入乘法表达式中；
  3. 外层的 `+` 表达式必须整体准引用，而内部调用 `(square-expr 'a)` 则必须解引用求值，以获取生成的乘法表达式列表。

---

## 2. 什么是宏？为语言发明新的特殊形式 (What Are Macros?)

在普通函数调用中，解释器遵循**应用序求值（Applicative-Order Evaluation）**：先求值操作符与所有操作数，再进入函数体。这决定了普通函数无法控制参数的求值时机与求值次数。

![什么是宏？为语言发明新的特殊形式 (What Are Macros?) · 课堂板书演示 (00:05:35)](</attachments/cs61a-fba3e7d4b244905e0adfa75e.png>)
*⏱ 时间戳：00:05:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:05:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=335)*

![什么是宏？为语言发明新的特殊形式 (What Are Macros?) · 课堂板书演示 (00:07:06)](</attachments/cs61a-d6cc73b76b6c8d93df6a83c3.png>)
*⏱ 时间戳：00:07:06 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:07:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=426)*

**宏（Macro）是作用于程序源代码本身的变换过程**：
1. 宏接收**未经求值的表达式列表**作为参数；
2. 宏通过代码拼接生成一段全新的 Scheme 表达式代码；
3. 解释器对生成的代码执行二次求值。

---

## 3. 经典宏案例 1：执行两次的 `twice` 宏

假设我们需要一个语法结构，能够将任意操作执行两次。如果用普通过程实现：

```scheme
;; 错误尝试：普通过程
(define (twice expr)
  (begin expr expr))

(twice (print 2))
```

![经典宏案例 1：执行两次的 twice 宏 · 课堂板书演示 (00:08:03)](</attachments/cs61a-2f982076b911060e7fddbb63.png>)
*⏱ 时间戳：00:08:03 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:08:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=483)*

普通过程在调用前就会立即执行实参 `(print 2)`，屏幕上只输出一次 `2`，然后将 `print` 的返回值 `undefined` 传入 `twice`，无法实现真正的两次执行。

### 宏解决方案：`define-macro`

```scheme
(define-macro (twice expr)
  `(begin ,expr ,expr))

(twice (print 2))
```

![宏解决方案：define-macro · 课堂板书演示 (00:09:03)](</attachments/cs61a-41f3d1e68676943129c88f34.png>)
*⏱ 时间戳：00:09:03 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:09:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=543)*

![宏解决方案：define-macro · 课堂板书演示 (00:10:30)](</attachments/cs61a-02201baade893426c554120b.png>)
*⏱ 时间戳：00:10:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:10:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=630)*

- 解释器遇到宏调用 `twice` 时，**完全不求值 `(print 2)`**；
- 宏函数体接收到的 `expr` 是原始列表 `(print 2)`；
- 宏模板生成代码：`(begin (print 2) (print 2))`；
- 解释器求值该代码，屏幕上成功打印两次 `2`！

---

## 4. 经典宏案例 2：带源码报告的断言测试宏 `check`

在编写单元测试断言时，普通函数只能接收布尔值，无法知道究竟是哪行表达式失败了：

```scheme
;; 普通过程测试：失败时仅能输出 "failed"，丢失了上下文
(define (check val)
  (if val 'passed 'failed))
```

![经典宏案例 2：带源码报告的断言测试宏 check · 课堂板书演示 (00:12:30)](</attachments/cs61a-78089d0769b05279dd98c172.png>)
*⏱ 时间戳：00:12:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:12:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=750)*

通过宏，我们可以同时获取**测试表达式的代码**与其**执行结果**：

```scheme
(define-macro (check expr)
  `(if ,expr
       'passed
       (list 'failed ',expr)))
```

![经典宏案例 2：带源码报告的断言测试宏 check · 课堂板书演示 (00:14:05)](</attachments/cs61a-419a135b55fc82b351d069f9.png>)
*⏱ 时间戳：00:14:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:14:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=845)*

注意其中的 `',expr`：
- 外层单引号使得生成的代码中包含被引用的原始表达式；
- 当断言失败时，输出不仅包含 `'failed`，还直接打印出发生失败的原始表达式 `(> x 0)`！这是普通函数绝对无法做到的。

---

## 5. 经典宏案例 3：为 Scheme 增设 `for` 循环语法

Scheme 语言本身没有 `for ... in ...` 语法。借助宏，我们只需几行代码就能为 Scheme 创造出一套崭新的 `for` 循环语言特性！

![经典宏案例 3：为 Scheme 增设 for 循环语法 · 课堂板书演示 (00:15:42)](</attachments/cs61a-202f18f55125d8cc94eda6c5.png>)
*⏱ 时间戳：00:15:42 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:15:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=942)*

目标语法：
```scheme
(for x in '(2 3 4 5) (* x x))
;; 预期输出 => (4 9 16 25)
```

底层等价转换目标：
```scheme
(map (lambda (x) (* x x)) '(2 3 4 5))
```

![经典宏案例 3：为 Scheme 增设 for 循环语法 · 课堂板书演示 (00:17:41)](</attachments/cs61a-589aa61c92831715054e7a97.png>)
*⏱ 时间戳：00:17:41 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:17:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1061)*

### `for` 宏的完整实现

```scheme
(define-macro (for sym in vals expr)
  `(map (lambda (,sym) ,expr) ,vals))
```

测试执行：
```scheme
(for x in '(2 3 4 5) (* x x)) ; => (4 9 16 25)
```
仅仅通过定义一个简单的宏，我们就神不知鬼不觉地为 Scheme 语言扩展了高级循环控制结构！

---

## 6. 进阶挑战：递归过程的动态追踪宏 (`trace`)

在 Python 中，我们可以使用 `@trace` 装饰器打印递归调用的每一层输入与返回值：

![进阶挑战：递归过程的动态追踪宏 (trace) · 课堂板书演示 (00:19:36)](</attachments/cs61a-0885350d8aa5b37dae7b049c.png>)
*⏱ 时间戳：00:19:36 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:19:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1176)*

![进阶挑战：递归过程的动态追踪宏 (trace) · 课堂板书演示 (00:21:42)](</attachments/cs61a-6ba3c09d63ff8cb47d58a39c.png>)
*⏱ 时间戳：00:21:42 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:21:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1302)*

而在 Scheme 中，由于没有语言内置的装饰器语法，如果想要在不永久修改函数定义的前提下，按需单次追踪递归函数的执行，宏是唯一的终极利器。

### 追踪的设计思路

![追踪的设计思路 · 课堂板书演示 (00:24:24)](</attachments/cs61a-6e6702e2dcb4770c5157778f.png>)
*⏱ 时间戳：00:24:24 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:24:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1464)*

在执行 `(trace (fact 5))` 时，我们希望自动完成以下流水线：
1. 保存 `fact` 的原始过程定义到临时变量 `original`；
2. 将 `fact` 重定义为带打印日志的包装过程；
3. 执行 `(fact 5)`（此时内部递归调用都会触发打印）；
4. 将 `fact` 恢复为原始过程 `original`；
5. 返回计算结果 `120`。

### `trace` 宏代码实现

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

![trace 宏代码实现 · 课堂板书演示 (00:26:20)](</attachments/cs61a-99cde604985623be1437152d.png>)
*⏱ 时间戳：00:26:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:26:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1580)*

![trace 宏代码实现 · 课堂板书演示 (00:27:40)](</attachments/cs61a-247966756ed7f7da2e55addf.png>)
*⏱ 时间戳：00:27:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P32 00:27:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=32&t=1660)*

### 为什么 Scheme 的宏追踪比 Python 装饰器更灵活？

- Python 装饰器在函数定义时静态绑定，一旦装饰，所有后续调用都会强制打印日志；
- Scheme 的 `trace` 宏在**调用点动态介入**：
  - 想要追踪时调用 `(trace (fact 5))`，屏幕输出完整调用链；
  - 正常调用时写 `(fact 5)`，完全无日志开销！

---

## 宏与普通过程的核心差异速查

| 维度 | 普通过程 (Procedures) | 宏 (Macros) |
| :--- | :--- | :--- |
| **定义语法** | `(define (f x) ...)` | `(define-macro (f x) ...)` |
| **实参求值** | 进入函数前，实参**立即求值** | 实参**原样作为表达式列表传入** |
| **返回值语义** | 返回值即为最终计算结果 | 返回值是一段**新代码**，解释器立即对其再次求值 |
| **能力边界** | 数据计算与逻辑抽象 | 语法扩展、控制流定制、元编程 |
| **副作用控制** | 无法阻止参数表达式的副作用 | 能够推迟、重复或彻底跳过表达式求值 |

---

