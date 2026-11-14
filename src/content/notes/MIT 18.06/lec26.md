---
title: Lecture 26 · 复矩阵与快速傅里叶变换
description: 理解复矩阵、埃尔米特矩阵与 FFT 的结构。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 28
tags:
  - lineal algebra
status: completed
publish: true
---

> *Complex matrices; fast fourier transform* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 26 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p27 · 复矩阵与快速傅里叶变换](https://www.bilibili.com/video/BV1ix411f7Yp?p=27)（47:52）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-26-complex-matrices-fast-fourier-transform/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=27&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

复数其实早已进入这门课：一个实矩阵也可能有复的特征值和复的特征向量。但到此为止，绝大部分讨论都在实数范围内进行。当向量和矩阵的元素本身变成复数时，哪些定义需要修改？答案只有一条，却贯穿全讲：**每当做转置，就同时取共轭**。这条规则把长度、内积、对称、正交这些概念一并翻译到复空间，实对称矩阵变成埃尔米特矩阵，正交矩阵变成酉矩阵。

翻译完成之后，就可以介绍最重要的复矩阵——**傅里叶矩阵**（Fourier matrix）$F_n$。它的元素全是同一个单位根 $W$ 的幂，结构极其整齐：每一列长度相同，任意两列在带共轭的内积下互相垂直。正因为列与列正交，它的逆矩阵几乎不用算，就是共轭转置再除以 $n$；正变换与逆变换长得几乎一样，写程序时反而容易搞混。

复矩阵里最有实用价值的成果也落在 $F_n$ 上。一般地，用一个 $n\times n$ 矩阵乘向量需要 $n^2$ 次乘法，因为矩阵是满的、没有一个零元素。**快速傅里叶变换**（fast Fourier transform, FFT）却把 $F_n$ 分解成若干个稀疏矩阵的乘积，使乘法次数降到 $\frac12 n\log_2 n$。$n=64$ 时是 $4096$ 对 $192$；$n=1024$ 时 $n^2$ 超过一百万，而新算法只要 $5120$ 次，快了约 $200$ 倍。正是这一步加速，改变了整个工业界的计算方式，也是现代科学计算中最关键的一环之一。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-0ec40dcdc8a405b6ad8ff927.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 26 Summary，CC BY-NC-SA 4.0）。*

## 1. 复向量：长度和内积为什么必须带共轭

设 $\boldsymbol{z}=(z_1,z_2,\dots,z_n)$ 的每个分量都是复数，它属于复 $n$ 维空间 $\mathbb{C}^n$。要定义它的长度，第一个念头是照搬实数情形的 $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$，但这个做法立刻失效。长度平方必须是正的（零向量除外），而



$$
\boldsymbol{z}^{\mathsf T}\boldsymbol{z}=z_1^2+z_2^2+\cdots+z_n^2
$$



里出现的是各分量的平方，不是模长。取 $\boldsymbol{z}=(1,i)$：$\boldsymbol{z}^{\mathsf T}\boldsymbol{z}=1+i^2=1-1=0$，可这个向量显然不是零向量，长度不可能是 $0$。所以 $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$ 不是长度。

正确的做法是让每个分量乘上它自己的**复共轭**（complex conjugate），也就是把所有虚部变号：



$$
\overline{\boldsymbol{z}}^{\mathsf T}\boldsymbol{z}=\overline{z_1}z_1+\overline{z_2}z_2+\cdots+\overline{z_n}z_n .
$$



对 $\boldsymbol{z}=(1,i)$，第一项是 $1\cdot1=1$，第二项是 $(-i)\cdot i=1$，加起来等于 $2$，所以这个向量的长度是 $\sqrt2$，而不是 $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$ 给出的 $0$。注意每一项 $\overline{z}z=|z|^2$ 都是非负实数，这正是长度平方需要的性质：和为零当且仅当每个分量都为零。

记号上把“先转置、再取共轭”合并成一个动作，写成



$$
\boldsymbol{z}^{\mathsf H}=\overline{\boldsymbol{z}}^{\mathsf T},
$$



其中 H 取自 Hermite 的名字，$\boldsymbol{z}^{\mathsf H}$ 称为**共轭转置**（conjugate transpose）。于是长度平方就是 $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$。从实数转到复数，规则只有一句：**转置的时候顺带取共轭**。

内积随之修改。实向量的内积是 $\boldsymbol{y}^{\mathsf T}\boldsymbol{x}$，复向量的内积必须是 $\boldsymbol{y}^{\mathsf H}\boldsymbol{x}$，第一个因子要被共轭。这样定义不是随手挑的，而是被长度逼出来的：当两个因子相同时，内积必须退化成 $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$，也就是长度平方。代价是内积一般不再是实数，而是一个复数；只有取 $\boldsymbol{y}=\boldsymbol{x}$ 时它才非负实。

除了长度和内积的定义，$\mathbb{C}^n$ 与 $\mathbb{R}^n$ 并没有别的差别：向量的加法照旧逐分量进行，线性组合的系数现在允许是复数，公理一条不变，所以它同样是一个向量空间。本讲要做的翻译工作，就是把实数版本的每一条公式改成共轭版本；实数情形自动成为其中的特例。

![视频 00:04:47：课堂板书](</attachments/mit1806-99886c2acfda2aaa5e20a3af.jpg>)

*视频 00:04:47｜约对应第 1 节「1. 复向量：长度和内积为什么必须带共轭」附近。*

## 2. 埃尔米特矩阵与酉矩阵

有了带共轭的内积，实对称矩阵和正交矩阵就都有了复数版本。

实对称矩阵要求 $A^{\mathsf T}=A$。矩阵变成复的以后，光转置不够：转置把对角线两侧的元素对调，而对调过去的复元素还必须再取共轭才能和原来那个相等。于是正确的推广是



$$
A^{\mathsf H}=A,\qquad A^{\mathsf H}=\overline{A}^{\mathsf T},
$$



满足它的矩阵称为**埃尔米特矩阵**（Hermitian matrix）。

先看对角线。转置时对角线上的元素原地不动，再取共轭就要求它等于自己的共轭，所以**埃尔米特矩阵的对角元必须是实数**。再看非对角元：若 $(1,2)$ 位置是 $3+i$，它转置后跑到 $(2,1)$，再取共轭必须仍等于 $3+i$，因此 $(2,1)$ 位置只能是 $3-i$。例如



$$
A=\begin{bmatrix}2&3+i\\3-i&5\end{bmatrix}
$$



是埃尔米特矩阵：对角元 $2$ 与 $5$ 是实数，两个非对角元互为共轭。上一讲关于实对称矩阵的两条结论在这里原样成立——埃尔米特矩阵的特征值是实数，特征向量互相垂直；只是“垂直”要按下面带共轭的内积来判断。

标准正交的概念同样照搬。设酉矩阵 $Q$ 的列是 $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$，**标准正交**（orthonormal）意味着任意两个不同列的复内积为零、每列与自身的内积为一：



$$
\boldsymbol{q}_i^{\mathsf H}\boldsymbol{q}_j=
\begin{cases}
0,&i\ne j,\\
1,&i=j.
\end{cases}
$$



把这一整组等式写成矩阵语言，就是 $Q^{\mathsf H}Q=I$。实数情形下这样的方阵叫正交矩阵，复数情形下换个名字：**酉矩阵**（unitary matrix），即列标准正交的复方阵。换名字本身就是一个信号——只要看到“酉”字，就该想到这个矩阵的元素可能是复数，判断正交时必须带上共轭。两种空间的对应关系可以列成一张对照表：

| 实数 $\mathbb{R}^n$ | 复数 $\mathbb{C}^n$ |
| --- | --- |
| 转置 $A^{\mathsf T}$ | 共轭转置 $A^{\mathsf H}=\overline{A}^{\mathsf T}$ |
| 对称 $A^{\mathsf T}=A$ | 埃尔米特 $A^{\mathsf H}=A$ |
| 正交矩阵 $Q^{\mathsf T}Q=I$ | 酉矩阵 $Q^{\mathsf H}Q=I$ |
| 长度平方 $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$ | 长度平方 $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$ |

整张表只反映一件事：复数情形下每一个转置后面都跟着一次共轭。

![视频 00:11:19：课堂板书](</attachments/mit1806-b61c1ecd9127516e0de38f2d.jpg>)

*视频 00:11:19｜约对应第 2 节「2. 埃尔米特矩阵与酉矩阵」附近。*

![官方讲义摘要 第 2/4 页](</attachments/mit1806-5171682e92a4173f721bb496.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 26 Summary，CC BY-NC-SA 4.0）。*

## 3. 傅里叶矩阵 $F_n$ 与单位根

傅里叶矩阵是复矩阵里最重要的一个。为了写出它，先把下标的习惯换成电气工程的口径：从 $0$ 数到 $n-1$。好处是后面所有公式都以 $0$ 为起点。

固定 $n$，令



$$
W=e^{2\pi i/n}=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}.
$$



这个数在复平面上位于单位圆上，转过的角度是圆周的 $1/n$，因此 $W^n=1$，它是方程 $w^n=1$ 的根之一。这样的根一共 $n$ 个，全都由 $W$ 的幂给出：



$$
1,\ W,\ W^2,\ \dots,\ W^{n-1},
$$



它们均匀地排在单位圆上，$W$ 称为**本原 $n$ 次单位根**（primitive $n$-th root of unity）。算幂时不要用实部虚部，用指数形式最快：$(e^{2\pi i/n})^{k}=e^{2\pi ik/n}$，角度直接乘 $k$。$n=6$ 时 $W$ 转过 $60^\circ$，各次幂依次转过 $120^\circ,180^\circ,\dots$，第六次幂回到 $1$，这六个点就是 $1$ 的六个六次方根。

这些幂永远跑不出单位圆：给一个模长为 $1$ 的复数平方，就是把绝对值的平方 $1^2$ 再取一次，结果仍然是 $1$；取任意次幂同理。所以 $W$ 的整条幂序列都在圆上滑动，只是角度不断累加，转满 $2\pi$ 就回到 $1$。

$n$ 维傅里叶矩阵 $F_n$ 的第 $(i,j)$ 元素是 $W^{ij}$，其中 $i,j$ 都从 $0$ 取到 $n-1$：



$$
F_n=\begin{bmatrix}
1&1&1&\cdots&1\\
1&W&W^2&\cdots&W^{n-1}\\
1&W^2&W^4&\cdots&W^{2(n-1)}\\
\vdots&\vdots&\vdots&\ddots&\vdots\\
1&W^{n-1}&W^{2(n-1)}&\cdots&W^{(n-1)^2}
\end{bmatrix}.
$$



读法很规律：第一列是 $W^0$，第二列是 $W$ 的各次幂，第三列是 $W^2$ 的各次幂，最后一列是 $W^{n-1}$ 的各次幂，行方向同理。由于 $W^{ij}=W^{ji}$，这个矩阵是对称的，$F_n^{\mathsf T}=F_n$。但当 $n\ge3$ 时它不是埃尔米特矩阵：元素中出现非实的复数，转置之后还得再取共轭才能对上，而 $F_n$ 不等于自己的共轭。

取 $n=4$。此时 $W=e^{2\pi i/4}=e^{i\pi/2}=i$，它的各次幂是 $i,-1,-i,1$，恰好是 $1$ 的四个四次单位根。按公式排出来：



$$
F_4=\begin{bmatrix}
1&1&1&1\\
1&i&-1&-i\\
1&-1&1&-1\\
1&-i&-1&i
\end{bmatrix}.
$$



逐行核对：第 $3$ 行（$i=2$）的元素是 $W^0,W^2,W^4,W^6$，即 $1,-1,1,-1$；第 $4$ 行（$i=3$）是 $W^0,W^3,W^6,W^9$，用 $W^4=1$ 化简成 $1,-i,-1,i$。整个矩阵没有一个零元素，是满的——这正是为什么直接相乘代价很高。

![视频 00:18:11：课堂板书](</attachments/mit1806-8bc48be9c6e2e88a87bd6b68.jpg>)

*视频 00:18:11｜约对应第 3 节「3. 傅里叶矩阵 $F_n$ 与单位根」附近。*

## 4. 列正交性与逆矩阵

傅里叶矩阵最要紧的性质是：它的各列在带共轭的内积下两两正交。这一条如果不带共轭就会看错。

在 $F_4$ 里取第 $2$ 列与第 $4$ 列：



$$
\text{col}_2=\begin{bmatrix}1\\i\\-1\\-i\end{bmatrix},
\qquad
\text{col}_4=\begin{bmatrix}1\\-i\\-1\\i\end{bmatrix}.
$$



如果照实数那样直接用转置去点乘，得到 $1\cdot1+i\cdot(-i)+(-1)(-1)+(-i)\cdot i=1+1+1+1=4$，看起来完全不等于零。但内积的第一个因子必须先共轭，$\overline{\text{col}_2}=(1,-i,-1,i)^{\mathsf T}$，于是



$$
\overline{\text{col}_2}^{\ \mathsf T}\text{col}_4=1\cdot1+(-i)(-i)+(-1)(-1)+i\cdot i=1-1+1-1=0 .
$$



正交性成立，代价是必须记住共轭。若漏掉这一步，就会误判两个垂直的列不垂直。

每列的长度也容易算。$F_4$ 的每一列有四个分量，模长都是 $1$，所以长度平方是 $4$，长度是 $2$。于是 $F_4$ 的列正交但并非标准正交。把整个矩阵除以 $2$，就得到列标准正交的酉矩阵：



$$
\left(\tfrac12F_4\right)^{\mathsf H}\left(\tfrac12F_4\right)=\tfrac14F_4^{\mathsf H}F_4=I,
\qquad\text{即}\qquad
F_4^{\mathsf H}F_4=4I .
$$



逆矩阵因此不用做任何消元就能写出来：



$$
F_4^{-1}=\tfrac14F_4^{\mathsf H}.
$$



对一般的 $n$，同样的理由给出 $F_n^{\mathsf H}F_n=nI$ 与 $F_n^{-1}=\frac1n F_n^{\mathsf H}$。这对傅里叶变换是极大的方便：正变换和逆变换用的是同一个矩阵，只差一个共轭和一个常数因子，所以工程上最容易犯的错就是把两者搞混。还有一层好处：逆矩阵既然只是共轭转置，那么关于 $F_4$ 学到的任何一条性质，都能原封不动地翻译成关于 $F_4^{-1}$ 的性质——两者在结构上是同一个东西。Fourier 本人在没有计算机的年代就知道这个逆矩阵。他没有注意到、而后来变得极其重要的是另一件事：这个矩阵可以分解成一大堆零元素因子的乘积，因而能极快地乘出来。

## 5. 快速傅里叶变换：把 $F_n$ 拆成两个一半大的

用 $F_n$ 乘一个向量，按定义要做 $n^2$ 次乘法：矩阵有 $n^2$ 个元素，且没有一个是零，看起来省不掉。FFT 的全部内容就是把这个矩阵分解成若干稀疏因子的乘积，让绝大多数乘法变成“乘零”，从而根本不用做。

拆分的钥匙是一条简单关系。设 $W_n=e^{2\pi i/n}$ 是 $n$ 次单位根，则



$$
W_n^2=e^{4\pi i/n}=e^{2\pi i/(n/2)}=W_{n/2},
$$



即 $n$ 次单位根的平方恰好是 $n/2$ 次单位根：$W_{64}$ 在圆上转 $1/64$ 圈，平方后转 $1/32$ 圈，正是 $W_{32}$。这就把大小相差一倍的傅里叶矩阵联系了起来。

具体看乘法 $F_n\boldsymbol{x}$，其第 $k$ 个分量是 $\sum_{j=0}^{n-1}W^{kj}x_j$（这里 $W=W_n$）。把下标按奇偶拆开，$j=2m$ 与 $j=2m+1$：



$$
\sum_{m}(W^2)^{km}x_{2m}+W^{k}\sum_{m}(W^2)^{km}x_{2m+1},
$$



两个和分别从 $m=0$ 取到 $n/2-1$。由于 $W^2=W_{n/2}$，第一个和正是 $F_{n/2}$ 作用在偶下标分量上的第 $k$ 个分量，第二个和则是 $F_{n/2}$ 作用在奇下标分量上再乘 $W^k$。于是



$$
y_k=\bigl(F_{n/2}\boldsymbol{x}_{\text{even}}\bigr)_k+W^{k}\bigl(F_{n/2}\boldsymbol{x}_{\text{odd}}\bigr)_k .
$$



$(W^2)^{km}$ 关于 $k$ 的周期是 $n/2$，所以 $k=0,\dots,n/2-1$ 算出的两半结果可以直接搬给后一半，只是符号要变：$W^{k+n/2}=W^k\cdot W^{n/2}=-W^k$。因此



$$
y_{k+n/2}=\bigl(F_{n/2}\boldsymbol{x}_{\text{even}}\bigr)_k-W^{k}\bigl(F_{n/2}\boldsymbol{x}_{\text{odd}}\bigr)_k .
$$



把这两式写成矩阵，以 $n=64$ 为例：



$$
F_{64}=
\begin{bmatrix}I&D\\ I&-D\end{bmatrix}
\begin{bmatrix}F_{32}&0\\ 0&F_{32}\end{bmatrix}
P ,
$$



其中 $D=\operatorname{diag}(1,W,W^2,\dots,W^{31})$ 取 $W=W_{64}$。三块的分工非常清楚。最右边的 $P$ 是**置换矩阵**（permutation matrix），把偶数下标的分量排到前面、奇数下标的排到后面，$\boldsymbol{x}\mapsto(x_0,x_2,x_4,\dots,x_1,x_3,x_5,\dots)$；它只是重新编号，在计算机里是一根硬连线，几乎不花时间。中间那块对两半分别做一次 $32$ 维傅里叶变换——两半的计算彼此无关，可以完全并行。最左边的对角块把两半的结果相加、相减：上半个块输出“偶半 + $D$ 乘奇半”，下半个块输出“偶半 − $D$ 乘奇半”，所以这一块真正要做乘法的只有 $D$，$I$ 与置换都不贡献乘法。

成本立刻降下来：原来 $64^2=4096$ 次乘法，现在两次 $32$ 维变换共 $2\cdot32^2=2048$ 次，再加**对角矩阵**（diagonal matrix）$D$ 的 $32$ 次修正，合计 $2080$ 次。这还只是拆了一层；把两个 $32$ 维变换继续拆下去，每层都只新增 $32$ 次乘法，而不必再付平方级的代价——这就是全部秘密：把大矩阵逐层切成两半，每层夹一个置换和一个对角修正。

![视频 00:31:07：课堂板书](</attachments/mit1806-334724cf07c792c143102f27.jpg>)

*视频 00:31:07｜约对应第 5 节「5. 快速傅里叶变换：把 $F_n$ 拆成两个一半大的」附近。*

![官方讲义摘要 第 3/4 页](</attachments/mit1806-9c8e4cde037d844ecd9075e5.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 26 Summary，CC BY-NC-SA 4.0）。*

![视频 00:37:20：课堂板书](</attachments/mit1806-c34b26fa8eb8a06be8933256.jpg>)

*视频 00:37:20｜约对应第 5 节「5. 快速傅里叶变换：把 $F_n$ 拆成两个一半大的」附近。*

## 6. 递归：从 $n^2$ 到 $\frac12 n\log_2 n$

$2048$ 次还是太多，因为同样的想法可以继续用：每个 $F_{32}$ 再用 $W_{32}^2=W_{16}$ 拆成两个 $F_{16}$，各自配上一份奇偶置换和一份对角修正。从下标上看，第一次置换把分量分成“偶数”与“奇数”两组，第二次置换再各自分成偶、奇，于是原来的向量被分成四组：偶偶 $(x_0,x_4,x_8,\dots)$、偶奇 $(x_2,x_6,x_{10},\dots)$、奇偶 $(x_1,x_5,x_9,\dots)$、奇奇 $(x_3,x_7,x_{11},\dots)$（前一个字表示第一层落在哪一半，后一个字表示第二层），四组分别做 $16$ 维变换，最后再用符号修正拼回去。于是 $64^2$ 这一项被替换掉，代之以



$$
2\cdot32^2+32\ \longrightarrow\ 4\cdot16^2+2\cdot16+32\ \longrightarrow\ 8\cdot8^2+4\cdot8+2\cdot16+32\ \longrightarrow\cdots
$$



每一层的修正成本加起来都是 $32$：$D$ 的规模从 $32$ 减半为 $16$、$8$……，但同一层的块数翻倍，所以总数不变。递归一直走到中间的傅里叶块变成 $1$ 维、再也不需要乘法为止。层数是多少？从 $64$ 降到 $32$、$16$、$8$、$4$、$2$、$1$，共 $6$ 步，也就是 $\log_2 64=6$。总乘法数是



$$
6\times 32=192=\tfrac12\cdot 64\cdot\log_2 64 .
$$



一般地，用 $T(n)$ 记 $n$ 维傅里叶变换的乘法次数，$T(n)=2T(n/2)+n/2$，解得



$$
T(n)=\frac{n}{2}\log_2 n .
$$



看一个有代表性的数字：$n=2^{10}=1024$。此时 $n^2=1\,048\,576$，超过一百万；而新算法只要



$$
\frac12\cdot 1024\cdot 10=5120=5\cdot 1024
$$



次。原来的量级是 $1024$ 乘 $1024$，现在只有 $5$ 乘 $1024$，缩小了约 $200$ 倍：同样的时间里，以前能做一次傅里叶变换，现在能做两百次。

FFT 的本质到这里就清楚了：它没有改变傅里叶矩阵，只是把它重新分解。逐层拆下去，右边累积出一串置换矩阵，左边累积出一串 $I$ 与 $D$、$I$ 与 $-D$ 形式的修正，中间越来越小直到消失。每一层只花 $n/2$ 次乘法，一共 $\log_2 n$ 层。傅里叶矩阵之所以如此特殊，一半在于它的列标准正交，逆矩阵几乎免费；另一半在于它的元素都是同一个单位根的幂，这使它可以按下标的奇偶递归地拆成两半。两条性质合起来，才把 $n^2$ 降成了 $\frac12 n\log_2 n$。

![视频 00:43:05：课堂板书](</attachments/mit1806-019f3ba3db0ef25ba3dbcb3f.jpg>)

*视频 00:43:05｜约对应第 6 节「6. 递归：从 $n^2$ 到 $\frac12 n\log_2 n$」附近。*

![官方讲义摘要 第 4/4 页](</attachments/mit1806-a31f3fc20e16ffe3b72f3210.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 26 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 复向量的长度平方是 $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}=\sum|z_i|^2$，不是 $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$：$\boldsymbol{z}=(1,i)$ 时前者等于 $2$、长度 $\sqrt2$，后者等于 $0$。
- 复情形的基本规则是“转置必取共轭”：$\boldsymbol{z}^{\mathsf H}=\overline{\boldsymbol{z}}^{\mathsf T}$，内积改为 $\boldsymbol{y}^{\mathsf H}\boldsymbol{x}$，一般取复值。
- 埃尔米特矩阵由 $A^{\mathsf H}=A$ 定义，对角元必为实数、非对角元共轭成对，如 $\begin{bmatrix}2&3+i\\3-i&5\end{bmatrix}$；它的特征值为实数，特征向量互相垂直。
- 酉矩阵是列标准正交的复方阵，$Q^{\mathsf H}Q=I$；它对应实数情形的正交矩阵。
- 傅里叶矩阵 $(F_n)_{ij}=W^{ij}$，$W=e^{2\pi i/n}$ 是本原 $n$ 次单位根；$n=4$ 时 $W=i$，$F_4$ 的元素只有 $1,\pm i,-1$，且 $F_n^{\mathsf T}=F_n$；$n\ge3$ 时它不是埃尔米特矩阵（$n=2$ 时 $F_2$ 是实对称矩阵）。
- $F_n$ 的列两两正交、每列长度为 $\sqrt n$，故 $F_n^{\mathsf H}F_n=nI$，$F_n^{-1}=\frac1nF_n^{\mathsf H}$；若不取共轭，$F_4$ 的第 $2$ 列与第 $4$ 列会算出 $4$ 而不是 $0$。
- FFT 的核心恒等式是 $W_n^2=W_{n/2}$，由此得到分块分解 $F_{n}=\begin{bmatrix}I&D\\I&-D\end{bmatrix}\begin{bmatrix}F_{n/2}&0\\0&F_{n/2}\end{bmatrix}P$，$D=\operatorname{diag}(1,W,\dots,W^{n/2-1})$，$P$ 是奇偶置换。
- 成本从 $n^2$ 降为 $2(n/2)^2+n/2$，递归后每层修正总计 $n/2$、共 $\log_2 n$ 层，总数 $\frac12n\log_2 n$；$n=64$ 时由 $4096$ 降为 $192$。
- $n=1024$ 时 $n^2=1\,048\,576$ 而 FFT 只需 $5120$ 次乘法，快约 $200$ 倍。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| complex conjugate | 复共轭 | 把复数的虚部变号的运算，记为 $\overline{z}$ |
| conjugate transpose | 共轭转置 | 先转置再取共轭，记作 $A^{\mathsf H}$，复空间的标准动作 |
| Hermitian matrix | 埃尔米特矩阵 | 满足 $A^{\mathsf H}=A$ 的复方阵，对角元为实、非对角元共轭成对 |
| unitary matrix | 酉矩阵 | 列标准正交的复方阵，$Q^{\mathsf H}Q=I$ |
| Fourier matrix | 傅里叶矩阵 | 第 $(i,j)$ 元为 $W^{ij}$ 的复矩阵，列两两正交 |
| root of unity | 单位根 | 满足 $w^n=1$ 的复数，形如 $e^{2\pi ik/n}$ |
| fast Fourier transform (FFT) | 快速傅里叶变换 | 利用 $W_n^2=W_{n/2}$ 把 $F_n$ 分解为稀疏因子，代价从 $n^2$ 降到 $\frac12n\log_2 n$ |
| permutation matrix | 置换矩阵 | 交换分量次序的矩阵，FFT 中用于奇偶下标的重新排列 |
| diagonal matrix | 对角矩阵 | 非对角元全为零的矩阵，$D=\operatorname{diag}(1,W,\dots,W^{n/2-1})$ |
| orthonormal | 标准正交 | 两两正交且长度全为 $1$，复情形用 $\boldsymbol{q}_i^{\mathsf H}\boldsymbol{q}_j=\delta_{ij}$ 判定 |

---

[← Lecture 25](/notes/mit-1806/lec25) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 27 →](/notes/mit-1806/lec27)
