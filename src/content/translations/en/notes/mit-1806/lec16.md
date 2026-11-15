---
kind: notes
source: mit-1806/lec16
title: Lecture 16 · Projection matrix and least squares
description: Master projection matrices and least squares, and understand normal equations.
sourceHash: 69fc11efc3b684af22faabcbd493d28821106a577bbfcf21e4b0434e75abeeec
publish: true
translationMethod: machine-assisted
---

> *Projection matrices and least squares* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 16 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p16 · Projection matrix and least squares](https://www.bilibili.com/video/BV1ix411f7Yp?p=16)(48:05)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-16-projection-matrices-and-least-squares/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=16&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lecture, the projection was written as a matrix: if  $m\times n$  matrix  $A$  The columns of are linearly independent and constitute a set of basis of a certain subspace, then the vector is projected onto the subspace **projection matrix** (projection matrix) is



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



This lecture first returns to this formula and tests it with two extreme cases: when the vector is originally in the subspace, the projection should return it unchanged; when the vector is perpendicular to the subspace everywhere, the projection should be zero. Generally, the vector is between the two and is split into two parts: "inside the subspace" and "outside the subspace". This step not only reviews projections, but also strings together projections, four basic subspaces and matrix algebra to prepare the geometry for least squares.

The main thread of this lecture is **least squares** (least squares). Fitting a straight line to three data points will result in three equations with only two unknowns. The system of equations has no solution; but you can ask which straight line has the smallest total error. Define the error as the length of the residual vector, and define "minimum" as the minimum square of the length. The problem is geometrically projecting the data vector into column space, and algebraically it boils down to a  $2\times 2$  of **normal equation**(normal equations)$A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$. By solving it, the coefficients of the best straight line, the projection vector, and the error at each point are obtained together.

Finally, I would like to add one thing that has been used before but has not been proven yet: $A$  When the columns of are linearly independent, $A^{\mathsf T}A$  It must be reversible. This fact underpins every step of the derivation of the projection formula and the normal equation, and the proof uses only two tools: the square of the vector length and the null space. Taking a step further along the same clue, you will see a more ideal column: if they are not only linearly independent, but also perpendicular to each other, with a length of  $1$, then  $A^{\mathsf T}A=I$, the normal equations are simplified to the point where calculation is almost unnecessary. This is the subject of the next lecture.

![Official Handout Summary Page 1/3](</attachments/mit1806-ffbdd70f3a94bc9bfb04201d.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 16 Summary, CC BY-NC-SA 4.0).*

## 1. Projection matrix: two extreme cases

Set  $A$  is  $m\times n$  matrix, $n$  The column vectors are linearly independent, forming a column space  $C(A)$  a set of bases. put vector  $\boldsymbol b\in\mathbb R^m$  Project to  $C(A)$  above, the result is given by



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T},
\qquad
\boldsymbol p=P\boldsymbol b
$$



Given, $P$  is  $m\times m$  phalanx. This formula looks complicated, but what it needs to do is very simple: find the distance in the column space  $\boldsymbol b$  nearest point. Two extreme cases can be used to see how it is done.

The first situation: $\boldsymbol b$  It is originally in the column space. The column space is given by  $A$  is a column span of , where each vector can be written as  $A\boldsymbol x$  form, so let  $\boldsymbol b=A\boldsymbol x$. Substitute into the formula, the middle two factors  $(A^{\mathsf T}A)^{-1}$  with  $A^{\mathsf T}A$  Adjacent, first multiply into the identity matrix:



$$
P\boldsymbol b=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}(A\boldsymbol x)
=A(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)\boldsymbol x=A\boldsymbol x=\boldsymbol b.
$$



Nothing changed after projection. This fits the definition of "closest point": $\boldsymbol b$  The distance to the column space is zero, and the closest point is itself.

Second situation: $\boldsymbol b$  Perpendicular to the entire column space. Perpendicular to the column space, it is equal to  $A$  Each column of is vertical, i.e.  $A^{\mathsf T}\boldsymbol b=\boldsymbol 0$. These vectors form four basic subspaces **left null space**(left nullspace)$N(A^{\mathsf T})$. At this time



$$
P\boldsymbol b=A(A^{\mathsf T}A)^{-1}(A^{\mathsf T}\boldsymbol b)=\boldsymbol 0,
$$



Because the rightmost factor  $A^{\mathsf T}\boldsymbol b$  is already a zero vector. A vector without any components in the column space direction, its nearest point can only be the origin.

Generally vectors fall somewhere in between, being cleanly cut into two pieces by the projection:



$$
\boldsymbol b=\boldsymbol p+\boldsymbol e,\qquad \boldsymbol p=P\boldsymbol b,\quad \boldsymbol e=(I-P)\boldsymbol b,
$$



Among them  $\boldsymbol p$  Within the column space, $\boldsymbol e$  Perpendicular to the column space, it is called **error vector** (error vector). From the picture, $\boldsymbol p$  is  $\boldsymbol b$  The shadow falling on the column space, $\boldsymbol e$  is the deviation perpendicular to the column space, the two are  $\boldsymbol b$  Form a right triangle for the hypotenuse. $I-P$  It is also a projection matrix, which projects the vector onto the subspace perpendicular to the column space. This can be directly verified algebraically: if  $P^{\mathsf T}=P$  and  $P^2=P$, then



$$
(I-P)^{\mathsf T}=I-P^{\mathsf T}=I-P,
\qquad
(I-P)^2=I-2P+P^2=I-P.
$$



Two basic properties of a projection matrix - symmetry with respect to the transpose and the fact that the square is equal to itself - are imparted to its complementary projection. Squared equal to itself means that another projection does not change the result: the shadow is projected again, and it is still the same shadow. $P$  Reserve  $\boldsymbol b$  components in column space, $I-P$  reserved  $P$  The part that was lost can be restored exactly by combining the two.  $\boldsymbol b$.

![Video 00:04:49: Classroom blackboard writing](</attachments/mit1806-35085a3d5c2e320ebc80009a.jpg>)

*Video 00:04:49 \| Approximately corresponding to Section 1 "1. Projection Matrix: Two Extreme Cases".*

## 2. Three points and a straight line

Now let's use projection on a specific problem: find the closest straight line to three data points. The data is  $t=1,2,3$  Observations at three moments  $1,2,2$, the straight line to be found is written as



$$
y=C+Dt,
$$



Among them  $C$  is the intercept, $D$  is the slope. If a straight line passes through exactly three points, it should satisfy three equations at the same time:



$$
\begin{cases}
C+D=1,\\
C+2D=2,\\
C+3D=2.
\end{cases}
$$



The first two points fall exactly on  $y=t$  on, but this straight line is on  $t=3$  given at  $3$, than the observed value  $2$  Big  $1$. Since a straight line cannot be found that passes through three points simultaneously, this set of equations has no solution.

Write the system of equations in matrix form:



$$
A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix},
\qquad
\boldsymbol x=\begin{bmatrix}C\\D\end{bmatrix},
\qquad
\boldsymbol b=\begin{bmatrix}1\\2\\2\end{bmatrix},
\qquad
A\boldsymbol x=\boldsymbol b.
$$



$A$  is  $3\times 2$  Matrix, with more equations than unknowns: three rows corresponding to observations at three moments, and two columns corresponding to two undetermined parameters. its two columns  $(1,1,1)$  with  $(1,2,3)$  It is not proportional and linearly independent, so it is indeed a set of basis of column space; and  $\boldsymbol b$  Not in this column space, which is why the equation has no solution. So the next best thing is to choose the one with the smallest overall error among all candidate straight lines.

"Error" needs to be defined. given  $C,D$, the deviations of each of the three equations are



$$
e_1=1-(C+D),\qquad e_2=2-(C+2D),\qquad e_3=2-(C+3D),
$$



Arranged into vectors it is  $\boldsymbol e=\boldsymbol b-A\boldsymbol x$. The smaller the length of the error vector, the better the straight line fit; the length is non-negative, minimizing the length is the same thing as minimizing its square, so use the sum of squares



$$
E(C,D)=\|\boldsymbol e\|^2=(C+D-1)^2+(C+2D-2)^2+(C+3D-2)^2
$$



as the overall error. this is **least squares** The origin of the name: Minimize the sum of squares of the errors.

Why use the square instead of the length itself? The sum of squares is a quadratic function. After derivation, the linear equation is obtained, which is the cleanest calculation. Moreover, the square and the length reach zero at the same place, which means that the system of equations has an exact solution. $\boldsymbol b$  falls in the column space. Statisticians call this **linear regression** (linear regression), the sum of squares is the most commonly used error measure. to it **outliers** (outlier) but quite sensitive: if in  $t=0$  If an observation with a large deviation is added here, the square term it contributes will far outweigh the other three items, pulling the entire straight line towards itself. Therefore, before statisticians use sums of squares, they often find and deal with outliers, rather than letting one potentially erroneous observation dominate the entire straight line.

This perspective makes the meaning of least squares clear: the original three equations are  $\boldsymbol b$  There is no solution if it is not in the column space; put  $\boldsymbol b$  Replace with the closest one in column space  $\boldsymbol p$  After that, the system of equations is consistent, and the solution is exactly the pair  $(C,D)$. So what least squares does is to replace the original system of unsolved equations with a nearest system of equations that has a solution, and "nearest" refers to the smallest length of the error vector.

There are two ways to draw the same question. The first is plotted on the data plane: the horizontal axis is  $t$, the vertical axis is  $y$, the three points are observations, the straight line is the candidate, and the three small vertical line segments are  $e_1,e_2,e_3$. The second kind of painting is in  $\mathbb R^3$  Here: $\boldsymbol b=(1,2,2)$  It's a point, $A$  The column space of is a plane passing through the origin, and the vector corresponding to the best straight line  $\boldsymbol p$  is the in-plane distance  $\boldsymbol b$  The nearest point, $\boldsymbol e$  It is from  $\boldsymbol p$  point to  $\boldsymbol b$  vertical segment. Assume that the heights of the best straight line at three moments are in sequence  $P_1,P_2,P_3$, then  $\boldsymbol p=(P_1,P_2,P_3)$; it falls within the column space, meaning there is  $C,D$  such that  $\boldsymbol p=C(1,1,1)+D(1,2,3)$, and this pair  $(C,D)$  It is the coefficient of the best straight line. The two graphs say the same thing: the "vertical distance from the point to the straight line" on the data graph is the three components of the error vector on the vector graph.

![Video 00:12:25: Classroom blackboard writing](</attachments/mit1806-c947511955d2d13f79178433.jpg>)

*Video 00:12:25 \| Approximately corresponding to section 2 "2. Three points and a straight line".*

![Video 00:14:26: Classroom blackboard writing](</attachments/mit1806-8851f3c64f0bf8224e397c88.jpg>)

*Video 00:14:26 \| Approximately corresponding to section 2 "2. Three points and a straight line".*

## 3. Normal equation

Ask for  $E(C,D)$  There are two ways to minimize the value of , one using calculus and one using linear algebra. They give the same system of equations.

The road to calculus: separate pairs  $C,D$  Find the partial derivative and set it to zero,



$$
\frac{\partial E}{\partial C}=2\big[(C+D-1)+(C+2D-2)+(C+3D-2)\big]=0,
$$





$$
\frac{\partial E}{\partial D}=2\big[(C+D-1)+2(C+2D-2)+3(C+3D-2)\big]=0.
$$



well organized



$$
3C+6D=5,\qquad 6C+14D=11.
$$



The road to linear algebra: the least squares solution satisfies **normal equation**(normal equations)



$$
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b.
$$



put  $A,\boldsymbol b$  Substituting in, we get exactly the two equations above. It is no exaggeration to call it the most important equation in statistics and estimation: whenever "a few parameters are used to fit noisy data", it is almost always the first one to be solved.

Calculate the matrix on both sides. $A^{\mathsf T}A$  of  $(1,1)$  Yuan is three  $1$  sum of squares  $3$; $(1,2)$  Yuan Yu  $(2,1)$  Yuan is  $(1,1,1)$  with  $(1,2,3)$  dot product of  $1+2+3=6$; $(2,2)$  Yuan is  $1^2+2^2+3^2=14$, so



$$
A^{\mathsf T}A=\begin{bmatrix}3&6\\6&14\end{bmatrix}.
$$



Right end  $A^{\mathsf T}\boldsymbol b$  The two components of are  $\boldsymbol b=(1,2,2)$  Dot product with two columns: $1+2+2=5$  and  $1+4+6=11$, that is



$$
A^{\mathsf T}\boldsymbol b=\begin{bmatrix}5\\11\end{bmatrix}.
$$



$A^{\mathsf T}A$  is a symmetric matrix, this is no coincidence: $(A^{\mathsf T}A)^{\mathsf T}=A^{\mathsf T}A$  to any  $A$  All are established. See more clearly dollar by dollar: $A^{\mathsf T}A$  of  $(i,j)$  Yuan is the first  $i$  Column and No.  $j$  The dot product of the columns, the diagonal element is the square of the length of each column, exchange  $i,j$  Does not change the results. It is still reversible here because  $A$  are linearly independent; we will show later in the course that it is even **positive definite** (positive definite) matrix. Symmetry, reversibility, and positive certainty are the three most anticipated properties of this key matrix.

Solve this  $2\times 2$  System of equations. The second equation minus twice the first equation:



$$
(6C+14D)-2(3C+6D)=11-10,
$$



On the left is  $2D$, so  $D=\frac12$. Substituting back into the first equation: $3C+3=5$, got  $C=\frac23$. The best straight line is



$$
y=\frac23+\frac12 t,
\qquad
\hat{\boldsymbol x}=\begin{bmatrix}2/3\\1/2\end{bmatrix}.
$$



There are only two equations because there are only two parameters; if the model has  $n$  parameters, the normal equation is  $n\times n$  The order of the system of equations is determined only by the number of parameters and has nothing to do with the number of data points.

The whole process can therefore be fixed: write out from the data  $A$  with  $\boldsymbol b$, solving the normal equation we get  $\hat{\boldsymbol x}$, then calculate  $\boldsymbol p=A\hat{\boldsymbol x}$  with  $\boldsymbol e=\boldsymbol b-\boldsymbol p$. Changing a set of data only changes  $A$, $\boldsymbol b$  The steps to solve the two numbers are exactly the same.

![Official Handout Summary Page 2/3](</attachments/mit1806-45e7ac68a3eaadf96cbb53a8.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 16 Summary, CC BY-NC-SA 4.0).*

![Video 00:25:56: Classroom blackboard writing](</attachments/mit1806-de0339517a7d1449a3c6b987.jpg>)

*Video 00:25:56｜Approximately corresponding to Section 3 "3. Normal Equations".*

## 4. Projection, error and two pictures

put  $\hat{\boldsymbol x}$  Substitute  $A$, get the projection of the data vector on the column space



$$
\boldsymbol p=A\hat{\boldsymbol x}
=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}\begin{bmatrix}2/3\\1/2\end{bmatrix}
=\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix}.
$$



The three components are the best straight lines in  $t=1,2,3$  Height at: $\frac76$  Slightly higher than the observed value  $1$, $\frac53$  lower than observed value  $2$, $\frac{13}{6}$  higher than observed value  $2$. The error vector is



$$
\boldsymbol e=\boldsymbol b-\boldsymbol p
=\begin{bmatrix}1\\2\\2\end{bmatrix}-\begin{bmatrix}7/6\\5/3\\13/6\end{bmatrix}
=\begin{bmatrix}-1/6\\1/3\\-1/6\end{bmatrix},
$$



obviously  $\boldsymbol p+\boldsymbol e=\boldsymbol b$, the three residuals, two negative and one positive, add up to exactly zero. The sum of squares of the errors is



$$
\|\boldsymbol e\|^2=\frac{1}{36}+\frac{4}{36}+\frac{1}{36}=\frac16,
$$



This is the minimum total error that can be achieved in all straight lines.

The geometric properties of the projection can be verified one by one in this example. $\boldsymbol e$  with  $\boldsymbol p$  The dot product of is



$$
\frac76\cdot\left(-\frac16\right)+\frac53\cdot\frac13+\frac{13}{6}\cdot\left(-\frac16\right)
=-\frac{7}{36}+\frac{20}{36}-\frac{13}{36}=0,
$$



Both are vertical. But  $\boldsymbol e$  Vertical is not just  $\boldsymbol p$: It is perpendicular to any vector in column space. Get the simplest one in the column space  $(1,1,1)$, the dot product is  $-\frac16+\frac13-\frac16=0$, which also explains why the three errors cancel each other out; then take another column  $(1,2,3)$, the dot product is  $-\frac16+\frac23-\frac12=0$. If it is perpendicular to both columns, it is perpendicular to the entire column space, that is,  $\boldsymbol e\in N(A^{\mathsf T})$. put  $\boldsymbol e=\boldsymbol b-A\hat{\boldsymbol x}$  Substitute,



$$
A^{\mathsf T}(\boldsymbol b-A\hat{\boldsymbol x})=\boldsymbol 0
\;\Longleftrightarrow\;
A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b,
$$



It is the normal equation. It turns out that "the error is perpendicular to the column space" and "the parameters satisfy the normal equation" are two versions of the same sentence, one expressed in geometry and the other in algebra. This also connects this lecture with the projection formula:



$$
\boldsymbol p=A\hat{\boldsymbol x}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol b=P\boldsymbol b.
$$



Compare the two graphs again: On the data graph, the length and direction of the three vertical errors are given by  $\boldsymbol e$  The three components of are given; on the vector diagram, $\boldsymbol p$  is  $\boldsymbol b$  Projection onto column space, $\boldsymbol e$  It's the section perpendicular to it. Coefficients of the best straight line  $(\frac23,\frac12)$, exactly  $\boldsymbol p$  On base  $\{(1,1,1),(1,2,3)\}$  the coordinates below. To put it another way: "closest" on the data map refers to the smallest sum of squares of the vertical distance, and "closest" on the vector map refers to the smallest Euclidean distance. The two actually mean the same thing.

![Video 00:31:15: Classroom blackboard writing](</attachments/mit1806-63cb1b1bec085b9761e51519.jpg>)

*Video 00:31:15 \| Approximately corresponding to Section 4 "4. Projection, Error and Two Images".*

![Video 00:35:20: Classroom blackboard writing](</attachments/mit1806-13aaad110377380efc76c981.jpg>)

*Video 00:35:20 \| Approximately corresponding to Section 4 "4. Projection, Error and Two Images".*

## 5. Why  $A^{\mathsf T}A$  Reversible

The entire least squares calculation is based on  $(A^{\mathsf T}A)^{-1}$  Above: It is used in projection formulas and normal equations. So we must answer: When is this matrix invertible?

**Theorem:**  If  $A$  The columns of are linearly independent, then  $A^{\mathsf T}A$  Reversible.

This conclusion deserves a complete proof, because it uses all the tools learned previously; there is more than one way to prove it, and the most direct one will be taken below. The idea is to prove  $A^{\mathsf T}A$  The nullspace of contains only zero vectors. Set



$$
A^{\mathsf T}A\boldsymbol x=\boldsymbol 0.
$$



Take left on both sides  $\boldsymbol x^{\mathsf T}$:



$$
\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x=0.
$$



left  $\boldsymbol x^{\mathsf T}A^{\mathsf T}$  That’s it  $(A\boldsymbol x)^{\mathsf T}$, so the entire expression can be read as  $(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)$, that is, vector  $A\boldsymbol x$  dot product with itself, which is the length squared  $\|A\boldsymbol x\|^2$. The length square of a real vector is zero and can only be a zero vector, so



$$
A\boldsymbol x=\boldsymbol 0.
$$



Again using the assumption that the columns are linearly independent: $A\boldsymbol x$  Is each column based on  $\boldsymbol x$  The component of is a vector composed of coefficients. It is equal to zero but the coefficients are not all zero, which means that the columns are linearly related. Since the columns are linearly independent, it can only be



$$
\boldsymbol x=\boldsymbol 0.
$$



There is nothing in null space except zero vectors, $A^{\mathsf T}A$  Reversible.

This proof is very short, but it uses two old tools in key places: one is to  $\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x$  recognize  $(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)$, relying on the multiplication rule of transposition and "the dot product of a vector and itself is equal to the square of the length"; the second is that the language of null space is used to process columns, which has nothing to do with it. $A$  The columns of are linearly independent and are equivalent to  $A\boldsymbol x=\boldsymbol 0$  There is only zero solution. The last step is the only place where an assumption is used, and it also explains why this assumption cannot be omitted: if the columns are linearly related, there is a non-zero  $\boldsymbol x$  such that  $A\boldsymbol x=\boldsymbol 0$, so  $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$, this matrix is destined to be irreversible, and both projection and normal equations will lose their meaning.

![Video 00:38:28: Classroom blackboard writing](</attachments/mit1806-e9c335f5c59d9e489462bd4f.jpg>)

*Video 00:38:28｜Approximately corresponding to Section 5 "5. Why  $A^{\mathsf T}A$ "Reversible" nearby.*

## 6. Orthonormal columns

Since  $A^{\mathsf T}A$  The reversibility of comes from the linear independence of columns. A natural question is: what kind of columns can make  $A^{\mathsf T}A$  Extremely simple? The answer is that two pairs are perpendicular and their length is  $1$  of columns.

Let’s look at the most familiar group first. Take three column vectors  $(1,0,0),(0,1,0),(0,0,1)$  Arranged into a matrix, we get the identity matrix  $I$, obviously  $A^{\mathsf T}A=I$. These three vectors are perpendicular to each other and have the same length.  $1$, is the most standard example. Let’s look at a pair in 2D:



$$
\boldsymbol q_1=\begin{bmatrix}\cos\theta\\ \sin\theta\end{bmatrix},
\qquad
\boldsymbol q_2=\begin{bmatrix}-\sin\theta\\ \cos\theta\end{bmatrix}.
$$



Both lengths are  $1$;Dot product  $\cos\theta\cdot(-\sin\theta)+\sin\theta\cdot\cos\theta=0$, so vertical. Take them as columns,



$$
A=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix},
\qquad
A^{\mathsf T}A=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I.
$$



Pairs are perpendicular and their length is  $1$  The vector of is called **orthogonal** (orthonormal) vector. They are automatically linearly independent: any non-trivial linear combination of two perpendicular non-zero vectors is non-zero, so the theorem of the previous section guarantees that such matrices  $A^{\mathsf T}A$  Reversible. A matrix with orthonormal vectors as columns has the best columns: $A^{\mathsf T}A=I$, the normal equation degenerates into  $\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$, neither inversion nor elimination is required; there is no coupling between columns, and each parameter can be determined independently.

So, given a set of ordinary basis, how can we transform it into an orthonormal basis? This is the question to be answered in the next lecture. The next lecture will first explain why orthonormal columns make all calculations easier, and then give a systematic method to turn any set of bases into orthonormal bases.

![Official Handout Summary Page 3/3](</attachments/mit1806-9a7924c58c10a9173749ae1b.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 16 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **projection matrix** (projection matrix) is  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$, among which  $A$  The columns of constitute a set of basis of the column space; $P\boldsymbol b$  is  $\boldsymbol b$  The closest point in column space.
- Two extreme situations: $\boldsymbol b$  when within column space  $P\boldsymbol b=\boldsymbol b$, because  $(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)$  offset; offset; $\boldsymbol b$  Perpendicular to the column space, that is  $\boldsymbol b\in N(A^{\mathsf T})$  time  $P\boldsymbol b=\boldsymbol 0$.
- A general vector is decomposed into  $\boldsymbol b=\boldsymbol p+\boldsymbol e$, among which  $\boldsymbol p=P\boldsymbol b$, $\boldsymbol e=(I-P)\boldsymbol b$; $I-P$  is the projection matrix projected onto the left null space, $P$  with  $I-P$  Both are symmetric about the transpose and squared equal to themselves.
- Least squares problem: use  $y=C+Dt$  fitting  $(1,1),(2,2),(3,2)$  Three points, get three equations  $C+D=1$, $C+2D=2$, $C+3D=2$, no solution; $A$  for  $3\times 2$, the two columns are linearly independent, $\boldsymbol b$  Not within column space.
- The "best" criterion is the sum of squared errors  $E(C,D)=(C+D-1)^2+(C+2D-2)^2+(C+3D-2)^2=\|\boldsymbol b-A\boldsymbol x\|^2$  Minimum; statistically called linear regression, the sum of squares is sensitive to outliers.
- **normal equation** (normal equations) is  $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$;This example  $A^{\mathsf T}A=\begin{bmatrix}3&6\\6&14\end{bmatrix}$, $A^{\mathsf T}\boldsymbol b=\begin{bmatrix}5\\11\end{bmatrix}$, the solution is  $C=\frac23$, $D=\frac12$, the best straight line  $y=\frac23+\frac12t$.
- Projection vector  $\boldsymbol p=(\frac76,\frac53,\frac{13}{6})$, error vector  $\boldsymbol e=(-\frac16,\frac13,-\frac16)$, satisfy  $\boldsymbol p+\boldsymbol e=\boldsymbol b$; $\boldsymbol e$  Perpendicular to both columns, that is  $A^{\mathsf T}\boldsymbol e=\boldsymbol 0$, which is exactly the normal equation; the minimum sum of squared errors is  $\frac16$.
- If  $A$  The columns of are linearly independent, then  $A^{\mathsf T}A$  Reversible: by  $A^{\mathsf T}A\boldsymbol x=\boldsymbol 0$  Take left  $\boldsymbol x^{\mathsf T}$  Got  $\|A\boldsymbol x\|^2=0$, so  $A\boldsymbol x=\boldsymbol 0$, and then from the column independence we get  $\boldsymbol x=\boldsymbol 0$.
- If  $A$  The columns of are orthonormal, then  $A^{\mathsf T}A=I$, the normal equation simplifies to  $\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$;Identity matrix and rotation matrix  $\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}$  All are examples. In the next lecture, we will learn how to convert a general basis into an orthonormal basis.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| projection matrix | projection matrix | The matrix that maps the vector to the nearest point in the subspace, $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| least squares | least squares | Fitting method based on the minimum sum of squared errors as the criterion |
| normal equations | normal equation | $A^{\mathsf T}A\hat{\boldsymbol x}=A^{\mathsf T}\boldsymbol b$, a system of equations whose least squares solution satisfies |
| error vector | error vector | The difference between the observed value and the fitted value, $\boldsymbol e=\boldsymbol b-A\hat{\boldsymbol x}$ |
| linear regression | linear regression | A statistical method that fits data with a straight line or linear model to minimize the squared error. |
| outlier | outliers | Observations that deviate significantly from the rest of the data will have their effect magnified by the squared error |
| sum of squares | sum of squares | The sum of the squares of each error component, the quantity to be minimized by least squares |
| column space | column space | $A$  The subspace spanned by all column vectors of  $C(A)$ |
| left nullspace | left null space | subspace consisting of vectors perpendicular to the column space  $N(A^{\mathsf T})$ |
| orthonormal | orthogonal | Pairs are perpendicular and their length is  $1$  vector set of |
| symmetric matrix | symmetric matrix | transposes a matrix equal to itself, $A^{\mathsf T}A$  always symmetrical |
| positive definite | positive definite | Later in the course it will be demonstrated  $A^{\mathsf T}A$  is positive definite, which is another good quality of this key matrix |
| linearly independent columns | Columns are linearly independent | $A\boldsymbol x=\boldsymbol 0$  There is only zero solution, which is equivalent to  $A^{\mathsf T}A$  Reversible |

---

[← Lecture 15](/en/notes/mit-1806/lec15) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 17 →](/en/notes/mit-1806/lec17)
