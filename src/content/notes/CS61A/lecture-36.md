---
title: Lecture 36 · 数据库系统与 Python 交互 (Databases & Python Integration)
description: CS61A 第 36 讲：数据库系统与 Python 交互 (Databases & Python Integration)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 36
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：26:22 ｜ **视频回链**：[B 站对应单集 (P36)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36)

## 1. 表的定义、约束与销毁 (DDL: `CREATE TABLE` & `DROP TABLE`)

在真实的生产环境中，我们往往先定义一个空表的表结构（Schema），并施加列级约束：

```sql
CREATE TABLE IF NOT EXISTS primes (
  n INTEGER UNIQUE,
  prime INTEGER DEFAULT 1
);
```

![表的定义、约束与销毁 (DDL: CREATE TABLE & DROP TABLE) · 课堂板书演示 (00:00:30)](</attachments/cs61a-82ba25e3a5aa4f7359d81f9c.png>)
*⏱ 时间戳：00:00:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:00:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=30)*

![表的定义、约束与销毁 (DDL: CREATE TABLE & DROP TABLE) · 课堂板书演示 (00:02:22)](</attachments/cs61a-3ba51bb5bb4e267f698570c4.png>)
*⏱ 时间戳：00:02:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:02:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=142)*

- `UNIQUE`：唯一性约束，杜绝重复主键插入；
- `DEFAULT <value>`：默认值约束，当插入记录未指定该列时自动填入默认值；
- `DROP TABLE IF EXISTS <name>`：安全销毁表，若表不存在则不会报错。

---

## 2. 插入新记录：`INSERT INTO` 详解

`INSERT INTO` 语句用于向已有表中追加行：

![插入新记录：INSERT INTO 详解 · 课堂板书演示 (00:03:52)](</attachments/cs61a-6e1afd96a962f15b5871e517.png>)
*⏱ 时间戳：00:03:52 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:03:52)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=232)*

![插入新记录：INSERT INTO 详解 · 课堂板书演示 (00:05:22)](</attachments/cs61a-77c6511c6326c35162d8b0ff.png>)
*⏱ 时间戳：00:05:22 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:05:22)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=322)*

### 形式 1：插入显式值元组
```sql
INSERT INTO primes (n, prime) VALUES (2, 1), (3, 1);
```

### 形式 2：依赖默认值插入部分列
```sql
INSERT INTO primes (n) VALUES (4), (5), (6), (7);
-- 列 prime 自动填充 DEFAULT 1
```

### 形式 3：通过 `SELECT` 查询批量插入
```sql
INSERT INTO primes (n) SELECT n + 6 FROM primes;
```

![形式 3：通过 SELECT 查询批量插入 · 课堂板书演示 (00:07:27)](</attachments/cs61a-d01e5f256e837d0180e9ea2a.png>)
*⏱ 时间戳：00:07:27 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:07:27)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=447)*

通过将已有表的数据自增后批量导回，可快速生成大批量测试序列。

---

## 3. 修改与删除数据：`UPDATE` 与 `DELETE` (SQL 埃氏筛法)

### `UPDATE` 语句：条件更新

```sql
UPDATE <table_name> SET <col> = <expr> WHERE <condition>;
```

![UPDATE 语句：条件更新 · 课堂板书演示 (00:08:25)](</attachments/cs61a-ed0b527287d0293a33449e6c.png>)
*⏱ 时间戳：00:08:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:08:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=505)*

DeNero 教授展示了如何利用 `UPDATE` 在 SQL 中直接实现**埃拉托斯特尼筛法（Sieve of Eratosthenes）**，将所有合数的 `prime` 标志置为 0：

```sql
-- 将所有大于 2 的 2 的倍数标记为合数 (0)
UPDATE primes SET prime = 0 WHERE n > 2 AND n % 2 = 0;

-- 依次筛选 3 和 5 的倍数
UPDATE primes SET prime = 0 WHERE n > 3 AND n % 3 = 0;
UPDATE primes SET prime = 0 WHERE n > 5 AND n % 5 = 0;
```

![UPDATE 语句：条件更新 · 课堂板书演示 (00:09:25)](</attachments/cs61a-910180db2b0d429ab9c6dab7.png>)
*⏱ 时间戳：00:09:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:09:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=565)*

### `DELETE` 语句：清理数据

筛选完毕后，利用 `DELETE FROM` 彻底删除所有合数行：

```sql
DELETE FROM primes WHERE prime = 0;
SELECT * FROM primes; -- 仅剩纯素数: 2, 3, 5, 7, 11, 13, 17, 19, 23...
```

![DELETE 语句：清理数据 · 课堂板书演示 (00:10:25)](</attachments/cs61a-57e56f7619d2e6a03e3bcc9c.png>)
*⏱ 时间戳：00:10:25 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:10:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=625)*

---

## 4. Python 与 SQLite 的标准库集成 (`sqlite3`)

Python 标准库内置了对 SQLite 的无缝支持，其核心通信流程包含四个关键步骤：

![Python 与 SQLite 的标准库集成 (sqlite3) · 课堂板书演示 (00:11:30)](</attachments/cs61a-d1fec948ce268a433753d179.png>)
*⏱ 时间戳：00:11:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:11:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=690)*

![Python 与 SQLite 的标准库集成 (sqlite3) · 课堂板书演示 (00:12:31)](</attachments/cs61a-d8e14d8e3687bce132b2b798.png>)
*⏱ 时间戳：00:12:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:12:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=751)*

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

![提交事务，物理持久化至磁盘 · 课堂板书演示 (00:13:31)](</attachments/cs61a-26a1e05df59f302fef911165.png>)
*⏱ 时间戳：00:13:31 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:13:31)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=811)*

如果不调用 `db.commit()`，所有数据修改仅停留在内存缓冲区中，进程退出后将不会持久化到磁盘文件 `n.db` 中。

---

## 5. 多客户端并发与共享状态 (Database Concurrency)

数据库的最伟大之处在于：**允许多个不同的独立应用程序在同一时刻读写同一个数据库文件**。

![多客户端并发与共享状态 (Database Concurrency) · 课堂板书演示 (00:15:01)](</attachments/cs61a-3d72a8dd565512f674886a25.png>)
*⏱ 时间戳：00:15:01 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:15:01)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=901)*

### 案例设计：21 点纸牌游戏（Blackjack）

游戏规则：
- 点数计算：2-10 为面值，J/Q/K 计 10 点，A 可计 1 点或 11 点；
- 庄家（Dealer）与闲家（Player）；
- 超过 21 点为爆牌（Bust）直接落败；
- 庄家隐藏一张底牌，直到玩家停牌（Stay）后才翻开，且庄家在未满 17 点时必须强制要牌。

![案例设计：21 点纸牌游戏（Blackjack） · 课堂板书演示 (00:16:28)](</attachments/cs61a-aa32fac60c62e05c78fc2c3f.png>)
*⏱ 时间戳：00:16:28 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:16:28)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=988)*

![案例设计：21 点纸牌游戏（Blackjack） · 课堂板书演示 (00:18:24)](</attachments/cs61a-6b996526fc0766d484b4899e.png>)
*⏱ 时间戳：00:18:24 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:18:24)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1104)*

---

## 6. 趣味实战：双客户端黑客视角的 21 点博弈

游戏运行架构：
- 进程 1：Python 脚本 `blackjack.py`，负责洗牌、发牌并更新 `cards.db` 中的 `cards` 表；
- 进程 2：独立的 `sqlite3 cards.db` 命令行客户端，由人类玩家并发接入。

### 阶段 1：偷看庄家底牌与暗箱决策

在 Python 终端询问是否要牌（Hit/Stay）时，玩家在旁边的 SQLite 终端直接执行：
```sql
SELECT * FROM cards WHERE who != "discard";
```

![阶段 1：偷看庄家底牌与暗箱决策 · 课堂板书演示 (00:21:45)](</attachments/cs61a-a1e355282304ec2958a625a4.png>)
*⏱ 时间戳：00:21:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:21:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1305)*

直接查看到了庄家那张尚未公开的暗牌，从而做出胜率最高的停牌决策！

### 阶段 2：用 SQL 聚合进行专业“算牌” (Card Counting)

在不违反规则（仅观察弃牌堆）的前提下，统计剩余卡牌中大牌（10、J、Q、K）的分布概率：

```sql
SELECT card, count(*) FROM cards GROUP BY card;
```

![阶段 2：用 SQL 聚合进行专业“算牌” (Card Counting) · 课堂板书演示 (00:24:10)](</attachments/cs61a-a33f91c8279e839e82d83dd0.png>)
*⏱ 时间戳：00:24:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:24:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1450)*

通过统计弃牌堆中大牌消耗极少，精确预测庄家下一张要牌必将拿到 10 点导致爆牌，从而果断选择停牌赢得胜利！

### 阶段 3：直接入侵数据库修改状态 (The Ultimate Mutation)

当拿到坏牌（14 点），面对庄家明牌 9 点的必败绝境时，玩家直接在命令行向数据库发出实时修改指令：

```sql
UPDATE cards SET card = "A" WHERE who = "player" AND card = "4";
```

![阶段 3：直接入侵数据库修改状态 (The Ultimate Mutation) · 课堂板书演示 (00:25:39)](</attachments/cs61a-aaf17292d8d331d9cbd773ca.png>)
*⏱ 时间戳：00:25:39 · 📷 课堂截图 · [在 B 站观看对应片段 (P36 00:25:39)](https://www.bilibili.com/video/BV1sy411z7nA/?p=36&t=1539)*

此时回到 Python 游戏中，游戏逻辑一读取数据库，惊讶地发现玩家手牌已变成 Ace + Queen（标准的 21 点天王 Blackjack），直接判定玩家获胜！

这生动展现了数据库作为**全局单点真实数据源（Single Source of Truth）**的核心特征：任何客户端提交的修改，都会瞬时对所有其他连接生效。

---

## 核心复习要点总结

| 核心组件 | 关键用法与语法 | 核心语义与工程意义 |
| :--- | :--- | :--- |
| **`INSERT INTO`** | `INSERT INTO t VALUES (...);` | 追加新行，支持全量列、部分列与 `SELECT` 批量导入 |
| **`UPDATE`** | `UPDATE t SET col = val WHERE cond;` | 条件就地更新指定列，务必带上 `WHERE` 防全表误伤 |
| **`DELETE FROM`** | `DELETE FROM t WHERE cond;` | 条件删除指定行，表结构依然完好保留 |
| **`sqlite3.connect`** | `db = sqlite3.connect('file.db')` | Python 与 SQLite 建立物理文件会话 |
| **`db.commit()`** | `db.commit()` | 将事务中的所有修改持久化刷入磁盘文件 |
| **并发与共享状态** | 统一数据库文件作为全局状态中枢 | 支持多进程、多网络客户端安全交互与实时协同 |

---

