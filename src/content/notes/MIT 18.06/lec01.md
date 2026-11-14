---
title: Lecture 1 · 方程组的几何解释
description: 从行、列、矩阵三种视角理解 Ax=b，看清线性组合如何生成整个空间。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 2
tags:
  - lineal algebra
status: completed
publish: true
---

> *The geometry of linear equations* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 1 讲 / 共 35 讲** ｜ 第一部分 · 消元与向量空间

**本讲视频**：[Bilibili p1 · 方程组的几何解释](https://www.bilibili.com/video/BV1ix411f7Yp?p=1)（39:49）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=1&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

线性代数的中心问题是解方程组 $A\boldsymbol{x}=\boldsymbol{b}$。本讲不急于给出算法，而是先建立三种彼此等价、但直觉完全不同的看法：**行视图**把每个方程看成一张超平面，**列视图**把解看成列向量的线性组合，**矩阵视图**则把整个方程组压缩成一次矩阵与向量的乘法。这三种视角会在整门课中反复出现；其中列视图尤其重要，因为它把“解方程”翻译成了“用列向量拼出右端向量”。

为什么要费力气建立三种看法？因为解方程只是线性代数最表层的任务。行视图回答“解在几何上是什么”，列视图回答“哪些右端向量是可达的、为什么”，矩阵视图则把成百上千个方程压缩成一个对象，使我们可以对“矩阵”本身做运算、做分解、讨论可逆性。只会在纸上消元，遇到 $n$ 维空间、最小二乘、特征值问题时就会失去方向；三种视角合在一起，才能把计算、几何与代数连成一体。

本讲先用一个 $2\times2$ 例子把三种视角各走一遍，再推广到 $3\times3$，最后讨论一个贯穿全课程的问题：对给定的 $A$，是不是每个 $\boldsymbol{b}$ 都能被解出来？这个问题的答案，将引出“奇异矩阵”“列空间”以及下一讲的消元法。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-5a21676e7f6523e46a18e78c.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 1 Summary，CC BY-NC-SA 4.0）。*

## 1. 从一个 $2\times 2$ 方程组开始

先看一个可以手算的例子：



$$
\begin{cases}
2x-y=0,\\
-x+2y=3.
\end{cases}
$$



把未知数前的系数按位置排成矩阵，就得到系数矩阵



$$
A=\begin{bmatrix}2&-1\\-1&2\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}x\\y\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}0\\3\end{bmatrix}.
$$



于是方程组可以写成紧凑的矩阵形式 $A\boldsymbol{x}=\boldsymbol{b}$。这里 $A$ 是一个 $2\times 2$ 矩阵，$\boldsymbol{x}$ 和 $\boldsymbol{b}$ 都是二维列向量。矩阵本质上就是一个矩形数字阵列；它的每一行对应一个方程，每一列则对应一个未知数在各方程中的系数。

## 2. 行视图：每个方程是一张超平面

行视图一次只看一个方程。第一个方程 $2x-y=0$ 描述了 $xy$ 平面上的一条直线。取 $y=0$ 得 $x=0$，所以直线经过原点；再取 $x=1$ 得 $y=2$，于是又得到点 $(1,2)$。两点确定一条直线，所有满足第一个方程的点都落在这条线上。

第二个方程 $-x+2y=3$ 同样是一条直线。它不经过原点：当 $x=y=0$ 时左边为 $0$，不等于 $3$。取 $y=0$ 得 $x=-3$，取 $x=-1$ 得 $y=1$，连接这两点便得到第二条直线。

两条直线交于一点 $(1,2)$。把 $x=1,y=2$ 代回两个方程：



$$
2(1)-2=0,\qquad -(1)+2(2)=3,
$$



两个等式都成立，所以 $(1,2)$ 就是方程组的解。**行视图的要点是：方程组的解必须同时落在所有方程对应的直线上，因此它是这些直线的交点。**

把这个想法推广到 $n$ 个未知数：一个线性方程在 $n$ 维空间中对应一张 $(n-1)$ 维的“超平面”。在三维中，两张平面交于一条直线，三张平面通常交于一点；在一般的 $n$ 维空间中，两个超平面的交集通常是 $(n-2)$ 维的，三个超平面的交集通常是 $(n-3)$ 维的。维度越高，图形越难画，但“解集是所有超平面的公共交集”这一几何意义不变；当交集恰好缩成一个点时，解才唯一。

![视频 00:03:59：课堂板书](</attachments/mit1806-7f93e0a16b6fcba400779206.jpg>)

*视频 00:03:59｜约对应第 2 节「2. 行视图：每个方程是一张超平面」附近。*

![视频 00:07:10：课堂板书](</attachments/mit1806-f1b7920529985e7a3d1074a0.jpg>)

*视频 00:07:10｜约对应第 2 节「2. 行视图：每个方程是一张超平面」附近。*

## 3. 三维例子：三张平面交于一点

再来看一个 $3\times 3$ 的例子：



$$
\begin{cases}
2x-y=0,\\
-x+2y-z=-1,\\
-3y+4z=4.
\end{cases}
$$



它的系数矩阵和右端向量分别是



$$
A=\begin{bmatrix}
2&-1&0\\
-1&2&-1\\
0&-3&4
\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}0\\-1\\4\end{bmatrix}.
$$



在行视图中，这三个方程分别对应三维空间中的三张平面。第一张平面经过原点，第二张不经过原点，第三张也不经过原点。前两张平面相交于一条直线，第三条平面再与这条直线相交于一点——这个点就是方程组的解。

直接观察可以验证



$$
\boldsymbol{x}=\begin{bmatrix}0\\0\\1\end{bmatrix}
$$



满足三个方程：第一式 $0=0$，第二式 $0+0-1=-1$，第三式 $0+0+4=4$。所以三张平面的公共点就是 $(0,0,1)$。

行视图在 $2\times 2$ 时非常直观，但到了三维已经开始难以画准；到了四维、九维，人眼根本画不出来。线性代数需要一种不依赖作图的表示方式，这就是列视图。

## 4. 列视图：解是列向量的线性组合

把 $A\boldsymbol{x}$ 按列拆开：



$$
A\boldsymbol{x}
=
x\begin{bmatrix}2\\-1\end{bmatrix}
+y\begin{bmatrix}-1\\2\end{bmatrix}
=
\begin{bmatrix}0\\3\end{bmatrix}.
$$



换句话说，解方程组就是寻找系数 $x,y$，使得两条列向量的线性组合恰好等于右端向量 $\boldsymbol{b}$。这里的“线性组合”是整个课程最核心的操作：**把若干个向量分别乘以标量，再把结果相加。**

对上面的例子，取 $x=1,y=2$：



$$
1\begin{bmatrix}2\\-1\end{bmatrix}
+2\begin{bmatrix}-1\\2\end{bmatrix}
=
\begin{bmatrix}2-2\\-1+4\end{bmatrix}
=
\begin{bmatrix}0\\3\end{bmatrix}.
$$



从几何上看，先沿第一个列向量 $(2,-1)$ 走一份，再沿第二个列向量 $(-1,2)$ 走两份，终点正好落在 $\boldsymbol{b}=(0,3)$ 处。这就是列视图：**解是“用列向量拼出 $\boldsymbol{b}$”所需的配方。**

把两种视图放在一起对照，差别一目了然：

| | 行视图 | 列视图 |
| --- | --- | --- |
| 关注对象 | $A$ 的每一行 | $A$ 的每一列 |
| 几何形象 | 每个方程是一张超平面 | 每个列向量是一个箭头 |
| 解的含义 | 所有超平面的公共交点 | 拼出 $\boldsymbol{b}$ 的组合系数 |
| 可解性问题 | 这些超平面是否相交 | 列向量的组合能否覆盖 $\boldsymbol{b}$ |
| 高维推广 | 难以作图 | 仍可代数和集合地描述 |

行视图直观，但受限于人眼能画出的维数；列视图抽象，却能直接回答“哪些 $\boldsymbol{b}$ 可达”。随着课程推进，列视图会成为默认语言。

三维例子同样可以这样读：



$$
x\begin{bmatrix}2\\-1\\0\end{bmatrix}
+y\begin{bmatrix}-1\\2\\-3\end{bmatrix}
+z\begin{bmatrix}0\\-1\\4\end{bmatrix}
=
\begin{bmatrix}0\\-1\\4\end{bmatrix}.
$$



这一次 $\boldsymbol{b}$ 恰好就是第三个列向量，所以取 $x=0,y=0,z=1$ 即可。这个例子是特意设计的，好让列组合的答案一眼可见；多数时候并没有这么幸运。

![视频 00:11:57：课堂板书](</attachments/mit1806-d3fabcdbf282cb26acd9ee39.jpg>)

*视频 00:11:57｜约对应第 4 节「4. 列视图：解是列向量的线性组合」附近。*

## 5. 换一个右端向量，问题立刻变了

保持矩阵 $A$ 不变，把右端换成前两个列向量之和：



$$
\boldsymbol{b}'=
\begin{bmatrix}2\\-1\\0\end{bmatrix}
+
\begin{bmatrix}-1\\2\\-3\end{bmatrix}
=
\begin{bmatrix}1\\1\\-3\end{bmatrix}.
$$



此时显然取 $x=1,y=1,z=0$ 就能得到 $\boldsymbol{b}'$。在行视图中，这相当于把三张平面整体换成另外三张平面，它们仍然交于一个新的点 $(1,1,0)$；在列视图中，列向量完全没有变，只是要拼出的目标向量变了。**同一个矩阵可以对应无数个右端向量，解也随之改变；矩阵本身决定了“哪些右端向量是可达的”。**

把所有可达的 $\boldsymbol{b}$ 收集起来，就得到 $A$ 的列向量所能张成的集合。这个集合在第五讲会被正式命名为**列空间**（column space）。于是“$A\boldsymbol{x}=\boldsymbol{b}$ 是否可解”可以一句话回答：$\boldsymbol{b}$ 是否属于 $A$ 的列空间。

这就引出本讲最重要的问题：

> 对给定的矩阵 $A$，是否对**每一个**右端向量 $\boldsymbol{b}$，方程 $A\boldsymbol{x}=\boldsymbol{b}$ 都有解？

用列视图的语言，这个问题等价于：

> $A$ 的列向量的所有线性组合，能否填满整个目标空间？

对方阵 $A$ 而言，如果列向量的组合能覆盖整个 $\mathbb{R}^n$，那么每个 $\boldsymbol{b}$ 都可达；如果只能覆盖其中的一部分，那么只有落在这部分里的 $\boldsymbol{b}$ 才有解。

![视频 00:19:54：课堂板书](</attachments/mit1806-061038bcbaaf17c2d1b1150a.jpg>)

*视频 00:19:54｜约对应第 5 节「5. 换一个右端向量，问题立刻变了」附近。*

![官方讲义摘要 第 2/3 页](</attachments/mit1806-4981527f28449e5990add3c6.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 1 Summary，CC BY-NC-SA 4.0）。*

## 6. 什么时候会“覆盖不满”？

以 $3\times 3$ 为例。如果三个列向量恰好都躺在同一张过原点的平面里，那么它们的任何线性组合仍然在这张平面里，不可能跑出平面。于是，平面内的 $\boldsymbol{b}$ 有解，平面外的 $\boldsymbol{b}$ 无解。

一个典型的坏情况是第三个列向量等于前两个列向量之和：



$$
\boldsymbol{a}_3=\boldsymbol{a}_1+\boldsymbol{a}_2.
$$



这时第三个列向量没有提供任何“新方向”，它能贡献的东西已经被前两个列向量包办了。这样的矩阵称为**奇异矩阵**（singular matrix），也叫不可逆矩阵。奇异矩阵不能保证对每个 $\boldsymbol{b}$ 都有解；反过来，列向量能够张成整个空间的矩阵称为**非奇异矩阵**（nonsingular matrix）或**可逆矩阵**（invertible matrix）。

用上面的 $3\times3$ 例子做个思想实验：把第三列换成前两列之和，即 $\boldsymbol{a}_3=\boldsymbol{a}_1+\boldsymbol{a}_2$。这时无论 $z$ 取什么值，$z\boldsymbol{a}_3$ 都可以被 $x\boldsymbol{a}_1+y\boldsymbol{a}_2$ 吸收，三个列向量的所有组合仍然停留在 $\boldsymbol{a}_1,\boldsymbol{a}_2$ 张成的平面里。若右端 $\boldsymbol{b}$ 恰好在这张平面内，方程仍可能有解（而且解不唯一，因为可以任意调整 $z$）；若 $\boldsymbol{b}$ 在平面外，就无论怎么组合都够不着它。**行视图与列视图在这里说的是同一件事**：三张平面不再交于一点，而是交于一条线（有无穷多解），或者彼此平行/构成三棱柱（无解）。

这个现象在九维空间里同样成立，只是“平面”变成了“八维超平面”。九个九维列向量如果互相独立，它们的组合可以填满整个 $\mathbb{R}^9$；如果第九个列向量只是前八个的重复或组合，那么所有组合最多填满一个八维子空间，总有一些 $\boldsymbol{b}$ 永远够不着。**维数越高越难画图，但“列向量能张成多大空间”这个代数问题始终不变。**

![视频 00:25:53：课堂板书](</attachments/mit1806-2c83ae5a0431d2427f95702b.jpg>)

*视频 00:25:53｜约对应第 6 节「6. 什么时候会“覆盖不满”？」附近。*

![视频 00:28:40：课堂板书](</attachments/mit1806-ef57716d5744ec289d7a2098.jpg>)

*视频 00:28:40｜约对应第 6 节「6. 什么时候会“覆盖不满”？」附近。*

## 7. 矩阵乘向量：两种算法，一个本质

最后回到矩阵乘法本身。给定



$$
A=\begin{bmatrix}2&5\\1&3\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}1\\2\end{bmatrix},
$$



计算 $A\boldsymbol{x}$ 有两种常见方式。

**按行计算（点积）**：结果的第一个分量是 $A$ 的第一行与 $\boldsymbol{x}$ 的点积，



$$
2\cdot 1+5\cdot 2=12;
$$



第二个分量是第二行与 $\boldsymbol{x}$ 的点积，



$$
1\cdot 1+3\cdot 2=7.
$$



所以 $A\boldsymbol{x}=\begin{bmatrix}12\\7\end{bmatrix}$。

**按列计算（线性组合）**：结果等于用 $\boldsymbol{x}$ 的分量去组合 $A$ 的列，



$$
1\begin{bmatrix}2\\1\end{bmatrix}
+2\begin{bmatrix}5\\3\end{bmatrix}
=
\begin{bmatrix}2+10\\1+6\end{bmatrix}
=
\begin{bmatrix}12\\7\end{bmatrix}.
$$



两种算法给出同一个向量。按行看，$A\boldsymbol{x}$ 是若干个点积；按列看，$A\boldsymbol{x}$ 是列向量的线性组合。**本课程更强调后者**：它把矩阵乘法与“列空间”“线性组合”“张成”这些核心概念直接连在一起，也为后面理解 $A\boldsymbol{x}=\boldsymbol{b}$ 的解结构打下基础。

## 8. 三种视角的分工

三种视角不是互相替代的关系，而是各自负责一类问题。**行视图**适合理解“解在哪里”：每个方程给出一个约束，解必须同时满足所有约束，几何上就是超平面的交集。**列视图**适合回答“有没有解、有多少解”：它把右端向量看成列向量组合的目标，目标是否可达、组合方式是否唯一，一目了然。**矩阵视图**适合做运算与推导：把整个方程组写成一个符号 $A\boldsymbol{x}=\boldsymbol{b}$，才能对矩阵做乘法、求逆、分解，才能讨论“对所有的 $\boldsymbol{b}$”这类整体性问题。

实际解题时三者常常交替使用：先用矩阵形式把问题写清楚，再用行消元求出数值解，最后用列视图解释解的结构。下一讲的消元法正是行视图的算法化；而它是否成功、失败时矩阵出了什么毛病，又要靠列视图来回答。

![视频 00:37:50：课堂板书](</attachments/mit1806-91e855d18d1dfcb1a2819f65.jpg>)

*视频 00:37:50｜约对应第 8 节「8. 三种视角的分工」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-1cba32fe328c50235cdffab8.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 1 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 线性方程组可以写成 $A\boldsymbol{x}=\boldsymbol{b}$；$A$ 的每一行是一个方程，每一列是一个未知数在各方程中的系数。
- **行视图**：每个方程是一张超平面，解是所有超平面的公共交点。二维是直线交点，三维是三张平面的交点。
- **列视图**：$A\boldsymbol{x}$ 是 $A$ 的列向量的线性组合，解方程就是寻找组合系数，使组合结果等于 $\boldsymbol{b}$。
- 矩阵乘向量既可以按行做点积，也可以按列做线性组合；列视角是理解整个课程的主线。
- 对方阵 $A$，若列向量能张成整个 $\mathbb{R}^n$，则每个 $\boldsymbol{b}$ 都有解，$A$ 非奇异；若列向量被限制在某个低维子空间里，则只有部分 $\boldsymbol{b}$ 有解，$A$ 奇异。
- 下一讲将给出系统化的求解方法——消元法，它能在任意维数下判断解是否存在，并求出解。

## 关键词

| English | 中文 | 含义 |
| --- | --- | --- |
| linear equation | 线性方程 | 未知数只以一次方出现、且不相互相乘的方程 |
| system of equations | 方程组 | 若干个线性方程联立 |
| coefficient matrix | 系数矩阵 | 把各方程中未知数的系数按行列排成的矩阵 |
| row picture | 行视图 | 一次看一个方程，把解看成超平面的交点 |
| column picture | 列视图 | 把解看成列向量的线性组合 |
| linear combination | 线性组合 | 若干个向量分别乘标量后相加 |
| singular matrix | 奇异矩阵 | 列向量不能张成整个空间、不可逆的矩阵 |
| nonsingular / invertible | 非奇异 / 可逆 | 列向量张成整个空间、对每个 $\boldsymbol{b}$ 都有唯一解的矩阵 |
| dot product | 点积 | 两个同维向量对应分量相乘再求和 |

---

[课程目录](/notes/mit-1806/overview) ｜ [Lecture 2 →](/notes/mit-1806/lec02)
