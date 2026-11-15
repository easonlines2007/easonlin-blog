---
kind: notes
source: mit-1806/lec19
title: Lecture 19 · Determinant formula and algebraic cofactor
description: Master the large formulas of determinants and algebraic cofactor expansions.
sourceHash: d500b80142fc5996f0e82680518a66a6ec6be103433688c575818c75e48edd8f
publish: true
translationMethod: machine-assisted
---

> *Determinant formulas and cofactors* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 19 / Total 35 Lectures** ｜Part 2 · Orthogonality and Determinant

**Video of this lecture**: [Bilibili p19 · Determinant formula and algebraic cofactor](https://www.bilibili.com/video/BV1ix411f7Yp?p=19)(53:17)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-19-determinant-formulas-and-cofactors/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=19&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

What was given in the previous lecture is **determinant** (determinant) three defining properties: the determinant of the identity matrix is  $1$; Swapping two rows, the determinant changes sign; when the remaining rows are fixed, the determinant is linear for a certain row. Ten properties can be derived from these three, including the most unexpected  $\det(AB)=\det A\det B$  with  $\det A^{\mathsf T}=\det A$. But those ten properties never answered the most basic question: given a  $n\times n$  The number table, how to calculate this number? This lecture makes up for this formula - it doesn't look good when written out, so it is not laid out at the beginning of the course. Determinant is just a small topic in the entire course, and the course arranges three lectures for it: the previous lecture establishes rules (three properties), this lecture teaches algorithms (two sets of formulas), and the next lecture uses this set of formulas. What this lecture aims to accomplish is to turn the determinant from "a set of abstract properties" into "a number that can really be calculated".

This lecture presents two sets of interrelated algorithms. **big formula** (big formula) write the determinant as  $n!$  Sum of terms: Each term is multiplied by one element from each row and column, and then assigned a positive or negative sign according to whether the permutation corresponding to the term is an even permutation or an odd permutation. **algebraic cofactor** (cofactor) Change the formula in another direction: expand along any line, and  $n\times n$  The determinant of  $n$  a  $(n-1)\times(n-1)$  The combination of determinants can be reduced level by level until  $1\times 1$. These two sets of formulas are deduced from the three properties in the previous lecture and are not new assumptions.

Used at the end of this lecture **tridiagonal matrix** (tridiagonal matrix) Using two sets of formulas at the same time, the results obtained are unexpected: $n$  Order tridiagonal complete  $1$  The determinants of the matrix are in turn  $1,0,-1,-1,0,1$, and then use  $6$  Repeat for the cycle. So far in this lecture, there are three ways to calculate the determinant: multiply the pivot components after elimination, expand the large formula, and use algebraic cofactor recursion.

![Official Handout Summary Page 1/3](</attachments/mit1806-a9f044205064493b4499e69d.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 19 Summary, CC BY-NC-SA 4.0).*

## 1. Deduced from the three properties  $2\times 2$  formula

$2\times 2$  determinant of  $ad-bc$  Everyone remembers it, but the process of deriving it step by step from the three properties is the method that can be extended to any order.

First write down the three properties clearly. First, $\det I=1$. Second, swap the two rows and only change the sign of the determinant. Third, fix the remaining rows, and the determinant is linear for a certain row: if the row is written as the sum of two vectors, the determinant is equal to the sum of the two determinants; if the whole row is multiplied by  $t$, the determinant is also multiplied by  $t$. This property can be broken down into two independent things - "split a row in half and then sum it" and "put the common factor of a row outside the determinant", both of which will be used in the derivation.

It should also be emphasized that linearity refers to a single row, and the entire matrix cannot be disassembled by rows and columns at the same time. Precisely because you can process one line at a time, you can  $n\times n$  The determinant of is transformed into the sum of many simple terms layer by layer.

Ask now



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}.
$$



Fixed second row  $(c,d)$, split the first line into  $(a,0)+(0,b)$, the sum of two determinants can be obtained from property three:



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}
=\det\begin{bmatrix}a&0\\c&d\end{bmatrix}
+\det\begin{bmatrix}0&b\\c&d\end{bmatrix}.
$$



Then use property three once for each of these two items, this time fixing the first line and splitting the second line:



$$
\det\begin{bmatrix}a&0\\c&d\end{bmatrix}
=\det\begin{bmatrix}a&0\\c&0\end{bmatrix}
+\det\begin{bmatrix}a&0\\0&d\end{bmatrix},
$$





$$
\det\begin{bmatrix}0&b\\c&d\end{bmatrix}
=\det\begin{bmatrix}0&b\\c&0\end{bmatrix}
+\det\begin{bmatrix}0&b\\0&d\end{bmatrix}.
$$



There are two columns with zeros in the four small blocks, and the determinant is zero - one column is all zeros, indicating that the columns are linearly related and the matrix is singular. Of the remaining two items, $\begin{bmatrix}a&0\\0&d\end{bmatrix}$  is a diagonal matrix, consisting of three properties  $a$, $d$  Take them out from the two rows respectively, leaving the identity matrix, so its determinant is  $ad$. For another item, use property 2 and swap the two lines:



$$
\det\begin{bmatrix}0&b\\c&0\end{bmatrix}
=-\det\begin{bmatrix}c&0\\0&b\end{bmatrix}
=-cb=-bc.
$$



Together it is



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc.
$$



The key to the method is to split each row into the sum of vectors that "leave only one position". $2\times 2$  When each row is divided into two pieces, a total of  $2^2=4$  item; $n\times n$  When each line is split into  $n$  films, total  $n^n$  item. The number of items has grown extremely horribly, but most items are directly invalidated because they have zero columns, and there are very few real survivors.

![Video 00:05:20: Classroom blackboard writing](</attachments/mit1806-fb46bdfc68fb156e8ba0a012.jpg>)

*Video 00:05:20｜Approximately corresponding to Section 1 "1. Deduced from the three properties  $2\times 2$  formula" near.*

## 2. Survivors: one from each row and column

Use the method  $3\times 3$: Each row is divided into three pieces, a total of  $3^3=27$  item. Specifically, this  $27$  The item is  $27$  The determinant of a matrix, each matrix only retains a number in one position in each row, and the remaining positions are all zeros; $27$  From "Each row has three positions to choose from".

Which terms are not zero? As long as a certain column is not fetched from the beginning to the end, this item has a whole column of zeros and the determinant is zero. Therefore, the non-zero entries must be satisfied - one element is taken from each row and each column is taken exactly once. For example, diagonal terms  $a_{11}a_{22}a_{33}$  is the survivor item; and "the first line takes  $(1,1)$, also take the second line  $(2,1)$"In that item, there must be a column that has never been retrieved and is set to zero, which is directly invalidated.

Just write it with double subscripts to make it clear. $3\times 3$  Each surviving item of is of the form



$$
a_{1\alpha}\,a_{2\beta}\,a_{3\gamma},
$$



Among them  $(\alpha,\beta,\gamma)$  is  $(1,2,3)$  A certain arrangement of: the three column numbers are different from each other, and each is used once. This arrangement has  $3!=6$ , so there are exactly six surviving items. For example, identity arrangement  $(1,2,3)$  gives the diagonal term  $a_{11}a_{22}a_{33}$, arrange  $(2,3,1)$  given  $a_{12}a_{23}a_{31}$.

The symbol for each term comes from "the matrix that's left after pulling the numbers out of the rows." to arrange  $(1,3,2)$  For example, take away  $a_{11}$, $a_{23}$, $a_{32}$  Then there is exactly one left in each row and each column  $1$  of **permutation matrix**(permutation matrix):



$$
\begin{bmatrix}a_{11}&0&0\\0&0&a_{23}\\0&a_{32}&0\end{bmatrix}
\;\longrightarrow\;
\begin{bmatrix}1&0&0\\0&0&1\\0&1&0\end{bmatrix},
$$



Its determinant is  $-1$, because by exchanging two rows, the identity matrix is obtained, and the sign is changed once. Number all six arrangements according to "how many exchanges are needed to restore the natural order", and you will get the complete  $3\times 3$  Formula:



$$
\begin{aligned}
\det A={}&+a_{11}a_{22}a_{33}-a_{11}a_{23}a_{32}-a_{12}a_{21}a_{33}\\
&+a_{12}a_{23}a_{31}+a_{13}a_{21}a_{32}-a_{13}a_{22}a_{31}.
\end{aligned}
$$



Check symbols item by item: $(1,3,2)$  After the exchange, the two characters return at once.  $(1,2,3)$, take the negative; $(2,1,3)$  Swap the first two digits once and take the negative; $(2,3,1)$  Swap it twice (first swap the first and last digits, then swap the last two digits) and get the positive value; $(3,1,2)$  Swap twice and get the positive result; $(3,2,1)$  Just swap the head and tail once and take the negative. Three positive terms and three negative terms, each accounts for exactly half.

Here is a widely circulated graphics mantra: $3\times 3$  The determinant of is equal to the sum of the products of the three "downslope" directions minus the sum of the products of the three "upslope" directions. This formula can only be used for  $3\times 3$. Arrived  $4\times 4$, the terms in the subdiagonal direction do not all have negative signs: if a  $4\times 4$  The subdiagonals of the matrix are all  $1$, the rest of the positions are all  $0$, its determinant is  $+1$, because by exchanging the first row and the fourth row, and then exchanging the second row and the third row (a total of two exchanges), the identity matrix is obtained, and the two sign changes cancel each other out. The symbol must be determined by the odd or even number of exchanges, and cannot be recorded by the direction of the slash.

![Video 00:12:38: Classroom blackboard writing](</attachments/mit1806-df487c6a0494c3244a949d30.jpg>)

*Video 00:12:38 \| Approximately corresponding to section 2 "2. Survivor items: take one from each row and each column".*

## 3. Big formula

put  $2\times2$, $3\times3$  The model is extended to  $n\times n$, we get the main result of this lecture:



$$
\det A=\sum_{\sigma}(-1)^{e(\sigma)}\,
a_{1\sigma(1)}a_{2\sigma(2)}\cdots a_{n\sigma(n)} .
$$



here  $\sigma$  Take all over  $(1,2,\dots,n)$  of all  $n!$  an arrangement, $e(\sigma)$  Express  $(\sigma(1),\dots,\sigma(n))$  Restore to  $(1,2,\dots,n)$  the required number of row swaps, $(-1)^{e(\sigma)}$  This is the symbol for this item.

Let’s write it down: $n=2$  When the big formula is only  $2!=2$  items,



$$
\det\begin{bmatrix}a_{11}&a_{12}\\a_{21}&a_{22}\end{bmatrix}
=+a_{11}a_{22}-a_{12}a_{21},
$$



The positive-signed term comes from the identity permutation, and the negative-signed term comes from the permutation that has been exchanged once.  $1$  The derivation of the knot is completely consistent.

Why is the number of terms  $n!$? Because the elements of the first row can be obtained from  $n$  Select any column. Once selected, this column will be used; the second row can only be selected from the remaining  $n-1$  Column selected; third row remaining  $n-2$  A selection method; if this continues, the elements in the last row have no choice but to fall into the only remaining column. Just multiply it  $n(n-1)\cdots 2\cdot 1=n!$. This also happens to be the number of arrangements for "take one from each row and column". $2\times2$  Yes  $2$  items, $3\times3$  Yes  $6$  items, $4\times4$  Yes  $24$  items, $5\times5$  Yes  $120$  items, $6\times6$  That’s it  $720$  item.

Positive terms and negative terms each account for half ($n\ge 2$  time), because by swapping two positions in any arrangement, another arrangement with opposite parity will be obtained, and the two will be paired one by one.

Check the identity matrix with the big formula: $I$  Most of the elements in are zero. Except for the identity arrangement, every item disappears because it contains zero factors; the only one that survives is  $a_{11}a_{22}\cdots a_{nn}=1$, while the identity permutation requires zero exchanges and has a positive sign. So  $\det I=1$, consistent with the first of the three properties. In the same way, the other two properties can also be deduced from the big formula; even  $\det(AB)=\det A\det B$  In principle, it can also be proved by it, but we just need to  $AB$  Unfolding all the elements would be a huge workload, and the course will not take this path. The fact that the determinant is invariant to the transposition is easy to see from the big formula, because the transposition just changes the reading of "take one from each row and each column".

The actual value of the big formula depends on how many zeros are in the matrix. watch one  $4\times 4$  Example:



$$
B=\begin{bmatrix}
0&0&1&1\\
0&1&1&0\\
1&1&0&0\\
1&0&0&1
\end{bmatrix}.
$$



$B$  is  $4\times 4$, a total of  $24$  item. A detailed inspection reveals that only two items are non-zero:

- arrange  $\sigma=(4,3,2,1)$, that is, the subdiagonal, the product  $1\cdot1\cdot1\cdot1=1$;it requires two swaps($1\leftrightarrow4$, $2\leftrightarrow3$) can be restored, the sign is positive, and the contribution  $+1$.
- arrange  $\sigma=(3,2,1,4)$, the product is also  $1$;Exchange once ($1\leftrightarrow3$) can be restored, the sign is negative, and the contribution  $-1$.

The rest  $22$  The terms all have zero factors and are all zero. So



$$
\det B=+1-1=0 .
$$



Determinant is zero explanation  $B$  Strange, this matter is also very clear from the lines: the first line plus the third line gives  $(1,1,1,1)$, the second row plus the fourth row are also  $(1,1,1,1)$, so



$$
\text{row}_1-\text{row}_2+\text{row}_3-\text{row}_4=\boldsymbol{0},
$$



Rows are linearly related. This example demonstrates on the one hand  $24$  How the term is generated also explains the cost of the big formula: $B$  With just a few more non-zero elements, the number of items to check will double. In actual calculations, elimination is the more labor-saving method.

![Video 00:20:15: Classroom blackboard writing](</attachments/mit1806-388c903d48fe282841ddc698.jpg>)

*Video 00:20:15 \| Approximately corresponding to Section 3 "3. Big Formula".*

![Official Handout Summary Page 2/3](</attachments/mit1806-a9bcdbac791d4853de939278.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 19 Summary, CC BY-NC-SA 4.0).*

![Video 00:26:50: Classroom blackboard writing](</attachments/mit1806-e89c3be52d8c126e72320fba.jpg>)

*Video 00:26:50 \| Approximately corresponding to Section 3 "3. Big Formula".*

## 4. Algebraic cofactors

The large formula is written in a "spread" way. You can regroup according to which element is taken from the first row to get a "dimensionality reduction" way of writing. This section  $3\times 3$  The six items of are grouped by the first row:



$$
\det A=a_{11}\bigl(a_{22}a_{33}-a_{23}a_{32}\bigr)
+a_{12}\bigl(a_{23}a_{31}-a_{21}a_{33}\bigr)
+a_{13}\bigl(a_{21}a_{32}-a_{22}a_{31}\bigr).
$$



Each bracket encloses all items that use that row element. Look at the first bracket: $a_{22}a_{33}-a_{23}a_{32}$  It happens to be what remains after deleting the first row and column  $2\times2$  Determinant of a matrix. This is no coincidence - the first row and column have been  $a_{11}$  used, the remaining elements can only be in the  $2,3$  line and order  $2,3$  Take one from each row and each column in the column, and all combinations of "take one from each row and each column" are exactly the determinants of that small matrix.

Generally, delete the first  $i$  Row, No.  $j$  obtained after column  $(n-1)\times(n-1)$  The determinant of a matrix is called  $a_{ij}$  of **Yuzi style** (minor), recorded as  $M_{ij}$; Then add symbols according to the position, and it is **algebraic cofactor**



$$
C_{ij}=(-1)^{i+j}M_{ij}.
$$



The notation rules are  $i+j$  Take positive for even numbers and negative for odd numbers. The three brackets correspond in sequence to  $C_{11}=+M_{11}$, $C_{12}=-M_{12}$, $C_{13}=+M_{13}$: indeed there is  $a_{23}a_{31}-a_{21}a_{33}=-(a_{21}a_{33}-a_{23}a_{31})=-M_{12}$. Looking along the first line the symbols are  $+,-,+,-$; When switching to the second line, it starts with the negative sign and becomes  $-,+,-,+$. The entire symbol table is a checkerboard:



$$
\begin{bmatrix}
+&-&+&-\\
-&+&-&+\\
+&-&+&-\\
-&+&-&+
\end{bmatrix}.
$$



So get **algebraic cofactor formula**: along the first  $i$  row expansion,



$$
\det A=a_{i1}C_{i1}+a_{i2}C_{i2}+\cdots+a_{in}C_{in}.
$$



This line can be any line. The reason is directly related to the big formula: each item of the big formula takes exactly one element in each row, and all the elements are taken according to "which column is taken in this row" $n!$  Items are divided into  $n$  Group, No.  $j$  The group happens to be  $a_{ij}$  Multiplied by the selection of all remaining positions, that is  $a_{ij}C_{ij}$, the sum is the above formula. Note  $C_{ij}$  Just rely on deleting the first  $i$  Row, No.  $j$  The remaining elements after the column are the same as the  $i$  Row, No.  $j$  The numbers in the columns are irrelevant, so when the numbers in a row are replaced, the algebraic cofactors in this row remain unchanged. Since the determinant and transpose have the same value, expansion along any column is also true. In this case, that column should be regarded as the corresponding row of the transposed matrix.

Check with the world's smallest example: $2\times2$  When expanded along the first line, $C_{11}=d$ (Delete the first row and first column, leaving only  $d$), $C_{12}=-c$ (remaining after deletion)  $c$, while  $(1,2)$  position sign is negative), then



$$
\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=a\cdot d+b\cdot(-c)=ad-bc,
$$



Same as before.

The significance of the algebraic cofactor is that it  $n$  The order problem becomes  $n$  a  $(n-1)$  order problem, and then becomes  $(n-2)$  Steps, all the way down to the bottom. Because of this, it can be used as another starting point for determinant theory: first define  $2\times2$, then use  $(n-1)$  stage definition  $n$  level, can also establish a whole set of theories. Of course, when actually developing it, you have to choose  $0$  The row or column with the most, because the terms multiplied by zero don't even have to be counted.

So far, there are three ways to calculate the determinant, and their respective "complexity distributions" are very different. On the road of elimination, all the complexity is pressed into the pivot element, and the determinant is equal to the product of all pivot elements - this is what I said in the previous lecture **pivot formula**, and finally only need to multiply the principal components. The process is efficient and clean, and it is the real way to use numerical calculations. The big formula spreads out all the complexity into  $n!$  Each item is simple, but the number of items is exploding. The algebraic cofactors are centered: each term is "an easy coefficient multiplied by a more difficult subdeterminant", layer by layer. All three count the same number.

![Video 00:34:38: Classroom blackboard writing](</attachments/mit1806-a1e5b7225e1f9bd78e1127b0.jpg>)

*Video 00:34:38｜Approximately corresponding to Section 4 "4. Algebraic cofactors".*

![Video 00:41:14: Classroom blackboard writing](</attachments/mit1806-527d98812dbf1710cd12517a.jpg>)

*Video 00:41:14｜Approximately corresponding to Section 4 "4. Algebraic cofactors".*

## 5. Example: Tridiagonal sum  $1$  determinant of matrix

Finally, a complete example is used to run through the algebraic cofactor formula. Set  $A_n$  is  $n\times n$  of **tridiagonal matrix**: The main diagonal and the two sub-diagonals immediately above and below it are all  $1$, the rest of the positions are all  $0$.$n=4$  time is



$$
A_4=\begin{bmatrix}
1&1&0&0\\
1&1&1&0\\
0&1&1&1\\
0&0&1&1
\end{bmatrix}.
$$



Start with the smallest ones. $A_1=\begin{bmatrix}1\end{bmatrix}$, $\det A_1=1$.$A_2=\begin{bmatrix}1&1\\1&1\end{bmatrix}$  The two rows of are the same. If the determinant of the two rows is swapped, the sign will change but the matrix will remain unchanged. Therefore  $\det A_2=0$;It counts directly as well  $1\cdot1-1\cdot1=0$.

$A_3=\begin{bmatrix}1&1&0\\1&1&1\\0&1&1\end{bmatrix}$  A little more troublesome. Using the large formula, only three of the six permutations give a non-zero product: $(1,2,3)$  Contribute  $+1$, $(2,1,3)$  Contribute  $-1$, $(1,3,2)$  Contribute  $-1$, the other three all got a certain  $0$. Together  $\det A_3=1-1-1=-1$.

Check it in another way, and demonstrate the combination of elimination and algebraic cofactors. Subtract the third row from the second row, leaving the determinant unchanged:



$$
\begin{bmatrix}1&1&0\\1&1&1\\0&1&1\end{bmatrix}
\;\longrightarrow\;
\begin{bmatrix}1&1&0\\1&0&0\\0&1&1\end{bmatrix}.
$$



Now expand along the second row: this row has only one non-zero element  $(2,1)$  positional  $1$, the remaining two  $0$  There is no need to multiply any number. The symbol for this position is  $(-1)^{2+1}=-1$, the cofactor obtained by deleting the second row and the first column is  $\det\begin{bmatrix}1&0\\1&1\end{bmatrix}=1$, so the contribution is  $1\cdot(-1)\cdot1=-1$, consistent with the above.

Arrived  $A_4$, expanded along the first row, only the first two of the four positions are  $1$, the last two are  $0$, zero-multiplied terms are not worth expanding.

first one  $1$  in  $(1,1)$, the sign is positive, and what remains after deleting the first row and first column is exactly  $A_3$, this contribution  $\det A_3$.

second  $1$  in  $(1,2)$, the sign is negative, after deleting the first row and second column, we get



$$
M_{12}=\begin{bmatrix}1&1&0\\0&1&1\\0&1&1\end{bmatrix}.
$$



$M_{12}$  The first column of only  $(1,1)$  The location is  $1$, expansion along this column only needs to count one item, and the sign is positive; the remainder after deletion  $2\times2$  block is  $\begin{bmatrix}1&1\\1&1\end{bmatrix}$, exactly  $A_2$. So  $\det M_{12}=\det A_2$, the second contribution is  $-\det A_2$.

thus



$$
\det A_4=\det A_3-\det A_2=-1-0=-1 .
$$



The same expansion holds for any order: along  $A_n$  The first row of is expanded and the first term gives  $\det A_{n-1}$, the second term gives  $-\det A_{n-2}$, the remaining terms are zero, so



$$
\det A_n=\det A_{n-1}-\det A_{n-2}.
$$



This recursion starts from  $n=3$  Begin to be established; if agreed  $\det A_0=1$, then  $n=2$  when it also gives  $\det A_2=\det A_1-\det A_0=1-1=0$, consistent with the previous calculation.

Write out the sequence: $1,\,0,\,-1,\,-1,\,0,\,1$. Continue with the recursive calculation:



$$
\det A_5=-1-(-1)=0,\qquad
\det A_6=0-(-1)=1,\qquad
\det A_7=1-0=1 .
$$



The sequence becomes  $1,0,-1,-1,0,1,1,0,-1,-1,0,1,\dots$, with  $6$  Repeat for the cycle. You don't have to count all the way through to see the cycle: the recursion relies only on the first two terms, so as long as a certain pair of adjacent values ​​recurs, the rest will repeat itself. here  $\det A_7=\det A_1=1$, $\det A_8=\det A_2=0$, the combination of adjacent two items returns to the starting point, and thereafter each item is related to  $6$  Same as before.

This periodicity is completely invisible from the matrix itself. It only emerges when the recursion is written out. With it, any subscript can immediately find the result: $61=6\times10+1$, so



$$
\det A_{61}=\det A_1=1 .
$$



The value of this example does not lie in calculating a specific number, but in showing a complete path: large formulas or eliminations are used to deal with small orders, the algebraic cofactors give recursion, and the recursion reveals the overall law.

![Video 00:47:58: Classroom blackboard writing](</attachments/mit1806-26fcf7a541ead18bf95fc27a.jpg>)

*Video 00:47:58｜Approximately corresponding to Section 5 "5. Example: Tridiagonal Complete  $1$ "near the determinant of the matrix".*

![Official Handout Summary Page 3/3](</attachments/mit1806-de8afd728964f458c7504e51.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 19 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The three defining properties of determinants are: $\det I=1$, swap two lines to change signs, and linearize a certain line while fixing the remaining lines. put  $2\times2$  Split each row into two pieces (total  $2^2$  items), the two items in the zero column disappear, leaving  $ad$  with  $-bc$, get  $\det\begin{bmatrix}a&b\\c&d\end{bmatrix}=ad-bc$.
- **Survivor items** One element must be taken from each row and column, and its column number constitutes an **replacement**(permutation); $3\times3$  Yes  $3!=6$  The sign of the term is determined by the odd or even number of exchanges required to restore the natural order.
- $3\times3$  The six items are: $a_{11}a_{22}a_{33}$, $a_{12}a_{23}a_{31}$, $a_{13}a_{21}a_{32}$  Take positive and the other three take negative. The diagonal direction formula only applies to  $3\times3$; $4\times4$  The full subdiagonal of  $1$  The matrix determinant is  $+1$, because the two exchanges offset the symbols.
- **big formula**: $\det A=\sum_{\sigma}(-1)^{e(\sigma)}a_{1\sigma(1)}\cdots a_{n\sigma(n)}$, a total of  $n!$  terms, half positive and half negative; the number of terms is  $n!$  It's because the first line has  $n$  Kind of selection method, the second line is left  $n-1$  species, and so on. Use it to verify  $\det I=1$  Just look at the identity permutation.
- $4\times4$  of  $0$-$1$  Example  $B$  of  $24$  Only two of the terms are nonzero: $\sigma=(4,3,2,1)$  Contribute  $+1$, $\sigma=(3,2,1,4)$  Contribute  $-1$, so  $\det B=0$;This is related to the row  $\text{row}_1-\text{row}_2+\text{row}_3-\text{row}_4=\boldsymbol{0}$  mutual confirmation.
- **algebraic cofactor** $C_{ij}=(-1)^{i+j}M_{ij}$, among which  $M_{ij}$  is to delete the first  $i$  line of work  $j$  behind the column **Yuzi style**;Symbol press  $i+j$  The odd and even numbers are distributed in a checkerboard pattern.
- **algebraic cofactor formula**: along any line (or by  $\det A=\det A^{\mathsf T}$  along any column), $\det A=\sum_j a_{ij}C_{ij}$, put  $n$  transformed into  $(n-1)$  level; $2\times2$  Immediately  $a\cdot d+b\cdot(-c)=ad-bc$.
- There are three ways to calculate the determinant: multiply the pivot components after elimination, and expand the large formula ($n!$  term), use algebraic cofactor recursion (easy coefficients multiplied by more difficult small determinants).
- three diagonals  $1$  The matrix satisfies  $\det A_n=\det A_{n-1}-\det A_{n-2}$, the sequence is  $1,0,-1,-1,0,1$  And with  $6$  is a period, therefore  $\det A_{61}=\det A_1=1$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| determinant | determinant | by  $n\times n$  The number determined by the number table satisfies the three defining properties |
| big formula | big formula | Write the determinant as  $n!$  The sum of terms, taking one element from each row and column of each term |
| permutation | replacement | $1$  Arrive  $n$  A rearrangement of determines the column number of an item in a large formula |
| parity of a permutation | Permuted parity | The odd or even number of exchanges required to restore the natural order determines the sign of the item |
| permutation matrix | permutation matrix | Exactly one per row and column  $1$  is a matrix whose determinant is  $\pm1$ |
| minor | Yuzi style | Delete the first  $i$  line of work  $j$  The determinant of the resulting matrix after the columns  $M_{ij}$ |
| cofactor | algebraic cofactor | The co-factor with the sign, $C_{ij}=(-1)^{i+j}M_{ij}$ |
| cofactor formula | algebraic cofactor formula | Expand along a row: $\det A=\sum_j a_{ij}C_{ij}$, put  $n$  transformed into  $n-1$  level |
| linearity in one row | single line linear | When the remaining rows are fixed, the determinant can be added to a certain row and constant factors can be proposed. |
| tridiagonal matrix | tridiagonal matrix | A matrix with only the main diagonal and two adjacent sub-diagonals being non-zero |
| pivot formula | pivot formula | The determinant is equal to the product of all the pivots obtained by elimination |

---

[← Lecture 18](/en/notes/mit-1806/lec18) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 20 →](/en/notes/mit-1806/lec20)
