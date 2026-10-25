---
publish: true
title: Lec 2 - Functions
description: ""
topic: CS61A - Lin
category: lin
tags: []
order: 2
date: 2026-10-24
---
- from operator import add, mul
	- 本质上是绑定函数到名称
	- 因此，如果 写：add = 100, 此时 add(1, 10) 就不会返回函数，而是错误
	- 如果要再使用 应重新绑定，或者事先 f = add， 后续使用f!![截屏2026-10-24 22.45.46.png](</attachments/obsidian-f942332b6a318a87b4170e46.png>)

- call expression 会事先求出参数值， 再进行调用
	- 后续 [Lec 4 - High Order Functions](</notes/cs61a---lin/lec-4---high-order-functions>) 关于if/else 有涉及
	- ⚠️ python 从右往左求值，先求出等号右边再赋值

- funtions
	- pure：just return values
	- non-pure: have side effects

- print 
	-   print 返回 None![截屏2026-10-24 23.14.26.png](</attachments/obsidian-3e1d11fda8410893583da71c.png>)

