---
kind: notes
source: fc/laboratory/lab-04t1-课程练习
title: Lab 04 · T1 Course Exercises
sourceHash: 5c71880033bd53f1f8fa6385b2d66a6e564c091810a3bd7898a89cfd95b814c8
publish: true
translationMethod: machine-assisted
---
# 1. Numerical representation
## 2.2 Base conversion
![Screenshot 2026-10-19 13.57.29.png](</attachments/obsidian-37e78e3c36556c71c091b6a8.png>)
- Binary: Each additional bit is equivalent to increasing a power of two
	-  $2^5$ = 32 --> 0010 0000
	- ![Screenshot 2026-10-19 13.28.58.png](</attachments/obsidian-311e9a90892396e11d07a769.png>)
- Hexadecimal: Binary is divided into groups of four digits
	- 0010 ｜ 0000 --> 0x20
	- Shifting the hexadecimal system one bit to the left is equivalent to multiplying by 16, which means moving the binary system 4 bits to the left.
	- eg: $2^{12}$ = 4096 = 0x1000
## 2.3 Base conversion
![Screenshot 2026-10-19 14.11.17.png](</attachments/obsidian-e5e8be1fc6a7f0f21401d157.png>)

## 2.1 big-endian / little-endian

![Screenshot 2026-10-19 15.00.08.png](</attachments/obsidian-155325fd6fd97e5f7c419099.png>)
- Big-endian: The most significant bytes are placed at lower memory addresses.
- Little-endian (little endian): The least significant byte is placed at the lower memory address.
- It can also be written as: big-endian order is positive
![Screenshot 2026-10-19 15.17.37.png](</attachments/obsidian-156483ade9042248460bdda4.png>)
Note⚠️: D: The hexadecimal should be divided from right to left. If it is not enough, add 0
## 2.17 Signed integers and two’s complement numbers

- complement a 2 : MSB weight from +$2^{n+1}$  becomes - $2^{n+1}$  (8bit is -128)

![Screenshot 2026-10-19 15.30.10.png](</attachments/obsidian-908d52ccfd225000288df981.png>)

- Sign extension (Sign extension) is to copy the original highest bit.
	- The highest bit of a positive number is  `0`, fill left  `0`.
	- The highest bit of a negative number is  `1`, fill left  `1`.

![Screenshot 2026-10-19 15.31.56.png](</attachments/obsidian-f167b653e174256fb30d403e.png>)

# 2. Floating point numbers
## Representation of floating point numbers:
- Signe + exponent + mantissa (32bits en total)
- bias = $2^{k-1}$ + 1 ----- 32bits : 8 bits for exponent, k = 8
- Steps: Take -46.0 as an example
	- 1. The sign is +/-, -: 1
	- 2. Convert to binary, 46 = 32+8+4+2 --\> 0010 1110
	- 3. standardization,  $101110_{2}$ = $1.01110_{2}$ * $2^5$ 
	- 4. Calculate component, E = 5 + 127 = 132 = $10000100_{2}$ 
	- 5. Save the mantissa (the leading 1 is not saved), 0111 000000....(23bits)
	- 6. 1|100 0010 0|011 1000 0000 0000 0000 0000
		  C      2       3       8       0       0        0       0
		  -46.0 = 0xc2380000
	- 7. big / small endian
![Screenshot 2026-10-19 15.38.07.png](</attachments/obsidian-537cf800a91f36cdb9358e88.png>)


# 3. Binary arithmetic

## Arithmetic rules
- shift shift
	- Shifting one position to the left is equivalent to multiplying by 2
	- Shifting one position to the right is equivalent to dividing by 2
	- ⚠️Note that left shift may lose the highest bit, and the signed uniqueness of negative numbers does not apply.
	- 178 - 89 = 89:
		-      10110010
		-    -01011001
		- ---------------
		-     01011001
## carry and overflow
- ‼️new notes: 
	- OF indicates whether to overflow if signed
	- CF indicates whether a carry occurred (also means, whether an unsigned overflow occurred)
	- So when doing the problem, first calculate the binary system to see if there is a carry (CF), and then press the signed case to see if there is a signed overflow (OF).

- carry
	- I only care about whether te el rossec de sortida, so press unsigne!!
	-    10110010  = 178
	- + 01011001  = 89
	- -------------------
	- 1 00001011 = 267 (9bits required for correct representation)
	- ⬆️The 1 here is carry (if we only have 8bits, then carry 1 is generated)
	- Note ⚠️ does not mean overflow occurs, you need to see if there is a symbol!
		- Unsigned, 1 0000 1011 is 267, exceeds 255, unsigned overflow✅ (CF = 1, OF=0)
		- There is a sign, the original title is: 10110010 (-78) + 01011001 (89) = 11, within -128 ~ 127, overflow🈚️ (OF = 0)
		- ! ! ! Pay attention to the difference (OF/CF are just symbols and do not mean "overflow" in the mathematical sense)
		- **When judging CF, check whether the highest bit is carried out; when judging OF, check whether the signed result is out of range.**
- overflow
	- The mathematically correct result cannot be expressed using the currently specified number of signed bits.
	- You can convert it into a symbolic number and then see if the range exceeds

- Català: The flag carries the indica and the ròssec de sortida, the flag becomes the overflow indica and the result is the correct representation of the sign.
- Español: El flag de carry indica el acarreo de salida, mientras que el flag de overflow indica que el resultado no se puede representar correctamente con signo.

# 4. Logical operations
- Operation symbols
	- ~ NOT, negate
	- & AND, two 1’s
	- \|OR, at least one 1
	- ^ XOR, two different bits
	- ---------------------
	- ! logical NOT,   a = 01010101 -- \> !a = 00000000,  a  = 00000000 --\> !a = 00000001
	- && logical AND, both are non-zero
	- \|\| logical OR, at least one non-zero value

![Screenshot 2026-10-19 17.57.19.png](</attachments/obsidian-3de61f7ef406f445b64a25fe.png>)![Screenshot 2026-10-19 18.06.40.png](</attachments/obsidian-c909292cfcfbe98b0b82cc75.png>)