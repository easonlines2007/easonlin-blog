---
title: Lecture 33 · 左逆、右逆与伪逆
description: 理解左逆、右逆与伪逆，处理长方矩阵的广义逆。
date: 2026-11-14
topic: MIT 18.06
category: ai
order: 35
tags:
  - lineal algebra
status: completed
publish: true
---

> *Left and right inverses; pseudoinverse* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**第 33 讲 / 共 35 讲** ｜ 第三部分 · 特征值、正定性与线性变换

**本讲视频**：[Bilibili p34 · 左逆、右逆与伪逆](https://www.bilibili.com/video/BV1ix411f7Yp?p=34)（41:53）｜ [MIT OCW 官方页面](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-33-left-and-right-inverses-pseudoinverse/)

> 插图：MIT OCW 18.06SC 官方讲义摘要（CC BY-NC-SA 4.0）与 Bilibili 课堂视频帧（标注时间），每讲约 10 张。

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=34&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## 本讲导读

前面几讲反复画过同一张图：$m\times n$ 的矩阵 $A$ 把 $\mathbb{R}^n$ 分成**行空间**（row space）与**零空间**（nullspace），把 $\mathbb{R}^m$ 分成**列空间**（column space）与**左零空间**（left nullspace）；行空间与零空间互为**正交补**（orthogonal complement），列空间与左零空间也互为正交补。四个子空间的维数依次是 $r$、$n-r$、$r$、$m-r$，其中 $r$ 是**秩**（rank）。本讲从这张图出发，回答一个问题：矩阵的“逆”究竟能定义到什么程度。

问题的根源在图上的两个零空间。一个把非零向量压成零向量的矩阵，没有任何“逆”能把它从零救回来；所以逆是否存在，取决于这两个零空间是不是只剩零向量。$r=m=n$ 时它们都消失，$A$ 有通常的**双侧逆**（two-sided inverse）。$r=n<m$ 时零空间消失而左零空间还在，$A$ 只能有**左逆**（left inverse）：从左边乘回**单位矩阵**（identity matrix），从右边乘却不行。$r=m<n$ 正好镜像，只有**右逆**（right inverse）。最一般的 $r<m$ 且 $r<n$ 两种逆都不存在，但 $A$ 在行空间与列空间之间仍然是一一对应，把这个对应反过来，就得到**伪逆**（pseudoinverse）$A^{+}$。

三个部分对应三种“逆”。左逆与右逆是前面内容的汇总，判据全是 $r$ 与 $m,n$ 的关系，公式全是 $A^{\mathsf T}A$ 与 $AA^{\mathsf T}$ 这两个“好矩阵”；伪逆把这套分类推到一般情形，任何矩阵都有；**奇异值分解**（singular value decomposition，SVD）则说明为什么伪逆算起来几乎不费力气——把它搬到对角矩阵（diagonal matrix）上，只需对非零的奇异值取倒数。

![官方讲义摘要 第 1/3 页](</attachments/mit1806-6ac9902eb1ce2e508dee65be.png>)

*MIT OCW 官方讲义摘要 第 1/3 页（18.06SC Lecture 33 Summary，CC BY-NC-SA 4.0）。*

## 1. 四种情形：从四个基本子空间看逆

把 $m\times n$、秩为 $r$ 的矩阵按 $r$ 与 $m,n$ 的关系分类，逆的问题就变成四道判断题。前三种是课程前面已经处理过的情形，第四种是本讲的正题。

**情形一：$r=m=n$。** 方阵满秩。行空间是整个 $\mathbb{R}^n$，列空间是整个 $\mathbb{R}^m$，两个零空间都只有零向量。存在矩阵使



$$
A^{-1}A=AA^{-1}=I,
$$



左乘、右乘都回到单位矩阵，这就是通常的逆矩阵，也是“满秩”这个词最漂亮的情形。

**情形二：$r=n<m$。** **列满秩**（full column rank）：$n$ 列线性无关，行多半相互关联。零空间只有零向量，行空间维数为 $n$，即整个 $\mathbb{R}^n$；列空间只占 $\mathbb{R}^m$ 的一个 $n$ 维子空间。因为零空间是 $\{\boldsymbol{0}\}$，$A\boldsymbol{x}=\boldsymbol{b}$ 若有解必唯一——别的解都要靠加上零空间中的向量得到，而那里没有东西可加。但行可能相关，消元会产生零行，所以有些右端无解：解只有“零个或一个”。

**情形三：$r=m<n$。** **行满秩**（full row rank）：$m$ 行线性无关，左零空间只有零向量。消元永远不会出现零行，$A\boldsymbol{x}=\boldsymbol{b}$ 对每个 $\boldsymbol{b}$ 都可解；但零空间维数为 $n-m>0$，有 $n-m$ 个**自由变量**（free variable），解无穷多，解集是“一个特解加整个零空间”。

**情形四：$r<m$ 且 $r<n$。** 两个零空间都在，维数分别是 $n-r$ 与 $m-r$。两种逆都造不出来，但矩阵在行空间与列空间之间仍是好映射。前三种情形其实都是这张图上零空间轮流消失的退化情形，第四种才是通例。

换个角度看，四种情形的区别可以用两个是非题概括：左零空间是否为零，决定“$A\boldsymbol{x}=\boldsymbol{b}$ 对哪些 $\boldsymbol{b}$ 有解”；零空间是否为零，决定“有解时解是否唯一”。四个情形就是把这两个问题的是、否组合一遍。四行合起来覆盖了 $r$ 的所有可能取值，所以这张分类表相当于整门课主干的一张索引：看到 $r,m,n$，解的结构与能用的公式就都定了。

![视频 00:04:11：课堂板书](</attachments/mit1806-73992d107adefaf0c71bcfad.jpg>)

*视频 00:04:11｜约对应第 1 节「1. 四种情形：从四个基本子空间看逆」附近。*

## 2. 左逆：列满秩

情形二要造一个“从左边把 $A$ 拉回单位矩阵”的矩阵，手里必须先有一个可逆的方阵，而这里现成的是 $A^{\mathsf T}A$。

$A^{\mathsf T}A$ 是 $n\times n$ 的对称矩阵。列满秩时它可逆，理由只有一行：若 $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$，两边左乘 $\boldsymbol{x}^{\mathsf T}$，得



$$
\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}=(A\boldsymbol{x})^{\mathsf T}(A\boldsymbol{x})=\|A\boldsymbol{x}\|^2=0,
$$



于是 $A\boldsymbol{x}=\boldsymbol{0}$；列满秩意味着零空间只有零向量，故 $\boldsymbol{x}=\boldsymbol{0}$。$n\times n$ 矩阵的零空间只有零向量，它就可逆。这个事实在**最小二乘**（least squares）里是核心：整个理论的系数矩阵就是 $A^{\mathsf T}A$，而它可逆的条件恰好是 $A$ 的列无关。

把 $(A^{\mathsf T}A)^{-1}$ 与 $A^{\mathsf T}$ 按“先转置（transpose）、再求逆”的顺序乘起来，得到



$$
A^{-1}_{\mathrm{left}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T},
$$



这是一个 $n\times m$ 的矩阵。验证它是左逆，把 $A$ 乘在右边即可：



$$
(A^{\mathsf T}A)^{-1}A^{\mathsf T}A=(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)=I_n.
$$



括号正好凑成一对，$n\times n$ 的可逆矩阵乘自己的逆得单位矩阵。注意最后落回的是 $n$ 维空间：$A$ 先把 $\mathbb{R}^n$ 送到 $\mathbb{R}^m$，$A^{\mathsf T}$ 把它带回 $\mathbb{R}^n$，$(A^{\mathsf T}A)^{-1}$ 再在 $\mathbb{R}^n$ 内部做最后一次调整。

换个顺序就不行了。$A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 是 $m\times m$ 的矩阵，不可能是 $I_n$，尺寸先就不对；更本质的是，$A$ 的列空间只是 $\mathbb{R}^m$ 中的 $n$ 维子空间，$A$ 把整个 $\mathbb{R}^n$ 都压在这块子空间上，乘回来时也只能把 $\mathbb{R}^m$ 投影到列空间，落在子空间外面的分量没有任何办法救回。这个矩阵有名字：



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



它作用在列空间中的向量上什么也不改——若 $\boldsymbol{y}=A\boldsymbol{x}$，则 $P\boldsymbol{y}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}A\boldsymbol{x}=A\boldsymbol{x}=\boldsymbol{y}$；作用在左零空间中的向量上则把它抹成零——若 $A^{\mathsf T}\boldsymbol{z}=\boldsymbol{0}$，则 $P\boldsymbol{z}=A(A^{\mathsf T}A)^{-1}\boldsymbol{0}=\boldsymbol{0}$。在列空间上是恒等，在左零空间上是零，这正是到列空间的**投影**（projection）。它“想”成为单位矩阵，可惜 $A$ 只给了它 $n$ 维的活动余地。顺带一个有用的观察：$P$ 的秩等于 $n$，它的零空间恰好就是 $A$ 的左零空间：$P\boldsymbol{z}=\boldsymbol{0}$ 与 $A^{\mathsf T}\boldsymbol{z}=\boldsymbol{0}$ 互为充要条件。投影把 $\mathbb{R}^m$ 中的向量压到 $n$ 维列空间上，压掉的部分正是左零空间。

左逆一般不唯一，$(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 只是其中最常见、形式最整齐的一个。还要注意这一情形里两个“好矩阵”的地位并不平等：$A^{\mathsf T}A$ 是 $n\times n$ 且可逆，$AA^{\mathsf T}$ 却是 $m\times m$、秩只有 $n<m$，照样奇异。哪一个可逆，只看 $r$ 是等于 $n$ 还是等于 $m$。

![视频 00:09:51：课堂板书](</attachments/mit1806-e27220a7c0b4a81f362af313.jpg>)

*视频 00:09:51｜约对应第 2 节「2. 左逆：列满秩」附近。*

## 3. 右逆：行满秩

把行与列的角色对调，情形三得到完全平行的结论。这次可逆的“好矩阵”是 $AA^{\mathsf T}$：它是 $m\times m$ 的对称矩阵，行满秩保证它可逆，理由与上一节相同，只需把 $A$ 换成 $A^{\mathsf T}$。把它取逆再乘 $A^{\mathsf T}$，得到



$$
A^{-1}_{\mathrm{right}}=A^{\mathsf T}(AA^{\mathsf T})^{-1},
$$



这是 $n\times m$ 的矩阵。验证：



$$
A\,A^{\mathsf T}(AA^{\mathsf T})^{-1}=I_m,
$$



这次的单位矩阵是 $m\times m$，与左逆情形正好对称。

换个顺序同样只能得到投影。把右逆放到左边，



$$
A^{\mathsf T}(AA^{\mathsf T})^{-1}A
$$



是 $n\times n$ 的矩阵。它在行空间上是恒等：行空间中的向量都可写成 $A^{\mathsf T}\boldsymbol{u}$，于是



$$
A^{\mathsf T}(AA^{\mathsf T})^{-1}A\,A^{\mathsf T}\boldsymbol{u}
=A^{\mathsf T}(AA^{\mathsf T})^{-1}(AA^{\mathsf T})\boldsymbol{u}
=A^{\mathsf T}\boldsymbol{u};
$$



它在零空间上是零：若 $A\boldsymbol{x}=\boldsymbol{0}$，则 $A^{\mathsf T}(AA^{\mathsf T})^{-1}A\boldsymbol{x}=\boldsymbol{0}$。所以它是到行空间的投影。对偶地，这个 $n\times n$ 投影的秩是 $m$，零空间正是 $A$ 的零空间。右逆同样不唯一，$A^{\mathsf T}(AA^{\mathsf T})^{-1}$ 只是最常用的那个；而这一情形里可逆的是 $AA^{\mathsf T}$，$A^{\mathsf T}A$ 是 $n\times n$、秩只有 $m<n$，已经奇异。

两种情形还有一处实际差别，在于解集。列满秩时解“零个或一个”，行满秩时解“无穷多个”且对每个右端都有解。原因都在自由变量的个数：$n$ 个变量中 $r$ 个是主变量，剩下 $n-r$ 个自由变量；情形二里 $n-r=0$，情形三里 $n-r=n-m>0$。

右逆还有一个直接用途：行满秩时它给出一个特解。取



$$
\boldsymbol{x}=A^{\mathsf T}(AA^{\mathsf T})^{-1}\boldsymbol{b},
$$



两边左乘 $A$，得 $A\boldsymbol{x}=AA^{\mathsf T}(AA^{\mathsf T})^{-1}\boldsymbol{b}=\boldsymbol{b}$，确实满足方程。这个特解不是全部解：把零空间中任意向量加上去仍是解，而零空间有 $n-m$ 维，所以解有无穷多个。左逆的情形与此对偶：列满秩时 $A\boldsymbol{x}=\boldsymbol{b}$ 最多一个解，若解存在，用左逆作用在 $\boldsymbol{b}$ 上就能把它算出来，只不过并非每个 $\boldsymbol{b}$ 都有解。

![视频 00:12:34：课堂板书](</attachments/mit1806-52b8475947814d2ec61f668e.jpg>)

*视频 00:12:34｜约对应第 3 节「3. 右逆：行满秩」附近。*

## 4. 为什么长方矩阵没有双侧逆

四种情形放在一起，一条结构性的事实就浮出来了：**只要 $n\neq m$，$A$ 就不可能有双侧逆**。

原因在基本图上。$A$ 的零空间维数是 $n-r$，左零空间维数是 $m-r$；当 $n\neq m$ 时，这两个数不可能同时为零，也就是说 $A$ 与 $A^{\mathsf T}$ 中至少有一个带着非零的零空间。那个零空间里的方向已经被矩阵彻底杀掉，任何候选的逆都无法把它恢复出来，双侧逆自然不存在。反过来，$n=m$ 且 $r=n$ 时两个零空间都是 $\{\boldsymbol{0}\}$，$A$ 就是可逆的方阵。

从图上读更直观：$r$ 越大，两个零空间越窄，$n-r$ 与 $m-r$ 同时减小。要让逆存在，需要两个零空间同时缩到零，这只有当 $m=n=r$ 才可能；只要 $m\neq n$，最多只能挤掉其中一个，另一侧的零空间必然留下。

把这套分类列成表：

| 情形 | 秩 | 零空间 | 左零空间 | 逆的类型 | 公式 |
| --- | --- | --- | --- | --- | --- |
| 一 | $r=m=n$ | $\{\boldsymbol{0}\}$ | $\{\boldsymbol{0}\}$ | 双侧逆 | $A^{-1}$ |
| 二 | $r=n<m$ | $\{\boldsymbol{0}\}$ | 维数 $m-n$ | 左逆 | $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| 三 | $r=m<n$ | 维数 $n-m$ | $\{\boldsymbol{0}\}$ | 右逆 | $A^{\mathsf T}(AA^{\mathsf T})^{-1}$ |
| 四 | $r<m$ 且 $r<n$ | 维数 $n-r$ | 维数 $m-r$ | 两种都没有 | $A^{+}$ |

表里第二行的零空间是 $\{\boldsymbol{0}\}$、左零空间非零，第三行正好相反，所以左逆、右逆都还能定义；第四行两个零空间都在，两侧都堵死，只剩下一节要讲的伪逆。第四行也说明伪逆不是补丁：$r$ 可以取比 $m$ 和 $n$ 都小的任何值，前三种情形不过是它在一个或两个零空间恰好消失时的特例。换句话说，逆的“类型”完全由哪个零空间消失决定，而投影矩阵总是出现在“另一侧的零空间还在”的那些行里。这张表也是查表工具：给出 $r,m,n$，就能立刻判断该用哪支公式、解集是零个、一个还是无穷多个。

![视频 00:20:56：课堂板书](</attachments/mit1806-b1ba75619df9803f89288d12.jpg>)

*视频 00:20:56｜约对应第 4 节「4. 为什么长方矩阵没有双侧逆」附近。*

![官方讲义摘要 第 2/3 页](</attachments/mit1806-6d769ce6588cbfbfb0ef4b24.png>)

*MIT OCW 官方讲义摘要 第 2/3 页（18.06SC Lecture 33 Summary，CC BY-NC-SA 4.0）。*

## 5. 伪逆：行空间到列空间的一一对应

情形四里两个零空间都在，左逆、右逆都不存在。但基本图上还有一条事实没有被用上：行空间与列空间的维数都是 $r$，而 $A$ 把行空间送进列空间。**在这两个 $r$ 维子空间之间，$A$ 是可逆的**。这句话值得单独证明。

设 $\boldsymbol{x}$ 与 $\boldsymbol{y}$ 都在行空间中，且 $A\boldsymbol{x}=A\boldsymbol{y}$。移项得 $A(\boldsymbol{x}-\boldsymbol{y})=\boldsymbol{0}$，所以 $\boldsymbol{x}-\boldsymbol{y}$ 属于零空间；又因为行空间是子空间，$\boldsymbol{x}-\boldsymbol{y}$ 也属于行空间。行空间与零空间互为正交补，交集只有零向量，于是 $\boldsymbol{x}-\boldsymbol{y}=\boldsymbol{0}$。不同的向量经过 $A$ 之后仍然不同，$A$ 限制在行空间上是单射。

单射的两端都是 $r$ 维空间，于是它也是满射：列空间中的每个 $\boldsymbol{y}$ 都来自行空间中唯一的向量。满射也可以直接验证：$\boldsymbol{y}$ 在列空间中，意味着存在 $\boldsymbol{x}$ 使 $A\boldsymbol{x}=\boldsymbol{y}$；把 $\boldsymbol{x}$ 按正交补拆成行空间部分与零空间部分 $\boldsymbol{x}=\boldsymbol{x}_r+\boldsymbol{x}_n$，则 $A\boldsymbol{x}=A\boldsymbol{x}_r$，说明 $\boldsymbol{y}$ 是行空间向量 $\boldsymbol{x}_r$ 的像。

有了这个双射，就可以把“逆”定义在能定义的地方。对列空间中的 $\boldsymbol{y}$，令 $A^{+}\boldsymbol{y}$ 为行空间中唯一满足 $A\boldsymbol{x}=\boldsymbol{y}$ 的 $\boldsymbol{x}$；对左零空间中的 $\boldsymbol{y}$，它根本不在列空间里，无原像可求，就令 $A^{+}\boldsymbol{y}=\boldsymbol{0}$。一般的向量按“列空间分量 + 左零空间分量”的正交补分解后逐块作用；对左零空间置零不是随意的约定，而是被逼出来的：$A^{+}$ 的取值必须落在行空间里，而左零空间与列空间互为正交补，那里的方向根本没有原像；若把非零的 $\boldsymbol{y}\in N(A^{\mathsf T})$ 映成非零向量，$A\boldsymbol{x}$ 仍只能落在列空间里，而非零的 $\boldsymbol{y}$ 与列空间正交，$A\boldsymbol{x}=\boldsymbol{y}$ 不可能成立。这样得到的 $A^{+}$ 是 $n\times m$ 的矩阵，而且**任何矩阵都有伪逆**，包括那些既没有左逆也没有右逆的矩阵。

$A$ 与 $A^{+}$ 各自对一块零空间无能为力，也各自把另一块零空间抹掉，于是两个复合映射的效果完全确定：



$$
A^{+}A=\text{到行空间的投影},\qquad AA^{+}=\text{到列空间的投影}.
$$



前者在行空间上是恒等、在零空间上是零，后者在列空间上是恒等、在左零空间上是零。把这件事写成对任意向量的作用会更清楚：$\mathbb{R}^n$ 中任取 $\boldsymbol{x}$，按正交补拆成 $\boldsymbol{x}=\boldsymbol{x}_r+\boldsymbol{x}_n$，则 $A\boldsymbol{x}=A\boldsymbol{x}_r$，所以



$$
A^{+}A\boldsymbol{x}=\boldsymbol{x}_r .
$$



复合映射 $A^{+}A$ 把 $\boldsymbol{x}$ 中“活着”的行空间分量留下，把被 $A$ 杀掉的那一半丢掉，这正是投影的定义。伪逆不可能成为真正的逆；它能做到的最好结果，就是把向量送回行空间与列空间这两个“好”的子空间，并把两块零空间分别抹平。这也解释了第 2、3 节里左逆、右逆的反向乘积为什么是投影：列满秩时零空间消失，$A^{+}A$ 退化成 $n\times n$ 的单位矩阵，只剩 $AA^{+}$ 是非平凡的列空间投影；行满秩时恰好反过来。

![视频 00:27:13：课堂板书](</attachments/mit1806-80358f35a04a7ac7e01ba937.jpg>)

*视频 00:27:13｜约对应第 5 节「5. 伪逆：行空间到列空间的一一对应」附近。*

## 6. 为什么需要伪逆：最小二乘失效时

统计学家是最小二乘的重度使用者，**线性回归**（linear regression）是他们的中心工具，而最小二乘的中心方程



$$
A^{\mathsf T}A\boldsymbol{x}=A^{\mathsf T}\boldsymbol{b}
$$



以 $A^{\mathsf T}A$ 为系数矩阵。这个方程有唯一解的前提是 $A$ 列满秩：$A^{\mathsf T}A$ 可逆，左逆公式 $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ 直接给出解。可统计学家时时都要担心这个前提：同一次实验被重复做了几遍，测得的几列数据就线性相关，$A$ 的秩降到 $r<n$，$A^{\mathsf T}A$ 变成奇异矩阵，左逆公式里的逆号写不下去。

这种失效的机制很具体：若两列数据成正比——比如同一组测量被原样记了两遍——$A$ 的秩至多是 $n-1$，$A^{\mathsf T}A$ 的行也随之线性相关，行列式为零。列满秩一旦破掉，$A^{\mathsf T}A$ 的逆、左逆公式、方程解的唯一性全都跟着失效。重复带来的那些多余方向合起来就是 $A$ 的零空间，维数 $n-r$ 正好度量冗余有多少。

伪逆就是为这一刻准备的。它只在 $r$ 维的行空间上求逆，把零空间里的方向排除在外：不论原始数据重复了几遍，真正独立的只有 $r$ 个方向，伪逆就只在这 $r$ 个方向上做文章，重复的记录不会让它在不该动的方向上移动。列满秩时 $r=n$、零空间消失，伪逆退化为左逆，所以这是一次推广，而不是另立一套理论。

![视频 00:33:30：课堂板书](</attachments/mit1806-dc21d977d75ab05466fc2061.jpg>)

*视频 00:33:30｜约对应第 6 节「6. 为什么需要伪逆：最小二乘失效时」附近。*

## 7. 用 SVD 计算伪逆

伪逆怎么算？最干净的办法是从奇异值分解出发。SVD 把任何矩阵写成



$$
A=U\Sigma V^{\mathsf T},
$$



其中 $U$ 是 $m\times m$ 的**正交矩阵**（orthogonal matrix），$V$ 是 $n\times n$ 的正交矩阵，$\Sigma$ 是 $m\times n$ 的“对角”矩阵：左上角是 $r$ 个正数 $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$，称为**奇异值**（singular value），其余位置全为零。这些非零的 $\sigma_i$ 来自 $A^{\mathsf T}A$ 与 $AA^{\mathsf T}$——它们的平方就是这两个矩阵的非零**特征值**（eigenvalue）。写成分块形式，



$$
\Sigma=\begin{bmatrix}D_r&0\\0&0\end{bmatrix},
\qquad
D_r=\operatorname{diag}(\sigma_1,\dots,\sigma_r).
$$



$\Sigma$ 是“秩为 $r$ 的 $m\times n$ 矩阵”最简单的样本：只有 $r$ 个非零元，$m$ 行、$n$ 列、秩 $r$ 一样不缺。它的零空间由后 $n-r$ 个坐标向量张成，左零空间由后 $m-r$ 个坐标向量张成——两个零空间明明白白地摆在零块里，哪些方向该保留、哪些该丢掉一眼可见。求它的伪逆几乎不用想：能取倒数的取倒数，其余保持为零，



$$
\Sigma^{+}=\begin{bmatrix}D_r^{-1}&0\\0&0\end{bmatrix},
\qquad
D_r^{-1}=\operatorname{diag}\Bigl(\tfrac{1}{\sigma_1},\dots,\tfrac{1}{\sigma_r}\Bigr),
$$



这是 $n\times m$ 的矩阵。检验只需看两个乘积：$\Sigma\Sigma^{+}$ 是 $m\times m$ 的对角矩阵，前 $r$ 个对角元为 $1$，其余为零；$\Sigma^{+}\Sigma$ 是 $n\times n$ 的同型矩阵，前 $r$ 个对角元为 $1$，其余为零。两者都不是单位矩阵，尺寸也不同，但它们分别是 $\mathbb{R}^m$ 与 $\mathbb{R}^n$ 中的投影，正是伪逆能达到的最好结果——它把向量送回 $\Sigma$ 的两个非零子空间。

真正的 $A$ 的伪逆于是写成



$$
A^{+}=V\Sigma^{+}U^{\mathsf T}.
$$



这里的每一步都可以解释：$V^{\mathsf T}$ 的逆是 $V$，$U$ 的逆是 $U^{\mathsf T}$，两个正交矩阵不带来任何麻烦，所有的“病”都集中在中间的 $\Sigma$ 上，而 $\Sigma^{+}$ 刚刚算过。代回去看两个复合：



$$
AA^{+}=U\Sigma\Sigma^{+}U^{\mathsf T},
\qquad
A^{+}A=V\Sigma^{+}\Sigma V^{\mathsf T},
$$



它们分别是到列空间与到行空间的投影，与第 5 节的几何定义完全一致。

$\Sigma^{+}$ 的右上块与左下块必须为零，否则 $\Sigma\Sigma^{+}$ 或 $\Sigma^{+}\Sigma$ 会出现非零的非对角块，不再是正交投影；至于右下角那块 $(n-r)\times(m-r)$ 的零区，本来可以随便填数——它只乘到 $\Sigma$ 的零行与零列，两个乘积不受影响。但填了也没用，只会让矩阵变大；习惯上取最干净的伪逆，把右下块也置零，只保留必须保留的 $1/\sigma_i$。求伪逆的固定路线是：对 $A$ 做 SVD，把三个因子分开处理——两侧的 $U$、$V$ 只需转置，中间的 $\Sigma$ 只需对非零奇异值取倒数——再把三个因子乘回去。SVD 的价值正在于此：它把长方矩阵的求逆化成了对角矩阵取倒数，所有障碍都清清楚楚地排在零块里，什么时候该倒数、什么时候该置零一目了然。作为检验，$r=m=n$ 时不存在零块，$\Sigma^{+}$ 就是 $\Sigma^{-1}$，于是 $A^{+}=V\Sigma^{-1}U^{\mathsf T}=A^{-1}$，伪逆退化为普通的逆；两个秩亏的情形则分别退化为第 2、3 节的左逆与右逆。

![视频 00:37:41：课堂板书](</attachments/mit1806-b72f492a655d62b2ecbfcd55.jpg>)

*视频 00:37:41｜约对应第 7 节「7. 用 SVD 计算伪逆」附近。*

![官方讲义摘要 第 3/3 页](</attachments/mit1806-a4813c2df703dc5357e8dbfc.png>)

*MIT OCW 官方讲义摘要 第 3/3 页（18.06SC Lecture 33 Summary，CC BY-NC-SA 4.0）。*

## 本讲小结

- 逆的类型由四个基本子空间中哪个零空间消失决定：$r=m=n$ 两个都消失，$r=n<m$ 只剩左零空间，$r=m<n$ 只剩零空间，$r<m$ 且 $r<n$ 两个都在。
- 列满秩时 $A^{\mathsf T}A$ 可逆，左逆是 $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$；把它换到右边乘，得到到列空间的投影 $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$。
- 行满秩时 $AA^{\mathsf T}$ 可逆，右逆是 $A^{\mathsf T}(AA^{\mathsf T})^{-1}$；反向乘积 $A^{\mathsf T}(AA^{\mathsf T})^{-1}A$ 是到行空间的投影。
- $n\neq m$ 时 $A$ 与 $A^{\mathsf T}$ 至少有一个带非零零空间，所以长方矩阵绝不可能有双侧逆。
- 伪逆 $A^{+}$ 在行空间到列空间的双射上取逆，对左零空间中的向量置零；于是 $A^{+}A$ 是到行空间的投影，$AA^{+}$ 是到列空间的投影。
- 一一对应的证明：若 $\boldsymbol{x},\boldsymbol{y}$ 在行空间且 $A\boldsymbol{x}=A\boldsymbol{y}$，则 $\boldsymbol{x}-\boldsymbol{y}$ 同时在零空间与行空间中，只能是零向量。
- 任何矩阵都有伪逆，包括既无左逆也无右逆的矩阵；列满秩时伪逆退化为左逆，行满秩时退化为右逆。
- 实际动机是最小二乘：$A^{\mathsf T}A$ 可逆依赖列满秩，重复实验会让列线性相关、秩下降，此时由伪逆接替左逆。
- SVD $A=U\Sigma V^{\mathsf T}$ 把问题归到 $\Sigma$ 上：$\Sigma^{+}$ 对非零奇异值取倒数、其余置零，$A^{+}=V\Sigma^{+}U^{\mathsf T}$；$\Sigma\Sigma^{+}$ 与 $\Sigma^{+}\Sigma$ 都是只有 $r$ 个 $1$ 的对角投影。

## 关键词

| English | 中文 | 一句话解释 |
| --- | --- | --- |
| left inverse | 左逆 | 从左边乘 $A$ 得到单位矩阵的矩阵，形如 $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| right inverse | 右逆 | 从右边乘 $A$ 得到单位矩阵的矩阵，形如 $A^{\mathsf T}(AA^{\mathsf T})^{-1}$ |
| two-sided inverse | 双侧逆 | 左乘右乘都得到单位矩阵的通常逆，只在方阵满秩时存在 |
| pseudoinverse | 伪逆 | 在行空间与列空间之间取逆、把左零空间置零的广义逆 $A^{+}$ |
| full column rank | 列满秩 | $r=n$，各列线性无关，零空间只有零向量 |
| full row rank | 行满秩 | $r=m$，各行线性无关，左零空间只有零向量 |
| projection | 投影 | 在某个子空间上等于恒等、在其正交补上等于零的矩阵 |
| singular value decomposition | 奇异值分解 | 把任意矩阵写成 $A=U\Sigma V^{\mathsf T}$，中间的 $\Sigma$ 只在左上角有 $r$ 个非零对角元 |
| singular value | 奇异值 | $\Sigma$ 左上方非零对角元 $\sigma_i$，其平方为 $A^{\mathsf T}A$ 的非零特征值 |
| orthogonal matrix | 正交矩阵 | 转置即逆的方阵，$U^{\mathsf T}U=I$ |
| least squares | 最小二乘 | 以 $A^{\mathsf T}A$ 为系数矩阵的拟合方法，列满秩时解唯一 |
| linear regression | 线性回归 | 统计学中反复使用最小二乘的中心工具，容易遇到列相关 |

---

[← Lecture 32](/notes/mit-1806/lec32) ｜ [课程目录](/notes/mit-1806/overview) ｜ [Lecture 34 →](/notes/mit-1806/lec34)
