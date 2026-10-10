---
kind: notes
source: cs61a/lecture-24
title: Lecture 24 · Decomposition and Modular Design
description: "CS61A Lecture 24: Program decomposition and modular design."
sourceHash: d03cc1da70aa7c88e412bf9630e32a161e8b74efb5ed01f500d6b435a298e306
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 27:16 ｜ **Video link back**: [B station response unit set (P24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24)

## 1. Core mind model and architecture

Big programs are inherently extremely complex systems. The human mind cannot grasp all the details at once, so the cornerstone of big software engineering is that it can be used to solve problems in a very complex way. **Modular design **with** Separation of Concerns**.

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

### Golden Rule of Separation

- **Independence** Modification of a module (such as modifying game rules, adjusting order of play) should not trigger linkage changes to other modules (such like analysis generation, data model);
- **abstraction barrier** Modules communicate only through a clearly defined interface with the higher-order function contract, achieving internal transparency to external ones.

---

## Modular case analysis: large work project structure (Hog & Ants)

![Modular case analysis: Big project design (Hog & Ants) · lecture board illustration (00:00:45)](</attachments/cs61a-ddbbe469b6273b27432a48fd.png>)
*⏱ Timestamp: 00:00:45 · 📷 Lecture screenshot · [Watch clip (P24 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=45)*

### Project 1: The Game of Hog

![Project 1: The Game of Hog (Pig brand game) · lecture board illustration (00:01:45)](</attachments/cs61a-ba9722b6211d741bbb6e8342.png>)
*⏱ Timestamp: 00:01:45 · 📷 Lecture screenshot · [Watch clip (P24 00:01:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=105)*

Hog's code is broken down strictly into three orthogonal modules:
1. **The game simulator** Follow the rules of the game, alternate routines, and follow up on current scores.
2. **The first is the "Commentary"** The following is a list of the most commonly used methods for calculating the value of a given variable:
3. **The game is based on the player strategies.**: The pure decision function of the current situation is to be output as a number of times.

### Project 2: Ants vs. Some-Bees — A Plants vs. Zombies-Style Tower Defense Game

![Project 2: Ants vs. Some-Bees (Botomize towers) · lecture board illustration (00:03:15)](</attachments/cs61a-b6813a6a6b6720d1f3b1b7a5.png>)
*⏱ Timestamp: 00:03:15 · 📷 Lecture screenshot · [Watch clip (P24 00:03:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=195)*

1. **Game running simulator** Responsible for the development of cycles, solar/food resource settlement and win-loss judgments;
2. **Insect action functions** The following are the actions of each species: they are written independently for each particular species, without interfering with each other;
3. **Tunnels & Places is a network of tunnels and plazas.** In the case of a map tunnel, it is responsible for connectivity, import and export and insect location indexing.

---

## 3. Application: A Search Engine for Restaurants Around Berkeley

To fully practice modular design, the course introduces a restaurant search and recommendation engine based on Yelp's real academic dataset:

![Operational systems: search engine for the restaurant around Berkeley lecture board illustration (00:05:15)](</attachments/cs61a-d4300bc3628764e962b20e6b.png>)
*⏱ Timestamp: 00:05:15 · 📷 Lecture screenshot · [Watch clip (P24 00:05:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=315)*

![Operational system: search engine for the restaurant around Berkeley lecture board illustration (00:07:15)](</attachments/cs61a-19f97b3cd81e9dc4e1fb1403.png>)
*⏱ Timestamp: 00:07:15 · 📷 Lecture screenshot · [Watch clip (P24 00:07:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=435)*

### Data structure specifications

- **The restaurant metadata (`restaurants.json`)**: 
  ```json
  {"name": "Cafe 3", "stars": 2.5, "price": 1, "business_id": "...", ...}
  ```
- **The user comment stream `reviews.json`)**: 
  ```json
  {"business_id": "...", "user_id": "...", "stars": 2, "text": "..."}
  ```

---

## The search engine core (the "search engine core") is a modular search engine that provides the ability to create and manage data.

![The search engine core (The Search Engine Core) · lecture board illustration (00:09:15)](</attachments/cs61a-c9b108293cdbc6755e508ee4.png>)
*⏱ Timestamp: 00:09:15 · 📷 Lecture screenshot · [Watch clip (P24 00:09:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=555)*

### Abstraction of restaurant categories and total index

![Cafeteria class abstraction and Full Index lecture board illustration (00:11.15)](</attachments/cs61a-75c2745ea4e1139d3be7eed3.png>)
*⏱ Timestamp: 00:11:15 · 📷 Lecture screenshot · [Watch clip (P24 00:11:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=675)*

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

### Can be inserted to extract the sequence  `search`

```python
def search(query, ranking=lambda r: -r.stars):
    """根据查询词搜索餐厅，并允许外部传入自定义排序规则。"""
    results = [r for r in Restaurant.all if query in r.name.lower()]
    return sorted(results, key=ranking)
```

> **Design of the bright spot**: 
> `ranking`  The parameters are injected as a higher-order function, and sorted by default by star order. `-r.stars` If future users want to upgrade the pumps by price or the pumps in order of distance, no rebuilding is required.  `search`  The function itself.

---

## 5. Similarity Recommended Interface and Finding Similar Items

![Recommended interface with similarities and extractable items (Finding Similar Items) · lecture board illustration (00:13:15)](</attachments/cs61a-95d4fb8fc22398fe7fc8ad6f.png>)
*⏱ Timestamp: 00:13:15 · 📷 Lecture screenshot · [Watch clip (P24 00:13:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=795)*

How to find the most similar in an existing restaurant collection  $K$  The house?

![Recommended interface and extractable items (Finding Similar Items) · lecture board illustration (00:15:15)](</attachments/cs61a-dc90b318d8e66ab2ffe17e72.png>)
*⏱ Timestamp: 00:15:15 · 📷 Lecture screenshot · [Watch clip (P24 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=915)*

```python
def similar(self, k, similarity):
    """返回与当前餐厅最相似的前 k 家其他餐厅。"""
    others = list(Restaurant.all)
    others.remove(self)  # 排除自身
    # 按相似度降序排列
    return sorted(others, key=lambda other: -similarity(self, other))[:k]

Restaurant.similar = similar
```

### Definition of similarity indicators: number of common good reviewers (`reviewed_both`)

![Definition of similarity indicators: number of common good reviews (reviewed\_both) · lecture board illustration (00:17:15)](</attachments/cs61a-23aaac9119321b9e2f0dc1c2.png>)
*⏱ Timestamp: 00:17:15 · 📷 Lecture screenshot · [Watch clip (P24 00:17:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1035)*

In the collaborative filtering, if two customers simultaneously review and critique restaurants A and B, they show that the audience of both restaurants has similar preferences:

```python
def reviewed_both(r, s):
    """朴素算法：计算两家餐厅重叠的评论者总数。"""
    return len([u for u in r.reviewers if u in s.reviewers])
```

---

## 6. Data analysis and full functionality

![Data resolution and full functional connection lecture board illustration (00:19:15)](</attachments/cs61a-7cbeea4f5c8aa157da7f6e1c.png>)
*⏱ Timestamp: 00:19:15 · 📷 Lecture screenshot · [Watch clip (P24 00:19:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1155)*

The following is a list of the most commonly used methods for analyzing data in JSON files:

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

## 7. Fast overlap (Fast Overlap) - The first step in the process of improving performance is to improve the quality of the product.

Running test findings: Searching for "cafe" takes time to reach  **1.7 seconds** This delay is unacceptable for a local database of just over 100 restaurants.

![Performance bottlenecks diagnosis and algorithm optimization (Fast Overlap) lecture board illustration (00:21.15)](</attachments/cs61a-01f962ba9e445a857cd1a18e.png>)
*⏱ Timestamp: 00:21:15 · 📷 Lecture screenshot · [Watch clip (P24 00:21:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1275)*

![Performance bottlenecks diagnosis and algorithm optimization (Fast Overlap) lecture board illustration (00:22:45)](</attachments/cs61a-429f3e401742fdd03c7772ac.png>)
*⏱ Timestamp: 00:22:45 · 📷 Lecture screenshot · [Watch clip (P24 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1365)*

### Bottle root dissection

In the recommended calculations:
- Calling every restaurant searched  `similar()`; 
- `similar()`  It's a great way to get around all the other restaurants and call  `reviewed_both(r, s)`; 
- The original  `reviewed_both`  Internally used  `u in s.reviewers` This is a second-party operation in the nested list.  $\Theta(|r| \cdot |s|)$.

### Optimization of binaries: linear cross-sectional ordered lists

If you keep every restaurant  `reviewers`  List of names **The monotony is orderly** We can help. **The two-point scanning technique is called the Two-Pointer Technique.** In the  $\Theta(|s| + |t|)$  The overlapping counting was done in strict linear time:

![Double pointer optimization: linear cross-section of orderly lists lecture board illustration (00:24:15)](</attachments/cs61a-0ece91cf640555a1d2ba6c61.png>)
*⏱ Timestamp: 00:24:15 · 📷 Lecture screenshot · [Watch clip (P24 00:24:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1455)*

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

![Double pointer optimization: linear cross-section of orderly lists lecture board illustration (00:25:15)](</attachments/cs61a-042486f6d65bed6e4873f56b.png>)
*⏱ Timestamp: 00:25:15 · 📷 Lecture screenshot · [Watch clip (P24 00:25:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1515)*

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

### Optimizing results and interactive searches

![Optimizing effectiveness and interactive search lecture board illustration (00:26:30)](</attachments/cs61a-953e0d943abd697511920e15.png>)
*⏱ Timestamp: 00:26:30 · 📷 Lecture screenshot · [Watch clip (P24 00:26:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=24&t=1590)*

- The results of the survey were published in the journal Nature.  **0.5 to 0.7 seconds** The performance improvements are over.  **2.5 times as much**!
- The excellent response speed allows us to directly pack it into a real-time terminal interactive search program (Interactive REPL).

---

## Chapter 8 Summary and Core Points

1. **The core benefits of modularisation** The main system is divided into orthogonal components, allowing each part to be tested separately, replaced and targeted optimized.
2. **higher-order function as an extension point** By accepting  `ranking`  and  `similarity`  Functions are used as parameters to exclude change points, creating an elastic structure.
3. **Algorithms and engineering** By analyzing hotspot calls, the Sorted Property system combines order with linear bi-pointer scanning to break through the secondary performance bottleneck.

---

