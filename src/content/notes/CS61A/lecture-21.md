---
title: Lecture 21 · 对象表示与多态接口 (Representation)
description: CS61A 第 21 讲：对象表示与多态接口 (Representation)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 21
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：30:31 ｜ **视频回链**：[B 站对应单集 (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21)

## 1. 核心心智模型与架构图解

面向对象隐喻的核心原则之一：**对象应当表现得像它所代表的真实数据**。其中至关重要的能力是，对象必须能够将自身序列化或格式化为字符串。

在 Python 中，字符串表示被明确解耦为两种针对不同受众的形式：

```
                                    ┌───────────────────────┐
                                    │      Python Object    │
                                    └───────────┬───────────┘
                                                │
                       ┌────────────────────────┴────────────────────────┐
                       ▼                                                 ▼
        ┌─────────────────────────────┐                   ┌─────────────────────────────┐
        │        Canonical / 机器     │                   │       Human / 用户友好       │
        │           repr(obj)         │                   │           str(obj)          │
        ├─────────────────────────────┤                   ├─────────────────────────────┤
        │ • 受众：解释器与开发者      │                   │ • 受众：终端用户与 UI 呈现  │
        │ • 目标：eval(repr(x)) == x  │                   │ • 目标：易读、贴近自然语言  │
        │ • 触发：REPL 交互式输出     │                   │ • 触发：print(x)、f-string  │
        │ • 底层：type(x).__repr__(x) │                   │ • 底层：type(x).__str__(x)  │
        └─────────────────────────────┘                   └─────────────────────────────┘
```

此外，Python 通过 **特殊方法（Special Methods / Dunder Methods）** 建立了语法与底层消息传递的对应关系，使自定义类能够优雅地支持运算符重载（如 `+`）、布尔转换与类型分发。

---

## 2. 规范表示 vs 人类可读表示 (repr vs str)

![规范表示 vs 人类可读表示 (repr vs str) · 课堂板书演示 (00:01:15)](</attachments/cs61a-bfe38ff9de2e3bee23303bbe.png>)
*⏱ 时间戳：00:01:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)*

### 规范字符串表示：repr

内置函数 `repr(object)` 返回对象的**规范字符串表示（Canonical Representation）**：

![规范字符串表示：repr · 课堂板书演示 (00:02:45)](</attachments/cs61a-bd08283641829c693194933c.png>)
*⏱ 时间戳：00:02:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)*

- **官方契约**：对于大多数内置和常用类型，`eval(repr(object))` 应当求值为一个与原对象等价的新对象。
- **呈现时机**：在交互式 Python REPL 中直接输入表达式回车后，控制台显示的就是该对象经由 `repr()` 处理后的结果。

> **例外情况**：对于诸如内置函数 `min` 或自定义类等无法以单一字面量表达式完全重建的复杂对象，Python 会退而求其次使用角括号形式的代理字符串，如 `<built-in function min>`。

### 人类可读字符串表示：str

内置函数 `str(object)` 返回易于人类阅读的描述：

![人类可读字符串表示：str · 课堂板书演示 (00:04:15)](</attachments/cs61a-52d846317f76cde9d8255168.png>)
*⏱ 时间戳：00:04:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)*

- **目标**：清晰明了、符合常识，无需保证可由 Python 解析器重新求值。
- **呈现时机**：调用 `print(object)` 时，控制台输出的就是对象的 `str()`。

### 经典对比：Fraction (分数类)

![经典对比：Fraction (分数类) · 课堂板书演示 (00:05:45)](</attachments/cs61a-f0799bc72a9c79790e505137.png>)
*⏱ 时间戳：00:05:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)*

```python
from fractions import Fraction

half = Fraction(1, 2)

# repr 返回标准可求值表达式
repr(half)  # 'Fraction(1, 2)'
eval(repr(half)) == half  # True

# str 返回人类习惯的排版形式
str(half)   # '1/2'
print(half) # 控制台输出: 1/2
```

### 字符串对象自身的引号机制

对字符串本身调用 `repr` 与 `str` 体现了微妙而本质的区别：

![字符串对象自身的引号机制 · 课堂板书演示 (00:07:15)](</attachments/cs61a-239e241e09563c9f9f59b299.png>)
*⏱ 时间戳：00:07:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)*

```python
s = "Hello, world"

print(s)        # 输出: Hello, world (str 表现形式，无外层引号)
print(repr(s))  # 输出: 'Hello, world' (repr 带有合法字符串字面量所需的外层引号)

eval(repr(s))   # 得到字符串 "Hello, world"
# 若直接 eval(s)，由于缺少引号会将 Hello 视作变量名而抛出 NameError！
```

---

## 3. F-Strings 与字符串插值 (String Interpolation)

F-string（格式化字符串字面量）是 Python 中最优雅、最高效的字符串插值语法：

![F-Strings 与字符串插值 (String Interpolation) · 课堂板书演示 (00:08:45)](</attachments/cs61a-bf08f1c8dbd17196bdadd634.png>)
*⏱ 时间戳：00:08:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)*

- 前缀字符 `f` 告知解释器执行字符串插值；
- 花括号 `{...}` 内的表达式在**当前环境帧**中动态求值；
- 嵌入结果默认自动调用各个子表达式对象的 `str()` 方法。

![F-Strings 与字符串插值 (String Interpolation) · 课堂板书演示 (00:10:45)](</attachments/cs61a-6042e4b3916166f9e1285b13.png>)
*⏱ 时间戳：00:10:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)*

```python
from math import pi

# 传统拼接 vs f-string
f"pi starts with {pi}..."  # 'pi starts with 3.141592653589793...'

# 花括号内支持任意合法 Python 表达式
f"2 + 2 = {2 + 2}"  # '2 + 2 = 4'
```

### F-Strings 的插值规则与副作用注意点

![F-Strings 的插值规则与副作用注意点 · 课堂板书演示 (00:12:45)](</attachments/cs61a-7ac9c9a5af6a54cfe7fbefcc.png>)
*⏱ 时间戳：00:12:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)*

1. **默认采用 str()**：
   ```python
   half = Fraction(1, 2)
   f"The value is {half}"        # 'The value is 1/2' (采用 str)
   f"The value is {repr(half)}"  # 'The value is Fraction(1, 2)' (显式转 repr)
   ```
2. **表达式按序求值与副作用**：
   ```python
   s = [9, 8, 7]
   # 表达式自左向右严格依次求值
   result = f"{s.pop()}, {s.pop()}, remaining: {s}"
   # result: '7, 8, remaining: [9]'
   ```

---

## 4. 多态函数与接口抽象 (Polymorphic Functions & Interfaces)

**多态函数（Polymorphic Function）** 是指能够作用于多种不同数据类型的通用函数。`repr()` 与 `str()` 就是最典型的多态函数。

![多态函数与接口抽象 (Polymorphic Functions & Interfaces) · 课堂板书演示 (00:14:15)](</attachments/cs61a-e8ff148769f5b960c44008ff.png>)
*⏱ 时间戳：00:14:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)*

### 多态背后的核心机理：委托参数自身

多态函数本身几乎不需要包含复杂的 `if-else` 分支，它只需**向传入的实参对象发送消息**，委托实参决定如何响应：

- `repr(x)` 委托给 `x` 的 `__repr__` 方法；
- `str(x)` 委托给 `x` 的 `__str__` 方法。

### 深入底层：repr 与 str 的安全实现

Python 在底层实现 `repr` 时，会**严格忽略实例属性中的 `__repr__`，只查找类属性中的 `__repr__`**：

![深入底层：repr 与 str 的安全实现 · 课堂板书演示 (00:16:15)](</attachments/cs61a-a1a47bcea5b9348787d2afc3.png>)
*⏱ 时间戳：00:16:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)*

```python
def repr(x):
    """底层模型：忽略实例属性，强制通过类查找方法并显式传入 self 实参。"""
    return type(x).__repr__(x)
```

> **回退机制**：
> 若一个类没有显式定义 `__str__`，调用 `str(x)` 会自动回退调用 `__repr__(x)`。因此，编写自定义类时**优先实现 `__repr__`** 可以同时满足两种需求。

### 什么是接口 (Interface)？

![什么是接口 (Interface)？ · 课堂板书演示 (00:17:45)](</attachments/cs61a-ccc25fe18289c8790352c472.png>)
*⏱ 时间戳：00:17:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)*

**接口**是一组约定的消息（方法名）及其语义规范。
- 只要一个类实现了 `__repr__` 和 `__str__` 方法，它就实现了“字符串表示接口”；
- 这种机制使得 Python 的整个生态系统（REPL、日志、格式化工具）能够无缝处理任何新创建的自定义类型。

---

## 5. 自定义 Ratio 类实战：实现表示接口

实现一个精准的有理数（Ratio）类，展示规范的 `__repr__` 与 `__str__` 编写范式：

![自定义 Ratio 类实战：实现表示接口 · 课堂板书演示 (00:19:35)](</attachments/cs61a-1d7ead302582364b85c63384.png>)
*⏱ 时间戳：00:19:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:19:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)*

```python
class Ratio:
    """表示有理数的类，具有清晰的表示接口。"""
    def __init__(self, n, d):
        self.numer = n
        self.denom = d

    def __repr__(self):
        """返回形如 Ratio(1, 2) 的规范表达式字符串。"""
        return f"Ratio({self.numer}, {self.denom})"

    def __str__(self):
        """返回形如 1/2 的人类可读排版字符串。"""
        return f"{self.numer}/{self.denom}"

half = Ratio(1, 2)
print(repr(half))  # Ratio(1, 2)
print(str(half))   # 1/2
```

---

## 6. 特殊方法与运算符重载 (Special Method Names)

在 Python 中，所有以双下划线开头和结尾的方法统称为**特殊方法（Special Methods / Dunder Methods）**。它们将内置的语言语法映射为类的方法调用。

![特殊方法与运算符重载 (Special Method Names) · 课堂板书演示 (00:21:45)](</attachments/cs61a-be93bf1ff09a573e48cf281d.png>)
*⏱ 时间戳：00:21:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)*

| 特殊方法 | 对应语法 / 内置函数 | 功能语义 |
| :--- | :--- | :--- |
| `__init__(self, ...)` | `Ratio(1, 2)` | 实例构造与初始化 |
| `__repr__(self)` | `repr(x)`, 交互式 REPL | 生成规范 Python 代码字符串 |
| `__str__(self)` | `str(x)`, `print(x)` | 生成用户友好描述字符串 |
| `__bool__(self)` | `bool(x)`, `if x:` | 判定对象的真值条件 |
| `__float__(self)` | `float(x)` | 转换为浮点数值 |
| `__add__(self, other)` | `self + other` | 加法运算符（当前对象在左侧） |
| `__radd__(self, other)` | `other + self` | 反向加法运算符（当前对象在右侧） |

![特殊方法与运算符重载 (Special Method Names) · 课堂板书演示 (00:23:45)](</attachments/cs61a-44d622d20331149e206233e0.png>)
*⏱ 时间戳：00:23:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)*

### 加法运算符重载机理

当求值表达式 `a + b` 时：
1. 优先尝试调用 `type(a).__add__(a, b)`；
2. 若 `a` 未实现该方法或返回 `NotImplemented`，则尝试调用右侧对象的反向加法 `type(b).__radd__(b, a)`。

---

## 7. 类型分发 vs 类型强转 (Type Dispatching vs Type Coercion)

为了让自定义的 `Ratio` 类能够与整数、浮点数混合加法运算，需要处理跨类型交互：

![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:26:15)](</attachments/cs61a-7ba25b2c52f6e9a1e6464c09.png>)
*⏱ 时间戳：00:26:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:26:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)*

![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:28:45)](</attachments/cs61a-4ab03b655e4be046da440068.png>)
*⏱ 时间戳：00:28:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)*

![类型分发 vs 类型强转 (Type Dispatching vs Type Coercion) · 课堂板书演示 (00:30:05)](</attachments/cs61a-394b74ef04223700e635c53f.png>)
*⏱ 时间戳：00:30:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P21 00:30:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)*

### 综合实现代码

```python
def gcd(n, d):
    """欧几里得最大公约数算法。"""
    while d != 0:
        n, d = d, n % d
    return n

class Ratio:
    def __init__(self, n, d):
        g = gcd(n, d)
        self.numer = n // g
        self.denom = d // g

    def __repr__(self):
        return f"Ratio({self.numer}, {self.denom})"

    def __str__(self):
        return f"{self.numer}/{self.denom}"

    def __float__(self):
        return self.numer / self.denom

    def __add__(self, other):
        # 策略 1：类型分发 (Type Dispatching) - 检查类型并采取不同计算逻辑
        if isinstance(other, int):
            n = self.numer + self.denom * other
            return Ratio(n, self.denom)
        elif isinstance(other, Ratio):
            n = self.numer * other.denom + self.denom * other.numer
            d = self.denom * other.denom
            return Ratio(n, d)
        # 策略 2：类型强转 (Type Coercion) - 将自身转为通用类型（float）后再计算
        elif isinstance(other, float):
            return float(self) + other
        return NotImplemented

    # 右加支持：加法满足交换律，直接复用 __add__
    __radd__ = __add__
```

### 两种跨类型设计策略对比

1. **类型分发 (Type Dispatching)**：
   - 通过 `isinstance(other, int)` 探测操作数类型，针对特定类型执行专门的代码路径。
   - **优点**：能够精确保留数学精度（例如 `Ratio(1, 3) + 1` 返回精确的 `Ratio(4, 3)`）。
2. **类型强转 (Type Coercion)**：
   - 当遇到更高阶但不兼容的类型（如 `float`）时，通过 `float(self)` 将本对象转换为该类型后委托给内置浮点数运算。
   - **优点**：通用性高，避免为每一种可能类型编写繁琐的分支。

---

## 8. 章节总结与核心考点

1. **repr vs str 契约**：`repr` 面向程序与排错（尽量可被 `eval`），`str` 面向人类审美；`str` 缺失时自动回退为 `repr`。
2. **方法查找安全规范**：`repr` 与特殊方法查找直接读取 `type(obj)`，杜绝实例属性遮蔽对系统协议的破坏。
3. **接口与多态**：对象系统通过统一的协议命名（Dunder Methods）实现语法与面向对象特性的无缝衔接。

---

