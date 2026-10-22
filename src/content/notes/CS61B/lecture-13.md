---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 13 · 期中复习：Midterm 1 核心考点沙盘与大题剖析：指针模型、动态分派矩阵、循环求和与类不变量工程排错
description: CS61B 第 13 讲：期中复习：Midterm 1 核心考点沙盘与大题剖析：指针模型、动态分派矩阵、循环求和与类不变量工程排错
topic: CS61B
order: 13
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 3: 算法渐进复杂度与不相交集 (Asymptotics & Disjoint Sets)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：52:35 ｜ **官方原版**：Lecture 13 - Midterm Review  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P13)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1XfRFqI5g6sM6LW2tWShnX-V2kVhBg6NJbIG6gvPtBn0)  
> **快速导航**：[← 上一讲 (P12 渐进分析 I：算法效率度量与大 O 阶梯)](/notes/cs61b/lecture-12) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P14 并查集 I：动态连通性与树形结构演进) →](/notes/cs61b/lecture-14)

---

## 1. Midterm 1 知识全景沙盘：从内存物理模型到接口多态

*(参考时间：00:01:10 · [视频跳转 (P13 00:01:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=70))*

CS 61B 的第一次期中考试（Midterm 1）是全学期难度最高、区分度最鲜明的关卡之一。它不仅考察基础语法，更聚焦于考查学生能否在脑海中建立**毫无漏洞的物理内存追踪心智模型（Mental Model Tracing）**。

### Midterm 1 四大黄金考点模块
1. **内存与指针模型（Pointers & Box-and-Pointer Diagrams）**：
   - 等号黄金法则、传值语义、堆栈生灭、对象别名（Aliasing）；
2. **链表与数组数据结构（SLList / DLList / AList）**：
   - 哨兵节点拓扑、循环双向链表指针倒接、几何扩容均摊时间；
3. **面向对象与类型多态（Inheritance & Dynamic Method Selection）**：
   - 静态类型 vs 动态类型、编译期两阶段签名解析、强制转型与重写迷局；
4. **渐进复杂度分析（Asymptotic Analysis）**：
   - 循环级数求和、最好/最坏情况边界推导。

## 2. 经典高频题型剖析一：指针跳跃与破坏性链表追踪

*(参考时间：00:09:40 · [视频跳转 (P13 00:09:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=580))*

这是历年 61B 期中考试的“保留杀手题”。考官会给出一组极其凌乱的指针重新赋值，要求画出内存图并写出最终拓扑：

```java
IntList L = new IntList(5, null);
L.rest = new IntList(10, null);
IntList Q = L.rest;
Q.rest = L;
L.rest = null;
```

### 追踪四部曲
1. `L` 指向堆中节点 A（`item: 5, rest: null`）；
2. `L.rest = new IntList(10, null)` 使节点 A 的 `rest` 指向堆中节点 B（`item: 10, rest: null`）；
3. `IntList Q = L.rest;`：`Q` 复制了节点 B 的内存地址，指向节点 B；
4. `Q.rest = L;`：节点 B 的 `rest` 指向了节点 A！
5. `L.rest = null;`：**致命断链！** 节点 A 的 `rest` 变为了 `null`！

### 最终拓扑检验
此时从 `Q` 出发能看到什么？
`Q (10) -> Q.rest (5) -> Q.rest.rest (null)`！  
原本通过 `L` 开头的链表，其头指针被重构到了 `Q` 上，且元素顺序发生了彻底翻转。在考试中，必须在草稿纸上精准绘制每个堆对象的矩形盒子与箭头，严禁靠纯脑力凭空想象！

## 3. 经典高频题型剖析二：动态方法分派全流程推演矩阵

*(参考时间：00:18:20 · [视频跳转 (P13 00:18:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=1100))*

期中考试中经典的“继承大题”通常包含 3 个类（如 `Grandpa`, `Dad`, `Son`），其中定义了若干同名但重载或重写的方法：

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

问：执行 `A obj = new B(); B param = new B(); obj.m(param);` 输出什么？

### 61B 考试满分推导公式表
严格分两步走，不可跳步：
1. **第一步（编译期看左边静态类型）**：
   - 调用者 `obj` 的静态类型是 `A`；
   - 参数 `param` 的静态类型是 `B`；
   - 在静态类型 `A` 中寻找最匹配签名：找到 `m(B b)`！
   - **锁定编译期签名：`m(B)`**！
2. **第二步（运行期看右边动态类型）**：
   - 调用者 `obj` 的真实动态类型是 `B`；
   - 查看类 `B` 是否实现了签名 `m(B)`；
   - 找到了！`B` 内部有 `public void m(B b) { System.out.println("B-B"); }`；
   - **最终输出：`B-B`**！

## 4. 经典高频题型剖析三：渐进复杂度嵌套循环大题解密

*(参考时间：00:27:00 · [视频跳转 (P13 00:27:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=1620))*

考官经常设计“外层几何增长、内层几何缩减”的复合陷阱循环：

```java
public static void f(int N) {
    for (int i = 1; i <= N; i *= 2) {
        for (int j = N; j > 0; j /= 2) {
            System.out.println("CS61B");
        }
    }
}
```

### 级数严密求解
- 外层循环：$i$ 从 1 开始翻倍直到 $N$，总共执行 $\approx \log_2 N$ 次；
- 内层循环：$j$ 从 $N$ 开始减半直到 1，总共执行 $\approx \log_2 N$ 次；
- 内外层变量 $i$ 与 $j$ 完全解耦，互不影响；
- 总执行次数：
  $$\text{Total} = \sum_{i=1}^{\log N} \log N = \log N \times \log N = \Theta((\log N)^2)$$
注意符号规范：写作 $\Theta(\log^2 N)$ 或 $\Theta((\log N)^2)$，绝不能写成 $\Theta(\log N^2)$（后者等于 $2 \log N$）。

## 5. 经典高频题型剖析四：类不变量与防御性拷贝设计实战

*(参考时间：00:36:15 · [视频跳转 (P13 00:36:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2175))*

期中设计大题往往要求在遵循特定不变量的前提下，手写一个紧凑的数据结构方法（例如双向链表的 `addMiddle` 或循环队列）。

### 必背解题套路：三步防御法
1. **更新前驱与后继的双向握手**：
   ```java
   newNode.prev = curr;
   newNode.next = curr.next;
   curr.next.prev = newNode;
   curr.next = newNode;
   ```
2. **空指针与哨兵验证**：
   若有哨兵节点，上述四行代码直接适用于任何空或非空场景；若无哨兵，必须补齐 `if (curr.next == null)` 等分支特判；
3. **维护状态计数**：
   千万不要遗漏 `size++;`！

## 6. 考试答题策略与考前自检清单

*(参考时间：00:44:30 · [视频跳转 (P13 00:44:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2670))*

### 考前核心锦囊
- **时间管理**：61B 考试题量庞大，平均每道大题只有 10-15 分钟。遇到卡壳的多态题先画图，超过 3 分钟果断标记跳过；
- **拒绝脑补**：Java 编译器的行为是完全确定性的，严格按照语言规则单步演算；
- **看清题目关键词**：注意题目要求是写破坏性（Destructive）还是非破坏性（Non-destructive）方法，要求时间是 $O(1)$ 还是 $O(N)$。

## 7. 伯克利期中真题实战一：Sans 的指针狂想曲（Spring 2021 Exam Q3）

*(参考时间：00:48:00 · [视频跳转 (P13 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=2880))*

### 题目还原（Spring 2021 Midterm 1）
考虑以下涉及链表指针重连的经典真题：
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
假设初始时链表为：`A(1) -> B(2) -> C(3) -> D(4) -> null`。  
问：执行 `Sans.mystery(A)` 之后，链表拓扑会发生什么？

### 深度逐步推演与陷阱分析
1. **第一轮循环启动**：`s` 指向 `A(1)`，`t` 指向 `s.next` 即 `B(2)`；
2. `s.next = t.next;`：让 `A.next` 指向 `C(3)`；
3. `t.next = s;`：让 `B.next` 指向 `A(1)`！（此时形成了 `B -> A -> C -> D`，成功交换了前两个节点！）；
4. `s = s.next;`：注意此时的 `s.next` 已经被第二步改成了 `C(3)`！因此 `s` 前进到了 `C(3)`；
5. **第二轮循环启动**：`s` 此时指向 `C(3)`，`t` 指向 `s.next` 即 `D(4)`；
6. `s.next = t.next;`：`C.next` 指向 `null`；
7. `t.next = s;`：`D.next` 指向 `C(3)`；
8. `s = s.next;`：`s` 变为 `null`，循环正常退出！

### 最终结果与思考：
节点成对两两翻转！原链表 `1 -> 2 -> 3 -> 4` 变成了两两互换结构。  
**考点精髓**：必须死死咬住**语句执行的时序**。当执行 `s = s.next` 时，`s.next` 指向的是已经被修改过后的内存地址，绝不能误以为它依然指向原来的 `B`！

## 8. 伯克利期中真题实战二：极度刁钻的 DMS 多态分派大题（Fall 2023 Exam Q4）

*(参考时间：00:52:00 · [视频跳转 (P13 00:52:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3120))*

### 题目还原（Fall 2023 Midterm 1）
考官给出了四个类的继承结构：
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

请判定下列调用的控制台输出：
```java
Bear b = new PolarBear();
PolarBear pb = new PolarBear();
Bear g = new Grizzly();

b.roar(pb);  // 调用 1
g.roar(b);   // 调用 2
```

### 满分两阶段推导演算：
#### 调用 1：`b.roar(pb)`
- **阶段一（编译期看左边静态类型）**：
  - 调用者 `b` 的静态类型：`Bear`；
  - 参数 `pb` 的静态类型：`PolarBear`；
  - 检查类 `Bear` 中有哪些方法能接收 `PolarBear`？
  - 类 `Bear` 只有一个方法：`public void roar(Bear b)`。由于 PolarBear 是 Bear 的子类，完全匹配！
  - **锁定编译期签名：`roar(Bear)`**！
- **阶段二（运行期看右边动态类型）**：
  - 调用者 `b` 的堆中真实动态类型：`PolarBear`；
  - 检查类 `PolarBear` 中是否重写了阶段一锁定的签名 `roar(Bear)`？
  - 找到了！`public void roar(Bear b) { System.out.println("Polar-Bear"); }`；
  - **输出结果**：`Polar-Bear`！

#### 调用 2：`g.roar(b)`
- 阶段一：`g` 静态类型 `Bear`，参数 `b` 静态类型 `Bear` $\to$ 锁定签名 `roar(Bear)`；
- 阶段二：`g` 动态类型 `Grizzly`，检查重写 $\to$ 执行 `Grizzly.roar(Bear)`；
- **输出结果**：`Grizzly-Bear`！

## 9. 伯克利期中真题实战三：DLList 与 AList 综合设计改造（Spring 2024 Midterm 1）

*(参考时间：00:56:00 · [视频跳转 (P13 00:56:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3360))*

### 题目设计要求
设计一个方法 `public void interleave(DLList other)`，将另一个双向链表 `other` 中的节点，**交错插入到当前链表 `this` 中**。要求：
1. 必须就地破坏性重接已有指针，不得使用 `new` 申请任何新节点；
2. 保持严格的双循环哨兵不变量，操作完成后 `other` 必须变成一个合法的空链表；
3. 时间复杂度为线性的 $\Theta(N)$。

### 工业级满分实现：
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
此题集双向指针握手、边界接驳与不变量清空于一身，是 61B 数据结构大题的终极试金石。

## 10. 伯克利期中真题实战四：递归二叉树路径求和（Spring 2024 Exam Q5）

*(参考时间：01:00:00 · [视频跳转 (P13 01:00:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13&t=3600))*

### 题目要求
给定一棵普通二叉树，每个节点保存一个整数 `int val`。编写一个静态方法 `public static boolean hasPathSum(IntTreeNode root, int targetSum)`，判断是否存在一条从根节点到任意叶子节点的路径，其沿途所有节点数值之和恰好等于 `targetSum`。

### 递归分治满分实现与基线条件防坑：
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
**考点提示**：很多学生在 `root == null` 时判断 `targetSum == 0`，导致只有单侧孩子的内部节点被错误判定为合法路径终点。必须显式检查叶子节点边界！

---

## 附录：官方课件核心考点与研讨全景 (In-Class Discussion & Problem Walkthroughs)

> **导读说明**：本节内容提炼自 UC Berkeley CS61B 官方幻灯片课件，收录了教授在课堂上深度互动的核心思考题、代码追踪题与期中总结考点。

### 官方课件全景研讨与逐题剖析 (Slide Questions & Exam Review)

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

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：渐进分析 I：算法效率度量与大 O 阶梯](/notes/cs61b/lecture-12) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：并查集 I：动态连通性与树形结构演进 →](/notes/cs61b/lecture-14) | [🎬 在 B 站观看本讲 (P13)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=13) |
