---
kind: notes
source: mit-1806/lec26
title: Lecture 26 · Complex matrices and fast Fourier transform
description: Understand the structure of complex matrices, Hermitian matrices and FFTs.
sourceHash: c8add3590997a437ff0bc35b5e979136a082a1237cbeb7b1d573c02a232fb230
publish: true
translationMethod: machine-assisted
---

> *Complex matrices; fast fourier transform* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 26 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p27 · Complex matrix and fast Fourier transform](https://www.bilibili.com/video/BV1ix411f7Yp?p=27)(47:52)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-26-complex-matrices-fast-fourier-transform/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=27&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Complex numbers have actually entered this course for a long time: a real matrix may also have complex eigenvalues and complex eigenvectors. But so far, most of the discussion has been in the realm of real numbers. Which definitions need to be modified when the elements of vectors and matrices themselves become complex numbers? There is only one answer, but it runs throughout the lecture: **Whenever you do a transpose, you also take the conjugate**. This rule translates the concepts of length, inner product, symmetry, and orthogonality into complex space. Real symmetric matrices become Hermitian matrices, and orthogonal matrices become unitary matrices.

After the translation is completed, the most important complex matrix can be introduced——**Fourier matrix**(Fourier matrix)$F_n$. Its elements are all the same unit root  $W$  The power of , the structure is extremely neat: each column has the same length, and any two columns are perpendicular to each other under the conjugate inner product. Just because the columns are orthogonal to each other, its inverse matrix almost does not need to be calculated, it is just the conjugate transpose and then divided by  $n$;Forward transformation and inverse transformation look almost the same, but it is easy to get confused when writing programs.

The most practical results in complex matrices also fall in  $F_n$  on. Generally, use a  $n\times n$  Matrix multiplication by vector requires  $n^2$  times multiplication because the matrix is full and does not have a zero element. **Fast Fourier Transform** (fast Fourier transform, FFT) but  $F_n$  Decompose it into the product of several sparse matrices, so that the number of multiplications is reduced to  $\frac12 n\log_2 n$.$n=64$  time is  $4096$  Yes  $192$; $n=1024$  time  $n^2$  More than one million, while the new algorithm only requires  $5120$  times, soon about  $200$  times. It is this acceleration that has changed the computing methods of the entire industry and is also one of the most critical links in modern scientific computing.

![Official Handout Summary Page 1/4](</attachments/mit1806-0ec40dcdc8a405b6ad8ff927.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 26 Summary, CC BY-NC-SA 4.0).*

## 1. Complex vectors: why length and inner product must be conjugated

Set  $\boldsymbol{z}=(z_1,z_2,\dots,z_n)$  Each component of is a complex number, it belongs to the complex  $n$  dimensional space  $\mathbb{C}^n$. To define its length, the first idea is to copy the case of real numbers  $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$, but this approach immediately fails. length squared must be positive (except for zero vectors), while



$$
\boldsymbol{z}^{\mathsf T}\boldsymbol{z}=z_1^2+z_2^2+\cdots+z_n^2
$$



What appears here is the square of each component, not the module length. take  $\boldsymbol{z}=(1,i)$: $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}=1+i^2=1-1=0$, but this vector is obviously not a zero vector, and its length cannot be  $0$. So  $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$  Not the length.

The correct approach is to multiply each component by its own **complex conjugate** (complex conjugate), that is, changing the signs of all imaginary parts:



$$
\overline{\boldsymbol{z}}^{\mathsf T}\boldsymbol{z}=\overline{z_1}z_1+\overline{z_2}z_2+\cdots+\overline{z_n}z_n .
$$



Yes  $\boldsymbol{z}=(1,i)$, the first item is  $1\cdot1=1$, the second item is  $(-i)\cdot i=1$, which adds up to  $2$, so the length of this vector is  $\sqrt2$, instead of  $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$  given  $0$. Pay attention to each item  $\overline{z}z=|z|^2$  are all non-negative real numbers, which is exactly the required property of length square: the sum is zero if and only if each component is zero.

Notation combines "first transpose, then take conjugate" into one action, written as



$$
\boldsymbol{z}^{\mathsf H}=\overline{\boldsymbol{z}}^{\mathsf T},
$$



where H is taken from the name Hermite, $\boldsymbol{z}^{\mathsf H}$  called **conjugate transpose** (conjugate transpose). So the square of the length is  $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$. From real numbers to complex numbers, there is only one rule: **When transposing, take the conjugate incidentally**.

The inner product is modified accordingly. The inner product of real vectors is  $\boldsymbol{y}^{\mathsf T}\boldsymbol{x}$, the inner product of a complex vector must be  $\boldsymbol{y}^{\mathsf H}\boldsymbol{x}$, the first factor is to be conjugated. This definition is not chosen casually, but is forced by the length: when the two factors are the same, the inner product must degenerate into  $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$, which is the length squared. The cost is that the inner product is generally no longer a real number, but a complex number; only taking  $\boldsymbol{y}=\boldsymbol{x}$  Only then will it be true.

In addition to the definitions of length and inner product, $\mathbb{C}^n$  with  $\mathbb{R}^n$  There are no other differences: the addition of vectors is still performed component by component, the coefficients of linear combinations are now allowed to be complex numbers, and the axiom remains unchanged, so it is also a vector space. The translation work to be done in this lecture is to change each formula from the real number version to the conjugate version; the real number case automatically becomes a special case.

![Video 00:04:47: Classroom blackboard writing](</attachments/mit1806-99886c2acfda2aaa5e20a3af.jpg>)

*Video 00:04:47｜Approximately corresponding to Section 1 "1. Complex vectors: why length and inner product must be conjugate".*

## 2. Hermitian matrix and unitary matrix

With conjugate inner products, real symmetric matrices and orthogonal matrices have complex versions.

Real symmetric matrix requirements  $A^{\mathsf T}=A$. After the matrix becomes complex, transposition alone is not enough: the transposition swaps the elements on both sides of the diagonal, and the swapped complex elements must be conjugated again to be equal to the original one. So the correct promotion is



$$
A^{\mathsf H}=A,\qquad A^{\mathsf H}=\overline{A}^{\mathsf T},
$$



The matrix that satisfies it is called **Hermitian matrix**(Hermitian matrix).

Look at the diagonal first. When transposing, the elements on the diagonal remain in place, and then taking the conjugate requires it to be equal to its own conjugate, so **The diagonal elements of the Hermitian matrix must be real numbers**. Let’s look at the off-diagonal elements again: If  $(1,2)$  The location is  $3+i$, it transposes and runs to  $(2,1)$, then taking the conjugate must still equal  $3+i$, therefore  $(2,1)$  The location can only be  $3-i$. For example



$$
A=\begin{bmatrix}2&3+i\\3-i&5\end{bmatrix}
$$



is the Hermitian matrix: diagonal element  $2$  with  $5$  are real numbers, and the two off-diagonal elements are conjugate to each other. The two conclusions about real symmetric matrices in the previous lecture are true here - the eigenvalues ​​of the Hermitian matrix are real numbers, and the eigenvectors are perpendicular to each other; it is just that "perpendicularity" must be judged according to the inner product of the lower conjugate.

The concept of orthogonal is also copied. Let unitary matrix  $Q$  The columns are  $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$, **orthogonal** (orthonormal) means that the complex inner product of any two different columns is zero, and the inner product of each column with itself is one:



$$
\boldsymbol{q}_i^{\mathsf H}\boldsymbol{q}_j=
\begin{cases}
0,&i\ne j,\\
1,&i=j.
\end{cases}
$$



Writing this entire set of equations in matrix language is  $Q^{\mathsf H}Q=I$. In the case of real numbers, such a square matrix is called an orthogonal matrix, but in the case of complex numbers, it is renamed: **unitary matrix** (unitary matrix), that is, a complex square matrix with orthogonal columns. Changing the name itself is a signal - as long as you see the word "unitary", you should think that the elements of this matrix may be complex numbers, and conjugation must be included when judging orthogonality. The corresponding relationship between the two spaces can be listed as a comparison table:

| real numbers  $\mathbb{R}^n$ | plural  $\mathbb{C}^n$ |
| --- | --- |
| Transpose  $A^{\mathsf T}$ | conjugate transpose  $A^{\mathsf H}=\overline{A}^{\mathsf T}$ |
| Symmetry  $A^{\mathsf T}=A$ | Hermit  $A^{\mathsf H}=A$ |
| Orthogonal matrix  $Q^{\mathsf T}Q=I$ | unitary matrix  $Q^{\mathsf H}Q=I$ |
| length square  $\boldsymbol{x}^{\mathsf T}\boldsymbol{x}$ | length square  $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}$ |

The whole table reflects only one thing: every transpose in the complex case is followed by a conjugate.

![Video 00:11:19: Classroom blackboard writing](</attachments/mit1806-b61c1ecd9127516e0de38f2d.jpg>)

*Video 00:11:19 \| Approximately corresponding to Section 2 "2. Hermitian Matrix and Unitary Matrix".*

![Official Handout Summary Page 2/4](</attachments/mit1806-5171682e92a4173f721bb496.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 26 Summary, CC BY-NC-SA 4.0).*

## 3. Fourier matrix  $F_n$  with unit root

The Fourier matrix is the most important of the complex matrices. In order to write it, first change the subscript habit into the caliber of electrical engineering: from  $0$  Count to  $n-1$. The advantage is that all the following formulas are based on  $0$  as a starting point.

Fixed  $n$, order



$$
W=e^{2\pi i/n}=\cos\frac{2\pi}{n}+i\sin\frac{2\pi}{n}.
$$



This number lies on the unit circle in the complex plane, and the angle rotated is the circumference of the circle  $1/n$, therefore  $W^n=1$, which is the equation  $w^n=1$  one of the roots. A total of such roots  $n$ , all made of  $W$  to a power gives:



$$
1,\ W,\ W^2,\ \dots,\ W^{n-1},
$$



They are evenly arranged on the unit circle, $W$  called **Origin  $n$  subunit root**(primitive $n$-th root of unity). When calculating powers, do not use the real part and the imaginary part. It is fastest to use the exponential form: $(e^{2\pi i/n})^{k}=e^{2\pi ik/n}$, the angle is directly multiplied by  $k$.$n=6$  time  $W$  turn around  $60^\circ$, each power is turned in turn  $120^\circ,180^\circ,\dots$, the sixth power returns to  $1$, these six points are  $1$  The six sixth roots of .

These powers can never escape the unit circle: given a module of length  $1$  The square of the complex number is the square of the absolute value  $1^2$  Take it again and the result is still  $1$;The same is true for taking any power. So  $W$  The entire power sequence of is sliding on the circle, but the angles are constantly accumulating, and the rotation is full  $2\pi$  Just go back  $1$.

$n$  dimensional Fourier matrix  $F_n$  of the  $(i,j)$  The elements are  $W^{ij}$, among which  $i,j$  All from  $0$  get  $n-1$:



$$
F_n=\begin{bmatrix}
1&1&1&\cdots&1\\
1&W&W^2&\cdots&W^{n-1}\\
1&W^2&W^4&\cdots&W^{2(n-1)}\\
\vdots&\vdots&\vdots&\ddots&\vdots\\
1&W^{n-1}&W^{2(n-1)}&\cdots&W^{(n-1)^2}
\end{bmatrix}.
$$



The reading method is very regular: the first column is  $W^0$, the second column is  $W$  to various powers of , the third column is  $W^2$  to various powers of , the last column is  $W^{n-1}$  For each power of , the row direction is the same. due to  $W^{ij}=W^{ji}$, this matrix is symmetric, $F_n^{\mathsf T}=F_n$. But when  $n\ge3$  When it is, it is not a Hermitian matrix: non-real complex numbers appear in the elements, and they have to be conjugated after transposition, and  $F_n$  Not equal to its own conjugate.

take  $n=4$. At this time  $W=e^{2\pi i/4}=e^{i\pi/2}=i$, its powers are  $i,-1,-i,1$, exactly  $1$  of four fourth-order unit roots. Arrange it according to the formula:



$$
F_4=\begin{bmatrix}
1&1&1&1\\
1&i&-1&-i\\
1&-1&1&-1\\
1&-i&-1&i
\end{bmatrix}.
$$



Check line by line: Chapter  $3$  OK ($i=2$) elements are  $W^0,W^2,W^4,W^6$, that is  $1,-1,1,-1$;No.  $4$  OK ($i=3$) is  $W^0,W^3,W^6,W^9$, use  $W^4=1$  Simplified into  $1,-i,-1,i$. The entire matrix does not have a single zero element and is full - which is why direct multiplication is expensive.

![Video 00:18:11: Classroom blackboard writing](</attachments/mit1806-8bc48be9c6e2e88a87bd6b68.jpg>)

*Video 00:18:11｜Approximately corresponding to Section 3 "3. Fourier Matrix  $F_n$ "near the unit root".*

## 4. Column orthogonality and inverse matrix

The most important property of the Fourier matrix is that its columns are orthogonal to each other under the conjugate inner product. If this clause is not conjugated, it will be misunderstood.

in  $F_4$  Get the first place  $2$  Column and No.  $4$  Column:



$$
\text{col}_2=\begin{bmatrix}1\\i\\-1\\-i\end{bmatrix},
\qquad
\text{col}_4=\begin{bmatrix}1\\-i\\-1\\i\end{bmatrix}.
$$



If we directly use the transpose to do the dot product like real numbers, we get  $1\cdot1+i\cdot(-i)+(-1)(-1)+(-i)\cdot i=1+1+1+1=4$, does not appear to be equal to zero at all. But the first factor of the inner product must first be conjugated, $\overline{\text{col}_2}=(1,-i,-1,i)^{\mathsf T}$, so



$$
\overline{\text{col}_2}^{\ \mathsf T}\text{col}_4=1\cdot1+(-i)(-i)+(-1)(-1)+i\cdot i=1-1+1-1=0 .
$$



Orthogonality holds, at the cost of having to remember conjugation. If you miss this step, you will misjudge that two vertical columns are not vertical.

The length of each column is also easy to calculate. $F_4$  Each column of has four components, and the module length is  $1$, so the length squared is  $4$, the length is  $2$. So  $F_4$  The columns are orthogonal but not orthogonal. Divide the entire matrix by  $2$, we get a column orthogonal unitary matrix:



$$
\left(\tfrac12F_4\right)^{\mathsf H}\left(\tfrac12F_4\right)=\tfrac14F_4^{\mathsf H}F_4=I,
\qquad\text{即}\qquad
F_4^{\mathsf H}F_4=4I .
$$



The inverse matrix can therefore be written without any elimination:



$$
F_4^{-1}=\tfrac14F_4^{\mathsf H}.
$$



to general  $n$, the same reason is given  $F_n^{\mathsf H}F_n=nI$  with  $F_n^{-1}=\frac1n F_n^{\mathsf H}$. This is a great convenience for Fourier transform: the forward transform and the inverse transform use the same matrix, only differing by a conjugate and a constant factor, so the most common mistake in engineering is to confuse the two. There is another benefit: since the inverse matrix is just the conjugate transpose, then about  $F_4$  Any property learned can be translated into about  $F_4^{-1}$  Properties - both are structurally the same thing. Fourier himself knew this inverse matrix in the days before computers. What he failed to notice, but which later became extremely important, was another thing: the matrix could be decomposed into the product of a large number of zero-element factors, and thus could be multiplied extremely quickly.

## 5. Fast Fourier Transform: Put  $F_n$  Split into two halves

use  $F_n$  Multiply a vector, which is done by definition  $n^2$  Second multiplication: the matrix has  $n^2$  elements, and none of them is zero, it seems that they cannot be omitted. The whole point of the FFT is to decompose this matrix into the product of a number of sparse factors, so that most multiplications become "multiplications by zero" and thus don't have to be done at all.

The key to splitting is a simple relationship. Set  $W_n=e^{2\pi i/n}$  is  $n$  subunit root, then



$$
W_n^2=e^{4\pi i/n}=e^{2\pi i/(n/2)}=W_{n/2},
$$



i.e.  $n$  The square of the subunit root is exactly  $n/2$  Subunit root: $W_{64}$  turn in circle  $1/64$  Circle, square and then turn  $1/32$  circle, exactly  $W_{32}$. This connects Fourier matrices that are twice the size.

Specifically look at multiplication  $F_n\boldsymbol{x}$, its first  $k$  The components are  $\sum_{j=0}^{n-1}W^{kj}x_j$ (here  $W=W_n$). Split the subscripts according to odd and even numbers, $j=2m$  with  $j=2m+1$:



$$
\sum_{m}(W^2)^{km}x_{2m}+W^{k}\sum_{m}(W^2)^{km}x_{2m+1},
$$



The two sums are from  $m=0$  get  $n/2-1$. due to  $W^2=W_{n/2}$, the first sum is exactly  $F_{n/2}$  Acting on the even subscript component  $k$  components, the second sum is  $F_{n/2}$  Act on the odd subscript component and multiply  $W^k$. So



$$
y_k=\bigl(F_{n/2}\boldsymbol{x}_{\text{even}}\bigr)_k+W^{k}\bigl(F_{n/2}\boldsymbol{x}_{\text{odd}}\bigr)_k .
$$



$(W^2)^{km}$  About  $k$  The period is  $n/2$, so  $k=0,\dots,n/2-1$  The calculated results of the two halves can be directly moved to the second half, but the sign needs to change: $W^{k+n/2}=W^k\cdot W^{n/2}=-W^k$. Therefore



$$
y_{k+n/2}=\bigl(F_{n/2}\boldsymbol{x}_{\text{even}}\bigr)_k-W^{k}\bigl(F_{n/2}\boldsymbol{x}_{\text{odd}}\bigr)_k .
$$



Write these two equations as matrices, with  $n=64$  For example:



$$
F_{64}=
\begin{bmatrix}I&D\\ I&-D\end{bmatrix}
\begin{bmatrix}F_{32}&0\\ 0&F_{32}\end{bmatrix}
P ,
$$



Among them  $D=\operatorname{diag}(1,W,W^2,\dots,W^{31})$  take  $W=W_{64}$. The division of labor between the three areas is very clear. rightmost  $P$  is **permutation matrix** (permutation matrix), arrange the components with even subscripts to the front and the components with odd subscripts to the back. $\boldsymbol{x}\mapsto(x_0,x_2,x_4,\dots,x_1,x_3,x_5,\dots)$;It's just renumbering, it's hardwired in the computer and takes almost no time. For the middle piece, do it once for both halves.  $32$  Dimensional Fourier Transform - The two halves of the calculation are independent of each other and can be fully parallelized. The leftmost diagonal block adds and subtracts the results of the two halves: the upper half block outputs "even half + $D$  Multiply the odd half" and the second half block outputs "even half − $D$ "Multiply an odd half", so the only thing that really needs to be multiplied in this area is  $D$, $I$  and permutation do not contribute multiplication.

Costs dropped immediately: original  $64^2=4096$  times multiplication, now twice  $32$  Dimension transformation total  $2\cdot32^2=2048$  times, add more **diagonal matrix**(diagonal matrix)$D$  of  $32$  revisions, total  $2080$  times. This is just one layer removed; two  $32$  Dimension transformation continues to be dismantled, and only new layers are added at each layer.  $32$  multiplication without having to pay the square-level price - that's the whole secret: cut the big matrix in half layer by layer, sandwiching a permutation and a diagonal correction in each layer.

![Video 00:31:07: Classroom blackboard writing](</attachments/mit1806-334724cf07c792c143102f27.jpg>)

*Video 00:31:07｜Approximately corresponding to Section 5 "5. Fast Fourier Transform:  $F_n$  Split it into two half-sized pieces."*

![Official Handout Summary Page 3/4](</attachments/mit1806-9c8e4cde037d844ecd9075e5.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 26 Summary, CC BY-NC-SA 4.0).*

![Video 00:37:20: Classroom blackboard writing](</attachments/mit1806-c34b26fa8eb8a06be8933256.jpg>)

*Video 00:37:20｜Approximately corresponding to Section 5 "5. Fast Fourier Transform:  $F_n$  Split it into two half-sized pieces."*

## 6. Recursion: from  $n^2$  Arrive  $\frac12 n\log_2 n$

$2048$  times is still too many because the same idea can be continued: each  $F_{32}$  reuse  $W_{32}^2=W_{16}$  split into two  $F_{16}$, each with an odd-even permutation and a diagonal correction. Judging from the subscripts, the first permutation divides the components into two groups of "even" and "odd", and the second permutation divides the components into even and odd respectively, so the original vector is divided into four groups: even and even  $(x_0,x_4,x_8,\dots)$, Odd  $(x_2,x_6,x_{10},\dots)$, odd and even  $(x_1,x_5,x_9,\dots)$, Qiqi  $(x_3,x_7,x_{11},\dots)$ (The former word indicates which half the first layer falls on, and the latter word indicates the second layer.) The four groups do it separately.  $16$  Dimension transformation, and finally use sign correction to spell it back. So  $64^2$  This item is replaced by



$$
2\cdot32^2+32\ \longrightarrow\ 4\cdot16^2+2\cdot16+32\ \longrightarrow\ 8\cdot8^2+4\cdot8+2\cdot16+32\ \longrightarrow\cdots
$$



The total correction cost for each level is  $32$: $D$  scale from  $32$  halved to  $16$, $8$..., but the number of blocks in the same layer is doubled, so the total remains the same. The recursion goes all the way until the middle Fourier block becomes  $1$  Dimensions, until multiplication is no longer needed. What is the number of layers? from  $64$  down to  $32$, $16$, $8$, $4$, $2$, $1$, a total of  $6$  step, that is  $\log_2 64=6$. The total number of multiplications is



$$
6\times 32=192=\tfrac12\cdot 64\cdot\log_2 64 .
$$



Generally, use  $T(n)$  remember  $n$  The number of multiplications of the dimensional Fourier transform, $T(n)=2T(n/2)+n/2$, the solution is



$$
T(n)=\frac{n}{2}\log_2 n .
$$



Take a look at a representative number: $n=2^{10}=1024$. At this time  $n^2=1\,048\,576$, more than one million; while the new algorithm only needs



$$
\frac12\cdot 1024\cdot 10=5120=5\cdot 1024
$$



times. The original magnitude is  $1024$  multiply  $1024$, now only  $5$  multiply  $1024$, reduced by approx.  $200$  Times: In the same time, the Fourier transform could be done once before, but now it can be done two hundred times.

The essence of FFT is clear at this point: it does not change the Fourier matrix, it just refactors it. Remove it layer by layer, and a series of permutation matrices are accumulated on the right side, and a series of permutation matrices are accumulated on the left side.  $I$  with  $D$, $I$  with  $-D$  Modification of the form, the center getting smaller and smaller until it disappears. Each layer only spends  $n/2$  times multiplication, a total of  $\log_2 n$  layer. Half of the reason why the Fourier matrix is ​​so special is that its columns are orthonormal and the inverse matrix is ​​almost free; the other half is that its elements are all powers of the same unit root, which allows it to be recursively split in half according to the odd and even subscripts. Only by combining the two properties can we get  $n^2$  Reduced  $\frac12 n\log_2 n$.

![Video 00:43:05: Classroom blackboard writing](</attachments/mit1806-019f3ba3db0ef25ba3dbcb3f.jpg>)

*Video 00:43:05｜Approximately corresponding to Section 6 "6. Recursion: from  $n^2$  Arrive  $\frac12 n\log_2 n$"Nearby.*

![Official Handout Summary Page 4/4](</attachments/mit1806-a31f3fc20e16ffe3b72f3210.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 26 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The square length of a complex vector is  $\boldsymbol{z}^{\mathsf H}\boldsymbol{z}=\sum|z_i|^2$, no  $\boldsymbol{z}^{\mathsf T}\boldsymbol{z}$: $\boldsymbol{z}=(1,i)$  when the former is equal to  $2$, length  $\sqrt2$, the latter is equal to  $0$.
- The basic rule for the complex case is "the transposition must take the conjugate": $\boldsymbol{z}^{\mathsf H}=\overline{\boldsymbol{z}}^{\mathsf T}$, the inner product is changed to  $\boldsymbol{y}^{\mathsf H}\boldsymbol{x}$, generally takes a complex value.
- The Hermitian matrix is given by  $A^{\mathsf H}=A$  Definition, the diagonal elements must be real numbers, and the non-diagonal elements must be conjugate pairs, such as  $\begin{bmatrix}2&3+i\\3-i&5\end{bmatrix}$; Its eigenvalues are real numbers, and the eigenvectors are perpendicular to each other.
- The unitary matrix is a complex square matrix with orthogonal columns. $Q^{\mathsf H}Q=I$;It corresponds to the orthogonal matrix for the real number case.
- Fourier matrix  $(F_n)_{ij}=W^{ij}$, $W=e^{2\pi i/n}$  It's the origin  $n$  subunit roots; $n=4$  time  $W=i$, $F_4$  The elements are only  $1,\pm i,-1$, and  $F_n^{\mathsf T}=F_n$; $n\ge3$  when it is not a Hermitian matrix ($n=2$  time  $F_2$  is a real symmetric matrix).
- $F_n$  The columns of are orthogonal to each other, and the length of each column is  $\sqrt n$, so  $F_n^{\mathsf H}F_n=nI$, $F_n^{-1}=\frac1nF_n^{\mathsf H}$; If no conjugation is taken, $F_4$  of the  $2$  Column and No.  $4$  Column will calculate  $4$  instead of  $0$.
- The core identity of FFT is  $W_n^2=W_{n/2}$, thus obtaining the block decomposition  $F_{n}=\begin{bmatrix}I&D\\I&-D\end{bmatrix}\begin{bmatrix}F_{n/2}&0\\0&F_{n/2}\end{bmatrix}P$, $D=\operatorname{diag}(1,W,\dots,W^{n/2-1})$, $P$  It's an odd-even permutation.
- cost from  $n^2$  reduced to  $2(n/2)^2+n/2$, the total number of corrections at each level after recursion  $n/2$, total  $\log_2 n$  layers, total  $\frac12n\log_2 n$; $n=64$  When  $4096$  reduced to  $192$.
- $n=1024$  time  $n^2=1\,048\,576$  And FFT only needs  $5120$  times multiplication, fast approximation  $200$  times.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| complex conjugate | complex conjugate | The operation of changing the sign of the imaginary part of a complex number is recorded as  $\overline{z}$ |
| conjugate transpose | conjugate transpose | First transpose and then take the conjugate, written as  $A^{\mathsf H}$, standard actions in complex space |
| Hermitian matrix | Hermitian matrix | satisfy  $A^{\mathsf H}=A$  is a complex square matrix with real diagonal elements and conjugate pairs of non-diagonal elements. |
| unitary matrix | unitary matrix | Column orthogonal complex square matrix, $Q^{\mathsf H}Q=I$ |
| Fourier matrix | Fourier matrix | No.  $(i,j)$  Yuanwei  $W^{ij}$  is a complex matrix whose columns are orthogonal |
| root of unity | unit root | satisfy  $w^n=1$  The plural form of  $e^{2\pi ik/n}$ |
| fast Fourier transform (FFT) | Fast Fourier Transform | take advantage of  $W_n^2=W_{n/2}$  put  $F_n$  Decomposed into sparse factors, the cost is from  $n^2$  down to  $\frac12n\log_2 n$ |
| permutation matrix | permutation matrix | Matrix with swapped component order, used for rearrangement of odd and even subscripts in FFT |
| diagonal matrix | diagonal matrix | A matrix whose off-diagonal elements are all zeros, $D=\operatorname{diag}(1,W,\dots,W^{n/2-1})$ |
| orthonormal | orthogonal | Pairs are orthogonal and their lengths are all  $1$, complex case application  $\boldsymbol{q}_i^{\mathsf H}\boldsymbol{q}_j=\delta_{ij}$  Judgment |

---

[← Lecture 25](/en/notes/mit-1806/lec25) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 27 →](/en/notes/mit-1806/lec27)
