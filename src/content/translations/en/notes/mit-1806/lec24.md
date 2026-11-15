---
kind: notes
source: mit-1806/lec24
title: Lecture 24 · Markov matrix and Fourier series
description: Understand the stationary state of Markov matrices and the
  projective structure of Fourier series.
sourceHash: 5cb55d067b3fca97e36a0a3a15bfd155fdf3815984c683d1150e84faead2ade5
publish: true
translationMethod: machine-assisted
---

> *Markov matrices; fourier series* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 24 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p24 · Markov matrix and Fourier series](https://www.bilibili.com/video/BV1ix411f7Yp?p=24)(51:12)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-24-markov-matrices-fourier-series/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=24&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lectures, we have used eigenvalues and eigenvectors to solve difference equations and differential equations: as long as the initial vector can be expanded into a combination of eigenvectors, $A^k\boldsymbol{u}_0$  with  $e^{At}\boldsymbol{u}_0$  can be written  $\lambda_i^k$  and  $e^{\lambda_i t}$  The long-term behavior is determined by the eigenvalue with the largest absolute value (differential case) and the eigenvalue with the largest real part (differential case) respectively. This lecture applies this idea to two types of objects: the first half of the lecture is about probability and population mobility. **Markov matrix** (Markov matrix), the second half of the lecture is to extend the idea of "expanding under a basis" to function space, and we get **Fourier series**(Fourier series).

Markov matrices are a very special type of matrix: all elements are non-negative, and the sum of the elements in each column is equal to  $1$. These two conditions seem to be just the language of probability theory, but they directly determine its spectral structure——$\lambda=1$  It must be an eigenvalue, and the absolute value of the other eigenvalues does not exceed  $1$. So power  $A^k$  will not diverge; as long as there are no other models  $1$  eigenvalues, with  $k$  increase, $\lambda=1$  Which one remains to be **Steady state** (steady state), and all other items are attenuated. In the previous lecture, the steady state of differential equations depends on  $\lambda=0$, but what we rely on here is  $\lambda=1$. This time  $1$  with  $0$  The exchange of  $A$ The difference between the two operations "" and "derivative with respect to time".

The second half of the lecture changed the stage:  $\mathbb{R}^n$  Change to function space. Functions can be added and multiplied, so they also form a vector space; the difference between two functions **inner product** (inner product) uses integral instead of dot product, and  $1,\cos x,\sin x,\cos 2x,\sin 2x,\dots$  Pairs of these inner products are orthogonal, forming a set of infinite-dimensional orthogonal bases. So a periodic function is expanded according to this set of bases, and the coefficients are "sieved" out one by one using inner products just like in the finite-dimensional case - this is the Fourier series, and it is also the most beautiful application of the projection chapter.

![Official Handout Summary Page 1/4](</attachments/mit1806-a2759359e40383bd89c88eba.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 24 Summary, CC BY-NC-SA 4.0).*

## 1. Markov matrix and its two properties

A square matrix is called **Markov matrix**, if it satisfies both conditions:

1. Every element is nonnegative: $a_{ij}\ge 0$;
2. The sum of the elements in each column is equal to  $1$: $\sum_{i}a_{ij}=1$.

Just write down an example:



$$
A=\begin{bmatrix}
0.1&0.01&0.3\\
0.2&0.99&0.3\\
0.7&0&0.4
\end{bmatrix}.
$$



The sum of the three columns is  $0.1+0.2+0.7=1$, $0.01+0.99+0=1$, $0.3+0.3+0.4=1$, the elements also have no negative numbers, so it is indeed a Markov matrix. Elements are allowed to be equal to  $0$——In the example  $(3,2)$  The location is  $0$, meaning there is no direct transition from the second state to the third state - it is just not allowed to be negative.

Why do these two properties always appear in pairs? Because they come from the same application scenario: interpreting matrix elements as **Probability**. No.  $j$  Column describes "is in state  $j$  Where does the object go next”, where  $a_{ij}$  is from the state  $j$  transfer to state  $i$  proportion. The ratio cannot be negative, this is the first point; all objects must have a place to go (including staying in the original state), so the first point  $j$  The elements of the column add up to exactly  $1$, this is the second article.

Viewed this way, matrix powers are easy to understand: $A^2$  The element of is the proportion of "starting from a certain state and reaching another state after two steps", which is still a probability, and the column sum is still  $1$. In general, any power of a Markov matrix is ​​still a Markov matrix. This can also be verified directly. Remember everything  $1$  The row vector is  $\boldsymbol{1}^{\mathsf T}=(1,1,\dots,1)$, "The sum of each column is  $1$” is exactly equivalent to



$$
\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}.
$$



Take both sides to the right  $A$, got  $\boldsymbol{1}^{\mathsf T}A^2=\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}$, and then the same holds true. So "the column sum is  $1$” This property is not lost when exponentiation is repeated, nor is the non-negativity, because the product of a non-negative matrix remains non-negative.

The equation studied in this lecture is



$$
\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k,\qquad \boldsymbol{u}_k=A^k\boldsymbol{u}_0,
$$



Among them  $\boldsymbol{u}_k$  of the  $i$  component represents the  $k$  step in state  $i$  quantity or proportion. Since the sum of each column is  $1$, the total quantity is conserved throughout the process:



$$
\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_{k+1}=\boldsymbol{1}^{\mathsf T}A\boldsymbol{u}_k=\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_k .
$$



This is exactly what "the probabilities add up to  $1$", a matrix writing method that neither loses nor increases population.

![Video 00:05:07: Classroom blackboard writing](</attachments/mit1806-4321d9a522f3e8906f49557c.jpg>)

*Video 00:05:07 \| Approximately corresponding to Section 1 "1. Markov matrix and its two properties".*

## 2. Steady state: $\lambda=1$  role

The spectral structure of a Markov matrix is characterized by two key facts:

1. $\lambda=1$  It must be  $A$  eigenvalues;
2. The absolute values of the remaining eigenvalues are less than  $1$ (In individual cases it may be equal to  $1$, but never greater than  $1$).

In Article 2, "equal to  $1$” exception will make the corresponding item  $\lambda_i^k$  Without decay, the long-term behavior no longer converges to a single direction; as long as there are no such exceptions, the following derivation holds.

Take these two first and see how they determine long-term behavior. Set  $A$  Yes  $n$  linearly independent eigenvectors  $\boldsymbol{x}_1,\dots,\boldsymbol{x}_n$, corresponding to the eigenvalue  $\lambda_1,\dots,\lambda_n$, among which  $\lambda_1=1$. Expand the initial vector under these eigenvectors:



$$
\boldsymbol{u}_0=c_1\boldsymbol{x}_1+c_2\boldsymbol{x}_2+\cdots+c_n\boldsymbol{x}_n .
$$



Multiply both sides  $A^k$, use  $A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i$, got



$$
\boldsymbol{u}_k=A^k\boldsymbol{u}_0
=c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2+\cdots+c_n\lambda_n^k\boldsymbol{x}_n .
$$



There is a premise that must be pointed out here: there must be enough feature vectors to fill the entire space, otherwise  $\boldsymbol{u}_0$  It cannot be expanded at all, and the calculation cannot be started-that is,  $A$  Must be diagonalizable.

now order  $k\to\infty$. In the first item  $\lambda_1^k=1^k=1$  remain unchanged, the other factors  $|\lambda_i|<1$  And tends to zero, so



$$
\boldsymbol{u}_k\longrightarrow c_1\boldsymbol{x}_1 .
$$



The modulus of the remaining eigenvalues are strictly smaller than  $1$  situation, this is **Steady state**: No matter what the initial distribution is, the system finally falls on the eigenvector  $\boldsymbol{x}_1$  In the direction, the specific multiple is determined by the initial conditions. It will be clearer if you compare it with the differential equation in the previous lecture. Over there  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$  The solution contains  $e^{\lambda t}$, steady state corresponding to  $\lambda=0$, because  $e^{0t}=1$  is the only term that does not change with time; here it is replaced by a discrete power, $0^k$  Die in one step, $1^k=1$  is the unchanging term. So "what's left after a long time" is taken care of by different eigenvalues, depending on whether time is continuous or discrete.

$\boldsymbol{x}_1$  There is another property: all its components are non-negative; if all components of the initial vector are positive, then all components of the steady state are also positive. This is not a coincidence, but a manifestation of "the probability will not become negative" in the eigenvector. This lecture does not give a proof of this property, but only uses it to check whether the calculated results are reasonable.

![Video 00:11:01: Classroom blackboard writing](</attachments/mit1806-e092babb2c12ca391c986d87.jpg>)

*Video 00:11:01｜Approximately corresponding to Section 2 "2. Steady state: $\lambda=1$  character" nearby.*

## 3. Why  $1$  Must be an eigenvalue

to prove  $1$  is an eigenvalue, which is equivalent to proving  $A-I$  singular, because the eigenvalues are those that make  $A-\lambda I$  Strange numbers. The key is to find out from the two properties of the Markov matrix  $A-I$  problems.

look  $A-I$  of columns. $A$  The sum of each column of is  $1$; Identity matrix  $I$  Each column of has only one  $1$, so the sum of each column is also  $1$. The two columns are subtracted correspondingly, $A-I$  The sum of each column of is  $1-1=0$. The example in the previous section gives



$$
A-I=\begin{bmatrix}
-0.9&0.01&0.3\\
0.2&-0.01&0.3\\
0.7&0&-0.6
\end{bmatrix},
$$



Sum the three columns separately: $-0.9+0.2+0.7=0$, $0.01-0.01+0=0$, $0.3+0.3-0.6=0$, indeed all zeros.

A column sum of zero means that  $A-I$  Adding all three rows of will result in zero rows:



$$
\begin{bmatrix}1&1&1\end{bmatrix}(A-I)=\begin{bmatrix}0&0&0\end{bmatrix}.
$$



thus  $A-I$  The three rows are linearly related. The linear correlation between the row vectors of a square matrix means singularity, so  $\det(A-I)=0$, $\lambda=1$  is the characteristic value. This argument is valid for any Markov matrix, and there is no need to calculate the determinant at all - which is exactly what this lecture wants: to read the spectral information directly from the structure of the matrix.

Note  $(1,1,1)$  appears: it is multiplied to the left, so it is  $A-I$  of **left null space** (left nullspace); in other words, it is  $A^{\mathsf T}$  About eigenvalues  $1$  eigenvector of  $A$  own feature vector. looking for  $A$  eigenvector  $\boldsymbol{x}_1$, need to see  $A-I$  The null space of  $A-I$  The coefficients of the columns of combine into zero vectors because



$$
(A-I)\boldsymbol{x}_1=\boldsymbol{0}
$$



Exactly  $A\boldsymbol{x}_1=\boldsymbol{x}_1$  of deformation. This set of coefficients is the steady state. Looking back, this is the general process for finding feature vectors: first solve  $\det(A-\lambda I)=0$  Set  $\lambda$, then solve  $(A-\lambda I)\boldsymbol{x}=\boldsymbol{0}$  Set  $\boldsymbol{x}$. The only special thing about Markov matrices is that the first step is free.

Incidentally, you can get a fact about transposition: $A$  with  $A^{\mathsf T}$  The eigenvalues are exactly the same. The reason is



$$
\det(A-\lambda I)=\det\bigl((A-\lambda I)^{\mathsf T}\bigr)=\det(A^{\mathsf T}-\lambda I),
$$



The first step uses "the determinant of a matrix is equal to its transposed determinant". So  $A-\lambda I$  Strange if and only if  $A^{\mathsf T}-\lambda I$  Strange, the eigenvalue sets of both are consistent. Back to the Markov situation: already found  $A^{\mathsf T}$  About  $\lambda=1$  The eigenvector of is  $(1,1,1)$, this fact guarantees the same  $1$  Also  $A$  eigenvalues. But the eigenvectors on both sides are different, and the left null space and the null space are two different things.

Now take the example  $\boldsymbol{x}_1$  Figure it out. solution  $(A-I)\boldsymbol{x}=\boldsymbol{0}$:



$$
\begin{cases}
-0.9x_1+0.01x_2+0.3x_3=0,\\
0.2x_1-0.01x_2+0.3x_3=0,\\
0.7x_1-0.6x_3=0.
\end{cases}
$$



The eigenvectors can be arbitrarily scaled, so shilling  $x_1=6$. The third equation gives  $0.7\times 6=0.6x_3$, that is  $x_3=7$. Back to the first equation: $-0.9\times6+0.3\times7=-5.4+2.1=-3.3$, to reset it to zero, you need  $0.01x_2=3.3$, that is  $x_2=330$. So



$$
\boldsymbol{x}_1=\begin{bmatrix}6\\330\\7\end{bmatrix}.
$$



Substitute back into the second equation to check: $0.2\times6-0.01\times330+0.3\times7=1.2-3.3+2.1=0$, correct. The three components are all positive numbers, which is consistent with the previous statement of "steady state is non-negative". If normalized by the sum of the components ($6+330+7=343$), get  $(6,330,7)/343$  It is the steady-state probability distribution over the three states.

![Official Handout Summary Page 2/4](</attachments/mit1806-bb4e0bb9041a612fe03a3ffa.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 24 Summary, CC BY-NC-SA 4.0).*

![Video 00:19:27: Classroom blackboard writing](</attachments/mit1806-5a42a0a7f932e350eeccdda1.jpg>)

*Video 00:19:27｜Approximately corresponding to Section 3 "3. Why  $1$  It must be near the "eigenvalue".*

## 4. An example: Population movement between California and Massachusetts

Where does the Markov matrix come from? The most intuitive source is population migration between two states. Set  $u_{\text{Cal}}(k)$, $u_{\text{Mass}}(k)$  respectively  $k$  For the population of California and Massachusetts in 2015, if the proportion of migration is fixed every year, then



$$
\begin{bmatrix}u_{\text{Cal}}\\u_{\text{Mass}}\end{bmatrix}_{k+1}
=\begin{bmatrix}0.9&0.2\\0.1&0.8\end{bmatrix}
\begin{bmatrix}u_{\text{Cal}}\\u_{\text{Mass}}\end{bmatrix}_{k}.
$$



Read this matrix according to the convention of "columns are sources and rows are destinations": The first column talks about Californians——$90\%$  Stay in California, $10\%$  Moving to Massachusetts; the second column talks about people from Massachusetts -$80\%$  stay, $20\%$  Moved to California. The sum of both columns is  $1$, since everyone is counted once, the total population neither increases nor decreases. The matrix is ​​the same at every step, which is a strong limitation in the example: the migration ratio remains the same from year to year.

Assuming that everyone is in Massachusetts at the initial time, a total of  $1000$  people, that is  $\boldsymbol{u}_0=(0,1000)^{\mathsf T}$. Take one step:



$$
\boldsymbol{u}_1=A\boldsymbol{u}_0
=1000\begin{bmatrix}0.2\\0.8\end{bmatrix}
=\begin{bmatrix}200\\800\end{bmatrix},
$$



$200$  People arrived in California. Taking another step, some people moved back:



$$
\boldsymbol{u}_2=A\boldsymbol{u}_1=\begin{bmatrix}340\\660\end{bmatrix},
$$



California has more than  $200$, Massachusetts dropped to  $800$  Below, the sum is still  $1000$. Want to know  $100$  For the population after steps or even infinite steps, eigenvalues and eigenvectors must be found.

Eigenvalues are easy to find. $\lambda_1=1$  From "column sum to  $1$"Direct guarantee; use trace (sum of diagonal elements) $0.9+0.8=1.7$, obtained by "the sum of eigenvalues is equal to the trace" $\lambda_2=1.7-1=0.7$. You can also check using determinants: $0.9\times0.8-0.2\times0.1=0.72-0.02=0.70$.$\lambda_2=0.7<1$, consistent with key fact two.

Then find the eigenvector. $\lambda=1$  time



$$
A-I=\begin{bmatrix}-0.1&0.2\\0.1&-0.2\end{bmatrix},
$$



The two rows are the opposite numbers of each other, and the null space is given by  $(2,1)^{\mathsf T}$  Zhang Cheng, take  $\boldsymbol{x}_1=(2,1)^{\mathsf T}$, both components are positive. $\lambda=0.7$  time



$$
A-0.7I=\begin{bmatrix}0.2&0.2\\0.1&0.1\end{bmatrix},
$$



The null space is given by  $(1,-1)^{\mathsf T}$  Zhang Cheng, take  $\boldsymbol{x}_2=(1,-1)^{\mathsf T}$. So



$$
\boldsymbol{u}_k=c_1\,1^k\begin{bmatrix}2\\1\end{bmatrix}
+c_2\,(0.7)^k\begin{bmatrix}1\\-1\end{bmatrix}.
$$



use  $k=0$  The initial conditions of are constants: $2c_1+c_2=0$, $c_1-c_2=1000$, the solution is  $c_1=1000/3$, $c_2=-2000/3$. So



$$
\boldsymbol{u}_k=\frac{1000}{3}\begin{bmatrix}2\\1\end{bmatrix}
-\frac{2000}{3}(0.7)^k\begin{bmatrix}1\\-1\end{bmatrix}.
$$



take  $k=1$  Verification: California  $=\frac{2000}{3}(1-0.7)=\frac{2000}{3}\times0.3=200$, Massachusetts  $=\frac{1000}{3}+\frac{2000}{3}\times0.7=\frac{1000}{3}+\frac{1400}{3}=800$, consistent with the result of direct matrix multiplication.

The steady state is the first term in the expression: $(2000/3,\,1000/3)\approx(667,333)$, it is  $(2,1)^{\mathsf T}$  multiples of the total population  $1000$  Set out. Second term with factor  $0.7^k$, follow  $k$  The enlargement disappears rapidly; $0.7^{100}$  is already small enough to be ignored, so  $100$  After this step, the population will be almost  $(666.7,\,333.3)$. That answers "$A$  of  $100$  The second power acts on  $\boldsymbol{u}_0$  Questions like "How much is the number above?": There is no need to actually multiply the  $100$  times, as long as you see clearly  $0.7^{100}$  How small is this one.

One last note: Some textbooks (especially books on electrical engineering and probability theory) are accustomed to using row vectors, written as  $\boldsymbol{u}_{k+1}^{\mathsf T}=\boldsymbol{u}_k^{\mathsf T}M$. At this time  $M=A^{\mathsf T}$, the condition "column sum is  $1$” becomes “action and behavior”  $1$". The two ways of writing describe the same thing, the only difference is whether to multiply on the left or the right, and whether to transpose.

![Video 00:33:17: Classroom blackboard writing](</attachments/mit1806-69ad3e096c3934b16e3910cf.jpg>)

*Video 00:33:17｜Approximately corresponding to Section 4 "4. An example: Population migration between California and Massachusetts".*

## 5. Expansion under orthonormal basis

Go to the second half of this lecture. Let’s review a fact first: Suppose  $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$  is a group **orthogonal** (orthonormal) vectors, that is, two pairs of orthogonal vectors with lengths  $1$, and they span into the entire  $\mathbb{R}^n$, then they form a set of basis, any vector  $\boldsymbol{v}$  can be expanded into



$$
\boldsymbol{v}=x_1\boldsymbol{q}_1+x_2\boldsymbol{q}_2+\cdots+x_n\boldsymbol{q}_n .
$$



The question is how to find these coefficients. The method is surprisingly simple: use  $\boldsymbol{q}_1$  Take the inner product with both sides of the equation. due to  $\boldsymbol{q}_1^{\mathsf T}\boldsymbol{q}_1=1$, while  $\boldsymbol{q}_1^{\mathsf T}\boldsymbol{q}_j=0$($j\neq 1$), with only one item left on the right:



$$
\boldsymbol{q}_1^{\mathsf T}\boldsymbol{v}=x_1 .
$$



for each  $i$  In the same way, $x_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{v}$. Each coefficient is  $\boldsymbol{v}$  component in the direction of the corresponding basis vector. This is exactly the projection: put  $\boldsymbol{v}$  projected onto  $n$  In two mutually perpendicular base directions, the obtained length is the coefficient. In other words, the orthonormal basis turns "expansion" into a series of inner products, without solving equations or inverting matrices.

Write this in matrix form. order  $Q$  to  $\boldsymbol{q}_1,\dots,\boldsymbol{q}_n$  is a column, then the expansion is  $Q\boldsymbol{x}=\boldsymbol{v}$, the formal solution is  $\boldsymbol{x}=Q^{-1}\boldsymbol{v}$. while standard orthogonality gives



$$
Q^{\mathsf T}Q=I,
$$



i.e.  $Q^{-1}=Q^{\mathsf T}$, so  $\boldsymbol{x}=Q^{\mathsf T}\boldsymbol{v}$. its first  $i$  The components are  $Q^{\mathsf T}$  of the  $i$  OK (i.e.  $\boldsymbol{q}_i^{\mathsf T}$) and  $\boldsymbol{v}$  The inner product of is exactly the same as the result calculated one by one. see letters  $Q$  should have thought of  $Q^{-1}=Q^{\mathsf T}$——This is the greatest convenience brought by the standard orthonormal basis.

This section is still finite-dimensional, but all the preparations required for the Fourier series are in place: the "basis vectors" there are no longer  $\mathbb{R}^n$  vector in , but a function.

![Official Handout Summary Page 3/4](</attachments/mit1806-f81fdeb57b13043d6b416f04.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 24 Summary, CC BY-NC-SA 4.0).*

## 6. Fourier series

The problem to be solved by Fourier series is: convert a function  $f(x)$  Written as a constant term, $\cos x$, $\sin x$, $\cos 2x$, $\sin 2x$ A linear combination of...,



$$
f(x)=a_0+a_1\cos x+b_1\sin x+a_2\cos 2x+b_2\sin 2x+\cdots
$$



It looks exactly like the expansion in the previous section, the only difference is that there are infinite polynomials. Why do we need an infinite number of items? Because the function space is **infinite dimensions**: A function that takes multiple consecutive values in the interval cannot be completely described by a finite number of parameters, so an infinite number of basis functions are needed. This step marks leaving the finite-dimensional vector space and entering the infinite-dimensional situation.

The basis functions used are



$$
1,\ \cos x,\ \sin x,\ \cos 2x,\ \sin 2x,\ \dots
$$



They all start with  $2\pi$  is a period, so it can only be used to express the same  $2\pi$  is a function of the period, that is  $f(x+2\pi)=f(x)$;The integral interval is therefore taken as  $[0,2\pi]$.

Next we need to define the inner product of the function. The finite dimensional dot product is  $\boldsymbol{v}^{\mathsf T}\boldsymbol{w}=v_1w_1+\cdots+v_nw_n$: Multiply point by point and add the results. The function takes multiple consecutive values in the interval, and the "sum" after point-by-point multiplication becomes an integral:



$$
\langle f,g\rangle=\int_0^{2\pi}f(x)g(x)\,\mathrm{d}x .
$$



The reason why this set of basis is useful is that they are orthogonal to each other under this inner product. to  $\sin x$  with  $\cos x$  For example:



$$
\int_0^{2\pi}\sin x\cos x\,\mathrm{d}x
=\left[\frac12\sin^2x\right]_0^{2\pi}=0 .
$$



All other combinations are also zero (with the help of some trigonometric identities). The easiest group to verify is the constant function with  $\cos x$:



$$
\int_0^{2\pi}1\cdot\cos x\,\mathrm{d}x=\bigl[\sin x\bigr]_0^{2\pi}=0 .
$$



And the inner product of each basis function and itself is not zero, for example



$$
\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi .
$$



So this is a set of orthonormal basis, but not yet normalized: $\cos nx$, $\sin nx$  The "length" of is  $\sqrt{\pi}$, constant function  $1$  The "length" of is  $\sqrt{2\pi}$, neither  $1$. What are the coefficients in the formula?  $\pi$  The denominator of comes from here.

How to find the coefficient? The method is exactly the same as for finite dimensions: which coefficient you want to find, use the corresponding basis function to do the inner product with both sides of the equation. Find the constant term  $a_0$, just use the constant function  $1$  To multiply and to integrate. The remaining items on the right are the same as  $1$  The inner products of are all zero, leaving only



$$
\int_0^{2\pi}f(x)\,\mathrm{d}x=a_0\int_0^{2\pi}1\,\mathrm{d}x=2\pi a_0,
$$



So



$$
a_0=\frac{1}{2\pi}\int_0^{2\pi}f(x)\,\mathrm{d}x,
$$



it happens to be  $f$  average over the interval. This is also intuitive: the constant term is the constant that is "contained on average" in the function.

More typically  $a_1$. Multiply both sides of the expansion by  $\cos x$  Point again. Due to orthogonality, the right-hand side  $a_1\cos x$  Everything except that item disappears, leaving only



$$
\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x
=a_1\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi a_1,
$$



thus



$$
a_1=\frac{1}{\pi}\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x .
$$



The same approach is given for each  $a_n$  and  $b_n$: use  $\cos nx$  or  $\sin nx$  To do the inner product, only the corresponding term on the right side remains, and the denominators are both  $\pi$ (The constant term is  $2\pi$). This is the coefficient formula of the Fourier series, often called Euler's formula. The meaning of the coefficients is very specific: $a_0$  is how many constants the function contains, $a_1$  How much does it contain  $\cos x$, $b_1$  How much does it contain  $\sin x$, and so on, each  $a_n$, $b_n$  Metric No.  $n$  The amount of harmonics. The action of finding the coefficients can also be said straightforwardly: multiply the expansion by a certain basis function and then integrate. All other terms will be killed by orthogonality, leaving only the desired term.

Looking back at the structure of the entire derivation, it corresponds verbatim to Section 5: vectors are replaced by functions, dot products are replaced by definite integrals, the addition of finite terms is replaced by infinite series, and orthogonal vectors are replaced by orthogonal function systems; and the rule "the coefficient is equal to the inner product divided by the square of the length of the basis function" has not changed a word. The Fourier series can be established not by analytical skills, but by the existence of orthogonal basis in the function space.

![Video 00:40:42: Classroom blackboard writing](</attachments/mit1806-2243373d4ece1460ec7f813e.jpg>)

*Video 00:40:42 \| Approximately corresponding to Section 6 "6. Fourier Series".*

![Video 00:46:05: Classroom blackboard writing](</attachments/mit1806-8eb9b2c37484b6ef0b5cd0d1.jpg>)

*Video 00:46:05 \| Approximately corresponding to Section 6 "6. Fourier Series".*

![Official Handout Summary Page 4/4](</attachments/mit1806-4a731edfd0f7df37676e3b36.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 24 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **Markov matrix** (Markov matrix) two defining properties: all elements are non-negative; the sum of the elements in each column is  $1$. Example  $A=\begin{bmatrix}0.1&0.01&0.3\\0.2&0.99&0.3\\0.7&0&0.4\end{bmatrix}$  Satisfy these two items.
- Two properties hold during exponentiation: $\boldsymbol{1}^{\mathsf T}A=\boldsymbol{1}^{\mathsf T}$  launch  $\boldsymbol{1}^{\mathsf T}A^k=\boldsymbol{1}^{\mathsf T}$, so  $A^k$  Still a Markov matrix, the total  $\boldsymbol{1}^{\mathsf T}\boldsymbol{u}_k$  Conservation.
- Key fact one: $\lambda=1$  It must be an eigenvalue. The reason is not to calculate the determinant, but  $A-I$  The sum of each column of is zero, then  $(1,1,1)$  in  $A-I$  In the left null space of , the rows are linearly related, $A-I$  Bizarre.
- Key fact 2: The absolute values of the remaining eigenvalues do not exceed  $1$, generally strictly less than  $1$;If there is a modulus  $1$  other eigenvalues of (such as the permutation matrix  $-1$), the power does not converge to a single stable state. in strictly less than  $1$  situation, $\boldsymbol{u}_k=c_1\lambda_1^k\boldsymbol{x}_1+\cdots+c_n\lambda_n^k\boldsymbol{x}_n\to c_1\boldsymbol{x}_1$, this is the steady state; $c_1$  Determined by the initial vector. Steady-state correspondence of differential equations  $\lambda=0$, here corresponds to  $\lambda=1$.
- The steady-state eigenvector of the example is  $\boldsymbol{x}_1=(6,330,7)^{\mathsf T}$: take  $x_1=6$  Later by  $0.7x_1=0.6x_3$  Got  $x_3=7$, and then determined from the first line  $x_2=330$, all three components are positive.
- $A$  with  $A^{\mathsf T}$  The eigenvalues of are exactly the same (because  $\det(A-\lambda I)=\det(A^{\mathsf T}-\lambda I)$), but the eigenvectors are different: $(1,1,1)$  Belong to  $A^{\mathsf T}$, the steady state belongs to  $A$.
- California-Massachusetts example: $A=\begin{bmatrix}0.9&0.2\\0.1&0.8\end{bmatrix}$, characteristic value  $1$  with  $0.7$, feature vector  $(2,1)^{\mathsf T}$  with  $(1,-1)^{\mathsf T}$; by  $\boldsymbol{u}_0=(0,1000)^{\mathsf T}$  Got  $\boldsymbol{u}_k=\frac{1000}{3}(2,1)^{\mathsf T}-\frac{2000}{3}(0.7)^k(1,-1)^{\mathsf T}$, the steady state is  $(2000/3,1000/3)$.
- **orthonormal basis** (orthonormal basis)  $Q^{\mathsf T}Q=I$, $Q^{-1}=Q^{\mathsf T}$, the expansion coefficient is the inner product  $x_i=\boldsymbol{q}_i^{\mathsf T}\boldsymbol{v}$.
- **Fourier series** (Fourier series): The inner product of a function space is the integral  $\langle f,g\rangle=\int_0^{2\pi}fg\,\mathrm{d}x$, base  $1,\cos x,\sin x,\cos 2x,\sin 2x,\dots$  Pairs are orthogonal; $a_0$  is  $f$  the average value of $a_1=\frac{1}{\pi}\int_0^{2\pi}f(x)\cos x\,\mathrm{d}x$, because  $\int_0^{2\pi}\cos^2x\,\mathrm{d}x=\pi$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| Markov matrix | Markov matrix | The elements are non-negative and the sum of each column is  $1$  The square matrix describes the system of transition according to fixed probability |
| steady state | Steady state | The state that the system tends to after a long period of time, that is,  $\lambda=1$  The eigenvector direction of |
| left nullspace | left null space | satisfy  $\boldsymbol{y}^{\mathsf T}A=\boldsymbol{0}$  vector of  $\boldsymbol{y}$  The space constituted by  $N(A^{\mathsf T})$ |
| trace | trace | The sum of the diagonal elements is equal to the sum of all eigenvalues |
| power of a matrix | matrix power | $A^k$  Indicates continuous action  $k$  times, $A^k\boldsymbol{x}_i=\lambda_i^k\boldsymbol{x}_i$ |
| diagonalizable | diagonalizable | There are enough linearly independent eigenvectors to expand the initial vector. |
| orthonormal | orthogonal | Pairs are orthogonal and both have lengths  $1$  a set of vectors |
| orthogonal matrix | orthogonal matrix | Column vector orthonormal square matrix  $Q$, satisfy  $Q^{\mathsf T}Q=I$, so  $Q^{-1}=Q^{\mathsf T}$ |
| inner product | inner product | The finite dimension is the dot product, and the function space is  $\int f g\,\mathrm{d}x$, used to determine orthogonality and find expansion coefficients |
| Fourier series | Fourier series | Let the period be  $2\pi$  function press  $1,\cos nx,\sin nx$  Expand to get the sum of infinite terms |
| orthogonal basis | Orthogonal basis | A set of basis vectors or basis functions that are pairwise orthogonal. The coefficients are calculated one by one through the inner product. |
| periodic function | periodic function | satisfy  $f(x+2\pi)=f(x)$  function, applicable object of Fourier expansion |
| infinite dimensional | infinite dimensions | The function space requires an infinite number of basis functions, so the Fourier series has an infinite number of terms. |

---

[← Lecture 23](/en/notes/mit-1806/lec23) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 24b →](/en/notes/mit-1806/lec24b)
