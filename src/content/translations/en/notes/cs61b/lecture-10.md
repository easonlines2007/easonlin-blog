---
kind: notes
source: cs61b/lecture-10
title: "Lecture 10 · Inheritance III: Subtype Polymorphism, Comparable, and
  Comparator"
description: "CS61B Lecture 10: Inheritance III: Subtype polymorphism,
  Comparable and Comparator: Universal comparison system, self-built Maximizer,
  Comparable interface contract and strategy pattern"
sourceHash: f28103085dba2bc7329810ce8133eba3360e342078e03cb89bbd2aa7175ba0e5
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 2: Inheritance, Interfaces & Subtyping  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 50:50 ｜ **Official original version**: Lecture 10 - Inheritance III Subtype Polymorphism Comparators Comparable  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1WpISEkGajVCwARZy6w-XDF5sofm1cITUhfAlPUnnnos) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/11.-subtype-polymorphism-comparators-comparable)  
> **Quick navigation**: [← Previous lecture (P09 Inheritance II: Extends, type conversion and higher-order functions)](/en/notes/cs61b/lecture-09) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P11 Inheritance IV: Iterator and Object basic methods) →](/en/notes/cs61b/lecture-11)

---

## 1. The three realms of polymorphism: ad hoc, parameterized and subtype polymorphism

*(Reference time: 00:01:45 · [Video jump (P10 00:01:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=105))*

"Polymorphism" comes from the Greek word meaning "many forms." In modern programming language theory, polymorphism is mainly divided into three forms:

1. **Ad-hoc Polymorphism/Method Overloading**: 
   - The same method name corresponds to multiple independent implementations of different parameter types, and the compiler statically selects them based on the characteristics of the actual parameters;
2. **Parametric Polymorphism / Generics**: 
   - Write generic logic templates that are independent of specific types (e.g.  `AList<Item>`), the type is specified lazily as a parameter;
3. **Subtype Polymorphism**: 
   - Allows subclass objects to be treated uniformly by pretending to be parent class or interface types, and specialization behavior is performed based on the real type at runtime.

The core task of this lecture is to use subtype polymorphism to create a set of **Universal object comparison and extreme value retrieval system**.

## 2. Realistic Challenges: Universal Algorithms  `Maximizer.max()`  design dilemma

*(Reference time: 00:08:50 · [Video jump (P10 00:08:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=530))*

Suppose we want to write a general maximum value retrieval tool  `Maximizer`, hoping that it can not only find the largest integer, but also the largest dog, the largest string, and the largest student score.

A beginner would intuitively write:
```java
public class Maximizer {
    public static Object max(Object[] items) {
        int maxDex = 0;
        for (int i = 0; i < items.length; i++) {
            // 编译当场崩溃！
            // if (items[i] > items[maxDex]) { maxDex = i; }
        }
        return items[maxDex];
    }
}
```

### Why does compilation crash on the spot?
Because the greater than sign in Java  `>`  is specialized for basic primitive types (`int`, `double`  etc.) customized underlying hardware instructions.  
For reference objects, two  `Dog`  object or two  `String`  The object is physically a memory address pointer, **Java strictly prohibits use between referenced objects  `>`  or  `<`  operator**!

We must establish a common object-oriented contract that expresses "who is bigger than whom?"

## 3. `Comparable<T>`  Interface Contract and Natural Ordering

*(Reference time: 00:16:30 · [Video jump (P10 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=990))*

The Java standard library provides us with an extremely elegant interface: `java.lang.Comparable<T>`.

```java
public interface Comparable<T> {
    /**
     * 将当前对象 (this) 与传入的对象 (o) 进行大小比较。
     * @return 负数：表示 this < o
     * @return 零：表示 this 等于 o
     * @return 正数：表示 this > o
     */
    public int compareTo(T o);
}
```

### let  `Dog`  realize  `Comparable<Dog>`
```java
public class Dog implements Comparable<Dog> {
    public String name;
    public int size;

    public Dog(String n, int s) {
        name = n;
        size = s;
    }

    @Override
    public int compareTo(Dog otherDog) {
        // 核心规范：负数代表小于，0 代表相等，正数代表大于
        if (this.size < otherDog.size) {
            return -1;
        } else if (this.size > otherDog.size) {
            return 1;
        }
        return 0;
    }
}
```

### Universal  `Maximizer.max()`  The perfect realization of
```java
public class Maximizer {
    public static Comparable max(Comparable[] items) {
        if (items == null || items.length == 0) return null;
        int maxDex = 0;
        for (int i = 1; i < items.length; i++) {
            int cmp = items[i].compareTo(items[maxDex]);
            if (cmp > 0) {
                maxDex = i;
            }
        }
        return items[maxDex];
    }
}
```
At this point, any implementation  `Comparable`  The object array of the interface can be put directly into  `Maximizer.max()`  Retrieve extreme values!

## 4. Comparator interface  `Comparator<T>`  With Strategy Pattern

*(Reference time: 00:25:00 · [Video jump (P10 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=1500))*

`Comparable`  Although good, it has a fundamental limitation: **It can only define a single inherent comparison rule (called Natural Order)**.

### Real world complex demands
for  `Dog`  Class:
- The pet hospital may wish to sort by size from smallest to largest;
- Canine beauty pageants may wish to sort alphabetically by name;
- Dog training clubs may wish to press **agility or age** Sort.

If we write the sorting logic strictly in  `Dog`  of  `compareTo`  Internally, we would never be able to support comparisons in multiple dimensions at the same time!

### Decoupling artifact: `java.util.Comparator<T>`  strategy pattern
Java provides a second comparison interface——`Comparator<T>`, which represents a **Independent third-party impartial referee**: 

```java
public interface Comparator<T> {
    public int compare(T o1, T o2);
}
```

## 5. Nested comparator class and  `Dog.getNameComparator()`  Elegant practice

*(Reference time: 00:33:15 · [Video jump (P10 00:33:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=1995))*

we can  `Dog`  Nested dedicated comparators are elegantly defined inside the class to achieve a high degree of code cohesion:

```java
import java.util.Comparator;

public class Dog implements Comparable<Dog> {
    public String name;
    public int size;

    public Dog(String n, int s) { name = n; size = s; }

    @Override
    public int compareTo(Dog other) {
        return this.size - other.size; // 默认自然序按体型
    }

    /** 静态私有内部类：专门负责按名字比较的裁判员 */
    private static class NameComparator implements Comparator<Dog> {
        @Override
        public int compare(Dog a, Dog b) {
            return a.name.compareTo(b.name);
        }
    }

    /** 向外部提供名字比较器工厂方法 */
    public static Comparator<Dog> getNameComparator() {
        return new NameComparator();
    }
}
```

### Flexible client strategy switching
```java
Dog d1 = new Dog("Zoe", 10);
Dog d2 = new Dog("Ada", 100);

// 方式 1：使用默认自然序比较大小
if (d1.compareTo(d2) < 0) {
    System.out.println("d2 体型更大！");
}

// 方式 2：使用裁判员按名字排序
Comparator<Dog> nc = Dog.getNameComparator();
if (nc.compare(d1, d2) > 0) {
    System.out.println("d1 名字字母序更靠后！");
}
```

## 6. Generic wildcards and upper bounds: `T extends Comparable<T>`

*(Reference time: 00:41:40 · [Video jump (P10 00:41:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2500))*

in front  `Maximizer` , our return type is primitive  `Comparable`: 
```java
Dog biggest = (Dog) Maximizer.max(dogs); // 必须丑陋地强制类型转换！
```
If an unimplemented  `Comparable`  Arrays of objects can even lead to type safety vulnerabilities.

### Bounded Generics
We use generic parameter upper limit binding to reconstruct a perfectly typed  `max`: 

```java
public class Maximizer {
    /** 
     * 声明泛型 T 必须是某个实现了 Comparable 契约的类型！
     * 返回类型直接就是 T，无需任何强转！
     */
    public static <T extends Comparable<T>> T max(T[] items) {
        if (items == null || items.length == 0) return null;
        T maxItem = items[0];
        for (T item : items) {
            if (item.compareTo(maxItem) > 0) {
                maxItem = item;
            }
        }
        return maxItem;
    }
}
```
Now, the client calls  `Dog big = Maximizer.max(dogs);`  When , the compiler automatically infers that the return type is  `Dog`, zero forced transfer, absolutely type safe!

## 7. Official courseware seminar topic: Comparable classic integer overflow vulnerability trap

*(Reference time: 00:48:30 · [Video jump (P10 00:48:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2910))*

Many textbooks and programmers like to use  `compareTo`  Use subtraction to be lazy:
```java
public int compareTo(Dog other) {
    return this.size - other.size; // 极其危险的暗礁！
}
```

### Thrilling numerical overflow disaster
hypothesis  `this.size`  is a very large positive number (such as  `2,000,000,000`), while  `other.size`  is a very small negative number (such as  `-1,000,000,000`).  
In mathematics, `20亿 - (-10亿) = 30亿`, should be a positive number.  
However, 32-bit signed integers  `int`  The maximum upper limit of is only about  `21.47 亿`(`Integer.MAX_VALUE`)!  
The subtraction result occurs **Serious arithmetic overflow (Integer Overflow)**, the value instantly flips to **negative number**!  
This leads the program to reach an absurd conclusion: "2 billion is smaller than -1 billion"!

### Industrial grade overflow prevention standard writing method
**Never rely on subtraction to compare integers**! The standard library's comparators must be used explicitly:
```java
return Integer.compare(this.size, other.size);
```

## 8. Summary of this lecture and practical self-test after class

*(Reference time: 00:53:00 · [Video jump (P10 00:53:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=3180))*

### `Comparable`  with  `Comparator`  core contrast panorama

| Compare dimensions | `java.lang.Comparable<T>` | `java.util.Comparator<T>` |
| :--- | :--- | :--- |
| **role definition** | The "natural default size" within the entity itself | Independent external “third-party referee” |
| **core method** | `public int compareTo(T other)` | `public int compare(T o1, T o2)` |
| **Modify location** | The source code of the entity class must be modified to implement the interface | No need to touch the entity class source code, completely written externally |
| **Number of rules** | Only one default natural order can be defined | Feel free to create an unlimited number of different strategy comparators |

---

### Comprehensive self-test questions after class

#### Question 1 (Code practice: multi-dimensional comparator)
Suppose there is a student class  `Student`  contains  `String name`  and  `double gpa`. Please write a  `Comparator<Student>`, first sort by GPA in descending order; if the GPA is the same, then sort by name in ascending alphabetical order. 
**Reference implementation code**: 
```java
public class StudentGradeComparator implements Comparator<Student> {
    @Override
    public int compare(Student s1, Student s2) {
        // GPA 降序：s2 与 s1 比较
        int gpaCompare = Double.compare(s2.gpa, s1.gpa);
        if (gpaCompare != 0) {
            return gpaCompare;
        }
        // GPA 相同时按名字升序
        return s1.name.compareTo(s2.name);
    }
}
```

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 11. Inheritance III: Subtype Polymorphism, Comparators, Comparable

In this chapter of the textbook we will be: 

* Reviewing Dynamic Method Selection

* Defining Subtype Polymorphism and contrasting it against Explicit Higher Order Functions

* Seeing Applications of Subtype Polymorphism in:

  * Comparators

  * Comparables

The following videos for Lecture 10 correspond to the content for this chapter of the textbook.

---

## 11.1 A Review of Dynamic Method Selection

In previous lectures we have gone over classes extending other classes, and to make sense of this we considered whether the sub class has an "is-a relationship" with the superclass. For example, if we had the two classes:

* Dog: Implements bark() method

* ShowDog: Extends Dog, overrides bark method

This would be a valid extension as a ShowDog is-a Dog and a Dog is-an Object. These relationships satisfy the condition of a subclass being-an instance of the super class.  

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FnAJGy8b3QssQgxGfwWyG%2Fimage.png?alt=media\&token=2087b4a9-cddf-42f6-a59d-97343ad80439)

### With this in Mind, what are the Rules to Decide if the Code Would Run or Run into Errors?

This is a particularly tricky problem to solve but the rules to look out for include:

* Compliers will allow Memory Boxes to hold any subtype of itself

  * For example, compliers will allow the Dog memory box to hold a ShowDog object as a ShowDog is a subtype of the Dog Class

* Compliers will allow calls based on Static type.

  * For example, if a variable were declared as a Dog it's static type would be a Dog and the complier would allowed it to call bark()

* **Overridden non-static methods are selected at run time based on dynamic type.**

  * **Everything else is based on static types,** inculding overloaded methods.

### Static Type vs. Dynamic Type

Every variable in Java has a “compile-time type”, a.k.a. “static type”.

* This is the type specified at declaration. Never changes!

\

Variables also have a “run-time type”, a.k.a. “dynamic type”.

* This is the type specified at instantiation (e.g. when using new).

* Equal to the type of the object being pointed at.

### Accompanying Lecture

---

## 11.2 Subtype Polymorphism vs Explicit Higher Order Functions

We've seen how inheritance lets us reuse existing code in a superclass while implementing small modifications by overriding a superclass's methods or writing brand new methods in the subclass. Inheritance also makes it possible to design general data structures and methods using *polymorphism*.

Polymorphism, at its core, means 'many forms'. In Java, polymorphism refers to how objects can have many forms or types. In object-oriented programming, polymorphism relates to how an object can be regarded as an instance of its own class, an instance of its superclass, an instance of its superclass's superclass, and so on.

Consider a variable `deque` of static type Deque. A call to `deque.addFirst()` will be determined at the time of execution, depending on the run-time type, or dynamic type, of `deque` when `addFirst` is called. As we saw in the last chapter, Java picks which method to call using dynamic method selection.

Suppose we want to write a python program that prints a string representation of the larger of two objects. There are two approaches to this.

1. Explicit HoF Approach

```python

def print_larger(x, y, compare, stringify):

    if compare(x, y):

        return stringify(x)

    return stringify(y)

```

2. Subtype Polymorphism Approach

```python

def print_larger(x, y):

    if x.largerThan(y):

        return x.str()

    return y.str()

```

Using the explicit higher order function approach, you have a common way to print out the larger of two objects. In contrast, in the subtype polymorphism approach, the object *itself* makes the choices. The `largerFunction` that is called is dependent on what x and y actually are.

---

## 11.3 Comparables

One Sizable Application of Subtype Polymorphism

##### Max Function 

Say we want to write a `max` function which takes in any array - regardless of type - and returns the maximum item in the array.

**Exercise 4.3.1.** Your task is to determine how many compilation errors there are in the code below.

```java

public static Object max(Object[] items) {

    int maxDex = 0;

    for (int i = 0; i < items.length; i += 1) {

        if (items[i] > items[maxDex]) {

            maxDex = i;

        }

    }

    return items[maxDex];

}

public static void main(String[] args) {

    Dog[] dogs = {new Dog("Elyse", 3), new Dog("Sture", 9), new Dog("Benjamin", 15)};

    Dog maxDog = (Dog) max(dogs);

    maxDog.bark();

}

```

In the code above, there was only 1 error, found at this line:

```java

if (items[i] > items[maxDex]) {

```

The reason why this results in a compilation error is because this line assumes that the `>` operator works with arbitrary Object types, when in fact it does not.

Instead, one thing we could is define a `maxDog` function in the Dog class, and give up on writing a "one true max function" that could take in an array of any arbitrary type. We might define something like this:

```java

public static Dog maxDog(Dog[] dogs) {

    if (dogs == null || dogs.length == 0) {

        return null;

    }

    Dog maxDog = dogs[0];

    for (Dog d : dogs) {

        if (d.size > maxDog.size) {

            maxDog = d;

        }

    }

    return maxDog;

}

```

While this would work for now, if we give up on our dream of making a generalized `max` function and let the Dog class define its own `max` function, then we'd have to do the same for any class we define later. We'd need to write a `maxCat` function, a `maxPenguin` function, a `maxWhale` function, etc., resulting in unnecessary repeated work and a lot of redundant code.

The fundamental issue that gives rise to this is that Objects cannot be compared with `>`. This makes sense, as how could Java know whether it should use the String representation of the object, or the size, or another metric, to make the comparison? In Python or C++, the way that the `>` operator works could be redefined to work in different ways when applied to different types. Unfortunately, Java does not have this capability. Instead, we turn to interface inheritance to help us out.

### Solution: Comparables

We can create an interface that guarantees that any implementing class, like Dog, contains a comparison method, which we'll call `compareTo`.

![](https://joshhug.gitbooks.io/hug61b/content/assets/dog_comparable.png)

Let's write our interface. We'll specify one method `compareTo`.

```java

public interface OurComparable {

    public int compareTo(Object o);

}

```

We will define its behavior like so:

* Return -1 if `this` < o.

* Return 0 if `this` equals o.

* Return 1 if `this` > o.

Now that we've created the `OurComparable` interface, we can require that our Dog class implements the `compareTo` method. First, we change Dog's class header to include `implements OurComparable`, and then we write the `compareTo` method according to its defined behavior above.

**Exercise 4.3.2.** Implement the `compareTo` method for the Dog class.

The `OurComparable` interface that we just built works, but it's not perfect. Here are some issues with it:

* Awkward casting to/from Objects

* We made it up.

  * No existing classes implement OurComparable (e.g. String, etc.)

  * No existing classes use OurComparable (e.g. no built-in max function that uses OurComparable)

The solution? We'll take advantage of an interface that already exists called `Comparable`. `Comparable` is already defined by Java and is used by countless libraries.

`Comparable` looks very similar to the OurComparable interface we made, but with one main difference. Can you spot it?

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FupH1F2E72Zx3PgCXgtGs%2Fcomparable_interface.png?alt=media&amp;token=40d10df7-5c3c-42a1-ac8b-30e564359069" alt=""><figcaption></figcaption></figure>

Notice that `Comparable<T>` means that it takes a generic type. This will help us avoid having to cast an object to a specific type! Now, we will rewrite the Dog class to implement the Comparable interface, being sure to update the generic type `T` to Dog:

```java

public class Dog implements Comparable<Dog> {

    ...

    public int compareTo(Dog uddaDog) {

        return this.size - uddaDog.size;

    }

}

```

Now all that's left is to change each instance of OurComparable in the Maximizer class to Comparable. Watch as the largest Dog says bark:

We use the instance variable `size` to make our comparison.

```java

public class Dog implements OurComparable {

    private String name;

    private int size;

    public Dog(String n, int s) {

        name = n;

        size = s;

    }

    public void bark() {

        System.out.println(name + " says: bark");

    }

    public int compareTo(Object o) {

        Dog uddaDog = (Dog) o;

        if (this.size < uddaDog.size) {

            return -1;

        } else if (this.size == uddaDog.size) {

            return 0;

        }

        return 1;

    }

}

```

**Notice that since `compareTo` takes in any arbitrary Object o, we have to *****cast***** the input to a Dog to make our comparison using the `size` instance variable.**

Now we can generalize the `max` function we defined in exercise 4.3.1 to, instead of taking in any arbitrary array of objects, takes in `OurComparable` objects - which we know for certain all have the `compareTo` method implemented.

```java

public static OurComparable max(OurComparable[] items) {

    int maxDex = 0;

    for (int i = 0; i < items.length; i += 1) {

        int cmp = items[i].compareTo(items[maxDex]);

        if (cmp > 0) {

            maxDex = i;

        }

    }

    return items[maxDex];

}

```

Great! Now our `max` function can take in an array of any `OurComparable` type objects and return the maximum object in the array. Now, this code is admittedly quite long, so we can make it much more succinct by modifying our `compareTo` method's behavior:

* Return negative number if `this` < o.

* Return 0 if `this` equals o.

* Return positive number if `this` > o.

Now, we can just return the difference between the sizes. If my size is 2, and uddaDog's size is 5, `compareTo` would return -3, a negative number indicating that I am smaller.

```java

public int compareTo(Object o) {

    Dog uddaDog = (Dog) o;

    return this.size - uddaDog.size;

}

```

Using inheritance, we were able to generalize our maximization function. What are the benefits to this approach?

* No need for maximization code in every class(i.e. no `Dog.maxDog(Dog[])` function required

* We have code that operates on multiple types (mostly) gracefully

##### Interfaces Quiz 

**Exercise 4.3.3.** Given the `Dog` class, `DogLauncher` class, `OurComparable` interface, and the `Maximizer` class, if we omit the compareTo() method from the Dog class, which file will fail to compile?

```java

public class DogLauncher {

    public static void main(String[] args) {

        ...

        Dog[] dogs = new Dog[]{d1, d2, d3};

        System.out.println(Maximizer.max(dogs));

    }

}

public class Dog implements OurComparable {

    ...

    public int compareTo(Object o) {

        Dog uddaDog = (Dog) o;

        if (this.size < uddaDog.size) {

            return -1;

        } else if (this.size == uddaDog.size) {

            return 0;

        }

        return 1;

    }

    ...

}

public class Maximizer {

    public static OurComparable max(OurComparable[] items) {

        ...

        int cmp = items[i].compareTo(items[maxDex]);

        ...

    }

}

```

In this case, the `Dog` class fails to compile. By declaring that it `implements OurComparable`, the Dog class makes a claim that it "is-an" OurComparable. As a result, the compiler checks that this claim is actually true, but sees that Dog doesn't implement `compareTo`.

What if we were to omit `implements OurComparable` from the Dog class header? This would cause a compile error in DogLauncher due to this line:

```java

System.out.println(Maximizer.max(dogs));

```

If Dog does not implement the OurComparable interface, then trying to pass in an array of Dogs to Maximizer's `max` function wouldn't be approved by the compiler. `max` only accepts an array of OurComparable objects.

Instead of using our personally created interface `OurComparable`, we now use the real, built-in interface, `Comparable`. As a result, we can take advantage of all the libraries that already exist and use `Comparable`.

![](https://joshhug.gitbooks.io/hug61b/content/assets/comparable.png)

<br>

---

## 11.4 Comparators

We've just learned about the comparable interface, which imbeds into each Dog the ability to compare itself to another Dog. Now, we will introduce a new interface that looks very similar called `Comparator`.

Let's start off by defining some terminology.

* Natural order - used to refer to the ordering implied in the `compareTo` method of a particular class.

As an example, the natural ordering of Dogs, as we stated previously, is defined according to the value of size. What if we'd like to sort Dogs in a different way than their natural ordering, such as by alphabetical order of their name?

Java's way of doing this is by using `Comparator`'s. Since a comparator is an object, the way we'll use `Comparator` is by writing a nested class inside Dog that implements the `Comparator` interface.

But first, what's inside this interface?

```java

public interface Comparator<T> {

    int compare(T o1, T o2);

}

```

This shows that the `Comparator` interface requires that any implementing class implements the `compare` method. The rule for `compare` is just like `compareTo`:

* Return negative number if o1 < o2.

* Return 0 if o1 equals o2.

* Return positive number if o1 > o2.

Let's give Dog a NameComparator. To do this, we can simply defer to `String`'s already defined `compareTo` method.

```java

import java.util.Comparator;

public class Dog implements Comparable<Dog> {

    ...

    public int compareTo(Dog uddaDog) {

        return this.size - uddaDog.size;

    }

    private static class NameComparator implements Comparator<Dog> {

        public int compare(Dog a, Dog b) {

            return a.name.compareTo(b.name);

        }

    }

    public static Comparator<Dog> getNameComparator() {

        return new NameComparator();

    }

}

```

Note that we've declared NameComparator to be a static class. A minor difference, but we do so because we do not need to instantiate a Dog to get a NameComparator. Let's see how this Comparator works in action.

As you've seen, we can retrieve our NameComparator like so:

```java

Comparator<Dog> nc = Dog.getNameComparator();

```

All in all, we have a Dog class that has a private NameComparator class and a method that returns a NameComparator we can use to compare dogs alphabetically by name.

Let's see how everything works in the inheritance hierarchy - we have a Comparator interface that's built-in to Java, which we can implement to define our own Comparators (`NameComparator`, `SizeComparator`, etc.) within Dog.

![](https://joshhug.gitbooks.io/hug61b/content/assets/comparator.png)

To summarize, interfaces in Java provide us with the ability to make **callbacks**. Sometimes, a function needs the help of another function that might not have been written yet (e.g. `max` needs `compareTo`). A callback function is the helping function (in the scenario, `compareTo`). In some languages, this is accomplished using explicit function passing; in Java, we wrap the needed function in an interface.

A Comparable says, "I want to compare myself to another object". It is imbedded within the object itself, and it defines the **natural ordering** of a type. A Comparator, on the other hand, is more like a third party machine that compares two objects to each other. Since there's only room for one `compareTo` method, if we want multiple ways to compare, we must turn to Comparator.

---

## 11.5 Chapter Summary

**Review: Typing Rules**

* Compiler allows the memory box to hold any subtype.

* Compiler allows calls based on static type.

* Overriden non-static methods are selected at runtime based on dynamic type.

* For overloaded methods, the method is selected at compile time.

**Subtype Polymorphism** Consider a variable of static type `Deque`. The behavior of calling `deque.method()` depends on the dynamic type. Thus, we could have many subclasses the implement the `Deque` interface, all of which will be able to call `deque.method()`.

**Subtype Polymorphism Example** Suppose we want to write a function `max()` that returns the max of any array regardless of type. If we write a method `max(Object[] items)`, where we use the ‘\>’ operator to compare each element in the array, this will not work! Why is this the case?

Well, this makes the assumption that all objects can be compared. But some objects cannot! Alternatively, we could write a `max()` function inside the Dog class, but now we have to write a `max()` function for each class that we want to compare! Remember, our goal is to write a “one true max method” that works for all comparable objects.

**Solution: OurComparable Interface** The solution is to create an interface that contains a `compareTo(Object)` method; let’s call this interface `OurComparable`. Now, our `max()` method can take a `OurComparable[]` parameter, and since we guarantee that any object which extends the interface has all the methods inside the interface, we guarantee that we will always be able to call a `compareTo` method, and that this method will correctly return some ordering of the objects.

Now, we can specify a “one true max method”. Of course, any object that needs to be compared must implement the `compareTo` method. However, instead of re-implementing the `max` logic in every class, we only need to implement the logic for picking the ordering of the objects, given two objects.

**Even Better: Java’s In-Built Comparable** Java has an in-built `Comparable` interface that uses generics to avoid any weird casting issues. Plus, Comparable already works for things like `Integer`, `Character`, and `String`; moreover, these objects have already implemented a `max`, `min`, etc. method for you. Thus you do not need to re-do work that’s already been done!

**Comparators** The term “Natural Order” is used to refer to the ordering implied by a `Comparable`’s `compareTo` method. However, what if we want to order our `Dog` objects by something other than `size`? We will instead pass in a `Comparator<T>` interface, which demands a `compare()` method. We can then implement the `compare()` method anyway we want to achieve our ordering.

<br>

---

## 11.6 Exercises

### Exercises

1. Which of the following are examples of subtype polymorphism?

   * [ ] Having a `sqrt(int)` and `sqrt(double)` method in the same class.

   * [ ] Having a `Dog` override the `makeSound` method that it inherits from `Animal`.

   * [ ] Creating a class that implements the built-in `Comparable` interface.

2. How would you compare two strings alphabetically in Java?

3. Suppose we correctly define a `Comparator` class called `SixComparator` for integers that compares them based on the number of `6`s they contain. What will the code `(new SixComparator()).compare(12345678, 45666678)` return? 

4. What is the main difference between the `Comparable` and `Comparator` interfaces?

### Solutions

<details>

<summary>Problem 1</summary>

**Having a `Dog` override the `makeSound` method that it inherits from `Animal`.**

Overriding `makeSound` allows us to have different implementations of the same method via subtypes.

**Creating a class that implements the built-in `Comparable` interface.**

Implementing the Comparable interface involves overriding Comparables’ methods, allowing for differing behavior of the same method across types.

</details>

<details>

<summary>Problem 2</summary>

`s1.compareTo(s2)`

</details>

<details>

<summary>Problem 3</summary>

It will return some negative number, since `12345678` has less `6`'s than `45666678`. Note that there is no guarantee of what the negative number's value is, only that it is less than 0.

</details>

<details>

<summary>Problem 4</summary>

An object that implements `Comparable` can compare another object to itself, whereas a Comparator compares two objects other than itself. 

A good way to remember this is that a `Comparable` has an inherent property of being *able* *to be compared*, while a `Comparator` is an external source of truth.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous lecture: Inheritance II: Extends, type conversion and higher-order functions](/en/notes/cs61b/lecture-09) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Inheritance IV: Iterator and Object basic methods →](/en/notes/cs61b/lecture-11) | [🎬Watch this lecture on Bilibili (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) |
