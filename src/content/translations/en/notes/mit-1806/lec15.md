---
kind: notes
source: mit-1806/lec15
title: Lecture 15 · Projection on subspace
description: Derive the projection formula and understand why projection gives
  the best approximation.
sourceHash: 5f442fb9d384908767809d9d7d8c41c085e4032d847ab05ed1d7f5b000086833
publish: true
translationMethod: machine-assisted
---

> *Projections onto subspaces* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 15 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p15 · Projection on subspace](https://www.bilibili.com/video/BV1ix411f7Yp?p=15)(48:51)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-15-projections-onto-subspaces/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=15&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lecture, orthogonal maps of four basic subspaces were drawn: the null space is orthogonal to the row space, and the left null space is orthogonal to the column space. That is describing the structure of space. This is the first time I use it to solve problems in this lecture - when  $A\boldsymbol{x}=\boldsymbol{b}$  When there is no solution, use orthogonality to find the "closest" solvable problem and solve it.

What does a system of equations without a solution look like? The most common situation is when there are more equations than unknowns. For example, three data points are used to determine a straight line with only two parameters. The three equations contradict each other, and no straight line passes through these three points at the same time. Since the exact solution does not exist, let’s take a step back and find the best approximation: put the right-hand vector  $\boldsymbol{b}$  Change to column space, change to column space  $\boldsymbol{b}$  The nearest vector  $\boldsymbol{p}$, then solve  $A\hat{\boldsymbol{x}}=\boldsymbol{p}$. this  $\hat{\boldsymbol{x}}$  It's the "best possible solution".

Everything that follows starts from the same condition: pointing from the projection point  $\boldsymbol{b}$  The error vector is perpendicular to the subspace where the projection is located. "Nearest" is a geometric term. Once translated into "error is orthogonal to the subspace", it becomes a linear equation that can be solved directly. Along this clue, this lecture first projects the vector onto a straight line to obtain three one-dimensional formulas; then projects it onto a plane until  $n$  Dimension space, get the projection matrix  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$; Finally, three data points are used to fit a straight line and the formula is pushed to the actual data.

![Official Handout Summary Page 1/3](</attachments/mit1806-752af84538aada9966ec2e74.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 15 Summary, CC BY-NC-SA 4.0).*

## 1. Project to a straight line

Set  $\boldsymbol{a}$  is a non-zero vector, which forms a straight line passing through the origin, which is  $\mathbb{R}^m$  a one-dimensional subspace in . given vector  $\boldsymbol{b}$, which is usually not on this straight line. Question: Which point on the straight line is far from  $\boldsymbol{b}$  Recently?

mark the nearest point as  $\boldsymbol{p}$, it is  $\boldsymbol{b}$  vertical foot on a straight line, connecting line  $\boldsymbol{b}-\boldsymbol{p}$  At right angles to the straight line. The key to the whole lecture is this right angle. It is not an accidental phenomenon when drawing pictures, but the only condition that can write "nearest" as an equation.

$\boldsymbol{p}$  on a straight line, therefore  $\boldsymbol{a}$  A multiple of:



$$
\boldsymbol{p}=x\boldsymbol{a}.
$$



The problem boils down to finding this number  $x$.$\boldsymbol{p}$  called  $\boldsymbol{b}$  on a straight line **projection** (projection), the error vector is



$$
\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}=\boldsymbol{b}-x\boldsymbol{a},
$$



It is perpendicular to the straight line, that is, perpendicular to the  $\boldsymbol{a}$. Use the inner product to express "vertical" to get the central equation of this lecture



$$
\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0.
$$



Expand:



$$
\boldsymbol{a}^{\mathsf T}\boldsymbol{b}-x\,\boldsymbol{a}^{\mathsf T}\boldsymbol{a}=0,
\qquad\text{即}\qquad
x=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



Both quantities are numbers: $\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$  is the inner product of two vectors, $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$  is  $\boldsymbol{a}$  The inner product with itself is equal to  $\boldsymbol{a}$  length squared. So  $x$  is the ratio of two numbers. This derivation has nothing to do with the dimension. Two-dimensional, three-dimensional, $m$  Vidu is the same.

The projection itself is



$$
\boldsymbol{p}=x\boldsymbol{a}=\boldsymbol{a}\,\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



If we use trigonometry to do the same thing, we need to introduce  $\boldsymbol{a}$  with  $\boldsymbol{b}$  the angle of  $\theta$, writing length, sine and cosine all the way, the formula is clunky and not easy to generalize. The inner product absorbs the angle information: $\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$  already contains  $\cos\theta$  effect, but the formula itself only performs inner products and multiplications between vectors, and no corners appear.

This result also has a structural implication: it  $\boldsymbol{b}$  Split into two pieces,



$$
\boldsymbol{b}=\boldsymbol{p}+\boldsymbol{e},
$$



Among them  $\boldsymbol{p}$  on a straight line, $\boldsymbol{e}$  Orthogonal to the straight line. The two pieces do not overlap each other, and together they are exactly the same as the original  $\boldsymbol{b}$. If  $\boldsymbol{b}$  Originally on a straight line, the error is zero and the projection is itself; $\boldsymbol{b}$  The further away from the straight line, $\boldsymbol{e}$  The longer. What projection needs to do is to completely peel off this "component orthogonal to the straight line".

> Editor's note: Why the vertical foot is the closest point can be seen clearly using the Pythagorean theorem. Take another point on the line  $\boldsymbol{q}$, then  $\boldsymbol{b}-\boldsymbol{q}=(\boldsymbol{b}-\boldsymbol{p})+(\boldsymbol{p}-\boldsymbol{q})$, the two terms on the right are perpendicular to each other, so  $\|\boldsymbol{b}-\boldsymbol{q}\|^{2}=\|\boldsymbol{b}-\boldsymbol{p}\|^{2}+\|\boldsymbol{p}-\boldsymbol{q}\|^{2}$, as long as  $\boldsymbol{q}\ne\boldsymbol{p}$  It must be better than  $\boldsymbol{p}$  farther. The orthogonality condition therefore does characterize the closest point.

![Video 00:04:53: Classroom blackboard writing](</attachments/mit1806-fb6698aa5218d6fbe14d3aeb.jpg>)

*Video 00:04:53｜Approximately corresponding to Section 1 "1. Project to a straight line".*

## 2. Projection matrix

If you change the parenthetical reading of the formula in the first section, new objects will appear. Move scalar factors to the front of vectors:



$$
\boldsymbol{p}=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}\,\boldsymbol{a}
=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}\,\boldsymbol{b}.
$$



The two writing methods are numerically identical, but the meaning of the matrix is different. molecule  $\boldsymbol{a}^{\mathsf T}\boldsymbol{b}$  It is row times column, it is a number; numerator  $\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$  It is a column multiplied by a row.  $m\times m$  Matrix, the number of rows and columns is equal to  $\boldsymbol{a}$  of dimensions. Denominator  $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$  is still a number, so the entire fraction is a matrix, which acts on  $\boldsymbol{b}$  A projection is produced on it. This matrix is called **projection matrix** (projection matrix), recorded as  $P$:



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}},
\qquad
\boldsymbol{p}=P\boldsymbol{b}.
$$



This formula can be tested with two small experiments. put  $\boldsymbol{b}$  Replace with  $2\boldsymbol{b}$: The molecule has one more factor  $2$, the projection also becomes  $2\boldsymbol{p}$, the input doubles and the output doubles, which is consistent with "the further you walk in the same direction, the further you drop your foot." put  $\boldsymbol{a}$  Replace with  $2\boldsymbol{a}$: If the straight line does not change, the projection should not change. The occurrence factor of the molecule in the formula  $4$, factors also appear in the denominator  $4$, offset up and down, the projection is still the original  $P\boldsymbol{b}$. This shows that the projection only depends on the line itself and has nothing to do with the length of the vector used to describe the line.

$P$  There are three properties worth remembering.

Article 1, $P$  The rank of  $1$.$\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$  It's one column by one row, exactly **rank 1 matrix** (rank-one matrix) standard shape, that column is the basis of the column space. From this  $P$  of **column space** (column space) is  $\boldsymbol{a}$  The straight line formed by Zhang: Take it as you like  $\boldsymbol{b}$, $P\boldsymbol{b}$  All fall on a straight line. This must be consistent with the definition - the column space of the matrix is ​​"the space that can fall after multiplying by any vector", and the landing point of the projection can only be that line.

Article 2, $P$  is **symmetric matrix**(symmetric matrix):



$$
P^{\mathsf T}=P.
$$



because of transposition  $\boldsymbol{a}\boldsymbol{a}^{\mathsf T}$  What you get is itself, the denominator is the number, transposing does not change it.

Article 3, $P^2=P$. The reasons are all in one screen: Take it anywhere  $\boldsymbol{b}$, $P\boldsymbol{b}$  It has fallen on the straight line; project the point on the straight line again and it will stay where it is. So for any  $\boldsymbol{b}$  All  $P(P\boldsymbol{b})=P\boldsymbol{b}$, that is  $P^2=P$. "The square equals itself" is the algebraic way of writing "projecting twice equals projecting once".

Symmetry and  $P^2=P$  Together, these two items are a sign of whether a matrix is a projection matrix. Subsequent high-dimensional projection matrices must undergo these two checks.

There are now three formulas for the one-dimensional case, they are  $n$  Prototype of dimension formula:



$$
x=\frac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}},
\qquad
\boldsymbol{p}=x\boldsymbol{a},
\qquad
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}.
$$



Pay attention to distinguishing between projections  $\boldsymbol{p}$ (vector) and projection matrix  $P$ (Matrix): The latter acts on  $\boldsymbol{b}$  Only then did I get the former. In the formula, the numerator is a column times a row, and the denominator is a number. It looks like a fraction. In fact, the numerator and denominator cannot be "reduced" to a single number.

![Video 00:11:44: Classroom blackboard writing](</attachments/mit1806-cfb0b9b69397877863a7d30a.jpg>)

*Video 00:11:44 \| Approximately corresponding to Section 2 "2. Projection Matrix".*

![Video 00:14:39: Classroom blackboard writing](</attachments/mit1806-c3b42fba2b1581a4bab8ddef.jpg>)

*Video 00:14:39 \| Approximately corresponding to Section 2 "2. Projection Matrix".*

## 3. Why projection is needed

Projection is not to make the picture look good, but to solve the problem  $A\boldsymbol{x}=\boldsymbol{b}$  Possibly unanswerable questions.

when  $A$  When there are more rows than columns, there are more equations than unknowns, there are too many conditions, and they usually contradict each other. It's clear from the column view: $A\boldsymbol{x}$  always  $A$  is a linear combination of the columns, so regardless of  $\boldsymbol{x}$  How to get it? $A\boldsymbol{x}$  all fall in column space  $C(A)$  inside; while  $\boldsymbol{b}$  Generally not in this space. request  $A\boldsymbol{x}=\boldsymbol{b}$, which is equivalent to requiring a certain vector in the column space to be exactly equal to the vector outside the column space.  $\boldsymbol{b}$, this can’t be done.

If you cannot meet the precise requirements, modify the requirements:  $C(A)$  Zhong Zhao Li  $\boldsymbol{b}$  nearest vector  $\boldsymbol{p}$, then solve



$$
A\hat{\boldsymbol{x}}=\boldsymbol{p}.
$$



This equation must have a solution because  $\boldsymbol{p}$  It is originally constructed from vectors in column space. solved  $\hat{\boldsymbol{x}}$  Not the solution to the original equation - which has no solution at all - but the "best possible solution". Adding a hat to the head is just to distinguish it from the exact solution that does not exist. And  $\boldsymbol{p}$  The way to find it is to put  $\boldsymbol{b}$  Project to column space  $C(A)$  on. In other words, $\boldsymbol{p}$  is "use  $A\boldsymbol{x}$  This form can really be put together and separated from the  $\boldsymbol{b}$  The most recent" vector.

So the value of projection is that it replaces an unsolvable problem with a problem that has a solution and is as close to the original problem as possible. This idea will be developed in the next lecture into **least squares** (least squares): The so-called "best" in data fitting is defined by this projection.

The order of reasoning here is worth remembering: first admit that the original equation is unsolvable, then ask "which solvable problem is closest to it", and finally use the projection formula. There are problems to be solved first, then there are tools. To put it another way, $\boldsymbol{b}$  fall on  $C(A)$  The part other than  $\boldsymbol{x}$  It cannot be eliminated; what the projection does is to identify this part separately, put it aside, and leave the rest to  $A\boldsymbol{x}$  Go for an exact match. One-dimensional rectilinear projection is just the simplest training ground. The real use case is column space.

## 4. Projection to the plane: general subspace

Now move up to three dimensions: given a plane passing through the origin and a vector outside the plane  $\boldsymbol{b}$, ask for  $\boldsymbol{b}$  projection on plane  $\boldsymbol{p}$.

To do the calculation, you must first describe the plane. The most natural description is to give a set of basis: take two linearly independent vectors in the plane  $\boldsymbol{a}_1$  and  $\boldsymbol{a}_2$. They do not have to be orthogonal, as long as they are linearly independent, all their linear combinations will cover this plane. Arrange these two vectors into a matrix by columns



$$
A=\begin{bmatrix}\boldsymbol{a}_1&\boldsymbol{a}_2\end{bmatrix},
$$



The plane is  $A$  column space  $C(A)$. This step translates the geometric problem into a matrix problem: projection to the plane is projection to  $C(A)$, and generalize from two columns to  $n$  Columns don't require any new ideas.

Projection point  $\boldsymbol{p}$  in the plane, so it is the combination of two columns:



$$
\boldsymbol{p}=x_1\boldsymbol{a}_1+x_2\boldsymbol{a}_2=A\hat{\boldsymbol{x}},
\qquad
\hat{\boldsymbol{x}}=\begin{bmatrix}x_1\\x_2\end{bmatrix}.
$$



Instead of  $x_1\boldsymbol{a}_1+x_2\boldsymbol{a}_2$  Write it down all the way, why not memorize it  $A\hat{\boldsymbol{x}}$: Coefficients are packed into vectors  $\hat{\boldsymbol{x}}$, basis vectors are packed into matrices  $A$, the combination is written as a matrix multiplication. In this way, whether the plane consists of two columns or  $n$  The columns are spread, and the shapes of the formulas are exactly the same. This is also the introduction of the matrix.  $A$  intention.

What needs to be done is still to find the combination coefficient  $\hat{\boldsymbol{x}}$. if  $\boldsymbol{b}$  happens to be already in column space, the projection is  $\boldsymbol{b}$  itself, the error is zero; but in general the error



$$
\boldsymbol{e}=\boldsymbol{b}-A\hat{\boldsymbol{x}}
$$



Not zero. As in one dimension, the key fact is  $\boldsymbol{p}$  is the closest point, so  $\boldsymbol{e}$  perpendicular to the entire plane. Perpendicular to a plane means perpendicular to every vector in the plane, specifically perpendicular to the two basis vectors:



$$
\boldsymbol{a}_1^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=0,
\qquad
\boldsymbol{a}_2^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=0.
$$



There are two unknowns, and there are exactly two conditions. The number of equations is equal to the number of unknowns. This is a natural extension of the one-dimensional equation.

Stack the two equations and write them into a matrix. $A^{\mathsf T}$  The two lines of are exactly  $\boldsymbol{a}_1^{\mathsf T}$  with  $\boldsymbol{a}_2^{\mathsf T}$, so the two equations merge into one:



$$
A^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=\boldsymbol{0}.
$$



Use it to check the one-dimensional degradation case: if  $A$  only one column  $\boldsymbol{a}$, the above formula is  $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0$, which is exactly the central equation of the first section. It can be seen that there is only one equation for "projection to subspace", and the only difference between one-dimensional and high-dimensional is  $A$  There are several columns.

This equation can also be mapped to four basic subspaces. $A^{\mathsf T}\boldsymbol{e}=\boldsymbol{0}$  What is said  $\boldsymbol{e}$  fall on  $A^{\mathsf T}$  in the zero space, that is,  $A$  of **left null space**(left nullspace)$N(A^{\mathsf T})$. We already know from the previous lecture that left null space and column space are mutually exclusive **orthogonal complement**(orthogonal complement):



$$
N(A^{\mathsf T})\perp C(A).
$$



So"$\boldsymbol{e}$  Belongs to the left null space "AND"$\boldsymbol{e}$ "Perpendicular to the column space" is the same sentence. The equation that took half a page to write out is exactly the right angle in geometry. The orthogonal relationship between the four subspaces ensures that it will not be calculated incorrectly.

Untie the brackets and get the core equation of the projection problem



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}.
$$



$A$  is  $m\times n$  matrix, $A^{\mathsf T}A$  is  $n\times n$  square array; on the plane  $n=2$, so there are two equations and two unknowns. In one-dimensional case  $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$  It's just a number, so you can just divide it; now it's a matrix, you can't divide it, you have to invert it. As long as the two columns are linearly independent (this is the condition for them to serve as the basis of the plane), $A^{\mathsf T}A$  It is reversible and the inverse matrix exists; this also explains why it appears in high-dimensional formulas  $(A^{\mathsf T}A)^{-1}$, while only the denominator appears in the one-dimensional formula.

![Official Handout Summary Page 2/3](</attachments/mit1806-f271f527db51344c612220bd.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 15 Summary, CC BY-NC-SA 4.0).*

![Video 00:31:45: Classroom blackboard writing](</attachments/mit1806-82d11f718d8af9394c5c348e.jpg>)

*Video 00:31:45 \| Approximately corresponding to Section 4 "4. Projection to the plane: general subspace".*

## 5. Three formulas for general situations

According to the three lines of one dimension, write  $n$  Three dimensions:



$$
\hat{\boldsymbol{x}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b},
\qquad
\boldsymbol{p}=A\hat{\boldsymbol{x}}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b},
\qquad
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



The second article just puts  $\hat{\boldsymbol{x}}$  Substitute  $\boldsymbol{p}=A\hat{\boldsymbol{x}}$: $\hat{\boldsymbol{x}}$  It is originally the "column combination coefficient". After calculating the coefficient, the projection is naturally determined by  $A$  Get it by multiplying it. Article 3  $\boldsymbol{b}$  The previous string of matrices is packed into one matrix, which is the projection matrix  $P$. Contrast one-dimensional  $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/(\boldsymbol{a}^{\mathsf T}\boldsymbol{a})$, the structure is exactly the same, except that the number  $\boldsymbol{a}^{\mathsf T}\boldsymbol{a}$  Replaced with matrix  $A^{\mathsf T}A$, division is replaced by inversion.

It's worth checking the dimensions of each part. $A$  is  $m\times n$, $A^{\mathsf T}$  is  $n\times m$, so  $A^{\mathsf T}A$  is  $n\times n$  The square matrix of can be inverted; $A^{\mathsf T}\boldsymbol{b}$  is  $n\times 1$  vector, so  $\hat{\boldsymbol{x}}$  Also  $n\times 1$, exactly  $n$  combination coefficient. $A\hat{\boldsymbol{x}}$  is  $m\times 1$, return to the original  $m$  dimensional space, the projection point must be like this. finally  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  put  $\boldsymbol{b}$  from  $m$  Delivery  $m$  dimension, it is  $m\times m$  matrix. one dimensional time  $m$  arbitrary, $n=1$, these dimensions degenerate into the relationship between numbers, scalars and a single matrix, which seems to be the formulas in the first section.

$P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  This formula can easily lead to an impulse: Since there is an "inverse product" formula, why not just use  $(A^{\mathsf T}A)^{-1}$  split into  $A^{-1}(A^{\mathsf T})^{-1}$? Then the product becomes



$$
A\,A^{-1}(A^{\mathsf T})^{-1}A^{\mathsf T}=I,
$$



The projection matrix becomes the identity matrix, which is obviously wrong. What's wrong? Wrong  $A$  It's not a square matrix, it has no inverse at all. The premise of our entire question is exactly  $A$  More rows than columns, tall and thin, with only a few columns but many rows. $A^{\mathsf T}A$  It is indeed a square matrix, and it is indeed reversible, but  $(A^{\mathsf T}A)^{-1}$  This whole cannot be dismantled. If it is dismantled, it will use something that does not exist.  $A^{-1}$. So the formula has to stay like this.

But this "wrong" happens to be true in one situation: if  $A$  is a square matrix and reversible, its column space is the entire  $\mathbb{R}^m$, no need to do anything when projecting to the whole space. $P$  It should have been the identity matrix  $I$. At this time  $A^{-1}$  exists, the above offset is legal, $P=I$  Exactly the right answer. our  $A$  This is not the case, so it cannot be offset.

High-dimensional projection matrices also satisfy those two properties. Symmetry:



$$
P^{\mathsf T}=\bigl(A(A^{\mathsf T}A)^{-1}A^{\mathsf T}\bigr)^{\mathsf T}
=A\bigl((A^{\mathsf T}A)^{-1}\bigr)^{\mathsf T}A^{\mathsf T}
=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}=P,
$$



The last step was used  $A^{\mathsf T}A$  is a symmetric matrix, and its inverse is also symmetric. $P^2=P$  It is a series of beautiful offsets:



$$
P^2=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}A(A^{\mathsf T}A)^{-1}A^{\mathsf T}
=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}=P,
$$



middle  $A^{\mathsf T}A$  Adjacent to its inverse, multiplied by it is the identity matrix, and the whole string is just the beginning and the end. The geometric interpretation is the same as in one dimension: the first projection sends the vector into column space, and the second projection falls on a point in column space and does not move anymore.

![Video 00:38:07: Classroom blackboard writing](</attachments/mit1806-896babfba39648a6e4d96abe.jpg>)

*Video 00:38:07 \| Approximately corresponding to Section 5 "5. Three formulas for general situations".*

![Video 00:39:05: Classroom blackboard writing](</attachments/mit1806-34f35243a9ecd366ef0d9668.jpg>)

*Video 00:39:05 \| Approximately corresponding to Section 5 "5. Three formulas for general situations".*

## 6. Fit a straight line to the data

Finally, apply the formula to specific data. There are three data points: $t=1$  time  $b=1$, $t=2$  time  $b=2$, $t=3$  time  $b=2$. here  $t$  is the horizontal axis (time), $b$  is the ordinate of the data point. The three points are not collinear, so we need to find a straight line in the plane  $b=C+Dt$, making it closest to these three points as a whole.

A straight line has only two parameters: intercept  $C$  with slope  $D$. If it passes through three points exactly, it must simultaneously satisfy



$$
C+D=1,\qquad C+2D=2,\qquad C+3D=2.
$$



Three equations, two unknowns, no solution, that is, no straight line passes through these three points at the same time. It will be different if you change the data: if the third observation value is not  $2$  Rather  $3$, the three points are exactly collinear, and the system of equations has a solution immediately. Exactly  $1,2,2$  These three numbers make the problem unsolvable.

Write the system of equations as  $A\boldsymbol{x}=\boldsymbol{b}$, see clearly which part is the matrix, which part is the unknown, and which part is the right end:



$$
A=\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}C\\D\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}1\\2\\2\end{bmatrix}.
$$



The first column is all  $1$, corresponding to the constant term  $C$;The second column is  $t$  The value of , corresponding to the slope  $D$. this  $3\times2$  The matrix is a typical example of a "tall and thin" matrix: three equations, two unknowns. Arrange the three observations vertically, which is the right-hand vector  $\boldsymbol{b}=(1,2,2)$.

Since  $A\boldsymbol{x}=\boldsymbol{b}$  If there is no solution, change the solution  $A\hat{\boldsymbol{x}}=\boldsymbol{p}$, among which  $\boldsymbol{p}$  is  $\boldsymbol{b}$  in column space  $C(A)$  projection on. $C(A)$  The vectors in are all shaped like  $(C+D,\ C+2D,\ C+3D)$, $C,D$  When all real numbers are taken, they are spread out into a plane passing through the origin; and  $\boldsymbol{b}=(1,2,2)$  Not in this plane. Substitute into the core equation



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b},
$$



Specifically, it is



$$
\begin{bmatrix}1&1&1\\1&2&3\end{bmatrix}
\begin{bmatrix}1&1\\1&2\\1&3\end{bmatrix}
\hat{\boldsymbol{x}}
=
\begin{bmatrix}1&1&1\\1&2&3\end{bmatrix}
\begin{bmatrix}1\\2\\2\end{bmatrix}.
$$



The left side is a coefficient matrix as  $2\times2$  System of equations, the right side is a two-dimensional vector, solve  $\hat{\boldsymbol{x}}=(C,D)$  The best straight line is obtained. $\boldsymbol{p}=A\hat{\boldsymbol{x}}$  The three components of are the straight line in  $t=1,2,3$  The value at; $\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$  The three components of are the vertical deviations of the three data points from the straight line. The set of coefficients selected by the projection makes all three deviations as small as possible instead of making one of them zero.

This lecture stops at setting up the equations: all derivation is done using letters, and the solution of specific numerical values is left to the next lecture. But the structure is clear: a  $3\times2$  The system of unsolvable equations is replaced by  $2\times2$  A system of solved equations  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$, the bridge between the two is  $\boldsymbol{b}$  Arrive  $C(A)$  projection. This substitution method is applicable as long as the number of equations exceeds the number of unknowns.

![Video 00:43:58: Classroom blackboard writing](</attachments/mit1806-6505daa6998ec9eea1b05f61.jpg>)

*Video 00:43:58 \| Approximately corresponding to Section 6 "6. Fitting a straight line with data".*

![Official Handout Summary Page 3/3](</attachments/mit1806-56d78ffbf83679d46f93f7a8.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 15 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **projection** (projection) solves the problem of "finding the point closest to the given vector in the subspace", and its criterion is the error vector  $\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$  orthogonal to the entire subspace.
- Project to  $\boldsymbol{a}$  Spreading Straight Lines: Central Equation  $\boldsymbol{a}^{\mathsf T}(\boldsymbol{b}-x\boldsymbol{a})=0$, the solution is  $x=\dfrac{\boldsymbol{a}^{\mathsf T}\boldsymbol{b}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$, projected as  $\boldsymbol{p}=x\boldsymbol{a}$.
- projection matrix  $P=\dfrac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}$  is  $m\times m$  matrix, rank  $1$, the column space is the straight line; it satisfies  $P^{\mathsf T}=P$  with  $P^2=P$.
- put  $\boldsymbol{b}$  Doubling doubles the projection;  $\boldsymbol{a}$  When doubled, the projection remains unchanged because factors appear in the numerator and denominator.  $4$  They cancel each other out and the straight line itself remains unchanged.
- The motivation for needing projection is: $A\boldsymbol{x}=\boldsymbol{b}$  When there are more equations than unknowns, there is usually no solution. $A\boldsymbol{x}$  can only fall in the column space, so the closest one in the column space is used  $\boldsymbol{p}$  instead of  $\boldsymbol{b}$, modified  $A\hat{\boldsymbol{x}}=\boldsymbol{p}$.
- Projected to the general column space: the error is orthogonal to each column, we get  $A^{\mathsf T}(\boldsymbol{b}-A\hat{\boldsymbol{x}})=\boldsymbol{0}$, that is  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$; $A^{\mathsf T}A$  is  $n\times n$  Square array.
- $\boldsymbol{e}\in N(A^{\mathsf T})$  with  $N(A^{\mathsf T})\perp C(A)$  They are two ways of saying the same thing, and the projection equation just writes this orthogonal relationship.
- three  $n$  Dimension formula: $\hat{\boldsymbol{x}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T}\boldsymbol{b}$, $\boldsymbol{p}=A\hat{\boldsymbol{x}}$, $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$;cannot be disassembled  $(A^{\mathsf T}A)^{-1}$, because  $A$  Not a phalanx. If  $A$  Reversible square matrix, $P=I$  is the correct answer.
- $n$  The dimensional projection matrix also satisfies  $P^{\mathsf T}=P$  with  $P^2=P$, the latter consists of the middle  $A^{\mathsf T}A$  Can be obtained by canceling it with its inverse matrix.
- Fit three points  $(1,1)$, $(2,2)$, $(3,2)$  straight line  $b=C+Dt$  given  $3\times2$  The system of unsolvable equations needs to be solved  $2\times2$  of  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| projection | projection | The point in the subspace closest to the given vector, the error is orthogonal to the subspace |
| projection matrix | projection matrix | Send any vector to a matrix on a subspace  $P$, satisfy  $P^{\mathsf T}=P$, $P^2=P$ |
| error vector | error vector | $\boldsymbol{e}=\boldsymbol{b}-\boldsymbol{p}$, perpendicular to the target subspace in the projection problem |
| symmetric matrix | symmetric matrix | satisfy  $A^{\mathsf T}=A$  matrix, the projection matrix must be symmetric |
| rank-one matrix | rank 1 matrix | The matrix obtained by multiplying one column by one row appears when projected onto a straight line |
| column space | column space | All linear combinations of each column of the matrix, the target space of the projection |
| left nullspace | left null space | $A^{\mathsf T}$  the null space of  $N(A^{\mathsf T})$, orthogonal to the column space |
| orthogonal complement | orthogonal complement | All vectors orthogonal to every vector in a given subspace |
| least squares | least squares | A complete set of methods for dealing with systems of unsolvable equations and finding the best approximation using projection |
| line fitting | straight line fitting | use  $b=C+Dt$  Approximate a set of data points and derive  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$ |

---

[← Lecture 14](/en/notes/mit-1806/lec14) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 16 →](/en/notes/mit-1806/lec16)
