---
kind: notes
source: cs61a/lecture-21
title: "Lecture 21 · Representation: Objects and Polymorphic Interfaces"
description: "CS61A Lecture 21: Object representation and polymorphic interfaces."
sourceHash: adca7eeb53bd353d510060f20a05583d51e589a945cb24935e7b27967ad06446
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 30:31 ｜ **Video link back**: [B station response unit set (P21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21)

## 1. Core mind model and architecture

One of the core principles of object-oriented metaphor is: **The object must be represented as the real data it represents** The key ability is that objects must be able to sequence or format themselves into strings.

In Python, string representations are explicitly broken down into two forms for different audiences:

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

In addition, Python is also available.  **The first is the "Special Methods" (Dunder Methods).**  The syntax and the underlying message-transmission relationships are established so that custom classes can gracefully support operator overloads such as:  `+` The first is the "Bull conversion" and the type distribution.

---

## 2. Specification representation vs human readability representation (repr vs str)

![Normative expression vs human readable expression (repr vsstr) lecture board illustration (00:01.15)](</attachments/cs61a-bfe38ff9de2e3bee23303bbe.png>)
*⏱ Timestamp: 00:01:15 · 📷 Lecture screenshot · [Watch clip (P21 00:01:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=75)*

### The string specification is repr.

Built-in function  `repr(object)`  The object returned **The standard string represents canonical representation**: 

![The standard string is represented by: repr · lecture board illustration (00:02:45)](</attachments/cs61a-bd08283641829c693194933c.png>)
*⏱ Timestamp: 00:02:45 · 📷 Lecture screenshot · [Watch clip (P21 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=165)*

- **Official contract** The most commonly used type is the built-in. `eval(repr(object))`  Evaluation should be a new object equal to the original object.
- **Presentation of the timing**: Enter expression directly in the interactive PythonREPL and return to the car, the console shows the object by  `repr()`  The results of the treatment.

> **Exceptions** For example, for built-in functions:  `min`  Or complex objects that cannot be completely reconstructed with a single cubic expression, such as custom classes, which Python retracts and requests for proxy strings in the form of angular brackets, such as  `<built-in function min>`.

### The human-readable string is:str

Built-in function  `str(object)`  The following is a description of the human condition:

![Human readable string indicates:str lecture board illustration (00:04:15)](</attachments/cs61a-52d846317f76cde9d8255168.png>)
*⏱ Timestamp: 00:04:15 · 📷 Lecture screenshot · [Watch clip (P21 00:04:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=255)*

- **The Goals**: Clear, common sense, no guarantee that evaluation can be re-established by Python solver.
- **Presentation of the timing** Calling:  `print(object)`  The output of the controller is the object.  `str()`.

### A Comparison: The Fraction Class

![The first is the "Classic Contrast: Fraction" (number class) and the lecture board illustration (00:05:45).](</attachments/cs61a-f0799bc72a9c79790e505137.png>)
*⏱ Timestamp: 00:05:45 · 📷 Lecture screenshot · [Watch clip (P21 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=345)*

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

### String objects themselves are quoted mechanisms

Calling the string itself  `repr`  and  `str`  The following is a list of the most common types of cancer:

![String object's own quote mechanism lecture board illustration (00:07:15)](</attachments/cs61a-239e241e09563c9f9f59b299.png>)
*⏱ Timestamp: 00:07:15 · 📷 Lecture screenshot · [Watch clip (P21 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=435)*

```python
s = "Hello, world"

print(s)        # 输出: Hello, world (str 表现形式，无外层引号)
print(repr(s))  # 输出: 'Hello, world' (repr 带有合法字符串字面量所需的外层引号)

eval(repr(s))   # 得到字符串 "Hello, world"
# 若直接 eval(s)，由于缺少引号会将 Hello 视作变量名而抛出 NameError！
```

---

## 3. F-Strings with String Interpolation

F-string (formatted string size) is the most elegant and efficient string insertion syntax in Python:

![F-Strings and String Interpolation · lecture board illustration (00:08:45)](</attachments/cs61a-bf08f1c8dbd17196bdadd634.png>)
*⏱ Timestamp: 00:08:45 · 📷 Lecture screenshot · [Watch clip (P21 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=525)*

- The front-end characters  `f`  Informs interpreter to execute string plug-in values;
- The flower brackets  `{...}`  The expression in the **Current environment frame** Dynamic evaluation;
- The embedded results automatically call each subexpression object by default.  `str()`  The way.

![F-Strings and String Interpolation · lecture board illustration (00:10:45)](</attachments/cs61a-6042e4b3916166f9e1285b13.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P21 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=645)*

```python
from math import pi

# 传统拼接 vs f-string
f"pi starts with {pi}..."  # 'pi starts with 3.141592653589793...'

# 花括号内支持任意合法 Python 表达式
f"2 + 2 = {2 + 2}"  # '2 + 2 = 4'
```

### F-Strings's rule of thumb and side effects

![The rules of insertion and side effects of F-Strings · lecture board illustration (00:12:45)](</attachments/cs61a-7ac9c9a5af6a54cfe7fbefcc.png>)
*⏱ Timestamp: 00:12:45 · 📷 Lecture screenshot · [Watch clip (P21 00:12:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=765)*

1. **The default is str ().**: 
   ```python
   half = Fraction(1, 2)
   f"The value is {half}"        # 'The value is 1/2' (采用 str)
   f"The value is {repr(half)}"  # 'The value is Fraction(1, 2)' (显式转 repr)
   ```
2. **expression by sequence evaluation and side effects**: 
   ```python
   s = [9, 8, 7]
   # 表达式自左向右严格依次求值
   result = f"{s.pop()}, {s.pop()}, remaining: {s}"
   # result: '7, 8, remaining: [9]'
   ```

---

## Multi-state Functions and Interfaces abstraction (Polymorphic finances & Interfaces)

**The function is called the polymorphism function.**  It refers to a general function that can work on multiple different data types. `repr()`  and  `str()`  The most typical polymorphism function.

![Multistate Functions and Interfaces abstraction (Polymorphic Finances & Interfaces) . lecture board illustration (00:14:15)](</attachments/cs61a-e8ff148769f5b960c44008ff.png>)
*⏱ Timestamp: 00:14:15 · 📷 Lecture screenshot · [Watch clip (P21 00:14:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=855)*

### The core mechanism behind polymorphism: entrusting the parameters themselves

The polymorphism function itself does not need to contain complex  `if-else`  The branch, it just needs **It's coming in. argument Can not open message** The Commissioner's argument decides how to respond:

- `repr(x)`  It was given to  `x`  of  `__repr__`  The method;
- `str(x)`  It was given to  `x`  of  `__str__`  The way.

### Deep bottom: security implementation of repr and str

Python is implemented at the bottom  `repr`  It will. **Strictly ignores instance attribute  `__repr__` Find only in the class attribute  `__repr__`**: 

![Deep down: repr and sp secure lecture board illustration (00:16:15)](</attachments/cs61a-a1a47bcea5b9348787d2afc3.png>)
*⏱ Timestamp: 00:16:15 · 📷 Lecture screenshot · [Watch clip (P21 00:16:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=975)*

```python
def repr(x):
    """底层模型：忽略实例属性，强制通过类查找方法并显式传入 self 实参。"""
    return type(x).__repr__(x)
```

> **The mechanism of withdrawal** If a class is not explicitly defined  `__str__` Calling  `str(x)`  It'll automatically return calls.  `__repr__(x)` So when writing a custom class, **Priority for implementation  `__repr__`**  It is possible to meet both needs at the same time.

### What is Interface?

![What is Interface? · lecture board illustration (00:17:45)](</attachments/cs61a-ccc25fe18289c8790352c472.png>)
*⏱ Timestamp: 00:17:45 · 📷 Lecture screenshot · [Watch clip (P21 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1065)*

**Interface** The term "method" is used to describe a set of agreed messages (method names) and their semantic specification.
- If a class is realized  `__repr__`  and  `__str__`  The method, which implements the string representation interface;
- This mechanism allows the entire Python ecosystem (REPL, logs, formatting tools) to handle any newly created custom types without a problem.

---

## 5. Implementing Representation Interfaces in a Custom Ratio Class

The first is the use of a rational ratio to show that the normative  `__repr__`  and  `__str__`  programming pattern:

![Custom Ratio type of field: Accomplishment expression interface lecture board illustration (00:19:35)](</attachments/cs61a-1d7ead302582364b85c63384.png>)
*⏱ Timestamp: 00:19:35 · 📷 Lecture screenshot · [Watch clip (P21 00:19:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1175)*

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

## Special Method Names and Operator Loadings

In Python, all methods that begin and end with double-down lines are called **The first is the "Special Methods" (Dunder Methods).** They map the built-in language grammar as a class call method.

![Special Method Names and Operator (Special Method Names) · lecture board illustration (00:21:45)](</attachments/cs61a-be93bf1ff09a573e48cf281d.png>)
*⏱ Timestamp: 00:21:45 · 📷 Lecture screenshot · [Watch clip (P21 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1305)*

| Special methods | Conversational grammar / built-in function | Functional meaning |
| :--- | :--- | :--- |
| `__init__(self, ...)` | `Ratio(1, 2)` | Example building and initiation |
| `__repr__(self)` | `repr(x)` The first is the interactive REPL. | Generate a standard Python code string |
| `__str__(self)` | `str(x)`, `print(x)` | Generate user-friendly description of strings |
| `__bool__(self)` | `bool(x)`, `if x:` | The true value of the object |
| `__float__(self)` | `float(x)` | Convert to floating-point numerals |
| `__add__(self, other)` | `self + other` | Add operator (current object on left) |
| `__radd__(self, other)` | `other + self` | Inverse Add operator (current object on right) |

![Special Method Names and Operator (Special Method Names) · lecture board illustration (00:23:45)](</attachments/cs61a-44d622d20331149e206233e0.png>)
*⏱ Timestamp: 00:23:45 · 📷 Lecture screenshot · [Watch clip (P21 00:23:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1425)*

### The Gafa operator reload mechanism

When evaluation expression  `a + b`  When:
1. Try to call first  `type(a).__add__(a, b)`; 
2. If  `a`  Not implemented or returned  `NotImplemented` The right-hand side of the object is called a reverse-factored graph.  `type(b).__radd__(b, a)`.

---

## 7. Type Dispatching vs. Type Coercion

The first is the self-definition.  `Ratio`  Classes can be combined with integers, floating-point operations and interact across types:

![Type-distributed vs-strength (Type Dispatching vs Type Coercion) lecture board illustration (00:26:15)](</attachments/cs61a-7ba25b2c52f6e9a1e6464c09.png>)
*⏱ Timestamp: 00:26:15 · 📷 Lecture screenshot · [Watch clip (P21 00:26:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1575)*

![Type Dispatching vs. Type Coercion (Types of dispatching vs type coercion) · lecture board illustration (00:28:45)](</attachments/cs61a-4ab03b655e4be046da440068.png>)
*⏱ Timestamp: 00:28:45 · 📷 Lecture screenshot · [Watch clip (P21 00:28:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1725)*

![Type Dispatching vs Type Coercion (LED) · lecture board illustration (00:30:05)](</attachments/cs61a-394b74ef04223700e635c53f.png>)
*⏱ Timestamp: 00:30:05 · 📷 Lecture screenshot · [Watch clip (P21 00:30:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=21&t=1805)*

### Integrated code implementation

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

### The difference between the two types of design strategies

1. **Type Dispatching**: 
   - The  `isinstance(other, int)`  Detecting operand types, executing specific code paths for specific types.
   - **The advantages** The first is that the students are able to maintain their mathematical accuracy.  `Ratio(1, 3) + 1`  The answer is:  `Ratio(4, 3)`).
2. **The first is the type of force (Type Coercion).**: 
   - When you encounter higher-order but incompatible types such as:  `float` The Commission is also responsible for the  `float(self)`  The object is then converted to the type and assigned to a built-in floating-point number operation.
   - **The advantages** High versatility: avoiding the overwhelming branches for each possible type.

---

## Chapter 8 Summary and Core Points

1. **The contract is repr vs str**: `repr`  The first is that the system can be used to solve problems.  `eval`), `str`  The human aesthetic; `str`  The first is the automatic return of the missing.  `repr`.
2. **How to find safety standards**: `repr`  Direct reading with special methods  `type(obj)` The default instance attribute is the default instance attribution, which prevents the destruction of system protocols.
3. **Interfaces and polymorphism** Objective systems are named using a unified protocol called Dunder Methods to achieve uninterrupted syntax and object-oriented properties.

---

