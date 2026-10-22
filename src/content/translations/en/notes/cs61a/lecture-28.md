---
kind: notes
source: cs61a/lecture-28
title: "Lecture 28 · Calculator: Exceptions, Parsing, and Interpretation"
description: "CS61A Lecture 28: Exception handling, syntax parsing, and a
  calculator interpreter."
sourceHash: e4fb4c616c5dbae4dad2801b0a2aacb0850f2f4623e2f3abf1b8e086156dafc0
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-28).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 47:54 ｜ **Video link back**: [B-station response unit set (P28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28)

## 1. Core mind model and architecture

The CS61A is a crucial turning point in the development of the CS61A. **Crosses the "Current" from "Current" to "Build a program capable of running (interpreter)"**.

A robust interpreter is made up of a close collaboration between the front end syntax analysis and the rear end evaluation loop, and is complemented by rigorous abnormal defense mechanisms:

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

## 2. Exceptions & Error Handling (Exceptions and Error Handling)

The exception is that a programming language disrupts the current process and informs the core mechanism of upper processing when it encounters unexpected situations.

![Exceptions & Error Handling (Exceptions & Errors Handling) · lecture board illustration (00:01:15)](</attachments/cs61a-280cbaddc14be49e588f4d9a.png>)
*⏱ Timestamp: 00:01:15 · 📷 Lecture screenshot · [Watch clip (P28 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=75)*

### The report also highlights the importance of the EU's efforts to combat terrorism. `raise`  The phrase

```python
# 抛出特定类型的异常并附带诊断信息
if not isinstance(x, (int, float)):
    raise TypeError("Double 只接受数值类型参数")
```

![Throw out specific types of anomalies with diagnostic information lecture board illustration (00:04:15)](</attachments/cs61a-9ac7b52ebd844495940a66d8.png>)
*⏱ Timestamp: 00:04:15 · 📷 Lecture screenshot · [Watch clip (P28 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=255)*

### Capture and recovery: `try ... except`

![The first is the "Capture and Recovery: Try ... except for · lecture board illustration (00:06:45)](</attachments/cs61a-0d644f7494cf7ce86170b42c.png>)
*⏱ Timestamp: 00:06:45 · 📷 Lecture screenshot · [Watch clip (P28 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=405)*

- **The collapse blocked** Untraceable anomalies can cause the entire program to crash and print multi-line Traceback.
- **Decreased gracefully**: `try-except`  After capturing a specific exception, the program is allowed to continue running or return security defaults:

```python
def invert_safe(x):
    """安全求倒数，拦截除以零错误。"""
    try:
        return 1 / x
    except ZeroDivisionError as e:
        return float('inf')  # 返回无穷大，避免整个系统宕机
```

---

## 3. higher-order reduction and division of focus (Reduce & Divide All)

![Separation of higher-order from focus (Reduce & Divide All) lecture board illustration (00:09:45)](</attachments/cs61a-3ad6b4906780dcce4d7fcecd.png>)
*⏱ Timestamp: 00:09:45 · 📷 Lecture screenshot · [Watch clip (P28 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=585)*

### General assignment function  `reduce`

The binary operation function  `f`  Each element in the sequence is applied to a single matrix, folded cumulatively:

```python
def reduce(f, s, initial):
    """纯函数式归约实现。"""
    for x in s:
        initial = f(initial, x)
    return initial

# 计算 2 * 4 * 8 = 64
reduce(lambda acc, x: acc * x, [2, 4, 8], 1)
```

![Calculate 2 \* 4 \* 8 = 64 lecture board illustration (00:12:45)](</attachments/cs61a-f3ed1704d317d70555febfba.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P28 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=765)*

### Combined with unusual isolation duties

```python
def divide_all(n, ds):
    """将分子 n 依次除以列表 ds 中的所有分母。"""
    try:
        return reduce(lambda a, b: a / b, ds, n)
    except ZeroDivisionError:
        return float('inf')
```

> **Philosophy of architecture**: 
> `reduce`  The focus is on cross-referencing and combining, with no knowledge of zero errors; `divide_all`  The focus is on mathematical deconstruction and border defence, both of which are completely orthogonal.

---

## 4. Computer language level and abstraction level

![Computer Language Level and abstraction Level . lecture board illustration (00:15:15)](</attachments/cs61a-d4c59031a7f43c33b9a74070.png>)
*⏱ Timestamp: 00:15:15 · 📷 Lecture screenshot · [Watch clip (P28 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=915)*

![Computer Language Level and abstraction Level lecture board illustration (00:18:15)](</attachments/cs61a-8a1c8ab911886e4a81ff3366.png>)
*⏱ Timestamp: 00:18:15 · 📷 Lecture screenshot · [Watch clip (P28 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1095)*

1. **Machine language**: Binary instructions executed directly by the hardware CPU, direct manipulation of registers and physical memory addresses, lack any advanced abstraction mechanism.
2. **High-Level Language (HL)** For example, Python scheme provides variable naming, function abstraction, object packaging and automatic waste recycling.
3. **interpreter (Interpreter) vss compilation Device (Compiller)**: 
   - **The interpreter**: Read the source expression step by step and calculate its effect instantly;
   - **Compilation engine**: Unified translation of high-level source code into machine code or low-level byte code (e.g., Python Bytecode) before running

![Computer Language Level and abstraction Level lecture board illustration (00:22:15)](</attachments/cs61a-3857841a8261b02b8815fc40.png>)
*⏱ Timestamp: 00:22:15 · 📷 Lecture screenshot · [Watch clip (P28 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1335)*

### Syntax vs. Semantics

- **The language** The legal language of the sentence is: constructive grammar (in the form of a string);
- **The meaning**: Calculated behaviour of the syntax component at the time of evaluation (“inline”).

---

## 5.Symphonic analysis: text to the expression tree (Parsing)

The essence of Parsing is to convert unstructured flat character streams into rich hierarchical structures. **The tree of expression**.

![Syntax: Text to expression Parsing... lecture board illustration (00:24:45)](</attachments/cs61a-ffb36a49741795be4e0cb928.png>)
*⏱ Timestamp: 00:24:45 · 📷 Lecture screenshot · [Watch clip (P28 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1485)*

### 1. The carrier of the expression tree: Python  `Pair`  The class

![expression Tree carrier: Python Pair class. lecture board illustration (00:26:45)](</attachments/cs61a-da0cc34769c97ef65301d2e0.png>)
*⏱ Timestamp: 00:26:45 · 📷 Lecture screenshot · [Watch clip (P28 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1605)*

In Python, we use customized  `Pair`  The bottom of the Direct Simulation Scheme  `cons`  Unit:

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

### 2. lexical analysis (also known as lexical analysis or tokenization)

![lexical Analysis (Lexical Analysis/Tokenization) lecture board illustration (00:29:15)](</attachments/cs61a-9fb27430226505f35a76eb15.png>)
*⏱ Timestamp: 00:29:15 · 📷 Lecture screenshot · [Watch clip (P28 00:29:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1755)*

The input line is broken down into atomic tokens, stripping the excess space and identifying brackets with numerical cubic values:
```
"(+ 23 (* 4 5))" ──► ['(', '+', 23, '(', '*', 4, 5, ')', ')']
```

### Syntactic Analysis (or Recursive Descent) is a syntactical analysis of the language.

![The first is the syntactic analysis of language (Synthetic Analysis / Recursive Descent) and the lecture board illustration (00:31:45).](</attachments/cs61a-c80c5a4f682688bbed06197f.png>)
*⏱ Timestamp: 00:31:45 · 📷 Lecture screenshot · [Watch clip (P28 00:31:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1905)*

The decrease function by recursion  `scheme_read`  The following is a list of the most commonly used token types:
- **The first is the atomic number.** The first is the return of the leaf node directly.
- **When a left parenthesis is encountered  `(`** Recursion: calls itself to parse the sub-expression inside until the right brackets match the hit  `)` It's a set of  `Pair`.

---

## 6. Calculator interpreter Core Architecture (The Calculator Language)

Calculator is an arithmetic subset of Scheme, containing the numerical atoms and the number of elements.  `+`, `-`, `*`, `/`  The four combinations of calls.

![Calculator interpreter Core Architecture (The Calculator Language) lecture board illustration (00:33:45)](</attachments/cs61a-8b8f198bd9faeb6c28fc8c64.png>)
*⏱ Timestamp: 00:33:45 · 📷 Lecture screenshot · [Watch clip (P28 00:33:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2025)*

![Calculator interpreter Core Architecture (The Calculator Language) lecture board illustration (00:36:15)](</attachments/cs61a-8fc4fc01fedc6bc15f09a791.png>)
*⏱ Timestamp: 00:36:15 · 📷 Lecture screenshot · [Watch clip (P28 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2175)*

### The core engine: `calc_eval`  (Expression Evaluation)

![The main engine: calc\_eval (expressionevaluation) · lecture board illustration (00:38:15)](</attachments/cs61a-90d4c5e0440be8d1f6eb77b8.png>)
*⏱ Timestamp: 00:38:15 · 📷 Lecture screenshot · [Watch clip (P28 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2295)*

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

### The core of the calculation: `calc_apply`  (Application of the process)

![The first is the "Call\_Apply" (process application) and the second is the "Lecture Board Illustration".](</attachments/cs61a-b579b544f6a24f88ed84203d.png>)
*⏱ Timestamp: 00:40:45 · 📷 Lecture screenshot · [Watch clip (P28 00:40:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2445)*

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

## 7. Interactive REPL with the Read-Eval-Print Loop

![Read-Eval-Print Loop - Interactive REPL with the Universal Error Loop (00:43:15) · lecture board illustration](</attachments/cs61a-a0321008c10f39bc16a35985.png>)
*⏱ Timestamp: 00:43:15 · 📷 Lecture screenshot · [Watch clip (P28 00:43:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2595)*

![Interactive REPL and Global Error Protection (Read-Eval-Print Loop) lecture board illustration (00:45:45)](</attachments/cs61a-e9f0e4879e1a87c4fa1446ea.png>)
*⏱ Timestamp: 00:45:45 · 📷 Lecture screenshot · [Watch clip (P28 00:45:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2745)*

The final interaction input of the interpreter is  **REPL** (Reading - evaluation - Print cycle:

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

> **Robust design** The following are the most common types of error: lexical errors (such as illegal characters), grammatical errors (suche with no brackets) evaluation errors (sucha with unknown symbols) and operations errors (suches with zero) active in all levels  `raise` The first is the REPL, which was created in the early 1990s.  `except`  Capture: The interpreter prints the friendly error message and then prints the next prompt, waiting for the user to re-enter.

---

## Chapter 8 Summary and Core Points

1. **The interpreters classical paradigm** Remember:  `Read -> Eval -> Apply -> Print`  The Four-Trinity Circle.
2. **Tree-shaped recursion**: `calc_eval`  The recursionevaluationoperand is a function of the recursion value. `calc_apply`  Combined computations, the two alternate recursions form the soul of programming language running.
3. **The Layered Error Defense** The sub-modules each cast their own exact anomalies, and REPL captured the outermost totem points to ensure that interactive sessions never collapsed.

---

