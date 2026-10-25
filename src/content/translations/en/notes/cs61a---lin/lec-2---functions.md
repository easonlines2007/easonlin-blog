---
kind: notes
source: cs61a---lin/lec-2---functions
title: Lecture 2 · Functions
sourceHash: 5c32405ea9268de7c843ebb58288dd08cb9049c23595ed783cb6a479bbf223f1
publish: true
translationMethod: ai-assisted
---
- from operator import add, mul
	- This binds a function to a name.
	- If you then write add = 100, calling add(1, 10) raises an error instead of calling the function.
	- To use it again, bind the function to the name again, or first save it with f = add and call f afterward!![Binding an imported function to a name](</attachments/obsidian-f942332b6a318a87b4170e46.png>)

- A call expression evaluates its arguments before calling the function.
	- See the later note  [Lec 4 - High Order Functions](</en/notes/cs61a---lin/lec-4---high-order-functions>)  for the discussion of if/else.
	- ⚠️ Python evaluates the right-hand side of an assignment before assigning the result to the left-hand side.

- funtions
	- pure: just return values
	- non-pure: have side effects

- print 
	-   print returns None![The return value of print](</attachments/obsidian-3e1d11fda8410893583da71c.png>)

