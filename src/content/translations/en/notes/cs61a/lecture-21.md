---
kind: notes
source: cs61a/lecture-21
title: Lecture 21 · Representation and Polymorphic Interfaces
description: "CS61A Lecture 21: Object Representation and Polymorphic Interface
  (Representation)"
sourceHash: 56706c27609ac2566afc752f7f96db020f3db316a2fcf04308261e6057c4fc07
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 30:31 ｜ **Classroom screenshots**: 17 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21)  
> **Quick navigation**: [← Previous Lecture (P20 Lecture 20 Inheritance)](/en/notes/cs61a/lecture-20) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P22 Lecture 22 Composition) →](/en/notes/cs61a/lecture-22)

---

## 1. Core mental model and architecture diagram

One of the core principles of object-oriented metaphor: **The object should behave like the real data it represents**. Crucially, the object must be able to serialize or format itself into a string.

In Python, string representation is explicitly decoupled into two forms aimed at different audiences:

```
                                    ┌───────────────────────┐
                                    │      Python Object    │
                                    └───────────┬───────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
        ┌─────────────────────────────┐                   ┌─────────────────────────────┐
        │        Canonical / 机器     │                   │       Human / 用户友好       │
        │           repr(obj)         │                   │           str(obj)          │
        ├─────────────────────────────┤                   ├─────────────────────────────┤
        │ • 受众：解释器与开发者      │                   │ • 受众：终端用户与 UI 呈现  │
        │ • 目标：eval(repr(x)) == x  │                   │ • 目标：易读、贴近自然语言  │
        │ • 触发：REPL 交互式输出     │                   │ • 触发：print(x)、f-string  │
        │ • 底层：type(x).__repr__(x) │                   │ • 底层：type(x).__str__(x)  │
        └─────────────────────────────┘                   └─────────────────────────────┘
```

Additionally, Python passes  **Special Methods/Dunder Methods**  Establishes a correspondence between syntax and underlying messaging, enabling custom classes to elegantly support operator overloading (such as  `+`), Boolean conversion and type distribution.

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


## 2. Canonical representation vs human-readable representation (repr vs str)

[![Canonical representation vs human-readable representation (repr vs str) · Classroom blackboard demonstration (00:01:15)](</attachments/cs61a-bfe38ff9de2e3bee23303bbe.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)
*⏱ Timestamp: 00:01:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, a lot of times, the str and repper string are the same, because Python was designed to be a language that people could read, and so, a lot of the expressions have exactly the same form as a person might write down when they try to communicate the same idea. You write the number 1 in either case...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Canonical representation vs human-readable representation (repr vs str)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Canonical string representation: repr

built-in functions  `repr(object)`  return object **Canonical Representation**: 

[![Standard string representation: repr · Classroom blackboard demonstration (00:02:45)](</attachments/cs61a-bd08283641829c693194933c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)
*⏱ Timestamp: 00:02:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The result of calling repr on a value is exactly what you see in an interactive session. It's what Python prints out right below the expression you evaluated. So if I evaluate this expression, which represents 12 times 10 to the 12th power, the canonical string representation is 1 and then 2 and the...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Canonical representation vs human-readable representation (repr vs str)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **official contract**: For most built-in and commonly used types, `eval(repr(object))`  Should evaluate to a new object that is equivalent to the original object.
- **Presentation time**: After directly entering an expression in the interactive Python REPL and pressing Enter, the console displays the object through  `repr()`  Processed results.

> **Exceptions**: For built-in functions such as  `min`  Or custom classes and other complex objects that cannot be completely reconstructed with a single literal expression, Python will fall back to using proxy strings in the form of angle brackets, such as  `<built-in function min>`.

### Human readable string representation: str

built-in functions  `str(object)`  Returns a human-readable description:

[![Human-readable string representation: str · Classroom blackboard demonstration (00:04:15)](</attachments/cs61a-52d846317f76cde9d8255168.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)
*⏱ Timestamp: 00:04:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Human interpretal strings are useful as well, and so we'd like to have our programs be able to generate them, because oftentimes the program wants to communicate something with the user. So here's an example. There's a fractions module, part of the standard library, and it has a fraction class. A fr...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Canonical representation vs human-readable representation (repr vs str)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **target**: Clear, common sense, and not guaranteed to be re-evaluable by the Python parser.
- **Presentation time**: call  `print(object)`  When, the console output is the object's  `str()`.

### Classic comparison: Fraction (fractional category)

[![Classic comparison: Fraction · Classroom blackboard demonstration (00:05:45)](</attachments/cs61a-f0799bc72a9c79790e505137.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)
*⏱ Timestamp: 00:05:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The str string of half is 1 divided by 2. Now, if I evaluate the repper string of half, I get the fraction. It's a different object, but it's this equivalent, right? If I evaluate the str string of half, in this case, it turns out that is a valid Python expression, but that's just kind of coincidenc...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Canonical representation vs human-readable representation (repr vs str)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
from fractions import Fraction

half = Fraction(1, 2)

# repr 返回标准可求值表达式
repr(half)  # 'Fraction(1, 2)'
eval(repr(half)) == half  # True

# str 返回人类习惯的排版形式
str(half)   # '1/2'
print(half) # 控制台输出: 1/2
```

### The quoting mechanism of the string object itself

Called on the string itself  `repr`  with  `str`  Reflecting subtle but essential differences:

[![The quotation mark mechanism of the string object itself · Classroom blackboard demonstration (00:07:15)](</attachments/cs61a-239e241e09563c9f9f59b299.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)
*⏱ Timestamp: 00:07:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“It's just S. Now, what happens if I just call repr of S? I see quotes within quotes. What's going on there? Well, what repr is giving me is a string, where if I evaluated it, I'd get back the original string. And what if I called the repr of the repr of the repr of S? I'd get a mess. What's going on...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Canonical representation vs human-readable representation (repr vs str)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
s = "Hello, world"

print(s)        # 输出: Hello, world (str 表现形式，无外层引号)
print(repr(s))  # 输出: 'Hello, world' (repr 带有合法字符串字面量所需的外层引号)

eval(repr(s))   # 得到字符串 "Hello, world"
# 若直接 eval(s)，由于缺少引号会将 Hello 视作变量名而抛出 NameError！
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Canonical representation vs human-readable representation (repr vs str)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. F-Strings and String Interpolation

F-string (formatted string literal) is the most elegant and efficient string interpolation syntax in Python:

[![F-Strings and String Interpolation · Classroom Blackboard Demonstration (00:08:45)](</attachments/cs61a-bf08f1c8dbd17196bdadd634.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)
*⏱ Timestamp: 00:08:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“String interpolation involves evaluating a string literal, so that's some text in quotation marks, but which also contains expressions, and those expressions are evaluated and become part of the string. And string interpolation is used whenever you want to build a string that involves some predefine...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. F-Strings and String Interpolation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- prefix character  `f`  Tells the interpreter to perform string interpolation;
- curly braces  `{...}`  The expression in **current environment frame** Medium dynamic evaluation;
- By default, the embedded result automatically calls the  `str()`  method.

[![F-Strings and String Interpolation · Classroom Blackboard Demonstration (00:10:45)](</attachments/cs61a-6042e4b3916166f9e1285b13.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Anything you could build with concatenation, you could also build with string interpolation. So here's an F string. This is just contents. 2 plus 2 equals 2 plus 2 would be evaluated just like a normal string. But if I include curly braces around some part of this, now this is treated as a Python ex...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. F-Strings and String Interpolation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
from math import pi

# 传统拼接 vs f-string
f"pi starts with {pi}..."  # 'pi starts with 3.141592653589793...'

# 花括号内支持任意合法 Python 表达式
f"2 + 2 = {2 + 2}"  # '2 + 2 = 4'
```

### Interpolation rules and side effects of F-Strings

[![Notes on interpolation rules and side effects of F-Strings · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-7ac9c9a5af6a54cfe7fbefcc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“What happens when you build an F string? Half of a half is half times half. You get the str string, not the rep string. If you really wanted the rep string, you could just call rep on this, and then you get it. And evaluation of sub-expressions is just like anywhere else in Python. They may have sid...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. F-Strings and String Interpolation", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


1. **The default is str()**: 
   ```python
   half = Fraction(1, 2)
   f"The value is {half}"        # 'The value is 1/2' (采用 str)
   f"The value is {repr(half)}"  # 'The value is Fraction(1, 2)' (显式转 repr)
   ```
2. **Sequential evaluation of expressions and side effects**: 
   ```python
   s = [9, 8, 7]
   # 表达式自左向右严格依次求值
   result = f"{s.pop()}, {s.pop()}, remaining: {s}"
   # result: '7, 8, remaining: [9]'
   ```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. F-Strings and String Interpolation" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Polymorphic Functions & Interfaces

**Polymorphic Function**  Refers to a general function that can act on many different data types. `repr()`  with  `str()`  It is the most typical polymorphic function.

[![Polymorphic Functions & Interfaces · Classroom Blackboard Demonstration (00:14:15)](</attachments/cs61a-e8ff148769f5b960c44008ff.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)
*⏱ Timestamp: 00:14:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So, repr in particular just invokes a zero argument method called underscore underscore repr underscore underscore on its argument in order to get the repr string that it returns. So, I can call repr on half, which is the fraction one two, or I can invoke its method. Invoking the method gets looked ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Polymorphic Functions & Interfaces", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### The core mechanism behind polymorphism: delegate parameters themselves

Polymorphic functions themselves rarely need to contain complex  `if-else`  branch, it simply **Send a message to the passed argument object**, the delegate argument determines how to respond:

- `repr(x)`  entrusted to  `x`  of  `__repr__`  method;
- `str(x)`  entrusted to  `x`  of  `__str__`  method.

### Going deep into the bottom layer: safe implementation of repr and str

Python implements it under the hood  `repr`  time, will **Strictly ignore the  `__repr__`, only look for those in class attributes  `__repr__`**: 

[![Going deep into the bottom layer: safe implementation of repr and str · Classroom blackboard demonstration (00:16:15)](</attachments/cs61a-a1a47bcea5b9348787d2afc3.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)
*⏱ Timestamp: 00:16:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“How would I implement that? So which of the following function definitions corresponds to a function repper that takes in some argument, looks at the class attribute called underscore underscore repper, and invokes it? Here are five options. Only one does what I described. Think about it for a minut...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Polymorphic Functions & Interfaces", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def repr(x):
    """底层模型：忽略实例属性，强制通过类查找方法并显式传入 self 实参。"""
    return type(x).__repr__(x)
```

> **Fallback mechanism**:
If a class is not explicitly defined  `__str__`, call  `str(x)`  Will automatically roll back the call  `__repr__(x)`. Therefore, when writing a custom class **Prioritize implementation  `__repr__`**  Can meet both needs at the same time.

### What is an interface?

[![What is an interface? · Classroom blackboard demonstration (00:17:45)](</attachments/cs61a-ccc25fe18289c8790352c472.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)
*⏱ Timestamp: 00:17:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:17:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“It's only if you explicitly make them different that they differ. We're using an important idea here. It's called an interface. So, when I talked about object-oriented programming in the first place, I said that the central to this metaphor was that objects would pass messages to each other, and tha...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Polymorphic Functions & Interfaces", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


**interface** It is a set of agreed messages (method names) and their semantic specifications.
- As long as a class implements  `__repr__`  and  `__str__`  Method, it implements the "String Representation Interface";
- This mechanism enables Python's entire ecosystem (REPL, logging, formatting tools) to seamlessly handle any newly created custom types.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Polymorphic Functions & Interfaces" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Customized Ratio class practice: implementing the presentation interface

Implement a precise rational number (Ratio) class to display standardized  `__repr__`  with  `__str__`  Writing paradigm:

[![Customized Ratio class practice: implementing presentation interface · Classroom blackboard demonstration (00:19:35)](</attachments/cs61a-1d7ead302582364b85c63384.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)
*⏱ Timestamp: 00:19:35 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:19:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:19:35)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If we want instances of the ratio class to be able to display themselves, we need to define a repar method. It will return a string, the string ratio, followed by parentheses. Here, we have two different gaps within our string that we fill in using the format method on strings. self.numer fills into...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Customized Ratio class practice: implementing the presentation interface", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class Ratio:
    """表示有理数的类，具有清晰的表示接口。"""
    def __init__(self, n, d):
        self.numer = n
        self.denom = d

    def __repr__(self):
        """返回形如 Ratio(1, 2) 的规范表达式字符串。"""
        return f"Ratio({self.numer}, {self.denom})"

    def __str__(self):
        """返回形如 1/2 的人类可读排版字符串。"""
        return f"{self.numer}/{self.denom}"

half = Ratio(1, 2)
print(repr(half))  # Ratio(1, 2)
print(str(half))   # 1/2
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Customized Ratio Class Practice: Implementing Presentation Interface" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Special Method Names

In Python, all methods starting and ending with a double underscore are collectively called **Special Methods/Dunder Methods**. They map the built-in language syntax into class method calls.

[![Special Method Names · Classroom Blackboard Demonstration (00:21:45)](</attachments/cs61a-be93bf1ff09a573e48cf281d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)
*⏱ Timestamp: 00:21:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:21:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Other than that, it's just a regular method. Repr was discussed in the previous videos. It's the method that gets invoked in order to produce a string that represents an object, and it's the one that's used in an interactive Python session to display the value. What about add? Well, that's a new one...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Special Methods and Operator Overloading (Special Method Names)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


| special method | Corresponding syntax/built-in functions | functional semantics |
| :--- | :--- | :--- |
| `__init__(self, ...)` | `Ratio(1, 2)` | Instance construction and initialization |
| `__repr__(self)` | `repr(x)`, interactive REPL | Generate canonical Python code strings |
| `__str__(self)` | `str(x)`, `print(x)` | Generate user-friendly description strings |
| `__bool__(self)` | `bool(x)`, `if x:` | Determine the truth conditions of an object |
| `__float__(self)` | `float(x)` | Convert to floating point value |
| `__add__(self, other)` | `self + other` | Addition operator (current object is on the left) |
| `__radd__(self, other)` | `other + self` | Reverse addition operator (current object is on the right) |

[![Special Method Names · Classroom Blackboard Demonstration (00:23:45)](</attachments/cs61a-44d622d20331149e206233e0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)
*⏱ Timestamp: 00:23:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:23:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So what happens when you have two instances of user-defined classes added together? Well, what happens is that you invoke either add or there's another method called radd. I'll tell you about that in a moment. And that actually performs the addition. Again, we're just asking the objects, how do you ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Special Methods and Operator Overloading (Special Method Names)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Addition operator overloading mechanism

When evaluating an expression  `a + b`  When:
1. Prioritize trying to call  `type(a).__add__(a, b)`; 
2. If  `a`  The method is not implemented or returns  `NotImplemented`, then try to call the reverse addition of the object on the right  `type(b).__radd__(b, a)`.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Special Method and Operator Overloading (Special Method Names)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Type Dispatching vs Type Coercion

In order to make customized  `Ratio`  The class can perform mixed addition operations with integers and floating point numbers, and needs to handle cross-type interactions:

[![Type Dispatching vs Type Coercion · Classroom Blackboard Demonstration (00:26:15)](</attachments/cs61a-7ba25b2c52f6e9a1e6464c09.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)
*⏱ Timestamp: 00:26:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:26:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“of n divided by g and d divided by g. And what's the greatest common divisor? We did talk about this earlier in the course. One way to compute it is to say, while n does not equal d, we rebind n and d to be, in no particular order, the min of n and d and the absolute value of n minus d. So now we ca...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Type Dispatching vs Type Coercion", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Type Dispatching vs Type Coercion · Classroom Blackboard Demonstration (00:28:45)](</attachments/cs61a-4ab03b655e4be046da440068.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)
*⏱ Timestamp: 00:28:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:28:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“As addition for this class, at which point I can add ratios, I can add integers to ratios in either direction, and I've fulfilled the interface for adding addition to a user-defined class in the Python language. Now, what happens if we add a floating point value? 0.345. Well, then this result will n...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Type Dispatching vs Type Coercion", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Type Dispatching vs Type Coercion · Classroom Blackboard Demonstration (00:30:05)](</attachments/cs61a-394b74ef04223700e635c53f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)
*⏱ Timestamp: 00:30:05 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P21 00:30:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:30:05)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And here, this is called type coercion, which is when you take an object of one type, convert it into another type, in order to be able to combine it with some other value. These are two strategies that people use in order to have different classes interact. You know, add is a two-argument method, a...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Type Dispatching vs Type Coercion", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: in "__repr__  formal representation vs.  __str__  In the test questions related to "Human Readable Strings, Special Method Distribution", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Comprehensive implementation code

```python
def gcd(n, d):
    """欧几里得最大公约数算法。"""
    while d != 0:
        n, d = d, n % d
    return n

class Ratio:
    def __init__(self, n, d):
        g = gcd(n, d)
        self.numer = n // g
        self.denom = d // g

    def __repr__(self):
        return f"Ratio({self.numer}, {self.denom})"

    def __str__(self):
        return f"{self.numer}/{self.denom}"

    def __float__(self):
        return self.numer / self.denom

    def __add__(self, other):
        # 策略 1：类型分发 (Type Dispatching) - 检查类型并采取不同计算逻辑
        if isinstance(other, int):
            n = self.numer + self.denom * other
            return Ratio(n, self.denom)
        elif isinstance(other, Ratio):
            n = self.numer * other.denom + self.denom * other.numer
            d = self.denom * other.denom
            return Ratio(n, d)
        # 策略 2：类型强转 (Type Coercion) - 将自身转为通用类型（float）后再计算
        elif isinstance(other, float):
            return float(self) + other
        return NotImplemented

    # 右加支持：加法满足交换律，直接复用 __add__
    __radd__ = __add__
```

### Comparison of two cross-type design strategies

1. **Type Dispatching**: 
   - Pass  `isinstance(other, int)`  Detect operand types and execute specialized code paths for specific types.
   - **Advantages**: capable of accurately preserving mathematical precision (e.g.  `Ratio(1, 3) + 1`  return exact  `Ratio(4, 3)`).
2. **Type Coercion**: 
   - When encountering higher-order but incompatible types (such as  `float`), pass  `float(self)`  Convert this object to this type and delegate it to built-in floating point operations.
   - **Advantages**: Highly versatile, avoids writing tedious branches for every possible type.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "7. Type Dispatching vs Type Coercion" module, the underlying computer operations rely on strict formal evaluation logic:
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

1. **repr vs str contract**: `repr`  Program and debugging oriented (try to be  `eval`), `str`  Oriented to human aesthetics; `str`  Automatically falls back to when missing  `repr`.
2. **How to find security specifications**: `repr`  Direct read with special method lookup  `type(obj)`, to prevent instance attribute shadowing from damaging system protocols.
3. **Interfaces and polymorphism**: The object system achieves seamless connection between syntax and object-oriented features through unified protocol naming (Dunder Methods).

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
| [← Previous lecture: Lecture 20 Inheritance](/en/notes/cs61a/lecture-20) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 22 Composition →](/en/notes/cs61a/lecture-22) | [🎬Watch this lecture on Bilibili (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21) |
