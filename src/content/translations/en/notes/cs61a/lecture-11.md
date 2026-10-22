---
kind: notes
source: cs61a/lecture-11
title: "Lecture 11 · Sequences: Lists and List Comprehensions"
description: "CS61A Lecture 11: Sequences, lists, and list comprehensions."
sourceHash: 017e3adbaf1029f4b0bd93567a27a92fec062c454e38c268ec77da08e2a7eb9d
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-11).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 22:15 ｜ **Video link back**: [B station response unit set (P11)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11)

## 1. Introduction: Combining data with sequential abstraction

In the previous few sessions, our main operations were basic metric data (such as integers, floating-point numbers, Boolean values) and function objects. However, real world problems often involve batching, orderly data collection.

> **The following is a list of the most common types of searches.** A sequence of elements with a clear preceding order.  
> The sequence has two fundamental behavioral characteristics:
> 1. **The length of the line** The sequence contains a limited number of elements:  `len(s)`  I'm not sure what to do.
> 2. **Selection of elements** The first is the  $0$  The only positioning element of the starting integer index is  `s[i]`  I'm not sure what to do.

In Python, the code is **List of the lists `list`)**  It is the most commonly used type of built-in general sequence.

---

## 2. List base: construction, indexing deviations and combined operations

### 2.1 List volume and index deviation concepts
List by square brackets  `[...]`  The first is the creation of a comma separating elements:
```python
odds = [1, 3, 5, 7]
```

![List Font Volume and Index Diversion Concept . lecture board illustration (00:00:34)](</attachments/cs61a-c6826fa6e52ca2ae31040fe4.png>)
*⏱ Timestamp: 00:00:34 · 📷 Lecture screenshot · [Watch clip (P11 00:00:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=34)*

Professor DeNero emphasizes the creation of a mind model for the indexing of calories:
- The index is not a mere string numbered string, but rather a string of numbers. **Offset from the beginning of a sequence**.
- The deviation is  `0` The first element in the sequence is at the beginning of the sequence.
- The last active element index is constant  `len(s) - 1`.

### 2.2 NEMOS evaluation and operator mapping
The list can contain not only literal values, but also any legitimate Python expression within the square brackets and in the index position:
```python
odds = [1, 3, 5, 7]
diff = odds[3] - odds[2]  # 7 - 5 = 2
val = odds[diff]          # odds[2] -> 5
```

![Embedded evaluation and operator Map lecture board illustration (00:01:51)](</attachments/cs61a-8934723ceb93c85fea59ff70.png>)
*⏱ Timestamp: 00:01:51 · 📷 Lecture screenshot · [Watch clip (P11 00:01:51)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=111)*

Python also provides  `operator`  The function call for the equation in the module:
- `s[i]`  The strict equivalent of  `operator.getitem(s, i)`.

### 2.3 Spelling and repetition of lists
The list supports the creation of longer new lists by adding and multiplying operators:
- **`+`  (Picture from the original film)** The following is a list of the elements that are added to the list:
- **`*`  (Repeat)** The following is the list of the most commonly used names for a given number of people:

```python
digits = [1, 8, 2, 8]
combined = [2, 7] + digits * 2
# 结果: [2, 7, 1, 8, 2, 8, 1, 8, 2, 8]
```

![Result: " 2, 7, 1, 8, 8, 1, 8, 2, 8" lecture board illustration (00:02:24)](</attachments/cs61a-a6918f57f125e4778ce5eff1.png>)
*⏱ Timestamp: 00:02:24 · 📷 Lecture screenshot · [Watch clip (P11 00:02:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=144)*

### 2.4 Netting lists and two-dimensional indexing
The elements of the list can be any type, including the list itself:
```python
pairs = [[10, 20], [30, 40]]
```
`pairs[1]`  evaluation is given in the sublist  `[30, 40]` The second level of indexation is followed by  `pairs[1][0]`  That's the whole number.  `30`.

![Embedded List and Multi-Drive Index lecture board illustration (00:02:56)](</attachments/cs61a-b496834208288130a346badb.png>)
*⏱ Timestamp: 00:02:56 · 📷 Lecture screenshot · [Watch clip (P11 00:02:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=176)*

---

## 3. Container membership testing: `in`  and  `not in`

Python provides a built-in silicon operator to check whether a value exists in the container:

```python
digits = [1, 8, 2, 8]
1 in digits      # True
8 in digits      # True (出现多次无妨，只要存在即可)
5 in digits      # False
5 not in digits  # True (等价于 not (5 in digits))
```

![Container membership test: in and not in lecture board illustration (00:04:27)](</attachments/cs61a-1bb9b1a235d9594202886cd2.png>)
*⏱ Timestamp: 00:04:27 · 📷 Lecture screenshot · [Watch clip (P11 00:04:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=267)*

### Core operating rules and crater avoidance guidelines
1. **Strict equality checks**: `'1' in digits`  For the  `False` Because the string  `'1'`  It's not equal to the whole number.  `1`.
2. **Single-element matching rather than subsequence search**: `[1, 8] in digits`  For the  `False`.`in`  It does not look for sub-sequence clips in the list, it only looks at the top element to determine if they are exactly equal to the target.
3. **Low-level search** If the list has multiple layers of nesting, `in`  The top layer is only matched with the direct element, and does not go downward in depth by recursion.

![The main operating rules and crater avoidance guides are given by the lecture board illustration (00:05:32)](</attachments/cs61a-f8f05655b290bb293407b64f.png>)
*⏱ Timestamp: 00:05:32 · 📷 Lecture screenshot · [Watch clip (P11 00:05:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=332)*

---

## 4. From  `while`  to  `for` Sequence: sequential iteration of statements and environment model mechanisms

### 4.1 Motivation: to use  `while`  The series of events
So let's say we need to write a function.  `count(s, value)`, statistical value  `value`  In sequence  `s`  The frequency of occurrence:

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
In this implementation, maintain the sub-scale variable  `index` The increase is obvious.  `index += 1`  and border checks  `index < len(s)`  It is purely machine-recorded code, unrelated to the core business logic.

![Motivation: The cumbersome lecture board illustration with the time of the series (00:07:49)](</attachments/cs61a-d9d9dabe493044ca597cbdfa.png>)
*⏱ Timestamp: 00:07:49 · 📷 Lecture screenshot · [Watch clip (P11 00:07:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=469)*

### 4.2 `for`  The origin of statements and the structure of their syntax
Python provides control statements that are specifically designed to navigate through sequences:
```python
def count(s, value):
    total = 0
    for element in s:
        if element == value:
            total += 1
    return total
```

### 4.3 `for`  Execute the semantics in an environment model
The interpreter executes the following code:
```python
for <name> in <expression>:
    <suite>
```
1. First, evaluation is the first expression  `<expression>` The object is the sequence of a sequence (or iterable object).
2. For each element in the sequence:
   - I will  `<name>` **Current Frame is a current framework for executing an environment.**  In the middle **Note: `for`  The phrase will not introduce any new ideas!**).
   - Execute the sentence body  `<suite>`.
3. After the cycle ends, the cycle is variable  `<name>`  The value of the last element in the sequence is still retained in the current string.

![For the operative semantic of the statement in environment model lecture board illustration (00:09:56)](</attachments/cs61a-73ce73ecae22db38fc571511.png>)
*⏱ Timestamp: 00:09:56 · 📷 Lecture screenshot · [Watch clip (P11 00:09:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=596)*

---

## 5. Matching patterns of sequence unpacking

If the sequence contains a fixed length sub-sequence (e.g., a binary group or a list of binary elements), we can use  `for`  Directly to the head **Multi-variable unpacking**: 

```python
pairs = [[1, 2], [2, 2], [3, 2], [4, 4]]
same_count = 0

for x, y in pairs:
    if x == y:
        same_count += 1
```

![Sequence Unpacking (Sequence Unpacking) lecture board illustration (00:11:58)](</attachments/cs61a-a6275c9dc31fcb14f30ff67d.png>)
*⏱ Timestamp: 00:11:58 · 📷 Lecture screenshot · [Watch clip (P11 00:11:58)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=718)*

In each iteration, Python automatically performs similar multipurpose assignments: `x, y = pair` The Commission has already taken a number of steps to address the  `pair[0]`  and  `pair[1]`  The code of the sample.

---

## 6. The whole sequence: `range`  The philosophy of the half-open and half-closed

When we need continuous integers, we don't have to manually write a list of large numbers, but instead use special sequence type brackets. **`range`**.

### 6.1 Left closed right open  $[start, end)$  Design aesthetics in the space
```python
r = range(-2, 2)
```
Mathematically, the range contains strictly left-handed endpoints but not right-handed: $\{-2, -1, 0, 1\}$.

![Left closed right open "start, end" design aesthetics between the lecture board illustration (00:13:33)](</attachments/cs61a-a9e37a38819e2b359dccb4e0.png>)
*⏱ Timestamp: 00:13:33 · 📷 Lecture screenshot · [Watch clip (P11 00:13:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=813)*

Why is Python designed to open from left-to-right?
1. **Intuitive calculation of length** The sequence length is equal to  `end - start` For example,  $2 - (-2) = 4$ And the whole thing is four integers inside, and there's no need for that.  $+1$  or  $-1$  The shift adjustment.
2. **The difference between the two is that they are not connected.** If you divide the gap by half, just select the middle point.  $k$ The  `range(a, k)`  and  `range(k, b)`  The two are closely connected, never creating overlapping elements or spaces.
3. **The number from 0 is a natural match.** The first is that the world is not going to be able to see it. `range(n)`  Default from  $0$  Starting with  $0, 1, \dots, n-1$ The number of times it is written in the same way as the length.  $n$  The list of all the valid sub-labels corresponds perfectly!

### 6.2 Inertia and List Constructors (`list(...)`)
`range`  The object itself is not a list, it only records in memory.  `start`, `stop`, `step`  The rules, on-demand computing elements, save a lot of space. If you need to symbolize them as a real list, you can call the built-in constructor.  `list()`: 
```python
list(range(5, 8))  # [5, 6, 7]
list(range(4))     # [0, 1, 2, 3]
```

![Inertity and List constructor(list(...)) lecture board illustration (00:15:32)](</attachments/cs61a-9edf51fa75cf4cd106d7a34f.png>)
*⏱ Timestamp: 00:15:32 · 📷 Lecture screenshot · [Watch clip (P11 00:15:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=932)*

### 6.3 Use of the positioning indicator  `_`
When we only want to repeat a fixed number of times an operation and there is no need for the value of a circular variable, communities typically use a subline.  `_`  The name of the variable is:
```python
for _ in range(3):
    print("Go Bears")
```
This sends a clear message to those who read the code: **The variable in the loop is not concerned with the**.

![Usual placeholder \_ lecture board illustration (00:17:45)](</attachments/cs61a-be9566fd4563b5f6b0442647.png>)
*⏱ Timestamp: 00:17:45 · 📷 Lecture screenshot · [Watch clip (P11 00:17:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1065)*

---

## 7. upgrading of expression: list comprehensions

List comprehension is a powerful form of compilation introduced by Python, which draws on modern functional languages such as Haskell, and corresponds to the mathematical framework of the programming language. **Set-Builder Notation is a set of constructions that are not in the same order as sets.**: 
$$\{f(x) \mid x \in S \land P(x)\}$$

### 7.1 Mapping language
```python
odds = [1, 3, 5, 7, 9]
evens = [x + 1 for x in odds]
# [2, 4, 6, 8, 10]
```
Yes, I did.  `odds`  Each element in it  `x` evaluation expression  `x + 1` The results are collected in a new list.

![lecture board illustration (00:19:26)](</attachments/cs61a-1fdaa15067b5a7899b7945f5.png>)
*⏱ Timestamp: 00:19:26 · 📷 Lecture screenshot · [Watch clip (P11 00:19:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1166)*

### 7.2 Filtering language
Added at the end of the derivative  `if <condition>` The following elements can be selected to meet specific conditions:
```python
# 仅保留能够整除 25 的数
[x for x in odds if 25 % x == 0]
# 结果: [1, 5]

# 组合映射与过滤：
[x + 1 for x in odds if 25 % x == 0]
# 结果: [2, 6]
```

![The result: "2, 6" · lecture board illustration (00:20:31)](</attachments/cs61a-2e310844c6baaf210438e76a.png>)
*⏱ Timestamp: 00:20:31 · 📷 Lecture screenshot · [Watch clip (P11 00:20:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1231)*

---

## 8. Application: Finding All Factors of a Positive Integer (`divisors`)

Use of the  `range`  Combined with the strength of list comprehension, we can solve all ordinary positive integers in a single line of code:

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

![Operational applications: all factors for finding a positive whole (divisors) lecture board illustration (00:21:35)](</attachments/cs61a-8c96a864cedf81db8deeda13.png>)
*⏱ Timestamp: 00:21:35 · 📷 Lecture screenshot · [Watch clip (P11 00:21:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=11&t=1295)*

The logic of the code is obvious:
- `1`  The value of the function is always a positive integer;
- The candidate then ran for office in the  `range(2, n)`  In the context of the current system,  `if n % x == 0`  Filtering out all the repairs  `n`  The number of
- The final two parts were adopted  `+`  The following is a list of the most commonly used methods for calculating the value of a given number.

---

## 9. Core points and thought-provoking topics

### The key rules are refined
1. **Sequence is behavior abstraction** The support:  `len()`  The length of the  `s[i]`  The complex data types of the elements obtained can all be classified into sequence families.
2. **`for`  The cycle does not create new scope**: The variables bound within the loop reside directly in the local loop of the current environment and are still accessible after the loop is out.
3. **Half-open half-closed spaces are the finer things in computational thinking.**: `range(a, b)`  Included  $b - a$  The element eliminates the classic off-by-one error.
4. **The first is the derivative of a function.** When creating a new list, the derivative method  `[f(x) for x in s if cond]`  The key is to ensure that the language is clear and the execution speed at the bottom of the page is significantly better than the obvious looping and the  `.append()`.

---

### Self-testing after school

#### Exercise 1: Perfect Numbers
In mathematics, a positive integer is said to be the sum of all its real factors (i.e., factors other than itself) if it has a positive intege equal to the sum of its proper factors. **Perfect numbers** For example,  $6 = 1 + 2 + 3$• Use this lesson  `divisors(n)` The first step is to write a linear derivative of the number 1000 and find all perfect numbers in it:
```python
perfect_numbers = [n for n in range(1, 1000) if sum(divisors(n)) == n]
# 答案: [6, 28, 496]
```

#### Exercise 2: Minimum coin combination
If you have a value of  `[1, 5, 10, 25]`  How to find out with list comprehension all the combined amounts that can be mined with two coins and have a value greater than 15?
```python
coins = [1, 5, 10, 25]
combinations = [c1 + c2 for c1 in coins for c2 in coins if c1 + c2 > 15]
# 去重后结果: [20, 26, 30, 35, 50]
```
The nested derivatives show the amazing power of a Cartesian combination!

---

