---
title: Lecture 16 · Iterators (迭代器、惰性计算与生成流)
description: CS61A 第 16 讲：Iterators (迭代器、惰性计算与生成流)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 16
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：29:29 ｜ **视频回链**：[B 站对应单集 (P16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16)

## 1. 引言：隐式序列表示与迭代器接口

在处理大规模甚至无限数据时，将所有数据一次性在内存中物化为列表（如 `[1, 2, 3, ...]`）既消耗昂贵的时间，也极易耗尽系统内存。

> **迭代器 (Iterator)**：一种**隐式表示序列数据**的对象。它不一次性存储所有元素，而是维护指向当前数据流位置的游标（Marker），按需依次产出下一个元素。

![引言：隐式序列表示与迭代器接口 · 课堂板书演示 (00:00:28)](</attachments/cs61a-45f3daee9688953e12fa1bf0.png>)
*⏱ 时间戳：00:00:28 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:00:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=28)*

---

## 2. 核心协议：`iter()`、`next()` 与 `StopIteration`

Python 迭代体系由两个内建函数和一对双下划线方法协议定义：

### 2.1 `iter` 与 `next` 的行为语义
- **`iter(iterable)`**：接收一个**可迭代对象 (Iterable)**（如列表、字典、元组、字符串、range），返回一个专属的**迭代器 (Iterator)**。
- **`next(iterator)`**：驱动迭代器游标向前推进一位，并返回游标所在位置的元素。

![iter 与 next 的行为语义 · 课堂板书演示 (00:01:25)](</attachments/cs61a-6e24ae818d143c3ea723f787.png>)
*⏱ 时间戳：00:01:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:01:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=85)*

```python
s = [3, 4, 5]
t = iter(s)  # 创建迭代器 t
next(t)      # 3 (游标移到 4)
next(t)      # 4 (游标移到 5)

u = iter(s)  # 创建独立的第二个迭代器 u
next(u)      # 3 (u 的游标从头开始)
next(t)      # 5 (t 记住了自己的位置，互不干扰)
```

```
容器对象 s: [ 3 | 4 | 5 ]
             ▲   ▲
             │   └── 迭代器 t 的当前位置 (下一个返回 5)
             └────── 迭代器 u 的当前位置 (下一个返回 3)
```

---

### 2.2 耗尽与终止：`StopIteration` 异常
当迭代器的所有元素都已被取出，再次调用 `next()` 将触发 `StopIteration` 异常。这是 Python 解释器识别迭代结束的标准化通知信号。

![耗尽与终止：StopIteration 异常 · 课堂板书演示 (00:03:26)](</attachments/cs61a-4ce1ad8525806bd8371b5e90.png>)
*⏱ 时间戳：00:03:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:03:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=206)*

```python
t = iter([1, 2])
next(t)  # 1
next(t)  # 2
next(t)  # 抛出 StopIteration 异常！
```
调用 `list(t)` 会将迭代器**剩余的所有元素**收集为新列表；若迭代器已耗尽，则返回空列表 `[]`。

---

## 3. 字典的迭代视图与运行期修改危机

### 3.1 字典视图与插入顺序保证
从 Python 3.6 开始，字典的迭代顺序严格保证为**键值对被添加到字典中的先后顺序**。

![字典视图与插入顺序保证 · 课堂板书演示 (00:04:28)](</attachments/cs61a-50febed4b02b0c3b95f36005.png>)
*⏱ 时间戳：00:04:28 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:04:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=268)*

字典提供了三种迭代视图（Views）：
- `iter(d)` 或 `iter(d.keys())`：遍历所有**键**。
- `iter(d.values())`：遍历所有**值**。
- `iter(d.items())`：遍历由 `(key, value)` 二元组构成的键值对。

---

### 3.2 运行期修改危机 (Dictionary Changed Size)
**严禁在遍历字典的同时添加或删除键**！

![运行期修改危机 (Dictionary Changed Size) · 课堂板书演示 (00:07:18)](</attachments/cs61a-833a64e53f15d18270fb99d9.png>)
*⏱ 时间戳：00:07:18 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:07:18)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=438)*

```python
d = {'a': 1, 'b': 2}
k = iter(d)
next(k)          # 'a'
d['c'] = 3       # 字典大小突变！
next(k)          # 抛出 RuntimeError: dictionary changed size during iteration
```
> **原理透视**：字典底层是哈希表。增删键会导致哈希桶扩容或重新散列，使原有的遍历游标彻底失效。若只是就地修改已有键的值（如 `d['a'] = 99`），则不会破坏结构，迭代可以安全继续。

---

## 4. `for` 循环与迭代器的一次性消费特性

### 4.1 对可迭代容器遍历 vs. 对迭代器遍历
- **可迭代容器 (如 `range`, `list`)**：每次放入 `for` 循环时，`for` 会自动调用 `iter()` 创建全新游标。因此可以反复多次遍历。
- **迭代器本身 (Iterator)**：游标状态单向流转，被遍历消费后**不可逆、不可复原**！

![对可迭代容器遍历 vs. 对迭代器遍历 · 课堂板书演示 (00:08:48)](</attachments/cs61a-40fcf6081575126b978bdc41.png>)
*⏱ 时间戳：00:08:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:08:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=528)*

```python
r = range(3, 6)
ri = iter(r)

for x in ri:
    print(x) # 打印 3, 4, 5

for x in ri:
    print(x) # 什么都不会打印！ri 已经耗尽在终点！
```

---

## 5. 高阶惰性计算管道：`map`, `filter`, `zip`, `reversed`

Python 提供了若干标准高阶迭代工具，核心特征是**惰性计算 (Lazy Computation)**：**只有在下游明确调用 `next()` 索取元素时，才真正执行一次计算**！

![高阶惰性计算管道：map, filter, zip, reversed · 课堂板书演示 (00:10:46)](</attachments/cs61a-35500e3c8809adcee6a32a73.png>)
*⏱ 时间戳：00:10:46 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:10:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=646)*

| 内置函数 | 作用 | 惰性特征 |
| :--- | :--- | :--- |
| **`map(fn, seq)`** | 对流中每个元素应用 `fn` | 仅在请求下一项时才调用 `fn(x)` |
| **`filter(pred, seq)`** | 保留使 `pred(x)` 为真的项 | 仅在请求时循环检索，找到第一个满足条件的项后立即暂停 |
| **`zip(seq1, seq2)`** | 将多个序列对应索引打包成元组 | 按最短序列长度截断对齐 |
| **`reversed(seq)`** | 逆序流 | 需已知序列长度与反向索引 |

---

### 5.1 惰性计算的证据：观察 `map` 的执行时机
```python
def double(x):
    print(f"** doubling {x} **")
    return 2 * x

m = map(double, [3, 5, 7])
# 控制台没有任何输出！计算被冻结推迟！
```

![控制台没有任何输出！计算被冻结推迟！ · 课堂板书演示 (00:12:52)](</attachments/cs61a-d6aa0213741ae4b675d74c7d.png>)
*⏱ 时间戳：00:12:52 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:12:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=772)*

只有当我们执行：
```python
next(m)  # 控制台打印: ** doubling 3 **, 返回 6
next(m)  # 控制台打印: ** doubling 5 **, 返回 10
```

---

### 5.2 管道串联 (Streaming Pipeline)
我们可以将多个惰性生成器无缝串联成流水线，形成类似工业传送带的数据过滤通道：

![管道串联 (Streaming Pipeline) · 课堂板书演示 (00:14:28)](</attachments/cs61a-916a1b1f281c359f91c0dad3.png>)
*⏱ 时间戳：00:14:28 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:14:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=868)*

```python
# 筛选大于等于 10 的偶数
m = map(double, range(3, 7))
f = filter(lambda y: y >= 10, m)
# 依次消费：double(3)=6(舍弃) -> double(4)=8(舍弃) -> double(5)=10(命中返回)
next(f)  # 返回 10
```

---

## 6. 经典案例分析：回文检测 (`palindrome`) 的两种范式

### 6.1 常见致命陷阱：迭代器判等
初学者常写出如下代码：
```python
def is_palindrome_bad(s):
    return s == reversed(s)  # 永远返回 False！
```

![常见致命陷阱：迭代器判等 · 课堂板书演示 (00:16:49)](</attachments/cs61a-c9a2994e2b583bcb527854d9.png>)
*⏱ 时间戳：00:16:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:16:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1009)*

> **错因剖析**：`reversed(s)` 返回的是一个**反向迭代器对象 (`list_reverseiterator`)**，而 `s` 是一个列表。列表与迭代器进行 `==` 比较，类型不同，恒为 `False`！

---

### 6.2 优雅解法一：物化反转列表
```python
def palindrome_list(s):
    return list(s) == list(reversed(s))
```

### 6.3 优雅解法二：利用 `zip` 与 `all` 惰性逐位对比
```python
def palindrome_zip(s):
    """
    >>> palindrome_zip([1, 2, 3, 2, 1])
    True
    >>> palindrome_zip("radar")
    True
    """
    return all(a == b for a, b in zip(s, reversed(s)))
```

![优雅解法二：利用 zip 与 all 惰性逐位对比 · 课堂板书演示 (00:17:49)](</attachments/cs61a-84c4dd2f4f9d3feb8526a514.png>)
*⏱ 时间戳：00:17:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:17:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1069)*

![优雅解法二：利用 zip 与 all 惰性逐位对比 · 课堂板书演示 (00:20:19)](</attachments/cs61a-660ecd76a477bfb13bed942f.png>)
*⏱ 时间戳：00:20:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:20:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1219)*

- `zip(s, reversed(s))` 将正序流与逆序流一一配对：$(s_0, s_{n-1}), (s_1, s_{n-2}), \dots$
- 只要发现第一对不相等，`all` 立即触发短路退出，无需把整条序列比完！

---

## 7. 为何拥抱迭代器？三大工程价值

![为何拥抱迭代器？三大工程价值 · 课堂板书演示 (00:21:46)](</attachments/cs61a-e8b5e411369c88f884387d04.png>)
*⏱ 时间戳：00:21:46 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:21:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1306)*

1. **表示无关性 (Representation Independence)**：上层函数只依赖 `for item in it` 或 `next(it)`，无论底层传入的是列表、文件句柄、网络套接字还是生成器，代码完全复用。
2. **状态与位置的统一封装 (Encapsulated Position)**：迭代器将“序列内容”与“当前游标位置”融为一体。即使在多个函数之间传递，游标也保持连贯，绝不重复消费。
3. **内存节省与无限流支持 (Memory Efficiency & Infinite Streams)**：支持处理数亿行数据或无限斐波那契流，内存占用恒为 $O(1)$！

---

## 8. 实战演练：21点纸牌游戏模拟器 (Casino Blackjack)

在 21 点赌局中，牌靴（Shoe）里的 52 张扑克牌发一张少一张。**迭代器天然就是最完美的“发牌荷官”**！

![实战演练：21点纸牌游戏模拟器 (Casino Blackjack) · 课堂板书演示 (00:23:56)](</attachments/cs61a-8b46e94fffb1f161079ef358.png>)
*⏱ 时间戳：00:23:56 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:23:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1436)*

### 8.1 洗牌与发牌器
```python
import random

def make_deck():
    """生成一副已洗好牌的迭代器。"""
    cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'] * 4
    random.shuffle(cards)
    return iter(cards)  # 返回迭代器！
```

![洗牌与发牌器 · 课堂板书演示 (00:26:04)](</attachments/cs61a-fb877f2aaeeb4002886965ec.png>)
*⏱ 时间戳：00:26:04 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:26:04)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1564)*

发牌时只需调用 `next(deck)`，无需手动维护列表下标或做 `.pop(0)`！
```python
deck = make_deck()
player_hand = [next(deck), next(deck)]
dealer_upcard = next(deck)
dealer_holecard = next(deck)
```

---

### 8.2 模拟 1000 局蒙特卡洛统计
运行 1000 次模拟，统计庄家优势：

![模拟 1000 局蒙特卡洛统计 · 课堂板书演示 (00:29:05)](</attachments/cs61a-d4112aeb82fe42087478364c.png>)
*⏱ 时间戳：00:29:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P16 00:29:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1745)*

由于玩家若爆牌（超过 21 点）会先于庄家判负，即便严格按照基本策略出牌，长期期望值庄家依然占据数学优势（长期总体输多赢少）。这就是赌场长盛不衰的概率学秘密。

---

## 9. 本讲核心要点与思考题

### 重点法则提炼
1. **迭代器是单向游标**：元素“取一少一”，耗尽即止。
2. **惰性求值提升吞吐**：`map`、`filter` 与生成器管道按需产出，兼顾低延迟与极低内存开销。
3. **警惕在遍历字典时改变其容量**：插入或删除键会导致迭代器失效抛出 `RuntimeError`。

---

### 课后自测练习

#### 练习 1：惰性斐波那契生成器
请写一个函数 `pairs(it)`，接收一个迭代器，返回相邻两个元素构成的二元组流：
```python
def pairs(it):
    """
    >>> list(pairs(iter([1, 2, 3, 4])))
    [(1, 2), (2, 3), (3, 4)]
    """
    # 提示：利用 itertools 或两次迭代
    prev = next(it)
    for curr in it:
        yield (prev, curr)
        prev = curr
```
迭代器的状态传递为连续流处理带来了非凡的解耦力！

---

