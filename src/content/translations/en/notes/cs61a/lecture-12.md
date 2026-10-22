---
kind: notes
source: cs61a/lecture-12
title: "Lecture 12 · Containers: Box-and-Pointer Diagrams and Dictionaries"
description: "CS61A Lecture 12: Containers, box-and-pointer diagrams, and
  dictionary abstraction."
sourceHash: 6b89dda288f022e601c0207ee3c20c3acf140524121d30ff4e9c4270bb5073a3
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-12).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 27:53 ｜ **Video link back**: [B station response unit set (P12)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12)

## 1. Introduction: Closure nature and layered data structure

In the previous lecture, we learned the basic grammar of lists. **Algebraic closure properties** Introducing and revealing the underlying reasons for the creation of infinitely complex reality models through combined data.

### 1.1 What is the Closure Property?
> **Closure Property of Data Combination**:   
> The method of a data set satisfies the closure nature, if and only if **The results of the combined method itself can still be further involved in the combination as input to the combined methods.**.

![What's a combination? closure Nature? lecture board illustration (00:00:31)](</attachments/cs61a-edac872418f699b4eac3cd40.png>)
*⏱ Timestamp: 00:00:31 · 📷 Lecture screenshot · [Watch clip (P12 00:00:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=31)*

If we could put the integers in a list and the list itself was a legitimate data object, then we would have to be able to do that. **Put the list in another list**.
- This is a characteristic that allows us to build **The following are the hierarchical structures:** Large systems are composed of components, parts themselves made up of smaller sub-components, recursion embedded.
- Almost all complex concepts in the real world - organizational architecture trees, file directory systems, web DOM trees, mathematical abstraction syntax trees - are based on this.

---

## 2. Container visualization in environment model: Box-and-Pointer Notation

As the data level becomes rich, how to accurately and indiscriminately track who contains who, who points to whom in an environment model? **Box-and-Pointer Diagrams**.

### 2.1 Drawing standards
1. **List of adjacent rectangular frames** Each box represents an element slot, with the top indicating the bottom index  $0, 1, 2, \dots$.
2. **Primitive Values are the most common type of value.** As in numbers:  `3` The Bull value  `False`, `None` The text is written directly inside the corresponding box.
3. **Compound Values are the most commonly used type of data.** If the element is a complex object, such as a list, function, or dictionary, then it can be used to create a list. **The box inside the frame draws a circle pointing out an arrow (a pointer) that points exactly at the target object.**.

![Draw a code lecture board illustration (00:01:36)](</attachments/cs61a-f334a32e581591362f1d9497.png>)
*⏱ Timestamp: 00:01:36 · 📷 Lecture screenshot · [Watch clip (P12 00:01:36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=96)*

### 2.2 Examples of environment models for deep nested lists
The following is a list of multi-layered nestings:
```python
nested_list = [
    [1, 2],
    [],
    [[3, False, None], [4, lambda: None]]
]
```

![Example of environment model for the Depth Embedded List: lecture board illustration (00:02:35)](</attachments/cs61a-4993d92dc4dca704d82a8850.png>)
*⏱ Timestamp: 00:02:35 · 📷 Lecture screenshot · [Watch clip (P12 00:02:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=155)*

```
Global frame
  nested_list ───► [ 0 | 1 | 2 ]  (三元素列表)
                     │   │   │
        ┌────────────┘   │   └──────────────────────┐
        ▼                ▼                          ▼
     [ 0 | 1 ]        [空列表]                  [ 0 | 1 ]
       │   │                                      │   │
       1   2                       ┌──────────────┘   └─────────────┐
                                   ▼                                ▼
                              [ 0 | 1 | 2 ]                      [ 0 | 1 ]
                                │   │   │                          │   │
                                3 False None                       4   * ──► func
```
- The Index  `0`  A list of binary elements  `[1, 2]`.
- The Index  `1`  Pointing to the empty list  `[]`.
- The Index  `2`  A list containing two sublists. The second element in the innermost layer is a function object!
- The box-shaped pointer model makes it possible to see the phenomena of sharing, decoding and naming references.

---

## Slicing: Grammar and memory behavior 3.

The snippet is the core grammar of Python that extracts a sub-sequence from a sequence.

### 3.1 Grammar rules and semicircular spaces
The Slice of Expression  `s[start:stop]`  Strictly followed  $[start, stop)$  Left closed right open specification:
```python
odds = [3, 5, 7, 9, 11]
sub1 = odds[1:3]  # 选取索引 1 和 2 -> [5, 7]
```
Equivalent to list comprehension: `[odds[i] for i in range(1, 3)]`.

![Syntax: Intersection lecture board illustration (00:04:41)](</attachments/cs61a-67ace6dae1fbc97c46e51ce5.png>)
*⏱ Timestamp: 00:04:41 · 📷 Lecture screenshot · [Watch clip (P12 00:04:41)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=281)*

The rules of border omission:
- `s[:stop]` The default is to skip the starting point from the index.  `0`  Starting with.  `odds[:3] -> [3, 5, 7]`.
- `s[start:]` The first is the "Stop" of the end: avoid the end, and continue to extend until the end.  `odds[1:] -> [5, 7, 9, 11]`.
- `s[:]` The two ends are omitted, generating a copy containing all elements from the original list.

### 3.2 Core rules of memory behavior: Pieces always create new objects
**In an environment model, the slice operation must allocate a whole new memory space to generate a separate whole new list instance.** The value of the original list will definitely not be changed by a slice operation.

```python
digits = [1, 8, 2, 8]
a = digits[:1]  # [1] (新列表)
b = digits[1:3] # [8, 2] (新列表)
c = digits[2:]  # [2, 8] (新列表)
```
After the execution, there are four separate listing objects in a global environment!

![Core Code of Memory Behaviour: Slices always create new objects lecture board illustration (00:05:44)](</attachments/cs61a-00401cd6b8e100be0add6c40.png>)
*⏱ Timestamp: 00:05:44 · 📷 Lecture screenshot · [Watch clip (P12 00:05:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=344)*

---

## The higher-order aggregation function of the sequence: `sum`, `max`, `all`

Python provides a higher-order aggregation function for several open boxes, converting iterable sequence shortening to Fold/Aggregate into a single value.

### 4.1 `sum(iterable, start=0)`  The progressive use of
The official Chinese signature brackets indicate the parameters to be selected: `sum(iterable[, start])`.
- By default  `start=0` The number of digits is added: `sum([2, 3, 4]) -> 9`.
- Input customized  `start`: `sum([2, 3, 4], 5) -> 14`.

![sum(interable, start=0) step usage lecture board illustration (00:07:14)](</attachments/cs61a-e652acf569e238d6656a59ef.png>)
*⏱ Timestamp: 00:07:14 · 📷 Lecture screenshot · [Watch clip (P12 00:07:14)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=434)*

**Black magic: using  `sum`  Flattening lists** Because of the list additions:  `+`  This is the first time that a list of words is written in a blank.  `[]`: 
```python
nested = [[2, 3], [4]]
flat = sum(nested, [])
# 计算步骤: [] + [2, 3] + [4] -> [2, 3, 4]
```
This is a very simple multi-dimensional sequence mapping technique in Python!

![Calculating Steps: ""+"2,3"+ "4" -"2,3,4" lecture board illustration (00:08:19)](</attachments/cs61a-e3df694ad79bac20f2830734.png>)
*⏱ Timestamp: 00:08:19 · 📷 Lecture screenshot · [Watch clip (P12 00:08:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=499)*

### 4.2 `max`  The key function is the projection key. `key=fn`)
`max`  The first is that the data can be compared to the original values and allowed to enter.  `key`  Function, to find the projection values based on elements after conversion:
```python
# 寻找抛物线 f(x) = 7 - (x - 4) * (x - 2) 在区间 [0, 9] 上的最大值点
peak_x = max(range(10), key=lambda x: 7 - (x - 4) * (x - 2))
# 输出 3 (因为当 x=3 时，表达式取得局部峰值 8)
```
Note: `max`  And finally, the return is **The original elements in the sequence  `3`** The function is not a function, but a function value.  `8`!

![Exit 3 (because the expression reaches a local peak of 8 when x = 3) · lecture board illustration (00:09:52)](</attachments/cs61a-b341278bf0132515b717dfd0.png>)
*⏱ Timestamp: 00:09:52 · 📷 Lecture screenshot · [Watch clip (P12 00:09:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=592)*

### 4.3 `all`  and  `any`: Boolean Contexts
- `all(iterable)` When and only when each element in the sequence returns as real time in the context of the bull  `True` Any false value is a shortcut to return immediately.  `False` The empty sequence returns.  `True`.
- `any(iterable)` The value of the data is as follows:  `True`.

```python
all([x < 5 for x in range(5)])  # True
all([0, 1, 2, 3])                # False (0 是假值)
```

![All with any: summary of the context on the lecture board illustration (00:11:32)](</attachments/cs61a-e788ccc055eca5356385ba2d.png>)
*⏱ Timestamp: 00:11:32 · 📷 Lecture screenshot · [Watch clip (P12 00:11:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=692)*

---

## String abstraction: retrieving text sequences and substrings

### 5.1 String size and transition characters
Strings are abstractions of human language and symbolic text in computers.
- The single quotation  `'...'`  With double quotes  `"..."`  The first is the "Full Equal" function.
- The three quotes  `"""..."""`  It is capable of crossing multiple lines, and is often used in document strings (docstring).
- Translator  `\` The following characters are merged to form a single symbol, such as  `\n`  The following is a list of the most commonly used names in ASCII Linefeed.

![String Field & Conversion . lecture board illustration (00:14:44)](</attachments/cs61a-ec299cafc7ac0d72da7762ac.png>)
*⏱ Timestamp: 00:14:44 · 📷 Lecture screenshot · [Watch clip (P12 00:14:44)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=884)*

### 5.2 Subtle differences between strings and lists
Although strings are also sequences, support  `len()`  With the Index  `s[i]` The list is different in both mechanisms:
1. **Type of index return** The following are the elements of a list: **Substrings of length 1** (There are no separate characters in Python)  `char`  The type:
2. **Member operator  `in`  The sub-sequence matching**: 
   - In the list: `[1, 2] in [1, 2, 3]`  Return  `False` (The list only searches for top-level single elements.)
   - In the string: `'here' in 'where'`  Return  `True` (String support) **The following is a list of the most commonly used methods:**).

![The delicate difference between a string and a list lecture board illustration (00:16:42)](</attachments/cs61a-8d9e44cb62d589c9ae3dedab.png>)
*⏱ Timestamp: 00:16:42 · 📷 Lecture screenshot · [Watch clip (P12 00:16:42)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1002)*

---

## 6. dictionary: key values for the mapping system

The list will map the consecutive integer indexes to values, while **The dictionary `dict`)**  It's a general, custom key-based tool. **The following is a list of the most common types of associative mapping.**.

### 6.1 dictionary search with key
dictionary using flower brackets  `{key: value, ...}`  The following statement:
```python
numerals = {'I': 1, 'V': 5, 'X': 10}
val = numerals['V']  # 5
```

![dictionary Volume and Key Search lecture board illustration (00:18:38)](</attachments/cs61a-b29df0499096004ae28f2141.png>)
*⏱ Timestamp: 00:18:38 · 📷 Lecture screenshot · [Watch clip (P12 00:18:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1118)*

- **Searching for a single**: the dictionary can only retrieve values by keys; key cannot be directly found through value reversal.
- **The missing keys throw out the anomaly** If the query does not exist, such as  `numerals['C']` The interpreter will throw  `KeyError`.

### 6.2 Sequence view of dictionary
The dictionary itself is a dictionary of the **All the key elements are in sequence**: 
- `for k in numerals:`  The key is to go through all the keys.
- `numerals.values()` Back to the drawing board:  `dict_values`  View objects, providing a sequence view of all values.
- `numerals.items()` Return from:  `(key, value)`  The key values of the binary group are for sequences.

![dictionary The Sequence Perspective... lecture board illustration (00:20:28)](</attachments/cs61a-78f6b987212fca3ccaeea628.png>)
*⏱ Timestamp: 00:20:28 · 📷 Lecture screenshot · [Watch clip (P12 00:20:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1228)*

---

## 7. The two major iron laws of dictionary keys: uniqueness and hashiness

The value of a dictionary can be any complex type of list, function or even nested dictionary. **The keys in the dictionary are subject to strict technical and logical restrictions**: 

![dictionary The two iron laws of the key: uniqueness and kosherity. lecture board illustration (00:22:23)](</attachments/cs61a-6dc071307fe6fdd7a71be35b.png>)
*⏱ Timestamp: 00:22:23 · 📷 Lecture screenshot · [Watch clip (P12 00:22:23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1343)*

### The key is unique and the key is not repeatable.
In a dictionary, each key can only correspond to one value at any given time. If the value is repeated:
```python
d = {'one': 1, 'one': 'first'}
# d 仅保留 {'one': 'first'}
```
To have a key associate multiple data items, it must explicitly define values as a list or subset.

### The key must be immutable, hashable.
**List of the lists `list` The first is the dictionary. `dict` It's not a key to the dictionary!**
```python
bad_dict = { [1, 2]: 'val' }
# 触发报错: TypeError: unhashable type: 'list'
```
> **The Principle of Insight** Python dictionary base depends on **hash table**  Implementation  $O(1)$  If the key is mutable (such as when the list content is modified during running), its hash value and storage space will change, causing the element to be lost forever in the bottom hash barrel. Therefore, only the numbered, stringed, immutable subset type qualifies as a key.

---

## 8. dictionary derivatives and higher-order nested indexes (`index`)

### 8.1 dictionary derived grammar specifications
Similar to list comprehension, dictionary derivation provides a powerful means of declarative map-making:
```python
{<key_expr>: <val_expr> for <name> in <iter_expr> if <filter_expr>}
```

![dictionary derivative syntax norm lecture board illustration (00:24:43)](</attachments/cs61a-c5f1ad4e8212a53b635a99f4.png>)
*⏱ Timestamp: 00:24:43 · 📷 Lecture screenshot · [Watch clip (P12 00:24:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1483)*

For example, a number greater than 2 is selected by its square root:
```python
squares = {x * x: x for x in [1, 2, 3, 4, 5] if x > 2}
# 结果: {9: 3, 16: 4, 25: 5}
```

---

### 8.2 Comprehensive topic: constructing a subset matching inverse index (`index`)
Write a function  `index(keys, values, match)` Give a key sequence, a value sequence and a binary parameter determining function  `match(k, v)` Returns a dictionary so that each key is mapped to the list of all values it matches.

**Example needs** The key to the right integer  `[7, 9, 11]`  Map to the range  `range(30, 50)`  The list of all the multiples that can be deleted by this key.

![Consolidated Question: Build Group Matching Reverse Index (index) lecture board illustration (00:27:05)](</attachments/cs61a-67484da08eab494f0d94a62f.png>)
*⏱ Timestamp: 00:27:05 · 📷 Lecture screenshot · [Watch clip (P12 00:27:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=12&t=1625)*

#### An Elegant One-Line Solution: A Dictionary Comprehension Inside a List Comprehension
```python
def index(keys, values, match):
    """
    >>> match = lambda k, v: v % k == 0
    >>> index([7, 9, 11], range(30, 50), match)
    {7: [35, 42, 49], 9: [36, 45], 11: [33, 44]}
    """
    return {k: [v for v in values if match(k, v)] for k in keys}
```
- The wording of the dictionary is all over the world.  `k in keys`.
- The list comprehension is all about the inside.  `v in values` The key is captured using the closure.  `k`  with the candidate value  `v` by  `match(k, v)`  The code is pure refinement, with no redundant state variable.

---

## 9. Core points and thought-provoking topics

### The key rules are refined
1. **Closure is a source of leveling** The data can continue to participate in the combinations, forming a cornerstone of tree-shaped and complex graph structures.
2. **Boxed chart is a crater-scatter** In the face of multiple nestings, container slots are represented by a box; arrows represent object references and can be completely cleared with shallow copies and deep structures.
3. **The piece creates a new object** The snippet is permanently copied and generates new list instances, never cutting from the original list.
4. **The key to the hash-bound dead dictionary**: dictionary provides  $O(1)$  The cost of finding a key is that it must be immutable (a list of mutable keys is strictly prohibited).

---

### Self-testing after school

#### Exercise 1: Reverse the key of a dictionary
Give me a dictionary  `d` If all of the values in this list are also hashed and not identical, write a line that reverses the key value using a dictionary derivative:
```python
def invert(d):
    """
    >>> invert({'a': 1, 'b': 2})
    {1: 'a', 2: 'b'}
    """
    return {v: k for k, v in d.items()}
```

#### Practice 2: group the word length
For a given list of text words, use the dictionary to group words by their letter length:
```python
def group_by_len(words):
    """
    >>> group_by_len(['to', 'be', 'or', 'not', 'that'])
    {2: ['to', 'be', 'or'], 3: ['not'], 4: ['that']}
    """
    lengths = set(len(w) for w in words)
    return {length: [w for w in words if len(w) == length] for length in lengths}
```
The combination of derived nesting allows complex data rearrangements to be combined with classification credentials!

---

