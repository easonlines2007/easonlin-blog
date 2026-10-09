---
title: Lecture 29 · 解释器架构与 Scheme 解释器实现 (Interpreters)
description: CS61A 第 29 讲：解释器架构与 Scheme 解释器实现 (Interpreters)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 29
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：29:48 ｜ **视频回链**：[B 站对应单集 (P29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29)

## 1. 表达式分类与特殊形式派发 (Special Forms & Eval Dispatch)

在 Scheme 中，所有表达式按语义分为三大类：
1. **自求值表达式（Self-evaluating Expressions）**：如数字、布尔值、空列表（`nil`），其求值结果直接就是其本身。
2. **符号（Symbols）**：在当前环境（Environment）中查找其绑定的值。
3. **组合式（Combinations / Well-formed Scheme Lists）**：
   - **特殊形式（Special Forms）**：由列表第一个元素（操作符符号）决定，如 `if`、`lambda`、`define`、`quote`、`cond`、`and`、`or`。特殊形式拥有自定义的非标准求值规则，其子表达式不一定全部求值，也不一定按常规顺序求值。
   - **调用表达式（Call Expressions）**：如果列表第一个元素不是已知特殊形式，则被当作常规过程调用。先求值操作符得到过程对象，再依次求值所有操作数，最后将过程应用于实参列表。

![表达式分类与特殊形式派发 (Special Forms & Eval Dispatch) · 课堂板书演示 (00:00:55)](</attachments/cs61a-e28ed34b0c5f309dede7274a.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=55)*

### 示例：自定义过程 `demo`

John DeNero 教授给出了一个在列表尾部追加元素 `3` 的递归过程定义：

```scheme
(define (demo s)
  (if (null? s)
      '(3)
      (cons (car s) (demo (cdr s)))))

(demo '(1 2)) ; => (1 2 3)
```

当 `(null? s)` 为真时直接返回基准列表 `'(3)`；否则通过 `cons` 构造新 pair，其头部为 `(car s)`，尾部递归调用 `(demo (cdr s))`。

![示例：自定义过程 demo · 课堂板书演示 (00:02:15)](</attachments/cs61a-a57ef02aca08389c9c05ef1a.png>)
*⏱ 时间戳：00:02:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=135)*

---

## 2. 跟踪 Scheme 解释器执行 (Tracing `scheme_eval`)

在终端中启动 Scheme 解释器的调试跟踪模式，可以清晰观察表达式如何在 Python 实现的 `scheme_eval` 中逐层展开。

![跟踪 Scheme 解释器执行 (Tracing scheme_eval) · 课堂板书演示 (00:03:45)](</attachments/cs61a-e4fc958e189a9a4562d7f292.png>)
*⏱ 时间戳：00:03:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=225)*

求值数值 `2` 时，`scheme_eval` 接收表达式 `2` 和全局帧（Global Frame），直接返回 `2`。求值 `(- 2)` 时：
1. 识别为调用表达式；
2. 在环境中查找到操作符 `-` 对应的内置取负/减法函数；
3. 求值操作数 `2` 得到 `2`；
4. 调用内置函数计算得到 `-2`。

当调用 `(demo '(1 2))` 时，解释器经历了完整的帧创建与递归跟踪：

![跟踪 Scheme 解释器执行 (Tracing scheme_eval) · 课堂板书演示 (00:05:45)](</attachments/cs61a-a10a663cfcf3ecad5a14af67.png>)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=345)*

- 初始调用创建局部帧 $F_1$，形参 `s` 绑定到列表 `(1 2)`；
- 递归调用创建局部帧 $F_2$，形参 `s` 绑定到 `(2)`；
- 基线调用创建局部帧 $F_3$，形参 `s` 绑定到 `nil`；
- 基线命中返回 `(3)`，沿调用链反向执行 `cons`，依次拼装成 `(2 3)` 与 `(1 2 3)`。

---

## 3. 引用特殊形式 (Quotation & `SchemeReader`)

在 Lisp/Scheme 中，**数据与代码具有相同的物理表现形式（Homoiconicity）**。为了防止解释器将列表作为代码执行，而是将其作为纯数据保留，我们需要使用 `quote` 特殊形式。

```scheme
(quote (+ 1 2)) ; => (+ 1 2) 列表数据，而非数值 3
'(+ 1 2)        ; => (+ 1 2) 单引号语法糖
```

单引号 `'expr` 仅仅是语法糖（Syntactic Sugar），在读取器（Reader）阶段就被展开为标准的二元列表 `(quote expr)`。

![引用特殊形式 (Quotation & SchemeReader) · 课堂板书演示 (00:07:45)](</attachments/cs61a-9a302232c92d444c69eccb7e.png>)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=465)*

### `SchemeReader` 的工作流程

在 `scheme_reader.py` 中，词法分析器（Tokenizer）将文本拆分为 token 流，语法分析器（Syntactic Analyzer）将嵌套的括号和缩进构建为嵌套的 `Pair` 链表：

![SchemeReader 的工作流程 · 课堂板书演示 (00:09:25)](</attachments/cs61a-8a5643f1f0e962a643de73e8.png>)
*⏱ 时间戳：00:09:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:09:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=565)*

求值器核心 `scheme_eval` 永远不会直接面对文本格式的单引号 `'x`，它接收到的永远是已经解析好的 Pair 结构：`Pair('quote', Pair('x', nil))`。

---

## 4. 逻辑特殊形式与短路求值 (Logical Special Forms & `do_if_form`)

逻辑形式（Logical Forms）如 `if`、`and`、`or`、`cond` 的核心特点是：**子表达式按需条件求值（Short-circuit Evaluation）**。

```scheme
(if <predicate> <consequent> <alternative>)
```

在 Python 实现中，对应的处理函数为 `do_if_form(expressions, env)`：
1. 调用 `scheme_eval(expressions.first, env)` 求值谓词（Predicate）；
2. 根据谓词的真假，决定选择求值后件（Consequent）还是前件（Alternative）；
3. **未被选中的分支绝对不会被求值**！

![逻辑特殊形式与短路求值 (Logical Special Forms & do_if_form) · 课堂板书演示 (00:10:45)](</attachments/cs61a-79cbe2d4795966f62f772907.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=645)*

### 短路求值演示与除零保护

考虑表达式：
```scheme
(if #t 1 (/ 1 0)) ; => 1 （不会触发除零异常）
(if #f 1 (/ 1 0)) ; => ZeroDivisionError!
```

![短路求值演示与除零保护 · 课堂板书演示 (00:12:15)](</attachments/cs61a-749dd4ec5cc16645ee170e16.png>)
*⏱ 时间戳：00:12:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:12:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=735)*

如果 `if` 是普通函数调用，所有的实参都会在进入函数前被全部求值，那么 `(/ 1 0)` 将无条件报错。这正是特殊形式之所以必须作为特殊处理分支存在的关键原因。

---

## 5. Lambda 表达式与过程对象 (`LambdaProcedure`)

`lambda` 是函数式编程的核心灵魂，它用于在运行时创建用户自定义过程（User-defined Procedure）。

```scheme
(lambda (x) (* x x))
```

在 Python 宿主实现中，我们定义 `LambdaProcedure` 类，它封装了构成闭包（Closure）的三个关键要素：
1. **形参列表（`formals`）**：由符号组成的 Scheme 列表，指定参数名称；
2. **函数体（`body`）**：一个或多个 Scheme 表达式构成的列表；
3. **定义时环境（`env`）**：一个 `Frame` 实例，记录该函数被定义时所在的环境帧。

![Lambda 表达式与过程对象 (LambdaProcedure) · 课堂板书演示 (00:13:35)](</attachments/cs61a-6b27baed16a00259e73947d8.png>)
*⏱ 时间戳：00:13:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:13:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=815)*

```python
class LambdaProcedure:
    def __init__(self, formals, body, env):
        self.formals = formals # Scheme list of symbols
        self.body = body       # Scheme list of expressions
        self.env = env         # Frame instance
```

---

## 6. 环境模型与帧的链式查找 (Frames and Environments)

**环境（Environment）** 是用于确定符号绑定的帧序列（Chain of Frames）。
每一个 `Frame` 实例维护：
- 一个局部字典（`bindings`）：记录局部符号与值的映射；
- 一个指向父帧的引用（`parent`）：指向上层环境；全局帧的 `parent` 为 `None`。

帧提供两个核心操作方法：
- `lookup(symbol)`：先在当前局部帧查找；若未找到且父帧存在，则递归在 `parent` 帧中查找；若全局帧仍未找到，抛出 `SchemeError`。
- `define(symbol, value)`：直接在**当前局部帧**中添加或覆盖符号绑定（不影响父帧）。

![环境模型与帧的链式查找 (Frames and Environments) · 课堂板书演示 (00:15:15)](</attachments/cs61a-add5ac2ec2e92a208fbcd3f7.png>)
*⏱ 时间戳：00:15:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=915)*

### Python 交互式测试 Frame 链

教授在 Python 中手动构建全局帧 $G$ 与局部帧 $F_1$ 并进行变量遮蔽（Shadowing）实验：

![Python 交互式测试 Frame 链 · 课堂板书演示 (00:16:35)](</attachments/cs61a-26af1413613ceda77154d568.png>)
*⏱ 时间戳：00:16:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:16:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=995)*

- 全局帧 $G$ 绑定：`y = 3`, `z = 5`；
- 局部帧 $F_1$（父帧为 $G$）绑定：`x = 2`, `z = 4`；
- 在 $F_1$ 中查找 `x` 得到 `2`；查找 `z` 得到局部帧的值 `4`（遮蔽了全局的 `5`）；
- 在 $F_1$ 中查找 `y`，局部无但顺沿父帧链找到全局的 `3`。

---

## 7. 词法作用域 vs 动态作用域 (Lexical vs Dynamic Scope)

这是程序设计语言语义学中最关键的理论分水岭之一：

| 作用域机制 | 新帧的父帧定义 | 查找依据 | 现代代表语言 |
| :--- | :--- | :--- | :--- |
| **词法作用域（Lexical / Static Scope）** | **过程定义时（Definition-time）** 所在的环境 | 依据代码在文本中的静态嵌套结构 | Scheme, Python, JavaScript |
| **动态作用域（Dynamic Scope）** | **过程被调用时（Call-time）** 所在的当前环境 | 依据调用栈运行时的先后顺序 | 早期 Lisp, Emacs Lisp (默认) |

![词法作用域 vs 动态作用域 (Lexical vs Dynamic Scope) · 课堂板书演示 (00:18:05)](</attachments/cs61a-ae8ab7319c8547845a014f50.png>)
*⏱ 时间戳：00:18:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:18:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1085)*

### 经典对比范例

```scheme
(define (f x) (+ x y))
(define (g x y) (f (+ x x)))
(g 3 7)
```

- **词法作用域（Lexical Scope）**：
  `f` 是在全局定义的，因此无论在哪里调用 `f`，其新帧的父帧永远是全局帧 $G$。当 `f` 试图查找 `y` 时，在 $F_f$ 和全局帧 $G$ 中均找不到 `y`，报错：`unknown identifier: y`。
- **动态作用域（Dynamic Scope）**：
  `f` 是在 `g` 的内部被调用的，因此 $F_f$ 的父帧是 $F_g$。在查找 `y` 时直接沿调用链找到 $F_g$ 中的 `y = 7`，计算结果为 `(+ 6 7) = 13`！

Scheme 与 Python 一致，严格遵循**词法作用域**。

---

## 8. 解释器核心：Eval 与 Apply 相互递归 (The Core Architecture)

解释器的执行引擎建立在两个互为递归的核心函数之上：

```python
def scheme_eval(expr, env):
    """求值表达式 expr 在环境 env 中的值。"""
    if is_primitive(expr):
        return expr
    elif is_symbol(expr):
        return env.lookup(expr)
    elif is_special_form(expr):
        return eval_special_form(expr, env)
    else: # 调用表达式
        procedure = scheme_eval(expr.first, env)
        args = expr.rest.map(lambda operand: scheme_eval(operand, env))
        return scheme_apply(procedure, args, env)

def scheme_apply(procedure, args, env):
    """将过程 procedure 应用于实参 args。"""
    if isinstance(procedure, PrimitiveProcedure):
        return procedure.apply(args)
    elif isinstance(procedure, LambdaProcedure):
        new_frame = procedure.env.make_child_frame(procedure.formals, args)
        return eval_all(procedure.body, new_frame)
```

![解释器核心：Eval 与 Apply 相互递归 (The Core Architecture) · 课堂板书演示 (00:20:45)](</attachments/cs61a-db5a75b58f8d45c589b9f64c.png>)
*⏱ 时间戳：00:20:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1245)*

![解释器核心：Eval 与 Apply 相互递归 (The Core Architecture) · 课堂板书演示 (00:22:45)](</attachments/cs61a-1dc3961b74b57b00c7ac825c.png>)
*⏱ 时间戳：00:22:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1365)*

- **`scheme_eval` 调用 `scheme_apply`**：当求值遇到普通函数调用时，先递归求值出运算符和所有操作数，然后交给 `scheme_apply`；
- **`scheme_apply` 调用 `scheme_eval`**：当应用用户自定义的 `LambdaProcedure` 时，创建新帧并调用 `scheme_eval` 来执行函数体表达式。

---

## 9. 符号绑定与过程定义语法糖 (Handling `define` Expressions)

`define` 表达式有两种形式：
1. **变量定义**：`(define <symbol> <expression>)`  
   先求值 `<expression>` 得到具体值，然后将 `<symbol>` 与该值绑定在当前帧中。
2. **过程定义**：`(define (<symbol> <param1> ...) <body>)`  
   这实际上是 `define` 配合 `lambda` 的完全等价语法糖：
   ```scheme
   (define <symbol> (lambda (<param1> ...) <body>))
   ```

![符号绑定与过程定义语法糖 (Handling define Expressions) · 课堂板书演示 (00:25:05)](</attachments/cs61a-79cccda670af5d90214249ac.png>)
*⏱ 时间戳：00:25:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:25:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1505)*

解释器在遇到 `(define (demo s) ...)` 时，会自动将其等价转换为 `(define demo (lambda (s) ...))`，从而复用通用的 `lambda` 求值逻辑。

---

## 10. 递归执行的环境链演进 (Environment Frame Chains in Action)

重温本课开头的 `demo` 函数，在执行 `(demo '(1 2))` 的整个生命周期中，环境链的构建过程如下图所示：

![递归执行的环境链演进 (Environment Frame Chains in Action) · 课堂板书演示 (00:27:15)](</attachments/cs61a-5bef67ccf325fd3303650c91.png>)
*⏱ 时间戳：00:27:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:27:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1635)*

1. 全局帧 $G$ 包含符号 `demo`，其绑定到一个 `LambdaProcedure` 实例，该实例的闭包环境 `env` 指向 $G$；
2. 第一次调用 `(demo '(1 2))`：创建新帧 $F_1$，父帧为 $G$，绑定 `s = (1 2)`；
3. 第二次递归调用 `(demo '(2))`：创建新帧 $F_2$，**父帧同样为 $G$**（根据词法作用域规则），绑定 `s = (2)`；
4. 第三次递归调用 `(demo nil)`：创建新帧 $F_3$，父帧同样为 $G$，绑定 `s = nil`；命中基线条件，开始逐层返回。

---

## 11. 计算机科学史的丰碑：Lisp 1.5 Eval-Apply

在 1960 年代，图灵奖得主 John McCarthy 在其发表的《Lisp 1.5 Programmer's Manual》中，首次仅仅用不到一页的篇幅，给出了 `eval` 和 `apply` 的形式化定义。

![计算机科学史的丰碑：Lisp 1.5 Eval-Apply · 课堂板书演示 (00:29:10)](</attachments/cs61a-095a5e48ecef38fcd0c714f0.png>)
*⏱ 时间戳：00:29:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P29 00:29:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1750)*

这份历史文献展现了编程语言最本质的统一性：**一个能够解释自身语言的元循环求值器（Metacircular Evaluator）**。你用 Python 实现的 Project 4 解释器，其核心逻辑与 60 多年前 McCarthy 的设计在精神与骨架上完全一致！

---

## 关键知识点与复习速查

| 核心组件 | 关键职责 / 逻辑实现 |
| :--- | :--- |
| **`scheme_eval(expr, env)`** | 表达式求值入口。根据类型分发（自求值、符号查找、特殊形式、过程调用）。 |
| **`scheme_apply(proc, args)`** | 过程调用入口。区分内置过程（调用 Python 函数）与用户自定义过程（创建新帧并求值函数体）。 |
| **`Frame`** | 环境链节点。包含局部键值对 `bindings` 和指向父环境的 `parent`。支持 `lookup` 和 `define`。 |
| **`LambdaProcedure`** | 闭包对象。封装形参列表 `formals`、函数体 `body` 和定义时环境 `env`。 |
| **词法作用域 (Lexical Scope)** | 新帧的 `parent` 指向函数被**定义**时的环境，而非调用时的环境。 |
| **短路求值 (Short-circuiting)** | 特殊形式（如 `if`、`and`、`or`）只选择性求值必要分支，避免无效计算或异常。 |

---

