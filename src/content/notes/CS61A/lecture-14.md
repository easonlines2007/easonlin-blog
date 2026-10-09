---
title: Lecture 14 · Trees (树形数据抽象与树遍历递归)
description: CS61A 第 14 讲：Trees (树形数据抽象与树遍历递归)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 14
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：34:32 ｜ **视频回链**：[B 站对应单集 (P14)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14)

## 1. 引言：层级世界建模与树的两种隐喻

在计算机科学中，树结构无处不在（文件目录树、语法解析 AST、组织结构图、决策树）。DeNero 教授指出，计算机科学中的树是**倒着生长的（根在顶部，叶子在下方）**。

理解树，有两个互为表里的描述隐喻：

### 1.1 植物学递归隐喻 (The Recursive Metaphor)
> 一棵树由一个**根标签 (Root Label)** 和一组**分支列表 (List of Branches)** 构成。  
> 关键推论：**树的每一个分支，本身又是一棵完整的树！**

![植物学递归隐喻 (The Recursive Metaphor) · 课堂板书演示 (00:03:13)](</attachments/cs61a-0cf2cbddc72016fb7e0a6680.png>)
*⏱ 时间戳：00:03:13 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:03:13)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=193)*

- **叶子节点 (Leaf)**：没有分支（分支列表为空）的树称为叶子节点。

### 1.2 家族亲缘相对隐喻 (The Relative / Family Tree Metaphor)
树中的每一个数据存放位置称为**节点 (Node)**。
- 节点保存具体的数据（称为节点的 **Label**）。
- 节点之间存在亲缘层级关系：**父节点 (Parent)**、**子节点 (Children)**、**兄弟节点 (Siblings)**、**祖先 (Ancestors)**、**后代 (Descendants)**。
- 一个节点所在的层级称为其**深度 (Depth)**。

![家族亲缘相对隐喻 (The Relative / Family Tree Metaphor) · 课堂板书演示 (00:04:16)](</attachments/cs61a-c1dfc301fb50eec7d42234a7.png>)
*⏱ 时间戳：00:04:16 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:04:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=256)*

---

## 2. 树的数据抽象 (The Tree Data Abstraction)

遵守 CS61A 一贯的数据抽象哲学，我们首先定义树的公共接口：

![树的数据抽象 (The Tree Data Abstraction) · 课堂板书演示 (00:05:21)](</attachments/cs61a-f87f424ed7261631f1d9e931.png>)
*⏱ 时间戳：00:05:21 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:05:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=321)*

### 2.1 构造器与选择器规格说明
- `tree(label, branches=[])`：构造一棵根节点为 `label`、子树列表为 `branches` 的树。默认 `branches` 为空，此时构造一个叶子节点。
- `label(t)`：选择器，返回树 `t` 的根标签。
- `branches(t)`：选择器，返回树 `t` 的分支列表（其元素每一项皆是一棵树）。
- `is_leaf(t)`：判断谓词，当且仅当 `branches(t)` 为空时返回 `True`。

### 2.2 具体实现与严格防错校验
```python
def tree(label, branches=[]):
    """树构造器：确保所有分支皆为合法树。"""
    for branch in branches:
        assert is_tree(branch), "branches must be trees"
    return [label] + list(branches)

def label(tree):
    """选择器：返回根节点标签。"""
    return tree[0]

def branches(tree):
    """选择器：返回所有分支构成的列表。"""
    return tree[1:]

def is_leaf(tree):
    """谓词：检查是否为叶子节点。"""
    return not branches(tree)

def is_tree(tree):
    """谓词：递归检查是否为良构树。"""
    if type(tree) != list or len(tree) < 1:
        return False
    for branch in branches(tree):
        if not is_tree(branch):
            return False
    return True
```

![具体实现与严格防错校验 · 课堂板书演示 (00:06:51)](</attachments/cs61a-aebf5ef87cd157f2d635e700.png>)
*⏱ 时间戳：00:06:51 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:06:51)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=411)*

![具体实现与严格防错校验 · 课堂板书演示 (00:08:18)](</attachments/cs61a-de7be30617444c5578fa2f83.png>)
*⏱ 时间戳：00:08:18 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:08:18)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=498)*

> **抽象屏障问答**：
> “使用 `for b in branches(t):` 遍历分支，是否违反了抽象屏障？”  
> **答案是否定的！** 因为树抽象在公开规约中就明确保证了：`branches(t)` 返回的是一个由子树组成的**序列列表 (List of Branches)**。利用列表操作遍历分支完全符合该抽象的合约！

![具体实现与严格防错校验 · 课堂板书演示 (00:10:14)](</attachments/cs61a-c2092934f0b8b21c53c019f3.png>)
*⏱ 时间戳：00:10:14 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:10:14)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=614)*

---

## 3. 程序化树构造：斐波那契树 (`fib_tree`)

在实际工程中，树往往不是手工硬编码嵌套构造的，而是由算法**程序化递归生成**。以斐波那契树为例：

![程序化树构造：斐波那契树 (fib_tree) · 课堂板书演示 (00:11:52)](</attachments/cs61a-6ddf3b0e2b13d90c642be316.png>)
*⏱ 时间戳：00:11:52 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:11:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=712)*

```python
def fib_tree(n):
    """递归构造对应 Fibonacci(n) 计算过程的形态树。"""
    if n <= 1:
        return tree(n)
    else:
        left, right = fib_tree(n - 2), fib_tree(n - 1)
        return tree(label(left) + label(right), [left, right])
```
- 基线分支：当 $n \le 1$ 时，直接返回单节点叶子 `tree(n)`。
- 递归分支：递归生成左子树与右子树，将两子树的根标签之和作为当前树的根标签。

---

## 4. 树处理函数的标准递归范式：统计与展开

所有操作树的递归函数，都遵循高度统一的结构骨架：
```python
def process_tree(t):
    if is_leaf(t):
        return base_result(t)
    return aggregate([process_tree(b) for b in branches(t)])
```

### 4.1 计算叶子节点总数 (`count_leaves`)
```python
def count_leaves(t):
    """统计树 t 中所有叶子节点的数量。"""
    if is_leaf(t):
        return 1
    return sum([count_leaves(b) for b in branches(t)])
```

![计算叶子节点总数 (count_leaves) · 课堂板书演示 (00:13:25)](</attachments/cs61a-bdb8559c3cdeca943f53dd0b.png>)
*⏱ 时间戳：00:13:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:13:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=805)*

- **基线条件**：若当前节点就是叶子，其自身就是一个叶子节点，返回 `1`。
- **递归聚合**：遍历每一个分支，递归求出其叶子数，用内置函数 `sum` 累加！

---

### 4.2 收集所有叶子标签：列表展平技巧 (`leaves`)
如果我们希望返回树中所有叶子节点的标签组成的扁平列表：
```
fib_tree(4) 的叶子为: [0, 1, 1, 0, 1]
```

![收集所有叶子标签：列表展平技巧 (leaves) · 课堂板书演示 (00:15:23)](</attachments/cs61a-93bc24797dd8a95bf7c79303.png>)
*⏱ 时间戳：00:15:23 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:15:23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=923)*

回忆上一讲的黑魔法：`sum([[1, 2], [3]], []) -> [1, 2, 3]`。利用列表拼接作为折叠基底，我们可以极为优雅地实现展平：

```python
def leaves(t):
    """返回树 t 的所有叶子标签构成的单层列表。"""
    if is_leaf(t):
        return [label(t)]
    return sum([leaves(b) for b in branches(t)], [])
```

![收集所有叶子标签：列表展平技巧 (leaves) · 课堂板书演示 (00:16:49)](</attachments/cs61a-eba04e8a71eead659c43dd65.png>)
*⏱ 时间戳：00:16:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:16:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1009)*

- 若为叶子：返回包含自身单元素的列表 `[label(t)]`。
- 若非叶子：对每个子树递归调用 `leaves(b)` 得到子列表，通过 `sum(..., [])` 将所有子列表缝合成一个扁平大列表！

---

## 5. 树的结构变换与紧凑表达：`increment_tree`

假设我们希望将树中每一个节点的标签值都加 1，生成一棵全新树：

```python
def increment_tree(t):
    """返回一棵与 t 结构完全相同、所有节点标签增加 1 的新树。"""
    return tree(label(t) + 1, [increment_tree(b) for b in branches(t)])
```

![树的结构变换与紧凑表达：increment_tree · 课堂板书演示 (00:18:47)](</attachments/cs61a-5468a22f8a2def712da0e34b.png>)
*⏱ 时间戳：00:18:47 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:18:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1127)*

> **极简一行流背后的精妙机制**：
> 为什么该实现中没有任何 `if is_leaf(t)` 分支判断？
> - 当遇到叶子节点时，`branches(t)` 为空列表 `[]`。
> - 列表推导式 `[increment_tree(b) for b in []]` 自然求值为空列表 `[]`，无需递归。
> - 直接生成 `tree(label(t) + 1, [])` 并返回！
> - 列表推导式的内建空集短路特性，天然充当了基线条件的守卫！

---

## 6. 树形结构可视化：缩进打印 (`print_tree`)

嵌套列表形式打印出的树（如 `[3, [1], [2, [1], [1]]]`）难以被人眼快速识别。通过递归传递缩进深度参数，我们可以打印出直观的层级缩进文本树：

```python
def print_tree(t, indent=0):
    """以缩进文本形式直观打印树形结构。"""
    print('  ' * indent + str(label(t)))
    for b in branches(t):
        print_tree(b, indent + 1)
```

![树形结构可视化：缩进打印 (print_tree) · 课堂板书演示 (00:20:52)](</attachments/cs61a-190b258c5121df8581ba5098.png>)
*⏱ 时间戳：00:20:52 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:20:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1252)*

输出效果：
```
3
  1
  2
    1
    1
```
每一层节点的缩进空格数正比于其在树中的深度 `indent`，层次分明，赏心悦目。

---

## 7. 递归思维的两种流派：返回值聚合 vs. 状态参数下传

处理树结构时，有两种根本性的思考模型：

![递归思维的两种流派：返回值聚合 vs. 状态参数下传 · 课堂板书演示 (00:22:49)](</attachments/cs61a-0ac28ff33830942bcbf72dc7.png>)
*⏱ 时间戳：00:22:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:22:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1369)*

```mermaid
graph TD
    subgraph 流派 A: 返回值自底向上聚合 (Bottom-Up)
        A1["从叶子返回结果"] --> A2["父节点汇聚所有分支的返回值"]
        A2 --> A3["组装总结果并向上一层返回"]
    end

    subgraph 流派 B: 状态自顶向下传递 (Top-Down / Accumulator)
        B1["根节点向下传递当前累积状态"] --> B2["子节点叠加自身数据更新状态"]
        B2 --> B3["到达叶子或目标节点时触发结算"]
    end
```

### 实例：打印从根到叶的所有路径和 (`print_sums`)
打印所有从根节点到各个叶子节点的完整路径上各节点数值之和：
```python
def print_sums(t, so_far=0):
    """自顶向下下传前缀路径和。"""
    so_far = so_far + label(t)
    if is_leaf(t):
        print(so_far)
    else:
        for b in branches(t):
            print_sums(b, so_far)
```

![实例：打印从根到叶的所有路径和 (print_sums) · 课堂板书演示 (00:26:47)](</attachments/cs61a-a22ab5e11611b6542206b055.png>)
*⏱ 时间戳：00:26:47 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:26:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1607)*

- 状态变量 `so_far` 作为参数随着递归调用向深层传递。
- 当命中 `is_leaf(t)` 时，`so_far` 恰好记录了整条根到叶路径的总和，立即打印。

---

## 8. 压轴难题：任意节点路径和统计 (`count_paths`)

### 8.1 问题定义
> **目标**：给定一棵树 `t` 与一个目标整数 `total`，统计从**根节点出发，延伸至树中任意节点**（不一定要到叶子节点）的所有路径中，节点标签之和恰好等于 `total` 的路径总数。

![问题定义 · 课堂板书演示 (00:29:46)](</attachments/cs61a-6b1095ab56ee2cbdf4d90ad9.png>)
*⏱ 时间戳：00:29:46 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:29:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=1786)*

**重要特性探究**：
- 节点标签可能包含负数或零！
- 因此，**即便在某个节点已经凑齐了目标和，也绝不能停止向其分支继续搜索**！因为后续完全可能出现 `+1, -1` 从而构成更深层的合法路径。

---

### 8.2 解题策略与两路分解
对于以当前节点为起点的搜索，合法路径只有两种可能：
1. **路径恰好在当前根节点终止**：如果 `label(t) == total`，则本节点自成一条合法路径，计数 $+1$；否则为 $0$。
2. **路径继续延伸进入某个分支**：对于每个分支 $b$，要在其中寻找以 $b$ 为起点且节点和等于 `total - label(t)` 的子路径。

![解题策略与两路分解 · 课堂板书演示 (00:33:31)](</attachments/cs61a-2b6796178d391656d8f0775c.png>)
*⏱ 时间戳：00:33:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P14 00:33:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=14&t=2011)*

### 8.3 优雅的递归实现
```python
def count_paths(t, total):
    """计算以 t 为根节点、路径和等于 total 的路径总数。
    
    >>> t = tree(3, [tree(-1), tree(1, [tree(2, [tree(1)]), tree(3)])])
    >>> count_paths(t, 3)  # [3] 与 [3, -1]
    2
    >>> count_paths(t, 7)  # [3, 1, 2, 1] 与 [3, 1, 3]
    2
    """
    found = 1 if label(t) == total else 0
    branch_paths = sum([count_paths(b, total - label(t)) for b in branches(t)])
    return found + branch_paths
```
- 代码无需复杂的 `if-else` 分支阻断，两条路径计数平行累加，数学逻辑严丝合缝！

---

## 9. 本讲核心要点与思考题

### 重点法则提炼
1. **树是递归自相似结构**：树的每个分支本身也是树；处理树的算法天然是树形递归。
2. **遵守树抽象屏障**：只使用 `label(t)`、`branches(t)`、`is_leaf(t)`，严禁用底层索引 `t[0]`、`t[1:]` 破坏封装。
3. **两类路径搜索模式**：自底向上的结果归并（如 `count_leaves`） vs. 自顶向下的状态下传（如 `count_paths` 中的 `total - label(t)`）。

---

### 课后自测练习

#### 练习 1：求树的最大深度 (Height/Depth)
定义单个叶子节点的树高度为 0。编写函数 `height(t)` 计算一棵树的最大高度：
```python
def height(t):
    """
    >>> height(tree(1))
    0
    >>> height(tree(1, [tree(2), tree(3, [tree(4)])]))
    2
    """
    if is_leaf(t):
        return 0
    return 1 + max([height(b) for b in branches(t)])
```

#### 练习 2：树的最大节点查找
编写函数 `max_label(t)` 找出树中所有节点的最大标签：
```python
def max_label(t):
    """
    >>> max_label(tree(5, [tree(12), tree(3, [tree(7)])]))
    12
    """
    return max([label(t)] + [max_label(b) for b in branches(t)])
```
利用列表拼接与 `max` 聚合，树遍历在 Python 中简洁到了极致！

---

