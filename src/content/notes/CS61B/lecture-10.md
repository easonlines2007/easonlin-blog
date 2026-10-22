---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 10 · 继承 III：子类型多态、Comparable 与 Comparator：通用比较体系、自建
  Maximizer、Comparable 接口契约与策略模式
description: CS61B 第 10 讲：继承 III：子类型多态、Comparable 与 Comparator：通用比较体系、自建
  Maximizer、Comparable 接口契约与策略模式
topic: CS61B
order: 10
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 2: 继承与面向对象体系 (Inheritance, Interfaces & Subtyping)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：50:50 ｜ **官方原版**：Lecture 10 - Inheritance III Subtype Polymorphism Comparators Comparable  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1WpISEkGajVCwARZy6w-XDF5sofm1cITUhfAlPUnnnos) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/11.-subtype-polymorphism-comparators-comparable)  
> **快速导航**：[← 上一讲 (P09 继承 II：Extends、类型转换与高阶函数)](/notes/cs61b/lecture-09) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P11 继承 IV：迭代器与 Object 根基方法) →](/notes/cs61b/lecture-11)

---

## 1. 多态（Polymorphism）的三重境界：特设、参数化与子类型多态

*(参考时间：00:01:45 · [视频跳转 (P10 00:01:45)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=105))*

“Polymorphism”（多态）源自希腊语，意为“多种形态”。在现代程序设计语言理论中，多态主要划分为三种形式：

1. **特设多态（Ad-hoc Polymorphism / Method Overloading）**：
   - 同一个方法名对应不同参数类型的多套独立实现，编译器根据实参特征静态选派；
2. **参数化多态（Parametric Polymorphism / Generics）**：
   - 编写与具体类型无关的通用逻辑模板（如 `AList<Item>`），类型作为参数延迟指定；
3. **子类型多态（Subtype Polymorphism）**：
   - 允许子类对象伪装为父类或接口类型被统一对待，运行时根据真实类型执行特化行为。

本讲的核心任务，是利用子类型多态建立一套**通用的对象比较与极值检索体系**。

## 2. 现实挑战：通用算法 `Maximizer.max()` 的设计困境

*(参考时间：00:08:50 · [视频跳转 (P10 00:08:50)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=530))*

假设我们想编写一个通用的最大值检索工具 `Maximizer`，希望它不仅能寻找最大整数，还能寻找最大的狗、最大的字符串、最大的学生成绩。

初学者直觉会写：
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

### 为什么编译当场崩溃？
因为 Java 中的大于号 `>` 是专门为基本原始类型（`int`, `double` 等）定制的底层硬件指令。  
对于引用对象，两个 `Dog` 对象或两个 `String` 对象在物理上是内存地址指针，**Java 严禁在引用对象之间使用 `>` 或 `<` 运算符**！

我们必须建立一个能够表达“谁比谁更大”的通用面向对象契约。

## 3. `Comparable<T>` 接口契约与自然序（Natural Ordering）

*(参考时间：00:16:30 · [视频跳转 (P10 00:16:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=990))*

Java 标准库为我们提供了一个极其优雅的接口：`java.lang.Comparable<T>`。

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

### 让 `Dog` 实现 `Comparable<Dog>`
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

### 通用 `Maximizer.max()` 的完美实现
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
此时，任何实现了 `Comparable` 接口的对象数组，都可以直接放入 `Maximizer.max()` 检索极值！

## 4. 比较器接口 `Comparator<T>` 与策略模式（Strategy Pattern）

*(参考时间：00:25:00 · [视频跳转 (P10 00:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=1500))*

`Comparable` 虽好，但它有一个根本局限：**它只能定义一种内在固有的单一比较规则（称为自然序 Natural Order）**。

### 现实世界的复杂诉求
对于 `Dog` 类：
- 宠物医院可能希望按**体型大小（size）**从小到大排序；
- 犬类选美大赛可能希望按**名字的字母字典序（name）**进行排序；
- 训犬俱乐部可能希望按**敏捷度或年龄**排序。

如果我们把排序逻辑死死写在 `Dog` 的 `compareTo` 内部，我们就永远无法同时支持多种维度的比较！

### 解耦神器：`java.util.Comparator<T>` 策略模式
Java 提供了第二个比较接口——`Comparator<T>`，它代表一个**独立的第三方公正裁判员**：

```java
public interface Comparator<T> {
    public int compare(T o1, T o2);
}
```

## 5. 嵌套比较器类与 `Dog.getNameComparator()` 优雅实践

*(参考时间：00:33:15 · [视频跳转 (P10 00:33:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=1995))*

我们可以在 `Dog` 类内部优雅地定义嵌套的专用比较器，实现代码的高度内聚：

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

### 客户端灵活自如的策略切换
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

## 6. 泛型通配符与上限绑定（Upper Bounds）：`T extends Comparable<T>`

*(参考时间：00:41:40 · [视频跳转 (P10 00:41:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2500))*

在前面的 `Maximizer` 中，我们的返回类型是原始的 `Comparable`：
```java
Dog biggest = (Dog) Maximizer.max(dogs); // 必须丑陋地强制类型转换！
```
如果传入了一个装有未实现 `Comparable` 对象的数组，甚至会引发类型安全漏洞。

### 泛型上限限定（Bounded Generics）
我们利用泛型参数上限绑定，重构出类型完美的 `max`：

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
现在，客户端调用 `Dog big = Maximizer.max(dogs);` 时，编译器自动推断返回类型为 `Dog`，零强转，绝对类型安全！

## 7. 官方课件研讨题：Comparable 经典整数溢出漏洞陷阱

*(参考时间：00:48:30 · [视频跳转 (P10 00:48:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=2910))*

许多教材和程序员喜欢在 `compareTo` 中使用减法来偷懒：
```java
public int compareTo(Dog other) {
    return this.size - other.size; // 极其危险的暗礁！
}
```

### 惊心动魄的数值溢出灾难
假设 `this.size` 是一个极大的正数（如 `2,000,000,000`），而 `other.size` 是一个极小的负数（如 `-1,000,000,000`）。  
在数学上，`20亿 - (-10亿) = 30亿`，本应是一个正数。  
但是，32 位有符号整型 `int` 的最大上限仅为约 `21.47 亿`（`Integer.MAX_VALUE`）！  
相减结果发生**严重算术溢出（Integer Overflow）**，数值瞬间翻转为**负数**！  
导致程序得出一个荒谬绝伦的结论：“20 亿比 -10 亿还要小”！

### 工业级防溢出标准写法
**永远不要依赖相减来比较整数**！必须显式使用标准库的比较器：
```java
return Integer.compare(this.size, other.size);
```

## 8. 本讲总结与课后实战自测

*(参考时间：00:53:00 · [视频跳转 (P10 00:53:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10&t=3180))*

### `Comparable` 与 `Comparator` 核心对比全景

| 比较维度 | `java.lang.Comparable<T>` | `java.util.Comparator<T>` |
| :--- | :--- | :--- |
| **角色定义** | 实体自身内部的“天生默认大小” | 独立的外部“第三方裁判员” |
| **核心方法** | `public int compareTo(T other)` | `public int compare(T o1, T o2)` |
| **修改位置** | 必须修改实体类的源码以实现接口 | 无需触碰实体类源码，完全外置编写 |
| **规则数量** | 只能定义唯一个默认自然序 | 可以自由创建无限多个不同的策略比较器 |

---

### 课后综合自测题

#### 题目 1（代码实战：多维度比较器）
假设有学生类 `Student` 包含 `String name` 和 `double gpa`。请编写一个 `Comparator<Student>`，先按 GPA 降序排序；如果 GPA 相同，再按名字字母序升序排序。
**参考实现代码**：
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

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

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

**Subtype Polymorphism Example** Suppose we want to write a function `max()` that returns the max of any array regardless of type. If we write a method `max(Object[] items)`, where we use the ‘>’ operator to compare each element in the array, this will not work! Why is this the case?

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

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：继承 II：Extends、类型转换与高阶函数](/notes/cs61b/lecture-09) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：继承 IV：迭代器与 Object 根基方法 →](/notes/cs61b/lecture-11) | [🎬 在 B 站观看本讲 (P10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=10) |
