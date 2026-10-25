---
kind: notes
source: cs61a---lin/lec-4---high-order-functions
title: Lecture 4 · Higher-Order Functions
sourceHash: 048de387619c007b52552f1e55f24b9282a8388708e59d290719b917d79d7db4
publish: true
translationMethod: ai-assisted
---
- higher-order function is a funtion that takes a function as an argument or return value.
# If and call expressions
- Conditional evaluation lets us handle values that would otherwise be undefined without raising an error.
- Using a regular if statement
```python
def real_sqrt(x):
	### return the real part of the square root of x ###
	if x >= 0:
		return sqrt(x)
	else:
		return 0 
```
- Using a function
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
	- If the condition is false, the assertion displays the error message that follows.![An assertion and its error message](</attachments/obsidian-0e564952d6285ec77a94d4f9.png>)

- generalize the math
	- Before generalization:![The implementation before generalization](</attachments/obsidian-7e271592fcbaf6d387f599be.png>)
	- After generalization![The generalized implementation](</attachments/obsidian-c81cd98be28458d7343b443c.png>)

# Funtions as return values
```python
def make_adder(n):
	def adder(k):
		return k + n
	return adder
```
![Returning a function with make\_adder](</attachments/obsidian-54567cec98c74d6e8fac94d1.png>)