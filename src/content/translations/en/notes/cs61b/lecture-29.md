---
kind: notes
source: cs61b/lecture-29
title: "Lecture 29 · Sorting I: Selection Sort, In-Place Heapsort, and
  Linear-Time Heap Construction"
description: "CS61B Lecture 29: Sorting I: Selection sort and in-place heap
  sort: selection sort in-place, heap sort design, Bottom-Up linear heap
  construction and O(N log N) in-place implementation"
sourceHash: a8c7b33b64e10a07ca98ddaf27e2b909c273989b6ae08736df0a8b6fd4ad62fe
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 6: Advanced Data Structures and Classic Sorting (Tries & Sorting Algorithms)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 53:00 ｜ **Official original version**: Lecture 29 - Sorting I  Selection Sort  Heapsort  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1aleYBt-L8bwyaxw9tXPN3bMI5XxWxmpgfvvSEo9KxD0) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts)  
> **Quick navigation**: [← Previous lecture (P28 Dictionary tree: Tries and prefix search)](/en/notes/cs61b/lecture-28) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P30 Sorting II: Insertion Sort and Merge Sort) →](/en/notes/cs61b/lecture-30)

---

## 1. The core status of the ranking problem and the classification panorama

*(Reference time: 00:01:25 · [Video jump (P29 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=85))*

Sorting is the core basic problem in computer science. Organizing unordered data into ordered sequences can improve the performance of subsequent algorithms such as binary search, deduplication, and set operations.

Three core dimensions of evaluation sorting algorithms:
1. **Time Complexity**: The number of operation steps under best, worst and average conditions;
2. **Space Complexity / In-Place**: Whether it can be completed in-place inside the original array without requiring a large amount of additional memory;
3. **Stability**: Whether the relative order of two elements with equal key values before and after sorting is absolutely unchanged.

## 2. In-situ transformation of Selection Sort

*(Reference time: 00:09:40 · [Video jump (P29 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=580))*

In Lecture 6, we implemented selection sort:
- Find the global minimum in the unsorted interval each time;
- Swap it with the first element of the unsorted range.

Since no matter what form the input is, all remaining intervals must be scanned each time, and the number of comparisons is always: 
$$\sum_{i=1}^N i = \frac{N(N-1)}{2} = \Theta(N^2)$$
 Best, worst, and average cases are all firmly locked into the clumsy  $\Theta(N^2)$.

## 3. Heapsort: Using the maximum heap to speed up extreme value retrieval

*(Reference time: 00:18:20 · [Video jump (P29 00:18:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=1100))*

The reason why selection sort is slow is because "finding the minimum value of the unsorted interval" costs  $\Theta(N)$  price.  
**If we use a heap to maintain this data, finding extreme values only requires  $O(1)$, the adjustment only requires  $O(\log N)$!**

### In-Place Heapsort is a brilliant idea
In order to avoid opening up additional memory heap, we directly add the input array to be sorted  `a[]`  Build in place **Max-Heap**: 
1. Treat the original array logically as a complete binary tree;
2. execute **Bottom-Up Heapify**; 
3. Loop the maximum value on the top of the heap (`a[0]`) is exchanged with the element at the end of the heap and the effective heap size is reduced by 1;
4. Perform sinking on the new top of the heap to restore the maximum heap properties.

## 4. The linear time miracle of Bottom-Up heapization: why building a heap only requires  $\Theta(N)$?

*(Reference time: 00:27:00 · [Video jump (P29 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=1620))*

Beginners usually think that building a heap requires inserting into an empty heap  $N$  elements, time consuming  $O(N \log N)$.  
However, taking the starting point from the last non-leaf node ($N/2$) forward scan execution  `sink`  The complexity of the bottom-up heap building method is amazing **linear time  $\Theta(N)$**!

### Strict mathematical summation proof:
The lowest leaf nodes in the tree account for half ($N/2$), the sinking distance is 0;  
The penultimate layer nodes account for  $N/4$, the sinking distance is at most 1;  
The third-to-last layer nodes account for  $N/8$, the sinking distance is at most 2;  
The total workload is an arithmetic compound series: 
$$\text{Total Sink Work} = \sum_{h=1}^{\log N} \frac{N}{2^{h+1}} \times h = \frac{N}{2} \sum_{h=1}^{\infty} \frac{h}{2^h} = \frac{N}{2} \times 2 = N = \Theta(N)$$

**To build a heap, you only need  $\Theta(N)$, then  $N$  sinking cost  $\Theta(N \log N)$, the total time is strictly  $\Theta(N \log N)$, and the space overhead is purely  $O(1)$  In place!**

## 5. Summary of this lecture and post-class self-assessment

*(Reference time: 00:35:00 · [Video jump (P29 00:35:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29&t=2100))*

### Comprehensive self-test questions after class
Is heap sort a stable sorting algorithm? Why?  
**Answers and analysis**:   
**Heap sort is unstable (Not Stable)!**  
During head-to-tail swapping and cross-layer sinking comparisons, the relative order of two equal elements can easily flip. For example, if it contains items with the same key value, the last item may directly pass over the previous equal items during exchange, causing the original order to be destroyed.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 29. Basic Sorts

- [29.1 The Sorting Problem](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.1-the-sorting-problem.md)

- [29.2 Selection Sort & Heapsort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.2-selection-sort-and-heapsort.md)

- [29.3 Mergesort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.3-mergesort.md)

- [29.4 Insertion Sort](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.4-insertion-sort.md)

- [29.5 Summary](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.5-summary.md)

- [29.6 Exercises](https://cs61b-2.gitbook.io/cs61b-textbook/29.-basic-sorts/29.6-exercises.md)

---

## 29.1 The Sorting Problem

### Sorting

For the remaining part of this textbook, we'll discuss the sorting problem, which can be informally defined as putting a given set of items in a particular order.

This is a useful task in its own right, but can also be a subproblem in larger algorithmic problems. Sorting can be applied to problems like duplicate finding (after sorting, equivalent items are adjacent), binary search, and balancing data structures.

The other reason we introduce sorting is that the different sorts provide general ideas about how to approach computational problems. The solution(s) to sorting problems will often involve data structures covered in the earlier parts of this course.

#### Sorting: Definitions

An **ordering relation** $$<$$ for keys a, b, and c has the following properties:

* *Law of Trichotomy*: Exactly one of a $$<$$ b, a = b, b $$<$$ a is true.

* *Law of Transitivity*: If a $$<$$ b, and b $$<$$ c, then a $$<$$ c.

An ordering relation with the properties above is also known as a **total order**. 

A **sort** is a permutation of a sequence of elements that puts the keys into non-decreasing order relative to a given ordering relation, such that x1 ≤ x2 ≤ x3≤ ...≤ xN.

##### Example: String Length

One example of a ordering relation is the length of strings. To see how the two laws apply:

* *trichotomy*: only one of the following can be true for two strings `a` and `b`--`len(a)` < `len(b)`, `len(a)` = `len(b)`, or `len(a)` > `len(b)`.

* *transitivity:* if `len(a)` < `len(b)` and `len(b)` < `len(c)`, then clearly `len(a)` < `len(c)`.

Suppose we use the ordering relation above to sort `["cows", "get", "going", "the"]`. Then two valid sorts would be `["the", "get", "cows", "going"]` and `["get", "the", "cows", "going"]`. Note that in this sort, `the` and `get` are equivalent since their lengths are equal.

#### Ordering Relations in Java

In Java, ordering relations are typically given by the `compareTo` or `compare` methods. For example:

```java

import java.util.Comparator;

public class LengthComparator implements Comparator<String> {

    public int compare(String x, String b) {

        return x.length() - b.length();

    }

}

```

Note by the relation above, `the` and `get` are equal in ordering, but *not* equal by the `.equals()` method.

#### Inversions

An alternate way to view sorting is as fixing inversions within a sequence of elements. An **inversion** is a pair of elements that are out of order with respect to the defined ordering relation.

For example, in the following sequence of 11 elements, there are 55 possible inversions at most (11 choose 2), and the sequence itself has 6 inversions.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FX1G7yqiEeVcmLV34Vzuk%2Fimage.png?alt=media&amp;token=405fd0bb-3c66-4334-9cda-ea90b2790e0f" alt=""><figcaption><p>The sequence above has 6 inversions</p></figcaption></figure>

Sorting, then, can be viewed as follows: given a sequence of elements with Z inversions, perform some sequence of operations to reduce the total number of inversions to zero.

#### Sorting: Performance

Previously, we have seen characterizations of of the runtime efficiency of an algorithm, also called the **time complexity** of an algorithm. For example, we can say that Dijkstra’s has time complexity O(E log V).

Characterizations of the “extra” memory usage of an algorithm is sometimes called the **space complexity** of an algorithm. For example, Dijkstra’s has space complexity Θ(V) to store the queue, `distTo`, and `edgeTo` arrays. Note that the graph takes up space Θ(V+E), but we don’t count this as part of the space complexity of Dijkstra since the graph is an input to Dijkstra’s. In other words, we are only concerned with the *extra* space used by the algorithm.

---

## 29.2 Selection Sort & Heapsort

### Selection Sort

Selection sort uses the following algorithm:

1. Find the smallest item.

2. Swap that item to the front.

3. Repeat until all items are fixed (there are no inversions).

You can see a demo of the sorting algorithm [here](https://docs.google.com/presentation/u/1/d/1p6g3r9BpwTARjUylA0V0yspP2temzHNJEJjCG41I4r0/edit?usp=sharing).

Selection sort runs in $$\Theta(N^2)$$ time using an array or similar data structure. 

You may have noticed that selection sort seems inefficient, and you'd be right--we look through the entire remaining array each time to find the minimum, examining the same items over and over.

### Heapsort

#### Naive Heapsort

To avoid the inefficiency mentioned above regarding selection sort, we can leverage a max-oriented heap instead of scanning over the array linearly. 

*Note: Because of the array-based representation of a heap, using a max heap results in a simpler implementation where we can maintain a "sorted" and "unsorted" portion of the array. This will be explained further in the next section.*

Then, to heapsort N items, we can insert all the items into a max heap and create and output array. Then, we repeatedly delete the largest item from the max heap and put the largest item at the end part of the output array.

##### Naive Heapsort Analysis

The overall runtime of this algorithm is $$\Theta(N \log N)$$. There are three main components to this runtime:

* Inserting N items into the heap: $$O(N \log N)$$.

* Selecting the largest item: $$\Theta(1)$$.

* Removing the largest item: $$O(\log N)$$.

This is a large improvement over selection sort's $$\Theta(N^2)$$ runtime.

In terms of memory usage, the output array takes an extra $$\Theta(N)$$space. This is worse than selection sort, which uses no extra space, but the improvement in runtime far outweighs this downside.

Even more, we can use a trick with heapsort to get rid of the extra output array.

#### In-place Heapsort

As an alternate approach, we can use the input array itself to form the heap and output array.

Rather than inserting into a new array that represents our heap, we can use a process known as *bottom-up heapification* to convert the input array into a heap. Bottom-up heapification involves moving in reverse level order up the heap, sinking nodes to their appropriate location as you move up.

By using this approach, we avoid the need for an extra copy of the data. Once heapified, we use the naive heapsort approach of popping off the maximum and placing it at the end of our array. In doing so, we maintain an "unsorted" front portion of the array (representing the heap) and a "sorted" back portion of the the array (representing the sorted items so far).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FwTPb8gFQNpzXjf7qMCU0%2Fimage.png?alt=media&amp;token=ca63358e-2f20-4b76-aa74-24f7a244c968" alt=""><figcaption><p>Bottom-up heapfication</p></figcaption></figure>

You can see a demo of this algorithm [here](https://docs.google.com/presentation/d/1SzcQC48OB9agStD0dFRgccU-tyjD6m3esrSC-GLxmNc/edit?usp=sharing).

##### In-place Heapsort Runtime

This process overall is still $$O(N \log N)$$, since bottom-up heapification requires at most $$N$$ sink-down operations that take at most $$\log N$$ time each.

*Note: it is possible to prove that bottom-up heapficiation is bounded by* $$\Theta(N)$$. *However, this proof is out of scope for this class.*

##### In-place Heapsort Memory

Using in-place heapsort, we reduce the memory usage of heapsort to $$\Theta(1)$$. Since we are reusing the input array, no additional space is used (and remember that we do not count the input when assessing memory complexity).

---

## 29.3 Mergesort

We've covered mergesort in the past, but as a reminder, the algorithm is as follows:

1. Split the items into half.

2. Mergesort each half.

3. Merge the two sorted halves to form the final result.

You can see a demo of the algorithm [here](https://docs.google.com/presentation/d/1h-gS13kKWSKd_5gt2FPXLYigFY4jf5rBkNFl3qZzRRw/edit#slide=id.g463de7561_042). 

Mergesort has a runtime of $$\Theta(N \log N)$$-- we will not reanalyze the algorithm here but you may refer to this [link](https://docs.google.com/presentation/u/1/d/1_LhI5V5JlcRHYU55_SF7ZHxPemBr9OVlNzj7ScYdg64/edit#slide=id.g84271d11b_2_77) if you'd like to remind yourself.

The auxiliary array used during the merge step requires $$\Theta(N)$$ extra space. Note that in-place mergesort is possible; however it is very complex and the runtime suffers by a significant constant factor, so we will not cover it here.

---

## 29.4 Insertion Sort

### Naive Insertion Sort

In insertion sort, we start with an empty output sequence. Then, we select an item from the input, inserting into the output array at the correct location.

Naively, we can do this by creating a completely seperate output array and simply putting items from the input there. You can see a demo of this algorithm [here](http://goo.gl/bVyVCS).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F9VFlMN2LcKDjSI9FdOjZ%2Fimage.png?alt=media&amp;token=bef2ccaa-7332-4ac3-ab9e-79f3d669d60f" alt=""><figcaption><p>Naive insertion sort with a seperate output array</p></figcaption></figure>

For the naive approach, if the output sequence contains $$k$$ items so far, then an insertion takes $$O(k)$$ time (shifting every item over in the output array).

### In-place Insertion Sort

We can improve the time and space complexity of insertion sort by using in-place swaps instead of building a seperate output array. 

You can see a demo of this algorithm [here](https://docs.google.com/presentation/d/10b9aRqpGJu8pUk8OpfqUIEEm8ou-zmmC7b_BE5wgNg0/edit#slide=id.g463de7561_042).

Essentially, we move from left to right in the array, selecting an item to be swapped each time. Then, we swap that item as far to the front as it can go. The front of our array gradually becomes sorted until the entire array is sorted.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F5r5BqnkjNwBr8g0yDqOq%2Fimage.png?alt=media&amp;token=22afa9a3-e2b9-4938-87f5-361a5424cd6b" alt=""><figcaption><p>Insertion sort algorithm. Purple items are the selected item being swapped to the front, and black items are the ones with which the purple items are being swapped.</p></figcaption></figure>

### Insertion Sort Runtime

The best-case runtime of insertion sort is $$\Theta(N)$$--when there are no swaps, we simply do a linear scan through the array. The worst-case runtime of insertion sort is $$\Theta(N^2)$$--in a reverse-sorted array, we have to swap every item all the way to the front. 

#### Insertion Sort Advantages

Note that on sorted or almost-sorted arrays, insertion sort does very little work. In fact, the number of swaps that it does is equal to the number of inversions in the array.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FaloSvhMKKvHo4YJdDJqz%2Fimage.png?alt=media&amp;token=9d614fb0-6334-4587-b4f4-bc85b4a23459" alt=""><figcaption><p>The left array has only 5 inversions, and the right array has only 3. Insertion sort does very little work.</p></figcaption></figure>

In other words, on arrays with a small number of inversions, insertion sort is probably the fastest sorting algorithm. The runtime is $$\Theta(N + K)$$, where $$K$$ is the number of inversions in the array. If we define an almost-sorted array as one where the number of inversions $$K < cN$$ for some constant $$c$$, then insertion sort runs in linear time.

A less obvious empirical fact is that insertion sort is extremely fast on small arrays, usually of size 15 or less. The analysis of this is beyond the scope of the course, but the general idea is that divide-and-conquer algorithms (like heapsort and mergesort) spend too much time on the "dividing" phase, whereas insertion sort starts sorting immediately. In fact, the Java [implementation](http://grepcode.com/file/repository.grepcode.com/java/root/jdk/openjdk/6-b14/java/util/Arrays.java#Arrays.mergeSort%28java.lang.Object%5B%5D%2Cjava.lang.Object%5B%5D%2Cint%2Cint%2Cint%29) of mergesort uses insertion sort when the split becomes less than 15 items. 

---

## 29.5 Summary

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FbNbM9PbratgX0zP1Ali1%2Fimage.png?alt=media&amp;token=9dda719f-1187-498f-a998-d66890e2624e" alt=""><figcaption><p>A summary of the sorts covered so far.</p></figcaption></figure>

#### Overview 

**Inversions.** The number of pairs of elements in a sequence that are out of order. An array with no inversions is ordered.

**Selection sort.** One way to sort is by selection: Repeatedly identifying the most extreme element and moving it to the end of the unsorted section of the array. The naive implementation of such an algorithm is in place.

**Naive Heapsort.** A variant of selection sort is to use a heap based PQ to sort the items. To do this, insert all items into a MaxPQ and then remove them one by one. The first such item removed is placed at the end of the array, the next item right before the end, and so forth until that last item deleted is placed in position 0 of the array. Each insertion and deletion takes O(log N) time, and there are N insertions and deletions, resulting in a O(N log N) runtime. With some more work, we can show that heapsort is θ(N log N) in the worst case. This naive version of heapsort uses θ(N) for the PQ. Creation of the MaxPQ requires O(N) memory. It is also possible to use a MinPQ instead.

**In place heapsort.** When sorting an array, we can avoid the θ(N) memory cost by treating the array itself as a heap. To do this, we first heapify the array using bottom-up heap construction (taking θ(N) time). We then repeatedly delete the max item, swapping it with the last item in the heap. Over time, the heap shrinks from N items to 0 items, and the sorted list from 0 items to N items. The resulting version is also θ(N log N).

**Mergesort.** We can sort by merging, as discussed in an earlier lecture. Mergesort is θ(N log N) and uses θ(N) memory.

**Insertion Sort.** For each item, insert into the output sequence in the appropriate place. Naive solution involves creation of a separate data structure. The memory efficient version of this algorithm swaps items one-by-one towards the left until they land in the right place. The invariant for this type of insertion sort is that every item to the left of position i is in sorted order, and everything to the right has not yet been examined. Every swap fixes exactly one inversion.

**Insertion Sort Runtime.** In the best case, insertion sort takes θ(N) time. In the worst case, θ(N^2) time. More generally, runtime is no worse than the number of inversions.

---

## 29.6 Exercises

### Factual

1. How many inversions are there in the array `[10, 100, 60, 40, 50]`?

2. What is the space complexity of selection sort?

<details>

<summary>Problem 1</summary>

5; the violations are 100 > 60, 100 > 40, 100 > 50, 60 > 40, and 60 > 50.

</details>

<details>

<summary>Problem 2</summary>

$$\Theta(1)$$. All swaps in selection sort happen in-place.

</details>

### Procedural

1. Draw the process of heapsort on the array `[5, 9, 2]`, starting with the heapified array and removing the maximum each time.

2. If we are insertion sorting `[5, 6, 7, 1, 8, 9, 2]`, how many total swaps will occur?

<details>

<summary>Problem 1</summary>

After heapification: `[9, 5, 2]`. We sink in reverse level order, which means that we swap `5` with `9`.

Then, the algorithm proceeds by popping off `9` (`[5, 2 | 9]`), then `5` (`[2 | 5, 9]`), then `2` (`[2, 5, 9]`).

</details>

<details>

<summary>Problem 2</summary>

8; simply count the number of inversions (5 > 1, 5 > 2, 6 > 1, 6 > 2, 7 > 1, 7 > 2, 8 > 2, 9 > 2).

</details>

### Metacognitive

1. Which sort do you expect to run more quickly on a reversed array, selection sort or insertion sort?

<details>

<summary>Problem 1</summary>

Asymptotically, both selection and insertion sort run in $$\Theta(N^2)$$ on a reverse-sorted array. However, note that selection sort only does $$N$$ total swaps (finding the maximum, then swapping to the front), while insertion sort does on the order of $$N^2$$ swaps (swapping each item to the front), so insertion sort will actually be slower by a constant factor.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Dictionary tree: Tries and prefix retrieval](/en/notes/cs61b/lecture-28) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Sorting II: Insertion sort and merge sort →](/en/notes/cs61b/lecture-30) | [🎬Watch this lecture on Bilibili (P29)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=29) |
