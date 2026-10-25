---
kind: notes
source: cs61a/lecture-12
title: "Lecture 12 · Containers: Box-and-Pointer Diagrams and Dictionaries"
description: "CS61A Lecture 12: Containers (Containers, Box Pointer Model and
  Dictionary Abstraction)"
sourceHash: 5e092bdb49ab08d570969cfce782feacf6c521dc0b7ab708e1ce4cc81d9e04ae
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 2: Recursion & Data Abstraction (Recursion & Sequences)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 27:53 ｜ **Classroom screenshots**: 16 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P12)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12)  
> **Quick navigation**: [← Previous Lecture (P11 Lecture 11 Sequences)](/en/notes/cs61a/lecture-11) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P13 Lecture 13 Data Abstraction) →](/en/notes/cs61a/lecture-13)

---

## Table of Contents
1. [Introduction: Closure properties and hierarchical data structures](/en/notes/cs61a/lecture-12#1-introduction-closure-properties-and-hierarchical-data-structures)
2. [Container visualization in environment models: Box-and-Pointer Notation](/en/notes/cs61a/lecture-12#2-container-visualization-in-environment-model-box-and-pointer-notation)
3. [List Slicing: Syntax Specifications and Memory Behavior](/en/notes/cs61a/lecture-12#3-list-slicing-syntax-specifications-and-memory-behavior)
4. [Sequence higher-order aggregation function: `sum`, `max`, `all`](/en/notes/cs61a/lecture-12#4-sequence-higher-order-aggregation-function-sum-max-all)
5. [String abstraction: text sequences and substring retrieval](/en/notes/cs61a/lecture-12#5-string-abstraction-text-sequence-and-substring-retrieval)
6. [Dictionary: Key-value pair mapping system](/en/notes/cs61a/lecture-12#6-dictionary-key-value-pair-mapping-system)
7. [Two iron laws of dictionary keys: uniqueness and hashability (Hashability)](/en/notes/cs61a/lecture-12#7-two-iron-laws-of-dictionary-keys-uniqueness-and-hashability-hashability)
8. [Dictionary comprehension and high-order nested index practice (`index`)](/en/notes/cs61a/lecture-12#8-dictionary-derivation-and-high-order-nested-index-practice-index)
9. [Key points and thinking questions of this lecture](/en/notes/cs61a/lecture-12#9-core-points-and-thinking-questions-of-this-lecture)

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


## 1. Introduction: Closure properties and hierarchical data structures

In the previous lecture, we learned the basic syntax of lists. In this lecture, Professor DeNero starts from computer science classics **algebraic closure properties** Introduced to reveal the fundamental reason why composite data can build infinitely complex reality models.

### 1.1 What is the closure property of composition (The Closure Property)?
> **Closure Property of Data Combination**:   
> A certain data combination method satisfies the closure property if and only if **The results combined by this method can still be used as input to the combination method to further participate in the combination.**.

[![What is the closure property of composition? · Classroom Blackboard Demonstration (00:00:31)](</attachments/cs61a-edac872418f699b4eac3cd40.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=31)
*⏱ Timestamp: 00:00:31 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:00:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=31)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:31)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Box and pointer notation is a way to represent lists within our environment diagrams. So, the reason why we need a notation is that sequential data can actually become quite complicated. And that's because of the closure property. A method for combining data values satisfies this closure property. I...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: Closure properties and hierarchical data structures", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


If we can put integers into a list, and the list itself is a legal data object, then we can **Put a list into another list**.
- This property allows us to construct **Hierarchical Structures**: Large systems are composed of individual components, which themselves are composed of smaller sub-components, nested recursively.
- Almost all complex concepts in the real world (organization tree, file directory system, web page DOM tree, mathematical abstract syntax tree) are based on this.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "1. Introduction: Closure Properties and Hierarchical Data Structures", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Container visualization in environment model: Box-and-Pointer Notation

As data hierarchies become richer, how to accurately and unambiguously track "who contains whom" and "who points to whom" in the environment model? Widely adopted by the computer science community **Box-and-Pointer Diagrams**.

### 2.1 Drawing specifications
1. **The list is drawn as a row of adjacent rectangular boxes**: Each box represents an element slot, and the subscript index is marked above  $0, 1, 2, \dots$.
2. **Primitive Values**: Such as numbers  `3`, Boolean value  `False`, `None`, written directly inside the corresponding box.
3. **Compound Values**: If the element is a composite object such as a list, function, dictionary, etc., **Draw a dot inside the box and draw an arrow (pointer) to accurately point to the target object.**.

[![Drawing specifications · Classroom blackboard demonstration (00:01:36)](</attachments/cs61a-f334a32e581591362f1d9497.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=96)
*⏱ Timestamp: 00:01:36 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:01:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=96)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:36)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And that means that we need a way to keep track of what's inside of what. That's where we use box and pointer notation. Lists are represented in environment diagrams as a row of index labeled adjacent boxes, one per element. Each box either contains a primitive value or points to a compound value. S...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Container visualization in environment model: Box-and-Pointer Notation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 2.2 Environment model example of deeply nested list
Consider the following multi-level nested list:
```python
nested_list = [
    [1, 2],
    [],
    [[3, False, None], [4, lambda: None]]
]
```

[![Environment model example of deeply nested list · Classroom blackboard demonstration (00:02:35)](</attachments/cs61a-4993d92dc4dca704d82a8850.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=155)
*⏱ Timestamp: 00:02:35 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:02:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=155)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:35)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So let's walk through everything that's on the screen. Nested list is a three-element list, and so we see it bound to three adjacent rectangles. Now each element of nested list is actually another list, and so that's why we see pointers to compound values. Lists are compound values, functions are co...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Container visualization in environment model: Box-and-Pointer Notation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```
Global frame
  nested_list ───► [ 0 | 1 | 2 ]  (三元素列表)
                     │   │   │
        ┌────────────┘   │   └──────────────────────┐
        ▼                ▼                          ▼
     [ 0 | 1 ]        [空列表]                  [ 0 | 1 ]
       │   │                                      │   │
       1   2                       ┌──────────────┘   └─────────────┐
                                   ▼                                ▼
                              [ 0 | 1 | 2 ]                      [ 0 | 1 ]
                                │   │   │                          │   │
                                3 False None                       4   * ──► func
```
- Index  `0`  Pointer to a two-element list  `[1, 2]`.
- Index  `1`  points to empty list  `[]`.
- Index  `2`  Pointer to a list containing two sublists. The second innermost element is a function object!
- The box pointer model makes reference sharing, decoupling, and aliasing visible at a glance.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Container visualization in environment model: Box-and-Pointer Notation" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. List slicing: syntax specifications and memory behavior

Slicing is Python's core syntax for extracting subsequences from sequences.

### 3.1 Grammar rules and semi-open intervals
slice expression  `s[start:stop]`  strictly follow  $[start, stop)$  Standards for left closing and right opening:
```python
odds = [3, 5, 7, 9, 11]
sub1 = odds[1:3]  # 选取索引 1 和 2 -> [5, 7]
```
Equivalent to list comprehension: `[odds[i] for i in range(1, 3)]`.

[![Grammar rules and half-open intervals · Classroom blackboard demonstration (00:04:41)](</attachments/cs61a-67ace6dae1fbc97c46e51ce5.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=281)
*⏱ Timestamp: 00:04:41 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:04:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=281)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:41)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And remember, range 1 to 3 gives me 1 and 2, but not 3. OK, so that's one way to select out the 5 and the 7. A sub-list of this list. Slicing is a notation for doing this more compactly. It does the same thing, but without you typing so much. You just write odds, and then in square brackets, you say...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. List Slicing: Syntax Specifications and Memory Behavior", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Border omission rules:
- `s[:stop]`: Omit the starting point and default to the index  `0`  Start. For example  `odds[:3] -> [3, 5, 7]`.
- `s[start:]`: Omit the end point and extend to the end. For example  `odds[1:] -> [5, 7, 9, 11]`.
- `s[:]`: Omit both ends to generate a copy containing all elements of the original list.

### 3.2 Core law of memory behavior: slicing always creates new objects
**In the environment model, the slicing operation must allocate a new memory space and generate an independent new list instance.**! The values ​​of the original list will never be modified by the slicing operation.

```python
digits = [1, 8, 2, 8]
a = digits[:1]  # [1] (新列表)
b = digits[1:3] # [8, 2] (新列表)
c = digits[2:]  # [2, 8] (新列表)
```
After execution, there are 4 independent list objects in the global environment!

[![Core law of memory behavior: slicing always creates new objects · Classroom blackboard demonstration (00:05:44)](</attachments/cs61a-00401cd6b8e100be0add6c40.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=344)
*⏱ Timestamp: 00:05:44 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:05:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=344)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:44)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And you can even skip the beginning and the end, and you get back all of the elements in the original list. So these square brackets for the colon inside are called a slicing operator. Slicing always creates new values. So here are some examples. I have digits, which is a list, and then I slice it t...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. List Slicing: Syntax Specifications and Memory Behavior", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. List Slicing (Slicing): Syntax Specification and Memory Behavior" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Sequence higher-order aggregation function: `sum`, `max`, `all`

Python provides several out-of-the-box higher-order aggregate functions to fold/aggregate iterable sequences into a single value.

### 4.1 `sum(iterable, start=0)`  Advanced usage of
Square brackets in the official signature indicate optional parameters: `sum(iterable[, start])`.
- By default  `start=0`, calculate the numerical accumulation: `sum([2, 3, 4]) -> 9`.
- Pass in custom  `start`: `sum([2, 3, 4], 5) -> 14`.

[![Advanced usage of sum(iterable, start=0) · Classroom blackboard demonstration (00:07:14)](</attachments/cs61a-e652acf569e238d6656a59ef.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=434)
*⏱ Timestamp: 00:07:14 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:07:14)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=434)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:14)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, this notation doesn't actually mean you write square brackets when you call it. Instead, this is something that's used in Python docs to say that the second argument is optional. So you can call sum with just one argument, a list, and it will sum the values, or you can call it with two argument...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Sequence higher-order aggregation function: `sum`, `max`, `all`”, the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


**Black magic: exploit  `sum`  Flattening multi-level lists (Flattening)**:
Because list addition  `+`  Represents splicing, if we set the initial basis to an empty list  `[]`: 
```python
nested = [[2, 3], [4]]
flat = sum(nested, [])
# 计算步骤: [] + [2, 3] + [4] -> [2, 3, 4]
```
This is a minimalist multidimensional sequence flattening trick in Python!

[![Calculation steps: "" + "2, 3" + "4" -\> "2, 3, 4" · Classroom blackboard demonstration (00:08:19)](</attachments/cs61a-e3df694ad79bac20f2830734.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=499)
*⏱ Timestamp: 00:08:19 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:08:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=499)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:19)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, why is that useful? Well, let's say you're adding together values that aren't just numbers. You have to provide a value of that type in order to get started. So remember that I can add two and three the list to four the list, and I get a longer list. Well, in the same way, I can sum a list cont...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Sequence higher-order aggregation function: `sum`, `max`, `all`”, the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 4.2 `max`  with the projected key function (`key=fn`)
`max`  Not only can raw values be compared, but also allowed to be passed in  `key`  Function to find the value based on the transformed projection value of the element:
```python
# 寻找抛物线 f(x) = 7 - (x - 4) * (x - 2) 在区间 [0, 9] 上的最大值点
peak_x = max(range(10), key=lambda x: 7 - (x - 4) * (x - 2))
# 输出 3 (因为当 x=3 时，表达式取得局部峰值 8)
```
Note: `max`  The final return is **the original element in the sequence  `3`**, rather than its calculated function value  `8`!

[![Output 3 (because when x=3, the expression obtains a local peak value 8) · Classroom Blackboard Demonstration (00:09:52)](</attachments/cs61a-b341278bf0132515b717dfd0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=592)
*⏱ Timestamp: 00:09:52 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:09:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=592)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:52)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Or I could have said max one, two, three, four with a zero at the beginning, and that would have done the same thing. Now, what's going on with this key function? Well, the documentation didn't tell me, but what happens is that it applies a function to every element that you're considering and actua...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Sequence higher-order aggregation function: `sum`, `max`, `all`”, the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 4.3 `all`  with  `any`:Boolean context summary
- `all(iterable)`: Returns if and only if each element in the sequence is true in a Boolean context  `True`;Short-circuit and return immediately when encountering any false value  `False`. Return empty sequence  `True`.
- `any(iterable)`: Returns as long as there is a true value  `True`.

```python
all([x < 5 for x in range(5)])  # True
all([0, 1, 2, 3])                # False (0 是假值)
```

[![all and any: Boolean context summary · Classroom blackboard demonstration (00:11:32)](</attachments/cs61a-e788ccc055eca5356385ba2d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=692)
*⏱ Timestamp: 00:11:32 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:11:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=692)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:32)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Well, bool tells me whether a value is true or false. So 5 is a true value. True, of course, is a true value as well. Even negative 1 is a true value. But 0 is not a true value. It's a false value. Likewise, hello is a true value. And an empty string is a false value. We learned about these when we ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Sequence higher-order aggregation function: `sum`, `max`, `all`”, the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "4. Sequence higher-order aggregation function: `sum`, `max`, `all` In the module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. String abstraction: text sequence and substring retrieval

### 5.1 String literals and escape characters
Strings are computer abstractions that represent human language and symbolic text.
- single quote  `'...'`  with double quotes  `"..."`  Completely equivalent in functionality.
- triple quotes  `"""..."""`  Able to span multiple lines, often used in documentation strings (docstrings).
- escape character  `\`: merged with the following characters into a single symbol, such as  `\n`  Represents line feed (ASCII Linefeed).

[![String literals and escape characters · Classroom blackboard demonstration (00:14:44)](</attachments/cs61a-ec299cafc7ac0d72da7762ac.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=884)
*⏱ Timestamp: 00:14:44 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:14:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=884)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:44)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“I can use double quotes, and they're the same, except for that if you put an apostrophe in the middle of a double-quoted string, it works out fine. But if you do that in the middle of a single-quoted string, well, then it would end the string. You don't have to just put English characters in the str...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. String abstraction: text sequence and substring retrieval", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 5.2 Subtle differences between strings and lists
Although strings are also sequences (supporting  `len()`  with index  `s[i]`), but differs from lists in two mechanical ways:
1. **Index return value type**: Taking the subscript from the list will get the element itself; while taking the subscript from the string will get **substring of length 1** (There are no separate characters in Python  `char`  type).
2. **member operator  `in`  subsequence matching**: 
   - In the list: `[1, 2] in [1, 2, 3]`  Return  `False` (The list only searches the top single element).
   - In string: `'here' in 'where'`  Return  `True` (String support **Continuous substring pattern matching**).

[![Subtle differences between strings and lists · Classroom blackboard demonstration (00:16:42)](</attachments/cs61a-8d9e44cb62d589c9ae3dedab.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1002)
*⏱ Timestamp: 00:16:42 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:16:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1002)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:42)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“You get a string, but with only one element, only one character in it. In and not in are a little bit different for strings than they are with other sequence types. So, instead of looking for only individual letters inside this sequence of letters, you can look for whole words. So if I say is here a...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. String abstraction: text sequence and substring retrieval", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. String Abstraction: Text Sequence and Substring Retrieval" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Dictionary: key-value pair mapping system

Lists map consecutive integer indices to values, whereas **dictionary (`dict`)**  Provides universal, arbitrary custom key-based **Associative Mapping**.

### 6.1 Dictionary literals and key lookup
Dictionaries use curly braces  `{key: value, ...}`  Statement:
```python
numerals = {'I': 1, 'V': 5, 'X': 10}
val = numerals['V']  # 5
```

[![Dictionary literals and key search · Classroom blackboard demonstration (00:18:38)](</attachments/cs61a-b29df0499096004ae28f2141.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1118)
*⏱ Timestamp: 00:18:38 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:18:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1118)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:38)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But it didn't have to be that way. You could use numbers or strings as keys or values. Once I've created numerals, the most common operation I'll perform is to lookup a particular value based on its key. Now with dictionaries, we're using the same item lookup syntax as we would for a list, but we ca...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Dictionary: key-value mapping system", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **One-way search**: Dictionaries can only retrieve values by key; keys cannot be looked up directly by value.
- **Non-existent key throws exception**: If querying a key that does not exist (such as  `numerals['C']`), the interpreter will throw  `KeyError`.

### 6.2 Dictionary sequence perspective
The dictionary itself is a **All keys are sequences of elements**: 
- `for k in numerals:`  All keys are traversed.
- `numerals.values()`:return  `dict_values`  A view object that provides a sequence view of all values.
- `numerals.items()`:returned by  `(key, value)`  A sequence of key-value pairs composed of tuples.

[![Dictionary Sequence Perspective · Classroom Blackboard Demonstration (00:20:28)](</attachments/cs61a-78f6b987212fca3ccaeea628.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1228)
*⏱ Timestamp: 00:20:28 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:20:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1228)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:20:28)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“You could call list on numerals.values, and that would give you a regular old list instead of a dict values, which is a special kind of sequence only related to dictionaries, much like a range is a special kind of sequence only related to integers. Dictionaries can be constructed with no elements, o...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Dictionary: key-value mapping system", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Dictionary (Dictionary): Key-value Mapping System" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Two iron laws of dictionary keys: uniqueness and hashability (Hashability)

The values of a dictionary can be of any complex type (list, function, or even nested dictionary), but **Dictionary keys are subject to strict technical and logical restrictions**: 

[![Two iron laws of dictionary keys: uniqueness and hashability (Hashability) · Classroom blackboard demonstration (00:22:23)](</attachments/cs61a-6dc071307fe6fdd7a71be35b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1343)
*⏱ Timestamp: 00:22:23 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:22:23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1343)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:22:23)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Cannot be a list or a dictionary. This gives me an error, unhashable type list. Unhashable is a technical term in computer science that I wish I could teach you about, but I have to leave something for 61B so you'll learn about it there, or you can read about it on the internet. The reason I reached...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Two iron laws of dictionary keys: uniqueness and hashability (Hashability)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Iron Rule 1: Unique Keys
In a dictionary, each key can correspond to at most one value at any time. If assigned repeatedly:
```python
d = {'one': 1, 'one': 'first'}
# d 仅保留 {'one': 'first'}
```
If you want a key to be associated with multiple data items, you must explicitly define the value as a list or tuple.

### Iron Rule 2: Keys must be immutable hashable objects (Hashable)
**list (`list`) and dictionary (`dict`) must not be used as a dictionary key!**
```python
bad_dict = { [1, 2]: 'val' }
# 触发报错: TypeError: unhashable type: 'list'
```
> **Principle perspective**: Python dictionary underlying dependencies **Hash Table**  realize  $O(1)$  Constant level extremely fast query. If the key is mutable (for example, the list content is modified at runtime), then its hash value and storage slot will change, causing the element to be lost forever in the underlying hash bucket. Therefore, only hashable types such as numbers, strings, and immutable tuples are eligible as keys.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "7. Two iron laws of dictionary keys: uniqueness and hashability (Hashability)", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 8. Dictionary derivation and high-order nested index practice (`index`)

### 8.1 Dictionary derivation grammar specifications
Similar to list comprehensions, dictionary comprehensions provide a powerful means of declaratively generating mapping tables:
```python
{<key_expr>: <val_expr> for <name> in <iter_expr> if <filter_expr>}
```

[![Dictionary derivation grammar specifications · Classroom blackboard demonstration (00:24:43)](</attachments/cs61a-c5f1ad4e8212a53b635a99f4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1483)
*⏱ Timestamp: 00:24:43 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:24:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1483)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:43)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“In the iterable value that you get by evaluating this iteration expression, you bind the name to the element in the new frame from step one. So name now has a value, one of the values in this sequence. And then if filter expression evaluates to a true value, add to the result dictionary an entry tha...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "8. Dictionary derivation and high-order nested index practice (`index`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


For example, filter for numbers greater than 2 and key by their square:
```python
squares = {x * x: x for x in [1, 2, 3, 4, 5] if x > 2}
# 结果: {9: 3, 16: 4, 25: 5}
```

---

### 8.2 Comprehensive topic: Constructing a group matching inverted index (`index`)
Write function  `index(keys, values, match)`: Given a key sequence, a value sequence and a two-parameter decision function  `match(k, v)`, returns a dictionary such that each key maps to a list of all matching values.

**Example requirements**: Change the positive integer key  `[7, 9, 11]`  map to interval  `range(30, 50)`  A list of all multiples of the key that are divisible by the key.

[![Comprehensive topic: Constructing a group matching inverted index (index) · Classroom blackboard demonstration (00:27:05)](</attachments/cs61a-67484da08eab494f0d94a62f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1625)
*⏱ Timestamp: 00:27:05 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P12 00:27:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1625)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:27:05)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So this is meant to return a dictionary in which 7 the key corresponds to a list of all the multiples of 7 within this range. And so on for 9 and 11. This is a natural application of a dictionary comprehension, where in fact the keys we want are just provided to us in the keys list. So there isn't a...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "8. Dictionary derivation and high-order nested index practice (`index`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Dictionary key value search, Box-and-Pointer diagram", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


#### Elegant one-line solution (dictionary comprehension nested list comprehension):
```python
def index(keys, values, match):
    """
    >>> match = lambda k, v: v % k == 0
    >>> index([7, 9, 11], range(30, 50), match)
    {7: [35, 42, 49], 9: [36, 45], 11: [33, 44]}
    """
    return {k: [v for v in values if match(k, v)] for k in keys}
```
- The outer dictionary comprehension traverses all  `k in keys`.
- The inner list comprehension traverses all  `v in values`, using closures to simultaneously capture the current key  `k`  with candidate values  `v`, by  `match(k, v)`  Perform filtering! The code is pure and concise, without any redundant state variables.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "8. Dictionary derivation and advanced nested index practice (`index`)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 9. Core points and thinking questions of this lecture

### Refining key rules
1. **Closure property is the source of hierarchy**: The combined data can continue to participate in the combination, forming the cornerstone of tree and complex graph structures.
2. **Box pointer chart is a useful tool for avoiding pitfalls**: In the face of multiple nesting, the box represents the container slot and the arrow represents the object reference, which can completely clarify the shallow copy and deep structure.
3. **Slicing creates new objects**: Slices always copy and generate new list instances and never truncate in place on the original list.
4. **Hashability constraints lock dictionary keys**: Dictionary provided  $O(1)$  The cost of searching is that the key must be immutable (it is strictly forbidden to use mutable lists as keys).

---

### After-class self-assessment exercises

#### Exercise 1: Dictionary key-value flipping
Given a dictionary  `d`, assuming that all values in it are also hashable and distinct from each other. Write a line of dictionary comprehension to achieve key-value reversal (change the original key into a value, and the original value into a key):
```python
def invert(d):
    """
    >>> invert({'a': 1, 'b': 2})
    {1: 'a', 2: 'b'}
    """
    return {v: k for k, v in d.items()}
```

#### Exercise 2: Word length grouping
Given a list of words in a text, use a dictionary to group words by their letter length:
```python
def group_by_len(words):
    """
    >>> group_by_len(['to', 'be', 'or', 'not', 'that'])
    {2: ['to', 'be', 'or'], 3: ['not'], 4: ['that']}
    """
    lengths = set(len(w) for w in words)
    return {length: [w for w in words if len(w) == length] for length in lengths}
```
The nested combination of derivation makes complex data reorganization and classification easy to do!

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "9. Core Key Points and Questions of This Lecture" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous Lecture: Lecture 11 Sequences](/en/notes/cs61a/lecture-11) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 13 Data Abstraction →](/en/notes/cs61a/lecture-13) | [🎬Watch this lecture on Bilibili (P12)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12) |
