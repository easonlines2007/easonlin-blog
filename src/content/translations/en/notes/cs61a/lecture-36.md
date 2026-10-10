---
kind: notes
source: cs61a/lecture-36
title: Lecture 36 · Databases and Python Integration
description: "CS61A Lecture 36: Database systems and interacting with them from Python."
sourceHash: fb4ee4f4e872a0e463117390def30fee2464bc0ca5134290bf3b0ee8f7365afb
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 26:22 ｜ **Video link back**: [B station response unit (P36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36)

## 1. Definition, constraint and destruction of the table (DDL:  `CREATE TABLE` & `DROP TABLE`)

In real production environments, we often define the structure of a table in an empty space (Schema) and impose class-level constraints:

```sql
CREATE TABLE IF NOT EXISTS primes (
  n INTEGER UNIQUE,
  prime INTEGER DEFAULT 1
);
```

![Table definition, restraint and destruction (DDL: CREATE TABLE & DROP TABLE) lecture board illustration (00:30)](</attachments/cs61a-82ba25e3a5aa4f7359d81f9c.png>)
*⏱ Timestamp: 00:00:30 · 📷 Lecture screenshot · [Watch clip (P36 00:00:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=30)*

![Table definition, restraint and destruction (DDL: CREATE TABLE & DROP TABLE) lecture board illustration (00:02:22)](</attachments/cs61a-3ba51bb5bb4e267f698570c4.png>)
*⏱ Timestamp: 00:02:22 · 📷 Lecture screenshot · [Watch clip (P36 00:02:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=142)*

- `UNIQUE` The only sexual constraint is to eliminate the insertion of repeated keys.
- `DEFAULT <value>`: default constraint, when inserting records that do not specify the column, automatically fill in the default value;
- `DROP TABLE IF EXISTS <name>` The safety of the table is destroyed, and if it does not exist, there will be no error.

---

## 2. Add new records: `INSERT INTO`  Details

`INSERT INTO`  The following is a list of the most commonly used terms in the English language:

![Insert a new record: INSERT INTO Detail lecture board illustration (00:03:52)](</attachments/cs61a-6e1afd96a962f15b5871e517.png>)
*⏱ Timestamp: 00:03:52 · 📷 Lecture screenshot · [Watch clip (P36 00:03:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=232)*

![Insert new record: INSERT INTO Detailed lecture board illustration (00:05:22)](</attachments/cs61a-77c6511c6326c35162d8b0ff.png>)
*⏱ Timestamp: 00:05:22 · 📷 Lecture screenshot · [Watch clip (P36 00:05:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=322)*

### Form 1: Insert the exponential value group
```sql
INSERT INTO primes (n, prime) VALUES (2, 1), (3, 1);
```

### Form 2: Depending on the default value for inserting a column
```sql
INSERT INTO primes (n) VALUES (4), (5), (6), (7);
-- 列 prime 自动填充 DEFAULT 1
```

### Form 3: Passed  `SELECT`  Inquiry for batch insertion
```sql
INSERT INTO primes (n) SELECT n + 6 FROM primes;
```

![Form 3: Insert lecture board illustration through SELECT query batch (00:07:27)](</attachments/cs61a-d01e5f256e837d0180e9ea2a.png>)
*⏱ Timestamp: 00:07:27 · 📷 Lecture screenshot · [Watch clip (P36 00:07:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=447)*

By redirecting existing data from the expansion, large-scale test sequences can be quickly generated.

---

## 3. Modify and delete data: `UPDATE`  and  `DELETE`  (SQL E-Figure)

### `UPDATE`  Statement: Conditions updated

```sql
UPDATE <table_name> SET <col> = <expr> WHERE <condition>;
```

![UPDATE Statement: Update lecture board illustration (00:08:25)](</attachments/cs61a-ed0b527287d0293a33449e6c.png>)
*⏱ Timestamp: 00:08:25 · 📷 Lecture screenshot · [Watch clip (P36 00:08:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=505)*

Professor DeNero shows how to use the  `UPDATE`  Direct implementation in SQL **The first is the Sive of Eratosthenes.** And then we'll add all the numbers  `prime`  The symbol is set to 0:

```sql
-- 将所有大于 2 的 2 的倍数标记为合数 (0)
UPDATE primes SET prime = 0 WHERE n > 2 AND n % 2 = 0;

-- 依次筛选 3 和 5 的倍数
UPDATE primes SET prime = 0 WHERE n > 3 AND n % 3 = 0;
UPDATE primes SET prime = 0 WHERE n > 5 AND n % 5 = 0;
```

![UPDATE Statement: Update lecture board illustration (00:09:25)](</attachments/cs61a-910180db2b0d429ab9c6dab7.png>)
*⏱ Timestamp: 00:09:25 · 📷 Lecture screenshot · [Watch clip (P36 00:09:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=565)*

### `DELETE`  Statement: Clean up the data

After the screening, use  `DELETE FROM`  The following is a list of the most commonly used numerical methods:

```sql
DELETE FROM primes WHERE prime = 0;
SELECT * FROM primes; -- 仅剩纯素数: 2, 3, 5, 7, 11, 13, 17, 19, 23...
```

![DELETE Statement: Clearing Data lecture board illustration (00:10:25)](</attachments/cs61a-57e56f7619d2e6a03e3bcc9c.png>)
*⏱ Timestamp: 00:10:25 · 📷 Lecture screenshot · [Watch clip (P36 00:10:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=625)*

---

## 4. Python and SQLite standard database integration (`sqlite3`)

Python's standard library has built-in seamless support for SQLite, and its core communication process consists of four key steps:

![Python and SQLite standard library integration (sqlite3) · lecture board illustration (00:11:30)](</attachments/cs61a-d1fec948ce268a433753d179.png>)
*⏱ Timestamp: 00:11:30 · 📷 Lecture screenshot · [Watch clip (P36 00:11:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=690)*

![Python and SQLite standard library integration (sqlite3) · lecture board illustration (00:12:31)](</attachments/cs61a-d8e14d8e3687bce132b2b798.png>)
*⏱ Timestamp: 00:12:31 · 📷 Lecture screenshot · [Watch clip (P36 00:12:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=751)*

```python
import sqlite3

# 1. 建立与数据库文件的物理连接
db = sqlite3.connect("n.db")

# 2. 执行 DDL/DML 语句
db.execute("CREATE TABLE IF NOT EXISTS nums (val INTEGER);")

# 3. 参数化查询 (防御 SQL 注入)
for x in range(4, 7):
    db.execute("INSERT INTO nums VALUES (?);", (x,))

# 4. 执行查询并提取结果
cursor = db.execute("SELECT * FROM nums;")
rows = cursor.fetchall() # 返回元组列表: [(4,), (5,), (6,)]

# 5. 提交事务，物理持久化至磁盘
db.commit()
```

![Submission services, physical persistence to disk lecture board illustration (00:13:31)](</attachments/cs61a-26a1e05df59f302fef911165.png>)
*⏱ Timestamp: 00:13:31 · 📷 Lecture screenshot · [Watch clip (P36 00:13:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=811)*

If not called  `db.commit()` All data changes remain in the memory buffer area only, and will not be permanently stored on disk files after the process leaves.  `n.db`  In the middle.

---

## 5. Multi-client concurrency with database currency

The greatest thing about the database is that: **It allows multiple independent applications to read and write the same database files at the same time.**.

![Multi-client simultaneous hair-sharing (Database Concurrence) . lecture board illustration (00:15:01)](</attachments/cs61a-3d72a8dd565512f674886a25.png>)
*⏱ Timestamp: 00:15:01 · 📷 Lecture screenshot · [Watch clip (P36 00:15:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=901)*

### The game is a game of cards, and it's called Blackjack.

The rules of the game:
- The score is calculated as: 2-10 for the value, J/Q/K for 10 points and A for 1 point or 11 points;
- The first is the "Dealer" and "Player".
- The first time the team lost to Busts was by more than 21 points.
- The dealer hides a card until the player stops playing and then turns it over, and the dealer must force the card before 17:00.

![Case design: 21-point card game (Blackjack) lecture board illustration (00:16:28)](</attachments/cs61a-aa32fac60c62e05c78fc2c3f.png>)
*⏱ Timestamp: 00:16:28 · 📷 Lecture screenshot · [Watch clip (P36 00:16:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=988)*

![Case design: 21-point card game (Blackjack) lecture board illustration (00:18:24)](</attachments/cs61a-6b996526fc0766d484b4899e.png>)
*⏱ Timestamp: 00:18:24 · 📷 Lecture screenshot · [Watch clip (P36 00:18:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1104)*

---

## The game is based on the game of thrones, which was developed by the same company.

The game's operating architecture:
- Process 1: Python script  `blackjack.py` The company is responsible for washing, distributing and updating the badges.  `cards.db`  in  `cards`  Table;
- Process 2: Independent  `sqlite3 cards.db`  The command line client is sent and accessed by human players.

### Step 1: Look at the back of the house and make decisions about the black box

When a Python terminal asks if it wants to hit/stay, the player directly executes the following on the SQLite terminal next door:
```sql
SELECT * FROM cards WHERE who != "discard";
```

![Stage 1: Spectrum bottom card and box decision lecture board illustration (00:21:45)](</attachments/cs61a-a1e355282304ec2958a625a4.png>)
*⏱ Timestamp: 00:21:45 · 📷 Lecture screenshot · [Watch clip (P36 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1305)*

The most successful card is the one that can be seen directly from the owner's unpublished black card and made a decision to stop playing!

### Stage 2: Professional Card Counting with SQL Aggregation

The probability of the distribution of cards in the remaining decks of cards is calculated as follows:

```sql
SELECT card, count(*) FROM cards GROUP BY card;
```

![Step 2: Professional Card Counting with SQL aggregation (00:24:10) · lecture board illustration](</attachments/cs61a-a33f91c8279e839e82d83dd0.png>)
*⏱ Timestamp: 00:24:10 · 📷 Lecture screenshot · [Watch clip (P36 00:24:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1450)*

By statistically spending very little on the card pile, accurately predicting that the next big card will get 10 points would result in a wild card, and thus decisively choosing to stop the card to win!

### Step 3: The Ultimate Mutation is a direct database modification.

When the bad card gets 14 points, the player sends real-time modification instructions to the database directly on the command line when faced with a 9 point loss.

```sql
UPDATE cards SET card = "A" WHERE who = "player" AND card = "4";
```

![Stage 3: Direct Access to Database Modification Status (The Ultimate Mutation) lecture board illustration (00:25:39)](</attachments/cs61a-aaf17292d8d331d9cbd773ca.png>)
*⏱ Timestamp: 00:25:39 · 📷 Lecture screenshot · [Watch clip (P36 00:25:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1539)*

Back in Python, game logic read the database and was surprised to find that the player's hand had become Ace + Queen (the standard 21 point King Blackjack) and immediately decided the winner!

This vividly demonstrates the core characteristics of a database as a single source of truth: any changes submitted by a client are instantaneously effective for all other connections.

---

## The key points of the review

| The core components | Key Usage and Syntax | Core Semantics and Engineering |
| :--- | :--- | :--- |
| **`INSERT INTO`** | `INSERT INTO t VALUES (...);` | Add new lines to support full-size columns, partial columns and  `SELECT`  Imported in bulk |
| **`UPDATE`** | `UPDATE t SET col = val WHERE cond;` | The conditions for updating the specified column must be brought  `WHERE`  to avoid accidentally affecting the entire table |
| **`DELETE FROM`** | `DELETE FROM t WHERE cond;` | Conditions for removing the specified line, table structure still intact |
| **`sqlite3.connect`** | `db = sqlite3.connect('file.db')` | Python and SQLite build physical file sessions |
| **`db.commit()`** | `db.commit()` | Persistent brush all changes in transactions to the disk file |
| **Share and share status** | Unified database files as a global state center | Support for multi-process, cross-network client security interaction and real-time sync |

---

