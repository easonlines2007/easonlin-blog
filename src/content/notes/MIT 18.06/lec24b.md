---
title: Lecture 24b · 第二次测验复习
description: 复习第二部分：正交、投影、行列式与特征值。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 26
tags:
  - lineal algebra
status: completed
publish: true
---

> *Quiz 2 review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 24b 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p25 · 第二次测验复习](https://www.bilibili.com/video/BV1ix411f7Yp?p=25)（48:20）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24b-quiz-2-review/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=25&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

第二次测验考的是课程第二部分的全部内容：正交性（orthogonality，含投影 projection、最小二乘 least squares、Gram-Schmidt）、行列式（determinant），以及特征值（eigenvalue）方程最基础的两节——解 $A\boldsymbol{x}=\lambda\boldsymbol{x}$、对角化（diagonalization）、计算 $A^k$。这三块看似各自成章，其实共用同一套语言：用"一个数"概括矩阵的某个侧面（长度、行列式、迹），用"一组方向"描述矩阵的作用（基、特征向量 eigenvector）。复习课的意义就在于把它们重新缝成一张网，让一道题同时用上三章的工具。

范围上有一条边界要记牢：微分方程与矩阵指数不在本次测验内，它们属于第三次测验。也就是说，特征值这一块只考到"求特征值、写对角化、算矩阵的幂"，不考 $e^{At}$。

本讲按"考点—方法—典型题"组织。每个考点先给出必须记住的公式或判据，再用往年考题里的具体数字走一遍，最后点出最容易出错的地方。这些题目大多是三五分钟就能做完的短问：求一个投影矩阵、核对一个行列式、数一数特征值。能否快速做完，不取决于背下多少公式，而取决于能否立刻判断"这个数字应该放进哪一格"。

![官方讲义摘要 第 1/6 页](</attachments/mit1806-07ee6fc3f3f793347463f141.png>)

*MIT OCW 官方讲义摘要 第 1/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

## 1. 复习地图：三个板块与一条主线

正交性板块有两个主角：列标准正交（orthonormal）的矩阵 $Q$ 与投影矩阵（projection matrix）$P$。"列标准正交"有一个等价的矩阵写法 $Q^{\mathsf T}Q=I$，因为 $Q^{\mathsf T}Q$ 的 $(i,j)$ 元正是内积 $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$，标准正交意味着它只能取 $1$（$i=j$）或 $0$。由此，投影到直线是 $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$，投影到子空间是 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$；当 $A\boldsymbol{x}=\boldsymbol{b}$ 无解时，把 $\boldsymbol{b}$ 投影到列空间（column space）就得到最小二乘解。Gram-Schmidt 做的是反方向的事：从一组线性无关（linearly independent）的向量出发，逐个减掉它在已有方向上的投影，得到标准正交基；因为最后要除以长度，这一步会带来大量平方根。

行列式板块的骨架是三条定义性质加七条推论：性质一至三定义行列式，四至十（例如 $\det(AB)=\det A\det B$）都由它们推出，所以不必当成十条互不相干的公式来背。计算有两条路：按 $n!$ 项的"大公式"展开（一半带正号、一半带负号），以及按行或列做代数余子式展开；后者对大量元素为零的矩阵特别有效，并顺势给出 $A^{-1}=\frac{1}{\det A}C^{\mathsf T}$。

特征值板块只考前两节：解特征方程 $\det(A-\lambda I)=0$、求特征向量，以及当 $n$ 个特征向量线性无关时，把全部 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 一次写成 $A=S\Lambda S^{-1}$，从而 $A^k=S\Lambda^kS^{-1}$。

一条主线把三个板块串起来：迹（trace）等于特征值之和，行列式等于特征值之积，



$$
\operatorname{tr}A=\sum_i\lambda_i,\qquad \det A=\prod_i\lambda_i .
$$



这两条等式在考场上几乎免费：算完特征值，顺手核对和与积，绝大多数算术错误当场现形。后面每个考点都会用到它们。

复习课上的题目还反复演示一件事：一道题往往跨两章。求完投影矩阵紧接着问它的特征值，是正交性与特征值的合流；三对角矩阵的行列式递推最后化成一个 $2\times 2$ 矩阵的特征值问题，是行列式与特征值的合流；$A_3$ 的投影矩阵问法又要同时用到列空间（正交性）与奇异性（行列式）。把三章当成三门课分开背，遇到这种题就会卡住；知道它们说的是同一件事，才知道该从哪里下手。

![官方讲义摘要 第 2/6 页](</attachments/mit1806-2be401686fdfba38b7a85566.png>)

*MIT OCW 官方讲义摘要 第 2/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

## 2. 考点一：投影矩阵的秩、特征值与差分方程

考点：给定向量 $\boldsymbol{a}$，求投影到 $\boldsymbol{a}$ 所张成直线的矩阵 $P$，并读出它的秩、特征值，以及 $\boldsymbol{u}_{k+1}=P\boldsymbol{u}_k$ 的解。

方法是把一般公式退化成"只有一列"的情形。$A$ 只有一列 $\boldsymbol{a}$ 时，$A^{\mathsf T}A=\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$ 只是一个数，可以从逆的位置搬到分母：



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



这个公式不是背出来的。设 $\boldsymbol{b}$ 在直线上的投影是 $\hat{x}\boldsymbol{a}$，则误差 $\boldsymbol{b}-\hat{x}\boldsymbol{a}$ 必与 $\boldsymbol{a}$ 垂直，即 $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-\hat{x}\boldsymbol{a})=0$，从中解出 $\hat{x}=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$；把 $\hat{x}$ 乘回 $\boldsymbol{a}$，就得到上面的 $P\boldsymbol{b}$。同一个式子也解释了 $P^2=P$：第一次投影已经把垂直于直线的分量清空，再投一次不会改变任何东西。

典型题取 $\boldsymbol{a}=(2,1,2)$：分母是 $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}=4+1+4=9$，于是



$$
P=\frac{1}{9}\begin{bmatrix}4&2&4\\2&1&2\\4&2&4\end{bmatrix}.
$$



一个矩阵能读出四种信息。秩（rank）为 $1$，因为三列都沿 $\boldsymbol{a}$ 的方向；列空间就是那条直线；零空间（nullspace）是与 $\boldsymbol{a}$ 垂直的平面；特征值是 $0,0,1$——秩为 $1$ 说明有两个线性无关的方向被压成零（二重特征值 $0$），而 $P\boldsymbol{a}=\boldsymbol{a}$ 说明 $\boldsymbol{a}$ 自身不动，它就是特征值 $1$ 对应的特征向量。核对迹：对角元之和为 $\frac{9}{9}=1=0+0+1$。

差分方程（difference equation）取初值 $\boldsymbol{u}_0=(9,9,0)$。第一步直接算投影：$\boldsymbol{a}^{\mathsf T}\boldsymbol{u}_0=18+9+0=27$，除以 $9$ 得系数 $3$，所以



$$
\boldsymbol{u}_1=P\boldsymbol{u}_0=3\boldsymbol{a}=(6,3,6).
$$



第二步不必再算：$\boldsymbol{u}_1$ 已在直线上，而投影把直线上的点原样留下（$P^2=P$），故 $\boldsymbol{u}_2=\boldsymbol{u}_1=(6,3,6)$，此后不变。

若换成一个普通矩阵，"乘 $k$ 次"就必须走特征值展开：把 $\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+c_3\boldsymbol{x}_3$，则 $\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+c_3\lambda_3^k\boldsymbol{x}_3$，劳动在于求特征值、特征向量和三个系数。投影矩阵之所以跳过这套机械步骤，正因为它的两个特征值是 $0$：$0^k$ 让那两项从 $k=1$ 起就消失，只剩 $\boldsymbol{a}$ 这一项。说到底，$\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 的解就是 $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$，算差分方程与算矩阵的幂本来是同一件事。

易错点：忘掉分母 $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$；把特征值写成 $1,1,1$；或者每迭代一步都重做一次完整投影，而没有用 $P^2=P$ 直接收工。

## 3. 考点二：最小二乘的两张图

考点：用一条过原点的直线拟合数据，写出正规方程并求解；同时说清"拟合图"与"投影图"各画了什么。

典型题：$t=1,2,3$ 时 $y=4,5,8$，模型为 $y=Dt$。若直线恰好穿过三个点，需要同时满足



$$
D=4,\qquad 2D=5,\qquad 3D=8,
$$



三个方程、一个未知数，无解。改写成 $A\boldsymbol{x}=\boldsymbol{b}$：



$$
A=\begin{bmatrix}1\\2\\3\end{bmatrix},\qquad \boldsymbol{b}=\begin{bmatrix}4\\5\\8\end{bmatrix}.
$$



因为直线过原点，模型没有常数项，所以 $A$ 里没有全 $1$ 的那一列。正规方程（normal equation）是 $A^{\mathsf T}A\hat{D}=A^{\mathsf T}\boldsymbol{b}$：$A^{\mathsf T}A=1+4+9=14$，$A^{\mathsf T}\boldsymbol{b}=1\cdot4+2\cdot5+3\cdot8=38$，所以



$$
\hat{D}=\frac{38}{14}=\frac{19}{7}.
$$



两张图必须分清。第一张在 $ty$ 平面上：三个点与直线 $y=\frac{19}{7}t$，直线不穿过任何一点，但整体误差最小。第二张在 $\mathbb{R}^3$ 里：被投影的向量是 $\boldsymbol{b}=(4,5,8)$，$A$ 的列空间是由 $(1,2,3)$ 张成的直线，投影点为



$$
A\hat{D}=\frac{19}{7}\begin{bmatrix}1\\2\\3\end{bmatrix}=\left(\frac{19}{7},\frac{38}{7},\frac{57}{7}\right),
$$



而 $\hat{D}$ 就是这组基下的系数。最小二乘的全部代数运算都发生在第二张图里；第一张图里并没有"把数据点投影到直线上"这个动作，这是最常见的误解。两张图的联系是残差：$\boldsymbol{b}-A\hat{D}=\left(\frac{9}{7},-\frac{3}{7},-\frac{1}{7}\right)$ 与列空间正交，即 $A^{\mathsf T}(\boldsymbol{b}-A\hat{D})=0$，这正是正规方程的移项形式。

这个对比还有一个实际后果：投影图所在的 $\mathbb{R}^3$ 维数等于数据点的个数，而 $A^{\mathsf T}A$ 的阶数等于未知数的个数。数据点再多，正规方程也只是一个小方程组——这里只有一个未知数，$A^{\mathsf T}A$ 干脆只是一个数 $14$。

易错点：明明过原点却给 $A$ 添一列 $1$；把 $A^{\mathsf T}\boldsymbol{b}$ 算成 $4+5+8$ 而不是加权和 $38$；把拟合图像当成投影图像。

![视频 00:18:22：课堂板书](</attachments/mit1806-87e9a80aea9a588a3eb0e66e.jpg>)

*视频 00:18:22｜约对应第 3 节「3. 考点二：最小二乘的两张图」附近。*

![官方讲义摘要 第 3/6 页](</attachments/mit1806-8f617d3d0b4b1cdcf4547b3d.png>)

*MIT OCW 官方讲义摘要 第 3/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

## 4. 考点三：Gram-Schmidt 与正交基

考点：给平面的一组基（basis），求同一平面的正交基；并记住"标准正交"的矩阵判据 $Q^{\mathsf T}Q=I$。

方法一句话：第一根方向保留，新向量减去它在已有方向上的投影。对两个向量，



$$
\boldsymbol{B}=\boldsymbol{a}_2-\frac{\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_1}\boldsymbol{a}_1.
$$



典型题：$\boldsymbol{a}_1=(1,2,3)$，$\boldsymbol{a}_2=(1,1,1)$。这两个向量张成的平面，就是 $3\times 2$ 矩阵 $[\,\boldsymbol{a}_1\ \boldsymbol{a}_2\,]$ 的列空间，所以本题实际是在给这个列空间找一组正交基。内积 $\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_2=1+2+3=6$，$\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_1=14$，系数为 $\frac{6}{14}=\frac{3}{7}$，于是



$$
\boldsymbol{B}=(1,1,1)-\frac{3}{7}(1,2,3)=\left(\frac{4}{7},\frac{1}{7},-\frac{2}{7}\right).
$$



检验：$\boldsymbol{a}_1^{\mathsf T}\boldsymbol{B}=\frac{4}{7}+\frac{2}{7}-\frac{6}{7}=0$。题目只要求正交，所以不必除以长度；若要标准正交基，则除长度得 $\frac{1}{\sqrt{14}}(1,2,3)$ 与 $\frac{1}{\sqrt{21}}(4,1,-2)$——注意 $\boldsymbol{B}$ 的长度平方为 $\frac{16+1+4}{49}=\frac{21}{49}$，平方根正是这一步"到处都是根号"的由来。

向量多于两个时，同一个动作重复：第 $j$ 个向量减去它在每一根已经正交化的向量上的投影，



$$
\boldsymbol{B}_j=\boldsymbol{a}_j-\sum_{i<j}\frac{\boldsymbol{B}_i^{\mathsf T}\boldsymbol{a}_j}{\boldsymbol{B}_i^{\mathsf T}\boldsymbol{B}_i}\boldsymbol{B}_i .
$$



每减一次就消掉一个已有方向，最后剩下的那部分必然与之前所有方向垂直。

答案不唯一：平面内的正交对可以整体旋转，Gram-Schmidt 只给出其中一对，并且保持 $\boldsymbol{a}_1$ 的方向不变。

易错点：投影方向算反（拿 $\boldsymbol{a}_1$ 往 $\boldsymbol{a}_2$ 上投影）；把第一根向量也改了；把 $\frac{6}{14}$ 写反成 $\frac{14}{6}$。

![视频 00:25:18：课堂板书](</attachments/mit1806-10bbe214cb05e6414ccde8c6.jpg>)

*视频 00:25:18｜约对应第 4 节「4. 考点三：Gram-Schmidt 与正交基」附近。*

![官方讲义摘要 第 4/6 页](</attachments/mit1806-e3a762afdf4946ef5ce99ba4.png>)

*MIT OCW 官方讲义摘要 第 4/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

## 5. 考点四：特征值给出的三个速算结论

考点：已知一个 $4\times 4$ 矩阵的四个特征值，回答可逆性、逆矩阵的行列式、$A+I$ 的迹——完全不看矩阵的元素。

设 $\lambda_1,\lambda_2,\lambda_3,\lambda_4$ 是 $A$ 的特征值。三条结论都来自 $\operatorname{tr}A=\sum\lambda_i$、$\det A=\prod\lambda_i$，以及"简单变换如何改变特征值"。后者的依据很短：若 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，两边左乘 $A^{-1}$ 得 $\boldsymbol{x}=\lambda A^{-1}\boldsymbol{x}$，即 $A^{-1}\boldsymbol{x}=\frac{1}{\lambda}\boldsymbol{x}$；而 $(A+I)\boldsymbol{x}=\lambda\boldsymbol{x}+\boldsymbol{x}=(\lambda+1)\boldsymbol{x}$。特征向量原封不动，变的只是特征值。

第一，$A$ 可逆当且仅当所有 $\lambda_i\ne0$。若某个 $\lambda=0$，则 $A\boldsymbol{x}=\boldsymbol{0}$ 有非零解，零空间非平凡，矩阵奇异（singular）；反之无零特征值则 $\det A=\prod\lambda_i\ne0$。

第二，$\det(A^{-1})=\dfrac{1}{\lambda_1\lambda_2\lambda_3\lambda_4}$。因为 $A^{-1}$ 的特征值是 $\dfrac{1}{\lambda_i}$（特征向量不变），而逆矩阵的行列式等于其特征值之积。

第三，$\operatorname{tr}(A+I)=(\lambda_1+1)+(\lambda_2+1)+(\lambda_3+1)+(\lambda_4+1)=\sum\lambda_i+4$。加上 $I$ 把每个特征值平移 $1$，迹就整体平移 $n=4$。

三问共用一个动作：先判断新矩阵的特征值，再用和与积。这也说明迹与行列式是本讲最好的自检工具。

易错点：$\operatorname{tr}(A+I)=\operatorname{tr}A$（漏掉 $+4$）；$\det(A+I)=\det A+1$（应当是 $\prod(\lambda_i+1)$）；把 $\det(A^{-1})$ 误写成 $\prod\lambda_i$。

![视频 00:31:25：课堂板书](</attachments/mit1806-aacb5bb6064c4458eed66b45.jpg>)

*视频 00:31:25｜约对应第 5 节「5. 考点四：特征值给出的三个速算结论」附近。*

## 6. 考点五：矩阵族与行列式递推

### 三对角全 $1$ 矩阵：二阶递推与周期解

典型题：$A_n$ 是 $n\times n$ 矩阵，主对角线以及上下两条次对角线全为 $1$，其余为零；记 $D_n=\det A_n$。用代数余子式（cofactor）证明 $D_n$ 满足二阶递推，并求出系数。

按第一行展开。第一项是 $(1,1)$ 位置的 $1$ 乘它的代数余子式；去掉第一行第一列后剩下的正是 $A_{n-1}$，所以这一项是 $D_{n-1}$。第二项来自 $(1,2)$ 位置的 $1$，而 $(1,2)$ 在展开时带负号；它的余子式按第一列展开只剩一项，这一项在余子式的 $(1,1)$ 位置、取正号，落下的正是 $D_{n-2}$。两处符号合成后为负，于是



$$
D_n=D_{n-1}-D_{n-2},\qquad D_1=1,\qquad D_2=\begin{vmatrix}1&1\\1&1\end{vmatrix}=0.
$$



有减号，所以它不是斐波那契型递推。把二阶递推改写成一阶系统：令 $\boldsymbol{v}_n=\begin{bmatrix}D_n\\D_{n-1}\end{bmatrix}$，则



$$
\boldsymbol{v}_n=\begin{bmatrix}1&-1\\1&0\end{bmatrix}\boldsymbol{v}_{n-1}=M\boldsymbol{v}_{n-1}.
$$



这是处理高阶递推的标准手法：把相邻两步打包成一个向量，二阶递推就变成一次矩阵乘法，特征值理论可以直接搬用。

$M$ 的特征值决定 $D_n$ 的走向。由 $\det(M-\lambda I)=\lambda^2-\lambda+1=0$ 得



$$
\lambda=\frac{1\pm\sqrt{3}\,i}{2}=e^{\pm i\pi/3}.
$$



实部平方 $\frac{1}{4}$ 加虚部平方 $\frac{3}{4}$ 等于 $1$，所以模长为 $1$，两个特征值都落在单位圆上。模长小于 $1$ 会衰减，大于 $1$ 会爆炸，等于 $1$ 则不增不减——这就是稳定性的判据。又因为 $\lambda^6=1$，而 $M$ 的两个特征值互异（可对角化），所以 $M^6=I$，进而 $\boldsymbol{v}_{n+6}=\boldsymbol{v}_n$。把 $D_1,D_2$ 代进递推走几步，就能看到这个周期：$D_3=D_2-D_1=-1$，$D_4=D_3-D_2=-1$，$D_5=D_4-D_3=0$，$D_6=D_5-D_4=1$，$D_7=D_6-D_5=1$，于是 $1,0,-1,-1,0,1$ 开始重复。$D_n$ 既不消失也不发散，只是周期性地绕圈。

易错点：漏掉 $(1,2)$ 位置带来的负号，得到 $D_n=D_{n-1}+D_{n-2}$（斐波那契型，特征值约为 $1.618$ 与 $-0.618$，序列指数增长）；不核对 $D_1,D_2$ 就顺着递推往下写；看到复特征值就以为"没有真实行为"，其实复特征值代表旋转，模长才决定收敛。

### 零对角、斜对角为 $1,2,3,\dots$ 的矩阵族

典型题：



$$
A_3=\begin{bmatrix}0&1&0\\1&0&2\\0&2&0\end{bmatrix},\qquad A_4=\begin{bmatrix}0&1&0&0\\1&0&2&0\\0&2&0&3\\0&0&3&0\end{bmatrix},
$$



两者都对称。$A_3$ 奇异：第三列 $(0,2,0)$ 是第一列 $(0,1,0)$ 的 $2$ 倍，故 $\det A_3=0$，秩为 $2$，列空间是 $\mathbb{R}^3$ 中的一张平面。此时不能直接用 $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$，因为 $A_3^{\mathsf T}A_3$ 本身奇异；应取列空间的一组基，即 $\boldsymbol{c}_1=(0,1,0)$ 与 $\boldsymbol{c}_2=(1,0,2)$，令 $B=[\boldsymbol{c}_1\ \boldsymbol{c}_2]$，这时 $B^{\mathsf T}B=\begin{bmatrix}1&0\\0&5\end{bmatrix}$，代入 $P=B(B^{\mathsf T}B)^{-1}B^{\mathsf T}$ 得



$$
P=\frac{1}{5}\begin{bmatrix}1&0&2\\0&5&0\\2&0&4\end{bmatrix}.
$$



检验：$P$ 对称、$P^2=P$、秩为 $2$、迹为 $\frac{1+5+4}{5}=2$，与投影矩阵的特征值 $1,1,0$ 吻合。这个矩阵的中间一行、一列恰好只有对角元 $1$，原因是基向量 $\boldsymbol{c}_1=(0,1,0)$ 本身就是坐标轴方向：沿 $y$ 轴的向量已经在平面内，投影不会改变它。

$A_3$ 的特征值由 $\det(A_3-\lambda I)=-\lambda^3+5\lambda=-\lambda(\lambda^2-5)$ 给出，即 $0,\sqrt{5},-\sqrt{5}$。把三者相加得 $0$，与对角元之和相等，这是一次很便宜的自检——本题行列式为零，帮不上忙，只有迹能用。题目若再要特征向量，做法照旧：把每个 $\lambda$ 代回 $(A_3-\lambda I)\boldsymbol{x}=\boldsymbol{0}$，求对应的零空间。

$A_4$ 恰好相反：用 $n!$ 项的大公式要写 $24$ 项，按第一行展开则只要两步——第一行唯一的非零元在 $(1,2)$，带负号，再展开一次得 $\det A_4=9\ne0$，所以 $A_4$ 可逆，列空间是整个 $\mathbb{R}^4$，投影矩阵就是 $I_4$——看似最难的一问反而最省力。由此可以猜出这族矩阵的规律：奇数阶奇异，偶数阶可逆。

易错点：对奇异矩阵硬套 $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$（$A^{\mathsf T}A$ 此时不可逆）；或者一看到"求投影矩阵"就写 $I$，而不先判断矩阵是否可逆。

![视频 00:38:15：课堂板书](</attachments/mit1806-9bdad8452109f71a8cf1cb88.jpg>)

*视频 00:38:15｜约对应第 6 节「6. 考点五：矩阵族与行列式递推」附近。*

![官方讲义摘要 第 5/6 页](</attachments/mit1806-8689ce00f09c5becf7bfac8b.png>)

*MIT OCW 官方讲义摘要 第 5/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

![视频 00:43:30：课堂板书](</attachments/mit1806-d1c75e8afe823635f00e8f68.jpg>)

*视频 00:43:30｜约对应第 6 节「6. 考点五：矩阵族与行列式递推」附近。*

![官方讲义摘要 第 6/6 页](</attachments/mit1806-0d635f093bd6730b788b5f8d.png>)

*MIT OCW 官方讲义摘要 第 6/6 页（18.06SC Lecture 24b Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 测验范围是正交性、行列式与特征值前两节；微分方程和 $e^{At}$ 不考。
- 正交性的矩阵语言是 $Q^{\mathsf T}Q=I$；投影到直线用 $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$，投影到子空间用 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$。
- 对 $\boldsymbol{a}=(2,1,2)$，$P=\frac{1}{9}\begin{bmatrix}4&2&4\\2&1&2\\4&2&4\end{bmatrix}$，秩为 $1$，特征值为 $0,0,1$，迹为 $1$。
- 差分方程 $\boldsymbol{u}_{k+1}=P\boldsymbol{u}_k$ 从 $\boldsymbol{u}_0=(9,9,0)$ 出发，因 $P^2=P$，一步到达 $(6,3,6)$ 后不再移动。
- 最小二乘把 $\boldsymbol{b}=(4,5,8)$ 投影到 $\operatorname{span}\{(1,2,3)\}$，正规方程给出 $\hat{D}=\frac{38}{14}=\frac{19}{7}$。
- Gram-Schmidt 对 $\boldsymbol{a}_1=(1,2,3)$、$\boldsymbol{a}_2=(1,1,1)$ 给出正交向量 $\left(\frac{4}{7},\frac{1}{7},-\frac{2}{7}\right)$。
- 特征值决定可逆性（无零特征值）、逆矩阵的行列式（$\prod 1/\lambda_i$）与迹（$\operatorname{tr}(A+I)=\operatorname{tr}A+4$）。
- 三对角全 $1$ 矩阵的行列式满足 $D_n=D_{n-1}-D_{n-2}$，$D_1=1,D_2=0$；转移矩阵特征值为 $e^{\pm i\pi/3}$，故 $M^6=I$，$D_n$ 以 $6$ 为周期。
- $A_3$ 因第三列是 $(0,2,0)$、第一列是 $(0,1,0)$ 而奇异，投影矩阵为 $\frac{1}{5}\begin{bmatrix}1&0&2\\0&5&0\\2&0&4\end{bmatrix}$，特征值 $1,1,0$；$A_4$ 的 $\det=9$，投影矩阵为 $I_4$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| orthonormal | 标准正交 | 两两内积为零且每个向量长度为 $1$ |
| projection matrix | 投影矩阵 | 把向量投到子空间上的矩阵，满足 $P^{\mathsf T}=P$、$P^2=P$ |
| least squares | 最小二乘 | 无解时寻找使误差向量最短的近似解 |
| normal equation | 正规方程 | $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$，最小二乘解满足的方程 |
| Gram-Schmidt | 格拉姆-施密特 | 逐个减去已有方向上的投影，把基化为标准正交基 |
| determinant | 行列式 | 概括矩阵可逆性与体积缩放的单个数，等于特征值之积 |
| cofactor | 代数余子式 | 去掉某行某列并计入符号的余子式，用于按行展开 |
| trace | 迹 | 主对角线元素之和，等于特征值之和 |
| eigenvalue | 特征值 | 使 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 有非零解的数 |
| eigenvector | 特征向量 | 被 $A$ 作用后方向不变的非零向量 |
| diagonalization | 对角化 | 写 $A=S\Lambda S^{-1}$，用特征向量作基 |
| singular | 奇异的 | 不可逆，等价于存在零特征值或列向量线性相关 |
| difference equation | 差分方程 | $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$，由特征值决定长期行为 |
| stability | 稳定性 | 由特征值模长判定：大于 $1$ 发散，小于 $1$ 衰减，等于 $1$ 有界 |

---

[← Lecture 24](/notes/mit-1806/lec24) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 25 →](/notes/mit-1806/lec25)
