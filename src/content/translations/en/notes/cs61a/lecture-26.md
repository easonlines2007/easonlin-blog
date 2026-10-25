---
kind: notes
source: cs61a/lecture-26
title: "Lecture 26 · Scheme: Foundations of a Functional Language"
description: "CS61A Lecture 26: Basics of Functional Language Scheme (Scheme)"
sourceHash: ca24b0cea85fdbb032fb41dc72e2f20f71825e251ca308b766a33ffe1966ec3f
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 4: Interpreters & Scheme (Interpreters & Scheme)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 31:14 ｜ **Classroom screenshots**: 17 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26)  
> **Quick navigation**: [← Previous Lecture (P25 Lecture 25 Data Examples)](/en/notes/cs61a/lecture-25) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next Lecture (P27 Lecture 29 Scheme Lists) →](/en/notes/cs61a/lecture-27)

---

## 1. Core mental model and architecture diagram

Starting from this lecture, the course officially enters the fourth core milestone——**Functional Programming and Interpreter Construction (Interpreters & Scheme)**. By learning the Scheme language, we will see how the core concepts of computing can be freely transferred between different languages, and finally implement a complete Scheme interpreter using Python in Project 4.

```
                    ┌──────────────────────────────────────────────┐
                    │            Scheme 表达式分类体系             │
                    └──────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┴──────────────────────┐
                    ▼                                             ▼
     ┌─────────────────────────────┐               ┌─────────────────────────────┐
     │   基本表达式 (Primitives)   │               │     组合式 (Combinations)   │
     ├─────────────────────────────┤               ├─────────────────────────────┤
     │ • 自求值: 2, 3.14, #t, #f   │               │ 形式: (operator operand...) │
     │ • 符号 (Symbols): +, abs    │               │ 括号前置，空格无关         │
     └─────────────────────────────┘               └──────────────┬──────────────┘
                                                                  │
                                   ┌──────────────────────────────┴──────────────────────────────┐
                                   ▼                                                             ▼
                    ┌─────────────────────────────┐                               ┌─────────────────────────────┐
                    │    调用表达式 (Call Expr)   │                               │     特殊形式 (Special Form) │
                    ├─────────────────────────────┤                               ├─────────────────────────────┤
                    │ • 先求值操作符与全部操作数  │                               │ • 特殊求值规则 (不全求值)   │
                    │ • 应用过程于参数            │                               │ • if, and, or, define       │
                    │ • 示例: (+ 1 2) -> 3        │                               │ • cond, begin, let, lambda  │
                    └─────────────────────────────┘                               └─────────────────────────────┘
```

### The legendary aesthetics of Lisp and Scheme

[![The legendary aesthetics of Lisp and Scheme · Classroom blackboard demonstration (00:00:55)](</attachments/cs61a-3f9e935696fd7966714cc8b4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We understand it for its history, its beauty, and also to see which ideas transfer from one language to another naturally, and we'll find that that's many of them. Scheme is a dialect of a language called Lisp. And Lisp is one of the two oldest programming languages that's still used today. And it's...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Core mental model and architectural diagram", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


> *"Lisp is over half a century old, and it still has a timeless air about it. Elegant weapons for a more civilized age."* —— XKCD
- **Historical origins**: Lisp was founded in 1958 by Turing Award winner John McCarthy and is the oldest active language in the history of computer science besides Fortran.
- **Philosophical cornerstone**: Code is data (Homoiconicity), the core of the grammar is extremely pure, and the full set of core grammar can be mastered in just one day, but it can build an extremely sophisticated and complex abstract system.

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


## 2. Scheme syntax and prefix combinations (Expressions & Combinations)

All the components of a Scheme program are **expression**: 

[![Scheme Grammar and Prefix Combinations (Expressions & Combinations) · Classroom Blackboard Demonstration (00:02:15)](</attachments/cs61a-089b6a574dec64171e169358.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=135)
*⏱ Timestamp: 00:02:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=135)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Throughout this course, or much more complex than that. Here are the fundamentals. Scheme programs consist of expressions, which can be primitive, such as 2, or 3.3, or true, or plus is a primitive expression, or quotient, which does division, et cetera. And there are combinations. So a combination ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Scheme syntax and prefix combinations (Expressions & Combinations)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Scheme Grammar and Prefix Combinations (Expressions & Combinations) · Classroom Blackboard Demonstration (00:03:45)](</attachments/cs61a-a463b9c6d4d750f9cadb5837.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=225)
*⏱ Timestamp: 00:03:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=225)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“You can nest call expressions. I could say, what's the quotient of the result of adding together 8 and 7? Well, that's 15 divided by 5 is 3. And if I want to, I can spread these call expressions across multiple lines in any way that I see fit. Here's a typical way to use indentation just to make the...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Scheme syntax and prefix combinations (Expressions & Combinations)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Expression evaluation rules

1. **Basic self-evaluating expressions (Self-evaluating)**:numeric(`2`, `3.14`), Boolean value (`#t`  means True, `#f`  means False).
2. **Symbols**: Finds its bound value in the environment (e.g.  `+`  bound to the underlying addition process).
3. **Call Expressions**: 
   - Syntax: `(<operator> <operand_0> <operand_1> ... <operand_k>)`
   - Evaluation: First recursively evaluate the operator and all operands, and then apply the resulting procedure to the argument list.

[![Expression evaluation rules · Classroom blackboard demonstration (00:05:45)](</attachments/cs61a-1fa0e7dfe2f8b7b1897d804c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=345)
*⏱ Timestamp: 00:05:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=345)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Let's do some more demonstrations. Here's a scheme prompt. I can evaluate 2. I can evaluate the sum of 1, 2, 3, and 4. It's 10. What happens if I add together nothing at all, do you think? 0. I can multiply 1, 2, 3, and 4 to get 24, or I could multiply together nothing at all. 1. OK, so I can multip...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Scheme syntax and prefix combinations (Expressions & Combinations)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Interactive REPL demonstration and variable parameter process

```scheme
;; 前缀算术表达
(+ 1 2 3 4)     ; 10 (加法过程支持任意多个参数)
(+)             ; 0  (加法单位元)
(*)             ; 1  (乘法单位元)
(* 2 2 2 3 3 3) ; 216

;; 嵌套表达式 (缩进只为人类易读，解释器只关注括号闭合)
(+ (* 3 (+ (* 2 4) (+ 3 5)))
   (+ (- 10 7) 6))  ; 57
```

### Predicate naming conventions (Predicates)

[![Predicate naming convention (Predicates) · Classroom blackboard demonstration (00:07:15)](</attachments/cs61a-787ecd117a9f8247c85c9977.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=435)
*⏱ Timestamp: 00:07:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=435)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Plus is not a number. I can ask whether some number is 0. 2 is not 0, which is why we get false. But 0 is 0, which is why we get true. So if I actually subtracted 2 from 2, I would end up with 0, which is true. And we can also evaluate whether something is an integer. 2.2 is not, but 2 is. Now, thes...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Scheme syntax and prefix combinations (Expressions & Combinations)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


In Scheme, procedures that return Boolean values are usually preceded by a question mark  `?`  Finally, this is a legal part of a symbol name:

```scheme
(number? 3)       ; #t
(zero? (- 2 2))   ; #t
(integer? 2.2)    ; #f
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Scheme Syntax and Prefix Combinations (Expressions & Combinations)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Core special forms: conditions and symbol binding (Special Forms)

Any combination that does not follow the standard rule of "evaluate the operator and all operands first" is collectively called **Special Forms**.

[![Core Special Forms: Conditional and Symbol Binding (Special Forms) · Classroom Blackboard Demonstration (00:09:15)](</attachments/cs61a-7730751cdbf1c678203e4359.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=555)
*⏱ Timestamp: 00:09:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=555)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“A special form and scheme is any combination. That's not a call expression. For instance, there's an if expression, which has a particular syntax, so it looks just like a combination again, except for it has this special keyword, if, as the first sub-expression, and then it has a predicate, a conseq...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Core Special Forms: Conditions and Symbol Binding (Special Forms)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Core Special Forms: Conditional and Symbol Binding (Special Forms) · Classroom Blackboard Demonstration (00:10:45)](</attachments/cs61a-d5a59ac3954f40c569b47d8d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=645)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=645)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So we define some symbol to be the value of some expression. In order to do that, we evaluate the expression and then bind it to the symbol. So if I define pi to be 3.14, then I can use pi the symbol in future expressions. So the symbol pi is bound to 3.14 in the global frame. Yes, Scheme uses the s...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Core Special Forms: Conditions and Symbol Binding (Special Forms)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1. `if`  conditional branch

```scheme
(if <predicate> <consequent> <alternative>)
```
- **short circuit evaluation**:Evaluate first  `<predicate>`; if true (except  `#f`  All values except **Only evaluate** `<consequent>`, never executed  `<alternative>`.

### 2. `define`  Symbol binding and procedure definition

[![define symbol binding and process definition · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-43c5fa98227ab96120f010f9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And binds the symbol abs to that procedure in the first frame of the current environment. And since we're in the global environment, that's where it gets bound. Okay, let's define some procedures ourselves. So we can define what it means to square something is multiply it by itself. And then we can ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Core Special Forms: Conditions and Symbol Binding (Special Forms)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```scheme
;; 绑定常量符号
(define pi 3.14)

;; 定义过程语法糖：(define (<name> <param1> ...) <body>)
(define (square x)
  (* x x))

(define (average x y)
  (/ (+ x y) 2))

(square 16)      ; 256
(average 3 7)    ; 5
```

### 3. Square roots in Babylon: nested definitions and lexical scope

[![Finding square roots in Babylon: nested definitions and lexical scope · Classroom blackboard demonstration (00:14:45)](</attachments/cs61a-7cdea10d2a82248d5d01e385.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=885)
*⏱ Timestamp: 00:14:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=885)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Otherwise, we need a better guess. And how do we get a better guess? Well, we'll update something that's even more useful than what we had before using the Babylonian method that was invented many thousands of years ago, where you can have a better update to the square root of x by averaging your cu...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Core Special Forms: Conditions and Symbol Binding (Special Forms)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Scheme fully supports Lexical Scope, and internal auxiliary procedures can be freely closed to capture external parameters:

```scheme
(define (sqrt x)
  (define (update guess)
    (if (= (square guess) x)
        guess
        (update (average guess (/ x guess)))))
  (update 1))

(sqrt 256)  ; 16
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Core Special Forms: Conditions and Symbol Binding (Special Forms)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Lambda anonymous process and first-class citizens (Lambda Expressions)

[![Lambda Anonymous Process and First-Class Citizens (Lambda Expressions) · Classroom Blackboard Demonstration (00:16:15)](</attachments/cs61a-91fe4a2cc216fec04a19d0d4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=975)
*⏱ Timestamp: 00:16:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=975)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“They have the following special form syntax as a lambda, and I write down the formal parameters in parentheses, and then I give the body of the procedure. Lambda is very important in skiing. So here are two different equivalent expressions that define a plus four procedure and bind it to the name pl...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Lambda Anonymous Process and First-Class Citizens (Lambda Expressions)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Used in Scheme  `lambda`  Special forms create anonymous procedures:

```scheme
(lambda (<param1> <param2> ...) <body>)
```

Under the hood, a procedure definition statement simply converts a  `lambda`  Syntactic sugar for binding to a specified symbol:

```scheme
;; 语法糖写法
(define (plus4 x) (+ x 4))

;; 等价的原始 lambda 绑定
(define plus4 (lambda (x) (+ x 4)))

;; 直接作为组合式操作符即时调用
((lambda (x y z) (+ x y (square z))) 1 2 3)  ; 1 + 2 + 9 = 12
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Lambda Anonymous Process and First-Class Citizens (Lambda Expressions)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Advanced special forms: cond, begin and let

[![Advanced special forms: cond, begin and let · Classroom blackboard demonstration (00:18:15)](</attachments/cs61a-b153e09175ccb7fca9e28cfa.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1095)
*⏱ Timestamp: 00:18:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:18:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1095)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“By having that last consequent expression have another if in it, and its consequent have another if in it. So you don't really need anything new, but if you have a lot of elifs, then this nested if idea is kind of annoying, which is why there's cond. So here's a scheme example that does the same thi...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Advanced special forms: cond, begin and let", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1. `cond`  multi-branch conditional expression

Equivalent to Python's  `if ... elif ... else`: 

```scheme
(cond
  ((> x 10) 'big)
  ((> x 5)  'medium)
  (else     'small))
```

### 2. `begin`  sequential compound expression

[![begin sequential compound expression · Classroom blackboard demonstration (00:20:15)](</attachments/cs61a-11e2ba8d09ca2a568d104cd7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1215)
*⏱ Timestamp: 00:20:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1215)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:20:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And usually what happens in practice is that if you're just choosing among two alternatives, then you use if, and if it's more than two, then you use cond. The begin special form combines multiple expressions into one expression. The value of a begin special form is just the value of its last sub-ex...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Advanced special forms: cond, begin and let", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Use when you need to execute multiple statements in sequence in a syntax slot that can only hold a single expression (usually for printing or side effects):

```scheme
(begin
  (print 'first)
  (print 'second)
  (+ 2 3))  ; 整个 begin 表达式的值为最后一条子表达式的结果 5
```

### 3. `let`  local temporary binding

[![let partial temporary binding · Classroom blackboard demonstration (00:22:15)](</attachments/cs61a-843c1b0a4444521334c0b2e9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1335)
*⏱ Timestamp: 00:22:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1335)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:22:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The hypotenuse length of a right triangle that has legs 3 and 2 plus 2 is 4. So this would be a 3, 4, 5 triangle where this expression C should give us 5. Maybe in this program all I really cared about was making sure that C was bound to 5. But if I write this Python code, A and B are still bound do...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Advanced special forms: cond, begin and let", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


`let`  It is allowed to introduce local variables that are only effective in the current code block and are destroyed immediately after the calculation is completed to prevent global namespace pollution:

```scheme
;; 计算直角三角形斜边：局部绑定 a 与 b
(define c
  (let ((a 3)
        (b (+ 2 2)))
    (sqrt (+ (square a) (square b)))))

;; 此处 a 与 b 不存在，只有 c = 5 永久保留
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Advanced special forms: cond, begin and let" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Scheme practice: turtle drawing and Sierpinski fractal triangle

The course environment has a built-in logo-style Turtle Graphics module, which perfectly demonstrates the geometric beauty of high-order processes and recursive fractals:

[![Scheme practice: turtle drawing and Sierpinski fractal triangle · Classroom blackboard demonstration (00:24:45)](</attachments/cs61a-5b8a5e1512a5da83ab7be0dc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1485)
*⏱ Timestamp: 00:24:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1485)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which is that you don't have to worry about defining anything that you don't need later. You can kind of just say, I want C to persist, but A and B were just temporarily there in order to compute C. And now we don't need them anymore. Let's look at an example of a scheme program that draws Sierpinsk...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Scheme Practical Combat: Turtle Drawing and Sierpinski Fractal Triangle", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Scheme practice: turtle drawing and Sierpinski fractal triangle · Classroom blackboard demonstration (00:26:45)](</attachments/cs61a-34904a1f446d6913ecf6edff.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1605)
*⏱ Timestamp: 00:26:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1605)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Repeat k times some procedure, means calling that procedure, we're going to do it at least once, and if it's the case that k is greater than 1, then we have to keep going. So we'll repeat k minus 1 times using that same procedure. I could load all those by naming the file, then I'll take a right tur...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Scheme Practical Combat: Turtle Drawing and Sierpinski Fractal Triangle", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Scheme practice: turtle drawing and Sierpinski fractal triangle · Classroom blackboard demonstration (00:28:45)](</attachments/cs61a-1b79081d46e6884e47933aa7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1725)
*⏱ Timestamp: 00:28:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1725)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:28:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Then we just draw a line of length k. Otherwise, we draw a leg of Sierpinski's triangle with d greater than 1, which is going to be mutually recursive with this procedure Sierpinski that I've just defined. The leg also takes in d and k, but it does the drawing work. And here's what it looks like. Yo...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Scheme Practical Combat: Turtle Drawing and Sierpinski Fractal Triangle", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Scheme practice: turtle drawing and Sierpinski fractal triangle · Classroom blackboard demonstration (00:30:15)](</attachments/cs61a-db55c6b749a98c6296d2e0b0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1815)
*⏱ Timestamp: 00:30:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P26 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26&t=1815)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:30:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Otherwise, it builds a triangle out of Sierpinski triangles. A Sierpinski triangle is made up of three Sierpinski triangles, each of which is made up of three Sierpinski triangles, each of which is made up of three Sierpinski triangles, each of which is made up of three regular triangles. We finally...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Scheme Practical Combat: Turtle Drawing and Sierpinski Fractal Triangle", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "S expression syntax tree, define / if / cond / lambda special forms", beginners can easily guess the result based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Mutual recursive fractal triangle implementation code

```scheme
;; 高阶重复执行过程
(define (repeat k fn)
  (fn)
  (if (> k 1) (repeat (- k 1) fn)))

;; 绘制任意边长三角形
(define (tri fn)
  (repeat 3 (lambda () (fn) (right 120))))

;; 谢尔宾斯基分形三角形
(define (sier d k)
  (tri (lambda () (if (= d 1) (fd k) (leg d k)))))

(define (leg d k)
  (sier (- d 1) (/ k 2))
  (penup) (fd k) (pendown))
```

- **base case ($d=1$)**: Directly draw a line with a length of  $k$  straight line;
- **recursive step ($d>1$)**: Each side of the current triangle is composed of a smaller-scale Sierpinski triangle. By lifting the pen (`penup`), forward (`fd`), put pen to paper (`pendown`) blossom into stunning fractal structures on the canvas.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Scheme Practical Combat: Turtle Drawing and Sierpinski Fractal Triangle" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Chapter summary and core test points

1. **Isomorphism and grammatical simplicity**:Scheme strictly uses prefix brackets to express combinations; the code and data forms are completely consistent.
2. **Regular calls vs special forms**: Regular call to evaluate all subexpressions; special form (`if`, `define`, `lambda`, `cond`, `let`) has a unique execution control flow.
3. **Lexical scope and first-class procedures**: Procedures can exist as parameters, return values, and local closures, laying the foundation for subsequent self-made interpreters.

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "7. Chapter Summary and Core Test Points" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous lecture: Lecture 25 Data Examples](/en/notes/cs61a/lecture-25) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 29 Scheme Lists →](/en/notes/cs61a/lecture-27) | [🎬Watch this lecture on Bilibili (P26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=26) |
