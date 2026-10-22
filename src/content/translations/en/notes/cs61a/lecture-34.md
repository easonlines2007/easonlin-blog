---
kind: notes
source: cs61a/lecture-34
title: Lecture 34 · Tables, Joins, and Relational Operations
description: "CS61A Lecture 34: Joining multiple tables and relational operations."
sourceHash: 2cd7e5c58712fa800d6bbbed0e6c3f7d7e7e0b687ca9891a28dd4cd0ebade674
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-34).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 24:54 ｜ **Video link back**: [B station response unit set (P34)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34)

## 1. The essence of table connections: the Fundamentals of Joins

In SQL, the most basic connection grammar is that it's a way to connect to something.  `FROM`  Use of commas in sentences  `,`  The following table separates tables:

```sql
SELECT * FROM table_a, table_b;
```

![The Fundamentals of Joins (00:00:32) · lecture board illustration](</attachments/cs61a-bec8f59c5c710f4768997b5f.png>)
*⏱ Timestamp: 00:00:32 · 📷 Lecture screenshot · [Watch clip (P34 00:00:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=32)*

The underlying mathematical essence is that **The following is a list of the most commonly used names for the name "Cartesian product".**: 
- If the table  $A$  Yes, I did.  $M$  Line, table  $B$  Yes, I did.  $N$  Line, the connection will generate contain  $M \times N$  The large middle combinations of lines;
- Each result line contains a horizontal from the table  $A$  All columns and from tables  $B$  All the rows.

---

## 2. Case in point: Dogs & Parents Tables combined with the dog's pedigree

Introduced in the second table  `dogs` The first is the "High-Level" of the dog. `fur`): 

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

![The Dogs & Parents Tables (00:01:32) · lecture board illustration](</attachments/cs61a-7995e9a6eef65b0543e029df.png>)
*⏱ Timestamp: 00:01:32 · 📷 Lecture screenshot · [Watch clip (P34 00:01:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=92)*

Now, the genealogy is  `parents`  In the table, hair information is  `dogs`  The following is the list of the most commonly used methods for calculating the value of a currency. **Who are the parents of all these curly dogs?**

```sql
SELECT parent FROM parents, dogs
WHERE child = name AND fur = "curly";
```

![The Dogs & Parents Tables (00:02:32) · lecture board illustration](</attachments/cs61a-df59ccc1d17cb446a367f721.png>)
*⏱ Timestamp: 00:02:32 · 📷 Lecture screenshot · [Watch clip (P34 00:02:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=152)*

![The Dogs & Parents Tables (The Dogs &Parents Tables) · lecture board illustration (00:04:00)](</attachments/cs61a-1d7cf72773979b247cf70d21.png>)
*⏱ Timestamp: 00:04:00 · 📷 Lecture screenshot · [Watch clip (P34 00:04:00)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=240)*

![The Dogs & Parents Tables (The Dogs &Parents Tables) · lecture board illustration (00:05:04)](</attachments/cs61a-7242959903af8f70583fbfa0.png>)
*⏱ Timestamp: 00:05:04 · 📷 Lecture screenshot · [Watch clip (P34 00:05:04)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=304)*

- `child = name` Linking Conditions: Join Condition, matching the names of the children in parent list with those in dog list;
- `fur = "curly"`: attribute filtering conditions, only curly hair varieties;
- The results of the survey were accurate: `delano` (Herbert's father) and  `eisenhower` I'm not sure what the hell happened to you.

---

## 3. Name and point expression: Self-Join & Aliases

When two tables have the same column name, or\*\* connect the same table to itself (Self-Join) **The name of the list will create a conflict between the names of life.** The first is the name of the game. **and** The point of expression (Dot Expressions) \*\* is to eliminate discrimination.

![Table aliases expression: Self-connected (Self-Join & Aliases) lecture board illustration (00:06:10)](</attachments/cs61a-b58be0eb574aa88eb4c56d49.png>)
*⏱ Timestamp: 00:06:10 · 📷 Lecture screenshot · [Watch clip (P34 00:06:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=370)*

### Find all the Siblings

Two dogs are brothers and sisters if they have the same parents.  `parents`  And we have to make sure that  `parents`  The first is the link to self:

```sql
SELECT a.child AS first, b.child AS second
FROM parents AS a, parents AS b
WHERE a.parent = b.parent AND a.child < b.child;
```

![Looking for all brothers and sisters. lecture board illustration (00:07:17)](</attachments/cs61a-ed3b7d83a6fd0c44162bf183.png>)
*⏱ Timestamp: 00:07:17 · 📷 Lecture screenshot · [Watch clip (P34 00:07:17)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=437)*

![Looking for all brothers and sisters. lecture board illustration (00:08:50)](</attachments/cs61a-de17b370a775aa51066a7110.png>)
*⏱ Timestamp: 00:08:50 · 📷 Lecture screenshot · [Watch clip (P34 00:08:50)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=530)*

### Why do you have to write?  `a.child < b.child`?
1. **How to prevent self-doubting** If there are no restrictions, every dog becomes his brother. `barack`  and  `barack`); 
2. **Eliminating the repetition of symmetry** If only it were written:  `a.child != b.child` And the results will appear simultaneously.  `(barack, clinton)`  and  `(clinton, barack)`; 
3. **Mandatory dictionary order** By strictly minus:  `<` The first is that the two brothers and sisters are only shown once, with their names arranged alphabetically.

---

## 4. Multi-Table Joins: Building a multi-table joins with three tables

### Step 1: Create a list of grandparents  `grandparents`

My grandfather is my father's father.  `parents`  The table is linked to the following two:

```sql
CREATE TABLE grandparents AS
  SELECT a.parent AS grandog, b.child AS grandpup
  FROM parents AS a, parents AS b
  WHERE a.child = b.parent;
```

![Step 1: Constructing the grandparents lecture board illustration (00:10:24)](</attachments/cs61a-8d768fe681b3a957612740b6.png>)
*⏱ Timestamp: 00:10:24 · 📷 Lecture screenshot · [Watch clip (P34 00:10:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=624)*

For example,  `eisenhower`  Yes, I did.  `fillmore`  father, and  `fillmore`  Yes, I did.  `abraham`  The father of the  `(eisenhower, abraham)`  Yes, my grandfather did.

### Step 2: Three-table connecting motherfuckers looking for the same grandparents to pair

**Challenges** Find a combination of all the hairstyles of my grandfather and his grandson that are exactly the same.

We need to get the hair of our grandfather and my grandson at the same time, so we need to make sure that we can have a better relationship with them.  `grandparents`  And two  `dogs`  The following table lists:

```sql
SELECT grandog, grandpup
FROM grandparents, dogs AS c, dogs AS d
WHERE grandog = c.name AND grandpup = d.name AND c.fur = d.fur;
```

![Step 2: Three-table linking motherfuckers looking for the same haired grandson to lecture board illustration (00:11:56)](</attachments/cs61a-31a99663316b4ddc309dda9c.png>)
*⏱ Timestamp: 00:11:56 · 📷 Lecture screenshot · [Watch clip (P34 00:11:56)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=716)*

![Step 2: Three-table linking motherfuckers looking for the same hair and grandfather to lecture board illustration (00:13:35)](</attachments/cs61a-50cfff9b0c9150bca82a4657.png>)
*⏱ Timestamp: 00:13:35 · 📷 Lecture screenshot · [Watch clip (P34 00:13:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=815)*

The database engine combines three scans of the family's two eligible pairs:
- `eisenhower`  and  `grover` The two women are both short-haired.
- `fillmore`  and  `herbert` (Both are curly hair).

---

## Numerical Expressions in Joins (NJ) 5.

SQL is supported on  `SELECT`, `WHERE`, `ORDER BY`  Free use of rich mathematical functions and arithmetic operators:

![Numerical Expressions in Joins (NJ) · lecture board illustration (00:15:16)](</attachments/cs61a-807a5611f93b79438983958c.png>)
*⏱ Timestamp: 00:15:16 · 📷 Lecture screenshot · [Watch clip (P34 00:15:16)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=916)*

### Distance analysis of the city's north-south latitudes

So, we're going to do this by a few hundred kilometers.  `cities`  The following is a list of the cities and towns in the country of origin.

```sql
CREATE TABLE distances AS
  SELECT a.name AS first, b.name AS second,
         60 * (b.latitude - a.latitude) AS distance
  FROM cities AS a, cities AS b;
```

![Urban North-South distance analysis lecture board illustration (00:17:27)](</attachments/cs61a-57cad6bfc4abba742dfca93b.png>)
*⏱ Timestamp: 00:17:27 · 📷 Lecture screenshot · [Watch clip (P34 00:17:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1047)*

The first is the southernmost point of the city, which is roughly parallel to the northernmost part of the state.
```sql
SELECT second FROM distances
WHERE first = "Minneapolis"
ORDER BY distance;
```

![Urban North-South distance analysis lecture board illustration (00:18:32)](</attachments/cs61a-9e499ea1f6bb6dac20c61ed4.png>)
*⏱ Timestamp: 00:18:32 · 📷 Lecture screenshot · [Watch clip (P34 00:18:32)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1112)*

In the front row are Miami, in warm sunshine, and San Diego, which perfectly demonstrate the real power of relationship projection and order.

---

## String Expressions & Anti-Patterns (STRAP) and other threads are also used.

SQL provides two-way traffic  `||`  The string spelling operator:

```sql
SELECT "hello" || ", " || "world"; -- => "hello, world"
```

![String Expressions & Anti-Patterns (STR) · lecture board illustration (00:19:40)](</attachments/cs61a-977068a1b921f07998391986.png>)
*⏱ Timestamp: 00:19:40 · 📷 Lecture screenshot · [Watch clip (P34 00:19:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1180)*

### Architecture Warning: Storing complex data structures using strings in relational databases is a serious counter-pattern

![Architecture alert: Storage of complex data structures with strings in relation databases is a serious counter-model lecture board illustration (00:21:40)](</attachments/cs61a-f3c4a1a4225a67546f42dd3f.png>)
*⏱ Timestamp: 00:21:40 · 📷 Lecture screenshot · [Watch clip (P34 00:21:40)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1300)*

Some beginners try to use comma separators in a single string column to store data similar to linked lists or arrays, such as:  `"1,2,3,4"` And then we're going to use the complex  `substr`  and  `instr`  The following is a list of the most commonly used methods:
- This completely destroys the first paradigm of a relational database (NF1, atomicity of columns);
- The resulting failure to establish an effective index and a steep decline in query performance;
- The right thing to do is always **Divide the elements into independent polynomials in a relation table (Records)**!

---

## 7. Hobby practice: Generating Sentences (NAS) is a natural language sentence that is automatically generated using the Descartes.

Using the characteristic of Descartes's summation of all possible states, we can use SQL to automatically generate the correct phrases in syntax:

```sql
CREATE TABLE nouns AS
  SELECT "the dog" AS word UNION
  SELECT "the cat"         UNION
  SELECT "the bird";

SELECT a.word || " chased " || b.word
FROM nouns AS a, nouns AS b
WHERE a.word != b.word;
```

![Interesting practice: Auto-generation of natural language sentences by Cartesian (Generating Science) lecture board illustration (00:23:19)](</attachments/cs61a-8feed44bbef4af654d293cea.png>)
*⏱ Timestamp: 00:23:19 · 📷 Lecture screenshot · [Watch clip (P34 00:23:19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=34&t=1399)*

The output lists all possible chase scenarios:
- "the bird chased the cat"
- "the dog chased the bird"
- "the cat chased the dog" ...

Further introduction of the word list  `ands` The same can be said of the complex long lines, such as "the dog and the bird chased the cat and the dog".

---

## The key points of the review

| Core technologies | Examples of grammar | Key points |
| :--- | :--- | :--- |
| **The following is a list of the topics covered:** | `FROM A, B WHERE A.id = B.id` | The bottom layer generates a decarbulum, which must pass through the  `WHERE`  Provides matching keystrokes |
| **Self-joining** | `FROM T AS A, T AS B` | The same name must be given different names, through the  `<`  Avoid self-pair and symmetry redundancy |
| **Joining multiple tables** | `FROM T1, T2 AS A, T2 AS B` | Allows multiple references to the same physical table |
| **Order by order** | `ORDER BY expr ASC/DESC` | Directly ordered by computational derivative or expression |
| **String spelling** | `str1 \|\| str2` | It is used for spelling text, and strictly prohibits string-coding complex relationship data. |

---

