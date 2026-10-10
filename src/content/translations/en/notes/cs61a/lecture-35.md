---
kind: notes
source: cs61a/lecture-35
title: Lecture 35 · Aggregation and Group By
description: "CS61A Lecture 35: Data aggregation and grouped statistics."
sourceHash: 879bc425d6c1e3b9c0a2a1e32549638e4fb9c18d5af3f2ea59b91c3a0b9990d3
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 17:30 ｜ **Video link back**: [B station response unit (P35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35)

## 1. Single-line evaluation vs aggregation functions (Row-level vs Aggregate Functions)

The regular SQL expression runs independently on each line:

![Single-line evaluation vs. AggregateFunctions . lecture board illustration (00:00:32)](</attachments/cs61a-ec9a9c3bbf8716f67467f8cc.png>)
*⏱ Timestamp: 00:00:32 · 📷 Lecture screenshot · [Watch clip (P35 00:00:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=32)*

The aggregate function (Aggregate Function) receives a set of rows (Group of Rows) as input, folds them and compresses them to calculate a sum of the parameters.

### Practice Dataset: Animal Features  `animals`

The first step is to introduce a number of legs. `legs` (A) and weight `weight` The following is a list of animals:

```sql
CREATE TABLE animals AS
  SELECT "dog"     AS kind, 4 AS legs, 20    AS weight UNION
  SELECT "cat",             4,         10              UNION
  SELECT "ferret",          4,         10              UNION
  SELECT "parrot",          2,         6               UNION
  SELECT "penguin",         2,         10              UNION
  SELECT "t-rex",           2,         12000;
```

![Operational data sets: animal characterization tables Animals lecture board illustration (00:01:34)](</attachments/cs61a-5cfacf0ce02c3846e6099c30.png>)
*⏱ Timestamp: 00:01:34 · 📷 Lecture screenshot · [Watch clip (P35 00:01:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=94)*

---

## 2. Basic aggregation functions and combinations of arithmetic (`MAX`, `MIN`, `SUM`, `AVG`)

when  `SELECT`  The expression has a function of aggregation and no  `GROUP BY`  The entire table is considered by default as **A global group** The output results are forced to be combined into single lines:

```sql
SELECT max(legs) FROM animals; -- => 4
SELECT sum(weight) FROM animals; -- => 12056
```

![The following table shows the basic aggregation functions and combinations of arithmetic (MAX, MIN, SUM, AVG) · lecture board illustration (00:02:34)](</attachments/cs61a-48f2711b4c187ea83e9fe487.png>)
*⏱ Timestamp: 00:02:34 · 📷 Lecture screenshot · [Watch clip (P35 00:02:34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=154)*

![The following table shows the basic aggregation functions and combinations of arithmetic (MAX, MIN, SUM, AVG) · lecture board illustration (00:03:27)](</attachments/cs61a-e894a8fe3330c11621444b99.png>)
*⏱ Timestamp: 00:03:27 · 📷 Lecture screenshot · [Watch clip (P35 00:03:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=207)*

### Calculation of the internal and external functions of a polymer

- The complex single-line expression can be embedded within the polymer function: `max(legs - weight)`; 
- Four operations can be performed directly between multiple polymorphic functions:
  ```sql
  SELECT max(legs) - min(weight) FROM animals; -- => 4 - 6 = -2
  ```

![Convergence function internal and external algorithms lecture board illustration (00:04.30%)](</attachments/cs61a-d221da49d6c7972eae435d0f.png>)
*⏱ Timestamp: 00:04:30 · 📷 Lecture screenshot · [Watch clip (P35 00:04:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=270)*

### Cooperation  `WHERE`  Prefilter

`WHERE`  The phrase is always about aggregating computation. **Before** The results:

```sql
-- 排除霸王龙 (t-rex) 后的最大体重
SELECT max(weight) FROM animals WHERE kind != "t-rex"; -- => 20 (狗)
```

![lecture board illustration (00:05:03)](</attachments/cs61a-5178ee86478cd8cde0103dd5.png>)
*⏱ Timestamp: 00:05:03 · 📷 Lecture screenshot · [Watch clip (P35 00:05:03)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=303)*

---

## 3. Count and count (`COUNT(*)` vs `COUNT(DISTINCT)`)

The most common syntax for statistical lines is  `COUNT(*)`: 

```sql
SELECT count(*) FROM animals; -- => 6
```

![Count & delete (COUNT(\*) vs COUNT(DISTINCT)) lecture board illustration (00:06:10)](</attachments/cs61a-dbfd1007e7f0cc9d8474c10b.png>)
*⏱ Timestamp: 00:06:10 · 📷 Lecture screenshot · [Watch clip (P35 00:06:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=370)*

### `DISTINCT`  Keyword elimination of repeat values

If you need to remove the repeat value before the addition, add it to the list of names  `DISTINCT`: 

```sql
SELECT count(DISTINCT legs) FROM animals; -- => 2 (只有 2 和 4 两种腿数)
SELECT sum(DISTINCT weight) FROM animals; -- => 20 + 10 + 6 + 12000 = 12036 (10 仅计算一次)
```

---

## 4. Semantic trap for mixing columns with aggregates

If you're  `SELECT`  The second is the number of columns that are represented by a polynomial.  `SELECT max(weight), kind FROM animals` What will happen?

![Aggregation function mixed with non-aggregates. lecture board illustration (00:07:10)](</attachments/cs61a-8d337659b671bed8b0a1cb1b.png>)
*⏱ Timestamp: 00:07:10 · 📷 Lecture screenshot · [Watch clip (P35 00:07:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=430)*

![Synthetic trap (Mixing Colombias with Aggregates) lecture board illustration (00:08:10)](</attachments/cs61a-3b9cf9440942714fb1eb999e.png>)
*⏱ Timestamp: 00:08:10 · 📷 Lecture screenshot · [Watch clip (P35 00:08:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=490)*

![Aggregation function and syntax trap (Mixing Colombias with Aggregates) lecture board illustration (00:09:48)](</attachments/cs61a-4983b7eba57de2272f503717.png>)
*⏱ Timestamp: 00:09:48 · 📷 Lecture screenshot · [Watch clip (P35 00:09:48)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=588)*

1. **The question is: `MAX`/`MIN`)** In SQLite, the following is a list of the most commonly used methods: `max(weight), kind`  The most important data is the output of the whole row.  `12000, t-rex` The report also states that the Commission's proposal for a directive on the protection of intellectual property rights and fundamental freedoms is not in line with the requirements of this Directive.
2. **Multi-matching uncertainty**:Execute  `SELECT max(legs), kind FROM animals`  When there are three animals (dog, cat and ferret) with all four legs, the database will randomly/ arbitrarily select one, losing its explicit orientation;
3. **It is completely meaningless. `AVG`/`SUM`)**:Execute  `SELECT avg(weight), kind FROM animals`  The average weight was in 2009, but the animals returned to their home country were  `t-rex` Because the mean value is generated by all lines together, no single animal mole represents the mean value!

> **Best practices** Extensions: Unless specific database extensions are used explicitly  `SELECT`  The list should contain only the aggregation function or appear in  `GROUP BY`  The column.

---

## 5. Data grouping snippets: `GROUP BY`  clause

By default, the entire table is a large group.  `GROUP BY`  The only value that can be used for an expression is the data. **Divided into several independent subgroups** The group is composed of a number of sub-groups:

```sql
SELECT legs, max(weight) FROM animals GROUP BY legs;
```

![Data group slice: GROUP BY Sub-word lecture board illustration (00:11:26)](</attachments/cs61a-8a9af6b8a705170b25edcadc.png>)
*⏱ Timestamp: 00:11:26 · 📷 Lecture screenshot · [Watch clip (P35 00:11:26)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=686)*

![Data Group Slices: GRUP BY Substatement lecture board illustration (00:12:31)](</attachments/cs61a-55218558763cc247e8b05ed3.png>)
*⏱ Timestamp: 00:12:31 · 📷 Lecture screenshot · [Watch clip (P35 00:12:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=751)*

The execution process:
1. Get all the tracks  `legs`  The value is divided into two groups: `legs = 2`  The group and  `legs = 4`  The group;
2. In  `legs = 4`  The largest weight in the group ((dog, cat, ferret)): `20`; 
3. In  `legs = 2`  The largest weight in the group (parrot, penguin, t-rex) was: `12000`; 
4. The output of the new results table contains two lines of aggregate statistics!

![Data Group Slices: GRUP BY Substatement lecture board illustration (00:13:29)](</attachments/cs61a-ac1df151fba1ef627fa48b92.png>)
*⏱ Timestamp: 00:13:29 · 📷 Lecture screenshot · [Watch clip (P35 00:13:29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=809)*

---

## 6. Grouping by Multiple Columns & Expressions

### Multiple complex groups

```sql
SELECT legs, weight, count(*) FROM animals GROUP BY legs, weight;
```

![Multi-column Group lecture board illustration (00:14:32)](</attachments/cs61a-bab6ddf8cdca8837965fa56f.png>)
*⏱ Timestamp: 00:14:32 · 📷 Lecture screenshot · [Watch clip (P35 00:14:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=872)*

Just two lines  `legs`  and  `weight`  The same group is not exactly the same as the cat and ferret.

### The weight of the legs is calculated by dividing the expression:

```sql
SELECT max(kind), weight / legs FROM animals GROUP BY weight / legs;
```

![By expression grouping: Weight / Legs lecture board illustration (00:15:07)](</attachments/cs61a-646b207f34458d38691b3054.png>)
*⏱ Timestamp: 00:15:07 · 📷 Lecture screenshot · [Watch clip (P35 00:15:07)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=907)*

SQLite defaulted to perform integer subtraction, the only ratio of each animal's weight divided by its legs.

---

## 7. Filter the condition after grouping: `HAVING`  clause (`WHERE` vs `HAVING`)

Here are the most common SQL core points for beginners to confuse: **I'm going through the tunnel. `WHERE` The film is a sequel to the movie. `HAVING` The difference between the two**.

![Condition filter after grouping: HAVING sub-word (WHERE vs HAVING) lecture board illustration (00:16:10)](</attachments/cs61a-5c40e5190e064f5161935fb7.png>)
*⏱ Timestamp: 00:16:10 · 📷 Lecture screenshot · [Watch clip (P35 00:16:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=970)*

![Condition filter after grouping: HAVING sub-word (WHERE vs HAVING) lecture board illustration (00:16:40)](</attachments/cs61a-7824d4bcf761d067d63f810b.png>)
*⏱ Timestamp: 00:16:40 · 📷 Lecture screenshot · [Watch clip (P35 00:16:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=35&t=1000)*

| Keyword | Production time | Filtered objects | Can you use the polymer function? |
| :--- | :--- | :--- | :--- |
| **`WHERE`** | Grouping  **Before**  Implementation | Individual rows of data | **Absolutely not.** |
| **`HAVING`** | Grouping and aggregation  **Afterwards**  Implementation | Aggregated Groups | **Can and often** |

### Cases: only group with more than 1 reserved members

```sql
SELECT weight / legs, count(*)
FROM animals
GROUP BY weight / legs
HAVING count(*) > 1;
```

- The number of animals  `weight / legs`  and groupings;
- The only group of animals that is isolated `count(*) = 1` (In the UK)  `HAVING`  The stage is directly filtered and discarded;
- The only thing that is left to the people who have more animals than they can fit in with their legs!

---

## The key points of the review

| The core components | Key Functions | Typical code examples |
| :--- | :--- | :--- |
| **The polynomial function** | Calculate the multi-line numerical compression as a metric | `max(x)`, `min(x)`, `sum(x)`, `avg(x)` |
| **`COUNT(*)`** | Total number of lines recorded in the statistical group | `SELECT count(*) FROM table;` |
| **`DISTINCT`** | The first phase of the integration is eliminating repeat devaluations. | `count(DISTINCT col)`, `sum(DISTINCT col)` |
| **`GROUP BY`** | Divide the data set into multiple subgroups by specified column or expression | `GROUP BY category, status` |
| **`HAVING`** | The following is a list of the most common types of aggregate filters used in the manufacture of aggregates: | `HAVING count(*) > 5 AND avg(score) >= 60` |
| **`WHERE` vs `HAVING`** | Prefilter the original line vs group after filtering sum | First of all.  `WHERE` I'm going to go.  `GROUP BY` After  `HAVING` |

---

