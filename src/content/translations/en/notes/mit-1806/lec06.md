---
kind: notes
source: mit-1806/lec06
title: Lecture 6 · Column space and null space
description: Use column space and null space to describe the solvability of Ax=b
  and the degree of freedom of the solution.
sourceHash: cde6d9c12caba59e0687345090b882266f199220a6496206acef7a348ebf8705
publish: true
translationMethod: machine-assisted
---

> *Column space and nullspace* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 6 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p6 · Column space and null space](https://www.bilibili.com/video/BV1ix411f7Yp?p=6)(46:01)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-6-column-space-and-nullspace/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=6&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

In the previous lecture, the terms vector space and subspace were put on the table, but the table was still empty. This lecture will introduce two protagonists: The Matrix  $A$  of **column space** (column space) and **null space** (nullspace). They are all subspaces, but live in different rooms - if  $A$  is  $m\times n$  matrix, the column space lives in  $\mathbb{R}^m$, null space lives in  $\mathbb{R}^n$. Two rooms correspond to two questions: $A\boldsymbol{x}=\boldsymbol{b}$  When will there be a solution? $A\boldsymbol{x}=\boldsymbol{0}$  What does the solution look like?

These two problems are approached in exactly opposite ways. Column space is defined from the perspective of "making": give me several column vectors, and I collect all their linear combinations to form a subspace. The null space is defined from a "sieve" perspective: give me an equation and I put all the equations that satisfy it  $\boldsymbol{x}$  Pick out. The former has vectors first and then becomes space; the latter has requirements first and then sets. These two construction methods are standard techniques for producing subspaces in linear algebra. This lecture will use an example to walk through each.

This lecture is also the main topic of the new chapter. The previous lectures dealt with "how to solve": elimination, back substitution, $LU$  Decomposition is all algorithms. Starting from this lecture, the question changes to "What is the shape of the entire solution?": Put all possible right ends together and look at all possible liberations together, and what will each get? The algorithm cares about how to take one step, and the subspace cares about where all the answers live.

The most important conclusion is just one sentence: $A\boldsymbol{x}=\boldsymbol{b}$  There is a solution if and only if  $\boldsymbol{b}$  fall on  $A$  in the column space. This sentence translates "solving a system of equations" into "determining whether a vector belongs to a certain subspace." It also explains why the entire next chapter is devoted to studying subspaces rather than the equations themselves. This lecture also gives a counterexample: changing the right-hand side from zero to another vector, the solution set is immediately no longer a subspace—the only difference is the origin.

![Official Handout Summary Page 1/2](</attachments/mit1806-3f593601739695c31a54fc62.png>)

*MIT OCW Official Lecture Notes Summary Page 1/2 (18.06SC Lecture 6 Summary, CC BY-NC-SA 4.0).*

## 1. Vector space: addition and multiplication are not allowed to escape.

**vector space** The definition of (vector space) has only two requirements: if two vectors in any space are added, the result is still in the space; if a vector in any space is multiplied by any constant, the result is still in the space. The two words combined make one sentence - yes **linear combination** (linear combination) closed. Because it’s optional  $c\boldsymbol{v}+d\boldsymbol{w}$, first use multiplication to stay in it, and then use addition to stay in it, both steps are passable.

in  $\mathbb{R}^3$  There are several that can be counted here. whole  $\mathbb{R}^3$  It's a vector space, there's nothing to argue about. What is more interesting are some of its internal subsets: a plane passing through the origin, or a straight line passing through the origin. The addition of two vectors on the plane remains on the plane. Multiply the vector on the plane  $-2$  Still on the plane, so the plane is a subspace; the same goes for straight lines. Here's **subspace** (subspace) refers to "the interior of a certain space and itself constitutes a part of the vector space". When the external space is explained clearly, it is said that "$\mathbb{R}^3$  subspace".

**All subspaces must pass through the origin.**  The reason is simple: if  $\boldsymbol{v}$  In the subspace, take a constant  $0$, then  $0\boldsymbol{v}=\boldsymbol{0}$  It has to be inside too. Therefore, to determine whether a set is a subspace, you must first look at whether it contains a zero vector. If it does not, you will be eliminated immediately. This criterion will be used later: when the right end is not zero, $A\boldsymbol{x}=\boldsymbol{b}$  The solution set of does not contain zero vectors, so it is not even a candidate. On the other hand, for a collection to be worthy of the word "space", these two requirements must be tested one by one and cannot be released based on impressions.

![Video 00:04:36: Classroom blackboard writing](</attachments/mit1806-d32fbcbef2e215ff95e64456.jpg>)

*Video 00:04:36 \| Approximately corresponding to Section 1 "1. Vector space: addition and multiplication are not allowed to escape".*

## 2. Union and intersection: Which one is still a subspace?

Set  $P$  is a plane passing through the origin, $L$  is a straight line passing through the origin, both  $\mathbb{R}^3$ , each is a subspace. Now use set operations to put them together and see if the resulting thing is still a subspace.

Let’s look at the union first  $P\cup L$, that is, all vectors "on a plane or on a straight line". it **No** subspace. Find a vector on the plane that is not on a straight line  $\boldsymbol{v}$, then take a non-zero vector on the straight line  $\boldsymbol{w}$, the two are added together, and the sum is usually neither on the plane nor on the straight line, running out of the union. Use closure to state the reason clearly: if  $\boldsymbol{v}+\boldsymbol{w}$  Still on the plane  $P$  Guilty, then  $\boldsymbol{w}=(\boldsymbol{v}+\boldsymbol{w})-\boldsymbol{v}$  As the difference of two in-plane vectors must also be in  $P$  Guilty, but  $\boldsymbol{w}$  only in  $L$  Up but not here  $P$  Internal, contradictory. The problem lies in the addition step.

Look at the intersection again  $P\cap L$, that is, a vector that is "on the plane and on a straight line at the same time". If the straight line is not in the plane, they only share one origin, so  $P\cap L=\{\boldsymbol{0}\}$. A single zero vector is a subspace, so the intersection is a subspace. This conclusion is not a coincidence of this picture, it is true for any two subspaces.

Set  $S$  with  $T$  are two subspaces in the same space, take  $\boldsymbol{v},\boldsymbol{w}\in S\cap T$. By definition, $\boldsymbol{v}$  with  $\boldsymbol{w}$  All are there  $S$  inside, and  $S$  is a subspace, so  $\boldsymbol{v}+\boldsymbol{w}\in S$;Similarly  $\boldsymbol{v}+\boldsymbol{w}\in T$. Both sides are established, so  $\boldsymbol{v}+\boldsymbol{w}\in S\cap T$. The check for multiplication is exactly the same: $\boldsymbol{v}\in S$  given  $7\boldsymbol{v}\in S$, $\boldsymbol{v}\in T$  given  $7\boldsymbol{v}\in T$, so  $7\boldsymbol{v}$  Also in the intersection.

**The intersection of two subspaces is still a subspace, but the union generally is not.**  Because of the additional condition, the intersection is usually smaller than the original two, but this is not important, the closure is maintained. This comparison also shows that the two requirements are not decoration: the closure of the intersection is guaranteed by them, and the union fails precisely in addition.

![Video 00:11:03: Classroom blackboard writing](</attachments/mit1806-beda1bbc486ee5709eb0fb61.jpg>)

*Video 00:11:03 \| Approximately corresponding to section 2 "2. Union and intersection: which one is still a subspace".*

## 3. Column space: let  $A\boldsymbol{x}=\boldsymbol{b}$  Those with solutions  $\boldsymbol{b}$

Get a specific matrix



$$
A=\begin{bmatrix}
1&1&2\\
2&1&3\\
3&1&4\\
4&1&5
\end{bmatrix}.
$$



it is  $4\times 3$  Matrix, the three columns are



$$
\boldsymbol{c}_1=\begin{bmatrix}1\\2\\3\\4\end{bmatrix},
\qquad
\boldsymbol{c}_2=\begin{bmatrix}1\\1\\1\\1\end{bmatrix},
\qquad
\boldsymbol{c}_3=\begin{bmatrix}2\\3\\4\\5\end{bmatrix}.
$$



Each column has four components, so the column vector lives in  $\mathbb{R}^4$  There are several rows and components in a matrix.

$A$  of **column space** (column space) is recorded as  $C(A)$, defined as all linear combinations of three column vectors:



$$
C(A)=\left\{x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3\right\}.
$$



The three column vectors themselves are of course in it (take the coefficients respectively  $(1,0,0)$, $(0,1,0)$, $(0,0,1)$), but just three vectors cannot form a subspace, and the combination must be completed. After completion, it is indeed a subspace: a combined multiplication  $11$  It is still a combination, and the addition of two combinations is still a combination. It contains these three column vectors **smallest** Subspace - columns must be there, combinations of columns must be there, nothing more is added.

$C(A)$  is  $\mathbb{R}^4$  subspace, but far from the entire  $\mathbb{R}^4$. Three column vectors can provide up to three new directions, and  $\mathbb{R}^4$  It takes four directions to fill it up, so there are always some  $\boldsymbol{b}$  Left outside. As for how much falls outside and what shape the remaining parts are, we’ll see in the next section. For now let's translate this geometric fact into an equation.

put  $A\boldsymbol{x}=\boldsymbol{b}$  Write it completely:



$$
x_1\begin{bmatrix}1\\2\\3\\4\end{bmatrix}
+x_2\begin{bmatrix}1\\1\\1\\1\end{bmatrix}
+x_3\begin{bmatrix}2\\3\\4\\5\end{bmatrix}
=\begin{bmatrix}b_1\\b_2\\b_3\\b_4\end{bmatrix}.
$$



That's four equations, three unknowns, and usually no solution. It is more intuitive to write it line by line as a system of equations:



$$
\begin{cases}
x_1+x_2+2x_3=b_1,\\
2x_1+x_2+3x_3=b_2,\\
3x_1+x_2+4x_3=b_3,\\
4x_1+x_2+5x_3=b_4.
\end{cases}
$$



There are only three unknowns in the four equations. Of course, "usually" does not mean "always". Some of the right-hand sides can be solved. The most stable one is  $\boldsymbol{b}=\boldsymbol{0}$, take  $x_1=x_2=x_3=0$  That’s it. Find another one: let  $\boldsymbol{b}$  Directly equal to the first column  $(1,2,3,4)$, at this time  $\boldsymbol{x}=(1,0,0)$  It's the solution - plug it in and the four equations are given in turn  $1=1$, $2=2$, $3=3$, $4=4$, all matched. This is no coincidence, $A(1,0,0)$  The meaning is "take one first column, zero second column, zero third column", and the right end of the multiplication is of course the first column itself. let  $\boldsymbol{b}$  equal to the second column  $(1,1,1,1)$, the same reasoning is given  $\boldsymbol{x}=(0,1,0)$. There is a trick to find the right end that can be solved: do it in reverse, first specify a random one  $\boldsymbol{x}$, the result of multiplying is a legal  $\boldsymbol{b}$.

So the core answer to this lecture can be written down:

> $A\boldsymbol{x}=\boldsymbol{b}$  There is a solution if and only if  $\boldsymbol{b}\in C(A)$.

The reason is in the definition. The column space contains all  $A\boldsymbol{x}$, $\boldsymbol{x}$  Run all over  $\mathbb{R}^3$. If  $\boldsymbol{b}$  is a combination of columns, then this set of combination coefficients gives a solution; if  $\boldsymbol{b}$  Not a combination of columns, any  $\boldsymbol{x}$  Can't even figure it out. The entire difficulty of solving the equation is thus reduced to a subordinate judgment: $\boldsymbol{b}$  Are you there?  $C(A)$  inside.

![Video 00:13:48: Classroom blackboard writing](</attachments/mit1806-58334606c0a562dafb2c123d.jpg>)

*Video 00:13:48｜Approximately corresponding to Section 3 "3. Column Space: Let  $A\boldsymbol{x}=\boldsymbol{b}$  Those with solutions  $\boldsymbol{b}$"Nearby.*

![Video 00:17:29: Classroom blackboard writing](</attachments/mit1806-81534da3c61e2ac5bdd6bac7.jpg>)

*Video 00:17:29｜Approximately corresponding to Section 3 "3. Column Space: Let  $A\boldsymbol{x}=\boldsymbol{b}$  Those with solutions  $\boldsymbol{b}$"Nearby.*

## 4. Delete a column and the column space remains unchanged

The previous section said that the three column vectors cannot be filled  $\mathbb{R}^4$, the actual situation is even more extreme: one of the three column vectors is redundant. Add the first two columns:



$$
\boldsymbol{c}_1+\boldsymbol{c}_2=
\begin{bmatrix}1\\2\\3\\4\end{bmatrix}
+\begin{bmatrix}1\\1\\1\\1\end{bmatrix}
=\begin{bmatrix}2\\3\\4\\5\end{bmatrix}
=\boldsymbol{c}_3 .
$$



The third column is exactly the sum of the first two columns and it doesn't bring any new direction. Put this into the mix:



$$
x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3
=(x_1+x_3)\boldsymbol{c}_1+(x_2+x_3)\boldsymbol{c}_2 .
$$



Only the first two columns are used on the right. In other words, any combination using the third column can be rewritten as a combination using only the first two columns; conversely, a combination using only the first two columns is originally a three-column combination (take  $x_3=0$). Both sides include each other, so



$$
C(A)=\left\{x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2\right\}.
$$



Delete the third column, and the column space will be less than one vector. To put it another way: the third column falls in the plane formed by the first two columns and contributes no new direction.

Can I delete the first column? That's ok too. by  $\boldsymbol{c}_1=\boldsymbol{c}_3-\boldsymbol{c}_2$  It can be seen that the first column is a combination of the other two columns, and nothing is lost by deleting it. However, it is customary to retain the first few independent columns, so it is agreed to call them  $\boldsymbol{c}_1,\boldsymbol{c}_2$  for **Pivot column** (pivot columns), called  $\boldsymbol{c}_3$  Not the pivot column. The name "pivot column" has no algorithmic meaning at the moment, and it will not be explained clearly until the pivot is formally obtained by elimination later; now you only need to remember the selection rules: from left to right, stay as long as you can, and stay until no new directions are generated.

thus  $C(A)$  is  $\mathbb{R}^4$  one of the **two-dimensional** A subspace is geometrically a plane passing through the origin. Three column vectors, two directions, the third one is locked by the coefficient relationship of the first two columns.

The question "Is this column redundant?" can only be answered by eyes and subtraction: spread out the columns and see if one column can be spelled out from the remaining columns. It will later become a formal concept and require a special name; the current example just demonstrates it in advance.

## 5. null space: Set the right end to zero

Now switch to a completely different subspace. The column space collects the right end  $\boldsymbol{b}$, the null space collects solutions  $\boldsymbol{x}$.$A$  of **null space** (nullspace) is recorded as  $N(A)$, the definition is



$$
N(A)=\{\boldsymbol{x}:A\boldsymbol{x}=\boldsymbol{0}\}.
$$



"null" means zero, so the null space is also called the solution space: it is a homogeneous equation  $A\boldsymbol{x}=\boldsymbol{0}$  all solutions. Still using the same  $A$, $\boldsymbol{x}$  There are three components, so  $N(A)$  fall on  $\mathbb{R}^3$  inside. The number of columns of the matrix determines where the null space lives, and the number of rows determines where the column space lives: Right  $m\times n$  matrix, $C(A)\subseteq\mathbb{R}^m$  And  $N(A)\subseteq\mathbb{R}^n$.

There is at least one vector in null space: $\boldsymbol{x}=\boldsymbol{0}$. Any matrix multiplied by a zero vector gets zero, so the null space is always non-empty and always contains the origin. The first necessary condition for subspace has been met.

Here's the advantage of the small example: you don't have to actually solve the equation to see the null space. When the matrix is ​​large, the eyes are not enough. At that time, we have to rely on the mechanical program of elimination to force out the null space, which is the content of the next lecture.

Find another one. The requirement is  $x_1\boldsymbol{c}_1+x_2\boldsymbol{c}_2+x_3\boldsymbol{c}_3=\boldsymbol{0}$. Since  $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$, take  $x_1=1,x_2=1,x_3=-1$  Exactly offset:



$$
\boldsymbol{c}_1+\boldsymbol{c}_2-\boldsymbol{c}_3=\boldsymbol{0} .
$$



Substitute into the four equations and check line by line: the first line  $1+1-2=0$, second line  $2+1-3=0$, the third line  $3+1-4=0$, the fourth line  $4+1-5=0$, all four lines hit. Another solution is  $(2,2,-2)$, which is twice the previous one. In fact, the whole solution is



$$
N(A)=\left\{c\begin{bmatrix}1\\1\\-1\end{bmatrix}:c\in\mathbb{R}\right\}.
$$



remember  $\boldsymbol{v}=(1,1,-1)$, verification is easy: $A(c\boldsymbol{v})=c(A\boldsymbol{v})=c\,\boldsymbol{0}=\boldsymbol{0}$. So as long as there is a non-zero solution, all its multiples are solutions; $c=0$  gives a zero vector, $c=1$  Give the solution just now, $c=-11$  given  $(-11,-11,11)$. So  $N(A)$  is  $\mathbb{R}^3$  A straight line passing through the origin, the direction vector is  $(1,1,-1)$.

Here's a pronunciation worth remembering. A vector in null space is a set of **coefficient**, what it records is "use these coefficients to combine each column and get exactly zero." write  $A\boldsymbol{x}=\boldsymbol{0}$  In fact, we are asking: What kind of linear relationship exists between these column vectors? The third column is equal to the sum of the first two columns. This geometric fact translates into a coefficient of exactly  $(1,1,-1)$;Multiply by  $7$  become  $(7,7,-7)$, still talking about the same relationship, but magnifying both sides seven times. Column space cares about "what columns can be combined to form", and null space cares about "how columns can be combined into zeros". The two subspaces look at the same batch of columns, but ask questions in the opposite direction.

![Video 00:29:55: Classroom blackboard writing](</attachments/mit1806-b84f0932a93e2fc8d27faf9f.jpg>)

*Video 00:29:55 \| Approximately corresponding to section 5 "5. null space: set the right end to zero".*

## 6. Why does null space deserve the name “Space”?

It was called "null space" all the way before. This name was used a little early: it must first be verified that it meets those two requirements before it can be qualified to be called space. The matter to be proved is very specific: if  $\boldsymbol{v}$  with  $\boldsymbol{w}$  are all solutions, then  $\boldsymbol{v}+\boldsymbol{w}$  It is also a solution; if  $\boldsymbol{v}$  is the solution, then  $12\boldsymbol{v}$  That’s also the solution.

The first one. known  $A\boldsymbol{v}=\boldsymbol{0}$, $A\boldsymbol{w}=\boldsymbol{0}$, to calculate  $A(\boldsymbol{v}+\boldsymbol{w})$. A basic property of matrix multiplication is used here - the distributive law:



$$
A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w}=\boldsymbol{0}+\boldsymbol{0}=\boldsymbol{0}.
$$



thus  $\boldsymbol{v}+\boldsymbol{w}$  Satisfies the equation and falls in the null space. The second thing is the same. Using constants, we can propose this property:



$$
A(12\boldsymbol{v})=12(A\boldsymbol{v})=12\cdot\boldsymbol{0}=\boldsymbol{0},
$$



So  $12\boldsymbol{v}$  Also in null space. Both requirements are met, and the null space is indeed a subspace. Combining the two equations, we get a stronger statement: if  $\boldsymbol{v},\boldsymbol{w}$  is the solution, then for any constant  $c,d$, $c\boldsymbol{v}+d\boldsymbol{w}$  Also the solution - the solution is closed to linear combinations.

The key to this proof is not the technique, but that it does not use  $A$  anything special: neither the four specific numbers nor the special relationship between the columns. Take any matrix, $A\boldsymbol{x}=\boldsymbol{0}$  All solutions of form a subspace. The solution set of homogeneous equations is naturally closed, which is the fundamental reason why it is easier to deal with than non-homogeneous equations - and also explains why research  $A\boldsymbol{x}=\boldsymbol{b}$  The first step is always to put  $\boldsymbol{b}$  Replace with  $\boldsymbol{0}$.

![Video 00:35:53: Classroom blackboard writing](</attachments/mit1806-6bcd7c75e2713ca4db43acd6.jpg>)

*Video 00:35:53 \| Approximately corresponding to section 6 "6. Why is null space worthy of the name "space"".*

![Video 00:36:49: Classroom blackboard writing](</attachments/mit1806-8fa2e39b9a252a9bb82c10a0.jpg>)

*Video 00:36:49 \| Approximately corresponding to section 6 "6. Why is null space worthy of the name "space"".*

## 7. The right end is not zero: why the solution set is no longer a subspace

Take the right end from  $\boldsymbol{0}$  Change to the first column  $\boldsymbol{b}=(1,2,3,4)$, the matrix and the unknowns remain unchanged, only this one thing has been changed. There are still solutions to the equation, e.g.  $\boldsymbol{x}=(1,0,0)$; Another solution is  $(0,-1,1)$, check calculation  $-\boldsymbol{c}_2+\boldsymbol{c}_3=-(1,1,1,1)+(2,3,4,5)=(1,2,3,4)$.

But this solution set is not a subspace. One sentence is enough for the reason: $\boldsymbol{x}=\boldsymbol{0}$  It's not a solution because  $A\boldsymbol{0}=\boldsymbol{0}\neq\boldsymbol{b}$. Without the zero vector, closure is out of the question.

What happened geometrically? put  $(1,0,0)$  with  $(0,-1,1)$  Subtract and get  $(1,1,-1)$, which is exactly the direction of null space. Moving in this direction does not change the right end:



$$
A\bigl((1,0,0)+c(1,1,-1)\bigr)=A(1,0,0)+c\,A(1,1,-1)=\boldsymbol{b}+c\cdot\boldsymbol{0}=\boldsymbol{b}.
$$



So it looks like



$$
\boldsymbol{x}=c\begin{bmatrix}1\\1\\-1\end{bmatrix}+\begin{bmatrix}1\\0\\0\end{bmatrix}
$$



The vectors of are all solutions, and they are connected into a line  $(1,0,0)$, the direction is  $(1,1,-1)$  of straight lines. The two solutions found earlier both fall on this line: $c=0$  given  $(1,0,0)$, $c=-1$  given  $(0,-1,1)$. This line is parallel to the straight line in null space, but it is translated away from the origin as a whole: the right end  $\boldsymbol{b}$  Determines where the line translates, and the null space determines which direction it extends. The subspace must pass through the origin, but it cannot, so it can only be called a "solution set", not a "subspace". As soon as the right end is non-zero, the solution set changes from a straight line passing through the origin to a straight line passing through the origin: the direction does not change, the position changes, and the properties change accordingly. As for whether there are other points on this line and how the general solution of the non-homogeneous equation is organized, we will not expand it here. The structure of "a special solution plus null space" will be formally written in Lecture 8.

**Two ways to create subspaces.**  A look at today's two protagonists side by side reveals that they correspond to two opposite descriptions. To explain what is in the column space, you only need to give a few vectors and then declare "take all their combinations" - this is generated from the inside; to explain what is in the null space, you cannot give such a small set of vectors, you can only give a set of equations that must be satisfied and let the solution emerge by itself - this is defined from the outside. Both statements can create subspaces, and they are the two most natural and important ways to construct subspaces. The solution can be seen with the eyes for a small matrix, but not for a large matrix. At that time, the mechanical procedure of elimination must be used. This is the next step.

![Video 00:41:25: Classroom blackboard writing](</attachments/mit1806-88519ca805eff57f9bd57eb7.jpg>)

*Video 00:41:25 \| Approximately corresponding to Section 7 "7. The right end is not zero: why the solution set is no longer a subspace".*

![Official Handout Summary Page 2/2](</attachments/mit1806-05e810d4a6624133c16d83a5.png>)

*MIT OCW Official Lecture Notes Summary Page 2/2 (18.06SC Lecture 6 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- **vector space** (vector space) is closed to addition and multiplication, which is equivalent to being closed to linear combinations; **subspace** (subspace) is the part within a space that itself constitutes a vector space.
- Any subspace contains zero vectors (take  $0$  Multiples are obtained), so "sets without origins" are rejected with one vote; to judge the subspace, the closure must be tested one by one and cannot be released based on impressions.
- of two subspaces **intersection** Still a subspace: $\boldsymbol{v},\boldsymbol{w}\in S\cap T$  launch  $\boldsymbol{v}+\boldsymbol{w}$  at the same time  $S$, $T$  in. **union** Generally not: in  $P\cup L$  Here, a vector in the plane plus a vector on a straight line will break the additive closure.
- $m\times n$  matrix **column space** $C(A)\subseteq\mathbb{R}^m$  are all linear combinations of each column, and are also all  $A\boldsymbol{x}$  collection; **null space** $N(A)\subseteq\mathbb{R}^n$  is  $A\boldsymbol{x}=\boldsymbol{0}$  all solutions.
- Examples of this lecture ($4\times 3$  matrix, three columns  $(1,2,3,4)$, $(1,1,1,1)$, $(2,3,4,5)$) in, $C(A)$  is  $\mathbb{R}^4$  The two-dimensional subspace of $N(A)$  is  $\mathbb{R}^3$  The middle direction is  $(1,1,-1)$  of straight lines.
- $A\boldsymbol{x}=\boldsymbol{b}$  There is a solution if and only if  $\boldsymbol{b}\in C(A)$: $\boldsymbol{b}=(1,2,3,4)$  Correspond  $\boldsymbol{x}=(1,0,0)$, $\boldsymbol{b}=(1,1,1,1)$  Correspond  $\boldsymbol{x}=(0,1,0)$, $\boldsymbol{b}=\boldsymbol{0}$  There is always a solution.
- $\boldsymbol{c}_3=\boldsymbol{c}_1+\boldsymbol{c}_2$, so deleting the third column does not change the column space; $\boldsymbol{c}_1=\boldsymbol{c}_3-\boldsymbol{c}_2$  Note that it is okay to delete the first column. The convention is to retain the frontmost independent column, that is **Pivot column** $\boldsymbol{c}_1,\boldsymbol{c}_2$.
- The null space closure is given by  $A(\boldsymbol{v}+\boldsymbol{w})=A\boldsymbol{v}+A\boldsymbol{w}$  with  $A(c\boldsymbol{v})=cA\boldsymbol{v}$  Obtained directly, it holds for any matrix.
- The solution set when the right end is non-zero is not a subspace because the zero vector is not in it; the solution set in this example is  $(1,0,0)$, the direction is  $(1,1,-1)$  A straight line parallel to null space but not passing through the origin.
- There are two ways to construct a subspace: taking a combination of a set of vectors (column space), or taking a solution to a set of equations (null space).

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| vector space | vector space | A set of vectors closed to both addition and multiplication |
| subspace | subspace | The part located inside a certain space and itself forming a vector space must contain a zero vector |
| linear combination | linear combination | Several vectors are each multiplied by a coefficient and then added |
| closed under addition | closed to addition | The sum of any two vectors in the space is still within the space |
| closed under scalar multiplication | log multiplication closed | Any vector in the space multiplied by any constant remains within the space. |
| column space | column space | The subspace composed of all linear combinations of each column of the matrix  $C(A)$ |
| nullspace | null space | satisfy  $A\boldsymbol{x}=\boldsymbol{0}$  of all  $\boldsymbol{x}$  The subspace formed by  $N(A)$ |
| pivot column | Pivot column | The column that is retained column by column from left to right and is not combined by the previous columns and thus brings a new direction |
| homogeneous equation | homogeneous equation | Equations with zero right-hand side  $A\boldsymbol{x}=\boldsymbol{0}$, its solution set must be a subspace |
| solution set | solution set | satisfy all equations  $\boldsymbol{x}$  The set composed of is generally not a subspace when the right end is non-zero. |

---

[← Lecture 5](/en/notes/mit-1806/lec05) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 7 →](/en/notes/mit-1806/lec07)
