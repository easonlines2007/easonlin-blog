---
kind: notes
source: cs61a/lecture-20
title: Lecture 20 · Inheritance and Object-Oriented Design
description: "CS61A Lecture 20: Inheritance and object-oriented design."
sourceHash: 91d6afee297523728993413124aed9523fe6595859af4a214c799d885c20c0c8
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 31:35 ｜ **Video link back**: [B station response unit set (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20)

## 1. Core mind model and system architecture

Inheritance is the central mechanism for expressing a class-to-class level relationship in object-oriented programming. When there are high similarities between different classes and only differences in certain degrees of specialization, inheritance allows subtypes to reproduce all properties and behaviors of the base class, but only those that are written down as well. **The characteristics are different** The part.

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

### Core design principles

1. **The DRY principle (Don't Repeat Yourself)** Similar classes are never implemented by copying the paste code; they are directly implemented by replicating existing base classes.
2. **The basic methodology** Subclass: Override method, which can be used to express calls  `<BaseClass>.<method>(self, ...)`  The old logic is being used to add more differences.
3. **The combination of inheritance vs.**: 
   - **Inheritance** Expression:  **is-a**  Relationships: such as checking accounts  *is an*  The account;
   - **The composition** Expression:  **has-a**  Relationships: Banking  *has a*  The list of accounts)

---

## 2. inheritance grammar and checking account

In Python, inheritance is a process that involves the use of a subclass to create a sequence of characters.  `class`  In the phrase brackets, specify a base class to achieve:

![inheritance Syntax: CheckingAccount lecture board illustration (00:00:55)](</attachments/cs61a-ae95132205f13552b1e017c7.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P20 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)*

### The scene of the need: CheckingAccount

- Have a common  `Account`  All the basic properties and deposit behaviour of `deposit`  The new rules are not changed.
- The lowest life-term interest rates are: `interest = 0.01`).
- The government has also announced that the new rules will be implemented in the coming months. `withdraw_fee = 1`).

![Demand scenario: CheckingAccount lecture board illustration (00:02:45)](</attachments/cs61a-c67c4b1d6d978c8ec5abc60e.png>)
*⏱ Timestamp: 00:02:45 · 📷 Lecture screenshot · [Watch clip (P20 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)*

### Code implementation and analysis

![Code realization and analysis lecture board illustration (00:04:15)](</attachments/cs61a-3d6784585fbbc47b89b75c85.png>)
*⏱ Timestamp: 00:04:15 · 📷 Lecture screenshot · [Watch clip (P20 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)*

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
> 1. `Account.withdraw`  is a normal function obtained directly from base class objects, unbound instance, and must therefore be explicitly input  `self`.
> 2. Use here  `self.withdraw_fee`  It's not hard code.  `1`  or  `CheckingAccount.withdraw_fee` The new rules allow for flexible customization of the specificity of the fees for future specific account instances or subsequent derivative subclasses.

---

## 3. Properties search mechanism under the inheritance system (Attribute Lookup in Hilarchy)

When searching for properties in subclass instances, Python follows the bottom-up recursion search algorithm:

![Properties search mechanism under the inheritance system (Attribute Lookup in Hierarchy) lecture board illustration (00:05:45)](</attachments/cs61a-187ca64b3fcd1ecfae5533ba.png>)
*⏱ Timestamp: 00:05:45 · 📷 Lecture screenshot · [Watch clip (P20 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)*

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

![inheritance Properties search mechanism under the system (Atribute Lookup in Hierarchy) lecture board illustration (00:07:45)](</attachments/cs61a-d73b0f8a99f56414e91b34a0.png>)
*⏱ Timestamp: 00:07:45 · 📷 Lecture screenshot · [Watch clip (P20 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)*

### The difference between terminal interaction and operation

![lecture board illustration (00:09:45)](</attachments/cs61a-6176ffb451864a32b8884900.png>)
*⏱ Timestamp: 00:09:45 · 📷 Lecture screenshot · [Watch clip (P20 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)*

```python
a = Account('John')
b = CheckingAccount('Jack')

a.deposit(100)  # 余额 100
b.deposit(100)  # 余额 100（继承自 Account.deposit）

a.withdraw(10)  # 扣款 10，剩余 90
b.withdraw(10)  # 扣款 10 + 1 手续费，剩余 89
```

---

## 4. object-oriented architecture design: inheritance vs composition

![object-oriented Architecture Design: inheritance vs Group (Inheritance vs Company) . lecture board illustration (00:11:20)](</attachments/cs61a-64ed5a32fe44155a945e4631.png>)
*⏱ Timestamp: 00:11:20 · 📷 Lecture screenshot · [Watch clip (P20 00:11:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)*

The essence of object-oriented programming is to create abstractions that are close to the real model of mind:

![object-oriented architecture design: inheritance vs combination (Inheritance vs Company) . lecture board illustration (00:12:45)](</attachments/cs61a-94bc6ae4dc51989a73664587.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P20 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)*

| Design Relationships | The nature of relationships | Typical metaphors of reality | Code is embodied |
| :--- | :--- | :--- | :--- |
| **Inheritance** | **is-a** (One) | Checking Account is an account | `class CheckingAccount(Account):` |
| **The composition** | **has-a** (One) | Bank accounts with multiple accounts | `self.accounts = []`  As an instance attribute |

### Practice: Designing a Bank Class

Banks manage multiple accounts, so banks should not have inheritance own accounts, but rather through portfolio holding accounts:

![Operational: Design Bank Bank Bank Bank type lecture board illustration (00:14:35)](</attachments/cs61a-efd8c93b2f3eca4a7d9f55da.png>)
*⏱ Timestamp: 00:14:35 · 📷 Lecture screenshot · [Watch clip (P20 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)*

![Operational: Design Bank Bank Bank Group lecture board illustration (00:17:15)](</attachments/cs61a-e1a78feb9a2a991cf36ba319.png>)
*⏱ Timestamp: 00:17:15 · 📷 Lecture screenshot · [Watch clip (P20 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)*

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

> **The beauty of design**: `open_account`  Acceptance  `kind`  The argument is that  `Account` (a) allowing any open  `Account`  Sub-accounts of the interface:  `CheckingAccount` Polymorphism is a combination of both.

---

## High difficulty factor analysis: complex level and recursionevaluation (The A-B-C Puzzle)

In his lecture, Professor DeNero presented a comprehensive examination of the complexity of inheritance, coverage, constructor chain and point operator retracement:

![Difficulty point analysis: Complex level with recursion evaluation (The A-B-C Puzzle) lecture board illustration (00:18:55)](</attachments/cs61a-398fc5366255d182dbcd7e81.png>)
*⏱ Timestamp: 00:18:55 · 📷 Lecture screenshot · [Watch clip (P20 00:18:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)*

### Title code definition

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

![Definition of title code lecture board illustration (00:20:25)](</attachments/cs61a-3dd96322e9c0eb5825dfd518.png>)
*⏱ Timestamp: 00:20:25 · 📷 Lecture screenshot · [Watch clip (P20 00:20:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)*

### Progressive evaluation extrapolation

#### Expression 1: `C(2).n`

![expression 1:C(2).n lecture board illustration (00:23:45)](</attachments/cs61a-ab1140fe06b8407b08d3c20d.png>)
*⏱ Timestamp: 00:23:45 · 📷 Lecture screenshot · [Watch clip (P20 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)*

1. `C(2)` Example:  `C`.`C`  I didn't have it myself.  `__init__` Back to the basics  `B.__init__`  The execution `y = 2`.
2. `y = 2`  The truth, the execution  `self.z = self.f(2)`.
3. `self`  Yes, I did.  `C`  The example of searching  `f`  Life is good.  `C.f` (equal function), so  `self.z = 2`.
4. Then search for  `.n`: `C`  There are no examples  `n`, `C`  Class No  `n` I'm going back to  `B.n`, get  `4`.
5. **The results**: `4`.

#### Expression 2: `a.z == C.z`

1. `a.z`: `a`  For the  `A`  Example, no instance attribute  `z` I'm going back to  `A.z = -1`.
2. `C.z` The following categories:  `C`  It is not a property  `z` Sub-class  `B`  It is not a property  `z` Sub-class  `A.z = -1`.
3. Both points to  `A.z` The result is  `True`.

#### Expression 3: `b.z.z.z`  and checking for integers

![expression 3: b.z.z.z and integer determinations . lecture board illustration (00:26:30)](</attachments/cs61a-5cd7e2899dd57f91ea7f1bc9.png>)
*⏱ Timestamp: 00:26:30 · 📷 Lecture screenshot · [Watch clip (P20 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)*

![expression 3:b.z.z.z and integer determination lecture board illustration (00:28:20)](</attachments/cs61a-5dac9d516e4e9b429d33a78d.png>)
*⏱ Timestamp: 00:28:20 · 📷 Lecture screenshot · [Watch clip (P20 00:28:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)*

The following is a list of the topics covered:  `b = B(1)`  The nested structure:
1. `B(1)`: `y = 1` Calling  `self.f(1)`.`B`  No, not yet.  `f` I'm going back to  `A.f`, return  `B(1 - 1)`  That's what I mean.  `B(0)`.
2. `B(0)`: `y = 0`  For the sake of falsehood, enter  `else`  Branch, execution  `self.z = C(0 + 1)`  That's what I mean.  `C(1)`.
3. `C(1)` Calling:  `B.__init__`, `y = 1`  Calling for truth  `self.f(1)` Because of  `self`  Yes, I did.  `C`  The example of searching  `f`  Life is good.  `C.f`, returning the integer  `1`!
4. The link to the entire chain:
   - `b`  It's one.  `B`  Examples;
   - `b.z`  It's another one.  `B`  The following examples: `B(0)`); 
   - `b.z.z`  It's one.  `C`  The following examples: `C(1)`); 
   - `b.z.z.z`  Mining  `C`  The example  `z`  The properties, or integers  `1`!

> **Conclusion** In all the consonant expressions, only  `b.z.z.z`  evaluation is given by the integers  `1`.

---

## 6. Multiple Inheritance and method analysis

Python allows a class to be derived from multiple base classes at the same time:

![Multiple inheritance and Method Resolution (Multiple Inheritance) lecture board illustration (00:29:45)](</attachments/cs61a-92dfe5fa263d0dc930372876.png>)
*⏱ Timestamp: 00:29:45 · 📷 Lecture screenshot · [Watch clip (P20 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)*

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

### Multiple inheritance analysis behavior

1. `withdraw`  Method: Priority first base class from left  `CheckingAccount`  Inheritance (in English: inheritance) is a $1.00 fee.
2. `deposit`  The method:  `SavingsAccount`  Inheritance (inheritance) - $2.00 for each withdrawal.
3. `interest`  Attributes: The two shared inheritance of the same  `Account` The rate of interest is 0.01 from the  `CheckingAccount`  The coverage of the

Python is used  **C3 Linear algorithm (MRO, Method Resolution Order)**  The collateral subclass is accessed before the base class, and the multi-base class is retrieved in priority from left to right in declared order.

---

## Chapter 7 Summary and Core Points

1. **Specialization and reuse** Sub-class: Inheritance base class, characterization achieved through rewriting method, priority passed in rewriting methods  `<BaseClass>.<method>(self, ...)`  I'm not going to be able to do this.
2. **The instance attribute is backed up**: Used for finding parameters such as fees  `self.attr`  The name of the class is not hardcoded, but it retains flexibility for customization at the instance level.
3. **The following is a list of the most common types of inheritance:** Remember:  **is-a**  Inheritance is the right thing to do. **has-a**  I'm not sure.

---

