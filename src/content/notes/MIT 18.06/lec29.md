---
title: Lecture 29 · 奇异值分解
description: 掌握奇异值分解，理解任意矩阵“旋转—拉伸—旋转”的结构。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 31
tags:
  - lineal algebra
status: completed
publish: true
---

> *Singular value decomposition* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 29 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p30 · 奇异值分解](https://www.bilibili.com/video/BV1ix411f7Yp?p=30)（41:35）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=30&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

到这里，这门课已经攒下了一串矩阵分解：$A=LU$、$A=QR$、一般矩阵的 $A=S\Lambda S^{-1}$、对称矩阵的 $A=Q\Lambda Q^{\mathsf T}$。它们各自都有前提：能顺利消元、列向量线性无关、有足够多的线性无关特征向量、矩阵本身对称。本讲给出最后一个，也是最好的一个分解——**奇异值分解**（singular value decomposition, SVD）。它没有前提：任意矩阵都能做，方的、长方的、可逆的、奇异的、能对角化的、不能对角化的，全都行。它的三个因子恰好是课程里最熟悉的三种好矩阵：正交矩阵、对角矩阵、正交矩阵。前面的分解都是"特殊的矩阵才有"的分解，只有它是"任何矩阵都有"的分解。

SVD 的动机来自对角化的缺口。一般的 $A=S\Lambda S^{-1}$ 里，$S$ 的列是特征向量，但它们互相并不垂直，于是等式左右两侧用的是两组倾斜的基。对称矩阵是最幸运的情形：特征向量自动正交，$S$ 升级成 $Q$，$A=Q\Lambda Q^{\mathsf T}$，两侧共用同一组标准正交基；若再要求正定，对角线上还全是正数。对一般矩阵这份运气没有了，于是把要求放宽：允许两侧用**不同**的两组标准正交基。代价是中间那个对角矩阵里的数不再是特征值，而是一个新角色——**奇异值**（singular value）。

本讲沿着一条很具体的路线推进：先把目标画成一张图，即行空间的一组标准正交基被 $A$ 送到列空间的一组标准正交基上；再把这张图翻译成矩阵等式 $A=U\Sigma V^{\mathsf T}$；然后用 $A^{\mathsf T}A$ 与 $AA^{\mathsf T}$ 分别把两侧的基算出来；最后用两个数字例子——一个可逆的 $2\times2$ 矩阵、一个秩 1 矩阵——把整套流程走完。走完会发现 SVD 的真正含义：它给出了四个基本子空间的一组"正确"的基，这些基既是标准正交的，又能把 $A$ 化成对角矩阵。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-3e9e5f5a19a85a9f02df2d6b.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 29 Summary，CC BY-NC-SA 4.0）。*

## 1. 从特征值到奇异值

SVD 要补的，是普通对角化留下的那个缺口。先从最好的情形看起。对称矩阵的特征向量可以选成互相正交的。把它们单位化并按列排成矩阵，就得到正交矩阵 $Q$，即 $Q^{\mathsf T}Q=I$，于是对称矩阵可以正交对角化：



$$
A=Q\Lambda Q^{\mathsf T}.
$$



如果 $A$ 还是正定的，$\Lambda$ 的对角元全为正。把对角元换个名字，令 $\sigma_i=\lambda_i$，同一个等式读作



$$
A=Q\Sigma Q^{\mathsf T},
$$



即"正交 × 对角 × 正交"，而且两侧可以用**同一个** $Q$。这正是 SVD 在对称正定情形下的样子，也是最省事的一种：一组标准正交基同时充当两侧的基。之所以能共用，是因为对称矩阵的特征向量碰巧正交——这是特殊性质，不是普遍现象。

一般矩阵没有这种运气。它的对角化是 $A=S\Lambda S^{-1}$，$S$ 由特征向量组成，而特征向量通常并不正交；因此 $S$ 不是正交矩阵，$S^{-1}$ 也不能写成 $S^{\mathsf T}$。等式两侧的基一歪，"在标准正交基下对角化"这句话就不成立了。此外，长方矩阵连特征值都无从谈起，特征值这条路在那种情形下根本走不通。

SVD 的思路是把"对角化"这个要求拆开来看。它其实包含两件事：（1）两侧所用的基是标准正交的；（2）非对角位置全是零。$A=S\Lambda S^{-1}$ 满足了（2）却牺牲了（1）；正交对角化两条都满足，但只对对称矩阵成立。SVD 的选择是保留（1）与（2），放弃"两侧共用同一组基"这条附加要求，让左边的基和右边的基各自独立地选。于是问题变成：

> 是否存在 $m\times m$ 的正交矩阵 $U$、$n\times n$ 的正交矩阵 $V$、以及 $m\times n$ 的对角形矩阵 $\Sigma$，使得 $A=U\Sigma V^{\mathsf T}$？

答案是肯定的，对任意矩阵都成立。$\Sigma$ 对角线上的数 $\sigma_1,\sigma_2,\dots,\sigma_r$ 全为正，称为**奇异值**。要提醒的是：奇异值一般不是 $A$ 的特征值，而是 $A^{\mathsf T}A$ 的特征值的正平方根——这个事实下一节会推出来。只有对称正定的情形两者恰好重合（那时 $\sigma_i=\lambda_i$）。正因为换了对象，长方矩阵和不可对角化的矩阵才有资格进入这个框架。

![视频 00:04:10：课堂板书](</attachments/mit1806-9e76252ad48ebd6f42d49b49.jpg>)

*视频 00:04:10｜约对应第 1 节「1. 从特征值到奇异值」附近。*

## 2. 几何图像：行空间的基被送到列空间的基

一个 $m\times n$ 矩阵就是一个从 $\mathbb{R}^n$ 到 $\mathbb{R}^m$ 的线性变换。课程里那张反复出现的图把它的作用讲得最清楚：输入空间分成行空间与零空间两块，输出空间分成列空间与左零空间两块；零空间被整个压到 $\boldsymbol{0}$，行空间则一一映满列空间，两边维数同为 $r=\operatorname{rank}(A)$。真正有内容的部分，是行空间到列空间那一段。

SVD 要找的，是这一段映射下互相匹配的两组基：行空间的一组标准正交基 $\boldsymbol v_1,\dots,\boldsymbol v_r$，经 $A$ 作用之后，恰好变成列空间中一组互相垂直的向量；再把像单位化，得到列空间的标准正交基 $\boldsymbol u_1,\dots,\boldsymbol u_r$。两套基之间只差一个长度因子：



$$
A\boldsymbol v_i=\sigma_i\boldsymbol u_i,\qquad i=1,2,\dots,r .
$$



$\sigma_i>0$ 就是这个方向的**拉伸倍数**（stretching factor）。换句话说，$A$ 把一组互相垂直的单位向量变成另一组互相垂直的向量，只改变长度，不改变夹角。整张图里那两个直角——输入侧的直角和输出侧的直角——同时被保住，这就是 SVD 全部内容的一句话版本。

为什么不能随随便便给行空间找一组标准正交基？因为 Gram-Schmidt 正交化只管输入这一侧：它能从任何一组基磨出一组标准正交基，但 $A$ 乘上去之后，没有任何理由保持垂直。取一般的标准正交基，它们的像向量之间的夹角会变得杂乱无章，长度也各不相同。所以问题不是"怎样正交化"，而是"哪一组正交方向被 $A$ 保持为正交"——这是一个特征方向问题，准确说是 $A^{\mathsf T}A$ 的特征方向问题，下一节说明原因。

零空间在这里不构成任何麻烦。把行空间的基补全：$\boldsymbol v_{r+1},\dots,\boldsymbol v_n$ 取零空间 $N(A)$ 的标准正交基，$A$ 把它们全部送到 $\boldsymbol 0$，自动满足"像互相垂直"（零向量与任何向量都正交）。再把列空间的基补全：$\boldsymbol u_{r+1},\dots,\boldsymbol u_m$ 取左零空间 $N(A^{\mathsf T})$ 的标准正交基。这些补出来的方向在 $\Sigma$ 的对角线上对应 $0$，也就是"乘以零"。真正要花力气找的只有 $r$ 对：行空间里的 $\boldsymbol v$ 与列空间里的 $\boldsymbol u$，两侧维数都是 $r$；零空间的维数是 $n-r$，左零空间是 $m-r$。

![视频 00:12:39：课堂板书](</attachments/mit1806-bf6b8826abbaf0568d904504.jpg>)

*视频 00:12:39｜约对应第 2 节「2. 几何图像：行空间的基被送到列空间的基」附近。*

![官方讲义摘要 第 2/4 页](</attachments/mit1806-834abc5b0f5b460501551b28.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 29 Summary，CC BY-NC-SA 4.0）。*

## 3. 写成矩阵等式：$A=U\Sigma V^{\mathsf T}$

配对关系 $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$ 可以一次性写成矩阵乘法。先把前 $r$ 个向量按列排好：



$$
A\begin{bmatrix}\boldsymbol v_1&\boldsymbol v_2&\cdots&\boldsymbol v_r\end{bmatrix}
=\begin{bmatrix}\boldsymbol u_1&\boldsymbol u_2&\cdots&\boldsymbol u_r\end{bmatrix}
\begin{bmatrix}\sigma_1&&\\&\ddots&\\&&\sigma_r\end{bmatrix}.
$$



左边第 $i$ 列是 $A\boldsymbol v_i$，右边第 $i$ 列是 $\sigma_i\boldsymbol u_i$，逐列相等，等式成立。注意右边这个对角矩阵是从右边乘上去的，它的作用是给每一列乘上各自的倍数——这正是"按列缩放"。

再把补出来的 $\boldsymbol v_{r+1},\dots,\boldsymbol v_n$（零空间方向）与 $\boldsymbol u_{r+1},\dots,\boldsymbol u_m$（左零空间方向）也按列补进去。左边成为 $AV$，$V$ 是 $n\times n$ 的正交矩阵；右边成为 $U\Sigma$，$U$ 是 $m\times m$ 的正交矩阵，而 $\Sigma$ 是 $m\times n$ 的矩阵，左上角是一块 $\operatorname{diag}(\sigma_1,\dots,\sigma_r)$，其余全是零：



$$
\Sigma=\left[\begin{array}{c|c}D&\boldsymbol 0\\\hline \boldsymbol 0&\boldsymbol 0\end{array}\right],
\qquad D=\operatorname{diag}(\sigma_1,\dots,\sigma_r),\quad D\ \text{为}\ r\times r .
$$



补进去的那些列在右边被 $\Sigma$ 的零块乘掉，所以不破坏等式。于是得到 $AV=U\Sigma$。$V$ 是正交矩阵，$V^{-1}=V^{\mathsf T}$，两边右乘 $V^{\mathsf T}$，就得到 SVD 的最终形式：



$$
A=U\Sigma V^{\mathsf T}.
$$



这个等式说了三件事。第一，$U$ 与 $V$ 一般不能取成同一个矩阵，只有对称正定这类情形两侧才共用一组基。第二，$A$ 被这两组基对角化了：$A\boldsymbol v_i$ 只有 $\boldsymbol u_i$ 方向的分量，没有交叉项，即 $\boldsymbol v$ 与 $\boldsymbol v$ 之间没有耦合，$\boldsymbol u$ 与 $\boldsymbol u$ 之间也没有耦合。第三，$\Sigma$ 的形状是 $m\times n$、秩为 $r$，矩阵奇异或不是方阵时多出来的那些零，记录的正是零空间与左零空间的维数。

![视频 00:15:48：课堂板书](</attachments/mit1806-b6de5672e92368164d25fcd4.jpg>)

*视频 00:15:48｜约对应第 3 节「3. 写成矩阵等式：$A=U\Sigma V^{\mathsf T}$」附近。*

## 4. 用 $A^{\mathsf T}A$ 求 $V$，用 $AA^{\mathsf T}$ 求 $U$

$U$ 与 $V$ 都是未知的，同时求解不划算。办法是造一个组合，把其中一个消掉。这里用的仍然是 $A^{\mathsf T}A$——凡是遇到长方形矩阵，这个组合总会冒出来——把它按 SVD 展开：



$$
A^{\mathsf T}A=\bigl(V\Sigma^{\mathsf T}U^{\mathsf T}\bigr)\bigl(U\Sigma V^{\mathsf T}\bigr)
=V\Sigma^{\mathsf T}\bigl(U^{\mathsf T}U\bigr)\Sigma V^{\mathsf T}
=V\bigl(\Sigma^{\mathsf T}\Sigma\bigr)V^{\mathsf T}.
$$



关键在中间：$U$ 是正交矩阵，$U^{\mathsf T}U=I$，于是 $U$ 整个消失。剩下的 $\Sigma^{\mathsf T}\Sigma$ 是 $n\times n$ 的对角矩阵，对角线上是 $\sigma_1^2,\dots,\sigma_r^2$，后面跟着 $n-r$ 个零。所以



$$
A^{\mathsf T}A=V\operatorname{diag}\bigl(\sigma_1^2,\dots,\sigma_r^2,0,\dots,0\bigr)V^{\mathsf T}.
$$



这是一个标准的正交对角化。$A^{\mathsf T}A$ 本身对称（$(A^{\mathsf T}A)^{\mathsf T}=A^{\mathsf T}A$），因此必有正交的特征向量组；上式说明这些特征向量就是 $V$ 的列，对应的特征值就是 $\sigma_i^2$。另外 $A^{\mathsf T}A$ 必是半正定的，因为对任意 $\boldsymbol x$，



$$
\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x
=(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)\ge 0 ,
$$



右边是 $A\boldsymbol x$ 与自己的内积，也就是它的长度平方，恒非负。所以 $A^{\mathsf T}A$ 的特征值不可能为负，开平方总有意义。奇异值取的是**正**的平方根。

同样的手法把乘法次序调过来。这时夹在中间的是 $V^{\mathsf T}V=I$，$V$ 被消掉，留下的是 $U$：



$$
AA^{\mathsf T}=U\Sigma\Sigma^{\mathsf T}U^{\mathsf T}
=U\operatorname{diag}\bigl(\sigma_1^2,\dots,\sigma_r^2,0,\dots,0\bigr)U^{\mathsf T}.
$$



于是 $U$ 的列是 $AA^{\mathsf T}$ 的单位特征向量。两个矩阵大小可能不同（$A^{\mathsf T}A$ 是 $n\times n$，$AA^{\mathsf T}$ 是 $m\times m$），但它们的非零特征值必然相同：若 $A^{\mathsf T}A\boldsymbol v=\lambda\boldsymbol v$ 且 $\lambda\neq0$，则



$$
AA^{\mathsf T}(A\boldsymbol v)=A\bigl(A^{\mathsf T}A\boldsymbol v\bigr)=A(\lambda\boldsymbol v)=\lambda\,A\boldsymbol v ,
$$



而 $\lambda\neq0$ 保证 $A\boldsymbol v\neq\boldsymbol 0$，所以 $\lambda$ 也是 $AA^{\mathsf T}$ 的特征值。这就是两个矩阵能给出同一批 $\sigma$ 的原因。

整个算法因此分成三步：

1. 算 $A^{\mathsf T}A$，求它的 $n$ 个单位特征向量，按列排成 $V$；把特征值开正平方根，得到 $\sigma_1,\dots,\sigma_r$。
2. 算 $AA^{\mathsf T}$，求它的 $m$ 个单位特征向量，按列排成 $U$。
3. 把 $\sigma$ 依次放到 $\Sigma$ 的对角线上，其余位置补零。

第 3 步并不像听起来那样机械：$\sigma_i$、$\boldsymbol v_i$、$\boldsymbol u_i$ 的下标必须配对，符号也要对齐，否则拼出来的矩阵会出岔子。下一个例子就会撞上这个问题。

## 5. 例一：一个可逆的 $2\times2$ 矩阵

取



$$
A=\begin{bmatrix}4&4\\-3&3\end{bmatrix}.
$$



它可逆，$\det A=4\cdot3-4\cdot(-3)=24$，所以秩为 $2$，行空间与列空间都是整个 $\mathbb{R}^2$：要找两个标准正交的 $\boldsymbol v$ 与两个标准正交的 $\boldsymbol u$。

第一步算 $A^{\mathsf T}A$：



$$
A^{\mathsf T}A=\begin{bmatrix}4&-3\\4&3\end{bmatrix}\begin{bmatrix}4&4\\-3&3\end{bmatrix}
=\begin{bmatrix}25&7\\7&25\end{bmatrix}.
$$



对角元是 $16+9=25$，副对角元是 $16-9=7$，结果确实对称。形如 $\begin{bmatrix}a&b\\b&a\end{bmatrix}$ 的矩阵有一个现成的规律：特征向量总是 $(1,1)$ 与 $(1,-1)$，特征值分别是 $a+b$ 与 $a-b$。所以这里特征向量是 $(1,1)$、$(1,-1)$，特征值是 $32$ 与 $18$。直接验算：



$$
\begin{bmatrix}25&7\\7&25\end{bmatrix}\begin{bmatrix}1\\1\end{bmatrix}
=\begin{bmatrix}32\\32\end{bmatrix}=32\begin{bmatrix}1\\1\end{bmatrix},
\qquad
\begin{bmatrix}25&7\\7&25\end{bmatrix}\begin{bmatrix}1\\-1\end{bmatrix}
=\begin{bmatrix}18\\-18\end{bmatrix}=18\begin{bmatrix}1\\-1\end{bmatrix}.
$$



单位化之后



$$
V=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},
\qquad
\sigma_1=\sqrt{32}=4\sqrt2,\qquad \sigma_2=\sqrt{18}=3\sqrt2 .
$$



第二步求 $U$，改算 $AA^{\mathsf T}$：



$$
AA^{\mathsf T}=\begin{bmatrix}4&4\\-3&3\end{bmatrix}\begin{bmatrix}4&-3\\4&3\end{bmatrix}
=\begin{bmatrix}32&0\\0&18\end{bmatrix}.
$$



它恰好是对角矩阵，这是这个例子的运气，特征向量直接就是 $(1,0)$ 与 $(0,1)$，特征值仍是 $32$ 与 $18$。与上一节的说法一致：$A^{\mathsf T}A$ 与 $AA^{\mathsf T}$ 的非零特征值相同。于是



$$
U=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I,
\qquad
\Sigma=\begin{bmatrix}\sqrt{32}&0\\0&\sqrt{18}\end{bmatrix}.
$$



第三步把三块拼起来验证。按 $A=U\Sigma V^{\mathsf T}$ 乘出来是



$$
I\begin{bmatrix}\sqrt{32}&0\\0&\sqrt{18}\end{bmatrix}
\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}
=\frac{1}{\sqrt2}\begin{bmatrix}\sqrt{32}&\sqrt{32}\\
\sqrt{18}&-\sqrt{18}\end{bmatrix}
=\begin{bmatrix}4&4\\3&-3\end{bmatrix},
$$



第二行与 $A$ 的第二行 $(-3,3)$ 差一个符号。问题不在 $\Sigma$，$\Sigma$ 的对角元本来就是正的；也不在 $V$ 的各列本身，它们确实是 $A^{\mathsf T}A$ 的单位特征向量。

症结在于特征向量只能确定到相差一个符号：$\boldsymbol v_2=\frac{1}{\sqrt2}(1,-1)$ 与 $-\frac{1}{\sqrt2}(1,-1)$ 都是 $A^{\mathsf T}A$ 关于 $18$ 的单位特征向量，两种取法都合法，$V$ 依旧是正交矩阵。真正把两组基绑定在一起的是配对条件 $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$。按这个条件检查第二个方向：



$$
A\boldsymbol v_2=\frac{1}{\sqrt2}\begin{bmatrix}4&4\\-3&3\end{bmatrix}\begin{bmatrix}1\\-1\end{bmatrix}
=\frac{1}{\sqrt2}\begin{bmatrix}0\\-6\end{bmatrix}
=\sqrt{18}\begin{bmatrix}0\\-1\end{bmatrix},
$$



因为 $\frac{6}{\sqrt2}=3\sqrt2=\sqrt{18}$。所以 $\boldsymbol u_2$ 必须取 $(0,-1)$，而不是 $(0,1)$。修正后



$$
U=\begin{bmatrix}1&0\\0&-1\end{bmatrix},
\qquad
U\Sigma V^{\mathsf T}
=\frac{1}{\sqrt2}\begin{bmatrix}\sqrt{32}&\sqrt{32}\\-\sqrt{18}&\sqrt{18}\end{bmatrix}
=\begin{bmatrix}4&4\\-3&3\end{bmatrix}=A .
$$



逐个核对：$\sqrt{32}/\sqrt2=\sqrt{16}=4$ 给出第一行的两个数；$-\sqrt{18}/\sqrt2=-3$、$\sqrt{18}/\sqrt2=3$ 给出第二行。全部对上。

这个插曲值得记住：SVD 的三块不是各自独立算完再拼装的。$A^{\mathsf T}A$ 与 $AA^{\mathsf T}$ 各给出一组特征向量，每组都带着正负号的自由度；必须用 $\sigma_i$ 把它们配对好，并用 $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$ 定住符号。修正后的 $U$ 仍然正交（这里它是一个反射：第一列不动，第二列反向），所以它照样合格。第一个方向本来就没问题，可以顺手验一下：$A\boldsymbol v_1=\frac{1}{\sqrt2}(8,0)=\sqrt{32}\,(1,0)$。

![视频 00:27:02：课堂板书](</attachments/mit1806-97169a6e3635940613b70800.jpg>)

*视频 00:27:02｜约对应第 5 节「5. 例一：一个可逆的 $2\times2$ 矩阵」附近。*

![官方讲义摘要 第 3/4 页](</attachments/mit1806-87a92381e5ff0412429ad479.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 29 Summary，CC BY-NC-SA 4.0）。*

## 6. 例二：一个秩 1 矩阵

第二个例子让 $A$ 奇异：



$$
A=\begin{bmatrix}4&3\\8&6\end{bmatrix}.
$$



第二行是第一行的两倍，秩 $r=1$。这一来所有维数都降下来了：行空间是一条线，即 $(4,3)$ 的所有倍数；零空间是过原点的垂线；两个列向量 $(4,8)$ 与 $(3,6)$ 都是 $(1,2)$ 的倍数，所以列空间也是一条线；左零空间是列空间的垂线。只需要找一对 $\boldsymbol v_1,\boldsymbol u_1$，其余方向由补全给出。

先算 $A^{\mathsf T}A$：



$$
A^{\mathsf T}A=\begin{bmatrix}4&8\\3&6\end{bmatrix}\begin{bmatrix}4&3\\8&6\end{bmatrix}
=\begin{bmatrix}80&60\\60&45\end{bmatrix}.
$$



它也是秩 1 的，每一行都是 $(4,3)$ 的倍数。求特征值：迹是 $80+45=125$，秩为 1 说明有一个特征值是 $0$，于是另一个必然是 $125$（迹等于特征值之和）。因此



$$
\sigma_1=\sqrt{125}=5\sqrt5 .
$$



属于 $125$ 的特征向量落在行空间方向，也就是 $(4,3)$ 方向；长度是 $5$，单位化得



$$
\boldsymbol v_1=\left(\frac45,\frac35\right)=(0.8,\,0.6).
$$



另一个特征值 $0$ 对应的特征向量在零空间方向，取与 $\boldsymbol v_1$ 垂直的单位向量



$$
\boldsymbol v_2=\left(\frac35,-\frac45\right)=(0.6,\,-0.8),
\qquad
V=\begin{bmatrix}4/5&3/5\\3/5&-4/5\end{bmatrix}.
$$



$U$ 这一侧只需要一个实质性的方向：列空间由 $(1,2)$ 张成，单位化得



$$
\boldsymbol u_1=\frac{1}{\sqrt5}\begin{bmatrix}1\\2\end{bmatrix}.
$$



再补一个与它垂直的单位向量 $\boldsymbol u_2=\frac{1}{\sqrt5}(2,-1)$，凑成 $\mathbb{R}^2$ 的标准正交基：



$$
U=\frac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix},
\qquad
\Sigma=\begin{bmatrix}5\sqrt5&0\\0&0\end{bmatrix}.
$$



验证一次。先算 $U\Sigma$，$\sqrt5$ 与 $5\sqrt5$ 相消：



$$
U\Sigma=\frac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix}
\begin{bmatrix}5\sqrt5&0\\0&0\end{bmatrix}
=\begin{bmatrix}5&0\\10&0\end{bmatrix},
$$



再右乘 $V^{\mathsf T}$：



$$
\begin{bmatrix}5&0\\10&0\end{bmatrix}
\begin{bmatrix}4/5&3/5\\3/5&-4/5\end{bmatrix}
=\begin{bmatrix}4&3\\8&6\end{bmatrix}=A .
$$



第一行是 $5\cdot(4/5,3/5)=(4,3)$，第二行是 $10\cdot(4/5,3/5)=(8,6)$；第二列因为 $\Sigma$ 的第二个对角元是 $0$，整列被乘掉。

这个例子把零空间的角色说得很清楚：$\boldsymbol v_2$ 与 $\boldsymbol u_2$ 在乘法中只被 $0$ 乘，怎么取都不影响 $A$，可以自由选择。真正决定 $A$ 的只有 $\boldsymbol v_1,\sigma_1,\boldsymbol u_1$ 这一组，也就是行空间与列空间里的那一对方向。把 $U\Sigma V^{\mathsf T}$ 按"列乘行"展开，这一点会更明显：



$$
A=\sigma_1\boldsymbol u_1\boldsymbol v_1^{\mathsf T}
+\sigma_2\boldsymbol u_2\boldsymbol v_2^{\mathsf T}+\cdots
+\sigma_r\boldsymbol u_r\boldsymbol v_r^{\mathsf T}.
$$



每一项 $\boldsymbol u_i\boldsymbol v_i^{\mathsf T}$ 是一个秩 1 矩阵，$r$ 项相加正好拼出 $A$；$\sigma_i=0$ 的项直接消失。例二的秩为 1，$A$ 本身就只是其中一项，这也解释了为什么它的 $\Sigma$ 只有一个非零对角元。

![视频 00:31:58：课堂板书](</attachments/mit1806-4ff2ea360445f8c9e45c19e8.jpg>)

*视频 00:31:58｜约对应第 6 节「6. 例二：一个秩 1 矩阵」附近。*

## 7. SVD 的真正含义：四个基本子空间的一组正确基

两个例子都指向同一件事：SVD 选出的正是四个基本子空间的一组"正确"的基。

- $\boldsymbol v_1,\dots,\boldsymbol v_r$：行空间 $C(A^{\mathsf T})$ 的标准正交基；
- $\boldsymbol u_1,\dots,\boldsymbol u_r$：列空间 $C(A)$ 的标准正交基；
- $\boldsymbol v_{r+1},\dots,\boldsymbol v_n$：零空间 $N(A)$ 的标准正交基；
- $\boldsymbol u_{r+1},\dots,\boldsymbol u_m$：左零空间 $N(A^{\mathsf T})$ 的标准正交基。

四组向量的个数分别是 $r,r,n-r,m-r$：两组 $\boldsymbol v$（$r$ 个与 $n-r$ 个）合起来拼成 $\mathbb{R}^n$ 的一组完整标准正交基，两组 $\boldsymbol u$（$r$ 个与 $m-r$ 个）合起来拼成 $\mathbb{R}^m$ 的一组完整标准正交基。

"正确"有两层意思。第一层是标准正交：这层 Gram-Schmidt 正交化早就办到了，随便一组基都能磨成正交的。第二层是让 $A$ 对角化：$A\boldsymbol v_i$ 只有 $\boldsymbol u_i$ 方向的分量，$\boldsymbol v$ 之间没有耦合，$\boldsymbol u$ 之间也没有耦合，整张变换图只剩下 $r$ 个互不干扰的独立拉伸方向。第二层是 Gram-Schmidt 给不了的，必须靠特征值：$\boldsymbol v_i$ 是 $A^{\mathsf T}A$ 的特征向量，$\boldsymbol u_i$ 是 $AA^{\mathsf T}$ 的特征向量。前面几讲反复出现的四子空间维数关系 $r+r+(n-r)+(m-r)=m+n$，到这里才有了一组彼此正交的具体向量来兑现。

这就是 SVD 在整门课里的位置。它不是又一种计算技巧，而是把"对角化"与"标准正交基"这两个此前互相冲突的目标，通过允许两侧使用不同的基而同时保住的方案。也正是在这个意义上，它是这门课最后一个、也是最完整的矩阵分解。

![视频 00:37:26：课堂板书](</attachments/mit1806-c7b60a64273e105ba4d4de81.jpg>)

*视频 00:37:26｜约对应第 7 节「7. SVD 的真正含义：四个基本子空间的一组正确基」附近。*

![官方讲义摘要 第 4/4 页](</attachments/mit1806-fa1ef7bbd76b20687b8ad0d2.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 29 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **奇异值分解**（SVD）把任意 $m\times n$ 矩阵写成 $A=U\Sigma V^{\mathsf T}$，其中 $U$、$V$ 是正交矩阵，$\Sigma$ 是 $m\times n$ 的对角形矩阵，对角线上前 $r$ 个是正的奇异值。
- 对角化 $A=S\Lambda S^{-1}$ 中的 $S$ 由特征向量组成、通常不正交；对称矩阵有 $A=Q\Lambda Q^{\mathsf T}$，对称正定时两侧共用同一个 $Q$，这是 SVD 的特例。一般矩阵需要两组不同的正交基。
- 几何含义：$A$ 把行空间的标准正交基 $\boldsymbol v_1,\dots,\boldsymbol v_r$ 送到列空间的标准正交方向，满足 $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$，$\sigma_i>0$ 是各方向的**拉伸倍数**。
- 零空间与左零空间不带来困难：把两侧的基补全即可，它们对应 $\Sigma$ 上的零，维数分别是 $n-r$ 与 $m-r$。
- 由 $A^{\mathsf T}A=V\Sigma^{\mathsf T}\Sigma V^{\mathsf T}$ 消去 $U$，得 $V$ 的列是 $A^{\mathsf T}A$ 的单位特征向量、特征值是 $\sigma_i^2$；对称地，$AA^{\mathsf T}$ 的单位特征向量组成 $U$。$A^{\mathsf T}A$ 半正定，故特征值非负，奇异值取正平方根。
- 例一 $A=\begin{bmatrix}4&4\\-3&3\end{bmatrix}$：$A^{\mathsf T}A=\begin{bmatrix}25&7\\7&25\end{bmatrix}$ 特征值 $32,18$，$\sigma_1=4\sqrt2$、$\sigma_2=3\sqrt2$；$AA^{\mathsf T}=\begin{bmatrix}32&0\\0&18\end{bmatrix}$，$U$ 的第二列由 $A\boldsymbol v_2=\sqrt{18}\,(0,-1)$ 定为 $(0,-1)$，得 $U=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$。
- 例二 $A=\begin{bmatrix}4&3\\8&6\end{bmatrix}$ 秩为 1：$A^{\mathsf T}A=\begin{bmatrix}80&60\\60&45\end{bmatrix}$ 的特征值为 $125,0$，$\sigma_1=5\sqrt5$，$\boldsymbol v_1=(0.8,0.6)$、$\boldsymbol v_2=(0.6,-0.8)$、$\boldsymbol u_1=(1,2)/\sqrt5$。
- $A=\sigma_1\boldsymbol u_1\boldsymbol v_1^{\mathsf T}+\cdots+\sigma_r\boldsymbol u_r\boldsymbol v_r^{\mathsf T}$：$A$ 是 $r$ 个秩 1 矩阵之和，零方向被 $\sigma_i=0$ 消掉。
- SVD 给出四个基本子空间的标准正交基（行空间用 $\boldsymbol v_1..\boldsymbol v_r$、列空间用 $\boldsymbol u_1..\boldsymbol u_r$、零空间用 $\boldsymbol v_{r+1}..\boldsymbol v_n$、左零空间用 $\boldsymbol u_{r+1}..\boldsymbol u_m$），这组基同时把 $A$ 化成对角矩阵。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| singular value decomposition (SVD) | 奇异值分解 | 把任意矩阵写成 $U\Sigma V^{\mathsf T}$：两侧正交、中间对角 |
| singular value | 奇异值 | $\Sigma$ 的对角元，是 $A^{\mathsf T}A$ 特征值的正平方根，即该方向的拉伸倍数 |
| orthogonal matrix | 正交矩阵 | 列向量标准正交的方阵，满足 $Q^{\mathsf T}Q=I$ |
| diagonal matrix | 对角矩阵 | 非对角元全为零的矩阵 |
| row space | 行空间 | $A$ 各行张成的子空间，维数为 $r$ |
| column space | 列空间 | $A$ 各列张成的子空间，维数为 $r$ |
| nullspace | 零空间 | 满足 $A\boldsymbol x=\boldsymbol 0$ 的向量全体，维数 $n-r$ |
| left nullspace | 左零空间 | 满足 $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$ 的向量全体，维数 $m-r$ |
| orthonormal | 标准正交 | 两两正交且长度均为 $1$ |
| stretching factor | 拉伸倍数 | 奇异值的几何含义：该方向被拉长或压扁的比例 |
| positive semidefinite | 半正定 | 二次型恒非负的对称矩阵，$A^{\mathsf T}A$ 必属此类 |
| rank-one matrix | 秩 1 矩阵 | 可写成 $\boldsymbol u\boldsymbol v^{\mathsf T}$ 的矩阵，SVD 展开式的每一项 |
| symmetric positive definite | 对称正定 | 对称且特征值全为正，此时 SVD 的两组基可合并成一组 |

---

[← Lecture 28](/notes/mit-1806/lec28) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 30 →](/notes/mit-1806/lec30)
