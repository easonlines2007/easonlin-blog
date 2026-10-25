---
kind: notes
source: cs61b/lecture-13
title: "Lecture 13 · Midterm 1 Review: References, Dynamic Dispatch, and Class
  Invariants"
description: "CS61B Lecture 13: Midterm review: Midterm 1 core test points
  sandbox and analysis of major questions: pointer model, dynamic dispatch
  matrix, loop summation and class invariant engineering troubleshooting"
sourceHash: 5492182c14d20430eb8af9465a956b03efb62566acfd886485369f2e88fe805b
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 3: Asymptotics & Disjoint Sets  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 52:35 ｜ **Official original version**: Lecture 13 - Midterm Review  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P13)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1XfRFqI5g6sM6LW2tWShnX-V2kVhBg6NJbIG6gvPtBn0)  
> **Quick navigation**: [← Previous lecture (P12 Asymptotic Analysis I: Algorithm Efficiency Measurement and Big O Ladder)](/en/notes/cs61b/lecture-12) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P14 Union search I: Dynamic connectivity and tree structure evolution) →](/en/notes/cs61b/lecture-14)

---

## 1. Midterm 1 Knowledge Panorama Sandbox: From Memory Physical Model to Interface Polymorphism

*(Reference time: 00:01:10 · [Video jump (P13 00:01:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=70))*

The first midterm exam (Midterm 1) of CS 61B is one of the most difficult and differentiated exams of the entire semester. It not only tests basic grammar, but also focuses on whether students can establish it in their minds **A flawless mental model of physical memory tracing (Mental Model Tracing)**.

### Midterm 1 four golden test modules
1. **Memory and pointer models (Pointers & Box-and-Pointer Diagrams)**: 
   - The golden rule of equal sign, pass-by-value semantics, stack creation and destruction, object aliasing (Aliasing);
2. **Linked list and array data structures (SLList/DLList/AList)**: 
   - Sentinel node topology, circular doubly linked list pointer inversion, geometric expansion amortization time;
3. **Object-oriented and type polymorphism (Inheritance & Dynamic Method Selection)**: 
   - Static type vs dynamic type, compile-time two-stage signature resolution, forced transformation and rewriting puzzle;
4. **Asymptotic Analysis**: 
   - Summation of cyclic series, derivation of best/worst case boundaries.

## 2. Analysis of classic high-frequency question types 1: Pointer jumping and destructive linked list tracking

*(Reference time: 00:09:40 · [Video jump (P13 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=580))*

This is the "reserved killer question" for the 61B midterm exam in previous years. The examiner will give a set of extremely messy pointer reassignments and ask to draw a memory map and write the final topology:

```java
IntList L = new IntList(5, null);
L.rest = new IntList(10, null);
IntList Q = L.rest;
Q.rest = L;
L.rest = null;
```

### Tracking Quartet
1. `L`  Points to node A in the heap (`item: 5, rest: null`); 
2. `L.rest = new IntList(10, null)`  Make node A's  `rest`  Points to node B in the heap (`item: 10, rest: null`); 
3. `IntList Q = L.rest;`: `Q`  The memory address of node B is copied and points to node B;
4. `Q.rest = L;`: Node B’s  `rest`  Pointed to node A!
5. `L.rest = null;`: **Fatal broken chain!**  Node A's  `rest`  became  `null`!

### final topology check
At this time from  `Q`  What can you see when you set off? 
`Q (10) -> Q.rest (5) -> Q.rest.rest (null)`!  
Originally passed  `L`  The head pointer of the linked list at the beginning is reconstructed to  `Q`  on, and the order of elements is completely flipped. In the exam, you must accurately draw the rectangular box and arrow of each pile of objects on the scratch paper. It is strictly forbidden to rely on pure mental imagination!

## 3. Analysis of classic high-frequency question types 2: Dynamic method allocation of full-process deduction matrix

*(Reference time: 00:18:20 · [Video jump (P13 00:18:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=1100))*

The classic "inheritance question" in the midterm exam usually contains 3 categories (such as  `Grandpa`, `Dad`, `Son`), which defines several overloaded or overridden methods with the same name:

```java
class A {
    public void m(A a) { System.out.println("A-A"); }
    public void m(B b) { System.out.println("A-B"); }
}
class B extends A {
    @Override
    public void m(A a) { System.out.println("B-A"); }
    public void m(B b) { System.out.println("B-B"); }
}
```

Question: Execute  `A obj = new B(); B param = new B(); obj.m(param);`  What is the output?

### 61B exam full score derivation formula table
Walk strictly in two steps, do not skip steps:
1. **The first step (look at the static type on the left during compilation)**: 
   - caller  `obj`  The static type is  `A`; 
   - parameters  `param`  The static type is  `B`; 
   - in static type  `A`  Find the best matching signature in: found  `m(B b)`!
   - **Lock compile-time signature: `m(B)`**!
2. **Step 2 (Look at the dynamic type on the right during runtime)**: 
   - caller  `obj`  The true dynamic type of is  `B`; 
   - View class  `B`  Whether signature is implemented  `m(B)`; 
   - Found it! `B`  There is inside  `public void m(B b) { System.out.println("B-B"); }`; 
   - **Final output: `B-B`**!

## 4. Analysis of classic high-frequency question types three: decryption of progressive complexity nested loop questions

*(Reference time: 00:27:00 · [Video jump (P13 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=1620))*

Examiners often design compound trap cycles of "geometric growth in the outer layer and geometric reduction in the inner layer":

```java
public static void f(int N) {
    for (int i = 1; i <= N; i *= 2) {
        for (int j = N; j > 0; j /= 2) {
            System.out.println("CS61B");
        }
    }
}
```

### Rigorous solution of series
- Outer loop: $i$  Starting from 1 and doubling until  $N$, a total of execution  $\approx \log_2 N$  times;
- Inner loop: $j$  from  $N$  Start halving until 1, total execution  $\approx \log_2 N$  times;
- internal and external variables  $i$  with  $j$  Completely decoupled and not affecting each other;
- Total number of executions: 
  $$\text{Total} = \sum_{i=1}^{\log N} \log N = \log N \times \log N = \Theta((\log N)^2)$$
 Pay Attention to Symbol Conventions: Writing  $\Theta(\log^2 N)$  or  $\Theta((\log N)^2)$, must not be written as  $\Theta(\log N^2)$ (The latter is equal to  $2 \log N$).

## 5. Analysis of Classic High-Frequency Question Types IV: Practical Combat of Class Invariants and Defensive Copy Design

*(Reference time: 00:36:15 · [Video jump (P13 00:36:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2175))*

The mid-term design question often requires handwriting a compact data structure method (such as a doubly linked list) while adhering to specific invariants.  `addMiddle`  or circular queue).

### A must-learn problem-solving routine: the three-step defense method
1. **Update the two-way handshake between predecessor and successor**: 
   ```java
   newNode.prev = curr;
   newNode.next = curr.next;
   curr.next.prev = newNode;
   curr.next = newNode;
   ```
2. **Null pointer and sentinel verification**:
If there are sentinel nodes, the above four lines of code are directly applicable to any empty or non-empty scene; if there are no sentinels, they must be completed.  `if (curr.next == null)`  Special judgment for other branches;
3. **Maintain status count**:
Don't miss it  `size++;`!

## 6. Exam answering strategies and pre-exam self-examination checklist

*(Reference time: 00:44:30 · [Video jump (P13 00:44:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2670))*

### Core tips before the exam
- **time management**: The 61B exam has a huge amount of questions, with an average of only 10-15 minutes for each big question. If you encounter a stuck polymorphic question, draw a picture first. If it takes more than 3 minutes, mark it as skip;
- **Refuse to make assumptions**: The behavior of the Java compiler is completely deterministic and strictly follows the language rules in single-step calculations;
- **Read the question keywords clearly**: Pay attention to whether the question requires writing a destructive (Destructive) or non-destructive (Non-destructive) method, and the required time is  $O(1)$  Still  $O(N)$.

## 7. Berkeley Midterm Examination Practice 1: Sans’ Pointer Rhapsody (Spring 2021 Exam Q3)

*(Reference time: 00:48:00 · [Video jump (P13 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2880))*

### Question restoration (Spring 2021 Midterm 1)
Consider the following classic question involving linked list pointer rewiring:
```java
public class Sans {
    public int val;
    public Sans next;
    public Sans(int val, Sans next) {
        this.val = val;
        this.next = next;
    }

    public static void mystery(Sans s) {
        while (s != null && s.next != null) {
            Sans t = s.next;
            s.next = t.next;
            t.next = s;
            s = s.next;
        }
    }
}
```
Assume that the initial linked list is: `A(1) -> B(2) -> C(3) -> D(4) -> null`.  
Question: Execute  `Sans.mystery(A)`  What happens to the linked list topology after that?

### Deep step-by-step deduction and trap analysis
1. **The first cycle starts**: `s`  point to  `A(1)`, `t`  point to  `s.next`  That is  `B(2)`; 
2. `s.next = t.next;`: let  `A.next`  point to  `C(3)`; 
3. `t.next = s;`: let  `B.next`  point to  `A(1)`! (At this time, a  `B -> A -> C -> D`, the first two nodes were successfully exchanged! );
4. `s = s.next;`: Pay attention to the  `s.next`  It has been changed to the second step  `C(3)`! Therefore  `s`  Advance to  `C(3)`; 
5. **The second cycle starts**: `s`  Point at this time  `C(3)`, `t`  point to  `s.next`  That is  `D(4)`; 
6. `s.next = t.next;`: `C.next`  point to  `null`; 
7. `t.next = s;`: `D.next`  point to  `C(3)`; 
8. `s = s.next;`: `s`  become  `null`, the loop exits normally!

### Final results and thoughts:
Nodes are flipped in pairs! Original linked list  `1 -> 2 -> 3 -> 4`  It became a pairwise interchange structure.  
**Essence of test points**: Must bite firmly **Statement execution timing**. when executing  `s = s.next`  when, `s.next`  It points to the memory address that has been modified. You must not mistakenly think that it still points to the original address.  `B`!

## 8. Berkeley midterm exam practice test 2: Extremely tricky DMS polymorphic dispatch question (Fall 2023 Exam Q4)

*(Reference time: 00:52:00 · [Video jump (P13 00:52:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3120))*

### Question Restoration (Fall 2023 Midterm 1)
The examiner gave the inheritance structure of four classes:
```java
class Bear {
    public void roar(Bear b) { System.out.println("Bear-Bear"); }
}

class PolarBear extends Bear {
    public void roar(Bear b) { System.out.println("Polar-Bear"); }
    public void roar(PolarBear pb) { System.out.println("Polar-Polar"); }
}

class Grizzly extends Bear {
    public void roar(Bear b) { System.out.println("Grizzly-Bear"); }
}
```

Determine the console output of the following call:
```java
Bear b = new PolarBear();
PolarBear pb = new PolarBear();
Bear g = new Grizzly();

b.roar(pb);  // 调用 1
g.roar(b);   // 调用 2
```

### Full score two-stage derivation calculation:
#### Call 1: `b.roar(pb)`
- **Stage 1 (Look at the static type on the left during compilation)**: 
  - caller  `b`  static type: `Bear`; 
  - parameters  `pb`  static type: `PolarBear`; 
  - Check class  `Bear`  What methods are there to receive  `PolarBear`?
  - class  `Bear`  There is only one way: `public void roar(Bear b)`. Since PolarBear is a subclass of Bear, it's an exact match!
  - **Lock compile-time signature: `roar(Bear)`**!
- **Phase 2 (Look at the dynamic type on the right during runtime)**: 
  - caller  `b`  The real dynamic type in the heap: `PolarBear`; 
  - Check class  `PolarBear`  Whether the signature of phase one lock is rewritten in  `roar(Bear)`?
  - Found it! `public void roar(Bear b) { System.out.println("Polar-Bear"); }`; 
  - **Output results**: `Polar-Bear`!

#### Call 2: `g.roar(b)`
- Stage one: `g`  static type  `Bear`, parameters  `b`  static type  `Bear` $\to$  Lock signature  `roar(Bear)`; 
- Stage two: `g`  dynamic type  `Grizzly`, check rewrite  $\to$  execute  `Grizzly.roar(Bear)`; 
- **Output results**: `Grizzly-Bear`!

## 9. Berkeley Midterm Real Exam Questions Practice 3: Comprehensive Design and Transformation of DLList and AList (Spring 2024 Midterm 1)

*(Reference time: 00:56:00 · [Video jump (P13 00:56:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3360))*

### Question design requirements
Design a method  `public void interleave(DLList other)`, convert another doubly linked list  `other`  nodes in **Interleaved insertion into the current linked list  `this`  in**. Requirements:
1. Existing pointers must be destructively reconnected in place and must not be used.  `new`  Apply for any new node;
2. Maintain strict double-loop sentinel invariants after the operation completes  `other`  It must become a legal empty linked list;
3. The time complexity is linear  $\Theta(N)$.

### Industrial grade full score achieved:
```java
public void interleave(DLList other) {
    if (other == null || other.size == 0) return;
    
    Node curr1 = this.sentinel.next;
    Node curr2 = other.sentinel.next;

    while (curr1 != this.sentinel && curr2 != other.sentinel) {
        Node next1 = curr1.next;
        Node next2 = curr2.next;

        // 将 curr2 插入到 curr1 之后
        curr1.next = curr2;
        curr2.prev = curr1;

        curr2.next = next1;
        next1.prev = curr2;

        // 步进到下一对位置
        curr1 = next1;
        curr2 = next2;
    }

    // 如果 other 还有剩余未接完的尾部节点，直接整体接到末尾
    if (curr2 != other.sentinel) {
        Node lastInThis = this.sentinel.prev;
        Node lastInOther = other.sentinel.prev;

        lastInThis.next = curr2;
        curr2.prev = lastInThis;

        lastInOther.next = this.sentinel;
        this.sentinel.prev = lastInOther;
    }

    // 维护不变量：更新 size 并清空 other
    this.size += other.size;
    other.sentinel.next = other.sentinel;
    other.sentinel.prev = other.sentinel;
    other.size = 0;
}
```
This question combines two-way pointer handshake, boundary connection and invariant clearing. It is the ultimate touchstone of the 61B data structure question.

## 10. Berkeley mid-term exam practice test 4: Recursive binary tree path summation (Spring 2024 Exam Q5)

*(Reference time: 01:00:00 · [Video jump (P13 01:00:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3600))*

### Question requirements
Given an ordinary binary tree, each node stores an integer  `int val`. Write a static method  `public static boolean hasPathSum(IntTreeNode root, int targetSum)`, determine whether there is a path from the root node to any leaf node, and the sum of the values of all nodes along the way is exactly equal to  `targetSum`.

### Recursive divide and conquer full score realization and baseline condition pit prevention:
```java
public class PathSumProblem {
    public static class IntTreeNode {
        public int val;
        public IntTreeNode left, right;
        public IntTreeNode(int v) { val = v; }
    }

    public static boolean hasPathSum(IntTreeNode root, int targetSum) {
        // 坑点 1：空树没有任何叶子节点，必为 false
        if (root == null) {
            return false;
        }

        // 坑点 2：必须严格判定是否为叶子节点（左右孩子皆为 null）
        if (root.left == null && root.right == null) {
            return targetSum == root.val;
        }

        // 递归向左右子树传递剩余目标差值
        int remaining = targetSum - root.val;
        return hasPathSum(root.left, remaining) || hasPathSum(root.right, remaining);
    }
}
```
**Test point tips**: Many students are here  `root == null`  time to judge  `targetSum == 0`, causing only the internal nodes of one-sided children to be incorrectly determined as legal path endpoints. Leaf node boundaries must be checked explicitly!

---

## Appendix: Official courseware core test points and discussion overview (In-Class Discussion & Problem Walkthroughs)

> **Introduction**: The content of this section is extracted from the official slide courseware of UC Berkeley CS61B, which contains the core thinking questions, code tracking questions and mid-term summary test points of the professor's in-depth interaction in class.

### Official courseware panoramic discussion and question-by-question analysis (Slide Questions & Exam Review)

- Stuff you want to cover on Friday/Monday, February 12

#### Static/Dynamic Type and Typecasting


#### Nested Classes


#### Linked Lists


#### Private/Public


#### Inheritance

- Casting and Dynamic Method Selection (DMS)
- When we press "play" on a Java program, two separate steps happen:
- Compilation (all errors here are compiler errors):

#### Checks for syntax errors

- Puts together a list of methods/attributes of every class
- If a class extends another class, inherit all the methods that aren't overridden
- If a class implements an interface, inherit all the default methods, and check to make sure that all abstract methods are overridden
- To override, a function must have the same name AND the same arguments, which collectively forms the function signature. Otherwise, the override doesn't work, and both methods are kept separately.

#### Assigns a static type to every variable

- Usually the type that the variable was declared as or the type that a method is defined to return
- But if a typecast occurs (and the typecast is theoretically possible), use the casted type
- Casting and Dynamic Method Selection (DMS)
- When we press "play" on a Java program, two separate steps happen:
- Compilation (all errors here are compiler errors):

#### Checks for syntax errors

- Puts together a list of methods/attributes of every class

#### Assigns a static type to every variable

- Checks each line in isolation to see if there's a way to run that line
- Assumes the static type of every variable
- After all checks, converts the code to a computer-friendly language so it can actually be run.
- Note: Only happens once normally. After compiling once, you can run the same code repeatedly without going through the checks above, so it's faster
- Casting and Dynamic Method Selection (DMS)
- When we press "play" on a Java program, two separate steps happen:
- Runtime (all errors here are Runtime Errors)

#### Actually runs the program

- Relies on the dynamic type of the object (what the object was created as)
- On a function call, uses the method of the same name in the dynamic type's class
- If multiple methods have the same name (overloaded), pick the one whose signature matches
- Finds any illegal actions that can't be found by static type analysis
- If we lied in compilation about a typecast (ex. (Poodle) new Dog()), error
- Array out of bounds errors, out of memory errors, etc.
- Note: The hardest parts of DMS are considered out of scope for this class. In particular, we won't override an overloaded method, and we won't have "ambiguous" overloads where two methods could be applied (e.g. foo(List) and foo(ArrayList)). The above rules don't apply if we don't make these assumptions.

#### Example

- https://drive.google.com/file/d/1t65JX1RtaEoSyU05hi0b9i7aPMmqLrDV/view

#### A List of Lists

- Two main types:
- Linked List:

#### "Naked" Linked List

- Consists of a value, and a pointer to the next element

#### Deprecated; almost never used in Java


#### Singly Linked List

- Stores a naked Linked List in an internal Node class, then "clothes" the List in the List interface
- Only lets you move forward in the list, so less useful than DLL
- Adds a sentinel so you don't need to worry about "empty list" edge case

#### Doubly Linked List

- Same as SLL, except each element stores a previous as well

#### A List of Lists

- Two main types:
- Linked List:

#### Singly Linked List


#### Doubly Linked List

- Array List:

#### Default array

- Natively supported by Java (not a class)
- Need to specify the length before using, and can't change that length
- Not a List (because it can't grow indefinitely)

#### ArrayList

- List type that uses an array in the backend
- Requires resizing periodically in order to account for the List interface
- On average, constant time access (instead of linear time access in Linked List)
- Example (+ How to approach Skeleton Code)
- https://drive.google.com/file/d/14-IEeTJsYHvK6Ogyro4xcDT8KH_KbB9A/view

#### Public vs Private

- General Java philosophy: The more things you're allowed to do, the more complex your code will become. To reduce code complexity and add flexibility, consciously restrict what you're allowed to do as much as possible.
- Ex. The List interface describes a set of things that all lists can do, but you still need a class (ex. ArrayList) to actually make a list. You can do ArrayList<Integer> a = new ArrayList<>();
- But if you're only going to use List interface operations, it's better to do

#### List<Integer> a = new ArrayList<>();

- This way, you can safely change to another List type just by changing one line, and you force yourself to never use ArrayList-specific operations.

#### Public vs Private

- Access modifiers prevent other classes from "seeing" certain methods/attributes
- public: Every outside class can see and change a public variable
- Once you build on top of a class, other code may rely on it, so anything public cannot change any more, even if you want to rewrite your implementation.
- private: Nothing outside the current class can see the variable
- Since nothing outside relies on this, you can safely change a private method/attribute to optimize your code.
- Two other access levels: protected (allows subclasses and classes defined in the same folder to use the variable), and package-private (allows classes defined in the same folder to use the variable; this is the access you get if you don't specify any modifier)

#### Public vs Private

- Access modifiers prevent other classes from "seeing" certain methods/attributes
- Nested classes are slightly different: An inner class can ALWAYS access something in the outer class, and vice versa, regardless of access modifier.
- So access modifiers only affect how classes in other files see your class
- Ideal code restricts access as much as possible. If you can make a method or attribute private, make it private.


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Asymptotic Analysis I: Algorithm Efficiency Measurement and Big O Ladder](/en/notes/cs61b/lecture-12) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Union search I: Dynamic connectivity and tree structure evolution →](/en/notes/cs61b/lecture-14) | [🎬Watch this lecture on Bilibili (P13)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13) |
