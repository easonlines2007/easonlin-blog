---
kind: notes
source: cs61a/lecture-20
title: Lecture 20 · Inheritance and Object-Oriented Design
description: "CS61A Lecture 20: Inheritance and Object-Oriented Design (Inheritance)"
sourceHash: 52b4381cd2b4084d3343544bc7d72a00f2fd16e6be1140ad2e9834e91d6c1c52
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 31:35 ｜ **Classroom screenshots**: 16 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20)  
> **Quick navigation**: [← Previous Lecture (P19 Lecture 19 Attributes)](/en/notes/cs61a/lecture-19) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P21 Lecture 21 Representation) →](/en/notes/cs61a/lecture-21)

---

## 1. Core mental model and system architecture

Inheritance is the core mechanism in object-oriented programming to express the hierarchical relationship between classes. When different classes are highly similar and differ only in some degree of specialization, inheritance allows subclasses to reuse all properties and behaviors of the base class without having to write those **Different specializations** part.

```
                              ┌────────────────────────────────────────┐
                              │              Base Class                │
                              │                Account                 │
                              │────────────────────────────────────────│
                              │ • interest = 0.02                      │
                              │ • balance  = 0                         │
                              │ • deposit(self, amount)                │
                              │ • withdraw(self, amount)               │
                              └────────────────────────────────────────┘
                                                  ▲
                                                  │ 继承 ("is-a")
                                                  │
                              ┌───────────────────┴────────────────────┐
                              │               Subclass                 │
                              │            CheckingAccount             │
                              │────────────────────────────────────────│
                              │ • withdraw_fee = 1                     │
                              │ • interest = 0.01 (特化覆盖)            │
                              │ • withdraw(self, amount) (扩展覆盖)     │
                              └────────────────────────────────────────┘
```

### core design principles

1. **DRY principle (Don't Repeat Yourself)**: Never copy and paste code to implement similar classes; directly reuse existing base class implementations.
2. **Base class method delegate**: When a subclass overrides (Override) method, it can be explicitly called  `<BaseClass>.<method>(self, ...)`  Delegate the old logic and only add incremental differences.
3. **Inheritance vs composition**: 
   - **Inheritance**: expression  **is-a**  relationship (e.g. checking account  *is an*  account);
   - **Composition**: expression  **has-a**  relationship (e.g. bank  *has a*  account list).

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Core Mental Model and System Architecture" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Inheritance syntax and checking account practice (CheckingAccount)

In Python, inheritance is passed in the subclass's  `class`  This is accomplished by specifying a base class in statement brackets:

[![Inheritance syntax and checking account practice (CheckingAccount) · Classroom blackboard demonstration (00:00:55)](</attachments/cs61a-ae95132205f13552b1e017c7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“It's when you have two similar classes that differ in their degree of specialization. So the specialized class might have all the same attributes as the general class, along with some special case behavior. The way you express this syntactically in Python is that in addition to having a class statem...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Inheritance syntax and checking account practice (CheckingAccount)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Demand scenario: CheckingAccount

- Have an ordinary  `Account`  All basic attributes and deposit behavior (`deposit`  No changes required).
- Have lower current interest rates (`interest = 0.01`).
- An additional handling fee will be deducted for each withdrawal (`withdraw_fee = 1`).

[![Demand scenario: CheckingAccount · Classroom blackboard demonstration (00:02:45)](</attachments/cs61a-c67c4b1d6d978c8ec5abc60e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)
*⏱ Timestamp: 00:02:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And, when we withdraw money, we have to pay an extra dollar. Okay, here's how we write the code for this checking account. We say there's a class called checking account. Its base class is account. Another way of saying the same thing. We'll create a class called checking account that inherits from ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Inheritance syntax and checking account practice (CheckingAccount)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Code implementation and analysis

[![Code Implementation and Analysis · Classroom Blackboard Demonstration (00:04:15)](</attachments/cs61a-3d6784585fbbc47b89b75c85.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)
*⏱ Timestamp: 00:04:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Whatever the withdraw fee is for this current account. Now, why do I keep saying current account when it says self right there? Well, remember that self is the name we use to refer to the object on which this method gets invoked. So, when we actually call withdraw right here, self will be bound to t...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Inheritance syntax and checking account practice (CheckingAccount)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class Account:
    interest = 0.02

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

    def deposit(self, amount):
        self.balance += amount
        return self.balance

    def withdraw(self, amount):
        if amount > self.balance:
            return 'Insufficient funds'
        self.balance -= amount
        return self.balance

class CheckingAccount(Account):
    """有取款手续费的银行支票账户。"""
    withdraw_fee = 1
    interest = 0.01

    def withdraw(self, amount):
        # 委托基类实现，显式传入 self 与总扣款额
        return Account.withdraw(self, amount + self.withdraw_fee)
```

> **Key technical details**: 
> 1. `Account.withdraw`  It is an ordinary function obtained directly from the base class object. It is not bound to the instance, so it must be passed in explicitly.  `self`.
> 2. used here  `self.withdraw_fee`  rather than hardcoding  `1`  or  `CheckingAccount.withdraw_fee`, so that specific account instances or further derived subclasses can flexibly customize specific handling fees in the future.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Inheritance Syntax and Checking Account Practice (CheckingAccount)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Attribute Lookup in Hierarchy

When looking up properties on subclass instances, Python follows a bottom-up recursive lookup algorithm:

[![Attribute Lookup in Hierarchy · Classroom Blackboard Demonstration (00:05:45)](</attachments/cs61a-187ca64b3fcd1ecfae5533ba.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)
*⏱ Timestamp: 00:05:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“If a subclass that isn't changed is just the same as whatever the base class was. So to look up a name in a class, here's what you do. If it names an attribute that's in that class, then return the attribute value. Remember, attributes are named value pairs. If not, look up that name in the base cla...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Attribute Lookup in Hierarchy", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```
1. 实例属性 (Instance Attributes)
   └── 检查当前实例对象自身字典中是否存在该名字。
2. 子类属性 (Subclass Attributes)
   └── 若实例中不存在，查找当前实例所属子类的属性字典。
3. 基类属性 (Base Class Attributes)
   └── 若子类中不存在，递归查找该子类的直接基类。
4. 递归基类链 (Ancestors Chain)
   └── 继续向上回溯基类链，直至 object 根类。
5. 抛出异常
   └── 若全程未命中，抛出 AttributeError。
```

[![Attribute Lookup in Hierarchy · Classroom Blackboard Demonstration (00:07:45)](</attachments/cs61a-d73b0f8a99f56414e91b34a0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)
*⏱ Timestamp: 00:07:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So in addition to the class that we have, we're going to create a class checking account, which inherits from account. It has a different interest rate. It has a fee associated with all withdrawals of one dollar. And the way that fee gets used is that we write a withdraw method that withdraws not ju...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Attribute Lookup in Hierarchy", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Terminal interaction and operation comparison

[![Terminal interaction and operation comparison · Classroom blackboard demonstration (00:09:45)](</attachments/cs61a-6176ffb451864a32b8884900.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)
*⏱ Timestamp: 00:09:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:09:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And then another account, which is a checking account for my good friend Jack. So A is an account, B is a checking account. They both have a balance of zero. Let's add a balance to each by depositing into 100 in A and depositing 100 in B. Now, both of those did the same thing because they're both us...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Attribute Lookup in Hierarchy", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
a = Account('John')
b = CheckingAccount('Jack')

a.deposit(100)  # 余额 100
b.deposit(100)  # 余额 100（继承自 Account.deposit）

a.withdraw(10)  # 扣款 10，剩余 90
b.withdraw(10)  # 扣款 10 + 1 手续费，剩余 89
```

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Attribute Lookup in Hierarchy" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition)

[![Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition) · Classroom blackboard demonstration (00:11:20)](</attachments/cs61a-64ed5a32fe44155a945e4631.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)
*⏱ Timestamp: 00:11:20 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:11:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:20)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“As exists in the base class. So here we see the checking account class has withdraw, which also exists in the account class. But, even though we've overridden that name, meaning the checking accounts will call this withdraw instead of the original withdraw, we can still access them and use them usin...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


The essence of object-oriented programming is to establish abstractions that are close to the mental model of reality:

[![Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition) · Classroom blackboard demonstration (00:12:45)](</attachments/cs61a-94bc6ae4dc51989a73664587.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)
*⏱ Timestamp: 00:12:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:12:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We'll use the one from the account. Okay, so here we have attribute lookup on a base class, and here we have looking up an instance attribute, and that's preferred to looking up checking account.withdrawfee, because it allows for specialized accounts, either through further subclasses or by giving i...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


| design relationship | relationship nature | typical realistic metaphor | Code reflection |
| :--- | :--- | :--- | :--- |
| **Inheritance** | **is-a** (is one) | CheckingAccount is an Account | `class CheckingAccount(Account):` |
| **Composition** | **has-a** (there is one) | Bank has multiple Account accounts | `self.accounts = []`  as instance attribute |

### Practical combat: Design Bank banking class

Banks manage multiple accounts, so banks should not inherit from accounts, but hold accounts through a combination:

[![Practical Combat: Design Bank Bank Class · Classroom Blackboard Demonstration (00:14:35)](</attachments/cs61a-efd8c93b2f3eca4a7d9f55da.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)
*⏱ Timestamp: 00:14:35 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:14:35)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And an account won't inherit from a bank. They're related in that one has the other as an attribute, but they're not related according to inheritance. So let's design a bank real quick. A bank won't inherit from account because a bank has accounts. And what will it look like to use a bank? Well, cre...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Practical Combat: Design Bank Bank Class · Classroom Blackboard Demonstration (00:17:15)](</attachments/cs61a-e1a78feb9a2a991cf36ba319.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)
*⏱ Timestamp: 00:17:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:17:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We have to remember that this is one of our accounts, as opposed to an account in another bank. So we're going to add this account to our list of accounts, and then we can return it. Okay, what's the last piece of the implementation? We have to be able to pay interest. Paying interest takes no argum...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Object-oriented architecture design: inheritance vs composition (Inheritance vs Composition)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class Bank:
    """管理账户集合并统一结算利息的银行系统。"""
    def __init__(self):
        self.accounts = []

    def open_account(self, holder, amount, kind=Account):
        """开立新账户并存入初始资金。"""
        account = kind(holder)
        account.deposit(amount)
        self.accounts.append(account)
        return account

    def pay_interest(self):
        """为旗下所有账户按各自利率派发利息。"""
        for a in self.accounts:
            a.deposit(a.balance * a.interest)
```

> **beauty of design**: `open_account`  accept  `kind`  parameters (default is  `Account`), allowing the issuance of any  `Account`  Subclass accounts of interfaces (e.g.  `CheckingAccount`), polymorphism and combination are integrated.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Object-oriented architecture design: Inheritance vs Composition" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)

During the lecture, Professor DeNero gave a difficult comprehensive challenge that comprehensively examines inheritance, coverage, constructor chains and dot operator backtracking:

[![Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle) · Classroom blackboard demonstration (00:18:55)](</attachments/cs61a-398fc5366255d182dbcd7e81.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)
*⏱ Timestamp: 00:18:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:18:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Let's stress test our understanding of attribute lookup and inheritance by working through a slightly more complex example. Here it is. I suggest that you pause the video and try to figure out what happens after you run all of this code on the left and then evaluate these three expressions on the ri...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Question code definition

```python
class A:
    z = -1
    def f(self, x):
        return B(x - 1)

class B(A):
    n = 4
    def __init__(self, y):
        if y:
            self.z = self.f(y)
        else:
            self.z = C(y + 1)

class C(B):
    def f(self, x):
        return x

a = A()
b = B(1)
b.n = 5
```

[![Question code definition · Classroom blackboard demonstration (00:20:25)](</attachments/cs61a-3dd96322e9c0eb5825dfd518.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)
*⏱ Timestamp: 00:20:25 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:20:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:20:25)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, the class itself has two class attributes. Z is negative one due to this assignment statement, and F is the function that returns B of X minus one. This function, like any other function, does have a parent frame. All of the functions in this example have parent frame global, so I'm not going t...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### step-by-step derivation

#### Expression 1: `C(2).n`

[![Expression 1: C(2).n · Classroom Blackboard Demonstration (00:23:45)](</attachments/cs61a-ab1140fe06b8407b08d3c20d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)
*⏱ Timestamp: 00:23:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:23:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now I think we're in a good position to review some of these. Eventually, we're going to have to fill in what Z was, but let's solve the first two here before we do that. So C of 2 dot n. Here's an expression that has to evaluate to some object. In this case, it evaluates to an instance of the C cla...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


1. `C(2)`:instantiation  `C`.`C`  None per se  `__init__`, backtracking to the base class  `B.__init__`  execute, `y = 2`.
2. `y = 2`  is true, execute  `self.z = self.f(2)`.
3. `self`  Yes  `C`  Instances of , find  `f`  hit  `C.f` (identity function), so  `self.z = 2`.
4. then search  `.n`: `C`  Instance no  `n`, `C`  class no  `n`, back to  `B.n`, get  `4`.
5. **result**: `4`.

#### Expression 2: `a.z == C.z`

1. `a.z`: `a`  for  `A`  Instance, no instance properties  `z`, back to  `A.z = -1`.
2. `C.z`: class  `C`  No attributes  `z`, base class  `B`  No attributes  `z`, base class  `A.z = -1`.
3. Both point to  `A.z`, the result is  `True`.

#### Expression 3: `b.z.z.z`  Determine with integers

[![Expression 3: b.z.z.z and integer determination · Classroom blackboard demonstration (00:26:30)](</attachments/cs61a-5cd7e2899dd57f91ea7f1bc9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)
*⏱ Timestamp: 00:26:30 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:30)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We never really wrote down what it is, but I'm pretty sure it's not going to come out negative one. I think it's time that we figure out what it does equal. When this instance was created, we passed in one as the value for y, self is bound to the instance itself. We checked that y was true, and so w...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Expression 3: b.z.z.z and integer determination · Classroom blackboard demonstration (00:28:20)](</attachments/cs61a-5dac9d516e4e9b429d33a78d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)
*⏱ Timestamp: 00:28:20 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:28:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:28:20)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Okay, so it's quite clear that this is negative 1, and this is some b instance, and those can't be equal. And now we can move on to which of these expressions evaluates to an integer. b.c is a b instance. b.z.z is a c instance. b.z.z.z is 1. And 1.z is nothing at all. That would be an error. So only...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Analysis of difficult test points: Complex hierarchy and recursive evaluation (The A-B-C Puzzle)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


Derivation  `b = B(1)`  Nested construction of:
1. `B(1)`: `y = 1`, call  `self.f(1)`.`B`  No  `f`, back to  `A.f`, return  `B(1 - 1)`  That is  `B(0)`.
2. `B(0)`: `y = 0`  is false, enter  `else`  branch, execute  `self.z = C(0 + 1)`  That is  `C(1)`.
3. `C(1)`: call  `B.__init__`, `y = 1`  is true, call  `self.f(1)`. due to  `self`  Yes  `C`  Instances of , find  `f`  hit  `C.f`, returns an integer  `1`!
4. Trace back the entire reference chain:
   - `b`  is a  `B`  Example;
   - `b.z`  is another  `B`  instance(`B(0)`); 
   - `b.z.z`  is a  `C`  instance(`C(1)`); 
   - `b.z.z.z`  Extract  `C`  instance  `z`  attributes, i.e. integers  `1`!

> **Conclusion**: Among all serial expressions, only  `b.z.z.z`  Evaluate to get an integer  `1`.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Analysis of Highly Difficult Test Points: Complex Hierarchy and Recursive Evaluation (The A-B-C Puzzle)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Multiple inheritance and method analysis (Multiple Inheritance)

Python allows a class to be derived from multiple base classes at the same time:

[![Multiple Inheritance and Method Analysis (Multiple Inheritance) · Classroom Blackboard Demonstration (00:29:45)](</attachments/cs61a-92dfe5fa263d0dc930372876.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)
*⏱ Timestamp: 00:29:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P20 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:29:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And a $2 fee for deposits. But people will come flocking to us because we'll give them a free dollar when they open an account. This is a really good account. They call it the as seen on TV account. And the way we define this account is actually quite simple because we already have checking and savi...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Multiple Inheritance and Method Analysis (Multiple Inheritance)", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In exam questions related to "Method Overriding, super() calling and polymorphism", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing misjudgments;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
class SavingsAccount(Account):
    deposit_fee = 2
    def deposit(self, amount):
        return Account.deposit(self, amount - self.deposit_fee)

class AsSeenOnTVAccount(CheckingAccount, SavingsAccount):
    """电视购物专享神级账户：多重继承典范。"""
    def __init__(self, account_holder):
        self.holder = account_holder
        self.balance = 1  # 开户白送 1 美元福利
```

### Multiple inheritance resolution behavior

1. `withdraw`  Method: Prioritize the first base class from the left  `CheckingAccount`  Inheritance ($1 fee deducted each time).
2. `deposit`  Method: from  `SavingsAccount`  (a $2 deposit fee will be deducted each time).
3. `interest`  Properties: Both inherit from  `Account` (0.01 interest rate from  `CheckingAccount`  coverage).

Python uses  **C3 linearization algorithm (MRO, Method Resolution Order)**  It is guaranteed that subclasses are accessed before base classes, and multiple base classes are retrieved first from left to right in the order of declaration.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Multiple Inheritance and Method Analysis (Multiple Inheritance)" module, the underlying computer operations rely on strict formal evaluation logic:
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

1. **Specialization and reuse**: Subclasses inherit the base class and achieve specialization through overriding methods. Overriding methods take precedence.  `<BaseClass>.<method>(self, ...)`  Delegate old logic.
2. **Instance attribute priority traceback**: Used when searching for parameters such as handling fees  `self.attr`  Rather than hardcoding class names, retain flexibility for instance-level customization.
3. **Inheritance vs Combination Criterion**: Remember  **is-a**  Using inheritance, **has-a**  Use combination.

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
| [← Previous lecture: Lecture 19 Attributes](/en/notes/cs61a/lecture-19) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 21 Representation →](/en/notes/cs61a/lecture-21) | [🎬Watch this lecture on Bilibili (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20) |
