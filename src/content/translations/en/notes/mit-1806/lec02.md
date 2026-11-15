---
kind: notes
source: mit-1806/lec02
title: Lecture 2 · Matrix elimination
description: Use Gaussian elimination to transform the system of equations into
  an upper triangle, and understand the conditions for failure of pivot
  components, multipliers, and elimination.
sourceHash: c049373f4ab0ac5454c80c74c64b5e10ea938ff90769039290080c1c5afe4928
publish: true
translationMethod: machine-assisted
---

> *Elimination with matrices* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 2 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p2 · Matrix elimination](https://www.bilibili.com/video/BV1ix411f7Yp?p=2)(47:42)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-2-elimination-with-matrices/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=2&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Last lecture  $A\boldsymbol{x}=\boldsymbol{b}$  It is interpreted into three views: the row view looks at the equation, the column view looks at the linear combination of column vectors, and the matrix view looks at a multiplication. All three views explain what the problem is, but do not give a solution. This lecture supplements this method, which is **elimination** (elimination). Elimination is not a determinant method - determinants don't appear until much later in the course - but what all numerical software really does when solving a system of linear equations: change the coefficients below the main diagonal to zero in a fixed order,  $A$  Convert it into an upper triangular matrix, and then solve it backwards from the last equation.

There are two clues in this lecture. The first is the algorithm itself: use a  $3\times 3$  Example, step by step **forward elimination** (forward elimination), see clearly what roles the pivot, multiplier, and augmented matrix play, and then **back generation** (back substitution) to find the solution. Also ask a reverse question: When will this algorithm fail? If the pivot position is  $0$, can it be saved by exchanging two lines? If it can't be saved, what's wrong with the matrix itself?

The second clue is to translate these actions into the matrix language. The key ideas of the entire course must ultimately be written as matrix operations rather than just textual descriptions. "Subtract the first row from the second row  $3$  Times" can be written as a left multiplication of a matrix  $A$; By stringing together the two-step elimination, we get  $E_{32}E_{21}A=U$. Matrix multiplication allows moving parentheses but does not allow exchange of orders. This pair of properties determines that elimination matrices can only be multiplied in a fixed order. Finally, reverse the steps and get the inverse matrix sum  $A=LU$  threshold.

![Official Handout Summary Page 1/3](</attachments/mit1806-ecdd8a85d60f54ffeee446ac.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 2 Summary, CC BY-NC-SA 4.0).*

## 1. From system of equations to augmented matrix

Consider a system of equations with three equations and three unknowns



$$
\begin{cases}
x+2y+z=2,\\
3x+8y+z=12,\\
4y+z=2.
\end{cases}
$$



Arrange the coefficients into a matrix by position to get the coefficient matrix and the right-hand vector



$$
A=\begin{bmatrix}
1&2&1\\
3&8&1\\
0&4&1
\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}x\\y\\z\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}2\\12\\2\end{bmatrix}.
$$



So the question is written as  $A\boldsymbol{x}=\boldsymbol{b}$. Note that in the third equation there is no  $x$, so  $A$  of  $(3,1)$  The location is  $0$;This term will later make the multiplier of a certain step exactly equal to  $0$.

When actually doing elimination, copy over and over again  $x,y,z$  The equals and plus signs are pure burdens, all the information is already in the numbers. But the equation cannot be lost: the transformation done on the left end at each step of elimination must be done simultaneously on the right end. By connecting the right end as an extra column to the right side of the coefficient matrix, we get **augmented matrix**:



$$
\left[\begin{array}{ccc|c}
1&2&1&2\\
3&8&1&12\\
0&4&1&2
\end{array}\right].
$$



"Zengguang" means "to connect one piece to another." This column is not used as a pivot during the elimination process, but is rewritten along with the row transformation; when the left end becomes an upper triangle, this column becomes the new right end vector. The right-hand side is written into the same table to ensure that the rule "do the same thing on both sides of the equation" is not missed. In actual software, the left end is often eliminated to the upper triangle first, and then the same steps are performed on the right end. The results of the two methods are the same, but the calculations of the left and right ends are performed separately.

## 2. Forward elimination: pivot element, multiplier, upper triangle

The first step in elimination is to take the first equation and use it to eliminate the following two equations  $x$. In the first equation  $x$  The coefficient of is  $1$, this number is called **pivot**, which is the "key number" used in this step to eliminate the elements below. The row where the pivot is located remains unchanged in this step, and is only used to eliminate other rows, so it is called the pivot row.

Now decide on the multiplier. The purpose is clear: let the second line  $(2,1)$  locational  $3$  become  $0$. Since the first line  $x$  The coefficient is  $1$, use  $3$  To subtract the first line of times, just get this  $3$  offset. So this step **multiplier** (multiplier) is  $3$. It is agreed to use "subtract" instead of "add": subtract in the second line  $3$  times the first row,



$$
\text{row}_2 \leftarrow \text{row}_2-3\,\text{row}_1 .
$$



Count each item item by item. The first line remains unchanged, still  $(1,2,1)$. second line  $(3,8,1)$  subtract  $3(1,2,1)=(3,6,3)$, get  $(0,2,-2)$: $3-3=0$, $8-6=2$, $1-3=-2$. The third line  $(0,4,1)$  The first item of is originally  $0$, the multiplier is  $0$, minus  $0$  Double the first line and nothing changes.

The right end is synchronized: the second line  $12$  subtract  $3\times 2=6$, the remaining  $6$; first line of  $2$  and the third line  $2$  Not moving. So the augmented matrix becomes



$$
\left[\begin{array}{ccc|c}
1&2&1&2\\
0&2&-2&6\\
0&4&1&2
\end{array}\right].
$$



The first step is completed, $x$  has disappeared from the last two equations, and the problem is reduced to two equations and two unknowns  $(y,z)$. Strictly speaking, the first step deals with  $(2,1)$  location; $(3,1)$  The location is already  $0$, the multiplier is  $0$, no further action is required. A real program would still "look" at this number, only to find that no calculation is needed.

The second step continues with the new pivot. at this time  $(2,2)$  positional  $2$  is the second pivot element, and the one below it  $(3,2)$  The location is  $4$. use  $2$  times the second row and subtracts the third row, the multiplier is  $2$:



$$
\text{row}_3 \leftarrow \text{row}_3-2\,\text{row}_2 .
$$



The third line  $(0,4,1)$  subtract  $2(0,2,-2)=(0,4,-4)$, get  $(0,0,5)$. Right end: $2-2\times 6=2-12=-10$. So far



$$
U=\begin{bmatrix}
1&2&1\\
0&2&-2\\
0&0&5
\end{bmatrix},
\qquad
\boldsymbol{c}=\begin{bmatrix}2\\6\\-10\end{bmatrix}.
$$



The left end becomes one **upper triangular matrix**(upper triangular matrix)$U$, $U$  is the first letter of upper; the right-hand vector is denoted as  $\boldsymbol{c}$, it is  $\boldsymbol{b}$  The result after going through the same steps. The purpose of the entire elimination can be summarized in one sentence:  $A$  become  $U$, put  $\boldsymbol{b}$  become  $\boldsymbol{c}$, while  $U\boldsymbol{x}=\boldsymbol{c}$  with the original equation  $A\boldsymbol{x}=\boldsymbol{b}$  Same solution. The three main elements are  $1,2,5$, all fall on the diagonal; no obstacles were encountered in this step, indicating that the properties of this matrix are very good. By the way, by multiplying the three pivot elements we get  $1\times 2\times 5=10$, exactly  $A$  The determinant of - The determinant will not be discussed until later, but its value is already hidden on the diagonal.

![Video 00:04:46: Classroom blackboard writing](</attachments/mit1806-a89093273558e56caf3d2959.jpg>)

*Video 00:04:46 \| Approximately corresponding to section 2 "2. Forward elimination: pivot element, multiplier, upper triangle".*

![Video 00:11:26: Classroom blackboard writing](</attachments/mit1806-aaca0e8a91b50146b30cf905.jpg>)

*Video 00:11:26 \| Approximately corresponding to section 2 "2. Forward elimination: pivot element, multiplier, upper triangle".*

## 3. Back generation

$U\boldsymbol{x}=\boldsymbol{c}$  Writing back the equation form is



$$
\begin{cases}
x+2y+z=2,\\
2y-2z=6,\\
5z=-10.
\end{cases}
$$



This system of equations is triangular: the last equation contains only  $z$, the penultimate one contains only  $y,z$, the first three are included. To solve the problem, start from the last one and defeat them one by one from bottom to top. This process is called **back generation**.

Obtained immediately from the third formula



$$
z=\frac{-10}{5}=-2 .
$$



put  $z=-2$  Substituting into the second equation: $-2z=4$, so  $2y+4=6$, got  $y=1$. again  $y=1,z=-2$  Substituting into the first equation: $2y+z=2-2=0$, so  $x+0=2$, got  $x=2$. The solution is



$$
\boldsymbol{x}=\begin{bmatrix}2\\1\\-2\end{bmatrix}.
$$



Substitution test for the original system of equations: the first equation  $2+2-2=2$;Second formula  $6+8-2=12$;Third formula  $4-2=2$. All three equations hold true and the solutions are correct.

The reason why backgeneration can be carried out in this order is entirely because  $U$  is upper triangular: each equation has only one new unknown in its turn. This also explains why elimination requires effort to create a triangle first - turning a general system of equations into a triangle, and the rest is just mechanical substitution. The combination of elimination and substitution is a complete solution.

## 4. When does elimination fail?

The previous example went well, but the algorithm must be able to cope with bad situations. The so-called failure refers to not being able to collect three main elements after completing the forward elimination. There are two kinds of failure, those that can be remedied and those that cannot.

**The first type: the position of the main element is  $0$, but there are non-zero elements below.**  Assume that the first equation of  $x$  The coefficient is not  $1$  Rather  $0$, the first pivot cannot be taken out. Don't give up at this time, just swap the two lines: put one of the following  $x$  If the equation with non-zero coefficients is moved to the first line, the pivot component will be there. This "temporary failure" only requires that the corresponding position of the line being replaced is not  $0$.

The same phenomenon will appear in later steps. In the example  $8$  Change to  $6$, after the first line, the second line becomes  $(0,0,-2)$, $(2,2)$  The position has become  $0$, the second pivot cannot be taken out. But look below it: $(3,2)$  The location is  $4$, non-zero, so swap the second and third lines to continue. The matrix is ​​not bad, it's just that the order is not what the algorithm likes.

**The second type: the pivot position is  $0$, and all below  $0$.**  This failure cannot be remedied. put in example  $(3,3)$  locational  $1$  Change to  $-4$, the first step is still the same, and the second line is still  $(0,2,-2)$, the third line becomes  $(0,4,-4)$. Then perform the second step and subtract the third line  $2$  Times the second line: $(0,4,-4)-(0,4,-4)=(0,0,0)$. The third pivot position appears  $0$, and there are no rows underneath it, and there is nowhere to change them. The matrix has only two pivots, called **singular matrix** (singular matrix), it is irreversible, and the system of equations no longer has a unique solution for each right-hand vector.

From the column view, there is a clear geometric reason for this failure. When  $(3,3)$  The location is  $-4$  when, $A$  The third column of is  $(1,1,-4)$, while



$$
\begin{bmatrix}1\\1\\-4\end{bmatrix}
=3\begin{bmatrix}1\\3\\0\end{bmatrix}
-\begin{bmatrix}2\\8\\4\end{bmatrix},
$$



i.e. the third column is exactly a combination of the first two columns and does not provide any new direction. The three column vectors are pressed into the same plane passing through the origin, and their linear combination cannot jump out of this plane, so only those that fall within this plane  $\boldsymbol{b}$  Only then can there be a solution. Column vectors are linearly related, pivots are missing, and matrices are irreversible. These three things are three ways of saying the same thing.

The criterion for judgment is therefore very specific: in the process of elimination, the principal element cannot be  $0$;Once a certain pivot position appears  $0$, first check if there are non-zero elements directly below that can be replaced. If there are, then the matrix will continue with a new line. If not, the matrix will be singular. The step of changing to rows is itself a matrix operation, which will appear later in the form of a permutation matrix.

![Video 00:18:07: Classroom blackboard writing](</attachments/mit1806-d310aa4de4adb244fb5911a2.jpg>)

*Video 00:18:07 \| Approximately corresponding to Section 4 "4. When does elimination fail".*

## 5. Write one-step elimination as a matrix

So far, elimination has been described in words. Next, subtract the first row from the second row  $3$  times" is written as a matrix. The key preparation is understanding what matrix multiplication does in the row direction.

The previous lecture emphasized columns: multiplying a matrix by a column vector, the result is a linear combination of the columns of the matrix. Now let’s look at the symmetry side. Get a row vector  $(1,2,7)$  Take left  $A$, the result is still a row vector whose  $j$  The components are



$$
1\cdot A_{1j}+2\cdot A_{2j}+7\cdot A_{3j},
$$



That is to say, $A$  Each column of is calculated by the same set of coefficients  $1,2,7$  weighted sum. Putting the whole line together, the conclusion is



$$
\begin{bmatrix}1&2&7\end{bmatrix}A
=1\cdot(\text{row}_1)+2\cdot(\text{row}_2)+7\cdot(\text{row}_3).
$$



**Multiplying a row vector on the left by a matrix yields a linear combination of the rows of the matrix.**  This is completely parallel to "right multiply a column vector by a matrix to get the combination of each column": matrix multiplication can be read in the column direction as well as the row direction, which is the central idea of linear algebra.

The idea of row combinations can immediately be applied to elimination. The matrix you are looking for  $E$  Satisfy: the first row does not move, the third row does not move, the second row becomes "the second row minus  $3$  times the first line". Since each row of the product is  $A$  Press each row  $E$  The coefficients of the corresponding rows are combined, $E$  The line directly states the recipe:

- Take the first line  $(1,0,0)$, meaning as long as  $A$  the first line of;
- The third line takes  $(0,0,1)$, meaning as long as  $A$  The third line of;
- The second line takes  $(-3,1,0)$, indicating  $-3$  Double the first row and add  $1$  Times the second row.

thus



$$
E_{21}=\begin{bmatrix}
1&0&0\\
-3&1&0\\
0&0&1
\end{bmatrix},
\qquad
E_{21}A=\begin{bmatrix}
1&2&1\\
0&2&-2\\
0&4&1
\end{bmatrix}.
$$



You can spot check any element by using the dot product of "row times column". Productive  $(2,3)$  element, take  $E_{21}$  The second line of  $(-3,1,0)$  with  $A$  The third column of  $(1,1,1)$  Do the dot product: $-3\times 1+1\times 1+0\times 1=-2$, and in the result  $(2,3)$  locational  $-2$  consistent.

The subscript of this matrix  $21$  Its corrected position is recorded: No.  $2$  Row, No.  $1$  columns. it's called **elementary matrix** (elementary matrix), also called elimination matrix, denoted as  $E$. Its shape is very regular: all the diagonals are  $1$, only below the main diagonal  $(2,1)$  Put one everywhere  $-3$;on the diagonal  $1$  Make sure that each row retains a copy of its own row. The negative number below is the multiple to be subtracted.

The same goes for the second step. To "subtract the third line  $2$  times the second row", the matrix simply needs to be in  $(3,2)$  place  $-2$:



$$
E_{32}=\begin{bmatrix}
1&0&0\\
0&1&0\\
0&-2&1
\end{bmatrix},
\qquad
E_{32}\begin{bmatrix}
1&2&1\\
0&2&-2\\
0&4&1
\end{bmatrix}
=\begin{bmatrix}
1&2&1\\
0&2&-2\\
0&0&5
\end{bmatrix}.
$$



If there is nothing to do at a certain step, the corresponding matrix is **identity matrix**(identity matrix)$I$: It is all on the diagonal  $1$, nothing changes when multiplied by it, and its effect is equivalent to that in numbers  $1$. Example  $(3,1)$  The multiplier for that step is  $0$, corresponding to  $E_{31}$  That’s it  $I$, it doesn’t matter whether you write or not.

![Official Handout Summary Page 2/3](</attachments/mit1806-937630ae58deec96ac0e949e.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 2 Summary, CC BY-NC-SA 4.0).*

![Video 00:29:06: Classroom blackboard writing](</attachments/mit1806-252f444b7eab8331f2af4b7b.jpg>)

*Video 00:29:06 \| Approximately corresponding to Section 5 "5. Write one-step elimination as a matrix".*

![Video 00:31:00: Classroom blackboard writing](</attachments/mit1806-48410a8d3012017f84f2f13b.jpg>)

*Video 00:31:00 \| Approximately corresponding to section 5 "5. Write one-step elimination as a matrix".*

## 6. Associative law, permutation matrix and left multiplication and right multiplication

Two-step elimination can be written in conjunction. Take first  $E_{21}$, then multiply  $E_{32}$, get  $U$:



$$
E_{32}\bigl(E_{21}A\bigr)=U .
$$



The bracket on the left indicates that the first step should be done first. But matrix multiplication allows the parentheses to be removed:



$$
E_{32}\bigl(E_{21}A\bigr)=\bigl(E_{32}E_{21}\bigr)A .
$$



This property is called **associative law** (associative law). Its significance is not only convenient for accounting: once the brackets are moved, $E_{32}E_{21}$  It becomes a separate matrix, which completes the entire elimination at once, from  $A$  directly to  $U$. put two  $E$  Multiplied out is



$$
E=E_{32}E_{21}=
\begin{bmatrix}
1&0&0\\
-3&1&0\\
6&-2&1
\end{bmatrix},
$$



Can be verified directly  $EA=U$. But pay attention to this  $E$  The third line of is  $(6,-2,1)$, the original multiplier  $3$  and  $2$  Tangled inside  $6$, it is impossible to tell which two steps Elimination has taken. This observation turns into another, smarter path in the next section.

The associative law holds, but the commutative law does not. Normally



$$
AB\neq BA .
$$



The order of matrix multiplication cannot be changed at will. The step of elimination is to subtract the first row first, and then subtract the second row. If you reverse it, you will calculate something completely different. So the brackets can be moved, but the factors cannot: it must be done first  $(2,1)$, do it again  $(3,2)$, the matrix calculated after the order is reversed is completely different.

Another type of elementary matrix is responsible for exchanging two rows. it's called **permutation matrix** (permutation matrix), recorded as  $P$. The way to find it is simple: swap the two rows of the identity matrix that need to be swapped, and the resulting matrix can do the same row swap for any matrix. to  $2\times 2$  For example, the permutation matrix that swaps two rows is



$$
P=\begin{bmatrix}0&1\\1&0\end{bmatrix},
\qquad
P\begin{bmatrix}a&b\\c&d\end{bmatrix}
=\begin{bmatrix}c&d\\a&b\end{bmatrix}.
$$



its first line  $(0,1)$  means "take the second row of the original matrix", the second row  $(1,0)$  It means "take the first row", which is exactly the application of the row combination rules.

same one  $P$  Placed on the right, the effect is completely different:



$$
\begin{bmatrix}a&b\\c&d\end{bmatrix}
\begin{bmatrix}0&1\\1&0\end{bmatrix}
=\begin{bmatrix}b&a\\d&c\end{bmatrix}.
$$



The right multiplication swaps the columns. The reason is still in the combination rule: when multiplying on the right, each column of the product is the column of the original matrix according to  $P$  The coefficients of the corresponding columns are combined, $P$  the first column of  $(0,1)$  It means "the new first column is taken from the original second column". This gives an orientation rule that runs throughout the course:

> **Left multiplication performs row transformation, and right multiplication performs column transformation.**

All elimination does is row transformation, so the elimination matrix is always left multiplied. This rule also explains why you cannot use a left-multiplied matrix to exchange columns: if the position is wrong, the effect will change the object. The existence of the permutation matrix just fills the gap left in Section 4 - the emergence of the pivot position  $0$  The line break that was used to save the situation was a  $P$  Take left  $A$.

![Video 00:38:56: Classroom blackboard writing](</attachments/mit1806-6c905ce1ff0f5637b92329cc.jpg>)

*Video 00:38:56 \| Approximately corresponding to section 6 "6. Associative law, permutation matrix and left multiplication and right multiplication".*

## 7. Going backwards: inverse matrix and  $A=LU$  prototype

> Editor's Note: Complete  $A=LU$  Decomposition is the theme of the fourth lecture; in the end, this lecture only goes to the inverse of the elimination matrix. The second half of this section  $A=LU$  The derivation of is a supplement by the editor, just to close the intuition of elimination and inverse matrices, and it can be used as a preview of the next stage. The formal content shall be subject to Lecture 4.

Package the entire elimination element into  $EA=U$  After that, a natural thought is: can we not count it?  $E_{32}E_{21}$, but directly from  $U$  return to  $A$? It is much easier to walk backwards than forwards, because the reverse movement of each step of elimination is visible at a glance.

Let’s look at the first step. $E_{21}$  What it does is "the second row subtracts  $3$  times the first row", then the action to offset it is "add back the second row  $3$  times the first line". To write it as a matrix, just put  $(2,1)$  locational  $-3$  Change to  $3$:



$$
E_{21}^{-1}=\begin{bmatrix}
1&0&0\\
3&1&0\\
0&0&1
\end{bmatrix}.
$$



Verify it: $E_{21}^{-1}E_{21}$  The first line of is  $(1,0,0)$, the third line is  $(0,0,1)$, the second line is  $3(1,0,0)+(-3,1,0)=(0,1,0)$, the result is exactly the identity matrix. here  $E_{21}^{-1}$  called  $E_{21}$  of **inverse matrix** (inverse matrix): It is obtained by multiplying it with the original matrix  $I$, which is equivalent to undoing the original transformation. This notation reads "$E_{21}$  The inverse of". Its effect on the right end can also be undone: $(2,12,2)$  Under this multiplier it becomes  $(2,6,2)$, add back  $3$  The first line of times is restored to  $(2,12,2)$.

In the same way, $E_{32}$  The inverse of  $(3,2)$  locational  $-2$  Change to  $2$. Connect the two steps of undo in reverse order to get the total matrix  $E$  The inverse of:



$$
E^{-1}=E_{21}^{-1}E_{32}^{-1}=
\begin{bmatrix}
1&0&0\\
3&1&0\\
0&2&1
\end{bmatrix}.
$$



Note that the order is reversed: walking forward is first  $E_{21}$  after  $E_{32}$, if you go backwards, you must first cancel  $E_{32}$, and then cancel  $E_{21}$, so  $E_{32}^{-1}$  written on the right. This matrix looks like  $E$  Much cleaner: on the diagonal is  $1$, with two multipliers placed intact below  $3$  and  $2$, one step at a time, without interfering with each other.

in  $EA=U$  Take left on both sides  $E^{-1}$, get



$$
A=E^{-1}U=LU,
\qquad
L=\begin{bmatrix}
1&0&0\\
3&1&0\\
0&2&1
\end{bmatrix}.
$$



$L$  is the first letter of lower, which is a lower triangular matrix with all diagonals  $1$, below is the multiplier used for elimination. Directly multiply the verification: $L$  The second line of  $(3,1,0)$  given  $3(1,2,1)+(0,2,-2)=(3,8,1)$, exactly  $A$  The second line; the third line  $(0,2,1)$  given  $2(0,2,-2)+(0,0,5)=(0,4,1)$, exactly the third line.

this is  $A=LU$  prototype. it is related to  $EA=U$  Says the same thing but records it in the opposite way: $E$  Remember "Yes" $A$  What has been done”, the multipliers are multiplied together and lumped together; $L$  Remember that "$A$  What is it made of?” with each multiplier in its place and left as is. The next lecture will talk about matrix multiplication and inverse matrix, and the fourth lecture will officially cover it.  $A=LU$  explained; now just remember where it comes from - by reversing each step of elimination, the multiplier goes from  $E$  free it and write it directly into  $L$.

![Video 00:42:56: Classroom blackboard writing](</attachments/mit1806-54b7103c259ae8bd6ebb707e.jpg>)

*Video 00:42:56｜Approximately corresponding to Section 7 "7. Going backwards: inverse matrix and  $A=LU$ "prototype" nearby.*

![Official Handout Summary Page 3/3](</attachments/mit1806-a3d5820016277edac1f42ea7.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 2 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **elimination** (elimination) is the solution  $A\boldsymbol{x}=\boldsymbol{b}$  is a general algorithm and is also the method actually used by all numerical software; it first  $A$  Turn it into an upper triangle and then return it to another generation.
- **pivot** (pivot) is the key number used to eliminate the elements below in the current step of elimination. It cannot be  $0$; **multiplier** (multiplier) is equal to the number to be eliminated divided by the pivot, $3\times 3$  The multiplier in the example is  $3$, $0$, $2$.
- Connect the right end as an extra column to  $A$  get on the right **augmented matrix**;For each row change on the left end, the right end must be done simultaneously. Example  $\boldsymbol{b}=(2,12,2)$  became  $\boldsymbol{c}=(2,6,-10)$.
- **forward elimination** put  $A$  transformed into an upper triangle  $U$, three principal elements  $1,2,5$  is its diagonal element; the product of the principal elements is equal to  $A$  The determinant of , here is  $10$.
- **back generation** (back substitution) Solve upward from the last equation: $5z=-10$  Got  $z=-2$, $2y-2z=6$  Got  $y=1$, $x+2y+z=2$  Got  $x=2$, the solution is  $(2,1,-2)$.
- Two forms of elimination failure: The pivot position is  $0$  However, there are non-zero yuan below, and exchange remedies can be carried out (such as placing  $8$  Change to  $6$); the pivot position is  $0$  and all below are  $0$, then the matrix **Strange** (such as  $(3,3)$  of  $1$  Change to  $-4$, only two pivots remain). Singularity is equivalent to the linear dependence of column vectors: in the above  $-4$  case, third column  $(1,1,-4)$  exactly equal to  $3$  Times the first column minus the second column, the three column vectors are coplanar.
- **Multiply the row vector by the matrix on the left to get the linear combination of each row**; therefore "the second line minus  $3$  Times the first line" is left multiplication  $E_{21}$——The diagonal elements are all  $1$, only in  $(2,1)$  put away  $-3$.
- $E_{32}E_{21}A=U$  Depend on **associative law** (associative law), the brackets can be moved, so  $E=E_{32}E_{21}$  Complete all eliminations at once; but  $AB\neq BA$, the order of the matrices cannot be exchanged.
- permutation matrix  $P$  Obtained by exchanging two rows of the identity matrix; **Left multiplication performs row transformation and right multiplication performs column transformation.**.
- The inverse of an elimination matrix simply changes the sign of the multiplier: $E_{21}^{-1}$  in  $(2,1)$  write everywhere  $3$. by  $EA=U$  Got  $A=LU$, $L$  Leave the multiplier as is below  $3$  with  $2$, this is the fourth lecture  $LU$  The starting point of decomposition.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| elimination | elimination | Set the coefficients below the pivot element to zero, and then  $A$  Algorithm for solving upper triangle |
| forward elimination | forward elimination | Eliminate the elements column by column from the upper left to the lower right, and we get  $U$  process |
| back substitution | back generation | Start with the last equation and work your way up to the unknowns one by one. |
| pivot | pivot | The current step of elimination is used to eliminate the key number of the element below, which cannot be  $0$ |
| pivot row | main row | The line that remains unchanged in the current step and is used to eliminate the element below it |
| multiplier | multiplier | The "pivot row multiple" to be subtracted from a row is equal to the element to be eliminated divided by the pivot |
| augmented matrix | augmented matrix | The matrix obtained by connecting the right end column to the right side of the coefficient matrix |
| upper triangular matrix | upper triangular matrix | A matrix with all zeros below the main diagonal, the target form of elimination  $U$ |
| row exchange | row swap | When the pivot position is zero, swap two rows to obtain a non-zero pivot |
| singular matrix | singular matrix | A matrix with insufficient number of pivot elements and irreversible |
| elementary matrix | elementary matrix | The matrix corresponding to a row transformation, such as  $E_{21}$, $E_{32}$ |
| permutation matrix | permutation matrix | A matrix with two rows (or two columns) swapped, obtained by swapping the rows of the identity matrix |
| identity matrix | identity matrix | All on the diagonal are  $1$  matrix, equivalent to the number in multiplication  $1$ |
| associative law | associative law | $(AB)C=A(BC)$, the brackets can be moved, and matrix multiplication satisfies |
| commutative law | commutative law | $AB=BA$, matrix multiplication generally does not satisfy |
| inverse matrix | inverse matrix | Multiply the original matrix to obtain the identity matrix, which is used to undo a transformation. |
| LU factorization | LU decomposition | put  $A$  written as lower triangle  $L$  and upper triangle  $U$  The product of $L$  Record elimination multiplier |

---

[← Lecture 1](/en/notes/mit-1806/lec01) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 3 →](/en/notes/mit-1806/lec03)
