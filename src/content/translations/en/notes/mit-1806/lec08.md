---
kind: notes
source: mit-1806/lec08
title: "Lecture 8 · Solving for $A\\boldsymbol{x}=\\boldsymbol{b}$: row simplest
  form $R$"
description: Use the row simplest form R to judge the solvability of Ax=b and
  write down the general solution.
sourceHash: 081363b3e77aba2eaf7f7c9c719055a01db3a2e88939aa8f376269e05a315ec2
publish: true
translationMethod: machine-assisted
---

> *Solving Ax = b: row reduced form R* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 8 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p8 · Solve  $A\boldsymbol{x}=\boldsymbol{b}$: row simplest form  $R$](https://www.bilibili.com/video/BV1ix411f7Yp?p=8)(47:26)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-8-solving-ax-b-row-reduced-form-r/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=8&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The previous point is that  $A\boldsymbol{x}=\boldsymbol{0}$  All solutions of , that is **null space** (nullspace). This lesson aims the same set of tools at the general right-hand vector  $\boldsymbol{b}$, answer questions about  $A\boldsymbol{x}=\boldsymbol{b}$  Three questions: Does it have a solution? How many are there when there is a solution? How to decipher it all? After these three points are made clear, the matter of "solving a system of linear equations" can be truly completed.

The answer has a minimalist structure: **General explanation  $=$  a special solution  $+$  any vector in null space**. The special solution is responsible for aligning the right end, and the null space is responsible for providing all degrees of freedom. So the solution is split into two tasks that do not interfere with each other: elimination is responsible for finding a special solution, and the method in the previous lecture is responsible for describing the null space.

The second gain is to completely hand over "how many solutions there are" to a number——**rank** (rank). Set  $A$  is  $m\times n$  Matrix, rank is  $r$, $r$  with  $m$, $n$  There are only four combinations of the size relationship of , and each combination corresponds to a type of solution. The rank determines the shape of the solution set, and the specific number determines the location of the solution.

![Official Handout Summary Page 1/3](</attachments/mit1806-f3ac10961dfcd1c79d6e647f.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 8 Summary, CC BY-NC-SA 4.0).*

## 1. Augmented matrices and solvability conditions

Use the matrix used in the previous discussion of null space.



$$
A=\begin{bmatrix}
1&2&2&2\\
2&4&6&8\\
3&6&8&10
\end{bmatrix}.
$$



Its third row is exactly the sum of the first two rows: $(3,6,8,10)=(1,2,2,2)+(2,4,6,8)$. This coincidence will turn into a zero row in elimination, and the zero row is the entrance to judge solvability.

Need to solve  $A\boldsymbol{x}=\boldsymbol{b}$, connect the right end as an extra column to  $A$  on the right, get **augmented matrix**(augmented matrix):



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
2&4&6&8&b_2\\
3&6&8&10&b_3
\end{array}\right].
$$



Every step elimination takes on the left end, the right end must be done simultaneously.  $\boldsymbol{b}$  If you put them into the same table, it will be less likely to leak. This is how input is done in actual software: one table contains all the information.

first one **pivot** (pivot) is  $(1,1)$  locational  $1$. The second row minus the first row  $2$  times, the third row minus the first row  $3$  Times:



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
0&0&2&4&b_2-2b_1\\
0&0&2&4&b_3-3b_1
\end{array}\right].
$$



In the second column, there are all zeros at and below the pivot position. The pivot cannot be taken out, so we jump to the right to the third column. $(2,3)$  locational  $2$  Become the second pivot. Use it again to delete the following line:



$$
\left[\begin{array}{cccc|c}
1&2&2&2&b_1\\
0&0&2&4&b_2-2b_1\\
0&0&0&0&b_3-b_2-b_1
\end{array}\right].
$$



The last line written back to the equation is  $0=b_3-b_2-b_1$. It does not contain any unknowns, so it is not used to solve  $x$ , but used to check  $\boldsymbol{b}$  of: only  $b_1+b_2=b_3$  It was established then.

Elimination can be used to judge solvability because each walking transformation is reversible: the second row minus the first row  $2$  After doubling it, you can still  $2$  Doubling it back leaves the solution intact. The old and new sets of equations have the same solution, and the contradictions in the new set of equations are visible at a glance, and the fate of the original set of equations is determined.

Try it with numbers. If  $\boldsymbol{b}=(1,5,6)$, $1+5=6$, the condition is met, elimination turns the right end into  $(1,\,3,\,0)$, the last line is  $0=0$, you can continue to solve. If  $\boldsymbol{b}=(1,5,17)$, the condition is not met, the last line becomes  $0=11$, the system of equations has no solution.

There are two versions of the criterion, which may seem unrelated, but are actually equivalent. The first is a column-space language: $\boldsymbol{b}$  must fall on  $A$  of **column space** (column space), that is  $\boldsymbol{b}$  can be written as  $A$  Combinations of columns - that's what the equation is all about. The second is the language of lines: if  $A$  Several rows of are combined to obtain zero rows, then  $\boldsymbol{b}$  The corresponding components of must be obtained through the same combination  $0$. In this example "the third row minus the first row minus the second row" gives zero rows, so  $b_3-b_1-b_2$  Must be zero.

The truth of the second statement is hidden in the nature of elimination: elimination never creates new information, it just linearly combines existing equations. If the combination on the left is zero, the number on the right combined in the same way must be zero, otherwise it will appear  $0$  A contradiction equal to a non-zero number. Conversely, if every time a row of zeros is generated the right-hand side also happens to be zero, then each remaining equation has a completely new pivot element and the system of equations can be solved.

It would be clearer to write this sentence as a formula. If there is a coefficient  $c_1,c_2,c_3$  such that



$$
c_1\,\text{row}_1+c_2\,\text{row}_2+c_3\,\text{row}_3=\boldsymbol{0},
$$



Then any solution must satisfy  $c_1b_1+c_2b_2+c_3b_3=0$. In this example, take  $(c_1,c_2,c_3)=(-1,-1,1)$  We get zero rows, so the solvability condition is  $-b_1-b_2+b_3=0$. This also explains why "zero rows" and "right  $\boldsymbol{b}$ "limits" always appear together: the zero row itself is the set of coefficients  $c_i$  of receipt.

![Video 00:04:45: Classroom blackboard writing](</attachments/mit1806-694c1535a15cb7012860d26c.jpg>)

*Video 00:04:45 \| Approximately corresponding to Section 1 "1. Augmented Matrix and Solvability Conditions".*

## 2. Special solution: all free variables are set to zero

After passing the solvability test, the first thing is to create a solution.

Set  $\boldsymbol{b}=(1,5,6)$. The column where the pivot is located is the  $1$, $3$  column, so  $x_1,x_3$  is the main variable; No.  $2$, $4$  The column has no pivot, $x_2,x_4$  is **free variable**(free variable).

Find **special solution** The (particular solution) method is to set all free variables to zero, and then backsubstitute the main variables. order  $x_2=x_4=0$, the first two lines after elimination become



$$
x_1+2x_3=1,\qquad 2x_3=3 .
$$



The second equation remains  $x_3$, got  $x_3=\frac32$;Replace the first one, $x_1=1-2\cdot\frac32=-2$. So



$$
\boldsymbol{x}_p=\begin{bmatrix}
-2\\
0\\
\frac32\\
0
\end{bmatrix}.
$$



Why is zeroing the easiest option? The free variables can be taken at will. Taking them to zero will make all terms containing free variables disappear completely. The number of remaining system equations is exactly equal to the number of main variables, which is triangular in shape and can be directly back-substituted. In other words, setting the free variable to zero is equivalent to shelving all columns without pivots, leaving only the pivot columns, and the problem immediately returns to the familiar square matrix situation. The values of any set of free variables give a solution, so  $\boldsymbol{x}_p$  It's not unique, it's just the one in which "the free variables are all zero".

By the way, see clearly the position of the main element. The second pivot of this matrix is in the third column instead of the second: the second column happens to be the first  $2$  times, after elimination, everything from the pivot position downwards is zero, so naturally the pivot cannot be taken out. The pivot does not necessarily fall on the diagonal, what matters is just which columns it falls on.

Substitution test: first line  $-2+2\cdot\frac32=1$, second line  $2(-2)+6\cdot\frac32=5$, the third line  $3(-2)+8\cdot\frac32=6$, all three right ends are facing each other. Taking ten seconds to check the calculation after completing the problem is a habit worth developing.

![Video 00:11:21: Classroom blackboard writing](</attachments/mit1806-f3a1d5ea95316e32b212bcc3.jpg>)

*Video 00:11:21 \| Approximately corresponding to section 2 "2. Special solution: all free variables are set to zero".*

## 3. General solution: special solution plus null space

One solution does not solve the problem, what is needed is a complete solution. Set  $\boldsymbol{x}_n$  is any vector in the null space, that is  $A\boldsymbol{x}_n=\boldsymbol{0}$, then



$$
A(\boldsymbol{x}_p+\boldsymbol{x}_n)=A\boldsymbol{x}_p+A\boldsymbol{x}_n=\boldsymbol{b}+\boldsymbol{0}=\boldsymbol{b},
$$



So  $\boldsymbol{x}_p+\boldsymbol{x}_n$  Still a solution. On the other hand, if  $\boldsymbol{x}$  is any solution, then



$$
A(\boldsymbol{x}-\boldsymbol{x}_p)=\boldsymbol{b}-\boldsymbol{b}=\boldsymbol{0},
$$



i.e.  $\boldsymbol{x}-\boldsymbol{x}_p$  Falling in null space, $\boldsymbol{x}=\boldsymbol{x}_p+\boldsymbol{x}_n$. Both directions combined: the solution set is exactly  $\boldsymbol{x}_p+N(A)$, no more and no less.

You can already calculate the null space in the previous lecture. Check with the equation after elimination: the second line gives  $2x_3+4x_4=0$, that is  $x_3=-2x_4$;The first line gives  $x_1+2x_2+2x_3+2x_4=0$, substitute  $x_1=-2x_2+2x_4$. Let the two free variables take turns to take  $1$, take another  $0$:

- $x_2=1,\ x_4=0$: $x_3=0$, $x_1=-2$, got  $\boldsymbol{s}_1=(-2,1,0,0)$;
- $x_2=0,\ x_4=1$: $x_3=-2$, $x_1=2$, got  $\boldsymbol{s}_2=(2,0,-2,1)$.

The second group can spot check the first line: $2+2(-2)+2(1)=0$, indeed zero. In this way, the free variable in the null space is taken as  $1$  and  $0$  Received interpretation **special solution** (special solution), to distinguish it from the right end as  $\boldsymbol{b}$  That special solution. So **General explanation** (general solution) is



$$
\boldsymbol{x}=\begin{bmatrix}
-2\\
0\\
\frac32\\
0
\end{bmatrix}
+c_1\begin{bmatrix}
-2\\
1\\
0\\
0
\end{bmatrix}
+c_2\begin{bmatrix}
2\\
0\\
-2\\
1
\end{bmatrix},
\qquad c_1,c_2\ \text{任意}.
$$



Here is a distinction that must be remembered: $\boldsymbol{x}_p$  It cannot be multiplied by a constant in front. $\boldsymbol{s}_1,\boldsymbol{s}_2$  The front is OK. multiply by  $3$  The right-hand end satisfied by the special solution of times is  $3\boldsymbol{b}$, no longer  $\boldsymbol{b}$; No matter how you add or multiply the null space vector, the right end is always zero. The special solution is "a point", and the null space is "a space". The status of the two is different. Because of this, changing to a special solution will not change the solution set: if  $\boldsymbol{x}'_p$  is another special solution, then  $\boldsymbol{x}'_p-\boldsymbol{x}_p$  In the null space, the same plane is drawn using it as the reference point, but the reference point has changed its position.

Geometrically, $A\boldsymbol{x}=\boldsymbol{b}$  The solution set of does not constitute a subspace: $\boldsymbol{b}\ne\boldsymbol{0}$  when it does not contain the origin. it is a pass  $\boldsymbol{x}_p$  plane, the direction is given by  $\boldsymbol{s}_1,\boldsymbol{s}_2$  Zhang Cheng. $\boldsymbol{x}$  There are four components, so this plane lives in  $\mathbb{R}^4$  Here, it is translated as a whole away from the origin. The two parameters indicate that it is two-dimensional - the dimension of the subspace will not be formally defined until the next lecture, but it can already be seen here that the dimension is the number of independent constants that can be freely selected.

![Video 00:18:01: Classroom blackboard writing](</attachments/mit1806-9185bcf19ea5a4f7aeac6290.jpg>)

*Video 00:18:01 \| Approximately corresponding to section 3 "3. General solution: special solution plus null space".*

![Official Handout Summary Page 2/3](</attachments/mit1806-dba064e18604a7e23b9d883b.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 8 Summary, CC BY-NC-SA 4.0).*

## 4. Rank: a number that determines the degrees of freedom

The previous derivation used a specific  $3\times4$  matrix. Use it for anything  $m\times n$  On the matrix, just grab a number: **rank** (rank), its current definition is the number of pivot elements in elimination.

There are only two inequalities between rank and matrix size. Each row contributes at most one pivot, so  $r\le m$;Each column can hold at most one pivot, so  $r\le n$. The column in which the pivot is located is called the pivot column. The remaining columns have no pivot and the corresponding variables can be chosen arbitrarily. Therefore



$$
\text{自由变量的个数}=n-r .
$$



This equation is the crux of the entire lecture. It shows that the degree of freedom is not directly related to the number of equations or the number of unknowns, but only  $n-r$  decision. It also gives the number of special solutions: each free variable corresponds to a special solution, $n-r$  All combinations of special solutions exactly fill the null space.

The word "full rank" is used in two ways. $r=n$  called **Full rank** (full column rank), at this time each column is a pivot column; $r=m$  called **Full of rank** (full row rank), at this time each row has a pivot. Only square arrays are available  $m=n$, only then can the two together be called full rank. The following three full-rank situations, plus the general "small-rank" situation, are all four possibilities.

![Video 00:24:24: Classroom blackboard writing](</attachments/mit1806-faf6dc74acac6ce1d2cc8d15.jpg>)

*Video 00:24:24 \| Approximately corresponding to Section 4 "4. Rank: One number determines the degree of freedom".*

## 5. Full rank  $r=n$: null space has only zero vectors

$r=n$  When each column has a pivot and no free variables, $n-r=0$, there is only zero vector left in the null space - no quantity can be chosen arbitrarily, $A\boldsymbol{x}=\boldsymbol{0}$  Just  $\boldsymbol{x}=\boldsymbol{0}$  A solution.

It was decided immediately  $A\boldsymbol{x}=\boldsymbol{b}$  The shape of : If there is a solution, the solution must be unique, because the difference between the two solutions is in the null space, and there are only zeros there. But the solution may not exist. A matrix with full rank is usually "tall and thin", with more equations than unknowns, and the extra equations are constraints rather than freedoms.

one  $4\times2$  Example:



$$
A=\begin{bmatrix}
1&3\\
2&1\\
6&1\\
5&1
\end{bmatrix}.
$$



The two columns are  $(1,2,6,5)$  with  $(3,1,1,1)$, with different directions, the rank is  $2=n$. Elimination will find two pivot elements; clean up and down the pivot elements, and then convert the pivot elements into  $1$, get **row simplest form**(row reduced echelon form)



$$
R=\begin{bmatrix}
1&0\\
0&1\\
0&0\\
0&0
\end{bmatrix}
=\begin{bmatrix}
I\\
0
\end{bmatrix},
$$



Above is a second-order **identity matrix** $I$, the following two lines are all zeros. This shape explains: $A$  The row space of has only two independent directions, and the four equations are essentially just two equations plus two combinations. Note  $R$  Not in  $F$  That piece, because both columns are pivot columns and there are no free columns, $F$  It completely disappeared.

For such a matrix, randomly pick a  $\boldsymbol{b}$  There is almost certainly no solution, because  $\boldsymbol{b}$  It must be exactly the combination of these two columns; four equations and two unknowns, the conditions are too many. If  $\boldsymbol{b}$  Pick just the right one, such as taking the sum of two columns



$$
\boldsymbol{b}=\begin{bmatrix}
1\\2\\6\\5
\end{bmatrix}
+\begin{bmatrix}
3\\1\\1\\1
\end{bmatrix}
=\begin{bmatrix}
4\\3\\7\\6
\end{bmatrix},
$$



rule  $\boldsymbol{x}_p=(1,1)$  is a solution, and because there are only zero vectors in the null space, it is the only solution.

Therefore, the full rank of the column corresponds to "$0$  or  $1$  A solution."

![Video 00:30:50: Classroom blackboard writing](</attachments/mit1806-7dc0efa7c8ec26fe835d0bc4.jpg>)

*Video 00:30:50｜Approximately corresponding to Section 5 "5. Full rank  $r=n$: The null space has only the vicinity of the zero vector.*

## 6. Walk to full rank  $r=m$: Every right end can be solved

$r=m$  When each row has a pivot, zero rows will not appear during the elimination process. Without zero lines, there is no shape like  $0$  is equal to a non-zero number, there is no pair  $\boldsymbol{b}$  Limitations:



$$
A\boldsymbol{x}=\boldsymbol{b}\ \text{对每个}\ \boldsymbol{b}\ \text{都有解}.
$$



The freedom is not exhausted. $m$  A pivot is occupied  $m$  variables, leaving



$$
n-r=n-m
$$



a free variable. As long as  $n>m$, the null space contains more than zero vectors, and there are infinitely many solutions; $n=m$  When the free variable is zero, it degenerates into the square matrix situation in the next section.

The example takes the transpose of the matrix from the previous section:



$$
A=\begin{bmatrix}
1&2&6&5\\
3&1&1&1
\end{bmatrix}.
$$



Rank is still  $2=m$, while  $n=4$, the free variables are  $4-2=2$ . Eliminate elements to the simplest form of the row,



$$
R=\begin{bmatrix}
1&0&-\frac45&-\frac35\\
0&1&\frac{17}5&\frac{14}5
\end{bmatrix}
=\begin{bmatrix} I & F \end{bmatrix},
$$



The first two columns are the pivot columns, and the identity matrix is made up on the left  $I$, the remaining part on the right is the free part  $F$.$I$  The appearance of indicates that the pivot column has been cleaned up. $F$  Each column of records how the corresponding free column is combined from the pivot column.

In this example, the null space is two-dimensional, and two special solutions can be obtained



$$
\boldsymbol{s}_1=\begin{bmatrix}
4\\-17\\5\\0
\end{bmatrix},
\qquad
\boldsymbol{s}_2=\begin{bmatrix}
3\\-14\\0\\5
\end{bmatrix},
$$



They are respectively  $(x_3,x_4)$  Take a commission  $(1,0)$  with  $(0,1)$  then multiplied by  $5$  Got. because every  $\boldsymbol{b}$  There are solutions, $A\boldsymbol{x}=\boldsymbol{b}$  The general solution of is a certain special solution plus  $c_1\boldsymbol{s}_1+c_2\boldsymbol{s}_2$, is always a two-dimensional "plane".

Therefore, the row of full rank corresponds to "There must be a solution, and  $n>m$  There are always infinite solutions.”

Comparing the two full ranks together, we can see a symmetry: the full rank tube is **existence** (There are no zero rows, so there are no pairs  $\boldsymbol{b}$  requirements), the list of full rank tubes is **uniqueness** (There are no free variables, so the null space is zero). Which one holds true depends on  $r$  caught up  $m$  Still caught up  $n$.

![Video 00:37:27: Classroom blackboard writing](</attachments/mit1806-fb3196bb7da45729724f7bb3.jpg>)

*Video 00:37:27｜Approximately corresponds to Section 6 "6. Practice in full order  $r=m$: Each right end can be solved" nearby.*

## 7. Full rank square matrix and four situations

The last full rank situation is  $r=m=n$. At this time  $r=n$  It is guaranteed that the null space only has zero vectors, $r=m$  Guarantee every  $\boldsymbol{b}$  Both can be solved. Putting the two together: for each  $\boldsymbol{b}$  There is exactly one solution, that is  $A$  Reversible. The simplest form of the row is the cleanest one, which is the identity matrix.

The minimal example is



$$
A=\begin{bmatrix}
1&2\\
3&1
\end{bmatrix},
\qquad
R=\begin{bmatrix}
1&0\\
0&1
\end{bmatrix}=I .
$$



Give as you please  $\boldsymbol{b}=(b_1,b_2)$, $A\boldsymbol{x}=\boldsymbol{b}$  There is only one solution  $\boldsymbol{x}=A^{-1}\boldsymbol{b}$. This is exactly the characteristic of an invertible matrix and the criterion for a "good matrix": when reduced to its simplest form, it becomes  $I$.

Rank the four situations together. To judge the solution, there are actually only two yes-or-no questions: Are there zero rows after elimination (i.e.  $r<m$  is true), is there a non-zero vector in the null space (i.e.  $r<n$  is established). When the two answers are combined, there are exactly four spaces:

| rank | row simplest form  $R$  shape | solution situation |
| --- | --- | --- |
| $r=m=n$ | $I$ | There is exactly one solution, $A$  Reversible |
| $r=n<m$ (full rank) | $\begin{bmatrix} I \\ 0 \end{bmatrix}$ | $0$  or  $1$  solution |
| $r=m<n$ (full rank) | $\begin{bmatrix} I & F \end{bmatrix}$ | There must be a solution, $n>m$  Infinitely many solutions |
| $r<m$  and  $r<n$ | $\begin{bmatrix} I & F \\ 0 & 0 \end{bmatrix}$ | $0$  one or infinite solutions |

written in the table  $\begin{bmatrix} I & F \end{bmatrix}$  There is a premise: the main element happens to fall in the first few columns. If the pivot is distributed on other columns, $I$  with  $F$  The columns will be staggered, $R$  It is still "the unit matrix is spelled out on the pivot column, and the unit matrix is spelled out on the free column.  $F$, maybe with zero lines.” The shape will change, but the criteria will not change.

The last line deserves its own sentence: $r$  at the same time less than  $m$  and  $n$  When , two problems exist at the same time - there are zero rows (so there may be no solution), and there are free variables (so if there is a solution, it must not be unique). This is the fate of the most general matrix. The one at the beginning of this lecture  $3\times4$  The example falls into this grid: $r=2$, than  $m=3$  Smaller than  $n=4$  small, so  $\boldsymbol{b}=(1,5,17)$  No solution, but  $\boldsymbol{b}=(1,5,6)$  There are solutions, and since there are two free variables there are infinitely many solutions. The whole lecture starts from this example and finally finds its place in the general list.

Concluding the whole story in one sentence: **The rank tells you how many solutions there are, and the numbers in the matrix tell you what the solution is.**

![Video 00:42:41: Classroom blackboard writing](</attachments/mit1806-6993b41182b700edc4d2ebb9.jpg>)

*Video 00:42:41 \| Approximately corresponding to Section 7 "7. Full-rank square matrix and four situations".*

![Official Handout Summary Page 3/3](</attachments/mit1806-395fbd7bcfb190c5c864a129.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 8 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- Connect the right end to  $A$  get on the right **augmented matrix**, the right end must be transformed synchronously when eliminating elements; if there is a zero row, the right end is obtained  $\boldsymbol{b}$  constraints.
- In this example, the third row is equal to the sum of the first two rows, and elimination gives zero rows.  $0=b_3-b_2-b_1$, the solvable condition is  $b_1+b_2=b_3$: $\boldsymbol{b}=(1,5,6)$  solvable, $\boldsymbol{b}=(1,5,17)$  No solution.
- Two equivalent languages for solvability: $\boldsymbol{b}$  Belong to  $A$  of **column space**;or any  $A$  rows are combined into a combination of zero rows, which works on  $\boldsymbol{b}$  You must also get it  $0$.
- **special solution** How to find: Set all free variables to zero, and then backsubstitute the main variables. In this case, we get  $\boldsymbol{x}_p=(-2,0,\frac32,0)$, substituting back into the original equation is established.
- **General explanation** $=$  special solution  $+$  null space because  $A(\boldsymbol{x}_p+\boldsymbol{x}_n)=\boldsymbol{b}+\boldsymbol{0}=\boldsymbol{b}$; In this example, two **special solution** for  $(-2,1,0,0)$  with  $(2,0,-2,1)$.
- The constants in front of the special solution cannot be chosen arbitrarily, and the constants in front of the null space vector can be chosen arbitrarily; the solution set itself is not a subspace, but a plane that is translated away from the origin.
- **rank** is equal to the number of pivot elements, satisfying  $r\le m$, $r\le n$, the number of free variables is  $n-r$.
- **Full rank** $r=n$: There are only zero vectors in the null space, and the solution is  $0$  or  $1$  one; $4\times2$  Example  $R=\begin{bmatrix} I \\ 0 \end{bmatrix}$, $\boldsymbol{b}=(4,3,7,6)$  The only solution is  $(1,1)$.
- **Full of rank** $r=m$: no zero rows, each  $\boldsymbol{b}$  can be solved, free variables  $n-m$  one, $n>m$  There are infinite solutions; $2\times4$  Example  $R=\begin{bmatrix} I & F \end{bmatrix}$.
- **full rank square matrix** $r=m=n$: $R=I$, $A$  Reversible, for each  $\boldsymbol{b}$  There is exactly one solution. The boundaries between the four situations are completely determined by rank and  $m$, $n$  relationship decision.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| augmented matrix | augmented matrix | The matrix obtained by connecting the right end vector to the right side of the coefficient matrix |
| solvability | Solvability | The condition for a system of equations to have a solution is that the right end corresponding to the zero row must be zero. |
| column space | column space | $A$  The subspace composed of all linear combinations of each column |
| particular solution | special solution | satisfy  $A\boldsymbol{x}=\boldsymbol{b}$  A certain solution of , usually assuming that the free variables are all zero |
| free variable | free variable | A variable whose column does not have a pivot can take any value. |
| pivot variable | main variable | The variable whose column has a pivot is uniquely determined by the value of the free variable. |
| special solution | special solution | Free variables take turns in the null space  $1$  with  $0$  The obtained solution, its combination constitutes the null space |
| general solution | General explanation | $A\boldsymbol{x}=\boldsymbol{b}$  All solutions of are equal to the special solutions plus the null space |
| rank | rank | The number of pivots in elimination determines the existence and degree of freedom of the solution |
| full column rank | Full rank | $r=n$, each column has a pivot, and the null space has only zero vectors |
| full row rank | Full of rank | $r=m$, each row has a pivot, for each  $\boldsymbol{b}$  All can be solved |
| row reduced echelon form | row simplest form | The main element is  $1$, the final state of elimination where the top and bottom of the pivot column are all zeros  $R$ |

---

[← Lecture 7](/en/notes/mit-1806/lec07) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 9 →](/en/notes/mit-1806/lec09)
