---
kind: notes
source: cs61a/lecture-17
title: "Lecture 17 · Generators: Yield and Recursive Streams"
description: "CS61A Lecture 17: Generators, the yield mechanism, and recursive
  stream generation."
sourceHash: 702c2a5a052c6613feb56bfe9acba3724ba5b90de8e2215e6f45eb9a16c61656
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-17).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 17:13 ｜ **Video link back**: [B station response unit set (P17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17)

## 1. Introduction: From ordinary function to generator function

In Python, the vast majority of functions follow a single-run cycle: from the first line to execute once encountered.  `return`  The statement, functional array is destroyed immediately and the controls are returned to the callback.

> **Generator function** Included in the function body:  **`yield`**  The keyword is a special function.  
> Calling the generator function **The functional body will not be executed immediately** I'm not going to go back. **Generator Object** The generator itself is an iterator.

![Introduction: from normal functions to generator Function... lecture board illustration (00:00:31)](</attachments/cs61a-a352b723eba18363326481b5.png>)
*⏱ Timestamp: 00:00:31 · 📷 Lecture screenshot · [Watch clip (P17 00:00:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=31)*

```python
def plus_minus(x):
    yield x
    yield -x

t = plus_minus(3)  # t 是一个生成器对象！
next(t)            # 3
next(t)            # -3
next(t)            # 抛出 StopIteration 异常
```

![Introduction: from normal functions to generator Function... lecture board illustration (00:01:31)](</attachments/cs61a-8c3861deafd80c58f75aa39e.png>)
*⏱ Timestamp: 00:01:31 · 📷 Lecture screenshot · [Watch clip (P17 00:01:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=91)*

---

## 2. `yield`  The bottom-up mind model: freezing, hanging up and recovering

The number generator is a continuous pair  `evens(start, end)`  The following is an example of how it works internally:

```python
def evens(start, end):
    even = start + (0 if start % 2 == 0 else 1)
    while even < end:
        yield even
        even += 2
```

![lecture board illustration (00:02:30)](</attachments/cs61a-c116f7c10d80f7a908b29a4d.png>)
*⏱ Timestamp: 00:02:30 · 📷 Lecture screenshot · [Watch clip (P17 00:02:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=150)*

### Detailed process execution
1. **Creating a generator**: `t = evens(2, 10)` The interpreter packs only function references and parameters, but the interpreter also packs a list of functions. **Line 1 of the Functional Body has not yet been executed**!
2. **Activate for the first time `next(t)`)** Enter the functional body and calculate  `even = 2`- Get in there.  `while`  Circulation and execution  `yield 2`.
   - **Called to the output value  `2`**.
   - **Freeze & Pause**: interpreter fully preserves the environmental state of the current frame of function (local variable)  `even=2` The first is the PC, which is a rotating clutch.
3. **The first is the "Return to Action". `next(t)`)** The last one hanging directly:  `yield`  After the sentence **Restored execution**!
   - execute  `even += 2` (Verified to 4)
   - Re-entry  `while`  Head judgement, next shot  `yield 4` Freeze again!
4. **Natural Ends** When:  `even < end`  When the output cycle is no longer established, the function naturally reaches its tail and automatically triggers  `StopIteration`.

![Detailed Implementation Process lecture board illustration (00:03:32)](</attachments/cs61a-3b93411147567339e3ce1d63.png>)
*⏱ Timestamp: 00:03:32 · 📷 Lecture screenshot · [Watch clip (P17 00:03:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=212)*

```
调用方 (Caller)                   生成器函数 (Generator Frame)
────────────────                 ───────────────────────────
t = evens(2, 10) ──────────────► (创建生成器对象，代码未执行)
next(t)          ──────────────► 执行至 yield 2 (产出 2 并挂起)
                                 [保存: even=2, 循环现场]
next(t)          ──────────────► 从 yield 处恢复 -> even+=2 -> yield 4
                                 [保存: even=4, 循环现场]
next(t)          ──────────────► ...
```

---

## 3. Instructions for the syntax: `yield from`  The philosophy of abstraction

Before Python 3.3, it was necessary to write a template loop to produce another iterator of content inside the generator one by one:
```python
for x in a:
    yield x
```
To eliminate the meaningless loop of variables, Python introduced  **`yield from`**  The wording:

![Commissioned syntax: very simple philosophy of yield from lecture board illustration (00:04:31)](</attachments/cs61a-d8a75eb7a748d61b1e97de9c.png>)
*⏱ Timestamp: 00:04:31 · 📷 Lecture screenshot · [Watch clip (P17 00:04:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=271)*

```python
def a_then_b(a, b):
    yield from a
    yield from b
```

![Commissioned syntax: the very simple philosophy of lecture board illustration (00:05:33)](</attachments/cs61a-0780e4acaa0f329198d8efcf.png>)
*⏱ Timestamp: 00:05:33 · 📷 Lecture screenshot · [Watch clip (P17 00:05:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=333)*

`yield from <iterable>`  The controls will be generated completely **The delegate**  The subiterator is then sent to the subiterator and executed until the subiterater runs out.

---

## 4. Recursive Generators: Countdowns, String Prefixes, and Substrings

`yield from`  When combined with recursion, it produces a surprising flow code.

### 4.1 Counter-clock generator (`countdown`)
```python
def countdown(k):
    if k > 0:
        yield k
        yield from countdown(k - 1)
    else:
        yield "Blastoff!"
```

![Countdown generator (countdown) lecture board illustration (00:06:36)](</attachments/cs61a-ffe11c80abfcb243bb982337.png>)
*⏱ Timestamp: 00:06:36 · 📷 Lecture screenshot · [Watch clip (P17 00:06:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=396)*

- The current figures are generated  `k`; 
- It's a good thing.  `yield from countdown(k - 1)`  The contractor counts down the remaining number of abortions!

---

### 4.2 String prefixes generated with all substrings (`prefixes` & `substrings`)
How to generate inert strings for all the prefixes?  `"both"`  The sequence of the forewings is  `["b", "bo", "bot", "both"]`: 

```python
def prefixes(s):
    if s:
        yield from prefixes(s[:-1])
        yield s
```

![String prefixes with all substrings generated (prefixes & substrings) . lecture board illustration (00:07:42)](</attachments/cs61a-a5a8fa5ca3119ce609799095.png>)
*⏱ Timestamp: 00:07:42 · 📷 Lecture screenshot · [Watch clip (P17 00:07:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=462)*

In  `prefixes`  The first step is to create a string that has all the sequential substrings (`substrings`): 
```python
def substrings(s):
    if s:
        yield from prefixes(s)
        yield from substrings(s[1:])
```

![String prefixes with all substrings generated (prefixes & substrings) . lecture board illustration (00:08:15)](</attachments/cs61a-4c52d7cc346157c6175d70a0.png>)
*⏱ Timestamp: 00:08:15 · 📷 Lecture screenshot · [Watch clip (P17 00:08:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=495)*

call  `list(substrings("tops"))`  Get it right away  `["t", "to", "top", "tops", "o", "op", "ops", "p", "ps", "s"]` The tree is a perfect match between the flow and the division of trees.

---

## 5. Re-division of integers: from count to complete rollout

In Lecture 10, we successfully calculated the total dividend by two-way recursion.  `count_partitions(n, m)` The problem is that the problem is not a problem. **Not only do you calculate the total number of programs, but you also realise each program in a string form.**!

For example,  $n=6, m=4$  The output is: 
`"2 + 4"`, `"1 + 1 + 4"`, `"3 + 3"`, `"1 + 2 + 3"`, $\dots$

![Recommending integer split: from count to full listing lecture board illustration (00:09:42)](</attachments/cs61a-c03201455bae2f2e01843c33.png>)
*⏱ Timestamp: 00:09:42 · 📷 Lecture screenshot · [Watch clip (P17 00:09:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=582)*

---

## 6. The positive contrast between traditional list accumulation laws vs. elegant generator laws

### 6.1 Traditional list accumulation methods (heavy and easy to make mistakes)
If we use lists as returns, we need layered sub-lists, list comprehension, plus  `sum(..., [])`  The following is the full text:

![Traditional List Accumulation (heavy error) lecture board illustration (00:11:45)](</attachments/cs61a-656fc833ba8856027a051609.png>)
*⏱ Timestamp: 00:11:45 · 📷 Lecture screenshot · [Watch clip (P17 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=705)*

![Traditional List Accumulation (heavy error) lecture board illustration (00:12:47)](</attachments/cs61a-cc82a3e9f9ad52ec274992b7.png>)
*⏱ Timestamp: 00:12:47 · 📷 Lecture screenshot · [Watch clip (P17 00:12:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=767)*

```python
# 传统列表实现 (代码繁复、内存冗余)
def list_partitions(n, m):
    if n < 0 or m == 0:
        return []
    result = []
    if n == m:
        result.append(str(m))
    with_m = [p + " + " + str(m) for p in list_partitions(n - m, m)]
    without_m = list_partitions(n, m - 1)
    return result + with_m + without_m
```

---

### 6.2 The elegant generator method (minimal heart flow)
Convert to generator I don't know. **The programmer simply needs to focus on which element of the string is generated under the current conditions, completely eliminating the hassle of maintaining and merging the list.**: 

![Elegance generator (extreme flow) lecture board illustration (00:13:53)](</attachments/cs61a-bf1f01a84820f96c6f015ec2.png>)
*⏱ Timestamp: 00:13:53 · 📷 Lecture screenshot · [Watch clip (P17 00:13:53)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=833)*

```python
def partitions(n, m):
    """惰性生成正整数 n 使用不超过 m 的部分拆分的所有方案字符串。
    
    >>> for p in partitions(6, 4):
    ...     print(p)
    2 + 4
    1 + 1 + 4
    3 + 3
    1 + 2 + 3
    1 + 1 + 1 + 3
    2 + 2 + 2
    1 + 1 + 2 + 2
    1 + 1 + 1 + 1 + 2
    1 + 1 + 1 + 1 + 1 + 1
    """
    if n > 0 and m > 0:
        if n == m:
            yield str(m)  # 方案 1：正好独立凑齐
        for p in partitions(n - m, m):
            yield p + ' + ' + str(m)  # 方案 2：使用至少一个 m
        yield from partitions(n, m - 1) # 方案 3：完全不使用 m
```

![Elegance generator (extreme flow) lecture board illustration (00:14:55)](</attachments/cs61a-27a8246a7ac0101e473a120f.png>)
*⏱ Timestamp: 00:14:55 · 📷 Lecture screenshot · [Watch clip (P17 00:14:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=895)*

---

## 7. Extremely fast response to the million-level space decomposition: a reduction in the impact of lazy evaluation

When the import scale expanded to  $n=60, m=50$  The total number of schemes for the split is up to  **966,467 species (nearly a million combined)**!

![A hypervelocity response to a million-grade decomposition: lazy evaluation . . . . . . lecture board illustration (00:15:52)](</attachments/cs61a-7e3871ff2302e88ac9027243.png>)
*⏱ Timestamp: 00:15:52 · 📷 Lecture screenshot · [Watch clip (P17 00:15:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=952)*

- **Traditional listing methods** The program is trapped in a long carton, consuming hundreds of megabytes of memory.
- **Generator** Adopted by: **Inertia on the need for evaluation** If the top level only needs the first 10 examples:
```python
p = partitions(60, 50)
for _ in range(10):
    print(next(p))
```

![A hypervelocity response to a million-grade decomposition: lazy evaluation . . . . . . lecture board illustration (00:16:34)](</attachments/cs61a-5c2ce87c9dffa41a5f460f32.png>)
*⏱ Timestamp: 00:16:34 · 📷 Lecture screenshot · [Watch clip (P17 00:16:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=17&t=994)*

**The response time is 0.001 seconds.** If you count the first 10 solutions, the generator will start up immediately and the remaining 966,457 are likely to be generated. **There is no calculation.** This is the leap forward generators have made in quantum search algorithms.

---

## 8. The main points and considerations

### The key rules are refined
1. **Generator is the grammar sugar of iterator** Included:  `yield`  The function automatically generates a state machine, freezing once called.
2. **`yield from`  Eliminating the sample cycle** In the process of tree decomposition and recursion, `yield from`  It is the ultimate leverage of the proxy subgenerator.
3. **Search for the preferred generator** When the resolution space is extremely large and users often only need partial resolution, generators provide a constant number of start delays with very little memory occupancy.

---

### Self-testing after school

#### Exercise 1: Generate the infinite prime sequence
Write a generator  `primes()` The source constantly generates all the masses in natural numbers: 2, 3, 5, 7, 11, ...:
```python
def primes():
    """
    >>> p = primes()
    >>> [next(p) for _ in range(5)]
    [2, 3, 5, 7, 11]
    """
    def is_prime(x):
        return all(x % d != 0 for d in range(2, int(x**0.5) + 1))
    n = 2
    while True:
        if is_prime(n):
            yield n
        n += 1
```

#### Exercise 2: A binary tree sequence through the generator
Suppose the tree node  `t`  Owned  `left`  and  `right`  The tree. How to use it?  `yield from`  What is the meaning of a short expression?
```python
def inorder(t):
    if t is not None:
        yield from inorder(t.left)
        yield t.label
        yield from inorder(t.right)
```
Generators allow complex data structures to permeate and say goodbye to complicated auxiliary maintenance!

---

