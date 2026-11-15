---
kind: notes
source: mit-1806/lec23
title: Lecture 23 · Differential Equations and Matrix Exponents $e^{At}$
description: Solve systems of linear differential equations and understand
  matrix exponents exp(At).
sourceHash: efccaf19ea38b9bc36e1663d95806db2605576977f6b81eb0ac64707f999ea2a
publish: true
translationMethod: machine-assisted
---

> *Differential equations and exp(At)* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 23 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p23 · Differential equations and matrix exponents  $e^{At}$](https://www.bilibili.com/video/BV1ix411f7Yp?p=23)(51:03)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-23-differential-equations-and-exp-at/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=23&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Previous Lecture Solving Difference Equations  $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$, write the general solution into several  $\lambda^k\boldsymbol{x}$  linear combination of  $\lambda$  is  $A$  of **eigenvalue**(eigenvalue), $\boldsymbol{x}$  is corresponding **eigenvector** (eigenvector). This lecture solves its continuous version - a system of first-order linear differential equations with constant coefficients



$$
\frac{\mathrm{d}\boldsymbol{u}}{\mathrm{d}t}=A\boldsymbol{u}.
$$



The key idea is just one sentence: the solutions to linear equations with constant coefficients are all exponential functions. So just assume  $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$  And substituting the equations back, the rest immediately becomes pure linear algebra: $\lambda$  Must be an eigenvalue, $\boldsymbol{x}$  Must be the corresponding feature vector. Discrete Case Powers  $\lambda^k$  Replace it with the exponent of the continuous case  $e^{\lambda t}$, the rest of the structure is completely parallel.

The route is also developed according to this idea: first use a  $2\times 2$  We will go through a complete set of mechanical calculations with a specific example to see how the eigenvalues can predict the long-term behavior of the solution in advance; then discuss  $t\to\infty$  The three fates of time solution - decay to zero, stop at **Steady state** (steady state), explosive growth, the criterion only looks at the real part of the eigenvalue; then use **diagonalization** (diagonalization) Decouple the coupled system of equations and write  $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$;The final answer is what does "exponent of a matrix" mean: copy  $e^x$  of **Taylor series** (Taylor series) to define  $e^{At}$, and show that it can be written as  $Se^{\Lambda t}S^{-1}$  in the form of  $S$  It consists of feature vectors, $\Lambda$  consists of eigenvalues. At the end of this lecture, a single second-order equation will be transformed into a system of first-order equations, showing that this set of tools is also applicable to higher-order equations.

![Official Handout Summary Page 1/4](</attachments/mit1806-3de771e2324402915781626f.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 23 Summary, CC BY-NC-SA 4.0).*

## 1. from a  $2\times 2$  The system of equations begins with

The system of equations to be solved is



$$
\frac{\mathrm{d}}{\mathrm{d}t}\begin{bmatrix}u_1\\u_2\end{bmatrix}
=\begin{bmatrix}-1&2\\1&-2\end{bmatrix}
\begin{bmatrix}u_1\\u_2\end{bmatrix},
\qquad
\boldsymbol{u}(0)=\begin{bmatrix}1\\0\end{bmatrix}.
$$



Written as two scalar equations, it is  $\mathrm{d}u_1/\mathrm{d}t=-u_1+2u_2$  and  $\mathrm{d}u_2/\mathrm{d}t=u_1-2u_2$: The rate of change of each component depends on two components at the same time. This is "coupling". initial value  $\boldsymbol{u}(0)=(1,0)$  Description  $t=0$  When all the weight is concentrated in  $u_1$  Up, $u_2$  Still zero. But the movement starts immediately: substitute the initial value into the right end, $\mathrm{d}u_2/\mathrm{d}t=1>0$, traffic direction  $u_2$  advance; at the same time  $\mathrm{d}u_1/\mathrm{d}t=-1<0$, $u_1$  is decreasing. The solution is from  $u_1$  flow direction  $u_2$. To see clearly how this flow develops over time, the first step is always to find out  $A$  eigenvalues and eigenvectors.

The eigenvalues can be seen without even counting the characteristic polynomials. The second column of the matrix is the first column  $-2$  times, the two columns are linearly related, so  $A$  strange, $\det A=0$; while in  $2\times2$  In the case of , the determinant is equal to the product of two eigenvalues, so there is an eigenvalue as  $0$. It is more straightforward from the perspective of eigenvectors: singularity means that there are non-zero vectors in the null space, that is, there is  $\boldsymbol{x}\ne\boldsymbol{0}$  such that  $A\boldsymbol{x}=\boldsymbol{0}=0\cdot\boldsymbol{x}$, like this  $\boldsymbol{x}$  It is an eigenvector with zero eigenvalues. Another eigenvalue is given by **trace** (trace) Determine: The sum of the diagonal elements is  $-1+(-2)=-3$, the trace is equal to the sum of eigenvalues  $\lambda_1+\lambda_2$, so the other eigenvalue is  $-3$. The determinant gives the product and the trace gives the sum, which is equivalent to using two equations to solve two unknowns, which is less troublesome than hard calculation of characteristic polynomials. Hard calculation yields the same result:



$$
\det(A-\lambda I)
=\begin{vmatrix}-1-\lambda&2\\1&-2-\lambda\end{vmatrix}
=(-1-\lambda)(-2-\lambda)-2
=\lambda^2+3\lambda
=\lambda(\lambda+3),
$$



Among them  $(-1-\lambda)(-2-\lambda)=2+3\lambda+\lambda^2$, minus the upper right  $2$  The latter constant terms exactly cancel. So  $\lambda_1=0$, $\lambda_2=-3$.

These two numbers already predict the shape of the answer. $\lambda=0$  Correspond  $e^{0\cdot t}=1$, is a part that does not change with time at all; $\lambda=-3$  Correspond  $e^{-3t}$, is a part that decays to zero over time. When  $t\to\infty$  When only the first part remains, that is the steady state. It can be seen that the long-term behavior is determined only by the eigenvalues, and the equation does not even need to be solved first.

Then find the eigenvector. $\lambda_1=0$  time  $A\boldsymbol{x}=\boldsymbol{0}$, that is, asking for  $A$  The null space of : is given by  $-x_1+2x_2=0$  Let the free variables  $x_2=1$, got  $\boldsymbol{x}_1=(2,1)$.$\lambda_2=-3$  time solution  $(A+3I)\boldsymbol{x}=\boldsymbol{0}$, that is



$$
\begin{bmatrix}2&2\\1&1\end{bmatrix}\boldsymbol{x}=\boldsymbol{0},
$$



Therefore  $x_1+x_2=0$, take  $\boldsymbol{x}_2=(1,-1)$. The feature vector is not unique, take  $(-1,1)$  Or any non-zero multiple is also acceptable. As long as the direction is correct, the subsequently calculated coefficient will be adjusted accordingly. Verify: $A\boldsymbol{x}_2=(-1-2,\ 1+2)=(-3,3)=-3(1,-1)$, exactly  $A\boldsymbol{x}_2=-3\boldsymbol{x}_2$.

![Video 00:05:06: Classroom blackboard writing](</attachments/mit1806-f3531a074ef01e7907bc6c4d.jpg>)

*Video 00:05:06｜Approximately corresponding to Section 1 "1. From a  $2\times 2$  The system of equations begins" near.*

## 2. Pure exponential solution and initial conditions

Why can a set of feature pairs give a solution? order  $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$, substitute into both sides of the equation to calculate:



$$
\frac{\mathrm{d}}{\mathrm{d}t}\left(e^{\lambda t}\boldsymbol{x}\right)=\lambda e^{\lambda t}\boldsymbol{x},
\qquad
A\left(e^{\lambda t}\boldsymbol{x}\right)=e^{\lambda t}A\boldsymbol{x}=\lambda e^{\lambda t}\boldsymbol{x}.
$$



Derivating the left hand side only with respect to the time factor, we get  $\lambda e^{\lambda t}\boldsymbol{x}$; put the scalar on the right  $e^{\lambda t}$  Bring it up and use it again  $A\boldsymbol{x}=\lambda\boldsymbol{x}$. If both sides are the same, the equation holds. In other words, exponentially  $\lambda$  You must take the eigenvalue and multiply it by the previous  $\boldsymbol{x}$  Eigenvectors must be taken for the exponential hypothesis to be compatible with the equation - this is why "finding exponential solutions" turns differential equations into linear algebra. Such a solution is called **pure exponential solution**(pure exponential solution).

The equation is linear, and any linear combination of solutions is still a solution, so the general solution is a combination of pure exponential solutions:



$$
\boldsymbol{u}(t)=c_1e^{\lambda_1 t}\boldsymbol{x}_1+c_2e^{\lambda_2 t}\boldsymbol{x}_2 .
$$



here  $A$  is  $2\times2$, so there are only two terms; generally, if  $A$  is  $n\times n$  And it can be diagonalized, that is  $n$  The sum of items. Each item corresponds to a feature direction: $c_i$  is the share of this share in the initial state, $e^{\lambda_i t}$  is its own growth (or decay) factor, $\boldsymbol{x}_i$  is its direction. By superimposing these independent movements, a general solution is obtained. Looking at discrete and continuous side by side, the formulas are almost exactly the same: the solution to the difference equation in the previous lecture is  $c_1\lambda_1^k\boldsymbol{x}_1+c_2\lambda_2^k\boldsymbol{x}_2$, here we just put  $\lambda^k$  replaced by  $e^{\lambda t}$. So what you need to remember is actually the "pure exponential solution", and the rest is left to linear combination.

There is another noteworthy property of the pure exponential solution: taking the initial value  $\boldsymbol{u}(0)=c\boldsymbol{x}_i$, pure exponential solution  $ce^{\lambda_i t}\boldsymbol{x}_i$  Always stay on this eigenvector ray, only expand or attenuate exponentially, and will not turn. In other words, the part of the flow starting in the direction of the eigenvector is "pure stretching", and the eigenvalue is the stretching rate in this direction.

For this example, the general solution is written as



$$
\boldsymbol{u}(t)
=c_1\begin{bmatrix}2\\1\end{bmatrix}
+c_2e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix}.
$$



coefficient  $c_1,c_2$  Depends on the initial conditions. order  $t=0$:



$$
c_1\begin{bmatrix}2\\1\end{bmatrix}+c_2\begin{bmatrix}1\\-1\end{bmatrix}
=\begin{bmatrix}1\\0\end{bmatrix}.
$$



Take both coefficients  $1/3$  That’s it, because  $(2,1)+(1,-1)=(3,0)$, then multiply  $1/3$  Exactly  $(1,0)$. The same goes for solving the equation: adding the two equations, we get  $3c_1=1$, so  $c_1=1/3$, and then from the first formula  $2/3+c_2=1$  Got  $c_2=1/3$. eventually



$$
\boldsymbol{u}(t)=\frac13\begin{bmatrix}2\\1\end{bmatrix}
+\frac13e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix}.
$$



Substitute inspection: $t=0$  It is indeed  $(1,0)$;right  $t$  Seek the derivative  $\boldsymbol{u}'=-e^{-3t}(1,-1)$, while



$$
A\boldsymbol{u}=\frac13A\begin{bmatrix}2\\1\end{bmatrix}
+\frac13e^{-3t}A\begin{bmatrix}1\\-1\end{bmatrix}
=e^{-3t}\begin{bmatrix}-1\\1\end{bmatrix}
=-e^{-3t}\begin{bmatrix}1\\-1\end{bmatrix},
$$



consistent with the derivative. When  $t\to\infty$  time  $e^{-3t}\to0$, the solution tends to  $\frac13(2,1)=(2/3,1/3)$, this is the steady state. Look back at the entire flow: from  $(1,0)$  Departure, part of the component flows to  $u_2$, and finally stopped at  $(2/3,1/3)$, no longer moves.

The step of finding the coefficients can also be written in a matrix. Composed of feature vectors as columns **Eigenvector matrix**(eigenvector matrix)$S$, then



$$
S\boldsymbol{c}=\boldsymbol{u}(0),
\qquad
S=\begin{bmatrix}2&1\\1&-1\end{bmatrix}.
$$



The meaning of this formula is: split the initial state into the shares of each pure exponential solution. share in  $t=0$  Once the time is set, each portion will go its own way according to its own index and will no longer mix with each other.

![Video 00:11:15: Classroom blackboard writing](</attachments/mit1806-ac0ef22ae945d258f3353ef8.jpg>)

*Video 00:11:15 \| Approximately corresponding to Section 2 "2. Pure exponential solution and initial conditions".*

![Official Handout Summary Page 2/4](</attachments/mit1806-0c1f454beb015c461b36be44.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 23 Summary, CC BY-NC-SA 4.0).*

## 3. Stability: The real part determines the increase and decrease, and the imaginary part determines the oscillation.

Not every system has a steady state, and not every system decays. $t\to\infty$  There are only three endings in Shijie. If the real part of all eigenvalues is negative, then each term  $e^{\lambda_i t}$  All tend to zero, the solution tends to zero, and it is the same no matter what the initial value is. If exactly one eigenvalue is zero and the real part of the remaining eigenvalues ​​is negative, then the term with zero eigenvalue stops in place, the other terms disappear, and the solution converges to a non-zero steady state, as is the case in this case. If there is an eigenvalue with a positive real part, the corresponding term grows exponentially with time, and the solution explodes.

The eigenvalues may be complex numbers, and the criterion must be more precise. take  $\lambda=-3+6i$:



$$
e^{\lambda t}=e^{-3t}e^{6it}
=e^{-3t}\left(\cos 6t+i\sin 6t\right).
$$



$e^{6it}$  is a point on the unit circle, the real part  $\cos 6t$  and imaginary part  $\sin 6t$  satisfy  $\cos^2 6t+\sin^2 6t=1$, so its modulus is always  $1$, only rotating on the unit circle. What really determines size is  $e^{-3t}$. Therefore, the real part determines whether the solution decays or grows, and the imaginary part only allows the solution to oscillate back and forth between the two components; no matter how violent the oscillation is, it cannot change the decay trend. The motion given by a pair of conjugate complex eigenvalues ​​is "rotation plus stretching": the rate of stretching depends on the real part, and the speed of rotation depends on the imaginary part. The general criterion is therefore: for all eigenvalues **real part** is negative.

Conversely, if all elements of the matrix are signed, then  $A\boldsymbol{x}=\lambda\boldsymbol{x}$  get it immediately  $(-A)\boldsymbol{x}=-\lambda\boldsymbol{x}$: All eigenvalues change signs and eigenvectors remain unchanged. original  $e^{-3t}$  become  $e^{+3t}$, solution explosion; $\lambda=0$  still  $0$. In this case, the trace is from  $-3$  become  $+3$, the symbol flip can be seen at a glance.

$2\times2$  The situation also has a criterion that does not require finding eigenvalues. Set



$$
A=\begin{bmatrix}a&b\\c&d\end{bmatrix},
\qquad
\operatorname{tr}A=a+d=\lambda_1+\lambda_2,
\qquad
\det A=ad-bc=\lambda_1\lambda_2 .
$$



Stability requirements  $\operatorname{tr}A<0$  and  $\det A>0$. The reason is: if two real eigenvalues are both negative, the sum is negative and the product is positive; if the eigenvalue is a pair of conjugate complex numbers  $\alpha\pm\beta i$, then the sum is  $2\alpha<0$, the product is  $\alpha^2+\beta^2>0$. It is not enough to require that the trace be negative, e.g.



$$
\begin{bmatrix}-2&0\\0&1\end{bmatrix}
$$



The trace is  $-1$, but the eigenvalues are  $-2$  with  $1$, as long as the initial value has a second component, $e^{+t}$  will cause the solution to explode; its determinant is  $-2<0$, which happens to be excluded by the second condition. So both conditions are indispensable.

![Video 00:19:24: Classroom blackboard writing](</attachments/mit1806-a659e6a4e3fb9a7ca6efc2a8.jpg>)

*Video 00:19:24 \| Approximately corresponding to section 3 "3. Stability: the real part determines the increase and decrease, and the imaginary part determines the oscillation".*

## 4. Diagonalization: Decoupling the system of equations

$A$  put  $u_1,u_2$  Coupled together, the rate of change of one component is always mixed with the other component. The function of eigenvectors is to decouple this coupling: instead of using eigenvectors as the basis, the system of equations becomes diagonal. This "changing basis" action is diagonalization - once the matrix is ​​turned into a diagonal matrix, the remaining equations are irrelevant to each other, and the problem is basically solved. The matrix form is



$$
A=S\Lambda S^{-1},\qquad \Lambda=\operatorname{diag}(\lambda_1,\lambda_2),
$$



$S$  The columns of are feature vectors, $\Lambda$  The diagonal of is the eigenvalue. Why can decoupling be achieved by changing coordinates? Because under this group of foundations, $A$  The effect on each basis vector is just to multiply the corresponding eigenvalue. After writing it as coordinates, the matrix naturally becomes a diagonal matrix.  $\Lambda$. Make variable substitutions  $\boldsymbol{u}(t)=S\boldsymbol{v}(t)$, among which  $\boldsymbol{v}$  is  $\boldsymbol{u}$  coordinates under this set of eigenvector bases. $S$  is a constant matrix, so  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=S\,\mathrm{d}\boldsymbol{v}/\mathrm{d}t$, substitute into the original equation to get



$$
S\frac{\mathrm{d}\boldsymbol{v}}{\mathrm{d}t}=AS\boldsymbol{v}
\quad\Longrightarrow\quad
\frac{\mathrm{d}\boldsymbol{v}}{\mathrm{d}t}=S^{-1}AS\boldsymbol{v}=\Lambda\boldsymbol{v}.
$$



The last step is to use diagonalization  $S^{-1}AS=\Lambda$. The new system of equations is diagonal and written in component-wise form is  $\mathrm{d}v_i/\mathrm{d}t=\lambda_iv_i$——There is no coupling between the components, each is a one-variable equation. scalar equation  $\mathrm{d}v/\mathrm{d}t=\lambda v$  The solution is  $v(t)=e^{\lambda t}v(0)$, applied to each component separately, we get  $v_i(t)=e^{\lambda_i t}v_i(0)$. Combined into vector form:



$$
\boldsymbol{v}(t)=e^{\Lambda t}\boldsymbol{v}(0),
\qquad
e^{\Lambda t}=\begin{bmatrix}e^{\lambda_1t}&0\\0&e^{\lambda_2t}\end{bmatrix},
$$



The index of a diagonal matrix is the index of each element on the diagonal. Replace the original variable:



$$
\boldsymbol{u}(t)=S\boldsymbol{v}(t)
=Se^{\Lambda t}\boldsymbol{v}(0)
=Se^{\Lambda t}S^{-1}\boldsymbol{u}(0).
$$



So you can  $Se^{\Lambda t}S^{-1}$  recorded as  $e^{At}$, written as  $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$. this is **matrix index** The role of (matrix exponential) here: a fixed matrix that sends any initial state to the moment in time  $t$  status. It is the same as the previous one  $A^k=S\Lambda^kS^{-1}$  It's the same routine - first diagonalize, and then let the diagonal elements perform power or exponential operations respectively; the only difference is that in discrete cases  $\lambda^k$, for continuous cases  $e^{\lambda t}$.

Check it out with this example. $S^{-1}=\frac13\begin{bmatrix}1&1\\1&-2\end{bmatrix}$, so  $S^{-1}\boldsymbol{u}(0)=(1/3,1/3)$, and what we found before  $c_1=c_2=1/3$  Consistent; calculate again



$$
S\begin{bmatrix}1\\e^{-3t}\end{bmatrix}
=\begin{bmatrix}2+e^{-3t}\\1-e^{-3t}\end{bmatrix},
$$



multiply  $1/3$  Exactly what we get in section 2  $\boldsymbol{u}(t)$. Both paths give the same answer: first finding the eigenvector matrix and then formulating it, and first writing a pure exponential solution and then determining the coefficients, which is essentially the same thing.

![Video 00:33:11: Classroom blackboard writing](</attachments/mit1806-2b61dd236a308d7b5771d63f.jpg>)

*Video 00:33:11 \| Approximately corresponding to Section 4 "4. Diagonalization: Decoupling the System of Equations".*

![Official Handout Summary Page 3/4](</attachments/mit1806-1bc4415180d84d6758809300.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 23 Summary, CC BY-NC-SA 4.0).*

## 5. Matrix exponent: copy Taylor series

Now answer "What is the exponent of a matrix". Scalar exponential functions have a beautiful and reliable definition - a power series:



$$
e^x=1+x+\frac{x^2}{2!}+\frac{x^3}{3!}+\cdots
=\sum_{n=0}^{\infty}\frac{x^n}{n!}.
$$



put  $1$  Replace with identity matrix  $I$, put  $x$  Replace with  $At$, copy it item by item to get the definition of matrix index: $1$  Corresponding to the zeroth-order term (in the matrix, it is  $I$), $x^n$  Correspond  $(At)^n$, the factorial of the denominator is left unchanged,



$$
e^{At}=I+At+\frac{(At)^2}{2!}+\frac{(At)^3}{3!}+\cdots
=\sum_{n=0}^{\infty}\frac{(At)^n}{n!}.
$$



This series works for any matrix  $A$, any  $t$  All converge. The reason is that the factorial of the denominator grows faster than  $At$  Any power of is fast, the general term is pressed toward zero, and the series has a finite sum; $t$  No matter how big it is, $A$  No matter how big it is. This point is worth contrasting with another beautiful series: the geometric series  $1+x+x^2+\cdots=1/(1-x)$  The matrix version of is



$$
I+At+(At)^2+\cdots=(I-At)^{-1},
$$



Its convergence depends on  $At$  Eigenvalues of : only when  $At$  The absolute values of all eigenvalues of are less than  $1$  time, power  $(At)^n$  will shrink to zero, and the series will converge to the inverse matrix. $t$  If it is very small, you can only keep the first two terms and get an approximation  $(I-At)^{-1}\approx I+At$; If you want to be more precise, leave a few more items. Algebraically, it does provide a series method for inversion, but differential equations do not require it. The main line is still the exponential series above.

With the definition, we can put  $e^{At}$  with  $S$, $\Lambda$  Connect them together: rewrite each term of the series according to the same pattern. put  $A=S\Lambda S^{-1}$  Substitute  $At$, adjacent in the middle  $S^{-1}S$  Pairs cancel each other:



$$
(At)^n=\left(S\Lambda S^{-1}t\right)^n=S(\Lambda t)^nS^{-1}.
$$



Then write the identity matrix as  $I=SS^{-1}$, each term of the series can be proposed from the left and right sides  $S$  with  $S^{-1}$:



$$
e^{At}=S\left[I+\Lambda t+\frac{(\Lambda t)^2}{2!}+\cdots\right]S^{-1}
=Se^{\Lambda t}S^{-1}.
$$



The square brackets are exactly the exponents of the diagonal matrix - the non-diagonal elements are all  $0$, the diagonal is an ordinary scalar exponent, so we can write it directly  $e^{\Lambda t}$. The premise of this derivation is that  $S^{-1}$  existence, that is  $A$  Yes  $n$  Linearly independent eigenvectors can be diagonalized. A few matrices do not have enough eigenvectors, and diagonalization fails; they can still be transformed into triangles instead of diagonals, and the exponential formula must be modified accordingly.

At this point, the entire hand calculation process in Sections 1 and 2 has been repeated at the formula level: finding eigenvalues, eigenvectors, coefficients, and then letting each term evolve according to its own exponential.

![Video 00:39:59: Classroom blackboard writing](</attachments/mit1806-4f2c9533c7becf7b664dd55c.jpg>)

*Video 00:39:59 \| Approximately corresponding to Section 5 "5. Matrix Exponent: Copying Taylor Series".*

## 6. Images and higher-order equations of the stable region

Drawing the criterion on the complex plane, the difference in stability becomes clear at a glance. The solution of the differential equation tends to zero, requiring all eigenvalues to satisfy  $\operatorname{Re}\lambda<0$, that is, falls on **left half plane**;virtual axis  $\operatorname{Re}\lambda=0$  is the boundary. Once the eigenvalues cross it and enter the right half plane, the solution explodes. And the previous lecture "Powers of matrices" $A^k$  Approaching zero” requirement  $|\lambda|<1$, that is, the eigenvalue falls within **unit circle** interior. The reason is very straightforward: $|\lambda^k|=|\lambda|^k$  Follow  $k$  The condition for narrowing is  $|\lambda|<1$; and  $|e^{\lambda t}|=e^{(\operatorname{Re}\lambda)t}$  The condition for shrinking over time is  $\operatorname{Re}\lambda<0$. For the same matrix, if you look at the power and the exponent, the shape of the stable region is completely different.

Finally, apply the tool to one of the most common equations - a single second-order equation



$$
y''+by'+Ky=0 .
$$



Although it is an equation, it can be written as a system of first-order equations. The method is to take the unknown quantity into a vector  $\boldsymbol{u}=\begin{bmatrix}y'\\y\end{bmatrix}$: The first component is  $y'$, the second component is  $y$  itself. In this way  $\boldsymbol{u}'=\begin{bmatrix}y''\\y'\end{bmatrix}$, the right end can be made into the form of a matrix multiplied by a vector:



$$
\boldsymbol{u}'=\begin{bmatrix}y''\\y'\end{bmatrix}
=\begin{bmatrix}-b&-K\\1&0\end{bmatrix}
\begin{bmatrix}y'\\y\end{bmatrix}.
$$



The first row of the matrix comes from the original equation: rewrite the equation as  $y''=-by'-Ky$, coefficient  $-b,-K$  Just fill in the first row in turn, which is responsible for generating  $y''$. The second line comes from the trivial equation  $y'=y'$, so the line is  $(1,0)$, it is only responsible for handing the first component to the second component unchanged. In this way, the second-order equation becomes  $2\times2$  For a system of first-order equations, the eigenvalues will naturally correspond to the properties of the original equations.

The same goes for higher-order equations: a fifth-order equation is assigned  $5\times5$  Matrix, the coefficients of each derivative of the equation are listed in the first row, and the other four trivial "reduced order" equations are placed one on the subdiagonal  $1$. This is the same method as the previous lecture on writing Fibonacci recursion as a first-order system—introducing a few more auxiliary components and reducing high-order derivatives to first-order. In this way, any high-order linear equation with constant coefficients is packaged into a system of first-order equations, and the entire method of this lecture (eigenvalues, eigenvectors, matrix exponents) is immediately applicable.

![Video 00:45:57: Classroom blackboard writing](</attachments/mit1806-60e87b3e065912fda5592491.jpg>)

*Video 00:45:57 \| Approximately corresponding to Section 6 "6. Images and higher-order equations of the stable region".*

![Official Handout Summary Page 4/4](</attachments/mit1806-5e609dc3a8cc5d208038140f.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 23 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- This tutorial explains the system of first-order linear differential equations with constant coefficients.  $\mathrm{d}\boldsymbol{u}/\mathrm{d}t=A\boldsymbol{u}$, its solution is given by  $A$  The eigenvalues and eigenvectors of are completely determined; with the difference equation  $\boldsymbol{u}_{k+1}=A\boldsymbol{u}_k$  The structure of is parallel, just a power  $\lambda^k$  Replaced with index  $e^{\lambda t}$.
- **pure exponential solution**:If  $A\boldsymbol{x}=\lambda\boldsymbol{x}$, then  $\boldsymbol{u}(t)=e^{\lambda t}\boldsymbol{x}$  is the solution - taking the derivative gives  $\lambda e^{\lambda t}\boldsymbol{x}$, the right side of the equation gives  $e^{\lambda t}A\boldsymbol{x}$, both are equal.
- The general interpretation is  $c_1e^{\lambda_1t}\boldsymbol{x}_1+\cdots+c_ne^{\lambda_nt}\boldsymbol{x}_n$, the coefficient is determined by the initial conditions  $S\boldsymbol{c}=\boldsymbol{u}(0)$  OK, $S$  is a matrix with eigenvectors as columns.
- Example  $A=\begin{bmatrix}-1&2\\1&-2\end{bmatrix}$  strange and trace  $-3$, so the eigenvalue is  $0,-3$, the feature vector is  $(2,1)$, $(1,-1)$; by  $\boldsymbol{u}(0)=(1,0)$  Got  $c_1=c_2=1/3$, the solution is  $\frac13(2,1)+\frac13e^{-3t}(1,-1)$, the steady state is  $(2/3,1/3)$.
- Stability criterion: If the real part of all eigenvalues is negative, the solution tends to zero; if a zero eigenvalue plus the remaining real parts are negative, it will converge to a steady state; if any real part is positive, it will explode. In the case of complex numbers, the real part determines the increase and decrease, and the imaginary part only causes oscillations.
- $2\times2$  Quick criterion for: $\operatorname{tr}A<0$  and  $\det A>0$. only  $\operatorname{tr}A<0$  Not enough, counterexample  $\begin{bmatrix}-2&0\\0&1\end{bmatrix}$  The characteristic value of  $-2,1$, will still explode.
- Diagonalization decouples the coupled equations: let  $\boldsymbol{u}=S\boldsymbol{v}$  Got  $\mathrm{d}\boldsymbol{v}/\mathrm{d}t=\Lambda\boldsymbol{v}$, so  $\boldsymbol{u}(t)=Se^{\Lambda t}S^{-1}\boldsymbol{u}(0)$, and thus define  $e^{At}=Se^{\Lambda t}S^{-1}$.
- Matrix indices are defined using Taylor series: $e^{At}=\sum_{n\ge0}(At)^n/n!$, for any  $A,t$  All converge; matrix geometric series  $(I-At)^{-1}=I+At+(At)^2+\cdots$  only in  $At$  The absolute values of the eigenvalues are all smaller than  $1$  time to converge.
- Stable domain images: continuous case requirements  $\operatorname{Re}\lambda<0$ (left half plane), discrete power case requirements  $|\lambda|<1$ (within the unit circle).
- second order equation  $y''+by'+Ky=0$  take  $\boldsymbol{u}=(y',y)$  That is, get the matrix  $\begin{bmatrix}-b&-K\\1&0\end{bmatrix}$; $n$  order equation to get  $n\times n$  Matrix, the coefficients are in the first row, and the sub-diagonal is  $1$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| linear differential equation | linear differential equation | An equation in which the unknown function and its derivatives appear in a linear manner. This article explains the system of first-order constant coefficient equations. |
| constant coefficient | constant coefficient | matrix  $A$  does not change with time, the solution can be written as a combination of exponential functions |
| pure exponential solution | pure exponential solution | shaped like  $e^{\lambda t}\boldsymbol{x}$  solution, $\lambda$, $\boldsymbol{x}$  is the corresponding feature pair |
| initial condition | initial conditions | given  $\boldsymbol{u}(0)$, used to determine the coefficients of each pure exponential solution |
| eigenvector matrix | Eigenvector matrix | matrix with eigenvectors as columns  $S$, satisfy  $A=S\Lambda S^{-1}$ |
| steady state | Steady state | $t\to\infty$  The position where the time solution stays, corresponding to zero eigenvalues |
| stability | Stability | Whether the solution tends to zero over time, the criterion is that the real part of all eigenvalues is negative |
| real part | real part | The part of the eigenvalue of a complex number that determines the increase or decrease in the exponential |
| imaginary part | imaginary part | The part of the complex eigenvalues that only causes oscillations |
| trace | trace | The sum of the diagonal elements is equal to the sum of the eigenvalues, $2\times2$  One of the stability criteria |
| diagonalization | diagonalization | $A=S\Lambda S^{-1}$, turning the coupled system of equations into mutually irrelevant equations |
| decouple | decoupling | Make each component evolve independently through eigenvector coordinates |
| matrix exponential | matrix index | By Taylor series  $\sum(At)^n/n!$  The defined matrix satisfies  $\boldsymbol{u}(t)=e^{At}\boldsymbol{u}(0)$ |
| Taylor series | Taylor series | put  $e^{At}$  defined as  $I+At+(At)^2/2!+\cdots$  basis |
| geometric series | Geometric series | $1+x+x^2+\cdots=1/(1-x)$, the matrix version gives  $(I-At)^{-1}$ |
| left half-plane | left half plane | on the complex plane  $\operatorname{Re}\lambda<0$  The region of , the stable region of the differential equation |
| unit circle | unit circle | on the complex plane  $\lvert\lambda\rvert=1$  The circumference of , the power stable region  $\lvert\lambda\rvert<1$  the boundary of |

---

[← Lecture 22](/en/notes/mit-1806/lec22) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 24 →](/en/notes/mit-1806/lec24)
