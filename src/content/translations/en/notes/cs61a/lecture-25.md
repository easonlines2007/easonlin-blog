---
kind: notes
source: cs61a/lecture-25
title: "Lecture 25 · Data Examples: Data Structures and Midterm Problems"
description: "CS61A Lecture 25: Data structures and classic midterm problems."
sourceHash: 8f388ed2f5483ecd1039ee1947f14b5b5570012519bcce56e2c66e4aa01be431
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 38:37 ｜ **Video link back**: [B station response unit set (P25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25)

## 1. Core mind model and architecture

In this comprehensive lecture on Module 3 (object-oriented and efficiency), Professor DeNero selected four core topics of big data structure and computational thinking in the internship exam and high frequency technology interview:

```
                              ┌────────────────────────────────────────┐
                              │     Module 3 综合题解与实战大典        │
                              └───────────────────┬────────────────────┘
                                                  │
         ┌───────────────────┬────────────────────┴────────────────────┬────────────────────┐
         ▼                   ▼                                         ▼                    ▼
  ┌───────────────┐   ┌───────────────┐                         ┌───────────────┐    ┌───────────────┐
  │ 列表变动模型  │   │ 面向对象考题  │                         │ 序列推导算法  │    │ 链表归并经典  │
  ├───────────────┤   ├───────────────┤                         ├───────────────┤    ├───────────────┤
  │ • append/ext  │   │ • Worker 类   │                         │ • 最小绝对值  │    │ • ordered()   │
  │ • 切片赋值    │   │ • 资产阶级继承│                         │ • 邻项最大和  │    │ • merge()     │
  │ • 环形自引用  │   │ • 遮蔽与repr  │                         │ • 字典推导聚合│    │ • in-place    │
  └───────────────┘   └───────────────┘                         └───────────────┘    └───────────────┘
```

---

## 2. List Mutation and Environment Diagrams

In Python, variable is just a pointer to the object. The list of its own mutable properties leads to complex \*\* Aliasing\*\* phenomena.

![List of mutable Mutation & Environment Diagrams · lecture board illustration (00:00:55)](</attachments/cs61a-f352c7eb5d603231d063b2dc.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P25 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=55)*

### The append vs extend

- `s.append(t)` The object:  `t` **As a whole, as a single item** Added to  `s`  The end;
- `s.extend(t)` The whole world:  `t`  And every element of the **One by one** Added to  `s`  The end.

### Environmental tracking of spelling and citation of the list

![List puzzle with the environment trace referenced in slice lecture board illustration (00:02:45)](</attachments/cs61a-10b65ce9f913063627c45e7e.png>)
*⏱ Timestamp: 00:02:45 · 📷 Lecture screenshot · [Watch clip (P25 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=165)*

```python
s = [2, 3]
t = [5, 6]

a = s + [t]  # a 为全新列表 [2, 3, [5, 6]]，内部引用 t 的同一对象
b = a[1:]    # b 为切片新列表 [3, [5, 6]]

a[1] = 9          # 仅改变 a 的首层元素，不影响 b
b[1][1] = 0       # 修改了共享的 t 列表！t 变为 [5, 0]
```

> **Tracking rules** The following is a list of the countries  `a`  and  `b`  Sub-lists of common references  `t` Changes  `b[1][1]`  It's a good idea.  `t`, `a[2]`  and  `b[1]`  The world is changing!

### The higher-order technique: Slice Assignment

![higher-order technique: Slice Assignment lecture board illustration (00:05:15)](</attachments/cs61a-f496f49368a1a2570cfb185b.png>)
*⏱ Timestamp: 00:05:15 · 📷 Lecture screenshot · [Watch clip (P25 00:05:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=315)*

The assignment of a slice can be done by inserting, replacing or removing a sequential element on the premise that no new list envelope is created:

```python
s = [2, 3]
t = [5, 6]

# 在索引 0 处就地插入 t 的全部元素（长度 0 替换为长度 2，后续元素后移）
s[0:0] = t       # s 变为 [5, 6, 2, 3]

# 就地切片删除
del s[0:2]       # 或 s[0:2] = []，s 恢复为 [2, 3]
```

### Making a self-reference list

![Manufacture self-referenced loop list lecture board illustration (00:08:15)](</attachments/cs61a-26c605497e8a84b73b5d2b1a.png>)
*⏱ Timestamp: 00:08:15 · 📷 Lecture screenshot · [Watch clip (P25 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=495)*

```python
t = [1, 2, 3]
t[1:3] = [t]     # 将索引 1..2 替换为包含自身的列表指针
# t 变为 [1, [...]]，形成无限自引用的环形列表！
```

---

## 3. object-oriented calendar classical essay analysis: Worker and Bourgeoisie

![object-oriented Acronyms of the Calendar: Worker and Bourgeoisie lecture board illustration (00:10:45)](</attachments/cs61a-d4220e5fbdd2480de09d4c8a.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P25 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=645)*

### Title code definition

```python
class Worker:
    greeting = 'Sir'
    def __init__(self):
        self.elf = Worker

    def work(self):
        return self.greeting + ', I work'

    def __repr__(self):
        return Bourgeoisie.greeting

class Bourgeoisie(Worker):
    greeting = 'Peon'
    def work(self):
        print(Worker.work(self))
        return 'I gather wealth'

jack = Worker()
john = Bourgeoisie()
jack.greeting = "Ma'am"
```

![The title code definition is lecture board illustration (00:12:45)](</attachments/cs61a-0aaa10e96e8ef0c952e7bf34.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P25 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=765)*

### The topic of the question is to be followed by a step-by-step evaluation.

![Questions and progress evaluation Initiating . lecture board illustration (00:14:45)](</attachments/cs61a-d3de76cfe4feb629b4aa6f5f.png>)
*⏱ Timestamp: 00:14:45 · 📷 Lecture screenshot · [Watch clip (P25 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=885)*

![Questions and progress evaluation Initiating . lecture board illustration (00:16:45)](</attachments/cs61a-bbee9123e4d9a4ae4cc5a482.png>)
*⏱ Timestamp: 00:16:45 · 📷 Lecture screenshot · [Watch clip (P25 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1005)*

1. **`Worker().work()`**: 
   - Anonymous is an example.  `Worker` Calling  `work()`.
   - `self.greeting`  The first is the "Fireflowers" and the second is the "Golden Age".  `Worker.greeting = 'Sir'`.
   - **The results**: `'Sir, I work'`.
2. **`jack`  (Exit in REPL interactive environment)**: 
   - Direct evaluation  `jack`  It's going to trigger it.  `__repr__()`.
   - `Worker.__repr__`  Return  `Bourgeoisie.greeting` It's the  `'Peon'`.
   - **Interacting with the output**: `Peon`.
3. **`jack.work()`**: 
   - `jack`  It is a special instance attribute.  `jack.greeting = "Ma'am"` (Class attribute coverage occurs)
   - **The results**: `"Ma'am, I work"`.
4. **`john.work()`**: 
   - `Bourgeoisie.work`  First, the execution  `print(Worker.work(self))`.
   - Commissioned  `Worker.work(john)`, `john.greeting`  Life is good.  `Bourgeoisie.greeting = 'Peon'`.
   - Print out: `Peon, I work` (Control directly output, **No quotes**).
   - The function then returns the string  `'I gather wealth'` (REPL returns the value of the string quotation)
5. **`john.elf.work(john)`**: 
   - `john.elf`  Yes, I did.  `Worker`  Class: Calling the ordinary function  `Worker.work(john)` Input  `john`  As a  `self`.
   - **The results**: `'Peon, I work'`.

---

## 4. Sequence Manipulations (High-level derivation and aggregation)

![Sequence Manipulations and Advanced Derivation of Sequence (00:19:15) · lecture board illustration](</attachments/cs61a-32759fd094e7f8055f9c3759.png>)
*⏱ Timestamp: 00:19:15 · 📷 Lecture screenshot · [Watch clip (P25 00:19:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1155)*

### Challenge 1: Find all the sub-sections of absolute least elements

![Challenge 1: Find all subscripts of the minimum absolute value lecture board illustration (00:21:45)](</attachments/cs61a-198fcdd2e9de9821c475c1fc.png>)
*⏱ Timestamp: 00:21:45 · 📷 Lecture screenshot · [Watch clip (P25 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1305)*

```python
s = [-4, -3, -2, 3, 2, 4]

# 两行优雅解法
min_abs = min(map(abs, s))
indices = [i for i in range(len(s)) if abs(s[i]) == min_abs]
# indices: [2, 4]
```

### Challenge 2: Adjacent Sum of the Largest Sum of Two Neighbouring Points

![Challenge 2: Maximum sum of adjacent two (Adjacent Sum) lecture board illustration (00:24:15)](</attachments/cs61a-2f3543e2f77c465a9c985f3c.png>)
*⏱ Timestamp: 00:24:15 · 📷 Lecture screenshot · [Watch clip (P25 00:24:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1455)*

```python
# 解法 A：索引切片范围
max(s[i] + s[i+1] for i in range(len(s) - 1))

# 解法 B：zip 对齐错位相加（更具 Pythonic 风格）
max(a + b for a, b in zip(s[:-1], s[1:]))
```

### Challenge 3: Dictionary derivatives grouped by end digit

![Challenge 3: dictionary extrapolation lecture board illustration (00:26:45)](</attachments/cs61a-99c84cefb1d170a479ef91d1.png>)
*⏱ Timestamp: 00:26:45 · 📷 Lecture screenshot · [Watch clip (P25 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1605)*

```python
# 将数字列表按末位数字 (0~9) 归类为字典，仅保留存在的数字
last_digits = {x % 10 for x in s}
grouped = {d: [x for x in s if x % 10 == d] for d in last_digits}
```

### Challenge 4: Determine whether each element is a repeat item in the list

![Challenge 4: Determine whether each element has a duplicate item in the list. lecture board illustration (00:29:45)](</attachments/cs61a-80d1062e89f0b2415757f77b.png>)
*⏱ Timestamp: 00:29:45 · 📷 Lecture screenshot · [Watch clip (P25 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1785)*

```python
# 极简解法：所有元素的出现频次均大于 1
all(s.count(x) > 1 for x in s)
# 或
min(s.count(x) for x in s) > 1
```

---

## 5. linked list classical algorithm: orderly determination with linked list merging

![Classic linked list algorithm: Orderd determination and twin-chaining (Linked List Merging) lecture board illustration (00:32:45)](</attachments/cs61a-b21d17ac3c0f1e1da3034e5b.png>)
*⏱ Timestamp: 00:32:45 · 📷 Lecture screenshot · [Watch clip (P25 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1965)*

### 1. recursion determines the order of linked lists  `ordered(s, key)`

![recursion determines the order of linked list ordered (s, key) lecture board illustration (00:34:45)](</attachments/cs61a-1c3fd8d9a2863d6ad139e19d.png>)
*⏱ Timestamp: 00:34:45 · 📷 Lecture screenshot · [Watch clip (P25 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2085)*

```python
def ordered(s, key=lambda x: x):
    """递归检查链表 s 在 key 映射下是否单调非递减。"""
    if s is Link.empty or s.rest is Link.empty:
        return True
    elif key(s.first) > key(s.rest.first):
        return False
    return ordered(s.rest, key)
```

### 2. Pure functional addition  `merge(s, t)`

Enter two ordered linked lists and return a new, all-originally linked list containing both elements:

![Pure function amalgamation merge(s, t) . lecture board illustration (00:36:45)](</attachments/cs61a-dffd4f6a8cc0b52a7953d968.png>)
*⏱ Timestamp: 00:36:45 · 📷 Lecture screenshot · [Watch clip (P25 00:36:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2205)*

```python
def merge(s, t):
    """递归构建合并后的新链表。"""
    if s is Link.empty:
        return t
    elif t is Link.empty:
        return s
    elif s.first <= t.first:
        return Link(s.first, merge(s.rest, t))
    else:
        return Link(t.first, merge(s, t.rest))
```

### 3. Reconnecting points on the ground  `merge_in_place(s, t)`

![The location of the pointer is reconnected and merge\_in\_place (s, t) · lecture board illustration (00:38:15)](</attachments/cs61a-00470a2a533d96250cb0f168.png>)
*⏱ Timestamp: 00:38:15 · 📷 Lecture screenshot · [Watch clip (P25 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2295)*

The need: **It's not a new thing at all.  `Link`  The nodes** The new system will be implemented by modifying existing nodes.  `rest`  The following is the list of top points for interviews:

```python
def merge_in_place(s, t):
    """就地重连节点指针，O(1) 额外空间归并有序链表。"""
    if s is Link.empty:
        return t
    elif t is Link.empty:
        return s
    elif s.first <= t.first:
        s.rest = merge_in_place(s.rest, t)
        return s
    else:
        t.rest = merge_in_place(s, t.rest)
        return t
```

> **An elegant algorithm** The basic situation remains the same; in the recursion step, we directly add smaller nodes to the network.  `rest`  The new binding is the result of a subsequent merger, and ultimately returns to the smaller node itself.  $O(1)$  Space is expended!

---

## 6. Summary of the Modules and Core Points

1. **Environmental map tracking capabilities** Face-to-face with the assignment of bits and names, draw strictly the object frames and arrows, clear the name changes to bind the string and the data set inside the object changes to the string.
2. **object-oriented property determination** Note: remember the backtracking rules of pre-checking instances, post-checking classes and re-checking base class; type methods must be manually transmitted when calling unbound instances  `self`.
3. **Linked list pointer algorithm** The first is the function of the function. `Link(...)` The first is the "Signal" (s) and the "Place Pointing". `s.rest = ...` The first is the free exchange of information between the two countries, with a full understanding of spatial differences in expenditure.

---

