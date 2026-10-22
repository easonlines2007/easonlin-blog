---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 03 · Control：多帧环境模型、条件分支与循环控制
description: CS61A 第 3 讲：Control：多帧环境模型、条件分支与循环控制
topic: CS61A
order: 3
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 1: 函数与抽象 (Functions & Abstraction)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：32:21 ｜ **课堂截图**：15 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P3)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3)  
> **快速导航**：[← 上一讲 (P02 Lecture 2 Functions)](/notes/cs61a/lecture-02) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P04 Lecture 4 Higher-Order Functions) →](/notes/cs61a/lecture-04)

---

## 1. 用户自定义函数回顾与要素拆解

*(参考时间：00:00:02 · [视频跳转 (P3 00:00:02)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=2))*

在深入控制流之前，DeNero 教授首先带领我们复盘了自定义函数（User-Defined Functions）的语法与运行期本质。

一个完整的函数定义是一条**复合语句（Compound Statement）**，称为 `def` 语句：

```python
def square(x):
    return mul(x, x)
```

这条语句横跨多行，具有严格的结构分工：
1. **函数名称（Name）**：`def` 关键字后紧随的名字（如 `square`）。
2. **形式参数（Formal Parameters）**：圆括号内的标识符列表（如 `x`）。如果包含多个输入，以逗号分隔；它们将在函数调用时充当实参值的占位名。
3. **函数体（Body）**：首行后所有缩进的语句集合。它决定了函数被调用时实际执行的操作序列。
4. **返回表达式（Return Expression）**：`return` 关键字后面的表达式（如 `mul(x, x)`），其求值结果将作为整个调用表达式的值。

[![自定义函数语法结构：def 语句、形参、函数体与返回表达式](</attachments/cs61a-af3484cd208f494c3fc6329f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=45)
*⏱ 时间戳：00:00:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=45)*

#### 📸 课堂板书与代码演示深入精读 (00:00:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Here on one slide, in summary form, with all the vocabulary that you need. So first, we have a def statement. A def statement is what creates functions. It looks like this. That whole thing is a def statement, which spans multiple lines. It has a name for the function you're defining, a formal param...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「1. 用户自定义函数回顾与要素拆解」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


> **核心机制**：执行 `def` 语句时，Python 仅创建函数对象，并在**当前帧**中把名称 `square` 绑定到该函数上。此时**绝对不会执行函数体内的代码**，乘法运算尚未发生！

只有当遇到**调用表达式（Call Expression）**（例如 `square(2 + 2)`）时，函数才被激活。调用包含三个关键要素：
- **运算符（Operator）**：`square`，其在当前环境中求值为刚定义的函数。
- **操作数（Operand）**：括号内的表达式 `2 + 2`，求值得到实参（Argument）`4`。
- **调用过程**：开辟一个独立的新帧，将形参 `x` 绑定到实参 `4`，随后在该新环境中执行函数体，计算 `4 * 4` 返回 `16`。

[![函数调用的黑盒管道模型：参数传入、新帧求值与结果返回](</attachments/cs61a-e675cbd8e31993ae2566cb34.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=160)
*⏱ 时间戳：00:02:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:02:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=160)*

#### 📸 课堂板书与代码演示深入精读 (00:02:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“There's an operand in between parentheses. An operand is an expression, in this case, 2 plus 2. It evaluates to a value 4, which is the argument of the function. So, when we reach a call expression, we evaluate it by evaluating the operators and operands and then calling the function on the argument...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「1. 用户自定义函数回顾与要素拆解」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「1. 用户自定义函数回顾与要素拆解」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 2. 多帧环境模型与名称查找规则

*(参考时间：00:03:06 · [视频跳转 (P3 00:03:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=186))*

在上一讲中，环境通常只有一个全局帧（Global Frame）。一旦引入函数的嵌套调用，Python 解释器就必须管理**多个帧组成的链式环境**。

以嵌套调用 `square(square(3))` 为例：

```python
from operator import mul

def square(x):
    return mul(x, x)

square(square(3))
```

### 嵌套调用的求值时序

1. **外层调用准备**：运算符 `square` 求值为平方函数；操作数是子调用 `square(3)`，必须先求其值。
2. **第一层函数调用（Frame F1）**：
   - 创建新帧 `F1`，父环境（Parent）为 `Global`。
   - 绑定形参：`x: 3`。
   - 在包含 `F1` 的环境中执行函数体：查找 `mul`（在 `Global` 帧中找到）和 `x`（在 `F1` 中找到），计算 `mul(3, 3) -> 9`。
   - `F1` 返回 `9`。
3. **第二层函数调用（Frame F2）**：
   - 此时外层调用的操作数已得到值 `9`。
   - 再次调用 `square`，创建全新的独立帧 `F2`，父环境同样为 `Global`。
   - 绑定形参：`x: 9`。
   - 在包含 `F2` 的环境中执行函数体：计算 `mul(9, 9) -> 81`。
   - `F2` 返回 `81`。

[![嵌套调用 square(square(3)) 的双局部帧 F1 与 F2 环境图](</attachments/cs61a-095211a9c421223fb083c172.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=285)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=285)*

#### 📸 课堂板书与代码演示深入精读 (00:04:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So I have to multiply x and x together. I get a return value of 9, and that's how I get the value of this call expression. Now that I know what the value of this operand expression is, I can apply this function square to the argument 9 and repeat the process again. Okay, so that means introducing a ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 多帧环境模型与名称查找规则」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 环境（Environment）的精确定义

> **环境（Environment）**：一个**由相互链接的帧组成的有序序列**。

在上述图解中：
- 存在唯一的 `square` 函数对象，但由于调用了两次，产生了两个不同的局部帧 `F1` 和 `F2`。
- 整个程序中一共有三个不同的环境：
  1. 仅包含 `Global` 帧的环境。
  2. 由 `F1` 引导、紧随 `Global` 帧的环境 `[F1 -> Global]`。
  3. 由 `F2` 引导、紧随 `Global` 帧的环境 `[F2 -> Global]`。
- **没有任何一个环境同时包含 F1 和 F2**！每个函数调用都在其专属的局部环境中独立运行。

### 名称求值的黄金法则（Earliest Frame Rule）

> **规则**：一个名称在当前环境中的求值结果，等于在当前环境的帧序列中**最早出现该名称的帧**中的绑定值。

[![环境中的名称解析：在当前帧链的最早帧查找标识符](</attachments/cs61a-437527131350af1e2d7db1e1.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=450)
*⏱ 时间戳：00:07:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:07:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=450)*

#### 📸 课堂板书与代码演示深入精读 (00:07:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Which allows us to figure out what names mean. And a name evaluates to the value bound to that name in the earliest frame of the current environment in which that name is found. In this case, when we evaluate mall.xx for the second time, it's in an environment that starts with the frame F2, followed...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 多帧环境模型与名称查找规则」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


当执行 `F2` 内部的 `mul(x, x)` 时：
- 查找 `x`：首先在首帧 `F2` 中检查，找到 `x = 9`，查找立即停止。
- 查找 `mul`：首先在首帧 `F2` 中检查，未找到；顺着父指针进入下一帧 `Global`，找到 `mul` 绑定的内置乘法函数。

### 形参遮蔽陷阱（Name Shadowing）

如果有人故意将形参命名为与函数相同的名字，会发生什么？

```python
def square(square):
    return mul(square, square)

square(4)
```

当我们调用 `square(4)` 时，得到的结果仍然是 `16`：
- 在全局帧中，`square` 绑定到该函数对象。
- 在局部帧 `F1` 中，形参 `square` 被绑定到传入的值 `4`。
- 函数体执行 `mul(square, square)` 时，当前环境为 `[F1 -> Global]`。
- 根据就近原则，局部帧 `F1` 中存在 `square`，取值为 `4`。因此计算的是 `mul(4, 4)`，得到 `16`。全局的函数名被局部的变量名**遮蔽（Shadowed）**了。

[![形参遮蔽：def square(square) 在局部帧与全局帧的歧义消除](</attachments/cs61a-fbcfe14ccb4f352097d5604b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=528)
*⏱ 时间戳：00:08:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:08:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=528)*

#### 📸 课堂板书与代码演示深入精读 (00:08:48)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“For both the name of a function and the name of the formal parameter. def square squared return moles square squared. Now, I'm not recommending you do this, but if you square 4 in this case, you really do get 16. Why is that? Well, in the environment diagram for this example, there's a global frame ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 多帧环境模型与名称查找规则」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 多帧环境模型与名称查找规则」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. 运算符底层语义、整除与多值返回

*(参考时间：00:10:05 · [视频跳转 (P3 00:10:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=605))*

### 运算符与内置函数的对应关系

中缀运算符（如 `+`、`*`）遵循标准运算优先级，但在本质上均可对应到内置函数调用：

```python
from operator import add, mul

2 + 3 * 4 + 5  # 等价于 add(add(2, mul(3, 4)), 5)
(2 + 3) * (4 + 5)  # 等价于 mul(add(2, 3), add(4, 5))
```

### 两种除法与数字拆分技巧

计算机科学中经常需要对整数进行精确离散拆解：
1. **真除法（True Division, `/`）**：对应 `operator.truediv`，产生浮点数近似值。如 `2013 / 10 -> 201.3`，`5 / 3 -> 1.6666666666666667`。
2. **地板除/整除（Floor Division, `//`）**：对应 `operator.floordiv`，舍弃小数位向下取整。`2013 // 10 -> 201`。
3. **取模运算（Modulo, `%`）**：对应 `operator.mod`，求整除后的余数。`2013 % 10 -> 3`。

整除与取模是完全**精确无精度丢失的**，常用于数字拆分（如提取十进制最低位与剥除最低位）。

[![整除 // 与取模 % 的互补性：精确拆解数值与余数计算](</attachments/cs61a-15bafbcf6a8df6a80b2046d6.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=755)
*⏱ 时间戳：00:12:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:12:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=755)*

#### 📸 课堂板书与代码演示深入精读 (00:12:35)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Or we can do what's called integer division, which only gives the number of times that the divisor goes into the dividend, not including any remainder. So we lost a 0.3. These have corresponding functions, from operator, import, true div, and floor div. The first and the second. So I can true div 20...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 运算符底层语义、整除与多值返回」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 多重赋值与函数多值返回

Python 允许一条赋值语句同时为多个名称绑定值，同样支持函数一次性返回多个结果：

```python
def divide_exact(n, d):
    return n // d, n % d

quotient, remainder = divide_exact(2013, 10)
# quotient 绑定为 201，remainder 绑定为 3
```

[![函数返回多值与多重解包赋值语法](</attachments/cs61a-cdcf859a160b31213544b735.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=855)
*⏱ 时间戳：00:14:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=855)*

#### 📸 课堂板书与代码演示深入精读 (00:14:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So it's good to know how they work. Here's another feature of Python, is that just as I can assign multiple values to multiple names using one assignment statement, I can also return multiple values from a function. And you'll do this once in your project. So let's say I want both the quotient and t...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 运算符底层语义、整除与多值返回」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. 运算符底层语义、整除与多值返回」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 永久代码组织：源码文件、交互运行与 Doctest

*(参考时间：00:14:44 · [视频跳转 (P3 00:14:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=884))*

在终端的交互式解释器中编写代码适合快速探索，但要构建长期持久的软件，必须编写在 `.py` 源代码文件中。

### 编写与运行源文件

在 `ex.py` 文件中写入代码：

```python
from operator import floordiv, mod

def divide_exact(n, d=10):
    """返回 n 除以 d 的商和余数。

    >>> q, r = divide_exact(2013, 10)
    >>> q
    201
    >>> r
    3
    """
    return floordiv(n, d), mod(n, d)
```

在终端运行方式有两种：
1. **直接批处理执行**：`python3 ex.py`（若无 `print` 语句，终端将没有任何可见输出）。
2. **交互式载入模式（推荐）**：`python3 -i ex.py`。
   - 先执行整个文件中的所有定义，然后停留在交互提示符 `>>>`，供开发者直接调用与检查变量。

[![在源码文件 ex.py 中编写定义并使用 python3 -i 进行交互测试](</attachments/cs61a-c2f38bbcf267b1d0b35d8f8b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=990)
*⏱ 时间戳：00:16:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:16:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=990)*

#### 📸 课堂板书与代码演示深入精读 (00:16:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“But otherwise doesn't give us any output. OK, so if instead I go over here and I say q,r equals divide exact 2013 by 10, and I save that, and I execute it, still, nothing happens. But, if I finally print something out, a quotient is q, the remainder is r. I save that, and I execute it, then I'll act...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 永久代码组织：源码文件、交互运行与 Doctest」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 文档字符串（Docstring）与文档测试（Doctest）

高质量函数必须提供说明与测试用例。紧跟在 `def` 声明下方的三引号字符串即为 **Docstring**。

在 Docstring 中可以插入类似交互解释器的会话范例，Python 内置的 `doctest` 模块能够直接提取并执行这些用例进行自动化测试：

```bash
# 静默验证：若所有测试通过，则不输出任何信息
python3 -m doctest ex.py

# 详细模式（Verbose）：打印每一步执行与通过状态
python3 -m doctest -v ex.py
```

[![Doctest 自动化验证：通过 -v 输出完整的函数测试细节](</attachments/cs61a-05ee48a7ffb9112f348b75ad.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1120)
*⏱ 时间戳：00:18:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:18:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1120)*

#### 📸 课堂板书与代码演示深入精读 (00:18:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“OK, so we give some documentation. That's called a docstring. It's the first line below the def line in a def statement. In addition to just describing for humans what this does, we can also show some examples of how it works. I'm going to get rid of this too. And I'm going to put it up here so I ca...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 永久代码组织：源码文件、交互运行与 Doctest」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 形参默认值（Default Arguments）

定义形参时可指定默认值。当调用方省略该实参时，默认值自动生效：

```python
# 当未传入 d 时，默认 d 为 10
q, r = divide_exact(2013)  # q = 201, r = 3
```

[![形参默认值设置与调用时省略实参的解析机制](</attachments/cs61a-4f2feda3fb8eb2a5a0b0b6af.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1245)
*⏱ 时间戳：00:20:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1245)*

#### 📸 课堂板书与代码演示深入精读 (00:20:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“When you're defining a function, you can give what are called default values. This is not an assignment statement. This is instead a placeholder for a default value that I put after a formal parameter. And what this says is, if there's no argument passed in to be bound to D, then I'll bind 10 to D i...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 永久代码组织：源码文件、交互运行与 Doctest」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 永久代码组织：源码文件、交互运行与 Doctest」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 复合语句架构与条件分支（if-elif-else）

*(参考时间：00:21:23 · [视频跳转 (P3 00:21:23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1283))*

### 复合语句（Compound Statement）的解剖学

Python 的语句体系分为简单语句（如赋值、`return`）与复合语句。复合语句具有统一的结构特征：

```text
Header 1:
    Suite 1 (一组缩进语句)
Header 2:
    Suite 2
```

- **子句（Clause）**：包含一个头部（Header）及其管控的一组缩进语句块（Suite）。
- 首个 Header 决定了整个语句的类别（如 `def`、`if`、`while`）。
- **Suite 的执行规则**：依次顺序执行其中的每条语句，除非遇到控制跳转（如 `return`、`break`）。

[![复合语句结构语法：头部 Header、子句 Clause 与代码块 Suite](</attachments/cs61a-d2ff56c00bbd01e8591809ea.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1340)
*⏱ 时间戳：00:22:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:22:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1340)*

#### 📸 课堂板书与代码演示深入精读 (00:22:20)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And that has statements indented after it, etc. This whole thing can be a statement. Within it, a clause is a single header followed by some indented statements. And those indented statements are called the suite of the clause. The first header determines a statement's type. So you can always tell w...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 复合语句架构与条件分支（if-elif-else）」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 条件语句（Conditional Statements）

条件语句使程序具备根据不同情况走不同分支的能力。以自定义绝对值函数为例：

```python
def absolute_value(x):
    """返回 x 的绝对值。"""
    if x < 0:
        return -x
    elif x == 0:
        return 0
    else:
        return x
```

### 条件语句的执行铁律

1. 从上到下依次考察每个子句。
2. 对当前子句 Header 中的布尔表达式求值。
3. **一旦某个表达式求值为真值（True Value）**：
   - 立即执行该子句对应的 Suite。
   - **完全跳过**后续所有剩下的子句（无论是 `elif` 还是 `else`）！
4. 任何一次执行中，**最多只有一个 Suite 会被激活执行**。

[![条件语句的分支执行规则：命中首个真值分支即跳过剩余子句](</attachments/cs61a-196b9aa917f6847f360bf7a3.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1480)
*⏱ 时间戳：00:24:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:24:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1480)*

#### 📸 课堂板书与代码演示深入精读 (00:24:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And finally, if neither of those are true, that means x is greater than zero, we will return x itself. Okay, this is an absolute value function. We can load it by starting an interactive session and first reading in ex.py. So now we have absolute value defined. When I take the absolute value of nega...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 复合语句架构与条件分支（if-elif-else）」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 复合语句架构与条件分支（if-elif-else）」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 布尔上下文与真值判定（George Boole 的逻辑视界）

*(参考时间：00:25:40 · [视频跳转 (P3 00:25:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1540))*

计算机科学奠基人之一乔治·布尔（George Boole）开创了逻辑代数。Python 代码中凡是需要判断真假的位置，统称为**布尔上下文（Boolean Context）**。

在 `if x < 0:` 或 `elif x == 0:` 中，头部表达式的值处于布尔上下文中。这里不仅能写简单的比较表达式，任何 Python 对象都可以求值！

[![布尔上下文判定：逻辑学家 George Boole 的真值分类模型](</attachments/cs61a-8b0fae0b471eeab77848b0a2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1600)
*⏱ 时间戳：00:26:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:26:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1600)*

#### 📸 课堂板书与代码演示深入精读 (00:26:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Early founder of computer science. He's really important, so let's make him big. George is going to be interested in what are called boolean contexts. So those are places in Python code where you place an expression, but all that matters about that expression is whether it's true or false. In this c...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 布尔上下文与真值判定（George Boole 的逻辑视界）」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### Python 中的真值与假值规则

- **假值（False Values）**：
  - `False`（布尔假）
  - `0`（数字零）
  - `""`（空字符串）
  - `None`（空对象）
- **真值（True Values）**：
  - 除上述假值以外的**所有其他任何值**（包括非零整数、非空字符串、函数对象等）均为真值！

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 布尔上下文与真值判定（George Boole 的逻辑视界）」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 7. 迭代与 while 循环执行机制

*(参考时间：00:27:48 · [视频跳转 (P3 00:27:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1668))*

计算机的核心威力在于高速重复执行。`while` 循环语句是 Python 中最基础的迭代控制结构。

以下示例使用 `while` 循环计算 $1 + 2 + 3 = 6$：

```python
i = 0
total = 0
while i < 3:
    i = i + 1
    total = total + i
```

[![while 循环基本语法与两步执行规则](</attachments/cs61a-c8e4ea7d8699e2d7f5d910fe.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1770)
*⏱ 时间戳：00:29:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:29:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1770)*

#### 📸 课堂板书与代码演示深入精读 (00:29:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“How did that happen? Well, to understand exactly what happened, we need to look at the execution rule for a while statement. So here's the code that I typed in. Here's the execution rule. First thing we do when we have a compound while statement, which is this whole last three lines, is to evaluate ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「7. 迭代与 while 循环执行机制」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### while 循环执行的两步法定则

1. **第一步（求值头部条件）**：对 Header 中的表达式（处于布尔上下文）求值。
   - 如果为**假值**，循环终止，继续执行循环体之后的代码。
   - 如果为**真值**，进入第二步。
2. **第二步（执行完整 Suite）**：从头到尾完整执行 Suite 内的所有语句。执行完毕后，**无条件返回第一步**重新评估头部条件。

### 循环执行跟踪表（Trace Table）

理解循环的关键在于掌握每一轮迭代中变量状态的变化：

| 迭代轮次 | 判定前 i | 头部表达式 `i < 3` | 进入循环执行 `i = i + 1` | 执行 `total = total + i` | 轮次结束状态 |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **初始** | `0` | — | — | — | `i=0, total=0` |
| **Round 1** | `0` | `0 < 3 -> True` | `i = 1` | `total = 0 + 1 = 1` | `i=1, total=1` |
| **Round 2** | `1` | `1 < 3 -> True` | `i = 2` | `total = 1 + 2 = 3` | `i=2, total=3` |
| **Round 3** | `2` | `2 < 3 -> True` | `i = 3` | `total = 3 + 3 = 6` | `i=3, total=6` |
| **退出判定** | `3` | `3 < 3 -> False` | *跳过 Suite，循环结束* | *跳过 Suite，循环结束* | **最终结果：i=3, total=6** |

[![while 循环全局帧变量更新全流程追踪](</attachments/cs61a-a43ef66d99cb0a21733cdf30.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1890)
*⏱ 时间戳：00:31:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P3 00:31:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3&t=1890)*

#### 📸 课堂板书与代码演示深入精读 (00:31:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Plus i is 2 is 3. Now total is bound to 3. We return to step 1. And we see if 2 is less than 3, which it is. If George is happy, we then execute the whole suite again. And here's the really important part. When we first execute this assignment statement, i equals i plus 1, i is now 3. But we don't g...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「7. 迭代与 while 循环执行机制」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「短路求值 (Short-circuiting)、while 循环与质数判定」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


> **极其重要的心智模型**：在 Round 3 执行完 `i = i + 1` 后，`i` 已经变成了 `3`。但此时 Python **绝不会中途停下来去检查条件**，而是必须把整个 Suite 彻底执行完毕（即把 `total` 加成 `6`），回到第一步时才发现条件为假并退出。

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「7. 迭代与 while 循环执行机制」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 8. 本讲小结与核心思维导图

```mermaid
graph TD
    A[程序控制与环境] --> B[环境模型多帧解析]
    A --> C[工程化代码组织]
    A --> D[控制流语句]

    B --> B1[每次函数调用创建独立局部帧]
    B --> B2[环境是链接到全局的帧序列]
    B --> B3[就近原则：在最早出现的帧解析名称]

    C --> C1[源码文件保存与交互执行 python3 -i]
    C --> C2[Docstring 与自动 Doctest 测试]
    C --> C3[形参默认值与多值解包返回]

    D --> D1[条件分支 if-elif-else]
    D --> D2[布尔上下文与真假值分类]
    D --> D3[while 循环与两步执行规则]
```

在本讲中，我们完成了从“纯计算表达式”到“图灵完备控制流”的跨越：
1. **环境模型**为我们提供了精准预测多函数调用和嵌套执行的 X 光透视能力。
2. **源码组织与 Doctest** 确立了工业级 Python 开发的基础实践规范。
3. **条件分支与 while 循环** 赋予了代码根据数据决策并进行规模化迭代运算的核心能力。

### 深入形式化规约与微观求值流程（Operational Semantics）
在「8. 本讲小结与核心思维导图」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
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
| [← 上一讲：Lecture 2 Functions](/notes/cs61a/lecture-02) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 4 Higher-Order Functions →](/notes/cs61a/lecture-04) | [🎬 在 B 站观看本讲 (P3)](https://www.bilibili.com/video/BV1sy411z7nA/?p=3) |
