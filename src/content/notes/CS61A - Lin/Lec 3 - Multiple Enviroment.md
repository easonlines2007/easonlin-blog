---
publish: true
title: Lec 3 - Multiple Enviroment
description: ""
topic: CS61A - Lin
category: lin
tags: []
order: 3
date: 2026-10-24
---
# enviroment
- call expression 和 function body 在不同环境
- 若函数处在global frame ，缩进的函数体则在local frame 

# operators
- operators 本质就是运算函数
	- 2 + 3 * 4 + 5  =  add(add(2, mul(3, 4)), 5)
	- divide
		- 2013 / 10 = 201.3 (truediv)
		- 2013  // 10 = 201  (floordiv)
		- 2013 % 10 = 3 （mod）
- 返回多个值：![截屏2026-10-24 23.49.58.png](</attachments/obsidian-61000d40a7f878626fce97de.png>)

# 文档测试
- $ python3 -m doctest -v ex.py
	- python3: 启动python
	- -m：运行模块：
	- doctest：python的文档测试模块
	- ex.py ： 文件

