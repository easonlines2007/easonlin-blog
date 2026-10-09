---
title: Lecture 09 · Recursion (递归与环境模型)
description: CS61A 第 9 讲：Recursion (递归与环境模型)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 9
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：37:49 ｜ **视频回链**：[B 站对应单集 (P9)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9)

## 1. 引言：环境模型中的自引用与状态累积

在深入经典递归之前，DeNero 教授从环境模型的自然推论出发，探讨了一个看似简单却极为强大的机制：**函数体内部可以引用自身的名字**。

### 1.1 自引用返回自身的函数 (`print_all`)

考虑如下 Python 函数：
```python
def print_all(x):
    print(x)
    return print_all
```
当我们执行链式调用 `print_all(1)(3)(5)` 时：
1. `print_all(1)`：首先在全局帧查找 `print_all`，创建局部帧 `f1`，绑定 `x = 1`。打印 `1`，随后函数体查找 `print_all` 并返回该函数本身。
2. 链式调用的第二个括号 `(3)` 立即作用于返回的 `print_all`，创建局部帧 `f2`，绑定 `x = 3`，打印 `3`，再次返回 `print_all`。
3. 第三个括号 `(5)` 同样调用该函数，打印 `5`。

![自引用返回自身的函数 (print_all) · 课堂板书演示 (00:05:22)](</attachments/cs61a-f24b48c19e123d3979a40638.png>)
*⏱ 时间戳：00:05:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:05:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=322)*

```
Global frame
  print_all ───► func print_all(x) [parent=Global]
                    ▲
                    │ (returned each time)
f1: print_all [parent=Global]
  x: 1
  Return value ───► func print_all(x)

f2: print_all [parent=Global]
  x: 3
  Return value ───► func print_all(x)

f3: print_all [parent=Global]
  x: 5
  Return value ───► func print_all(x)
```

> **核心结论**：虽然 `print_all` 内部引用了自己，但它并没有在函数体内**调用**自己，因此不会无限循环；调用的次数完全由外部的链式调用表达式决定。

---

### 1.2 高阶函数与历史状态累积 (`print_sums`)

如果我们希望每次调用不仅打印当前参数，还能输出“迄今为止所有参数的累加和”，该如何设计？

利用词法闭包与父帧环境，我们可以编写：
```python
def print_sums(x):
    print(x)
    def next_sum(y):
        return print_sums(x + y)
    return next_sum
```

执行调用：`print_sums(1)(3)(5)`
- `print_sums(1)`：打印 `1`，定义局部函数 `next_sum`（其父帧为 `f1: x=1`），并返回 `next_sum`。
- `next_sum(3)`：局部帧 `f2` 绑定 `y = 3`。执行 `print_sums(x + y)`，在此处通过父帧 `f1` 找到 `x = 1`，计算 `1 + 3 = 4`，发起对 `print_sums(4)` 的调用。
- `print_sums(4)`：进入 `f3` 帧，打印累积和 `4`，定义新的 `next_sum`（父帧为 `f3: x=4`）并返回。
- 最终传入 `5` 时，新内部函数计算 `4 + 5 = 9`，进入 `f5` 打印 `9`。

![高阶函数与历史状态累积 (print_sums) · 课堂板书演示 (00:08:19)](</attachments/cs61a-ef9814dc4b71e1e832358719.png>)
*⏱ 时间戳：00:08:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:08:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=499)*

这种模式展示了：**参数通过帧链可以在不同函数调用之间传递并记住计算历史**。这为我们理解递归的状态转移奠定了直观基础。

---

## 2. 递归的本质与现实映照

### 2.1 什么是递归函数？
> **递归函数 (Recursive Function)**：在自身函数体内直接或间接调用自身的函数。

```mermaid
graph LR
    A["调用 f(n)"] --> B{"是否为最简情况?"}
    B -- 是 (Base Case) --> C["直接返回基线解"]
    B -- 否 (Recursive Case) --> D["将问题缩减为 f(n-1) 或更小规模"]
    D --> A
```

递归不仅是计算机算法的基石，更在自然、艺术与数学中随处可见：
- **谢尔宾斯基三角形 (Sierpinski Triangle)**：一个大三角形由三个以角为顶点的小谢尔宾斯基三角形组成，无限嵌套。
- **俄罗斯套娃 (Matryoshka Dolls)**：打开一个娃娃，里面是一个一模一样但尺度更小的娃娃，直到最内层不可拆分的实心小木偶。

![什么是递归函数？ · 课堂板书演示 (00:10:22)](</attachments/cs61a-0b298b0bcf723046ab5ac051.png>)
*⏱ 时间戳：00:10:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:10:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=622)*

### 2.2 典型动机：各位数字求和 (Sum Digits) 与校验位

以计算正整数各数位之和为例：`2013 -> 2 + 0 + 1 + 3 = 6`。
- **数学性质**：一个整数能被 9 整除，当且仅当其各位数字之和能被 9 整除。
- **工程应用（校验位 Checksum Digit）**：在信用卡、条形码（UPC）、身份证号中，最后一位数字通常不是账号本身，而是由前面所有位计算出来的校验位。如果用户输入错误，系统可无需联网直接识别出笔误。

![典型动机：各位数字求和 (Sum Digits) 与校验位 · 课堂板书演示 (00:11:30)](</attachments/cs61a-747cf7da43b35be273f3d0cb.png>)
*⏱ 时间戳：00:11:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:11:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=690)*

---

## 3. 递归函数的解剖结构 (Anatomy of a Recursive Function)

如何不用 `while` 循环对整数各个数位求和？

### 3.1 积木构造：数位拆分 (`split`)
首先定义整数除法与取模的基本操作：
```python
def split(n):
    """返回 (去除个位后的数, 个位数字)"""
    return n // 10, n % 10
```
例如：`split(2013)` 返回 `(201, 3)`。如果我们已经知道如何对 `201` 的各个数位求和（得 `3`），再加上个位数 `3`，即可得到原数的结果 `6`！

![积木构造：数位拆分 (split) · 课堂板书演示 (00:13:48)](</attachments/cs61a-0dc866a858a209c6061670cd.png>)
*⏱ 时间戳：00:13:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:13:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=828)*

### 3.2 递归标准范式
一个规范的递归函数必然由两大支柱构成：
1. **基线条件 (Base Cases)**：不需要递归调用就能直接求解的最简单情形。
2. **递归条件 (Recursive Cases)**：通过把原问题拆分为**规模更小的同类子问题**，并在子问题结果上完成组装。

```python
def sum_digits(n):
    """计算正整数 n 的各位数字之和。"""
    if n < 10:
        return n  # 基线条件：单数位直接返回自身
    else:
        all_but_last, last = split(n)
        return sum_digits(all_but_last) + last  # 递归条件：更小的问题 + 当前个位
```

![递归标准范式 · 课堂板书演示 (00:15:22)](</attachments/cs61a-b95acfa153e9ae58ef34f83b.png>)
*⏱ 时间戳：00:15:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:15:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=922)*

> **解剖要素对照表**：
> | 组成部分 | `sum_digits` 中的实现 | 关键作用 |
> | :--- | :--- | :--- |
> | **函数签名** | `def sum_digits(n):` | 声明函数接收的参数（状态载体） |
> | **条件分支** | `if n < 10:` | 区分基线与递归分支，防止无限自调 |
> | **基线求解** | `return n` | 为递归提供停止条件与出口返回值 |
> | **状态缩小** | `all_but_last, last = split(n)` | 确保每一次递归调用的输入都在向基线收敛 |
> | **递归组合** | `return sum_digits(...) + last` | 信任子问题的解，并合成最终答案 |

---

## 4. 环境模型视角：阶乘函数的调用栈展开与返回

为了彻底祛除对递归的神秘感，我们用 CS61A 最强大的工具——**环境模型 (Environment Diagrams)** 逐帧分析阶乘函数 `fact(3)`：

```python
def fact(n):
    if n == 0:
        return 1
    else:
        return n * fact(n - 1)

fact(3)
```

![环境模型视角：阶乘函数的调用栈展开与返回 · 课堂板书演示 (00:17:38)](</attachments/cs61a-cd4849c5defef529a35d3a53.png>)
*⏱ 时间戳：00:17:38 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:17:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1058)*

### 4.1 深入调用栈（向基线递进）
1. **调用 `fact(3)`**：创建帧 `f1`，绑定 `n = 3`。进入 `else` 分支，求值表达式 `3 * fact(2)`。为了得到乘法操作数，暂停当前帧的返回，发起子调用 `fact(2)`。
2. **调用 `fact(2)`**：创建帧 `f2`，绑定 `n = 2`。求值 `2 * fact(1)`，暂停等待 `fact(1)` 的返回值。
3. **调用 `fact(1)`**：创建帧 `f3`，绑定 `n = 1`。求值 `1 * fact(0)`，暂停等待 `fact(0)`。
4. **到达基线 `fact(0)`**：创建帧 `f4`，绑定 `n = 0`。满足 `n == 0`，直接返回 `1`！

### 4.2 栈帧返回与乘积聚合（从基线回溯）
5. `f4` 返回 `1` 到 `f3` 的等待点：`f3` 计算 `1 * 1 = 1`，将 `1` 作为 `f3` 的返回值返回给 `f2`。
6. `f2` 收到 `1`：计算 `2 * 1 = 2`，将 `2` 返回给 `f1`。
7. `f1` 收到 `2`：计算 `3 * 2 = 6`，最终返回 `6`。

![栈帧返回与乘积聚合（从基线回溯） · 课堂板书演示 (00:21:40)](</attachments/cs61a-14015e01b3e385264657217f.png>)
*⏱ 时间戳：00:21:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:21:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1300)*

```
Global frame
  fact ───► func fact(n) [parent=Global]

f1: fact [parent=Global]
  n: 3
  Return value: 6  ◄── 3 * 2

f2: fact [parent=Global]
  n: 2
  Return value: 2  ◄── 2 * 1

f3: fact [parent=Global]
  n: 1
  Return value: 1  ◄── 1 * 1

f4: fact [parent=Global]
  n: 0
  Return value: 1  (Base Case reached!)
```

> **环境模型的关键启示**：
> - **同一个函数被调用多次**，但**每个调用对应独立的活动帧 (Frame)**。
> - 计算机从来不会混淆不同层级的 `n`，因为每次求值当前表达式中的 `n` 时，它只在当前处于活跃状态的环境中向后查找。
> - 所有的未决计算（Pending computations）都被保存在各自所属帧的执行上下文中。

---

## 5. 迭代 vs. 递归：表达力与状态存储的抉择

### 5.1 代码与数学形式对比

计算阶乘的迭代实现与递归实现：

```python
# 迭代实现 (Iteration)
def fact_iter(n):
    total, k = 1, 1
    while k <= n:
        total, k = total * k, k + 1
    return total

# 递归实现 (Recursion)
def fact(n):
    if n == 0:
        return 1
    return n * fact(n - 1)
```

![递归实现 (Recursion) · 课堂板书演示 (00:24:16)](</attachments/cs61a-9fb2083b0895f7f786ce28be.png>)
*⏱ 时间戳：00:24:16 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:24:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1456)*

### 5.2 核心差异分析
| 维度 | 迭代 (Iteration) | 递归 (Recursion) |
| :--- | :--- | :--- |
| **状态维护机制** | 程序员必须显式定义变量（如 `total`、`k`）并在循环体内通过赋值语句不断修改其值 | 依赖**调用栈帧 (Call Stack Frames)** 隐式维护每一步的局部状态 |
| **变量命名负担** | 需要维护多个状态变量名，变量生命周期长，易出现变量被污染或越界 | 仅需关注函数参数与当前子问题规模，局部变量少 |
| **数学对应性** | 对应累乘积记号：$\prod_{k=1}^n k$ | 对应递推归纳定义：$n! = \begin{cases} 1 & \text{if } n = 0 \\ n \cdot (n-1)! & \text{otherwise} \end{cases}$ |
| **空间开销** | 常数级空间复杂度 $O(1)$ | 栈帧深度正比于递归步数 $O(n)$（非尾递归优化时） |

---

## 6. 思维跃迁：递归信任跃进 (The Recursive Leap of Faith)

初学者写递归时最常见的心理障碍是：“我还没把这个函数写完，为什么我可以在代码里直接调用它自己？它怎么可能给出正确的答案？”

DeNero 教授形象地称之为**“跳崖时的信任跃进” (Leap of Faith)**。

![思维跃迁：递归信任跃进 (The Recursive Leap of Faith) · 课堂板书演示 (00:26:48)](</attachments/cs61a-2c0a134274b0562f03939709.png>)
*⏱ 时间戳：00:26:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:26:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1608)*

### 6.1 验证递归正确性的三步心法
1. **第一步：验证基线条件 (Verify the Base Cases)**
   - 检查最简单输入下，函数是否直接返回正确的答案。对于 `fact(0)`，它返回 `1`，无需怀疑。
2. **第二步：将递归调用视为函数抽象 (Treat Recursive Call as Functional Abstraction)**
   - **绝对不要在脑海中层层展开递归调用的执行细节！**
   - 将 `fact(n - 1)` 视为一个黑盒子抽象。只关心它的**合约说明 (Contract)**：即假设它必定能正确计算出 $(n-1)!$。
3. **第三步：归纳证明整体正确性 (Verify Induction Step)**
   - 证明：如果 `fact(n - 1)` 确如预期工作，那么基于它的结果组装出的 `n * fact(n - 1)` 是否严格等价于 $n!$？
   - $n \cdot (n-1)! = n!$，等式在数学上绝对成立。结合基线条件，整个函数在所有自然数范围内皆正确！

> **思维法则**：写递归时，你的注意力必须始终放在**“如何利用子问题的解构建当前问题的解”**，而不是陷入跟踪调用栈调度的无限细节之中。

---

## 7. 互递归实战：信用卡校验 Luhn 算法

### 7.1 算法原理 (Wikipedia)
全球通用信用卡（如 Visa、MasterCard）采用 **Luhn 算法 (模 10 算法)** 检测输入错误：
1. 从最右侧数位（校验位本身）开始，自右向左扫描。
2. **偶数位置（从右往左数第 2, 4, 6... 个数字）翻倍 (Double)**。
3. 如果翻倍后的结果大于 9（例如 $8 \times 2 = 16$），则将其**各个数位求和**（$1 + 6 = 7$，等价于减去 9）。
4. 将所有数位（包括翻倍处理后的数位与未翻倍的数位）相加。
5. 若最终总和是 10 的倍数（即 `sum % 10 == 0`），则信用卡号合法。

![算法原理 (Wikipedia) · 课堂板书演示 (00:29:54)](</attachments/cs61a-5435a4ac8e4eb5df7bcfbefa.png>)
*⏱ 时间戳：00:29:54 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:29:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1794)*

**举例**：账号 `1 3 8 7 4 3`
- 从右往左处理：
  - `3`（第1位，保留）：$3$
  - `4`（第2位，翻倍）：$4 \times 2 = 8$
  - `7`（第3位，保留）：$7$
  - `8`（第4位，翻倍）：$8 \times 2 = 16 \rightarrow 1 + 6 = 7$
  - `3`（第5位，保留）：$3$
  - `1`（第6位，翻倍）：$1 \times 2 = 2$
- 求和：$2 + 3 + 7 + 7 + 8 + 3 = 30$。$30 \pmod{10} == 0$，校验通过！

---

### 7.2 互递归代码实现 (`luhn_sum` 与 `luhn_sum_double`)
通过两个函数相互调用，我们可以极度优雅地处理“每隔一位翻倍”的状态交替：

```python
def split(n):
    return n // 10, n % 10

def sum_digits(n):
    if n < 10:
        return n
    all_but_last, last = split(n)
    return sum_digits(all_but_last) + last

def luhn_sum(n):
    """计算当前最右侧数位不翻倍时的 Luhn 和。"""
    if n < 10:
        return n
    all_but_last, last = split(n)
    return luhn_sum_double(all_but_last) + last

def luhn_sum_double(n):
    """计算当前最右侧数位需要翻倍时的 Luhn 和。"""
    all_but_last, last = split(n)
    luhn_digit = sum_digits(2 * last)
    if n < 10:
        return luhn_digit
    return luhn_sum(all_but_last) + luhn_digit
```

![互递归代码实现 (luhn_sum 与 luhn_sum_double) · 课堂板书演示 (00:32:33)](</attachments/cs61a-bcaa1859b14c0d70df4ac756.png>)
*⏱ 时间戳：00:32:33 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:32:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=1953)*

```mermaid
sequenceDiagram
    participant User
    participant LS as luhn_sum (不翻倍)
    participant LSD as luhn_sum_double (翻倍)

    User->>LS: luhn_sum(138743)
    Note over LS: last=3 (保留)
    LS->>LSD: luhn_sum_double(13874)
    Note over LSD: last=4 -> 翻倍为 8
    LSD->>LS: luhn_sum(1387)
    Note over LS: last=7 (保留)
    LS->>LSD: luhn_sum_double(138)
    Note over LSD: last=8 -> 翻倍 16 -> sum_digits 7
    LSD->>LS: luhn_sum(13)
    Note over LS: last=3 (保留)
    LS->>LSD: luhn_sum_double(1)
    Note over LSD: 最后一项 1 -> 翻倍为 2 (基线命中)
    LSD-->>LS: 返回 2
    LS-->>LSD: 2 + 3 = 5
    LSD-->>LS: 5 + 7 = 12
    LS-->>LSD: 12 + 7 = 19
    LSD-->>LS: 19 + 8 = 27
    LS-->>User: 27 + 3 = 30
```

> **互递归 (Mutual Recursion)** 的核心特征：两个或多个函数形成相互调用的循环回路。通过函数控制权的交替转移，天然实现多状态机（如本例中“普通位”与“翻倍位”的双状态交替），完全无需显式维护布尔标志位。

---

## 8. 递归与迭代的双向转化定理

### 8.1 递归转迭代：显式状态提升
将递归转换为迭代时，关键是识别**每次递归调用中传递的状态与返回的部分和**，并将其提升为循环变量：

```python
def sum_digits_iter(n):
    digit_sum = 0
    while n > 0:
        n, last = split(n)
        digit_sum = digit_sum + last
    return digit_sum
```
![递归转迭代：显式状态提升 · 课堂板书演示 (00:34:39)](</attachments/cs61a-b3bf5b34ff322892265731cb.png>)
*⏱ 时间戳：00:34:39 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:34:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=2079)*

### 8.2 迭代转递归：循环状态参数化
将迭代转换为递归更为机械和直接（因为迭代在理论上只是递归的一个特例）：
1. 找出在 `while` 循环体之间发生变化的所有状态变量（例如 `n` 与 `digit_sum`）。
2. 将这些变量作为**递归函数的形参**。
3. `while` 循环的退出条件转换为**基线条件**。
4. 循环体内赋值更新操作转换为**递归调用时的传参**。

```python
def sum_digits_rec(n, digit_sum=0):
    if n == 0:
        return digit_sum  # 退出循环的基线条件
    n, last = split(n)
    return sum_digits_rec(n, digit_sum + last)  # 状态更新通过实参传递
```
![迭代转递归：循环状态参数化 · 课堂板书演示 (00:36:56)](</attachments/cs61a-f2e0551943a6b62535b79254.png>)
*⏱ 时间戳：00:36:56 · 📷 课堂截图 · [在 B 站观看对应片段 (P9 00:36:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=9&t=2216)*

---

## 9. 本讲核心要点与思考题

### 重点法则提炼
1. **基线条件不可或缺**：每一个递归函数都必须拥有至少一个无需递归即可直接计算的基线分支，且递归分支的参数必须持续向基线收敛。
2. **环境模型是理解递归的根本基石**：每次调用函数都会开辟专属活动帧，变量求值严格限定在当前环境上下文中。
3. **拥抱函数抽象 (Leap of Faith)**：拒绝在脑海中单步跟踪多层嵌套递归；写递归时，假设更小规模的子调用已经正确解决，专心完成当前步骤的组装。
4. **互递归处理交替状态**：当处理两相交替（如偶数位处理、两人博弈决策）问题时，互递归是表现力极强的设计范式。

---

### 课后自测练习

#### 练习 1：递归计算逆序打印数位
编写一个递归函数 `print_digits_reverse(n)`，给定一个正整数 `n`，从右向左逐行打印其数位。
```python
def print_digits_reverse(n):
    """
    >>> print_digits_reverse(1234)
    4
    3
    2
    1
    """
    print(n % 10)
    if n >= 10:
        print_digits_reverse(n // 10)
```

#### 练习 2：级联阶梯打印 (Cascade)
编写递归函数 `cascade(n)`，输出如下对称数字三角形：
```
>>> cascade(1234)
1234
123
12
1
12
123
1234
```
*思考提示：在递归调用前打印一次，在递归调用后打印一次，中间发生什么？*
```python
def cascade(n):
    if n < 10:
        print(n)
    else:
        print(n)
        cascade(n // 10)
        print(n)
```
通过本讲环境模型可以清晰看到：前序打印是在入栈递进时发生，后序打印是在退栈回溯时执行，展现了递归调用的天然镜像对称结构！

---

