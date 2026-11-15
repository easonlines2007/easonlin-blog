---
kind: notes
source: mit-1806/lec01
title: Lecture 1 · Geometric Interpretation of Systems of Equations
description: "Understand Ax=b from three perspectives: rows, columns, and
  matrices, and see how linear combinations generate the entire space."
sourceHash: 0ec8e0c99f23d6e36b89c7ba22377fa7759d2bc80c65e7f3561eae2d7ca42376
publish: true
translationMethod: machine-assisted
---

> *The geometry of linear equations* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 1 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p1 · Geometric interpretation of systems of equations](https://www.bilibili.com/video/BV1ix411f7Yp?p=1)(39:49)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-1-the-geometry-of-linear-equations/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=1&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The central problem of linear algebra is to solve a system of equations  $A\boldsymbol{x}=\boldsymbol{b}$. This lecture is not eager to give an algorithm, but first establishes three views that are equivalent to each other but have completely different intuitions: **row view** Think of each equation as a hyperplane, **column view** Think of the solution as a linear combination of column vectors, **matrix view** Then the entire system of equations is compressed into a multiplication of matrices and vectors. These three views will appear repeatedly throughout the course; the column view is particularly important because it translates "solving an equation" into "using column vectors to spell out the right-hand vector."

Why go to the trouble of establishing three views? Because solving equations is only the most superficial task of linear algebra. The row view answers "what is the solution geometrically", the column view answers "which right-hand vectors are reachable and why", and the matrix view compresses hundreds or thousands of equations into an object, allowing us to perform operations on the "matrix" itself, decompose it, and discuss reversibility. I can only eliminate elements on paper and encounter  $n$  When you look at dimensional space, least squares, and eigenvalue problems, you will lose your direction; only by combining the three perspectives can you integrate calculation, geometry, and algebra.

In this lecture, I will first use one  $2\times2$  The example goes through each of the three perspectives and then generalizes to  $3\times3$, and finally discuss an issue that runs through the entire course: for a given  $A$, is every  $\boldsymbol{b}$  Can all be solved? The answer to this question will lead to "singular matrices", "column spaces" and the elimination method in the next lecture.

![Official Handout Summary Page 1/3](</attachments/mit1806-5a21676e7f6523e46a18e78c.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 1 Summary, CC BY-NC-SA 4.0).*

## 1. from a  $2\times 2$  system of equations begins

Let’s first look at an example that can be calculated by hand:



$$
\begin{cases}
2x-y=0,\\
-x+2y=3.
\end{cases}
$$



Arrange the coefficients before the unknown numbers into a matrix by position to get the coefficient matrix



$$
A=\begin{bmatrix}2&-1\\-1&2\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}x\\y\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}0\\3\end{bmatrix}.
$$



The system of equations can then be written in compact matrix form  $A\boldsymbol{x}=\boldsymbol{b}$. here  $A$  is a  $2\times 2$  matrix, $\boldsymbol{x}$  and  $\boldsymbol{b}$  They are all two-dimensional column vectors. A matrix is ​​essentially a rectangular array of numbers; each row corresponds to an equation, and each column corresponds to an unknown coefficient in each equation.

## 2. Row view: each equation is a hyperplane

Row view only looks at one equation at a time. first equation  $2x-y=0$  described  $xy$  A straight line on a plane. take  $y=0$  Got  $x=0$, so the straight line passes through the origin; then take  $x=1$  Got  $y=2$, so we get another point  $(1,2)$. Two points define a straight line, and all points satisfying the first equation fall on this line.

second equation  $-x+2y=3$  It's also a straight line. It does not pass through the origin: when  $x=y=0$  When the left side is  $0$, not equal to  $3$. take  $y=0$  Got  $x=-3$, take  $x=-1$  Got  $y=1$, the second straight line is obtained by connecting these two points.

Two straight lines intersect at a point  $(1,2)$. put  $x=1,y=2$  Substituting back the two equations:



$$
2(1)-2=0,\qquad -(1)+2(2)=3,
$$



Both equations hold, so  $(1,2)$  It is the solution to the system of equations. **The point of the row view is that the solution to a system of equations must lie on the straight lines corresponding to all equations simultaneously, so it is the intersection of these straight lines.**

Extend this idea to  $n$  unknowns: a linear equation in  $n$  Corresponding to one in dimensional space  $(n-1)$  dimensional "hyperplane". In three dimensions, two planes intersect at a straight line, and three planes usually intersect at a point; in general  $n$  In a dimensional space, the intersection of two hyperplanes is usually  $(n-2)$  Dimensional, the intersection of three hyperplanes is usually  $(n-3)$  Dimensional. The higher the dimension, the more difficult it is to draw the graph, but the geometric meaning of "the solution set is the common intersection of all hyperplanes" remains unchanged; the solution is unique when the intersection shrinks exactly to a point.

![Video 00:03:59: Classroom blackboard writing](</attachments/mit1806-7f93e0a16b6fcba400779206.jpg>)

*Video 00:03:59 \| Approximately corresponding to section 2 "2. Row view: each equation is a hyperplane".*

![Video 00:07:10: Classroom blackboard writing](</attachments/mit1806-f1b7920529985e7a3d1074a0.jpg>)

*Video 00:07:10 \| Approximately corresponding to section 2 "2. Row view: each equation is a hyperplane".*

## 3. Three-dimensional example: three planes intersect at one point

Let’s see one more  $3\times 3$  Example:



$$
\begin{cases}
2x-y=0,\\
-x+2y-z=-1,\\
-3y+4z=4.
\end{cases}
$$



Its coefficient matrix and right-hand vector are respectively



$$
A=\begin{bmatrix}
2&-1&0\\
-1&2&-1\\
0&-3&4
\end{bmatrix},
\qquad
\boldsymbol{b}=\begin{bmatrix}0\\-1\\4\end{bmatrix}.
$$



In the row view, these three equations correspond to three planes in three-dimensional space. The first plane passes through the origin, the second plane does not pass through the origin, and the third plane does not pass through the origin. The first two planes intersect a straight line, and the third plane intersects the straight line at a point - this point is the solution to the system of equations.

Direct observation can verify



$$
\boldsymbol{x}=\begin{bmatrix}0\\0\\1\end{bmatrix}
$$



Satisfies three equations: the first equation  $0=0$, the second formula  $0+0-1=-1$, the third formula  $0+0+4=4$. So the common point of the three planes is  $(0,0,1)$.

row view in  $2\times 2$  It is very intuitive at first, but it has become difficult to draw accurately in three dimensions; in four and nine dimensions, the human eye cannot draw it at all. Linear algebra requires a representation that does not rely on graphing, and this is the column view.

## 4. Column view: solution is a linear combination of column vectors

put  $A\boldsymbol{x}$  Split by column:



$$
A\boldsymbol{x}
=
x\begin{bmatrix}2\\-1\end{bmatrix}
+y\begin{bmatrix}-1\\2\end{bmatrix}
=
\begin{bmatrix}0\\3\end{bmatrix}.
$$



In other words, solving a system of equations means finding the coefficients  $x,y$, so that the linear combination of the two column vectors is exactly equal to the right-hand vector  $\boldsymbol{b}$. The "linear combination" here is the core operation of the entire course: **Multiply several vectors by a scalar and add the results.**

For the above example, take  $x=1,y=2$:



$$
1\begin{bmatrix}2\\-1\end{bmatrix}
+2\begin{bmatrix}-1\\2\end{bmatrix}
=
\begin{bmatrix}2-2\\-1+4\end{bmatrix}
=
\begin{bmatrix}0\\3\end{bmatrix}.
$$



Geometrically, first along the first column vector  $(2,-1)$  Take one step and then follow the second column vector  $(-1,2)$  Take two steps, and the end point happens to be  $\boldsymbol{b}=(0,3)$  at. This is the column view: **The solution is "Use column vectors to spell out  $\boldsymbol{b}$"Recipe required.**

Comparing the two views side by side, the difference is clear at a glance:

| | row view | column view |
| --- | --- | --- |
| Following objects | $A$  each line of | $A$  each column of |
| geometric image | Each equation is a hyperplane | Each column vector is an arrow |
| solution meaning | The common intersection point of all hyperplanes | spell out  $\boldsymbol{b}$  The combination coefficient of |
| solvability problem | Do these hyperplanes intersect? | Can combinations of column vectors cover  $\boldsymbol{b}$ |
| High-dimensional promotion | Difficult to draw | can still be described algebraically and collectively |

The row view is intuitive, but it is limited by the number of dimensions that the human eye can draw; the column view is abstract, but it can directly answer "which  $\boldsymbol{b}$  Reachable". As the course progresses, column view becomes the default language.

The three-dimensional example can also be read like this:



$$
x\begin{bmatrix}2\\-1\\0\end{bmatrix}
+y\begin{bmatrix}-1\\2\\-3\end{bmatrix}
+z\begin{bmatrix}0\\-1\\4\end{bmatrix}
=
\begin{bmatrix}0\\-1\\4\end{bmatrix}.
$$



this time  $\boldsymbol{b}$  It happens to be the third column vector, so take  $x=0,y=0,z=1$  That’s it. This example is intentionally designed so that the answer to the column combination is visible at a glance; most of the time we are not so lucky.

![Video 00:11:57: Classroom blackboard writing](</attachments/mit1806-d3fabcdbf282cb26acd9ee39.jpg>)

*Video 00:11:57 \| Approximately corresponding to Section 4 "4. Column view: the solution is a linear combination of column vectors".*

## 5. Change the right-hand vector and the problem immediately changes.

keep matrix  $A$  No change, replace the right end with the sum of the first two column vectors:



$$
\boldsymbol{b}'=
\begin{bmatrix}2\\-1\\0\end{bmatrix}
+
\begin{bmatrix}-1\\2\\-3\end{bmatrix}
=
\begin{bmatrix}1\\1\\-3\end{bmatrix}.
$$



At this point it is obvious that  $x=1,y=1,z=0$  can get  $\boldsymbol{b}'$. In the row view, this is equivalent to replacing the three planes with three other planes, and they still intersect at a new point.  $(1,1,0)$;In the column view, the column vector has not changed at all, only the target vector to be spelled has changed. **The same matrix can correspond to countless right-end vectors, and the solution changes accordingly; the matrix itself determines "which right-end vectors are reachable."**

put all reachable  $\boldsymbol{b}$  Collect it and you will get  $A$  The set of column vectors that can be spanned. This set was officially named in the fifth lecture **column space** (column space). So "$A\boldsymbol{x}=\boldsymbol{b}$ "Is it solvable?" can be answered in one sentence: $\boldsymbol{b}$  Does it belong to  $A$  column space.

This leads to the most important question of this lecture:

> For a given matrix  $A$, is it right **every** right end vector  $\boldsymbol{b}$, equation  $A\boldsymbol{x}=\boldsymbol{b}$  Any solutions?

In the language of column views, this question is equivalent to:

> $A$  Can all linear combinations of column vectors fill the entire target space?

Opponent's formation  $A$  In terms of , if the combination of column vectors can cover the entire  $\mathbb{R}^n$, then each  $\boldsymbol{b}$  are all reachable; if only a part of it can be covered, then only those that fall within this part  $\boldsymbol{b}$  Only then can there be a solution.

![Video 00:19:54: Classroom blackboard writing](</attachments/mit1806-061038bcbaaf17c2d1b1150a.jpg>)

*Video 00:19:54 \| Approximately corresponding to section 5 "5. Change the right-hand vector, the problem immediately changes".*

![Official Handout Summary Page 2/3](</attachments/mit1806-4981527f28449e5990add3c6.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 1 Summary, CC BY-NC-SA 4.0).*

## 6. When will “coverage be insufficient”?

to  $3\times 3$  For example. If the three column vectors happen to lie on the same plane passing through the origin, then any linear combination of them is still in this plane and cannot escape the plane. Therefore, in the plane  $\boldsymbol{b}$  There is a solution, out of plane  $\boldsymbol{b}$  No solution.

A typical bad case is when the third column vector is equal to the sum of the first two column vectors:



$$
\boldsymbol{a}_3=\boldsymbol{a}_1+\boldsymbol{a}_2.
$$



At this time, the third column vector does not provide any "new direction", and what it can contribute has already been taken care of by the first two column vectors. Such a matrix is called **singular matrix** (singular matrix), also called irreversible matrix. Singular matrices are not guaranteed to work for every  $\boldsymbol{b}$  has a solution; conversely, the matrix that the column vector can span into the entire space is called **non-singular matrix** (nonsingular matrix) or **Reversible matrix**(invertible matrix).

Use the above  $3\times3$  Example: Let’s do a thought experiment: replace the third column with the sum of the first two columns, that is  $\boldsymbol{a}_3=\boldsymbol{a}_1+\boldsymbol{a}_2$. No matter at this time  $z$  What value should be taken? $z\boldsymbol{a}_3$  can be  $x\boldsymbol{a}_1+y\boldsymbol{a}_2$  Absorbing, all combinations of the three column vectors remain at  $\boldsymbol{a}_1,\boldsymbol{a}_2$  In the plane of Zhang Cheng. If the right end  $\boldsymbol{b}$  Exactly within this plane, the equation may still have a solution (and the solution is not unique, because it can be adjusted arbitrarily  $z$); if  $\boldsymbol{b}$  Outside the plane, no matter how you combine it, you can't reach it. **Row view and column view are saying the same thing here**: The three planes no longer intersect at one point, but intersect on a line (there are infinite solutions), or they are parallel to each other/form a triangular prism (no solution).

This phenomenon is also true in the nine-dimensional space, but the "plane" becomes an "eight-dimensional hyperplane". If the nine nine-dimensional column vectors are independent of each other, their combination can fill the entire  $\mathbb{R}^9$;If the ninth column vector is just a repetition or combination of the first eight, then all combinations fill at most an eight-dimensional subspace, and there are always some  $\boldsymbol{b}$  Never out of reach. **The higher the dimensionality, the more difficult it is to draw a picture, but the algebraic question of "how large a space can a column vector expand into" remains unchanged.**

![Video 00:25:53: Classroom blackboard writing](</attachments/mit1806-2c83ae5a0431d2427f95702b.jpg>)

*Video 00:25:53｜Approximately corresponding to Section 6 "6. When will "coverage be insufficient"?"*

![Video 00:28:40: Classroom blackboard writing](</attachments/mit1806-ef57716d5744ec289d7a2098.jpg>)

*Video 00:28:40｜Approximately corresponding to section 6 "6. When will "coverage be insufficient"?"*

## 7. Matrix multiplication by vector: two algorithms, one essence

Finally, back to matrix multiplication itself. Given



$$
A=\begin{bmatrix}2&5\\1&3\end{bmatrix},
\qquad
\boldsymbol{x}=\begin{bmatrix}1\\2\end{bmatrix},
$$



Calculate  $A\boldsymbol{x}$  There are two common ways.

**Calculate row by row (dot product)**: The first component of the result is  $A$  The first line of  $\boldsymbol{x}$  The dot product of



$$
2\cdot 1+5\cdot 2=12;
$$



The second component is the second row with  $\boldsymbol{x}$  The dot product of



$$
1\cdot 1+3\cdot 2=7.
$$



So  $A\boldsymbol{x}=\begin{bmatrix}12\\7\end{bmatrix}$.

**Calculate by column (linear combination)**: The result is equal to  $\boldsymbol{x}$  of components to combine  $A$  columns,



$$
1\begin{bmatrix}2\\1\end{bmatrix}
+2\begin{bmatrix}5\\3\end{bmatrix}
=
\begin{bmatrix}2+10\\1+6\end{bmatrix}
=
\begin{bmatrix}12\\7\end{bmatrix}.
$$



Both algorithms give the same vector. View by row, $A\boldsymbol{x}$  is a number of dot products; looking at columns, $A\boldsymbol{x}$  is a linear combination of column vectors. **This course emphasizes the latter**: It directly connects matrix multiplication with the core concepts of "column space", "linear combination" and "span", and also provides a better understanding for later  $A\boldsymbol{x}=\boldsymbol{b}$  Lay the foundation for the solution structure.

## 8. Division of labor among three perspectives

The three perspectives are not substitutes for each other, but each is responsible for a type of problem. **row view** Suitable for understanding "where is the solution": each equation gives a constraint, and the solution must satisfy all constraints at the same time, which is geometrically the intersection of hyperplanes. **column view** Suitable for answering "Is there a solution and how many solutions are there?": It regards the right-hand vector as the target of column vector combination. It is clear at a glance whether the target is reachable and whether the combination method is unique. **matrix view** Suitable for calculations and derivation: write the entire system of equations as a symbol  $A\boldsymbol{x}=\boldsymbol{b}$, only then can multiplication, inversion, and decomposition of matrices be done, and only then can we discuss "for all  $\boldsymbol{b}$"Such holistic issues.

The three are often used interchangeably in actual problem solving: first write the problem clearly in matrix form, then use row elimination to find the numerical solution, and finally use column view to explain the structure of the solution. The elimination method in the next lecture is the algorithmization of the row view; whether it succeeds and what went wrong with the matrix when it failed depends on the column view to answer.

![Video 00:37:50: Classroom blackboard writing](</attachments/mit1806-91e855d18d1dfcb1a2819f65.jpg>)

*Video 00:37:50 \| Approximately corresponding to Section 8 "8. Division of labor among three perspectives".*

![Official Handout Summary Page 3/3](</attachments/mit1806-1cba32fe328c50235cdffab8.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 1 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- The system of linear equations can be written as  $A\boldsymbol{x}=\boldsymbol{b}$; $A$  Each row of is an equation, and each column is an unknown coefficient in each equation.
- **row view**: Each equation is a hyperplane, and the solution is the common intersection point of all hyperplanes. Two dimensions are the intersection points of straight lines, and three dimensions are the intersection points of three planes.
- **column view**: $A\boldsymbol{x}$  is  $A$  Linear combination of column vectors, solving the equation is to find the combination coefficient so that the combination result is equal to  $\boldsymbol{b}$.
- Matrix multiplication by vector can either do dot product by row or linear combination by column; the column perspective is the main line for understanding the entire course.
- Opponent's formation  $A$, if the column vector can be spanned into the entire  $\mathbb{R}^n$, then each  $\boldsymbol{b}$  There are solutions, $A$  Non-singular; if the column vector is restricted to some low-dimensional subspace, then only part of  $\boldsymbol{b}$  There is a solution, $A$  Bizarre.
- The next lecture will give a systematic solution method - elimination method, which can determine whether the solution exists in any dimension and find the solution.

## keywords

| English | Chinese | meaning |
| --- | --- | --- |
| linear equation | linear equation | Equations in which the unknowns occur only as powers of one and do not multiply with each other |
| system of equations | system of equations | Several linear equations simultaneously |
| coefficient matrix | coefficient matrix | A matrix that arranges the coefficients of unknown variables in each equation in rows and columns |
| row picture | row view | Look at one equation at a time and think of the solutions as intersections of hyperplanes |
| column picture | column view | Think of the solution as a linear combination of column vectors |
| linear combination | linear combination | Several vectors are multiplied by scalars and then added |
| singular matrix | singular matrix | Column vectors cannot be spread into the entire space and are irreversible matrices |
| nonsingular / invertible | non-singular / reversible | Column vectors span the entire space, for each  $\boldsymbol{b}$  A matrix that has a unique solution |
| dot product | dot product | Multiply the corresponding components of two same-dimensional vectors and then sum them |

---

[Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 2 →](/en/notes/mit-1806/lec02)
