---
kind: notes
source: cs61a/lecture-06
title: "Lecture 06 · Sound (Optional): Synthesizing Music and Super Mario"
description: "CS61A Lecture 6: Higher-order functions in practice: synthesizing
  music and Super Mario sounds from scratch."
sourceHash: 239e8edfc8d69415b374b08c087598eb44e861d4fbb0e3a904dbedc346451d20
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 14:36 ｜ **Video link back**: [Single episode corresponding to station B (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6)

## Why learn higher-order function? programming in Function Space

*I'm sorry. reference timestamp 00:00.00.  [Watch clip (P6 00:00:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=0))*

Learning. higher-order function At the same time, many of the students had questions:  `make_adder`  Such a factory function is certainly neat, but why don’t we write it directly?  `x + y`, do you want to install another higher-order function outside the function?

In order to give you a real sense of the power of higher-order function in the actual architecture of the system, Professor DeNero designed an exciting field project: **Instead of relying on any third-party audio library, only the Python built-in modules and higher-order function are used to synthesize music directly from a mathematical point of view (super Mario's theme song)!**

### Digital sound waves and sampling principles (Sampling)

Sound waves are physically a continuous vibration of air pressure. The computer discretely digitizes it through Sampling:
- **Frame Rate**: The number of times per second the amplitude of the sound wave is recorded (e.g. 11,000 times/second).
- **Amplitude**: at any time  $t$, the height and strength of sound waves.

![Sound waveform sampling principle diagram: continuous sound wave and discrete sampling point Sampling](</attachments/cs61a-cc0eb85c133dc7aabf8327ba.png>)
*⏱ Timestamp: 00:00:54 · 📷 Lecture screenshot · [Watch clip (P6 00:00:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)*

In electronic music synthesis, the four common basic waveforms include: **Sine Wave**, **Square Wave**, **Triangle Wave**  and  **Sawtooth Wave**. Among them, the triangle wave harmonics are gentle and there is no harsh noise of the square wave, making it very suitable for simulating wind and electronic instruments in small synthesizers.

![Four basic electronic music sound waveforms: sine wave, square wave, triangle wave and sawtooth wave](</attachments/cs61a-f03ecd0995c8b7ae75dcfa6e.png>)
*⏱ Timestamp: 00:01:40 · 📷 Lecture screenshot · [Watch clip (P6 00:01:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)*

---

## 2. Sonic Sampler: Modeling Continuous Time with Functions

*I'm sorry. reference timestamp 00:02:05 ..  [Watch clip (P6 00:02:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=125))*

Traditional data-oriented programming often creates a huge list or array to save millions of audio sample points, which consumes a lot of memory. In functional programming, we model a sound as a **Math functions (Sampler)**: 
$$f: t \longrightarrow [-1.0, 1.0]$$
 The input is the currently played sample number  $t$, the output is the amplitude value at that moment.

### Native WAV writer

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

![Python native WAV file writer: Sample rate Frame Rate and Sampler function definition](</attachments/cs61a-f8f8168cc5d984bf28f0786a.png>)
*⏱ Timestamp: 00:03:00 · 📷 Lecture screenshot · [Watch clip (P6 00:03:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)*

---

## Mathematical generator: Triangular wave higher-order function

*I'm sorry. reference timestamp 00:04.30 .  [Watch clip (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270))*

How to dynamically generate a triangle wave sampling function based on a given pitch frequency (Frequency) and volume (Amplitude)?

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

![Triangular wave generation function tri: frequency calculation, periodic and sawtooth absolute value folding](</attachments/cs61a-bea5aa78c0ba120762829fd9.png>)
*⏱ Timestamp: 00:04:30 · 📷 Lecture screenshot · [Watch clip (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)*

`tri`  A higher-order function: Enter frequency parameters and return a closure function that binds cycles and amplitudes  `sampler(t)`. When printing the sampling points in the terminal, you can see that the amplitude is  $-0.3$  and  $+0.3$  There is a perfect periodic linear triangular oscillation between them.

![Terminal sampling numerical trajectory: the oscillation trend of the triangle wave from -0.3 to +0.3](</attachments/cs61a-e83139df693c57bb8042648f.png>)
*⏱ Timestamp: 00:05:50 · 📷 Lecture screenshot · [Watch clip (P6 00:05:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)*

---

## 4. higher-order grouping: and acoustics and time slices

*reference timestamp: 00:06:33...  [Watch clip (P6 00:06:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=393))*

How do you combine it into music with a single tune? We need two cores. higher-order function : **Space Superposition (Chord)**  and  **Time series (rhythm)**.

### Overlay combinator: both

Acoustic physics tells us that both sound at the same time, and the amplitude is linear. We can write a higher-order function.  `both`, accepting two acoustic wave functions  `f`  and  `g`, returns a new harmony function:

```python
def both(f, g):
    """返回同时播放 f 和 g 的声波函数。"""
    return lambda t: f(t) + g(t)
```

With just one line of code, we can play a two-stop chord:
```python
e_freq = 329.63
e = tri(e_freq)
chord = both(c, e)  # C 音与 E 音构成的和谐双音
```

![higher-order function both: returns two acoustic functions and joins with acoustic new function](</attachments/cs61a-00251eff697aa18c54e15872.png>)
*⏱ Timestamp: 00:07:05 · 📷 Lecture screenshot · [Watch clip (P6 00:07:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)*

### Time Slicing and Fade (Note & Fade)

Notes in real music do not ring endlessly and must have a starting time (`start`) and end time (`end`). If the amplitude is cut off to 0 abruptly, it will cause the speaker cone to instantly shift and produce a harsh "click" sound (Pop/Click).

To do this, we need to add a very short (like 0.01 second) linear **Fade In**, and add at the end **Fade Out**: 

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

![higher-order function note: Add time window start and end rhythm control to sound waves](</attachments/cs61a-a1457450b4718acb54acd465.png>)
*⏱ Timestamp: 00:08:10 · 📷 Lecture screenshot · [Watch clip (P6 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)*

![Fade-in/out implementation: linear weighting algorithm to eliminate audio hard-cut pops](</attachments/cs61a-c55ea4da8031a58dabe86d50.png>)
*⏱ Timestamp: 00:10:20 · 📷 Lecture screenshot · [Watch clip (P6 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)*

---

## 5. Composing Super Mario: Function-Driven Musical Structure

*reference timestamp: 00:10:57...  [Watch clip (P6 00:10:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=657))*

Now we have all Lego-style functions primitive: `tri`, `both`  and  `note`. Let’s compose the iconic opening jump arpeggio from Super Mario Bros.!

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

![Use higher-order function to spell Super Mario's classic presonic tracks](</attachments/cs61a-921caec3f0d7bfb21b8cb15c.png>)
*⏱ Timestamp: 00:11:40 · 📷 Lecture screenshot · [Watch clip (P6 00:11:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)*

### Octave rise and fall and multi-part polyphonic ensemble

Doubling the frequency of a note raises its pitch by one octave, and halving its frequency lowers it by one octave. We can construct a factory function with octave parameters  `mario_at(octave)`: 

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

![higher-order Multisound chorus: mario\_at(1) and eight degrees lower mario\_at (0.5)](</attachments/cs61a-0efeafc2925fdcfc9608d2a4.png>)
*⏱ Timestamp: 00:13:30 · 📷 Lecture screenshot · [Watch clip (P6 00:13:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)*

---

## 6. Summary of this lecture: The essence of functional architecture

Although this lecture is an elective extension, it reveals one of the most shocking principles in software design: **A system with functions as first-class citizens can complete all operations and assembly in the algebraic space constituted by the functions themselves.**

1. **Zero intermediate state overhead**: calling  `play()`  Before, the whole program did not allocate even one byte sound sampling array, and the whole song was a compact function composite tree.
2. **Infinite composability**: `both`  and  `note`  It doesn't matter whether the input sound is a simple single note, a complex chord, or an entire piece of music. All functions follow the same signature contract and can be nested infinitely freely.
3. **Elegant isolation of responsibilities**: Waveform algorithm returns  `tri`, harmonic logic returns  `both`, the time step returns  `note`, arranged by  `mario` higher-order function made computer programs really "a mathematical poem that can be played."

---

