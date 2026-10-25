---
tags:
  - FC
status: ready
publish: true
title: Lab 04：T1 课程练习
description: ""
topic: FC - Lin
category: lin
date: 2026-10-20
---
# 1. 数字表示
## 2.2 进制转换
![截屏2026-10-19 13.57.29.png](</attachments/obsidian-03785e8becd89a4a8807a335.png>)
- 二进制：每增加一个 bit，就相当于增加一个二的幂次
	-  $2^5$ = 32 --> 0010 0000
	- ![截屏2026-10-19 13.28.58.png](</attachments/obsidian-51262352a6cd3781af6a5519.png>)
- 十六进制： 二进制每四位分一组
	- 0010 ｜ 0000 --> 0x20
	- 十六进制向左移动一位，相当于乘以 16，也就是二进制向左移动 4 位
	- eg: $2^{12}$ = 4096 = 0x1000
## 2.3 进制转换
![截屏2026-10-19 14.11.17.png](</attachments/obsidian-6956e4e2c789fdd8d23fa21c.png>)

## 2.1 big-endian / little-endian

![截屏2026-10-19 15.00.08.png](</attachments/obsidian-ed31a76ad2febfb3618cdc2d.png>)
- Big-endian（大端序）：高有效字节放在低内存地址。
- Little-endian（小端序）：低有效字节放在低内存地址。
- 也可记为：big-endian 顺序是正的
![截屏2026-10-19 15.17.37.png](</attachments/obsidian-2aeb1d4f5b4c970498f16f71.png>)
注意⚠️： D： hexadecimal要从右往左划分，不够的 补0
## 2.17 符号整数和补码

- complement a 2 : MSB 权重从 +$2^{n+1}$ 变成 - $2^{n+1}$ (8bit 即 -128)

![截屏2026-10-19 15.30.10.png](</attachments/obsidian-4cbb4a0a57cf99de24ef4698.png>)

- 符号扩展（Sign extension）就是复制原来的最高位。
	- 正数最高位为 `0`，向左补 `0`。
	- 负数最高位为 `1`，向左补 `1`。

![截屏2026-10-19 15.31.56.png](</attachments/obsidian-8a539d2bffe48aa264b13756.png>)

# 2. 浮点数
## 浮点数的表示：
- Signe + exponent + mantissa (32bits en total)
- bias = $2^{k-1}$ + 1 ----- 32bits : 8 bits 用于exponent, k = 8
- 步骤：以-46.0为例
	- 1. 符号为+/-， -：1
	- 2. 转binary， 46 = 32+8+4+2 --> 0010 1110
	- 3. 标准化， $101110_{2}$ = $1.01110_{2}$ * $2^5$ 
	- 4. 计算component， E = 5 + 127 = 132 = $10000100_{2}$ 
	- 5. 保存尾数（开头的1不保存）， 0111 000000....(23bits)
	- 6. 1|100 0010 0|011 1000 0000 0000 0000 0000
		  C      2       3       8       0       0        0       0
		  -46.0 = 0xc2380000
	- 7. big / small endian
![截屏2026-10-19 15.38.07.png](</attachments/obsidian-2d15025b5ea565bfd4bbd833.png>)


# 3. 二进制算数

## 算数规则
- shift 位移
	- 左移一位 相当于乘2
	- 右移一位 相当于除2
	- ⚠️注意 左移可能丢失最高位，负数的有符号的唯一也不适用
	- 178 - 89 = 89:
		-      10110010
		-    -01011001
		- ---------------
		-     01011001
## carry和overflow
- ‼️new notes：
	- OF 表示有符号情况下是否溢出
	- CF 表示是否发生进位（也意味着，是否发生无符号溢出）
	- 所以做题先算2进制，看是否进位（CF），然后按有符号的情况，看是否有符号溢出（OF）

- carry
	- 只关心是否te el rossec de sortida 所以，都按unsigne !!
	-    10110010  = 178
	- + 01011001  = 89
	- -------------------
	- 1 00001011  = 267 （需要9bits 才能正确表示）
	- ⬆️这里的1就是carry （如果我们只有8bits ，那么产生carry 1）
	- 注意⚠️ 不意味着发生overflow，需要看是否有符号！
		- 无符号，1 0000 1011 是267， 超出255，unsigned overflow✅ (CF = 1，OF=0)
		- 有符号，原题为 ： 10110010（-78） + 01011001（89） = 11，在-128 ～ 127内，overflow🈚️ （OF = 0)
		- ！！！ 注意区别（OF/CF 只是符号，并不代表数学意义上”溢出“）
		- **判断 CF 时看最高位是否向外进位；判断 OF 时看有符号结果是否超出范围**
- overflow
	- 数学上的正确结果，无法使用当前规定的有符号位数表示。
	- 可以通过转换成是否 符号数，然后看范围有没有超过

- Català: El flag de carry indica el ròssec de sortida, mentre que el flag d'overflow indica que el resultat no es pot representar correctament amb signe.
- Español: El flag de carry indica el acarreo de salida, mientras que el flag de overflow indica que el resultado no se puede representar correctamente con signo.

# 4. 逻辑运算
- 运算符号
	- ～ NOT，取反
	- & AND， 两个1
	- ｜OR， 至少一个1
	- ^ XOR， 两位不同
	- ---------------------
	- ！ logical NOT，  a = 01010101 -- > !a = 00000000， a  = 00000000 --> !a = 00000001
	- &&   logical AND,   两个都非0
	- ||   logical OR,  至少一个非0

![截屏2026-10-19 17.57.19.png](</attachments/obsidian-0765a6c72dc193f2459dc2cd.png>)![截屏2026-10-19 18.06.40.png](</attachments/obsidian-4e0d4725c40aaacf612d26df.png>)