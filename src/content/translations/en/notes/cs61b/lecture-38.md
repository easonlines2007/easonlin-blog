---
kind: notes
source: cs61b/lecture-38
title: "Lecture 38 · Data Compression: Huffman Coding, Prefix-Free Codes, and
  Bitstream I/O"
description: "CS61B Lecture 38: Data Compression Theory: Huffman Coding and
  Prefix-Independent Codes: Shannon Information Theory, Variable Length Coding,
  Prefix-Independent Codes, Huffman Tree Greedy Construction and Bitstream I/O"
sourceHash: 38540f5ef12bfccc36f8456d3a8b961d0b821ed28e2ae9d34e5689784959c38b
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 7: Software Engineering, Advanced Algorithms and Computational Theory (Software Engineering & Complexity)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 42:46 ｜ **Official original version**: Lecture 38 - Compression  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P38)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/1k4tgpf7xaW-uhlHYlp3izZRYtBGMYPVRlHCmmpN6QXQ) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/38.-compression-and-complexity)  
> **Quick navigation**: [← Previous lecture (P37 Software Engineering IV: Large-Scale System Evolution and Technical Debt)](/en/notes/cs61b/lecture-37) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P39 Computational complexity theory: reduction and P and NP problems) →](/en/notes/cs61b/lecture-39)

---

## 1. The mathematical essence of compression: redundancy elimination and Shannon information entropy (Information Entropy)

*(Reference time: 00:01:25 · [Video jump (P38 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38&t=85))*

Why can data be compressed?  
Because human language, images, and codes are filled with a large number of **Statistical Redundancy**!

In standard ASCII encoding, each character is equally assigned 8 bits (1 byte). But in the English text:
- letters  `'e'`  The frequency of occurrence is as high as 12.7%;
- And letters  `'z'`  The frequency of occurrence is only 0.07%!
- Let high frequency appear  `'e'`  and rare occurrences  `'z'`  Consuming the same 8 bits is an extremely huge waste of information!

Shannon information theory states: **High-frequency symbols should be assigned very short bit codes, while low-frequency symbols should be assigned longer bit codes.**, thereby minimizing the global weighted average bit length!

## 2. Prefix-Free Codes and ambiguity elimination

*(Reference time: 00:10:40 · [Video jump (P38 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38&t=640))*

If we use variable-length codes (Variable-Length Codes):
- hypothesis  `'A'`  encoded as  `0`, `'B'`  encoded as  `1`, `'C'`  encoded as  `01`; 
- When the receiver receives the bit stream  `01`  when, it actually represents  `"AB"`  Still a representative  `"C"`? A fatal ambiguity arises!

### Prefix-free code axiom
> **Prefix independent code theorem**:   
> **In the encoding system, the bit encoding of any character must not be the prefix of another character encoding!**

As long as prefix independence is met, when the decoder reads the bit stream one by one, once it matches a legal character, it can **Immediately complete sentence segmentation without ambiguity**!

## 3. Huffman Coding: Greedy tree construction algorithm

*(Reference time: 00:20:15 · [Video jump (P38 00:20:15)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38&t=1215))*

David Huffman proposed the classic greedy algorithm for constructing optimal prefix-free codes in 1952:

### The algorithm executes four steps:
1. **Statistics frequency**: Count the frequency of occurrence of each character in the text;
2. **Build a leaf forest**: Create a single node tree for each character, with a weight equal to the character frequency, and put them all into the \*\*Minimum Priority Queue (Min-PQ)\*\*;
3. **Circular merge of minimum two trees**: 
   - Pop the two trees with the smallest current weights from the priority queue  $T_1$  and  $T_2$; 
   - Create a new parent node as their common root with a weight of  $W = \text{weight}(T_1) + \text{weight}(T_2)$; 
   - It is stipulated that going left is bit  `0`, go right for bit  `1`; 
   - Reinsert the merged new tree into the priority queue;
4. Repeat the above merging until there is only one complete tree left in the priority queue. **Huffman tree**!

```mermaid
graph TD
    Root((right: 100)) -->|0| Left((right: 40))
    Root -->|1| Right((right: 60))
    Left -->|0| E["'e' (right: 25, code: 00)"]
    Left -->|1| T["'t' (right: 15, code: 01)"]
    Right --> O["'o' (right: 60, code: 1)"]
```
High-frequency characters appear close to the root in the tree, and their codes are extremely short; low-frequency characters are buried deep in the bottom layer, and their codes are long but rarely used. The global compression rate reaches the optimal limit of information theory!

## 4. Summary of this lecture and self-assessment after class

*(Reference time: 00:30:00 · [Video jump (P38 00:30:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38&t=1800))*

### Comprehensive self-test questions after class
When decompressing a file, how does the decompressor know what the original Huffman tree looks like?  
**Answers and analysis**:   
Compressed files must contain in the header **Serialized Huffman Tree (Trie Header)**! When the decompression program starts, it first reads the tree topology at the beginning of the file and restores the Huffman tree in the memory. Then the subsequent bit stream can be accurately decoded bit by bit based on the tree.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 38. Compression and Complexity

By Dhruti Pandya and Stella Kaval

---

## 38.1 Introduction to Compression

As an introduction to compression, consider the processes of creating and unzipping a zip file.

<pre class="language-bash"><code class="lang-bash">$ zip mobydick.zip mobydick.txt 

adding: mobydick.txt (deflated 59%)

$ ls -l

<strong>-rw-rw-r-- 1 jug jug 643207 Apr 24 10:55 mobydick.txt

</strong>-rw-rw-r-- 1 jug jug 261375 Apr 24 10:55 mobydick.zip

</code></pre>

Note that before and after unzipping, the file size changes!

### Compression Model 1: Algorithms on Bits

In our first model of compression, we consider compression as applying a *compression algorithm* on a sequence of bits. To reverse the compression, we apply the inverse *decompression algorithm.*

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FFG0MFuVNVZ3wL3buC33v%2Fimage.png?alt=media&amp;token=4a5cc8eb-2d02-40e9-ad2f-32f039943edd" alt=""><figcaption><p>Compression and decompression.</p></figcaption></figure>

Say you had a text file called `example.txt`. If you were to zip that text file, you'd get `example.zip`, a zip file with a size much lesser than the original `example.txt` file. This is the main idea behind compression--a technique used to reduce file size.

Then, if you were to unzip `example.zip` into a file called `unzippedexample.txt`, you would notice no difference between `example.txt` and `unzippedexample.txt.` This is an indicator of **lossless** compression, where no information is lost.

---

## 38.2 Prefix-free Codes

Consider the representation of English text in Java. We represent text as a sequence of characters, each taking 8 bits of memory.

One easy way to compress, then, is to simply use less than 8 bits per character. To do this, we have to decide which **codewords** (bit sequences) go with each **symbol** (character).

### Mapping Alphanumeric Symbols

#### Morse Code

As an introductory example, consider the Morse code alphabet. Looking at the alphabet below, what does the sequence – – • – – • represent? It’s ambiguous! The same sequence of symbols can represent either MEME, or GG, depending on what you choose – – • to represent

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F4s5DkbcGzBoxpRc8Bb3y%2FScreen%20Shot%202023-04-24%20at%205.44.37%20PM.png?alt=media&amp;token=bf521f7d-02f5-4c7e-95bb-a5159e9231c7" alt=""><figcaption><p>Ambiguity in morse code</p></figcaption></figure>

In real usage, operators must pause between codewords to indicate a break. The pause acts as an implicit third symbol, but we can't encode this real-time information into our code.

#### Prefix-free Codes

An alternate strategy to avoid the need for real-time is to use **prefix-free codes**. In a prefix-free code, no codeword is a prefix of any other. In the Morse Code example, there would be no confusion whether the – – in the pattern – – • – – • is supposed to represent M, or the start of G.

Let's represent Morse code as a tree of codewords leading to symbols. As we can see from the tree, several symbols have representations that are prefixes of other symbols.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FjFQrGPOHJtKo7EvY3GaL%2Fimage.png?alt=media&amp;token=d25e6cd8-3b6f-4868-adfb-8b976526d363" alt=""><figcaption><p>Morse code is not prefix-free.</p></figcaption></figure>

As an example of an (arbitrary) prefix-free code, consider the following encoding:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FPaawkPuLbznL6uT9XN6j%2Fimage.png?alt=media&amp;token=1e5ba4ff-a85f-477b-8b38-2a8f63536a9f" alt=""><figcaption><p>One prefix-free code.</p></figcaption></figure>

The following code is also prefix-free:

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F9XersVXbKTaZbKbgjsFK%2Fimage.png?alt=media&amp;token=dd5dd3a3-cb16-40c3-ad25-754a3948c8f7" alt=""><figcaption><p>Another prefix-free code.</p></figcaption></figure>

Note that some codes are more efficient for certain strings than others: in the first representation, `I ATE` uses less bits than the second code. However, this is highly dependent on what string we're trying to encode.

---

## 38.3 Shannon-Fano Codes

Shannon-Fano codes are an approach to create prefix-free codes based on a set of symbols/characters and their probabilities. The main idea is that we want shorter prefix-free codes for more popular characters, and longer codes for lesser used characters.

The algorithm is: 

* Count relative frequencies of all characters in a text.

* Split into ‘left’ and ‘right halves’ of roughly equal frequency.

  * Left half gets a leading zero. Right half gets a leading one.

  * Repeat.

At the end, you will get a tree as shown below, with shorter paths for characters with a higher frequency, and longer paths for characters with a lower frequency.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F9D5OVxQfZUCbTv0pBzif%2FScreen%20Shot%202023-04-24%20at%206.06.15%20PM.png?alt=media&amp;token=1ca46da8-df1e-4bff-ba42-2f564d571a21" alt=""><figcaption></figcaption></figure>

However, Shannon-Fano coding is NOT optimal, so it is not used very often.

---

## 38.4 Huffman Coding Conceptuals

### Core Idea

Huffman coding takes a bottom-up approach to prefix-free codes, as opposed to the top-down approach taken by Shannon-Fano codes. The algorithm is as follows:

* Calculate relative frequencies.

  * Assign each symbol to a node with weight = relative frequency.

  * Take the two smallest nodes and merge them into a super node with weight equal to sum of weights.

  * Repeat until everything is part of a tree.

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FHdCgQXuYkkNEwyzj9eRQ%2FScreen%20Shot%202023-04-24%20at%206.12.04%20PM.png?alt=media&amp;token=5310b79d-899a-4a9f-a708-9d049f968c74" alt=""><figcaption><p>Huffman Coding: step by step example (Part 1)</p></figcaption></figure>

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FSgwaQBso7fWo4Smc2EX9%2FScreen%20Shot%202023-04-24%20at%206.12.56%20PM.png?alt=media&amp;token=f36bd7a2-c9a4-4af3-bd47-61d4ad4e5a7d" alt=""><figcaption><p>Huffman Coding: step by step example (Part 2)</p></figcaption></figure>

### Data Structures

Let's now think about the data structures we would use for the encoding and decoding processes of the Huffman Coding process. Recall that encoding will translate symbols to code words and decoding will do the opposite. An example is as follows:

* Encoding translates `I ATE` into `0000011000100101.`

* Decoding translates `0000011000100101` into `I ATE`.

<details>

<summary>For encoding (bitstream to compressed bitstream), what data structure would we use? </summary>

There are two options!

1. **HashMap/TreeMap**: create a map from character to bit sequence, calling the `get()` method to look up each character

2. **Array**: Each index of the array would represent the character, with the bit sequence in that slot of the array. Recall that each character is just an integer. For example, the letter `A` is `65`). 

What's the difference? Arrays are faster than maps but might use more memory if indices are unused.

</details>

<details>

<summary>For decoding (compressed bitstream back to bitstream), what data structure would we use?</summary>

There is really only one good data structure that can help us find longest prefixes of bit streams.

**Trie**: Here, we can use a Binary Trie with numbers 0 and 1. When we get the bitstream, the trie allows easy lookup to the longest prefix. Below is an image that demonstrates how the trie could look.

<img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F6rPCfIWcycHM5KgUHE7u%2FScreenshot%202023-04-24%20at%208.50.11%20PM.png?alt=media&amp;token=65d1a466-d3f0-4841-9686-a319061ab6ab" alt="" data-size="original">

</details>

### In Practice

Now that we have talked about what Huffman Coding is, let's talk about some practical issues that arise when we want to use it. There are two main philosophies we can use.

#### Corpus

* For each input type (English text, Chinese text, images), assemble huge numbers of sample inputs for each category. Use corpus to create a standard code for English, Chinese, etc. 

* A corpus is a collection of pieces of language to be used as a sample of the language. Below is an example where we specify that we want to use the `ENGLISH` corpus to compress `mobydick.txt`

```

$ java HuffmanEncodePh1 ENGLISH mobydick.txt

```

**Problem:** Suboptimal encoding, which means our corpus does not exactly match our input. What this means in the context of this example is that `mobydick.txt` might not match up well with the general frequencies of `ENGLISH` texts and instead might have some other quirks or specifications from the author.

#### Unique Code

* For every possible input file, create a unique code just for that file. Then, when someone receives that file, they will know how to decode it using the code we send along the compressed file. 

* As seen in the example below, we do not specify a corpus and we send along another file to help the decoding process for that specific file.

```

$ java HuffmanEncodePh2 mobydick.txt

```

**Problem**: This approach requires us to use extra space for the codeword table in the compressed bitstream. However, this generally works better than the corpus philosophy so is used commonly in the real world.

---

## 38.5 Compression Theory

### Compression Ratios

* The goal of data compression is to reduce the size of a sequence of data while retaining as much information as possible. For example, the letter `e` appears more frequently in the English dictionary than `z`, so we would want to represent `e` with smaller bits.

* **Compression ratio** is a measure of how much the size of the compressed data differs from the original data. 

  * **Huffman Coding** is a compression technique that represents common symbols with smaller numbers of bits, resulting in a more efficient encoding. 

  * **Run-length encoding** is another compression technique that replaces repeated characters with the character itself and the number of times it occurs. 

  * **LZW** is a compression technique that searches for common repeated patterns in the input and replaces them with a shorter code. 

* The general idea behind most compression techniques is to exploit any existing redundancy or order within the sequence to reduce the size of the data. However, if a sequence has no existing redundancy or order, compression may not be possible.

### Self-Extracting Bits

* Self-extracting bits is a compression technique that wraps the compressed bits and the decompression algorithm into a **single sequence of bits**.

* The goal is to simplify the compression and decompression process by combining the two steps into one. Self-extracting bits can be used to create executable files that can be run on any system with an interpreter (e.g. Java interpreter).

<figure><img src="https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FJemTikv95FxAqt71xrYG%2FScreenshot%202023-04-24%20at%209.34.44%20PM.png?alt=media&amp;token=b0f9e455-4563-43ad-974f-63e8dd84b508" alt=""><figcaption></figcaption></figure>

### HugPlant Example

* To compress an image file like `hugplant.bmp`, we can break it into 8-bit chunks and Huffman encode each chunk.

* We package the compressed data plus decoder into a single self-extracting `.java` file, represented as a `byte[]` array.

* When the `byte[]` array is passed to an interpreter, the interpreter executes the Huffman decoding algorithm and produces the original `hugplant.bmp` image file.

* The size of the compressed bitstream and the Huffman decoding algorithm combined is **smaller** than the original image file, making it more efficient to store and transmit.

* However, the receiver of the compressed file must have access to the appropriate interpreter to decode and reconstruct the original image.

---

## 38.6 LZW Compression

### Key Idea

The LWZ approach is based on the idea of exploiting redundancy and patterns in the input data to achieve compression. Basically, each codeword can represent multiple symbols.

For example, imagine a sequence of symbols `ABCABCA`. In traditional compression, each symbol would be mapped to a fixed-length codeword, resulting in a compressed sequence like `010001001000100100`. With the LWZ approach, the codewords can be based on patterns in the input data. In this case, the algorithm might start with a codeword table. (A --> 0, B --> 1, C --> 2). This could result in a compressed sequence looking something like `01201201`. By allowing for codewords that can represent multiple symbols, the LWZ approach can achieve more efficient compression than traditional approaches.

### Algorithm

* The algorithm starts with a simple codeword table where each codeword corresponds to a single symbol.

* Whenever a codeword is used, a new codeword is created by concatenating the previous codeword with the next symbol.

* The algorithm does not specify what happens when the codeword table becomes full, but there are many variants of the algorithm that handle this differently.

* A neat fact about the LWZ approach is that it is possible to reconstruct the codeword table from the compressed bitstream alone, without needing to send the table along with the compressed data.

* LWZ decompression [demo](https://docs.google.com/presentation/d/1U8XO6CWfcU4QgrFOZmGjAgmaKxLc8HXk6qB1JQVlqrg/edit#slide=id.g53705ba95_0259).

### Fun Facts

* The algorithm is named after its inventors, Lempel, Ziv, and Welch.

* The LWZ algorithm is used as a component in many compression tools, including .gif files, .zip files, and more.

* The LWZ algorithm was once controversial due to attempts to enforce licensing fees, but the patent expired in 2003.

---

## 38.7 Summary

**Compression Model #1: Algorithms Operating on Bits.** Given a sequence of bits B, we put them through a compression algorithm C to form a new bitstream C(B). We can run C(B) through a corresponding decompression algorithm to recover B. Ideally, C(B) is less than B.

**Variable Length Codewords.** Basic idea: Use variable length codewords to represent symbols, with shorter keywords going with more common symbols. For example, instead of representing every English character by a 8 bit ASCII value, we can represent more common values with shorter sequences. Morse code is an example of a system of variable length codewords.

**Prefix Free Codes.** If some codewords are prefixes of others, then we have ambiguity, as seen in Morse Code. A prefix free code is a code where no codeword is a prefix of any other. Prefix free codes can be uniquely decoded.

**Shannon-Fano Coding.** Shannon-Fano coding is an intuitive procedure for generating a prefix free code. First, one counts the occurrence of all symbols. Then you recursively split characters into halves over and over based on frequencies, with each half either having a 1 or a 0 appended to the end of the codeword.

**Huffman Coding.** Huffman coding generates a provably optimal prefix free code, unlike Shannon-Fano, which can be suboptimal. First, one counts the occurrence of all symbols, and create a “node” for each symbol. We then merge the two lowest occurrence nodes into a tree with a new supernode as root, with each half either having a 1 or a 0 appended to the beginning of the codeword. We repeat this until all symbols are part of the tree. Resulting code is optimal.

**Huffman Implementation.** To compress a sequence of symbols, we count frequencies, build an encoding array and a decoding trie, write the trie to the output, and then look up each symbol in the encoding array and write out the appropriate bit sequence to the output. To decompress, we read in the trie, then repeatedly use longest prefix matching to recover the original symbol.

**General Principles Behind Compression.** Huffman coding is all about representing common symbols with a small number of bits. There are other ideas, like run length encoding where you replace every character by itself followed by its number of occurrences, and LZW which searches for common repeated patterns in the input. More generally, the goal is to exploit redundancy and existing order in the input.

**Universal Compression is Impossible.** It is impossible to create an algorithm that can compress any bitstream by 50%. Otherwise, you could just compress repeatedly until you ended up with just 1 bit, which is clearly absurd. A second argument is that for an input bitstream of say, size 1000, only 1 in 2^499 is capable of being compressed by 50%, due to the pigeonhole principle.

**Compression Model #2: Self Extracting Bits.** Treating the algorithm and the input bitstream separately (like we did in model #1) is a more accurate model, but it seems to leave open strange algorithms like one in which we simply hardcode our desired output into the algorithm itself. For example, we might have a .java decompression algorithm that has a giant `byte[]` array of your favorite TV show, and if the algorithm gets the input `010`, it outputs this `byte[]` array.

In other words, it seems to make more sense to include not just the compressed bits when considering the size of our output, but also the algorithm used to do the decompression.

One conceptual trick to make this more concrete is to imagine that our algorithm and the bits themselves are a single entity, which we can think of a self-extracting bit sequence. When fed to an interpreter, this self-extracting bit sequence generates a particular output sequence.

**Hugplant Example.** If we have an image file of something like the hugplant.bmp from lecture, we can break it into 8 bit chunks and then Huffman encode it. If we give this file to someone else, they probably won’t know how to decompress it, since Huffman coding is not a standard compression algorithm supported by major operating systems. Thus, we also need to provide the Huffman decoding algorithm. We could send this as a separate .java file, but for conceptual convenience and in line with compression model \#2, we’ll imagine that we have packaged our compressed bit stream into a `byte[]` array in a .java file. When passed to an interpreter, this bitstream yields the original hugplant.bmp, which is 4 times larger than the compressed bitstream + huffman interpreter.

---

## 38.8 Exercises

### Factual

1. Suppose we build a Shannon Fano or Huffman code for the text of this question including spaces and punctuation characters. Which characters would have the longest code?

2. What two ways could we represent a Huffman code for characters in Java?

<details>

<summary>Problem 1</summary>

`?` and `.`, since both are only used once in the above sentence.

</details>

<details>

<summary>Problem 2</summary>

A `HashMap<Character, BitSequence>` or a `BitSequence[]`. Note that the two are equivalent in Java because a Character is a number.

</details>

### Procedural

1. Suppose we have a string `abcdefg` which repeats 1000 times. How many bits would be in the compressed bitstream?

<details>

<summary>Problem 1</summary>

Since all 8 characters are equal in frequency, we get a balanced binary tree as our Huffman encoding, so all codewords are 3 bits long. 1000 \* 8 \* 3 = 24000 bits.

</details>

### Metacognitive

1. Using the idea of self-extracting bits, come up with an encoding for the sequence `abdefg` repeated 1000 times that uses less than 2000 bits. 

<details>

<summary>Problem 1</summary>

The idea of self-extracting bits includes writing code or an interpreter that can generate the original uncompressed sequence. This can be done with the following code:

```java

public class Sequence {

    public static void main(String[] args) {

        for (int i = 0; i < 1000; i++) {

            for (int j = 0; j < 8; j++) {

                System.out.print(String.format("%c", 'a' + j));

            }

        }

    }

}

```

This code uses exactly 239 characters, or 1912 bits. This demonstrates the power of the self-extracting bits model: compare this to the 24000 bits required for a Huffman code.

</details>


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous Lecture: Software Engineering IV: Large-Scale System Evolution and Technical Debt](/en/notes/cs61b/lecture-37) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Computational complexity theory: reduction and P and NP problems →](/en/notes/cs61b/lecture-39) | [🎬Watch this lecture on Bilibili (P38)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=38) |
