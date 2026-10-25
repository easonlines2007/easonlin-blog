---
publish: true
title: Lec 5 - Enviroments
description: ""
topic: CS61A - Lin
category: lin
tags: []
order: 5
date: 2026-10-25
---
# enviroments enable higher order funcitons
```python
def make_adder(n):
	def adder(k):
		return k + n
	return adder
```

```python
def apply_twice(f, x):
	return f(f(x))

def square(x):
	return x * x

result = apply_twice(square, 2)
## result = 16
```
![截屏2026-10-25 13.08.27.png](</attachments/obsidian-98f1a2aad5de1bd084483d7a.png>)![截屏2026-10-25 13.19.40.png](</attachments/obsidian-d2e82d657058ebdc92cee389.png>)

# lambda
```python
square = lambda x: x * x
## 只能写return值， 并且只能一个表达式。因此，适合比较简单的function  
>>> square(4)
>>> 16
```

| lambda                                       | def                           |
| -------------------------------------------- | ----------------------------- |
| 都有同样的domain, range, behavior                 |                               |
| 都有一样的parent frame in which thry were defined |                               |
| 都绑定到name square                              |                               |
| 赋值后才有一个引用                                    | 但只有def给了函数intrinsic name（内建名） |
  ![截屏2026-10-25 13.34.09.png](</attachments/obsidian-c3bae5de096facdc145743a9.png>)

# currying
- Curring: Transforming a multi−argument function into a singal−argument, high−level function 即, 把多参函数化为单参数的高阶函数
- example：
```python
  def curry2(f):
    def g(x):
      def h(y):
        return f(x,y)
      return h
    return g
## equivalente a : curry2 = lambda f: lambda x: lambda y: f(x, y)
```

