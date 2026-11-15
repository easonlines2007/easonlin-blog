---
kind: notes
source: mit-1806/lec25
title: Lecture 25 · Symmetric matrices and positive definiteness
description: Understand the orthogonal diagonalization of symmetric matrices and
  the determination of positive certainty.
sourceHash: ed812b7d67410985a30e1fa4edf48a435301ab3fde1d1c33569b40df2097fe64
publish: true
translationMethod: machine-assisted
---

> *Symmetric matrices and positive definiteness* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 25 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p26 · Symmetric matrices and positive definiteness](https://www.bilibili.com/video/BV1ix411f7Yp?p=26)(43:52)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-25-symmetric-matrices-and-positive-definiteness/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=26&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

At this point in the third part, the way you look at matrices has changed: instead of asking about the elements row by row and column by column, you are asking about its eigenvalues and eigenvectors. Once this perspective is established, the "type of matrix" becomes information about the spectrum. The sum of each column of the Markov matrix is  $1$, then it must have an eigenvalue equal to  $1$, the long-term behavior is determined by this  $1$  decision. This lecture deals with the most important class of matrices in linear algebra—**symmetric matrix** (symmetric matrix), which satisfies  $A=A^{\mathsf T}$  real matrix. The information it gives is particularly clean: the eigenvalues are all real numbers, and the eigenvectors can be selected in pairs. **orthogonal** (orthogonal) and the length is  $1$.

These two facts taken together allow the diagonalization of ordinary  $A=S\Lambda S^{-1}$  upgraded to



$$
A=Q\Lambda Q^{\mathsf T},
$$



Among them  $Q$  columns **orthogonal** (orthonormal), while **orthogonal matrix** The inverse of an orthogonal matrix is exactly its transpose. This decomposition puts the "symmetry" in plain sight: taking the transpose of the entire product, $Q$  with  $Q^{\mathsf T}$  The positions are swapped and the matrix is returned unchanged. it is called in mathematics **spectrum theorem** (spectral theorem), called the principal axis theorem in mechanics. By splitting the product by columns and rows, you can also read its second statement: a symmetric matrix is ​​a weighted sum of several mutually perpendicular projection matrices, and the weight is the eigenvalue.

This lecture will also answer three progressive questions. First, what guarantees that the eigenvalues ​​are real numbers? A very short proof can be given using complex conjugate, and the "square of the length of a complex vector" that appears will be used repeatedly in the next lecture. Second, since the eigenvalues ​​are all real numbers, can we know how many positive and how many negative ones there are without using the characteristic equation? Yes, see **pivot** (pivot) symbol. Third, taking "all eigenvalues are positive" as the definition, we get **Positive definite matrix** (positive definite matrix) A top-notch subclass of this symmetric matrix; it is equivalent to "all pivots are positive" and also equivalent to "all pivots are positive"**sequential subject form** (leading principal minor) is positive”. The pivots of the first week, the determinants in the middle of the course, and the eigenvalues ​​of the last few lectures are combined into one thing for the first time.

![Official Handout Summary Page 1/3](</attachments/mit1806-43068189d8dcb9207f419c6d.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 25 Summary, CC BY-NC-SA 4.0).*

## 1. Two basic facts and spectral theorem

This section first states the conclusion, then explains the meaning of each word, and finally writes them into a matrix equation.

**Fact 1: The eigenvalues of a real symmetric matrix are all real numbers.**  We have seen before that the rotation matrix gives complex eigenvalues: plane rotation  $90^\circ$  The matrix turns each non-zero vector out of its original direction, and the characteristic equation has no real roots. This situation does not happen with symmetric matrices.

**Fact 2: The eigenvectors of a real symmetric matrix can be chosen to be perpendicular to each other.**  The four words "can be chosen" cannot be omitted. Identity matrix  $I$  is symmetric, and its eigenvalues are all  $1$, and every non-zero vector is an eigenvector - facing the entire space, it makes no sense to say "eigenvectors are vertical". The precise meaning is: if the eigenvalues ​​are different from each other, each eigenvalue only corresponds to one eigenvector straight line, and these straight lines are automatically perpendicular in pairs; if a certain eigenvalue is repeated, the corresponding eigenvectors are spread out on a whole plane (or a higher-dimensional subspace), and a set of mutually perpendicular vectors can always be picked out in this plane. extreme case  $I$  It is the repetition of "the entire space", and of course the orthonormal basis can be selected from it. Therefore, what a symmetric matrix has is not "any set of eigenvectors are vertical", but "there is a set of complete and mutually perpendicular eigenvectors".

The complete set of eigenvectors means that it can be diagonalized, so the usual writing method holds:



$$
A=S\Lambda S^{-1},
$$



Among them  $S$  The columns of are feature vectors, $\Lambda$  is a diagonal matrix, and the diagonal elements are the corresponding eigenvalues. In the case of symmetric matrices, these columns can also be shortened to unit vectors; vertically plus units, they are orthonormal. The column vector orthogonal matrix convention is written as  $Q$ (Later in this lesson  $Q$  always represents this kind of matrix), so  $S$  Replace with  $Q$:



$$
A=Q\Lambda Q^{\mathsf T}.
$$



Two substitutions have been made here: $S$  Replace with  $Q$, $S^{-1}$  Replace with  $Q^{\mathsf T}$. The second point is true because the standard orthogonal column satisfies  $Q^{\mathsf T}Q=I$: By matrix multiplication, $Q^{\mathsf T}Q$  of  $(i,j)$  The element is  $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_j$, standard orthogonality makes it in  $i=j$  time is  $1$, in  $i\neq j$  time is  $0$. For square matrices of the same order, $Q^{\mathsf T}Q=I$  It is enough to explain  $Q^{\mathsf T}=Q^{-1}$——You don’t need to calculate the inverse, just transpose it.

This decomposition has an immediately detectable property: it must be symmetrical.



$$
(Q\Lambda Q^{\mathsf T})^{\mathsf T}
=Q\Lambda^{\mathsf T}Q^{\mathsf T}
=Q\Lambda Q^{\mathsf T}.
$$



Used in the middle step  $\Lambda$  It is a diagonal matrix, and the diagonal elements are all real numbers, which remain unchanged after transposition. In turn, every symmetric matrix can be written in this form, so "is a symmetric matrix" and "can be decomposed into  $Q\Lambda Q^{\mathsf T}$"It's the same thing.

**Names and geometric meanings.** A "spectrum" is the entire set of eigenvalues. The name is borrowed from the spectrum: a beam of white light can be decomposed into a number of pure colors, and a symmetric matrix can also be decomposed into a number of "pure" characteristic directions, each direction carrying a real weight.  $\lambda_i$. It’s called the principal axis theorem in mechanics, and it means the same thing: Materials are easiest to describe under the appropriate coordinate axes (principal axes), and there are no cross-terms on that set of axes; in matrix terms, after switching to this set of axes, the matrix becomes a diagonal shape, and the directions are not coupled to each other.

![Video 00:06:35: Classroom blackboard writing](</attachments/mit1806-f7fcdcefd5309260a5a26f68.jpg>)

*Video 00:06:35 \| Approximately corresponding to Section 1 "1. Two basic facts and the spectral theorem".*

## 2. Why are eigenvalues real numbers?

This section only does one thing: prove fact one. The starting point is only  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, allow now  $\lambda$  with  $\boldsymbol{x}$  They are all complex numbers - just because you want a real number, you don't presuppose it is a real number.

The first step is to take the complex conjugate of the entire equation. Conjugation is compatible with addition, subtraction, and multiplication, that is,  $\overline{ab}=\bar a\,\bar b$, $\overline{a+b}=\bar a+\bar b$, so it can be conjugated term by term. And because  $A$  is a real matrix and remains unchanged after element-by-element conjugation, so  $\bar A=A$, got



$$
A\bar{\boldsymbol{x}}=\bar\lambda\,\bar{\boldsymbol{x}}.
$$



This step does not use symmetry, but it has already been explained: if a real matrix has complex eigenvalues  $\lambda$, then  $\bar\lambda$  is also an eigenvalue (the eigenvector is  $\bar{\boldsymbol{x}}$), complex eigenvalues appear in pairs.

The second step is to transpose the conjugated equation and then right-multiply both sides.  $\boldsymbol{x}$:



$$
\bar{\boldsymbol{x}}^{\mathsf T}A^{\mathsf T}
=\bar\lambda\,\bar{\boldsymbol{x}}^{\mathsf T},
\qquad\Longrightarrow\qquad
\bar{\boldsymbol{x}}^{\mathsf T}A^{\mathsf T}\boldsymbol{x}
=\bar\lambda\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}.
$$



Symmetry is used here for the first and only time: $A^{\mathsf T}=A$, so the left end is  $\bar{\boldsymbol{x}}^{\mathsf T}A\boldsymbol{x}$.

The third step is to return to the original equation  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, left multiplied by row vectors on both sides  $\bar{\boldsymbol{x}}^{\mathsf T}$, got



$$
\bar{\boldsymbol{x}}^{\mathsf T}A\boldsymbol{x}
=\lambda\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}.
$$



If the left ends of the two expressions are the same, compare the right ends to get



$$
(\lambda-\bar\lambda)\,\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=0.
$$



Step 4, explain  $\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}\neq 0$. Set  $\boldsymbol{x}$  The component is  $x_i=a_i+\mathrm{i}b_i$, then



$$
\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}
=\sum_{i=1}^{n}\bar x_i x_i
=\sum_{i=1}^{n}(a_i^{2}+b_i^{2}).
$$



Multiply one by one: $(a_i-\mathrm{i}b_i)(a_i+\mathrm{i}b_i)=a_i^{2}+b_i^{2}$, two imaginary parts  $-\mathrm{i}a_ib_i$  with  $+\mathrm{i}a_ib_i$  offset. This is exactly the square of the length of a complex vector. The square length of the real number is  $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}=\sum x_i^{2}$;Changed to a complex number, each component must be multiplied by its own conjugate, so that the result is guaranteed to be a non-negative real number. As long as  $\boldsymbol{x}\neq\boldsymbol{0}$ (Eigenvectors are not zero by definition), this sum is strictly greater than zero. So you can make an appointment and get  $\lambda=\bar\lambda$;A number is equal to its own conjugate, indicating that the imaginary part is zero, $\lambda$  is a real number.

A final inventory of where symmetry comes in handy. If  $A$  is a complex matrix, the step of transposing should be written as  $\bar A^{\mathsf T}$; What allows the second step to directly follow the third step is exactly  $\bar A^{\mathsf T}=A$. for real matrices  $\bar A=A$, the condition degenerates into  $A^{\mathsf T}=A$, that is, symmetry. So the general version of a "good matrix" is one that satisfies  $\bar A^{\mathsf T}=A$  The complex matrix (system processing in the next lecture); most matrices in applications are real, and in this case "good" equals "symmetric".

![Video 00:11:13: Classroom blackboard writing](</attachments/mit1806-2902ebe1488ef44f551e5bff.jpg>)

*Video 00:11:13 \| Approximately corresponding to Section 2 "2. Why are eigenvalues real numbers".*

![Video 00:16:40: Classroom blackboard writing](</attachments/mit1806-d94ce77552c9fff5de0d0a9f.jpg>)

*Video 00:16:40 \| Approximately corresponding to Section 2 "2. Why are eigenvalues real numbers".*

## 3. The other side of the spectrum theorem: weighted sum of projection matrices

Previous section  $A=Q\Lambda Q^{\mathsf T}$  as a whole equation. Now take multiplication apart and see what it is made of. Expand by "column times row": $Q\Lambda$  of the  $i$  Column is  $\lambda_i\boldsymbol{q}_i$, then multiply  $Q^{\mathsf T}$ (its the  $i$  OK  $\boldsymbol{q}_i^{\mathsf T}$), get



$$
A=\sum_{i=1}^{n}\lambda_i\,\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}.
$$



every item  $\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$  All one  $n\times n$  Matrix, identity is very special. The projection formula given in Lecture 15 is  $P=B(B^{\mathsf T}B)^{-1}B^{\mathsf T}$; put here  $B$  into a separate column  $\boldsymbol{q}_i$, the length is  $1$, so  $\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i=1$, the denominator disappears:



$$
P_i=\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}.
$$



This is exactly what is projected onto  $\boldsymbol{q}_i$  on a straight line **projection matrix** (projection matrix). It's symmetrical and remains unchanged when reprojected:



$$
P_i^{2}
=\boldsymbol{q}_i(\boldsymbol{q}_i^{\mathsf T}\boldsymbol{q}_i)\boldsymbol{q}_i^{\mathsf T}
=\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}
=P_i .
$$



And because  $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$  Perpendicular to each other, the straight lines projected by these projections are also perpendicular to each other. So the spectral theorem has a second version: **Each symmetric matrix is the weighted sum of several mutually perpendicular projection matrices, and the weight is the eigenvalue.**  A term with a negative weight means that the component is reversed in that direction. Some people prefer to use this version of the notation theorem: it breaks the matrix into "purely directional" contributions, with each term describing the effect in only one direction.

## 4. The sign distribution of the pivot corresponds to the sign distribution of the eigenvalues

After knowing that the eigenvalues are all real numbers, the next question is whether they are positive or negative. Why Care About Positive and Negative: In Differential Equations  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$  Here, if the eigenvalue is negative, the solution decays and the system is stable; if the eigenvalue is regular, the solution diverges, and the sign directly corresponds to stability and instability.

The trouble is that judging symbols should not rely on calculating eigenvalues. one  $50$  The order symmetric matrix has  $50$  eigenvalues; if you press "Find  $\det(A-\lambda I)$  To do this, we need to develop a  $50$  Then find the roots of the degree polynomial. Of course it can’t be done by hand; it’s also unreliable if left to a computer—high-order polynomials are extremely sensitive to small perturbations in coefficients, and the calculated  $50$  The root is very untrustworthy. It can be seen that "finding roots using characteristic polynomials" is just  $2\times2$, $3\times3$  A good method, not a good method for general matrices. However, elimination only involves division and subtraction, which can be completed instantly on a computer. The pivot calculation is fast and stable.

A beautiful fact in this lecture is: for symmetric matrices, **The number of positive pivots is equal to the number of positive eigenvalues, and the number of negative pivots is equal to the number of negative eigenvalues.**. Note that the pivot and the eigenvalue themselves are not equal, they only match the sign and number; the only equality relationship that can be asserted in advance is the product - when eliminating elements in order and not exchanging rows, $n$  The product of pivot elements is equal to the determinant, and  $n$  The product of the eigenvalues is also equal to the determinant, so the product of the two is the same. But that's just a total, the facts above give a symbol-by-symbol distribution. For example a  $50$  order symmetric matrix, if we count  $28$  a positive main element, $22$  If there is a negative pivot element, we can conclude that it has  $28$  a positive eigenvalue, $22$  negative eigenvalues without having to calculate any of them.

This fact can also be used to "locate" feature values. Translate the matrix: $A-7I$  with  $A$  have the same eigenvectors, the eigenvalues are subtracted as a whole  $7$. So count  $A-7I$  If there are several positive pivot elements, we can know how many eigenvalues of the original matrix are greater than  $7$, the rest are less than  $7$. Change a few translation amounts, $50$  Each eigenvalue is framed into several intervals respectively, which is a reliable starting point for finding eigenvalues.

![Official Handout Summary Page 2/3](</attachments/mit1806-586a88a3b8d4f772f0b3171a.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 25 Summary, CC BY-NC-SA 4.0).*

![Video 00:23:06: Classroom blackboard writing](</attachments/mit1806-5f9087f55c5f6df9619b58d5.jpg>)

*Video 00:23:06 \| Approximately corresponding to Section 4 "4. The sign distribution of the pivot corresponds to the sign distribution of the eigenvalues".*

![Video 00:28:31: Classroom blackboard writing](</attachments/mit1806-9f5f0f2385e45a40110c1354.jpg>)

*Video 00:28:31 \| Approximately corresponding to Section 4 "4. The sign distribution of the pivot corresponds to the sign distribution of the eigenvalues".*

## 5. Positive definite matrix

Symmetric matrices are already "good" matrices, **Positive definite matrix** It is one of the "excellent" categories.

**Definition: A symmetric matrix is called a positive definite matrix if all its eigenvalues are positive.**

The first equivalence condition immediately follows from the facts in the previous section: **All pivots are positive**. This is exactly the criterion used in practice - there is no need to find the eigenvalues, just do one elimination and look at the sign of the pivot.

Example is



$$
A=\begin{bmatrix}
5&2\\
2&3
\end{bmatrix}.
$$



It is symmetric and the eigenvalues must be real numbers. The first pivot is  $5$;The second pivot does not need to be calculated separately, because the product of the pivots is equal to the determinant:



$$
\det A=5\cdot 3-2\cdot 2=11,
\qquad
\text{第二个主元}=\frac{11}{5}.
$$



two pivots  $5$  with  $11/5$  are both positive, so both eigenvalues are positive, $A$  Right concentration.

Then use the eigenvalues to compare. The trace is  $5+3=8$, the determinant is  $11$, the characteristic equation is



$$
\lambda^{2}-8\lambda+11=0,
$$



The solution is



$$
\lambda=\frac{8\pm\sqrt{64-44}}{2}=4\pm\sqrt{5},
$$



approx.  $6.24$  with  $1.76$, are indeed all positive numbers. Compare the costs: the pivot is two simple fractions  $5$, $11/5$, the eigenvalue has a root sign; only the former is needed to judge whether it is positive or negative. In differential equations, knowing the sign is enough to judge stability, so the pivot criterion is far more economical than finding the eigenvalues. These two eigenvalues ​​are not equal. According to fact 2, their corresponding eigenvectors fall on two mutually perpendicular straight lines.

**It is not enough that the determinant is positive.**  A common misconception is that "$\det A=\lambda_1\lambda_2>0$, so both eigenvalues are positive." The product of two numbers with the same sign is of course positive, but "same negative" is also satisfied. Let’s look at a counterexample: the first pivot of a certain symmetric matrix is  $-1$, and the overall determinant is  $3$, is a positive number. Since the product of pivot components is equal to the determinant, the second pivot component is  $-3$. Both pivots are negative, and according to the sign facts in the previous section, both eigenvalues ​​are also negative. The determinant of this matrix is ​​positive, but it is obviously not positive definite.

Therefore, the inspection should be carried out "from small to large". In addition to the determinant of the entire matrix, we also need to check the determinant of each order sub-matrix in the upper left corner——$1\times1$  of, $2\times2$  of, until  $n\times n$ , they are called **sequential subject form**. The criteria for positive determination are: **All sequential principals are positive**. The two ends of this chain are easy to recognize: the first-order sequential principal is the first pivot, $n$  The principal subform of the order sequence is the entire determinant, and the intermediate steps are just supplemented by the test of "gradually growing out", so the principal component and the determinant are connected into one line.

Check with examples: $A$  The first-order sequential main formula of is  $5>0$, the second order is  $11>0$, passes; the counterexample fails at first order, because  $-1<0$, although the second-order  $3>0$  Satisfies "the overall determinant is positive". This is why "all" is used in the criterion: it requires  $n$  All the numbers are positive, instead of just looking at the last big determinant.

![Video 00:32:54: Classroom blackboard writing](</attachments/mit1806-efd53e29d7863e5284ae741e.jpg>)

*Video 00:32:54 \| Approximately corresponding to Section 5 "5. Positive Definite Matrix".*

![Video 00:34:13: Classroom blackboard writing](</attachments/mit1806-061c8d50e8cffb86944b36a0.jpg>)

*Video 00:34:13 \| Approximately corresponding to Section 5 "5. Positive Definite Matrix".*

## 6. Three clues converge

The positive definite matrix is the climax of this lecture, not because it adds another definition, but because it combines three originally separate clues in the course into one thing:

- first week **pivot**: Appears during the elimination process  $n$  number;
- mid-course **determinant**: Taken all the way from the upper left corner  $n$  a sequence subject form;
- The last few lectures **eigenvalue**: $n$  real eigenvalues.

For symmetric matrices, these three sets of numbers can be mutually determined: the eigenvalues are all positive, the pivots are all positive, and the sequential principal subforms are all positive. The three are equivalent to each other. If any one group is all positive, the other two groups are also all positive; if any group has a negative sign, there must be something wrong with the other two groups. In other words, "right concentration" can be said in three completely different languages ​​and they all mean the same thing. This is also the reason why the title of this lecture juxtaposes "symmetry" and "positive definiteness": symmetry ensures that the eigenvalues ​​fall on the real number axis, and positive definiteness nails the symbols of this group of real numbers.

The following route is also clear from this: the next lecture extends the same idea to complex matrices and fast Fourier transforms, and the final climax of the course is to integrate all the clues into the general  $n$  Square matrix - no symmetry required.

![Official Handout Summary Page 3/3](</attachments/mit1806-840ecab00e5aa62294c1f4ac.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 25 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **symmetric matrix** (symmetric matrix) satisfies  $A=A^{\mathsf T}$. Two basic facts: eigenvalues ​​are all real numbers; eigenvectors can be selected as a set of complete and orthogonal vectors.
- "Can be selected" cannot be omitted: each non-zero vector of the unit matrix is an eigenvector; when the eigenvalues are repeated, they correspond to an entire plane, and a group that is perpendicular to each other can always be picked out in the plane.
- **spectrum theorem**: The symmetric matrix can be written as  $A=Q\Lambda Q^{\mathsf T}$, $Q$  The columns of are orthogonal, $Q^{-1}=Q^{\mathsf T}$;The transpose of the entire product is returned unchanged, so this form is automatically symmetric, which in turn characterizes a symmetric matrix.
- Proof that the eigenvalues are real: by  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  Take the conjugate to get  $A\bar{\boldsymbol{x}}=\bar\lambda\bar{\boldsymbol{x}}$; transpose and right multiply  $\boldsymbol{x}$, use  $A^{\mathsf T}=A$, and then left multiplied by the original formula  $\bar{\boldsymbol{x}}^{\mathsf T}$  Comparing the results, we get  $(\lambda-\bar\lambda)\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=0$, while  $\bar{\boldsymbol{x}}^{\mathsf T}\boldsymbol{x}=\sum(a_i^{2}+b_i^{2})>0$.
- The "good" condition for the complex matrix case is  $\bar A^{\mathsf T}=A$, real symmetry is just a real special case of it; symmetry only exists when  $A^{\mathsf T}$  Replace with  $A$  used in that step.
- **spectral decomposition**: $A=\sum_i\lambda_i\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$;each  $\boldsymbol{q}_i\boldsymbol{q}_i^{\mathsf T}$  is projected onto  $\boldsymbol{q}_i$  The projection matrix of the direction satisfies  $P_i^{2}=P_i$, and the direction of projection is perpendicular to each other.
- The number of positive pivots of a symmetric matrix is equal to the number of positive eigenvalues, and the same is true for the number of negative pivots; the product of the two is equal because the product of the pivots and the product of the eigenvalues is equal to the determinant.
- Use translation  $A-7I$ (The overall eigenvalue is reduced by  $7$) number pivot symbol, you can count how many eigenvalues of the original matrix are greater than  $7$.
- **Positive definite matrix**: Symmetric and all eigenvalues are positive; equivalent to all pivots being positive, also equivalent to all **sequential subject form** is positive.
- Example  $A=\begin{bmatrix}5&2\\2&3\end{bmatrix}$:pivot  $5$, $11/5$  All are positive, eigenvalues  $4\pm\sqrt{5}\approx 6.24,\,1.76$  are all positive; the first subject of the counterexample is  $-1$, the overall determinant is  $3$, so the second pivot is  $-3$, both eigenvalues are negative - a positive overall determinant does not guarantee positive definiteness.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| symmetric matrix | symmetric matrix | satisfy  $A=A^{\mathsf T}$  is a real matrix, the eigenvalues are real, and the eigenvectors can be chosen to be perpendicular to each other. |
| spectral theorem | spectrum theorem | Decomposition of symmetric matrices  $A=Q\Lambda Q^{\mathsf T}$, $Q$  Column orthonormal |
| principal axis theorem | Principal Axis Theorem | The name of the spectrum theorem in mechanics: after changing to the main axis, the matrix becomes diagonal, and the directions are not coupled to each other. |
| spectrum | Spectrum | The total eigenvalues of the matrix, the name is borrowed from the decomposition of the spectrum |
| orthonormal | orthogonal | Pairs are orthogonal and both have lengths  $1$  a set of vectors |
| orthogonal matrix | orthogonal matrix | Column vector orthonormal square matrix  $Q$, satisfy  $Q^{\mathsf T}Q=I$, so  $Q^{-1}=Q^{\mathsf T}$ |
| projection matrix | projection matrix | shaped like  $\boldsymbol{q}\boldsymbol{q}^{\mathsf T}$  symmetric idempotent matrix of , cast the vector to  $\boldsymbol{q}$  The straight line |
| complex conjugate | complex conjugate | put  $a+\mathrm{i}b$  become  $a-\mathrm{i}b$; Used to eliminate the imaginary part when proving real eigenvalues |
| pivot | pivot | The key number used to eliminate the lower elements in elimination; the number of symbols in the pivot element of a symmetric matrix is consistent with the eigenvalue |
| positive definite | positive definite | Symmetric and all eigenvalues are positive, which is equivalent to all principal components and all sequential principal expressions being positive. |
| leading principal minor | sequential subject form | upper left corner  $1\times1$  Arrive  $n\times n$  The determinants of sub-matrices of each order are all positive definite regular matrices. |
| determinant | determinant | The product of the principal components and the product of the eigenvalues is equal to it, but it cannot be determined to be positive just because it is positive. |

---

[← Lecture 24b](/en/notes/mit-1806/lec24b) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 26 →](/en/notes/mit-1806/lec26)
