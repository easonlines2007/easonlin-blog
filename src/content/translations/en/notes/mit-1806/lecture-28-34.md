---
kind: notes
source: mit-1806/lecture-28-34
title: "Lectures 28–34: Similarity, Singular Value Decomposition, and Linear
  Transformations"
description: "Lectures 28–34: similar matrices, Jordan form, SVD, linear
  transformations, changes of basis, image compression, pseudoinverses, and the
  final review."
sourceHash: c97e2299955f2fc381204074fba88ebdde21fd4400e8a2837ba5c48383016086
publish: true
translationMethod: machine-assisted
---
> **Lecture** The following is a list of the most common causes of death in children:  
> **The product** VideoBook: Video open source technology and e-books flow waterline  
> **Full size of book** The following are the main topics covered: 35 full-length editions; 5 major knowledge system modules; 357 original high definition tablets; 260 core introduction time frames.  
> **Video source**: [The official full set of Bilibili (BV1ix411f7Yp)](https://www.bilibili.com/video/BV1ix411f7Yp/) · [MIT OpenCourseWare 18.06 (Spring 2010)](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/)  
> **Copyright and licenses**: The text content and formula graphics are compiled and structured by MIT OCW Open Course Materials Translation, instructor Gilbert Strang, following  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)  Knowledge Sharing License Agreement. Full bookshelf clips are taken from the official public lecture video.

---



> 📚 **Module overview**: explores matrix similarities with the standard model of ROR; derives from the loss matrix's final assignment; and derives from any longitudinal matrix' singular value decomposition of the slope at the slope end of the slopes:  $A = U\Sigma V^T$• An in-depth study of the abstractional linear transformation axiom and its matrixization expression under a particular base; explaining base transformations with modern image compression (JPEG DCT with small wave compression); exploring the left and right inverse with Moore-Prosse pseudoinverse  $A^+$ The final sequence of the entire book is a five-matrix breakdown with the fundamental theorem, completing the general review at the end of the book.

---


<a id="lec-29"></a>
## 28th: Matrix similar to the standard model of RH

> 📺 **Video link back**: [B Station 29 P: Matrix similar to the standard model of RH](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29) (⏱ 45m 44s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-28-similar-matrices-and-jordan-form/)  
> 💡 **Key ideas** Similar matrix definitions B=M−1AM, eigenvalue is exactly the same, proof of eigenvector transformation y=M− 1x, loss matrix and Ruler construct theorem.

---

### 1. The curriculum is organized in the following order: $A^T A$  The positive definiteness review

*(reference timestamp: 00:03:00)  [Watch clip (P29 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=180))*

Before entering the core theme of this talk, which is similar to the matrix puzzle, Professor Strang first led us through a review of one of the puzzles left in the 27th lecture: **Any Fill rank Long matrix  $A$  The Front  $A^T A$  It must be strictly positive definite.**.

Let  $A$  It's one.  $m \times n$  The real matrix $m \ge n$ The first is the linearly independent $\text{rank}(A) = n$ (ii) For any nonzero vector  $x \in \mathbb{R}^n$($x \ne \mathbf{0}$ The second type is:
$$
x^T (A^T A) x = (Ax)^T (Ax) = \|Ax\|^2
$$

The length of the vector is always negative, i.e.  $\|Ax\|^2 \ge 0$: 
- If  $\|Ax\|^2 = 0$ And there will be  $Ax = \mathbf{0}$; 
- But because of  $A$  The columns are linearly independent and their null spaces contain only zero vectors.  $N(A) = \{\mathbf{0}\}$; 
- So, what is  $x \ne \mathbf{0}$  When the $Ax \ne \mathbf{0}$ And so,  $\|Ax\|^2 > 0$!

This is a stark proof:
$$
\boxed{x^T (A^T A) x > 0 \quad (\forall x \ne \mathbf{0}) \implies A^T A \text{ 是严格正定对称矩阵}}
$$

![The positive definitematrix characteristics review book: the symmetry of the long-dimensional matrix ATA with the positive semidefinite is strictly proven](</attachments/obsidian-47fb8f79a724d34b31138519.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P29 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=210)*

This is the formal equation in the law of least squares.  $(A^T A) \hat{x} = A^T b$  The only algebraic foundation that can be solved for sure is always there.

![Secondary energy proofing table: xT ATA) x = e = E = Ax e = 0 constants under a nonzero vector](</attachments/obsidian-ce42a43b2327e9e89d98361f.png>)
*⏱ Timestamp: 00:08:30 · 📷 Lecture screenshot · [Watch clip (P29 00:08:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=510)*

---

### 2. Similar matrix (similar matrices) with the matrix family

*(reference timestamp: 00:13:00)  [Watch clip (P29 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=780))*

In the whole of linear algebra, a matrix is not isolated. Many seemingly uncommon matrices are in fact embodied by the same linear transformation under different coordinate systems from a certain point of view.

#### 2.1 Similar strict algebra definition
Let  $A$  and  $B$  It's two.  $n \times n$  The first is the "Front". **The invertiblematrix  $M$** The following is a list of the countries:
$$
\boxed{B = M^{-1} A M}
$$
The report says **The matrix  $A$  With the Matrix  $B$  The same as the similar**.

All matrix similarities make up a family of families:
- If you give a matrix  $A$ The invertiblematrix is the most common type of  $M$  I'm going to try and get the invertible across. $M^{-1} A M$  And then they cleaned it up and  $A$  The same matrix is a large family of all the matrix.

![Introduction to the matrix M with invertible base transformation](</attachments/obsidian-a1c55194f6e339235c33006f.png>)
*⏱ Timestamp: 00:13:30 · 📷 Lecture screenshot · [Watch clip (P29 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=810)*

---

### 3. The core of a matrix is unvariable: the eigenvalue is exactly the same

*(reference timestamp: 00:17:00 )  [Watch clip (P29 00:17:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1020))*

When two matrix are similar, what indelible algebraic nature do they share? 
**The most important conclusion: a similar matrix has exactly the same eigenvalue!**

#### 3.1 Prove: characteristic of polynomial equations
Consider the matrix  $B = M^{-1} A M$  The characteristic equation:
$$
\det(B - \lambda I) = \det(M^{-1} A M - \lambda M^{-1} I M)
$$
Extract the common-factor matrix  $M^{-1}$  and  $M$: 
$$
\det(B - \lambda I) = \det\left( M^{-1} (A - \lambda I) M \right)
$$
The multiplication rules of determinants  $\det(XYZ) = \det(X) \det(Y) \det(Z)$: 
$$
\det(B - \lambda I) = \det(M^{-1}) \cdot \det(A - \lambda I) \cdot \det(M)
$$
The  $\det(M^{-1}) \cdot \det(M) = 1$ The following is a list of the most commonly used terms:
$$
\boxed{\det(B - \lambda I) = \det(A - \lambda I)}
$$
The two are very similar in their polynomial characteristics! **$A$  and  $B$  All eigenvalues and their algebras are identical.**!

![The matrix characteristic equation is similar to the proof table: det (B - λI) = det (M−1 (A - λI).](</attachments/obsidian-b161e237a176a11193fdff15.png>)
*⏱ Timestamp: 00:17:30 · 📷 Lecture screenshot · [Watch clip (P29 00:17:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1050)*

---

### The law of transformation of the eigenvector: $y = M^{-1} x$

*(reference timestamp: 21:00 )  [Watch clip (P29 00:21:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1260))*

Since matrix has exactly the same eigenvalue, are their eigenvectors the same? 
**A: The eigenvector is different, but follows strict invertible mapping relationships!**

Let  $x$  It's the matrix.  $A$  The following is a list of the most common types of eigenvalue:  $\lambda$  The eigenvector is:
$$
A x = \lambda x
$$
Left-multiply both sides by  $M^{-1}$ and the  $A$  and  $x$  The unit array is inserted between  $I = M M^{-1}$: 
$$
M^{-1} A (M M^{-1}) x = \lambda M^{-1} x
$$
The matrix is a set of rules for multiplying by the matrix:
$$
(M^{-1} A M) (M^{-1} x) = \lambda (M^{-1} x)
$$
because  $B = M^{-1} A M$ The order  $y = M^{-1} x$ The above is:
$$
\boxed{B y = \lambda y}
$$

**Conclusion**: 
- If you  $x$  Yes, I did.  $A$  So the eigenvector is a vector.  **$y = M^{-1} x$  It's the same.  $B$  The eigenvector**!
- The eigenvector undergoes a linear coordinate base transformation  $M^{-1}$.

![The eigenvector transformation rulebooks: Ax = λx induces B ((M−1x) = λ(M−1 x), and the eigenvector mapping y = M−1x](</attachments/obsidian-2a9ab05f597ce61005199aa7.png>)
*⏱ Timestamp: 00:21:40 · 📷 Lecture screenshot · [Watch clip (P29 00:21:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1300)*

#### 4.1 Most beautiful family members: the matrix of corners  $\Lambda$
*(reference timestamp: 00:25:00)  [Watch clip (P29 00:25:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1500))*

If the matrix is  $A$  Owned  $n$  The linearly independent eigenvector, which makes the eigenvectors matrix  $S$ The following:  $M = S$ The following:
$$
S^{-1} A S = \Lambda = \begin{bmatrix} \lambda_1 & & \\ & \ddots & \\ & & \lambda_n \end{bmatrix}
$$
In all the  $A$  And in a similar matrix family, **The angle matrix  $\Lambda$  The most simple, the most beautiful, the purest representative.** Diagonalization is essentially **Find the simplest coordinate system of a paired shape in a similar matrix family**.

![Similar matrix family crown book: S−1 A S = Λ position of the angular matrix as the simplest standard type](</attachments/obsidian-9b022bc87551b5aa8143b345.png>)
*⏱ Timestamp: 00:25:30 · 📷 Lecture screenshot · [Watch clip (P29 00:25:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1530)*

---

### 5. Isolation of families and degraded matrix

*(reference timestamp: 00:29:00)  [Watch clip (P29 00:29:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1740))*

If all matrix can find the right angular matrix in a similar family, then it is possible to find the right angle matrix.  $\Lambda$?**No, I'm not!**

#### 5.1 Extreme case 1: a set of measurements of pure quantity
Consider the scale matrix  $4I = \begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$. eigenvalue IS  $\lambda_1 = 4, \lambda_2 = 4$ Looking for all the  $4I$  The matrix is similar:
$$
M^{-1} (4I) M = 4 M^{-1} M = 4I
$$
The invertiblematrix is the arbitrary invertiblematrix.  $M$ The result is always  $4I$  It means: **to  $4I$  The family of the representatives of the standard scale is extremely lonely, and in its whole family there is only this one lone member of itself!**

![Isolated scale family table: M−1 ((4I) M = 4I, single-sex analysis of the scale matrix family](</attachments/obsidian-9a63bf4003d15e7c150751e2.png>)
*⏱ Timestamp: 00:29:40 · 📷 Lecture screenshot · [Watch clip (P29 00:29:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=1780)*

#### 5.2 Extreme case 2: heavy eigenvalue but loss of eigenvector
Think about it as well. eigenvalue  $\lambda_1 = 4, \lambda_2 = 4$  The cutting matrix:
$$
A = \begin{bmatrix} 4 & 1 \\ 0 & 4 \end{bmatrix}
$$
Calculate its eigenvector:
$$
(A - 4I) x = \begin{bmatrix} 0 & 1 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} x_1 \\ x_2 \end{bmatrix} = \begin{bmatrix} 0 \\ 0 \end{bmatrix} \implies x_2 = 0
$$
It's just like  $x = c \begin{bmatrix} 1 \\ 0 \end{bmatrix}$  The geometrical mass of the one-dimensional eigenvector space! 1) is less than the algebraic mass 2) $A$ **It's never possible. diagonalization** So, what? $A$  It is impossible to  $\begin{bmatrix} 4 & 0 \\ 0 & 4 \end{bmatrix}$  Similarly, they live in two completely different similar families!

![diagonalization Loss matrix Board Book: matrix (4; 0 4) eigenvalue Repeats and has only one independent eigenvector](</attachments/obsidian-739ddb1bf35fd8f73eaf18a6.png>)
*⏱ Timestamp: 00:34:30 · 📷 Lecture screenshot · [Watch clip (P29 00:34:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2070)*

---

### The final standard form: the R. K. Standard Form (Jordan Canonical Form)

*(reference timestamp: 00:38:00)  [Watch clip (P29 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2280))*

When matrix cannot do diagonalization, what is the simplest limiting cube in linear algebra that we can simplify it to? **The standard model  $J$**.

**The theory of theorem is that theorem is a natural law.** The following is the list:  $n \times n$  The reverse  $A$  It's like a matrix of segments.  $J$: 
$$
\boxed{A = M J M^{-1} \quad \text{或} \quad J = M^{-1} A M}
$$
where  $J$  It is composed of several blocks of Jordan Blocks spelled along the main opposite corners:
$$
J = \begin{bmatrix}
J_1 & & & \\
& J_2 & & \\
& & \ddots & \\
& & & J_d
\end{bmatrix}
$$

#### 6.1 The young man  $J_i$  The internal structure of the
Every ROL is a piece of paper.  $J_i$  The form is as follows:
- All on the main diagonal is the same eigenvalue.  $\lambda_i$; 
- The main line is just above the right angle. **The first super-diagonal line is 1.**; 
- The rest of the positions are all 0!

For example, the size is  $3 \times 3$  The Ruler of the Mountains is:
$$
J_i = \begin{bmatrix}
\lambda_i & 1 & 0 \\
0 & \lambda_i & 1 \\
0 & 0 & \lambda_i
\end{bmatrix}
$$

Every ROL is a piece of paper.  $J_i$ **It's just a matter of contributing an independent eigenvector.**!

![matrix Board Book: Standard Structure of the Main Diagon eigenvalue and the Hyper Diagon 1](</attachments/obsidian-46c143fa5313f2c6c9aae141.png>)
*⏱ Timestamp: 00:38:50 · 📷 Lecture screenshot · [Watch clip (P29 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2330)*

---

### 7. The profound correspondence of the number of blocks with geometrical mass numbers

*(reference timestamp: 00:43:00)  [Watch clip (P29 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2580))*

The most wonderful theorem of the Standard Model is that its geometry corresponds to the number of blocks and the dimensions of subspace:

$$
\boxed{\text{若尔当块的数量 } d = \text{矩阵 } A \text{ 线性无关特征向量的总数（几何重数之和）}}
$$

- **Scenario 1 (fully diagonalization)** If you are:  $A$  Yes, I did.  $n$  linearly independent eigenvector, yes  $n$  The whole thing is a little bit of ROL.  $1 \times 1$  The block), at this time  $J = \Lambda$  It's the right angle matrix!
- **The situation is very bad.** If you are:  $A$  There's only one linearly independent eigenvector and only one big one.  $n \times n$  I'm not a big fan of this.
- **The situation is 3 (generally deteriorating)** The algebraic weight of the eigenvalue determines the total number of times that eigenvalue appears on a line per angle; and the geometrical weight of the corresponding characteristic space dimension (the geometry) determines the number of individual blocks of rational numbers that the eigenvalle has!

![Theorem of theoretical notation: The number of blocks strictly equal to the number of independent eigenvectors, complete closure of the whole spectrum theory](</attachments/obsidian-eee4a1871bbe8d2f5d6f1dc6.png>)
*⏱ Timestamp: 00:43:20 · 📷 Lecture screenshot · [Watch clip (P29 00:43:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=29&t=2600)*

If the standard model completely solves all theoretical problems of the classification of the arrays. In the next lesson (note 29) we will go into the coronal decomposition of any long-dimensional matrix. **singular value decomposition (SVD)**!


---


<a id="lec-30"></a>
## 29: singular value decomposition (SVD)

> 📺 **Video link back**: [B Station 30 P: Singular value decomposition (SVD)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30) (⏱ 40m 17s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/)  
> 💡 **Key ideas** Any matrix final decomposition A = UΣVT, ATA spectral diagonalization for odd values with V, AAT for U, four large subspace bases aligned with low rank approximations.

---

### 1. The highest peak in linear algebra: singular value decomposition (SVD)

*(reference timestamp: 00:03:00)  [Watch clip (P30 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=180))*

In the previous course, we learned about matrix decomposition:
- The law of elimination of gases  $A = L U$ (Applies only to the front and requires invertible);
- Gram-Schmidt orthogonalization is exported  $A = Q R$ (orthogonal basis of the long-scale matrix);
- The theory of eigenvalue is derived from  $A = S \Lambda S^{-1}$ (requested matrix to diagonalization, owned  $n$  The first is the independent eigenvector.
- The symmetric matrix spectral theorem is derived from  $A = Q \Lambda Q^T$ (Requires matrix symmetry)

If you are faced with a **The first is the "French" and the second is the "Spanish".  $m \times n$  The matrix  $A$** So, what if we could find a perfect matrix to decompose? 
**The answer is singular value decomposition (SVD).**

#### 1.1 The macro-geometric goals of the SVD
We want to define domain space  $\mathbb{R}^n$  Find a set in the row space **Standard orthogonal base** $v_1, v_2, \dots, v_r$ The matrix is the same.  $A$  Map them to value domain space  $\mathbb{R}^m$  A group of column spaces **The vector is orthogonal to each other.**: 
$$
A v_1 = \sigma_1 u_1, \quad A v_2 = \sigma_2 u_2, \quad \dots, \quad A v_r = \sigma_r u_r
$$
The following are the results:
- $v_1, \dots, v_r$  In the  $\mathbb{R}^n$  The middle standard orthogonal $v_i^T v_j = \delta_{ij}$); 
- $u_1, \dots, u_r$  In the  $\mathbb{R}^m$  The middle standard orthogonal $u_i^T u_j = \delta_{ij}$); 
- The Extension Factor  $\sigma_1 \ge \sigma_2 \ge \dots \ge \sigma_r > 0$  The name **The first is the singular value.**!

![SVD Core Geometry Target Book:row space standard orthogonal base v is converted to column space standard orthocal base u with odd value σ](</attachments/obsidian-892caabc3952dcfe755fe95c.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P30 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=210)*

---

### 2. Matrix form: $A = U \Sigma V^T$

*(reference timestamp: 00:07:00 )  [Watch clip (P30 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=420))*

The system of equations  $A v_i = \sigma_i u_i$  The matrix is written as:
$$
A \begin{bmatrix} v_1 & v_2 & \cdots & v_n \end{bmatrix} = \begin{bmatrix} u_1 & u_2 & \cdots & u_m \end{bmatrix} \begin{bmatrix}
\sigma_1 & & & & \\
& \ddots & & & \\
& & \sigma_r & & \\
& & & 0 & \\
& & & & \ddots
\end{bmatrix}_{m \times n}
$$
The following is a list of the most common types of cancer:
$$
A V = U \Sigma
$$
because  $V$  It is  $\mathbb{R}^n$  The square of the standard orthogonal base, which is an orthogonal matrix, satisfies the  $V^{-1} = V^T$ Both sides are right-handed!  $V^T$ We have the most brilliant breakdown theorem in all of human mathematics:
$$
\boxed{A = U \Sigma V^T}
$$
- $U$  Yes, I did.  $m \times m$  The orthogonal matrix (the row vector is the left odd vector);
- $\Sigma$  Yes, I did.  $m \times n$  The matrix of the paired angles is a primarily odd odd-valued pair on the paired line, arranged from large to small;
- $V$  Yes, I did.  $n \times n$  The orthogonal matrix (the vector is the right odd vector)

![The singular value decomposition matrix form table:AV = UΣ Exporting the final decomposition A = UΣVT](</attachments/obsidian-3432c969848fcad096a38f01.png>)
*⏱ Timestamp: 00:07:30 · 📷 Lecture screenshot · [Watch clip (P30 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=450)*

---

### How to Find a Solution 3.  $V$  and  $\Sigma$ The symmetry is constructed as a positive definite quadrant.  $A^T A$

*(reference timestamp: 00:11:00 · [Watch clip (P30 00:11:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=660))*

In the formula  $A = U \Sigma V^T$  In the unknown, there are two sets of orthogonal matrix  $U$  and  $V$. How do you separate them from each other?  $A^T A$: 
$$
A^T A = (U \Sigma V^T)^T (U \Sigma V^T) = V \Sigma^T U^T U \Sigma V^T
$$
The  $U$  It's an orthogonal matrix. $U^T U = I$ **It's gone by magic.**!
$$
\boxed{A^T A = V (\Sigma^T \Sigma) V^T}
$$

I'm not sure what the answer is.
- $A^T A$  It's one.  $n \times n$  The symmetrical positive semidefinitematrix;
- It's the orthogonaldiagonalization of what it is.  $Q \Lambda Q^T$; 
- The two comparisons were immediately striking:
  1. **$V$  It's the matrix.  $A^T A$  The eigenvector matrix**!
  2. **$\Sigma^T \Sigma$  It's right.  $A^T A$  The eigenvaluematrix** It is:
     $$
     \sigma_i^2 = \lambda_i(A^T A) \implies \boxed{\sigma_i = \sqrt{\lambda_i(A^T A)}}
     $$

![ATA Spectral Diagonalization Boards: ATA = V (ΣTΣ) VT with the orthogonal matrix UTU=I](</attachments/obsidian-20bc7323e53fddd3d3ac0a00.png>)
*⏱ Timestamp: 00:11:30 · 📷 Lecture screenshot · [Watch clip (P30 00:11:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=690)*

This would directly require odd values of non-symmetric long squares, which translate into mature algorithms for finding symmetric matrixeigenvalue!

![The odd-valued and eigenvalue relationship boards: V is the ATA eigenvector and σ\_i = √(λ\_i ATA))](</attachments/obsidian-ed56a1fe973d4093512787b7.png>)
*⏱ Timestamp: 00:15:30 · 📷 Lecture screenshot · [Watch clip (P30 00:15:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=930)*

---

### How to Find a Solution 4.  $U$ The symmetry of the faction  $A A^T$  Map with corresponding

*(reference timestamp: 00:19:00)  [Watch clip (P30 00:19:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1140))*

If the inverse multiplication sequence is computed  $A A^T$: 
$$
A A^T = (U \Sigma V^T) (U \Sigma V^T)^T = U \Sigma V^T V \Sigma^T U^T = U (\Sigma \Sigma^T) U^T
$$
The  $V^T V = I$  The same thing happened to the disappearance of the people.
- **$U$  It's the matrix.  $A A^T$  The eigenvector matrix**!

And more intuitively, once you ask for it  $v_i$  and  $\sigma_i$ For non-zero odd-valued vectors, the key vector can be directly unified by a formula:
$$
\boxed{u_i = \frac{A v_i}{\sigma_i} \quad (i = 1, \dots, r)}
$$

#### 4.1 Invertible array computation examples
consider  $2 \times 2$  The matrix:
$$
A = \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix}
$$
Calculation  $A^T A$: 
$$
A^T A = \begin{bmatrix} 4 & -3 \\ 4 & 3 \end{bmatrix} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 25 & 7 \\ 7 & 25 \end{bmatrix}
$$
Please. eigenvalue :
$$
\det\begin{bmatrix} 25 - \lambda & 7 \\ 7 & 25 - \lambda \end{bmatrix} = (25 - \lambda)^2 - 49 = 0 \implies \lambda_1 = 32, \quad \lambda_2 = 18
$$
The odd value is therefore:
$$
\sigma_1 = \sqrt{32} = 4\sqrt{2}, \quad \sigma_2 = \sqrt{18} = 3\sqrt{2}
$$

![Invertible secondary matrix computation example book: ATA calculation of the matrix (4 4; -3 3) solved with eigenvalue](</attachments/obsidian-d105f1c9e3ce3aaa004798fc.png>)
*⏱ Timestamp: 00:19:40 · 📷 Lecture screenshot · [Watch clip (P30 00:19:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1180)*

Please.  $A^T A$  The eigenvector and the unit:
- For the  $\lambda_1 = 32$ The eigenvector is  $v_1 = \frac{1}{\sqrt{2}} \begin{bmatrix} 1 \\ 1 \end{bmatrix}$; 
- For the  $\lambda_2 = 18$ The eigenvector is  $v_2 = \frac{1}{\sqrt{2}} \begin{bmatrix} -1 \\ 1 \end{bmatrix}$.

Calculation  $u_1, u_2$: 
$$
u_1 = \frac{A v_1}{\sigma_1} = \frac{1}{4\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \frac{1}{8} \begin{bmatrix} 8 \\ 0 \end{bmatrix} = \begin{bmatrix} 1 \\ 0 \end{bmatrix}
$$
$$
u_2 = \frac{A v_2}{\sigma_2} = \frac{1}{3\sqrt{2}} \begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} \begin{bmatrix} -1/\sqrt{2} \\ 1/\sqrt{2} \end{bmatrix} = \frac{1}{6} \begin{bmatrix} 0 \\ 6 \end{bmatrix} = \begin{bmatrix} 0 \\ 1 \end{bmatrix}
$$
The following is the perfect singular value decomposition:
$$
\begin{bmatrix} 4 & 4 \\ -3 & 3 \end{bmatrix} = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix} \begin{bmatrix} 4\sqrt{2} & 0 \\ 0 & 3\sqrt{2} \end{bmatrix} \begin{bmatrix} 1/\sqrt{2} & 1/\sqrt{2} \\ -1/\sqrt{2} & 1/\sqrt{2} \end{bmatrix}
$$

![AAT diagonalization and U solving the equation: AAT = U(ΣΣT)UT with two matrix non-zero eigenvalue](</attachments/obsidian-10efa57404f60eec14a0bb3f.png>)
*⏱ Timestamp: 00:23:30 · 📷 Lecture screenshot · [Watch clip (P30 00:23:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1410)*

---

### 5. The odd matrix and the rank 1 case (Rank 1 Deficient Matrix)

*(reference timestamp: 00:28:00)  [Watch clip (P30 00:28:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1680))*

If the matrix is odd (degraded), how does SVD deal with it? Consider rank 1 matrix:
$$
A = \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix}
$$
The row space is a straight line in only one dimension.  $\begin{bmatrix} 4 & 3 \end{bmatrix}^T$  The null space is published by orthogonal complement.  $\begin{bmatrix} 3 & -4 \end{bmatrix}^T$  The first is the "Goldilocks".

![Examples of matrix rank 1 are: matrix (4 3; 8 6) with row space in one dimension](</attachments/obsidian-b6ec38f96a73c01c93f19817.png>)
*⏱ Timestamp: 00:28:30 · 📷 Lecture screenshot · [Watch clip (P30 00:28:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1710)*

Calculation  $A^T A$: 
$$
A^T A = \begin{bmatrix} 4 & 8 \\ 3 & 6 \end{bmatrix} \begin{bmatrix} 4 & 3 \\ 8 & 6 \end{bmatrix} = \begin{bmatrix} 80 & 60 \\ 60 & 45 \end{bmatrix}
$$
The eigenvalue is:
$$
\text{tr}(A^T A) = 80 + 45 = 125, \quad \det(A^T A) = 0 \implies \lambda_1 = 125, \quad \lambda_2 = 0
$$
The only non-zero odd is:
$$
\sigma_1 = \sqrt{125} = 5\sqrt{5}, \quad \sigma_2 = 0
$$

![Rank 1 matrixeigenvalue with odd-valued boards: λ1 = 125, λ2 = 0 and σ1 = √125 = 5√5](</attachments/obsidian-bb46ff4167bc117d6ae4249e.png>)
*⏱ Timestamp: 00:32:40 · 📷 Lecture screenshot · [Watch clip (P30 00:32:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=1960)*

The standard orthogonal bases are:
- $v_1 = \frac{1}{5} \begin{bmatrix} 4 \\ 3 \end{bmatrix}$ I'm sorry. row space Standard orthogonal (b) Bases;
- $v_2 = \frac{1}{5} \begin{bmatrix} 3 \\ -4 \end{bmatrix}$ The first is the "Null Space Standard orthogonal basis".
- $u_1 = \frac{A v_1}{\sigma_1} = \frac{1}{\sqrt{5}} \begin{bmatrix} 1 \\ 2 \end{bmatrix}$ I'm sorry. column space Standard orthogonal (b) Bases;
- $u_2 = \frac{1}{\sqrt{5}} \begin{bmatrix} 2 \\ -1 \end{bmatrix}$ (left null space standard orthogonal basis)

![The four basic subspace orthogonal boards: v1 in row space, v2 in null space, u1 in column space, u2 in left null space](</attachments/obsidian-fa286c48b182f6223685812b.png>)
*⏱ Timestamp: 00:35:20 · 📷 Lecture screenshot · [Watch clip (P30 00:35:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2120)*

---

### 6. Uniform geometrical view of SVD is approximate to low rank

*(reference timestamp: 00:38:00)  [Watch clip (P30 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2280))*

SVD links all the macro-theories from the first to the last chapter of linear algebra into a perfect closing loop:

1. **Geometrical changes in the image**: 
   $A$  I will  $\mathbb{R}^n$  The unit is mapped to the supersphere as  $\mathbb{R}^m$  The super-globes inside!
   - The direction of the main half-axis of a ball is given by the row vector  $u_1, \dots, u_r$  Decides;
   - The length of the main half-axis is odd.  $\sigma_1, \dots, \sigma_r$!
2. **Rank 1 Extraterrestrial openings (Eckart-Young low rank approximation)**: 
   $$
   \boxed{A = \sum_{i=1}^r \sigma_i u_i v_i^T = \sigma_1 u_1 v_1^T + \sigma_2 u_2 v_2^T + \cdots + \sigma_r u_r v_r^T}
   $$
   Each of these  $u_i v_i^T$  The first is a very short rank 1 matrix. It is the number of roots that make up image compression, PCA main component analysis, recommendation systems and large model weight low-rank modulation (LoRA).

![SVD geometry with rank 1 matrix expansion and board book:A = x σ\_i u\_i v\_iT with unit ball mapped to the ball as a ball](</attachments/obsidian-6c358337ce981ce67ae0a33e.png>)
*⏱ Timestamp: 00:38:50 · 📷 Lecture screenshot · [Watch clip (P30 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=30&t=2330)*


---


<a id="lec-31"></a>
## 30th: Linear transformation and its matrix

> 📺 **Video link back**: [B-station 31 P:linear transformation and its matrix](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31) (⏱ 49m 18s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/)  
> 💡 **Key ideas** The following are the main principles of linear transformation: geometry and calculus, derivation and addition; basis determines everything; coefficient matrix construction rules; characteristic diagonalization under base.

---

### 1. Concept of upliftment: What is linear transformation?

*(reference timestamp: 00:03:00)  [Watch clip (P31 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=180))*

In the vast majority of previous chapters, linear algebra is centered on a matrix composed of numbers.  $A$  with vector  $x$ and calculations.  $A x$ In modern mathematics, however, the matrix is simply a form of expression for specific numerical coordinates, which are based on physical and geometric properties. **The first is the linear transformation.**.

#### 1.1 The two core principles of linear transformation
Let  $V$  and  $W$  It's a two-vector space.  $V$  to  $W$  The rules of mapping  $T: V \to W$  The name **Linear transformation** The following two closed operations are fulfilled:
1. **The first is the addition of a substrate.**\_Other Organiser vector  $v, w \in V$: 
   $$
   T(v + w) = T(v) + T(w)
   $$
2. **The number of times the number is constant (Homogeneity)**\_Other Organiser vector  $v \in V$  and arbitrary measures  $c \in \mathbb{R}$: 
   $$
   T(c v) = c T(v)
   $$

The two principles can be equally combined into one. **Linear combination to maintain order**: 
$$
\boxed{T(c v + d w) = c T(v) + d T(w)}
$$

**Important conclusions**:
Choose a scalar  $c = 0$ The result of any linear transformation must be zero vector mapping:
$$
T(\mathbf{0}) = \mathbf{0}
$$
If a transformation maps the zero vector as a nonzero vector, it is absolutely not linear!

![The two main core ratios of linear transformation are: additive linear T ⁇ v + w = T ⁇ V + T ⁇ w and numerically times linear T](</attachments/obsidian-3f7d7f9b5c0202c7103b6b57.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P31 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=210)*

---

### 2. Biodiversity between linear and nonlinear

*(reference timestamp: 00:07:00 )  [Watch clip (P31 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=420))*

To understand the rigorous boundaries of linear geometry in depth, Professor Strang gives a number of intuitive counterexamples and positive examples:

#### 2.1 Classic nonlinear counterexamples
1. **The first is the translation of the word "switch".**: 
   $$
   T(v) = v + u_0 \quad (u_0 \ne \mathbf{0})
   $$
   The zero vector test: $T(\mathbf{0}) = u_0 \ne \mathbf{0}$ The original location was moved! $T(v + w) = v + w + u_0$ and  $T(v) + T(w) = v + w + 2u_0$ The two are not equal, so the parallel is nonlinear.
2. **The length of the scale changes to normal.**: 
   $$
   T(v) = \|v\|
   $$
   Test number multiplied by: take  $c = -1$, $T(-v) = \|-v\| = \|v\|$, but  $-T(v) = -\|v\|$ The symbols are in conflict and thus take nonlinear lengths.

![Nonlinear counter-case boards: T (v) = v+u0 but the original point destroys linearity](</attachments/obsidian-283da1d033c277e901d32cda.png>)
*⏱ Timestamp: 00:07:30 · 📷 Lecture screenshot · [Watch clip (P31 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=450)*

#### 2.2 Classic linear geometrical regulars
In flat geometry, the following classical transformations are strictly linear:
- **The game is a free-to-play game.** Rotate all vectors in the plane:  $\theta$  The law of angles and parallel squares remains in force;
- **projection Transformation** The vector projection is directed to a line that crosses the origin.
- **The first is the "Reflection"** The mirror is rotated on the symmetrical axis of a point.

![Geometric transformation casebooks: rotation, projection and reflection of linear transformations in the graphics of houses](</attachments/obsidian-2acc49c9ceca8d8cee7e52c4.png>)
*⏱ Timestamp: 00:13:30 · 📷 Lecture screenshot · [Watch clip (P31 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=810)*

---

### Linear arithmetic in abstraction vector space: geometry divided by derivatives and points

*(reference timestamp: 00:19:00)  [Watch clip (P31 00:19:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1140))*

The great thing about linear transformation is that it's not completely limited to the  $\mathbb{R}^n$  It can work in any abstraction vector space, e.g. **Function space**!

Consider vector space consisting of real coefficients polynomials  $\mathcal{P}$: 
- **The derivative is the derivative of a function.**: $T(f) = \frac{df}{dx}$
   The first is the test of the properties of metric:
  $$
  \frac{d(f + g)}{dx} = \frac{df}{dx} + \frac{dg}{dx} \quad \text{以及} \quad \frac{d(c f)}{dx} = c \frac{df}{dx}
  $$
  The algorithm is a strictly linear transformation!
- **The first is the integration.**: $T(f) = \int_0^x f(t) dt$
   The point is just as much a plus-number multiplication as a linear transformation!

This reveals a surprising number of facts: **In mathematics, the point is a linear algebra in infinite-dimensional function space.**

![abstraction vector spacelinear transformation: the multi-dimensional derivative d/dx with the addition of the derivative points is also a linear transformation](</attachments/obsidian-48e2e105c1254963e093eb9d.png>)
*⏱ Timestamp: 00:19:30 · 📷 Lecture screenshot · [Watch clip (P31 00:19:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1170)*

---

### 4. Core Theory: The foundation determines everything

*(reference timestamp: 00:24:00 )  [Watch clip (P31 00:24:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1440))*

A vector space contains infinitely many vectors, and how can we determine the complete linear transformation of a vector space?  $T$  Do you need to map out all the vectors? 
**It's not necessary! As long as you have a group of people, you have everything.**

Let  $v_1, v_2, \dots, v_n$  It's the input space.  $V$  A set of bases. Any vector in space  $v$  The only way to express a linear combination of the groups is:
$$
v = c_1 v_1 + c_2 v_2 + \cdots + c_n v_n
$$
The first is the addition and multiplication of linear transformation:
$$
\boxed{T(v) = c_1 T(v_1) + c_2 T(v_2) + \cdots + c_n T(v_n)}
$$

**Conclusion** We just need to know:  $T$  The results of the work on a finite base vector  $T(v_1), \dots, T(v_n)$ In a simple linear combination, you can instantly calculate the output of any vector transformation in space!

![The basis determines all theorem tables: if we determine the transformation of n of the vectors T (v\_i), then the total space will be determined by any variable.](</attachments/obsidian-7426cdb0acb81e01004a2515.png>)
*⏱ Timestamp: 00:24:20 · 📷 Lecture screenshot · [Watch clip (P31 00:24:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1460)*

---

### 5. The constituent laws represented by the matrix

*(reference timestamp: 00:29:00)  [Watch clip (P31 00:29:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1740))*

From the abstractional linear transformation  $T$  The first is the transition to a specific computable matrix.  $A$ The bridge is **The first is the "Base" coordinates.**.

Set the input space  $V$  Select the base  $\mathcal{V} = \{v_1, \dots, v_n\}$ The output space  $W$  Select the base  $\mathcal{W} = \{w_1, \dots, w_m\}$ The matrix is constructed.  $A$ (sized to be  $m \times n$ The standard process:

1. **Calculating column 1**: apply  $T$  The first input vector is the  $v_1$ The first is the output to output base.
   $$
   T(v_1) = a_{11} w_1 + a_{21} w_2 + \cdots + a_{m1} w_m \implies \text{矩阵第 1 列为 } \begin{bmatrix} a_{11} \\ a_{21} \\ \vdots \\ a_{m1} \end{bmatrix}
   $$
2. **Calculation of the number  $j$  The list**: apply  $T$  The role of the  $j$  Input key vector  $v_j$ The output base is the coordinate of the output base.
   $$
   T(v_j) = \sum_{i=1}^m a_{ij} w_i \implies \text{矩阵第 } j \text{ 列就是展开坐标系数}
   $$

**The Rule of One Word**: **Each row of the matrix is a coordinate below the output base after the input vector has been changed!**

![Linear transformation constituting matrix law board: T(v\_j) The j-column of the constituent matrix A extends under the coordinates at the output base w\_i](</attachments/obsidian-8100f1d7aeb8b0e1cbbcea8f.png>)
*⏱ Timestamp: 00:29:40 · 📷 Lecture screenshot · [Watch clip (P31 00:29:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=1780)*

---

### 6. Choosing the base: standard base vs eigenvector base

*(reference timestamp: 00:34:00)  [Watch clip (P31 00:34:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2040))*

The same geometrical linear transformation, written under different bases, matrix the difference in height!

#### 6.1 Example: projection to a 45° slope
consider  $\mathbb{R}^2$  In the middle of a straight line  $y = x$  The vertical projection is transformed  $T$.

**Option 1: Standard right-angled coordinate base** $v_1 = \begin{bmatrix} 1 \\ 0 \end{bmatrix}, v_2 = \begin{bmatrix} 0 \\ 1 \end{bmatrix}$
- $T(v_1) = \begin{bmatrix} 1/2 \\ 1/2 \end{bmatrix} = \frac{1}{2} v_1 + \frac{1}{2} v_2$; 
- $T(v_2) = \begin{bmatrix} 1/2 \\ 1/2 \end{bmatrix} = \frac{1}{2} v_1 + \frac{1}{2} v_2$ The following is a list of the most common types of projection matrix:
$$
A = \begin{bmatrix} 1/2 & 1/2 \\ 1/2 & 1/2 \end{bmatrix}
$$

![Projection matrix structure book under standard base: projection to 45 degrees line in the matrix under standard base (1/2 1/2; 1/2 1/2)](</attachments/obsidian-31def1f8304fc0fdd061c5cd.png>)
*⏱ Timestamp: 00:34:30 · 📷 Lecture screenshot · [Watch clip (P31 00:34:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2070)*

**Option 2: base of the eigenvector** $v_1 = \begin{bmatrix} 1 \\ 1 \end{bmatrix}$ (Lines of projection) $v_2 = \begin{bmatrix} -1 \\ 1 \end{bmatrix}$ (vertical to the projection line)
- $T(v_1) = v_1 = 1 v_1 + 0 v_2$; 
- $T(v_2) = \mathbf{0} = 0 v_1 + 0 v_2$ The matrix below the base is:
$$
\Lambda = \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix}
$$
**How very simple it is!**
 The eigenvector is the underlying basis for the complete diagonalization of a transformed matrix.

![Diagonalization matrix table under eigenvector basis: the projection matrix under characteristic base becomes a very opposite array (1 0; 0 0)](</attachments/obsidian-02fd16c0c5cc0b980159be3a.png>)
*⏱ Timestamp: 00:38:50 · 📷 Lecture screenshot · [Watch clip (P31 00:38:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2330)*

---

### 7. Matrixization of polynomial calculus is represented

*(reference timestamp: 00:43:00)  [Watch clip (P31 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2580))*

For example, a query directory is an input space with multiple spaces of at least three.  $V = \text{span}\{1, x, x^2, x^3\}$ (dimension 4) is a polynomial space with output spaces of at least 2  $W = \text{span}\{1, x, x^2\}$ (dimension 3)

The key vector is then: $v_1=1, v_2=x, v_3=x^2, v_4=x^3$ The output is based on: $w_1=1, w_2=x, w_3=x^2$ The following is the list of the most common types of data processing:
1. $\frac{d}{dx}(1) = 0 = 0 w_1 + 0 w_2 + 0 w_3 \implies \text{col}_1 = \begin{bmatrix} 0 & 0 & 0 \end{bmatrix}^T$
2. $\frac{d}{dx}(x) = 1 = 1 w_1 + 0 w_2 + 0 w_3 \implies \text{col}_2 = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$
3. $\frac{d}{dx}(x^2) = 2x = 0 w_1 + 2 w_2 + 0 w_3 \implies \text{col}_3 = \begin{bmatrix} 0 & 2 & 0 \end{bmatrix}^T$
4. $\frac{d}{dx}(x^3) = 3x^2 = 0 w_1 + 0 w_2 + 3 w_3 \implies \text{col}_4 = \begin{bmatrix} 0 & 0 & 3 \end{bmatrix}^T$

I'm going to be a good one. **The Matrix for guidance  $D$**: 
$$
D = \begin{bmatrix}
0 & 1 & 0 & 0 \\
0 & 0 & 2 & 0 \\
0 & 0 & 0 & 3
\end{bmatrix}_{3 \times 4}
$$
For any polynomial  $f(x) = c_1 + c_2 x + c_3 x^2 + c_4 x^3$  Just use the matrix.  $D$  The coordinate vector  $\begin{bmatrix} c_1 & c_2 & c_3 & c_4 \end{bmatrix}^T$!

![The matrix of polynomial calculus represents the table book: from three polynomials to two polynomially spaced 3×4 guides matrix D](</attachments/obsidian-bc6aca0f6f920b18405b1a6d.png>)
*⏱ Timestamp: 00:43:20 · 📷 Lecture screenshot · [Watch clip (P31 00:43:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2600)*

#### 7.1 Complex linear transformation and matrix multiplication
If we do two linear transformations later,  $T_1: U \to V$  and  $T_2: V \to W$ The matrix is the corresponding matrix,  $B$  and  $A$: 
$$
(T_2 \circ T_1)(u) \iff A (B x) = (A B) x
$$
This is a complete revelation. **The matrix multiplication is defined as the deepest cause of linear multiplication** It's a complex linear transformation of the natural combination underneath the foundation!

![Complex linear transformation with matrix multiplication: the complex algorithm is inversely proportional to the matrix, and the differential and the point algorithm are pseudoinverse](</attachments/obsidian-48f0c052c2d8ad57febce884.png>)
*⏱ Timestamp: 00:47:40 · 📷 Lecture screenshot · [Watch clip (P31 00:47:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=31&t=2860)*


---


<a id="lec-32"></a>
## 31st lecture: Basic transformation and image compression

> 📺 **Video link back**: [B Station 32 P: Base transformation and image compression](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32) (⏱ 50m 06s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/)  
> 💡 **Key ideas** The following are the functions of a digital image: vectorization, JPEG with discrete residual strings (DCT), Haar multi-dimensional small strings (Wavelets), base transformation formula c=W−1x, B=M−1AM geometry.

---

### 1. Linear algebra modeling of digital images

*(reference timestamp: 00:03:00)  [Watch clip (P32 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=180))*

What is a digital gray image in a computer? **Values vector**!

The resolution of the image is  $512 \times 512$  The pixel:
- The total number of images  $n = 512 \times 512 = 262,144$  The pixel point;
- The brightness of each pixel is represented by a metric (e.g., 8-bit gray, where the value from 0 is pure black to 255 is pure white);
- So the whole picture is vector space.  $\mathbb{R}^n$($n = 262,144$ The first is the high vector.  $x$!

#### 1.1 Deadly defects in the Pixel Basis standard
In the simplest of expressions, we use **Standard pixel base** $p_1, p_2, \dots, p_n$: 
$$
x = x_1 p_1 + x_2 p_2 + \cdots + x_n p_n
$$
The key vector  $p_i$  The following is a list of  $i$  The pixel is 1 and all other pixels are 0..

The standard pixel base is used to store and transmit:
- If most of the area of a picture is flat (such as blackboard, sky or wall), each pixel point must still have an 8-digit value in full;
- If we try to compress data by throwing away a part of the metric, there will be black holes in the image!
- **Conclusion** The standard pixel base is completely unable to achieve data compression!

![The numeric image vectored model book: 512×512 pixels vectors with 0-255 gray values represent the standard base](</attachments/obsidian-6f43019e2db8232f13aca357.png>)
*⏱ Timestamp: 00:03:40 · 📷 Lecture screenshot · [Watch clip (P32 00:03:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=220)*

---

### 2. The core idea of compression: Change of Basis

*reference timestamp: 00:08:00...  [Watch clip (P32 00:08:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=480))*

The soul of the image compressed is that it's a picture of the world. **Looking for a new set of orthogonal bases  $w_1, w_2, \dots, w_n$** The result is that the image has an extreme coefficient of unfolding at the bottom of this new base group. **The energy density of the Earth is about 0.**!

$$
x = c_1 w_1 + c_2 w_2 + \cdots + c_n w_n
$$

In real-world images, there is a very strong correlation between adjacent pixels (space redundancy) after carefully designed orthogonal transformations:
- Very few large coefficients  $c_k$  The image contains over 99% of the outline and subject energy;
- The vast majority of high frequency weakness details  $c_k \approx 0$; 
- We just need to set a threshold.  $\epsilon$ And all will be satisfied  $|c_k| < \epsilon$  The coefficient of **Directly discarded**!
- This is the fundamental mathematical principle of modern loss image compression.

![Image compression baseline thought board: finding orthogonal bases that concentrate signal energy high in a few large coefficients](</attachments/obsidian-aa7d2ddb565f82e7acf1336e.png>)
*⏱ Timestamp: 00:08:30 · 📷 Lecture screenshot · [Watch clip (P32 00:08:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=510)*

---

### The two major industrial base-levels: DCT and small wave (Wavelets)

*(reference timestamp: 00:13:00)  [Watch clip (P32 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=780))*

#### 3.1 JPEG industry standard: discrete string transformation (DCT)
In the classic JPEG compression standard:
1. The computer will be all over the place.  $512 \times 512$  The image is divided into a number of independent  $8 \times 8$  The pixel blocks are each small piece of dimension  $n = 64$); 
2. I'm going to give it to everyone.  $8 \times 8$  The sub-block is a discrete cosine transform, DCT, with the use of a discrete transducer.
3. The DCT base consists of cosine sampling at different frequencies, with the first base vector representing the average brightness within the block (DC fraction) and the rest representing the rise and fall of the low to high range (AC mass);
4. The human eye is insensitive to micro-lift and ups and downs of ultra high frequency, and has significantly quantified the discarded high frequency coefficient, which maintains a high fidelity visual effect at a compression ratio of 20:1!

![JPEG standard split block with alternating strings (DCT) board: 8×8 image block with discrete orthogonal base of remaining strings](</attachments/obsidian-fe96864da8cedcd8351d5889.png>)
*⏱ Timestamp: 00:13:30 · 📷 Lecture screenshot · [Watch clip (P32 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=810)*

#### 3.2 Modern small-sized hair wavelengths
*(reference timestamp: 00:17:00 )  [Watch clip (P32 00:17:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1020))*

The disadvantage of DCT is that extreme compression can produce a gamma-ray burst effect. A new generation of JPEG 2000 standards has been introduced. **The first is the "Baby Boogie" (Wavelets).** Consider the one-dimensional signal with the most basic example of Haar microwave.  $n=8$: 
- **The average value of the total (DC)**: $\begin{bmatrix} 1 & 1 & 1 & 1 & 1 & 1 & 1 & 1 \end{bmatrix}^T$
- **Macroscale differences** The first half is positive and the second half is negative: $\begin{bmatrix} 1 & 1 & 1 & 1 & -1 & -1 & -1 & -1 \end{bmatrix}^T$
- **Medium-scale local differential** The first half of the season was a mixed-use event. 
  $\begin{bmatrix} 1 & 1 & -1 & -1 & 0 & 0 & 0 & 0 \end{bmatrix}^T$  and  $\begin{bmatrix} 0 & 0 & 0 & 0 & 1 & 1 & -1 & -1 \end{bmatrix}^T$
- **Microscopic localization of small** The two pixel differentials: 
  $\begin{bmatrix} 1 & -1 & 0 & 0 & 0 & 0 & 0 & 0 \end{bmatrix}^T$  Wait, wait.

The little boy Bocky has **Frequency range resolution** And they have **Local positioning capabilities in time/space**!

![Small wavelet basis: Haar decomposition of small waves from the general mean to local differential](</attachments/obsidian-8d29d4b79a9ddd34a10379f6.png>)
*⏱ Timestamp: 00:17:30 · 📷 Lecture screenshot · [Watch clip (P32 00:17:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1050)*

The entire small Pochy vector naturally remains orthogonal to each other, forming an orthogonal small wave transform matrix.  $W$.

![8×8 small wave transform matrix board: full 1 mean value vector with negative 1 local differential orthogonal base vector for each level](</attachments/obsidian-6dc6d5ad5dc4153fb94f481b.png>)
*⏱ Timestamp: 00:22:20 · 📷 Lecture screenshot · [Watch clip (P32 00:22:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1340)*

#### 3.3 Threshold quantification and data reconstruction
After a change of basis  $c = W^{-1} x$ The computer vector for coefficients  $c$  Thresholding is a method of threshold-free compression that can be done with zinc encoded, and tens or even hundreds of times as much.

![The book of the loss-of compression and quantification thresholds: high proportion of discarded microcoefficients for compression and high quality reconstruction](</attachments/obsidian-c59115ebd9d547b4ac18c743.png>)
*⏱ Timestamp: 00:27:30 · 📷 Lecture screenshot · [Watch clip (P32 00:27:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1650)*

---

### General algebraic formula for vector-based transformations

*(reference timestamp: 00:32:00)  [Watch clip (P32 00:32:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1920))*

Now, we're going to raise the specific engineering of image compression to pure linear algebra abstraction.
- Old foundation  $\mathcal{V} = \{v_1, \dots, v_n\}$ The matrix  $V = \begin{bmatrix} v_1 & \cdots & v_n \end{bmatrix}$; 
- New foundation  $\mathcal{W} = \{w_1, \dots, w_n\}$ The matrix  $W = \begin{bmatrix} w_1 & \cdots & w_n \end{bmatrix}$.

The same geometric vector  $x$ The first is the "Buddy of the World".
$$
x = V c_{\text{old}} = W c_{\text{new}}
$$
The two sides are left-handed.  $W^{-1}$: 
$$
\boxed{c_{\text{new}} = (W^{-1} V) c_{\text{old}} = M c_{\text{old}}}
$$
The matrix is  $M = W^{-1} V$  The name **The basic transformation transition matrix is a modified version of the base matrix.** The first is the "B" and the second is the "C". $V = I$ The new coordinates are:  $c_{\text{new}} = W^{-1} x$!

![The vector base transformation formula table: transition matrix c\_new = W−1 x from the old coordinate to the new coordinate base](</attachments/obsidian-45fcb6f79755ba23381b8e02.png>)
*⏱ Timestamp: 00:32:40 · 📷 Lecture screenshot · [Watch clip (P32 00:32:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=1960)*

---

### 5. The basic transformation of linear transformation: $B = M^{-1} A M$  The truth

*(reference timestamp: 00:38:00)  [Watch clip (P32 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2280))*

If we have a geometrical linear transformation,  $T: V \to V$: 
- At the old foundation  $V$  The matrix below is  $A$; 
- At the new foundation  $W$  The matrix below is  $B$.

$A$  and  $B$  The new coordinates are designed to be changed in three steps:
1. Use it first.  $M$  The new base coordinates are replaced by the old base coordinates: $c_{\text{old}} = M c_{\text{new}}$; 
2. Matrix application under the old basis  $A$  The change: $y_{\text{old}} = A c_{\text{old}} = A M c_{\text{new}}$; 
3. Recycled  $M^{-1}$  The resulting coordinates are converted to new base coordinates: $y_{\text{new}} = M^{-1} y_{\text{old}} = (M^{-1} A M) c_{\text{new}}$!

So the matrix under the new base is  $B$  It is equal to:
$$
\boxed{B = M^{-1} A M}
$$

This is a complete revelation of the 28th lecture. **The real physical and geometric meanings of matrix-like**: 
**All similar matrix It's all the same. linear transformation Under different coordinates. projection Incarnate!**

![Linear transformation in a matrix under different bases: B = M−1 A M reveals the similar geometry of the matrix](</attachments/obsidian-4ff2e13a047640d3e177e1d2.png>)
*⏱ Timestamp: 00:38:20 · 📷 Lecture screenshot · [Watch clip (P32 00:38:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2300)*

---

### 6. Decoupling Input and Output Bases: Toward Singular Value Decomposition

*(reference timestamp: 00:43:00)  [Watch clip (P32 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2580))*

If the input space and output space are based on different bases:
- The input base is a transition matrix  $M$  The change;
- The output base is a transition matrix  $N$  The change.

The broad similarity of the transform matrix is formulated as:
$$
\boxed{B = N^{-1} A M}
$$

**The ultimate harmonics of linear algebra**: 
- If you  $A$  We are all on the same side and we only allow choices. **A group of bases**($N = M$ The most perfect foundation is **The eigenvector base  $S$** It can make matrix diagonalization as simple as a  $S^{-1} A S = \Lambda$!
- If you  $A$  So we're either going to have a long-range or we're going to allow input and output options. **Two sets of different standard orthogonal bases**($M = V, N = U$ The most perfect foundation is the **The odd vector base**: 
  $$
  \boxed{U^{-1} A V = U^T A V = \Sigma}
  $$
  singular value decomposition (SVD)!

![The input base and output base decomposition table: B = N−1 A M perfectly corresponds to the singular value decomposition SVD UT A V = Σ](</attachments/obsidian-ab966c2f53de8a47ca9e5e97.png>)
*⏱ Timestamp: 00:43:50 · 📷 Lecture screenshot · [Watch clip (P32 00:43:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2630)*

![The final base summarizes the table: the most favorable for a square is an eigenvector basis, and the longest for a square for an SVD odd vector basis.](</attachments/obsidian-6ef8daaad2ff8de1156626b4.png>)
*⏱ Timestamp: 00:48:30 · 📷 Lecture screenshot · [Watch clip (P32 00:48:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=32&t=2910)*


---


<a id="lec-33"></a>
## The third test, the Q3 Review, was held in the city of Mumbai.

> 📺 **Video link back**: [B Station 33 P: Third Test General Review](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33) (⏱ 46m 57s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-32-quiz-3-review/)  
> 💡 **Key ideas** The three major matrix spectral characteristics are: symmetric/opposite/orthogonal; differential equation group stability; three-phase parameters matrix positive definiteness and gold division; SVD compute error-prone symbol alignment.

---

### 1. The third test score: Three classic matrix spectral panoramas

*(reference timestamp: 00:03:00)  [Watch clip (P33 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=180))*

The third test thoroughly examined eigenvalue, diagonalization, the differential equation system, positive definite sex and singular value decomposition. Professor Strang opened the door and began by making a panoramic horizontal comparison of the three main categories of matrix at the core of the module:

| Matrix type | Defining algebraic conditions | The eigenvalue spectral characteristics | The eigenvector orthogonality | The formula for the decomposition of spectrum |
| :--- | :--- | :--- | :--- | :--- |
| **The symmetric matrix is a real-time matrix.** | $A^T = A$ | **All of them are pure numbers.**($\lambda_i \in \mathbb{R}$) | The two sides are vertically orthogonal. | $A = Q \Lambda Q^T$ |
| **The first is the counter-symmetric matrix (Skew-Symmetric).** | $A^T = -A$ | **All are either pure zeroes or zeroes.**($\lambda = i \omega$) | Vertically (repeated orthogonal) | $A = U \Lambda U^H$ |
| **The first is the orthogonal matrix.** | $Q^T Q = I$ | **The length of the length is equal to 1**($|\lambda| = 1$) | The two sides are vertically orthogonal. | $Q = U \Lambda U^H$ |

These three matrix classes constitute the framework for linear algebra spectral theory and are fundamental questions to be examined in periodic and end-term tests.

![The three major matrix spectral characteristics of the whole picture are: real symmetry, opposite to orthogonal matrixeigenvalue and eigenvector](</attachments/obsidian-6895a4cf0eede7c892deb420.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P33 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=210)*

---

### 2. Subject 1: System of linear regular differential equations

*(reference timestamp: 00:07:00 )  [Watch clip (P33 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=420))*

The following is a list of the common differential equations:
$$
\frac{du}{dt} = A u, \quad u(0) = u_0
$$

#### 2.1 Structure and stability of solutions
Set the matrix  $A$  Possession eigenvalue  $\lambda_1, \lambda_2$  and corresponding eigenvectors  $x_1, x_2$ The initial value vector is divided into linear combinations of the eigenvectors: $u_0 = c_1 x_1 + c_2 x_2$ The system is defined as:
$$
\boxed{u(t) = c_1 e^{\lambda_1 t} x_1 + c_2 e^{\lambda_2 t} x_2}
$$

**The first is the "Stability" principle.**: 
- The system is getting closer to stability.  $t \to \infty$  When the $u(t) \to \mathbf{0}$ The following is a list of **Necessary and sufficient condition** It is: **The matrix  $A$  All of it. eigenvalue The real ones are strict negatives.**: 
  $$
  \text{Re}(\lambda_i) < 0 \quad (\forall i)
  $$
- For the  $2 \times 2$  The matrix is equal to:
  1. $\text{tr}(A) = \lambda_1 + \lambda_2 < 0$; 
  2. $\det(A) = \lambda_1 \lambda_2 > 0$.

![The differential equation group solves the problem template book:du/dt = Au with a determination of stability according to Re(λ) \< 0](</attachments/obsidian-7aa95c6b6792fdc3cd6edad9.png>)
*⏱ Timestamp: 00:07:30 · 📷 Lecture screenshot · [Watch clip (P33 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=450)*

#### 2.2 Expansion of the concept of a formal matrix
*(reference timestamp: 00:13:00)  [Watch clip (P33 00:13:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=780))*

What matrix must have an entire set of orthogonaleigenvectors (even if not symmetrical)? Theorem: If and only if the matrix satisfies  $A A^T = A^T A$ (Repeat in space)  $A A^H = A^H A$ The matrix is called the **The normal matrix** It's got to be able to do this. diagonalization I don't know.

![Regular matrix and diagonalization Boardbook: AAT = ATA filling condition and reset inner product ⁇ orthogonal feature base](</attachments/obsidian-77a24131d51b59722ef7c0c5.png>)
*⏱ Timestamp: 00:13:30 · 📷 Lecture screenshot · [Watch clip (P33 00:13:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=810)*

---

### 3. Subject 2: Triple-phase symmetry parameter matrix positive definiteness differentiation

*(reference timestamp: 00:18:00 )  [Watch clip (P33 00:18:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1080))*

**Testing the original war** Set the matrix  $A$  Contains unknown parameters  $c$: 
$$
A = \begin{bmatrix}
1 & 1 & 0 \\
1 & c & 1 \\
0 & 1 & c
\end{bmatrix}
$$
Ask for the parameters  $c$  What is the value of a matrix?  $A$  Is it strictly positive definite?

#### 3.1 Principal minor judgments
Calculate the determinant of the three upper left-angled squares:
1. 1 The first step:
   $$
   D_1 = |1| = 1 > 0 \quad (\checkmark)
   $$
2. 2nd class:
   $$
   D_2 = \begin{vmatrix} 1 & 1 \\ 1 & c \end{vmatrix} = c - 1 > 0 \implies \boxed{c > 1}
   $$
3. 3 - The whole matrix determinant: unfolded by the first line:
   $$
   D_3 = \det(A) = 1 \begin{vmatrix} c & 1 \\ 1 & c \end{vmatrix} - 1 \begin{vmatrix} 1 & 1 \\ 0 & c \end{vmatrix} = (c^2 - 1) - c = c^2 - c - 1
   $$
   What is it?  $D_3 > 0$ The equation:  $c^2 - c - 1 = 0$  The root of the number of gold fractions  $\frac{1 \pm \sqrt{5}}{2}$ Because...  $c > 1$ The first is the "Right Root".
   $$
   \boxed{c > \frac{1 + \sqrt{5}}{2} \approx 1.618}
   $$

Only when  $c > 1.618$  The matrix is  $A$  It's strictly positive definite!

![The three-stage symmetrical parameter matrix positive definiteness book: ordered subset of the determinant with gold dividing by the absolute value condition c \> (1+√5)/2](</attachments/obsidian-2bedc41b0948c00030026205.png>)
*⏱ Timestamp: 00:18:20 · 📷 Lecture screenshot · [Watch clip (P33 00:18:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1100)*

#### 3.2 Gas elimination pivot method with full square check
*(reference timestamp: 00:23:00)  [Watch clip (P33 00:23:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1380))*

If the pivot is requested by elimination:
- The first pivot: $d_1 = 1$; 
- The second pivot: $d_2 = c - 1$; 
- The third pivot: $d_3 = c - \frac{1}{c - 1} = \frac{c^2 - c - 1}{c - 1}$ The resulting conclusion is that all three pivot values are strictly greater than zero and exactly the same!
$$
x^T A x = 1(x_1 + x_2)^2 + (c - 1)\left(x_2 + \frac{1}{c-1}x_3\right)^2 + \frac{c^2 - c - 1}{c-1} x_3^2
$$

![Gas elimination pivot method with perfectly square distribution method: verify that A = LDLT pivot constant is positive and secondary type minimal value](</attachments/obsidian-e010f2b08258aed6b3821ee5.png>)
*⏱ Timestamp: 00:23:40 · 📷 Lecture screenshot · [Watch clip (P33 00:23:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1420)*

---

### 4. Subject 3: Singular value decomposition (SVD) Calculating the error-prone trap

*(reference timestamp: 00:28:00)  [Watch clip (P33 00:28:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1680))*

Calculation of SVD in tests  $A = U \Sigma V^T$  The most easily cut link is **The number of sign alignments is negative.**!

#### 4.1 SVD traps in the symmetric matrix
Let  $A$  The real-valued function is a symmetric matrix whose eigenvalue is divisible by  $A = Q \Lambda Q^T$- This is with SVD.  $A = U \Sigma V^T$  Is that the same? 
**Key Difference: Odds must be  $\sigma_i \ge 0$  It's not negative!**
- If you  $A$  The first is that the negative eigenvalue (i.e.,  $\lambda = -3$ The corresponding odd values in SVD are:  $|\lambda| = +3$!
- This is a great opportunity to make sure  $A v_i = \sigma_i u_i$ The left odd vector  $u_i$  must be with the right odd vector  $v_i$  The difference is a negative: $u_i = -v_i$!

![singular value decomposition SVD Computation Codebook: SVD for symmetric matrix contrast to feature decompose (U aligned with V positive and negative)](</attachments/obsidian-915467946d068b56818eee86.png>)
*⏱ Timestamp: 00:28:30 · 📷 Lecture screenshot · [Watch clip (P33 00:28:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=1710)*

#### 4.2 rank 1 matrix SVD
Let  $A = u v^T$ (In the past,  $\|u\| = 1, \|v\| = 1$ It is a SVD that has already been created!
$$
A = \begin{bmatrix} u & u_2 \end{bmatrix} \begin{bmatrix} 1 & 0 \\ 0 & 0 \end{bmatrix} \begin{bmatrix} v^T \\ v_2^T \end{bmatrix}
$$
The only non-zero odd value is  $\sigma_1 = 1$ The remaining odd values are 0.

![Rank 1 projection matrix SVD split-table: A = u vT form of the odd value of a matrix with left/right odd vector](</attachments/obsidian-5c1275569fa1c83fe89e6925.png>)
*⏱ Timestamp: 00:33:40 · 📷 Lecture screenshot · [Watch clip (P33 00:33:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2020)*

---

### The core focus is on the truth/false.

*(reference timestamp: 00:38:00)  [Watch clip (P33 00:38:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2280))*

#### 5.1 Question 1: Is orthogonal matrix necessarily diagonalization?
**Judgment: correct (in the multiplex domain)  $\mathbb{C}$  In the** Because the orthogonal matrix satisfies  $Q^T Q = I \implies Q Q^T = Q^T Q$ It is a regular matrix, and it will have  $n$  The orthogonal replicates the eigenvector, so it is possible to play with diagonalization.

#### 5.2 Proposition 2: If  $A$  positive definite matrix, then  $A^{-1}$  What is positive definite?
**The judgment: Right!**
$A$  eigenvalue  $\lambda_i > 0$ The inverse matrix has an eigenvalue of  $\frac{1}{\lambda_i} > 0$. Symmetric squares eigenvalue full  $\iff$  Positive definite!

![The proof of diagonalization of an orthogonal matrix with positive definitematrixinverse matrixpositive definiteness](</attachments/obsidian-07bd56bd9d1808375eabee29.png>)
*⏱ Timestamp: 00:38:20 · 📷 Lecture screenshot · [Watch clip (P33 00:38:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2300)*

#### 5.3 Proposition 3: Is it necessary for two matrix of the same eigenvalue to be similar?
**Judgment: Wrong!**
 The classic counter-example:
$$
A = \begin{bmatrix} 2 & 0 \\ 0 & 2 \end{bmatrix} \quad \text{与} \quad B = \begin{bmatrix} 2 & 1 \\ 0 & 2 \end{bmatrix}
$$
Both. eigenvalue All of it.  $\lambda_1 = 2, \lambda_2 = 2$ But...  $A$  a measure of weight, and its kindred is but itself;  $B$  Missing eigenvector, unable to diagonalization. There is no similarity between them.

![The test is to identify the real and the fake. eigenvalue The same but no. diagonalization Similarity matrix Discrepancies](</attachments/obsidian-d20c25e066919e29589b3a67.png>)
*⏱ Timestamp: 00:42:30 · 📷 Lecture screenshot · [Watch clip (P33 00:42:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2550)*

#### 5.4 Proposition 4: Spectral characteristics of projection arrays and reflection arrays
- **The projection matrix $P^2 = P$)**: eigenvalue only  $\lambda = 1$  or  $\lambda = 0$; 
- **The reflective matrix $R^2 = I$)**: eigenvalue only  $\lambda = 1$  or  $\lambda = -1$!

![The projection matrix with reflective matrix spectral characteristics: P2 = P exports λ=0,1 and R2 = I exports λ =±1](</attachments/obsidian-9cd5de59faccdd2bf4ea08be.png>)
*⏱ Timestamp: 00:46:40 · 📷 Lecture screenshot · [Watch clip (P33 00:46:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=33&t=2800)*


---


<a id="lec-34"></a>
## Lecture 33: Left and Right Inverses; The Pseudoinverse

> 📺 **Video link back**: [B 34 P: Left and reverse to pseudoinverse](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34) (⏱ 41m 42s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-33-left-and-right-inverses-pseudoinverse/)  
> 💡 **Key ideas** The following is a list of the top-levels: A\_left−1=ATA) −1AT, followed by the top-down ranking A\_right−1=AT (AAT) −1 ∈ Row space to column space binary radiation theorem, Moore-Prosse pseudoinverse A+=VΣ+UT.

---

### 1. The classification of the four fundamental subspaces and the inverse matrix

*(reference timestamp: 00:03:00)  [Watch clip (P34 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=180))*

In classical primary linear algebra, we only have the **The Front** Definition of the inverse matrix: as and only as  $A$  For the  $n \times n$  and rank  $r = n$  When the $A^{-1} A = A A^{-1} = I$. null space on both sides is now down to zero vector  $N(A) = \{\mathbf{0}\}, N(A^T) = \{\mathbf{0}\}$.

But in the real world, most matrix are long-square. $m \ne n$ I'm not sure what the hell happened. $r < \min(m, n)$ Can we extend the concept of "reverse" to anything? matrix Professor Strang's based on matrix It's... rank  $r$  With size  $m, n$ The following is a list of the most common types of cluster names:

1. **The two-sided inverse is the opposite of the two-siding inverse.**: $r = m = n$ (rank) There is only one inverse matrix.  $A^{-1}$; 
2. **The first is the left-handedness.**: $r = n < m$ (full rank, high-thinness matrix)  $A_{\text{left}}^{-1} A = I_n$; 
3. **The first is the right-inverse.**: $r = m < n$ (full rank, thin matrix) and the right inverse makes it  $A A_{\text{right}}^{-1} = I_m$; 
4. **The first is the "Pseudoinverse".  $A^+$)**: $r < m$  and  $r < n$ The general rank loss matrix is a Moore-Prosse pseudoinverse constructed by orthogonal subspace constraints.

![Four basic subspace and invertible condition boards: square invertible r=m=n with reverse introduction around the long-axis matrix](</attachments/obsidian-4ad81ef978584704aa06a0c0.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P34 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=210)*

---

### 2. Fill in the rank with left-inverse matrix (Left Inverse)

*(reference timestamp: 00:07:00 )  [Watch clip (P34 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=420))*

Let  $A$  It's one.  $m \times n$  The matrix is linearly independent of each other. $r = n < m$): 
- null space  $N(A) = \{\mathbf{0}\}$ That means  $Ax = b$  If there is a clear explanation, **The only one** of the Lord,
- However, because the number of rows is greater than the number of columns, the number of equations is larger than the number that is unknown and is usually not solved;
- The symmetrical faces are linearly independent because of the number of lines.  $A^T A$  Yes, I did.  $n \times n$ **The reverse is strictly invertible** Oh, my God!

#### 2.1 Derivation of the left inverse formula
We are  $A$  The left side of the  $(A^T A)^{-1} A^T$: 
$$
\left( (A^T A)^{-1} A^T \right) A = (A^T A)^{-1} (A^T A) = I_n
$$
The standard is therefore **Left inverse matrix** is:
$$
\boxed{A_{\text{left}}^{-1} = (A^T A)^{-1} A^T}
$$
It's a  $n \times m$  The matrix, satisfied:
$$
A_{\text{left}}^{-1} A = I_n
$$

![Complete the rankmatrix with the left inverse matrix table: r = n\<m Exporting ATA invertible with the left reverse formula A\_left−1 = (ATA) −1AT](</attachments/obsidian-3db09eb72fe8df6e341ebaa6.png>)
*⏱ Timestamp: 00:07:30 · 📷 Lecture screenshot · [Watch clip (P34 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=450)*

#### 2.2 Inverted sequence multiplication: projecting back into column space
So if we reverse the multiplication order, we calculate  $A A_{\text{left}}^{-1}$: 
$$
A A_{\text{left}}^{-1} = A (A^T A)^{-1} A^T = P
$$
It's not a unit.  $I_m$ And that is what we are very familiar with. **to column space  $C(A)$  The orthogonal projection matrix  $P$** This perfectly explains the law of least squares: $\hat{x} = A_{\text{left}}^{-1} b$  So, we're going to have to solve for the least squares.  $A \hat{x} = P b = p$  It's right.  $b$  The best projection in column space!

![A\_left−1 A = I\_n and A\_leff−1 = P for the column space projection matrix](</attachments/obsidian-ef74b64cef84e1e2dbef3ac4.png>)
*⏱ Timestamp: 00:11:30 · 📷 Lecture screenshot · [Watch clip (P34 00:11:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=690)*

---

### 3. Line with rank and right inverse matrix (Right Inverse)

*(reference timestamp: 00:15:00)  [Watch clip (P34 00:15:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=900))*

Let  $A$  It's one.  $m \times n$  The matrix is linearly independent of each other. $r = m < n$): 
- The unknown number is greater than the number of equations (definite system of equations), and the right-handed term for any  $b$, $Ax = b$  There are always answers, and there are infinitely many;
- Left null space decreases to zero  $N(A^T) = \{\mathbf{0}\}$; 
- Symmetrical faction  $A A^T$  Yes, I did.  $m \times m$ **The reverse is strictly invertible** Oh, my God!

#### 3.1 Derivation of the right inverse formula
We are  $A$  The right side of the  $A^T (A A^T)^{-1}$: 
$$
A \left( A^T (A A^T)^{-1} \right) = (A A^T) (A A^T)^{-1} = I_m
$$
The standard is therefore **The right inverse matrix** is:
$$
\boxed{A_{\text{right}}^{-1} = A^T (A A^T)^{-1}}
$$
It's a  $n \times m$  The matrix, satisfied:
$$
A A_{\text{right}}^{-1} = I_m
$$

![Line up the rankmatrix with the right inverse matrix table: r = m\<n Export AAT invertible with the right reverse formula A\_right−1 = AT(AAT) −1](</attachments/obsidian-030fc53a3ec6cd780537c729.png>)
*⏱ Timestamp: 00:15:30 · 📷 Lecture screenshot · [Watch clip (P34 00:15:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=930)*

The reverse is in order:
$$
A_{\text{right}}^{-1} A = A^T (A A^T)^{-1} A = P_{\text{row}}
$$
It's in row space.  $C(A^T)$  The orthogonal projection matrix!  $x = A_{\text{right}}^{-1} b$  It's a lot of different things. **The smallest of the Euronews norm in row space**!

![A\_right−1 = I\_m and A\_right −1 A = P for the row space projection matrix](</attachments/obsidian-cf4cb4f14378c224444e1c76.png>)
*⏱ Timestamp: 00:20:20 · 📷 Lecture screenshot · [Watch clip (P34 00:20:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1220)*

---

### The final answer to any arbitrary matrix: Moore-Ross pseudoinverse

*(reference timestamp: 00:24:00 )  [Watch clip (P34 00:24:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1440))*

When the matrix ranks  $r < m$  and  $r < n$  The first is that the two sides of the same coin are not equal.
- $N(A)$  Non-zero, disrupting single-rays (different inputs may be mapped to the same zero output);
- $N(A^T)$  The first is that the data is not zero, it's full-speed destruction.  $b$  It's all in the column space.

![matrix's core contradiction book: null space destroys the existence of a pair that should be blocked by left null space](</attachments/obsidian-58bd6d0eb883d07884250f9a.png>)
*⏱ Timestamp: 00:24:30 · 📷 Lecture screenshot · [Watch clip (P34 00:24:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1470)*

#### 4.1 The one-to-one correspondence theorem of row space to column space
According to the Fundamental Theorem of Linear Algebra:
- The arbitrary vector  $x \in \mathbb{R}^n$  The only orthogonal can be divided into the row space and null space fractions: $x = x_{\text{row}} + x_{\text{null}}$; 
- $A x_{\text{null}} = \mathbf{0}$ So, what is the  $A x = A x_{\text{row}}$; 
- When you map it **Strictly restricted to row space  $C(A^T)$  with column space  $C(A)$  Between** The matrix.  $A$  It's a complete whole. **The two-rays (one in parallel and full)** Every row space vector!  $x \in C(A^T)$  The only corresponding column space vector is the  $y = A x \in C(A)$ And the opposite.

![Theoretical mapboard: A strictly invertible when limited to row space and column space](</attachments/obsidian-a2c222feb6b4325424ae4db0.png>)
*⏱ Timestamp: 00:28:40 · 📷 Lecture screenshot · [Watch clip (P34 00:28:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=1720)*

#### 4.2 Pseudoinverse  $A^+$  has the geometric definition
The name of the game is "Pseudoinversematrix".  $A^+$ (sized to be  $n \times m$) is defined as:
1. For any column space vector  $y \in C(A)$, $A^+ y = x$ (In the past,  $x \in C(A^T)$  and  $A x = y$); 
2. For any left null space vector  $y \in N(A^T)$, $A^+ y = \mathbf{0}$!

![Moore-Jones pseudoinverse (Pseudoinverse) Definition Book: A+ shows the column space back to row space and null space is shown to zero](</attachments/obsidian-8be284b897bda2e608682754.png>)
*⏱ Timestamp: 00:33:30 · 📷 Lecture screenshot · [Watch clip (P34 00:33:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2010)*

---

### 5. Pseudoinverse manifest construct formula based on SVD

*(reference timestamp: 00:36:00)  [Watch clip (P34 00:36:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2160))*

How to calculate pseudoinverse efficiently  $A^+$?
**The singular value decomposition (SVD) gives the ultimate obvious solution!**

It's known.  $A = U \Sigma V^T$. Hypocrisy requires a reverse order and a penultimate order:
$$
\boxed{A^+ = V \Sigma^+ U^T}
$$
The matrix is the angle between the two  $\Sigma^+$  The architecture is extremely elegant and intuitive:
- For all non-zero odd values  $\sigma_i > 0$ And count it down.  $\frac{1}{\sigma_i}$; 
- For all zero elements, keep it to 0!
$$
\Sigma^+ = \begin{bmatrix}
1/\sigma_1 & & & & \\
& \ddots & & & \\
& & 1/\sigma_r & & \\
& & & 0 & \\
& & & & \ddots
\end{bmatrix}_{n \times m}
$$

![Using the SVD construct a pseudoinverse formula book: A = UΣVT, extract A+ = VΣ + UT, and take the odd-numbered values](</attachments/obsidian-babeb03b25eadfe98d32eea2.png>)
*⏱ Timestamp: 00:36:40 · 📷 Lecture screenshot · [Watch clip (P34 00:36:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2200)*

#### 5.1 The general nature of the pseudoinverse
- If  $A$  Invertible, then  $A^+ = A^{-1}$; 
- If  $A$  The rank is filled with  $A^+ = (A^T A)^{-1} A^T$ (Left-to-left)
- If  $A$  The rank is full.  $A^+ = A^T (A A^T)^{-1}$ (Right to the left)
- The resulting equations are called the arbitrary inconsistentsystem of equations.  $Ax = b$, $x^+ = A^+ b$  It's always been **The least squares is the smallest error, and the only optimal solution to its own length norm**!

![The least squares smallest norm solution with the ultimate unified book: x+ = A+b gives the optimal shortest solution, and the four largest subspace integers](</attachments/obsidian-cc7fe31bd05d2db81ca449b6.png>)
*⏱ Timestamp: 00:40:30 · 📷 Lecture screenshot · [Watch clip (P34 00:40:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=34&t=2430)*


---


<a id="lec-35"></a>
## The final course review is the first in a series of three books.

> 📺 **Video link back**: [B-Stage 35 P: End of term with complete book summary](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35) (⏱ 43m 12s · 10 screenshots)  
> 📖 **Official material**: [MIT OCW correspondence and summary](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-34-final-course-review/)  
> 💡 **Key ideas** Fredholm's theory of choice, reverse constructions of the subspacematrix, steady convergence of the dynamical system, the whole book is a five-matrix breakdown into large groups (LU/QR/SΛS−1/QΛQT/UΣVT) and the whole class is summarized.

---

### 1. A panoramic review of the entire course:  $Ax = b$  The Singular Value decomposition

*(reference timestamp: 00:03:00)  [Watch clip (P35 00:03:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=180))*

This is the last class of the MIT 18.06 linear algebra course. Looking back on our entire semester, we started from the simplest binary system of linear equations, going all the way over the four fundamental subspaces: Goss elimination, orthogonal projection with least squares, determinant, eigenvalue with eigenvector, constant differential equation systems, symmetric matrixpositive definiteness, and finally to the singular value decomposition (SVD).

In this lecture, Professor Strang integrates all the core connections of the book into a system that refines the ultimate thought system of linear algebra.

#### 1.1 system of equations solvability theorem
For any  $m \times n$  Linear systems  $Ax = b$: 
- Whether there is a solution depends on the right end vector  $b$  The question is whether the matrix **Column space  $C(A)$**; 
- The geometric orthogonal complement perspective: According to the first part of the fundamental theorem, $C(A) \perp N(A^T)$; 
- So, here's what we need: **$Ax = b$  The necessary and sufficient condition is that the solution exists.  $b$  The vertical  $A^T$  The first is the left null space.**!
$$
\boxed{Ax = b \text{ 有解} \iff y^T b = 0 \quad (\forall y \in N(A^T))}
$$
This is the most famous example of applying the middle ground to mathematics.  **The theory of Fredholm's choice is the most common form of alternative theory.**.

![System of equations solvability conditions Ax = b with four fundamental subspacesorthogonal complement](</attachments/obsidian-055456d56f008dfa81314d18.png>)
*⏱ Timestamp: 00:03:30 · 📷 Lecture screenshot · [Watch clip (P35 00:03:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=210)*

---

### 2. Core Theme 1: Identification of the concept of matrix characteristics and reverse constructions

*(reference timestamp: 00:07:00 )  [Watch clip (P35 00:07:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=420))*

The most important test in the end-term examination is a conceptual analysis of:

1. **If  $A$  If the equation is linear and the eigenvalue is nonzero, then  $A$  It's not invertible.**?
   **That's right!**  Because  $\det(A) = \prod \lambda_i \ne 0$.
2. **If  $A$  The rank of the unknown number is less than $r < n$ (A)  $Ax = \mathbf{0}$  must have a nonzero solution**?
   **That's right!**  And that's because the number of free variables is equal to  $n - r > 0$, null spacedimension greater than 0.
3. **If  $A$  satisfy  $A^2 = \mathbf{0}$, the eigenvalue can only be zero**?
   **That's right!**  If you  $Ax = \lambda x$ The  $A^2 x = \lambda^2 x = \mathbf{0} \implies \lambda^2 = 0 \implies \lambda = 0$.
4. **$A$  and  $A^T$  It has the same eigenvalue as an eigenvector.**?
   **Half wrong!**  The eigenvalue is the same as the ZXQA (because  $\det(A^T - \lambda I) = \det(A - \lambda I)$ The eigenvector is usually quite different!

![Core Queue 1: matrix Authentication (rank, determinant, Reversibility and null space dimension)](</attachments/obsidian-c9405f17656c5c4770176dc9.png>)
*⏱ Timestamp: 00:07:30 · 📷 Lecture screenshot · [Watch clip (P35 00:07:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=450)*

#### 2.1 Reverse-engineered subspacematrix
*(reference timestamp: 12:00)  [Watch clip (P35 00:12:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=720))*

How do you construct a matrix in the inverse of a given subspace?  $3 \times 3$  The matrix, so that its column space contains vectors  $\begin{bmatrix} 1 \\ 0 \\ 1 \end{bmatrix}$ where null space contains vectors  $\begin{bmatrix} 1 \\ 1 \\ 0 \end{bmatrix}$. By using the basic theorem orthogonal complement relationship (line vector must be vertical to null space vector), the target matrix can be most elegantly replayed.

![Constructing subspace specific matrix boards: specify the inverse construction of column space and null space](</attachments/obsidian-b7dba349d2654070a60a3a72.png>)
*⏱ Timestamp: 00:12:40 · 📷 Lecture screenshot · [Watch clip (P35 00:12:40)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=760)*

![left null space with Fredholm's choice theorem: Ax=b is valid and only when b is vertically N (AT)](</attachments/obsidian-305539f28903b570ddbabe87.png>)
*⏱ Timestamp: 00:17:20 · 📷 Lecture screenshot · [Watch clip (P35 00:17:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1040)*

---

### Core Theme 2: orthogonal projection with least squares

*(reference timestamp: 00:22:00)  [Watch clip (P35 00:22:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1320))*

when  $Ax = b$  When there is no solution, we give up looking for the exact solution and instead look for the least possible error.  $\hat{x}$.

1. **The formal equation**: 
   $$
   (A^T A) \hat{x} = A^T b
   $$
2. **The best projection vector**: 
   $$
   p = A \hat{x} = A (A^T A)^{-1} A^T b = P b
   $$
3. **The geometry of the error vector**: 
   $$
   e = b - p = (I - P) b
   $$
   Error vector  $e$  The vector is perpendicular to each column space, so **Error vector  $e$  It's definitely in the left null space.  $N(A^T)$  In the middle**!
   $$
   A^T e = A^T (b - A \hat{x}) = \mathbf{0}
   $$

![projection matrix and least squares Board Book: Error vector e = b - p Geometric projection Image Vertically to column space](</attachments/obsidian-a96653cee5a6038b556bb852.png>)
*⏱ Timestamp: 00:22:30 · 📷 Lecture screenshot · [Watch clip (P35 00:22:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1350)*

---

### Core Theme 3: Matrix welding and power systems are becoming closer to convergence

*(reference timestamp: 00:27:00 )  [Watch clip (P35 00:27:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1620))*

Consider the system of differential equations:
$$
u_k = A^k u_0
$$
The first value vector is opened with the eigenvector: $u_0 = c_1 x_1 + \dots + c_n x_n$ The second.  $k$  The state of the step is:
$$
u_k = c_1 \lambda_1^k x_1 + c_2 \lambda_2^k x_2 + \cdots + c_n \lambda_n^k x_n
$$

**The three main convergence criteria**: 
1. **The stability approaches zero. $u_k \to \mathbf{0}$)**: All eigenvalue model lengths are strictly less than 1 ($|\lambda_i| < 1$); 
2. **The following is a list of the most commonly used methods for calculating the number of times the number of rows in a row is fixed:** The main eigenvalue  $\lambda_1 = 1$, the remaining eigenvalue model length is strict less than 1 ($|\lambda_i| < 1$ (A)  $u_k \to c_1 x_1$ The first is the "Markov matrix".
3. **The world is full of people, and they are all living in the same place.**: At least one eigenvalue exists  $|\lambda| > 1$.

![The matrix is a constant distribution of the matrix with Markov's stable table: u\_k = Ak u0 when k→∞ converges to λ=1](</attachments/obsidian-5fadc2c5be95c1760f110de5.png>)
*⏱ Timestamp: 00:27:20 · 📷 Lecture screenshot · [Watch clip (P35 00:27:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1640)*

---

### The Five Great Factorizations is a collection of five major matrix decompositions.

*(reference timestamp: 00:32:00)  [Watch clip (P35 00:32:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1920))*

The entire 18.06 course is made up of five large matrix decompositions that are the engines for all scientific computing and engineering modeling:

| Name of the group | expression | Matrix scope | Core mathematical thought | Main engineering applications |
| :--- | :--- | :--- | :--- | :--- |
| **LU decomposition** | $A = L U$ | The first is the "Gos elimination without a change of pace". | The method of decomposition of a triangle by degrees, Gauss elimination multiplying the number | Solving a system of equations, and finding an inverse matrix |
| **QR decoding** | $A = Q R$ | Any square matrix (full of rank) | Gram-Schmidt orthogonalization, a standard orthogonal basis | The least squares are solved by QR eigenvalue iteration |
| **Eigendecomposition** | $A = S \Lambda S^{-1}$ | Owned  $n$  The faction of an independent eigenvector | Similar to diagonalization, the eigenvector solves the dynamic system of a helium. | The matrix  $A^k$ The group of ordinary differential equations  $e^{At}$ |
| **Theory of splitting** | $A = Q \Lambda Q^T$ | The real symmetric matrix $A = A^T$) | The real numbers are spherical, orthogonal characteristic bases, energy secondary types | Theoretical and dynamic vibration models |
| **Singular value decomposition** | $A = U \Sigma V^T$ | **The right to vote  $m \times n$  The matrix!** | A bi-sided orthogonal base alignment, which defines the range to the value range | The first is the image compression, algorithms for recommendation, PCA, pseudoinverse. |

![The five main matrix decompositions are the following: LU, QR, SΛS−1, QΛQT, UΣVT Logical Evolution](</attachments/obsidian-2ea2a97d4de713ad28782089.png>)
*⏱ Timestamp: 00:32:10 · 📷 Lecture screenshot · [Watch clip (P35 00:32:10)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=1930)*

![matrix and orthogonal eigenvector family books: AAT = ATA dominated symmetry, opposed to the name orthogonal matrix](</attachments/obsidian-8676cfe5dbefb4ac714a85f5.png>)
*⏱ Timestamp: 00:36:30 · 📷 Lecture screenshot · [Watch clip (P35 00:36:30)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2190)*

---

### 6. The final outline of the SVD is in line with the curriculum

*(reference timestamp: 00:40:00 ·)  [Watch clip (P35 00:40:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2400))*

The SVD aligns the four basic subspace geometrically perfectly:
- A set of standard orthogonal bases in row space  $v_1, \dots, v_r$; 
- A set of standard orthogonal bases in a null space  $v_{r+1}, \dots, v_n$; 
- A set of standard orthogonal bases in column space  $u_1, \dots, u_r$; 
- A set of standard orthogonal bases in left null space  $u_{r+1}, \dots, u_m$.

The relationship is changed to the extreme:
$$
A v_i = \begin{cases} \sigma_i u_i, & i = 1, \dots, r \\ \mathbf{0}, & i = r+1, \dots, n \end{cases}
$$

![singular value decomposition (SVD) Final Panorama: row space to column space Perfect orthogonal Alignment and Subspace Panorama](</attachments/obsidian-6a7a4a9c03dc9400c29ba305.png>)
*⏱ Timestamp: 00:40:20 · 📷 Lecture screenshot · [Watch clip (P35 00:40:20)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2420)*

#### 6.1 Full text by Professor Strang
*(reference timestamp: 00:43:00)  [Watch clip (P35 00:43:00)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2580))*

In his applause, Professor Strang recalled:
> Linear algebra is not just a mathematical course, it's the general language of modern science, data science, artificial intelligence and engineering physics. By mastering subspace, orthogonality, spherical decomposition and SVD, you have the most acute eye to see all the high-dimensional structures.

The entire series of linear algebra video books at MIT 18.06 has been completed!

![Professor Strang's final thesis with the entire textbook: 21st century applied mathematics foundation stone of linear algebra](</attachments/obsidian-75561c8e381405d88e8e2ef8.png>)
*⏱ Timestamp: 00:42:50 · 📷 Lecture screenshot · [Watch clip (P35 00:42:50)](https://www.bilibili.com/video/BV1ix411f7Yp/?p=35&t=2570)*


---
