---
kind: notes
source: mit-1806/lec30
title: Lecture 30 · Linear transformations and their matrices
description: Understand how linear transformations correspond to matrices, and
  how the choice of basis changes the matrix.
sourceHash: e829656f25ba945d63e2d755c7cedfb4d9d8bbb040b5136208153af8bfcca8a0
publish: true
translationMethod: machine-assisted
---

> *Linear transformations and their matrices* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 30 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p31 · Linear transformation and its matrix](https://www.bilibili.com/video/BV1ix411f7Yp?p=31)(49:27)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-30-linear-transformations-and-their-matrices/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=31&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous twenty lectures, the matrix has always been the protagonist: elimination turns it into an upper triangle, four basic subspaces are cut out from it, and determinant, eigenvalue, and singular value decomposition each add a layer of structure to it. But where did the matrix itself come from? This lecture returns to a more primitive object——**linear transformation** (linear transformation). It requires no coordinates or matrices: assigning an output vector to each vector is like assigning a function value to each number. Linear algebra courses decades ago started with linear transformations, and physicists prefer to look at problems this way because they don’t want to lay out a bunch of coordinates as soon as they open their mouths.

The question to be answered in this lecture is: How can an abstract linear transformation be represented by a matrix? The solution is to choose two sets of basis - one in the input space and one in the output space - and then just look at what the transformation does to the input basis vectors: convert each  $T(\boldsymbol{v}_j)$  Written as a linear combination of output basis vectors, the coefficient of the combination is the first  $j$  columns. In turn, each matrix is also passed  $T(\boldsymbol{v})=A\boldsymbol{v}$  Gives a linear transformation. Matrices were originally invented to study linear transformations.

The third level conclusion is more intriguing: the shape of the matrix depends on the basis. For the same projection, if a set of basis is changed, the matrix may be as simple as leaving only one non-zero element, or it may be written as  $P=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$  Such a full matrix. This lecture uses three examples of projection, rotation, and derivation to complete this path. Finally, you will see that the multiplication of a matrix corresponds to the composition of a transformation, and the inverse of a matrix corresponds to the inverse of a transformation.

![Official Handout Summary Page 1/4](</attachments/mit1806-10aea22126783f5cce388330.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 30 Summary, CC BY-NC-SA 4.0).*

## 1. Linear transformation and two rules

**transform** (Transformation) is a function: input a vector, output a vector, sometimes also called **mapping** (mapping). customarily used  $T$  means, because the first letter of transformation is T. It is not essentially different from the functions seen in middle school, except that the input and output are replaced by vectors; writing  $T(\boldsymbol{v})$, read as "$\boldsymbol{v}$  in  $T$  The image below."

The first example is **projection** (projection). on plane  $\mathbb{R}^2$  Here, a straight line passing through the origin is fixed, and each vector  $\boldsymbol{v}$  becomes its projection on a straight line  $T(\boldsymbol{v})$. The entire process does not require coordinates: as long as you know where the line is, the image of each vector is uniquely determined. Take another vector  $\boldsymbol{w}$, also cast on this straight line. Axes, scales, and weights can all be erased, while the geometric relationships remain intact.

There are infinite kinds of mappings that can be written. This lecture is only concerned with the type that satisfies a special rule, that is, linear transformation. Projections fall into this category, and the rule is: there are only two operations on vectors - addition and multiplication - and transformations should match these two operations in the simplest way.

If the vector is doubled in length, the projection will also be doubled in length; if the vector is reversed, the projection will also be reversed; adding two vectors first and then projecting them will produce the same result as first projecting them separately and then adding them. These properties, written as formulas, are the two requirements for linear transformation:



$$
T(\boldsymbol{v}+\boldsymbol{w})=T(\boldsymbol{v})+T(\boldsymbol{w}),
\qquad
T(c\boldsymbol{v})=cT(\boldsymbol{v}).
$$



Two rules can be combined into one: the image of any linear combination is equal to the same linear combination of the image,



$$
T(c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2)=c_1T(\boldsymbol{v}_1)+c_2T(\boldsymbol{v}_2).
$$



Note that the second rule holds for any real number  $c$  are established, $c=2$  OK, $c=-1$  That's ok too.

There is an immediately applicable corollary: **The zero vector must map to the zero vector**, the origin cannot be moved. take  $\boldsymbol{v}=\boldsymbol{0}$, $c=3$, the second rule gives  $T(\boldsymbol{0})=3T(\boldsymbol{0})$, subtract both sides to get  $T(\boldsymbol{0})=\boldsymbol{0}$. This corollary requires almost no effort, but it is the fastest way to deny a transformation: as long as a transformation is found to move the origin, it must not be linear.

![Video 00:04:57: Classroom blackboard writing](</attachments/mit1806-6a7c8c062574a3e0e994d4e0.jpg>)

*Video 00:04:57 \| Approximately corresponding to Section 1 "1. Linear Transformation and Two Rules".*

## 2. Two counterexamples: translation and length

It seems that natural rules are not necessarily linear. Two counterexamples illustrate this point.

The first counterexample translates the entire plane by a fixed vector  $\boldsymbol{v}_0$:



$$
T(\boldsymbol{v})=\boldsymbol{v}+\boldsymbol{v}_0 .
$$



Each vector moves forward the same distance. This rule seems simple and reasonable, but linearity requires something else. double  $\boldsymbol{v}$  cannot be doubled  $T(\boldsymbol{v})$: The left side becomes  $2\boldsymbol{v}+\boldsymbol{v}_0$, the right side is  $2T(\boldsymbol{v})=2\boldsymbol{v}+2\boldsymbol{v}_0$, unless  $\boldsymbol{v}_0=\boldsymbol{0}$, the two are not equal - the translation amount is always the same  $\boldsymbol{v}_0$, does not become as the input doubles  $2\boldsymbol{v}_0$. The addition rule is also broken because  $T(\boldsymbol{v}+\boldsymbol{w})=\boldsymbol{v}+\boldsymbol{w}+\boldsymbol{v}_0$, while  $T(\boldsymbol{v})+T(\boldsymbol{w})=\boldsymbol{v}+\boldsymbol{w}+2\boldsymbol{v}_0$. You can see the problem at a glance using the criteria from the previous section: $T(\boldsymbol{0})=\boldsymbol{v}_0\neq\boldsymbol{0}$, the origin has been moved.

The second counterexample takes the length:  $\mathbb{R}^3$  Each vector in is mapped to its length, and the result is a real number, which can be viewed as  $\mathbb{R}^1$  vector in . Transformations allow for dimensionality reduction, so this in itself is not a problem. A zero vector does map to zero, and doubling does double: $T(2\boldsymbol{v})=2\|\boldsymbol{v}\|=2T(\boldsymbol{v})$. But changing it to a negative multiple is confusing:



$$
T(-2\boldsymbol{v})=\|-2\boldsymbol{v}\|=2\|\boldsymbol{v}\|,
\qquad
-2T(\boldsymbol{v})=-2\|\boldsymbol{v}\| .
$$



The length only remembers the size and loses the direction: $\boldsymbol{v}$  with  $-\boldsymbol{v}$  Being pressed to the same number is the reason why it cannot handle the negative coefficient. This counterexample also shows why the two rules must be written separately: it passes the test of zero vector, and it also passes the test of positive multiples. The real constraints are hidden in  $c<0$  situation. The two counterexamples fail in different ways, which just shows that linearity is not an automatically established property, but a real restriction on transformation.

![Video 00:11:55: Classroom blackboard writing](</attachments/mit1806-d008215dfd8e70211cc584c1.jpg>)

*Video 00:11:55 \| Approximately corresponding to section 2 "2. Two counterexamples: translation and length".*

## 3. Rotation, whole house and matrix multiplication

Give another true linear transformation: put every vector in the plane around the origin **rotate**(rotation)$45^\circ$. No coordinates are needed to describe it - given an input vector, the output is the rotated  $45^\circ$  that vector. It is linear: put  $\boldsymbol{v}$  If the length is doubled, the turned arrow will also be twice as long; adding the two vectors first and then rotating them, or rotating them separately and then adding them, will get the same result.

There's a point worth emphasizing here: you don't have to focus on one vector at a time. Apply the transformation to an entire graphic - such as the small house on the plane painted on the cover of the textbook, and send every point on the outline into  $T$——You can see what the transformation does to the entire space at once. rotate  $45^\circ$  After that, the whole house followed  $45^\circ$, the orientation of the roof and the orientation of the door change together. **Linear transformation is a movement of the entire space, and matrix multiplication is just its coordinate writing.**

A third category of examples comes from the matrix itself. fix a matrix  $A$, order



$$
T(\boldsymbol{v})=A\boldsymbol{v}.
$$



This is a linear transformation because matrix multiplication distributes both addition and numerical multiplication:



$$
A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w},
\qquad
A(c\boldsymbol{v})=c(A\boldsymbol{v}).
$$



Each matrix is given a transformation, and the examples are endless. The meaning of matrix multiplication by vector is also revealed here: the input vector is multiplied by the matrix to obtain an output vector, and this output vector often falls in another space and can have different dimensions. The shapes are also automatically aligned: let the input fall on  $\mathbb{R}^n$, the output falls into  $\mathbb{R}^m$, $A$  It should be  $m\times n$  matrix. For example from  $\mathbb{R}^3$  Arrive  $\mathbb{R}^2$  The linear transformation of  $2\times 3$  matrix is given; use a  $2\times 3$  The matrix multiplies the three-component input vector to get exactly the two-component output.

Let’s look at an example specifically. take



$$
A=\begin{bmatrix}1&0\\0&-1\end{bmatrix},
$$



it is **Diagonal**, the function couldn’t be simpler: $x$  Keep the portions as they are, $y$  Components change sign. Use it to transform that house, the tip of the roof  $(x,y)$  become  $(x,-y)$——The horizontal coordinate does not move, and the vertical coordinate flips to the bottom. As a result, the whole house is turned upside down, and the door runs to the top. This is what a matrix does to the entire plane.

So the task of this lecture is clear: given a linear transformation described in geometric language, **Find the matrix hidden behind it**. To achieve this, you must first have coordinates; and coordinates come from the basis. This is the bridge that will be built in the following sections.

![Official Handout Summary Page 2/4](</attachments/mit1806-d9259d675a42b6400feae1c8.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 30 Summary, CC BY-NC-SA 4.0).*

![Video 00:18:48: Classroom blackboard writing](</attachments/mit1806-c8f7dd6a875c70468655002c.jpg>)

*Video 00:18:48 \| Approximately corresponding to section 3 "3. Rotation, whole house and matrix multiplication".*

## 4. If you know the image on the basis, you will know the entire transformation

Set  $T$  from  $\mathbb{R}^n$  reflected  $\mathbb{R}^m$, that is, input  $n$  Dimension, output  $m$  dimension. A natural question is: in order to be fully known to others  $T$  What is the minimum information required for all input functions?

tell the other person  $T(\boldsymbol{v}_1)$, he only knows this value, which is far from enough. Give another vector  $\boldsymbol{v}_2$  and its likeness  $T(\boldsymbol{v}_2)$, the situation immediately changed: he knew  $T(\boldsymbol{v}_1)$  with  $T(\boldsymbol{v}_2)$, we know through linearity  $T$  Applies to all combinations  $c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2$  The above result means that we know  $T$  on the entire plane based on these two vectors. The premise is  $\boldsymbol{v}_1,\boldsymbol{v}_2$ **linearly independent** (linearly independent); if  $\boldsymbol{v}_2=6\boldsymbol{v}_1$, then  $T(\boldsymbol{v}_2)=6T(\boldsymbol{v}_1)$  It's calculated, and this piece of information doesn't bring anything new.

One step further promotion, the conclusion is: as long as you know  $T$  in a **base** $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$  By taking the image of each basis vector, we know the entire transformation. because of base **Zhang Cheng** (span) the entire input space, each  $\boldsymbol{v}$  can be written uniquely



$$
\boldsymbol{v}=c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n,
$$



while linearity enforces



$$
T(\boldsymbol{v})=c_1T(\boldsymbol{v}_1)+\cdots+c_nT(\boldsymbol{v}_n),
$$



There is no choice. Therefore, the amount of information of a linear transformation is limited: $n$  output vectors, each output vector in  $\mathbb{R}^m$  need  $m$  To describe the number, a total of  $mn$  number - this is exactly one  $m\times n$  The number of elements of the matrix.

The next question is: how to arrange these numbers into the matrix? The answer depends **coordinates**. Coordinates are generated by the basis: once the basis is selected, the way each vector is written as a combination of basis vectors is unique - the basis is spread into a space, which means it must exist; it has nothing to do with linearity, which means it must be unique - the coefficient of the combination is its coordinates. usually write  $\boldsymbol{v}=(3,2,4)$, in fact, a set of basis is implicitly assumed: **Standard base**(standard basis)$\boldsymbol{e}_1,\boldsymbol{e}_2,\boldsymbol{e}_3$, three numbers are three coordinates. But you can also change a set of bases, such as the eigenvectors of a certain matrix, and then the coordinates of the same vector will completely change. The reason why the matrix changes with the basis is here.

## 5. Creating a matrix from transformation: two sets of bases and the meaning of each column

Now write the rules down. Given a linear transformation  $T:\mathbb{R}^n\to\mathbb{R}^m$, choose two sets of bases: input base  $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$ (all in  $\mathbb{R}^n$  middle), output base  $\boldsymbol{w}_1,\ldots,\boldsymbol{w}_m$ (all in  $\mathbb{R}^m$  middle). Since the output space has a basis, each  $T(\boldsymbol{v}_j)$  can be uniquely written as a combination of output bases:



$$
T(\boldsymbol{v}_j)=a_{1j}\boldsymbol{w}_1+a_{2j}\boldsymbol{w}_2+\cdots+a_{mj}\boldsymbol{w}_m .
$$



Arrange these coefficients vertically in a column to form a matrix  $A$  of the  $j$  Column:



$$
A=\begin{bmatrix}
a_{11} & a_{12} & \cdots & a_{1n}\\
a_{21} & a_{22} & \cdots & a_{2n}\\
\vdots & \vdots & & \vdots\\
a_{m1} & a_{m2} & \cdots & a_{mn}
\end{bmatrix}.
$$



Summarize it in one sentence: **Take the first place  $j$  input basis vectors, perform transformation, and write the image as a combination of output basis vectors. The coefficient is the  $j$  columns.**  Do this column by column, $A$  It's set up. its shape is  $m\times n$: The number of rows comes from the dimensionality of the output space, and the number of columns comes from the dimensionality of the input space, which is the same as "from  $\mathbb{R}^n$  Arrive  $\mathbb{R}^m$  use  $m\times n$  Matrix" is exactly the same. This also explains why two sets of bases must be given at the same time - without bases, there are no coordinates, and without coordinates, there is no way to talk about matrices.

The entire calculation process can be explained in one sentence: first use the input basis to translate the vector into coordinates, multiply  $A$, and then translate the resulting array back into a vector using the output base. This matrix does exactly what it is supposed to do: multiply the input coordinate vector by  $A$, get the output coordinate vector. To verify, just look at the basis vectors. Take the input coordinates as  $(1,0,\ldots,0)^{\mathsf T}$, the input vector it represents is  $\boldsymbol{v}_1$; $A$  Multiplying this column, we get  $A$  The first column of , which is constructed to be exactly  $T(\boldsymbol{v}_1)$  Coordinates in the output basis. The same is true for the second column, the third column... and every column. Since the equation is true for every basis vector and both sides are linear for the inputs, it must hold for all inputs. This is exactly the argument from Section 4 that “the image of the base determines everything”, but now translated into matrix language.

![Video 00:32:09: Classroom blackboard writing](</attachments/mit1806-ff5070c3e5fa1f315efe806b.jpg>)

*Video 00:32:09｜Approximately corresponding to Section 5 "5. Creating matrices from transformations: two sets of bases and the meaning of each column".*

![Official Handout Summary Page 3/4](</attachments/mit1806-c9263d4a9eb58a7db9093694.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 30 Summary, CC BY-NC-SA 4.0).*

## 6. The same projection, two bases

Make a complete presentation with projection. Take the projection in the plane and project it onto a straight line passing through the origin. Choose a set first **Good gay**: The input base and the output base are in the same group, $\boldsymbol{v}_1$  is the unit vector on the straight line, $\boldsymbol{v}_2$  is the unit vector perpendicular to the line.

Construct column-by-column according to the rules of Section 5. $T(\boldsymbol{v}_1)=\boldsymbol{v}_1$, because the vector does not move after projection on the straight line; its coordinates in the output basis are  $(1,0)^{\mathsf T}$, this is the first column. $T(\boldsymbol{v}_2)=\boldsymbol{0}$, the component perpendicular to the straight line is killed by projection; the coordinates are  $(0,0)^{\mathsf T}$, this is the second column. So



$$
A=\begin{bmatrix}1&0\\0&0\end{bmatrix}.
$$



Check it out: enter coordinates  $(c_1,c_2)^{\mathsf T}$  was sent to  $(c_1,0)^{\mathsf T}$, it is the projection that “retains the parallel components and kills the vertical components”. This matrix is diagonal, with diagonal elements  $1$  and  $0$  Just projected **eigenvalue** (eigenvalue), while  $\boldsymbol{v}_1,\boldsymbol{v}_2$  is its **eigenvector** (eigenvector). Under a good basis, two algebraic properties of projection can be seen at a glance: the diagonal matrix is of course symmetric; the diagonal element has only  $0$  and  $1$, the square is still itself, so  $A^2=A$.

Replace with **Standard base** Do the math again. Suppose it is projected onto  $45^\circ$  Straight line, both input basis and output basis are taken  $\boldsymbol{v}_1=(1,0)$, $\boldsymbol{v}_2=(0,1)$. What you get at this time is not the beautiful matrix, but the one derived when talking about projection earlier. **projection matrix**(projection matrix):



$$
P=\frac{\boldsymbol{a}\boldsymbol{a}^{\mathsf T}}{\boldsymbol{a}^{\mathsf T}\boldsymbol{a}}
=\frac{1}{2}\begin{bmatrix}1&1\\1&1\end{bmatrix},
\qquad
\boldsymbol{a}=\begin{bmatrix}1\\1\end{bmatrix}.
$$



Spot check two columns: Enter  $(1,0)^{\mathsf T}$  get  $\left(\tfrac12,\tfrac12\right)^{\mathsf T}$, indeed  $(1,0)$  Project to  $45^\circ$  the result of a straight line; input  $(0,1)^{\mathsf T}$  also get  $\left(\tfrac12,\tfrac12\right)^{\mathsf T}$. This matrix is ​​no longer diagonal because the standard basis is not an eigenvector. But it is still symmetrical and still satisfies  $P^2=P$: It's another "good-looking matrix", just not as easy to see at a glance as a diagonal matrix.

The same projection, two bases, two matrices. The transformation has not changed, only the coordinates describing it have changed. The weight of this matter lies in: **The matrix is not the transformation itself, but the coordinate record of the transformation under a certain set of bases.**  If you want to see the nature of a transformation, look for its eigenvectors; those are the same set of coordinates that physicists pick when forced to use coordinates. The basis transformation in the next lecture is to write "how does the matrix change when a group of basis is changed" into a formula.

![Video 00:38:33: Classroom blackboard writing](</attachments/mit1806-be89e6e6a8599bc83415138b.jpg>)

*Video 00:38:33 \| Approximately corresponding to Section 6 "6. One projection, two bases".*

## 7. Derivative is also a linear transformation

A final example that leaves geometry but is more illustrative: **Derivative** (differentiation) is a linear transformation.

Let the input space be all of the form  $c_1+c_2x+c_3x^2$  of polynomials whose bases are the three simplest functions  $1,x,x^2$. The output after derivation is  $c_2+2c_3x$, falls by  $1,x$  In the spanned space, the output basis is  $1,x$. So  $T$  put  $3$  dimensional space mapped to  $2$  dimensional space.

Calculate column by column. $T(1)=0$, giving the first column  $(0,0)^{\mathsf T}$; $T(x)=1$, giving the second column  $(1,0)^{\mathsf T}$; $T(x^2)=2x$, giving the third column  $(0,2)^{\mathsf T}$. So



$$
A=\begin{bmatrix}0&1&0\\0&0&2\end{bmatrix},
\qquad
A\begin{bmatrix}c_1\\c_2\\c_3\end{bmatrix}
=\begin{bmatrix}c_2\\2c_3\end{bmatrix}.
$$



one  $2\times3$  The matrix has completely recorded the derivation.

To write down the sentence "derivative is a linear transformation", there are two familiar rules: the derivative of a sum is equal to the sum of the derivatives, $(f+g)'=f'+g'$;The derivative of the numerical multiplication is equal to the numerical multiplication of the derivative, $(cf)'=cf'$. These two requirements are exactly the two requirements for linear transformation, except that the vector is replaced by a function. Because of this, transformations in function space can also be loaded into matrix multiplication, and the previous "base-coordinate-matrix" language is equally applicable to polynomials.

The fact that derivation is linear means much more than just one example. Because it is linear, it can calculate the derivatives of a few functions -$\sin x$, $\cos x$, $e^x$  Such a short list - you can use linear combinations to calculate the derivatives of all combinations without having to start from scratch every time you encounter a new function. If the derivation is not linear, calculus cannot do it.

At this point, the entire language of this lecture is closed. The inverse of a matrix corresponds to the inverse of a transformation:  $T$  The vector sent out is then sent back, and the matrix should be multiplied by the identity matrix.  $I$. The multiplication of matrices corresponds to the composition of transformations: first do one transformation, then another, and the combined matrix is ​​exactly the product of the two matrices. Matrix multiplication is not an operation specified out of thin air. It grows out of the composition of linear transformations.

![Video 00:44:30: Classroom blackboard writing](</attachments/mit1806-f7997892e2649a6ec4662967.jpg>)

*Video 00:44:30 \| Approximately corresponding to Section 7 "7. Derivatives are also linear transformations".*

![Official Handout Summary Page 4/4](</attachments/mit1806-22e8c8561328a603bee0dfe2.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 30 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **linear transformation** is a mapping that preserves addition and multiplication: $T(\boldsymbol{v}+\boldsymbol{w})=T(\boldsymbol{v})+T(\boldsymbol{w})$, $T(c\boldsymbol{v})=cT(\boldsymbol{v})$; the two together are  $T$  Map linear combinations into linear combinations.
- The zero vector must map to zero: given by  $T(\boldsymbol{0})=3T(\boldsymbol{0})$  Got  $T(\boldsymbol{0})=\boldsymbol{0}$, which is the criterion for denying a fastest transformation.
- Counterexample: translation  $T(\boldsymbol{v})=\boldsymbol{v}+\boldsymbol{v}_0$  Break two rules ($T(\boldsymbol{0})=\boldsymbol{v}_0\neq\boldsymbol{0}$); take the length  $T(\boldsymbol{v})=\|\boldsymbol{v}\|$  Through the test of zero vector and positive multiple, but in  $c<0$  failed.
- Projection and rotation are linear transformations that can be described without coordinates; by applying the transformation to the entire house, you can see clearly what it does to the entire space at once.
- Each matrix passes  $T(\boldsymbol{v})=A\boldsymbol{v}$  gives a linear transformation, $m\times n$  Matrix correspondence  $\mathbb{R}^n\to\mathbb{R}^m$; $A=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$  Turn the plane upside down and the house is upside down.
- know  $T$  in a group **base** As shown above, you know the entire transformation: $\boldsymbol{v}=\sum c_j\boldsymbol{v}_j$  force  $T(\boldsymbol{v})=\sum c_jT(\boldsymbol{v}_j)$.
- Rules for constructing matrices: Selecting the input basis  $\boldsymbol{v}_1,\ldots,\boldsymbol{v}_n$  with output basis  $\boldsymbol{w}_1,\ldots,\boldsymbol{w}_m$, put  $T(\boldsymbol{v}_j)=\sum_i a_{ij}\boldsymbol{w}_i$  The coefficients of  $j$  column; so  $A\cdot(\text{输入坐标})=(\text{输出坐标})$.
- The same projection: using the eigenvector basis (along the straight line and perpendicular to the straight line), we get  $\begin{bmatrix}1&0\\0&0\end{bmatrix}$, the diagonal element is the eigenvalue  $1,0$;Project to using standard basis  $45^\circ$  Straight line  $P=\frac12\begin{bmatrix}1&1\\1&1\end{bmatrix}$, symmetrical and  $P^2=P$, but no longer diagonal.
- The derivative is a linear transformation: $c_1+c_2x+c_3x^2\mapsto c_2+2c_3x$  Correspondence matrix  $\begin{bmatrix}0&1&0\\0&0&2\end{bmatrix}$.
- The inverse of a matrix corresponds to the inverse of a transformation, and the product of a matrix corresponds to the composition of a transformation; matrix multiplication is generated from a linear transformation, not the other way around.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| linear transformation | linear transformation | Maintain mapping of vector addition and multiplication  $T$ |
| transformation / mapping | Transform/Map | Rules for assigning each input vector to an output vector |
| projection | projection | Press each vector vertically to a point on a straight line |
| rotation | rotate | Rotate each vector through a fixed angle around the origin |
| basis | base | A set of vectors spanned into a space and linearly independent, used to generate coordinates |
| coordinates | coordinates | Vectors are written as coefficients when combining basis vectors |
| standard basis | Standard base | The default basis consisting of unit coordinate vectors, the coordinates being the components |
| linear combination | linear combination | Several vectors are each multiplied by a coefficient and then added |
| linearly independent | linearly independent | There are no non-trivial combinations of zeros, every vector brings a new direction |
| span | Zhang Cheng | The set of all linear combinations of a set of vectors |
| eigenvalue | eigenvalue | The factor by which the eigenvector is scaled after being transformed; the projected eigenvalue is  $1$  with  $0$ |
| eigenvector | eigenvector | A vector whose direction remains unchanged (or reversed) after transformation |
| projection matrix | projection matrix | matrix projected onto a standard basis  $P=\boldsymbol{a}\boldsymbol{a}^{\mathsf T}/(\boldsymbol{a}^{\mathsf T}\boldsymbol{a})$, satisfy  $P^2=P$ |
| differentiation | Derivative | Mapping polynomials into linear transformations of derivative functions |
| inverse matrix | inverse matrix | Represents the matrix of the inverse transformation, multiplied by the original matrix to obtain  $I$ |
| identity matrix | identity matrix | A matrix representing an identity transformation, with all diagonal elements being  $1$ |

---

[← Lecture 29](/en/notes/mit-1806/lec29) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 31 →](/en/notes/mit-1806/lec31)
