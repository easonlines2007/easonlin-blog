---
title: Lecture 06 · Sound (Optional)：高阶函数实战——从零合成音乐与超级马里奥
description: CS61A 第 6 讲：Sound (Optional)：高阶函数实战——从零合成音乐与超级马里奥
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 6
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：14:36 ｜ **视频回链**：[B 站对应单集 (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6)

## 1. 为什么要学习高阶函数？在“函数空间”中编程

*(参考时间：00:00:00 · [视频跳转 (P6 00:00:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=0))*

在学习高阶函数时，许多同学会产生疑问：像 `make_adder` 这样的工厂函数固然精巧，但我们为什么不直接写 `x + y`，非要在函数外面再套一层高阶函数呢？

为了让大家真切体会高阶函数在实际系统架构中的威力，DeNero 教授设计了一个引人入胜的实战项目：**不依赖任何第三方音频库，仅用 Python 内置模块和高阶函数，从数学原理出发直接合成音乐（超级马里奥主题曲）！**

### 数字化声波与采样原理（Sampling）

声波在物理上是空气压强的连续振动。计算机通过**采样（Sampling）**将其离散数字化：
- **采样率（Frame Rate）**：每秒记录声波振幅的次数（如 11,000 次/秒）。
- **振幅（Amplitude）**：在任意时刻 $t$，声波的高低强弱。

![声音波形采样原理图：连续声波与离散采样点 Sampling](</attachments/cs61a-cc0eb85c133dc7aabf8327ba.png>)
*⏱ 时间戳：00:00:54 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:00:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)*

在电子音乐合成中，常见的四种基础波形包括：**正弦波（Sine Wave）**、**方波（Square Wave）**、**三角波（Triangle Wave）** 和 **锯齿波（Sawtooth Wave）**。其中三角波谐波温润、没有方波的刺耳杂音，非常适合在小型合成器中模拟管乐与电子乐器。

![四种基础电子乐声波波形：正弦波、方波、三角波与锯齿波](</attachments/cs61a-f03ecd0995c8b7ae75dcfa6e.png>)
*⏱ 时间戳：00:01:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:01:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)*

---

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

![Python 原生 WAV 文件写入器：采样率 Frame Rate 与 Sampler 函数定义](</attachments/cs61a-f8f8168cc5d984bf28f0786a.png>)
*⏱ 时间戳：00:03:00 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:03:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)*

---

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

![三角波生成函数 tri：频率计算、周期与锯齿绝对值折叠](</attachments/cs61a-bea5aa78c0ba120762829fd9.png>)
*⏱ 时间戳：00:04:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)*

`tri` 是一个高阶函数：输入频率参数，返回一个绑定了周期和振幅的闭包函数 `sampler(t)`。当在终端打印采样点时，可以看到振幅在 $-0.3$ 与 $+0.3$ 之间呈现出完美的周期性线性三角振荡。

![终端采样数值轨迹：三角波从 -0.3 到 +0.3 的振荡走势](</attachments/cs61a-e83139df693c57bb8042648f.png>)
*⏱ 时间戳：00:05:50 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:05:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)*

---

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

![高阶函数 both：返回两个声波函数并联叠加的和声新函数](</attachments/cs61a-00251eff697aa18c54e15872.png>)
*⏱ 时间戳：00:07:05 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:07:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)*

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

![高阶函数 note：给声波添加时间窗口 start 与 end 的节奏控制](</attachments/cs61a-a1457450b4718acb54acd465.png>)
*⏱ 时间戳：00:08:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)*

![淡入淡出 Fade-in/out 实现：消除音频硬切爆音的线性加权算法](</attachments/cs61a-c55ea4da8031a58dabe86d50.png>)
*⏱ 时间戳：00:10:20 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)*

---

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

![使用高阶函数拼接超级马里奥经典前奏音轨](</attachments/cs61a-921caec3f0d7bfb21b8cb15c.png>)
*⏱ 时间戳：00:11:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:11:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)*

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

![高阶多声部合奏：mario_at(1) 与低八度 mario_at(0.5) 复合播放](</attachments/cs61a-0efeafc2925fdcfc9608d2a4.png>)
*⏱ 时间戳：00:13:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P6 00:13:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)*

---

## 6. 本讲小结：函数式架构的精髓

本讲虽然作为选修扩展，却揭示了软件设计中最震撼的一个原则：**以函数为第一等公民的系统，可以在函数本身所构成的代数空间中完成全部运算与装配。**

1. **零中间状态开销**：在调用 `play()` 之前，全程序没有分配哪怕 1 个字节的声音采样数组，整个乐曲只是一个紧凑的函数复合树。
2. **无限可组合性**：`both` 和 `note` 不关心输入的声音是简单的单音、复杂的和弦，还是整整一段乐曲。所有函数遵循相同的签名契约，可以无限自由嵌套。
3. **职责优雅隔离**：波形算法归 `tri`，和声逻辑归 `both`，时间步进归 `note`，编曲归 `mario`。高阶函数让计算机程序真正成为了“可以演奏的数学诗篇”。

---

