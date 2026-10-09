---
title: Lecture 22 · 对象组合与链表树形结构 (Composition)
description: CS61A 第 22 讲：对象组合与链表树形结构 (Composition)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 22
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：33:16 ｜ **视频回链**：[B 站对应单集 (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22)

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

## 2. 链表类的设计与盒指针模型 (The Link Class)

链表要么为空，要么由当前元素（`first`）和后续链表（`rest`）组成。

![链表类的设计与盒指针模型 (The Link Class) · 课堂板书演示 (00:00:55)](</attachments/cs61a-29829e8b8728caea5c0cba9e.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)*

### 盒指针图解 (Box-and-Pointer Diagrams)

在计算机科学中，链表标准图解采用双格盒表示一个节点，右格箭头指向下一个节点，尾部的空列表通常用一根斜杠（`/`）表示：

![盒指针图解 (Box-and-Pointer Diagrams) · 课堂板书演示 (00:02:45)](</attachments/cs61a-e5e0046eb85e62599f6af736.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)*

![盒指针图解 (Box-and-Pointer Diagrams) · 课堂板书演示 (00:04:45)](</attachments/cs61a-55b9aecefe435d5af5d5f33f.png>)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)*

### Link 类的规范实现

![Link 类的规范实现 · 课堂板书演示 (00:06:15)](</attachments/cs61a-b3e9282b11b0cbdd320dfb8a.png>)
*⏱ 时间戳：00:06:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)*

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

![属性访问与节点检索 · 课堂板书演示 (00:08:15)](</attachments/cs61a-6b69803fc68308b4c215e81c.png>)
*⏱ 时间戳：00:08:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)*

```python
s = Link(3, Link(4, Link(5)))

print(s.first)             # 3 (第 0 项)
print(s.rest.first)        # 4 (第 1 项)
print(s.rest.rest.first)   # 5 (第 2 项)
print(s.rest.rest.rest is Link.empty)  # True
```

---

## 3. 链表的递归处理：Range, Map 与 Filter

由于链表具有天然的递归组合结构，处理链表的最自然方式就是**递归**。

![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:10:45)](</attachments/cs61a-ff7377338721a4e0d8b22fb2.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)*

![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:12:45)](</attachments/cs61a-f65b1e51a2f7e1d635523979.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)*

![链表的递归处理：Range, Map 与 Filter · 课堂板书演示 (00:14:15)](</attachments/cs61a-ebb0626edf7614f4d51223c2.png>)
*⏱ 时间戳：00:14:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)*

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

## 4. 链表就地修改与循环链表 (Mutation & Cycles)

链表作为对象实例，其 `first` 与 `rest` 属性均可被就地重绑定。这种可变性带来了极高的灵活性，但也引入了产生**循环链表（Cycle）**的可能。

![链表就地修改与循环链表 (Mutation & Cycles) · 课堂板书演示 (00:16:15)](</attachments/cs61a-77e2c5022cadca9cc5b992b3.png>)
*⏱ 时间戳：00:16:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)*

![链表就地修改与循环链表 (Mutation & Cycles) · 课堂板书演示 (00:17:45)](</attachments/cs61a-c66869d10913b9bb421bb1e2.png>)
*⏱ 时间戳：00:17:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)*

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

![经典算法：保持升序就地插入 add(s, v) · 课堂板书演示 (00:19:45)](</attachments/cs61a-abfb2f78ad3d38201e3cdbbd.png>)
*⏱ 时间戳：00:19:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:19:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)*

![经典算法：保持升序就地插入 add(s, v) · 课堂板书演示 (00:21:15)](</attachments/cs61a-330c304930b4b2ee6b884513.png>)
*⏱ 时间戳：00:21:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)*

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

## 5. 树对象的面向对象建模 (The Tree Class)

在 Lecture 14 中，我们曾使用函数数据抽象（嵌套列表）构造树。现在，使用面向对象组合，树的定义变得前所未有的清晰。

![树对象的面向对象建模 (The Tree Class) · 课堂板书演示 (00:23:15)](</attachments/cs61a-8bf43f81485ce6ab490d3d03.png>)
*⏱ 时间戳：00:23:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:23:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)*

![树对象的面向对象建模 (The Tree Class) · 课堂板书演示 (00:25:15)](</attachments/cs61a-27f9426788d5d4d618c779c1.png>)
*⏱ 时间戳：00:25:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)*

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

![Tree 类的规范定义 · 课堂板书演示 (00:27:45)](</attachments/cs61a-2b354ef66684d53c12630700.png>)
*⏱ 时间戳：00:27:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:27:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)*

### 面向对象 vs 数据抽象设计对比

| 维度 | 函数式数据抽象 (Functional Abstraction) | 面向对象组合 (OOP Composition) |
| :--- | :--- | :--- |
| **构造方式** | `tree(label, branches)` | `Tree(label, branches)` |
| **选择器** | 必须显式实现 `label(t)`, `branches(t)` | 原生属性点访问 `t.label`, `t.branches` |
| **底层表示** | 暴露为嵌套列表或元组 | 封装在对象内部，外部不可见底层存储细节 |
| **格式化输出** | 依赖外置打印函数 | 自动集成 `__repr__` 与多行缩进 `__str__` |

---

## 6. 树形递归经典算法实战

![树形递归经典算法实战 · 课堂板书演示 (00:30:15)](</attachments/cs61a-cb8b20c0d2056f4d786fd4dd.png>)
*⏱ 时间戳：00:30:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)*

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

![就地修剪子树 prune(t, n) · 课堂板书演示 (00:32:15)](</attachments/cs61a-dace2d2fd80112e5876f96a4.png>)
*⏱ 时间戳：00:32:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P22 00:32:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)*

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

## 7. 章节总结与核心考点

1. **组合的威力**：通过对象属性持有其他对象，使链表和树这种自然包含层级结构的数据结构能够被直接、内聚地表示。
2. **递归处理范式**：
   - 链表递归：基例处理 `Link.empty`，递归步拆解为 `s.first` 与 `s.rest`；
   - 树递归：基例处理 `t.is_leaf()`，递归步遍历 `t.branches`。
3. **可变性陷阱**：属性赋值可改变拓扑连通性，必须谨慎管理引用，防止死循环与非预期内存泄露。

---

