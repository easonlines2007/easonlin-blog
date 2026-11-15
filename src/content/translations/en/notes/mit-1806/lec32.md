---
kind: notes
source: mit-1806/lec32
title: Lecture 32 · Third test review
description: "Review Part 3: Eigenvalues, Positive Definiteness, SVD, and Linear
  Transformations."
sourceHash: b963379e09c296cee9fbf4542d8ea145c0c96fd78d2630e7c8f613e5f0a242ea
publish: true
translationMethod: machine-assisted
---

> *Quiz 3 review* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 32 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p33 · Third test review](https://www.bilibili.com/video/BV1ix411f7Yp?p=33)(47:05)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-32-quiz-3-review/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=33&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The scope of the third test ends at Chapter 6: eigenvalues and eigenvectors, differential equations, symmetric matrices, positive definite matrices, similar matrices, and singular value decomposition (SVD). The linear transformations in Chapter 7 are not included in this test and will be left until the end of the year. Most of the review questions are taken from previous years' examination papers. They have a common way of setting the questions: they do not test complicated matrix operations, but give a number of eigenvalues ​​and eigenvectors, or tell you that the matrix belongs to a certain type of special matrix, and ask you to judge its properties accordingly.

The research object of the third part is fundamentally different from that of the first half of the semester. Elimination relies on row transformation, and row transformation will change the eigenvalues, so "first eliminate the matrix into an upper triangle, and then read the eigenvalues from the diagonal" will not work; the operation to maintain the eigenvalues is a similarity transformation  $B=M^{-1}AM$. However, the four basic subspaces established in the previous lectures have not expired: when it comes to SVD, rank, nullspace, and column space will reappear in the form of singular values.

This lecture is organized according to "Test Points - Methods - Typical Questions". The first two test points make full use of eigenvalues: first use a differential equation question to review general solutions and stability, and then use a "only eigenvalues and eigenvectors" question to judge the identities of symmetry, positive definite, Markov, and projection one by one; the third test point returns to SVD, and supplements the equation  $U$  The most error-prone symbol step; the last test point uses a "both symmetrical and orthogonal" matrix to string eigenvalues, orthogonality and projection into a comprehensive question.

![Official Handout Summary Page 1/4](</attachments/mit1806-2d6020937af0fb04e88ff95a.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 32 Summary, CC BY-NC-SA 4.0).*

## 1. Review Maps: Eigenvalues are the unifying language of Chapter 6

The several topics in Chapter 6 are all expansions of the same problem in different directions: what exactly changes when a matrix is multiplied by a vector. Eigenvalues and eigenvectors give half of the answer—which directions are constant and how many times each direction is stretched; the solution is to solve for the characteristic polynomial $\det(A-\lambda I)=0$, which has been practiced in the second test. What this lecture adds are two shortcuts that “do not rely on hard calculation”: if the matrix is singular, there must be an eigenvalue of  $0$;If the matrix belongs to a special type, its eigenvalues have a fixed shape.

- **differential equation**(differential equation)$\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$: The general solution is the superposition of each eigenmode. The positive or negative real part of the eigenvalue determines growth or attenuation, and the imaginary part determines oscillation.
- **symmetric matrix**: $A=A^{\mathsf T}$  When the eigenvalues are all real numbers, the eigenvectors can be orthogonal to each other, so  $A=Q\Lambda Q^{\mathsf T}$, among which  $Q$  is an orthogonal matrix, $\Lambda$  is a diagonal matrix composed of eigenvalues.
- **Positive definite matrix**: A type of symmetric matrix in which all eigenvalues are positive.
- **similarity matrix**: $B=M^{-1}AM$, matrices under the same linear transformation under two sets of bases have the same eigenvalues and synchronized powers: $B^k=M^{-1}A^kM$.
- **SVD**: $A=U\Sigma V^{\mathsf T}$, exists for any matrix; it extends the eigenvalue theory to rectangular matrices and also allows the four basic subspaces to reappear.

After memorizing these relationships, there is only one type of question left in the review class: giving eigenvalues or eigenvectors, allowing you to exclude constraints.

![Video 00:04:43: Classroom blackboard writing](</attachments/mit1806-a4df7a40c1659af83d01d9a5.jpg>)

*Video 00:04:43 \| Approximately corresponding to Section 1 "1. Review map: Eigenvalues are the unified language of Chapter 6".*

## 2. Test point 1: Differential equations and skew symmetric matrices

Test point: Give a matrix  $A$, write out  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$  General solution of , determine the long-term behavior of the solution, and find the period and matrix exponential $e^{At}$.

Everything starts from eigenvalues and eigenvectors. If  $A$  There are three linearly independent eigenvectors  $\boldsymbol{x}_1,\boldsymbol{x}_2,\boldsymbol{x}_3$, corresponding to the eigenvalue  $\lambda_1,\lambda_2,\lambda_3$, then the general solution is



$$
\boldsymbol{u}(t)=c_1e^{\lambda_1 t}\boldsymbol{x}_1+c_2e^{\lambda_2 t}\boldsymbol{x}_2+c_3e^{\lambda_3 t}\boldsymbol{x}_3 .
$$



Each term is "pure exponential times a fixed direction": $\boldsymbol{x}_i$  The component in the direction is  $e^{\lambda_i t}$  Evolution alone, three constants  $c_i$  From the initial conditions  $\boldsymbol{u}(0)$  Set out. So the first step in this type of problem is always to find the eigenvalues ​​and eigenvectors.

Typical questions



$$
A=\begin{bmatrix}0&-1&0\\1&0&-1\\0&1&0\end{bmatrix}.
$$



Don't calculate the determinant yet. Observe the first and third lines: $(0,-1,0)$  with  $(0,1,0)$  are exactly opposite numbers of each other, and the two rows are linearly related, so  $A$  strange, $\lambda_1=0$ (The first column and the third column are linearly related in the same way). This step saves a lot of calculations.

Look at the structure again: $A$  Not a symmetric matrix, but  $A^{\mathsf T}=-A$, this type of matrix is called a skew-symmetric matrix. Its eigenvalues are pure imaginary numbers, all falling on the imaginary axis; obtained above  $0=0\cdot i$  It falls right on the origin and conforms to this rule. Do the math and verify:



$$
\det(A-\lambda I)=\begin{vmatrix}-\lambda&-1&0\\1&-\lambda&-1\\0&1&-\lambda\end{vmatrix}=-\lambda^3-2\lambda,
$$



Let it be zero  $\lambda(\lambda^2+2)=0$, so



$$
\lambda_1=0,\qquad \lambda_2=i\sqrt2,\qquad \lambda_3=-i\sqrt2 .
$$



There is one zero among the three roots, which is the same as "$A$  The other two are pure imaginary numbers, consistent with the prediction of "oblique symmetry". This is the order of doing the questions repeatedly demonstrated in the review class: first use the structure to determine the direction, and then use calculations to verify.

The long-term behavior is determined by the real part of the eigenvalues. The real parts of the three eigenvalues here are all zero, so the three modes neither grow nor decay: $e^{\pm i\sqrt2\,t}$  The module length is always  $1$, just rotating on the unit circle. Therefore the solution neither diverges nor approaches zero, it is **cycle** of. The period consists of  $e^{i\sqrt2\,T}=1$  determined, that is



$$
\sqrt2\,T=2\pi \quad\Longrightarrow\quad T=\pi\sqrt2 .
$$



passed  $T=\pi\sqrt2$  After that, each mode returns to its original value, so  $\boldsymbol{u}(T)=\boldsymbol{u}(0)$  It holds for any initial vector. This is a direct consequence of "eigenvalues ​​have no real part": they oscillate without decaying.

There is an accompanying structural conclusion: the complex eigenvectors of a skew symmetric matrix are also orthogonal in pairs. More generally, the eigenvectors of a matrix can be taken to be pairwise orthogonal if and only if



$$
AA^{\mathsf T}=A^{\mathsf T}A .
$$



A symmetric matrix satisfies it because both sides are equal to  $A^2$;The skew symmetric matrix satisfies it because both sides are equal to  $-A^2$;Orthogonal matrices also satisfy it, because both sides are equal to  $I$. These three categories are the “good matrices” that appear repeatedly in this test.

Finally there is the matrix index. $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$, so  $e^{At}$  This is the core matrix of this type of problem. If  $A$  It is diagonalizable (that is, there are enough linearly independent eigenvectors), written  $A=S\Lambda S^{-1}$($S$  The columns of are eigenvectors), then



$$
e^{At}=Se^{\Lambda t}S^{-1},\qquad
e^{\Lambda t}=\begin{bmatrix}e^{\lambda_1 t}&0&0\\0&e^{\lambda_2 t}&0\\0&0&e^{\lambda_3 t}\end{bmatrix}.
$$



The word "if" cannot be omitted: not every matrix can be diagonalized. The three eigenvalues ​​of this question are different from each other, so they must be diagonalizable and the formula can be used directly.

Common mistakes: When seeing that the eigenvalues are pure imaginary numbers, you mistakenly think that the solution will decay or diverge; or you don't check whether it can be diagonalized and just apply it directly.  $e^{At}=Se^{\Lambda t}S^{-1}$.

![Video 00:11:40: Classroom blackboard writing](</attachments/mit1806-4946489bf5db8a84fee3811e.jpg>)

*Video 00:11:40 \| Approximately corresponding to Section 2 "2. Test Point 1: Differential Equations and Skew Symmetric Matrix".*

![Official Handout Summary Page 2/4](</attachments/mit1806-2684f5e3b8fff3ab36fe4b97.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 32 Summary, CC BY-NC-SA 4.0).*

![Video 00:17:54: Classroom blackboard writing](</attachments/mit1806-5d91ea8347b5f74b8d2d8578.jpg>)

*Video 00:17:54 \| Approximately corresponding to Section 2 "2. Test Point 1: Differential Equations and Skew Symmetric Matrix".*

## 3. Test point 2: Reverse the matrix type from the eigenvalues

Test points: Given only eigenvalues and pairwise orthogonal eigenvectors, determine whether the matrix can be diagonalized, when it is symmetric, whether it is positive definite, and whether it can be a Markov matrix, and  $\frac12A$  When is the projection matrix.

Typical questions: one  $3\times3$  Matrix, the two eigenvalues are known to be  $0$  with  $2$, the third eigenvalue is recorded as  $c$; It is known that its three eigenvectors are orthogonal in pairs.

**Can it be diagonalized?**  Yes, for all  $c$. Diagonalization only depends on whether the eigenvectors are enough, not whether the eigenvalues are repeated: three non-zero vectors that are orthogonal to each other must be linearly independent, which is enough to form  $\mathbb{R}^3$  is a set of basis, so for any  $c$ (includes  $c=0$  or  $c=2$  This situation of repeated eigenvalues) can be diagonalized.

**When is symmetry?** $c$  When it is a real number. Real eigenvalues plus orthogonal eigenvectors make up exactly  $A=Q\Lambda Q^{\mathsf T}$: order  $Q$  It consists of three mutually orthogonal unit eigenvectors, $\Lambda$  The diagonal elements of are real eigenvalues, then  $Q\Lambda Q^{\mathsf T}$  is a symmetric matrix and has the same eigenvalues and eigenvectors, so it is  $A$. If  $c=i$  This type of non-real numbers, the eigenvalues are not all real numbers, $A$  Symmetry is impossible.

**Is it correct?**  Never righteous. Positive definite requires that all eigenvalues are positive, and it has one eigenvalue  $0$. Taking a step back, if  $c\ge0$, it is positive semidefinite because the other two eigenvalues  $0$  with  $2$  Already non-negative.

**Can it be a Markov matrix?**  Never. The Markov matrix must have an eigenvalue equal to  $1$, the modulus length of the remaining eigenvalues does not exceed  $1$; Characteristic values appear  $2$  has violated this rigid constraint, and  $c$  It doesn't matter what value it takes.

**when  $\frac12A$  Is it the projection matrix?** $c=0$  or  $c=2$. The projection matrix satisfies  $P^2=P$;if  $P\boldsymbol{x}=\lambda\boldsymbol{x}$, then  $\lambda^2\boldsymbol{x}=P^2\boldsymbol{x}=P\boldsymbol{x}=\lambda\boldsymbol{x}$, so  $\lambda$  can only be  $0$  or  $1$. So  $\frac12A$  The eigenvalues of can only be taken  $0,1$, that is  $A$  The eigenvalues of can only be taken  $0,2$: $c=0$  When the three are  $0,0,2$, $c=2$  time is  $0,2,2$, divided by  $2$  all behind  $\{0,1\}$  within. And because in these two situations  $A$  Symmetry, $\frac12A$  Also symmetric; a symmetric matrix as long as all eigenvalues are  $0,1$, it will satisfy  $P^2=P$.

The key to this question is not the calculation, but the chain of "recognizing the matrix type - calling the constraints of the type on the eigenvalues". The role of orthogonal eigenvectors in this process is particularly important to understand: it ensures the possibility of symmetry, and thus the possibility of positive semidefinite and projection; if the three eigenvectors are not orthogonal, the three paths of "symmetry", "positive definite" and "projection" will be cut off at the same time, and the only answer to the question is diagonalization.

Common mistakes: only answer a certain question that satisfies the conditions  $c$  Rather than giving all the answers - the answer to this type of question is a whole set of parameters; in addition, don't mistake "repeated eigenvalues" for "non-diagonalizability".

![Video 00:25:41: Classroom blackboard writing](</attachments/mit1806-e7a30632207a5e4ef07805a2.jpg>)

*Video 00:25:41｜Approximately corresponding to Section 3 "3. Test Point 2: Reverse the Matrix Type from Eigenvalues".*

## 4. Test point 3: The structure and reading of SVD

Test point: judge a group  $U,\Sigma,V$  Whether it constitutes SVD; by  $\Sigma$  Read out the rank, invertibility and null space of the matrix; and explain clearly  $U$  How to determine the symbol.

The definition is  $A=U\Sigma V^{\mathsf T}$, that is, the decomposition of "orthogonal × diagonal × orthogonal": where  $U,V$  is an orthogonal matrix, $\Sigma$  is a diagonal matrix (can be rectangular) with non-zero diagonal elements  $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$  It's called a singular value. Any matrix has such a decomposition, which is where it is stronger than diagonalization.

Seeking Dharma is all there  $A^{\mathsf T}A$  on. put  $A=U\Sigma V^{\mathsf T}$  Substitute:



$$
A^{\mathsf T}A=(U\Sigma V^{\mathsf T})^{\mathsf T}(U\Sigma V^{\mathsf T})
=V\Sigma^{\mathsf T}U^{\mathsf T}U\Sigma V^{\mathsf T}
=V\Sigma^{\mathsf T}\Sigma V^{\mathsf T}.
$$



because  $U$  orthogonal, $U^{\mathsf T}U=I$, only the middle  $\Sigma^{\mathsf T}\Sigma$. On the right is the standard decomposition form of a symmetric matrix. Note  $A^{\mathsf T}A$  It is symmetrical in itself. In its SVD, the left and right orthogonal factors are the same. This is exactly  $V$  Appears on both ends at the same time. So  $V$  That’s it  $A^{\mathsf T}A$  The eigenvector matrix of $\Sigma^{\mathsf T}\Sigma$  The diagonal element of is its eigenvalue. So the singular value is equal to  $A^{\mathsf T}A$  Positive square root of eigenvalues:



$$
\sigma_i=\sqrt{\lambda_i(A^{\mathsf T}A)} .
$$



Same reason  $AA^{\mathsf T}=U\Sigma\Sigma^{\mathsf T}U^{\mathsf T}$, $U$  is  $AA^{\mathsf T}$  eigenvector matrix. Everything goes well up to this point, but there is a pitfall: the feature vector is only determined up to the symbol. $AA^{\mathsf T}$  Can't tell you which one to take  $\boldsymbol{u}_i$  Still  $-\boldsymbol{u}_i$. The correct approach is to use the relational expression



$$
A\boldsymbol{v}_i=\sigma_i\boldsymbol{u}_i
$$



Definite symbol: each  $\boldsymbol{v}_i$  You can choose any symbol first, and then multiply it by  $A$, the result must be equal to  $\sigma_i$  times a unit vector, this unit vector is  $\boldsymbol{u}_i$, the symbol is then uniquely determined. Written as a matrix  $AV=U\Sigma$. Just rely on  $AA^{\mathsf T}$  Ask for  $U$, this symbolic constraint will be missed.

Reading a matrix by giving some factors is a common question on exam papers. If



$$
\Sigma=\begin{bmatrix}3&0\\0&2\end{bmatrix},
$$



Both singular values are not zero, then  $A$  Reversible, non-singular. If a certain diagonal element is written as a negative number, for example  $-5$, that's not SVD at all - singular values are by definition non-negative. If the second singular value is  $0$, that is  $\sigma_2=0$, then  $A$  Strange, rank is  $1$: Rank is equal to the number of non-zero singular values. At this time  $A\boldsymbol{v}_2=\sigma_2\boldsymbol{u}_2=\boldsymbol{0}$, so the null space is one-dimensional, given by  $\boldsymbol{v}_2$  Zhang Cheng; the same reason  $\boldsymbol{u}_2$  Belong to  $A^{\mathsf T}$  The null space of , that is, the left nullspace (left nullspace); the column space is given by  $\boldsymbol{u}_1$  Zhang Cheng, row space is represented by  $\boldsymbol{v}_1$  Zhang Cheng. Rank, four basic subspaces, and reversibility are all hidden in these three factors.

Error-prone point: accept negative singular values; only  $AA^{\mathsf T}$  Set  $U$  without checking the sign; or forgetting that the zero singular value corresponds to  $\boldsymbol{v}_i$  It belongs to the null space.

![Video 00:30:36: Classroom blackboard writing](</attachments/mit1806-ad4ad4b9d83a306b4b0a0a56.jpg>)

*Video 00:30:36 \| Approximately corresponding to Section 4 "4. Test Point 3: The Structure and Reading of SVD".*

![Official Handout Summary Page 3/4](</attachments/mit1806-dce9570f68a261722ce53669.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 32 Summary, CC BY-NC-SA 4.0).*

![Video 00:34:02: Classroom blackboard writing](</attachments/mit1806-e6eba2bac4b4125b6a2156ce.jpg>)

*Video 00:34:02 \| Approximately corresponding to Section 4 "4. Test Point 3: The Structure and Reading of SVD".*

## 5. Test point 4: A matrix that is both symmetric and orthogonal

Test point: Judgment  $A$  Possible values, positive definiteness, diagonalizability and singularity of eigenvalues when both symmetric and orthogonal, and prove  $\frac12(A+I)$  is the projection matrix.

Let’s first ask what the eigenvalues can take. Symmetry gives "all are real numbers", orthogonality gives "modulus length is all  $1$". The latter must be testified: if  $Q\boldsymbol{x}=\lambda\boldsymbol{x}$, take the length of both sides,



$$
\|Q\boldsymbol{x}\|=|\lambda|\,\|\boldsymbol{x}\|,
$$



And the orthogonal matrix does not change the length, $\|Q\boldsymbol{x}\|=\|\boldsymbol{x}\|$, so  $|\lambda|=1$. Putting the two conditions together, the eigenvalue can only be  $\pm1$.

Judgment from this point by point. Zhengding? Not necessarily, because it is possible to obtain  $-1$. No heavy eigenvalues? No - the eigenvalues are only  $\pm1$  Two possible values, $3\times3$  Even matrices of higher order are bound to have repetitions. Diagonalizable? Yes, symmetric matrices (and orthogonal matrices) always have enough eigenvectors, and the eigenvectors can be orthogonal. They can be diagonalized using orthogonal matrices, which is better than general  $A=S\Lambda S^{-1}$  Stronger. Not weird? Yes, the orthogonal matrix itself is invertible, which can also be seen from "no zero eigenvalues".

The last question is to prove



$$
P=\frac{A+I}{2}
$$



is the projection matrix. There are two ways. The first is to verify the two defining properties of projection. The symmetry is obvious: $A$  with  $I$  All are symmetrical, divided by  $2$  Still symmetrical. Re-verify  $P^2=P$:



$$
P^2=\frac{(A+I)^2}{4}=\frac{A^2+2A+I}{4}.
$$



by  $A$  Orthogonal and symmetrical  $A^{\mathsf T}=A$  and  $AA^{\mathsf T}=I$, so  $A^2=I$, substitute for



$$
P^2=\frac{I+2A+I}{4}=\frac{A+I}{2}=P .
$$



The second way looks at the eigenvalues: $A$  The characteristic value of is  $1$  or  $-1$, so  $A+I$  The characteristic value of is  $2$  or  $0$, $P$  The characteristic value of is  $1$  or  $0$. A symmetric matrix requires that all eigenvalues are  $\{0,1\}$  Inside, is the projection matrix. In other words, $P$  put  $A$  of  $+1$  The feature directions are retained as they are, and  $-1$  The characteristic direction is pressed to zero, which is exactly what projection is supposed to do.

Common mistakes: Misjudgment of "symmetric and orthogonal" as positive definite, missing eigenvalues  $-1$  possibility; or when verifying the projection, you only checked the symmetry and forgot  $P^2=P$.

![Official Handout Summary Page 4/4](</attachments/mit1806-58aeb4ec779a98ef9723f5bd.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 32 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The third test covers up to Chapter 6: eigenvalues, differential equations, symmetric matrices, positive definite matrices, similarity matrices, and SVD; linear transformations are not included.
- Elimination is a row transformation, which changes the eigenvalues; what maintains the eigenvalues is a similarity transformation  $B=M^{-1}AM$: The eigenvalues are the same, and  $B^k=M^{-1}A^kM$.
- differential equations  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$  The general interpretation is  $c_1e^{\lambda_1t}\boldsymbol{x}_1+\cdots+c_ne^{\lambda_nt}\boldsymbol{x}_n$, the constant is given by  $\boldsymbol{u}(0)$  Definite; the real part of the eigenvalue determines the growth or decay, and the pure imaginary number corresponds to the oscillation.
- skew symmetric matrix  $A^{\mathsf T}=-A$  The eigenvalues of are purely imaginary numbers. Example  $A$  The characteristic value of  $0,\pm i\sqrt2$, the solution is bounded by  $T=\pi\sqrt2$  is the cycle.
- The necessary and sufficient condition for eigenvectors to be pairwise orthogonal is  $AA^{\mathsf T}=A^{\mathsf T}A$;Symmetric, skew symmetric, and orthogonal matrices are all satisfied.
- When diagonalizable  $e^{At}=Se^{\Lambda t}S^{-1}$, take one by one on the diagonal matrix  $e^{\lambda_it}$.
- known eigenvalues  $0,2,c$  with orthogonal eigenvectors: everything  $c$  All can be diagonalized; $c$  Symmetric when it is a real number; never positive definite ($c\ge0$  time-semi-definite); it can never be a Markov matrix; $\frac12A$  is a projection if and only if  $c=0$  or  $c=2$.
- SVD Medium  $V$  is  $A^{\mathsf T}A$  The eigenvector matrix of , the singular value is the positive square root of its eigenvalue; $U$  The symbol of  $A\boldsymbol{v}_i=\sigma_i\boldsymbol{u}_i$  To make a decision, you can’t just look at it  $AA^{\mathsf T}$.
- The number of non-zero singular values is equal to rank; $\sigma_i=0$  time  $\boldsymbol{v}_i$  Belongs to null space, $\boldsymbol{u}_i$  Belongs to left null space.
- The eigenvalues of a matrix that are both symmetric and orthogonal can only be  $\pm1$, $(A+I)/2$  satisfy symmetry and  $P^2=P$, is the projection matrix.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| differential equation | differential equation | $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$, the solution is formed by the superposition of eigenmodes |
| eigenvector | eigenvector | Be  $A$  A non-zero vector whose direction remains unchanged after action |
| skew-symmetric matrix | skew symmetric matrix | satisfy  $A^{\mathsf T}=-A$  matrix, the eigenvalues are pure imaginary numbers |
| matrix exponential | matrix index | $e^{At}$, send the initial vector to the time  $t$  solution |
| period | cycle | The time required for the solution to return to the initial value, in the example  $\pi\sqrt2$ |
| symmetric matrix | symmetric matrix | $A^{\mathsf T}=A$, the eigenvalues are real and can be orthogonally diagonally transformed into  $Q\Lambda Q^{\mathsf T}$ |
| positive definite | positive definite | Symmetric and all eigenvalues are positive |
| positive semidefinite | positive semidefinite | Symmetric and all eigenvalues are non-negative |
| Markov matrix | Markov matrix | has an eigenvalue  $1$, the remaining eigenvalue module lengths do not exceed  $1$  matrix |
| projection matrix | projection matrix | symmetrical and satisfying  $P^2=P$, the eigenvalue can only be  $0,1$ |
| similar matrices | similarity matrix | satisfy  $B=M^{-1}AM$, the eigenvalues are the same |
| singular value decomposition | singular value decomposition | Any matrix is written as  $A=U\Sigma V^{\mathsf T}$, $U,V$  Orthogonal |
| singular value | singular value | $\Sigma$  The nonnegative diagonal element of is equal to  $A^{\mathsf T}A$  Positive square root of eigenvalue |
| orthogonal matrix | orthogonal matrix | $Q^{\mathsf T}Q=QQ^{\mathsf T}=I$, without changing the length, the eigenvalue module length is  $1$ |
| left nullspace | left null space | $N(A^{\mathsf T})$, in SVD by  $\sigma_i=0$  Corresponding  $\boldsymbol{u}_i$  Zhang Cheng |

---

[← Lecture 31](/en/notes/mit-1806/lec31) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 33 →](/en/notes/mit-1806/lec33)
