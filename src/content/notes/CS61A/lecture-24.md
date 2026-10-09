---
title: Lecture 24 · 程序分解与模块化设计 (Decomposition)
description: CS61A 第 24 讲：程序分解与模块化设计 (Decomposition)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 24
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：27:16 ｜ **视频回链**：[B 站对应单集 (P24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24)

## 1. 核心心智模型与架构图解

大型程序本质上是极其复杂的系统。人类心智无法在同一时间把握所有细节，因此大型软件工程的基石是**模块化设计（Modular Design）**与**关注点分离（Separation of Concerns）**。

```
餐厅搜索引擎模块化架构 (Restaurant Search Architecture):

       用户查询输入 ("thai", "cafe")
                 │
                 ▼
     ┌────────────────────────────────────────────────────────┐
     │              Search Module (查询与排序引擎)             │
     │────────────────────────────────────────────────────────│
     │ • 过滤名字匹配项: query in r.name                      │
     │ • 可插拔排序策略: ranking_key (默认按星级降序)         │
     └──────────────────────────┬─────────────────────────────┘
                                │ 检索匹配结果
                                ▼
     ┌────────────────────────────────────────────────────────┐
     │              Entity Layer: Restaurant Class            │
     │────────────────────────────────────────────────────────│
     │ • 属性: name, stars, reviewers (评论者列表)            │
     │ • 全局索引: Restaurant.all 类属性集中管理              │
     │ • 相似度接口: r.similar(k, similarity_metric)          │
     └──────────────────────────┬─────────────────────────────┘
                                │ 相似度度量计算
                                ▼
     ┌────────────────────────────────────────────────────────┐
     │          Algorithm Layer: Fast Overlap (双指针)        │
     │────────────────────────────────────────────────────────│
     │ • 原始朴素算法: Θ(|R| · |S|) 双重循环 (耗时 1.7s)      │
     │ • 有序双指针算法: Θ(|R| + |S|) 线性交集扫描 (耗时 0.7s)│
     └────────────────────────────────────────────────────────┘
```

### 关注点分离的黄金法则

- **独立演进**：修改某一模块（如修改游戏规则、调整排序打分），不应引发其他模块（如解说生成、数据模型）的联锁变更；
- **抽象屏障**：各模块仅通过明确定义的接口与高阶函数契约进行通信，内部实现对外部透明。

---

## 2. 模块化案例剖析：大作业项目解构 (Hog & Ants)

![模块化案例剖析：大作业项目解构 (Hog & Ants) · 课堂板书演示 (00:00:45)](</attachments/cs61a-ddbbe469b6273b27432a48fd.png>)
*⏱ 时间戳：00:00:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=45)*

### 项目 1：The Game of Hog (猪牌骰子游戏)

![项目 1：The Game of Hog (猪牌骰子游戏) · 课堂板书演示 (00:01:45)](</attachments/cs61a-ba9722b6211d741bbb6e8342.png>)
*⏱ 时间戳：00:01:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:01:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=105)*

Hog 的代码被严格拆解为三个正交模块：
1. **游戏模拟器 (Simulator)**：关注掷骰子规则、轮流交替、胜负判定与当前分数追踪；
2. **实时解说系统 (Commentary)**：关注根据每轮比分变动生成解说文本；
3. **玩家决策策略 (Player Strategies)**：根据当前局势输出本次应掷骰子数的纯决策函数。

### 项目 2：Ants vs. Some-Bees (植物大战僵尸式塔防)

![项目 2：Ants vs. Some-Bees (植物大战僵尸式塔防) · 课堂板书演示 (00:03:15)](</attachments/cs61a-b6813a6a6b6720d1f3b1b7a5.png>)
*⏱ 时间戳：00:03:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:03:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=195)*

1. **游戏运行模拟器**：负责回合推进、阳光/食物资源结算与胜负判定；
2. **昆虫行为函数 (Action Functions)**：针对每一种特殊的蚂蚁或蜜蜂独立编写其行为动作，彼此互不干扰；
3. **隧道拓扑系统 (Tunnels & Places)**：负责地图隧道的连通性、进出口与昆虫位置索引。

---

## 3. 实战系统：伯克利周边餐厅搜索引擎

为了全面演练模块化设计，课程引入了基于 Yelp 真实学术数据集构建的餐厅搜索与推荐引擎：

![实战系统：伯克利周边餐厅搜索引擎 · 课堂板书演示 (00:05:15)](</attachments/cs61a-d4300bc3628764e962b20e6b.png>)
*⏱ 时间戳：00:05:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:05:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=315)*

![实战系统：伯克利周边餐厅搜索引擎 · 课堂板书演示 (00:07:15)](</attachments/cs61a-19f97b3cd81e9dc4e1fb1403.png>)
*⏱ 时间戳：00:07:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=435)*

### 数据结构规范

- **餐厅元数据 (`restaurants.json`)**：
  ```json
  {"name": "Cafe 3", "stars": 2.5, "price": 1, "business_id": "...", ...}
  ```
- **用户评论流 (`reviews.json`)**：
  ```json
  {"business_id": "...", "user_id": "...", "stars": 2, "text": "..."}
  ```

---

## 4. 模块化搜索与实体建模 (The Search Engine Core)

![模块化搜索与实体建模 (The Search Engine Core) · 课堂板书演示 (00:09:15)](</attachments/cs61a-c9b108293cdbc6755e508ee4.png>)
*⏱ 时间戳：00:09:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=555)*

### 餐厅类抽象与全量索引

![餐厅类抽象与全量索引 · 课堂板书演示 (00:11:15)](</attachments/cs61a-75c2745ea4e1139d3be7eed3.png>)
*⏱ 时间戳：00:11:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:11:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=675)*

```python
class Restaurant:
    """表示一家餐厅的实体模型，拥有全量自注册容器。"""
    all = []  # 类属性：自动收集所有实例

    def __init__(self, name, stars, reviewers):
        self.name = name
        self.stars = stars
        self.reviewers = reviewers
        Restaurant.all.append(self)

    def __repr__(self):
        return f'<{self.name}>'
```

### 可插拔排序检索函数 `search`

```python
def search(query, ranking=lambda r: -r.stars):
    """根据查询词搜索餐厅，并允许外部传入自定义排序规则。"""
    results = [r for r in Restaurant.all if query in r.name.lower()]
    return sorted(results, key=ranking)
```

> **设计亮点**：
> `ranking` 参数作为高阶函数注入，默认按星级降序排序（`-r.stars`）。若未来用户希望“按价格升序”或“按距离排序”，无需重构 `search` 函数本身。

---

## 5. 相似度推荐接口与可插拔度量 (Finding Similar Items)

![相似度推荐接口与可插拔度量 (Finding Similar Items) · 课堂板书演示 (00:13:15)](</attachments/cs61a-95d4fb8fc22398fe7fc8ad6f.png>)
*⏱ 时间戳：00:13:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:13:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=795)*

如何在已有餐厅集合中找到最相似的 $K$ 家？

![相似度推荐接口与可插拔度量 (Finding Similar Items) · 课堂板书演示 (00:15:15)](</attachments/cs61a-dc90b318d8e66ab2ffe17e72.png>)
*⏱ 时间戳：00:15:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=915)*

```python
def similar(self, k, similarity):
    """返回与当前餐厅最相似的前 k 家其他餐厅。"""
    others = list(Restaurant.all)
    others.remove(self)  # 排除自身
    # 按相似度降序排列
    return sorted(others, key=lambda other: -similarity(self, other))[:k]

Restaurant.similar = similar
```

### 定义相似度指标：共同好评者数 (`reviewed_both`)

![定义相似度指标：共同好评者数 (reviewed_both) · 课堂板书演示 (00:17:15)](</attachments/cs61a-23aaac9119321b9e2f0dc1c2.png>)
*⏱ 时间戳：00:17:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1035)*

在协同过滤中，若两位顾客同时光顾并点评了餐厅 A 和餐厅 B，说明这两家餐厅的受众群体具有相似偏好：

```python
def reviewed_both(r, s):
    """朴素算法：计算两家餐厅重叠的评论者总数。"""
    return len([u for u in r.reviewers if u in s.reviewers])
```

---

## 6. 数据解析与全功能贯通

![数据解析与全功能贯通 · 课堂板书演示 (00:19:15)](</attachments/cs61a-7cbeea4f5c8aa157da7f6e1c.png>)
*⏱ 时间戳：00:19:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:19:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1155)*

从 JSON 文件中流式解析元数据与评论关系：

```python
import json

def load_data():
    reviewers_for_restaurant = {}
    with open('reviews.json') as f:
        for line in f:
            review = json.loads(line)
            biz_id = review['business_id']
            user_id = review['user_id']
            reviewers_for_restaurant.setdefault(biz_id, []).append(user_id)

    with open('restaurants.json') as f:
        for line in f:
            r = json.loads(line)
            biz_id = r['business_id']
            reviewers = sorted(reviewers_for_restaurant.get(biz_id, []))
            Restaurant(r['name'], r['stars'], reviewers)
```

---

## 7. 性能瓶颈诊断与算法优化 (Fast Overlap)

运行测试发现：搜索 "cafe" 耗时长达 **1.7 秒**！对于一个仅有 100 多家餐厅的本地数据库而言，这个延迟难以接受。

![性能瓶颈诊断与算法优化 (Fast Overlap) · 课堂板书演示 (00:21:15)](</attachments/cs61a-01f962ba9e445a857cd1a18e.png>)
*⏱ 时间戳：00:21:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1275)*

![性能瓶颈诊断与算法优化 (Fast Overlap) · 课堂板书演示 (00:22:45)](</attachments/cs61a-429f3e401742fdd03c7772ac.png>)
*⏱ 时间戳：00:22:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1365)*

### 瓶颈根源剖析

在推荐计算中：
- 需要对每一家搜索出的餐厅调用 `similar()`；
- `similar()` 需要遍历所有其他餐厅并调用 `reviewed_both(r, s)`；
- 原始 `reviewed_both` 内部使用了 `u in s.reviewers`，在未排序列表上这是一个嵌套的二次方操作 $\Theta(|r| \cdot |s|)$。

### 双指针优化：有序列表的线性求交集

若保持每家餐厅的 `reviewers` 列表**单调有序**，我们可以借助**双指针扫描法（Two-Pointer Technique）**，在 $\Theta(|s| + |t|)$ 的严格线性时间内完成重叠计数：

![双指针优化：有序列表的线性求交集 · 课堂板书演示 (00:24:15)](</attachments/cs61a-0ece91cf640555a1d2ba6c61.png>)
*⏱ 时间戳：00:24:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:24:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1455)*

```
List S: [ 3, 5, 7, 9 ]
          ▲ (i)
List T: [ 1, 3, 4, 7, 8 ]
          ▲ (j)

• 1 < 3: T[j] 较小，T[j] 绝不可能出现在 S 中，前进 j++
• 3 == 3: 命中匹配！计数 count++，同时前进 i++, j++
• 5 > 4: S[i] 较大，前进 j++
...
```

![双指针优化：有序列表的线性求交集 · 课堂板书演示 (00:25:15)](</attachments/cs61a-042486f6d65bed6e4873f56b.png>)
*⏱ 时间戳：00:25:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1515)*

```python
def fast_overlap(s, t):
    """在两个升序无重复的列表中，以线性时间计算公共元素个数。"""
    i, j, count = 0, 0, 0
    while i < len(s) and j < len(t):
        if s[i] == t[j]:
            count += 1
            i += 1
            j += 1
        elif s[i] < t[j]:
            i += 1
        else:
            j += 1
    return count
```

### 优化成效与交互式搜索

![优化成效与交互式搜索 · 课堂板书演示 (00:26:30)](</attachments/cs61a-953e0d943abd697511920e15.png>)
*⏱ 时间戳：00:26:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P24 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1590)*

- 优化后，查询耗时直接降低到 **0.5 ~ 0.7 秒**，性能提升超 **2.5 倍**！
- 极佳的响应速度支持我们直接将其包装为一个实时的终端交互式搜索程序（Interactive REPL）。

---

## 8. 章节总结与核心考点

1. **模块化的核心收益**：将大系统拆分为正交组件，使各个部分可单独测试、替换与针对性优化。
2. **高阶函数作为扩展点**：通过接受 `ranking` 与 `similarity` 函数作为参数，将变化点外置，打造弹性架构。
3. **算法与工程并重**：通过分析调用热点，将有序性（Sorted Property）与双指针线性扫描结合，成功突破二次方性能瓶颈。

---

