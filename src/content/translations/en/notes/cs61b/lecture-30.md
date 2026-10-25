---
kind: notes
source: cs61b/lecture-30
title: "Lecture 30 · Sorting II: Insertion Sort, Inversions, Merge Sort, and
  Stability"
description: "CS61B Lecture 30: Sorting II: Insertion sort and merge sort:
  reverse pair theory, insertion sort adaptability, divide and conquer method,
  merge sort and stability analysis"
sourceHash: 7841b513367afe9db43d61de61969a703e7cc45596ab46b0a8a69d60fe337b61
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 6: Advanced Data Structures and Classic Sorting (Tries & Sorting Algorithms)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 49:48 ｜ **Official original version**: Lecture 30 - Sorting II Mergesort Insertion Sort  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1MqmOxfh1c6gS4hk9hvuRR_hWXWTnCIXMqLGXwRX4Pvk) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort)  
> **Quick navigation**: [← Previous lecture (P29 Sorting I: Selection sort and in-place heap sort)](/en/notes/cs61b/lecture-29) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P31 Software Engineering II: Architectural Design Patterns and Engineering Decoupling) →](/en/notes/cs61b/lecture-31)

---

## 1. Adaptability of Inversions and Insertion Sort

*(Reference time: 00:01:25 · [Video jump (P30 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30&t=85))*

The core intuition of insertion sort is like sorting a hand of playing cards: taking a card from the unsorted interval and inserting it into the appropriate position in the sorted hand on the left.

### Reverse Pairs and Running Time Theorem
An \*\*reverse order pair (Inversion)\*\* in the array refers to a pair that satisfies the subscript  $i < j$  But the value  $A[i] > A[j]$  pair of elements.
> **Insertion sort core theorem**:   
> **The number of data exchanges performed by insertion sort is exactly equal to the total number of reverse-order pairs in the array!**

- **best case scenario**: The array is already sorted (the number of reverse-order pairs is 0). The algorithm only needs to scan once and make a single comparison, and the running time is amazing  **$\Theta(N)$  linear time**!
- **worst case scenario**: The array is in complete reverse order (the number of pairs in reverse order is  $\frac{N(N-1)}{2}$), time consuming  $\Theta(N^2)$.
- **Industrial grade value**: For tiny data sets that are "Nearly Sorted", insertion sort is usually the fastest algorithm in the universe, surpassing all complex algorithms.  $O(N \log N)$  Algorithm!

## 2. The pinnacle of the divide-and-conquer method: Mergesort algorithm design

*(Reference time: 00:11:30 · [Video jump (P30 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30&t=690))*

Mergesort was invented by von Neumann, the father of modern computers, in 1945. It is the ultimate classic of Divide and Conquer:

1. **Divide**: Cut the current unordered array into left and right halves from the middle;
2. **Conquer**: Recursively merge and sort the left half and right half respectively;
3. **Combine**: Merge two ordered subarrays into a larger monotonic ordered array.

```mermaid
graph TD
    A["[ 8, 3, 2, 9, 7, 1, 5, 4 ]"] --> B1["[ 8, 3, 2, 9 ]"]
    A --> B2["[ 7, 1, 5, 4 ]"]
    B1 --> C1["[ 2, 3, 8, 9 ] (Recursive sorting)"]
    B2 --> C2["[ 1, 4, 5, 7 ] (Recursive sorting)"]
    C1 --> M["Linear merge of two pointers: [ 1, 2, 3, 4, 5, 7, 8, 9 ]"]
    C2 --> M
```

## 3. The master theorem and strictness of merge sort  $\Theta(N \log N)$  prove

*(Reference time: 00:21:40 · [Video jump (P30 00:21:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30&t=1300))*

Analyze the recursion level of the merge tree:
- Array size from  $N$  Each time it is divided by 2, the height of the recursive tree is strictly  $\log_2 N$; 
- In each layer, the total time consumption of double pointer merging operations of all sub-arrays is always  $\Theta(N)$; 
- Recursive trees share  $\log_2 N$  layer, cost per layer  $\Theta(N)$; 
- **total time complexity**: 
  $$\text{Total Time} = \Theta(N) \times \log_2 N = \Theta(N \log N)$$
 Regardless of whether the input data is in completely forward order, completely in reverse order, or completely random, the time consuming of merge sort is absolutely constant.  **$\Theta(N \log N)$**!

## 4. The golden attribute of sorting algorithms: Stability (Stability)

*(Reference time: 00:31:00 · [Video jump (P30 00:31:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30&t=1860))*

### Why is stability important?
Suppose we search for products on an e-commerce website and first sort them by "User Rating"; then we click "Sort by Price".  
If the sorting algorithm is \*\*stable\*\*: when the price is the same, products with higher ratings will still be ranked first (the relative order of the previous round of sorting is retained)!  
If it is unstable, the previous sorting results will be completely disrupted.

- **Merge sort is stable** (When comparing two pointers, equal elements are taken first from the left subarray);
- **Insertion sort is stable**; 
- **Heap sort and quick sort are unstable**.

## 5. Summary of this lecture and post-class self-assessment

*(Reference time: 00:39:00 · [Video jump (P30 00:39:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30&t=2340))*

### Comprehensive self-test questions after class
What is the biggest disadvantage of merge sort?  
**Answers and analysis**:   
**The space overhead is large (Not In-Place)!**  When performing double pointer merging, a length of  $N$  The auxiliary temporary array is used to temporarily store data, and the space complexity is  $O(N)$. Java prefers quicksort with no additional space overhead when sorting primitive primitive types.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 30. Quicksort

- [30.1 Partitioning](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.1-partitioning.md)

- [30.2 Quicksort Algorithm](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.2-quicksort-algorithm.md)

- [30.3 Quicksort Performance Caveats](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.3-quicksort-performance-caveats.md)

- [30.4 Summary](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.4-summary.md)

- [30.5 Exercises](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.5-exercises.md)

---

## 30.1 Partitioning

Previously, we’ve covered **selection sort, heap sort, merge sort, and insertion sort**.

These sorts each have a basic idea powering them: 

* Selection sort: find the smallest item, put it at the front

* Heap sort: use MaxPQ to find the maximum element, put it at the front

* Merge sort: merge two sorted halves into one sorted whole 

* Insertion sort: determine where to insert the current item

The core idea behind Quicksort involves **partitioning.** 

Specifically, to partition an array a\[], first pick an element x = a\[i] as the pivot. 

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p>In this array, x = 10 and is the pivot element. This array has not be partitioned on x = 10 yet. </p></figcaption></figure>

Partitioning on that pivot element (x) involves rearrange a\[] such that: 

1. x moves to some position j (can be the original position of i)

2. All array elements to the left of x are less than or equal to x (<= x) 

3. All array elements to the right of x are greater than or equal to x (>= x)

In the following arrays, A, B, and C represent arrays that are valid partitions (with the pivot being x = 10), while D represents an invalid partition.

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p>D is an invalid partition because 4 is less than 10, but is to the right of the pivot after the partition. </p></figcaption></figure>

<br>

---

## 30.2 Quicksort Algorithm

The figure below shows a partition performed on the pivot of 5. Notice how 5 in its “proper place” (in other words, it’s exactly where it should be if the entire array was sorted).

This suggests that the partition procedure can be used recursively on the two halves to the left and to the right of the pivot element. 

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p>After partitioning on the pivot element of 5, 5 is in the “proper place” and there are two halves left to be sorted. The left half are the four elements of [3, 2, 1, 4], and the right half consists of the three elements of [7, 8, 6]. </p></figcaption></figure>

The properties that partitioning provides inspires Tony Hoare’s Quicksort algorithm. 

**Quicksort Algorithm** 

To quicksort N items: 

1. Partition on the leftmost item as the pivot. 

2. Recursively quicksort the left half. 

3. Recursively quicksort the right half. 

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p><a href="https://docs.google.com/presentation/d/1QjAs-zx1i0_XWlLqsKtexb-iueao9jNLkN-gW9QxAD0/edit?usp=sharing">Demo of quicksort is linked here</a></p></figcaption></figure>

<br>

---

## 30.3 Quicksort Performance Caveats

"Quicksort" was chosen by Tony Hoare as the name for this particular partition sort algorithm. Coincidentally, quicksort is empirically the fastest sort for most common situations. 

How fast is Quicksort exactly? To answer this question, we need to count the number and calculate the difficulty of the partition operations employed in Quicksort. 

In the theoretical runtime analysis, partitioning costs $$\Theta(K)$$ time, where $$\Theta(K)$$ is the number of elements being partitioned.

However, what complicates runtime analysis for Quicksort is that the the overall runtime will depend on where the pivot ends up. 

##### Best Case

For instance, the best case runtime is when the pivot chosen always lands in the middle (in other words, the partition always picks the median element of the array). 

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p>Best Case</p></figcaption></figure>

In the best case, the total work done at each level is approximately O(N). To see this, the first partition pivots on one element and requires checking all N elements to determine whether they go on the right or the left of the pivot element. The second layer repeats this, but for N/2 elements on two separate pivots (since we are recursively partitioning on the two halves). Thus, each level is O(N) work. 

The overall runtime becomes $$\Theta(NH)$$, where H = # of layers = $$\Theta(log N)$$. Thus, the total runtime for Quicksort in the best case is $$\Theta(N log N)$$.

##### Worst Case

The worst case for runtime occurs when the pivot chosen at each partition lands at the beginning of the array. In this scenario, each layer still has to do O(N) work, but now there are H = # of layers = N layers, since every single element has to be pivoted on. Thus, the worst case runtime is $$\Theta(N^2)$$.

<figure><a href="https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort">The original textbook illustration is unavailable. See the Quicksort chapter for an explanation.</a><figcaption><p>Worst Case: <span class="math">\Theta(N^2)</span></p></figcaption></figure>

##### Quicksort vs Mergesort Performance

| Theoretical Analysis | Quicksort           | Mergesort           |

| -------------------- | ------------------- | ------------------- |

| Best Case            | $$\Theta(N log N)$$ | $$\Theta(N log N)$$ |

| Worst Case           | $$\Theta(N^2)$$     | $$\Theta(N log N)$$ |

In comparison, Mergesort seems to be a lot better, since Quicksort suffers from a theoretical worst case runtime of $$\Theta(N^2)$$. So how can Quicksort be the fastest sort empirically? Quicksort's advantage empirically comes from the fact that on average, Quicksort is $$\Theta(NlogN)$$.

##### Quicksort's Performance Argument #1: 10% Case

One argument for why Quicksort is the fastest sort empirically supposes that the pivot always ends up at least 10% from either edge. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Ff3VdKzh7Qk80fJYPsLfx%2FScreen%20Shot%202023-03-31%20at%2011.40.20%20PM.png?alt=media&amp;token=2038f3e0-d93d-49b7-b162-eea5b975d602" alt=""><figcaption><p>Pivot is ~10% from the left edge.</p></figcaption></figure>

If this is the case, then the runtime is still O(NH), where O(N) is the work at each level and H is the # of levels. Since the pivot always lands at least 10% from either edge, H is approximately $$\log\_{10/9} N$$= O(log N). Thus, overall runtime is O(N log N).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F3Uneahfgj49ErzuyZnUw%2FScreen%20Shot%202023-03-31%20at%2011.45.27%20PM.png?alt=media&amp;token=6b33dfb8-edb8-4e3b-8200-c10c348b6091" alt=""><figcaption><p>10% case partition work at each level.</p></figcaption></figure>

In other words, even if you are not lucky enough to have a pivot that is near the middle, if you can at least have a pivot that is always 10% from the edge, the runtime will be O(N log N). 

##### Quicksort's Performance Argument #2: Quicksort is BST Sort

From another lens, Quicksort can be seen as a form of BST sort. This is because the compareTo calls that Quicksort employs between each element and the pivot element in each partition is the same as the compareTo calls performed in BST insert. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FQFkLLTcTNb5fD0csTW8x%2FScreen%20Shot%202023-03-31%20at%2011.48.25%20PM.png?alt=media&amp;token=cf7bde6e-f568-4cea-a19c-5891d54392cf" alt=""><figcaption><p>BST insert</p></figcaption></figure>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F2scQ8aNKuisTvdK98CVX%2FScreen%20Shot%202023-03-31%20at%2011.49.08%20PM.png?alt=media&amp;token=131236dc-af6c-4e12-a24b-e8482c611733" alt=""><figcaption><p>Quicksort partitions on the "same" BST elements as above.</p></figcaption></figure>

Since random insertion into a BST takes O(N log N) time, Quicksort can be argued to have similar performance. 

##### Empirical Quicksort Runtime

Empirically, for N items, Quicksort uses an average of \~2N ln N compares to complete (across 10,000 trials with N = 1000). For more information, [check out this link](http://www.informit.com/articles/article.aspx?p=2017754\&seqNum=7).

##### Avoiding the Worst Case of Quicksort

As you can see from above, the performance of Quicksort (both in terms of order of growth and in constant factors) depends critically upon **how you select the pivot, how you partition around the pivot, and other optimizations that you can add to speed things up.** 

Given certain conditions, Quicksort can result in $$\Theta(N^2)$$, which is much worse than $$\Theta(N log N)$$. Some of these conditions include **bad ordering,** where the array is already in sorted order (or almost sorted order), and **bad elements,** where the array has all duplicates. 

---

## 30.4 Summary

**Insertion Sort Sweet Spots.** We concluded our discussion of insertion sort by observing that insertion sort is very fast for arrays that are almost sorted, i.e. that have Θ(N) inversions. It is also fastest for small N (roughly N≤15).

**Partitioning.** Partioning an array on a pivot means to rearrange the array such that all items to the left of the pivot are ≤ the pivot, and all items to the right are ≥ the pivot. Naturally, the pivot can move during this process.

**Partitioning Strategies.** There are many particular strategies for partitioning. You are not expected to know any particular startegy.

**Quicksort.** Partition on some pivot. Quicksort to the left of the pivot. Quicksort to the right.

**Quicksort Runtime.** Understand how to show that in the best case, Quicksort has runtime Θ(Nlog⁡N), and in the worse case has runtime $$Θ(N^2)$$.

**Pivot Selection.** Choice of partitioning strategy and pivot have profound impacts on runtime. Two pivot selection strategies that we discussed: Use leftmost item and pick a random pivot. Understand how using leftmost item can lead to bad performance on real data.

**Randomization.** Accept (without proof) that Quicksort has on average Θ(Nlog⁡N) runtime. Picking a random pivot or shuffling an array before sorting (using an appropriate partitioning strategy) ensures that we’re in the average case.

**Quicksort properties.** For most real world situations, quicksort is the fastest sort.

---

## 30.5 Exercises

### Factual

1. Suppose we have a sorted array in Java. What is the best approach for finding a particular item in the array: binary search or linear iteration?

2. Repeat the above exercise for a sorted array stored on physical tape.

3. Given the array `[90, 50, 20, 30, 40, 10, 60, 50, 30]`, what would be the best pivot?

<details>

<summary>Problem 1</summary>

Binary search. Binary search would take $$\log N$$ time, where $$N$$ is the length of the array.

</details>

<details>

<summary>Problem 2</summary>

On a physical tape, the runtime of the algorithm will be dominated by the time to accelerate the physical piece of tape. In the worst case, binary search would involve scanning to the middle of the tape, then a quarter of the way back, then an 1/8th of the way forward, and so forth. In the worst case, we have to cover N/2 + N/4 + N/8 + ... + 1 or O(N) spaces on the tape. However, all that acceleration back and forth will result in an algorithm that is almost certainly slower in the worst case than just scanning forwards.

</details>

<details>

<summary>Problem 3</summary>

40; it is the median which will evenly partition the array.

</details>

### Procedural

1. If we have 10 items to sort, how many compares will it take to selection sort all of the items?

2. What is the depth of the quicksort recursive tree in the best and worst case? Give an exact answer, not a theta bound.

<details>

<summary>Problem 1</summary>

45 total; first we do 9 compares to find the smallest item, then 8, then 7, etc. 1 + 2 + 3 + ... 9 = 45.

</details>

<details>

<summary>Problem 2</summary>

In the worst case, we make $$N$$ recursive calls if we always choose the smallest or largest item as our pivot. Thus, the recursive tree has depth $$N$$.

In the best case, we always choose the median as our pivot. This halves the size of the array at each level, resulting in $$\log\_2 N$$ levels.

</details>

### Metacognitive

1. Assume that we always pick the leftmost item as our pivot for quicksort. Identify the three types of arrays that will cause a worst-case runtime. For partitioning, assume that we partition into two arrays: items less than or equal to the pivot, and items greater than the pivot.

<details>

<summary>Problem 1</summary>

The two types of arrays are:

1. Arrays already in sorted order. There will always be nothing to the left of the pivot, since the pivot will always be the smallest item.

2. Arrays in reverse-sorted order. This has the same problem as (1), except that the pivot will always be the largest item. 

3. Arrays where all items are equal. Everything will be partitioned into the left (less than or equal to array), and nothing in the greater-than array.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Sorting I: Selection sort and in-place heap sort](/en/notes/cs61b/lecture-29) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Software Engineering II: Architectural Design Patterns and Engineering Decoupling →](/en/notes/cs61b/lecture-31) | [🎬Watch this lecture on Bilibili (P30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=30) |
