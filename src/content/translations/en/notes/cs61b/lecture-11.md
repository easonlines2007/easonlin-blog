---
kind: notes
source: cs61b/lecture-11
title: "Lecture 11 · Inheritance IV: Iterators and the Methods of Object"
description: "CS61B Lecture 11: Inheritance IV: Iterator and Object basic
  methods: Iterable and Iterator architecture, for-each compilation and
  desugaring, toString, equals and hashCode"
sourceHash: 59e01635a0988a3598709f4bd6d29ad19f2f2a24031c582a7c990792325e17b6
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 2: Inheritance, Interfaces & Subtyping  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 59:15 ｜ **Official original version**: Lecture 11 - Inheritance IV Iterators Object Methods  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P11)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1bahvjVtbMcc2kuyzYQfQtD8EJyIiIkWnSALVSMuyQhI) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/12.-exceptions-iterators-object-methods)  
> **Quick navigation**: [← Previous lecture (P10 Inheritance III: Subtype polymorphism, Comparable and Comparator)](/en/notes/cs61b/lecture-10) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P12 Asymptotic Analysis I: Algorithm Efficiency Measurement and Big O Ladder) →](/en/notes/cs61b/lecture-12)

---

## 1. General philosophy of container traversal: from index loop to iterator abstraction

*(Reference time: 00:01:20 · [Video jump (P11 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=80))*

We often need to traverse every element in a container. For array-based containers, using a traditional subscript loop is very efficient:
```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

### Why is subscript loop not a universal solution?
1. **Extremely low performance for linked lists**: In a one-way linked list or a doubly linked list, `get(i)`  Must be traversed from the beginning  $i$  step. Use the above subscript to loop through a length of  $N$  linked list, the total time overhead is terrifying  $\Theta(N^2)$!
2. **Completely invalid for unordered collections**: for a collection (`Set`), hash table (`Map`) or tree structure (`Tree`), conceptually there is no “th  $i$  elements" integer subscript!

Object-oriented design pattern proposes the famous **Iterator Pattern**: Provides a unified method for sequential access to individual elements in an aggregate object without exposing the object's internal underlying topological representation.

## 2. Iterator interface Gemini: `Iterator<T>` vs `Iterable<T>`

*(Reference time: 00:09:45 · [Video jump (P11 00:09:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=585))*

Java defines the iterator system through two core interfaces with very similar names but completely different responsibilities:

### Role 1: Cursor Referee  `java.util.Iterator<T>`
Responsible for maintaining specific cursor traversal status:
```java
public interface Iterator<T> {
    /** 是否还有下一个可用元素？ */
    boolean hasNext();

    /** 步进游标，并返回下一个元素 */
    T next();
}
```

### Role 2: Iterable container  `java.lang.Iterable<T>`
It means "my data structure can support being traversed":
```java
public interface Iterable<T> {
    /** 产生并返回一个专属于本容器的全新游标迭代器 */
    Iterator<T> iterator();
}
```

> **metaphor**: `Iterable`  Like a novel (with the property of being read), and  `Iterator`  It's like a bookmark cursor (recording which page you are currently reading and providing the ability to turn to the next page). You can add multiple different bookmarks to a novel at the same time and read them independently!

## 3. Syntactic sugar decryption: Java  `for-each`  Enhance the low-level compilation and desugarization of loops

*(Reference time: 00:17:30 · [Video jump (P11 00:17:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1050))*

In daily development, we like to write refreshing ones the most  `for-each`  Boost loop:
```java
for (String word : wordsList) {
    System.out.println(word);
}
```

### The magic truth about compilers (Desugaring)
As long as any class implements  `java.lang.Iterable<T>`  Interface, Java compiler  `javac`  will be in the compilation phase, **Change the above  `for-each`  Syntactic sugar is automatically and accurately desugared into the underlying while iterator calling code**: 

```java
Iterator<String> seer = wordsList.iterator();
while (seer.hasNext()) {
    String word = seer.next();
    System.out.println(word);
}
```
This is why if a class does not implement  `Iterable`  Interface, force its use  `for-each`  A compilation error will be reported: `foreach not applicable to type`!

## 4. Complete practical implementation of iterator of custom data structure (taking ArraySet as an example)

*(Reference time: 00:25:00 · [Video jump (P11 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1500))*

Let us follow the courseware and create a simple dynamic collection  `ArraySet<T>`  Implement complete iterator support yourself:

```java
import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {
    private T[] items;
    private int size;

    public ArraySet() {
        items = (T[]) new Object[100];
        size = 0;
    }

    public void add(T x) {
        if (x == null || contains(x)) return;
        items[size++] = x;
    }

    public boolean contains(T x) {
        for (int i = 0; i < size; i++) {
            if (items[i].equals(x)) return true;
        }
        return false;
    }

    /** 1. 实现 Iterable 接口要求的方法 */
    @Override
    public Iterator<T> iterator() {
        return new ArraySetIterator();
    }

    /** 2. 定义内部专用嵌套迭代器类 */
    private class ArraySetIterator implements Iterator<T> {
        private int wizardIndex; // 记录当前游标扫描位置

        public ArraySetIterator() {
            wizardIndex = 0;
        }

        @Override
        public boolean hasNext() {
            return wizardIndex < size;
        }

        @Override
        public T next() {
            T returnItem = items[wizardIndex];
            wizardIndex += 1;
            return returnItem;
        }
    }
}
```
At this time, `ArraySet`  Perfect support for native  `for (T item : set)`  Traverse the grammar!

## 5. Cornerstone method one of objects: `toString()`  Elegant implementation with  `StringBuilder`  Performance optimization

*(Reference time: 00:33:10 · [Video jump (P11 00:33:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=1990))*

In the object-oriented world of Java, all classes implicitly inherit from the ultimate ancestor class  `java.lang.Object`.  
`Object`  default  `toString()`  The implementation is extremely crude: return the class name plus a hexadecimal hash code (such as  `ArraySet@15db9742`).

We want it to be formatted and printed as crisp Python-style text: `{1, 2, 3}`.

### Fatal Trap: Using string concatenation directly in a loop  `+`
```java
// 极其低效的写法！
String result = "{";
for (T item : this) {
    result += item.toString() + ", ";
}
```
In Java, `String`  Yes **Immutable objects (Immutable)**! each execution  `result += ...`, the JVM must reallocate a new, larger string in the heap and copy all the old contents! in length  $N$  In the loop, string concatenation will produce  $O(N^2)$  The memory allocation overhead seriously brings down the system.

### Industrial grade standard implementation: `StringBuilder`
```java
@Override
public String toString() {
    StringBuilder returnSB = new StringBuilder("{");
    for (int i = 0; i < size - 1; i++) {
        returnSB.append(items[i].toString());
        returnSB.append(", ");
    }
    if (size > 0) {
        returnSB.append(items[size - 1].toString());
    }
    returnSB.append("}");
    return returnSB.toString(); // 极致的线性 O(N) 性能！
}
```

## 6. The cornerstone method 2 of the object: `equals(Object o)`  Five mathematical contracts and industrial-grade templates

*(Reference time: 00:41:20 · [Video jump (P11 00:41:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=2480))*

Determine whether the contents of two containers are equal and must be rewritten  `equals`  method.

### Java official regulations  `equals`  Five Equivalent Axioms of Mathematics
1. **Reflexive**: for any non-null reference  `x`, `x.equals(x)`  Must be  `true`; 
2. **Symmetric**: for any non-null reference  `x`  and  `y`, if and only if  `y.equals(x)`  for  `true`  when, `x.equals(y)`  Only for  `true`; 
3. **Transitive**:If  `x.equals(y)`  is true and  `y.equals(z)`  is true, then  `x.equals(z)`  must be true;
4. **Consistent**: As long as the internal comparison state of the object does not change, the results of multiple calls must be strictly constant;
5. **Non-nullity**: for any non-null reference  `x`, `x.equals(null)`  must always be  `false`.

### Industrial-Grade Waterproof Standard Five-Step Rewrite Template
```java
@Override
public boolean equals(Object o) {
    // 步骤 1：同一性检查（性能极速短路）
    if (this == o) {
        return true;
    }
    // 步骤 2：非空与类型防御（排除了 null 以及类型不兼容的对象）
    if (o == null || this.getClass() != o.getClass()) {
        return false;
    }
    // 步骤 3：强制类型转换
    ArraySet<T> other = (ArraySet<T>) o;
    // 步骤 4：前置简单状态比对
    if (this.size != other.size) {
        return false;
    }
    // 步骤 5：逐项内容等价性深层比对
    for (T item : this) {
        if (!other.contains(item)) {
            return false;
        }
    }
    return true;
}
```

## 7. Cornerstone method three of objects: `hashCode()`  Iron Law and Hash Table Survival Rules

*(Reference time: 00:49:00 · [Video jump (P11 00:49:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=2940))*

rewriting  `equals`  method, there is a hidden clause in the Java language specification **supreme mandatory contract**: 

> **`hashCode`  golden rule**:   
> **If two objects pass  `equals`  The comparison result is  `true`, then the two objects  `hashCode()`  The returned integer hash value must be absolutely identical!**

### Why can’t this iron law be violated?
Java's hash collection (`HashSet`) and hash map (`HashMap`) when storing and searching objects, will **First calculate the object's  `hashCode()`  To decide which hash bucket to put it into**.

if you rewrite  `equals`  but not rewritten  `hashCode`: 
- Two objects with exactly equal contents will generate two completely random hash codes for the old memory address;
- They will be stored in different hash buckets;
- when you call  `set.contains(target)`  When , the hash table is based on  `target`  If the hash code is searched in the wrong bucket, even if the object is clearly in the collection, it will be reported that it does not exist! Directly destroying the correctness of all hash data structures.

```java
import java.util.Objects;

@Override
public int hashCode() {
    // 使用 Java 标准库实用工具类自动组合计算字段哈希
    return Objects.hash(size, java.util.Arrays.hashCode(items));
}
```

## 8. Panoramic summary of this lecture and advanced self-test questions

*(Reference time: 00:54:30 · [Video jump (P11 00:54:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11&t=3270))*

### Comprehensive self-test questions after class

#### Question 1 (Analysis of equals signature trap)
A classmate wrote the following equals method in the class:
```java
public class Point {
    public int x, y;
    public boolean equals(Point p) { // 注意形参类型是 Point
        return this.x == p.x && this.y == p.y;
    }
}
```
When comparing two logically equal  `Point`  object put  `ArrayList<Point>`  and call  `list.contains(p)`  when, why do we get  `false`?  
**Answers and analysis**:   
- **Fatal overloading instead of overriding**!`ArrayList.contains`  The internal call is  `Object.equals(Object o)`;   
- The classmate’s method parameters are  `Point`, causing him to not rewrite  `Object`  of  `equals(Object)`, but defines an overloaded method;  
- `ArrayList`  Inherited from  `Object`  The default compares the physical address of  `equals`, causing the determination of equal contents to fail! must be strictly declared as  `public boolean equals(Object o)`  and add  `@Override`.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 12. Inheritance IV: Iterators, Object Methods

This section covers Lists and Sets, how to throw informative exceptions, iterations, and object methods. Its contents correspond to Lecture 11.

---

## 12.1 Lists and Sets in Java

In this section, we will learn about how to use Java's built-in `List` and `Set` data structures as well as build our own `ArraySet`.

#### Getting Started

In this course, we've already built two kinds of lists: `AList` and `SLList`. We also built an interface `List61B` to enforce specific list methods `AList` and `SLList` had to implement. You can find the code at the following links:

* [`List61B`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec9_inheritance2/List61B.java)

* [`AList`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec8_inheritance1/AList.java)

* [`SLList`](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec9_inheritance2/SLList.java)

This is how we might use `List61B` type:

```java

List61B<Integer> L = new AList<>();

L.addLast(5);

L.addLast(10);

L.addLast(15);

L.print();

```

#### Lists in Real Java Code

We built a list from scratch, but Java provides a built-in `List` interface and several implementations, e.g. `ArrayList`. Remember, since `List` is an interface we can't instantiate it! We must instantiate one of its implementations.

To access this, we can use the full name ('canonical name') of classes/interfaces:

```java

java.util.List<Integer> L = new java.util.ArrayList<>();

```

However, this is a bit verbose. Instead, we can import java libraries:

```java

import java.util.List;

import java.util.ArrayList;

public class Example {

    public static void main(String[] args) {

        List<Integer> L = new ArrayList<>();

        L.add(5);

        L.add(10);

        System.out.println(L);

    }

}

```

#### Sets

Sets are a collection of unique elements - you can only have one copy of each element. Unlike Lists, there is also no sense of order: you can't index into a set, nor can you control where each element is inserted into the set.

##### Java Sets

Java has the `Set` interface along with implementations, e.g. `HashSet`. Remember to import them if you don't want to use the full name!

```java

import java.util.Set;

import java.util.HashSet;

```

Example use:

```java

Set<String> s = new HashSet<>();

s.add("Tokyo");

s.add("Lagos");

System.out.println(s.contains("Tokyo")); // true

```

##### Python Equivalent

In python, we simply call `set()`. To check for `contains` we don't use a method but the keyword `in`. Here's an example:

```python

s = set()

s.add("Tokyo")

s.add("Lagos")

print("Tokyo" in s) // True

```

#### DIY: ArraySet

Our goal is to make our own set, `ArraySet`, with the following methods:

* `add(value)`: add the value to the set if not already present

* `contains(value)`: check to see if ArraySet contains the key

* `size()`: return number of values

If you would like to try it yourself, find 'Do It Yourself' `ArraySet starter code` [here](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/DIY/ArraySet.java). In the lecture clip below, Professor Hug goes develops the solution:

---

## 12.2 Exceptions

In this section, we will learn how to throw exceptions to effectively handle errors that may arise in our code.

Our `ArraySet` implementation from the previous section has a small error. When we add `null` to our ArraySet, we get a NullPointerException.

The probelm lies in the `contains` method where we check `items[i].equals(x)`. If the value at `items[i]` is null, then we are calling `null.equals(x)` -> NullPointerException.

Exceptions cause normal flow of control to stop. We can in fact choose to throw our own exceptions. In python you may have seen this with the `raise` keyword. In Java, Exceptions are objects and we throw exceptions using the following format:

`throw new ExceptionObject(parameter1, ...)`

\

Let's throw an exception when a user tries to add null to our `ArraySet`. We'll throw an `IllegalArgumentException` which takes in one parameter (a `String` message).

Our updated `add` method:

```java

/* Associates the specified value with the specified key in this map.

   Throws an IllegalArgumentException if the key is null. */

public void add(T x) {

    if (x == null) {

        throw new IllegalArgumentException("can't add null");

    }

    if (contains(x)) {

        return;

    }

    items[size] = x;

    size += 1;

}

```

We get an Exception either way - why does this better?

1. We have control of our code: we consciously decide at what point to stop the flow of our program

2. More useful Exception type and helpful error message for those using our code

However, it would be better if the program doesn't crash at all. There are different things we could do in this case. Here are some below:

**Approach 1**: Don't add `null` to the array if it is passed into `add` 

**Approach 2**: Change the `contains` method to account for the case if `items[i] == null`.

Whatever you decide, it is important that users know what to expect. That is why documentation (such as comments about your methods) is very important.<br>

---

## 12.3 Iteration

We can use a clean enhanced for loop with Java's `HashSet`

```java

Set<String> s = new HashSet<>();

s.add("Tokyo");

s.add("Lagos");

for (String city : s) {

    System.out.println(city);

}

```

However, if we try to do the same with our `ArraySet`, we get an error. How can we enable this functionality?

### Enhanced For Loop 

Let's first understand what is happening when we use an enhanced for loop. We can "translate" an enhanced for loop into an ugly, manual approach.

```java

Set<String> s = new HashSet<>();

...

for (String city : s) {

    ...

}

```

The above code translates to:

```java

Set<String> s = new HashSet<>();

...

Iterator<String> seer = s.iterator();

while (seer.hasNext()) {

    String city = seer.next();

    ...

}

```

Let’s strip away the magic so we can build our own classes that support this.

The key here is an object called an *iterator*.

For our example, in List.java we might define an `iterator()` method that returns an iterator object.

```java

public Iterator<E> iterator();

```

Now, we can use that object to loop through all the entries in our list:

```java

List<Integer> friends = new ArrayList<Integer>();

...

Iterator<Integer> seer = friends.iterator();

while (seer.hasNext()) {

System.out.println(seer.next());

}

```

This code behaves identically to the foreach loop version above.

There are three key methods in our iterator approach:

First, we get a new iterator object with `Iterator<Integer> seer = friends.iterator();`

Next, we loop through the list with our while loop. We check that there are still items left with `seer.hasNext()`, which will return true if there are unseen items remaining, and false if all items have been processed.

Last, `seer.next()` does two things at once. It returns the next element of the list, and here we print it out. It also advances the iterator by one item. In this way, the iterator will only inspect each item once. 

### Implementing Iterators 

In this section, we are going to talk about how to build a class to support iteration.

Let's start by thinking about what the compiler needs to know in order to successfully compile the following iterator example:

```java

List<Integer> friends = new ArrayList<Integer>();

Iterator<Integer> seer = friends.iterator();

while(seer.hasNext()) {

    System.out.println(seer.next());

}

```

We can look at the static types of each object that calls a relevant method. `friends` is a List, on which `iterator()` is called, so we must ask:

* Does the List interface have an iterator() method?

`seer` is an Iterator, on which `hasNext()` and `next()` are called, so we must ask:

* Does the Iterator interface have next/hasNext() methods?

So how do we implement these requirements?

The List interface extends the Iterable interface, inheriting the abstract iterator() method. (Actually, List extends Collection which extends Iterable, but it's easier to codethink of this way to start.)

```java

public interface Iterable<T> {

    Iterator<T> iterator();

}

```

```java

public interface List<T> extends Iterable<T>{

    ...

}

```

Next, the compiler checks that Iterators have `hasNext()` and `next()`. The Iterator interface specifies these abstract methods explicitly:

```java

public interface Iterator<T> {

    boolean hasNext();

    T next();

}

```

**What if someone calls `next` when `hasNext` returns false?**

```

This behavior is undefined. However, a common convention is to throw a `NoSuchElementException`. See [Discussion 5](https://sp19.datastructur.es/materials/discussion/disc05sol.pdf) for examples.

```

**Will `hasNext` always be called before `next`?**

```

Not necessarily. This is sometimes the case when someone using the iterator knows exactly how many elements are in the sequence. Thus, we can't rely on the user calling `hasNext` before `next`. However, you can always call `hasNext` from within your `next` function.

```

Specific classes will implement their own iteration behaviors for the interface methods. Let's look at an example. (Note: if you want to build this up from the start, follow along with the live coding in the video.)

We are going to add iteration through keys to our `ArraySet` class. First, we write a new class called ArraySetIterator, nested inside of ArraySet:

```java

private class ArraySetIterator implements Iterator<T> {

    private int wizPos;

    public ArraySetIterator() {

        wizPos = 0;

    }

    public boolean hasNext() {

        return wizPos < size;

    }

    public T next() {

        T returnItem = items[wizPos];

        wizPos += 1;

        return returnItem;

    }

}

```

This ArraySetIterator implements `Iterator<T>`, which means it implements a `hasNext()` method, and a `next()` method, using a `wizPos` position as an index to keep track of its position in the array. For a different data structure, we might implement these two methods differently.

**Thought Exercise:** How would you design `hasNext()` and `next()` for a linked list?

Now that we have the appropriate methods, we could use a ArraySetIterator to iterate through an `ArraySet`:

```java

ArraySet<Integer> aset = new ArraySet<>();

aset.add(5);

aset.add(23);

aset.add(42);

Iterator<Integer> iter = aset.iterator();

while(iter.hasNext()) {

    System.out.println(iter.next());

}

```

We still want to be able to support the enhanced for loop, though, to make our calls cleaner. So, we need to make `ArraySet` implement the Iterable interface. The essential method of the Iterable interface is `iterator()`, which returns an Iterator object for that class. All we have to do is return an instance of our `ArraySetIterator` that we just wrote!

```java

public Iterator<T> iterator() {

    return new ArraySetIterator();

}

```

Now we can use enhanced for loops with our `ArrraySet`!

```java

ArraySet<Integer> aset = new ArraySet<>();

...

for (int i : aset) {

    System.out.println(i);

}

```

Here we've seen **Iterable**, the interface that makes a class able to be iterated on, and requires the method `iterator()`, which returns an Iterator object. And we've seen **Iterator**, the interface that defines the object with methods to actually do that iteration. You can think of an Iterator as a machine that you put onto an iterable that facilitates the iteration. Any iterable is the object on which the iterator is performing.

With these two components, you can make fancy for loops for your classes!

`ArraySet` code with iteration support is below:

```java

import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {

    private T[] items;

    private int size; // the next item to be added will be at position size

    public ArraySet() {

        items = (T[]) new Object[100];

        size = 0;

    }

    /* Returns true if this map contains a mapping for the specified key.

     */

    public boolean contains(T x) {

        for (int i = 0; i < size; i += 1) {

            if (items[i].equals(x)) {

                return true;

            }

        }

        return false;

    }

    /* Associates the specified value with the specified key in this map.

       Throws an IllegalArgumentException if the key is null. */

    public void add(T x) {

        if (x == null) {

            throw new IllegalArgumentException("can't add null");

        }

        if (contains(x)) {

            return;

        }

        items[size] = x;

        size += 1;

    }

    /* Returns the number of key-value mappings in this map. */

    public int size() {

        return size;

    }

    /** returns an iterator (a.k.a. seer) into ME */

    public Iterator<T> iterator() {

        return new ArraySetIterator();

    }

    private class ArraySetIterator implements Iterator<T> {

        private int wizPos;

        public ArraySetIterator() {

            wizPos = 0;

        }

        public boolean hasNext() {

            return wizPos < size;

        }

        public T next() {

            T returnItem = items[wizPos];

            wizPos += 1;

            return returnItem;

        }

    }

    public static void main(String[] args) {

        ArraySet<Integer> aset = new ArraySet<>();

        aset.add(5);

        aset.add(23);

        aset.add(42);

        //iteration

        for (int i : aset) {

            System.out.println(i);

        }

    }

}

```

---

## 12.4 Object Methods

All classes inherit from the overarching Object class. The methods that are inherited are as follows:

* `String toString()`

* `boolean equals(Object obj)`

* `Class <?> getClass()`

* `int hashCode()`

* `protected Objectclone()`

* `protected void finalize()`

* `void notify()`

* `void notifyAll()`

* `void wait()`

* `void wait(long timeout)`

* `void wait(long timeout, int nanos)`

We are going to focus on the first two in this chapter. We will take advantage of inheritance to override these two methods in our classes to behave in the ways we want them to.

### toString() 

The `toString()` method provides a string representation of an object. The `System.out.println()` function implicitly calls this method on whatever object is passed to it and prints the string returned. When you run `System.out.println(dog)`, it's actually doing this:

```java

String s = dog.toString()

System.out.println(s)

```

The default `Object` class' `toString()` method prints the location of the object in memory. This is a hexadecimal string. Classes like Arraylist and java arrays have their own overridden versions of the `toString()` method. This is why, when you were working with and writing tests for Arraylist, errors would always return the list in a nice format like this (1, 2, 3, 4) instead of returning the memory location.

For classes that we've written by ourselves like `ArrayDeque`, `LinkedListDeque`, etc, we need to provide our own `toString()` method if we want to be able to see the objects printed in a readable format.

Let's try to write this method for an `ArraySet` class. Read the `ArraySet` class below and make sure you understand what the various methods do. Feel free to plug the code into java visualizer to get a better understanding!

```java

import java.util.Iterator;

public class ArraySet<T> implements Iterable<T> {

    private T[] items;

    private int size; // the next item to be added will be at position size

    public ArraySet() {

        items = (T[]) new Object[100];

        size = 0;

    }

    /* Returns true if this map contains a mapping for the specified key.

     */

    public boolean contains(T x) {

        for (int i = 0; i < size; i += 1) {

            if (items[i].equals(x)) {

                return true;

            }

        }

        return false;

    }

    /* Associates the specified value with the specified key in this map.

       Throws an IllegalArgumentException if the key is null. */

    public void add(T x) {

        if (x == null) {

            throw new IllegalArgumentException("can't add null");

        }

        if (contains(x)) {

            return;

        }

        items[size] = x;

        size += 1;

    }

    /* Returns the number of key-value mappings in this map. */

    public int size() {

        return size;

    }

    /** returns an iterator (a.k.a. seer) into ME */

    public Iterator<T> iterator() {

        return new ArraySetIterator();

    }

    private class ArraySetIterator implements Iterator<T> {

        private int wizPos;

        public ArraySetIterator() {

            wizPos = 0;

        }

        public boolean hasNext() {

            return wizPos < size;

        }

        public T next() {

            T returnItem = items[wizPos];

            wizPos += 1;

            return returnItem;

        }

    }

    @Override

    public String toString() {

        /* hmmm */

    }

    @Override

    public boolean equals(Object other) {

        /* hmmm */

    }

    public static void main(String[] args) {

        ArraySet<Integer> aset = new ArraySet<>();

        aset.add(5);

        aset.add(23);

        aset.add(42);

        //iteration

        for (int i : aset) {

            System.out.println(i);

        }

        //toString

        System.out.println(aset);

        //equals

        ArraySet<Integer> aset2 = new ArraySet<>();

        aset2.add(5);

        aset2.add(23);

        aset2.add(42);

        System.out.println(aset.equals(aset2));

        System.out.println(aset.equals(null));

        System.out.println(aset.equals("fish"));

        System.out.println(aset.equals(aset));

}

```

You can find the [solutions here (ArraySet.java)](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/ArraySet.java)

**Exercise 6.4.1:** Write the toString() method so that when we print an ArraySet, it prints the elements separated by commas inside of curly braces. i.e {1, 2, 3, 4}. Remember, the toString() method should return a string.

**Solution**

```java

public String toString() {

    String returnString = "{";

    for (int i = 0; i < size; i += 1) {

        returnString += keys[i];

        returnString += ", ";

    }

    returnString += "}";

    return returnString;

}

```

This solution, although seemingly simple and elegant, is actually very naive. This is because when you use string concatenation in Java like so: `returnString += keys[i];` you are actually not just appending to `returnString`, you are creating an entirely new string. This is incredibly inefficient because creating a new string object takes time too! Specifically, linear in the length of the string (we'll discuss why in a later chapter!).

**Bonus Question:** Let's say concatenating one character to a string takes 1 second. If we have an ArraySet of size 5: `{1, 2, 3, 4, 5}`, how long would it take to run the `toString()` method?

**Answer:** We set `returnString` to the left bracket which takes one second because this involves adding `{` to the empty string `""`. Adding the first element will involve creating an entirely new string, adding } and 1 which would take 2 seconds. Adding the second element takes 3 seconds because we need to add `{`, `1`, `2`. This process continues, so for the entire array set the total time is `1 + 2 + 3 + 4 + 5 + 6 + 7.`

To remedy this, Java has a special class called `StringBuilder`. It creates a string object that is mutable, so you can continue appending to the same string object instead of creating a new one each time.

**Exercise 6.4.2:** Rewrite the toString() method using StringBuilder.

**Solution**

```java

public String toString() {

        StringBuilder returnSB = new StringBuilder("{");

        for (int i = 0; i < size - 1; i += 1) {

            returnSB.append(items[i].toString());

            returnSB.append(", ");

        }

        returnSB.append(items[size - 1]);

        returnSB.append("}");

        return returnSB.toString();

    }

```

Now you've successfully overridden the `toString()` method! Try printing the ArraySet to see the fruits of your work.

Next we will override another important object method: `equals()`

### equals() 

`equals()` and `==` have different behaviors in Java. `==` Checks if two objects are actually the same object in memory. Remember, pass-by-value! `==` checks if two boxes hold the same thing. For primitives, this means checking if the values are equal. For objects, this means checking if the address/pointer is equal.

Say we have this `Doge` class:

```java

public class Doge {

   public int age;

   public String name;

   public Doge(int age, String name){

      this.age = age;

      this.name = name;

   }

   public static void main(String[] args) {

      int x = 5;

      int y = 5;

      int z = 6;

      Doge fido = new Doge(5, "Fido");

      Doge doggo = new Doge(6, "Doggo");

      Doge fidoTwin = new Doge(5, "Fido");

      Doge fidoRealTwin = fido;

   }

}

```

If we plug this code into the java visualizer, we will see the box in pointer diagram shown below.

![](https://joshhug.gitbooks.io/hug61b/content/assets/Doge.png)

**Exercise 6.4.3:** What would java return if we ran the following?

* `x == y`

* `x == z`

* `fido == doggo`

* `fido == fidoTwin`

* `fido == fidoRealTwin`

**Answers**

* `True`

* `False`

* `False`

* `False`

* `True`

`fido` and `fidoTwin` are not considered `==` because they point to different objects. However, this is quite silly since all their attributes are the same. You can see how `==` can cause some problems in Java testing. When we write tests for our ArrayList and want to check if expected is the same as what is returned by our function, we create expected as a new arraylist. If we used `==` in our test, it would always return false. This is what `equals(Object o)` is for.

### `equals(Object o)` 

`equals(Object o)` is a method in the Object class that, by default, acts like == in that it checks if the memory address of the this is the same as o. However, we can override it to define equality in whichever way we wish! For example, for two Arraylists to be considered equal, they just need to have the same elements in the same order.

**Exercise 6.4.4:** Let's write an equals method for the ArraySet class. Remember, a set is an unordered collection of unique elements. So, for two sets to be considered equal, you just need to check if they have the same elements.

**Solution**

```java

public boolean equals(Object other) {

        if (this == other) {

            return true;

        }

        if (other == null) {

            return false;

        }

        if (other.getClass() != this.getClass()) {

            return false;

        }

        ArraySet<T> o = (ArraySet<T>) other;

        if (o.size() != this.size()) {

            return false;

        }

        for (T item : this) {

            if (!o.contains(item)) {

                return false;

            }

        }

        return true;

    }

```

We added a few checks in the beginning of the method to make sure our `.equals()` can handle nulls and objects of a different class. We also optimized the function by returning true right away if the == methods returns true. This way, we avoid the extra work of iterating through the set.

**Rules for Equals in Java:** Overriding a `.equals()` method may sometimes be trickier than it seems. A couple of rules to adhere to while implementing your `.equals()` method are as follows:

1.) `equals` must be an equivalence relation

* **reflexive**: `x.equals(x)` is true

* **symmetric**: `x.equals(y)` if and only if `y.equals(x)`

* **transitive**: `x.equals(y)` and `y.equals(z)` implies `x.equals(z)`

2.) It must take an Object argument, in order to override the original `.equals()` method

3.) It must be consistent if `x.equals(y)`, then as long as `x` and `y` remain unchanged: `x` must continue to equal `y`

4.) It is never true for null `x.equals(null)` must be false

### Bonus video 

Create an even better `toString` method and `ArraySet.of`:

Link to the [bonus code](https://github.com/Berkeley-CS61B/lectureCode-sp23/blob/main/lec11_inheritance4/ArraySet.java)

---

## 12.5 Chapter Summary

Summary of the main points in this chapter.

You can find the code from this lecture [here](https://github.com/Berkeley-CS61B/lectureCode-sp23/tree/main/lec12_inheritance4). 

#### Exceptions

Most likely you have encountered an exception in your code such as a `NullPointerException` or an `IndexOutOfBoundsException`. Now we will learn about how we can “throw” exceptions ourselves. Here is an example of an exception that we throw:

```

throw new RuntimeException("For no reason.");

```

This is useful to ensure reasonable functioning of our code, even when facing unexpected behavior.

#### Iteration

##### Difference between Iterators and Iterables

These two words are very closely related, but have two different meanings that are often easy to confuse. The first thing to know is that these are both Java interfaces, with different methods that need to be implemented. Here is a simplified interface for Iterator:

```

public interface Iterator<T> {

  boolean hasNext();

  T next();

}

```

Here is a simplified interface for Iterable:

```

public interface Iterable<T> {

    Iterator<T> iterator();

}

```

Notice that in order for an object (for example an ArrayList or LinkedList) to be *iterable*, it must include a method that returns an *iterator*. The iterator is the object that actively steps through an iterable object. Keep this relationship and distinction in mind as you work with these two interfaces.

#### Object Methods

##### toString

The `toString()` method returns a string representation of objects. For example, `System.out.println(someObject)` calls the `toString()` method of `someObject`, and prints to console whatever string it returns. 

This is most helpful when we are debugging, as it allows us to much more easily understand the current state of our Objects.

##### == vs .equals

We have two concepts of equality in Java- “==” and the “.equals()” method. The key difference is that when using ==, we are checking if two objects have the same address in memory (that they point to the same instance or object). On the other hand, .equals() is a method that can be overridden by a class and can be used to define some custom way of determining equality. This permits the class to utilize the additional knowledge it has about itself to more accurately answer questions of equality.

For example, say we wanted to check if two stones are equal:

```

public class Stone{

  int weight;

  public Stone(int weight){

    this.weight = weight;

  }

}

Stone s = new Stone(100);

Stone r = new Stone(100);

```

If we want to consider s and r equal because they have the same weight. If we do check equality using ==, these Stones would not be considered equal because they do not have the same memory address.

On the other hand, if you override the equals method of Stone as follows

```

public boolean equals(Object o){

  return this.weight == ((Stone) o).weight

}

```

We would have that the stones would be considered equal because they have the same weight.

---

## 12.6 Exercises

#### Factual

1. What methods are required for a class that is Iterable?

2. Which of the following is true about the `java.util.Se`t and the `java.util.List` interfaces?

   * [ ] If we add `String[][]` objects to a `Set` and a `List`, the size of the set will always be less than or equal to the size of the list.

   * [ ] The `java.util.ArrayList` class is an implementation of the `java.util.List` interface.

   * [ ] The `Set` and `List` interfaces extend the `Iterator` interface.

   * [ ] The `Set` and `List` interfaces extend the `Iterable` interface.

3. Suppose we have a class that implements `Iterator`. What methods must it override in order to compile?

<details>

<summary>Problem 1</summary>

An `Iterable` is required to have the `iterator()` method, which returns an `Iterator`.

</details>

<details>

<summary>Problem 2</summary>

* **If we add `String[][]` objects to a `Set` and a `List`, the size of the set will always be less than or equal to the size of the list.** Sets only have unique items, while lists can have duplicates, so if we add the same elements to both the list will always have at least as many elements as the set.

* **The `java.util.ArrayList` class is an implementation of the `java.util.List` interface.** One implementation of the `List` interface in Java is the ArrayList class.

* **The `Set` and `List` interfaces extend the `Iterable` interface.** Sets and Lists in Java can be used in enhanced for loops, which means that they are `Iterable`.

</details>

<details>

<summary>Problem 3</summary>

An `Iterator` must override `hasNext()`, which returns a boolean indicating whether there are more elements in the `Iterator`, and `next()`, which returns the next item.

</details>

#### Conceptual

1. Why do we want to override the `.equals` method?

<details>

<summary>Problem 1</summary>

The `.equals()` method inherited from `Object` only checks if two items have the same memory address. This is undesireable behavior for many user-written classes in Java.

</details>

### Metacognitive

1. In lecture, you built the `ArraySetIterator` class. Modify the lecture class to take in a `Comparator<T>` and an item of generic type `T` called `ref` in the constructor. This new iterator should only return items greater than `T`. For reference, the code for `ArraySetIterator` is included below.

```java

private class ArraySetIterator implements Iterator<T> {

	private int pos;

	public ArraySetIterator() { 

		pos = 0; 

	}

	public boolean hasNext() { 

		return pos < size; 

	}

	public T next() {

	 	T returnItem = items[pos];

	 	pos += 1;

	 	return returnItem;

	}

}

```

2. Problem 7 from the Spring 2018 Midterm 2

<details>

<summary>Problem 1</summary>

```java

public class ArraySetGreaterIterator implements Iterator<T> {

    private int pos;

    private T ref;

    private Comparator<T> comp;

    public ArraySetGreaterIterator(T ref, Comparator<T> comp) {

        this.ref = ref;

        this.comp = comp;

    }

    @Override

    public boolean hasNext() {

        return pos < size;

    }

    @Override

    public T next() {

        T returnItem = items[pos];

        while (comp.compare(returnItem, ref) <= 0) {

            pos += 1;

            returnItem = items[pos];

        }

        return returnItem;

    }

}

```

</details>

<details>

<summary>Problem 2</summary>

[Solutions](https://drive.google.com/file/d/1LIyFXwHYCWXNqIgKTsTyKiOYnB79_ykk/view) and [walkthrough](https://www.youtube.com/watch?v=nMZn4EV0gGw) are linked here and on the course website.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Inheritance III: Subtype polymorphism, Comparable and Comparator](/en/notes/cs61b/lecture-10) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Asymptotic Analysis I: Algorithm Efficiency Measurement and Big O Ladder →](/en/notes/cs61b/lecture-12) | [🎬Watch this lecture on Bilibili (P11)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=11) |
