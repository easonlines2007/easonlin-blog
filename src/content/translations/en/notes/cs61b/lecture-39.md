---
kind: notes
source: cs61b/lecture-39
title: "Lecture 39 · Computational Complexity: Reductions, P, NP, and NP-Completeness"
description: "CS61B Lecture 39: Computational Complexity Theory: Reduction and P
  and NP Problems: Polynomial time P, nondeterministic polynomial time NP, NP
  completeness and the Millennium Mathematical Conjecture"
sourceHash: 270e5e54db1446f872c462cf1317d2b68f6cb1c02edeebe76a83e2f512c6fb8c
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 7: Software Engineering, Advanced Algorithms and Computational Theory (Software Engineering & Complexity)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 47:54 ｜ **Official original version**: Lecture 39 - Computability P=NP  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P39)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1QFwbmMVE0Wlvg-gnWnemTxRX_t7h6IlhCQU69dcAkaA) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np)  
> **Quick navigation**: [← Previous Lecture (P38 Data Compression Theory: Huffman Coding and Prefix-Independent Code)](/en/notes/cs61b/lecture-38) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P40 Course Summary and Future Direction: Exploring the Avenue after 61B) →](/en/notes/cs61b/lecture-40)

---

## 1. The solvability boundary of the problem: polynomial time (Class P)

*(Reference time: 00:01:25 · [Video jump (P39 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=85))*

In CS 61B we saw a number of algorithms that can be solved in polynomial time:
- sort($O(N \log N)$); 
- Shortest path Dijkstra($O(E \log V)$); 
- Dynamic connectivity union lookup ($O(N \alpha(N))$).

### Complexity Category P (Polynomial Time)
All can be done in polynomial time (Polynomial Time,  $O(N^k)$  Among them  $k$  is a constant)\*\* that is completely solved by a deterministic computer, collectively referred to as  **P-type questions**. This is a set of cornerstone problems that computer scientists think have realistic and feasible solutions (Tractable).

## 2. The gap between verification and solution: complexity category NP

*(Reference time: 00:10:40 · [Video jump (P39 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=640))*

Consider a Sudoku game, or the classic Traveling Salesperson Problem (TSP):
- If you were asked to find an optimal solution from scratch, it might take exponential  $O(2^N)$  brute force exhaustive search;
- **But: if someone else directly gives you a filled-in answer and asks you to verify whether the answer is correct, you only need a few milliseconds of polynomial time to complete the verification!**

### Complexity category NP (Nondeterministic Polynomial Time)
The set of all decision problems that can be verified in polynomial time (Polynomial-Time Verifiable)\*\* is collectively called  **NP type problem**.  
Obviously, $P \subseteq NP$ (Any problem that can be solved within a polynomial must also be verified within a polynomial).

## 3. Reduction and NP-Complete problems

*(Reference time: 00:20:15 · [Video jump (P39 00:20:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=1215))*

If we don’t know how to solve problem A, but we can convert problem A to (Reduce to) the known problem B in polynomial time:
So as long as you can solve problem B, it is equivalent to solving problem A!

### Cook-Levin Theorem and NP-Complete
In 1971, Stephen Cook proved that the Boolean satisfiability problem (3-SAT) is extremely general: **All NP problems can be reduced to 3-SAT in polynomial time!**

This gave birth to the most dangerous category in computer science -**NP-Complete (NP-complete problem)**: 
- NP-complete problems are the toughest bastion of core hardcore in the entire NP family;
- **Shocking chain reaction**: **As long as someone can solve any NP-Complete problem in polynomial time, then all thousands of NP problems known to mankind will be completely broken in polynomial time in an instant!**

## 4. Millennium Century Problem: Is P equal to NP (P vs NP)?

*(Reference time: 00:29:30 · [Video jump (P39 00:29:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=1770))*

Clay Institute of Mathematics will  **P vs NP**  Ranked as the first of the world's seven millennium mathematical problems, with a million-dollar reward.

- if  $P = NP$: means "things that can be easily verified must be equally easy to create"! The modern RSA cryptosystem based on large number decomposition will collapse instantly, and protein folding and new drug discovery will usher in exponential breakthroughs;
- Most computer scientists tend to believe  $P \neq NP$, that is, the difficulty of creating a solution is essentially much higher than that of verifying a solution.

## 5. Summary of this lecture and post-class self-assessment

*(Reference time: 00:37:00 · [Video jump (P39 00:37:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39&t=2220))*

### Self-assessment and reflection after class
When we encounter a problem that is proven to be NP-Hard in real work, should engineers give up?  
**answer**: Never give up! The inability to find a strict global optimal solution does not prevent us from designing \*\*polynomial approximation algorithms (Approximation Algorithms)\*\* or heuristic searches (such as genetic algorithms, simulated annealing) to find 99.9% close to optimal practical solutions in a few seconds!

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 39. Compression, Complexity, P = NP

- [39.1 Models of Compression](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.1-models-of-compression.md)

- [39.2 Optimal Compression, Kolmogorov Complexity](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.2-optimal-compression-kolmogorov-complexity.md)

- [39.3 Space/Time-Bounded Compression](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.3-space-time-bounded-compression.md)

- [39.4 P = NP](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.4-p-np.md)

- [39.5 Exercises](https://cs61b-2.gitbook.io/cs61b-textbook/39.-compression-complexity-p-np/39.5-exercises.md)

---

## 39.1 Models of Compression

### Comparing Compression Algorithms

In the last chapter, we saw many approaches to compression. This raises an interesting question: for a given bitstream, what is the best algorithm for compression?

For example, consider compression the text of Moby Dick using different compression formats. In this case, `bzip2` yields the best compression.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FO7UqH9ubjgskBevPScdz%2Fimage.png?alt=media&amp;token=3e947dc1-ed7b-4403-a5b2-7dcc1c672412" alt=""><figcaption><p>Different compression formats applied to <code>mobydick.txt</code></p></figcaption></figure>

One might argue, however, that the best possible compression algorithm for `mobydick.txt` is simply as follows:

<pre><code>D(B):

<strong>    if input == 0:

</strong>        return "Call me Ishamel. ...."

    else:

        return the text as is

</code></pre>

Using this as our decompression function, we can condense all of Moby Dick into a single bit!

However, there is a problem with this approach. If we include the code for the decompression algorithm as part of the compressed model (recall compression model 2 from the previous chapter), we see that Moby Dick is not compressed to one bit, but actually requires *more* bits than the original text!

### Decompression Algorithms

Ultimately, the goal of a compresion algorithm is to find short sequences of bits that generate desired longer sequences of bits. Formally stated, our problem is as follows:

* Given a sequence of bits `B`, find a shorter sequence `DA + C(B)` that produces `B` when fed into an interpreter. `DA` represents the bits for the decompression algorithm, while `C(B)` represents the compressed version of `B`.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FMCYkJqoXfJQjA9H4QEtj%2Fimage.png?alt=media&amp;token=8a2f85f6-19f2-410b-a7c4-57ff339cd5c2" alt=""><figcaption><p>Our compression model applied to <code>mobydick.txt</code>.</p></figcaption></figure>

### Improving Compression

Recall the `HugPlant` example from the previous chapter. Using Huffman encoding, we can achieve a compression ratio of 25%. 

However, using another algorithm we'll call `MysteryX` for now, we can compress `HugPlant.bmp` down to 29,432 bits! This achieves a 0.35% compression ratio. Out of the $$2^{8389594}$$ possible bistreams of length $$8,389,594$$, only one in $$2^{8360151}$$ can achieve such a compression ratio.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FhQU7fNItG1XxGIxo6VRl%2Fimage.png?alt=media&amp;token=42238a0b-5344-4478-8f31-00b7716240c0" alt=""><figcaption><p>A mystery compression algorithm that outperforms Huffman encoding by a large margin.</p></figcaption></figure>

What is `MysteryX`? Well, it's simply the Java code `HugPlant.java` written to generate the `.bmp` file! Going back to the model of self-extracting bits, we see the power of code and interpreters in compression. This leads us to two interesting questions:

* **comprehensible compression:** given a target bitstream `B`, can we create an algorithm that outputs useful, readable Java code?

* **optimal compression**: given a target bitstream `B`, can we find the *shortest* possible program that outputs this bitstream?

---

## 39.2 Optimal Compression, Kolmogorov Complexity

### Kolmogorov Complexity

We define the **Kolmogorov complexity** of a bitstream `B` to be the shortest bitstream $$C\_B$$ that outputs `B`. Let the *Java-Kolmogorov complexity* $$K\_J(B)$$ be the shortest Java program that generates `B`.

Note that for any bitstream $$B$$, $$K(B)$$ definitely exists. However, finding and proving $$K(B)$$ might be difficult or even impossible.

#### Languages and Complexity

An important thing to note is that Kolmogorov complexity is language-independent. To run any program in one language in another, all I have to do is write an interpreter. For example, if I want to run a Python program that is not easily translatable to Java, I could instead just write a Java interpreter to read the text of the Python program and run it. In this case, $$K\_J(B) \leq K\_P(B) + I$$, where $$I$$ is the length of the interpreter (a constant value).

This highlights a very deep fact about Kolmogorov complexity: most bitstreams are fundamentally incompressible no matter which language we choose for our compression algorithm.

Consider a bitstream of 1,000,000 bits. Out of all compression algorithms possible, only 1 in $$2^{4999999}$$ bitstreams have a change of being compressed by more than 50% (499,999 bits or less).

#### Uncomputability

Another important fact regarding Kolmogorov complexity is that it is impossible to compute. A proof of this fact is provided [here](https://en.wikipedia.org/w/index.php?title=Kolmogorov_complexity#Uncomputability_of_Kolmogorov_complexity).

Practically, this means that it is impossible to write a "perfect" (optimal) compression algorithm, since we can't even compute the length of the shortest program!

---

## 39.3 Space/Time-Bounded Compression

As described in the previous chapter, it is impossible to write the "perfect" compression algorithm that requires the fewest bits to output some bitstream $$B$$. 

### Space-Bounded Compression

However, what about the problem of space-bounded compression? In this problem, we take in two inputs: a bitstream $$B$$ and a target size $$S$$. The goal, then, is to find a program of length $$\leq S$$ that outputs $$B$$. 

It turns out that such a problem is also uncomputable. If it were, then we could simply binary search on different values of $$S$$ to find the optimal compression program size, which is impossible as shown in te previous section.

### Space-Time-Bounded Compression

What if we take our problem from above, and add a constraint that we can run at most $$T$$ lines of bytecode?

It might seem unintuitive, but this kind of problem is actually solvable. We will use the following algorithm:

```

for length L = 1....S:

    for each possible program P of length L:

        while (P is running && !(B is outputted) && lines_executed < T):

            run the next line of P

```

The runtime of this algorithm is $$O(T \cdot  2^S)$$, and in the end, it will either output some program `P` that has the correct output and is bounded by $$T$$ and $$S$$, or return that no such program is possible.

### Efficient Bounded Compression

The runtime above is exponential in $$S$$. Thus, we might ask if it's possible to solve the space-time-bounded compression problem *efficiently*. As we'll see in the next chapter, this depends on our definition of efficiency.

---

## 39.4 P = NP

### Reductions

It turns out that space-time-bounded compression reduces to 3SAT, INDSET, LONGESTPATH, and many other hard problems. (The actual proof of such reductions is incredibly complex and ommitted from this textbook).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FzNxXfJvAA7l9tDxIlBQK%2Fimage.png?alt=media&amp;token=d3fbfeff-3071-4176-aed8-f47f8ff2e337" alt=""><figcaption><p>Space-time-bounded compresion can be solved with LONGEST_PATH.</p></figcaption></figure>

The reason that space-time-compression can be turned into longest paths (or any other problem mentioned above) is that all these problems are part of a **complexity class** known as **NP**. A property of such problem is that any NP problem can be reduced to any NP-complete problem, including longest paths.

In subsequent section, we will briefly cover what P, NP, and complexity classes are. However, most of these topics are far beyond the scope of this textbook or course, and would be better served by taking an upper-level algorithms course.

### P and NP

All yes/no problems can be divided into two main classes:

* P: efficiently solvable problems.

* NP: problems with solutions that are efficiently verifiable. This means that given an answer to the problem, you can efficiently check whether the answer is correct or not.

Examples of problems in P include (note that P is a subset of NP):

* Is this array sorted? 

  * This can be solved by sorting the array using any sorting algorithm, and verified by checking that adjacent elements are increasing.

* Does this array have duplicates?

  * This can be solved with a double for-loop, and verified in a similar manner.

Examples of problems in NP include:

* Is there a solution to this 3SAT problem?

  * Generating a solution to a 3SAT problem is difficult, but given an assignment of symbols to booleans, you can simply plug in the values and check that the equation is satisfied.

* In graph G, does there exist a path from s to t of weight > k?

  * Genearting a solution to this (essentially longest paths) is difficult, but given a path, you can easily verify if it is a valid path from s to t and that its weight is > k.

Examples of problems not in NP include:

* Is this the best chest move I can make next?

  * There is no efficient way to verify that a chess move is indeed optimal, unless you draw out all possibilities for all subsequent moves.

* What is the longest path?

  * This is not a yes-no question.

### NP-Completeness

An unexpected property of NP problems is that every NP problem reduces to every NP-complete problem. This reduction is also "efficient", in that the problem can be transformed (pre-processed and post-processed) in polynomial time.

This also means that solving any NP-complete problem essentially solves all problems in NP. As of today, there are tens of thousands of known NP-complete problems, but none of them have been solved yet.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F2dBm6rom80OW1pQ3AQyZ%2Fimage.png?alt=media&amp;token=7c685324-f9fb-45ad-84bc-c66f41a47c3b" alt=""><figcaption><p>NP-complete problems and reductions.</p></figcaption></figure>

### P = NP?

An open question in computer science is whether P = NP; in other words, are all problems with efficiently verifiable problems (NP) also efficiently solvable (P)?

One reason to suggest that P = NP might be true is that checking an answer is always efficient. Thus, given the right pruning, could we efficiently zero in on an answer?

---

## 39.5 Exercises

### Factual

1. True/false: suppose we have a 45000-bit program in Python that outputs a bitstream B. What is the maximum size of an interpreter written in Java that proves the Java-Kolmogorov complexity is less than 100,000?

2. What are the two defining properties of an NP problem?

<details>

<summary>Problem 1</summary>

The interpreter must be 55,000 bits or less. If it is, we can simply decompress the bitstream by running the Python program in the interpreter, using less than 100000 bits total (program + interpreter).

</details>

<details>

<summary>Problem 2</summary>

* The problem is a yes-no problem.

* A solution to the problem is efficiently verifiable.

</details>

### Procedural

1. What is the probability that some sequence of 1 million bits could be compressed to 900,000 bits or less?

<details>

<summary>Problem 1</summary>

There are $$2^{1000000}$$ bit sequences of length 1 million, but only $$2^0 + 2^1 + ... 2^{899999} + 2^{900000} = 2(2^{900000}) - 1 \approx 2^{900001}$$ bit sequences of length 900,000 or less. This means that the probability of any bitsequence being compressed to 900,000 bits or less is $$\frac{2^{900001}}{2^{1000000}} = \frac{1}{2^{99999}}$$.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Data compression theory: Huffman coding and prefix-free codes](/en/notes/cs61b/lecture-38) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Course summary and future direction: Exploring the avenue after 61B →](/en/notes/cs61b/lecture-40) | [🎬Watch this lecture on Bilibili (P39)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=39) |
