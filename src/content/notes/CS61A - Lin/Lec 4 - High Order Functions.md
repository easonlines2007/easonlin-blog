---
publish: true
title: Lec 4 - High Order Functions
description: ""
topic: CS61A - Lin
category: lin
tags: []
order: 4
date: 2026-10-25
---
- higher-order function is a funtion that takes a function as an argument or return value.
# If and call expressions
- 调用表达式的真值判断能让我们表示出那些“不能表示的值”，而不至于导致函数报错
- 常规if写法
```python
def real_sqrt(x):
	### return the real part of the square root of x ###
	if x >= 0:
		return sqrt(x)
	else:
		return 0 
```
- function写法
```python
def if_(c, t, f):
	if c:
		return t
	else:
		return f
from math import sqrt
def real_sqrt(x):
	return if_(x >= 0, sqrt(x), 0)
	### 这里会先行evaluate （） 内的函数，如果有错，则先于if_ 报错 ###
```

# High order funtions
- generalize the funtion
	- assert 3 > 2, 'Math is broken'
	- 如果前面条件为假， 执行打印出后续error信息![截屏2026-10-25 09.48.56.png](</attachments/obsidian-0e564952d6285ec77a94d4f9.png>)

- generalize the math
	- 优化前：![截屏2026-10-25 10.14.07.png](</attachments/obsidian-7e271592fcbaf6d387f599be.png>)
	- generalize 后![截屏2026-10-25 10.13.51.png](</attachments/obsidian-c81cd98be28458d7343b443c.png>)

# Funtions as return values
```python
def make_adder(n):
	def adder(k):
		return k + n
	return adder
```
![截屏2026-10-25 10.26.24.png](</attachments/obsidian-54567cec98c74d6e8fac94d1.png>)