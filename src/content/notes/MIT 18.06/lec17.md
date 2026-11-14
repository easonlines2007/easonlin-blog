---
title: Lecture 17 · 正交矩阵与 Gram-Schmidt 正交化
description: 用 Gram-Schmidt 把一组基变成标准正交基，理解 QR 分解。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 18
tags:
  - lineal algebra
status: completed
publish: true
---

> *Orthogonal matrices and Gram-Schmidt* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 17 讲 / 共 35 讲** ｜ 第二部分 · 正交性与行列式

**本讲视频**：[Bilibili p17 · 正交矩阵与 Gram-Schmidt 正交化](https://www.bilibili.com/video/BV1ix411f7Yp?p=17)（49:25）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-17-orthogonal-matrices-and-gram-schmidt/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=17&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

正交性这一章到本讲收尾。前面已经处理过两种"正交"：两个向量的**内积**（inner product）为零，以及一个子空间与另一个子空间处处垂直（行空间与零空间就是一对）。本讲把正交从"两个"推广到"一组"：若一组基中的每个向量都与其余所有向量垂直，并且每个向量都被缩成长度为 $1$ 的单位向量，这组基就叫**标准正交基**（orthonormal basis）。把标准正交向量按列排成矩阵 $Q$，会得到这一章最干净的一个等式：$Q^{\mathsf T}Q=I$。

本讲分两半。前一半说明这个等式为什么值得追求。**投影矩阵**（projection matrix）本来是 $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$，要求逆；换成标准正交的 $Q$ 之后，中间的 $Q^{\mathsf T}Q$ 就是 $I$，投影矩阵立刻退化成 $QQ^{\mathsf T}$。**最小二乘**（least squares）的核心方程 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$ 同样退化，左边变成单位矩阵，解直接是 $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$——每个分量只是一个内积，一次求逆都不需要。这也是数值线性代数大量围绕标准正交向量组织起来的原因：长度被钉死为 $1$，分量不会越算越大或越算越小，既不会溢出也不会下溢。

后一半解决"手上没有标准正交基怎么办"。给定一组**线性无关**（linearly independent）但方向随意的向量，**格拉姆-施密特**（Gram-Schmidt）正交化逐个方向地修正：保留第一个方向，把第二个向量中沿第一个方向的分量减掉，再把第三个向量中沿前两个方向的分量都减掉，最后把每个向量除以自己的长度。整个过程写成矩阵就是 $A=QR$：$Q$ 的列标准正交，$R$ 是**上三角矩阵**（upper triangular matrix）。这与消元导出 $A=LU$ 处在同一层次——消元把矩阵做成三角形，格拉姆-施密特把矩阵做成"标准正交列矩阵乘上三角矩阵"。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-1410fff9d653a5e1b2da5534.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 17 Summary，CC BY-NC-SA 4.0）。*

## 1. 标准正交向量组与 $Q^{\mathsf T}Q=I$

本节要回答的问题是：怎样用一条矩阵等式概括"一组向量两两垂直且都是单位长度"。

设向量组 $\boldsymbol{q}_1,\boldsymbol{q}_2,\dots,\boldsymbol{q}_n$。习惯上用字母 $q$ 表示这一族向量，因为它提示这些向量两两正交，而不是随意挑出来的一堆向量。标准正交包含两个要求，分别对应两条条件：



$$
\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j=
\begin{cases}
0, & i\neq j,\\
1, & i=j.
\end{cases}
$$



第一条是**正交**（orthogonal）：任意两个不同的向量内积为零，方向互成九十度。第二条是单位长度：$\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i=\|\boldsymbol{q}_i\|^2=1$。一个向量当然不会和自己正交，所以对角位置必须单独规定成 $1$；"正交"加上"单位化"，合起来称为**标准正交**（orthonormal）。只满足第一条的基叫正交基，两条都满足才叫标准正交基；本讲使用的都是后者。

把这 $n$ 个向量依次放进矩阵 $Q$ 的列。$Q$ 不一定是方阵——比如两个标准正交向量放在四维空间里，$Q$ 就是 $4\times2$ 的。现在计算 $Q^{\mathsf T}Q$：$Q^{\mathsf T}$ 的第 $i$ 行是 $\boldsymbol{q}_i^{\mathsf T}$，$Q$ 的第 $j$ 列是 $\boldsymbol{q}_j$，所以乘积的第 $(i,j)$ 个元素就是 $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$。上面两条条件把每个位置都定死了：对角线上是 $1$，其余位置是 $0$。于是



$$
Q^{\mathsf T}Q=I .
$$



这是一次"行乘列"的乘法：$Q^{\mathsf T}Q$ 把所有的内积一次性问了一遍，而标准正交给出的是所有可能答案里最好的那一个——**单位矩阵**（identity matrix）。回想这一章里反复出现的 $A^{\mathsf T}A$，它记录的正是各列之间的全部内积；$Q^{\mathsf T}Q=I$ 说明当列标准正交时，这张内积表退化成了最简形式。

如果 $Q$ 是方阵，结论更强：$Q^{\mathsf T}Q=I$ 说明 $Q^{\mathsf T}$ 就是 $Q$ 的逆，即 $Q^{\mathsf T}=Q^{-1}$。这时左乘、右乘都等于 $I$，$QQ^{\mathsf T}=I$ 也成立。注意这最后一条只对**方阵**成立；长方形矩阵只有 $Q^{\mathsf T}Q=I$，而 $QQ^{\mathsf T}$ 不是 $I$。

术语上有一个值得留意的不对称：$Q$ 的列标准正交时，最贴切的名字本该是"标准正交矩阵"，但约定只把**方阵**称为**正交矩阵**（orthogonal matrix），长方形矩阵则只说"具有标准正交列"。这个习惯没有数学上的理由，记住结论即可：正交矩阵一定是方阵，且 $Q^{\mathsf T}Q=QQ^{\mathsf T}=I$。

还有一条基本事实：标准正交向量必然线性无关。如果某个组合 $c_1\boldsymbol{q}_1+\cdots+c_n\boldsymbol{q}_n=\boldsymbol{0}$，用它和 $\boldsymbol{q}_i$ 做内积，除 $c_i$ 那一项外全部因正交消失，只剩 $c_i=0$。每个系数都必须是零，这组向量就无关。所以"标准正交"比"无关"更强：它保证无关，还额外管住了长度与角度。

![视频 00:04:56：课堂板书](</attachments/mit1806-7c4671df707a9308ac65d5a9.jpg>)

*视频 00:04:56｜约对应第 1 节「1. 标准正交向量组与 $Q^{\mathsf T}Q=I$」附近。*

![视频 00:09:17：课堂板书](</attachments/mit1806-a62b067fe3d4c0cb2c447dd6.jpg>)

*视频 00:09:17｜约对应第 1 节「1. 标准正交向量组与 $Q^{\mathsf T}Q=I$」附近。*

## 2. 几个必须记住的例子

本节的目的是用具体矩阵把上一节的定义落到实处，同时积累后面会反复用到的模型。

最简单的来源是**置换矩阵**（permutation matrix）：每行每列只有一个 $1$，其余全为零。例如



$$
Q=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}.
$$



它的三列分别是 $\boldsymbol{e}_2,\boldsymbol{e}_3,\boldsymbol{e}_1$，都是单位向量且两两内积为零，所以是正交矩阵。它的转置是另一个置换矩阵，因此也标准正交。用一列一个 $1$ 的办法造标准正交列当然太容易，但它说明了一个要点：标准正交只要求方向和长度，不要求向量"复杂"。

第二个来源是平面上"一个单位向量加上它的垂直方向"。任取角度 $\theta$，



$$
Q=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}.
$$



第一列 $(\cos\theta,\sin\theta)$ 满足 $\cos^2\theta+\sin^2\theta=1$，是单位向量；第二列 $(-\sin\theta,\cos\theta)$ 同样。两列内积为 $-\cos\theta\sin\theta+\sin\theta\cos\theta=0$，所以互相垂直。把 $\theta=\frac{\pi}{4}$ 代进去，再作一点符号调整，就得到最简单的非平凡例子：



$$
\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$



它的两列确实垂直，但每列长度平方是 $1^2+1^2=2$，长度是 $\sqrt2$，所以还不是正交矩阵。修正只需整体除以 $\sqrt2$：



$$
Q=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$



这个"先摆出垂直方向、最后统一除以长度"的次序，正是后面格拉姆-施密特的一般结构。

第三个来源是只含 $\pm1$ 的矩阵，称为 **Hadamard 矩阵**。四阶的例子是把上一个二阶矩阵的模式重复一次，再把其中一块整体取负：



$$
Q=\frac12\begin{bmatrix}
1&1&1&1\\
1&-1&1&-1\\
1&1&-1&-1\\
1&-1&-1&1
\end{bmatrix}.
$$



抽查几对列：第一列与第二列的内积是 $1-1+1-1=0$；第一列与第三列是 $1+1-1-1=0$；第二列与第三列是 $1-1-1+1=0$。每一列都是四个 $\pm1$，长度平方为 $4$，除以 $2$ 之后长度正好为 $1$。这类元素全为 $\pm1$ 的正交矩阵，$2$ 阶、$4$ 阶、$16$ 阶、$64$ 阶等的情形人们知道怎么构造；$5$ 阶不可能存在；还有一些阶是否存在，至今无人知道。

第四个来源是长方形的标准正交列，这是投影与最小二乘真正会遇到的形状。取三维空间中的两个向量



$$
\begin{bmatrix}1\\2\\2\end{bmatrix},
\qquad
\begin{bmatrix}-2\\-1\\2\end{bmatrix}.
$$



它们的内积是 $-2-2+4=0$，各自长度平方都是 $1+4+4=9$，长度为 $3$。因此



$$
Q=\frac13\begin{bmatrix}1&-2\\2&-1\\2&2\end{bmatrix}
$$



是一个 $3\times2$ 的矩阵，$Q^{\mathsf T}Q=I_2$，它的两列是某个二维子空间的标准正交基。若要把它补成 $3\times3$ 的正交矩阵，可以顺着这个符号模式再添一列：取第三列 $(2,-2,1)^{\mathsf T}$，它与前两列的内积分别为 $2-4+2=0$ 和 $-4+2+2=0$，长度平方为 $4+4+1=9$。于是



$$
Q=\frac13\begin{bmatrix}
1&-2&2\\
2&-1&-2\\
2&2&1
\end{bmatrix}
$$



是正交矩阵，所有元素都只需除以 $3$，一个平方根也没出现。这种好运并不常见：一般做格拉姆-施密特时，除以长度必然带出平方根。

![视频 00:18:47：课堂板书](</attachments/mit1806-b93156ff02db0e91f835d670.jpg>)

*视频 00:18:47｜约对应第 2 节「2. 几个必须记住的例子」附近。*

## 3. 标准正交带来的好处：投影与最小二乘

这一节回答动机问题：费力气造标准正交基，换来的究竟是什么。答案是这一章的公式同时变简单。

先看投影。要把向量 $\boldsymbol{b}$ 投影到 $Q$ 的**列空间**（column space）上，前几讲给出的通用公式是



$$
P=Q(Q^{\mathsf T}Q)^{-1}Q^{\mathsf T}.
$$



当 $Q$ 的列标准正交时 $Q^{\mathsf T}Q=I$，中间那个逆整个消失，剩下



$$
P=QQ^{\mathsf T}.
$$



不必再算任何逆，乘积也只是一次"列乘行"的组合。顺手验证投影矩阵必须满足的两条性质。第一条是对称：$(QQ^{\mathsf T})^{\mathsf T}=QQ^{\mathsf T}$，转置把两个因子交换位置并各自转置，最后又回到原样。第二条是"投影两次等于投影一次"：



$$
P^2=(QQ^{\mathsf T})(QQ^{\mathsf T})=Q(Q^{\mathsf T}Q)Q^{\mathsf T}=Q\,I\,Q^{\mathsf T}=QQ^{\mathsf T}=P .
$$



中间那一步把两个 $Q$ 之间的 $Q^{\mathsf T}Q$ 换成 $I$ 就约掉了，依据正是"列标准正交"。

两个极端要分清。如果 $Q$ 是方阵，它的列空间就是整个空间，投影不该移动任何向量，此时 $QQ^{\mathsf T}=I$，这与"方阵时 $Q^{\mathsf T}=Q^{-1}$"一致。如果 $Q$ 是长方形的，$QQ^{\mathsf T}$ 不是 $I$：它是一个作用在整个空间上的矩阵，把向量压到 $Q$ 的 $n$ 维列空间里，一般情况下会改变向量。

再看最小二乘。前几讲的核心方程是**正规方程**（normal equation）



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}.
$$



把 $A$ 换成 $Q$，方程成为 $Q^{\mathsf T}Q\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$，左边是单位矩阵，于是



$$
\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b},
\qquad\text{即}\qquad
\hat{x}_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{b}.
$$



第 $i$ 个系数就是第 $i$ 个基向量与 $\boldsymbol{b}$ 的内积。原来的做法要先把所有内积算出来组成 $A^{\mathsf T}A$，再解一个方程组；现在没有方程组要解，没有矩阵要求逆，每个分量单独算一个点积即可。这是标准正交基最有价值的公式：在标准正交基下，坐标就是投影，就是内积，不需要"解"。

数值上的好处也在这里。标准正交向量的长度永远是 $1$，方向再乱也不会让分量变得极大或极小，计算中既不会溢出，也不会下溢；这正是大量数值线性代数以标准正交向量为基本构件的原因。

![官方讲义摘要 第 2/3 页](</attachments/mit1806-94aa24a4c1c9d5d228b57df5.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 17 Summary，CC BY-NC-SA 4.0）。*

![视频 00:25:31：课堂板书](</attachments/mit1806-bfbfccda6d4d31da15945c77.jpg>)

*视频 00:25:31｜约对应第 3 节「3. 标准正交带来的好处：投影与最小二乘」附近。*

## 4. 格拉姆-施密特：两个向量的情形

剩下的问题是构造：手上只有一组线性无关但方向随意的向量，怎样得到标准正交向量？

先处理两个向量。设 $\boldsymbol{a}_1,\boldsymbol{a}_2$ 线性无关，要造出 $\boldsymbol{q}_1,\boldsymbol{q}_2$。流程分两步：先把它们变成两个互相垂直的向量，再各自除以长度。为免与矩阵 $A$ 混淆，这段把正交化之后、尚未单位化的向量记为 $\boldsymbol{v}_1,\boldsymbol{v}_2$。

第一步几乎不用做。$\boldsymbol{a}_1$ 的方向本身没有问题，任何方向都可以当第一个方向，直接取



$$
\boldsymbol{v}_1=\boldsymbol{a}_1 .
$$



麻烦在第二个向量：$\boldsymbol{a}_2$ 一般不垂直于 $\boldsymbol{a}_1$。要找的是"从 $\boldsymbol{a}_2$ 出发、只把沿 $\boldsymbol{a}_1$ 方向的那一部分去掉"的结果。这正是这一章最早的基本计算：把 $\boldsymbol{a}_2$ 投影到 $\boldsymbol{a}_1$ 上，投影得到沿 $\boldsymbol{a}_1$ 的那一部分，减去它剩下的就是垂直的那一部分，也就是当时的误差向量 $\boldsymbol{e}$。现在要的正是这个误差向量：



$$
\boldsymbol{v}_2=\boldsymbol{a}_2-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1 .
$$



系数是"要减多少倍"的比例：分子是 $\boldsymbol{a}_2$ 在 $\boldsymbol{v}_1$ 方向上的内积，分母是 $\boldsymbol{v}_1$ 与自己的内积，两者相除把单位对齐，使得减掉的正好是投影这一个倍数，而不是把 $\boldsymbol{v}_1$ 整个减掉。正交化和单位化是两件独立的事：正交化只用到内积与倍数，是算法的实质；单位化只是最后除一次长度。

这个构造对不对，乘一下就清楚：



$$
\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_2
=\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2
-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1
=\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2-\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2=0 .
$$



分子分母中同一个数约掉，结果确实是零。$\boldsymbol{v}_2$ 也不会是零向量：若 $\boldsymbol{v}_2=\boldsymbol{0}$，则 $\boldsymbol{a}_2$ 是 $\boldsymbol{v}_1=\boldsymbol{a}_1$ 的倍数，两向量线性相关，与假设矛盾。所以这两个向量仍然张成原来那个二维子空间，只是方向被摆正了。

最后一步是单位化，平方根在这一步出现：



$$
\boldsymbol{q}_1=\frac{\boldsymbol{v}_1}{\|\boldsymbol{v}_1\|},
\qquad
\boldsymbol{q}_2=\frac{\boldsymbol{v}_2}{\|\boldsymbol{v}_2\|}.
$$



除以正数不改变方向，只把长度变成 $1$；两个向量本来垂直，除以正数之后仍然垂直。到这里算法结束：$\boldsymbol{q}_1,\boldsymbol{q}_2$ 标准正交，并且与 $\boldsymbol{a}_1,\boldsymbol{a}_2$ 张成同一个子空间。

![视频 00:32:07：课堂板书](</attachments/mit1806-089b4c45ed753ba43a60ad8d.jpg>)

*视频 00:32:07｜约对应第 4 节「4. 格拉姆-施密特：两个向量的情形」附近。*

## 5. 三个向量与一个数值例子

三个向量的情形思路完全一样。设 $\boldsymbol{a}_1,\boldsymbol{a}_2,\boldsymbol{a}_3$ 线性无关，前两个已经处理成 $\boldsymbol{v}_1,\boldsymbol{v}_2$，第三个要从 $\boldsymbol{a}_3$ 里减去它在前两个方向上的全部分量：



$$
\boldsymbol{v}_3=\boldsymbol{a}_3
-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_3}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1
-\frac{\boldsymbol{v}_2^{\mathsf T}\boldsymbol{a}_3}{\boldsymbol{v}_2^{\mathsf T}\boldsymbol{v}_2}\,\boldsymbol{v}_2 .
$$



两项分别把沿 $\boldsymbol{v}_1$、沿 $\boldsymbol{v}_2$ 的成分减掉。由于 $\boldsymbol{v}_1,\boldsymbol{v}_2$ 已经互相垂直，这两次减法互不干扰，减完之后的 $\boldsymbol{v}_3$ 与两者都垂直。它不会是零向量，因为线性无关保证了 $\boldsymbol{a}_3$ 不在前两个向量张成的平面里。最后除以长度，得到 $\boldsymbol{q}_3$。整套做法与维数无关：向量可以在二维平面里，也可以在十二维空间里，公式只用到内积和长度。一般地，第 $k$ 个向量要减掉它在前面 $k-1$ 个已知方向上所有的分量，而每个更晚得到的 $\boldsymbol{q}$ 都垂直于所有更早的向量——这条性质正是下一节 $R$ 成为上三角的根源。

用一个具体例子走一遍。取



$$
\boldsymbol{a}_1=\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{a}_2=\begin{bmatrix}1\\0\\2\end{bmatrix}.
$$



这两个向量不垂直：内积是 $1\cdot1+1\cdot0+1\cdot2=3$，正好需要正交化。

第一个方向照抄：$\boldsymbol{v}_1=\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$。计算比例：



$$
\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}
=\frac{3}{1+1+1}=\frac33=1 .
$$



于是



$$
\boldsymbol{v}_2=\boldsymbol{a}_2-1\cdot\boldsymbol{v}_1
=\begin{bmatrix}1\\0\\2\end{bmatrix}-\begin{bmatrix}1\\1\\1\end{bmatrix}
=\begin{bmatrix}0\\-1\\1\end{bmatrix}.
$$



验算正交性：$\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_2=1\cdot0+1\cdot(-1)+1\cdot1=0$，确实垂直。比例恰为 $1$ 是数字取得巧，一般不会是整数。

最后单位化。$\|\boldsymbol{v}_1\|=\sqrt3$，$\|\boldsymbol{v}_2\|=\sqrt2$，所以



$$
\boldsymbol{q}_1=\frac{1}{\sqrt3}\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{q}_2=\frac{1}{\sqrt2}\begin{bmatrix}0\\-1\\1\end{bmatrix}.
$$



把它们排成矩阵



$$
Q=\begin{bmatrix}
1/\sqrt3&0\\
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&1/\sqrt2
\end{bmatrix}.
$$



它的两列标准正交，可以直接核对 $Q^{\mathsf T}Q=I_2$：对角线上是 $\frac33=1$ 与 $\frac22=1$，非对角线上是 $(0-1+1)/\sqrt6=0$。

这个例子里最关键的一点是**列空间没有变**。$Q$ 的列空间与原来由 $\boldsymbol{a}_1,\boldsymbol{a}_2$ 张成的平面是同一个平面：$\boldsymbol{v}_2=\boldsymbol{a}_2-\boldsymbol{a}_1$ 本来就是两者的组合，单位化只是把列换成同一平面内的另一组基。格拉姆-施密特改变的只是基的质量，没有改变基所张成的空间。所以原先那个平面的任何计算——投影、最小二乘、坐标——都可以换到新基上做，而新基让每一步都变成点积。

![视频 00:38:32：课堂板书](</attachments/mit1806-ce0b6956863fc8c76f5272fa.jpg>)

*视频 00:38:32｜约对应第 5 节「5. 三个向量与一个数值例子」附近。*

## 6. 矩阵语言：$A=QR$

正交化也要写成一个矩阵分解，就像消元最终写成 $A=LU$。实际使用中没有人会一直写"这些列互相垂直、这些列长度为 $1$"，人们写的是 $A$ 与 $Q$ 之间的那个矩阵。

把上节的例子整理一下。$A$ 的列是 $\boldsymbol{a}_1,\boldsymbol{a}_2$，$Q$ 的列是 $\boldsymbol{q}_1,\boldsymbol{q}_2$。两组列张成同一个平面，每个 $\boldsymbol{a}_j$ 都能写成 $\boldsymbol{q}_1,\boldsymbol{q}_2$ 的组合，于是存在一个 $2\times2$ 矩阵 $R$ 使



$$
A=QR .
$$



$R$ 可以逐列算出来。$\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$ 与 $\boldsymbol{q}_1$ 同向，长度为 $\sqrt3$，所以 $\boldsymbol{a}_1=\sqrt3\,\boldsymbol{q}_1$；$\boldsymbol{a}_2$ 先写成 $\boldsymbol{a}_1+\boldsymbol{v}_2$，再分别用 $\boldsymbol{q}_1,\boldsymbol{q}_2$ 表示，得到 $\boldsymbol{a}_2=\sqrt3\,\boldsymbol{q}_1+\sqrt2\,\boldsymbol{q}_2$。合起来就是



$$
A=\begin{bmatrix}1&1\\1&0\\1&2\end{bmatrix}
=\begin{bmatrix}
1/\sqrt3&0\\
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&1/\sqrt2
\end{bmatrix}
\begin{bmatrix}
\sqrt3&\sqrt3\\
0&\sqrt2
\end{bmatrix}
=QR .
$$



$R$ 的上三角形状不是巧合。一般地，若 $Q$ 的列标准正交、$A$ 的列是 $\boldsymbol{a}_1,\dots,\boldsymbol{a}_n$，则 $A=QR$ 的第 $j$ 列给出 $\boldsymbol{a}_j=\sum_{i=1}^{n}\boldsymbol{q}_iR_{ij}$。两边左乘 $\boldsymbol{q}_k^{\mathsf T}$，由于 $Q$ 的列两两正交，右边只剩 $i=k$ 一项：



$$
R_{kj}=\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j .
$$



现在看对角线以下为什么全为零。当 $k>j$ 时，$\boldsymbol{a}_j$ 落在 $\boldsymbol{q}_1,\dots,\boldsymbol{q}_j$ 张成的空间里，而 $\boldsymbol{q}_k$ 是更晚造出来的，按算法的构造它垂直于所有更早的方向，于是 $\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j=0$，即 $R_{kj}=0$。这正是上三角矩阵的定义：主对角线下方全为零。对角元则是 $R_{jj}=\boldsymbol{q}_j^{\mathsf T}\boldsymbol{a}_j=\|\boldsymbol{v}_j\|>0$，例子里就是 $\sqrt3$ 与 $\sqrt2$。

于是得到本讲的最终结论：任何列线性无关的矩阵都能分解为标准正交列矩阵与上三角矩阵之积，这个分解称为**QR 分解**（QR factorization）：



$$
A=QR .
$$



$Q$ 给出同一个列空间的标准正交基，$R$ 记录新基表示旧列所需的系数；$R$ 中的每个数都是正交化过程中已经算过的内积与长度，没有引入新的量。有了 $Q$，投影是 $QQ^{\mathsf T}$，最小二乘的解是 $Q^{\mathsf T}\boldsymbol{b}$，全都不再需要求逆；有了 $R$，才知道这组漂亮的基与原矩阵之间是怎样换算的。这正是消元与正交化的分工方式：$A=LU$ 把消元的信息存进下三角矩阵，$A=QR$ 把正交化的信息存进上三角矩阵。

![视频 00:44:28：课堂板书](</attachments/mit1806-52ab1fbd9ebfa9140d74d5a0.jpg>)

*视频 00:44:28｜约对应第 6 节「6. 矩阵语言：$A=QR$」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-ea8ce4498f92e4c762ffd6bc.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 17 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **标准正交**（orthonormal）指两两内积为零、且每个向量长度为 $1$；写成条件是 $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j=\delta_{ij}$，即对角为 $1$、其余为 $0$。
- 若 $Q$ 的列标准正交，则 $Q^{\mathsf T}Q=I$；若 $Q$ 还是方阵，则 $Q^{\mathsf T}=Q^{-1}$，即 $QQ^{\mathsf T}=I$。约定只把方阵叫作**正交矩阵**（orthogonal matrix）。
- 标准正交向量必然线性无关：用 $\boldsymbol{q}_i$ 去点乘零组合，可逼出第 $i$ 个系数为零。
- 典型例子：置换矩阵；两列分别为 $(\cos\theta,\sin\theta)^{\mathsf T}$ 与 $(-\sin\theta,\cos\theta)^{\mathsf T}$ 的矩阵；$2\times2$ 的 $\pm1$ 矩阵整体除以 $\sqrt2$；四阶 Hadamard 矩阵整体除以 $2$；三行两列的那个例子整体除以 $3$。
- 列标准正交时投影矩阵退化为 $P=QQ^{\mathsf T}$，它对称、满足 $P^2=P$；$Q$ 为方阵时 $P=I$。
- 正规方程退化为 $Q^{\mathsf T}Q\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$，即 $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$，第 $i$ 个系数是 $\hat{x}_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{b}$："坐标就是点积"。
- 格拉姆-施密特的两个核心步骤：正交化 $\boldsymbol{v}_1=\boldsymbol{a}_1$，$\boldsymbol{v}_2=\boldsymbol{a}_2-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\boldsymbol{v}_1$，三个向量时再减去沿 $\boldsymbol{v}_2$ 的分量；然后单位化 $\boldsymbol{q}_i=\boldsymbol{v}_i/\|\boldsymbol{v}_i\|$。
- 数值例子：$\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$、$\boldsymbol{a}_2=(1,0,2)^{\mathsf T}$ 给出 $\boldsymbol{v}_2=(0,-1,1)^{\mathsf T}$；单位化后两列分别是 $(1,1,1)^{\mathsf T}/\sqrt3$ 与 $(0,-1,1)^{\mathsf T}/\sqrt2$，列空间仍是原来那个平面。
- 整个过程写成 $A=QR$，$R_{kj}=\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j$ 为上三角矩阵；$R_{kj}=0\ (k>j)$ 是因为更晚的 $\boldsymbol{q}_k$ 垂直于更早的 $\boldsymbol{a}_j$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| orthonormal | 标准正交 | 两两内积为零且每个向量长度为 $1$ |
| orthonormal basis | 标准正交基 | 由标准正交向量组成的基，坐标可直接由内积读出 |
| orthogonal matrix | 正交矩阵 | 列标准正交的方阵，满足 $Q^{\mathsf T}=Q^{-1}$ |
| Gram-Schmidt | 格拉姆-施密特 | 把线性无关向量组逐个减掉已得方向上的投影、再单位化的正交化算法 |
| QR factorization | QR 分解 | 把列线性无关的矩阵写成标准正交列矩阵与上三角矩阵之积 |
| projection matrix | 投影矩阵 | 把向量投到列空间上的矩阵，列标准正交时简化为 $QQ^{\mathsf T}$ |
| normal equation | 正规方程 | 最小二乘的方程 $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$，$Q$ 情形退化为 $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$ |
| permutation matrix | 置换矩阵 | 每行每列只有一个 $1$ 的方阵，总是正交矩阵 |
| Hadamard matrix | Hadamard 矩阵 | 元素全为 $\pm1$ 的正交矩阵，四阶例子需整体除以 $2$ |
| upper triangular matrix | 上三角矩阵 | 主对角线下方全为零的矩阵，$A=QR$ 中的 $R$ 即属此类 |

---

[← Lecture 16](/notes/mit-1806/lec16) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 18 →](/notes/mit-1806/lec18)
