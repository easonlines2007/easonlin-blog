---
kind: notes
source: mit-1806/lec17
title: Lecture 17 · Orthogonal matrices and Gram-Schmidt orthogonalization
description: Use Gram-Schmidt to turn a set of basis into an orthonormal basis
  and understand QR decomposition.
sourceHash: c3926c3141539a9f85a2bf202b78bbc35e609bbf109d6138df08a25d7c73c7ef
publish: true
translationMethod: machine-assisted
---

> *Orthogonal matrices and Gram-Schmidt* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 17 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p17 · Orthogonal matrices and Gram-Schmidt orthogonalization](https://www.bilibili.com/video/BV1ix411f7Yp?p=17)(49:25)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-17-orthogonal-matrices-and-gram-schmidt/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=17&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The chapter on orthogonality concludes this lecture. We have dealt with two kinds of "orthogonality" before: two vectors **inner product** (inner product) is zero, and one subspace is perpendicular to another subspace everywhere (the row space and the null space are a pair). This lecture generalizes orthogonality from "two" to "a set": If each vector in a set of bases is perpendicular to all other vectors, and each vector is reduced to length  $1$  The unit vector of , this group of basis is called **orthonormal basis** (orthonormal basis). Arrange orthonormal vectors in columns into a matrix  $Q$, you will get the cleanest equation in this chapter: $Q^{\mathsf T}Q=I$.

This lecture is divided into two halves. The first half explains why this equation is worth pursuing. **projection matrix** (projection matrix) was originally  $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$, requires inversion; change to standard orthogonal  $Q$  After that, the middle  $Q^{\mathsf T}Q$  That’s it  $I$, the projection matrix immediately degenerates into  $QQ^{\mathsf T}$.**least squares** The core equation of (least squares)  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$  Similarly degenerated, the left side becomes the identity matrix, and the solution is directly  $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$——Each component is just an inner product, and no inversion is required. This is also why numerical linear algebra is largely organized around orthonormal vectors: the lengths are nailed to  $1$, the component will not get larger or smaller, nor will it overflow or underflow.

The second half solves "What to do if you don't have an orthonormal basis in hand". Given a set of **linearly independent** (linearly independent) vectors with arbitrary directions, **Gram-Schmidt** (Gram-Schmidt) Orthogonalization is corrected direction by direction: retain the first direction, subtract the component of the second vector along the first direction, then subtract the components of the third vector along the first two directions, and finally divide each vector by its own length. The whole process is written as a matrix  $A=QR$: $Q$  The columns of are orthogonal, $R$  is **upper triangular matrix** (upper triangular matrix). This is the same as the elimination derivation  $A=LU$  At the same level - elimination makes the matrix into a triangle, and Gram-Schmidt makes the matrix into "an orthonormal column matrix multiplied by a triangular matrix".

![Official Handout Summary Page 1/3](</attachments/mit1806-1410fff9d653a5e1b2da5534.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 17 Summary, CC BY-NC-SA 4.0).*

## 1. Standard orthogonal vector group and  $Q^{\mathsf T}Q=I$

The question to be answered in this section is: How to use a matrix equation to summarize "a set of vectors that are perpendicular to each other and have unit length".

Let the vector group  $\boldsymbol{q}_1,\boldsymbol{q}_2,\dots,\boldsymbol{q}_n$. It is customary to use letters  $q$  Represents this family of vectors because it suggests that these vectors are orthogonal in pairs, rather than a bunch of vectors picked at random. Standard orthogonality contains two requirements, corresponding to two conditions:



$$
\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j=
\begin{cases}
0, & i\neq j,\\
1, & i=j.
\end{cases}
$$



The first one is **orthogonal** (orthogonal): The inner product of any two different vectors is zero and their directions are ninety degrees to each other. The second item is the unit length: $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i=\|\boldsymbol{q}_i\|^2=1$. A vector is of course not orthogonal to itself, so the diagonal position must be specified separately as  $1$; "Orthogonal" plus "unitized" are collectively called **orthogonal** (orthonormal). A basis that only satisfies the first condition is called an orthonormal basis, and a basis that satisfies both of the two is called a standard orthonormal basis; this lecture uses the latter.

put this  $n$  vectors are put into the matrix one by one  $Q$  of columns. $Q$  It doesn't have to be a square matrix - for example, two orthogonal vectors placed in a four-dimensional space, $Q$  That’s it  $4\times2$  of. Calculate now  $Q^{\mathsf T}Q$: $Q^{\mathsf T}$  of the  $i$  OK  $\boldsymbol{q}_i^{\mathsf T}$, $Q$  of the  $j$  Column is  $\boldsymbol{q}_j$, so the product of  $(i,j)$  element is  $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$. The above two conditions determine each position: on the diagonal is  $1$, the remaining positions are  $0$. So



$$
Q^{\mathsf T}Q=I .
$$



This is a "row times column" multiplication: $Q^{\mathsf T}Q$  All the inner products were asked at once, and the standard positive answer was the best of all possible answers——**identity matrix** (identity matrix). Think back to the recurring theme in this chapter  $A^{\mathsf T}A$, which records exactly all the inner products between each column; $Q^{\mathsf T}Q=I$  It shows that when the columns are orthogonal, this inner product table degenerates into its simplest form.

if  $Q$  It is a square matrix, and the conclusion is stronger: $Q^{\mathsf T}Q=I$  Description  $Q^{\mathsf T}$  That’s it  $Q$  The inverse of  $Q^{\mathsf T}=Q^{-1}$. At this time, left multiplication and right multiplication are equal to  $I$, $QQ^{\mathsf T}=I$  is also established. Note that this last one only applies to **square array** is established; the rectangular matrix only has  $Q^{\mathsf T}Q=I$, while  $QQ^{\mathsf T}$  No  $I$.

There is an asymmetry in terminology worth noting: $Q$  When the columns of are orthogonal, the most appropriate name should be "orthogonal matrix", but the agreement only refers to **square array** called **orthogonal matrix** (orthogonal matrix), the rectangular matrix only says "has standard orthogonal columns". There is no mathematical reason for this habit. Just remember the conclusion: an orthogonal matrix must be a square matrix, and  $Q^{\mathsf T}Q=QQ^{\mathsf T}=I$.

There is also a basic fact: orthonormal vectors must be linearly independent. If a certain combination  $c_1\boldsymbol{q}_1+\cdots+c_n\boldsymbol{q}_n=\boldsymbol{0}$, use it with  $\boldsymbol{q}_i$  Do inner product, divide  $c_i$  Everything except that term disappears due to orthogonality, leaving only  $c_i=0$. Every coefficient must be zero, and the set of vectors is irrelevant. So "orthogonal" is stronger than "irrelevant": it guarantees independence, and additionally controls the length and angle.

![Video 00:04:56: Classroom blackboard writing](</attachments/mit1806-7c4671df707a9308ac65d5a9.jpg>)

*Video 00:04:56｜Approximately corresponding to Section 1 "1. Standard orthogonal vector group and  $Q^{\mathsf T}Q=I$"Nearby.*

![Video 00:09:17: Classroom blackboard writing](</attachments/mit1806-a62b067fe3d4c0cb2c447dd6.jpg>)

*Video 00:09:17｜Approximately corresponding to Section 1 "1. Standard orthogonal vector group and  $Q^{\mathsf T}Q=I$"Nearby.*

## 2. Several examples that must be remembered

The purpose of this section is to use specific matrices to implement the definition in the previous section, and at the same time accumulate models that will be used repeatedly later.

The simplest source is **permutation matrix** (permutation matrix): only one per row and column  $1$, the rest are all zero. For example



$$
Q=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}.
$$



Its three columns are  $\boldsymbol{e}_2,\boldsymbol{e}_3,\boldsymbol{e}_1$, are all unit vectors and the inner product of each pair is zero, so they are orthogonal matrices. Its transpose is another permutation matrix and therefore also orthonormal. Use one column  $1$  Of course it is too easy to create a standard orthogonal column, but it illustrates an important point: standard orthogonality only requires direction and length, and does not require the vector to be "complex".

The second source is "a unit vector plus its vertical direction" in the plane. Any angle  $\theta$,



$$
Q=\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}.
$$



first column  $(\cos\theta,\sin\theta)$  satisfy  $\cos^2\theta+\sin^2\theta=1$, is the unit vector; the second column  $(-\sin\theta,\cos\theta)$  Likewise. The inner product of two columns is  $-\cos\theta\sin\theta+\sin\theta\cos\theta=0$, so they are perpendicular to each other. put  $\theta=\frac{\pi}{4}$  Substitute it in and make some sign adjustments, and you get the simplest non-trivial example:



$$
\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$



Its two columns are indeed perpendicular, but the square length of each column is  $1^2+1^2=2$, the length is  $\sqrt2$, so it is not an orthogonal matrix yet. The correction is simply to divide the whole by  $\sqrt2$:



$$
Q=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}.
$$



This sequence of "first laying out the vertical direction, and finally dividing it by the length" is exactly the general structure of Gramm-Schmidt later.

The third source contains only  $\pm1$  matrix, called  **Hadamard matrix**. The fourth-order example is to repeat the pattern of the previous second-order matrix and then negative one of the entire blocks:



$$
Q=\frac12\begin{bmatrix}
1&1&1&1\\
1&-1&1&-1\\
1&1&-1&-1\\
1&-1&-1&1
\end{bmatrix}.
$$



Randomly check several pairs of columns: the inner product of the first column and the second column is  $1-1+1-1=0$;The first and third columns are  $1+1-1-1=0$;The second and third columns are  $1-1-1+1=0$. Each column has four  $\pm1$, the length squared is  $4$, divided by  $2$  Then the length is exactly  $1$. All these elements are  $\pm1$  the orthogonal matrix, $2$  level, $4$  level, $16$  level, $64$  Hierarchical situations people know how to construct; $5$  Orders cannot exist; there are still some orders that no one knows whether they exist.

The fourth source is the orthonormal column of rectangles, which is the shape that projection and least squares really encounter. Take two vectors in three-dimensional space



$$
\begin{bmatrix}1\\2\\2\end{bmatrix},
\qquad
\begin{bmatrix}-2\\-1\\2\end{bmatrix}.
$$



Their inner product is  $-2-2+4=0$, the square of each length is  $1+4+4=9$, the length is  $3$. Therefore



$$
Q=\frac13\begin{bmatrix}1&-2\\2&-1\\2&2\end{bmatrix}
$$



is a  $3\times2$  The matrix of $Q^{\mathsf T}Q=I_2$, its two columns are the orthonormal basis of a certain two-dimensional subspace. To make it up  $3\times3$  For an orthogonal matrix, you can add another column following this symbolic pattern: take the third column  $(2,-2,1)^{\mathsf T}$, its inner product with the first two columns is respectively  $2-4+2=0$  and  $-4+2+2=0$, the length squared is  $4+4+1=9$. So



$$
Q=\frac13\begin{bmatrix}
1&-2&2\\
2&-1&-2\\
2&2&1
\end{bmatrix}
$$



is an orthogonal matrix, all elements are simply divided by  $3$, not a single square root appears. This kind of good luck is not common: when doing Gram-Schmidt, dividing by the length always brings up the square root.

![Video 00:18:47: Classroom blackboard writing](</attachments/mit1806-b93156ff02db0e91f835d670.jpg>)

*Video 00:18:47 \| Approximately corresponding to section 2 "2. Several examples that must be remembered".*

## 3. Benefits brought by standard orthogonality: projection and least squares

This section answers the motivational question: What exactly do you get in exchange for the effort to create an orthonormal basis. The answer is that the formulas in this chapter also become simpler.

Let’s look at the projection first. to vector  $\boldsymbol{b}$  Project to  $Q$  of **column space** (column space), the general formula given in the previous lectures is



$$
P=Q(Q^{\mathsf T}Q)^{-1}Q^{\mathsf T}.
$$



when  $Q$  When the columns of  $Q^{\mathsf T}Q=I$, the one in the middle completely disappears, leaving



$$
P=QQ^{\mathsf T}.
$$



There is no need to calculate any inverse, and the product is just a combination of "column times row". Let's easily verify the two properties that the projection matrix must satisfy. The first one is symmetry: $(QQ^{\mathsf T})^{\mathsf T}=QQ^{\mathsf T}$, transpose swaps the positions of two factors and transposes each, and finally returns to the original state. The second one is "projecting twice equals projecting once":



$$
P^2=(QQ^{\mathsf T})(QQ^{\mathsf T})=Q(Q^{\mathsf T}Q)Q^{\mathsf T}=Q\,I\,Q^{\mathsf T}=QQ^{\mathsf T}=P .
$$



In the middle step, put the two  $Q$  between  $Q^{\mathsf T}Q$  Replace with  $I$  It is eliminated, and the basis is exactly "column standard orthogonality".

The two extremes must be distinguished. if  $Q$  is a square matrix, its column space is the entire space, and the projection should not move any vector. At this time  $QQ^{\mathsf T}=I$, which is the same as the "square matrix  $Q^{\mathsf T}=Q^{-1}$"Consistent. if  $Q$  It's rectangular, $QQ^{\mathsf T}$  No  $I$: It is a matrix that acts on the entire space, pressing the vector to  $Q$  of  $n$  In dimensional space, vectors generally change.

Let’s look at least squares again. The core equations in the previous lectures are **normal equation**(normal equation)



$$
A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}.
$$



put  $A$  Replace with  $Q$, the equation becomes  $Q^{\mathsf T}Q\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$, the left side is the identity matrix, so



$$
\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b},
\qquad\text{即}\qquad
\hat{x}_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{b}.
$$



No.  $i$  The coefficient is the  $i$  basis vectors and  $\boldsymbol{b}$  The inner product of. The original method requires first calculating all the inner accumulations to form  $A^{\mathsf T}A$, solve another system of equations; now there is no system of equations to solve, no matrix requiring inversion, just calculate a dot product for each component separately. This is the most valuable formula of the standard orthonormal basis: under the standard orthonormal basis, the coordinates are projections, which are inner products, and do not require "solution".

The numerical benefit is here too. The length of an orthonormal vector is always  $1$, no matter how messy the direction is, it will not make the components become extremely large or extremely small, and there will be neither overflow nor underflow in the calculation; this is why a large number of numerical linear algebra uses standard orthogonal vectors as the basic building blocks.

![Official Handout Summary Page 2/3](</attachments/mit1806-94aa24a4c1c9d5d228b57df5.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 17 Summary, CC BY-NC-SA 4.0).*

![Video 00:25:31: Classroom blackboard writing](</attachments/mit1806-bfbfccda6d4d31da15945c77.jpg>)

*Video 00:25:31 \| Approximately corresponding to Section 3 "3. Benefits of orthogonality: projection and least squares".*

## 4. Gramm-Schmidt: case of two vectors

The remaining problem is construction: How to get the orthonormal vectors when we only have a set of vectors that are linearly independent but have random directions?

First deal with two vectors. Set  $\boldsymbol{a}_1,\boldsymbol{a}_2$  Linear independence, to create  $\boldsymbol{q}_1,\boldsymbol{q}_2$. The process is divided into two steps: first turn them into two mutually perpendicular vectors, and then divide each by their length. To avoid having to deal with the matrix  $A$  Confused, this paragraph marks the vector after orthogonalization but not unitized as  $\boldsymbol{v}_1,\boldsymbol{v}_2$.

There is almost no need to do this first step. $\boldsymbol{a}_1$  There is no problem with the direction itself. Any direction can be used as the first direction. Just take



$$
\boldsymbol{v}_1=\boldsymbol{a}_1 .
$$



The trouble is with the second vector: $\boldsymbol{a}_2$  Generally not perpendicular to  $\boldsymbol{a}_1$. What you are looking for is "from  $\boldsymbol{a}_2$  Set off, just take the edge  $\boldsymbol{a}_1$ "Remove that part of the direction". This is the earliest basic calculation in this chapter: put  $\boldsymbol{a}_2$  Project to  $\boldsymbol{a}_1$  on, the projection is along  $\boldsymbol{a}_1$  That part, minus it, the remainder is the vertical part, which is the error vector at that time  $\boldsymbol{e}$. What we want now is this error vector:



$$
\boldsymbol{v}_2=\boldsymbol{a}_2-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1 .
$$



The coefficient is the ratio of "how many times to reduce": the numerator is  $\boldsymbol{a}_2$  in  $\boldsymbol{v}_1$  The inner product in the direction, the denominator is  $\boldsymbol{v}_1$  and its own inner product, divide the two to align the units, so that what is subtracted is exactly a multiple of the projection, not the  $\boldsymbol{v}_1$  Lose the whole thing. Orthogonalization and unitization are two independent things: orthogonalization only uses inner products and multiples, which is the essence of the algorithm; unitization is just the final division of the length.

Whether this structure is correct or not can be seen by multiplying it:



$$
\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_2
=\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2
-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1
=\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2-\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2=0 .
$$



If you subtract the same numbers in the numerator and denominator, the result is indeed zero. $\boldsymbol{v}_2$  Nor will it be a zero vector: if  $\boldsymbol{v}_2=\boldsymbol{0}$, then  $\boldsymbol{a}_2$  is  $\boldsymbol{v}_1=\boldsymbol{a}_1$  A multiple of , the two vectors are linearly related, which is inconsistent with the assumption. So these two vectors still form the original two-dimensional subspace, but the directions are corrected.

The final step is normalization, where the square root appears:



$$
\boldsymbol{q}_1=\frac{\boldsymbol{v}_1}{\|\boldsymbol{v}_1\|},
\qquad
\boldsymbol{q}_2=\frac{\boldsymbol{v}_2}{\|\boldsymbol{v}_2\|}.
$$



Dividing by a positive number does not change the direction, only changes the length to  $1$; Two vectors are originally perpendicular, but remain perpendicular after dividing by a positive number. The algorithm ends here: $\boldsymbol{q}_1,\boldsymbol{q}_2$  orthonormal and with  $\boldsymbol{a}_1,\boldsymbol{a}_2$  into the same subspace.

![Video 00:32:07: Classroom blackboard writing](</attachments/mit1806-089b4c45ed753ba43a60ad8d.jpg>)

*Video 00:32:07 \| Approximately corresponding to Section 4 "4. Gramm-Schmidt: The case of two vectors".*

## 5. Three vectors and one numerical example

The situation of the three vectors is exactly the same. Set  $\boldsymbol{a}_1,\boldsymbol{a}_2,\boldsymbol{a}_3$  Linearly independent, the first two have been processed into  $\boldsymbol{v}_1,\boldsymbol{v}_2$, the third one should start from  $\boldsymbol{a}_3$  subtract all its components in the first two directions:



$$
\boldsymbol{v}_3=\boldsymbol{a}_3
-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_3}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\,\boldsymbol{v}_1
-\frac{\boldsymbol{v}_2^{\mathsf T}\boldsymbol{a}_3}{\boldsymbol{v}_2^{\mathsf T}\boldsymbol{v}_2}\,\boldsymbol{v}_2 .
$$



The two items are divided into  $\boldsymbol{v}_1$, along  $\boldsymbol{v}_2$  components are reduced. due to  $\boldsymbol{v}_1,\boldsymbol{v}_2$  are already perpendicular to each other. These two subtractions do not interfere with each other. After the subtraction,  $\boldsymbol{v}_3$  Perpendicular to both. It will not be a zero vector because linear independence guarantees  $\boldsymbol{a}_3$  Not in the plane spanned by the first two vectors. Finally divided by the length, we get  $\boldsymbol{q}_3$. The whole method has nothing to do with dimensionality: the vector can be in a two-dimensional plane or in a twelve-dimensional space, and the formula only uses the inner product and length. Generally, no.  $k$  vector to be subtracted from the front  $k-1$  all components in known directions, and each later obtained  $\boldsymbol{q}$  are perpendicular to all earlier vectors - this property is what the next section  $R$  Become the source of the upper triangle.

Go through it with a specific example. take



$$
\boldsymbol{a}_1=\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{a}_2=\begin{bmatrix}1\\0\\2\end{bmatrix}.
$$



The two vectors are not perpendicular: the inner product is  $1\cdot1+1\cdot0+1\cdot2=3$, just needs orthogonalization.

Copy the first direction: $\boldsymbol{v}_1=\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$. Calculate the ratio:



$$
\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}
=\frac{3}{1+1+1}=\frac33=1 .
$$



thus



$$
\boldsymbol{v}_2=\boldsymbol{a}_2-1\cdot\boldsymbol{v}_1
=\begin{bmatrix}1\\0\\2\end{bmatrix}-\begin{bmatrix}1\\1\\1\end{bmatrix}
=\begin{bmatrix}0\\-1\\1\end{bmatrix}.
$$



Check orthogonality: $\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_2=1\cdot0+1\cdot(-1)+1\cdot1=0$, indeed vertical. The proportion is exactly  $1$  It is a coincidence of numbers, generally not integers.

Finally unitized. $\|\boldsymbol{v}_1\|=\sqrt3$, $\|\boldsymbol{v}_2\|=\sqrt2$, so



$$
\boldsymbol{q}_1=\frac{1}{\sqrt3}\begin{bmatrix}1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{q}_2=\frac{1}{\sqrt2}\begin{bmatrix}0\\-1\\1\end{bmatrix}.
$$



Arrange them in a matrix



$$
Q=\begin{bmatrix}
1/\sqrt3&0\\
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&1/\sqrt2
\end{bmatrix}.
$$



Its two columns are orthogonal and can be directly checked  $Q^{\mathsf T}Q=I_2$: On the diagonal is  $\frac33=1$  with  $\frac22=1$, the off-diagonal line is  $(0-1+1)/\sqrt6=0$.

The most critical point in this example is **Column space has not changed**.$Q$  The column space and original reason of  $\boldsymbol{a}_1,\boldsymbol{a}_2$  The planes formed are the same plane: $\boldsymbol{v}_2=\boldsymbol{a}_2-\boldsymbol{a}_1$  It is originally a combination of the two, and unitization just replaces the columns with another set of basis in the same plane. What Gram-Schmidt changed was only the mass of the basis, but not the space spanned by the basis. So any calculations on the original plane - projection, least squares, coordinates - can be done on the new basis, and the new basis makes every step a dot product.

![Video 00:38:32: Classroom blackboard writing](</attachments/mit1806-ce0b6956863fc8c76f5272fa.jpg>)

*Video 00:38:32 \| Approximately corresponding to Section 5 "5. Three vectors and a numerical example".*

## 6. Matrix language: $A=QR$

Orthogonalization also needs to be written as a matrix factorization, just like elimination is finally written as  $A=LU$. In practice, no one would always write "these columns are perpendicular to each other and the length of these columns is  $1$", people wrote  $A$  with  $Q$  the matrix between.

Let’s sort out the examples from the previous section. $A$  The columns are  $\boldsymbol{a}_1,\boldsymbol{a}_2$, $Q$  The columns are  $\boldsymbol{q}_1,\boldsymbol{q}_2$. The two sets of columns are stretched into the same plane, and each  $\boldsymbol{a}_j$  can be written  $\boldsymbol{q}_1,\boldsymbol{q}_2$  combination of , then there exists a  $2\times2$  matrix  $R$  such that



$$
A=QR .
$$



$R$  This can be calculated column by column. $\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$  with  $\boldsymbol{q}_1$  In the same direction, the length is  $\sqrt3$, so  $\boldsymbol{a}_1=\sqrt3\,\boldsymbol{q}_1$; $\boldsymbol{a}_2$  Write it first  $\boldsymbol{a}_1+\boldsymbol{v}_2$, and then use  $\boldsymbol{q}_1,\boldsymbol{q}_2$  express, get  $\boldsymbol{a}_2=\sqrt3\,\boldsymbol{q}_1+\sqrt2\,\boldsymbol{q}_2$. Together it is



$$
A=\begin{bmatrix}1&1\\1&0\\1&2\end{bmatrix}
=\begin{bmatrix}
1/\sqrt3&0\\
1/\sqrt3&-1/\sqrt2\\
1/\sqrt3&1/\sqrt2
\end{bmatrix}
\begin{bmatrix}
\sqrt3&\sqrt3\\
0&\sqrt2
\end{bmatrix}
=QR .
$$



$R$  The upper triangle shape is no coincidence. Generally, if  $Q$  The columns of are orthogonal, $A$  The columns are  $\boldsymbol{a}_1,\dots,\boldsymbol{a}_n$, then  $A=QR$  of the  $j$  column gives  $\boldsymbol{a}_j=\sum_{i=1}^{n}\boldsymbol{q}_iR_{ij}$. Take left on both sides  $\boldsymbol{q}_k^{\mathsf T}$, due to  $Q$  The columns of are orthogonal in pairs, leaving only  $i=k$  One item:



$$
R_{kj}=\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j .
$$



Now let’s see why everything below the diagonal is zero. When  $k>j$  when, $\boldsymbol{a}_j$  fall on  $\boldsymbol{q}_1,\dots,\boldsymbol{q}_j$  in the Zhang Cheng space, and  $\boldsymbol{q}_k$  was created later, and is constructed perpendicular to all earlier directions according to the algorithm, so  $\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j=0$, that is  $R_{kj}=0$. This is exactly the definition of an upper triangular matrix: all zeros below the main diagonal. The diagonal element is  $R_{jj}=\boldsymbol{q}_j^{\mathsf T}\boldsymbol{a}_j=\|\boldsymbol{v}_j\|>0$, in the example  $\sqrt3$  with  $\sqrt2$.

So we get the final conclusion of this lecture: any linearly independent matrix can be decomposed into the product of an orthogonal column matrix and an upper triangular matrix. This decomposition is called **QR decomposition**(QR factorization):



$$
A=QR .
$$



$Q$  gives the orthonormal basis of the same column space, $R$  Record the coefficients required for the new basis to represent the old column; $R$  Each number in is the inner product and length that have been calculated during the orthogonalization process, and no new quantities are introduced. Got it  $Q$, the projection is  $QQ^{\mathsf T}$, the least squares solution is  $Q^{\mathsf T}\boldsymbol{b}$, all no longer need to be inverse; with  $R$, only then do we know how to convert this set of beautiful bases to the original matrix. This is exactly how elimination and orthogonalization work: $A=LU$  Store the elimination information into the lower triangular matrix, $A=QR$  Store the orthogonalized information into an upper triangular matrix.

![Video 00:44:28: Classroom blackboard writing](</attachments/mit1806-52ab1fbd9ebfa9140d74d5a0.jpg>)

*Video 00:44:28｜Approximately corresponding to Section 6 "6. Matrix Language: $A=QR$"Nearby.*

![Official Handout Summary Page 3/3](</attachments/mit1806-ea8ce4498f92e4c762ffd6bc.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 17 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **orthogonal** (orthonormal) means that the inner product of each pair is zero, and the length of each vector is  $1$;The condition is written as  $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j=\delta_{ij}$, that is, the diagonal angle is  $1$, the rest are  $0$.
- If  $Q$  The columns of are orthogonal, then  $Q^{\mathsf T}Q=I$;if  $Q$  Or square array, then  $Q^{\mathsf T}=Q^{-1}$, that is  $QQ^{\mathsf T}=I$. It was agreed to only call the square array **orthogonal matrix**(orthogonal matrix).
- Orthogonal vectors must be linearly independent: use  $\boldsymbol{q}_i$  Go to the dot multiplication zero combination to force out the first  $i$  coefficient is zero.
- Typical example: permutation matrix; the two columns are  $(\cos\theta,\sin\theta)^{\mathsf T}$  with  $(-\sin\theta,\cos\theta)^{\mathsf T}$  matrix; $2\times2$  of  $\pm1$  Divide the entire matrix by  $\sqrt2$;The entire fourth-order Hadamard matrix is divided by  $2$;The example with three rows and two columns divides the whole by  $3$.
- When the columns are orthogonal, the projection matrix degenerates into  $P=QQ^{\mathsf T}$, it is symmetrical and satisfies  $P^2=P$; $Q$  When it is a square matrix  $P=I$.
- The normal equation degenerates into  $Q^{\mathsf T}Q\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$, that is  $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$, No.  $i$  The coefficient is  $\hat{x}_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{b}$: "Coordinates are dot products".
- Two core steps of Gramm-Schmidt: orthogonalization  $\boldsymbol{v}_1=\boldsymbol{a}_1$, $\boldsymbol{v}_2=\boldsymbol{a}_2-\frac{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{a}_2}{\boldsymbol{v}_1^{\mathsf T}\boldsymbol{v}_1}\boldsymbol{v}_1$, when there are three vectors, subtract the edge  $\boldsymbol{v}_2$  component; then unitize  $\boldsymbol{q}_i=\boldsymbol{v}_i/\|\boldsymbol{v}_i\|$.
- Numerical example: $\boldsymbol{a}_1=(1,1,1)^{\mathsf T}$, $\boldsymbol{a}_2=(1,0,2)^{\mathsf T}$  given  $\boldsymbol{v}_2=(0,-1,1)^{\mathsf T}$;The two columns after unitization are  $(1,1,1)^{\mathsf T}/\sqrt3$  with  $(0,-1,1)^{\mathsf T}/\sqrt2$, the column space is still the original plane.
- The whole process is written as  $A=QR$, $R_{kj}=\boldsymbol{q}_k^{\mathsf T}\boldsymbol{a}_j$  is an upper triangular matrix; $R_{kj}=0\ (k>j)$  It's because it's later  $\boldsymbol{q}_k$  perpendicular to earlier  $\boldsymbol{a}_j$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| orthonormal | orthogonal | The inner product of each pair is zero and the length of each vector is  $1$ |
| orthonormal basis | orthonormal basis | A basis consisting of orthonormal vectors, the coordinates can be read directly from the inner product |
| orthogonal matrix | orthogonal matrix | A standard orthogonal square matrix satisfies  $Q^{\mathsf T}=Q^{-1}$ |
| Gram-Schmidt | Gram-Schmidt | Orthogonalization algorithm that subtracts the projection in the obtained direction one by one from the linearly independent vector group and then normalizes it |
| QR factorization | QR decomposition | Write a matrix whose columns are linearly independent as the product of an orthogonal column matrix and an upper triangular matrix |
| projection matrix | projection matrix | Project the vector into a matrix in the column space. When the columns are orthogonal, it simplifies to  $QQ^{\mathsf T}$ |
| normal equation | normal equation | least squares equation  $A^{\mathsf T}A\hat{\boldsymbol{x}}=A^{\mathsf T}\boldsymbol{b}$, $Q$  The situation degenerates into  $\hat{\boldsymbol{x}}=Q^{\mathsf T}\boldsymbol{b}$ |
| permutation matrix | permutation matrix | Only one per row and column  $1$  The square matrix of is always an orthogonal matrix |
| Hadamard matrix | Hadamard matrix | All elements are  $\pm1$  Orthogonal matrix of , the fourth-order example requires dividing the whole by  $2$ |
| upper triangular matrix | upper triangular matrix | A matrix with all zeros below the main diagonal, $A=QR$  in  $R$  That's this kind of thing |

---

[← Lecture 16](/en/notes/mit-1806/lec16) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 18 →](/en/notes/mit-1806/lec18)
