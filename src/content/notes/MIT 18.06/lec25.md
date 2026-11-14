---
title: Lecture 25 · 对称矩阵与正定性
description: 理解对称矩阵的正交对角化与正定性的判定。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 27
tags:
  - lineal algebra
status: completed
publish: true
---

> *Symmetric matrices and positive definiteness* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 25 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p26 · 对称矩阵与正定性](https://www.bilibili.com/video/BV1ix411f7Yp?p=26)（43:52）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-25-symmetric-matrices-and-positive-definiteness/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=26&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

第三部分走到这里，看矩阵的眼光已经换了：不再逐行逐列追问元素，而是追问它的特征值与特征向量。这个视角一旦确立，“矩阵的类型”就变成了关于谱的信息。马尔可夫矩阵每列之和为 $1$，于是它必定有一个特征值等于 $1$，长期行为由这个 $1$ 决定。本讲处理线性代数中最重要的一类矩阵——**对称矩阵**（symmetric matrix），即满足 $A=A^{\mathsf T}$ 的实矩阵。它给出的信息格外干净：特征值全是实数，特征向量可以选成两两**正交**（orthogonal）且长度为 $1$。

这两条事实合起来，就允许把普通的对角化 $A=S\Lambda S^{-1}$ 升级为



$$
A=Q\Lambda Q^{\mathsf T},
$$



其中 $Q$ 的列**标准正交**（orthonormal），而**正交矩阵**（orthogonal matrix）的逆恰好是它的转置。这个分解把“对称”写在明面上：对整个乘积取转置，$Q$ 与 $Q^{\mathsf T}$ 交换位置，矩阵原样返回。它在数学中称为**谱定理**（spectral theorem），力学中称为主轴定理（principal axis theorem）。把乘积按列乘行拆开，还能读出它的第二种说法：对称矩阵是若干个互相垂直的投影矩阵的加权和，权重就是特征值。

本讲还要回答三个层层递进的问题。第一，凭什么保证特征值是实数？用复共轭可以给出一个很短的证明，其中出现的“复数向量长度平方”下一讲还要反复使用。第二，既然特征值都是实数，能否不算特征方程就知道其中有几个正、几个负？能，看**主元**（pivot）的符号。第三，把“所有特征值为正”当作定义，就得到**正定矩阵**（positive definite matrix）这个对称矩阵中的优等生子类；它等价于“所有主元为正”，也等价于“所有**顺序主子式**（leading principal minor）为正”。第一周的主元、课程中段的行列式、最近几讲的特征值，在此第一次合成一件事。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-43068189d8dcb9207f419c6d.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 25 Summary，CC BY-NC-SA 4.0）。*

## 1. 两个基本事实与谱定理

本节先陈述结论，再解释每个字的含义，最后把它们写成一个矩阵等式。

**事实一：实对称矩阵的特征值全是实数。** 前面见过旋转矩阵给出复数特征值的例子：平面上转 $90^\circ$ 的矩阵把每个非零向量都转出原有的方向，特征方程没有实根。这种情形在对称矩阵身上不会发生。

**事实二：实对称矩阵的特征向量可以选成两两垂直。** “可以选成”四个字不能省。单位矩阵 $I$ 是对称的，它的特征值全是 $1$，而每个非零向量都是特征向量——面对整个空间，说“特征向量垂直”没有意义。准确的含义是：若特征值互不相同，每个特征值只对应一条特征向量直线，这些直线自动两两垂直；若某个特征值重复，对应的特征向量铺成一整张平面（或更高维的子空间），在这张平面里总能挑出一组互相垂直的向量。极端情形 $I$ 就是“整张空间”这种重复，里面当然能挑出标准正交基。所以对称矩阵拥有的不是“任意一组特征向量都垂直”，而是“存在一组完整且互相垂直的特征向量”。

完整的特征向量组意味着可以对角化，于是通常的写法成立：



$$
A=S\Lambda S^{-1},
$$



其中 $S$ 的列是特征向量，$\Lambda$ 是对角矩阵，对角元是对应的特征值。对称矩阵的情形里，这些列还可以缩短成单位向量；垂直加上单位，正是标准正交。列向量标准正交的矩阵习惯记作 $Q$（本课后面 $Q$ 一直代表这种矩阵），于是 $S$ 换成 $Q$：



$$
A=Q\Lambda Q^{\mathsf T}.
$$



这里做了两处替换：$S$ 换成 $Q$，$S^{-1}$ 换成 $Q^{\mathsf T}$。第二处成立，是因为标准正交列满足 $Q^{\mathsf T}Q=I$：按矩阵乘法，$Q^{\mathsf T}Q$ 的 $(i,j)$ 元素就是 $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$，标准正交使它在 $i=j$ 时为 $1$、在 $i\neq j$ 时为 $0$。对同阶方阵，$Q^{\mathsf T}Q=I$ 已经足以说明 $Q^{\mathsf T}=Q^{-1}$——逆不必计算，转置一下就是。

这个分解有一个立刻可查的性质：它必然对称。



$$
(Q\Lambda Q^{\mathsf T})^{\mathsf T}
=Q\Lambda^{\mathsf T}Q^{\mathsf T}
=Q\Lambda Q^{\mathsf T}.
$$



中间一步用到 $\Lambda$ 是对角矩阵，且对角元都是实数，转置后不变。反过来，每个对称矩阵都能写成这个形式，所以“是对称矩阵”与“能分解成 $Q\Lambda Q^{\mathsf T}$”是同一件事。

**名字与几何含义。**“谱”（spectrum）就是特征值全体。这个名字借自光谱：一束白光可以分解成若干纯色，对称矩阵同样可以分解成若干“纯”的特征方向，每个方向带一个实权重 $\lambda_i$。力学里叫主轴定理，意思相同：材料要在合适的坐标轴（主轴）下描述才最简单，那组轴上没有交叉项；用矩阵的话说，换到这组轴之后矩阵成了对角形，各个方向互不耦合。

![视频 00:06:35：课堂板书](</attachments/mit1806-f7fcdcefd5309260a5a26f68.jpg>)

*视频 00:06:35｜约对应第 1 节「1. 两个基本事实与谱定理」附近。*

## 2. 特征值为什么是实数

本节只做一件事：证明事实一。出发点只有 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，此刻先允许 $\lambda$ 与 $\boldsymbol{x}$ 都是复数——不能因为想得到实数，就预先假定它是实数。

第一步，对整个等式取复共轭（complex conjugate）。共轭与加、减、乘都相容，即 $\overline{ab}=\bar a\,\bar b$、$\overline{a+b}=\bar a+\bar b$，所以可以逐项共轭。又因为 $A$ 是实矩阵，逐元素共轭后不变，所以 $\bar A=A$，得



$$
A\bar{\boldsymbol{x}}=\bar\lambda\,\bar{\boldsymbol{x}}.
$$



这一步没有用到对称性，却已经说明：实矩阵若有复特征值 $\lambda$，则 $\bar\lambda$ 也是特征值（特征向量为 $\bar{\boldsymbol{x}}$），复特征值成对出现。

第二步，把共轭后的等式转置，再两边右乘 $\boldsymbol{x}$：



$$
\bar{\boldsymbol{x}}^{\mathsf T}A^{\mathsf T}
=\bar\lambda\,\bar{\boldsymbol{x}}^{\mathsf T},
\qquad\Longrightarrow\qquad
\bar{\boldsymbol{x}}^{\mathsf T}A^{\mathsf T}\boldsymbol{x}
=\bar\lambda\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}.
$$



对称性在这里第一次、也是唯一一次被使用：$A^{\mathsf T}=A$，于是左端就是 $\bar{\boldsymbol{x}}^{\mathsf T}A\boldsymbol{x}$。

第三步，回到原等式 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，两边左乘行向量 $\bar{\boldsymbol{x}}^{\mathsf T}$，得



$$
\bar{\boldsymbol{x}}^{\mathsf T}A\boldsymbol{x}
=\lambda\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}.
$$



两个式子左端相同，比较右端得



$$
(\lambda-\bar\lambda)\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=0.
$$



第四步，说明 $\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}\neq 0$。设 $\boldsymbol{x}$ 的分量为 $x_i=a_i+\mathrm{i}b_i$，则



$$
\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}
=\sum_{i=1}^{n}\bar x_i x_i
=\sum_{i=1}^{n}(a_i^{2}+b_i^{2}).
$$



逐个乘开：$(a_i-\mathrm{i}b_i)(a_i+\mathrm{i}b_i)=a_i^{2}+b_i^{2}$，两个虚部 $-\mathrm{i}a_ib_i$ 与 $+\mathrm{i}a_ib_i$ 抵消。这正是复数向量的长度平方。实数时长度平方是 $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}=\sum x_i^{2}$；换成复数，每个分量必须乘自己的共轭，结果才保证是非负实数。只要 $\boldsymbol{x}\neq\boldsymbol{0}$（特征向量按定义不为零），这个和就严格大于零。于是可以约掉，得到 $\lambda=\bar\lambda$；一个数等于自己的共轭，说明虚部为零，$\lambda$ 是实数。

最后清点对称性的用武之地。若 $A$ 是复矩阵，转置那一步应写成 $\bar A^{\mathsf T}$；能让第二步直接接上第三步的，正是 $\bar A^{\mathsf T}=A$。对实矩阵 $\bar A=A$，条件退化为 $A^{\mathsf T}=A$，即对称。所以“好矩阵”的一般版本是满足 $\bar A^{\mathsf T}=A$ 的复矩阵（下一讲系统处理）；应用里绝大多数矩阵是实的，此时“好”就等于“对称”。

![视频 00:11:13：课堂板书](</attachments/mit1806-2902ebe1488ef44f551e5bff.jpg>)

*视频 00:11:13｜约对应第 2 节「2. 特征值为什么是实数」附近。*

![视频 00:16:40：课堂板书](</attachments/mit1806-d94ce77552c9fff5de0d0a9f.jpg>)

*视频 00:16:40｜约对应第 2 节「2. 特征值为什么是实数」附近。*

## 3. 谱定理的另一面：投影矩阵的加权和

上一节把 $A=Q\Lambda Q^{\mathsf T}$ 当成一个整体等式。现在把乘法拆开看它由什么搭成。按“列乘行”展开：$Q\Lambda$ 的第 $i$ 列是 $\lambda_i\boldsymbol{q}_i$，再乘 $Q^{\mathsf T}$（它的第 $i$ 行是 $\boldsymbol{q}_i^{\mathsf T}$），得到



$$
A=\sum_{i=1}^{n}\lambda_i\,\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}.
$$



每一项 $\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$ 都是一个 $n\times n$ 矩阵，身份很特殊。第 15 讲给出的投影公式是 $P=B(B^{\mathsf T}B)^{-1}B^{\mathsf T}$；把这里的 $B$ 取成单独一列 $\boldsymbol{q}_i$，长度为 $1$，于是 $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i=1$，分母消失：



$$
P_i=\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}.
$$



这正是投影到 $\boldsymbol{q}_i$ 所在直线上的**投影矩阵**（projection matrix）。它对称，而且再投影一次没有变化：



$$
P_i^{2}
=\boldsymbol{q}_i(\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i)\boldsymbol{q}_i^{\mathsf T}
=\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}
=P_i .
$$



又因为 $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$ 互相垂直，这些投影投向的直线也互相垂直。于是谱定理有了第二种说法：**每个对称矩阵都是若干个互相垂直的投影矩阵的加权和，权重就是特征值。** 权重为负的项，表示在那个方向上把分量反向。有人更喜欢用这个版本来记谱定理：它把矩阵拆成“纯方向”的贡献，每一项只描述一个方向上的作用。

## 4. 主元的符号分布对应特征值的符号分布

知道特征值都是实数之后，下一个问题是它们的正负。为什么关心正负：在微分方程 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$ 里，特征值为负则解衰减、系统稳定，特征值为正则解发散，符号直接对应稳定与不稳定。

麻烦在于，判断符号不该靠把特征值算出来。一个 $50$ 阶对称矩阵有 $50$ 个特征值；若按“求 $\det(A-\lambda I)$ 的根”来做，就要展开一个 $50$ 次多项式再求根。手工当然做不到；交给计算机也不可靠——高次多项式对系数的微小扰动极度敏感，算出的 $50$ 个根很不可信。可见“用特征多项式求根”只是 $2\times2$、$3\times3$ 的好办法，不是一般矩阵的好办法。而消元只做除法与减法，在计算机上瞬间完成，主元算得又快又稳。

本讲的一个漂亮事实是：对对称矩阵，**正主元的个数等于正特征值的个数，负主元的个数等于负特征值的个数**。注意主元与特征值本身并不相等，吻合的只是符号与个数；唯一能事先断言的相等关系是乘积——按顺序消元、不做行交换时，$n$ 个主元之积等于行列式，而 $n$ 个特征值之积也等于行列式，所以两者乘积相同。但那只是一个总数，上面的事实给出的是逐个符号的分布。例如一个 $50$ 阶对称矩阵，若数出 $28$ 个正主元、$22$ 个负主元，就可以断定它有 $28$ 个正特征值、$22$ 个负特征值，而无需算出其中任何一个。

这条事实还能用来“定位”特征值。把矩阵平移：$A-7I$ 与 $A$ 有相同的特征向量，特征值则整体减去 $7$。于是数一数 $A-7I$ 有几个正主元，就知道原矩阵有多少个特征值大于 $7$，其余的都小于 $7$。换几个平移量，$50$ 个特征值就被分别框进若干区间，这是求特征值的一个可靠起点。

![官方讲义摘要 第 2/3 页](</attachments/mit1806-586a88a3b8d4f772f0b3171a.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 25 Summary，CC BY-NC-SA 4.0）。*

![视频 00:23:06：课堂板书](</attachments/mit1806-5f9087f55c5f6df9619b58d5.jpg>)

*视频 00:23:06｜约对应第 4 节「4. 主元的符号分布对应特征值的符号分布」附近。*

![视频 00:28:31：课堂板书](</attachments/mit1806-9f5f0f2385e45a40110c1354.jpg>)

*视频 00:28:31｜约对应第 4 节「4. 主元的符号分布对应特征值的符号分布」附近。*

## 5. 正定矩阵

对称矩阵已经是“好”矩阵，**正定矩阵**是其中“极好”的一类。

**定义：一个对称矩阵称为正定矩阵，如果它的所有特征值都是正数。**

由上一节的事实立刻得到第一个等价条件：**所有主元都是正数**。这正是实际使用的判据——不必求特征值，做一遍消元看主元的符号即可。

例子是



$$
A=\begin{bmatrix}
5&2\\
2&3
\end{bmatrix}.
$$



它对称，特征值必为实数。第一个主元是 $5$；第二个主元不必单独算，因为主元之积等于行列式：



$$
\det A=5\cdot 3-2\cdot 2=11,
\qquad
\text{第二个主元}=\frac{11}{5}.
$$



两个主元 $5$ 与 $11/5$ 都为正，所以两个特征值都为正，$A$ 正定。

再用特征值对照。迹为 $5+3=8$，行列式为 $11$，特征方程是



$$
\lambda^{2}-8\lambda+11=0,
$$



解为



$$
\lambda=\frac{8\pm\sqrt{64-44}}{2}=4\pm\sqrt{5},
$$



约为 $6.24$ 与 $1.76$，确实都是正数。比较一下代价：主元是两个简单分数 $5$、$11/5$，特征值带根号；判断正负只需要前者。在微分方程里，知道符号就足以判断稳定，所以主元判据远比求特征值经济。这两个特征值不相等，按事实二，它们对应的特征向量落在两条互相垂直的直线上。

**行列式为正并不够。** 一个常见的错觉是“$\det A=\lambda_1\lambda_2>0$，所以两个特征值同为正”。符号相同的两个数乘积当然为正，但“同负”也满足。看一个反例：某个对称矩阵的第一个主元是 $-1$，而整体行列式是 $3$，是一个正数。由主元之积等于行列式，第二个主元是 $-3$。两个主元都负，按上一节的符号事实，两个特征值也都为负。这个矩阵行列式为正，却显然不正定。

所以检查要“从小到大”走一遍。除了整个矩阵的行列式，还要检查左上角各阶子矩阵的行列式——$1\times1$ 的、$2\times2$ 的，直到 $n\times n$ 的，它们称为**顺序主子式**。正定的判据是：**所有顺序主子式都为正**。这条链的两端很好认：一阶顺序主子式就是第一个主元，$n$ 阶顺序主子式就是整个行列式，中间各阶正好补上“逐步长出来”的检验，主元与行列式因此被连成一条。

用例子核对：$A$ 的一阶顺序主子式是 $5>0$，二阶是 $11>0$，通过；反例在一阶就失败，因为 $-1<0$，尽管二阶的 $3>0$ 满足“整体行列式为正”。判据里用“所有”，原因就在这里：它要求 $n$ 个数全部为正，而不是只看最后那个大的行列式。

![视频 00:32:54：课堂板书](</attachments/mit1806-efd53e29d7863e5284ae741e.jpg>)

*视频 00:32:54｜约对应第 5 节「5. 正定矩阵」附近。*

![视频 00:34:13：课堂板书](</attachments/mit1806-061c8d50e8cffb86944b36a0.jpg>)

*视频 00:34:13｜约对应第 5 节「5. 正定矩阵」附近。*

## 6. 三条线索汇合

正定矩阵是本讲的高潮，不是因为又多了一个定义，而是因为它让课程里三条原本分开的线索合成一件事：

- 第一周的**主元**：消元过程中出现的 $n$ 个数；
- 课程中段的**行列式**：从左上角一路取下来的 $n$ 个顺序主子式；
- 最近几讲的**特征值**：$n$ 个实特征值。

对对称矩阵，这三组数可以互相判定：特征值全正、主元全正、顺序主子式全正，三者互为等价。任何一组全为正，另外两组也全为正；任何一组出现负号，另外两组也一定出问题。换句话说，“正定”可以用三种完全不同的语言说出来，而它们说的是同一件事。这也是本讲标题把“对称”与“正定”并列的原因：对称保证特征值落在实数轴上，正定再把这组实数的符号钉死。

后面的路线也由此清楚：下一讲把同样的想法推广到复矩阵与快速傅里叶变换，课程最后的高潮则是把所有的线索汇合到一般的 $n$ 阶方阵——不要求对称。

![官方讲义摘要 第 3/3 页](</attachments/mit1806-840ecab00e5aa62294c1f4ac.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 25 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **对称矩阵**（symmetric matrix）满足 $A=A^{\mathsf T}$。两条基本事实：特征值全是实数；特征向量可以选成一组完整且标准正交的向量。
- “可以选成”不能省：单位矩阵的每个非零向量都是特征向量；特征值重复时对应的是一整张平面，平面内总能挑出互相垂直的一组。
- **谱定理**：对称矩阵可写成 $A=Q\Lambda Q^{\mathsf T}$，$Q$ 的列标准正交、$Q^{-1}=Q^{\mathsf T}$；对整个乘积转置会原样返回，所以这个形式自动对称，反过来也刻画了对称矩阵。
- 特征值为实的证明：由 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 取共轭得 $A\bar{\boldsymbol{x}}=\bar\lambda\bar{\boldsymbol{x}}$；转置并右乘 $\boldsymbol{x}$，用 $A^{\mathsf T}=A$，再与原式左乘 $\bar{\boldsymbol{x}}^{\mathsf T}$ 的结果对比，得 $(\lambda-\bar\lambda)\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=0$，而 $\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=\sum(a_i^{2}+b_i^{2})>0$。
- 复矩阵情形的“好”条件是 $\bar A^{\mathsf T}=A$，实对称只是它的实特例；对称性只在把 $A^{\mathsf T}$ 换成 $A$ 的那一步用到。
- **谱分解**：$A=\sum_i\lambda_i\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$；每个 $\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$ 是投影到 $\boldsymbol{q}_i$ 方向的投影矩阵，满足 $P_i^{2}=P_i$，且投向的方向两两垂直。
- 对称矩阵的正主元个数等于正特征值个数，负主元个数亦然；两者乘积相等，是因为主元之积与特征值之积都等于行列式。
- 用平移 $A-7I$（特征值整体减 $7$）数主元的符号，可以统计原矩阵有多少个特征值大于 $7$。
- **正定矩阵**：对称且所有特征值为正；等价于所有主元为正，也等价于所有**顺序主子式**为正。
- 例子 $A=\begin{bmatrix}5&2\\2&3\end{bmatrix}$：主元 $5$、$11/5$ 皆正，特征值 $4\pm\sqrt{5}\approx 6.24,\,1.76$ 皆为正；反例的第一个主元为 $-1$、整体行列式为 $3$，于是第二个主元为 $-3$，两个特征值都负——整体行列式为正不能保证正定。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| symmetric matrix | 对称矩阵 | 满足 $A=A^{\mathsf T}$ 的实矩阵，特征值为实、特征向量可选成互相垂直 |
| spectral theorem | 谱定理 | 对称矩阵的分解 $A=Q\Lambda Q^{\mathsf T}$，$Q$ 的列标准正交 |
| principal axis theorem | 主轴定理 | 谱定理在力学中的名称：换到主轴后矩阵成对角形，各方向互不耦合 |
| spectrum | 谱 | 矩阵的特征值全体，名字借自光谱的分解 |
| orthonormal | 标准正交 | 两两正交且长度都为 $1$ 的一组向量 |
| orthogonal matrix | 正交矩阵 | 列向量标准正交的方阵 $Q$，满足 $Q^{\mathsf T}Q=I$，故 $Q^{-1}=Q^{\mathsf T}$ |
| projection matrix | 投影矩阵 | 形如 $\boldsymbol{q}\boldsymbol{q}^{\mathsf T}$ 的对称幂等矩阵，把向量投到 $\boldsymbol{q}$ 所在直线 |
| complex conjugate | 复共轭 | 把 $a+\mathrm{i}b$ 变成 $a-\mathrm{i}b$；证明实特征值时用来消去虚部 |
| pivot | 主元 | 消元中用来消去下方元素的关键数；对称矩阵主元的符号个数与特征值一致 |
| positive definite | 正定 | 对称且所有特征值为正，等价于所有主元、所有顺序主子式为正 |
| leading principal minor | 顺序主子式 | 左上角 $1\times1$ 到 $n\times n$ 各阶子矩阵的行列式，全部为正则矩阵正定 |
| determinant | 行列式 | 主元之积与特征值之积都等于它，但仅凭它为正不能判定正定 |

---

[← Lecture 24b](/notes/mit-1806/lec24b) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 26 →](/notes/mit-1806/lec26)
