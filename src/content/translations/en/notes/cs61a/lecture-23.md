---
kind: notes
source: cs61a/lecture-23
title: Lecture 23 · Efficiency and Complexity Analysis
description: "CS61A Lecture 23: Program Efficiency and Complexity Analysis (Efficiency)"
sourceHash: 5da759eaf8923f019b16132e6e7600f824e7dfd6889b58cd6b0793cf95815edd
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 3: Object-oriented and Efficiency (OOP & Efficiency)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 36:37 ｜ **Classroom screenshots**: 18 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23)  
> **Quick navigation**: [← Previous Lecture (P22 Lecture 22 Composition)](/en/notes/cs61a/lecture-22) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P24 Lecture 24 Decomposition) →](/en/notes/cs61a/lecture-24)

---

## 1. Core mental model and architecture diagram

Evaluating a program is not only about "whether its output is correct," but also about "how much computing resources it consumes." Computing resources mainly include two categories:
1. **Time Complexity**: With input scale  $n$  As the number of steps or calls increases, calculate how the number of steps or calls required increases;
2. **Space Complexity**: During the execution process, the maximum memory peak occupied by active environment frames (Active Environments) and data that are both alive at the same time.

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

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "1. Core Mental Model and Architecture Diagram" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Efficiency measurement and call count decorator (Measuring Efficiency)

Take the classic tree-shaped recursive Fibonacci sequence as an example:

[![Efficiency Measuring and Call Count Decorator (Measuring Efficiency) · Classroom Blackboard Demonstration (00:00:55)](</attachments/cs61a-731293815acaa81628adeae6.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=55)
*⏱ Timestamp: 00:00:55 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=55)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:55)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Thanks, Fibonacci, for making this sequence so popular. If I want to compute Fib 5, that involves summing up the results of Fib 3 and Fib 4. And Fib 3 means summing up 1 and 2. Here, I've marked the base cases with their return values. So to compute Fib 3, I have to do all that work. To compute Fib ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Efficiency measurement and call count decorator (Measuring Efficiency)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


```python
def fib(n):
    if n == 0 or n == 1:
        return n
    return fib(n - 2) + fib(n - 1)
```

Calculate  `fib(5)`  Need to calculate  `fib(3)`  with  `fib(4)`, while  `fib(3)`  Will be counted twice  `fib(1)`  with  `fib(2)`. In order to quantitatively count the total number of calls, we construct a **Function call count decorator (Count Decorator)**: 

[![Efficiency measurement and call count decorator (Measuring Efficiency) · Classroom blackboard demonstration (00:02:45)](</attachments/cs61a-cdaeaf95983dd7e5653d4f70.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=165)
*⏱ Timestamp: 00:02:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:02:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=165)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:02:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Not only returns the result, but also increments the call count attribute, which is an attribute that we'll use to keep track of how many times this function was called. Now, for counted, we have to start out with a call count of zero so that we can increment it later, and then we can return that co...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Efficiency measurement and call count decorator (Measuring Efficiency)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

> **Amazing discovery**: Just to calculate the 30th Fibonacci number, the bottom layer actually executed more than 2.69 million function calls! Most calls are double counting  `fib(0)`, `fib(1)`  with  `fib(2)`.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Efficiency Measuring and Call Counting Decorator (Measuring Efficiency)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Memorization optimization: space for time (Memoization)

**Memoization**  It is a technique for caching the results of expensive function calls. If the exact same actual parameters are encountered in the future, they will be read directly from the cache dictionary and will never be recalculated:

[![Memorization optimization: space for time (Memoization) · Classroom blackboard demonstration (00:04:45)](</attachments/cs61a-836a477f34822e61f6b37457.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=285)
*⏱ Timestamp: 00:04:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=285)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The running time of a program. Here's the simple idea. Just remember the results that have been computed before. So instead of recomputing things when you need their values again, you just keep them around. Here's another decorator. It's called memo. It takes in a function which may take a while to ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Memory optimization: space for time (Memoization)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

[![Memorization optimization: space for time (Memoization) · Classroom blackboard demonstration (00:06:45)](</attachments/cs61a-b975a6820409503d7c6a6e22.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=405)
*⏱ Timestamp: 00:06:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:06:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=405)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:06:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And we put it in the cache with the return value of f event, we return what's in the cache every time, and we return memoized. fib30 used to take a while to compute. But what if we change fib to be a memoized version of fib? Then we can compute fib30 rather quickly. In fact, we can compute fib50 rat...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Memory optimization: space for time (Memoization)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Optimization effects and call tree pruning

Yes  `fib`  After applying memoization:
- `fib(30)`  The actual basis for calculating the number of calls is from  **2,692,537 times**  straight down to  **31 times** (i.e. calculate  $0, 1, 2, \dots, 30$  Once each)!
- Even if calculated  `fib(300)`  It is also completed instantly in milliseconds.

[![Optimization effects and call tree pruning · Classroom blackboard demonstration (00:08:45)](</attachments/cs61a-e2ed12ec05cc0fed649c4c79.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=525)
*⏱ Timestamp: 00:08:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=525)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which we called countedFib in this example, and its call count was 31. Now, why 31? Well, there are 31 different arguments that we pass in. 30, 29, 28, all the way down to 0. And so that's exactly how many times we call the original function. Now, what about 59? Well, let's take a look at what's goi...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Memory optimization: space for time (Memoization)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


> **Call tree pruning diagram**:
Calculating  `fib(5)`  When , the left branch is calculated  `fib(2)`  and  `fib(3)`  And after writing to the cache, the right branch calls  `fib(4)`  When, its sub-branch  `fib(2)`  and  `fib(3)`  Direct hit cache return, fully half of the sub-call tree is completely pruned and ignored!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Memory Optimization: Space for Time (Memoization)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Algorithm-level optimization: case of exponentiation (Linear vs Logarithmic)

Not all performance bottlenecks can rely on memoization; optimization based on algorithmic mathematical logic is the essence of computer science. Exponentiation  $b^n$  For example:

[![Algorithm-level optimization: Power operation case (Linear vs Logarithmic) · Classroom blackboard demonstration (00:11:45)](</attachments/cs61a-9d6f5499f49f9c38f5d72051.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=705)
*⏱ Timestamp: 00:11:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=705)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“This says to raise b to the power n if n is 0, return 1. Otherwise, multiply b to the n minus 1 by b. This is a correct definition, but if I double n, I have to do twice as many multiplies, because each time I make a recursive call, I'm only reducing n by 1. And this function's implementation corres...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Algorithm-level optimization: case of exponentiation (Linear vs Logarithmic)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Algorithm A: Ordinary linear recursion

$$b^n = b \times b^{n-1} \quad (b^0 = 1)$$

```python
def exp(b, n):
    if n == 0:
        return 1
    return b * exp(b, n - 1)
```

input  $n$  Doubled, the number of multiplication operations is also strictly doubled, resulting in **Linear Growth**.

### Algorithm B: Halved Fast Power Algorithm

Take advantage of the square property of even powers: 
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

Each time a square operation is performed, the problem size  $n$  Just cut it in half! this is **Logarithmic Growth**.

### Measured performance comparison (Jupyter Notebook & timeit)

[![Measured performance comparison (Jupyter Notebook & timeit) · Classroom blackboard demonstration (00:13:45)](</attachments/cs61a-8173c853b99efda521a46151.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=825)
*⏱ Timestamp: 00:13:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:13:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=825)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:13:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So this is an instance of linear recursion. And sometimes, the problem size is reduced by half, meaning one more multiplication, in this case by calling square, lets us double the size of the problem that we're handling. And x fast runs faster. Let's take a look. This environment is called a Jupyter...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Algorithm-level optimization: case of exponentiation (Linear vs Logarithmic)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Measured performance comparison (Jupyter Notebook & timeit) · Classroom blackboard demonstration (00:15:15)](</attachments/cs61a-9050614a8bf0bb2ba035c40f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=915)
*⏱ Timestamp: 00:15:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=915)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:15:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“The median time that it takes to execute some line of code. And here's the result. 2 to the 200th power takes a little less than half a millisecond. 2 to the 400th power takes a little less than one millisecond. This looks like a straight line. The term we use to describe this is linear. The time th...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Algorithm-level optimization: case of exponentiation (Linear vs Logarithmic)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Measured performance comparison (Jupyter Notebook & timeit) · Classroom blackboard demonstration (00:16:45)](</attachments/cs61a-a2de8dc4f1afecc774c5ed44.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1005)
*⏱ Timestamp: 00:16:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:16:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1005)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:16:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And what about the difference between going from 400 to 800? Well, that's another 0.002. Going from 800 to 1600 is another 0.002. Every time we double the input, it just takes a constant amount of extra work. And that's because we're making recursive calls on n that's only half the size. That's call...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Algorithm-level optimization: case of exponentiation (Linear vs Logarithmic)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


- **linear algorithm**: Calculation  $2^{400}$  It takes about 1ms to calculate  $2^{1600}$  It takes about 4ms, and the time curve is a straight sloping straight line.
- **Fast exponentiation algorithm**: Calculation  $2^{1600}$  It only takes 0.04ms to double the size from 400 to 800 and then double to 1600, and the time consumption only increases by a constant 0.002ms each time!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Algorithm-level optimization: Power operation case (Linear vs Logarithmic)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Orders of Growth & Big-Theta

Computer scientists use asymptotic notation to mask specific machines, operating systems, and microsecond-level jitters to describe the scaling trends of algorithms at a macro level:

[![Orders of Growth & Big-Theta · Classroom Blackboard Demonstration (00:18:45)](</attachments/cs61a-473e6d11e167e7289043b5ea.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1125)
*⏱ Timestamp: 00:18:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:18:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1125)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:18:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Now, that's not a topic in this course, but it is covered extensively in future courses at Berkeley, and it's a standard part of the computer science curriculum. Rather than telling you all the definitions, which you're welcome to look up on your own, I will show you the standard notation that's ass...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Orders of Growth & Big-Theta", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Orders of Growth & Big-Theta · Classroom Blackboard Demonstration (00:20:15)](</attachments/cs61a-0bee61159026c2e4a628a1e9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1215)
*⏱ Timestamp: 00:20:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:20:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1215)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:20:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Another common set of notation is big O notation, which is even more fun to say than big theta. And the expressions look the same. So big theta of B to the N or big O of B to the N. Now, these actually mean something slightly different. Big O describes the upper bound for the time it takes for a fun...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Orders of Growth & Big-Theta", the interpreter strictly follows the core evaluation convention;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Big-$\Theta$ vs Big-$O$

- **Big-$\Theta$ (Tight Bound)**: Describes the upper and lower bounds of the algorithm running time, such as  $\Theta(n)$  Indicates that the time taken is neither slower nor faster than a linear constant.
- **Big-$O$ (Upper Bound)**: Describes the maximum time-consuming upper limit of the algorithm in the worst case, such as  $O(n^2)$  It means that the time consumption is at most quadratic level.

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "5. Orders of Growth & Big-Theta" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Panoramic analysis of five common growth stages

[![Panoramic analysis of five common growth stages · Classroom blackboard demonstration (00:22:45)](</attachments/cs61a-2f49761b6e1cdce77343928b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1365)
*⏱ Timestamp: 00:22:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1365)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:22:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And the elements in B. By going through every element in A, and every element in B, and checking to see if they're the same. It adds a count when they are, and returns the count at the end. So the overlap between 3 5 7 6 and 4 5 6 5 is 3, because 5 5 are the same, 5 5 are the same, and 6 6 are the s...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Panoramic analysis of five common growth orders", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Panoramic analysis of five common growth stages · Classroom blackboard demonstration (00:24:45)](</attachments/cs61a-a78d9037100c3dc9a938e651.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1485)
*⏱ Timestamp: 00:24:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:24:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1485)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:24:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Fib3 requires all this additional work, fib4 requires all this additional work on top of fib3, and fib5 has to compute not only fib4, but all of this additional work as well, assuming we don't memoize. So a tree recursive function like this without memoization will take what's called exponential tim...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Panoramic analysis of five common growth orders", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Panoramic analysis of five common growth stages · Classroom blackboard demonstration (00:26:45)](</attachments/cs61a-b632182c62740d25e49c2005.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1605)
*⏱ Timestamp: 00:26:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:26:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1605)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:26:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Each of these categories can be described by a simple equation where we've written down the general time that it takes to process an input of size n plus one in terms of the time that it takes to process an input of size n using some constants a and b to account for the fact that There are many deta...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "6. Panoramic analysis of five common growth orders", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


| growth stage | progressive notation | scale growth effect ($n \to n+1$  or  $n \to 2n$) | Typical algorithms/operations |
| :--- | :--- | :--- | :--- |
| **Constant** | $\Theta(1)$ | increase  $n$  No impact on time at all | Python dictionary key lookup, list subscript index |
| **Logarithmic** | $\Theta(\log n)$ | $n$  Double ($2n$), the time consumption only increases by a constant step | Binary search, fast exponentiation  `exp_fast` |
| **Linear** | $\Theta(n)$ | $n$  Increasing by 1 will take a constant step; $n$  Double the time, double the time | Traversing lists, ordinary recursion  `exp` |
| **Quadratic** | $\Theta(n^2)$ | $n$  increase by 1,increase  $c \cdot n$  step; $n$  Doubling time increased to 4 times | Double nested loop, element pair comparison  `overlap` |
| **Exponential** | $\Theta(b^n)$ | $n$  Increase by 1, time consuming **multiply by** constant factor  $b$ | Unmemorized tree recursion  `fib` |

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Panoramic Analysis of Five Common Growth Orders" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 7. Space Complexity and Active Environment Frame Management (Space Complexity)

The memory occupied by the program not only comes from the stored data, but also from the persistence of \*\*Environment Frames\*\*.

[![Space Complexity and Active Environment Frame Management (Space Complexity) · Classroom Blackboard Demonstration (00:30:45)](</attachments/cs61a-339a78f0a2eee15261894184.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1845)
*⏱ Timestamp: 00:30:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:30:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1845)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:30:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So, the new concepts we need to keep track of are which environment frames do we need to keep around during evaluation, and which ones can we just let go. So here's the story. At any moment, there's a set of what are called active environments, and values and frames in those active environments cons...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Space Complexity and Active Environment Frame Management (Space Complexity)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Space Complexity and Active Environment Frame Management (Space Complexity) · Classroom Blackboard Demonstration (00:32:45)](</attachments/cs61a-d43efd84e9bbbc2ce6875228.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1965)
*⏱ Timestamp: 00:32:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:32:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=1965)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:32:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“And fib4 involves calling fib2. And so all of these are active frames at the same time. fib2 calls fib0. fib0 actually returns. And once it returns, it's no longer active. And so it's just going to disappear. And in its stead, we have replaced it with a frame for fib1. So notice, we had f1 and f2 an...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Space Complexity and Active Environment Frame Management (Space Complexity)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


### Active Environments Rule

1. **Unreturned function frame**: Only if it is being evaluated and has not yet been returned (has not been executed yet)  `return`) function call frame will reside in the memory;
2. **Closure parent frame**: If an active function refers to the parent function frame in which it is nested, the parent frame must remain alive;
3. **Frame destruction and recycling**: Once the function returns, its local frame immediately becomes useless garbage and is automatically recycled and reused by the interpreter.

### Measured maximum number of active frames  `count_frames`

[![Measured maximum number of active frames count\_frames · Classroom blackboard demonstration (00:34:45)](</attachments/cs61a-777fa9193e80798afb90e102.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2085)
*⏱ Timestamp: 00:34:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:34:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2085)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:34:45)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“By calling f on n, now it's time to close this frame, which just means subtracting 1 from the open count. And then we can return the result. The open count starts out at 0, the max count starts out at 0, and we can return the counted function. So if we define fib really quick, we already know that i...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Space Complexity and Active Environment Frame Management (Space Complexity)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Measured maximum number of active frames count\_frames · Classroom blackboard demonstration (00:36:15)](</attachments/cs61a-2d351b976fdba25c0f28db8b.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2175)
*⏱ Timestamp: 00:36:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P23 00:36:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23&t=2175)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:36:15)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“We still have to do all this work, and we're about to return from this call to fib1. Well, we can figure out which calls have an active environment. It's this one, this one, this one, and this one, which haven't returned yet. The ones over on the left have already been called and returned. So any me...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "7. Space Complexity and Active Environment Frame Management (Space Complexity)", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the exam questions related to "Time and Space Complexity Analysis (O, Theta, Omega), Logarithmic Linear Exponential Step", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


By writing a higher-order tracer, we can monitor tree recursions  `fib`  The maximum instantaneous call stack depth is:

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

> **Core conclusion**:
Although not memorized  `fib(20)`  will generate hundreds of thousands of function calls, but its **The maximum number of frames active at the same time is only 20**!
Space complexity of tree recursion  $\Theta(n)$  corresponds to **The deepest single-link path of the call tree from root to leaf**, not the total number of nodes!

---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "7. Space Complexity and Active Environment Frame Management (Space Complexity)" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 8. Chapter summary and core test points

1. **First choice for performance diagnostics**: When encountering repeated sub-problem tree recursion, the memoized mode is used first to cache pure function results.
2. **Progressive Analysis Core Ideas**: Grasp the big and let go of the small, and pay attention to the growth pattern of marginal cost when the scale doubles (constant/logarithmic/linear/square/exponential).
3. **space-time asymmetry**: The time complexity of tree recursion can be as high as exponential  $\Theta(2^n)$, but its peak call stack space is only linear tree height  $\Theta(n)$.

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "8. Chapter Summary and Core Test Points" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.



---

## Berkeley Midterm/Final classic high-frequency exam questions in-depth practice

### Practical exam questions: Environment topology and microstate tracking (WWPD & Environment Diagrams)
Consider the following microscopic execution of Python code in an interactive environment:

```python
# 经典作用域与高阶函数综合考题
x = 10

def outer(x):
    y = x + 2
    def inner(y):
        return x + y
    return inner

f = outer(5)
result = f(3)
```

#### Complete problem-solving thinking model and multi-frame environment map derivation:
1. **Global Frame initialization**: 
   - global variables  `x`  Bind to integer object  `10`; 
   - global function  `outer`  Binds to the newly created function object whose embedded  `parent = Global`; 
2. **execute  `f = outer(5)`**: 
   - create a local frame  $f_1$, mark  `f1: outer [parent=Global]`; 
   - formal parameters  `x`  Bind to actual parameters  `5`; 
   - local variables  `y`  bind to  `5 + 2 = 7`; 
   - in  $f_1$  internal execution  `def inner(y):`, create a function object  `inner`, its embedded  **`parent = f1`**; 
   - Return function object  `inner`, global variables  `f`  Bind to this object;
3. **execute  `result = f(3)`**: 
   - call function  `f` (i.e.  `inner`), open up a local frame  $f_2$; 
   - **core scoring points**:frame  $f_2$  Who does parent point to?
   - **iron law**: function  `inner`  is in frame  $f_1$  is defined internally, so  $f_2$  of  **`parent = f1`**!
   - formal parameters  `y`  Bind to actual parameters  `3`; 
   - executor  `return x + y`: 
     - in current frame  $f_2$  Find  `y`: Hit local variable  `y = 3`; 
     - in current frame  $f_2$  Find  `x`: miss, trace back along parent  **$f_1$  frame**  Find it!
     - in  $f_1$  hit in frame  `x = 5` (Global  `x = 10`  Partially obscured! );
     - Calculate  `5 + 3 = 8`, as the return value;
4. **Final output conclusion**: 
   - global variables  `result = 8`.

---

## Knowledge Matrix of the core concepts of this lecture

| core knowledge dimension | Formal definition and mechanism | Typical code examples | Core Engineering and Algorithm Value | Common pitfalls |
| :--- | :--- | :--- | :--- | :--- |
| **Basic evaluation semantics** | The expression is evaluated to obtain a value, and the execution of the statement changes the internal state. | `x = 2 + 3` | Build a discrete-time state snapshot mental model | Mistaking the assignment equal sign as a dynamic constraint on an algebraic equation |
| **Environment frame topology** | The environment is an ordered chain of frames | `Global -> f1 -> f2` | Implement safe isolation of lexical scope and variables | Confusing the caller stack frame with the parent environment pointer at the definition point |
| **abstract barrier** | Isolate implementation details and calling logic through functional interfaces | `def square(x): ...` | Reduce cognitive load on large-scale systems | Destroying interfaces directly relies on underlying private data structures |
| **control flow decisions** | Conditional branch short-circuit evaluation and loop iteration progression | `if cond: ... while: ...` | Give programs non-linear decision-making and large-scale data processing capabilities | Missing the loop progression variable causes an infinite loop |
| **higher level abilities** | Functions as first-class citizens (parameter passing, return, assignment) | `make_adder(3)` | Implement factory pattern, closure persistent state and currying | Closure late binding throws loop variable capture error |

---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Lecture 22 Composition](/en/notes/cs61a/lecture-22) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 24 Decomposition →](/en/notes/cs61a/lecture-24) | [🎬Watch this lecture on Bilibili (P23)](https://www.bilibili.com/video/BV1sy411z7nA/?p=23) |
