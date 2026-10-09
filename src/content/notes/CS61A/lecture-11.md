---
title: Lecture 11 · Sequences (序列、列表与列表推导式)
description: CS61A 第 11 讲：Sequences (序列、列表与列表推导式)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 11
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：22:15 ｜ **视频回链**：[B 站对应单集 (P11)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11)

## 1. 引言：复合数据与序列抽象

在前几讲中，我们操作的主要是基本标量数据（如整数、浮点数、布尔值）和函数对象。然而，现实世界的问题往往涉及成批、有序的数据聚集。

> **序列 (Sequence)**：一系列拥有明确先后顺序的元素的有序集合。  
> 序列具有两个最根本的行为特征：
> 1. **长度 (Length)**：序列中包含有限数量的元素（通过 `len(s)` 查询）。
> 2. **元素选取 (Element Selection)**：能够通过从 $0$ 开始的整数索引唯一定位元素（通过 `s[i]` 查询）。

在 Python 中，**列表 (`list`)** 是最普遍使用的内置通用序列类型。

---

## 2. 列表基础：构造、索引偏移与组合操作

### 2.1 列表字面量与索引偏移概念
列表通过方括号字面量 `[...]` 创建，元素间以逗号分隔：
```python
odds = [1, 3, 5, 7]
```

![列表字面量与索引偏移概念 · 课堂板书演示 (00:00:34)](</attachments/cs61a-c6826fa6e52ca2ae31040fe4.png>)
*⏱ 时间戳：00:00:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:00:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=34)*

DeNero 教授特别强调了对“索引”的心智模型建立：
- 索引并不是单纯的“编号”，而是**相对于序列起点的偏移量 (Offset from the beginning)**。
- 偏移量为 `0`：即正处于序列开头的第一个元素。
- 最后一个有效元素的索引恒为 `len(s) - 1`。

### 2.2 嵌套求值与运算符映射
列表不仅能包含字面值，方括号内部以及索引位置都可以放置任意合法的 Python 表达式：
```python
odds = [1, 3, 5, 7]
diff = odds[3] - odds[2]  # 7 - 5 = 2
val = odds[diff]          # odds[2] -> 5
```

![嵌套求值与运算符映射 · 课堂板书演示 (00:01:51)](</attachments/cs61a-8934723ceb93c85fea59ff70.png>)
*⏱ 时间戳：00:01:51 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:01:51)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=111)*

Python 还提供了 `operator` 模块中的等价函数调用：
- `s[i]` 严格等价于 `operator.getitem(s, i)`。

### 2.3 列表拼接与重复
列表支持通过加法和乘法运算符构建更长的新列表：
- **`+` (拼接 / Concatenation)**：将两个列表的元素首尾相接，产生一个全新列表。
- **`*` (重复 / Repetition)**：将列表内容复制指定的整数次。

```python
digits = [1, 8, 2, 8]
combined = [2, 7] + digits * 2
# 结果: [2, 7, 1, 8, 2, 8, 1, 8, 2, 8]
```

![结果: 「2, 7, 1, 8, 2, 8, 1, 8, 2, 8」 · 课堂板书演示 (00:02:24)](</attachments/cs61a-a6918f57f125e4778ce5eff1.png>)
*⏱ 时间戳：00:02:24 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:02:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=144)*

### 2.4 嵌套列表与多维索引
列表的元素可以是任意类型，包括列表本身：
```python
pairs = [[10, 20], [30, 40]]
```
`pairs[1]` 求值得到子列表 `[30, 40]`，随后对其进行第二层索引 `pairs[1][0]` 即可取得整数 `30`。

![嵌套列表与多维索引 · 课堂板书演示 (00:02:56)](</attachments/cs61a-b496834208288130a346badb.png>)
*⏱ 时间戳：00:02:56 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:02:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=176)*

---

## 3. 容器成员资格测试：`in` 与 `not in`

Python 提供了内置中缀运算符用于检查某个值是否存在于容器中：

```python
digits = [1, 8, 2, 8]
1 in digits      # True
8 in digits      # True (出现多次无妨，只要存在即可)
5 in digits      # False
5 not in digits  # True (等价于 not (5 in digits))
```

![容器成员资格测试：in 与 not in · 课堂板书演示 (00:04:27)](</attachments/cs61a-1bb9b1a235d9594202886cd2.png>)
*⏱ 时间戳：00:04:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:04:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=267)*

### 核心运作规则与避坑指南
1. **严格的相等性检查**：`'1' in digits` 为 `False`，因为字符串 `'1'` 不等于整数 `1`。
2. **单元素匹配而非子序列搜索**：`[1, 8] in digits` 为 `False`。`in` 不会在列表中寻找子序列切片，它只遍历顶层元素判断是否与目标完全相等。
3. **浅层搜索**：如果列表有多层嵌套，`in` 仅匹配顶层直属元素，不会自递归向下深搜。

![核心运作规则与避坑指南 · 课堂板书演示 (00:05:32)](</attachments/cs61a-f8f05655b290bb293407b64f.png>)
*⏱ 时间戳：00:05:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:05:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=332)*

---

## 4. 从 `while` 到 `for`：序列迭代语句与环境模型机制

### 4.1 动机：用 `while` 遍历序列的繁琐
假设我们需要编写一个函数 `count(s, value)`，统计值 `value` 在序列 `s` 中出现的频次：

```python
def count_while(s, value):
    total, index = 0, 0
    while index < len(s):
        element = s[index]
        if element == value:
            total += 1
        index += 1
    return total
```
在此实现中，维护下标变量 `index`、显式递增 `index += 1` 以及边界检查 `index < len(s)` 是纯粹的机器记账代码，与核心业务逻辑无关。

![动机：用 while 遍历序列的繁琐 · 课堂板书演示 (00:07:49)](</attachments/cs61a-d9d9dabe493044ca597cbdfa.png>)
*⏱ 时间戳：00:07:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:07:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=469)*

### 4.2 `for` 语句的诞生与语法结构
Python 提供了专门遍历序列的控制语句：
```python
def count(s, value):
    total = 0
    for element in s:
        if element == value:
            total += 1
    return total
```

### 4.3 `for` 语句在环境模型中的执行语义
当解释器执行如下代码时：
```python
for <name> in <expression>:
    <suite>
```
1. 首先求值头部表达式 `<expression>`，得到一个序列（或可迭代对象）。
2. 对于序列中的每一个元素：
   - 将 `<name>` **绑定到当前执行环境的当前帧 (Current Frame)** 中（**注意：`for` 语句不会引入任何新帧！**）。
   - 执行语句体 `<suite>`。
3. 循环结束后，循环变量 `<name>` 仍然保留在当前帧中，其值为序列中的最后一个元素。

![for 语句在环境模型中的执行语义 · 课堂板书演示 (00:09:56)](</attachments/cs61a-73ce73ecae22db38fc571511.png>)
*⏱ 时间戳：00:09:56 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:09:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=596)*

---

## 5. 序列解包 (Sequence Unpacking) 的模式匹配

如果序列中包含的是长度固定的子序列（例如二元元组或双元素列表构成的列表），我们可以在 `for` 循环头部直接进行**多变量解包**：

```python
pairs = [[1, 2], [2, 2], [3, 2], [4, 4]]
same_count = 0

for x, y in pairs:
    if x == y:
        same_count += 1
```

![序列解包 (Sequence Unpacking) 的模式匹配 · 课堂板书演示 (00:11:58)](</attachments/cs61a-a6275c9dc31fcb14f30ff67d.png>)
*⏱ 时间戳：00:11:58 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:11:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=718)*

在每一次迭代中，Python 会自动执行类似多重赋值的操作：`x, y = pair`，从而消除了 `pair[0]` 与 `pair[1]` 的样板代码。

---

## 6. 整数序列：`range` 的半开半闭区间哲学

在需要连续整数序列时，我们并不需要手动书写大量数字的列表，而是使用专用的序列类型——**`range`**。

### 6.1 左闭右开 $[start, end)$ 区间的设计美学
```python
r = range(-2, 2)
```
数学上，该区间严格包含左端点，但不包含右端点：$\{-2, -1, 0, 1\}$。

![左闭右开 $「start, end)$ 区间的设计美学 · 课堂板书演示 (00:13:33)](</attachments/cs61a-a9e37a38819e2b359dccb4e0.png>)
*⏱ 时间戳：00:13:33 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:13:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=813)*

为什么 Python 采用左闭右开设计？
1. **长度直观计算**：序列长度恒等于 `end - start`。例如 $2 - (-2) = 4$，内部恰有 4 个整数，无需 $+1$ 或 $-1$ 的偏移调整。
2. **无缝区间切分与拼接**：如果将区间分为两半，只需选定中点 $k$，则 `range(a, k)` 与 `range(k, b)` 紧密相接，绝不产生重叠元素或空隙。
3. **从 0 计数自然吻合**：当省略起点时，`range(n)` 默认从 $0$ 开始，包含 $0, 1, \dots, n-1$，其包含的数字恰好与长度为 $n$ 的列表的所有有效下标完全对应！

### 6.2 惰性与列表构造器 (`list(...)`)
`range` 对象本身并不是列表，它在内存中只记录 `start`, `stop`, `step` 规则，按需计算元素，极大节省空间。
若需要将其具象化为实际列表，可调用内置构造器 `list()`：
```python
list(range(5, 8))  # [5, 6, 7]
list(range(4))     # [0, 1, 2, 3]
```

![惰性与列表构造器 (list(...)) · 课堂板书演示 (00:15:32)](</attachments/cs61a-9edf51fa75cf4cd106d7a34f.png>)
*⏱ 时间戳：00:15:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:15:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=932)*

### 6.3 惯用占位符 `_`
当我们只希望重复执行某段操作固定次数，而根本不需要使用循环变量的值时，社区约定俗成使用下划线 `_` 作为变量名：
```python
for _ in range(3):
    print("Go Bears")
```
这向阅读代码的人明确传达了一个信号：**“该变量在循环体内不被关心”**。

![惯用占位符 _ · 课堂板书演示 (00:17:45)](</attachments/cs61a-be9566fd4563b5f6b0442647.png>)
*⏱ 时间戳：00:17:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1065)*

---

## 7. 表达式的升华：列表推导式 (List Comprehensions)

列表推导式是 Python 借鉴现代函数式语言（如 Haskell）而引入的一种强大组合形式，它对应数学中的**集合建构公理 (Set-Builder Notation)**：
$$\{f(x) \mid x \in S \land P(x)\}$$

### 7.1 映射语法 (Mapping)
```python
odds = [1, 3, 5, 7, 9]
evens = [x + 1 for x in odds]
# [2, 4, 6, 8, 10]
```
对 `odds` 中的每一个元素 `x`，均求值表达式 `x + 1`，将结果收集为一个新列表。

![「2, 4, 6, 8, 10」 · 课堂板书演示 (00:19:26)](</attachments/cs61a-1fdaa15067b5a7899b7945f5.png>)
*⏱ 时间戳：00:19:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:19:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1166)*

### 7.2 过滤语法 (Filtering)
在推导式末尾追加 `if <condition>`，可筛选满足特定条件的元素：
```python
# 仅保留能够整除 25 的数
[x for x in odds if 25 % x == 0]
# 结果: [1, 5]

# 组合映射与过滤：
[x + 1 for x in odds if 25 % x == 0]
# 结果: [2, 6]
```

![结果: 「2, 6」 · 课堂板书演示 (00:20:31)](</attachments/cs61a-2e310844c6baaf210438e76a.png>)
*⏱ 时间戳：00:20:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:20:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1231)*

---

## 8. 实战应用：寻找正整数的所有因数 (`divisors`)

利用 `range` 与列表推导式的强力组合，我们可以用一行代码优雅求解任何正整数的所有公因数：

```python
def divisors(n):
    """返回正整数 n 的所有因数组成的列表。
    
    >>> divisors(1)
    [1]
    >>> divisors(4)
    [1, 2]
    >>> divisors(8)
    [1, 2, 4]
    >>> divisors(18)
    [1, 2, 3, 6, 9]
    """
    return [1] + [x for x in range(2, n) if n % x == 0]
```

![实战应用：寻找正整数的所有因数 (divisors) · 课堂板书演示 (00:21:35)](</attachments/cs61a-8c96a864cedf81db8deeda13.png>)
*⏱ 时间戳：00:21:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P11 00:21:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1295)*

代码逻辑一目了然：
- `1` 始终是任何正整数的因数；
- 随后在候选区间 `range(2, n)` 内，利用推导式的 `if n % x == 0` 过滤出所有能整除 `n` 的数；
- 最终两部分通过 `+` 拼接成有序因数列表。

---

## 9. 本讲核心要点与思考题

### 重点法则提炼
1. **序列是行为抽象**：凡是支持 `len()` 获取长度以及 `s[i]` 获取元素的复合数据类型，皆可归入序列家族。
2. **`for` 循环不产生新作用域**：循环内部绑定的变量直接驻留在当前环境的局部帧中，循环退出后依然可访问。
3. **半开半闭区间是计算思维的精粹**：`range(a, b)` 包含 $b - a$ 个元素，杜绝了经典的“差一错误” (Off-by-one Error)。
4. **推导式优先于循环追加**：在构建新列表时，推导式 `[f(x) for x in s if cond]` 不仅语法清晰，底层执行速度也显著优于显式循环与 `.append()`。

---

### 课后自测练习

#### 练习 1：完美数 (Perfect Numbers)
在数学上，如果一个正整数等于其所有真因数（即除了自身以外的因数）之和，则称该数为**完美数**。例如 $6 = 1 + 2 + 3$。利用本课的 `divisors(n)`，编写一行推导式找出 1000 以内的所有完美数：
```python
perfect_numbers = [n for n in range(1, 1000) if sum(divisors(n)) == n]
# 答案: [6, 28, 496]
```

#### 练习 2：最小硬币组合
假设你有面值为 `[1, 5, 10, 25]` 美分的硬币。如何用列表推导式找出所有可以用两枚硬币凑出且面值大于 15 的组合金额？
```python
coins = [1, 5, 10, 25]
combinations = [c1 + c2 for c1 in coins for c2 in coins if c1 + c2 > 15]
# 去重后结果: [20, 26, 30, 35, 50]
```
嵌套的推导式展现出笛卡尔积组合的惊人威力！

---

