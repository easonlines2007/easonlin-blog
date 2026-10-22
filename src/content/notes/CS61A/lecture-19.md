---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 19 · 类属性与方法 (Attributes)
description: CS61A 第 19 讲：类属性与方法 (Attributes)
topic: CS61A
order: 19
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 3: 面向对象与效率 (OOP & Efficiency)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：17:47 ｜ **课堂截图**：15 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19)  
> **快速导航**：[← 上一讲 (P18 Lecture 18 Objects)](/notes/cs61a/lecture-18) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P20 Lecture 20 Inheritance) →](/notes/cs61a/lecture-20)

---

## 1. 核心架构与核心心智模型

在 Python 面向对象系统中，“对象即属性的容器”，而属性的查找、赋值与方法绑定遵循清晰的自底向上与环境模型机制：

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

1. **类属性 (Class Attribute)**：属于类对象本身，被所有实例共享；只占用一份内存。
2. **实例属性 (Instance Attribute)**：属于具体实例对象，各个实例相互独立。
3. **属性查找规则 (Attribute Lookup)**：
   - 先在实例字典中查找该名称；
   - 若未找到，回溯至实例所属的类中查找；
   - 若在类中找到的是普通函数，点表达式会自动将其包装为绑定到该实例的 **绑定方法 (Bound Method)**（自动预填充 `self`）。
4. **属性赋值规则 (Attribute Assignment)**：
   - `<instance>.<name> = <val>`：始终直接在**实例**上创建或修改属性（发生遮蔽 Shadowing，绝不会写回类中）；
   - `<class>.<name> = <val>`：直接修改**类属性**，所有未遮蔽该属性的实例立即可见最新值。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「1. 核心架构与核心心智模型」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 2. 类属性的定义与共享机制 (Class Attributes)

在执行 `class` 语句时，Python 会创建一个新的类对象。在类体（suite）内直接执行的赋值语句和 `def` 语句不会像普通函数那样在局部帧中绑定名字，而是全部存储在类对象自身作为**类属性**。

[![类属性的定义与共享机制 (Class Attributes) · 课堂板书演示 (00:00:45)](</attachments/cs61a-5f0a40789b5e9a387b8be0cb.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)
*⏱ 时间戳：00:00:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)*

#### 📸 课堂板书与代码演示深入精读 (00:00:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Normally, assignment in def would create names in frames, but that's not the case here. Instead, they all go in the class as class attributes. And it's really possible to write any code that you want inside of a class statement. Now, this code is not helpful at all, but it's just here to illustrate ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 类属性的定义与共享机制 (Class Attributes)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 类属性示例与实例化行为

```python
class Clown:
    nose = 'big and red'
    def dance():
        return 'No self argument here!'
```

虽然在类中可以书写任意语句，但在面向对象实际应用中，类属性的核心作用是**在所有实例间共享公共常量或默认配置**。

例如，银行账户如果所有用户统一遵循相同的利率，就可以将其定义为类属性：

[![类属性示例与实例化行为 · 课堂板书演示 (00:01:30)](</attachments/cs61a-f1489d75c503b48a846113ca.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)
*⏱ 时间戳：00:01:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:01:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)*

#### 📸 课堂板书与代码演示深入精读 (00:01:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Now, there is a good reason to create a class attribute. Class attributes are shared across all instances of a class because they're attributes of the class, not the instance. So, for example, if all accounts have the same interest rate, instead of using an instance attribute to represent the intere...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 类属性的定义与共享机制 (Class Attributes)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

> **设计要点**：
> 将 `interest` 定义为类属性意味着无需在每个账户实例中都单独保存一个浮点数，而是集中保存在 `Account` 类中，大幅降低内存开销并统一控制业务参数。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 类属性的定义与共享机制 (Class Attributes)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)

点表达式形如 `<expression> . <name>`，其求值步骤如下：

[![点表达式求值与属性查找规则 (Attribute Lookup Procedure) · 课堂板书演示 (00:03:10)](</attachments/cs61a-744c395d59fec72d50b010fc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)
*⏱ 时间戳：00:03:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:03:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)*

#### 📸 课堂板书与代码演示深入精读 (00:03:10)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“But looking up an attribute by its name is actually a process that looks in multiple places. Both instances and their classes have attributes that can both be accessed using dot expressions. And here's how a dot expression gets evaluated. First, the expression to the left of the dot gets evaluated. ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


1. **求值左侧表达式**：计算 `<expression>` 获得目标对象。
2. **实例属性匹配**：检查目标对象的实例属性中是否存在 `<name>`。若存在，直接返回其值。
3. **类属性回溯查找**：若实例中未找到，则转到该对象所属的**类 (class)** 中查找 `<name>`：
   - 若找到的值为非函数对象，直接返回该值；
   - 若找到的值是普通函数，则将其与当前实例打包，返回一个 **绑定方法 (Bound Method)**，其第一个形参 `self` 已被绑定为当前实例。
4. **属性未找到**：若类及其基类均未找到，抛出 `AttributeError`。

[![点表达式求值与属性查找规则 (Attribute Lookup Procedure) · 课堂板书演示 (00:03:55)](</attachments/cs61a-8bc7e7fb6e52209e7f6a62c0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)
*⏱ 时间戳：00:03:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:03:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)*

#### 📸 课堂板书与代码演示深入精读 (00:03:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“If no instance attribute is found with that name, then the name is looked up in the class of that object, at which point we find a class attribute value. That value is the value of the whole expression, unless it is a function, in which case a bound method is returned instead, for which the object o...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 内置函数：getattr 与 hasattr

除了点语法，Python 还提供了以字符串名称动态查询属性的内置函数：

[![内置函数：getattr 与 hasattr · 课堂板书演示 (00:04:45)](</attachments/cs61a-df483b4228bb76074c7d9633.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)*

#### 📸 课堂板书与代码演示深入精读 (00:04:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Balance for Tom account, which does exactly the same thing. There's also a HasAdder built-in function, which will tell you whether an attribute of this name exists, either for Tom account, the instance, or its class. Get Adder and dot expressions, look up a name in the same way. And looking up an at...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
getattr(tom_account, 'balance')   # 等价于 tom_account.balance
hasattr(tom_account, 'interest')  # 检查实例或其类是否存在该属性，返回 True / False
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)

属性赋值语句的形式为：`<expression> . <name> = <value>`。

[![属性赋值与遮蔽机制 (Attribute Assignment & Shadowing) · 课堂板书演示 (00:06:15)](</attachments/cs61a-fca3e7d19910bb55f8e5221a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)
*⏱ 时间戳：00:06:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)*

#### 📸 课堂板书与代码演示深入精读 (00:06:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“If I say tom account dot interest equals 0.08, that's setting an instance attribute, because the object of the dot expression is an instance. So this expression evaluates to an object. This whole thing doesn't look up interest on that object and go find it in the class. Instead, we just directly ass...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


- **实例赋值**：若 `<expression>` 求值得到的是实例，则只影响该实例的属性字典。如果该属性之前只在类中定义，此操作会为该实例新增一个同名实例属性，从而**遮蔽 (shadow)** 对应的类属性。
- **类赋值**：若 `<expression>` 求值得到的是类对象，则直接修改类属性。所有尚未遮蔽此属性的实例访问该属性时都会读取到新的修改。

### 经典推导演练：Jim 与 Tom 账户的利率演化

通过讲座中的经典案例，全面展示类属性修改与实例属性定制的动态过程：

[![经典推导演练：Jim 与 Tom 账户的利率演化 · 课堂板书演示 (00:07:45)](</attachments/cs61a-9c94c9bf1ac0894f845e7d75.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)*

#### 📸 课堂板书与代码演示深入精读 (00:07:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So this will go and change the interest attribute of the account class, which in this case already existed, and so we go change it. Okay, so here's an extended example of how attribute assignment statements affect classes and objects. Let's say I say, JimAccount is an account with Jim. Then I'm goin...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


#### 阶段 1：初始状态

```python
jim_account = Account('Jim')
tom_account = Account('Tom')
print(tom_account.interest)  # 0.02（来自 Account.interest）
print(jim_account.interest)  # 0.02（来自 Account.interest）
```

#### 阶段 2：通过类修改全局利率

[![阶段 2：通过类修改全局利率 · 课堂板书演示 (00:08:45)](</attachments/cs61a-b4bf05e3f602a48f8e109a04.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)
*⏱ 时间戳：00:08:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)*

#### 📸 课堂板书与代码演示深入精读 (00:08:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Which means looking in Tom account to see if there's an interest attribute, there's not. So then you look in the class. There it's found, 0.02, and so that's the value we see. Jim account has an interest of 0.02 as well. Next, I can set account.interest to 0.04. That changes a class attribute for th...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
Account.interest = 0.04
print(tom_account.interest)  # 0.04 (动态反映类属性变更)
print(jim_account.interest)  # 0.04 (动态反映类属性变更)
```

> **重要启示**：实例在创建时**不会**把类属性的值“拷贝并冻结”到自身中。实例只是通过回溯查找指向类属性。因此类属性随时发生变更，各实例即时可见。

#### 阶段 3：单独为特定 VIP 实例赋予特权利率 (实例遮蔽)

[![阶段 3：单独为特定 VIP 实例赋予特权利率 (实例遮蔽) · 课堂板书演示 (00:09:45)](</attachments/cs61a-7204c04c425ac95e245cf398.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)
*⏱ 时间戳：00:09:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)*

#### 📸 课堂板书与代码演示深入精读 (00:09:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“JimAccount.interest set to 0.08. This is an instance attribute assignment that adds an interest attribute to the JimAccount. Okay, so now we see interest reflected in two places, both in an instance and in the class. If we look up JimAccount's interest, we'll see 0.08, which is what we just set. If ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
# 单独为 Jim 定制 VIP 利率
jim_account.interest = 0.08

print(jim_account.interest)  # 0.08 (找到实例属性，直接返回，不再回溯)
print(tom_account.interest)  # 0.04 (tom 未遮蔽，仍回溯到 Account.interest)
```

#### 阶段 4：后续类属性调整不影响已定制实例

[![阶段 4：后续类属性调整不影响已定制实例 · 课堂板书演示 (00:10:35)](</attachments/cs61a-7d257b3faa0b6ff6be8ffedf.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)
*⏱ 时间戳：00:10:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:10:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)*

#### 📸 课堂板书与代码演示深入精读 (00:10:35)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Tom's account has an interest rate of 0.05, which just changed because of this class attribute assignment statement. Jim still has an interest rate. It's a special case, 0.08. So by assigning to the class, you don't erase all the special cases. They're still there. Calling or invoking a method on an...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
Account.interest = 0.05

print(tom_account.interest)  # 0.05 (普通用户跟随银行基准利率调整)
print(jim_account.interest)  # 0.08 (Jim 拥有专属实例属性，不受全局调整影响)
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 方法调用与绑定方法 (Methods & Bound Methods)

调用或调用对象上的方法是与对象交互的主要手段。

[![方法调用与绑定方法 (Methods & Bound Methods) · 课堂板书演示 (00:11:45)](</attachments/cs61a-8db22680a1ae368be75b7126.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)
*⏱ 时间戳：00:11:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)*

#### 📸 课堂板书与代码演示深入精读 (00:11:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“This expression evaluates to the value of the attribute. Looked up by name in the object. That's the value of the expression. So first thing you have to evaluate this expression to get the object of the dot expression. Then you can look up the attribute name. And then you can call this method. Tom a...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 方法调用与绑定方法 (Methods & Bound Methods)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


在方法调用表达式中：
```python
tom_account.deposit(10)
```
其本质是：
1. 先计算运算符子表达式 `tom_account.deposit`；
2. 该点表达式求值得到一个 **绑定方法 (Bound Method)**；
3. 将参数 `10` 传入该绑定方法进行常规调用。

[![方法调用与绑定方法 (Methods & Bound Methods) · 课堂板书演示 (00:12:55)](</attachments/cs61a-3b33e0b567f7f8a2ea37afb7.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)
*⏱ 时间戳：00:12:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:12:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)*

#### 📸 课堂板书与代码演示深入精读 (00:12:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And it is not called directly, typically, but instead happens automatically whenever you create an instance of the account class, whereas deposit and withdraw are invoked using method call expressions, just like the one we looked at on the slide. If I create an account for Alan, I can, of course, de...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 方法调用与绑定方法 (Methods & Bound Methods)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 绑定方法是一等公民 (First-Class Value)

绑定方法作为一个独立对象，可以像普通函数一样赋值给变量，或作为高阶函数的参数传递：

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

甚至可以结合惰性迭代器（如 `map`）实现批量操作：

[![将 a 的绑定方法赋值给普通变量 f · 课堂板书演示 (00:14:35)](</attachments/cs61a-c938aa03dc8709f83599513a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)
*⏱ 时间戳：00:14:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)*

#### 📸 课堂板书与代码演示深入精读 (00:14:35)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Is to deposit into A's account. And then I can decide what I want to deposit. How about 10 through 20? So, so far, I haven't made any deposits because map objects are iterators that are only evaluated lazily. But if I ask for the next M, then it is, in fact, going to deposit 10, the first element in...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 方法调用与绑定方法 (Methods & Bound Methods)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
m = map(a.deposit, range(10, 20))
# 此时尚未发生任何 deposit，因为 map 是惰性迭代器
next(m)  # 将 10 存入 a 账户
print(a.balance)  # 40 (原余额 30 + 10)
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 方法调用与绑定方法 (Methods & Bound Methods)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 函数 vs. 绑定方法深度对比 (Functions vs Bound Methods)

Python 严格区分存储在类中的“普通函数”与从实例点表达式获取到的“绑定方法”：

[![函数 vs. 绑定方法深度对比 (Functions vs Bound Methods) · 课堂板书演示 (00:15:45)](</attachments/cs61a-110e0dfc2676e918fb022dbe.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)
*⏱ 时间戳：00:15:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:15:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)*

#### 📸 课堂板书与代码演示深入精读 (00:15:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“With an instance of the class. Let's review all the terminology. All objects have attributes, which are name-value pairs that can be looked up by name. A class is a type. It's a category of objects. Classes are objects as well, so they have attributes. An instance attribute is an attribute of an ins...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 函数 vs. 绑定方法深度对比 (Functions vs Bound Methods)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![函数 vs. 绑定方法深度对比 (Functions vs Bound Methods) · 课堂板书演示 (00:16:55)](</attachments/cs61a-51a2f58a44916288e015787c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)
*⏱ 时间戳：00:16:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:16:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)*

#### 📸 课堂板书与代码演示深入精读 (00:16:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“If I write instance.methodName, I get a bound method where the method was looked up by its name. It started out as a function, but then the instance was filled in as the first argument. And so when calling this bound method, I just have to pass in the rest of the arguments. Python distinguishes betw...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 函数 vs. 绑定方法深度对比 (Functions vs Bound Methods)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「实例属性覆盖类属性、属性查找点号表达式求值规约」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


| 特征维度 | 普通函数 (Function) | 绑定方法 (Bound Method) |
| :--- | :--- | :--- |
| **获取方式** | 通过类直接访问：`Account.deposit` | 通过实例访问：`tom_account.deposit` |
| **`self` 参数** | **未绑定**，调用时必须显式传参 | **已自动绑定**，与具体实例永久绑定 |
| **调用签名** | 需要 2 个实参：`Account.deposit(tom_account, 10)` | 仅需其余实参：`tom_account.deposit(10)` |
| **类型表示** | `<function Account.deposit at 0x...>` | `<bound method Account.deposit of <Account object...>>` |

### 调用等价性定理

在底层，以下两种写法完全等价：

```python
# 方式 1：标准面向对象调用（语法糖，推荐）
tom_account.deposit(100)

# 方式 2：显式函数式调用
Account.deposit(tom_account, 100)
```

理解这一点是透彻掌握 Python 面向对象本质的关键所在：**类中的方法本质上只是第一个参数名为 `self` 的普通函数，而实例的点运算符负责将其自动包装为预填充了该实例实参的闭包式对象。**

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 函数 vs. 绑定方法深度对比 (Functions vs Bound Methods)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
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

1. **类属性单例性**：类属性在类定义时创建，存在于类命名空间中，所有实例通过指针回溯共享同一份数据。
2. **读写不对称性**：
   - **读**：实例先查自身，若无则回溯查类；
   - **写**：`instance.attr = val` 始终只写入实例自身字典，绝不污染类属性。
3. **绑定方法解耦**：绑定方法是实例与函数的固定捆绑体，可脱离原始调用点自由传递并安全执行。

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
| [← 上一讲：Lecture 18 Objects](/notes/cs61a/lecture-18) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 20 Inheritance →](/notes/cs61a/lecture-20) | [🎬 在 B 站观看本讲 (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19) |
