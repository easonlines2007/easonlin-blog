---
kind: notes
source: cs61b/lecture-35
title: "Lecture 35 · Sorting V: Counting Sort and LSD/MSD Radix Sort"
description: "CS61B Lecture 35: Sorting V: Non-comparative sorting and radix
  sorting (LSD/MSD): Counting sorting principle, stability guarantee,
  least-significant-digit (LSD), most-significant-digit (MSD) and character set
  divide and conquer"
sourceHash: 57178715662e834812bf5472cd0d99aea4cc1fdaeab14e8c1a0eebf623ddc812
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 6: Advanced Data Structures and Classic Sorting (Tries & Sorting Algorithms)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 50:18 ｜ **Official original version**: Lecture 35. Sorting V - More Quicksort Radix Sorts  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/14jNEZC-YKUuxIr3Cxsvz1Kb6eX0jCjvjevb1zD8NRj4) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/35.-radix-sorts)  
> **Quick navigation**: [← Previous lecture (P34 Software Engineering III: Software Engineering Ethics and Technology Reflection)](/en/notes/cs61b/lecture-34) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P36 Sorting VI: Radix Sorting vs. Comparative Sorting Ultimate Showdown) →](/en/notes/cs61b/lecture-36)

---

## 1. Breaking the shackles of the lower bound: the appearance of Non-Comparison Sorting

*(Reference time: 00:01:25 · [Video jump (P35 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=85))*

In the previous lecture, we proved that the theoretical lower bound of comparison sorting is  $\Omega(N \log N)$.  
However, if the elements we sort are not abstract black box objects, but numbers or fixed-length strings with a fixed bit length structure, can we break through this seal?

**The answer is: non-comparison sorting can be done in  $O(N)$  Complete sorting in linear time!**

## 2. Counting Sort: Absolute linear sorting based on frequency statistics

*(Reference time: 00:09:40 · [Video jump (P35 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=580))*

Assume that all values in the array to be sorted are within a limited small range  $[0, R-1]$  within (such as student test scores  $0 \sim 100$): 
1. **frequency statistics**:Create a file of size  $R$  Count array of  `count[]`, count the total frequency of occurrence of each value;
2. **prefix and cumulative**: will  `count[]`  Convert to cumulative starting index position;
3. **stable writeback**: Scan in reverse from the original array and put the elements directly into the auxiliary array according to the index.

The total time complexity is the ultimate  **$\Theta(N + R)$**! When the base  $R$  Much smaller than the amount of data  $N$ , this is purely linear time!

## 3. Radix Sort Low Endian (LSD Radix Sort)

*(Reference time: 00:19:15 · [Video jump (P35 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=1155))*

If you want to sort the length of  $W$  long strings or large integers, direct counting sorting will result in  $R$  Extremely huge.

**LSD (Least Significant Digit First) algorithm** Starting from the least important bit and working towards the highest bit:
> **core principles**:   
> **From right to left, run a stable counting sort (Stable Counting Sort) for each bit!**

### Why is right to left correct?
Because counting sorting is \*\*stable\*\*! When sorting according to the more significant bits, if the current bits of the two are the same, the previous relative order of the lower bits will be completely retained!  
carry out  $W$  After rounds of stable counting and sorting, the whole must be completely in order! The total time is strictly  **$\Theta(W \cdot (N + R))$**!

## 4. Radix sorting with high endianness (MSD Radix Sort)

*(Reference time: 00:28:30 · [Video jump (P35 00:28:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=1710))*

**MSD (Most Significant Digit First) algorithm** Advancing from the highest bit to the lowest bit, similar to divide and conquer in a dictionary tree:
1. Split the data based on the first character to  $R$  in different buckets;
2. Recursively sort the data in each bucket by the next character.

Suitable for variable-length string sorting, but note that when recursing into small slices, switch to insertion sort to eliminate the recursive call overhead.

## 5. Summary of this lecture and post-class self-assessment

*(Reference time: 00:36:00 · [Video jump (P35 00:36:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2160))*

### Comprehensive self-test questions after class
Will LSD still work correctly if I use an unstable heap sort for a subsort in LSD radix sort?  
**Answers and analysis**:   
**Absolutely not!**  The correctness of LSD is 100% dependent on subordering **Stability**. If unstable, high-order sorting will instantly disrupt the relative order established by the previous low-order sort, causing the final result to be completely wrong.

## 6. Complete Java algorithm implementation and line-by-line analysis of LSD radix sorting

*(Reference time: 00:42:00 · [Video jump (P35 00:42:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2520))*

Let's write a program that handles fixed-length strings (each string is exactly  $W$) for ascending sorting:

```java
public class LSD {
    private static final int R = 256; // 扩展 ASCII 字符集大小

    /** 对定长为 W 的字符串数组 a 进行 LSD 基数排序 */
    public static void sort(String[] a, int W) {
        int N = a.length;
        String[] aux = new String[N];

        // 核心铁律：从右往左（最低位 d = W-1 到最高位 d = 0）
        for (int d = W - 1; d >= 0; d--) {
            int[] count = new int[R + 1];

            // 1. 统计当前第 d 个字符出现的频率
            for (int i = 0; i < N; i++) {
                char c = a[i].charAt(d);
                count[c + 1]++;
            }

            // 2. 计算前缀和：将频率转化为目标索引区间
            for (int r = 0; r < R; r++) {
                count[r + 1] += count[r];
            }

            // 3. 稳定写回辅助数组
            for (int i = 0; i < N; i++) {
                char c = a[i].charAt(d);
                aux[count[c]++] = a[i];
            }

            // 4. 将辅助数组拷回原数组
            System.arraycopy(aux, 0, a, 0, N);
        }
    }
}
```
After strict  $W$  Round stable counting sorting, the original array is in  $O(W(N + R))$  Completely lined up inside!

## 7. In-depth three-way string quick sort (3-Way String Quicksort)

*(Reference time: 00:48:30 · [Video jump (P35 00:48:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=2910))*

MSD radix sort, while fast, creates too many small arrays when encountering a large number of common long prefixes. The pinnacle of combining the wisdom of MSD and quick sort is **3-Way String Quicksort**: 

### Algorithm execution logic
at the current character position  $d$ , pick a character as the pivot:
- Strings smaller than Pivot characters are shunted to the left;
- **Strings exactly equal to Pivot characters are branched to the middle, and the character pointer is stepped to during recursion.  $d + 1$**!
- Strings larger than Pivot characters are branched to the right.

It combines the extremely low memory overhead of quick sorting with in-place partitioning and the advantages of radix sorting in common prefix hopping. It is the top engineering solution for all-Java string sorting.

## 8. MSD radix sort recursive offloading and small array insertion sort smooth switching

*(Reference time: 00:54:00 · [Video jump (P35 00:54:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=3240))*

In industrial-grade MSD radix sort implementations, you must be wary of the "small array recursion trap":
- As the recursion proceeds downward, the character set continues to split, and the size of the subarray will be reduced to only a few elements;
- Repeatedly allocate the size of these elements to  $R = 256$  The counting array will cause the time and space overhead to spiral out of control!
- **Industrial grade smooth switching strategy**: 
  ```java
  private static final int CUTOFF = 15; // 阈值常数
  if (hi <= lo + CUTOFF) {
      insertionSort(a, lo, hi, d); // 切换为插入排序
      return;
  }
  ```
Performance is maximized by switching to insertion sort on small slices, eliminating up to 90% of the recursive overhead of small arrays.

## 9. Industrial-grade radix sort optimization: mask extraction of 32-bit integers and 4 rounds of ultra-high-speed byte bucketing

*(Reference time: 00:58:30 · [Video jump (P35 00:58:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35&t=3510))*

In the industry, massive 32-bit integer data (`int[]`) when performing extremely fast sorting, the fastest solution is not to take modulo decimal, but to divide 32 bits into  **4 8-bit bytes**: 
- Cardinality  $R = 2^8 = 256$; 
- Number of rounds  $W = 4$; 
- Extract bytes via hardware shift and mask: `int digit = (a[i] >> (d * 8)) & 0xFF;`
- Processing the negative sign bit: In the last round of the highest byte, the highest sign bit is biased and inverted (Flip sign bit  `^ 0x80`); 
- This solution completely avoids slow division and modulo operations, and directly completes it through CPU hardware displacement and L1 cache hits. It can sort tens of millions of integers per second!

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 35. Radix Sorts

By Mihir Mirchandani

---

## 35.1 Counting Sort

Imagine if instead of driving a slow Honda Civic, we started driving a fast Ferrari. Unfortunately, we won't actually be driving in a Ferrari today, but we will witness a blazing fast algorithm that's just as fast called Radix Sorts. 

When sorting an array, sorting requires $$\Omega(N \log N)$$compare operations in the worst case (array is sorted in descending order). Thus, the ultimate comparison based sorting algorithm has a worst case runtime of $$\Theta(N \log N)$$.

From an asymptotic perspective, that means no matter how clever we are, we can never beat Merge Sort’s worst case runtime of $$\Theta(N \log N)$$. But what if we don't compare at all?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FfO3Soswe0bCDHeCuMipB%2FScreen%20Shot%202023-04-15%20at%202.26.42%20AM.png?alt=media&amp;token=d0524a55-9ab4-45fa-a7d0-e267facc29bd" alt=""><figcaption><p>Left is original, right is ordered output</p></figcaption></figure>

Essentially what just happened is that we first made a new array of the same size and then just copied all of the # indexes to the correct location. So first we look at 5 Sandra Vanilla Grimes and then copy this over to the 5th index in our new array.

This does guarantee $$\Theta(N)$$ worst case time. However what if we were working with 

* Non-unique keys.

* Non-consecutive keys.

* Non-numerical keys.

All of these cases are complex cases that aren't so simple to deal with. Essentially what we can do is create a simpler method which is to:

* Count number of occurrences of each item.

* Iterate through list, using count array to decide where to put everything.

Bottom line, we can use counting sort to sort $$N$$ objects in $$\Theta(N)$$ time. 

---

## 35.2 LSD Radix Sort

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F17vIG2wxJU2Fahu8r2Lb%2FScreen%20Shot%202023-04-15%20at%202.44.24%20AM.png?alt=media&amp;token=2613ad28-5c06-429b-93d4-cdb5949ce42d" alt=""><figcaption><p>Least Significant Digit Radix Sort -- Using Count Sort</p></figcaption></figure>

Notice in the above picture that we had a completely random input of numbers 22, 34, 41, etc. Then in the second box, we had sorted by right most digit, so 41, 41, 31 would come first as 1 is the lowest rightmost digit. Next would come 32, 22, 12, as 2 is the second least rightmost digit. Notice that we still have to take care of sorting 32, 22, and 12 which is why we move to the second right most digit in our last box which has everything sorted. 

What is the runtime of LSD sort?

* $$\Theta(WN+WR)$$

* $$N$$: Number of items, $$R$$: size of alphabet, $$W$$: Width of each item in # digits

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FzLGidJKP8E2n2Fn1CpRU%2FScreen%20Shot%202023-04-15%20at%202.49.06%20AM.png?alt=media&amp;token=e803ef6a-a8f4-4a69-bb65-c4c110da338b" alt=""><figcaption><p>Non-equal Key Lengths</p></figcaption></figure>

---

## 35.3 MSD Radix Sort

Basic idea: Just like LSD, but sort from leftmost digit towards the right.

<details>

<summary>Suppose we sort by topmost digit, then middle digit, then rightmost digit. Will we arrive at the correct result?    </summary>

No, this will result in sorting the array by right most digit only as we are not saving the topmost and middle digit.

</details>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FhqNX7UJTdZgipXuyMSuP%2FScreen%20Shot%202023-04-15%20at%202.55.34%20AM.png?alt=media&amp;token=dcc41166-3464-4114-8ded-10f7239ada3f" alt=""><figcaption><p>MSD Radix Sort (correct edition)</p></figcaption></figure>

Notice first we sorted by leftmost digit. Then we grouped the data by the leftmost digit, so one group would start with a's, then the next group would start with b's, and so on and so forth. Then within our subgroups we would order by middle digit, and create newer subgroups. And finally we would break this up into further subgroups until we have all individual subproblems. This final result would be sorted.

#### Runtimes

Best Case. 

* We finish in one counting sort pass, looking only at the top digit: $$\Theta(N+R)$$

Worst Case.

* We have to look at every character, degenerating to LSD sort: $$\Theta(WN+WR)$$

#### Summary of Runtimes

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FcfQFyXOaFTfZA88SQO84%2FScreen%20Shot%202023-04-15%20at%202.58.27%20AM.png?alt=media&amp;token=d1f1cd73-4039-44fd-acd9-75fa91285246" alt=""><figcaption></figcaption></figure>

---

## 35.4 Summary

**Terminology.**

* Radix - just another word for ‘base’ as in the base of a number system. For example, the radix for words written in lowercase English letters is 26. For number written in Arabic numerals it is 10.

* Radix sort - a sort that works with one character at a time (by grouping objects that have the same digit in the same position).

* Note: I will use ‘character’ and ‘digit’ interchangably in this study guide.

**Counting Sort.** Allows you to sort $$N$$ keys that are integers between $$0$$ and $$R-1$$ in $$\Theta(N+R)$$time. Beats linearithmic lower bound by avoiding any binary compares. This is a completely different philosophy for how things should be sorted. This is the most important concept for this lecture.

**LSD.** In the LSD algorithm, we sort by each digit, working from right to left. Requires examination of $$\Theta(WN)$$digits, where $$W$$is the length of the longest key. Runtime is $$\Theta(WN+WR)$$, though we usually think of $$R$$ as a constant and just say $$\Theta(WN)$$. The $$\Theta(WR)$$ part of the runtime is due to the creation fo length $$R$$ arrows for counting sort. We usually do LSD sort using counting sort as a subroutine, but it’s worth thinking about whether other sorts might work as well.

**LSD vs Comparison Sorting.** Our comparison sorts, despite requiring $$\Theta(N\cdot logN)$$ time, can still be faster than LSD sort. For extremely large N, LSD sort will naturally win, but log N is typically pretty small. Know which algorithm is best in the two extreme cases of very long dissimilar strings and very long, nearly equal strings.

**MSD.** In MSD sorting, we work from left to right, and solve each resulting subproblem independently. Thus, for each problem, we may have as many as $$R$$ subproblem. Worst case runtime is exactly the same as LSD sort, $$\Theta(WN+WR)$$, though can be much better. In the very best case, where we only have to look at the top character (only possible for $$R>N$$), we have a runtime of $$\Theta(N+R)$$.

---

## 35.5 Exercises

### Factual

1. If we use counting sort to sort all 61B students by the number of siblings they have, how long will the counting array be? Let $$N$$ be the total number of students and $$M$$ be the maximum number of siblings a student has.

2. When performing a radix sort like LSD or MSD, which of the following sorting algorithms could we use for each digit?

   * [ ] Counting sort

   * [ ] Heapsort

   * [ ] Mergesort

   * [ ] Selection sort

3. If we're sorting N lowercase english strings using MSD sort, what is the maximum number of subproblems after considering only the the most significant digit?

<details>

<summary>Problem 1</summary>

The counting array will have $$M$$ entries. In general for counting sort, the count array's length only needs to be equal to the maximum number of unique elements we are counting.

</details>

<details>

<summary>Problem 2</summary>

Recall that the sub-sort for each digit must be stable. This rules out heapsort and selection sort.

* [x] Counting sort

* [ ] Heapsort

* [x] Mergesort

* [ ] Selection sort

</details>

<details>

<summary>Problem 3</summary>

26, since there are 26 possible values for the first digit we're sorting on.

</details>

### Metacognitive

1. What are some advantages of counting sort over quicksort?

2. Why do we use LSD over counting sort?

3. If we use MSD radix sort, we start with a single problem of size N, where N is the number of strings. Depending on the results on the most significant digit, we end up with a larger number of smaller subproblems, i.e. we're doing some divide and conquer. In the worst case, we end up with only one subproblem, also of size N. When does this happen?

<details>

<summary>Problem 1</summary>

Many correct answers, but some advantages include:

* For sufficiently large N, counting sort is faster (since it is linear as compared to N log N).

* Counting sort is stable, since we scan from the first element to the last.

* Counting sort doesn't use comparisons between elements, which might be useful if elements are not comparable.

</details>

<details>

<summary>Problem 2</summary>

Counting sort is technically faster than LSD, since counting sort doesn't require splitting up items by digits/letters. However, counting sort can require extremely large amounts of memory in some cases (for example, when sorting `String`s, you need one entry in an array for every possible `String`). 

</details>

<details>

<summary>Problem 3</summary>

This happens when items start with the same digit. In this case, all items end up in the same subgroup after the first iteration of MSD, and we recurse on a problem of size N.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Software Engineering III: Software Engineering Ethics and Technical Reflection](/en/notes/cs61b/lecture-34) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Sorting VI: Radix Sort vs Comparison Sort The Ultimate Showdown →](/en/notes/cs61b/lecture-36) | [🎬Watch this lecture on Bilibili (P35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=35) |
