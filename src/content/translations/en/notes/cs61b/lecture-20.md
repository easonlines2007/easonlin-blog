---
kind: notes
source: cs61b/lecture-20
title: "Lecture 20 · Hashing II: Load Factors, Resizing, Mutable Keys, and Java
  HashMap"
description: "CS61B Lecture 20: Hashing II: Load Factor, Dynamic Scaling, and
  the Java HashMap Kernel: Load Factor Lambda, Amortized O(1) Mathematical
  Proof, Variable Key Traps, and Industrial-Grade Red-Black Tree Optimization"
sourceHash: f63c4517472d7043d2715d1b57461ed55372d3a8dff31c14c81a317ceb7d6968
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 4: Tree Structure and Hash Table (Search Trees & Hashing)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 51:44 ｜ **Official original version**: Lecture 20 - Hashing 2  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1EGP_BWIbha4xQ4A5PJLAVIQaK6G0RbWZfrVDd0GmS08) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii)  
> **Quick navigation**: [← Previous lecture (P19 Hashing I: Hash table principle, hash function and collision resolution)](/en/notes/cs61b/lecture-19) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P21 Priority Queue and Binary Heap) →](/en/notes/cs61b/lecture-21)

---

## 1. Hash table performance analysis: Load Factor  $\lambda$) the core meaning of

*(Reference time: 00:01:25 · [Video jump (P20 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=85))*

In a zipper hash table, the time required for the operation depends on the average length of the linked list.

We define the most important operating indicator of the hash table——**Load Factor  $\lambda$)**: 
$$\lambda = \frac{N}{M}$$
 Among them:
- $N$  Is the total number of key-value pairs stored in the current hash table;
- $M$  Is the physical length of the underlying bucket array (Bucket Count).

### The physical meaning of load factor
$\lambda$  represent **The average number of linked list nodes mounted in each hash bucket**.
- If the hash function is distributed evenly enough, the average time taken for a single lookup or insertion is: 
  $$\text{Time} = \Theta(1 + \lambda) = \Theta(1 + \frac{N}{M})$$
- If the bucket array size is fixed to  $M = 10$, and we deposited  $N = 10,000,000$  data, $\lambda$  Up to one million, the hash table will completely degrade into a time-consuming  $\Theta(N)$  Very long singly linked list!

## 2. Dynamically adjust capacity: Resize expansion and secondary hashing (Rehashing) of hash table

*(Reference time: 00:10:40 · [Video jump (P20 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=640))*

in order to ensure  $\Theta(1)$  of instantaneous performance, we must **will load factor  $\lambda$  Strictly locked below a very small constant upper limit** (Java’s official default threshold is  $\lambda_{\max} = 0.75$): 

> **The iron law of dynamic expansion**:   
> Found when a new element is inserted  $\frac{N}{M} > 0.75$  When , the capacity of the underlying bucket array is immediately **Double ($M_{\text{new}} = 2M$)**!

### Why is rehashing necessary when expanding capacity?
Beginners often mistakenly think that they only need to use  `System.arraycopy`  Copy the old linked list.  
**This is a fatal mistake!**
- Because the formula for calculating the bucket subscript is  `Math.floorMod(code, M)`; 
- when  $M$  When going from 4 to 8, the result of the hash code for the same object modulo 8 is completely different from the result modulo 4!
- Each node in the old table must be removed one by one and its new capacity must be recalculated.  $2M$  Subscript the new bucket and mount it into the new bucket.

## 3. Amortized constant time  $\Theta(1)$  mathematical proof of

*(Reference time: 00:19:15 · [Video jump (P20 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=1155))*

Similar to the geometric expansion of AList, the workload of doubling the capacity of a hash table also follows a geometric sequence:
- Although an occasional expansion will cost  $\Theta(N)$  Traverse the entire table and remount;
- But subsequent consecutive insertions are in very short linked lists (average length  $< 0.75$);
- **total average cost**: 
  $$\text{Amortized Cost per Operation} = \frac{\Theta(N) + \Theta(N)}{N} = \Theta(1)$$
 The hash table truly achieves the dreamed of in an evenly distributed sense.  **$\Theta(1)$  Find and insert**!

## 4. Classic industrial trap: the disaster of using mutable objects (Mutable Objects) as Key

*(Reference time: 00:27:00 · [Video jump (P20 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=1620))*

This is one of the most tragic sources of invisible bugs in the entire Java industry: **Never use mutable objects as HashMap keys or HashSet elements!**

### The thrilling tragedy of evaporation
```java
List<String> keyList = new ArrayList<>();
keyList.add("Berkeley");

Map<List<String>, Integer> map = new HashMap<>();
map.put(keyList, 100);

System.out.println(map.containsKey(keyList)); // 输出 true，完美找到

// 致命突变：在外部修改了该 List 的内部状态！
keyList.add("Cal");

// 诡异事件发生：同一个对象，竟然找不到了！
System.out.println(map.containsKey(keyList)); // 输出 false！数据人间蒸发！
```

### Why does data disappear?
1. when we  `put`  At that time, the JVM is based on the current  `keyList`  The content (which only contains "Berkeley") calculates the hash code (let's say 105) and puts it into bucket 105;
2. Then the external  `keyList` "Cal" is appended to , and its content changes, causing its  `hashCode()`  Recalculated to 999;
3. when executing  `map.containsKey(keyList)`  At this time, HashMap goes straight to bucket No. 999 based on the new hash code 999, and finds that it is empty, directly concluding that the key does not exist!
4. The originally stored key-value pairs are still lying quietly in bucket No. 105, becoming a "ghost zombie memory" that the system can never retrieve or delete through conventional means!

> **golden rule**: Object used as Key in HashMap, **All fields participating in hash calculation must be guaranteed to be absolutely immutable during the life cycle (Immutable)**! The ideal Key is  `String`  or  `Integer`.

## 5. Industrial-level in-depth analysis: Java 8 HashMap tree optimization (Treeification)

*(Reference time: 00:35:30 · [Video jump (P20 00:35:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2130))*

In Java 7 and before, each bucket of HashMap is purely composed of a one-way linked list. If a large number of keys are deliberately clustered in the same bucket when encountering a malicious forged hash collision attack (Hash Collision DoS), query performance will decrease.  $O(1)$  Instantly plummeted to  $O(N)$.

Java 8 has made major epoch-making industrial optimizations:
- **Treeify Threshold (Treeify Threshold = 8)**: When the length of the linked list in a single hash bucket exceeds 8, the JVM will automatically store the one-way linked list in place. **Convert to a self-balancing red-black tree (Red-Black Tree)**!
- This mechanism ensures that even if the worst hash collision occurs, the search performance within a single bucket will not exceed  **$O(\log N)$**, completely sealing the DoS attack vulnerability.

## 6. Summary of this lecture and post-class self-assessment

*(Reference time: 00:43:00 · [Video jump (P20 00:43:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2580))*

### Comprehensive self-test questions after class
`java.util.TreeMap`  with  `java.util.HashMap`  How to choose?  
**Comparative decision making**:   
- If you need the data to naturally maintain size sorting, you need to query by range (such as finding all items greater than 50), or the key of the object cannot calculate an excellent hash code: choose a red-black tree-based  **`TreeMap`** (stable  $O(\log N)$);   
- If you only need a single point of precise search and extremely fast reading and writing: choose  **`HashMap`** (Split equally  $O(1)$).

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 20. Hashing II

By Mihir Mirchandani and William Lee

---

## 20.1 Hash Table Recap, Default Hash Function

"The whole point is that we have a bunch of lists that are all short." - Professor Hug.

Hash Table Recap, Default Hash Function



Let's continue understanding Hashing. We've now seen implementations for sets and maps.

1. Red-Black Based Tree Approach: TreeSet/TreeMap

   • requires the items to be comparable (the notion of less or greater than)

   • logarithmic time complexity

2. HashTable based approach: HashSet/HashMap

   • constant time operations if the hashCode spreads the item nicely (few collisions)

Recall that with a hash table, the idea is that for any piece of data, like a String (or any other type of object) we want to store in our hash table, we need to turn this into a number called a hash code. So a string like "Mihir" can be converted to -2101281024. 

**Additional information**

Fun Fact: And that integer is anything between about negative two billion and about two billion, the space of all Java Integers. This range yields about 4 billion integers or 2^32 integers. If you are interested in why this is the case, please take CS 61C!



Once we have our number, we want to convert this number to our bucket number (i.e. which of the many linked lists I want to add this new entry to). In the first example, we will use the`Math.floorMod(x, 4)`, since the length of the underlying buckets array has length 4.

If we take the converted hash code for "Mihir", -2101281024, and then mod this by 4, we get 0. This reduces our hash code, -2101281024 to a valid index, 0. This means that we would use the 0th bucket to place our data, "Mihir", in our LinkedList at the 0th bucket.

> You can essentially think of Java HashTables as just an array of LinkedLists categorized under bucket labels and hopefully have better performance by utilizing these LinkedLists. 

But how many LinkedLists/Buckets should we use? This is an important question, because as we insert more and more items into our buckets, the length of the LinkedLists will inevitably grow, which in turn compromises the runtime for the hash table's operations. 

For example, let's say we inserted strings like "Mihir", "Mirchandani", "loves", and "61B", all of which yielded hash codes that were divisible by 4. In this case, all strings would be put into the 0th index bucket and all strings would be inserted into the same LinkedList. What happens to the runtime for a search operation? Well, we would have to search through an entire LinkedList to look up our data! This runs in linear time and is too slow for HashMap's famous title of holding fast lookup times.

Last time, we saw that we can have a variable number of LinkedLists. The idea is that we resize that array of linked lists whenever the load factor (N/M, where N is the number of elements in our table and M is the number of buckets) exceeds some constant. Java picks 0.75 as we'll see later. This prevents collisions from happening too frequently. So long as our items are spread out nicely, between the buckets, the LinkedLists at each bucket for the most part have a very small size, which means we'll on average get constant run time! 

Example: If the HashTable has load factor 3, and our `hashCode()` function spreads out the entries evenly, we are going to end up with just 3 items per bucket, and our search operation takes $$\Theta(1)$$time. 

#### Comparing Data Structure Run Times! 

|                                               | contains(x) | add(x)   |

| --------------------------------------------- | ----------- | -------- |

| Bushy BSTs                                    | Θ(log N)    | Θ(log N) |

| Separate Chaining Hash Table with NO resizing | Θ(N)        | Θ(N)     |

| Separate Chaining Hash Table with resizing    | Θ(1)        | Θ(1)     |

---

## 20.2 Distribution By Other Hash Functions

HashMaps/Tables have fast lookup times, but behind that "superpower" is a hash function.

Distribution by other Hash Functions



Suppose our `hashCode()` implementation simply returns 0.

```

@Override

public int hashCode() {

    return 0;

}

```

<details>

<summary>What distribution do we expect?</summary>

We would expect all of the items in our Hash Table to be in bucket 0. As we discussed in the [previous section](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.1-hash-table-recap-default-hash-function), our Hash Table would place all elements in the 0th bucket because the hashCode tells it to. In the 0th bucket, there will be a LinkedList of all elements from the data yielding a very inefficient linear lookup time compared to the constant time we are expecting. No matter what key we provide, our hashCode always tells the HashMap to only add to the 0th bucket which is why we get this long LinkedList. So what do we do to make sure we get constant lookup time? We use a better hash function!

</details>

In order to get a more even distribution, what we can do is something to what we tried in the [previous section](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.1-hash-table-recap-default-hash-function) where we utilize modulo. Let's say that we define the size of our Hash Table to have 4 buckets. This means it has 4 corresponding LinkedLists and 4 bucket indices labeled {0, 1, 2, 3}. The modding is not required in our `hashCode()` function as it is being done for us in the hash table to guarantee we can add to that bucket. As we said the hash code could really be any integer in the range of 4 billion unique values!

By using modulo, we ensure that our hashcode yields a number that can be represented as an index and clearly identifies which LinkedList to add to. Additionally, when adding a series of numbers at once, we see that we get an even distribution of numbers in our LinkedList yielding a constant lookup time.

```

@Override

public int hashCode() {

    return num;

}

```

This hash function should yield a much more even distribution! Objects with different `num` will now be more spread out across the buckets instead of all living in the 0th bucket. If our class does not explicitly override the `hashCode()` function, Java will use the default implementation, which returns the object's address in memory as its hash code!

### Why Bother With Custom Hash Functions?

Let's discuss if the default hashCode function is a good hashCode function! It actually is a good spread as it relies on the fact that different objects will live in different places in the memory, and the memory address is effectively random. We will get a good distribution, since objects are basically assigned random indices to insert into the hash table.

This really raises an interesting question: why do we care about other custom hash functions when the default hashcode gets good spread? We'll read about this in the [next section.](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii/20.3-contains-and-duplicate-items) 

---

## 20.3 Contains & Duplicate Items

### Contains

#### The `equals()` Method for a ColoredNumber Object

Suppose the `equals()` method for ColoredNumber is as below, i.e. two ColoredNumbers are equal if they have the same num.

```java

@Override

public boolean equals(Object o) {

   if (o instanceof ColoredNumber otherCn) {

       return this.num == otherCn.num;

   }

   return false;

}

```

#### HashSet Behavior for Checking `contains()`

Suppose the `equals()` method for ColoredNumber is on the previous slide, i.e. two ColoredNumbers are equal if they have the same num. 

```java

int N = 20;

HashSet<ColoredNumber> hs = new HashSet<>();

for (int i = 0; i < N; i += 1) {

    hs.add(new ColoredNumber(i));

}

```

Suppose we now check whether 12 is in the hash table.

```java

ColoredNumber twelve = new ColoredNumber(12);

hs.contains(twelve); //returns true

```

**Additional information**

What do we **expect** to be returned by `contains`?



<details>

<summary>Answer</summary>

We expect the `contains` call to be true, all `12`s are created equal!

</details>

#### Finding an Item Using the Default Hashcode

Suppose we are using the default hash function (uses memory address):

```java

int N = 20;

HashSet<ColoredNumber> hs = new HashSet<>();

for (int i = 0; i < N; i += 1) {

   hs.add(new ColoredNumber(i));

}

ColoredNumber twelve = new ColoredNumber(12);

hs.contains(twelve); // returns ??

```

which yields the table below:

![](https://lh4.googleusercontent.com/cFvLVhOYg31lSg1a8moftrr30qpThw3Bc7drJWVLNrSTCgTdO4yxjis1epmRlRMLWIkh73alL6OrblQxqGGrjMo1XMoOfPjSFH3tPDDbaxSbLXe1-HXJcfQOglsU4Dp74PiDDqMWXNOmYeQu_D7-l_B2SBcdTVohYMYLZdnzzMVn8_hAbvSKDAKyC-_ev3nN=s2048)

Suppose equals returns true if two ColoredNumbers have the same num (as we've defined previously).

**Additional information**

What is actually returned by `contains`?



<details>

<summary>Answer</summary>

Returns false with probability 5/6ths.

Default `hashCode()` is based on memory address. equals is based on `num`.

There are two ColoredNumber objects with `num = 12`. One of them is in the HashSet and one of them was created by the code above.

Each memory address is random, with only a 1/6th chance they modulo to the same bucket.

Example: If the `ColoredNumber` object `twelve` created by the code above is in memory location 6000000, its hashCode % 6 is 0. HashSet looks in bucket zero, and doesn't find 12.

</details>

**Additional information**

Hard Question: If the default hash code achieves a good spread, why do we even bother to create custom hash functions? 



<details>

<summary>Answer</summary>

It is necessary to have consistency between `equals()` and `hashCode()` for the hash table's operations to function.

</details>

**Basic rule (also definition of deterministic property of a valid hashcode):** If two objects are equal, they **must** have the same hash code so the hash table can find it.

### Duplicate Values

#### Overriding `equals()` but Not `hashCode()`

Suppose we have the same `equals()` method (comparing `num`), but we do not override `hashCode()`.

```java

public boolean equals(Object o) {

   ...  return this.num == otherCn.num; ...

}

```

The result of adding 0 through 19 is shown below:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F4fu6DoHEV2cHF676lazQ%2Fimage.png?alt=media\&token=b0930dfa-44c0-4f39-8628-219ad789f1ee)

```java

ColoredNumber zero = new ColoredNumber(0);

hs.add(zero); // does another zero appear?

```

**Additional information**

Which can happen when we call add(zero)?

Answer Choices:

1. We get a 0 to bin zero.

2. We add another 0 to bin one.

3. We add a 0 to some other bin.

4. We do not get a duplicate zero

   

<details>

<summary>Answer </summary>

3 Choices are Correct: 

\#1, #3, #4.

We get a 0 to bin zero, We add a 0 to some other bin, and we do not get a duplicate zero.

The new zero ends up in a random bin.

* 5/6ths chance: In bin 0, 2, 3, 4, or 5. Duplicate!

* 1/6 chance: In bin 1, no duplicate! (`equals()` blocks it)

</details>

### Key Takeaway: `equals()` and `hashCode()`

Bottom line: If your class override equals, you should also override hashCode in a consistent manner.

* If two objects are equal, they must always have the same hash code.<br>

If you don’t, everything breaks:

* `Contains` can’t find objects (unless it gets lucky).

* `Add` results in duplicates.

---

## 20.4 Mutable vs. Immutable Types

### Immutable Data Types

An immutable data type is one for which an instance cannot change in any observable way after instantiation.

Examples:

* Mutable: ArrayDeque, Percolation.

* Immutable: Integer, String, Date.

```java

public class Date {

   public final int month;

   public final int day;

   public final int year;

   private boolean contrived = true;

   public Date(int m, int d, int y) {

       month = m; day = d; year = y;

   }

}

```

The `final` keyword will help the compiler ensure immutability.

* `final` variable means you may assign a value once (either in the constructor of the class or in the initializer), but after it can never change.

* `final` is neither sufficient nor necessary for a class to be immutable.

#### Advantages vs. Disadvantages of Immutability:

Advantage: Less to think about; avoids bugs and makes debugging easier.

* Analogy: Immutable classes have some buttons you can press / windows you can look inside. Results are ALWAYS the same, no matter what.

Disadvantage: Must create a new object anytime anything changes.

* Example: String concatenation is slow!

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FxntDEehjkP4E4EE6wmqz%2Fimage.png?alt=media&amp;token=690427cc-9f86-478f-81fa-323eac3d2268" alt=""><figcaption></figcaption></figure>

### Mutable Types

#### **Mutable HashSet Keys**

In principle, we can create a HashSet\<List>.

Weird stuff happens if:

* We insert a List into a HashSet.

* We later mutate that List.

**Key Point**: Never mutate (modify) an object being used as a key. Incorrect results arise, and the item gets lost. [The slides for the Hashing II Lecture ](https://docs.google.com/presentation/d/1U_-RQCJB3j9B-k-kY8I4nS-FuxIvO8EgVIrOthx2InU/edit#slide=id.g2165b69ef3f_0_291)provide a very thorough visual example of this point.

#### Actual Implementation of HashSet/Map in Java

In this last section, Professor Hug gives a quick walkthrough of the code for HashSets and HashMaps in Java's official implementation.


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Hashing I: Principles of hash tables, hash functions and collision resolution](/en/notes/cs61b/lecture-19) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Priority queue and binary heap →](/en/notes/cs61b/lecture-21) | [🎬Watch this lecture on Bilibili (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) |
