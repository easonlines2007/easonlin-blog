---
kind: notes
source: mit-1806/lec14
title: Lecture 14 · Orthogonal vectors and orthogonal subspaces
description: Understand orthogonal vectors and orthogonal subspaces, and master
  the relationship between orthogonal complement and four subspaces.
sourceHash: 172757008834a87aac5d320594e93ef861198cc9f1567bdf7ec66dcab4f8f271
publish: true
translationMethod: machine-assisted
---

> *Orthogonal vectors and subspaces* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 14 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p14 · Orthogonal vectors and orthogonal subspaces](https://www.bilibili.com/video/BV1ix411f7Yp?p=14)(49:48)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-14-orthogonal-vectors-and-subspaces/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=14&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Starting from this lecture, the course enters the chapter of orthogonality. The theme can be summarized in one sentence: ninety degrees. What kind of vectors are perpendicular to each other, what kind of subspaces are perpendicular to each other, and what kind of basis are perpendicular to each other are all questions to be answered in this chapter. We have already met the four fundamental subspaces before and know their **dimension** (dimension): row space and nullspace coexist  $\mathbb R^n$ , the dimensions are respectively  $r$  and  $n-r$;Column space and left nullspace are the same  $\mathbb R^m$ , the dimensions are respectively  $r$  and  $m-r$. But at that time we only knew what each subspace was and how to find the basis, but we did not know their relative postures to each other. This lecture adds this layer of geometry: these two pairs of subspaces happen to be perpendicular to each other. The previous lectures focused on what vectors are contained in each subspace, but this lecture focuses on which direction they face. The original "four-piece puzzle" therefore became two "right-angle puzzles". $\mathbb R^n$  with  $\mathbb R^m$  Each is divided into two subspaces at right angles to each other.

The second half of this lecture turns to the main question of this chapter: $A\boldsymbol x=\boldsymbol b$  What to do when there is no solution. This is the norm in applications - when measuring the position of a satellite, you will get a thousand equations by measuring it a thousand times, but there may be only six parameters describing the position; when measuring the pulse, there is only one unknown number, but it will be measured repeatedly. There are more equations than unknowns, and the right-hand side is noisy, so an exact solution is destined to not exist. Applying all the equations and finding the "best solution" is a reasonable goal; and the key to it is the matrix  $A^{\mathsf T}A$.

The route of this lecture is: first give the criterion of vector orthogonality, and use the Pythagorean theorem to explain its origin; then generalize this criterion from vectors to subspaces, proving that the row space and the null space, the column space and the left null space are each at right angles; then use dimensions to illustrate that this orthogonality is "complementary", thus piecing the four basic subspaces into two complete pictures; finally, the optimal solution and matrix of the unsolvable equation are derived  $A^{\mathsf T}A$  reversibility.

![Official Handout Summary Page 1/2](</attachments/mit1806-6f2e45188e44ce71c629ca9e.png>)

*MIT OCW Official Lecture Notes Summary Page 1/2 (18.06SC Lecture 14 Summary, CC BY-NC-SA 4.0).*

## 1. Orthogonal vectors and dot product test

**orthogonal** (orthogonal) is a synonym for "vertical". in  $n$  Saying that two vectors are orthogonal in a dimensional space is equivalent to saying that the angle between them is  $90^\circ$, which is equivalent to saying that they are equal to and vector  $\boldsymbol{x}+\boldsymbol{y}$  form a right triangle, where  $\boldsymbol{x}+\boldsymbol{y}$  It's the hypotenuse. Given two vectors, how do you tell whether they are orthogonal? The answer is to calculate their dot product:



$$
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}
=x_1y_1+x_2y_2+\cdots+x_ny_n .
$$



This number is written as matrix multiplication by "one row by one column", and the result is a  $1\times 1$  matrix, which is a scalar. **Two vectors are orthogonal if and only if**



$$
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 .
$$



This is the most basic criterion in this lecture. It translates the geometric "right angle" into an algebraic condition that can be calculated, and all subsequent conclusions grow from it. judge  $n$  The angle between two vectors in a dimensional space is originally a geometric problem, and the most important thing to look at is the simplest quantity - the dot product; this is really beautiful. This dot product is also called **inner product** (inner product); on a real vector, it is the multiplication of the corresponding components and then summation.

Verify it in three-dimensional space. take  $\boldsymbol{x}=(1,2,3)$. Following the Pythagorean theorem, the square of the length of a vector is the sum of the squares of its components, and this sum of squares is exactly its dot product with itself:



$$
\|\boldsymbol{x}\|^2=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}
=1^2+2^2+3^2=14 .
$$



Take again  $\boldsymbol{y}=(2,-1,0)$, then  $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=2-2+0=0$, the two vectors are indeed orthogonal. The relevant numbers are completely consistent:



$$
\boldsymbol{x}+\boldsymbol{y}=\begin{bmatrix}3\\1\\3\end{bmatrix},
\qquad
\|\boldsymbol{y}\|^2=2^2+(-1)^2+0^2=5,
\qquad
\|\boldsymbol{x}+\boldsymbol{y}\|^2=3^2+1^2+3^2=19,
$$



And  $14+5=19$: The sum of the squares of the lengths of the two right-angled sides is equal to the square of the length of the hypotenuse. Note  $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$  is always positive, the only exception is the zero vector, whose length squared is zero.

![Video 00:04:59: Classroom blackboard writing](</attachments/mit1806-2c3c76671c7a48aed8bc4271.jpg>)

*Video 00:04:59 \| Approximately corresponding to Section 1 "1. Orthogonal Vectors and Dot Product Test".*

## 2. The dot product criterion and the Pythagorean theorem are the same thing

The equation in the previous section is not a coincidence, the Pythagorean theorem explains exactly where the criterion comes from. The Pythagorean theorem says that if  $\boldsymbol{x},\boldsymbol{y}$  are the two right-angled sides of a right triangle, then



$$
\|\boldsymbol{x}\|^2+\|\boldsymbol{y}\|^2=\|\boldsymbol{x}+\boldsymbol{y}\|^2 .
$$



Write the length squared as a dot product and expand the right side according to the distributive law:



$$
(\boldsymbol{x}+\boldsymbol{y})^{\mathsf T}(\boldsymbol{x}+\boldsymbol{y})
=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}
+\boldsymbol{x}^{\mathsf T}\boldsymbol{y}
+\boldsymbol{y}^{\mathsf T}\boldsymbol{x}
+\boldsymbol{y}^{\mathsf T}\boldsymbol{y}.
$$



This step only uses the distributive law of matrix multiplication without introducing any assumptions. For real vectors, $\boldsymbol{y}^{\mathsf T}\boldsymbol{x}$  with  $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$  is the same number, both are equal to  $x_1y_1+\cdots+x_ny_n$, so the middle two items are combined into  $2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$. Substituting the Pythagorean equation, both ends  $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$  with  $\boldsymbol{y}^{\mathsf T}\boldsymbol{y}$  Cancel, leaving only



$$
2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 ,
\qquad\text{即}\qquad
\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0 .
$$



So the two criteria are connected: the dot product being zero and the Pythagorean relationship being established are the same thing.

It must be emphasized that the Pythagorean equation does not hold for any three vectors. When the angle is not a right angle, the Pythagorean relationship generally does not hold; it only holds when the angle is a right angle, that is, the dot product is zero. In turn, as long as the dot product is zero, the Pythagorean equation automatically holds. This is the complete correspondence between the geometric meaning of "orthogonality" and the algebraic criterion.

There is also an edge case that needs to be handled by definition. If  $\boldsymbol{x}$  is a zero vector, then for any  $\boldsymbol{y}$  All  $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$, so the zero vector is orthogonal to all vectors. There is no need to feel awkward about this in mathematics: the rules are enforced.

## 3. Orthogonal subspace

Once the orthogonality of vectors is defined, the orthogonality of subspaces can be defined. **orthogonal subspace** The definition of (orthogonal subspaces) is: subspace  $S$  and subspace  $T$  Orthogonal means  $S$  Every vector in  $T$  Every vector in is orthogonal. The "each" in the definition cannot be weakened: only finding a pair of vectors that are perpendicular to each other, or two subspaces each having a part of vectors that are perpendicular to each other, is not considered orthogonal.

Test this definition using three dimensions. Consider the infinitely extending blackboard as a two-dimensional subspace, and the floor as another two-dimensional subspace. Both pass through the same origin (equivalent to a  $xz$  plane with a  $xy$  plane). Are they orthogonal? no. You can pick one on the blackboard that matches the seam  $45^\circ$  vector, which is obviously not perpendicular to the vector on the floor. The more fundamental reason is that these two planes intersect on a straight line, which is the joint between the floor and the blackboard; any non-zero vector on the intersection belongs to two subspaces at the same time, and a non-zero vector cannot be orthogonal to itself. From this we get a necessary condition: two orthogonal subspaces can only intersect at the zero vector. But "the intersection only has zero vectors" is not enough to guarantee orthogonality.

By listing all the subspaces in a two-dimensional plane, the components of this definition will become clear. There are only three types of subspaces in the plane: zero vector, straight line passing through the origin, and the entire plane. A straight line through the origin is never orthogonal to the entire plane, because the entire plane contains vectors that make any angle to the straight line, and even the straight line itself. The line is always orthogonal to the zero subspace because the zero vector is orthogonal to all vectors. Two different straight lines passing through the origin are orthogonal if and only if they are  $90^\circ$. So "orthogonality" is much stricter than "non-coincidence": the two subspaces must not only be separated from each other, but also be perpendicular to each other in every direction.

![Video 00:12:21: Classroom blackboard writing](</attachments/mit1806-0e7f88e7527e928569cf8c20.jpg>)

*Video 00:12:21 \| Approximately corresponding to Section 3 "3. Orthogonal Subspace".*

![Video 00:14:56: Classroom blackboard writing](</attachments/mit1806-0cc8f9e590f1fb90ed56faca.jpg>)

*Video 00:14:56 \| Approximately corresponding to Section 3 "3. Orthogonal Subspace".*

## 4. Row space and null space are orthogonal

With the definition of subspace orthogonality, the attitude between the four basic subspaces can be explained clearly. The core facts are: **Row space is orthogonal to null space**.

The proof only requires obtaining the definition of the null space  $A\boldsymbol{x}=\boldsymbol{0}$. put  $A$  Written line by line, the equation becomes



$$
A\boldsymbol{x}=
\begin{bmatrix}
\text{row}_1\\
\text{row}_2\\
\vdots\\
\text{row}_m
\end{bmatrix}\boldsymbol{x}
=
\begin{bmatrix}
\text{row}_1\boldsymbol{x}\\
\text{row}_2\boldsymbol{x}\\
\vdots\\
\text{row}_m\boldsymbol{x}
\end{bmatrix}
=
\begin{bmatrix}
0\\0\\\vdots\\0
\end{bmatrix}.
$$



The equation holds, which means that the vector in the null space  $\boldsymbol{x}$  with  $A$  Each row of is orthogonal: $\text{row}_1\boldsymbol{x}=0$, $\text{row}_2\boldsymbol{x}=0$, until  $\text{row}_m\boldsymbol{x}=0$.

But the line space is not just this  $m$  rows, it also contains all linear combinations of these rows. If  $\boldsymbol{x}$  If it is orthogonal to every row, then it is also orthogonal to any combination:



$$
(c_1\text{row}_1+\cdots+c_m\text{row}_m)\boldsymbol{x}
=c_1(\text{row}_1\boldsymbol{x})+\cdots+c_m(\text{row}_m\boldsymbol{x})=0 .
$$



So  $N(A)$  Each vector in is related to  $C(A^{\mathsf T})$  Every vector in is orthogonal, i.e.  $N(A)\perp C(A^{\mathsf T})$. In other words, the equation  $A\boldsymbol{x}=\boldsymbol{0}$  This expression contains two levels of information at the same time: it picks out the  $A$  vectors that map to zero, also indicating that the directions of these vectors are the same as  $A$  The rows are vertical. The same reasoning is used  $A^{\mathsf T}$  Above: $A^{\mathsf T}$  is also a matrix that also satisfies "the row space and the null space are orthogonal", and  $A^{\mathsf T}$  The row space is  $A$  column space, $A^{\mathsf T}$  The null space is  $A$  The left null space of , then



$$
C(A)\perp N(A^{\mathsf T}).
$$



The four basic subspaces are paired in pairs: $\mathbb R^n$  Divided into two parts by row space and null space, the dimension  $r$  with  $n-r$  Added to  $n$; $\mathbb R^m$  Divided into two parts by column space and left null space, the dimension  $r$  with  $m-r$  Added to  $m$. In fact, these geometric relationships have always been  $A\boldsymbol{x}=\boldsymbol{0}$  Inside, I just didn’t discuss verticality before, so I didn’t see it; now I picked it up. This is the second part of the fundamental theorem of linear algebra: the first part talks about the dimensions of the four subspaces, the second part talks about their orthogonality, and the third part talks about their orthogonal basis.

![Video 00:18:55: Classroom blackboard writing](</attachments/mit1806-b72f78e60defd3571d6abb23.jpg>)

*Video 00:18:55 \| Approximately corresponding to Section 4 "4. Row space and null space are orthogonal".*

## 5. Orthogonal complement: orthogonal and exactly complementary

"Orthogonal" is not precise enough. **orthogonal complement** The (orthogonal complement) requirement is stronger: the orthogonal complement of a subspace contains not only some vectors that are orthogonal to it, but also all vectors that are orthogonal to it.

The dimensions must match, which is the key to understanding orthogonal complement. consider  $\mathbb R^3$  matrix in



$$
A=\begin{bmatrix}1&2&5\\2&4&10\end{bmatrix}.
$$



The second row is twice the first row, so rank $r=1$: line space is along  $(1,2,5)$  A straight line in the direction. The null space is given by the equation



$$
x_1+2x_2+5x_3=0
$$



decision. An equation, three unknowns, the solution set is a two-dimensional plane passing through the origin, and its normal vector is exactly  $(1,2,5)$, that is, the "normal vector" in calculus  $n$". The row space is a straight line and the null space is a plane. They are orthogonal to each other. The dimensions  $1+2=3$  Just covers the whole  $\mathbb R^3$. It is impossible to have a situation where "the row space is a straight line and the null space is also a straight line" because  $n=3$, $r=1$, the zero space dimension must be  $n-r=2$.

second line  $(2,4,10)$  It has no substantial impact on the row space and null space, and the conclusion remains unchanged if it is deleted. So  $N(A)$  Not just "some vector orthogonal to the row space", but **All** Vectors orthogonal to the row space: all  $(1,2,5)$  The vertical vectors form that plane, and  $N(A)$  It is this plane, no more and no less. On the contrary, the total number of vectors orthogonal to a straight line is not another straight line, but an entire plane - the orthogonal complement is this entire plane. Just write it with symbols



$$
N(A)=C(A^{\mathsf T})^{\perp},
\qquad
N(A^{\mathsf T})=C(A)^{\perp}.
$$



Orthogonality, coupled with the fact that the sum of the dimensions equals the entire space, are two things that add up to a complete decomposition. A single vector cannot be said to be orthogonal complement, complement is the relationship between subspaces.

## 6. Main question: Find the "best solution" when the equation has no solution

The second half of this lecture turns to the main question of this chapter, which is also the last discussion in the entire course.  $A\boldsymbol{x}=\boldsymbol{b}$: When an equation has no solution, find its "best solution". No solution means  $\boldsymbol{b}$  Not in column space. If  $A$  It is a rectangular matrix with more rows than columns. This situation is normal.

There are many practical examples. When a satellite flies in the sky and its position is measured a thousand times, a thousand equations are obtained, and the parameters that determine the position may only be six. Taking your pulse is even simpler: there is only an unknown number of beats per minute, but you measure it repeatedly. The situation is the same for resistance measurement and pulse measurement. There are too many equations, and the measurements are noisy, so  $A\boldsymbol{x}=\boldsymbol{b}$  Exact solution is doomed to failure - even the right end  $\boldsymbol{b}$  Neither can be trusted in itself. But the data contains a lot of information about  $\boldsymbol{x}$  of information, the problem is to separate the information from the noise. This can also be seen from the shape of the matrix: if  $A$  is  $m\times n$  and  $m>n$, its rank cannot reach  $m$, the column space is just  $\mathbb R^m$  A small part of it, and most of the right-hand vectors are not in it at all.

A tempting but bad approach is to throw away some equations until you are left with a square matrix that is invertible and then solve the square matrix. This is equivalent to arbitrarily announcing that "these measurements are accurate and those are invalid" without any basis; there is no reason to say that some equations are full of information and others are full of noise. We need to use all measurements to get as much information as possible, which is to find the "best solution"$\hat{\boldsymbol{x}}$.

Elimination can tell us whether the equation has a solution; for this type of problem, elimination usually ends with "$0$  Equal to some non-zero number”, the signal that there is no solution is clear at a glance. The way out is to left-multiply both sides of the equation at the same time  $A^{\mathsf T}$:



$$
A^{\mathsf T}A\,\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b} .
$$



This is the central equation of this chapter. $\hat{\boldsymbol{x}}$  is the best solution; the precise definition of "best" will be left to later, but the equation itself has specified that the real object to be studied is  $A^{\mathsf T}A$. From the shape point of view, this equation is also completely reasonable: $A^{\mathsf T}$  is  $n\times m$, $\boldsymbol{b}$  is  $m$  dimension, so  $A^{\mathsf T}\boldsymbol{b}$  is  $n$  dimensional vector, and unknowns  $\hat{\boldsymbol{x}}$  The number is consistent; $A^{\mathsf T}A$  is  $n\times n$  The square matrix of , the central equation is exactly  $n$  an equation, $n$  an unknown number. So the original rectangular system of equations was replaced by a square matrix system. This is the first reason why it is worthy of study.

![Video 00:32:22: Classroom blackboard writing](</attachments/mit1806-2017a20d08c97beeef0035a7.jpg>)

*Video 00:32:22 \| Approximately corresponding to section 6 "6. Main problem: finding the "best solution" when the equation has no solution".*

![Video 00:33:57: Classroom blackboard writing](</attachments/mit1806-040727b9a41e678d4b71a993.jpg>)

*Video 00:33:57 \| Approximately corresponding to section 6 "6. Main problem: finding the "best solution" when the equation has no solution".*

![Video 00:39:50: Classroom blackboard writing](</attachments/mit1806-22f3d8c9f8b441f4e9400949.jpg>)

*Video 00:39:50 \| Approximately corresponding to Section 6 "6. Main problem: finding the "best solution" when the equation has no solution".*

## 7. $A^{\mathsf T}A$  and reversibility

Set  $A$  is  $m\times n$  The rectangular matrix of $A^{\mathsf T}$  is  $n\times m$, so  $A^{\mathsf T}A$  is  $n\times n$  phalanx. And it is a symmetric matrix:



$$
(A^{\mathsf T}A)^{\mathsf T}
=A^{\mathsf T}(A^{\mathsf T})^{\mathsf T}
=A^{\mathsf T}A .
$$



Only one rule is used above: the transpose of the product of two matrices is equal to the reverse multiplication of each transpose. To be able to solve the central equation, you need to know  $A^{\mathsf T}A$  When is it reversible.

Let’s look at a specific example first. take



$$
A=\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}.
$$



it is  $3\times 2$  Matrix, the two columns are  $(1,1,1)$  with  $(1,2,5)$, linearly independent, rank is  $2$. to such  $A$, $A\boldsymbol{x}=\boldsymbol{b}$  are three equations, two unknowns, and usually have no solution: $\boldsymbol{b}$  must fall in the plane spanned by these two columns, and  $\mathbb R^3$  Most of the vectors in are not in this plane. but  $A^{\mathsf T}A$  is a beautiful one  $2\times 2$  matrix:



$$
A^{\mathsf T}A=
\begin{bmatrix}1&1&1\\1&2&5\end{bmatrix}
\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}
=
\begin{bmatrix}3&8\\8&30\end{bmatrix}.
$$



Check item by item: The upper left corner is  $(1,1,1)$  dot product with yourself  $1+1+1=3$;The off-diagonal element is the dot product of two columns  $1+2+5=8$, the symmetry ensures that the upper right and lower left are the same; the lower right corner is  $(1,2,5)$  dot product with yourself  $1+4+25=30$. Its determinant is



$$
3\cdot 30-8\cdot 8=90-64=26\neq 0,
$$



So this  $A^{\mathsf T}A$  Reversible.

But it's not always reversible. If you put  $A$  Change the two columns of into vectors on the same straight line, $A^{\mathsf T}A$  The rank will also fall accordingly. For example, let the second column be the first column  $3$  Times:



$$
A=\begin{bmatrix}1&3\\1&3\\1&3\end{bmatrix},
\qquad
A^{\mathsf T}A=
\begin{bmatrix}3&9\\9&27\end{bmatrix},
$$



The product has only rank  $1$, the determinant is zero and irreversible. This is not surprising: $A$  The rank is already only  $1$, and the rank is  $1$  When multiplying matrices, the rank of the result will not exceed  $1$. More generally, $A^{\mathsf T}A$  Each column of is  $A^{\mathsf T}$  combination of columns, so its column space is contained in  $A^{\mathsf T}$  In the column space of , the ranks will only be smaller or equal, never larger. Generally, there are always



$$
\operatorname{rank}(A^{\mathsf T}A)=\operatorname{rank}(A),
\qquad
N(A^{\mathsf T}A)=N(A).
$$



Why are the two null spaces the same? One direction is direct: if  $A\boldsymbol{x}=\boldsymbol{0}$, multiply left by both sides  $A^{\mathsf T}$  Just get  $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$. The other direction uses the square of the length of section 1: if  $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$, multiply both sides by left  $\boldsymbol{x}^{\mathsf T}$, get



$$
0=\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}
=(A\boldsymbol{x})^{\mathsf T}(A\boldsymbol{x})
=\|A\boldsymbol{x}\|^2 .
$$



A vector whose length squared is zero can only be a zero vector, so  $A\boldsymbol{x}=\boldsymbol{0}$. The inclusion relationships in the two directions are combined, and the two null spaces are equal; then the sum of the rank and the null space dimension is the number of columns  $n$, the ranks of the two are also equal.

From this we get the most important criterion of this lecture: **$A^{\mathsf T}A$  Reversible if and only if  $N(A)$  Contains only zero vectors if and only if  $A$  The columns of are linearly independent of**. Not required here  $A$  It is a square matrix, and it is only required that it be of full rank. This also explains why the second example fails: two columns are related meaning  $N(A)$  Contains non-zero vectors, $A^{\mathsf T}A$  They cannot be distinguished from zero. As you will see in the next lecture, $A^{\mathsf T}A$  It will appear at the core of the problem later.

![Video 00:44:49: Classroom blackboard writing](</attachments/mit1806-3b77089f6ffa36d4b5a207f4.jpg>)

*Video 00:44:49｜Approximately corresponding to Section 7 "7.  $A^{\mathsf T}A$ "near reversibility".*

![Official Handout Summary Page 2/2](</attachments/mit1806-cef268c8c463403633cff3b3.png>)

*MIT OCW Official Lecture Notes Summary Page 2/2 (18.06SC Lecture 14 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **orthogonal** (orthogonal) i.e. vertical: two vectors are orthogonal if and only if  $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$;The square of the length is  $\|\boldsymbol{x}\|^2=\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$;The zero vector is orthogonal to all vectors.
- The Pythagorean theorem and the dot product criterion are the same thing: put  $\|\boldsymbol{x}+\boldsymbol{y}\|^2$  expand, eliminate  $\|\boldsymbol{x}\|^2$  with  $\|\boldsymbol{y}\|^2$, the remaining  $2\boldsymbol{x}^{\mathsf T}\boldsymbol{y}=0$.
- **orthogonal subspace** Definition of (orthogonal subspaces): $S$  Each vector in  $T$  Each vector in is orthogonal. The blackboard and the floor both pass through the origin but intersect on a straight line, so they are not orthogonal; the two orthogonal subspaces can only intersect at the zero vector.
- In a two-dimensional plane: a straight line is never orthogonal to the entire plane, a straight line is always orthogonal to the zero subspace, and two different straight lines are orthogonal if and only if  $90^\circ$.
- Row space is orthogonal to null space: $A\boldsymbol{x}=\boldsymbol{0}$  Description  $\boldsymbol{x}$  with  $A$  Each row of is orthogonal, and each row is orthogonal means that it is orthogonal to all linear combinations of the row space; for  $A^{\mathsf T}$  In the same way, the column space is orthogonal to the left null space.
- **orthogonal complement**(orthogonal complement): $N(A)$  contains **All** A vector orthogonal to the row space, so  $N(A)=C(A^{\mathsf T})^{\perp}$, the same reason  $N(A^{\mathsf T})=C(A)^{\perp}$;The dimensions respectively satisfy  $r+(n-r)=n$  with  $r+(m-r)=m$.
- $\mathbb R^3$  Example in: $A=\begin{bmatrix}1&2&5\\2&4&10\end{bmatrix}$  The rank is  $1$, the row space is over  $(1,2,5)$  the straight line; the null space is given by  $x_1+2x_2+5x_3=0$  Given, it is  $(1,2,5)$  is the plane of the normal vector.
- The best solution when there is no solution satisfies  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$, which is the central equation of this chapter; $A^{\mathsf T}A$  is  $n\times n$  Symmetric matrix.
- Example: $A=\begin{bmatrix}1&1\\1&2\\1&5\end{bmatrix}$  given  $A^{\mathsf T}A=\begin{bmatrix}3&8\\8&30\end{bmatrix}$, determinant  $26\neq 0$;When two columns are proportional (such as  $A=\begin{bmatrix}1&3\\1&3\\1&3\end{bmatrix}$)$A^{\mathsf T}A=\begin{bmatrix}3&9\\9&27\end{bmatrix}$, the rank is  $1$, irreversible.
- Generally  $N(A^{\mathsf T}A)=N(A)$, $\operatorname{rank}(A^{\mathsf T}A)=\operatorname{rank}(A)$; $A^{\mathsf T}A$  reversible if and only if  $A$  The columns are linearly independent.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| orthogonal | orthogonal | The angle between two vectors is  $90^\circ$, which is equivalent to the dot product being zero |
| dot product | dot product | The corresponding components are multiplied together and then summed, which is written as  $\boldsymbol{x}^{\mathsf T}\boldsymbol{y}$ |
| orthogonal subspaces | orthogonal subspace | Every vector in one subspace is orthogonal to every vector in the other subspace |
| orthogonal complement | orthogonal complement | Orthogonal to a given subspace **All** A subspace composed of vectors, such as  $N(A)=C(A^{\mathsf T})^{\perp}$ |
| row space | row space | $A$  The subspace formed by each row of is recorded as  $C(A^{\mathsf T})$ |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  of all  $\boldsymbol{x}$, recorded as  $N(A)$ |
| column space | column space | $A$  The subspace formed by each column of is denoted as  $C(A)$ |
| left nullspace | left null space | satisfy  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  of all  $\boldsymbol{y}$, recorded as  $N(A^{\mathsf T})$ |
| four fundamental subspaces | four fundamental subspaces | Row space, null space, column space, left null space, orthogonal pairing |
| symmetric matrix | symmetric matrix | satisfy  $A^{\mathsf T}=A$  The matrix of $A^{\mathsf T}A$  always symmetrical |
| linearly independent | linearly independent | The zero combination of each column has only a trivial solution, which is equivalent to  $N(A)$  Contains only zero vectors |
| best solution | best solution | $A\boldsymbol{x}=\boldsymbol{b}$  Satisfied when there is no solution  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$  of  $\hat{\boldsymbol{x}}$ |

---

[← Lecture 13](/en/notes/mit-1806/lec13) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 15 →](/en/notes/mit-1806/lec15)
