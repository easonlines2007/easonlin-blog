---
title: Lecture 22 · 对角化与矩阵的幂
description: 用对角化计算矩阵的幂，理解可对角化的条件。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 23
tags:
  - lineal algebra
status: completed
publish: true
---

> *Diagonalization and powers of A* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 22 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p22 · 对角化与矩阵的幂](https://www.bilibili.com/video/BV1ix411f7Yp?p=22)（51:51）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-22-diagonalization-and-powers-of-a/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=22&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲抵达的关键方程是 $A\boldsymbol{x}=\lambda\boldsymbol{x}$：$\boldsymbol{x}$ 是**特征向量**（eigenvector），$\lambda$ 是**特征值**（eigenvalue）。方程本身只是定义，它没有说清这两样东西有什么用。本讲回答的正是这个问题，答案是**对角化**（diagonalization）：把 $A$ 写成



$$
A=S\Lambda S^{-1},
$$



其中 $S$ 的列是 $n$ 个线性无关的特征向量，$\Lambda$ 是对角线上排着 $n$ 个特征值的对角矩阵。这个分解换了一个观察问题的坐标系。在特征向量张成的方向上，$A$ 的作用只是把每个方向分别伸长或压缩 $\lambda_i$ 倍，各个方向之间互不干扰；$S$ 负责在原坐标和这组特征方向之间来回翻译。

对角化最直接的用处是计算矩阵的幂。$A^2$ 的特征值是 $\lambda_i^2$、特征向量保持不变，于是 $A^k=S\Lambda^kS^{-1}$。算 $A$ 的一百次方不必做一百次矩阵乘法，只要把对角线上 $n$ 个数各取一百次方。这件事靠消元得到的 $LU$ 分解是完全办不到的：$A^{100}=(LU)^{100}$ 是一百个 $L,U$ 交替串起来的式子，中间没有任何可以消掉的东西。正因为幂变得便宜，特征值才成了判断矩阵长期行为的量——所有特征值的绝对值都小于 $1$，$A^k$ 就趋于零。

后半讲把这套工具用到**差分方程**（difference equation）$\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 上。给定初始向量 $\boldsymbol{u}_0$，形式解是 $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$；真正把它算出来的办法，是把 $\boldsymbol{u}_0$ 拆成特征向量的线性组合，让每一份按自己的 $\lambda_i^k$ 演化。斐波那契数列是这一思想的样板：一个二阶递推被改写成二维一阶系统之后，通项的增长速度立刻由最大的那个特征值给出。这也是本讲与上一讲的整体对照——$A\boldsymbol{x}=\boldsymbol{b}$ 是静态问题，而这里处理的是随时间一步步演化的动态问题。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-8f18ab4fa742cddd0c3fe992.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 22 Summary，CC BY-NC-SA 4.0）。*

## 1. 对角化：$A=S\Lambda S^{-1}$

设 $A$ 是 $n\times n$ 矩阵，并且它有 $n$ 个线性无关的特征向量 $\boldsymbol{x}_1,\boldsymbol{x}_2,\dots,\boldsymbol{x}_n$，分别对应特征值 $\lambda_1,\lambda_2,\dots,\lambda_n$。把这 $n$ 个向量按列排成一个矩阵



$$
S=\begin{bmatrix}\boldsymbol{x}_1&\boldsymbol{x}_2&\cdots&\boldsymbol{x}_n\end{bmatrix},
$$



称为**特征向量矩阵**（eigenvector matrix）；再把特征值按对角线排成



$$
\Lambda=\begin{bmatrix}
\lambda_1&0&\cdots&0\\
0&\lambda_2&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lambda_n
\end{bmatrix}.
$$



用大写 $\Lambda$ 而不是 $\lambda$，是提醒这里装的是矩阵，对角线上装的正是特征值。

整个推导只需要做一件事：用 $A$ 去乘 $S$。矩阵乘法可以一列一列地看，而 $S$ 的第 $i$ 列恰好是特征向量，所以



$$
AS=A\begin{bmatrix}\boldsymbol{x}_1&\cdots&\boldsymbol{x}_n\end{bmatrix}
=\begin{bmatrix}A\boldsymbol{x}_1&\cdots&A\boldsymbol{x}_n\end{bmatrix}
=\begin{bmatrix}\lambda_1\boldsymbol{x}_1&\cdots&\lambda_n\boldsymbol{x}_n\end{bmatrix}.
$$



第二步只是把特征向量的定义代进去。接下来要把数 $\lambda_i$ 从第 $i$ 列里“剥”出来。剥出来的办法是利用右乘：用一个对角矩阵右乘 $S$，$S$ 的第 $i$ 列就整体乘上该对角矩阵的第 $i$ 个对角元。以两列为例写出来就是



$$
\begin{bmatrix}\boldsymbol{x}_1&\boldsymbol{x}_2\end{bmatrix}
\begin{bmatrix}\lambda_1&0\\0&\lambda_2\end{bmatrix}
=\begin{bmatrix}\lambda_1\boldsymbol{x}_1&\lambda_2\boldsymbol{x}_2\end{bmatrix},
$$



一般情形同理。于是得到本讲的基本公式



$$
AS=S\Lambda .
$$



注意 $\lambda_i$ 是从右边乘进来的，所以它落在 $S$ 的右侧，成了 $\Lambda$。这个位置不能记错，记法是：$A$ 乘的是自己的特征向量，$A$ 永远贴在 $S$ 的左边。

既然 $S$ 可逆——这正是“$n$ 个特征向量线性无关”这个假设的全部用处——就在 $AS=S\Lambda$ 两边左乘 $S^{-1}$，得到



$$
S^{-1}AS=\Lambda ,
$$



或者反过来写成 $A$ 的分解



$$
A=S\Lambda S^{-1}.
$$



两个式子说的是同一件事，只是 $S$ 和 $S^{-1}$ 站在等号哪一边不同。第一个式子读作“换一组基之后，$A$ 变成了对角矩阵”；第二个式子读作“$A$ 由三块构成”。后者是它与 $A=LU$、$A=QR$ 并列的身份：那两种分解来自消元和 Gram-Schmidt，是下三角乘上三角、正交乘上三角，而这里是一个矩阵乘上对角矩阵再乘上它自己的逆。这种“夹在中间的 $S$ 与 $S^{-1}$”的形状，后面处理微分方程时还会反复出现。

必须强调这个分解不是无条件成立的。$S$ 的列线性无关，等价于这 $n$ 个特征向量彼此独立，等价于 $S$ 可逆，也就等价于能写出 $S^{-1}$。一旦凑不出 $n$ 个独立的特征向量，对角化就无从谈起。这样的矩阵是少数，但确实存在，第 3 节要把它们挑出来。

![视频 00:05:11：课堂板书](</attachments/mit1806-e6b29d918581931477d15706.jpg>)

*视频 00:05:11｜约对应第 1 节「1. 对角化：$A=S\Lambda S^{-1}$」附近。*

## 2. 矩阵的幂：特征值直接给出答案

对角化立刻能回答一个很自然的问题：$A^2$ 的特征值和特征向量是什么？答案干净得不需要额外计算。

从 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 出发，两边同乘 $A$：



$$
A^2\boldsymbol{x}=A(\lambda\boldsymbol{x})=\lambda A\boldsymbol{x}=\lambda\cdot\lambda\boldsymbol{x}=\lambda^2\boldsymbol{x}.
$$



第二个等号把数 $\lambda$ 提到前面，第三个等号再次使用定义。结论是：$A^2$ 的特征值是 $\lambda^2$，特征向量仍是原来那个 $\boldsymbol{x}$。所以矩阵一平方，特征值跟着平方，特征向量原地不动。

用对角化再看一遍会更有意思。把 $A=S\Lambda S^{-1}$ 代进 $A^2$：



$$
A^2=\bigl(S\Lambda S^{-1}\bigr)\bigl(S\Lambda S^{-1}\bigr)
=S\Lambda\bigl(S^{-1}S\bigr)\Lambda S^{-1}
=S\Lambda^2S^{-1}.
$$



中间那对 $S^{-1}S$ 是单位矩阵，等于什么也没做。而 $\Lambda^2$ 仍然是对角矩阵，对角线上是 $\lambda_1^2,\lambda_2^2,\dots,\lambda_n^2$。这和上面逐个向量算出来的结论完全一致：夹在两边的 $S,S^{-1}$ 没变，所以特征向量没变；中间变成了 $\Lambda^2$，所以特征值平方。

同样的推理可以一路推到任意次幂。把 $k$ 个 $A=S\Lambda S^{-1}$ 连乘，内部相邻的 $S^{-1}S$ 两两抵消，只剩最左边的 $S$、最右边的 $S^{-1}$，以及中间 $k$ 个 $\Lambda$：



$$
A^k=S\Lambda^kS^{-1},\qquad
\Lambda^k=\begin{bmatrix}
\lambda_1^k&0&\cdots&0\\
0&\lambda_2^k&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lambda_n^k
\end{bmatrix}.
$$



这就是计算矩阵高次幂的捷径：$A^k$ 的特征值是 $\lambda_i^k$，特征向量不变。取 $A$ 的三次方，特征值就是原来特征值的三次方；取一百次方，就是一百次方。而 $\Lambda^k$ 只是 $n$ 个独立的标量幂，逐个算即可。

这个捷径的分量，与消元路线的无能对比一下就清楚了。若只有 $A=LU$，那么



$$
A^{100}=\underbrace{(LU)(LU)\cdots(LU)}_{100\ \text{个}},
$$



一百个 $L$ 和一百个 $U$ 首尾相接，没有任何可消的中间项，也看不出什么规律。**主元里根本不带“幂”的信息，特征值里带。** 特征值给出了一个此前无法接近的角度：看清一个矩阵反复作用一百次之后会变成什么样。

由此可以得到一条关于稳定性的定理。称矩阵 $A$ 是**稳定**（stable）的，如果 $k\to\infty$ 时 $A^k\to 0$。

> **定理.** 在 $A$ 可对角化的前提下，$A^k\to 0$ 当且仅当 $A$ 的所有特征值都满足 $|\lambda_i|<1$。

证明的思路就是把 $A^k=S\Lambda^kS^{-1}$ 拆开看：$S$ 与 $S^{-1}$ 是固定的矩阵，不随 $k$ 变化，能让整个乘积变小乃至消失的只有中间的 $\Lambda^k$。而 $\Lambda^k$ 是对角矩阵，它趋于零当且仅当对角线上每个 $\lambda_i^k$ 都趋于零，也就是每个 $|\lambda_i|<1$。反方向也成立：若 $A^k\to 0$，则对每个特征向量 $A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i\to 0$，故 $\lambda_i^k\to 0$。

绝对值不能省。特征值可以是负数，甚至可以是复数（实矩阵的特征值也可能是复数，只要矩阵不对称）；$|\lambda_i|$ 对实数就是通常的绝对值，对复数则是模长。若某个 $\lambda_i=1$，则 $\lambda_i^k$ 恒等于 $1$，幂不会变小；若 $\lambda_i=-1$，则 $\lambda_i^k$ 在 $1$ 与 $-1$ 之间来回摆动，虽然不发散，却也不趋于零。只有严格落在单位圆内，幂才真正衰减掉。还要记住的是定理开头的限定：整个论证建立在 $S$ 存在的基础上，没有 $n$ 个独立特征向量，这条“特征值决定幂”的路线就走不通。

![视频 00:13:20：课堂板书](</attachments/mit1806-de7b4aaadaee3d984aa0bf9e.jpg>)

*视频 00:13:20｜约对应第 2 节「2. 矩阵的幂：特征值直接给出答案」附近。*

![视频 00:19:42：课堂板书](</attachments/mit1806-d03c9a6698d03ec8fc38865d.jpg>)

*视频 00:19:42｜约对应第 2 节「2. 矩阵的幂：特征值直接给出答案」附近。*

## 3. 什么样的矩阵可以对角化

既然对角化这么好用，就要弄清哪些矩阵可以使用它。分两种情形。

**情形一：$n$ 个特征值互不相同。** 这时 $A$ 一定有 $n$ 个线性无关的特征向量，因而一定可以对角化。这是最好用的判据：只要算出**特征多项式**（characteristic polynomial）后发现它的 $n$ 个根各不相同，就不必再检查特征向量了，独立的性质是自动的。随机矩阵几乎总是落在这一情形里：在 Matlab 里对一个 $10\times 10$ 的随机矩阵执行 `eig(rand(10))`，返回的十个特征值通常互不相同。所谓“互不相同”（distinct）是指两两不等；十个特征值都不同，十个特征向量就自动独立。

**情形二：有特征值重复。** 这时结论不再自动成立——可能仍能对角化，也可能不能，必须逐个检查。所以重复特征值本身不是灾难，它只是不便。

先看一个仍然成功的例子：$10\times 10$ 的**单位矩阵**（identity matrix）$I$。它的特征多项式是 $(1-\lambda)^{10}$，特征值 $1$ 重复了十次。但单位矩阵绝不缺特征向量——每个向量都满足 $I\boldsymbol{x}=1\cdot\boldsymbol{x}$，任取十个线性无关的向量都能充当 $S$。而且 $S^{-1}IS=I$，对角化之后的 $\Lambda$ 就是 $I$ 自己，这本来就对：单位矩阵已经是**对角矩阵**（diagonal matrix），对角矩阵的特征值就摆在对角线上，不需要再变换。

再看一个失败的例子：



$$
A=\begin{bmatrix}2&1\\0&2\end{bmatrix}.
$$



它是一个**上三角矩阵**（upper triangular matrix），**行列式**（determinant）很好算：



$$
\det(A-\lambda I)=\begin{vmatrix}2-\lambda&1\\0&2-\lambda\end{vmatrix}=(2-\lambda)^2 .
$$



令行列式等于 $0$，解出 $\lambda=2$，而且是二重根。所以两个特征值都是 $2$。

下一步找特征向量，即求 $A-2I$ 的**零空间**（nullspace）：



$$
A-2I=\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



方程 $(A-2I)\boldsymbol{x}=\boldsymbol{0}$ 只要求第二个分量等于 $0$，第一个分量完全自由，因此零空间是 $\begin{bmatrix}1\\0\end{bmatrix}$ 张成的一条直线，维数只有 $1$。$\begin{bmatrix}0\\1\end{bmatrix}$ 不在其中：它被乘之后得到 $\begin{bmatrix}1\\0\end{bmatrix}$，不是零向量。这个矩阵只有这一个特征向量方向，凑不出两个独立的列来组成 $S$，所以 $A$ **不能**对角化：无论怎样选择 $S$，$S^{-1}AS$ 都不会是对角矩阵，那个写法根本不存在。

这里出现了两个不同的计数方式，值得给它们命名。$\lambda=2$ 作为特征多项式的根出现了两次，这个次数称为**代数重数**（algebraic multiplicity）；而 $A-2I$ 的零空间的维数，即真正独立的特征向量个数，称为**几何重数**（geometric multiplicity）。在上面的三角例子中，前者是 $2$，后者是 $1$；在 $10\times 10$ 单位矩阵的例子中，两者都是 $10$。对角化到底做不做得到，不看 $\lambda$ 重复了几次，而要看把所有特征值的零空间维数加起来够不够 $n$。

这个例子还有一层含义：第 2 节那条“$|\lambda_i|<1$ 则幂趋于零”的定理，以及整个 $S\Lambda^kS^{-1}$ 的计算，都不覆盖这种不可对角化的矩阵。不过这样的矩阵是少数，绝大多数矩阵——尤其是特征值互不相同的矩阵——都可以对角化，这就是本讲讨论的范畴。

![视频 00:25:22：课堂板书](</attachments/mit1806-e7cd9ed1d7ce098c7842ba84.jpg>)

*视频 00:25:22｜约对应第 3 节「3. 什么样的矩阵可以对角化」附近。*

![官方讲义摘要 第 2/3 页](</attachments/mit1806-b0bbafd51b25472594d68502.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 22 Summary，CC BY-NC-SA 4.0）。*

## 4. 差分方程：$\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$

现在把对角化用到具体的问题上。给定初始向量 $\boldsymbol{u}_0$，并规定每一步都用同一个矩阵去乘上一步的结果：



$$
\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k,\qquad k=0,1,2,\dots
$$



这叫**一阶**（first-order）差分方程：每一步只用到上一步；叫方程组是因为未知量是向量、系数是矩阵。把递推展开，$\boldsymbol{u}_1=A\boldsymbol{u}_0$，$\boldsymbol{u}_2=A\boldsymbol{u}_1=A^2\boldsymbol{u}_0$，一般地



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0 .
$$



这是最紧凑的答案，但它并没有把 $\boldsymbol{u}_k$ 算出来。要真正知道一百步之后是什么，得借助特征向量。下一讲要解的是微分方程组，那里出现的是导数；本讲处理的是差分，可以看成那套理论在离散时间上的对应物，而它恰好有一个干净得多的解。

做法是把初始向量写成特征向量的线性组合。设



$$
\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+\cdots+c_n\boldsymbol{x}_n=S\boldsymbol{c},
$$



其中 $\boldsymbol{c}=(c_1,\dots,c_n)$ 是各方向上的分量系数。特征向量可以取成单位向量，这不影响结论。系数怎么求？$S$ 的列是一组基，$\boldsymbol{c}=S^{-1}\boldsymbol{u}_0$。

现在用 $A$ 去乘 $\boldsymbol{u}_0$。因为乘法可以分到每一项上：



$$
A\boldsymbol{u}_0=c_1A\boldsymbol{x}_1+\cdots+c_nA\boldsymbol{x}_n
=c_1\lambda_1\boldsymbol{x}_1+\cdots+c_n\lambda_n\boldsymbol{x}_n .
$$



每一项都是某个特征向量的纯倍数，$A$ 作用上去只是乘了一个数 $\lambda_i$，方向不变。这就是“各自演化”的意思：分解出的每一份都待在一个方向里，而 $A$ 在那个方向上只做拉伸。乘第二次就再乘一次 $\lambda_i$，乘到第 $k$ 次：



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0
=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+\cdots+c_n\lambda_n^k\boldsymbol{x}_n
=S\Lambda^k\boldsymbol{c}.
$$



最后这个表达式与 $A^k\boldsymbol{u}_0=S\Lambda^kS^{-1}\boldsymbol{u}_0$ 是同一个式子，只不过 $\boldsymbol{c}=S^{-1}\boldsymbol{u}_0$ 被写了出来。所以实际计算分三步：先求 $A$ 的全部特征值与特征向量；再把 $\boldsymbol{u}_0$ 表示成它们的组合，得到 $\boldsymbol{c}$；最后给每一份乘上相应特征值的 $k$ 次幂。

这套分解也解释了为什么特征值能预报解的命运。$\boldsymbol{u}_k$ 的每一项都带着 $\lambda_i^k$：$|\lambda_i|<1$ 的项越走越小，$|\lambda_i|>1$ 的项越走越大，$|\lambda_i|=1$ 的项保持原有大小。哪个特征值占主导，解最终就由那一个方向决定。第 2 节那条稳定性定理，在这里变成了对解的定性预报；至于精确的数值，要靠 $\boldsymbol{c}$ 提供每一份的权重。

![视频 00:33:42：课堂板书](</attachments/mit1806-245415a395c3a455d781f1dd.jpg>)

*视频 00:33:42｜约对应第 4 节「4. 差分方程：$\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$」附近。*

## 5. 斐波那契数列：特征值的一个样板

斐波那契数列是检验这套办法的最好题目。取 $F_0=0$、$F_1=1$，之后每一项都是前两项之和：



$$
F_{k+2}=F_{k+1}+F_k .
$$



头几项是 $0,1,1,2,3,5,8,13,21,34,\dots$，增长速度比看上去快，但“多快”不是一个显然的问题。问 $F_{100}$ 是多少，或者问这些数大致按什么倍数增长，答案都藏在特征值里。这个数列显然在增长，不是稳定的情形；但增长的速度由最大的特征值决定。

障碍在于递推是二阶的——它同时涉及 $F_{k+1}$ 与 $F_k$，而差分方程的标准形式 $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 是一阶的。转化只需一个小技巧：把相邻两项合成一个向量，再补上一条恒等式 $F_{k+1}=F_{k+1}$。令



$$
\boldsymbol{u}_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix},
$$



则由 $F_{k+2}=F_{k+1}+F_k$ 与 $F_{k+1}=F_{k+1}$ 得到



$$
\boldsymbol{u}_{k+1}=\begin{bmatrix}F_{k+2}\\F_{k+1}\end{bmatrix}
=\begin{bmatrix}1&1\\1&0\end{bmatrix}\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix}
=A\boldsymbol{u}_k .
$$



第二个分量确实还原为 $F_{k+1}$，第一个分量恰好是 $F_{k+1}+F_k=F_{k+2}$，所以这个矩阵是对的。一个二阶标量递推就这样变成了二维一阶系统，接下来照第 4 节的流程走。

注意这个 $A$ 是**对称矩阵**（symmetric matrix）。对称矩阵的特征值一定是实数，这里不会出现复数；它的特征向量还会彼此正交。这两条性质要到课程后面才证明，但在 $2\times2$ 的场合，先算出具体的数更有意义。

先算特征值。对 $2\times2$ 矩阵，两个特征值之和等于**迹**（trace，对角元之和），之积等于行列式，这两个量不必解特征方程就能读出。这里迹是 $1$，行列式是 $0-1=-1$，于是两个特征值满足



$$
\lambda_1+\lambda_2=1,\qquad \lambda_1\lambda_2=-1 .
$$



把它们算出来核对：



$$
\det(A-\lambda I)=\begin{vmatrix}1-\lambda&1\\1&-\lambda\end{vmatrix}
=(1-\lambda)(-\lambda)-1=\lambda^2-\lambda-1 .
$$



令它为零，用求根公式得



$$
\lambda=\frac{1\pm\sqrt{1+4}}{2}=\frac{1\pm\sqrt{5}}{2},
$$



即 $\lambda_1=\dfrac{1+\sqrt5}{2}\approx 1.618$，$\lambda_2=\dfrac{1-\sqrt5}{2}\approx -0.618$。两者相加为 $1$、相乘为 $-1$，与迹和行列式的预测一致。

这里有一个值得注意的巧合：特征方程 $\lambda^2-\lambda-1=0$ 和原来的递推 $F_{k+2}-F_{k+1}-F_k=0$ 形状完全相同。把 $F_k$ 换成“每步乘一个固定倍数”的设想 $\lambda^k$，递推就变成 $\lambda^{k}(\lambda^2-\lambda-1)=0$，正好给出同一个方程。一个特征值大于 $1$、一个特征值的绝对值小于 $1$，加上两个特征值互不相同，所以这个矩阵必然可以对角化。

再算特征向量。$A-\lambda I$ 形如



$$
\begin{bmatrix}1-\lambda&1\\1&-\lambda\end{bmatrix},
$$



当 $\lambda$ 满足 $\lambda^2=\lambda+1$ 时，取 $\begin{bmatrix}\lambda\\1\end{bmatrix}$ 试一下：第二个分量是 $\lambda-\lambda=0$；第一个分量是 $(1-\lambda)\lambda+1=\lambda-\lambda^2+1=0$。两个分量都归零，所以



$$
\boldsymbol{x}_1=\begin{bmatrix}\lambda_1\\1\end{bmatrix},\qquad
\boldsymbol{x}_2=\begin{bmatrix}\lambda_2\\1\end{bmatrix}.
$$



最后处理初始条件。$\boldsymbol{u}_0=\begin{bmatrix}F_1\\F_0\end{bmatrix}=\begin{bmatrix}1\\0\end{bmatrix}$，要求出 $\boldsymbol{c}$，解



$$
c_1\begin{bmatrix}\lambda_1\\1\end{bmatrix}+c_2\begin{bmatrix}\lambda_2\\1\end{bmatrix}
=\begin{bmatrix}1\\0\end{bmatrix}.
$$



比较第二个分量得 $c_1+c_2=0$，即 $c_2=-c_1$。代入第一个分量：$c_1(\lambda_1-\lambda_2)=1$，而 $\lambda_1-\lambda_2=\sqrt5$，所以



$$
c_1=\frac{1}{\sqrt5},\qquad c_2=-\frac{1}{\sqrt5}.
$$



把两份各自乘上 $\lambda^k$ 再相加，取结果的第二个分量（那正是 $F_k$）：



$$
F_k=\frac{1}{\sqrt5}\left[\left(\frac{1+\sqrt5}{2}\right)^{k}-\left(\frac{1-\sqrt5}{2}\right)^{k}\right].
$$



拿头几项验证：$k=1$ 时 $(1.618+0.618)/2.236=1$；$k=2$ 时 $(2.618-0.382)/2.236=1$；$k=3$ 时 $(4.236+0.236)/2.236=2$，与数列 $0,1,1,2$ 吻合。

这个公式把增长的全部机制摊开了。$|\lambda_1|>1$，所以第一项随 $k$ 指数增长；$|\lambda_2|\approx0.618<1$，所以第二项迅速衰减，$0.618^{100}$ 已经是 $10^{-21}$ 量级，几乎等于零。因此



$$
F_k\approx\frac{1}{\sqrt5}\left(\frac{1+\sqrt5}{2}\right)^{k},
$$



取 $k=100$ 得 $F_{100}\approx 3.5\times10^{20}$。相邻两项的比值 $F_{k+1}/F_k$ 也趋于 $\lambda_1\approx1.618$，这正是“这些数每步大约乘 $1.618$”的确切含义。这类关于增长的信息不在主元里，也不在矩阵的元素里，它只属于特征值。

![视频 00:41:55：课堂板书](</attachments/mit1806-12be0c12560b125245b96c8b.jpg>)

*视频 00:41:55｜约对应第 5 节「5. 斐波那契数列：特征值的一个样板」附近。*

![视频 00:46:39：课堂板书](</attachments/mit1806-076a045cb4fb6fc6c40ce310.jpg>)

*视频 00:46:39｜约对应第 5 节「5. 斐波那契数列：特征值的一个样板」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-2dc1596dec7202d54b94f17c.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 22 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **对角化**（diagonalization）：若 $A$ 有 $n$ 个线性无关的特征向量，把它们按列排成 $S$，特征值按对角线排成 $\Lambda$，则 $AS=S\Lambda$，左乘 $S^{-1}$ 得 $S^{-1}AS=\Lambda$ 与 $A=S\Lambda S^{-1}$。推导的实质是一次列运算：$A$ 乘到 $S$ 的每一列得到 $\lambda_i\boldsymbol{x}_i$，再用右乘对角矩阵把这些数剥成 $\Lambda$。
- 对角化要求 $S$ 可逆，即 $n$ 个特征向量线性无关。这是整个方法的前提，后面的幂公式与稳定性定理都建立在此之上。
- $A^2$ 的特征值是 $\lambda_i^2$，特征向量不变；由 $S\Lambda S^{-1}\cdot S\Lambda S^{-1}=S\Lambda^2S^{-1}$ 可见内部的 $S^{-1}S$ 抵消，故一般地 $A^k=S\Lambda^kS^{-1}$，特征值是 $\lambda_i^k$。
- 主元与 $LU$ 分解不含幂的信息：$(LU)^{100}$ 是一百个 $L,U$ 的串接；特征值才给出 $A$ 反复作用后的行为。
- **稳定性定理**：$A$ 可对角化时，$A^k\to0$ 当且仅当所有特征值满足 $|\lambda_i|<1$；必须取绝对值，因为特征值可为负或为复数。$\lambda=1$ 的幂恒为 $1$，$\lambda=-1$ 的幂在 $\pm1$ 间摆动，都不趋于零。
- 特征值互不相同的矩阵一定可以对角化（随机 $10\times10$ 矩阵的十个特征值通常互不相同）；有重复特征值时必须检查。
- $10\times 10$ 单位矩阵的特征值 $1$ 重复十次，但每个向量都是特征向量，可取十个独立的向量，$S^{-1}IS=I$，本来就是对角矩阵。
- $A=\begin{bmatrix}2&1\\0&2\end{bmatrix}$ 的特征值 $2$ 是二重根，而 $A-2I$ 的零空间只有一维，仅由 $\begin{bmatrix}1\\0\end{bmatrix}$ 张成，凑不出两个独立特征向量，故不可对角化。这里对比了两个计数：**代数重数**（$2$）与**几何重数**（$1$）。
- **差分方程** $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 的解是 $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$；实际算法是把 $\boldsymbol{u}_0=S\boldsymbol{c}$ 分解到特征方向上，再逐项乘 $\lambda_i^k$，得 $\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+\cdots+c_n\lambda_n^k\boldsymbol{x}_n$。
- 斐波那契：令 $\boldsymbol{u}_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix}$，得 $A=\begin{bmatrix}1&1\\1&0\end{bmatrix}$，特征值 $\lambda_{1,2}=\frac{1\pm\sqrt5}{2}$，迹为 $1$、行列式为 $-1$，特征向量为 $\begin{bmatrix}\lambda_i\\1\end{bmatrix}$，$F_k\approx\frac{1}{\sqrt5}\lambda_1^k$，$\lambda_1\approx1.618$ 决定了增长速度，$F_{100}\approx3.5\times10^{20}$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| diagonalization | 对角化 | 把 $A$ 写成 $S\Lambda S^{-1}$，用特征向量矩阵把 $A$ 化成对角矩阵 |
| eigenvector matrix | 特征向量矩阵 | 以 $n$ 个线性无关特征向量为列的矩阵 $S$ |
| eigenvalue matrix | 特征值矩阵 | 以特征值为对角元的对角矩阵 $\Lambda$ |
| powers of a matrix | 矩阵的幂 | $A^k=S\Lambda^kS^{-1}$，特征值取 $k$ 次幂而特征向量不变 |
| stable matrix | 稳定矩阵 | 满足 $A^k\to0$ 的矩阵，条件是所有 $\lvert\lambda_i\rvert<1$ |
| distinct eigenvalues | 互不相同的特征值 | 特征多项式无重根，此时 $n$ 个特征向量自动线性无关 |
| repeated eigenvalue | 重复特征值 | 特征多项式的重根，此时可能凑不出 $n$ 个独立特征向量 |
| algebraic multiplicity | 代数重数 | 特征值作为特征多项式根的重数 |
| geometric multiplicity | 几何重数 | $A-\lambda I$ 的零空间的维数，即该特征值下独立特征向量的个数 |
| difference equation | 差分方程 | 形如 $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 的递推系统，解为 $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$ |
| first-order system | 一阶系统 | 每一步只依赖上一步的向量递推，可用一个矩阵描述 |
| recurrence | 递推 | 用前几项确定后一项的规则，斐波那契是二阶标量递推 |
| eigenvector expansion | 特征向量展开 | 把初始向量写成 $c_1\boldsymbol{x}_1+\cdots+c_n\boldsymbol{x}_n$，用于求解差分方程 |

---

[← Lecture 21](/notes/mit-1806/lec21) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 23 →](/notes/mit-1806/lec23)
