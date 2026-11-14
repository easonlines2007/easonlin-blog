---
title: Lecture 21 · 特征值与特征向量
description: 理解特征值与特征向量，掌握特征多项式的求法。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 22
tags:
  - lineal algebra
status: completed
publish: true
---

> *Eigenvalues and eigenvectors* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 21 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p21 · 特征值与特征向量](https://www.bilibili.com/video/BV1ix411f7Yp?p=21)（51:23）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-21-eigenvalues-and-eigenvectors/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=21&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

这一讲开启课程的第三部分。前两部分的二十讲里，矩阵始终是一个给定的对象：我们问 $A\boldsymbol{x}=\boldsymbol{b}$ 有没有解，问 $A$ 的四个基本子空间分别是什么，问 $\det A$ 等于多少。从这一讲起，问题换了方向：给定一个方阵 $A$，它自身有什么“固有”的结构？具体说，是否存在某些特殊的方向，使得 $A$ 作用在这些方向上的向量时只改变长度、不改变方向？这样的向量称为**特征向量**（eigenvector），伸缩的倍数称为**特征值**（eigenvalue）。它们只由 $A$ 本身决定，与任何右端向量 $\boldsymbol{b}$ 无关，因此比“解某一个方程组”更深入地刻画了矩阵。

本讲要回答两个问题：特征值和特征向量究竟是什么；怎样才能把它们算出来。第二个问题更难，因为方程 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 里有两个未知量，而 $\lambda$ 与 $\boldsymbol{x}$ 是乘在一起的，消元对此无能为力。转折点是把方程移项成 $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$：要让非零的 $\boldsymbol{x}$ 存在，矩阵 $A-\lambda I$ 必须奇异。于是行列式第一次真正被用上——它不再用来解某个方程组，而是把“存在非零解”这个定性要求翻译成一个只含 $\lambda$ 的方程。求特征值的路线因此是：先由 $\det(A-\lambda I)=0$ 求出全部 $\lambda$，再对每个 $\lambda$ 求 $A-\lambda I$ 的零空间，得到特征向量。

本讲的例子都经过挑选：投影矩阵、置换矩阵、对称矩阵、旋转矩阵、上三角矩阵。它们分别展示了可能出现的好情况——特征值是实数、特征向量两两正交——和坏情况——特征值跑出实数范围变成复数，甚至特征向量不够用。这些例子不是点缀。对一般矩阵求特征值本质上就是解一个 $n$ 次方程，阶数一高就很难有公式可套；真正能一眼读出特征值的，恰恰是有结构的矩阵。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-b87f1dc43b82263822e94656.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 21 Summary，CC BY-NC-SA 4.0）。*

## 1. 矩阵像函数：特征向量与特征值的定义

矩阵对向量的作用可以类比微积分里的函数。函数把数 $x$ 变成 $f(x)$，矩阵把向量 $\boldsymbol{x}$ 变成 $A\boldsymbol{x}$：进一个向量，出一个向量，只是所在的空间维数更高。基于这个类比，可以问一个关于输出方向的问题。

绝大多数向量都会被 $A$ 转过一个角度：$A\boldsymbol{x}$ 指向一个与 $\boldsymbol{x}$ 不同的方向。但有那么一些特殊的向量，$A\boldsymbol{x}$ 恰好与 $\boldsymbol{x}$ 平行。这样的向量就叫 $A$ 的特征向量。把“平行”写成方程：



$$
A\boldsymbol{x}=\lambda\boldsymbol{x}.
$$



右端那个倍数 $\lambda$ 就是**特征值**。这里的“同方向”允许“反方向”：$\lambda$ 可以是正数、负数，也可以是零。$A$ 把这类向量映到它自己所在的直线上，$\lambda>1$ 时拉长，$0<\lambda<1$ 时缩短，$\lambda<0$ 时翻到反方向。

$\lambda=0$ 的情形值得单独看一眼。若某个非零向量满足 $A\boldsymbol{x}=0\cdot\boldsymbol{x}=\boldsymbol{0}$，那么 $\boldsymbol{x}$ 就在 $A$ 的**零空间**（nullspace）里。换个说法：如果 $A$ 奇异，就存在非零向量被它映成零向量，于是 $0$ 是一个特征值；反过来，$A$ 可逆时零空间只有零向量，$0$ 就不是特征值。所以“$0$ 是特征值”与“$A$ 奇异”是同一件事。不过就特征值这个主题而言，$0$ 并没有什么特殊待遇，它只是所有可能取值中的一个。

还有一点需要说清楚：特征向量不是一个向量，而是一整条直线。若 $\boldsymbol{x}$ 是特征向量，则任意非零倍数 $c\boldsymbol{x}$ 也是特征向量，特征值不变，因为



$$
A(c\boldsymbol{x})=cA\boldsymbol{x}=c\lambda\boldsymbol{x}=\lambda(c\boldsymbol{x}).
$$



所以严格说来“$A$ 的特征向量”这个说法并不准确，我们真正想要的只是那条直线上一个代表向量，或者说这个一维子空间的一组基。

![视频 00:05:08：课堂板书](</attachments/mit1806-22640e84ce4e32b6a7dfe522.jpg>)

*视频 00:05:08｜约对应第 1 节「1. 矩阵像函数：特征向量与特征值的定义」附近。*

## 2. 先看两个能“看出”答案的矩阵

在建立一般算法之前，先用两个几何作用已知的矩阵把概念落实：**投影矩阵**（projection matrix）与**置换矩阵**（permutation matrix）。

**投影矩阵。** 设 $P$ 把空间投影到一个过原点的平面上。问题是：哪些向量投影之后仍与原来同向？

一般的向量 $\boldsymbol{b}$ 不行。把 $\boldsymbol{b}$ 投影到平面上得到的 $P\boldsymbol{b}$ 落在平面内，而 $\boldsymbol{b}$ 本身一般不在平面内，两者方向不同，所以 $\boldsymbol{b}$ 不是特征向量。

平面内的向量满足这一条。若 $\boldsymbol{x}$ 已经在平面内，投影什么也不做，$P\boldsymbol{x}=\boldsymbol{x}$，即 $\lambda=1$。平面内每个非零向量都是特征向量，这给出了一整族特征向量，而不只是一个。

垂直于平面的向量也满足。若 $\boldsymbol{x}$ 垂直于平面，它的投影是零向量，$P\boldsymbol{x}=\boldsymbol{0}=0\cdot\boldsymbol{x}$，即 $\lambda=0$；这些向量正是 $P$ 的零空间。

于是投影矩阵的特征值只有 $1$ 和 $0$。在三维情形，平面内可取两个线性无关的特征向量，再加上垂直于平面的那一个，一共凑出三个线性无关的特征向量。这个结论完全没有用到投影矩阵的公式 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$，只看几何图像就够了。

**置换矩阵。** 再看



$$
A=\begin{bmatrix}0&1\\1&0\end{bmatrix}.
$$



它把向量的两个分量交换：$A(x_1,x_2)=(x_2,x_1)$。什么样的向量交换之后仍是自己的倍数？

$\boldsymbol{x}=(1,1)$ 可以，因为交换后还是 $(1,1)$，所以 $\lambda=1$。$2\times 2$ 矩阵应当有两个特征值，另一个是 $-1$，对应的向量是 $(-1,1)$：交换两个分量得 $(1,-1)$，正好是原向量的相反数，



$$
A\begin{bmatrix}-1\\1\end{bmatrix}=\begin{bmatrix}1\\-1\end{bmatrix}=-\begin{bmatrix}-1\\1\end{bmatrix}.
$$



这里有一个值得留意的现象：$A$ 的四个元素都非负，它却有一个负特征值。

两条特征值一经列出，就能验证一个普遍事实。对 $n\times n$ 矩阵，全部特征值之和等于主对角线上 $n$ 个元素之和，



$$
\lambda_1+\lambda_2+\cdots+\lambda_n=a_{11}+a_{22}+\cdots+a_{nn}.
$$



右边这个量叫矩阵的**迹**（trace）。置换矩阵的迹是 $0+0=0$，特征值之和是 $1+(-1)=0$，吻合。它的用处很实际：在 $2\times 2$ 情形，只要算出一个特征值，另一个立刻由迹减出来，不必再解方程。

顺带还有一个观察。上面的两个特征向量 $(1,1)$ 与 $(-1,1)$ 的内积为零，即互相垂直。这不是巧合，而是对称矩阵的必然性质：$A$ 关于主对角线对称，它的特征向量就两两正交。这一点在对称矩阵那一讲会得到完整解释，这里先记住现象。

![视频 00:12:19：课堂板书](</attachments/mit1806-414ffafefff2721be2b43324.jpg>)

*视频 00:12:19｜约对应第 2 节「2. 先看两个能“看出”答案的矩阵」附近。*

![视频 00:15:25：课堂板书](</attachments/mit1806-540f80bc0186aedbed4d100b.jpg>)

*视频 00:15:25｜约对应第 2 节「2. 先看两个能“看出”答案的矩阵」附近。*

## 3. 特征方程：把 $\lambda$ 先解出来

现在面对一般问题：怎样求 $A$ 的特征值和特征向量？直接看 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 会发现无处下手，因为未知量有两个（$\lambda$ 和 $\boldsymbol{x}$），而且它们是相乘的，任何消元都处理不了这种结构。办法是把 $\lambda\boldsymbol{x}$ 移到左边。

$\lambda\boldsymbol{x}$ 可以写成 $\lambda I\boldsymbol{x}$，其中 $I$ 是单位矩阵，这样才能把两项合并成一次矩阵乘法：



$$
A\boldsymbol{x}-\lambda I\boldsymbol{x}=\boldsymbol{0},\qquad (A-\lambda I)\boldsymbol{x}=\boldsymbol{0}.
$$



这一步把“$A$ 作用在 $\boldsymbol{x}$ 上等于 $\lambda\boldsymbol{x}$”改写成“某个矩阵作用在 $\boldsymbol{x}$ 上等于零”，也就是求零空间的问题。零向量永远满足它，但零向量不是特征向量，没有意义；我们要的是非零解。

于是关键条件出现：$(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$ 有非零解，当且仅当 $A-\lambda I$ 奇异。而矩阵奇异等价于行列式为零，所以



$$
\det(A-\lambda I)=0.
$$



这个方程叫**特征方程**（characteristic equation）。它的价值在于：$\boldsymbol{x}$ 已经被消掉了，剩下的是一个只含 $\lambda$ 的方程。

具体形状取决于阶数。$A-\lambda I$ 是把 $A$ 的主对角线各减去 $\lambda$ 得到的矩阵；对它展开行列式，得到一个 $\lambda$ 的多项式，称为**特征多项式**（characteristic polynomial）。对 $n\times n$ 矩阵，这个多项式的次数是 $n$，因此 $n\times n$ 矩阵有 $n$ 个特征值（重根按重数计）。阶数一高，解这个方程就很吃力：$n=3$ 要解三次方程，$n=4$ 要解四次方程，越往上越没有简便办法。这正是后面要专门研究有特殊结构矩阵的原因。

求特征值的流程因此分成两步，顺序不能颠倒：

1. 解 $\det(A-\lambda I)=0$，求出 $n$ 个特征值；
2. 对每个特征值 $\lambda$，求 $A-\lambda I$ 的零空间，取一组基作为对应的特征向量。

第二步是熟悉的工作。此时 $A-\lambda I$ 已经保证奇异，求零空间只需消元、找出主变量与自由变量，再给自由变量取值；通常只有一个自由变量，取 $1$ 就得到所需的特征向量。也正因为零空间一般是一条直线，第 1 节说过“特征向量”其实是一整条直线，我们要的只是它上面一个向量。

还要提前说明一个麻烦：$n\times n$ 矩阵确有 $n$ 个特征值，但它们可能重复。重复的特征值是这门课里许多麻烦的根源，第 7 节会看到它如何导致特征向量数量不足。

![视频 00:19:31：课堂板书](</attachments/mit1806-ad0ef74d0a201f870708050a.jpg>)

*视频 00:19:31｜约对应第 3 节「3. 特征方程：把 $\lambda$ 先解出来」附近。*

![官方讲义摘要 第 2/3 页](</attachments/mit1806-e6fcc09dbdc17a4b1aa2dee7.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 21 Summary，CC BY-NC-SA 4.0）。*

![视频 00:26:44：课堂板书](</attachments/mit1806-cc001fae8cbe7fa24bed668a.jpg>)

*视频 00:26:44｜约对应第 3 节「3. 特征方程：把 $\lambda$ 先解出来」附近。*

## 4. 例：一个 $2\times 2$ 对称矩阵

用一个具体矩阵走完上面的流程。取



$$
A=\begin{bmatrix}3&1\\1&3\end{bmatrix}.
$$



它是对称矩阵，对角线上两个数相同。先算特征多项式：



$$
\det(A-\lambda I)=\begin{vmatrix}3-\lambda&1\\1&3-\lambda\end{vmatrix}=(3-\lambda)^2-1=\lambda^2-6\lambda+8.
$$



令它等于零，得到二次方程 $\lambda^2-6\lambda+8=0$。注意两个系数：一次项系数的相反数是 $6$，而 $A$ 的迹是 $3+3=6$；常数项是 $8$，而 $\det A=3\cdot 3-1\cdot 1=8$。对任何 $2\times 2$ 矩阵都有这个规律：



$$
\lambda^2-(\operatorname{tr}A)\lambda+\det A=0,
$$



即一次项系数是迹的相反数，常数项是行列式。这也给出了第二条捷径：$\lambda_1\lambda_2=\det A$。

这个二次式可以因式分解：$\lambda^2-6\lambda+8=(\lambda-4)(\lambda-2)$。所以



$$
\lambda_1=4,\qquad \lambda_2=2.
$$



验算：$4+2=6$ 等于迹，$4\times 2=8$ 等于行列式。

接着逐个求特征向量。

对 $\lambda_1=4$，作 $A-4I$：



$$
A-4I=\begin{bmatrix}-1&1\\1&-1\end{bmatrix}.
$$



它其实只含一个独立方程 $-x_1+x_2=0$，即 $x_1=x_2$。零空间是 $(1,1)$ 张成的直线，所以



$$
\boldsymbol{x}_1=\begin{bmatrix}1\\1\end{bmatrix}.
$$



代回检验：$A\boldsymbol{x}_1=(3+1,\ 1+3)=(4,4)=4\boldsymbol{x}_1$，正确。

对 $\lambda_2=2$，作 $A-2I$：



$$
A-2I=\begin{bmatrix}1&1\\1&1\end{bmatrix}.
$$



方程是 $x_1+x_2=0$，零空间由 $(-1,1)$ 张成，所以



$$
\boldsymbol{x}_2=\begin{bmatrix}-1\\1\end{bmatrix}.
$$



检验：$A\boldsymbol{x}_2=\bigl(3(-1)+1,\ -1+3\bigr)=(-2,2)=2\boldsymbol{x}_2$，正确。注意 $(-1,1)$ 与 $(1,1)$ 的内积为 $-1+1=0$，两个特征向量仍然垂直。这个对称矩阵与上一节的置换矩阵完全平行：实特征值、正交的特征向量。

## 5. 平移矩阵：加 $3I$ 之后发生了什么

第 4 节的矩阵和第 2 节的置换矩阵之间有一个简单关系：



$$
\begin{bmatrix}3&1\\1&3\end{bmatrix}=\begin{bmatrix}0&1\\1&0\end{bmatrix}+3I.
$$



既然知道置换矩阵的特征值是 $1$ 和 $-1$、特征向量是 $(1,1)$ 和 $(-1,1)$，新矩阵的特征值与特征向量会怎样？

特征值各加 $3$：$1+3=4$，$-1+3=2$，正是第 4 节算出的结果。特征向量完全不变：$(1,1)$ 和 $(-1,1)$ 仍然是特征向量。原因可以一行写出。若 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，则



$$
(A+3I)\boldsymbol{x}=A\boldsymbol{x}+3I\boldsymbol{x}=\lambda\boldsymbol{x}+3\boldsymbol{x}=(\lambda+3)\boldsymbol{x}.
$$



同一个 $\boldsymbol{x}$，特征值多了 $3$。一般地，给矩阵加上 $cI$，特征值全部平移 $c$，特征向量一个不动。

这件事之所以成立，是因为 $3I$ 作用在任何向量上都只是把它乘以 $3$，不改变方向。如果换成一般的矩阵 $B$，结论立刻失效。下面这个错误的推理很值得看清：

> 设 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，又设 $B$ 有特征值 $\alpha$。于是 $A\boldsymbol{x}+B\boldsymbol{x}=(\lambda+\alpha)\boldsymbol{x}$，所以 $A+B$ 的特征值是 $\lambda+\alpha$。

错在第二句：凭什么说 $B\boldsymbol{x}=\alpha\boldsymbol{x}$？$B$ 的特征向量是 $\boldsymbol{x}$ 这件事没有任何理由——$B$ 是另一个矩阵，通常有另一组特征向量 $\boldsymbol{y}$。$\boldsymbol{x}$ 不是 $B$ 的特征向量，$B\boldsymbol{x}$ 与 $\boldsymbol{x}$ 不同向，$A\boldsymbol{x}+B\boldsymbol{x}$ 也就不是 $\boldsymbol{x}$ 的倍数，这个论证一步都推不下去。

结论是：一般情况下 $A+B$ 的特征值不是 $\lambda+\alpha$，$AB$ 的特征值也不是 $\lambda\alpha$。特征值对加法、乘法都没有这种线性关系，唯一的例外是其中一个矩阵为 $cI$。若要知道 $A+B$ 的特征值，只能重新解一遍特征方程。

![视频 00:33:24：课堂板书](</attachments/mit1806-caa8ba809878c132ad90523d.jpg>)

*视频 00:33:24｜约对应第 5 节「5. 平移矩阵：加 $3I$ 之后发生了什么」附近。*

## 6. 旋转矩阵：特征值可能是复数

下一个例子会打破“特征值总是实数”的印象。取 $90^\circ$ 的旋转矩阵



$$
Q=\begin{bmatrix}0&-1\\1&0\end{bmatrix}.
$$



一般的旋转矩阵是 $\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}$，代入 $\theta=90^\circ$，即 $\cos 90^\circ=0$、$\sin 90^\circ=1$。它是正交矩阵（orthogonal matrix）。

先不动笔，用迹和行列式判断有没有实数解。迹是 $0+0=0$，所以 $\lambda_1+\lambda_2=0$；又 $\det Q=0\cdot 0-(-1)\cdot 1=1$，所以 $\lambda_1\lambda_2=1$。两个实数要同时满足“和为 $0$、积为 $1$”：和为 $0$ 说明它们一正一负，乘积只能是负数，不可能等于 $1$。矛盾，所以 $Q$ 没有实数特征值。

几何上也说得通：$Q$ 把每个非零向量都转 $90^\circ$，没有哪个向量旋转后仍与自己同向。

按部就班地算一遍：



$$
\det(Q-\lambda I)=\begin{vmatrix}-\lambda&-1\\1&-\lambda\end{vmatrix}=\lambda^2+1.
$$



令它为零，得



$$
\lambda^2+1=0,\qquad \lambda=\mathrm{i},\ \lambda=-\mathrm{i}.
$$



一个完全由实数组成的矩阵，特征值却是复数。而且这两个数互为**复共轭**（complex conjugate），即虚部符号相反。只要矩阵元素全是实数，特征多项式就是实系数多项式，它的复根必然成共轭对出现。

比较已经算过的几个矩阵，会看到一条清晰的谱线。置换矩阵 $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ 的特征值是 $1$ 和 $-1$，矩阵 $\begin{bmatrix}3&1\\1&3\end{bmatrix}$ 的特征值是 $4$ 和 $2$，两者都是对称矩阵，特征值都是实数。而 $Q$ 满足 $Q^{\mathsf T}=-Q$，把矩阵翻过主对角线看所有元素都变号，它关于主对角线反对称——这是对称的极端反面，它得到的是纯虚数特征值。越靠近对称，特征值越“实”；越远离对称，特征值越“虚”。夹在中间的一般矩阵可以看成有一个对称部分和一个反对称部分，它的特征值可能全为实数，也可能成共轭对出现，具体由矩阵本身决定。

![视频 00:40:22：课堂板书](</attachments/mit1806-748ef4958832b8c662937b6a.jpg>)

*视频 00:40:22｜约对应第 6 节「6. 旋转矩阵：特征值可能是复数」附近。*

## 7. 重复特征值与特征向量的短缺

最后一个例子把麻烦推到更深的一层。把第 4 节矩阵的一个元素改掉：



$$
A=\begin{bmatrix}3&1\\0&3\end{bmatrix}.
$$



它是上三角矩阵，对角线上两个 $3$。三角矩阵的行列式就是对角元素之积，所以



$$
\det(A-\lambda I)=\begin{vmatrix}3-\lambda&1\\0&3-\lambda\end{vmatrix}=(3-\lambda)^2.
$$



方程 $(3-\lambda)^2=0$ 给出



$$
\lambda_1=3,\qquad \lambda_2=3,
$$



特征值重复了：两个都是 $3$。这里也看出三角矩阵的好处：特征值就摆在主对角线上，一眼可读，特征多项式也最好算。麻烦出在特征向量上。

对 $\lambda=3$，作 $A-3I$：



$$
A-3I=\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



它只有一个非零方程 $x_2=0$，$x_1$ 是自由变量，零空间是 $(1,0)$ 张成的直线。这给出一个特征向量



$$
\boldsymbol{x}_1=\begin{bmatrix}1\\0\end{bmatrix}.
$$



现在想给第二个特征值 $3$ 配第二个特征向量。可是 $\lambda$ 还是 $3$，$A-3I$ 还是同一个矩阵，零空间还是同一条直线。无论怎么取值，能拿到的都只是 $(1,0)$ 的倍数，找不到与它线性无关的向量。于是这个 $2\times 2$ 矩阵只有一个独立的特征向量，凑不出两个。

这就是重复特征值带来的麻烦：重根会打开“特征向量短缺”的可能。$2\times 2$ 矩阵本应有两个线性无关的特征向量，这个矩阵却只有一个，它的特征向量无法把整个平面铺满，因此不能完整地描述 $A$ 的行为。下一讲会把这些情形放在一起处理，给出完整的说法。

![官方讲义摘要 第 3/3 页](</attachments/mit1806-ceb87cd413fea7671143007d.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 21 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **特征向量**（eigenvector）是满足 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 的非零向量：$A$ 作用在它上面不改变方向，只做伸缩或反向；**特征值**（eigenvalue）就是伸缩倍数 $\lambda$，可以为负、为零或为复数。特征向量是一整条直线，$c\boldsymbol{x}$ 与 $\boldsymbol{x}$ 有相同的特征值。
- $\lambda=0$ 当且仅当 $A$ 奇异：此时特征向量就是零空间中的非零向量。“$0$ 是特征值”与“$A$ 不可逆”是同一件事。
- 投影矩阵的特征值是 $1$ 和 $0$：平面内的向量满足 $P\boldsymbol{x}=\boldsymbol{x}$，垂直于平面的向量满足 $P\boldsymbol{x}=\boldsymbol{0}$；三维情形共可凑出三个线性无关的特征向量。
- 置换矩阵 $\begin{bmatrix}0&1\\1&0\end{bmatrix}$ 的特征值是 $1$ 与 $-1$，特征向量为 $(1,1)$ 与 $(-1,1)$，两者正交（因为 $A$ 对称）。
- $n\times n$ 矩阵的 $n$ 个特征值之和等于**迹**（trace）$\sum a_{ii}$；在 $2\times 2$ 情形这一步给出 $\lambda^2-(\operatorname{tr}A)\lambda+\det A=0$，只要知道一个特征值，另一个由迹直接读出。
- 求特征值的路线：把 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 改写为 $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$，令 $\det(A-\lambda I)=0$（**特征方程**）先解出 $\lambda$，再对每个 $\lambda$ 求 $A-\lambda I$ 的零空间得到特征向量。
- 例：$\begin{bmatrix}3&1\\1&3\end{bmatrix}$ 的特征多项式是 $\lambda^2-6\lambda+8=(\lambda-4)(\lambda-2)$，特征值 $4$ 与 $2$，特征向量 $(1,1)$ 与 $(-1,1)$。
- $A+3I$ 与 $A$ 有相同的特征向量，特征值全部加 $3$：置换矩阵的 $\{1,-1\}$ 变成 $\{4,2\}$。但一般地 $A+B$ 的特征值不是两者特征值之和，$AB$ 的也不是积。
- $90^\circ$ 旋转矩阵 $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$ 满足 $Q^{\mathsf T}=-Q$，特征值是 $\mathrm{i}$ 与 $-\mathrm{i}$；实矩阵可以有复数特征值，且共轭成对出现。
- 上三角矩阵 $\begin{bmatrix}3&1\\0&3\end{bmatrix}$ 的特征值就是对角元 $3,3$，但只有一个线性无关的特征向量 $(1,0)$——重复特征值会导致特征向量短缺。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| eigenvector | 特征向量 | 满足 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 的非零向量，$A$ 作用后方向不变 |
| eigenvalue | 特征值 | 特征向量在 $A$ 作用下的伸缩倍数 $\lambda$ |
| characteristic equation | 特征方程 | $\det(A-\lambda I)=0$，用来先求出全部特征值 |
| characteristic polynomial | 特征多项式 | $\det(A-\lambda I)$ 展开得到的 $\lambda$ 的多项式，次数为 $n$ |
| trace | 迹 | 主对角元之和，等于全部特征值之和 |
| projection matrix | 投影矩阵 | 把向量投影到子空间上的矩阵，特征值为 $1$ 与 $0$ |
| permutation matrix | 置换矩阵 | 交换向量坐标分量的矩阵，$2\times 2$ 交换阵的特征值为 $1$ 与 $-1$ |
| singular matrix | 奇异矩阵 | 行列式为零、零空间含非零向量的矩阵，等价于 $0$ 是其特征值 |
| nullspace | 零空间 | 满足 $A\boldsymbol{x}=\boldsymbol{0}$ 的向量集合；$\lambda$ 对应的特征向量就在 $A-\lambda I$ 的零空间里 |
| rotation matrix | 旋转矩阵 | 把每个向量旋转固定角度的矩阵，$90^\circ$ 旋转的特征值为 $\pm\mathrm{i}$ |
| orthogonal matrix | 正交矩阵 | 旋转矩阵是它最重要的例子，$90^\circ$ 旋转矩阵就属于这一类 |
| anti-symmetric matrix | 反对称矩阵 | 满足 $Q^{\mathsf T}=-Q$ 的矩阵，$90^\circ$ 旋转矩阵是典型例子，特征值为纯虚数 |
| complex conjugate | 复共轭 | 虚部变号得到的复数；实矩阵的复特征值总成共轭对出现 |
| repeated eigenvalue | 重复特征值 | 特征多项式的重根，可能导致线性无关的特征向量数量不足 |
| linearly independent | 线性无关 | 无法用非平凡线性组合得到零向量的向量组 |

---

[← Lecture 20](/notes/mit-1806/lec20) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 22 →](/notes/mit-1806/lec22)
