---
kind: notes
source: mit-1806/lec09
title: Lecture 9 · Linear independence, basis and dimensionality
description: Understand linear independence, basis and dimension, and learn to
  calculate the dimension of subspace.
sourceHash: 01b513107c255b3e422d74443c190448367d543f89d5d4e1da74be5b6bd5100c
publish: true
translationMethod: machine-assisted
---

> *Independence, basis, and dimension* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 9 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p9 · Linear independence, basis and dimension](https://www.bilibili.com/video/BV1ix411f7Yp?p=9)(50:20)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-9-independence-basis-and-dimension/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=9&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

So far, we have been able to do two things: use elimination  $A$  form **row simplest form** (row reduced echelon form), thus solving  $A\boldsymbol{x}=\boldsymbol{b}$;Consider the solution set as **null space** (nullspace), put  $A\boldsymbol{x}$  Seen as a combination of column vectors, we get **column space** (column space). But these "spaces" have not yet been measured: how many independent directions are there in a subspace? How many vectors are needed to fully describe it? This lecture gives four words to turn these questions into something that can be calculated——**linearly independent**(linear independence), **Zhang Cheng**(span), **base**(basis), **dimension**(dimension).

The four words have a clear division of labor. Linear independence asks only one thing: is it possible for a combination of these vectors to accidentally get a zero vector when the coefficients are not all zero. Zhang Cheng asked in the opposite direction: how much space can be paved by taking all the combinations. Ji puts the two together and requires "no more, no less" and just enough. Dimension turns "how many vectors are there in a set of bases" into a usable number to measure the size of space. When using it, you must distinguish the objects: irrelevance, span, and basis are all properties of a set of vectors, while dimension is an attribute of space and rank is an attribute of matrix. The three cannot be interchanged.

This lecture ultimately comes down to two equations: the rank of a matrix is equal to the dimension of the column space, which is also equal to the number of pivot columns; the dimension of the null space is equal to the number of free variables, that is  $n-r$. When the four basic subspaces are put together in the next lecture, these two equations will be expanded into a complete picture, so this lecture will first explain the column space and the null space.

![Official Handout Summary Page 1/3](</attachments/mit1806-d27b05c48d235233e0703b6b.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 9 Summary, CC BY-NC-SA 4.0).*

## 1. Let’s look at a fact first: there are more unknowns than equations

Before defining any noun, identify a fact that will be used repeatedly later. Set  $A$  is  $m\times n$  matrix, and  $m<n$: The number of equations is small and the number of unknowns is large. Then the homogeneous equation  $A\boldsymbol{x}=\boldsymbol{0}$  There must be a non-zero solution, that is to say  $N(A)$  There is something else besides the zero vector.

The reasoning comes entirely from elimination, no new tools are needed. put  $A$  In the simplest form of rows, the number of pivots will not exceed the number of rows.  $m$, because each row contributes at most one pivot. The matrix has a total of  $n$  Column, the column not occupied by the pivot is **free column** (free column), the corresponding variable is **free variable** (free variable). Since the main element is at most  $m$ , the free variables must be at least  $n-m$ . Take any of the free variables as  $1$, take the rest  $0$, and then back-substitute to solve for each main variable, a set of solutions will be obtained; the free component of this set of solutions is equal to  $1$, so it can never be a zero vector.

Bottom line: When there are more columns than rows, null space is definitely not  $\{\boldsymbol{0}\}$. And there is more than one solution created in this way: $n-m$  Choose any one of the free variables  $1$, take the rest  $0$, a set of different solutions is obtained. This fact will immediately appear geometrically - if you place three vectors on the plane, they must be linearly related.

## 2. Linear independence: whether there is only one trivial combination

Now to the definition. Note that an object is a set of vectors, we don't say "a matrix is ​​linearly independent". vector  $\boldsymbol{v}_1,\boldsymbol{v}_2,\dots,\boldsymbol{v}_n$ **linearly independent** (linearly independent), refers to the combined



$$
c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2+\cdots+c_n\boldsymbol{v}_n=\boldsymbol{0}
$$



There is only one way to set up: $c_1=c_2=\cdots=c_n=0$. Taking all zero coefficients of course gives a zero vector, this combination is called **Ordinary combination** (trivial combination); irrelevant means "there is no other way". On the contrary, if there is a set of coefficients that are not all zero so that the above formula is true, these vectors are called **linearly dependent** (linearly dependent), and that set of coefficients just points out which vector is the linear combination of the rest.

The two statements can be translated into each other. If a vector is a combination of other vectors, for example  $\boldsymbol{v}_n=a_1\boldsymbol{v}_1+\cdots+a_{n-1}\boldsymbol{v}_{n-1}$, you can get it by moving the item  $a_1\boldsymbol{v}_1+\cdots+a_{n-1}\boldsymbol{v}_{n-1}-\boldsymbol{v}_n=\boldsymbol{0}$, there is one in the coefficient  $-1$, is a group that is not all zero, so it is related. In turn, the related set of non-zero coefficients can always be solved by shifting terms to obtain a vector in which one of the coefficients is non-zero. So "correlated" is the same thing as "having one vector that is a combination of the rest"; it's just that when there are more than three vectors, the extra one is not necessarily a multiple of a single vector, but may be a collective cancellation of several vectors.

Look at three small examples.

The first one, $\boldsymbol{v}$  with  $2\boldsymbol{v}$. take  $2\boldsymbol{v}_1-\boldsymbol{v}_2=\boldsymbol{0}$, coefficient  $(2,-1)$  Not all zero, so relevant. The second vector just doubles the length of the first one and does not bring a new direction.

The second one, $\boldsymbol{v}$  with zero vector. As long as a zero vector is mixed into this set of vectors, the irrelevance immediately breaks down: match the zero vector with a coefficient  $1$, add the rest  $0$, the combination is a zero vector. If  $\boldsymbol{v}_1=(2,1)$, $\boldsymbol{v}_2=(0,0)$, then  $0\cdot\boldsymbol{v}_1+6\cdot\boldsymbol{v}_2=\boldsymbol{0}$.

Third, two non-collinear vectors on the plane. combination  $c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2$  To become zero, only  $c_1=c_2=0$, so it doesn’t matter. But add a third vector to this plane  $\boldsymbol{v}_3$, three must be related. Use the facts from Section 1: Arrange the three vectors in columns  $2\times 3$  matrix  $A$, number of columns  $3$  greater than number of rows  $2$, so there is a non-zero  $\boldsymbol{c}=(c_1,c_2,c_3)$  such that  $A\boldsymbol{c}=\boldsymbol{0}$, written as a combination is exactly



$$
c_1\boldsymbol{v}_1+c_2\boldsymbol{v}_2+c_3\boldsymbol{v}_3=\boldsymbol{0}.
$$



Geometry is more straightforward: the third vector cannot escape the plane formed by the first two, so it must be some combination of the two.

![Video 00:05:02: Classroom blackboard writing](</attachments/mit1806-dfa89c69d8c7a6b3ee13ea9a.jpg>)

*Video 00:05:02｜Approximately corresponding to section 2 "2. Linear independence: whether there is only one trivial combination".*

![Video 00:10:40: Classroom blackboard writing](</attachments/mit1806-f9fdfe1f1fd0b01ee2a68cc6.jpg>)

*Video 00:10:40｜Approximately corresponding to section 2 "2. Linear independence: whether there is only one trivial combination".*

## 3. Determination method: Arrange the vectors into a matrix

The third example above already hints at the method of judgment - vertically arranging the vectors into a matrix. Set  $\boldsymbol{v}_1,\dots,\boldsymbol{v}_n$  is  $m$  vectors in a dimensional space, arrange them as columns  $m\times n$  matrix



$$
A=\begin{bmatrix}\boldsymbol{v}_1&\boldsymbol{v}_2&\cdots&\boldsymbol{v}_n\end{bmatrix}.
$$



combination  $c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n$  exactly equal to the product  $A\boldsymbol{c}$, among which  $\boldsymbol{c}$  is a column vector with these coefficients as components. So the definition can be translated unchanged into a sentence about null space:



$$
\boldsymbol{v}_1,\dots,\boldsymbol{v}_n\ \text{线性无关}\iff N(A)=\{\boldsymbol{0}\}.
$$



Relevant means  $N(A)$  There are non-zero vectors in. Each non-zero vector in the null space is a recipe for "how to use these columns to make zeros". It does not answer "which column is redundant", but records exactly how these columns depend on each other.

here  $m$  is the dimension of the space where the vector is located, $n$  is the number of vectors, and the two can be very different. $m>n$  When these vectors are not enough to span the entire  $\mathbb{R}^m$, but they may still be unrelated -$\mathbb{R}^3$  This is the case with the two disproportionate vectors. How exactly depends on the specific values; $m<n$  When you immediately fall back to the conclusion of Section 1, it must be relevant. The judgment falls uniformly on  $N(A)$  Above: $n\le m$  When it may contain only zero vectors, $n>m$  When it must hold a non-zero vector.

Replaced in terms of rank. When irrelevant, each column is **Pivot column** (pivot column), there is no free column, so  $r=n$, at this time it is inevitable  $n\le m$. is relevant when there is at least one free variable, $r<n$. The meaning of the free column is "this column can be combined with the previous pivot column": it fails to establish a pivot in its position during elimination, indicating that it fails to provide a new direction. The so-called relevant columns are these "redundant" columns.

In particular, when the number of vectors is equal to the space dimension, the matrix is a square matrix, then



$$
\text{各列线性无关}\iff A\ \text{可逆}\iff r=n .
$$



This equivalence relationship is the main tool for later judging "whether it is a basis".

![Video 00:15:06: Classroom blackboard writing](</attachments/mit1806-85dd452a90eca0217aef534d.jpg>)

*Video 00:15:06 \| Approximately corresponding to Section 3 "3. Judgment method: Arrange vectors into matrices".*

## 4. Zhang Cheng and basis: a set of vectors with neither more nor less

The set of all linear combinations of a set of vectors is called their **Zhang Cheng** (span). If space  $S$  It happens to be composed of these combinations, it is said that this set of vectors spans  $S$. This statement is not new: put  $A$  Take out each column of and do all the combinations, and you will get  $C(A)$, so"$A$ "Columns spread into column space" is just another way of saying the same thing.

Zhang Cheng also has a "minimal" portrayal. Set  $S$  is the span of a certain set of vectors, then  $S$  itself is a subspace containing this set of vectors; conversely, any subspace containing this set of vectors must be closed to all its linear combinations, so the entire  $S$  included. So the span is the smallest subspace that contains this set of vectors. Compressing "take all combinations and put them into one space" into one word is span.

Now combine irrelevant and Zhang Cheng. space  $S$  a group of **base** (basis) is a sequence of vectors  $\boldsymbol{v}_1,\dots,\boldsymbol{v}_d$, satisfying two conditions: first, they are linearly independent; second, they span  $S$.

Two pipes, one for each end. The first one ensures that there are no redundant vectors: if one of them is removed, the remaining vectors can still form a  $S$, then the removed one is the combination of the remaining vectors, which is inconsistent with irrelevance. The second guarantee is that nothing is omitted. In the simplest terms, the number of basis vectors is "just right" - one less will not be enough, and one more will be relevant.

A set of basis makes the space clear: if you know the basis, you can get every vector in the space by going through the combination, and there is no need to add anything else to describe this space. Therefore, whenever we encounter a subspace from now on, "Give me a set of basis" is the most standard way to ask, and it is also a recurring question type in homework, tests and exams.

Irrelevance and Zhang Cheng are two independent problems. A set of vectors can have four situations in a certain space. It is irrelevant and constrained, it is the basis. This is the best situation. Zhang Cheng is related, indicating that there are too many vectors: for example, the one in Section 7  $3\times4$  The four columns of the matrix are spread out into column space, but there are extra columns that are not used. Irrelevant but not conspicuous, it means that there is less: Section 5  $(1,1,2)$  with  $(2,2,5)$  Yes  $\mathbb{R}^3$  That's it. Neither unrelated nor spanned, then this set of vectors does not fit the space. Ji happens to be the one chosen from the four situations.

![Official Handout Summary Page 2/3](</attachments/mit1806-a270ed635b29ba49ea2ad90f.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 9 Summary, CC BY-NC-SA 4.0).*

## 5. Example: $\mathbb{R}^3$  There is more than one group of bases

Let’s look at the most familiar group first. $\mathbb{R}^3$  The standard base is



$$
\boldsymbol{e}_1=\begin{bmatrix}1\\0\\0\end{bmatrix},\qquad
\boldsymbol{e}_2=\begin{bmatrix}0\\1\\0\end{bmatrix},\qquad
\boldsymbol{e}_3=\begin{bmatrix}0\\0\\1\end{bmatrix},
$$



That is, the directions of the three coordinate axes. The irrelevance is evident at a glance: $c_1\boldsymbol{e}_1+c_2\boldsymbol{e}_2+c_3\boldsymbol{e}_3=(c_1,c_2,c_3)$, to make it equal to zero only the three coefficients must be all zero. In matrix language, the matrix arranged by these three vectors is the identity matrix  $I$, while  $N(I)=\{\boldsymbol{0}\}$. They are spread out  $\mathbb{R}^3$, because any  $(x,y,z)$  All equal to  $x\boldsymbol{e}_1+y\boldsymbol{e}_2+z\boldsymbol{e}_3$. This set of vectors is called **Standard base**(standard basis).

But there is much more to Key than this group. take



$$
\boldsymbol{v}_1=\begin{bmatrix}1\\1\\2\end{bmatrix},\qquad
\boldsymbol{v}_2=\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



The two are not proportional, so they are irrelevant. They are spread out  $\mathbb{R}^3$ ? No. Their combination looks like



$$
a\begin{bmatrix}1\\1\\2\end{bmatrix}+b\begin{bmatrix}2\\2\\5\end{bmatrix}
=\begin{bmatrix}a+2b\\ a+2b\\ 2a+5b\end{bmatrix},
$$



The first and second components are always equal, so like  $(1,0,0)$  Such vectors cannot be combined at all. The span of these two vectors is  $\mathbb{R}^3$  Zhongyou  $x_1=x_2$  The defined plane passing through the origin.

This plane also has its own basis, and it is these two vectors: they are unrelated, and they form this plane. It can be seen that "is a basis" is always relative to a certain space. The same set of vectors can be the basis of a small space, but not the basis of a large space. $\boldsymbol{v}_1,\boldsymbol{v}_2$  can't do  $\mathbb{R}^3$  What is missing is not irrelevance, but Zhang Cheng.

Now add the third vector. If added  $(3,3,7)$, that's a bad choice, because



$$
\begin{bmatrix}3\\3\\7\end{bmatrix}
=\begin{bmatrix}1\\1\\2\end{bmatrix}+\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



It brings no new directions, the three vectors still just span the plane and become related: $\boldsymbol{v}_1+\boldsymbol{v}_2-\boldsymbol{v}_3=\boldsymbol{0}$. The Zhangcheng has not become larger, but its irrelevance has been lost, so it is not even the basis of this plane.

The third vector must not be in this plane, that is, the first two components cannot be equal. Just make it up  $(3,3,8)$, it does not look like the sum of the first two, but its first two components are still equal and still fall on the same plane; in fact



$$
\begin{bmatrix}3\\3\\8\end{bmatrix}
=-\begin{bmatrix}1\\1\\2\end{bmatrix}+2\begin{bmatrix}2\\2\\5\end{bmatrix},
$$



The three vectors are still related. If the third vector is written casually as  $(5,7,-14)$, it is impossible to judge just by looking at the numbers. It can be seen that judging whether a set of vectors is a basis cannot rely on "does it look like a combination". You can only arrange the vectors into a matrix and perform elimination to see if there are any free variables.

Yes  $\mathbb{R}^n$  in  $n$  vectors, there is a simpler version of this sentence: arrange them as columns  $n\times n$  matrices, they are  $\mathbb{R}^n$  The basis of is if and only if this matrix **invertible** (invertible). Reversible means  $n$  There is a pivot and no free columns, so  $n$  The columns are both unrelated and span the entire  $\mathbb{R}^n$.

From this point of view, $\mathbb{R}^3$  There are too many bases to count: just write any reversible one  $3\times3$  A matrix, its three columns are a set of basis. What really doesn't change with the basis is not the vectors, but their number.

![Video 00:32:43: Classroom blackboard writing](</attachments/mit1806-c9a0299c484b776f57f77867.jpg>)

*Video 00:32:43｜Approximately corresponding to Section 5 "5. Example: $\mathbb{R}^3$  There are more than one group of bases nearby.*

## 6. Dimension: The number of vectors of all bases is the same

$\mathbb{R}^3$  There are so many groups, what do they have in common? Yes, and the most crucial thing is: they contain the same number of vectors. this is not  $\mathbb{R}^3$  special phenomenon.

given a space  $S$——It can be  $\mathbb{R}^n$, can be the column space or null space of a certain matrix, or other subspaces - each group of its bases contains the same number of vectors. If a group of bases has  $6$  vector, then any other basis also has  $6$  of: $7$  There are too many and they must be related; $5$  One is not enough and Zhang cannot succeed. This common number is called  $S$  of **dimension** (dimension), recorded as  $\dim S$.

This is not obvious: there are infinitely many basis groups in a space, why do they have the same number of vectors? But it does hold true, and it is by relying on it that the word "dimension" can be defined - otherwise we can only say "how many vectors are there in a certain set of basis", but not "how many dimensions does this space have". Dimension is therefore not the number of vectors that happen to be in a certain basis, but an intrinsic property of the space. $\dim\mathbb{R}^3=3$, $\dim\mathbb{R}^n=n$, the dimension of the plane in Section 5 is  $2$.

Once the dimensions are known, the judgment base saves half the work. if known  $\dim S=d$, have on hand  $d$  a  $S$  vectors in and they are linearly independent, then they are automatically  $S$  The basis is no longer necessary to verify Zhang Cheng. Reason: If they fail  $S$, $S$  There is a vector in  $\boldsymbol{w}$  Not in their Zhangcheng, put  $\boldsymbol{w}$  Just add it and you'll get it  $d+1$  an irrelevant vector; but this  $d+1$  vectors all fall into  $S$ , they form  $S$  one of  $d+1$  dimensional subspace, and  $\dim S=d$  Contradiction. So "the number is irrelevant to +" is enough; conversely, $S$  over in  $d$  vectors must be related.

Back to matrices, two dimension formulas are the core conclusions of this lecture:



$$
\dim C(A)=r,\qquad \dim N(A)=n-r .
$$



Article 1: The pivot column constitutes a set of bases of the column space, and the number of pivot columns is the rank.  $r$, so **Rank is equal to the dimension of the column space**. Article 2: Each free variable is taken once  $1$, the rest  $0$", a special solution is obtained. These special solutions form the basis of the null space, and the number is exactly the number of free variables.  $n-r$.

At the same time, the words should be distinguished. Rank is a property of a matrix, dimensionality is a property of a space: we say "matrix  $A$ "rank", don't talk about "dimension of matrix"; talk about "subspace" $S$ "The dimension", not "the rank of the subspace". "$A$  The rank is equal to  $C(A)$  The phrase "the number of dimensions" is meaningful precisely because it links the value of a matrix to the size of its corresponding space.

![Video 00:38:41: Classroom blackboard writing](</attachments/mit1806-ce3e94a4c5ce3d58a5106ff1.jpg>)

*Video 00:38:41 \| Approximately corresponding to Section 6 "6. Dimension: the number of vectors of all bases is the same".*

![Video 00:40:16: Classroom blackboard writing](</attachments/mit1806-73e890cfb1c86a9d0569fcc3.jpg>)

*Video 00:40:16 \| Approximately corresponding to Section 6 "6. Dimension: the number of vectors of all bases is the same".*

## 7. one  $3\times 4$  Calculation example

Use a specific matrix to go through the two sets of calculations:



$$
A=\begin{bmatrix}1&2&3&1\\1&1&2&1\\1&2&3&1\end{bmatrix}.
$$



The four columns are  $\boldsymbol{c}_1=(1,1,1)$, $\boldsymbol{c}_2=(2,1,2)$, $\boldsymbol{c}_3=(3,2,3)$, $\boldsymbol{c}_4=(1,1,1)$.

These four columns form a column space, which is by definition; but are they bases? no. The third column is the sum of the first two columns, $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$;The fourth column is exactly the same as the first column, $\boldsymbol{c}_4=\boldsymbol{c}_1$. written as a combination,



$$
-\boldsymbol{c}_1-\boldsymbol{c}_2+\boldsymbol{c}_3=\boldsymbol{0},
\qquad
-\boldsymbol{c}_1+\boldsymbol{c}_4=\boldsymbol{0},
$$



So  $(-1,-1,1,0)$  with  $(-1,0,0,1)$  All in null space, the four columns are related.

Use elimination to confirm rank. The second line minus the first line, the third line minus the first line:



$$
A\to\begin{bmatrix}1&2&3&1\\0&-1&-1&0\\0&0&0&0\end{bmatrix}.
$$



The pivot is  $1$  with  $-1$, falls into the first  $1$, $2$  Column; No.  $3$, $4$  Column is a free column, $x_3,x_4$  is a free variable. rank  $r=2$.

The most natural basis for a column space is the two pivot columns



$$
\left\{\begin{bmatrix}1\\1\\1\end{bmatrix},\ \begin{bmatrix}2\\1\\2\end{bmatrix}\right\}.
$$



But the basis is not unique: $\{\boldsymbol{c}_1,\boldsymbol{c}_3\}$, $\{\boldsymbol{c}_2,\boldsymbol{c}_3\}$, $\{\boldsymbol{c}_2,\boldsymbol{c}_4\}$  All is OK. You can even use the original columns completely. For example



$$
\begin{bmatrix}2\\2\\2\end{bmatrix}=2\boldsymbol{c}_1,\qquad
\begin{bmatrix}6\\4\\6\end{bmatrix}=2\boldsymbol{c}_1+2\boldsymbol{c}_2
$$



Both are in the column space, and they are not proportional and therefore unrelated; since  $\dim C(A)=2$, the number is just right and irrelevant, they are automatically a set of bases of the column space, and there is no need to check the generality. Add all four columns to get  $(7,5,7)$, which also falls within the column space.

Then count the null space. The above system of equations is actually



$$
x_1+2x_2+3x_3+x_4=0,\qquad -x_2-x_3=0 .
$$



take  $x_3=1,x_4=0$: From the second formula  $x_2=-1$, and then from the first formula  $x_1=-2x_2-3x_3-x_4=2-3-0=-1$, got  $(-1,-1,1,0)$. take  $x_3=0,x_4=1$: got  $x_2=0$, $x_1=0-0-1=-1$, that is  $(-1,0,0,1)$. These two vectors are unrelated, and every vector in the null space is a combination of them, so they form a set of basis of the null space, $\dim N(A)=2$. Looking back, the first vector repeats exactly  $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$, the second retelling is exactly  $\boldsymbol{c}_4=\boldsymbol{c}_1$: The basis of a null space is a list that itemizes the dependencies between these columns.

Finally check the dimension formula. here  $n=4$, $r=2$,



$$
\dim C(A)=r=2,\qquad \dim N(A)=n-r=4-2=2 .
$$



The rank connects the dimensions of the two spaces: there are several pivot columns, and the column space has several dimensions; each remaining column corresponds to a free variable, which contributes one dimension of the null space.

![Video 00:45:18: Classroom blackboard writing](</attachments/mit1806-2ef85a77b7fce1a1e4d0fc8c.jpg>)

*Video 00:45:18｜Approximately corresponding to Section 7 "7. A  $3\times 4$ "near the calculation example".*

![Official Handout Summary Page 3/3](</attachments/mit1806-d00b687d44bdfa926d4584ad.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 9 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- If  $m<n$, that is, there are more unknowns than equations, and after elimination, the number of main components is at most  $m$ , the free variables are at least  $n-m$  one, so  $A\boldsymbol{x}=\boldsymbol{0}$  There must be a non-zero solution.
- a set of vectors **linearly independent**, refers to  $c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n=\boldsymbol{0}$  There is only one solution with all zero coefficients; otherwise it is called **linearly dependent**, the set of coefficients that are not all zero illustrates how they represent each other.
- Any set of vectors containing zero vectors must be related; $\boldsymbol{v}$  with  $2\boldsymbol{v}$  must be related; three vectors on the plane must be related, because  $2\times3$  The matrix must have free variables.
- Arrange vectors in columns  $A$, then it is irrelevant and equivalent to  $N(A)=\{\boldsymbol{0}\}$, equivalent to  $r=n$, there are no free columns; the square matrix case is equivalent to reversibility.
- **Zhang Cheng** is the set of all combinations of a set of vectors, which is the smallest subspace containing this set of vectors; **base** It is a set of vectors that are both unrelated and span the space, "no more, no less".
- The basis is not unique, but each group of basis in the same space contains the same number of vectors, and this number is the number of vectors in the space. **dimension**.$\dim\mathbb{R}^n=n$, the dimension of the plane is  $2$.
- known  $\dim S=d$  when, $S$  in  $d$  Independent vectors automatically form a basis; this is a shortcut for "the number of pairs + is irrelevant".
- Two core formulas: $\dim C(A)=r$($r$  is the number of columns for the main element), $\dim N(A)=n-r$ (Number of free variables). The rank belongs to the matrix and the dimension belongs to the space.
- The four columns of the calculation example  $\boldsymbol{c}_1=(1,1,1)$, $\boldsymbol{c}_2=(2,1,2)$, $\boldsymbol{c}_3=(3,2,3)$, $\boldsymbol{c}_4=(1,1,1)$, among which  $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$, $\boldsymbol{c}_4=\boldsymbol{c}_1$, so  $r=2$; $\{\boldsymbol{c}_1,\boldsymbol{c}_2\}$  or  $\{(2,2,2)^{\mathsf T},(6,4,6)^{\mathsf T}\}$  are all bases of column spaces, and the basis of null space is  $(-1,-1,1,0)$  with  $(-1,0,0,1)$, both dimensions are  $2$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| linearly independent | linearly independent | Only all zero coefficients can make the combination into a zero vector |
| linearly dependent | linearly dependent | The existence of coefficients that are not all zero makes the combination a zero vector |
| trivial combination | Ordinary combination | A combination in which all coefficients take zero always gives a zero vector |
| span | Zhang Cheng | The set of all linear combinations of a set of vectors is the smallest subspace containing them |
| basis | base | A set of vectors that are both linearly independent and span the space |
| standard basis | Standard base | $\mathbb{R}^n$  Unit vectors along each coordinate axis in  $\boldsymbol{e}_1,\dots,\boldsymbol{e}_n$ |
| dimension | dimension | The number of vectors in any basis of the space |
| rank | rank | The number of pivot columns of a matrix is equal to the dimension of the column space |
| free variable | free variable | Corresponding to the free column, variables that can take any value, the number is  $n-r$ |
| pivot column | Pivot column | A column containing a pivot. The pivot column constitutes a set of bases of the column space. |
| column space | column space | The subspace composed of all linear combinations of each column |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  All vectors of |
| invertible | invertible | A square matrix has an inverse matrix; for  $n$  vectors constitute  $\mathbb{R}^n$ 's base" |

---

[← Lecture 8](/en/notes/mit-1806/lec08) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 10 →](/en/notes/mit-1806/lec10)
