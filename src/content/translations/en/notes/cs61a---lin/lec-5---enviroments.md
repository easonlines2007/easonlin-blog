---
kind: notes
source: cs61a---lin/lec-5---enviroments
title: Lecture 5 · Environments
sourceHash: a4284e3d32e7842cf914ad10628d9efef25d78ace8a9710520244b6ab1b4bed5
publish: true
translationMethod: ai-assisted
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
![An environment diagram for a higher-order function](</attachments/obsidian-98f1a2aad5de1bd084483d7a.png>)![Tracing higher-order function calls in the environment model](</attachments/obsidian-d2e82d657058ebdc92cee389.png>)

# lambda
```python
square = lambda x: x * x
## 只能写return值， 并且只能一个表达式。因此，适合比较简单的function  
>>> square(4)
>>> 16
```

| lambda                                       | def                           |
| -------------------------------------------- | ----------------------------- |
| Both have the same domain, range, and behavior.                 |                               |
| Both have the parent frame in which they were defined. |                               |
| Both are bound to the name square.                              |                               |
| After assignment, there is a reference to the function.                                    | Only def gives the function an intrinsic name. |
  ![Comparing lambda expressions and def statements](</attachments/obsidian-c3bae5de096facdc145743a9.png>)

# currying
- Currying transforms a function of multiple arguments into a sequence of single-argument functions.
- example: 
```python
  def curry2(f):
    def g(x):
      def h(y):
        return f(x,y)
      return h
    return g
## equivalente a : curry2 = lambda f: lambda x: lambda y: f(x, y)
```

