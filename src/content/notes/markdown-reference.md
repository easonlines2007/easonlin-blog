---
title: Markdown：公式、代码与表格
description: 一篇用于试读的排版参考，包含数学公式、代码块、表格和折叠内容。
date: 2026-10-02
topic: 写作与阅读
tags: [Markdown, 数学, 代码]
status: ready
publish: true
sample: true
---

## 让正文保持清楚

先写下结论，再补充解释和例子。段落之间保持适当留白，用二级、三级标题划分层次，右侧目录会跟随当前阅读的位置。

**加粗**适合强调关键结论，*斜体*可以表示术语，而 `行内代码` 适合变量名和简短命令。

## 数学公式

行内公式适合放在句子里。例如，向量的欧几里得范数记为 $\lVert x\rVert_2$。

较长的推导可以单独展示：

$$
\lVert x\rVert_2 = \sqrt{\sum_{i=1}^{n}x_i^2}
$$

### 一个矩阵例子

矩阵乘法需要前一个矩阵的列数等于后一个矩阵的行数：

$$
\begin{bmatrix}1 & 2\\3 & 4\end{bmatrix}
\begin{bmatrix}5\\6\end{bmatrix}
=\begin{bmatrix}17\\39\end{bmatrix}
$$

这个例子也可以用“矩阵”作为关键词，试一试站内搜索。

## 代码片段

代码块会显示语法高亮，并提供复制按钮。长行可以在代码块内横向滚动。

```python
def dot_product(a, b):
    if len(a) != len(b):
        raise ValueError("Vectors must have equal lengths")
    return sum(x * y for x, y in zip(a, b))

result = dot_product([1, 2, 3], [4, 5, 6])
print(result)  # 32
```

## 表格与列表

表格适合比较定义、条件或结论。在手机上，较宽的表格可以横向滚动。

| 符号        | 含义 | 例子           |
| ----------- | ---- | -------------- |
| $\in$       | 属于 | $x\in A$       |
| $\subseteq$ | 子集 | $A\subseteq B$ |
| $\cap$      | 交集 | $A\cap B$      |
| $\cup$      | 并集 | $A\cup B$      |

复习时，可以按下面的顺序重新检查：

1. 读懂定义里的条件。
2. 找到一个满足条件的例子。
3. 尝试构造一个边界情况。
4. 用自己的话解释结论。

## 引用与补充

> 给未来的自己留下足够的上下文，比保存更多零散片段更有用。

<details>
<summary>展开一条补充说明</summary>

折叠内容适合放推导过程、提示或较长的补充材料。主线阅读保持简洁，需要时再展开。

</details>

回到[笔记整理方法](/notes/getting-started)，可以继续了解如何组织这些内容。
