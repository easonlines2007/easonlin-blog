---
title: Lecture 35 · 数据聚合与分组统计 (Aggregation & Group By)
description: CS61A 第 35 讲：数据聚合与分组统计 (Aggregation & Group By)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 35
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：17:30 ｜ **视频回链**：[B 站对应单集 (P35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35)

## 1. 单行求值 vs 聚合函数 (Row-Level vs Aggregate Functions)

常规 SQL 表达式在每一行上独立运行：

![单行求值 vs 聚合函数 (Row-Level vs Aggregate Functions) · 课堂板书演示 (00:00:32)](</attachments/cs61a-ec9a9c3bbf8716f67467f8cc.png>)
*⏱ 时间戳：00:00:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:00:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=32)*

而**聚合函数（Aggregate Function）**接收一组行（Group of Rows）作为输入，将其折叠压缩并计算出一个总结标量值。

### 实战数据集：动物特征表 `animals`

引入一张包含腿数（`legs`）与体重（`weight`）的动物表：

```sql
CREATE TABLE animals AS
  SELECT "dog"     AS kind, 4 AS legs, 20    AS weight UNION
  SELECT "cat",             4,         10              UNION
  SELECT "ferret",          4,         10              UNION
  SELECT "parrot",          2,         6               UNION
  SELECT "penguin",         2,         10              UNION
  SELECT "t-rex",           2,         12000;
```

![实战数据集：动物特征表 animals · 课堂板书演示 (00:01:34)](</attachments/cs61a-5cfacf0ce02c3846e6099c30.png>)
*⏱ 时间戳：00:01:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:01:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=94)*

---

## 2. 基础聚合函数与算术组合 (`MAX`, `MIN`, `SUM`, `AVG`)

当 `SELECT` 语句中出现聚合函数且没有 `GROUP BY` 时，整个表被默认视为**一个全局大组**，输出结果强制收敛为单行：

```sql
SELECT max(legs) FROM animals; -- => 4
SELECT sum(weight) FROM animals; -- => 12056
```

![基础聚合函数与算术组合 (MAX, MIN, SUM, AVG) · 课堂板书演示 (00:02:34)](</attachments/cs61a-48f2711b4c187ea83e9fe487.png>)
*⏱ 时间戳：00:02:34 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:02:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=154)*

![基础聚合函数与算术组合 (MAX, MIN, SUM, AVG) · 课堂板书演示 (00:03:27)](</attachments/cs61a-e894a8fe3330c11621444b99.png>)
*⏱ 时间戳：00:03:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:03:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=207)*

### 聚合函数内部与外部的算术运算

- 聚合函数内部可以嵌套复杂的单行表达式：`max(legs - weight)`；
- 多个聚合函数之间可以直接进行四则运算：
  ```sql
  SELECT max(legs) - min(weight) FROM animals; -- => 4 - 6 = -2
  ```

![聚合函数内部与外部的算术运算 · 课堂板书演示 (00:04:30)](</attachments/cs61a-d221da49d6c7972eae435d0f.png>)
*⏱ 时间戳：00:04:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=270)*

### 配合 `WHERE` 预过滤

`WHERE` 子句总是在聚合计算**之前**生效：

```sql
-- 排除霸王龙 (t-rex) 后的最大体重
SELECT max(weight) FROM animals WHERE kind != "t-rex"; -- => 20 (狗)
```

![配合 WHERE 预过滤 · 课堂板书演示 (00:05:03)](</attachments/cs61a-5178ee86478cd8cde0103dd5.png>)
*⏱ 时间戳：00:05:03 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:05:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=303)*

---

## 3. 计数与去重统计 (`COUNT(*)` vs `COUNT(DISTINCT)`)

统计行数时最地道的语法是 `COUNT(*)`：

```sql
SELECT count(*) FROM animals; -- => 6
```

![计数与去重统计 (COUNT(*) vs COUNT(DISTINCT)) · 课堂板书演示 (00:06:10)](</attachments/cs61a-dbfd1007e7f0cc9d8474c10b.png>)
*⏱ 时间戳：00:06:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:06:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=370)*

### `DISTINCT` 关键字消除重复值

如果需要在聚合前剔除重复取值，可以在列名前加上 `DISTINCT`：

```sql
SELECT count(DISTINCT legs) FROM animals; -- => 2 (只有 2 和 4 两种腿数)
SELECT sum(DISTINCT weight) FROM animals; -- => 20 + 10 + 6 + 12000 = 12036 (10 仅计算一次)
```

---

## 4. 聚合函数与非聚合列混用的语义陷阱 (Mixing Columns with Aggregates)

如果在 `SELECT` 中同时请求一个聚合值和一个普通列（如 `SELECT max(weight), kind FROM animals`），会发生什么？

![聚合函数与非聚合列混用的语义陷阱 (Mixing Columns with Aggregates) · 课堂板书演示 (00:07:10)](</attachments/cs61a-8d337659b671bed8b0a1cb1b.png>)
*⏱ 时间戳：00:07:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:07:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=430)*

![聚合函数与非聚合列混用的语义陷阱 (Mixing Columns with Aggregates) · 课堂板书演示 (00:08:10)](</attachments/cs61a-3b9cf9440942714fb1eb999e.png>)
*⏱ 时间戳：00:08:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=490)*

![聚合函数与非聚合列混用的语义陷阱 (Mixing Columns with Aggregates) · 课堂板书演示 (00:09:48)](</attachments/cs61a-4983b7eba57de2272f503717.png>)
*⏱ 时间戳：00:09:48 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:09:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=588)*

1. **确定性关联（`MAX`/`MIN`）**：在 SQLite 中，`max(weight), kind` 会返回取得最大体重的整行数据（输出 `12000, t-rex`），这在语义上是清晰且有意义的；
2. **多匹配不确定性**：执行 `SELECT max(legs), kind FROM animals` 时，有三只动物（dog, cat, ferret）都是 4 条腿，数据库将随机/任意挑选一只，失去明确指向性；
3. **彻底无意义（`AVG`/`SUM`）**：执行 `SELECT avg(weight), kind FROM animals` 时，平均体重是 2009，但返回的动物却是 `t-rex`——因为平均值由所有行共同产生，没有任何一只单独的动物“代表平均值”！

> **最佳实践**：除非明确利用特定数据库的扩展特性，否则 `SELECT` 列表中应仅包含聚合函数或出现在 `GROUP BY` 中的列。

---

## 5. 数据分组切片：`GROUP BY` 子句

默认情况下全表为一个大组。使用 `GROUP BY` 可以将数据按照某个表达式的唯一值**分割成多个相互独立的子组**，并在每个子组内分别执行聚合：

```sql
SELECT legs, max(weight) FROM animals GROUP BY legs;
```

![数据分组切片：GROUP BY 子句 · 课堂板书演示 (00:11:26)](</attachments/cs61a-8a9af6b8a705170b25edcadc.png>)
*⏱ 时间戳：00:11:26 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:11:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=686)*

![数据分组切片：GROUP BY 子句 · 课堂板书演示 (00:12:31)](</attachments/cs61a-55218558763cc247e8b05ed3.png>)
*⏱ 时间戳：00:12:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:12:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=751)*

执行过程：
1. 提取所有行的 `legs` 值，划分为两个组：`legs = 2` 组与 `legs = 4` 组；
2. 在 `legs = 4` 组（dog, cat, ferret）中求最大体重：`20`；
3. 在 `legs = 2` 组（parrot, penguin, t-rex）中求最大体重：`12000`；
4. 输出包含两行聚合统计的全新结果表！

![数据分组切片：GROUP BY 子句 · 课堂板书演示 (00:13:29)](</attachments/cs61a-ac1df151fba1ef627fa48b92.png>)
*⏱ 时间戳：00:13:29 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:13:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=809)*

---

## 6. 多列分组与按任意表达式分组 (Grouping by Multiple Columns & Expressions)

### 多列复合分组

```sql
SELECT legs, weight, count(*) FROM animals GROUP BY legs, weight;
```

![多列复合分组 · 课堂板书演示 (00:14:32)](</attachments/cs61a-bab6ddf8cdca8837965fa56f.png>)
*⏱ 时间戳：00:14:32 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:14:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=872)*

仅当两行的 `legs` 与 `weight` 完全相同时才归入同一组（例如 cat 和 ferret 同属一组）。

### 按计算表达式分组：体腿比（Weight / Legs）

```sql
SELECT max(kind), weight / legs FROM animals GROUP BY weight / legs;
```

![按计算表达式分组：体腿比（Weight / Legs） · 课堂板书演示 (00:15:07)](</attachments/cs61a-646b207f34458d38691b3054.png>)
*⏱ 时间戳：00:15:07 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:15:07)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=907)*

SQLite 默认对整型执行整数除法，根据每只动物的体重除以腿数所得到的唯一比值分别归类分组。

---

## 7. 分组后的条件过滤：`HAVING` 子句 (`WHERE` vs `HAVING`)

这是初学者最容易混淆的 SQL 核心考点：**行过滤（`WHERE`）与组过滤（`HAVING`）的本质区别**。

![分组后的条件过滤：HAVING 子句 (WHERE vs HAVING) · 课堂板书演示 (00:16:10)](</attachments/cs61a-5c40e5190e064f5161935fb7.png>)
*⏱ 时间戳：00:16:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:16:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=970)*

![分组后的条件过滤：HAVING 子句 (WHERE vs HAVING) · 课堂板书演示 (00:16:40)](</attachments/cs61a-7824d4bcf761d067d63f810b.png>)
*⏱ 时间戳：00:16:40 · 📷 课堂截图 · [在 B 站观看对应片段 (P35 00:16:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=1000)*

| 关键字 | 生效时机 | 过滤对象 | 能否使用聚合函数？ |
| :--- | :--- | :--- | :--- |
| **`WHERE`** | 分组 **之前** 执行 | 原始数据单行 (Individual Rows) | **绝对不能** |
| **`HAVING`** | 分组与聚合 **之后** 执行 | 聚合后的组 (Aggregated Groups) | **可以且常用** |

### 案例：仅保留成员数量大于 1 的分组

```sql
SELECT weight / legs, count(*)
FROM animals
GROUP BY weight / legs
HAVING count(*) > 1;
```

- 计算每个动物的 `weight / legs` 并分组；
- 孤立的单只动物组（`count(*) = 1`）在 `HAVING` 阶段被直接过滤丢弃；
- 仅保留拥有多只动物符合该体腿比的分组！

---

## 核心复习要点总结

| 核心组件 | 核心功能 | 典型代码示例 |
| :--- | :--- | :--- |
| **聚合函数** | 将多行数值压缩计算为一个标量 | `max(x)`, `min(x)`, `sum(x)`, `avg(x)` |
| **`COUNT(*)`** | 统计组内记录总行数 | `SELECT count(*) FROM table;` |
| **`DISTINCT`** | 聚合前先剔除重复取值 | `count(DISTINCT col)`, `sum(DISTINCT col)` |
| **`GROUP BY`** | 将数据集按指定列或表达式划分为多个子组 | `GROUP BY category, status` |
| **`HAVING`** | 对聚合后的分组施加布尔过滤条件 | `HAVING count(*) > 5 AND avg(score) >= 60` |
| **`WHERE` vs `HAVING`** | 预过滤原始行 vs 过滤汇总后的组 | 先 `WHERE`，再 `GROUP BY`，后 `HAVING` |

---

