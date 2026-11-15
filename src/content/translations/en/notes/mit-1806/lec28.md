---
kind: notes
source: mit-1806/lec28
title: Lecture 28 · Similarity matrix and Jordan standard form
description: Understand similarity matrices and Jordan standard forms, and deal
  with non-diagonalizable situations.
sourceHash: c0d21fbc910bd4baff7231eff3290b6042a21728f9e82b11fe9e8eb902d3edb7
publish: true
translationMethod: machine-assisted
---

> *Similar matrices and Jordan form* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 28 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p29 · Similarity matrix and Jordan standard form](https://www.bilibili.com/video/BV1ix411f7Yp?p=29)(45:57)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-28-similar-matrices-and-jordan-form/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=29&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The previous lecture boiled down the determination of a positive definite matrix to several mutually equivalent criteria: all eigenvalues are positive, all principal components are positive, and all sequential principal formulas are positive. The determination problem is solved, but the source question is left unanswered: What kind of matrices will naturally become positive definite in applications? This lecture will first use a short section to make up for this. The answer lies in the recurring combination in least squares.  $A^{\mathsf T}A$  Medium - only rectangular matrix  $A$  The columns of are linearly independent, $A^{\mathsf T}A$  It is right concentration.

Then move to the main topic: **similarity matrix** (similar matrices). weigh two  $n\times n$  matrix  $A$  with  $B$  Similarity means that there is an invertible matrix  $M$  such that  $B=M^{-1}AM$. This definition seems to be just  $A$  There is a matrix on the left and right, but it is actually classifying all square matrices - similar matrices form a family, and the same family shares all eigenvalues.

A similar point of view changes the eigenvalue theory in the previous chapter: diagonalization  $S^{-1}AS=\Lambda$  Now read as "$A$  with diagonal matrix  $\Lambda$  similar", while  $\Lambda$  Exactly  $A$  The simplest member of the family. The trouble lies in repeated eigenvalues and insufficient eigenvectors: there was no diagonal matrix in the family at that time, and the simplest member could only bring a few above the diagonal.  $1$, this is **Jordan standard type** (Jordan form). It uses the size of the block to clearly record "several missing eigenvectors", so all square matrices - including non-diagonalizable ones - have standard representations.

![Official Handout Summary Page 1/4](</attachments/mit1806-0733e6571468472fb2eb746c.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 28 Summary, CC BY-NC-SA 4.0).*

## 1. Three supplements to positive certainty

There are several properties of a positive definite matrix that can be seen directly from the definition without having to calculate eigenvalues or pivot components. **inverse matrix** is the first one: if  $A$  Symmetrically positive definite, then  $A^{-1}$  is also symmetrical, and  $A^{-1}$  The characteristic value of is  $A$  The reciprocal of the eigenvalues  $1/\lambda$; $\lambda>0$  guarantee  $1/\lambda>0$, so  $A^{-1}$  Also samadhi. This argument only uses eigenvalues, which is much faster than recalculating the pivots.

**sum of matrices** It's the second one. Set  $A$, $B$  Du Zhengding, ask  $A+B$  Whether it is right concentration. I don’t know at this time  $A+B$ ’s eigenvalues, and we don’t know its pivot, the only thing we can start with is the definition itself—quadratic type:



$$
\boldsymbol{x}^{\mathsf T}(A+B)\boldsymbol{x}
=\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}+\boldsymbol{x}^{\mathsf T}B\boldsymbol{x}.
$$



The two terms on the right-hand side are valid for any non-zero  $\boldsymbol{x}$  are both positive, so their sum is always positive, $A+B$  Right concentration. Positive definiteness is like the property that real numbers are "positive", which is at least closed to addition; what is more worth understanding is the method: when the eigenvalues ​​and pivot components cannot be calculated, it is always feasible to go back to the definition and look at the quadratic form.

The third property comes from application. Appears in all formulas of least squares and projection  $A^{\mathsf T}A$, here  $A$  is  $m\times n$  rectangular matrix. $A$  It cannot be said to be positive concentration per se - it is asymmetrical and generally not square - but  $A^{\mathsf T}A$  is  $n\times n$  symmetric matrix, the problem then becomes: $A^{\mathsf T}A$  Right?

Still looking at the quadratic form, the key lies in the position of the brackets:



$$
\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}
=(A\boldsymbol{x})^{\mathsf T}(A\boldsymbol{x})
=\|A\boldsymbol{x}\|^2 .
$$



because  $\boldsymbol{x}^{\mathsf T}A^{\mathsf T}=(A\boldsymbol{x})^{\mathsf T}$, the entire expression is a column vector  $A\boldsymbol{x}$  The inner product with itself, the square of the length, can never be negative. So  $A^{\mathsf T}A$  at least **positive semidefinite** (positive semi-definite). To upgrade to positive definite, we must exclude the length of  $0$  situation: there is only one possibility for the length square to be zero, $A\boldsymbol{x}=\boldsymbol{0}$. The question then becomes: $A$  When does the nullspace of contain only zero vectors? The answer is that rank is equal to  $n$, that is, each column is linearly independent.

to  $11\times 5$  Take the matrix as an example: the five column vectors are linearly independent, and the rank is  $5$, there are only zero vectors in the null space. At this time  $A^{\mathsf T}A$  It is positive definite, therefore reversible, and the least squares equation has a unique solution. Conversely, if the column vectors are correlated, there will be a non-zero  $\boldsymbol{x}$  such that  $A\boldsymbol{x}=\boldsymbol{0}$, the quadratic form is obtained  $0$, $A^{\mathsf T}A$  It's just semi-definite.

By the way, a numerical observation: there is no need to exchange rows when eliminating elements of a positive definite matrix, and zero or extremely small numbers that should not appear will never appear in the pivot position. This type of matrix is ​​both the best theoretically structured and the most computationally reliable.

![Video 00:04:36: Classroom blackboard writing](</attachments/mit1806-d44151b1925bdc4cd5da3377.jpg>)

*Video 00:04:36 \| Approximately corresponding to Section 1 "1. Three Supplements to Positive Determination".*

## 2. Similarity matrix: same family

Set  $A$  with  $B$  All  $n\times n$  matrix. If there is an invertible matrix  $M$  such that



$$
B=M^{-1}AM,
$$



is called  $A$  with  $B$ **similar** (similar). in the definition  $M$  Clamp from both sides  $A$, multiply the inverse matrix on the left and multiply itself on the right. This specific combination is not arbitrarily specified. It has already appeared before.

> Editor's note: From the perspective of linear transformation, $B=M^{-1}AM$  It is the matrix of the same linear transformation under two different bases, $M$  The relationship between these two groups of bases is recorded. This is the basis for understanding similarity as "different descriptions of the same object."

The most important calculation in the chapter on eigenvalues is: if  $A$  Yes  $n$  linearly independent eigenvectors, arrange them in columns into a matrix  $S$, then



$$
S^{-1}AS=\Lambda,
$$



Among them  $\Lambda$  It is a diagonal matrix with each eigenvalue placed sequentially on the diagonal. To rephrase in similar language, this is "$A$  with  $\Lambda$ "similar", and in this similar relationship  $M$  It happens to be the eigenvector matrix  $S$. Change to an arbitrary invertible matrix  $M$  do it  $M^{-1}AM$, the result is generally no longer diagonal, but it is still related to  $A$  Similar. The similarity relation brings all such matrices into the same family, and the diagonal matrix is ​​just the neatest member of the family. This is also the benefit of diagonalization: it does not change any eigenvalues, it just changes the eigenvectors into the cleanest shape - the eigenvectors of the diagonal matrix are the standard basis vectors  $(1,0)$  with  $(0,1)$.

Let's look at an example. take



$$
A=\begin{bmatrix}2&1\\1&2\end{bmatrix}.
$$



The trace is  $4$, the determinant is  $3$, so the eigenvalue is  $3$  and  $1$. The eigenvector is not difficult to find: $A-3I$  The null space of  $(1,1)$  Zhang Cheng, $A-I$  The null space of  $(1,-1)$  Zhang Cheng, so



$$
S=\begin{bmatrix}1&1\\1&-1\end{bmatrix},
\qquad
S^{-1}AS=\begin{bmatrix}3&0\\0&1\end{bmatrix}=\Lambda .
$$



Change it now  $M$. Get the upper triangular matrix



$$
M=\begin{bmatrix}1&4\\0&1\end{bmatrix},
\qquad
M^{-1}=\begin{bmatrix}1&-4\\0&1\end{bmatrix};
$$



All diagonal elements are  $1$  To inverse the upper triangular matrix, just change the sign of the number in the upper right corner. Calculate first  $AM$:



$$
AM=\begin{bmatrix}2&1\\1&2\end{bmatrix}
\begin{bmatrix}1&4\\0&1\end{bmatrix}
=\begin{bmatrix}2&9\\1&6\end{bmatrix},
$$



Take another left  $M^{-1}$:



$$
B=M^{-1}AM
=\begin{bmatrix}1&-4\\0&1\end{bmatrix}
\begin{bmatrix}2&9\\1&6\end{bmatrix}
=\begin{bmatrix}-2&-15\\1&6\end{bmatrix}.
$$



$B$  with  $A$  It seems irrelevant. Check its eigenvalues: the trace is  $-2+6=4$, the determinant is  $(-2)\cdot 6-(-15)\cdot 1=3$, so the characteristic polynomial  $\lambda^2-4\lambda+3$  The roots are still  $3$  and  $1$.$A$, $\Lambda$, $B$  The three are similar and belong to the same family.

There are far more than three members of this family. with  $A$  Similar matrices are  $2\times 2$  And the characteristic value is  $3,1$  matrix; in turn, each eigenvalue is  $3,1$  of  $2\times 2$  The matrix is also in this family. For example, the upper triangular matrix



$$
\begin{bmatrix}3&7\\0&1\end{bmatrix}
$$



The eigenvalues of are written on the diagonal. It is also in the family, but not like  $\Lambda$  So clean.

![Video 00:11:05: Classroom blackboard writing](</attachments/mit1806-508be99b74b99a46dd985f25.jpg>)

*Video 00:11:05 \| Approximately corresponding to Section 2 "2. Similarity Matrix: Same Family".*

![Official Handout Summary Page 2/4](</attachments/mit1806-727f0dc8ab3229028f7a1500.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 28 Summary, CC BY-NC-SA 4.0).*

## 3. Similar matrices have the same eigenvalues

The most important thing that similar matrices have in common is that the eigenvalues are the same. The proof is that there are only three rows, but every step must be seen clearly.

Set  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, $\boldsymbol{x}\ne\boldsymbol{0}$, and  $B=M^{-1}AM$. in  $A$  After inserting a pair of mutually inverse matrices, the equation remains unchanged:



$$
A\boldsymbol{x}=A(MM^{-1})\boldsymbol{x}=\lambda\boldsymbol{x}.
$$



Take both sides to the left at the same time  $M^{-1}$, reuse  $\lambda$  It’s just a number that can be mentioned at the top:



$$
M^{-1}AM\,(M^{-1}\boldsymbol{x})=\lambda\,(M^{-1}\boldsymbol{x}),
$$



That is



$$
B\,(M^{-1}\boldsymbol{x})=\lambda\,(M^{-1}\boldsymbol{x}).
$$



This shows  $\lambda$  Also  $B$  The eigenvalues of , the corresponding eigenvectors are  $M^{-1}\boldsymbol{x}$. The proof ends here.

There are two conclusions. First, the eigenvalues ​​of similar matrices are exactly the same. Second, the eigenvectors do not remain unchanged;  $M^{-1}$  Moved to another location. The eigenvectors must change: if the eigenvalues ​​are the same and the eigenvectors are all the same, then the two matrices are the same and there will be no other members of the family.

Other conserved quantities can also be derived from the same eigenvalues. The trace is the sum of eigenvalues, and the determinant is the product of eigenvalues, so the trace and determinant of similar matrices are the same - in the previous example  $A$  with  $B$  All traces of  $4$, the determinants are all  $3$, it is for this reason; these two numbers are also the fastest way to check whether the calculation is wrong. In addition, $M^{-1}$  put  $A$  The feature vectors of  $B$  eigenvectors, so the number of linearly independent eigenvectors of both is the same. Yes  $2\times 2$  For matrices, the two pieces of information, eigenvalues and the number of eigenvectors, are enough to determine the family; but for larger matrices, counting alone is not enough.

![Video 00:17:28: Classroom blackboard writing](</attachments/mit1806-e94195ea5cc698691b45c4ef.jpg>)

*Video 00:17:28 \| Approximately corresponding to Section 3 "3. Similar matrices have the same eigenvalues".*

## 4. Repeated eigenvalues: matrices that are only similar to themselves

Things immediately get worse when eigenvalues are repeated. Assume that the two eigenvalues are equal, $\lambda_1=\lambda_2=4$, that is  $4$  is a double eigenvalue. Under the framework of diagonalization, the bad news is that there may not be two linearly independent eigenvectors, and the matrix cannot be diagonalized; in similar language, the eigenvalue is  $4,4$  There is more than one family of matrices.

Let’s look at the simplest members first  $4I$: $I$  is the identity matrix, $4I$  It's all on the diagonal  $4$  matrix. for any invertible matrix  $M$,



$$
M^{-1}(4I)M=4\,M^{-1}M=4I,
$$



$M$  Got asked out. So with  $4I$  A similar matrix is only itself: it is a family with only one member, it stays alone.

Look again



$$
J=\begin{bmatrix}4&1\\0&4\end{bmatrix}.
$$



Its trace is  $8$, the determinant is  $16$, the eigenvalues are indeed two  $4$. But



$$
J-4I=\begin{bmatrix}0&1\\0&0\end{bmatrix},
$$



Equation  $(J-4I)\boldsymbol{x}=\boldsymbol{0}$  Only the second component is required to be zero, and the null space is one-dimensional, given by  $(1,0)$  Zhang Cheng. There is only one eigenvector, so  $J$  Not diagonalizable. if  $J$  Can be diagonalized, its diagonal form can only be two on the diagonal  $4$, that is  $4I$; but  $J$  with  $4I$  Not similar. Contradiction explanation: $J$  There is no diagonal matrix in the family.

So the "best representative" of this family can no longer be  $\Lambda$, we can only take a step back  $J$:Place two on the diagonal  $4$, place one just above the diagonal  $1$. that  $1$  It is the trace left by the "missing eigenvector" - it reminds us that there should be an independent direction here, but the matrix does not provide it.

There are many other members of this family. Yes  $2\times 2$  Matrix, the eigenvalues are completely determined by the trace and determinant, so the trace is  $8$, the determinant is  $16$  and not equal to  $4I$  matrix, the eigenvalues are  $4,4$. For example



$$
A_1=\begin{bmatrix}5&1\\-1&3\end{bmatrix}
$$



The trace is  $8$, the determinant is  $15+1=16$; subtract it  $4I$  Got



$$
A_1-4I=\begin{bmatrix}1&1\\-1&-1\end{bmatrix},
$$



Rank is  $1$, the null space is still one-dimensional, so  $A_1$  Not diagonalizable. Look again



$$
A_2=\begin{bmatrix}4&17\\0&4\end{bmatrix},
$$



Its traces are also  $8$, the determinant is also  $16$, and  $A_2-4I$  The rank is also  $1$, so they are also in this family.

These matrices are similar to each other and can be explicitly expressed using  $M$  See it. take  $M=\operatorname{diag}(s,1)$, calculated directly



$$
M^{-1}\begin{bmatrix}4&1\\0&4\end{bmatrix}M
=\begin{bmatrix}4&1/s\\0&4\end{bmatrix}.
$$



$s$  You can take any non-zero value, so put the  $1$  Replace with  $10$, exchange it for 10 million, and you will still get members of the same family, but not as good as  $J$  Clean. Writing the shapes apart, the average member of this family is



$$
\begin{bmatrix}a&b\\c&8-a\end{bmatrix},
$$



As long as  $a(8-a)-bc=16$, its trace is  $8$, the determinant is  $16$, the characteristic value is  $4,4$. remove  $4I$  themselves, these matrices belong to  $J$  family. So the eigenvalue is  $4,4$  of  $2\times 2$  The matrix is divided into two families: one family has only  $4I$  A member of another tribe  $J$  There are infinitely many representatives and members.

![Video 00:29:52: Classroom blackboard writing](</attachments/mit1806-8e822a1e979ea83dbcf02e9c.jpg>)

*Video 00:29:52 \| Approximately corresponding to Section 4 "4. Repeating eigenvalues: matrices that are only similar to themselves".*

## 5. Just counting eigenvectors is not enough

From the previous section: similar matrices have the same eigenvalues and the same number of linearly independent eigenvectors. A natural conjecture is that these two together are sufficient to determine similarity. This conjecture is wrong, and the counterexample will be  $4\times 4$  Just showed up.

Take a four eigenvalues all as  $0$  matrix, the structure is "a  $3\times 3$  block plus one  $1\times 1$  block":



$$
J_1=\begin{bmatrix}
0&1&0&0\\
0&0&1&0\\
0&0&0&0\\
0&0&0&0
\end{bmatrix}.
$$



What is its rank? Only the second and third columns are non-zero, and they are linearly independent, so the rank is  $2$;The null space dimension is  $4-2=2$. The eigenvalues are  $0$, the eigenvector is a non-zero vector in the null space, so it has exactly two linearly independent eigenvectors.

Now put that  $1$  Change the position and change it to "two  $2\times 2$  block":



$$
J_2=\begin{bmatrix}
0&1&0&0\\
0&0&0&0\\
0&0&0&1\\
0&0&0&0
\end{bmatrix}.
$$



Its rank is also  $2$, only the second and fourth columns are non-zero. The null space dimension is still  $2$, there are still two feature vectors. The eigenvalues are the same, the ranks are the same, the null space dimensions are the same, and the number of eigenvectors is the same, but  $J_1$  with  $J_2$  Not similar.

The difference lies in "how the missing feature vectors are distributed". $J_1$  There is one  $3\times 3$  block, it occupies the position of three eigenvalues but only contributes one eigenvector, missing two; next to  $1\times 1$  If you contribute one block, there will be no shortage. $J_2$  It's two  $2\times 2$  Each block occupies two positions, contributes one, and lacks one. The total number of gaps on both sides is two, but one is "$3+1$" and the other one is "$2+2$”, this difference cannot be seen by counting numbers.

These matrices with the same structure are also connected to each other. put  $J_1$  No.  $4$  line of work  $2$  Column zeros are changed to  $7$, the eigenvalue is still four zeros, and the rank is still  $2$, the resulting matrix is still the same as  $J_1$  similar (it puts  $3+1$  The Jordan block structure remains), it just doesn't have the neat block structure anymore - it's still part of the same family, it just doesn't look good.

![Official Handout Summary Page 3/4](</attachments/mit1806-6039557a0843d4f92baab239.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 28 Summary, CC BY-NC-SA 4.0).*

![Video 00:35:58: Classroom blackboard writing](</attachments/mit1806-ceb0963a4da8bff592b3ef5b.jpg>)

*Video 00:35:58 \| Approximately corresponding to Section 5 "5. Just counting eigenvectors is not enough".*

## 6. Jordan block and Jordan standard type

The differences above all come down to "blocks", and these blocks have special names. one **Jordan block** (Jordan block) is in the form



$$
J_k(\lambda)=\begin{bmatrix}
\lambda&1&&\\
&\lambda&\ddots&\\
&&\ddots&1\\
&&&\lambda
\end{bmatrix}
$$



of  $k\times k$  Matrix: all diagonals have the same eigenvalues  $\lambda$, the diagonal line just above the diagonal line is full of  $1$, the rest of the position - especially below the diagonal line - are all  $0$.

A Jordan block has exactly one eigenvector. solution  $(J_k(\lambda)-\lambda I)\boldsymbol{x}=\boldsymbol{0}$, which is equivalent to the line-by-line requirement  $x_2=0$, $x_3=0$, until  $x_k=0$, only the first direction is free to take values, so the null space is one-dimensional. The size of the block is  $k$, but only one eigenvector is given, which is missing  $k-1$  This is recorded in the size of this piece.

**Jordan's theorem**:Each square matrix  $A$  are all related to a certain Jordan matrix  $J$  Similar. The so-called Jordan matrix is a block diagonal matrix in which a number of Jordan blocks are placed along the diagonal and the remaining positions are all zeros.



$$
J=\begin{bmatrix}
J_{k_1}(\lambda_1)&&\\
&\ddots&\\
&&J_{k_d}(\lambda_d)
\end{bmatrix}.
$$



Different blocks can have different feature values, and the same feature value can also appear in several blocks.

There are three ways to read the Jordan matrix: all the eigenvalues can be read by multiplicity on the diagonal, and the sum of the sizes of each block is exactly  $n$;The number of blocks  $d$  is equal to the number of linearly independent feature vectors, since each block contributes exactly one; the size of each block indicates how the missing feature vectors are distributed, a  $k$  Stage block occupied  $k$  eigenvalue positions, but only one eigenvector is provided, missing  $k-1$ . $4\times 4$  In the two examples of $J_1$  is  $3+1$  type, $J_2$  is  $2+2$  Type and number of blocks are both  $2$, the total number of gaps is  $2$, but the distribution is different, so they are different families.

Diagonalization is a special case of Jordan's theorem. If  $A$  of  $n$  eigenvalues are different from each other, then  $n$  The feature vectors must be complete, $d=n$, each block is  $1\times 1$, the Jordan matrix is a diagonal matrix  $\Lambda$. This is the "good case" where similar problems degenerate into diagonalization problems, and is where 18.06 is practiced over and over again. Jordan's contribution was to bring bad situations into the same language: $J$  Still there, just a few more above the diagonal  $1$.

Today, the Jordan type is no longer regarded as the climax of the course. The reason is very practical: to find it, you need to know whether the eigenvalues **Just right** are equal, you also need to know the matrix **precise** Rank; these two things are extremely sensitive to numbers. A small perturbation will separate two equal eigenvalues and change the rank, so the entire block structure changes accordingly. Therefore, the Jordan type is an algebraically correct classification tool, but it is not a target that can be relied upon in numerical calculations. The protagonist of the next lecture is singular value decomposition, which operates on any matrix - including rectangular matrices - and has become a central content of linear algebra.

![Video 00:41:21: Classroom blackboard writing](</attachments/mit1806-072ac1e879cf2f88788882a3.jpg>)

*Video 00:41:21 \| Approximately corresponding to Section 6 "6. Jordan Block and Jordan Standard".*

![Official Handout Summary Page 4/4](</attachments/mit1806-78b1f5b02d1a0ce95cdece46.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 28 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The inverse of a positive definite matrix is still positive definite: the eigenvalues of the inverse are the reciprocals of the original eigenvalues  $1/\lambda$, all are positive.
- The sum of two positive definite matrices is still positive definite because the quadratic form can be broken into two terms: $\boldsymbol{x}^{\mathsf T}(A+B)\boldsymbol{x}=\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}+\boldsymbol{x}^{\mathsf T}B\boldsymbol{x}>0$.
- If  $A$  is  $m\times n$  rectangular matrix, then  $A^{\mathsf T}A$  Symmetric and positive semi-definite, the basis is  $\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}=\|A\boldsymbol{x}\|^2$;when  $A$  The rank is  $n$ (column is linearly independent), it is positive definite, reversible, and the least squares equation has a unique solution. There is no need to exchange rows when eliminating elements of a positive definite matrix, which is the most reliable numerically.
- Similar definition: there is an invertible matrix  $M$  such that  $B=M^{-1}AM$. All square matrices are divided into families according to similar relationships; diagonalization  $S^{-1}AS=\Lambda$  Just "$A$  with  $\Lambda$  similar", $\Lambda$  He is the simplest member of the family.
- Similar matrix eigenvalues are the same: given by  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  launch  $B(M^{-1}\boldsymbol{x})=\lambda(M^{-1}\boldsymbol{x})$, the feature vector is  $M^{-1}$  move. The trace is also the same as the determinant (the product of the sum of eigenvalues).
- Example: all diagonal elements are  $2$, all off-diagonal elements are  $1$  of  $2\times 2$  The matrix eigenvalues are  $3,1$, which is related to  $\Lambda=\operatorname{diag}(3,1)$  Similar; use upper triangular matrix  $M$  do  $M^{-1}AM$  Get another matrix of the same family, it looks completely different, the trace is still  $4$, the determinant is still  $3$.
- Family splits when eigenvalues are repeated: and  $4I$  Similar only  $4I$;The remaining eigenvalues are  $4,4$  of  $2\times 2$  matrix (trace  $8$, determinant  $16$) belong to the same family, the optimal representatives are the two on the diagonal  $4$, one immediately above the diagonal  $1$  The matrix of  $1$  Can be replaced by any non-zero number.
- Jordan block: On the diagonal are the repeated eigenvalues, and on the diagonal immediately above  $1$, the rest are zero; each block contributes exactly one feature vector, missing  $k-1$ .
- Jordan's theorem: Any square matrix is similar to a Jordan matrix composed of Jordan blocks; the number of blocks is equal to the number of eigenvectors, and the block size records the distribution of missing eigenvectors; when the eigenvalues are different from each other, it is a diagonal matrix.
- The Jordan type is extremely sensitive to perturbations and is an algebraic classification tool rather than a numerical calculation target; $4\times 4$  of  $3+1$  Type and  $2+2$  A type is an example in which the number of eigenvalues, ranks, and eigenvectors are identical but not similar.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| positive definite | positive definite | Symmetric matrix and quadratic form  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  for everything non-zero  $\boldsymbol{x}$  is positive |
| positive semi-definite | positive semidefinite | The quadratic form is always non-negative, but may be zero, such as if the rank is not satisfied  $A^{\mathsf T}A$ |
| similar matrices | similarity matrix | There is reversibility  $M$  such that  $B=M^{-1}AM$, homogeneous matrices share eigenvalues |
| diagonalization | diagonalization | Use eigenvector matrix  $S$  put  $A$  form  $S^{-1}AS=\Lambda$ |
| Jordan form | Jordan standard type | Each square matrix is similar to a block diagonal matrix, and the blocks are Jordan blocks |
| Jordan block | Jordan block | The same eigenvalue is repeated on the diagonal, and all on the upper diagonal are  $1$  block, only contributes one feature vector |
| block diagonal matrix | block diagonal matrix | A matrix with several sub-blocks placed along the diagonal and zeros in the remaining positions |
| eigenvalue | eigenvalue | satisfy  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  number  $\lambda$, unchanged under similar transformation |
| eigenvector | eigenvector | satisfy  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  is a non-zero vector, which is transformed under similar transformation  $M^{-1}$  move |
| trace | trace | The sum of diagonal elements is equal to the sum of eigenvalues, unchanged under similar transformation |
| determinant | determinant | The product of eigenvalues is invariant under similar transformations and is also one of the tools for judging reversibility and positive certainty. |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  The total vector of , the dimension is  $n-\text{秩}$ |
| rank | rank | The number of linearly independent columns (or rows) determines the null space dimension |
| identity matrix | identity matrix | All on the diagonal are  $1$  matrix; scalar matrix  $cI$  The only similar family is itself |

---

[← Lecture 27](/en/notes/mit-1806/lec27) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 29 →](/en/notes/mit-1806/lec29)
