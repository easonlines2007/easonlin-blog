---
kind: notes
source: cs61a/lecture-15
title: "Lecture 15 · Mutability: Aliasing and Persistent Local State"
description: "CS61A Lecture 15: Mutability (mutability, object aliases and local
  persistent state)"
sourceHash: 15848513cab13195aef243a5217b2f28fc9add9e49e3eb708177879ba20d2bc7
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 2: Recursion & Data Abstraction (Recursion & Sequences)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 37:58 ｜ **Classroom screenshots**: 16 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15)  
> **Quick navigation**: [← Previous Lecture (P14 Lecture 14 Trees)](/en/notes/cs61a/lecture-14) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next Lecture (P16 Lecture 16 Iterators) →](/en/notes/cs61a/lecture-16)

---

## Table of Contents
1. [Introduction: The Metaphor of Objects—The Symbiosis of Data and Behavior](/en/notes/cs61a/lecture-15#1-introduction-metaphor-of-objects---the-symbiosis-of-data-and-behavior)
2. [A brief history of character encoding: from the ASCII 7-bit matrix to the Unicode universe](/en/notes/cs61a/lecture-15#2-a-brief-history-of-character-encoding-from-ascii-7-bit-matrix-to-unicode-universe)
3. [The Birth of Mutability: The Evolution of Playing Cards and In-Place Mutation of Lists](/en/notes/cs61a/lecture-15#3-the-birth-of-variability-evolutionary-history-of-playing-cards-and-in-situ-mutation-of-lists)
4. [Key anomalies in environment models: Aliasing](/en/notes/cs61a/lecture-15#4-key-anomalies-in-environment-models-aliasing)
5. [Dictionary mutability operations and scope penetration](/en/notes/cs61a/lecture-15#5-dictionary-mutable-operations-and-scope-penetration)
6. [Immutable Sequences: The Security Line of Tuples](/en/notes/cs61a/lecture-15#6-immutable-sequence-the-security-line-of-tuples)
7. [A watershed in computer philosophy: identity (`is`) and equality (`==`)](/en/notes/cs61a/lecture-15#7-a-watershed-in-computer-philosophy-identity-is-and-equality-)
8. [The infamous classic trap: Mutable Default Arguments](/en/notes/cs61a/lecture-15#8-the-infamous-classic-trap-mutable-default-arguments)
9. [The intersection of functional and state: persistent local state in closures (`make_withdraw`)](/en/notes/cs61a/lecture-15#9-the-blend-of-functional-expression-and-state-persistent-local-state-in-closures-make_withdraw)
10. [Key points and thinking questions of this lecture](/en/notes/cs61a/lecture-15#10-core-points-and-thinking-questions-of-this-lecture)

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


## 1. Introduction: Metaphor of objects - the symbiosis of data and behavior

In software engineering, **Object**  It is an abstract mechanism that enables computer data to "simulate the behavior of real-world concepts."

### 1.1 Dot Expressions and Methods
Built in Python  `datetime`  Module for example:
```python
from datetime import date
today = date(2024, 9, 23)
freedom = date(2024, 12, 13)
days_left = freedom - today  # 输出 81 days
```

[![Dot Expressions and Methods · Classroom Blackboard Demonstration (00:01:39)](</attachments/cs61a-5f35b087858d06a905284299.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=99)
*⏱ Timestamp: 00:01:39 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:01:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=99)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:39)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Today and freedom. For instance, by computing how long it is between freedom and today. I should get a reasonable representation. Something that tells me these things are dates that I'm subtracting from one or another. There are 81 days left until you're free of this course. The primary mechanism by...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: Metaphor of objects - the symbiosis of data and behavior", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- `today.year`:Pass **dot expression** access object **Attribute**.
- `today.strftime("%A, %B %d")`: The function that accesses the object binding is called **Method**.
- Although we never tell the object what day of the week it is, the object naturally has the "intrinsic behavior" of calculating and displaying the day of the week.

[![Dot Expressions and Methods · Classroom Blackboard Demonstration (00:03:47)](</attachments/cs61a-bed182bc91b9cee186bd614a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=227)
*⏱ Timestamp: 00:03:47 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:03:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=227)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:47)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Where the percent A corresponded to Friday, percent B corresponded to February, percent D corresponded to 20. Now notice that up here, I never said that this was a Friday. I never even said that the way you say February is F-E-B-R-U-A-R-Y. It's just part of what it means to be a date, to be able to ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: Metaphor of objects - the symbiosis of data and behavior", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 1.2 Function vs. Object
- **Pure Function**: Focus on doing one thing. Enter parameters and return a confirmed result.
- **Object**: Encapsulates a variety of associated behaviors and data (for example, strings have  `.upper()`, `.lower()`, `.swapcase()`  and dozens of special operation methods).

[![Function vs. Object · Classroom Blackboard Demonstration (00:05:58)](</attachments/cs61a-9bf9c408e214fcfcc85b1c80.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=358)
*⏱ Timestamp: 00:05:58 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:05:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=358)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:58)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So the well-designed function has a single purpose. You pass in some arguments, you get some return value. Objects are different. They represent something that may have lots of different behavior bundled together. Dates don't just do one thing. They're used in many different ways. So objects do many...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Introduction: Metaphor of objects - the symbiosis of data and behavior", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


> **Important analysis**: call  `s.upper()`  will return a **Brand new uppercase string**, while the string  `s`  The content itself has not changed. In Python, **Strings are immutable (Immutable)**.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Introduction: Object Metaphor - Symbiosis of Data and Behavior" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. A brief history of character encoding: from ASCII 7-bit matrix to Unicode universe

The underlying computer can only store 0s and 1s, and text characters must be mapped to numbers through encoding.

### 2.1 ASCII code (American Standard Code for Information Interchange)
ASCII was a cornerstone standard in the early days of 20th century computing:
- **7-bit encoding matrix**: 8 lines (3-digit binary) $\times$  16 columns (4-bit binary), supporting a total of 128 characters.
- **Sorting logic**: Uppercase letters take precedence over lowercase letters (e.g.  `'A'`  is 65 / hexadecimal  `0x41`, `'a'`  is 97), which determines the default sorting of terminal files on modern computers.
- **control characters**: Contains marching line breaks (`LF`, `\n`), printer beep (`BEL`) and other hardware control instructions.

[![ASCII code (American Standard Code for Information Interchange) · Classroom blackboard demonstration (00:07:36)](</attachments/cs61a-0da18ab642f269fb374615cc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=456)
*⏱ Timestamp: 00:07:36 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:07:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=456)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:36)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The American Standard Code for Information Interchange. This was a table that laid out which numbers corresponded to which letters and symbols. There are eight rows, and eight is important because that's how many different rows you can represent using three bits, three ones and zeros. And there are ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. A brief history of character encoding: from ASCII 7-bit matrix to Unicode universe", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 2.2 Unicode global unified character set
To cover all human languages and scripts around the world, the modern standard uses Unicode:
- Contains more than 109,000 characters, 93 text systems, and even various Emoji expressions and symbols.
- Each character is assigned a unique scalar value (Code Point). Pass  `unicodedata`  Modules can be searched in both directions between a character and its full name:
```python
from unicodedata import lookup, name
name('A')                   # 'LATIN CAPITAL LETTER A'
lookup('SMILING FACE WITH OPEN MOUTH')  # '😃'
```

[![Unicode globally unified character set · Classroom blackboard demonstration (00:10:21)](</attachments/cs61a-c8380e3fefd2e9ea63b1d802.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=621)
*⏱ Timestamp: 00:10:21 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:10:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=621)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:21)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“There's meant to be a Unicode code point for it, or a number ascribed to it, that lets us refer to that character as a number, and use that for any kind of information interchange, among computers, among different programming languages, etc. There are currently 109,000 characters, at least last time...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. A brief history of character encoding: from ASCII 7-bit matrix to Unicode universe", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "2. A brief history of character encoding: from ASCII 7-bit matrix to Unicode universe", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. The birth of variability: Evolutionary history of playing cards and in-situ mutation of lists

All the data we have encountered so far (numbers, booleans, strings, custom rational numbers) is immutable after creation. But in the real world, things evolve over time.

Professor DeNero took the millennium evolution of card suits (Suits) as an example to introduce **In-Place Mutation**: 

[![The Birth of Mutability: Evolutionary History of Playing Cards and In-Situ Mutation of Lists · Classroom Blackboard Demonstration (00:13:49)](</attachments/cs61a-b833a5e765c06b5bc56516ce.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=829)
*⏱ Timestamp: 00:13:49 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:13:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=829)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:13:49)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Suits in playing cards. We think that playing cards were invented in Asia, and they began with three suits, the coin, the string, and the myriad. These were representing different denominations of money, because what are cards good for? Well, of course, gambling. Those are our suits. We're going to ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. The Birth of Mutability: Evolutionary History of Poker Cards and In-Situ Mutation of Lists", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
suits = ['coin', 'string', 'myriad']  # 亚洲纸牌起源
original_suits = suits

suits.pop()          # 移除末尾 'myriad' -> ['coin', 'string']
suits.remove('string') # 移除 'string' -> ['coin']

suits.append('cup')  # 西班牙传入：追加圣杯
suits.extend(['sword', 'club']) # 批量追加宝剑与短棍
# 当前: ['coin', 'cup', 'sword', 'club']

suits[2] = 'spade'   # 意大利/法国改良：宝剑变为黑桃
suits[0:2] = ['heart', 'diamond'] # 切片替换：硬币与圣杯变为红桃与方块
# 最终现代花色: ['heart', 'diamond', 'spade', 'club']
```

At this point, if you check the initially bound variable:
```python
original_suits  # 输出: ['heart', 'diamond', 'spade', 'club'] !
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "3. The Birth of Variability: Evolutionary History of Poker Cards and In-Situ Mutation of Lists", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Key anomalies in environment models: Aliasing

Why modify  `suits`  will lead to  `original_suits`  Exactly the same changes?

[![Key anomalies in environment models: Aliasing · Classroom blackboard demonstration (00:16:02)](</attachments/cs61a-cf33f5333d9c6260bf12e930.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=962)
*⏱ Timestamp: 00:16:02 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:16:02)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=962)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:02)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So here are the suits that appear in a modern American deck, Heart Diamonds, Bait and Club. I believe they're also used in France. OK. Way up at the beginning, we bound original suits to suits. Let's see what original suits is now. It's the same as suits. And that's interesting, because we bound it ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Key anomalies in the environment model: Aliasing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```
Global frame
  suits          ───┐
                    ├───► [ heart | diamond | spade | club ]
  original_suits ───┘     (同一个堆内存列表对象)
```

1. assignment statement  `original_suits = suits` **No new copy of the list is created**! it just changes the name  `original_suits`  pointed  `suits`  The same memory object currently referenced.
2. When two or more variable names point to the same object in memory, this phenomenon is called **Aliasing**.
3. **Mutations of an object are synchronized in all names and contexts that reference the object.**.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "4. Key anomalies in environment models: Aliasing", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Dictionary mutable operations and scope penetration

Dictionaries are also typical mutable composite data types:
- **Key value modification and addition**: `d[k] = v` (If the key exists, the old value is overwritten; if the key does not exist, a new key-value pair is created).
- **key delete**: `d.pop(k)`  Removes the specified key and returns the corresponding value.

[![Variable operations and scope penetration of dictionaries · Classroom blackboard demonstration (00:18:06)](</attachments/cs61a-c41f3705bac19b9348b8dd6e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1086)
*⏱ Timestamp: 00:18:06 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:18:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1086)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:06)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“I can also change the value bound to a key, at which point if I look it up again, I'll get a different answer. And the numerals dictionary has changed. Notice that the binding between x and 10 is just gone completely, and it's been replaced by x paired with 11. Now I can also make new entries to a d...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Variable operations and scope penetration of dictionaries", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Side-effect mutations in function calls
When a mutable object is passed into a function as an actual parameter, the operations inside the function can directly modify the data object in the external environment:

```python
four = [1, 2, 3, 4]

def mystery(s):
    s.pop()
    s.pop()

mystery(four)
# four 永久性地变成了 [1, 2]！
```

[![four permanently becomes "1, 2"! · Classroom blackboard demonstration (00:19:44)](</attachments/cs61a-b218474f33bce8f35f548247.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1184)
*⏱ Timestamp: 00:19:44 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:19:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1184)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:19:44)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Mystery introduces a new frame in which S is bound to the same object that 4 is bound to. So that, when I pop that, I'm actually removing the last element, which forever changes the value to which 4 is bound. Now, 4 isn't bound to anything different than it was before. It's just that this list is di...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Variable operations and scope penetration of dictionaries", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- Local parameters in function frames  `s`  What is received is  `four`  The list address pointed to.
- `s.pop()`  It is to perform excision directly on the original object in the heap memory without any  `return`  can produce a lasting external **Side Effects**.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "5. Dictionary Variable Operations and Scope Penetration", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Immutable Sequence: The Security Line of Tuples

In order to provide data structures that prevent accidental modification, Python provides **tuple (`tuple`)**.

### 6.1 Grammar rules
```python
t = (3, 4, 5, 6)   # 标准括号字面量
t = 3, 4, 5, 6     # 省略括号的逗号表达式也是元组
single = (2,)      # 单元素元组必须带有尾随逗号！(2) 仅仅是带括号的整数 2
```

[![Grammar rules · Classroom blackboard demonstration (00:21:48)](</attachments/cs61a-7bdf3474a6f0c668592768e0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1308)
*⏱ Timestamp: 00:21:48 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:21:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1308)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:21:48)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“See how we've not used square brackets, but instead parentheses. Though in fact, you don't need those parentheses at all in order to have a tuple literal. Anything separated by commas is evaluated as a tuple. A lot of people always put the parentheses around them just to be clear about what's going ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Immutable Sequence: The Security Line of Tuples", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- Tuples support all non-destructive sequence operations (`len(t)`, index  `t[i]`, slice  `t[1:3]`, `in`  member check, `+`  splicing).
- trying to execute  `t[0] = 99`  will directly trigger  `TypeError: 'tuple' object does not support item assignment`.

### 6.2 Shallow Immutability
> **Beware of "matryoshka dolls"**: The slot of the tuple itself cannot be changed, but **If the tuple contains mutable objects (such as lists), the contents of the list can still be mutated.**!

```python
t = (1, [2, 3])
t[1].append(4)  # 合法！
# t 变为 (1, [2, 3, 4])
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Immutable Sequence: Security Line of Defense of Tuples" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. A watershed in computer philosophy: identity (`is`) and equality (`==`)

In a world without variability, “the whole is the sum of all its parts.” Two pieces of data with the same elements are the same piece of data.
However, **Mutability breaks this static algebraic equivalence**.

[![A watershed in computer philosophy: identity (is) and equality (==) · Classroom blackboard demonstration (00:24:24)](</attachments/cs61a-f8806a78c2f3a615bd3aa179.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1464)
*⏱ Timestamp: 00:24:24 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:24:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1464)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:24)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“What the name turtle is bound to. So you get some protection, but not full protection in the language, from having functions make changes to your current environment. The value of an expression can change because of changes in names or objects. So a name change we've seen for a long time. If I have ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Watershed in computer philosophy: Identity (`is`) and equality (`==`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![A watershed in computer philosophy: identity (is) and equality (==) · Classroom blackboard demonstration (00:26:27)](</attachments/cs61a-cbe6bff8069569decf17facf.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1587)
*⏱ Timestamp: 00:26:27 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:26:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1587)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:27)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Once upon a time, we never modified objects. And at those times, a compound object was just the totality of its pieces. There was nothing more to being a rational number than just, what was your numerator? What's your denominator? But this view, that the whole is nothing but the sum of its parts, is...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Watershed in computer philosophy: Identity (`is`) and equality (`==`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 7.1 Core comparison
- **equality (`==`)**: Tests whether the values evaluated by two expressions have **same content**.
- **Identity (`is`)**: Tests whether two expressions strictly point to **Same object instance in memory (Same Identity)**.

[![Core comparison · Classroom blackboard demonstration (00:28:34)](</attachments/cs61a-a0ffef445e8c0dc9cd43996f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1714)
*⏱ Timestamp: 00:28:34 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:28:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1714)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:28:34)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, how do you figure out whether two things are the same? Well, there's something called an identity operator, which looks like the word is. And the opposite of is is called is not. So one expression is, another expression if, both of those expressions evaluate to the same object. Equality is true...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Watershed in computer philosophy: Identity (`is`) and equality (`==`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
a = [10]
b = [10]

a == b  # True  (内容完全一样)
a is b  # False (堆内存中独立开辟的两个不同列表)

c = b
c is b  # True  (别名，完全相同的对象)

b.append(20)
# a 依然是 [10]
# b 和 c 都变成了 [10, 20]！
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "7. A watershed in computer philosophy: identity (`is`) and equality (`==`)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 8. The infamous classic trap: Mutable Default Arguments

In Python interviews and engineering practices, the most common mechanism that causes hidden bugs is **Variable default parameters**: 

[![The notorious classic trap: Mutable Default Arguments · Classroom blackboard demonstration (00:30:17)](</attachments/cs61a-45ee0bc32d67a26388587723.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1817)
*⏱ Timestamp: 00:30:17 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:30:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1817)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:30:17)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So as soon as you learn about mutation, you have to learn about its risks. A default argument value when you define a function is part of that function value, not generated anew every time you call the function. So let's say I define a function f, which takes some sequence s, and by default it takes...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "8. The notorious classic trap: Mutable Default Arguments", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def f(s=[]):
    s.append(5)
    return len(s)

print(f())  # 预期 1，输出 1
print(f())  # 预期 1，输出 2 ？！
print(f())  # 预期 1，输出 3 ？！
```

### An in-depth analysis of the root causes of traps
- Python in **When defining a function (def statement execution period)**  This completes the evaluation and binding of the default formal parameters, and during the entire life cycle of the function **Allocate only once**!
- The default parameter object is stored in the properties of the function itself. Each time the function is called with omitted parameters, the formal parameters  `s`  will point to **same list object**!
- Correction Specification: Always Use  `None`  As default:
```python
def f_safe(s=None):
    if s is None:
        s = []
    s.append(5)
    return len(s)
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "8. The notorious classic trap: Mutable Default Arguments", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 9. The blend of functional expression and state: persistent local state in closures (`make_withdraw`)

If a function accepts the same parameters and returns a result that changes with the number of calls, it is a **Stateful impure functions**.

Take bank account withdrawal as an example:
```python
withdraw = make_withdraw(100)
withdraw(25)  # 返回 75
withdraw(25)  # 返回 50
withdraw(60)  # 返回 '余额不足'
```

[![The blend of functional and state: persistent local state in closures (make\_withdraw) · Classroom blackboard demonstration (00:32:26)](</attachments/cs61a-77ab0ca7f2f2c1621f2c5549.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1946)
*⏱ Timestamp: 00:32:26 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:32:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1946)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:32:26)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Every time you call it, you get a different result, even with the same argument. Let's say we want to have a function that represents a bank account that has an initial balance of $100. And then I want to be able to withdraw money from my bank account, so I call it on the amount I want to withdraw. ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "9. The blend of functional expression and state: persistent local state in closures (`make_withdraw`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 9.1 Use closures and mutable lists to build persistent state
```python
def make_withdraw_list(balance):
    """利用列表的可变性在闭包父帧中维护局部持久余额。"""
    b = [balance]
    def withdraw(amount):
        if amount > b[0]:
            return 'Insufficient funds'
        b[0] = b[0] - amount
        return b[0]
    return withdraw
```

[![Using closures and mutable lists to build persistent state · Classroom blackboard demonstration (00:36:44)](</attachments/cs61a-c4461536c8a3718a98b3d4c8.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=2204)
*⏱ Timestamp: 00:36:44 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P15 00:36:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=2204)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:36:44)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But element assignment changes the list by referring to that name, and you get an environment diagram that looks like this. Make withdraw list was called with a balance of 100. It defined a B, which is a list, which originally contained 100, and then defined a withdraw, which is a function whose par...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "9. The blend of functional expression and state: persistent local state in closures (`make_withdraw`)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "In-place Mutation of Lists vs. Reassignment, Nonlocal Grammar", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or misjudgment of variable shadowing;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### 9.2 Environment model operation details
1. execute  `withdraw = make_withdraw_list(100)`: 
   - Create partial frame  `f1`, binding  `balance = 100`  and list  `b = [100]`.
   - Return internal function  `withdraw`, its parent frame pointer is permanently locked at  `f1`.
2. first call  `withdraw(25)`: 
   - Create partial frame  `f2`, the parent frame is  `f1`.
   - in parent frame  `f1`  found  `b`, modify in place  `b[0] = 75`, return  `75`.
3. second call  `withdraw(25)`: 
   - Create partial frame  `f3`, the parent frame is still  `f1`.
   - at this time  `f1`  seen  `b[0]`  Already after the last modification  `75`! Deducted again  `50`.

> **Closures are miniature objects**: Through the reference penetration of variable objects, functions not only have calculation logic, but also have "memory" that evolves over time. This lays the perfect bridge for the next chapter to fully enter object-oriented programming (OOP).

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In "9. The intersection of functional expression and state: persistent local state in closures (`make_withdraw`)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 10. Core points and thinking questions of this lecture

### Refining key rules
1. **The double-edged sword of variability**: In-place modification avoids the overhead of frequently allocating new memory, but it also breaks "functional reference transparency" and introduces implicit associations caused by aliases.
2. **`is`  measuring pointer, `==`  Measured value**: slice copy  `s[:]`  will generate new objects (`s[:] is s`  for  `False`), while simply assigning  `y = s`  Just create aliases.
3. **The secret to maintaining state with closures**:Introduced in Python  `nonlocal`  keyword, by placing a single-element list in the closure parent frame  `b = [val]`, the inner function can modify the cross-scope status compliantly.

---

### After-class self-assessment exercises

#### Exercise 1: Flip the list in place
Write function  `reverse_list(s)`, **The use of slicing and the creation of new lists is strictly prohibited**, only by element assignment and  `.pop()` / `.insert()`  Or double pointer exchange, the passed in list  `s`  Reverse in place:
```python
def reverse_list(s):
    """
    >>> s = [1, 2, 3, 4]
    >>> reverse_list(s)
    >>> s
    [4, 3, 2, 1]
    """
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left, right = left + 1, right - 1
```

#### Exercise 2: Dictionary Accumulator
Write a higher-order function  `make_accumulator()`, each time the returned function is called and a key and a value are passed in, the historical cumulative value of the key is accumulated and returned:
```python
def make_accumulator():
    """
    >>> acc = make_accumulator()
    >>> acc('apple', 10)
    10
    >>> acc('apple', 5)
    15
    >>> acc('banana', 20)
    20
    """
    history = {}
    def accumulate(key, value):
        history[key] = history.get(key, 0) + value
        return history[key]
    return accumulate
```
Mutable dictionaries act as perfect key-value state repositories in closures!

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "10. Core Points and Questions of This Lecture", the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous lecture: Lecture 14 Trees](/en/notes/cs61a/lecture-14) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 16 Iterators →](/en/notes/cs61a/lecture-16) | [🎬Watch this lecture on Bilibili (P15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15) |
