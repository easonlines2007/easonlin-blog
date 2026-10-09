---
title: Lecture 28 · 异常处理、语法解析与计算器解释器 (Calculator)
description: CS61A 第 28 讲：异常处理、语法解析与计算器解释器 (Calculator)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 28
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：47:54 ｜ **视频回链**：[B 站对应单集 (P28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28)

## 1. 核心心智模型与架构图解

本讲是 CS61A 极其关键的转折点——**从“编写程序”跨越到“构建能够运行程序的程序（解释器）”**。

一个健壮的解释器由“前端语法解析”与“后端求值循环”紧密协作构成，并全程辅以严密的异常防御机制：

```
                    用户输入文本 (字符串: "(+ 2 (* 4 6))")
                                  │
                                  ▼
         ┌──────────────────────────────────────────────────┐
         │             词法分析 (Lexical Analysis)          │
         │   • 将原始文本切分为最小语法标记序列 (Tokens)    │
         │   • 输出: ['(', '+', 2, '(', '*', 4, 6, ')', ')']│
         └────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
         ┌──────────────────────────────────────────────────┐
         │             语法分析 (Syntactic Analysis)        │
         │   • 递归下降解析器 scheme_read()                 │
         │   • 括号配对，构造表达式树 (Pair 链表结构)       │
         │   • 输出: Pair('+', Pair(2, Pair(Pair('*'...), nil))│
         └────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
         ┌──────────────────────────────────────────────────┐
         │             求值-应用循环 (Eval-Apply Cycle)     │
         │   • calc_eval: 递归自底向上计算各子操作数        │
         │   • calc_apply: 将运算符过程分发应用于实参数值   │
         └────────────────────────┬─────────────────────────┘
                                  │
                                  ▼
                        计算结果 (数值: 26)
```

---

## 2. 异常机制与容错设计 (Exceptions & Error Handling)

异常是编程语言在遇到非预期状况时中断当前流程并通知上层处理的核心机制。

![异常机制与容错设计 (Exceptions & Error Handling) · 课堂板书演示 (00:01:15)](</attachments/cs61a-280cbaddc14be49e588f4d9a.png>)
*⏱ 时间戳：00:01:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=75)*

### 显式抛出异常：`raise` 语句

```python
# 抛出特定类型的异常并附带诊断信息
if not isinstance(x, (int, float)):
    raise TypeError("Double 只接受数值类型参数")
```

![抛出特定类型的异常并附带诊断信息 · 课堂板书演示 (00:04:15)](</attachments/cs61a-9ac7b52ebd844495940a66d8.png>)
*⏱ 时间戳：00:04:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=255)*

### 捕获与恢复：`try ... except`

![捕获与恢复：try ... except · 课堂板书演示 (00:06:45)](</attachments/cs61a-0d644f7494cf7ce86170b42c.png>)
*⏱ 时间戳：00:06:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=405)*

- **崩溃阻断**：未被捕获的异常会导致程序全盘崩溃并打印多行 Traceback；
- **优雅降级**：`try-except` 捕获特定异常后，允许程序继续保持运行或返回安全默认值：

```python
def invert_safe(x):
    """安全求倒数，拦截除以零错误。"""
    try:
        return 1 / x
    except ZeroDivisionError as e:
        return float('inf')  # 返回无穷大，避免整个系统宕机
```

---

## 3. 高阶归约与关注点分离 (Reduce & Divide All)

![高阶归约与关注点分离 (Reduce & Divide All) · 课堂板书演示 (00:09:45)](</attachments/cs61a-3ad6b4906780dcce4d7fcecd.png>)
*⏱ 时间戳：00:09:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=585)*

### 通用归约函数 `reduce`

将二元操作函数 `f` 成对应用于序列中的每一个元素，累计折叠为单一标量：

```python
def reduce(f, s, initial):
    """纯函数式归约实现。"""
    for x in s:
        initial = f(initial, x)
    return initial

# 计算 2 * 4 * 8 = 64
reduce(lambda acc, x: acc * x, [2, 4, 8], 1)
```

![计算 2 * 4 * 8 = 64 · 课堂板书演示 (00:12:45)](</attachments/cs61a-f3ed1704d317d70555febfba.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=765)*

### 结合异常隔离职责

```python
def divide_all(n, ds):
    """将分子 n 依次除以列表 ds 中的所有分母。"""
    try:
        return reduce(lambda a, b: a / b, ds, n)
    except ZeroDivisionError:
        return float('inf')
```

> **架构哲学**：
> `reduce` 专注于遍历与结合，对除零错误一无所知；`divide_all` 专注于数学除法与边界防御，两者职责完全正交。

---

## 4. 计算机语言层级与抽象层次

![计算机语言层级与抽象层次 · 课堂板书演示 (00:15:15)](</attachments/cs61a-d4c59031a7f43c33b9a74070.png>)
*⏱ 时间戳：00:15:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=915)*

![计算机语言层级与抽象层次 · 课堂板书演示 (00:18:15)](</attachments/cs61a-8a1c8ab911886e4a81ff3366.png>)
*⏱ 时间戳：00:18:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1095)*

1. **机器语言 (Machine Language)**：硬件 CPU 直接解码执行的二进制指令，直接操纵寄存器与物理内存地址，缺乏任何高级抽象机制。
2. **高级语言 (High-Level Language)**：如 Python、Scheme，提供变量命名、函数抽象、对象封装与自动垃圾回收。
3. **解释器 (Interpreter) vs 编译器 (Compiler)**：
   - **解释器**：逐条读取源码表达式并即时计算其效果；
   - **编译器**：在运行前将高级源码统一转译为机器码或低级字节码（如 Python Bytecode）。

![计算机语言层级与抽象层次 · 课堂板书演示 (00:22:15)](</attachments/cs61a-3857841a8261b02b8815fc40.png>)
*⏱ 时间戳：00:22:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1335)*

### 语法 (Syntax) vs 语义 (Semantics)

- **语法**：合法语言句式的构造文法（“形式”）；
- **语义**：语法成分被求值时的计算行为（“内涵”）。

---

## 5. 语法解析：文本到表达式树 (Parsing)

解析（Parsing）的本质是将无结构的扁平字符流转换为富含层次结构的**表达式语法树**。

![语法解析：文本到表达式树 (Parsing) · 课堂板书演示 (00:24:45)](</attachments/cs61a-ffb36a49741795be4e0cb928.png>)
*⏱ 时间戳：00:24:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1485)*

### 1. 表达式树的承载体：Python `Pair` 类

![表达式树的承载体：Python Pair 类 · 课堂板书演示 (00:26:45)](</attachments/cs61a-da0cc34769c97ef65301d2e0.png>)
*⏱ 时间戳：00:26:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1605)*

在 Python 中，我们使用自定义的 `Pair` 类直接模拟 Scheme 的底层 `cons` 单元：

```python
class Pair:
    """在 Python 中表示 Scheme 链表序对的数据结构。"""
    def __init__(self, first, rest):
        self.first = first
        self.rest = rest

    def __repr__(self):
        return f"Pair({repr(self.first)}, {repr(self.rest)})"

    def __str__(self):
        """格式化为标准 Scheme 括号输出: (+ 1 2)"""
        s = "(" + str(self.first)
        r = self.rest
        while isinstance(r, Pair):
            s += " " + str(r.first)
            r = r.rest
        if r is not nil:
            s += " . " + str(r)
        return s + ")"
```

### 2. 词法分析 (Lexical Analysis / Tokenization)

![词法分析 (Lexical Analysis / Tokenization) · 课堂板书演示 (00:29:15)](</attachments/cs61a-9fb27430226505f35a76eb15.png>)
*⏱ 时间戳：00:29:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:29:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1755)*

将输入行切分为原子 Token，剥离多余空格，识别括号与数值字面量：
```
"(+ 23 (* 4 5))" ──► ['(', '+', 23, '(', '*', 4, 5, ')', ')']
```

### 3. 语法分析 (Syntactic Analysis / Recursive Descent)

![语法分析 (Syntactic Analysis / Recursive Descent) · 课堂板书演示 (00:31:45)](</attachments/cs61a-c80c5a4f682688bbed06197f.png>)
*⏱ 时间戳：00:31:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:31:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1905)*

通过递归下降函数 `scheme_read` 消费 Token 流：
- **遇到原子（符号/数字）**：直接作为叶节点返回；
- **遇到左括号 `(`**：递归调用自身解析内部各个子表达式，直到命中匹配的右括号 `)`，组装为嵌套 `Pair`。

---

## 6. 计算器解释器核心架构 (The Calculator Language)

计算器语言（Calculator）是 Scheme 的一个算术子集，包含数字原子及 `+`、`-`、`*`、`/` 四种调用组合式。

![计算器解释器核心架构 (The Calculator Language) · 课堂板书演示 (00:33:45)](</attachments/cs61a-8b8f198bd9faeb6c28fc8c64.png>)
*⏱ 时间戳：00:33:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:33:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2025)*

![计算器解释器核心架构 (The Calculator Language) · 课堂板书演示 (00:36:15)](</attachments/cs61a-8fc4fc01fedc6bc15f09a791.png>)
*⏱ 时间戳：00:36:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2175)*

### 核心引擎：`calc_eval` (表达式求值)

![核心引擎：calc_eval (表达式求值) · 课堂板书演示 (00:38:15)](</attachments/cs61a-90d4c5e0440be8d1f6eb77b8.png>)
*⏱ 时间戳：00:38:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2295)*

```python
def calc_eval(exp):
    """自底向上递归求值计算器表达式。"""
    if isinstance(exp, (int, float)):
        return exp  # 基例：自求值数字直接返回
    elif isinstance(exp, Pair):
        # 递归调用：对所有操作数子表达式先求值
        arguments = exp.rest.map(calc_eval)
        # 将求值后的实参应用到操作符过程上
        return calc_apply(exp.first, arguments)
    else:
        raise TypeError(f"无法识别的非法表达式: {exp}")
```

### 运算核心：`calc_apply` (过程应用)

![运算核心：calc_apply (过程应用) · 课堂板书演示 (00:40:45)](</attachments/cs61a-b579b544f6a24f88ed84203d.png>)
*⏱ 时间戳：00:40:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:40:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2445)*

```python
def calc_apply(operator, args):
    """将运算符应用于已求值的参数列表。"""
    if operator == '+':
        return reduce(lambda a, b: a + b, args, 0)
    elif operator == '-':
        if args is nil:
            raise TypeError("- 至少需要一个参数")
        elif args.rest is nil:
            return -args.first  # 单参取负
        return reduce(lambda a, b: a - b, args.rest, args.first)
    elif operator == '*':
        return reduce(lambda a, b: a * b, args, 1)
    elif operator == '/':
        if args is nil:
            raise TypeError("/ 至少需要一个参数")
        elif args.rest is nil:
            return 1 / args.first  # 单参求倒数
        return reduce(lambda a, b: a / b, args.rest, args.first)
    else:
        raise TypeError(f"未知的操作符: {operator}")
```

---

## 7. 交互式 REPL 与全局错误防护 (Read-Eval-Print Loop)

![交互式 REPL 与全局错误防护 (Read-Eval-Print Loop) · 课堂板书演示 (00:43:15)](</attachments/cs61a-a0321008c10f39bc16a35985.png>)
*⏱ 时间戳：00:43:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:43:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2595)*

![交互式 REPL 与全局错误防护 (Read-Eval-Print Loop) · 课堂板书演示 (00:45:45)](</attachments/cs61a-e9f0e4879e1a87c4fa1446ea.png>)
*⏱ 时间戳：00:45:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P28 00:45:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2745)*

解释器的终极交互入口是 **REPL**（读取-求值-打印循环）：

```python
def read_eval_print_loop():
    """生产级交互式计算器 REPL。"""
    while True:
        try:
            src = input('calc> ')
            tokens = tokenize(src)
            expression = scheme_read(tokens)
            result = calc_eval(expression)
            print(result)
        except (SyntaxError, TypeError, ValueError, ZeroDivisionError) as err:
            # 捕获各阶段所有潜在异常，打印提示，绝不退出循环！
            print(f"Error: {err}")
        except (KeyboardInterrupt, EOFError):
            print("\nCalculation complete.")
            break
```

> **鲁棒性设计**：
> 词法错误（如非法字符）、语法错误（如括号不匹配）、求值错误（如未知符号）及运算错误（如除以零）在各层主动 `raise`，但在最外层 REPL 统一被 `except` 捕获。解释器打印友好错误信息后立即打印下一个提示符，等待用户重新输入。

---

## 8. 章节总结与核心考点

1. **解释器经典范式**：牢记 `Read -> Eval -> Apply -> Print` 四位一体闭环。
2. **树形互递归**：`calc_eval` 递归求值操作数，`calc_apply` 组合计算结果，两者交替递归构成了编程语言运行时的灵魂。
3. **分层错误防御**：各子模块各司其职抛出精确异常，REPL 最外层托底捕获，保障交互式会话永不崩溃。

---

