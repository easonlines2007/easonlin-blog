---
title: Lecture 20 · 散列表 II：装载因子与重散列机制：装载因子控制、动态扩容 Rehashing、开放寻址与 hashCode 设计
description: CS61B 第 20 讲：散列表 II：装载因子与重散列机制：装载因子控制、动态扩容 Rehashing、开放寻址与 hashCode 设计
date: 2026-10-21
topic: CS61B
tags:
  - cs61b
status: completed
publish: true
order: 20
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 4: 树结构与散列表 (Search Trees & Hashing)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：51:44 ｜ **官方原版**：Lecture 20 - Hashing 2  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1EGP_BWIbha4xQ4A5PJLAVIQaK6G0RbWZfrVDd0GmS08) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/20.-hashing-ii)  
> **快速导航**：[← 上一讲 (P19 散列表 I：直接寻址与拉链法)](/notes/cs61b/lecture-19) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P21 堆与优先队列：二叉堆与数组表示) →](/notes/cs61b/lecture-21)

---

## 1. 装载因子（Load Factor）与扩容阈值

*(参考时间：00:02:15 · [视频跳转 (P20 00:02:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=135))*

在上一讲的拉链法哈希表中，平均每个桶容纳的元素个数为：
$$\lambda = \frac{N}{M} \quad (\text{其中 } N \text{ 为总元素数, } M \text{ 为桶数组长度})$$
数学上将 $\lambda$ 称作**装载因子（Load Factor）**。

- 若 $M$ 保持固定，随着持续插入 $N \to \infty$，$\lambda$ 将无限膨胀，查找退化为 $O(N)$；
- 若想要查找保持真正的 $O(1)$，**必须保证 $\lambda$ 永远被限制在一个较小的常数阈值之内**（Java 官方 `HashMap` 的默认阈值为 $\lambda = 0.75$）。

## 2. 动态扩容与重新散列（Rehashing）

*(参考时间：00:13:30 · [视频跳转 (P20 00:13:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=810))*

当插入导致 $N / M > 0.75$ 时，散列表必须触发**翻倍扩容（Resizing）**：
1. 分配一个长度为 $2M$ 的全新桶数组；
2. **严禁直接拷贝原链表！** 因为数组容量 $M$ 变了，模数变了，所有键在原数组中的下标 `hash % M` 必须针对新容量 `hash % (2M)` 重新计算！这一过程称为**重新散列（Rehashing）**。

```java
private void resize(int newCapacity) {
    List61B<Entry>[] newBuckets = new List61B[newCapacity];
    for (int i = 0; i < newCapacity; i++) newBuckets[i] = new SLList<>();

    for (List61B<Entry> bucket : buckets) {
        for (Entry e : bucket) {
            int newIdx = Math.floorMod(e.key.hashCode(), newCapacity);
            newBuckets[newIdx].addLast(e);
        }
    }
    this.buckets = newBuckets;
}
```

通过几何翻倍策略，单次插入操作的平摊时间（Amortized Time）依然稳定保持在极其优异的 $\Theta(1)$！

## 3. 替代路线：开放寻址法（Open Addressing / Linear Probing）

*(参考时间：00:25:40 · [视频跳转 (P20 00:25:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=1540))*

拉链法需要频繁开辟链表节点，带来额外的堆对象指针开销。另一种不依赖链表的流派是**开放寻址法（Open Addressing）**。

### 线性探测（Linear Probing）
当计算出的槽位 `hash % M` 已经被占用时，不拉链，而是**顺延往后依次探查：`hash+1`, `hash+2`, `hash+3` ... 直到找到第一个空闲槽位填入**！

**致命痛点：聚簇现象（Clustering）**  
随着碰撞增多，连续被占用的槽位会迅速滚雪球连成一片。新元素一旦落在该区间附近，必须在长长的连续数组上漫长探查，性能恶化极为剧烈。在开放寻址法中，装载因子必须压制在 $\lambda \le 0.5$ 以下。

## 4. 如何编写工业级优秀的 hashCode()

*(参考时间：00:36:20 · [视频跳转 (P20 00:36:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2180))*

一个优秀的哈希函数必须将现实世界中的输入均匀、随机地洒向 32 位整数的各个角落。

### 经典多项式累加法与魔数 31
对于组合对象或字符串，Java 官方采用多项式展开算法：
$$hash = s[0] \cdot 31^{k-1} + s[1] \cdot 31^{k-2} + \dots + s[k-1]$$

为什么选择 **31** 作为乘法基数？
1. **素数（Prime Number）**：素数乘法能极大减少因输入数据存在公约数规律而引发的周期性哈希冲突；
2. **硬件编译器极速优化**：$31 \cdot i$ 在底层的机器指令中可以被 JIT 编译器极速优化为一条简单的位移与减法指令：`(i << 5) - i`，完全不需要执行代价昂贵的硬件整数乘法器！

## 5. 本讲小结与查找数据结构终极大对比

*(参考时间：00:47:10 · [视频跳转 (P20 00:47:10)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20&t=2830))*

| 数据结构 | 查找 `contains` (平均) | 查找 (最坏) | 插入 `add` (平摊) | 是否要求有序性 |
| :--- | :---: | :---: | :---: | :---: |
| **普通链表 / 数组** | $\Theta(N)$ | $\Theta(N)$ | $\Theta(1)$ | 否 |
| **有序数组 (二分)** | $\Theta(\log N)$ | $\Theta(\log N)$ | $\Theta(N)$ (平移拷贝) | 是 (需 Comparable) |
| **平衡二叉树 (红黑树)** | $\Theta(\log N)$ | $\Theta(\log N)$ | $\Theta(\log N)$ | 是 (需 Comparable) |
| **散列表 (Hash Table)** | $\Theta(1)$ | $\Theta(N)$ (极罕见退化) | $\Theta(1)$ | 否 (只需 hashCode) |

---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：散列表 I：直接寻址与拉链法](/notes/cs61b/lecture-19) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：堆与优先队列：二叉堆与数组表示 →](/notes/cs61b/lecture-21) | [🎬 在 B 站观看本讲 (P20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=20) |
