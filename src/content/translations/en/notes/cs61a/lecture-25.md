---
kind: notes
source: cs61a/lecture-25
title: "Lecture 25 · Data Examples: Structures and Midterm Problems"
description: "CS61A Lecture 25: Data Structure and Solutions to Midterm Classic
  Questions (Data Examples)"
sourceHash: 49cb9ef51f67f44a828235f11e293e3272833d9581fae9bc1e12d50af2898d32
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 38:37 ｜ **Classroom screenshots**: 17 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25)  
> **Quick navigation**: [← Previous Lecture (P24 Lecture 24 Decomposition)](/en/notes/cs61a/lecture-24) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P26 Lecture 28 Scheme) →](/en/notes/cs61a/lecture-26)

---

## 1. Core mental model and architecture diagram

This lecture is the comprehensive final lecture of Module 3 (Object-Oriented and Efficiency). Professor DeNero selected the four most core data structure and computational thinking topics in previous midterm exams and high-frequency technical interviews:

```
                              ┌────────────────────────────────────────┐
                              │     Module 3 综合题解与实战大典        │
                              └───────────────────┬────────────────────┘
                                                  │
         ┌───────────────────┬────────────────────┴────────────────────┬────────────────────┐
         ▼                   ▼                                         ▼                    ▼
  ┌───────────────┐   ┌───────────────┐                         ┌───────────────┐    ┌───────────────┐
  │ 列表变动模型  │   │ 面向对象考题  │                         │ 序列推导算法  │    │ 链表归并经典  │
  ├───────────────┤   ├───────────────┤                         ├───────────────┤    ├───────────────┤
  │ • append/ext  │   │ • Worker 类   │                         │ • 最小绝对值  │    │ • ordered()   │
  │ • 切片赋值    │   │ • 资产阶级继承│                         │ • 邻项最大和  │    │ • merge()     │
  │ • 环形自引用  │   │ • 遮蔽与repr  │                         │ • 字典推导聚合│    │ • in-place    │
  └───────────────┘   └───────────────┘                         └───────────────┘    └───────────────┘
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


## 2. List Mutation & Environment Diagrams

In Python, variable names are just pointers to objects. The mutability (Mutation) of the list itself can lead to complex \*\*Aliasing\*\* phenomenon.

[![List Mutation & Environment Diagrams · Classroom Blackboard Demonstration (00:00:55)](</attachments/cs61a-f352c7eb5d603231d063b2dc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And environment diagrams help keep track of all this change as it's happening throughout the course of execution of a program. So let's work with an example where S is bound to the list 2, 3, T is bound to the list 5, 6, and we perform various mutation operations, have some example calls, and show t...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. List Mutation & Environment Diagrams", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Operation comparison: append vs extend

- `s.append(t)`: the object  `t` **as a whole single item** append to  `s`  end;
- `s.extend(t)`:Traverse  `t`  for each element of **Tile one by one** append to  `s`  end.

### Environment tracking for list splicing and slice references

[![Environment tracking of list splicing and slice references · Classroom blackboard demonstration (00:02:45)](</attachments/cs61a-10b65ce9f913063627c45e7e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=165)
*⏱ Timestamp: 00:02:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=165)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Let's start over once more and take a look at addition and slicing. Addition of two lists creates a new list, and slicing creates a new list. These lists contain the elements of the lists that were added or sliced. And here we'll do a longer example. We're going to assign A to S plus a list containi...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. List Mutation & Environment Diagrams", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
s = [2, 3]
t = [5, 6]

a = s + [t]  # a 为全新列表 [2, 3, [5, 6]]，内部引用 t 的同一对象
b = a[1:]    # b 为切片新列表 [3, [5, 6]]

a[1] = 9          # 仅改变 a 的首层元素，不影响 b
b[1][1] = 0       # 修改了共享的 t 列表！t 变为 [5, 0]
```

> **tracking rules**:
due to  `a`  and  `b`  sublists that collectively point to  `t`, modify  `b[1][1]`  make  `t`, `a[2]`  with  `b[1]`  Changes happen at the same time!

### Advanced Technique: Slice Assignment

[![Advanced skills: Slice Assignment · Classroom blackboard demonstration (00:05:15)](</attachments/cs61a-f496f49368a1a2570cfb185b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=315)
*⏱ Timestamp: 00:05:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:05:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=315)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“All referring to the same element of a list. OK, let's start over. The list function creates a new list containing existing elements. So if I say t equals list s, I get a new list containing 2 and 3. That replaces what t used to refer to. If I set s element 1 equal to 0, then I'm changing s, but I'm...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. List Mutation & Environment Diagrams", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Slice assignment allows you to insert, replace, or delete a contiguous range of elements in place without creating a new list shell:

```python
s = [2, 3]
t = [5, 6]

# 在索引 0 处就地插入 t 的全部元素（长度 0 替换为长度 2，后续元素后移）
s[0:0] = t       # s 变为 [5, 6, 2, 3]

# 就地切片删除
del s[0:2]       # 或 s[0:2] = []，s 恢复为 [2, 3]
```

### Make a self-referential circular list

[![Creating a self-referencing circular list · Classroom blackboard demonstration (00:08:15)](</attachments/cs61a-26c605497e8a84b73b5d2b1a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=495)
*⏱ Timestamp: 00:08:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=495)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Leaving only 3 and s. And in fact, if I remove all the elements from 0 to 2 of t, then I'm left with no elements at all. So let's put them together into a couple of more complicated examples. Let's say I assign t to the list 1, 2, 3. And then I perform slice assignment, where the slice from 1 to 3, ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. List Mutation & Environment Diagrams", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
t = [1, 2, 3]
t[1:3] = [t]     # 将索引 1..2 替换为包含自身的列表指针
# t 变为 [1, [...]]，形成无限自引用的环形列表！
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. List Mutation & Environment Diagrams" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie

[![Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie · Classroom blackboard demonstration (00:10:45)](</attachments/cs61a-d4220e5fbdd2480de09d4c8a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=645)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=645)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Here's an example. Let's say we have a class of worker. The worker greets others as sir, has a constructor that sets an attribute elf to the class worker, has a method work, which returns the greeting of the object passed in itself, plus I work, and finally has a special method, repr. And this repr ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Question code definition

```python
class Worker:
    greeting = 'Sir'
    def __init__(self):
        self.elf = Worker

    def work(self):
        return self.greeting + ', I work'

    def __repr__(self):
        return Bourgeoisie.greeting

class Bourgeoisie(Worker):
    greeting = 'Peon'
    def work(self):
        print(Worker.work(self))
        return 'I gather wealth'

jack = Worker()
john = Bourgeoisie()
jack.greeting = "Ma'am"
```

[![Question code definition · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-0aaa10e96e8ef0c952e7bf34.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“It would find this before it found that. Then these two lines create a worker instance and a bourgeoisie instance. The worker instance is created and then passed immediately into the constructor where it gains an attribute elf, which is bound to whatever the name worker is bound to. And worker is th...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Question setting and step-by-step evaluation and derivation

[![Question setting and step-by-step evaluation and derivation · Classroom blackboard demonstration (00:14:45)](</attachments/cs61a-d3de76cfe4feb629b4aa6f5f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=885)
*⏱ Timestamp: 00:14:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=885)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Adding Sir to iWork, return Sir iWork. OK. Jack is a worker. When I just write Jack and then evaluate that expression, it evaluates to this worker instance. But we want to be able to display that as a line of text. That's how interactive sessions work. And the way they work is by computing the wrapp...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Question setting and step-by-step evaluation and derivation · Classroom blackboard demonstration (00:16:45)](</attachments/cs61a-bbee9123e4d9a4ae4cc5a482.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1005)
*⏱ Timestamp: 00:16:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1005)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“John doesn't have a greeting instance attribute, but its class does, and that class has the greeting attribute pon. So we print out pon I work. After that's finished and printed out, this returns I gather wealth. So what we see is p and I work, I gather wealth. Now this one has quotes around it beca...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


1. **`Worker().work()`**: 
   - Instantiate an anonymous  `Worker`, call  `work()`.
   - `self.greeting`  Not found in instance, backtracking to  `Worker.greeting = 'Sir'`.
   - **result**: `'Sir, I work'`.
2. **`jack`  (Output in the REPL interactive environment)**: 
   - direct evaluation  `jack`  will trigger its  `__repr__()`.
   - `Worker.__repr__`  Return  `Bourgeoisie.greeting`, that is  `'Peon'`.
   - **interactive output**: `Peon`.
3. **`jack.work()`**: 
   - `jack`  Have exclusive instance attributes  `jack.greeting = "Ma'am"` (Class attribute shadowing occurred).
   - **result**: `"Ma'am, I work"`.
4. **`john.work()`**: 
   - `Bourgeoisie.work`  Execute first  `print(Worker.work(self))`.
   - entrust  `Worker.work(john)`, `john.greeting`  hit  `Bourgeoisie.greeting = 'Peon'`.
   - Printout: `Peon, I work` (Direct output from the console, **No quotes**).
   - The function then returns the string  `'I gather wealth'` (REPL return values are quoted).
5. **`john.elf.work(john)`**: 
   - `john.elf`  Yes  `Worker`  class. Call ordinary functions  `Worker.work(john)`, pass in  `john`  as  `self`.
   - **result**: `'Peon, I work'`.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "3. Analysis of classic object-oriented examination questions over the years: Worker and Bourgeoisie", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Sequence Manipulations

[![Advanced derivation and aggregation of sequences (Sequence Manipulations) · Classroom blackboard demonstration (00:19:15)](</attachments/cs61a-32759fd094e7f8055f9c3759.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1155)
*⏱ Timestamp: 00:19:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:19:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1155)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:19:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The smallest element by absolute value is the element at index 1. We're trying to list all of the indices corresponding to the smallest elements by absolute value, so we get a list containing 0. There's first exercise. I'm just going to go through them all. What's the largest sum of two adjacent ele...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Advanced derivation and aggregation of sequences (Sequence Manipulations)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Challenge 1: Find all subscripts of the element with the smallest absolute value

[![Challenge 1: Find all subscripts of the element with the smallest absolute value · Classroom blackboard demonstration (00:21:45)](</attachments/cs61a-198fcdd2e9de9821c475c1fc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1305)
*⏱ Timestamp: 00:21:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1305)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:21:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The min of s using key equals abs either. That would give me the element in this that has the smallest absolute value. It wouldn't give me the smallest absolute value. So if my goal is to actually get the smallest absolute value, I would need to first call abs on each element and then take them in, ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Advanced derivation and aggregation of sequences (Sequence Manipulations)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
s = [-4, -3, -2, 3, 2, 4]

# 两行优雅解法
min_abs = min(map(abs, s))
indices = [i for i in range(len(s)) if abs(s[i]) == min_abs]
# indices: [2, 4]
```

### Challenge 2: Maximum sum of two adjacent items (Adjacent Sum)

[![Challenge 2: Maximum sum of two adjacent items (Adjacent Sum) · Classroom blackboard demonstration (00:24:15)](</attachments/cs61a-2f3543e2f77c465a9c985f3c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1455)
*⏱ Timestamp: 00:24:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:24:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1455)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Rangeland s will give me all of the indices, but Rangeland s minus 1 will give me almost all the indices. Here it is as a range. If I go through almost all the indices, just leaving out the last one, and I compute s i plus s i plus 1, then I'm summing together two adjacent elements for every pair of...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Advanced derivation and aggregation of sequences (Sequence Manipulations)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
# 解法 A：索引切片范围
max(s[i] + s[i+1] for i in range(len(s) - 1))

# 解法 B：zip 对齐错位相加（更具 Pythonic 风格）
max(a + b for a, b in zip(s[:-1], s[1:]))
```

### Challenge 3: Dictionary comprehension grouped by last digit

[![Challenge 3: Dictionary derivation grouped by last digit · Classroom blackboard demonstration (00:26:45)](</attachments/cs61a-99c84cefb1d170a479ef91d1.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1605)
*⏱ Timestamp: 00:26:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1605)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Because there's no element in here that ends in the digit 2. So I need to filter out some of the d's. We want to keep a d if any of the elements in S ends in D. We can use the built-in any function. Any of the elements in S ends in D is expressed as any element ends in D. For all the elements in S. ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Advanced derivation and aggregation of sequences (Sequence Manipulations)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
# 将数字列表按末位数字 (0~9) 归类为字典，仅保留存在的数字
last_digits = {x % 10 for x in s}
grouped = {d: [x for x in s if x % 10 == d] for d in last_digits}
```

### Challenge 4: Determine if each element has a duplicate in the list

[![Challenge 4: Determine whether each element has a duplicate in the list · Classroom blackboard demonstration (00:29:45)](</attachments/cs61a-80d1062e89f0b2415757f77b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1785)
*⏱ Timestamp: 00:29:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1785)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:29:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Is it the case that all of the following are true? This expression, SI, is in the rest of S, not including I, for every I in range len S. Let me just write that all on one line correctly without forgetting the last parenthesis so you can see what's going on. So that's one way to solve this problem. ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Advanced derivation and aggregation of sequences (Sequence Manipulations)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
# 极简解法：所有元素的出现频次均大于 1
all(s.count(x) > 1 for x in s)
# 或
min(s.count(x) for x in s) > 1
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "4. Advanced Sequence Derivation and Aggregation (Sequence Manipulations)", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Classic linked list algorithm: ordered determination and double-chain merging (Linked List Merging)

[![Classic Linked List Algorithm: Ordered Determination and Double-Linked Merging (Linked List Merging) · Classroom Blackboard Demonstration (00:32:45)](</attachments/cs61a-b21d17ac3c0f1e1da3034e5b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1965)
*⏱ Timestamp: 00:32:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1965)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:32:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The elements of this aren't. How would you tell if a linked list is ordered from these to greatest by absolute value? So these are 1, 3, 4 are the absolute values, whereas these are not. And why just absolute value? We could have any key function that tells us whether they're ordered after you call ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Classic Linked List Algorithm: Ordered Determination and Double-Linked Merging (Linked List Merging)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1. Recursively determine the order of the linked list  `ordered(s, key)`

[![Recursively determine the order of linked lists ordered(s, key) · Classroom blackboard demonstration (00:34:45)](</attachments/cs61a-1c3fd8d9a2863d6ad139e19d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2085)
*⏱ Timestamp: 00:34:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2085)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:34:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If it's the case that s is linked dot empty or s dot rest is linked dot empty, then this thing is definitely ordered. Because it's only got zero or one elements, there's not enough there to be out of order. If it's the case that s dot first is greater than s dot rest dot first, that's the element in...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Classic Linked List Algorithm: Ordered Determination and Double-Linked Merging (Linked List Merging)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def ordered(s, key=lambda x: x):
    """递归检查链表 s 在 key 映射下是否单调非递减。"""
    if s is Link.empty or s.rest is Link.empty:
        return True
    elif key(s.first) > key(s.rest.first):
        return False
    return ordered(s.rest, key)
```

### 2. Pure functional merge  `merge(s, t)`

Input two ordered linked lists and return a new ordered linked list containing all elements of both:

[![Pure functional merge merge(s, t) · Classroom blackboard demonstration (00:36:45)](</attachments/cs61a-dffd4f6a8cc0b52a7953d968.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2205)
*⏱ Timestamp: 00:36:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:36:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2205)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:36:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“t is link.md, but s is not, then I think the merged result should be everything that's in s. Now we know that there are elements in both s and t, so we can compare s.first and t.first. If they're equal, it doesn't really matter what order you put them in, so we'll just put less than or equal, but we...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Classic Linked List Algorithm: Ordered Determination and Double-Linked Merging (Linked List Merging)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def merge(s, t):
    """递归构建合并后的新链表。"""
    if s is Link.empty:
        return t
    elif t is Link.empty:
        return s
    elif s.first <= t.first:
        return Link(s.first, merge(s.rest, t))
    else:
        return Link(t.first, merge(s, t.rest))
```

### 3. Local pointer reconnection and merge  `merge_in_place(s, t)`

[![In-place pointer reconnection and merge merge\_in\_place(s, t) · Classroom blackboard demonstration (00:38:15)](</attachments/cs61a-00470a2a533d96250cb0f168.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2295)
*⏱ Timestamp: 00:38:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P25 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2295)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:38:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“What we need to do is change s, so that s.first is not the same, but s.rest is. What would that look like? Well, instead of returning a new link, we're just going to return s, but we're going to change s.rest to have everything in s.rest and everything in t as part of it. And likewise, if t has the ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Classic Linked List Algorithm: Ordered Determination and Double-Linked Merging (Linked List Merging)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Midterm Comprehensive Problem: Tree Recursion Combining Linked List and Object-Oriented State Maintenance", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Requirements: **Do not allocate any new ones at all  `Link`  node**, just by modifying the existing node's  `rest`  Pointers complete in-place merging (top interview test points):

```python
def merge_in_place(s, t):
    """就地重连节点指针，O(1) 额外空间归并有序链表。"""
    if s is Link.empty:
        return t
    elif t is Link.empty:
        return s
    elif s.first <= t.first:
        s.rest = merge_in_place(s.rest, t)
        return s
    else:
        t.rest = merge_in_place(s, t.rest)
        return t
```

> **The subtlety of the algorithm**:
The basic situation remains unchanged; in the recursive step, we directly change the smaller node's  `rest`  Rebind to the result of subsequent merging, and finally return the current smaller node itself. No need for any auxiliary nodes, elegantly achieved  $O(1)$  Space overhead!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Linked List Classic Algorithm: Ordered Determination and Double-Linked Merging" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Module summary and core test points

1. **Environment graph tracking capabilities**: Faced with slice assignment and aliasing, strictly draw the object frame and arrows, and distinguish between "modifying name binding" and "modifying internal data of the object".
2. **Object-oriented attribute determination**: Keep in mind the backtracking rule of "check the instance first, then the class, then the base class"; when a class method calls an unbound instance, it must be passed manually  `self`.
3. **linked list pointer arithmetic**: Created in a pure function (`Link(...)`) and in-place pointer tampering (`s.rest = ...`) to fully understand the difference in space overhead.

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Module Summary and Core Test Points" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous lecture: Lecture 24 Decomposition](/en/notes/cs61a/lecture-24) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 28 Scheme →](/en/notes/cs61a/lecture-26) | [🎬Watch this lecture on Bilibili (P25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25) |
