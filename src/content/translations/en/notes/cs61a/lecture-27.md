---
kind: notes
source: cs61a/lecture-27
title: Lecture 27 · Scheme Lists and Symbolic Computation
description: "CS61A Lecture 27: Scheme Lists and Symbolic Computation (Scheme Lists)"
sourceHash: e0bed6675c76652e669323dc4f1e4e1ae13bf6a7c609681273d1a9187c718ecc
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 4: Interpreters & Scheme (Interpreters & Scheme)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 24:44 ｜ **Classroom screenshots**: 16 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27)  
> **Quick navigation**: [← Previous Lecture (P26 Lecture 28 Scheme)](/en/notes/cs61a/lecture-26) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P28 Lecture 30 Calculator) →](/en/notes/cs61a/lecture-28)

---

## 1. Core mental model and architecture diagram

In Python, there are many built-in data structures such as lists, tuples, dictionaries and sets; while in Scheme, **List is everything**.

Scheme's list is a strict \*\*one-way linked list (Linked List)\*\* structure at the bottom level. It is supported by the most refined "Trinity" primitive:

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

- **underlying isomorphism**: Each list is one or more nested  `cons`  cell, the right cell recursively points to the remaining list, and ends with  `nil`  end.
- **show separation**: Although the underlying layer is a complex pointer grid, the Scheme interpreter uniformly outputs it in the REPL in a flat, bracketed, space-delimited format, such as  `(1 2 3 4)`.

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


## 2. Basic list operations: Cons, Car, Cdr and Nil

[![Basic list operations: Cons, Car, Cdr and Nil · Classroom blackboard demonstration (00:00:55)](</attachments/cs61a-296a49efc1f146739c2e9769.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Lisp was created in the late 1950s, and back then it seems computer scientists really liked confusing names and acronyms. So, they invented a procedure called cons, which is a two-argument procedure that creates a linked list. Creating a linked list is only useful if you can access the first element...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Basic list operations: Cons, Car, Cdr and Nil", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Basic list operations: Cons, Car, Cdr and Nil · Classroom blackboard demonstration (00:02:15)](</attachments/cs61a-8fb490fdf0b82d4df0c4b384.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=135)
*⏱ Timestamp: 00:02:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=135)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So if I cons to a nil, I build this cons. And if I cons one and cons to nil, then I build this cons where the rest of the list is a list containing two. But evaluating this expression and scheme doesn't show me this structure. Instead, it just shows a list containing one and two. If I define X to be...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Basic list operations: Cons, Car, Cdr and Nil", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Core primitive definition

- `(cons first rest)`: Construct a new node. `first`  Can be any data, in a well-structured list  `rest`  Must be another list or  `nil`.
- `(car s)`: Get the first element of the linked list (First).
- `(cdr s)` (pronounced "could-er"): Get the rest of the linked list (Rest).
- `nil`: represents an empty linked list (`'()`).

[![Core primitive definition · Classroom blackboard demonstration (00:03:45)](</attachments/cs61a-c26587502dc456721fdbe35d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=225)
*⏱ Timestamp: 00:03:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=225)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But if I draw it, I'll see the linked list structure. And draw is not built into every version of Scheme, but it is built into this one so that we can see what's going on. What happens if I cons 3 onto S? I'm allowed to do this. When I call cons, the first argument can be anything. The second argume...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Basic list operations: Cons, Car, Cdr and Nil", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Nested construction drill and visualization (Draw)

[![Nested construction drill and visualization (Draw) · Classroom blackboard demonstration (00:04:45)](</attachments/cs61a-f0290b44cf973ae04f7f41b4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=285)
*⏱ Timestamp: 00:04:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=285)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“I suggest you pause for a moment until you have some idea of the answer. I'm going to show you the answer in 3, 2, 1. Cons creates a list where this is the first element and this is the rest of the list. Since S has length 2, this cons has length 3, and the three elements are a list containing 4, 3,...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Basic list operations: Cons, Car, Cdr and Nil", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

[![Nested construction drill and visualization (Draw) · Classroom blackboard demonstration (00:06:15)](</attachments/cs61a-f4a463edcdf2514bcd4029eb.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=375)
*⏱ Timestamp: 00:06:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=375)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The list one, two. Let's look at a few built-in functions related to lists. So if S is one, two, I can see whether that's a list or not. It is. And remember that sharp T is scheme's way of saying true. Is three a list? No. Is the car of S a list? No. Because the car of S is the number one. Is nil a ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Basic list operations: Cons, Car, Cdr and Nil", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Constructor  `list`  with common predicates

Use nesting  `cons`  Constructing a long list is too lengthy, Scheme provides a variable parameter constructor  `list`: 

```scheme
(list 1 2 3 4)  ; 等价于 (cons 1 (cons 2 (cons 3 (cons 4 nil))))

(list? '(1 2))  ; #t
(null? nil)     ; #t (判定是否为空列表)
(null? '(1))    ; #f
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Basic List Operations: Cons, Car, Cdr and Nil" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Symbolic Programming & Quotation

In traditional programming languages, a symbol (variable name) is always replaced by the value it is bound to when evaluated; but in artificial intelligence and theorem proving, we need **Programs can manipulate symbols themselves as data** (Symbolic Manipulation).

[![Symbolic Programming & Quotation · Classroom Blackboard Demonstration (00:07:45)](</attachments/cs61a-1df3ee6a7c51502e356edbe2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=465)
*⏱ Timestamp: 00:07:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=465)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“You could manipulate whole equations. And for this reason, Lisp was the standard language for artificial intelligence for many years, and was also the standard language for any kind of automatic manipulation of mathematical equations, such as symbolic differentiation or automatically verifying proof...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Symbolic Programming & Quotation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Single quote syntax (Quotation)

[![Single quote syntax (Quotation) · Classroom blackboard demonstration (00:09:15)](</attachments/cs61a-5cd2d972b8656086b816fa8b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=555)
*⏱ Timestamp: 00:09:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=555)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And never with one at the beginning and one at the end, but instead just one at the beginning of whatever I'm quoting. Then I build a list containing the symbols A and B. If I build a list with the symbol A and the value to which B is bound, I get a list that contains A and the number 2. So as you c...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Symbolic Programming & Quotation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


single quote  `'`  is a special form  `quote`  syntactic sugar, which informs the interpreter: **Do not evaluate subsequent expressions, return them directly as data!**

[![Single quote syntax (Quotation) · Classroom blackboard demonstration (00:10:45)](</attachments/cs61a-21b175c62bdeb5f716b2ab78.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=645)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=645)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Use the value a in any way that I want. For example, placing it inside of a list. And I could do that using either syntax. The nice thing about the single quote is that it saves you a set of nested parentheses. When quoting a list, you get a list. But all the expressions within it are quoted as well...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Symbolic Programming & Quotation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

> **Classic index derivation**:
Evaluate  `(car (cdr (car (cdr '(1 (2 3) 4)))))`: 
> 1. `(cdr '(1 (2 3) 4))` $\to$ `'((2 3) 4)`
> 2. `(car ...)` $\to$ `'(2 3)`
> 3. `(cdr ...)` $\to$ `'(3)`
> 4. `(car ...)` $\to$  integer  `3`!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Symbolic Programming & Quotation" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. High-order list processing process: Append, Map, Filter and Apply

Scheme has an extremely powerful built-in library for functional lists:

[![Advanced list processing process: Append, Map, Filter and Apply · Classroom blackboard demonstration (00:12:15)](</attachments/cs61a-36cba99d57b862332207f11e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=735)
*⏱ Timestamp: 00:12:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:12:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=735)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The quitter of that is a list containing three and the car of that is the number three. And we could have told exactly the same story if instead of numbers, these were all symbols themselves. Let's try out some list processing procedures that are built in. A PEND lists the elements of two different ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. High-order list processing: Append, Map, Filter and Apply", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Advanced list processing process: Append, Map, Filter and Apply · Classroom blackboard demonstration (00:13:45)](</attachments/cs61a-cac95ca1234a4f430cf2230d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=825)
*⏱ Timestamp: 00:13:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=825)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:13:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Just gives me the elements 1, 2, 1, 2. And I can append s a bunch of times in order to get all of the values in s, s, s, and s, which is quite different than what you get if you list s four times, then you get a nested structure. If I call map with the even predicate on all the elements of s, then I...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. High-order list processing: Append, Map, Filter and Apply", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Advanced list processing process: Append, Map, Filter and Apply · Classroom blackboard demonstration (00:15:15)](</attachments/cs61a-ed47348ae462df4c3cf32422.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=915)
*⏱ Timestamp: 00:15:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=915)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:15:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And 5, 9. And then the last list processing procedure I mentioned is apply. When you apply some procedure like quotient to arguments 10 and 5, then it divides 10 by 5. Or if you apply plus to 1, 2, 3, 4, then it's as if I had applied plus to 1, 2, 3, and 4. Notice this is quite different than mappin...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. High-order list processing: Append, Map, Filter and Apply", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


| process | syntax signature | Semantics and functionality |
| :--- | :--- | :--- |
| `append` | `(append s1 s2 ...)` | Flatten elements from multiple lists into a single list |
| `map` | `(map proc s)` | single parameter process  `proc`  mapped to  `s`  On each element of , collect as a new list |
| `filter` | `(filter pred s)` | Keep only the predicates such that  `pred`  Return  `#t`  elements of |
| `apply` | `(apply proc s)` | **Unpacking argument list**: will list  `s`  Deconstruct into each formal parameter and call  `proc` |

### Apply vs Map core analysis

- `(map + '(1 2 3 4))`: Equivalent to calling each number separately  `(+ 1)`, `(+ 2)`...Unable to complete accumulation;
- `(apply + '(1 2 3 4))`: Equivalent to evaluation  `(+ 1 2 3 4)`, directly find the sum of the entire list  `10`! Therefore, no additional definition is needed in Scheme  `sum`  function.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. High-order list processing process: Append, Map, Filter and Apply" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Practical practice on recursion: even subsets algorithm (Even Subsets)

[![Practical practice on recursion topics: Even Subsets Algorithm (Even Subsets) · Classroom blackboard demonstration (00:16:45)](</attachments/cs61a-40bd8c109655fb731dfb82e0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1005)
*⏱ Timestamp: 00:16:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1005)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“A procedure that takes in a list S and gives us back the non-empty subsets of that integer list S that have an even sum. So when I call even subsets on 3, 4, 5, 7, it tells me all of the non-empty subsets, like here's some of the values in 3, 4, 5, 7, 5, 7, but it only shows me the ones that have an...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Practical combat on recursive topics: Even Subsets Algorithm (Even Subsets)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Requirements: Given a list of integers  $S$, find all its **The sum of the elements is an even number** A non-empty subset list of .

[![Practical practice on recursion topics: Even Subsets Algorithm (Even Subsets) · Classroom blackboard demonstration (00:18:45)](</attachments/cs61a-07dfbcf974dd697635927afb.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1125)
*⏱ Timestamp: 00:18:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1125)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The three different sources of even subsets that we saw on the previous slide. One was the even subsets of the rest of S. The second was a whole list of subsets where they all start with the first value in S. So what we're going to do is map a procedure which takes some existing subset, let's call i...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Practical combat on recursive topics: Even Subsets Algorithm (Even Subsets)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Recursive mathematical structure analysis

for list  $S$  Even subset of:
1. **Does not include the first item  `(car S)`**: i.e. the remaining part  `(cdr S)`  All even subsets of ;
2. **Contains first item  `(car S)`**: 
   - If  `(car S)`  is an even number: will  `(car S)`  Spliced in  `(cdr S)`  of **even subset** front(even + even = even);
   - If  `(car S)`  is an odd number: will  `(car S)`  Spliced in  `(cdr S)`  of **odd subset** front(odd + odd = even);
3. **single element subset**:If  `(car S)`  itself is an even number, then  `(list (car S))`  itself constitutes a legal subset.

[![Recursive mathematical structure analysis · Classroom blackboard demonstration (00:20:45)](</attachments/cs61a-217915c2b2375b5d9bcdecfa.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1245)
*⏱ Timestamp: 00:20:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1245)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:20:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Except, we need to look carefully at what happens when we're consing the car of S onto T. If it's odd, then how do I make a new odd subset by adding an odd number? Well, I have to add it to an even number. Otherwise, if it's even, I need to add it to an odd number in order to get another odd. So, le...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Practical combat on recursive topics: Even Subsets Algorithm (Even Subsets)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Recursive mathematical structure analysis · Classroom blackboard demonstration (00:22:15)](</attachments/cs61a-083875ba63c0523477b4db12.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1335)
*⏱ Timestamp: 00:22:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:22:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1335)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:22:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“I think a higher order function could fix that. We just define some subset helper that uses even in this case, and I think it needs access to S. And here we want to use a version of subset helper that takes odd instead. Now what is subset helper? Well, it's just this code that we already defined. Su...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Practical combat on recursive topics: Even Subsets Algorithm (Even Subsets)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### The Elegant Pipeline Solution

With the help of  `filter`  with  `apply`, we can reconstruct complex multi-branch recursion into an extremely pure functional pipeline:

[![The Elegant Pipeline Solution · Classroom Blackboard Demonstration (00:23:45)](</attachments/cs61a-8dc8a9fcd552444e581e65ee.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1425)
*⏱ Timestamp: 00:23:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P27 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27&t=1425)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:23:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“What you get when you cons the first element of S onto everything in the rest and then a list containing just one element, which is a list containing just one number. What would this rest be? And then, how would you filter that list of all non-empty subsets just to get the ones that have a sum which...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Practical combat on recursive topics: Even Subsets Algorithm (Even Subsets)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Constructing a linked list using cons pairs and nil, and delaying symbolization of quotes", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

> **Code appreciation**:
This implementation completely abandons the cumbersome odd-even mutual recursive state maintenance, completely decouples "generating all candidate subsets" and "determining whether the sum of the subsets is an even number", fully demonstrating the abstract power and pure beauty of functional architecture.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Practical Combat on Recursive Topics: Even Subsets Algorithm (Even Subsets)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Chapter summary and core test points

1. **Linked list origin**: Remember  `(cons car cdr)`  Pointer topology; bracket hierarchy that distinguishes direct elements from nested lists.
2. **QuoteGate**:single quote  `'`  Preventing evaluation is the key mechanism for Lisp to implement metaprogramming and symbolic computation.
3. **Advanced combo skills**: Proficient in  `map`, `filter`  with  `apply`  With the collaboration, complex combinatorial mathematics problems can be solved elegantly with just a few lines of declarative code.

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Chapter Summary and Core Test Points" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous lecture: Lecture 28 Scheme](/en/notes/cs61a/lecture-26) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 30 Calculator →](/en/notes/cs61a/lecture-28) | [🎬Watch this lecture on Bilibili (P27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=27) |
