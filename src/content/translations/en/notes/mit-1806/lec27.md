---
kind: notes
source: mit-1806/lec27
title: Lecture 27 · Positive definite matrices and minimum values
description: Use positive definite matrices to determine the minimum value of a
  multivariate function, and master the combination method and principal
  formula.
sourceHash: f7c674f0788c9810a783642aa4fab606f34a048b3837bc2a22723d696e47391a
publish: true
translationMethod: machine-assisted
---

> *Positive definite matrices and minima* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 27 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p28 · Positive definite matrix and minimum value](https://www.bilibili.com/video/BV1ix411f7Yp?p=28)(50:40)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-27-positive-definite-matrices-and-minima/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=28&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The previous lecture extended the symmetric matrix theory to the complex number domain. This lecture returns to real matrices and discusses a type of matrix that is extremely important in theory and application——**Positive definite matrix** (positive definite matrix). The special thing about positive definiteness is that it ties together several clues from the entire course: pivot, determinant, eigenvalue, plus a new object that has not been dealt with head-on before - quadratic form  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$.

This lecture will answer three questions. **judge**:Give one  $5\times 5$  How to quickly determine whether a matrix is positive definite? **meaning**: What exactly does the property of Zhengding mean, and why is it worth caring about? **Geometry**: Positive definite figures are bowls, ellipses, and ellipsoids, while incorrect definite figures are saddle points and hyperbolas. The three answers finally converge to the same place - the positive definite matrix describes the minimum value of a multivariate function at a point, which is the generalization of the criterion "the second derivative is positive" in calculus to multi-dimensional situations.

The main line is: first  $2\times 2$  The four criteria are laid out side by side, and an example with parameters is used to complete the three stages of "positive definite-critical-indefinite"; then the quadratic form is introduced to explain why the combination method can determine positive certainty; then the combination method is regarded as elimination, and it is explained why the pivot falls outside the square term; then the second-order derivative matrix is connected to the minimum value; finally, using  $3\times 3$  Example showing ellipsoid and principal axis theorem.

![Official Handout Summary Page 1/4](</attachments/mit1806-9915fb76b81d90f0a9e866c2.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 27 Summary, CC BY-NC-SA 4.0).*

## 1. View the four criteria side by side

The object of discussion is always real **symmetric matrix** (symmetric matrix), this is not moved by default. from  $2\times 2$  Start:



$$
A=\begin{bmatrix}a&b\\b&c\end{bmatrix}.
$$



Each of the following four items is sufficient to judge independently.  $A$  Whether it is right concentration.

1. **Eigenvalue criterion**: $\lambda_1>0$  and  $\lambda_2>0$, that is, the two eigenvalues (eigenvalues) are all positive. The eigenvalues ​​of a symmetric matrix are all real numbers (this is the basic fact of a symmetric matrix), so the sentence "is positive" makes sense.
2. **determinant criterion**:all **sequential subject form** (leading principal minor) are all positive——$1\times 1$  of  $a>0$, $2\times 2$  Determinant of $\det A=ac-b^2>0$. The sequential main subforms refer to the determinants of those submatrices that extend from the upper left corner (northwest corner) to the lower right step by step.
3. **pivot criterion**: Both pivots are positive. $2\times 2$  The first pivot of is  $a$;The product of pivot components is equal to the determinant, so the second pivot component must be  $\det A/a$.
4. **quadratic criterion**: for all non-zero vectors  $\boldsymbol{x}$, both  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}>0$.

Article 4 is the new face of this lecture and the real protagonist. Most textbooks directly treat it as positive definite **definition**, and regard the first three items as criteria; this lecture will first go through the first three items in the order of use, and then go back and explain the fourth item thoroughly.

Each of the four has its own use. give one  $5\times 5$  For matrices, no one actually solves the quintic equation to find the eigenvalues; the actual method is to perform elimination once to see the sign of the pivot component, or to calculate a series of determinants by order. Both of these methods only require four arithmetic operations. The value of the eigenvalue criterion is in interpretation, and the value of determinant and pivot criterion is in calculation.

Also make sure that these four picks are from the same batch of matrices. $2\times 2$  The situation can be verified by hand calculation. If  $a>0$  and  $ac-b^2>0$, then  $ac>b^2\ge 0$, so  $c>0$, so trace $a+c$  is positive, the determinant is positive, the two eigenvalues have the same sign and their sum is positive, both must be positive. On the other hand, if both eigenvalues are positive, then the determinant is positive and the trace is positive; by  $ac>b^2\ge 0$  know  $a$  with  $c$  They have the same number, and then from the traces, we know that both are correct. $a>0$  That’s it. The four criteria do point to the same batch of matrices. behind  $c=20$  The example walks the argument through again.

![Video 00:05:04: Classroom blackboard writing](</attachments/mit1806-b7776141149bc6322a20ae67.jpg>)

*Video 00:05:04 \| Approximately corresponding to Section 1 "1. View the four criteria side by side".*

## 2. Examples with parameters: positive definite, critical, indefinite

take



$$
A=\begin{bmatrix}2&6\\6&c\end{bmatrix},
$$



ask  $c$  At least how big must it be for the matrix to be positive definite.

There is no need to find the eigenvalues, the determinant criterion is the fastest. The first sequential subject is  $2>0$, is established automatically; the second one is



$$
\det A=2c-36,
$$



Require it to be positive and get  $c>18$. The second pivot is more straightforward: the product of the pivots is equal to the determinant, $p_2=\dfrac{2c-36}{2}=c-18$, so "the main elements are all positive" is  $c-18>0$, critical value  $18$  It's clear at a glance. take  $c=19$, the determinant is  $38-36=2$, the second pivot is  $1$, both main elements are positive, positive definite.

put  $c$  Pressed to critical value  $18$: $\det A=36-36=0$, is no longer strictly positive. Its trace is  $2+18=20$, the determinant is  $0$, so the two eigenvalues are  $0$  with  $20$: Non-negative, but one of them happens to be  $0$. This situation is called **positive semidefinite** (positive semi-definite), the word "semi" comes from that  $0$. The pivot situation illustrates the problem even more: the first pivot is  $2$, the second pivot is  $0/2=0$;Elimination cannot proceed because



$$
\begin{bmatrix}6&18\end{bmatrix}=3\begin{bmatrix}2&6\end{bmatrix},
$$



The second line is the first line  $3$  times, the matrix is singular, and the rank is  $1$, there is only one pivot. The main element criterion requires "all positive", which appears here  $0$, so the criterion stops exactly on the critical line.

again  $c$  pressed to  $7$: $\det A=14-36=-22$, the second pivot is  $-22/2=-11$, one positive and one negative. This matrix is called **Uncertain** (indefinite). Its two eigenvalues ​​are one positive and one negative - there is no need to calculate them. If the determinant is negative, it means that the product is negative, so one must be positive and the other negative.

critical value  $18$  put  $c$  The value of is divided into two sections: $c>18$  Right concentration, $c<18$  Uncertain, but  $c=18$  It alone becomes the dividing line of positive semi-definite. This is why the criterion is trustworthy: the behavior at the critical point is completely explainable - if a pivot is lost there, a direction is also lost. The three scenarios are as follows:

| $c$  range | determinant | two pivots | eigenvalue | Type |
| --- | --- | --- | --- | --- |
| $c>18$ | Right | $2$  with  $c-18$, all correct | All are correct | positive definite |
| $c=18$ | $0$ | $2$  with  $0$ | $0$  with  $20$ | positive semidefinite |
| $c<18$ | Negative | One positive and one negative | One positive and one negative | Uncertain |

![Video 00:12:10: Classroom blackboard writing](</attachments/mit1806-ee4a12a5638d69d2ca2e0a6b.jpg>)

*Video 00:12:10 \| Approximately corresponding to section 2 "2. Examples with parameters: positive definite, critical, indefinite".*

## 3. Quadratic type: new protagonist

Now figure out the fourth criterion. take  $\boldsymbol{x}=\begin{bmatrix}x_1\\x_2\end{bmatrix}$, use  $A=\begin{bmatrix}2&6\\6&c\end{bmatrix}$  Calculate  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$. Do it first  $A\boldsymbol{x}$:



$$
A\boldsymbol{x}=\begin{bmatrix}2x_1+6x_2\\6x_1+c\,x_2\end{bmatrix},
$$



reuse  $\boldsymbol{x}^{\mathsf T}=(x_1,x_2)$  Multiply left and combine similar terms:



$$
\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=x_1(2x_1+6x_2)+x_2(6x_1+c\,x_2)=2x_1^2+12x_1x_2+c\,x_2^2 .
$$



Each of the three coefficients has its origin: $2x_1^2$  from  $(1,1)$  elements, $c\,x_2^2$  from  $(2,2)$  element, middle  $12x_1x_2$  from the sum of two symmetric positions  $6+6$. Generally, yes  $A=\begin{bmatrix}a&b\\b&c\end{bmatrix}$  Yes



$$
\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=a x_1^2+2b\,x_1x_2+c\,x_2^2 .
$$



This expression contains only quadratic terms: no linear terms, no constant terms, and no cubic terms. Such a function is called **Quadratic type** (quadratic form). Note  $A\boldsymbol{x}$  itself is still linear, multiplied to the front  $\boldsymbol{x}^{\mathsf T}$  Raise the count to two.

One thing worth remembering about the structure: two pure square terms  $a x_1^2$  with  $c\,x_2^2$  in  $a,c>0$  Time is always non-negative. The only thing that can go wrong is the middle term, which can be positive or negative. Whether it is positive definite or not depends on whether the two square terms "overwhelm" the cross term; this sentence will become a very specific condition in the combination method.

The definition of positive certainty falls on this formula: if for everything non-zero  $\boldsymbol{x}$  All  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}>0$, then it is called  $A$ **positive definite**.

return to  $c=7$  matrix. Its quadratic form is  $2x_1^2+12x_1x_2+7x_2^2$. take  $\boldsymbol{x}=(1,-1)$, got  $2-12+7=-3<0$, so it is not positive definite. This counterexample is graphically convincing: along  $x$  The axis function is  $2x_1^2$, upward; along  $y$  The axis function is  $7x_2^2$, also upward; along  $45^\circ$  direction  $x_1=x_2$  is  $2+12+7=21$, still upward; but along  $x_1=-x_2$  The direction becomes  $-3$. Some directions rise and some directions fall. Such a stationary point is called a stationary point. **saddle point** (saddle point): It is the highest point in some directions and the lowest point in other directions. The best way to see these directions is in the eigenvector directions - as you move along the eigenvectors, the quadratic form degenerates exactly into a single square term.

$c=20$  The situation is completely different. The quadratic form is  $2x_1^2+12x_1x_2+20x_2^2$, the same generation  $\boldsymbol{x}=(1,-1)$  Got  $2-12+20=10>0$. But one point is not enough, you have to prove it to all  $\boldsymbol{x}$  All are positive.

In fact, the eigenvalue level has already been passed first. $c=20$  time  $\det A=40-36=4$, the trace is  $2+20=22$;The product of two eigenvalues is equal to the determinant  $4$, the sum is equal to the trace  $22$. If the product is positive, it means that the two have the same sign. If the sum is positive, it excludes the same sign, so both are positive. Without solving the equation, the symbol is determined - this is the value of the criterion. But to make "positive everywhere" clear from the formula, this function must be written directly as a sum of squares.

![Official Handout Summary Page 2/4](</attachments/mit1806-a62682b4c259c0d743f68a3e.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 27 Summary, CC BY-NC-SA 4.0).*

![Video 00:19:15: Classroom blackboard writing](</attachments/mit1806-8b0584f9ebc427db77361c6e.jpg>)

*Video 00:19:15 \| Approximately corresponding to section 3 "3. Quadratic Type: New Protagonist".*

## 4. The matching method is to eliminate elements

Judgment  $2x_1^2+12x_1x_2+20x_2^2>0$  The best way is to write it as a sum of squares. The trouble is all in the cross terms  $12x_1x_2$  Above: As long as you can fit it into a square, the rest is just the sum of several squares. this is **Preparation method** (completing the square). Set



$$
2x_1^2+12x_1x_2+20x_2^2=2(x_1+3x_2)^2+\lambda x_2^2 .
$$



Why is it in parentheses?  $3x_2$? because  $(x_1+3x_2)^2$  The expanded cross term is  $6x_1x_2$, take another ride outside  $2$  Just given  $12x_1x_2$; and it contributes  $x_2^2$  The item is  $9x_2^2$, multiplied by the outside  $2$  That’s it  $18x_2^2$. original style  $20x_2^2$, not even close  $2$, so



$$
2x_1^2+12x_1x_2+20x_2^2=2(x_1+3x_2)^2+2x_2^2 .
$$



The right side is the sum of two squares, the coefficients are all positive, for any real number  $x_1,x_2$  cannot be negative, so  $c=20$  The matrix of is positive definite.

put  $20$  Change to other values, the structure remains unchanged and the conclusion follows the coefficients. $c=18$  when, $18x_2^2$  happens to be  $(x_1+3x_2)^2$  contributed  $18x_2^2$  Used up, leftover  $0\cdot x_2^2$, got  $2(x_1+3x_2)^2$, this is semi-positive definite. This square is only on the straight line  $x_1=-3x_2$  Take zero up, and along this straight line direction  $A\boldsymbol{x}=\boldsymbol{0}$——It is exactly the eigenvalue  $0$  The corresponding eigenvector direction is the direction in which the positive semidefinite matrix is "lost". Graphically, the bowl is flattened into a trough: the minimum is no longer an isolated point, but an entire straight line. $c=7$  Need to make up when needed  $7-18=-11$, got  $2(x_1+3x_2)^2-11x_2^2$: A negative coefficient appears, which is why it can be  $(1,-1)$  Source of negative values.

to general  $2\times 2$  matrix($a\ne 0$), the recipe can be written in one step:



$$
a x_1^2+2b\,x_1x_2+c\,x_2^2=a\Bigl(x_1+\frac{b}{a}x_2\Bigr)^2+\frac{ac-b^2}{a}x_2^2 .
$$



inside the square  $\frac{b}{a}$  It is the elimination multiplier, outside the square  $a$  with  $\frac{ac-b^2}{a}$  Just two main elements. This line of identities completes the explanation of "combination method equals elimination", and the origin of each term is clear at a glance.

The two outside the square  $2$  inside the peace square  $3$  None of this is accidental. Yes  $A=\begin{bmatrix}2&6\\6&20\end{bmatrix}$  Do elimination: the first pivot is  $2$, the second row minus the first row  $3$  times (the multiplier is  $3$),



$$
A=\begin{bmatrix}2&6\\6&20\end{bmatrix}\longrightarrow\begin{bmatrix}2&6\\0&2\end{bmatrix}=U,\qquad L=\begin{bmatrix}1&0\\3&1\end{bmatrix},
$$



The second pivot is  $2$. Compare this: **The coefficient outside the square is the pivot element, and the coefficient inside the square is the elimination multiplier.**.

So the matching method is just another way of writing elimination. In the sum of squares form, there is a pivot hanging outside each square term; if the pivots are all positive, the sum of squares is all positive, the function is always positive, the graph is upward, and the origin is the minimum point. This chain strings together criteria, algebraic identities, and geometric shapes. Conversely, as long as a certain pivot is negative, a negative term will appear in the sum of squares, the function will go down in a certain direction, and a saddle point will appear. The value of this translation is that it is not limited to second order: elimination pairs  $n\times n$  It's ready-made, $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  It can always be broken down into  $n$  The sum of squares, the coefficient outside each square term is the pivot of that step. This correspondence between positive pivots and positive sums of squares holds for any order.

The geometric image becomes clear. $c=20$  The function graph is a bowl, and the origin is the lowest point. water level  $z=1$  To cut this bowl, the cross-section is



$$
2x_1^2+12x_1x_2+20x_2^2=1,
$$



This is a **ellipse** (ellipse); replace with  $c=7$  In the indefinite case of , the cross-sections at the same height are **Hyperbola** (hyperbola). The difference between a bowl and a saddle point is the difference between an ellipse and a hyperbola.

## 5. Second-order derivative matrix and minimum value

The relationship between bowls and minima is a direct translation of the conclusions of calculus. unary function  $y(x)$  The necessary condition for taking the minimum is that the first-order derivative is zero; but the derivative being zero only indicates the tangent level, which may be the maximum, minimum or inflection point. The real determination requires the second-order derivative: $y''>0$  is the minimum point at which the curve bends upward.

Multivariate functions are exactly the same, except that each item must be replaced by a matrix. Yes  $f(\boldsymbol{x})=\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$, the first-order partial derivative always contains  $x_1$  or  $x_2$, so it is automatically all zero at the origin - the necessary condition does not provide any information, everything is determined by the second derivative. In general functions, zero first-order derivative only indicates the level of the tangent plane, which may be minimum, maximum or saddle point. To distinguish, you have to look at the second-order derivative matrix. Arrange the second-order partial derivatives into a matrix:



$$
\begin{bmatrix}f_{11}&f_{12}\\f_{21}&f_{22}\end{bmatrix},\qquad f_{ij}=\frac{\partial^2 f}{\partial x_i\,\partial x_j}.
$$



It must be symmetric because the order of mixed partial derivatives can be exchanged, $f_{12}=f_{21}$. this is **second derivative matrix** (matrix of second derivatives), which is exactly "$y''$"A stand-in for multiple situations.

Determining minimal requires two things. First, two pure second-order partial derivatives  $f_{11}$  with  $f_{22}$  Must be positive - it must curve upward along the coordinate axis. Second, this is not enough: cross terms  $f_{12}$  It is possible to pull down the entire surface, so  $f_{11}$, $f_{22}$  Must be big enough to overwhelm  $f_{12}$. The binary criterion given in the calculus textbook is



$$
f_{11}f_{22}>f_{12}^2,
$$



It is actually that the determinant of the second-order derivative matrix is positive - exactly the criterion of the previous sequential principal formula. Yes  $f=2x_1^2+12x_1x_2+20x_2^2$  Check calculation: $f_{11}=4$, $f_{22}=40$, $f_{12}=12$, while  $4\times 40=160>144=12^2$, established. Written as a matrix, it is



$$
\begin{bmatrix}4&12\\12&40\end{bmatrix}=2\begin{bmatrix}2&6\\6&20\end{bmatrix}=2A,
$$



Right  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  Taking the derivative twice, the second derivative matrix obtained is exactly  $2A$;Constant factor  $2$  does not affect the positive definiteness, so "testing that the second-order derivative matrix is positive definite" is the same as "testing  $A$  Right concentration" is the same thing.

So the core conclusion of this lecture can be written in one sentence: the second derivative matrix of multivariate functions at stationary points **positive definite** When , it must be strictly minimized; conversely, if it is minimized, the second-order derivative matrix is at least positive semi-definite. Positive definiteness is a sufficient condition and the most commonly used criterion - the condition "the second-order derivative is positive" in one dimension is translated into matrix language as "the second-order derivative matrix is ​​positive definite"; and positive definiteness has four operable criteria, and there are operable algorithms for judging the minimum value. $n$  The metafunction copies this sentence, except that the matrix becomes  $n\times n$, and elimination, determinant, and eigenvalue are true for any order.

![Video 00:32:56: Classroom blackboard writing](</attachments/mit1806-b48fdba428e2812be8bddfd0.jpg>)

*Video 00:32:56 \| Approximately corresponding to Section 5 "5. Second-order derivative matrix and minimum value".*

![Official Handout Summary Page 3/4](</attachments/mit1806-246a80159a129ac710bcceff.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 27 Summary, CC BY-NC-SA 4.0).*

![Video 00:39:30: Classroom blackboard writing](</attachments/mit1806-5d020d0f99371e30a45e76d0.jpg>)

*Video 00:39:30 \| Approximately corresponding to Section 5 "5. Second-order derivative matrix and minimum value".*

## 6. Third-order example: ellipsoid and principal axis theorem

Move the same four questions to  $3\times 3$:



$$
A=\begin{bmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{bmatrix}.
$$



Is it right concentration? What is the quadratic type? Does the function take the minimum at the origin? What is the geometric shape?

The fastest is still the sequential master style. The first level is  $2$;The second order is  $4-1=3$;The third level is expanded according to the first row,



$$
\det A=2\det\begin{bmatrix}2&-1\\-1&2\end{bmatrix}-(-1)\det\begin{bmatrix}-1&-1\\0&2\end{bmatrix}+0=2\cdot 3+1\cdot(-2)=4 .
$$



The three sequential main formulas are  $2,3,4$, all are positive, so  $A$  Right concentration. This type of diagonal is  $2$, the sub-diagonal is  $-1$  is a matrix whose sequential principal formulas are  $2,3,4,5,6,\dots$, rising one after another.

The main element can also be read out. After elimination



$$
U=\begin{bmatrix}2&-1&0\\0&\tfrac32&-1\\0&0&\tfrac43\end{bmatrix},\qquad\text{主元 }2,\ \tfrac32,\ \tfrac43 .
$$



They coincide exactly with the determinant: $2\times\tfrac32=3$  is the second-order sequential principal formula, $2\times\tfrac32\times\tfrac43=4$  is a third-order determinant. The main components are all positive, consistent with the determinant criterion.

Eigenvalues are less readily available - a cubic equation needs to be solved to the third order. But it can be concluded that they are all positive, and these three numbers are  $2-\sqrt2$, $2$, $2+\sqrt2$. Check with two simple tests: the trace is  $(2-\sqrt2)+2+(2+\sqrt2)=6$, which is exactly the sum of the diagonal elements of the third-order matrix; the determinant is  $(2-\sqrt2)(2+\sqrt2)\cdot 2=(4-2)\cdot 2=4$, consistent with the determinant calculated above.

The quadratic form is



$$
\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=2x_1^2+2x_2^2+2x_3^2-2x_1x_2-2x_2x_3 .
$$



Contributions to each diagonal dollar  $2x_i^2$; $(1,2)$  with  $(2,1)$  of two  $-1$  Taken together it gives  $-2x_1x_2$; $(2,3)$  with  $(3,2)$  given  $-2x_2x_3$; $(1,3)$  The location is  $0$, so there is no  $x_1x_3$  item. As the sum of squares, the coefficients outside the square are exactly three principal elements:



$$
\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=2\Bigl(x_1-\tfrac12 x_2\Bigr)^2+\tfrac32\Bigl(x_2-\tfrac23 x_3\Bigr)^2+\tfrac43 x_3^2 .
$$



Multiply and check: the first item is given  $2x_1^2-2x_1x_2+\tfrac12x_2^2$, the second item gives  $\tfrac32x_2^2-2x_2x_3+\tfrac23x_3^2$, the third item gives  $\tfrac43x_3^2$; $x_2^2$  coefficient of  $\tfrac12+\tfrac32=2$, $x_3^2$  coefficient of  $\tfrac23+\tfrac43=2$, the cross terms add up to exactly  $-2x_1x_2-2x_2x_3$, consistent with the quadratic form. square miles  $x_2$, $x_3$  The coefficient of also comes from the elimination multiplier. All three coefficients are positive, so this quadratic form is always positive except for the origin.

Geometrically, $f=\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  The graph needs to have three independent variables plus one function value, with a total of four dimensions, so it cannot be drawn; but it is still a bowl, to be precise. **Paraboloid** (paraboloid), the origin is the lowest point. use  $f=1$  to cut, to get



$$
2x_1^2+2x_2^2+2x_3^2-2x_1x_2-2x_2x_3=1 .
$$



This is a **ellipsoid** (ellipsoid) surface, like a squashed rugby ball. The difference between the spherical surface and it lies in symmetry: the spherical surface looks the same from any direction, which corresponds to the situation where the three eigenvalues ​​are all equal like the unit matrix; a real football has one long direction and the other two directions are equal, corresponding to the situation where the two eigenvalues ​​are equal; in general, the three eigenvalues ​​are different from each other, and the ellipsoid has three main axes: the major axis, the middle axis, and the minor axis.

three main axes **direction** Given by the eigenvector, **length** given by the eigenvalues. Writing this sentence as algebra, it is the decomposition of a symmetric matrix



$$
A=Q\Lambda Q^{\mathsf T},
$$



Among them  $Q$  The columns of are orthonormal eigenvectors, $\Lambda$  The diagonal element of is the corresponding eigenvalue. This is by far the most important matrix factorization in the eigenvalue part - it is the diagonalization of a symmetric matrix, just because  $Q^{-1}=Q^{\mathsf T}$, the inverse matrix is replaced by transpose.

The axis length can be calculated using this decomposition. order  $\boldsymbol{y}=Q^{\mathsf T}\boldsymbol{x}$, that is  $\boldsymbol{x}=Q\boldsymbol{y}$, then



$$
\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=\boldsymbol{y}^{\mathsf T}Q^{\mathsf T}AQ\,\boldsymbol{y}=\boldsymbol{y}^{\mathsf T}\Lambda\boldsymbol{y}=\lambda_1y_1^2+\lambda_2y_2^2+\lambda_3y_3^2 .
$$



in  $\boldsymbol{y}$  In coordinates, the ellipsoid equation  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=1$  become  $\lambda_1y_1^2+\lambda_2y_2^2+\lambda_3y_3^2=1$, the coordinate axis is exactly along the direction of the eigenvector, along the  $i$  The length of the semi-axis in one direction is  $1/\sqrt{\lambda_i}$. The three eigenvalues of this question are approximately  $0.586$, $2$, $3.414$, corresponding to the semi-axis length approximately  $1.31$, $0.71$, $0.54$, the longest axis is assigned the smallest eigenvalue. this is **Principal Axis Theorem** The geometric content of (principal axis theorem): the eigenvector has a fixed direction, and the eigenvalue has a fixed length.

![Video 00:45:36: Classroom blackboard writing](</attachments/mit1806-72baaaf5f84d7589d2f96a66.jpg>)

*Video 00:45:36 \| Approximately corresponding to Section 6 "6. Third-order Example: Ellipsoid and Principal Axis Theorem".*

![Official Handout Summary Page 4/4](</attachments/mit1806-5c6cb1a310a773370d40ef54.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 27 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **Positive definite matrix** By default, it refers to the real symmetric matrix; it is the generalization of "the second derivative is positive" in the multi-dimensional case, corresponding to the minimum value of the multivariate function.
- Four equivalence criteria: all eigenvalues are positive; all sequential principal subforms are positive; all principal components are positive; quadratic form  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  for everything non-zero  $\boldsymbol{x}$  is positive (most textbooks take this as the definition).
- $2\times 2$  The four criteria here are indeed equivalent: by  $ac-b^2>0$  with  $a>0$  available  $c>0$, so the trace and determinant are both positive, and the eigenvalues are both positive; and vice versa.
- Example  $A=\begin{bmatrix}2&6\\6&c\end{bmatrix}$: $c>18$  Right concentration; $c=18$  positive semidefinite (eigenvalue  $0,20$, rank  $1$, there is only one pivot, the second row is the first row  $3$  times); $c=7$  Uncertain ($\det A=-22$, pivot  $2$  with  $-11$).
- Quadratic type  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}=ax_1^2+2bx_1x_2+cx_2^2$  is a pure quadratic homogeneous expression; $c=7$  when it is  $(1,-1)$  The value is  $-3$, the corresponding figure is a saddle point.
- Preparation method: $2x_1^2+12x_1x_2+20x_2^2=2(x_1+3x_2)^2+2x_2^2$. The coefficient outside the square is the pivot element, and the coefficient inside the square is the elimination multiplier. **The matching method is elimination**;The positive pivot gives a positive sum of squares, the graph is upward, and the origin is the minimum point.
- $c=20$  In the positive situation of , use  $z=1$  Slice into ovals; $c=7$  In the indefinite case, the same slice is a hyperbola.
- The binary function takes a strict minimum when the second-order derivative matrix of the stationary point is positive definite; conversely, taking the minimum only ensures that the second-order derivative matrix is positive semi-definite. Positive determination is a sufficient criterion; in calculus  $f_{11}f_{22}>f_{12}^2$  is the determinant criterion of this matrix. Yes  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$, the second derivative matrix is  $2A$.
- Third order example  $A=\begin{bmatrix}2&-1&0\\-1&2&-1\\0&-1&2\end{bmatrix}$:Sequential main form  $2,3,4$, pivot  $2,\tfrac32,\tfrac43$, characteristic value  $2-\sqrt2,2,2+\sqrt2$.
- third order quadratic form  $2\sum x_i^2-2x_1x_2-2x_2x_3$  dubbing  $2(x_1-\tfrac12x_2)^2+\tfrac32(x_2-\tfrac23x_3)^2+\tfrac43x_3^2$; slice  $f=1$  It's an ellipsoid. Principal Axis Theorem  $A=Q\Lambda Q^{\mathsf T}$  That is, the diagonalization of a symmetric matrix: the eigenvector determines the main axis direction, and the eigenvalue determines the axis length (semi-axis length)  $1/\sqrt{\lambda_i}$).

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| positive definite matrix | Positive definite matrix | Symmetric matrix, quadratic form takes positive value for all non-zero vectors |
| positive semi-definite | positive semidefinite | The quadratic form is nonnegative and allowed to be obtained  $0$, which is equivalent to non-negative eigenvalues |
| indefinite | Uncertain | The quadratic form is positive in some directions and negative in some directions. |
| quadratic form | Quadratic type | shaped like  $\boldsymbol{x}^{\mathsf T}A\boldsymbol{x}$  Pure quadratic homogeneous function of |
| leading principal minor | sequential subject form | Determinant of a submatrix that expands step by step starting from the upper left corner |
| completing the square | Preparation method | Write the quadratic form as the sum of squares, and the square external coefficient is the pivot element |
| matrix of second derivatives | second derivative matrix | A symmetric matrix composed of second-order partial derivatives, used to determine the minimum value |
| saddle point | saddle point | Stationary points that rise in some directions and fall in others |
| ellipse | ellipse | Intersection of the positive definite quadratic form on the horizontal plane |
| ellipsoid | ellipsoid | The graph of the positive definite ternary quadratic form on the isosurface |
| hyperbola | Hyperbola | Intersection of the indefinite quadratic form on the horizontal plane |
| paraboloid | Paraboloid | "Bowl" shaped surface of positive definite quadratic figure |
| principal axis theorem | Principal Axis Theorem | $A=Q\Lambda Q^{\mathsf T}$, the eigenvector gives the principal axis direction |
| major axis | long axis | The longest axis of the ellipsoid corresponds to the smallest eigenvalue |

---

[← Lecture 26](/en/notes/mit-1806/lec26) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 28 →](/en/notes/mit-1806/lec28)
