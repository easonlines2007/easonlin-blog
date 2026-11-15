---
kind: notes
source: mit-1806/lec07
title: "Lecture 7 · Solving $A\\boldsymbol{x}=\\boldsymbol{0}$: Host variables
  and special solutions"
description: Use pivot components and free variables to write all solutions to
  Ax=0, and understand special solutions and null spaces.
sourceHash: b0f2c4c9054eed02d44e2d327d71e0ba9cf9f18976e5b9a265fe76f2f95dee2f
publish: true
translationMethod: machine-assisted
---

> *Solving Ax = 0: pivot variables, special solutions* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 7 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p7 · Solve  $A\boldsymbol{x}=\boldsymbol{0}$: Main variables and special solutions](https://www.bilibili.com/video/BV1ix411f7Yp?p=7)(43:20)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-7-solving-ax-0-pivot-variables-special-solutions/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=7&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The first two lectures are for  $A\boldsymbol{x}=\boldsymbol{0}$  The solution set is named - null space, and also given  $A\boldsymbol{x}=\boldsymbol{b}$  The desolvability has found its home - column space, but it all stops at the level of "what is". This lecture will turn the definition into an algorithm: given a fixed process, for any matrix, whether it is a square matrix or a rectangular matrix, whether it is full rank or not full rank, every vector in the null space can be written.

tools are still **elimination** (elimination), but its usage has changed. In the past, elimination was to understand a specific system of equations, and all pivots must be non-zero; now elimination is to see the structure of the matrix clearly, and the position of the pivot appears.  $0$  It's no longer a disaster, but information - it declares that this column is a combination of some previous columns, and it also declares that the corresponding variables can take values freely. So the variables are divided into **main variable** (pivot variable) and **free variable** (free variable) two categories, the total number of pivots gives the matrix **rank** (rank), and the number of free variables determines the size of the null space: there are as many free variables as there are **special solution** (special solution), the null space is all their linear combinations.

The progression route of the whole lecture is three steps, plus an example at the end. The first step, in a  $3\times 4$  After running the algorithm on the matrix, we get the echelon shape and two special solutions; in the second step, we continue to simplify the echelon shape into **row simplest form**(row reduced echelon form)$R$, so that the special solutions can be read directly without back-substitution; the third step is to arrange the special solutions side by side into a matrix  $N$, write all the answers at once in chunked form. Finally, we end with an example of a transposed matrix to illustrate  $A$  with  $A^{\mathsf T}$  The number of pivot columns is the same.

![Official Handout Summary Page 1/2](</attachments/mit1806-41e7ff381a254fb20e8d69cb.png>)

*MIT OCW Official Lecture Notes Summary Page 1/2 (18.06SC Lecture 7 Summary, CC BY-NC-SA 4.0).*

## 1. From definition to algorithm: elimination on rectangular matrices

Take a matrix with three rows and four columns:



$$
A=\begin{bmatrix}
1&2&2&2\\
2&4&6&8\\
3&6&8&10
\end{bmatrix}.
$$



Two dependencies can be seen without having to draw a pen. The second column is the first column  $2$  times, $(2,4,6)=2(1,2,3)$, it does not bring a new direction and is not an independent column; the third row is the sum of the first row and the second row, $(1,2,2,2)+(2,4,6,8)=(3,6,8,10)$, which does not provide new equations. Both of these dependencies should be discovered automatically by elimination, not by sight.

The algorithm is the same as that of the square matrix, with only one more tolerance: searching for the pivot column by column starting from the upper left corner, if a column is at the pivot position  $0$, all below  $0$, don’t stop there and try again and again, move directly to the next column; as long as you can still find a non-zero pivot, continue to eliminate it. If the pivot position is  $0$  But there is a non-zero dollar below, so swap the two rows to bring it up.

The first pivot is  $(1,1)$  locational  $1$, the first row remains unchanged, use it to eliminate the  $2$  with  $3$:

- The second row minus the first row  $2$  Times: $(2,4,6,8)-(2,4,4,4)=(0,0,2,4)$;
- The third row minus the first row  $3$  Times: $(3,6,8,10)-(3,6,6,6)=(0,0,2,4)$.

The matrix becomes



$$
\begin{bmatrix}
1&2&2&2\\
0&0&2&4\\
0&0&2&4
\end{bmatrix}.
$$



Go to the second column, pivot position  $(2,2)$  is  $0$, looking down still  $0$, the main element cannot be obtained from this column. this  $0$  It's not a coincidence: it is exactly the residue of "the second column is a multiple of the first column" after elimination, but there is no need to stop and analyze at this moment, just skip this column. On the third column  $(2,3)$  locational  $2$  is the second pivot element, and the multiplier is  $1$, the third row is subtracted from the second row and the whole row is reset to zero:



$$
U=\begin{bmatrix}
1&2&2&2\\
0&0&2&4\\
0&0&0&0
\end{bmatrix}.
$$



$U$  It cannot be called an upper triangular matrix because on the diagonal  $(2,2)$  The location is  $0$; Its non-zero elements are arranged in a stepped shape. This form is called **ladder shape** (echelon form), the original meaning of echelon is stairs. The number of steps, that is, the number of pivot elements, is equal to  $2$, this number is the matrix **rank**(rank): $\operatorname{rank}A=2$.

The zero row at the bottom is also no coincidence. The third row was originally the sum of the first two rows, and elimination dug this out: a row can be eliminated to zero by the row above, which is equivalent to it being a linear combination of the rows above. In other words, there are only two equations in the system of equations that are truly independent. The matrix has three rows, but the independent one has only two rows.

Here we need to distinguish what elimination changes and what does not change. What elimination does is "reduce a multiple of one equation to another equation". The solution set of the system of equations remains unchanged, so  $A\boldsymbol{x}=\boldsymbol{0}$, $U\boldsymbol{x}=\boldsymbol{0}$  and behind  $R\boldsymbol{x}=\boldsymbol{0}$  The null space is exactly the same. But the column space will change: $A$  The column space is given by  $(1,2,3)$  with  $(2,6,8)$  Zhang Cheng, and  $U$  The column space is given by  $(1,0,0)$  with  $(2,2,0)$  Zhang Cheng is another plane. Elimination preserves null space but not column space.

![Video 00:04:20: Classroom blackboard writing](</attachments/mit1806-6c948a40a37545fd3e992e73.jpg>)

*Video 00:04:20 \| Approximately corresponding to Section 1 "1. From Definition to Algorithm: Elimination on Rectangular Matrix".*

## 2. Main variables, free variables and special solutions

$U\boldsymbol{x}=\boldsymbol{0}$  Spread out and written there are only two non-zero equations:



$$
x_1+2x_2+2x_3+2x_4=0,\qquad 2x_3+4x_4=0 .
$$



Four unknowns and two independent equations, the solution is of course not unique - this is also expected: three equations with four unknowns should have non-zero solutions. Which variables can be "solved" depends entirely on which column the pivot falls on. The main element is in the first  $1$, $3$  column, so  $x_1,x_3$  is **main variable**, $x_2,x_4$  is **free variable**;The variable corresponding to the pivot column is the main variable, and the variables corresponding to the other columns are free variables. This division must be given by the result of elimination, and cannot be guessed based on appearance: the second column of the original matrix is ​​an obvious multiple, but whether the fourth column is free can only be seen after elimination.

The names of the free variables say it all: their values can be assigned arbitrarily, and once assigned, the host variables are uniquely determined by the remaining equations, and back-substitution proceeds as usual. Of course, you can also get a vector in the null space by taking any value, but the null space is an infinite set, and you can't guarantee that none of them will be missed if you take any value. The algorithm requires a set of standard selection methods: only one free variable can be selected at a time  $1$, the remaining free variables are  $0$.

First time taking  $x_2=1,\ x_4=0$. The last equation gives  $2x_3+0=0$, so  $x_3=0$; Substituting back into the first equation, $x_1+2\cdot 1+0+0=0$, so  $x_1=-2$. So



$$
\boldsymbol{s}_1=\begin{bmatrix}-2\\1\\0\\0\end{bmatrix}.
$$



This vector makes the relationship between columns clear: $-2$  Double the first column plus  $1$  Times the second column is equal to the zero column, that is  $\boldsymbol{c}_2=2\boldsymbol{c}_1$, exactly the dependence that was seen at first glance. any multiple of it  $c\boldsymbol{s}_1$  They are also solutions, drawing a straight line passing through the origin in four-dimensional space.

Second time taking  $x_2=0,\ x_4=1$. At this time  $2x_3+4=0$, got  $x_3=-2$; Substituting back into the first equation, $x_1+2\cdot 0+2\cdot(-2)+2\cdot 1=0$, that is  $x_1-2=0$, got  $x_1=2$. So



$$
\boldsymbol{s}_2=\begin{bmatrix}2\\0\\-2\\1\end{bmatrix}.
$$



it is read as  $2\boldsymbol{c}_1-2\boldsymbol{c}_3+\boldsymbol{c}_4=\boldsymbol{0}$. Check item by item: $2(1,2,3)-2(2,6,8)+(2,8,10)=(2,4,6)-(4,12,16)+(2,8,10)=(0,0,0)$, established. $\boldsymbol{s}_2$  It can't be  $\boldsymbol{s}_1$  Multiples of , only the second component  $0$  with  $1$  It is enough to explain that the two straight lines have different directions.

The complete description of the null space is therefore



$$
N(A)=\left\{c_1\boldsymbol{s}_1+c_2\boldsymbol{s}_2\right\},
$$



That is, all linear combinations of two special solutions. Why is it "not leaking"? Because the method itself has a one-to-one correspondence: free variables  $(x_2,x_4)$  Take any set of values  $(a,b)$, the solution is  $a\boldsymbol{s}_1+b\boldsymbol{s}_2$, and once the free variables are determined, the main variables are uniquely determined by the equation. Two vectors just cover all the degrees of freedom, one more is redundant, and one less is not enough.

This sentence can be said even harder: coefficient  $(c_1,c_2)$  They are not made up after the fact, they are free variables  $(x_2,x_4)$  The value itself. So each vector in the null space corresponds to a unique set of coefficients, $\boldsymbol{s}_1$  with  $\boldsymbol{s}_2$  The entire null space is parameterized without duplication or omission. This distinction is very practical when answering questions: if you ask "What is the null space?" the answer must include any constant  $c_1,c_2$, because it is a whole plane passing through the origin; if you only ask "a set of basis of the null space", it is enough to write these two vectors.

From this we get the most important counting formula in this lecture. Assume that the matrix has  $n$  column ($n$  unknown numbers), the rank is  $r$, then the main variable is  $r$ , the free variables are  $n-r$  There are also special solutions  $n-r$ . This example  $n=4$, $r=2$, the two free variables correspond to exactly two special solutions. $r$  At the same time, it is also a simpler fact: there seem to be three equations, but the only one that is truly independent is  $r$  article.

![Video 00:11:12: Classroom blackboard writing](</attachments/mit1806-4f9e2911b625a8b097cce837.jpg>)

*Video 00:11:12 \| Approximately corresponding to Section 2 "2. Main variables, free variables and special solutions".*

![Video 00:13:00: Classroom blackboard writing](</attachments/mit1806-cbb395676885b49676925fdb.jpg>)

*Video 00:13:00 \| Approximately corresponding to Section 2 "2. Main variables, free variables and special solutions".*

![Video 00:16:28: Classroom blackboard writing](</attachments/mit1806-3ff7242b0e08af629b03100e.jpg>)

*Video 00:16:28 \| Approximately corresponding to Section 2 "2. Main variables, free variables and special solutions".*

## 3. Do the simplest form: complete the back substitution in advance

The ladder form can already calculate the answer, but every time the values of a set of free variables are changed, it must be re-substituted. can put  $U$  Wipe it clean a little more to make the answer visible: eliminate the elements above the pivot element to zero, and then divide each pivot element by itself to become  $1$. Both types of operations only reduce a multiple of an equation to another equation, or multiply an equation by a non-zero number, and the solution set is not affected.

Do upward elimination first. First row minus second row:



$$
(1,2,2,2)-(0,0,2,4)=(1,2,0,-2),
$$



main element  $2$  The one above  $2$  was cleared, no.  $4$  The columns are from  $2$  become  $-2$. Then divide the second row by  $2$, $(0,0,2,4)\to(0,0,1,2)$. get



$$
R=\begin{bmatrix}
1&2&0&-2\\
0&0&1&2\\
0&0&0&0
\end{bmatrix}.
$$



This matrix is called **row simplest form** (row reduced echelon form, abbreviated as rref), which satisfies three conditions: each pivot is  $1$;The other elements in the column where the pivot is located are all  $0$, both above and below are counted; zero rows are all sorted at the bottom.

$R$  Put the structure out in the open. The main row is the first  $1,2$  row, the pivot column is the  $1,3$  column, in the "pivot row" $\times$  At the intersection of the "pivot columns" stands a  $2\times 2$  of **identity matrix**(identity matrix)$I$;The zero line is at the bottom, confirm again that one of the original three lines is redundant. The remaining  $2$, $4$  The column is a free column, which separates the pivot column from the free column. $R$  It becomes a block shape



$$
R=\begin{bmatrix}I&F\\0&0\end{bmatrix},
\qquad
F=\begin{bmatrix}2&-2\\0&2\end{bmatrix},
$$



Among them  $F$  It's the piece where the free column is moved over as it is.

This shape is not unique to this case. Any matrix reduced to its simplest form of rows will present the same pattern: the above rows are pivot rows, and there are three rows at the pivot column positions.  $r\times r$  The identity matrix of ; the right side is  $n-r$  free columns, forming  $F$;The remaining rows are all zeros. $R$  Everything that can be eliminated has been eliminated - the top and bottom of the main element are clean, and the main element is clean  $1$, zero rows sink to the bottom, no other row transformation can make it easier. It is precisely because of this that from  $R$  The information read out requires the least effort: the pivot row is  $1,\dots,r$, the main element column can be counted at a glance, and the position of the free column is also clear at a glance.

The block writing method allows special solutions to be solved in one step. Rearrange the unknowns according to "main variables and free variables" (this only changes the writing order, not the solution set), $R\boldsymbol{x}=\boldsymbol{0}$  That’s it



$$
\begin{bmatrix}I&F\end{bmatrix}
\begin{bmatrix}\boldsymbol{x}_{\text{pivot}}\\ \boldsymbol{x}_{\text{free}}\end{bmatrix}=\boldsymbol{0}
\quad\Longrightarrow\quad
\boldsymbol{x}_{\text{pivot}}+F\boldsymbol{x}_{\text{free}}=\boldsymbol{0}
\quad\Longrightarrow\quad
\boldsymbol{x}_{\text{pivot}}=-F\boldsymbol{x}_{\text{free}} .
$$



Free variable takes  $(1,0)$, the main variable is  $-F$  the first column of  $(-2,0)$;Free variable takes  $(0,1)$, the main variable is  $(2,-2)$. in original variable order  $x_1,x_2,x_3,x_4$  Writing back, it happened to be the hand calculation of the previous section.  $(-2,1,0,0)$  with  $(2,0,-2,1)$. Those "symbols flipping over" phenomenon when calculating by hand is not a coincidence: $F$  The number in is originally added to the main variable on the left side of the equal sign, but when moved to the right, the sign changes. This is  $-F$  The origin of.

Comes with a practical saying: put  $A$  input, call  `rref`  command, this is what appears on the screen  $R$, you can see the pivot rows, pivot columns, unit blocks, and free columns at a glance.

![Video 00:28:10: Classroom blackboard writing](</attachments/mit1806-ccd9aee26bd1ad0d6daec4c4.jpg>)

*Video 00:28:10｜Approximately corresponding to section 3 "3. Do the simplest form: finish the back substitution in advance".*

## 4. Null space matrix: one special solution per column

Since the special solutions are the "generators" of the null space, we might as well arrange them side by side into a matrix. definition **null space matrix**(null space matrix)$N$  is a matrix with all special solutions as columns. From the derivation in the previous section, as long as the free variable takes each column of the identity matrix, the main variable takes  $-F$, so



$$
N=\begin{bmatrix}-F\\I\end{bmatrix}.
$$



Its number of rows is equal to the number of unknown numbers  $n$, the number of columns is equal to the number of free variables  $n-r$. There is only one core property:



$$
RN=\begin{bmatrix}I&F\end{bmatrix}
\begin{bmatrix}-F\\I\end{bmatrix}
=-F+F=0 .
$$



$N$  Each column of is  $R$  sent to the zero column, so they are all in the null space; and because the number of columns is exactly equal to the number of degrees of freedom, these columns give the most economical set of generators in the null space. They are also unlikely to be linearly related: $N$  The piece of free variables is the identity matrix. Any non-trivial combination will leave a non-zero component there and cannot become a zero vector.

For the example in this lecture, put  $F=\begin{bmatrix}2&-2\\0&2\end{bmatrix}$  Enter it and press  $x_1,x_2,x_3,x_4$  Rearrange the rows in their natural order to get



$$
N=\begin{bmatrix}
-2&2\\
1&0\\
0&-2\\
0&1
\end{bmatrix},
$$



The two columns are exactly  $\boldsymbol{s}_1$  with  $\boldsymbol{s}_2$. Contrast  $R$  with  $N$  We can also see the weight of this rule: $R$  inside  $F$  appear intact  $N$  Here, only a negative sign is added to the whole, and the unit block is moved from "the location of the main variable" to "the location of the free variable".

Got it  $N$, all vectors in the null space can be written uniformly as  $\boldsymbol{x}=N\boldsymbol{c}$, among which  $\boldsymbol{c}$  is arbitrary  $n-r$  dimensional vector. degrees of freedom included  $\boldsymbol{c}$, the matrix structure is included in  $N$, each of them manages one end. In this case  $N$  is  $4\times 2$, it forms a plane passing through the origin; in the transposed example  $N$  There is only one column, and it forms a straight line.

There is another convenience in calculation: if  $A$  hand over  `null`  command, it does exactly these things internally - first calculate  $R$, identify the pivot column and the free column, and fill in the free variables  $1$  and  $0$, and then use back substitution to complement the main variable. Simplify to  $R$  After that, back-substitution is as simple as shifting terms, so the whole process requires almost no arithmetic.

![Video 00:34:04: Classroom blackboard writing](</attachments/mit1806-a38339157667fce7cd43593c.jpg>)

*Video 00:34:04 \| Approximately corresponding to Section 4 "4. Null space matrix: one column, one special solution".*

![Video 00:34:40: Classroom blackboard writing](</attachments/mit1806-4fb64facef2d9683f1103304.jpg>)

*Video 00:34:40 \| Approximately corresponding to Section 4 "4. Null space matrix: one column, one special solution".*

## 5. Example of transposition: the number of pivot columns remains unchanged

put the above  $A$  Transpose to get a matrix with four rows and three columns, and then go through the complete process:



$$
A^{\mathsf T}=\begin{bmatrix}
1&2&3\\
2&4&6\\
2&6&8\\
2&8&10
\end{bmatrix}.
$$



Predict before calculating. Can there be three pivots in three columns? No, because the third column is exactly the sum of the first two columns: $(1,2,2,2)+(2,4,6,8)=(3,6,8,10)$. So it is expected that there will only be two pivot columns and the third column will be the free column. There is also a dependence on the row direction: the second row is the first row  $2$  times and should be eliminated.

Elimination begins. The first main element is  $1$, use the first line to eliminate the following  $2$: The second row minus twice the first row is  $(0,0,0)$;The third line is  $(0,2,2)$; The fourth line is  $(0,4,4)$:



$$
\begin{bmatrix}
1&2&3\\
0&0&0\\
0&2&2\\
0&4&4
\end{bmatrix}.
$$



The pivot position of the second column  $(2,2)$  is  $0$, but the third line below has  $2$, so the second and third lines are swapped, and  $2$  Bring it up. Appears at the pivot position  $0$  It doesn't necessarily mean that this column is useless, it may just be that it happens to be in the wrong position - take a look down and decide. This is the extra step for rectangular matrix elimination than for square matrices.



$$
\begin{bmatrix}
1&2&3\\
0&2&2\\
0&0&0\\
0&4&4
\end{bmatrix}.
$$



Then use the second line to eliminate the fourth line  $4$, the multiplier is  $2$: $(0,4,4)-(0,4,4)=(0,0,0)$. At this time



$$
U=\begin{bmatrix}
1&2&3\\
0&2&2\\
0&0&0\\
0&0&0
\end{bmatrix}.
$$



Turning to the third column, the pivot position is  $0$, the two lines below are all  $0$, there is really nothing we can do this time, and the algorithm ends here. rank is still  $2$.

The pivot column is the  $1,2$  column, the free column has only the  $3$  column, therefore  $n-r=3-2=1$, there is only one special solution, the null space is  $\mathbb{R}^3$  a straight line in . Let the free variables  $x_3=1$ (If order  $x_3=0$, the equation will only give an all-zero solution, which is equal to a white calculation), from the second formula  $2x_2+2=0$  Got  $x_2=-1$; Substituting back into the first formula, $x_1+2\cdot(-1)+3=0$, got  $x_1=-1$. So



$$
\boldsymbol{s}=\begin{bmatrix}-1\\-1\\1\end{bmatrix},
\qquad
N(A^{\mathsf T})=\left\{c\boldsymbol{s}\right\}.
$$



Check column relationships: $-\boldsymbol{c}_1-\boldsymbol{c}_2+\boldsymbol{c}_3=-(1,2,2,2)-(2,4,6,8)+(3,6,8,10)=(0,0,0)$, established.

Continue to simplify to  $R$: The second row is divided by  $2$  Got  $(0,1,1)$, the first row minus the second row  $2$  Bede  $(1,0,1)$, so



$$
R=\begin{bmatrix}
1&0&1\\
0&1&1\\
0&0&0\\
0&0&0
\end{bmatrix}
=\begin{bmatrix}I&F\\0&0\end{bmatrix},
\qquad
F=\begin{bmatrix}1\\1\end{bmatrix},
\qquad
N=\begin{bmatrix}-1\\-1\\1\end{bmatrix}.
$$



Here’s another fact: $A$  There are two pivot columns, $A^{\mathsf T}$  There are also two pivot columns. The transposition turns the rows into columns, but the number of pivots remains unchanged. It can be seen that the rank is an attribute of the matrix itself and does not change whether it is "viewed horizontally" or "viewed vertically" - it counts independent columns, and  $A$  The line is  $A^{\mathsf T}$  columns, so the same number also counts separate rows. But the null space scale of the two is different: $A$  is  $4-2=2$  a free variable, $A^{\mathsf T}$  only  $3-2=1$ . It can be seen that the same rank number leaves different room for free variables on matrices of different shapes. What determines this room is the number of columns.  $n$.

![Video 00:39:00: Classroom blackboard writing](</attachments/mit1806-5be2a3f6b648b51d63f5e3c8.jpg>)

*Video 00:39:00 \| Approximately corresponding to Section 5 "5. Example of transposition: the number of pivot columns remains unchanged".*

![Official Handout Summary Page 2/2](</attachments/mit1806-35e8fe96d2bec0d38170e0b7.png>)

*MIT OCW Official Lecture Notes Summary Page 2/2 (18.06SC Lecture 7 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- solution  $A\boldsymbol{x}=\boldsymbol{0}$  The algorithm is elimination: find the pivot column by column, and the pivot position is  $0$  and all below are  $0$  Skip the column when there is a non-zero element below, and swap the two rows until there is no new pivot element.
- The number of pivots is the matrix **rank** (rank). This lecture  $3\times 4$  In the example of  $\operatorname{rank}A=2$, $A^{\mathsf T}$  The rank is also  $2$.
- Elimination does not change the null space: $A\boldsymbol{x}=\boldsymbol{0}$, $U\boldsymbol{x}=\boldsymbol{0}$, $R\boldsymbol{x}=\boldsymbol{0}$  All three have the same solution; but elimination will change the column space.
- The column corresponding to the pivot **main variable**, the remaining columns correspond to **free variable**; $n$  Column, rank  $r$  The matrix has  $r$  main variable and  $n-r$  a free variable.
- **special solution** The method of taking is: let a free variable take  $1$, take the rest  $0$, and then go back to the main variable. Example 1  $\boldsymbol{s}_1=(-2,1,0,0)$, $\boldsymbol{s}_2=(2,0,-2,1)$, the null space is all their linear combinations.
- Each special solution corresponds to a specific relationship between columns: $\boldsymbol{s}_1$  Description  $\boldsymbol{c}_2=2\boldsymbol{c}_1$, $\boldsymbol{s}_2$  Description  $2\boldsymbol{c}_1-2\boldsymbol{c}_3+\boldsymbol{c}_4=\boldsymbol{0}$.
- **row simplest form** $R$  The required pivot is  $1$, the rest of the elements in the pivot column are all  $0$, the zero row is at the bottom; the intersection of its pivot row and pivot column is the identity matrix, and the overall shape is  $R=\begin{bmatrix}I&F\\0&0\end{bmatrix}$.
- by  $R$  Li De  $\boldsymbol{x}_{\text{pivot}}=-F\boldsymbol{x}_{\text{free}}$, therefore **null space matrix** for  $N=\begin{bmatrix}-F\\I\end{bmatrix}$, and  $RN=0$; Its columns are all special solutions.
- The zero rows at the bottom of the steps indicate that one of the original rows is a combination of other rows, so the number of independent equations equals the rank, not the number of rows.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| elimination | elimination | Algorithm for creating pivot elements column by column using row transformation without changing the solution set of the system of equations |
| echelon form | ladder shape | A matrix shape in which non-zero elements are arranged in a stepped shape with zero rows at the bottom  $U$ |
| row reduced echelon form | row simplest form | The main element is  $1$, the remaining elements of the pivot column are  $0$  of ladder shape  $R$ |
| pivot | pivot | The non-zero first element on each step during the elimination process |
| pivot column | Pivot column | The column containing the pivot corresponds to the principal variable |
| pivot variable | main variable | The value of the unknown number corresponding to the pivot column is uniquely determined by the equation. |
| free variable | free variable | The unknown number corresponding to the column without pivot, the value can be specified arbitrarily |
| special solution | special solution | Let a free variable be  $1$, the rest are  $0$  The null space vector obtained by back-substitution |
| null space matrix | null space matrix | matrix with all special solutions as columns  $N=\begin{bmatrix}-F\\I\end{bmatrix}$ |
| rank | rank | The number of pivots is also the number of independent equations and independent columns. |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  All vectors of  $N(A)$ |
| identity matrix | identity matrix | The intersection of the pivot row and the pivot column  $I$, the diagonal angle is  $1$, the rest are  $0$ |
| transpose | transpose | Obtained by swapping rows and columns  $A^{\mathsf T}$, with  $A$  Same rank |

---

[← Lecture 6](/en/notes/mit-1806/lec06) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 8 →](/en/notes/mit-1806/lec08)
