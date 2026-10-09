---
title: Lecture 25 · 数据结构与期中经典题解 (Data Examples)
description: CS61A 第 25 讲：数据结构与期中经典题解 (Data Examples)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 25
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：38:37 ｜ **视频回链**：[B 站对应单集 (P25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25)

## 1. 核心心智模型与架构图解

本讲为 Module 3（面向对象与效率）的综合大收官讲座。DeNero 教授精选了历年期中考试与高频技术面试中最核心的四大数据结构与计算思维主题：

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

## 2. 列表可变性与环境图 (List Mutation & Environment Diagrams)

在 Python 中，变量名只是指向对象的指针。列表自身的可变性（Mutation）会导致复杂的**别名共享（Aliasing）**现象。

![列表可变性与环境图 (List Mutation & Environment Diagrams) · 课堂板书演示 (00:00:55)](</attachments/cs61a-f352c7eb5d603231d063b2dc.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=55)*

### 操作对比：append vs extend

- `s.append(t)`：将对象 `t` **作为一个整体单项**追加到 `s` 末尾；
- `s.extend(t)`：遍历 `t` 的每一个元素，**逐一平铺**追加到 `s` 末尾。

### 列表拼接与切片引用的环境追踪

![列表拼接与切片引用的环境追踪 · 课堂板书演示 (00:02:45)](</attachments/cs61a-10b65ce9f913063627c45e7e.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=165)*

```python
s = [2, 3]
t = [5, 6]

a = s + [t]  # a 为全新列表 [2, 3, [5, 6]]，内部引用 t 的同一对象
b = a[1:]    # b 为切片新列表 [3, [5, 6]]

a[1] = 9          # 仅改变 a 的首层元素，不影响 b
b[1][1] = 0       # 修改了共享的 t 列表！t 变为 [5, 0]
```

> **追踪法则**：
> 由于 `a` 和 `b` 的子列表共同指向 `t`，修改 `b[1][1]` 使得 `t`、`a[2]` 与 `b[1]` 同时发生变化！

### 高阶技巧：切片赋值 (Slice Assignment)

![高阶技巧：切片赋值 (Slice Assignment) · 课堂板书演示 (00:05:15)](</attachments/cs61a-f496f49368a1a2570cfb185b.png>)
*⏱ 时间戳：00:05:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:05:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=315)*

切片赋值可以在不创建新列表外壳的前提下，就地插入、替换或删除一段连续元素：

```python
s = [2, 3]
t = [5, 6]

# 在索引 0 处就地插入 t 的全部元素（长度 0 替换为长度 2，后续元素后移）
s[0:0] = t       # s 变为 [5, 6, 2, 3]

# 就地切片删除
del s[0:2]       # 或 s[0:2] = []，s 恢复为 [2, 3]
```

### 制造自引用循环列表

![制造自引用循环列表 · 课堂板书演示 (00:08:15)](</attachments/cs61a-26c605497e8a84b73b5d2b1a.png>)
*⏱ 时间戳：00:08:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=495)*

```python
t = [1, 2, 3]
t[1:3] = [t]     # 将索引 1..2 替换为包含自身的列表指针
# t 变为 [1, [...]]，形成无限自引用的环形列表！
```

---

## 3. 面向对象历年经典考题剖析：Worker 与 Bourgeoisie

![面向对象历年经典考题剖析：Worker 与 Bourgeoisie · 课堂板书演示 (00:10:45)](</attachments/cs61a-d4220e5fbdd2480de09d4c8a.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=645)*

### 题目代码定义

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

![题目代码定义 · 课堂板书演示 (00:12:45)](</attachments/cs61a-0aaa10e96e8ef0c952e7bf34.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=765)*

### 题目设问与逐步求值推导

![题目设问与逐步求值推导 · 课堂板书演示 (00:14:45)](</attachments/cs61a-d3de76cfe4feb629b4aa6f5f.png>)
*⏱ 时间戳：00:14:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:14:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=885)*

![题目设问与逐步求值推导 · 课堂板书演示 (00:16:45)](</attachments/cs61a-bbee9123e4d9a4ae4cc5a482.png>)
*⏱ 时间戳：00:16:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1005)*

1. **`Worker().work()`**：
   - 实例化一个匿名 `Worker`，调用 `work()`。
   - `self.greeting` 在实例中未找到，回溯至 `Worker.greeting = 'Sir'`。
   - **结果**：`'Sir, I work'`。
2. **`jack` (在 REPL 交互环境输出)**：
   - 直接求值 `jack` 会触发其 `__repr__()`。
   - `Worker.__repr__` 返回 `Bourgeoisie.greeting`，即 `'Peon'`。
   - **交互输出**：`Peon`。
3. **`jack.work()`**：
   - `jack` 拥有专属实例属性 `jack.greeting = "Ma'am"`（发生了类属性遮蔽）。
   - **结果**：`"Ma'am, I work"`。
4. **`john.work()`**：
   - `Bourgeoisie.work` 首先执行 `print(Worker.work(self))`。
   - 委托 `Worker.work(john)`，`john.greeting` 命中 `Bourgeoisie.greeting = 'Peon'`。
   - 打印输出：`Peon, I work`（控制台直接输出，**无引号**）。
   - 函数随后返回字符串 `'I gather wealth'`（REPL 返回值带引号）。
5. **`john.elf.work(john)`**：
   - `john.elf` 是 `Worker` 类。调用普通函数 `Worker.work(john)`，传入 `john` 作为 `self`。
   - **结果**：`'Peon, I work'`。

---

## 4. 序列高级推导与聚合四连题 (Sequence Manipulations)

![序列高级推导与聚合四连题 (Sequence Manipulations) · 课堂板书演示 (00:19:15)](</attachments/cs61a-32759fd094e7f8055f9c3759.png>)
*⏱ 时间戳：00:19:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:19:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1155)*

### 挑战 1：寻找绝对值最小元素的所有下标

![挑战 1：寻找绝对值最小元素的所有下标 · 课堂板书演示 (00:21:45)](</attachments/cs61a-198fcdd2e9de9821c475c1fc.png>)
*⏱ 时间戳：00:21:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1305)*

```python
s = [-4, -3, -2, 3, 2, 4]

# 两行优雅解法
min_abs = min(map(abs, s))
indices = [i for i in range(len(s)) if abs(s[i]) == min_abs]
# indices: [2, 4]
```

### 挑战 2：相邻两项的最大和 (Adjacent Sum)

![挑战 2：相邻两项的最大和 (Adjacent Sum) · 课堂板书演示 (00:24:15)](</attachments/cs61a-2f3543e2f77c465a9c985f3c.png>)
*⏱ 时间戳：00:24:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:24:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1455)*

```python
# 解法 A：索引切片范围
max(s[i] + s[i+1] for i in range(len(s) - 1))

# 解法 B：zip 对齐错位相加（更具 Pythonic 风格）
max(a + b for a, b in zip(s[:-1], s[1:]))
```

### 挑战 3：按末位数字分组的字典推导式

![挑战 3：按末位数字分组的字典推导式 · 课堂板书演示 (00:26:45)](</attachments/cs61a-99c84cefb1d170a479ef91d1.png>)
*⏱ 时间戳：00:26:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1605)*

```python
# 将数字列表按末位数字 (0~9) 归类为字典，仅保留存在的数字
last_digits = {x % 10 for x in s}
grouped = {d: [x for x in s if x % 10 == d] for d in last_digits}
```

### 挑战 4：判断是否每个元素都在列表中有重复项

![挑战 4：判断是否每个元素都在列表中有重复项 · 课堂板书演示 (00:29:45)](</attachments/cs61a-80d1062e89f0b2415757f77b.png>)
*⏱ 时间戳：00:29:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:29:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1785)*

```python
# 极简解法：所有元素的出现频次均大于 1
all(s.count(x) > 1 for x in s)
# 或
min(s.count(x) for x in s) > 1
```

---

## 5. 链表经典算法：有序判定与双链归并 (Linked List Merging)

![链表经典算法：有序判定与双链归并 (Linked List Merging) · 课堂板书演示 (00:32:45)](</attachments/cs61a-b21d17ac3c0f1e1da3034e5b.png>)
*⏱ 时间戳：00:32:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=1965)*

### 1. 递归判定链表有序性 `ordered(s, key)`

![递归判定链表有序性 ordered(s, key) · 课堂板书演示 (00:34:45)](</attachments/cs61a-1c3fd8d9a2863d6ad139e19d.png>)
*⏱ 时间戳：00:34:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2085)*

```python
def ordered(s, key=lambda x: x):
    """递归检查链表 s 在 key 映射下是否单调非递减。"""
    if s is Link.empty or s.rest is Link.empty:
        return True
    elif key(s.first) > key(s.rest.first):
        return False
    return ordered(s.rest, key)
```

### 2. 纯函数式归并 `merge(s, t)`

输入两个有序链表，返回一个包含两者全部元素的全新有序链表：

![纯函数式归并 merge(s, t) · 课堂板书演示 (00:36:45)](</attachments/cs61a-dffd4f6a8cc0b52a7953d968.png>)
*⏱ 时间戳：00:36:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:36:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2205)*

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

### 3. 就地指针重连归并 `merge_in_place(s, t)`

![就地指针重连归并 merge_in_place(s, t) · 课堂板书演示 (00:38:15)](</attachments/cs61a-00470a2a533d96250cb0f168.png>)
*⏱ 时间戳：00:38:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P25 00:38:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=25&t=2295)*

需求：**完全不分配任何新的 `Link` 节点**，仅通过修改现有节点的 `rest` 指针完成就地合并（面试顶级考点）：

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

> **算法之精妙**：
> 基础情况不变；在递归步中，我们直接将较小节点的 `rest` 重新绑定为后续合并结果，最后返回当前较小节点自身。无需任何辅助节点，优雅达成 $O(1)$ 空间开销！

---

## 6. 模块总结与核心考点

1. **环境图跟踪能力**：面对切片赋值与别名，严格画出对象框与箭头，分清“修改名字绑定”与“修改对象内部数据”。
2. **面向对象属性判定**：牢记“先查实例，后查类，再查基类”的回溯铁律；类方法调用未绑定实例时须手动传 `self`。
3. **链表指针算法**：在纯函数创建（`Link(...)`）与就地指针篡改（`s.rest = ...`）之间自由切换，透彻理解空间开销差异。

---

