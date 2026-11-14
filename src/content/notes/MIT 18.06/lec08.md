---
title: Lecture 8 · 求解 $A\boldsymbol{x}=\boldsymbol{b}$：行最简形 $R$
description: 用行最简形 R 判断 Ax=b 的可解性，并写出通解。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 9
tags:
  - lineal algebra
status: completed
publish: true
---

> *Solving Ax = b: row reduced form R* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 8 讲 / 共 35 讲** ｜ 第一部分 · 消元与向量空间

**本讲视频**：[Bilibili p8 · 求解 $A\boldsymbol{x}=\boldsymbol{b}$：行最简形 $R$](https://www.bilibili.com/video/BV1ix411f7Yp?p=8)（47:26）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=8&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲求的是 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部解，也就是**零空间**（nullspace）。本讲把同一套工具对准一般的右端向量 $\boldsymbol{b}$，回答关于 $A\boldsymbol{x}=\boldsymbol{b}$ 的三个问题：它有没有解？有解时有多少个？怎样把全部解写出来？这三点讲清楚，“解线性方程组”这件事才算真正完成。

答案有一个极简的结构：**通解 $=$ 一个特解 $+$ 零空间中的任意向量**。特解负责把右端对上，零空间负责提供全部自由度。于是求解被拆成两件互不干扰的工作：消元负责找出一个特解，上一讲的方法负责描述零空间。

第二个收获是把“有多少解”完全交给一个数——**秩**（rank）。设 $A$ 是 $m\times n$ 矩阵、秩为 $r$，$r$ 与 $m$、$n$ 的大小关系只有四种组合，每种组合对应一类解的情形。秩决定解集的形状，具体的数字才决定解的位置。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-f3ac10961dfcd1c79d6e647f.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 8 Summary，CC BY-NC-SA 4.0）。*

## 1. 增广矩阵与可解性条件

沿用上一讲求零空间时用过的矩阵



$$
A=\begin{bmatrix}
1&2&2&2\\
2&4&6&8\\
3&6&8&10
\end{bmatrix}.
$$



它的第三行恰好是前两行之和：$(3,6,8,10)=(1,2,2,2)+(2,4,6,8)$。这个巧合会在消元中变成一个零行，而零行正是判断可解性的入口。

要求解 $A\boldsymbol{x}=\boldsymbol{b}$，把右端作为额外一列接在 $A$ 右边，得到**增广矩阵**（augmented matrix）：



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
2&4&6&8&b_2\\
3&6&8&10&b_3
\end{array}\right].
$$



消元对左端做的每一步，右端必须同步做一遍，把 $\boldsymbol{b}$ 放进同一张表就不容易漏。实际软件里也是这样输入的：一张表就是全部信息。

第一个**主元**（pivot）是 $(1,1)$ 位置的 $1$。第二行减去第一行的 $2$ 倍，第三行减去第一行的 $3$ 倍：



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
0&0&2&4&b_2-2b_1\\
0&0&2&4&b_3-3b_1
\end{array}\right].
$$



第二列在主元位置及其下方全是零，取不出主元，于是向右跳到第三列，$(2,3)$ 位置的 $2$ 成为第二个主元。再用它消去下面那一行：



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
0&0&2&4&b_2-2b_1\\
0&0&0&0&b_3-b_2-b_1
\end{array}\right].
$$



最后一行写回方程是 $0=b_3-b_2-b_1$。它不含任何未知数，所以不是用来解 $x$ 的，而是用来检验 $\boldsymbol{b}$ 的：只有 $b_1+b_2=b_3$ 时它才成立。

消元能用来判断可解性，是因为每一步行变换都可逆：第二行减去第一行的 $2$ 倍之后，还可以把 $2$ 倍加回去，解集因此原封不动。新旧两个方程组同解，而新方程组里的矛盾一眼可见，原方程组的命运也就定了。

拿数字试一下。若 $\boldsymbol{b}=(1,5,6)$，$1+5=6$，条件满足，消元把右端变成 $(1,\,3,\,0)$，最后一行是 $0=0$，可以继续求解。若 $\boldsymbol{b}=(1,5,17)$，条件不满足，最后一行成了 $0=11$，方程组无解。

判据有两种说法，看上去毫不相干，其实等价。第一种是列空间的语言：$\boldsymbol{b}$ 必须落在 $A$ 的**列空间**（column space）里，也就是 $\boldsymbol{b}$ 能写成 $A$ 各列的组合——这本来就是方程的含义。第二种是行的语言：若 $A$ 的若干行经过组合得到零行，则 $\boldsymbol{b}$ 的对应分量经过同样的组合必须得到 $0$。本例中“第三行减第一行减第二行”给出零行，于是 $b_3-b_1-b_2$ 必须为零。

第二种说法的道理藏在消元的本质里：消元从不制造新信息，它只是把已有的方程做线性组合。左边的组合如果是零，右边按同样方式组合出来的那个数就必须是零，否则会出现 $0$ 等于非零数的矛盾。反过来，如果每次产生零行时右端也恰好是零，那么剩下每个方程都带一个全新的主元，方程组就能解出来。

把这句话写成公式会更清楚。若存在系数 $c_1,c_2,c_3$ 使



$$
c_1\,\text{row}_1+c_2\,\text{row}_2+c_3\,\text{row}_3=\boldsymbol{0},
$$



则任何解都必须满足 $c_1b_1+c_2b_2+c_3b_3=0$。本例中取 $(c_1,c_2,c_3)=(-1,-1,1)$ 就得到零行，于是可解性条件正是 $-b_1-b_2+b_3=0$。这也解释了为什么“零行”和“对 $\boldsymbol{b}$ 的限制”总是同时出现：零行本身就是那组系数 $c_i$ 的收据。

![视频 00:04:45：课堂板书](</attachments/mit1806-694c1535a15cb7012860d26c.jpg>)

*视频 00:04:45｜约对应第 1 节「1. 增广矩阵与可解性条件」附近。*

## 2. 特解：自由变量全部置零

可解性过关之后，第一件事是造出一个解。

设 $\boldsymbol{b}=(1,5,6)$。主元所在的列是第 $1$、$3$ 列，所以 $x_1,x_3$ 是主变量；第 $2$、$4$ 列没有主元，$x_2,x_4$ 是**自由变量**（free variable）。

找**特解**（particular solution）的办法是：把全部自由变量置零，再对主变量回代。令 $x_2=x_4=0$，消元后的前两行变成



$$
x_1+2x_3=1,\qquad 2x_3=3 .
$$



第二个方程只剩 $x_3$，得 $x_3=\frac32$；代回第一个，$x_1=1-2\cdot\frac32=-2$。于是



$$
\boldsymbol{x}_p=\begin{bmatrix}
-2\\
0\\
\frac32\\
0
\end{bmatrix}.
$$



为什么置零是最省事的选择？自由变量本来就可以任取，取零能让所有含自由变量的项整块消失，剩下的系统方程个数正好等于主变量个数，呈三角形，可以直接回代。换句话说，令自由变量为零，等于把没有主元的列整块搁置，只留下主元列，问题立刻退回熟悉的方阵情形。任何一组自由变量的取值都给出一个解，所以 $\boldsymbol{x}_p$ 并不唯一，它只是“自由变量全为零”的那一个。

顺带看清主元的位置。这个矩阵的第二个主元在第三列而不是第二列：第二列恰好是第一列的 $2$ 倍，消元后从主元位置往下全是零，自然取不出主元。主元不一定落在对角线上，重要的只是它落在哪几列。

代回原方程检验：第一行 $-2+2\cdot\frac32=1$，第二行 $2(-2)+6\cdot\frac32=5$，第三行 $3(-2)+8\cdot\frac32=6$，三个右端都对上。做完题花十秒验算，是值得养成的习惯。

![视频 00:11:21：课堂板书](</attachments/mit1806-f3a1d5ea95316e32b212bcc3.jpg>)

*视频 00:11:21｜约对应第 2 节「2. 特解：自由变量全部置零」附近。*

## 3. 通解：特解加零空间

一个解不解决问题，要的是全部解。设 $\boldsymbol{x}_n$ 是零空间中的任意向量，即 $A\boldsymbol{x}_n=\boldsymbol{0}$，那么



$$
A(\boldsymbol{x}_p+\boldsymbol{x}_n)=A\boldsymbol{x}_p+A\boldsymbol{x}_n=\boldsymbol{b}+\boldsymbol{0}=\boldsymbol{b},
$$



所以 $\boldsymbol{x}_p+\boldsymbol{x}_n$ 仍是解。反过来，若 $\boldsymbol{x}$ 是任一解，则



$$
A(\boldsymbol{x}-\boldsymbol{x}_p)=\boldsymbol{b}-\boldsymbol{b}=\boldsymbol{0},
$$



即 $\boldsymbol{x}-\boldsymbol{x}_p$ 落在零空间里，$\boldsymbol{x}=\boldsymbol{x}_p+\boldsymbol{x}_n$。两个方向合起来：解集恰好是 $\boldsymbol{x}_p+N(A)$，不多一个也不少一个。

零空间上一讲已经会算。用消元后的方程复核：第二行给出 $2x_3+4x_4=0$，即 $x_3=-2x_4$；第一行给出 $x_1+2x_2+2x_3+2x_4=0$，代入得 $x_1=-2x_2+2x_4$。让两个自由变量轮流取 $1$、另一个取 $0$：

- $x_2=1,\ x_4=0$：$x_3=0$，$x_1=-2$，得 $\boldsymbol{s}_1=(-2,1,0,0)$；
- $x_2=0,\ x_4=1$：$x_3=-2$，$x_1=2$，得 $\boldsymbol{s}_2=(2,0,-2,1)$。

第二组可以抽查第一行：$2+2(-2)+2(1)=0$，确实为零。这样在零空间里把自由变量取成 $1$ 和 $0$ 得到的解叫**特殊解**（special solution），以区别于右端为 $\boldsymbol{b}$ 的那个特解。于是**通解**（general solution）是



$$
\boldsymbol{x}=\begin{bmatrix}
-2\\
0\\
\frac32\\
0
\end{bmatrix}
+c_1\begin{bmatrix}
-2\\
1\\
0\\
0
\end{bmatrix}
+c_2\begin{bmatrix}
2\\
0\\
-2\\
1
\end{bmatrix},
\qquad c_1,c_2\ \text{任意}.
$$



这里有一条必须记住的区别：$\boldsymbol{x}_p$ 前面不能乘常数，$\boldsymbol{s}_1,\boldsymbol{s}_2$ 前面可以。乘以 $3$ 倍的特解所满足的右端是 $3\boldsymbol{b}$，不再是 $\boldsymbol{b}$；而零空间向量无论怎么加、怎么乘，右端永远是零。特解是“一个点”，零空间是“一个空间”，两者地位不同。也正因为如此，换一个特解不会改变解集：若 $\boldsymbol{x}'_p$ 是另一个特解，则 $\boldsymbol{x}'_p-\boldsymbol{x}_p$ 在零空间里，以它为参照点画出的仍是同一张平面，只是参照点换了位置。

几何上，$A\boldsymbol{x}=\boldsymbol{b}$ 的解集并不构成子空间：$\boldsymbol{b}\ne\boldsymbol{0}$ 时它不含原点。它是一张过 $\boldsymbol{x}_p$ 的平面，方向由 $\boldsymbol{s}_1,\boldsymbol{s}_2$ 张成。$\boldsymbol{x}$ 有四个分量，所以这张平面住在 $\mathbb{R}^4$ 里，被整体平移离开了原点。两个参数说明它是二维的——下一讲才会正式定义子空间的维数，但这里已经能看出，维数就是可以自由选取的独立常数的个数。

![视频 00:18:01：课堂板书](</attachments/mit1806-9185bcf19ea5a4f7aeac6290.jpg>)

*视频 00:18:01｜约对应第 3 节「3. 通解：特解加零空间」附近。*

![官方讲义摘要 第 2/3 页](</attachments/mit1806-dba064e18604a7e23b9d883b.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 8 Summary，CC BY-NC-SA 4.0）。*

## 4. 秩：一个数决定自由度

前面的推导用的是一个具体的 $3\times4$ 矩阵。要把它用到任意 $m\times n$ 矩阵上，只需抓住一个数：**秩**（rank），它目前的定义就是消元中主元的个数。

秩与矩阵尺寸之间只有两条不等式。每行最多贡献一个主元，所以 $r\le m$；每列最多容纳一个主元，所以 $r\le n$。主元所在的列称为主元列，其余列没有主元，对应的变量可以任取，因此



$$
\text{自由变量的个数}=n-r .
$$



这个等式是整讲的枢纽。它说明自由度与方程有多少个、未知数有多少个都不直接相关，只由 $n-r$ 决定。它同时给出特殊解的个数：每个自由变量对应一个特殊解，$n-r$ 个特殊解的全部组合恰好填满零空间。

“满秩”这个词有两种用法。$r=n$ 称为**列满秩**（full column rank），此时每一列都是主元列；$r=m$ 称为**行满秩**（full row rank），此时每一行都有主元。只有方阵才有 $m=n$，也才可以把两者合称满秩。下面三种满秩情形，加上一般的“小秩”情形，就是全部四种可能。

![视频 00:24:24：课堂板书](</attachments/mit1806-faf6dc74acac6ce1d2cc8d15.jpg>)

*视频 00:24:24｜约对应第 4 节「4. 秩：一个数决定自由度」附近。*

## 5. 列满秩 $r=n$：零空间只有零向量

$r=n$ 时每一列都带主元，没有自由变量，$n-r=0$，零空间里只剩下零向量——没有任何量可以任取，$A\boldsymbol{x}=\boldsymbol{0}$ 就只有 $\boldsymbol{x}=\boldsymbol{0}$ 一个解。

这立刻决定了 $A\boldsymbol{x}=\boldsymbol{b}$ 的形状：若有解，解必唯一，因为两个解之差在零空间里，而那里只有零。但解未必存在。列满秩的矩阵通常“又高又瘦”，方程个数多于未知数，多出来的方程是约束而不是自由。

一个 $4\times2$ 的例子：



$$
A=\begin{bmatrix}
1&3\\
2&1\\
6&1\\
5&1
\end{bmatrix}.
$$



两列分别是 $(1,2,6,5)$ 与 $(3,1,1,1)$，方向不同，秩为 $2=n$。消元会找出两个主元；把主元上下都清干净、再把主元化为 $1$，得到**行最简形**（row reduced echelon form）



$$
R=\begin{bmatrix}
1&0\\
0&1\\
0&0\\
0&0
\end{bmatrix}
=\begin{bmatrix}
I\\
0
\end{bmatrix},
$$



上面是一个二阶**单位矩阵** $I$，下面两行全零。这个形状说明：$A$ 的行空间只有两个独立方向，四个方程本质上只是两个方程外加两个组合。注意 $R$ 里没有 $F$ 那一块，因为两列都是主元列、没有自由列，$F$ 就整个消失了。

对这样的矩阵，随机取一个 $\boldsymbol{b}$ 几乎一定无解，因为 $\boldsymbol{b}$ 必须恰好是这两列的组合才行；四个方程、两个未知数，条件给得太多了。若 $\boldsymbol{b}$ 挑得正好，例如取两列之和



$$
\boldsymbol{b}=\begin{bmatrix}
1\\2\\6\\5
\end{bmatrix}
+\begin{bmatrix}
3\\1\\1\\1
\end{bmatrix}
=\begin{bmatrix}
4\\3\\7\\6
\end{bmatrix},
$$



则 $\boldsymbol{x}_p=(1,1)$ 是一个解，又因零空间只有零向量，它是唯一的解。

所以列满秩对应“$0$ 个或 $1$ 个解”。

![视频 00:30:50：课堂板书](</attachments/mit1806-7dc0efa7c8ec26fe835d0bc4.jpg>)

*视频 00:30:50｜约对应第 5 节「5. 列满秩 $r=n$：零空间只有零向量」附近。*

## 6. 行满秩 $r=m$：每个右端都可解

$r=m$ 时每一行都有主元，消元过程中不会出现零行。没有零行，就没有形如 $0$ 等于非零数的方程，也就没有任何对 $\boldsymbol{b}$ 的限制：



$$
A\boldsymbol{x}=\boldsymbol{b}\ \text{对每个}\ \boldsymbol{b}\ \text{都有解}.
$$



自由度却没有用完。$m$ 个主元占用了 $m$ 个变量，剩下



$$
n-r=n-m
$$



个自由变量。只要 $n>m$，零空间就不止含零向量，解便有无穷多个；$n=m$ 时自由变量为零，退化成下一节的方阵情形。

例子取上一节矩阵的转置：



$$
A=\begin{bmatrix}
1&2&6&5\\
3&1&1&1
\end{bmatrix}.
$$



秩仍是 $2=m$，而 $n=4$，自由变量有 $4-2=2$ 个。消元到行最简形，



$$
R=\begin{bmatrix}
1&0&-\frac45&-\frac35\\
0&1&\frac{17}5&\frac{14}5
\end{bmatrix}
=\begin{bmatrix} I & F \end{bmatrix},
$$



前两列是主元列，左边凑出单位矩阵 $I$，右边剩下的是自由部分 $F$。$I$ 的出现说明主元列已经被清理干净，$F$ 的每一列则记录着对应的自由列由主元列怎样组合出来。

这个例子里零空间是二维的，两个特殊解可以取



$$
\boldsymbol{s}_1=\begin{bmatrix}
4\\-17\\5\\0
\end{bmatrix},
\qquad
\boldsymbol{s}_2=\begin{bmatrix}
3\\-14\\0\\5
\end{bmatrix},
$$



它们分别是把 $(x_3,x_4)$ 取成 $(1,0)$ 与 $(0,1)$ 后乘以 $5$ 得到的。因为每个 $\boldsymbol{b}$ 都有解，$A\boldsymbol{x}=\boldsymbol{b}$ 的通解就是某个特解加上 $c_1\boldsymbol{s}_1+c_2\boldsymbol{s}_2$，永远是一张二维的“平面”。

所以行满秩对应“必有解，且 $n>m$ 时有无穷多解”。

把两种满秩放在一起对照，可以看到一个对称：行满秩管的是**存在性**（没有零行，于是没有对 $\boldsymbol{b}$ 的要求），列满秩管的是**唯一性**（没有自由变量，于是零空间为零）。哪一个成立，取决于 $r$ 追上了 $m$ 还是追上了 $n$。

![视频 00:37:27：课堂板书](</attachments/mit1806-fb3196bb7da45729724f7bb3.jpg>)

*视频 00:37:27｜约对应第 6 节「6. 行满秩 $r=m$：每个右端都可解」附近。*

## 7. 满秩方阵与四种情形

最后一种满秩情形是 $r=m=n$。此时 $r=n$ 保证零空间只有零向量，$r=m$ 保证每个 $\boldsymbol{b}$ 都可解，两条合起来：对每个 $\boldsymbol{b}$ 恰有一个解，也就是 $A$ 可逆。行最简形是最干净的一种，就是单位矩阵。

最小的例子是



$$
A=\begin{bmatrix}
1&2\\
3&1
\end{bmatrix},
\qquad
R=\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}=I .
$$



任给 $\boldsymbol{b}=(b_1,b_2)$，$A\boldsymbol{x}=\boldsymbol{b}$ 都有唯一解 $\boldsymbol{x}=A^{-1}\boldsymbol{b}$。这正是可逆矩阵的特征，也是“好矩阵”的标准：化到最简时它整个变成了 $I$。

把四种情形排在一起。判断解的情况其实只问两个是非题：消元后有没有零行（即 $r<m$ 是否成立），零空间里有没有非零向量（即 $r<n$ 是否成立）。两个答案组合起来，正好四格：

| 秩 | 行最简形 $R$ 的形状 | 解的情况 |
| --- | --- | --- |
| $r=m=n$ | $I$ | 恰有一个解，$A$ 可逆 |
| $r=n<m$（列满秩） | $\begin{bmatrix} I \\ 0 \end{bmatrix}$ | $0$ 个或 $1$ 个解 |
| $r=m<n$（行满秩） | $\begin{bmatrix} I & F \end{bmatrix}$ | 必有解，$n>m$ 时无穷多解 |
| $r<m$ 且 $r<n$ | $\begin{bmatrix} I & F \\ 0 & 0 \end{bmatrix}$ | $0$ 个或无穷多解 |

表中写成 $\begin{bmatrix} I & F \end{bmatrix}$ 有个前提：主元恰好落在最前面几列。若主元分布在别的列上，$I$ 与 $F$ 的列会交错排列，$R$ 仍然是“主元列上拼出单位矩阵、自由列上是 $F$、可能还带零行”。形状会变，判据不变。

最后一行值得单独说一句：$r$ 同时小于 $m$ 和 $n$ 时，两个毛病同时存在——既有零行（所以可能无解），又有自由变量（所以有解时必不唯一）。这正是最一般的矩阵的命运。本讲开头那个 $3\times4$ 的例子就落在这一格：$r=2$，比 $m=3$ 小，也比 $n=4$ 小，于是 $\boldsymbol{b}=(1,5,17)$ 无解，而 $\boldsymbol{b}=(1,5,6)$ 有解，并且因为有两个自由变量而有无穷多个解。整讲从这个例子出发，最后在总表里为它找到了位置。

一句话收束全讲：**秩告诉你有多少个解，矩阵里的数字才告诉你解是什么。**

![视频 00:42:41：课堂板书](</attachments/mit1806-6993b41182b700edc4d2ebb9.jpg>)

*视频 00:42:41｜约对应第 7 节「7. 满秩方阵与四种情形」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-395fbd7bcfb190c5c864a129.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 8 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 把右端接在 $A$ 右侧得到**增广矩阵**，消元时右端必须同步变换；出现零行就得到对 $\boldsymbol{b}$ 的约束。
- 本讲例子中第三行等于前两行之和，消元给出零行 $0=b_3-b_2-b_1$，可解条件是 $b_1+b_2=b_3$：$\boldsymbol{b}=(1,5,6)$ 可解，$\boldsymbol{b}=(1,5,17)$ 无解。
- 可解性的两种等价语言：$\boldsymbol{b}$ 属于 $A$ 的**列空间**；或者任何把 $A$ 的行组合成零行的组合，作用在 $\boldsymbol{b}$ 上也必须得到 $0$。
- **特解**的求法：自由变量全部置零，再对主变量回代。本例得 $\boldsymbol{x}_p=(-2,0,\frac32,0)$，代回原方程成立。
- **通解** $=$ 特解 $+$ 零空间，因为 $A(\boldsymbol{x}_p+\boldsymbol{x}_n)=\boldsymbol{b}+\boldsymbol{0}=\boldsymbol{b}$；本例两个**特殊解**为 $(-2,1,0,0)$ 与 $(2,0,-2,1)$。
- 特解前面的常数不能任意取，零空间向量前面的常数可以任意取；解集本身不是子空间，而是一张被平移离开原点的平面。
- **秩**等于主元个数，满足 $r\le m$、$r\le n$，自由变量个数为 $n-r$。
- **列满秩** $r=n$：零空间只有零向量，解为 $0$ 个或 $1$ 个；$4\times2$ 例子中 $R=\begin{bmatrix} I \\ 0 \end{bmatrix}$，$\boldsymbol{b}=(4,3,7,6)$ 时唯一解为 $(1,1)$。
- **行满秩** $r=m$：没有零行，每个 $\boldsymbol{b}$ 都可解，自由变量 $n-m$ 个，$n>m$ 时无穷多解；$2\times4$ 例子中 $R=\begin{bmatrix} I & F \end{bmatrix}$。
- **满秩方阵** $r=m=n$：$R=I$，$A$ 可逆，对每个 $\boldsymbol{b}$ 恰有一个解。四种情形的分界完全由秩与 $m$、$n$ 的关系决定。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| augmented matrix | 增广矩阵 | 在系数矩阵右侧接上右端向量得到的矩阵 |
| solvability | 可解性 | 方程组存在解的条件，表现为零行对应的右端必须为零 |
| column space | 列空间 | $A$ 各列的全部线性组合构成的子空间 |
| particular solution | 特解 | 满足 $A\boldsymbol{x}=\boldsymbol{b}$ 的某一个解，通常取自由变量全为零 |
| free variable | 自由变量 | 所在列没有主元的变量，可以任意取值 |
| pivot variable | 主变量 | 所在列有主元的变量，由自由变量的取值唯一确定 |
| special solution | 特殊解 | 零空间中自由变量轮流取 $1$ 与 $0$ 得到的解，其组合构成零空间 |
| general solution | 通解 | $A\boldsymbol{x}=\boldsymbol{b}$ 的全部解，等于特解加零空间 |
| rank | 秩 | 消元中主元的个数，决定解的存在性与自由度 |
| full column rank | 列满秩 | $r=n$，每列都有主元，零空间只有零向量 |
| full row rank | 行满秩 | $r=m$，每行都有主元，对每个 $\boldsymbol{b}$ 都可解 |
| row reduced echelon form | 行最简形 | 主元为 $1$、主元列上下全为零的消元终态 $R$ |

---

[← Lecture 7](/notes/mit-1806/lec07) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 9 →](/notes/mit-1806/lec09)
