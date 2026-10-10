---
kind: notes
source: cs61a/lecture-16
title: "Lecture 16 · Iterators: Lazy Evaluation and Streams"
description: "CS61A Lecture 16: Iterators, lazy evaluation, and generated streams."
sourceHash: 358958af956065cfd4f0f6aadb73b99472085a7e080ca89e6a52538a0521f94e
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 29:29 ｜ **Video link back**: [B station response unit set (P16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16)

## 1. Introduction: The implicit sequence represents the interface with the iterator

When processing large-scale or even unlimited data, all data is once in memory to be materialised into a list such as:  `[1, 2, 3, ...]` The system is also very time consuming and easily depleted of the memory.

> **Iterator** One of them: **Intuitive representation of sequence data** The object. It does not store all the elements in a single instance, but maintains the marker pointing to the current data flow location and generates the next element as needed.

![Introduction: Invisible sequence means interface with iterator lecture board illustration (00:00:28)](</attachments/cs61a-45f3daee9688953e12fa1bf0.png>)
*⏱ Timestamp: 00:00:28 · 📷 Lecture screenshot · [Watch clip (P16 00:00:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=28)*

---

## 2. The core protocol: `iter()`, `next()`  and  `StopIteration`

Python iteration is defined by two built-in functions and a pair of downline method protocols:

### 2.1 `iter`  and  `next`  The meaning of behavior
- **`iter(iterable)`** Receive one **Iterable objects** The first step is to return a list, dictionary, subset, string, range. **Iterator**.
- **`next(iterator)`** Driving: drive the iterator flowchart forward to one and return the element where the flowchart is located.

![Itser and next behavioral semantics of lecture board illustration (00:01:25)](</attachments/cs61a-6e24ae818d143c3ea723f787.png>)
*⏱ Timestamp: 00:01:25 · 📷 Lecture screenshot · [Watch clip (P16 00:01:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=85)*

```python
s = [3, 4, 5]
t = iter(s)  # 创建迭代器 t
next(t)      # 3 (游标移到 4)
next(t)      # 4 (游标移到 5)

u = iter(s)  # 创建独立的第二个迭代器 u
next(u)      # 3 (u 的游标从头开始)
next(t)      # 5 (t 记住了自己的位置，互不干扰)
```

```
容器对象 s: [ 3 | 4 | 5 ]
             ▲   ▲
             │   └── 迭代器 t 的当前位置 (下一个返回 5)
             └────── 迭代器 u 的当前位置 (下一个返回 3)
```

---

### 2.2 Exhaust and termination: `StopIteration`  The Unusual
When all the elements of the iterator have been removed, call again  `next()`  It's going to trigger  `StopIteration`  This is a standardized notification signal that Python interpreter identifies as the end of iteration.

![The first is the "StopIteration" of the lecture board illustration (00:03:26)](</attachments/cs61a-4ce1ad8525806bd8371b5e90.png>)
*⏱ Timestamp: 00:03:26 · 📷 Lecture screenshot · [Watch clip (P16 00:03:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=206)*

```python
t = iter([1, 2])
next(t)  # 1
next(t)  # 2
next(t)  # 抛出 StopIteration 异常！
```
call  `list(t)`  I'll have the Iterator **All the remaining elements** Collected for a new list; returned empty lists if the iterator is exhausted  `[]`.

---

## 3. Dictionary's iterative view and runtime modification crisis

### 3.1 Dictionary view and insert order guaranteed
From Python 3.6, the dictionary's iterative sequence is strictly guaranteed to be **Key values are added in the previous order of dictionary**.

![dictionary View & Insert Order Guarantee lecture board illustration (00:04:28)](</attachments/cs61a-50febed4b02b0c3b95f36005.png>)
*⏱ Timestamp: 00:04:28 · 📷 Lecture screenshot · [Watch clip (P16 00:04:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=268)*

The dictionary provides three types of iterative views:
- `iter(d)`  or  `iter(d.keys())` The whole world: **Key**.
- `iter(d.values())` The whole world: **Value**.
- `iter(d.items())` The following is a list of  `(key, value)`  The key value of the binary group is yes.

---

### 3.2 Dictionary Changed Size
**Adding or removing keys while going through a dictionary is strictly prohibited**!

![Runtime modified crisis (Dictionary Changed Size) lecture board illustration (00:07:18)](</attachments/cs61a-833a64e53f15d18270fb99d9.png>)
*⏱ Timestamp: 00:07:18 · 📷 Lecture screenshot · [Watch clip (P16 00:07:18)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=438)*

```python
d = {'a': 1, 'b': 2}
k = iter(d)
next(k)          # 'a'
d['c'] = 3       # 字典大小突变！
next(k)          # 抛出 RuntimeError: dictionary changed size during iteration
```
> **The Principle of Insight** The bottom of the dictionary is a hash table. Adding and deleting keywords will cause the hash barrel to expand or rescale, rendering the original navigation logarithm completely invalid.  `d['a'] = 99` The first is that the system will not be damaged and the next generation can continue safely.

---

## 4. `for`  The single consumption characteristics of the iterator and the loop

### 4.1 Repeat iterable container through vs. reverse iterator through
- **The first is the iterable container.  `range`, `list`)** Every time:  `for`  When the cycle is complete, `for`  automatically calls  `iter()`  The new flags are created so that they can be repeated over and over again.
- **Iterator itself** The flag state is one-way flow, after being passed through consumption **singular, not recoverable**!

![Yeah. iterable The container goes through. iterator All over the place. lecture board illustration (00:08:48)](</attachments/cs61a-40fcf6081575126b978bdc41.png>)
*⏱ Timestamp: 00:08:48 · 📷 Lecture screenshot · [Watch clip (P16 00:08:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=528)*

```python
r = range(3, 6)
ri = iter(r)

for x in ri:
    print(x) # 打印 3, 4, 5

for x in ri:
    print(x) # 什么都不会打印！ri 已经耗尽在终点！
```

---

## 5. higher-order inertial computing pipelines: `map`, `filter`, `zip`, `reversed`

Python provides several standard higher-order iterative tools, the core feature of which is **Lazy Computation is a computer program that uses the word "lazy computing" to describe the process of creating a new computer.**: **The only way to get a clear call is downstream.  `next()`  The first time a calculation is actually performed, the element is requested.**!

![The first is the higher-order inertial computing pipeline: map, filter, zip, reversed · lecture board illustration (00:10:46)](</attachments/cs61a-35500e3c8809adcee6a32a73.png>)
*⏱ Timestamp: 00:10:46 · 📷 Lecture screenshot · [Watch clip (P16 00:10:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=646)*

| Built-in function | The role | Inertia features |
| :--- | :--- | :--- |
| **`map(fn, seq)`** | Application of each element to the flow  `fn` | Call only when you request the next one  `fn(x)` |
| **`filter(pred, seq)`** | Keeping the messenger  `pred(x)`  For real | Request-only loop retrieval, immediately suspended after finding the first item that satisfies the condition |
| **`zip(seq1, seq2)`** | Packaging of components in multiple sequences by indexing | The shortest sequence lengths are aligned |
| **`reversed(seq)`** | Reverse sequence flow | The sequence length and reverse index are known. |

---

### 5.1 Evidence of inert computation: observation  `map`  The execution time
```python
def double(x):
    print(f"** doubling {x} **")
    return 2 * x

m = map(double, [3, 5, 7])
# 控制台没有任何输出！计算被冻结推迟！
```

![There's no output on the console! The calculations have been delayed! lecture board illustration (00:12:52)](</attachments/cs61a-d6aa0213741ae4b675d74c7d.png>)
*⏱ Timestamp: 00:12:52 · 📷 Lecture screenshot · [Watch clip (P16 00:12:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=772)*

We are only doing this when we:
```python
next(m)  # 控制台打印: ** doubling 3 **, 返回 6
next(m)  # 控制台打印: ** doubling 5 **, 返回 10
```

---

### 5.2 Stream pipeline
We can link multiple inert generators seamlessly into a flow line, creating data filtering channels similar to industrial transmission belts:

![The first is the "Streaming Pipeline" lecture board illustration (00:14:28)](</attachments/cs61a-916a1b1f281c359f91c0dad3.png>)
*⏱ Timestamp: 00:14:28 · 📷 Lecture screenshot · [Watch clip (P16 00:14:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=868)*

```python
# 筛选大于等于 10 的偶数
m = map(double, range(3, 7))
f = filter(lambda y: y >= 10, m)
# 依次消费：double(3)=6(舍弃) -> double(4)=8(舍弃) -> double(5)=10(命中返回)
next(f)  # 返回 10
```

---

## 6. Case Study: Palindrome Detection (`palindrome` The two models of the

### 6.1 Common fatal traps: Iterator judgments and other
The first step is to write the following code:
```python
def is_palindrome_bad(s):
    return s == reversed(s)  # 永远返回 False！
```

![Commonly lethal trap: iterator sentence lecture board illustration](</attachments/cs61a-c9a2994e2b583bcb527854d9.png>)
*⏱ Timestamp: 00:16:49 · 📷 Lecture screenshot · [Watch clip (P16 00:16:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1009)*

> **Error due to dissection**: `reversed(s)`  The return is a **The object of the reverse iterator (`list_reverseiterator`)** and  `s`  is a list. The list goes on with iterator  `==`  The comparison, the types, the constant  `False`!

---

### 6.2 Aesthetic solution 1: List of materialistic reversals
```python
def palindrome_list(s):
    return list(s) == list(reversed(s))
```

### 6.3 The second method of elegance: use  `zip`  and  `all`  The gradual contrast of inertia
```python
def palindrome_zip(s):
    """
    >>> palindrome_zip([1, 2, 3, 2, 1])
    True
    >>> palindrome_zip("radar")
    True
    """
    return all(a == b for a, b in zip(s, reversed(s)))
```

![Anglican Law II: Using zip to compare all inertity by place lecture board illustration (00:17:49)](</attachments/cs61a-84c4dd2f4f9d3feb8526a514.png>)
*⏱ Timestamp: 00:17:49 · 📷 Lecture screenshot · [Watch clip (P16 00:17:49)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1069)*

![Aesthetic: Using zip and all inertial phase contrast · lecture board illustration (00:20:19)](</attachments/cs61a-660ecd76a477bfb13bed942f.png>)
*⏱ Timestamp: 00:20:19 · 📷 Lecture screenshot · [Watch clip (P16 00:20:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1219)*

- `zip(s, reversed(s))`  The first step is to pair the orderly flow with the reverse one by one: $(s_0, s_{n-1}), (s_1, s_{n-2}), \dots$
- If we find the first pair is not equal, `all`  The first step is to trigger a shortcut and exit immediately without having to complete the entire sequence!

---

## 7. Why embrace the iterator?

![Why embrace aiterator? The three major engineering values · lecture board illustration (00:21:46)](</attachments/cs61a-e8b5e411369c88f884387d04.png>)
*⏱ Timestamp: 00:21:46 · 📷 Lecture screenshot · [Watch clip (P16 00:21:46)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1306)*

1. **Representation Independence is a political party.** The upper-level function depends only on  `for item in it`  or  `next(it)` Whether the underlying input is a list, file handle, network suite or generator, the code is completely reused.
2. **Encapsulated Position (encapsulated position)** The iterator integrates the content of the string sequence with the current floating point position. Even if passed between multiple functions, the floating point remains consistent and never consumes again.
3. **Memory Efficiency & Infinite Streams support** Support for processing hundreds of millions of lines of data or infinite Fibonacci flows with constant memory  $O(1)$!

---

## The game is played in a virtual machine called Casino Blackjack.

In the 21st hole, 52 cards in Shoe's cardboard boots were sent one less. **The iterator is naturally the most perfect of all.**!

![Field exercise: 21-point card game simulator (Casino Blackjack) lecture board illustration (00:23:56)](</attachments/cs61a-8b46e94fffb1f161079ef358.png>)
*⏱ Timestamp: 00:23:56 · 📷 Lecture screenshot · [Watch clip (P16 00:23:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1436)*

### 8.1 Laundering and distributing
```python
import random

def make_deck():
    """生成一副已洗好牌的迭代器。"""
    cards = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'] * 4
    random.shuffle(cards)
    return iter(cards)  # 返回迭代器！
```

![Card shuffle and dealr lecture board illustration (00:26:04)](</attachments/cs61a-fb877f2aaeeb4002886965ec.png>)
*⏱ Timestamp: 00:26:04 · 📷 Lecture screenshot · [Watch clip (P16 00:26:04)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1564)*

Call only when you're issued a badge  `next(deck)` The list is not manually maintained or  `.pop(0)`!
```python
deck = make_deck()
player_hand = [next(deck), next(deck)]
dealer_upcard = next(deck)
dealer_holecard = next(deck)
```

---

### 8.2 Simulation of the 1000th session of the Monte Carlo Statistics
The results of the 1000 simulations were published in the journal "The Power of the House".

![Simulation 1000 Monte Carlo Statistics lecture board illustration (00:29:05)](</attachments/cs61a-d4112aeb82fe42087478364c.png>)
*⏱ Timestamp: 00:29:05 · 📷 Lecture screenshot · [Watch clip (P16 00:29:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=16&t=1745)*

Because players who have a card that is over 21 points will be judged negative even if they play according to the basic strategy, long-term odds are still mathematically superior. This is the secret of the casino's growing probability.

---

## 9. Core points and thought-provoking topics

### The key rules are refined
1. **The iterator is a one-way traffic signal** The first is that the element gets a little bit more and it's gone.
2. **Lazy evaluation improves the swallowing**: `map`, `filter`  Generator pipes are produced on demand, with low latency and extremely low memory costs.
3. **Watch out for changing capacity while roaming the dictionary** Insert or remove keys that cause the iterator to fail and throw  `RuntimeError`.

---

### Self-testing after school

#### Exercise 1: Inert Fibonacci Generator
Please write a function  `pairs(it)`, receive a iterator and return a binary stream consisting of two adjacent elements:
```python
def pairs(it):
    """
    >>> list(pairs(iter([1, 2, 3, 4])))
    [(1, 2), (2, 3), (3, 4)]
    """
    # 提示：利用 itertools 或两次迭代
    prev = next(it)
    for curr in it:
        yield (prev, curr)
        prev = curr
```
The state of the iterator is a remarkable release for continuous flow processing!

---

