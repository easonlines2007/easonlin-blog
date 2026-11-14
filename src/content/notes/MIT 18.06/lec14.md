---
title: Lecture 14 · 正交向量与正交子空间
description: 理解正交向量与正交子空间，掌握正交补与四个子空间的关系。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 15
tags:
  - lineal algebra
status: completed
publish: true
---

> *Orthogonal vectors and subspaces* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 14 讲 / 共 35 讲** ｜ 第二部分 · 正交性与行列式

**本讲视频**：[Bilibili p14 · 正交向量与正交子空间](https://www.bilibili.com/video/BV1ix411f7Yp?p=14)（49:48）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-14-orthogonal-vectors-and-subspaces/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=14&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

从这一讲开始，课程进入正交性（orthogonality）这一章，主题可以用一句话概括：九十度。什么样的向量互相垂直，什么样的子空间互相垂直，什么样的基互相垂直，都是这一章要回答的问题。此前我们已经认识了四个基本子空间（four fundamental subspaces），并且知道了它们的**维数**（dimension）：行空间（row space）与零空间（nullspace）同在 $\mathbb R^n$ 中，维数分别是 $r$ 和 $n-r$；列空间（column space）与左零空间（left nullspace）同在 $\mathbb R^m$ 中，维数分别是 $r$ 和 $m-r$。但那时我们只知道每个子空间是什么、怎么求基，不知道它们彼此的相对姿态。本讲补上这一层几何：这两对子空间恰好互相垂直。前面几讲关心的是每个子空间里装着什么向量，这一讲关心的是它们朝哪个方向。原来那张“四块拼图”因此变成两幅“直角拼图”，$\mathbb R^n$ 与 $\mathbb R^m$ 各被切成两个互成直角的子空间。

本讲后半段转向本章的主问题：$A\boldsymbol x=\boldsymbol b$ 没有解时怎么办。这在应用中才是常态——测量卫星的位置，测一千次得到一千个方程，而描述位置的参数也许只有六个；量脉搏时未知数只有一个，却会反复测量。方程比未知数多，右端又带着噪声，精确解注定不存在。把所有方程都用上、找出“最好的解”，才是合理的目标；而通往它的钥匙，是矩阵 $A^{\mathsf T}A$。

本讲的路线是：先给出向量正交的判据，并用勾股定理说明它的来源；再把这个判据从向量推广到子空间，证明行空间与零空间、列空间与左零空间各成直角；然后用维数说明这种正交是“互补”的，从而把四个基本子空间拼成两幅完整的图；最后引出无解方程的最佳解与矩阵 $A^{\mathsf T}A$ 的可逆性。

![官方讲义摘要 第 1/2 页](</attachments/mit1806-6f2e45188e44ce71c629ca9e.png>)

*MIT OCW 官方讲义摘要 第 1/2 页（18.06SC Lecture 14 Summary，CC BY-NC-SA 4.0）。*

## 1. 正交向量与点积检验

**正交**（orthogonal）就是“垂直”的同义词。在 $n$ 维空间里说两个向量正交，等于说它们之间的夹角是 $90^\circ$，也等于说它们与和向量 $\boldsymbol{x}+\boldsymbol{y}$ 围成一个直角三角形，其中 $\boldsymbol{x}+\boldsymbol{y}$ 是斜边。给定两个向量，怎样判断它们是否正交？答案是计算它们的点积：



$$
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}
=x_1y_1+x_2y_2+\cdots+x_ny_n .
$$



这个数写成矩阵乘法就是“一行乘一列”，结果是一个 $1\times 1$ 的矩阵，也就是一个标量。**两个向量正交，当且仅当**



$$
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 .
$$



这是本讲最基本的一条判据，它把几何上的“直角”翻译成一个可以计算的代数条件，后面所有结论都从它长出来。判断 $n$ 维空间中两个向量的夹角本来是个几何问题，而最该看的恰恰是最简单的那个量——点积；这一点的确漂亮。这个点积也称为**内积**（inner product）；在实向量上它就是对应分量相乘再求和。

用三维空间验证一下。取 $\boldsymbol{x}=(1,2,3)$。仿照勾股定理，向量的长度平方就是各分量的平方和，而这个平方和正好是它与自己的点积：



$$
\|\boldsymbol{x}\|^2=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}
=1^2+2^2+3^2=14 .
$$



再取 $\boldsymbol{y}=(2,-1,0)$，则 $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=2-2+0=0$，两个向量确实正交。相关的几个数完全对得上：



$$
\boldsymbol{x}+\boldsymbol{y}=\begin{bmatrix}3\\1\\3\end{bmatrix},
\qquad
\|\boldsymbol{y}\|^2=2^2+(-1)^2+0^2=5,
\qquad
\|\boldsymbol{x}+\boldsymbol{y}\|^2=3^2+1^2+3^2=19,
$$



而 $14+5=19$：两条直角边的长度平方之和等于斜边的长度平方。注意 $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$ 总是正数，唯一的例外是零向量，它的长度平方为零。

![视频 00:04:59：课堂板书](</attachments/mit1806-2c3c76671c7a48aed8bc4271.jpg>)

*视频 00:04:59｜约对应第 1 节「1. 正交向量与点积检验」附近。*

## 2. 点积判据与勾股定理是同一件事

上一节的等式并不是巧合，勾股定理恰好解释了判据从哪里来。勾股定理说，若 $\boldsymbol{x},\boldsymbol{y}$ 是直角三角形的两条直角边，则



$$
\|\boldsymbol{x}\|^2+\|\boldsymbol{y}\|^2=\|\boldsymbol{x}+\boldsymbol{y}\|^2 .
$$



把长度平方写成点积，右边按分配律展开：



$$
(\boldsymbol{x}+\boldsymbol{y})^{\mathsf T}(\boldsymbol{x}+\boldsymbol{y})
=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}
+\boldsymbol{x}^{\mathsf T}\boldsymbol{y}
+\boldsymbol{y}^{\mathsf T}\boldsymbol{x}
+\boldsymbol{y}^{\mathsf T}\boldsymbol{y}.
$$



这一步只用了矩阵乘法的分配律，没有引入任何假设。对于实向量，$\boldsymbol{y}^{\mathsf T}\boldsymbol{x}$ 与 $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$ 是同一个数，两者都等于 $x_1y_1+\cdots+x_ny_n$，所以中间两项合并成 $2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$。代回勾股等式，两端的 $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$ 与 $\boldsymbol{y}^{\mathsf T}\boldsymbol{y}$ 相消，只剩下



$$
2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 ,
\qquad\text{即}\qquad
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 .
$$



于是两条判据接上了：点积为零与勾股关系成立是同一件事。

必须强调，勾股等式并不对任意三个向量成立。夹角不是直角时，勾股关系一般不成立；只有当夹角是直角、也就是点积为零时，它才成立。反过来，只要点积为零，勾股等式就自动成立。这正是“正交”的几何含义与代数判据之间的完整对应。

还有一个边界情形要按定义处理。若 $\boldsymbol{x}$ 是零向量，则对任何 $\boldsymbol{y}$ 都有 $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$，所以零向量与所有向量正交。数学上不必为此感到别扭：规则怎么规定，就怎么执行。

## 3. 正交子空间

定义了向量的正交，就可以定义子空间的正交。**正交子空间**（orthogonal subspaces）的定义是：子空间 $S$ 与子空间 $T$ 正交，是指 $S$ 中的每一个向量都与 $T$ 中的每一个向量正交。定义里的“每一个”不能弱化：只找到一对互相垂直的向量，或者两个子空间各有一部分向量彼此垂直，都不算正交。

用三维空间检验这条定义。把无限延伸的黑板看成一个二维子空间，把地板看成另一个二维子空间，两者都经过同一个原点（相当于一个 $xz$ 平面与一个 $xy$ 平面）。它们正交吗？不是。可以在黑板上取一个与接缝成 $45^\circ$ 的向量，它显然不与地板上的向量垂直。更根本的理由是：这两个平面相交于一条直线，也就是地板与黑板的接缝；交线上的任何非零向量同时属于两个子空间，而一个非零向量不可能与它自己正交。由此得到一条必要条件：正交的两个子空间只能交于零向量。但“交集只有零向量”并不足以保证正交。

在二维平面里把子空间列全，这条定义的分量就清楚了。平面内的子空间只有三类：零向量、过原点的直线、整个平面。一条过原点的直线与整个平面永远不会正交，因为整个平面包含与这条直线成任意角度的向量，甚至包含这条直线本身。直线与零子空间总是正交的，因为零向量与所有向量正交。两条不同的过原点直线正交，当且仅当它们成 $90^\circ$。所以“正交”比“不重合”严格得多：两个子空间不仅要彼此分离，而且每个方向都要互相垂直。

![视频 00:12:21：课堂板书](</attachments/mit1806-0e7f88e7527e928569cf8c20.jpg>)

*视频 00:12:21｜约对应第 3 节「3. 正交子空间」附近。*

![视频 00:14:56：课堂板书](</attachments/mit1806-0cc8f9e590f1fb90ed56faca.jpg>)

*视频 00:14:56｜约对应第 3 节「3. 正交子空间」附近。*

## 4. 行空间与零空间正交

有了子空间正交的定义，就能说清楚四个基本子空间之间的姿态。核心事实是：**行空间与零空间正交**。

证明只用得到零空间的定义 $A\boldsymbol{x}=\boldsymbol{0}$。把 $A$ 按行写开，方程变成



$$
A\boldsymbol{x}=
\begin{bmatrix}
\text{row}_1\\
\text{row}_2\\
\vdots\\
\text{row}_m
\end{bmatrix}\boldsymbol{x}
=
\begin{bmatrix}
\text{row}_1\boldsymbol{x}\\
\text{row}_2\boldsymbol{x}\\
\vdots\\
\text{row}_m\boldsymbol{x}
\end{bmatrix}
=
\begin{bmatrix}
0\\0\\\vdots\\0
\end{bmatrix}.
$$



等式成立，意味着零空间里的向量 $\boldsymbol{x}$ 与 $A$ 的每一行都正交：$\text{row}_1\boldsymbol{x}=0$，$\text{row}_2\boldsymbol{x}=0$，一直到 $\text{row}_m\boldsymbol{x}=0$。

但行空间不只是这 $m$ 行，它还包含这些行的一切线性组合。若 $\boldsymbol{x}$ 与每一行都正交，那么它与任意一个组合也正交：



$$
(c_1\text{row}_1+\cdots+c_m\text{row}_m)\boldsymbol{x}
=c_1(\text{row}_1\boldsymbol{x})+\cdots+c_m(\text{row}_m\boldsymbol{x})=0 .
$$



所以 $N(A)$ 中的每个向量都与 $C(A^{\mathsf T})$ 中的每个向量正交，即 $N(A)\perp C(A^{\mathsf T})$。换句话说，方程 $A\boldsymbol{x}=\boldsymbol{0}$ 这一个式子同时包含着两层信息：它挑出了被 $A$ 映成零的向量，也说明这些向量的方向与 $A$ 的各行垂直。同样的推理用到 $A^{\mathsf T}$ 上：$A^{\mathsf T}$ 也是一个矩阵，同样满足“行空间与零空间正交”，而 $A^{\mathsf T}$ 的行空间就是 $A$ 的列空间，$A^{\mathsf T}$ 的零空间就是 $A$ 的左零空间，于是



$$
C(A)\perp N(A^{\mathsf T}).
$$



四个基本子空间就此两两配对：$\mathbb R^n$ 被行空间与零空间分成两块，维数 $r$ 与 $n-r$ 相加为 $n$；$\mathbb R^m$ 被列空间与左零空间分成两块，维数 $r$ 与 $m-r$ 相加为 $m$。这些几何关系其实一直摆在 $A\boldsymbol{x}=\boldsymbol{0}$ 里面，只是此前没有讨论垂直，所以没有看见；现在把它捡了起来。这是线性代数基本定理（fundamental theorem of linear algebra）的第二部分：第一部分讲四个子空间的维数，第二部分讲它们的正交性，第三部分讲它们的正交基。

![视频 00:18:55：课堂板书](</attachments/mit1806-b72f78e60defd3571d6abb23.jpg>)

*视频 00:18:55｜约对应第 4 节「4. 行空间与零空间正交」附近。*

## 5. 正交补：正交且恰好互补

“正交”还不够精确。**正交补**（orthogonal complement）要求更强：一个子空间的正交补不仅包含某些与它正交的向量，而且包含全部与它正交的向量。

维数必须凑得上，这是理解正交补的关键。考虑 $\mathbb R^3$ 中的矩阵



$$
A=\begin{bmatrix}1&2&5\\2&4&10\end{bmatrix}.
$$



第二行是第一行的两倍，所以秩（rank）$r=1$：行空间是沿 $(1,2,5)$ 方向的一条直线。零空间由方程



$$
x_1+2x_2+5x_3=0
$$



决定。一个方程、三个未知数，解集是一个过原点的二维平面，它的法向量恰好是 $(1,2,5)$，也就是微积分里那个“法向量 $n$”。行空间是直线、零空间是平面，两者正交，维数 $1+2=3$ 刚好铺满整个 $\mathbb R^3$。这里不可能出现“行空间是一条直线、零空间也是一条直线”的情形，因为 $n=3$、$r=1$，零空间维数必然是 $n-r=2$。

第二行 $(2,4,10)$ 对行空间和零空间没有任何实质影响，删掉它结论不变。所以 $N(A)$ 不只是“某些与行空间正交的向量”，而是**全部**与行空间正交的向量：所有与 $(1,2,5)$ 垂直的向量构成那个平面，而 $N(A)$ 就是这个平面，一个不多一个不少。反过来，与一条直线正交的向量全体本来就不是另一条直线，而是一整个平面——正交补就是这整个平面。用符号写就是



$$
N(A)=C(A^{\mathsf T})^{\perp},
\qquad
N(A^{\mathsf T})=C(A)^{\perp}.
$$



正交，再加上“维数相加等于整个空间”，两件事合起来才构成一个完整的分解。单个向量谈不上正交补，补是子空间之间的关系。

## 6. 主问题：方程无解时求“最佳解”

本讲后半段转入本章的主问题，这也是整门课最后一次讨论 $A\boldsymbol{x}=\boldsymbol{b}$：当方程没有解时，求它“最好的解”。无解意味着 $\boldsymbol{b}$ 不在列空间里。若 $A$ 是长方形矩阵、行数多于列数，这种情况就是常态。

实际例子很多。卫星在天上飞，测量它的位置一千次，就得到一千个方程，而决定位置的参数也许只有六个。量脉搏更是简单：每分钟心跳次数只有一个未知数，但你会反复测量。电阻测量、脉冲测量，情形都一样。方程太多，测量又带着噪声，所以 $A\boldsymbol{x}=\boldsymbol{b}$ 精确求解注定失败——连右端 $\boldsymbol{b}$ 本身都不可全信。但数据里含有大量关于 $\boldsymbol{x}$ 的信息，问题在于把信息与噪声分开。从矩阵的形状也能看出这一点：若 $A$ 是 $m\times n$ 且 $m>n$，它的秩不可能达到 $m$，列空间只是 $\mathbb R^m$ 中的一小块，绝大多数右端向量根本不在其中。

一个诱人但糟糕的做法是：扔掉一些方程，直到剩下一个方阵、而且可逆，再解这个方阵。这等于武断地宣布“这几次测量是准的，那些是废的”，没有任何依据；也没有理由说某些方程里全是信息、另一些里全是噪声。我们要用上所有测量，得到尽可能多的信息，也就是求出“最佳解”$\hat{\boldsymbol{x}}$。

消元能告诉我们方程有没有解；对这类问题，消元走到最后通常出现“$0$ 等于某个非零数”，无解的信号一目了然。出路是把方程两边同时左乘 $A^{\mathsf T}$：



$$
A^{\mathsf T}A\,\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b} .
$$



这是本章的中心方程。$\hat{\boldsymbol{x}}$ 就是那个最佳解；“最佳”的准确定义要留到后面，但方程本身已经指明，真正要研究的对象是 $A^{\mathsf T}A$。从形状上看，这个方程也完全合理：$A^{\mathsf T}$ 是 $n\times m$，$\boldsymbol{b}$ 是 $m$ 维，所以 $A^{\mathsf T}\boldsymbol{b}$ 是 $n$ 维向量，与未知数 $\hat{\boldsymbol{x}}$ 的个数一致；$A^{\mathsf T}A$ 是 $n\times n$ 的方阵，中心方程恰好是 $n$ 个方程、$n$ 个未知数。于是原来的长方形方程组被换成了一个方阵系统，这是它值得研究的第一个理由。

![视频 00:32:22：课堂板书](</attachments/mit1806-2017a20d08c97beeef0035a7.jpg>)

*视频 00:32:22｜约对应第 6 节「6. 主问题：方程无解时求“最佳解”」附近。*

![视频 00:33:57：课堂板书](</attachments/mit1806-040727b9a41e678d4b71a993.jpg>)

*视频 00:33:57｜约对应第 6 节「6. 主问题：方程无解时求“最佳解”」附近。*

![视频 00:39:50：课堂板书](</attachments/mit1806-22f3d8c9f8b441f4e9400949.jpg>)

*视频 00:39:50｜约对应第 6 节「6. 主问题：方程无解时求“最佳解”」附近。*

## 7. $A^{\mathsf T}A$ 与可逆性

设 $A$ 是 $m\times n$ 的长方矩阵，$A^{\mathsf T}$ 是 $n\times m$，所以 $A^{\mathsf T}A$ 是 $n\times n$ 的方阵。并且它是对称矩阵（symmetric matrix）：



$$
(A^{\mathsf T}A)^{\mathsf T}
=A^{\mathsf T}(A^{\mathsf T})^{\mathsf T}
=A^{\mathsf T}A .
$$



上面只用到一条规则：两个矩阵乘积的转置，等于各自转置后倒序相乘。中心方程要能解，就得知道 $A^{\mathsf T}A$ 何时可逆。

先看一个具体例子。取



$$
A=\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}.
$$



它是 $3\times 2$ 矩阵，两列分别是 $(1,1,1)$ 与 $(1,2,5)$，线性无关（linearly independent），秩为 $2$。对这样的 $A$，$A\boldsymbol{x}=\boldsymbol{b}$ 是三个方程、两个未知数，通常无解：$\boldsymbol{b}$ 必须落在这两列张成（span）的平面里，而 $\mathbb R^3$ 中的多数向量不在这个平面上。但 $A^{\mathsf T}A$ 是一个漂亮的 $2\times 2$ 矩阵：



$$
A^{\mathsf T}A=
\begin{bmatrix}1&1&1\\1&2&5\end{bmatrix}
\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}
=
\begin{bmatrix}3&8\\8&30\end{bmatrix}.
$$



逐项核对：左上角是 $(1,1,1)$ 与自己的点积 $1+1+1=3$；非对角元是两列的点积 $1+2+5=8$，对称性保证右上与左下相同；右下角是 $(1,2,5)$ 与自己的点积 $1+4+25=30$。它的行列式是



$$
3\cdot 30-8\cdot 8=90-64=26\neq 0,
$$



所以这个 $A^{\mathsf T}A$ 可逆。

但它并非永远可逆。若把 $A$ 的两列改成同一条直线上的向量，$A^{\mathsf T}A$ 的秩也会跟着掉下来。例如让第二列取成第一列的 $3$ 倍：



$$
A=\begin{bmatrix}1&3\\1&3\\1&3\end{bmatrix},
\qquad
A^{\mathsf T}A=
\begin{bmatrix}3&9\\9&27\end{bmatrix},
$$



乘积只有秩 $1$，行列式为零，不可逆。这并不意外：$A$ 的秩已经只有 $1$，而秩为 $1$ 的矩阵相乘，结果的秩不会超过 $1$。更一般地，$A^{\mathsf T}A$ 的每一列都是 $A^{\mathsf T}$ 各列的组合，所以它的列空间包含在 $A^{\mathsf T}$ 的列空间里，秩只会更小或相等，绝不会更大。一般地，总有



$$
\operatorname{rank}(A^{\mathsf T}A)=\operatorname{rank}(A),
\qquad
N(A^{\mathsf T}A)=N(A).
$$



为什么两个零空间相同？一个方向是直接的：若 $A\boldsymbol{x}=\boldsymbol{0}$，两边左乘 $A^{\mathsf T}$ 就得到 $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$。另一个方向用到第 1 节的长度平方：若 $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$，两边再左乘 $\boldsymbol{x}^{\mathsf T}$，得到



$$
0=\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}
=(A\boldsymbol{x})^{\mathsf T}(A\boldsymbol{x})
=\|A\boldsymbol{x}\|^2 .
$$



一个向量的长度平方为零，它只能是零向量，所以 $A\boldsymbol{x}=\boldsymbol{0}$。两个方向的包含关系合起来，两个零空间相等；再根据秩与零空间维数之和为列数 $n$，两者的秩也相等。

由此得到本讲最重要的判据：**$A^{\mathsf T}A$ 可逆，当且仅当 $N(A)$ 只含零向量，当且仅当 $A$ 的各列线性无关**。这里不要求 $A$ 是方阵，只要求它列满秩。这也解释了第二个例子为什么失败：两列相关意味着 $N(A)$ 含有非零向量，$A^{\mathsf T}A$ 便无法把它们与零区分开。下一讲将看到，$A^{\mathsf T}A$ 会出现在后面问题的核心位置。

![视频 00:44:49：课堂板书](</attachments/mit1806-3b77089f6ffa36d4b5a207f4.jpg>)

*视频 00:44:49｜约对应第 7 节「7. $A^{\mathsf T}A$ 与可逆性」附近。*

![官方讲义摘要 第 2/2 页](</attachments/mit1806-cef268c8c463403633cff3b3.png>)

*MIT OCW 官方讲义摘要 第 2/2 页（18.06SC Lecture 14 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **正交**（orthogonal）即垂直：两个向量正交当且仅当 $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$；长度平方为 $\|\boldsymbol{x}\|^2=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$；零向量与所有向量正交。
- 勾股定理与点积判据是同一件事：把 $\|\boldsymbol{x}+\boldsymbol{y}\|^2$ 展开，消去 $\|\boldsymbol{x}\|^2$ 与 $\|\boldsymbol{y}\|^2$，剩下 $2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$。
- **正交子空间**（orthogonal subspaces）的定义：$S$ 中每个向量都与 $T$ 中每个向量正交。黑板与地板都过原点却相交于一条直线，因此不正交；正交的两个子空间只能交于零向量。
- 在二维平面中：直线与整个平面永不正交，直线与零子空间总正交，两条不同直线正交当且仅当成 $90^\circ$。
- 行空间与零空间正交：$A\boldsymbol{x}=\boldsymbol{0}$ 说明 $\boldsymbol{x}$ 与 $A$ 的每一行正交，而每一行正交意味着与行空间的一切线性组合正交；对 $A^{\mathsf T}$ 同理可得列空间与左零空间正交。
- **正交补**（orthogonal complement）：$N(A)$ 包含**全部**与行空间正交的向量，因此 $N(A)=C(A^{\mathsf T})^{\perp}$，同理 $N(A^{\mathsf T})=C(A)^{\perp}$；维数分别满足 $r+(n-r)=n$ 与 $r+(m-r)=m$。
- $\mathbb R^3$ 中的例子：$A=\begin{bmatrix}1&2&5\\2&4&10\end{bmatrix}$ 的秩为 $1$，行空间是过 $(1,2,5)$ 的直线；零空间由 $x_1+2x_2+5x_3=0$ 给出，是以 $(1,2,5)$ 为法向量的平面。
- 无解时的最佳解满足 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$，这是本章的中心方程；$A^{\mathsf T}A$ 是 $n\times n$ 对称矩阵。
- 例：$A=\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}$ 给出 $A^{\mathsf T}A=\begin{bmatrix}3&8\\8&30\end{bmatrix}$，行列式 $26\neq 0$；两列成比例时（如 $A=\begin{bmatrix}1&3\\1&3\\1&3\end{bmatrix}$）$A^{\mathsf T}A=\begin{bmatrix}3&9\\9&27\end{bmatrix}$，秩为 $1$、不可逆。
- 一般地 $N(A^{\mathsf T}A)=N(A)$、$\operatorname{rank}(A^{\mathsf T}A)=\operatorname{rank}(A)$；$A^{\mathsf T}A$ 可逆当且仅当 $A$ 的列线性无关。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| orthogonal | 正交 | 两个向量夹角为 $90^\circ$，等价于点积为零 |
| dot product | 点积 | 对应分量相乘再求和，写成 $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$ |
| orthogonal subspaces | 正交子空间 | 一个子空间中的每个向量都与另一个子空间中的每个向量正交 |
| orthogonal complement | 正交补 | 与给定子空间正交的**全部**向量构成的子空间，如 $N(A)=C(A^{\mathsf T})^{\perp}$ |
| row space | 行空间 | $A$ 的各行张成的子空间，记为 $C(A^{\mathsf T})$ |
| nullspace | 零空间 | 满足 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部 $\boldsymbol{x}$，记为 $N(A)$ |
| column space | 列空间 | $A$ 的各列张成的子空间，记为 $C(A)$ |
| left nullspace | 左零空间 | 满足 $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$ 的全部 $\boldsymbol{y}$，记为 $N(A^{\mathsf T})$ |
| four fundamental subspaces | 四个基本子空间 | 行空间、零空间、列空间、左零空间，两两正交配对 |
| symmetric matrix | 对称矩阵 | 满足 $A^{\mathsf T}=A$ 的矩阵，$A^{\mathsf T}A$ 总是对称的 |
| linearly independent | 线性无关 | 各列的零组合只有平凡解，等价于 $N(A)$ 只含零向量 |
| best solution | 最佳解 | $A\boldsymbol{x}=\boldsymbol{b}$ 无解时满足 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$ 的 $\hat{\boldsymbol{x}}$ |

---

[← Lecture 13](/notes/mit-1806/lec13) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 15 →](/notes/mit-1806/lec15)
