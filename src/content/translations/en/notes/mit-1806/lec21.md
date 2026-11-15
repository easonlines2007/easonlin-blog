---
kind: notes
source: mit-1806/lec21
title: Lecture 21 · Eigenvalues and Eigenvectors
description: Understand eigenvalues and eigenvectors, and master the method of
  finding characteristic polynomials.
sourceHash: e972d13c530ee034c7d797160e2265fd22a079576e9b25d9b07506b82ad41080
publish: true
translationMethod: machine-assisted
---

> *Eigenvalues and eigenvectors* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 21 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p21 · Eigenvalues and eigenvectors](https://www.bilibili.com/video/BV1ix411f7Yp?p=21)(51:23)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-21-eigenvalues-and-eigenvectors/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=21&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

This lecture kicks off the third part of the course. In the twenty lectures in the first two parts, the matrix was always a given object: we asked  $A\boldsymbol{x}=\boldsymbol{b}$  Is there any solution? Ask  $A$  What are the four basic subspaces of , ask  $\det A$  equal to how much. From this point on, the problem changes direction: given a square matrix  $A$, what "inherent" structure does it have? Specifically, is there some special direction that makes  $A$  When a vector acts in these directions, it only changes the length but not the direction? Such a vector is called **eigenvector** (eigenvector), the multiple of expansion and contraction is called **eigenvalue** (eigenvalue). They are only made of  $A$  determines itself, with any right-hand vector  $\boldsymbol{b}$  has nothing to do and therefore describes the matrix in more depth than "solving a system of equations".

This lecture will answer two questions: what exactly are eigenvalues and eigenvectors; and how can they be calculated. The second problem is more difficult because the equation  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  There are two unknown quantities in , and  $\lambda$  with  $\boldsymbol{x}$  They are multiplied together, and elimination can't do anything about it. The turning point is to shift the equation into  $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$: To make it non-zero  $\boldsymbol{x}$  existence, matrix  $A-\lambda I$  It has to be bizarre. So the determinant was really used for the first time - it was no longer used to solve a certain system of equations, but to translate the qualitative requirement of "there is a non-zero solution" into an equation that only contains  $\lambda$  equation. The route to find the eigenvalues is therefore: first  $\det(A-\lambda I)=0$  Find all  $\lambda$, and then for each  $\lambda$  Ask for  $A-\lambda I$  The null space of , get the eigenvector.

The examples in this lecture have been carefully selected: projection matrix, permutation matrix, symmetry matrix, rotation matrix, and upper triangular matrix. They respectively show the possible good cases - the eigenvalues ​​are real numbers, the eigenvectors are orthogonal in pairs - and the bad cases - the eigenvalues ​​run out of the real number range and become complex numbers, or even the eigenvectors are not enough. These examples are not embellishments. Finding the eigenvalues of a general matrix is essentially solving a  $n$  For a quadratic equation, it is difficult to formulate a formula once the order is high; the only thing that can really read the eigenvalues at a glance is a structured matrix.

![Official Handout Summary Page 1/3](</attachments/mit1806-b87f1dc43b82263822e94656.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 21 Summary, CC BY-NC-SA 4.0).*

## 1. Matrix image function: definition of eigenvectors and eigenvalues

The effect of matrices on vectors can be compared to functions in calculus. Function number  $x$  become  $f(x)$, the matrix turns the vector  $\boldsymbol{x}$  become  $A\boldsymbol{x}$: Inputs a vector and outputs a vector, but the dimension of the space is higher. Based on this analogy, a question can be asked about the output direction.

Most vectors will be  $A$  Turn an angle: $A\boldsymbol{x}$  points to a  $\boldsymbol{x}$  different directions. But there are some special vectors, $A\boldsymbol{x}$  Exactly with  $\boldsymbol{x}$  Parallel. Such a vector is called  $A$  eigenvector. Write "parallel" as an equation:



$$
A\boldsymbol{x}=\lambda\boldsymbol{x}.
$$



The multiple on the right  $\lambda$  That’s it **eigenvalue**. The "same direction" here allows "opposite direction": $\lambda$  It can be a positive number, a negative number, or zero. $A$  Map this type of vector onto its own straight line, $\lambda>1$  time stretched, $0<\lambda<1$  time shortened, $\lambda<0$  Turn to the opposite direction.

$\lambda=0$  The situation deserves a separate look. If a non-zero vector satisfies  $A\boldsymbol{x}=0\cdot\boldsymbol{x}=\boldsymbol{0}$, then  $\boldsymbol{x}$  Right there  $A$  of **null space** (nullspace). To put it another way: if  $A$  Strange, there is a non-zero vector that is mapped into a zero vector, so  $0$  is an eigenvalue; conversely, $A$  When it is reversible, the null space only has zero vectors, $0$  It's not an eigenvalue. So "$0$  is the eigenvalue" and "$A$  Bizarre” is the same thing. But as far as the topic of eigenvalues is concerned, $0$  There is no special treatment, it is just one of all possible values.

One more thing needs to be made clear: the eigenvector is not a vector, but a whole straight line. If  $\boldsymbol{x}$  is a eigenvector, then any non-zero multiple  $c\boldsymbol{x}$  is also an eigenvector, and the eigenvalues remain unchanged, because



$$
A(c\boldsymbol{x})=cA\boldsymbol{x}=c\lambda\boldsymbol{x}=\lambda(c\boldsymbol{x}).
$$



So strictly speaking "$A$  The statement "eigenvector" is not accurate. What we really want is just a representative vector on the straight line, or a set of basis of this one-dimensional subspace.

![Video 00:05:08: Classroom blackboard writing](</attachments/mit1806-22640e84ce4e32b6a7dfe522.jpg>)

*Video 00:05:08 \| Approximately corresponding to Section 1 "1. Matrix Image Function: Definition of Eigenvectors and Eigenvalues".*

## 2. First look at two matrices that can "see" the answer

Before establishing the general algorithm, first implement the concept with two matrices whose geometric effects are known: **projection matrix** (projection matrix) and **permutation matrix**(permutation matrix).

**Projection matrix.**  Set  $P$  Project space onto a plane passing through the origin. The question is: Which vectors are still in the same direction as before after projection?

general vector  $\boldsymbol{b}$  No. put  $\boldsymbol{b}$  Projected onto a plane  $P\boldsymbol{b}$  falls in the plane, and  $\boldsymbol{b}$  itself is generally not in the plane, and the two directions are different, so  $\boldsymbol{b}$  is not an eigenvector.

Vectors in the plane satisfy this requirement. If  $\boldsymbol{x}$  already in the plane, the projection does nothing, $P\boldsymbol{x}=\boldsymbol{x}$, that is  $\lambda=1$. Every non-zero vector in the plane is an eigenvector, which gives a whole family of eigenvectors, not just one.

Vectors perpendicular to the plane also satisfy. If  $\boldsymbol{x}$  Perpendicular to the plane, its projection is the zero vector, $P\boldsymbol{x}=\boldsymbol{0}=0\cdot\boldsymbol{x}$, that is  $\lambda=0$;These vectors are exactly  $P$  of null space.

So the eigenvalues of the projection matrix are only  $1$  and  $0$. In the three-dimensional case, two linearly independent eigenvectors can be taken in the plane, plus the one perpendicular to the plane, to make a total of three linearly independent eigenvectors. This conclusion does not use the formula of the projection matrix at all.  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$, just looking at the geometric image is enough.

**permutation matrix.**  Look again



$$
A=\begin{bmatrix}0&1\\1&0\end{bmatrix}.
$$



It swaps two components of a vector: $A(x_1,x_2)=(x_2,x_1)$. What kind of vector is still a multiple of itself after swapping?

$\boldsymbol{x}=(1,1)$  Yes, because after the exchange it is still  $(1,1)$, so  $\lambda=1$.$2\times 2$  The matrix should have two eigenvalues, the other one is  $-1$, the corresponding vector is  $(-1,1)$: Exchange the two components to get  $(1,-1)$, which is exactly the opposite of the original vector,



$$
A\begin{bmatrix}-1\\1\end{bmatrix}=\begin{bmatrix}1\\-1\end{bmatrix}=-\begin{bmatrix}-1\\1\end{bmatrix}.
$$



Here is a phenomenon worth paying attention to: $A$  All four elements of are non-negative, but it has a negative eigenvalue.

Once two eigenvalues are listed, a general fact can be verified. Yes  $n\times n$  Matrix, the sum of all eigenvalues is equal to the main diagonal  $n$  The sum of elements,



$$
\lambda_1+\lambda_2+\cdots+\lambda_n=a_{11}+a_{22}+\cdots+a_{nn}.
$$



The quantity on the right is called a matrix **trace** (trace). The trace of the permutation matrix is  $0+0=0$, the sum of eigenvalues is  $1+(-1)=0$, consistent. Its use is very practical: in  $2\times 2$  In this case, as long as one eigenvalue is calculated, the other one is immediately subtracted from the trace, and there is no need to solve the equation.

One more observation by the way. The two eigenvectors above  $(1,1)$  with  $(-1,1)$  The inner product of is zero, that is, they are perpendicular to each other. This is not a coincidence, but an inevitable property of symmetric matrices: $A$  Symmetrical about the main diagonal, its eigenvectors are orthogonal to each other. This point will be fully explained in the lecture on symmetric matrices, but remember the phenomenon here.

![Video 00:12:19: Classroom blackboard writing](</attachments/mit1806-414ffafefff2721be2b43324.jpg>)

*Video 00:12:19 \| Approximately corresponding to section 2 "2. First look at two matrices that can "see" the answer".*

![Video 00:15:25: Classroom blackboard writing](</attachments/mit1806-540f80bc0186aedbed4d100b.jpg>)

*Video 00:15:25 \| Approximately corresponding to Section 2 "2. First look at two matrices that can "see" the answer".*

## 3. Characteristic equation: put  $\lambda$  Solve it first

Now faced with the general problem: how to ask for  $A$  eigenvalues and eigenvectors? Look directly  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  You will find that there is nowhere to start, because there are two unknown quantities ($\lambda$  and  $\boldsymbol{x}$), and they are multiplied. No elimination can handle this structure. The way is to  $\lambda\boldsymbol{x}$  Move to the left.

$\lambda\boldsymbol{x}$  can be written as  $\lambda I\boldsymbol{x}$, among which  $I$  is the identity matrix, so that the two terms can be combined into one matrix multiplication:



$$
A\boldsymbol{x}-\lambda I\boldsymbol{x}=\boldsymbol{0},\qquad (A-\lambda I)\boldsymbol{x}=\boldsymbol{0}.
$$



This step puts "$A$  Act on  $\boldsymbol{x}$  equal to  $\lambda\boldsymbol{x}$” is rewritten as “a certain matrix acts on  $\boldsymbol{x}$  equals zero", which is the problem of finding the null space. A zero vector always satisfies it, but a zero vector is not an eigenvector and is meaningless; what we want is a non-zero solution.

Then the key conditions appear: $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$  has a non-zero solution if and only if  $A-\lambda I$  Bizarre. The matrix singularity is equivalent to the determinant being zero, so



$$
\det(A-\lambda I)=0.
$$



This equation is called **characteristic equation** (characteristic equation). Its value lies in: $\boldsymbol{x}$  has been eliminated, leaving only a  $\lambda$  equation.

The exact shape depends on the order. $A-\lambda I$  Yes  $A$  subtract from each of the main diagonals of  $\lambda$  The resulting matrix; expand its determinant to get a  $\lambda$  The polynomial is called **characteristic polynomial** (characteristic polynomial). Yes  $n\times n$  matrix, the degree of this polynomial is  $n$, therefore  $n\times n$  The matrix has  $n$  Eigenvalues (multiple roots are counted according to their multiplicity). When the order is high, it becomes difficult to solve this equation: $n=3$  To solve a cubic equation, $n=4$  To solve the quartic equation, there is no easy way as you go up. This is why we will specifically study matrices with special structures later.

The process of finding eigenvalues is therefore divided into two steps, and the order cannot be reversed:

1. solution  $\det(A-\lambda I)=0$, find out  $n$  characteristic value;
2. for each eigenvalue  $\lambda$, ask for  $A-\lambda I$  The null space of , takes a set of basis as the corresponding feature vector.

The second step is getting familiar with the job. At this time  $A-\lambda I$  Singularity has been guaranteed. To find the null space, you only need to eliminate the elements, find the main variable and the free variable, and then give the free variable a value; usually there is only one free variable, so take  $1$  The required feature vector is obtained. Precisely because the null space is generally a straight line, Section 1 said that the "eigenvector" is actually a whole straight line, and all we want is a vector above it.

I also need to explain one trouble in advance: $n\times n$  The matrix does exist  $n$  eigenvalues, but they may be repeated. Duplicate eigenvalues ​​are the source of much trouble in this course, and Section 7 will see how this can lead to an insufficient number of eigenvectors.

![Video 00:19:31: Classroom blackboard writing](</attachments/mit1806-ad0ef74d0a201f870708050a.jpg>)

*Video 00:19:31｜Approximately corresponding to Section 3 "3. Characteristic Equation: Put  $\lambda$  Solve it first" nearby.*

![Official Handout Summary Page 2/3](</attachments/mit1806-e6fcc09dbdc17a4b1aa2dee7.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 21 Summary, CC BY-NC-SA 4.0).*

![Video 00:26:44: Classroom blackboard writing](</attachments/mit1806-cc001fae8cbe7fa24bed668a.jpg>)

*Video 00:26:44｜Approximately corresponding to Section 3 "3. Characteristic Equation: Put  $\lambda$  Solve it first" nearby.*

## 4. Example: a  $2\times 2$  Symmetric matrix

Use a specific matrix to complete the above process. take



$$
A=\begin{bmatrix}3&1\\1&3\end{bmatrix}.
$$



It is a symmetric matrix, the two numbers on the diagonal are the same. First calculate the characteristic polynomial:



$$
\det(A-\lambda I)=\begin{vmatrix}3-\lambda&1\\1&3-\lambda\end{vmatrix}=(3-\lambda)^2-1=\lambda^2-6\lambda+8.
$$



Let it equal zero, and we get the quadratic equation  $\lambda^2-6\lambda+8=0$. Note the two coefficients: the opposite of the linear term coefficient is  $6$, while  $A$  The trace is  $3+3=6$;The constant term is  $8$, while  $\det A=3\cdot 3-1\cdot 1=8$. to any  $2\times 2$  Matrices have this rule:



$$
\lambda^2-(\operatorname{tr}A)\lambda+\det A=0,
$$



That is, the coefficient of the linear term is the opposite of the trace, and the constant term is the determinant. This also gives a second shortcut: $\lambda_1\lambda_2=\det A$.

This quadratic expression can be factored: $\lambda^2-6\lambda+8=(\lambda-4)(\lambda-2)$. So



$$
\lambda_1=4,\qquad \lambda_2=2.
$$



Check calculation: $4+2=6$  equal to trace, $4\times 2=8$  equal to the determinant.

Then find the eigenvectors one by one.

Yes  $\lambda_1=4$, make  $A-4I$:



$$
A-4I=\begin{bmatrix}-1&1\\1&-1\end{bmatrix}.
$$



It actually contains only one independent equation  $-x_1+x_2=0$, that is  $x_1=x_2$. The null space is  $(1,1)$  straight line, so



$$
\boldsymbol{x}_1=\begin{bmatrix}1\\1\end{bmatrix}.
$$



Substitute inspection: $A\boldsymbol{x}_1=(3+1,\ 1+3)=(4,4)=4\boldsymbol{x}_1$, correct.

Yes  $\lambda_2=2$, make  $A-2I$:



$$
A-2I=\begin{bmatrix}1&1\\1&1\end{bmatrix}.
$$



The equation is  $x_1+x_2=0$, the null space is given by  $(-1,1)$  Zhang Cheng, so



$$
\boldsymbol{x}_2=\begin{bmatrix}-1\\1\end{bmatrix}.
$$



Inspection: $A\boldsymbol{x}_2=\bigl(3(-1)+1,\ -1+3\bigr)=(-2,2)=2\boldsymbol{x}_2$, correct. Note  $(-1,1)$  with  $(1,1)$  The inner product of  $-1+1=0$, the two eigenvectors are still perpendicular. This symmetric matrix is ​​exactly parallel to the permutation matrix from the previous section: real eigenvalues, orthogonal eigenvectors.

## 5. Translation matrix: Add  $3I$  what happened after

There is a simple relationship between the matrix of section 4 and the permutation matrix of section 2:



$$
\begin{bmatrix}3&1\\1&3\end{bmatrix}=\begin{bmatrix}0&1\\1&0\end{bmatrix}+3I.
$$



Now that we know that the eigenvalues of the permutation matrix are  $1$  and  $-1$, the eigenvector is  $(1,1)$  and  $(-1,1)$, what will happen to the eigenvalues and eigenvectors of the new matrix?

Add each eigenvalue  $3$: $1+3=4$, $-1+3=2$, exactly the result calculated in Section 4. The eigenvectors are completely unchanged: $(1,1)$  and  $(-1,1)$  Still a eigenvector. The reason can be written in one line. If  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, then



$$
(A+3I)\boldsymbol{x}=A\boldsymbol{x}+3I\boldsymbol{x}=\lambda\boldsymbol{x}+3\boldsymbol{x}=(\lambda+3)\boldsymbol{x}.
$$



same one  $\boldsymbol{x}$, there are too many eigenvalues  $3$. In general, add to the matrix  $cI$, all eigenvalues are shifted  $c$, the eigenvector does not move at all.

The reason why this happened is because  $3I$  Acting on any vector simply multiplies it by  $3$, does not change direction. If replaced by a general matrix  $B$, the conclusion immediately becomes invalid. The following erroneous reasoning is worth seeing clearly:

> Set  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, and suppose  $B$  Has eigenvalues  $\alpha$. So  $A\boldsymbol{x}+B\boldsymbol{x}=(\lambda+\alpha)\boldsymbol{x}$, so  $A+B$  The characteristic value of is  $\lambda+\alpha$.

The mistake is in the second sentence: Why do you say that?  $B\boldsymbol{x}=\alpha\boldsymbol{x}$?$B$  The eigenvector of is  $\boldsymbol{x}$  There's no reason for this -$B$  is another matrix, usually with another set of eigenvectors  $\boldsymbol{y}$.$\boldsymbol{x}$  No  $B$  eigenvector, $B\boldsymbol{x}$  with  $\boldsymbol{x}$  Different directions, $A\boldsymbol{x}+B\boldsymbol{x}$  That's not it  $\boldsymbol{x}$  Multiples of , this argument cannot be pushed forward even one step.

The conclusion is: generally  $A+B$  The eigenvalues of are not  $\lambda+\alpha$, $AB$  Neither are the eigenvalues of  $\lambda\alpha$. Eigenvalues have no such linear relationship with addition and multiplication. The only exception is that one of the matrices is  $cI$. to know  $A+B$  eigenvalues, the characteristic equation can only be solved again.

![Video 00:33:24: Classroom blackboard writing](</attachments/mit1806-caa8ba809878c132ad90523d.jpg>)

*Video 00:33:24｜Approximately corresponding to Section 5 "5. Translation matrix: addition  $3I$  What happened next" nearby.*

## 6. Rotation matrix: eigenvalues may be complex numbers

The next example will break the impression that eigenvalues are always real numbers. take  $90^\circ$  The rotation matrix



$$
Q=\begin{bmatrix}0&-1\\1&0\end{bmatrix}.
$$



The general rotation matrix is  $\begin{bmatrix}\cos\theta&-\sin\theta\\ \sin\theta&\cos\theta\end{bmatrix}$, substitute  $\theta=90^\circ$, that is  $\cos 90^\circ=0$, $\sin 90^\circ=1$. It is an orthogonal matrix.

Without writing, use traces and determinants to determine whether there is a real number solution. The trace is  $0+0=0$, so  $\lambda_1+\lambda_2=0$; also  $\det Q=0\cdot 0-(-1)\cdot 1=1$, so  $\lambda_1\lambda_2=1$. Two real numbers must simultaneously satisfy "the sum is  $0$, the product is  $1$": Hewei  $0$  Explain that one of them is positive and the other is negative, and the product can only be a negative number and cannot be equal to  $1$. contradictory, so  $Q$  There are no real eigenvalues.

It also makes sense geometrically: $Q$  Transform every non-zero vector  $90^\circ$, no vector remains in the same direction as itself after rotation.

Calculate it step by step:



$$
\det(Q-\lambda I)=\begin{vmatrix}-\lambda&-1\\1&-\lambda\end{vmatrix}=\lambda^2+1.
$$



Let it be zero, we get



$$
\lambda^2+1=0,\qquad \lambda=\mathrm{i},\ \lambda=-\mathrm{i}.
$$



A matrix composed entirely of real numbers, but the eigenvalues are complex numbers. Moreover, these two numbers are mutually **complex conjugate** (complex conjugate), that is, the sign of the imaginary part is opposite. As long as the matrix elements are all real numbers, the characteristic polynomial is a real coefficient polynomial, and its complex roots must appear in conjugate pairs.

Comparing several matrices that have been calculated, you will see a clear spectral line. permutation matrix  $\begin{bmatrix}0&1\\1&0\end{bmatrix}$  The characteristic value of is  $1$  and  $-1$, matrix  $\begin{bmatrix}3&1\\1&3\end{bmatrix}$  The characteristic value of is  $4$  and  $2$, both are symmetric matrices and the eigenvalues are real numbers. And  $Q$  satisfy  $Q^{\mathsf T}=-Q$, turn the matrix over the main diagonal and see that all elements change signs. It is antisymmetric about the main diagonal - this is the extreme opposite of symmetry, and what it gets is a pure imaginary eigenvalue. The closer to symmetry, the more "real" the eigenvalues ​​are; the further away from symmetry, the more "imaginary" the eigenvalues ​​are. The general matrix sandwiched in the middle can be regarded as having a symmetric part and an antisymmetric part. Its eigenvalues ​​may be all real numbers or may appear in conjugate pairs, depending on the matrix itself.

![Video 00:40:22: Classroom blackboard writing](</attachments/mit1806-748ef4958832b8c662937b6a.jpg>)

*Video 00:40:22 \| Approximately corresponding to Section 6 "6. Rotation matrix: eigenvalues may be complex numbers".*

## 7. Shortage of repeated eigenvalues and eigenvectors

This last example takes the trouble to an even deeper level. Change an element of the matrix in section 4:



$$
A=\begin{bmatrix}3&1\\0&3\end{bmatrix}.
$$



It is an upper triangular matrix, with two on the diagonal  $3$. The determinant of a triangular matrix is the product of the diagonal elements, so



$$
\det(A-\lambda I)=\begin{vmatrix}3-\lambda&1\\0&3-\lambda\end{vmatrix}=(3-\lambda)^2.
$$



Equation  $(3-\lambda)^2=0$  given



$$
\lambda_1=3,\qquad \lambda_2=3,
$$



Eigenvalues are duplicated: both  $3$. The benefits of triangular matrices can also be seen here: the eigenvalues ​​are placed on the main diagonal, which is readable at a glance, and the characteristic polynomial is also the easiest to calculate. The trouble is with the eigenvectors.

Yes  $\lambda=3$, make  $A-3I$:



$$
A-3I=\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



It has only one non-zero equation  $x_2=0$, $x_1$  is a free variable, and the null space is  $(1,0)$  A straight line. This gives an eigenvector



$$
\boldsymbol{x}_1=\begin{bmatrix}1\\0\end{bmatrix}.
$$



Now I want to give the second eigenvalue  $3$  Equipped with the second eigenvector. But  $\lambda$  Still  $3$, $A-3I$  It's still the same matrix, and the null space is still the same straight line. No matter how you take the value, all you can get is  $(1,0)$  A multiple of , no vector linearly independent of it can be found. So this  $2\times 2$  The matrix has only one independent eigenvector, not two.

This is the trouble with duplicate eigenvalues: duplicate roots open up the possibility of "eigenvector shortages". $2\times 2$  The matrix should have two linearly independent eigenvectors, but this matrix has only one. Its eigenvectors cannot cover the entire plane, so they cannot completely describe it.  $A$  behavior. The next lecture will deal with these situations together and give a complete explanation.

![Official Handout Summary Page 3/3](</attachments/mit1806-ceb87cd413fea7671143007d.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 21 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **eigenvector** (eigenvector) is satisfied  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  non-zero vector of: $A$  Acting on it does not change the direction, it only expands, contracts or reverses; **eigenvalue** (eigenvalue) is the scaling factor  $\lambda$, which can be negative, zero, or complex. The eigenvector is a straight line, $c\boldsymbol{x}$  with  $\boldsymbol{x}$  have the same eigenvalues.
- $\lambda=0$  if and only if  $A$  Singularity: At this time, the eigenvector is a non-zero vector in the null space. "$0$  is the eigenvalue" and "$A$  Irreversible” is the same thing.
- The eigenvalues of the projection matrix are  $1$  and  $0$: The vector in the plane satisfies  $P\boldsymbol{x}=\boldsymbol{x}$, the vector perpendicular to the plane satisfies  $P\boldsymbol{x}=\boldsymbol{0}$; In the three-dimensional case, a total of three linearly independent eigenvectors can be obtained.
- permutation matrix  $\begin{bmatrix}0&1\\1&0\end{bmatrix}$  The characteristic value of is  $1$  with  $-1$, the feature vector is  $(1,1)$  with  $(-1,1)$, the two are orthogonal (because  $A$  symmetrical).
- $n\times n$  matrix  $n$  The sum of the eigenvalues is equal to **trace**(trace)$\sum a_{ii}$; in  $2\times 2$  The situation is given in this step  $\lambda^2-(\operatorname{tr}A)\lambda+\det A=0$, as long as one eigenvalue is known, the other can be read directly from the trace.
- The route to find the eigenvalues: put  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  rewritten as  $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$, order  $\det(A-\lambda I)=0$(**characteristic equation**) first solve  $\lambda$, and then for each  $\lambda$  Ask for  $A-\lambda I$  The eigenvector is obtained in the null space.
- Example: $\begin{bmatrix}3&1\\1&3\end{bmatrix}$  The characteristic polynomial of is  $\lambda^2-6\lambda+8=(\lambda-4)(\lambda-2)$, characteristic value  $4$  with  $2$, feature vector  $(1,1)$  with  $(-1,1)$.
- $A+3I$  with  $A$  have the same eigenvectors, all eigenvalues are added  $3$: Permutation matrix  $\{1,-1\}$  become  $\{4,2\}$. But generally  $A+B$  The eigenvalue of is not the sum of the eigenvalues of the two, $AB$  It's not accumulation either.
- $90^\circ$  rotation matrix  $\begin{bmatrix}0&-1\\1&0\end{bmatrix}$  satisfy  $Q^{\mathsf T}=-Q$, the characteristic value is  $\mathrm{i}$  with  $-\mathrm{i}$;Real matrices can have complex eigenvalues, and conjugates appear in pairs.
- upper triangular matrix  $\begin{bmatrix}3&1\\0&3\end{bmatrix}$  The eigenvalue of is the diagonal element  $3,3$, but there is only one linearly independent eigenvector  $(1,0)$- Duplicate eigenvalues can lead to a shortage of eigenvectors.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| eigenvector | eigenvector | satisfy  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  a non-zero vector, $A$  The direction remains unchanged after the action |
| eigenvalue | eigenvalue | The eigenvector is in  $A$  Stretching factor under action  $\lambda$ |
| characteristic equation | characteristic equation | $\det(A-\lambda I)=0$, used to first find all eigenvalues |
| characteristic polynomial | characteristic polynomial | $\det(A-\lambda I)$  expanded  $\lambda$  The polynomial of , the degree is  $n$ |
| trace | trace | The sum of the principal diagonal elements is equal to the sum of all eigenvalues |
| projection matrix | projection matrix | A matrix that projects a vector onto a subspace, with eigenvalues  $1$  with  $0$ |
| permutation matrix | permutation matrix | a matrix exchanging the coordinate components of a vector, $2\times 2$  The eigenvalues of the commutation matrix are  $1$  with  $-1$ |
| singular matrix | singular matrix | A matrix with zero determinant and non-zero vectors in the null space is equivalent to  $0$  is its characteristic value |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  A collection of vectors; $\lambda$  The corresponding feature vector is  $A-\lambda I$  in the null space |
| rotation matrix | rotation matrix | A matrix that rotates each vector by a fixed angle, $90^\circ$  The characteristic value of rotation is  $\pm\mathrm{i}$ |
| orthogonal matrix | orthogonal matrix | The rotation matrix is its most important example, $90^\circ$  The rotation matrix falls into this category |
| anti-symmetric matrix | antisymmetric matrix | satisfy  $Q^{\mathsf T}=-Q$  The matrix of $90^\circ$  The rotation matrix is a typical example, and the eigenvalues are purely imaginary numbers. |
| complex conjugate | complex conjugate | The complex number obtained by changing the sign of the imaginary part; the complex eigenvalues of the real matrix always appear in conjugate pairs |
| repeated eigenvalue | Duplicate eigenvalues | Multiple roots of characteristic polynomials, which may result in an insufficient number of linearly independent eigenvectors |
| linearly independent | linearly independent | The vector group of zero vectors cannot be obtained by non-trivial linear combination |

---

[← Lecture 20](/en/notes/mit-1806/lec20) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 22 →](/en/notes/mit-1806/lec22)
