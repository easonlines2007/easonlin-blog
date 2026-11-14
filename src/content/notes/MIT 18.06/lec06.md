---
title: Lecture 6 · 列空间与零空间
description: 用列空间与零空间描述 Ax=b 的可解性与解的自由度。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 7
tags:
  - lineal algebra
status: completed
publish: true
---

> *Column space and nullspace* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 6 讲 / 共 35 讲** ｜ 第一部分 · 消元与向量空间

**本讲视频**：[Bilibili p6 · 列空间与零空间](https://www.bilibili.com/video/BV1ix411f7Yp?p=6)（46:01）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-6-column-space-and-nullspace/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=6&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲把向量空间与子空间这两个词摆上了台面，但台面上还空着。这一讲要请出两位主角：矩阵 $A$ 的**列空间**（column space）与**零空间**（nullspace）。它们都是子空间，却住在不同的房间里——若 $A$ 是 $m\times n$ 矩阵，列空间住在 $\mathbb{R}^m$，零空间住在 $\mathbb{R}^n$。两个房间对应两个问题：$A\boldsymbol{x}=\boldsymbol{b}$ 什么时候有解？$A\boldsymbol{x}=\boldsymbol{0}$ 的解长什么样？

这两个问题的处理方式恰好相反。列空间是从“造”的角度定义的：给我几个列向量，我把它们的所有线性组合收集起来，凑成一个子空间。零空间是从“筛”的角度定义的：给我一个方程，我把所有满足它的 $\boldsymbol{x}$ 挑出来。前者先有向量、后成空间；后者先有要求、后有集合。这两种构造方式是线性代数里生产子空间的标准工艺，本讲各用一个实例走一遍。

这一讲也是新一章的正题。前面几讲解决的是“怎么解”：消元、回代、$LU$ 分解，都是算法。从这一讲开始，问题换成“解的全体是什么形状”：把所有可能的右端放在一起看，把所有可能的解放在一起看，各得到什么。算法关心一步怎么走，子空间关心全部答案住在哪里。

最重要的结论只有一句：$A\boldsymbol{x}=\boldsymbol{b}$ 有解，当且仅当 $\boldsymbol{b}$ 落在 $A$ 的列空间里。这句话把“解方程组”翻译成了“判断一个向量属不属于某个子空间”，也解释了为什么接下来的整章都在研究子空间而不是方程本身。本讲还给出一个反例：把右端从零换成别的向量，解集立刻不再是子空间——差的就是原点这一个点。

![官方讲义摘要 第 1/2 页](</attachments/mit1806-3f593601739695c31a54fc62.png>)

*MIT OCW 官方讲义摘要 第 1/2 页（18.06SC Lecture 6 Summary，CC BY-NC-SA 4.0）。*

## 1. 向量空间：加法与数乘都不许跑出去

**向量空间**（vector space）的定义只有两条要求：任取空间中两个向量相加，结果仍在空间中；任取空间中一个向量乘任意常数，结果仍在空间中。两条合起来就是一句话——对**线性组合**（linear combination）封闭。因为任取 $c\boldsymbol{v}+d\boldsymbol{w}$，先用数乘留在里面，再用加法留在里面，两步都过得去。

在 $\mathbb{R}^3$ 里可以数出几种。整个 $\mathbb{R}^3$ 是向量空间，这没什么好争的。更有意思的是它内部的一些子集：一张过原点的平面，或一条过原点的直线。平面上的两个向量相加仍在平面上，把平面上的向量乘 $-2$ 仍在平面上，所以平面是子空间；直线同理。这里的**子空间**（subspace）指“某个空间内部的、自身又构成向量空间的一部分”，把外部空间一并说清楚时，就讲“$\mathbb{R}^3$ 的子空间”。

**所有子空间都必须过原点。** 理由很干脆：若 $\boldsymbol{v}$ 在子空间里，取常数 $0$，则 $0\boldsymbol{v}=\boldsymbol{0}$ 也必须在里面。所以判断一个集合是不是子空间，第一眼就看它含不含零向量，不含便立刻出局。这条判据稍后还会用到：右端不为零时，$A\boldsymbol{x}=\boldsymbol{b}$ 的解集恰恰不含零向量，于是它连候选资格都没有。反过来，一个集合要配得上“空间”二字，这两条要求必须逐条验过，不能凭印象放行。

![视频 00:04:36：课堂板书](</attachments/mit1806-d32fbcbef2e215ff95e64456.jpg>)

*视频 00:04:36｜约对应第 1 节「1. 向量空间：加法与数乘都不许跑出去」附近。*

## 2. 并集与交集：哪一个还是子空间

设 $P$ 是一张过原点的平面，$L$ 是一条过原点的直线，两者都在 $\mathbb{R}^3$ 里，各自都是子空间。现在用集合运算把它们拼起来，看拼出来的东西还是不是子空间。

先看并集 $P\cup L$，即“在平面上或在直线上”的全部向量。它**不是**子空间。取平面上一个不在直线上的向量 $\boldsymbol{v}$，再取直线上一个非零向量 $\boldsymbol{w}$，两者相加，和通常既不在平面上也不在直线上，跑出了并集。用封闭性把理由说清楚：假如 $\boldsymbol{v}+\boldsymbol{w}$ 仍落在平面 $P$ 内，那么 $\boldsymbol{w}=(\boldsymbol{v}+\boldsymbol{w})-\boldsymbol{v}$ 作为两个平面内向量的差也必须在 $P$ 内，可是 $\boldsymbol{w}$ 只在 $L$ 上而不在 $P$ 内，矛盾。问题就出在加法这一步。

再看交集 $P\cap L$，即“同时在平面上又在直线上”的向量。若直线不在平面内，两者就只共用一个原点，所以 $P\cap L=\{\boldsymbol{0}\}$。单独一个零向量是子空间，于是交集是子空间。这个结论不是这张图碰巧撞上的，对任何两个子空间都成立。

设 $S$ 与 $T$ 是同一空间里的两个子空间，取 $\boldsymbol{v},\boldsymbol{w}\in S\cap T$。由定义，$\boldsymbol{v}$ 与 $\boldsymbol{w}$ 都在 $S$ 里，而 $S$ 是子空间，所以 $\boldsymbol{v}+\boldsymbol{w}\in S$；同理 $\boldsymbol{v}+\boldsymbol{w}\in T$。两边都成立，于是 $\boldsymbol{v}+\boldsymbol{w}\in S\cap T$。数乘的检查一模一样：$\boldsymbol{v}\in S$ 给出 $7\boldsymbol{v}\in S$，$\boldsymbol{v}\in T$ 给出 $7\boldsymbol{v}\in T$，所以 $7\boldsymbol{v}$ 也在交集里。

**两个子空间的交集仍是子空间，并集一般不是。** 交集因为多了一重条件，通常比原来两个都小，但这不重要，封闭性保住了。这个对照也说明那两条要求不是装饰：交集的封闭性正是被它们担保的，而并集恰恰在加法上失守。

![视频 00:11:03：课堂板书](</attachments/mit1806-beda1bbc486ee5709eb0fb61.jpg>)

*视频 00:11:03｜约对应第 2 节「2. 并集与交集：哪一个还是子空间」附近。*

## 3. 列空间：让 $A\boldsymbol{x}=\boldsymbol{b}$ 有解的那些 $\boldsymbol{b}$

取一个具体的矩阵



$$
A=\begin{bmatrix}
1&1&2\\
2&1&3\\
3&1&4\\
4&1&5
\end{bmatrix}.
$$



它是 $4\times 3$ 矩阵，三列分别是



$$
\boldsymbol{c}_1=\begin{bmatrix}1\\2\\3\\4\end{bmatrix},
\qquad
\boldsymbol{c}_2=\begin{bmatrix}1\\1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{c}_3=\begin{bmatrix}2\\3\\4\\5\end{bmatrix}.
$$



每一列有四个分量，所以列向量住在 $\mathbb{R}^4$ 里；矩阵有几行，列就有几个分量。

$A$ 的**列空间**（column space）记作 $C(A)$，定义是三个列向量的全部线性组合：



$$
C(A)=\left\{x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3\right\}.
$$



三个列向量本身当然在里面（分别取系数 $(1,0,0)$、$(0,1,0)$、$(0,0,1)$），但光有三个向量不成子空间，必须把组合补齐。补齐之后确实是子空间：一个组合乘 $11$ 还是组合，两个组合相加还是组合。它是包含这三个列向量的**最小**子空间——列必须在，列的组合同样必须在，到此为止，不再添加别的东西。

$C(A)$ 是 $\mathbb{R}^4$ 的子空间，却远不是整个 $\mathbb{R}^4$。三个列向量能提供的新方向至多三个，而 $\mathbb{R}^4$ 要四个方向才填得满，所以总有些 $\boldsymbol{b}$ 落在外面。至于落在外面的有多少、剩下的部分是什么形状，下一节再看。眼下先把这条几何事实翻译成方程。

把 $A\boldsymbol{x}=\boldsymbol{b}$ 完整写开：



$$
x_1\begin{bmatrix}1\\2\\3\\4\end{bmatrix}
+x_2\begin{bmatrix}1\\1\\1\\1\end{bmatrix}
+x_3\begin{bmatrix}2\\3\\4\\5\end{bmatrix}
=\begin{bmatrix}b_1\\b_2\\b_3\\b_4\end{bmatrix}.
$$



这是四个方程、三个未知数，通常无解。把它按行写成方程组更直观：



$$
\begin{cases}
x_1+x_2+2x_3=b_1,\\
2x_1+x_2+3x_3=b_2,\\
3x_1+x_2+4x_3=b_3,\\
4x_1+x_2+5x_3=b_4.
\end{cases}
$$



四个方程只有三个未知数，“通常”当然不等于“永远”，有些右端是能解的。最稳的一个是 $\boldsymbol{b}=\boldsymbol{0}$，取 $x_1=x_2=x_3=0$ 即可。再找一个：让 $\boldsymbol{b}$ 直接等于第一列 $(1,2,3,4)$，此时 $\boldsymbol{x}=(1,0,0)$ 就是解——把它代进去，四个方程依次给出 $1=1$、$2=2$、$3=3$、$4=4$，全部对上。这不是巧合，$A(1,0,0)$ 的含义就是“取一个第一列、零个第二列、零个第三列”，乘出来的右端当然是第一列本身。让 $\boldsymbol{b}$ 等于第二列 $(1,1,1,1)$，同样的道理给出 $\boldsymbol{x}=(0,1,0)$。找能解的右端有个窍门：反过来做，先随便指定一个 $\boldsymbol{x}$，乘出来的结果就是一个合法的 $\boldsymbol{b}$。

于是本讲的核心答案可以写下来了：

> $A\boldsymbol{x}=\boldsymbol{b}$ 有解，当且仅当 $\boldsymbol{b}\in C(A)$。

理由就在定义里。列空间装的是所有 $A\boldsymbol{x}$，$\boldsymbol{x}$ 跑遍 $\mathbb{R}^3$。若 $\boldsymbol{b}$ 是列的组合，那么这组组合系数就给出一个解；若 $\boldsymbol{b}$ 不是列的组合，任何 $\boldsymbol{x}$ 都凑不出它。解方程的全部困难，因此被压缩成一个从属判断：$\boldsymbol{b}$ 在不在 $C(A)$ 里。

![视频 00:13:48：课堂板书](</attachments/mit1806-58334606c0a562dafb2c123d.jpg>)

*视频 00:13:48｜约对应第 3 节「3. 列空间：让 $A\boldsymbol{x}=\boldsymbol{b}$ 有解的那些 $\boldsymbol{b}$」附近。*

![视频 00:17:29：课堂板书](</attachments/mit1806-81534da3c61e2ac5bdd6bac7.jpg>)

*视频 00:17:29｜约对应第 3 节「3. 列空间：让 $A\boldsymbol{x}=\boldsymbol{b}$ 有解的那些 $\boldsymbol{b}$」附近。*

## 4. 删掉一列，列空间不变

上一节说三个列向量填不满 $\mathbb{R}^4$，实际情况更极端：三个列向量里有一个是多余的。把前两列相加：



$$
\boldsymbol{c}_1+\boldsymbol{c}_2=
\begin{bmatrix}1\\2\\3\\4\end{bmatrix}
+\begin{bmatrix}1\\1\\1\\1\end{bmatrix}
=\begin{bmatrix}2\\3\\4\\5\end{bmatrix}
=\boldsymbol{c}_3 .
$$



第三列恰好是前两列之和，它没有带来任何新方向。把这一点代进组合里看：



$$
x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3
=(x_1+x_3)\boldsymbol{c}_1+(x_2+x_3)\boldsymbol{c}_2 .
$$



右边只用到前两列。也就是说，任何用到第三列的组合都能改写为只用前两列的组合；反过来，只用前两列的组合本来就是三列组合（取 $x_3=0$）。两边互相包含，所以



$$
C(A)=\left\{x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2\right\}.
$$



删掉第三列，列空间一个向量都不少。换个说法：第三列落在头两列张成的平面里，没有贡献新方向。

能不能删第一列？也可以。由 $\boldsymbol{c}_1=\boldsymbol{c}_3-\boldsymbol{c}_2$ 可知第一列是另外两列的组合，删掉它同样不损失任何东西。但习惯上保留最靠前的几个独立列，于是约定称 $\boldsymbol{c}_1,\boldsymbol{c}_2$ 为**主元列**（pivot columns），称 $\boldsymbol{c}_3$ 不是主元列。“主元列”这个名号此刻还没有算法含义，要等后面用消元正式求出主元之后才交代清楚；现在只需记住选择规则：从左往右，能留下就留下，留到不再产生新方向为止。

于是 $C(A)$ 是 $\mathbb{R}^4$ 里的一个**二维**子空间，几何上是一张过原点的平面。三个列向量，两个方向，第三个被前两列的系数关系锁死。

“这一列是不是多余的”这种问法，这里还只能靠眼睛和减法回答：把列摆开，看其中一列能不能由其余列拼出来。它以后会成为一个正式概念，并且需要一个专门的名字；眼下的例子只是把它提前演示了一遍。

## 5. 零空间：把右端设为零

现在换一个完全不同的子空间。列空间收集的是右端 $\boldsymbol{b}$，零空间收集的是解 $\boldsymbol{x}$。$A$ 的**零空间**（nullspace）记作 $N(A)$，定义是



$$
N(A)=\{\boldsymbol{x}:A\boldsymbol{x}=\boldsymbol{0}\}.
$$



“null”就是零的意思，所以零空间也叫解空间：它是齐次方程 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部解。仍用同一个 $A$，$\boldsymbol{x}$ 有三个分量，故 $N(A)$ 落在 $\mathbb{R}^3$ 里。矩阵的列数决定零空间住在哪，行数决定列空间住在哪：对 $m\times n$ 矩阵，$C(A)\subseteq\mathbb{R}^m$ 而 $N(A)\subseteq\mathbb{R}^n$。

零空间里至少有一个向量：$\boldsymbol{x}=\boldsymbol{0}$。任何矩阵乘零向量都得零，所以零空间永远非空，永远含原点。子空间的第一个必要条件已经满足。

小例子的好处正在这里：不必真的解方程，也能把零空间看出来。矩阵一大，眼睛就不够用了，那时要靠消元这套机械程序把零空间逼出来，那是下一讲的内容。

再找一个。要求是 $x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3=\boldsymbol{0}$。既然 $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$，取 $x_1=1,x_2=1,x_3=-1$ 正好抵消：



$$
\boldsymbol{c}_1+\boldsymbol{c}_2-\boldsymbol{c}_3=\boldsymbol{0} .
$$



代进四个方程逐行验算：第一行 $1+1-2=0$，第二行 $2+1-3=0$，第三行 $3+1-4=0$，第四行 $4+1-5=0$，四行全中。再一个解是 $(2,2,-2)$，它是前一个的两倍。事实上全部解就是



$$
N(A)=\left\{c\begin{bmatrix}1\\1\\-1\end{bmatrix}:c\in\mathbb{R}\right\}.
$$



记 $\boldsymbol{v}=(1,1,-1)$，验证很省事：$A(c\boldsymbol{v})=c(A\boldsymbol{v})=c\,\boldsymbol{0}=\boldsymbol{0}$。所以只要有一个非零解，它的所有倍数都是解；$c=0$ 给出零向量，$c=1$ 给出刚才那个解，$c=-11$ 给出 $(-11,-11,11)$。于是 $N(A)$ 是 $\mathbb{R}^3$ 里过原点的一条直线，方向向量是 $(1,1,-1)$。

这里有一个值得记住的读法。零空间里的向量是一组**系数**，它记录的是“用这几个系数去组合各列，恰好得到零”。写 $A\boldsymbol{x}=\boldsymbol{0}$ 其实是在问：这几个列向量之间存在什么样的线性关系？第三列等于前两列之和，这个几何事实翻译成系数正好是 $(1,1,-1)$；乘以 $7$ 变成 $(7,7,-7)$，说的还是同一个关系，只是把两边都放大了七倍。列空间关心“列能组合出什么”，零空间关心“列怎样组合成零”，两个子空间看的是同一批列，问的却是反方向的问题。

![视频 00:29:55：课堂板书](</attachments/mit1806-b84f0932a93e2fc8d27faf9f.jpg>)

*视频 00:29:55｜约对应第 5 节「5. 零空间：把右端设为零」附近。*

## 6. 零空间为什么配得上“空间”这个名字

前面一路叫“零空间”，这个名字用得早了一点：必须先验证它满足那两条要求，才有资格叫空间。要证的事情很具体：若 $\boldsymbol{v}$ 与 $\boldsymbol{w}$ 都是解，则 $\boldsymbol{v}+\boldsymbol{w}$ 也是解；若 $\boldsymbol{v}$ 是解，则 $12\boldsymbol{v}$ 也是解。

第一件。已知 $A\boldsymbol{v}=\boldsymbol{0}$，$A\boldsymbol{w}=\boldsymbol{0}$，要算 $A(\boldsymbol{v}+\boldsymbol{w})$。这里用到矩阵乘法的一条基本性质——分配律：



$$
A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w}=\boldsymbol{0}+\boldsymbol{0}=\boldsymbol{0}.
$$



于是 $\boldsymbol{v}+\boldsymbol{w}$ 满足方程，落在零空间里。第二件同理，用的是常数可以提出去这条性质：



$$
A(12\boldsymbol{v})=12(A\boldsymbol{v})=12\cdot\boldsymbol{0}=\boldsymbol{0},
$$



所以 $12\boldsymbol{v}$ 也在零空间里。两条要求都过，零空间确实是子空间。把两个等式合起来，还得到一个更强的说法：若 $\boldsymbol{v},\boldsymbol{w}$ 是解，则对任意常数 $c,d$，$c\boldsymbol{v}+d\boldsymbol{w}$ 也是解——解对线性组合封闭。

这段证明的要害不在技巧，而在于它没有用到 $A$ 的任何特殊之处：既没有用那四个具体数字，也没有用列之间的特殊关系。任取一个矩阵，$A\boldsymbol{x}=\boldsymbol{0}$ 的全部解都构成子空间。齐次方程的解集天然封闭，这正是它比非齐次方程好对付的根本原因——也解释了为什么研究 $A\boldsymbol{x}=\boldsymbol{b}$ 的第一步总是先把 $\boldsymbol{b}$ 换成 $\boldsymbol{0}$。

![视频 00:35:53：课堂板书](</attachments/mit1806-6bcd7c75e2713ca4db43acd6.jpg>)

*视频 00:35:53｜约对应第 6 节「6. 零空间为什么配得上“空间”这个名字」附近。*

![视频 00:36:49：课堂板书](</attachments/mit1806-8fa2e39b9a252a9bb82c10a0.jpg>)

*视频 00:36:49｜约对应第 6 节「6. 零空间为什么配得上“空间”这个名字」附近。*

## 7. 右端不为零：解集为什么不再是子空间

把右端从 $\boldsymbol{0}$ 换成第一列 $\boldsymbol{b}=(1,2,3,4)$，矩阵、未知数都不变，只改了这一处。方程仍有解，例如 $\boldsymbol{x}=(1,0,0)$；还有一个解是 $(0,-1,1)$，验算 $-\boldsymbol{c}_2+\boldsymbol{c}_3=-(1,1,1,1)+(2,3,4,5)=(1,2,3,4)$。

但这个解集不是子空间，理由一句话就够：$\boldsymbol{x}=\boldsymbol{0}$ 不是解，因为 $A\boldsymbol{0}=\boldsymbol{0}\neq\boldsymbol{b}$。零向量缺席，封闭性无从谈起。

几何上发生了什么？把 $(1,0,0)$ 与 $(0,-1,1)$ 相减，得到 $(1,1,-1)$，正是零空间的方向。沿着这个方向挪动不会改变右端：



$$
A\bigl((1,0,0)+c(1,1,-1)\bigr)=A(1,0,0)+c\,A(1,1,-1)=\boldsymbol{b}+c\cdot\boldsymbol{0}=\boldsymbol{b}.
$$



所以形如



$$
\boldsymbol{x}=c\begin{bmatrix}1\\1\\-1\end{bmatrix}+\begin{bmatrix}1\\0\\0\end{bmatrix}
$$



的向量全都是解，它们连成一条过 $(1,0,0)$、方向为 $(1,1,-1)$ 的直线。前面找到的两个解都落在这条线上：$c=0$ 给出 $(1,0,0)$，$c=-1$ 给出 $(0,-1,1)$。这条线平行于零空间那条直线，却被整体平移离开了原点：右端 $\boldsymbol{b}$ 决定这条线往哪里平移，零空间决定它朝哪个方向延伸。子空间必须过原点，它不过，于是它只能叫“解集”，不能叫“子空间”。右端一非零，解集就从过原点的直线变成了不过原点的直线：方向没变，位置变了，性质跟着变。至于这条线上是否还有别的点、以及非齐次方程的通解如何组织，这里不展开，第 8 讲会把“一个特解加上零空间”的结构正式写出来。

**两种造子空间的方式。** 把今天的两个主角并排看一眼，会发现它们对应两种相反的描述。要说明列空间里有什么，只需给出少数几个向量，然后宣布“取它们的所有组合”——这是从内部生成；要说明零空间里有什么，给不出这样一小组向量，只能给出一组必须满足的方程，让解自己浮现——这是从外部限定。两种说法都能造出子空间，而且是构造子空间最自然、最重要的两条路。小矩阵靠眼睛就能看出解，矩阵一大就不行了，那时必须动用消元这一套机械程序，这是下一步的事。

![视频 00:41:25：课堂板书](</attachments/mit1806-88519ca805eff57f9bd57eb7.jpg>)

*视频 00:41:25｜约对应第 7 节「7. 右端不为零：解集为什么不再是子空间」附近。*

![官方讲义摘要 第 2/2 页](</attachments/mit1806-05e810d4a6624133c16d83a5.png>)

*MIT OCW 官方讲义摘要 第 2/2 页（18.06SC Lecture 6 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **向量空间**（vector space）对加法与数乘封闭，等价于对线性组合封闭；**子空间**（subspace）是某个空间内部、自身又构成向量空间的部分。
- 任何子空间都含零向量（取 $0$ 倍数即得），所以“不含原点的集合”一票否决；判断子空间必须逐条验封闭性，不能凭印象放行。
- 两个子空间的**交集**仍是子空间：$\boldsymbol{v},\boldsymbol{w}\in S\cap T$ 推出 $\boldsymbol{v}+\boldsymbol{w}$ 同时在 $S$、$T$ 中。**并集**一般不是：在 $P\cup L$ 里，平面内的向量加上直线上的向量就会破坏加法封闭。
- $m\times n$ 矩阵的**列空间** $C(A)\subseteq\mathbb{R}^m$ 是各列的全部线性组合，也是所有 $A\boldsymbol{x}$ 的集合；**零空间** $N(A)\subseteq\mathbb{R}^n$ 是 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部解。
- 本讲例子（$4\times 3$ 矩阵，三列为 $(1,2,3,4)$、$(1,1,1,1)$、$(2,3,4,5)$）中，$C(A)$ 是 $\mathbb{R}^4$ 的二维子空间，$N(A)$ 是 $\mathbb{R}^3$ 中方向为 $(1,1,-1)$ 的直线。
- $A\boldsymbol{x}=\boldsymbol{b}$ 有解，当且仅当 $\boldsymbol{b}\in C(A)$：$\boldsymbol{b}=(1,2,3,4)$ 对应 $\boldsymbol{x}=(1,0,0)$，$\boldsymbol{b}=(1,1,1,1)$ 对应 $\boldsymbol{x}=(0,1,0)$，$\boldsymbol{b}=\boldsymbol{0}$ 永远有解。
- $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$，故删去第三列不改变列空间；$\boldsymbol{c}_1=\boldsymbol{c}_3-\boldsymbol{c}_2$ 说明删第一列也行，惯例是保留最靠前的独立列，即**主元列** $\boldsymbol{c}_1,\boldsymbol{c}_2$。
- 零空间封闭性由 $A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w}$ 与 $A(c\boldsymbol{v})=cA\boldsymbol{v}$ 直接得到，对任意矩阵成立。
- 右端非零时解集不是子空间，因为零向量不在其中；本例的解集是过 $(1,0,0)$、方向为 $(1,1,-1)$ 的直线，与零空间平行但不过原点。
- 构造子空间的两条路：给一组向量取组合（列空间），或给一组方程取解（零空间）。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| vector space | 向量空间 | 对加法与数乘都封闭的向量集合 |
| subspace | 子空间 | 位于某空间内部、自身又构成向量空间的部分，必含零向量 |
| linear combination | 线性组合 | 若干个向量各乘一个系数再相加 |
| closed under addition | 对加法封闭 | 空间内任意两向量之和仍在该空间内 |
| closed under scalar multiplication | 对数乘封闭 | 空间内任一向量乘任意常数仍在该空间内 |
| column space | 列空间 | 矩阵各列的全部线性组合构成的子空间 $C(A)$ |
| nullspace | 零空间 | 满足 $A\boldsymbol{x}=\boldsymbol{0}$ 的全部 $\boldsymbol{x}$ 构成的子空间 $N(A)$ |
| pivot column | 主元列 | 从左往右逐列保留、不被前面各列组合出来因而带来新方向的那一列 |
| homogeneous equation | 齐次方程 | 右端为零的方程 $A\boldsymbol{x}=\boldsymbol{0}$，其解集必是子空间 |
| solution set | 解集 | 满足方程的全部 $\boldsymbol{x}$ 组成的集合，右端非零时一般不是子空间 |

---

[← Lecture 5](/notes/mit-1806/lec05) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 7 →](/notes/mit-1806/lec07)
