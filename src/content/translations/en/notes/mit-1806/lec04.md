---
kind: notes
source: mit-1806/lec04
title: Lecture 4 · LU decomposition of $A$
description: Write the elimination process as A=LU and understand why matrix
  factorization is the core of numerical calculations.
sourceHash: dcc2496bee432076937a5ab89796a4cdad33bf71bbfea07d90bb04be196d4100
publish: true
translationMethod: machine-assisted
---

> *Factorization into A = LU* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 4 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p4 · $A$  LU decomposition of](https://www.bilibili.com/video/BV1ix411f7Yp?p=4)(49:06)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-4-factorization-into-a-lu/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=4&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Lecture 2 writes each step of elimination as an elementary matrix, and Lecture 3 completes the rules for matrix multiplication; together we get  $E_{32}E_{21}A=U$. This formula is correct, but it is not easy to use. product  $E=E_{32}E_{21}$  Mix together the used multipliers from  $E$  I can no longer read on my body what steps Xiaoyuan has taken.

This lecture is about writing the same thing in a different direction. Do not stack the elimination matrix in  $A$  Instead of moving them to the right, you get the most basic factorization of the matrix:



$$
A=LU .
$$



$U$  is the end point of elimination, the upper triangular matrix; $L$  It is the result of multiplying the inverses of the series of elimination matrices in reverse order. The beauty is: $L$  Every multiplier used during elimination is kept intact, one step at a time, without interfering with each other. $A$  All the information is thus split into two halves: the "multiplier" and the "upper triangle", and no one owes anyone anything.

Before reaching this step, we need to add two tools about inversion and transposition: why the inverse of a product must be in reverse order, and why finding the inverse after transposing is equal to finding the inverse first and then transposing. They are not just techniques; $L$  It is exactly the "reverse inverse" of the elimination matrix. The second half of the lecture turns to two more practical questions: How many operations are required for elimination? The answer is  $\frac13 n^3$  magnitude; and when the pivot position appears  $0$, what matrix should be used when a line break is necessary - permutation matrix (permutation matrix).

![Official Handout Summary Page 1/3](</attachments/mit1806-84a127a3367bd045c6dd2ce0.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 4 Summary, CC BY-NC-SA 4.0).*

## 1. Inverse of product and inverse of transpose

Let me ask a direct question first: $A$  with  $B$  All reversible, $(AB)^{-1}$  What is it? Intuition makes people write  $A^{-1}B^{-1}$, but that’s not right. The two inverses do indeed need to be multiplied, but the order must be reversed:



$$
(AB)^{-1}=B^{-1}A^{-1}.
$$



Verification requires only multiplicative associativity. put  $AB$  with  $B^{-1}A^{-1}$  When multiplying, the brackets can be moved around, but the order cannot be changed:



$$
(AB)\bigl(B^{-1}A^{-1}\bigr)=A\bigl(BB^{-1}\bigr)A^{-1}=A\,I\,A^{-1}=AA^{-1}=I .
$$



The first step is to move the brackets to  $B$  with  $B^{-1}$  to get the identity matrix; then multiply it by the left  $A$, get  $A$;finally  $A$  with  $A^{-1}$  cancel, what remains  $I$. The same holds true when multiplied in the opposite direction:



$$
\bigl(B^{-1}A^{-1}\bigr)(AB)=B^{-1}\bigl(A^{-1}A\bigr)B=B^{-1}IB=B^{-1}B=I .
$$



Both sides return to the identity matrix, so  $B^{-1}A^{-1}$  indeed  $AB$  The inverse.

Why the order must be reversed? You can use the metaphor of putting on shoes to remember: put on socks first and then put on shoes. To undo this process, you must take off shoes first and then socks. The order of disassembly is always the reverse of the order in which it is performed. This principle will be used repeatedly later - elimination is a series of row transformations, and undoing it naturally starts from the last step.

The second tool is Transpose. known  $(AB)^{\mathsf T}=B^{\mathsf T}A^{\mathsf T}$, transposing a product also requires reverse order. now from  $AA^{-1}=I$  Start and transpose both sides at the same time. The identity matrix remains itself after transposition: it is symmetric about the diagonal, and no change is visible when swapping rows and columns. The left end is expanded in reverse order into  $(A^{-1})^{\mathsf T}A^{\mathsf T}$, so



$$
(A^{-1})^{\mathsf T}A^{\mathsf T}=I .
$$



This equation exactly illustrates  $(A^{-1})^{\mathsf T}$  Whose converse is it: it is the same as  $A^{\mathsf T}$  Multiply to get the identity matrix. Therefore



$$
\bigl(A^{\mathsf T}\bigr)^{-1}=\bigl(A^{-1}\bigr)^{\mathsf T}.
$$



In other words, transposing a matrix first and then inverting it, and inverting it first and then transposing it, have the same result, and the order of the two things can be interchanged at will. This conclusion will be used repeatedly in the future. At this moment, remember its origin: it is entirely derived from  $AA^{-1}=I$  It’s “turned” out of this equation.

![Video 00:04:55: Classroom blackboard writing](</attachments/mit1806-f6ea5ab6b1268b4739135e9a.jpg>)

*Video 00:04:55｜Approximately corresponding to Section 1 "1. The inverse of the product and the inverse of the transpose".*

## 2. Second level: $A=LU$  first example of

Now use the tool on elimination. Let’s start with the simplest second-order situation and see clearly  $A=LU$  How did it come out. take



$$
A=\begin{bmatrix}2&1\\8&7\end{bmatrix}.
$$



The first pivot is  $2$, to be eliminated  $(2,1)$  locational  $8$, the multiplier is  $8/2=4$. The second row minus the first row  $4$  Times: $(8,7)-(8,4)=(0,3)$. Written as a matrix, it is



$$
E_{21}=\begin{bmatrix}1&0\\-4&1\end{bmatrix},
\qquad
E_{21}A=\begin{bmatrix}2&1\\0&3\end{bmatrix}=U .
$$



Read this multiplication line by line: $E_{21}$  The second line of  $(-4,1)$  Explain that the new second line is  $-4$  times the first line plus  $1$  times the second row, i.e.  $(-8,-4)+(8,7)=(0,3)$; first line  $(1,0)$  Then leave the first line as is. $E_{21}$  only in  $(2,1)$  A number is placed in the position, and its function is to write the sentence "the second row minus four times the first row" into a matrix.

$(2,2)$  specially placed in the position  $7$  instead of  $4$, there is a reason. if there is  $4$, the second row happens to be the first row  $4$  times, after elimination, the entire second row becomes zero, the second pivot does not exist, the matrix is singular, and the entire decomposition is impossible to talk about.

Now put  $E_{21}$  Move to the right. Take both sides to the left at the same time  $E_{21}^{-1}$, it only needs to put  $(2,1)$  locational  $-4$  Change to  $+4$: How much is subtracted by elimination and how much is added back by inverse operation. So



$$
A=E_{21}^{-1}U=
\begin{bmatrix}1&0\\4&1\end{bmatrix}
\begin{bmatrix}2&1\\0&3\end{bmatrix}=LU .
$$



Directly test: $L$  The second line of  $(4,1)$  given  $4(2,1)+(0,3)=(8,4)+(0,3)=(8,7)$, exactly  $A$  the second line; the first line  $(1,0)$  given  $(2,1)$, that’s right.

$U$  is the first letter of upper, $L$  Naturally it is lower: $L$  It's a lower triangle, with everything on the diagonal  $1$; $U$  It is an upper triangle with two main elements sitting on the diagonal.  $2$  with  $3$. In the second-order situation  $E$  with  $L$  There is only one symbol difference, so you can't see much difference. The real difference is not revealed until the third level.

By the way, the main element can be brought out separately. put  $U$  Divide the first row of  $2$, the second row is divided by  $3$, the pivots fit into a diagonal matrix:



$$
A=
\begin{bmatrix}1&0\\4&1\end{bmatrix}
\begin{bmatrix}2&0\\0&3\end{bmatrix}
\begin{bmatrix}1&\tfrac12\\0&1\end{bmatrix}.
$$



On the diagonal of the factor on the left is  $1$, the one on the right is also the same, with the main element sandwiched in the middle, and the shape is smaller than  $LU$  More symmetrical. This way of writing is written as  $LDU$, among which  $D$  is **diagonal matrix** (diagonal matrix). Both forms of the actual software will be given and will be used in this course from now on.  $LU$.

## 3. Third order: the multiplier remains as is  $L$  inside

The second order is too simple, one  $E$  That's enough. It’s not until level three that you can see why it’s worthwhile to move the reverse to the right. Set  $A$  It is a third-order matrix, no line breaks are needed, and elimination is performed in a fixed order: use  $E_{21}$  put  $(2,1)$  The position becomes zero, then use  $E_{31}$  Process  $(3,1)$, and finally use  $E_{32}$  Process  $(3,2)$, get  $U$:



$$
E_{32}E_{31}E_{21}A=U .
$$



to make  $A$  If you leave it alone on the left, multiply the three inverse matrices from left to right - note that each time you multiply one, it disappears on the left and appears on the right, and the positions where it appears are arranged upside down:



$$
A=\underbrace{E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}}_{L}\,U .
$$



The order is completely reversed, which is exactly the result of the "reverse the order of undoing" rule in Section 1 being used three times in a row. The number of matrices is the number of elimination steps: $n$  order matrix to do  $1+2+\cdots+(n-1)=\frac{n(n-1)}{2}$  steps, each step contributes an elimination matrix, that is,  $L$  occupies a grid below the diagonal. The third level has  $3$  multiplier, the fourth order has  $6$ , exactly equal to  $L$  The total number of cells below the diagonal.

Let’s use a specific example to see what this string of inverse matrices looks like. Set



$$
E_{21}=\begin{bmatrix}1&0&0\\-2&1&0\\0&0&1\end{bmatrix},
\qquad
E_{31}=I,
\qquad
E_{32}=\begin{bmatrix}1&0&0\\0&1&0\\0&-5&1\end{bmatrix}.
$$



$E_{31}=I$  express  $(3,1)$  There is nothing to do at that step, there is already a zero there. Multiply the three elimination matrices in original order:



$$
E=E_{32}E_{31}E_{21}=E_{32}E_{21}=
\begin{bmatrix}1&0&0\\-2&1&0\\10&-5&1\end{bmatrix}.
$$



On the diagonal is  $1$, there are all zeros above the diagonal - elimination always uses the upper row to change the lower row, and information does not flow upward, which is different from Gauss-Jordan elimination. The problem is  $(3,1)$  That location  $10$. It's not wrong, but it's ugly and has no clue where it came from. Let’s trace back: First, subtract the first row from the second row.  $2$  times, then subtract from the third row **new** second line  $5$  times. The new second line already contains the first line  $-2$  times, then multiply  $5$  and subtract from the third row, equal to the first row  $10$  Times stuffed into the third row. multiplier  $2$  and  $5$  Mutual contamination on this chain gave birth to a  $10$.

Now switch to the other side and do the reverse in reverse order. Inverting a single elimination matrix simply flips the signs: $-2$  change  $+2$, $-5$  change  $+5$.



$$
L=E_{21}^{-1}E_{32}^{-1}=
\begin{bmatrix}1&0&0\\2&1&0\\0&0&1\end{bmatrix}
\begin{bmatrix}1&0&0\\0&1&0\\0&5&1\end{bmatrix}
=
\begin{bmatrix}1&0&0\\2&1&0\\0&5&1\end{bmatrix}.
$$



Check line by line: take the first line of the second factor from the first line, and get  $(1,0,0)$;The second line is  $2(1,0,0)+(0,1,0)=(2,1,0)$; Take the third row of the second factor as it is from the third row, and we get  $(0,5,1)$.$10$  Gone, $2$  with  $5$  Everyone stays in their own cells, and no one interferes with anyone else.

A general conclusion can be drawn from this: **As long as there is no row exchange, $L$  of  $(i,j)$  Yuan($i>j$) is to eliminate  $(i,j)$  The multiplier used when positioning.**  Want to get it  $L$, no additional calculations are required, just write down the multiplier when doing elimination. Furthermore, after clearing the second line, the new second line is stored in  $U$, the multiplier is deposited into  $L$, the original  $A$  You can throw it away——$A$  All the information is already in  $L$  with  $U$  Everyone is in their place. This is the new understanding brought about by writing elimination in matrix form: $E$  There was a melee on the other side, $L$  This side is a refreshing ledger.

Once a certain pivot position appears  $0$, two lines must be exchanged, this neat set of accounting will be disrupted, then  $A=LU$  to be rewritten as  $PA=LU$. This is left to the next lecture.

![Video 00:14:44: Classroom blackboard writing](</attachments/mit1806-44586d92a04d207b929e1785.jpg>)

*Video 00:14:44｜Approximately corresponding to Section 3 "3. Third order: the multiplier remains as is  $L$ "nearby".*

![Video 00:18:40: Classroom blackboard writing](</attachments/mit1806-8085f9bec98ff291bb26a418.jpg>)

*Video 00:18:40｜Approximately corresponding to Section 3 "3. Third order: the multiplier remains as is  $L$ "nearby".*

![Official Handout Summary Page 2/3](</attachments/mit1806-8bf5e309e085f4b7a66c383d.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 4 Summary, CC BY-NC-SA 4.0).*

## 4. The cost of elimination: why  $\frac13 n^3$

So far we have talked about "how to do it", and next we have to ask "how expensive". one  $n$  For a system of first-order equations, how many operations are required for elimination? This question has practical weight: Engineering always hopes to  $n$  The bigger the matrix, the better, because the larger the matrix, the more information it can hold and the more reliable the results, but the price will also increase, so you must know how fast it increases. $n=1000$  Can the system of equations be solved in one second? $n=10^6$  How long will it take? The key is to understand that the amount of calculation varies with  $n$  Ways of growing - like  $n$  With linear growth like that, doubling only takes twice as long; like  $n^2$  For square growth like that, it takes four times the time to double; like  $n^3$  In this way, if the cube grows, doubling it will take eight times; if it is like  $n!$  In that case, doubling it would be a disaster.

First, let’s define “one operation” clearly. A typical action is to multiply one row by a multiplier and then subtract from another row, with one multiplication and one subtraction in between. Here, multiplication and addition are counted as one operation; if the numbers are divided, the number of multiplications and subtractions is half, and the total number is only doubled, which does not affect the magnitude of the increase.

Now count the first steps. $n$  The order matrix has  $n^2$  elements. In the first step of elimination, the first row does not move, and all the following rows need to be changed, so approximately  $n^2$  elements, the cost is approximately  $n^2$. Strictly speaking, the first line has not been changed, the real number is less  $n$  one, but compared to  $n^2$  The difference is trivial—what is required here is the magnitude of the first item, not a precise item-by-item account.

In the second step, the first row is already in place, and there is no need to worry about the first column. The remaining  $(n-1)$  A small problem of order, the cost is about  $(n-1)^2$. The next step is  $(n-2)^2$, so decreasing, the last few steps are just spinning around on a few numbers. The total is approx.



$$
n^2+(n-1)^2+(n-2)^2+\cdots+2^2+1^2 .
$$



What is this sum? it obviously isn't  $n$, nor  $n^2$;There are a total of  $n$  terms, the largest term is  $n^2$, so the worst is  $n$  multiply  $n^2$, that is  $n^3$. While each item is decreasing, the actual ratio is  $n^3$  Small, about one-third the size:



$$
n^2+(n-1)^2+\cdots+1^2\approx\frac13 n^3 .
$$



that  $\frac13$  It is calculated from the fact that "the numbers are getting smaller". If you want to see its origin clearly, you can borrow calculus: in the continuous version, put  $x^2$  from  $0$  accumulated to  $n$,



$$
\int_0^n x^2\,\mathrm{d}x=\frac13 n^3 ,
$$



The same coefficients are obtained as the discrete summation. The summation is a discrete integral, and the integral is a continuous summation. The two must be consistent in the magnitude of the leading term.

This conclusion has two direct consequences. First, $n$  from  $100$  double to  $200$, the price rises to approximately  $8$  Times: $\frac13\cdot100^3\approx3.3\times10^5$, $\frac13\cdot200^3\approx2.7\times10^6$. Second, elimination is far better than any "formula solution". The big formula for determinant is  $n!$  items, $n$  Anything larger is completely unfeasible; $n^3$  with  $n!$  The gap between them is the actual reason why modern numerical linear algebra is all based on elimination.

right end vector  $\boldsymbol{b}$  The account must be settled separately. It only has one column. Follow elimination all the way and do back-substitution at a cost of only  $n^2$  magnitude, ratio  $n^3$  One factor less  $n$. This is exactly  $A=LU$  The Economics of: Flowers  $\frac13 n^3$  put  $A$  split into  $L$  with  $U$  Once, every time a new right-hand end vector comes, you only need to pay again  $n^2$. In engineering, it is often the same  $A$  With many  $\boldsymbol{b}$, first  $A$  Breaking it down and then dealing with the right end one by one is the most cost-effective way to organize it.

![Video 00:31:55: Classroom blackboard writing](</attachments/mit1806-956852027f431d0774e3ed57.jpg>)

*Video 00:31:55｜Approximately corresponding to Section 4 "4. The cost of elimination: why  $\frac13 n^3$"Nearby.*

## 5. Permutation matrix: Line wrapping is also a matrix multiplication

The last topic returns to the gap where elimination fails: the pivot position is  $0$, two lines must be swapped, sometimes even twice. Swapping two rows is the same as "subtracting a multiple of one row from another row". It is a row transformation of the matrix, so it can also be written as left multiplication of a matrix. The only question is what this matrix looks like. The matrix that does this is called **permutation matrix**, recorded as  $P$. Its construction method is extremely simple: rearrange the rows of the identity matrix, and it can do the same row rearrangement for any matrix. The principle of inspection is the same as before——$P$  Each row of has only one  $1$, that  $1$  The position of indicates that the row of the product should be  $A$  Which row of .

First list all third-order permutation matrices. $I$  If you count yourself as one, it will not change anything;  $I$  By swapping the first two lines of , we get  $P_{12}$, swap the first and last two lines to get  $P_{13}$, they exchange the first and second rows with the first and third rows respectively:



$$
I=\begin{bmatrix}1&0&0\\0&1&0\\0&0&1\end{bmatrix},
\qquad
P_{12}=\begin{bmatrix}0&1&0\\1&0&0\\0&0&1\end{bmatrix},
\qquad
P_{13}=\begin{bmatrix}0&0&1\\0&1&0\\1&0&0\end{bmatrix}.
$$



In the same way, swap the second and third rows  $P_{23}$  swapped  $I$  The last two lines of are obtained. The first three  $P$($P_{12}$, $P_{13}$, $P_{23}$) only exchanges one pair of rows, the remaining possibility is to rotate the three rows as a whole:



$$
P_{23}=\begin{bmatrix}1&0&0\\0&0&1\\0&1&0\end{bmatrix},
\qquad
Q=\begin{bmatrix}0&1&0\\0&0&1\\1&0&0\end{bmatrix},
\qquad
Q'=\begin{bmatrix}0&0&1\\1&0&0\\0&1&0\end{bmatrix}.
$$



$Q$  It is a cycle: the second row goes up to the first row, the third row goes up to the second row, the first row goes down to the third row; $Q'$  Then rotate in the opposite direction. Counting, there are exactly six. Generally, $n$  The number of order permutation matrices is  $n!$, because each row arrangement corresponds to a matrix; the fourth order has  $4!=24$ .

These six matrices form a small closed family. When two permutation matrices are multiplied, the result is still in the list - first do a row rotation, then do a row rotation, and the total is nothing more than a row wrap. You can't get out even by doing the inverse: if you put the changed lines back, you still get a line break. In algebraic language, they form a **group** (group), six elements, multiplication and inversion are not out of bounds.

Specifically, look at a few inverses. After exchanging the first and second lines, you only need to exchange them again to return to the original state, so  $P_{12}$  It is the opposite of itself, $P_{12}^{-1}=P_{12}$. And  $Q$  with  $Q'$  Inverse of each other: $Q'$  doing exactly  $Q$  The reverse rotation of  $I$.

The permutation matrix also has a beautiful property: **Inverse equals transpose**, $P^{-1}=P^{\mathsf T}$. The reason is that each row and column of the permutation matrix has exactly one  $1$, the rest are all zero; transpose the "th  $i$ "Which row the row is taken from" becomes "th  $i$  where the rows were sent", which happens to be the reverse description of the same row rearrangement. So for a permutation matrix, inversion and transposition are the same thing.

This closure has a very practical corollary: no matter how many times the rows are swapped during the elimination process, these swaps can eventually be merged into **one** $P$, written as a clean prefix. This is exactly what the next lecture will do  $A=LU$  repair into  $PA=LU$  The confidence: when the elimination must wrap, put  $P$  ride on the left  $A$  in front, $L$  with  $U$  You can keep that refreshing accounting. At this point, the main line of elimination is finished.

![Video 00:38:39: Classroom blackboard writing](</attachments/mit1806-bb0482b26d686368e4fe3b3e.jpg>)

*Video 00:38:39｜Approximately corresponding to Section 5 "5. Permutation matrix: line wrapping is also a matrix multiplication".*

![Video 00:39:17: Classroom blackboard writing](</attachments/mit1806-3b4a050c5d172f1d9929664e.jpg>)

*Video 00:39:17｜Approximately corresponding to section 5 "5. Permutation matrix: line wrapping is also a matrix multiplication".*

![Video 00:44:11: Classroom blackboard writing](</attachments/mit1806-5e0c02521b35c852b3e7f9df.jpg>)

*Video 00:44:11｜Approximately corresponding to Section 5 "5. Permutation matrix: Line wrapping is also a matrix multiplication".*

![Official Handout Summary Page 3/3](</attachments/mit1806-ba1ac5b373a4ed0904dc4ecd.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 4 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The inverse of the product is in reverse order: $(AB)^{-1}=B^{-1}A^{-1}$, because undoing a series of operations must start from the last step; verification only uses the associative law, $(AB)(B^{-1}A^{-1})=A(BB^{-1})A^{-1}=I$.
- Transpose and inversion can exchange the order: by  $AA^{-1}=I$  Transpose both sides  $(A^{-1})^{\mathsf T}A^{\mathsf T}=I$, so  $(A^{\mathsf T})^{-1}=(A^{-1})^{\mathsf T}$.
- Second order example  $A=\begin{bmatrix}2&1\\8&7\end{bmatrix}$  The medium multiplier is  $4$, $E_{21}=\begin{bmatrix}1&0\\-4&1\end{bmatrix}$  put  $A$  turn into  $U=\begin{bmatrix}2&1\\0&3\end{bmatrix}$; put  $E_{21}$  Move it to the right  $A=LU$, $L=\begin{bmatrix}1&0\\4&1\end{bmatrix}$.
- $L$  It is the lower triangle and the diagonal elements are all  $1$; $U$  It is the upper triangle and the diagonal element are the two main elements. If the pivot element is extracted separately, we will get  $LDU$  In the form, the diagonal matrix in the middle contains the pivot element, and the diagonal elements of the factors on both sides are  $1$.
- third order situation  $E_{32}E_{31}E_{21}A=U$  Correspond  $A=E_{21}^{-1}E_{31}^{-1}E_{32}^{-1}U$; in the example  $E$  of  $(3,1)$  Yuan is  $10$($2$  with  $5$  caused by mutual contamination), and  $L$  only clean ones  $2$  with  $5$.
- Core conclusion: When no row exchange is performed, the multiplier used for elimination enters directly  $L$  corresponding position without any additional calculation; new rows are stored in the elimination process  $U$, deposit multiplier  $L$, the original  $A$  It can be discarded.
- The amount of operation of elimination: the first step is about  $n^2$, followed by  $(n-1)^2,\dots,1^2$, the total is approximately  $\frac13 n^3$ (available  $\int_0^n x^2\,\mathrm{d}x=\frac13 n^3$  control).
- The cost of the right-hand vector is only  $n^2$; therefore first  $A$  decomposed into  $L$  with  $U$ (pay  $\frac13 n^3$), and then process multiple right-hand vectors one by one, which is the most economical approach. determinant formula  $n!$  Magnitude explains why only elimination is used in calculations.
- The permutation matrix is obtained by rearranging the rows of the identity matrix, $n$  level total  $n!$  one; the third level has  $6$  There are 4 levels  $24$ . They are closed to multiplication and inversion and form a group.
- The permutation matrix satisfies  $P^{-1}=P^{\mathsf T}$;Swap a pair of rows  $P$  It is the inverse of itself, and the two three cycles are the inverse of each other. The next lecture on writing in the context of line exchange  $PA=LU$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| factorization | decompose | Write a matrix as the product of several matrices with a simpler structure, such as  $A=LU$ |
| LU factorization | LU decomposition | put  $A$  written as unit lower triangle  $L$  and upper triangle  $U$  The product of $L$  Record elimination multiplier |
| lower triangular matrix | lower triangular matrix | A matrix with all zeros above the main diagonal, $L$  The diagonal elements of are all  $1$ |
| upper triangular matrix | upper triangular matrix | A matrix with all zeros below the main diagonal, $U$  The diagonal element of is the pivot element |
| diagonal matrix | diagonal matrix | A matrix whose off-diagonal elements are all zeros, $LDU$  The factor in the middle of the form |
| multiplier | multiplier | The "multiple of the pivot row" subtracted from a certain row during elimination. Enter directly without row exchange.  $L$ |
| elementary matrix | elementary matrix | The matrix corresponding to one elimination step, its inverse only needs to change the sign of the multiplier |
| identity matrix | identity matrix | All diagonal elements are  $1$  The matrix of is still itself after transposition |
| inverse matrix | inverse matrix | Multiply the original matrix to obtain the matrix of the identity matrix; the inverse of the product is taken in reverse order |
| transpose | transpose | Swap rows and columns; for a single matrix, transpose and inversion can swap the order |
| permutation matrix | permutation matrix | The matrix obtained by rearranging the rows of the identity matrix is used to exchange the rows to satisfy  $P^{-1}=P^{\mathsf T}$ |
| row exchange | row swap | When the pivot position is zero, swap the two rows to obtain a non-zero pivot, as shown in  $P$  Implemented by left multiplication |
| operation count | Amount of operation | The number of multiplications, additions and subtractions required to complete an algorithm, elimination is  $\frac13 n^3$  magnitude |
| group | group | A set of matrices that is closed to both multiplication and inversion, such as all  $n$  order permutation matrix |

---

[← Lecture 3](/en/notes/mit-1806/lec03) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 5 →](/en/notes/mit-1806/lec05)
