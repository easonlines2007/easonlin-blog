---
title: Lecture 17 · Generators (生成器、yield 机制与递归流生成)
description: CS61A 第 17 讲：Generators (生成器、yield 机制与递归流生成)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 17
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：17:13 ｜ **视频回链**：[B 站对应单集 (P17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17)

## 1. 引言：从普通函数到生成器函数

在 Python 中，绝大多数函数遵循“单次执行、单次返回”的生命周期：从首行开始执行，一旦遇到 `return` 语句，函数帧立即销毁，控制权与返回值交还调用方。

> **生成器函数 (Generator Function)**：函数体中包含 **`yield`** 关键字的特殊函数。  
> 调用生成器函数**不会立即执行函数体**，而是返回一个**生成器对象 (Generator Object)**。该生成器本身就是一个迭代器。

![引言：从普通函数到生成器函数 · 课堂板书演示 (00:00:31)](</attachments/cs61a-a352b723eba18363326481b5.png>)
*⏱ 时间戳：00:00:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:00:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=31)*

```python
def plus_minus(x):
    yield x
    yield -x

t = plus_minus(3)  # t 是一个生成器对象！
next(t)            # 3
next(t)            # -3
next(t)            # 抛出 StopIteration 异常
```

![引言：从普通函数到生成器函数 · 课堂板书演示 (00:01:31)](</attachments/cs61a-8c3861deafd80c58f75aa39e.png>)
*⏱ 时间戳：00:01:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:01:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=91)*

---

## 2. `yield` 的底层心智模型：冻结、挂起与恢复

以连续偶数生成器 `evens(start, end)` 为例观察其内部运作轨迹：

```python
def evens(start, end):
    even = start + (0 if start % 2 == 0 else 1)
    while even < end:
        yield even
        even += 2
```

![yield 的底层心智模型：冻结、挂起与恢复 · 课堂板书演示 (00:02:30)](</attachments/cs61a-c116f7c10d80f7a908b29a4d.png>)
*⏱ 时间戳：00:02:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:02:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=150)*

### 执行流程详解
1. **创建生成器**：`t = evens(2, 10)`。此时解释器只打包了函数引用与参数，**函数体第 1 行尚未执行**！
2. **首次激活 (`next(t)`)**：进入函数体，计算 `even = 2`。进入 `while` 循环，执行 `yield 2`。
   - **向调用方产出值 `2`**。
   - **挂起冻结 (Freeze & Pause)**：解释器完整保留当前函数帧的环境状态（局部变量 `even=2`、指令指针 PC、循环栈）。
3. **再次激活 (`next(t)`)**：直接在上次被挂起的 `yield` 语句之后**恢复执行**！
   - 执行 `even += 2`（变为 4）。
   - 重新进入 `while` 头部判断，命中下一次 `yield 4`，再次冻结！
4. **自然终止**：当 `even < end` 不再成立退出循环时，函数自然抵达尾部，自动引发 `StopIteration`。

![执行流程详解 · 课堂板书演示 (00:03:32)](</attachments/cs61a-3b93411147567339e3ce1d63.png>)
*⏱ 时间戳：00:03:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:03:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=212)*

```
调用方 (Caller)                   生成器函数 (Generator Frame)
────────────────                 ───────────────────────────
t = evens(2, 10) ──────────────► (创建生成器对象，代码未执行)
next(t)          ──────────────► 执行至 yield 2 (产出 2 并挂起)
                                 [保存: even=2, 循环现场]
next(t)          ──────────────► 从 yield 处恢复 -> even+=2 -> yield 4
                                 [保存: even=4, 循环现场]
next(t)          ──────────────► ...
```

---

## 3. 委托生成语法：`yield from` 的极简哲学

在 Python 3.3 之前，若要在生成器内部逐一产出另一个迭代器的内容，必须书写样板循环：
```python
for x in a:
    yield x
```
为了消除无意义的循环变量，Python 引入了 **`yield from`** 语法：

![委托生成语法：yield from 的极简哲学 · 课堂板书演示 (00:04:31)](</attachments/cs61a-d8a75eb7a748d61b1e97de9c.png>)
*⏱ 时间戳：00:04:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:04:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=271)*

```python
def a_then_b(a, b):
    yield from a
    yield from b
```

![委托生成语法：yield from 的极简哲学 · 课堂板书演示 (00:05:33)](</attachments/cs61a-0780e4acaa0f329198d8efcf.png>)
*⏱ 时间戳：00:05:33 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:05:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=333)*

`yield from <iterable>` 将生成控制权完全**代理 (Delegate)** 给子迭代器，直到子迭代器耗尽后，再继续执行后续语句。

---

## 4. 递归生成器实战：倒计时、字符串前缀与子串

`yield from` 与递归结合时，能够诞生出表现力惊人的流处理代码。

### 4.1 倒计时生成器 (`countdown`)
```python
def countdown(k):
    if k > 0:
        yield k
        yield from countdown(k - 1)
    else:
        yield "Blastoff!"
```

![倒计时生成器 (countdown) · 课堂板书演示 (00:06:36)](</attachments/cs61a-ffe11c80abfcb243bb982337.png>)
*⏱ 时间戳：00:06:36 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:06:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=396)*

- 先产出当前数字 `k`；
- 再通过 `yield from countdown(k - 1)` 委托子倒计时流产出剩余数字！

---

### 4.2 字符串前缀与所有子串生成 (`prefixes` & `substrings`)
如何惰性生成字符串的所有前缀？例如 `"both"` 的前缀序列为 `["b", "bo", "bot", "both"]`：

```python
def prefixes(s):
    if s:
        yield from prefixes(s[:-1])
        yield s
```

![字符串前缀与所有子串生成 (prefixes & substrings) · 课堂板书演示 (00:07:42)](</attachments/cs61a-a5a8fa5ca3119ce609799095.png>)
*⏱ 时间戳：00:07:42 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:07:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=462)*

在 `prefixes` 的基础上，生成字符串的所有连续子串 (`substrings`)：
```python
def substrings(s):
    if s:
        yield from prefixes(s)
        yield from substrings(s[1:])
```

![字符串前缀与所有子串生成 (prefixes & substrings) · 课堂板书演示 (00:08:15)](</attachments/cs61a-4c52d7cc346157c6175d70a0.png>)
*⏱ 时间戳：00:08:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=495)*

调用 `list(substrings("tops"))` 立即得到 `["t", "to", "top", "tops", "o", "op", "ops", "p", "ps", "s"]`，树形分治与生成流完美合一！

---

## 5. 重温整数拆分：从计数到全解罗列

在 Lecture 10 中，我们通过两路递归成功计算了拆分总数 `count_partitions(n, m)`。现在我们将问题升级：**不仅要算出方案总数，还要将每一种拆分方案以公式字符串形式真实罗列出来**！

例如 $n=6, m=4$ 时，输出：
`"2 + 4"`, `"1 + 1 + 4"`, `"3 + 3"`, `"1 + 2 + 3"`, $\dots$

![重温整数拆分：从计数到全解罗列 · 课堂板书演示 (00:09:42)](</attachments/cs61a-c03201455bae2f2e01843c33.png>)
*⏱ 时间戳：00:09:42 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:09:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=582)*

---

## 6. 传统列表累积法 vs. 优雅生成器法的正面对决

### 6.1 传统列表累积法（繁重易错）
如果使用列表作为返回值，我们需要层层构建子列表、列表推导式、外加 `sum(..., [])` 拼接：

![传统列表累积法（繁重易错） · 课堂板书演示 (00:11:45)](</attachments/cs61a-656fc833ba8856027a051609.png>)
*⏱ 时间戳：00:11:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=705)*

![传统列表累积法（繁重易错） · 课堂板书演示 (00:12:47)](</attachments/cs61a-cc82a3e9f9ad52ec274992b7.png>)
*⏱ 时间戳：00:12:47 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:12:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=767)*

```python
# 传统列表实现 (代码繁复、内存冗余)
def list_partitions(n, m):
    if n < 0 or m == 0:
        return []
    result = []
    if n == m:
        result.append(str(m))
    with_m = [p + " + " + str(m) for p in list_partitions(n - m, m)]
    without_m = list_partitions(n, m - 1)
    return result + with_m + without_m
```

---

### 6.2 优雅生成器法（极简心流）
转换到生成器思维后，**程序员只需关注“在当前条件下产出哪一个元素”，彻底免除列表维护与合并的烦恼**：

![优雅生成器法（极简心流） · 课堂板书演示 (00:13:53)](</attachments/cs61a-bf1f01a84820f96c6f015ec2.png>)
*⏱ 时间戳：00:13:53 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:13:53)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=833)*

```python
def partitions(n, m):
    """惰性生成正整数 n 使用不超过 m 的部分拆分的所有方案字符串。
    
    >>> for p in partitions(6, 4):
    ...     print(p)
    2 + 4
    1 + 1 + 4
    3 + 3
    1 + 2 + 3
    1 + 1 + 1 + 3
    2 + 2 + 2
    1 + 1 + 2 + 2
    1 + 1 + 1 + 1 + 2
    1 + 1 + 1 + 1 + 1 + 1
    """
    if n > 0 and m > 0:
        if n == m:
            yield str(m)  # 方案 1：正好独立凑齐
        for p in partitions(n - m, m):
            yield p + ' + ' + str(m)  # 方案 2：使用至少一个 m
        yield from partitions(n, m - 1) # 方案 3：完全不使用 m
```

![优雅生成器法（极简心流） · 课堂板书演示 (00:14:55)](</attachments/cs61a-27a8246a7ac0101e473a120f.png>)
*⏱ 时间戳：00:14:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:14:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=895)*

---

## 7. 百万级解空间的极速响应：惰性求值的降维打击

当输入规模扩大至 $n=60, m=50$ 时，拆分方案总数高达 **966,467 种（近百万种组合）**！

![百万级解空间的极速响应：惰性求值的降维打击 · 课堂板书演示 (00:15:52)](</attachments/cs61a-7e3871ff2302e88ac9027243.png>)
*⏱ 时间戳：00:15:52 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:15:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=952)*

- **传统列表法**：必须把近百万个字符串全部生成并存入巨大的 Python 列表中。整个程序陷入漫长的卡顿，消耗数以百兆的内存。
- **生成器法**：由于采用**惰性按需求值**，如果上层只需要前 10 个示例方案：
```python
p = partitions(60, 50)
for _ in range(10):
    print(next(p))
```

![百万级解空间的极速响应：惰性求值的降维打击 · 课堂板书演示 (00:16:34)](</attachments/cs61a-5c2ce87c9dffa41a5f460f32.png>)
*⏱ 时间戳：00:16:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P17 00:16:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=994)*

**响应耗时为 0.001 秒**！只要算出前 10 个解，生成器就会立即挂起，剩下的 966,457 种可能**根本不会发生计算**！这就是生成器带给海量搜索算法的质的飞跃。

---

## 8. 本讲核心要点与思考题

### 重点法则提炼
1. **生成器是迭代器的语法糖**：包含 `yield` 的函数自动生成状态机，单次调用即冻结。
2. **`yield from` 消除样板循环**：在树遍历与递归分解中，`yield from` 是代理子生成器的终极利器。
3. **海量搜索首选生成器**：当解空间极其庞大且使用者往往只需部分解时，生成器提供了常数级启动延迟与极小内存占用。

---

### 课后自测练习

#### 练习 1：生成无限质数序列 (Infinite Primes)
编写一个生成器 `primes()`，源源不断地生成自然数中的所有质数（2, 3, 5, 7, 11, ...）：
```python
def primes():
    """
    >>> p = primes()
    >>> [next(p) for _ in range(5)]
    [2, 3, 5, 7, 11]
    """
    def is_prime(x):
        return all(x % d != 0 for d in range(2, int(x**0.5) + 1))
    n = 2
    while True:
        if is_prime(n):
            yield n
        n += 1
```

#### 练习 2：二叉树中序遍历生成器
假设树节点 `t` 拥有 `left` 与 `right` 子树。如何用 `yield from` 简洁表达中序遍历？
```python
def inorder(t):
    if t is not None:
        yield from inorder(t.left)
        yield t.label
        yield from inorder(t.right)
```
生成器让复杂的数据结构遍历彻底告别了复杂的辅助栈维护！

---

