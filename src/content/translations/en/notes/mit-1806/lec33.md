---
kind: notes
source: mit-1806/lec33
title: Lecture 33 · Left inverse, right inverse and pseudo inverse
description: Understand left inverse, right inverse and pseudo inverse, and deal
  with generalized inverse of rectangular matrices.
sourceHash: 1329f7b91a69816c1d9c7d71460f8a1d92b67709612daf6fe57e51a2a2092354
publish: true
translationMethod: machine-assisted
---

> *Left and right inverses; pseudoinverse* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 33 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p34 · Left inverse, right inverse and pseudo inverse](https://www.bilibili.com/video/BV1ix411f7Yp?p=34)(41:53)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-33-left-and-right-inverses-pseudoinverse/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=34&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lectures, I drew the same picture repeatedly: $m\times n$  matrix  $A$  put  $\mathbb{R}^n$  divided into **row space** (row space) and **null space** (nullspace), put  $\mathbb{R}^m$  divided into **column space** (column space) and **left null space** (left nullspace); line space and null space are mutually exclusive **orthogonal complement** (orthogonal complement), the column space and the left null space are also orthogonal complements of each other. The dimensions of the four subspaces are  $r$, $n-r$, $r$, $m-r$, among which  $r$  is **rank** (rank). This lecture starts from this picture and answers a question: to what extent can the "inverse" of a matrix be defined.

The source of the problem lies in the two null spaces on the graph. For a matrix that compresses non-zero vectors into zero vectors, no "inverse" can save it from zero; so whether the inverse exists depends on whether there are only zero vectors left in the two zero spaces. $r=m=n$  when they all disappear, $A$  There are the usual **Bilateral inversion**(two-sided inverse).$r=n<m$  When the null space disappears and the left null space remains, $A$  can only have **Left reverse** (left inverse): multiply back from the left **identity matrix** (identity matrix), multiplying from the right does not work. $r=m<n$  Exactly mirrored, only **right inverse** (right inverse). The most general  $r<m$  and  $r<n$  Neither inverse exists, but  $A$  There is still a one-to-one correspondence between row space and column space. If this correspondence is reversed, we get **pseudoinverse**(pseudoinverse)$A^{+}$.

The three parts correspond to the three "inverses". The left inverse and the right inverse are a summary of the previous content, and the criteria are all  $r$  with  $m,n$  The relationship, the formulas are all  $A^{\mathsf T}A$  with  $AA^{\mathsf T}$  These two "good matrices"; the pseudo-inverse extends this classification to the general situation, which can be found in any matrix; **singular value decomposition** (singular value decomposition, SVD) explains why the pseudo-inverse is almost effortless to calculate - move it to a diagonal matrix (diagonal matrix), and only need to take the reciprocal of the non-zero singular values.

![Official Handout Summary Page 1/3](</attachments/mit1806-6ac9902eb1ce2e508dee65be.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 33 Summary, CC BY-NC-SA 4.0).*

## 1. Four situations: looking at the inverse from four basic subspaces

put  $m\times n$, rank is  $r$  The matrix press  $r$  with  $m,n$  The relationship classification, the inverse problem becomes four judgment questions. The first three are situations that have been dealt with earlier in the course, and the fourth is the main topic of this lecture.

**Situation one: $r=m=n$.**  The square array is at full rank. The line space is the entire  $\mathbb{R}^n$, the column space is the entire  $\mathbb{R}^m$, both null spaces have only zero vectors. The existence matrix makes



$$
A^{-1}A=AA^{-1}=I,
$$



Both left multiplication and right multiplication return to the identity matrix. This is the usual inverse matrix, and it is also the most beautiful case of the word "full rank".

**Scenario 2: $r=n<m$.** **Full rank**(full column rank): $n$  Columns are linearly independent and rows are mostly related to each other. The null space has only zero vectors, and the row space dimension is  $n$, that is, the entire  $\mathbb{R}^n$;The column space only occupies  $\mathbb{R}^m$  one of  $n$  dimensional subspace. Because the null space is  $\{\boldsymbol{0}\}$, $A\boldsymbol{x}=\boldsymbol{b}$  If there is a solution, it must be unique - all other solutions must be obtained by adding vectors in the null space, where there is nothing to add. But the rows may be related, and elimination will produce zero rows, so some right-hand sides have no solution: there are only "zero or one" solutions.

**Scenario three: $r=m<n$.** **Full of rank**(full row rank): $m$  The rows are linearly independent, and there are only zero vectors in the left null space. Elimination will never result in zero rows, $A\boldsymbol{x}=\boldsymbol{b}$  for each  $\boldsymbol{b}$  can be solved; but the null space dimension is  $n-m>0$, there is  $n-m$  a **free variable** (free variable), there are infinite solutions, and the solution set is "a special solution plus the entire null space".

**Scenario four: $r<m$  and  $r<n$.**  Both null spaces exist, and the dimensions are  $n-r$  with  $m-r$. Neither inverse can be created, but the matrix still maps well between row space and column space. The first three situations are actually degenerate situations in which the null space on this picture disappears in turn, and the fourth situation is the general rule.

Looking at it from another angle, the difference between the four situations can be summarized by two yes-or-no questions: whether the left null space is zero determines "$A\boldsymbol{x}=\boldsymbol{b}$  to which  $\boldsymbol{b}$ "There is a solution"; whether the null space is zero determines "whether the solution is unique when there is a solution". The four situations are a combination of yes and no from these two questions. The four rows combined cover  $r$  All possible values of , so this classification table is equivalent to an index of the entire course: see  $r,m,n$, the solution structure and usable formulas are determined.

![Video 00:04:11: Classroom blackboard writing](</attachments/mit1806-73992d107adefaf0c71bcfad.jpg>)

*Video 00:04:11 \| Approximately corresponding to section 1 "1. Four situations: looking at the inverse from the four basic subspaces".*

## 2. Left inverse: column full rank

In case 2, we need to create a "take it from the left" $A$  To pull back the "unit matrix" matrix, you must first have an invertible square matrix, and what is available here is  $A^{\mathsf T}A$.

$A^{\mathsf T}A$  is  $n\times n$  symmetric matrix. It is reversible when the column is of full rank, and the reason is only one line: if  $A^{\mathsf T}A\boldsymbol{x}=\boldsymbol{0}$, multiply left by both sides  $\boldsymbol{x}^{\mathsf T}$, got



$$
\boldsymbol{x}^{\mathsf T}A^{\mathsf T}A\boldsymbol{x}=(A\boldsymbol{x})^{\mathsf T}(A\boldsymbol{x})=\|A\boldsymbol{x}\|^2=0,
$$



thus  $A\boldsymbol{x}=\boldsymbol{0}$;Full column rank means that there are only zero vectors in the null space, so  $\boldsymbol{x}=\boldsymbol{0}$.$n\times n$  The null space of a matrix contains only zero vectors, so it is invertible. This fact lies in **least squares** (least squares) is the core: the coefficient matrix of the entire theory is  $A^{\mathsf T}A$, and the condition for its reversibility happens to be  $A$  The columns are irrelevant.

put  $(A^{\mathsf T}A)^{-1}$  with  $A^{\mathsf T}$  Multiply in the order of "first transpose, then inverse" to get



$$
A^{-1}_{\mathrm{left}}=(A^{\mathsf T}A)^{-1}A^{\mathsf T},
$$



this is a  $n\times m$  matrix. To verify that it is the left inverse, put  $A$  Just multiply on the right:



$$
(A^{\mathsf T}A)^{-1}A^{\mathsf T}A=(A^{\mathsf T}A)^{-1}(A^{\mathsf T}A)=I_n.
$$



The brackets make exactly one pair, $n\times n$  Multiply the invertible matrix by its own inverse to get the identity matrix. Note that the last one that falls back is  $n$  Dimensional space: $A$  First  $\mathbb{R}^n$  delivered to  $\mathbb{R}^m$, $A^{\mathsf T}$  bring it back  $\mathbb{R}^n$, $(A^{\mathsf T}A)^{-1}$  again  $\mathbb{R}^n$  Final adjustments to the interior.

Just changing the order won't work. $A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  is  $m\times m$  The matrix of is impossible to be  $I_n$, the size is wrong first; more essentially, $A$  The column space is just  $\mathbb{R}^m$  in  $n$  dimensional subspace, $A$  put the whole  $\mathbb{R}^n$  are all pressed into this subspace, and when we ride back, we can only  $\mathbb{R}^m$  When projected into column space, there is no way to recover the components falling outside the subspace. This matrix has a name:



$$
P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}.
$$



It acts on vectors in column space and changes nothing - if  $\boldsymbol{y}=A\boldsymbol{x}$, then  $P\boldsymbol{y}=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}A\boldsymbol{x}=A\boldsymbol{x}=\boldsymbol{y}$; Acts on the vector in the left null space and wipes it to zero - if  $A^{\mathsf T}\boldsymbol{z}=\boldsymbol{0}$, then  $P\boldsymbol{z}=A(A^{\mathsf T}A)^{-1}\boldsymbol{0}=\boldsymbol{0}$. It is identical in the column space and zero in the left null space. This is exactly the answer to the column space. **projection** (projection). It "wanted" to be the identity matrix, but unfortunately  $A$  just gave it  $n$  Wei's room for action. A useful observation by the way: $P$  The rank is equal to  $n$, its null space is exactly  $A$  The left null space of: $P\boldsymbol{z}=\boldsymbol{0}$  with  $A^{\mathsf T}\boldsymbol{z}=\boldsymbol{0}$  are mutually sufficient and necessary conditions. Projection handle  $\mathbb{R}^m$  The vector in is pressed to  $n$  In the dimensional space, the suppressed part is the left null space.

The left inverse is generally not unique; $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  It's just the most common and neatest among them. Also note that the status of the two "good matrices" in this situation is not equal: $A^{\mathsf T}A$  is  $n\times n$  and reversible, $AA^{\mathsf T}$  But it is  $m\times m$, rank only  $n<m$, still strange. Which one is reversible, just look  $r$  is equal to  $n$  Still equal to  $m$.

![Video 00:09:51: Classroom blackboard writing](</attachments/mit1806-e27220a7c0b4a81f362af313.jpg>)

*Video 00:09:51｜Approximately corresponding to section 2 "2. Left inverse: full rank".*

## 3. Right reverse: full rank

By reversing the roles of rows and columns, Scenario 3 leads to completely parallel conclusions. This time the invertible "good matrix" is  $AA^{\mathsf T}$: it is  $m\times m$  is a symmetric matrix with full row rank to ensure that it is invertible. The reason is the same as in the previous section. Just put  $A$  Replace with  $A^{\mathsf T}$. Take the inverse and multiply it  $A^{\mathsf T}$, get



$$
A^{-1}_{\mathrm{right}}=A^{\mathsf T}(AA^{\mathsf T})^{-1},
$$



This is  $n\times m$  matrix. Verify:



$$
A\,A^{\mathsf T}(AA^{\mathsf T})^{-1}=I_m,
$$



This time the identity matrix is  $m\times m$, exactly symmetrical to the left inverse case.

Changing the order also only results in projection. Put the right side reverse to the left side,



$$
A^{\mathsf T}(AA^{\mathsf T})^{-1}A
$$



is  $n\times n$  matrix. It is identical in row space: any vector in row space can be written as  $A^{\mathsf T}\boldsymbol{u}$, so



$$
A^{\mathsf T}(AA^{\mathsf T})^{-1}A\,A^{\mathsf T}\boldsymbol{u}
=A^{\mathsf T}(AA^{\mathsf T})^{-1}(AA^{\mathsf T})\boldsymbol{u}
=A^{\mathsf T}\boldsymbol{u};
$$



It is zero in the null space: if  $A\boldsymbol{x}=\boldsymbol{0}$, then  $A^{\mathsf T}(AA^{\mathsf T})^{-1}A\boldsymbol{x}=\boldsymbol{0}$. So it's a projection into row space. Dually, this  $n\times n$  The rank of the projection is  $m$, the null space is exactly  $A$  of null space. The right inverse is also not unique, $A^{\mathsf T}(AA^{\mathsf T})^{-1}$  Just the most commonly used one; and the reversible one in this case is  $AA^{\mathsf T}$, $A^{\mathsf T}A$  is  $n\times n$, rank only  $m<n$, already strange.

There is one more practical difference between the two cases, and it lies in the solution set. When the columns are of full rank, the solutions are "zero or one", and when the rows are of full rank, the solutions are "infinitely many" and there is a solution for each right end. The reason lies in the number of free variables: $n$  in variables  $r$  is the main variable, and the remaining  $n-r$  free variable; case 2  $n-r=0$, situation three miles  $n-r=n-m>0$.

The right inverse also has a direct use: it gives a special solution when the rows are of full rank. take



$$
\boldsymbol{x}=A^{\mathsf T}(AA^{\mathsf T})^{-1}\boldsymbol{b},
$$



Take left on both sides  $A$, got  $A\boldsymbol{x}=AA^{\mathsf T}(AA^{\mathsf T})^{-1}\boldsymbol{b}=\boldsymbol{b}$, indeed satisfies the equation. This special solution is not the entire solution: adding any vector in the null space is still a solution, and the null space has  $n-m$  dimension, so there are infinitely many solutions. The left-inverse situation is dual to this: when the column is of full rank  $A\boldsymbol{x}=\boldsymbol{b}$  There is at most one solution. If the solution exists, use the left inverse action on  $\boldsymbol{b}$  You can figure it out, but not everyone  $\boldsymbol{b}$  There are solutions.

![Video 00:12:34: Classroom blackboard writing](</attachments/mit1806-52b8475947814d2ec61f668e.jpg>)

*Video 00:12:34｜Approximately corresponds to section 3 "3. Right reverse: row full rank".*

## 4. Why does a rectangular matrix not have a two-sided inverse?

Putting the four situations together, a structural fact emerges: **As long as  $n\neq m$, $A$  There can be no bilateral inversion**.

The reason is in the base diagram. $A$  The null space dimension of is  $n-r$, the left null space dimension is  $m-r$;when  $n\neq m$  When , these two numbers cannot be zero at the same time, that is to say  $A$  with  $A^{\mathsf T}$  At least one of them has a non-zero null space. The direction in that null space has been completely killed by the matrix, and no candidate inverse can restore it. Bilateral inverses naturally do not exist. In turn, $n=m$  and  $r=n$  When both null spaces are  $\{\boldsymbol{0}\}$, $A$  It is a reversible square matrix.

It is more intuitive to read from the picture: $r$  The larger the value, the narrower the two zero spaces are. $n-r$  with  $m-r$  decrease at the same time. For the inverse to exist, two zero spaces need to shrink to zero at the same time, which is only possible if  $m=n=r$  only possible; as long as  $m\neq n$, at most one of them can be squeezed out, and the null space on the other side must be left.

List this set of categories into a table:

| situation | rank | null space | left null space | Inverse type | formula |
| --- | --- | --- | --- | --- | --- |
| one | $r=m=n$ | $\{\boldsymbol{0}\}$ | $\{\boldsymbol{0}\}$ | Bilateral inversion | $A^{-1}$ |
| two | $r=n<m$ | $\{\boldsymbol{0}\}$ | Dimension  $m-n$ | Left reverse | $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| three | $r=m<n$ | Dimension  $n-m$ | $\{\boldsymbol{0}\}$ | right inverse | $A^{\mathsf T}(AA^{\mathsf T})^{-1}$ |
| Four | $r<m$  and  $r<n$ | Dimension  $n-r$ | Dimension  $m-r$ | Neither | $A^{+}$ |

The null space in the second row of the table is  $\{\boldsymbol{0}\}$, the left null space is non-zero, and the third line is just the opposite, so both the left and right inverses can still be defined; in the fourth line, both zero spaces are present, and both sides are blocked, leaving only the pseudo-inverse to be discussed in one section. The fourth line also shows that the pseudoinverse is not a patch: $r$  Can be compared  $m$  and  $n$  is any value small, the first three cases are just special cases when it happens to disappear in one or two null spaces. In other words, the "type" of the inverse is entirely determined by which null space disappears, whereas the projection matrix always appears in those rows where "the null space on the other side is still there." This table is also a table lookup tool: given  $r,m,n$, you can immediately determine which formula to use and whether the solution set is zero, one or infinite.

![Video 00:20:56: Classroom blackboard writing](</attachments/mit1806-b1ba75619df9803f89288d12.jpg>)

*Video 00:20:56 \| Approximately corresponding to Section 4 "4. Why there is no bilateral inverse of a rectangular matrix".*

![Official Handout Summary Page 2/3](</attachments/mit1806-6d769ce6588cbfbfb0ef4b24.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 33 Summary, CC BY-NC-SA 4.0).*

## 5. Pseudo-inverse: one-to-one correspondence from row space to column space

In case four, both zero spaces are present, and neither the left inverse nor the right inverse exists. But there is one fact that has not been used in the basic diagram: the dimensions of row space and column space are both  $r$, while  $A$  Send row space into column space. **in these two  $r$  between dimensional subspaces, $A$  is reversible**. This statement deserves its own proof.

Set  $\boldsymbol{x}$  with  $\boldsymbol{y}$  are in row space, and  $A\boldsymbol{x}=A\boldsymbol{y}$. transfer item  $A(\boldsymbol{x}-\boldsymbol{y})=\boldsymbol{0}$, so  $\boldsymbol{x}-\boldsymbol{y}$  Belongs to the null space; and because the row space is a subspace, $\boldsymbol{x}-\boldsymbol{y}$  Also belongs to line space. Row space and null space are orthogonal complements of each other, and the intersection only has zero vectors, so  $\boldsymbol{x}-\boldsymbol{y}=\boldsymbol{0}$. different vectors pass through  $A$  Still different after that, $A$  The restriction is injective on row space.

Both ends of the single shot are  $r$  dimensional space, so it is also surjective: every  $\boldsymbol{y}$  All come from unique vectors in vertical space. Surjection can also be verified directly: $\boldsymbol{y}$  In column space, it means that there is  $\boldsymbol{x}$  such that  $A\boldsymbol{x}=\boldsymbol{y}$; put  $\boldsymbol{x}$  Split into row space part and null space part according to orthogonal complement  $\boldsymbol{x}=\boldsymbol{x}_r+\boldsymbol{x}_n$, then  $A\boldsymbol{x}=A\boldsymbol{x}_r$, description  $\boldsymbol{y}$  is a row space vector  $\boldsymbol{x}_r$  like.

With this bijection, "inverse" can be defined wherever it can be defined. in column space  $\boldsymbol{y}$, order  $A^{+}\boldsymbol{y}$  is the only one in the row space that satisfies  $A\boldsymbol{x}=\boldsymbol{y}$  of  $\boldsymbol{x}$;For the left null space  $\boldsymbol{y}$, it is not in the column space at all, and there is no original image to be found, so let  $A^{+}\boldsymbol{y}=\boldsymbol{0}$. A general vector is decomposed according to the orthogonal complement of "column space component + left null space component" and then acts block by block; zeroing the left null space is not an arbitrary agreement, but is forced out: $A^{+}$  The value must fall in the row space, and the left null space and the column space are orthogonal complements of each other, and there is no original image in the direction there; if the non-zero  $\boldsymbol{y}\in N(A^{\mathsf T})$  Mapping into a non-zero vector, $A\boldsymbol{x}$  still can only fall in the column space, not zero  $\boldsymbol{y}$  Orthogonal to the column space, $A\boldsymbol{x}=\boldsymbol{y}$  Impossible. Got it this way  $A^{+}$  is  $n\times m$  matrix, and **Any matrix has a pseudoinverse**, including those matrices that have neither left nor right inverse.

$A$  with  $A^{+}$  Each is powerless against a piece of null space, and each erases another piece of null space, so the effects of the two composite mappings are completely determined:



$$
A^{+}A=\text{到行空间的投影},\qquad AA^{+}=\text{到列空间的投影}.
$$



The former is identical in the row space and zero in the null space, while the latter is identical in the column space and zero in the left null space. It's clearer to write this as a function of arbitrary vectors: $\mathbb{R}^n$  Take any of the  $\boldsymbol{x}$, divided into  $\boldsymbol{x}=\boldsymbol{x}_r+\boldsymbol{x}_n$, then  $A\boldsymbol{x}=A\boldsymbol{x}_r$, so



$$
A^{+}A\boldsymbol{x}=\boldsymbol{x}_r .
$$



compound mapping  $A^{+}A$  put  $\boldsymbol{x}$  Leave the "alive" line space component in  $A$  Throw away the half you kill, which is the very definition of projection. A pseudo-inverse cannot become a real inverse; the best it can do is to send the vector back to the two "good" subspaces of row space and column space, and smooth out the two zero spaces respectively. This also explains why the inverse product of the left inverse and the right inverse in Sections 2 and 3 is a projection: the null space disappears when the column is full rank, $A^{+}A$  degenerate into  $n\times n$  The identity matrix of , leaving only  $AA^{+}$  is a non-trivial column-space projection; the reverse is true for rows of full rank.

![Video 00:27:13: Classroom blackboard writing](</attachments/mit1806-80358f35a04a7ac7e01ba937.jpg>)

*Video 00:27:13 \| Approximately corresponding to Section 5 "5. Pseudo-inverse: One-to-one correspondence from row space to column space".*

## 6. Why pseudo-inverse is needed: when least squares fails

Statisticians are heavy users of least squares, **linear regression** (linear regression) is their central tool, and the central equation of least squares



$$
A^{\mathsf T}A\boldsymbol{x}=A^{\mathsf T}\boldsymbol{b}
$$



to  $A^{\mathsf T}A$  is the coefficient matrix. The premise that this equation has a unique solution is  $A$  Full rank: $A^{\mathsf T}A$  Reversible, left inverse formula  $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$  Give the solution directly. But statisticians always worry about this premise: if the same experiment is repeated several times, the measured data columns will be linearly related. $A$ 's rank dropped to  $r<n$, $A^{\mathsf T}A$  It becomes a singular matrix, and the inverse sign in the left inverse formula cannot be written.

The mechanism of this failure is very specific: if the two columns of data are proportional - for example, the same set of measurements is recorded twice -$A$  The rank of is at most  $n-1$, $A^{\mathsf T}A$  The rows of are also linearly related, and the determinant is zero. Once the full rank is broken, $A^{\mathsf T}A$  The inverse of , the left inverse formula, and the uniqueness of the solution to the equation all become invalid. The sum of the redundant directions brought about by repetition is  $A$  The null space of , the dimension  $n-r$  Just a measure of how much redundancy there is.

Pseudo-rebellion is prepared for this moment. it's only in  $r$  Inverse in the dimensional row space, excluding the direction in the null space: no matter how many times the original data is repeated, the only ones that are truly independent are  $r$  This direction, the pseudo-reverse is only here  $r$  Make a fuss in one direction, and repeated records will not make it move in the direction it should not move. When the rank is full  $r=n$, the null space disappears, and the pseudo-inverse degenerates into the left inverse, so this is a generalization rather than the establishment of another set of theories.

![Video 00:33:30: Classroom blackboard writing](</attachments/mit1806-dc21d977d75ab05466fc2061.jpg>)

*Video 00:33:30 \| Approximately corresponding to Section 6 "6. Why pseudo-inverse is needed: when least squares fails".*

## 7. Use SVD to calculate pseudoinverse

How to calculate pseudo-reverse? The cleanest way is to start from singular value decomposition. SVD writes any matrix as



$$
A=U\Sigma V^{\mathsf T},
$$



Among them  $U$  is  $m\times m$  of **orthogonal matrix**(orthogonal matrix), $V$  is  $n\times n$  the orthogonal matrix, $\Sigma$  is  $m\times n$  The "diagonal" matrix: the upper left corner is  $r$  a positive number  $\sigma_1\ge\sigma_2\ge\cdots\ge\sigma_r>0$, called **singular value** (singular value), the remaining positions are all zero. These non-zero  $\sigma_i$  from  $A^{\mathsf T}A$  with  $AA^{\mathsf T}$——Their square is the non-zero value of these two matrices **eigenvalue** (eigenvalue). Written in chunked form,



$$
\Sigma=\begin{bmatrix}D_r&0\\0&0\end{bmatrix},
\qquad
D_r=\operatorname{diag}(\sigma_1,\dots,\sigma_r).
$$



$\Sigma$  It is "ranked as  $r$  of  $m\times n$  matrix" simplest sample: only  $r$  non-zero yuan, $m$  OK, $n$  Column, rank  $r$  There is no shortage of the same. Its null space is followed by  $n-r$  coordinate vectors, the left null space is  $m-r$  Two coordinate vectors are spread out - two zero spaces are clearly placed in the zero block, and it is obvious at a glance which directions should be retained and which ones should be discarded. Finding its pseudoinverse requires almost no thought: take the reciprocal of the reciprocal, and keep the rest zero.



$$
\Sigma^{+}=\begin{bmatrix}D_r^{-1}&0\\0&0\end{bmatrix},
\qquad
D_r^{-1}=\operatorname{diag}\Bigl(\tfrac{1}{\sigma_1},\dots,\tfrac{1}{\sigma_r}\Bigr),
$$



This is  $n\times m$  matrix. The test only needs to look at the product of two: $\Sigma\Sigma^{+}$  is  $m\times m$  diagonal matrix of , before  $r$  A diagonal element is  $1$, the rest are zero; $\Sigma^{+}\Sigma$  is  $n\times n$  homotype matrix, before  $r$  A diagonal element is  $1$, the rest are zero. Neither is an identity matrix and the dimensions are different, but they are  $\mathbb{R}^m$  with  $\mathbb{R}^n$  The projection in is exactly the best result that the pseudoinverse can achieve - it sends the vector back  $\Sigma$  two non-zero subspaces of .

real  $A$  The pseudoinverse of is then written as



$$
A^{+}=V\Sigma^{+}U^{\mathsf T}.
$$



Each step here can be explained: $V^{\mathsf T}$  The inverse of is  $V$, $U$  The inverse of is  $U^{\mathsf T}$, two orthogonal matrices do not bring any trouble, all the "diseases" are concentrated in the middle  $\Sigma$  on, and  $\Sigma^{+}$  Just did the math. Let’s go back and look at the two composites:



$$
AA^{+}=U\Sigma\Sigma^{+}U^{\mathsf T},
\qquad
A^{+}A=V\Sigma^{+}\Sigma V^{\mathsf T},
$$



They are projections to column space and row space respectively, which are completely consistent with the geometric definition in Section 5.

$\Sigma^{+}$  The upper right block and lower left block of must be zero, otherwise  $\Sigma\Sigma^{+}$  or  $\Sigma^{+}\Sigma$  There will be a non-zero off-diagonal block, which is no longer an orthogonal projection; as for the lower right corner block  $(n-r)\times(m-r)$  The zero area of can be filled with any number - it only multiplies to  $\Sigma$  The zero row and zero column of , the two products are not affected. But it is useless to fill it in, it will only make the matrix larger; it is customary to take the cleanest pseudo-inverse, set the lower right block to zero, and only retain what must be retained  $1/\sigma_i$. The fixed route for finding the pseudo-inverse is: Right  $A$  Do SVD and process the three factors separately - both sides  $U$, $V$  Just transpose, the middle  $\Sigma$  Just take the reciprocal of the non-zero singular values - and multiply the three factors back. This is the value of SVD: it turns the inversion of a rectangular matrix into the reciprocal of a diagonal matrix. All obstacles are clearly arranged in the zero block. It is clear at a glance when to count down and when to set zero. As a test, $r=m=n$  There is no zero block when $\Sigma^{+}$  That’s it  $\Sigma^{-1}$, so  $A^{+}=V\Sigma^{-1}U^{\mathsf T}=A^{-1}$, the pseudo-inverse degenerates into the ordinary inverse; the two rank-deficient cases degenerate into the left inverse and right inverse in Sections 2 and 3 respectively.

![Video 00:37:41: Classroom blackboard writing](</attachments/mit1806-b72f492a655d62b2ecbfcd55.jpg>)

*Video 00:37:41｜Approximately corresponding to Section 7 "7. Calculate pseudo-inverse using SVD".*

![Official Handout Summary Page 3/3](</attachments/mit1806-a4813c2df703dc5357e8dbfc.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 33 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The type of inverse is determined by which of the four basic subspaces the null space disappears: $r=m=n$  Both disappear, $r=n<m$  Only left null space is left, $r=m<n$  Only null space left, $r<m$  and  $r<n$  Both are there.
- When the rank is full  $A^{\mathsf T}A$  Reversible, the left inverse is  $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$;Change it to the right and multiply it to get the projection to the column space  $P=A(A^{\mathsf T}A)^{-1}A^{\mathsf T}$.
- When the line is full  $AA^{\mathsf T}$  Reversible, the right inverse is  $A^{\mathsf T}(AA^{\mathsf T})^{-1}$;reverse product  $A^{\mathsf T}(AA^{\mathsf T})^{-1}A$  is the projection into row space.
- $n\neq m$  time  $A$  with  $A^{\mathsf T}$  There is at least one non-zero null space, so a rectangular matrix can never have a two-sided inverse.
- pseudoinverse  $A^{+}$  Take the inverse of the bijection from row space to column space and set zero to the vector in the left null space; then  $A^{+}A$  is the projection onto row space, $AA^{+}$  is the projection into column space.
- Proof of one-to-one correspondence: If  $\boldsymbol{x},\boldsymbol{y}$  in line space and  $A\boldsymbol{x}=A\boldsymbol{y}$, then  $\boldsymbol{x}-\boldsymbol{y}$  At the same time, in null space and row space, it can only be a zero vector.
- Any matrix has a pseudo-inverse, including matrices with neither left inverse nor right inverse; the pseudo-inverse degenerates into a left inverse when the columns are at full rank, and degenerates into a right inverse when the rows are at full rank.
- The actual motivation is least squares: $A^{\mathsf T}A$  Reversibility relies on the full rank of the column. Repeated experiments will cause the columns to be linearly correlated and the rank to decrease. At this time, pseudo-inversion takes over from the left inverse.
- SVD $A=U\Sigma V^{\mathsf T}$  Attribute the problem to  $\Sigma$  Above: $\Sigma^{+}$  Take the reciprocal of non-zero singular values and set the rest to zero, $A^{+}=V\Sigma^{+}U^{\mathsf T}$; $\Sigma\Sigma^{+}$  with  $\Sigma^{+}\Sigma$  All are only  $r$  a  $1$  diagonal projection.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| left inverse | Left reverse | Take it from the left  $A$  Get the matrix of the identity matrix, which is in the form  $(A^{\mathsf T}A)^{-1}A^{\mathsf T}$ |
| right inverse | right inverse | Take it from the right  $A$  Get the matrix of the identity matrix, which is in the form  $A^{\mathsf T}(AA^{\mathsf T})^{-1}$ |
| two-sided inverse | Bilateral inversion | Both left and right multiplications yield the usual inverse of the identity matrix, which only exists when the square matrix is of full rank. |
| pseudoinverse | pseudoinverse | Generalized inverse that takes the inverse between row space and column space and zeroes the left null space  $A^{+}$ |
| full column rank | Full rank | $r=n$, each column is linearly independent, and the null space only has zero vectors |
| full row rank | Full of rank | $r=m$, each row is linearly independent, and the left null space has only zero vectors |
| projection | projection | A matrix that is equal to identity in a certain subspace and equal to zero in its orthogonal complement |
| singular value decomposition | singular value decomposition | Write any matrix as  $A=U\Sigma V^{\mathsf T}$, middle  $\Sigma$  Only in the upper left corner  $r$  non-zero diagonal elements |
| singular value | singular value | $\Sigma$  Upper left non-zero diagonal element  $\sigma_i$, its square is  $A^{\mathsf T}A$  non-zero eigenvalues of |
| orthogonal matrix | orthogonal matrix | Transpose or inverse square matrix, $U^{\mathsf T}U=I$ |
| least squares | least squares | to  $A^{\mathsf T}A$  is a fitting method for the coefficient matrix. The solution is unique when the columns are full rank. |
| linear regression | linear regression | In statistics, the center tool of least squares is used repeatedly, and it is easy to encounter column correlation. |

---

[← Lecture 32](/en/notes/mit-1806/lec32) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 34 →](/en/notes/mit-1806/lec34)
