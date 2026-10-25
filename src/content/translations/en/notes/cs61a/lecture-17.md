---
kind: notes
source: cs61a/lecture-17
title: Lecture 17 · Generators, yield, and Recursion
description: "CS61A Lecture 17: Generators (generators, yield mechanism and
  recursive stream generation)"
sourceHash: c9657dbdb071a32de1ca717923315816d97888ebcd37dd7a4663584ecbca3ba5
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 17:13 ｜ **Classroom screenshots**: 16 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17)  
> **Quick navigation**: [← Previous Lecture (P16 Lecture 16 Iterators)](/en/notes/cs61a/lecture-16) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next Lecture (P18 Lecture 18 Objects) →](/en/notes/cs61a/lecture-18)

---

## Table of Contents
1. [Introduction: From ordinary functions to generator functions](/en/notes/cs61a/lecture-17#1-introduction-from-ordinary-functions-to-generator-functions)
2. [`yield`  The underlying mental model of: freeze, suspend and resume](/en/notes/cs61a/lecture-17#2-yield--the-underlying-mental-model-of-freeze-suspend-and-resume)
3. [Delegate generation syntax: `yield from`  minimalist philosophy](/en/notes/cs61a/lecture-17#3-delegate-generation-syntax-yield-from--minimalist-philosophy)
4. [Recursive generator in action: countdown, string prefix and substring](/en/notes/cs61a/lecture-17#4-practical-use-of-recursive-generators-countdown-string-prefix-and-substring)
5. [Revisiting integer splitting: from counting to full solution listing](/en/notes/cs61a/lecture-17#5-revisit-integer-splitting-from-counting-to-full-solution-listing)
6. [Head-to-head confrontation between traditional list accumulation method vs. elegant generator method](/en/notes/cs61a/lecture-17#6-head-to-head-confrontation-between-traditional-list-accumulation-method-vs-elegant-generator-method)
7. [Extremely fast response in a million-level solution space: dimensionality reduction attack by lazy evaluation](/en/notes/cs61a/lecture-17#7-extremely-fast-response-to-a-million-level-solution-space-dimensionality-reduction-attack-by-lazy-evaluation)
8. [Key points and thinking questions of this lecture](/en/notes/cs61a/lecture-17#8-core-points-and-thinking-questions-of-this-lecture)

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "Table of Contents" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 1. Introduction: From ordinary functions to generator functions

In Python, most functions follow the life cycle of "single execution, single return": execution starts from the first line, and once encountered  `return`  statement, the function frame is destroyed immediately, and control and return value are returned to the caller.

> **Generator Function**: Contained in the function body  **`yield`**  Special functions for keywords.  
> Call generator function **The function body will not be executed immediately**, instead returning a **Generator Object**. The generator itself is an iterator.

[![Introduction: From ordinary functions to generator functions · Classroom blackboard demonstration (00:00:31)](</attachments/cs61a-a352b723eba18363326481b5.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=31)
*⏱ Timestamp: 00:00:31 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:00:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=31)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:31)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“61A, lecture number 17. Announcements. Project 2 is due Tuesday, but you get an early submission bonus point for finishing Monday. We will have office hours on Monday and Tuesday to help you out. Homework 4 is pretty short. It's about mutation in trees, which were the big topics from last week, and ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: from ordinary functions to generator functions", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def plus_minus(x):
    yield x
    yield -x

t = plus_minus(3)  # t 是一个生成器对象！
next(t)            # 3
next(t)            # -3
next(t)            # 抛出 StopIteration 异常
```

[![Introduction: From ordinary functions to generator functions · Classroom blackboard demonstration (00:01:31)](</attachments/cs61a-8c3861deafd80c58f75aa39e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=91)
*⏱ Timestamp: 00:01:31 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:01:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=91)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:31)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“This generator is an iterator, meaning I can iterate through the values yielded by plus minus. So if I call next on T, I get three, but I can call next T again to get negative three. So you can see that both of these yield statements are being executed. T itself is a generator object, and its job is...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: from ordinary functions to generator functions", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Introduction: From Ordinary Functions to Generator Functions" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. `yield`  The underlying mental model of: freeze, suspend and resume

generator of consecutive even numbers  `evens(start, end)`  Take an example to observe its inner workings:

```python
def evens(start, end):
    even = start + (0 if start % 2 == 0 else 1)
    while even < end:
        yield even
        even += 2
```

[![The underlying mental model of yield: freeze, suspend and resume · Classroom blackboard demonstration (00:02:30)](</attachments/cs61a-c116f7c10d80f7a908b29a4d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=150)
*⏱ Timestamp: 00:02:30 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:02:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=150)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:30)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Here's another example. Let's say I want to return iterators that go over even numbers only. I give integer start and end points, but I want to make sure that I actually start at the even number that's greater than or equal to start. So the next even number is start plus either zero or one, dependin...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2.  `yield` "The underlying mental model: freeze, suspend and resume", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Detailed explanation of execution process
1. **Create generator**: `t = evens(2, 10)`. At this time, the interpreter only packages function references and parameters. **Line 1 of the function body has not been executed yet**!
2. **First time activation (`next(t)`)**: Enter the function body and calculate  `even = 2`. enter  `while`  loop, execute  `yield 2`.
   - **Produces a value to the caller  `2`**.
   - **Freeze & Pause**: The interpreter completely retains the environment state of the current function frame (local variables  `even=2`, instruction pointer PC, loop stack).
3. **Activate again (`next(t)`)**: Directly suspended last time  `yield`  after statement **Resume execution**!
   - execute  `even += 2` (changes to 4).
   - re-enter  `while`  Head judgment, hit next time  `yield 4`, freeze again!
4. **natural termination**: When  `even < end`  When exiting the loop, the function will naturally reach the end and automatically trigger  `StopIteration`.

[![Detailed explanation of the execution process · Classroom blackboard demonstration (00:03:32)](</attachments/cs61a-3b93411147567339e3ce1d63.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=212)
*⏱ Timestamp: 00:03:32 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:03:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=212)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:32)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“When I create a generator by calling a generator function, I haven't even begun executing the body of this function yet. It's not until next is called that the body begins to be executed, and it keeps executing until a yield statement is reached, at which point that number is yielded as the next ele...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2.  `yield` "The underlying mental model: freeze, suspend and resume", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```
调用方 (Caller)                   生成器函数 (Generator Frame)
────────────────                 ───────────────────────────
t = evens(2, 10) ──────────────► (创建生成器对象，代码未执行)
next(t)          ──────────────► 执行至 yield 2 (产出 2 并挂起)
                                 [保存: even=2, 循环现场]
next(t)          ──────────────► 从 yield 处恢复 -> even+=2 -> yield 4
                                 [保存: even=4, 循环现场]
next(t)          ──────────────► ...
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "2.  `yield`  In the "Underlying Mental Model: Freeze, Suspend and Resume" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Delegate generation syntax: `yield from`  minimalist philosophy

Prior to Python 3.3, to step through the contents of another iterator inside a generator, you had to write a boilerplate loop:
```python
for x in a:
    yield x
```
In order to eliminate meaningless loop variables, Python introduced  **`yield from`**  Syntax:

[![Delegated generation syntax: minimalist philosophy of yield from · Classroom blackboard demonstration (00:04:31)](</attachments/cs61a-d8a75eb7a748d61b1e97de9c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=271)
*⏱ Timestamp: 00:04:31 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:04:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=271)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:31)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And that computation will be executed lazily. So when somebody asks for the next element, then you continue until you reach the next yield. But if nobody asks for all of the elements, then you don't have to continue computing everything. You just pause there until the next value is needed. Generator...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Delegate generation syntax: `yield from` "Minimalist philosophy", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def a_then_b(a, b):
    yield from a
    yield from b
```

[![Delegated generation syntax: minimalist philosophy of yield from · Classroom blackboard demonstration (00:05:33)](</attachments/cs61a-0780e4acaa0f329198d8efcf.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=333)
*⏱ Timestamp: 00:05:33 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:05:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=333)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:33)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And returns all the elements in the first, followed by all the elements in the second. One way I could write this is to say, for x and a, yield x, and then for x and b, yield x. But there's a simpler way. I could just write yield from a, then yield from b. These are completely equivalent. So you cou...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Delegate generation syntax: `yield from` "Minimalist philosophy", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


`yield from <iterable>`  Give full control over the build **Delegate**  Give the sub-iterator until the sub-iterator is exhausted before continuing to execute subsequent statements.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "3. Delegate generation syntax: `yield from`  In the "Minimalist Philosophy" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Practical use of recursive generators: countdown, string prefix and substring

`yield from`  When combined with recursion, it can result in incredibly expressive stream processing code.

### 4.1 Countdown Generator (`countdown`)
```python
def countdown(k):
    if k > 0:
        yield k
        yield from countdown(k - 1)
    else:
        yield "Blastoff!"
```

[![Countdown generator (countdown) · Classroom blackboard demonstration (00:06:36)](</attachments/cs61a-ffe11c80abfcb243bb982337.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=396)
*⏱ Timestamp: 00:06:36 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:06:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=396)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:36)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If I wrote this wrong and just wrote yield count down K minus one, the second element in the iterator that I got back would actually just be another iterator. So counting down from three would start out well, but the next thing I'd get back is a generator object, which is not what I expected. I expe...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Practical practice of recursive generators: countdown, string prefix and substring", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- Produce the current number first  `k`; 
- pass again  `yield from countdown(k - 1)`  The countdown stream of the delegate child displays the remaining numbers!

---

### 4.2 String prefix and all substring generation (`prefixes` & `substrings`)
How to lazily generate all prefixes of a string? For example  `"both"`  The prefix sequence is  `["b", "bo", "bot", "both"]`: 

```python
def prefixes(s):
    if s:
        yield from prefixes(s[:-1])
        yield s
```

[![String prefix and all substring generation (prefixes & substrings) · Classroom blackboard demonstration (00:07:42)](</attachments/cs61a-a5a8fa5ca3119ce609799095.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=462)
*⏱ Timestamp: 00:07:42 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:07:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=462)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:42)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Three. Print K. And it gives me the whole countdown sequence and something exciting at the end. Let's finish with a slightly more involved example. I can yield all the prefixes of S. Or I'm going to assume S is a string, but it really could be any iterable. If it's non-empty, then I'm going to yield...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Practical practice of recursive generators: countdown, string prefix and substring", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


in  `prefixes`  On the basis of, generate all consecutive substrings of the string (`substrings`): 
```python
def substrings(s):
    if s:
        yield from prefixes(s)
        yield from substrings(s[1:])
```

[![String prefix and all substring generation (prefixes & substrings) · Classroom blackboard demonstration (00:08:15)](</attachments/cs61a-4c52d7cc346157c6175d70a0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=495)
*⏱ Timestamp: 00:08:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=495)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And then I'll yield s itself. So the prefixes of both is a generator object. If I list them out, then I get b, bo, bot, and both. And I get them in this order because I yield from prefixes before I yield s itself. Once I can generate prefixes, I can also generate substrings. If s is not empty, then ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Practical practice of recursive generators: countdown, string prefix and substring", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


call  `list(substrings("tops"))`  Get it now  `["t", "to", "top", "tops", "o", "op", "ops", "p", "ps", "s"]`, tree-shaped divide and conquer and generated flow are perfectly integrated!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Practical Combat of Recursive Generators: Countdown, String Prefix and Substring" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Revisit integer splitting: from counting to full solution listing

In Lecture 10, we successfully calculated the total number of splits using a two-way recursion  `count_partitions(n, m)`. Now we escalate the problem: **It is not only necessary to calculate the total number of solutions, but also to truly list each splitting solution in the form of a formula string.**!

For example  $n=6, m=4$  When, output: 
`"2 + 4"`, `"1 + 1 + 4"`, `"3 + 3"`, `"1 + 2 + 3"`, $\dots$

[![Revisiting integer splitting: from counting to full solution list · Classroom blackboard demonstration (00:09:42)](</attachments/cs61a-c03201455bae2f2e01843c33.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=582)
*⏱ Timestamp: 00:09:42 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:09:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=582)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:42)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Then I get all of these different options. I can add two and four together, or three and three together, or one, two and three, but I don't use any fives because I said the maximum size of a part was four, and all of these sum up to six. Once upon a time, we counted the partitions of n using parts u...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Revisiting integer splitting: from counting to full solution listing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "5. Revisiting Integer Splitting: From Counting to Full Solution Listing", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method

### 6.1 Traditional list accumulation method (heavy and error-prone)
If we use a list as the return value, we need to build sublists, list comprehensions, and  `sum(..., [])`  Splicing:

[![Traditional list accumulation method (tedious and error-prone) · Classroom blackboard demonstration (00:11:45)](</attachments/cs61a-656fc833ba8856027a051609.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=705)
*⏱ Timestamp: 00:11:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=705)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Unless it's the case that I found an exact match, in which case I want to have a one-element partition of n. With m means that my partition actually includes m, so I need to make sure that the result actually has the right format. This is a list of lists. I go through every element in that list, and...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Traditional list accumulation method (tedious and error-prone) · Classroom blackboard demonstration (00:12:47)](</attachments/cs61a-cc82a3e9f9ad52ec274992b7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=767)
*⏱ Timestamp: 00:12:47 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:12:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=767)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:47)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Instead, I've used a list containing a list with one element or an empty list. And here I've built a list comprehension where I had the old list and I put in another list. It's a lot of list manipulation. And what if what I really wanted was a list of strings where instead of 2,4, it would say 2 plu...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
# 传统列表实现 (代码繁复、内存冗余)
def list_partitions(n, m):
    if n < 0 or m == 0:
        return []
    result = []
    if n == m:
        result.append(str(m))
    with_m = [p + " + " + str(m) for p in list_partitions(n - m, m)]
    without_m = list_partitions(n, m - 1)
    return result + with_m + without_m
```

---

### 6.2 Elegant Generator Method (Minimalist Mental Flow)
After switching to generator thinking, **Programmers only need to focus on "which element is produced under the current conditions", completely eliminating the trouble of list maintenance and merging.**: 

[![Elegant Generator Method (Minimalist Flow) · Classroom Blackboard Demonstration (00:13:53)](</attachments/cs61a-bf1f01a84820f96c6f015ec2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=833)
*⏱ Timestamp: 00:13:53 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:13:53)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=833)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:13:53)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But I think it's simpler using yield. Let me show you. If I want to yield all of the partitions and get exactly the same result, instead of building up a bunch of small lists, I just yield their elements. If n equals m, I yield not a list containing strm, but just strm itself. I just think about the...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def partitions(n, m):
    """惰性生成正整数 n 使用不超过 m 的部分拆分的所有方案字符串。
    
    >>> for p in partitions(6, 4):
    ...     print(p)
    2 + 4
    1 + 1 + 4
    3 + 3
    1 + 2 + 3
    1 + 1 + 1 + 3
    2 + 2 + 2
    1 + 1 + 2 + 2
    1 + 1 + 1 + 1 + 2
    1 + 1 + 1 + 1 + 1 + 1
    """
    if n > 0 and m > 0:
        if n == m:
            yield str(m)  # 方案 1：正好独立凑齐
        for p in partitions(n - m, m):
            yield p + ' + ' + str(m)  # 方案 2：使用至少一个 m
        yield from partitions(n, m - 1) # 方案 3：完全不使用 m
```

[![Elegant Generator Method (Minimalist Flow) · Classroom Blackboard Demonstration (00:14:55)](</attachments/cs61a-27a8246a7ac0101e473a120f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=895)
*⏱ Timestamp: 00:14:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:14:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=895)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“When I'm writing a generator function, I just think about what to do with each one. No list comprehension necessary. I just want to build a longer partition. What do I want to do with all the partitions of n using parts of m minus one or smaller? Well, those are all partitions of n using parts of th...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "6. Head-to-head confrontation between traditional list accumulation method vs. elegant generator method", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Extremely fast response to a million-level solution space: dimensionality reduction attack by lazy evaluation

When the input scale expands to  $n=60, m=50$  When, the total number of splitting plans is up to  **966,467 (nearly one million combinations)**!

[![Extremely fast response in a million-level solution space: dimensionality reduction attack by lazy evaluation · Classroom blackboard demonstration (00:15:52)](</attachments/cs61a-7e3871ff2302e88ac9027243.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=952)
*⏱ Timestamp: 00:15:52 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:15:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=952)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:15:52)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Keep all the partitions of n using part sub to size m minus one. And this is the result that I get. I think this version is not only more elegant and easy to read. Once you get your head around what yield means, which is to contribute one element and what yield from means, which is to contribute a w...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Extremely fast response to a million-level solution space: dimensionality reduction attack by lazy evaluation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **traditional list method**: All nearly a million strings must be generated and stored in a huge Python list. The entire program stalled for a long time, consuming hundreds of megabytes of memory.
- **generator method**: due to adopting **Lazy on demand value**, if the upper layer only needs the first 10 example solutions:
```python
p = partitions(60, 50)
for _ in range(10):
    print(next(p))
```

[![Extremely fast response in a million-level solution space: Dimensionality reduction of lazy evaluation · Classroom blackboard demonstration (00:16:34)](</attachments/cs61a-5c2ce87c9dffa41a5f460f32.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=994)
*⏱ Timestamp: 00:16:34 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:16:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=994)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:34)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“That would happen really fast. That's only true of the version of this implementation that uses yield. The previous version, which had lots of different list manipulations, was forced to build the whole list of 966,000 options before I ever had a chance to look at the first 10. So if you're ever wri...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Extremely fast response to a million-level solution space: dimensionality reduction attack by lazy evaluation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "yield coroutine state freezing and awakening, recursive generator (yield from)", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


**Response time is 0.001 seconds**! As soon as the first 10 solutions are calculated, the generator hangs, leaving 966,457 possibilities **No computation occurs at all**! This is the qualitative leap that generators bring to massive search algorithms.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "7. Extremely fast response to a million-level solution space: Dimensionality reduction attack by lazy evaluation", the underlying operations of the computer rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 8. Core points and thinking questions of this lecture

### Refining key rules
1. **Generators are syntactic sugar for iterators**: Contains  `yield`  The function automatically generates a state machine and freezes it after a single call.
2. **`yield from`  Eliminate boilerplate loops**: In tree traversal and recursive decomposition, `yield from`  It is the ultimate tool for proxy sub-generators.
3. **Massive search preferred generator**: When the solution space is extremely large and users often only need partial solutions, the generator provides constant startup latency and minimal memory usage.

---

### After-class self-assessment exercises

#### Exercise 1: Generating Infinite Primes
write a generator  `primes()`, continuously generating all prime numbers in natural numbers (2, 3, 5, 7, 11, ...):
```python
def primes():
    """
    >>> p = primes()
    >>> [next(p) for _ in range(5)]
    [2, 3, 5, 7, 11]
    """
    def is_prime(x):
        return all(x % d != 0 for d in range(2, int(x**0.5) + 1))
    n = 2
    while True:
        if is_prime(n):
            yield n
        n += 1
```

#### Exercise 2: Binary Tree Inorder Traversal Generator
Hypothetical tree node  `t`  own  `left`  with  `right`  subtree. How to use  `yield from`  Concise expression for in-order traversal?
```python
def inorder(t):
    if t is not None:
        yield from inorder(t.left)
        yield t.label
        yield from inorder(t.right)
```
The generator allows complex data structure traversal to completely say goodbye to complex auxiliary stack maintenance!

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "8. Core Key Points and Questions of This Lecture" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous Lecture: Lecture 16 Iterators](/en/notes/cs61a/lecture-16) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 18 Objects →](/en/notes/cs61a/lecture-18) | [🎬Watch this lecture on Bilibili (P17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17) |
