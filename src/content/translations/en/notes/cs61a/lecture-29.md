---
kind: notes
source: cs61a/lecture-29
title: "Lecture 29 · Interpreters: Architecture and Scheme Implementation"
description: "CS61A Lecture 29: Interpreter architecture and implementing a
  Scheme interpreter."
sourceHash: f44f0514ae5deb51af8992962922e2924c3fe0a9267e2b31940b77f9585ae560
publish: true
translationMethod: machine-assisted
---

> **Earlier edition:** The Chinese edition was expanded on 22 October 2026. This English translation covers the previous edition. [Read the updated Chinese lecture](/notes/cs61a/lecture-29).

> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 29:48 ｜ **Video link back**: [B station response unit set (P29)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29)

## 1. expression classification and special forms & eval dispatch

In Scheme, all expressions are categorized into three main categories:
1. **Self-evaluation of the expression** The number of words in the list is: `nil` The results of the evaluation are directly their own.
2. **The symbols are:**: Find its bound value in the current environment (environment).
3. **The following is a list of the most commonly used combinations:**: 
   - **The following is a list of the most common types of forms:** The first element in the list is determined by the operator symbols (i.e.,  `if`, `lambda`, `define`, `quote`, `cond`, `and`, `or` Special forms have custom-defined nonstandard evaluation rules, and their subexpression does not necessarily have to be full evaluation or in regular sequence evaluation.
   - **call expression (Call Express)** If the first element of a list is not known to be in a special form, it is called as a regular process. The first evaluation operator gets the object of the process and then evaluation all operand, and finally applies the process to the argument list.

![expression Classification and Special Forms Distribution (Specific Forms & Eval Dispatch) lecture board illustration (00:00:55)](</attachments/cs61a-e28ed34b0c5f309dede7274a.png>)
*⏱ Timestamp: 00:00:55 · 📷 Lecture screenshot · [Watch clip (P29 00:00:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=55)*

### Example: Self-definition process  `demo`

Professor John DeNero gives an additional element at the bottom of the list.  `3`  The recursion process is defined as:

```scheme
(define (demo s)
  (if (null? s)
      '(3)
      (cons (car s) (demo (cdr s)))))

(demo '(1 2)) ; => (1 2 3)
```

when  `(null? s)`  Directly back to the benchmark list in real time  `'(3)` Otherwise, the  `cons`  The new pair, headed by  `(car s)` The tail recursion call  `(demo (cdr s))`.

![Example: Custom process demo lecture board illustration (00:02:15)](</attachments/cs61a-a57ef02aca08389c9c05ef1a.png>)
*⏱ Timestamp: 00:02:15 · 📷 Lecture screenshot · [Watch clip (P29 00:02:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=135)*

---

## 2. Tracking the execution of Scheme interpreter (Tracing)  `scheme_eval`)

The Scheme interpreter is activated in the terminal and allows a clear view of how the expression is implemented in Python.  `scheme_eval`  The first is the "Crossroads".

![Tracking Scheme interpreter execution (tracing scheme\_eval) lecture board illustration (00:03:45)](</attachments/cs61a-e4fc958e189a9a4562d7f292.png>)
*⏱ Timestamp: 00:03:45 · 📷 Lecture screenshot · [Watch clip (P29 00:03:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=225)*

evaluation value  `2`  When the `scheme_eval`  Receiving Expression  `2`  The world is full of people and the world is full.  `2` Evaluation  `(- 2)`  When:
1. The first is the call expression.
2. Search for the Operator in Environment  `-`  The corresponding built-in negative/decrease function;
3. evaluation operand  `2`  get  `2`; 
4. Calculating the built-in function is  `-2`.

When called  `(demo '(1 2))`  The interpreter goes through a complete loop of creation and recursion tracking:

![Tracking Scheme interpreter execution (tracing scheme\_eval) lecture board illustration (00:05:45)](</attachments/cs61a-a10a663cfcf3ecad5a14af67.png>)
*⏱ Timestamp: 00:05:45 · 📷 Lecture screenshot · [Watch clip (P29 00:05:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=345)*

- Initial calls to create local shots  $F_1$ The parameters  `s`  Linked to the list  `(1 2)`; 
- recursion calls to create local loop  $F_2$ The parameters  `s`  Binded to  `(2)`; 
- Baseline calls to create local sheds  $F_3$ The parameters  `s`  Binded to  `nil`; 
- The base line hit back  `(3)` The call is executed in reverse along the chain  `cons` And then the whole thing was done.  `(2 3)`  and  `(1 2 3)`.

---

## 3. Quotation Special Forms (Quotation & `SchemeReader`)

In Lisp/Scheme, the first step is to create a new language. **The data and code have the same physical manifestations as the data:** In order to prevent the interpreter from executing the list as code, rather than keeping it as pure data, we need to use a list of interpreters.  `quote`  The special form.

```scheme
(quote (+ 1 2)) ; => (+ 1 2) 列表数据，而非数值 3
'(+ 1 2)        ; => (+ 1 2) 单引号语法糖
```

The single quotation  `'expr`  Syntactic Sugar is a binary list of standard ones that are developed in the Reader stage.  `(quote expr)`.

![Quoting Special Forms (Quotation & SchemeReader) lecture board illustration (00:07:45)](</attachments/cs61a-9a302232c92d444c69eccb7e.png>)
*⏱ Timestamp: 00:07:45 · 📷 Lecture screenshot · [Watch clip (P29 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=465)*

### `SchemeReader`  The workflow

In  `scheme_reader.py`  In the lexical analyzer (Tokenizer) it divides text into token streams, and in the syntax analyzer it breaks up brackets and encapsulates the built-in embedded.  `Pair`  Linked list:

![SchemeReader workflow lecture board illustration (00:09:25)](</attachments/cs61a-8a5643f1f0e962a643de73e8.png>)
*⏱ Timestamp: 00:09:25 · 📷 Lecture screenshot · [Watch clip (P29 00:09:25)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=565)*

The evaluation core  `scheme_eval`  Never face a single quotation in text format directly  `'x` The first is that the pairs are always a well-defined structure: `Pair('quote', Pair('x', nil))`.

---

## 4. Logical Special Forms and Short-Circuit Evaluation (Logical Special Forms & `do_if_form`)

Logical Forms are the logical forms.  `if`, `and`, `or`, `cond`  The main features of the program are: **Sub-expression on demand condition evaluation (short circuit evaluation)**.

```scheme
(if <predicate> <consequent> <alternative>)
```

In Python implementation, the corresponding processing function is  `do_if_form(expressions, env)`: 
1. call  `scheme_eval(expressions.first, env)`  The first is the "precision" (evaluation).
2. The choice of the after-evaluation (Consequent) or alternative is based on the falsehood of the pronoun.
3. **The branches that are not selected will never be chosen. evaluation**!

![Logical Special Forms & do\_if\_form (Logical Special Forums and short-circuit evaluation) · lecture board illustration (00:10:45)](</attachments/cs61a-79cbe2d4795966f62f772907.png>)
*⏱ Timestamp: 00:10:45 · 📷 Lecture screenshot · [Watch clip (P29 00:10:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=645)*

### Short-circuit evaluation demonstration and zero protection

Consider the expression:
```scheme
(if #t 1 (/ 1 0)) ; => 1 （不会触发除零异常）
(if #f 1 (/ 1 0)) ; => ZeroDivisionError!
```

![short-circuit evaluation demonstration and zero protection lecture board illustration (00:12:15)](</attachments/cs61a-749dd4ec5cc16645ee170e16.png>)
*⏱ Timestamp: 00:12:15 · 📷 Lecture screenshot · [Watch clip (P29 00:12:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=735)*

If you  `if`  It's normal function call, and all arguments will be all evaluation before they enter the function.  `(/ 1 0)`  The first is the unconditional reporting. This is the key reason why special forms must exist as a special processing branch.

---

## 5. Lambda expression and process objects (`LambdaProcedure`)

`lambda`  It is the core of functional programming and is used to create user-defined procedures when running.

```scheme
(lambda (x) (* x x))
```

In Python host implementation, we define  `LambdaProcedure`  The following is a list of the three key elements that make up Closure:
1. **The list of parameters `formals`)**: Scheme list consisting of symbols, specifying the name of the parameter;
2. **The functional body `body`)** The following is a list of Scheme expressions:
3. **The environment is defined `env`)** One:  `Frame`  For example, record the environment frame where the function is located when it is defined.

![Lambda expression and process object (LambdaProcedure) · lecture board illustration (00:13:35)](</attachments/cs61a-6b27baed16a00259e73947d8.png>)
*⏱ Timestamp: 00:13:35 · 📷 Lecture screenshot · [Watch clip (P29 00:13:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=815)*

```python
class LambdaProcedure:
    def __init__(self, formals, body, env):
        self.formals = formals # Scheme list of symbols
        self.body = body       # Scheme list of expressions
        self.env = env         # Frame instance
```

---

## 6. environment model and frame chain search (Frames and Environments)

**Environment**  Chain of Frames is used to determine the sequence of frames bound by symbols. Each of these is a single chain.  `Frame`  The following examples are preserved:
- The first is the local dictionary. `bindings` (i) recording the mapping of local symbols and values;
- A quote from my father-in-law: `parent` (a) the upper-level environment;  `parent`  For the  `None`.

The company offers two core operating methods:
- `lookup(symbol)` Recursion is used to find the current local filter: if it is not found and the parent node exists, then the recursion is  `parent`  Search the box; if the whole box is not found, throw it away  `SchemeError`.
- `define(symbol, value)` Directly on: **Current local shrimp** Add or cover symbols to bind (not affecting parentheses).

![environment model and frame chain search (Frames and Envirrons) lecture board illustration (00:15:15)](</attachments/cs61a-add5ac2ec2e92a208fbcd3f7.png>)
*⏱ Timestamp: 00:15:15 · 📷 Lecture screenshot · [Watch clip (P29 00:15:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=915)*

### Python Interactive Testing of Frame Chains

Professor builds a global array manually in Python  $G$  with local potatoes  $F_1$  And then we do the variable masking experiment:

![Python Interactive Testing Frame Chain · lecture board illustration (00:16:35)](</attachments/cs61a-26af1413613ceda77154d568.png>)
*⏱ Timestamp: 00:16:35 · 📷 Lecture screenshot · [Watch clip (P29 00:16:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=995)*

- The world is full of crap  $G$  The following is a list of the topics covered: `y = 3`, `z = 5`; 
- Local shrimp  $F_1$ (The parent frame is  $G$ The following is a list of the most common types of binding: `x = 2`, `z = 4`; 
- In  $F_1$  Searching  `x`  get  `2` Searching for  `z`  Get the value of local nickel  `4` (The coverage is global)  `5`); 
- In  $F_1$  Searching  `y` The local, but smoothly along the father's chain of chains to find the whole  `3`.

---

## 7. lexical scope vs.s Dynamic scope (Lexical vs. Dynamic Spope)

This is one of the most critical theoretical watershed in programming language semantics:

| scope mechanism | Definition of the new father and son | Searching for Bases | Modern representative languages |
| :--- | :--- | :--- | :--- |
| **The first is the lexical scope.** | **The process is defined by the definition-time**  The environment | Static nesting structure in text according to code | Scheme, Python, JavaScript |
| **The first is the dynamic scope.** | **Call-time when the process is called**  The current environment | In the order of precedence when the pump is called | Early Lisp, Emacs Lisp (default) |

![lexical scope vs dynamic scope (Lexical vs. Dynamic Scop) lecture board illustration (00:18:05)](</attachments/cs61a-ae8ab7319c8547845a014f50.png>)
*⏱ Timestamp: 00:18:05 · 📷 Lecture screenshot · [Watch clip (P29 00:18:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1085)*

### The classic contrasting examples

```scheme
(define (f x) (+ x y))
(define (g x y) (f (+ x x)))
(g 3 7)
```

- **The first is the lexical scope.**: 
  `f`  The first is that the code is defined globally, so it's called everywhere.  `f` The new mom and dad will always be a global mom.  $G$- When?  `f`  Trying to find  `y`  The first is the  $F_f$  And the whole world is screwed.  $G$  I can't find any in the book.  `y` The report: `unknown identifier: y`.
- **The first is the dynamic scope.**: 
  `f`  It's in  `g`  The internal is called, so  $F_f$  The parent frame is  $F_g$- I'm looking for you.  `y`  The call chain is located directly along the  $F_g$  in  `y = 7` The calculation results are  `(+ 6 7) = 13`!

Scheme is in Python and strictly followed **lexical scope**.

---

## 8. interpreter core: Eval and Apply reciprocal recursion (The Core Architecture)

The interpreter's execution engine is based on two core functions of reciprocal recursion:

```python
def scheme_eval(expr, env):
    """求值表达式 expr 在环境 env 中的值。"""
    if is_primitive(expr):
        return expr
    elif is_symbol(expr):
        return env.lookup(expr)
    elif is_special_form(expr):
        return eval_special_form(expr, env)
    else: # 调用表达式
        procedure = scheme_eval(expr.first, env)
        args = expr.rest.map(lambda operand: scheme_eval(operand, env))
        return scheme_apply(procedure, args, env)

def scheme_apply(procedure, args, env):
    """将过程 procedure 应用于实参 args。"""
    if isinstance(procedure, PrimitiveProcedure):
        return procedure.apply(args)
    elif isinstance(procedure, LambdaProcedure):
        new_frame = procedure.env.make_child_frame(procedure.formals, args)
        return eval_all(procedure.body, new_frame)
```

![interpreter Core: Eval and Apply each other recursion (The Core Architecture) lecture board illustration (00:20:45)](</attachments/cs61a-db5a75b58f8d45c589b9f64c.png>)
*⏱ Timestamp: 00:20:45 · 📷 Lecture screenshot · [Watch clip (P29 00:20:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1245)*

![interpreter Core: Eval and Apply each other recursion (The Core Architecture) lecture board illustration (00:22:45)](</attachments/cs61a-1dc3961b74b57b00c7ac825c.png>)
*⏱ Timestamp: 00:22:45 · 📷 Lecture screenshot · [Watch clip (P29 00:22:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1365)*

- **`scheme_eval`  Calling  `scheme_apply`** When evaluation encounters a normal function call, the recursionevaluation is performed first by the operator and all operands, then given to the operator.  `scheme_apply`; 
- **`scheme_apply`  Calling  `scheme_eval`** When the user is customized  `LambdaProcedure`  When creating new templates and calling  `scheme_eval`  To execute a functional object expression.

---

## 9. Symbol binding and process definition syntax sugar (Handling)  `define` Expressions)

`define`  There are two forms of expression:
1. **Definition of variable**: `(define <symbol> <expression>)`  
   Pre-evaluation  `<expression>`  The value of the data is given by the  `<symbol>`  The value is bound to the current string.
2. **Process Definition**: `(define (<symbol> <param1> ...) <body>)`  
   It's actually  `define`  Cooperation  `lambda`  The full equivalent of grammar sugar:
   ```scheme
   (define <symbol> (lambda (<param1> ...) <body>))
   ```

![Handling define Expressions · lecture board illustration (00:25:05)](</attachments/cs61a-79cccda670af5d90214249ac.png>)
*⏱ Timestamp: 00:25:05 · 📷 Lecture screenshot · [Watch clip (P29 00:25:05)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1505)*

The interpreter is meeting  `(define (demo s) ...)`  The value of the equation is automatically converted to  `(define demo (lambda (s) ...))` The use of the common  `lambda`  The logic of evaluation.

---

## recursion-executed environmental chain evolution (Environ Frame Chains in Action)

The first part of the lesson  `demo`  The function is executed  `(demo '(1 2))`  The entire life cycle of the environmental chain is shown in the following diagram:

![recursion Implementation of Environmental Frame Chains in Action lecture board illustration (00:27:15)](</attachments/cs61a-5bef67ccf325fd3303650c91.png>)
*⏱ Timestamp: 00:27:15 · 📷 Lecture screenshot · [Watch clip (P29 00:27:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1635)*

1. The world is full of crap  $G$  Includes symbols  `demo` It's tied to a  `LambdaProcedure`  The closure environment of the case  `env`  Pointing to  $G$; 
2. First call  `(demo '(1 2))` Creating a new brand  $F_1$, the parent frame is  $G$, binding  `s = (1 2)`; 
3. Second recursion call  `(demo '(2))` Creating a new brand  $F_2$, **The parent frame is also  $G$** The first is the "Bind" (according to lexicalscope rules).  `s = (2)`; 
4. The third recursion call  `(demo nil)` Creating a new brand  $F_3$ My father and grandfather were also  $G$, binding  `s = nil` The first is the "Street" and the second is the "Fire".

---

## 11. A landmark in the history of computer science: Lisp 1.5 Eval-Apply

In the 1960s, Turing Prize winner John McCarthy gave a first-time piece of writing in less than one page in his published Lisp 1.5 Programmer's Manual.  `eval`  and  `apply`  The official definition of the term is:

![The first is the study of the history of computer science: Lisp 1.5 Eval-Apply · lecture board illustration (00:29:10)](</attachments/cs61a-095a5e48ecef38fcd0c714f0.png>)
*⏱ Timestamp: 00:29:10 · 📷 Lecture screenshot · [Watch clip (P29 00:29:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=29&t=1750)*

This historical documentation shows the most essential uniformity of programming languages: **A meta-cycling evaluation (Metacircular Evaluator) that explains its own language** The project 4 interpreter you implemented in Python, whose core logic is in complete spiritual and skeletal alignment with McCarthy's design more than 60 years ago!

---

## Key knowledge points and review speeds

| The core components | Key responsibilities/logical realization |
| :--- | :--- |
| **`scheme_eval(expr, env)`** | Expression evaluation input. It is distributed by type, self-evaluation, symbol search, special form, process call). |
| **`scheme_apply(proc, args)`** | Process calls input. • Distinguish built-in processes • Call Python functions • User custom process • Create new threads and evaluation function bodies |
| **`Frame`** | Environmental chain nodes. Contains a local key value pair  `bindings`  And the father's environment  `parent`- Support  `lookup`  and  `define`. |
| **`LambdaProcedure`** | Closure objects. List of packaging parameters  `formals` Functional body  `body`  and environment when defining  `env`. |
| **lexical scope (LexicalScop)** | The new mother  `parent`  The function is **Definition** The environment of the time, not the environment of the call. |
| **The short-circuit evaluation** | The special form of the  `if`, `and`, `or` (i) only selective evaluation is necessary to avoid invalid calculations or anomalies. |

---

