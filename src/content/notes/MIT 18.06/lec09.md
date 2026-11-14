---
title: Lecture 9 · 线性无关、基与维数
description: 理解线性无关、基与维数，学会计算子空间的维数。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 10
tags:
  - lineal algebra
status: completed
publish: true
---

> *Independence, basis, and dimension* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 9 讲 / 共 35 讲** ｜ 第一部分 · 消元与向量空间

**本讲视频**：[Bilibili p9 · 线性无关、基与维数](https://www.bilibili.com/video/BV1ix411f7Yp?p=9)（50:20）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-9-independence-basis-and-dimension/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=9&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

到此为止，我们已经会做两件事：用消元把 $A$ 化成**行最简形**（row reduced echelon form），从而解出 $A\boldsymbol{x}=\boldsymbol{b}$；把解集看成**零空间**（nullspace），把 $A\boldsymbol{x}$ 看成列向量的组合，从而得到**列空间**（column space）。但这几个"空间"还没有被度量：一个子空间里有多少个独立的方向？最少要用几个向量才能把它完整描述出来？本讲给出四个词，把这几个问题变成可以计算的东西——**线性无关**（linear independence）、**张成**（span）、**基**（basis）、**维数**（dimension）。

四个词分工明确。线性无关只问一件事：这些向量的组合有没有可能在系数不全为零时意外地得到零向量。张成问的是反方向：取遍所有组合，能铺出多大一块空间。基把两者合在一起，要求"不多不少"、恰好够用。维数则把"一组基里有多少个向量"这件事本身变成一个可以使用的数，用来衡量空间的大小。使用时要分清对象：无关、张成、基都是一组向量的性质，而维数是空间的属性，秩是矩阵的属性，三者不能互换说法。

本讲最终落到两条等式：矩阵的秩等于列空间的维数，也等于主元列的个数；零空间的维数等于自由变量的个数，即 $n-r$。下一讲把四个基本子空间摆在一起时，这两条等式会扩展成完整的图景，所以这一讲先把列空间与零空间这一半说透。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-d27b05c48d235233e0703b6b.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 9 Summary，CC BY-NC-SA 4.0）。*

## 1. 先看一个事实：未知数多于方程

在定义任何名词之前，先确认一条后面反复用到的事实。设 $A$ 是 $m\times n$ 矩阵，且 $m<n$：方程个数少，未知数个数多。那么齐次方程 $A\boldsymbol{x}=\boldsymbol{0}$ 一定有非零解，也就是说 $N(A)$ 里除了零向量还有别的东西。

理由完全来自消元，不需要新工具。把 $A$ 化成行最简形，主元的个数不会超过行数 $m$，因为每一行至多贡献一个主元。而矩阵一共有 $n$ 列，没有被主元占住的列就是**自由列**（free column），对应的变量是**自由变量**（free variable）。既然主元至多 $m$ 个，自由变量就至少有 $n-m$ 个。把其中任意一个自由变量取成 $1$、其余取成 $0$，再回代解出各个主变量，就得到一组解；这组解的那个自由分量等于 $1$，所以它绝不可能是零向量。

一句话：列数多于行数时，零空间一定不是 $\{\boldsymbol{0}\}$。而且这样造出来的解不止一个：$n-m$ 个自由变量中任选一个取 $1$、其余取 $0$，就得到一组不同的解。这条事实马上会以几何面貌出现——平面上放三个向量，它们必定线性相关。

## 2. 线性无关：组合是否只有平凡的一种

现在给定义。要注意对象是一组向量，我们不会说"一个矩阵线性无关"。称向量 $\boldsymbol{v}_1,\boldsymbol{v}_2,\dots,\boldsymbol{v}_n$ **线性无关**（linearly independent），是指组合式



$$
c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2+\cdots+c_n\boldsymbol{v}_n=\boldsymbol{0}
$$



只有一种成立方式：$c_1=c_2=\cdots=c_n=0$。全取零系数当然给出零向量，这个组合称为**平凡组合**（trivial combination）；无关的意思是"除此以外再无他法"。反之，如果存在一组不全为零的系数使上式成立，就称这些向量**线性相关**（linearly dependent），而那组系数正好指出了哪一个向量是其余的线性组合。

两种说法可以互相翻译。若某个向量是其余向量的组合，例如 $\boldsymbol{v}_n=a_1\boldsymbol{v}_1+\cdots+a_{n-1}\boldsymbol{v}_{n-1}$，移项即得 $a_1\boldsymbol{v}_1+\cdots+a_{n-1}\boldsymbol{v}_{n-1}-\boldsymbol{v}_n=\boldsymbol{0}$，系数里有一个 $-1$，是不全为零的一组，于是相关。反过来，相关的那组非零系数也总能移项解出其中某个系数非零的向量。所以"相关"与"有一个向量是其余的组合"是同一件事；只是有三个以上向量时，多余的那个不一定是某个单独的向量的倍数，而可能是几个向量的一次集体抵消。

看三个小例子。

第一个，$\boldsymbol{v}$ 与 $2\boldsymbol{v}$。取 $2\boldsymbol{v}_1-\boldsymbol{v}_2=\boldsymbol{0}$，系数 $(2,-1)$ 不全为零，所以相关。第二个向量只是第一个拉长了一倍，没有带来新方向。

第二个，$\boldsymbol{v}$ 与零向量。只要这组向量里混进零向量，无关性立刻失效：把零向量配上系数 $1$、其余配上 $0$，组合就是零向量。若 $\boldsymbol{v}_1=(2,1)$、$\boldsymbol{v}_2=(0,0)$，则 $0\cdot\boldsymbol{v}_1+6\cdot\boldsymbol{v}_2=\boldsymbol{0}$。

第三个，平面上两个不共线的向量。组合 $c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2$ 要成为零，只能 $c_1=c_2=0$，所以无关。可是在这张平面里再添第三个向量 $\boldsymbol{v}_3$，三个就一定相关。用第 1 节的事实：把三个向量按列排成 $2\times 3$ 的矩阵 $A$，列数 $3$ 大于行数 $2$，于是存在非零的 $\boldsymbol{c}=(c_1,c_2,c_3)$ 使 $A\boldsymbol{c}=\boldsymbol{0}$，写成组合正是



$$
c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2+c_3\boldsymbol{v}_3=\boldsymbol{0}.
$$



几何上说得更直白：第三个向量逃不出前两个张成的平面，所以它必定是二者的某种组合。

![视频 00:05:02：课堂板书](</attachments/mit1806-dfa89c69d8c7a6b3ee13ea9a.jpg>)

*视频 00:05:02｜约对应第 2 节「2. 线性无关：组合是否只有平凡的一种」附近。*

![视频 00:10:40：课堂板书](</attachments/mit1806-f9fdfe1f1fd0b01ee2a68cc6.jpg>)

*视频 00:10:40｜约对应第 2 节「2. 线性无关：组合是否只有平凡的一种」附近。*

## 3. 判定方法：把向量排成矩阵

上面的第三个例子已经暗示了判定的办法——把向量竖起来排成矩阵。设 $\boldsymbol{v}_1,\dots,\boldsymbol{v}_n$ 是 $m$ 维空间中的向量，把它们作为列排成 $m\times n$ 矩阵



$$
A=\begin{bmatrix}\boldsymbol{v}_1&\boldsymbol{v}_2&\cdots&\boldsymbol{v}_n\end{bmatrix}.
$$



组合 $c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n$ 恰好等于乘积 $A\boldsymbol{c}$，其中 $\boldsymbol{c}$ 是以这些系数为分量的列向量。于是定义可以原封不动地翻译成一句关于零空间的话：



$$
\boldsymbol{v}_1,\dots,\boldsymbol{v}_n\ \text{线性无关}\iff N(A)=\{\boldsymbol{0}\}.
$$



相关的意思就是 $N(A)$ 里有非零向量。零空间的每个非零向量都是一份"如何用这些列凑出零"的配方，它不回答"哪一列多余"，却精确记录了这些列彼此依赖的方式。

这里 $m$ 是向量所在空间维数，$n$ 是向量的个数，两者可以差得很远。$m>n$ 时这些向量不足以张成整个 $\mathbb{R}^m$，但它们仍可能无关——$\mathbb{R}^3$ 里两个不成比例的向量就是如此，究竟如何要看具体数值；$m<n$ 时立刻落回第 1 节的结论，必相关。判定统一落在 $N(A)$ 上：$n\le m$ 时它有可能只含零向量，$n>m$ 时它一定装得下非零向量。

换成秩的说法。无关时每一列都是**主元列**（pivot column），没有自由列，因此 $r=n$，此时必然 $n\le m$。相关时至少有一个自由变量，$r<n$。自由列的含义正是"这一列可以用前面的主元列组合出来"：消元时它没能在自己的位置上立起主元，说明它没能提供新的方向。所谓相关的列，就是这些"多余"的列。

特别地，当向量个数与空间维数相等时矩阵是方阵，此时



$$
\text{各列线性无关}\iff A\ \text{可逆}\iff r=n .
$$



这条等价关系是后面判断"是不是基"的主要工具。

![视频 00:15:06：课堂板书](</attachments/mit1806-85dd452a90eca0217aef534d.jpg>)

*视频 00:15:06｜约对应第 3 节「3. 判定方法：把向量排成矩阵」附近。*

## 4. 张成与基：不多不少的一组向量

一组向量的所有线性组合构成的集合，称为它们的**张成**（span）。若空间 $S$ 恰好由这些组合组成，就说这组向量张成 $S$。这个说法并不新：把 $A$ 的各列取出来做一切组合，得到的就是 $C(A)$，所以"$A$ 的列张成列空间"只是同一件事换了个说法。

张成还有一个"最小"的刻画。设 $S$ 是某组向量的张成，则 $S$ 本身是包含这组向量的子空间；反过来，任何包含这组向量的子空间都必须对它的一切线性组合封闭，因而必须把整个 $S$ 包含进去。所以张成是包含这组向量的最小子空间。把"取所有组合、再装进一个空间"压缩成一个词，就是 span。

现在把无关与张成合起来。空间 $S$ 的一组**基**（basis）是一个向量序列 $\boldsymbol{v}_1,\dots,\boldsymbol{v}_d$，满足两条：其一，它们线性无关；其二，它们张成 $S$。

两条各管一头。第一条保证没有多余的向量：若去掉其中某个之后剩下的仍能张成 $S$，那么被去掉的那个就是其余向量的组合，与无关性矛盾。第二条保证没有遗漏。用最朴素的话说，基的向量个数"刚刚好"——少一个就不够，多一个就必相关。

一组基就把空间说清楚了：知道基，取遍组合就得到空间中的每个向量，而要描述这个空间也不必再添别的东西。所以此后凡遇到一个子空间，"给我一组基"就是最标准的问法，也是作业、测验与考试反复出现的题型。

无关与张成是两个独立的问题，一组向量对某个空间可以有四种处境。既无关又张成，它就是基，这是最好的情形。张成但相关，说明向量给多了：例如第 7 节那个 $3\times4$ 矩阵的四列，它们张成列空间，却多出了用不上的列。无关但不张成，说明给少了：第 5 节的 $(1,1,2)$ 与 $(2,2,5)$ 对 $\mathbb{R}^3$ 就是如此。既不无关也不张成，那这组向量与这个空间并不相配。基恰好是从四种处境里挑出的那一种。

![官方讲义摘要 第 2/3 页](</attachments/mit1806-a270ed635b29ba49ea2ad90f.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 9 Summary，CC BY-NC-SA 4.0）。*

## 5. 例子：$\mathbb{R}^3$ 的基不止一组

先看最熟悉的一组。$\mathbb{R}^3$ 的标准基是



$$
\boldsymbol{e}_1=\begin{bmatrix}1\\0\\0\end{bmatrix},\qquad
\boldsymbol{e}_2=\begin{bmatrix}0\\1\\0\end{bmatrix},\qquad
\boldsymbol{e}_3=\begin{bmatrix}0\\0\\1\end{bmatrix},
$$



即三条坐标轴的方向。无关性一眼可见：$c_1\boldsymbol{e}_1+c_2\boldsymbol{e}_2+c_3\boldsymbol{e}_3=(c_1,c_2,c_3)$，要它等于零只能三个系数全为零。换成矩阵语言，这三个向量排成的矩阵是单位矩阵 $I$，而 $N(I)=\{\boldsymbol{0}\}$。它们张成 $\mathbb{R}^3$，因为任何 $(x,y,z)$ 都等于 $x\boldsymbol{e}_1+y\boldsymbol{e}_2+z\boldsymbol{e}_3$。这组向量称为**标准基**（standard basis）。

但基远不止这一组。取



$$
\boldsymbol{v}_1=\begin{bmatrix}1\\1\\2\end{bmatrix},\qquad
\boldsymbol{v}_2=\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



两者不成比例，故无关。它们张成 $\mathbb{R}^3$ 吗？不。它们的组合形如



$$
a\begin{bmatrix}1\\1\\2\end{bmatrix}+b\begin{bmatrix}2\\2\\5\end{bmatrix}
=\begin{bmatrix}a+2b\\ a+2b\\ 2a+5b\end{bmatrix},
$$



第一、第二两个分量永远相等，所以像 $(1,0,0)$ 这样的向量根本组合不出来。这两个向量张成的，是 $\mathbb{R}^3$ 中由 $x_1=x_2$ 定义的那张过原点的平面。

这张平面也有它自己的基，而且就是这两个向量：它们无关，又张成这张平面。可见"是基"总是相对于某个空间而言的，同一组向量可以是小空间的基，却不是大空间的基。$\boldsymbol{v}_1,\boldsymbol{v}_2$ 不能做 $\mathbb{R}^3$ 的基，缺的不是无关性，而是张成。

现在补第三个向量。若补上 $(3,3,7)$，那是个糟糕的选择，因为



$$
\begin{bmatrix}3\\3\\7\end{bmatrix}
=\begin{bmatrix}1\\1\\2\end{bmatrix}+\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



它没有带来新方向，三个向量仍然只张成那张平面，并且变得相关：$\boldsymbol{v}_1+\boldsymbol{v}_2-\boldsymbol{v}_3=\boldsymbol{0}$。张成没有变大，无关性却丢了，所以它连这张平面的基都不算了。

第三个向量必须不在这张平面内，也就是前两个分量不能相等。顺手补上 $(3,3,8)$，它看上去并不像前两个的和，但它的前两个分量仍然相等，仍落在同一张平面里；事实上



$$
\begin{bmatrix}3\\3\\8\end{bmatrix}
=-\begin{bmatrix}1\\1\\2\end{bmatrix}+2\begin{bmatrix}2\\2\\5\end{bmatrix},
$$



三个向量依旧相关。若第三个向量随手写成 $(5,7,-14)$，光看数字更无从判断。可见判断一组向量是不是基，不能靠"看起来像不像组合"，只能把向量排成矩阵做消元，看有没有自由变量。

对 $\mathbb{R}^n$ 中的 $n$ 个向量，这句话有个干脆的版本：把它们作为列排成 $n\times n$ 矩阵，它们是 $\mathbb{R}^n$ 的基当且仅当这个矩阵**可逆**（invertible）。可逆意味着 $n$ 个主元、没有自由列，于是 $n$ 列既无关，又张成整个 $\mathbb{R}^n$。

由此看来，$\mathbb{R}^3$ 的基多得数不清：随便写一个可逆的 $3\times3$ 矩阵，它的三列就是一组基。真正不随基改变的不是那些向量，而是它们的个数。

![视频 00:32:43：课堂板书](</attachments/mit1806-c9a0299c484b776f57f77867.jpg>)

*视频 00:32:43｜约对应第 5 节「5. 例子：$\mathbb{R}^3$ 的基不止一组」附近。*

## 6. 维数：所有基的向量个数相同

$\mathbb{R}^3$ 有那么多组基，它们之间有什么共同点？有，而且是最关键的一条：它们含有相同个数的向量。这不是 $\mathbb{R}^3$ 的特殊现象。

给定一个空间 $S$——可以是 $\mathbb{R}^n$，可以是某个矩阵的列空间或零空间，也可以是别的子空间——它的每一组基都含有相同个数的向量。若一组基有 $6$ 个向量，那么任何别的基也有 $6$ 个：$7$ 个就太多，必相关；$5$ 个就不够，张不成。这个共同的数目称为 $S$ 的**维数**（dimension），记作 $\dim S$。

这一点并不显然：一个空间有无穷多组基，凭什么它们的向量个数一致？可是它确实成立，而且正是靠着它，"维数"这个词才能被定义——否则我们只能说"某一组基有几个向量"，不能说"这个空间有几维"。维数因此不是某组基碰巧的向量个数，而是空间的固有属性。$\dim\mathbb{R}^3=3$，$\dim\mathbb{R}^n=n$，第 5 节那张平面的维数是 $2$。

维数一旦知道，判断基就省了一半工作。若已知 $\dim S=d$，手上有 $d$ 个 $S$ 中的向量且它们线性无关，则它们自动是 $S$ 的基，不必再验证张成。理由：假如它们张不成 $S$，$S$ 中就有一个向量 $\boldsymbol{w}$ 不在它们的张成里，把 $\boldsymbol{w}$ 添进去便得到 $d+1$ 个无关向量；但这 $d+1$ 个向量都落在 $S$ 中，它们张成的是 $S$ 的一个 $d+1$ 维子空间，与 $\dim S=d$ 矛盾。所以"个数对 + 无关"已经够用；反过来，$S$ 中超过 $d$ 个向量必定相关。

回到矩阵，两条维数公式是这一讲的核心结论：



$$
\dim C(A)=r,\qquad \dim N(A)=n-r .
$$



第一条：主元列构成列空间的一组基，主元列的个数就是秩 $r$，所以**秩等于列空间的维数**。第二条：每个自由变量取一次"一个 $1$、其余 $0$"，就得到一个特殊解，这些特殊解构成零空间的基，个数正是自由变量的个数 $n-r$。

同时要把用词分清。秩是矩阵的属性，维数是空间的属性：我们说"矩阵 $A$ 的秩"，不说"矩阵的维数"；说"子空间 $S$ 的维数"，不说"子空间的秩"。"$A$ 的秩等于 $C(A)$ 的维数"这句话之所以有意义，正因为它把一个矩阵的数值和它对应的空间的大小联系了起来。

![视频 00:38:41：课堂板书](</attachments/mit1806-ce3e94a4c5ce3d58a5106ff1.jpg>)

*视频 00:38:41｜约对应第 6 节「6. 维数：所有基的向量个数相同」附近。*

![视频 00:40:16：课堂板书](</attachments/mit1806-73e890cfb1c86a9d0569fcc3.jpg>)

*视频 00:40:16｜约对应第 6 节「6. 维数：所有基的向量个数相同」附近。*

## 7. 一个 $3\times 4$ 的算例

用一个具体矩阵把两套计算走一遍：



$$
A=\begin{bmatrix}1&2&3&1\\1&1&2&1\\1&2&3&1\end{bmatrix}.
$$



四列依次是 $\boldsymbol{c}_1=(1,1,1)$、$\boldsymbol{c}_2=(2,1,2)$、$\boldsymbol{c}_3=(3,2,3)$、$\boldsymbol{c}_4=(1,1,1)$。

这四列张成列空间，这是定义使然；但它们是基吗？不是。第三列是前两列之和，$\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$；第四列与第一列完全相同，$\boldsymbol{c}_4=\boldsymbol{c}_1$。写成组合，



$$
-\boldsymbol{c}_1-\boldsymbol{c}_2+\boldsymbol{c}_3=\boldsymbol{0},
\qquad
-\boldsymbol{c}_1+\boldsymbol{c}_4=\boldsymbol{0},
$$



所以 $(-1,-1,1,0)$ 与 $(-1,0,0,1)$ 都在零空间里，四列相关。

用消元确认秩。第二行减第一行，第三行减第一行：



$$
A\to\begin{bmatrix}1&2&3&1\\0&-1&-1&0\\0&0&0&0\end{bmatrix}.
$$



主元是 $1$ 与 $-1$，落在第 $1$、$2$ 列；第 $3$、$4$ 列是自由列，$x_3,x_4$ 是自由变量。秩 $r=2$。

列空间最自然的一组基是两个主元列



$$
\left\{\begin{bmatrix}1\\1\\1\end{bmatrix},\ \begin{bmatrix}2\\1\\2\end{bmatrix}\right\}.
$$



但基不唯一：$\{\boldsymbol{c}_1,\boldsymbol{c}_3\}$、$\{\boldsymbol{c}_2,\boldsymbol{c}_3\}$、$\{\boldsymbol{c}_2,\boldsymbol{c}_4\}$ 都可以。甚至可以完全不用原来的列。例如



$$
\begin{bmatrix}2\\2\\2\end{bmatrix}=2\boldsymbol{c}_1,\qquad
\begin{bmatrix}6\\4\\6\end{bmatrix}=2\boldsymbol{c}_1+2\boldsymbol{c}_2
$$



都在列空间里，二者不成比例因而无关；既然 $\dim C(A)=2$，个数正好、又无关，它们就自动是列空间的一组基，张成性不必再查。四列全部相加得到 $(7,5,7)$，它同样落在列空间内。

再算零空间。上面的方程组其实就是



$$
x_1+2x_2+3x_3+x_4=0,\qquad -x_2-x_3=0 .
$$



取 $x_3=1,x_4=0$：由第二式 $x_2=-1$，再由第一式 $x_1=-2x_2-3x_3-x_4=2-3-0=-1$，得 $(-1,-1,1,0)$。取 $x_3=0,x_4=1$：得 $x_2=0$，$x_1=0-0-1=-1$，即 $(-1,0,0,1)$。这两个向量无关，而零空间中每个向量都是它们的组合，所以它们构成零空间的一组基，$\dim N(A)=2$。回头看，第一个向量复述的正是 $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$，第二个复述的正是 $\boldsymbol{c}_4=\boldsymbol{c}_1$：零空间的基就是一份清单，逐条列出这些列之间的依赖关系。

最后核对维数公式。这里 $n=4$、$r=2$，



$$
\dim C(A)=r=2,\qquad \dim N(A)=n-r=4-2=2 .
$$



秩把两个空间的维数串了起来：有几个主元列，列空间就有几维；剩下的每一列都对应一个自由变量，也就贡献零空间的一维。

![视频 00:45:18：课堂板书](</attachments/mit1806-2ef85a77b7fce1a1e4d0fc8c.jpg>)

*视频 00:45:18｜约对应第 7 节「7. 一个 $3\times 4$ 的算例」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-d00b687d44bdfa926d4584ad.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 9 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 若 $m<n$，即未知数多于方程，消元后主元至多 $m$ 个，自由变量至少有 $n-m$ 个，故 $A\boldsymbol{x}=\boldsymbol{0}$ 必有非零解。
- 一组向量**线性无关**，指 $c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n=\boldsymbol{0}$ 只有全零系数一种解；否则称**线性相关**，那组不全为零的系数说明了它们如何互相表示。
- 含零向量的任何一组向量必相关；$\boldsymbol{v}$ 与 $2\boldsymbol{v}$ 必相关；平面上三个向量必相关，因为 $2\times3$ 矩阵必有自由变量。
- 把向量按列排成 $A$，则无关等价于 $N(A)=\{\boldsymbol{0}\}$，等价于 $r=n$、没有自由列；方阵情形等价于可逆。
- **张成**是一组向量所有组合的集合，它是包含这组向量的最小子空间；**基**是既无关又张成该空间的一组向量，"不多不少"。
- 基不唯一，但同一空间的各组基含有相同个数的向量，这个数就是该空间的**维数**。$\dim\mathbb{R}^n=n$，平面的维数是 $2$。
- 已知 $\dim S=d$ 时，$S$ 中 $d$ 个无关向量自动构成基；这是"个数对 + 无关即可"的捷径。
- 两条核心公式：$\dim C(A)=r$（$r$ 为主元列个数），$\dim N(A)=n-r$（自由变量个数）。秩属于矩阵，维数属于空间。
- 算例的四列为 $\boldsymbol{c}_1=(1,1,1)$、$\boldsymbol{c}_2=(2,1,2)$、$\boldsymbol{c}_3=(3,2,3)$、$\boldsymbol{c}_4=(1,1,1)$，其中 $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$、$\boldsymbol{c}_4=\boldsymbol{c}_1$，故 $r=2$；$\{\boldsymbol{c}_1,\boldsymbol{c}_2\}$ 或 $\{(2,2,2)^{\mathsf T},(6,4,6)^{\mathsf T}\}$ 都是列空间的基，零空间的基是 $(-1,-1,1,0)$ 与 $(-1,0,0,1)$，两个维数都是 $2$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| linearly independent | 线性无关 | 只有全零系数才能把组合凑成零向量 |
| linearly dependent | 线性相关 | 存在不全为零的系数使组合为零向量 |
| trivial combination | 平凡组合 | 所有系数都取零的组合，总给出零向量 |
| span | 张成 | 一组向量所有线性组合构成的集合，是含它们的最小子空间 |
| basis | 基 | 既线性无关又张成该空间的一组向量 |
| standard basis | 标准基 | $\mathbb{R}^n$ 中沿各坐标轴方向的单位向量 $\boldsymbol{e}_1,\dots,\boldsymbol{e}_n$ |
| dimension | 维数 | 空间任一组基中向量的个数 |
| rank | 秩 | 矩阵主元列的个数，等于列空间的维数 |
| free variable | 自由变量 | 对应自由列、可任意取值的变量，个数为 $n-r$ |
| pivot column | 主元列 | 含主元的列，主元列构成列空间的一组基 |
| column space | 列空间 | 各列一切线性组合构成的子空间 |
| nullspace | 零空间 | 满足 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部向量 |
| invertible | 可逆 | 方阵有逆矩阵；对 $n$ 个向量即"构成 $\mathbb{R}^n$ 的基" |

---

[← Lecture 8](/notes/mit-1806/lec08) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 10 →](/notes/mit-1806/lec10)
