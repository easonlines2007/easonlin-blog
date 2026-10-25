---
kind: notes
source: cs61a/lecture-22
title: "Lecture 22 · Composition: Linked Lists and Tree Structures"
description: "CS61A Lecture 22: Object composition and linked list tree
  structure (Composition)"
sourceHash: 95b0d52e40f01e95fb98dd62cfb9ac1d917932147d8a4b01cf12ac0301681755
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 33:16 ｜ **Classroom screenshots**: 17 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22)  
> **Quick navigation**: [← Previous Lecture (P21 Lecture 21 Representation)](/en/notes/cs61a/lecture-21) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P23 Lecture 23 Efficiency) →](/en/notes/cs61a/lecture-23)

---

## 1. Core mental model and architecture diagram

**Composition**  It is another core design pillar in object-oriented besides inheritance. it expresses  **has-a (contains)**  Relationship: One object has another object as part of its properties.

Through composition, we can build extremely elegant and recursive high-level data structures:
1. **Linked List**: one  `Link`  The node contains a current value  `first`  and another  `Link`  Example  `rest`.
2. **Tree**: one  `Tree`  The node contains a root node label  `label`  and a list of subtree branches  `branches`.

```
链表组合模型 (Linked List as Pair):
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │ first: 3      │        │ first: 4      │        │ first: 5      │
  ├───────────────┤        ├───────────────┤        ├───────────────┤
  │ rest: ────────┼───────►│ rest: ────────┼───────►│ rest: Link.empty (/)
  └───────────────┘        └───────────────┘        └───────────────┘

树形组合模型 (Tree as Node with Branch Subtrees):
                    ┌─────────────────────────┐
                    │ Tree(label=3)           │
                    │ branches: [B1, B2]      │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
      ┌─────────────────────┐         ┌─────────────────────┐
      │ Tree(label=1)       │         │ Tree(label=2)       │
      │ branches: [] (Leaf) │         │ branches: [B3]      │
      └─────────────────────┘         └──────────┬──────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────────┐
                                      │ Tree(label=1) (Leaf)│
                                      └─────────────────────┘
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


## 2. Design of linked list class and box pointer model (The Link Class)

The linked list is either empty or consists of the current element (`first`) and subsequent linked lists (`rest`) composition.

[![Design of linked list class and box pointer model (The Link Class) · Classroom blackboard demonstration (00:00:55)](</attachments/cs61a-29829e8b8728caea5c0cba9e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We'll use an instance of a class called the link. I haven't defined that yet, but I will soon. And that has two attributes. First, which is three, and rest, which is some object. Now that object is holding the rest of the values. And it itself is also a linked list, or a link instance. So every link...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. The design of the linked list class and the box pointer model (The Link Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Box-and-Pointer Diagrams

In computer science, the standard diagram of a linked list uses a double box to represent a node, with a right arrow pointing to the next node, and the empty list at the end is usually represented by a slash (`/`) means:

[![Box-and-Pointer Diagrams · Classroom Blackboard Demonstration (00:02:45)](</attachments/cs61a-e5e0046eb85e62599f6af736.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)
*⏱ Timestamp: 00:02:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“A linked list as its attribute value. Finally, there's some class attribute that we use for any linked list that's empty, and we call it link.empty. Now, the way we construct this is not by writing 3, 4, 5. That would make a tuple. Instead, we have to write out the constructor. A link with 3, and th...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. The design of the linked list class and the box pointer model (The Link Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Box-and-Pointer Diagrams · Classroom Blackboard Demonstration (00:04:45)](</attachments/cs61a-55b9aecefe435d5af5d5f33f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)
*⏱ Timestamp: 00:04:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“About how they get drawn. Typically, you do draw them as a sequence of pairs with arrows like this, but instead of drawing an arrow to link.empty, it's very common to just put a slash there. This is not any sort of official notation, but you will see people do this out there in the world, so I thoug...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. The design of the linked list class and the box pointer model (The Link Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Canonical implementation of Link class

[![Standard implementation of Link class · Classroom blackboard demonstration (00:06:15)](</attachments/cs61a-b3e9282b11b0cbdd320dfb8a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)
*⏱ Timestamp: 00:06:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So those are the only two things we're allowed to pass in as the rest of the list. And then we store the first element and the rest of the list as attributes of the instance self. IsInstance is a built-in function in Python that returns whether rest is a link when passed to these two arguments. If y...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. The design of the linked list class and the box pointer model (The Link Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class Link:
    """递归单向链表类。"""
    empty = ()  # 使用空元组作为单例哨兵，表示空链表

    def __init__(self, first, rest=empty):
        assert rest is Link.empty or isinstance(rest, Link), "rest 必须是 Link 实例或 Link.empty"
        self.first = first
        self.rest = rest

    def __repr__(self):
        if self.rest:
            rest_repr = ', ' + repr(self.rest)
        else:
            rest_repr = ''
        return f'Link({self.first}{rest_repr})'
```

> **Design points**: 
> 1. `rest`  The default value is  `Link.empty`, when constructing a single node, it can be abbreviated as  `Link(5)`.
> 2. `isinstance(rest, Link)`  Verification ensures the well-formedness of the linked list structure and supports subclasses that may be expanded in the future.

### Attribute access and node retrieval

[![Attribute access and node retrieval · Classroom blackboard demonstration (00:08:15)](</attachments/cs61a-6b69803fc68308b4c215e81c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)
*⏱ Timestamp: 00:08:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“I can access 5 by saying the rest of the list's rest of the list's first element. That's 5. And finally, I can ask whether the rest of the rest of the rest of the list is link.empty. And it should be, because there's nothing there. So these are the ways in which I'll manipulate a linked list. It is,...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. The design of the linked list class and the box pointer model (The Link Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
s = Link(3, Link(4, Link(5)))

print(s.first)             # 3 (第 0 项)
print(s.rest.first)        # 4 (第 1 项)
print(s.rest.rest.first)   # 5 (第 2 项)
print(s.rest.rest.rest is Link.empty)  # True
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "2. Design of Linked List Class and Box Pointer Model (The Link Class)", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Recursive processing of linked lists: Range, Map and Filter

Since linked lists have a natural recursive combination structure, the most natural way to deal with linked lists is **recursion**.

[![Recursive processing of linked lists: Range, Map and Filter · Classroom blackboard demonstration (00:10:45)](</attachments/cs61a-ff7377338721a4e0d8b22fb2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But the syntax will be slightly different. We'll have to come up with our map link function, which we'll implement momentarily, which takes a square and squares all the elements of the result of filtering a linked list using the odd function, where we start with a linked list representing the range ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Recursive processing of linked lists: Range, Map and Filter", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Recursive processing of linked lists: Range, Map and Filter · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-f65b1e51a2f7e1d635523979.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And what's the rest of the range? Well, that is the range that starts at start plus one and goes to the end. How do we take a function and map it over all the elements in S? Calling F on every single element and building a linked list of the result. If it's the case that S is linked at empty, there'...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Recursive processing of linked lists: Range, Map and Filter", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Recursive processing of linked lists: Range, Map and Filter · Classroom blackboard demonstration (00:14:15)](</attachments/cs61a-ebb0626edf7614f4d51223c2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)
*⏱ Timestamp: 00:14:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Well, that depends on what you get when you call f on s.first. If that's a true value, then we need s.first to be in the result. And what's everything else? Well, that's the result of filtering the rest of the list. Otherwise, if this is a false value, then s.first is not supposed to be in the resul...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Recursive processing of linked lists: Range, Map and Filter", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Implementation of the Three Musketeers of Recursive Operations

```python
def range_link(start, end):
    """构建包含 [start, end) 连续整数的链表。"""
    if start >= end:
        return Link.empty
    return Link(start, range_link(start + 1, end))

def map_link(f, s):
    """将函数 f 映射到链表 s 的每个元素上，返回全新链表。"""
    if s is Link.empty:
        return Link.empty
    return Link(f(s.first), map_link(f, s.rest))

def filter_link(f, s):
    """过滤链表 s，仅保留满足谓词 f 的元素。"""
    if s is Link.empty:
        return Link.empty
    filtered_rest = filter_link(f, s.rest)
    if f(s.first):
        return Link(s.first, filtered_rest)
    else:
        return filtered_rest
```

### Combination drill

```python
# 生成 1~5，过滤奇数，并求平方
s = range_link(1, 6)             # Link(1, Link(2, Link(3, Link(4, Link(5)))))
odds = filter_link(lambda x: x % 2 != 0, s)  # Link(1, Link(3, Link(5)))
squares = map_link(lambda x: x * x, odds)    # Link(1, Link(9, Link(25)))
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Recursive processing of linked lists: Range, Map and Filter" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. In-place modification of linked lists and circular linked lists (Mutation & Cycles)

A linked list serves as an object instance, and its  `first`  with  `rest`  Properties can be rebinded in place. This variability brings extremely high flexibility, but it also introduces the possibility of creating a Cyclic Linked List (Cycle).

[![In-place modification of linked lists and circular linked lists (Mutation & Cycles) · Classroom blackboard demonstration (00:16:15)](</attachments/cs61a-77e2c5022cadca9cc5b992b3.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)
*⏱ Timestamp: 00:16:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The REST attribute of a link instance. In this case, we're assigning it to S. Then, S dot first is five, and what's S dot REST dot REST dot REST dot REST dot REST dot first? Well, think about it for a minute and see if you can figure it out. This is going to be the number two. One reasonable reactio...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. In-place modification of linked lists and cyclic linked lists (Mutation & Cycles)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![In-place modification of linked lists and circular linked lists (Mutation & Cycles) · Classroom blackboard demonstration (00:17:45)](</attachments/cs61a-c66869d10913b9bb421bb1e2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)
*⏱ Timestamp: 00:17:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:17:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“In the appropriate position so that everything stays ordered from least to greatest. So here's the function. Add to a list s, a value v, which modifies s to make sure that it contains v and then returns that modified s. However, if v is already an s, then we don't modify s so that we don't have repe...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. In-place modification of linked lists and cyclic linked lists (Mutation & Cycles)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Create infinite circular references

```python
s = Link(1, Link(2, Link(3)))
s.first = 5
t = s.rest  # t 指向 Link(2, Link(3))
t.rest = s  # 将 t.rest 重新指回链表头 s！

# 此时形成环状拓扑结构：5 -> 2 -> 5 -> 2 -> 5 ...
print(s.rest.rest.rest.rest.first)  # 5
```

### Classic algorithm: insert in place keeping ascending order  `add(s, v)`

[![Classic algorithm: insert add(s, v) in place while maintaining ascending order · Classroom blackboard demonstration (00:19:45)](</attachments/cs61a-abfb2f78ad3d38201e3cdbbd.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)
*⏱ Timestamp: 00:19:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:19:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:19:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So, instead of REST being linked at empty, REST needs to be a new link instance containing the six. That's how we add V into S. Try to implement it. Add V into S, returning modified S. Don't change S if V is already there, and make sure that S remains ordered. We assume that S is ordered at the begi...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. In-place modification of linked lists and cyclic linked lists (Mutation & Cycles)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Classic algorithm: insert add(s, v) in place while maintaining ascending order · Classroom blackboard demonstration (00:21:15)](</attachments/cs61a-330c304930b4b2ee6b884513.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)
*⏱ Timestamp: 00:21:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:21:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Then we place v as s.first and change s.rest to contain the old s.first and the old s.rest. That's building this link instance or building this link instance. If s.first is less than v and the rest is empty, then we need to build this link instance by setting s.rest to a link where v is the first el...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. In-place modification of linked lists and cyclic linked lists (Mutation & Cycles)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Requirement: Strictly increasing linked list without duplication  `s`  Insert elements in place  `v`, keeping order and not generating duplicate values:

```python
def add(s, v):
    """就地修改链表 s，插入值 v 并保持单调递增，返回修改后的 s。"""
    assert s is not Link.empty, "链表不可为空"
    if s.first > v:
        # 在头部插入：当前节点值后移，并将新值填入头部
        s.first, s.rest = v, Link(s.first, s.rest)
    elif s.first < v and s.rest is Link.empty:
        # 在尾部插入
        s.rest = Link(v)
    elif s.first < v:
        # 递归寻找合适插入点
        add(s.rest, v)
    return s
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. In-place modification of linked lists and cyclic linked lists (Mutation & Cycles)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Object-oriented modeling of tree objects (The Tree Class)

In Lecture 14, we used functional data abstraction (nested lists) to construct a tree. Now, with object-oriented composition, the definition of a tree has never been clearer.

[![Object-oriented modeling of tree objects (The Tree Class) · Classroom blackboard demonstration (00:23:15)](</attachments/cs61a-8bf43f81485ce6ab490d3d03.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)
*⏱ Timestamp: 00:23:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:23:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:23:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“There's a branch and there's one other branch. Each branch is a tree. A tree with zero branches is called a leaf. In this diagram, there are five leaves. The leaves have labels as well. They just have no branches. A tree starts at the root. There's the root of the whole tree. There's the root of the...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Object-oriented modeling of tree objects (The Tree Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Object-oriented modeling of tree objects (The Tree Class) · Classroom blackboard demonstration (00:25:15)](</attachments/cs61a-27f9426788d5d4d618c779c1.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)
*⏱ Timestamp: 00:25:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:25:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And the most common paths are paths from the root to a leaf, but you could have other kinds of paths as well. We were able to work with trees using data abstraction, but we can also use Python's object system. A tree has a label and a list of branches. Each branch is also a tree. We can state this b...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Object-oriented modeling of tree objects (The Tree Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Specification definition of Tree class

```python
class Tree:
    """具备标签与子树列表分支的树对象。"""
    def __init__(self, label, branches=[]):
        self.label = label
        for b in branches:
            assert isinstance(b, Tree), "分支必须是 Tree 对象"
        self.branches = list(branches)

    def is_leaf(self):
        return not self.branches

    def __repr__(self):
        if self.branches:
            branch_str = ', ' + repr(self.branches)
        else:
            branch_str = ''
        return f'Tree({self.label}{branch_str})'

    def __str__(self):
        """缩进排版的人类可读树状图。"""
        def indented(t):
            lines = [str(t.label)]
            for b in t.branches:
                for line in indented(b):
                    lines.append('  ' + line)
            return lines
        return '\n'.join(indented(self))
```

[![Standard definition of the Tree class · Classroom blackboard demonstration (00:27:45)](</attachments/cs61a-2b354ef66684d53c12630700.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)
*⏱ Timestamp: 00:27:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:27:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:27:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And it's the same, with slight differences. When I use the object system, I capitalize the word tree and I access the label using dot notation. Under data abstraction, I had a function called tree and I accessed the label using a selector function. But our code doesn't change at all. So the coding s...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "5. Object-oriented modeling of tree objects (The Tree Class)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Comparison of object-oriented vs data abstraction design

| Dimensions | Functional Abstraction | Object-oriented composition (OOP Composition) |
| :--- | :--- | :--- |
| **Construction method** | `tree(label, branches)` | `Tree(label, branches)` |
| **selector** | Must be implemented explicitly  `label(t)`, `branches(t)` | Native attribute point access  `t.label`, `t.branches` |
| **underlying representation** | Exposed as nested list or tuple | Encapsulated inside the object, the underlying storage details are not visible to the outside |
| **Formatted output** | Rely on external printing function | Automatic integration  `__repr__`  Indent with multiple lines  `__str__` |

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Object-oriented modeling of tree objects (The Tree Class)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Practical practice of tree recursive classic algorithm

[![Practical practice of classic tree recursive algorithm · Classroom blackboard demonstration (00:30:15)](</attachments/cs61a-cb8b20c0d2056f4d786fd4dd.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)
*⏱ Timestamp: 00:30:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:30:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Then we can return all of these leaves. And if we call leaves on fib tree six, we get a list of leaves that sum to eight, which is Fibonacci number six. And what's the height of this tree? Well, the height of a leaf is zero. And the height of a tree in general is the number of transitions in its lon...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Practical practice of tree-shaped recursive classic algorithm", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1. Collect all leaf nodes  `leaves(t)`

```python
def leaves(t):
    """返回树 t 的所有叶子节点标签列表。"""
    if t.is_leaf():
        return [t.label]
    all_leaves = []
    for b in t.branches:
        all_leaves.extend(leaves(b))
    return all_leaves
```

### 2. Calculate the height of the tree  `height(t)`

The height of the tree is defined as the longest path hop count from the root node to any leaf node (leaf height is 0):

```python
def height(t):
    """计算树 t 的高度。"""
    if t.is_leaf():
        return 0
    return 1 + max(height(b) for b in t.branches)
```

### 3. Prune subtrees in place  `prune(t, n)`

[![Prune the subtree in place prune(t, n) · Classroom blackboard demonstration (00:32:15)](</attachments/cs61a-dace2d2fd80112e5876f96a4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)
*⏱ Timestamp: 00:32:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P22 00:32:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:32:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So here's an example tree, and let's say we want to prune all of the subtrees whose root label is 1. This 0 goes because it's part of this subtree. Here's a template. Pause for a moment and try to fill it in, and I'll go over the solution in 3, 2, 1. The key here is to modify t.branches by setting i...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Practical practice of tree-shaped recursive classic algorithm", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Link recursive linked list class, recursive method definition and local node reconnection", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Requirement: remove tree  `t`  All root tags in  `n`  Subtree branch of:

```python
def prune(t, n):
    """就地修剪掉树中所有根标签为 n 的分支。"""
    # 策略：优先剔除直接子分支，再递归修剪剩余存活分支
    t.branches = [b for b in t.branches if b.label != n]
    for b in t.branches:
        prune(b, n)
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Tree Recursive Classic Algorithm Practice" module, the underlying computer operations rely on strict formal evaluation logic:
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

1. **The power of combination**: Hold other objects through object attributes, so that data structures such as linked lists and trees that naturally contain hierarchical structures can be represented directly and cohesively.
2. **recursive processing paradigm**: 
   - Linked list recursion: base case processing  `Link.empty`, the recursive step is decomposed into  `s.first`  with  `s.rest`; 
   - Tree Recursion: Base Case Processing  `t.is_leaf()`, recursive step traversal  `t.branches`.
3. **variability trap**: Attribute assignment can change topological connectivity, and references must be carefully managed to prevent infinite loops and unexpected memory leaks.

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
| [← Previous lecture: Lecture 21 Representation](/en/notes/cs61a/lecture-21) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 23 Efficiency →](/en/notes/cs61a/lecture-23) | [🎬Watch this lecture on Bilibili (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22) |
