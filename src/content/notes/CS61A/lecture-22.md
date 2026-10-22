---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 22 · 对象组合与链表树形结构 (Composition)
description: CS61A 第 22 讲：对象组合与链表树形结构 (Composition)
topic: CS61A
order: 22
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 3: 面向对象与效率 (OOP & Efficiency)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：33:16 ｜ **课堂截图**：17 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22)  
> **快速导航**：[← 上一讲 (P21 Lecture 21 Representation)](/notes/cs61a/lecture-21) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P23 Lecture 23 Efficiency) →](/notes/cs61a/lecture-23)

---

## 1. 核心心智模型与架构图解

**组合（Composition）** 是面向对象中除继承之外另一个核心设计支柱。它表达的是 **has-a（包含）** 关系：一个对象将另一个对象作为其属性的一部分。

通过组合，我们可以构建出极其优雅且具递归特性的高级数据结构：
1. **链表 (Linked List)**：一个 `Link` 节点包含一个当前值 `first` 和另一个 `Link` 实例 `rest`。
2. **树 (Tree)**：一个 `Tree` 节点包含一个根节点标签 `label` 和一组子树分支列表 `branches`。

```
链表组合模型 (Linked List as Pair):
  ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
  │ first: 3      │        │ first: 4      │        │ first: 5      │
  ├───────────────┤        ├───────────────┤        ├───────────────┤
  │ rest: ────────┼───────►│ rest: ────────┼───────►│ rest: Link.empty (/)
  └───────────────┘        └───────────────┘        └───────────────┘

树形组合模型 (Tree as Node with Branch Subtrees):
                    ┌─────────────────────────┐
                    │ Tree(label=3)           │
                    │ branches: [B1, B2]      │
                    └────────────┬────────────┘
                                 │
                 ┌───────────────┴───────────────┐
                 ▼                               ▼
      ┌─────────────────────┐         ┌─────────────────────┐
      │ Tree(label=1)       │         │ Tree(label=2)       │
      │ branches: [] (Leaf) │         │ branches: [B3]      │
      └─────────────────────┘         └──────────┬──────────┘
                                                 │
                                                 ▼
                                      ┌─────────────────────┐
                                      │ Tree(label=1) (Leaf)│
                                      └─────────────────────┘
```

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


## 2. 链表类的设计与盒指针模型 (The Link Class)

链表要么为空，要么由当前元素（`first`）和后续链表（`rest`）组成。

[![链表类的设计与盒指针模型 (The Link Class) · 课堂板书演示 (00:00:55)](</attachments/cs61a-29829e8b8728caea5c0cba9e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)*

#### 📸 课堂板书与代码演示深入精读 (00:00:55)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“We'll use an instance of a class called the link. I haven't defined that yet, but I will soon. And that has two attributes. First, which is three, and rest, which is some object. Now that object is holding the rest of the values. And it itself is also a linked list, or a link instance. So every link...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 链表类的设计与盒指针模型 (The Link Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 盒指针图解 (Box-and-Pointer Diagrams)

在计算机科学中，链表标准图解采用双格盒表示一个节点，右格箭头指向下一个节点，尾部的空列表通常用一根斜杠（`/`）表示：

[![盒指针图解 (Box-and-Pointer Diagrams) · 课堂板书演示 (00:02:45)](</attachments/cs61a-e5e0046eb85e62599f6af736.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)*

#### 📸 课堂板书与代码演示深入精读 (00:02:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“A linked list as its attribute value. Finally, there's some class attribute that we use for any linked list that's empty, and we call it link.empty. Now, the way we construct this is not by writing 3, 4, 5. That would make a tuple. Instead, we have to write out the constructor. A link with 3, and th...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 链表类的设计与盒指针模型 (The Link Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![盒指针图解 (Box-and-Pointer Diagrams) · 课堂板书演示 (00:04:45)](</attachments/cs61a-55b9aecefe435d5af5d5f33f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)*

#### 📸 课堂板书与代码演示深入精读 (00:04:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“About how they get drawn. Typically, you do draw them as a sequence of pairs with arrows like this, but instead of drawing an arrow to link.empty, it's very common to just put a slash there. This is not any sort of official notation, but you will see people do this out there in the world, so I thoug...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 链表类的设计与盒指针模型 (The Link Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### Link 类的规范实现

[![Link 类的规范实现 · 课堂板书演示 (00:06:15)](</attachments/cs61a-b3e9282b11b0cbdd320dfb8a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)
*⏱ 时间戳：00:06:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)*

#### 📸 课堂板书与代码演示深入精读 (00:06:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So those are the only two things we're allowed to pass in as the rest of the list. And then we store the first element and the rest of the list as attributes of the instance self. IsInstance is a built-in function in Python that returns whether rest is a link when passed to these two arguments. If y...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 链表类的设计与盒指针模型 (The Link Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
class Link:
    """递归单向链表类。"""
    empty = ()  # 使用空元组作为单例哨兵，表示空链表

    def __init__(self, first, rest=empty):
        assert rest is Link.empty or isinstance(rest, Link), "rest 必须是 Link 实例或 Link.empty"
        self.first = first
        self.rest = rest

    def __repr__(self):
        if self.rest:
            rest_repr = ', ' + repr(self.rest)
        else:
            rest_repr = ''
        return f'Link({self.first}{rest_repr})'
```

> **设计要点**：
> 1. `rest` 默认值为 `Link.empty`，构造单一节点时可简写为 `Link(5)`。
> 2. `isinstance(rest, Link)` 验证保障了链表结构的良构性（Well-formedness），同时支持未来可能扩展的子类。

### 属性访问与节点检索

[![属性访问与节点检索 · 课堂板书演示 (00:08:15)](</attachments/cs61a-6b69803fc68308b4c215e81c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)
*⏱ 时间戳：00:08:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)*

#### 📸 课堂板书与代码演示深入精读 (00:08:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“I can access 5 by saying the rest of the list's rest of the list's first element. That's 5. And finally, I can ask whether the rest of the rest of the rest of the list is link.empty. And it should be, because there's nothing there. So these are the ways in which I'll manipulate a linked list. It is,...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 链表类的设计与盒指针模型 (The Link Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


```python
s = Link(3, Link(4, Link(5)))

print(s.first)             # 3 (第 0 项)
print(s.rest.first)        # 4 (第 1 项)
print(s.rest.rest.first)   # 5 (第 2 项)
print(s.rest.rest.rest is Link.empty)  # True
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 链表类的设计与盒指针模型 (The Link Class)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. 链表的递归处理：Range, Map 与 Filter

由于链表具有天然的递归组合结构，处理链表的最自然方式就是**递归**。

[![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:10:45)](</attachments/cs61a-ff7377338721a4e0d8b22fb2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)*

#### 📸 课堂板书与代码演示深入精读 (00:10:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“But the syntax will be slightly different. We'll have to come up with our map link function, which we'll implement momentarily, which takes a square and squares all the elements of the result of filtering a linked list using the odd function, where we start with a linked list representing the range ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 链表的递归处理：Range, Map 与 Filter」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:12:45)](</attachments/cs61a-f65b1e51a2f7e1d635523979.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)*

#### 📸 课堂板书与代码演示深入精读 (00:12:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And what's the rest of the range? Well, that is the range that starts at start plus one and goes to the end. How do we take a function and map it over all the elements in S? Calling F on every single element and building a linked list of the result. If it's the case that S is linked at empty, there'...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 链表的递归处理：Range, Map 与 Filter」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:14:15)](</attachments/cs61a-ebb0626edf7614f4d51223c2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)
*⏱ 时间戳：00:14:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)*

#### 📸 课堂板书与代码演示深入精读 (00:14:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Well, that depends on what you get when you call f on s.first. If that's a true value, then we need s.first to be in the result. And what's everything else? Well, that's the result of filtering the rest of the list. Otherwise, if this is a false value, then s.first is not supposed to be in the resul...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 链表的递归处理：Range, Map 与 Filter」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 递归操作三剑客实现

```python
def range_link(start, end):
    """构建包含 [start, end) 连续整数的链表。"""
    if start >= end:
        return Link.empty
    return Link(start, range_link(start + 1, end))

def map_link(f, s):
    """将函数 f 映射到链表 s 的每个元素上，返回全新链表。"""
    if s is Link.empty:
        return Link.empty
    return Link(f(s.first), map_link(f, s.rest))

def filter_link(f, s):
    """过滤链表 s，仅保留满足谓词 f 的元素。"""
    if s is Link.empty:
        return Link.empty
    filtered_rest = filter_link(f, s.rest)
    if f(s.first):
        return Link(s.first, filtered_rest)
    else:
        return filtered_rest
```

### 组合演练

```python
# 生成 1~5，过滤奇数，并求平方
s = range_link(1, 6)             # Link(1, Link(2, Link(3, Link(4, Link(5)))))
odds = filter_link(lambda x: x % 2 != 0, s)  # Link(1, Link(3, Link(5)))
squares = map_link(lambda x: x * x, odds)    # Link(1, Link(9, Link(25)))
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. 链表的递归处理：Range, Map 与 Filter」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 链表就地修改与循环链表 (Mutation & Cycles)

链表作为对象实例，其 `first` 与 `rest` 属性均可被就地重绑定。这种可变性带来了极高的灵活性，但也引入了产生**循环链表（Cycle）**的可能。

[![链表就地修改与循环链表 (Mutation & Cycles) · 课堂板书演示 (00:16:15)](</attachments/cs61a-77e2c5022cadca9cc5b992b3.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)
*⏱ 时间戳：00:16:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)*

#### 📸 课堂板书与代码演示深入精读 (00:16:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“The REST attribute of a link instance. In this case, we're assigning it to S. Then, S dot first is five, and what's S dot REST dot REST dot REST dot REST dot REST dot first? Well, think about it for a minute and see if you can figure it out. This is going to be the number two. One reasonable reactio...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 链表就地修改与循环链表 (Mutation & Cycles)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![链表就地修改与循环链表 (Mutation & Cycles) · 课堂板书演示 (00:17:45)](</attachments/cs61a-c66869d10913b9bb421bb1e2.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)
*⏱ 时间戳：00:17:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)*

#### 📸 课堂板书与代码演示深入精读 (00:17:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“In the appropriate position so that everything stays ordered from least to greatest. So here's the function. Add to a list s, a value v, which modifies s to make sure that it contains v and then returns that modified s. However, if v is already an s, then we don't modify s so that we don't have repe...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 链表就地修改与循环链表 (Mutation & Cycles)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 制造无限环形引用

```python
s = Link(1, Link(2, Link(3)))
s.first = 5
t = s.rest  # t 指向 Link(2, Link(3))
t.rest = s  # 将 t.rest 重新指回链表头 s！

# 此时形成环状拓扑结构：5 -> 2 -> 5 -> 2 -> 5 ...
print(s.rest.rest.rest.rest.first)  # 5
```

### 经典算法：保持升序就地插入 `add(s, v)`

[![经典算法：保持升序就地插入 add(s, v) · 课堂板书演示 (00:19:45)](</attachments/cs61a-abfb2f78ad3d38201e3cdbbd.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)
*⏱ 时间戳：00:19:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:19:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)*

#### 📸 课堂板书与代码演示深入精读 (00:19:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So, instead of REST being linked at empty, REST needs to be a new link instance containing the six. That's how we add V into S. Try to implement it. Add V into S, returning modified S. Don't change S if V is already there, and make sure that S remains ordered. We assume that S is ordered at the begi...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 链表就地修改与循环链表 (Mutation & Cycles)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![经典算法：保持升序就地插入 add(s, v) · 课堂板书演示 (00:21:15)](</attachments/cs61a-330c304930b4b2ee6b884513.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)
*⏱ 时间戳：00:21:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)*

#### 📸 课堂板书与代码演示深入精读 (00:21:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Then we place v as s.first and change s.rest to contain the old s.first and the old s.rest. That's building this link instance or building this link instance. If s.first is less than v and the rest is empty, then we need to build this link instance by setting s.rest to a link where v is the first el...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 链表就地修改与循环链表 (Mutation & Cycles)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


需求：在严格递增无重复的链表 `s` 中就地插入元素 `v`，保持有序且不产生重复值：

```python
def add(s, v):
    """就地修改链表 s，插入值 v 并保持单调递增，返回修改后的 s。"""
    assert s is not Link.empty, "链表不可为空"
    if s.first > v:
        # 在头部插入：当前节点值后移，并将新值填入头部
        s.first, s.rest = v, Link(s.first, s.rest)
    elif s.first < v and s.rest is Link.empty:
        # 在尾部插入
        s.rest = Link(v)
    elif s.first < v:
        # 递归寻找合适插入点
        add(s.rest, v)
    return s
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 链表就地修改与循环链表 (Mutation & Cycles)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 树对象的面向对象建模 (The Tree Class)

在 Lecture 14 中，我们曾使用函数数据抽象（嵌套列表）构造树。现在，使用面向对象组合，树的定义变得前所未有的清晰。

[![树对象的面向对象建模 (The Tree Class) · 课堂板书演示 (00:23:15)](</attachments/cs61a-8bf43f81485ce6ab490d3d03.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)
*⏱ 时间戳：00:23:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:23:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)*

#### 📸 课堂板书与代码演示深入精读 (00:23:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“There's a branch and there's one other branch. Each branch is a tree. A tree with zero branches is called a leaf. In this diagram, there are five leaves. The leaves have labels as well. They just have no branches. A tree starts at the root. There's the root of the whole tree. There's the root of the...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 树对象的面向对象建模 (The Tree Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![树对象的面向对象建模 (The Tree Class) · 课堂板书演示 (00:25:15)](</attachments/cs61a-27f9426788d5d4d618c779c1.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)
*⏱ 时间戳：00:25:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)*

#### 📸 课堂板书与代码演示深入精读 (00:25:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And the most common paths are paths from the root to a leaf, but you could have other kinds of paths as well. We were able to work with trees using data abstraction, but we can also use Python's object system. A tree has a label and a list of branches. Each branch is also a tree. We can state this b...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 树对象的面向对象建模 (The Tree Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### Tree 类的规范定义

```python
class Tree:
    """具备标签与子树列表分支的树对象。"""
    def __init__(self, label, branches=[]):
        self.label = label
        for b in branches:
            assert isinstance(b, Tree), "分支必须是 Tree 对象"
        self.branches = list(branches)

    def is_leaf(self):
        return not self.branches

    def __repr__(self):
        if self.branches:
            branch_str = ', ' + repr(self.branches)
        else:
            branch_str = ''
        return f'Tree({self.label}{branch_str})'

    def __str__(self):
        """缩进排版的人类可读树状图。"""
        def indented(t):
            lines = [str(t.label)]
            for b in t.branches:
                for line in indented(b):
                    lines.append('  ' + line)
            return lines
        return '\n'.join(indented(self))
```

[![Tree 类的规范定义 · 课堂板书演示 (00:27:45)](</attachments/cs61a-2b354ef66684d53c12630700.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)
*⏱ 时间戳：00:27:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:27:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)*

#### 📸 课堂板书与代码演示深入精读 (00:27:45)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“And it's the same, with slight differences. When I use the object system, I capitalize the word tree and I access the label using dot notation. Under data abstraction, I had a function called tree and I accessed the label using a selector function. But our code doesn't change at all. So the coding s...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 树对象的面向对象建模 (The Tree Class)」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 面向对象 vs 数据抽象设计对比

| 维度 | 函数式数据抽象 (Functional Abstraction) | 面向对象组合 (OOP Composition) |
| :--- | :--- | :--- |
| **构造方式** | `tree(label, branches)` | `Tree(label, branches)` |
| **选择器** | 必须显式实现 `label(t)`, `branches(t)` | 原生属性点访问 `t.label`, `t.branches` |
| **底层表示** | 暴露为嵌套列表或元组 | 封装在对象内部，外部不可见底层存储细节 |
| **格式化输出** | 依赖外置打印函数 | 自动集成 `__repr__` 与多行缩进 `__str__` |

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 树对象的面向对象建模 (The Tree Class)」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 树形递归经典算法实战

[![树形递归经典算法实战 · 课堂板书演示 (00:30:15)](</attachments/cs61a-cb8b20c0d2056f4d786fd4dd.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)
*⏱ 时间戳：00:30:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)*

#### 📸 课堂板书与代码演示深入精读 (00:30:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Then we can return all of these leaves. And if we call leaves on fib tree six, we get a list of leaves that sum to eight, which is Fibonacci number six. And what's the height of this tree? Well, the height of a leaf is zero. And the height of a tree in general is the number of transitions in its lon...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 树形递归经典算法实战」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 1. 收集所有叶子节点 `leaves(t)`

```python
def leaves(t):
    """返回树 t 的所有叶子节点标签列表。"""
    if t.is_leaf():
        return [t.label]
    all_leaves = []
    for b in t.branches:
        all_leaves.extend(leaves(b))
    return all_leaves
```

### 2. 计算树的高度 `height(t)`

树的高度定义为根节点到任意叶子节点的最长路径跳数（叶子高度为 0）：

```python
def height(t):
    """计算树 t 的高度。"""
    if t.is_leaf():
        return 0
    return 1 + max(height(b) for b in t.branches)
```

### 3. 就地修剪子树 `prune(t, n)`

[![就地修剪子树 prune(t, n) · 课堂板书演示 (00:32:15)](</attachments/cs61a-dace2d2fd80112e5876f96a4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)
*⏱ 时间戳：00:32:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:32:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)*

#### 📸 课堂板书与代码演示深入精读 (00:32:15)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So here's an example tree, and let's say we want to prune all of the subtrees whose root label is 1. This 0 goes because it's part of this subtree. Here's a template. Pause for a moment and try to fill it in, and I'll go over the solution in 3, 2, 1. The key here is to modify t.branches by setting i...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「6. 树形递归经典算法实战」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「Link 递归链表类、递归方法定义与原地节点重连」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


需求：移除树 `t` 中所有根标签为 `n` 的子树分支：

```python
def prune(t, n):
    """就地修剪掉树中所有根标签为 n 的分支。"""
    # 策略：优先剔除直接子分支，再递归修剪剩余存活分支
    t.branches = [b for b in t.branches if b.label != n]
    for b in t.branches:
        prune(b, n)
```

---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 树形递归经典算法实战」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
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

1. **组合的威力**：通过对象属性持有其他对象，使链表和树这种自然包含层级结构的数据结构能够被直接、内聚地表示。
2. **递归处理范式**：
   - 链表递归：基例处理 `Link.empty`，递归步拆解为 `s.first` 与 `s.rest`；
   - 树递归：基例处理 `t.is_leaf()`，递归步遍历 `t.branches`。
3. **可变性陷阱**：属性赋值可改变拓扑连通性，必须谨慎管理引用，防止死循环与非预期内存泄露。

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
| [← 上一讲：Lecture 21 Representation](/notes/cs61a/lecture-21) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 23 Efficiency →](/notes/cs61a/lecture-23) | [🎬 在 B 站观看本讲 (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22) |
