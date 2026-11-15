---
kind: notes
source: mit-1806/lec22
title: Lecture 22 · Diagonalization and powers of matrices
description: Use diagonalization to calculate the power of a matrix and
  understand the conditions for diagonalization.
sourceHash: a53fd5da9d1e8749fa73e17dbd3fea7a2601f437fc9c6eb137630ebce259c1b0
publish: true
translationMethod: machine-assisted
---

> *Diagonalization and powers of A* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 22 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p22 · Diagonalization and matrix powers](https://www.bilibili.com/video/BV1ix411f7Yp?p=22)(51:51)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-22-diagonalization-and-powers-of-a/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=22&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The key equation reached in the previous lecture is  $A\boldsymbol{x}=\lambda\boldsymbol{x}$: $\boldsymbol{x}$  is **eigenvector**(eigenvector), $\lambda$  is **eigenvalue** (eigenvalue). The equation itself is just a definition, it does not explain the use of these two things. This lecture answers exactly this question, and the answer is **diagonalization** (diagonalization): put  $A$  written as



$$
A=S\Lambda S^{-1},
$$



Among them  $S$  The columns are  $n$  linearly independent feature vectors, $\Lambda$  It's arranged diagonally  $n$  diagonal matrix of eigenvalues. This decomposition changes the coordinate system of the observation problem. In the direction of the eigenvector span, $A$  Its function is to extend or compress each direction separately.  $\lambda_i$  times, without interfering with each other in all directions; $S$  Responsible for translating back and forth between the original coordinates and this set of feature directions.

The most direct use of diagonalization is to calculate the power of a matrix. $A^2$  The characteristic value of is  $\lambda_i^2$, the eigenvector remains unchanged, so  $A^k=S\Lambda^kS^{-1}$. Calculate  $A$  100th power does not need to do a hundred matrix multiplications, just put on the diagonal  $n$  Take each number to the power of one hundred. This matter was obtained through elimination  $LU$  Decomposition is completely impossible: $A^{100}=(LU)^{100}$  It's a hundred  $L,U$  The formulas are strung together alternately, and there is nothing in the middle that can be eliminated. Precisely because powers become cheap, eigenvalues become the quantities that determine the long-term behavior of a matrix—the absolute value of all eigenvalues is less than  $1$, $A^k$  It tends to zero.

I will use this set of tools in the second half of the chapter **difference equation**(difference equation)$\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  on. Given initial vector  $\boldsymbol{u}_0$, the formal solution is  $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$;The way to really calculate it is to  $\boldsymbol{u}_0$  Split into linear combinations of eigenvectors, let each part according to its own  $\lambda_i^k$  evolution. The Fibonacci sequence is a model of this idea: after a second-order recurrence is rewritten as a two-dimensional first-order system, the growth rate of the general term is immediately given by the largest eigenvalue. This is also the overall comparison between this lecture and the previous lecture——$A\boldsymbol{x}=\boldsymbol{b}$  It is a static problem, but what we deal with here is a dynamic problem that evolves step by step over time.

![Official Handout Summary Page 1/3](</attachments/mit1806-8f18ab4fa742cddd0c3fe992.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 22 Summary, CC BY-NC-SA 4.0).*

## 1. Diagonalization: $A=S\Lambda S^{-1}$

Set  $A$  is  $n\times n$  matrix, and it has  $n$  linearly independent eigenvectors  $\boldsymbol{x}_1,\boldsymbol{x}_2,\dots,\boldsymbol{x}_n$, respectively corresponding to the eigenvalues  $\lambda_1,\lambda_2,\dots,\lambda_n$. put this  $n$  vectors arranged column by column into a matrix



$$
S=\begin{bmatrix}\boldsymbol{x}_1&\boldsymbol{x}_2&\cdots&\boldsymbol{x}_n\end{bmatrix},
$$



called **Eigenvector matrix** (eigenvector matrix); then arrange the eigenvalues diagonally



$$
\Lambda=\begin{bmatrix}
\lambda_1&0&\cdots&0\\
0&\lambda_2&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lambda_n
\end{bmatrix}.
$$



Use capital letters  $\Lambda$  instead of  $\lambda$, is a reminder that the matrix is installed here, and the eigenvalues are installed on the diagonal.

The whole derivation only needs to do one thing: use  $A$  Go take a ride  $S$. Matrix multiplication can be looked at column by column, whereas  $S$  of the  $i$  columns happen to be eigenvectors, so



$$
AS=A\begin{bmatrix}\boldsymbol{x}_1&\cdots&\boldsymbol{x}_n\end{bmatrix}
=\begin{bmatrix}A\boldsymbol{x}_1&\cdots&A\boldsymbol{x}_n\end{bmatrix}
=\begin{bmatrix}\lambda_1\boldsymbol{x}_1&\cdots&\lambda_n\boldsymbol{x}_n\end{bmatrix}.
$$



The second step is just to substitute the definition of the eigenvector. Next we need to count  $\lambda_i$  From the first  $i$ "Peel" it out. The way to peel it out is to use right multiplication: right multiplication with a diagonal matrix  $S$, $S$  of the  $i$  The entire column is multiplied by the third column of the diagonal matrix  $i$  diagonal element. Take two columns as an example and write it out:



$$
\begin{bmatrix}\boldsymbol{x}_1&\boldsymbol{x}_2\end{bmatrix}
\begin{bmatrix}\lambda_1&0\\0&\lambda_2\end{bmatrix}
=\begin{bmatrix}\lambda_1\boldsymbol{x}_1&\lambda_2\boldsymbol{x}_2\end{bmatrix},
$$



The same applies to general situations. So we get the basic formula of this lecture



$$
AS=S\Lambda .
$$



Note  $\lambda_i$  is multiplied from the right, so it falls on  $S$  The right side of  $\Lambda$. This position cannot be remembered incorrectly. The notation is: $A$  What is multiplied is its own eigenvector, $A$  always stick on  $S$  to the left.

Since  $S$  Reversible – that’s exactly what $n$  The whole usefulness of the assumption that the eigenvectors are linearly independent" - just  $AS=S\Lambda$  Take left on both sides  $S^{-1}$, get



$$
S^{-1}AS=\Lambda ,
$$



Or written conversely  $A$  decomposition



$$
A=S\Lambda S^{-1}.
$$



The two expressions say the same thing, but  $S$  and  $S^{-1}$  Which side of the equal sign you are on makes a difference. The first formula reads as “after changing a group of bases, $A$  Becomes a diagonal matrix"; the second formula is read as "$A$  Made up of three pieces.” The latter is what it is with  $A=LU$, $A=QR$  Parallel identity: Those two decompositions, from elimination and Gram-Schmidt, are lower trigonometric times upper triangular, orthogonal times upper triangular, whereas here it's a matrix times a diagonal matrix times its own inverse. This kind of "sandwiched in the middle" $S$  with  $S^{-1}$"The shape will appear repeatedly when dealing with differential equations later.

It must be emphasized that this decomposition is not unconditionally true. $S$  The columns of are linearly independent, which is equivalent to this  $n$  eigenvectors are independent of each other, which is equivalent to  $S$  Reversible, which is equivalent to being able to write  $S^{-1}$. Once you can't get it together  $n$  With an independent eigenvector, diagonalization is out of the question. Such matrices are a minority, but they do exist, and Section 3 will single them out.

![Video 00:05:11: Classroom blackboard writing](</attachments/mit1806-e6b29d918581931477d15706.jpg>)

*Video 00:05:11｜Approximately corresponding to Section 1 "1. Diagonalization: $A=S\Lambda S^{-1}$"Nearby.*

## 2. Power of matrix: Eigenvalues give the answer directly

Diagonalization immediately answers a natural question: $A^2$  What are the eigenvalues and eigenvectors of ? The answer is so clean that no additional calculations are required.

from  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  Depart, ride together on both sides  $A$:



$$
A^2\boldsymbol{x}=A(\lambda\boldsymbol{x})=\lambda A\boldsymbol{x}=\lambda\cdot\lambda\boldsymbol{x}=\lambda^2\boldsymbol{x}.
$$



The second equal sign number  $\lambda$  As mentioned before, the third equal sign uses definition again. The conclusion is: $A^2$  The characteristic value of is  $\lambda^2$, the feature vector is still the original one  $\boldsymbol{x}$. So once the matrix is squared, the eigenvalues follow the square, and the eigenvectors stay put.

It would be more interesting to watch it again with diagonalization. put  $A=S\Lambda S^{-1}$  Substitute  $A^2$:



$$
A^2=\bigl(S\Lambda S^{-1}\bigr)\bigl(S\Lambda S^{-1}\bigr)
=S\Lambda\bigl(S^{-1}S\bigr)\Lambda S^{-1}
=S\Lambda^2S^{-1}.
$$



middle pair  $S^{-1}S$  It is the identity matrix, which means it does nothing. And  $\Lambda^2$  Still a diagonal matrix, on the diagonal is  $\lambda_1^2,\lambda_2^2,\dots,\lambda_n^2$. This is completely consistent with the conclusion calculated vector by vector above: sandwiched on both sides  $S,S^{-1}$  has not changed, so the feature vector has not changed; the middle becomes  $\Lambda^2$, so the eigenvalues are squared.

The same reasoning can be extended all the way to any power. put  $k$  a  $A=S\Lambda S^{-1}$  Continuous multiplication, internally adjacent  $S^{-1}S$  Two by two cancel each other out, leaving only the leftmost one  $S$, the rightmost  $S^{-1}$, and the middle  $k$  a  $\Lambda$:



$$
A^k=S\Lambda^kS^{-1},\qquad
\Lambda^k=\begin{bmatrix}
\lambda_1^k&0&\cdots&0\\
0&\lambda_2^k&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lambda_n^k
\end{bmatrix}.
$$



This is a shortcut for computing higher powers of a matrix: $A^k$  The characteristic value of is  $\lambda_i^k$, the feature vector remains unchanged. take  $A$  The cubic eigenvalue is the cube of the original eigenvalue; taking it to the hundredth power is the hundredth power. And  $\Lambda^k$  Just  $n$  independent scalar powers, just calculate them one by one.

The weight of this shortcut becomes clear when compared with the incompetence of the elimination route. If only  $A=LU$, then



$$
A^{100}=\underbrace{(LU)(LU)\cdots(LU)}_{100\ \text{个}},
$$



one hundred  $L$  and a hundred  $U$  They are connected end to end, without any eliminateable middle term, and no pattern can be seen. **There is no "power" information at all in the pivot element, but there is in the eigenvalue.**  Eigenvalues provide a previously inaccessible perspective: seeing what a matrix will look like if it is acted upon a hundred times.

From this we can get a theorem about stability. matrix  $A$  is **stable** (stable) if  $k\to\infty$  time  $A^k\to 0$.

> **Theorem.**  in  $A$  On the premise that it can be diagonalized, $A^k\to 0$  if and only if  $A$  All eigenvalues of  $|\lambda_i|<1$.

The idea of proof is to put  $A^k=S\Lambda^kS^{-1}$  Take it apart and see: $S$  with  $S^{-1}$  is a fixed matrix, not random  $k$  changes, only the middle one can make the entire product smaller or even disappear  $\Lambda^k$. And  $\Lambda^k$  is a diagonal matrix that goes to zero if and only if every  $\lambda_i^k$  all tend to zero, that is, each  $|\lambda_i|<1$. The reverse direction is also true: if  $A^k\to 0$, then for each feature vector  $A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i\to 0$, so  $\lambda_i^k\to 0$.

The absolute value cannot be saved. Eigenvalues can be negative numbers or even complex numbers (the eigenvalues of a real matrix may also be complex numbers, as long as the matrix is asymmetric); $|\lambda_i|$  For real numbers, it is the usual absolute value, and for complex numbers, it is the modulo length. If a certain  $\lambda_i=1$, then  $\lambda_i^k$  Constant equal to  $1$, the power will not become smaller; if  $\lambda_i=-1$, then  $\lambda_i^k$  in  $1$  with  $-1$  It swings back and forth. Although it does not diverge, it does not tend to zero. Only when it falls strictly within the unit circle does the power really decay. Also remember the qualification at the beginning of the theorem: the entire argument rests on  $S$  On the basis of existence, there is no  $n$  independent eigenvectors, this route of "eigenvalues determining power" will not work.

![Video 00:13:20: Classroom blackboard writing](</attachments/mit1806-de7b4aaadaee3d984aa0bf9e.jpg>)

*Video 00:13:20｜Approximately corresponding to Section 2 "2. Power of matrix: eigenvalues directly give the answer".*

![Video 00:19:42: Classroom blackboard writing](</attachments/mit1806-d03c9a6698d03ec8fc38865d.jpg>)

*Video 00:19:42｜Approximately corresponding to Section 2 "2. Power of matrix: eigenvalues directly give the answer".*

## 3. What kind of matrix can be diagonalized?

Since diagonalization is so easy to use, it is necessary to find out which matrices can use it. There are two situations.

**Situation one: $n$  The eigenvalues are different from each other.**  At this time  $A$  There must be  $n$  are linearly independent eigenvectors and therefore must be diagonalizable. This is the most useful criterion: just calculate **characteristic polynomial** (characteristic polynomial) after discovering its  $n$  Since each root is different, there is no need to check the eigenvectors, and the independence property is automatic. Random matrices almost always fall into this situation: in Matlab for a  $10\times 10$  The random matrix execution of  `eig(rand(10))`, the ten returned eigenvalues are usually different from each other. The so-called "different" (distinct) means that the two are not equal; if the ten eigenvalues ​​are different, the ten eigenvectors are automatically independent.

**Scenario 2: There are duplicate eigenvalues.**  At this point the conclusion no longer automatically holds - it may still be diagonalizable, or it may not, and must be checked one by one. So duplicate eigenvalues ​​are not a disaster per se, it's just an inconvenience.

Let’s first look at an example that is still successful: $10\times 10$  of **identity matrix**(identity matrix)$I$. Its characteristic polynomial is  $(1-\lambda)^{10}$, characteristic value  $1$  Repeated ten times. But the identity matrix never lacks eigenvectors - every vector satisfies  $I\boldsymbol{x}=1\cdot\boldsymbol{x}$, any ten linearly independent vectors can serve as  $S$. and  $S^{-1}IS=I$, after diagonalization  $\Lambda$  That’s it  $I$  yourself, this is inherently true: the identity matrix is already **diagonal matrix** (diagonal matrix), the eigenvalues of the diagonal matrix are placed on the diagonal, no need to transform.

Let’s look at another failed example:



$$
A=\begin{bmatrix}2&1\\0&2\end{bmatrix}.
$$



it is a **upper triangular matrix**(upper triangular matrix), **determinant** (determinant) is easy to calculate:



$$
\det(A-\lambda I)=\begin{vmatrix}2-\lambda&1\\0&2-\lambda\end{vmatrix}=(2-\lambda)^2 .
$$



Let the determinant equal  $0$, solve  $\lambda=2$, and it is a double root. So both eigenvalues are  $2$.

The next step is to find the eigenvector, that is, find  $A-2I$  of **null space**(nullspace):



$$
A-2I=\begin{bmatrix}0&1\\0&0\end{bmatrix}.
$$



Equation  $(A-2I)\boldsymbol{x}=\boldsymbol{0}$  Only the second component is required to be equal to  $0$, the first component is completely free, so the null space is  $\begin{bmatrix}1\\0\end{bmatrix}$  A straight line formed by a straight line has only the dimensions  $1$.$\begin{bmatrix}0\\1\end{bmatrix}$  is not among them: it is multiplied to get  $\begin{bmatrix}1\\0\end{bmatrix}$, not a zero vector. This matrix has only one eigenvector direction and cannot be composed of two independent columns.  $S$, so  $A$ **Can't** Diagonalization: whatever you choose  $S$, $S^{-1}AS$  It won't be a diagonal matrix, that way of writing doesn't exist at all.

Two different ways of counting appear here, and it is worth naming them. $\lambda=2$  As the root of the characteristic polynomial appears twice, this degree is called **algebraic multiplicity** (algebraic multiplicity); while  $A-2I$  The dimension of the null space, that is, the number of truly independent feature vectors, is called **geometric multiplicity** (geometric multiplicity). In the triangle example above, the former is  $2$, the latter is  $1$; in  $10\times 10$  In the case of the identity matrix, both  $10$. Whether diagonalization is possible or not remains to be seen.  $\lambda$  Repeated several times, it depends on whether the sum of the null space dimensions of all eigenvalues is enough  $n$.

This example has another meaning: the clause in verse 2 “$|\lambda_i|<1$  then the power tends to zero" theorem, and the entire  $S\Lambda^kS^{-1}$  None of the calculations cover this non-diagonalizable matrix. However, there are only a few such matrices. Most matrices - especially matrices with different eigenvalues ​​- can be diagonalized. This is the scope of this lecture.

![Video 00:25:22: Classroom blackboard writing](</attachments/mit1806-e7cd9ed1d7ce098c7842ba84.jpg>)

*Video 00:25:22 \| Approximately corresponding to Section 3 "3. What kind of matrix can be diagonalized".*

![Official Handout Summary Page 2/3](</attachments/mit1806-b0bbafd51b25472594d68502.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 22 Summary, CC BY-NC-SA 4.0).*

## 4. Difference equation: $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$

Now apply diagonalization to a specific problem. Given initial vector  $\boldsymbol{u}_0$, and stipulate that each step uses the same matrix to multiply the result of the previous step:



$$
\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k,\qquad k=0,1,2,\dots
$$



This is called **first order** (first-order) difference equation: each step only uses the previous step; it is called a system of equations because the unknowns are vectors and the coefficients are matrices. Expand the recursion, $\boldsymbol{u}_1=A\boldsymbol{u}_0$, $\boldsymbol{u}_2=A\boldsymbol{u}_1=A^2\boldsymbol{u}_0$, generally



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0 .
$$



This is the most compact answer, but it doesn't take  $\boldsymbol{u}_k$  Figure it out. To really know what is after a hundred steps, you have to use feature vectors. The next lecture deals with systems of differential equations, where derivatives appear; this lecture deals with differences, which can be seen as the discrete-time counterpart of that theory, which happens to have a much cleaner solution.

The approach is to write the initial vector as a linear combination of feature vectors. Set



$$
\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+\cdots+c_n\boldsymbol{x}_n=S\boldsymbol{c},
$$



Among them  $\boldsymbol{c}=(c_1,\dots,c_n)$  are the component coefficients in each direction. The eigenvector can be taken as a unit vector, which does not affect the conclusion. How to find the coefficient? $S$  The columns of are a set of basis, $\boldsymbol{c}=S^{-1}\boldsymbol{u}_0$.

Use now  $A$  Go take a ride  $\boldsymbol{u}_0$. Because multiplication can be divided into each term:



$$
A\boldsymbol{u}_0=c_1A\boldsymbol{x}_1+\cdots+c_nA\boldsymbol{x}_n
=c_1\lambda_1\boldsymbol{x}_1+\cdots+c_n\lambda_n\boldsymbol{x}_n .
$$



Each term is a pure multiple of a certain feature vector, $A$  The effect is just to multiply by a number  $\lambda_i$, the direction remains unchanged. This is what "evolving individually" means: each decomposed part stays in one direction, and  $A$  Just stretch in that direction. If you take it a second time, take it again.  $\lambda_i$, multiplied to the  $k$  Times:



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0
=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+\cdots+c_n\lambda_n^k\boldsymbol{x}_n
=S\Lambda^k\boldsymbol{c}.
$$



This last expression is the same as  $A^k\boldsymbol{u}_0=S\Lambda^kS^{-1}\boldsymbol{u}_0$  It's the same formula, except  $\boldsymbol{c}=S^{-1}\boldsymbol{u}_0$  was written out. Therefore, the actual calculation is divided into three steps: first find  $A$  All eigenvalues and eigenvectors of  $\boldsymbol{u}_0$  Expressed as their combination, we get  $\boldsymbol{c}$;Finally, multiply each portion by the corresponding eigenvalue  $k$  Power.

This set of decompositions also explains why eigenvalues can predict the fate of solutions. $\boldsymbol{u}_k$  Each item of  $\lambda_i^k$: $|\lambda_i|<1$  The terms get smaller and smaller, $|\lambda_i|>1$  The terms get bigger and bigger, $|\lambda_i|=1$  The items retain their original size. Which eigenvalue dominates, the solution is ultimately determined by that direction. The stability theorem in Section 2 here becomes a qualitative prediction of the solution; as for the precise numerical value, it depends on  $\boldsymbol{c}$  Provide a weight for each portion.

![Video 00:33:42: Classroom blackboard writing](</attachments/mit1806-245415a395c3a455d781f1dd.jpg>)

*Video 00:33:42｜Approximately corresponding to Section 4 "4. Difference equation: $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$"Nearby.*

## 5. Fibonacci Sequence: A model of eigenvalues

The Fibonacci sequence is the best subject to test this method. take  $F_0=0$, $F_1=1$, each subsequent term is the sum of the previous two terms:



$$
F_{k+2}=F_{k+1}+F_k .
$$



The first few items are  $0,1,1,2,3,5,8,13,21,34,\dots$, is growing faster than it looks, but "how fast" is not an obvious question. ask  $F_{100}$  How much is it, or how many times do these numbers increase? The answer is hidden in the eigenvalues. This sequence is obviously growing and is not a stable situation; but the growth rate is determined by the largest eigenvalue.

The snag is that the recursion is second order - it involves both  $F_{k+1}$  with  $F_k$, and the standard form of the difference equation  $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  It's first-order. The transformation only requires a small trick: combine two adjacent items into a vector, and then add an identity  $F_{k+1}=F_{k+1}$. order



$$
\boldsymbol{u}_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix},
$$



then by  $F_{k+2}=F_{k+1}+F_k$  with  $F_{k+1}=F_{k+1}$  get



$$
\boldsymbol{u}_{k+1}=\begin{bmatrix}F_{k+2}\\F_{k+1}\end{bmatrix}
=\begin{bmatrix}1&1\\1&0\end{bmatrix}\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix}
=A\boldsymbol{u}_k .
$$



The second component indeed reduces to  $F_{k+1}$, the first component is exactly  $F_{k+1}+F_k=F_{k+2}$, so this matrix is correct. A second-order scalar recursion thus becomes a two-dimensional first-order system, and then follow the process in Section 4.

Pay attention to this  $A$  is **symmetric matrix** (symmetric matrix). The eigenvalues of a symmetric matrix must be real numbers, complex numbers will not appear here; its eigenvectors will also be orthogonal to each other. These two properties are not proved until later in the course, but in  $2\times2$  In this case, it is more meaningful to calculate the specific number first.

Calculate the eigenvalues first. Yes  $2\times2$  matrix, the sum of two eigenvalues is equal to **trace** (trace, sum of diagonal elements), is equal to the determinant. These two quantities can be read without solving the characteristic equation. The trace here is  $1$, the determinant is  $0-1=-1$, so the two eigenvalues satisfy



$$
\lambda_1+\lambda_2=1,\qquad \lambda_1\lambda_2=-1 .
$$



Count them out and check:



$$
\det(A-\lambda I)=\begin{vmatrix}1-\lambda&1\\1&-\lambda\end{vmatrix}
=(1-\lambda)(-\lambda)-1=\lambda^2-\lambda-1 .
$$



Let it be zero and use the root formula to get



$$
\lambda=\frac{1\pm\sqrt{1+4}}{2}=\frac{1\pm\sqrt{5}}{2},
$$



i.e.  $\lambda_1=\dfrac{1+\sqrt5}{2}\approx 1.618$, $\lambda_2=\dfrac{1-\sqrt5}{2}\approx -0.618$. The sum of the two is  $1$, multiplied by  $-1$, consistent with the predictions of the trace and determinant.

There is a remarkable coincidence here: the characteristic equation  $\lambda^2-\lambda-1=0$  and the original recursion  $F_{k+2}-F_{k+1}-F_k=0$  The shape is exactly the same. put  $F_k$  Change to the idea of "multiplying each step by a fixed multiple" $\lambda^k$, the recursion becomes  $\lambda^{k}(\lambda^2-\lambda-1)=0$, giving exactly the same equation. An eigenvalue is greater than  $1$, the absolute value of an eigenvalue is less than  $1$, plus the two eigenvalues are different from each other, so this matrix must be diagonalizable.

Then calculate the eigenvectors. $A-\lambda I$  shaped like



$$
\begin{bmatrix}1-\lambda&1\\1&-\lambda\end{bmatrix},
$$



when  $\lambda$  satisfy  $\lambda^2=\lambda+1$  when, take  $\begin{bmatrix}\lambda\\1\end{bmatrix}$  Try it: the second component is  $\lambda-\lambda=0$;The first component is  $(1-\lambda)\lambda+1=\lambda-\lambda^2+1=0$. Both components return to zero, so



$$
\boldsymbol{x}_1=\begin{bmatrix}\lambda_1\\1\end{bmatrix},\qquad
\boldsymbol{x}_2=\begin{bmatrix}\lambda_2\\1\end{bmatrix}.
$$



Finally deal with the initial conditions. $\boldsymbol{u}_0=\begin{bmatrix}F_1\\F_0\end{bmatrix}=\begin{bmatrix}1\\0\end{bmatrix}$, request out  $\boldsymbol{c}$, solution



$$
c_1\begin{bmatrix}\lambda_1\\1\end{bmatrix}+c_2\begin{bmatrix}\lambda_2\\1\end{bmatrix}
=\begin{bmatrix}1\\0\end{bmatrix}.
$$



Compare the second component to get  $c_1+c_2=0$, that is  $c_2=-c_1$. Substituting in the first component: $c_1(\lambda_1-\lambda_2)=1$, while  $\lambda_1-\lambda_2=\sqrt5$, so



$$
c_1=\frac{1}{\sqrt5},\qquad c_2=-\frac{1}{\sqrt5}.
$$



Multiply the two parts  $\lambda^k$  Add them together again and take the second component of the result (which is  $F_k$):



$$
F_k=\frac{1}{\sqrt5}\left[\left(\frac{1+\sqrt5}{2}\right)^{k}-\left(\frac{1-\sqrt5}{2}\right)^{k}\right].
$$



Take the first few verifications: $k=1$  time  $(1.618+0.618)/2.236=1$; $k=2$  time  $(2.618-0.382)/2.236=1$; $k=3$  time  $(4.236+0.236)/2.236=2$, and the sequence  $0,1,1,2$  consistent.

This formula unfolds the entire mechanism of growth. $|\lambda_1|>1$, so the first term follows  $k$  exponential growth; $|\lambda_2|\approx0.618<1$, so the second term decays rapidly, $0.618^{100}$  Already  $10^{-21}$  magnitude, almost equal to zero. Therefore



$$
F_k\approx\frac{1}{\sqrt5}\left(\frac{1+\sqrt5}{2}\right)^{k},
$$



take  $k=100$  Got  $F_{100}\approx 3.5\times10^{20}$. The ratio of two adjacent items  $F_{k+1}/F_k$  also tend to  $\lambda_1\approx1.618$, which is exactly what “these numbers are approximately multiplied by  $1.618$"The exact meaning. This kind of information about growth is not in the pivot, nor in the elements of the matrix. It only belongs to the eigenvalues.

![Video 00:41:55: Classroom blackboard writing](</attachments/mit1806-12be0c12560b125245b96c8b.jpg>)

*Video 00:41:55 \| Approximately corresponding to Section 5 "5. Fibonacci Sequence: A Model of Eigenvalues".*

![Video 00:46:39: Classroom blackboard writing](</attachments/mit1806-076a045cb4fb6fc6c40ce310.jpg>)

*Video 00:46:39 \| Approximately corresponding to Section 5 "5. Fibonacci Sequence: A Model of Eigenvalues".*

![Official Handout Summary Page 3/3](</attachments/mit1806-2dc1596dec7202d54b94f17c.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 22 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **diagonalization** (diagonalization): if  $A$  Yes  $n$  linearly independent feature vectors, arrange them in columns  $S$, the eigenvalues are arranged diagonally  $\Lambda$, then  $AS=S\Lambda$, multiply left  $S^{-1}$  Got  $S^{-1}AS=\Lambda$  with  $A=S\Lambda S^{-1}$. The essence of the derivation is a column operation: $A$  ride to  $S$  Each column of gets  $\lambda_i\boldsymbol{x}_i$, and then use the right multiplication of the diagonal matrix to peel these numbers into  $\Lambda$.
- diagonalization requirement  $S$  Reversible, that is  $n$  The eigenvectors are linearly independent. This is the premise of the entire method, on which the subsequent power formula and stability theorem are based.
- $A^2$  The characteristic value of is  $\lambda_i^2$, the eigenvector remains unchanged; by  $S\Lambda S^{-1}\cdot S\Lambda S^{-1}=S\Lambda^2S^{-1}$  visible internal  $S^{-1}S$  offset, so generally  $A^k=S\Lambda^kS^{-1}$, the characteristic value is  $\lambda_i^k$.
- main element and  $LU$  Decompose information without powers: $(LU)^{100}$  It's a hundred  $L,U$  concatenation; the eigenvalues are given  $A$  Behavior after repeated exposure.
- **stability theorem**: $A$  When diagonalizable, $A^k\to0$  If and only if all eigenvalues satisfy  $|\lambda_i|<1$; must be taken as an absolute value because eigenvalues can be negative or complex. $\lambda=1$  The power of is always  $1$, $\lambda=-1$  The power of  $\pm1$  It oscillates between times and does not tend to zero.
- Matrices with different eigenvalues must be diagonalized (randomly  $10\times10$  The ten eigenvalues of a matrix are usually different from each other); must be checked for duplicate eigenvalues.
- $10\times 10$  Eigenvalues of the identity matrix  $1$  Repeat ten times, but each vector is a feature vector, and ten independent vectors can be taken, $S^{-1}IS=I$, is originally a diagonal matrix.
- $A=\begin{bmatrix}2&1\\0&2\end{bmatrix}$  eigenvalues  $2$  It is a double root, and  $A-2I$  The null space of has only one dimension, consisting only of  $\begin{bmatrix}1\\0\end{bmatrix}$  Zhang Cheng, cannot make up two independent eigenvectors, so it cannot be diagonalized. Here are two counts compared: **algebraic multiplicity**($2$) and **geometric multiplicity**($1$).
- **difference equation** $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  The solution is  $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$;The actual algorithm is to  $\boldsymbol{u}_0=S\boldsymbol{c}$  Decompose it into the characteristic direction, and then multiply it item by item  $\lambda_i^k$, got  $\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+\cdots+c_n\lambda_n^k\boldsymbol{x}_n$.
- Fibonacci: order  $\boldsymbol{u}_k=\begin{bmatrix}F_{k+1}\\F_k\end{bmatrix}$, got  $A=\begin{bmatrix}1&1\\1&0\end{bmatrix}$, characteristic value  $\lambda_{1,2}=\frac{1\pm\sqrt5}{2}$, the trace is  $1$, the determinant is  $-1$, the feature vector is  $\begin{bmatrix}\lambda_i\\1\end{bmatrix}$, $F_k\approx\frac{1}{\sqrt5}\lambda_1^k$, $\lambda_1\approx1.618$  determines the growth rate, $F_{100}\approx3.5\times10^{20}$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| diagonalization | diagonalization | put  $A$  written as  $S\Lambda S^{-1}$, use the eigenvector matrix to  $A$  into a diagonal matrix |
| eigenvector matrix | Eigenvector matrix | to  $n$  A matrix with linearly independent eigenvectors as columns  $S$ |
| eigenvalue matrix | Eigenvalue matrix | Diagonal matrix with eigenvalues as diagonal elements  $\Lambda$ |
| powers of a matrix | matrix power | $A^k=S\Lambda^kS^{-1}$, the characteristic value is  $k$  power without changing the eigenvector |
| stable matrix | stable matrix | satisfy  $A^k\to0$  matrix, the condition is that all  $\lvert\lambda_i\rvert<1$ |
| distinct eigenvalues | different eigenvalues | The characteristic polynomial has no duplicate roots. At this time  $n$  eigenvectors are automatically linearly independent |
| repeated eigenvalue | Duplicate eigenvalues | The multiple roots of the characteristic polynomial may not be found at this time.  $n$  independent feature vectors |
| algebraic multiplicity | algebraic multiplicity | Eigenvalues as multiplicities of roots of characteristic polynomials |
| geometric multiplicity | geometric multiplicity | $A-\lambda I$  The dimension of the null space, that is, the number of independent eigenvectors under this eigenvalue |
| difference equation | difference equation | shaped like  $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  The recurrence system of , the solution is  $\boldsymbol{u}_k=A^k\boldsymbol{u}_0$ |
| first-order system | first order system | Each step only depends on the vector recursion of the previous step and can be described by a matrix |
| recurrence | Recursion | Use the first few rules to determine the last one. Fibonacci is a second-order scalar recursion. |
| eigenvector expansion | Eigenvector expansion | Write the initial vector as  $c_1\boldsymbol{x}_1+\cdots+c_n\boldsymbol{x}_n$, used to solve differential equations |

---

[← Lecture 21](/en/notes/mit-1806/lec21) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 23 →](/en/notes/mit-1806/lec23)
