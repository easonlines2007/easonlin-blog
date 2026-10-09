---
title: Lecture 15 · Mutability (可变性、对象别名与局部持久状态)
description: CS61A 第 15 讲：Mutability (可变性、对象别名与局部持久状态)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 15
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：37:58 ｜ **视频回链**：[B 站对应单集 (P15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15)

## 1. 引言：对象的隐喻——数据与行为的共生

在软件工程中，**对象 (Object)** 是一种使计算机数据能够“模拟真实世界概念行为”的抽象机制。

### 1.1 点表达式 (Dot Expressions) 与方法 (Methods)
以 Python 内置的 `datetime` 模块为例：
```python
from datetime import date
today = date(2024, 9, 23)
freedom = date(2024, 12, 13)
days_left = freedom - today  # 输出 81 days
```

![点表达式 (Dot Expressions) 与方法 (Methods) · 课堂板书演示 (00:01:39)](</attachments/cs61a-5f35b087858d06a905284299.png>)
*⏱ 时间戳：00:01:39 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:01:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=99)*

- `today.year`：通过**点表达式**访问对象的**属性 (Attribute)**。
- `today.strftime("%A, %B %d")`：访问对象绑定的函数，称为**方法 (Method)**。
- 尽管我们从未告诉对象今天是星期几，但对象天然具备计算和展示星期名称的“内在行为”。

![点表达式 (Dot Expressions) 与方法 (Methods) · 课堂板书演示 (00:03:47)](</attachments/cs61a-bed182bc91b9cee186bd614a.png>)
*⏱ 时间戳：00:03:47 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:03:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=227)*

### 1.2 函数 vs. 对象
- **纯函数 (Pure Function)**：专注于做一件事。输入参数，返回确定结果。
- **对象 (Object)**：封装了多种相关联的行为和数据（例如字符串拥有 `.upper()`, `.lower()`, `.swapcase()` 等数十种专用操作方法）。

![函数 vs. 对象 · 课堂板书演示 (00:05:58)](</attachments/cs61a-9bf9c408e214fcfcc85b1c80.png>)
*⏱ 时间戳：00:05:58 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:05:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=358)*

> **重要辨析**：调用 `s.upper()` 会返回一个**全新的大写字符串**，而字符串 `s` 本身的内容并未改变。在 Python 中，**字符串是不可变的 (Immutable)**。

---

## 2. 字符编码简史：从 ASCII 7位矩阵到 Unicode 宇宙

计算机底层只能存储 0 和 1，文本字符必须通过编码映射为数字。

### 2.1 ASCII 码（美国信息交换标准代码）
ASCII 是 20 世纪计算早期的基石标准：
- **7 位编码矩阵**：8 行（3 位二进制）$\times$ 16 列（4 位二进制），共支持 128 个字符。
- **排序逻辑**：大写字母优先于小写字母（例如 `'A'` 是 65 / 十六进制 `0x41`，`'a'` 是 97），这决定了现代计算机终端文件的默认排序规则。
- **控制字符**：包含行进换行 (`LF`, `\n`)、打印机鸣铃 (`BEL`) 等硬件控制指令。

![ASCII 码（美国信息交换标准代码） · 课堂板书演示 (00:07:36)](</attachments/cs61a-0da18ab642f269fb374615cc.png>)
*⏱ 时间戳：00:07:36 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:07:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=456)*

### 2.2 Unicode 全球统一字符集
为了涵盖全球所有人类语言与文字，现代标准采用 Unicode：
- 收录了超过 109,000 个字符、93 种文字系统，甚至包括各种 Emoji 表情与符号。
- 每个字符分配唯一的标量值（Code Point）。通过 `unicodedata` 模块可在字符与其全称之间双向检索：
```python
from unicodedata import lookup, name
name('A')                   # 'LATIN CAPITAL LETTER A'
lookup('SMILING FACE WITH OPEN MOUTH')  # '😃'
```

![Unicode 全球统一字符集 · 课堂板书演示 (00:10:21)](</attachments/cs61a-c8380e3fefd2e9ea63b1d802.png>)
*⏱ 时间戳：00:10:21 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:10:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=621)*

---

## 3. 可变性的诞生：扑克牌演化史与列表原地突变

到目前为止，我们遇到的所有数据（数字、布尔值、字符串、自定义有理数）都是“创建后内容不可更改”的。但在现实世界中，事物总是在随时间演变。

DeNero 教授以纸牌花色（Suits）的千年流变为例引入了**原地突变 (In-Place Mutation)**：

![可变性的诞生：扑克牌演化史与列表原地突变 · 课堂板书演示 (00:13:49)](</attachments/cs61a-b833a5e765c06b5bc56516ce.png>)
*⏱ 时间戳：00:13:49 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:13:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=829)*

```python
suits = ['coin', 'string', 'myriad']  # 亚洲纸牌起源
original_suits = suits

suits.pop()          # 移除末尾 'myriad' -> ['coin', 'string']
suits.remove('string') # 移除 'string' -> ['coin']

suits.append('cup')  # 西班牙传入：追加圣杯
suits.extend(['sword', 'club']) # 批量追加宝剑与短棍
# 当前: ['coin', 'cup', 'sword', 'club']

suits[2] = 'spade'   # 意大利/法国改良：宝剑变为黑桃
suits[0:2] = ['heart', 'diamond'] # 切片替换：硬币与圣杯变为红桃与方块
# 最终现代花色: ['heart', 'diamond', 'spade', 'club']
```

此时若检查最初绑定的变量：
```python
original_suits  # 输出: ['heart', 'diamond', 'spade', 'club'] !
```

---

## 4. 环境模型中的关键异象：别名现象 (Aliasing)

为什么修改 `suits` 会导致 `original_suits` 发生一模一样的改变？

![环境模型中的关键异象：别名现象 (Aliasing) · 课堂板书演示 (00:16:02)](</attachments/cs61a-cf33f5333d9c6260bf12e930.png>)
*⏱ 时间戳：00:16:02 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:16:02)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=962)*

```
Global frame
  suits          ───┐
                    ├───► [ heart | diamond | spade | club ]
  original_suits ───┘     (同一个堆内存列表对象)
```

1. 赋值语句 `original_suits = suits` **没有创建新的列表副本**！它只是将名字 `original_suits` 指向了 `suits` 当前引用的同一个内存对象。
2. 当两个或多个变量名指向内存中的同一对象时，这种现象称为**别名 (Aliasing)**。
3. **对象的突变会同步呈现在所有引用该对象的名称与上下文中**。

---

## 5. 字典的可变操作与作用域穿透

字典同样是典型的可变复合数据类型：
- **键值修改与新增**：`d[k] = v`（若键存在则覆盖旧值；若键不存在则创建新键值对）。
- **键删除**：`d.pop(k)` 移除指定键并返回对应的值。

![字典的可变操作与作用域穿透 · 课堂板书演示 (00:18:06)](</attachments/cs61a-c41f3705bac19b9348b8dd6e.png>)
*⏱ 时间戳：00:18:06 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:18:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1086)*

### 函数调用中的副作用突变
当把一个可变对象作为实参传入函数时，函数内部的操作可以直接修改外部环境中的数据对象：

```python
four = [1, 2, 3, 4]

def mystery(s):
    s.pop()
    s.pop()

mystery(four)
# four 永久性地变成了 [1, 2]！
```

![four 永久性地变成了 「1, 2」！ · 课堂板书演示 (00:19:44)](</attachments/cs61a-b218474f33bce8f35f548247.png>)
*⏱ 时间戳：00:19:44 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:19:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1184)*

- 函数帧中的局部形参 `s` 接收到的是 `four` 所指向的列表地址。
- `s.pop()` 是直接在堆内存的原对象上做切除，无需任何 `return` 即可在外部产生持久的**副作用 (Side Effects)**。

---

## 6. 不可变序列：元组 (Tuples) 的安全防线

为了提供防范误修改的数据结构，Python 提供了**元组 (`tuple`)**。

### 6.1 语法规则
```python
t = (3, 4, 5, 6)   # 标准括号字面量
t = 3, 4, 5, 6     # 省略括号的逗号表达式也是元组
single = (2,)      # 单元素元组必须带有尾随逗号！(2) 仅仅是带括号的整数 2
```

![语法规则 · 课堂板书演示 (00:21:48)](</attachments/cs61a-7bdf3474a6f0c668592768e0.png>)
*⏱ 时间戳：00:21:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:21:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1308)*

- 元组支持所有非破坏性的序列操作（`len(t)`、索引 `t[i]`、切片 `t[1:3]`、`in` 成员检查、`+` 拼接）。
- 试图执行 `t[0] = 99` 将直接引发 `TypeError: 'tuple' object does not support item assignment`。

### 6.2 浅不可变性 (Shallow Immutability)
> **警惕“套娃”**：元组自身的槽位不可更改，但**如果元组内部包含了可变对象（如列表），该列表的内容依然可以被突变**！

```python
t = (1, [2, 3])
t[1].append(4)  # 合法！
# t 变为 (1, [2, 3, 4])
```

---

## 7. 计算机哲学的分水岭：同一性 (`is`) 与相等性 (`==`)

在没有可变性的世界里，“整体就是其所有部分的总和”。两个具有相同元素的数据就是同一份数据。
然而，**可变性打破了这种静态的代数等价性**。

![计算机哲学的分水岭：同一性 (is) 与相等性 (==) · 课堂板书演示 (00:24:24)](</attachments/cs61a-f8806a78c2f3a615bd3aa179.png>)
*⏱ 时间戳：00:24:24 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:24:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1464)*

![计算机哲学的分水岭：同一性 (is) 与相等性 (==) · 课堂板书演示 (00:26:27)](</attachments/cs61a-cbe6bff8069569decf17facf.png>)
*⏱ 时间戳：00:26:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:26:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1587)*

### 7.1 核心对比
- **相等性 (`==`)**：测试两个表达式求出的值是否具有**相同的内容**。
- **同一性 (`is`)**：测试两个表达式是否严格指向**内存中的同一个对象实例 (Same Identity)**。

![核心对比 · 课堂板书演示 (00:28:34)](</attachments/cs61a-a0ffef445e8c0dc9cd43996f.png>)
*⏱ 时间戳：00:28:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:28:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1714)*

```python
a = [10]
b = [10]

a == b  # True  (内容完全一样)
a is b  # False (堆内存中独立开辟的两个不同列表)

c = b
c is b  # True  (别名，完全相同的对象)

b.append(20)
# a 依然是 [10]
# b 和 c 都变成了 [10, 20]！
```

---

## 8. 臭名昭著的经典陷阱：可变默认实参 (Mutable Default Arguments)

在 Python 面试与工程实践中，最常引起隐蔽 Bug 的机制莫过于**可变默认参数**：

![臭名昭著的经典陷阱：可变默认实参 (Mutable Default Arguments) · 课堂板书演示 (00:30:17)](</attachments/cs61a-45ee0bc32d67a26388587723.png>)
*⏱ 时间戳：00:30:17 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:30:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1817)*

```python
def f(s=[]):
    s.append(5)
    return len(s)

print(f())  # 预期 1，输出 1
print(f())  # 预期 1，输出 2 ？！
print(f())  # 预期 1，输出 3 ？！
```

### 陷阱根源深度剖析
- Python 在**定义函数时 (def 语句执行期)** 就完成了默认形参的求值与绑定，且在函数的整个生命周期内**只分配一次**！
- 默认参数对象保存在函数自身的属性中，每次省略参数调用该函数时，形参 `s` 都会指向**同一个列表对象**！
- 修正规范：永远使用 `None` 作为默认值：
```python
def f_safe(s=None):
    if s is None:
        s = []
    s.append(5)
    return len(s)
```

---

## 9. 函数式与状态的交融：闭包中的持久局部状态 (`make_withdraw`)

如果一个函数在接受相同参数时，返回的结果会随调用次数而改变，它就是一个**有状态的非纯函数**。

以银行账户取款为例：
```python
withdraw = make_withdraw(100)
withdraw(25)  # 返回 75
withdraw(25)  # 返回 50
withdraw(60)  # 返回 '余额不足'
```

![函数式与状态的交融：闭包中的持久局部状态 (make_withdraw) · 课堂板书演示 (00:32:26)](</attachments/cs61a-77ab0ca7f2f2c1621f2c5549.png>)
*⏱ 时间戳：00:32:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:32:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1946)*

### 9.1 利用闭包与可变列表构建持久状态
```python
def make_withdraw_list(balance):
    """利用列表的可变性在闭包父帧中维护局部持久余额。"""
    b = [balance]
    def withdraw(amount):
        if amount > b[0]:
            return 'Insufficient funds'
        b[0] = b[0] - amount
        return b[0]
    return withdraw
```

![利用闭包与可变列表构建持久状态 · 课堂板书演示 (00:36:44)](</attachments/cs61a-c4461536c8a3718a98b3d4c8.png>)
*⏱ 时间戳：00:36:44 · 📷 课堂截图 · [在 B 站观看对应片段 (P15 00:36:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=2204)*

### 9.2 环境模型运行细节
1. 执行 `withdraw = make_withdraw_list(100)`：
   - 创建局部帧 `f1`，绑定 `balance = 100` 以及列表 `b = [100]`。
   - 返回内部函数 `withdraw`，其父帧指针永久锁定为 `f1`。
2. 第一次调用 `withdraw(25)`：
   - 创建局部帧 `f2`，父帧为 `f1`。
   - 在父帧 `f1` 找到 `b`，原地修改 `b[0] = 75`，返回 `75`。
3. 第二次调用 `withdraw(25)`：
   - 创建局部帧 `f3`，父帧仍为 `f1`。
   - 此时在 `f1` 看到的 `b[0]` 已经是上次修改后的 `75`！再次扣减得 `50`。

> **闭包即微型对象**：通过可变对象的引用穿透，函数不仅拥有了计算逻辑，更拥有了随时间演进的“记忆力”。这为下一章全面进入面向对象编程（OOP）奠定了最完美的桥梁。

---

## 10. 本讲核心要点与思考题

### 重点法则提炼
1. **可变性的双刃剑**：原地修改避免了频繁分配新内存的开销，但也打破了“函数式引用透明性”，引入了别名引发的隐式关联。
2. **`is` 测指针，`==` 测数值**：切片复制 `s[:]` 会产生新对象（`s[:] is s` 为 `False`），而单纯赋值 `y = s` 仅仅创建别名。
3. **闭包维持状态的秘诀**：在 Python 引入 `nonlocal` 关键字之前，通过在闭包父帧中放置单元素列表 `b = [val]`，内层函数即可合规修改跨作用域状态。

---

### 课后自测练习

#### 练习 1：列表原地翻转
编写函数 `reverse_list(s)`，**严禁使用切片、严禁创建新列表**，仅通过元素赋值与 `.pop()` / `.insert()` 或双指针交换，将传入的列表 `s` 原地反转：
```python
def reverse_list(s):
    """
    >>> s = [1, 2, 3, 4]
    >>> reverse_list(s)
    >>> s
    [4, 3, 2, 1]
    """
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left, right = left + 1, right - 1
```

#### 练习 2：字典累加器
编写一个高阶函数 `make_accumulator()`，每次调用返回的函数并传入一个键和一个数值时，累加并返回该键的历史累计值：
```python
def make_accumulator():
    """
    >>> acc = make_accumulator()
    >>> acc('apple', 10)
    10
    >>> acc('apple', 5)
    15
    >>> acc('banana', 20)
    20
    """
    history = {}
    def accumulate(key, value):
        history[key] = history.get(key, 0) + value
        return history[key]
    return accumulate
```
可变字典在闭包中充当了完美的键值状态仓储！

---

