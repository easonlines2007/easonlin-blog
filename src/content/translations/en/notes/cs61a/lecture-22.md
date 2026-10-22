---
kind: notes
source: cs61a/lecture-22
title: "Lecture 22 · Composition: Linked Lists and Trees"
description: "CS61A Lecture 22: Object composition, linked lists, and tree structures."
sourceHash: 33bec937555406f5c313ce2f2ebd3c47213d160927d70e1405802ffcec9bac16
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-22).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 33:16 ｜ **Video link back**: [B station response unit set (P22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22)

## 1. Core mind model and architecture

**The first is the "Composition".**  It is another core design pillar in the object-oriented field other than inheritance.  **The following is a list of the countries in which the number of registered users is increasing:**  Relationship: An object takes another object as part of its property.

And by grouping, we can build an extremely elegant and elegant structure. recursion Advanced data structure for properties:
1. **Linked List** One:  `Link`  The node contains a current value  `first`  And another  `Link`  Examples  `rest`.
2. **The Tree** One:  `Tree`  The node contains a root node tag  `label`  and a list of branches of subtrees  `branches`.

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

## 2. The Link Class (design of linked list class and box pointer model)

linked list is either empty or is based on the current element(s) `first` The following is a list of the main features of the linked list: `rest` The following is a list of the countries in Africa.

![linked list The Link Class. lecture board illustration (00:00:55)](</attachments/cs61a-29829e8b8728caea5c0cba9e.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P22 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=55)*

### Box-and-Pointer Diagrams

In computer science, a linked list standard graph uses a binary box to represent one node, with the right arrow pointing to the next node and empty lists at the tail are usually used with a slope. `/`) means:

![The first is the "Band and Pointer Diagrams" lecture board illustration (00:02:45)](</attachments/cs61a-e5e0046eb85e62599f6af736.png>)
*⏱ Timestamp: 00:02:45 · 📷 Lecture screenshot · [Watch clip (P22 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=165)*

![The first is the "Band and Pointer Diagrams" lecture board illustration (00:04:45)](</attachments/cs61a-55b9aecefe435d5af5d5f33f.png>)
*⏱ Timestamp: 00:04:45 · 📷 Lecture screenshot · [Watch clip (P22 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=285)*

### Implementation of the Link class specification

![lecture board illustration (00:06:15)](</attachments/cs61a-b3e9282b11b0cbdd320dfb8a.png>)
*⏱ Timestamp: 00:06:15 · 📷 Lecture screenshot · [Watch clip (P22 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=375)*

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

> **Design points**: 
> 1. `rest`  The default value is  `Link.empty` The term "node" is used to describe a single node.  `Link(5)`.
> 2. `isinstance(rest, Link)`  The verification ensures the well-formedness of the linked list structure and supports future possible subclasses.

### Attributes access and node retrieval

![Properties Access and Node Search lecture board illustration (00:08:15)](</attachments/cs61a-6b69803fc68308b4c215e81c.png>)
*⏱ Timestamp: 00:08:15 · 📷 Lecture screenshot · [Watch clip (P22 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=495)*

```python
s = Link(3, Link(4, Link(5)))

print(s.first)             # 3 (第 0 项)
print(s.rest.first)        # 4 (第 1 项)
print(s.rest.rest.first)   # 5 (第 2 项)
print(s.rest.rest.rest is Link.empty)  # True
```

---

## 3. Recursion processing of linked lists: Range, Map and Filter

Because a linked list has a natural recursion composite structure, the most natural way to handle a linked list is to **Recursion**.

![linked list It's... recursion Processing: Lange, Map and Filter. lecture board illustration (00:10:45)](</attachments/cs61a-ff7377338721a4e0d8b22fb2.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P22 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=645)*

![linked list It's... recursion Processing: Lange, Map and Filter. lecture board illustration (00:12:45)](</attachments/cs61a-f65b1e51a2f7e1d635523979.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P22 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=765)*

![linked list It's... recursion Processing: Lange, Map and Filter. lecture board illustration (00:14:15)](</attachments/cs61a-ebb0626edf7614f4d51223c2.png>)
*⏱ Timestamp: 00:14:15 · 📷 Lecture screenshot · [Watch clip (P22 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=855)*

### Recursion operations by the Tri-Sword Cavalry

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

### Combined exercises

```python
# 生成 1~5，过滤奇数，并求平方
s = range_link(1, 6)             # Link(1, Link(2, Link(3, Link(4, Link(5)))))
odds = filter_link(lambda x: x % 2 != 0, s)  # Link(1, Link(3, Link(5)))
squares = map_link(lambda x: x * x, odds)    # Link(1, Link(9, Link(25)))
```

---

## 4. linked lists are modified with a looped list (Mutation & Cycles)

Linked list as an instance of object, its  `first`  and  `rest`  The mutable has been shown to be highly flexible, but also introduces the possibility of generating a cycle called linked list (Cycle) \[1\].

![linked list Local Modification and Cycle linked list (Mutation & Cycles) lecture board illustration (00:16:15)](</attachments/cs61a-77e2c5022cadca9cc5b992b3.png>)
*⏱ Timestamp: 00:16:15 · 📷 Lecture screenshot · [Watch clip (P22 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=975)*

![linked list Local Modification and Cycle linked list (Mutation & Cycles) lecture board illustration (00:17:45)](</attachments/cs61a-c66869d10913b9bb421bb1e2.png>)
*⏱ Timestamp: 00:17:45 · 📷 Lecture screenshot · [Watch clip (P22 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1065)*

### Making an infinite ring reference

```python
s = Link(1, Link(2, Link(3)))
s.first = 5
t = s.rest  # t 指向 Link(2, Link(3))
t.rest = s  # 将 t.rest 重新指回链表头 s！

# 此时形成环状拓扑结构：5 -> 2 -> 5 -> 2 -> 5 ...
print(s.rest.rest.rest.rest.first)  # 5
```

### Classic algorithm: Keep the order up and insert  `add(s, v)`

![The classic algorithm: keep the order up and insert adds, v) · lecture board illustration (00:19:45)](</attachments/cs61a-abfb2f78ad3d38201e3cdbbd.png>)
*⏱ Timestamp: 00:19:45 · 📷 Lecture screenshot · [Watch clip (P22 00:19:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1185)*

![The classic algorithm: keep the order up and insert adds, v) · lecture board illustration (00:21:15)](</attachments/cs61a-330c304930b4b2ee6b884513.png>)
*⏱ Timestamp: 00:21:15 · 📷 Lecture screenshot · [Watch clip (P22 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1275)*

Demand: In a strictly incremental unrepeated linked list  `s`  The element is inserted in the interior.  `v` The following are the values of the order and the non-repeating values:

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

## 5. The Tree Class (the object-oriented modeling of tree objects)

In Lecture 14, we used the function data abstraction (nemix list) to construct trees. Now, with object-oriented combinations, the definition of trees becomes unprecedentedly clear.

![object-oriented modelling of tree objects (The Tree Class) lecture board illustration (00:23:15)](</attachments/cs61a-8bf43f81485ce6ab490d3d03.png>)
*⏱ Timestamp: 00:23:15 · 📷 Lecture screenshot · [Watch clip (P22 00:23:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1395)*

![object-oriented modelling of tree objects (The Tree Class) lecture board illustration (00:25:15)](</attachments/cs61a-27f9426788d5d4d618c779c1.png>)
*⏱ Timestamp: 00:25:15 · 📷 Lecture screenshot · [Watch clip (P22 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1515)*

### Specification of the Tree class

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

![The definition of the tree class is lecture board illustration (00:27:45)](</attachments/cs61a-2b354ef66684d53c12630700.png>)
*⏱ Timestamp: 00:27:45 · 📷 Lecture screenshot · [Watch clip (P22 00:27:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1665)*

### object-oriented vs data abstraction design comparison

| Dimension | Function data abstraction (Fundamental Action) | Object-oriented composition (OOP) |
| :--- | :--- | :--- |
| **How to Build** | `tree(label, branches)` | `Tree(label, branches)` |
| **Selector** | It must be done explicitly  `label(t)`, `branches(t)` | Access to the original property  `t.label`, `t.branches` |
| **The bottom line** | Exposure to nested lists or subgroups | Inside the object, hidden from view |
| **Formatting output** | Depending on the external print function | Automated integration  `__repr__`  and multiline indentation  `__str__` |

---

## 6. Tree-shaped recursion classic algorithm

![Tree recursion Classic Algorithm lecture board illustration (00:30:15)](</attachments/cs61a-cb8b20c0d2056f4d786fd4dd.png>)
*⏱ Timestamp: 00:30:15 · 📷 Lecture screenshot · [Watch clip (P22 00:30:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1815)*

### 1. Collect all the leaf nodes  `leaves(t)`

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

### 2. Calculate the height of trees  `height(t)`

The height of the tree is defined as the longest path jump from root node to arbitrary leaf node (leaf height 0):

```python
def height(t):
    """计算树 t 的高度。"""
    if t.is_leaf():
        return 0
    return 1 + max(height(b) for b in t.branches)
```

### 3. Cutting down the trees  `prune(t, n)`

![In-situ shear trees prune(t, n) lecture board illustration (00:32:15)](</attachments/cs61a-dace2d2fd80112e5876f96a4.png>)
*⏱ Timestamp: 00:32:15 · 📷 Lecture screenshot · [Watch clip (P22 00:32:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=22&t=1935)*

Requirements: Removing trees  `t`  All the root tags are  `n`  The branch of the tree:

```python
def prune(t, n):
    """就地修剪掉树中所有根标签为 n 的分支。"""
    # 策略：优先剔除直接子分支，再递归修剪剩余存活分支
    t.branches = [b for b in t.branches if b.label != n]
    for b in t.branches:
        prune(b, n)
```

---

## Chapter 7 Summary and Core Points

1. **The power of composition**: The holding of other objects through object properties allows linked list and trees, which naturally contain hierarchical structures, to be expressed directly, internally and centrally.
2. **recursion processing paradigm**: 
   - Linked listrecursion: base case processing  `Link.empty` The recursion step is broken down into  `s.first`  and  `s.rest`; 
   - Tree recursion: base case processing  `t.is_leaf()` recursion step by step  `t.branches`.
3. **The mutable traps** Asset assignment: To topological connectivity can be altered, and references must be carefully managed to prevent dead-loop and unexpected memory leakage.

---

