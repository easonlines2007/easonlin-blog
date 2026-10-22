---
kind: notes
source: cs61a/lecture-37
title: Lecture 37 · Final Examples and Course Conclusion
description: "CS61A Lecture 37: Course review and integrated practice problems."
sourceHash: 6a81ddcd776679587dd96a2fec58a8835748e7373906e96557cfbd284d4f0b9b
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-37).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 38:48 ｜ **Video link back**: [B station response unit set (P37)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37)

## 1. Universality of Trees of abstraction and recursion

Tree-shaped data structures are ubiquitous in computer science:
- Python object-oriented implementation  `Tree`  The following is a list of articles related to `label`  The properties `branches`  The list. `is_leaf()`  The methodology;
- The following is a list of the most common types of JSON data trees.
- Abstraction grammar tree of programming language (AST);
- Natural language phrases can be analyzed by trees;
- The foundation of the modern World Wide Web is the HTML DOM webpage node tree.

![Tree abstraction Commonality and recursion The United of Trees... lecture board illustration (00:00:29)](</attachments/cs61a-b33714ebde3d79a66073b730.png>)
*⏱ Timestamp: 00:00:29 · 📷 Lecture screenshot · [Watch clip (P37 00:00:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=29)*

![Tree abstraction Commonality and recursion The United of Trees... lecture board illustration (00:01:29)](</attachments/cs61a-803e4437e03885849ba7b499.png>)
*⏱ Timestamp: 00:01:29 · 📷 Lecture screenshot · [Watch clip (P37 00:01:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=89)*

**The core and most indispensable mission of learning recursion is to manipulate tree-shaped, discrete data!**

---

## The problem-solving process: from confusion to progressive solution

When faced with any complex programming problem, it is impossible to immediately start stacking code without feeling upset.
1. **Read the whole thing** The domain name of the user is:
2. **Drawing a specific example chart** The abstraction text is represented as a structural graph.
3. **Identification of boundaries and non-variable**; 
4. **The first is the search for the core catcher (Hook).**.

![Solving thinking models: from confusion to progressive resolution (The Problem-Solving Production) lecture board illustration (00:03:43)](</attachments/cs61a-befde37928a96f755672f976.png>)
*⏱ Timestamp: 00:03:43 · 📷 Lecture screenshot · [Watch clip (P37 00:03:43)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=223)*

---

## 3. Classic Challenge 1: The ancestors compared the number of nodes (`bigs`)

> **Subject specification** Implementing the function  `bigs(t)` Tree receiving the integer tag  `t` Back in the tree. **The label is strictly larger than all of its ancestral node tags** The total number of nodes.

![Classic challenge 1: ancestral comparison nodes (bigs) lecture board illustration (00:05:06)](</attachments/cs61a-2eb1d877d087e5556b6f74b9.png>)
*⏱ Timestamp: 00:05:06 · 📷 Lecture screenshot · [Watch clip (P37 00:05:06)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=306)*

![Classic challenge 1: ancestral comparison nodes (bigs) lecture board illustration (00:06:28)](</attachments/cs61a-d98445ee84564343bed51254.png>)
*⏱ Timestamp: 00:06:28 · 📷 Lecture screenshot · [Watch clip (P37 00:06:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=388)*

### Case analysis and key issues variable Found
In the example tree:
- Root node  `1` The first is that the human race has no ancestors. **The root node is always normal, larger than all ancestors.** We have to count!
- The nodes  `4` (sub-node of 1) $4 > 1$, counting;
- The nodes  `4` (4 sub-nodes): Not larger than the ancestor  `4` and countless.
- The nodes  `5` The following is the list of sub-nodes: $5 > 4$  and  $5 > 1$, counting;
- The nodes  `2` The sub-node of (0): $2 > 0$  But  $2 < 3$ (These are) their forefathers, so they are not counted.

**Key barriers** The following is a list of common tree recursion templates: `sum(bigs(b) for b in t.branches)` The leaf node is the point at which the leaf node reaches the leaf nodes. **The greatest historical value of ancestors along the route is not known**!

![Case analysis and key non-variable found lecture board illustration (00:08:25)](</attachments/cs61a-3e0e114d1178ba0b07633d60.png>)
*⏱ Timestamp: 00:08:25 · 📷 Lecture screenshot · [Watch clip (P37 00:08:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=505)*

---

## 4. Mode breakthrough: Transfer of the auxiliary function with context status (`bigs`  functional solution)

The function of a binary parameter auxiliary must be defined  `f(a, x)`: 
- `a` The following are the most commonly used methods for calculating the number of trees:
- `x` The following is a list of the most commonly used methods for calculating the value of a data source: **Max Ancestor Seen So Far)**.

![Breakthrough mode: Conversing the auxiliary function with context status (bigs) · lecture board illustration (00:10:20)](</attachments/cs61a-71efd371991743d2be7f67ce.png>)
*⏱ Timestamp: 00:10:20 · 📷 Lecture screenshot · [Watch clip (P37 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=620)*

```python
def bigs(t):
    """返回标签大于所有祖先标签的节点数。"""
    def f(a, x):
        n = 1 if a.label > x else 0
        m = max(x, a.label)
        return n + sum([f(b, m) for b in a.branches])
    return f(t, t.label - 1)
```

![Breakthrough mode: Conversing the auxiliary function with context status (bigs) · lecture board illustration (00:12:38)](</attachments/cs61a-d3e806a2c08f7a82fc8d7ff1.png>)
*⏱ Timestamp: 00:12:38 · 📷 Lecture screenshot · [Watch clip (P37 00:12:38)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=758)*

- When the root node initiates a call, input  `t.label - 1` The root node must be determined to be true;
- Recursion down each branch  `b`  The greatest ancestor of the modern era  `max(x, a.label)`; 
- The results of the calculation are finally reported back through branches and by layering them.

![Breakthrough mode: Conversing the auxiliary function with context status (bigs) · lecture board illustration (00:16:16)](</attachments/cs61a-2ea279a1c04eaae71a717e9e.png>)
*⏱ Timestamp: 00:16:16 · 📷 Lecture screenshot · [Watch clip (P37 00:16:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=976)*

---

## 5. The solution variable: the mutable accumulator status update pattern

In addition to the purely functional return value, another high frequency mode is that of outer closure maintaining a single-element list.  `n = [0]`  As mutable counter:

![Solving variant: mutable State Update Mode (Mutable Accumulator Patterson) lecture board illustration (00:19:12)](</attachments/cs61a-f3eb3b5adb15a1c89a84a0f6.png>)
*⏱ Timestamp: 00:19:12 · 📷 Lecture screenshot · [Watch clip (P37 00:19:12)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1152)*

![Solving variant: mutable State Update Mode (Mutable Accumulator Patterson) lecture board illustration (00:22:25)](</attachments/cs61a-b79d462e3dc7a3164a2473ed.png>)
*⏱ Timestamp: 00:22:25 · 📷 Lecture screenshot · [Watch clip (P37 00:22:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1345)*

```python
def bigs_iter(t):
    n = [0]
    def f(a, x):
        if a.label > x:
            n[0] += 1
        m = max(x, a.label)
        for b in a.branches:
            f(b, m)
    f(t, t.label - 1)
    return n[0]
```

Modified by the original  `n[0]` I'm not going to.  `sum()`  The middle expense of list derivation. Understanding the mutual equivalence between these two models is key to master tree paths.

---

## How to design a program (HtDP) 6 steps to design a mindset

Professor John DeNero has highly recommended the six-step method of function design in his classic How to Design Programs series:

![How to Design Programs (HtDP) Six Step Design Hearts lecture board illustration (00:25:22)](</attachments/cs61a-c60f7ea237a3e2c550e218c6.png>)
*⏱ Timestamp: 00:25:22 · 📷 Lecture screenshot · [Watch clip (P37 00:25:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1522)*

![How to Design Programs (HtDP) Six Step Design Hearts lecture board illustration (00:27:19)](</attachments/cs61a-bad0bcfda2c0be7338c59e27.png>)
*⏱ Timestamp: 00:27:19 · 📷 Lecture screenshot · [Watch clip (P37 00:27:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1639)*

| Steps | Stage objectives | Practical guidelines |
| :--- | :--- | :--- |
| **1. Definition of data** | Identify the form of information in a program | The word "me" is actually used to represent the real concepts of a class, dictionary, tree or scale. |
| **2. Signature and commentary** | Clear input-output domain and core contract | Write type signature (Signature) with a single line of core Docstring |
| **3. Functional use cases** | Testing cases before writing code | Construct typical input and expected output (Doctest) |
| **4. The skeleton pattern** | The main stream controls are refined | Built  `if-else`  Branch and Key Calls |
| **5. Coding implementation** | Fill in code gaps by use case and contract | Write corresponding logic in a conforming data structure form |
| **6. Testing and verification** | Use case-by-case, rigorous single-step tracking and affirmations | Identify hidden border flaws and ensure code readability |

---

## 7. Classic Challenge 2: The next generation of full-size comparison node collection (`smalls`)

> **Subject specification** Implementing the function  `smalls(t)` Tree receiving the integer tag  `t` Back to all of them. **The label is strictly smaller than all its later generations of node tags** List of non-leaf nodes that make up the \*\*non-leaf Nodes\*\*.

![Classic Challenge 2: Full Comparison Node Collection (smalls) lecture board illustration (00:30:19)](</attachments/cs61a-80a0da0527e9078307478706.png>)
*⏱ Timestamp: 00:30:19 · 📷 Lecture screenshot · [Watch clip (P37 00:30:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1819)*

![Classic Challenge 2: Full Comparison Node Collection (smalls) lecture board illustration (00:32:18)](</attachments/cs61a-f48a7c2e01a9e705c0c0a83b.png>)
*⏱ Timestamp: 00:32:18 · 📷 Lecture screenshot · [Watch clip (P37 00:32:18)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=1938)*

### The difficulty of comparative analysis
- In  `bigs`  In the above, state information is passed downstream from top to bottom (top-down) to descendants.
- In  `smalls`  In this, the state information must be\*\* from bottom to top\*\*\*\* aggregate back and forth\*\*\*\* each node needs to know the minimum value of all its descendants!

---

## 8. A double-arrow sculpture: design of dual-duty auxiliary functions (`smalls`  The perfect realization)

We define the recursion auxiliary function  `process(t)` The mission of the UN Security Council is to "make sure that all citizens are aware of the importance of this issue".
1. **Return value** Back to the drawing board:  `t`  The root of the tree **Definitely the minimum label value**; 
2. **The side effects of collecting** If you are:  `t`  The leaf nodes are not  `t.label`  The smallest of the descendants of all its subtrees is  `t`  Add to the list of results for Closure  `result`  In there!

![Two arrows: design of two-function auxiliary functions (smalls perfect) lecture board illustration (00:34:47)](</attachments/cs61a-bb762eefba11d193c8f227d2.png>)
*⏱ Timestamp: 00:34:47 · 📷 Lecture screenshot · [Watch clip (P37 00:34:47)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=2087)*

![Two arrows: design of dual function support (smalls perfect) lecture board illustration (00:37:17)](</attachments/cs61a-e2eb3c8fc342990dfbe03574.png>)
*⏱ Timestamp: 00:37:17 · 📷 Lecture screenshot · [Watch clip (P37 00:37:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=37&t=2237)*

```python
def smalls(t):
    """返回所有标签小于其所有后代标签的非叶子节点列表。"""
    result = []
    def process(t):
        if t.is_leaf():
            return t.label
        smallest_descendant = min([process(b) for b in t.branches])
        if t.label < smallest_descendant:
            result.append(t)
        return min(t.label, smallest_descendant)
    process(t)
    return result
```

- Baseline conditions: If  `t`  The leaves are straight back.  `t.label` And no more than that.  `result` (Title-limited non-leaf nodes);
- The recursion calculates the minimum value of all branches returning, and is obtained by  `smallest_descendant`; 
- Conditions: If the current label is less than the next generation minimum, the target hit `result.append(t)`; 
- Back to the top: back  `min(t.label, smallest_descendant)` The first step is to continue the decision for the upper parent node.

The whole structure of the solution is like a work of art, united in silence.

---

## Structure and interpretation of computer programs

With the conclusion of Lecture 37, CS61A's 37 lectures have completed their entire course!

I'm going to look at the whole book:
- We have seen how to construct complex abstraction worlds using only the simplest of functions.
- We have an understanding of the physical operation of object systems and environment frame chains;
- We have personally reproduced the Turing-complete interpreter in Scheme, and we understand the supremacy of code - data.
- We have used the mathematical term statistical SQL to summarize bulk data.

May this refined mindset guide you through the future of computer science and software engineering, and help you to create!