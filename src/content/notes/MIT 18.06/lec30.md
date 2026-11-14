---
title: Lecture 30 · 线性变换及其矩阵
description: 理解线性变换与矩阵的对应，以及基的选择如何改变矩阵。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 32
tags:
  - lineal algebra
status: completed
publish: true
---

> *Linear transformations and their matrices* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 30 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p31 · 线性变换及其矩阵](https://www.bilibili.com/video/BV1ix411f7Yp?p=31)（49:27）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=31&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

前面二十几讲里，矩阵一直是主角：消元把它化成上三角，四个基本子空间从它身上切出来，行列式、特征值、奇异值分解又各自给它加了一层结构。但矩阵本身是从哪里来的？本讲回到更原始的对象——**线性变换**（linear transformation）。它不需要坐标，也不需要矩阵：给每一个向量指定一个输出向量，就像给每一个数指定一个函数值。几十年前的线性代数课正是从线性变换讲起的，物理学家也更愿意这样看问题，因为他们不想一开口就摆出一堆坐标。

本讲要回答的问题是：一个抽象的线性变换，怎样用一个矩阵来代表？办法是选两套基——输入空间一套，输出空间一套——然后只看变换对输入基向量做了什么：把每个 $T(\boldsymbol{v}_j)$ 写成输出基向量的线性组合，组合的系数就是矩阵的第 $j$ 列。反过来，每个矩阵也通过 $T(\boldsymbol{v})=A\boldsymbol{v}$ 给出一个线性变换。矩阵最初正是为了研究线性变换而发明的。

第三层结论更耐人寻味：矩阵的样子取决于基。同一个投影，换一组基，矩阵可能简单到只剩一个非零元，也可能写成 $P=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$ 这样的满矩阵。本讲用投影、旋转、求导三个例子走完这条路，最后会看到矩阵的乘法对应变换的复合，矩阵的逆对应变换的逆。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-10aea22126783f5cce388330.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 30 Summary，CC BY-NC-SA 4.0）。*

## 1. 线性变换与两条规则

**变换**（transformation）就是一个函数：输入一个向量，输出一个向量，有时也叫**映射**（mapping）。习惯上用 $T$ 表示，因为 transformation 的首字母是 T。它和中学里见过的函数没有本质区别，只是输入和输出都换成了向量；写作 $T(\boldsymbol{v})$，读作“$\boldsymbol{v}$ 在 $T$ 下的像”。

第一个例子是**投影**（projection）。在平面 $\mathbb{R}^2$ 里固定一条过原点的直线，把每个向量 $\boldsymbol{v}$ 变成它在直线上的投影 $T(\boldsymbol{v})$。整个过程不需要坐标：只要知道这条直线在哪儿，每个向量的像就唯一确定了。再取一个向量 $\boldsymbol{w}$，同样投到这条直线上。轴、刻度、分量统统可以擦掉，几何关系仍然完好。

可以写出的映射有无穷多种，本讲只关心其中满足一条特殊规则的那一类，即线性变换。投影就属于这一类，而规矩是：向量上只有两种运算——相加与数乘——变换应当以最简单的方式配合这两种运算。

把向量拉长一倍，投影也拉长一倍；把向量反向，投影也反向；把两个向量先相加再投影，与先分别投影再相加，结果相同。这些性质写成公式就是线性变换的两条要求：



$$
T(\boldsymbol{v}+\boldsymbol{w})=T(\boldsymbol{v})+T(\boldsymbol{w}),
\qquad
T(c\boldsymbol{v})=cT(\boldsymbol{v}).
$$



两条规则可以合成一条：任意线性组合的像，等于像的同一线性组合，



$$
T(c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2)=c_1T(\boldsymbol{v}_1)+c_2T(\boldsymbol{v}_2).
$$



注意第二条规则对任何一个实数 $c$ 都成立，$c=2$ 可以，$c=-1$ 也可以。

有一个立即可用的推论：**零向量必须映到零向量**，原点不能移动。取 $\boldsymbol{v}=\boldsymbol{0}$、$c=3$，第二条规则给出 $T(\boldsymbol{0})=3T(\boldsymbol{0})$，两边相减得 $T(\boldsymbol{0})=\boldsymbol{0}$。这条推论几乎不花力气，却是否定一个变换的最快办法：只要发现某个变换把原点挪走了，它一定不是线性的。

![视频 00:04:57：课堂板书](</attachments/mit1806-6a7c8c062574a3e0e994d4e0.jpg>)

*视频 00:04:57｜约对应第 1 节「1. 线性变换与两条规则」附近。*

## 2. 两个反例：平移与长度

看起来自然的规则未必是线性的，两个反例把这一点说透。

第一个反例把整个平面平移一个固定向量 $\boldsymbol{v}_0$：



$$
T(\boldsymbol{v})=\boldsymbol{v}+\boldsymbol{v}_0 .
$$



每个向量都往前挪同样的距离。这个规则看起来既简单又合理，但线性要求的是另一回事。加倍 $\boldsymbol{v}$ 并不能加倍 $T(\boldsymbol{v})$：左边变成 $2\boldsymbol{v}+\boldsymbol{v}_0$，右边是 $2T(\boldsymbol{v})=2\boldsymbol{v}+2\boldsymbol{v}_0$，除非 $\boldsymbol{v}_0=\boldsymbol{0}$，两者不等——平移量始终是同一个 $\boldsymbol{v}_0$，不会随着输入加倍而变成 $2\boldsymbol{v}_0$。加法规则同样被破坏，因为 $T(\boldsymbol{v}+\boldsymbol{w})=\boldsymbol{v}+\boldsymbol{w}+\boldsymbol{v}_0$，而 $T(\boldsymbol{v})+T(\boldsymbol{w})=\boldsymbol{v}+\boldsymbol{w}+2\boldsymbol{v}_0$。用上一节的判据一眼就能看出问题：$T(\boldsymbol{0})=\boldsymbol{v}_0\neq\boldsymbol{0}$，原点被挪走了。

第二个反例取长度：把 $\mathbb{R}^3$ 中的每个向量映成它的长度，得到的是一个实数，可以看作 $\mathbb{R}^1$ 中的向量。变换允许降维，所以这一点本身不构成毛病。零向量确实映到零，加倍也确实加倍：$T(2\boldsymbol{v})=2\|\boldsymbol{v}\|=2T(\boldsymbol{v})$。可是换成负的倍数就穿帮了：



$$
T(-2\boldsymbol{v})=\|-2\boldsymbol{v}\|=2\|\boldsymbol{v}\|,
\qquad
-2T(\boldsymbol{v})=-2\|\boldsymbol{v}\| .
$$



长度只记得大小、丢掉了方向：$\boldsymbol{v}$ 与 $-\boldsymbol{v}$ 被压到同一个数上，这正是它接不住负系数的根源。这个反例也说明两条规则为什么必须分开写：零向量的检验它通过了，正数倍的检验它也通过了，真正的约束藏在 $c<0$ 的情形里。两个反例以不同的方式失败，恰好说明线性不是自动成立的性质，而是对变换的实实在在的限制。

![视频 00:11:55：课堂板书](</attachments/mit1806-d008215dfd8e70211cc584c1.jpg>)

*视频 00:11:55｜约对应第 2 节「2. 两个反例：平移与长度」附近。*

## 3. 旋转、整栋房子与矩阵乘法

再给一个真正的线性变换：把平面中的每个向量绕原点**旋转**（rotation）$45^\circ$。描述它同样不需要坐标——给一个输入向量，输出就是转过 $45^\circ$ 的那个向量。它是线性的：把 $\boldsymbol{v}$ 拉长一倍，转过去的那根箭头也长一倍；先把两个向量相加再旋转，与分别旋转再相加，得到同一个结果。

这里有一个值得强调的观点：不必一次只盯一个向量。把变换作用到一整张图形上——比如教材封面上画的那栋平面上的小房子，把轮廓上的每个点都送进 $T$——就能一次看清变换对整个空间做了什么。旋转 $45^\circ$ 之后，整栋房子跟着转 $45^\circ$，屋顶的朝向、门的朝向一起改变。**线性变换是对整个空间的搬动，矩阵乘法只是它的坐标写法。**

第三类例子来自矩阵本身。固定一个矩阵 $A$，令



$$
T(\boldsymbol{v})=A\boldsymbol{v}.
$$



这是线性变换，因为矩阵乘法对加法与数乘都分配：



$$
A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w},
\qquad
A(c\boldsymbol{v})=c(A\boldsymbol{v}).
$$



每一个矩阵都给出一个变换，例子取之不尽。矩阵乘向量的意义也在这里显出来：输入向量乘上矩阵得到一个输出向量，而这个输出向量常常落在另一个空间里，维数可以不同。形状也自动对上：要让输入落在 $\mathbb{R}^n$、输出落在 $\mathbb{R}^m$，$A$ 就应当是 $m\times n$ 矩阵。例如从 $\mathbb{R}^3$ 到 $\mathbb{R}^2$ 的线性变换，由 $2\times 3$ 矩阵给出；用一个 $2\times 3$ 矩阵去乘三分量的输入向量，正好得到两分量的输出。

具体看一个例子。取



$$
A=\begin{bmatrix}1&0\\0&-1\end{bmatrix},
$$



它是**对角**的，作用再简单不过：$x$ 分量原样保留，$y$ 分量改变符号。用它去变换那栋房子，屋顶的尖端 $(x,y)$ 变成 $(x,-y)$——横坐标不动，纵坐标翻到下方，结果整栋房子上下颠倒，门跑到了上面。这就是一个矩阵对整个平面做的事。

于是本讲的任务清楚了：给定一个用几何语言描述的线性变换，**把藏在它背后的矩阵找出来**。要实现这一点，必须先有坐标；而坐标来自基。这正是后面几节要搭起来的桥。

![官方讲义摘要 第 2/4 页](</attachments/mit1806-d9259d675a42b6400feae1c8.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 30 Summary，CC BY-NC-SA 4.0）。*

![视频 00:18:48：课堂板书](</attachments/mit1806-c8f7dd6a875c70468655002c.jpg>)

*视频 00:18:48｜约对应第 3 节「3. 旋转、整栋房子与矩阵乘法」附近。*

## 4. 知道基上的像，就知道整个变换

设 $T$ 从 $\mathbb{R}^n$ 映到 $\mathbb{R}^m$，即输入 $n$ 维、输出 $m$ 维。一个自然的问题是：为了让别人完全知道 $T$ 对所有输入的作用，最少要提供多少信息？

告诉对方 $T(\boldsymbol{v}_1)$，他就只知道这一个值，这远远不够。再给出一个向量 $\boldsymbol{v}_2$ 和它的像 $T(\boldsymbol{v}_2)$，情况立刻不同：他知道了 $T(\boldsymbol{v}_1)$ 与 $T(\boldsymbol{v}_2)$，就通过线性性知道了 $T$ 作用在所有组合 $c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2$ 上的结果，也就是知道了 $T$ 在以这两个向量为基的那一整张平面上的作用。前提是 $\boldsymbol{v}_1,\boldsymbol{v}_2$ **线性无关**（linearly independent）；如果 $\boldsymbol{v}_2=6\boldsymbol{v}_1$，那么 $T(\boldsymbol{v}_2)=6T(\boldsymbol{v}_1)$ 是算得出来的，这条信息没有带来任何新东西。

推广一步，结论是：只要知道 $T$ 在一个**基** $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$ 上每个基向量的像，就知道整个变换。因为基**张成**（span）整个输入空间，每个 $\boldsymbol{v}$ 都能唯一写成



$$
\boldsymbol{v}=c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n,
$$



而线性性强制



$$
T(\boldsymbol{v})=c_1T(\boldsymbol{v}_1)+\cdots+c_nT(\boldsymbol{v}_n),
$$



没有任何选择的余地。所以一个线性变换的信息量是有限的：$n$ 个输出向量，每个输出向量在 $\mathbb{R}^m$ 中需要 $m$ 个数来描述，一共 $mn$ 个数——这恰好是一个 $m\times n$ 矩阵的元素个数。

接下来的问题是：这些数怎么排进矩阵？答案取决于**坐标**。坐标由基产生：一旦选定基，每个向量写成基向量组合的方式是唯一的——基张成空间，表示必然存在；基线性无关，表示必然唯一——组合的系数就是它的坐标。平时写 $\boldsymbol{v}=(3,2,4)$，其实默默假定了一组基：**标准基**（standard basis）$\boldsymbol{e}_1,\boldsymbol{e}_2,\boldsymbol{e}_3$，三个数就是三个坐标。但也可以换一组基，比如某个矩阵的特征向量，那时同一个向量的坐标就完全变了。矩阵之所以会随基而变，根源就在这里。

## 5. 从变换造矩阵：两套基与每一列的含义

现在把规则写下来。给定线性变换 $T:\mathbb{R}^n\to\mathbb{R}^m$，选两套基：输入基 $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$（都在 $\mathbb{R}^n$ 中），输出基 $\boldsymbol{w}_1,\ldots,\boldsymbol{w}_m$（都在 $\mathbb{R}^m$ 中）。因为输出空间有基，每个 $T(\boldsymbol{v}_j)$ 都能唯一地写成输出基的组合：



$$
T(\boldsymbol{v}_j)=a_{1j}\boldsymbol{w}_1+a_{2j}\boldsymbol{w}_2+\cdots+a_{mj}\boldsymbol{w}_m .
$$



把这些系数竖着排成一列，就是矩阵 $A$ 的第 $j$ 列：



$$
A=\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n}\\
a_{21} & a_{22} & \cdots & a_{2n}\\
\vdots & \vdots & & \vdots\\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}.
$$



用一句话概括：**取第 $j$ 个输入基向量，作变换，把像写成输出基的组合，系数就是第 $j$ 列。** 逐列这样做完，$A$ 就搭好了。它的形状是 $m\times n$：行数来自输出空间的维数，列数来自输入空间的维数，与第 3 节里“从 $\mathbb{R}^n$ 到 $\mathbb{R}^m$ 用 $m\times n$ 矩阵”完全一致。这也说明了为什么必须同时给定两套基——没有基就没有坐标，没有坐标就无从谈矩阵。

整个计算流程可以用一句话说清：先用输入基把向量翻译成坐标，乘上 $A$，再把得到的数组用输出基翻译回向量。这个矩阵确实干了该干的活：把输入的坐标向量乘上 $A$，得到输出的坐标向量。验证只需看基向量。取输入坐标为 $(1,0,\ldots,0)^{\mathsf T}$，它代表的输入向量就是 $\boldsymbol{v}_1$；$A$ 乘上这一列，得到的是 $A$ 的第一列，而第一列按构造正是 $T(\boldsymbol{v}_1)$ 在输出基下的坐标。对第二列、第三列……每一列都一样成立。既然等式在每个基向量上都对，而两边对输入都是线性的，它就必须对一切输入成立。这正是第 4 节那个“基上的像决定一切”的论证，只不过现在被翻译成了矩阵语言。

![视频 00:32:09：课堂板书](</attachments/mit1806-ff5070c3e5fa1f315efe806b.jpg>)

*视频 00:32:09｜约对应第 5 节「5. 从变换造矩阵：两套基与每一列的含义」附近。*

![官方讲义摘要 第 3/4 页](</attachments/mit1806-c9263d4a9eb58a7db9093694.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 30 Summary，CC BY-NC-SA 4.0）。*

## 6. 同一个投影，两种基

用投影做完整的演示。取平面中的投影，投影到一条过原点的直线上。先选一套**好基**：输入基与输出基取同一组，$\boldsymbol{v}_1$ 是直线上的单位向量，$\boldsymbol{v}_2$ 是与直线垂直的单位向量。

按第 5 节的规则逐列构造。$T(\boldsymbol{v}_1)=\boldsymbol{v}_1$，因为在直线上的向量投影之后不动；它在输出基下的坐标是 $(1,0)^{\mathsf T}$，这就是第一列。$T(\boldsymbol{v}_2)=\boldsymbol{0}$，垂直于直线的分量被投影杀掉；坐标是 $(0,0)^{\mathsf T}$，这就是第二列。于是



$$
A=\begin{bmatrix}1&0\\0&0\end{bmatrix}.
$$



检验一下：输入坐标 $(c_1,c_2)^{\mathsf T}$ 被送到 $(c_1,0)^{\mathsf T}$，正是“保留平行分量、杀掉垂直分量”的投影。这个矩阵是对角的，对角元 $1$ 和 $0$ 恰是投影的**特征值**（eigenvalue），而 $\boldsymbol{v}_1,\boldsymbol{v}_2$ 是它的**特征向量**（eigenvector）。在好基下，投影的两条代数性质一眼可见：对角阵当然对称；对角元只有 $0$ 和 $1$，平方后仍然是自己，所以 $A^2=A$。

换成**标准基**再算一遍。设投影到 $45^\circ$ 直线，输入基与输出基都取 $\boldsymbol{v}_1=(1,0)$、$\boldsymbol{v}_2=(0,1)$。这时得到的不是那个漂亮的矩阵，而是前面讲投影时导出的**投影矩阵**（projection matrix）：



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}
=\frac{1}{2}\begin{bmatrix}1&1\\1&1\end{bmatrix},
\qquad
\boldsymbol{a}=\begin{bmatrix}1\\1\end{bmatrix}.
$$



抽查两列：输入 $(1,0)^{\mathsf T}$ 得到 $\left(\tfrac12,\tfrac12\right)^{\mathsf T}$，确实是把 $(1,0)$ 投影到 $45^\circ$ 直线的结果；输入 $(0,1)^{\mathsf T}$ 也得到 $\left(\tfrac12,\tfrac12\right)^{\mathsf T}$。这个矩阵不再是对角阵，因为标准基不是特征向量。但它仍然对称，仍然满足 $P^2=P$：它是另一种“好看的矩阵”，只是不如对角阵那样一眼看穿。

同一根投影，两种基，两个矩阵。变换没有变，变的只是描述它的坐标。这件事的分量在于：**矩阵不是变换本身，而是变换在某组基下的坐标记录。** 想看清一个变换的本质，就去找它的特征向量；那是物理学家在被逼着使用坐标时也会挑的一组坐标。下一讲的基变换，就是把“换一组基，矩阵怎么变”写成公式。

![视频 00:38:33：课堂板书](</attachments/mit1806-be89e6e6a8599bc83415138b.jpg>)

*视频 00:38:33｜约对应第 6 节「6. 同一个投影，两种基」附近。*

## 7. 求导也是线性变换

最后一个例子离开几何，但更说明问题：**求导**（differentiation）是线性变换。

取输入空间为所有形如 $c_1+c_2x+c_3x^2$ 的多项式，基是三个最简单的函数 $1,x,x^2$。求导之后的输出是 $c_2+2c_3x$，落在由 $1,x$ 张成的空间里，输出基就取 $1,x$。于是 $T$ 把 $3$ 维空间映到 $2$ 维空间。

逐列计算。$T(1)=0$，给出第一列 $(0,0)^{\mathsf T}$；$T(x)=1$，给出第二列 $(1,0)^{\mathsf T}$；$T(x^2)=2x$，给出第三列 $(0,2)^{\mathsf T}$。所以



$$
A=\begin{bmatrix}0&1&0\\0&0&2\end{bmatrix},
\qquad
A\begin{bmatrix}c_1\\c_2\\c_3\end{bmatrix}
=\begin{bmatrix}c_2\\2c_3\end{bmatrix}.
$$



一个 $2\times3$ 矩阵，把求导这件事完整地记了下来。

把“求导是线性变换”这句话写开，就是两条熟悉的规则：和的导数等于导数之和，$(f+g)'=f'+g'$；数乘的导数等于导数的数乘，$(cf)'=cf'$。这两条正是线性变换的两条要求，只是把向量换成了函数。也正因为如此，函数空间里的变换同样能装进矩阵乘法，前面那套“基—坐标—矩阵”的语言对多项式一样适用。

求导是线性的，这件事的意义远超一个例子。正因为它是线性的，会算少数几个函数的导数——$\sin x$、$\cos x$、$e^x$ 这样一张很短的清单——就能靠线性组合算出所有组合的导数，而不必每遇到一个新函数都从头来一遍。如果求导不是线性的，微积分就没法这么算。

到这里，本讲的整个语言就闭合了。矩阵的逆对应变换的逆：把 $T$ 送出去的向量再送回来，矩阵就该乘出单位矩阵 $I$。矩阵的乘法对应变换的复合：先做一个变换、再做另一个，合起来的矩阵正是两个矩阵之积。矩阵乘法不是凭空规定的运算，它是从线性变换的复合里长出来的。

![视频 00:44:30：课堂板书](</attachments/mit1806-f7997892e2649a6ec4662967.jpg>)

*视频 00:44:30｜约对应第 7 节「7. 求导也是线性变换」附近。*

![官方讲义摘要 第 4/4 页](</attachments/mit1806-22e8c8561328a603bee0dfe2.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 30 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- **线性变换**是保持加法与数乘的映射：$T(\boldsymbol{v}+\boldsymbol{w})=T(\boldsymbol{v})+T(\boldsymbol{w})$，$T(c\boldsymbol{v})=cT(\boldsymbol{v})$；两条合起来即 $T$ 把线性组合映成线性组合。
- 零向量必须映到零：由 $T(\boldsymbol{0})=3T(\boldsymbol{0})$ 得 $T(\boldsymbol{0})=\boldsymbol{0}$，这是否定一个变换最快的判据。
- 反例：平移 $T(\boldsymbol{v})=\boldsymbol{v}+\boldsymbol{v}_0$ 破坏两条规则（$T(\boldsymbol{0})=\boldsymbol{v}_0\neq\boldsymbol{0}$）；取长度 $T(\boldsymbol{v})=\|\boldsymbol{v}\|$ 通过零向量与正数倍的检验，却在 $c<0$ 时失败。
- 投影与旋转是不用坐标就能描述的线性变换；把变换作用到整栋房子上，可以一次看清它对整个空间做了什么。
- 每个矩阵通过 $T(\boldsymbol{v})=A\boldsymbol{v}$ 给出线性变换，$m\times n$ 矩阵对应 $\mathbb{R}^n\to\mathbb{R}^m$；$A=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$ 把平面上下翻转，房子颠倒。
- 知道 $T$ 在一组**基**上的像，就知道整个变换：$\boldsymbol{v}=\sum c_j\boldsymbol{v}_j$ 强制 $T(\boldsymbol{v})=\sum c_jT(\boldsymbol{v}_j)$。
- 构造矩阵的规则：选定输入基 $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$ 与输出基 $\boldsymbol{w}_1,\ldots,\boldsymbol{w}_m$，把 $T(\boldsymbol{v}_j)=\sum_i a_{ij}\boldsymbol{w}_i$ 的系数排成第 $j$ 列；于是 $A\cdot(\text{输入坐标})=(\text{输出坐标})$。
- 同一个投影：用特征向量基（沿直线与垂直于直线）得 $\begin{bmatrix}1&0\\0&0\end{bmatrix}$，对角元就是特征值 $1,0$；用标准基投影到 $45^\circ$ 直线得 $P=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$，对称且 $P^2=P$，但不再对角。
- 求导是线性变换：$c_1+c_2x+c_3x^2\mapsto c_2+2c_3x$ 对应矩阵 $\begin{bmatrix}0&1&0\\0&0&2\end{bmatrix}$。
- 矩阵的逆对应变换的逆，矩阵的乘积对应变换的复合；矩阵乘法是从线性变换中产生的，不是反过来。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| linear transformation | 线性变换 | 保持向量加法与数乘的映射 $T$ |
| transformation / mapping | 变换 / 映射 | 把每个输入向量指定到一个输出向量的规则 |
| projection | 投影 | 把每个向量沿垂直方向压到一条直线上的点 |
| rotation | 旋转 | 绕原点把每个向量转过固定角度 |
| basis | 基 | 张成空间且线性无关的一组向量，用来产生坐标 |
| coordinates | 坐标 | 向量写成基向量组合时的系数 |
| standard basis | 标准基 | 由单位坐标向量组成的默认基，坐标即分量 |
| linear combination | 线性组合 | 若干个向量各乘一个系数再相加 |
| linearly independent | 线性无关 | 不存在非平凡的零组合，每个向量都带来新方向 |
| span | 张成 | 一组向量全部线性组合构成的集合 |
| eigenvalue | 特征值 | 特征向量被变换后缩放的倍数；投影的特征值是 $1$ 与 $0$ |
| eigenvector | 特征向量 | 变换后方向不变（或反向）的向量 |
| projection matrix | 投影矩阵 | 投影在标准基下的矩阵 $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/(\boldsymbol{a}^{\mathsf T}\boldsymbol{a})$，满足 $P^2=P$ |
| differentiation | 求导 | 把多项式映为导函数的线性变换 |
| inverse matrix | 逆矩阵 | 代表逆变换的矩阵，与原矩阵相乘得 $I$ |
| identity matrix | 单位矩阵 | 代表恒等变换的矩阵，对角元全为 $1$ |

---

[← Lecture 29](/notes/mit-1806/lec29) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 31 →](/notes/mit-1806/lec31)
