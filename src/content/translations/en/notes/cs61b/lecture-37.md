---
kind: notes
source: cs61b/lecture-37
title: "Lecture 37 · Software Engineering IV: Technical Debt, CI/CD, and System
  Evolution"
description: "CS61B Lecture 37: Software Engineering IV: Large-Scale System
  Evolution and Technical Debt: Technical Debt Hazards, CI/CD Automated
  Pipeline, Code Review Philosophy and Defensive Architecture Evolution"
sourceHash: 6fa0e74ba58b613df2df797ae54a4da59f6c6e94229d102be42a8858dee4f5df
publish: true
translationMethod: machine-assisted
---

> **Course**: UC Berkeley CS61B: Data Structures (Spring 2024)  
> **Module**: Module 7: Software Engineering, Advanced Algorithms and Computational Theory (Software Engineering & Complexity)  
> **Lecturer**: Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **Video duration**: 54:00 ｜ **Official original version**: Lecture 37 - Software Engineering IV  
> **Direct video**: [📺Watch the original video of this lecture on Bilibili (P37)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37) ｜ [📑 Official courseware Slides (Google Presentation)](https://docs.google.com/presentation/d/13TE3w603C6zt1q5vWRL9WmbwxkG0VjFluIIHSbV0qNU/edit) ｜ [📖Official textbook chapter](https://cs61b-2.gitbook.io/cs61b-textbook/37-software-engineering-iv)  
> **Quick navigation**: [← Previous Lecture (P36 Sorting VI: Radix Sorting vs. Comparative Sorting Ultimate Showdown)](/en/notes/cs61b/lecture-36) ｜ [📚 Return to the full book catalog](/en/notes/topics/CS61B) ｜ [Next lecture (P38 Data compression theory: Huffman coding and prefix-free code) →](/en/notes/cs61b/lecture-38)

---

## 1. The invisible killer of software engineering: Technical Debt (Technical Debt)

*(Reference time: 00:01:25 · [Video jump (P37 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=85))*

In startups or emergency development cycles, engineers often resort to "cutting corners" (e.g. skipping writing unit tests, hard-coding configurations, copy-pasting code) in order to deliver features quickly.

Ward Cunningham famously proposed the technical debt metaphor:
- When you borrow, you do get short-term delivery speed;
- But as long as the debt is not repaid, with every subsequent feature iteration, you must **Paying heavy interest (high maintenance costs, frequent online crashes, extremely slow debugging cycles)**; 
- When interest eats up all the engineering productivity of the team, the entire system will fall into technical bankruptcy, and reconstruction becomes the only way out.

## 2. Continuous integration and continuous delivery (CI/CD) pipeline

*(Reference time: 00:10:40 · [Video jump (P37 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=640))*

Modern software teams will never allow the disaster of "it works on a programmer's local machine but not on the production server".

The iron law of automation of \*\*Continuous Integration (CI)\*\*:
- Whenever code is pushed to the repository branch, the remote cloud server automatically starts a clean sandbox environment;
- Automatically trigger compilation, code style check (Style Checker), and run a full automated test suite (JUnit);
- Only code that passes 100% of all quality gates will be allowed to be merged into the master branch.

## 3. Summary of this lecture and post-class self-test

*(Reference time: 00:20:00 · [Video jump (P37 00:20:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=1200))*

### Self-test after class
How to effectively pay off technical debt in large projects?  
**answer**: Practice the “Boy Scout Rule”—leave camp cleaner than you found it. Every time you fix a bug or develop a new feature, refactor and clean up the surrounding old and bad code, and complete the automated test cases.

## 4. Dependency Injection and high-order testability design

*(Reference time: 00:26:30 · [Video jump (P37 00:26:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=1590))*

When designing a large object-oriented system, if a class directly  `new`  Services it depends on:
```java
public class OrderService {
    private PaymentGateway payment = new StripePaymentGateway(); // 硬编码紧密耦合！
}
```
**Serious disadvantages**: You can't isolate the real payment network when running unit tests! Your unit test might actually initiate a credit card charge!

### Dependency Injection (DI)
Pass in external dependencies as interfaces through the constructor:
```java
public class OrderService {
    private PaymentGateway payment;

    // 依赖注入：控制反转 (Inversion of Control, IoC)
    public OrderService(PaymentGateway payment) {
        this.payment = payment;
    }
}
```
Pass in the real  `StripePaymentGateway`; Seamlessly pass in a completely fake mock object (Mock Object) in the unit test:
```java
PaymentGateway mockPayment = new MockPaymentGateway();
OrderService service = new OrderService(mockPayment);
```
The system instantly has a very high level of unit testability and module replacement capabilities.

## 5. Classic Code Smells and Martin Fowler’s Refactoring Checklist

*(Reference time: 00:34:00 · [Video jump (P37 00:34:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2040))*

Martin Fowler summarized the typical "bad smell" of code corruption in his book "Refactoring":

1. **Long Method**: A method exceeds 50 lines and is mixed with multiple unrelated responsibilities. **Refactoring technique: Extract Method**; 
2. **Large Class / God Class**: A class has dozens of instance variables and hundreds of methods. **Refactoring technique: Extract Class**; 
3. **Duplicated Code**: Copy and paste the same logic in different branches. **Refactoring techniques: Pull Up Method or extract public tools**; 
4. **Feature Envy**: A method frequently calls getters and setters of another class. It means that the method is in the wrong place and should be moved to the class to which the data belongs;
5. **Data Clumps**: Several variables always appear together (such as  `int start, int end`  or  `String street, String city`). It should be encapsulated as an independent parameter object (Parameter Object).

## 6. The Testing Pyramid

*(Reference time: 00:41:30 · [Video jump (P37 00:41:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2490))*

Test quality of large software systems consists of hierarchical **test pyramid** To maintain:

```text
       / \
      /   \     端到端测试 (E2E / UI Tests) - 极少量 (运行最慢、维护成本最高)
     /-----\
    /       \   集成测试 (Integration Tests) - 适量 (验证服务间通信与数据库交互)
   /---------\
  /           \ 单元测试 (Unit Tests / JUnit) - 海量基石 (毫秒级极速运行、定位精准)
 /-------------\
```

- **The underlying cornerstone: Unit Tests**: Covers all algorithm boundaries and core data structure logic, requires execution within milliseconds, and is automatically triggered every time the code is saved;
- **Middle layer: Integration Tests**: Verify the interface contract when multiple modules work together;
- **Top level: End-to-End Tests**: Simulate real user click operations to verify key business links.

## 7. Industrial-grade build tools (Maven/Gradle) and CI/CD pipeline engineering practices

*(Reference time: 00:48:00 · [Video jump (P37 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2880))*

Breaking away from simple single files  `javac`  After compilation, modern Java projects are organized through standardized build tools:
- **Dependency Management**: Declare external open source library coordinates (such as  `org.junit.jupiter:junit-jupiter-api:5.10.0`), the build tool automatically downloads and resolves transitive dependencies from the central warehouse;
- **Build Lifecycle**: Standardized pipeline (`compile -> test -> package -> verify -> install -> deploy`); 
- **GitHub Actions automated pipeline configuration**: 
  ```yaml
  name: Java CI
  on: [push, pull_request]
  jobs:
    build:
      runs-on: ubuntu-latest
      steps:
      - uses: actions/checkout@v3
      - name: Set up JDK 21
        uses: actions/setup-java@v3
        with:
          java-version: '21'
      - name: Build with Gradle
        run: ./gradlew build test
  ```
Each submission automatically executes a full set of regression tests in the cloud to protect production safety.

## 8. Evolution of large-scale system architecture: trade-offs from monolith to microservices

*(Reference time: 00:54:00 · [Video jump (P37 00:54:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3240))*

### The ultimate rule of architectural trade-offs: No Silver Bullet
- **Monolithic Architecture**: 
  - All functions are packaged as one large process for deployment;
  - Advantages: development and debugging are simple, local calling performance is extremely good, and strong transaction consistency is easy to ensure;
  - Disadvantages: When the number of team members exceeds hundreds, code conflicts are frequent and single points of failure affect the overall situation.
- **Microservices Architecture**: 
  - Split into dozens of independent small services by business domain (Domain-Driven Design), communicating through network RPC or message queue;
  - Advantages: Each team deploys and evolves independently and isolates faults;
  - Disadvantages: extremely high operation and maintenance complexity due to the introduction of network delays, two-phase submission of distributed transactions, distributed locks and link tracking.

> **Engineering sobriety agent**: Blindly splitting microservices before the business scale reaches a critical point is a typical technical overload. Excellent architects always adhere to \*\*"evolutionary architecture"\*\* to match system complexity with business scale.

## 9. Game architecture and independent game development: from Project 3 BYOW to business engine

*(Reference time: 00:58:00 · [Video jump (P37 00:58:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3480))*

The big finale in CS 61B  **Project 3: Build Your Own World (BYOW)** , students must program a 2D tile-based randomized world exploration game from scratch, similar to Rogue or NetHack.

Guest lecturer Circle Chen pointed out: Game development is the most challenging task in computer science. **High concurrency, high real-time and complex state organization** Comprehensive engineering practice.

### Programmer’s Perspective vs Player’s Perspective
- **Player perspective (Aesthetics / Dynamics)**: Exploring unknown dungeons, thrilling monster chases, and reasonable resource collection;
- **Programmer's Perspective (Code Architecture)**: 
  - How to run stable at 60 FPS?
  - How to use a pseudo-random number generator (PRNG) to ensure that the same dungeon world can be reproduced 100% by inputting the same seed?
  - How to organize the state of characters, enemies, props, walls and lights?

## 10. Decoupling the game core loop (Game Loop) and the entity component system (ECS)

*(Reference time: 01:03:00 · [Video jump (P37 01:03:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3780))*

### 1. The Game Loop
Unlike traditional GUI software that waits for user click events, time in the game world passes autonomously in one direction:
```java
while (gameRunning) {
    long currentTime = System.currentTimeMillis();
    long elapsedTime = currentTime - lastTime;
    
    processInput();               // 1. 处理键盘/鼠标输入
    updateWorld(elapsedTime);     // 2. 根据时间差更新物理与实体状态 (Tick)
    renderGraphics();             // 3. 绘制当前帧到屏幕
    
    sleepRemaining(targetFrameTime); // 4. 控制帧率稳定在 60 FPS
}
```

### 2. Why did traditional deep OOP inheritance completely fail in the game?
Beginners like to write deep inheritance: 
`Entity -> Monster -> FlyingMonster -> FireBreathingFlyingMonster`.  
**Disaster occurs**: If the planner suddenly proposes to design a "mimic monster that cannot fly but can breathe fire", your inheritance system will collapse instantly!

### Entity-Component-System (ECS, Entity-Component-System)
Modern game engines (Unity DOTS, Unreal, Bevy) have fully shifted to ECS architecture:
- **Entity**: Just a lightweight unique integer ID (like  `Entity #1024`); 
- **Component**: Pure data payload structure without any logical methods (such as  `PositionComponent`, `HealthComponent`, `RenderComponent`); 
- **System**: Pure logical function, focused on traversing all entities with a specific combination of components (such as  `MovementSystem`  Specializes in handling both possessions  `Position`  and  `Velocity`  entity).

Through the free combination of components (Composition), you can assemble an infinite variety of new game objects at will without modifying any class inheritance tree!

## 11. Procedural Content Generation (PCG): Random Dungeon and Pseudo-Random Number Generator (PRNG)

*(Reference time: 01:08:00 · [Video jump (P37 01:08:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4080))*

In BYOW, the core challenge is **Procedural Content Generation (PCG)**: 

### Algorithm steps:
1. **Pseudo-random seed (Deterministic Seed)**:
use  `java.util.Random(seed)`. The same seed generates an exact pseudo-random number sequence, which allows a huge random world to be compressed into a 64-bit long integer number for saving and online synchronization!
2. **Room and corridor generation algorithm**: 
   - **Binary Space Partitioning (BSP, Binary Space Partitioning)**: Recursively divide the large rectangular map into two halves until the slice reaches the target room size, generate rooms in each leaf slice, and open connected corridors on the dividing line;
   - **Random Walk**: Randomly walk up, down, left, and right from the starting point, and paint the squares along the way into the floor, naturally forming a winding cave terrain;
   - **Cellular Automata**: A life-simulating game that iteratively smooths according to the wall density of surrounding neighbors to generate extremely natural cave rock edges.

## 12. Game Modding and plug-in architecture design

*(Reference time: 01:13:00 · [Video jump (P37 01:13:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4380))*

The long-lasting prosperity of legendary games such as “Minecraft” and “Civilization” is attributed to their powerful modding ecosystem.

### How to design an open source architecture that supports external mods?
1. **Event Hooks**:
Expose event listeners at key business logic points (e.g.  `OnPlayerMoveEvent`, `OnTileDamagedEvent`); 
2. **Java reflection mechanism (Reflection) and class loader (ClassLoader)**:
Game main program scan  `mods/`  external under folder  `.jar`  file, use  `URLClassLoader`  Dynamically load externally written classes at runtime;
3. **Data-Driven Design**:
All monster health, drops, and textures are extracted into external JSON or YAML files, allowing non-programmer players to create new game content by simply modifying the text configuration.

## 13. BYOW tile rendering pipeline and line of sight occlusion lighting algorithm (Line of Sight Raycasting)

*(Reference time: 01:17:00 · [Video jump (P37 01:17:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4620))*

In Project 3 BYOW, in order to create an immersive dungeon exploration atmosphere, the Fog of War and sight occlusion algorithms must be implemented:

### core physical model
- The entire world consists of a two-dimensional grid of tiles  `TETile[][] world`  composition;
- The player is at the coordinates  $(x_0, y_0)$, has a fixed field of view radius  $R$; 
- **Raycasting**: Emit discrete sight beams 360 degrees from player coordinates (Bresenham's Line Algorithm). When light touches an opaque wall tile, the light transmission in that direction is immediately interrupted;
- Only the floor and prop tiles illuminated by the light are rendered and marked as "known areas", and the unlit areas are blackened and hidden, which greatly enhances the sense of exploration and mystery.

## 14. Game physics collision detection (AABB axis-aligned bounding box) and grid addressing

*(Reference time: 01:21:00 · [Video jump (P37 01:21:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4860))*

In a 2D game, determine whether a player or monster hit an obstacle:
- **Tile Collision**: In the grid map, predict the target coordinates before moving  $(x + \Delta x, y + \Delta y)$  tile type; if  `world[x + dx][y + dy].equals(Tileset.WALL)`, directly intercept movement and avoid passing through walls;
- **AABB Axis-Aligned Bounding Box**: For dynamic entities whose dimensions span multiple pixels or tiles, use the four-corner coordinate overlap determination of the rectangular box: 
  $$\text{Collides} = (A.x_1 < B.x_2) \land (A.x_2 > B.x_1) \land (A.y_1 < B.y_2) \land (A.y_2 > B.y_1)$$

## 15. A\* addressing on grid graph and monster chasing AI state machine (FSM)

*(Reference time: 01:25:00 · [Video jump (P37 01:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5100))*

Monsters in dungeons need to have autonomous intelligence to track players:

### 1. Finite State Machine (FSM)
The monster's behavioral logic is modeled as discrete state switching:
- **Patrol status (Patrol)**: Randomly strolling in the corridors;
- **Alert and chase state (Chase)**: Once the player enters the monster's line of sight (Euclidean distance  $\le$  alert threshold), the state switches to chasing, and the pathfinding algorithm is started;
- **Attack state (Attack)**: Launch an attack when adjacent to a player.

### 2. Grid A\* pathfinding engine
Calling Lecture 24’s A\* search algorithm:
- Each access floor in the grid graph is a graph node;
- The edge weight is always 1;
- **heuristic function  $h(v)$**: Adopt absolutely acceptable **Manhattan Distance**: 
  $$h(x, y) = |x - x_{\text{player}}| + |y - y_{\text{player}}|$$
 Pass  $O(V \log V)$  With A\* pathfinding, monsters can cleverly bypass complex corners and maze walls and head straight towards the player's location!

## 16. Memory management and garbage collection pause (GC Pause) elimination technology in modern game engines

*(Reference time: 01:29:00 · [Video jump (P37 01:29:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5340))*

In a real-time game at 60 FPS, the rendering budget for each frame is only a short  **16.6 milliseconds**.

### The GC Pause Crisis in real-time systems
If the game creates tens of thousands of short-lived temporary objects per second (such as  `Vector2D`, ammunition spark particles  `Particle`): 
- The Young Generation of JVM heap memory will be filled up at an alarming rate;
- When Minor GC is triggered, the JVM may experience millisecond-level "Stop-The-World";
- This causes obvious instantaneous frame drops and freezes (Jank/Stutter) in the game screen, seriously damaging the player experience.

### Industrial-grade zero GC optimization technique: Object Pool Pattern
When the game starts, pre-allocate a fixed-capacity immutable object pool:
```java
public class ParticlePool {
    private final Particle[] pool;
    private int freeIndex = 0;

    public ParticlePool(int size) {
        pool = new Particle[size];
        for (int i = 0; i < size; i++) pool[i] = new Particle();
    }

    public Particle allocate() {
        if (freeIndex >= pool.length) return null; // 保护上限
        return pool[freeIndex++];
    }

    public void release(Particle p) {
        pool[--freeIndex] = p; // 回收重复使用，绝不 new 新对象！
    }
}
```
By reusing existing objects and using native base arrays instead of object wrapper classes, all dynamic heap allocations are eliminated and frame rates are kept as smooth as water!

## 17. Summary of the essence of software engineering: from CS 61B big job to industrial-level million-line architecture

*(Reference time: 01:33:00 · [Video jump (P37 01:33:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5580))*

Looking back at the three landmark projects of CS 61B (2048, Gitlet, BYOW):
1. **Modularity and Separation of Concerns**: Completely decouple the model layer (Model), view layer (View) and controller layer (Controller);
2. **Test first to protect**: Complex boundary conditions (such as Gitlet's merge conflicts, BYOW's closed space connectivity) must rely on a complete unit test network;
3. **Interface contracts trump implementation details**: Always communicate with various subsystems through clear and abstract APIs;
4. **Be wary of over-design (YAGNI: You Aren't Gonna Need It)**: Keep the code extremely simple and self-explanatory before there are real performance bottlenecks or business demands.

---

## Appendix: UC Berkeley official textbook in-depth study (Official Textbook In-Depth Chapters)

> **Introduction**: The content of this section is integrated from the UC Berkeley CS61B official textbook library (GitBook Textbook). It provides original English theoretical derivation, formal code examples and supporting chapter exercises for the core data structures and algorithms of this lecture, which complements and confirms the previous video lectures.

## 37. Software Engineering IV

By Mihir Mirchandani

---

## 37.1 The end is near

Another Software Engineering lecture!? Yes!! We're actually now almost done with 61B. Best of luck on finals! Today, we'll actually just be spending time reflecting on 61B.

61B has been taught since \~Spring 1994. Before that, it was CS60C, which goes back to at least 1988. 

In modern times there have been 4 varieties of 61B:

* Hilfinger: 4 extremely long real world projects that are somewhat based on data structures material.

* Hug: 1 (or 2) long real world project that is somewhat based on data structures material. Remaining material ties in tightly to lectures.

* 61BL: Lab based class that focuses heavily on data structures, but with one large real world project (Gitlet).

* Shewchuk / Yelick (extinct): Focus on implementing data structures. No large real world project

#### 61B 1.0

Gitlet was first offered in the Spring 2015 offering of 61B.

* My first solo offering of the class.

* Projects had significant authorship from students. 

  * Project 0 - Bomb Checkers (me, but implemented by Jimmy Lee).

  * Project 1 - ngordnet (me).

  * Project 2 - Gitlet (Joey Moghadam).

  * Project 3 -  Fun with Tries (me, adapted from my old Princeton HWs).

* Joey also used the project as one of his assignments in Summer 2015.

#### 61B 2.0

CS61B Version 2 (Spring 2016, 2017)

* Fall 2014/Spring 2015 observation: Hated that students had to split time between the core data structures content and a huge project that wasn’t related to that content.

* Decided to have the messy real world project due right before data structures:

  * 2016: Build a text editor.

  * 2017: Create software for manipulating text databases. (This is a very cool project! I really hope you can try this for yourselves and then take CS 186!!)

#### Feedback helps...

<figure><img src="https://lh3.googleusercontent.com/EYU0gslQ-pFXdqjr9voSyTbvcHUY7Ztp1DP5FmIlRDXW1T7_f2OyJObaQTxmHPs8CZLOnMm-UX5SpRpp_uzbCQvd161nJZh7jYifdMJM9Qo35KrbaHChB0wYBKbiLlt3qRjRJZCEsmb9O5EFrSJiMZlvDw=s2048" alt=""><figcaption><p>Gitlet Feedback</p></figcaption></figure>

CS61B Current Version (3.6) (Fall 2022 and Spring 2023)

* Replaced Gitlet with Ngordnet.

* Ngordnet is much more data structures focused.

  * 2A: Build a TimeSeries and build an NgramMap.

  * 2B: Build whatever you need to support additional functionality, including implementing a graph somehow.

GSIs voted \~3 to 1 to keep Ngordnet over Gitlet. 

#### Summary

Overall this course was meant to help you with Software Engineering. And all of you have done an amazing job making data structures such as HashMaps and ArrayLists and using Java to solve real-world problems that I hope was interesting! Many people even come out of this class signing up for Linguistics 100 after learning about hyponyms and doing Ngordnet. Wherever you now go equipped with this amazing knowledge of 61B, I wish you the best of luck! Here's to solving more problems with CS! Cheers and good luck on Finals!

Spring/summer 2015 Gitlet was way too hard.

* No testing provided.

* No tips on persistence.


---

## Course navigation and jump

| Previous lecture | Directory | Next lecture | Original video |
| :--- | :---: | :--- | :--- |
| [← Previous Lecture: Sorting VI: Radix Sort vs Comparison Sort The Ultimate Showdown](/en/notes/cs61b/lecture-36) | [📚 Return to CS61B complete book list](/en/notes/topics/CS61B) | [Next lecture: Data compression theory: Huffman coding and prefix-free codes →](/en/notes/cs61b/lecture-38) | [🎬Watch this lecture on Bilibili (P37)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37) |
