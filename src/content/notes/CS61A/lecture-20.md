---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 20 · 继承与面向对象设计 (Inheritance)
description: CS61A 第 20 讲：继承与面向对象设计 (Inheritance)
topic: CS61A
order: 20
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 3: 面向对象与效率 (OOP & Efficiency)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：31:35 ｜ **课堂截图**：16 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20)  
> **快速导航**：[← 上一讲 (P19 Lecture 19 Attributes)](/notes/cs61a/lecture-19) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P21 Lecture 21 Representation) →](/notes/cs61a/lecture-21)

---

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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「1. 核心心智模型与体系架构」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 2. 继承语法与支票账户实战 (CheckingAccount)

在 Python 中，继承通过在子类的 `class` 语句括号中指定基类来实现：

[![继承语法与支票账户实战 (CheckingAccount) · 课堂板书演示 (00:00:55)](</attachments/cs61a-ae95132205f13552b1e017c7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=55)*

#### 📸 课堂板书与代码演示深入精读 (00:00:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“It's when you have two similar classes that differ in their degree of specialization. So the specialized class might have all the same attributes as the general class, along with some special case behavior. The way you express this syntactically in Python is that in addition to having a class statem...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 继承语法与支票账户实战 (CheckingAccount)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 需求场景：CheckingAccount

- 拥有普通 `Account` 的所有基础属性与存款行为（`deposit` 无需改动）。
- 拥有更低的活期利率（`interest = 0.01`）。
- 每次取款额外扣除手续费（`withdraw_fee = 1`）。

[![需求场景：CheckingAccount · 课堂板书演示 (00:02:45)](</attachments/cs61a-c67c4b1d6d978c8ec5abc60e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=165)*

#### 📸 课堂板书与代码演示深入精读 (00:02:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And, when we withdraw money, we have to pay an extra dollar. Okay, here's how we write the code for this checking account. We say there's a class called checking account. Its base class is account. Another way of saying the same thing. We'll create a class called checking account that inherits from ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 继承语法与支票账户实战 (CheckingAccount)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 代码实现与分析

[![代码实现与分析 · 课堂板书演示 (00:04:15)](</attachments/cs61a-3d6784585fbbc47b89b75c85.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)
*⏱ 时间戳：00:04:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=255)*

#### 📸 课堂板书与代码演示深入精读 (00:04:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Whatever the withdraw fee is for this current account. Now, why do I keep saying current account when it says self right there? Well, remember that self is the name we use to refer to the object on which this method gets invoked. So, when we actually call withdraw right here, self will be bound to t...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 继承语法与支票账户实战 (CheckingAccount)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 继承语法与支票账户实战 (CheckingAccount)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)

当在子类实例上查找属性时，Python 遵循自底向上的递归查找算法：

[![继承体系下的属性查找机制 (Attribute Lookup in Hierarchy) · 课堂板书演示 (00:05:45)](</attachments/cs61a-187ca64b3fcd1ecfae5533ba.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=345)*

#### 📸 课堂板书与代码演示深入精读 (00:05:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“If a subclass that isn't changed is just the same as whatever the base class was. So to look up a name in a class, here's what you do. If it names an attribute that's in that class, then return the attribute value. Remember, attributes are named value pairs. If not, look up that name in the base cla...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

[![继承体系下的属性查找机制 (Attribute Lookup in Hierarchy) · 课堂板书演示 (00:07:45)](</attachments/cs61a-d73b0f8a99f56414e91b34a0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=465)*

#### 📸 课堂板书与代码演示深入精读 (00:07:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So in addition to the class that we have, we're going to create a class checking account, which inherits from account. It has a different interest rate. It has a fee associated with all withdrawals of one dollar. And the way that fee gets used is that we write a withdraw method that withdraws not ju...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 终端交互与运行对比

[![终端交互与运行对比 · 课堂板书演示 (00:09:45)](</attachments/cs61a-6176ffb451864a32b8884900.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)
*⏱ 时间戳：00:09:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=585)*

#### 📸 课堂板书与代码演示深入精读 (00:09:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And then another account, which is a checking account for my good friend Jack. So A is an account, B is a checking account. They both have a balance of zero. Let's add a balance to each by depositing into 100 in A and depositing 100 in B. Now, both of those did the same thing because they're both us...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
a = Account('John')
b = CheckingAccount('Jack')

a.deposit(100)  # 余额 100
b.deposit(100)  # 余额 100（继承自 Account.deposit）

a.withdraw(10)  # 扣款 10，剩余 90
b.withdraw(10)  # 扣款 10 + 1 手续费，剩余 89
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. 继承体系下的属性查找机制 (Attribute Lookup in Hierarchy)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)

[![面向对象架构设计：继承 vs 组合 (Inheritance vs Composition) · 课堂板书演示 (00:11:20)](</attachments/cs61a-64ed5a32fe44155a945e4631.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)
*⏱ 时间戳：00:11:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:11:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=680)*

#### 📸 课堂板书与代码演示深入精读 (00:11:20)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“As exists in the base class. So here we see the checking account class has withdraw, which also exists in the account class. But, even though we've overridden that name, meaning the checking accounts will call this withdraw instead of the original withdraw, we can still access them and use them usin...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


面向对象编程的精髓在于建立贴近现实心智模型的抽象：

[![面向对象架构设计：继承 vs 组合 (Inheritance vs Composition) · 课堂板书演示 (00:12:45)](</attachments/cs61a-94bc6ae4dc51989a73664587.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=765)*

#### 📸 课堂板书与代码演示深入精读 (00:12:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“We'll use the one from the account. Okay, so here we have attribute lookup on a base class, and here we have looking up an instance attribute, and that's preferred to looking up checking account.withdrawfee, because it allows for specialized accounts, either through further subclasses or by giving i...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


| 设计关系 | 关系本质 | 典型现实隐喻 | 代码体现 |
| :--- | :--- | :--- | :--- |
| **继承 (Inheritance)** | **is-a**（是一个） | CheckingAccount 是一个 Account | `class CheckingAccount(Account):` |
| **组合 (Composition)** | **has-a**（有一个） | Bank 有多个 Account 账户 | `self.accounts = []` 作为实例属性 |

### 实战：设计 Bank 银行类

银行管理多个账户，因此银行不应该继承自账户，而是通过组合持有账户：

[![实战：设计 Bank 银行类 · 课堂板书演示 (00:14:35)](</attachments/cs61a-efd8c93b2f3eca4a7d9f55da.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)
*⏱ 时间戳：00:14:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=875)*

#### 📸 课堂板书与代码演示深入精读 (00:14:35)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And an account won't inherit from a bank. They're related in that one has the other as an attribute, but they're not related according to inheritance. So let's design a bank real quick. A bank won't inherit from account because a bank has accounts. And what will it look like to use a bank? Well, cre...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![实战：设计 Bank 银行类 · 课堂板书演示 (00:17:15)](</attachments/cs61a-e1a78feb9a2a991cf36ba319.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)
*⏱ 时间戳：00:17:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1035)*

#### 📸 课堂板书与代码演示深入精读 (00:17:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“We have to remember that this is one of our accounts, as opposed to an account in another bank. So we're going to add this account to our list of accounts, and then we can return it. Okay, what's the last piece of the implementation? We have to be able to pay interest. Paying interest takes no argum...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 面向对象架构设计：继承 vs 组合 (Inheritance vs Composition)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)

讲座中，DeNero 教授给出了一个全面考察继承、覆盖、构造器链与点运算符回溯的高难度综合挑战：

[![高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle) · 课堂板书演示 (00:18:55)](</attachments/cs61a-398fc5366255d182dbcd7e81.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)
*⏱ 时间戳：00:18:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:18:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1135)*

#### 📸 课堂板书与代码演示深入精读 (00:18:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Let's stress test our understanding of attribute lookup and inheritance by working through a slightly more complex example. Here it is. I suggest that you pause the video and try to figure out what happens after you run all of this code on the left and then evaluate these three expressions on the ri...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

[![题目代码定义 · 课堂板书演示 (00:20:25)](</attachments/cs61a-3dd96322e9c0eb5825dfd518.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)
*⏱ 时间戳：00:20:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:20:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1225)*

#### 📸 课堂板书与代码演示深入精读 (00:20:25)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Now, the class itself has two class attributes. Z is negative one due to this assignment statement, and F is the function that returns B of X minus one. This function, like any other function, does have a parent frame. All of the functions in this example have parent frame global, so I'm not going t...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 逐步求值推导

#### 表达式 1：`C(2).n`

[![表达式 1：C(2).n · 课堂板书演示 (00:23:45)](</attachments/cs61a-ab1140fe06b8407b08d3c20d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)
*⏱ 时间戳：00:23:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1425)*

#### 📸 课堂板书与代码演示深入精读 (00:23:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Now I think we're in a good position to review some of these. Eventually, we're going to have to fill in what Z was, but let's solve the first two here before we do that. So C of 2 dot n. Here's an expression that has to evaluate to some object. In this case, it evaluates to an instance of the C cla...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

[![表达式 3：b.z.z.z 与整数判定 · 课堂板书演示 (00:26:30)](</attachments/cs61a-5cd7e2899dd57f91ea7f1bc9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)
*⏱ 时间戳：00:26:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1590)*

#### 📸 课堂板书与代码演示深入精读 (00:26:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“We never really wrote down what it is, but I'm pretty sure it's not going to come out negative one. I think it's time that we figure out what it does equal. When this instance was created, we passed in one as the value for y, self is bound to the instance itself. We checked that y was true, and so w...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![表达式 3：b.z.z.z 与整数判定 · 课堂板书演示 (00:28:20)](</attachments/cs61a-5dac9d516e4e9b429d33a78d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)
*⏱ 时间戳：00:28:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:28:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1700)*

#### 📸 课堂板书与代码演示深入精读 (00:28:20)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Okay, so it's quite clear that this is negative 1, and this is some b instance, and those can't be equal. And now we can move on to which of these expressions evaluates to an integer. b.c is a b instance. b.z.z is a c instance. b.z.z.z is 1. And 1.z is nothing at all. That would be an error. So only...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 高难度考点剖析：复杂层级与递归求值 (The A-B-C Puzzle)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 多重继承与方法解析 (Multiple Inheritance)

Python 允许一个类同时从多个基类派生：

[![多重继承与方法解析 (Multiple Inheritance) · 课堂板书演示 (00:29:45)](</attachments/cs61a-92dfe5fa263d0dc930372876.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)
*⏱ 时间戳：00:29:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P20 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20&t=1785)*

#### 📸 课堂板书与代码演示深入精读 (00:29:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And a $2 fee for deposits. But people will come flocking to us because we'll give them a free dollar when they open an account. This is a really good account. They call it the as seen on TV account. And the way we define this account is actually quite simple because we already have checking and savi...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 多重继承与方法解析 (Multiple Inheritance)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「方法重写 (Method Overriding)、super() 调用与多态性」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 多重继承与方法解析 (Multiple Inheritance)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 7. 章节总结与核心考点

1. **特化与复用**：子类继承基类，通过重写方法实现特化，重写方法中优先通过 `<BaseClass>.<method>(self, ...)` 委托旧逻辑。
2. **实例属性优先回溯**：查找手续费等参数时使用 `self.attr` 而非硬编码类名，为实例级定制保留灵活性。
3. **继承 vs 组合判据**：牢记 **is-a** 用继承，**has-a** 用组合。

### 深入形式化规约与微观求值流程（Operational Semantics）
在「7. 章节总结与核心考点」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。



---

## 伯克利 Midterm / Final 经典高频考题深度演练

### 实战考题：环境拓扑与微观状态追踪（WWPD & Environment Diagrams）
考虑以下 Python 代码在交互式环境中的微观执行过程：

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

#### 完整解题思维模型与多帧环境图推导：
1. **全局帧（Global Frame）初始化**：
   - 全局变量 `x` 绑定到整数对象 `10`；
   - 全局函数 `outer` 绑定到新创建的函数对象，其内嵌 `parent = Global`；
2. **执行 `f = outer(5)`**：
   - 开辟局部帧 $f_1$，标注 `f1: outer [parent=Global]`；
   - 形参 `x` 绑定到实参 `5`；
   - 局部变量 `y` 绑定到 `5 + 2 = 7`；
   - 在 $f_1$ 内部执行 `def inner(y):`，创建函数对象 `inner`，其内嵌 **`parent = f1`**；
   - 返回函数对象 `inner`，全局变量 `f` 绑定到该对象；
3. **执行 `result = f(3)`**：
   - 调用函数 `f`（即 `inner`），开辟局部帧 $f_2$；
   - **核心判分点**：帧 $f_2$ 的 parent 指向谁？
   - **铁律**：函数 `inner` 是在帧 $f_1$ 内部被定义的，因此 $f_2$ 的 **`parent = f1`**！
   - 形参 `y` 绑定到实参 `3`；
   - 执行体 `return x + y`：
     - 在当前帧 $f_2$ 查找 `y`：命中局部变量 `y = 3`；
     - 在当前帧 $f_2$ 查找 `x`：未命中，沿 parent 回溯到 **$f_1$ 帧** 查找！
     - 在 $f_1$ 帧中命中 `x = 5`（全局的 `x = 10` 被局部遮蔽！）；
     - 计算 `5 + 3 = 8`，作为返回值；
4. **最终输出结论**：
   - 全局变量 `result = 8`。

---

## 本讲核心概念知识矩阵 (Knowledge Matrix)

| 核心知识维度 | 形式化定义与机制 | 典型代码示例 | 核心工程与算法价值 | 常见易错陷阱 |
| :--- | :--- | :--- | :--- | :--- |
| **基础求值语义** | 表达式求值得到值，语句执行改变内部状态 | `x = 2 + 3` | 建立离散时间状态快照心智模型 | 误将赋值等号当作代数方程动态约束 |
| **环境帧拓扑** | 环境是一系列帧构成的有序链条 | `Global -> f1 -> f2` | 实现词法作用域与变量安全隔离 | 混淆调用者栈帧与定义处父环境指针 |
| **抽象屏障** | 通过函数接口隔离实现细节与调用逻辑 | `def square(x): ...` | 降低大规模系统认知负荷 | 破坏接口直接依赖底层私有数据结构 |
| **控制流决策** | 条件分支短路求值与循环迭代递进 | `if cond: ... while: ...` | 赋予程序非线性决策与大规模数据处理能力 | 遗漏循环递进变量引发死循环 |
| **高阶能力** | 函数作为一等公民（传参、返回、赋值） | `make_adder(3)` | 实现工厂模式、闭包持久状态与柯里化 | 闭包后期绑定引发循环变量捕获错误 |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：Lecture 19 Attributes](/notes/cs61a/lecture-19) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 21 Representation →](/notes/cs61a/lecture-21) | [🎬 在 B 站观看本讲 (P20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=20) |
