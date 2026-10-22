---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 21 · 对象表示与多态接口 (Representation)
description: CS61A 第 21 讲：对象表示与多态接口 (Representation)
topic: CS61A
order: 21
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 3: 面向对象与效率 (OOP & Efficiency)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：30:31 ｜ **课堂截图**：17 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21)  
> **快速导航**：[← 上一讲 (P20 Lecture 20 Inheritance)](/notes/cs61a/lecture-20) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P22 Lecture 22 Composition) →](/notes/cs61a/lecture-22)

---

## 1. 核心心智模型与架构图解

面向对象隐喻的核心原则之一：**对象应当表现得像它所代表的真实数据**。其中至关重要的能力是，对象必须能够将自身序列化或格式化为字符串。

在 Python 中，字符串表示被明确解耦为两种针对不同受众的形式：

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

此外，Python 通过 **特殊方法（Special Methods / Dunder Methods）** 建立了语法与底层消息传递的对应关系，使自定义类能够优雅地支持运算符重载（如 `+`）、布尔转换与类型分发。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「1. 核心心智模型与架构图解」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 2. 规范表示 vs 人类可读表示 (repr vs str)

[![规范表示 vs 人类可读表示 (repr vs str) · 课堂板书演示 (00:01:15)](</attachments/cs61a-bfe38ff9de2e3bee23303bbe.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)
*⏱ 时间戳：00:01:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)*

#### 📸 课堂板书与代码演示深入精读 (00:01:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Now, a lot of times, the str and repper string are the same, because Python was designed to be a language that people could read, and so, a lot of the expressions have exactly the same form as a person might write down when they try to communicate the same idea. You write the number 1 in either case...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 规范表示 vs 人类可读表示 (repr vs str)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 规范字符串表示：repr

内置函数 `repr(object)` 返回对象的**规范字符串表示（Canonical Representation）**：

[![规范字符串表示：repr · 课堂板书演示 (00:02:45)](</attachments/cs61a-bd08283641829c693194933c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)*

#### 📸 课堂板书与代码演示深入精读 (00:02:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“The result of calling repr on a value is exactly what you see in an interactive session. It's what Python prints out right below the expression you evaluated. So if I evaluate this expression, which represents 12 times 10 to the 12th power, the canonical string representation is 1 and then 2 and the...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 规范表示 vs 人类可读表示 (repr vs str)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


- **官方契约**：对于大多数内置和常用类型，`eval(repr(object))` 应当求值为一个与原对象等价的新对象。
- **呈现时机**：在交互式 Python REPL 中直接输入表达式回车后，控制台显示的就是该对象经由 `repr()` 处理后的结果。

> **例外情况**：对于诸如内置函数 `min` 或自定义类等无法以单一字面量表达式完全重建的复杂对象，Python 会退而求其次使用角括号形式的代理字符串，如 `<built-in function min>`。

### 人类可读字符串表示：str

内置函数 `str(object)` 返回易于人类阅读的描述：

[![人类可读字符串表示：str · 课堂板书演示 (00:04:15)](</attachments/cs61a-52d846317f76cde9d8255168.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)
*⏱ 时间戳：00:04:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)*

#### 📸 课堂板书与代码演示深入精读 (00:04:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Human interpretal strings are useful as well, and so we'd like to have our programs be able to generate them, because oftentimes the program wants to communicate something with the user. So here's an example. There's a fractions module, part of the standard library, and it has a fraction class. A fr...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 规范表示 vs 人类可读表示 (repr vs str)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


- **目标**：清晰明了、符合常识，无需保证可由 Python 解析器重新求值。
- **呈现时机**：调用 `print(object)` 时，控制台输出的就是对象的 `str()`。

### 经典对比：Fraction (分数类)

[![经典对比：Fraction (分数类) · 课堂板书演示 (00:05:45)](</attachments/cs61a-f0799bc72a9c79790e505137.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)*

#### 📸 课堂板书与代码演示深入精读 (00:05:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“The str string of half is 1 divided by 2. Now, if I evaluate the repper string of half, I get the fraction. It's a different object, but it's this equivalent, right? If I evaluate the str string of half, in this case, it turns out that is a valid Python expression, but that's just kind of coincidenc...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 规范表示 vs 人类可读表示 (repr vs str)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 字符串对象自身的引号机制

对字符串本身调用 `repr` 与 `str` 体现了微妙而本质的区别：

[![字符串对象自身的引号机制 · 课堂板书演示 (00:07:15)](</attachments/cs61a-239e241e09563c9f9f59b299.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)
*⏱ 时间戳：00:07:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)*

#### 📸 课堂板书与代码演示深入精读 (00:07:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“It's just S. Now, what happens if I just call repr of S? I see quotes within quotes. What's going on there? Well, what repr is giving me is a string, where if I evaluated it, I'd get back the original string. And what if I called the repr of the repr of the repr of S? I'd get a mess. What's going on...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 规范表示 vs 人类可读表示 (repr vs str)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
s = "Hello, world"

print(s)        # 输出: Hello, world (str 表现形式，无外层引号)
print(repr(s))  # 输出: 'Hello, world' (repr 带有合法字符串字面量所需的外层引号)

eval(repr(s))   # 得到字符串 "Hello, world"
# 若直接 eval(s)，由于缺少引号会将 Hello 视作变量名而抛出 NameError！
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 规范表示 vs 人类可读表示 (repr vs str)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. F-Strings 与字符串插值 (String Interpolation)

F-string（格式化字符串字面量）是 Python 中最优雅、最高效的字符串插值语法：

[![F-Strings 与字符串插值 (String Interpolation) · 课堂板书演示 (00:08:45)](</attachments/cs61a-bf08f1c8dbd17196bdadd634.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)
*⏱ 时间戳：00:08:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)*

#### 📸 课堂板书与代码演示深入精读 (00:08:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“String interpolation involves evaluating a string literal, so that's some text in quotation marks, but which also contains expressions, and those expressions are evaluated and become part of the string. And string interpolation is used whenever you want to build a string that involves some predefine...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. F-Strings 与字符串插值 (String Interpolation)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


- 前缀字符 `f` 告知解释器执行字符串插值；
- 花括号 `{...}` 内的表达式在**当前环境帧**中动态求值；
- 嵌入结果默认自动调用各个子表达式对象的 `str()` 方法。

[![F-Strings 与字符串插值 (String Interpolation) · 课堂板书演示 (00:10:45)](</attachments/cs61a-6042e4b3916166f9e1285b13.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)*

#### 📸 课堂板书与代码演示深入精读 (00:10:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Anything you could build with concatenation, you could also build with string interpolation. So here's an F string. This is just contents. 2 plus 2 equals 2 plus 2 would be evaluated just like a normal string. But if I include curly braces around some part of this, now this is treated as a Python ex...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. F-Strings 与字符串插值 (String Interpolation)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
from math import pi

# 传统拼接 vs f-string
f"pi starts with {pi}..."  # 'pi starts with 3.141592653589793...'

# 花括号内支持任意合法 Python 表达式
f"2 + 2 = {2 + 2}"  # '2 + 2 = 4'
```

### F-Strings 的插值规则与副作用注意点

[![F-Strings 的插值规则与副作用注意点 · 课堂板书演示 (00:12:45)](</attachments/cs61a-7ac9c9a5af6a54cfe7fbefcc.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)*

#### 📸 课堂板书与代码演示深入精读 (00:12:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“What happens when you build an F string? Half of a half is half times half. You get the str string, not the rep string. If you really wanted the rep string, you could just call rep on this, and then you get it. And evaluation of sub-expressions is just like anywhere else in Python. They may have sid...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. F-Strings 与字符串插值 (String Interpolation)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


1. **默认采用 str()**：
   ```python
   half = Fraction(1, 2)
   f"The value is {half}"        # 'The value is 1/2' (采用 str)
   f"The value is {repr(half)}"  # 'The value is Fraction(1, 2)' (显式转 repr)
   ```
2. **表达式按序求值与副作用**：
   ```python
   s = [9, 8, 7]
   # 表达式自左向右严格依次求值
   result = f"{s.pop()}, {s.pop()}, remaining: {s}"
   # result: '7, 8, remaining: [9]'
   ```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. F-Strings 与字符串插值 (String Interpolation)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)

**多态函数（Polymorphic Function）** 是指能够作用于多种不同数据类型的通用函数。`repr()` 与 `str()` 就是最典型的多态函数。

[![多态函数与接口抽象 (Polymorphic Functions & Interfaces) · 课堂板书演示 (00:14:15)](</attachments/cs61a-e8ff148769f5b960c44008ff.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)
*⏱ 时间戳：00:14:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)*

#### 📸 课堂板书与代码演示深入精读 (00:14:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So, repr in particular just invokes a zero argument method called underscore underscore repr underscore underscore on its argument in order to get the repr string that it returns. So, I can call repr on half, which is the fraction one two, or I can invoke its method. Invoking the method gets looked ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 多态背后的核心机理：委托参数自身

多态函数本身几乎不需要包含复杂的 `if-else` 分支，它只需**向传入的实参对象发送消息**，委托实参决定如何响应：

- `repr(x)` 委托给 `x` 的 `__repr__` 方法；
- `str(x)` 委托给 `x` 的 `__str__` 方法。

### 深入底层：repr 与 str 的安全实现

Python 在底层实现 `repr` 时，会**严格忽略实例属性中的 `__repr__`，只查找类属性中的 `__repr__`**：

[![深入底层：repr 与 str 的安全实现 · 课堂板书演示 (00:16:15)](</attachments/cs61a-a1a47bcea5b9348787d2afc3.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)
*⏱ 时间戳：00:16:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)*

#### 📸 课堂板书与代码演示深入精读 (00:16:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“How would I implement that? So which of the following function definitions corresponds to a function repper that takes in some argument, looks at the class attribute called underscore underscore repper, and invokes it? Here are five options. Only one does what I described. Think about it for a minut...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
def repr(x):
    """底层模型：忽略实例属性，强制通过类查找方法并显式传入 self 实参。"""
    return type(x).__repr__(x)
```

> **回退机制**：
> 若一个类没有显式定义 `__str__`，调用 `str(x)` 会自动回退调用 `__repr__(x)`。因此，编写自定义类时**优先实现 `__repr__`** 可以同时满足两种需求。

### 什么是接口 (Interface)？

[![什么是接口 (Interface)？ · 课堂板书演示 (00:17:45)](</attachments/cs61a-ccc25fe18289c8790352c472.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)
*⏱ 时间戳：00:17:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)*

#### 📸 课堂板书与代码演示深入精读 (00:17:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“It's only if you explicitly make them different that they differ. We're using an important idea here. It's called an interface. So, when I talked about object-oriented programming in the first place, I said that the central to this metaphor was that objects would pass messages to each other, and tha...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


**接口**是一组约定的消息（方法名）及其语义规范。
- 只要一个类实现了 `__repr__` 和 `__str__` 方法，它就实现了“字符串表示接口”；
- 这种机制使得 Python 的整个生态系统（REPL、日志、格式化工具）能够无缝处理任何新创建的自定义类型。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 自定义 Ratio 类实战：实现表示接口

实现一个精准的有理数（Ratio）类，展示规范的 `__repr__` 与 `__str__` 编写范式：

[![自定义 Ratio 类实战：实现表示接口 · 课堂板书演示 (00:19:35)](</attachments/cs61a-1d7ead302582364b85c63384.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)
*⏱ 时间戳：00:19:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:19:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)*

#### 📸 课堂板书与代码演示深入精读 (00:19:35)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“If we want instances of the ratio class to be able to display themselves, we need to define a repar method. It will return a string, the string ratio, followed by parentheses. Here, we have two different gaps within our string that we fill in using the format method on strings. self.numer fills into...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 自定义 Ratio 类实战：实现表示接口」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


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

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 自定义 Ratio 类实战：实现表示接口」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 特殊方法与运算符重载 (Special Method Names)

在 Python 中，所有以双下划线开头和结尾的方法统称为**特殊方法（Special Methods / Dunder Methods）**。它们将内置的语言语法映射为类的方法调用。

[![特殊方法与运算符重载 (Special Method Names) · 课堂板书演示 (00:21:45)](</attachments/cs61a-be93bf1ff09a573e48cf281d.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)
*⏱ 时间戳：00:21:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)*

#### 📸 课堂板书与代码演示深入精读 (00:21:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Other than that, it's just a regular method. Repr was discussed in the previous videos. It's the method that gets invoked in order to produce a string that represents an object, and it's the one that's used in an interactive Python session to display the value. What about add? Well, that's a new one...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 特殊方法与运算符重载 (Special Method Names)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


| 特殊方法 | 对应语法 / 内置函数 | 功能语义 |
| :--- | :--- | :--- |
| `__init__(self, ...)` | `Ratio(1, 2)` | 实例构造与初始化 |
| `__repr__(self)` | `repr(x)`, 交互式 REPL | 生成规范 Python 代码字符串 |
| `__str__(self)` | `str(x)`, `print(x)` | 生成用户友好描述字符串 |
| `__bool__(self)` | `bool(x)`, `if x:` | 判定对象的真值条件 |
| `__float__(self)` | `float(x)` | 转换为浮点数值 |
| `__add__(self, other)` | `self + other` | 加法运算符（当前对象在左侧） |
| `__radd__(self, other)` | `other + self` | 反向加法运算符（当前对象在右侧） |

[![特殊方法与运算符重载 (Special Method Names) · 课堂板书演示 (00:23:45)](</attachments/cs61a-44d622d20331149e206233e0.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)
*⏱ 时间戳：00:23:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)*

#### 📸 课堂板书与代码演示深入精读 (00:23:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So what happens when you have two instances of user-defined classes added together? Well, what happens is that you invoke either add or there's another method called radd. I'll tell you about that in a moment. And that actually performs the addition. Again, we're just asking the objects, how do you ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 特殊方法与运算符重载 (Special Method Names)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 加法运算符重载机理

当求值表达式 `a + b` 时：
1. 优先尝试调用 `type(a).__add__(a, b)`；
2. 若 `a` 未实现该方法或返回 `NotImplemented`，则尝试调用右侧对象的反向加法 `type(b).__radd__(b, a)`。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 特殊方法与运算符重载 (Special Method Names)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)

为了让自定义的 `Ratio` 类能够与整数、浮点数混合加法运算，需要处理跨类型交互：

[![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:26:15)](</attachments/cs61a-7ba25b2c52f6e9a1e6464c09.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)
*⏱ 时间戳：00:26:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:26:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)*

#### 📸 课堂板书与代码演示深入精读 (00:26:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“of n divided by g and d divided by g. And what's the greatest common divisor? We did talk about this earlier in the course. One way to compute it is to say, while n does not equal d, we rebind n and d to be, in no particular order, the min of n and d and the absolute value of n minus d. So now we ca...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:28:45)](</attachments/cs61a-4ab03b655e4be046da440068.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)
*⏱ 时间戳：00:28:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)*

#### 📸 课堂板书与代码演示深入精读 (00:28:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“As addition for this class, at which point I can add ratios, I can add integers to ratios in either direction, and I've fulfilled the interface for adding addition to a user-defined class in the Python language. Now, what happens if we add a floating point value? 0.345. Well, then this result will n...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:30:05)](</attachments/cs61a-394b74ef04223700e635c53f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)
*⏱ 时间戳：00:30:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:30:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)*

#### 📸 课堂板书与代码演示深入精读 (00:30:05)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And here, this is called type coercion, which is when you take an object of one type, convert it into another type, in order to be able to combine it with some other value. These are two strategies that people use in order to have different classes interact. You know, add is a two-argument method, a...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「__repr__ 形式表示 vs __str__ 人类可读字符串、特殊方法分发」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 综合实现代码

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

### 两种跨类型设计策略对比

1. **类型分发 (Type Dispatching)**：
   - 通过 `isinstance(other, int)` 探测操作数类型，针对特定类型执行专门的代码路径。
   - **优点**：能够精确保留数学精度（例如 `Ratio(1, 3) + 1` 返回精确的 `Ratio(4, 3)`）。
2. **类型强转 (Type Coercion)**：
   - 当遇到更高阶但不兼容的类型（如 `float`）时，通过 `float(self)` 将本对象转换为该类型后委托给内置浮点数运算。
   - **优点**：通用性高，避免为每一种可能类型编写繁琐的分支。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 8. 章节总结与核心考点

1. **repr vs str 契约**：`repr` 面向程序与排错（尽量可被 `eval`），`str` 面向人类审美；`str` 缺失时自动回退为 `repr`。
2. **方法查找安全规范**：`repr` 与特殊方法查找直接读取 `type(obj)`，杜绝实例属性遮蔽对系统协议的破坏。
3. **接口与多态**：对象系统通过统一的协议命名（Dunder Methods）实现语法与面向对象特性的无缝衔接。

### 深入形式化规约与微观求值流程（Operational Semantics）
在「8. 章节总结与核心考点」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
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
| [← 上一讲：Lecture 20 Inheritance](/notes/cs61a/lecture-20) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 22 Composition →](/notes/cs61a/lecture-22) | [🎬 在 B 站观看本讲 (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21) |
