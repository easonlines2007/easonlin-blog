---
kind: notes
source: cs61b/lecture-32
title: "Lecture 32 · Sorting III: Quicksort, Pivot Selection, and Three-Way
  Partitioning"
description: "CS61B Lecture 32: Sorting III: Quick Sort and Dutch Flag Three-Way
  Segmentation: Divide and Conquer Philosophy, Pivot Axis Selection, Lomuto and
  Hoare Division, Three-Way Segmentation and Degenerate Defense"
sourceHash: 25be1fd69df32d83b12d5c12fa6b8e669bc0b850cb90464c93411705d5802763
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 6: Advanced Data Structures and Classic Sorting (Tries & Sorting Algorithms)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 50:45 ｜ **Official original version**: Lecture 32 - Sorting III:  Quicksort  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/11vRyW0ZPrsxUhRHCBgkygy01PlL1amB66n9FZQN03wo) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/32.-more-quick-sort-sorting-summary)  
> **Quick navigation**: [← Previous lecture (P31 Software Engineering II: Architectural Design Patterns and Engineering Decoupling)](/en/notes/cs61b/lecture-31) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P33 Sorting IV: Theoretical lower bound proof based on comparative sorting) →](/en/notes/cs61b/lecture-33)

---

## 1. Quicksort: Turing Award winner Tony Hoare’s divide-and-conquer masterpiece

*(Reference time: 00:01:25 · [Video jump (P32 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=85))*

Merge sort puts the main work in the "Merge" stage after recursion, while quick sort puts the core wisdom in the "Partitioning" stage before recursion!

### core divide and conquer philosophy
1. **Pivot Selection**: Select a reference element in the array to be sorted  $p$; 
2. **Partitioning**: Rearrange the array so that:
   - All elements to the left of the axis are less than or equal to  $p$; 
   - All elements located to the right of the axis are greater than or equal to  $p$; 
   - pivot element  $p$  At this time, it is accurately anchored in the final and correct position in the final order!
3. **Process both sides recursively**: Run quick sort recursively on the subranges on the left and right sides of the axis.

## 2. Worst-case degradation of the algorithm and random disruption of the moat

*(Reference time: 00:11:30 · [Video jump (P32 00:11:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=690))*

- **best case scenario**: The Pivot selected each time is exactly the median, the left and right sides are equal in size, and the height of the recursive tree is  $\log_2 N$, the time complexity is extremely fast  **$\Theta(N \log N)$**; 
- **worst case disaster**: If the array is completely sorted, and we fixedly select the first element as the Pivot:
  - After each split, the left side is empty and the right side is  $N - 1$  elements;
  - The recursive tree degenerates into a depth of  $N$  slender chain;
  - The number of comparisons degenerates into the classic summation of arithmetic sequences: $\Theta(N^2)$!

### Industrial-grade anti-degradation trick: pre-shuffle (Shuffle)
Before performing quick sort, **Unconditionally use the Fisher-Yates algorithm to perform a completely uniform random shuffle on the input array (Random Shuffle)**!  
Mathematical probability proof: after any specific harmful input pattern (such as ascending order, reverse order) is randomly disrupted, trigger  $O(N^2)$  The worst-case scenario is much lower than being hit by a meteorite on the road. The average running time converges steadily to  **$\sim 1.39 N \log_2 N$**!

## 3. The disaster of a large number of repeated elements and Dijkstra’s three-way partitioning (3-Way Partitioning)

*(Reference time: 00:22:15 · [Video jump (P32 00:22:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=1335))*

When the array contains a large number of duplicate key values (for example, millions of elements are all 1 and 2), traditional quick sort will fall into the quagmire of left-right imbalance.

Edsger Dijkstra proposed a three-color arrangement like the Dutch flag. **3-Way Partitioning**:   
Split the array into three pieces:
- An interval less than Pivot (`< Pivot`); 
- **The interval exactly equal to Pivot (`== Pivot`)**; 
- An interval greater than Pivot (`> Pivot`).

During recursion, **All elements equal to Pivot are directly frozen permanently and will no longer participate in any subsequent recursion!**  
If all the elements in the array are the same, three-way split quick sort can be used at a god-level  **$\Theta(N)$  linear time**  Complete the sorting directly!

## 4. Summary of this lecture and self-assessment after class

*(Reference time: 00:31:00 · [Video jump (P32 00:31:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32&t=1860))*

### Comprehensive self-test questions after class
Why does quick sort tend to run faster than merge sort and heap sort in the actual industrial world?  
**Answers and analysis**:   
1. **CPU cache affinity is extremely good**: The double pointers of quick sort scan from both ends to the middle, the physical memory flows rapidly in the continuous space, and the CPU cache line hit rate far exceeds the jump addressing of heap sort;  
2. **The constant term factor is small**: The inner loop instruction is extremely compact and does not require the additional array copy overhead of merge sort.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 32. More Quick Sort, Sorting Summary

By Teresa Luo and Nathalys Pham

---

## 32.1 Quicksort Flavors vs. MergeSort

### Quicksort Flavors: Motivation

Before we dive into the wonderful ideas of how to improve the Quicksort Algorithm, here's a [review](https://cs61b-2.gitbook.io/cs61b-textbook/30.-quicksort/30.2-quicksort-algorithm) on how the Quicksort (or Partition Sort) works.

Recall, our version of Quicksort has the following properties:

* Leftmost item is always the pivot

* Our partitioning algorithm always preserves the relative order of <= and >= items.

And remember that even though if we have a pivot that is always "good", which leads to a best case runtime of $$\theta(NlogN)$$, it is still *possible* that the rare worst case runtime $$\theta(N^2)$$ will happen in practice. Consequently, Quicksort will have a worse runtime than [MergeSort](https://cs61b-2.gitbook.io/cs61b-textbook/15.-asymptotics-ii/15.4-mergesort), losing its title as the "fastest sorting algorithm". 

Therefore,  a natural question to ask is: **What can we do to avoid running into the worst case for Quicksort?** So it can beat MergeSort for sure? This will be the main motivation of exploration for this section.

### Quicksort Flavors: Philosophies

Here are some general philosophies to follow to brainstorm ways to improve Quicksort 

#### Philosophy 1: Randomness

Some possible reasons that the rare worst case runtime still happen in practice include:

* Bad ordering: Arrays already in sorted order

* Bad elements: Arrays with all duplicates

In both of the examples above, assuming we are using the strategy that the leftmost item is always the pivot, each partition of the elements around the pivot **fails to reduce the size of the resulting subarrays *****significantly***, which leads to the consequence of going through the items many many times. 

One solution to the bad ordering problem is randomness, which is encoded by these two strategies below:

1. Pick pivots randomly.

2. Shuffle items before sort.

Note: Strategy 2 requires care in partitioning code to avoid $$\theta(N^2)$$ behavior on arrays of duplicates.

Turns out, this randomized version of Quicksort is the best sort you can get with extremely good performance. 

Just like the care-free, motorcycle rider from the 1992 TV Show *Renegade,* this version of the Quicksort algorithm is able to thrive with a devil-may-care attitude, even without the luxurious hair. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FNF0GKPN0mJ494lWKCnft%2FScreen%20Shot%202023-04-09%20at%2011.34.34%20PM.png?alt=media&amp;token=cf6590c8-68a5-4bcc-a926-ecb14eb040ae" alt=""><figcaption><p>Spirit of Randomized Quicksort Algorithm.</p></figcaption></figure>

#### Philosophy 2: Smarter Pivot Selection

Another approach to the problem is to choose a "good" pivot effectively, somehow.  

##### 2a. Constant time pivot pick

One of such approach is to pick a few items, and then among them, choose the "best" one as the pivot. This type of approach exemplifies a type of pivot selection procedure that is both *deterministic* and *constant* time.

However, a big drawback of such procedure is that the resulting Quicksort has a family of "dangerous inputs"---inputs that will lead to the worst case runtime or break the algorithm---that an adversary could easily generate.

##### 2b. Linear time pivot pick

Since we are partioning multiple times, always selecting the median as the pivot seems like a good idea, because each partition will allow us to cut the size of the resulting subarrays by half. 

Therefore, to improve upon the idea from part a, we can calculate the *median* of a given array, which can be done in linear time, then select that as the pivot.

The "exact median QuickSort" algorithm will not have the technical vulnerabilities as the 2a approach, and has a runtime of $$\theta(NlogN)$$. However, it is still slower than MergeSort.

#### Philosophy 3: Introspection

This philosophy simply relies on introspecting the recursive depth of our algorithm, and switch to MergeSort once we hit the depth threshold. 

Although this is a reasonable approach, it is not common to use in practice.

### Quicksort Flavors vs. MergeSort: Who's the best?

#### **Candidate One: Quicksort L3S**

Quicksort L3S is the Quicksort that is introduced last time, with the following properties:

* Always leftmost pivot selection

* Partioning

* Shuffle before starting

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fq5goc52jOrQ8x2NRL5cJ%2FScreen%20Shot%202023-04-10%20at%2012.00.46%20AM.png?alt=media&amp;token=51e227e4-2397-40ad-9c04-466ac9a49513" alt=""><figcaption></figcaption></figure>

Unfortunately, 0 : 1 with Mergesort in the lead. 

#### Candidate Two: Quicksort LTHS

Quicksort LTHS is very similar to Quicksort L3S, except with a different partioning scheme: [**Tony Hoare's In-Place Partioning Scheme**](https://docs.google.com/presentation/d/1DOnWS59PJOa-LaBfttPRseIpwLGefZkn450TMSSUiQY/pub?start=false\&loop=false\&delayms=3000\&slide=id.g12b16fb6b6_0_2).

##### Tony Hoare's Partioning

Imagine two pointers, one at each end of the items array, walking towards each other:

* Left pointer loves small items.

* Right pointer loves large items.

* Big idea: Walk towards each other, swapping anything they don’t like; stop when the two pointers cross each other. 

  * Left pointer hates larger or equal items

  * Right pointer hates smaller or equal items

* New pivot = Item at right pointer.

* End result is that things on left of pivot (originally the leftmost item) are “small” and things on the right of pivot are “large”.

##### TH Partioning: An Intuitive Analogy

Intuitively, you can think of each pointer as a little "police" for the "less than pivot" territory and "greater than pivot" territory. And think of the pivot as the "border line" between the two territories. 

Their job is to find and arrest any "suspects", or items that don't belong to their respective territories, and trade the arrested suspects with the "police" on the other side. 

Specifically, the left pointer is the "police" for the "less than pivot" territory, looking for any "suspects" (items greater than or equal to the pivot) that are not supposed to be on this side of the border line. Analogously, the right pointer looks for "suspects" (items less than or equal to the pivot) in the "greater than territory". 

When the two "polices" meet, mission is done as they both have sufficiently searched across their representative territories.

##### All this work for nothing?

Not at all! All this work with a new partioning scheme did pay off, and using the TH partitioning scheme yields a very fast Quicksort: one that is faster than MergeSort!

It's important to also note that: 

* Faster schemes have been found since.

* Overall runtime still depends crucially on pivot selection strategy!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FrOtdU0rDZZcHDeovsSBJ%2FScreen%20Shot%202023-04-10%20at%2012.05.30%20AM.png?alt=media&amp;token=5f312610-add4-49fe-9392-46a74cdacaa5" alt=""><figcaption></figcaption></figure>

1 : 1 with a win for QuickSort Flavors! 

#### Candidate Three: QuickSort PickTH

##### Median Identification: Linear Time

Recall from philosophy 2b that the idea of identifying the median and use it as the pivot is inefficient because finding the median itself is a costly process. (Runtime: $$\theta(NlogN)$$

Turns out, it is possible to find the median in $$\theta(N)$$ time instead, with an algorithm called "[PICK](https://www.cs.princeton.edu/~wayne/cs423/lectures/selection-4up.pdf)".

Will this improved version of Exact Median Quicksort perform better than Mergesort?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FY5todbbJ0eAOA7nFdt9Y%2FScreen%20Shot%202023-04-10%20at%2012.35.14%20AM.png?alt=media&amp;token=e70be458-ab1a-4c5e-a5d7-51bc6760ab04" alt=""><figcaption></figcaption></figure>

Sadly, no. And it was terrible! Likely for the following reasons:

* Cost to compute medians is too high.

* Have to live with worst case $$\theta(N^2)$$ if we want good practical performance.

1 : 2 with Mergesort as the winner. 

---

## 32.2 Quick Select

Dissatisfied with the result that Quicksort is unable to completely defeat Mergesort and truly claim the title for "fastest comparison-based sorting" algorithm, let's shoot our one last shot to overturn the result: use Quick Select to identify the median. 

### Quick Select Algorithm

Goal: find the median using partioning. 

Key idea: Median of an length n array will be around index n /2.

1. Initialize array with the leftmost item as the pivot. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F2pXn0GVshTxyLwc6qOMJ%2FScreen%20Shot%202023-04-10%20at%2012.49.15%20AM.png?alt=media&amp;token=aaa8c490-cdc8-4426-9fe8-bce26ced7b94" alt=""><figcaption><p>Initial Array</p></figcaption></figure>

For this example, the index of the median should be 9 / 2 = 4. 

2. Partition around pivot. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1st4J7M1QaH2z1l3Usl3%2FScreen%20Shot%202023-04-10%20at%2012.50.44%20AM.png?alt=media&amp;token=6cede37c-c2b4-4755-b612-118f6e431417" alt=""><figcaption><p>Pivot lands at index 2</p></figcaption></figure>

Since the pivot is at index 2, which is not the median. Therefore, need to continue. However, will only partition the **right** subproblem because median can't be to the left! (index n/2 > 2)

3. Partition the subproblem. Repeat the process.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fm0XHr1ye9N4EVV98EuN5%2FScreen%20Shot%202023-04-10%20at%2012.53.07%20AM.png?alt=media&amp;token=52877673-f11c-489f-88ab-b0c995e4f377" alt=""><figcaption></figcaption></figure>

Pivot is at index 6, which means that it is not at the median. Continue. 

4. Stop when the pivot is at the median index. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FNCuCcZn2wVvMjhLXgRpO%2FScreen%20Shot%202023-04-10%20at%2012.54.52%20AM.png?alt=media&amp;token=ac35a9ad-d7af-4f1a-a525-20ab9b1bf625" alt=""><figcaption></figcaption></figure>

Since pivot is at index 4, we are done. 

### Quick Select Performance

#### Worst Case Runtime

The worst case is when the array is in sorted order, which yields a runtime of $$\theta(N^2)$$.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FYMATfSuOMSDvBWsFU8LR%2FScreen%20Shot%202023-04-10%20at%2012.47.27%20AM.png?alt=media\&token=f2e3f0af-3b98-4395-aacc-e1f33b19fd32)

#### Expected Runtime

The expected runtime for the Quick Select Algorithm is $$\theta(N)$$. Here's an intuitive diagram that justifies this result: 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fo3b6wDKL10J2hWRvqZH5%2FScreen%20Shot%202023-04-10%20at%2012.45.39%20AM.png?alt=media&amp;token=c11c6df1-2d53-44ac-9a01-07b7c10b7002" alt=""><figcaption></figcaption></figure>

Using one of our favorite sums, we can see the runtime is:

$$
N + N/2 + N/4 +.... + 1 = \theta(N)
$$

### Compared to MergeSort?

Unfortunately, even using Quickselect to find the exact median, the resulting algorithm is still quite slow. 

Team Mergesort wins, sadly. 

---

## 32.3 Stability, Adaptiveness, and Optimization

### Stability

A sort is stable if the order of equivalent elements is preserved. The following is an example of a stable sort. After sorting by section, notice how Bas, Jana, Jouni, and Rosella are in the same order as before sorting. If we want records sorted by section and then by name within each section, we can sort by name and then by section as below.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FRilq7W7nGtswHmyl5GCP%2FScreenshot%202023-04-10%20at%2012.16.47%20AM.png?alt=media&amp;token=1f9b6e83-2b33-458b-a4c1-a372519463f3" alt=""><figcaption></figcaption></figure>

The following example is an unstable sort. It can make things really annoying! If we want records sorted by section and then by name within each section, we can't just sort by name and then by section as before. After an unstable sort, the previous ordering is not maintained.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fg6FpmZLksYV79KAacWNu%2FScreenshot%202023-04-10%20at%2012.28.10%20AM.png?alt=media&amp;token=a283f697-990e-41f5-a819-9c4c0d1fff14" alt=""><figcaption></figcaption></figure>

Are some of the sorts we learned stable? Insertion sort is stable! Equivalent elements move past their equivalent brethren. MergeSort is stable. HeapSort is not stable. QuickSort can be stable depending on its partitioning scheme, but its stability cannot be assumed since many of its popular partitioning schemes, like Hoare, are unstable.

### Optimizations

Adaptiveness - A sort that is adaptive exploits the existing order of the array. Examples are InsertionSort, SmoothSort, and TimSort.

Switch to Insertion Sort - When a subproblem reaches size 15 or lower, use insertion sort. It is very very fast for inputs of small sizes.

Exploit restrictions on set of keys - For example, if the number of keys is some constant, we can use this constraint to sort faster by applying 3-way QuickSort.

Switch from QuickSort - If the recursion goes too deep, switch to a different type of sort.

---

## 32.4 Summary

### Quicksort

What can we do to avoid the worst case runtime of $$\theta(N^2)$$ for Quicksort? 

1. Randomness: pick a random pivot point, shuffle items before sorting

2. Smarter Pivot Selection: constant time pivot pick (ex: pick a few and then choose the best out of them), linear time pivot pick like (ex: median)

3. Introspection: switch to a different sort if current sort hits recursion depth threshold

Quicksort vs. Mergesort

* Mergesort is faster than Quicksort L3S (leftmost pivot, 3-scan partition) and QuickSort PickTH (median pivot, Tony Hoare partition)

* Quicksort LTHS (leftmost pivot, Tony Hoare partition) is faster than Mergesort!

* Tony Hoare's partitioning:

  * two pointers, one at each end of the items array, walking towards each other

  * left pointer hates larger or equal items, right pointer hates smaller or equal items

  * swapping anything they don’t like; stop when the two pointers cross each other

  * new pivot = Item at right pointer.

### Quick Select

Quick select helps us quickly find the median with partitioning. Median of an length n array will be around index n /2. 

1. Initialize array with the leftmost item as the pivot. 

2. Partition around pivot. 

3. Partition the subproblem. Repeat the process.

4. Stop when the pivot is at the median index. 

Expected runtime: $$\theta(N)$$. Worst case runtime (when array is in sorted order): $$\theta(N^2)$$.

### Stability, Adaptiveness, and Optimization

Stability: A sort is stable if the order of equivalent elements is preserved.

Optimizations: 

* Adaptiveness - sort that exploits the existing order of the array.

* Switch to Insertion Sort - when a subproblem reaches size 15 or lower

* Exploit restrictions on set of keys

* Switch from QuickSort - if the recursion goes too deep

---

## 32.5 Exercises

### Factual

1. Suppose we have the array `[17, 15, 19, 32, 2, 26, 41, 17, 17]`, and we partition it using 3-scan partitioning using `17` as the pivot. What array do we end up with?

2. Suppose we have the array `[17, 15, 19, 32, 2, 26, 41, 17, 17]`, and we partition it using Tony Hoare partitioning using 17 as the pivot. What array do we end up with?

<details>

<summary>Problem 1</summary>

`[15, 2, 17, 17, 17, 19, 32, 26, 41]`. First we scan for the smaller elements (15, 2), then the equal elements (17, 17, 17), and finally the larger elements (19, 32, 26, 41) in the order they appear from left to right in the original array.

</details>

<details>

<summary>Problem 2</summary>

`[2, 15, 17, 17, 17, 26, 41, 32, 19]`. See [here](https://docs.google.com/presentation/d/1DOnWS59PJOa-LaBfttPRseIpwLGefZkn450TMSSUiQY/pub?start=false\&loop=false\&delayms=3000\&slide=id.g463de7561_042) for a demo.

</details>

### Conceptual

1. Which of the following arrays will result in $$N^2$$ behavior if we use quicksort which always uses the leftmost item as pivot, and which uses a stable partitioning strategy?

   * [ ] `[1, 1, 1, 1, 1, 1, ..., 1]`

   * [ ] `[1, 2, 3, 4, 5, 6, ..., N]`

   * [ ] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

2. Repeat the exercise above, but assume that we shuffle the array before partitioning.

3. Suppose we try to use Quick Select to find the median of `[17, 15, 19, 32, 2, 26, 41, 5, 9]`. How many total partitioning operations will we need to complete to find the median?

4. Which of the following sorts are stable?

   * [ ] Insertion sort

   * [ ] Quicksort L3 - use leftmost item as pivot, use 3scan partitioning

   * [ ] Quicksort L3S - use leftmost item as pivot, use 3scan partitioning, shuffle before starting

   * [ ] Quicksort LTH - use leftmost item as pivot, use tony hoare partitioning

   * [ ] Quicksort PickTH - use median (computed with PICK) as pivot, use tony hoare partitioning

<details>

<summary>Problem 1</summary>

All three of these arrays are worst-case inputs for quicksort, since the size of the largest partition will only decrease by 1 each round of partitioning.

* [x] `[1, 1, 1, 1, 1, 1, ..., 1]`

* [x] `[1, 2, 3, 4, 5, 6, ..., N]`

* [x] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

</details>

<details>

<summary>Problem 2</summary>

If we shuffle, the two arrays with integers up to `N` are no longer guaranteed to have bad pivots since the pivot could be any item in the array with equal probability. However, the array of all `1`s will still always choose a "bad" pivot, since all items in the array are equal and will end up in the left partition.

* [x] `[1, 1, 1, 1, 1, 1, ..., 1]`

* [ ] `[1, 2, 3, 4, 5, 6, ..., N]`

* [ ] `[N, N - 1, N - 2, N - 3, ... 2, 1]`

</details>

<details>

<summary>Problem 3</summary>

1; after a single partitioning operation, we end up with 17 in the middle of the array. Thus, we will get 17 into this middle position and be done immediately. Note that it doesn't matter what partitioning strategy we use.

</details>

<details>

<summary>Problem 4</summary>

Insertion sort is stable, as mentioned in previous chapters.

3-scan alone is stable.

After shuffling, we cannot guarantee any ordering of items, so any partitioning strategy involving shuffling is not stable. Also, Hoare partitioning is inherently unstable, so any sort involve Hoare partiioning is also not a stable sort.

* [x] Insertion sort

* [x] Quicksort L3 - use leftmost item as pivot, use 3scan partitioning

* [ ] Quicksort L3S - use leftmost item as pivot, use 3scan partitioning, shuffle before starting

* [ ] Quicksort LTH - use leftmost item as pivot, use Hoare partitioning

* [ ] Quicksort PickTH - use median (computed with PICK) as pivot, use Hoare partitioning

</details>

### Metacognitive

1. Why does Java’s built-in `Array.sort` method use Quicksort for `int`, `long`, `char`, or other primitive arrays, but Mergesort for all `Object` arrays?

2. Given that quicksort runs fastest if we can always somehow pick the median item as the pivot, why don’t we use quickselect to find the median to optimize our pivot selection (as opposed to using the leftmost item)?

<details>

<summary>Problem 1</summary>

This is because primitives don't require stability--an `int` is indistinguishable from any other `int` if they are equal by `.equals()`. However, this is not true for `Object`s, since two different `Object`s at different memory addresses can still be equal, and stability may be desireable when sorting objects.

</details>

<details>

<summary>Problem 2</summary>

The problem with finding the median before partioning each time is that this increases the runtime of quicksort by a significant constant factor, resulting in a much slower algorithm in practice. The very low probability of running into a worst-case quicksort means that using a time-consuming algorithm to find the median is not worth it in the majority of sorting cases.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous Lecture: Software Engineering II: Architectural Design Patterns and Engineering Decoupling](/en/notes/cs61b/lecture-31) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Sorting IV: Theoretical lower bound proof based on comparison sorting →](/en/notes/cs61b/lecture-33) | [🎬Watch this lecture on Bilibili (P32)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=32) |
