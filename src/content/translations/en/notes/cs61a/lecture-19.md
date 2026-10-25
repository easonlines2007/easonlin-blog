---
kind: notes
source: cs61a/lecture-19
title: "Lecture 19 · Attributes: Class Attributes and Methods"
description: "CS61A Lecture 19: Class Attributes and Methods (Attributes)"
sourceHash: 2f845db1787eb0f236177dbd86b70a73f93be4b6e5e51054b63e8b0510917b3c
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 17:47 ｜ **Classroom screenshots**: 15 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19)  
> **Quick navigation**: [← Previous Lecture (P18 Lecture 18 Objects)](/en/notes/cs61a/lecture-18) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next Lecture (P20 Lecture 20 Inheritance) →](/en/notes/cs61a/lecture-20)

---

## 1. Core architecture and core mental model

In the Python object-oriented system, "objects are containers of attributes", and attribute search, assignment and method binding follow a clear bottom-up and environment model mechanism:

```
                    ┌───────────────────────────────────────────────┐
                    │               Class (Account)                 │
                    │───────────────────────────────────────────────│
                    │ • interest = 0.02                             │
                    │ • deposit  = <function Account.deposit>       │
                    │ • withdraw = <function Account.withdraw>      │
                    └───────────────────────────────────────────────┘
                                   ▲                 ▲
                     查找回溯路径   │                 │   查找回溯路径
                                   │                 │
            ┌──────────────────────┴───────┐   ┌─────┴────────────────────────┐
            │   Instance (tom_account)     │   │     Instance (jim_account)   │
            │──────────────────────────────│   │──────────────────────────────│
            │ • holder  = 'Tom'            │   │ • holder   = 'Jim'           │
            │ • balance = 100              │   │ • balance  = 50              │
            │                              │   │ • interest = 0.08 (特殊定制)  │
            └──────────────────────────────┘   └──────────────────────────────┘
```

1. **Class Attribute**: Belongs to the class object itself and is shared by all instances; it only occupies one memory.
2. **Instance Attribute**: Belongs to a specific instance object, and each instance is independent of each other.
3. **Attribute Lookup**: 
   - First look up the name in the instance dictionary;
   - If not found, go back to the class to which the instance belongs to search;
   - If an ordinary function is found in the class, the dot expression will automatically wrap it as a function bound to the instance.  **Bound Method** (Auto-prefill  `self`).
4. **Attribute Assignment**: 
   - `<instance>.<name> = <val>`: always directly in **Example** Create or modify attributes on (shadowing occurs and will never be written back to the class);
   - `<class>.<name> = <val>`:Modify directly **class attributes**, the latest value is immediately visible to all unobscured instances of the property.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Core Architecture and Core Mental Model" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Definition and sharing mechanism of class attributes (Class Attributes)

in execution  `class`  statement, Python creates a new class object. Assignment statements executed directly within the class body (suite) and  `def`  Statements are not bound to names in the local frame like ordinary functions, but are all stored in the class object itself as **class attributes**.

[![Definition and sharing mechanism of class attributes (Class Attributes) · Classroom blackboard demonstration (00:00:45)](</attachments/cs61a-5f0a40789b5e9a387b8be0cb.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)
*⏱ Timestamp: 00:00:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Normally, assignment in def would create names in frames, but that's not the case here. Instead, they all go in the class as class attributes. And it's really possible to write any code that you want inside of a class statement. Now, this code is not helpful at all, but it's just here to illustrate ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Definition and sharing mechanism of class attributes (Class Attributes)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Class attribute examples and instantiation behavior

```python
class Clown:
    nose = 'big and red'
    def dance():
        return 'No self argument here!'
```

Although any statement can be written in a class, in practical object-oriented applications, the core role of class attributes is **Share common constants or default configuration across all instances**.

For example, a bank account with the same interest rate for all users could be defined as a class attribute:

[![Class attribute examples and instantiation behavior · Classroom blackboard demonstration (00:01:30)](</attachments/cs61a-f1489d75c503b48a846113ca.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)
*⏱ Timestamp: 00:01:30 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:01:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:30)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, there is a good reason to create a class attribute. Class attributes are shared across all instances of a class because they're attributes of the class, not the instance. So, for example, if all accounts have the same interest rate, instead of using an instance attribute to represent the intere...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Definition and sharing mechanism of class attributes (Class Attributes)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class Account:
    interest = 0.02  # 类属性：被所有 Account 实例共享

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

tom_account = Account('Tom')
jim_account = Account('Jim')

# 两个不同实例访问同一类属性
print(tom_account.interest)  # 0.02
print(jim_account.interest)  # 0.02
```

> **Design points**:
will  `interest`  Defining it as a class attribute means that there is no need to store a floating point number separately in each account instance, but to store it centrally in  `Account`  class, significantly reducing memory overhead and uniformly controlling business parameters.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Definition and Sharing Mechanism of Class Attributes" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Point expression evaluation and attribute lookup rules (Attribute Lookup Procedure)

The point expression is of the form  `<expression> . <name>`, its evaluation steps are as follows:

[![Point expression evaluation and attribute lookup rules (Attribute Lookup Procedure) · Classroom blackboard demonstration (00:03:10)](</attachments/cs61a-744c395d59fec72d50b010fc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)
*⏱ Timestamp: 00:03:10 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:03:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:10)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“But looking up an attribute by its name is actually a process that looks in multiple places. Both instances and their classes have attributes that can both be accessed using dot expressions. And here's how a dot expression gets evaluated. First, the expression to the left of the dot gets evaluated. ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "3. Point Expression Evaluation and Attribute Lookup Procedure", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


1. **Evaluate the left-hand expression**: Calculation  `<expression>`  Get the target object.
2. **Instance attribute matching**: Check whether the target object exists in the instance attribute  `<name>`. If it exists, its value is returned directly.
3. **Class attribute backtracking search**: If not found in the instance, go to the object to which the object belongs **class**  Search in  `<name>`: 
   - If the found value is a non-function object, return the value directly;
   - If the found value is an ordinary function, it is packaged with the current instance and returns a  **Bound Method**, whose first formal parameter  `self`  Already bound to the current instance.
4. **Property not found**: If neither the class nor its base class is found, throws  `AttributeError`.

[![Point expression evaluation and attribute lookup rules (Attribute Lookup Procedure) · Classroom blackboard demonstration (00:03:55)](</attachments/cs61a-8bc7e7fb6e52209e7f6a62c0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)
*⏱ Timestamp: 00:03:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:03:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If no instance attribute is found with that name, then the name is looked up in the class of that object, at which point we find a class attribute value. That value is the value of the whole expression, unless it is a function, in which case a bound method is returned instead, for which the object o...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "3. Point Expression Evaluation and Attribute Lookup Procedure", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Built-in functions: getattr and hasattr

In addition to dot syntax, Python also provides built-in functions for dynamically querying properties by string name:

[![Built-in functions: getattr and hasattr · Classroom blackboard demonstration (00:04:45)](</attachments/cs61a-df483b4228bb76074c7d9633.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)
*⏱ Timestamp: 00:04:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Balance for Tom account, which does exactly the same thing. There's also a HasAdder built-in function, which will tell you whether an attribute of this name exists, either for Tom account, the instance, or its class. Get Adder and dot expressions, look up a name in the same way. And looking up an at...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion node "3. Point Expression Evaluation and Attribute Lookup Procedure", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
getattr(tom_account, 'balance')   # 等价于 tom_account.balance
hasattr(tom_account, 'interest')  # 检查实例或其类是否存在该属性，返回 True / False
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Point Expression Evaluation and Attribute Lookup Procedure" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Attribute Assignment & Shadowing

The form of the attribute assignment statement is: `<expression> . <name> = <value>`.

[![Attribute Assignment & Shadowing · Classroom Blackboard Demonstration (00:06:15)](</attachments/cs61a-fca3e7d19910bb55f8e5221a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)
*⏱ Timestamp: 00:06:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If I say tom account dot interest equals 0.08, that's setting an instance attribute, because the object of the dot expression is an instance. So this expression evaluates to an object. This whole thing doesn't look up interest on that object and go find it in the class. Instead, we just directly ass...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Attribute Assignment & Shadowing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **Instance assignment**:If  `<expression>`  If the result obtained by evaluation is an instance, only the attribute dictionary of the instance will be affected. If the attribute was previously defined only in the class, this operation will add an instance attribute of the same name to the instance, thus **shadow**  The corresponding class attribute.
- **class assignment**:If  `<expression>`  If the result obtained by evaluation is a class object, the class attributes will be modified directly. All instances that have not obscured this property will read the new modifications when accessing the property.

### Classic derivation exercise: Interest rate evolution of Jim and Tom’s accounts

Through classic cases in the lecture, the dynamic process of class attribute modification and instance attribute customization is fully demonstrated:

[![Classic derivation exercise: Interest rate evolution of Jim and Tom's accounts · Classroom blackboard demonstration (00:07:45)](</attachments/cs61a-9c94c9bf1ac0894f845e7d75.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)
*⏱ Timestamp: 00:07:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So this will go and change the interest attribute of the account class, which in this case already existed, and so we go change it. Okay, so here's an extended example of how attribute assignment statements affect classes and objects. Let's say I say, JimAccount is an account with Jim. Then I'm goin...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Attribute Assignment & Shadowing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


#### Phase 1: Initial state

```python
jim_account = Account('Jim')
tom_account = Account('Tom')
print(tom_account.interest)  # 0.02（来自 Account.interest）
print(jim_account.interest)  # 0.02（来自 Account.interest）
```

#### Phase 2: Modify global rates via classes

[![Phase 2: Modifying global rates through classes · Classroom blackboard demonstration (00:08:45)](</attachments/cs61a-b4bf05e3f602a48f8e109a04.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)
*⏱ Timestamp: 00:08:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which means looking in Tom account to see if there's an interest attribute, there's not. So then you look in the class. There it's found, 0.02, and so that's the value we see. Jim account has an interest of 0.02 as well. Next, I can set account.interest to 0.04. That changes a class attribute for th...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Attribute Assignment & Shadowing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
Account.interest = 0.04
print(tom_account.interest)  # 0.04 (动态反映类属性变更)
print(jim_account.interest)  # 0.04 (动态反映类属性变更)
```

> **Important inspiration**: When the instance is created **No**"Copy and freeze" the value of a class attribute into itself. Instances are simply looked up through backtracking to point to class attributes. Therefore, if the class attributes change at any time, each instance will be immediately visible.

#### Phase 3: Individually assign privileged rates to specific VIP instances (instance masking)

[![Phase 3: Individually assign privileged rates to specific VIP instances (instance masking) · Classroom blackboard demonstration (00:09:45)](</attachments/cs61a-7204c04c425ac95e245cf398.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)
*⏱ Timestamp: 00:09:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“JimAccount.interest set to 0.08. This is an instance attribute assignment that adds an interest attribute to the JimAccount. Okay, so now we see interest reflected in two places, both in an instance and in the class. If we look up JimAccount's interest, we'll see 0.08, which is what we just set. If ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Attribute Assignment & Shadowing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
# 单独为 Jim 定制 VIP 利率
jim_account.interest = 0.08

print(jim_account.interest)  # 0.08 (找到实例属性，直接返回，不再回溯)
print(tom_account.interest)  # 0.04 (tom 未遮蔽，仍回溯到 Account.interest)
```

#### Stage 4: Subsequent class attribute adjustments will not affect customized instances

[![Stage 4: Subsequent class attribute adjustments will not affect customized instances · Classroom blackboard demonstration (00:10:35)](</attachments/cs61a-7d257b3faa0b6ff6be8ffedf.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)
*⏱ Timestamp: 00:10:35 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:10:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:35)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Tom's account has an interest rate of 0.05, which just changed because of this class attribute assignment statement. Jim still has an interest rate. It's a special case, 0.08. So by assigning to the class, you don't erase all the special cases. They're still there. Calling or invoking a method on an...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Attribute Assignment & Shadowing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
Account.interest = 0.05

print(tom_account.interest)  # 0.05 (普通用户跟随银行基准利率调整)
print(jim_account.interest)  # 0.08 (Jim 拥有专属实例属性，不受全局调整影响)
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Attribute Assignment & Shadowing" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Methods & Bound Methods

Calling or invoking methods on an object is the primary means of interacting with an object.

[![Methods & Bound Methods · Classroom Blackboard Demonstration (00:11:45)](</attachments/cs61a-8db22680a1ae368be75b7126.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)
*⏱ Timestamp: 00:11:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“This expression evaluates to the value of the attribute. Looked up by name in the object. That's the value of the expression. So first thing you have to evaluate this expression to get the object of the dot expression. Then you can look up the attribute name. And then you can call this method. Tom a...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Methods & Bound Methods", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


In a method call expression:
```python
tom_account.deposit(10)
```
Its essence is:
1. Operator subexpressions are evaluated first  `tom_account.deposit`; 
2. The point expression evaluates to yield a  **Bound Method**; 
3. will parameter  `10`  Pass in this binding method for regular calls.

[![Methods & Bound Methods · Classroom Blackboard Demonstration (00:12:55)](</attachments/cs61a-3b33e0b567f7f8a2ea37afb7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)
*⏱ Timestamp: 00:12:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:12:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And it is not called directly, typically, but instead happens automatically whenever you create an instance of the account class, whereas deposit and withdraw are invoked using method call expressions, just like the one we looked at on the slide. If I create an account for Alan, I can, of course, de...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Methods & Bound Methods", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Binding methods are first-class citizens (First-Class Value)

As an independent object, the bound method can be assigned to a variable like a normal function, or passed as a parameter of a higher-order function:

```python
a = Account('Alan')
a.deposit(5)
a.deposit(5)
print(a.balance)  # 10

# 将 a 的绑定方法赋值给普通变量 f
f = a.deposit
f(20)  # 相当于 a.deposit(20)
print(a.balance)  # 30
```

It's even possible to combine lazy iterators like  `map`) to implement batch operations:

[![Assign the binding method of a to the ordinary variable f · Classroom blackboard demonstration (00:14:35)](</attachments/cs61a-c938aa03dc8709f83599513a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)
*⏱ Timestamp: 00:14:35 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:35)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Is to deposit into A's account. And then I can decide what I want to deposit. How about 10 through 20? So, so far, I haven't made any deposits because map objects are iterators that are only evaluated lazily. But if I ask for the next M, then it is, in fact, going to deposit 10, the first element in...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Methods & Bound Methods", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
m = map(a.deposit, range(10, 20))
# 此时尚未发生任何 deposit，因为 map 是惰性迭代器
next(m)  # 将 10 存入 a 账户
print(a.balance)  # 40 (原余额 30 + 10)
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Methods & Bound Methods" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Functions vs. Bound Methods in-depth comparison (Functions vs. Bound Methods)

Python strictly distinguishes between "normal functions" stored in the class and "bound methods" obtained from instance point expressions:

[![In-depth comparison of functions vs. bound methods (Functions vs. Bound Methods) · Classroom blackboard demonstration (00:15:45)](</attachments/cs61a-110e0dfc2676e918fb022dbe.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)
*⏱ Timestamp: 00:15:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:15:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:15:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“With an instance of the class. Let's review all the terminology. All objects have attributes, which are name-value pairs that can be looked up by name. A class is a type. It's a category of objects. Classes are objects as well, so they have attributes. An instance attribute is an attribute of an ins...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. In-depth comparison of functions vs. bound methods (Functions vs. Bound Methods)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![In-depth comparison of functions vs. bound methods (Functions vs. Bound Methods) · Classroom blackboard demonstration (00:16:55)](</attachments/cs61a-51a2f58a44916288e015787c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)
*⏱ Timestamp: 00:16:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P19 00:16:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If I write instance.methodName, I get a bound method where the method was looked up by its name. It started out as a function, but then the instance was filled in as the first argument. And so when calling this bound method, I just have to pass in the rest of the arguments. Python distinguishes betw...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. In-depth comparison of functions vs. bound methods (Functions vs. Bound Methods)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Instance attributes override class attributes, attribute search dot expression evaluation protocol", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


| Feature dimension | Ordinary function (Function) | Bound Method |
| :--- | :--- | :--- |
| **How to get it** | Direct access via class: `Account.deposit` | Access via instance: `tom_account.deposit` |
| **`self`  parameters** | **Not bound**, parameters must be passed explicitly when calling | **Automatically bound**, permanently bound to a specific instance |
| **call signature** | Requires 2 actual parameters: `Account.deposit(tom_account, 10)` | Only the remaining arguments are needed: `tom_account.deposit(10)` |
| **type representation** | `<function Account.deposit at 0x...>` | `<bound method Account.deposit of <Account object...>>` |

### Invoking the equivalence theorem

Under the hood, the following two ways of writing are completely equivalent:

```python
# 方式 1：标准面向对象调用（语法糖，推荐）
tom_account.deposit(100)

# 方式 2：显式函数式调用
Account.deposit(tom_account, 100)
```

Understanding this is key to fully grasping the object-oriented nature of Python: **A method in a class is essentially just a first parameter named  `self`  An ordinary function, and the instance's dot operator is responsible for automatically wrapping it into a closure-style object prefilled with the instance's arguments.**

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Functions vs. Bound Methods In-depth Comparison (Functions vs. Bound Methods)" module, the underlying computer operations rely on strict formal evaluation logic:
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

1. **Class attribute singletonness**: Class attributes are created when the class is defined and exist in the class namespace. All instances share the same data through pointer backtracking.
2. **Reading and writing asymmetry**: 
   - **read**: The instance first checks itself, if not, then backtracks and checks the class;
   - **write**: `instance.attr = val`  Always only write to the instance's own dictionary and never pollute class attributes.
3. **Decoupling binding methods**: A bound method is a fixed bundle of instances and functions that can be passed freely and safely executed without the original call point.

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
| [← Previous lecture: Lecture 18 Objects](/en/notes/cs61a/lecture-18) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 20 Inheritance →](/en/notes/cs61a/lecture-20) | [🎬Watch this lecture on Bilibili (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19) |
