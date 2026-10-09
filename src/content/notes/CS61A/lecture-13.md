---
title: Lecture 13 · Data Abstraction (数据抽象与抽象屏障)
description: CS61A 第 13 讲：Data Abstraction (数据抽象与抽象屏障)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 13
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：29:08 ｜ **视频回链**：[B 站对应单集 (P13)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13)

## 1. 引言：何为“数据”？行为公理与表现无关性

在日常编程中，我们直觉地认为“数据”就是内存中存放的某个字节序列、一串数字或一个列表。但在计算机科学（特别是 SICP 体系）中，**数据是由其“行为”定义的，而非其物理存储方式**。

### 1.1 行为条件 (Behavioral Conditions)
> **行为公理**：判断某种结构是否能够代表“有理数”，唯一的判定标准是：**它的构造器与选择器是否协同满足有理数的代数行为公理**。

![行为条件 (Behavioral Conditions) · 课堂板书演示 (00:00:33)](</attachments/cs61a-cbbbc52577211110778c84ac.png>)
*⏱ 时间戳：00:00:33 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:00:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=33)*

对于由分子 $n$ 和分母 $d$ 构成的有理数 $x = \text{rational}(n, d)$，它必须严格满足：
$$\frac{\text{numer}(x)}{\text{denom}(x)} = \frac{n}{d}$$

只要上述关系成立，无论底层是用双元素列表 `[n, d]`、字典 `{'n': n, 'd': d}`、双精度浮点数、还是一个高阶函数，它都是完全合法且等价的有理数表示！

---

## 2. 抽象数据类型 (ADT)：构造器与选择器的合约

现实世界中的概念往往是复合的（例如日期由年/月/日组成，地理坐标由纬度/经度组成）。**抽象数据类型 (Abstract Data Type, ADT)** 允许我们将这些复合部件作为一个整体单位来操作。

![抽象数据类型 (ADT)：构造器与选择器的合约 · 课堂板书演示 (00:06:54)](</attachments/cs61a-e13df38646682e04ff47ad30.png>)
*⏱ 时间戳：00:06:54 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:06:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=414)*

数据抽象的核心目标是**关注点分离 (Separation of Concerns)**：
- **数据的底层表示 (How data are represented)**
- **数据的高层使用 (How data are manipulated)**

为了在二者之间建立安全隔离，必须制定明确的接口合约：
1. **构造器 (Constructor)**：用于创建该数据类型实例的函数，如 `rational(n, d)`。
2. **选择器 (Selectors)**：用于提取该数据类型各个组成部分的函数，如 `numer(x)` 与 `denom(x)`。

![抽象数据类型 (ADT)：构造器与选择器的合约 · 课堂板书演示 (00:09:32)](</attachments/cs61a-75d0dea6cdf126a9d286a888.png>)
*⏱ 时间戳：00:09:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:09:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=572)*

```mermaid
graph LR
    subgraph 高层应用程序 (Use of Data)
        Add["add_rational(x, y)"]
        Mul["mul_rational(x, y)"]
        Eq["equal_rational(x, y)"]
    end

    subgraph 抽象接口层 (Constructors & Selectors)
        C["rational(n, d)"]
        S1["numer(x)"]
        S2["denom(x)"]
    end

    subgraph 底层表示 (Representation of Data)
        List["列表 [n, d] 或 闭包函数 select"]
    end

    Add --> S1
    Add --> S2
    Mul --> S1
    Mul --> S2
    Mul --> C
    C --> List
    S1 --> List
    S2 --> List
```

---

## 3. 实战演练：有理数算术系统的完整构建

为什么我们要构造有理数 ADT，而不是直接执行浮点数除法 `1 / 3`？
- 计算机浮点数采用有限的二进制小数展开，会产生精度损失（$1/3 \approx 0.3333333333333333$）。
- 通过保持分子与分母为精确的整数对，我们可以实现**无精度损耗的完全精确分数算术**。

![实战演练：有理数算术系统的完整构建 · 课堂板书演示 (00:08:31)](</attachments/cs61a-3224f4ed7bc3a3d10e7049ed.png>)
*⏱ 时间戳：00:08:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:08:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=511)*

### 3.1 乘法、加法与判等规则的数学推导
根据初等分数代数运算法则：
- **乘法 (Multiplication)**：
  $$\frac{n_1}{d_1} \times \frac{n_2}{d_2} = \frac{n_1 \cdot n_2}{d_1 \cdot d_2}$$
- **加法 (Addition)**：
  $$\frac{n_1}{d_1} + \frac{n_2}{d_2} = \frac{n_1 \cdot d_2 + n_2 \cdot d_1}{d_1 \cdot d_2}$$
- **相等性判定 (Equality)**：不能单纯比较分子分母是否相同（因为 $1/2 = 2/4$）。通过交叉相乘验证：
  $$\frac{n_1}{d_1} = \frac{n_2}{d_2} \iff n_1 \cdot d_2 = n_2 \cdot d_1$$

### 3.2 纯粹基于选择器与构造器的函数实现
```python
def mul_rational(x, y):
    """有理数乘法。"""
    return rational(numer(x) * numer(y), denom(x) * denom(y))

def add_rational(x, y):
    """有理数加法。"""
    nx, dx = numer(x), denom(x)
    ny, dy = numer(y), denom(y)
    return rational(nx * dy + ny * dx, dx * dy)

def equal_rational(x, y):
    """有理数判等。"""
    return numer(x) * denom(y) == numer(y) * denom(x)

def print_rational(x):
    """有理数可视化输出。"""
    print(f"{numer(x)} / {denom(x)}")
```

![纯粹基于选择器与构造器的函数实现 · 课堂板书演示 (00:11:00)](</attachments/cs61a-39633c2be135ab34d80dec32.png>)
*⏱ 时间戳：00:11:00 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:11:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=660)*

![纯粹基于选择器与构造器的函数实现 · 课堂板书演示 (00:12:03)](</attachments/cs61a-efeb0be7db7e680c7de5bf36.png>)
*⏱ 时间戳：00:12:03 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:12:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=723)*

> **惊艳之处**：在上述所有运算函数的代码中，**我们从未提及列表、字典、元组等任何具体的 Python 数据类型**！它们完全基于抽象的 `rational`, `numer`, `denom` 编写。即便底层表示尚未实现，高层逻辑已经百分之百完备！

---

## 4. 核心法则：抽象屏障 (Abstraction Barriers)

抽象屏障是一道道无形的“防火墙”，严格划分了大型软件系统中不同层级所掌握的知识范围：

![核心法则：抽象屏障 (Abstraction Barriers) · 课堂板书演示 (00:13:35)](</attachments/cs61a-dcd340eefbdbc55e04adc676.png>)
*⏱ 时间戳：00:13:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:13:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=815)*

![核心法则：抽象屏障 (Abstraction Barriers) · 课堂板书演示 (00:15:07)](</attachments/cs61a-e049b0e0336a448a790cb406.png>)
*⏱ 时间戳：00:15:07 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:15:07)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=907)*

![核心法则：抽象屏障 (Abstraction Barriers) · 课堂板书演示 (00:16:42)](</attachments/cs61a-cbb7004b76ac8624883ba4e5.png>)
*⏱ 时间戳：00:16:42 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:16:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=1002)*

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 使用有理数进行业务计算的程序                             │
│     treat rational numbers as whole data values              │
│     (调用: add_rational, mul_rational, print_rational)      │
├─────────────────────────────────────────────────────────────┤
│ ══════════════════ 抽象屏障 1 (Barrier 1) ══════════════════ │
├─────────────────────────────────────────────────────────────┤
│ 2. 实现有理数算术运算与构造的层级                           │
│     treat rational numbers as numerators and denominators    │
│     (调用: rational, numer, denom)                           │
├─────────────────────────────────────────────────────────────┤
│ ══════════════════ 抽象屏障 2 (Barrier 2) ══════════════════ │
├─────────────────────────────────────────────────────────────┤
│ 3. 实现选择器与构造器的具体数据结构层级                     │
│     treat rational numbers as two-element lists              │
│     (使用: 列表字面量 [n, d], 索引选择 x[0], x[1])          │
├─────────────────────────────────────────────────────────────┤
│ ══════════════════ 抽象屏障 3 (Barrier 3) ══════════════════ │
├─────────────────────────────────────────────────────────────┤
│ 4. Python 语言运行时底层对列表与内存的实现                   │
│     (C 语言数组分配、垃圾回收等，外部不可见)                 │
└─────────────────────────────────────────────────────────────┘
```

> **屏障准则**：在编写任何一层代码时，**只能调用其正下方屏障所提供的公有接口，严禁向下跨越屏障去假设更底层的实现细节**！

---

## 5. 重罪批判：违背抽象屏障的灾难性后果

为了向学生深刻灌输抽象屏障的严肃性，DeNero 教授展示了一段“极其恶劣但表面上能够运行”的代码，并给出了 CS61A 历史上最著名的警句之一：

![重罪批判：违背抽象屏障的灾难性后果 · 课堂板书演示 (00:18:39)](</attachments/cs61a-10c5a50a095fe1d105337db8.png>)
*⏱ 时间戳：00:18:39 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:18:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=1119)*

```python
# 极其糟糕的调用示例 (跨越屏障罪状 1)
add_rational([1, 2], [1, 4])

# 极其糟糕的除法实现 (跨越屏障罪状 2)
def divide_rational(x, y):
    return [x[0] * y[1], x[1] * y[0]]
```

![极其糟糕的除法实现 (跨越屏障罪状 2) · 课堂板书演示 (00:20:10)](</attachments/cs61a-9640733923e36bb8e9bad665.png>)
*⏱ 时间戳：00:20:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:20:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=1210)*

### 罪状剖析
1. 在调用 `add_rational` 时，程序员直接传入了两个列表字面量 `[1, 2]`，而不是调用构造器 `rational(1, 2)`。这假设了有理数必定是列表。
2. 在定义 `divide_rational` 时，程序员直接使用了列表下标 `x[0]` 与 `y[1]`，而不是调用选择器 `numer(x)` 与 `denom(y)`；且最后直接返回方括号列表，而未通过 `rational(...)` 构造。

> **DeNero 教授的经典判词**：
> > *"If I saw somebody's computer with this code on it, I think I would honestly just light it on fire and just watch it burn, because code that violates abstraction barriers should burn."*  
> （如果我在谁的电脑上看到这种破坏抽象屏障的代码，我真想把它一把火点着看着它烧成灰，因为践踏抽象屏障的代码就该被焚毁！）

### 为什么必须如此严厉？
一旦有理数的底层表示发生变更（例如为了性能改用元组、类对象、或加入化简逻辑），**所有违背抽象屏障的代码将瞬间全部崩溃**！

---

## 6. 数据抽象的威力：通过 GCD 自动约分化简

### 6.1 传统列表表示下的基础构造器与选择器
```python
def rational(n, d):
    return [n, d]

def numer(x):
    return x[0]

def denom(x):
    return x[1]
```

![传统列表表示下的基础构造器与选择器 · 课堂板书演示 (00:24:17)](</attachments/cs61a-56bc460096c4aaa2230726c8.png>)
*⏱ 时间戳：00:24:17 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:24:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=1457)*

此时若计算 $3/2 \times 5/3$，结果为 $15/6$。虽然数值正确，但未化简为既约分数 $5/2$。

### 6.2 零修改高层逻辑：仅重构构造器
利用最大公约数 (GCD)，我们在构造有理数时直接除以分子分母的公约数：
```python
from math import gcd

def rational(n, d):
    """构造始终处于既约形态的有理数。"""
    g = gcd(n, d)
    return [n // g, d // g]
```

![零修改高层逻辑：仅重构构造器 · 课堂板书演示 (00:27:55)](</attachments/cs61a-aa8d146e9e9a069a0923872c.png>)
*⏱ 时间戳：00:27:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:27:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=1675)*

**立竿见影的效果**：
- 执行 `mul_rational(rational(3, 2), rational(5, 3))` 自动输出 `5 / 2`！
- 执行 `add_rational(rational(2, 5), rational(1, 10))`（得到 $25/50$）自动化简为 `1 / 2`！
- **整个 `add_rational`、`mul_rational`、`equal_rational`、`print_rational` 无需修改一个字符**！这就是遵守抽象屏障所赋予软件的极致扩展性与可维护性。

---

## 7. 思维升维：用纯函数构建数据（函数式偶对）

为了彻底证明“数据即行为，无关具体容器”，DeNero 教授展示了源自丘奇编码 (Church Pairs) 的计算机科学奇迹：**完全不使用列表、元组或任何内置数据结构，仅凭 Python 函数实现有理数偶对**！

### 7.1 函数式构造器与分发闭包
```python
def rational(n, d):
    """完全使用函数闭包表示有理数。"""
    def select(name):
        if name == 'n':
            return n
        elif name == 'd':
            return d
    return select

def numer(x):
    return x('n')

def denom(x):
    return x('d')
```

![函数式构造器与分发闭包 · 课堂板书演示 (00:02:45)](</attachments/cs61a-ebcfdbf632a972219e6dc75f.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=165)*

![函数式构造器与分发闭包 · 课堂板书演示 (00:04:22)](</attachments/cs61a-ee674842f8a3dcd32da9b038.png>)
*⏱ 时间戳：00:04:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:04:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=262)*

### 7.2 环境模型透视：被闭包捕获的数据
执行 `x = rational(3, 8)` 与 `numer(x)`：

![环境模型透视：被闭包捕获的数据 · 课堂板书演示 (00:05:22)](</attachments/cs61a-f4861b6fa4b835afad1b9c48.png>)
*⏱ 时间戳：00:05:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P13 00:05:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=13&t=322)*

```
Global frame
  rational ───► func rational(n, d)
  numer    ───► func numer(x)
  denom    ───► func denom(x)
  x        ───► func select(name) [parent=f1]

f1: rational [parent=Global]
  n: 3
  d: 8
  select ───► func select(name) [parent=f1]
```
1. 调用 `rational(3, 8)` 在局部帧 `f1` 中绑定了 `n = 3, d = 8`。
2. 返回的内部函数 `select` 的父帧为 `f1`。
3. 当执行 `numer(x)` 即 `x('n')` 时，新建帧 `f2`，参数 `name = 'n'`。在父帧 `f1` 中找到 `n = 3` 并成功返回！

> **终极启示**：
> - 变量 `x` 本身是一个函数！
> - 状态数据并不存在于任何专门的“数据容器”中，而是静静地栖息在函数的**词法闭包父帧 (Parent Frame)** 中。
> - 任何符合行为合约的实体皆可成为数据，**过程与数据在理论最深处是完全统一的**。

---

## 8. 本讲核心要点与思考题

### 重点法则提炼
1. **数据抽象分离表示与使用**：构造器与选择器构筑了唯一的公有通信协议。
2. **严禁向下穿透抽象屏障**：高层业务代码绝不应假设底层的具体存储数据结构。
3. **闭包即对象**：函数闭包能够完整封装状态并响应请求，这是面向对象思想在函数式语言中的最初萌芽。

---

### 课后自测练习

#### 练习 1：平面直角坐标系中的线段抽象
请为二维平面上的线段设计一个数据抽象。包含点 `make_point(x, y)`、选择器 `x_point(p)`、`y_point(p)`，以及线段 `make_segment(start_p, end_p)`、选择器 `start_segment(s)`、`end_segment(s)`。随后编写计算线段中点的函数 `midpoint_segment(s)`：
```python
def make_point(x, y):
    return [x, y]

def x_point(p):
    return p[0]

def y_point(p):
    return p[1]

def make_segment(start_point, end_point):
    return [start_point, end_point]

def start_segment(s):
    return s[0]

def end_segment(s):
    return s[1]

def midpoint_segment(s):
    p1 = start_segment(s)
    p2 = end_segment(s)
    mid_x = (x_point(p1) + x_point(p2)) / 2
    mid_y = (y_point(p1) + y_point(p2)) / 2
    return make_point(mid_x, mid_y)
```
注意在 `midpoint_segment` 中，完全没有出现任何方括号索引，所有操作皆严守抽象屏障！

---

