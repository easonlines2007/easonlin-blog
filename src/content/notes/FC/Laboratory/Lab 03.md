---
tags: [ FC ]
publish: true
title: Lab 03
description: ""
topic: FC
date: 2026-10-19
---
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
## 一、算法的三种基本结构

### 理论

写程序的本质，是把一个问题拆成计算机能执行的步骤。完整的工作流是：理解问题 → 设计算法 → 用某种语言写成源码 → （如果是编译型语言）编译并链接 → 测试（_fase de testeig_）→ 投入使用（_fase de producció_）。测试阶段要尽可能广地验证程序正确，发现错误就回头修；进入生产阶段后，用户如果发现错误，还需要能联系开发者做维护。

算法能用的"零件"只有三种，这是 **Böhm–Jacopini 结构化程序定理** 的内容：只要把这三种结构组合起来，就能表达任何可以在计算机上执行的算法。

|结构|加泰语|作用|C 中的对应|
|---|---|---|---|
|顺序|_seqüència_|动作一个接一个执行|语句按顺序排列，以 `;` 结尾|
|选择|_alternativa / condició_|条件为真执行一组动作，为假执行另一组|`if … else`、`switch`|
|循环|_iterativa_|重复处理一个序列或一个范围内的值|`for`、`while`、`do-while`|

顺序结构里的"动作"有三类：简单的数据移动或数学运算（`a = b + c`）、系统服务调用（`print`、`open`、`read`）、用户自定义函数调用（`a = suma(b, c)`）。算法的输入通常来自两处：程序参数（C/C++ 里是 `argc`、`argv`，Python 里是 `sys.argv`），或者事先保存好的文件。

### 方法

遇到问题时，先把大任务分解成小动作，再逐个判断每个动作属于顺序、选择还是循环，最后组合起来。

### 例子 1：四则运算器（只用到顺序 + 选择）

需求：接收两个数和一个运算符，输出结果。

```text
a ← 把第 1 个参数转成整数
s ← 取第 2 个参数（运算符）
b ← 把第 3 个参数转成整数
如果 s 是 '+'      → r = a + b
否则如果 s 是 '-'  → r = a - b
否则如果 s 是 '*'  → r = a * b
否则如果 s 是 '/'  → r = a / b
否则               → 报错"运算符无法识别"，结束
输出 r
结束
```

注意 `a` 和 `b` 的转换在判断运算符之前就可以做完，因为不管是哪种运算，两个数都要转换。这一点后面练习 2 的提示里也提到了。

### 例子 2：简化版 grep（三种结构全用到）

```text
f ← 打开输入文件
如果文件打开成功：
    对文件 f 的每一行：          ← 循环
        如果这一行含有目标字符串：   ← 选择
            输出这一行
否则：
    报错"文件不存在"
```

---

## 二、C 程序的骨架：main 与函数接口

### 理论

C/C++ 程序由若干文件组成，每个 `.c` 文件包含若干函数，每个函数就是一串按照上述三种结构组织的动作。与 Python、bash 不同，C 不会从文件第一行直接开始执行，而是**必须有一个名为 `main` 的函数**，它是你写的代码中第一个被执行的函数。（C++ 有个例外：全局对象的构造函数会先于 `main` 运行。）

函数的"名字 + 参数 + 返回值"合称**函数接口**（_interfície de la funció_）。`main` 的参数和返回值的含义由操作系统（这里是 GNU/Linux）规定，标准声明为：

```c
int main (int argc, char * argv[]);
```

- `argc`（_argument counter_）：命令行参数的个数，**包含程序名本身**。
- `argv`（_argument vector_）：字符串数组，存放每个参数。
- 返回值 `int`：**退出码**。`0` 表示正常结束，正整数（1、2、3…）表示出错，各数字具体代表什么错误由程序员自己约定。

### 推导：为什么 `argc` 永远 ≥ 1？

执行 `./hello arg1 arg2 arg3` 时：

|下标|内容|
|---|---|
|`argv[0]`|`"./hello"`|
|`argv[1]`|`"arg1"`|
|`argv[2]`|`"arg2"`|
|`argv[3]`|`"arg3"`|

于是 `argc = 4`。可见 `argv[0]` 总是被执行的程序名，所以即使没有任何额外参数，`argc` 至少是 1。**这直接决定了练习里的参数检查：** 要求"两个数"的程序，应当检查 `argc == 3`，而不是 `argc == 2`。

### 声明与定义

仅有声明（接口）是不够的，还必须**定义**函数，也就是写出它的函数体。函数体放在花括号 `{ }` 里，称为**代码块**（_bloc de codi_）。块中每个动作叫一条**语句**（_statement_），语句之间以分号 `;` 分隔。C 对语句的排版几乎没有限制，一条语句可以跨多行，缩进对编译器没有意义（与 Python 相反），但为了可读性和后期维护，仍然应该缩进。

### 例子：hello.c 版本 (1)

```c
#include <stdio.h>

int main (int argc, char * argv[])
{
    printf ("Hello, World!\n");
    return 0;
}
```

执行流程：先调用 `printf`，把字符串写到标准输出（通常是终端）；然后按顺序执行 `return 0;`，让 `main` 返回给调用者，退出码 0 表示一切正常。

> [!warning] 引号陷阱 PDF 里的示例代码因为排版，出现了弯引号 `“ ”`。**直接复制到 `.c` 文件里会编译失败**，C 只认英文直引号 `" "`。另外 PDF 中有的地方写 `"Hello, World\n"`，有的地方写 `"Hello, World!\n"`，以后者为准，也与 `write(1, "Hello, World!\n", 14)` 的字节数对得上。

---

## 三、从源码到可执行文件：编译链

### 理论

**编译**（_compilar_）是把一种语言翻译成另一种语言，目标语言通常比源语言更低级。C 语言要经过下面四步才能得到可执行文件，而**解释型语言（Python、Perl、bash 等）不需要这个过程**，可以直接进入测试。

```mermaid
flowchart LR
    A["hello.c<br/>C 源码"] -- "预处理 cpp<br/>展开 #include / 常量" --> B["展开后的 C 文本"]
    B -- "编译" --> C["hello.s<br/>汇编代码"]
    C -- "汇编" --> D["hello.o<br/>目标文件 (二进制)"]
    D -- "链接 + libc.so" --> E["hello<br/>可执行文件"]
```

平时 `gcc` 会把前三步连在一起做，我们很少看见中间文件 `hello.s` 和 `hello.o`，但它们确实存在。本课程统一使用 **gcc**（也可以用 clang），这样所有人的编译选项和行为一致。查看帮助：`man gcc`、`gcc --help`、`gcc --help --verbose`。

### 方法：分两步走

```bash
$ gcc -c hello.c          # 只编译，生成目标文件 hello.o
$ gcc -o hello hello.o    # 链接，生成可执行文件 hello
$ ./hello                 # 运行
```

`$` 是命令行提示符，不要自己输入。选项含义：`-c` 表示只编译不链接；`-o 名字` 指定输出文件名。

### 为什么没有 `#include` 就会报警告？

如果 `hello.c` 里不写 `#include <stdio.h>`，编译会给出类似下面的警告，新版本编译器甚至直接报错：

```text
hello.c:3:4: warning: incompatible implicit declaration of built-in function 'printf'
```

原因是 C 和 C++ 有一条规则：**函数必须先声明、后调用**。编译器必须先知道 `printf` 是一个函数，以及它的参数和返回值是什么。`printf` 属于 C 标准库，它的声明写在头文件 `stdio.h`（_standard input/output header_）里。怎么知道该包含哪个头文件？看手册 `man 3 printf`，SYNOPSIS 一节会写明：

```c
#include <stdio.h>
int printf(const char *format, ...);
```

以 `#` 开头的是**预处理指令**，由编译的第一步**预处理器（cpp）**处理：把被包含的头文件文本拼进来、展开常量和宏，然后把结果交给真正的编译阶段。

### `#include` 的两种写法

|写法|搜索顺序|
|---|---|
|`#include "operacions.h"`|**先**在当前目录找，再到系统目录|
|`#include <stdio.h>`|**只**在预设目录（默认 `/usr/include`）找|

用 `-I` 可以追加搜索目录，自带目录始终放在最后：

```bash
$ gcc -c -I. -I/opt/support/include operacions.c
# 搜索顺序：当前目录 "." → /opt/support/include → /usr/include
```

**分离编译**时，每个 `.c` 配一个同名 `.h`（如 `operacions.c` / `operacions.h`），`.h` 里放该 `.c` 中函数的声明，供别的文件包含。

### 链接（_enllaçament_）

`printf` 的**定义**（真正的代码）不在你的文件里，而在 C 标准库中，通常是 `/usr/lib` 下的 `libc.so`（x86-64 机器上可能在 `/usr/lib/x86_64-linux-gnu`）。库里还有 `fopen`、`fread`、`fwrite` 等函数，以及 `open`、`read`、`write`、`fork`、`exec` 等系统调用的封装，全部是目标文件格式。链接的作用就是把 `hello.o` 和这些库拼在一起，生成可执行文件。可执行文件包含 `hello.o` 的全部内容，加上对库函数的引用。

gcc 默认自动链接 C 库，所以下面两条命令等价（`-lc` 的意思是"链接 `libc.so`"）：

```bash
$ gcc -o hello hello.o
$ gcc -o hello hello.o -lc
```

> [!note] 可执行文件的扩展名 GNU/Linux 里可执行文件传统上**没有扩展名**；Windows 才是 `.exe`。

---

## 四、输出与命令行参数

### 理论：三种输出方式

|方式|写法|特点|
|---|---|---|
|`printf`|`printf("格式串", 参数…)`|最常用，支持 `%` 格式化，默认输出到标准输出|
|`fprintf`|`fprintf(stdout, "格式串", 参数…)`|多一个"目标文件"参数，`stdout` 是默认打开的标准输出|
|`write`（系统调用）|`write(1, "Hello, World!\n", 14)`|不支持 `%`，只能写现成字符串，要自己给出字节数|

`write` 的三个参数依次是：`int file_descriptor`（文件描述符，1 代表标准输出）、`char * buffer`（要写的字符所在位置的指针）、`int data_size`（要写的字符个数）。`"Hello, World!\n"` 恰好 13 个可见字符加一个换行，共 14 字节。

### `printf` 常用格式符

格式串里以 `%` 开头的子串，会用后面的参数来替换：

|格式符|含义|
|---|---|
|`%s`|下一个参数当字符串|
|`%d`|下一个参数当有符号整数|
|`%u`|下一个参数当无符号整数（自然数）|
|`%x`|下一个参数当无符号整数，以十六进制输出|
|`%%`|输出一个字面的 `%`，不消耗参数|

`\n` 表示换行。其余格式符见 `man 3 printf`。

### 方法：用 `for` 循环遍历 `argv`

`for` 的语法是：

```c
for ( init ; condició ; step )
    cos          // cos 是单条语句，或 { 语句1; 语句2; ... }
```

`init` 做初始化，`condició` 判断是否继续，`step` 负责走到下一轮。以"从 1 数到 10"为例：

```c
int i;
for ( i = 1; i < 11; i++ ) {
    printf ("%d\n", i);
}
```

由上一节的推导可知，`argv` 的合法下标是 0 到 `argc - 1`，所以循环条件是 `i < argc`。现代 C（C99 起）允许直接在 `init` 里声明循环变量：

```c
for ( int i = 0; i < argc; i++ ) {
    printf ("argv[%d] = \"%s\"\n", i, argv[i]);
}
```

C 的三种循环为 `for`、`while`、`do-while`，都属于结构化编程。

### 例子：hello.c 版本 (2)

```c
#include <stdio.h>

int main (int argc, char * argv[])
{
    printf ("Hello, World!\n");
    for ( int i = 0; i < argc; i++ ) {
        printf ("argv[%d] = \"%s\"\n", i, argv[i]);
    }
    return 0;
}
```

运行 `./hello arg1 arg2 arg3` 会依次输出 `argv[0]` 到 `argv[3]`。字符串里的 `\"` 是转义，表示输出一个双引号字符。

---

## 五、make 与 Makefile

### 理论

每次改完代码都重新敲 `gcc` 命令很麻烦。GNU/Linux 的 `make` 工具可以把"目标需要哪些依赖、怎么生成"写进一个叫 **Makefile** 的文件里，由 `make` 自动判断需要重新做什么。默认查找名为 `Makefile` 或 `makefile` 的文件（按这个顺序），也可以用 `-f 文件名` 指定别的名字。

一个 Makefile 由若干**规则**组成，每条规则的结构是：

```make
目标: 依赖1 依赖2 ...
<TAB>要执行的命令
```

依赖必须是已存在的文件，或者可以通过别的规则生成的文件。

> [!danger] 命令行前面必须是 Tab 命令行必须以**制表符（Tab）**开头，用空格不行，否则会报错： `Makefile:4: *** missing separator. Stop.` 在 VS Code 里要留意编辑器是否把 Tab 自动转成了空格。

### `make` 如何判断要不要重新生成？（时间戳规则）

以 `hello: hello.c` 为例，`make` 的判断逻辑是：

1. 检查依赖 `hello.c` 是否存在（不存在则报错）。
2. 检查目标 `hello` 是否存在。
3. 若 `hello` 存在，并且它的修改时间**比 `hello.c` 更新**，什么也不做。
4. 若 `hello` 不存在，或者**比 `hello.c` 更旧**，就执行规则里的命令重新生成。

这就是为什么只改了一个文件时，`make` 只重新编译相关部分，速度很快。

### 方法：从简到繁

**一条规则（编译 + 链接合并）**

```make
hello: hello.c
	gcc -o hello hello.c
```

此时 `hello.o` 由 gcc 在内部生成并传给链接阶段，不需要我们处理。

**两条规则（分两步）**

```make
hello: hello.o
	gcc -o hello hello.o
hello.o: hello.c
	gcc -c hello.c
```

直接运行 `make`，会从**第一条规则**的目标开始，也就是 `hello`。它依赖 `hello.o`，而 `hello.o` 过期或不存在，于是先触发第二条规则，再回到第一条。也可以指定目标：`make hello.o`、`make hello`。

**`clean`：没有依赖的规则**

```make
clean:
	rm -f hello hello.o
```

没有依赖，所以每次 `make clean` 都会执行。`rm -f` 的 `-f` 保证文件不存在时也不报错。

**`all`：放在最前面的"总目标"**

```make
all: hello
	echo "Compilació acabada"
```

当项目有多个可执行文件时，把它们都写进 `all` 的依赖里，一条 `make` 就全部生成。因为它位于文件开头，所以是默认目标。

### 例子：hello 的完整 Makefile

```make
all: hello
	echo "Compilació acabada"

hello: hello.o
	gcc -o hello hello.o

hello.o: hello.c
	gcc -c hello.c

clean:
	rm -f hello.o hello
```

做练习时，往 `all` 的依赖里依次加入 `suma`、`calculadora`、`ordena` 即可。

> [!tip] 补充（PDF 之外） `clean` 和 `all` 并不是真正的文件名。如果目录里碰巧有同名文件，`make clean` 会误以为目标已是最新而不执行。标准做法是在 Makefile 里加一行 `.PHONY: all clean`，声明它们是"伪目标"。本讲义没有要求，但这是个好习惯。

---

## 六、数字转换：strtol

### 理论

命令行参数在 `argv` 里是**字符串**。字符串 `"672"` 和整数 `672` 在内存中完全不同，要做算术必须先转换。标准库函数 `strtol`（_string to long integer_）负责这件事，接口为：

```c
long int strtol (const char * str, char ** endstr, int base);
```

|参数|含义|
|---|---|
|`str`|要转换的字符串|
|`endstr`|输出参数：转换结束后，字符串"剩下的部分"从哪里开始。传 `NULL` 表示不需要|
|`base`|进制|

关于 `base`：

- 传 `10`：按十进制解释。
- 传 `0`：自动判断。默认十进制；以 `0x` 开头按十六进制（base 16）；以 `0` 开头按八进制（base 8）。

本实验里 `suma` 不期待数字后面还有别的字符，所以第二个参数传 `NULL`。`strtol` 能处理符号，所以 `-83`、`+200` 都能正确转换。

### 方法与例子

```c
long a = strtol (argv[1], NULL, 10);
long b = strtol (argv[2], NULL, 10);
printf ("resultat: %ld\n", a + b);
```

这里返回值是 `long`，所以输出时要用 `%ld` 而不是 `%d`。

> [!tip] 补充（PDF 之外） `base = 10` 与 `base = 0` 的区别在输入 `010` 时会体现：前者得 10，后者得 8。本实验的示例用的都是十进制，建议用 10 避免意外。如果想检测"输入不是数字"（如 `abc`），可以传入非 `NULL` 的 `endstr`，检查转换结束后指针是否仍然指向字符串开头，但本实验没有要求。

---

## 七、三个练习的分析

### 练习 1：`suma.c`

**需求**：`./suma <num1> <num2>` 输出 `resultat: <和>`，例如 `./suma 672 78` → `resultat: 750`；`./suma -83 +200` → `resultat: 117`；`./suma 200 -83` → `resultat: -117`。

**高层算法**（讲义给出的）：

1. 检查参数个数是否恰为两个，否则打印错误信息，以错误码 `1` 退出。
2. 用 `strtol` 转换 `num1`、`num2`。
3. 求和并存入变量 `resultat`。
4. 打印结果，以 `0` 退出。

**要点**：

- 参数检查的条件是 `argc != 3`（程序名占一个位置，见第二节的推导）。
- 错误信息可以用 `fprintf(stderr, …)` 输出到标准错误，这是惯例，不过讲义只要求"给出错误信息并以错误码 1 退出"。
- Makefile 里要新增 `suma` 的规则，并把它加入 `all`。

**配套脚本 `prova.sh`**：用 bash 多次调用 `./suma`，覆盖正数、负数、带 `+` 号的数，**并且要覆盖错误情形**：不传参数、只传一个数、传三个及以上的数。

### 练习 2：`calculadora.c`

**需求**：`./calculadora <整数> <运算符> <整数>`，运算符是 `+`、`-`、`*`、`/` 之一，输出运算结果。

**讲义的三条提示**：

1. 转换数字的方式和练习 1 相同，而且**可以在判断运算符之前就转换完**。
2. 用 `if-then-else` 链或 `switch-case` 判断运算符，二者都可以。
3. 不熟悉的函数（`strtol`、`printf`…）查手册页。

**要点与易错点**：

- 运算符是字符串 `argv[2]`，要取它的第一个字符 `argv[2][0]` 才能与 `'+'` 这样的**字符常量**比较（单引号表示字符，双引号表示字符串）。
- 在 shell 里，`*` 会被展开成当前目录的文件名列表，所以测试乘法时要写成 `./calculadora 3 '*' 4` 或 `3 \* 4`，这在 `test-calc.sh` 里尤其要注意。
- 整数除法会截断小数；除数为 0 的情况值得单独处理（讲义没提，但"测试所有情形"的要求里应当包含）。
- 讲义要求在无法识别的运算符时报错并结束。

**配套脚本 `test-calc.sh`**：覆盖四种运算、正负数组合、参数个数不对、非法运算符。

### 练习 3：`ordena.c`

**需求**：实现函数

```c
void ordena(int * vector, int n_elems);
```

参数是待排序的数组和元素个数。通过**交换**各位置上的值，把小的值挪到下标小的位置，大的值自然落到下标大的位置，也就是**升序排序**。基础代码（初始化随机数组）由讲义提供，下载方式：

```bash
# 下载地址见 PDF 第 13 页
$ tar xvf S3-FC_GIA.tar.gz     # 解压得到 ordena.c
```

**要点**：

- 讲义没有指定具体算法，用最基本的比较并交换（如冒泡排序、选择排序）即可。
- 函数返回 `void`，是**原地**排序：直接修改传入的数组，没有返回值。
- 要在 Makefile 中新增 `ordena` 的编译链接规则，并加到 `all`。

---

## 八、交付与自查清单

打包命令（在包含所有文件的目录里执行）：

```bash
$ tar czvf session3.tar.gz Makefile *.c *.sh
```

然后到 **RACO** 上传 `session3.tar.gz` 到对应的实验课提交位置。

**提交前自查**：

- [ ] `suma.c`、`calculadora.c`、`ordena.c` 都能被 `make` 编译，且没有警告
- [ ] 每个 `.c` 都有 `#include <stdio.h>`（以及用到 `strtol` 时的 `#include <stdlib.h>`）
- [ ] Makefile 命令行前面是 Tab，`all` 和 `clean` 都包含新目标
- [ ] `prova.sh` 覆盖：多组正确输入 + 无参数 / 一个参数 / 三个以上参数
- [ ] `test-calc.sh` 覆盖：四种运算、正负数、错误输入
- [ ] 脚本有可执行权限（`chmod +x prova.sh test-calc.sh`）
- [ ] 代码里没有从 PDF 复制来的弯引号
- [ ] 重新跑一遍 `make clean && make`，确认从零开始也能成功

---

## 速查表

|想做的事|命令|
|---|---|
|只编译成目标文件|`gcc -c hello.c`|
|链接成可执行文件|`gcc -o hello hello.o`|
|一步到位|`gcc -o hello hello.c`|
|添加头文件搜索目录|`gcc -c -I. -I/opt/support/include x.c`|
|查看函数手册|`man 3 printf`、`man 3 strtol`|
|自动构建|`make` / `make hello` / `make clean`|
|指定 Makefile|`make -f 文件名`|
|运行程序|`./hello`|
|解压 / 打包|`tar xvf S3-FC_GIA.tar.gz` / `tar czvf session3.tar.gz Makefile *.c *.sh`|

## 相关笔记

- FC 索引
- C 指针与内存
- 进制转换与补码