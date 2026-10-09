---
title: Lecture 19 · 类属性与方法 (Attributes)
description: CS61A 第 19 讲：类属性与方法 (Attributes)
date: 2026-10-09
topic: CS61A
tags:
  - cs61a
status: completed
publish: true
order: 19
---
> **英文原课**：CS 61A: Structure and Interpretation of Computer Programs (Fall 2024)  
> **主讲教师**：Prof. John DeNero (UC Berkeley)  
> **图文整理**：VideoBook 视频转图文技术电子书流水线  
> **全书体量**：已收录 37 / 37 讲 ｜ 18.2 小时音视频讲义 ｜ 577 张高清板书截图  
> **在线目录**：[CS61A 专题目录](/notes/topics/CS61A)

---



> **主讲**：John DeNero ｜ **时长**：17:47 ｜ **视频回链**：[B 站对应单集 (P19)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19)

## 1. 核心架构与核心心智模型

在 Python 面向对象系统中，“对象即属性的容器”，而属性的查找、赋值与方法绑定遵循清晰的自底向上与环境模型机制：

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

1. **类属性 (Class Attribute)**：属于类对象本身，被所有实例共享；只占用一份内存。
2. **实例属性 (Instance Attribute)**：属于具体实例对象，各个实例相互独立。
3. **属性查找规则 (Attribute Lookup)**：
   - 先在实例字典中查找该名称；
   - 若未找到，回溯至实例所属的类中查找；
   - 若在类中找到的是普通函数，点表达式会自动将其包装为绑定到该实例的 **绑定方法 (Bound Method)**（自动预填充 `self`）。
4. **属性赋值规则 (Attribute Assignment)**：
   - `<instance>.<name> = <val>`：始终直接在**实例**上创建或修改属性（发生遮蔽 Shadowing，绝不会写回类中）；
   - `<class>.<name> = <val>`：直接修改**类属性**，所有未遮蔽该属性的实例立即可见最新值。

---

## 2. 类属性的定义与共享机制 (Class Attributes)

在执行 `class` 语句时，Python 会创建一个新的类对象。在类体（suite）内直接执行的赋值语句和 `def` 语句不会像普通函数那样在局部帧中绑定名字，而是全部存储在类对象自身作为**类属性**。

![类属性的定义与共享机制 (Class Attributes) · 课堂板书演示 (00:00:45)](</attachments/cs61a-5f0a40789b5e9a387b8be0cb.png>)
*⏱ 时间戳：00:00:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:00:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=45)*

### 类属性示例与实例化行为

```python
class Clown:
    nose = 'big and red'
    def dance():
        return 'No self argument here!'
```

虽然在类中可以书写任意语句，但在面向对象实际应用中，类属性的核心作用是**在所有实例间共享公共常量或默认配置**。

例如，银行账户如果所有用户统一遵循相同的利率，就可以将其定义为类属性：

![类属性示例与实例化行为 · 课堂板书演示 (00:01:30)](</attachments/cs61a-f1489d75c503b48a846113ca.png>)
*⏱ 时间戳：00:01:30 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:01:30)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=90)*

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

> **设计要点**：
> 将 `interest` 定义为类属性意味着无需在每个账户实例中都单独保存一个浮点数，而是集中保存在 `Account` 类中，大幅降低内存开销并统一控制业务参数。

---

## 3. 点表达式求值与属性查找规则 (Attribute Lookup Procedure)

点表达式形如 `<expression> . <name>`，其求值步骤如下：

![点表达式求值与属性查找规则 (Attribute Lookup Procedure) · 课堂板书演示 (00:03:10)](</attachments/cs61a-744c395d59fec72d50b010fc.png>)
*⏱ 时间戳：00:03:10 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:03:10)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=190)*

1. **求值左侧表达式**：计算 `<expression>` 获得目标对象。
2. **实例属性匹配**：检查目标对象的实例属性中是否存在 `<name>`。若存在，直接返回其值。
3. **类属性回溯查找**：若实例中未找到，则转到该对象所属的**类 (class)** 中查找 `<name>`：
   - 若找到的值为非函数对象，直接返回该值；
   - 若找到的值是普通函数，则将其与当前实例打包，返回一个 **绑定方法 (Bound Method)**，其第一个形参 `self` 已被绑定为当前实例。
4. **属性未找到**：若类及其基类均未找到，抛出 `AttributeError`。

![点表达式求值与属性查找规则 (Attribute Lookup Procedure) · 课堂板书演示 (00:03:55)](</attachments/cs61a-8bc7e7fb6e52209e7f6a62c0.png>)
*⏱ 时间戳：00:03:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:03:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=235)*

### 内置函数：getattr 与 hasattr

除了点语法，Python 还提供了以字符串名称动态查询属性的内置函数：

![内置函数：getattr 与 hasattr · 课堂板书演示 (00:04:45)](</attachments/cs61a-df483b4228bb76074c7d9633.png>)
*⏱ 时间戳：00:04:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:04:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=285)*

```python
getattr(tom_account, 'balance')   # 等价于 tom_account.balance
hasattr(tom_account, 'interest')  # 检查实例或其类是否存在该属性，返回 True / False
```

---

## 4. 属性赋值与遮蔽机制 (Attribute Assignment & Shadowing)

属性赋值语句的形式为：`<expression> . <name> = <value>`。

![属性赋值与遮蔽机制 (Attribute Assignment & Shadowing) · 课堂板书演示 (00:06:15)](</attachments/cs61a-fca3e7d19910bb55f8e5221a.png>)
*⏱ 时间戳：00:06:15 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:06:15)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=375)*

- **实例赋值**：若 `<expression>` 求值得到的是实例，则只影响该实例的属性字典。如果该属性之前只在类中定义，此操作会为该实例新增一个同名实例属性，从而**遮蔽 (shadow)** 对应的类属性。
- **类赋值**：若 `<expression>` 求值得到的是类对象，则直接修改类属性。所有尚未遮蔽此属性的实例访问该属性时都会读取到新的修改。

### 经典推导演练：Jim 与 Tom 账户的利率演化

通过讲座中的经典案例，全面展示类属性修改与实例属性定制的动态过程：

![经典推导演练：Jim 与 Tom 账户的利率演化 · 课堂板书演示 (00:07:45)](</attachments/cs61a-9c94c9bf1ac0894f845e7d75.png>)
*⏱ 时间戳：00:07:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:07:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=465)*

#### 阶段 1：初始状态

```python
jim_account = Account('Jim')
tom_account = Account('Tom')
print(tom_account.interest)  # 0.02（来自 Account.interest）
print(jim_account.interest)  # 0.02（来自 Account.interest）
```

#### 阶段 2：通过类修改全局利率

![阶段 2：通过类修改全局利率 · 课堂板书演示 (00:08:45)](</attachments/cs61a-b4bf05e3f602a48f8e109a04.png>)
*⏱ 时间戳：00:08:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:08:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=525)*

```python
Account.interest = 0.04
print(tom_account.interest)  # 0.04 (动态反映类属性变更)
print(jim_account.interest)  # 0.04 (动态反映类属性变更)
```

> **重要启示**：实例在创建时**不会**把类属性的值“拷贝并冻结”到自身中。实例只是通过回溯查找指向类属性。因此类属性随时发生变更，各实例即时可见。

#### 阶段 3：单独为特定 VIP 实例赋予特权利率 (实例遮蔽)

![阶段 3：单独为特定 VIP 实例赋予特权利率 (实例遮蔽) · 课堂板书演示 (00:09:45)](</attachments/cs61a-7204c04c425ac95e245cf398.png>)
*⏱ 时间戳：00:09:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:09:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=585)*

```python
# 单独为 Jim 定制 VIP 利率
jim_account.interest = 0.08

print(jim_account.interest)  # 0.08 (找到实例属性，直接返回，不再回溯)
print(tom_account.interest)  # 0.04 (tom 未遮蔽，仍回溯到 Account.interest)
```

#### 阶段 4：后续类属性调整不影响已定制实例

![阶段 4：后续类属性调整不影响已定制实例 · 课堂板书演示 (00:10:35)](</attachments/cs61a-7d257b3faa0b6ff6be8ffedf.png>)
*⏱ 时间戳：00:10:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:10:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=635)*

```python
Account.interest = 0.05

print(tom_account.interest)  # 0.05 (普通用户跟随银行基准利率调整)
print(jim_account.interest)  # 0.08 (Jim 拥有专属实例属性，不受全局调整影响)
```

---

## 5. 方法调用与绑定方法 (Methods & Bound Methods)

调用或调用对象上的方法是与对象交互的主要手段。

![方法调用与绑定方法 (Methods & Bound Methods) · 课堂板书演示 (00:11:45)](</attachments/cs61a-8db22680a1ae368be75b7126.png>)
*⏱ 时间戳：00:11:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:11:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=705)*

在方法调用表达式中：
```python
tom_account.deposit(10)
```
其本质是：
1. 先计算运算符子表达式 `tom_account.deposit`；
2. 该点表达式求值得到一个 **绑定方法 (Bound Method)**；
3. 将参数 `10` 传入该绑定方法进行常规调用。

![方法调用与绑定方法 (Methods & Bound Methods) · 课堂板书演示 (00:12:55)](</attachments/cs61a-3b33e0b567f7f8a2ea37afb7.png>)
*⏱ 时间戳：00:12:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:12:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=775)*

### 绑定方法是一等公民 (First-Class Value)

绑定方法作为一个独立对象，可以像普通函数一样赋值给变量，或作为高阶函数的参数传递：

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

甚至可以结合惰性迭代器（如 `map`）实现批量操作：

![将 a 的绑定方法赋值给普通变量 f · 课堂板书演示 (00:14:35)](</attachments/cs61a-c938aa03dc8709f83599513a.png>)
*⏱ 时间戳：00:14:35 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:14:35)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=875)*

```python
m = map(a.deposit, range(10, 20))
# 此时尚未发生任何 deposit，因为 map 是惰性迭代器
next(m)  # 将 10 存入 a 账户
print(a.balance)  # 40 (原余额 30 + 10)
```

---

## 6. 函数 vs. 绑定方法深度对比 (Functions vs Bound Methods)

Python 严格区分存储在类中的“普通函数”与从实例点表达式获取到的“绑定方法”：

![函数 vs. 绑定方法深度对比 (Functions vs Bound Methods) · 课堂板书演示 (00:15:45)](</attachments/cs61a-110e0dfc2676e918fb022dbe.png>)
*⏱ 时间戳：00:15:45 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:15:45)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=945)*

![函数 vs. 绑定方法深度对比 (Functions vs Bound Methods) · 课堂板书演示 (00:16:55)](</attachments/cs61a-51a2f58a44916288e015787c.png>)
*⏱ 时间戳：00:16:55 · 📷 课堂截图 · [在 B 站观看对应片段 (P19 00:16:55)](https://www.bilibili.com/video/BV1sy411z7nA/?p=19&t=1015)*

| 特征维度 | 普通函数 (Function) | 绑定方法 (Bound Method) |
| :--- | :--- | :--- |
| **获取方式** | 通过类直接访问：`Account.deposit` | 通过实例访问：`tom_account.deposit` |
| **`self` 参数** | **未绑定**，调用时必须显式传参 | **已自动绑定**，与具体实例永久绑定 |
| **调用签名** | 需要 2 个实参：`Account.deposit(tom_account, 10)` | 仅需其余实参：`tom_account.deposit(10)` |
| **类型表示** | `<function Account.deposit at 0x...>` | `<bound method Account.deposit of <Account object...>>` |

### 调用等价性定理

在底层，以下两种写法完全等价：

```python
# 方式 1：标准面向对象调用（语法糖，推荐）
tom_account.deposit(100)

# 方式 2：显式函数式调用
Account.deposit(tom_account, 100)
```

理解这一点是透彻掌握 Python 面向对象本质的关键所在：**类中的方法本质上只是第一个参数名为 `self` 的普通函数，而实例的点运算符负责将其自动包装为预填充了该实例实参的闭包式对象。**

---

## 7. 章节总结与核心考点

1. **类属性单例性**：类属性在类定义时创建，存在于类命名空间中，所有实例通过指针回溯共享同一份数据。
2. **读写不对称性**：
   - **读**：实例先查自身，若无则回溯查类；
   - **写**：`instance.attr = val` 始终只写入实例自身字典，绝不污染类属性。
3. **绑定方法解耦**：绑定方法是实例与函数的固定捆绑体，可脱离原始调用点自由传递并安全执行。

---

