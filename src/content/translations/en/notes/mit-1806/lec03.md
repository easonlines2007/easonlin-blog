---
kind: notes
source: mit-1806/lec03
title: Lecture 3 · Matrix multiplication and inverse matrix
description: Understand matrix multiplication from four perspectives, and master
  the existence conditions and methods of finding inverse matrices.
sourceHash: 901f48928bf72909575f3c75160cc630806fa59f4bff85e44a1de7ce2e87a028
publish: true
translationMethod: machine-assisted
---

> *Multiplication and inverse matrices* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 3 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p3 · Matrix multiplication and inverse matrix](https://www.bilibili.com/video/BV1ix411f7Yp?p=3)(46:49)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-3-multiplication-and-inverse-matrices/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=3&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lecture, each step of elimination was written as a matrix, and finally we got  $E_{32}E_{21}A=U$. Matrix multiplication has been used repeatedly there, but there is no explicit explanation of the rules. This lecture first makes up for this lesson: how to multiply two matrices. It is worth pondering that there are five different views of the same thing - counting by elements, counting by columns, counting by rows, counting by columns multiplied by rows, and counting by blocks. The five algorithms give the same matrix, but each illuminates one side of the result: looking column by column, the column of the product is  $A$  The combination of columns; looking row by row, the rows of products are  $B$  The combination of rows; looking at column multiplication rows, the product is split into a series of simplest matrix sums. Being able to calculate is just the starting point. Being able to read the same product from five directions is preparing for the subsequent column space, rank and matrix decomposition.

The second half of this lecture turns to inverse matrices. The definition is only one line  $A^{-1}A=I$, the real questions are two: What kind of square matrix has no inverse at all? How to calculate it when there is a reverse? The answer to the first question would translate "irreversible" into several equivalent terms - column vectors are linearly related (in  $2\times2$  appears as two collinear columns), there is a non-zero vector that is sent to zero, and (as you will see in Lecture 18) the determinant is zero. The second question is answered by Gauss-Jordan elimination: put  $A$  with  $I$  Connect them side by side to form a long matrix, and perform elimination on the left half until it becomes  $I$, the right half will automatically become  $A^{-1}$.

The two halves are not independent. The reason why Gauss-Jordan is established depends on block multiplication and associative law: each step of elimination is regarded as a left-multiplied elementary matrix, and the multiplication of all is written as  $E$, then  $E[A\ I]=[EA\ E]=[I\ A^{-1}]$. In other words, the inverse matrix is "the  $A$  disappear into  $I$  That whole set of row transformations".

![Official Handout Summary Page 1/3](</attachments/mit1806-f5e8c2f292eb69a045f6c35c.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 3 Summary, CC BY-NC-SA 4.0).*

## 1. The first view: multiply rows and columns to calculate each element

Set  $A$  is  $m\times n$  matrix, $B$  is  $n\times p$  Matrix, the product is written as  $C=AB$.$C$  of the  $i$  line of work  $j$  The elements of the column are denoted as  $c_{ij}$, the line number comes first and the column number comes last. This is a unified convention throughout the course. Its algorithm is a familiar saying: $A$  of the  $i$  line with  $B$  of the  $j$  Dot product of columns.

Take a specific location, such as  $c_{34}$. it comes from  $A$  The third line of and  $B$  the fourth column. The first term of the dot product is  $a_{31}b_{14}$: $a_{31}$  is the first number in the third row, $b_{14}$  is the top number in the fourth column. The second item is  $a_{32}b_{24}$, the third item is  $a_{33}b_{34}$, all the way to the end of the row and the bottom of the column. Written as a summation, it is



$$
c_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}.
$$



subscript  $k$  along  $A$  walk in rows, along  $B$  walking, both sides advance simultaneously, so the upper limit of the sum is  $n$.

This formula also stipulates the premise of multiplication. $A$  A row of  $n$  number, $B$  There is also a column of  $n$  Number, the dot product requires both sides to be the same length: $A$  The number of columns must equal  $B$  number of rows. After being satisfied, $A$  of  $m$  The rows determine how many rows the product has, $B$  of  $p$  The columns determine how many columns the product has, $C$  is  $m\times p$  of; each element is accumulated  $n$  term, the entire product has  $m\times p$  elements.

Element-wise calculation is a standard algorithm, and it is followed for both hand calculation and writing programs. But it focuses all its attention on the subscripts and cannot see the overall structure clearly. There is no room for choice in this definition: there is only one algorithm for matrix multiplication, and the following four views are just different readings of it; if any of the readings calculates different numbers, then it does not calculate the same number.  $AB$. The following four views no longer focus on a single position, but regard the entire row, column or block as the unit of operation. They must give the same answer as the element-wise algorithm, the difference is only in the grouping method.

![Video 00:04:41: Classroom blackboard writing](</attachments/mit1806-5cedf0ae38783d89dbac547e.jpg>)

*Video 00:04:41｜Approximately corresponding to section 1 "1. The first view: multiply rows and columns, calculate each element".*

## 2. The second and third views: multiplying by columns and multiplying by rows

Let’s talk about columns first. put  $B$  Cut into columns and record as  $[\boldsymbol{b}_1\ \boldsymbol{b}_2\ \cdots\ \boldsymbol{b}_p]$, then



$$
A[\boldsymbol{b}_1\ \cdots\ \boldsymbol{b}_p]=[A\boldsymbol{b}_1\ \cdots\ A\boldsymbol{b}_p].
$$



The reason is very straightforward: $B$  Which column of only participates in  $C$  In which column, other columns cannot enter. So count  $AB$  It does not need to be regarded as a new task, as long as you can calculate "matrix times a column vector", and then do the side-by-side  $p$  Just do each column once. Multiplying matrices by vectors is something we have long been familiar with: $A\boldsymbol{b}_j$  is  $A$  The linear combination of each column (linear combination), the coefficient is  $\boldsymbol{b}_j$  of each component. So we get the first conclusion of this lecture: **product  $C$  Each column of is  $A$  combination of columns**, the combination coefficient is written in  $B$  in the corresponding column. The shape also matches: $A$  The columns are  $m$  number, $C$  The columns also have  $m$  The number and length remain unchanged.

Say it again. put  $A$  cut in rows, $A$  of the  $i$  Multiply the entire row to the left  $B$, get  $C$  of the  $i$  OK. In the previous lecture, we have clarified the effect of left multiplication of a row vector: it  $B$  The rows are mixed by coefficient. So **product  $C$  Each line of is  $B$  combination of rows**, the coefficient is written in  $A$  in the corresponding row. $B$  rows have  $p$  number, $C$  There are also rows of  $p$  The number and length are also consistent.

The elimination matrix in the previous lecture relies on this rule: $E$  Each row of is a set of coefficients, left multiplied by  $A$  Just  $A$  The rows are reorganized according to this set of coefficients, so "the second row minus three times the first row" is written as a matrix. The row view makes this clear—elimination is never changing the numbers, but the way in which rows are combined.

The two views add up to a symmetrical statement: $C$  The columns are taken from  $A$  columns, $C$  The rows are taken from  $B$  OK. This is not a coincidence, but a division of labor in multiplication - the matrix on the left provides the recipe, and the matrix on the right provides the materials; whether the action is on columns or rows depends on which side you look at.

## 3. The fourth view: multiply the columns by rows, and use the outer product to spell out the product

In the first view, multiplying rows and columns results in a number. Now reverse the order: columns times rows. $A$  One of the columns is  $m\times 1$, $B$  The line is  $1\times p$, multiplied by the two to get a  $m\times p$  matrix, not a number. This difference in shape is worth pausing for a moment: the shapes of the two factors are reversed, and the result changes from a scalar to an entire matrix.

Use a short example to see the structure clearly. Get columns  $(2,3,4)$  ride  $(1,6)$, this kind of "one column times one row" multiplication is also called outer product:



$$
\begin{bmatrix}2\\3\\4\end{bmatrix}\begin{bmatrix}1&6\end{bmatrix}
=\begin{bmatrix}2&12\\3&18\\4&24\end{bmatrix}.
$$



Read line by line: The first line is  $2$  multiply  $(1,6)$  Got  $(2,12)$, the second line is  $3$  multiply  $(1,6)$  Got  $(3,18)$, the third line is  $4$  multiply  $(1,6)$  Got  $(4,24)$. Read column by column: The first column is  $1$  times  $(2,3,4)$, the second column is  $6$  times  $(2,3,4)$. So the three rows of this matrix all fall into  $(1,6)$  On the same straight line of , both columns fall through  $(2,3,4)$  on the same straight line. This is exactly consistent with the rule of Section 2: the column of the product is  $A$  A combination of columns, here  $A$  With only one column, the combinations degenerate into multiples; the rows of products are  $B$  The combination of rows also leaves only multiples.

put  $n$  Adding up these "column multiplication rows", we get the fourth algorithm:



$$
AB=\sum_{k=1}^{n}(\text{$A$ 的第 }k\text{ 列})(\text{$B$ 的第 }k\text{ 行}).
$$



Verify it. take



$$
A=\begin{bmatrix}2&7\\3&8\\4&9\end{bmatrix},
\qquad
B=\begin{bmatrix}1&6\\0&0\end{bmatrix}.
$$



The first item is calculated above  $(2,3,4)$  multiply  $(1,6)$;The second item is  $(7,8,9)$  multiply  $(0,0)$, due to  $(0,0)$  Each component of is zero, and this entry is a zero matrix. The addition of the two terms is still



$$
AB=\begin{bmatrix}2&12\\3&18\\4&24\end{bmatrix}.
$$



Check by element: $(1,1)$  location  $2\times1+7\times0=2$, $(1,2)$  location  $2\times6+7\times0=12$, $(2,1)$  location  $3\times1+8\times0=3$, all three elements match.

The fourth view splits the product into  $n$  The sum of the simplest things: each term is  $A$  a column with  $B$  A small matrix obtained by multiplying one row of , and each small matrix has only one straight line in its row space and column space. This matrix, obtained by multiplying one column by one row, has the least amount of information and will later be called a rank-one matrix. Think of it as building blocks and any product can be built.

![Video 00:13:41: Classroom blackboard writing](</attachments/mit1806-b3f7ab65ba300dd451f62f09.jpg>)

*Video 00:13:41｜Approximately corresponds to Section 3 "3. The fourth view: multiplying columns by rows, using outer products to spell out the product".*

![Video 00:14:03: Classroom blackboard writing](</attachments/mit1806-27e9a2546f9681bbb574176a.jpg>)

*Video 00:14:03｜Approximately corresponds to Section 3 "3. The fourth view: multiply columns by rows, use outer products to spell out the product".*

## 4. The fifth view: block multiplication

There is one algorithm left that cuts the matrix into chunks neither by individual elements nor by entire rows and columns. For simplicity, let  $A$, $B$  They are all square arrays and the same size, each cut into four pieces:



$$
A=\begin{bmatrix}A_1&A_2\\A_3&A_4\end{bmatrix},
\qquad
B=\begin{bmatrix}B_1&B_2\\B_3&B_4\end{bmatrix}.
$$



The rule is: Treat each block as a number, and multiply the rows and columns as usual. The upper left corner of the product is equal to



$$
A_1B_1+A_2B_3,
$$



because  $A$  The first block of rows is  $[A_1\ A_2]$, $B$  The first block of columns is  $\begin{bmatrix}B_1\\B_3\end{bmatrix}$, the paired sum is exactly these two items. The shape is also right: $A_1B_1$  with  $A_2B_3$  They are all block sizes and can be added directly.

The chunks don't have to be the same size, just "match": $A$  The width of each column must be equal to  $B$  The height of the corresponding block row, otherwise  $A_1B_1$  Such a product simply does not exist. The most common case is when all blocks are the same size, e.g.  $20\times20$  The matrix is cut into  $10\times10$  The four blocks of , at this time the product of each block is  $10\times10$, the rules are the neatest.

Block multiplication is not a new operation, it just regroups the same batch of multiplications and additions. Section 1’s summation keys  $k$  Accumulate item by item, multiply by blocks  $k$  Packing segment by segment, first calculating within blocks, then calculating between blocks, the result remains unchanged. Because of this, this rule is particularly useful in proofs: as long as the matrix is ​​regarded as a block matrix divided into two, the overall statement can often be reduced to the blocks.

The five views are unified at the level of segmentation. Cut the block to a single element, and the block multiplication is the element-wise algorithm of Section 1;  $A$  The blocks are taken into whole columns, $B$  The blocks of are taken into full rows, and the sum of the block products is the column-row formula of Section 3. The thickness of the blocks can be freely selected, which shows that the five views describe the same operation, but are grouped in different ways.

So far, five methods are available: by element, by column, by row, by column multiplied by row, and by block. Their calculation formulas are different and they do the same batch of multiplications and additions, so the answers must be the same.

![Official Handout Summary Page 2/3](</attachments/mit1806-51020ee27ce13974aa7b193b.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 3 Summary, CC BY-NC-SA 4.0).*

## 5. Inverse matrix: What kind of square matrix does not have an inverse?

Now let’s change the topic. Set  $A$  It's a square formation. If there is a matrix  $A^{-1}$  such that



$$
A^{-1}A=I,\qquad AA^{-1}=I,
$$



Just call it  $A$ **invertible**(invertible), $A^{-1}$  called  $A$  of **inverse matrix** (inverse matrix); an irreversible square matrix is called **singular matrix** (singular matrix), the reversible square matrix is also called non-singular (non-singular).

For an invertible square matrix, the left inverse and the right inverse are the same matrix: as long as you find a  $B$  such that  $BA=I$, it will automatically have  $AB=I$. This fact is not obvious and requires proof, but it does hold. It is not true for rectangular matrices - the shape of a rectangle simply does not allow both sides to be true at the same time, and there will be a situation where there is only the left inverse or only the right inverse. Only the phalanx is discussed here.

Whether or not there is an inverse is the most important property of the square matrix. There is no need to wait for the algorithm to judge it. Each of the several opinions can give a reason. take



$$
A=\begin{bmatrix}1&3\\2&6\end{bmatrix}.
$$



From a determinant perspective, $1\times6-3\times2=0$, a square matrix with zero determinant is irreversible; however, the determinant will not officially appear until later in the course, so note this signal first.

From a column perspective, the two columns are  $(1,2)$  with  $(3,6)$, while  $(3,6)=3(1,2)$, they fall on the same straight line passing through the origin. Section 2 said that the column of products is  $A$  The combination of columns, so no matter what matrix is multiplied on the right, each column of the result is still on this straight line. The first column of the identity matrix  $(1,0)$  is not on it, therefore  $AB=I$  Impossible. If the columns are all crowded together on a line, the matrix will lose the other direction in the plane, and it cannot be made up no matter how much you multiply it.

From the perspective of equations, this reason is the most powerful. $A$  put the non-zero vector  $\boldsymbol{x}=\begin{bmatrix}3\\-1\end{bmatrix}$  Send to zero:



$$
A\boldsymbol{x}=\begin{bmatrix}1&3\\2&6\end{bmatrix}\begin{bmatrix}3\\-1\end{bmatrix}
=\begin{bmatrix}3-3\\6-6\end{bmatrix}
=\begin{bmatrix}0\\0\end{bmatrix}.
$$



In the language of columns, this is "$3$  times the first column minus  $1$  times the second column is equal to the zero column". hypothesis  $A^{-1}$  exist, in  $A\boldsymbol{x}=\boldsymbol{0}$  Take left on both sides  $A^{-1}$, we get on the left  $\boldsymbol{x}$, we get on the right  $A^{-1}\boldsymbol{0}=\boldsymbol{0}$, so  $\boldsymbol{x}=\boldsymbol{0}$, with  $\boldsymbol{x}\neq\boldsymbol{0}$  contradictory, so  $A^{-1}$  It cannot exist.

This argument also explains why the inverse matrix cannot be saved: $A$  put  $\boldsymbol{x}$  Pressed to zero, and any matrix multiplied by zero will get zero, $A^{-1}$  There is no way of knowing which vector this zero comes from. So we get the most important criterion of this lecture: **The square matrix is irreversible, which is equivalent to the existence of non-zero vectors  $\boldsymbol{x}$  such that  $A\boldsymbol{x}=\boldsymbol{0}$; In column language, it is equivalent to the existence of a set of coefficients that are not all zero, so that  $A$  Each column of is combined into a zero column according to this set of coefficients, that is, each column is linearly dependent.**

![Video 00:30:26: Classroom blackboard writing](</attachments/mit1806-9eaeab2d9591764bf653b22d.jpg>)

*Video 00:30:26 \| Approximately corresponding to Section 5 "5. Inverse Matrix: What kind of square matrix does not have an inverse".*

## 6. Gauss-Jordan elimination: solve all right-hand ends at once

Let’s take an example with an inverse:



$$
A=\begin{bmatrix}1&3\\2&7\end{bmatrix}.
$$



two columns  $(1,2)$  with  $(3,7)$  The directions are different and no longer collinear. Their combination can cover the entire plane, so it should be reversible this time. The question is how to  $A^{-1}$  Figure it out.

By definition, $A^{-1}$  is an unknown  $2\times 2$  matrix. Four numbers are required, which can be found in columns. Set



$$
A^{-1}=\begin{bmatrix}a&c\\b&d\end{bmatrix},
$$



The first column is  $(a,b)$, the second column is  $(c,d)$. Using the column point of Section 2, $AA^{-1}=I$  Reading in columns is two equations:



$$
A\begin{bmatrix}a\\b\end{bmatrix}=\begin{bmatrix}1\\0\end{bmatrix},
\qquad
A\begin{bmatrix}c\\d\end{bmatrix}=\begin{bmatrix}0\\1\end{bmatrix}.
$$



Generally, $A$  multiply  $A^{-1}$  of the  $j$  column, equal to  $I$  of the  $j$  columns. Inverting a matrix is therefore equivalent to solving  $n$  systems of equations that share the same coefficient matrix  $A$, just replace the right-hand vector with the columns of the identity matrix. There are two points to remember here: the coefficient matrices are the same, so the elimination steps can be shared; on the right end there is  $n$  one, not one.

When Gauss solves a system of equations, the right end is used as an extra column after the coefficient matrix, and is modified along with the row transformation. This is the augmented matrix used in the previous lecture. Jordan's advice is to  $n$  Connect all the right ends and eliminate them all at once. So put  $A$  with  $I$  Writing growth matrices side by side



$$
\left[\begin{array}{cc|cc}
1&3&1&0\\
2&7&0&1
\end{array}\right],
$$



The left half is  $A$, the right half is  $I$. The goal is to turn the left half into  $I$, the right half will become  $A^{-1}$.

The first step is to eliminate elements, eliminate  $(2,1)$  locational  $2$: The second row subtracts  $2$  Double the first row and do the same subtraction on the right half simultaneously. The first line does not move; the second line  $(2,7\,|\,0,1)$  subtract  $2(1,3\,|\,1,0)=(2,6\,|\,2,0)$, get



$$
\left[\begin{array}{cc|cc}
1&3&1&0\\
0&1&-2&1
\end{array}\right].
$$



The left half is already an upper triangle. Gauss stops here and goes back to generation; Jordan's approach is to continue and eliminate from bottom to top. now to  $(1,2)$  locational  $3$  Eliminate: subtract the first row  $3$  Times the second row. The second line is  $(0,1\,|\,-2,1)$, $3$  Times  $(0,3\,|\,-6,3)$, subtracted to get



$$
\left[\begin{array}{cc|cc}
1&0&7&-3\\
0&1&-2&1
\end{array}\right].
$$



The left half is done  $I$, the right half is what you want:



$$
A^{-1}=\begin{bmatrix}7&-3\\-2&1\end{bmatrix}.
$$



Check multiplication and check the four items one by one:



$$
\begin{bmatrix}7&-3\\-2&1\end{bmatrix}
\begin{bmatrix}1&3\\2&7\end{bmatrix}
=\begin{bmatrix}7-6&21-21\\-2+2&-6+7\end{bmatrix}
=\begin{bmatrix}1&0\\0&1\end{bmatrix}.
$$



$(1,1)$  location  $7-6=1$, $(1,2)$  location  $21-21=0$, $(2,1)$  location  $-2+2=0$, $(2,2)$  location  $-6+7=1$, all established.

In this example, both pivots happen to be  $1$, so the step of "dividing the pivot row by the pivot" is omitted. The main element is not  $1$  When  $I$. On the other hand, if the elimination is stuck in the middle, the left half cannot be eliminated  $I$, then this  $n$  It is impossible for a system of equations to have solutions simultaneously. $A$  It is also irreversible - the criterion of Section 5 is repeated here by the algorithm itself.

![Video 00:37:14: Classroom blackboard writing](</attachments/mit1806-784ba307a161506895126dad.jpg>)

*Video 00:37:14 \| Approximately corresponding to Section 6 "6. Gauss-Jordan Elimination: Solving All Right Ends at One Time".*

![Video 00:37:27: Classroom blackboard writing](</attachments/mit1806-293a55f847f7deaeec784a6b.jpg>)

*Video 00:37:27 \| Approximately corresponding to Section 6 "6. Gauss-Jordan Elimination: Solving All Right Ends at One Time".*

## 7. Why can elimination  $A^{-1}$  squeeze out

The above set of operations looks like magic: the right half is originally just the identity matrix, but after a series of transformations, it becomes the inverse matrix. The reason can be explained clearly using the language used in the previous lecture.

Each elimination is a left multiplication of the elementary matrix. Step 1 "Subtract the second line  $2$  Times the first line "corresponds to



$$
E_1=\begin{bmatrix}1&0\\-2&1\end{bmatrix},
$$



Step 2 "Subtract the first row  $3$  Times the second line "corresponds to



$$
E_2=\begin{bmatrix}1&-3\\0&1\end{bmatrix}.
$$



Multiply the entire sequence of operations and note  $E=E_2E_1$, it completes all steps at once. Pay attention to the order: do it first  $E_1$, do later  $E_2$, the latest step is written on the far left.

Yes  $[A\ I]$  Complete elimination is equal to left multiplication  $E$. When elimination is complete, the left half of this long matrix is  $I$, the right half is some unknown matrix; block multiplication will figure out who the right half is. put  $[A\ I]$  Seen as a block matrix, the two blocks are  $A$  with  $I$, then



$$
E[A\ I]=[EA\ E].
$$



This step uses block multiplication, and the right block is  $E$  multiply  $I$, the result is still  $E$. When elimination is completed, the left half of this long matrix is  $I$, so  $EA=I$. According to the definition of inverse matrix, where and  $A$  Multiply to get  $I$  The matrix is  $A^{-1}$, so



$$
E=A^{-1}.
$$



The right half records exactly  $EI=E$, of course it is  $A^{-1}$. This is the principle of the Gauss-Jordan method: the right half does not become right by chance, what it records along the way is the product of the serial transformation  $E$, while  $E$  Be  $EA=I$  determined as  $A^{-1}$.

In this case, put two  $E$  Multiply it out and you can check this conclusion:



$$
E_2E_1=\begin{bmatrix}1&-3\\0&1\end{bmatrix}
\begin{bmatrix}1&0\\-2&1\end{bmatrix}
=\begin{bmatrix}1+6&-3\\-2&1\end{bmatrix}
=\begin{bmatrix}7&-3\\-2&1\end{bmatrix},
$$



It is exactly the same as the right half obtained by elimination.

This proof also explains why it is necessary to  $I$  pick up  $A$  to the right and do the same row transformation on both halves. If only  $A$  form  $I$  Without recording the transformation, it is equivalent to calculating  $E$  throw it away again; throw it away  $I$  Bring it with you, $E$  are completely preserved. In other words, Gauss-Jordan is solved in one elimination at the same time.  $n$  A system of equations sharing a common coefficient matrix, we get  $n$  The columns in order are  $A^{-1}$  of  $n$  columns.

![Video 00:42:08: Classroom blackboard writing](</attachments/mit1806-f989955b88cdb0d6885750a3.jpg>)

*Video 00:42:08｜Approximately corresponding to Section 7 "7. Why can elimination  $A^{-1}$ "Squeeze out" nearby.*

![Official Handout Summary Page 3/3](</attachments/mit1806-5315ca9492560f90ff86c312.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 3 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- Matrix multiplication  $C=AB$  request  $A$  The number of columns is equal to  $B$  Number of rows: $A$  for  $m\times n$, $B$  for  $n\times p$  time  $C$  for  $m\times p$, elements consisting of  $c_{ij}=\sum_{k=1}^{n}a_{ik}b_{kj}$  given, that is  $A$  of the  $i$  line with  $B$  of the  $j$  Dot product of columns.
- View by column, $A[\boldsymbol{b}_1\ \cdots\ \boldsymbol{b}_p]=[A\boldsymbol{b}_1\ \cdots\ A\boldsymbol{b}_p]$;Each column of the product is  $A$  The combination of columns, the coefficients come from  $B$  corresponding column.
- Looking row by row, each row of the product is  $B$  The combination of rows, the coefficients come from  $A$  corresponding row. The five views do the same batch of multiplication and addition, so the answers must be the same.
- Multiplying the columns by rows yields the complete matrix: $(2,3,4)$  multiply  $(1,6)$  given  $\begin{bmatrix}2&12\\3&18\\4&24\end{bmatrix}$, all three lines have passed  $(1,6)$  On the straight line, both columns pass  $(2,3,4)$ , which is a rank 1 matrix.
- $AB$  equal to  $A$  Each column of  $B$  The sum of the products of each corresponding row of . Block multiplication treats each block as a number, and the upper left block is  $A_1B_1+A_2B_3$;The block sizes only need to match, not necessarily be the same.
- square array  $A$  Reversible refers to existence  $A^{-1}$  such that  $A^{-1}A=AA^{-1}=I$; The left inverse is the right inverse of a reversible square matrix. A rectangular matrix does not have this symmetry.
- $\begin{bmatrix}1&3\\2&6\end{bmatrix}$  Irreversible: the two columns are collinear, the product column cannot escape from this straight line, and the columns of the identity matrix cannot be made up; the more essential reason is  $A(3,-1)^{\mathsf T}=\boldsymbol{0}$, if  $A^{-1}$  Existence brings out  $(3,-1)^{\mathsf T}=\boldsymbol{0}$, contradiction.
- Irreversible equivalence characterization: the existence of non-zero  $\boldsymbol{x}$  such that  $A\boldsymbol{x}=\boldsymbol{0}$, that is, the column vectors are linearly related; $2\times 2$  It also shows that the determinant is zero.
- Gauss-Jordan inversion: write side by side  $[A\ I]$, eliminate elements downward to create the upper triangle, and then upward to clear the above diagonal line to zero; the left half becomes  $I$  The right half of the time is  $A^{-1}$. Example  $A=\begin{bmatrix}1&3\\2&7\end{bmatrix}$  Got  $A^{-1}=\begin{bmatrix}7&-3\\-2&1\end{bmatrix}$.
- Principle: All elimination synthesis  $E$, by block multiplication  $E[A\ I]=[EA\ E]=[I\ E]$, the left half gives  $EA=I$, so  $E=A^{-1}$, right half  $EI=E$  Naturally it is the inverse matrix.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| matrix multiplication | Matrix multiplication | Do a dot product between rows and columns, requiring the number of columns of the left matrix to be equal to the number of rows of the right matrix |
| dot product | dot product | Multiply the corresponding components of two equal-length vectors and add them together to get a number. |
| inner dimension | inner dimension | $A$  The number of columns and  $B$  The number of rows of , the two must be equal to be multiplied |
| column view | column view | Reading multiplication column by column, the product of each column is  $A$  linear combination of columns |
| row view | row view | Reading multiplication row by row, the product of each row is  $B$  linear combination of rows |
| outer product | outer product | Multiply one column by one row to get a complete matrix instead of a number |
| rank-one matrix | rank 1 matrix | Obtained by multiplying one column by one row, both row space and column space degenerate into a straight matrix |
| block multiplication | Block multiplication | Cut the matrix into blocks and multiply the blocks as numbers according to the same rules. |
| invertible | invertible | Multiply the existing matrix with the original matrix to get the identity matrix |
| non-singular | Not strange | Another name for reversible square matrix |
| singular | Strange | Irreversible, there is a non-zero vector that is sent to zero |
| inverse matrix | inverse matrix | with  $A$  Multiply to get  $I$  matrix, denoted as  $A^{-1}$ |
| identity matrix | identity matrix | The diagonal element is  $1$, a matrix with the remaining zeros, equivalent to numbers in multiplication  $1$ |
| Gauss-Jordan elimination | Gauss-Jordan elimination | in  $[A\ I]$  Up elimination, convert the left half into  $I$, the right half is  $A^{-1}$ |
| augmented matrix | augmented matrix | The long matrix obtained by connecting the right end (can have multiple columns) to the right side of the coefficient matrix |
| elementary matrix | elementary matrix | The matrix corresponding to a single elimination, multiplying it by the left is equal to a row transformation |
| row space | row space | The set of all linear combinations of rows of a matrix |
| column space | column space | The set of all linear combinations of the columns of a matrix |
| linearly dependent | linearly dependent | There are coefficients that are not all zero so that the combination of vectors is zero |

---

[← Lecture 2](/en/notes/mit-1806/lec02) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 4 →](/en/notes/mit-1806/lec04)
