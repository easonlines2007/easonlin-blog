---
title: Lecture 24 · 马尔可夫矩阵与傅里叶级数
description: 理解马尔可夫矩阵的稳态与傅里叶级数的投影结构。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 25
tags:
  - lineal algebra
status: completed
publish: true
---

> *Markov matrices; fourier series* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 24 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p24 · 马尔可夫矩阵与傅里叶级数](https://www.bilibili.com/video/BV1ix411f7Yp?p=24)（51:12）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24-markov-matrices-fourier-series/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=24&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

前几讲已经用特征值和特征向量解出了差分方程与微分方程：只要初始向量能展开成特征向量的组合，$A^k\boldsymbol{u}_0$ 与 $e^{At}\boldsymbol{u}_0$ 就都能写成 $\lambda_i^k$ 和 $e^{\lambda_i t}$ 的线性组合，长期行为分别由绝对值最大的特征值（差分情形）与实部最大的特征值（微分情形）决定。本讲把这条思路用到两类对象上：前半讲是概率与人口流动中的**马尔可夫矩阵**（Markov matrix），后半讲是把“在基下展开”的想法推广到函数空间，得到**傅里叶级数**（Fourier series）。

马尔可夫矩阵是一类很特殊的矩阵：所有元素非负，每一列的元素之和等于 $1$。这两个条件看上去只是概率论的语言，却直接决定了它的谱结构——$\lambda=1$ 一定是特征值，其余特征值的绝对值都不超过 $1$。于是幂 $A^k$ 不会发散；只要没有别的模为 $1$ 的特征值，随着 $k$ 增大，$\lambda=1$ 那一项留下来成为**稳态**（steady state），其余各项全部衰减。上一讲微分方程的稳态靠的是 $\lambda=0$，这里靠的却是 $\lambda=1$。这场 $1$ 与 $0$ 的交换，正是“反复乘 $A$”与“对时间求导”这两种运算的差别。

后半讲换了一个舞台：把 $\mathbb{R}^n$ 换成函数空间。函数可以相加、可以数乘，因此也构成向量空间；两个函数的**内积**（inner product）用积分代替点积，而 $1,\cos x,\sin x,\cos 2x,\sin 2x,\dots$ 在这套内积下两两正交，构成一组无穷维的正交基。于是把一个周期函数按这组基展开，系数就像有限维情形一样用内积逐个“筛”出来——这就是傅里叶级数，也是投影一章最漂亮的应用。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-a2759359e40383bd89c88eba.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 24 Summary，CC BY-NC-SA 4.0）。*

## 1. 马尔可夫矩阵及其两条性质

一个方阵称为**马尔可夫矩阵**，如果它同时满足两个条件：

1. 每个元素都非负：$a_{ij}\ge 0$；
2. 每一列的元素之和等于 $1$：$\sum_{i}a_{ij}=1$。

随手写一个例子：



$$
A=\begin{bmatrix}
0.1&0.01&0.3\\
0.2&0.99&0.3\\
0.7&0&0.4
\end{bmatrix}.
$$



三列之和分别是 $0.1+0.2+0.7=1$、$0.01+0.99+0=1$、$0.3+0.3+0.4=1$，元素也没有负数，所以它确实是马尔可夫矩阵。元素允许等于 $0$——例子里 $(3,2)$ 位置就是 $0$，表示从第二个状态到第三个状态没有直接转移——只是不允许为负。

这两条性质为什么总是成对出现？因为它们来自同一个应用场景：把矩阵元素解释成**概率**。第 $j$ 列描述的是“处于状态 $j$ 的对象下一步去哪里”，其中 $a_{ij}$ 是从状态 $j$ 转移到状态 $i$ 的比例。比例不可能为负，这是第一条；所有对象都必须有个去处（包括留在原状态），所以第 $j$ 列的元素加起来正好是 $1$，这是第二条。

用这种眼光看，矩阵的幂很容易理解：$A^2$ 的元素是“从某一状态出发、经过两步到达另一状态”的比例，仍然是概率，列和仍然是 $1$。一般地，马尔可夫矩阵的任意次幂仍是马尔可夫矩阵。这一点也可以直接验证。记全 $1$ 行向量为 $\boldsymbol{1}^{\mathsf T}=(1,1,\dots,1)$，“每列之和为 $1$”恰好等价于



$$
\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}.
$$



两边右乘 $A$，得 $\boldsymbol{1}^{\mathsf T}A^2=\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}$，再接下去同样成立。所以“列和为 $1$”这条性质在反复求幂时不会丢失，非负性也不会丢，因为非负矩阵的乘积仍然非负。

本讲研究的方程是



$$
\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k,\qquad \boldsymbol{u}_k=A^k\boldsymbol{u}_0,
$$



其中 $\boldsymbol{u}_k$ 的第 $i$ 个分量表示第 $k$ 步处于状态 $i$ 的数量或比例。由于每列之和为 $1$，总量在整个过程中守恒：



$$
\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_{k+1}=\boldsymbol{1}^{\mathsf T}A\boldsymbol{u}_k=\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_k .
$$



这正是“概率加起来等于 $1$”、不丢失也不增加人口的矩阵写法。

![视频 00:05:07：课堂板书](</attachments/mit1806-4321d9a522f3e8906f49557c.jpg>)

*视频 00:05:07｜约对应第 1 节「1. 马尔可夫矩阵及其两条性质」附近。*

## 2. 稳态：$\lambda=1$ 的角色

马尔可夫矩阵的谱结构由两条关键事实刻画：

1. $\lambda=1$ 一定是 $A$ 的特征值；
2. 其余特征值的绝对值都小于 $1$（个别情形下可能等于 $1$，但绝不会大于 $1$）。

第二条里“等于 $1$”的例外会让对应的那一项 $\lambda_i^k$ 不衰减，长期行为就不再收敛到单一方向；只要没有这种例外，下面的推导就成立。

先接受这两条，看它们如何决定长期行为。设 $A$ 有 $n$ 个线性无关的特征向量 $\boldsymbol{x}_1,\dots,\boldsymbol{x}_n$，对应特征值 $\lambda_1,\dots,\lambda_n$，其中 $\lambda_1=1$。把初始向量在这些特征向量下展开：



$$
\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+\cdots+c_n\boldsymbol{x}_n .
$$



两边乘 $A^k$，用 $A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i$，得



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0
=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+\cdots+c_n\lambda_n^k\boldsymbol{x}_n .
$$



这里有一个前提必须点明：特征向量要足够多，能够张满整个空间，否则 $\boldsymbol{u}_0$ 根本展开不出来，计算无法启动——也就是 $A$ 必须可对角化。

现在令 $k\to\infty$。第一项里 $\lambda_1^k=1^k=1$ 保持不变，其余各项因 $|\lambda_i|<1$ 而趋于零，于是



$$
\boldsymbol{u}_k\longrightarrow c_1\boldsymbol{x}_1 .
$$



在其余特征值的模都严格小于 $1$ 的情形，这就是**稳态**：无论初始分布怎样，系统最终落在特征向量 $\boldsymbol{x}_1$ 的方向上，具体的倍数由初始条件决定。与上一讲的微分方程对照一下会更清楚。那边 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$ 的解含 $e^{\lambda t}$，稳态对应 $\lambda=0$，因为 $e^{0t}=1$ 是唯一不随时间变化的项；这边换成了离散的幂，$0^k$ 一步就死掉，$1^k=1$ 才是不变的项。所以“长时间后留下什么”由不同的特征值负责，取决于时间是连续的还是离散的。

$\boldsymbol{x}_1$ 还有一条性质：它的所有分量都非负；若初始向量各分量都为正，则稳态的各分量也都为正。这不是偶然，而是“概率不会变成负数”在特征向量上的体现。本讲不给这条性质的证明，只是用它来核对算出的结果是否合理。

![视频 00:11:01：课堂板书](</attachments/mit1806-e092babb2c12ca391c986d87.jpg>)

*视频 00:11:01｜约对应第 2 节「2. 稳态：$\lambda=1$ 的角色」附近。*

## 3. 为什么 $1$ 一定是特征值

要证明 $1$ 是特征值，等价于证明 $A-I$ 奇异，因为特征值就是那些使 $A-\lambda I$ 奇异的数。关键在于从马尔可夫矩阵的两条性质里找出 $A-I$ 的毛病。

看 $A-I$ 的列。$A$ 的每一列之和为 $1$；单位矩阵 $I$ 的每一列只有一个 $1$，所以每列之和也是 $1$。两列对应相减，$A-I$ 的每一列之和都是 $1-1=0$。上节的例子给出



$$
A-I=\begin{bmatrix}
-0.9&0.01&0.3\\
0.2&-0.01&0.3\\
0.7&0&-0.6
\end{bmatrix},
$$



三列分别求和：$-0.9+0.2+0.7=0$，$0.01-0.01+0=0$，$0.3+0.3-0.6=0$，确实全为零。

列和为零意味着把 $A-I$ 的三行统统加起来会得到零行：



$$
\begin{bmatrix}1&1&1\end{bmatrix}(A-I)=\begin{bmatrix}0&0&0\end{bmatrix}.
$$



于是 $A-I$ 的三行线性相关。方阵的行向量线性相关就意味着奇异，所以 $\det(A-I)=0$，$\lambda=1$ 是特征值。这个论证对任何马尔可夫矩阵都成立，完全不需要去算行列式——这正是本讲想要的东西：从矩阵的结构直接读出谱信息。

注意 $(1,1,1)$ 出现的位置：它乘在左边，所以它是 $A-I$ 的**左零空间**（left nullspace）中的向量；换个说法，它是 $A^{\mathsf T}$ 关于特征值 $1$ 的特征向量，而不是 $A$ 自己的特征向量。要找 $A$ 的特征向量 $\boldsymbol{x}_1$，得去看 $A-I$ 的零空间，也就是找一组使 $A-I$ 的列组合成零向量的系数，因为



$$
(A-I)\boldsymbol{x}_1=\boldsymbol{0}
$$



正是 $A\boldsymbol{x}_1=\boldsymbol{x}_1$ 的变形。这组系数就是稳态。回过头看，这就是求特征向量的一般流程：先解 $\det(A-\lambda I)=0$ 定出 $\lambda$，再解 $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$ 定出 $\boldsymbol{x}$。马尔可夫矩阵的特殊之处只在于第一步是免费的。

顺带可以得到一条关于转置的事实：$A$ 与 $A^{\mathsf T}$ 的特征值完全相同。理由是



$$
\det(A-\lambda I)=\det\bigl((A-\lambda I)^{\mathsf T}\bigr)=\det(A^{\mathsf T}-\lambda I),
$$



第一步用了“矩阵的行列式等于其转置的行列式”。所以 $A-\lambda I$ 奇异当且仅当 $A^{\mathsf T}-\lambda I$ 奇异，两者的特征值集合一致。回到马尔可夫情形：前面已经找到 $A^{\mathsf T}$ 关于 $\lambda=1$ 的特征向量是 $(1,1,1)$，这条事实保证同一个 $1$ 也是 $A$ 的特征值。但两边的特征向量不同，左零空间和零空间是两回事。

现在把例子里的 $\boldsymbol{x}_1$ 算出来。解 $(A-I)\boldsymbol{x}=\boldsymbol{0}$：



$$
\begin{cases}
-0.9x_1+0.01x_2+0.3x_3=0,\\
0.2x_1-0.01x_2+0.3x_3=0,\\
0.7x_1-0.6x_3=0.
\end{cases}
$$



特征向量可以任意伸缩，所以先令 $x_1=6$。第三个方程给出 $0.7\times 6=0.6x_3$，即 $x_3=7$。再回到第一个方程：$-0.9\times6+0.3\times7=-5.4+2.1=-3.3$，要把它归零，需要 $0.01x_2=3.3$，即 $x_2=330$。于是



$$
\boldsymbol{x}_1=\begin{bmatrix}6\\330\\7\end{bmatrix}.
$$



代回第二个方程核对：$0.2\times6-0.01\times330+0.3\times7=1.2-3.3+2.1=0$，无误。三个分量全是正数，与前面“稳态非负”的说法一致。若再按分量之和归一化（$6+330+7=343$），得到的 $(6,330,7)/343$ 就是三个状态上的稳态概率分布。

![官方讲义摘要 第 2/4 页](</attachments/mit1806-bb4e0bb9041a612fe03a3ffa.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 24 Summary，CC BY-NC-SA 4.0）。*

![视频 00:19:27：课堂板书](</attachments/mit1806-5a42a0a7f932e350eeccdda1.jpg>)

*视频 00:19:27｜约对应第 3 节「3. 为什么 $1$ 一定是特征值」附近。*

## 4. 一个例子：加州与麻省的人口流动

马尔可夫矩阵从哪里来？最直观的来源是人口在两个状态之间的迁移。设 $u_{\text{Cal}}(k)$、$u_{\text{Mass}}(k)$ 分别是第 $k$ 年加州与麻省的人口，每年迁移的比例固定，则



$$
\begin{bmatrix}u_{\text{Cal}}\\u_{\text{Mass}}\end{bmatrix}_{k+1}
=\begin{bmatrix}0.9&0.2\\0.1&0.8\end{bmatrix}
\begin{bmatrix}u_{\text{Cal}}\\u_{\text{Mass}}\end{bmatrix}_{k}.
$$



按“列是来源、行是去向”的约定读这个矩阵：第一列讲加州人——$90\%$ 留在加州，$10\%$ 搬到麻省；第二列讲麻省人——$80\%$ 留下，$20\%$ 搬到加州。两列之和都是 $1$，因为每一个人都被算了一次，总人口既不增加也不减少。矩阵每一步都一样，这是例子中一条很强的限制：迁移比例年年不变。

取初始时刻所有人都在麻省，共 $1000$ 人，即 $\boldsymbol{u}_0=(0,1000)^{\mathsf T}$。走一步：



$$
\boldsymbol{u}_1=A\boldsymbol{u}_0
=1000\begin{bmatrix}0.2\\0.8\end{bmatrix}
=\begin{bmatrix}200\\800\end{bmatrix},
$$



$200$ 人到了加州。再走一步，一部分人又搬回去：



$$
\boldsymbol{u}_2=A\boldsymbol{u}_1=\begin{bmatrix}340\\660\end{bmatrix},
$$



加州的数超过了 $200$，麻省降到 $800$ 以下，总和仍是 $1000$。要想知道 $100$ 步、甚至无穷步之后的人口，就必须求特征值和特征向量。

特征值很容易求。$\lambda_1=1$ 由“列和为 $1$”直接保证；用迹（对角线元素之和）$0.9+0.8=1.7$，由“特征值之和等于迹”得 $\lambda_2=1.7-1=0.7$。也可以用行列式核对：$0.9\times0.8-0.2\times0.1=0.72-0.02=0.70$。$\lambda_2=0.7<1$，符合关键事实二。

再求特征向量。$\lambda=1$ 时



$$
A-I=\begin{bmatrix}-0.1&0.2\\0.1&-0.2\end{bmatrix},
$$



两行互为相反数，零空间由 $(2,1)^{\mathsf T}$ 张成，取 $\boldsymbol{x}_1=(2,1)^{\mathsf T}$，两个分量都为正。$\lambda=0.7$ 时



$$
A-0.7I=\begin{bmatrix}0.2&0.2\\0.1&0.1\end{bmatrix},
$$



零空间由 $(1,-1)^{\mathsf T}$ 张成，取 $\boldsymbol{x}_2=(1,-1)^{\mathsf T}$。于是



$$
\boldsymbol{u}_k=c_1\,1^k\begin{bmatrix}2\\1\end{bmatrix}
+c_2\,(0.7)^k\begin{bmatrix}1\\-1\end{bmatrix}.
$$



用 $k=0$ 的初始条件定常数：$2c_1+c_2=0$，$c_1-c_2=1000$，解得 $c_1=1000/3$，$c_2=-2000/3$。所以



$$
\boldsymbol{u}_k=\frac{1000}{3}\begin{bmatrix}2\\1\end{bmatrix}
-\frac{2000}{3}(0.7)^k\begin{bmatrix}1\\-1\end{bmatrix}.
$$



取 $k=1$ 核验：加州 $=\frac{2000}{3}(1-0.7)=\frac{2000}{3}\times0.3=200$，麻省 $=\frac{1000}{3}+\frac{2000}{3}\times0.7=\frac{1000}{3}+\frac{1400}{3}=800$，与直接乘矩阵的结果一致。

稳态就是表达式中的第一项：$(2000/3,\,1000/3)\approx(667,333)$，它是 $(2,1)^{\mathsf T}$ 的倍数，倍数由总人口 $1000$ 定出。第二项带因子 $0.7^k$，随 $k$ 增大迅速消失；$0.7^{100}$ 已经小到可以忽略，所以 $100$ 步之后人口几乎就是 $(666.7,\,333.3)$。这就回答了“$A$ 的 $100$ 次方作用在 $\boldsymbol{u}_0$ 上是多少”这类问题：不必真的连乘 $100$ 次，只要看清 $0.7^{100}$ 这一项有多小。

最后一条备注：有些教材（尤其是电气工程和概率论的书）习惯用行向量，写成 $\boldsymbol{u}_{k+1}^{\mathsf T}=\boldsymbol{u}_k^{\mathsf T}M$。这时 $M=A^{\mathsf T}$，条件“列和为 $1$”就变成了“行和为 $1$”。两种写法描述的是同一件事，区别只在乘在左边还是右边、要不要转置。

![视频 00:33:17：课堂板书](</attachments/mit1806-69ad3e096c3934b16e3910cf.jpg>)

*视频 00:33:17｜约对应第 4 节「4. 一个例子：加州与麻省的人口流动」附近。*

## 5. 标准正交基下的展开

转到本讲后半部分。先复习一个事实：设 $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$ 是一组**标准正交**（orthonormal）向量，即两两正交且长度都为 $1$，并且它们张成整个 $\mathbb{R}^n$，那么它们构成一组基，任何向量 $\boldsymbol{v}$ 都可以展开成



$$
\boldsymbol{v}=x_1\boldsymbol{q}_1+x_2\boldsymbol{q}_2+\cdots+x_n\boldsymbol{q}_n .
$$



问题是怎么求出这些系数。办法出奇地简单：用 $\boldsymbol{q}_1$ 与等式两边做内积。由于 $\boldsymbol{q}_1^{\mathsf T}\boldsymbol{q}_1=1$，而 $\boldsymbol{q}_1^{\mathsf T}\boldsymbol{q}_j=0$（$j\neq 1$），右边只剩下一项：



$$
\boldsymbol{q}_1^{\mathsf T}\boldsymbol{v}=x_1 .
$$



对每个 $i$ 同理，$x_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{v}$。每个系数就是 $\boldsymbol{v}$ 在相应基向量方向上的分量。这正是投影：把 $\boldsymbol{v}$ 分别投影到 $n$ 个互相垂直的基方向上，得到的长度就是系数。换句话说，标准正交基把“展开”变成了一串内积，既不用解方程，也不用求逆矩阵。

把这件事写成矩阵形式。令 $Q$ 以 $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$ 为列，则展开式就是 $Q\boldsymbol{x}=\boldsymbol{v}$，形式解是 $\boldsymbol{x}=Q^{-1}\boldsymbol{v}$。而标准正交性给出



$$
Q^{\mathsf T}Q=I,
$$



即 $Q^{-1}=Q^{\mathsf T}$，于是 $\boldsymbol{x}=Q^{\mathsf T}\boldsymbol{v}$。它的第 $i$ 个分量是 $Q^{\mathsf T}$ 的第 $i$ 行（也就是 $\boldsymbol{q}_i^{\mathsf T}$）与 $\boldsymbol{v}$ 的内积，与逐个算出的结果完全相同。看到字母 $Q$ 就该想到 $Q^{-1}=Q^{\mathsf T}$——这是标准正交基带来的最大便利。

这一段还是有限维的，但傅里叶级数所需的准备已经全部到位：那里的“基向量”不再是 $\mathbb{R}^n$ 中的向量，而是函数。

![官方讲义摘要 第 3/4 页](</attachments/mit1806-f81fdeb57b13043d6b416f04.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 24 Summary，CC BY-NC-SA 4.0）。*

## 6. 傅里叶级数

傅里叶级数要解决的问题是：把一个函数 $f(x)$ 写成常数项、$\cos x$、$\sin x$、$\cos 2x$、$\sin 2x$……的线性组合，



$$
f(x)=a_0+a_1\cos x+b_1\sin x+a_2\cos 2x+b_2\sin 2x+\cdots
$$



它与上一节的展开式长得一模一样，唯一的区别是这里有无穷多项。为什么必须无穷多项？因为函数空间是**无穷维**的：一个函数在区间上取连续多个值，不可能用有限个参数描述完，所以需要无穷多个基函数。这一步标志着离开有限维向量空间，进入无穷维的情形。

所用的基函数是



$$
1,\ \cos x,\ \sin x,\ \cos 2x,\ \sin 2x,\ \dots
$$



它们全都以 $2\pi$ 为周期，所以只能用来表示同样以 $2\pi$ 为周期的函数，即 $f(x+2\pi)=f(x)$；积分区间因此取 $[0,2\pi]$。

接下来要定义函数的内积。有限维的点积是 $\boldsymbol{v}^{\mathsf T}\boldsymbol{w}=v_1w_1+\cdots+v_nw_n$：逐点相乘，再把结果相加。函数在区间上取遍连续多个值，逐点相乘之后的“求和”就变成了积分：



$$
\langle f,g\rangle=\int_0^{2\pi}f(x)g(x)\,\mathrm{d}x .
$$



这组基之所以好用，是因为它们在这个内积下两两正交。以 $\sin x$ 与 $\cos x$ 为例：



$$
\int_0^{2\pi}\sin x\cos x\,\mathrm{d}x
=\left[\frac12\sin^2x\right]_0^{2\pi}=0 .
$$



其余各组合同样为零（要借助一些三角恒等式）。最容易验证的一组是常数函数与 $\cos x$：



$$
\int_0^{2\pi}1\cdot\cos x\,\mathrm{d}x=\bigl[\sin x\bigr]_0^{2\pi}=0 .
$$



而每个基函数与自己的内积不为零，例如



$$
\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi .
$$



所以这是一组正交基，但尚未归一化：$\cos nx$、$\sin nx$ 的“长度”是 $\sqrt{\pi}$，常数函数 $1$ 的“长度”是 $\sqrt{2\pi}$，都不是 $1$。系数公式里那几个 $\pi$ 的分母就来自这里。

系数怎么求？方法与有限维完全相同：想求哪个系数，就用对应的基函数与等式两边做内积。求常数项 $a_0$，就用常数函数 $1$ 去乘、去积分。右边其余各项与 $1$ 的内积都是零，只剩下



$$
\int_0^{2\pi}f(x)\,\mathrm{d}x=a_0\int_0^{2\pi}1\,\mathrm{d}x=2\pi a_0,
$$



所以



$$
a_0=\frac{1}{2\pi}\int_0^{2\pi}f(x)\,\mathrm{d}x,
$$



它正好是 $f$ 在区间上的平均值。这也符合直觉：常数项就是函数里“平均含有”的那一份常数。

更典型的是 $a_1$。把展开式两边都乘以 $\cos x$ 再积分。由于正交性，右边除了 $a_1\cos x$ 那一项之外全部消失，只剩



$$
\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x
=a_1\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi a_1,
$$



于是



$$
a_1=\frac{1}{\pi}\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x .
$$



同样的做法给出每一个 $a_n$ 和 $b_n$：用 $\cos nx$ 或 $\sin nx$ 去做内积，右边只有对应那一项留下来，分母都是 $\pi$（常数项是 $2\pi$）。这就是傅里叶级数的系数公式，通常称为欧拉公式。系数的含义很具体：$a_0$ 是函数含有多少常数，$a_1$ 是含有多少 $\cos x$，$b_1$ 是含有多少 $\sin x$，依此类推，每个 $a_n$、$b_n$ 度量第 $n$ 个谐波（harmonic）的份量。求系数的动作也可以直白地说成：把展开式乘上某个基函数，再积分，别的项全被正交性杀掉，只剩想要的那一项。

回头看整个推导的结构，它与第 5 节逐字对应：向量换成函数，点积换成定积分，有限项相加换成无穷级数，正交向量换成正交函数系；而“系数等于内积除以基函数长度的平方”这条规则一字未改。傅里叶级数能够成立，靠的不是分析技巧，而是函数空间里也存在正交基。

![视频 00:40:42：课堂板书](</attachments/mit1806-2243373d4ece1460ec7f813e.jpg>)

*视频 00:40:42｜约对应第 6 节「6. 傅里叶级数」附近。*

![视频 00:46:05：课堂板书](</attachments/mit1806-8eb9b2c37484b6ef0b5cd0d1.jpg>)

*视频 00:46:05｜约对应第 6 节「6. 傅里叶级数」附近。*

![官方讲义摘要 第 4/4 页](</attachments/mit1806-4a731edfd0f7df37676e3b36.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 24 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **马尔可夫矩阵**（Markov matrix）的两条定义性质：所有元素非负；每列元素之和为 $1$。例子 $A=\begin{bmatrix}0.1&0.01&0.3\\0.2&0.99&0.3\\0.7&0&0.4\end{bmatrix}$ 满足这两条。
- 两条性质在求幂时保持：$\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}$ 推出 $\boldsymbol{1}^{\mathsf T}A^k=\boldsymbol{1}^{\mathsf T}$，所以 $A^k$ 仍是马尔可夫矩阵，总量 $\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_k$ 守恒。
- 关键事实一：$\lambda=1$ 一定是特征值。理由不是算行列式，而是 $A-I$ 的每列之和为零，于是 $(1,1,1)$ 在 $A-I$ 的左零空间中，行线性相关，$A-I$ 奇异。
- 关键事实二：其余特征值的绝对值都不超过 $1$，一般情形下严格小于 $1$；若存在模为 $1$ 的其他特征值（如置换矩阵的 $-1$），幂不收敛到单一稳态。在严格小于 $1$ 的情形，$\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+\cdots+c_n\lambda_n^k\boldsymbol{x}_n\to c_1\boldsymbol{x}_1$，这就是稳态；$c_1$ 由初始向量决定。微分方程的稳态对应 $\lambda=0$，这里对应 $\lambda=1$。
- 例子的稳态特征向量为 $\boldsymbol{x}_1=(6,330,7)^{\mathsf T}$：取 $x_1=6$ 后由 $0.7x_1=0.6x_3$ 得 $x_3=7$，再由第一行定出 $x_2=330$，三个分量皆正。
- $A$ 与 $A^{\mathsf T}$ 的特征值完全相同（因为 $\det(A-\lambda I)=\det(A^{\mathsf T}-\lambda I)$），但特征向量不同：$(1,1,1)$ 属于 $A^{\mathsf T}$，稳态属于 $A$。
- 加州—麻省例子：$A=\begin{bmatrix}0.9&0.2\\0.1&0.8\end{bmatrix}$，特征值 $1$ 与 $0.7$，特征向量 $(2,1)^{\mathsf T}$ 与 $(1,-1)^{\mathsf T}$；由 $\boldsymbol{u}_0=(0,1000)^{\mathsf T}$ 得 $\boldsymbol{u}_k=\frac{1000}{3}(2,1)^{\mathsf T}-\frac{2000}{3}(0.7)^k(1,-1)^{\mathsf T}$，稳态为 $(2000/3,1000/3)$。
- **标准正交基**（orthonormal basis）下 $Q^{\mathsf T}Q=I$、$Q^{-1}=Q^{\mathsf T}$，展开系数就是内积 $x_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{v}$。
- **傅里叶级数**（Fourier series）：函数空间的内积是积分 $\langle f,g\rangle=\int_0^{2\pi}fg\,\mathrm{d}x$，基 $1,\cos x,\sin x,\cos 2x,\sin 2x,\dots$ 两两正交；$a_0$ 是 $f$ 的平均值，$a_1=\frac{1}{\pi}\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x$，因为 $\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| Markov matrix | 马尔可夫矩阵 | 元素非负、每列之和为 $1$ 的方阵，描述按固定概率转移的系统 |
| steady state | 稳态 | 长时间后系统趋于的状态，即 $\lambda=1$ 的特征向量方向 |
| left nullspace | 左零空间 | 满足 $\boldsymbol{y}^{\mathsf T}A=\boldsymbol{0}$ 的向量 $\boldsymbol{y}$ 构成的空间，即 $N(A^{\mathsf T})$ |
| trace | 迹 | 对角线元素之和，等于全部特征值之和 |
| power of a matrix | 矩阵的幂 | $A^k$ 表示连续作用 $k$ 次，$A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i$ |
| diagonalizable | 可对角化 | 有足够多线性无关特征向量、能把初始向量展开的情形 |
| orthonormal | 标准正交 | 两两正交且长度都为 $1$ 的一组向量 |
| orthogonal matrix | 正交矩阵 | 列向量标准正交的方阵 $Q$，满足 $Q^{\mathsf T}Q=I$，故 $Q^{-1}=Q^{\mathsf T}$ |
| inner product | 内积 | 有限维是点积，函数空间是 $\int f g\,\mathrm{d}x$，用来判断正交、求展开系数 |
| Fourier series | 傅里叶级数 | 把周期为 $2\pi$ 的函数按 $1,\cos nx,\sin nx$ 展开，得到无穷项之和 |
| orthogonal basis | 正交基 | 两两正交的一组基向量或基函数，系数由内积逐个求出 |
| periodic function | 周期函数 | 满足 $f(x+2\pi)=f(x)$ 的函数，傅里叶展开的适用对象 |
| infinite dimensional | 无穷维 | 函数空间需要无穷多个基函数，因而傅里叶级数有无穷多项 |

---

[← Lecture 23](/notes/mit-1806/lec23) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 24b →](/notes/mit-1806/lec24b)
