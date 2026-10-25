---
kind: notes
source: cs61b/lecture-40
title: "Lecture 40 · Course Conclusion: Key Lessons and Learning Beyond CS61B"
description: "CS61B Lecture 40: Course Summary and Future Direction: Exploration
  of the Avenue after 61B: 40 Lectures Panoramic Knowledge Review, Top Ten
  Engineering Mindsets, Subsequent Advanced Courses and the Road to Becoming an
  Excellent Architect"
sourceHash: d98758684592a66021d2c4123c63f8eb95545a3929790b6947c19a1866e321b2
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 7: Software Engineering, Advanced Algorithms and Computational Theory (Software Engineering & Complexity)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 55:47 ｜ **Official original version**: Lecture 40 - Summary  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1MmnYUoi-4Wyt6_3BcBdt_WkrL1XECZ9ypCyUmhW7e2U)  
> **Quick navigation**: [← Previous lecture (P39 Computational complexity theory: reduction and P and NP problems)](/en/notes/cs61b/lecture-39) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ <span>Next Lecture: None (Complete Book)</span>

---

## 1. A long and glorious journey: CS 61B 40 Review of Panoramic Knowledge Tree

*(Reference time: 00:01:25 · [Video jump (P40 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=85))*

Congratulations! After 40 lectures of intense intellectual baptism, you have completely climbed the most important peak in UC Berkeley’s computer science undergraduate system.

Let us review this magnificent knowledge panorama:
1. **Language cornerstones and memory topology**: Java static compilation architecture, bit box model, golden rule of equal sign, stack and heap memory separation, raw pointers and IntList;
2. **Object-oriented and engineering encapsulation**: Sentinel node mode, class invariants, access control, two-way circular linked list, dynamic expansion AList amortization analysis;
3. **Type systems and abstract barriers**: Interface inheritance and implementation inheritance, polymorphic dispatch, `Comparable`  with  `Comparator`  Strategy pattern, iterator pattern, Object cornerstone contract;
4. **Progressive analysis and union search**: Big-Theta formal derivation, tree height logarithmic binding proof, weighted fast union search, path compression and Ackerman inverse function;
5. **Tree structure and the beauty of self-balancing**: BST and Hibbard deletion, 2-3 tree upward growth philosophy, left-leaning red-black tree (LLRB) rotational isomorphism, hash table and pigeonhole collision;
6. **Graph Theory and Network Flow**: DFS recursion stack, BFS shortest step number, topological sorting, Dijkstra shortest path, A\* heuristic navigation, minimum spanning tree cut theorem and Prim/Kruskal;
7. **Sorting and computational complexity**: Heap sort, merge sort, quick sort three-way split, $\Omega(N \log N)$  Theoretical lower bounds, radix sorting, Huffman compression and P vs NP.

## 2. CS 61B’s top ten engineering tips that will last a lifetime

*(Reference time: 00:12:00 · [Video jump (P40 00:12:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=720))*

After walking out of the 61B classroom, Java syntax may fade over time, but the following ten engineering ideas will be integrated into your engineer blood and accompany you throughout your career:

1. **Test Driven Development (TDD)**: Always write tests before writing business code. The test suite is the greatest confidence for refactoring;
2. **Class invariants above all else**: Clearly define the unshakable axioms of the object state, allowing invariants to be maintained at the end of each method;
3. **Sentinel node elimination special penalty**: Eliminate the ugly with unified physical topology  `if (null)`  special branch;
4. **Geometric expansion amortization constant**: Doubling is equal sharing  $O(1)$  The secret of math, arithmetic addition is a performance quagmire;
5. **Composition is better than inheritance**: Beware of fragile base classes and preferentially use interface contracts and strategy objects;
6. **Prevent free memory**: When deleting the referenced object in the container, it actively sets the pointer to zero to protect the garbage collector;
7. **Mutable objects do not have hash keys**: Avoid hash table ghost zombie memory tragedy;
8. **The height of a tree determines the life or death of an algorithm**: Small trees hang on big trees, rotational isomorphism, and logarithmic height are the eternal moats of efficiency;
9. **Content addressing and hash fingerprinting**: SHA-1 and immutable directed acyclic graph are the common cornerstones of distributed systems and blockchains;
10. **Embrace abstraction and face the bottom**: Not only has the architectural vision to design interfaces at the highest level of abstraction, but also has the microscopic insight into the operating system and hardware memory bits.

## 3. Berkeley follow-up course: How far can we go from 61B?

*(Reference time: 00:23:45 · [Video jump (P40 00:23:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=1425))*

After conquering 61B, you have mastered the computing world's universal data structure compass. The following is the next step UC Berkeley has laid for the Warriors:

- **CS 61C: Great Ideas in Computer Architecture** (computer architecture):  
  Dive into the depths of hardware and learn C language, assembly instruction set (RISC-V), digital logic circuits, pipeline CPU, multi-core parallelism and GPU acceleration;
- **CS 170: Efficient Algorithms and Intractable Problems** (Efficient Algorithms vs. Complexity):  
  The palace of theoretical algorithms, in-depth study of linear programming, network flow, mathematical proof of dynamic programming, stochastic algorithms and NP-completeness;
- **CS 162: Operating Systems and System Programming** (operating system):  
  Write an industrial-grade operating system kernel from scratch to handle process thread scheduling, virtual memory mapping, concurrency locks and distributed file systems.

## 4. Message: The road to becoming an outstanding software architect

*(Reference time: 00:33:00 · [Video jump (P40 00:33:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40&t=1980))*

Professor Josh Hug gave an affectionate message at the end of the class:  
“The most fascinating thing about computer science is that you only need a keyboard, a terminal and pure logical thinking to build a huge software universe out of nothing that operates with precision and benefits hundreds of millions of human beings.”

With the rigor, courage and persistent pursuit of elegant architecture given to you by 61B, bravely build your own software legend!

---

## Appendix: Official courseware core test points and discussion overview (In-Class Discussion & Problem Walkthroughs)

> **Introduction**: The content of this section is extracted from the official slide courseware of UC Berkeley CS61B, which contains the core thinking questions, code tracking questions and mid-term summary test points of the professor's in-depth interaction in class.

### Official courseware panoramic discussion and question-by-question analysis (Slide Questions & Exam Review)


#### Wrapping Things Up


#### Lecture 40


#### CS61B, Spring 2024 @ UC Berkeley


#### Slide Credit: Josh Hug


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### 61B in 12 Minutes or Less


#### Where We Started

- Just 14 weeks ago:
- What We’ve Learned about Programming Languages
- Object based programming: Organize around objects.
- Object oriented programming:
- Interface Inheritance.
- Implementation inheritance.
- Dynamic vs. static typing.
- Generic Programming, e.g. ArrayList<Integer>, etc.
- The model of memory as boxes containing bits.
- Bit representation of positive integers.
- Java.
- Some standard programming idioms/patterns:
- Objects as function containers (e.g. Comparators, IntUnaryFunctions).
- Default method specification in interfaces (Link).
- Iterators.
- Example: Programmer only needs to know List API, doesn’t have to know that ArrayList secretly does array resizing.
- Example: Array is a sequence of boxes. An array variable is a box containing address of sequences of boxes.

#### Important Data Structures in Java

- Important data structure interfaces:
- java.util.Collection (and its subtypes).
- With a special emphasis on Map (and its subtypes).
- Our own Collections (e.g. Map61B, Deque): Didn’t actually extend Collection.
- Concrete implementations of these abstract implementations:
- Examples: ArrayDeque implements Deque.
- Mathematical Analysis of Data Structure/Algorithm Performance
- Asymptotic analysis.
- O(·), Ω(·), Θ(·), and tilde notation.
- Worst case vs. average case vs. best case.
- Exemplar of usefulness of average case: Quicksort
- Determining the runtime of code through inspection (often requires deep thought).
- Multiplicative resizing is much better than additive resizing.
- Multiplicative resizing results in Θ(1) add runtime for ArrayLists.
- Additive resizing results in Θ(N) add runtime for ArrayLists.

#### PQ


#### List


#### Set


#### Map


#### DisjointSets


#### Chaining HT


#### LinkedList


#### Resizing Array


#### Heap


#### Red Black


#### BST (no balancing)


#### B-Trees (2-3 / 2-3-4)


#### Heap


#### Ordered Linked List


#### Balanced Tree


#### Resizing Array


#### LinkedList


#### Quick Find


#### Quick Union


#### WeightedQuickUnionUF


#### WQUPC

- Some Examples of Implementations for ADTs

#### Trie


#### Graph


#### Adjacency Matrix


#### Edge List


#### Adjacency Lists


#### Arrays vs. Linked Data Structures

- Array-Based Data Structures:

#### ArrayLists and ArrayDeque

- HashSets, HashMaps, MyHashMap: Arrays of ‘buckets’
- ArrayHeap (tree represented as an array)

#### Linked Data Structures


#### Linked Lists

- LinkedList, IntList, LinkedListDeque, SLList, DLList
- Trees: Hierarchical generalization of a linked list. Aim for bushiness.
- TreeSet, TreeMap, BSTMap, Tries (trie links often stored as arrays)
- Graphs: Generalization of a tree (including many algorithms).
- Tradeoffs of array-based vs. linked data structures.
- Write out code that inserts into a tree, for example. How find 5th largest, that sort of thing.

#### Tractable Graph Problems and Algorithms


#### Reachability


#### Topological Sort


#### Multiple Target


#### Shortest Paths by Total Edge Weight

- Single Target Shortest Paths by Total Edge Weight

#### Multiple Target


#### Shortest Paths by # of Edges


#### BFS Traversal


#### DFS Traversal


#### Dijkstra’s


#### A*


#### Bipartiteness


#### Cycle Detection


#### Minimum Spanning Tree


#### Minimum Spanning Tree


#### shortest path


#### shortest paths tree


#### Prim’s


#### Kruskal’s


#### shortest paths tree


#### vertex markings


#### vertex ordering


#### Discussed in section


#### DAGSPT

- Search-By-Key-Identity Data Structures:

#### Set


#### 2-3 Tree


#### RedBlack


#### External Chains


#### Linear Probing


#### Map


#### Searches using compareTo()


#### Analogous to Comparison-Based


#### Searches using hashCode() and equals()


#### Roughly Analogous to Integer Sorting

- Comparison Based Sorting Algorithms: Ω(N log N) worst case

#### Selection


#### Insertion


#### Merge


#### Partition


#### Counting


#### LSD


#### MSD


#### Counting

- Radix Sorting Algorithms: Θ(NW) worst case:
- Small-Alphabet (Integer) Sorting Algorithms: Θ(N) worst case

#### (require a sorting subroutine)


#### If store in helper BST, eq. to


#### If heapify first


#### Heapsort


#### Trie / TST

- Searches by digit. Analogous to Radix Sorting

#### Fun/Weird Topics (This Week)

- Compression:
- Huffman Coding, and selection of data structures for Huffman Coding.
- Other approaches: LZW and Run Length Encoding (extra slides).
- Compression, Complexity, and P=NP:
- Optimal compression is impossible.
- Bounded space/time compression is possible if P=NP.
- Allows you to find arbitrarily short programs that produce a given output in a given runtime.
- If P = NP, we could also solve all kinds of other interesting problems.

#### The Practice of Programming

- Java syntax and idioms.
- Unit testing (and its more extreme form: Test-driven development).
- Mining the web for code.
- Debugging:
- Identify the simplest case affected by the bug.
- Hunt it down, giving it no place to hide.
- With the right methodology, can find bugs even when finding bug through manual code inspection is impossible.
- Tactical vs. Strategic Programming.
- Avoid information leakage. Build deep modules. Minimize dependencies. Minimize obscurity.
- Real tools: IntelliJ, git, Truth, command line.
- Data structure selection (and API Design)
- Drive the performance and implementation of your entire program.

#### 13 minutes of a rant


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### Your Future


#### Your Life

- Two immediate questions:
- What classes should I take next semester?

#### How should I prepare for the final?

- Two long-term questions:

#### What am I capable of achieving?


#### What should I do with my life?


#### Class Poll (Your Answer)

- How many students are happy with the grade they are on track to receive?

#### Class Poll (Your Answer)

- What does a good grade in this class mean? How will a good grade in this class affect you?
- You understood the concepts in the class
- You can apply the concepts in this class in new and innovative exams
- Good grade -> leads to becoming a TA/jobs/Graduate School

#### Lets you declare the major


#### Proof of hard work


#### Different number on resume


#### Class Poll (My Answer)

- What does a good grade in this class mean? How will a good grade in this class affect you?
- A grade in this course is not a measure of your worth/intelligence.
- Several ways your grade could affect your future:

#### Future job prospects/grad school?

- While GPA is a factor, it's often not a very important one. Once you get into industry, job experience matters much more than college GPA.

#### GPA requirement to enter the CS major

- Unfortunately, this is a big determinator of getting into the major. Every faculty member and lecturer hates the GPA requirement because it incentivizes the wrong way to think about your grades
- Fortunately, students admitted after FA23 won't have that GPA requirement.

#### What does your grade mean?

- I would argue that the most important thing your grade tells you is how hard your next semester will be.
- Most of the time, you don't truly master a concept until you're forced to use it to solve something new. A lot of the concepts we've covered in the last half of the course will only solidify when you start taking 61C, 170, or any other "next step" class.
- The grade you get in this course is my message to you saying how difficult I predict it will be to develop that mastery in your next class.

#### What does your grade mean?

- An A in this class is a signifier of mastery. If you take a sequel course, you will likely do well even with other work on your plate. So you can take more/harder courses.
- A B in this class is a signifier of comprehension. If you take a sequel course, you will likely do well if you dedicate sufficient time to the class.
- A C in this class is a signifier of competence. If you take a sequel course, you will likely need to devote more time than usual to do well. So try to avoid taking too many courses at the same time
- Anything below a C is a signifier that you will struggle in a sequel course. Going directly to a sequel course will likely not be worthwhile. It may be good to retake the course so you get more time to digest concepts.
- Like surfing: Once you're behind a wave, it's difficult to climb it
- But if you're ahead of the wave, it pushes you forward
- If you're behind the wave, it may be best to wait for the next wave
- A Supporting Experiment for “Everyone Can Do Well”
- In Sp16, Josh gave students the option to fail intentionally to retake the course.
- On average, students were 2.5 letter grades higher the second time, e.g. someone in the middle of the B range got an A the second time.
- My interpretation: Even if you're not on pace for the grade you want, you have learned a lot from this course. That foundation will make it much easier to relearn the course material at a later time.
- Bottom line: You’re capable of achieving more than you might think possible.

#### The core "goal" of 61B

- Ultimately, 61A's main goal was to teach you how to program:
- Go from problem description to a code solution
- 61B's goal is to teach you why you program:
- You have a problem, and you need to decide that code is the best way to solve that problem
- 61C and 170 mainly focus on making the code you write efficient (170 by focusing on the theoretical algorithm design, and 61C by focusing on the reality of how a physical computer works).
- After that, most classes in the CS major focus on one tiny facet of CS (specialization)
- At this point, you have everything you need to build whatever you want from code.
- The best way to learn CS from now is to make something by yourself, and to play with code.
- How to have fun with CS: Competitive Programming and CTFs (Links in Speaker Notes)
- https://adventofcode.com/, https://icpc.global/, https://projecteuler.net/, https://codeforces.com/, https://cryptopals.com/, https://ctftime.org/, https://nsa-codebreaker.org/home
- How to have fun with CS: Programming Video Games
- https://www.zachtronics.com/, https://store.steampowered.com/app/370360/TIS100/, https://store.steampowered.com/app/2262930/Bombe/
- How to have fun with CS: Hackathons (https://www.calhacks.io/)

#### Your Life

- Two long-term questions:

#### What am I capable of achieving?

- Almost anything given time and motivation

#### What should I do with my life?

- You will be in high demand by everyone.
- Your skills will enable you to affect the world, possibly profoundly.
- Technology will continually to radically reshape the way we live our lives.

#### Choices (Yup)

- How you use your skills is up to you.

#### Choices (Yup)

- How you use your skills is up to you.

#### Using Your Powers for Good

- My request: Use your superpowers in a way that is a net positive for the lives of your fellow humans.
- I’m not saying that you must work for relatively low wages to uplift the downtrodden (though that’d be great, of course).
- …. but keep in mind that your work will profoundly affect the world.
- (Wanna talk about this stuff more? Take CS195!)

#### Josh: Does this seem surprising?


#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### AMA

- Questions About Anything for Peyrin and Me?

#### Lecture 40, CS61B, Spring 2024


#### 61B in 12 Minutes or Less


#### Your Future


#### AMA


#### Course Reflections


#### Course Reflections


#### Feedback Request

- We read all of your feedback, especially on the end of course evaluations.
- There is an official form from the university, and an internal survey for 61B that we’ll send out ourselves.
- Course evaluations factor heavily into lecturer reviews, and let us know what bits of the class we can improve.
- Academic interning: Learn more, help others, get units.
- Watch out for an announcement on the Spring 2024 61B Ed.

#### 61B Would Love to Have You Next Fall

- Special Thanks to the Staff (who keep the wheels on the bus)

#### Closing Thoughts (Peyrin)


#### Closing Thoughts

- It is a terrifying and awesome responsibility to decide how you should spend hundreds of your precious hours here at Berkeley.
- Don't worry about how others are doing, or focus on perfectly optimizing your college experience. Chances are, the choices you make now will lead to a good outcome. All you need to do is to be better than the person you were a year ago.
- Personally, I teach because I believe that I am doing the most good for the world in this position. Please, prove me right.


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Computational complexity theory: reduction and P and NP problems](/en/notes/cs61b/lecture-39) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | Complete book | [🎬Watch this lecture on Bilibili (P40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=40) |
