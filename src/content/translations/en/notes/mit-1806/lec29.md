---
kind: notes
source: mit-1806/lec29
title: Lecture 29 · Singular value decomposition
description: Master singular value decomposition and understand the
  "rotation-stretch-rotation" structure of any matrix.
sourceHash: 5b54bbbd6e3915578d6c6df600a385ec3a91b2cc04d5fcfd9f96ffe05fe64535
publish: true
translationMethod: machine-assisted
---

> *Singular value decomposition* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 29 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p30 · Singular value decomposition](https://www.bilibili.com/video/BV1ix411f7Yp?p=30)(41:35)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-29-singular-value-decomposition/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=30&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

So far, this course has accumulated a series of matrix decompositions: $A=LU$, $A=QR$, general matrix  $A=S\Lambda S^{-1}$, symmetric matrix  $A=Q\Lambda Q^{\mathsf T}$. Each of them has prerequisites: smooth elimination, column vectors are linearly independent, there are enough linearly independent eigenvectors, and the matrix itself is symmetrical. This lecture gives the last and best decomposition——**singular value decomposition** (singular value decomposition, SVD). It has no premise: any matrix can be made, including square, rectangular, reversible, singular, diagonalizable, and non-diagonalizable matrices. Its three factors happen to be the three most familiar good matrices in the course: orthogonal matrix, diagonal matrix, and orthogonal matrix. The previous decompositions are all decompositions that are "only available for special matrices", only this is the decomposition that is "available for any matrix".

SVD is motivated by diagonalizing gaps. General  $A=S\Lambda S^{-1}$  inside, $S$  The columns of are eigenvectors, but they are not perpendicular to each other, so two sets of tilted bases are used on the left and right sides of the equation. Symmetric matrices are the luckiest case: the eigenvectors are automatically orthogonal, $S$  upgrade to  $Q$, $A=Q\Lambda Q^{\mathsf T}$, both sides share the same set of standard orthonormal bases; if positive definiteness is required again, the diagonal will still be all positive numbers. For general matrices, this luck is gone, so the requirements are relaxed: both sides are allowed to be used **different** Two sets of orthonormal bases. The price is that the number in the middle diagonal matrix is no longer an eigenvalue, but a new role——**singular value**(singular value).

This lecture proceeds along a very specific route: first draw the target into a picture, that is, a set of orthonormal basis quilts of the row space  $A$  Send it to a set of orthonormal basis in the column space; then translate this picture into a matrix equation  $A=U\Sigma V^{\mathsf T}$; then use  $A^{\mathsf T}A$  with  $AA^{\mathsf T}$  Calculate the bases on both sides respectively; finally use two numerical examples - one reversible  $2\times2$  Matrix, a rank 1 matrix—goes through the entire process. After walking through, you will find the true meaning of SVD: it gives a set of "correct" bases for the four basic subspaces. These bases are both orthonormal and can  $A$  into a diagonal matrix.

![Official Handout Summary Page 1/4](</attachments/mit1806-3e9e5f5a19a85a9f02df2d6b.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 29 Summary, CC BY-NC-SA 4.0).*

## 1. From eigenvalues to singular values

What SVD wants to fill is the gap left by ordinary diagonalization. Let’s start with the best-case scenario. The eigenvectors of a symmetric matrix can be chosen to be mutually orthogonal. By unitizing them and arranging them into columns, we get an orthogonal matrix  $Q$, that is  $Q^{\mathsf T}Q=I$, so the symmetric matrix can be orthogonally diagonalized:



$$
A=Q\Lambda Q^{\mathsf T}.
$$



if  $A$  Still righteous, $\Lambda$  The diagonal elements of are all positive. Rename the diagonal element, let  $\sigma_i=\lambda_i$, the same equation is read as



$$
A=Q\Sigma Q^{\mathsf T},
$$



That is, "orthogonal × diagonal × orthogonal", and both sides can be used **same one** $Q$. This is exactly what SVD looks like in the symmetric positive definite case, and it's the least cumbersome one: a set of orthonormal bases serve as bases on both sides simultaneously. The reason why they can be shared is because the eigenvectors of symmetric matrices happen to be orthogonal - this is a special property, not a universal phenomenon.

No such luck with general matrices. Its diagonalization is  $A=S\Lambda S^{-1}$, $S$  consists of eigenvectors, which are usually not orthogonal; therefore  $S$  is not an orthogonal matrix, $S^{-1}$  Nor can it be written as  $S^{\mathsf T}$. If the basis on both sides of the equation is distorted, the sentence "diagonalization under an orthonormal basis" will not be true. In addition, it is impossible to even talk about eigenvalues ​​for rectangular matrices, and the path of eigenvalues ​​is simply unworkable in that situation.

The idea of SVD is to break down the requirement of "diagonalization". It actually contains two things: (1) the basis used on both sides is orthonormal; (2) the off-diagonal positions are all zero. $A=S\Lambda S^{-1}$  It satisfies (2) but sacrifices (1); orthogonal diagonalization satisfies both of them, but it is only true for symmetric matrices. SVD's choice is to retain (1) and (2), abandon the additional requirement of "both sides share the same set of bases", and let the left base and the right base be selected independently. So the question becomes:

> exists  $m\times m$  the orthogonal matrix  $U$, $n\times n$  the orthogonal matrix  $V$, and  $m\times n$  The diagonal matrix of  $\Sigma$, making  $A=U\Sigma V^{\mathsf T}$?

The answer is yes, and it holds for any matrix. $\Sigma$  Numbers on the diagonal  $\sigma_1,\sigma_2,\dots,\sigma_r$  All are positive and are called **singular value**. It should be reminded that singular values are generally not  $A$  eigenvalues of  $A^{\mathsf T}A$  The positive square root of the eigenvalues of is a fact that will be shown in the next section. Only in the case of symmetric positive definites the two coincide exactly (then  $\sigma_i=\lambda_i$). Precisely because of the change of objects, rectangular matrices and non-diagonalizable matrices are eligible to enter this framework.

![Video 00:04:10: Classroom blackboard writing](</attachments/mit1806-9e76252ad48ebd6f42d49b49.jpg>)

*Video 00:04:10 \| Approximately corresponding to Section 1 "1. From Eigenvalues to Singular Values".*

## 2. Geometric image: The basis of the row space is fed into the basis of the column space.

one  $m\times n$  A matrix is a  $\mathbb{R}^n$  Arrive  $\mathbb{R}^m$  linear transformation. The recurring picture in the course explains its function most clearly: the input space is divided into two parts: row space and null space, and the output space is divided into two parts: column space and left null space; the null space is completely suppressed.  $\boldsymbol{0}$, the row space fills the column space one by one, and the dimensions on both sides are the same  $r=\operatorname{rank}(A)$. The real content part is the section from row space to column space.

What SVD is looking for is two sets of bases that match each other under this mapping: a set of orthonormal bases in the row space  $\boldsymbol v_1,\dots,\boldsymbol v_r$, through  $A$  After the action, it becomes a set of mutually perpendicular vectors in the column space; then the image is unitized to obtain the orthonormal basis of the column space.  $\boldsymbol u_1,\dots,\boldsymbol u_r$. The only difference between the two sets of bases is a length factor:



$$
A\boldsymbol v_i=\sigma_i\boldsymbol u_i,\qquad i=1,2,\dots,r .
$$



$\sigma_i>0$  That's the direction **Stretch ratio** (stretching factor). in other words, $A$  Transform a set of mutually perpendicular unit vectors into another set of mutually perpendicular vectors, only changing the length but not the angle. The two right angles in the entire picture - the right angle on the input side and the right angle on the output side - are preserved at the same time. This is the one-sentence version of the entire content of SVD.

Why can't we just find a set of orthonormal basis for the row space? Because Gram-Schmidt orthogonalization only looks at this side of the input: it can grind a set of orthonormal basis from any set of basis, but  $A$  Once you're on it, there's no reason to stay vertical. Taking a general standard orthonormal basis, the angles between their image vectors will become messy and have different lengths. So the question is not "how to orthogonalize", but "which set of orthogonal directions are  $A$  Keep it orthogonal" - this is a feature direction problem, to be precise  $A^{\mathsf T}A$  The problem of feature direction is explained in the next section.

null space does not pose any trouble here. Base completion of row spaces: $\boldsymbol v_{r+1},\dots,\boldsymbol v_n$  Take null space  $N(A)$  The orthonormal basis of $A$  send them all  $\boldsymbol 0$, automatically satisfies "the images are perpendicular to each other" (the zero vector is orthogonal to any vector). Then complete the basis of the column space: $\boldsymbol u_{r+1},\dots,\boldsymbol u_m$  Take left null space  $N(A^{\mathsf T})$  the orthonormal basis of . These supplementary directions are in  $\Sigma$  corresponding to the diagonal of  $0$, that is, "multiply by zero". The only thing that really takes effort to find is  $r$  Right: in row space  $\boldsymbol v$  and in column space  $\boldsymbol u$, the dimensions on both sides are  $r$;The dimension of the null space is  $n-r$, the left null space is  $m-r$.

![Video 00:12:39: Classroom blackboard writing](</attachments/mit1806-bf6b8826abbaf0568d904504.jpg>)

*Video 00:12:39 \| Approximately corresponding to section 2 "2. Geometric image: the basis of the row space is sent to the basis of the column space".*

![Official Handout Summary Page 2/4](</attachments/mit1806-834abc5b0f5b460501551b28.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 29 Summary, CC BY-NC-SA 4.0).*

## 3. Write it as a matrix equation: $A=U\Sigma V^{\mathsf T}$

pairing relationship  $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$  Matrix multiplication can be written in one go. Put the front first  $r$  vectors arranged in columns:



$$
A\begin{bmatrix}\boldsymbol v_1&\boldsymbol v_2&\cdots&\boldsymbol v_r\end{bmatrix}
=\begin{bmatrix}\boldsymbol u_1&\boldsymbol u_2&\cdots&\boldsymbol u_r\end{bmatrix}
\begin{bmatrix}\sigma_1&&\\&\ddots&\\&&\sigma_r\end{bmatrix}.
$$



No. on the left  $i$  Column is  $A\boldsymbol v_i$, the right  $i$  Column is  $\sigma_i\boldsymbol u_i$, are equal column by column, and the equation holds. Note that the diagonal matrix on the right is multiplied from the right. Its function is to multiply each column by its respective multiple - this is "scaling by column".

Then make up for it  $\boldsymbol v_{r+1},\dots,\boldsymbol v_n$ (null space direction) and  $\boldsymbol u_{r+1},\dots,\boldsymbol u_m$ (Left null space direction) is also added in columns. left becomes  $AV$, $V$  is  $n\times n$  Orthogonal matrix of ; the right side becomes  $U\Sigma$, $U$  is  $m\times m$  is an orthogonal matrix, and  $\Sigma$  is  $m\times n$  matrix, the upper left corner is a piece  $\operatorname{diag}(\sigma_1,\dots,\sigma_r)$, the rest are all zeros:



$$
\Sigma=\left[\begin{array}{c|c}D&\boldsymbol 0\\\hline \boldsymbol 0&\boldsymbol 0\end{array}\right],
\qquad D=\operatorname{diag}(\sigma_1,\dots,\sigma_r),\quad D\ \text{为}\ r\times r .
$$



Those added are listed on the right  $\Sigma$  The zero blocks are multiplied out, so the equation is not violated. So get  $AV=U\Sigma$.$V$  is an orthogonal matrix, $V^{-1}=V^{\mathsf T}$, multiply both sides by right  $V^{\mathsf T}$, we get the final form of SVD:



$$
A=U\Sigma V^{\mathsf T}.
$$



This equation says three things. First, $U$  with  $V$  Generally, it cannot be taken as the same matrix. Only in cases such as symmetric positive definite cases, both sides share a set of basis. Second, $A$  Diagonalized by these two sets of basis: $A\boldsymbol v_i$  only  $\boldsymbol u_i$  The component of the direction, there is no cross-term, that is  $\boldsymbol v$  with  $\boldsymbol v$  There is no coupling between $\boldsymbol u$  with  $\boldsymbol u$  There is no coupling between them. Third, $\Sigma$  The shape is  $m\times n$, rank is  $r$, the extra zeros when the matrix is singular or not a square matrix record the dimensions of the null space and the left null space.

![Video 00:15:48: Classroom blackboard writing](</attachments/mit1806-b6de5672e92368164d25fcd4.jpg>)

*Video 00:15:48｜Approximately corresponding to Section 3 "3. Write it as a matrix equation: $A=U\Sigma V^{\mathsf T}$"Nearby.*

## 4. use  $A^{\mathsf T}A$  Ask for  $V$, use  $AA^{\mathsf T}$  Ask for  $U$

$U$  with  $V$  They are all unknown, and it is not cost-effective to solve them at the same time. The way is to create a combination and eliminate one of them. What is still used here is  $A^{\mathsf T}A$——Whenever you encounter a rectangular matrix, this combination will always appear - expand it according to SVD:



$$
A^{\mathsf T}A=\bigl(V\Sigma^{\mathsf T}U^{\mathsf T}\bigr)\bigl(U\Sigma V^{\mathsf T}\bigr)
=V\Sigma^{\mathsf T}\bigl(U^{\mathsf T}U\bigr)\Sigma V^{\mathsf T}
=V\bigl(\Sigma^{\mathsf T}\Sigma\bigr)V^{\mathsf T}.
$$



The key is in the middle: $U$  is an orthogonal matrix, $U^{\mathsf T}U=I$, so  $U$  The whole thing disappears. the rest  $\Sigma^{\mathsf T}\Sigma$  is  $n\times n$  The diagonal matrix of , on the diagonal is  $\sigma_1^2,\dots,\sigma_r^2$, followed by  $n-r$  A zero. So



$$
A^{\mathsf T}A=V\operatorname{diag}\bigl(\sigma_1^2,\dots,\sigma_r^2,0,\dots,0\bigr)V^{\mathsf T}.
$$



This is a standard orthogonal diagonalization. $A^{\mathsf T}A$  Symmetrical in itself ($(A^{\mathsf T}A)^{\mathsf T}=A^{\mathsf T}A$), so there must be orthogonal eigenvector groups; the above formula shows that these eigenvectors are  $V$  column, the corresponding eigenvalue is  $\sigma_i^2$. In addition  $A^{\mathsf T}A$  must be positive semi-definite, because for any  $\boldsymbol x$,



$$
\boldsymbol x^{\mathsf T}A^{\mathsf T}A\boldsymbol x
=(A\boldsymbol x)^{\mathsf T}(A\boldsymbol x)\ge 0 ,
$$



On the right is  $A\boldsymbol x$  The inner product with itself, that is, its length squared, is always non-negative. So  $A^{\mathsf T}A$  The eigenvalues of can never be negative, and the square root always makes sense. The singular value is **Right** The square root of.

Use the same technique to reverse the order of multiplication. What is caught in the middle at this time is  $V^{\mathsf T}V=I$, $V$  was eliminated, leaving behind  $U$:



$$
AA^{\mathsf T}=U\Sigma\Sigma^{\mathsf T}U^{\mathsf T}
=U\operatorname{diag}\bigl(\sigma_1^2,\dots,\sigma_r^2,0,\dots,0\bigr)U^{\mathsf T}.
$$



thus  $U$  The columns are  $AA^{\mathsf T}$  unit eigenvector. The two matrices may be of different sizes ($A^{\mathsf T}A$  is  $n\times n$, $AA^{\mathsf T}$  is  $m\times m$), but their non-zero eigenvalues must be the same: if  $A^{\mathsf T}A\boldsymbol v=\lambda\boldsymbol v$  and  $\lambda\neq0$, then



$$
AA^{\mathsf T}(A\boldsymbol v)=A\bigl(A^{\mathsf T}A\boldsymbol v\bigr)=A(\lambda\boldsymbol v)=\lambda\,A\boldsymbol v ,
$$



And  $\lambda\neq0$  guarantee  $A\boldsymbol v\neq\boldsymbol 0$, so  $\lambda$  Also  $AA^{\mathsf T}$  eigenvalues. This means that two matrices can give the same batch  $\sigma$  reason.

The entire algorithm is therefore divided into three steps:

1. Calculate  $A^{\mathsf T}A$, ask for it  $n$  unit eigenvectors, arranged in columns  $V$; Take the positive square root of the eigenvalues to get  $\sigma_1,\dots,\sigma_r$.
2. Calculate  $AA^{\mathsf T}$, ask for it  $m$  unit eigenvectors, arranged in columns  $U$.
3. put  $\sigma$  placed in order  $\Sigma$  On the diagonal of , the remaining positions are filled with zeros.

Step 3 is not as mechanical as it sounds: $\sigma_i$, $\boldsymbol v_i$, $\boldsymbol u_i$  The subscripts must be matched and the symbols must be aligned, otherwise the assembled matrix will go wrong. The next example will hit this problem.

## 5. Example 1: A reversible  $2\times2$  matrix

take



$$
A=\begin{bmatrix}4&4\\-3&3\end{bmatrix}.
$$



It is reversible, $\det A=4\cdot3-4\cdot(-3)=24$, so the rank is  $2$, both row space and column space are the entire  $\mathbb{R}^2$: To find two standard orthogonal  $\boldsymbol v$  Orthogonal to two standards  $\boldsymbol u$.

The first step is to calculate  $A^{\mathsf T}A$:



$$
A^{\mathsf T}A=\begin{bmatrix}4&-3\\4&3\end{bmatrix}\begin{bmatrix}4&4\\-3&3\end{bmatrix}
=\begin{bmatrix}25&7\\7&25\end{bmatrix}.
$$



The diagonal element is  $16+9=25$, the subdiagonal element is  $16-9=7$, the results are indeed symmetrical. shaped like  $\begin{bmatrix}a&b\\b&a\end{bmatrix}$  The matrix has a ready-made rule: the eigenvectors are always  $(1,1)$  with  $(1,-1)$, the eigenvalues are respectively  $a+b$  with  $a-b$. So here the eigenvector is  $(1,1)$, $(1,-1)$, the characteristic value is  $32$  with  $18$. Direct calculation:



$$
\begin{bmatrix}25&7\\7&25\end{bmatrix}\begin{bmatrix}1\\1\end{bmatrix}
=\begin{bmatrix}32\\32\end{bmatrix}=32\begin{bmatrix}1\\1\end{bmatrix},
\qquad
\begin{bmatrix}25&7\\7&25\end{bmatrix}\begin{bmatrix}1\\-1\end{bmatrix}
=\begin{bmatrix}18\\-18\end{bmatrix}=18\begin{bmatrix}1\\-1\end{bmatrix}.
$$



After unitization



$$
V=\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix},
\qquad
\sigma_1=\sqrt{32}=4\sqrt2,\qquad \sigma_2=\sqrt{18}=3\sqrt2 .
$$



The second step is to ask for  $U$, change calculation  $AA^{\mathsf T}$:



$$
AA^{\mathsf T}=\begin{bmatrix}4&4\\-3&3\end{bmatrix}\begin{bmatrix}4&-3\\4&3\end{bmatrix}
=\begin{bmatrix}32&0\\0&18\end{bmatrix}.
$$



It happens to be a diagonal matrix, which is the luck of the example, and the eigenvectors are directly  $(1,0)$  with  $(0,1)$, the eigenvalue is still  $32$  with  $18$. Consistent with the statement in the previous section: $A^{\mathsf T}A$  with  $AA^{\mathsf T}$  have the same non-zero eigenvalues. So



$$
U=\begin{bmatrix}1&0\\0&1\end{bmatrix}=I,
\qquad
\Sigma=\begin{bmatrix}\sqrt{32}&0\\0&\sqrt{18}\end{bmatrix}.
$$



The third step is to put the three pieces together to verify. press  $A=U\Sigma V^{\mathsf T}$  Multiplied out is



$$
I\begin{bmatrix}\sqrt{32}&0\\0&\sqrt{18}\end{bmatrix}
\frac{1}{\sqrt2}\begin{bmatrix}1&1\\1&-1\end{bmatrix}
=\frac{1}{\sqrt2}\begin{bmatrix}\sqrt{32}&\sqrt{32}\\
\sqrt{18}&-\sqrt{18}\end{bmatrix}
=\begin{bmatrix}4&4\\3&-3\end{bmatrix},
$$



The second line is the same as  $A$  The second line of  $(-3,3)$  One symbol missing. The problem is not  $\Sigma$, $\Sigma$  The diagonal element of is inherently positive; neither  $V$  the columns themselves, which are indeed  $A^{\mathsf T}A$  unit eigenvector.

The crux is that the eigenvectors can only be determined to differ by one sign: $\boldsymbol v_2=\frac{1}{\sqrt2}(1,-1)$  with  $-\frac{1}{\sqrt2}(1,-1)$  All  $A^{\mathsf T}A$  About  $18$  The unit eigenvector of , both methods are legal, $V$  It is still an orthogonal matrix. What really binds the two groups of bases together is the pairing condition  $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$. Check the second direction with this condition:



$$
A\boldsymbol v_2=\frac{1}{\sqrt2}\begin{bmatrix}4&4\\-3&3\end{bmatrix}\begin{bmatrix}1\\-1\end{bmatrix}
=\frac{1}{\sqrt2}\begin{bmatrix}0\\-6\end{bmatrix}
=\sqrt{18}\begin{bmatrix}0\\-1\end{bmatrix},
$$



because  $\frac{6}{\sqrt2}=3\sqrt2=\sqrt{18}$. So  $\boldsymbol u_2$  Must take  $(0,-1)$, instead of  $(0,1)$. After correction



$$
U=\begin{bmatrix}1&0\\0&-1\end{bmatrix},
\qquad
U\Sigma V^{\mathsf T}
=\frac{1}{\sqrt2}\begin{bmatrix}\sqrt{32}&\sqrt{32}\\-\sqrt{18}&\sqrt{18}\end{bmatrix}
=\begin{bmatrix}4&4\\-3&3\end{bmatrix}=A .
$$



Check one by one: $\sqrt{32}/\sqrt2=\sqrt{16}=4$  Give the two numbers in the first row; $-\sqrt{18}/\sqrt2=-3$, $\sqrt{18}/\sqrt2=3$  gives the second row. All matched.

This episode is worth remembering: the three pieces of SVD are not calculated independently and then assembled. $A^{\mathsf T}A$  with  $AA^{\mathsf T}$  Each gives a set of eigenvectors, each with a signed degree of freedom; it must be used  $\sigma_i$  Pair them up and use  $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$  Freeze symbol. corrected  $U$  Still orthogonal (here it's a reflection: the first column doesn't move, the second column reverses), so it still qualifies. There is no problem with the first direction, you can check it out: $A\boldsymbol v_1=\frac{1}{\sqrt2}(8,0)=\sqrt{32}\,(1,0)$.

![Video 00:27:02: Classroom blackboard writing](</attachments/mit1806-97169a6e3635940613b70800.jpg>)

*Video 00:27:02｜Approximately corresponding to Section 5 "5. Example 1: A reversible  $2\times2$ "Matrix".*

![Official Handout Summary Page 3/4](</attachments/mit1806-87a92381e5ff0412429ad479.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 29 Summary, CC BY-NC-SA 4.0).*

## 6. Example 2: A rank 1 matrix

The second example lets  $A$  Strange:



$$
A=\begin{bmatrix}4&3\\8&6\end{bmatrix}.
$$



The second row is twice the first row, rank  $r=1$. This reduces all dimensions: the row space is a line, i.e.  $(4,3)$  all multiples of ; the null space is the perpendicular through the origin; two column vectors  $(4,8)$  with  $(3,6)$  All  $(1,2)$  A multiple of , so the column space is also a line; the left null space is the vertical line of the column space. Just need to find a pair  $\boldsymbol v_1,\boldsymbol u_1$, the remaining directions are given by completion.

Calculate first  $A^{\mathsf T}A$:



$$
A^{\mathsf T}A=\begin{bmatrix}4&8\\3&6\end{bmatrix}\begin{bmatrix}4&3\\8&6\end{bmatrix}
=\begin{bmatrix}80&60\\60&45\end{bmatrix}.
$$



It is also of rank 1, each row is  $(4,3)$  multiples. Find the eigenvalues: the trace is  $80+45=125$, a rank of 1 indicates that there is an eigenvalue  $0$, so the other one must be  $125$ (The trace is equal to the sum of the eigenvalues). Therefore



$$
\sigma_1=\sqrt{125}=5\sqrt5 .
$$



Belong to  $125$  The eigenvectors fall in the row space direction, that is  $(4,3)$  direction; length is  $5$, unitized into



$$
\boldsymbol v_1=\left(\frac45,\frac35\right)=(0.8,\,0.6).
$$



another eigenvalue  $0$  The corresponding eigenvector is in the null space direction, and is taken as  $\boldsymbol v_1$  vertical unit vector



$$
\boldsymbol v_2=\left(\frac35,-\frac45\right)=(0.6,\,-0.8),
\qquad
V=\begin{bmatrix}4/5&3/5\\3/5&-4/5\end{bmatrix}.
$$



$U$  This side only needs one substantive direction: the column space is given by  $(1,2)$  Zhang Cheng, unitized



$$
\boldsymbol u_1=\frac{1}{\sqrt5}\begin{bmatrix}1\\2\end{bmatrix}.
$$



Add another unit vector perpendicular to it  $\boldsymbol u_2=\frac{1}{\sqrt5}(2,-1)$, make up  $\mathbb{R}^2$  The orthonormal basis of:



$$
U=\frac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix},
\qquad
\Sigma=\begin{bmatrix}5\sqrt5&0\\0&0\end{bmatrix}.
$$



Verify once. Calculate first  $U\Sigma$, $\sqrt5$  with  $5\sqrt5$  Cancellation:



$$
U\Sigma=\frac{1}{\sqrt5}\begin{bmatrix}1&2\\2&-1\end{bmatrix}
\begin{bmatrix}5\sqrt5&0\\0&0\end{bmatrix}
=\begin{bmatrix}5&0\\10&0\end{bmatrix},
$$



Take another right  $V^{\mathsf T}$:



$$
\begin{bmatrix}5&0\\10&0\end{bmatrix}
\begin{bmatrix}4/5&3/5\\3/5&-4/5\end{bmatrix}
=\begin{bmatrix}4&3\\8&6\end{bmatrix}=A .
$$



The first line is  $5\cdot(4/5,3/5)=(4,3)$, the second line is  $10\cdot(4/5,3/5)=(8,6)$;The second column is because  $\Sigma$  The second diagonal element of is  $0$, the entire column is multiplied.

This example makes the role of null space clear: $\boldsymbol v_2$  with  $\boldsymbol u_2$  in multiplication is only  $0$  Multiply, no matter how you take it, it doesn’t matter  $A$, you can choose freely. really decide  $A$  only  $\boldsymbol v_1,\sigma_1,\boldsymbol u_1$  This group is the pair of directions in row space and column space. put  $U\Sigma V^{\mathsf T}$  Expanding by "column times row", this will be more obvious:



$$
A=\sigma_1\boldsymbol u_1\boldsymbol v_1^{\mathsf T}
+\sigma_2\boldsymbol u_2\boldsymbol v_2^{\mathsf T}+\cdots
+\sigma_r\boldsymbol u_r\boldsymbol v_r^{\mathsf T}.
$$



every item  $\boldsymbol u_i\boldsymbol v_i^{\mathsf T}$  is a rank 1 matrix, $r$  The sum of the terms spells out exactly  $A$; $\sigma_i=0$  The item disappears directly. The rank of example 2 is 1, $A$  itself is just one of them, which explains why its  $\Sigma$  There is only one non-zero diagonal element.

![Video 00:31:58: Classroom blackboard writing](</attachments/mit1806-4ff2ea360445f8c9e45c19e8.jpg>)

*Video 00:31:58 \| Approximately corresponding to Section 6 "6. Example 2: A rank 1 matrix".*

## 7. What SVD really means: a set of correct basis for four fundamental subspaces

Both examples point to the same thing: SVD selects exactly the "correct" set of basis for the four basic subspaces.

- $\boldsymbol v_1,\dots,\boldsymbol v_r$: line space  $C(A^{\mathsf T})$  The orthonormal basis of ;
- $\boldsymbol u_1,\dots,\boldsymbol u_r$: column space  $C(A)$  The orthonormal basis of ;
- $\boldsymbol v_{r+1},\dots,\boldsymbol v_n$: null space  $N(A)$  The orthonormal basis of ;
- $\boldsymbol u_{r+1},\dots,\boldsymbol u_m$: left null space  $N(A^{\mathsf T})$  the orthonormal basis of .

The numbers of the four sets of vectors are  $r,r,n-r,m-r$: Two groups  $\boldsymbol v$($r$  individual and  $n-r$ ) put together to form  $\mathbb{R}^n$  A set of complete orthonormal bases, two sets of  $\boldsymbol u$($r$  individual and  $m-r$ ) put together to form  $\mathbb{R}^m$  a complete set of orthonormal basis.

"Correct" has two meanings. The first level is standard orthogonality: This level of Gram-Schmidt orthogonalization has been achieved long ago, and any set of basis can be ground into orthogonality. The second level is to let  $A$  Diagonalization: $A\boldsymbol v_i$  only  $\boldsymbol u_i$  direction component, $\boldsymbol v$  There is no coupling between $\boldsymbol u$  There is no coupling between them, and the entire transformation graph only remains  $r$  independent stretching directions that do not interfere with each other. The second layer cannot be provided by Gram-Schmidt and must rely on eigenvalues: $\boldsymbol v_i$  is  $A^{\mathsf T}A$  eigenvector, $\boldsymbol u_i$  is  $AA^{\mathsf T}$  eigenvector. The relationship between the four subspace dimensions that appeared repeatedly in the previous lectures  $r+r+(n-r)+(m-r)=m+n$, only here we have a set of specific vectors that are orthogonal to each other to realize.

This is where SVD fits into the overall curriculum. It is not another computing technique, but a solution that preserves the two previously conflicting goals of "diagonalization" and "orthonormal basis" by allowing different bases to be used on both sides. It is in this sense that it is the last and most complete matrix factorization in this course.

![Video 00:37:26: Classroom blackboard writing](</attachments/mit1806-c7b60a64273e105ba4d4de81.jpg>)

*Video 00:37:26 \| Approximately corresponding to Section 7 "7. The true meaning of SVD: a set of correct basis for four basic subspaces".*

![Official Handout Summary Page 4/4](</attachments/mit1806-fa1ef7bbd76b20687b8ad0d2.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 29 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **singular value decomposition** (SVD) put any  $m\times n$  The matrix is written as  $A=U\Sigma V^{\mathsf T}$, among which  $U$, $V$  is an orthogonal matrix, $\Sigma$  is  $m\times n$  diagonal matrix, forward on the diagonal  $r$  is a positive singular value.
- Diagonalization  $A=S\Lambda S^{-1}$  in  $S$  Composed of eigenvectors and usually not orthogonal; symmetric matrices have  $A=Q\Lambda Q^{\mathsf T}$, both sides of the symmetric positive timing share the same  $Q$, which is a special case of SVD. General matrices require two different sets of orthogonal basis.
- Geometric meaning: $A$  Take the orthonormal basis of the row space  $\boldsymbol v_1,\dots,\boldsymbol v_r$  sent to the standard orthogonal direction of the column space, satisfying  $A\boldsymbol v_i=\sigma_i\boldsymbol u_i$, $\sigma_i>0$  in all directions **Stretch ratio**.
- null space and left null space do not cause difficulties: just complete the bases on both sides, they correspond  $\Sigma$  zero on, the dimensions are respectively  $n-r$  with  $m-r$.
- by  $A^{\mathsf T}A=V\Sigma^{\mathsf T}\Sigma V^{\mathsf T}$  eliminate  $U$, got  $V$  The columns are  $A^{\mathsf T}A$  The unit eigenvector and eigenvalue of are  $\sigma_i^2$; symmetrically, $AA^{\mathsf T}$  composed of unit eigenvectors  $U$.$A^{\mathsf T}A$  It is positive semi-definite, so the eigenvalues are non-negative and the singular values take positive square roots.
- Example 1  $A=\begin{bmatrix}4&4\\-3&3\end{bmatrix}$: $A^{\mathsf T}A=\begin{bmatrix}25&7\\7&25\end{bmatrix}$  Eigenvalue  $32,18$, $\sigma_1=4\sqrt2$, $\sigma_2=3\sqrt2$; $AA^{\mathsf T}=\begin{bmatrix}32&0\\0&18\end{bmatrix}$, $U$  The second column of  $A\boldsymbol v_2=\sqrt{18}\,(0,-1)$  Set as  $(0,-1)$, got  $U=\begin{bmatrix}1&0\\0&-1\end{bmatrix}$.
- Example 2  $A=\begin{bmatrix}4&3\\8&6\end{bmatrix}$  Rank 1: $A^{\mathsf T}A=\begin{bmatrix}80&60\\60&45\end{bmatrix}$  The characteristic value of  $125,0$, $\sigma_1=5\sqrt5$, $\boldsymbol v_1=(0.8,0.6)$, $\boldsymbol v_2=(0.6,-0.8)$, $\boldsymbol u_1=(1,2)/\sqrt5$.
- $A=\sigma_1\boldsymbol u_1\boldsymbol v_1^{\mathsf T}+\cdots+\sigma_r\boldsymbol u_r\boldsymbol v_r^{\mathsf T}$: $A$  is  $r$  The sum of rank 1 matrices, the zero direction is  $\sigma_i=0$  Eliminate.
- SVD gives the orthonormal basis of four basic subspaces (the row space is  $\boldsymbol v_1..\boldsymbol v_r$, column space for  $\boldsymbol u_1..\boldsymbol u_r$, for null space  $\boldsymbol v_{r+1}..\boldsymbol v_n$, left null space is used  $\boldsymbol u_{r+1}..\boldsymbol u_m$), this group of bases simultaneously  $A$  into a diagonal matrix.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| singular value decomposition (SVD) | singular value decomposition | Write any matrix as  $U\Sigma V^{\mathsf T}$: Orthogonal on both sides, diagonal in the middle |
| singular value | singular value | $\Sigma$  The diagonal element of is  $A^{\mathsf T}A$  The positive square root of the eigenvalue, that is, the stretch factor in that direction |
| orthogonal matrix | orthogonal matrix | The column vector is a standard orthogonal square matrix that satisfies  $Q^{\mathsf T}Q=I$ |
| diagonal matrix | diagonal matrix | A matrix whose off-diagonal elements are all zeros |
| row space | row space | $A$  The subspace formed by each row has a dimension of  $r$ |
| column space | column space | $A$  The subspace spanned by each column has a dimension of  $r$ |
| nullspace | null space | satisfy  $A\boldsymbol x=\boldsymbol 0$  The total vector of , dimension  $n-r$ |
| left nullspace | left null space | satisfy  $A^{\mathsf T}\boldsymbol y=\boldsymbol 0$  The total vector of , dimension  $m-r$ |
| orthonormal | orthogonal | Pairs are orthogonal and both have lengths  $1$ |
| stretching factor | Stretch ratio | The geometric meaning of singular values: the proportion of elongation or flattening in that direction |
| positive semidefinite | positive semidefinite | Quadratic constant nonnegative symmetric matrix, $A^{\mathsf T}A$  Must be of this type |
| rank-one matrix | rank 1 matrix | can be written as  $\boldsymbol u\boldsymbol v^{\mathsf T}$  matrix, each term of the SVD expansion |
| symmetric positive definite | symmetric positive definite | Symmetric and all eigenvalues are positive, at this time the two sets of bases of SVD can be combined into one |

---

[← Lecture 28](/en/notes/mit-1806/lec28) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 30 →](/en/notes/mit-1806/lec30)
