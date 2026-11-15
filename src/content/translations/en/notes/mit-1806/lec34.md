---
kind: notes
source: mit-1806/lec34
title: Lecture 34 · General Review
description: "General review: eight main lines and core test points that connect
  the entire course."
sourceHash: 8d8650c24bbfbb7d91a2134b697c385e57a9a7c44dbfa4407d7007720bc81846
publish: true
translationMethod: machine-assisted
---

> *Final course review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 34 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p35 · General review](https://www.bilibili.com/video/BV1ix411f7Yp?p=35)(43:26)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-34-final-course-review/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=35&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The last lecture ties together the entire course with exam questions from previous years. The questions seem scattered, but they actually cover the main line of the course: a question about  $3\times n$  A matrix question asks about rank, column space, null space, determinant and positive certainty; a column vector combination question asks about the column view of matrix multiplication and the uniqueness of the solution; an orthogonal question asks about projection; a Markov matrix question asks about eigenvalues, traces and steady states; several questions  $2\times2$  The construction question of the projection matrix and  $A=S\Lambda S^{-1}$  Pull back again; the last least squares question brings together projection, normal equations and fitting straight lines.

Reviewing is not about reading Lecture 33 over again. What should be remembered is a chain of cause and effect: $A\boldsymbol x=\boldsymbol b$  Whether it can be solved and whether the solution is unique depends on  $m,n,r$  Three numbers determine it; four basic subspaces are needed to see these three numbers clearly; rectangular matrices often have no solution, so they turn to orthogonality and projection, and use least squares to find the nearest solution; the determinant gives the square matrix a number, the eigenvalue gives the square matrix a set of directions, and positive certainty connects the two; the singular value decomposition (SVD) decomposes any matrix into "rotation-stretch-rotation", and linear transformation shows that the matrix is just the coordinates of a certain transformation under a set of basis. The following seven sections are developed according to this chain. The first six sections each use a set of test questions in this lecture as a skeleton, and the last section gathers the entire course into a map.

![Official Handout Summary Page 1/6](</attachments/mit1806-48c03ccbe9ebc08aa00221b0.png>)

*MIT OCW Official Lecture Notes Summary Page 1/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

## 1. Rank  $r$: $m$, $n$, $r$  Three numbers determine solvability and uniqueness

The question is this: $A$  is  $m\times n$, **rank** (rank) is  $r$  The matrix of $A\boldsymbol x=(1,0,0)^{\mathsf T}$  No solution, $A\boldsymbol x=(0,1,0)^{\mathsf T}$  There is exactly one solution. ask  $m,n,r$  To what extent can it be determined.

The right end is a three-dimensional vector, so  $m=3$. There is an unsolvable right end, indicating that not every row has a pivot: when elimination reaches the end, at least one row becomes a zero row. This row is a linear combination of the remaining rows, column space. $C(A)$  Just  $\mathbb R^3$  the true subspace of , then  $r<m$. Another condition is stronger: once there is a solution, there is only one solution, indicating nullspace. $N(A)$  There is nothing else except the zero vector, the number of free variables  $n-r=0$, that is  $r=n$, each column is linearly independent. The two conditions are one constraint row and one constraint column.  $r$  Sandwiched in the middle; conversely, the verification is also smooth: $r=m$  This will allow each right-hand side to have a solution, contradicting the first condition; $r<n$  It will make it impossible to have a unique solution, which is inconsistent with the second condition. Together



$$
r=n<m=3,\qquad n=r\le 2 .
$$



Specific examples can be taken



$$
A=\begin{bmatrix}0\\1\\0\end{bmatrix}.
$$



it is  $3\times1$, rank 1: $A\boldsymbol x=(0,1,0)^{\mathsf T}$  only  $x=1$, while  $(1,0,0)^{\mathsf T}$  Not in the column space, there is no solution. If you don’t want a matrix with only one column, add another column to the right  $(0,0,1)^{\mathsf T}$, get  $3\times2$, $r=n=2$  The matrix of , the column space becomes  $yz$  plane, $(1,0,0)^{\mathsf T}$  Still can't figure it out. This question states that "there is a solution if and only if  $\boldsymbol b\in C(A)$” and “only if and only if  $N(A)=\{\boldsymbol 0\}$"The two criteria were used at the same time.

![Video 00:04:21: Classroom blackboard writing](</attachments/mit1806-e76c072df484cc3a5c6f3026.jpg>)

*Video 00:04:21｜Approximately corresponding to Section 1 "1. Rank  $r$: $m$, $n$, $r$  Three numbers determine solvability and uniqueness".*

## 2. $A^{\mathsf T}A$  with  $AA^{\mathsf T}$: Determinant, symmetry, positive certainty

The same question then asks three questions about whether they are true or false. The purpose is to squeeze several clues from the entire course into a matrix. Still take the top  $3\times2$  example, at this time  $m=3$, $n=r=2$.

**First sentence: $\det(A^{\mathsf T}A)=\det(AA^{\mathsf T})$.**  False. $A^{\mathsf T}A$  is  $2\times2$, $AA^{\mathsf T}$  is  $3\times3$, the two determinants are of fundamentally different orders. In this case  $A^{\mathsf T}A=I_2$, the determinant is 1; $AA^{\mathsf T}=\operatorname{diag}(0,1,1)$, the determinant is 0. What is really established is the difference between square matrices of the same order.  $\det(AB)=\det(BA)$:If  $A$  It is a square matrix itself, then



$$
\det(A^{\mathsf T}A)=\det(A^{\mathsf T})\det(A)=(\det A)^2=\det(A)\det(A^{\mathsf T})=\det(AA^{\mathsf T}).
$$



So this judgment is wrong  $A$  It's not a square matrix, it's not the multiplicative property of the determinant that's wrong.

**Second sentence: $A^{\mathsf T}A$  Reversible.**  True. Generally, $A^{\mathsf T}A$  reversible if and only if  $A$  The columns of are linearly independent, that is,  $r=n$. The key is  $A^{\mathsf T}A$  with  $A$  have the same null space: $A\boldsymbol x=\boldsymbol 0$  given naturally  $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$; conversely if  $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$, multiply left  $\boldsymbol x^{\mathsf T}$  Got  $\|A\boldsymbol x\|^2=0$, there are still  $A\boldsymbol x=\boldsymbol 0$. This question  $r=n$, the null space only has zero vectors, $A^{\mathsf T}A$  Reversible - in this case it happens to be the identity matrix.

**The third sentence: $AA^{\mathsf T}$  Right concentration.**  False. $AA^{\mathsf T}$  is always a symmetric matrix, always a square matrix, here again  $3\times3$, but its rank is equal to  $r=2$, dissatisfied with rank. The reason is  $AA^{\mathsf T}\boldsymbol y=\boldsymbol 0$  with  $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$  Same solution (left multiplication  $\boldsymbol y^{\mathsf T}$  can deduce the latter from the former), so  $N(AA^{\mathsf T})=N(A^{\mathsf T})$, dimension  $m-r=1$, the rank is only  $m-(m-r)=r$. So there is non-zero  $\boldsymbol y$  such that  $AA^{\mathsf T}\boldsymbol y=\boldsymbol 0$, that is  $\boldsymbol y^{\mathsf T}AA^{\mathsf T}\boldsymbol y=0$, violate **positive definite** (positive definite) requires "for everything" $\boldsymbol y\ne\boldsymbol 0$  Yes  $\boldsymbol y^{\mathsf T}M\boldsymbol y>0$". This example  $AA^{\mathsf T}=\operatorname{diag}(0,1,1)$, the first line is all zeros. The correct statement that can be established is **positive semidefinite** (positive semidefinite): for any  $\boldsymbol y$,



$$
\boldsymbol y^{\mathsf T}AA^{\mathsf T}\boldsymbol y=\|A^{\mathsf T}\boldsymbol y\|^2\ge 0,
$$



And  $m>r$  left nullspace $N(A^{\mathsf T})$  It is non-trivial, and the equal sign can be obtained, so it cannot be strengthened into positive determination. This word "half" corresponds exactly to  $m-r>0$.

By the way, I can answer another little question: Find one that cannot be written as  $B^{\mathsf T}B$  real matrix. $B^{\mathsf T}B$  It must be symmetric, so just give any asymmetric matrix, for example



$$
\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



What really needs to be remembered is  $B^{\mathsf T}B$  Two structural properties of: symmetry and positive semi-definite.

Arranging the dimensions of the four fundamental subspaces together, these judgments have a unified basis:



$$
\dim C(A)=r,\quad \dim N(A)=n-r,\quad \dim C(A^{\mathsf T})=r,\quad \dim N(A^{\mathsf T})=m-r .
$$



The four dimensions of this question are in order  $2,0,2,1$. The last item is the key to the next question: $A^{\mathsf T}$  is  $2\times3$, number of rows  $n=2$  is equal to rank and full of rank, so  $A^{\mathsf T}\boldsymbol y=\boldsymbol c$  for each  $\boldsymbol c\in\mathbb R^2$  There are solutions; and  $N(A^{\mathsf T})$  It is one-dimensional and has one free variable, so there are infinite solutions. Replace with  $A^{\mathsf T}$  after  $m$  with  $n$  The role reversal is the easiest to miscalculate.

![Official Handout Summary Page 2/6](</attachments/mit1806-37872d1c9aaa4eda59c91246.png>)

*MIT OCW Official Lecture Notes Summary Page 2/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

## 3. Combination of columns, null space and uniqueness of solution

The second question is for  $A=[\boldsymbol v_1\ \boldsymbol v_2\ \boldsymbol v_3]$, first solve  $A\boldsymbol x=\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3$. The column view of a matrix multiplied by a vector is



$$
A\boldsymbol x=x_1\boldsymbol v_1+x_2\boldsymbol v_2+x_3\boldsymbol v_3,
$$



The coefficient group has been written on the right end, and you can get it by comparing



$$
\boldsymbol x=\begin{bmatrix}1\\-1\\1\end{bmatrix}.
$$



This is the most basic way to read matrix multiplication: the product is  $x$  linear combination of components.

Then ask: If  $\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3=\boldsymbol 0$, is the solution unique? Not unique. This equation is equivalent to  $\boldsymbol v_3=\boldsymbol v_2-\boldsymbol v_1$, the third column falls in the plane formed by the first two columns; at this time  $\boldsymbol x=(1,-1,1)^{\mathsf T}$  falls in the null space, any solution plus it is still a solution, because  $A(\boldsymbol x+\boldsymbol\xi)=A\boldsymbol x$. Uniqueness has always been associated with null space: $N(A)=\{\boldsymbol 0\}$  Equivalent to  $r=n$, which is equivalent to each column being linearly independent. On the other hand, if the three columns are linearly independent and the combination is zero, it can only be inferred that all three coefficients are zero. $N(A)$  Only the zero vector remains, and the solution is unique. As long as you find that one column is a combination of the other columns, you already know that the rank is insufficient and the solution is not unique; this is two sides of the same thing as the condition of "exactly one solution" in Section 1.

## 4. Orthogonal projection: closest point, projection matrix and least squares

Projection is the answer to "What to do when there is no solution?" This section connects the three projections in the course.

Let’s look at the orthonormal case first. If  $\boldsymbol v_1,\boldsymbol v_2,\boldsymbol v_3$  orthonormal (usually rewritten as  $\boldsymbol q_1,\boldsymbol q_2,\boldsymbol q_3$), ask  $\operatorname{span}\{\boldsymbol v_1,\boldsymbol v_2\}$  Zhongli  $\boldsymbol v_3$  Which combination is the closest point. The answer is  $0\cdot\boldsymbol v_1+0\cdot\boldsymbol v_2=\boldsymbol 0$: Three vectors are orthogonal to each other, $\boldsymbol v_3$  Perpendicular to the entire plane, its projection on the plane is the zero vector. Use standard basis  $\boldsymbol e_1,\boldsymbol e_2,\boldsymbol e_3$  Thinking about it again makes it clearest——$xy$  away from the plane  $\boldsymbol e_3$  The closest point is the origin.

Look at another straight line. passed  $\boldsymbol a=(4,-3)$  is a straight line, its projection matrix is



$$
P=\frac{\boldsymbol a\boldsymbol a^{\mathsf T}}{\boldsymbol a^{\mathsf T}\boldsymbol a}=\frac1{25}\begin{bmatrix}16&-12\\-12&9\end{bmatrix}.
$$



The principle of the formula is the same as that of least squares: the points on the straight line are  $\boldsymbol a$  multiples of  $\boldsymbol b$  Throw it over, the coefficient is  $\boldsymbol a^{\mathsf T}\boldsymbol b/\boldsymbol a^{\mathsf T}\boldsymbol a$. Each column of the resulting matrix is  $\boldsymbol a$  A multiple of , rank is 1; it is symmetrical; projecting the vector on the straight line again remains unchanged, that is  $P^2=P$.

Finally, there is a complete calculation example. Set



$$
A=\begin{bmatrix}1&0\\1&1\\1&2\end{bmatrix},\qquad \boldsymbol b=\begin{bmatrix}3\\4\\1\end{bmatrix},\qquad \boldsymbol x=\begin{bmatrix}c\\d\end{bmatrix},
$$



The first column corresponds to the constant term, and the second column corresponds to  $t=0,1,2$, so  $c$  is the intercept, $d$  is the slope. Three equations with two unknowns generally have no solution; **least squares** (least squares) solution  $\hat{\boldsymbol x}$  satisfy **normal equation**(normal equations)



$$
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b .
$$



This equation comes from orthogonality: the residuals of least squares  $\boldsymbol b-A\hat{\boldsymbol x}$  Must be with  $C(A)$  Each vector in is orthogonal to  $A$  Each column of is orthogonal, that is,  $A^{\mathsf T}(\boldsymbol b-A\hat{\boldsymbol x})=\boldsymbol 0$, the shifted term is the normal equation. In this example, the two columns are linearly independent. $\det(A^{\mathsf T}A)=3\cdot5-3\cdot3=6\ne0$, so  $\hat{\boldsymbol x}$  Only.

Work it out item by item  $A^{\mathsf T}A=\begin{bmatrix}3&3\\3&5\end{bmatrix}$, $A^{\mathsf T}\boldsymbol b=(8,6)^{\mathsf T}$, the solution is



$$
\hat c=\frac{11}{3},\qquad \hat d=-1 .
$$



put  $\hat c,\hat d$  Replacing: $A^{\mathsf T}A\hat{\boldsymbol x}$  The two components of are respectively  $3\hat c+3\hat d=8$, $3\hat c+5\hat d=6$, exactly equal to  $A^{\mathsf T}\boldsymbol b$. The projection vector is



$$
\boldsymbol p=A\hat{\boldsymbol x}=\frac{11}{3}\begin{bmatrix}1\\1\\1\end{bmatrix}-\begin{bmatrix}0\\1\\2\end{bmatrix}
=\begin{bmatrix}11/3\\8/3\\5/3\end{bmatrix},
$$



it is  $\boldsymbol b$  in column space  $C(A)$  The projection on; the corresponding fitting straight line is  $y=\frac{11}{3}-t$, in  $t=0,1,2$  The heights at are in order  $11/3,8/3,5/3$, with data  $3,4,1$  closest. Generally, to  $C(A)$  The projection matrix is  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$, calculated according to the straight line formula above  $P$  is it in  $n=1$  special case.

Last question: Find a non-zero one  $\boldsymbol b$, so that the least squares solution is zero. The condition is  $\boldsymbol b$  Orthogonal to both columns, that is  $A^{\mathsf T}\boldsymbol b=\boldsymbol 0$;at this time  $\boldsymbol b$  The projection onto the column space is zero and the normal equation gives  $A^{\mathsf T}A\hat{\boldsymbol x}=\boldsymbol 0$, while  $A^{\mathsf T}A$  Reversible (column independent), so  $\hat{\boldsymbol x}=\boldsymbol 0$. take



$$
\boldsymbol b=\begin{bmatrix}1\\-2\\1\end{bmatrix},
$$



it is related to  $(1,1,1)^{\mathsf T}$  and  $(0,1,2)^{\mathsf T}$  The inner products of are all 0. Geometrically, $\boldsymbol b$  The whole falls  $C(A)$  In the orthogonal complement of , the column space vector closest to it can only be zero.

![Official Handout Summary Page 3/6](</attachments/mit1806-f4bbe0b5248c1b99b17a0dc3.png>)

*MIT OCW Official Lecture Notes Summary Page 3/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

![Video 00:18:11: Classroom blackboard writing](</attachments/mit1806-01c15a5ddeb707607cdba145.jpg>)

*Video 00:18:11 \| Approximately corresponding to Section 4 "4. Orthogonal projection: closest point, projection matrix and least squares".*

![Video 00:23:55: Classroom blackboard writing](</attachments/mit1806-b05ebc3fabf5bb0f1caa070c.jpg>)

*Video 00:23:55 \| Approximately corresponding to Section 4 "4. Orthogonal projection: closest point, projection matrix and least squares".*

## 5. Eigenvalues, diagonalization and matrix reconstruction from eigenpairs

back again  $2\times2$  Question: Ask for one  $2\times2$  matrix, the eigenvalues are  $0$  and  $3$, the corresponding eigenvectors (eigenvector) are respectively  $(1,2)^{\mathsf T}$  with  $(2,1)^{\mathsf T}$. This time the direction is reversed - usually eigenvalues ​​are found for matrices, here matrices are found for eigenpairs.

Arrange feature vectors in columns  $S$, the eigenvalues are arranged in a diagonal matrix  $\Lambda$, then  $AS=S\Lambda$, so



$$
A=S\Lambda S^{-1},\qquad
S=\begin{bmatrix}1&2\\2&1\end{bmatrix},\quad
\Lambda=\begin{bmatrix}0&0\\0&3\end{bmatrix}.
$$



The reason is simple: $S$  The columns of are feature vectors, $AS=S\Lambda$  But it is  $A\boldsymbol x_i=\lambda_i\boldsymbol x_i$  Write this set of equations side by side; multiply both sides by the right  $S^{-1}$  Just solve it  $A$.$S$  The determinant of is  $-3$, so  $S^{-1}=-\frac13\begin{bmatrix}1&-2\\-2&1\end{bmatrix}$. Multiply:



$$
S\Lambda=\begin{bmatrix}0&6\\0&3\end{bmatrix},\qquad
A=\begin{bmatrix}0&6\\0&3\end{bmatrix}\begin{bmatrix}-1/3&2/3\\2/3&-1/3\end{bmatrix}
=\begin{bmatrix}4&-2\\2&-1\end{bmatrix}.
$$



Verify: $A(1,2)^{\mathsf T}=(0,0)^{\mathsf T}=0\cdot(1,2)^{\mathsf T}$, $A(2,1)^{\mathsf T}=(6,3)^{\mathsf T}=3\cdot(2,1)^{\mathsf T}$, both feature pairs are correct. The premise for this structure to be established is that  $S$  Reversible, that is, the two eigenvectors are linearly independent, that is, the matrix can **diagonalization** (diagonalization); when the feature vector is not enough  $S$  If it cannot be taken out, the matrix cannot be diagonalized.

There is another question in the same group of questions: Give a matrix that has orthogonal eigenvectors but is not symmetric.  $2\times2$  matrix. The eigenvectors of symmetric matrices can be orthogonal, which is a familiar family; but orthogonal eigenvectors are not exclusive to it. Antisymmetric matrix (skew-symmetric matrix) such as



$$
\begin{bmatrix}0&-1\\1&0\end{bmatrix}
$$



The characteristic value of is  $\pm\mathrm i$, the eigenvectors are complex vectors and orthogonal to each other; orthogonal matrices such as rotation matrices  $\begin{bmatrix}\cos\theta&-\sin\theta\\\sin\theta&\cos\theta\end{bmatrix}$  Same thing. Therefore, "eigenvector orthogonality" cannot infer "matrix symmetry".

![Official Handout Summary Page 4/6](</attachments/mit1806-ace7163275e3b99324abd596.png>)

*MIT OCW Official Lecture Notes Summary Page 4/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

![Video 00:28:14: Classroom blackboard writing](</attachments/mit1806-784c91cff21496d72d732ec0.jpg>)

*Video 00:28:14 \| Approximately corresponding to Section 5 "5. Eigenvalues, diagonalization and matrix reconstruction from eigenpairs".*

## 6. Markov matrix and long-term steady state

The question about Markov matrix is a  $3\times3$  A matrix where the elements in each column are nonnegative and sum to 1:



$$
A=\begin{bmatrix}0.2&0.4&0.3\\0.4&0.2&0.3\\0.4&0.4&0.4\end{bmatrix}.
$$



Find its three eigenvalues. Let’s first look at the relationship between columns: the first column plus the second column is equal to twice the third column, that is  $\boldsymbol a_1+\boldsymbol a_2=2\boldsymbol a_3$, the three columns are linearly related, so  $A$  singular, $\lambda_1=0$, the null space contains  $(1,1,-2)^{\mathsf T}$. And since the sum of each column is 1, $A^{\mathsf T}(1,1,1)^{\mathsf T}=(1,1,1)^{\mathsf T}$, so  $\lambda_2=1$  Also  $A$  eigenvalues ($A$  with  $A^{\mathsf T}$  have the same eigenvalues, but  $\lambda=1$  Belong to  $A$  The eigenvectors of are also required separately). The last one is determined by the trace: the sum of the diagonals is  $0.2+0.2+0.4=0.8$, and the sum of eigenvalues is equal to the trace, so  $0+1+\lambda_3=0.8$, $\lambda_3=-0.2$.

Then let the process take place. Set  $\boldsymbol u_k=A^k\boldsymbol u_0$, initial value  $\boldsymbol u_0=(0,10,0)^{\mathsf T}$, that is, ten individuals start from the second state. put  $\boldsymbol u_0$  Expand by eigenvectors,



$$
\boldsymbol u_k=c_1 0^k\boldsymbol x_1+c_2 1^k\boldsymbol x_2+c_3(-0.2)^k\boldsymbol x_3 .
$$



when  $k\ge1$, the items corresponding to zero eigenvalues disappear immediately; $(-0.2)^k$  The amplitude of is getting smaller and smaller, the signs alternate, and it tends to zero; only  $1^k$  Which one is left, the limit is  $c_2\boldsymbol x_2$, this is **Steady state**(steady state).$\lambda=1$  The eigenvector solution of  $(A-I)\boldsymbol x=\boldsymbol 0$:



$$
A-I=\begin{bmatrix}-0.8&0.4&0.3\\0.4&-0.8&0.3\\0.4&0.4&-0.6\end{bmatrix},\qquad
\boldsymbol x_2=\begin{bmatrix}3\\3\\4\end{bmatrix},
$$



Line by line verification  $(A-I)\boldsymbol x_2=\boldsymbol 0$  All are established. coefficient  $c_2$  There is no need to solve a linear system of equations: the Markov process neither increases nor decreases, the sum of the components remains the same, the initial total is 10, and  $\boldsymbol x_2$  The sum of the components of is exactly 10, so  $c_2=1$, the steady state is



$$
\boldsymbol u_\infty=\begin{bmatrix}3\\3\\4\end{bmatrix}.
$$



The standard routine for this type of question is: use the column sum to be 1 to get  $\lambda=1$, use Strange to get  $\lambda=0$, use trace to get the last eigenvalue, and then use eigenvector expansion to see the long-term limit.

## 7. Whole course map: eight main lines and four decompositions

Arrange today's questions according to the main line of the course, and a map of the entire course will appear.

**Elimination and LU.**  The number of pivots is the rank; if there is a pivot in each row, there is a solution to any right end; if there is no pivot, a certain row is a combination of the other rows. elimination bar  $A$  written as  $LU$;When there is row exchange, it is written as  $PA=LU$, among which  $P$  is the permutation matrix. And  $|\det A|$  Equal to the product of the pivots, swapping rows will bring only one symbol.

**four subspaces.**  Column space and null space, row space and left null space, the dimensions are respectively  $r,n-r,r,m-r$;The null space is the orthogonal complement of the row space, and the left null space is the orthogonal complement of the column space. Section 2 that  $A^{\mathsf T}\boldsymbol y=\boldsymbol c$  There are infinite solutions, the dimension is used  $m-r$.

**Orthographic projection.** $A^{\mathsf T}A$  Invertible if and only if columns are independent; projection matrix  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  put  $\boldsymbol b$  vote to  $C(A)$;The least squares solution is given by the normal equation  $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$  is given; Gram-Schmidt orthogonalization gives  $A=QR$.

**determinant.** $\det(AB)=\det A\det B$, $\det A^{\mathsf T}=\det A$, $|\det A|$  It is the product of the principal element and the volume; $\det A\ne0$  if and only if  $A$  Reversible. One more reminder: $\det(AB)=\det(BA)$  Only talk between phalanxes of the same level.

**Eigenvalues.**  solution  $\det(A-\lambda I)=0$  Get the roots of the characteristic polynomial; $A=S\Lambda S^{-1}$  Transform the power, exponent, and difference equations of the matrix into pairs of eigenvalues and calculate them one by one; the eigenvalues of the Markov matrix satisfy  $|\lambda|\le1$  And there must be  $\lambda=1$, when the absolute values of the remaining eigenvalues are less than 1, the long-term behavior is determined by  $\lambda=1$  Determined by the eigenvector.

**Positive certainty.**  Positive definite means that the symmetric matrix is non-zero for all  $\boldsymbol x$  All  $\boldsymbol x^{\mathsf T}A\boldsymbol x>0$, which is equivalent to all eigenvalues being positive, all principals being positive, and all leading principal minors being positive. $A^{\mathsf T}A$  Positive definite when the columns are independent, $AA^{\mathsf T}$  in  $m>r$  Time can only be semi-positive.

**SVD.**  Any matrix—including rectangular matrices and singular matrices—can be written as  $A=U\Sigma V^{\mathsf T}$, that is, "rotation-stretch-rotation"; the number of non-zero singular values is equal to the rank, and low-rank approximation is the source of image compression. It is the last decomposition of the course and the most general decomposition.

**Linear transformation.**  After selecting the basis, the linear transformation is a matrix; changing a set of basis (change of basis), the matrix becomes  $M^{-1}AM$, similar matrices represent the same transformation.

When reviewing, do not remember by "which lecture", but by "which decomposition and subspace this question is asking about." Today’s question is just a rearrangement of eight main lines: rank, four subspaces, determinants, and positive certainty are squeezed into the first question. Projection and least squares are combined into one group, and eigenvalues ​​and Markov processes are combined into another group.

![Official Handout Summary Page 5/6](</attachments/mit1806-d23f0fe1d90ab91993048dc9.png>)

*MIT OCW Official Lecture Notes Summary Page 5/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

![Video 00:39:05: Classroom blackboard writing](</attachments/mit1806-3b6db515b7704d13be45b72e.jpg>)

*Video 00:39:05 \| Approximately corresponding to section 7 "7. Whole lesson map: eight main lines and four decompositions".*

![Official Handout Summary Page 6/6](</attachments/mit1806-9fe79f3c9f78e14e6109faec.png>)

*MIT OCW Official Lecture Notes Summary Page 6/6 (18.06SC Lecture 34 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **rank** Decide everything: $A\boldsymbol x=\boldsymbol b$  to someone  $\boldsymbol b$  There is no solution if and only if  $r<m$;When there is a solution, the solution is unique if and only if  $r=n$. The answer to the first question in this lecture is  $r=n\le2<m=3$.
- The dimensions of the four basic subspaces are  $r$, $n-r$, $r$, $m-r$; $A^{\mathsf T}\boldsymbol y=\boldsymbol c$  At full row rank, for each  $\boldsymbol c$  has solution, null space dimension  $m-r$  Gives infinite solutions.
- $\det(A^{\mathsf T}A)=\det(AA^{\mathsf T})$  This is only true for square matrices of the same order; for rectangular matrices, $A^{\mathsf T}A$  with  $AA^{\mathsf T}$  The order is different, $r=n$  When the former is reversible (in this case,  $I_2$), the latter rank is still  $r$, must be strange.
- $B^{\mathsf T}B$  Must be symmetrical and semi-positive definite; positive definite requires that everything is non-zero  $\boldsymbol x$  Yes  $\boldsymbol x^{\mathsf T}M\boldsymbol x>0$, so  $AA^{\mathsf T}$  in  $m>r$  Time can only be semi-positive definite.
- In column view  $A\boldsymbol x$  is a linear combination of columns: $A\boldsymbol x=\boldsymbol v_1-\boldsymbol v_2+\boldsymbol v_3$  The solution is  $(1,-1,1)^{\mathsf T}$; If the combination is zero, this vector is in the null space and the solution is not unique.
- Projection matrix: over  $\boldsymbol a=(4,-3)$  The straight line corresponding to  $P=\frac1{25}\begin{bmatrix}16&-12\\-12&9\end{bmatrix}$;Standard orthogonal  $\boldsymbol v_3$  Arrive  $\operatorname{span}\{\boldsymbol v_1,\boldsymbol v_2\}$  The closest point is zero.
- Least squares: $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$, examples are  $\hat c=11/3$, $\hat d=-1$, projection  $\boldsymbol p=(11/3,8/3,5/3)^{\mathsf T}$, fitting straight line  $y=11/3-t$; $\boldsymbol b\perp C(A)$  time  $\hat{\boldsymbol x}=\boldsymbol 0$.
- Reconstruct the matrix from the feature pairs using  $A=S\Lambda S^{-1}$, examples are  $A=\begin{bmatrix}4&-2\\2&-1\end{bmatrix}$; Orthogonal eigenvectors are not unique to symmetric matrices, but also to antisymmetric matrices and rotation matrices (orthogonal in the sense of complex vectors).
- The Markov matrix column sum is 1, so  $\lambda=1$;The three eigenvalues of the example question are  $0,1,-0.2$, steady-state eigenvector  $(3,3,4)^{\mathsf T}$, the coefficient 1 is derived from the conservation of total quantity, $\boldsymbol u_\infty=(3,3,4)^{\mathsf T}$.
- The whole lesson is summarized into eight themes and four decompositions: elimination ($LU$), orthogonalization ($QR$), diagonalization ($S\Lambda S^{-1}$), singular value decomposition ($U\Sigma V^{\mathsf T}$), with four subspaces, determinants and positive definiteness.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| rank | rank | The number of pivots is the dimension of both column space and row space. |
| pivot | pivot | The key number used to eliminate the lower elements in elimination, its number is equal to the rank |
| column space | column space | $A$  all linear combinations of columns, $\boldsymbol b$  The equation has a solution when it falls in |
| nullspace | null space | satisfy  $A\boldsymbol x=\boldsymbol 0$  of all  $\boldsymbol x$, the dimension is  $n-r$ |
| row space | row space | The space spanned by each row has a dimension of  $r$, is the orthogonal complement of the null space |
| left nullspace | left null space | satisfy  $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$  of  $\boldsymbol y$, the dimension is  $m-r$ |
| determinant | determinant | A number corresponding to a square matrix is zero if and only if the matrix is singular |
| positive definite | positive definite | Symmetric matrix and non-zero for everything  $\boldsymbol x$  Yes  $\boldsymbol x^{\mathsf T}A\boldsymbol x>0$ |
| positive semidefinite | positive semidefinite | to everything  $\boldsymbol x$  Yes  $\boldsymbol x^{\mathsf T}A\boldsymbol x\ge0$, allowing the existence of non-zero vectors equal to 0 |
| projection matrix | projection matrix | The matrix that projects the vector onto the subspace, the straight line case is  $\boldsymbol a\boldsymbol a^{\mathsf T}/\boldsymbol a^{\mathsf T}\boldsymbol a$ |
| least squares | least squares | Ask for help when there is no solution  $\|A\boldsymbol x-\boldsymbol b\|$  smallest  $\boldsymbol x$ |
| normal equations | normal equation | $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$, the least squares solution of the equation |
| orthonormal | orthogonal | A set of vectors that are pairwise orthogonal and of length 1 |
| eigenvalue | eigenvalue | such that  $A\boldsymbol x=\lambda\boldsymbol x$  has a non-zero solution  $\lambda$ |
| eigenvector | eigenvector | Be  $A$  A non-zero vector that maps to a multiple of itself |
| characteristic polynomial | characteristic polynomial | $\det(A-\lambda I)$, whose root is exactly the eigenvalue |
| diagonalization | diagonalization | written as  $A=S\Lambda S^{-1}$, $S$  The columns of are linearly independent eigenvectors |
| trace | trace | The sum of the diagonal elements is equal to the sum of all eigenvalues |
| Markov matrix | Markov matrix | A square matrix whose columns are non-negative and whose column sum is 1 must have the eigenvalue 1 |
| steady state | Steady state | The distribution that tends to remain unchanged after a long period of time is given by  $\lambda=1$  Characteristic vector description of |
| skew-symmetric matrix | antisymmetric matrix | satisfy  $A^{\mathsf T}=-A$  matrix, the eigenvalues are pure imaginary numbers |
| symmetric matrix | symmetric matrix | satisfy  $A^{\mathsf T}=A$  The matrix of can be orthogonally diagonalized |
| singular value decomposition | singular value decomposition | Any matrix is written as  $U\Sigma V^{\mathsf T}$, that is, rotate-stretch-rotate |
| linear transformation | linear transformation | Maintain the mapping between addition and multiplication, represented by a matrix after selecting the basis |
| change of basis | basis transformation | Change a group of bases, and the matrix is  $M^{-1}AM$  change to represent the same transformation |
| similar matrices | similarity matrix | satisfy  $B=M^{-1}AM$  A pair of matrices with the same eigenvalues |

---

[← Lecture 33](/en/notes/mit-1806/lec33) ｜ [Course Catalog](/en/notes/mit-1806/overview)
