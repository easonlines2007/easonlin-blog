---
title: Lecture 13 · 第一次测验复习
description: 复习第一部分：消元、四个子空间与秩的主线。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 14
tags:
  - lineal algebra
status: completed
publish: true
---

> *Quiz 1 review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 13 讲 / 共 35 讲** ｜ 第二部分 · 正交性与行列式

**本讲视频**：[Bilibili p13 · 第一次测验复习](https://www.bilibili.com/video/BV1ix411f7Yp?p=13)（47:40）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-13-quiz-1-review/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=13&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

这一讲复习第一部分，也就是 $A\boldsymbol{x}=\boldsymbol{b}$ 这条主线：消元（elimination）、秩（rank）、向量空间（vector space）与子空间（subspace），以及由 $A$ 生成的四个基本子空间（four fundamental subspaces）。复习的重心在长方矩阵。方阵可逆时很多事不必细想——齐次方程只有零解，对每个右端都有唯一解；矩阵一旦变成长方形，这些结论就不再自动成立，哪些还成立、哪些不成立，正是测验要问的。

复习的方式是拿旧考题开刀，而不是重念定义。题面往往只给出部分信息：一个通解（general solution）、一个分块矩阵的形状、一句关于子空间的话，要求你把定义翻过来用，推出矩阵本身或某个空间的维数（dimension）。这类题看起来五花八门，答案却都落在同一张表上：只要拿到 $m$、$n$、$r$ 三个数，四个基本子空间的维数就全部确定。

本讲把考点归成五类：维数记账、由通解反推矩阵、四个基本子空间的真假判断、带可逆因子的乘积矩阵，以及行空间（row space）与零空间（nullspace）为何只在零向量处相交。最后一问已经指向下一讲的正交（orthogonal）性。

![官方讲义摘要 第 1/5 页](</attachments/mit1806-3bb50ff53cc5418135f02aa2.png>)

*MIT OCW 官方讲义摘要 第 1/5 页（18.06SC Lecture 13 Summary，CC BY-NC-SA 4.0）。*

## 1. 考点一：用 $m,n,r$ 一次数清四个维数

设 $A$ 是 $m\times n$ 矩阵，秩为 $r$。四个基本子空间分别住在哪个空间、维数是多少，完全由这三个数决定：

| 子空间 | 所在空间 | 维数 |
| --- | --- | --- |
| 列空间（column space）$C(A)$ | $\mathbb{R}^m$ | $r$ |
| 零空间（nullspace）$N(A)$ | $\mathbb{R}^n$ | $n-r$ |
| 行空间（row space）$C(A^{\mathsf T})$ | $\mathbb{R}^n$ | $r$ |
| 左零空间（left nullspace）$N(A^{\mathsf T})$ | $\mathbb{R}^m$ | $m-r$ |

做维数题的第一步永远是找 $m$ 和 $n$：看矩阵有几行几列。第二步数主元（pivot）得 $r$。这两步的次序不能反，因为该用哪一个数去减 $r$，取决于这个零空间里的向量是几维的。整套流程可以固定成四步：读形状、定 $m,n$、数主元得 $r$、照表查出四个维数；中间任何一步省略，答案都可能整体错位。

**例 1.** $u,v,w$ 是 $\mathbb{R}^7$ 中三个非零向量，它们张成（span）的子空间可能有几维？

答案是 1、2、3。不会超过 3，张成由三个向量生成，最多三个独立方向；不可能是 0，因为每个向量都非零，张成里至少含一个非零向量。假如允许三个向量都取零向量，那么维数为 0 的子空间 $\{\boldsymbol{0}\}$ 也要算进来——"非零"这个条件在题里就是起这个作用。

**例 2.** $U$ 是 $5\times 3$ 的阶梯形矩阵，有三个主元，$r=3$。$N(U)$ 是什么？

只有零向量。理由要用维数说，而不是"因为它是阶梯形"：$n=3$、$r=3$，所以 $\dim N(U)=3-3=0$。三列全是主元列，没有自由变量（free variable），$U\boldsymbol{x}=\boldsymbol{0}$ 只有零解。

**例 3.** 把两个 $U$ 叠起来得 $B=\begin{bmatrix}U\\2U\end{bmatrix}$，它是 $10\times 3$。$B$ 的秩、最简形、零空间各是什么？

块消元就能看清：下半减去上半的两倍，$B$ 化成 $\begin{bmatrix}U\\0\end{bmatrix}$，秩仍是 3，零空间仍是 $\{\boldsymbol{0}\}$——把同一行重复一遍不会带来新方向。若要把它做到底、化成行最简形（row reduced echelon form），只需把各主元归一化成 1，并把主元上方的元素清成零；零行本来就在底部。

**例 4.** 由四个块拼成 $C=\begin{bmatrix}U&U\\U&0\end{bmatrix}$，它是 $10\times 6$。$C$ 的秩是多少？$N(C^{\mathsf T})$ 的维数是多少？

仍然做块消元。把下半五行减去上半五行，得 $\begin{bmatrix}U&U\\0&-U\end{bmatrix}$；再把上半的第二块用下半消掉，即上半加上下半，得



$$
\begin{bmatrix}U&0\\0&-U\end{bmatrix}.
$$



两个 $U$ 各自带三个主元，互不干扰，所以 $r=6$。

注意这里与例 3 的差别：$U$ 自身的两个零行在拼接后落到了矩阵中部，化成行最简形时要把它们沉到底部，再做主元归一化。

于是



$$
\dim N(C^{\mathsf T})=m-r=10-6=4 .
$$



这里最容易错的是最后一步拿哪个数去减：$C^{\mathsf T}$ 是 $6\times 10$，它的零空间里的向量属于 $\mathbb{R}^{10}$，所以要拿 $m=10$ 去减；若顺手用列数 $6$ 去减，会得到 0 这个错答案。同一题里也要分清两个零空间：$C$ 的列数是 6、秩也是 6，所以 $N(C)$ 只剩零向量，而 $N(C^{\mathsf T})$ 是四维的，两者不是一回事。

![视频 00:11:37：课堂板书](</attachments/mit1806-06f74ac37c628424bf086ae1.jpg>)

*视频 00:11:37｜约对应第 1 节「1. 考点一：用 $m,n,r$ 一次数清四个维数」附近。*

![官方讲义摘要 第 2/5 页](</attachments/mit1806-2a5a0133b36dcc6d9cc7f1e2.png>)

*MIT OCW 官方讲义摘要 第 2/5 页（18.06SC Lecture 13 Summary，CC BY-NC-SA 4.0）。*

## 2. 考点二：从一个通解反推矩阵

第二类题倒着问：不给矩阵，只给一个方程和它的通解（general solution），要你把矩阵找回来。

设 $A\boldsymbol{x}=\boldsymbol{b}$ 的右端是 $\boldsymbol{b}=(2,4,2)$，通解为



$$
\boldsymbol{x}=\begin{bmatrix}2\\0\\0\end{bmatrix}
+c_1\begin{bmatrix}1\\1\\0\end{bmatrix}
+c_2\begin{bmatrix}0\\0\\1\end{bmatrix}.
$$



求 $A$ 的行空间维数与 $A$ 本身。办法是把通解的每一块翻译成 $A$ 的一条信息。

第一步，特解（particular solution）定出一列。令 $c_1=c_2=0$，特解是 $\boldsymbol{x}_p=(2,0,0)$。乘以 $A$ 时只有第一个分量起作用，所以 $A\boldsymbol{x}_p$ 等于第一列的两倍；它应当等于 $\boldsymbol{b}=(2,4,2)$，两边除以 2，第一列就是 $(1,2,1)$。

第二步，数自由变量得秩。通解里有两个任意常数，说明 $\dim N(A)=2$；$\boldsymbol{x}$ 是三维的，故 $n=3$，于是



$$
r=n-\dim N(A)=3-2=1 .
$$



行空间的维数等于秩，答案就是 1。

第三步，把零空间的基（basis）向量逐条翻译成列与列的关系。$(0,0,1)$ 在零空间里，说明 $A\boldsymbol{x}=\boldsymbol{0}$ 允许第三列乘以系数 1 后抵消，即第三列是零向量。$(1,1,0)$ 在零空间里，说明第一列加第二列为零，第二列等于 $-(1,2,1)$。于是



$$
A=\begin{bmatrix}
1&-1&0\\
2&-2&0\\
1&-1&0
\end{bmatrix}.
$$



检验：第一、三两行相同，第二行是第一行的两倍，秩确实是 1；列空间是 $(1,2,1)$ 的全体倍数。再问"对哪些 $\boldsymbol{b}$ 方程可解"，答案就是全部 $(1,2,1)$ 的倍数。题目给的 $(2,4,2)=2(1,2,1)$ 正好合格；由于 $r=1<m=3$，列空间只是 $\mathbb{R}^3$ 里的一条直线，绝大多数 $\boldsymbol{b}$ 都不在列空间里。

这类题的做法可以背成三句话：特解定列，自由变量定秩，零空间的基向量定列关系。反过来，若给你矩阵求通解，就是消元、找主元列、把自由变量轮流取 1、写出特解再加零空间。

易错点是把零空间向量读成行关系。$(0,0,1)$ 说的是"第三列全零"，不是"第三行全零"；$(1,1,0)$ 说的是列与列相加为零。零空间向量是 $A$ 各列的系数，它对应的对象永远是列。

![视频 00:18:07：课堂板书](</attachments/mit1806-7b1965a0af2b8917af8b4d22.jpg>)

*视频 00:18:07｜约对应第 2 节「2. 考点二：从一个通解反推矩阵」附近。*

## 3. 考点三：四个基本子空间的快速判断

复习课的很大一部分是这种一句话判断题，答得快，也最考验对定义的熟悉程度。下面这些都是本讲复习过的命题。

做真假题有个省时的次序：想断言"假"，只需举出一个反例；想断言"真"，则必须给出对所有矩阵都成立的理由，举几个例子不算证明。卡住的时候先拿极端情形试——把矩阵取成可逆的、取成零矩阵、或者取成秩 1 的矩阵，往往一眼就能看出命题在哪一类矩阵上失效。

**方阵的零空间与转置的零空间。** 若 $A$ 是方阵且 $N(A)=\{\boldsymbol{0}\}$，则 $N(A^{\mathsf T})=\{\boldsymbol{0}\}$。真。方阵时 $m=n$，$\dim N(A)=0$ 给出 $r=n=m$，于是 $\dim N(A^{\mathsf T})=m-r=0$。

**可逆矩阵不构成子空间。** 全体 $5\times 5$ 矩阵是一个 25 维的向量空间，其中的可逆矩阵却**不是**子空间。最直接的理由：零矩阵不属于它，而子空间必须含零向量。奇异矩阵全体同样不是子空间——两个奇异矩阵之和完全可能可逆，例如 $\begin{bmatrix}1&0\\0&0\end{bmatrix}+\begin{bmatrix}0&0\\0&1\end{bmatrix}=I$。

**$B^2=0$ 是否推出 $B=0$？** 假。反例是



$$
B=\begin{bmatrix}0&1\\0&0\end{bmatrix},
\qquad
B^2=\begin{bmatrix}0&0\\0&0\end{bmatrix}.
$$



这个矩阵在课程后面还会作为"出事的例子"反复出现。

**$m$ 个方程 $m$ 个未知数、列向量线性无关（linearly independent），是否对每个 $\boldsymbol{b}$ 都可解？** 真。列无关即 $r=m=n$，$A$ 可逆，$\boldsymbol{x}=A^{-1}\boldsymbol{b}$ 对任意 $\boldsymbol{b}$ 都有解。这是方阵可逆时的"好情形"，但不要把它当成唯一情形，长方矩阵才是复习的重点。

**$m=n$ 时行空间等于列空间？** 假。取 $A=\begin{bmatrix}0&1\\0&0\end{bmatrix}$，行空间是 $(0,1)$ 的倍数，列空间是 $(1,0)$ 的倍数，两条不同的直线。对称矩阵就一定会让两者重合——转置之后行与列是同一批向量。

**$A$ 与 $-A$ 有相同的四个子空间？** 真。整体变号不改变任何张成，$A\boldsymbol{x}=\boldsymbol{0}$ 与 $-A\boldsymbol{x}=\boldsymbol{0}$ 也同解。

**若 $A,B$ 有相同的四个子空间，$A$ 是否是 $B$ 的倍数？** 假。任取两个 $6\times 6$ 可逆矩阵，四个子空间都是 $\mathbb{R}^6,\mathbb{R}^6,\{\boldsymbol{0}\},\{\boldsymbol{0}\}$，一模一样，但两个可逆矩阵之间一般没有倍数关系。能推出来的只有"秩相同"这一条；四个子空间记的是方向，不记矩阵在方向上的作用。

**交换 $A$ 的两行，哪些子空间不变？** 行空间与零空间不变，列空间一般会变。两行是行空间的一组生成向量，换顺序不改变张成；交换方程的顺序也不改变解集。列空间则不同：$\begin{bmatrix}1&2\\0&0\end{bmatrix}$ 的列空间是 $(1,0)$ 的倍数，换行后变成 $(0,1)$ 的倍数。

最后要记住满秩（full rank）的两种极端，它们是判断题的总纲。$r=m$（行满秩，$m\le n$）时列空间是整个 $\mathbb{R}^m$，每个 $\boldsymbol{b}$ 都可解，但一般不唯一，因为 $\dim N(A)=n-m\ge 0$。$r=n$（列满秩，$n\le m$）时零空间只有零向量，解若有则唯一，但并非每个 $\boldsymbol{b}$ 都在列空间里。

![官方讲义摘要 第 3/5 页](</attachments/mit1806-8af5b004e3a76d802dbb3399.png>)

*MIT OCW 官方讲义摘要 第 3/5 页（18.06SC Lecture 13 Summary，CC BY-NC-SA 4.0）。*

![视频 00:25:26：课堂板书](</attachments/mit1806-3b01197d0c08cf5a069329bc.jpg>)

*视频 00:25:26｜约对应第 3 节「3. 考点三：四个基本子空间的快速判断」附近。*

![视频 00:30:59：课堂板书](</attachments/mit1806-694dfd6e4f205fa934775d0b.jpg>)

*视频 00:30:59｜约对应第 3 节「3. 考点三：四个基本子空间的快速判断」附近。*

## 4. 考点四：带可逆因子的乘积，先看结构再动笔

有一类题把矩阵写成两个矩阵的乘积，直接乘开既费时又容易算错；正确做法是先看清结构。

设 $B=CD$，其中



$$
C=\begin{bmatrix}1&1&0\\0&1&0\\1&0&1\end{bmatrix},
\qquad
D=\begin{bmatrix}1&0&-1&2\\0&1&1&-1\\0&0&0&0\end{bmatrix}.
$$



$C$ 是 $3\times 3$，$D$ 是 $3\times 4$，所以 $B$ 是 $3\times 4$，求零空间就要找 $\mathbb{R}^4$ 中的向量。

先看 $C$。它的三列是 $(1,0,1)$、$(1,1,0)$、$(0,0,1)$。第二列在第二个分量上是 1，而另两列在该位置都是 0，所以任何等于零的组合都必须先把第二列的系数逼成 0；剩下两列又显然无关。故 $C$ 可逆。

关键结论：**$C$ 可逆时 $N(CD)=N(D)$。** 一方面，$D\boldsymbol{x}=\boldsymbol{0}$ 两边左乘 $C$ 得 $CD\boldsymbol{x}=\boldsymbol{0}$；另一方面，$CD\boldsymbol{x}=\boldsymbol{0}$ 两边左乘 $C^{-1}$ 得 $D\boldsymbol{x}=\boldsymbol{0}$。可逆矩阵左乘不会把非零向量压成零，也就不会改变零空间。同样的理由给出 $r(B)=r(D)=2$。

于是只需解 $D\boldsymbol{x}=\boldsymbol{0}$。$D$ 的主元列是第 1、2 列，自由变量是 $x_3,x_4$；把上两行写成分块形式 $\begin{bmatrix}I&F\end{bmatrix}$（第三行全零），其中



$$
F=\begin{bmatrix}-1&2\\1&-1\end{bmatrix},
\qquad
N(D)=\begin{bmatrix}-F\\I\end{bmatrix}
=\begin{bmatrix}1&-2\\-1&1\\1&0\\0&1\end{bmatrix}.
$$



两列就是零空间的两个基向量：$x_3=1,x_4=0$ 给出 $\boldsymbol{s}_1=(1,-1,1,0)$，$x_4=1,x_3=0$ 给出 $\boldsymbol{s}_2=(-2,1,0,1)$。代回验证：$D\boldsymbol{s}_1$ 的第一行是 $1-1=0$，第二行是 $-1+1=0$。注意零空间矩阵的上块是 $-F$ 而不是 $F$：主变量等于"负的 $F$ 乘自由变量"，符号弄反是这里最常见的错误。

再接一问：解 $B\boldsymbol{x}=(1,0,1)$。不必乘出 $B$。$B$ 的第一列是 $C$ 乘 $D$ 的第一列 $(1,0,0)$，也就是 $C$ 的第一列 $(1,0,1)$，恰好等于右端，因此特解取 $\boldsymbol{x}_p=(1,0,0,0)$ 即可，通解为



$$
\boldsymbol{x}=\boldsymbol{x}_p+c_1\boldsymbol{s}_1+c_2\boldsymbol{s}_2 .
$$



特解不唯一，任何满足方程的解都能充当特解，取最省力的那个；而"通解 = 一个特解 + 零空间"这个结构不依赖矩阵的规模，也不依赖方程组是有限维的，它是线性系统的一般模式。

![官方讲义摘要 第 4/5 页](</attachments/mit1806-35ebef0f6853d376bf79ae10.png>)

*MIT OCW 官方讲义摘要 第 4/5 页（18.06SC Lecture 13 Summary，CC BY-NC-SA 4.0）。*

![视频 00:36:48：课堂板书](</attachments/mit1806-5e5cf04a35e2a87072bc347f.jpg>)

*视频 00:36:48｜约对应第 4 节「4. 考点四：带可逆因子的乘积，先看结构再动笔」附近。*

## 5. 考点五：行空间与零空间为什么没有公共的非零向量

最后一问带前瞻性。向量 $\boldsymbol{v}=(1,2,3)$ 能不能既是 $A$ 的某一行，又落在 $N(A)$ 里？

不能。设第一行就是 $\boldsymbol{v}$，且 $\boldsymbol{v}\in N(A)$，则 $A\boldsymbol{v}=\boldsymbol{0}$；但 $A\boldsymbol{v}$ 的第一个分量是 $\boldsymbol{v}$ 与它自己的点积：



$$
\boldsymbol{v}^{\mathsf T}\boldsymbol{v}
=\begin{bmatrix}1&2&3\end{bmatrix}\begin{bmatrix}1\\2\\3\end{bmatrix}
=1+4+9=14\neq 0 .
$$



矛盾，可见这样的矩阵凑不出来：矩阵其余部分随便填，冲突只发生在这一行上。

结论是：行空间与零空间都住在 $\mathbb{R}^n$ 里，却只在零向量处相交。把两条信息放在一起看：行空间是 $r$ 维，零空间是 $n-r$ 维，两者都在 $\mathbb{R}^n$ 内，维数恰好相加为 $n$，交集又只有零向量——这正是正交补（orthogonal complement）的维数预兆。再进一步，零空间与行空间是互相垂直的，下一讲就从这里开始讲正交与正交补。

![官方讲义摘要 第 5/5 页](</attachments/mit1806-9a99767ba9e4fb4b13c6b7b4.png>)

*MIT OCW 官方讲义摘要 第 5/5 页（18.06SC Lecture 13 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 四个基本子空间的维数只由 $m,n,r$ 决定：列空间与行空间是 $r$ 维，零空间是 $n-r$ 维，左零空间是 $m-r$ 维；解题先定 $m,n$，再数主元得 $r$。
- $\mathbb{R}^7$ 中三个非零向量张成的子空间可能是 1、2、3 维；上界来自"只有三个向量"，排除 0 维来自"非零"。
- $5\times 3$ 矩阵若有三个主元，零空间只有零向量；把两个这样的 $U$ 叠成 $10\times 3$ 的 $B=\begin{bmatrix}U\\2U\end{bmatrix}$，秩仍是 3，零行本来就在底部。
- 分块矩阵 $C=\begin{bmatrix}U&U\\U&0\end{bmatrix}$ 是 $10\times 6$，块消元化成 $\begin{bmatrix}U&0\\0&-U\end{bmatrix}$，秩为 6，故 $\dim N(C^{\mathsf T})=10-6=4$。
- 由通解反推矩阵的三条线索：特解定出某一列，自由变量个数定出秩，零空间的基向量给出列与列的关系；本例得 $A=\begin{bmatrix}1&-1&0\\2&-2&0\\1&-1&0\end{bmatrix}$，$r=1$，可解的右端是 $(1,2,1)$ 的倍数。
- 判断题要点：方阵零空间平凡则转置零空间也平凡；可逆矩阵与奇异矩阵都不构成子空间；$B^2=0$ 不推出 $B=0$；$m=n$ 时行空间一般不等于列空间。
- 相同四个子空间只能推出相同的秩，推不出矩阵成比例；两个 $6\times 6$ 可逆矩阵就是反例。
- 交换两行保持行空间与零空间，列空间会变；满秩两种极端 $r=m$ 与 $r=n$ 决定了可解性与唯一性。
- $C$ 可逆时 $N(CD)=N(D)$、$r(CD)=r(D)$，所以乘积的零空间不必乘开；把 $D$ 的上两行写成 $\begin{bmatrix}I&F\end{bmatrix}$，零空间基就是 $\begin{bmatrix}-F\\I\end{bmatrix}$，符号要反。
- 行空间与零空间的交集只有零向量：若 $(1,2,3)$ 同时是某行与零空间向量，则须有 $\boldsymbol{v}^{\mathsf T}\boldsymbol{v}=1+4+9=14$ 等于 $0$，矛盾；下一讲证明这两个空间正交。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| rank | 秩 | 主元个数，也是列空间与行空间的维数 |
| column space | 列空间 | $A$ 各列的全部线性组合，落在 $\mathbb{R}^m$ |
| nullspace | 零空间 | 满足 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部 $\boldsymbol{x}$，落在 $\mathbb{R}^n$ |
| row space | 行空间 | $A$ 各行的全部线性组合，与零空间同在 $\mathbb{R}^n$ |
| left nullspace | 左零空间 | 满足 $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$ 的 $\boldsymbol{y}$，落在 $\mathbb{R}^m$ |
| dimension | 维数 | 空间中基向量的个数 |
| basis | 基 | 张成整个空间且线性无关的一组向量 |
| span | 张成 | 一组向量全部线性组合构成的子空间 |
| linearly independent | 线性无关 | 只有全零系数才能组合出零向量 |
| free variable | 自由变量 | 非主元列对应的变量，可任取 |
| particular solution | 特解 | 满足 $A\boldsymbol{x}=\boldsymbol{b}$ 的某一个解 |
| general solution | 通解 | 特解加上零空间中的任意向量 |
| row reduced echelon form | 行最简形 | 主元为 1、主元列其余元素为零且零行沉底的阶梯形 |
| full rank | 满秩 | $r=m$ 或 $r=n$，可解性与唯一性分别由另一侧维数决定 |
| subspace | 子空间 | 对加法与数乘封闭、且含零向量的向量集合 |

---

[← Lecture 12](/notes/mit-1806/lec12) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 14 →](/notes/mit-1806/lec14)
