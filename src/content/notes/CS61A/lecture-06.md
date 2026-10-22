---
date: 2026-10-09
tags:
  - cs61a
status: completed
publish: true
title: Lecture 06 · Sound (Optional)：高阶函数实战——从零合成音乐与超级马里奥
description: CS61A 第 6 讲：Sound (Optional)：高阶函数实战——从零合成音乐与超级马里奥
topic: CS61A
order: 6
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61A (Fall 2024)  
> **所属模块**：Module 1: 函数与抽象 (Functions & Abstraction)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **视频时长**：14:36 ｜ **课堂截图**：10 张板书/代码演示  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6)  
> **快速导航**：[← 上一讲 (P05 Lecture 5 Environments)](/notes/cs61a/lecture-05) ｜ [📚 返回全书目录](/notes/topics/CS61A) ｜ [下一讲 (P07 Lecture 7 Functional Abstraction) →](/notes/cs61a/lecture-07)

---

## 1. 为什么要学习高阶函数？在“函数空间”中编程

*(参考时间：00:00:00 · [视频跳转 (P6 00:00:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=0))*

在学习高阶函数时，许多同学会产生疑问：像 `make_adder` 这样的工厂函数固然精巧，但我们为什么不直接写 `x + y`，非要在函数外面再套一层高阶函数呢？

为了让大家真切体会高阶函数在实际系统架构中的威力，DeNero 教授设计了一个引人入胜的实战项目：**不依赖任何第三方音频库，仅用 Python 内置模块和高阶函数，从数学原理出发直接合成音乐（超级马里奥主题曲）！**

### 数字化声波与采样原理（Sampling）

声波在物理上是空气压强的连续振动。计算机通过**采样（Sampling）**将其离散数字化：
- **采样率（Frame Rate）**：每秒记录声波振幅的次数（如 11,000 次/秒）。
- **振幅（Amplitude）**：在任意时刻 $t$，声波的高低强弱。

[![声音波形采样原理图：连续声波与离散采样点 Sampling](</attachments/cs61a-cc0eb85c133dc7aabf8327ba.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)
*⏱ 时间戳：00:00:54 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:00:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)*

#### 📸 课堂板书与代码演示深入精读 (00:00:54)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So what we're going to do is write down a WAV file. That's a standard format for encoding sounds. It's not used much these days because it takes a lot of space. It's a really simple format that doesn't involve any compression at all. But it's really simple to generate a WAV file, so that's why we'll...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「1. 为什么要学习高阶函数？在“函数空间”中编程」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


在电子音乐合成中，常见的四种基础波形包括：**正弦波（Sine Wave）**、**方波（Square Wave）**、**三角波（Triangle Wave）** 和 **锯齿波（Sawtooth Wave）**。其中三角波谐波温润、没有方波的刺耳杂音，非常适合在小型合成器中模拟管乐与电子乐器。

[![四种基础电子乐声波波形：正弦波、方波、三角波与锯齿波](</attachments/cs61a-f03ecd0995c8b7ae75dcfa6e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)
*⏱ 时间戳：00:01:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:01:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)*

#### 📸 课堂板书与代码演示深入精读 (00:01:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So the wave itself looks like this. We take lots of samples at particular moments in time, and we're going to take, for example, 11,000 different samples every minute in order to get as close an approximation to this structure of this wave as we need so that it sounds cool to the human ear. And usua...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「1. 为什么要学习高阶函数？在“函数空间”中编程」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「1. 为什么要学习高阶函数？在“函数空间”中编程」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 2. 声波采样器：用函数建模连续时间

*(参考时间：00:02:05 · [视频跳转 (P6 00:02:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=125))*

传统面向数据的编程往往会创建一个巨大的列表或数组来保存数百万个音频采样点，这会消耗大量内存。而在函数式编程中，我们将一段声音建模为一个**数学函数（Sampler）**：
$$f: t \longrightarrow [-1.0, 1.0]$$
输入是当前已播放的采样序号 $t$，输出是该时刻的振幅值。

### 原生 WAV 写入器

```python
import wave, struct
from math import floor

frame_rate = 11025

def encode(x):
    """将 [-1, 1] 的浮点振幅转换为 16 位有符号整数。"""
    i = int(16384 * x)
    return struct.pack('<h', i)

def play(sampler, name='song.wav', seconds=2):
    """根据 sampler 函数生成指定时长的 WAV 文件并写入磁盘。"""
    out = wave.open(name, 'wb')
    out.setnchannels(1)
    out.setsampwidth(2)
    out.setframerate(frame_rate)
    t = 0
    while t < seconds * frame_rate:
        sample = sampler(t)
        out.writeframes(encode(sample))
        t += 1
    out.close()
```

[![Python 原生 WAV 文件写入器：采样率 Frame Rate 与 Sampler 函数定义](</attachments/cs61a-f8f8168cc5d984bf28f0786a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)
*⏱ 时间戳：00:03:00 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:03:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)*

#### 📸 课堂板书与代码演示深入精读 (00:03:00)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Which takes a number and rounds it to the greatest integer that's less than that value. Now we pick a frame rate, that's the sampling rate. How many times per second do we want to have some value that tells us how high or low is the waveform of the sound? And here's the part that I don't think you s...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「2. 声波采样器：用函数建模连续时间」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「2. 声波采样器：用函数建模连续时间」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 3. 数学发生器：三角波高阶函数

*(参考时间：00:04:30 · [视频跳转 (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270))*

如何根据给定的音高频率（Frequency）和音量（Amplitude）动态生成三角波采样函数？

```python
def tri(frequency, amplitude=0.3):
    """返回一个在指定频率和音量下振荡的三角波采样函数。"""
    period = frame_rate // frequency
    def sampler(t):
        saw1 = (t % period) / period
        saw2 = 2 * saw1 - 1
        return amplitude * (2 * abs(saw2) - 1)
    return sampler

# 中央 C 音高频率为 261.63 Hz
c_freq = 261.63
c = tri(c_freq)
```

[![三角波生成函数 tri：频率计算、周期与锯齿绝对值折叠](</attachments/cs61a-bea5aa78c0ba120762829fd9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)
*⏱ 时间戳：00:04:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)*

#### 📸 课堂板书与代码演示深入精读 (00:04:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“In order to generate the wave file that our computer will actually be able to play. So sampler is some function that we're going to need to generate that gives us numbers between negative one and one and describes the samples of the wave. So if we were trying to generate this sound, then the sampler...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 数学发生器：三角波高阶函数」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


`tri` 是一个高阶函数：输入频率参数，返回一个绑定了周期和振幅的闭包函数 `sampler(t)`。当在终端打印采样点时，可以看到振幅在 $-0.3$ 与 $+0.3$ 之间呈现出完美的周期性线性三角振荡。

[![终端采样数值轨迹：三角波从 -0.3 到 +0.3 的振荡走势](</attachments/cs61a-e83139df693c57bb8042648f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)
*⏱ 时间戳：00:05:50 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:05:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)*

#### 📸 课堂板书与代码演示深入精读 (00:05:50)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“At the frequency of C. Let's set T equal to zero. While it's the case that T is less than 100, I'm going to print out what I get when I call C on T, and then I'm going to increase T by one, and we'll see the shape of the triangle wave. Okay, so it starts out at negative .3, because that's my amplitu...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「3. 数学发生器：三角波高阶函数」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「3. 数学发生器：三角波高阶函数」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 4. 高阶组合子：和声叠加与时间切片

*(参考时间：00:06:33 · [视频跳转 (P6 00:06:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=393))*

有了单个音调后，如何将其组合成音乐？我们需要两个核心高阶函数：**空间叠加（和弦）** 与 **时间序列（节奏）**。

### 叠加组合子：both

声波物理学告诉我们，两股声音同时发声，其振幅是线性相加的。我们可以编写一个高阶函数 `both`，接受两个声波函数 `f` 和 `g`，返回一个新的和声函数：

```python
def both(f, g):
    """返回同时播放 f 和 g 的声波函数。"""
    return lambda t: f(t) + g(t)
```

只需一行代码，我们就能演奏双音和弦：
```python
e_freq = 329.63
e = tri(e_freq)
chord = both(c, e)  # C 音与 E 音构成的和谐双音
```

[![高阶函数 both：返回两个声波函数并联叠加的和声新函数](</attachments/cs61a-00251eff697aa18c54e15872.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)
*⏱ 时间戳：00:07:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:07:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)*

#### 📸 课堂板书与代码演示深入精读 (00:07:05)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“So things are getting interesting. Now I can play a sound. And the sound just sounds like a flat tune. But that's something I can work with. I can take a function, like what comes out from Try, and combine it with other functions in order to make music. So next, let's write down the frequencies for ...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 高阶组合子：和声叠加与时间切片」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 时间切片与淡入淡出（Note & Fade）

现实音乐中的音符不是永无止境响着的，必须具备起始时间（`start`）和结束时间（`end`）。如果硬生生将振幅切断为 0，会导致扬声器纸盆瞬间位移产生刺耳的“咔哒”爆音（Pop / Click）。

为此，我们需要在音符头部增加极短（如 0.01 秒）的线性**淡入（Fade In）**，并在尾部增加**淡出（Fade Out）**：

```python
def note(f, start, end, fade=0.01):
    """返回在 [start, end] 秒区间内发声的音符函数，附带平滑淡入淡出。"""
    def sampler(t):
        seconds = t / frame_rate
        if seconds < start or seconds > end:
            return 0
        elif seconds < start + fade:
            return (seconds - start) / fade * f(t)
        elif seconds > end - fade:
            return (end - seconds) / fade * f(t)
        else:
            return f(t)
    return sampler
```

[![高阶函数 note：给声波添加时间窗口 start 与 end 的节奏控制](</attachments/cs61a-a1457450b4718acb54acd465.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)
*⏱ 时间戳：00:08:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)*

#### 📸 课堂板书与代码演示深入精读 (00:08:10)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“That's T divided by the frame rate. Then checks to see whether those seconds are between start and end. If seconds are less than start, return zero. If seconds are greater than end, return zero. Otherwise, just play the sound. And the sound in this case is a function where we just call that function...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 高阶组合子：和声叠加与时间切片」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


[![淡入淡出 Fade-in/out 实现：消除音频硬切爆音的线性加权算法](</attachments/cs61a-c55ea4da8031a58dabe86d50.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)
*⏱ 时间戳：00:10:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)*

#### 📸 课堂板书与代码演示深入精读 (00:10:20)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Seconds is less than start plus the fade-in time. Then what we're going to do is compute the difference between seconds and the start. So that's how far into the sound we're in. And we'll divide by the fade length to get a percentage of the fade. And we'll multiply that by f of t. If it's time to fa...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「4. 高阶组合子：和声叠加与时间切片」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「4. 高阶组合子：和声叠加与时间切片」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 5. 谱写超级马里奥：函数驱动的音乐结构

*(参考时间：00:10:57 · [视频跳转 (P6 00:10:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=657))*

现在我们拥有了乐高积木般的所有函数原语：`tri`、`both` 和 `note`。我们来谱写《超级马里奥兄弟》标志性的开场跳跃琶音！

```python
c_freq = 261.63
e_freq = 329.63
g_freq = 392.00

def mario(c, e, g, low_g):
    """根据传入的音调函数，拼装出超级马里奥经典主旋律函数。"""
    z = 0
    song = note(e, z, z + 1/8)
    z += 1/8
    song = both(song, note(e, z, z + 1/8))
    z += 1/4  # 包含一个八分休止符
    song = both(song, note(e, z, z + 1/8))
    z += 1/8
    song = both(song, note(c, z, z + 1/8))
    z += 1/8
    song = both(song, note(e, z, z + 1/8))
    z += 1/4
    song = both(song, note(g, z, z + 1/4))
    z += 1/2
    song = both(song, note(low_g, z, z + 1/4))
    return song
```

[![使用高阶函数拼接超级马里奥经典前奏音轨](</attachments/cs61a-921caec3f0d7bfb21b8cb15c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)
*⏱ 时间戳：00:11:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:11:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)*

#### 📸 课堂板书与代码演示深入精读 (00:11:40)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“This time, it's an eighth note, but after it, I'm not going to play another note for a quarter of a second. That means I have an eighth note, followed by an eighth rest. I'll do that again, and then have an eighth note that has no rest after it, and now I think it's time for another note. And, like,...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 谱写超级马里奥：函数驱动的音乐结构」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


### 八度升降与多声部复调合奏

音符频率翻倍则音高上升一个八度，频率减半则下降一个八度。我们可以构造一个带八度参数的工厂函数 `mario_at(octave)`：

```python
def mario_at(octave):
    c = tri(octave * c_freq)
    e = tri(octave * e_freq)
    g = tri(octave * g_freq)
    low_g = tri(octave * g_freq / 2)
    return mario(c, e, g, low_g)

# 高低双声部完美复调合奏：
final_song = both(mario_at(1), mario_at(0.5))
play(final_song, name='mario.wav', seconds=2)
```

[![高阶多声部合奏：mario_at(1) 与低八度 mario_at(0.5) 复合播放](</attachments/cs61a-0efeafc2925fdcfc9608d2a4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)
*⏱ 时间戳：00:13:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:13:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)*

#### 📸 课堂板书与代码演示深入精读 (00:13:30)

**【现场板书 / 代码演示还原】**：
在此时间节点，DeNero 教授在屏幕上进行了核心演示与重点板书推导：
> *“Instead of committing to a particular C, E, G, and low G, we'll play Mario at a particular octave. And the way you set the octave is just to multiply the octave by the frequency. So if the octave says, go one octave above, we'll write that as 2, which multiplies all the frequencies by 2. Or if we wa...”*

**【底层计算模型与微观执行机制】**：
1. **执行上下文与时序追踪**：
   - 处于当前讨论节点「5. 谱写超级马里奥：函数驱动的音乐结构」，解释器严格遵循核心求值规约；
   - 表达式先求值操作符，随后自左至右严格求值操作数，最终将函数对象施加于实参列表；
   - 若涉及环境模型，局部帧严格记录其静态词法父指针（Parent Pointer 指向函数定义处的环境），与运行时的动态调用栈形成正交架构。
2. **内存拓扑与对象引用**：
   - 变量符号只是哈希表（环境帧）中的键，指针直接指向堆内存中的一等公民对象；
   - 赋值语句是离散时间的瞬时状态快照，绝不会建立隐式的数学依赖监听。

**【避坑指南与高频考点点拨】**：
- **常见思维误区**：在「函数驱动的时间序列采样与波形合成」相关考题中，初学者极易根据代码表面形式猜想结果，导致作用域混淆或变量遮蔽（Shadowing）误判；
- **调试排错黄金法则**：遇到嵌套调用与复杂分支时，务必在草稿纸上画出独立的局部帧，标明每个形参的具体绑定值，按部就班推导。


---

### 深入形式化规约与微观求值流程（Operational Semantics）
在「5. 谱写超级马里奥：函数驱动的音乐结构」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。


## 6. 本讲小结：函数式架构的精髓

本讲虽然作为选修扩展，却揭示了软件设计中最震撼的一个原则：**以函数为第一等公民的系统，可以在函数本身所构成的代数空间中完成全部运算与装配。**

1. **零中间状态开销**：在调用 `play()` 之前，全程序没有分配哪怕 1 个字节的声音采样数组，整个乐曲只是一个紧凑的函数复合树。
2. **无限可组合性**：`both` 和 `note` 不关心输入的声音是简单的单音、复杂的和弦，还是整整一段乐曲。所有函数遵循相同的签名契约，可以无限自由嵌套。
3. **职责优雅隔离**：波形算法归 `tri`，和声逻辑归 `both`，时间步进归 `note`，编曲归 `mario`。高阶函数让计算机程序真正成为了“可以演奏的数学诗篇”。

### 深入形式化规约与微观求值流程（Operational Semantics）
在「6. 本讲小结：函数式架构的精髓」模块中，计算机底层运算依赖于严密的形式化求值逻辑：
1. **抽象语法树（AST）的分层解析**：
   - 源代码字符流首先经过词法分析器（Lexer）切分为终结符标记（Tokens），随后由语法解析器（Parser）构造成多叉语法树；
   - 运算符优先级与结合性在语法树构建阶段即已固化，消除了运行期的二义性；
2. **环境序列的动态跃迁**：
   - 每次函数调用产生的新帧，其静态词法环境由函数对象的 `parent` 属性完全决定；
   - 变量查找沿环境链向上单向回溯，直到全局环境帧，若未找到则触发 `NameError` 异常；
3. **状态不变式（State Invariants）**：
   - 编写健壮程序的关键在于明确循环不变式（Loop Invariants）与函数前后置条件（Pre/Post-conditions）；
   - 在复杂控制流跳转中，确保状态变量在每次迭代前均维持合法的业务约束。



---

## 伯克利 Midterm / Final 经典高频考题深度演练

### 实战考题：环境拓扑与微观状态追踪（WWPD & Environment Diagrams）
考虑以下 Python 代码在交互式环境中的微观执行过程：

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

#### 完整解题思维模型与多帧环境图推导：
1. **全局帧（Global Frame）初始化**：
   - 全局变量 `x` 绑定到整数对象 `10`；
   - 全局函数 `outer` 绑定到新创建的函数对象，其内嵌 `parent = Global`；
2. **执行 `f = outer(5)`**：
   - 开辟局部帧 $f_1$，标注 `f1: outer [parent=Global]`；
   - 形参 `x` 绑定到实参 `5`；
   - 局部变量 `y` 绑定到 `5 + 2 = 7`；
   - 在 $f_1$ 内部执行 `def inner(y):`，创建函数对象 `inner`，其内嵌 **`parent = f1`**；
   - 返回函数对象 `inner`，全局变量 `f` 绑定到该对象；
3. **执行 `result = f(3)`**：
   - 调用函数 `f`（即 `inner`），开辟局部帧 $f_2$；
   - **核心判分点**：帧 $f_2$ 的 parent 指向谁？
   - **铁律**：函数 `inner` 是在帧 $f_1$ 内部被定义的，因此 $f_2$ 的 **`parent = f1`**！
   - 形参 `y` 绑定到实参 `3`；
   - 执行体 `return x + y`：
     - 在当前帧 $f_2$ 查找 `y`：命中局部变量 `y = 3`；
     - 在当前帧 $f_2$ 查找 `x`：未命中，沿 parent 回溯到 **$f_1$ 帧** 查找！
     - 在 $f_1$ 帧中命中 `x = 5`（全局的 `x = 10` 被局部遮蔽！）；
     - 计算 `5 + 3 = 8`，作为返回值；
4. **最终输出结论**：
   - 全局变量 `result = 8`。

---

## 本讲核心概念知识矩阵 (Knowledge Matrix)

| 核心知识维度 | 形式化定义与机制 | 典型代码示例 | 核心工程与算法价值 | 常见易错陷阱 |
| :--- | :--- | :--- | :--- | :--- |
| **基础求值语义** | 表达式求值得到值，语句执行改变内部状态 | `x = 2 + 3` | 建立离散时间状态快照心智模型 | 误将赋值等号当作代数方程动态约束 |
| **环境帧拓扑** | 环境是一系列帧构成的有序链条 | `Global -> f1 -> f2` | 实现词法作用域与变量安全隔离 | 混淆调用者栈帧与定义处父环境指针 |
| **抽象屏障** | 通过函数接口隔离实现细节与调用逻辑 | `def square(x): ...` | 降低大规模系统认知负荷 | 破坏接口直接依赖底层私有数据结构 |
| **控制流决策** | 条件分支短路求值与循环迭代递进 | `if cond: ... while: ...` | 赋予程序非线性决策与大规模数据处理能力 | 遗漏循环递进变量引发死循环 |
| **高阶能力** | 函数作为一等公民（传参、返回、赋值） | `make_adder(3)` | 实现工厂模式、闭包持久状态与柯里化 | 闭包后期绑定引发循环变量捕获错误 |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：Lecture 5 Environments](/notes/cs61a/lecture-05) | [📚 返回 CS61A 全书目录](/notes/topics/CS61A) | [下一讲：Lecture 7 Functional Abstraction →](/notes/cs61a/lecture-07) | [🎬 在 B 站观看本讲 (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6) |
