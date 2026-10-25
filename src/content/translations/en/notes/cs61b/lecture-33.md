---
kind: notes
source: cs61b/lecture-33
title: "Lecture 33 · Sorting IV: Decision Trees and Lower Bounds for Comparison
  Sorting"
description: "CS61B Lecture 33: Sorting IV: Theoretical lower bound proof based
  on comparison sorting: decision tree model, information theory entropy,
  Stirling's formula and strict Omega(N log N) proof"
sourceHash: 1257a2fa02b13ea204a3de416aecbc10695f987d9bd766f66814b48ce5a159e5
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 6: Advanced Data Structures and Classic Sorting (Tries & Sorting Algorithms)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 51:52 ｜ **Official original version**: Lecture 33 - Sorting IV:  Theoretical Bounds  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P33)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1sqpg9sM-0719KGcWzYmmrWlj0azaafgIAiM8U98jKi4/edit) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/34.-sorting-and-algorithmic-bounds)  
> **Quick navigation**: [← Previous lecture (P32 Sorting III: Quick sorting and three-way segmentation of the Dutch flag)](/en/notes/cs61b/lecture-32) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P34 Software Engineering III: Software Engineering Ethics and Technical Reflection) →](/en/notes/cs61b/lecture-34)

---

## 1. Exploring the ultimate limit of algorithms: Can we invent an O(N) comparison sort?

*(Reference time: 00:01:25 · [Video jump (P33 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=85))*

The complexity of merge sort, quick sort, and heap sort is  $\Theta(N \log N)$.  
This triggers an ultimate question in theoretical computer science:  
**Can we be smarter and invent a method based on pairwise comparison that can  $O(N)$  A god-level algorithm that can arrange arbitrary data in linear time?**

**The answer is: absolutely impossible in mathematical logic!**

## 2. Formal derivation of Decision Tree Model

*(Reference time: 00:10:40 · [Video jump (P33 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=640))*

Any pairwise comparison based on elements (`a < b`) algorithm can be abstracted into a tree **Decision Tree**: 
- Each internal node of the tree represents a comparison judgment;
- Each leaf node of the tree represents a possible final permutation output.

### Fully permuted possibility space
contains  $N$  An array of different elements, the total number of all possible permutations and combinations is: 
$$N! = N \times (N - 1) \times (N - 2) \times \dots \times 1$$
 In order to distinguish this  $N!$  completely different input possibilities, **The total number of leaf nodes of the decision tree  $L$  Must reach at least  $N!$  ($L \ge N!$)**!

## 3. Stirling's Approximation and Strict  $\Omega(N \log N)$  prove

*(Reference time: 00:20:15 · [Video jump (P33 00:20:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=1215))*

The height of a tree is  $H$  A binary tree, the maximum number of leaf nodes it can accommodate is  $2^H$.  
Therefore there must be: 
$$2^H \ge L \ge N! \implies H \ge \log_2(N!)$$

According to the series summation of factorial logarithms and the Stirling formula expansion: 
$$\log_2(N!) = \sum_{i=1}^N \log_2 i \ge \sum_{i=N/2}^N \log_2 \frac{N}{2} = \frac{N}{2} (\log_2 N - 1) = \Omega(N \log N)$$

### ultimate theory theorem
> **Comparative ranking theory lower bound theorem**:   
> **In the worst case, any comparison-based sorting algorithm has a strictly mathematical lower bound on the number of comparisons that must be performed to distinguish all input possibilities:**
> $$\Omega(N \log N)$$

Any attempt to rely solely on pairwise comparisons  $O(N)$  The algorithm that can complete universal sorting within a certain period of time has been declared dead in mathematical information theory!

## 4. Summary of this lecture and self-assessment after class

*(Reference time: 00:28:00 · [Video jump (P33 00:28:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33&t=1680))*

### Comprehensive self-test questions after class
Since the lower bound of comparison sorting is  $\Omega(N \log N)$, why the subsequent counting sort and radix sort claim to be able to do it  $O(N)$?  
**Answers and analysis**:   
Because counting sort and radix sort **Does not use pairwise comparisons between elements at all**! They take advantage of the internal numeric structure of the key (i.e. the value of each byte) and avoid the mathematical assumptions of the comparison model through direct addressing and bucket mapping!

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 34. Sorting  and Algorithmic Bounds

By William Lee and Angel Aldaco

---

## 34.1 Sorting Summary

### Other Desirable Sorting Properties: Stability

##### A sort is said to be stable if order of equivalent items is preserved.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FEBbcRBpJ275clRHizWRe%2Fimage.png?alt=media&amp;token=03f029c6-677f-4299-bd96-28d8b9c1d954" alt=""><figcaption></figcaption></figure>

Equivalent items don’t ‘cross over’ when being stably sorted.

On the other hand...

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F3v4gy4NRQGaHAXddSsyw%2Fimage.png?alt=media&amp;token=f7a55be6-6460-440a-b061-0c0da3ab0fda" alt=""><figcaption></figcaption></figure>

Sorting instability can be really annoying! Wanted students listed alphabetically by section.

\

Arrays.sort()

-------------

In Java, Arrays.sort(someArray) uses:

* Mergesort (specifically the TimSort variant) if someArray consists of Objects.

* Quicksort if someArray consists of primitives.

<figure><img src="https://lh3.googleusercontent.com/PDj3CTwryGwH-zcuR27Eu4VE0vxyJLiRVCAWuaCVrhbO51Cihnnsi6Zb3RGnMNPd0MJdvmAjdeD-8-r_emyVXqkKrxsN6cku7kD2eb_s7sRqpchoO4-FPPP_d2J0XpGF_5NZZHRnnMiJQaGZ_krE_6cOPQ=s2048" alt=""><figcaption></figcaption></figure>

<figure><img src="https://lh4.googleusercontent.com/ouERSw5xhhN_7adslpMp58k5wTeOr8xt2r0ZdeQJnYOD6d43plwpVWaHvyqsCXizBkRrIg6y-CZOCYaVfzbpcAtPsLTU23V4ldc9EbI2sq1Lc9US33BmqpZuVeeZbRyB8WPuLTzSkDsQhSBxY2gpo0c0yg=s2048" alt=""><figcaption></figcaption></figure>

<details>

<summary>Why?</summary>

* Quicksort isn’t stable, but there’s only one way to order them. Wouldn’t have multiple types of orders.

* Could sort by other things, say the sum of the digits. 

* Order by the number of digits.

* My usual answer: 5 is just 5. There are no different possible 5's.

* When you are using a primitive value, they are the ‘same’. A 4 is a 4. Unstable sort has no observable effect.

* There’s really only one natural order for numbers, so why not just assume that’s the case and sort them that way. 

* By contrast, objects can have many properties, e.g. section and name, so equivalent items CAN be differentiated.

* If you know there’s only one way, can you force Java to use Quicksort? 

</details>

### Sorting

Sorting is a foundational problem.

* Obviously useful for putting things in order.

* But can also be used to solve other tasks, sometimes in non-trivial ways.

  * Sorting improves duplicate findings from a naive N^2 to N log N.

  * Sorting improves 3SUM from a naive N^3 to N^2.

* There are many ways to sort an array, each with its own interesting tradeoffs and algorithmic features.

Today we’ll discuss the fundamental nature of the sorting problem itself: How hard is it to sort?

### Sorts Summary

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FaAaScEBnuulum81tD5hq%2Fscreenshot%202023-04-14%20at%201.43.52%20AM.png?alt=media&amp;token=5705ecb0-ae85-465a-b261-d770a3bba1b8" alt=""><figcaption></figcaption></figure>

<br>

---

## 34.2 Math Problems Out of Nowhere

### A Math Problem

<details>

<summary>Is <span class="math">N!\in \Omega((\frac{N}{2})^\frac{N}{2})</span>Prove your answer. [Recall that ∈ Ω can be informally be interpreted to mean >=. In other words, does factorial grow at least as quickly as <span class="math">(\frac{N}{2})^\frac{N}{2}</span>?</summary>

10!

* 10 \* 9 \* 8 \* 7 \* 6 \* … \* 1

55

* 5 \* 5 \* 5 \* 5 \* 5

$$N!>(\frac{N}{2})^\frac{N}{2}$$ for large N, therefore $$N!\in \Omega((\frac{N}{2})^\frac{N}{2})$$

</details>

### Another Math Problem

<details>

<summary>Given: <span class="math">N!>(\frac{N}{2})^\frac{N}{2}</span>, which we used to prove our answer to the previous problem. Show that <span class="math">log(N!) \in \Omega(N * logN)</span>. [Recall: log means an unspecified base]</summary>

We have that $$N!>(\frac{N}{2})^\frac{N}{2}$$

* Taking the log of both sides, we have that $$log(N!)>log((\frac{N}{2})^\frac{N}{2})$$.

* Bringing down the exponent we have that $$log(N!)>\frac{N}{2}\cdot log((\frac{N}{2}))$$.

* Discarding the unnecessary constant, we have $$log(N!)>\Omega(N\cdot log(\frac{N}{2}))$$.

* From there, we have that $$log(N!)>\Omega(N\cdot log(N))$$. \[since $$log(\frac{N}{2})$$ is the same thing asymptotically as $$log(N)$$]

In other words, $$log(N!)$$ grows at least as quickly as $$N\cdot log(N)$$.

</details>

### Last Math Problem

<details>

<summary>In the previous problem, we showed that <span class="math">log(N!) \in \Omega(N * logN)</span>. Now show that <span class="math">N*logN \in \Omega(log(N!))</span>.</summary>

Proof:

* $$log(N!)=log(N)+log(N-1)+...+log(1)$$

* $$N\cdot logN=log(N)+log(N)+...+log(N)$$

* Therefore $$N\cdot logN \in \Omega(log(N!))$$

</details>

### Omega and Theta

<details>

<summary>Given <span class="math">N*logN \in \Omega(log(N!))</span> and <span class="math">log(N!) \in \Omega(N * logN)</span>. Which of the following can we say?<br><br>A. <span class="math">N*logN \in \Theta(log(N!))</span><br>B. <span class="math">log(N!) \in \Theta(N * logN)</span><br>C. Both A and B<br>D. Neither</summary>

Answer: C. Both A and B

</details>

### Summary

We’ve shown that $$N\cdot logN \in \Theta(log(N!))$$.

* In other words, these two functions grow at the same rate asymptotically. 

As for why we did this, we will see in a little while...

---

## 34.3 Theoretical Bounds on Sorting

What is the best time we can get for sorting?

So far, the fastest sorts we have gone over have had $$\Theta(N\cdot logN)$$as the worse case time. This begs the question; can we get a sorting algorithm that would have a better asymptotic analysis? 

Let's say that we have "the algorithm ultimate comparison sort" known as TUCS which is the fastest possible comparison sort. We don't know the details of this yet-to-be-discovered algorithm as it has not been discovered yet. Let's additionally say that $$R(N)$$is the worst-case runtime of TUCS and give ourselves the challenge of finding the best $$\Theta$$ and $$O$$ bounds for $$R(N)$$. (This might seem a little odd since we really don't know the details of it, but we can find $$R(N)$$).

As a starting point, we can go ahead and have the $$O$$ bound of $$R(N)$$ be $$O(N\cdot logN)$$. Why? If this is the fastest sorting algorithm it must be at least just as good as the algorithms we already have! Thus it must at least be as good as Mergesort's worst case as otherwise we would have a contradiction in calling this algorithm TUCS. 

What about the starting point for the $$\Omega$$ bound of $$R(N)$$? Since we don't quite know any details about it we can start by giving it the best possible runtime of $$\Omega(1)$$. But can we make this tighter? 

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fi9dy7konGyPTMThVqL1z%2Fimage.png?alt=media\&token=90743491-8edb-421d-9d25-0c9c61f25cf9)\

\

It turns out we can as if the algorithm sorts all of N elements, it must have gone through all of the N elements at some point of sorting it. Thus, we can arrive at a tighter bound of $$\Omega(N)$$. But can we make it tighter? The answer is yes, but to see the argument for why we have to consider the following game. 

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fgto4SgCjks6DYbeLlekA%2Fimage.png?alt=media\&token=bc3c1bea-f820-4273-a1d0-4e402a5c4866)

#### A Game of Cat and Mouse (and Dog)

Let's say we place Tom the Cat, Jerry the Mouse, and Spike the Dog in opaque soundproof boxes labeled A, B, and C. We want to figure out which is which using a scale.

![](https://lh3.googleusercontent.com/KkM-v6NCPT33GePoBDJ9JgLyKPtfEMPlIU9H0prq3-AX2qTd4_BiKjCw4BCZ82Q1zTeaGPcJK15w2neC5PVAI2EAQjFBdj4bV7qZTz-uPUOg6o9IvyOsSFuu4AfEQFnAAKpc1eU4DIbMjWZUY5ZIMhHA8Q=s2048)

Let's say we knew that Box A weighs less than Box B, and that Box B weighs less than Box C. Could we tell which is which? 

The answer turns out to be yes! 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FDEyS11jJNupenGxLSxdu%2Fimage.png?alt=media&amp;token=26d2f03c-4598-4a23-9e9b-46c783c0072e" alt=""><figcaption></figcaption></figure>

We can find a sorted order by just considering these two inequalities. What if Box A weighs more than Box B, and that Box B weighs more than Box C? Could we still find out which is which?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1paSy9ox1eUeTbTCM2e4%2Fimage.png?alt=media&amp;token=fe3e8632-86db-438d-9862-524d6a59b260" alt=""><figcaption></figcaption></figure>

The answer turns out to be yes! So far, we have been able to solve this game with just two inequalities! Let's go ahead and try a third case scenario. Could we know which is which if Box A weighs less than Box B, but Box B weighs more than Box C?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FlFX2h4pTDHicYWpI8Q2F%2Fimage.png?alt=media&amp;token=276ef08e-3d9f-408b-bd40-5078d3a5fe32" alt=""><figcaption></figcaption></figure>

The answer turns out to be no. It turns out to have two possible orderings:

* a: mouse, c: cat, b: dog (sorted order: acb)

* c: mouse, a: cat, b: dog (sorted order: cab)

So while we were on a really great streak of solving the game with only two inequalities, we will need a third to solve all possibilities of the game. If we add the inequality a < c then this problem goes away and becomes solvable. 

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2Fvs9aIYcZNmMDYmgkmQJI%2Fimage.png?alt=media&amp;token=f4d8df15-c4aa-4529-8613-a1e4b33a5371" alt=""><figcaption></figcaption></figure>

Now that we've created this table, we can create a tree to help us solve this sorting game of cat and mouse (and dog).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FRH5HtnrifG5oEpu1oNFT%2Fimage.png?alt=media&amp;token=acddaf20-3ff5-4807-8f51-0b7398008759" alt=""><figcaption></figcaption></figure>

But how can we make this generalizable for all sorting? We know that each leaf in this tree is a unique possible answer to how boxes should be sorted. So the number of ways the boxes can be sorted should turn out to be the number of leaves in the tree. That then begs the question of how many ways can N boxes be sorted? The answer turns out to be $$N!$$ ways as there are $$N!$$ permutations of a given set of elements.

So how many questions do we need to ask in order to know how to sort the boxes? We would need to find the number of levels we must go through to get our answer in the leaf.  Since it's a binary tree the minimum amount levels turn out $$lg(N!)$$levels to reach a leaf. (Note that $$lg$$ means (log base 2)).

So, using this game we have found that we must ask at least $$lg(N!)$$ questions about inequalities to find a proper way to sort it. Thus our lower bound for $$R(N)$$ is $$\Omega(lg(N!))$$.

---

## 34.4 Summary

**Math Problem Out of Nowhere 1.** We showed that $$N! \in \Omega(\frac{N}{2}^{\frac{N}{2}})$$.

**Math Problem Out of Nowhere 2.** We showed that $$\log(N!) \in \Omega(N \log N)$$, and that $$N \log N \in \Omega(\log(N!))$$. Therefore $$\log(N!) \in \Theta(N \log N)$$.

**Seeking a Sorting Lower Bound.** We’ve found a number of sorts that complete execution in $$\Theta(N \log N)$$ time. This raises the obvious question: Could we do better? Let TUCS (which stands for “The Ultimate Comparison Sort”) be the best possible algorithm that compares items and puts them in order. We know that TUCS’s worst case runtime is $$O(N \log N)$$ because we already know several algorithm whose worst case runtime is $$\Theta(N \log N)$$, and TUCS’s worst case runtime is $$\Omega(N)$$ because we have to at least look at every item. Without further discussion, this analysis so far suggest that might be able to do better than $$\Theta(N \log N)$$ worst case time.

**Establishing a Sorting Lower Bound.** As a fanciful exercise, we played a game called puppy-cat-dog, in which we have to identify which of three boxes contains a puppy, cat, or dog. Since there are 3! = 6 permutations, we need at least $$ceil(\lg(6)) = 3$$ questions to resolve the answer. In other words, if playing a game of 20 questions with 6 possible answers, we have to ask at least 3 questions to be sure we have the right answer. Since sorting through comparisons is one way to solve puppy-cat-dog, then any lower bound on the number of comparisons for puppy-cat-dog also applies to sorting. Given $$N$$ items, there are $$N!$$ permutations, meaning we need $$lg(N!)$$ questions to win the game of puppy-cat-dog, and by extension, we need at least $$lg(N!)$$ to sort $$N$$ items with yes/no questions. Since $$log(N!)=\Theta(N \log N)$$, we can say that the hypothetical best sorting algorithm that uses yes/no questions requires $$\Omega(N \log N)$$ yes/no questions. Thus, there is no comparison based algorithm that has a worst case that is a better order of growth than $$\Theta(N \log N)$$ compares.

---

## 34.5 Exercises

### Factual

1. Which of the following function(s) have the slowest order of growth in terms of Big Theta?

   * [ ] $$N \log N$$

   * [ ]  $$\log N!$$

   * [ ] $$N^2$$

   * [ ] $$N! \log N!$$

2. To solve puppy, cat, dog for 12 items, what is the theoretical minimum number of comparisons we have to make, based on the argument used in lecture? Please round your answer up to the nearest whole number.

3. Which of the following statements are true?

   * [ ] The optimal sorting algorithm takes at most $$\Theta(N \log N)$$ time.

   * [ ] It is impossible to find a comparison-based sorting algorithm that takes less than $$\Theta(N \log N)$$ comparisons.

   * [ ] It is impossible to find a comparison-based sorting algorithm that takes less than $$\Theta(N \log N)$$ time.

   * [ ] It is impossible to find a sorting algorithm that takes less than $$\Theta(N \log N)$$ time.

<details>

<summary>Problem 1</summary>

In lecture, we proved that $$\log N! \in \Theta(N \log N)$$. Thus, both $$N \log N$$ and $$\log N!$$ have the same order of growth, and are slower than $$N^2$$ or $$N! \log N!$$.

* [x] $$N \log N$$

* [x] $$\log N!$$

* [ ] $$N^2$$

* [ ] $$N! \log N!$$

</details>

<details>

<summary>Problem 2</summary>

$$ceil(\log\_2 12!) = 29$$, based on the equation we saw in lecture.

</details>

<details>

<summary>Problem 3</summary>

* [x] **The optimal sorting algorithm takes at most** $$\Theta(N \log N)$$ **time**. We know of several sorts (for example, mergesort) that take $$\Theta(N \log N)$$ time in the worst case. So the hypothetical "best" sorting algorithm cannot be worse than this.

* [x] **It is impossible to find a comparison-based sorting algorithm that takes less than** $$\Theta(N \log N)$$ **comparisons.** This is the comparison sorting bound proved in lecture.

* [x] **It is impossible to find a comparison-based sorting algorithm that takes less than** $$\Theta(N \log N)$$ **time**. Each comparison must take at least constant time, so the time complexity of comparison-based sorts has the same lower bound as the number of comparisons.

* [ ] **It is impossible to find a sorting algorithm that takes less than** $$\Theta(N \log N)$$ **time.** The lower bound proved in lecture only applies to comparison-based sorts. We will see in future lectures how to use non-comparison sorts to reduce this runtime even further.

</details>

### Metacognitive

1. Suppose we add a new method to `Arrays.sort` that takes in an array of strings. What algorithm should `Arrays.sort(String[] x)` use?

<details>

<summary>Problem 1</summary>

Quicksort. We don't need stability, since strings are only equal by `.equals` if they are exactly the same. Quicksort, then, is the best algorithm since it is empirically the fastest.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Sorting III: Quick sorting and three-way segmentation of the Dutch flag](/en/notes/cs61b/lecture-32) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Software Engineering III: Software Engineering Ethics and Technical Reflection →](/en/notes/cs61b/lecture-34) | [🎬Watch this lecture on Bilibili (P33)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=33) |
