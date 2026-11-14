---
title: Lecture 34 · 总复习
description: 总复习：串起整门课的八条主线与核心考点。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 36
tags:
  - lineal algebra
status: completed
publish: true
---

> *Final course review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 34 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p35 · 总复习](https://www.bilibili.com/video/BV1ix411f7Yp?p=35)（43:26）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-34-final-course-review/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=35&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

最后一讲用往年考题串起整门课。题目看起来分散，实际覆盖的正是课程主线：一道关于 $3\times n$ 矩阵的题同时问秩、列空间、零空间、行列式与正定性；一道列向量组合题问矩阵乘法的列视图与解的唯一性；一道标准正交题问投影；一道马尔可夫矩阵题问特征值、迹与稳态；几道 $2\times2$ 的构造题把投影矩阵和 $A=S\Lambda S^{-1}$ 重新拉回来；最后一道最小二乘题把投影、正规方程与拟合直线收束在一起。

复习不是把三十三讲重念一遍。该记住的是一条因果链：$A\boldsymbol x=\boldsymbol b$ 能不能解、解是否唯一，由 $m,n,r$ 三个数决定；看清这三个数要用四个基本子空间；长方矩阵常常无解，于是转向正交与投影，用最小二乘找最近的解；行列式（determinant）给方阵一个数，特征值（eigenvalue）给方阵一组方向，正定性把两者连起来；奇异值分解（SVD）把任意矩阵分解为“旋转—拉伸—旋转”，线性变换则说明矩阵不过是某个变换在一组基下的坐标。下面七节按这条链展开，其中前六节各以本讲的一组考题为骨架，最后一节把整门课收拢成一张地图。

![官方讲义摘要 第 1/6 页](</attachments/mit1806-48c03ccbe9ebc08aa00221b0.png>)

*MIT OCW 官方讲义摘要 第 1/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

## 1. 秩 $r$：$m$、$n$、$r$ 三个数字决定可解性与唯一性

题面是这样的：$A$ 是 $m\times n$、**秩**（rank）为 $r$ 的矩阵，$A\boldsymbol x=(1,0,0)^{\mathsf T}$ 无解，$A\boldsymbol x=(0,1,0)^{\mathsf T}$ 恰有一个解。问 $m,n,r$ 能确定到什么程度。

右端是三维向量，所以 $m=3$。存在无解的右端，说明并非每一行都有主元（pivot）：消元（elimination）走到最后，至少有一行化成了零行，这一行就是其余行的线性组合，列空间（column space）$C(A)$ 只是 $\mathbb R^3$ 的真子空间，于是 $r<m$。另一个条件更强：一旦有解就只有一个解，说明零空间（nullspace）$N(A)$ 里除零向量外别无他物，自由变量（free variable）个数 $n-r=0$，即 $r=n$，各列线性无关。两个条件一个约束行、一个约束列，恰好把 $r$ 夹在中间；反过来验证也顺：$r=m$ 会让每个右端都有解，与第一个条件矛盾；$r<n$ 会让有解时必不唯一，与第二个条件矛盾。合起来



$$
r=n<m=3,\qquad n=r\le 2 .
$$



具体例子可以取



$$
A=\begin{bmatrix}0\\1\\0\end{bmatrix}.
$$



它是 $3\times1$、秩 1：$A\boldsymbol x=(0,1,0)^{\mathsf T}$ 只有 $x=1$，而 $(1,0,0)^{\mathsf T}$ 不在列空间里，无解。若不想要只有一列的矩阵，就在右侧再接一列 $(0,0,1)^{\mathsf T}$，得到 $3\times2$、$r=n=2$ 的矩阵，列空间成了 $yz$ 平面，$(1,0,0)^{\mathsf T}$ 依然解不出来。这道题把“有解当且仅当 $\boldsymbol b\in C(A)$”与“唯一当且仅当 $N(A)=\{\boldsymbol 0\}$”两条判据同时用了一遍。

![视频 00:04:21：课堂板书](</attachments/mit1806-e76c072df484cc3a5c6f3026.jpg>)

*视频 00:04:21｜约对应第 1 节「1. 秩 $r$：$m$、$n$、$r$ 三个数字决定可解性与唯一性」附近。*

## 2. $A^{\mathsf T}A$ 与 $AA^{\mathsf T}$：行列式、对称性、正定性

同一道题接着问三句真伪判断，用意是把整门课的好几条线索压进一个矩阵里。仍取上面 $3\times2$ 的例子，此时 $m=3$、$n=r=2$。

**第一句：$\det(A^{\mathsf T}A)=\det(AA^{\mathsf T})$。** 假。$A^{\mathsf T}A$ 是 $2\times2$，$AA^{\mathsf T}$ 是 $3\times3$，两个行列式根本不同阶。本例中 $A^{\mathsf T}A=I_2$，行列式为 1；$AA^{\mathsf T}=\operatorname{diag}(0,1,1)$，行列式为 0。真正成立的是同阶方阵之间的 $\det(AB)=\det(BA)$：若 $A$ 本身是方阵，则



$$
\det(A^{\mathsf T}A)=\det(A^{\mathsf T})\det(A)=(\det A)^2=\det(A)\det(A^{\mathsf T})=\det(AA^{\mathsf T}).
$$



所以这条判断错在 $A$ 不是方阵，而不是错在行列式的乘法性质。

**第二句：$A^{\mathsf T}A$ 可逆。** 真。一般地，$A^{\mathsf T}A$ 可逆当且仅当 $A$ 的列线性无关，即 $r=n$。关键在于 $A^{\mathsf T}A$ 与 $A$ 有同一个零空间：$A\boldsymbol x=\boldsymbol 0$ 自然给出 $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$；反过来若 $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$，左乘 $\boldsymbol x^{\mathsf T}$ 得 $\|A\boldsymbol x\|^2=0$，仍有 $A\boldsymbol x=\boldsymbol 0$。本题 $r=n$，零空间只有零向量，$A^{\mathsf T}A$ 可逆——本例中它恰好是单位矩阵（identity matrix）。

**第三句：$AA^{\mathsf T}$ 正定。** 假。$AA^{\mathsf T}$ 总是对称矩阵（symmetric matrix），也总是方阵，这里还是 $3\times3$，但它的秩等于 $r=2$，不满秩。原因是 $AA^{\mathsf T}\boldsymbol y=\boldsymbol 0$ 与 $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$ 同解（左乘 $\boldsymbol y^{\mathsf T}$ 就能从前者推出后者），故 $N(AA^{\mathsf T})=N(A^{\mathsf T})$，维数 $m-r=1$，秩只有 $m-(m-r)=r$。于是存在非零 $\boldsymbol y$ 使 $AA^{\mathsf T}\boldsymbol y=\boldsymbol 0$，也就有 $\boldsymbol y^{\mathsf T}AA^{\mathsf T}\boldsymbol y=0$，违背**正定**（positive definite）要求的“对一切 $\boldsymbol y\ne\boldsymbol 0$ 有 $\boldsymbol y^{\mathsf T}M\boldsymbol y>0$”。本例 $AA^{\mathsf T}=\operatorname{diag}(0,1,1)$，第一行全零。能成立的正确说法是**半正定**（positive semidefinite）：对任意 $\boldsymbol y$，



$$
\boldsymbol y^{\mathsf T}AA^{\mathsf T}\boldsymbol y=\|A^{\mathsf T}\boldsymbol y\|^2\ge 0,
$$



而 $m>r$ 时左零空间（left nullspace）$N(A^{\mathsf T})$ 非平凡，等号能取到，所以不能加强成正定。这个“半”字正对应 $m-r>0$。

顺带能回答另一道小题：找一个不能写成 $B^{\mathsf T}B$ 的实矩阵。$B^{\mathsf T}B$ 必定对称，所以随便给一个非对称矩阵即可，例如



$$
\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



真正要记住的是 $B^{\mathsf T}B$ 的两条结构性质：对称、半正定。

把四个基本子空间（four fundamental subspaces）的维数排在一起，这些判断就有了统一的依据：



$$
\dim C(A)=r,\quad \dim N(A)=n-r,\quad \dim C(A^{\mathsf T})=r,\quad \dim N(A^{\mathsf T})=m-r .
$$



本题四个维数依次是 $2,0,2,1$。最后一项正是下一问的关键：$A^{\mathsf T}$ 是 $2\times3$，行数 $n=2$ 等于秩，满行秩，所以 $A^{\mathsf T}\boldsymbol y=\boldsymbol c$ 对每个 $\boldsymbol c\in\mathbb R^2$ 都有解；而 $N(A^{\mathsf T})$ 是一维的，有一个自由变量，所以解有无穷多个。换成 $A^{\mathsf T}$ 之后 $m$ 与 $n$ 的角色互换，这一点最容易算错。

![官方讲义摘要 第 2/6 页](</attachments/mit1806-37872d1c9aaa4eda59c91246.png>)

*MIT OCW 官方讲义摘要 第 2/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

## 3. 列的组合、零空间与解的唯一性

第二道题给 $A=[\boldsymbol v_1\ \boldsymbol v_2\ \boldsymbol v_3]$，先求解 $A\boldsymbol x=\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3$。矩阵乘向量的列视图是



$$
A\boldsymbol x=x_1\boldsymbol v_1+x_2\boldsymbol v_2+x_3\boldsymbol v_3,
$$



右端已经写成了系数组，对照即得



$$
\boldsymbol x=\begin{bmatrix}1\\-1\\1\end{bmatrix}.
$$



这是矩阵乘法最基本的一条读法：乘积是各列按 $x$ 的分量所作的线性组合。

接着问：若 $\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3=\boldsymbol 0$，解还唯一吗？不唯一。这个等式等价于 $\boldsymbol v_3=\boldsymbol v_2-\boldsymbol v_1$，第三列落在前两列张成的平面里；此时 $\boldsymbol x=(1,-1,1)^{\mathsf T}$ 落在零空间里，任何解加上它仍是解，因为 $A(\boldsymbol x+\boldsymbol\xi)=A\boldsymbol x$。唯一性从来只与零空间有关：$N(A)=\{\boldsymbol 0\}$ 等价于 $r=n$，等价于各列线性无关。反过来，若三列线性无关，组合为零只能推出三个系数全为零，$N(A)$ 只剩零向量，解就唯一。只要发现一列是其余列的组合，就已经知道秩不足、解不唯一；这与第 1 节“恰有一个解”的条件是同一件事的两面。

## 4. 正交投影：最近点、投影矩阵与最小二乘

投影是“无解时怎么办”的答案。这一节把课程里的三处投影串起来。

先看标准正交（orthonormal）的情形。若 $\boldsymbol v_1,\boldsymbol v_2,\boldsymbol v_3$ 标准正交（通常改记 $\boldsymbol q_1,\boldsymbol q_2,\boldsymbol q_3$），问 $\operatorname{span}\{\boldsymbol v_1,\boldsymbol v_2\}$ 中离 $\boldsymbol v_3$ 最近的点是哪个组合。答案是 $0\cdot\boldsymbol v_1+0\cdot\boldsymbol v_2=\boldsymbol 0$：三个向量两两正交，$\boldsymbol v_3$ 垂直于整张平面，它在该平面上的投影就是零向量。用标准基 $\boldsymbol e_1,\boldsymbol e_2,\boldsymbol e_3$ 想一遍最清楚——$xy$ 平面上离 $\boldsymbol e_3$ 最近的点是原点。

再看一条直线。过 $\boldsymbol a=(4,-3)$ 的直线，其投影矩阵（projection matrix）为



$$
P=\frac{\boldsymbol a\boldsymbol a^{\mathsf T}}{\boldsymbol a^{\mathsf T}\boldsymbol a}=\frac1{25}\begin{bmatrix}16&-12\\-12&9\end{bmatrix}.
$$



公式的道理与最小二乘相同：直线上的点都是 $\boldsymbol a$ 的倍数，把 $\boldsymbol b$ 投过去，系数是 $\boldsymbol a^{\mathsf T}\boldsymbol b/\boldsymbol a^{\mathsf T}\boldsymbol a$。所得矩阵的每一列都是 $\boldsymbol a$ 的倍数，秩为 1；它对称；把直线上的向量再投影一次仍然不变，即 $P^2=P$。

最后是完整的算例。设



$$
A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\qquad \boldsymbol b=\begin{bmatrix}3\\4\\1\end{bmatrix},\qquad \boldsymbol x=\begin{bmatrix}c\\d\end{bmatrix},
$$



第一列对应常数项、第二列对应 $t=0,1,2$，所以 $c$ 是截距、$d$ 是斜率。三个方程两个未知数，一般无解；**最小二乘**（least squares）解 $\hat{\boldsymbol x}$ 满足**正规方程**（normal equations）



$$
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b .
$$



这条方程来自正交性：最小二乘的残差 $\boldsymbol b-A\hat{\boldsymbol x}$ 必须与 $C(A)$ 中每个向量正交，特别要与 $A$ 的每一列正交，即 $A^{\mathsf T}(\boldsymbol b-A\hat{\boldsymbol x})=\boldsymbol 0$，移项便是正规方程。本例两列线性无关，$\det(A^{\mathsf T}A)=3\cdot5-3\cdot3=6\ne0$，所以 $\hat{\boldsymbol x}$ 唯一。

逐项算出 $A^{\mathsf T}A=\begin{bmatrix}3&3\\3&5\end{bmatrix}$、$A^{\mathsf T}\boldsymbol b=(8,6)^{\mathsf T}$，解得



$$
\hat c=\frac{11}{3},\qquad \hat d=-1 .
$$



把 $\hat c,\hat d$ 代回：$A^{\mathsf T}A\hat{\boldsymbol x}$ 的两个分量分别为 $3\hat c+3\hat d=8$、$3\hat c+5\hat d=6$，正好等于 $A^{\mathsf T}\boldsymbol b$。投影向量是



$$
\boldsymbol p=A\hat{\boldsymbol x}=\frac{11}{3}\begin{bmatrix}1\\1\\1\end{bmatrix}-\begin{bmatrix}0\\1\\2\end{bmatrix}
=\begin{bmatrix}11/3\\8/3\\5/3\end{bmatrix},
$$



它就是 $\boldsymbol b$ 在列空间 $C(A)$ 上的投影；对应的拟合直线是 $y=\frac{11}{3}-t$，在 $t=0,1,2$ 处的高度依次为 $11/3,8/3,5/3$，与数据 $3,4,1$ 最接近。一般地，到 $C(A)$ 的投影矩阵是 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$，上面按直线公式算的 $P$ 是它在 $n=1$ 时的特例。

最后一问：找一个非零的 $\boldsymbol b$，使最小二乘解为零。条件是 $\boldsymbol b$ 与两列都正交，即 $A^{\mathsf T}\boldsymbol b=\boldsymbol 0$；此时 $\boldsymbol b$ 在列空间上的投影为零，正规方程给出 $A^{\mathsf T}A\hat{\boldsymbol x}=\boldsymbol 0$，而 $A^{\mathsf T}A$ 可逆（列独立），故 $\hat{\boldsymbol x}=\boldsymbol 0$。取



$$
\boldsymbol b=\begin{bmatrix}1\\-2\\1\end{bmatrix},
$$



它与 $(1,1,1)^{\mathsf T}$ 和 $(0,1,2)^{\mathsf T}$ 的内积都是 0。几何上，$\boldsymbol b$ 整个落在 $C(A)$ 的正交补（orthogonal complement）里，离它最近的列空间向量只能是零。

![官方讲义摘要 第 3/6 页](</attachments/mit1806-f4bbe0b5248c1b99b17a0dc3.png>)

*MIT OCW 官方讲义摘要 第 3/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

![视频 00:18:11：课堂板书](</attachments/mit1806-01c15a5ddeb707607cdba145.jpg>)

*视频 00:18:11｜约对应第 4 节「4. 正交投影：最近点、投影矩阵与最小二乘」附近。*

![视频 00:23:55：课堂板书](</attachments/mit1806-b05ebc3fabf5bb0f1caa070c.jpg>)

*视频 00:23:55｜约对应第 4 节「4. 正交投影：最近点、投影矩阵与最小二乘」附近。*

## 5. 特征值、对角化与由特征对重建矩阵

再回到 $2\times2$ 的小题：求一个 $2\times2$ 矩阵，特征值为 $0$ 和 $3$，对应的特征向量（eigenvector）分别是 $(1,2)^{\mathsf T}$ 与 $(2,1)^{\mathsf T}$。这次方向是反的——通常给矩阵求特征值，这里给特征对求矩阵。

把特征向量按列排成 $S$、特征值排成对角阵 $\Lambda$，则 $AS=S\Lambda$，于是



$$
A=S\Lambda S^{-1},\qquad
S=\begin{bmatrix}1&2\\2&1\end{bmatrix},\quad
\Lambda=\begin{bmatrix}0&0\\0&3\end{bmatrix}.
$$



道理很简单：$S$ 的列是特征向量，$AS=S\Lambda$ 不过是 $A\boldsymbol x_i=\lambda_i\boldsymbol x_i$ 这一组等式并排写；两边右乘 $S^{-1}$ 就解出 $A$。$S$ 的行列式为 $-3$，所以 $S^{-1}=-\frac13\begin{bmatrix}1&-2\\-2&1\end{bmatrix}$。相乘：



$$
S\Lambda=\begin{bmatrix}0&6\\0&3\end{bmatrix},\qquad
A=\begin{bmatrix}0&6\\0&3\end{bmatrix}\begin{bmatrix}-1/3&2/3\\2/3&-1/3\end{bmatrix}
=\begin{bmatrix}4&-2\\2&-1\end{bmatrix}.
$$



验证：$A(1,2)^{\mathsf T}=(0,0)^{\mathsf T}=0\cdot(1,2)^{\mathsf T}$，$A(2,1)^{\mathsf T}=(6,3)^{\mathsf T}=3\cdot(2,1)^{\mathsf T}$，两个特征对都对。这个构造能成立的前提是 $S$ 可逆，也就是两个特征向量线性无关，即矩阵可**对角化**（diagonalization）；特征向量不够时 $S$ 取不出来，矩阵就不可对角化。

同一组题里还有一问：举一个有正交特征向量、却不是对称矩阵的 $2\times2$ 矩阵。对称矩阵的特征向量可以取成标准正交，这是熟悉的一族；但正交特征向量并非它专属。反对称矩阵（skew-symmetric matrix）如



$$
\begin{bmatrix}0&-1\\1&0\end{bmatrix}
$$



的特征值是 $\pm\mathrm i$，特征向量是复向量且彼此正交；正交矩阵（orthogonal matrix）如旋转矩阵 $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$ 也一样。所以“特征向量正交”不能反推“矩阵对称”。

![官方讲义摘要 第 4/6 页](</attachments/mit1806-ace7163275e3b99324abd596.png>)

*MIT OCW 官方讲义摘要 第 4/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

![视频 00:28:14：课堂板书](</attachments/mit1806-784c91cff21496d72d732ec0.jpg>)

*视频 00:28:14｜约对应第 5 节「5. 特征值、对角化与由特征对重建矩阵」附近。*

## 6. 马尔可夫矩阵与长期稳态

马尔可夫矩阵（Markov matrix）的题给的是一个 $3\times3$ 矩阵，每一列元素非负且加起来为 1：



$$
A=\begin{bmatrix}0.2&0.4&0.3\\0.4&0.2&0.3\\0.4&0.4&0.4\end{bmatrix}.
$$



要求它的三个特征值。先看列与列的关系：第一列加第二列等于第三列的两倍，即 $\boldsymbol a_1+\boldsymbol a_2=2\boldsymbol a_3$，三列线性相关，所以 $A$ 奇异（singular），$\lambda_1=0$，零空间含 $(1,1,-2)^{\mathsf T}$。又因为每列和为 1，$A^{\mathsf T}(1,1,1)^{\mathsf T}=(1,1,1)^{\mathsf T}$，所以 $\lambda_2=1$ 也是 $A$ 的特征值（$A$ 与 $A^{\mathsf T}$ 的特征值相同，但 $\lambda=1$ 属于 $A$ 的特征向量还要另外求）。最后一个由迹（trace）定出：对角线之和为 $0.2+0.2+0.4=0.8$，而特征值之和等于迹，故 $0+1+\lambda_3=0.8$，$\lambda_3=-0.2$。

接着让过程走起来。设 $\boldsymbol u_k=A^k\boldsymbol u_0$，初值 $\boldsymbol u_0=(0,10,0)^{\mathsf T}$，即十个个体从第二个状态出发。把 $\boldsymbol u_0$ 按特征向量展开，



$$
\boldsymbol u_k=c_1 0^k\boldsymbol x_1+c_2 1^k\boldsymbol x_2+c_3(-0.2)^k\boldsymbol x_3 .
$$



当 $k\ge1$，零特征值对应的项立即消失；$(-0.2)^k$ 的幅度越来越小、符号交替，也趋于零；只有 $1^k$ 那一项留下来，极限是 $c_2\boldsymbol x_2$，这就是**稳态**（steady state）。$\lambda=1$ 的特征向量解 $(A-I)\boldsymbol x=\boldsymbol 0$：



$$
A-I=\begin{bmatrix}-0.8&0.4&0.3\\0.4&-0.8&0.3\\0.4&0.4&-0.6\end{bmatrix},\qquad
\boldsymbol x_2=\begin{bmatrix}3\\3\\4\end{bmatrix},
$$



逐行验算 $(A-I)\boldsymbol x_2=\boldsymbol 0$ 都成立。系数 $c_2$ 不必解线性方程组：马尔可夫过程不增不减，各分量之和保持不变，初始总量是 10，而 $\boldsymbol x_2$ 的分量之和恰为 10，所以 $c_2=1$，稳态为



$$
\boldsymbol u_\infty=\begin{bmatrix}3\\3\\4\end{bmatrix}.
$$



这类题的标准套路是：用列和为 1 拿 $\lambda=1$，用奇异拿 $\lambda=0$，用迹拿最后一个特征值，再用特征向量展开看长期极限。

## 7. 全课地图：八条主线与四个分解

把今天的题按课程主线归位，整门课的地图就出来了。

**消元与 LU。** 主元个数就是秩；每行都有主元则对任意右端有解，缺主元则某行是其余行的组合。消元把 $A$ 写成 $LU$；有行交换时写成 $PA=LU$，其中 $P$ 是置换矩阵（permutation matrix）。而 $|\det A|$ 等于主元之积，交换行只会带来一个符号。

**四个子空间。** 列空间与零空间、行空间（row space）与左零空间，维数分别为 $r,n-r,r,m-r$；零空间是行空间的正交补，左零空间是列空间的正交补。第 2 节那条 $A^{\mathsf T}\boldsymbol y=\boldsymbol c$ 有无穷多解，用的就是维数 $m-r$。

**正交投影。** $A^{\mathsf T}A$ 可逆当且仅当列独立；投影矩阵 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 把 $\boldsymbol b$ 投到 $C(A)$；最小二乘解由正规方程 $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$ 给出；格拉姆-施密特（Gram-Schmidt）正交化给出 $A=QR$。

**行列式。** $\det(AB)=\det A\det B$、$\det A^{\mathsf T}=\det A$、$|\det A|$ 是主元之积、是体积；$\det A\ne0$ 当且仅当 $A$ 可逆。再提醒一次：$\det(AB)=\det(BA)$ 只在同阶方阵之间谈。

**特征值。** 解 $\det(A-\lambda I)=0$ 得特征多项式（characteristic polynomial）的根；$A=S\Lambda S^{-1}$ 把矩阵的幂、指数、差分方程都化成对特征值逐个计算；马尔可夫矩阵的特征值满足 $|\lambda|\le1$ 且必有 $\lambda=1$，当其余特征值的绝对值都小于 1 时，长期行为就由 $\lambda=1$ 的特征向量决定。

**正定性。** 正定是指对称矩阵对一切非零 $\boldsymbol x$ 都有 $\boldsymbol x^{\mathsf T}A\boldsymbol x>0$，它等价于所有特征值为正、所有主元为正、所有顺序主子式（leading principal minor）为正。$A^{\mathsf T}A$ 在列独立时正定，$AA^{\mathsf T}$ 在 $m>r$ 时只能半正定。

**SVD。** 任意矩阵——包括长方矩阵与奇异矩阵——都能写成 $A=U\Sigma V^{\mathsf T}$，即“旋转—拉伸—旋转”；非零奇异值的个数等于秩，低秩近似是图像压缩的来源。它是课程的最后一个分解，也是最一般的分解。

**线性变换。** 选定基之后，线性变换（linear transformation）就是一个矩阵；换一组基（change of basis），矩阵变成 $M^{-1}AM$，相似矩阵（similar matrices）代表同一个变换。

复习时不要按“第几讲”记，而要按“这道题在问哪个分解、哪个子空间”记。今天的题目只是把八条主线重新排列组合了一次：秩、四个子空间、行列式、正定性挤在第一题里，投影与最小二乘合成一组，特征值与马尔可夫过程合成另一组。

![官方讲义摘要 第 5/6 页](</attachments/mit1806-d23f0fe1d90ab91993048dc9.png>)

*MIT OCW 官方讲义摘要 第 5/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

![视频 00:39:05：课堂板书](</attachments/mit1806-3b6db515b7704d13be45b72e.jpg>)

*视频 00:39:05｜约对应第 7 节「7. 全课地图：八条主线与四个分解」附近。*

![官方讲义摘要 第 6/6 页](</attachments/mit1806-9fe79f3c9f78e14e6109faec.png>)

*MIT OCW 官方讲义摘要 第 6/6 页（18.06SC Lecture 34 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **秩**决定一切：$A\boldsymbol x=\boldsymbol b$ 对某个 $\boldsymbol b$ 无解当且仅当 $r<m$；有解时解唯一当且仅当 $r=n$。本讲第一题的答案是 $r=n\le2<m=3$。
- 四个基本子空间的维数依次为 $r$、$n-r$、$r$、$m-r$；$A^{\mathsf T}\boldsymbol y=\boldsymbol c$ 满行秩时对每个 $\boldsymbol c$ 有解，零空间维数 $m-r$ 给出无穷多解。
- $\det(A^{\mathsf T}A)=\det(AA^{\mathsf T})$ 只对同阶方阵成立；对长方矩阵，$A^{\mathsf T}A$ 与 $AA^{\mathsf T}$ 阶数不同，$r=n$ 时前者可逆（本例为 $I_2$），后者秩仍为 $r$、必然奇异。
- $B^{\mathsf T}B$ 必对称、半正定；正定要求对一切非零 $\boldsymbol x$ 有 $\boldsymbol x^{\mathsf T}M\boldsymbol x>0$，所以 $AA^{\mathsf T}$ 在 $m>r$ 时只能是半正定。
- 列视图下 $A\boldsymbol x$ 是各列的线性组合：$A\boldsymbol x=\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3$ 的解是 $(1,-1,1)^{\mathsf T}$；若该组合为零，这个向量就在零空间里，解不唯一。
- 投影矩阵：过 $\boldsymbol a=(4,-3)$ 的直线对应 $P=\frac1{25}\begin{bmatrix}16&-12\\-12&9\end{bmatrix}$；标准正交时 $\boldsymbol v_3$ 到 $\operatorname{span}\{\boldsymbol v_1,\boldsymbol v_2\}$ 的最近点是零。
- 最小二乘：$A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$，例子得 $\hat c=11/3$、$\hat d=-1$，投影 $\boldsymbol p=(11/3,8/3,5/3)^{\mathsf T}$，拟合直线 $y=11/3-t$；$\boldsymbol b\perp C(A)$ 时 $\hat{\boldsymbol x}=\boldsymbol 0$。
- 由特征对重建矩阵用 $A=S\Lambda S^{-1}$，例子得 $A=\begin{bmatrix}4&-2\\2&-1\end{bmatrix}$；正交特征向量并非对称矩阵独有，反对称矩阵与旋转矩阵也有（复向量意义下正交）。
- 马尔可夫矩阵列和为 1，故 $\lambda=1$；例题三个特征值为 $0,1,-0.2$，稳态特征向量 $(3,3,4)^{\mathsf T}$，由总量守恒定出系数 1，$\boldsymbol u_\infty=(3,3,4)^{\mathsf T}$。
- 全课收束为八个主题与四个分解：消元（$LU$）、正交化（$QR$）、对角化（$S\Lambda S^{-1}$）、奇异值分解（$U\Sigma V^{\mathsf T}$），配上四个子空间、行列式与正定性。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| rank | 秩 | 主元的个数，同时是列空间与行空间的维数 |
| pivot | 主元 | 消元中用来消去下方元素的关键数，其个数等于秩 |
| column space | 列空间 | $A$ 各列的所有线性组合，$\boldsymbol b$ 落在其中时方程有解 |
| nullspace | 零空间 | 满足 $A\boldsymbol x=\boldsymbol 0$ 的全部 $\boldsymbol x$，维数为 $n-r$ |
| row space | 行空间 | 各行张成的空间，维数为 $r$，是零空间的正交补 |
| left nullspace | 左零空间 | 满足 $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$ 的 $\boldsymbol y$，维数为 $m-r$ |
| determinant | 行列式 | 方阵对应的一个数，为零当且仅当矩阵奇异 |
| positive definite | 正定 | 对称矩阵且对一切非零 $\boldsymbol x$ 有 $\boldsymbol x^{\mathsf T}A\boldsymbol x>0$ |
| positive semidefinite | 半正定 | 对一切 $\boldsymbol x$ 有 $\boldsymbol x^{\mathsf T}A\boldsymbol x\ge0$，允许存在非零向量使其等于 0 |
| projection matrix | 投影矩阵 | 把向量投到子空间上的矩阵，直线情形为 $\boldsymbol a\boldsymbol a^{\mathsf T}/\boldsymbol a^{\mathsf T}\boldsymbol a$ |
| least squares | 最小二乘 | 无解时求使 $\|A\boldsymbol x-\boldsymbol b\|$ 最小的 $\boldsymbol x$ |
| normal equations | 正规方程 | $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$，最小二乘解的方程 |
| orthonormal | 标准正交 | 两两正交且长度为 1 的一组向量 |
| eigenvalue | 特征值 | 使 $A\boldsymbol x=\lambda\boldsymbol x$ 有非零解的 $\lambda$ |
| eigenvector | 特征向量 | 被 $A$ 映到自身倍数上的非零向量 |
| characteristic polynomial | 特征多项式 | $\det(A-\lambda I)$，其根恰为特征值 |
| diagonalization | 对角化 | 写成 $A=S\Lambda S^{-1}$，$S$ 的列是线性无关的特征向量 |
| trace | 迹 | 对角线元素之和，等于全部特征值之和 |
| Markov matrix | 马尔可夫矩阵 | 各列非负且列和为 1 的方阵，必有特征值 1 |
| steady state | 稳态 | 长时间后趋于不变的分布，由 $\lambda=1$ 的特征向量刻画 |
| skew-symmetric matrix | 反对称矩阵 | 满足 $A^{\mathsf T}=-A$ 的矩阵，特征值为纯虚数 |
| symmetric matrix | 对称矩阵 | 满足 $A^{\mathsf T}=A$ 的矩阵，可正交对角化 |
| singular value decomposition | 奇异值分解 | 任意矩阵写成 $U\Sigma V^{\mathsf T}$，即旋转—拉伸—旋转 |
| linear transformation | 线性变换 | 保持加法与数乘的映射，选定基后由矩阵表示 |
| change of basis | 基变换 | 换一组基，矩阵按 $M^{-1}AM$ 改变而代表同一变换 |
| similar matrices | 相似矩阵 | 满足 $B=M^{-1}AM$ 的一对矩阵，特征值相同 |

---

[← Lecture 33](/notes/mit-1806/lec33) ｜ [课程目录](/notes/mit-1806/overview)
