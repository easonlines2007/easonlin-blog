---
kind: notes
source: cs61a/lecture-15
title: "Lecture 15 · Mutability: Aliasing and Persistent Local State"
description: "CS61A Lecture 15: Mutability, object aliasing, and persistent local state."
sourceHash: b8e1cf8ffde61e69bbe1f86ac1c7ada076bb6b832f0a3d6a449ab01d8d94cf7a
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-15).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 37:58 ｜ **Video link back**: [B station response unit set (P15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15)

## 1. Introduction: The metaphor of the object is that it coexists with data and behavior.

In software engineering, **Object**  It is an abstraction mechanism that allows computer data to simulate the behavior of real-world concepts.

### 1.1 Dot Expressions and Methods
It's built into Python.  `datetime`  Modules are:
```python
from datetime import date
today = date(2024, 9, 23)
freedom = date(2024, 12, 13)
days_left = freedom - today  # 输出 81 days
```

![Points expression (Dot Express) and Method (Methods) lecture board illustration (00:01:39)](</attachments/cs61a-5f35b087858d06a905284299.png>)
*⏱ Timestamp: 00:01:39 · 📷 Lecture screenshot · [Watch clip (P15 00:01:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=99)*

- `today.year` Passed by: **Point expression** Visiting the object **Attributes**.
- `today.strftime("%A, %B %d")` Access: A function that binds to an object, called **The method**.
- Although we never told the object that today is Sunday, it naturally behaves in a manner that is computed and shows the week's name.

![The first is the "Dot Expressions" and the "Methods" of the lecture board illustration (00:03:47).](</attachments/cs61a-bed182bc91b9cee186bd614a.png>)
*⏱ Timestamp: 00:03:47 · 📷 Lecture screenshot · [Watch clip (P15 00:03:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=227)*

### 1.2 Functions vs. Objects
- **The first is the "Pure Function".** The first step is to focus on one thing.
- **Object** The following is a list of the most commonly used methods for storing data:  `.upper()`, `.lower()`, `.swapcase()`  The first is the "Special Operations" (SOS) and the second is the "DESKED Operating Method".

![Function vs. Object lecture board illustration (00:05:58)](</attachments/cs61a-9bf9c408e214fcfcc85b1c80.png>)
*⏱ Timestamp: 00:05:58 · 📷 Lecture screenshot · [Watch clip (P15 00:05:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=358)*

> **Important discernment** Calling:  `s.upper()`  I'll get back one. **The whole new big writing string** And the string.  `s`  The content itself has not changed. **Strings are immutable.**.

---

## Character encoding history: from the ASCII 7-bit matrix to the Unicode universe

The computer's bottom can only store 0 and 1, and the text character must be mapped to a number by encoding.

### 2.1 ASCII code (US Standard Code for Exchange of Information)
The ASCII is an early 20th century foundation stone standard for computing:
- **7 bit coding matrix**: 8 rows (3 bit binary) $\times$  16 columns (four-bit binary), supporting a total of 128 characters.
- **The logic of order** The first is the letter "A" (or "B") and the second is the letter 'C'.  `'A'`  It's 65/16  `0x41`, `'a'`  The default ordering rules for modern computer terminal files are 97 .
- **Control of characters** Includes: Going in and out (`LF`, `\n` The printer's boxes (`BEL` The first is the hardware control instructions.

![ASCII Code (US Standard Code for Information Exchange) lecture board illustration (00:07:36)](</attachments/cs61a-0da18ab642f269fb374615cc.png>)
*⏱ Timestamp: 00:07:36 · 📷 Lecture screenshot · [Watch clip (P15 00:07:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=456)*

### 2.2 Unicode is a global unified character set
To cover all human languages and texts worldwide, modern standards use Unicode:
- It has over 109,000 characters and 93 text systems, including various Emoji faces and symbols.
- Each character is assigned a unique metric value (Code Point).  `unicodedata`  The module can be searched in two directions between characters and their full name:
```python
from unicodedata import lookup, name
name('A')                   # 'LATIN CAPITAL LETTER A'
lookup('SMILING FACE WITH OPEN MOUTH')  # '😃'
```

![Unicode Global Unified Character Set lecture board illustration (00:10:21)](</attachments/cs61a-c8380e3fefd2e9ea63b1d802.png>)
*⏱ Timestamp: 00:10:21 · 📷 Lecture screenshot · [Watch clip (P15 00:10:21)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=621)*

---

## 3. mutable The birth of sex: the evolution of poker and the mutation of the list

So far, all the data we've come across -- numbers, bullet values, strings, custom ratios -- is unchangeable after a string has been created. But in the real world, things always change over time.

Professor DeNero introduced the example of a millennium-scale change in card color Suits. **In-Place Mutation is a type of mutation.**: 

![mutable The birth of sex: the evolution of poker and the mutation of the list. lecture board illustration (00:13:49)](</attachments/cs61a-b833a5e765c06b5bc56516ce.png>)
*⏱ Timestamp: 00:13:49 · 📷 Lecture screenshot · [Watch clip (P15 00:13:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=829)*

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

The first variable to be checked is:
```python
original_suits  # 输出: ['heart', 'diamond', 'spade', 'club'] !
```

---

## 4. Key phenomena in the environment model: aliasing

Why Change  `suits`  It will lead to  `original_suits`  What is the same change?

![environment model I'm not sure what I'm talking about. lecture board illustration (00:16:02)](</attachments/cs61a-cf33f5333d9c6260bf12e930.png>)
*⏱ Timestamp: 00:16:02 · 📷 Lecture screenshot · [Watch clip (P15 00:16:02)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=962)*

```
Global frame
  suits          ───┐
                    ├───► [ heart | diamond | spade | club ]
  original_suits ───┘     (同一个堆内存列表对象)
```

1. The following is a list of words that can be used:  `original_suits = suits` **No new lists were created** It just goes by the name!  `original_suits`  Pointing to  `suits`  The same memory object that is currently referenced.
2. This phenomenon is called the "closing" of memory when two or more variables refer to the same object in memory. **Aliasing is the name of a group of people.**.
3. **The mutations of the object are synchronized to all references to the object in the context above.**.

---

## 5. dictionary mutable operation with scope penetration

The dictionary is also a typical mutable complex data type:
- **Key changes and additions**: `d[k] = v` (If the key exists, cover the old value; if it doesn't exist, create a new key value)
- **Remove the key**: `d.pop(k)`  Remove the specified key and return the corresponding value.

![mutable operation for dictionary and scope penetrating lecture board illustration (00:18:06)](</attachments/cs61a-c41f3705bac19b9348b8dd6e.png>)
*⏱ Timestamp: 00:18:06 · 📷 Lecture screenshot · [Watch clip (P15 00:18:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1086)*

### side effects mutations in function calls
When a mutable object is entered into a function as an argument, the operation inside the function can directly modify the data objects in the external environment:

```python
four = [1, 2, 3, 4]

def mystery(s):
    s.pop()
    s.pop()

mystery(four)
# four 永久性地变成了 [1, 2]！
```

![Four is forever turned into one, two! lecture board illustration (00:19:44)](</attachments/cs61a-b218474f33bce8f35f548247.png>)
*⏱ Timestamp: 00:19:44 · 📷 Lecture screenshot · [Watch clip (P15 00:19:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1184)*

- Local parameter in the function array  `s`  The recipient is  `four`  The address of the directory.
- `s.pop()`  The first thing that I'm doing is deleting the original memory directly from the stack, without any need for it.  `return`  The first is that the external effects of the **Side Effects**.

---

## 6. immutable sequence: security line of the Tuples

Python provides a data structure to prevent misrepresentation. **The subgroup (`tuple`)**.

### 6.1 Rules of grammar
```python
t = (3, 4, 5, 6)   # 标准括号字面量
t = 3, 4, 5, 6     # 省略括号的逗号表达式也是元组
single = (2,)      # 单元素元组必须带有尾随逗号！(2) 仅仅是带括号的整数 2
```

![Syntax: lecture board illustration (00:21:48)](</attachments/cs61a-7bdf3474a6f0c668592768e0.png>)
*⏱ Timestamp: 00:21:48 · 📷 Lecture screenshot · [Watch clip (P15 00:21:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1308)*

- The subgroup supports all non-destructive sequence operations `len(t)` The index  `t[i]` The pieces.  `t[1:3]`, `in`  Members checked `+`  I'm not sure.
- Trying to execute  `t[0] = 99`  directly raises  `TypeError: 'tuple' object does not support item assignment`.

### 6.2 Shallow Immutability (immutable)
> **Watch out for the dolls.** The group's own pitch cannot be changed, but the team's own position is unchanged. **If the subgroup contains mutable objects (such as a list), the contents of that list can still be mutated.**!

```python
t = (1, [2, 3])
t[1].append(4)  # 合法！
# t 变为 (1, [2, 3, 4])
```

---

## 7. The watershed of computer philosophy: identity (`is` The same as the equation. `==`)

No, not at all. mutable In the sex world, "the whole is the sum of all its parts." Two data with the same elements are the same data. **mutable breaks this static algebraic equivalence**.

![The divide in computer philosophy: is and equality (==) · lecture board illustration (00:24:24)](</attachments/cs61a-f8806a78c2f3a615bd3aa179.png>)
*⏱ Timestamp: 00:24:24 · 📷 Lecture screenshot · [Watch clip (P15 00:24:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1464)*

![The divide in computer philosophy: is and equality (==) · lecture board illustration (00:26:27)](</attachments/cs61a-cbe6bff8069569decf17facf.png>)
*⏱ Timestamp: 00:26:27 · 📷 Lecture screenshot · [Watch clip (P15 00:26:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1587)*

### 7.1 Core contrast
- **Equal rights `==`)**: Test whether the values of two expressions are **The same content**.
- **The same sex `is`)** Testing whether two expressions are strictly pointed **Same Identity is a memory instance of the same object.**.

![Core comparison lecture board illustration (00:28:34)](</attachments/cs61a-a0ffef445e8c0dc9cd43996f.png>)
*⏱ Timestamp: 00:28:34 · 📷 Lecture screenshot · [Watch clip (P15 00:28:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1714)*

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

## 8. The notorious classic trap: mutable default arguments

In Python interviews and engineering practice, the most common mechanisms that cause hidden bugs are: **mutable default parameters**: 

![The Infamous Classic Trap: mutable Default argument (Mutable Defense Arms) lecture board illustration (00:30:17)](</attachments/cs61a-45ee0bc32d67a26388587723.png>)
*⏱ Timestamp: 00:30:17 · 📷 Lecture screenshot · [Watch clip (P15 00:30:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1817)*

```python
def f(s=[]):
    s.append(5)
    return len(s)

print(f())  # 预期 1，输出 1
print(f())  # 预期 1，输出 2 ？！
print(f())  # 预期 1，输出 3 ？！
```

### Deep dissection of the root traps
- Python is in **Definition of the function time (def statement execution period)**  The evaluation and binding of the default parameter is completed, and the function will be used throughout its life cycle. **Only one time**!
- The default parameter object retains the function's own properties, and every time a parameter omits calling that function, the parameter is  `s`  It's all pointing to **Objects from the same list**!
- Modified specification: Forever used  `None`  The default value is:
```python
def f_safe(s=None):
    if s is None:
        s = []
    s.append(5)
    return len(s)
```

---

## 9. Functional and state intersections: Permanent local states in the closure (`make_withdraw`)

If a function receives the same parameter and returns a result that changes with the number of calls it makes, it is a **Non-purity function with state**.

The following are examples of bank accounts withdrawal:
```python
withdraw = make_withdraw(100)
withdraw(25)  # 返回 75
withdraw(25)  # 返回 50
withdraw(60)  # 返回 '余额不足'
```

![Intersection of function with state: Enduring local state (make\_withlaw) lecture board illustration (00:32:26) in closure](</attachments/cs61a-77ab0ca7f2f2c1621f2c5549.png>)
*⏱ Timestamp: 00:32:26 · 📷 Lecture screenshot · [Watch clip (P15 00:32:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=1946)*

### 9.1 Create a permanent state using closure and mutable lists
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

![Build lecture board illustration (00:36:44) with closure and mutable lists](</attachments/cs61a-c4461536c8a3718a98b3d4c8.png>)
*⏱ Timestamp: 00:36:44 · 📷 Lecture screenshot · [Watch clip (P15 00:36:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=15&t=2204)*

### 9.2 environment model Run Details
1. execute  `withdraw = make_withdraw_list(100)`: 
   - Create partial frame  `f1`, binding  `balance = 100`  and lists  `b = [100]`.
   - Returns the internal function  `withdraw` The parent rod is permanently locked to  `f1`.
2. First call  `withdraw(25)`: 
   - Create partial frame  `f2`, the parent frame is  `f1`.
   - In the name of my father  `f1`  found  `b` The original modification  `b[0] = 75`, return  `75`.
3. Second call  `withdraw(25)`: 
   - Create partial frame  `f3`, whose parent frame remains  `f1`.
   - I'm not sure.  `f1`  I saw  `b[0]`  It's been changed since last time.  `75` Cut it again!  `50`.

> **Closure is a micro-object** Through the reference of mutable objects, functions have not only computational logic but also a time-varying memory. This provides the most perfect bridge to the next chapter in full object-oriented programming (OOP).

---

## 10. Key points and thought-provoking topics

### The key rules are refined
1. **mutable Double-edged Sword** The original modification avoided the expense of frequent allocation of new memory, but also broke the loop of reference transparency in a functional hashing, introducing implicit associations that were triggered by other names.
2. **`is`  The pointing, `==`  The number of values** Pieces copied  `s[:]`  The new object will be created `s[:] is s`  For the  `False` (A) and (B)  `y = s`  Just create a new name.
3. **Closure: The secret to maintaining the state** Introduced in Python  `nonlocal`  Before the keyword, a list of single elements is placed in the closure parentheses  `b = [val]` In the case of a cross-scope state, the internal layer function can be configured to modify the cross-space state.

---

### Self-testing after school

#### Exercise 1: Turn the list around
Write a function  `reverse_list(s)`, **The use of snippets is strictly prohibited, new lists are strictly prohibitively banned** The only way to do this is by assigning elements and  `.pop()` / `.insert()`  or double-pointers, to the list of input  `s`  The original reversal:
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

#### Exercise 2: Dictionary compiler
Write a higher-order function  `make_accumulator()` Each time a function is called back and input a key and a numeric value, add up and return the historical cumulative value of that key:
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
The mutabledictionary serves as the perfect key-value state storage in closures!

---

