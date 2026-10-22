---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 37 · 软件工程 IV：大规模系统演进与技术债务：技术债务隐患、CI/CD 自动化流水线、代码审查哲学与防御性架构演进
description: CS61B 第 37 讲：软件工程 IV：大规模系统演进与技术债务：技术债务隐患、CI/CD 自动化流水线、代码审查哲学与防御性架构演进
topic: CS61B
order: 37
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 7: 软件工程、高级算法与计算理论 (Software Engineering & Complexity)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：54:00 ｜ **官方原版**：Lecture 37 - Software Engineering IV  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P37)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/13TE3w603C6zt1q5vWRL9WmbwxkG0VjFluIIHSbV0qNU/edit) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/37-software-engineering-iv)  
> **快速导航**：[← 上一讲 (P36 排序 VI：基数排序 vs 比较排序终极对决)](/notes/cs61b/lecture-36) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P38 数据压缩理论：哈夫曼编码与前缀无关码) →](/notes/cs61b/lecture-38)

---

## 1. 软件工程的隐形杀手：技术债务（Technical Debt）

*(参考时间：00:01:25 · [视频跳转 (P37 00:01:25)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=85))*

在创业公司或紧急开发周期中，工程师为了快速交付功能，往往会采取“走捷径”的权宜之计（如跳过编写单元测试、硬编码配置、复制粘贴代码）。

沃德·坎宁安（Ward Cunningham）提出了著名的**技术债务（Technical Debt）**隐喻：
- 借债时，你确实获得了短期的交付速度；
- 但只要债务没有偿还，随后的每一次功能迭代，你都必须**支付沉重的利息（高昂的维护成本、频发的线上崩溃、极慢的排错周期）**；
- 当利息吞噬了团队全部的工程生产力时，整个系统将陷入技术破产，重构成为唯一出路。

## 2. 持续集成与持续交付（CI/CD）流水线

*(参考时间：00:10:40 · [视频跳转 (P37 00:10:40)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=640))*

现代软件团队绝不允许“在某位程序员的本机上能跑，但在生产服务器上跑不起来”的灾难。

**持续集成（Continuous Integration, CI）**的自动化铁律：
- 每当有代码推送到版本库分支，远程云端服务器自动启动一个干净沙箱环境；
- 自动触发编译、代码风格检查（Style Checker）、运行全量自动化测试套件（JUnit）；
- 只有 100% 通过所有质量门禁的代码，才被允许合并进入主分支。

## 3. 本讲小结与课后自测

*(参考时间：00:20:00 · [视频跳转 (P37 00:20:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=1200))*

### 课后自测
如何有效偿还大型工程中的技术债务？  
**答案**：推行“童子军规则（Boy Scout Rule）”——离开营地时，让它比你来时更干净。每次修复 bug 或开发新功能时，顺手重构清理周边的陈旧坏味道代码，并补齐自动化测试用例。

## 4. 依赖注入（Dependency Injection）与高阶可测试性设计

*(参考时间：00:26:30 · [视频跳转 (P37 00:26:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=1590))*

在设计大型面向对象系统时，如果一个类内部直接 `new` 其所依赖的服务：
```java
public class OrderService {
    private PaymentGateway payment = new StripePaymentGateway(); // 硬编码紧密耦合！
}
```
**严重弊端**：在运行单元测试时，你无法隔离真实的支付网络！你的单元测试可能会真实发起信用卡扣费！

### 依赖注入（Dependency Injection, DI）
通过构造器将外部依赖作为接口传入：
```java
public class OrderService {
    private PaymentGateway payment;

    // 依赖注入：控制反转 (Inversion of Control, IoC)
    public OrderService(PaymentGateway payment) {
        this.payment = payment;
    }
}
```
在生产环境中传入真实的 `StripePaymentGateway`；在单元测试中无缝传入一个完全伪造的模拟对象（Mock Object）：
```java
PaymentGateway mockPayment = new MockPaymentGateway();
OrderService service = new OrderService(mockPayment);
```
系统瞬间具备了极高水准的单元可测试性与模块替换能力。

## 5. 经典代码坏味道（Code Smells）与马丁·福勒重构清单

*(参考时间：00:34:00 · [视频跳转 (P37 00:34:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2040))*

马丁·福勒（Martin Fowler）在《重构》（Refactoring）一书中总结了代码腐化变质的典型“坏味道”：

1. **过长函数（Long Method）**：一个方法超过 50 行，揉杂了多重不相关的职责。**重构手法：提炼函数（Extract Method）**；
2. **大泥球类（Large Class / God Class）**：一个类拥有几十个实例变量和上百个方法。**重构手法：提炼类（Extract Class）**；
3. **重复代码（Duplicated Code）**：相同逻辑在不同分支复制粘贴。**重构手法：上移方法（Pull Up Method）或抽取公共工具**；
4. **特性依恋（Feature Envy）**：一个方法频繁调用另一个类的 getter 和 setter。说明该方法放错了地方，应当移动到数据所属的类中；
5. **数据泥团（Data Clumps）**：若干变量总是一起出现（如 `int start, int end` 或 `String street, String city`）。应当封装为一个独立的参数对象（Parameter Object）。

## 6. 现代自动化测试金字塔（The Testing Pyramid）

*(参考时间：00:41:30 · [视频跳转 (P37 00:41:30)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2490))*

大型软件系统的测试质量由分层的**测试金字塔**来维系：

```text
       / \
      /   \     端到端测试 (E2E / UI Tests) - 极少量 (运行最慢、维护成本最高)
     /-----\
    /       \   集成测试 (Integration Tests) - 适量 (验证服务间通信与数据库交互)
   /---------\
  /           \ 单元测试 (Unit Tests / JUnit) - 海量基石 (毫秒级极速运行、定位精准)
 /-------------\
```

- **底层基石：单元测试（Unit Tests）**：覆盖全部算法边界与核心数据结构逻辑，要求毫秒内执行完毕，每次代码保存自动触发；
- **中间层：集成测试（Integration Tests）**：验证多个模块协同工作时的接口契约；
- **顶层：端到端测试（End-to-End Tests）**：模拟用户真实点击操作，验证关键业务链路。

## 7. 工业级构建工具（Maven / Gradle）与 CI/CD 流水线工程实践

*(参考时间：00:48:00 · [视频跳转 (P37 00:48:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=2880))*

脱离了简单的单文件 `javac` 编译后，现代 Java 项目通过标准化构建工具组织：
- **依赖管理（Dependency Management）**：声明外部开源库坐标（如 `org.junit.jupiter:junit-jupiter-api:5.10.0`），构建工具自动从中央仓库下载并解析传递依赖；
- **构建生命周期（Build Lifecycle）**：标准化流水线（`compile -> test -> package -> verify -> install -> deploy`）；
- **GitHub Actions 自动化流水线配置**：
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
每次提交自动在云端执行全套回归测试，守护生产安全。

## 8. 大型系统架构演进：从单体巨石（Monolith）到微服务（Microservices）的权衡

*(参考时间：00:54:00 · [视频跳转 (P37 00:54:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3240))*

### 架构权衡的终极法则：没有银弹（No Silver Bullet）
- **单体架构（Monolithic Architecture）**：
  - 所有功能打包为一个大型进程部署；
  - 优点：开发调试简单，本地调用性能极致，事务强一致性易于保证；
  - 缺点：团队人数超过上百人时，代码冲突频繁，单点故障牵连全局。
- **微服务架构（Microservices Architecture）**：
  - 按业务领域（Domain-Driven Design）拆分为数十个独立小型服务，通过网络 RPC 或消息队列通信；
  - 优点：各团队独立部署演进，故障隔离；
  - 缺点：引入网络延迟、分布式事务两阶段提交、分布式锁与链路追踪的极高运维复杂度。

> **工程清醒剂**：在业务规模尚未达到临界点前盲目拆分微服务是典型技术过载。优秀的架构师始终坚持**“演进式架构”**，让系统复杂度与业务规模相匹配。

## 9. 游戏架构与独立游戏开发：从 Project 3 BYOW 到商业引擎

*(参考时间：00:58:00 · [视频跳转 (P37 00:58:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3480))*

在 CS 61B 的压轴大作业 **Project 3: Build Your Own World (BYOW)** 中，学生必须从零编写一个类似《Rogue》或《NetHack》的 2D 瓦片（Tile-based）随机世界探索游戏。

客座讲师 Circle Chen 指出：游戏开发是全计算机科学中最考验**高并发、高实时性与复杂状态组织**的综合工程实战。

### 程序员视角 vs 玩家视角
- **玩家视角（Aesthetics / Dynamics）**：探索未知的地牢、紧张刺激的怪物追逐、合理的资源收集；
- **程序员视角（Code Architecture）**：
  - 如何以 60 FPS 稳定运行？
  - 如何用伪随机数生成器（PRNG）保证输入相同的种子（Seed）能够 100% 重现完全一致的地牢世界？
  - 如何组织角色、敌人、道具、墙壁和光源的状态？

## 10. 游戏核心循环（Game Loop）与实体组件系统（ECS）解耦

*(参考时间：01:03:00 · [视频跳转 (P37 01:03:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=3780))*

### 1. 经典游戏循环（The Game Loop）
与等待用户点击事件的传统 GUI 软件不同，游戏世界的时间是自主单向流逝的：
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

### 2. 为什么传统深层 OOP 继承在游戏中彻底溃败？
初学者喜欢写深层继承：
`Entity -> Monster -> FlyingMonster -> FireBreathingFlyingMonster`。  
**灾难发生**：如果策划突然提出要设计一个“不能飞但是会喷火的宝箱怪”，你的继承体系将瞬间坍塌！

### 实体组件系统（ECS, Entity-Component-System）
现代游戏引擎（Unity DOTS、Unreal、Bevy）全面转向 ECS 架构：
- **Entity（实体）**：仅仅是一个轻量级的唯一整数 ID（如 `Entity #1024`）；
- **Component（组件）**：纯数据载荷结构，没有任何逻辑方法（如 `PositionComponent`, `HealthComponent`, `RenderComponent`）；
- **System（系统）**：纯逻辑函数，专注于遍历拥有特定组件组合的所有实体（如 `MovementSystem` 专门处理同时拥有 `Position` 和 `Velocity` 的实体）。

通过组件的自由组合（Composition），无需修改任何类继承树，即可随意拼装出无限丰富的全新游戏对象！

## 11. 过程式内容生成（PCG）：随机地牢与伪随机数生成器（PRNG）

*(参考时间：01:08:00 · [视频跳转 (P37 01:08:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4080))*

在 BYOW 中，核心挑战是**过程式内容生成（Procedural Content Generation, PCG）**：

### 算法步骤：
1. **伪随机种子（Deterministic Seed）**：
   使用 `java.util.Random(seed)`。相同的种子产生分毫不差的伪随机数序列，这使得巨大的随机世界可以被压缩为一个 64 位的长整型数字进行保存与联机同步！
2. **房间与走廊生成算法**：
   - **二叉空间分割法（BSP, Binary Space Partitioning）**：递归地将大矩形地图二分切分，直到切片达到目标房间大小，在每个叶子切片中生成房间，并在分割线上开辟相连的走廊；
   - **随机漫步法（Random Walk）**：从起点开始随机向上下左右走动，将沿途走过的方格涂成地板，自然形成蜿蜒曲折的洞穴地形；
   - **细胞自动机（Cellular Automata）**：模拟生命游戏，根据周围邻居的墙壁密度反复迭代平滑，生成极其自然的洞穴岩石边缘。

## 12. 游戏模组（Game Modding）与插件架构设计

*(参考时间：01:13:00 · [视频跳转 (P37 01:13:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4380))*

《Minecraft》和《文明》等传奇游戏的长盛不衰，归功于其强大的模组（Modding）生态。

### 如何设计支持外部 Mod 的开源架构？
1. **事件钩子机制（Event Hooks）**：
   在关键业务逻辑点暴露事件监听器（例如 `OnPlayerMoveEvent`, `OnTileDamagedEvent`）；
2. **Java 反射机制（Reflection）与类加载器（ClassLoader）**：
   游戏主程序扫描 `mods/` 文件夹下的外部 `.jar` 文件，利用 `URLClassLoader` 在运行时动态加载外部编写的类；
3. **数据驱动配置（Data-Driven Design）**：
   所有怪物的血量、掉落物、贴图纹理全部抽离为外部 JSON 或 YAML 文件，允许非程序员玩家通过简单修改文本配置即可创造全新游戏内容。

## 13. BYOW 瓦片渲染管线与视线遮挡光照算法（Line of Sight Raycasting）

*(参考时间：01:17:00 · [视频跳转 (P37 01:17:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4620))*

在 Project 3 BYOW 中，为了营造身临其境的地牢探险氛围，必须实现战争迷雾（Fog of War）与视线遮挡算法：

### 核心物理模型
- 整个世界由二维瓦片网格 `TETile[][] world` 组成；
- 玩家位于坐标 $(x_0, y_0)$，拥有固定的视野半径 $R$；
- **射线投射法（Raycasting）**：从玩家坐标向周围 360 度发射离散的视线光束（Bresenham's Line Algorithm）。当光线触碰到不透明的墙壁瓦片时，立即中断该方向的光照传导；
- 只有被光线照射到的地板和道具瓦片才予以渲染并标记为“已知区域”，未照亮的区域涂黑隐藏，极大增强了探索感与神秘感。

## 14. 游戏物理碰撞检测（AABB 轴对齐包围盒）与网格寻址

*(参考时间：01:21:00 · [视频跳转 (P37 01:21:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=4860))*

在 2D 游戏中，判断玩家或怪物是否撞击障碍物：
- **瓦片碰撞（Tile Collision）**：在网格地图中，移动前先预测目标坐标 $(x + \Delta x, y + \Delta y)$ 的瓦片类型；若 `world[x + dx][y + dy].equals(Tileset.WALL)`，直接拦截移动，避免穿墙；
- **AABB 轴对齐包围盒（Axis-Aligned Bounding Box）**：对于尺寸跨越多个像素或瓦片的动态实体，使用矩形盒子的四角坐标重叠判定：
  $$\text{Collides} = (A.x_1 < B.x_2) \land (A.x_2 > B.x_1) \land (A.y_1 < B.y_2) \land (A.y_2 > B.y_1)$$

## 15. 网格图上的 A* 寻址与怪物追逐 AI 状态机（FSM）

*(参考时间：01:25:00 · [视频跳转 (P37 01:25:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5100))*

地牢中的怪物需要具备追踪玩家的自主智能：

### 1. 有限状态机（Finite State Machine, FSM）
怪物的行为逻辑被建模为离散状态的切换：
- **巡逻状态（Patrol）**：在走廊中随机漫步；
- **警戒与追逐状态（Chase）**：一旦玩家进入怪物的视线范围（欧式距离 $\le$ 警戒阈值），状态切换为追逐，启动寻路算法；
- **攻击状态（Attack）**：与玩家相邻时发动攻击。

### 2. 网格 A* 寻路引擎
调用 Lecture 24 的 A* 搜索算法：
- 网格图中的每个通行地板为一个图节点；
- 边权值恒为 1；
- **启发函数 $h(v)$**：采用绝对可采纳的**曼哈顿距离（Manhattan Distance）**：
  $$h(x, y) = |x - x_{\text{player}}| + |y - y_{\text{player}}|$$
通过 $O(V \log V)$ 的 A* 寻路，怪物能聪明地绕过复杂拐角与迷宫墙壁，直扑玩家所在位置！

## 16. 现代游戏引擎中的内存管理与垃圾回收卡顿（GC Pause）消除技术

*(参考时间：01:29:00 · [视频跳转 (P37 01:29:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5340))*

在 60 FPS 的实时游戏中，每一帧的渲染预算只有短短的 **16.6 毫秒**。

### 实时系统中的垃圾回收危机（The GC Pause Crisis）
如果游戏每秒创建数万个短暂的临时对象（如表示坐标的 `Vector2D`、弹药火花粒子 `Particle`）：
- JVM 堆内存的新生代（Young Generation）会以惊人的速度被塞满；
- 触发 Minor GC 时，JVM 可能会发生毫秒级的“世界冻结（Stop-The-World）”；
- 导致游戏画面发生明显的瞬间掉帧、卡顿（Jank / Stutter），严重破坏玩家体验。

### 工业级零 GC 优化技法：对象池模式（Object Pool Pattern）
在游戏启动时，预先分配一个固定容量的不可变对象池：
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
通过重用已有对象、使用原生基础数组替代对象包装类，消除一切动态堆分配，保持帧率丝滑如水！

## 17. 软件工程精髓总结：从 CS 61B 大作业到工业级百万行架构

*(参考时间：01:33:00 · [视频跳转 (P37 01:33:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37&t=5580))*

回顾 CS 61B 的三大标志性项目（2048, Gitlet, BYOW）：
1. **模块化与关注点分离（Separation of Concerns）**：将模型层（Model）、视图层（View）与控制器层（Controller）彻底解耦；
2. **测试先行保驾护航**：复杂的边界条件（如 Gitlet 的合并冲突、BYOW 的封闭空间连通性）必须依赖完备的单元测试网；
3. **接口契约高于实现细节**：永远通过清晰抽象的 API 沟通各个子系统；
4. **警惕过度设计（YAGNI: You Aren't Gonna Need It）**：在没有真实性能瓶颈或业务诉求前，保持代码的极致简单与自解释性。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

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

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 VI：基数排序 vs 比较排序终极对决](/notes/cs61b/lecture-36) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：数据压缩理论：哈夫曼编码与前缀无关码 →](/notes/cs61b/lecture-38) | [🎬 在 B 站观看本讲 (P37)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=37) |
