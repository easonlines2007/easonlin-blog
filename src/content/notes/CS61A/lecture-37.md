---
title: Lecture 37 · 课程总结与综合实战演练 (Final Examples & Conclusion)
description: CS61A 第 37 讲：课程总结与综合实战演练 (Final Examples & Conclusion)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 37
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：38:48 ｜ **视频回链**：[B 站对应单集 (P37)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37)

## 1. 树形抽象的通用性与递归灵魂 (The Universality of Trees)

树形数据结构在计算机科学中无所不在：
- Python 面向对象实现的 `Tree` 类（`label` 属性、`branches` 列表、`is_leaf()` 方法）；
- 嵌套列表与 JSON 数据树；
- 编程语言的抽象语法树（AST）；
- 自然语言句法解析树；
- 现代万维网的基础——HTML DOM 网页节点树。

![树形抽象的通用性与递归灵魂 (The Universality of Trees) · 课堂板书演示 (00:00:29)](</attachments/cs61a-b33714ebde3d79a66073b730.png>)
*⏱ 时间戳：00:00:29 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:00:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=29)*

![树形抽象的通用性与递归灵魂 (The Universality of Trees) · 课堂板书演示 (00:01:29)](</attachments/cs61a-803e4437e03885849ba7b499.png>)
*⏱ 时间戳：00:01:29 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:01:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=89)*

**学习递归最核心、最不可替代的使命，就是自如操纵具有分形特性的树形分层数据！**

---

## 2. 解题思维模型：从迷茫到渐进求解 (The Problem-Solving Process)

面对任何复杂编程问题，绝不能在毫无头绪时立即动手堆砌代码。科学的解题流程包括：
1. **彻底读懂题意**：明确输入域（Domain）与输出域（Range）；
2. **绘制具体示例图**：将抽象的文字描述具象化为结构图；
3. **识别边界与不变量**；
4. **寻找核心抓手（Hook）**。

![解题思维模型：从迷茫到渐进求解 (The Problem-Solving Process) · 课堂板书演示 (00:03:43)](</attachments/cs61a-befde37928a96f755672f976.png>)
*⏱ 时间戳：00:03:43 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:03:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=223)*

---

## 3. 经典挑战 1：祖先比较节点计数 (`bigs`)

> **题目规范**：实现函数 `bigs(t)`，接收整数标签的树 `t`，返回树中**标签严格大于其所有祖先节点标签**的节点总数。

![经典挑战 1：祖先比较节点计数 (bigs) · 课堂板书演示 (00:05:06)](</attachments/cs61a-2eb1d877d087e5556b6f74b9.png>)
*⏱ 时间戳：00:05:06 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:05:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=306)*

![经典挑战 1：祖先比较节点计数 (bigs) · 课堂板书演示 (00:06:28)](</attachments/cs61a-d98445ee84564343bed51254.png>)
*⏱ 时间戳：00:06:28 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:06:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=388)*

### 实例分析与关键不变量发现
在示例树中：
- 根节点 `1`：由于它没有任何祖先，**根节点永远平凡地大于所有祖先**，必须计数！
- 节点 `4`（1 的子节点）：$4 > 1$，计数；
- 节点 `4`（4 的子节点）：不大于祖先 `4`，不计；
- 节点 `5`（4 的子节点）：$5 > 4$ 且 $5 > 1$，计数；
- 节点 `2`（0 的子节点）：$2 > 0$ 但 $2 < 3$（3 是其上层祖先），因此不计！

**关键障碍**：常规树递归模板（`sum(bigs(b) for b in t.branches)`）在抵达叶子节点时，叶子节点**无法知晓沿途祖先的历史最大值**！

![实例分析与关键不变量发现 · 课堂板书演示 (00:08:25)](</attachments/cs61a-3e0e114d1178ba0b07633d60.png>)
*⏱ 时间戳：00:08:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:08:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=505)*

---

## 4. 模式突破：辅助函数与上下文状态传递 (`bigs` 函数式解法)

必须定义双参数辅助函数 `f(a, x)`：
- `a`：当前正在考察的子树节点；
- `x`：从根路径到达当前节点之前，所见过的**最大祖先标签值（Max Ancestor Seen So Far）**。

![模式突破：辅助函数与上下文状态传递 (bigs 函数式解法) · 课堂板书演示 (00:10:20)](</attachments/cs61a-71efd371991743d2be7f67ce.png>)
*⏱ 时间戳：00:10:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=620)*

```python
def bigs(t):
    """返回标签大于所有祖先标签的节点数。"""
    def f(a, x):
        n = 1 if a.label > x else 0
        m = max(x, a.label)
        return n + sum([f(b, m) for b in a.branches])
    return f(t, t.label - 1)
```

![模式突破：辅助函数与上下文状态传递 (bigs 函数式解法) · 课堂板书演示 (00:12:38)](</attachments/cs61a-d3e806a2c08f7a82fc8d7ff1.png>)
*⏱ 时间戳：00:12:38 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:12:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=758)*

- 当根节点发起调用时，传入 `t.label - 1`，保证根节点必然判定为 True；
- 向下递归每个分支 `b` 时，传递更新后的最大祖先 `max(x, a.label)`；
- 最终通过分支求和将计数结果层层上报返回。

![模式突破：辅助函数与上下文状态传递 (bigs 函数式解法) · 课堂板书演示 (00:16:16)](</attachments/cs61a-2ea279a1c04eaae71a717e9e.png>)
*⏱ 时间戳：00:16:16 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:16:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=976)*

---

## 5. 解法变体：可变累加器状态更新模式 (Mutable Accumulator Pattern)

除了纯函数式返回值累加外，另一种高频模式是在外层闭包维护一个单元素列表 `n = [0]` 作为可变计数器：

![解法变体：可变累加器状态更新模式 (Mutable Accumulator Pattern) · 课堂板书演示 (00:19:12)](</attachments/cs61a-f3eb3b5adb15a1c89a84a0f6.png>)
*⏱ 时间戳：00:19:12 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:19:12)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1152)*

![解法变体：可变累加器状态更新模式 (Mutable Accumulator Pattern) · 课堂板书演示 (00:22:25)](</attachments/cs61a-b79d462e3dc7a3164a2473ed.png>)
*⏱ 时间戳：00:22:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:22:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1345)*

```python
def bigs_iter(t):
    n = [0]
    def f(a, x):
        if a.label > x:
            n[0] += 1
        m = max(x, a.label)
        for b in a.branches:
            f(b, m)
    f(t, t.label - 1)
    return n[0]
```

通过原地修改 `n[0]`，避免了 `sum()` 列表推导的中间开销。理解这两种模式的互通等价性是掌握树遍历的关键。

---

## 6. 《如何设计程序》(HtDP) 六步设计心法

John DeNero 教授隆重推荐了经典名著《How to Design Programs》中的函数设计六步法：

![《如何设计程序》(HtDP) 六步设计心法 · 课堂板书演示 (00:25:22)](</attachments/cs61a-c60f7ea237a3e2c550e218c6.png>)
*⏱ 时间戳：00:25:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:25:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1522)*

![《如何设计程序》(HtDP) 六步设计心法 · 课堂板书演示 (00:27:19)](</attachments/cs61a-bad0bcfda2c0be7338c59e27.png>)
*⏱ 时间戳：00:27:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:27:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1639)*

| 步骤 | 阶段目标 | 实践指南 |
| :--- | :--- | :--- |
| **1. 数据定义** | 确定信息在程序中的表现形式 | 明确是用类、字典、树还是标量表示现实概念 |
| **2. 签名与注释** | 明确输入输出域与核心契约 | 编写类型签名（Signature）与一行核心 Docstring |
| **3. 功能用例** | 编写代码前先设计测试用例 | 构造典型输入与预期输出（Doctest） |
| **4. 骨架模板** | 提炼控制流主干 | 搭建 `if-else` 分支与预期的关键子调用 |
| **5. 编码实现** | 依据用例与契约填充代码空白 | 顺应数据结构形态写出对应逻辑 |
| **6. 测试验证** | 用用例进行严谨单步追踪与断言 | 发现隐藏的边界缺陷并保证代码可读性 |

---

## 7. 经典挑战 2：后代全量比较节点收集 (`smalls`)

> **题目规范**：实现函数 `smalls(t)`，接收整数标签的树 `t`，返回所有**标签严格小于其所有后代节点标签**的**非叶子节点（Non-leaf Nodes）**构成的列表。

![经典挑战 2：后代全量比较节点收集 (smalls) · 课堂板书演示 (00:30:19)](</attachments/cs61a-80a0da0527e9078307478706.png>)
*⏱ 时间戳：00:30:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:30:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1819)*

![经典挑战 2：后代全量比较节点收集 (smalls) · 课堂板书演示 (00:32:18)](</attachments/cs61a-f48a7c2e01a9e705c0c0a83b.png>)
*⏱ 时间戳：00:32:18 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:32:18)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1938)*

### 难点对比分析
- 在 `bigs` 中，状态信息是**从上往下（Top-Down）**流动传递的（祖先最大值传给子代）；
- 在 `smalls` 中，状态信息必须**从下往上（Bottom-Up）**聚合回传（每个节点需要知道其所有后代的最小值）！

---

## 8. 一箭双雕：双职责辅助函数的设计 (`smalls` 完美实现)

我们定义递归辅助函数 `process(t)`，它同时承担两项关键任务：
1. **返回值**：返回以 `t` 为根的整棵子树中的**绝对最小标签值**；
2. **副作用（收集）**：如果 `t` 是非叶子节点且 `t.label` 小于其所有子树的后代最小值，则将 `t` 追加至闭包的全局结果列表 `result` 中！

![一箭双雕：双职责辅助函数的设计 (smalls 完美实现) · 课堂板书演示 (00:34:47)](</attachments/cs61a-bb762eefba11d193c8f227d2.png>)
*⏱ 时间戳：00:34:47 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:34:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=2087)*

![一箭双雕：双职责辅助函数的设计 (smalls 完美实现) · 课堂板书演示 (00:37:17)](</attachments/cs61a-e2eb3c8fc342990dfbe03574.png>)
*⏱ 时间戳：00:37:17 · 📷 课堂截图 · [在 B 站观看对应片段 (P37 00:37:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=2237)*

```python
def smalls(t):
    """返回所有标签小于其所有后代标签的非叶子节点列表。"""
    result = []
    def process(t):
        if t.is_leaf():
            return t.label
        smallest_descendant = min([process(b) for b in t.branches])
        if t.label < smallest_descendant:
            result.append(t)
        return min(t.label, smallest_descendant)
    process(t)
    return result
```

- 基线条件：若 `t` 为叶子，直接返回 `t.label`，绝不追加至 `result`（题目限定非叶子节点）；
- 归纳条件：递归计算所有分支返回的最小值，得到 `smallest_descendant`；
- 条件判定：若当前标签小于后代最小值，命中目标，`result.append(t)`；
- 向上回传：返回 `min(t.label, smallest_descendant)`，供上一层父节点继续判定！

整个解法结构如天工开物，浑然一体。

---

## 结语：计算机程序的结构与解释

随着 Lecture 37 的落幕，CS61A 的 37 讲全部课程圆满收官！

回顾全书：
- 我们见证了如何仅用最朴素的函数组合构建出复杂的抽象世界；
- 我们洞悉了对象系统与环境帧链的物理运行真理；
- 我们在 Scheme 中亲手复刻了图灵完备的解释器，领悟了代码即数据的至高境界；
- 我们在声明式 SQL 中学会了用数学谓词统御海量数据。

愿这套精炼的思维心法，陪伴你在未来的计算机科学与软件工程征途上披荆斩棘，从容创造！