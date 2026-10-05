---
publish: true
title: Lab 03
description: ""
topic: FC
tags: []
date: 2026-10-01
---
## C的概念

- **编译型 vs 解释型：C、C++、FORTRAN 是**编译型**(llenguatges compilats):源码必须先翻译成机器能直接执行的文件,再运行。Python、bash、Perl 是**解释型**:解释器读一行执行一行,不需要单独的翻译步骤。你写过 Python,所以可以这样对照:`python a.py` 是"解释器读源码并执行",而 C 是"先 `gcc` 产生可执行文件 `a`,再 `./a`"。这一节后面所有关于 `gcc`、`make` 的内容,都是为了解决"编译型语言多出来的这一步"。

- **顺序**(seqüència):动作一个接一个执行。动作可以是赋值/运算(`a = b + c`),可以是调用系统服务(`print`、`open`、`read`),也可以是调用你自己写的函数(`a = suma(b, c)`)。
- **选择**(alternativa/condició):先求值一个条件,为真执行一组动作,为假执行另一组。例如"如果参数是 `+` 就做加法,否则做减法"。
- **循环**(iterativa):对列表或一个范围里的每个元素重复同一动作。它需要三个要素:起点、终点、步进。

- **Böhm–Jacopini 定理**说:这三种结构的组合足以表达任何能在计算机上执行的算法。

## main ： int main (int argc, char * argv[ 4]);
- int : 返回值类型 
- argc ：命令行参数数量
- argv ：本质字符串指针组成的数组，\0 结尾（每个，在c字符串里）， argv[4] == NULL
- ./program hello 123 说明：
	argc = 3
	argv[0] = "./program" 开头占一个
	argv[1] = "hello"
	argv[2] = "123"
	argv[3] = NULL 结尾空字符

## 编译 Compilació del programa
- 开头要有#include <stdio.h>
- 多源文件，可以配一个单独的源文件。 # include"operacions.h", 这时候 代码会去这个文件里找源代码，这个文件里 可以自己再写# include 。。。。（所需要的）
- 
- 
