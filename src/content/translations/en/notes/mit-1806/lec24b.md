---
kind: notes
source: mit-1806/lec24b
title: Lecture 24b · Second Test Review
description: "Review Part 2: Orthogonality, Projection, Determinants, and Eigenvalues."
sourceHash: 4d3551e1299c9a9fe5babf9cefece522a58880d49b3abc81b7e65a179ab1b6b6
publish: true
translationMethod: machine-assisted
---

> *Quiz 2 review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 24b / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p25 · Second test review](https://www.bilibili.com/video/BV1ix411f7Yp?p=25)(48:20)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24b-quiz-2-review/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=25&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The second test tests all the content of the second part of the course: orthogonality (including projection, least squares, Gram-Schmidt), determinant, and the two most basic sections of eigenvalue equations - solutions  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, diagonalization, calculation  $A^k$. These three pieces seem to be separate chapters, but they actually share the same language: use "a number" to summarize a certain aspect of the matrix (length, determinant, trace), and use "a set of directions" to describe the function of the matrix (base, eigenvector). The meaning of the review class is to re-sew them into a net, so that one question uses the tools of three chapters at the same time.

There is a boundary to the range to keep in mind: differential equations and matrix exponents are not part of this test; they belong to the third test. In other words, the eigenvalue section only tests "finding eigenvalues, writing diagonalizations, and calculating the power of matrices" and does not test  $e^{At}$.

This lecture is organized according to "Test Points - Methods - Typical Questions". Each test point first gives the formulas or criteria that must be remembered, then goes through the specific numbers from previous years' test questions, and finally points out the most likely mistakes. Most of these questions are short questions that can be completed in three to five minutes: finding a projection matrix, checking a determinant, and counting eigenvalues. Whether you can finish it quickly does not depend on how many formulas you have memorized, but on whether you can immediately judge "which box this number should be placed in."

![Official Handout Summary Page 1/6](</attachments/mit1806-07ee6fc3f3f793347463f141.png>)

*MIT OCW Official Lecture Notes Summary Page 1/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

## 1. Review the map: three sections and one main line

The orthogonality section has two protagonists: the orthonormal matrix  $Q$  and projection matrix $P$. "Column orthonormal" has an equivalent matrix writing method  $Q^{\mathsf T}Q=I$, because  $Q^{\mathsf T}Q$  of  $(i,j)$  Yuan is the inner product  $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$, orthonormal means that it can only take  $1$($i=j$) or  $0$. From this, the projection onto the straight line is  $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$, projected into the subspace is  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$;when  $A\boldsymbol{x}=\boldsymbol{b}$  When there is no solution, put  $\boldsymbol{b}$  Projecting into column space yields the least squares solution. Gram-Schmidt does the opposite: starting from a set of linearly independent vectors, subtracting its projections in the existing directions one by one to obtain the orthonormal basis; because it needs to be divided by the length in the end, this step will bring a lot of square roots.

The skeleton of the Determinants section is three defining properties plus seven corollaries: properties one to three define determinants, properties four to ten (e.g.  $\det(AB)=\det A\det B$) are derived from them, so there is no need to memorize them as ten unrelated formulas. There are two ways to calculate: press  $n!$ "Big formula" expansion of terms (half with positive sign, half with negative sign), and algebraic cofactor expansion by row or column; the latter is particularly effective for matrices with a large number of zero elements, and is given by  $A^{-1}=\frac{1}{\det A}C^{\mathsf T}$.

In the Eigenvalue section, only the first two sections are tested: Solving characteristic equations  $\det(A-\lambda I)=0$, find the eigenvector, and when  $n$  When the eigenvectors are linearly independent, all  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  written once  $A=S\Lambda S^{-1}$, thus  $A^k=S\Lambda^kS^{-1}$.

A main line connects the three plates: the trace is equal to the sum of eigenvalues, the determinant is equal to the product of eigenvalues,



$$
\operatorname{tr}A=\sum_i\lambda_i,\qquad \det A=\prod_i\lambda_i .
$$



These two equations are almost free in the examination room: after calculating the eigenvalues, checking the sum and product, most of the arithmetic errors will be revealed on the spot. They will be used in every test point later.

The questions in the review class also repeatedly demonstrated one thing: a question often spans two chapters. After calculating the projection matrix, we then ask for its eigenvalues, which is the confluence of orthogonality and eigenvalues; the determinant recursion of the tridiagonal matrix finally becomes a  $2\times 2$  The eigenvalue problem of a matrix is the confluence of determinant and eigenvalue; $A_3$  The projection matrix method requires both column space (orthogonality) and singularity (determinant). Memorize the three chapters as three courses separately, and you will get stuck when encountering this kind of question; only when you know that they are talking about the same thing will you know where to start.

![Official Handout Summary Page 2/6](</attachments/mit1806-2be401686fdfba38b7a85566.png>)

*MIT OCW Official Lecture Notes Summary Page 2/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

## 2. Test point 1: Rank, eigenvalues and difference equations of projection matrix

Test point: given vector  $\boldsymbol{a}$, find the projection to  $\boldsymbol{a}$  straight-line matrix  $P$, and read out its rank, eigenvalues, and  $\boldsymbol{u}_{k+1}=P\boldsymbol{u}_k$  solution.

The method is to reduce the general formula to a "only one column" situation. $A$  only one column  $\boldsymbol{a}$  when, $A^{\mathsf T}A=\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$  It's just a number that can be moved from the inverse position to the denominator:



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



This formula is not memorized. Set  $\boldsymbol{b}$  The projection on a straight line is  $\hat{x}\boldsymbol{a}$, then the error  $\boldsymbol{b}-\hat{x}\boldsymbol{a}$  Must go with  $\boldsymbol{a}$  Vertical, that is  $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-\hat{x}\boldsymbol{a})=0$, solved from  $\hat{x}=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$; put  $\hat{x}$  ride back  $\boldsymbol{a}$, you get the above  $P\boldsymbol{b}$. The same formula also explains  $P^2=P$: The first projection has cleared the components perpendicular to the straight line, and another projection will not change anything.

Typical questions  $\boldsymbol{a}=(2,1,2)$: The denominator is  $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}=4+1+4=9$, so



$$
P=\frac{1}{9}\begin{bmatrix}4&2&4\\2&1&2\\4&2&4\end{bmatrix}.
$$



A matrix can read four types of information. Rank is  $1$, because all three columns are along  $\boldsymbol{a}$  direction; the column space is the straight line; the nullspace is the  $\boldsymbol{a}$  vertical plane; eigenvalues are  $0,0,1$——Rank is  $1$  It means that there are two linearly independent directions that are pressed to zero (double eigenvalues  $0$), while  $P\boldsymbol{a}=\boldsymbol{a}$  Description  $\boldsymbol{a}$  If it does not move by itself, it is the characteristic value.  $1$  the corresponding feature vector. Check trace: The sum of diagonal elements is  $\frac{9}{9}=1=0+0+1$.

Taking the initial value of the difference equation  $\boldsymbol{u}_0=(9,9,0)$. The first step is to calculate the projection directly: $\boldsymbol{a}^{\mathsf T}\boldsymbol{u}_0=18+9+0=27$, divided by  $9$  Get coefficient  $3$, so



$$
\boldsymbol{u}_1=P\boldsymbol{u}_0=3\boldsymbol{a}=(6,3,6).
$$



There is no need to calculate the second step: $\boldsymbol{u}_1$  is already on the straight line, and the projection leaves the points on the straight line as they are ($P^2=P$), so  $\boldsymbol{u}_2=\boldsymbol{u}_1=(6,3,6)$, unchanged thereafter.

If replaced by an ordinary matrix, "multiply  $k$  times", you must perform eigenvalue expansion: put  $\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+c_3\boldsymbol{x}_3$, then  $\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+c_3\lambda_3^k\boldsymbol{x}_3$, the labor lies in finding the eigenvalues, eigenvectors and three coefficients. The projection matrix skips this set of mechanical steps precisely because its two eigenvalues are  $0$: $0^k$  Let those two items start from  $k=1$  disappear, leaving only  $\boldsymbol{a}$  This item. After all, $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  The solution is  $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$, calculating difference equations and calculating the power of a matrix are essentially the same thing.

Common mistakes: forgetting the denominator  $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$;Write the eigenvalues as  $1,1,1$; Or redo the complete projection every iteration step, which is useless  $P^2=P$  Just call it a day.

## 3. Test point 2: Two pictures of least squares

Test points: Use a straight line passing through the origin to fit the data, write a normal equation and solve it; at the same time, explain clearly what is drawn in the "fitting diagram" and the "projection diagram".

Typical questions: $t=1,2,3$  time  $y=4,5,8$, the model is  $y=Dt$. If a straight line passes through exactly three points, it needs to be satisfied at the same time



$$
D=4,\qquad 2D=5,\qquad 3D=8,
$$



Three equations, one unknown, and no solution. rewritten as  $A\boldsymbol{x}=\boldsymbol{b}$:



$$
A=\begin{bmatrix}1\\2\\3\end{bmatrix},\qquad \boldsymbol{b}=\begin{bmatrix}4\\5\\8\end{bmatrix}.
$$



Because the straight line passes through the origin, the model has no constant terms, so  $A$  Not everything in it  $1$  that column. The normal equation is  $A^{\mathsf T}A\hat{D}=A^{\mathsf T}\boldsymbol{b}$: $A^{\mathsf T}A=1+4+9=14$, $A^{\mathsf T}\boldsymbol{b}=1\cdot4+2\cdot5+3\cdot8=38$, so



$$
\hat{D}=\frac{38}{14}=\frac{19}{7}.
$$



The two pictures must be distinguished. The first one is in  $ty$  On the plane: three points and straight lines  $y=\frac{19}{7}t$, the straight line does not pass through any point, but the overall error is minimal. The second one is in  $\mathbb{R}^3$  where: the projected vector is  $\boldsymbol{b}=(4,5,8)$, $A$  The column space is given by  $(1,2,3)$  The straight line formed by the projection point is



$$
A\hat{D}=\frac{19}{7}\begin{bmatrix}1\\2\\3\end{bmatrix}=\left(\frac{19}{7},\frac{38}{7},\frac{57}{7}\right),
$$



And  $\hat{D}$  It is the coefficient under this set of basis. All the algebraic operations of least squares occur in the second picture; there is no "projecting the data points onto a straight line" in the first picture, which is the most common misunderstanding. The connection between the two graphs is the residual: $\boldsymbol{b}-A\hat{D}=\left(\frac{9}{7},-\frac{3}{7},-\frac{1}{7}\right)$  Orthogonal to the column space, that is  $A^{\mathsf T}(\boldsymbol{b}-A\hat{D})=0$, which is exactly the shifted form of the normal equation.

This comparison also has a practical consequence: the projected image is located  $\mathbb{R}^3$  The number of dimensions is equal to the number of data points, and  $A^{\mathsf T}A$  The order of is equal to the number of unknowns. No matter how many data points there are, the normal equation is just a small system of equations - there is only one unknown, $A^{\mathsf T}A$  Just a number  $14$.

Common mistake: clearly passed the origin but gave  $A$  Add a column  $1$; put  $A^{\mathsf T}\boldsymbol{b}$  count  $4+5+8$  rather than a weighted sum  $38$; Treat the fitted image as a projected image.

![Video 00:18:22: Classroom blackboard writing](</attachments/mit1806-87e9a80aea9a588a3eb0e66e.jpg>)

*Video 00:18:22 \| Approximately corresponding to Section 3 "3. Test Point 2: Two Pictures of Least Squares".*

![Official Handout Summary Page 3/6](</attachments/mit1806-8f617d3d0b4b1cdcf4547b3d.png>)

*MIT OCW Official Lecture Notes Summary Page 3/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

## 4. Test point 3: Gram-Schmidt and orthonormal basis

Test points: Given a set of basis of a plane, find the orthogonal basis of the same plane; and remember the matrix criterion of "standard orthogonality" $Q^{\mathsf T}Q=I$.

Method in one sentence: The first direction is retained, and the new vector subtracts its projection in the existing direction. For two vectors,



$$
\boldsymbol{B}=\boldsymbol{a}_2-\frac{\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_1}\boldsymbol{a}_1.
$$



Typical questions: $\boldsymbol{a}_1=(1,2,3)$, $\boldsymbol{a}_2=(1,1,1)$. The plane formed by these two vectors is  $3\times 2$  matrix  $[\,\boldsymbol{a}_1\ \boldsymbol{a}_2\,]$  column space, so this question is actually to find a set of orthogonal basis for this column space. inner product  $\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_2=1+2+3=6$, $\boldsymbol{a}_1^{\mathsf T}\boldsymbol{a}_1=14$, the coefficient is  $\frac{6}{14}=\frac{3}{7}$, so



$$
\boldsymbol{B}=(1,1,1)-\frac{3}{7}(1,2,3)=\left(\frac{4}{7},\frac{1}{7},-\frac{2}{7}\right).
$$



Inspection: $\boldsymbol{a}_1^{\mathsf T}\boldsymbol{B}=\frac{4}{7}+\frac{2}{7}-\frac{6}{7}=0$. The question only requires orthogonality, so there is no need to divide by the length; if you want a standard orthonormal basis, divide the length to get  $\frac{1}{\sqrt{14}}(1,2,3)$  with  $\frac{1}{\sqrt{21}}(4,1,-2)$——Attention  $\boldsymbol{B}$  The square length of  $\frac{16+1+4}{49}=\frac{21}{49}$, the square root is the origin of "root signs everywhere" in this step.

When there are more than two vectors, the same action is repeated: No.  $j$  vector minus its projection onto each orthogonalized vector,



$$
\boldsymbol{B}_j=\boldsymbol{a}_j-\sum_{i<j}\frac{\boldsymbol{B}_i^{\mathsf T}\boldsymbol{a}_j}{\boldsymbol{B}_i^{\mathsf T}\boldsymbol{B}_i}\boldsymbol{B}_i .
$$



Each subtraction eliminates an existing direction, and the remaining part must be perpendicular to all previous directions.

The answer is not unique: orthogonal pairs in the plane can be rotated as a whole. Gram-Schmidt only gives one pair and maintains  $\boldsymbol{a}_1$  The direction remains unchanged.

Easy to make mistakes: the projection direction is reversed (take  $\boldsymbol{a}_1$  to  $\boldsymbol{a}_2$  upper projection); change the first vector; change  $\frac{6}{14}$  Write inversely  $\frac{14}{6}$.

![Video 00:25:18: Classroom blackboard writing](</attachments/mit1806-10bbe214cb05e6414ccde8c6.jpg>)

*Video 00:25:18 \| Approximately corresponding to Section 4 "4. Test Point 3: Gram-Schmidt and Orthogonal Basis".*

![Official Handout Summary Page 4/6](</attachments/mit1806-e3a762afdf4946ef5ce99ba4.png>)

*MIT OCW Official Lecture Notes Summary Page 4/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

## 5. Test point 4: Three quick calculation conclusions given by eigenvalues

Test point: Know one  $4\times 4$  Four eigenvalues of a matrix, answer reversibility, determinant of inverse matrix, $A+I$  The trace - does not look at the elements of the matrix at all.

Set  $\lambda_1,\lambda_2,\lambda_3,\lambda_4$  is  $A$  eigenvalues. All three conclusions come from  $\operatorname{tr}A=\sum\lambda_i$, $\det A=\prod\lambda_i$, and "How simple transformations change eigenvalues". The basis for the latter is very short: if  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, multiply left by both sides  $A^{-1}$  Got  $\boldsymbol{x}=\lambda A^{-1}\boldsymbol{x}$, that is  $A^{-1}\boldsymbol{x}=\frac{1}{\lambda}\boldsymbol{x}$; and  $(A+I)\boldsymbol{x}=\lambda\boldsymbol{x}+\boldsymbol{x}=(\lambda+1)\boldsymbol{x}$. The eigenvectors remain unchanged, only the eigenvalues ​​change.

First, $A$  Reversible if and only if all  $\lambda_i\ne0$. If a certain  $\lambda=0$, then  $A\boldsymbol{x}=\boldsymbol{0}$  There are non-zero solutions, the null space is non-trivial, and the matrix is singular; otherwise, if there are no zero eigenvalues, then  $\det A=\prod\lambda_i\ne0$.

Second, $\det(A^{-1})=\dfrac{1}{\lambda_1\lambda_2\lambda_3\lambda_4}$. because  $A^{-1}$  The characteristic value of is  $\dfrac{1}{\lambda_i}$ (Eigenvectors remain unchanged), and the determinant of the inverse matrix is equal to the product of its eigenvalues.

Third, $\operatorname{tr}(A+I)=(\lambda_1+1)+(\lambda_2+1)+(\lambda_3+1)+(\lambda_4+1)=\sum\lambda_i+4$. plus  $I$  Translate each eigenvalue  $1$, the trace is translated as a whole  $n=4$.

The three questions share the same action: first determine the eigenvalues of the new matrix, and then use the sum and product. This also shows that traces and determinants are the best self-checking tools in this lesson.

Common mistakes: $\operatorname{tr}(A+I)=\operatorname{tr}A$ (missing  $+4$); $\det(A+I)=\det A+1$ (should be  $\prod(\lambda_i+1)$); put  $\det(A^{-1})$  Wrongly written as  $\prod\lambda_i$.

![Video 00:31:25: Classroom blackboard writing](</attachments/mit1806-aacb5bb6064c4458eed66b45.jpg>)

*Video 00:31:25 \| Approximately corresponding to Section 5 "5. Test Point 4: Three quick calculation conclusions given by eigenvalues".*

## 6. Test Point 5: Matrix Family and Determinant Recursion

### three diagonals  $1$  Matrices: Second-Order Recursion and Periodic Solutions

Typical questions: $A_n$  is  $n\times n$  The matrix, the main diagonal and the upper and lower sub-diagonals are all  $1$, the rest are zero; note  $D_n=\det A_n$. Prove using algebraic cofactors  $D_n$  Satisfy the second-order recurrence and find the coefficients.

Expand by first row. The first item is  $(1,1)$  locational  $1$  Multiply its algebraic cofactor; what remains after removing the first row and first column is  $A_{n-1}$, so this item is  $D_{n-1}$. The second item comes from  $(1,2)$  locational  $1$, while  $(1,2)$  It has a negative sign when it is expanded; its cofactor is expanded according to the first column, leaving only one term, and this term is in the cofactor  $(1,1)$  position, take the positive sign, and the one that falls is exactly  $D_{n-2}$. The combination of the two symbols is negative, so



$$
D_n=D_{n-1}-D_{n-2},\qquad D_1=1,\qquad D_2=\begin{vmatrix}1&1\\1&1\end{vmatrix}=0.
$$



There's a minus sign, so it's not a Fibonacci type recursion. Rewrite the second-order recurrence into a first-order system: let  $\boldsymbol{v}_n=\begin{bmatrix}D_n\\D_{n-1}\end{bmatrix}$, then



$$
\boldsymbol{v}_n=\begin{bmatrix}1&-1\\1&0\end{bmatrix}\boldsymbol{v}_{n-1}=M\boldsymbol{v}_{n-1}.
$$



This is a standard way to deal with high-order recursion: pack two adjacent steps into a vector, and the second-order recursion becomes a matrix multiplication, and the eigenvalue theory can be directly applied.

$M$  The characteristic value of  $D_n$  direction. by  $\det(M-\lambda I)=\lambda^2-\lambda+1=0$  Got



$$
\lambda=\frac{1\pm\sqrt{3}\,i}{2}=e^{\pm i\pi/3}.
$$



real part squared  $\frac{1}{4}$  Add the square of the imaginary part  $\frac{3}{4}$  equal to  $1$, so the module length is  $1$, both eigenvalues fall on the unit circle. The mold length is less than  $1$  will attenuate, greater than  $1$  Will explode, equal to  $1$  It neither increases nor decreases - this is the criterion of stability. And because  $\lambda^6=1$, while  $M$  The two eigenvalues of are different from each other (diagonalizable), so  $M^6=I$, and then  $\boldsymbol{v}_{n+6}=\boldsymbol{v}_n$. put  $D_1,D_2$  By taking a few steps forward, you can see this cycle: $D_3=D_2-D_1=-1$, $D_4=D_3-D_2=-1$, $D_5=D_4-D_3=0$, $D_6=D_5-D_4=1$, $D_7=D_6-D_5=1$, so  $1,0,-1,-1,0,1$  Start repeating. $D_n$  Neither disappearing nor diverging, just circling periodically.

Common mistakes: missing  $(1,2)$  position brings the negative sign, we get  $D_n=D_{n-1}+D_{n-2}$ (Fibonacci type, eigenvalue is approximately  $1.618$  with  $-0.618$, the sequence grows exponentially); not checked  $D_1,D_2$  Just follow the recursion and write down; when you see the complex eigenvalues, you think "there is no real behavior". In fact, the complex eigenvalues represent rotation, and the module length determines the convergence.

### The zero-opposite angle and diagonally opposite angle are  $1,2,3,\dots$  family of matrices

Typical questions:



$$
A_3=\begin{bmatrix}0&1&0\\1&0&2\\0&2&0\end{bmatrix},\qquad A_4=\begin{bmatrix}0&1&0&0\\1&0&2&0\\0&2&0&3\\0&0&3&0\end{bmatrix},
$$



Both are symmetrical. $A_3$  Strange: The third column  $(0,2,0)$  is the first column  $(0,1,0)$  of  $2$  times, so  $\det A_3=0$, the rank is  $2$, the column space is  $\mathbb{R}^3$  a plane in it. It cannot be used directly at this time  $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$, because  $A_3^{\mathsf T}A_3$  It is singular in itself; a set of basis of column space should be taken, that is  $\boldsymbol{c}_1=(0,1,0)$  with  $\boldsymbol{c}_2=(1,0,2)$, order  $B=[\boldsymbol{c}_1\ \boldsymbol{c}_2]$, at this time  $B^{\mathsf T}B=\begin{bmatrix}1&0\\0&5\end{bmatrix}$, substitute  $P=B(B^{\mathsf T}B)^{-1}B^{\mathsf T}$  Got



$$
P=\frac{1}{5}\begin{bmatrix}1&0&2\\0&5&0\\2&0&4\end{bmatrix}.
$$



Inspection: $P$  Symmetry, $P^2=P$, rank is  $2$, the trace is  $\frac{1+5+4}{5}=2$, and the eigenvalues of the projection matrix  $1,1,0$  consistent. The middle row and column of this matrix happen to have only diagonal elements.  $1$, the reason is that the basis vector  $\boldsymbol{c}_1=(0,1,0)$  Itself is the direction of the coordinate axis: along  $y$  The vector of the axis is already in the plane, the projection does not change it.

$A_3$  The eigenvalues of  $\det(A_3-\lambda I)=-\lambda^3+5\lambda=-\lambda(\lambda^2-5)$  given, that is  $0,\sqrt{5},-\sqrt{5}$. Add the three to get  $0$, is equal to the sum of the diagonal elements. This is a very cheap self-check - the determinant of this question is zero, so it cannot help, only the trace can be used. If the problem requires feature vectors again, the approach is still the same: put each  $\lambda$  Substitute  $(A_3-\lambda I)\boldsymbol{x}=\boldsymbol{0}$, find the corresponding null space.

$A_4$  Just the opposite: use  $n!$  The big formula for the term should be written  $24$  It only takes two steps to expand according to the first row - the only non-zero element in the first row is  $(1,2)$, with a negative sign, expand it again to get  $\det A_4=9\ne0$, so  $A_4$  Invertible, the column space is the entire  $\mathbb{R}^4$, the projection matrix is  $I_4$——The seemingly hardest question turns out to be the least laborious. From this, we can guess the rules of this family of matrices: odd-order ones are singular, and even-order ones are invertible.

Common mistakes: rigid application of singular matrices  $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$($A^{\mathsf T}A$  It is not reversible at this time); or write as soon as you see "Find Projection Matrix" $I$, without first determining whether the matrix is invertible.

![Video 00:38:15: Classroom blackboard writing](</attachments/mit1806-9bdad8452109f71a8cf1cb88.jpg>)

*Video 00:38:15 \| Approximately corresponding to Section 6 "6. Test Point 5: Matrix Family and Determinant Recursion".*

![Official Handout Summary Page 5/6](</attachments/mit1806-8689ce00f09c5becf7bfac8b.png>)

*MIT OCW Official Lecture Notes Summary Page 5/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

![Video 00:43:30: Classroom blackboard writing](</attachments/mit1806-d1c75e8afe823635f00e8f68.jpg>)

*Video 00:43:30 \| Approximately corresponding to Section 6 "6. Test Point 5: Matrix Family and Determinant Recursion".*

![Official Handout Summary Page 6/6](</attachments/mit1806-0d635f093bd6730b788b5f8d.png>)

*MIT OCW Official Lecture Notes Summary Page 6/6 (18.06SC Lecture 24b Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The test scope is the first two sections of orthogonality, determinants and eigenvalues; differential equations and  $e^{At}$  No test.
- The matrix language of orthogonality is  $Q^{\mathsf T}Q=I$; Used for projecting to a straight line  $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$, projected into subspace using  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$.
- Yes  $\boldsymbol{a}=(2,1,2)$, $P=\frac{1}{9}\begin{bmatrix}4&2&4\\2&1&2\\4&2&4\end{bmatrix}$, the rank is  $1$, the characteristic value is  $0,0,1$, the trace is  $1$.
- difference equation  $\boldsymbol{u}_{k+1}=P\boldsymbol{u}_k$  from  $\boldsymbol{u}_0=(9,9,0)$  set off, because  $P^2=P$, arrive in one step  $(6,3,6)$  Then no longer move.
- least squares  $\boldsymbol{b}=(4,5,8)$  Project to  $\operatorname{span}\{(1,2,3)\}$, the normal equation gives  $\hat{D}=\frac{38}{14}=\frac{19}{7}$.
- Gram-Schmidt pair  $\boldsymbol{a}_1=(1,2,3)$, $\boldsymbol{a}_2=(1,1,1)$  gives orthogonal vectors  $\left(\frac{4}{7},\frac{1}{7},-\frac{2}{7}\right)$.
- The eigenvalues determine the reversibility (no zero eigenvalues), the determinant of the inverse matrix ($\prod 1/\lambda_i$) and trace ($\operatorname{tr}(A+I)=\operatorname{tr}A+4$).
- three diagonals  $1$  The determinant of the matrix satisfies  $D_n=D_{n-1}-D_{n-2}$, $D_1=1,D_2=0$;The transfer matrix eigenvalue is  $e^{\pm i\pi/3}$, so  $M^6=I$, $D_n$  to  $6$  is the cycle.
- $A_3$  Because the third column is  $(0,2,0)$, the first column is  $(0,1,0)$  And singularly, the projection matrix is  $\frac{1}{5}\begin{bmatrix}1&0&2\\0&5&0\\2&0&4\end{bmatrix}$, characteristic value  $1,1,0$; $A_4$  of  $\det=9$, the projection matrix is  $I_4$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| orthonormal | orthogonal | The inner product of each pair is zero and the length of each vector is  $1$ |
| projection matrix | projection matrix | Project the vector to a matrix on the subspace, satisfying  $P^{\mathsf T}=P$, $P^2=P$ |
| least squares | least squares | When there is no solution, find the approximate solution that minimizes the error vector |
| normal equation | normal equation | $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$, the least squares solution satisfies the equation |
| Gram-Schmidt | Gram-Schmidt | Subtract the projections in the existing directions one by one and convert the basis into a standard orthonormal basis. |
| determinant | determinant | A single number summarizing matrix invertibility and volume scaling, equal to the product of eigenvalues |
| cofactor | algebraic cofactor | Remove a certain row or column and include the sign of the cofactor, used to expand by rows |
| trace | trace | The sum of the main diagonal elements is equal to the sum of the eigenvalues |
| eigenvalue | eigenvalue | such that  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  Numbers with non-zero solutions |
| eigenvector | eigenvector | Be  $A$  A non-zero vector whose direction remains unchanged after action |
| diagonalization | diagonalization | write  $A=S\Lambda S^{-1}$, using the eigenvector as the basis |
| singular | strange | Irreversible, equivalent to the existence of zero eigenvalues or linear dependence of column vectors |
| difference equation | difference equation | $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$, long-term behavior is determined by eigenvalues |
| stability | Stability | Determined by the eigenvalue module length: greater than  $1$  divergent, less than  $1$  Attenuation, equal to  $1$  Bounded |

---

[← Lecture 24](/en/notes/mit-1806/lec24) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 25 →](/en/notes/mit-1806/lec25)
