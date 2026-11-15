---
kind: notes
source: mit-1806/lec10
title: Lecture 10 · Four basic subspaces
description: Master the four basic subspaces and their dimensional
  relationships, and establish a spatial map of the entire course.
sourceHash: 38f7f47ecdaa90eb1a15d7a4e0bc2346ca9fcf050c47b96cf958af247270a398
publish: true
translationMethod: machine-assisted
---

> *The four fundamental subspaces* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 10 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p10 · Four basic subspaces](https://www.bilibili.com/video/BV1ix411f7Yp?p=10)(49:26)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-10-the-four-fundamental-subspaces/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=10&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The previous lecture described "basis" and "dimension" as two things that support each other: the basis of a space is not unique, but each group of basis contains the same number of vectors. In order to match this abstract conclusion with a concrete image, at that time  $\mathbb{R}^3$  Use two vectors to form a two-dimensional plane, and then add a candidate  $(3,3,8)$. In the previous lecture, we have used column combinations to see that this candidate is actually equal to  $-\boldsymbol{v}_1+2\boldsymbol{v}_2$, still in that plane. This lecture explains the same thing from another angle: you do not need to guess the combination coefficient first, just look at the rows of the matrix - arrange the three vectors as columns into a square matrix. The first two rows of it are exactly the same. The square matrix is ​​therefore irreversible and the three columns must be related. When rows go wrong, columns suffer; this phenomenon of "rows and columns interfering with each other" is the theme of this lecture.

one  $m\times n$  A matrix comes with more than two subspaces. In addition to the already familiar column space and null space, there are also row space and left null space. These four spaces are separated  $\mathbb{R}^n$  with  $\mathbb{R}^m$  On both sides, each has its own basis and dimension: the dimensions of column space and row space are both  $r$, the null space is  $n-r$, the left null space is  $m-r$. By clarifying these four numbers at once, half of the linear algebra about matrices will be clear: which vectors can be written as  $A\boldsymbol{x}$, which vectors satisfy  $A\boldsymbol{x}=\boldsymbol{0}$, how the relationship between rows limits the relationship between columns is translated into the addition of dimensions.

At the end of this lecture, the concept of "vector" itself is relaxed: $3\times3$  The entire matrix also constitutes a vector space, and the matrix is a vector. Once this is accepted, words such as irrelevance, span, basis, and dimension are no longer exclusive to  $\mathbb{R}^n$, and can be used to measure any object that can be added or multiplied.

![Official Handout Summary Page 1/3](</attachments/mit1806-eeda4ffa18a930c1a55381b2.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 10 Summary, CC BY-NC-SA 4.0).*

## 1. Look at columns from rows: If rows are related, columns are related.

I wanted to explain in the previous lecture  $\mathbb{R}^3$  The basis is not unique. Standard base  $\boldsymbol{e}_1,\boldsymbol{e}_2,\boldsymbol{e}_3$  is the most familiar group, but far from the only one: take any reversible  $3\times3$  A matrix whose three columns are all bases. In order to put this sentence into practice, we first took two vectors



$$
\boldsymbol{v}_1=\begin{bmatrix}1\\1\\2\end{bmatrix},\qquad
\boldsymbol{v}_2=\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



The two are not proportional, so they are linearly unrelated; but their combination looks like  $(a+2b,\ a+2b,\ 2a+5b)$, the first two components are always equal, so they span just  $\mathbb{R}^3$  Zhongyou  $x_1=x_2$  determined two-dimensional plane. To make it whole  $\mathbb{R}^3$  basis, the third vector must jump out of this plane. Try first  $(3,3,7)$, which happens to be  $\boldsymbol{v}_1+\boldsymbol{v}_2$, obviously not working; try again  $(3,3,8)$, looks disproportionate to the first two, but its first two components are still equal and still lie in that plane.

Students' judgment methods are less laborious and more valuable. Arrange three vectors as columns into a matrix:



$$
A=\begin{bmatrix}
1&2&3\\
1&2&3\\
2&5&8
\end{bmatrix}.
$$



The first row of this matrix is exactly the same as the second row. The correlation of the rows is immediately obvious - the first row minus the second row gives us zero rows - so the square matrix is ​​irreversible and its three columns must be linearly related. Write out the combination to verify:



$$
\begin{bmatrix}3\\3\\8\end{bmatrix}
=-\begin{bmatrix}1\\1\\2\end{bmatrix}
+2\begin{bmatrix}2\\2\\5\end{bmatrix}.
$$



The coefficients are  $-1$  with  $2$. So  $(3,3,8)$  No new direction is brought, and the three vectors combined only form the two-dimensional plane.

This chain of reasoning is worth remembering: **Relationships between rows constrain relationships between columns**. The first two components of each column are equal, which geometrically means that all three columns fall in the plane  $x_1=x_2$  Within; on the matrix, it means that the first two rows are the same; the conclusion is that the rows are correlated, the square matrix is singular, and the columns are correlated. Three roads lead to the same fact: rank only  $2$, only two of the three column vectors are independent.

This also brings out a methodology. To judge whether a set of vectors can be used as a basis, you cannot see whether they "look" independent of each other. You can only arrange the vectors into a matrix for elimination: the presence of free variables indicates column correlation. The situation of the square matrix is ​​particularly simple - if the rows are correlated, they are irreversible, and if they are irreversible, the columns must be correlated. And "all combinations of rows" itself is a subspace. It had no name before, but it is hidden behind this candidate: precisely because the row space has only two dimensions, the column space can only have two dimensions.

![Video 00:04:57: Classroom blackboard writing](</attachments/mit1806-c42919c9f463aea78add32b5.jpg>)

*Video 00:04:57｜Approximately corresponding to Section 1 "1. Look at columns from rows: If rows are related, columns are related."*

## 2. Four basic subspaces

Set  $A$  is  $m\times n$  matrix. There are four subspaces accompanying it, all of which are represented by  $A$  This matrix determines it, so it is collectively called **four fundamental subspaces**(four fundamental subspaces).

**column space**(column space)$C(A)$, that is  $A$  All linear combinations of the columns of can also be said to have the overall shape of  $A\boldsymbol{x}$  vector. it's in  $\mathbb{R}^m$  in, because  $A$  Each column of has  $m$  weight.

**null space**(nullspace)$N(A)$, that is, the equation  $A\boldsymbol{x}=\boldsymbol{0}$  all solutions. it's in  $\mathbb{R}^n$ , because the solution vector has  $n$  weight.

**row space** (row space), that is  $A$  All linear combinations of rows. it's in  $\mathbb{R}^n$ , because each row has  $n$  weight. Line spaces are conventionally written as  $C(A^{\mathsf T})$: put  $A$  Transpose (transpose), the rows lying horizontally are turned into columns, and the row space is exactly  $A^{\mathsf T}$  column space. This step does not change any mathematical content, it just makes all vectors written in columns and the notation is unified.

**left null space**(left nullspace)$N(A^{\mathsf T})$, that is, it satisfies  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  vector of  $\boldsymbol{y}$. it's in  $\mathbb{R}^m$  in.

The fourth name requires explanation. put  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  Transpose both sides, and the transpose of the product requires exchanging the order, and we get



$$
\boldsymbol{y}^{\mathsf T}A=\boldsymbol{0}^{\mathsf T}.
$$



The left hand side is now a row vector  $\boldsymbol{y}^{\mathsf T}$, from **left side** multiply  $A$. This is the origin of "left null space": it is those spaces that can be used from the left  $A$  Multiply a vector into zero rows. still define  $\boldsymbol{y}$  To write a column vector, use  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  Describe this space.

Four spaces separate two worlds. $\mathbb{R}^n$  There are row space and null space in it, and the vectors are  $n$  weight; $\mathbb{R}^m$  Column space and left null space live in it, and the vectors are  $m$  weight. When  $m\neq n$  At this time, the two sets of spaces simply cannot be drawn into the same picture. If drawn as a schematic diagram, it would be represented by a circle on the left  $\mathbb{R}^n$, the circle contains line space and null space, and the circle on the right represents  $\mathbb{R}^m$, the circle contains column space and left null space. Once the positions and sizes of the four spaces are determined, the information structure of the matrix is ​​also determined: which right-hand vectors have solutions, how many degrees of freedom the solutions have, and how much redundancy there is between rows are all answered by them. Next, we need to answer two questions for each space: How to create the base? What are the dimensions? The former question is constructive and has a long answer; the latter is just a number and has a short answer.

![Video 00:10:52: Classroom blackboard writing](</attachments/mit1806-b617f8969b3ee599f8efb1de.jpg>)

*Video 00:10:52 \| Approximately corresponding to section 2 "2. Four basic subspaces".*

![Video 00:14:50: Classroom blackboard writing](</attachments/mit1806-9141ce6e480a3186d836dbf7.jpg>)

*Video 00:14:50 \| Approximately corresponding to section 2 "2. Four basic subspaces".*

## 3. Four dimensions: $r$, $r$, $n-r$, $m-r$

Publish the answer first. Set  $A$  is  $m\times n$  Matrix, rank is  $r$, then



$$
\dim C(A)=r,\qquad
\dim C(A^{\mathsf T})=r,\qquad
\dim N(A)=n-r,\qquad
\dim N(A^{\mathsf T})=m-r.
$$



Each of the four has its own reasons, let’s talk about them one by one.

**column space.**  During the elimination process, the column where the pivot is located is called the pivot column. Note that the pivot column is  $A$  Column of , not after simplification  $R$  column, which is the most confusing. shared by pivot  $r$ , so the pivot column has a total of  $r$ ; the linear relationship between columns remains unchanged under row transformation, so these pivot columns are irrelevant, and the remaining columns can be written as their combinations, so the pivot column composition  $C(A)$  a set of basis, $\dim C(A)=r$. This is exactly "the rank is equal to the dimension of the column space".

**null space.**  Already calculated in the previous lecture. For each free variable, let it take in the solution  $1$, the remaining free variables are  $0$, then go back and find the main variable, and get a **special solution** (special solution). The free variables are  $n-r$ , there is a special solution  $n-r$ , they form a set of basis of the null space, so  $\dim N(A)=n-r$.

**line space.**  Its dimensions are also  $r$. This is the most important thing to remember in this lecture: the dimensions of row space and column space are equal, and both are equal to rank. The proof will be placed in the next section, but we will use it here to resolve the remaining issues from the previous lecture. that  $3\times3$  The rank of the matrix cannot be seen clearly by column, but it is clear by row: the first and second rows are the same, and the third row  $(2,5,8)$  Not proportional to the first two rows, so the row space is two-dimensional, with rank  $2$; Since "the dimensions of row space and column space are equal", column space is also two-dimensional, and only two of the three columns are independent.

**null space left.**  put  $A^{\mathsf T}$  Viewed as a new matrix: it is  $n\times m$  Yes, there is  $m$  columns. $A^{\mathsf T}$  The rank is also  $r$, because  $A^{\mathsf T}$  The column space is  $A$  row space, whose dimension is  $r$ (Proof in next section). Applying the formula for null space, "number of columns minus rank" gives  $m-r$, which is the dimension of the left null space.

When the four formulas are arranged together, two beautiful pairings appear:



$$
r+(n-r)=n,\qquad r+(m-r)=m .
$$



$\mathbb{R}^n$  The sum of the two subspace dimensions in  $n$, $\mathbb{R}^m$  Adding two of them gives  $m$. This is actually restating a simpler fact: $A$  Yes  $n$  variables, among which  $r$  is the main variable, $n-r$  is a free variable; $A^{\mathsf T}$  Yes  $m$  variables, among which  $r$  is the main variable, $m-r$  are free variables. Another corollary is equally useful: the four dimensions depend only on  $m$, $n$  with  $r$, so the dimensions of the four subspaces of matrices with the same shape and rank are exactly the same, regardless of the specific numbers filled in the matrix.

## 4. The basis of the row space: the front of the simplest form of the row  $r$  OK

To create a foundation for row space, the stupidest way is to  $A$  Transpose, yes  $A^{\mathsf T}$  Do the elimination again and take its pivot column. A better approach is to reuse eliminations that have already been done for the following reasons: **Row transformation does not change row space**.

This sentence needs to be explained. Each step of elimination replaces a row with "itself minus a multiple of another row". The new row is a combination of the original rows and is therefore still in the original row space; conversely, this step can be undone, and the original row is also a combination of new rows. Therefore, the row spaces of the two matrices before and after simplification are exactly the same. In contrast, the column space will change. Take the previous lecture  $3\times4$  matrix



$$
A=\begin{bmatrix}1&2&3&1\\1&1&2&1\\1&2&3&1\end{bmatrix},
$$



Its first column is  $(1,1,1)$, of course it belongs to  $C(A)$; and after elimination, the third component of any column is  $0$, $(1,1,1)$  It no longer belongs to the column space. So the column space must be returned to its original  $A$  To get the pivot column, the row space can directly use the simplified matrix.

Now finish this elimination. The second line minus the first line, the third line minus the first line:



$$
A\longrightarrow
\begin{bmatrix}1&2&3&1\\0&-1&-1&0\\0&0&0&0\end{bmatrix}.
$$



Second line multiplies  $-1$, and then use it to eliminate the  $2$:



$$
\longrightarrow
\begin{bmatrix}1&0&1&1\\0&1&1&0\\0&0&0&0\end{bmatrix}=R .
$$



this is  $A$  of **row simplest form** (row reduced echelon form). Its first two rows are the pivot rows, the third row is the zero row, and the pivot is at the  $1$, $2$  column, so  $r=2$.$R$  before  $r=2$  rows, i.e. two vectors



$$
\begin{bmatrix}1\\0\\1\\1\end{bmatrix},\qquad
\begin{bmatrix}0\\1\\1\\0\end{bmatrix},
$$



That’s it  $A$  A set of basis for the row space of .

Why them? Check three things: in line space, irrelevant, and complete. The first two are easy. they are  $R$  line, naturally belongs to  $R$  row space, that is, belongs to  $A$  row space; they are each taken at a position  $1$, take it from another position  $0$, is clearly disproportionate and therefore irrelevant. The third thing is to work backwards: undo the steps of elimination one by one, $A$  Each line of can be written as  $R$  The combination of rows, so  $A$  The row space is contained by the space spanned by these two rows. When the three conditions are met, they are the basis. The dimensions are then determined to be  $r$: $r$  a main element, $r$  non-zero rows, $r$  basis vectors, which also complements the previous section  $\dim C(A^{\mathsf T})=r$  proof.

It should be noted that the basis is  $R$  before  $r$  OK, no  $A$  before  $r$  OK. In this example  $A$  The first two lines of are also irrelevant, but in general  $A$  The non-zero lines may be related to each other, and copying them will cause errors; $R$  Each row is separated from other rows at the pivot position, which is the cleanest version. During the whole process, only the selection of the basis changed, and the space itself remained unchanged. Borrowing the analogy from the lecture notes: the columns of the identity matrix are  $\mathbb{R}^n$  The cleanest base, $R$  before  $r$  Row is the cleanest basis for row space.

![Official Handout Summary Page 2/3](</attachments/mit1806-22ba5c148d7c2992d7298c12.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 10 Summary, CC BY-NC-SA 4.0).*

![Video 00:25:44: Classroom blackboard writing](</attachments/mit1806-4f757f8484ab20c9db5ad73c.jpg>)

*Video 00:25:44｜Approximately corresponding to Section 4 "4. The basis of the row space: the front of the simplest form of the row  $r$ "OK" nearby.*

![Video 00:32:08: Classroom blackboard writing](</attachments/mit1806-bac9da30fab5a8230e502bb0.jpg>)

*Video 00:32:08｜Approximately corresponding to Section 4 "4. The basis of the row space: the front of the simplest form of the row  $r$ "OK" nearby.*

## 5. Left null space: from  $E$  middle reading base

The basis of the fourth space cannot be derived from the same as the first three  $R$  read directly. $R$  with  $A$  has the same null space, but the left null space is  $A^{\mathsf T}$  The null space of $R$  I didn't put it before my eyes. To get it, you have to eliminate the element **process** Save it.

Gauss-Jordan elimination provides a ready-made solution. put  $A$  with  $m\times m$  The identity matrices are side by side and row transformed together:



$$
\bigl[\,A\ \big|\ I\,\bigr]\longrightarrow\bigl[\,R\ \big|\ E\,\bigr].
$$



Every step done on the left is done simultaneously on the right, so what is recorded on the right is the combined effect of these row transformations. In matrix language, the entire elimination is equivalent to multiplying a matrix on the left; this matrix  $I$  become  $E$, so it is  $E$, and



$$
EA=R .
$$



When the square matrix is reversible  $R=I$, so  $EA=I$, that is  $E=A^{-1}$, which is exactly the approach used before to find the inverse matrix. $A$  There is no inverse matrix when it is a rectangle, but  $E$  still exists, it still logs "from  $A$  Arrive  $R$  What did you do?"

In the example put  $E$  Figure it out. from  $I$  Starting, there are three steps in total: the second row and the third row each subtract the first row; the second row multiplies  $-1$;The first row minus the second row  $2$  times. Calculate step by step:



$$
I\longrightarrow
\begin{bmatrix}1&0&0\\-1&1&0\\-1&0&1\end{bmatrix}
\longrightarrow
\begin{bmatrix}1&0&0\\1&-1&0\\-1&0&1\end{bmatrix}
\longrightarrow
\begin{bmatrix}-1&2&0\\1&-1&0\\-1&0&1\end{bmatrix}=E .
$$



Check  $EA=R$. View by row, $EA$  of the  $i$  OK  $E$  of the  $i$  line with  $A$  The lines of are combined:



$$
(-1)\cdot\text{row}_1+2\cdot\text{row}_2=(1,0,1,1),
$$




$$
1\cdot\text{row}_1-1\cdot\text{row}_2=(0,1,1,0),
$$




$$
(-1)\cdot\text{row}_1+1\cdot\text{row}_3=(0,0,0,0).
$$



The three lines are respectively related to  $R$  The three lines match, $E$  That’s right.

Look again  $E$  The third line of  $(-1,0,1)$. it puts  $A$  The three rows of combine into zero rows, so  $\boldsymbol{y}=(-1,0,1)$  satisfy  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$, which is a vector in left null space. This is no coincidence: $EA=R$  means  $E$  of the  $i$  travel by  $A$  exactly equal to  $R$  of the  $i$  OK; as long as  $R$  A row of is zero row, $E$  The corresponding row is in the left null space. This example  $m-r=3-2=1$, the left null space is one-dimensional, so only this vector constitutes the basis.

The two methods of finding the null space are in contrast here: to find the basis of the null space is to find "the coefficient combination of the column is equal to the zero column"; to find the basis of the left null space is to find "the coefficient combination of the row is equal to the zero row". The first line in this example is exactly the same as the third line. $-1$  Double the first row and add  $1$  The third line is naturally the zero line, so the answer requires almost no calculation.

Check the four answers with examples. $m=3$, $n=4$, $r=2$, so  $\dim C(A)=2$, a group of bases is the pivot column  $(1,1,1)$  with  $(2,1,2)$; $\dim N(A)=4-2=2$, two special solutions can be obtained  $(-1,-1,1,0)$  with  $(-1,0,0,1)$; $\dim C(A^{\mathsf T})=2$, a set of basis is  $(1,0,1,1)$  with  $(0,1,1,0)$; $\dim N(A^{\mathsf T})=3-2=1$, the basis is  $(-1,0,1)$. The two sums match up: $2+2=4=n$, $2+1=3=m$.

![Video 00:39:33: Classroom blackboard writing](</attachments/mit1806-c790a521fb03836bb44b6b1f.jpg>)

*Video 00:39:33｜Approximately corresponding to Section 5 "5. Left null space: from  $E$ "Middle reading base" near.*

![Video 00:40:08: Classroom blackboard writing](</attachments/mit1806-98f505082a06501f0883adf6.jpg>)

*Video 00:40:08｜Approximately corresponding to Section 5 "5. Left null space: from  $E$ "Middle reading base" near.*

## 6. A matrix is also a vector: $3\times3$  matrix space

So far, all vectors are  $\mathbb{R}^n$  or  $\mathbb{R}^m$  number in a column. But the definition of a vector space only requires two things: elements can be added to each other and can be multiplied by a number. Any set that satisfies these two plus several consistency rules can be called a vector space. $3\times3$  The entire matrix meets the requirements: two matrices can be added, a number can be multiplied, a zero matrix acts as a zero element, and the number  $1$  Multiplying does not change the matrix. So there is every reason to say "every  $3\times3$  Matrices are all vectors", all written as  $M$.

Matrix multiplication should be actively ignored here. $M$  Of course the elements in can be multiplied, but vector spaces do not require multiplication, only addition and numerical multiplication: $A+B$, $7A$, $3A-5B$  is meaningful, $AB$  I will not participate in this grammar for the time being. Being able to multiply is an additional fact that has nothing to do with "whether it is a vector space".

$M$  There are many subspaces in it. All upper triangular matrices form one, and all symmetric matrices form one. The intersection of two subspaces is also a subspace: it is both an upper triangle and a symmetric matrix, and everything below the diagonal is  $0$ (upper triangle), and the upper part of the diagonal must be equal to the corresponding element below (symmetry), so the upper part is also  $0$, leaving only the diagonal. So



$$
\{\text{上三角矩阵}\}\cap\{\text{对称矩阵}\}=\{\text{对角矩阵}\}.
$$



The word "smaller" now has a precise meaning: smaller than dimension. Diagonal matrices form subspaces  $D$, its dimension is  $3$, a set of basis is three matrices



$$
\begin{bmatrix}1&0&0\\0&0&0\\0&0&0\end{bmatrix},\qquad
\begin{bmatrix}0&0&0\\0&1&0\\0&0&0\end{bmatrix},\qquad
\begin{bmatrix}0&0&0\\0&0&0\\0&0&7\end{bmatrix}.
$$



The third one is in  $(3,3)$  location taken  $7$  instead of  $1$, as long as it is a non-zero number, it will not affect the result. Irrelevance: If the combination of the three is equal to the zero matrix, then the three elements on the diagonal  $a$, $b$, $7c$  are all zero, so  $a=b=c=0$. Zhang Cheng: Any diagonal matrix  $\operatorname{diag}(a,b,c)$  can be written as



$$
a\begin{bmatrix}1&0&0\\0&0&0\\0&0&0\end{bmatrix}
+b\begin{bmatrix}0&0&0\\0&1&0\\0&0&0\end{bmatrix}
+\frac{c}{7}\begin{bmatrix}0&0&0\\0&0&0\\0&0&7\end{bmatrix}.
$$



Both conditions are met, so  $D$  The dimension of is  $3$. The dimensions of upper triangular matrices and symmetric matrices can also be counted in the same way: write a set of bases each, and then count how many matrices there are in the bases. This matter will be formally discussed in the next lecture. At this point, the meaning of "dimension" becomes clearer: it does not depend on the number of components, but on the number of free parameters in the space; this becomes particularly obvious once the vector itself is replaced by a matrix.

![Official Handout Summary Page 3/3](</attachments/mit1806-b19428ab145ea329c67099ce.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 10 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- Candidate vectors from the previous lecture  $(3,3,8)$  is not independent: it is related to  $(1,1,2)$, $(2,2,5)$  As a matrix with three columns, the first two rows are the same, the square matrix is singular, the three columns are related, and  $(3,3,8)=-(1,1,2)+2(2,2,5)$.
- Row correlation can deduce column correlation: once a square matrix is row-related, it is irreversible, and the columns of an irreversible square matrix must be related; equivalently, the row space and column space have the same dimensions, one is two-dimensional, and the other can only be two-dimensional.
- Four basic subspaces: column space  $C(A)\subset\mathbb{R}^m$, null space  $N(A)\subset\mathbb{R}^n$, row space  $C(A^{\mathsf T})\subset\mathbb{R}^n$, left null space  $N(A^{\mathsf T})\subset\mathbb{R}^m$.
- The "left" of left null space comes from  $\boldsymbol{y}^{\mathsf T}A=\boldsymbol{0}^{\mathsf T}$: where the vector is taken from the left  $A$  Row vector multiplied to zero rows.
- Four dimensions: $\dim C(A)=r$, $\dim C(A^{\mathsf T})=r$, $\dim N(A)=n-r$, $\dim N(A^{\mathsf T})=m-r$;Add the pairs to get  $n$  with  $m$.
- The basis of the column space is  $A$  The pivot column of  $r$ ; the basis of the null space is  $n-r$  a special solution.
- Row transformation preserves the row space and changes the column space; the basis of the row space is  $R$  before  $r$  OK instead  $A$  before  $r$  OK.
- Yes  $[\,A\mid I\,]$  By elimination we get  $[\,R\mid E\,]$, satisfy  $EA=R$; $R$  The zero row corresponds to  $E$  The rows form the basis of the left null space, in the example  $(-1,0,1)$.
- All  $3\times3$  The matrix constitutes a vector space, and the matrix is a vector; the upper triangular matrix and the symmetric matrix are its subspaces. The intersection of the two is a diagonal matrix space, with the dimension  $3$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| four fundamental subspaces | four fundamental subspaces | Column space, null space, row space, left null space |
| column space | column space | $A$  All linear combinations of the columns of  $\mathbb{R}^m$ |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  All vectors of , located in  $\mathbb{R}^n$ |
| row space | row space | $A$  All linear combinations of the rows of  $C(A^{\mathsf T})$, located at  $\mathbb{R}^n$ |
| left nullspace | left null space | satisfy  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  vector, that is, from the left  $A$  vector to multiply to zero rows |
| rank | rank | The number of pivots is the dimension of both column space and row space. |
| pivot column | Pivot column | $A$  The columns containing pivots constitute a set of basis in the column space. |
| special solution | special solution | A free variable takes  $1$, take the rest  $0$  The obtained null space vector forms the basis of the null space |
| row operation | Row transformation | Swap two rows, multiply one row by a nonzero number, and subtract a multiple of the other row from one row; keep row space and null space |
| row reduced echelon form | row simplest form | The completely simplified matrix after elimination  $R$, before  $r$  rows form the basis of the row space |
| Gauss-Jordan elimination | Gauss-Jordan elimination | put  $[A\mid I]$  form  $[R\mid E]$, by  $E$  Read out the basis of left null space |
| upper triangular matrix | upper triangular matrix | The matrix with all zeros below the main diagonal forms a subspace of the matrix space |
| symmetric matrix | symmetric matrix | satisfy  $A^{\mathsf T}=A$  matrix, which constitutes the subspace of the matrix space |
| diagonal matrix | diagonal matrix | A matrix whose only diagonal may be non-zero is of dimension  $3$  subspace of |
| vector space of matrices | matrix vector space | A vector space with matrices as vectors and only addition and multiplication |
| dimension | dimension | The number of vectors in any basis of the space. The dimension of the matrix space is determined by the number of free parameters. |

---

[← Lecture 9](/en/notes/mit-1806/lec09) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 11 →](/en/notes/mit-1806/lec11)
