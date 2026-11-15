---
kind: notes
source: mit-1806/lec05
title: Lecture 5 · Transposition, permutation and vector space $\mathbb{R}^n$
description: Understand transposition, permutation and vector space, and master
  the definition and determination of subspace.
sourceHash: 7788dd764e596b7e1089ed66691e8f9d84a8d164fe5720196800a9cd684216da
publish: true
translationMethod: machine-assisted
---

> *Transposes, permutations, spaces R^n* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 5 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p5 · Transpose, permutation and vector space  $\mathbb{R}^n$](https://www.bilibili.com/video/BV1ix411f7Yp?p=5)(47:42)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-5-transposes-permutations-spaces-r-n/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=5&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The first four lectures cover the matter of elimination from beginning to end:  $A$  formed into an upper triangle  $U$, write each walking transformation as a matrix, and finally package the entire process into  $A=LU$. This set of descriptions has an implicit premise - there is never a line break during the elimination process. But once the pivot position appears zero, the premise is no longer valid: the equation is not broken, the matrix is ​​not broken, but the order of the rows is not suitable for the algorithm. In this lecture, we will first complete this section to obtain the general decomposition of row exchange.  $PA=LU$, and by the way, we finish explaining transpose and symmetric matrix, which is the end of Chapter 2.

From the second topic, the course enters Chapter 3, which is the beginning of real linear algebra. All previous discussions revolve around "several vectors": a sequence of numbers, a combination, and a solution. Now raise your vision one level, no longer focus on a single vector, but on the "set of vectors", and require this set to be closed to addition and multiplication. This requirement turns a bunch of vectors into **vector space** (vector space), put it in  $\mathbb{R}^n$  This internal space becomes **subspace**(subspace).

At the end of this lecture, a structure is given to connect the matrix and the space: take all the columns of the matrix, and then include all their linear combinations. The resulting set is called **column space** (column space). This seems to be just a definition, but it is actually the first piece of the map of the entire course - the equation.  $A\boldsymbol{x}=\boldsymbol{b}$  Is there any solution? Is it equivalent to  $\boldsymbol{b}$  Are you there?  $C(A)$  inside. This sentence will not be developed until the next lecture, but the stage is set in this lecture.

![Official Handout Summary Page 1/2](</attachments/mit1806-b654b6fe8878da2bdd2714be.png>)

*MIT OCW Official Lecture Notes Summary Page 1/2 (18.06SC Lecture 5 Summary, CC BY-NC-SA 4.0).*

## 1. Row swap with  $PA=LU$

The standard procedure for elimination assumes that zeros do not occur at the pivot position. In case of occurrence, as long as there are non-zero elements below, you can replace that row to get a qualified pivot element, and then continue. This "temporary failure" is not a problem with the matrix, but the order of the rows needs to be adjusted; if once is not enough, change it twice. In theory, any number of changes is allowed. The only problem is: $A=LU$  How can this expression accommodate line breaks?

$A=LU$  The derivation depends on "$E$ "All are lower triangles" fact: The non-zero elements of the elimination matrix only appear on and below the main diagonal, their product is still a lower triangle, and the inverse is also a lower triangle. written as  $L$  with  $U$  The appearance is clearer——$L$  The diagonals are all  $1$, the upper part is all zeros, and the lower part is filled with various multipliers; $U$  It is an upper triangle, with all zeros below the diagonal. This description only holds true when "no line breaks". Line breaks break this structure - the permutation matrix is ​​not triangular. So line breaks cannot be inserted  $L$, can only be mentioned to the left side of the equal sign. First  $A$  Arrange the rows in the required order to get  $PA$, and then perform ordinary elimination on this matrix that no longer needs line wrapping:



$$
PA=LU .
$$



$P$  It is to perform line exchange **permutation matrix** (permutation matrix), which arranges the rows so that "zero or zero will not appear in the pivot position. $L$  with  $U$  can be calculated smoothly". When no line breaks are needed  $P=I$, the above formula returns  $A=LU$. Therefore  $PA=LU$  is a more general conclusion: most matrices are not used  $P$, but there are always some that must be used.

Here is a little bit of added reality. The software not only determines whether the pivot is zero, but also determines whether it is large enough. Pivot components close to zero will amplify the rounding error and be numerically dangerous, so when MATLAB solves a system of equations, it will do some algebraically unnecessary row exchanges. The algebraic requirement is that the pivot component is non-zero, and the numerical requirement is that the pivot component cannot be too small. The two are not the same thing. This course only covers algebra, so only change if you have to.

$P$  The construction of is simple: rearrange the rows of the identity matrix. The identity matrix itself is also considered a permutation matrix - the one in which nothing is replaced; the ones above are those that swap two rows and three rows. As the order increases, there are more tricks: four rows can be  $1\to2\to3\to4\to1$  Make a big circle, or swap two by two. So the number is growing very fast, $n\times n$  The number of permutation matrices is  $n!$: The fourth level has  $4!=24$  There are 5 levels  $120$  It is unrealistic to list them one by one. They are all reversible, because swapping the rows back undoes the rearrangement; and the matrix that completes the "swap back" happens to be  $P$  Transposition of:



$$
P^{\mathsf T}P=I,\qquad P^{-1}=P^{\mathsf T}.
$$



The reason is very intuitive: $P$  Each row of has only one  $1$, $P^{\mathsf T}$  Each column of has only one  $1$, when multiplied by these  $1$  When two pairs meet, they fall exactly on the diagonal, and the remaining positions are all zero. satisfy  $P^{\mathsf T}P=I$  There are far more matrices than permutation matrices. This type of matrix will appear repeatedly later, and permutation matrices are the ones with the clearest structure.

![Video 00:04:46: Classroom blackboard writing](</attachments/mit1806-435e363e41c8dff7e04d3e15.jpg>)

*Video 00:04:46｜Approximately corresponding to Section 1 "1. Row exchange and  $PA=LU$"Nearby.*

![Video 00:11:38: Classroom blackboard writing](</attachments/mit1806-f4f0569e8932d660af81c6c4.jpg>)

*Video 00:11:38｜Approximately corresponding to Section 1 "1. Row exchange and  $PA=LU$"Nearby.*

## 2. Transpose

Transpose turns the matrix over along the main diagonal: rows become columns and columns become rows. take one  $2\times3$  rectangular matrix



$$
R=\begin{bmatrix}1&2&4\\3&3&1\end{bmatrix},
$$



Its transpose is  $3\times2$  of



$$
R^{\mathsf T}=\begin{bmatrix}1&3\\2&3\\4&1\end{bmatrix}.
$$



The original two rows become two columns, the original three columns become three rows, and the matrix changes from "width" to "height". There is only one sentence to write the ingredients: $R^{\mathsf T}$  of the  $i$  line of work  $j$  columns, from  $R$  of the  $j$  line of work  $i$  column,



$$
(R^{\mathsf T})_{ij}=R_{ji}.
$$



The row numbers are interchanged with the column numbers, which is exactly what "flip along the main diagonal" means. Transposition will change the shape, swapping length and width: originally three items were in a row, but after transposition they were vertically aligned in a column.

## 3. Symmetric matrix

The case where the matrix remains unchanged after transposition is particularly important. If  $A^{\mathsf T}=A$, just call  $A$  for **symmetric matrix** (symmetric matrix). This equation requires  $A$  is a square matrix, and each  $a_{ij}$  All equal to  $a_{ji}$: The numbers on the main diagonal can be arbitrary, but the numbers on both sides of the diagonal must be equal in pairs. In the example given in the lecture notes, above the diagonal line is  $1,7,9$, then the corresponding position below the diagonal line must also be placed as it is.  $1,7,9$. Determining whether a matrix is ​​symmetrical requires just a glance, no calculations required.

This is in direct contrast to the situation of the permutation matrix: there it is "transpose equals inverse", the property is very strong, but it is not easy to see from the surface of the matrix; here it is "transposition equals itself", the property is identifiable at a glance.

Symmetric matrices don't appear out of thin air, the most common source is a rectangular matrix multiplied by its transpose. for any matrix  $R$, $R^{\mathsf T}R$  It must be symmetrical. put the above  $R$  Substitute it in and do the math:



$$
R^{\mathsf T}R=
\begin{bmatrix}1&3\\2&3\\4&1\end{bmatrix}
\begin{bmatrix}1&2&4\\3&3&1\end{bmatrix}
=\begin{bmatrix}10&11&7\\11&13&11\\7&11&17\end{bmatrix}.
$$



Check several locations one by one. $(1,1)$  take  $R^{\mathsf T}$  the first line of  $(1,3)$  with  $R$  the first column of  $(1,3)$  Do dot product, $1+9=10$.$(1,2)$  Take the first row  $(1,3)$  with the second column  $(2,3)$, $2+9=11$; turn  $(2,1)$, then the second line  $(2,3)$  Match the first column  $(1,3)$, still  $11$. Look again  $(1,3)$: first line  $(1,3)$  With the third column  $(4,1)$, $4+3=7$, while  $(3,1)$  The location is the same  $7$. The two pairs of numbers being multiplied have only exchanged their order, and the dot product of course remains unchanged. This repetition is not a coincidence but a structure.

Why must it be symmetrical? There is only one way: transpose it and see if the result is returned unchanged. This requires the use of two basic rules of transposition. First, the transposition of the product requires reversing the order of the factors.



$$
(XY)^{\mathsf T}=Y^{\mathsf T}X^{\mathsf T},
$$



This is consistent with the law of inverse matrices  $(XY)^{-1}=Y^{-1}X^{-1}$  Completely parallel. Second, transpose twice and return to the original position. $(R^{\mathsf T})^{\mathsf T}=R$. So



$$
(R^{\mathsf T}R)^{\mathsf T}=R^{\mathsf T}(R^{\mathsf T})^{\mathsf T}=R^{\mathsf T}R .
$$



The proof is complete in two lines without using any numbers. This is where symmetric matrices come from in many practical applications: the data is arranged into a rectangular matrix  $R$, $R^{\mathsf T}R$  Symmetry is automatically introduced.

![Video 00:18:07: Classroom blackboard writing](</attachments/mit1806-0d5c8b30b72616d548ed252e.jpg>)

*Video 00:18:07 \| Approximately corresponding to Section 3 "3. Symmetric Matrix".*

## 4. Vector space: two operations and closure

The two actions used repeatedly above are addition and multiplication: two vectors can be added, and a vector can be multiplied by any real number. This real number is called **scalar** (scalar). If a bunch of vectors are closed to both actions - no matter how you add or multiply, they are still in this bunch - it can be called a **vector space** (vector space). This is where the weight of the word "space" comes in: not just a bunch of vectors, but a bunch of vectors that allow you to do linear combinations.

The simplest example is  $\mathbb{R}^2$: All vectors consisting of two real components. Written as a column vector according to the convention of this course,



$$
\boldsymbol{v}=\begin{bmatrix}3\\2\end{bmatrix},
\quad
\begin{bmatrix}0\\0\end{bmatrix},
\quad
\begin{bmatrix}\pi\\e\end{bmatrix},
\ \dots
$$



Addition proceeds component by component: $(3,2)+(0,0)=(3,2)$, while  $(3,2)+(\pi,e)=(3+\pi,\,2+e)$. Geometrically this is the plane: the first component is along the horizontal axis, the second component is along the vertical axis, and each vector is an arrow starting from the origin. $\pi\approx3.14$, $e\approx2.72$, so  $(\pi,e)$  Land near the upper right corner.

The most important arrow in the plane is the zero vector. Its arrow is too short to be seen, but it must not be deleted. Imagine a plane that has been punctured, with only the origin dug out: addition can barely be done, but multiplication immediately causes problems - any vector multiplication  $0$  They all got the origin, and the origin is no longer there. In the same way, $\boldsymbol{v}$  with  $-\boldsymbol{v}$  The addition must also fall at the origin. So every vector space contains zero vectors, this is not an additional convention, but a direct consequence of closure.

Just as easy is  $\mathbb{R}^3$: Three real components. To distinguish dimensions: $(3,2,0)$  has three components and therefore belongs to  $\mathbb{R}^3$  rather than belonging to  $\mathbb{R}^2$;The fact that the third component is exactly zero does not change this. Generally, $\mathbb{R}^n$  is all  $n$  The set of real-component column vectors, which is the main example of this course. The components are all real numbers for the time being, and complex numbers will not appear until much later in the course.

Strictly speaking, addition and multiplication must satisfy eight laws of operation, and they are listed in the book. in  $\mathbb{R}^n$  These eight items here are never a problem, they are automatically established; there is only one thing that really needs to be checked - whether there is any escape from this set after completing the operation.

Counterexamples illustrate the problem best. Cut off three-quarters of the plane, leaving only the first quadrant - those vectors with both components non-negative. Addition is easy: $(3,2)+(5,6)=(8,8)$  Still in the first quadrant. Something will happen immediately when multiplying numbers: $(3,2)$  multiply  $-5$  Got  $(-15,-10)$, went to the third quadrant. So the first quadrant is not a vector space, it is not closed to negative numbers. **closed** (closed) is the key word here: the vector space must be closed to all linear combinations, not just addition.

![Video 00:25:11: Classroom blackboard writing](</attachments/mit1806-71ad9b66a4f5a0d3cbc374c2.jpg>)

*Video 00:25:11 \| Approximately corresponding to Section 4 "4. Vector Space: Two Operations and Closure".*

![Video 00:31:00: Classroom blackboard writing](</attachments/mit1806-af6f25ace53cf63e4a4dc222.jpg>)

*Video 00:31:00 \| Approximately corresponding to Section 4 "4. Vector Space: Two Operations and Closure".*

## 5. Subspace

$\mathbb{R}^2$  Itself is a vector space. Now I ask: Can I be there?  $\mathbb{R}^2$  Find a smaller vector space internally? Such an object is called  $\mathbb{R}^2$  of **subspace** (subspace). It must meet all the requirements on its own: additive closure, multiplication closure, and zero-containing vectors.

Start with a straight line passing through the origin. Suppose there is a vector in the subspace  $\boldsymbol{v}$, then  $2\boldsymbol{v}$, $\tfrac12\boldsymbol{v}$, $\tfrac34\boldsymbol{v}$, $-\boldsymbol{v}$, $0\boldsymbol{v}$  It all has to be inside - multiplication is not allowed to send the result out of the set. Taking all these multiples in, we get the entire straight line. Check the addition again: the addition of two vectors on a straight line is still on the straight line. A straight line passing through the origin is a subspace.

The condition "passing the origin" cannot be omitted. Take a straight line that does not pass through the origin, with a point on it  $\boldsymbol{v}$; put  $\boldsymbol{v}$  multiply  $0$  The zero vector is obtained, and the zero vector is not on this line, so it is not closed. The previous conclusion that "every vector space contains zero vectors" becomes the fastest method of identification here: first look to see if there are zeros.

$\mathbb{R}^2$  The subspaces of can all be listed, there are only three categories: the entire plane  $\mathbb{R}^2$;Every straight line passing through the origin; a set containing only zero vectors  $\{0\}$. It is always allowed that the entire space counts as its own subspace, otherwise the theory will be exceptions everywhere. A single point of a zero vector also counts: add itself or it, multiply  $17$  Still it is, clumsy but qualified. It is the smallest subspace, and the entire plane is the largest, sandwiching all straight lines passing through the origin.

There is an area of confusion here: $\mathbb{R}^2$  A straight line in looks like  $\mathbb{R}^1$  Exactly the same, but it's not  $\mathbb{R}^1$. A vector on a straight line has two components, $\mathbb{R}^1$  The vector has only one component. As sets they are different, only the "dimension" is the same.

$\mathbb{R}^3$  The situations are completely parallel, with only one extra step: $\mathbb{R}^3$  itself; a plane passing through the origin; a straight line passing through the origin; a single point of zero vector. Four categories, from three dimensions all the way down to zero dimensions, with the two ends being the largest entire space and the smallest zero subspace.

![Video 00:34:07: Classroom blackboard writing](</attachments/mit1806-69a3e26aaf008d4f8feb6168.jpg>)

*Video 00:34:07 \| Approximately corresponding to Section 5 "5. Subspace".*

![Video 00:38:09: Classroom blackboard writing](</attachments/mit1806-61225094440d1b90ef946ff8.jpg>)

*Video 00:38:09 \| Approximately corresponding to Section 5 "5. Subspace".*

## 6. Column space: how matrices generate subspaces

The above subspaces are drawn geometrically. The real question comes later: where do these subspaces come from? The answer is the matrix—the core construct of this lecture.

Take the transpose of the rectangular matrix from the previous section



$$
A=R^{\mathsf T}=\begin{bmatrix}1&3\\2&3\\4&1\end{bmatrix}.
$$



Its two columns are  $\begin{bmatrix}1\\2\\4\end{bmatrix}$  with  $\begin{bmatrix}3\\3\\1\end{bmatrix}$, all  $\mathbb{R}^3$  vector in .

I want to put these two columns into a subspace. But "putting it into two columns" is not enough. The subspace must be closed: adding the two columns gives  $\begin{bmatrix}4\\5\\5\end{bmatrix}$, must be inside; a column multiplied by  $3$  Add another column, which must be inside; multiply both columns  $0$, the zero vector must be inside. Collect all such results and get all linear combinations of these two columns. This set is automatically a subspace: two combinations are added together or combined, and a combination multiplied by a scalar is still combined. It has a name, it's called  $A$  of **column space** (column space), recorded as  $C(A)$.

Geometrically what is it? The two columns are not collinear and each form a straight line passing through the origin. Walk along the first straight line to get a family of vectors, and then superimpose any vector on the second straight line, and the entire area between the two straight lines will be swept out. So  $C(A)$  is a plane passing through the origin, and  $\begin{bmatrix}4\\5\\5\end{bmatrix}$  It falls on this plane. This picture of "all combinations of two columns filling a plane" must be established, because the same operation will soon be moved to higher dimensions.

How much to fill depends on the vector itself. If the two columns are replaced by two vectors with the same direction, only a straight line will be swept out, not a plane. No matter how much the weight is, the same thing: in  $\mathbb{R}^{10}$  Take five vectors, each with ten components, and their combination constitutes a certain subspace passing through the origin. It may be a five-dimensional flat object, or it may degenerate into a one-dimensional straight line because the five are collinear. Note  $\mathbb{R}^{10}$  Taking five vectors from , the result is definitely not  $\mathbb{R}^5$——The number of vector components of the two is different, the former is ten and the latter is five.

So matrices and spaces join together: the columns of a matrix give rise to a subspace. This leaves a good interface for the next lecture——$A\boldsymbol{x}=\boldsymbol{b}$  There is a solution, which is equivalent to  $\boldsymbol{b}$  fall on  $C(A)$  Here; rereading the system of equations in the language of column space is the starting point of Chapter 3 of the textbook.

![Video 00:42:56: Classroom blackboard writing](</attachments/mit1806-c689d3031fd3fa2deb441926.jpg>)

*Video 00:42:56 \| Approximately corresponding to Section 6 "6. Column space: how matrices generate subspaces".*

![Official Handout Summary Page 2/2](</attachments/mit1806-b890bb6d5af082eb8494acac.png>)

*MIT OCW Official Lecture Notes Summary Page 2/2 (18.06SC Lecture 5 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- When the position of the pivot element in elimination is zero, rely on **row swap** To the rescue; record the line breaks into the decomposition to get the permutation matrix version  $PA=LU$. When no line breaks are needed  $P=I$, degenerates into  $A=LU$.
- Numerical software will also actively wrap lines: the pivot must not only be non-zero, but also "large enough", because pivots close to zero will amplify rounding errors, so MATLAB will do algebraically unnecessary exchanges.
- $P$  Obtained by rearranging the rows of the identity matrix, $n\times n$  Permutation matrix total  $n!$  (fourth level  $24$  one, fifth level  $120$ ), all are reversible, and  $P^{\mathsf T}P=I$, that is  $P^{-1}=P^{\mathsf T}$.
- **transpose** (transpose) flip along the main diagonal, $(A^{\mathsf T})_{ij}=A_{ji}$, swap shape length and width: $2\times3$  of  $\begin{bmatrix}1&2&4\\3&3&1\end{bmatrix}$  Transposed to  $3\times2$  of  $\begin{bmatrix}1&3\\2&3\\4&1\end{bmatrix}$.
- **symmetric matrix** (symmetric matrix) satisfies  $A^{\mathsf T}=A$, the two sides of the main diagonal are equal in pairs; it is immediately identifiable, unlike the rare property of "transpose equals inverse".
- for any rectangular matrix  $R$, $R^{\mathsf T}R$  Must be symmetrical, the reason is  $(R^{\mathsf T}R)^{\mathsf T}=R^{\mathsf T}(R^{\mathsf T})^{\mathsf T}=R^{\mathsf T}R$;Numerical examples are given  $\begin{bmatrix}10&11&7\\11&13&11\\7&11&17\end{bmatrix}$. This is the main source of symmetric matrices in practical applications.
- **vector space** (vector space) is a vector set closed to addition and multiplication; $\mathbb{R}^n$  is all  $n$  A column vector of real components. The eight laws of operation are  $\mathbb{R}^n$  is automatically established, all that needs to be tested is the closure.
- Two counterexamples: the first quadrant is closed to addition, but multiplication by negative numbers escapes; after the punctured plane loses the zero vector, multiplication is no longer closed. Therefore every vector space must contain zero vectors.
- **subspace** (subspace) is  $\mathbb{R}^n$  The collection remains closed inside. $\mathbb{R}^2$  There are only three categories: the entire plane, the straight line passing through the origin, $\{0\}$; $\mathbb{R}^3$  There is one more "Plane passing through the origin" level. It cannot be omitted when passing through the origin, otherwise it is multiplied by  $0$  Just out of bounds.
- **column space**(column space)$C(A)$  is  $A$  All linear combinations of all columns. Column  $(1,2,4)$  with  $(3,3,1)$  Not collinear, Zhang Cheng  $\mathbb{R}^3$  Find a plane passing through the origin, $(4,5,5)$  in it; $A\boldsymbol{x}=\boldsymbol{b}$  There is a solution equivalent to  $\boldsymbol{b}\in C(A)$.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| permutation matrix | permutation matrix | Obtained by rearranging the rows of the identity matrix, used to exchange or rearrange the rows of the matrix |
| row exchange | row swap | When the pivot position is zero, swap two rows to obtain a qualified pivot |
| transpose | transpose | Flip the matrix along the main diagonal, changing rows to columns and columns to rows |
| symmetric matrix | symmetric matrix | satisfy  $A^{\mathsf T}=A$  A square matrix with equal pairs on both sides of the diagonal |
| vector space | vector space | A set of vectors closed to addition and multiplication |
| scalar | scalar | real number used to multiply vectors |
| closed | closed | The operation result does not violate the properties of the set |
| subspace | subspace | located in  $\mathbb{R}^n$  A vector space that is internal and still closed to itself |
| zero subspace | zero subspace | The smallest subspace containing only zero vectors |
| column space | column space | The subspace composed of all linear combinations of all columns of the matrix is denoted as  $C(A)$ |
| linear combination | linear combination | Multiply several vectors each by a scalar and add them together |
| span | Zhang Cheng | The set of all linear combinations of a set of vectors |

---

[← Lecture 4](/en/notes/mit-1806/lec04) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 6 →](/en/notes/mit-1806/lec06)
