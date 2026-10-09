---
title: Lecture 23 · 程序效率与复杂度分析 (Efficiency)
description: CS61A 第 23 讲：程序效率与复杂度分析 (Efficiency)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 23
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：36:37 ｜ **视频回链**：[B 站对应单集 (P23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23)

## 1. 核心心智模型与架构图解

评估程序不仅关乎其“输出是否正确”，更关乎其“消耗了多少计算资源”。计算资源主要包括两类：
1. **时间复杂度 (Time Complexity)**：随着输入规模 $n$ 的增大，计算所需步骤数或调用次数如何增长；
2. **空间复杂度 (Space Complexity)**：在执行过程中，同时处于存活状态的**活跃环境帧（Active Environments）**及数据所占用的最大内存峰值。

```
时间增长阶谱系 (Orders of Growth):
  耗时 (Time)
   ▲
   │                                  Exponential: Θ(2ⁿ) [未记忆化斐波那契]
   │                                     /
   │                                    /   Quadratic: Θ(n²) [所有数对对比 overlap]
   │                                   /   /
   │                                  /   /   Linear: Θ(n) [普通递归 exp]
   │                                 /   /   /
   │                                /   /   /   Logarithmic: Θ(log n) [折半快速幂 exp_fast]
   │                               /   /   /   /
   │                              /   /   /   /──── Constant: Θ(1) [字典键查找]
   └────────────────────────────────────────────────────────► 输入规模 (n)

空间管理法则：
  • 仅有当前正在执行（未 return）的函数调用及其父环境帧占用内存；
  • 已经返回的调用帧会被 Python 垃圾回收机制立即释放；
  • 递归树的栈空间消耗仅取决于其最深单条调用链路（Max Depth），而非整棵树的节点总数！
```

---

## 2. 效率度量与调用计数装饰器 (Measuring Efficiency)

以经典的树形递归斐波那契数列为例：

![效率度量与调用计数装饰器 (Measuring Efficiency) · 课堂板书演示 (00:00:55)](</attachments/cs61a-731293815acaa81628adeae6.png>)
*⏱ 时间戳：00:00:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=55)*

```python
def fib(n):
    if n == 0 or n == 1:
        return n
    return fib(n - 2) + fib(n - 1)
```

计算 `fib(5)` 需要计算 `fib(3)` 与 `fib(4)`，而 `fib(3)` 会重复计算 `fib(1)` 与 `fib(2)`。为了定量统计调用总数，我们构造一个**函数调用计数装饰器（Count Decorator）**：

![效率度量与调用计数装饰器 (Measuring Efficiency) · 课堂板书演示 (00:02:45)](</attachments/cs61a-cdaeaf95983dd7e5653d4f70.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=165)*

```python
def count(f):
    """统计函数 f 累计被调用次数的装饰器。"""
    def counted(n):
        counted.call_count += 1
        return f(n)
    counted.call_count = 0
    return counted

fib = count(fib)
fib(5)   # 输出 5，fib.call_count 为 15 次
fib(30)  # 计算 832040，fib.call_count 高达 2,692,537 次！
```

> **惊人发现**：仅仅为了计算第 30 个斐波那契数，底层竟然执行了超过 269 万次函数调用！大部分调用都在重复计算 `fib(0)`、`fib(1)` 与 `fib(2)`。

---

## 3. 记忆化优化：空间换时间 (Memoization)

**记忆化（Memoization）** 是一种将昂贵函数调用结果缓存起来的技术。如果未来遇到完全相同的实参，直接从缓存字典中读取，绝不重复计算：

![记忆化优化：空间换时间 (Memoization) · 课堂板书演示 (00:04:45)](</attachments/cs61a-836a477f34822e61f6b37457.png>)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=285)*

```python
def memo(f):
    """记忆化装饰器：仅适用于纯函数（Pure Functions）。"""
    cache = {}
    def memoized(n):
        if n not in cache:
            cache[n] = f(n)
        return cache[n]
    return memoized
```

![记忆化优化：空间换时间 (Memoization) · 课堂板书演示 (00:06:45)](</attachments/cs61a-b975a6820409503d7c6a6e22.png>)
*⏱ 时间戳：00:06:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=405)*

### 优化效果与调用树修剪

对 `fib` 应用记忆化后：
- `fib(30)` 的实际基础计算调用次数从 **2,692,537 次** 直降到 **31 次**（即计算 $0, 1, 2, \dots, 30$ 各一次）！
- 即便计算 `fib(300)` 也是毫秒级瞬间完成。

![优化效果与调用树修剪 · 课堂板书演示 (00:08:45)](</attachments/cs61a-e2ed12ec05cc0fed649c4c79.png>)
*⏱ 时间戳：00:08:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=525)*

> **调用树剪枝图解**：
> 在计算 `fib(5)` 时，左侧分支计算完 `fib(2)` 和 `fib(3)` 并写入缓存后，右侧分支调用 `fib(4)` 时，其子分支 `fib(2)` 和 `fib(3)` 直接命中缓存返回，整整一半的子调用树被完全修剪忽略！

---

## 4. 算法级优化：幂运算案例 (Linear vs Logarithmic)

并非所有性能瓶颈都能依赖记忆化；从算法数学逻辑入手优化是计算机科学的精髓。以幂运算 $b^n$ 为例：

![算法级优化：幂运算案例 (Linear vs Logarithmic) · 课堂板书演示 (00:11:45)](</attachments/cs61a-9d6f5499f49f9c38f5d72051.png>)
*⏱ 时间戳：00:11:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=705)*

### 算法 A：普通线性递归

$$b^n = b \times b^{n-1} \quad (b^0 = 1)$$

```python
def exp(b, n):
    if n == 0:
        return 1
    return b * exp(b, n - 1)
```

输入 $n$ 翻倍，乘法运算次数也严格翻倍，呈**线性增长（Linear Growth）**。

### 算法 B：折半快速幂算法

利用偶数次方的平方性质：
$$b^n = (b^{n/2})^2 \quad (\text{当 } n \text{ 为偶数})$$
$$b^n = b \times b^{n-1} \quad (\text{当 } n \text{ 为奇数})$$

```python
def square(x):
    return x * x

def exp_fast(b, n):
    if n == 0:
        return 1
    elif n % 2 == 0:
        return square(exp_fast(b, n // 2))
    else:
        return b * exp_fast(b, n - 1)
```

每进行一次平方操作，问题规模 $n$ 就缩减一半！这就是**对数增长（Logarithmic Growth）**。

### 实测性能对比 (Jupyter Notebook & timeit)

![实测性能对比 (Jupyter Notebook & timeit) · 课堂板书演示 (00:13:45)](</attachments/cs61a-8173c853b99efda521a46151.png>)
*⏱ 时间戳：00:13:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=825)*

![实测性能对比 (Jupyter Notebook & timeit) · 课堂板书演示 (00:15:15)](</attachments/cs61a-9050614a8bf0bb2ba035c40f.png>)
*⏱ 时间戳：00:15:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=915)*

![实测性能对比 (Jupyter Notebook & timeit) · 课堂板书演示 (00:16:45)](</attachments/cs61a-a2de8dc4f1afecc774c5ed44.png>)
*⏱ 时间戳：00:16:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1005)*

- **线性算法**：计算 $2^{400}$ 耗时约 1ms，计算 $2^{1600}$ 耗时约 4ms，时间曲线是笔直的倾斜直线。
- **快速幂算法**：计算 $2^{1600}$ 仅需 0.04ms，规模从 400 翻倍到 800、再翻倍到 1600，耗时每次仅增加恒定的 0.002ms！

---

## 5. 增长阶与渐进符号 (Orders of Growth & Big-Theta)

计算机科学家使用渐进符号来屏蔽具体机器、操作系统和微秒级抖动，从宏观上描述算法的规模伸缩趋势：

![增长阶与渐进符号 (Orders of Growth & Big-Theta) · 课堂板书演示 (00:18:45)](</attachments/cs61a-473e6d11e167e7289043b5ea.png>)
*⏱ 时间戳：00:18:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1125)*

![增长阶与渐进符号 (Orders of Growth & Big-Theta) · 课堂板书演示 (00:20:15)](</attachments/cs61a-0bee61159026c2e4a628a1e9.png>)
*⏱ 时间戳：00:20:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1215)*

### Big-$\Theta$ vs Big-$O$

- **Big-$\Theta$（紧确界 Tight Bound）**：描述算法运行时间的上下界，如 $\Theta(n)$ 表示耗时既不慢于也不快于线性常数倍。
- **Big-$O$（上界 Upper Bound）**：描述算法最坏情况下的最大耗时上限，如 $O(n^2)$ 表示耗时最多是二次方级别。

---

## 6. 五大常见增长阶全景解析

![五大常见增长阶全景解析 · 课堂板书演示 (00:22:45)](</attachments/cs61a-2f49761b6e1cdce77343928b.png>)
*⏱ 时间戳：00:22:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1365)*

![五大常见增长阶全景解析 · 课堂板书演示 (00:24:45)](</attachments/cs61a-a78d9037100c3dc9a938e651.png>)
*⏱ 时间戳：00:24:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1485)*

![五大常见增长阶全景解析 · 课堂板书演示 (00:26:45)](</attachments/cs61a-b632182c62740d25e49c2005.png>)
*⏱ 时间戳：00:26:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1605)*

| 增长阶 | 渐进记号 | 规模增长效应 ($n \to n+1$ 或 $n \to 2n$) | 典型算法 / 操作 |
| :--- | :--- | :--- | :--- |
| **常数阶 (Constant)** | $\Theta(1)$ | 增加 $n$ 对时间完全无影响 | Python 字典键查找、列表下标索引 |
| **对数阶 (Logarithmic)** | $\Theta(\log n)$ | $n$ 翻倍（$2n$），耗时仅增加常数步 | 二分查找、快速幂 `exp_fast` |
| **线性阶 (Linear)** | $\Theta(n)$ | $n$ 增加 1，耗时增加常数步；$n$ 翻倍耗时翻倍 | 遍历列表、普通递归 `exp` |
| **平方阶 (Quadratic)** | $\Theta(n^2)$ | $n$ 增加 1，增加 $c \cdot n$ 步；$n$ 翻倍耗时增至 4 倍 | 双重嵌套循环、元素对比较 `overlap` |
| **指数阶 (Exponential)** | $\Theta(b^n)$ | $n$ 增加 1，耗时**乘以**常数因子 $b$ | 未记忆化的树形递归 `fib` |

---

## 7. 空间复杂度与活跃环境帧管理 (Space Complexity)

程序占用的内存不仅来自于存储的数据，还来自于**环境帧（Environment Frames）**的驻留。

![空间复杂度与活跃环境帧管理 (Space Complexity) · 课堂板书演示 (00:30:45)](</attachments/cs61a-339a78f0a2eee15261894184.png>)
*⏱ 时间戳：00:30:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:30:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1845)*

![空间复杂度与活跃环境帧管理 (Space Complexity) · 课堂板书演示 (00:32:45)](</attachments/cs61a-d43efd84e9bbbc2ce6875228.png>)
*⏱ 时间戳：00:32:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1965)*

### 活跃环境规则 (Active Environments Rule)

1. **未返回的函数帧**：只有正在被求值且尚未返回（未执行完 `return`）的函数调用帧，才会驻留在内存中；
2. **闭包父帧**：若某个活跃函数引用了嵌套定义它的父函数帧，该父帧必须持续保活；
3. **帧销毁与回收**：函数一旦返回，其局部帧立即变为无用垃圾，被解释器自动回收并复用内存。

### 实测最大活跃帧数 `count_frames`

![实测最大活跃帧数 count_frames · 课堂板书演示 (00:34:45)](</attachments/cs61a-777fa9193e80798afb90e102.png>)
*⏱ 时间戳：00:34:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2085)*

![实测最大活跃帧数 count_frames · 课堂板书演示 (00:36:15)](</attachments/cs61a-2d351b976fdba25c0f28db8b.png>)
*⏱ 时间戳：00:36:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P23 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2175)*

通过编写高阶追踪器，我们可以监控树形递归 `fib` 的最大瞬时调用栈深：

```python
def count_frames(f):
    def counted(n):
        counted.open_count += 1
        if counted.open_count > counted.max_count:
            counted.max_count = counted.open_count
        result = f(n)
        counted.open_count -= 1
        return result
    counted.open_count = 0
    counted.max_count = 0
    return counted

fib = count_frames(fib)
fib(20)
print(fib.max_count)  # 输出: 20！
```

> **核心结论**：
> 尽管未记忆化的 `fib(20)` 会产生几十万次函数调用，但其**同一时刻活跃的最大帧数仅仅是 20**！
> 树形递归的空间复杂度 $\Theta(n)$ 对应于**调用树从根到叶的最深单链路径**，而非节点总数！

---

## 8. 章节总结与核心考点

1. **性能诊断首选**：遇到重复子问题树形递归，优先应用记忆化模式缓存纯函数结果。
2. **渐进分析核心思想**：抓大放小，关注规模翻倍时的边际成本增长形态（常数/对数/线性/平方/指数）。
3. **时空不对称性**：树形递归时间复杂度可高达指数级 $\Theta(2^n)$，但其调用栈空间峰值仅为线性树高 $\Theta(n)$。

---

