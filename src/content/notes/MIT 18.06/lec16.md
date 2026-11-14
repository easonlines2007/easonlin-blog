---
title: Lecture 16 · 投影矩阵与最小二乘
description: 掌握投影矩阵与最小二乘，理解正规方程。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 17
tags:
  - lineal algebra
status: completed
publish: true
---

> *Projection matrices and least squares* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 16 讲 / 共 35 讲** ｜ 第二部分 · 正交性与行列式

**本讲视频**：[Bilibili p16 · 投影矩阵与最小二乘](https://www.bilibili.com/video/BV1ix411f7Yp?p=16)（48:05）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-16-projection-matrices-and-least-squares/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=16&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲把投影写成了矩阵：若 $m\times n$ 矩阵 $A$ 的列线性无关（linearly independent），构成某个子空间的一组基（basis），那么把向量投影到该子空间上的**投影矩阵**（projection matrix）是



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



本讲先回到这个公式，用两个极端情形检验它：向量本来就在子空间里时，投影应当原样返回它；向量与子空间处处垂直时，投影应当是零。一般向量介于两者之间，被拆成“子空间内”与“子空间外”两块。这一步既复习了投影，也把投影、四个基本子空间与矩阵代数串在一起，为最小二乘做好几何准备。

本讲的主线是**最小二乘**（least squares）。给三个数据点拟合一条直线，会写出三个方程、却只有两个未知数，方程组无解；但可以追问哪条直线的总误差最小。把误差定义为残差向量（residual vector）的长度、把“最小”定义为长度平方最小，问题在几何上就是把数据向量投影到列空间（column space），在代数上则归结为一个 $2\times 2$ 的**正规方程**（normal equations）$A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$。解出它，最佳直线的系数、投影向量以及每个点的误差就一起得到了。

最后补上一件此前一直在用、却还没有证明的事：$A$ 的列线性无关时，$A^{\mathsf T}A$ 一定可逆。这个事实支撑着投影公式与正规方程的每一步推导，而证明只用两样工具：向量长度的平方与零空间。沿着同一条线索再往前一步，会看到一种更理想的列：若它们不仅线性无关，而且两两垂直、长度为 $1$，则 $A^{\mathsf T}A=I$，正规方程简化到几乎不用计算。这正是下一讲的主题。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-ffbdd70f3a94bc9bfb04201d.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 16 Summary，CC BY-NC-SA 4.0）。*

## 1. 投影矩阵：两个极端情形

设 $A$ 是 $m\times n$ 矩阵，$n$ 个列向量线性无关，构成列空间 $C(A)$ 的一组基。把向量 $\boldsymbol b\in\mathbb R^m$ 投影到 $C(A)$ 上，结果由



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T},
\qquad
\boldsymbol p=P\boldsymbol b
$$



给出，$P$ 是 $m\times m$ 的方阵。这个公式看起来复杂，要做的事却很简单：在列空间里找离 $\boldsymbol b$ 最近的点。用两个极端情形就能看清它是怎么做到的。

第一种情形：$\boldsymbol b$ 本来就在列空间里。列空间由 $A$ 的列张成，其中每个向量都能写成 $A\boldsymbol x$ 的形式，于是设 $\boldsymbol b=A\boldsymbol x$。代入公式，中间两个因子 $(A^{\mathsf T}A)^{-1}$ 与 $A^{\mathsf T}A$ 相邻，先乘成单位矩阵（identity matrix）：



$$
P\boldsymbol b=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}(A\boldsymbol x)
=A(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)\boldsymbol x=A\boldsymbol x=\boldsymbol b.
$$



投影之后什么也没变。这合乎“最近点”的定义：$\boldsymbol b$ 到列空间的距离是零，最近点就是它自己。

第二种情形：$\boldsymbol b$ 与整个列空间垂直。与列空间垂直，就是与 $A$ 的每一列都垂直，即 $A^{\mathsf T}\boldsymbol b=\boldsymbol 0$。这些向量组成四个基本子空间中的**左零空间**（left nullspace）$N(A^{\mathsf T})$。此时



$$
P\boldsymbol b=A(A^{\mathsf T}A)^{-1}(A^{\mathsf T}\boldsymbol b)=\boldsymbol 0,
$$



因为最右边的因子 $A^{\mathsf T}\boldsymbol b$ 已经是零向量。一个在列空间方向上没有任何分量的向量，其最近点只能是原点。

一般向量介于两者之间，被投影干净地切成两块：



$$
\boldsymbol b=\boldsymbol p+\boldsymbol e,\qquad \boldsymbol p=P\boldsymbol b,\quad \boldsymbol e=(I-P)\boldsymbol b,
$$



其中 $\boldsymbol p$ 在列空间内，$\boldsymbol e$ 与列空间垂直，称为**误差向量**（error vector）。从图上看，$\boldsymbol p$ 是 $\boldsymbol b$ 落在列空间上的影子，$\boldsymbol e$ 是垂直于列空间的那一段偏离，两者以 $\boldsymbol b$ 为斜边构成直角三角形。$I-P$ 本身也是一个投影矩阵，它把向量投影到与列空间垂直的那个子空间上。这一点从代数上可以直接验证：若 $P^{\mathsf T}=P$ 且 $P^2=P$，则



$$
(I-P)^{\mathsf T}=I-P^{\mathsf T}=I-P,
\qquad
(I-P)^2=I-2P+P^2=I-P.
$$



投影矩阵的两个基本性质——关于转置（transpose）对称、平方等于自身——都传给了它的补投影。平方等于自身意味着再投影一次不会改变结果：影子再投影，还是同一个影子。$P$ 保留 $\boldsymbol b$ 在列空间内的分量，$I-P$ 保留被 $P$ 丢掉的那一部分，两者合起来正好还原 $\boldsymbol b$。

![视频 00:04:49：课堂板书](</attachments/mit1806-35085a3d5c2e320ebc80009a.jpg>)

*视频 00:04:49｜约对应第 1 节「1. 投影矩阵：两个极端情形」附近。*

## 2. 三个点与一条直线

现在把投影用在一个具体问题上：找一条离三个数据点最近的直线。数据是 $t=1,2,3$ 三个时刻的观测值 $1,2,2$，要找的直线写成



$$
y=C+Dt,
$$



其中 $C$ 是截距、$D$ 是斜率。如果直线恰好经过三个点，就应当同时满足三个方程：



$$
\begin{cases}
C+D=1,\\
C+2D=2,\\
C+3D=2.
\end{cases}
$$



前两个点恰好落在 $y=t$ 上，但这条直线在 $t=3$ 处给出 $3$，比观测值 $2$ 大 $1$。找不到一条直线同时穿过三个点，这组方程无解。

把方程组写成矩阵形式：



$$
A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix},
\qquad
\boldsymbol x=\begin{bmatrix}C\\D\end{bmatrix},
\qquad
\boldsymbol b=\begin{bmatrix}1\\2\\2\end{bmatrix},
\qquad
A\boldsymbol x=\boldsymbol b.
$$



$A$ 是 $3\times 2$ 矩阵，方程比未知数多：三行对应三个时刻的观测，两列对应两个待定参数。它的两列 $(1,1,1)$ 与 $(1,2,3)$ 不成比例，线性无关，所以确实是列空间的一组基；而 $\boldsymbol b$ 不在这个列空间里，这正是方程无解的原因。于是退而求其次：在所有候选直线中选一条总体误差最小的。

“误差”需要定义。给定 $C,D$，三个方程各自的偏差是



$$
e_1=1-(C+D),\qquad e_2=2-(C+2D),\qquad e_3=2-(C+3D),
$$



排成向量就是 $\boldsymbol e=\boldsymbol b-A\boldsymbol x$。误差向量的长度越小，直线拟合得越好；长度非负，最小化长度与最小化它的平方是同一件事，因此用平方和



$$
E(C,D)=\|\boldsymbol e\|^2=(C+D-1)^2+(C+2D-2)^2+(C+3D-2)^2
$$



作为总体误差。这就是**最小二乘**这个名字的来历：让误差的平方和最小。

为什么用平方而不用长度本身？平方和是一个二次函数，求导之后得到的是线性方程，计算最干净；而且平方与长度在同一处取到零，也就是方程组有精确解、$\boldsymbol b$ 落在列空间里的情形。统计学家把这件事称为**线性回归**（linear regression），平方和是最常用的误差度量。它对**离群点**（outlier）却相当敏感：假如在 $t=0$ 处再加一个偏差很大的观测，它贡献的平方项会远远压过其余三项，把整条直线拽向自己。所以统计学家使用平方和之前，往往先找出并处理离群点，而不是让一个可能测错的观测主宰整条直线。

这个视角把最小二乘的意义说清楚了：原来的三个方程因为 $\boldsymbol b$ 不在列空间内而无解；把 $\boldsymbol b$ 换成列空间里最近的 $\boldsymbol p$ 之后，方程组就相容了，解正是那对 $(C,D)$。所以最小二乘做的事，是用一个最近的、有解的方程组代替原来的无解方程组，而“最近”指的是误差向量的长度最小。

同一个问题有两种画法。第一种画在数据平面上：横轴是 $t$，纵轴是 $y$，三个点是观测，直线是候选，三条竖直小线段就是 $e_1,e_2,e_3$。第二种画在 $\mathbb R^3$ 里：$\boldsymbol b=(1,2,2)$ 是一个点，$A$ 的列空间是一张过原点的平面，最佳直线对应的向量 $\boldsymbol p$ 是平面内离 $\boldsymbol b$ 最近的点，$\boldsymbol e$ 则是从 $\boldsymbol p$ 指向 $\boldsymbol b$ 的垂直段。设最佳直线在三个时刻的高度依次为 $P_1,P_2,P_3$，则 $\boldsymbol p=(P_1,P_2,P_3)$；它落在列空间内，意味着存在 $C,D$ 使 $\boldsymbol p=C(1,1,1)+D(1,2,3)$，而这对 $(C,D)$ 正是最佳直线的系数。两张图说的是同一件事：数据图上“点到直线的竖直距离”，就是向量图上误差向量的三个分量。

![视频 00:12:25：课堂板书](</attachments/mit1806-c947511955d2d13f79178433.jpg>)

*视频 00:12:25｜约对应第 2 节「2. 三个点与一条直线」附近。*

![视频 00:14:26：课堂板书](</attachments/mit1806-8851f3c64f0bf8224e397c88.jpg>)

*视频 00:14:26｜约对应第 2 节「2. 三个点与一条直线」附近。*

## 3. 正规方程

求 $E(C,D)$ 的最小值有两条路，一条用微积分，一条用线性代数，它们给出同一个方程组。

微积分的路：分别对 $C,D$ 求偏导并令其为零，



$$
\frac{\partial E}{\partial C}=2\big[(C+D-1)+(C+2D-2)+(C+3D-2)\big]=0,
$$





$$
\frac{\partial E}{\partial D}=2\big[(C+D-1)+2(C+2D-2)+3(C+3D-2)\big]=0.
$$



整理得



$$
3C+6D=5,\qquad 6C+14D=11.
$$



线性代数的路：最小二乘解满足**正规方程**（normal equations）



$$
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b.
$$



把 $A,\boldsymbol b$ 代进去，正好得到上面那两个方程。它可以毫不夸张地称为统计与估计中最重要的方程：凡是“用少数几个参数去拟合带噪声的数据”，第一个要解的几乎总是它。

算一算两边的矩阵。$A^{\mathsf T}A$ 的 $(1,1)$ 元是三个 $1$ 的平方和 $3$；$(1,2)$ 元与 $(2,1)$ 元是 $(1,1,1)$ 与 $(1,2,3)$ 的点积 $1+2+3=6$；$(2,2)$ 元是 $1^2+2^2+3^2=14$，所以



$$
A^{\mathsf T}A=\begin{bmatrix}3&6\\6&14\end{bmatrix}.
$$



右端 $A^{\mathsf T}\boldsymbol b$ 的两个分量分别是 $\boldsymbol b=(1,2,2)$ 与两列的点积：$1+2+2=5$ 和 $1+4+6=11$，即



$$
A^{\mathsf T}\boldsymbol b=\begin{bmatrix}5\\11\end{bmatrix}.
$$



$A^{\mathsf T}A$ 是对称矩阵（symmetric matrix），这不是巧合：$(A^{\mathsf T}A)^{\mathsf T}=A^{\mathsf T}A$ 对任何 $A$ 都成立。逐元看更清楚：$A^{\mathsf T}A$ 的 $(i,j)$ 元就是第 $i$ 列与第 $j$ 列的点积，对角元则是各列长度的平方，交换 $i,j$ 不改变结果。它在这里还是可逆的，因为 $A$ 的列线性无关；课程后段还会说明它甚至是**正定**（positive definite）矩阵。对称、可逆、正定，正是这个关键矩阵最值得期待的三个性质。

解这个 $2\times 2$ 方程组。第二式减去第一式的两倍：



$$
(6C+14D)-2(3C+6D)=11-10,
$$



左边是 $2D$，于是 $D=\frac12$。代回第一式：$3C+3=5$，得 $C=\frac23$。最佳直线为



$$
y=\frac23+\frac12 t,
\qquad
\hat{\boldsymbol x}=\begin{bmatrix}2/3\\1/2\end{bmatrix}.
$$



方程只有两个，因为参数只有两个；若模型有 $n$ 个参数，正规方程就是 $n\times n$ 的方程组，阶数只由参数个数决定，与数据点的个数无关。

整个流程因此可以固定下来：从数据写出 $A$ 与 $\boldsymbol b$，解正规方程得到 $\hat{\boldsymbol x}$，再算 $\boldsymbol p=A\hat{\boldsymbol x}$ 与 $\boldsymbol e=\boldsymbol b-\boldsymbol p$。换一组数据，变的只是 $A$、$\boldsymbol b$ 和解出的两个数，步骤完全一样。

![官方讲义摘要 第 2/3 页](</attachments/mit1806-45e7ac68a3eaadf96cbb53a8.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 16 Summary，CC BY-NC-SA 4.0）。*

![视频 00:25:56：课堂板书](</attachments/mit1806-de0339517a7d1449a3c6b987.jpg>)

*视频 00:25:56｜约对应第 3 节「3. 正规方程」附近。*

## 4. 投影、误差与两张图

把 $\hat{\boldsymbol x}$ 代回 $A$，得到数据向量在列空间上的投影



$$
\boldsymbol p=A\hat{\boldsymbol x}
=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}\begin{bmatrix}2/3\\1/2\end{bmatrix}
=\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix}.
$$



三个分量是最佳直线在 $t=1,2,3$ 处的高度：$\frac76$ 略高于观测值 $1$，$\frac53$ 低于观测值 $2$，$\frac{13}{6}$ 高于观测值 $2$。误差向量是



$$
\boldsymbol e=\boldsymbol b-\boldsymbol p
=\begin{bmatrix}1\\2\\2\end{bmatrix}-\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix}
=\begin{bmatrix}-1/6\\1/3\\-1/6\end{bmatrix},
$$



显然 $\boldsymbol p+\boldsymbol e=\boldsymbol b$，三个残差两负一正、加起来正好为零。误差的平方和是



$$
\|\boldsymbol e\|^2=\frac{1}{36}+\frac{4}{36}+\frac{1}{36}=\frac16,
$$



这就是所有直线中能达到的最小总误差。

投影的几何性质在这个例子里可以逐个验证。$\boldsymbol e$ 与 $\boldsymbol p$ 的点积为



$$
\frac76\cdot\left(-\frac16\right)+\frac53\cdot\frac13+\frac{13}{6}\cdot\left(-\frac16\right)
=-\frac{7}{36}+\frac{20}{36}-\frac{13}{36}=0,
$$



两者垂直。但 $\boldsymbol e$ 垂直的不只是 $\boldsymbol p$：它与列空间中任何向量都垂直。取列空间里最简单的 $(1,1,1)$，点积为 $-\frac16+\frac13-\frac16=0$，这也说明了三个误差为什么会互相抵消；再取另一列 $(1,2,3)$，点积为 $-\frac16+\frac23-\frac12=0$。与两列都垂直，就与整个列空间垂直，即 $\boldsymbol e\in N(A^{\mathsf T})$。把 $\boldsymbol e=\boldsymbol b-A\hat{\boldsymbol x}$ 代入，



$$
A^{\mathsf T}(\boldsymbol b-A\hat{\boldsymbol x})=\boldsymbol 0
\;\Longleftrightarrow\;
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b,
$$



正是正规方程。原来“误差与列空间垂直”与“参数满足正规方程”是同一句话的两个版本，一个用几何说，一个用代数说。这也把本讲与投影公式接了起来：



$$
\boldsymbol p=A\hat{\boldsymbol x}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol b=P\boldsymbol b.
$$



再次对照两张图：数据图上，三条竖直误差的长度与方向由 $\boldsymbol e$ 的三个分量给出；向量图上，$\boldsymbol p$ 是 $\boldsymbol b$ 在列空间上的投影，$\boldsymbol e$ 是与之垂直的那一段。最佳直线的系数 $(\frac23,\frac12)$，正是 $\boldsymbol p$ 在基 $\{(1,1,1),(1,2,3)\}$ 下的坐标。换个说法：数据图上“最近”指竖直距离的平方和最小，向量图上“最近”指欧氏距离最小，两者其实是同一个意思。

![视频 00:31:15：课堂板书](</attachments/mit1806-63cb1b1bec085b9761e51519.jpg>)

*视频 00:31:15｜约对应第 4 节「4. 投影、误差与两张图」附近。*

![视频 00:35:20：课堂板书](</attachments/mit1806-13aaad110377380efc76c981.jpg>)

*视频 00:35:20｜约对应第 4 节「4. 投影、误差与两张图」附近。*

## 5. 为什么 $A^{\mathsf T}A$ 可逆

整个最小二乘的计算都建立在 $(A^{\mathsf T}A)^{-1}$ 上：投影公式要用它，正规方程也要用它。所以必须回答：这个矩阵什么时候可逆？

**定理：** 若 $A$ 的列线性无关，则 $A^{\mathsf T}A$ 可逆。

这个结论值得完整证明一次，因为它把前面学过的工具都用上了；证明有不止一条路，下面走最直接的一条。思路是证明 $A^{\mathsf T}A$ 的零空间（nullspace）只含零向量。设



$$
A^{\mathsf T}A\boldsymbol x=\boldsymbol 0.
$$



两边左乘 $\boldsymbol x^{\mathsf T}$：



$$
\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x=0.
$$



左边的 $\boldsymbol x^{\mathsf T}A^{\mathsf T}$ 就是 $(A\boldsymbol x)^{\mathsf T}$，于是整个表达式可以读成 $(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)$，也就是向量 $A\boldsymbol x$ 与自己的点积，即长度的平方 $\|A\boldsymbol x\|^2$。一个实向量的长度平方为零，只能是零向量，所以



$$
A\boldsymbol x=\boldsymbol 0.
$$



再用列线性无关这个假设：$A\boldsymbol x$ 是各列以 $\boldsymbol x$ 的分量为系数组合出来的向量，它等于零而系数不全为零，就意味着列线性相关。既然列线性无关，只能是



$$
\boldsymbol x=\boldsymbol 0.
$$



零空间里除了零向量什么都没有，$A^{\mathsf T}A$ 可逆。

这个证明很短，却把两件旧工具用在了关键处：一是把 $\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x$ 认成 $(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)$，靠的是转置的乘法规则与“向量与自身点积等于长度平方”；二是用零空间的语言处理列无关，$A$ 的列线性无关等价于 $A\boldsymbol x=\boldsymbol 0$ 只有零解。最后一步是唯一使用假设的地方，也说明了这个假设为什么不能省：如果列线性相关，就存在非零的 $\boldsymbol x$ 使 $A\boldsymbol x=\boldsymbol 0$，于是 $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$，这个矩阵注定不可逆，投影与正规方程都会失去意义。

![视频 00:38:28：课堂板书](</attachments/mit1806-e9c335f5c59d9e489462bd4f.jpg>)

*视频 00:38:28｜约对应第 5 节「5. 为什么 $A^{\mathsf T}A$ 可逆」附近。*

## 6. 标准正交的列

既然 $A^{\mathsf T}A$ 的可逆性来自列的线性无关，一个自然的问题是：什么样的列能让 $A^{\mathsf T}A$ 简单到极点？答案是两两垂直且长度为 $1$ 的列。

先看最熟悉的一组。取三个列向量 $(1,0,0),(0,1,0),(0,0,1)$ 排成矩阵，得到的是单位矩阵 $I$，显然 $A^{\mathsf T}A=I$。这三个向量两两垂直、长度都是 $1$，是最标准的例子。再看二维里的一对：



$$
\boldsymbol q_1=\begin{bmatrix}\cos\theta\\ \sin\theta\end{bmatrix},
\qquad
\boldsymbol q_2=\begin{bmatrix}-\sin\theta\\ \cos\theta\end{bmatrix}.
$$



两者长度都是 $1$；点积 $\cos\theta\cdot(-\sin\theta)+\sin\theta\cdot\cos\theta=0$，所以垂直。以它们为列，



$$
A=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix},
\qquad
A^{\mathsf T}A=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I.
$$



两两垂直且长度为 $1$ 的向量称为**标准正交**（orthonormal）向量。它们自动线性无关：两两垂直的非零向量的任何非平凡线性组合都不为零，所以上一节的定理保证这类矩阵的 $A^{\mathsf T}A$ 可逆。以标准正交向量为列的矩阵拥有最好的列：$A^{\mathsf T}A=I$，正规方程退化为 $\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$，既不用求逆，也不用消元；列与列之间没有耦合，每个参数可以单独确定。

那么，给定一组普通的基，怎样才能把它改造成标准正交基？这是下一讲要回答的问题。下一讲先说明标准正交的列为什么让一切计算变简单，再给出把任意一组基变成标准正交基的系统方法。

![官方讲义摘要 第 3/3 页](</attachments/mit1806-9a7924c58c10a9173749ae1b.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 16 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **投影矩阵**（projection matrix）为 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$，其中 $A$ 的列构成列空间的一组基；$P\boldsymbol b$ 是 $\boldsymbol b$ 在列空间中的最近点。
- 两个极端情形：$\boldsymbol b$ 在列空间内时 $P\boldsymbol b=\boldsymbol b$，因为 $(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)$ 抵消；$\boldsymbol b$ 与列空间垂直、即 $\boldsymbol b\in N(A^{\mathsf T})$ 时 $P\boldsymbol b=\boldsymbol 0$。
- 一般向量分解为 $\boldsymbol b=\boldsymbol p+\boldsymbol e$，其中 $\boldsymbol p=P\boldsymbol b$、$\boldsymbol e=(I-P)\boldsymbol b$；$I-P$ 是投影到左零空间上的投影矩阵，$P$ 与 $I-P$ 都关于转置对称且平方等于自身。
- 最小二乘问题：用 $y=C+Dt$ 拟合 $(1,1),(2,2),(3,2)$ 三点，得到三个方程 $C+D=1$、$C+2D=2$、$C+3D=2$，无解；$A$ 为 $3\times 2$，两列线性无关，$\boldsymbol b$ 不在列空间内。
- “最好”的判据是误差平方和 $E(C,D)=(C+D-1)^2+(C+2D-2)^2+(C+3D-2)^2=\|\boldsymbol b-A\boldsymbol x\|^2$ 最小；统计上称为线性回归，平方和对离群点敏感。
- **正规方程**（normal equations）为 $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$；本例 $A^{\mathsf T}A=\begin{bmatrix}3&6\\6&14\end{bmatrix}$，$A^{\mathsf T}\boldsymbol b=\begin{bmatrix}5\\11\end{bmatrix}$，解得 $C=\frac23$、$D=\frac12$，最佳直线 $y=\frac23+\frac12t$。
- 投影向量 $\boldsymbol p=(\frac76,\frac53,\frac{13}{6})$，误差向量 $\boldsymbol e=(-\frac16,\frac13,-\frac16)$，满足 $\boldsymbol p+\boldsymbol e=\boldsymbol b$；$\boldsymbol e$ 与两列都垂直，即 $A^{\mathsf T}\boldsymbol e=\boldsymbol 0$，这正是正规方程；最小误差平方和为 $\frac16$。
- 若 $A$ 的列线性无关，则 $A^{\mathsf T}A$ 可逆：由 $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$ 左乘 $\boldsymbol x^{\mathsf T}$ 得 $\|A\boldsymbol x\|^2=0$，故 $A\boldsymbol x=\boldsymbol 0$，再由列无关得 $\boldsymbol x=\boldsymbol 0$。
- 若 $A$ 的列是标准正交的，则 $A^{\mathsf T}A=I$，正规方程简化为 $\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$；单位矩阵与旋转矩阵 $\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}$ 都是例子。下一讲将学习怎样把一般基变成标准正交基。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| projection matrix | 投影矩阵 | 把向量映到子空间最近点的矩阵，$P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| least squares | 最小二乘 | 以误差平方和最小为准则的拟合方法 |
| normal equations | 正规方程 | $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$，最小二乘解满足的方程组 |
| error vector | 误差向量 | 观测值与拟合值之差，$\boldsymbol e=\boldsymbol b-A\hat{\boldsymbol x}$ |
| linear regression | 线性回归 | 用直线或线性模型拟合数据、使平方误差最小的统计方法 |
| outlier | 离群点 | 明显偏离其余数据的观测，平方误差会放大它的影响 |
| sum of squares | 平方和 | 各误差分量的平方之和，最小二乘要最小化的量 |
| column space | 列空间 | $A$ 的所有列向量张成的子空间 $C(A)$ |
| left nullspace | 左零空间 | 与列空间垂直的向量构成的子空间 $N(A^{\mathsf T})$ |
| orthonormal | 标准正交 | 两两垂直且长度为 $1$ 的向量组 |
| symmetric matrix | 对称矩阵 | 转置等于自身的矩阵，$A^{\mathsf T}A$ 总是对称的 |
| positive definite | 正定 | 课程后段将证明 $A^{\mathsf T}A$ 是正定的，这是这个关键矩阵的又一个好品质 |
| linearly independent columns | 列线性无关 | $A\boldsymbol x=\boldsymbol 0$ 只有零解，等价于 $A^{\mathsf T}A$ 可逆 |

---

[← Lecture 15](/notes/mit-1806/lec15) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 17 →](/notes/mit-1806/lec17)
