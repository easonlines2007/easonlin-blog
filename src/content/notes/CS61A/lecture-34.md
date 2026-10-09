---
title: Lecture 34 · 多表连接与关系运算 (Tables & Joins)
description: CS61A 第 34 讲：多表连接与关系运算 (Tables & Joins)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 34
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：24:54 ｜ **视频回链**：[B 站对应单集 (P34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34)

## 1. 表连接的本质：笛卡尔积与行对组合 (The Fundamentals of Joins)

在 SQL 中，最基础的连接语法就是在 `FROM` 子句中使用逗号 `,` 分隔多张表：

```sql
SELECT * FROM table_a, table_b;
```

![表连接的本质：笛卡尔积与行对组合 (The Fundamentals of Joins) · 课堂板书演示 (00:00:32)](</attachments/cs61a-bec8f59c5c710f4768997b5f.png>)
*⏱ 时间戳：00:00:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:00:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=32)*

其底层数学本质是**笛卡尔积（Cartesian Product）**：
- 如果表 $A$ 有 $M$ 行，表 $B$ 有 $N$ 行，连接将生成包含 $M \times N$ 行的庞大中间组合集；
- 每一个结果行横向包含了来自表 $A$ 的所有列和来自表 $B$ 的所有列。

---

## 2. 案例实战：狗狗特征表与家谱表联合 (The Dogs & Parents Tables)

引入第二张表 `dogs`，记录每只狗的毛发特性（`fur`）：

```sql
CREATE TABLE dogs AS
  SELECT "abraham" AS name, "long"  AS fur UNION
  SELECT "barack",          "short"        UNION
  SELECT "clinton",         "long"         UNION
  SELECT "delano",          "long"         UNION
  SELECT "eisenhower",      "short"        UNION
  SELECT "fillmore",        "curly"        UNION
  SELECT "grover",          "short"        UNION
  SELECT "herbert",         "curly";
```

![案例实战：狗狗特征表与家谱表联合 (The Dogs & Parents Tables) · 课堂板书演示 (00:01:32)](</attachments/cs61a-7995e9a6eef65b0543e029df.png>)
*⏱ 时间戳：00:01:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:01:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=92)*

现在，家谱信息在 `parents` 表中，毛发信息在 `dogs` 表中。我们希望查询：**所有卷毛（curly）狗狗的父母是谁？**

```sql
SELECT parent FROM parents, dogs
WHERE child = name AND fur = "curly";
```

![案例实战：狗狗特征表与家谱表联合 (The Dogs & Parents Tables) · 课堂板书演示 (00:02:32)](</attachments/cs61a-df59ccc1d17cb446a367f721.png>)
*⏱ 时间戳：00:02:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:02:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=152)*

![案例实战：狗狗特征表与家谱表联合 (The Dogs & Parents Tables) · 课堂板书演示 (00:04:00)](</attachments/cs61a-1d7cf72773979b247cf70d21.png>)
*⏱ 时间戳：00:04:00 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:04:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=240)*

![案例实战：狗狗特征表与家谱表联合 (The Dogs & Parents Tables) · 课堂板书演示 (00:05:04)](</attachments/cs61a-7242959903af8f70583fbfa0.png>)
*⏱ 时间戳：00:05:04 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:05:04)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=304)*

- `child = name`：连接条件（Join Condition），将父母表中的子代与狗狗表中的名字对齐；
- `fur = "curly"`：属性过滤条件，仅保留卷毛品种；
- 查询结果精准输出：`delano`（Herbert 的父亲）与 `eisenhower`（Fillmore 的父亲）。

---

## 3. 表别名与点表达式：自连接 (Self-Join & Aliases)

当两张表拥有相同的列名，或者**将同一张表与自身连接（Self-Join）**时，列名就会产生命名冲突。此时必须使用**表别名（Aliases）**和**点表达式（Dot Expressions）**进行消除歧义。

![表别名与点表达式：自连接 (Self-Join & Aliases) · 课堂板书演示 (00:06:10)](</attachments/cs61a-b58be0eb574aa88eb4c56d49.png>)
*⏱ 时间戳：00:06:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:06:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=370)*

### 寻找所有兄弟姐妹对 (Siblings)

两只狗如果拥有相同的父母，则互为兄弟姐妹。由于所有的父母信息都在同一张 `parents` 表中，我们必须将 `parents` 与自身连接：

```sql
SELECT a.child AS first, b.child AS second
FROM parents AS a, parents AS b
WHERE a.parent = b.parent AND a.child < b.child;
```

![寻找所有兄弟姐妹对 (Siblings) · 课堂板书演示 (00:07:17)](</attachments/cs61a-ed3b7d83a6fd0c44162bf183.png>)
*⏱ 时间戳：00:07:17 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:07:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=437)*

![寻找所有兄弟姐妹对 (Siblings) · 课堂板书演示 (00:08:50)](</attachments/cs61a-de17b370a775aa51066a7110.png>)
*⏱ 时间戳：00:08:50 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:08:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=530)*

### 为什么必须写 `a.child < b.child`？
1. **防止自己与自己配对**：如果不加限制，每只狗都会成为自己的兄弟（`barack` 与 `barack`）；
2. **消除对称重复**：若仅写 `a.child != b.child`，结果中会同时出现 `(barack, clinton)` 和 `(clinton, barack)`；
3. **强制字典序**：通过严格小于号 `<`，保证每对兄弟姐妹只出现一次，且名字按字母表升序整齐排列！

---

## 4. 多表多级关联：构建祖孙表与三表连接 (Multi-Table Joins)

### 第一步：构造祖孙关系表 `grandparents`

祖父是父亲的父亲。我们将 `parents` 表两次自连接：

```sql
CREATE TABLE grandparents AS
  SELECT a.parent AS grandog, b.child AS grandpup
  FROM parents AS a, parents AS b
  WHERE a.child = b.parent;
```

![第一步：构造祖孙关系表 grandparents · 课堂板书演示 (00:10:24)](</attachments/cs61a-8d768fe681b3a957612740b6.png>)
*⏱ 时间戳：00:10:24 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:10:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=624)*

例如 `eisenhower` 是 `fillmore` 的父亲，而 `fillmore` 是 `abraham` 的父亲，因此推导出 `(eisenhower, abraham)` 是祖孙对。

### 第二步：三表连接——寻找毛发相同的祖孙对

**挑战**：找出所有“祖父的毛发类型与其孙辈毛发类型完全一致”的组合。

我们需要同时获取祖父的毛发和孙辈的毛发，因此需要将 `grandparents` 与两张 `dogs` 表连接：

```sql
SELECT grandog, grandpup
FROM grandparents, dogs AS c, dogs AS d
WHERE grandog = c.name AND grandpup = d.name AND c.fur = d.fur;
```

![第二步：三表连接——寻找毛发相同的祖孙对 · 课堂板书演示 (00:11:56)](</attachments/cs61a-31a99663316b4ddc309dda9c.png>)
*⏱ 时间戳：00:11:56 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:11:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=716)*

![第二步：三表连接——寻找毛发相同的祖孙对 · 课堂板书演示 (00:13:35)](</attachments/cs61a-50cfff9b0c9150bca82a4657.png>)
*⏱ 时间戳：00:13:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:13:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=815)*

数据库引擎将三张表联立扫描，精确匹配出符合条件的两对家族成员：
- `eisenhower` 与 `grover`（两者均为短毛 short）；
- `fillmore` 与 `herbert`（两者均为卷毛 curly）。

---

## 5. 数值表达式与地理距离计算 (Numerical Expressions in Joins)

SQL 支持在 `SELECT`、`WHERE`、`ORDER BY` 中自由使用丰富的数学函数与算术运算符：

![数值表达式与地理距离计算 (Numerical Expressions in Joins) · 课堂板书演示 (00:15:16)](</attachments/cs61a-807a5611f93b79438983958c.png>)
*⏱ 时间戳：00:15:16 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:15:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=916)*

### 城市南北纬度距离分析

每 1 纬度约等于 60 海里（Nautical Miles）。我们将 `cities` 表自连接，计算从起始城市到目的城市的向北航行距离：

```sql
CREATE TABLE distances AS
  SELECT a.name AS first, b.name AS second,
         60 * (b.latitude - a.latitude) AS distance
  FROM cities AS a, cities AS b;
```

![城市南北纬度距离分析 · 课堂板书演示 (00:17:27)](</attachments/cs61a-57cad6bfc4abba742dfca93b.png>)
*⏱ 时间戳：00:17:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:17:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1047)*

从寒冷的明尼阿波利斯（Minneapolis）出发，按向南最远排序：
```sql
SELECT second FROM distances
WHERE first = "Minneapolis"
ORDER BY distance;
```

![城市南北纬度距离分析 · 课堂板书演示 (00:18:32)](</attachments/cs61a-9e499ea1f6bb6dac20c61ed4.png>)
*⏱ 时间戳：00:18:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:18:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1112)*

排在最前面的正是温暖阳光的迈阿密（Miami）和圣地亚哥（San Diego），完美展示了关系投影与排序的现实威力。

---

## 6. 字符串操作与反模式警示 (String Expressions & Anti-Patterns)

SQL 提供了双竖线 `||` 字符串拼接操作符：

```sql
SELECT "hello" || ", " || "world"; -- => "hello, world"
```

![字符串操作与反模式警示 (String Expressions & Anti-Patterns) · 课堂板书演示 (00:19:40)](</attachments/cs61a-977068a1b921f07998391986.png>)
*⏱ 时间戳：00:19:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:19:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1180)*

### 架构警示：在关系数据库中用字符串存储复杂数据结构是严重的反模式

![架构警示：在关系数据库中用字符串存储复杂数据结构是严重的反模式 · 课堂板书演示 (00:21:40)](</attachments/cs61a-f3c4a1a4225a67546f42dd3f.png>)
*⏱ 时间戳：00:21:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:21:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1300)*

部分初学者会尝试在单个字符串列中使用逗号分隔符存储类似链表或数组的数据（如 `"1,2,3,4"`），然后用复杂的 `substr` 和 `instr` 手动解析：
- 这彻底破坏了关系数据库的第一范式（1NF，列的原子性）；
- 导致无法建立有效索引，查询性能发生断崖式下跌；
- 正确的做法永远是**将多元素拆分为关系表中的独立多行（Records）**！

---

## 7. 趣味实践：用笛卡尔积自动生成自然语言句子 (Generating Sentences)

利用笛卡尔积枚举所有可能性的特性，我们可以用 SQL 自动生成语法正确的动宾句子：

```sql
CREATE TABLE nouns AS
  SELECT "the dog" AS word UNION
  SELECT "the cat"         UNION
  SELECT "the bird";

SELECT a.word || " chased " || b.word
FROM nouns AS a, nouns AS b
WHERE a.word != b.word;
```

![趣味实践：用笛卡尔积自动生成自然语言句子 (Generating Sentences) · 课堂板书演示 (00:23:19)](</attachments/cs61a-8feed44bbef4af654d293cea.png>)
*⏱ 时间戳：00:23:19 · 📷 课堂截图 · [在 B 站观看对应片段 (P34 00:23:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1399)*

输出整齐枚举了所有可能的追逐场景：
- "the bird chased the cat"
- "the dog chased the bird"
- "the cat chased the dog" ...

进一步引入连词表 `ands`，还能无限组合出形如 "the dog and the bird chased the cat and the dog" 的复杂长句！

---

## 核心复习要点总结

| 核心技术 | 语法示例 | 关键注意事项 |
| :--- | :--- | :--- |
| **表连接 (Join)** | `FROM A, B WHERE A.id = B.id` | 底层生成笛卡尔积，务必通过 `WHERE` 提供匹配主外键 |
| **自连接 (Self-Join)** | `FROM T AS A, T AS B` | 必须为同名表赋予不同别名，通过 `<` 避免自配对与对称冗余 |
| **多表连接** | `FROM T1, T2 AS A, T2 AS B` | 允许多张甚至相同实体表的多次引用 |
| **排序 (ORDER BY)** | `ORDER BY expr ASC/DESC` | 可依据计算衍生列或表达式直接排序 |
| **字符串拼接** | `str1 \|\| str2` | 专用于拼接文本，严禁用字符串编码复合关系数据 |

---

