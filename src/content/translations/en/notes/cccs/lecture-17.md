---
kind: notes
source: cccs/lecture-17
title: Lecture 17 · Integrated Circuits and Moore’s Law
description: "CCCS Lecture 17: Integrated Circuits & Moore's Law"
sourceHash: 8bfd26e37f0034d00eb99f01c4df5b330895afc44f3df20137614299f81d334e
publish: true
translationMethod: machine-assisted
---

> **Course**: \[Computer Science Crash Course\] Crash Course Computer Science (PBS / All 40 episodes carefully revised)  
> **Module**: Module 3: System Architecture and Storage Media (Systems & Storage)  
> **Keynote speaker**: Carrie Anne Philbin  
> **Video duration**: 13:50 ｜ **HD screenshots**: 4 blackboard writing/illustrations on core knowledge points  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P17)](https://www.bilibili.com/video/BV1EW411u7th/?p=17)  
> **Full book navigation**: [← Previous lecture (P16)](/en/notes/cccs/lecture-16) ｜ [📚 Return to the full book catalog](/en/notes/topics/CCCS) ｜ [Next lecture (P18) →](/en/notes/cccs/lecture-18)

---

## Core Introduction and Concept Panorama

Detailed analysis of the physical invention of monolithic integrated circuits and the photolithography manufacturing assembly line, elucidation of the half century that Moore's Law has driven the rapid growth of human computing power, and discussion of quantum tunneling limits and the inevitable transformation of multi-core chip architecture.

---

## 1. The “tyranny” of discrete components and the disruption of monolithic integrated circuits

*(Reference time: 00:01:20 · [Video jump (P17 00:01:20)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=80))*

In the late 1950s, even as transistors replaced fragile vacuum tubes, computer engineering ran into a wall known as the Tyranny of Numbers:
- A complex computer with tens of thousands of transistors requires hand soldering of nearly a hundred thousand tiny resistors, capacitors, and copper wires;
- Even if the false soldering rate of a single solder joint is only one ten thousandth, the entire machine will crash almost every hour!

In 1958 and 1959, Texas Instruments **Jack Kilby **with Fairchild Semiconductor** Robert Noyce **Each independently made the most significant invention in the history of human industry——**Integrated Circuit (IC / Microchip)**:
Instead of soldering individual transistors together with wires,** On a single silicon semiconductor wafer, chemical lithography and diffusion processes are used to directly manufacture all transistors, resistors, capacitors and the metal interconnections between them.**! This completely eliminates the fragile joints of manual welding and realizes the industrialized mass copying of microelectronic hardware.

![Fairchild Semiconductor Silicon Planar Process: From Discrete Components to Monolithic Integration](</attachments/cccs-acbfad894cb90425a13819f7.png>)
*⏱ Timestamp: 00:02:40 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:02:40)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=160)*

## 2. Photolithography: Use light to carve the microscopic universe on silicon wafers

*(Reference time: 00:04:45 · [Video jump (P17 00:04:45)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=285))*

How exactly are modern chips produced? It relies on extremely precise magical craftsmanship——**Photolithography**: 
1. **Single crystal silicon wafer (Silicon Wafer)**: Smelting and stretching high-purity silicon into single crystal silicon rods, then cutting them into round wafers as thin as cucumbers;
2. **Oxide layer and photoresist (Photoresist)**: A layer of insulating silicon dioxide is grown on the surface of the silicon wafer at high temperature, and then evenly coated with a layer of photoresist chemical liquid that is extremely sensitive to ultraviolet light of a specific wavelength;
3. **Photomask Exposure**: The lithography machine places the designed complex chip circuit diagram (mask) on top of the silicon wafer, and deep ultraviolet light (DUV/EUV) penetrates the mask and projects it down. The photoresist exposed to light undergoes chemical denaturation;
4. **Development, etching and ion implantation (Etching & Doping)**: Chemical solvents wash away the denatured colloid, acid etches away the exposed oxide layer, then bombards silicon atoms with high-energy ions (doped with P-type/N-type impurities), and finally vapor-deposits ultra-fine copper wires.
Dozens of layers of masks are aligned and stacked layer by layer to build a hundred-story three-dimensional skyscraper with billions of transistors on a silicon wafer the size of a fingernail.

```mermaid
graph LR
    A["High purity monocrystalline silicon wafer"] --> B["Surface coating with photosensitive photoresist"]
    B --> C["High energy UV light penetration mask exposure"]
    C --> D["Chemical development etching to remove exposed parts"]
    D --> E["High temperature ion implantation PN knot"]
    E --> F["Metal Vapor Deposited Nanointerconnect Wires"]
    classDef default fill:#1e293b,stroke:#3b82f6,stroke-width:2px,color:#f8fafc;
```

![Photolithography: UV light, mask and nano-etching](</attachments/cccs-f2fa9bac0605c2bf52f5aeae.png>)
*⏱ Timestamp: 00:05:00 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:05:00)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=300)*

## 3. Gordon Moore’s Law: Half a Century of Exponential Myth

*(Reference time: 00:09:00 · [Video jump (P17 00:09:00)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=540))*

In 1965, Gordon Moore, a Fairchild Semiconductor engineer and future co-founder of Intel, published a prophetic insight in Electronics magazine: 
**The number of transistors that can fit on an integrated circuit chip doubles approximately every 18 to 24 months, yet the cost of the chip falls instead of rising!**

Moore's Law is not an objective physical law in nature, but a self-fulfilling military imperative for industrial development:
- 1971 Intel's first commercial microprocessor  **4004**  Has 2,300 transistors and is built on a 10-micron process;
- Today a top consumer CPU/GPU has more than  **100 billion transistors**, the process has entered 3 nanometers or even 2 nanometers!
No other industrial field in human history (such as automobiles, aviation, energy) has ever seen the exponential miracle of doubling every two years and improving performance tens of millions of times for 50 consecutive years. It was the rapid development of Moore's Law that allowed mainframes, which were as expensive as real estate, to become smartphones with powerful computing power in everyone's pocket.

![Gordon Moore's Law Curve: The number of transistors doubles every 18-24 months](</attachments/cccs-63ec08e80c4bfbd5499cf4e4.png>)
*⏱ Timestamp: 00:09:15 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:09:15)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=555)*

## 4. The impact of physical limits and the changing times of multi-core architecture

*(Reference time: 00:10:35 · [Video jump (P17 00:10:35)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=635))*

However, exponential growth cannot continue forever in a finite physical universe.

When the size of the transistor gate is reduced to only a few silicon atoms (a few nanometers), microscopic quantum effects begin to appear:
1. **Quantum Tunneling**: The electrons no longer obediently obey the blockage of the gate electric field, but directly "pass through the wall" through the obstacle, causing the transistor to leak seriously even if it is turned off;
2. **Power Wall and Thermal Death Limit (Power Wall)**: Chip power consumption and heat generation increase sharply at the cubic level as the frequency soars. The single-core frequency encounters a heat dissipation limit when it reaches about 4 GHz. If the frequency is increased again, the chip will directly turn into a furnace and melt itself.

#### Solution: From "vertical frequency increase" to "horizontal parallelism" (multi-core chips)
No longer forcing a single core to run infinitely fast, but integrating 4, 8, 16 or even hundreds of cores on the same silicon chip (Multi-Core Architecture)! Software and operating systems are moving towards multi-threading and multi-process concurrent scheduling, ushering in a grand new era of modern distributed and heterogeneous computing power.

![The impact of physical limits: quantum tunneling effect and modern multi-core multi-processor architecture](</attachments/cccs-7b8f65ac13716fab9cdbe1d0.png>)
*⏱ Timestamp: 00:10:45 · 📷 Classroom screenshot · [Watch the corresponding clip on Bilibili (P17 00:10:45)](https://www.bilibili.com/video/BV1EW411u7th/?p=17&t=645)*

---

## Attachment: Knowledge mind map and review thinking of this lecture

This lecture serves as  **Module 3: System Architecture and Storage Media (Systems & Storage)**  As the core component of the system, the system connects the thinking leap from the underlying hardware physical switch, the middle layer abstract protocol to the upper layer application. It is recommended to combine the original video of Station B with the graphic guide of this lecture for repeated verification to understand the engineering trade-offs and inevitable logic behind technological evolution.

[← Previous lecture (P16)](/en/notes/cccs/lecture-16) ｜ [📚 Return to the full book catalog](/en/notes/topics/CCCS) ｜ [Next lecture (P18) →](/en/notes/cccs/lecture-18)
