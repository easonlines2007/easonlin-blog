---
kind: notes
source: cs61a/lecture-06
title: "Lecture 06 · Higher-Order Functions: Synthesizing Music and Super Mario
  from Scratch"
description: "CS61A Lecture 6: Sound (Optional): Practical combat of high-order
  functions - synthesizing music and Super Mario from scratch"
sourceHash: a8e9053b31c63ec9244355d4820ea9fc9d752da664ea08f0be2e13a3e3d6a4ec
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61A (Fall 2024)  
> **Module**: Module 1: Functions & Abstraction  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Video duration**: 14:36 ｜ **Classroom screenshots**: 10 pieces of blackboard writing/code demonstration  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6)  
> **Quick navigation**: [← Previous Lecture (P05 Lecture 5 Environments)](/en/notes/cs61a/lecture-05) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61A) ｜ [Next lecture (P07 Lecture 7 Functional Abstraction) →](/en/notes/cs61a/lecture-07)

---

## 1. Why learn higher-order functions? Programming in "Function Space"

*(Reference time: 00:00:00 · [Video jump (P6 00:00:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=0))*

When learning higher-order functions, many students will have questions: like  `make_adder`  Such a factory function is certainly neat, but why don’t we write it directly?  `x + y`, do you have to add a layer of higher-order functions outside the function?

In order to let everyone truly understand the power of higher-order functions in actual system architecture, Professor DeNero designed a fascinating practical project: **It does not rely on any third-party audio library, only uses Python's built-in modules and high-order functions to directly synthesize music (Super Mario theme song) based on mathematical principles!**

### Digital sound waves and sampling principles (Sampling)

Sound waves are physically a continuous vibration of air pressure. The computer discretely digitizes it through Sampling:
- **Frame Rate**: The number of times per second the amplitude of the sound wave is recorded (e.g. 11,000 times/second).
- **Amplitude**: at any time  $t$, the height and strength of sound waves.

[![Sound waveform sampling principle diagram: continuous sound wave and discrete sampling point Sampling](</attachments/cs61a-cc0eb85c133dc7aabf8327ba.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)
*⏱ Timestamp: 00:00:54 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:00:54)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=54)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:00:54)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So what we're going to do is write down a WAV file. That's a standard format for encoding sounds. It's not used much these days because it takes a lot of space. It's a really simple format that doesn't involve any compression at all. But it's really simple to generate a WAV file, so that's why we'll...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Why learn higher-order functions? Programming in "function space"", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


In electronic music synthesis, the four common basic waveforms include: **Sine Wave**, **Square Wave**, **Triangle Wave**  and  **Sawtooth Wave**. Among them, the triangle wave harmonics are gentle and there is no harsh noise of the square wave, making it very suitable for simulating wind and electronic instruments in small synthesizers.

[![Four basic electronic music sound waveforms: sine wave, square wave, triangle wave and sawtooth wave](</attachments/cs61a-f03ecd0995c8b7ae75dcfa6e.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)
*⏱ Timestamp: 00:01:40 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:01:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=100)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:01:40)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So the wave itself looks like this. We take lots of samples at particular moments in time, and we're going to take, for example, 11,000 different samples every minute in order to get as close an approximation to this structure of this wave as we need so that it sounds cool to the human ear. And usua...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "1. Why learn higher-order functions? Programming in "function space"", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "1. Why learn higher-order functions? Programming in "Function Space"", the underlying operations of computers rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 2. Sonic Sampler: Modeling Continuous Time with Functions

*(Reference time: 00:02:05 · [Video jump (P6 00:02:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=125))*

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

[![Python native WAV file writer: sampling rate Frame Rate and Sampler function definition](</attachments/cs61a-f8f8168cc5d984bf28f0786a.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)
*⏱ Timestamp: 00:03:00 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:03:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=180)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:03:00)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Which takes a number and rounds it to the greatest integer that's less than that value. Now we pick a frame rate, that's the sampling rate. How many times per second do we want to have some value that tells us how high or low is the waveform of the sound? And here's the part that I don't think you s...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "2. Acoustic sampler: modeling continuous time with functions", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "2. Sound Wave Sampler: Using Functions to Model Continuous Time" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 3. Mathematical generator: triangle wave higher-order function

*(Reference time: 00:04:30 · [Video jump (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270))*

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

[![Triangular wave generation function tri: frequency calculation, periodic and sawtooth absolute value folding](</attachments/cs61a-bea5aa78c0ba120762829fd9.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)
*⏱ Timestamp: 00:04:30 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=270)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:04:30)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“In order to generate the wave file that our computer will actually be able to play. So sampler is some function that we're going to need to generate that gives us numbers between negative one and one and describes the samples of the wave. So if we were trying to generate this sound, then the sampler...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Math Generator: Triangular Wave High-Order Function", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


`tri`  Is a higher-order function: input frequency parameters and return a closure function bound to period and amplitude  `sampler(t)`. When printing the sampling points in the terminal, you can see that the amplitude is  $-0.3$  with  $+0.3$  There is a perfect periodic linear triangular oscillation between them.

[![Terminal sampling numerical trajectory: the oscillation trend of the triangle wave from -0.3 to +0.3](</attachments/cs61a-e83139df693c57bb8042648f.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)
*⏱ Timestamp: 00:05:50 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:05:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=350)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:05:50)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“At the frequency of C. Let's set T equal to zero. While it's the case that T is less than 100, I'm going to print out what I get when I call C on T, and then I'm going to increase T by one, and we'll see the shape of the triangle wave. Okay, so it starts out at negative .3, because that's my amplitu...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "3. Math Generator: Triangular Wave High-Order Function", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "3. Mathematical Generator: Triangular Wave High-Order Function" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 4. Higher-order combinators: harmonic superposition and time slicing

*(Reference time: 00:06:33 · [Video jump (P6 00:06:33)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=393))*

Once you have individual tones, how do you combine them into music? We need two core higher-order functions: **Space Superposition (Chord)**  with  **Time series (rhythm)**.

### Overlay combinator: both

Sound wave physics tells us that when two sounds sound at the same time, their amplitudes add up linearly. We can write a higher order function  `both`, accepting two acoustic wave functions  `f`  and  `g`, returns a new harmony function:

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

[![Higher-order function both: returns a new harmonic function that is a parallel superposition of two sonic functions.](</attachments/cs61a-00251eff697aa18c54e15872.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)
*⏱ Timestamp: 00:07:05 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:07:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=425)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:07:05)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“So things are getting interesting. Now I can play a sound. And the sound just sounds like a flat tune. But that's something I can work with. I can take a function, like what comes out from Try, and combine it with other functions in order to make music. So next, let's write down the frequencies for ...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Higher-order combinators: harmony superposition and time slicing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

[![Higher-order function note: Add time window start and end rhythm control to the sound wave](</attachments/cs61a-a1457450b4718acb54acd465.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)
*⏱ Timestamp: 00:08:10 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=490)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:08:10)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“That's T divided by the frame rate. Then checks to see whether those seconds are between start and end. If seconds are less than start, return zero. If seconds are greater than end, return zero. Otherwise, just play the sound. And the sound in this case is a function where we just call that function...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Higher-order combinators: harmony superposition and time slicing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


[![Fade-in/out implementation: linear weighting algorithm to eliminate audio hard-cut pops](</attachments/cs61a-c55ea4da8031a58dabe86d50.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)
*⏱ Timestamp: 00:10:20 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:10:20)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=620)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:10:20)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Seconds is less than start plus the fade-in time. Then what we're going to do is compute the difference between seconds and the start. So that's how far into the sound we're in. And we'll divide by the fade length to get a percentage of the fade. And we'll multiply that by f of t. If it's time to fa...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "4. Higher-order combinators: harmony superposition and time slicing", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "4. Higher-order combinator: harmony superposition and time slicing" module, the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 5. Composing Super Mario: Function-Driven Musical Structure

*(Reference time: 00:10:57 · [Video jump (P6 00:10:57)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=657))*

Now we have all the function primitives like Lego blocks: `tri`, `both`  and  `note`. Let’s compose the iconic opening jump arpeggio from Super Mario Bros.!

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

[![Using higher-order functions to splice Super Mario’s classic intro tracks](</attachments/cs61a-921caec3f0d7bfb21b8cb15c.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)
*⏱ Timestamp: 00:11:40 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:11:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=700)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:11:40)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“This time, it's an eighth note, but after it, I'm not going to play another note for a quarter of a second. That means I have an eighth note, followed by an eighth rest. I'll do that again, and then have an eighth note that has no rest after it, and now I think it's time for another note. And, like,...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Composing Super Mario: Function-driven music structure", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


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

[![High-order multi-part ensemble: mario\_at(1) and lower-octave mario\_at(0.5) composite playback](</attachments/cs61a-0efeafc2925fdcfc9608d2a4.png>)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)
*⏱ Timestamp: 00:13:30 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P6 00:13:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6&t=810)*

#### 📸 In-depth reading of classroom blackboard writing and code demonstration (00:13:30)

**\[On-site blackboard writing/code demonstration restoration\]**:
At this time point, Professor DeNero conducted a core demonstration and key blackboard derivation on the screen:
> *“Instead of committing to a particular C, E, G, and low G, we'll play Mario at a particular octave. And the way you set the octave is just to multiply the octave by the frequency. So if the octave says, go one octave above, we'll write that as 2, which multiplies all the frequencies by 2. Or if we wa...”*

**\[Underlying computing model and micro execution mechanism\]**: 
1. **Execution context and timing tracing**: 
   - At the current discussion point "5. Composing Super Mario: Function-driven music structure", the interpreter strictly follows the core evaluation protocol;
   - The expression evaluates the operators first, then evaluates the operands strictly from left to right, and finally applies the function object to the argument list;
   - If the environment model is involved, the local frame strictly records its static lexical parent pointer (Parent Pointer points to the environment where the function is defined), forming an orthogonal architecture with the dynamic call stack at runtime.
2. **Memory topology and object references**: 
   - Variable symbols are just keys in a hash table (environment frame), and pointers point directly to first-class citizen objects in heap memory;
   - Assignment statements are discrete-time snapshots of the state and never create implicit mathematical dependency monitoring.

**\[Guidelines for avoiding pitfalls and guidance on high-frequency test points\]**: 
- **Common misunderstandings**: In the test questions related to "Function-driven time series sampling and waveform synthesis", beginners can easily guess the results based on the surface form of the code, leading to scope confusion or variable shadowing (Shadowing) misjudgment;
- **The golden rule of debugging**: When encountering nested calls and complex branches, be sure to draw independent partial frames on the scratch paper, indicate the specific binding value of each formal parameter, and derive it step by step.


---

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the module "5. Compose Super Mario: Function-Driven Music Structure", the underlying computer operations rely on strict formal evaluation logic:
1. **Hierarchical parsing of abstract syntax trees (AST)**: 
   - The source code character stream is first divided into terminal symbol tokens (Tokens) by the lexical analyzer (Lexer), and then constructed into a multi-fork syntax tree by the syntax parser (Parser);
   - Operator priority and associativity are solidified during the syntax tree construction phase, eliminating ambiguity at runtime;
2. **Dynamic transitions of environment chains**: 
   - Each function call generates a new frame whose static lexical environment is determined by the function object's  `parent`  Attributes are completely determined;
   - The variable search traces back up the environment chain in one direction until the global environment frame. If it is not found, it will be triggered.  `NameError`  Abnormal;
3. **State Invariants**: 
   - The key to writing robust programs is to clarify loop invariants (Loop Invariants) and function pre/post-conditions (Pre/Post-conditions);
   - In complex control flow jumps, ensure that state variables maintain legal business constraints before each iteration.


## 6. Summary of this lecture: The essence of functional architecture

Although this lecture is an elective extension, it reveals one of the most shocking principles in software design: **A system with functions as first-class citizens can complete all operations and assembly in the algebraic space constituted by the functions themselves.**

1. **Zero intermediate state overhead**: calling  `play()`  Previously, the entire program did not allocate even a 1-byte sound sample array, and the entire music was just a compact function compound tree.
2. **Infinite composability**: `both`  and  `note`  It doesn't matter whether the input sound is a simple single note, a complex chord, or an entire piece of music. All functions follow the same signature contract and can be nested infinitely freely.
3. **Elegant isolation of responsibilities**: Waveform algorithm returns  `tri`, harmonic logic returns  `both`, the time step returns  `note`, arranged by  `mario`. Higher-order functions make computer programs truly "playable mathematical poems."

### In-depth formal specification and micro-evaluation process (Operational Semantics)
In the "6. Summary of this Lecture: The Essence of Functional Architecture" module, the underlying computer operations rely on strict formal evaluation logic:
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
| [← Previous lecture: Lecture 5 Environments](/en/notes/cs61a/lecture-05) | [📚 Return to CS61A complete book list](/en/notes/topics/CS61A) | [Next lecture: Lecture 7 Functional Abstraction →](/en/notes/cs61a/lecture-07) | [🎬Watch this lecture on Bilibili (P6)](https://www.bilibili.com/video/BV1sy411z7nA/?p=6) |
