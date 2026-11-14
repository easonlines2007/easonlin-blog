---
title: Lecture 32 · 第三次测验复习
description: 复习第三部分：特征值、正定性、SVD 与线性变换。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 34
tags:
  - lineal algebra
status: completed
publish: true
---

> *Quiz 3 review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 32 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p33 · 第三次测验复习](https://www.bilibili.com/video/BV1ix411f7Yp?p=33)（47:05）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-32-quiz-3-review/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=33&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

第三次测验的范围止于第六章：特征值（eigenvalue）与特征向量（eigenvector）、微分方程、对称矩阵（symmetric matrix）、正定（positive definite）矩阵、相似矩阵（similar matrices）与奇异值分解（singular value decomposition，SVD）。第七章的线性变换不在这次测验之内，留到期末。复习题大多取自往年考卷，它们有一个共同的出题方式：不考查繁复的矩阵运算，而是给出若干特征值、特征向量，或者告诉你矩阵属于某一类特殊矩阵，要求你据此判断它的性质。

第三部分的研究对象与前半学期有了根本不同。消元（elimination）靠的是行变换，而行变换会改变特征值，因此“先把矩阵消成上三角、再从对角线上读特征值”是行不通的；保持特征值的操作是相似变换 $B=M^{-1}AM$。不过，前面几讲建立的四个基本子空间并没有失效：到了 SVD，秩（rank）、零空间（nullspace）、列空间（column space）会以奇异值的形式重新出现。

本讲按“考点—方法—典型题”组织。前两个考点把特征值用活：先用一道微分方程题复习通解与稳定性，再用一道“只给特征值和特征向量”的题把对称、正定、马尔可夫、投影（projection）这些身份逐个判掉；第三个考点回到 SVD，补上求 $U$ 时最容易出错的符号一步；最后一个考点用“既对称又正交”的矩阵把特征值、正交性（orthogonality）与投影串成一道综合题。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-2d6020937af0fb04e88ff95a.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 32 Summary，CC BY-NC-SA 4.0）。*

## 1. 复习地图：特征值是第六章的统一语言

第六章的几个主题，都是同一个问题在不同方向上的展开：一个矩阵乘到向量上，究竟改变了什么。特征值与特征向量给出答案的一半——哪些方向不变、每个方向被拉伸多少倍；求法是解特征多项式（characteristic polynomial）$\det(A-\lambda I)=0$，这在第二次测验已经练过。本讲补充的是两条“不靠硬算”的捷径：矩阵奇异则必有一个特征值为 $0$；矩阵若属于特殊类型，其特征值有固定的形状。

- **微分方程**（differential equation）$\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$：通解是各特征模态的叠加，特征值实部的正负决定增长还是衰减，虚部决定振荡。
- **对称矩阵**：$A=A^{\mathsf T}$ 时特征值全为实数，特征向量可以取得两两正交，于是 $A=Q\Lambda Q^{\mathsf T}$，其中 $Q$ 是正交矩阵（orthogonal matrix），$\Lambda$ 是特征值组成的对角矩阵。
- **正定矩阵**：对称矩阵中特征值全为正的一类。
- **相似矩阵**：$B=M^{-1}AM$，同一个线性变换在两组基下的矩阵，特征值相同，幂也同步：$B^k=M^{-1}A^kM$。
- **SVD**：$A=U\Sigma V^{\mathsf T}$，对任意矩阵都存在；它把特征值理论推广到长方矩阵，也让四个基本子空间重新现身。

把这些关系记住以后，复习课上的题目就只剩一种类型：给出特征值或特征向量，让你在各条约束之间做排除。

![视频 00:04:43：课堂板书](</attachments/mit1806-a4df7a40c1659af83d01d9a5.jpg>)

*视频 00:04:43｜约对应第 1 节「1. 复习地图：特征值是第六章的统一语言」附近。*

## 2. 考点一：微分方程与斜对称矩阵

考点：给一个矩阵 $A$，写出 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$ 的通解，判断解的长期行为，并求周期与矩阵指数（matrix exponential）$e^{At}$。

一切从特征值与特征向量出发。若 $A$ 有三个线性无关的特征向量 $\boldsymbol{x}_1,\boldsymbol{x}_2,\boldsymbol{x}_3$，对应特征值 $\lambda_1,\lambda_2,\lambda_3$，则通解是



$$
\boldsymbol{u}(t)=c_1e^{\lambda_1 t}\boldsymbol{x}_1+c_2e^{\lambda_2 t}\boldsymbol{x}_2+c_3e^{\lambda_3 t}\boldsymbol{x}_3 .
$$



每一项都是“纯指数乘一个固定方向”：$\boldsymbol{x}_i$ 方向上的分量按 $e^{\lambda_i t}$ 单独演化，三个常数 $c_i$ 由初始条件 $\boldsymbol{u}(0)$ 定出。所以这类题的第一步永远是求特征值和特征向量。

典型题取



$$
A=\begin{bmatrix}0&-1&0\\1&0&-1\\0&1&0\end{bmatrix}.
$$



先不要算行列式。观察第一行与第三行：$(0,-1,0)$ 与 $(0,1,0)$ 恰好互为相反数，两行线性相关，所以 $A$ 奇异，$\lambda_1=0$（第一列与第三列同理线性相关）。这一步省掉了大量计算。

再看结构：$A$ 不是对称矩阵，而是 $A^{\mathsf T}=-A$，这类矩阵叫斜对称矩阵（skew-symmetric matrix）。它的特征值是纯虚数，全落在虚轴上；上面得到的 $0=0\cdot i$ 正落在原点，符合这个规律。把它算出来验证：



$$
\det(A-\lambda I)=\begin{vmatrix}-\lambda&-1&0\\1&-\lambda&-1\\0&1&-\lambda\end{vmatrix}=-\lambda^3-2\lambda,
$$



令其为零得 $\lambda(\lambda^2+2)=0$，于是



$$
\lambda_1=0,\qquad \lambda_2=i\sqrt2,\qquad \lambda_3=-i\sqrt2 .
$$



三个根中有一个零，与“$A$ 奇异”的预判吻合；另外两个是纯虚数，与“斜对称”的预判吻合。这就是复习课反复演示的做题顺序：先用结构定方向，再用计算做验证。

长期行为由特征值的实部决定。这里三个特征值的实部都是零，所以三个模态都不增长也不衰减：$e^{\pm i\sqrt2\,t}$ 的模长恒为 $1$，只是在单位圆上转动。因此解既不会发散，也不会趋于零，它是**周期**的。周期由 $e^{i\sqrt2\,T}=1$ 定出，即



$$
\sqrt2\,T=2\pi \quad\Longrightarrow\quad T=\pi\sqrt2 .
$$



经过 $T=\pi\sqrt2$ 后，每个模态都回到原值，于是 $\boldsymbol{u}(T)=\boldsymbol{u}(0)$ 对任意初始向量成立。这是“特征值没有实部”的直接后果：振荡而不衰减。

附带一条结构结论：斜对称矩阵的复特征向量也两两正交。更一般地，一个矩阵的特征向量能取成两两正交，当且仅当



$$
AA^{\mathsf T}=A^{\mathsf T}A .
$$



对称矩阵满足它，因为两边都等于 $A^2$；斜对称矩阵满足它，因为两边都等于 $-A^2$；正交矩阵也满足它，因为两边都等于 $I$。这三类正是本次测验反复出现的“好矩阵”。

最后是矩阵指数。$\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$，所以 $e^{At}$ 才是这一类问题的核心矩阵。若 $A$ 可对角化（diagonalizable，即确有足够多的线性无关特征向量），写 $A=S\Lambda S^{-1}$（$S$ 的列是特征向量），则



$$
e^{At}=Se^{\Lambda t}S^{-1},\qquad
e^{\Lambda t}=\begin{bmatrix}e^{\lambda_1 t}&0&0\\0&e^{\lambda_2 t}&0\\0&0&e^{\lambda_3 t}\end{bmatrix}.
$$



“若”字不能省：并非每个矩阵都可对角化。本题的三个特征值互不相同，所以一定可对角化，公式直接可用。

易错点：看到特征值是纯虚数，就误以为解会衰减或发散；或者不检查可对角化，直接套 $e^{At}=Se^{\Lambda t}S^{-1}$。

![视频 00:11:40：课堂板书](</attachments/mit1806-4946489bf5db8a84fee3811e.jpg>)

*视频 00:11:40｜约对应第 2 节「2. 考点一：微分方程与斜对称矩阵」附近。*

![官方讲义摘要 第 2/4 页](</attachments/mit1806-2684f5e3b8fff3ab36fe4b97.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 32 Summary，CC BY-NC-SA 4.0）。*

![视频 00:17:54：课堂板书](</attachments/mit1806-5d91ea8347b5f74b8d2d8578.jpg>)

*视频 00:17:54｜约对应第 2 节「2. 考点一：微分方程与斜对称矩阵」附近。*

## 3. 考点二：从特征值反推矩阵类型

考点：只给特征值和两两正交的特征向量，判断矩阵能否对角化、何时对称、是否正定、能否为马尔可夫矩阵，以及 $\frac12A$ 何时是投影矩阵。

典型题：一个 $3\times3$ 矩阵，已知两个特征值为 $0$ 与 $2$，第三个特征值记作 $c$；已知它的三个特征向量两两正交。

**能否对角化？** 能，对所有的 $c$。对角化只看特征向量够不够，不看特征值是否重复：三个两两正交的非零向量一定线性无关，足以构成 $\mathbb{R}^3$ 的一组基，因此对任意 $c$（包括 $c=0$ 或 $c=2$ 这种特征值重复的情形）都能对角化。

**何时对称？** $c$ 为实数时。实特征值加正交特征向量，正好凑成 $A=Q\Lambda Q^{\mathsf T}$：令 $Q$ 由三个互相正交的单位特征向量组成，$\Lambda$ 的对角元是实特征值，则 $Q\Lambda Q^{\mathsf T}$ 是对称矩阵，并且有同样的特征值和特征向量，所以它就是 $A$。若 $c=i$ 这类非实数，特征值不全是实数，$A$ 不可能对称。

**是否正定？** 永远不正定。正定要求所有特征值为正，而它有一个特征值 $0$。退一步说，若 $c\ge0$，它是半正定（positive semidefinite）的，因为另外两个特征值 $0$ 与 $2$ 已经非负。

**能否为马尔可夫矩阵（Markov matrix）？** 永远不能。马尔可夫矩阵必有一个特征值等于 $1$，其余特征值的模长不超过 $1$；出现特征值 $2$ 已经违反这条硬性约束，与 $c$ 取什么值无关。

**何时 $\frac12A$ 是投影矩阵（projection matrix）？** $c=0$ 或 $c=2$。投影矩阵满足 $P^2=P$；若 $P\boldsymbol{x}=\lambda\boldsymbol{x}$，则 $\lambda^2\boldsymbol{x}=P^2\boldsymbol{x}=P\boldsymbol{x}=\lambda\boldsymbol{x}$，故 $\lambda$ 只能是 $0$ 或 $1$。于是 $\frac12A$ 的特征值只能取 $0,1$，即 $A$ 的特征值只能取 $0,2$：$c=0$ 时三者是 $0,0,2$，$c=2$ 时是 $0,2,2$，除以 $2$ 后都落在 $\{0,1\}$ 内。又因为这两种情形下 $A$ 对称，$\frac12A$ 也对称；对称矩阵只要特征值全为 $0,1$，就满足 $P^2=P$。

这道题的关键不在计算，而在“认出矩阵类型—调用该类型对特征值的约束”这条链。正交特征向量在其中的作用尤其要体会：它保证了对称的可能，从而顺带保证了半正定与投影的可能；假如三个特征向量不正交，“对称”“正定”“投影”三条路会同时断掉，题目也就只剩对角化一问可答。

易错点：只回答某一个满足条件的 $c$ 而不给出全部答案——这类题的答案是一整组参数；另外，不要把“特征值重复”误当成“不可对角化”。

![视频 00:25:41：课堂板书](</attachments/mit1806-e7a30632207a5e4ef07805a2.jpg>)

*视频 00:25:41｜约对应第 3 节「3. 考点二：从特征值反推矩阵类型」附近。*

## 4. 考点三：SVD 的构造与读法

考点：判断一组 $U,\Sigma,V$ 是否构成 SVD；由 $\Sigma$ 读出矩阵的秩、可逆性与零空间；并说清 $U$ 的符号如何确定。

定义是 $A=U\Sigma V^{\mathsf T}$，也就是“正交 × 对角 × 正交”的分解：其中 $U,V$ 是正交矩阵，$\Sigma$ 是对角矩阵（可以是长方形的），其非零对角元 $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$ 称为奇异值（singular value）。任意矩阵都有这样的分解，这是它比对角化更强的地方。

求法全在 $A^{\mathsf T}A$ 上。把 $A=U\Sigma V^{\mathsf T}$ 代入：



$$
A^{\mathsf T}A=(U\Sigma V^{\mathsf T})^{\mathsf T}(U\Sigma V^{\mathsf T})
=V\Sigma^{\mathsf T}U^{\mathsf T}U\Sigma V^{\mathsf T}
=V\Sigma^{\mathsf T}\Sigma V^{\mathsf T}.
$$



因为 $U$ 正交，$U^{\mathsf T}U=I$，中间只剩 $\Sigma^{\mathsf T}\Sigma$。右边是对称矩阵的标准分解形式。注意 $A^{\mathsf T}A$ 本身对称，在它的 SVD 里左右两个正交因子是同一个，这里正是 $V$ 同时出现在两端。所以 $V$ 就是 $A^{\mathsf T}A$ 的特征向量矩阵，$\Sigma^{\mathsf T}\Sigma$ 的对角元是其特征值。于是奇异值等于 $A^{\mathsf T}A$ 特征值的正平方根：



$$
\sigma_i=\sqrt{\lambda_i(A^{\mathsf T}A)} .
$$



同理 $AA^{\mathsf T}=U\Sigma\Sigma^{\mathsf T}U^{\mathsf T}$，$U$ 是 $AA^{\mathsf T}$ 的特征向量矩阵。到这里一切顺利，但有一个坑：特征向量只定到符号为止，$AA^{\mathsf T}$ 无法告诉你该取 $\boldsymbol{u}_i$ 还是 $-\boldsymbol{u}_i$。正确的做法是用关系式



$$
A\boldsymbol{v}_i=\sigma_i\boldsymbol{u}_i
$$



定符号：每个 $\boldsymbol{v}_i$ 的符号可以先任选一个，选定后把它乘以 $A$，结果必须等于 $\sigma_i$ 倍的一个单位向量，这个单位向量就是 $\boldsymbol{u}_i$，符号也随之唯一确定。用矩阵写就是 $AV=U\Sigma$。只靠 $AA^{\mathsf T}$ 求 $U$，会漏掉这个符号约束。

给出一部分因子来读矩阵，是考卷上常见的问法。若



$$
\Sigma=\begin{bmatrix}3&0\\0&2\end{bmatrix},
$$



两个奇异值都不为零，则 $A$ 可逆、非奇异。若把某个对角元写成负数，例如 $-5$，那根本不是 SVD——奇异值按定义非负。若第二个奇异值为 $0$，即 $\sigma_2=0$，则 $A$ 奇异，秩为 $1$：秩等于非零奇异值的个数。此时 $A\boldsymbol{v}_2=\sigma_2\boldsymbol{u}_2=\boldsymbol{0}$，所以零空间是一维的，由 $\boldsymbol{v}_2$ 张成；同理 $\boldsymbol{u}_2$ 属于 $A^{\mathsf T}$ 的零空间，即左零空间（left nullspace）；列空间由 $\boldsymbol{u}_1$ 张成，行空间（row space）由 $\boldsymbol{v}_1$ 张成。秩、四个基本子空间、可逆性，全都藏在这三个因子里。

易错点：接受负的奇异值；只由 $AA^{\mathsf T}$ 定出 $U$ 而不校验符号；或者忘记零奇异值对应的 $\boldsymbol{v}_i$ 才属于零空间。

![视频 00:30:36：课堂板书](</attachments/mit1806-ad4ad4b9d83a306b4b0a0a56.jpg>)

*视频 00:30:36｜约对应第 4 节「4. 考点三：SVD 的构造与读法」附近。*

![官方讲义摘要 第 3/4 页](</attachments/mit1806-dce9570f68a261722ce53669.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 32 Summary，CC BY-NC-SA 4.0）。*

![视频 00:34:02：课堂板书](</attachments/mit1806-e6eba2bac4b4125b6a2156ce.jpg>)

*视频 00:34:02｜约对应第 4 节「4. 考点三：SVD 的构造与读法」附近。*

## 5. 考点四：既对称又正交的矩阵

考点：判断 $A$ 既对称又正交时特征值的可能值、正定性、可对角化性与奇异性，并证明 $\frac12(A+I)$ 是投影矩阵。

先问特征值能取什么。对称给出“全是实数”，正交给出“模长全为 $1$”。后者要会证：若 $Q\boldsymbol{x}=\lambda\boldsymbol{x}$，两边取长度，



$$
\|Q\boldsymbol{x}\|=|\lambda|\,\|\boldsymbol{x}\|,
$$



而正交矩阵不改变长度，$\|Q\boldsymbol{x}\|=\|\boldsymbol{x}\|$，所以 $|\lambda|=1$。两个条件合起来，特征值只能是 $\pm1$。

由此逐条判断。正定？不一定，因为可能取到 $-1$。无重特征值？不对——特征值只有 $\pm1$ 两个可能值，$3\times3$ 甚至更大阶的矩阵必然出现重复。可对角化？可以，对称矩阵（以及正交矩阵）总有足够多的特征向量，而且特征向量能取得正交，可以用正交矩阵来对角化，比一般的 $A=S\Lambda S^{-1}$ 更强。非奇异？是，正交矩阵本身可逆，也可以从“没有零特征值”看出。

最后一问要证明



$$
P=\frac{A+I}{2}
$$



是投影矩阵。有两条路。第一条是验证投影的两个定义性质。对称性显然：$A$ 与 $I$ 都对称，除以 $2$ 仍对称。再验证 $P^2=P$：



$$
P^2=\frac{(A+I)^2}{4}=\frac{A^2+2A+I}{4}.
$$



由 $A$ 正交且对称得 $A^{\mathsf T}=A$ 且 $AA^{\mathsf T}=I$，于是 $A^2=I$，代回得



$$
P^2=\frac{I+2A+I}{4}=\frac{A+I}{2}=P .
$$



第二条路看特征值：$A$ 的特征值是 $1$ 或 $-1$，所以 $A+I$ 的特征值是 $2$ 或 $0$，$P$ 的特征值是 $1$ 或 $0$。一个对称矩阵只要特征值全在 $\{0,1\}$ 内，就是投影矩阵。换句话说，$P$ 把 $A$ 的 $+1$ 特征方向原样保留，把 $-1$ 特征方向压成零，这正是投影该有的作用。

易错点：由“对称且正交”误判为正定，漏掉特征值 $-1$ 的可能；或者验证投影时只检查了对称性，忘了 $P^2=P$。

![官方讲义摘要 第 4/4 页](</attachments/mit1806-58aeb4ec779a98ef9723f5bd.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 32 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 第三次测验范围到第六章为止：特征值、微分方程、对称矩阵、正定矩阵、相似矩阵与 SVD；线性变换不在其中。
- 消元是行变换，会改变特征值；保持特征值的是相似变换 $B=M^{-1}AM$：特征值相同，且 $B^k=M^{-1}A^kM$。
- 微分方程 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$ 的通解是 $c_1e^{\lambda_1t}\boldsymbol{x}_1+\cdots+c_ne^{\lambda_nt}\boldsymbol{x}_n$，常数由 $\boldsymbol{u}(0)$ 定；特征值的实部决定增长或衰减，纯虚数对应振荡。
- 斜对称矩阵 $A^{\mathsf T}=-A$ 的特征值是纯虚数。例子 $A$ 的特征值为 $0,\pm i\sqrt2$，解有界并以 $T=\pi\sqrt2$ 为周期。
- 特征向量可取得两两正交的充要条件是 $AA^{\mathsf T}=A^{\mathsf T}A$；对称、斜对称、正交三类矩阵都满足。
- 可对角化时 $e^{At}=Se^{\Lambda t}S^{-1}$，对角阵上逐个取 $e^{\lambda_it}$。
- 已知特征值 $0,2,c$ 与正交特征向量：一切 $c$ 都可对角化；$c$ 为实数时对称；永不正定（$c\ge0$ 时半正定）；永不可能是马尔可夫矩阵；$\frac12A$ 是投影当且仅当 $c=0$ 或 $c=2$。
- SVD 中 $V$ 是 $A^{\mathsf T}A$ 的特征向量矩阵，奇异值是其特征值的正平方根；$U$ 的符号由 $A\boldsymbol{v}_i=\sigma_i\boldsymbol{u}_i$ 决定，不能只看 $AA^{\mathsf T}$。
- 非零奇异值的个数等于秩；$\sigma_i=0$ 时 $\boldsymbol{v}_i$ 属于零空间，$\boldsymbol{u}_i$ 属于左零空间。
- 既对称又正交的矩阵特征值只能是 $\pm1$，$(A+I)/2$ 满足对称与 $P^2=P$，是投影矩阵。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| differential equation | 微分方程 | $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$，解由特征模态叠加而成 |
| eigenvector | 特征向量 | 被 $A$ 作用后方向不变的非零向量 |
| skew-symmetric matrix | 斜对称矩阵 | 满足 $A^{\mathsf T}=-A$ 的矩阵，特征值为纯虚数 |
| matrix exponential | 矩阵指数 | $e^{At}$，把初始向量送到时刻 $t$ 的解 |
| period | 周期 | 解回到初始值所需的时间，例子中为 $\pi\sqrt2$ |
| symmetric matrix | 对称矩阵 | $A^{\mathsf T}=A$，特征值实，可正交对角化为 $Q\Lambda Q^{\mathsf T}$ |
| positive definite | 正定 | 对称且全部特征值为正 |
| positive semidefinite | 半正定 | 对称且全部特征值非负 |
| Markov matrix | 马尔可夫矩阵 | 有一个特征值 $1$、其余特征值模长不超过 $1$ 的矩阵 |
| projection matrix | 投影矩阵 | 对称且满足 $P^2=P$，特征值只能是 $0,1$ |
| similar matrices | 相似矩阵 | 满足 $B=M^{-1}AM$，特征值相同 |
| singular value decomposition | 奇异值分解 | 任意矩阵写成 $A=U\Sigma V^{\mathsf T}$，$U,V$ 正交 |
| singular value | 奇异值 | $\Sigma$ 的非负对角元，等于 $A^{\mathsf T}A$ 特征值的正平方根 |
| orthogonal matrix | 正交矩阵 | $Q^{\mathsf T}Q=QQ^{\mathsf T}=I$，不改变长度，特征值模长为 $1$ |
| left nullspace | 左零空间 | $N(A^{\mathsf T})$，在 SVD 中由 $\sigma_i=0$ 对应的 $\boldsymbol{u}_i$ 张成 |

---

[← Lecture 31](/notes/mit-1806/lec31) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 33 →](/notes/mit-1806/lec33)
