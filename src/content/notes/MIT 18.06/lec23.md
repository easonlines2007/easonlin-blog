---
title: Lecture 23 · 微分方程与矩阵指数 $e^{At}$
description: 解线性微分方程组，理解矩阵指数 exp(At)。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 24
tags:
  - lineal algebra
status: completed
publish: true
---

> *Differential equations and exp(At)* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 23 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p23 · 微分方程与矩阵指数 $e^{At}$](https://www.bilibili.com/video/BV1ix411f7Yp?p=23)（51:03）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-23-differential-equations-and-exp-at/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=23&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

上一讲求解差分方程 $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$，把通解写成若干个 $\lambda^k\boldsymbol{x}$ 的线性组合，其中 $\lambda$ 是 $A$ 的**特征值**（eigenvalue），$\boldsymbol{x}$ 是对应的**特征向量**（eigenvector）。本讲求解它的连续版本——一阶常系数线性微分方程组



$$
\frac{\mathrm{d}\boldsymbol{u}}{\mathrm{d}t}=A\boldsymbol{u}.
$$



关键想法只有一句话：常系数线性方程的解都是指数函数。于是只要假设 $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$ 并代回方程，剩下的工作立刻变成纯粹的线性代数：$\lambda$ 必须是特征值，$\boldsymbol{x}$ 必须是对应的特征向量。离散情形的幂 $\lambda^k$ 换成连续情形的指数 $e^{\lambda t}$，其余结构完全平行。

路线也照这个想法展开：先用一个 $2\times 2$ 的具体例子走完全套机械计算，看特征值如何提前预言解的长期行为；再讨论 $t\to\infty$ 时解的三种命运——衰减到零、停在**稳态**（steady state）、爆炸增长，判据只看特征值的实部；然后用**对角化**（diagonalization）把耦合的方程组解耦，写出 $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$；最后回答“矩阵的指数”是什么意思：照搬 $e^x$ 的**泰勒级数**（Taylor series）来定义 $e^{At}$，并证明它可以写成 $Se^{\Lambda t}S^{-1}$ 的形式，其中 $S$ 由特征向量组成、$\Lambda$ 由特征值组成。本讲最后还会把单个二阶方程化成一阶方程组，说明这套工具对高阶方程同样适用。

![官方讲义摘要 第 1/4 页](</attachments/mit1806-3de771e2324402915781626f.png>)

*MIT OCW 官方讲义摘要 第 1/4 页（18.06SC Lecture 23 Summary，CC BY-NC-SA 4.0）。*

## 1. 从一个 $2\times 2$ 的方程组开始

要解的方程组是



$$
\frac{\mathrm{d}}{\mathrm{d}t}\begin{bmatrix}u_1\\u_2\end{bmatrix}
=\begin{bmatrix}-1&2\\1&-2\end{bmatrix}
\begin{bmatrix}u_1\\u_2\end{bmatrix},
\qquad
\boldsymbol{u}(0)=\begin{bmatrix}1\\0\end{bmatrix}.
$$



写成两个标量方程就是 $\mathrm{d}u_1/\mathrm{d}t=-u_1+2u_2$ 和 $\mathrm{d}u_2/\mathrm{d}t=u_1-2u_2$：每个分量的变化率都同时依赖两个分量，这就是“耦合”。初值 $\boldsymbol{u}(0)=(1,0)$ 说明 $t=0$ 时全部分量都集中在 $u_1$ 上，$u_2$ 还是零。但运动立刻开始：把初值代入右端，$\mathrm{d}u_2/\mathrm{d}t=1>0$，流量向 $u_2$ 推进；同时 $\mathrm{d}u_1/\mathrm{d}t=-1<0$，$u_1$ 在减少。解正是从 $u_1$ 流向 $u_2$。要看清这个流动随时间怎么走，第一步永远是先求出 $A$ 的特征值与特征向量。

特征值甚至不必算特征多项式就能看出。矩阵的第二列是第一列的 $-2$ 倍，两列线性相关，所以 $A$ 奇异，$\det A=0$；而在 $2\times2$ 的情形，行列式等于两个特征值之积，故有一个特征值为 $0$。从特征向量的角度看更直接：奇异意味着零空间里有非零向量，即存在 $\boldsymbol{x}\ne\boldsymbol{0}$ 使 $A\boldsymbol{x}=\boldsymbol{0}=0\cdot\boldsymbol{x}$，这样的 $\boldsymbol{x}$ 就是零特征值的特征向量。另一个特征值由**迹**（trace）定出：对角元之和为 $-1+(-2)=-3$，迹等于特征值之和 $\lambda_1+\lambda_2$，所以另一个特征值是 $-3$。行列式给出乘积、迹给出和，相当于用两个方程解两个未知数，比硬算特征多项式省事。硬算也得到同样的结果：



$$
\det(A-\lambda I)
=\begin{vmatrix}-1-\lambda&2\\1&-2-\lambda\end{vmatrix}
=(-1-\lambda)(-2-\lambda)-2
=\lambda^2+3\lambda
=\lambda(\lambda+3),
$$



其中 $(-1-\lambda)(-2-\lambda)=2+3\lambda+\lambda^2$，减去右上的 $2$ 后常数项正好抵消。于是 $\lambda_1=0$，$\lambda_2=-3$。

这两个数已经预告了答案的形状。$\lambda=0$ 对应 $e^{0\cdot t}=1$，是一个完全不随时间变化的部分；$\lambda=-3$ 对应 $e^{-3t}$，是一个随时间衰减到零的部分。当 $t\to\infty$ 时只剩前一部分，那正是稳态。可见长期行为只由特征值决定，连方程都不必先解出来。

再求特征向量。$\lambda_1=0$ 时 $A\boldsymbol{x}=\boldsymbol{0}$，也就是求 $A$ 的零空间：由 $-x_1+2x_2=0$ 令自由变量 $x_2=1$，得 $\boldsymbol{x}_1=(2,1)$。$\lambda_2=-3$ 时解 $(A+3I)\boldsymbol{x}=\boldsymbol{0}$，也就是



$$
\begin{bmatrix}2&2\\1&1\end{bmatrix}\boldsymbol{x}=\boldsymbol{0},
$$



故 $x_1+x_2=0$，取 $\boldsymbol{x}_2=(1,-1)$。特征向量不唯一，取 $(-1,1)$ 或任何非零倍数同样可以，只要方向对，后续算出的系数会相应调整。验证：$A\boldsymbol{x}_2=(-1-2,\ 1+2)=(-3,3)=-3(1,-1)$，正是 $A\boldsymbol{x}_2=-3\boldsymbol{x}_2$。

![视频 00:05:06：课堂板书](</attachments/mit1806-f3531a074ef01e7907bc6c4d.jpg>)

*视频 00:05:06｜约对应第 1 节「1. 从一个 $2\times 2$ 的方程组开始」附近。*

## 2. 纯指数解与初始条件

为什么一组特征对就能给出解？令 $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$，代入方程两侧分别计算：



$$
\frac{\mathrm{d}}{\mathrm{d}t}\left(e^{\lambda t}\boldsymbol{x}\right)=\lambda e^{\lambda t}\boldsymbol{x},
\qquad
A\left(e^{\lambda t}\boldsymbol{x}\right)=e^{\lambda t}A\boldsymbol{x}=\lambda e^{\lambda t}\boldsymbol{x}.
$$



左边只对时间因子求导，得到 $\lambda e^{\lambda t}\boldsymbol{x}$；右边把标量 $e^{\lambda t}$ 提出来，再用 $A\boldsymbol{x}=\lambda\boldsymbol{x}$。两侧相同，等式成立。换句话说，指数上的 $\lambda$ 必须取特征值、乘在前面的 $\boldsymbol{x}$ 必须取特征向量，指数假设才与方程相容——这正是“找指数解”把微分方程化成线性代数的原因。这样的解称为**纯指数解**（pure exponential solution）。

方程是线性的，解的任意线性组合仍是解，所以通解是各纯指数解的组合：



$$
\boldsymbol{u}(t)=c_1e^{\lambda_1 t}\boldsymbol{x}_1+c_2e^{\lambda_2 t}\boldsymbol{x}_2 .
$$



这里 $A$ 是 $2\times2$，所以只有两项；一般地，若 $A$ 是 $n\times n$ 且可对角化，就是 $n$ 项之和。每一项对应一个特征方向：$c_i$ 是这一份在初始状态中所占的份额，$e^{\lambda_i t}$ 是它自己的增长（或衰减）因子，$\boldsymbol{x}_i$ 是它的方向。把这些各自独立的运动叠加起来，就得到一般的解。把离散与连续并排看，公式几乎一模一样：上一讲差分方程的解是 $c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2$，这里只是把 $\lambda^k$ 换成了 $e^{\lambda t}$。所以要记住的其实就是“纯指数解”这一件事，其余交给线性组合。

纯指数解还有一个值得注意的性质：取初值 $\boldsymbol{u}(0)=c\boldsymbol{x}_i$，纯指数解 $ce^{\lambda_i t}\boldsymbol{x}_i$ 始终留在这条特征向量射线上，只按指数伸缩或衰减，不会转向。也就是说，沿特征向量方向出发的那部分流动是“纯伸缩”，特征值就是这个方向上的伸缩率。

对本例，通解写成



$$
\boldsymbol{u}(t)
=c_1\begin{bmatrix}2\\1\end{bmatrix}
+c_2e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix}.
$$



系数 $c_1,c_2$ 由初始条件定。令 $t=0$：



$$
c_1\begin{bmatrix}2\\1\end{bmatrix}+c_2\begin{bmatrix}1\\-1\end{bmatrix}
=\begin{bmatrix}1\\0\end{bmatrix}.
$$



两个系数都取 $1/3$ 即可，因为 $(2,1)+(1,-1)=(3,0)$，再乘 $1/3$ 正是 $(1,0)$。按方程解也一样：两式相加得 $3c_1=1$，故 $c_1=1/3$，再由第一式 $2/3+c_2=1$ 得 $c_2=1/3$。最终



$$
\boldsymbol{u}(t)=\frac13\begin{bmatrix}2\\1\end{bmatrix}
+\frac13e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix}.
$$



代回检验：$t=0$ 时确为 $(1,0)$；对 $t$ 求导得 $\boldsymbol{u}'=-e^{-3t}(1,-1)$，而



$$
A\boldsymbol{u}=\frac13A\begin{bmatrix}2\\1\end{bmatrix}
+\frac13e^{-3t}A\begin{bmatrix}1\\-1\end{bmatrix}
=e^{-3t}\begin{bmatrix}-1\\1\end{bmatrix}
=-e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix},
$$



与导数一致。当 $t\to\infty$ 时 $e^{-3t}\to0$，解趋于 $\frac13(2,1)=(2/3,1/3)$，这就是稳态。回看整个流动：从 $(1,0)$ 出发，一部分分量流向 $u_2$，最后停在 $(2/3,1/3)$，不再移动。

求系数这一步也可以用矩阵写。以特征向量为列组成**特征向量矩阵**（eigenvector matrix）$S$，则



$$
S\boldsymbol{c}=\boldsymbol{u}(0),
\qquad
S=\begin{bmatrix}2&1\\1&-1\end{bmatrix}.
$$



这个式子的含义是：把初始状态拆成各个纯指数解所占的份额。份额在 $t=0$ 时定好，之后每一份按自己的指数各行其道，彼此不再混合。

![视频 00:11:15：课堂板书](</attachments/mit1806-ac0ef22ae945d258f3353ef8.jpg>)

*视频 00:11:15｜约对应第 2 节「2. 纯指数解与初始条件」附近。*

![官方讲义摘要 第 2/4 页](</attachments/mit1806-0c1f454beb015c461b36be44.png>)

*MIT OCW 官方讲义摘要 第 2/4 页（18.06SC Lecture 23 Summary，CC BY-NC-SA 4.0）。*

## 3. 稳定性：实部决定增减，虚部决定振荡

并非每个系统都有稳态，也不是每个都衰减。$t\to\infty$ 时解只有三种结局。若所有特征值的实部为负，则每一项 $e^{\lambda_i t}$ 都趋于零，解趋于零，而且无论初值是什么都一样。若恰有一个特征值为零、其余特征值的实部为负，那么含零特征值的那一项停在原地，其余各项消失，解收敛到一个非零稳态，本例正是如此。若存在实部为正的特征值，对应项随时间指数增长，解爆炸。

特征值可能是复数，判据要说得更精确。取 $\lambda=-3+6i$：



$$
e^{\lambda t}=e^{-3t}e^{6it}
=e^{-3t}\left(\cos 6t+i\sin 6t\right).
$$



$e^{6it}$ 是单位圆上的点，实部 $\cos 6t$ 与虚部 $\sin 6t$ 满足 $\cos^2 6t+\sin^2 6t=1$，所以它的模恒为 $1$，只在单位圆上打转。真正决定大小的是 $e^{-3t}$。因此实部决定解是衰减还是增长，虚部只让解在两个分量之间来回振荡；振荡再剧烈也改变不了衰减的趋势。一对共轭复特征值给出的运动就是“旋转加伸缩”：伸缩的速率看实部，旋转的快慢看虚部。一般的判据因此是：所有特征值的**实部**为负。

反过来，若把矩阵的所有元素变号，那么由 $A\boldsymbol{x}=\lambda\boldsymbol{x}$ 立刻得到 $(-A)\boldsymbol{x}=-\lambda\boldsymbol{x}$：特征值全部变号，特征向量不变。原先的 $e^{-3t}$ 变成 $e^{+3t}$，解爆炸；$\lambda=0$ 仍然是 $0$。本例中迹由 $-3$ 变为 $+3$，符号翻转一望可知。

$2\times2$ 情形还有一个不需要求特征值的判据。设



$$
A=\begin{bmatrix}a&b\\c&d\end{bmatrix},
\qquad
\operatorname{tr}A=a+d=\lambda_1+\lambda_2,
\qquad
\det A=ad-bc=\lambda_1\lambda_2 .
$$



稳定要求 $\operatorname{tr}A<0$ 且 $\det A>0$。理由是：若两个实特征值都负，则和负、积正；若特征值是一对共轭复数 $\alpha\pm\beta i$，则和为 $2\alpha<0$、积为 $\alpha^2+\beta^2>0$。只要求迹为负是不够的，例如



$$
\begin{bmatrix}-2&0\\0&1\end{bmatrix}
$$



的迹是 $-1$，但特征值是 $-2$ 与 $1$，只要初值带有第二个分量，$e^{+t}$ 就会让解爆炸；它的行列式是 $-2<0$，恰好被第二个条件排除。所以两个条件缺一不可。

![视频 00:19:24：课堂板书](</attachments/mit1806-a659e6a4e3fb9a7ca6efc2a8.jpg>)

*视频 00:19:24｜约对应第 3 节「3. 稳定性：实部决定增减，虚部决定振荡」附近。*

## 4. 对角化：把方程组解耦

$A$ 把 $u_1,u_2$ 耦合在一起，一个分量的变化率里总掺着另一个分量。特征向量的作用正是解除这种耦合：改用特征向量作基，方程组就是对角形的。这个“换基”的动作就是对角化——一旦把矩阵变成对角矩阵，剩下的方程互不相干，问题基本就解完了。矩阵形式是



$$
A=S\Lambda S^{-1},\qquad \Lambda=\operatorname{diag}(\lambda_1,\lambda_2),
$$



$S$ 的列是特征向量，$\Lambda$ 的对角线是特征值。为什么换坐标就能解耦？因为在这组基下，$A$ 作用在每个基向量上只是乘上对应的特征值，写成坐标后矩阵自然变成对角阵 $\Lambda$。作变量替换 $\boldsymbol{u}(t)=S\boldsymbol{v}(t)$，其中 $\boldsymbol{v}$ 是 $\boldsymbol{u}$ 在这组特征向量基下的坐标。$S$ 是常矩阵，所以 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=S\,\mathrm{d}\boldsymbol{v}/\mathrm{d}t$，代入原方程得



$$
S\frac{\mathrm{d}\boldsymbol{v}}{\mathrm{d}t}=AS\boldsymbol{v}
\quad\Longrightarrow\quad
\frac{\mathrm{d}\boldsymbol{v}}{\mathrm{d}t}=S^{-1}AS\boldsymbol{v}=\Lambda\boldsymbol{v}.
$$



最后一步用的是对角化 $S^{-1}AS=\Lambda$。新方程组是对角的，写成逐分量形式就是 $\mathrm{d}v_i/\mathrm{d}t=\lambda_iv_i$——各分量之间没有任何耦合，每个都是一元方程。标量方程 $\mathrm{d}v/\mathrm{d}t=\lambda v$ 的解是 $v(t)=e^{\lambda t}v(0)$，对每个分量分别套用，就得到 $v_i(t)=e^{\lambda_i t}v_i(0)$。合并成向量形式：



$$
\boldsymbol{v}(t)=e^{\Lambda t}\boldsymbol{v}(0),
\qquad
e^{\Lambda t}=\begin{bmatrix}e^{\lambda_1t}&0\\0&e^{\lambda_2t}\end{bmatrix},
$$



对角矩阵的指数就是对角线上各元素分别取指数。换回原变量：



$$
\boldsymbol{u}(t)=S\boldsymbol{v}(t)
=Se^{\Lambda t}\boldsymbol{v}(0)
=Se^{\Lambda t}S^{-1}\boldsymbol{u}(0).
$$



于是可以把 $Se^{\Lambda t}S^{-1}$ 记作 $e^{At}$，写成 $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$。这就是**矩阵指数**（matrix exponential）在此处的作用：一个固定的矩阵，把任意初始状态一次送到时刻 $t$ 的状态。它与上一讲的 $A^k=S\Lambda^kS^{-1}$ 是同一个套路——先对角化，再让对角元各自做幂或指数运算；区别只在于离散情形用 $\lambda^k$，连续情形用 $e^{\lambda t}$。

用本例核对一次。$S^{-1}=\frac13\begin{bmatrix}1&1\\1&-2\end{bmatrix}$，所以 $S^{-1}\boldsymbol{u}(0)=(1/3,1/3)$，与前面求出的 $c_1=c_2=1/3$ 一致；再算



$$
S\begin{bmatrix}1\\e^{-3t}\end{bmatrix}
=\begin{bmatrix}2+e^{-3t}\\1-e^{-3t}\end{bmatrix},
$$



乘上 $1/3$ 正是第 2 节得到的 $\boldsymbol{u}(t)$。两条路径给出同一个答案：先求特征向量矩阵再套公式，与先写纯指数解再定系数，本质上是同一件事。

![视频 00:33:11：课堂板书](</attachments/mit1806-2b61dd236a308d7b5771d63f.jpg>)

*视频 00:33:11｜约对应第 4 节「4. 对角化：把方程组解耦」附近。*

![官方讲义摘要 第 3/4 页](</attachments/mit1806-1bc4415180d84d6758809300.png>)

*MIT OCW 官方讲义摘要 第 3/4 页（18.06SC Lecture 23 Summary，CC BY-NC-SA 4.0）。*

## 5. 矩阵指数：照搬泰勒级数

现在回答“矩阵的指数是什么”。标量指数函数有一个漂亮而可靠的定义——幂级数：



$$
e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots
=\sum_{n=0}^{\infty}\frac{x^n}{n!}.
$$



把 $1$ 换成单位矩阵 $I$，把 $x$ 换成 $At$，逐项照抄就得到矩阵指数的定义：$1$ 对应零次项（矩阵里就是 $I$），$x^n$ 对应 $(At)^n$，分母的阶乘原样保留，



$$
e^{At}=I+At+\frac{(At)^2}{2!}+\frac{(At)^3}{3!}+\cdots
=\sum_{n=0}^{\infty}\frac{(At)^n}{n!}.
$$



这个级数对任何矩阵 $A$、任何 $t$ 都收敛。原因是分母的阶乘增长得比 $At$ 的任何幂都快，通项被压向零，级数有有限的和；$t$ 再大、$A$ 再大也一样。这一点值得与另一个漂亮的级数对比：几何级数 $1+x+x^2+\cdots=1/(1-x)$ 的矩阵版本是



$$
I+At+(At)^2+\cdots=(I-At)^{-1},
$$



它的收敛取决于 $At$ 的特征值：只有当 $At$ 的所有特征值的绝对值都小于 $1$ 时，幂 $(At)^n$ 才会缩到零，级数才收敛到那个逆矩阵。$t$ 很小时可以只留前两项，得到近似 $(I-At)^{-1}\approx I+At$；想更精确就多留几项。代数上它确实提供了求逆的一种级数办法，但微分方程需要的不是它，主线仍是上面的指数级数。

有了定义，就可以把 $e^{At}$ 与 $S$、$\Lambda$ 连起来：把级数的每一项按同一个模式改写。把 $A=S\Lambda S^{-1}$ 代入 $At$，中间相邻的 $S^{-1}S$ 两两相消：



$$
(At)^n=\left(S\Lambda S^{-1}t\right)^n=S(\Lambda t)^nS^{-1}.
$$



再把单位矩阵写成 $I=SS^{-1}$，级数的每一项都能从左右两侧提出 $S$ 与 $S^{-1}$：



$$
e^{At}=S\left[I+\Lambda t+\frac{(\Lambda t)^2}{2!}+\cdots\right]S^{-1}
=Se^{\Lambda t}S^{-1}.
$$



方括号里正是对角矩阵的指数——非对角元素全是 $0$，对角线上是普通的标量指数，所以可以直接写出 $e^{\Lambda t}$。这个推导成立的前提是 $S^{-1}$ 存在，也就是 $A$ 有 $n$ 个线性无关的特征向量、可以对角化。少数矩阵凑不够特征向量，对角化随之失效；它们仍能化成三角形而不是对角形，指数公式也要作相应修改。

至此，第 1、2 节里手算的全过程就在公式层面重演了一遍：求特征值、求特征向量、求系数，再让每一项按自己的指数演化。

![视频 00:39:59：课堂板书](</attachments/mit1806-4f2c9533c7becf7b664dd55c.jpg>)

*视频 00:39:59｜约对应第 5 节「5. 矩阵指数：照搬泰勒级数」附近。*

## 6. 稳定域的图像与高阶方程

把判据画在复平面上，稳定性的差别就一目了然。微分方程的解趋于零，要求所有特征值满足 $\operatorname{Re}\lambda<0$，即落在**左半平面**；虚轴 $\operatorname{Re}\lambda=0$ 是边界，特征值一旦越过它进入右半平面，解就爆炸。而上一讲“矩阵的幂 $A^k$ 趋于零”要求 $|\lambda|<1$，即特征值落在**单位圆**内部。理由很直接：$|\lambda^k|=|\lambda|^k$ 随 $k$ 缩小的条件就是 $|\lambda|<1$；而 $|e^{\lambda t}|=e^{(\operatorname{Re}\lambda)t}$ 随时间缩小的条件就是 $\operatorname{Re}\lambda<0$。同一个矩阵，看幂与看指数，稳定域的形状完全不同。

最后把工具用到一个最常见的方程上——单个二阶方程



$$
y''+by'+Ky=0 .
$$



它虽是一个方程，却能写成一阶方程组。办法是把未知量取成一个向量 $\boldsymbol{u}=\begin{bmatrix}y'\\y\end{bmatrix}$：第一个分量是 $y'$，第二个分量是 $y$ 本身。这样一来 $\boldsymbol{u}'=\begin{bmatrix}y''\\y'\end{bmatrix}$，右端可以凑成矩阵乘向量的形式：



$$
\boldsymbol{u}'=\begin{bmatrix}y''\\y'\end{bmatrix}
=\begin{bmatrix}-b&-K\\1&0\end{bmatrix}
\begin{bmatrix}y'\\y\end{bmatrix}.
$$



矩阵的第一行来自原方程：把方程改写成 $y''=-by'-Ky$，系数 $-b,-K$ 就依次填入第一行，它负责产生 $y''$。第二行来自那个平凡的等式 $y'=y'$，所以该行是 $(1,0)$，它只负责把第一个分量原样交给第二个分量。这样二阶方程就变成 $2\times2$ 的一阶方程组，特征值会自然地与原方程的性质对应起来。

高阶方程同理：五阶方程配一个 $5\times5$ 矩阵，方程各阶导数的系数排在第一行，另外四个平凡的“降阶”等式在次对角线上各放一个 $1$。这与上一讲把 Fibonacci 递推写成一阶系统的做法是同一个手法——多引入几个辅助分量，把高阶导数降成一阶。这样一来，任何高阶常系数线性方程都被打包成一阶方程组，本讲的整套方法（特征值、特征向量、矩阵指数）随即适用。

![视频 00:45:57：课堂板书](</attachments/mit1806-60e87b3e065912fda5592491.jpg>)

*视频 00:45:57｜约对应第 6 节「6. 稳定域的图像与高阶方程」附近。*

![官方讲义摘要 第 4/4 页](</attachments/mit1806-5e609dc3a8cc5d208038140f.png>)

*MIT OCW 官方讲义摘要 第 4/4 页（18.06SC Lecture 23 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 本讲解一阶常系数线性微分方程组 $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$，它的解由 $A$ 的特征值与特征向量完全决定；与差分方程 $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$ 的结构平行，只是幂 $\lambda^k$ 换成了指数 $e^{\lambda t}$。
- **纯指数解**：若 $A\boldsymbol{x}=\lambda\boldsymbol{x}$，则 $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$ 是解——求导给出 $\lambda e^{\lambda t}\boldsymbol{x}$，方程右端给出 $e^{\lambda t}A\boldsymbol{x}$，两者相等。
- 通解为 $c_1e^{\lambda_1t}\boldsymbol{x}_1+\cdots+c_ne^{\lambda_nt}\boldsymbol{x}_n$，系数由初始条件 $S\boldsymbol{c}=\boldsymbol{u}(0)$ 确定，$S$ 是以特征向量为列的矩阵。
- 例子里 $A=\begin{bmatrix}-1&2\\1&-2\end{bmatrix}$ 奇异且迹为 $-3$，故特征值为 $0,-3$，特征向量为 $(2,1)$、$(1,-1)$；由 $\boldsymbol{u}(0)=(1,0)$ 得 $c_1=c_2=1/3$，解为 $\frac13(2,1)+\frac13e^{-3t}(1,-1)$，稳态为 $(2/3,1/3)$。
- 稳定性判据：所有特征值实部为负则解趋于零；一个零特征值加其余实部为负则收敛到稳态；任何实部为正则爆炸。复数情形实部决定增减，虚部只造成振荡。
- $2\times2$ 的快速判据：$\operatorname{tr}A<0$ 且 $\det A>0$。只有 $\operatorname{tr}A<0$ 不够，反例 $\begin{bmatrix}-2&0\\0&1\end{bmatrix}$ 的特征值为 $-2,1$，仍会爆炸。
- 对角化把耦合方程解耦：令 $\boldsymbol{u}=S\boldsymbol{v}$ 得 $\mathrm{d}\boldsymbol{v}/\mathrm{d}t=\Lambda\boldsymbol{v}$，于是 $\boldsymbol{u}(t)=Se^{\Lambda t}S^{-1}\boldsymbol{u}(0)$，并由此定义 $e^{At}=Se^{\Lambda t}S^{-1}$。
- 矩阵指数用泰勒级数定义：$e^{At}=\sum_{n\ge0}(At)^n/n!$，对任意 $A,t$ 都收敛；矩阵几何级数 $(I-At)^{-1}=I+At+(At)^2+\cdots$ 只在 $At$ 的特征值绝对值都小于 $1$ 时收敛。
- 稳定域图像：连续情形要求 $\operatorname{Re}\lambda<0$（左半平面），离散的幂情形要求 $|\lambda|<1$（单位圆内）。
- 二阶方程 $y''+by'+Ky=0$ 取 $\boldsymbol{u}=(y',y)$ 即得矩阵 $\begin{bmatrix}-b&-K\\1&0\end{bmatrix}$；$n$ 阶方程得到 $n\times n$ 矩阵，系数在第一行，次对角线为 $1$。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| linear differential equation | 线性微分方程 | 未知函数及其导数以线性方式出现的方程，本讲解一阶常系数方程组 |
| constant coefficient | 常系数 | 矩阵 $A$ 不随时间变化，解可写成指数函数的组合 |
| pure exponential solution | 纯指数解 | 形如 $e^{\lambda t}\boldsymbol{x}$ 的解，$\lambda$、$\boldsymbol{x}$ 是对应特征对 |
| initial condition | 初始条件 | 给定 $\boldsymbol{u}(0)$，用来确定各纯指数解的系数 |
| eigenvector matrix | 特征向量矩阵 | 以特征向量为列的矩阵 $S$，满足 $A=S\Lambda S^{-1}$ |
| steady state | 稳态 | $t\to\infty$ 时解停留的位置，对应零特征值 |
| stability | 稳定性 | 解随时间是否趋于零，判据是所有特征值的实部为负 |
| real part | 实部 | 复数特征值中决定指数增减的部分 |
| imaginary part | 虚部 | 复数特征值中只造成振荡的部分 |
| trace | 迹 | 对角元之和，等于特征值之和，$2\times2$ 稳定判据之一 |
| diagonalization | 对角化 | $A=S\Lambda S^{-1}$，把耦合方程组变成互不相干的方程 |
| decouple | 解耦 | 通过特征向量坐标使各分量独立演化 |
| matrix exponential | 矩阵指数 | 由泰勒级数 $\sum(At)^n/n!$ 定义的矩阵，满足 $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$ |
| Taylor series | 泰勒级数 | 把 $e^{At}$ 定义为 $I+At+(At)^2/2!+\cdots$ 的依据 |
| geometric series | 几何级数 | $1+x+x^2+\cdots=1/(1-x)$，矩阵版本给出 $(I-At)^{-1}$ |
| left half-plane | 左半平面 | 复平面上 $\operatorname{Re}\lambda<0$ 的区域，微分方程的稳定域 |
| unit circle | 单位圆 | 复平面上 $\lvert\lambda\rvert=1$ 的圆周，幂稳定域 $\lvert\lambda\rvert<1$ 的边界 |

---

[← Lecture 22](/notes/mit-1806/lec22) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 24 →](/notes/mit-1806/lec24)
