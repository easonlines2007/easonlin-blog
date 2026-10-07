---
publish: true
title: Lecture 28-34：相似矩阵、奇异值分解与线性变换
description: 第 28–34 讲：相似矩阵、若尔当标准型、SVD、线性变换、基变换、图像压缩、伪逆与期末总结。
topic: MIT 18.06
tags:
  - lineal algebra
status: ready
order: 5
date: 2026-10-05
---
> **主讲**：Gilbert Strang 教授 · 麻省理工学院（MIT）  
> **出品**：VideoBook 视频开源技术电子书流水线  
> **全书规模**：全 35 讲完整精编 · 5 大知识体系模块 · 357 张原生高清板书实录 · 260 处核心推导时间戳  
> **视频原源**：[Bilibili 官方全套合集（BV1ix411f7Yp）](https://www.bilibili.com/video/BV1ix411f7Yp/) · [MIT OpenCourseWare 18.06 (Spring 2010)](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/)  
> **版权与许可**：本书文字内容与公式图解由 MIT OCW 开放课程资料翻译整理与结构化改编，授课者 Gilbert Strang，遵循 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 知识共享许可协议。全书板书截帧源自官方公开课录像。

---



> 📚 **模块导语**：探讨相似矩阵与若尔当标准型（亏损矩阵的最终归宿）；推导面向任意长方矩阵的“终极分解”——奇异值分解（SVD: $A = U\Sigma V^T$）；深入抽象线性变换公理及其在特定基底下的矩阵化表达；讲解基变换与现代图像压缩（JPEG DCT 与小波压缩）；探讨左右逆与摩尔-彭罗斯伪逆 $A^+$；最终串联全书五大矩阵分解与基本定理，完成全书期末总复习。

---


<a id="lec-29"></a>
## 第 28 讲：相似矩阵与若尔当标准型

> 📺 **视频回链**：[B 站第 29 P：相似矩阵与若尔当标准型](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29)（⏱ 45分44秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-28-similar-matrices-and-jordan-form/)  
> 💡 **核心精要**：相似矩阵定义 B=M⁻¹AM、特征值完全相同证明、特征向量变换 y=M⁻¹x、亏损矩阵与若尔当块构造定理。

---

### 1. 课程收官序章：$A^T A$ 的正定性复习

*(参考时间: 00:03:00 · [视频跳转 (P29 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=180))*

在进入本讲的核心主题“相似矩阵”之前，Strang 教授首先带领大家重温了第 27 讲留下的一颗璀璨明珠：**任意列满秩长方矩阵 $A$ 所构成的方阵 $A^T A$ 必定是严格正定的**。

设 $A$ 是一个 $m \times n$ 的实矩阵（$m \ge n$），且各列线性无关（$\text{rank}(A) = n$）。
对于任意非零向量 $x \in \mathbb{R}^n$（$x \ne \mathbf{0}$），计算其二次型：
$$
x^T (A^T A) x = (Ax)^T (Ax) = \|Ax\|^2
$$

由于向量的欧氏长度平方恒非负，即 $\|Ax\|^2 \ge 0$：
- 若 $\|Ax\|^2 = 0$，则必有 $Ax = \mathbf{0}$；
- 但由于 $A$ 的各列线性无关，其零空间仅包含零向量 $N(A) = \{\mathbf{0}\}$；
- 因此当 $x \ne \mathbf{0}$ 时，$Ax \ne \mathbf{0}$，从而 $\|Ax\|^2 > 0$！

这严格证明了：
$$
\boxed{x^T (A^T A) x > 0 \quad (\forall x \ne \mathbf{0}) \implies A^T A \text{ 是严格正定对称矩阵}}
$$

![正定矩阵性质复习板书：长方矩阵 AᵀA 的对称性与半正定严格证明](</attachments/obsidian-47fb8f79a724d34b31138519.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=210)*

这一性质是最小二乘法中正规方程 $(A^T A) \hat{x} = A^T b$ 永远存在唯一确定解的代数基石。

![二次型能量证明板书：xᵀ(AᵀA)x = ||Ax||² > 0 在非零向量下恒成立](</attachments/obsidian-ce42a43b2327e9e89d98361f.png>)
*⏱ 时间戳：00:08:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:08:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=510)*

---

### 2. 相似矩阵（Similar Matrices）与矩阵家族

*(参考时间: 00:13:00 · [视频跳转 (P29 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=780))*

现在，我们进入本讲的主题。在整个线性代数中，矩阵并不是孤立存在的。
许多看似毫无共同点的矩阵，在某种本质视角下其实是“同一个线性变换在不同坐标系下的化身”。

#### 2.1 相似的严格代数定义
设 $A$ 和 $B$ 是两个 $n \times n$ 的方阵。如果存在一个**可逆矩阵 $M$**，满足：
$$
\boxed{B = M^{-1} A M}
$$
则称**矩阵 $A$ 与矩阵 $B$ 相似（Similar）**。

所有的相似矩阵构成了一个“家族（Family）”：
- 如果给定一个矩阵 $A$，随着可逆矩阵 $M$ 取遍所有可逆方阵，$M^{-1} A M$ 便扫出了与 $A$ 相似的所有矩阵构成的庞大家族。

![相似矩阵定义板书：B = M⁻¹ A M 与可逆基变换矩阵 M 的引入](</attachments/obsidian-a1c55194f6e339235c33006f.png>)
*⏱ 时间戳：00:13:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=810)*

---

### 3. 相似矩阵的核心不变量：特征值完全相同

*(参考时间: 00:17:00 · [视频跳转 (P29 00:17:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1020))*

当两个矩阵相似时，它们共享哪些不可磨灭的代数本质？
**最重要的结论：相似矩阵具有完全相同的特征值！**

#### 3.1 证明：特征多项式恒等
考虑矩阵 $B = M^{-1} A M$ 的特征方程：
$$
\det(B - \lambda I) = \det(M^{-1} A M - \lambda M^{-1} I M)
$$
提取公因式矩阵 $M^{-1}$ 与 $M$：
$$
\det(B - \lambda I) = \det\left( M^{-1} (A - \lambda I) M \right)
$$
利用行列式的乘法法则 $\det(XYZ) = \det(X) \det(Y) \det(Z)$：
$$
\det(B - \lambda I) = \det(M^{-1}) \cdot \det(A - \lambda I) \cdot \det(M)
$$
由于 $\det(M^{-1}) \cdot \det(M) = 1$，常数项完美相消：
$$
\boxed{\det(B - \lambda I) = \det(A - \lambda I)}
$$
两者的特征多项式一模一样！因此，**$A$ 与 $B$ 的所有特征值及其代数重数丝毫不差完全相同**！

![相似矩阵特征方程证明板书：det(B - λI) = det(M⁻¹(A - λI)M) = det(A - λI)](</attachments/obsidian-b161e237a176a11193fdff15.png>)
*⏱ 时间戳：00:17:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:17:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1050)*

---

### 4. 特征向量的变换法则：$y = M^{-1} x$

*(参考时间: 00:21:00 · [视频跳转 (P29 00:21:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1260))*

既然相似矩阵具有完全相同的特征值，那么它们的特征向量也相同吗？
**答案：特征向量不同，但遵循严格的可逆映射关系！**

设 $x$ 是矩阵 $A$ 对应于特征值 $\lambda$ 的特征向量，即：
$$
A x = \lambda x
$$
在两边左乘 $M^{-1}$，并在 $A$ 与 $x$ 之间插入单位阵 $I = M M^{-1}$：
$$
M^{-1} A (M M^{-1}) x = \lambda M^{-1} x
$$
结合矩阵乘法结合律：
$$
(M^{-1} A M) (M^{-1} x) = \lambda (M^{-1} x)
$$
因为 $B = M^{-1} A M$，令 $y = M^{-1} x$，上式即为：
$$
\boxed{B y = \lambda y}
$$

**结论**：
- 如果 $x$ 是 $A$ 的特征向量，那么 **$y = M^{-1} x$ 就是 $B$ 的特征向量**！
- 特征向量经历了一次线性坐标基变换 $M^{-1}$。

![特征向量变换法则板书：Ax = λx 诱导 B(M⁻¹x) = λ(M⁻¹x)，特征向量映射 y = M⁻¹x](</attachments/obsidian-2a9ab05f597ce61005199aa7.png>)
*⏱ 时间戳：00:21:40 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:21:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1300)*

#### 4.1 最美丽的家族成员：对角矩阵 $\Lambda$
*(参考时间: 00:25:00 · [视频跳转 (P29 00:25:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1500))*

如果矩阵 $A$ 拥有 $n$ 个线性无关的特征向量，令特征向量矩阵为 $S$：
取 $M = S$，则：
$$
S^{-1} A S = \Lambda = \begin{bmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{bmatrix}
$$
在所有与 $A$ 相似的矩阵家族中，**对角矩阵 $\Lambda$ 无疑是最简洁、最优美、最纯粹的代表**！
对角化本质上就是**在相似矩阵家族中寻找对角形式的最简坐标系**。

![相似矩阵家族皇冠板书：S⁻¹ A S = Λ 对角矩阵作为最简标准型的地位](</attachments/obsidian-9b022bc87551b5aa8143b345.png>)
*⏱ 时间戳：00:25:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:25:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1530)*

---

### 5. 孤立家族与退化矩阵（Defective Matrices）

*(参考时间: 00:29:00 · [视频跳转 (P29 00:29:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1740))*

是否所有矩阵都能在相似家族里找到对角矩阵 $\Lambda$？**不是！**

#### 5.1 极端案例 1：纯数量标量阵
考虑标量矩阵 $4I = \begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$。其特征值为 $\lambda_1 = 4, \lambda_2 = 4$。
寻找所有与 $4I$ 相似的矩阵：
$$
M^{-1} (4I) M = 4 M^{-1} M = 4I
$$
对于任意可逆矩阵 $M$，结果永远是 $4I$ 本身！
这意味着：**以 $4I$ 为代表的标量阵家族极其孤僻，整个家族中只有它自己这一个孤零零的成员！**

![孤立标量阵家族板书：M⁻¹(4I)M = 4I，标量矩阵家族的单一性分析](</attachments/obsidian-9a63bf4003d15e7c150751e2.png>)
*⏱ 时间戳：00:29:40 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:29:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1780)*

#### 5.2 极端案例 2：重特征值但特征向量亏损
考虑同样具有特征值 $\lambda_1 = 4, \lambda_2 = 4$ 的剪切矩阵：
$$
A = \begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}
$$
计算其特征向量：
$$
(A - 4I) x = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies x_2 = 0
$$
只有形如 $x = c \begin{bmatrix} 1 \\ 0 \end{bmatrix}$ 的一维特征向量空间！几何重数（1）小于代数重数（2）。
由于缺少一个独立的特征向量，$A$ **绝不可能被对角化**！
因此，$A$ 绝不可能与 $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$ 相似，它们生活在两个完全不同的相似家族中！

![不可对角化亏损矩阵板书：矩阵 (4 1; 0 4) 特征值重复且只有一个独立特征向量](</attachments/obsidian-739ddb1bf35fd8f73eaf18a6.png>)
*⏱ 时间戳：00:34:30 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:34:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2070)*

---

### 6. 终极标准型：若尔当标准型（Jordan Canonical Form）

*(参考时间: 00:38:00 · [视频跳转 (P29 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2280))*

当矩阵无法对角化时，在线性代数中，我们能将它化简到的“最简极限”是什么？
这就是由若尔当（Camille Jordan）所奠定的巅峰定理——**若尔当标准型 $J$**。

**若尔当定理（Jordan's Theorem）**：
任意 $n \times n$ 复方阵 $A$ 必定相似于一个分块对角矩阵 $J$：
$$
\boxed{A = M J M^{-1} \quad \text{或} \quad J = M^{-1} A M}
$$
其中 $J$ 由若干个**若尔当块（Jordan Blocks）**沿主对角线拼接而成：
$$
J = \begin{bmatrix}
J_1 & & & \\
& J_2 & & \\
& & \ddots & \\
& & & J_d
\end{bmatrix}
$$

#### 6.1 若尔当块 $J_i$ 的内部构造
每一个若尔当块 $J_i$ 的形式如下：
- 主对角线上全部是同一个特征值 $\lambda_i$；
- 紧靠主对角线上方的**第一超对角线（Superdiagonal）全部是 1**；
- 其余位置全部是 0！

例如，大小为 $3 \times 3$ 的若尔当块为：
$$
J_i = \begin{bmatrix}
\lambda_i & 1 & 0 \\
0 & \lambda_i & 1 \\
0 & 0 & \lambda_i
\end{bmatrix}
$$

每一个若尔当块 $J_i$ **恰好只贡献一个独立的特征向量**！

![若尔当块构造与分块对角矩阵板书：主对角特征值与超对角线 1 的标准结构](</attachments/obsidian-46c143fa5313f2c6c9aae141.png>)
*⏱ 时间戳：00:38:50 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2330)*

---

### 7. 若尔当块数与几何重数的深刻对应

*(参考时间: 00:43:00 · [视频跳转 (P29 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2580))*

若尔当标准型最美妙的定理在于其块数与子空间维度的几何对应：

$$
\boxed{\text{若尔当块的数量 } d = \text{矩阵 } A \text{ 线性无关特征向量的总数（几何重数之和）}}
$$

- **情况 1（完全可对角化）**：如果 $A$ 有 $n$ 个线性无关特征向量，则有 $n$ 个若尔当块（全部为 $1 \times 1$ 的块），此时 $J = \Lambda$ 就是对角矩阵！
- **情况 2（极端退化）**：如果 $A$ 只有一个线性无关特征向量，则只有一个巨大的 $n \times n$ 若尔当块。
- **情况 3（一般退化）**：特征值的代数重数决定了该特征值出现在对角线上的总次数；而该特征值对应的特征空间维数（几何重数）决定了该特征值拥有的若尔当块个数！

![若尔当定理结语板书：若尔当块数目严格等于独立特征向量数目，全谱理论圆满闭合](</attachments/obsidian-eee4a1871bbe8d2f5d6f1dc6.png>)
*⏱ 时间戳：00:43:20 · 📷 板书截图 · [在 B 站观看对应片段 (P29 00:43:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2600)*

若尔当标准型彻底解决了一切方阵分类的理论问题。在下一讲（第 29 讲）中，我们将迈入任意长方矩阵的皇冠分解——**奇异值分解（SVD）**！


---


<a id="lec-30"></a>
## 第 29 讲：奇异值分解（SVD）

> 📺 **视频回链**：[B 站第 30 P：奇异值分解（SVD）](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30)（⏱ 40分17秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/)  
> 💡 **核心精要**：任意矩阵终极分解 A=UΣVᵀ、AᵀA 谱对角化求奇异值与 V、AAᵀ 求 U、四大子空间基底对齐与低秩逼近。

---

### 1. 线性代数的最高巅峰：奇异值分解（SVD）

*(参考时间: 00:03:00 · [视频跳转 (P30 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=180))*

在之前的课程中，我们学习过多种矩阵分解：
- 高斯消元法导出了 $A = L U$（只适用于方阵，且要求可逆）；
- Gram-Schmidt 正交化导出了 $A = Q R$（对长方矩阵求列的正交基）；
- 特征值理论导出了 $A = S \Lambda S^{-1}$（要求矩阵可对角化，拥有 $n$ 个独立特征向量）；
- 对称矩阵谱定理导出了 $A = Q \Lambda Q^T$（要求矩阵对称）。

如果面对一个**完全任意的、甚至不是方阵的 $m \times n$ 矩阵 $A$**，我们能否找到一个终极的、完美的矩阵分解？
**答案就是奇异值分解（Singular Value Decomposition，SVD）！**

#### 1.1 SVD 的宏伟几何目标
我们希望在定义域空间 $\mathbb{R}^n$ 的行空间中找到一组**标准正交基** $v_1, v_2, \dots, v_r$，使得矩阵 $A$ 将它们映射为值域空间 $\mathbb{R}^m$ 的列空间中一组**依然相互正交的向量**：
$$
A v_1 = \sigma_1 u_1, \quad A v_2 = \sigma_2 u_2, \quad \dots, \quad A v_r = \sigma_r u_r
$$
其中：
- $v_1, \dots, v_r$ 在 $\mathbb{R}^n$ 中标准正交（$v_i^T v_j = \delta_{ij}$）；
- $u_1, \dots, u_r$ 在 $\mathbb{R}^m$ 中标准正交（$u_i^T u_j = \delta_{ij}$）；
- 伸缩因子 $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0$ 称为**奇异值（Singular Values）**！

![SVD核心几何目标板书：行空间标准正交基 v 变换到列空间标准正交基 u 与奇异值 σ](</attachments/obsidian-892caabc3952dcfe755fe95c.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=210)*

---

### 2. 矩阵形式：$A = U \Sigma V^T$

*(参考时间: 00:07:00 · [视频跳转 (P30 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=420))*

将上述方程组 $A v_i = \sigma_i u_i$ 拼成矩阵形式：
$$
A \begin{bmatrix} v_1 & v_2 & \cdots & v_n \end{bmatrix} = \begin{bmatrix} u_1 & u_2 & \cdots & u_m \end{bmatrix} \begin{bmatrix}
\sigma_1 & & & & \\
& \ddots & & & \\
& & \sigma_r & & \\
& & & 0 & \\
& & & & \ddots
\end{bmatrix}_{m \times n}
$$
记为：
$$
A V = U \Sigma
$$
因为 $V$ 是由 $\mathbb{R}^n$ 的标准正交基构成的方阵，它是正交矩阵，满足 $V^{-1} = V^T$！
在两边同时右乘 $V^T$，我们得到全人类数学史上最壮丽的分解定理：
$$
\boxed{A = U \Sigma V^T}
$$
- $U$ 是 $m \times m$ 的正交矩阵（列向量为左奇异向量）；
- $\Sigma$ 是 $m \times n$ 的对角矩阵（对角线上为主奇异值，按从大到小排列）；
- $V$ 是 $n \times n$ 的正交矩阵（列向量为右奇异向量）。

![奇异值分解矩阵形式板书：AV = UΣ 导出终极分解 A = UΣVᵀ](</attachments/obsidian-3432c969848fcad096a38f01.png>)
*⏱ 时间戳：00:07:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=450)*

---

### 3. 如何求解 $V$ 与 $\Sigma$：构造对称正定方阵 $A^T A$

*(参考时间: 00:11:00 · [视频跳转 (P30 00:11:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=660))*

在公式 $A = U \Sigma V^T$ 中，未知数有两组正交矩阵 $U$ 和 $V$。如何将它们分离开来各个击破？
利用转置技巧计算 $A^T A$：
$$
A^T A = (U \Sigma V^T)^T (U \Sigma V^T) = V \Sigma^T U^T U \Sigma V^T
$$
由于 $U$ 是正交矩阵，$U^T U = I$ **神奇地彻底消失了**！
$$
\boxed{A^T A = V (\Sigma^T \Sigma) V^T}
$$

观察这个式子：
- $A^T A$ 是一个 $n \times n$ 的对称半正定矩阵；
- 它的正交对角化形式正是 $Q \Lambda Q^T$；
- 两相对比，立刻得出石破天惊的结论：
  1. **$V$ 正是矩阵 $A^T A$ 的特征向量矩阵**！
  2. **$\Sigma^T \Sigma$ 正是 $A^T A$ 的特征值矩阵**，即：
     $$
     \sigma_i^2 = \lambda_i(A^T A) \implies \boxed{\sigma_i = \sqrt{\lambda_i(A^T A)}}
     $$

![AᵀA 谱对角化板书：AᵀA = V(ΣᵀΣ)Vᵀ 与酉正交矩阵 UᵀU=I 的消去](</attachments/obsidian-20bc7323e53fddd3d3ac0a00.png>)
*⏱ 时间戳：00:11:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:11:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=690)*

这直接将求非对称长方阵的奇异值，转化为了求对称矩阵特征值的成熟算法！

![奇异值与特征值关系板书：V 为 AᵀA 特征向量且 σ_i = √(λ_i(AᵀA))](</attachments/obsidian-ed56a1fe973d4093512787b7.png>)
*⏱ 时间戳：00:15:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:15:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=930)*

---

### 4. 如何求解 $U$：对称方阵 $A A^T$ 与对应映射

*(参考时间: 00:19:00 · [视频跳转 (P30 00:19:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1140))*

同理，若颠倒乘法次序计算 $A A^T$：
$$
A A^T = (U \Sigma V^T) (U \Sigma V^T)^T = U \Sigma V^T V \Sigma^T U^T = U (\Sigma \Sigma^T) U^T
$$
由于 $V^T V = I$ 同样消失，这证明：
- **$U$ 正是矩阵 $A A^T$ 的特征向量矩阵**！

更直观地，一旦求出了 $v_i$ 与 $\sigma_i$，对于非零奇异值对应的基向量，可直接由定义公式归一化得出：
$$
\boxed{u_i = \frac{A v_i}{\sigma_i} \quad (i = 1, \dots, r)}
$$

#### 4.1 可逆方阵计算实例
考虑 $2 \times 2$ 矩阵：
$$
A = \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}
$$
计算 $A^T A$：
$$
A^T A = \begin{bmatrix} 4 & -3 \\ 4 & 3 \end{bmatrix} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 25 & 7 \\ 7 & 25 \end{bmatrix}
$$
求特征值：
$$
\det\begin{bmatrix} 25 - \lambda & 7 \\ 7 & 25 - \lambda \end{bmatrix} = (25 - \lambda)^2 - 49 = 0 \implies \lambda_1 = 32, \quad \lambda_2 = 18
$$
因此奇异值为：
$$
\sigma_1 = \sqrt{32} = 4\sqrt{2}, \quad \sigma_2 = \sqrt{18} = 3\sqrt{2}
$$

![可逆二阶矩阵计算示例板书：矩阵 (4 4; -3 3) 的 AᵀA 计算与特征值求解](</attachments/obsidian-d105f1c9e3ce3aaa004798fc.png>)
*⏱ 时间戳：00:19:40 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:19:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1180)*

求 $A^T A$ 的特征向量并单位化：
- 对于 $\lambda_1 = 32$：特征向量为 $v_1 = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \end{bmatrix}$；
- 对于 $\lambda_2 = 18$：特征向量为 $v_2 = \frac{1}{\sqrt{2}} \begin{bmatrix} -1 \\ 1 \end{bmatrix}$。

计算 $u_1, u_2$：
$$
u_1 = \frac{A v_1}{\sigma_1} = \frac{1}{4\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \frac{1}{8} \begin{bmatrix} 8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}
$$
$$
u_2 = \frac{A v_2}{\sigma_2} = \frac{1}{3\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}
$$
于是有完美的奇异值分解：
$$
\begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 4\sqrt{2} & 0 \\ 0 & 3\sqrt{2} \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} & 1/\sqrt{2} \\ -1/\sqrt{2} & 1/\sqrt{2} \end{bmatrix}
$$

![AAᵀ 对角化与 U 求解板书：AAᵀ = U(ΣΣᵀ)Uᵀ 与两矩阵非零特征值等同定理](</attachments/obsidian-10efa57404f60eec14a0bb3f.png>)
*⏱ 时间戳：00:23:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:23:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1410)*

---

### 5. 奇异矩阵与秩 1 案例（Rank 1 Deficient Matrix）

*(参考时间: 00:28:00 · [视频跳转 (P30 00:28:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1680))*

如果矩阵是奇异的（退化的），SVD 如何处理？
考虑秩 1 矩阵：
$$
A = \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}
$$
此时行空间仅是一维直线（由 $\begin{bmatrix} 4 & 3 \end{bmatrix}^T$ 张成），零空间由正交补 $\begin{bmatrix} 3 & -4 \end{bmatrix}^T$ 张成。

![奇异矩阵秩 1 示例板书：矩阵 (4 3; 8 6) 与行空间一维直线](</attachments/obsidian-b6ec38f96a73c01c93f19817.png>)
*⏱ 时间戳：00:28:30 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:28:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1710)*

计算 $A^T A$：
$$
A^T A = \begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix} \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix} = \begin{bmatrix} 80 & 60 \\ 60 & 45 \end{bmatrix}
$$
其特征值为：
$$
\text{tr}(A^T A) = 80 + 45 = 125, \quad \det(A^T A) = 0 \implies \lambda_1 = 125, \quad \lambda_2 = 0
$$
唯一的非零奇异值为：
$$
\sigma_1 = \sqrt{125} = 5\sqrt{5}, \quad \sigma_2 = 0
$$

![秩 1 矩阵特征值与奇异值板书：λ₁ = 125, λ₂ = 0 且 σ₁ = √125 = 5√5](</attachments/obsidian-bb46ff4167bc117d6ae4249e.png>)
*⏱ 时间戳：00:32:40 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:32:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1960)*

求出各标准正交基：
- $v_1 = \frac{1}{5} \begin{bmatrix} 4 \\ 3 \end{bmatrix}$（行空间标准正交基）；
- $v_2 = \frac{1}{5} \begin{bmatrix} 3 \\ -4 \end{bmatrix}$（零空间标准正交基）；
- $u_1 = \frac{A v_1}{\sigma_1} = \frac{1}{\sqrt{5}} \begin{bmatrix} 1 \\ 2 \end{bmatrix}$（列空间标准正交基）；
- $u_2 = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 \\ -1 \end{bmatrix}$（左零空间标准正交基）。

![四大基本子空间正交基板书：v₁在行空间、v₂在零空间、u₁在列空间、u₂在左零空间](</attachments/obsidian-fa286c48b182f6223685812b.png>)
*⏱ 时间戳：00:35:20 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:35:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2120)*

---

### 6. SVD 的统一几何视角与低秩近似

*(参考时间: 00:38:00 · [视频跳转 (P30 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2280))*

SVD 将线性代数第一章到最后一章的所有宏大理论串联成一个完美闭环：

1. **几何变换图景**：
   $A$ 将 $\mathbb{R}^n$ 中的单位超球面映射为 $\mathbb{R}^m$ 中的超椭球体！
   - 椭球的主半轴方向由列向量 $u_1, \dots, u_r$ 决定；
   - 椭球的主半轴长度恰好就是奇异值 $\sigma_1, \dots, \sigma_r$！
2. **秩 1 外积展开式（Eckart-Young 低秩逼近）**：
   $$
   \boxed{A = \sum_{i=1}^r \sigma_i u_i v_i^T = \sigma_1 u_1 v_1^T + \sigma_2 u_2 v_2^T + \cdots + \sigma_r u_r v_r^T}
   $$
   每一项 $u_i v_i^T$ 都是一个极简的秩 1 矩阵。按奇异值从大到小截断，构成了图像压缩、PCA 主成分分析、推荐系统与大模型权重低秩微调（LoRA）的数理基石！

![SVD 几何与秩 1 矩阵外积和板书：A = ∑ σ_i u_i v_iᵀ 与单位球映射为椭球](</attachments/obsidian-6c358337ce981ce67ae0a33e.png>)
*⏱ 时间戳：00:38:50 · 📷 板书截图 · [在 B 站观看对应片段 (P30 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2330)*


---


<a id="lec-31"></a>
## 第 30 讲：线性变换及其矩阵表示

> 📺 **视频回链**：[B 站第 31 P：线性变换及其矩阵表示](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31)（⏱ 49分18秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/)  
> 💡 **核心精要**：线性变换两大公理、几何与微积分算子（求导与求积）、基底决定一切、展开系数矩阵化构造法则、特征基下的对角化。

---

### 1. 概念升华：什么是线性变换（Linear Transformation）？

*(参考时间: 00:03:00 · [视频跳转 (P31 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=180))*

在之前的绝大部分章节中，线性代数的主角是数字构成的矩阵 $A$ 与向量 $x$，以及运算 $A x$。
但在近代数学中，矩阵只是具体数值坐标的表达形式，其背后的物理与几何本质是**线性变换（Linear Transformation）**。

#### 1.1 线性变换的两大核心公理
设 $V$ 与 $W$ 是两个向量空间。一个从 $V$ 到 $W$ 的映射规则 $T: V \to W$ 称为**线性变换**，当且仅当它满足以下两条运算封闭律：
1. **加法保持性（Additivity）**：对任意向量 $v, w \in V$：
   $$
   T(v + w) = T(v) + T(w)
   $$
2. **数乘保持性（Homogeneity）**：对任意向量 $v \in V$ 及任意标量 $c \in \mathbb{R}$：
   $$
   T(c v) = c T(v)
   $$

这两条公理可以等价地合并为一条**线性组合保持公理**：
$$
\boxed{T(c v + d w) = c T(v) + d T(w)}
$$

**重要推论**：
取标量 $c = 0$，立刻得出任意线性变换必定把零向量映射为零向量：
$$
T(\mathbf{0}) = \mathbf{0}
$$
如果一个变换将零向量映射为非零向量，它就绝对不是线性的！

![线性变换的两大核心公理板书：加法保线性 T(v+w)=T(v)+T(w) 与数乘保线性 T(cv)=cT(v)](</attachments/obsidian-3f7d7f9b5c0202c7103b6b57.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=210)*

---

### 2. 线性与非线性的生动辨析

*(参考时间: 00:07:00 · [视频跳转 (P31 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=420))*

为了深刻理解“线性”的严苛边界，Strang 教授给出了若干直观的反例与正例：

#### 2.1 经典非线性反例
1. **平移变换（Shift / Translation）**：
   $$
   T(v) = v + u_0 \quad (u_0 \ne \mathbf{0})
   $$
   检验零向量：$T(\mathbf{0}) = u_0 \ne \mathbf{0}$，原点被移动了！
   检验加法：$T(v + w) = v + w + u_0$，而 $T(v) + T(w) = v + w + 2u_0$，两者不相等！因此平移是非线性的。
2. **模长变换（Length / Norm）**：
   $$
   T(v) = \|v\|
   $$
   检验数乘：取 $c = -1$，$T(-v) = \|-v\| = \|v\|$，但 $-T(v) = -\|v\|$，符号发生冲突，因此取长度是非线性的。

![非线性反例板书：平移变换 T(v)=v+u₀ 不过原点破坏线性性](</attachments/obsidian-283da1d033c277e901d32cda.png>)
*⏱ 时间戳：00:07:30 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=450)*

#### 2.2 经典几何线性正例
在平面几何中，以下经典变换都是严格线性的：
- **旋转变换（Rotation）**：将平面所有向量逆时针旋转 $\theta$ 角，平行四边形法则依然成立；
- **投影变换（Projection）**：将向量垂直投影到过原点的某条直线上；
- **反射变换（Reflection）**：关于某条过原点的对称轴进行镜像翻转。

![几何变换案例板书：旋转、投影与反射对房屋图形的线性变换](</attachments/obsidian-2acc49c9ceca8d8cee7e52c4.png>)
*⏱ 时间戳：00:13:30 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=810)*

---

### 3. 抽象向量空间中的线性算子：微积分求导与积分

*(参考时间: 00:19:00 · [视频跳转 (P31 00:19:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1140))*

线性变换的伟大之处在于它完全不局限于 $\mathbb{R}^n$ 中的列向量。它可以作用于任何抽象向量空间，例如**函数空间**！

考虑由实系数多项式构成的向量空间 $\mathcal{P}$：
- **求导算子（Derivative）**：$T(f) = \frac{df}{dx}$
  检验微积分性质：
  $$
  \frac{d(f + g)}{dx} = \frac{df}{dx} + \frac{dg}{dx} \quad \text{以及} \quad \frac{d(c f)}{dx} = c \frac{df}{dx}
  $$
  求导算子是完全严格的线性变换！
- **求积算子（Integration）**：$T(f) = \int_0^x f(t) dt$
  积分同样保持加法与数乘，也是线性变换！

这揭示了一个惊人的数理事实：**微积分本质上就是无穷维函数空间上的线性代数！**

![抽象向量空间线性变换：多项式求导算子 d/dx 与求积算子积分也是线性变换](</attachments/obsidian-48e2e105c1254963e093eb9d.png>)
*⏱ 时间戳：00:19:30 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:19:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1170)*

---

### 4. 核心定理：基底决定一切

*(参考时间: 00:24:00 · [视频跳转 (P31 00:24:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1440))*

一个向量空间包含无穷多个向量，我们如何才能完整确定一个线性变换 $T$ 的全貌？需要罗列所有向量的映射结果吗？
**完全不需要！只要掌握一组基，就掌握了一切！**

设 $v_1, v_2, \dots, v_n$ 是输入空间 $V$ 的一组基。
空间中任意向量 $v$ 都可以唯一表示为这组基的线性组合：
$$
v = c_1 v_1 + c_2 v_2 + \cdots + c_n v_n
$$
利用线性变换的加法与数乘公理：
$$
\boxed{T(v) = c_1 T(v_1) + c_2 T(v_2) + \cdots + c_n T(v_n)}
$$

**结论**：
我们只需要知道 $T$ 作用在有限个基向量上的结果 $T(v_1), \dots, T(v_n)$，就可以通过简单的线性组合，瞬间算出空间中任何一个向量变换后的输出！

![基底决定一切定理板书：只要确定 n 个基向量的变换 T(v_i)，全空间任意向量变换随之确定](</attachments/obsidian-7426cdb0acb81e01004a2515.png>)
*⏱ 时间戳：00:24:20 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:24:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1460)*

---

### 5. 矩阵表示的构造法则

*(参考时间: 00:29:00 · [视频跳转 (P31 00:29:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1740))*

从抽象线性变换 $T$ 跨入具体可计算的矩阵 $A$，桥梁就是**坐标基（Bases）**。

设输入空间 $V$ 选取基底 $\mathcal{V} = \{v_1, \dots, v_n\}$，输出空间 $W$ 选取基底 $\mathcal{W} = \{w_1, \dots, w_m\}$。
构造矩阵 $A$（大小为 $m \times n$）的标准流程：

1. **计算第 1 列**：将 $T$ 作用于第 1 个输入基向量 $v_1$，将其输出用输出基展开：
   $$
   T(v_1) = a_{11} w_1 + a_{21} w_2 + \cdots + a_{m1} w_m \implies \text{矩阵第 1 列为 } \begin{bmatrix} a_{11} \\ a_{21} \\ \vdots \\ a_{m1} \end{bmatrix}
   $$
2. **计算第 $j$ 列**：将 $T$ 作用于第 $j$ 个输入基向量 $v_j$，用输出基展开其坐标：
   $$
   T(v_j) = \sum_{i=1}^m a_{ij} w_i \implies \text{矩阵第 } j \text{ 列就是展开坐标系数}
   $$

**一句话法则**：**矩阵的每一列，就是对应输入基向量在变换后于输出基下的坐标！**

![线性变换构造矩阵法则板书：T(v_j) 在输出基 w_i 下的坐标展开构成矩阵 A 的第 j 列](</attachments/obsidian-8100f1d7aeb8b0e1cbbcea8f.png>)
*⏱ 时间戳：00:29:40 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:29:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1780)*

---

### 6. 基底的选择：标准基 vs 特征向量基

*(参考时间: 00:34:00 · [视频跳转 (P31 00:34:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2040))*

同一个几何线性变换，在不同的基底之下，写出来的矩阵天差地别！

#### 6.1 实例：投影到 45° 倾斜直线
考虑 $\mathbb{R}^2$ 中向直线 $y = x$ 的垂直投影变换 $T$。

**选择 1：标准直角坐标基** $v_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, v_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$
- $T(v_1) = \begin{bmatrix} 1/2 \\ 1/2 \end{bmatrix} = \frac{1}{2} v_1 + \frac{1}{2} v_2$；
- $T(v_2) = \begin{bmatrix} 1/2 \\ 1/2 \end{bmatrix} = \frac{1}{2} v_1 + \frac{1}{2} v_2$。
得到标准基下的投影矩阵：
$$
A = \begin{bmatrix} 1/2 & 1/2 \\ 1/2 & 1/2 \end{bmatrix}
$$

![标准基下的投影矩阵构造板书：投影到 45 度线在标准基下的矩阵 (1/2 1/2; 1/2 1/2)](</attachments/obsidian-31def1f8304fc0fdd061c5cd.png>)
*⏱ 时间戳：00:34:30 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:34:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2070)*

**选择 2：特征向量基** $v_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$（沿投影线），$v_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$（垂直于投影线）
- $T(v_1) = v_1 = 1 v_1 + 0 v_2$；
- $T(v_2) = \mathbf{0} = 0 v_1 + 0 v_2$。
在该基底下的矩阵变为：
$$
\Lambda = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}
$$
**这是何等极致的简洁！**
特征向量正是让变换矩阵彻底对角化的“天选基底”。

![特征向量基下的对角化矩阵板书：在特征基下投影矩阵变为极致对角阵 (1 0; 0 0)](</attachments/obsidian-02fd16c0c5cc0b980159be3a.png>)
*⏱ 时间戳：00:38:50 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2330)*

---

### 7. 多项式微积分的矩阵化表示

*(参考时间: 00:43:00 · [视频跳转 (P31 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2580))*

以求导算子为例，设输入空间为 3 次以内的多项式空间 $V = \text{span}\{1, x, x^2, x^3\}$（维数 4），输出空间为 2 次以内的多项式空间 $W = \text{span}\{1, x, x^2\}$（维数 3）。

基向量依次为：$v_1=1, v_2=x, v_3=x^2, v_4=x^3$；输出基为：$w_1=1, w_2=x, w_3=x^2$。
依次求导并按输出基展开：
1. $\frac{d}{dx}(1) = 0 = 0 w_1 + 0 w_2 + 0 w_3 \implies \text{col}_1 = \begin{bmatrix} 0 & 0 & 0 \end{bmatrix}^T$
2. $\frac{d}{dx}(x) = 1 = 1 w_1 + 0 w_2 + 0 w_3 \implies \text{col}_2 = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$
3. $\frac{d}{dx}(x^2) = 2x = 0 w_1 + 2 w_2 + 0 w_3 \implies \text{col}_3 = \begin{bmatrix} 0 & 2 & 0 \end{bmatrix}^T$
4. $\frac{d}{dx}(x^3) = 3x^2 = 0 w_1 + 0 w_2 + 3 w_3 \implies \text{col}_4 = \begin{bmatrix} 0 & 0 & 3 \end{bmatrix}^T$

拼得**求导矩阵 $D$**：
$$
D = \begin{bmatrix}
0 & 1 & 0 & 0 \\
0 & 0 & 2 & 0 \\
0 & 0 & 0 & 3
\end{bmatrix}_{3 \times 4}
$$
对任意多项式 $f(x) = c_1 + c_2 x + c_3 x^2 + c_4 x^3$ 求导，只需用矩阵 $D$ 乘以坐标向量 $\begin{bmatrix} c_1 & c_2 & c_3 & c_4 \end{bmatrix}^T$！

![多项式微积分的矩阵表示板书：从三次多项式空间到二次多项式空间的 3×4 求导矩阵 D](</attachments/obsidian-bc6aca0f6f920b18405b1a6d.png>)
*⏱ 时间戳：00:43:20 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:43:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2600)*

#### 7.1 复合线性变换与矩阵乘法
如果先后执行两个线性变换 $T_1: U \to V$ 与 $T_2: V \to W$，对应的矩阵分别为 $B$ 和 $A$：
$$
(T_2 \circ T_1)(u) \iff A (B x) = (A B) x
$$
这彻底揭示了**矩阵乘法之所以定义为行乘列的深层原因**：它正是复合线性变换在基底下的自然结合！

![复合线性变换与矩阵乘法板书：复合算子与矩阵相乘对应，微分与积分算子互为伪逆](</attachments/obsidian-48f0c052c2d8ad57febce884.png>)
*⏱ 时间戳：00:47:40 · 📷 板书截图 · [在 B 站观看对应片段 (P31 00:47:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2860)*


---


<a id="lec-32"></a>
## 第 31 讲：基变换与图像压缩

> 📺 **视频回链**：[B 站第 32 P：基变换与图像压缩](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32)（⏱ 50分06秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/)  
> 💡 **核心精要**：数字图像向量化、JPEG 与离散余弦基（DCT）、Haar 多尺度小波基（Wavelets）、基变换公式 c=W⁻¹x、B=M⁻¹AM 几何真谛。

---

### 1. 数字图像的线性代数建模

*(参考时间: 00:03:00 · [视频跳转 (P32 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=180))*

一幅数字灰度图像在计算机中究竟是什么？
本质上，它就是一个巨大的**数值向量**！

设图像的分辨率为 $512 \times 512$ 像素：
- 图像总共有 $n = 512 \times 512 = 262,144$ 个像素点；
- 每一个像素的亮度由一个标量表示（如 8 位灰度级，取值从 0 表示纯黑到 255 表示纯白）；
- 因此，整幅图像就是向量空间 $\mathbb{R}^n$（$n = 262,144$）中的一个高维向量 $x$！

#### 1.1 标准基（Pixel Basis）的致命缺陷
在最朴素的表示法中，我们采用**标准像素基** $p_1, p_2, \dots, p_n$：
$$
x = x_1 p_1 + x_2 p_2 + \cdots + x_n p_n
$$
其中基向量 $p_i$ 在第 $i$ 个像素处为 1，在其余所有像素处全为 0。

在标准像素基下进行存储与传输：
- 如果一张画面大部分区域是平滑的（如黑板、天空或墙壁），每一个像素点依然必须完整存储一个 8 位数值；
- 如果我们试图通过“丢弃一部分分量”来压缩数据，图像上就会出现黑色的空洞！
- **结论**：标准像素基完全无法实现数据压缩！

![数字图像向量化建模板书：512×512 像素向量与 0-255 灰度值标准基表示](</attachments/obsidian-6f43019e2db8232f13aca357.png>)
*⏱ 时间戳：00:03:40 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:03:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=220)*

---

### 2. 压缩的核心思想：基变换（Change of Basis）

*(参考时间: 00:08:00 · [视频跳转 (P32 00:08:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=480))*

图像压缩的灵魂，就在于**寻找一组新的正交基 $w_1, w_2, \dots, w_n$**，使得图像在这组新基底下的展开系数具有极端的**能量集中性（Energy Compaction）**！

$$
x = c_1 w_1 + c_2 w_2 + \cdots + c_n w_n
$$

在真实世界的图像中，相邻像素之间存在极强的相关性（空间冗余）。经过精心设计的正交变换后：
- 极少数的大系数 $c_k$ 囊括了图像 99% 以上的轮廓与主体能量；
- 绝大多数高频微弱细节系数 $c_k \approx 0$；
- 我们只需设定一个阈值 $\epsilon$，将所有满足 $|c_k| < \epsilon$ 的微小系数**直接置零丢弃**！
- 这就是现代有损图像压缩（Lossy Compression）的根本数学原理。

![图像压缩的基变换思想板书：寻找正交基使信号能量高度集中在少数大系数](</attachments/obsidian-aa7d2ddb565f82e7acf1336e.png>)
*⏱ 时间戳：00:08:30 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:08:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=510)*

---

### 3. 两大著名工业级基底：DCT 与小波（Wavelets）

*(参考时间: 00:13:00 · [视频跳转 (P32 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=780))*

#### 3.1 JPEG 工业标准：离散余弦变换（DCT）
在经典的 JPEG 压缩标准中：
1. 计算机将整幅 $512 \times 512$ 图像切分成无数个独立的 $8 \times 8$ 像素子块（每个小块维数 $n = 64$）；
2. 对每个 $8 \times 8$ 子块，采用**离散余弦变换（Discrete Cosine Transform，DCT）**基；
3. DCT 基由不同频率的余弦波采样构成，第一个基向量代表块内平均亮度（DC 分量），其余代表由低到高的频域起伏（AC 分量）；
4. 人眼对超高频微小起伏不敏感，大幅量化丢弃高频系数，即可在 20:1 的压缩比下依然保持高保真视觉效果！

![JPEG 标准分块与余弦变换（DCT）板书：8×8 图像块与离散余弦正交基](</attachments/obsidian-fe96864da8cedcd8351d5889.png>)
*⏱ 时间戳：00:13:30 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=810)*

#### 3.2 现代多尺度小波基（Haar Wavelets）
*(参考时间: 00:17:00 · [视频跳转 (P32 00:17:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1020))*

DCT 的缺点是在极端压缩下会出现“马赛克方块效应”。新一代 JPEG 2000 标准引入了**小波基（Wavelets）**。
以最基础的 Haar 小波为例，考虑一维信号 $n=8$：
- **全局均值分量（DC）**：$\begin{bmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \end{bmatrix}^T$
- **宏观大尺度差分**：前半部分为正，后半部分为负：$\begin{bmatrix} 1 & 1 & 1 & 1 & -1 & -1 & -1 & -1 \end{bmatrix}^T$
- **中尺度局部差分**：分别只在前半段和后半段起伏：
  $\begin{bmatrix} 1 & 1 & -1 & -1 & 0 & 0 & 0 & 0 \end{bmatrix}^T$ 与 $\begin{bmatrix} 0 & 0 & 0 & 0 & 1 & 1 & -1 & -1 \end{bmatrix}^T$
- **微观局部微差**：相邻两像素差分：
  $\begin{bmatrix} 1 & -1 & 0 & 0 & 0 & 0 & 0 & 0 \end{bmatrix}^T$ 等。

小波基既具备**频域分辨力**，又具备**时域/空间局部定位能力**！

![小波基（Wavelet Basis）构造板书：Haar 小波从全局均值到局部差分的多尺度分解](</attachments/obsidian-8d29d4b79a9ddd34a10379f6.png>)
*⏱ 时间戳：00:17:30 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:17:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1050)*

整个小波基向量天然保持相互正交，形成正交小波变换矩阵 $W$。

![8×8 小波变换矩阵板书：全 1 均值向量与各级正负 1 局部差分正交基向量](</attachments/obsidian-6dc6d5ad5dc4153fb94f481b.png>)
*⏱ 时间戳：00:22:20 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:22:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1340)*

#### 3.3 阈值量化与数据重建
经过基变换 $c = W^{-1} x$，计算机对系数向量 $c$ 进行阈值截断（Thresholding）与熵编码，实现数十倍甚至上百倍的无缝压缩。

![有损压缩与量化阈值板书：丢弃微小系数的高比例压缩与高质量重建](</attachments/obsidian-c59115ebd9d547b4ac18c743.png>)
*⏱ 时间戳：00:27:30 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:27:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1650)*

---

### 4. 向量基变换的通用代数公式

*(参考时间: 00:32:00 · [视频跳转 (P32 00:32:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1920))*

现在，我们将图像压缩的具体工程提升为纯粹的线性代数抽象。
假设空间中有两组基：
- 旧基底 $\mathcal{V} = \{v_1, \dots, v_n\}$，记矩阵 $V = \begin{bmatrix} v_1 & \cdots & v_n \end{bmatrix}$；
- 新基底 $\mathcal{W} = \{w_1, \dots, w_n\}$，记矩阵 $W = \begin{bmatrix} w_1 & \cdots & w_n \end{bmatrix}$。

同一个几何向量 $x$，用两组基分别展开：
$$
x = V c_{\text{old}} = W c_{\text{new}}
$$
在两边同时左乘 $W^{-1}$：
$$
\boxed{c_{\text{new}} = (W^{-1} V) c_{\text{old}} = M c_{\text{old}}}
$$
其中矩阵 $M = W^{-1} V$ 称为**基变换过渡矩阵（Change of Basis Matrix）**。
特别地，当旧基是标准基时（$V = I$），新坐标就是 $c_{\text{new}} = W^{-1} x$！

![向量基变换公式板书：从旧坐标到新坐标的基变换过渡矩阵 c_new = W⁻¹ x](</attachments/obsidian-45fcb6f79755ba23381b8e02.png>)
*⏱ 时间戳：00:32:40 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:32:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1960)*

---

### 5. 线性变换的基变换：$B = M^{-1} A M$ 的真谛

*(参考时间: 00:38:00 · [视频跳转 (P32 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2280))*

如果一个几何线性变换 $T: V \to V$：
- 在旧基底 $V$ 下的矩阵表示是 $A$；
- 在新基底 $W$ 下的矩阵表示是 $B$。

$A$ 与 $B$ 之间存在怎样的必然联系？
考虑将新坐标变换三步走：
1. 先用 $M$ 将新基坐标变换回旧基坐标：$c_{\text{old}} = M c_{\text{new}}$；
2. 在旧基下应用矩阵 $A$ 实施变换：$y_{\text{old}} = A c_{\text{old}} = A M c_{\text{new}}$；
3. 再用 $M^{-1}$ 将结果坐标转换回新基坐标：$y_{\text{new}} = M^{-1} y_{\text{old}} = (M^{-1} A M) c_{\text{new}}$！

因此，新基下的矩阵 $B$ 必然等于：
$$
\boxed{B = M^{-1} A M}
$$

这彻底揭示了第 28 讲中**相似矩阵的真正物理与几何意义**：
**所有相似的矩阵，全都是同一个线性变换在不同坐标基下的投影化身！**

![线性变换在不同基下的矩阵表示板书：B = M⁻¹ A M 揭示相似矩阵几何真谛](</attachments/obsidian-4ff2e13a047640d3e177e1d2.png>)
*⏱ 时间戳：00:38:20 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:38:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2300)*

---

### 6. 输入基与输出基解耦：迈向奇异值分解（SVD）

*(参考时间: 00:43:00 · [视频跳转 (P32 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2580))*

如果输入空间与输出空间采用不同的基底：
- 输入基由过渡矩阵 $M$ 变换；
- 输出基由过渡矩阵 $N$ 变换。

则变换矩阵的广义相似公式化为：
$$
\boxed{B = N^{-1} A M}
$$

**线性代数的终极和谐**：
- 如果 $A$ 是方阵，且我们只允许选**一组基**（$N = M$），最完美的基底是**特征向量基 $S$**，它能让矩阵对角化为 $S^{-1} A S = \Lambda$！
- 如果 $A$ 是长方阵，或者我们允许输入和输出选择**两组不同的标准正交基**（$M = V, N = U$），最完美的基底正是**奇异向量基**：
  $$
  \boxed{U^{-1} A V = U^T A V = \Sigma}
  $$
  这丝毫不差地就是奇异值分解（SVD）！

![输入基与输出基解耦板书：B = N⁻¹ A M 与奇异值分解 SVD 的完美对应 Uᵀ A V = Σ](</attachments/obsidian-ab966c2f53de8a47ca9e5e97.png>)
*⏱ 时间戳：00:43:50 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:43:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2630)*

![终极基底总结板书：方阵最优基为特征向量基，长方阵最优基为 SVD 奇异向量基](</attachments/obsidian-6ef8daaad2ff8de1156626b4.png>)
*⏱ 时间戳：00:48:30 · 📷 板书截图 · [在 B 站观看对应片段 (P32 00:48:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2910)*


---


<a id="lec-33"></a>
## 第 32 讲：第三次测验总复习（Quiz 3 Review）

> 📺 **视频回链**：[B 站第 33 P：第三次测验总复习](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33)（⏱ 46分57秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-32-quiz-3-review/)  
> 💡 **核心精要**：三大矩阵谱特性全景（对称/反对称/正交）、微分方程组稳定性、三阶参数矩阵正定性与黄金分割、SVD 计算易错符号对齐。

---

### 1. 第三次测验考点大盘点：三大经典矩阵谱全景

*(参考时间: 00:03:00 · [视频跳转 (P33 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=180))*

第三次测验全面考察特征值、对角化、微分方程系统、正定性与奇异值分解。
Strang 教授开门见山，首先对本模块最核心的三大矩阵类别进行了全景横向对比：

| 矩阵类型 | 定义代数条件 | 特征值谱特性 | 特征向量正交性 | 谱分解公式 |
| :--- | :--- | :--- | :--- | :--- |
| **实对称矩阵（Symmetric）** | $A^T = A$ | **全部为纯实数**（$\lambda_i \in \mathbb{R}$） | 互相垂直（正交） | $A = Q \Lambda Q^T$ |
| **反对称矩阵（Skew-Symmetric）** | $A^T = -A$ | **全部为纯虚数或零**（$\lambda = i \omega$） | 互相垂直（复正交） | $A = U \Lambda U^H$ |
| **正交矩阵（Orthogonal）** | $Q^T Q = I$ | **模长恒等于 1**（$|\lambda| = 1$） | 互相垂直（酉正交） | $Q = U \Lambda U^H$ |

这三大类矩阵构成了线性代数谱理论的骨架，也是期中与期末测验必考的基础题眼。

![三大矩阵谱性质全景对比板书：实对称、反对称与正交矩阵特征值与特征向量](</attachments/obsidian-6895a4cf0eede7c892deb420.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=210)*

---

### 2. 题型一：一阶线性常微分方程组系统

*(参考时间: 00:07:00 · [视频跳转 (P33 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=420))*

考察常系数微分方程组：
$$
\frac{du}{dt} = A u, \quad u(0) = u_0
$$

#### 2.1 解的结构与稳定性判据
设矩阵 $A$ 拥有特征值 $\lambda_1, \lambda_2$ 及对应特征向量 $x_1, x_2$。
初值向量分解为特征向量的线性组合：$u_0 = c_1 x_1 + c_2 x_2$。
则系统在任意时刻的精确解析解为：
$$
\boxed{u(t) = c_1 e^{\lambda_1 t} x_1 + c_2 e^{\lambda_2 t} x_2}
$$

**稳定性判别准则（Stability）**：
- 系统渐近稳定（当 $t \to \infty$ 时，$u(t) \to \mathbf{0}$）的**充要条件**是：**矩阵 $A$ 的所有特征值的实部均为严格负数**：
  $$
  \text{Re}(\lambda_i) < 0 \quad (\forall i)
  $$
- 对于 $2 \times 2$ 矩阵，等价于：
  1. $\text{tr}(A) = \lambda_1 + \lambda_2 < 0$；
  2. $\det(A) = \lambda_1 \lambda_2 > 0$。

![微分方程组求解题型板书：du/dt = Au 的通解展开与稳定性判据 Re(λ) < 0](</attachments/obsidian-7aa95c6b6792fdc3cd6edad9.png>)
*⏱ 时间戳：00:07:30 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=450)*

#### 2.2 正规矩阵（Normal Matrices）概念拓展
*(参考时间: 00:13:00 · [视频跳转 (P33 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=780))*

何种矩阵必定拥有整套正交的特征向量（即使不是对称阵）？
定理：当且仅当矩阵满足 $A A^T = A^T A$（复空间中 $A A^H = A^H A$）时，矩阵称为**正规矩阵（Normal Matrix）**，它必定可以进行酉对角化！

![正规矩阵与酉对角化板书：AAᵀ = AᵀA 充要条件与复内积酉正交特征基](</attachments/obsidian-77a24131d51b59722ef7c0c5.png>)
*⏱ 时间戳：00:13:30 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=810)*

---

### 3. 题型二：三阶对称参数矩阵正定性判别

*(参考时间: 00:18:00 · [视频跳转 (P33 00:18:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1080))*

**测验原题实战**：
设矩阵 $A$ 含有未知参数 $c$：
$$
A = \begin{bmatrix}
1 & 1 & 0 \\
1 & c & 1 \\
0 & 1 & c
\end{bmatrix}
$$
求参数 $c$ 为何值时，矩阵 $A$ 是严格正定的？

#### 3.1 顺序主子式判定法（Leading Principal Minors）
计算三个左上角子方阵的行列式：
1. 1 阶主子式：
   $$
   D_1 = |1| = 1 > 0 \quad (\checkmark)
   $$
2. 2 阶主子式：
   $$
   D_2 = \begin{vmatrix} 1 & 1 \\ 1 & c \end{vmatrix} = c - 1 > 0 \implies \boxed{c > 1}
   $$
3. 3 阶主子式（整个矩阵行列式）：
   按第一行展开：
   $$
   D_3 = \det(A) = 1 \begin{vmatrix} c & 1 \\ 1 & c \end{vmatrix} - 1 \begin{vmatrix} 1 & 1 \\ 0 & c \end{vmatrix} = (c^2 - 1) - c = c^2 - c - 1
   $$
   令 $D_3 > 0$：
   方程 $c^2 - c - 1 = 0$ 的根为黄金分割数 $\frac{1 \pm \sqrt{5}}{2}$。
   因为 $c > 1$，取正根：
   $$
   \boxed{c > \frac{1 + \sqrt{5}}{2} \approx 1.618}
   $$

只有当 $c > 1.618$ 时，矩阵 $A$ 才是严格正定的！

![三阶对称参数矩阵正定性板书：顺序主子式判据与黄金分割极值条件 c > (1+√5)/2](</attachments/obsidian-2bedc41b0948c00030026205.png>)
*⏱ 时间戳：00:18:20 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:18:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1100)*

#### 3.2 高斯消元主元法与完全平方检验
*(参考时间: 00:23:00 · [视频跳转 (P33 00:23:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1380))*

如果通过消元法求主元：
- 第 1 个主元：$d_1 = 1$；
- 第 2 个主元：$d_2 = c - 1$；
- 第 3 个主元：$d_3 = c - \frac{1}{c - 1} = \frac{c^2 - c - 1}{c - 1}$。
要求三个主元全部严格大于 0，导出的结论丝毫不差完全一致！
对应的二次型写成完全平方和：
$$
x^T A x = 1(x_1 + x_2)^2 + (c - 1)\left(x_2 + \frac{1}{c-1}x_3\right)^2 + \frac{c^2 - c - 1}{c-1} x_3^2
$$

![高斯消元主元法与完全平方配方法板书：验证 A = LDLᵀ 主元恒正与二次型极小值](</attachments/obsidian-e010f2b08258aed6b3821ee5.png>)
*⏱ 时间戳：00:23:40 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:23:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1420)*

---

### 4. 题型三：奇异值分解（SVD）计算易错陷阱

*(参考时间: 00:28:00 · [视频跳转 (P33 00:28:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1680))*

测验中计算 SVD $A = U \Sigma V^T$ 最容易扣分的环节在于**正负号对应（Sign Alignment）**！

#### 4.1 对称矩阵的 SVD 陷阱
设 $A$ 是实对称矩阵，其特征值分解为 $A = Q \Lambda Q^T$。
这与 SVD $A = U \Sigma V^T$ 是一样的吗？
**关键区别：奇异值必须 $\sigma_i \ge 0$ 恒非负！**
- 如果 $A$ 有负特征值（如 $\lambda = -3$），在 SVD 中对应的奇异值是 $|\lambda| = +3$！
- 此时为了保证 $A v_i = \sigma_i u_i$，左奇异向量 $u_i$ 必须与右奇异向量 $v_i$ 相差一个负号：$u_i = -v_i$！

![奇异值分解 SVD 计算规范板书：对称矩阵的 SVD 与特征分解对比（U 与 V 的正负号对齐）](</attachments/obsidian-915467946d068b56818eee86.png>)
*⏱ 时间戳：00:28:30 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:28:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1710)*

#### 4.2 秩 1 矩阵 SVD
设 $A = u v^T$（其中 $\|u\| = 1, \|v\| = 1$）。
这其实已经是一个现成的 SVD！
$$
A = \begin{bmatrix} u & u_2 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} v^T \\ v_2^T \end{bmatrix}
$$
其唯一的非零奇异值为 $\sigma_1 = 1$，其余奇异值全为 0。

![秩 1 投影矩阵 SVD 分解板书：A = u vᵀ 形式矩阵的奇异值与左/右奇异向量](</attachments/obsidian-5c1275569fa1c83fe89e6925.png>)
*⏱ 时间戳：00:33:40 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:33:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2020)*

---

### 5. 核心考点真伪命题大辨析（True / False）

*(参考时间: 00:38:00 · [视频跳转 (P33 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2280))*

#### 5.1 命题 1：正交矩阵是否必然可以对角化？
**判断：正确（在复数域 $\mathbb{C}$ 内）**！
因为正交矩阵满足 $Q^T Q = I \implies Q Q^T = Q^T Q$，它是正规矩阵，必定拥有 $n$ 个相互正交的复特征向量，因此必定可以酉对角化。

#### 5.2 命题 2：若 $A$ 是正定矩阵，则 $A^{-1}$ 也是正定的吗？
**判断：正确！**
$A$ 的特征值 $\lambda_i > 0$，其逆矩阵的特征值为 $\frac{1}{\lambda_i} > 0$。对称正方阵特征值全正 $\iff$ 正定！

![考点辨析真伪命题 1：正交矩阵的可对角化性与正定矩阵逆矩阵正定性证明](</attachments/obsidian-07bd56bd9d1808375eabee29.png>)
*⏱ 时间戳：00:38:20 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:38:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2300)*

#### 5.3 命题 3：特征值相同的两个矩阵必然相似吗？
**判断：错误！**
经典反例：
$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} \quad \text{与} \quad B = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$
两者的特征值全部都是 $\lambda_1 = 2, \lambda_2 = 2$。
但 $A$ 是标量阵，其相似家族只有它自己；而 $B$ 缺少特征向量，无法对角化。两者绝不相似！

![考点辨析真伪命题 2：特征值相同但不可对角化的相似矩阵判定反例](</attachments/obsidian-d20c25e066919e29589b3a67.png>)
*⏱ 时间戳：00:42:30 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:42:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2550)*

#### 5.4 命题 4：投影阵与反射阵的谱特征
- **投影矩阵（$P^2 = P$）**：特征值只能是 $\lambda = 1$ 或 $\lambda = 0$；
- **反射矩阵（$R^2 = I$）**：特征值只能是 $\lambda = 1$ 或 $\lambda = -1$！

![投影矩阵与反射矩阵谱特征板书：P²=P 导出 λ=0,1 与 R²=I 导出 λ=±1](</attachments/obsidian-9cd5de59faccdd2bf4ea08be.png>)
*⏱ 时间戳：00:46:40 · 📷 板书截图 · [在 B 站观看对应片段 (P33 00:46:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2800)*


---


<a id="lec-34"></a>
## 第 33 讲：左右逆与伪逆（Left and Right Inverses; Pseudoinverse）

> 📺 **视频回链**：[B 站第 34 P：左右逆与伪逆](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34)（⏱ 41分42秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-33-left-and-right-inverses-pseudoinverse/)  
> 💡 **核心精要**：列满秩左逆 A_left⁻¹=(AᵀA)⁻¹Aᵀ、行满秩右逆 A_right⁻¹=Aᵀ(AAᵀ)⁻¹、行空间到列空间双射定理、摩尔-彭罗斯伪逆 A⁺=VΣ⁺Uᵀ。

---

### 1. 四大基本子空间与逆矩阵的全景分类

*(参考时间: 00:03:00 · [视频跳转 (P34 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=180))*

在经典初等线性代数中，我们只对**方阵**定义逆矩阵：当且仅当 $A$ 为 $n \times n$ 且秩 $r = n$ 时，$A^{-1} A = A A^{-1} = I$。此时两边的零空间都退化为零向量 $N(A) = \{\mathbf{0}\}, N(A^T) = \{\mathbf{0}\}$。

但现实世界中绝大多数矩阵都是长方形的（$m \ne n$）或者奇异的（$r < \min(m, n)$）。我们能否将“逆”的概念推广到任意矩阵？
Strang 教授根据矩阵的秩 $r$ 与尺寸 $m, n$，给出了全景式的分类谱系：

1. **双边逆（Two-Sided Inverse）**：$r = m = n$（方阵满秩），存在唯一逆矩阵 $A^{-1}$；
2. **左逆（Left Inverse）**：$r = n < m$（列满秩，高瘦矩阵），存在左逆使得 $A_{\text{left}}^{-1} A = I_n$；
3. **右逆（Right Inverse）**：$r = m < n$（行满秩，矮胖矩阵），存在右逆使得 $A A_{\text{right}}^{-1} = I_m$；
4. **伪逆（Pseudoinverse $A^+$）**：$r < m$ 且 $r < n$（一般秩亏损矩阵），通过正交子空间限制构造摩尔-彭罗斯伪逆。

![四大基本子空间与可逆性条件板书：方阵可逆 r=m=n 与长方矩阵左右逆引入](</attachments/obsidian-4ad81ef978584704aa06a0c0.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=210)*

---

### 2. 列满秩与左逆矩阵（Left Inverse）

*(参考时间: 00:07:00 · [视频跳转 (P34 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=420))*

设 $A$ 是一个 $m \times n$ 的矩阵，且各列线性无关（$r = n < m$）：
- 零空间 $N(A) = \{\mathbf{0}\}$，这意味着 $Ax = b$ 如果有解，解必定是**唯一**的；
- 但因为行数多于列数，方程数大于未知数数，通常无解；
- 由于各列线性无关，对称方阵 $A^T A$ 是 $n \times n$ **严格可逆**的！

#### 2.1 左逆公式的推导
我们在 $A$ 的左侧乘以 $(A^T A)^{-1} A^T$：
$$
\left( (A^T A)^{-1} A^T \right) A = (A^T A)^{-1} (A^T A) = I_n
$$
因此，标准的**左逆矩阵**为：
$$
\boxed{A_{\text{left}}^{-1} = (A^T A)^{-1} A^T}
$$
它是一个 $n \times m$ 的矩阵，满足：
$$
A_{\text{left}}^{-1} A = I_n
$$

![列满秩矩阵与左逆矩阵板书：r=n<m 导出 AᵀA 可逆与左逆公式 A_left⁻¹ = (AᵀA)⁻¹Aᵀ](</attachments/obsidian-3db09eb72fe8df6e341ebaa6.png>)
*⏱ 时间戳：00:07:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=450)*

#### 2.2 颠倒次序乘法：投射回列空间
如果我们把乘法次序反过来，计算 $A A_{\text{left}}^{-1}$：
$$
A A_{\text{left}}^{-1} = A (A^T A)^{-1} A^T = P
$$
它绝不是单位阵 $I_m$，而正是我们极其熟悉的**向列空间 $C(A)$ 的正交投影矩阵 $P$**！
这完美解释了最小二乘法：$\hat{x} = A_{\text{left}}^{-1} b$ 给出最小二乘解，而 $A \hat{x} = P b = p$ 正是 $b$ 在列空间中的最佳投影！

![左逆相乘的投影本质板书：A_left⁻¹ A = I_n 而 A A_left⁻¹ = P 为列空间投影矩阵](</attachments/obsidian-ef74b64cef84e1e2dbef3ac4.png>)
*⏱ 时间戳：00:11:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:11:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=690)*

---

### 3. 行满秩与右逆矩阵（Right Inverse）

*(参考时间: 00:15:00 · [视频跳转 (P34 00:15:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=900))*

设 $A$ 是一个 $m \times n$ 的矩阵，且各行线性无关（$r = m < n$）：
- 未知数多于方程数（欠定方程组），对任意右端项 $b$，$Ax = b$ 永远有解，且存在无穷多个解；
- 左零空间退化为零 $N(A^T) = \{\mathbf{0}\}$；
- 对称方阵 $A A^T$ 是 $m \times m$ **严格可逆**的！

#### 3.1 右逆公式的推导
我们在 $A$ 的右侧乘以 $A^T (A A^T)^{-1}$：
$$
A \left( A^T (A A^T)^{-1} \right) = (A A^T) (A A^T)^{-1} = I_m
$$
因此，标准的**右逆矩阵**为：
$$
\boxed{A_{\text{right}}^{-1} = A^T (A A^T)^{-1}}
$$
它是一个 $n \times m$ 的矩阵，满足：
$$
A A_{\text{right}}^{-1} = I_m
$$

![行满秩矩阵与右逆矩阵板书：r=m<n 导出 AAᵀ 可逆与右逆公式 A_right⁻¹ = Aᵀ(AAᵀ)⁻¹](</attachments/obsidian-030fc53a3ec6cd780537c729.png>)
*⏱ 时间戳：00:15:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:15:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=930)*

颠倒相乘次序：
$$
A_{\text{right}}^{-1} A = A^T (A A^T)^{-1} A = P_{\text{row}}
$$
它是向行空间 $C(A^T)$ 的正交投影矩阵！
解 $x = A_{\text{right}}^{-1} b$ 正是无穷多个解中**位于行空间内、欧氏范数最小的最优特解**！

![右逆相乘的投影本质板书：A A_right⁻¹ = I_m 而 A_right⁻¹ A = P 为行空间投影矩阵](</attachments/obsidian-cf4cb4f14378c224444e1c76.png>)
*⏱ 时间戳：00:20:20 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:20:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1220)*

---

### 4. 任意矩阵的终极解答：摩尔-彭罗斯伪逆（Pseudoinverse）

*(参考时间: 00:24:00 · [视频跳转 (P34 00:24:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1440))*

当矩阵秩 $r < m$ 且 $r < n$ 时，左右逆都不复存在：
- $N(A)$ 非零，破坏了单射（不同输入可能映射到同一个零输出）；
- $N(A^T)$ 非零，破坏了满射（并非任意 $b$ 都在列空间内）。

![一般退化矩阵的核心矛盾板书：零空间破坏一一对应与左零空间阻碍解的存在性](</attachments/obsidian-58bd6d0eb883d07884250f9a.png>)
*⏱ 时间戳：00:24:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:24:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1470)*

#### 4.1 行空间到列空间的一一对应定理
根据线性代数基本定理：
- 任意向量 $x \in \mathbb{R}^n$ 都可以唯一正交分解为行空间分量与零空间分量：$x = x_{\text{row}} + x_{\text{null}}$；
- $A x_{\text{null}} = \mathbf{0}$，因此 $A x = A x_{\text{row}}$；
- 当把映射**严格限制在行空间 $C(A^T)$ 与列空间 $C(A)$ 之间时**，矩阵 $A$ 是一个完完全全的**双射（一一对应且满射）**！
每一个行空间向量 $x \in C(A^T)$ 都有唯一对应的列空间向量 $y = A x \in C(A)$，反之亦然！

![行空间到列空间的一一映射定理板书：限制在行空间与列空间时 A 严格可逆](</attachments/obsidian-a2c222feb6b4325424ae4db0.png>)
*⏱ 时间戳：00:28:40 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:28:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1720)*

#### 4.2 伪逆 $A^+$ 的几何定义
伪逆矩阵 $A^+$（大小为 $n \times m$）定义为：
1. 对于任意列空间向量 $y \in C(A)$，$A^+ y = x$（其中 $x \in C(A^T)$ 且 $A x = y$）；
2. 对于任意左零空间向量 $y \in N(A^T)$，$A^+ y = \mathbf{0}$！

![摩尔-彭罗斯伪逆（Pseudoinverse）定义板书：A⁺ 将列空间映回行空间且零空间映为零](</attachments/obsidian-8be284b897bda2e608682754.png>)
*⏱ 时间戳：00:33:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:33:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2010)*

---

### 5. 基于 SVD 的伪逆显式构造公式

*(参考时间: 00:36:00 · [视频跳转 (P34 00:36:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2160))*

如何高效计算伪逆 $A^+$？
**奇异值分解（SVD）给出了终极显式解！**

已知 $A = U \Sigma V^T$。求伪逆只需颠倒次序并对奇异值求倒数：
$$
\boxed{A^+ = V \Sigma^+ U^T}
$$
其中对角矩阵 $\Sigma^+$ 的构造极其优雅直观：
- 对所有非零奇异值 $\sigma_i > 0$，取其倒数 $\frac{1}{\sigma_i}$；
- 对所有零元素，继续保留为 0！
$$
\Sigma^+ = \begin{bmatrix}
1/\sigma_1 & & & & \\
& \ddots & & & \\
& & 1/\sigma_r & & \\
& & & 0 & \\
& & & & \ddots
\end{bmatrix}_{n \times m}
$$

![利用 SVD 构造伪逆公式板书：A = UΣVᵀ 导出 A⁺ = VΣ⁺Uᵀ，非零奇异值取倒数](</attachments/obsidian-babeb03b25eadfe98d32eea2.png>)
*⏱ 时间戳：00:36:40 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:36:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2200)*

#### 5.1 伪逆的普适性质
- 若 $A$ 可逆，则 $A^+ = A^{-1}$；
- 若 $A$ 列满秩，则 $A^+ = (A^T A)^{-1} A^T$（左逆）；
- 若 $A$ 行满秩，则 $A^+ = A^T (A A^T)^{-1}$（右逆）；
- 对任意不相容方程组 $Ax = b$，$x^+ = A^+ b$ 永远是**最小二乘误差最小、且自身长度范数最小的唯一最佳解**！

![最小二乘最小范数解与终极统一板书：x⁺ = A⁺b 给出最优最短解，四大子空间全貌收官](</attachments/obsidian-cc7fe31bd05d2db81ca449b6.png>)
*⏱ 时间戳：00:40:30 · 📷 板书截图 · [在 B 站观看对应片段 (P34 00:40:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2430)*


---


<a id="lec-35"></a>
## 第 34 讲：期末总结与全书精要（Final Course Review）

> 📺 **视频回链**：[B 站第 35 P：期末总结与全书精要](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35)（⏱ 43分12秒 · 10 截图）  
> 📖 **官方材料**：[MIT OCW 对应讲义与总结](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-34-final-course-review/)  
> 💡 **核心精要**：Fredholm 抉择定理、逆向构造子空间矩阵、动力系统稳态收敛性、全书五大矩阵分解集大成（LU/QR/SΛS⁻¹/QΛQᵀ/UΣVᵀ）、全课总结。

---

### 1. 全课程宏伟全景回顾：从 $Ax = b$ 到奇异值分解

*(参考时间: 00:03:00 · [视频跳转 (P35 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=180))*

这是 MIT 18.06 线性代数全课程的最后一堂课。
回顾整学期的旅程，我们从最简单的二元一次线性方程组出发，一路翻越了高斯消元、四大基本子空间、正交投影与最小二乘、行列式、特征值与特征向量、常微分方程系统、对称矩阵正定性，最终登顶于奇异值分解（SVD）。

Strang 教授在本讲中将全书的所有核心脉络融会贯通，系统梳理了线性代数的终极思想体系。

#### 1.1 方程组可解性定理
对于任意 $m \times n$ 线性系统 $Ax = b$：
- 是否有解取决于右端向量 $b$ 是否落入矩阵的**列空间 $C(A)$**；
- 几何正交补视角：根据基本定理第一部分，$C(A) \perp N(A^T)$；
- 因此：**$Ax = b$ 存在解的充要条件是 $b$ 垂直于 $A^T$ 的零空间（左零空间）**！
$$
\boxed{Ax = b \text{ 有解} \iff y^T b = 0 \quad (\forall y \in N(A^T))}
$$
这就是应用数学中极负盛名的 **Fredholm 抉择定理（Fredholm Alternative）**。

![期末总复习大纲板书：方程组可解性条件 Ax=b 与四个基本子空间正交补](</attachments/obsidian-055456d56f008dfa81314d18.png>)
*⏱ 时间戳：00:03:30 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=210)*

---

### 2. 核心题型一：矩阵性质概念辨析与逆向构造

*(参考时间: 00:07:00 · [视频跳转 (P35 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=420))*

在期末考试中，最考验功底的是概念辨析题：

1. **若 $A$ 是方阵且特征值全非零，则 $A$ 必然可逆**？
   **正确！** 因为 $\det(A) = \prod \lambda_i \ne 0$。
2. **若 $A$ 的秩小于未知数个数（$r < n$），则 $Ax = \mathbf{0}$ 必有非零解**？
   **正确！** 因为自由变量数等于 $n - r > 0$，零空间维数大于 0。
3. **若 $A$ 满足 $A^2 = \mathbf{0}$，则其特征值只能全为零**？
   **正确！** 若 $Ax = \lambda x$，则 $A^2 x = \lambda^2 x = \mathbf{0} \implies \lambda^2 = 0 \implies \lambda = 0$。
4. **$A$ 与 $A^T$ 拥有完全相同的特征值与特征向量**？
   **半对半错！** 拥有完全相同的特征值（因为 $\det(A^T - \lambda I) = \det(A - \lambda I)$），但特征向量通常完全不同！

![核心题型 1：矩阵性质真伪辨析（秩、行列式、可逆性与零空间维数）](</attachments/obsidian-c9405f17656c5c4770176dc9.png>)
*⏱ 时间戳：00:07:30 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=450)*

#### 2.1 逆向构造子空间矩阵
*(参考时间: 00:12:00 · [视频跳转 (P35 00:12:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=720))*

如何根据给定的子空间逆向构造矩阵？
例如：构造一个 $3 \times 3$ 矩阵，使其列空间包含向量 $\begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}$，而零空间包含向量 $\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$。
通过利用基本定理正交补关系（行向量必须与零空间向量垂直），可以极其优雅地反推出目标矩阵。

![构造子空间特定矩阵板书：指定列空间与零空间的逆向构造法](</attachments/obsidian-b7dba349d2654070a60a3a72.png>)
*⏱ 时间戳：00:12:40 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:12:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=760)*

![左零空间与 Fredholm 抉择定理板书：Ax=b 有解当且仅当 b 垂直于 N(Aᵀ)](</attachments/obsidian-305539f28903b570ddbabe87.png>)
*⏱ 时间戳：00:17:20 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:17:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1040)*

---

### 3. 核心题型二：正交投影与最小二乘（Least Squares）

*(参考时间: 00:22:00 · [视频跳转 (P35 00:22:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1320))*

当 $Ax = b$ 无解时，我们放弃寻找精确解，转而寻找最小误差解 $\hat{x}$。

1. **正规方程**：
   $$
   (A^T A) \hat{x} = A^T b
   $$
2. **最佳投影向量**：
   $$
   p = A \hat{x} = A (A^T A)^{-1} A^T b = P b
   $$
3. **误差向量的几何本质**：
   $$
   e = b - p = (I - P) b
   $$
   误差向量 $e$ 垂直于列空间中的每一个列向量，因此**误差向量 $e$ 必然落在左零空间 $N(A^T)$ 中**！
   $$
   A^T e = A^T (b - A \hat{x}) = \mathbf{0}
   $$

![投影矩阵与最小二乘板书：误差向量 e = b - p 垂直于列空间的几何投影图景](</attachments/obsidian-a96653cee5a6038b556bb852.png>)
*⏱ 时间戳：00:22:30 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:22:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1350)*

---

### 4. 核心题型三：矩阵幂与动力系统渐近收敛性

*(参考时间: 00:27:00 · [视频跳转 (P35 00:27:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1620))*

考虑差分方程系统：
$$
u_k = A^k u_0
$$
将初值向量用特征向量展开：$u_0 = c_1 x_1 + \dots + c_n x_n$。
则第 $k$ 步的状态为：
$$
u_k = c_1 \lambda_1^k x_1 + c_2 \lambda_2^k x_2 + \cdots + c_n \lambda_n^k x_n
$$

**三大收敛性判据**：
1. **稳定趋近于零（$u_k \to \mathbf{0}$）**：所有特征值模长均严格小于 1（$|\lambda_i| < 1$）；
2. **收敛到稳态分布（Steady State）**：主特征值 $\lambda_1 = 1$，其余特征值模长严格小于 1（$|\lambda_i| < 1$），此时 $u_k \to c_1 x_1$（马尔可夫矩阵典型特征）；
3. **发散到无穷（Blow up）**：至少存在一个特征值 $|\lambda| > 1$。

![矩阵幂与马尔可夫稳态板书：u_k = Aᵏ u₀ 当 k→∞ 时的收敛性与 λ=1 稳态分布](</attachments/obsidian-5fadc2c5be95c1760f110de5.png>)
*⏱ 时间戳：00:27:20 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:27:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1640)*

---

### 5. 全书五大矩阵分解集大成（The Five Great Factorizations）

*(参考时间: 00:32:00 · [视频跳转 (P35 00:32:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1920))*

整个 18.06 课程由五大矩阵分解串联而成，它们是所有科学计算与工程建模的引擎：

| 分解名称 | 表达式 | 适用矩阵范围 | 核心数学思想 | 主要工程应用 |
| :--- | :--- | :--- | :--- | :--- |
| **LU 分解** | $A = L U$ | 方阵（高斯消元无需换行） | 阶梯化三角分解，高斯消元乘数法 | 解方程组、求逆矩阵 |
| **QR 分解** | $A = Q R$ | 任意长方矩阵（列满秩） | Gram-Schmidt 正交化，标准正交基 | 最小二乘求解、QR 特征值迭代 |
| **特征分解** | $A = S \Lambda S^{-1}$ | 拥有 $n$ 个独立特征向量的方阵 | 相似对角化，特征向量解耦动力系统 | 矩阵幂 $A^k$、常微分方程组 $e^{At}$ |
| **谱分解定理** | $A = Q \Lambda Q^T$ | 实对称矩阵（$A = A^T$） | 纯实数谱，正交特征基，能量二次型 | 极值判别、主轴定理、力学振动模态 |
| **奇异值分解** | $A = U \Sigma V^T$ | **任意 $m \times n$ 矩阵！** | 双边正交基对齐，定义域到值域的伸缩 | 图像压缩、推荐算法、PCA、伪逆求解 |

![全书五大矩阵分解集大成板书：LU、QR、SΛS⁻¹、QΛQᵀ、UΣVᵀ 逻辑演进](</attachments/obsidian-2ea2a97d4de713ad28782089.png>)
*⏱ 时间戳：00:32:10 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:32:10)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1930)*

![正规矩阵与正交特征向量族板书：AAᵀ = AᵀA 统领对称、反对称与正交矩阵](</attachments/obsidian-8676cfe5dbefb4ac714a85f5.png>)
*⏱ 时间戳：00:36:30 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:36:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2190)*

---

### 6. SVD 终极全貌与课程结语

*(参考时间: 00:40:00 · [视频跳转 (P35 00:40:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2400))*

SVD 将四大基本子空间在几何上完美对齐：
- 行空间的一组标准正交基 $v_1, \dots, v_r$；
- 零空间的一组标准正交基 $v_{r+1}, \dots, v_n$；
- 列空间的一组标准正交基 $u_1, \dots, u_r$；
- 左零空间的一组标准正交基 $u_{r+1}, \dots, u_m$。

变换关系纯粹到极致：
$$
A v_i = \begin{cases} \sigma_i u_i, & i = 1, \dots, r \\ \mathbf{0}, & i = r+1, \dots, n \end{cases}
$$

![奇异值分解（SVD）终极全貌板书：行空间到列空间的完美正交对齐与子空间全景图](</attachments/obsidian-6a7a4a9c03dc9400c29ba305.png>)
*⏱ 时间戳：00:40:20 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:40:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2420)*

#### 6.1 Strang 教授的全课结语
*(参考时间: 00:43:00 · [视频跳转 (P35 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2580))*

在掌声中，Strang 教授回顾道：
> “线性代数不仅是一门数学课程，它是现代科学、数据科学、人工智能与工程物理的通用语言。掌握了子空间、正交性、谱分解与 SVD，你就拥有了洞察一切高维数据结构的最锐利眼睛。”

MIT 18.06 线性代数视频电子书全集，至此全部圆满收官！

![Strang 教授期末致谢与全课结语板书：21 世纪应用数学的基石——线性代数完结](</attachments/obsidian-75561c8e381405d88e8e2ef8.png>)
*⏱ 时间戳：00:42:50 · 📷 板书截图 · [在 B 站观看对应片段 (P35 00:42:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2570)*


---
