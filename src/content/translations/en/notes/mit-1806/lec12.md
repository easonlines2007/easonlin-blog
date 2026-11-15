---
kind: notes
source: mit-1806/lec12
title: Lecture 12 · Graphs, Networks and Correlation Matrix
description: Use correlation matrices to describe graphs and networks, and
  understand loops, potentials and Kirchhoff's laws.
sourceHash: 13e338ca9e300760206bd56f3304153a6476802f0f25b2da87708d31f10823c5
publish: true
translationMethod: machine-assisted
---

> *Graphs, networks, incidence matrices* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 12 / Total 35 Lectures** ｜Part 1 · Elimination and Vector Spaces

**Video of this lecture**: [Bilibili p12 · Graphs, networks and correlation matrices](https://www.bilibili.com/video/BV1ix411f7Yp?p=12)(47:57)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-12-graphs-networks-incidence-matrices/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=12&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

The matrices used in the first eleven lectures were mostly written temporarily to teach concepts. Real linear algebra doesn't look like this: matrices in engineering and science come from specific problems, with clear structures, and users rely on these structures to read the answers. This lecture gives a discrete version of one of the most important models in applied mathematics——**Figure** (graph), and derived from the graph **correlation matrix** (incidence matrix). Each row of it has only two non-zero elements, and the relationship between rows corresponds to the **loop**(loop).

The main line is to correspond the physical quantities on the diagram to the four basic subspaces one by one. Taking the circuit as an example, what is placed on the node is **potential** (potential), next to it is **Potential difference** (potential difference) and **current** (current). correlation matrix  $A$  Convert the node potential into the potential difference on the edge; $A\boldsymbol{x}=\boldsymbol{0}$  The solution of shows that raising all potentials by a constant at the same time will not change the difference on any side, so  $A$  The null space of is one-dimensional. And  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  That’s it **Kirchhoff's current law** (Kirchhoff's current law, KCL), which requires that the inflow of each node is equal to the outflow, and the solution space is formed by the circulation on the loops.

So the real conclusion of this lecture is a comparison table: the null space corresponds to the electric potential that "can only be determined to differ by a constant", the left null space corresponds to the current that "flows around the loop and does not accumulate charges at the nodes", and the combination of rank, number of nodes and number of edges gives **Euler's formula** (Euler's formula). The last section strings the three-level relationships into a balanced equation  $A^{\mathsf T}CA\boldsymbol{x}=\boldsymbol{F}$.

![Official Handout Summary Page 1/4](</attachments/mit1806-24e9bad2be2f45bca9d9ef6e.png>)

*MIT OCW Official Lecture Notes Summary Page 1/4 (18.06SC Lecture 12 Summary, CC BY-NC-SA 4.0).*

## 1. Graph, edge and association matrix

Pictured by **node** (node) with **side** (edge) composition. take  $n=4$  nodes, number  $1,2,3,4$, and  $m=5$  Edge. Before writing a matrix, you must first set a direction for each edge: the direction is artificially specified and is only used to determine the sign - the current flows along the arrow to be positive, and if it flows against it, it is negative. The five edges are taken as follows: edge 1 goes from node 1 to node 2, edge 2 goes from 2 to 3, edge 3 goes from 1 to 3, edge 4 goes from 1 to 4, and edge 5 goes from 3 to 4.

**correlation matrix** $A$  The rows correspond to edges and the columns correspond to nodes, which is  $m\times n=5\times 4$  matrix. Each row is non-zero at only two endpoints of this edge: **tail** Node filling  $-1$, **head** Node filling  $+1$, the remaining positions are  $0$. So



$$
A=\begin{bmatrix}
-1&1&0&0\\
0&-1&1&0\\
-1&0&1&0\\
-1&0&0&1\\
0&0&-1&1
\end{bmatrix}.
$$



There are exactly two non-zero elements in each row, and the total number of non-zero elements is  $2m=10$. The larger the graph, the larger the matrix, but almost all of them are zeros. Such a matrix is called **sparse matrix** (sparse matrix). This type of matrix is ​​not compiled casually: links between web pages around the world, phone calls, and relationships between people can all be drawn into diagrams and then written into such a matrix, and the structure of the matrix is ​​the entrance to problem solving. The web graph is the most typical one: each web page is a node, each hyperlink is an edge, the matrix is ​​too large to be written down at all, but it is equally sparse, and its null space and left null space also need to be asked.

The grid is just one interpretation of a correlation matrix. The same matrix can describe a water network—the flow of water or oil—or a structure, such as the design of a bridge or a dome. The quantities on the nodes are replaced by water pressure, temperature or displacement, the quantities on the edges are replaced by flow or internal force, and the matrix remains unchanged. After getting such a matrix, the four questions to ask are still the same as in the previous lectures: null space, column space, row space, and left null space. The only difference in this lecture is that these four answers can be read directly from the picture without elimination.

put  $A$  Multiply it by a vector and see what it computes. Set  $\boldsymbol{x}=(x_1,x_2,x_3,x_4)$, and interpret the components as potentials on the four nodes, then



$$
A\boldsymbol{x}=\begin{bmatrix}
x_2-x_1\\
x_3-x_2\\
x_3-x_1\\
x_4-x_1\\
x_4-x_3
\end{bmatrix}.
$$



The result is a five-dimensional vector whose five components are the differences in electric potentials at each of its five sides. That is to say, $A$  Convert "quantity on nodes" to "difference on edges". This is what an association matrix is ​​all about, and where it gets its name: it records which two nodes each edge is connected to.

![Video 00:04:48: Classroom blackboard writing](</attachments/mit1806-41ac0c73ae9ce893f6c06083.jpg>)

*Video 00:04:48 \| Approximately corresponding to Section 1 "1. Graph, Edge and Association Matrix".*

## 2. Null space: The electric potential is only determined to a constant difference.

Now for the most basic question: $A$  Are the four columns of are linearly independent? Asking equivalently, $A\boldsymbol{x}=\boldsymbol{0}$  Is there any non-zero solution? Write the equation line by line:



$$
x_2-x_1=0,\quad x_3-x_2=0,\quad x_3-x_1=0,\quad x_4-x_1=0,\quad x_4-x_3=0.
$$



The first equation gives  $x_2=x_1$, the second equation gives  $x_3=x_2$, the fourth formula gives  $x_4=x_1$, then all four components are equal, and the remaining two equations are automatically established. The null space is therefore



$$
N(A)=\left\{c\begin{bmatrix}1\\1\\1\\1\end{bmatrix}:c\in\mathbb{R}\right\},
$$



In one dimension, the basis is an all-1 vector. Four columns are linearly related, and the all-1 vector is the set of coefficients that are not all zero——$A$  The four columns of add up to a zero vector. If the four columns are linearly independent, there should only be zero vectors in the null space; now that we have really found a non-zero solution, the four columns must be related, and the rank will not be 4. The question "Are the four columns independent?" was translated into "What else is there besides the zero vector in the null space?" This is the same perspective that has been used repeatedly in the previous lectures.

The physical meaning is very straightforward: when the electric potentials of the four nodes are completely equal, the electric potential differences on the five edges are zero, and nothing will flow. On the other hand, the only thing the graph can determine is the potential difference; add the same constant to the four potentials at the same time  $c$, none of the differences on the five sides remains unchanged. Therefore, the electric potential is only determined to differ by a constant, which is the same as the one after the indefinite integral  $+c$  It's the same thing - to fix the constant, you have to specify an additional starting point. Temperature is the same: heat flows from high temperature to low temperature. When the temperature is the same everywhere, there is no heat flow. The zero point of temperature can be specified arbitrarily, whether using degrees Celsius or absolute temperature scale, the difference is only a constant. The engineering approach is to put a certain node **ground** (ground), that is, its electric potential is determined as  $0$, for example let  $x_4=0$. The effect of grounding on the matrix is ​​to delete the corresponding column: the remaining three columns are linearly independent, and the degree of freedom of "simultaneously raising a constant" disappears.

So the rank is  $n-1=3$. Any three of the four columns are linearly independent, and the only dependence is the one given by the all-1 vector; in other words, any three of the four potentials are a set of useful independent variables, and the fourth one is redundant. Grounding is to fix this redundant quantity. column space  $C(A)$  It is formed by the potential difference vectors on five edges, and the dimension is equal to rank 3, but  $\mathbb{R}^5$  A three-dimensional subspace in: Starting from a node potential vector, going around any loop, the differences in each segment cancel out end-to-end. This constraint compresses the achievable potential difference into three dimensions.

![Video 00:10:17: Classroom blackboard writing](</attachments/mit1806-2f9bc7810d41c1a597c68c0b.jpg>)

*Video 00:10:17 \| Approximately corresponding to section 2 "2. null space: the electric potential is only determined to a constant difference".*

![Official Handout Summary Page 2/4](</attachments/mit1806-1a0b13ad782646d1a4498f3a.png>)

*MIT OCW Official Lecture Notes Summary Page 2/4 (18.06SC Lecture 12 Summary, CC BY-NC-SA 4.0).*

![Video 00:18:13: Classroom blackboard writing](</attachments/mit1806-133ad3c449dafd90ee4e3cd3.jpg>)

*Video 00:18:13｜Approximately corresponding to section 2 "2. null space: the electric potential is only determined to a constant difference".*

## 3. Transposition and Kirchhoff’s current law

put  $A$  Transpose, get  $n\times m=4\times 5$  matrix  $A^{\mathsf T}$, its rows correspond to nodes and columns correspond to edges:



$$
A^{\mathsf T}=\begin{bmatrix}
-1&0&-1&-1&0\\
1&-1&0&0&0\\
0&1&1&0&-1\\
0&0&0&1&1
\end{bmatrix}.
$$



Set  $\boldsymbol{y}=(y_1,\dots,y_5)$  are the currents on the five sides. Equation  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  Expand into four equations:



$$
-y_1-y_3-y_4=0,\qquad y_1-y_2=0,\qquad y_2+y_3-y_5=0,\qquad y_4+y_5=0.
$$



The first line only involves edges 1, 3, and 4, and these three edges happen to originate from node 1, so it says "the sum of the currents flowing out of node 1 is zero." The second row belongs to node 2: edge 1 comes in, edge 2 goes out, and in equals out. The third row belongs to node 3: $y_2,y_3$  inflow, $y_5$  outflow. The fourth row belongs to node 4: the arrows of edges 4 and 5 both point to it, and the two incoming currents must cancel each other out.

The sum of these four equations is **Kirchhoff's current law**: The inflow at each node is equal to the outflow, and the charge does not accumulate at the node. It is the discrete form of the conservation law, and  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  It can be called the most basic equation in applied mathematics. The dimensions can be written down without having to solve the equation: $A^{\mathsf T}$  is  $4\times 5$  The matrix of $m=5$  There are  $r=3$  pivot columns, leaving  $m-r=2$  free columns, each free variable gives a special solution, so



$$
\dim N(A^{\mathsf T})=m-r=5-3=2 .
$$



The same thing is true from the perspective of the process of elimination. $A^{\mathsf T}$  There are only three pivots, and when the elimination proceeds to the last row, the entire row must be reduced to zero - four rows and a rank of three, indicating that one row is a combination of the other three rows. The simplest form is then given to each of the two free variables to a special solution, and these are interpreted back to the graph, and what is obtained is the circulation on the two loops.

There is no need to perform elimination to find the basis of this two-dimensional space. You can figure it out by looking at the picture: the current that does not accumulate at any node can only be the current that circulates along the loop. Let 1 amp go along the loop  $1\to2\to3\to1$  Flow: On edge 1  $y_1=1$, on edge 2  $y_2=1$, the arrow on side 3 is  $1\to3$, opposite to the flow direction, so  $y_3=-1$, the other two sides are zero, we get



$$
\boldsymbol{y}=\begin{bmatrix}1&1&-1&0&0\end{bmatrix}^{\mathsf T}.
$$



Substitute the four equations and check one by one: Node 1  $-y_1-y_3-y_4=-1+1-0=0$, on node 2  $y_1-y_2=1-1=0$, on node 3  $y_2+y_3-y_5=1-1-0=0$, on node 4  $y_4+y_5=0$, all passed. The second basis vector is along the loop  $1\to3\to4\to1$  Flow in a circle: $y_3=1,\ y_5=1,\ y_4=-1$, the rest are zero, that is  $(0,0,1,-1,1)$.

The outermost loop  $1\to2\to3\to4\to1$  This is also the solution: $(1,1,0,-1,1)$. But it is equal to the sum of the first two vectors - along the loop first  $1\to2\to3\to1$  Flow in a circle, then follow the loop  $1\to3\to4\to1$  When flowing in one circle, the two currents on common edge 3 have opposite directions and exactly cancel each other, and the remaining current is the current flowing along the outer circle. So it's not independent, the basis only requires two vectors. $N(A^{\mathsf T})$  Hence the "circulation space": its dimension 2 is exactly the number of independent loops in this graph.

## 4. Trees, pivot columns and Euler’s formula

Rank is 3, so the row space  $C(A^{\mathsf T})$  The dimension of is also 3: only three of the five row vectors corresponding to the five edges are independent. Looking back at the first three lines, $A$  The first row plus the second row is exactly equal to the third row, that is  $R_1+R_2=R_3$. And edges 1, 2, and 3 are connected end to end, forming a loop.  $1\to2\to3\to1$——**The rows corresponding to the edges of the loop are linearly related**. More precisely, take out the combined coefficients of the three rows and write them as vectors  $(1,1,-1,0,0)$, which happens to be the first circulation basis vector obtained in the previous section; the dependency between rows is the loop, which are two ways of saying the same thing.

in  $A^{\mathsf T}$  Perform elimination on the above, the pivot columns are columns 1, 2, and 4, corresponding to edges 1, 2, and 4. These three edges connect all four nodes but do not contain any loops themselves - such a graph is called **tree** (tree). A tree with four nodes has exactly three edges, one less than the number of nodes. This is the smallest structure that is connected and has no loops; as long as one more edge is added, a loop will inevitably be formed, and a certain row will inevitably be a combination of the other rows. This is the geometric interpretation of rank equal to the number of nodes minus one.

In turn, look at the free columns: columns 3 and 5, that is, sides 3 and 5. Each edge complement tree closes exactly one loop, and the number of independent loops is therefore the number of free columns. $m-r=2$  This number has a concrete shape on the diagram - it is two "windows".

Convert the dimensionality formula from the previous section to  $r=n-1$  Combined, they can calculate something that seems to have nothing to do with linear algebra. Let the number of independent loops be  $L$, then



$$
L=\dim N(A^{\mathsf T})=m-r=m-(n-1),
$$



Move the item and get it



$$
n-m+L=1 .
$$



Check with the previous example: $4-5+2=1$. Try another graph: 5 nodes, 7 edges, 3 independent loops, $5-7+3=1$. this is **Euler's formula**. Read it in terms of dimensions: nodes are zero-dimensional objects, edges are one-dimensional and connect two nodes, loops are two-dimensional and enclose an area, so  $n-m+L$  The number is exactly "point minus edge plus surface", which is always equal to 1 for any connected graph. Euler's formula is a topological fact, but here it is proved using the rank formula.

![Video 00:31:10: Classroom blackboard writing](</attachments/mit1806-5df5bed544dd1ef46733e0c6.jpg>)

*Video 00:31:10 \| Approximately corresponding to Section 4 "4. Trees, Pivot Sequences and Euler's Formula".*

![Official Handout Summary Page 3/4](</attachments/mit1806-365c9f1cc976bfda53d33702.png>)

*MIT OCW Official Lecture Notes Summary Page 3/4 (18.06SC Lecture 12 Summary, CC BY-NC-SA 4.0).*

![Video 00:37:35: Classroom blackboard writing](</attachments/mit1806-2dd87c61cdb59b822c861dc2.jpg>)

*Video 00:37:35 \| Approximately corresponding to Section 4 "4. Trees, Pivot Sequences and Euler's Formula".*

## 5. Framework of applied mathematics: $A^{\mathsf T}CA\boldsymbol{x}=\boldsymbol{F}$

When you connect the three levels of relationships, you get a complete picture.

The first step is  $\boldsymbol{E}=A\boldsymbol{x}$: The node potential becomes the potential difference on the five edges.  $\boldsymbol{E}$. The second step is **Ohm's law** (Ohm's law): The current on an edge is proportional to the potential drop at both ends of the edge, and the proportional coefficient is the **Conductance** (conductance), which is the reciprocal of resistance. Written as a matrix it is  $\boldsymbol{y}=C\boldsymbol{E}$, among which  $C$  It's level five **diagonal matrix** (diagonal matrix), the diagonal elements are the conductances of each edge - these numbers are physical constants and have nothing to do with how the graph is connected. The third step is  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{F}$: When an external current is injected into the node, the right end of KCL is no longer zero, $\boldsymbol{F}$  Record the externally injected current at each node.

Three steps are put together to put  $\boldsymbol{E}$  and  $\boldsymbol{y}$  Substituting in order, we get



$$
A^{\mathsf T}CA\boldsymbol{x}=\boldsymbol{F}.
$$



This is the entire network **balance** (equilibrium) equation in the state. Time is not part of it, and Newton's laws are not part of it. The question is just how the current is distributed when everything settles down. This set of equations is not specific to circuits: whenever there is a conserved quantity flowing in each channel, there must be such a balance equation to find. Circuits, pipe networks, and static structures all fall into the same pattern. The actual solution of such equations is one of the core tasks of numerical linear algebra and can be very large;  $A$  The sparse structure of is exactly what the algorithm can use.

External forces can be added from two places and fall on different layers: adding **battery**, what changes is the potential difference layer; connect the **current source**, what changes is the current balance layer, that is  $\boldsymbol{F}$  is no longer zero. The former falls between the first and second steps, and the latter falls on the right end of the third step.

What is noteworthy about this set of equations is that, $A$  with  $A^{\mathsf T}$  are present at the same time. The matrix in the real problem is rectangular, and the rows and columns do different things, so a matrix needs to be equipped with a transpose - this is why we insist on calculating all four subspaces in the previous lectures.

One last observation. $A^{\mathsf T}A$  It must be **symmetric matrix** (symmetric matrix), because



$$
(A^{\mathsf T}A)^{\mathsf T}=A^{\mathsf T}(A^{\mathsf T})^{\mathsf T}=A^{\mathsf T}A .
$$



In the same way, when  $C$  When is the diagonal matrix composed of the conductance of each side, $A^{\mathsf T}CA$  It's also symmetrical. The network equation finally falls on a symmetric matrix, which will be encountered again and again later.

![Video 00:43:10: Classroom blackboard writing](</attachments/mit1806-65a5e94b22012f2df60b81bd.jpg>)

*Video 00:43:10 \| Approximately corresponding to Section 5 "5. Framework of Applied Mathematics: $A^{\mathsf T}CA\boldsymbol{x}=\boldsymbol{F}$"Nearby.*

![Official Handout Summary Page 4/4](</attachments/mit1806-d342100cdb0f992b8feb8a84.png>)

*MIT OCW Official Lecture Notes Summary Page 4/4 (18.06SC Lecture 12 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- A graph is composed of nodes and edges; after specifying the direction for each edge, you can write  $m\times n$  of **correlation matrix**: The row corresponds to the edge, fill in the end node of the edge  $-1$, fill in the head node  $+1$. This example  $n=4$, $m=5$, there are only two non-zero elements in each row, the total number of non-zero elements  $2m=10$.
- $A\boldsymbol{x}$  Calculates the potential difference across each edge, where  $\boldsymbol{x}$  is the electric potential vector at the node.
- $A$  The one-dimensional null space of is spanned by all 1 vectors: the electric potential can only be determined up to a constant difference. ground (make a  $x_j=0$, delete this column) can determine the dead benchmark; therefore  $r=n-1=3$, any three of the four columns are linearly independent.
- $A^{\mathsf T}$  The rows correspond to nodes, $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$  That’s it **Kirchhoff's current law**: The inflow of each node is equal to the outflow, and the charge does not accumulate at the node.
- $\dim N(A^{\mathsf T})=m-r=2$, the basis is the circulation on two independent circuits  $(1,1,-1,0,0)$  with  $(0,0,1,-1,1)$; Circulation of the outermost large loop  $(1,1,0,-1,1)$  It is the sum of the two and therefore not independent.
- A loop causes corresponding rows to be linearly related: edges 1, 2, and 3 form a loop, so  $R_1+R_2=R_3$, the combination coefficient is exactly the circulation vector.
- $A^{\mathsf T}$  The pivot columns are columns 1, 2, and 4, corresponding to a loop-free node containing all four nodes. **tree**;Rank  $r=n-1$  Represents the smallest connected structure with one less edge than node.
- Euler's formula  $n-m+L=1$($L$  is the number of independent circuits) is given by  $L=m-r$  with  $r=n-1$  launch, verify  $4-5+2=1$, another example  $5-7+3=1$.
- Three-layer equation of the network: $\boldsymbol{E}=A\boldsymbol{x}$ (potential difference), $\boldsymbol{y}=C\boldsymbol{E}$ (Ohm's law, $C$  is the conductance diagonal matrix), $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{F}$ (KCL with current source), which adds up to  $A^{\mathsf T}CA\boldsymbol{x}=\boldsymbol{F}$.
- $A^{\mathsf T}A$  It is always a symmetric matrix; $C$  When it is a diagonal matrix  $A^{\mathsf T}CA$  Also symmetrical.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| graph | Figure | A discrete structure composed of nodes and edges, one of the most basic models of applied mathematics |
| node | node | Points on the graph are the locations of state quantities such as electric potential and temperature. |
| edge | side | The line connecting two nodes, the channel through which current and flow pass |
| incidence matrix | correlation matrix | Rows correspond to edges, columns correspond to nodes, and the tail is filled in  $-1$, head-end filling  $+1$  matrix |
| sparse matrix | sparse matrix | A matrix with few non-zero elements. The correlation matrix has only two non-zero elements in each row. |
| potential | potential | Only the potential difference has physical meaning for the state quantity on the node. |
| potential difference | Potential difference | The difference in potential between the two ends of a side is exactly  $A\boldsymbol{x}$  weight |
| current | current | The flow rate on the edge is related to the potential difference by Ohm's law. |
| Kirchhoff's current law | Kirchhoff's current law | The inflow of each node is equal to the outflow, written as  $A^{\mathsf T}\boldsymbol{y}=\boldsymbol{0}$ |
| loop | loop | A string of edges connected end to end, corresponding to  $A$  The row depends on the  $A^{\mathsf T}$  the null space of |
| tree | tree | A connected graph without loops, $n$  nodes have exactly  $n-1$  strip edge |
| Euler's formula | Euler's formula | $n-m+L=1$, the number of nodes minus the number of edges plus the number of independent loops is always  $1$ |
| Ohm's law | Ohm's law | The current is equal to the conductance multiplied by the potential drop, which is  $\boldsymbol{y}=C\boldsymbol{E}$ |
| conductance | Conductance | The reciprocal of resistance, the coefficient of proportionality in Ohm's law |
| equilibrium | balance | A state in which neither time nor acceleration appears, and each quantity has stabilized. |

---

[← Lecture 11](/en/notes/mit-1806/lec11) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 13 →](/en/notes/mit-1806/lec13)
