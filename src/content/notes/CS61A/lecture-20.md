---
title: Lecture 20 · 继承与面向对象设计 (Inheritance)
description: CS61A 第 20 讲：继承与面向对象设计 (Inheritance)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 20
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：31:35 ｜ **视频回链**：[B 站对应单集 (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20)

## 1. 核心心智模型与体系架构

继承（Inheritance）是面向对象编程中表达类与类之间层级关系的核心机制。当不同类之间具有高度相似性，仅在某些特化程度（degree of specialization）上有所差异时，继承允许子类复用基类的所有属性与行为，而只需编写那些**特化不同**的部分。

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

### 核心设计原则

1. **DRY 原则 (Don't Repeat Yourself)**：绝不通过复制粘贴代码来实现相似类；直接复用已有的基类实现。
2. **基类方法委托**：子类重写（Override）方法时，可以通过显式调用 `<BaseClass>.<method>(self, ...)` 委托旧逻辑，仅添加增量差异。
3. **继承 vs 组合**：
   - **继承 (Inheritance)**：表达 **is-a** 关系（如：支票账户 *is an* 账户）；
   - **组合 (Composition)**：表达 **has-a** 关系（如：银行 *has a* 账户列表）。

---

## 2. 继承语法与支票账户实战 (CheckingAccount)

在 Python 中，继承通过在子类的 `class` 语句括号中指定基类来实现：

![继承语法与支票账户实战 (CheckingAccount) · 课堂板书演示 (00:00:55)](</attachments/cs61a-ae95132205f13552b1e017c7.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)*

### 需求场景：CheckingAccount

- 拥有普通 `Account` 的所有基础属性与存款行为（`deposit` 无需改动）。
- 拥有更低的活期利率（`interest = 0.01`）。
- 每次取款额外扣除手续费（`withdraw_fee = 1`）。

![需求场景：CheckingAccount · 课堂板书演示 (00:02:45)](</attachments/cs61a-c67c4b1d6d978c8ec5abc60e.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)*

### 代码实现与分析

![代码实现与分析 · 课堂板书演示 (00:04:15)](</attachments/cs61a-3d6784585fbbc47b89b75c85.png>)
*⏱ 时间戳：00:04:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)*

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

> **关键技术细节**：
> 1. `Account.withdraw` 是直接从基类对象上获取的普通函数，未绑定实例，因此必须显式传入 `self`。
> 2. 这里使用 `self.withdraw_fee` 而非硬编码 `1` 或 `CheckingAccount.withdraw_fee`，使得未来具体账户实例或进一步派生的子类可以灵活定制特异的手续费。

---

## 3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)

当在子类实例上查找属性时，Python 遵循自底向上的递归查找算法：

![继承体系下的属性查找机制 (Attribute Lookup in Hierarchy) · 课堂板书演示 (00:05:45)](</attachments/cs61a-187ca64b3fcd1ecfae5533ba.png>)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)*

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

![继承体系下的属性查找机制 (Attribute Lookup in Hierarchy) · 课堂板书演示 (00:07:45)](</attachments/cs61a-d73b0f8a99f56414e91b34a0.png>)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)*

### 终端交互与运行对比

![终端交互与运行对比 · 课堂板书演示 (00:09:45)](</attachments/cs61a-6176ffb451864a32b8884900.png>)
*⏱ 时间戳：00:09:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)*

```python
a = Account('John')
b = CheckingAccount('Jack')

a.deposit(100)  # 余额 100
b.deposit(100)  # 余额 100（继承自 Account.deposit）

a.withdraw(10)  # 扣款 10，剩余 90
b.withdraw(10)  # 扣款 10 + 1 手续费，剩余 89
```

---

## 4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)

![面向对象架构设计：继承 vs 组合 (Inheritance vs Composition) · 课堂板书演示 (00:11:20)](</attachments/cs61a-64ed5a32fe44155a945e4631.png>)
*⏱ 时间戳：00:11:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:11:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)*

面向对象编程的精髓在于建立贴近现实心智模型的抽象：

![面向对象架构设计：继承 vs 组合 (Inheritance vs Composition) · 课堂板书演示 (00:12:45)](</attachments/cs61a-94bc6ae4dc51989a73664587.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)*

| 设计关系 | 关系本质 | 典型现实隐喻 | 代码体现 |
| :--- | :--- | :--- | :--- |
| **继承 (Inheritance)** | **is-a**（是一个） | CheckingAccount 是一个 Account | `class CheckingAccount(Account):` |
| **组合 (Composition)** | **has-a**（有一个） | Bank 有多个 Account 账户 | `self.accounts = []` 作为实例属性 |

### 实战：设计 Bank 银行类

银行管理多个账户，因此银行不应该继承自账户，而是通过组合持有账户：

![实战：设计 Bank 银行类 · 课堂板书演示 (00:14:35)](</attachments/cs61a-efd8c93b2f3eca4a7d9f55da.png>)
*⏱ 时间戳：00:14:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)*

![实战：设计 Bank 银行类 · 课堂板书演示 (00:17:15)](</attachments/cs61a-e1a78feb9a2a991cf36ba319.png>)
*⏱ 时间戳：00:17:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)*

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

> **设计之美**：`open_account` 接受 `kind` 参数（默认为 `Account`），允许开立任意符合 `Account` 接口的子类账户（如 `CheckingAccount`），多态与组合浑然一体。

---

## 5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)

讲座中，DeNero 教授给出了一个全面考察继承、覆盖、构造器链与点运算符回溯的高难度综合挑战：

![高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle) · 课堂板书演示 (00:18:55)](</attachments/cs61a-398fc5366255d182dbcd7e81.png>)
*⏱ 时间戳：00:18:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:18:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)*

### 题目代码定义

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

![题目代码定义 · 课堂板书演示 (00:20:25)](</attachments/cs61a-3dd96322e9c0eb5825dfd518.png>)
*⏱ 时间戳：00:20:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:20:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)*

### 逐步求值推导

#### 表达式 1：`C(2).n`

![表达式 1：C(2).n · 课堂板书演示 (00:23:45)](</attachments/cs61a-ab1140fe06b8407b08d3c20d.png>)
*⏱ 时间戳：00:23:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)*

1. `C(2)`：实例化 `C`。`C` 本身没有 `__init__`，回溯至基类 `B.__init__` 执行，`y = 2`。
2. `y = 2` 为真，执行 `self.z = self.f(2)`。
3. `self` 是 `C` 的实例，查找 `f` 命中 `C.f`（恒等函数），故 `self.z = 2`。
4. 随后查找 `.n`：`C` 实例没有 `n`，`C` 类没有 `n`，回溯至 `B.n`，得到 `4`。
5. **结果**：`4`。

#### 表达式 2：`a.z == C.z`

1. `a.z`：`a` 为 `A` 实例，无实例属性 `z`，回溯至 `A.z = -1`。
2. `C.z`：类 `C` 无属性 `z`，基类 `B` 无属性 `z`，基类 `A.z = -1`。
3. 两者均指向 `A.z`，结果为 `True`。

#### 表达式 3：`b.z.z.z` 与整数判定

![表达式 3：b.z.z.z 与整数判定 · 课堂板书演示 (00:26:30)](</attachments/cs61a-5cd7e2899dd57f91ea7f1bc9.png>)
*⏱ 时间戳：00:26:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)*

![表达式 3：b.z.z.z 与整数判定 · 课堂板书演示 (00:28:20)](</attachments/cs61a-5dac9d516e4e9b429d33a78d.png>)
*⏱ 时间戳：00:28:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:28:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)*

推导 `b = B(1)` 的嵌套构造：
1. `B(1)`：`y = 1`，调用 `self.f(1)`。`B` 没有 `f`，回溯至 `A.f`，返回 `B(1 - 1)` 即 `B(0)`。
2. `B(0)`：`y = 0` 为假，进入 `else` 分支，执行 `self.z = C(0 + 1)` 即 `C(1)`。
3. `C(1)`：调用 `B.__init__`，`y = 1` 为真，调用 `self.f(1)`。由于 `self` 是 `C` 的实例，查找 `f` 命中 `C.f`，返回整数 `1`！
4. 追溯整个引用链：
   - `b` 是一个 `B` 实例；
   - `b.z` 是另一个 `B` 实例（`B(0)`）；
   - `b.z.z` 是一个 `C` 实例（`C(1)`）；
   - `b.z.z.z` 提取 `C` 实例的 `z` 属性，即整数 `1`！

> **结论**：在所有连缀表达式中，唯有 `b.z.z.z` 求值得到整数 `1`。

---

## 6. 多重继承与方法解析 (Multiple Inheritance)

Python 允许一个类同时从多个基类派生：

![多重继承与方法解析 (Multiple Inheritance) · 课堂板书演示 (00:29:45)](</attachments/cs61a-92dfe5fa263d0dc930372876.png>)
*⏱ 时间戳：00:29:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)*

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

### 多重继承解析行为

1. `withdraw` 方法：优先从左侧第一个基类 `CheckingAccount` 中继承（每次扣取 1 美元手续费）。
2. `deposit` 方法：从 `SavingsAccount` 中继承（每次扣取 2 美元存款手续费）。
3. `interest` 属性：两者共同继承自 `Account`（0.01 利率来自 `CheckingAccount` 的覆盖）。

Python 使用 **C3 线性化算法（MRO, Method Resolution Order）** 保证子类在基类之前被访问，多基类按声明顺序自左向右优先检索。

---

## 7. 章节总结与核心考点

1. **特化与复用**：子类继承基类，通过重写方法实现特化，重写方法中优先通过 `<BaseClass>.<method>(self, ...)` 委托旧逻辑。
2. **实例属性优先回溯**：查找手续费等参数时使用 `self.attr` 而非硬编码类名，为实例级定制保留灵活性。
3. **继承 vs 组合判据**：牢记 **is-a** 用继承，**has-a** 用组合。

---

