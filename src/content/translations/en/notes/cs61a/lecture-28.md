---
kind: notes
source: cs61a/lecture-28
title: "Lecture 28 · Calculator: Exceptions, Parsing, and Interpretation"
description: "CS61A Lecture 28: Exception handling, syntax parsing and
  calculator interpreter (Calculator)"
sourceHash: 02d785095d98202d31ba65fec01a37bc9d4d81865c224d431f3a38932970b7d4
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 4: Interpreters & Scheme (Interpreters & Scheme)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 47:54 ｜ **Classroom screenshots**: 18 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28)  
> **Quick navigation**: [← Previous Lecture (P27 Lecture 29 Scheme Lists)](/en/notes/cs61a/lecture-27) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P29 Lecture 31 Interpreters) →](/en/notes/cs61a/lecture-29)

---

## 1. Core mental model and architecture diagram

This lecture is an extremely critical turning point in CS61A——**From "writing a program" to "building a program (interpreter) that can run the program"**.

A robust interpreter is composed of "front-end syntax parsing" and "back-end evaluation loop" that work closely together, and is supplemented by a strict exception defense mechanism throughout:

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

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Core Mental Model and Architecture Diagram" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Exception mechanism and fault-tolerant design (Exceptions & Error Handling)

Exceptions are the core mechanism of programming languages to interrupt the current process and notify upper-level processing when encountering unexpected conditions.

[![Exception mechanism and fault-tolerant design (Exceptions & Error Handling) · Classroom blackboard demonstration (00:01:15)](</attachments/cs61a-280cbaddc14be49e588f4d9a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=75)
*⏱ Timestamp: 00:01:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=75)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So there are different classes, many of them built in, such as type error and name error. And then to build a particular type error just involves passing in a string that describes what happened. So here's the kind of error that occurred, and here's the specific detail. And there are type errors tha...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Exception mechanism and fault-tolerant design (Exceptions & Error Handling)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Throw an exception explicitly: `raise`  statement

```python
# 抛出特定类型的异常并附带诊断信息
if not isinstance(x, (int, float)):
    raise TypeError("Double 只接受数值类型参数")
```

[![Throw specific types of exceptions with diagnostic information · Classroom blackboard demonstration (00:04:15)](</attachments/cs61a-9ac7b52ebd844495940a66d8.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=255)
*⏱ Timestamp: 00:04:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=255)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The program halts, shows an error message, a trace back, and then it's up to the programmer to figure out what they want to do next, change the program and run it again. But maybe you want to write a program that keeps going even after an error occurs. And the way to do that is to use a try statemen...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Exception mechanism and fault-tolerant design (Exceptions & Error Handling)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Capture and recovery: `try ... except`

[![Capture and recovery: try ... except · Classroom blackboard demonstration (00:06:45)](</attachments/cs61a-0d644f7494cf7ce86170b42c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=405)
*⏱ Timestamp: 00:06:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=405)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“This program's just fine. I can invert two to get 0.5, and this is printed because x was two, not zero. But if I invert zero, then an exception is raised. This was never handled, and this line was never printed. But then I can write another function, invert safe. And what invert safe is going to do ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Exception mechanism and fault-tolerant design (Exceptions & Error Handling)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **Crash blocking**: Uncaught exceptions will cause the program to crash completely and print multiple lines of Traceback;
- **Graceful downgrade**: `try-except`  After catching a specific exception, allow the program to continue running or return to safe defaults:

```python
def invert_safe(x):
    """安全求倒数，拦截除以零错误。"""
    try:
        return 1 / x
    except ZeroDivisionError as e:
        return float('inf')  # 返回无穷大，避免整个系统宕机
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Exception Mechanism and Fault-Tolerant Design (Exceptions & Error Handling)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. High-order reduction and separation of concerns (Reduce & Divide All)

[![High-Order Reduce and Separation of Concerns (Reduce & Divide All) · Classroom Blackboard Demonstration (00:09:45)](</attachments/cs61a-3ad6b4906780dcce4d7fcecd.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=585)
*⏱ Timestamp: 00:09:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=585)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“It takes a function, a sequence, and an initial value, and combines the elements of the sequence pairwise using the function, which takes two arguments, starting with the initial value. For example, if we reduce using multiplication 2, 4, and 8, starting with 1, that's the equivalent of multiplying ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. High-order reduction and separation of concerns (Reduce & Divide All)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### universal reduction function  `reduce`

Binary operation function  `f`  Applied pairwise to each element in the sequence, cumulatively collapsed into a single scalar:

```python
def reduce(f, s, initial):
    """纯函数式归约实现。"""
    for x in s:
        initial = f(initial, x)
    return initial

# 计算 2 * 4 * 8 = 64
reduce(lambda acc, x: acc * x, [2, 4, 8], 1)
```

[![Calculate 2 \* 4 \* 8 = 64 · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-f3ed1704d317d70555febfba.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We get the first and the rest of s, and we return the result of calling reduce on f the rest of s, and then updating initial to be f of initial and the first value. That passes our doc tests as well. Now, how do we use reduce? Well, for instance, let's say we want to write a function divideAll, whic...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. High-order reduction and separation of concerns (Reduce & Divide All)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Combined with exception isolation responsibilities

```python
def divide_all(n, ds):
    """将分子 n 依次除以列表 ds 中的所有分母。"""
    try:
        return reduce(lambda a, b: a / b, ds, n)
    except ZeroDivisionError:
        return float('inf')
```

> **architectural philosophy**: 
> `reduce`  Focus on traversal and union, and know nothing about division-by-zero errors; `divide_all`  Focus on mathematical division and boundary defense, the two responsibilities are completely orthogonal.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. High-order reduction and separation of concerns (Reduce & Divide All)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Computer language level and abstraction level

[![Computer language level and abstraction level · Classroom blackboard demonstration (00:15:15)](</attachments/cs61a-d4c59031a7f43c33b9a74070.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=915)
*⏱ Timestamp: 00:15:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=915)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:15:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And executes that code in order to create the behavior described by the program. And there are many different programming languages that have been invented over time. And so far in this course, we've talked about Python a great deal and Scheme a little bit. I taught you about Scheme for two reasons....”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Computer language level and abstraction level", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Computer language level and abstraction level · Classroom blackboard demonstration (00:18:15)](</attachments/cs61a-8a1c8ab911886e4a81ff3366.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1095)
*⏱ Timestamp: 00:18:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1095)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And many modern languages do a mixture of both of these, compiling parts just in time in order to be executed as if they were being interpreted interactively. But those details you can worry about in a later course. The important part is to know that high-level languages provide means of abstraction...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Computer language level and abstraction level", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


1. **Machine Language**: The hardware CPU directly decodes and executes binary instructions and directly manipulates registers and physical memory addresses, lacking any high-level abstraction mechanism.
2. **High-Level Language**: Such as Python and Scheme, which provide variable naming, function abstraction, object encapsulation and automatic garbage collection.
3. **Interpreter vs Compiler**: 
   - **interpreter**: Read source code expressions one by one and calculate their effects instantly;
   - **compiler**: Uniformly translate high-level source code into machine code or low-level bytecode (such as Python Bytecode) before running.

[![Computer language level and abstraction level · Classroom blackboard demonstration (00:22:15)](</attachments/cs61a-3857841a8261b02b8815fc40.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1335)
*⏱ Timestamp: 00:22:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1335)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:22:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which was designed for generating static web pages that you see on Wikipedia. It has built-in elements for formatting text, linking one page to another, and stitching together multiple pages into one, so that a large page can be broken out into modular components. It's a programming language, perhap...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Computer language level and abstraction level", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Syntax vs Semantics

- **Grammar**: the structural grammar ("form") of legal language sentence patterns;
- **Semantics**: The computational behavior ("intension") of a syntactic component when it is evaluated.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Computer Language Level and Abstraction Level" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Syntax parsing: text to expression tree (Parsing)

The essence of parsing is to convert an unstructured flat character stream into a hierarchically structured **expression syntax tree**.

[![Syntax parsing: text to expression tree (Parsing) · Classroom blackboard demonstration (00:24:45)](</attachments/cs61a-ffb36a49741795be4e0cb928.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1485)
*⏱ Timestamp: 00:24:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1485)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But the way it's typed out is with a lot of parentheses in a row. It's just text. And parsing is the process of converting that text into an expression tree so that the code can be evaluated according to the rules of the language. Since a scheme program just looks like a scheme list with parentheses...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Syntax parsing: text to expression tree (Parsing)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1. Expression tree carrier: Python  `Pair`  class

[![The carrier of the expression tree: Python Pair class · Classroom blackboard demonstration (00:26:45)](</attachments/cs61a-da0cc34769c97ef65301d2e0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1605)
*⏱ Timestamp: 00:26:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1605)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So the pair class is really simple. It just has a first and rest attribute. But what's interesting about the pair class is that when you create a nested pair, pair one, pair two nil, like a linked list, and you print it out, you see how Scheme would write it. So if I write one, two, three, I get an ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Syntax parsing: text to expression tree (Parsing)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


In Python, we use a custom  `Pair`  Class directly simulates the underlying structure of Scheme  `cons`  Unit:

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

### 2. Lexical Analysis / Tokenization

[![Lexical Analysis / Tokenization · Classroom Blackboard Demonstration (00:29:15)](</attachments/cs61a-9fb27430226505f35a76eb15.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1755)
*⏱ Timestamp: 00:29:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:29:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1755)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:29:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“To this structure is called parsing. So this thing is a scheme list with the first and a rest, and that's exactly the structure we're building. Parsing actually has two parts. It takes text, it returns expressions, but it does so by first performing lexical analysis in order to get a sequence of tok...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Syntax parsing: text to expression tree (Parsing)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Split the input line into atomic tokens, strip off excess spaces, and identify parentheses and numerical literals:
```
"(+ 23 (* 4 5))" ──► ['(', '+', 23, '(', '*', 4, 5, ')', ')']
```

### 3. Syntactic Analysis / Recursive Descent

[![Syntactic Analysis / Recursive Descent · Classroom Blackboard Demonstration (00:31:45)](</attachments/cs61a-c80c5a4f682688bbed06197f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1905)
*⏱ Timestamp: 00:31:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:31:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=1905)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:31:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And it has a recursive call, which is that whenever there's a sub-expression, it calls SchemeRead on it to combine it into an expression, which then can be placed into a larger expression. So calling SchemeRead on this sequence of tokens starts at the beginning and isn't going to return until it fin...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Syntax parsing: text to expression tree (Parsing)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


via recursive descent function  `scheme_read`  Consumption Token flow:
- **Encountered atoms (symbols/numbers)**: Return directly as a leaf node;
- **Left parenthesis encountered  `(`**: Recursively call itself to parse each internal subexpression until the matching right bracket is hit.  `)`, assembled as nested  `Pair`.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Syntax Parsing: Text to Expression Tree (Parsing)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Calculator Interpreter Core Architecture (The Calculator Language)

Calculator is an arithmetic subset of Scheme, including numerical atoms and  `+`, `-`, `*`, `/`  Four call combinations.

[![Calculator Interpreter Core Architecture (The Calculator Language) · Classroom Blackboard Demonstration (00:33:45)](</attachments/cs61a-8b8f198bd9faeb6c28fc8c64.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2025)
*⏱ Timestamp: 00:33:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:33:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2025)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:33:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which includes some examples and has only two functions. A function to evaluate an expression and a function to apply a particular procedure to some arguments. I can apply plus to one, two, three to get six and I could evaluate an expression such as plus two times four, six to get 26. The calculator...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Calculator Interpreter Core Architecture (The Calculator Language)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Calculator Interpreter Core Architecture (The Calculator Language) · Classroom Blackboard Demonstration (00:36:15)](</attachments/cs61a-8fc4fc01fedc6bc15f09a791.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2175)
*⏱ Timestamp: 00:36:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2175)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:36:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Evaluates an expression in the language represented as a scheme list. It computes the value of an expression. And the value of an expression in the calculator language is always a number. The eval function itself is a generic function that dispatches on the type of the expression, whether it's a pri...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Calculator Interpreter Core Architecture (The Calculator Language)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Core engine: `calc_eval`  (expression evaluation)

[![Core engine: calc\_eval (expression evaluation) · Classroom blackboard demonstration (00:38:15)](</attachments/cs61a-90d4c5e0440be8d1f6eb77b8.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2295)
*⏱ Timestamp: 00:38:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2295)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:38:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And this is Expedat First is the operator that gets combined with its arguments using some other function, calc apply, which we'll look at on the next slide. So what are the important parts here? We have a recursive call, returns a number for each operand. So an operand sub-expression could be some ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Calculator Interpreter Core Architecture (The Calculator Language)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

### Computing core: `calc_apply`  (process application)

[![Operation core: calc\_apply (process application) · Classroom blackboard demonstration (00:40:45)](</attachments/cs61a-b579b544f6a24f88ed84203d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2445)
*⏱ Timestamp: 00:40:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:40:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2445)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:40:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Let's look at the whole thing. And at the same time, we can run some examples. So, if the operator is not a string, then we should complain. Type error 2 is not a symbol. If the operator is plus, then we reduce starting with 0 and adding in everything else. If it's minus, then if there are no argume...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Calculator Interpreter Core Architecture (The Calculator Language)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Calculator Interpreter Core Architecture (The Calculator Language)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Interactive REPL and global error protection (Read-Eval-Print Loop)

[![Interactive REPL and global error protection (Read-Eval-Print Loop) · Classroom blackboard demonstration (00:43:15)](</attachments/cs61a-a0321008c10f39bc16a35985.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2595)
*⏱ Timestamp: 00:43:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:43:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2595)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:43:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“into an expression or statement. Evaluate that expression. If any errors occur, report those errors. Otherwise, print the value of the expression and repeat printing another prompt. So that redevelop print loop is a way that a person can interact with a programming language by typing expressions int...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Interactive REPL and global error protection (Read-Eval-Print Loop)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Interactive REPL and global error protection (Read-Eval-Print Loop) · Classroom blackboard demonstration (00:45:45)](</attachments/cs61a-e9f0e4879e1a87c4fa1446ea.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2745)
*⏱ Timestamp: 00:45:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P28 00:45:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28&t=2745)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:45:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Specifically for this operator that I've chosen, I need at least one argument. And if you look at the source code, these are raised all over the place. So here's a raising of the type error, here's another type error, but some of these are even in different files. And some of them will actually be r...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Interactive REPL and global error protection (Read-Eval-Print Loop)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Lexical Tokenize (Tokenize), Abstract Syntax Tree Construction and calc\_eval / calc\_apply Mutual Recursion", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


The ultimate interactive entrance to the interpreter is  **REPL** (read-evaluate-print loop):

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

> **Robust design**:
Lexical errors (such as illegal characters), syntax errors (such as mismatched brackets), evaluation errors (such as unknown symbols), and operation errors (such as dividing by zero) are automatically detected at all levels.  `raise`, but in the outermost layer REPL is uniformly  `except`  capture. The interpreter prints the next prompt immediately after printing the friendly error message and waits for the user to re-enter.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "7. Interactive REPL and Global Error Protection (Read-Eval-Print Loop)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 8. Chapter summary and core test points

1. **Interpreter Classic Paradigm**: Remember  `Read -> Eval -> Apply -> Print`  Four-in-one closed loop.
2. **tree mutual recursion**: `calc_eval`  Recursive evaluation operands, `calc_apply`  Combining the calculation results and alternating recursion between the two constitute the soul of the programming language runtime.
3. **Layered error defense**: Each sub-module performs its own duties and throws accurate exceptions, and the outermost layer of REPL captures them to ensure that the interactive session never crashes.

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "8. Chapter Summary and Core Test Points" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.



---

## Berkeley Midterm/Final classic high-frequency exam questions in-depth practice

### Practical exam questions: Environment topology and microstate tracking (WWPD & Environment Diagrams)
Consider the following microscopic execution of Python code in an interactive environment:

```python
# 经典作用域与高阶函数综合考题
x = 10

def outer(x):
    y = x + 2
    def inner(y):
        return x + y
    return inner

f = outer(5)
result = f(3)
```

#### Complete problem-solving thinking model and multi-frame environment map derivation:
1. **Global Frame initialization**: 
   - global variables  `x`  Bind to integer object  `10`; 
   - global function  `outer`  Binds to the newly created function object whose embedded  `parent = Global`; 
2. **execute  `f = outer(5)`**: 
   - create a local frame  $f_1$, mark  `f1: outer [parent=Global]`; 
   - formal parameters  `x`  Bind to actual parameters  `5`; 
   - local variables  `y`  bind to  `5 + 2 = 7`; 
   - in  $f_1$  internal execution  `def inner(y):`, create a function object  `inner`, its embedded  **`parent = f1`**; 
   - Return function object  `inner`, global variables  `f`  Bind to this object;
3. **execute  `result = f(3)`**: 
   - call function  `f` (i.e.  `inner`), open up a local frame  $f_2$; 
   - **core scoring points**:frame  $f_2$  Who does parent point to?
   - **iron law**: function  `inner`  is in frame  $f_1$  is defined internally, so  $f_2$  of  **`parent = f1`**!
   - formal parameters  `y`  Bind to actual parameters  `3`; 
   - executor  `return x + y`: 
     - in current frame  $f_2$  Find  `y`: Hit local variable  `y = 3`; 
     - in current frame  $f_2$  Find  `x`: miss, trace back along parent  **$f_1$  frame**  Find it!
     - in  $f_1$  hit in frame  `x = 5` (Global  `x = 10`  Partially obscured! );
     - Calculate  `5 + 3 = 8`, as the return value;
4. **Final output conclusion**: 
   - global variables  `result = 8`.

---

## Knowledge Matrix of the core concepts of this lecture

| core knowledge dimension | Formal definition and mechanism | Typical code examples | Core Engineering and Algorithm Value | Common pitfalls |
| :--- | :--- | :--- | :--- | :--- |
| **Basic evaluation semantics** | The expression is evaluated to obtain a value, and the execution of the statement changes the internal state. | `x = 2 + 3` | Build a discrete-time state snapshot mental model | Mistaking the assignment equal sign as a dynamic constraint on an algebraic equation |
| **Environment frame topology** | The environment is an ordered chain of frames | `Global -> f1 -> f2` | Implement safe isolation of lexical scope and variables | Confusing the caller stack frame with the parent environment pointer at the definition point |
| **abstract barrier** | Isolate implementation details and calling logic through functional interfaces | `def square(x): ...` | Reduce cognitive load on large-scale systems | Destroying interfaces directly relies on underlying private data structures |
| **control flow decisions** | Conditional branch short-circuit evaluation and loop iteration progression | `if cond: ... while: ...` | Give programs non-linear decision-making and large-scale data processing capabilities | Missing the loop progression variable causes an infinite loop |
| **higher level abilities** | Functions as first-class citizens (parameter passing, return, assignment) | `make_adder(3)` | Implement factory pattern, closure persistent state and currying | Closure late binding throws loop variable capture error |

---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Lecture 29 Scheme Lists](/en/notes/cs61a/lecture-27) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 31 Interpreters →](/en/notes/cs61a/lecture-29) | [🎬Watch this lecture on Bilibili (P28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=28) |
