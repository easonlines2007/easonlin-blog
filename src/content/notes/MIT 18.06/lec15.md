---
title: Lecture 15 · 子空间上的投影
description: 推导投影公式，理解投影为什么给出最佳逼近。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 16
tags:
  - lineal algebra
status: completed
publish: true
---

> *Projections onto subspaces* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 15 讲 / 共 35 讲** ｜ 第二部分 · 正交性与行列式

**本讲视频**：[Bilibili p15 · 子空间上的投影](https://www.bilibili.com/video/BV1ix411f7Yp?p=15)（48:51）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-15-projections-onto-subspaces/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=15&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲画出了四个基本子空间的正交地图：零空间与行空间正交，左零空间与列空间正交。那是在描述空间的结构，本讲第一次拿它来解题——当 $A\boldsymbol{x}=\boldsymbol{b}$ 无解时，用正交性找出一个"最接近"的可解问题，并把它解出来。

无解的方程组长什么样？最常见的情形是方程个数多于未知数个数。比如用三个数据点去定一条只有两个参数的直线，三个方程互相矛盾，没有任何一条直线同时穿过这三点。精确解既然不存在，就退一步求最好的近似：把右端向量 $\boldsymbol{b}$ 换到列空间里去，换成列空间中离 $\boldsymbol{b}$ 最近的那个向量 $\boldsymbol{p}$，再解 $A\hat{\boldsymbol{x}}=\boldsymbol{p}$。这个 $\hat{\boldsymbol{x}}$ 就是"最好的可能解"。

后面的一切都从同一个条件出发：从投影点指向 $\boldsymbol{b}$ 的误差向量，垂直于投影所在的那个子空间。"最近"是个几何说法，一旦翻译成"误差与子空间正交"，它就变成了一个可以直接求解的线性方程。沿这条线索，本讲先把向量投影到一条直线，得到三个一维公式；再投影到平面直至 $n$ 维列空间，得到投影矩阵 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$；最后用三个数据点拟合直线，把公式推向实际数据。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-752af84538aada9966ec2e74.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 15 Summary，CC BY-NC-SA 4.0）。*

## 1. 投影到一条直线

设 $\boldsymbol{a}$ 是非零向量，它张成一条过原点的直线，这是 $\mathbb{R}^m$ 中的一维子空间。给定向量 $\boldsymbol{b}$，它通常不在这条直线上。问：直线上哪个点离 $\boldsymbol{b}$ 最近？

把最近点记作 $\boldsymbol{p}$，它就是 $\boldsymbol{b}$ 在直线上的垂足，连线 $\boldsymbol{b}-\boldsymbol{p}$ 与直线成直角。整讲的关键就是这个直角。它不是画图时的偶然现象，而是唯一能把"最近"写成方程的条件。

$\boldsymbol{p}$ 在直线上，因此是 $\boldsymbol{a}$ 的某个倍数：



$$
\boldsymbol{p}=x\boldsymbol{a}.
$$



问题归结为求这一个数 $x$。$\boldsymbol{p}$ 称为 $\boldsymbol{b}$ 在直线上的**投影**（projection），误差向量则是



$$
\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}=\boldsymbol{b}-x\boldsymbol{a},
$$



它垂直于直线，也就是垂直于 $\boldsymbol{a}$。用内积表达"垂直"，得到本讲的中心方程



$$
\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0.
$$



展开：



$$
\boldsymbol{a}^{\mathsf T}\boldsymbol{b}-x\,\boldsymbol{a}^{\mathsf T}\boldsymbol{a}=0,
\qquad\text{即}\qquad
x=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



两个量都是数：$\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$ 是两个向量的内积，$\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$ 是 $\boldsymbol{a}$ 与自己的内积，等于 $\boldsymbol{a}$ 长度的平方。所以 $x$ 是两个数之比，这个推导与维数无关，二维、三维、$m$ 维都一样。

投影本身是



$$
\boldsymbol{p}=x\boldsymbol{a}=\boldsymbol{a}\,\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



若改用三角学做同一件事，就要引入 $\boldsymbol{a}$ 与 $\boldsymbol{b}$ 的夹角 $\theta$，一路写长度、正弦和余弦，公式笨重而且不易推广。内积把角度信息吸收掉了：$\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$ 里已经含有 $\cos\theta$ 的效果，但公式本身只在向量之间做内积和数乘，一个角也不出现。

这个结果还有一层结构性含义：它把 $\boldsymbol{b}$ 拆成了两块，



$$
\boldsymbol{b}=\boldsymbol{p}+\boldsymbol{e},
$$



其中 $\boldsymbol{p}$ 在直线上，$\boldsymbol{e}$ 与直线正交。两块互不重叠、合起来正好是原来的 $\boldsymbol{b}$。若 $\boldsymbol{b}$ 本来就在直线上，则误差为零、投影就是它自己；$\boldsymbol{b}$ 离直线越远，$\boldsymbol{e}$ 越长。投影要做的，就是把这个"正交于直线的分量"完整地剥出来。

> 编者注：垂足为什么就是最近点，用勾股定理即可看清。取直线上另一点 $\boldsymbol{q}$，则 $\boldsymbol{b}-\boldsymbol{q}=(\boldsymbol{b}-\boldsymbol{p})+(\boldsymbol{p}-\boldsymbol{q})$，右端两项相互垂直，于是 $\|\boldsymbol{b}-\boldsymbol{q}\|^{2}=\|\boldsymbol{b}-\boldsymbol{p}\|^{2}+\|\boldsymbol{p}-\boldsymbol{q}\|^{2}$，只要 $\boldsymbol{q}\ne\boldsymbol{p}$ 就一定比 $\boldsymbol{p}$ 更远。正交条件因此确实刻画了最近点。

![视频 00:04:53：课堂板书](</attachments/mit1806-fb6698aa5218d6fbe14d3aeb.jpg>)

*视频 00:04:53｜约对应第 1 节「1. 投影到一条直线」附近。*

## 2. 投影矩阵

第一节的公式换一种括号读法，就会出现新对象。把标量因子挪到向量前面：



$$
\boldsymbol{p}=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}\,\boldsymbol{a}
=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}\,\boldsymbol{b}.
$$



两种写法数值上完全相同，矩阵意义却不同。分子 $\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$ 是行乘列，是一个数；分子 $\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$ 是列乘行，是一个 $m\times m$ 矩阵，行列数都等于 $\boldsymbol{a}$ 的维数。分母 $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$ 仍是数，所以整个分式是一个矩阵，它作用在 $\boldsymbol{b}$ 上就产生投影。这个矩阵称为**投影矩阵**（projection matrix），记作 $P$：



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}},
\qquad
\boldsymbol{p}=P\boldsymbol{b}.
$$



用两个小试验可以检验这个公式。把 $\boldsymbol{b}$ 换成 $2\boldsymbol{b}$：分子多出一个因子 $2$，投影也变成 $2\boldsymbol{p}$，输入加倍输出加倍，与"沿同方向走得越远、垂足也越远"相符。把 $\boldsymbol{a}$ 换成 $2\boldsymbol{a}$：直线没有变，投影就不该变。公式里分子出现因子 $4$，分母也出现因子 $4$，上下抵消，投影仍是原来的 $P\boldsymbol{b}$。这说明投影只依赖直线本身，与用来描述这条直线的向量长度无关。

$P$ 有三条值得记住的性质。

第一条，$P$ 的秩（rank）为 $1$。$\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$ 是一列乘一行，正是**秩 1 矩阵**（rank-one matrix）的标准形状，那一列就是列空间的基。由此 $P$ 的**列空间**（column space）就是 $\boldsymbol{a}$ 张成的那条直线：任取 $\boldsymbol{b}$，$P\boldsymbol{b}$ 都落在直线上。这与定义必须一致——矩阵的列空间是"乘任何向量后能落到的空间"，而投影的落点只能是那条线。

第二条，$P$ 是**对称矩阵**（symmetric matrix）：



$$
P^{\mathsf T}=P.
$$



因为转置 $\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$ 得到的是它自己，分母是数，转置不改变它。

第三条，$P^2=P$。理由全在一个画面里：任取 $\boldsymbol{b}$，$P\boldsymbol{b}$ 已经落在直线上；把直线上的点再投影一次，它待在原处不动。所以对任意 $\boldsymbol{b}$ 都有 $P(P\boldsymbol{b})=P\boldsymbol{b}$，也就是 $P^2=P$。"平方等于自己"正是"投影两次等于投影一次"的代数写法。

对称与 $P^2=P$ 这两条合起来，就是判断一个矩阵是不是投影矩阵的标志，后面的高维投影矩阵都要接受这两项检查。

一维情形至此有了三个公式，它们是 $n$ 维公式的原型：



$$
x=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}},
\qquad
\boldsymbol{p}=x\boldsymbol{a},
\qquad
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



要注意区分投影 $\boldsymbol{p}$（向量）与投影矩阵 $P$（矩阵）：后者作用在 $\boldsymbol{b}$ 上才得到前者。公式里分子是一列乘一行、分母是数，看起来像分数，实际上不能把分子分母"约"成一个数。

![视频 00:11:44：课堂板书](</attachments/mit1806-cfb0b9b69397877863a7d30a.jpg>)

*视频 00:11:44｜约对应第 2 节「2. 投影矩阵」附近。*

![视频 00:14:39：课堂板书](</attachments/mit1806-c3b42fba2b1581a4bab8ddef.jpg>)

*视频 00:14:39｜约对应第 2 节「2. 投影矩阵」附近。*

## 3. 为什么需要投影

投影不是为了把图画得好看，而是为了解决 $A\boldsymbol{x}=\boldsymbol{b}$ 可能无解的问题。

当 $A$ 的行数多于列数时，方程个数多于未知数个数，条件过多，通常互相矛盾。从列视图看得很清楚：$A\boldsymbol{x}$ 永远是 $A$ 各列的一个线性组合，所以无论 $\boldsymbol{x}$ 怎么取，$A\boldsymbol{x}$ 都落在列空间 $C(A)$ 里；而 $\boldsymbol{b}$ 一般不在这个空间中。要求 $A\boldsymbol{x}=\boldsymbol{b}$，等于要求列空间里的某个向量恰好等于列空间外的 $\boldsymbol{b}$，这做不到。

精确的要求做不到，就修改要求：在 $C(A)$ 中找离 $\boldsymbol{b}$ 最近的向量 $\boldsymbol{p}$，然后解



$$
A\hat{\boldsymbol{x}}=\boldsymbol{p}.
$$



这个方程一定有解，因为 $\boldsymbol{p}$ 本来就是按列空间里的向量构造的。解出的 $\hat{\boldsymbol{x}}$ 不是原方程的解——原方程根本没有解——而是"最好的可能解"。头上加一顶帽子，正是为了与那个并不存在的精确解区分开。而 $\boldsymbol{p}$ 的求法，就是把 $\boldsymbol{b}$ 投影到列空间 $C(A)$ 上。换句话说，$\boldsymbol{p}$ 是"用 $A\boldsymbol{x}$ 这种形式真正能凑出来、并且离 $\boldsymbol{b}$ 最近"的那个向量。

所以投影的价值在于：它把一个无解的问题换成一个有解的、并且尽可能接近原问题的问题。这条思路在下一讲发展成**最小二乘**（least squares）：数据拟合中所谓的"最好"，正是用这种投影定义出来的。

这里的推理顺序值得记住：先承认原方程不可解，再问"哪个可解的问题离它最近"，最后才动用投影的公式。先有要解决的困难，后有工具。换个角度说，$\boldsymbol{b}$ 落在 $C(A)$ 之外的那一部分，是任何 $\boldsymbol{x}$ 都消不掉的；投影做的事，就是把这部分单独认出来、放到一边，剩下的部分交给 $A\boldsymbol{x}$ 去精确匹配。一维的直线投影只是最简单的练习场，真正要用的场合是列空间。

## 4. 投影到平面：一般子空间

现在升到三维：给定一个过原点的平面和平面外的一个向量 $\boldsymbol{b}$，求 $\boldsymbol{b}$ 在平面上的投影 $\boldsymbol{p}$。

要算就得先把平面描述出来。最自然的描述是给一组基：取平面内两个线性无关的向量 $\boldsymbol{a}_1$ 和 $\boldsymbol{a}_2$。它们不必正交，只要线性无关，它们的一切线性组合就铺满这个平面。把这两个向量按列排成矩阵



$$
A=\begin{bmatrix}\boldsymbol{a}_1&\boldsymbol{a}_2\end{bmatrix},
$$



平面就是 $A$ 的列空间 $C(A)$。这一步把几何问题翻译成了矩阵问题：投影到平面就是投影到 $C(A)$，而从两列推广到 $n$ 列不需要任何新的想法。

投影点 $\boldsymbol{p}$ 在平面内，所以它是两列的组合：



$$
\boldsymbol{p}=x_1\boldsymbol{a}_1+x_2\boldsymbol{a}_2=A\hat{\boldsymbol{x}},
\qquad
\hat{\boldsymbol{x}}=\begin{bmatrix}x_1\\x_2\end{bmatrix}.
$$



与其把 $x_1\boldsymbol{a}_1+x_2\boldsymbol{a}_2$ 一路写下去，不如记成 $A\hat{\boldsymbol{x}}$：系数打包成向量 $\hat{\boldsymbol{x}}$，基向量打包成矩阵 $A$，组合就写成一次矩阵乘法。这样一来，无论平面由两列还是由 $n$ 列张成，公式的形状完全一样，这也是引入矩阵 $A$ 的用意。

要做的仍然是求组合系数 $\hat{\boldsymbol{x}}$。如果 $\boldsymbol{b}$ 恰好已经在列空间里，投影就是 $\boldsymbol{b}$ 本身，误差为零；但一般情况下误差



$$
\boldsymbol{e}=\boldsymbol{b}-A\hat{\boldsymbol{x}}
$$



不为零。与一维时一样，关键事实是 $\boldsymbol{p}$ 为最近点，故 $\boldsymbol{e}$ 垂直于整个平面。垂直于平面意味着垂直于平面内每一个向量，特别地垂直于两个基向量：



$$
\boldsymbol{a}_1^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=0,
\qquad
\boldsymbol{a}_2^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=0.
$$



未知数有两个，条件也正好两个，方程个数与未知数个数相等，这是一维那一个方程的自然推广。

把两式摞起来写成矩阵。$A^{\mathsf T}$ 的两行恰好是 $\boldsymbol{a}_1^{\mathsf T}$ 与 $\boldsymbol{a}_2^{\mathsf T}$，于是两条方程合成一条：



$$
A^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=\boldsymbol{0}.
$$



用它检查一维退化情形：若 $A$ 只有一列 $\boldsymbol{a}$，上式就是 $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0$，正是第一节的中心方程。可见"投影到子空间"的方程只有一个，一维与高维的差别只在于 $A$ 有几列。

这个方程还可以和四个基本子空间对上。$A^{\mathsf T}\boldsymbol{e}=\boldsymbol{0}$ 说的是 $\boldsymbol{e}$ 落在 $A^{\mathsf T}$ 的零空间中，也就是 $A$ 的**左零空间**（left nullspace）$N(A^{\mathsf T})$。上一讲已经知道，左零空间与列空间互为**正交补**（orthogonal complement）：



$$
N(A^{\mathsf T})\perp C(A).
$$



所以"$\boldsymbol{e}$ 属于左零空间"与"$\boldsymbol{e}$ 垂直于列空间"是同一句话。花了半页纸写出的方程，说的正是几何上那个直角，四个子空间的正交关系保证了它不会算错。

把括号解开，得到投影问题的核心方程



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}.
$$



$A$ 是 $m\times n$ 矩阵，$A^{\mathsf T}A$ 是 $n\times n$ 的方阵；平面上 $n=2$，所以是两个方程两个未知数。一维情形里 $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$ 只是一个数，直接除过去即可；现在它是矩阵，除不了，必须取逆。只要两列线性无关（这是它们能作为平面之基的条件），$A^{\mathsf T}A$ 就可逆，逆矩阵存在；这也解释了为什么高维公式里会出现 $(A^{\mathsf T}A)^{-1}$，而一维公式里只出现分母。

![官方讲义摘要 第 2/3 页](</attachments/mit1806-f271f527db51344c612220bd.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 15 Summary，CC BY-NC-SA 4.0）。*

![视频 00:31:45：课堂板书](</attachments/mit1806-82d11f718d8af9394c5c348e.jpg>)

*视频 00:31:45｜约对应第 4 节「4. 投影到平面：一般子空间」附近。*

## 5. 一般情形的三个公式

照着一维的三条，写出 $n$ 维的三条：



$$
\hat{\boldsymbol{x}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b},
\qquad
\boldsymbol{p}=A\hat{\boldsymbol{x}}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b},
\qquad
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



第二条只是把 $\hat{\boldsymbol{x}}$ 代回 $\boldsymbol{p}=A\hat{\boldsymbol{x}}$：$\hat{\boldsymbol{x}}$ 本来就是"列的组合系数"，求出了系数，投影自然由 $A$ 乘上去得到。第三条把 $\boldsymbol{b}$ 前面那一串矩阵打包成一个矩阵，它就是投影矩阵 $P$。对照一维的 $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/(\boldsymbol{a}^{\mathsf T}\boldsymbol{a})$，结构完全相同，只是数 $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$ 换成了矩阵 $A^{\mathsf T}A$，除法换成了求逆。

各部分的尺寸值得核对一遍。$A$ 是 $m\times n$，$A^{\mathsf T}$ 是 $n\times m$，于是 $A^{\mathsf T}A$ 是 $n\times n$ 的方阵，可以取逆；$A^{\mathsf T}\boldsymbol{b}$ 是 $n\times 1$ 向量，所以 $\hat{\boldsymbol{x}}$ 也是 $n\times 1$，正好是 $n$ 个组合系数。$A\hat{\boldsymbol{x}}$ 是 $m\times 1$，回到原来的 $m$ 维空间，投影点必须如此。最后 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 把 $\boldsymbol{b}$ 从 $m$ 维送到 $m$ 维，它是 $m\times m$ 矩阵。一维时 $m$ 任意、$n=1$，这些尺寸退化成数、标量与单个矩阵的关系，看上去就成了第一节那几个公式。

$P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 这个式子容易让人产生一个冲动：既然有"乘积的逆"公式，为什么不干脆把 $(A^{\mathsf T}A)^{-1}$ 拆成 $A^{-1}(A^{\mathsf T})^{-1}$？那样乘积会变成



$$
A\,A^{-1}(A^{\mathsf T})^{-1}A^{\mathsf T}=I,
$$



投影矩阵成了单位矩阵，显然不对。错在哪里？错在 $A$ 不是方阵，它根本没有逆。我们整个问题的前提正是 $A$ 行数多于列数、又高又瘦，只有少数几列却有很多行。$A^{\mathsf T}A$ 确实是方阵、也确实可逆，但 $(A^{\mathsf T}A)^{-1}$ 这个整体不能拆开，拆开就动用了不存在的 $A^{-1}$。所以公式必须保持这个样子。

不过这个"错误"在一种情形下恰好是对的：如果 $A$ 是方阵且可逆，它的列空间就是整个 $\mathbb{R}^m$，投影到全空间什么也不用做，$P$ 本来就该是单位矩阵 $I$。这时 $A^{-1}$ 存在，上面的抵消合法，$P=I$ 正是正确答案。我们的 $A$ 不是这种情形，所以不能抵消。

高维投影矩阵同样满足那两条性质。对称性：



$$
P^{\mathsf T}=\bigl(A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\bigr)^{\mathsf T}
=A\bigl((A^{\mathsf T}A)^{-1}\bigr)^{\mathsf T}A^{\mathsf T}
=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}=P,
$$



最后一步用了 $A^{\mathsf T}A$ 是对称矩阵、其逆也对称。$P^2=P$ 则是一串漂亮的抵消：



$$
P^2=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}A(A^{\mathsf T}A)^{-1}A^{\mathsf T}
=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}=P,
$$



中间的 $A^{\mathsf T}A$ 与它的逆相邻，乘起来是单位矩阵，整串就只剩开头和结尾。几何解释与一维别无二致：第一次投影把向量送进列空间，第二次投影落在列空间内的点上，不再移动。

![视频 00:38:07：课堂板书](</attachments/mit1806-896babfba39648a6e4d96abe.jpg>)

*视频 00:38:07｜约对应第 5 节「5. 一般情形的三个公式」附近。*

![视频 00:39:05：课堂板书](</attachments/mit1806-34f35243a9ecd366ef0d9668.jpg>)

*视频 00:39:05｜约对应第 5 节「5. 一般情形的三个公式」附近。*

## 6. 用数据拟合一条直线

最后把公式用到具体数据上。有三个数据点：$t=1$ 时 $b=1$，$t=2$ 时 $b=2$，$t=3$ 时 $b=2$。这里 $t$ 是横轴（时间），$b$ 是数据点的纵坐标。三点不共线，所以要在平面内找一条直线 $b=C+Dt$，使它整体上最靠近这三点。

直线只有两个参数：截距 $C$ 与斜率 $D$。如果它精确穿过三点，就必须同时满足



$$
C+D=1,\qquad C+2D=2,\qquad C+3D=2.
$$



三个方程、两个未知数，没有解，也就是没有直线同时穿过这三点。换个数据就会不同：若第三个观测值不是 $2$ 而是 $3$，三点恰好共线，方程组立刻有解。正是 $1,2,2$ 这三个数让问题变得不可解。

把方程组写成 $A\boldsymbol{x}=\boldsymbol{b}$，看清哪部分是矩阵、哪部分是未知数、哪部分是右端：



$$
A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}C\\D\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}1\\2\\2\end{bmatrix}.
$$



第一列全是 $1$，对应常数项 $C$；第二列是 $t$ 的取值，对应斜率 $D$。这个 $3\times2$ 矩阵是"高瘦"矩阵的典型：三个方程，两个未知数。把三个观测值竖着排起来，就是右端向量 $\boldsymbol{b}=(1,2,2)$。

既然 $A\boldsymbol{x}=\boldsymbol{b}$ 无解，就改解 $A\hat{\boldsymbol{x}}=\boldsymbol{p}$，其中 $\boldsymbol{p}$ 是 $\boldsymbol{b}$ 在列空间 $C(A)$ 上的投影。$C(A)$ 中的向量都形如 $(C+D,\ C+2D,\ C+3D)$，$C,D$ 取遍所有实数时它们铺成一个过原点的平面；而 $\boldsymbol{b}=(1,2,2)$ 不在这个平面里。代入核心方程



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b},
$$



具体写开是



$$
\begin{bmatrix}1&1&1\\1&2&3\end{bmatrix}
\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}
\hat{\boldsymbol{x}}
=
\begin{bmatrix}1&1&1\\1&2&3\end{bmatrix}
\begin{bmatrix}1\\2\\2\end{bmatrix}.
$$



左边是一个系数矩阵为 $2\times2$ 的方程组，右边是二维向量，解出 $\hat{\boldsymbol{x}}=(C,D)$ 就得到最佳直线。$\boldsymbol{p}=A\hat{\boldsymbol{x}}$ 的三个分量，是这条直线在 $t=1,2,3$ 处的取值；$\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$ 的三个分量，是三个数据点到直线的竖直偏差。投影挑出的这一组系数，使三个偏差都尽可能小，而不是让其中某一个为零。

这一讲停在把方程摆好的位置：全部推导都用字母完成，具体数值的解留到下一讲。但结构已经清楚：一个 $3\times2$ 的无解方程组，被换成了 $2\times2$ 的有解方程组 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$，两者之间的桥梁就是 $\boldsymbol{b}$ 到 $C(A)$ 的投影。只要方程个数多于未知数个数，这条替换的路子就适用。

![视频 00:43:58：课堂板书](</attachments/mit1806-6505daa6998ec9eea1b05f61.jpg>)

*视频 00:43:58｜约对应第 6 节「6. 用数据拟合一条直线」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-56d78ffbf83679d46f93f7a8.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 15 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **投影**（projection）解决的是"在子空间中找离给定向量最近的点"，其判别条件是误差向量 $\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$ 与整个子空间正交。
- 投影到 $\boldsymbol{a}$ 张成的直线：中心方程 $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0$，解得 $x=\dfrac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$，投影为 $\boldsymbol{p}=x\boldsymbol{a}$。
- 投影矩阵 $P=\dfrac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$ 是 $m\times m$ 矩阵，秩为 $1$，列空间就是那条直线；它满足 $P^{\mathsf T}=P$ 与 $P^2=P$。
- 把 $\boldsymbol{b}$ 加倍则投影加倍；把 $\boldsymbol{a}$ 加倍则投影不变，因为分子分母各出现因子 $4$ 相互抵消，直线本身没有变。
- 需要投影的动机是：$A\boldsymbol{x}=\boldsymbol{b}$ 方程多于未知数时通常无解，$A\boldsymbol{x}$ 只能落在列空间里，于是用列空间中最接近的 $\boldsymbol{p}$ 代替 $\boldsymbol{b}$，改解 $A\hat{\boldsymbol{x}}=\boldsymbol{p}$。
- 投影到一般列空间：误差正交于每一列，得 $A^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=\boldsymbol{0}$，即 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$；$A^{\mathsf T}A$ 是 $n\times n$ 方阵。
- $\boldsymbol{e}\in N(A^{\mathsf T})$ 与 $N(A^{\mathsf T})\perp C(A)$ 是同一件事的两种说法，投影方程恰好写出了这个正交关系。
- 三个 $n$ 维公式：$\hat{\boldsymbol{x}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b}$，$\boldsymbol{p}=A\hat{\boldsymbol{x}}$，$P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$；不能拆开 $(A^{\mathsf T}A)^{-1}$，因为 $A$ 不是方阵。若 $A$ 可逆方阵，$P=I$ 才是正确答案。
- $n$ 维投影矩阵同样满足 $P^{\mathsf T}=P$ 与 $P^2=P$，后者由中间的 $A^{\mathsf T}A$ 与它的逆矩阵抵消得到。
- 拟合三点 $(1,1)$、$(2,2)$、$(3,2)$ 的直线 $b=C+Dt$ 给出 $3\times2$ 的无解方程组，需求解的是 $2\times2$ 的 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| projection | 投影 | 子空间中离给定向量最近的点，误差与该子空间正交 |
| projection matrix | 投影矩阵 | 把任意向量送到子空间上的矩阵 $P$，满足 $P^{\mathsf T}=P$、$P^2=P$ |
| error vector | 误差向量 | $\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$，投影问题中垂直于目标子空间 |
| symmetric matrix | 对称矩阵 | 满足 $A^{\mathsf T}=A$ 的矩阵，投影矩阵必是对称的 |
| rank-one matrix | 秩 1 矩阵 | 一列乘一行得到的矩阵，投影到直线时出现 |
| column space | 列空间 | 矩阵各列的一切线性组合，投影的目标空间 |
| left nullspace | 左零空间 | $A^{\mathsf T}$ 的零空间 $N(A^{\mathsf T})$，与列空间正交 |
| orthogonal complement | 正交补 | 与给定子空间中每个向量都正交的全体向量 |
| least squares | 最小二乘 | 用投影处理无解方程组、求最佳近似的整套方法 |
| line fitting | 直线拟合 | 用 $b=C+Dt$ 逼近一组数据点，导出 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$ |

---

[← Lecture 14](/notes/mit-1806/lec14) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 16 →](/notes/mit-1806/lec16)
