---
kind: notes
source: mit-1806/lec18
title: Lecture 18 · Properties of Determinants
description: Starting from the three defining properties, all the properties of
  the determinant are deduced.
sourceHash: 3ce724e65c03a07b8b3667a01a9c8930c03cc77b095274c7d500721f5505e6d8
publish: true
translationMethod: machine-assisted
---

> *Properties of determinants* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 18 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p18 · Properties of determinants](https://www.bilibili.com/video/BV1ix411f7Yp?p=18)(49:12)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-18-properties-of-determinants/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=18&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The protagonist of the first seventeen lectures is the rectangular matrix: $m\times n$  of  $A$  put  $\mathbb{R}^n$  The vector in is sent to  $\mathbb{R}^m$, four basic subspaces surround  $A\boldsymbol{x}=\boldsymbol{b}$  Whether there is a solution and how many solutions there are. From this lecture on, attention turns to **square array** (square matrix), and introduces two main lines that run through the second half of the course: determinants and eigenvalues. The first big reason to talk about determinants is to be able to define and calculate eigenvalues later.

**determinant** (determinant) is a number attached to each square matrix, written as  $\det A$, also often written in the form of vertical lines  $|A|$. Of course, one number cannot restore the entire matrix, but it is the result of compressing the matrix information into one number as much as possible. The first sentence to grab is: $\det A\ne 0$  time  $A$  reversible, $\det A=0$  time  $A$ **Strange** (singular, that is, irreversible). So the determinant is first of all a criterion for reversibility; but it can do much more than just judge reversibility.

The order of teaching needs to be considered. It is not advisable to show out the big formula of the determinant all at once. There are too many things stuffed into the formula, and the structure cannot be seen. A clearer route is: first establish three properties and treat them as definitions; then use these three properties to deduce the remaining seven properties one by one; finally look back at the formula. Three plus seven are exactly ten. The first three are definitions, and the last seven are theorems. The whole theory grows from here. In this way, $2\times2$  situational  $ad-bc$  It is no longer a starting point, but a ruler that can be checked at any time; $n$  The explicit formula for the order is left to the next lecture. Pay special attention to the positive and negative signs throughout the lecture, as they are everywhere in the formulas and properties of determinants.

![Official Handout Summary Page 1/3](</attachments/mit1806-cdb016174e940b06adc90b0b.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 18 Summary, CC BY-NC-SA 4.0).*

## 1. Three defining properties

The determinant is not defined by a formula, but by three properties. These three properties only talk about row operations, but they are enough to determine the number corresponding to a square matrix of any order.

Property 1 is the most straightforward: **identity matrix** The determinant of (identity matrix) is equal to  $1$.



$$
\det I=1 .
$$



Property 2 is about row exchange: exchange any two rows of the matrix and change the sign of the determinant. If  $A'$  Yes  $A$  of the  $i$  line and order  $j$  The matrix obtained by swapping rows, then



$$
\det A'=-\det A .
$$



The combination of properties 1 and 2 is enough to know the determinant of an entire class of matrices. **permutation matrix**(permutation matrix)$P$  It is obtained by several row exchanges of the identity matrix, so  $\det P$  can only be  $1$  or  $-1$, depending on whether the number of exchanges is an even or odd number. $2\times2$  Two minimal examples of are



$$
\det\begin{bmatrix}1&0\\0&1\end{bmatrix}=1,
\qquad
\det\begin{bmatrix}0&1\\1&0\end{bmatrix}=-1 .
$$



The third property is the most critical, it is divided into two halves. 3A: Multiply a row by  $t$, the remaining rows remain unchanged, and the determinant is multiplied by  $t$:



$$
\det\begin{bmatrix}ta&tb\\c&d\end{bmatrix}
=t\det\begin{bmatrix}a&b\\c&d\end{bmatrix}.
$$



3B: If the elements of a certain row are the sum of two numbers, the determinant can be split into the sum of the two determinants according to this row:



$$
\det\begin{bmatrix}a+a'&b+b'\\c&d\end{bmatrix}
=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
+\det\begin{bmatrix}a'&b'\\c&d\end{bmatrix}.
$$



Summarize it in one sentence: **The determinant is linear for each row separately**. It must also be made clear here what it does not advocate. it does not advocate  $\det(A+B)=\det A+\det B$. If that "overall linearity" holds true, it is equivalent to allowing  $A$  with  $B$  Each row of is different. The separated determinant does not share any row with the original matrix, and the third property loses its control. Both 3A and 3B are only allowed to move one row, and the rest are  $n-1$  The rows must remain unchanged in both determinants - it is this restriction that makes it useful.

Only the first line is written above, but every line holds true. If the combination falls on the  $k$  OK, use property two to change it to the first line, apply the above conclusion, and then use property two to change it back; the two exchanges each produce a negative sign, which cancels each other out, and the conclusion remains unchanged. So the sentence "linear for each row" is correct  $n$  All are valid.

In terms of coverage, properties 1 and 2 only cover a very special class of matrices such as permutation matrices, which are derived from unit matrices. It is the third property that really allows determinants to handle general matrices. Where do the symbols for the first two tubes come from, and how do you calculate the value of the third tube?

At this time, you can first write next to  $2\times2$  answer



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc,
$$



It does not participate in proof, but is only used to check whether each property is consistent with the known situation. What really matters is that the three properties give a number for a square matrix of any order, not just for  $2\times2$  Valid.

![Video 00:04:55: Classroom blackboard writing](</attachments/mit1806-d2e7369301e86d0764fc2f45.jpg>)

*Video 00:04:55 \| Approximately corresponding to Section 1 "1. Three Definitions of Properties".*

![Video 00:05:54: Classroom blackboard writing](</attachments/mit1806-dc7c4cd28aa1c2dcd4a31fb1.jpg>)

*Video 00:05:54｜Approximately corresponding to Section 1 "1. Three Defining Properties".*

## 2. Two rows are equal, row transformation and zero row

Starting from the three properties, the first inference is: a matrix with two equal rows has a determinant of zero. this is **Property four**.

The three conclusions to be derived in this section - two rows are equal, rows are unchanged when changing, and zero rows appear - are not allowed to introduce any new assumptions, and each one must go back to properties one, two, and three. This is also the methodology of the entire lecture: all properties of determinants must be deducible from the first three items.

First look at the two lines that are equal. The proof uses only properties 1, 2, and 3. Assume a  $7\times 7$  The first row of the matrix is the same as the third row. By exchanging these two rows, the matrix obtained is exactly the same as the original, so the determinant remains unchanged; but the second property also states that the sign must be changed when exchanging two rows. So



$$
\det A=-\det A ,
$$



the only possibility is  $\det A=0$. This reasoning only relies on the action of "exchange" to force out a numerical conclusion. By the way, it also confirms the previous knowledge: two lines are equal means **rank** (rank) less than  $n$, the matrix is irreversible and the determinant should be zero.

The second corollary is **Property five**: Reduce multiples of one line to another line, leaving the determinant unchanged. This is exactly **elimination** (Elimination) What you are doing repeatedly is also the basis for "elimination does not change the determinant". Still with  $2\times2$  For example, subtract the first row from the second row  $l$  times and use 3B for the second row:



$$
\begin{aligned}
\det\begin{bmatrix}a&b\\c-la&d-lb\end{bmatrix}
&=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
+\det\begin{bmatrix}a&b\\-la&-lb\end{bmatrix}\\
&=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
-l\det\begin{bmatrix}a&b\\a&b\end{bmatrix}\\
&=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}.
\end{aligned}
$$



The first step is to keep the first row unchanged and split the second row into  $(c,d)$  with  $(-la,-lb)$  Two groups; second step with 3A raised from second row  $-l$; In the third step, use the previous inference, and the remaining two rows of determinants are the same, equal to zero.

The same applies to general situations. No.  $k$  row minus th  $i$  OK  $l$  times, from 3B we get the "original determinant" plus the "th  $k$  Replace the line with  $-l$  times  $i$  Determinant of "row"; use 3A for this additional term  $-l$, the remaining matrix  $k$  line and order  $i$  If the rows are equal, the conclusion that the two rows are equal is zero. So the entire additional term is zero and the determinant remains unchanged. Three tools perform their own duties here: 3B is responsible for isolating changes, 3A is responsible for moving multiples out of the determinant, and property 4 is responsible for zeroing out the moved things.

The reason why this property is necessary is that every step of elimination is exactly this kind of row transformation: using the pivot row to eliminate the following elements, what is done is "from the first  $k$  row minus th  $i$  several times the number of rows". Therefore, the determinant of the entire elimination chain does not change, and the symbols are only flipped when a new line occurs.

So you can write



$$
\det A=\det U,
$$



Among them  $U$  It is obtained by elimination **upper triangular matrix** (upper triangular matrix), on the diagonal is **pivot** (pivot). The determinant problem of general matrices has since been transformed into the determinant problem of triangular matrices.

The third inference is **Property six**: As long as there is an entire row of zeros, the determinant is zero. It is obtained by 3A - think of the all-zero row as  $0$  Multiply a row vector and get  $t=0$  Just multiply the entire determinant to zero. A zero row means that this row does not provide any new information, and the matrix is ​​singular; however, before property 8, it cannot be argued with "singularity implies that the determinant is zero", and can only rely on 3A.

The two rows are equal, the row transformation does not change, and the zero row returns to zero. After these three things are put together, the calculation of the determinant can fall on the triangular matrix. This is the task of the next section.

![Video 00:18:42: Classroom blackboard writing](</attachments/mit1806-26f60198a6a365e03f59e3ec.jpg>)

*Video 00:18:42 \| Approximately corresponding to Section 2 "2. Two rows are equal, row transformation and zero row".*

## 3. Product of triangular matrix and pivot element

Now ask: What is the determinant of a triangular matrix? this is **Property seven**. Set  $U$  is an upper triangular matrix, and the diagonal element is written as  $d_1,d_2,\dots,d_n$, elements above the diagonal are insignificant:



$$
U=\begin{bmatrix}
d_1&*&*&*\\
0&d_2&*&*\\
0&0&\ddots&\vdots\\
0&0&0&d_n
\end{bmatrix},
\qquad
\det U=d_1d_2\cdots d_n .
$$



The same goes for the lower triangular matrix, just replace "upper" with "lower".

The proof is divided into two situations. If all  $d_i\ne 0$, use property five to clear the elements above the diagonal: starting from the second row, use the  $k$  The row multiplied by an appropriate multiple is reduced to the rows above it, and the  $k$  Elements above the column diagonal are cleared to zero; because  $U$  It is an upper triangular shape.  $k$  go ahead  $k-1$  Columns are filled with zeros, and these operations will not destroy already cleared columns. Make it all the way  $n$  OK, you get a diagonal matrix. Here, the diagonal element is required to be non-zero, because the so-called "appropriate multiple" is actually divided by the eliminated element  $d_k$, once  $d_k=0$, these multipliers simply cannot be calculated.

Why is a diagonal matrix equal to the product of its diagonal elements? This time use 3A to extract the factors row by row: from the first row  $d_1$, the first line becomes  $(1,0,\dots,0)$;Extracted from the second line  $d_2$, the second line becomes  $(0,1,0,\dots)$; If this continues, all  $d_i$  It is mentioned that outside the determinant, the identity matrix remains inside, and the first property says that the determinant of the identity matrix is  $1$. So the original determinant is equal to  $d_1d_2\cdots d_n$.

If a certain  $d_i=0$, using elimination will create a whole row of zeros, and the determinant is zero; while the product  $d_1\cdots d_n$  Also zero. Putting the two situations together, the formula holds for all triangular matrices.

$U$  The diagonal element of is the pivot element obtained by elimination, so this formula is equivalent to saying: the determinant of a triangular matrix is the product of the pivot elements. It uses the same language as Chapter 2 "The number of pivots determines reversibility", but here it goes one step further - multiplying the pivots together results in a number.

**The price of exchange.**  The above derivation does not require line breaks for elimination by default. If it is necessary to wrap the line, turn it over every time the symbol is changed, so



$$
\det A=(-1)^{r}d_1d_2\cdots d_n ,
$$



Among them  $r$  is the number of row exchanges during elimination. This is the source of the sign between the "product of pivots" and the "determinant".

This property also has a practical significance: it is the standard way for computers to find determinants. A matrix of order 100 will not expand any big formula, but will eliminate it into a triangle, and then multiply the pivot elements; $n$  The explicit formula of the order will not be deduced until the next lecture.

return to  $2\times2$  Check it out. The two pivots obtained by elimination are  $a$  with  $d-\frac{c}{a}b$ (The multiplier is  $c/a$), so



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
=a\left(d-\frac{c}{a}b\right)=ad-bc .
$$



This derivation has a premise: $a\ne 0$. If  $a=0$, the pivot cannot be taken out in the first step, and the two rows must be exchanged first. This requires  $c\ne 0$; If even exchange cannot save it, it means that the first column is all zero, the matrix is singular, and the determinant is zero. So far, $ad-bc$  It is a result deduced from the three properties, rather than a formula that needs to be memorized.

![Official Handout Summary Page 2/3](</attachments/mit1806-e24d9ec16b35342eab065a83.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 18 Summary, CC BY-NC-SA 4.0).*

## 4. The determinant is zero if and only if the matrix is singular

With property seven, we can make it clear that "the determinant is reversible".

**Property eight**: $\det A=0$  if and only if  $A$  strange; strange; $A$  Reversible  $\det A\ne 0$.

Prove that the dollar still disappears  $A\to U$. If  $A$  Weird, the elements cannot be eliminated  $n$  There must be zero rows for each pivot element. According to the sixth property  $\det U=0$, and property five says that row transformation does not change the determinant, so  $\det A=0$. If  $A$  Reversible, elimination gives the complete  $n$  non-zero pivot, by property seven  $\det A=d_1d_2\cdots d_n\ne 0$.

The two situations use the same set of eliminations, but the endings are different: when it is reversible, the eliminations go all the way to the end, and everything is completed.  $n$  non-zero pivot elements; when singular, the elimination element must be stuck in a certain column, and the remaining rows can only be reduced to zero. The determinant records exactly this bifurcation - a non-zero product on one side and zero on the other.

So the determinant becomes a fair criterion: it is zero only when it is singular, and never zero as long as it is not singular. This is two ways of saying the same thing as "Reversibility is equivalent to complete pivot" in Chapter 2. From now on, there is an additional way to judge reversibility: you don't have to actually find the inverse matrix, you only need a number. Determinants deserve their own chapter, and here's why.

![Video 00:31:59: Classroom blackboard writing](</attachments/mit1806-fe3b41c1125f110297dc957c.jpg>)

*Video 00:31:59｜Approximately corresponding to Section 4 "4. The determinant is zero if and only if the matrix is singular".*

## 5. Determinant of product

The next question is: Is there any connection between determinants and matrix multiplication?

**Property nine**: The determinant of the product of two square matrices is equal to the product of their respective determinants,



$$
\det(AB)=\det A\cdot\det B .
$$



This property comes a bit suddenly: matrix multiplication was not mentioned for a long time, but determinants happen to have multiplicative properties. What is more worthy of comparison is addition - the determinant does not have such properties for addition, $\det(A+B)$  Generally not equal to  $\det A+\det B$; But for multiplication, it is multiplicative.

The proof starts with a situation that can be read directly. If  $A,B$  are all diagonal matrices, and the determinants on both sides are equal to the product of their respective diagonal elements, and  $AB$  It is still a diagonal matrix and diagonal elements are multiplied one by one, so  $\det(AB)=\det A\det B$  Set up immediately. Generally speaking, matrices require patient completion of arguments through elimination, which will not be expanded upon here. This lecture will only use it as a tool for further derivation.

This immediately yields the determinant of the inverse matrix. in  $A^{-1}A=I$  Take the determinant on both sides, split the left side according to property nine, and the right side is equal to property one  $1$:



$$
\det(A^{-1})\det A=\det I=1
\quad\Longrightarrow\quad
\det(A^{-1})=\frac{1}{\det A}.
$$



Diagonal matrices can be checked: $A=\begin{bmatrix}2&0\\0&3\end{bmatrix}$  The determinant of is  $6$, $A^{-1}=\begin{bmatrix}1/2&0\\0&1/3\end{bmatrix}$  The determinant of is  $1/6$, which happens to be the countdown.

There are two incidental corollaries. One, $\det(A^2)=(\det A)^2$: The matrix is squared, and the determinant is also squared. Second, multiply the entire matrix by  $2$- Each element is doubled - the determinant is multiplied  $2^n$  instead of  $2$. Reason 3A: Each row contains factors  $2$, one can come up with one from the first line  $2$, propose another one from the second line  $2$, until the  $n$  OK, put forward a total of  $n$ . It's the same thing as volume: double the size of each side of the box, $n$  Dimensional volume is multiplied by  $2^n$, in three dimensions it is  $8$  times.

Property nine also confirms the strange situation: if  $\det A=0$, $A^{-1}$  does not exist, but  $1/0$  It is meaningless in the first place. The two facts are self-consistent with each other.

![Video 00:35:25: Classroom blackboard writing](</attachments/mit1806-a23af2088c8232a2e69eca11.jpg>)

*Video 00:35:25 \| Approximately corresponding to Section 5 "5. Determinants of products".*

![Video 00:38:22: Classroom blackboard writing](</attachments/mit1806-6aec896e1298fff490a33185.jpg>)

*Video 00:38:22｜Approximately corresponding to Section 5 "5. Determinant of product".*

## 6. Transposition does not change the determinant

The last property brings in an operation that seems to have nothing to do with determinants.

**Nature ten**:



$$
\det(A^{\mathsf T})=\det A .
$$



$2\times2$  The situation can be seen at a glance: $\begin{bmatrix}a&b\\c&d\end{bmatrix}$  with its **transpose**(transpose)$\begin{bmatrix}a&c\\b&d\end{bmatrix}$  The determinants of are all  $ad-bc$, transposing doesn't change anything.

This property translates all previous conclusions about rows into conclusions about columns. If there is a whole column of zeros, the determinant is zero (transpose into rows, use property 6); swap two columns, and the determinant changes sign (transpose into rows, swap, and then transpose back, but the transposition itself does not change the determinant). Therefore, the status of rows and columns in the determinant is completely equal, and none of the previous properties is unique to rows. This point is worth remembering alone: ​​the entire set of properties is initially stated in rows, but the conclusion automatically holds true, relying on property ten.

Prove to go  $A=LU$  To decompose, first cover the situation where row swapping is not required. $A=LU$  time  $A^{\mathsf T}=U^{\mathsf T}L^{\mathsf T}$, by property nine



$$
\det(A^{\mathsf T})=\det(U^{\mathsf T})\det(L^{\mathsf T}).
$$



$L$  is a unit lower triangular matrix (lower triangular, and all diagonal elements are  $1$), by property seven  $\det L=1$; $L^{\mathsf T}$  It is also a triangular matrix, and all diagonal elements are  $1$, so  $\det L^{\mathsf T}=1$.$U$  with  $U^{\mathsf T}$  They are also triangular matrices with the same diagonals, and are equal to  $d_1\cdots d_n$. Substitute



$$
\det(A^{\mathsf T})=(d_1\cdots d_n)\cdot 1=\det U\cdot\det L=\det(UL)=\det A .
$$



Situations and strange situations that require line exchange can be supplemented according to the same idea. Here we only follow this main line. The entire proof uses only properties that have been proven: read out property seven  $\det L=\det L^{\mathsf T}=1$  and  $\det U=\det U^{\mathsf T}=d_1\cdots d_n$, property nine separates the determinant of the product and finally synthesizes it  $\det A$.

## 7. Why are symbols certain?

At the end of the whole lecture, we have to deal with a hidden danger that has been buried since the first point.

Property 2 stipulates that the symbol will be turned over, but does not stipulate how many times or which path to turn over. Consider a permutation matrix  $P$  Either from  $I$  For departure  $7$  Obtained from exchange, can also be obtained from  $I$  For departure  $10$  exchanged. According to property two, the former gives  $\det P=-\det I=-1$, the latter gives  $\det P=+1$. If the two answers fight, the determinant will lose its meaning, and the entire lecture will be impossible to discuss.

What comes to the rescue is a purely combinatorial fact: every permutation is either **even permutation** (even permutation, even number of exchanges can be done), or **odd permutation** (odd permutation, an odd number of exchanges can do it), it must be one of the two, it cannot be both. Therefore, the positive and negative signs caused by the exchange are only determined by the replacement itself and have nothing to do with the specific line wrapping steps. This fact requires a bit of algebraic skill to prove, but once it is admitted, three properties uniquely determine a number: three is the definition, four to ten are the inferences, and there is no inherent conflict between the ten properties.

In other words, the three properties are not random conventions, they define a function that actually exists. Only after this step has settled, can the previous derivation truly hold up: Property 5 ensures that elimination does not change the determinant, and the path elimination can take is not unique. If the same matrix uses two paths to calculate two different numbers, $\det A=\det U$  This equation is impossible to discuss.

![Video 00:44:17: Classroom blackboard writing](</attachments/mit1806-fc02de37719f6b7e0fb033d5.jpg>)

*Video 00:44:17 \| Approximately corresponding to Section 7 "7. Why symbols are certain".*

![Official Handout Summary Page 3/3](</attachments/mit1806-ef2f443cb1cba6e00b468c91.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 18 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **determinant** (determinant) is a number attached to each square matrix, written as  $\det A$  or  $|A|$; $\det A\ne0$  time  $A$  reversible, $\det A=0$  time  $A$  Bizarre. The main motivation for talking about it is the following eigenvalues.
- Three defining properties: $\det I=1$;Swap two rows and change signs; the determinant is linear for each row separately (3A Multiply a row  $t$  factor  $t$, 3B When a row is split into two terms, it is split into the sum of two determinants). Note  $\det(A+B)\ne\det A+\det B$.
- It is deduced from three properties: if two rows are equal, the determinant is zero (exchanging the two rows of matrices does not change, but the sign is reversed); reducing the multiple of one row to another row does not change the determinant (3B is disassembled, 3A proposes  $-l$, two rows are equal and return to zero); if there is a row with all zeros, the determinant is zero (3A takes  $t=0$).
- The determinant of a triangular matrix is equal to the product of diagonal elements: use row transformation to clear out the elements above the diagonal to obtain a diagonal matrix, and then use 3A to propose it row by row  $d_i$, finally using property 1 to get  $1$; if a certain  $d_i=0$, the elimination produces zero rows, and the determinant is zero.
- Elimination does not change the determinant, so  $\det A=(-1)^rd_1\cdots d_n$, $r$  is the number of row exchanges; the product of pivots is the computer's method of finding the determinant. $2\times2$  The two pivots of are  $a$  with  $d-\frac{c}{a}b$, the product is  $ad-bc$ (Premise  $a\ne0$, otherwise wrap first).
- **Property eight**: $\det A=0$  if and only if  $A$  strange; not strange  $n$  The product of non-zero pivot elements is not zero. The determinant is therefore a fair criterion of reversibility.
- **Property nine**: $\det(AB)=\det A\det B$. Corollary: $\det(A^{-1})=1/\det A$ (diagonal matrix  $A=\operatorname{diag}(2,3)$  with  $A^{-1}$  given separately  $6$  with  $1/6$), $\det(A^2)=(\det A)^2$, $\det(2A)=2^n\det A$ (Volume analogy: double the side length, $n$  Dimensional volume multiplication  $2^n$).
- **Nature ten**: $\det(A^{\mathsf T})=\det A$. All the properties of rows are also true of columns: zeroing columns and swapping two columns are the same. For proof  $A=LU$, among which  $\det L=\det L^{\mathsf T}=1$, $\det U=\det U^{\mathsf T}=d_1\cdots d_n$.
- The sign of the determinant is determined because each permutation is either odd or even, and the sign determined by the number of permutations only depends on the permutation itself; the three properties therefore uniquely determine the determinant, and the remaining seven properties are all inferences.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| determinant | determinant | A number attached to each square matrix, recorded as  $\det A$  or  $\lvert A\rvert$ |
| square matrix | square array | A matrix with the same number of rows and columns; the determinant is only defined for square matrices |
| singular | Strange | Irreversible, equivalent to  $\det A=0$ |
| identity matrix | identity matrix | All diagonal elements are  $1$  The matrix of $\det I=1$ |
| permutation matrix | permutation matrix | It is obtained by exchanging several rows of the identity matrix, and the determinant is  $1$  or  $-1$ |
| row exchange | row swap | The operation of exchanging two rows to change the sign of the determinant |
| linearity in each row | Linear for each row | The corresponding behavior of the determinant when scaling or splitting a row individually, i.e. properties 3A and 3B |
| elimination | elimination | put  $A$  into an upper triangle  $U$  row transformation without changing the determinant |
| triangular matrix | triangular matrix | A square matrix with all zeros on one side of the diagonal. The determinant is equal to the product of the diagonal elements. |
| pivot | pivot | After elimination  $U$  The diagonal element of , whose product gives  $\det A$  size, symbols are extra |
| invertible | invertible | $\det A\ne0$, elimination elements can be gathered together  $n$  non-zero pivot |
| transpose | transpose | $A^{\mathsf T}$, with  $A$  have the same determinant |
| even permutation | even permutation | A permutation that can be implemented by an even number of row exchanges, the determinant of which is  $1$ |
| odd permutation | odd permutation | A permutation that can be implemented by an odd number of row exchanges, the determinant of which is  $-1$ |
| volume | Volume | Geometric analogy of determinant: each side of the box is enlarged twice, $n$  Dimensional volume multiplication  $2^n$ |

---

[← Lecture 17](/en/notes/mit-1806/lec17) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 19 →](/en/notes/mit-1806/lec19)
