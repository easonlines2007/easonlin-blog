---
kind: notes
source: cs61a/lecture-19
title: "Lecture 19 · Attributes: Class Attributes and Methods"
description: "CS61A Lecture 19: Class attributes and methods."
sourceHash: 3ab33babb9923e6194e19b35ee2f282705adb623dd62483474e4e27097e41729
publish: true
translationMethod: machine-assisted
---
> **English original course**: CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **Lecturer**: Prof. John DeNero (UC Berkeley)  
> **Text and illustrations**: VideoBook video to image to text technology e-book assembly line  
> **course coverage**: 37 / 37 on 18.2 hour audio/video instruction ⁇ 577 high-level lecture screenshots  
> **Online catalog**: [CS61A Special Catalog](/en/notes/topics/CS61A)

---



> **Lecture**: John DeNero ｜ **duration**: 17:47 ｜ **Video link back**: [B-station response unit (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19)

## 1. Core architecture and core mind model

In Python object-oriented systems, the string is a container string of properties, while the search for, assignment to and method binding of properties follows a clear bottom-up and environment model mechanism:

```
                    ┌───────────────────────────────────────────────┐
                    │               Class (Account)                 │
                    │───────────────────────────────────────────────│
                    │ • interest = 0.02                             │
                    │ • deposit  = <function Account.deposit>       │
                    │ • withdraw = <function Account.withdraw>      │
                    └───────────────────────────────────────────────┘
                                   ▲                 ▲
                     查找回溯路径   │                 │   查找回溯路径
                                   │                 │
            ┌──────────────────────┴───────┐   ┌─────┴────────────────────────┐
            │   Instance (tom_account)     │   │     Instance (jim_account)   │
            │──────────────────────────────│   │──────────────────────────────│
            │ • holder  = 'Tom'            │   │ • holder   = 'Jim'           │
            │ • balance = 100              │   │ • balance  = 50              │
            │                              │   │ • interest = 0.08 (特殊定制)  │
            └──────────────────────────────┘   └──────────────────────────────┘
```

1. **Class attribute**: belongs to the class object itself, shared by all instances; occupies only one memory.
2. **instance attribute (Instance Attribute)** The following are the main types of objects:
3. **Attribute Lookup rules**: 
   - The name is searched in the example dictionary.
   - If not found, look back to the category of the instance;
   - If a normal function is found in the class, point expression will automatically pack it as a binding to that instance.  **The Bound Method** (Automatic pre-filled)  `self`).
4. **The following is a list of the most commonly used attributes in the database.**: 
   - `<instance>.<name> = <val>` Always live in the **Examples** Create or modify the above attributes (shadowing occurs and will never be rewritten in a class);
   - `<class>.<name> = <val>` Directly modified **class attribute** All instances of this property that are not covered by the new value are immediately visible.

---

## 2. Definition of class attributes and sharing mechanisms

In the execution  `class`  When a statement is created, Python creates a new class object.  `def`  The statements do not bind names in local brackets like normal functions, but instead store them all as class objects themselves. **class attribute**.

![class attribute definition and sharing mechanism (Class Attributes) lecture board illustration (00:00:45)](</attachments/cs61a-5f0a40789b5e9a387b8be0cb.png>)
*⏱ Timestamp: 00:00:45 · 📷 Lecture screenshot · [Watch clip (P19 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)*

### Class attribute examples and example behavior

```python
class Clown:
    nose = 'big and red'
    def dance():
        return 'No self argument here!'
```

While any sentence can be written in a class, the core role of a class attribute is to be central to object-oriented real applications. **Sharing public constants or default configurations across all instances**.

For example, a bank account can be defined as a class attribute if all users follow the same interest rate:

![class attribute Example and Example Behaviour lecture board illustration (00:01:30)](</attachments/cs61a-f1489d75c503b48a846113ca.png>)
*⏱ Timestamp: 00:01:30 · 📷 Lecture screenshot · [Watch clip (P19 00:01:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)*

```python
class Account:
    interest = 0.02  # 类属性：被所有 Account 实例共享

    def __init__(self, account_holder):
        self.balance = 0
        self.holder = account_holder

tom_account = Account('Tom')
jim_account = Account('Jim')

# 两个不同实例访问同一类属性
print(tom_account.interest)  # 0.02
print(jim_account.interest)  # 0.02
```

> **Design points** The next step is to:  `interest`  Defined as a class attribute, it means that the floating-point number is not stored separately in each account instance but is kept centrally.  `Account`  In the category, significantly reduced memory expenditure and unified control of business parameters.

---

## 3. Point expression evaluation and attribute lookup procedure

The dot expression is as follows:  `<expression> . <name>` The following are the steps for evaluation:

![Point expression evaluation and Properties Finder (Attribute Lookup Production) lecture board illustration (00:03:10)](</attachments/cs61a-744c395d59fec72d50b010fc.png>)
*⏱ Timestamp: 00:03:10 · 📷 Lecture screenshot · [Watch clip (P19 00:03:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)*

1. **evaluation left-handed expression**: Calculation  `<expression>`  The goal is to achieve the target.
2. **The instance attribute matches**: Check whether the target object exists in an instance attribute  `<name>` If it exists, return the value directly.
3. **class attribute trace search** If not found in the instance, move to the object that belongs to it **Class**  Searching  `<name>`: 
   - If the value found is a non-functional object, return it directly;
   - If the value found is a normal function, pack it with the current instance and return a  **The Bound Method** The first parameter is  `self`  The current example is tied to the current case.
4. **Attributes not found** If the class and its subclass are not found, discard  `AttributeError`.

![Point expression evaluation and Properties Search Rules (Attribute Lookup Production) lecture board illustration (00:03:55)](</attachments/cs61a-8bc7e7fb6e52209e7f6a62c0.png>)
*⏱ Timestamp: 00:03:55 · 📷 Lecture screenshot · [Watch clip (P19 00:03:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)*

### Built-in Functions: getattr and hasattr

In addition to point grammar, Python also provides built-in functions with dynamic query properties for string names:

![Internal function: Getattr and Hasattr lecture board illustration (00:04:45)](</attachments/cs61a-df483b4228bb76074c7d9633.png>)
*⏱ Timestamp: 00:04:45 · 📷 Lecture screenshot · [Watch clip (P19 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)*

```python
getattr(tom_account, 'balance')   # 等价于 tom_account.balance
hasattr(tom_account, 'interest')  # 检查实例或其类是否存在该属性，返回 True / False
```

---

## 4. Attribute Assignment & Shadowing

The form of the attribute-assigned statement is: `<expression> . <name> = <value>`.

![Attribute Assignment & Shadowing (00:06:15) · lecture board illustration](</attachments/cs61a-fca3e7d19910bb55f8e5221a.png>)
*⏱ Timestamp: 00:06:15 · 📷 Lecture screenshot · [Watch clip (P19 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)*

- **Example assignment** If:  `<expression>`  evaluation is obtained by instance, which only affects the instance's attribute dictionary. If this attribute was previously defined in a class only, this operation will add an instance attribute of the same name to that instance, thus **The shadow**  The corresponding class attribute.
- **Class assignment** If:  `<expression>`  The evaluation is obtained by a class object, which directly modifies the class attribute. All instances of this property that have not yet been overshadowed are read to new modifications when accessed by the property.

### Classic Driving Coach: The Interest Rate Evolution of Jim and Tom's Accounts

Through classic instances in the lecture, a comprehensive demonstration of the dynamic process of modifying class attributes and customizing instance attributes:

![Classic director's practice: jim and Tom's account interest rate evolution lecture board illustration (00:07:45)](</attachments/cs61a-9c94c9bf1ac0894f845e7d75.png>)
*⏱ Timestamp: 00:07:45 · 📷 Lecture screenshot · [Watch clip (P19 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)*

#### Stage 1: Initial state

```python
jim_account = Account('Jim')
tom_account = Account('Tom')
print(tom_account.interest)  # 0.02（来自 Account.interest）
print(jim_account.interest)  # 0.02（来自 Account.interest）
```

#### Phase 2: Modify the overall interest rate through classes

![Step 2: Modify the overall interest rate through class · lecture board illustration (00:08:45)](</attachments/cs61a-b4bf05e3f602a48f8e109a04.png>)
*⏱ Timestamp: 00:08:45 · 📷 Lecture screenshot · [Watch clip (P19 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)*

```python
Account.interest = 0.04
print(tom_account.interest)  # 0.04 (动态反映类属性变更)
print(jim_account.interest)  # 0.04 (动态反映类属性变更)
```

> **Important revelations** Example: When created **It won't.** The class attribute is then frozen and copied to itself. The instance is simply retracing the reference to the class attribute.

#### Stage 3: Special privileges are granted to individual VIP instances (case coverage)

![Phase 3: Gives a privileged interest rate (examples mask) for a specific VIP example alone. lecture board illustration (00:09:45)](</attachments/cs61a-7204c04c425ac95e245cf398.png>)
*⏱ Timestamp: 00:09:45 · 📷 Lecture screenshot · [Watch clip (P19 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)*

```python
# 单独为 Jim 定制 VIP 利率
jim_account.interest = 0.08

print(jim_account.interest)  # 0.08 (找到实例属性，直接返回，不再回溯)
print(tom_account.interest)  # 0.04 (tom 未遮蔽，仍回溯到 Account.interest)
```

#### Phase 4: Subsequent class attribute adjustments do not affect customized instances

![Phase 4: Follow-up class attribute Adjustment does not affect custom case lecture board illustration (00:10:35)](</attachments/cs61a-7d257b3faa0b6ff6be8ffedf.png>)
*⏱ Timestamp: 00:10:35 · 📷 Lecture screenshot · [Watch clip (P19 00:10:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)*

```python
Account.interest = 0.05

print(tom_account.interest)  # 0.05 (普通用户跟随银行基准利率调整)
print(jim_account.interest)  # 0.08 (Jim 拥有专属实例属性，不受全局调整影响)
```

---

## 5. Method calls and binding (Methods & Bound Methods)

The method of summoning or calling objects is the main means of interacting with them.

![Method of calling and binding (Methods & Bound Methods) lecture board illustration (00:11:45)](</attachments/cs61a-8db22680a1ae368be75b7126.png>)
*⏱ Timestamp: 00:11:45 · 📷 Lecture screenshot · [Watch clip (P19 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)*

In the method call expression:
```python
tom_account.deposit(10)
```
The essence of the article is:
1. First calculate the operator expression  `tom_account.deposit`; 
2. The point expression evaluation gets a  **The Bound Method**; 
3. The parameters  `10`  The method of binding is used to make regular calls.

![Method of calling and binding (Methods & Bound Methods) lecture board illustration (00:12:55)](</attachments/cs61a-3b33e0b567f7f8a2ea37afb7.png>)
*⏱ Timestamp: 00:12:55 · 📷 Lecture screenshot · [Watch clip (P19 00:12:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)*

### Bound Methods as First-Class Values

The binding method can be assigned to a variable as an independent object, like a normal function, or passed over as a parameter of a higher-order function:

```python
a = Account('Alan')
a.deposit(5)
a.deposit(5)
print(a.balance)  # 10

# 将 a 的绑定方法赋值给普通变量 f
f = a.deposit
f(20)  # 相当于 a.deposit(20)
print(a.balance)  # 30
```

It's also possible to combine inert iterators such as:  `map` The following are the main steps to be taken:

![The method of binding a to the ordinary variable f · lecture board illustration (00:14:35)](</attachments/cs61a-c938aa03dc8709f83599513a.png>)
*⏱ Timestamp: 00:14:35 · 📷 Lecture screenshot · [Watch clip (P19 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)*

```python
m = map(a.deposit, range(10, 20))
# 此时尚未发生任何 deposit，因为 map 是惰性迭代器
next(m)  # 将 10 存入 a 账户
print(a.balance)  # 40 (原余额 30 + 10)
```

---

## Functions vs Bound Methods (FMS) 6.

Python strictly distinguishes the common function arrays stored in classes from the array-binding methods derived from instance point expressions:

![Functions vs Bound Methods (compared to other methods) · lecture board illustration (00:15:45)](</attachments/cs61a-110e0dfc2676e918fb022dbe.png>)
*⏱ Timestamp: 00:15:45 · 📷 Lecture screenshot · [Watch clip (P19 00:15:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)*

![Functions vs Bound Methods (FBM) · lecture board illustration (00:16:55)](</attachments/cs61a-51a2f58a44916288e015787c.png>)
*⏱ Timestamp: 00:16:55 · 📷 Lecture screenshot · [Watch clip (P19 00:16:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)*

| Feature dimensions | Function (commonly known as function) | The Bound Method |
| :--- | :--- | :--- |
| **How to Get It** | Direct access to the class: `Account.deposit` | The following is an example: `tom_account.deposit` |
| **`self`  The parameters** | **Unbound** The call must be made explicitly | **Automatically bound** Permanent binding to specific instances |
| **Call for signatures** | It takes two arguments: `Account.deposit(tom_account, 10)` | The rest of the argument: `tom_account.deposit(10)` |
| **Type of indication** | `<function Account.deposit at 0x...>` | `<bound method Account.deposit of <Account object...>>` |

### Calling for the theory of equivalence

At the bottom, the following two writing methods are exactly equivalent:

```python
# 方式 1：标准面向对象调用（语法糖，推荐）
tom_account.deposit(100)

# 方式 2：显式函数式调用
Account.deposit(tom_account, 100)
```

Understanding this is key to a complete understanding of the object-oriented nature of Python: **The method in the class is essentially just the first parameter called  `self`  The point operator of the instance is responsible for automatically packing it as a closure object that pre-filled the case argument.**

---

## Chapter 7 Summary and Core Points

1. **class attribute uniqueness**:class attribute is created when a class is defined and exists in the class naming space, where all instances share the same data by pointering backwards.
2. **Read and write asymmetry**: 
   - **Read the book** The following is a list of the most common types of back-up search:
   - **Writing**: `instance.attr = val`  Always write the instance's own dictionary, and never contaminate the class attribute.
3. **How to untie a tie** Binding method: A fixed bundle of instances and functions that can be freely transmitted and securely executed from the original call point.

---

