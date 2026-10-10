---
kind: notes
source: cs61a/lecture-23
title: Lecture 23 · Efficiency and Complexity Analysis
description: "CS61A Lecture 23: Program efficiency and complexity analysis."
sourceHash: 6db232273e5c117fa95ec3b2135951d6efa2e95f1859da4e47b8521264b31923
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 36:37 ｜ **Video link back**: [B station response unit set (P23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23)

## 1. Core mind model and architecture

Evaluating a program involves both the correctness of its output and the computational resources it consumes. There are two main kinds of resources:
1. **The time complexity** As the input scale increases:  $n$  The number of steps required to calculate the number of calls or how to increase the number of call times;
2. **Space complexity** In the execution process, both the active environment frame\*\* and the maximum memory peak occupied by data are in a living state.

```
时间增长阶谱系 (Orders of Growth):
  耗时 (Time)
   ▲
   │                                  Exponential: Θ(2ⁿ) [未记忆化斐波那契]
   │                                     /
   │                                    /   Quadratic: Θ(n²) [所有数对对比 overlap]
   │                                   /   /
   │                                  /   /   Linear: Θ(n) [普通递归 exp]
   │                                 /   /   /
   │                                /   /   /   Logarithmic: Θ(log n) [折半快速幂 exp_fast]
   │                               /   /   /   /
   │                              /   /   /   /──── Constant: Θ(1) [字典键查找]
   └────────────────────────────────────────────────────────► 输入规模 (n)

空间管理法则：
  • 仅有当前正在执行（未 return）的函数调用及其父环境帧占用内存；
  • 已经返回的调用帧会被 Python 垃圾回收机制立即释放；
  • 递归树的栈空间消耗仅取决于其最深单条调用链路（Max Depth），而非整棵树的节点总数！
```

---

## 2. Measuring Efficiency (Measuring Efficacy) Decorator for efficiency measurement and call counting

The classic tree-shaped recursion Fibonacci numbers are as follows:

![Measuring Efficacy lecture board illustration (00:00:55)](</attachments/cs61a-731293815acaa81628adeae6.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P23 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=55)*

```python
def fib(n):
    if n == 0 or n == 1:
        return n
    return fib(n - 2) + fib(n - 1)
```

Calculation  `fib(5)`  Need to calculate  `fib(3)`  and  `fib(4)` and  `fib(3)`  It's a countdown.  `fib(1)`  and  `fib(2)` In order to quantify the total number of calls, we construct a **The function call count decorator**: 

![Measuring and Calling Efficacy (Measuring Efficacy) lecture board illustration (00:02:45)](</attachments/cs61a-cdaeaf95983dd7e5653d4f70.png>)
*⏱ Timestamp: 00:02:45 · 📷 Lecture screenshot · [Watch clip (P23 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=165)*

```python
def count(f):
    """统计函数 f 累计被调用次数的装饰器。"""
    def counted(n):
        counted.call_count += 1
        return f(n)
    counted.call_count = 0
    return counted

fib = count(fib)
fib(5)   # 输出 5，fib.call_count 为 15 次
fib(30)  # 计算 832040，fib.call_count 高达 2,692,537 次！
```

> **The surprise was** In order to calculate the 30th Fibonacci number, the bottom has actually performed over 269 million function calls!  `fib(0)`, `fib(1)`  and  `fib(2)`.

---

## 3. memoization optimization: space-time (Memoization)

**The first is the memoization.**  It is a technique that caches the results of expensive function calls. If you encounter exactly the same argument in the future, read directly from the caching dictionary and never repeat the calculation:

![Memoration lecture board illustration (00:04:45)](</attachments/cs61a-836a477f34822e61f6b37457.png>)
*⏱ Timestamp: 00:04:45 · 📷 Lecture screenshot · [Watch clip (P23 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=285)*

```python
def memo(f):
    """记忆化装饰器：仅适用于纯函数（Pure Functions）。"""
    cache = {}
    def memoized(n):
        if n not in cache:
            cache[n] = f(n)
        return cache[n]
    return memoized
```

![Memoration lecture board illustration (00:06:45)](</attachments/cs61a-b975a6820409503d7c6a6e22.png>)
*⏱ Timestamp: 00:06:45 · 📷 Lecture screenshot · [Watch clip (P23 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=405)*

### Optimizing the effect and calling tree pruning

Yes, I did.  `fib`  After applying memoization:
- `fib(30)`  The actual basis of computing the number of calls from  **The number of times**  Right down to the ground.  **31 times** (i.e., calculating  $0, 1, 2, \dots, 30$  One by one!
- Even when it comes to calculating  `fib(300)`  The first is the "Milliseconds" moment.

![Optimizing effects and calling for tree trims lecture board illustration (00:08:45)](</attachments/cs61a-e2ed12ec05cc0fed649c4c79.png>)
*⏱ Timestamp: 00:08:45 · 📷 Lecture screenshot · [Watch clip (P23 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=525)*

> **Calling Tree Cuttings** In computing:  `fib(5)`  The left branch is counting.  `fib(2)`  and  `fib(3)`  And after writing the cache, the right branch calls  `fib(4)`  The branch is now  `fib(2)`  and  `fib(3)`  The direct hit cache returned, and half the entire sub-call tree was completely cut down!

---

## 4. Algorithmic optimization: Linear vs Logarithmic

Not all performance bottlenecks rely on memoization; optimizing from algorithmic mathematical logic is at the heart of computer science.  $b^n$  For example:

![Algorithmic Optimization: A case (Linear vs Logarithmic) lecture board illustration (00:11:45)](</attachments/cs61a-9d6f5499f49f9c38f5d72051.png>)
*⏱ Timestamp: 00:11:45 · 📷 Lecture screenshot · [Watch clip (P23 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=705)*

### Algorithm A: Common linear recursion

$$b^n = b \times b^{n-1} \quad (b^0 = 1)$$

```python
def exp(b, n):
    if n == 0:
        return 1
    return b * exp(b, n - 1)
```

Input  $n$  The number of times the multiplication operation is also strictly doubled, and it is **The first is the linear growth.**.

### Algorithm B: Folding and halving fast algorithm

Using the square of the even number of sides: 
$$b^n = (b^{n/2})^2 \quad (\text{当 } n \text{ 为偶数})$$
$$b^n = b \times b^{n-1} \quad (\text{当 } n \text{ 为奇数})$$

```python
def square(x):
    return x * x

def exp_fast(b, n):
    if n == 0:
        return 1
    elif n % 2 == 0:
        return square(exp_fast(b, n // 2))
    else:
        return b * exp_fast(b, n - 1)
```

The scale of the problem is calculated by using a square operation  $n$  It's half that! **The logarithmic growth of numbers**.

### Performance Comparison with Jupyter Notebook and timeit

![The first is the "Jupyter Notebook & timeit" lecture board illustration (00:13:45).](</attachments/cs61a-8173c853b99efda521a46151.png>)
*⏱ Timestamp: 00:13:45 · 📷 Lecture screenshot · [Watch clip (P23 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=825)*

![The first is the "Jupyter Notebook & timeit" lecture board illustration (00:15:15)](</attachments/cs61a-9050614a8bf0bb2ba035c40f.png>)
*⏱ Timestamp: 00:15:15 · 📷 Lecture screenshot · [Watch clip (P23 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=915)*

![Performance comparison (Jupyter Notebook & timeit) lecture board illustration (00:16:45)](</attachments/cs61a-a2de8dc4f1afecc774c5ed44.png>)
*⏱ Timestamp: 00:16:45 · 📷 Lecture screenshot · [Watch clip (P23 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1005)*

- **Linear algorithms**: Calculation  $2^{400}$  It takes about 1ms to calculate  $2^{1600}$  The time curve is a straight line with the pen tilted.
- **The fast-flowing algorithm**: Calculation  $2^{1600}$  It takes just 0.04ms, doubled from 400 to 800 and then doubled to 1600, taking only a constant 0.002ms each time!

---

## 5. Orders of Growth & Big-Theta

Computer scientists use step symbols to block specific machines, operating systems and microsecond vibrations to describe the scale-up trend of algorithms from a macro perspective:

![Orders of Growth & Big-Theta (00:18:45) · lecture board illustration](</attachments/cs61a-473e6d11e167e7289043b5ea.png>)
*⏱ Timestamp: 00:18:45 · 📷 Lecture screenshot · [Watch clip (P23 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1125)*

![Orders of Growth & Big-Theta (00:20:15) · lecture board illustration](</attachments/cs61a-0bee61159026c2e4a628a1e9.png>)
*⏱ Timestamp: 00:20:15 · 📷 Lecture screenshot · [Watch clip (P23 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1215)*

### Big-$\Theta$ vs Big-$O$

- **Big-$\Theta$ (Tight Bound)** The algorithm describes the upper and lower boundaries of running time, as follows:  $\Theta(n)$  The term "time-consuming" is defined as the number of times a linear constant can be used, neither slowly nor quickly.
- **Big-$O$ (Upper Bound)** Description: Maximum time limits for algorithms in worst case scenario such as  $O(n^2)$  The secondary level is the maximum time spent.

---

## 6. Analysis of the five most common growth phases

![5 Common Growth Level Panorama Analysis lecture board illustration (00:22:45)](</attachments/cs61a-2f49761b6e1cdce77343928b.png>)
*⏱ Timestamp: 00:22:45 · 📷 Lecture screenshot · [Watch clip (P23 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1365)*

![The five most common growth phases of the whole picture analysis lecture board illustration (00:24:45)](</attachments/cs61a-a78d9037100c3dc9a938e651.png>)
*⏱ Timestamp: 00:24:45 · 📷 Lecture screenshot · [Watch clip (P23 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1485)*

![The five most common growth phases of the whole picture analysis lecture board illustration (00:26:45)](</attachments/cs61a-b632182c62740d25e49c2005.png>)
*⏱ Timestamp: 00:26:45 · 📷 Lecture screenshot · [Watch clip (P23 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1605)*

| Stage of growth | The gradual signs | The impact of scale growth ($n \to n+1$  or  $n \to 2n$) | Typical algorithms / operations |
| :--- | :--- | :--- | :--- |
| **The constant is the constant.** | $\Theta(1)$ | Increase  $n$  It has no effect on time at all. | Python dictionary key search, list of sub-index |
| **Logarithmic is the logarithmic number of degrees.** | $\Theta(\log n)$ | $n$  Double the number of people $2n$ (a) It takes only increasing the number of steps | Two-point search, quick throw  `exp_fast` |
| **Linear stages** | $\Theta(n)$ | $n$  Add 1, add the constant step; $n$  The time spent on the project is doubled. | A list of common recursions  `exp` |
| **Quadratic** | $\Theta(n^2)$ | $n$  Added 1, increased  $c \cdot n$  steps; $n$  The number of people who are using the internet has doubled to four times | Double nested loop, elemental comparison  `overlap` |
| **Exponential** | $\Theta(b^n)$ | $n$  Added 1, time consuming **Multiply** The constant factor  $b$ | The tree-shaped recursion of non-memoization  `fib` |

---

## 7. space complexity and active environment frame management

The memory of the program is not only from data stored but also from the residency of the environment frame.

![space complexity and Active environment frame Management (Space Complex) lecture board illustration (00:30:45)](</attachments/cs61a-339a78f0a2eee15261894184.png>)
*⏱ Timestamp: 00:30:45 · 📷 Lecture screenshot · [Watch clip (P23 00:30:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1845)*

![space complexity and Active environment frame Management (Space Complex) lecture board illustration (00:32:45)](</attachments/cs61a-d43efd84e9bbbc2ce6875228.png>)
*⏱ Timestamp: 00:32:45 · 📷 Lecture screenshot · [Watch clip (P23 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1965)*

### The active environment rule

1. **Unreported function array**: Only being evaluation and not returned (not completed)  `return` The function call array (FCC) is stored in memory.
2. **Closure Father** If an active function is referenced to the parent function node defined by the nest, that parent node must be continuously enabled;
3. **Destruction and recycling** Function: Once returned, its local memory is immediately rendered useless and recycled by the interpreter.

### Testing the maximum number of active monkeys  `count_frames`

![Maximum active frame measured lecture board illustration (00:34:45)](</attachments/cs61a-777fa9193e80798afb90e102.png>)
*⏱ Timestamp: 00:34:45 · 📷 Lecture screenshot · [Watch clip (P23 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2085)*

![Maximum active frame measured country\_frames lecture board illustration (00:36:15)](</attachments/cs61a-2d351b976fdba25c0f28db8b.png>)
*⏱ Timestamp: 00:36:15 · 📷 Lecture screenshot · [Watch clip (P23 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2175)*

By writing a higher-order tracker, we can monitor tree-shaped recursions.  `fib`  The biggest moment of calling deep:

```python
def count_frames(f):
    def counted(n):
        counted.open_count += 1
        if counted.open_count > counted.max_count:
            counted.max_count = counted.open_count
        result = f(n)
        counted.open_count -= 1
        return result
    counted.open_count = 0
    counted.max_count = 0
    return counted

fib = count_frames(fib)
fib(20)
print(fib.max_count)  # 输出: 20！
```

> **Key conclusion**: Despite unremembered  `fib(20)`  The function calls will be hundreds of thousands, but the **The maximum number of monkeys active at the same time is only 20.** Tree space complexity of recursion  $\Theta(n)$  The **Calling the deepest single chain path from root to leaf** It's not the total number of nodes!

---

## Chapter 8 Summary and Core Points

1. **Performance diagnostics are the first choice** Recursion: encounter recursive tree-shaped recursion of the subproblem, prioritize application of memoization mode to cache pure function results.
2. **Gradual analysis of the core ideas** The following is a list of the most common types of marginal cost growth: large scale, small scale, and attention to the doubling of size.
3. **Asymmetrical Time and Space** Tree-shaped recursion time complexity can reach an index  $\Theta(2^n)$ The summit of the calcium space is only linear trees.  $\Theta(n)$.

---

