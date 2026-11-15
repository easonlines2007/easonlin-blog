---
kind: notes
source: mit-1806/lec20
title: Lecture 20 · Cramer’s rule, inverse matrix and volume
description: Unify Cramer's rule, inverse matrix formula, and volume using determinants.
sourceHash: b9a9130794b1b4762bc6060ea19dbb6f521cdd573688b60cd2a0eb56b0efd1b9
publish: true
translationMethod: machine-assisted
---

> *Cramer's rule, inverse matrix, and volume* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 20 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p20 · Cramer’s rule, inverse matrix and volume](https://www.bilibili.com/video/BV1ix411f7Yp?p=20)(51:01)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-20-cramers-rule-inverse-matrix-and-volume/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=20&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

**determinant** (determinant) only occupies three lectures in this course, and this lecture is the last one. In the first two lectures, three properties are used to define determinants, and then large formulas and algebraic cofactor expansions are derived from them. The tools have been built. This lecture will not introduce new properties, only use them. There are three uses, each more unexpected than the last: write it using the algebraic cofactor **inverse matrix** (inverse matrix) explicit formula; put  $A\boldsymbol{x}=\boldsymbol{b}$  Each component of is written as a fraction, that is **Cramer's Law** (Cramer's rule); prove that the absolute value of the determinant is equal to the span of the row vectors of the matrix **parallelepiped** (parallelepiped) volume.

All three apps share the same gesture. front **elimination** (elimination) and Gauss-Jordan are both algorithms: operate numbers step by step, and get an answer after calculation. However, how the answer depends on the input is concealed by the operation process. The function of the determinant is to compress the entire matrix into a number, which in turn exposes the combinatorial structure of the matrix elements. Formulas are often unsuitable for practical calculations—Cramer's Law is an expensive example of the opposite—but they allow one to do algebra with letters and see how the inverse and solution change as the elements of the matrix are changed.

The geometric conclusion connects the two worlds: an algebraic quantity defined purely by addition and multiplication is actually equal to a volume in space. The main thread of this lecture is: the determinant organizes the algebraic cofactors, serves as the denominator of the solution, and ultimately becomes the volume itself.

![Official Handout Summary Page 1/4](</attachments/mit1806-b8177ac3725ac3e8c298cc1c.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 20 Summary, CC BY-NC-SA 4.0).*

## 1. Explicit formula for inverse matrix

Let’s ask a specific question first: How is each element of the inverse matrix composed of the elements of the original matrix? $2\times2$  The answer everyone remembers:



$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}^{-1}
=\frac{1}{ad-bc}\begin{bmatrix}d&-b\\-c&a\end{bmatrix}.
$$



The denominator is  $\det A=ad-bc$. This arrangement speaks for itself: only  $\det A\neq0$  The formula only makes sense when  $A$  reversible conditions. The formula naturally ties reversibility to determinants.

Let’s look at the four numbers of the numerator. Delete the first  $i$  line and order  $j$  columns, one left  $(n-1)\times(n-1)$  A matrix whose determinant is called  $(i,j)$  locational **Yuzi style** (minor), recorded as  $M_{ij}$;Multiply by the sign  $(-1)^{i+j}$, get **algebraic cofactor**(cofactor)



$$
C_{ij}=(-1)^{i+j}M_{ij}.
$$



Compare item by item. $d$  is the determinant remaining after deleting the first row and first column, so  $C_{11}=d$.$-b$  is the determinant remaining after deleting the second row and first column (remaining  $b$), location  $(2,1)$  The symbol is  $(-1)^{3}=-1$, so  $C_{21}=-b$, it is  $c$  The algebraic cofactor of . Same reason  $C_{12}=-c$, $C_{22}=a$. Arrange these numbers into a matrix by position



$$
C=\begin{bmatrix}C_{11}&C_{12}\\C_{21}&C_{22}\end{bmatrix}
=\begin{bmatrix}d&-c\\-b&a\end{bmatrix},
$$



called  $A$  of **algebraic cofactor matrix** (cofactor matrix). And  $A^{-1}$  The molecule of is  $\begin{bmatrix}d&-b\\-c&a\end{bmatrix}$, exactly  $C$  of **transpose** (transpose). So I guessed the general formula:



$$
A^{-1}=\frac{1}{\det A}C^{\mathsf T}.
$$



It's worth pausing at this step of transposing. $A^{-1}$  of  $(1,2)$  The elements are  $-b$, it is not  $C_{12}=-c$, but  $C_{21}$; $(2,1)$  The elements are  $-c=C_{12}$. That is to say, the inverse matrix  $i$  line of work  $j$  In the position of the column, put "No.  $j$  line of work  $i$  The algebraic cofactor of "column". The transposition is not a clerical error, it is part of the formula. Written element by element it is: $A^{-1}$  of  $(i,j)$  elements equal to  $C_{ji}/\det A$.

It's also comparable in scale. $3\times3$  The determinant of a matrix is given by the large formula, which is the sum of six products of three terms, as  $aei$, $bfg$, $cdh$; And its algebraic cofactor is as follows:  $C_{11}=ei-fh$, yes  $n-1=2$  The product of elements. The numerator of the inverse matrix comes from  $n-1$  The denominator of the step formula is  $n$  Order determinant, the degree is exactly coordinated.

This formula contrasts with the Gauss-Jordan inversion. The latter put  $A$  with **identity matrix** (identity matrix) placed side by side, right  $A$  Eliminate until it becomes  $I$, then the right side is  $A^{-1}$. This is a good approach numerically, but it cannot be seen in the whole process.  $A^{-1}$  The elements of  $A$  Which elements are combined in what way. The formula makes this clear: the denominator is  $\det A$, the molecules are all algebraic cofactors, and they are all polynomials of matrix elements. This can also answer previously unanswerable questions:  $A$  If an element of is changed a little, how will the inverse matrix change? The determinant and each algebraic cofactor are changed accordingly, and the formula is clear at a glance.

![Video 00:05:06: Classroom blackboard writing](</attachments/mit1806-042be19d57fc8604782e2ee1.jpg>)

*Video 00:05:06｜Approximately corresponding to Section 1 "1. Explicit formula of inverse matrix".*

![Video 00:08:29: Classroom blackboard writing](</attachments/mit1806-2a5d464b0cc1561c189b4313.jpg>)

*Video 00:08:29 \| Approximately corresponding to Section 1 "1. Explicit formula of inverse matrix".*

## 2. Verification formula: $AC^{\mathsf T}=(\det A)I$

Verify only  $2\times2$  It is not enough to prove that the formula is universally valid. Want proof  $A^{-1}=C^{\mathsf T}/\det A$, which is equivalent to proving the identity



$$
AC^{\mathsf T}=(\det A)I,
$$



Because as long as it is established, when  $\det A\neq0$  when dividing both sides by  $\det A$, you get  $A\bigl(C^{\mathsf T}/\det A\bigr)=I$, the inverse matrix is exactly in the brackets.

Look at the product  $(i,k)$  element. $A$  of the  $i$  OK  $a_{i1},\dots,a_{in}$, $C^{\mathsf T}$  of the  $k$  Column is  $C$  of the  $k$  OK, that is  $C_{k1},\dots,C_{kn}$, so



$$
(AC^{\mathsf T})_{ik}=\sum_{j=1}^{n}a_{ij}C_{kj}.
$$



when  $k=i$  when , this sum is along  $A$  of the  $i$  Expand the algebraic cofactor, so it is equal to  $\det A$. The main diagonal of the product is all  $\det A$.

when  $k\neq i$  When , what is this sum? put  $A$  of the  $k$  Replace the entire line with the first  $i$  Row, get a new matrix  $\tilde A$.$\tilde A$  of the  $i$  line and order  $k$  The rows are identical, so they are singular and the determinant is zero. On the other hand, along  $\tilde A$  of the  $k$  Row expansion: the elements of this row are exactly  $a_{i1},\dots,a_{in}$; and  $(k,j)$  The algebraic cofactor of the position should delete the first  $k$  line and order  $j$  Column, No.  $k$  The entire row is deleted, and the replaced elements do not participate in the calculation at all, so this algebraic cofactor is the same as in the original  $A$  The result obtained by deleting the same position is exactly the same, still  $C_{kj}$. So



$$
\det\tilde A=\sum_{j=1}^{n}a_{ij}C_{kj}=0.
$$



That is, all off-diagonal elements in the product are zero.

$2\times2$  situation can be directly verified. The algebraic cofactor of the second line is  $C_{21}=-b$  with  $C_{22}=a$, use the first line  $(a,b)$  To multiply them:



$$
a(-b)+b\,a=0.
$$



Translate this into determinants: matrices  $\begin{bmatrix}a&b\\a&b\end{bmatrix}$  The two rows are the same, and the determinant is zero; expand along the first row, $a$  The algebraic cofactor of is  $b$, $b$  The algebraic cofactor of is  $-a$, so the value is  $ab-ba=0$. "Multiplying the elements of one row by the algebraic cofactor of another row" is essentially calculating the determinant of a matrix with two identical rows.

The two situations combined: $(AC^{\mathsf T})_{ik}$  When  $k=i$  time is equal to  $\det A$, otherwise equal to  $0$, which is exactly  $AC^{\mathsf T}=(\det A)I$. The proof only uses the algebraic cofactor expansion from the previous lecture and does not introduce any new tools.

## 3. Cramer’s Law

Substitute the inverse matrix formula into the solution, $A\boldsymbol{x}=\boldsymbol{b}$  The solution of immediately has a fractional form:



$$
\boldsymbol{x}=A^{-1}\boldsymbol{b}
=\frac{1}{\det A}C^{\mathsf T}\boldsymbol{b}.
$$



Only one step away from the answer: put  $C^{\mathsf T}\boldsymbol{b}$  Recognize the various components. No.  $j$  The components are



$$
x_j=\frac{1}{\det A}\sum_{i=1}^{n}C_{ij}b_i .
$$



Let’s look at another matrix  $B_j$: put  $A$  of the  $j$  Replace column with right end vector  $\boldsymbol{b}$, the remaining columns are left intact. along  $B_j$  of the  $j$  Column expansion: the elements of this column are  $b_1,\dots,b_n$, while  $(i,j)$  The algebraic cofactor of the position should delete the first  $i$  line and order  $j$  Column; No.  $j$  The entire column was deleted, so it was replaced  $\boldsymbol{b}$  does not affect the remaining submatrices, the algebraic cofactor is still  $C_{ij}$. So



$$
\det B_j=\sum_{i=1}^{n}b_iC_{ij}.
$$



with  $x_j$  Compare the expressions and get immediately



$$
x_j=\frac{\det B_j}{\det A},\qquad j=1,2,\dots,n .
$$



This is Kramer's rule: the solution  $j$  weight, equal to "a handful  $A$  of the  $j$  Replace the column with  $\boldsymbol{b}$  The determinant of the resulting matrix is then divided by  $A$  determinant of . Written component by component it is



$$
x_1=\frac{\det B_1}{\det A},\quad
x_2=\frac{\det B_2}{\det A},\quad\dots,\quad
x_n=\frac{\det B_n}{\det A}.
$$



This is the only expression of the solution, which is exactly the same as the answer obtained by elimination, except that it is replaced by a formula. It can also be directly seen from the form: as long as  $A$  reversible, the solution exists and is unique, and each component is  $\det A$  as the denominator.

Next one must evaluate its cost. To find a solution once, you need to calculate  $n+1$  determinant: $n$  a  $B_j$  Yes, add more  $A$  of. According to the big formula in the previous lecture, each determinant is  $n!$  The sum of the terms, and  $n!$  It grows faster than any polynomial; elimination only uses polynomial magnitude operations and gives the answer almost immediately. There is a huge gap between the two, so any actual software will not use Cramer's rule, and MATLAB and the like will always use elimination. Some popular science books once described Cramer's rule as a shortcut for solving equations, but that statement is not true.

The value of the formula is not that it can be calculated quickly, but that it writes the solution into an explicit expression containing letters, allowing algebraic derivation and analysis of the dependence of the solution on data. Reading it as a calculation method is disastrous; reading it as an identity, it is one of the most useful results of this lecture. The textbook also gives another ingenious proof that does not rely on algebraic cofactors.

![Official Handout Summary Page 2/4](</attachments/mit1806-5019e2a9cd368970e8d8e459.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 20 Summary, CC BY-NC-SA 4.0).*

![Video 00:19:23: Classroom blackboard writing](</attachments/mit1806-9819133f2e13df4ea2151226.jpg>)

*Video 00:19:23｜Approximately corresponding to Section 3 "3. Cramer's Law".*

## 4. The determinant is the volume of the box

The third application turns to geometry. take one  $3\times3$  matrix



$$
A=\begin{bmatrix}
a_{11}&a_{12}&a_{13}\\
a_{21}&a_{22}&a_{23}\\
a_{31}&a_{32}&a_{33}
\end{bmatrix},
$$



Treat each row as a vector  $\boldsymbol r_1,\boldsymbol r_2,\boldsymbol r_3$, they respectively point from the origin to  $(a_{11},a_{12},a_{13})$, $(a_{21},a_{22},a_{23})$, $(a_{31},a_{32},a_{33})$  of three edges. Using these three edges as side complements, a parallelepiped is obtained: the three edges start from the origin, the base is a parallelogram, and the top surface is obtained by translating the base along one edge. The six faces are parallelograms, and the origin is among the eight vertices. Strictly speaking, the points of the box are all combinations of the three edges  $c_1\boldsymbol r_1+c_2\boldsymbol r_2+c_3\boldsymbol r_3$, among which  $0\le c_1,c_2,c_3\le 1$. The nine elements of the matrix are the coordinates of these three edges, and the box is therefore uniquely determined by the matrix. The conclusion is



$$
\text{盒子的体积}=|\det A| .
$$



The absolute value is taken because the volume is non-negative and the determinant can be positive or negative. The symbol also has meaning: it records whether the three edges form a right-handed or left-handed system. Swapping the order of the two edges, the box itself does not change, the volume does not change, but the determinant changes sign - what changes is **Orientation**(orientation).

Why rows instead of columns? because  $\det A=\det A^{\mathsf T}$, the boxes given by rows and columns are transposes of each other, and the determinants are the same, whichever is discussed is the same.

## 5. Use the properties of determinants to prove the volume formula

The idea of proof is "uniquely determined by properties". Determinants are characterized by three properties: $\det I=1$;Swap the signs of the determinants of two rows; the determinant is linear for each row separately (one row is multiplied by  $t$, the determinant is multiplied by  $t$;A row is split into the sum of two vectors, and the determinant is split into the sum of two determinants). If instead you use **directed volume** (oriented volume) - the sign changes when two edges are exchanged, and each edge is measured by its oriented length - then it satisfies these three properties; and there is only one function that satisfies these three properties, so the oriented volume is equal to  $\det A$. Ordinary volume and then take the absolute value, that is  $|\det A|$.

Article 1, $\det I=1$. The three rows of the identity matrix are the unit vectors on the three coordinate axes, the box is the unit cube, and the volume is  $1$. consistent.

Before the general case, let's look at a nice intermediate case: **orthogonal matrix**(orthogonal matrix)$Q$. Its columns are **orthogonal** (orthonormal) vector, so a box made of columns (or rows) is still a cube, but it has been rotated or reflected, and the volume is still  $1$. In other words, $Q$  The entire unit cube in the direction of the coordinate axis is moved to another position in space, and the edge lengths and included angles remain unchanged. And  $\det Q$  can only be taken  $\pm1$: by  $Q^{\mathsf T}Q=I$  Take the determinants on both sides, use the determinant of the product to be equal to the product of the determinants, and note that the determinant does not change under transposition, we get



$$
(\det Q^{\mathsf T})(\det Q)=(\det Q)^2=\det I=1,
$$



So  $\det Q=\pm1$. In this cube case, the absolute value of the determinant remains consistent with the volume.

In the second line, swap two lines. The determinant changes sign; the directed volume changes sign as well, because the orientation of the box is reversed. The ordinary volume remains unchanged and remains consistent after taking the absolute value.

So far, all the tests have been cubes, and the boxes can only be placed upright. The following two steps allow it to be stretched and tilted: first elongate the edges to obtain a cuboid, and then allow the edges to be non-right angles.

Half of the third bar, multiply a certain line by  $t$. This is equivalent to stretching an edge according to its directed length.  $t$  times: the directed volume becomes  $t$  times; if  $t<0$, the orientation is reversed, and the ordinary volume becomes  $|t|$  times. The determinant is linear for a single row and also becomes  $t$  times, it is consistent after taking the absolute value. For example, if the first edge of the unit cube is stretched twice as long, the height will be  $2$  box with a volume of  $2$, the determinant is also  $2$.

The other half of Article 3, additivity to single lines. In two dimensions it is written as



$$
\det\begin{bmatrix}a+a'&b+b'\\c&d\end{bmatrix}
=\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
+\det\begin{bmatrix}a'&b'\\c&d\end{bmatrix}.
$$



Geometrically this is the additivity of area. Two parallelograms share the same side  $(c,d)$  As the bottom, their heights are respectively  $(a,b)$  with  $(a',b')$  component in the direction perpendicular to the base; the sum of these two components is exactly  $(a+a',b+b')$  The corresponding components of , and the base has not changed, so the areas add up. Three dimensions and higher dimensions are the same thing. The strict graphical demonstration of this step requires a careful diagram, but once it is accepted, the directed volume and the determinant satisfy the same set of characterization properties, and there is only one function that satisfies this set of properties, so the directed volume is equal to  $\det A$, the ordinary volume is equal to  $|\det A|$.

Incidentally, you get an excellent by-product: $2\times2$  When the box is a parallelogram, so by  $(a,b)$  with  $(c,d)$  The area of the stretched parallelogram is



$$
\text{面积}=|ad-bc| .
$$



To find the area using elementary geometry, you must first calculate the length of the base  $\sqrt{a^2+b^2}$, then count the height, and the height contains a bunch of combinations of radicals and differences, which is very ugly. The determinant formula only uses the product of coordinates, is clean, easy to remember, and does not require knowing any lengths or angles at all.

![Video 00:33:10: Classroom blackboard writing](</attachments/mit1806-8541e1197c83f18afc061ba4.jpg>)

*Video 00:33:10 \| Approximately corresponding to Section 5 "5. Use the properties of determinants to prove the volume formula".*

![Official Handout Summary Page 3/4](</attachments/mit1806-4b1adc05f7331cceea4e1258.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 20 Summary, CC BY-NC-SA 4.0).*

![Video 00:39:51: Classroom blackboard writing](</attachments/mit1806-d55600d57cb4119b345c501e.jpg>)

*Video 00:39:51 \| Approximately corresponding to Section 5 "5. Use the properties of determinants to prove the volume formula".*

## 6. Area of triangle and any vertex

A triangle is half of a parallelogram. The vertex is the origin, $(a,b)$, $(c,d)$  The area of a triangle is



$$
\text{面积}=\frac12|ad-bc| .
$$



This is just division by two, but it's more common than the parallelogram and worth remembering on its own.

If the triangle is not at the origin, the three vertices are  $(x_1,y_1)$, $(x_2,y_2)$, $(x_3,y_3)$, the six coordinates should uniquely determine the area. The formula is



$$
\text{面积}=\frac12\left|\det
\begin{bmatrix}
x_1&y_1&1\\
x_2&y_2&1\\
x_3&y_3&1
\end{bmatrix}\right| .
$$



Why? Here are three  $1$  Not a decoration: they enable translation into the determinant. Use row transformation to convert the two values ​​in the last column  $1$  Eliminate: the first row minus the third row, the second row minus the third row, the determinant remains unchanged:



$$
\det\begin{bmatrix}
x_1&y_1&1\\
x_2&y_2&1\\
x_3&y_3&1
\end{bmatrix}
=\det\begin{bmatrix}
x_1-x_3&y_1-y_3&0\\
x_2-x_3&y_2-y_3&0\\
x_3&y_3&1
\end{bmatrix}
=\det\begin{bmatrix}
x_1-x_3&y_1-y_3\\
x_2-x_3&y_2-y_3
\end{bmatrix}.
$$



The last determinant is exactly with the origin as the vertex and the two sides as  $(x_1-x_3,y_1-y_3)$  with  $(x_2-x_3,y_2-y_3)$  twice the area of the triangle. Geometrically, two row subtractions translate the third vertex to the origin: the row transformation in the determinant exactly completes this translation, so the new coordinates replace the original coordinates.

This concludes the third lecture on determinants. Looking back, this lecture only did one thing: put the same number in three different positions-the denominator of the inverse matrix formula, the components of the solution in Kramer's rule, and the volume of the parallelepiped. The next lecture begins with eigenvalues, where you will see another idea of ​​"pressing a matrix into a number".

![Video 00:45:55: Classroom blackboard writing](</attachments/mit1806-2985df789537747d9fbf65ba.jpg>)

*Video 00:45:55｜Approximately corresponding to Section 6 "6. Area of Triangle and Any Vertex".*

![Official Handout Summary Page 4/4](</attachments/mit1806-d81d32bdf23d7a08b0af5c35.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 20 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The formula for the inverse matrix is  $A^{-1}=\dfrac{1}{\det A}C^{\mathsf T}$, among which  $C$  is the algebraic cofactor  $C_{ij}=(-1)^{i+j}M_{ij}$  lined up **algebraic cofactor matrix**; $2\times2$  time  $C=\begin{bmatrix}d&-c\\-b&a\end{bmatrix}$, which when transposed gives the familiar molecule.
- The proof of the formula boils down to the identity  $AC^{\mathsf T}=(\det A)I$: The diagonal element is the algebraic cofactor expansion along the corresponding row, and the off-diagonal element is the determinant of the matrix obtained by replacing one row with another. The matrix has two identical rows and the determinant is zero.
- $2\times2$  Check: $a(-b)+ba=0$, the corresponding matrix  $\begin{bmatrix}a&b\\a&b\end{bmatrix}$  The expansion value of  $ab-ba=0$.
- **Cramer's Law**: $x_j=\det B_j/\det A$, among which  $B_j$  Yes  $A$  of the  $j$  Replace the column with  $\boldsymbol b$  The resulting matrix; the proof relies on “deleting the  $j$  The remainder of the formula remains unchanged in subsequent generations."
- Cramer's rule counts  $n+1$  determinants, each according to the general formula is  $n!$  terms are not available in actual calculations; elimination is the method used by numerical software, and the value of the formula lies in the algebraic derivation.
- $|\det A|$  equal to  $A$  The row vector of is the volume of the parallelepiped of the edges; the symbol records the orientation, and exchanging two edges only changes the symbol but not the volume.
- Proof of the volume formula: The volume satisfies the descriptive properties of the determinant - the volume of the unit cube is  $1$;The orthogonal matrix gives the rotated unit cube, and is given by  $Q^{\mathsf T}Q=I$  Got  $(\det Q)^2=1$;Newline does not change the box;Single line multiplication  $t$  multiply the volume  $t$;Single row additivity corresponds to "high addition of parallelograms with the same base".
- $2\times2$  area of parallelogram  $=|ad-bc|$, the area of the triangle is half of it; this formula only uses coordinates and does not require length, angle and height.
- The area of a triangle with any three vertices  $=\frac12\left|\det\begin{bmatrix}x_1&y_1&1\\x_2&y_2&1\\x_3&y_3&1\end{bmatrix}\right|$, row subtraction is equivalent to translating the third vertex to the origin and then applying  $2\times2$  formula.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| determinant | determinant | put  $n\times n$  A function that compresses a matrix into a number. In this lecture, it serves as the denominator of the inverse matrix formula and the volume of the box. |
| minor | Yuzi style | Determinant of the remaining submatrix after deleting a certain row or column  $M_{ij}$ |
| cofactor | algebraic cofactor | Yuzi style with chessboard symbols  $(-1)^{i+j}$, that is  $C_{ij}$ |
| cofactor matrix | algebraic cofactor matrix | A matrix of all algebraic cofactors arranged by position  $C$ |
| inverse matrix | inverse matrix | satisfy  $AA^{-1}=I$  matrix, the formula is  $C^{\mathsf T}/\det A$ |
| Cramer's rule | Cramer's Law | $x_j=\det B_j/\det A$, $B_j$  for the first  $j$  Replace the column with  $\boldsymbol b$  matrix |
| parallelepiped | parallelepiped | A three-dimensional box made of three edges and each face is a parallelogram. |
| volume | Volume | The size of the space occupied by the box is equal to  $\lvert\det A\rvert$ |
| orientation | Orientation | The left- and right-handed information recorded by the symbols of the determinant |
| orthogonal matrix | orthogonal matrix | satisfy  $Q^{\mathsf T}Q=I$  is a matrix whose determinant is  $\pm1$ |
| parallelogram | parallelogram | A box formed by two sides in two dimensions has an area equal to  $\lvert ad-bc\rvert$ |

---

[← Lecture 19](/en/notes/mit-1806/lec19) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 21 →](/en/notes/mit-1806/lec21)
