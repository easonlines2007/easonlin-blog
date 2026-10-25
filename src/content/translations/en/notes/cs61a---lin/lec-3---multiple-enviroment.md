---
kind: notes
source: cs61a---lin/lec-3---multiple-enviroment
title: Lecture 3 · Multiple Environments
sourceHash: 285b062d8d6d0905809a431dad47440b30eab06b96903361c4adfe4756f939e3
publish: true
translationMethod: ai-assisted
---
# enviroment
- A call expression and the function body are evaluated in different environments.
- If the function is defined in the global frame, its indented body executes in a local frame. 

# operators
- Operators are functions that perform operations.
	- 2 + 3 * 4 + 5  =  add(add(2, mul(3, 4)), 5)
	- divide
		- 2013 / 10 = 201.3 (truediv)
		- 2013  // 10 = 201  (floordiv)
		- 2013 % 10 = 3 (mod)
- Returning multiple values:![A function returning multiple values](</attachments/obsidian-61000d40a7f878626fce97de.png>)

# Documentation Tests
- $ python3 -m doctest -v ex.py
	- python3: start Python
	- -m: run a module:
	- doctest: the Python documentation-testing module
	- ex.py: the file

