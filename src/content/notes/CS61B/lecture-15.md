---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 15 · 并查集 II：加权并查集、路径压缩与均摊分析：树高控制哲学、WQU 对数绑定数学证明、路径压缩与阿克曼反函数
description: CS61B 第 15 讲：并查集 II：加权并查集、路径压缩与均摊分析：树高控制哲学、WQU 对数绑定数学证明、路径压缩与阿克曼反函数
topic: CS61B
order: 15
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 3: 算法渐进复杂度与不相交集 (Asymptotics & Disjoint Sets)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：53:18 ｜ **官方原版**：Lecture 15 - Disjoint Sets + Asymptotics 2  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1zlmNjzu42WAEmyJFG2tYRZJIguExSFq5B__equ3-GaM) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/15.-asymptotics-ii)  
> **快速导航**：[← 上一讲 (P14 并查集 I：动态连通性与树形结构演进)](/notes/cs61b/lecture-14) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P16 树结构 I：二叉搜索树、操作实现与 Hibbard 删除) →](/notes/cs61b/lecture-16)

---

## 1. 树高控制哲学：为什么按元素规模加权（Weighting by Size）能压制树高？

*(参考时间：00:01:35 · [视频跳转 (P15 00:01:35)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=95))*

在上一讲的末尾，我们看到了 Quick Union 的阿喀琉斯之踵：盲目合并会导致树退化为细长竹竿，树高膨胀为 $N$。

要保证查找与合并的速度，**必须将树的高度（Tree Height）严格压制在最小限度**！

### 智能加权合并法则（Weighting Rule）
当合并两棵树时，不要随意决定谁当谁的父节点：
> **核心法则**：**永远记录每棵树包含的节点总数（Size），合并时，永远将较小的树挂到较大的树的根节点之下！**

```mermaid
graph TD
    subgraph Wrong ["朴素合并: 把大树挂到小树下 (树高剧增!)"]
        S1["小树 (size: 1)"] --> S2["大树根 (size: 100)"]
    end
    subgraph Smart ["加权合并: 把小树挂到大树根下 (树高几乎不变!)"]
        W1["大树根 (size: 100)"] --> W2["小树根 (size: 1)"]
    end
```
只有当两棵规模相当的树合并时，整体树高才可能增加 1。将小树合并到大树下，绝大多数节点的深度根本不会增加！

## 2. 加权快速并查集（Weighted Quick Union, WQU）的架构设计与巧妙实现

*(参考时间：00:10:00 · [视频跳转 (P15 00:10:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=600))*

我们如何记录每棵树的大小？难道要新建一个 `int[] size` 数组吗？

算法大师 Robert Sedgewick 提出了一个震惊业界的**“空间复用极简技巧”**：  
**仅用单个 `parent` 数组，同时表达父指针与树大小！**

### 负数编码法则
- 如果 `parent[i] >= 0`：表示节点 $i$ 是普通子节点，其值为父节点的索引；
- **如果 `parent[i] < 0`**：表示节点 $i$ 本身就是一棵树的**根节点**！  
  并且，**其数值的绝对值 $|parent[i]|$，恰好等于这棵树所包含的节点总数**！
  - 例如 `parent[3] == -5`，表示 3 是根节点，且这棵树共有 5 个节点。

```java
public class WeightedQuickUnionDS implements DisjointSets {
    private int[] parent;

    public WeightedQuickUnionDS(int N) {
        parent = new int[N];
        for (int i = 0; i < N; i++) {
            parent[i] = -1; // 每个节点都是根节点，且初始大小为 1
        }
    }

    private int find(int p) {
        while (parent[p] >= 0) {
            p = parent[p];
        }
        return p;
    }

    @Override
    public boolean isConnected(int p, int q) {
        return find(p) == find(q);
    }

    @Override
    public void connect(int p, int q) {
        int rootP = find(p);
        int rootQ = find(q);
        if (rootP == rootQ) return;

        // parent 保存的是负数，因此数值越小，绝对值越大，规模越大！
        if (parent[rootP] <= parent[rootQ]) {
            // rootP 所在的树更大或相等：将 rootQ 挂到 rootP 下
            parent[rootP] += parent[rootQ]; // 累加树的规模
            parent[rootQ] = rootP;          // rootQ 认 rootP 为父
        } else {
            // rootQ 所在的树更大：将 rootP 挂到 rootQ 下
            parent[rootQ] += parent[rootP];
            parent[rootP] = rootQ;
        }
    }
}
```

## 3. 树高度对数绑定的严格数学证明：为什么高度永不超过 $\lfloor\log_2 N\rfloor + 1$？

*(参考时间：00:19:15 · [视频跳转 (P15 00:19:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=1155))*

加权规则到底将树高压制到了何种程度？我们给出计算机科学中极其经典的**对数高度定理证明**。

### 定理：
> 包含 $N$ 个元素的加权快速并查集（Weighted Quick Union），其生成的任何树的最大高度 $H$ 满足：
> $$H \le \lfloor\log_2 N\rfloor + 1 = O(\log N)$$

### 严密数学证明（通过倍增反证）：
1. 思考：对于任意一个节点 $x$，它的**深度（Depth）在什么情况下才会增加 1**？
2. 唯有一种可能：当包含 $x$ 的树 $T_1$，被作为小树挂到了另一棵树 $T_2$ 之下时，节点 $x$ 的深度增加 1；
3. 根据加权合并铁律，能够收纳 $T_1$ 的树 $T_2$，其规模必然满足：
   $$\text{Size}(T_2) \ge \text{Size}(T_1)$$
4. 因此，合并之后形成的新树 $T_{\text{new}}$ 的规模至少是：
   $$\text{Size}(T_{\text{new}}) = \text{Size}(T_1) + \text{Size}(T_2) \ge 2 \times \text{Size}(T_1)$$
5. **核心结论**：**一个节点的深度每增加 1，包含它的集合的节点总数至少翻一倍（Multiply by 2）！**
6. 集合总节点数最多只有 $N$ 个。从大小 1 开始不断翻倍，最多能翻倍多少次？
   $$1 \times 2 \times 2 \times \dots \times 2 \le N \implies 2^{\text{Depth}} \le N \implies \text{Depth} \le \log_2 N$$

**证毕**：加权合并彻底打破了细长竹竿树的诅咒，将树高牢牢锁死在对数 $O(\log N)$ 范围之内！单次操作最坏耗时仅需几十纳秒。

## 4. 终极加速神技：路径压缩（Path Compression）机制

*(参考时间：00:28:30 · [视频跳转 (P15 00:28:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=1710))*

对数复杂度 $O(\log N)$ 已经极其优秀，但计算机先驱们并未就此止步。他们提出了一个惊世骇俗的就地优化技法——**路径压缩（Path Compression）**。

### 核心洞察：顺手牵羊的扁平化
当我们在调用 `find(p)` 向上寻找根节点时，沿途访问了许多祖先节点：
```text
p -> a -> b -> c -> ROOT
```
既然我们历尽艰辛最终已经知道了真正的宇宙根节点是 `ROOT`，**为什么不顺手把沿途经过的所有节点全部直接挂到 `ROOT` 之下呢？**

```mermaid
graph TD
    subgraph Before ["查找 find(p) 之前: 细长链条"]
        R((ROOT))
        C((c)) --> R
        B((b)) --> C
        A((a)) --> B
        P((p)) --> A
    end
    subgraph After ["查找 find(p) 之后: 路径瞬间全量扁平化!"]
        R2((ROOT))
        C2((c)) --> R2
        B2((b)) --> R2
        A2((a)) --> R2
        P2((p)) --> R2
    end
```

### 极致优雅的两行递归实现
```java
private int find(int p) {
    if (parent[p] < 0) {
        return p; // 到达根节点
    }
    // 递归查找根节点，并在回溯时直接将父指针重写为根节点！
    parent[p] = find(parent[p]);
    return parent[p];
}
```
经过一次 `find(p)` 调用之后，整条查询路径上的所有节点瞬间被“压扁”！后续对这些节点的查询将直接命中根节点，耗时仅需 $\Theta(1)$！

## 5. 阿克曼反函数（Inverse Ackermann Function $\alpha(N)$）：近乎神迹的均摊常数时间

*(参考时间：00:37:10 · [视频跳转 (P15 00:37:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=2230))*

当加权规则（WQU）与路径压缩（Path Compression）两相结合，其单次操作的均摊复杂度达到了计算机科学史上的巅峰之一。

图灵奖得主 Robert Tarjan 在 1975 年发表了震惊世界的证明：
> **Tarjan 定理**：  
> 对于包含 $N$ 个元素的加权路径压缩并查集，任意连续 $M$ 次操作的总时间复杂度为：
> $$O(M \cdot \alpha(N))$$
> 其中 $\alpha(N)$ 是著名的**阿克曼反函数（Inverse Ackermann Function）**。

### 阿克曼反函数增长有多缓慢？
阿克曼函数 $A(x, y)$ 是数学中增长极其狂暴的超递归函数。而它的反函数 $\alpha(N)$ 则是人类数学中增长最为迟缓的函数：
- 当 $N = 3$ 时，$\alpha(N) = 1$；
- 当 $N = 7$ 时，$\alpha(N) = 2$；
- 当 $N = 2047$ 时，$\alpha(N) = 3$；
- 当 $N = 2^{2048}$（一个远超全已知宇宙中所有原子总数 $10^{80}$ 的天文数字）时，**$\alpha(N)$ 依然小于 5**！

**工程结论**：在全宇宙人类能遇到的任何物理数据规模下，$\alpha(N) \le 4$。因此，加权路径压缩并查集的均摊单次耗时**在物理实际上完全等同于绝对的常数时间 $O(1)$**！

## 6. 并查集四代演进全景天梯榜

*(参考时间：00:44:30 · [视频跳转 (P15 00:44:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=2670))*

### 四代算法时空复杂度全景矩阵

| 演化代际 | 核心数据拓扑 | `isConnected` 最坏复杂度 | `connect` 最坏复杂度 | 均摊时间表现 |
| :--- | :--- | :--- | :--- | :--- |
| **第一代：Quick Find** | 平铺数组记录 Set ID | $\Theta(1)$ | $\Theta(N)$ | 较差，写操作瓶颈严重 |
| **第二代：Quick Union** | 任意树形森林 | $O(N)$ (最坏退化竹竿) | $O(N)$ (最坏退化竹竿) | 极不稳定，极易退化 |
| **第三代：Weighted QU** | 加权树形森林 (小挂大) | $O(\log N)$ (严格保证) | $O(\log N)$ (严格保证) | 极其优异，稳定对数 |
| **第四代：WQU + 路径压缩** | 加权极度扁平森林 | $O(\alpha(N))$ | $O(\alpha(N))$ | **近乎绝对常数 $O(1)$** |

### 经典工业应用
- **网络动态连通性**：判断互联网骨干路由器集群的通断状态；
- **最小生成树 Kruskal 算法**：贪心挑选边并用并查集进行瞬时环路检测（Cycle Detection）；
- **计算机视觉与图像分割**：快速寻找相邻像素的连通域（Blob Detection）。

## 7. 本讲总结与课后综合实战自测题

*(参考时间：00:51:00 · [视频跳转 (P15 00:51:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15&t=3060))*

### 课后综合自测题

#### 题目 1（负数父指针追踪）
对于采用负数编码的 WQU 结构，若当前 `parent` 数组状态为：
`parent[0] = -4`, `parent[1] = 0`, `parent[2] = 0`, `parent[3] = 0`, `parent[4] = -2`, `parent[5] = 4`。
现在调用 `connect(1, 5)`，请分析：
1. 谁将成为最终的合并根节点？
2. `parent[0]` 与 `parent[4]` 的值分别变为多少？
**答案与详细解析**：  
1. `find(1)` 顺着指针找到根节点为 0（规模为 $|-4| = 4$）；  
2. `find(5)` 找到根节点为 4（规模为 $|-2| = 2$）；  
3. 比较规模：根节点 0 的规模为 4，大于根节点 4 的规模 2。因此**小树根 4 将挂到大树根 0 之下**，最终的合并根节点是 **0**！  
4. 状态更新：  
   - `parent[0] += parent[4]` $\implies$ `-4 + (-2) = -6`（合并后大树总规模扩增到 6）；  
   - `parent[4] = 0`（节点 4 认 0 为父）。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 15. Asymptotics II

There's no magic shortcut.

This chapter covers various asymptotic analysis examples, which provide useful insights on how to analyze the efficiency of algorithms.

---

## 15.1 For Loops

Count, count, count...

Now that we've seen some runtime analysis, let's work through some more difficult examples. Our goal is to get some practice with the patterns and methods involved in runtime analysis. This can be a tricky idea to get a handle on, so the more practice the better.

### Example One: 

Last time, we saw the function dup1, that checks for the first time any entry is duplicated in a list:

```java

int N = A.length;

for (int i = 0; i < N; i += 1)

   for (int j = i + 1; j < N; j += 1)

      if (A[i] == A[j])

         return true;

return false;

```

We have two ways of approaching our runtime analysis:

1. Counting number of operations

2. Geometric visualization

#### Method 1: Count Number of Operations

Since the main repeating operation is the comparator, we will count the number of **"=="** operations that must occur. 

The first time through the outer loop, the inner loop will run $$N-1$$times. The second time, it will run $$N-2$$ times. Then $$N-3$$, $$N-4$$, .... all the way till running the inner loop exactly $$1$$ time when i = $$N - 1$$. In the worst case, we have to go through every entry, and the outer loop runs $$N$$ times. 

Then, let $$C$$ =  total number of "==" operations that have occurred. The number of comparisons is: 

$$
C = 1 + 2 + 3 + ... + (N - 3) + (N - 2) + (N - 1) = N(N-1)/2
$$

where $$N(N-1)/2$$ is part of the $$N^2$$ family. 

Since "==" is a constant time operation, the overall runtime in the worst case is $$\theta(N^2)$$.

#### Method 2: Geometric Visualization

We can also approach this from a geometric view. 

Let's draw out when we use == operations in the grid of $$i,j$$combinations:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FDsJ9qehbAbw6DgTbN5Az%2Fimage.png?alt=media\&token=8c564090-f2cc-4f67-9f27-bb92e08f13f8)

We see that the number of == operations is the same as the *area* of a right triangle with a side length of $$N - 1$$. Since area is in the $$N^2$$​​ family, we see again that the overall runtime is $$\theta(N^2)$$.

### Example 2: 

Let's look at a more involved example next. Consider the following function, with similar nested for loops:

```java

public static void printParty(int N) {

   for (int i = 1; i <= N; i = i * 2) {

      for (int j = 0; j < i; j += 1) {

         System.out.println("hello");   

         int ZUG = 1 + 1;

      }

   }

}

```

The outer loop advances by *multiplying* `i` by 2 each time. The inner loop runs from 0 to the current value of `i`. The two operations inside the loop are both constant time, so let's approach this by asking **"how many times does this print out "hello" for a given value of N?"**

Our visualization tool from above helped us see dup1's runtime, so let's use a similar approach here. We'll lay out the grid for the nested for loops, and then track the total number of print statements needed for a given N below.

If N is 1, then `i` only reaches 1, and `j` is only 0, since 0 < 1. So there is only one print statement:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FdR1Xf01Y7Mvx8292Mdsa%2Fimage.png?alt=media&amp;token=9cf5c76c-cb5f-4925-85ba-751d192c59db" alt=""><figcaption><p>Visualizations when N = 1</p></figcaption></figure>

If N is 2, the next time through the loop `i` will be $$1\cdot 2 = 2,$$ and `j` can reach 1. The total number of print statements will be 3 = 1 (from first loop) + 2 (from second loop).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FVvv9X10OtfTm8gXy0o3h%2Fimage.png?alt=media&amp;token=ec6ad3d7-852c-43ec-9cc1-e210b8485745" alt=""><figcaption><p>Visualizations when N = 2</p></figcaption></figure>

<details>

<summary>Conceptual Check: What happens when N = 3? </summary>

After the second loop, $$i = 2 \cdot  2 = 4$$, which is greater than $$N$$, so the outer loop does not continue, and ends after `i = 2`, just like N = 2 did. 

N = 3 will have the same number of print statements as N = 2.

The next change is at N=4, where there will be 4 prints when i = 4, 3 prints when i = 2, and 1 print when i = 1 (remember `i` never equals 3). So a total of 7.

<img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F6aus4ZQAyJ1Vr79bnyNB%2Fimage.png?alt=media&amp;token=bb089b3d-ff41-41db-ac0a-e8942cafaec4" alt="" data-size="original">

</details>

 We can keep filling out our diagram to get a fuller picture. Here it is up to N = 18:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FqkNIs1zrUHi4hPTgdLwc%2Fimage.png?alt=media&amp;token=f6fc58ca-3bb7-4811-ad77-daca82fa81f5" alt=""><figcaption><p>Visualizations for N = 18</p></figcaption></figure>

What we see, if we add up all the counts at each stage of the loops, is that the number of print statements is:

$$
C(N) = 1 + 2 + 4 + ... + N
$$

(if N is a power of 2).

Again, we can think of this in two ways. Since we're already on a graphical roll, let's start there. 

#### Method 1: Finding the Bound Visually 

If we graph the trajectory of 0.5 N (lower dashed line), and 4N (upper dashed line), and $$C(N)$$ itself (the red staircase line), we see that C(N) is fully bounded between those two dashed lines.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FbiPQHu9SrZOoYckVIM4q%2Fimage.png?alt=media&amp;token=9cfb5a0c-ccca-40ec-a0b9-8a2152433e22" alt=""><figcaption></figcaption></figure>

Therefore, the runtime (by definition) must also be linear: $$\theta(N)$$.

#### Method 2: Finding the Bound Mathematically

We can obtain the same result by solving our equation from above with the power of mathematics:

$$
C(N) = 1 + 2 + 4 + ... + N = 2N - 1
$$

 Again if N is a power of 2. 

For example, if $$N = 8$$ : 

$$
C(N) = 1 + 2 + 4 + 8 = 15 = 2\cdot 8 - 1
$$

And by removing lesser terms and multiplicative constants, we know that $$2N - 1$$ is in the linear family, so the runtime is $$\theta(N)$$.

We now get a more exact value to the red-staircase line plotted below, which is $$2N$$.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FWzAYCEhAEZHB1RufVlKb%2Fimage.png?alt=media&amp;token=76a87a2e-4e3f-4a8b-b8ef-2b3ff3b46daf" alt=""><figcaption><p>Graph of 2N, bounded by 0.5N and 4N</p></figcaption></figure>

### Techniques: No Magic Shortcuts

It would be really nice if there were some magic way to look at an algorithm and just *know* its runtime. And it would be even nicer if all nested for loops have a runtime of $$N^2$$ .

Unfortunately, they're not. And we know this because we just did two nested for loop examples above, each with *different* runtimes.

In the end, there is **no shortcut** to doing runtime analysis. It requires careful thought. But there are a few useful techniques and things to know:

* **Find exact sum**

* **Write out examples**

* **Draw pictures**

We used each of these techniques above.

Also used in the examples above are two important sums you'll see very often: 

* **Sum of First Natural Numbers**: $$1+2+3+...+Q=Q(Q+1)/2=Θ(Q ​2 ​​ )$$

* **Sum of First Powers of 2**: $$1+2+4+8+...+Q=2Q−1=Θ(Q)$$

You saw both of these above, and they'll return again and again in runtime analysis.

---

## 15.2 Recursion

Here we go again...

Now that we've done a couple of nested for loops, let's take a look at our favorite problem: recursion. 

Consider the recursive function `f3` below:

```java

public static int f3(int n) {

   if (n <= 1) 

      return 1;

   return f3(n-1) + f3(n-1);

}

```

##### What does this function do?

Let's think of an example of calling `f3(4)`:

* The first call will return  `f3(4-1) + f3(4-1)` 

* Each `f3(3-1)` call will branch out to `f3(2-1) + f3(2-1)`

* Then for each  `f3(2-1)` call, the condition `if (n <= 1)` will be true, which will return 1.

* What we observe at the end is that 1 will be returned 8 times, meaning we have `f3(2-1)` summed 8 times.

* Therefore,`f3(4)`will return 8.

We can visualize this as a tree, where each level represents a recursive call and each node value represents the argument to the function :

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FS35bGr6MiaNCfbwHM90x%2Fimage.png?alt=media&amp;token=ce4b3450-369a-4c5e-b7aa-913ec081648b" alt=""><figcaption><p>Visualization of f3's recursive calls</p></figcaption></figure>

You can do a couple more examples, and see that this function returns $$2^N-1$$​ . Visualizing the recursive calls is extremely useful for getting a sense of what the function is doing, and we will discuss a few methods of determining runtime in recursive functions.

#### Method 1: Intuition

Based on the visualization below, we can notice that every time we add one to `n` we double the amount of work that has to be done:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F888CQe1RDaq5NifxR1OL%2Fimage.png?alt=media&amp;token=df69fec4-da44-40d8-9563-1410bb9ca2ce" alt=""><figcaption></figcaption></figure>

Then, adding one to `n` N times means doubling the amount of work N times, which results in the intuitive answer for runtime to be $$2^N$$.

#### Method 2: Algebra

Another way to approach this problem is to count the number of calls to `f3` involved. Utilizing the same tree visualization above, we can see that the number of calls to f3 at each recursive level is equivalent to *the number of nodes at each recursive level* of the tree. For instance, the number of calls we made to `f3` at the top level is 1, at the second level is 2, at the third level is 4, etc. 

The total number of calls to f3 then is the **sum** of the number of nodes at each recursive level, which can be expressed as the equation below: 

$$
C(N)=1+2+4+...+2^{N-1}
$$

Applying the formula we saw earlier for the sum of the first powers of 2: 

$$
1+2+4+8+...+Q=2Q−1
$$

Substituting $$Q$$ with $$2^{N-1}$$, we get:

$$
C(N)=2Q−1=2(2^{N-1})-1=2^N-1

​

​​
$$

The work during *each call* is constant , so the overall runtime for `f3` is $$\theta(2^N)$$.

#### Method 3: Recurrence Relation (Out of Scope)

This method is not required reading and is outside of the course scope, but worth mentioning for interest's sake.

We can use a "recurrence relation" to count the number of calls, instead of an algebraic approach. This looks like:

$$
C(1)=1 C(N) = 2C(N-1) + 1
$$

Expanding this out with a method we will not go over but you can read about in the slides or online, we reach a similar sum to the one above. We can then again reduce it to $$2^N - 1$$ , reaching the same result of $$\theta(2^N)$$.

---

## 15.3 Binary Search

hi-lo!

Binary Search Introduction

Getting Familiar with Binary Search



Binary search is a nice way of searching a list for a particular item. It requires the list to be in sorted order and uses that fact to find an element quickly.

To do a binary search, we start in the middle of the list, and check if that's our desired element. If not, we ask: is this element bigger or smaller than our element?

If it's bigger, then we know we only have to look at the half of the list with smaller elements. If it's too small, then we only look at the half with bigger elements. In this way, we can cut in half the number of options we have left at each step, until we find our target element.

What's the worst possible case? When the element we want isn't in the list at all. Then we will make comparisons until we've eliminated all regions of the list, and there are no more bigger or smaller halves left.

For an animation of binary search, see [these slides.](https://docs.google.com/presentation/d/1P4HKmsO3Aaugv7_U16jJN0UbfTEJi1uZUdi_WbIIGe0/edit#slide=id.g463de7561_042)

What's the intuitive runtime of binary search? Take a minute and use the tools you know to consider this.

We start with $$N$$ options, then $$N/2$$, then $$N/4$$ ... until we have just 1. Each time, we cut the array in half, so in the end we must perform a total of $$log\_{2}(N)$$operations. Each of the $$log\_{2}(N)$$ operations, eg. finding the middle element and comparing with it, takes constant time. So the overall runtime then is order $$log\_{2}(N)$$.

It's important to note, however that each step doesn't cut it *exactly* in half. If the array is of even length, and there is no 'middle', we have to take either a smaller or a larger portion. But this is a good intuitive approach.

We'll do a precise way next.

A more precise analysis of Binary Search runtime



To precisely calculate the runtime of binary search, we'll count the number of operations, just as we've done previously.

First, we define our cost model: let's use the number of recursive binary search calls. Since the number of operations inside each call is constant, the number of calls will be the only thing varying based on the size of the input, so it's a good cost model.

Like we've seen before, let's do some example counts for specific $$N$$. As an exercise, try to fill this table in before continuing:

<table><thead><tr><th width="97">N</th><th width="100">1</th><th width="100">2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th></tr></thead><tbody><tr><td><strong>Count</strong></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></tbody></table>

Alright, here's the result:

<table><thead><tr><th>N</th><th width="100">1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th><th>13</th></tr></thead><tbody><tr><td><strong>Count</strong></td><td>1</td><td>2</td><td>2</td><td>3</td><td>3</td><td>3</td><td>3</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td><td>4</td></tr></tbody></table>

These seems to support our intuition above of $$log\_{2}(N)$$. We can see that the count seems to increase by one only when $$N$$ hits a power of 2.

...but we can be even more precise: $$C(N)=\lfloor log\_{2}(N)\rfloor +1$$ (These L-shaped bars are the "floor" function, which is the result of the expression rounded down to the nearest integer.)

A couple properties worth knowing (see below for proofs): 

* $$\lfloor f(N) \rfloor=\Theta(f(N))$$

* $$\lceil f(N) \rceil=\Theta(f(N))$$

* $$log\_{p}(N) = \Theta(log\_{q}(N))$$

The last one essentially states that for logarithmic runtimes, the base of the logarithm doesn't matter at all, because they are all equivalent in terms of Big-O (this can be seen by applying the logarithm change of base). Applying these simplifications, we see that $$\Theta(\lfloor log\_{2}(N)\rfloor=\Theta(log(N))$$ just as we expected from our intuition.

**Example Proof:** Prove $$\lfloor f(N) \rfloor=\Theta(f(N))$$

**Solution:** 

We start with the following inequality:

$$
f(N) - \frac{1}{2}\<f(N)\le \lfloor f(N) + \frac{1}{2} \rfloor \le f(N) + \frac{1}{2}
$$

Simplifying $$f(N)-\frac{1}{2}$$ and $$f(N)+\frac{1}{2}$$ according to our big theta rules by dropping the constants, we see that they are of order $$f(N)$$. Therefore $$\lfloor f(N) + \frac{1}{2} \rfloor$$ is bounded by two expressions of order $$f(N)$$, and is therefore also $$\Theta(f(N))$$.

**Exercise:** 

* Prove $$\lceil f(N) \rceil=\Theta(f(N))$$

* Prove $$log\_{p}(N) = \Theta(log\_{q}(N))$$

**One cool fact to wrap up with:** Log time is super good! It's almost as fast as constant time, and way better than linear time. This is why we like binary search, rather than stepping one by one through our list and looking for the right thing.

To show this concretely:

| $$N$$               | $$log\_{2}(N)$$ | Typical runtime (nanoseconds) |

| ------------------- | --------------- | ----------------------------- |

| 100                 | 6.6             | 1                             |

| 100,000             | 16.6            | 2.5                           |

| 100,000,000         | 26.5            | 4                             |

| 100,000,000,000     | 36.5            | 5.5                           |

| 100,000,000,000,000 | 46.5            | 7                             |

The input size increase by a factor of 1 trillion but the runtime only inceased by a factor of about 7! This shows how remarkable $$log(N)$$ runtime is especially for large size inputs.

<br>

---

## 15.4 Mergesort

In our last example, we'll analyze merge sort, another cool sorting algorithm.

Mergesort basics: merging two sorted lists.



First, let's remind ourselves of selection sort, which we will initially use as a building block for merge sort.

Selection sort works off two basic steps:

* Find the smallest item among the unsorted items, move it to the front, and ‘fix’ it in place.

* Sort the remaining unsorted/unfixed items using selection sort.

If we analyze selection sort, we see that its runtime is $$\Theta(N^2)$$.

**Exercise:** To convince yourself that selection sort has $$\Theta(N^2)$$ runtime, work through the geometric approach (try drawing out the state of the list at every sort call), or count the operations.

Let's introduce one other idea here: **arbitrary units of time**. While the exact time something will take will depend on the machine, on the particular operations, etc., we can get a general sense of time through our arbitrary units (AU).

If we run an $$N=6$$ selection sort, and the runtime is of order $$N^2$$​​, it will take \~36 AU to run. If $$N=64$$, it'll take \~2048 AU to run. Now we don't know if that's 2048 nanoseconds, or seconds, or years, but we can get a relative sense of the time needed for each size of $$N$$.

Hold onto this thought for later analysis.

Now that we have selection sort, let's talk about **merging.**

Say we have two **sorted** arrays that we want to combine into a single big sorted array. We could append one to the other, and then re-sort it, but that doesn't make use of the fact that each individual array is already sorted. How can we use this to our advantage?

It turns out, we can merge them more quickly using the sorted property. The smallest element must be at the start of one of the two lists. So let's compare those, and put the smallest element at the start of our new list.

Now, the next smallest element has to be at the new start of one of the two lists. We can continue comparing the first two elements and moving the smallest into place until one list is empty, then copy the rest of the other list over into the end of the new list.

To see an animation of this idea, [go here](https://docs.google.com/presentation/d/1mdCppuWQfKG5JUBHAMHPgbSv326JtCi5mvjH1-6XcMw/edit#slide=id.g463de7561_042).

What is the runtime of the merge operation? We can use the number of "write" operations to the new list as our cost model, and count the operations. Since we have to write each element of each list only once, the runtime is $$\Theta(N)$$.

Selection sort is slow, and merging is fast. How do we combine these to make sorting faster?

A closer look at Mergesort



We noticed earlier that doing selection sort on an $$N=64$$ list will take \~2048 AU. But if we sort a list half that big, $$N=32$$, it only takes \~512 AU. That's more than twice as fast! So making the arrays we sort smaller has big time savings.

Having two sorted arrays is a good step, but we need to put them together. Luckily, we have merge. Merge, being of linear runtime, only takes \~64 AU. So in total, splitting it in half, sorting, then merging, only takes 512 + 512 + 64 = 1088 AU. Faster than selection sorting the whole array. But how much faster?

Now, AUs aren't real units, but they're sometimes easier and more intuitive than looking at the runtime. The runtime for our split-in-half-then-merge-them sort is $$N+2(\frac{N}{2})^2$$​​, which is about half of $$N^2$$ for selection sort. However, they are still both $$\Theta(N^2)$$.

What if we halved the arrays again? Will it get better? Yes! If we do two layers of merges, starting with lists of size $$\frac{N}{4}$$, the total time will be \~640 AU.

**Exercise:** Show why the time is \~640AU by calculating the time to sort each sub-list and then merge them into one array.

What if we halved it again? And again? And again?

Eventually we'll reach lists of size 1. At that point, we don't even have to use selection sort, because a list with one element is already sorted.

This is the essence of **merge sort:**

* If the list is size 1, return. Otherwise:

* Mergesort the left half

* Mergesort the right half

* Merge the results

So what's the running time of **merge sort**?

We know merge itself is order $$N$$, so we can start by looking at each layer of merging:

* To get the top layer: merge \~64 elements = 64 AU

* Second layer: merge \~32 elements, twice = 64 AU

* Third layer: \~16\*4 = 64 AU

* ...

Overall runtime in AU is \~64\*k, where $$k$$ is the number of layers. Here,  $$k=log\_{2}(64)=6$$, so the overall cost of mergesort is \~384 AU.

Now, we saw earlier that splitting up more layers was faster, but still order $$N^2$$​​. Is merge sort faster than $$N^2$$​​?

Yes!\

Mergesort has worst case runtime $$\Theta(N\cdot log(N))$$.

* The top level takes \~N AU.

* Next level takes \~N/2 + \~N/2 = \~N.

* One more level down: \~N/4 + \~N/4 + \~N/4 + \~N/4 = \~N.

Thus, total runtime is \~Nk, where $$k$$ is the number of levels.

How many levels are there? We split the array until it is length 1, so $$k=log\_{2}(N)$$. Thus the overall runtime is $$\Theta(N\cdot log(N))$$.

**Exercise:** Use exact counts to argue for $$\Theta(N\cdot log(N))$$. Account for cases where we cannot divide the list perfectly in half.

So is $$\Theta(N*log(N))$$ actually better than $$\Theta(N^2)$$? Yes! It turns out $$\Theta(N*log(N))$$ is not much slower than linear time.

![timing\_table\_for\_runtimes](https://joshhug.gitbooks.io/hug61b/content/assets/timetable.png)

---

## 15.5 Summary

Wrapping up our asymptotics adventures.

#### **Takeaways**

* There are no magic shortcuts for analyzing code runtime.

* In our course, it’s OK to do exact counting or intuitive analysis.

* Know how to sum 1 + 2 + 3 + ... + N and 1 + 2 + 4 + ... + N.

* We won’t be writing mathematical proofs in this class.

* Many runtime problems you’ll do in this class resemble one of the five problems from today. 

* This topic has one of the highest skill ceilings of all topics in the course. All the tools are here, but **practice** is your friend!

* Different solutions to the same problem, e.g. sorting, may have different runtimes (with big enough differences for the runtime to go from impractical to practical!).

* $$N^2$$​​ vs. $$Nlog(N)$$ is an enormous difference.

* Going from $$Nlog(N)$$ to $$N$$ is nice, but not a radical change.

Hopefully, this set of examples has provided some good practice with the techniques and patterns of runtime analysis. You can also find extra practice problems in the next section. Remember, there are no magic shortcuts, but you have to tools to approach the problems. Go forth and analyze!!

---

## 15.6 Exercises

Doing more practices is the best way to gain intuition when it comes to asymptotics!

### Factual

1. Prove that $$\Theta(\log \_{2} n) = \Theta(\log \_{3} n)$$.

2. What is the runtime of the following function?

```java

public static int f(int n) {

    if (n <= 1) {

        return 0;

    }

    return f(n - 1) + f(n - 1) + f(n - 1);

}

```

<details>

<summary>Problem 1</summary>

Using the properties of logs, we see that $$\log\_2 n = \frac{\log n}{\log 2} = \Theta(\log n)$$. Similarly, $$\log\_3 n = \frac{\log n}{\log 3} = \Theta(\log n)$$. So when consiering asymptotics relating to logarithms, the base does not matter (as long as it is some constant).

</details>

<details>

<summary>Problem 2</summary>

This is essentially `fib` with 3 recursive calls instead of 2. The runtime is $$\Theta(3^n)$$.

</details>

### Procedural

1. Find the runtime of running `print_fib` with for arbitrarily large n.

```java

public void print_fib(int n) {

   for (int i = 0; i < n; i++) {

       System.out.println(fib(i));

   }

}

public int fib(int n){

   if (n <= 0) {

     return 0;

   } else if (n == 1) {

     return 1;

   } else {

     return fib(n-1) + fib(n-2);

   }

}

```

2. Do the above problem again, but change the body of the for loop in `print_fib` to be:

```java

 System.out.println(fib(n));

```

3. Find the runtime of the function `f` on an input of size `n`, given the `createArray` function as described below:

```java

public static void f(int n) {

    if (n == 1) {

        return;

    }

    f(n / 2);

    f(n / 2);

    createArray(n);

}

public int[] createArray(int Q) {

    int[] x = new int[Q];

    for (int i = 0; i < x.length; i++) {

        x[i] = i;

    }

    return x;

}

```

4. [Problem 8](https://drive.google.com/file/d/1Vo8p4vbOGt7eY5TtalvAEnk4ignpTVvm/view?usp=sharing) from the Spring 2018 Midterm 2

5. [Problem 4](https://drive.google.com/file/d/1yWyRp7QTizspTp9dsKz5yxE6bSf9YUIi/view?usp=sharing) from the Spring 2017 Midterm 2

<details>

<summary>Problem 1</summary>

From lecture, we know that `fib(i)` runs in roughly $$2^i$$ time. If we run `fib` for each `i` from `1` to `n`, we get a total work of $$2^0 + 2^1 + ... 2^n$$. Note that this is a geometric sum with last term $$2^n$$, so the overall runtime is actually still $$\Theta(2^n)$$.

</details>

<details>

<summary>Problem 2</summary>

Again, we know that `fib(i)` takes about $$2^i$$ time. However, this time we call `fib(n)` each time in the loop `n` total times. This gives a runtime of $$\Theta(n2^n)$$.

</details>

<details>

<summary>Problem 3</summary>

This function creates two recursive branches of half the size per call, with each node taking linear work. As such, each level has $$n$$ total work, and since we halve the input each time, there are $$\log n$$ total levels, for a runtime of $$\Theta(n \log n)$$.

</details>

<details>

<summary>Problem 4</summary>

[Solutions](https://drive.google.com/file/d/1LIyFXwHYCWXNqIgKTsTyKiOYnB79_ykk/view?usp=sharing) and [walkthrough](https://www.youtube.com/watch?v=nMZn4EV0gGw) are linked here and on the course website.

</details>

<details>

<summary>Problem 5</summary>

[Solutions](https://drive.google.com/file/d/1b99XARlZxg3NMfeSAVt2yzDzwSEcASq3/view?usp=sharing) are linked here and on the course website.

</details>

### Metacognitive

1. What would the runtime of `modified_fib` be? Assume that values is an array of size n. If a value in an int array is not initialized to a number, it is automatically set to 0.

```java

public void modified_fib(int n, int[] values) {

   if (n <= 1) {

     values[n] = n;

     return n;

   } else {

     int val = values[n];

     if (val == 0) {

       val = modified_fib(n-1, values) + modified_fib(n-2, values);

       values[n] = val;

     }

     return val;

   }

}  

```

<details>

<summary>Problem 1</summary>

This is an example of dynamic programming, a topic covered in more depth in CS170. Note that since `values` is saved across calls, we only recompute each value of `n` once. Computing a single value of `n` only takes constant time, since we just add two already-computed values or do an array access. As such, the overall runtime is linear: $$\Theta(n)$$.

</details>


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：并查集 I：动态连通性与树形结构演进](/notes/cs61b/lecture-14) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：树结构 I：二叉搜索树、操作实现与 Hibbard 删除 →](/notes/cs61b/lecture-16) | [🎬 在 B 站观看本讲 (P15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=15) |
