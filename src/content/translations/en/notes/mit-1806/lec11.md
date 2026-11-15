---
kind: notes
source: mit-1806/lec11
title: Lecture 11 · Matrix spaces, rank-1 matrices, and small-world graphs
description: Think of the matrix itself as a vector space and understand the
  generative power of rank 1 matrices.
sourceHash: 9445db598822354b6b63d1699bdac77ca1f41595960897efaa66e4f4a7272e18
publish: true
translationMethod: machine-assisted
---

> *Matrix spaces; rank 1; small world graphs* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 11 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p11 · Matrix space, rank 1 matrix and small world graph](https://www.bilibili.com/video/BV1ix411f7Yp?p=11)(46:02)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-11-matrix-spaces-rank-1-small-world-graphs/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=11&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lecture, four basic subspaces were used to draw a complete map of the matrix. The dimensions of the four spaces are determined by the rank  $r$  and matrix size  $m,n$  decision. A clue was revealed at the end of that lecture - a "vector" in vector space does not have to be a list of numbers. This lecture explains the matter formally. As long as a set meets two requirements: elements can be added and scalars can be multiplied, and the operation result does not run out of the set, then we can talk about linear combination, basis and dimension. Matrices are ready examples: all  $3\times3$  The matrix forms a nine-dimensional vector space, in which the symmetric matrix and the upper triangular matrix are each a six-dimensional subspace. Functions can also be used as vectors: differential equations  $y''+y=0$  The whole decomposition into a two-dimensional space. It can be seen that the framework of linear algebra captures the structure of "linear combination" and has nothing to do with the shape of the object.

The second clue is rank, and the protagonist is replaced by a rank-one matrix. A matrix of rank 1 can be written as one column by one row, that is  $\boldsymbol{u}\boldsymbol{v}^{\mathsf T}$, simple enough to be fully mastered; it is also the building block of all matrices: the rank is  $r$  The matrix can be split into  $r$  The sum of rank 1 matrices. Following this line can also clarify an error-prone point - "the rank does not exceed  $r$ "matrix" does not constitute a subspace, because addition will increase the rank.

Finally, this lecture uses a  $\mathbb{R}^4$  The specific subspaces in the article go through the four basic subspaces again, and then introduce the language of matrices to the network: draw the relationship between people and friends as nodes and edges, and how many steps it takes between people becomes a problem of distance on the graph. This is the entrance to the application of matrices. The next lecture will use matrices to systematically study graphs.

![Official Handout Summary Page 1/3](</attachments/mit1806-d75c26a02816cb35e17fe80f.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 11 Summary, CC BY-NC-SA 4.0).*

## 1. Bases and dimensions of matrix space: $M$, $S$, $U$

It was confirmed at the end of the previous lecture: $3\times3$  The entire matrix  $M$  A vector space is formed under "addition" and "scalar multiplication", and the entire symmetric matrix  $S$  with the entire upper triangular matrix  $U$  They are all its subspaces, and matrix multiplication does not participate in this structure - it is an additional operation and has nothing to do with "whether it can become a vector space". This point is most easily overlooked when judging subspaces: the addition of two symmetric matrices is still symmetric, so  $S$  is a subspace; whether the multiplication of two symmetric matrices is symmetrical is another question that has nothing to do with subspace.

What we need to do in this lecture is to clearly calculate the dimensions that were not completed in the previous lecture: give the matrix space (matrix space) $M$  and its subspace  $S$, $U$  Find each set of bases and count the number of vectors in the bases. This lecture uses the same set of questions again and again - is this set a subspace? What are the dimensions? What is a set of basis? Switching to new spaces such as matrices and functions, the method of asking questions remains unchanged. The method is also the same as before  $\mathbb{R}^n$  Exactly the same as in: the basis must be linearly independent and span the entire space, and the dimension is the number of vectors in the basis.

$M$  The standard basis of is the nine matrices  $E_{ij}$:Only in the first  $i$  line of work  $j$  List one  $1$, the remaining positions are all  $0$, among which  $i,j=1,2,3$. any matrix  $A=(a_{ij})$  can be uniquely written as



$$
A=\sum_{i=1}^{3}\sum_{j=1}^{3}a_{ij}E_{ij}.
$$



This representation means two things at once: nine  $E_{ij}$  Zhang Cheng  $M$; If the combination is equal to the zero matrix, comparing position by position, you will know that each coefficient is  $0$, so they are linearly independent. So  $\dim M=9$. There is no essential difference between nine numbers arranged in a square matrix and arranged in a row. $M$  with  $\mathbb{R}^9$  The only difference is typesetting; but if you look at the matrix space as an independent object, the subsequent structure will be more natural.

Look again  $S$. How many independent numbers are needed to determine a symmetric matrix? The three elements on the diagonal can be chosen arbitrarily, the three elements above the diagonal can be chosen arbitrarily, and the three elements below the diagonal are uniquely determined by symmetry. Therefore  $\dim S=3+3=6$, a set of basis is



$$
E_{11},\ E_{22},\ E_{33},\quad E_{12}+E_{21},\ E_{13}+E_{31},\ E_{23}+E_{32}.
$$



The non-zero positions of these six matrices do not overlap with each other (three diagonal positions and three pairs of symmetric positions). If their combination is equal to the zero matrix, comparing position by position, it is known that the six coefficients are all zero, so they are linearly independent; conversely, any symmetric matrix can be combined by them, so they span  $S$. Here is a phenomenon worth paying attention to: $M$  The standard base is only  $E_{11},E_{22},E_{33}$  Three are symmetric matrices. If we "screen" the basis of the large space to find out the part that belongs to the subspace, we can only get three members, which is impossible.  $S$  of bases (requires six). The basis of the subspace usually needs to be recombined, $E_{12}+E_{21}$  It is obtained by putting together two standard basis matrices. These two standard basis matrices are both asymmetrical when viewed individually. One is  $(1,2)$  locational  $1$, one is  $(2,1)$  locational  $1$:



$$
E_{12}+E_{21}=\begin{bmatrix}0&1&0\\1&0&0\\0&0&0\end{bmatrix},
$$



After adding them up, a symmetrical pair is obtained.

An upper triangular matrix refers to a matrix in which all zeros below the main diagonal are written as  $U$. The addition of two upper triangular matrices is still upper triangular, so  $U$  It is also a subspace. Determine an upper triangle  $3\times3$  The matrix requires three numbers on the diagonal and three numbers above the diagonal, similarly  $\dim U=6$, a set of basis is



$$
E_{11},\ E_{12},\ E_{13},\ E_{22},\ E_{23},\ E_{33}.
$$



This time, there are exactly six members of Standard Kiri falling under  $U$ , they themselves constitute  $U$  a set of bases. This is an occasional occurrence, not a rule: $S$  As has just been shown, a set of basis for a large space does not automatically provide a basis for a subspace.

![Video 00:04:36: Classroom blackboard writing](</attachments/mit1806-595c021f8078f505388bffdf.jpg>)

*Video 00:04:36｜Approximately corresponding to Section 1 "1. Bases and dimensions of matrix spaces: $M$, $S$, $U$"Nearby.*

![Video 00:11:02: Classroom blackboard writing](</attachments/mit1806-e30f66ea6b52d54df3617c3b.jpg>)

*Video 00:11:02｜Approximately corresponding to Section 1 "1. Bases and dimensions of matrix spaces: $M$, $S$, $U$"Nearby.*

## 2. Intersection, union and sum: how to combine subspaces

With two subspaces, it is natural to ask how they interact. The first combination is intersection  $S\cap U$: A matrix that is both symmetric and upper triangular. The upper triangle condition requires zero below the diagonal, and the symmetry condition requires that above the diagonal is equal to below the diagonal, so it can only be zero above the diagonal. So  $S\cap U$  is exactly the entire diagonal matrix, denoted as  $D$, $\dim D=3$, a set of basis is  $E_{11},E_{22},E_{33}$.

The second combination is a union, but  $S\cup U$  If it’s not subspace, this road won’t work. The reason is the same as two straight lines passing through the origin on the plane: each straight line is a one-dimensional subspace when viewed individually. If the points on the two straight lines are combined, the vector on one line is added to the vector on the other line. The result usually falls outside the two lines, and the addition is not closed. $S$  with  $U$  They are both six-dimensional subspaces, but they have different orientations in the nine-dimensional space. If the two sets are forced into a union, the addition will run out.

Since union is not advisable, let’s take a step back and ask: contains  $S$  with  $U$  What is the smallest subspace of ? The answer is to take all possible sums of the vectors in the two subspaces—in this case, adding a symmetric matrix and an upper triangular matrix. This combination is called **sum of subspaces**(sum):



$$
S+U=\{\,s+u:\ s\in S,\ u\in U\,\}.
$$



It is not "taking  $S$  matrix in or  $U$  matrix in", but "take a symmetric matrix plus an upper triangular matrix". This set is a subspace, and in this case it is large enough to fill the entire  $M$:any  $3\times3$  The matrix can be disassembled in this way - take the three elements below the diagonal  $a_{ij}$($i>j$) together with their mirror images are given to the symmetrical part, and the diagonal of the symmetrical part is taken  $0$;The upper triangular part retains the original diagonal elements, and the first element above the diagonal  $(i,j)$  positions ($i<j$), then take the original matrix  $a_{ij}-a_{ji}$. Adding the two copies just restores the original matrix. Therefore  $\dim(S+U)=9$.

Put the dimensions together: $6+6=3+9$, that is



$$
\dim(S+U)=\dim S+\dim U-\dim(S\cap U).
$$



This equation holds for any two subspaces. The sum of the dimensions of two subspaces is equal to the sum of the intersection dimension and the sum dimension. This is the most natural accounting rule for subspace operations.

![Video 00:13:48: Classroom blackboard writing](</attachments/mit1806-1d107773f9a27e2390af0d8e.jpg>)

*Video 00:13:48 \| Approximately corresponding to Section 2 "2. Intersection, Union, and Sum: How to Combine Subspaces".*

## 3. Functions are also vectors: $y''+y=0$  solution space

The third example comes from differential equations:



$$
\frac{\mathrm{d}^2y}{\mathrm{d}x^2}+y=0.
$$



$y=\cos x$  is a solution because its second derivative is  $-\cos x$; $y=\sin x$  That’s also the solution. Any linear combination of the two



$$
y=c_1\cos x+c_2\sin x
$$



It is still a solution, and this has exhausted all solutions. Treating functions as vectors, addition and multiplication are point-by-point addition and multiplication by constants, so this solution set constitutes a vector space. It is actually a null space: as  $A\boldsymbol{x}=\boldsymbol{0}$  The solution set of is the matrix  $A$  The nullspace of , what is considered here is the differential operator  $\frac{\mathrm{d}^2}{\mathrm{d}x^2}+I$  The null space of - the solution space of a linear differential equation is the same kind of object as the null space of a matrix.

$\cos x$  with  $\sin x$  are linearly independent and span the entire solution space, so they form a set of basis, $\dim=2$. The basis is not unique: $e^{ix}$  with  $e^{-ix}$  is another set of bases. The dimensionality of 2 is consistent with the fact that the equation is a second-order equation—the dimensionality of the solution space is equal to the order of the equation. Finding a general solution to a linear differential equation is essentially to find a set of basis for its solution space. This is the same thing as finding a set of basis for the null space of a matrix and then using it to write out all the solutions.

This also gives an intuitive explanation for the dimension: there are infinite functions in the solution space, but only two basis functions are needed, and the rest are all combinations of them. Dimension measures not how many solutions there are, but how many degrees of freedom the solutions have, which is exactly 2 for second-order equations.

## 4. Rank 1 matrix: one column by one row

Back to the matrix. rank  $r$  satisfy  $r\le m$  and  $r\le n$, $r$  The smaller the matrix, the simpler it is. The simplest non-zero case is  $r=1$, then the matrix "cannot escape the palm": all rows are proportional to each other, and all columns are also proportional to each other. Elimination is almost unnecessary: ​​the first row has a unique pivot, and the remaining rows are multiples of it. In one step, it can be eliminated into a ladder shape with only one non-zero row.

watch one  $2\times3$  Example. Take the first line  $(1,4,5)$;For the rank to be 1, the second row must be a multiple of the first row, take twice  $(2,8,10)$:



$$
A=\begin{bmatrix}1&4&5\\2&8&10\end{bmatrix},\qquad r=1.
$$



The basis of a row space is the first row  $(1,4,5)$, the dimension is 1; the row space is exactly  $A^{\mathsf T}$  column space, so its dimension is also equal to rank. The dimension of column space is also equal to rank, which is also 1: the three columns are  $(1,2)$, $(4,8)$, $(5,10)$, the last two columns are pivot columns  $(1,2)$  multiples. From the perspective of "rank is the number of independent columns", rank 1 means that the column space is just a straight line passing through the origin, and the row space is also a straight line; all the information of the matrix is ​​compressed into one non-zero column and one non-zero row.

The key structure of a rank 1 matrix is "one column by one row":



$$
\begin{bmatrix}1\\2\end{bmatrix}\begin{bmatrix}1&4&5\end{bmatrix}
=\begin{bmatrix}1&4&5\\2&8&10\end{bmatrix}.
$$



one  $2\times1$  Multiply a matrix by  $1\times3$  matrix, exactly get  $2\times3$  matrix. Written in column vectors, every rank 1 matrix has the form



$$
A=\boldsymbol{u}\boldsymbol{v}^{\mathsf T},
$$



Among them  $\boldsymbol{u},\boldsymbol{v}$  is a non-zero column vector, $\boldsymbol{v}^{\mathsf T}$  put  $\boldsymbol{v}$  Convert to row vector. Expand this product: No.  $i$  OK  $u_i\boldsymbol{v}^{\mathsf T}$, No.  $j$  Column is  $v_j\boldsymbol{u}$. Then any such product, each row is  $\boldsymbol{v}^{\mathsf T}$  Multiples of , each column is  $\boldsymbol{u}$  is a multiple of , the rank is indeed 1. This is the complete picture of a rank 1 matrix.

Rank 1 matrices are building blocks. Set  $A$  The rank is  $r$, take out  $r$  linearly independent rows  $R_1,\dots,R_r$, $A$  Each row of is a linear combination of them. put  $R_k$  in  $m$  The respective coefficients in the rows are collected and arranged into column vectors  $\boldsymbol{c}_k$, you get



$$
A=\sum_{k=1}^{r}\boldsymbol{c}_kR_k,
$$



Each entry is one column by one row, with rank 1. So rank  $r$  The matrix can be split into  $r$  the sum of rank 1 matrices; conversely, $r$  The rank of the sum of rank 1 matrices will not exceed  $r$. For example a  $5\times17$, a matrix of rank 4 can be assembled with four matrices of rank 1, no less. So "rank" has a counting explanation: it is the number of rank 1 building blocks required to build a matrix. We will see later that the determinants and eigenvalues ​​of rank 1 matrices are easy to handle, precisely because all matrices are built from them.

But be careful: **Rank itself is not a linear property**. Fixed  $r$, the rank does not exceed  $r$  Collect all matrices and ask if it is a subspace. The zero matrix must belong to any subspace, so the problem can only be solved for "rank no more than  $r$"mention, but not for "the rank is exactly  $r$"Mention. However, having a zero matrix inside is not enough to ensure that it is a subspace. The key is whether the addition is closed: when two rank 1 matrices are added, the rank will usually rise to 2. The general fact is



$$
\operatorname{rank}(A+B)\le\operatorname{rank}(A)+\operatorname{rank}(B),
$$



It only gives an upper bound and does not guarantee that the rank will not increase. Yes  $5\times17$  matrix, this upper bound is  $4+4=8$, but the rank of the matrix can only be up to 5, so the inequality has almost no constraint effect here. Conclusion: Rank no more than  $r$  The set of matrices is not a subspace.

![Official Handout Summary Page 2/3](</attachments/mit1806-2ea2374007e8e0d112b33f0a.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 11 Summary, CC BY-NC-SA 4.0).*

![Video 00:23:48: Classroom blackboard writing](</attachments/mit1806-85f92bdfee4406e6e195995d.jpg>)

*Video 00:23:48 \| Approximately corresponding to Section 4 "4. Rank 1 matrix: one column by one row".*

![Video 00:29:55: Classroom blackboard writing](</attachments/mit1806-a65be9617c2a2fa6e425e032.jpg>)

*Video 00:29:55 \| Approximately corresponding to Section 4 "4. Rank 1 matrix: one column by one row".*

## 5. $\mathbb{R}^4$  A complete example in

Use a specific example to string together the above vocabulary. in  $\mathbb{R}^4$  Winning



$$
W=\{\boldsymbol{v}=(v_1,v_2,v_3,v_4):\ v_1+v_2+v_3+v_4=0\}.
$$



It is a subspace: multiply such a vector by 6 and the sum of the components is still  $6\cdot 0=0$; When two such vectors are added, the sum of the components is still  $0+0=0$. It is actually the null space of a certain matrix:



$$
A=\begin{bmatrix}1&1&1&1\end{bmatrix},
\qquad
A\boldsymbol{v}=v_1+v_2+v_3+v_4=0.
$$



this  $1\times4$  rank of matrix  $r=1$, so the dimension of the null space is  $n-r=4-1=3$. The same goes for the equation itself: four components are constrained by one, leaving three degrees of freedom.

The basis of the null space is given by the free variables. $A$  The only pivot of is in the first column, so  $v_1$  is the main variable, $v_2,v_3,v_4$  is a free variable. Let a free variable take  $1$, take the rest  $0$, and then solved by constraints  $v_1=-1$, three special solutions are obtained:



$$
\begin{bmatrix}-1\\1\\0\\0\end{bmatrix},\qquad
\begin{bmatrix}-1\\0\\1\\0\end{bmatrix},\qquad
\begin{bmatrix}-1\\0\\0\\1\end{bmatrix}.
$$



Let these three special solutions be written in sequence as  $\boldsymbol{s}_1,\boldsymbol{s}_2,\boldsymbol{s}_3$. They are linearly independent, all satisfy the requirement that the sum of components is zero, and the number is exactly equal to the dimension, so they form a set of basis. Linear independence can be directly verified: if  $c_1\boldsymbol{s}_1+c_2\boldsymbol{s}_2+c_3\boldsymbol{s}_3=\boldsymbol{0}$, only looking at the 2nd, 3rd, and 4th components, we get  $c_1=c_2=c_3=0$.

The remaining three subspaces can be read out along the way. The four subspaces are separated into two spaces: both the row space and the null space.  $\mathbb{R}^4$ , both the column space and the left null space are in  $\mathbb{R}^1$  in. The row space is  $(1,1,1,1)$  All multiples of , dimension is 1. The same is true for column spaces ($m=1$, only one component per column), which is  $(1)$  All multiples of , that is, the entire  $\mathbb{R}^1$, the dimension is 1. left nullspace $N(A^{\mathsf T})$  by  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  definition. $A^{\mathsf T}$  is  $4\times1$  matrix, $\boldsymbol{y}$  is just a number, and the four components of the product are all equal to this number; for it to be equal to the zero vector, only  $\boldsymbol{y}=0$. So  $\dim N(A^{\mathsf T})=0$, its basis is the empty set - a zero-dimensional space contains only zero vectors and should not have any basis vectors.

| subspace | space | dimension | a set of bases |
| --- | --- | --- | --- |
| line space  $C(A^{\mathsf T})$ | $\mathbb{R}^4$ | 1 | $(1,1,1,1)$ |
| null space  $N(A)$ | $\mathbb{R}^4$ | 3 | $(-1,1,0,0)$, $(-1,0,1,0)$, $(-1,0,0,1)$ |
| column space  $C(A)$ | $\mathbb{R}^1$ | 1 | $(1)$ |
| left null space  $N(A^{\mathsf T})$ | $\mathbb{R}^1$ | 0 | empty set |

The dimensionality accounts match up: the null space 3 plus the row space 1 equals 4, which is  $n$;Column space 1 plus left null space 0 equals 1, that is  $m$. The dimensional relationships of the four basic subspaces are fully realized in this example. This example also shows that the four subspaces are not four independent sets of knowledge, but four ways of reading the same matrix.

![Video 00:36:49: Classroom blackboard writing](</attachments/mit1806-984eb60cc1739290a6ba2cd0.jpg>)

*Video 00:36:49｜Approximately corresponding to Section 5 "5.  $\mathbb{R}^4$ "near a complete example".*

![Video 00:39:13: Classroom blackboard writing](</attachments/mit1806-3fef47bea664935f19c7cb6f.jpg>)

*Video 00:39:13｜Approximately corresponding to Section 5 "5.  $\mathbb{R}^4$ "near a complete example".*

## 6. Small world map

Finally, the matrix is directed to the network. Here's **Figure** (graph) is not a curve in calculus, but a set of nodes and the edges connecting the nodes. For example, in a graph with five nodes and six edges, all the information of this graph can be recorded in one  $5\times6$  In the matrix, that is the content of the next lecture.

The most interesting graphs come from interpersonal relationships: treat each person as a node, and if two people are friends and connect an edge between them, you will get a friendship graph. The people in a classroom are a graph with about a hundred nodes, and the people in the entire country are a graph with 260 million nodes. The most natural question on such a graph is: How many steps does it take to walk from any one person to another? How far apart are the two people who are farthest apart? Taking one step here means passing through an edge, and the distance between two points is equal to the number of edges on the shortest path.

Common parlance is "six degrees of separation": there are only about six steps between any two people on Earth. Daily experience supports this point - when chatting with strangers on a plane or talking about people you know in common, you can often connect with two or three levels of relationships. "The world is really small," hence the saying "small world." Let’s calculate it specifically: if a person does not know a certain public figure, but one of his college classmates does, then the distance between him and this figure is 2. There are only three steps between the person listening to his lecture and this character: the student - the lecturer - the lecturer's college classmate - that character, so the distance does not exceed 3.

What’s mathematically interesting is that by adding just a few shortcuts to the graph, all distances are drastically reduced. The friendship graph is like this, and the World Wide Web is even more like this - each website is a node, and the links between web pages are edges. This graph is extremely large, and many people want to understand and characterize it. In the next lecture, we will write the graph as a matrix and use linear algebra to study this type of network.

![Official Handout Summary Page 3/3](</attachments/mit1806-9f75324a083c945a209fb75c.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 11 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- Vector space only requires two operations: "addition" and "scalar multiplication", so matrices and functions can be vectors; only these two operations can be looked at when judging subspaces. Whether matrix multiplication maintains properties has nothing to do with this.
- matrix space  $M$ (all  $3\times3$  matrix) has a standard basis of nine  $E_{ij}$, $\dim M=9$; it is related to  $\mathbb{R}^9$  Just missing the layout.
- Symmetric matrix subspace  $S$: $\dim S=6$, the basis is  $E_{11},E_{22},E_{33}$, $E_{12}+E_{21}$, $E_{13}+E_{31}$, $E_{23}+E_{32}$; $M$  Only 3 of the standard bases belong to  $S$, illustrates the fundamental reconstruction of subspaces.
- Upper triangular matrix subspace  $U$: $\dim U=6$, $M$  Exactly 6 of the standard bases belong to  $U$, they happen to constitute  $U$  base, but that's just a coincidence.
- intersection  $S\cap U$  is a diagonal matrix space  $D$, $\dim=3$; Union  $S\cup U$  is not a subspace; and  $S+U=M$, $\dim=9$, satisfy  $\dim(S+U)=\dim S+\dim U-\dim(S\cap U)$, that is  $9=6+6-3$.
- differential equations  $y''+y=0$  The solution space of  $\cos x,\sin x$  as the basis, $\dim=2$; $e^{ix},e^{-ix}$  is another set of basis; the dimension of the solution space is equal to the order of the equation.
- A rank 1 matrix can be written as  $\boldsymbol{u}\boldsymbol{v}^{\mathsf T}$;Rank  $r$  The matrix can be broken down into  $r$  The sum of rank 1 matrices, for example  $\begin{bmatrix}1&4&5\\2&8&10\end{bmatrix}=\begin{bmatrix}1\\2\end{bmatrix}\begin{bmatrix}1&4&5\end{bmatrix}$.
- Rank is not a linear property: rank does not exceed  $r$  The matrix of is not closed to addition, $\operatorname{rank}(A+B)\le\operatorname{rank}A+\operatorname{rank}B$  Only upper bounds are given.
- $\mathbb{R}^4$  in  $v_1+v_2+v_3+v_4=0$  The subspace of is  $A=[\,1\ \ 1\ \ 1\ \ 1\,]$  The null space of : null space dimension 3, row space dimension 1, column space dimension 1, left null space dimension 0 and the basis is the empty set.
- Graphs are composed of nodes and edges; the distance problem in friendship graphs leads to "six degrees of separation" and "small worlds". A few shortcuts can make the distance drop sharply. The next lecture uses matrices to study networks.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| matrix space | matrix space | Use matrices as "vectors" and only retain the vector space of addition and multiplication |
| standard basis | Standard base | only taken at a certain location  $1$, take the remaining positions  $0$  The basis of the matrix |
| symmetric matrix | symmetric matrix | satisfy  $A=A^{\mathsf T}$  square matrix, all forming a six-dimensional subspace |
| upper triangular matrix | upper triangular matrix | A square matrix with all zeros below the main diagonal forms a six-dimensional subspace. |
| diagonal matrix | diagonal matrix | A square matrix with only possible non-zero diagonals is  $S\cap U$ |
| sum of subspaces | sum of subspaces | A subspace consisting of a vector from one subspace plus a vector from another subspace |
| dimension formula | Dimension formula | $\dim(S+U)=\dim S+\dim U-\dim(S\cap U)$ |
| solution space | solution space | The vector space composed of all solutions of linear differential equations |
| rank | rank | The number of pivots is also the dimension of row space and column space. |
| rank-one matrix | rank 1 matrix | Can be written as one column by one row  $\boldsymbol{u}\boldsymbol{v}^{\mathsf T}$  matrix |
| row space | row space | All linear combinations of row vectors |
| column space | column space | All linear combinations of vectors in each column |
| left nullspace | left null space | satisfy  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  A collection of vectors |
| free variable | free variable | The unknown quantity corresponding to the column without pivot |
| special solution | special solution | Let a free variable be  $1$, the rest are  $0$  The resulting null space vector |
| basis | base | A set of vectors that are linearly independent and span the entire space |
| graph | Figure | A structure consisting of nodes and edges connecting them |
| six degrees of separation | six degrees of separation | The statement that there are only about six social ties between any two people |
| small world | small world | The phenomenon that a few shortcuts can significantly shorten the distance on the map |

---

[← Lecture 10](/en/notes/mit-1806/lec10) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 12 →](/en/notes/mit-1806/lec12)
