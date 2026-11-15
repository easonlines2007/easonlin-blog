---
kind: notes
source: cs231n/lec17
title: "CS231n Computer Vision: Robot Learning (Lecture 17)"
description: The four paradigms of robot learning - trial and error, learning
  world model, copying demonstration, and basic model - are essentially about
  changing the chips between "how much real interaction is required" and "how
  far it can be generalized"; and evaluation is the real bottleneck in this
  industry.
sourceHash: c1fa2970878e84a2cb552ad50fcba86e15b164824be81e01c8f50a68cebd6169
publish: true
translationMethod: machine-assisted
---

> **Course information**
>
> - **Course name**: Stanford CS231n: Deep Learning for Computer Vision(Spring 2025)
> - **Topic of this lecture**: Lecture 17. Robot Learning
> - **Lecturer**: Yunzhu Li
> - **Teaching date**: 2025-05-29
> - **Course homepage**: [cs231n.stanford.edu/2025](https://cs231n.stanford.edu/2025/schedule.html)
> - **Official courseware**: [lecture_17.pdf](https://cs231n.stanford.edu/slides/2025/lecture_17.pdf) (103 pages, page-by-page illustrations in the book)
> - **Subtitle source**: [cs231n_sp25_kor_sub · eng](https://github.com/lpaiu-cs/cs231n_sp25_kor_sub/tree/main/eng) (Publicly transcribed in English, Chinese rewritten by this book)
> - **Copyright statement**: The copyright of the slides and course materials belongs to Stanford University and the instructors; this book is an unofficial study note and is only used for study and research.

![Lecture 17 Title Page: Robot Learning, Yunzhu Li, May 29, 2025](</attachments/cs231n-014b1542a127e99492e0c9fe.png>)

This lecture is the last of the guest teacher series. The speaker is Yunzhu Li, an assistant professor at Columbia University—he will still be a postdoc at Stanford in 2023 (the collaborators are Fei-Fei Li and Jiajun Wu), and it was at that time that he took this course. This background determines the teaching method of this lecture: it does not elaborate on the details of the algorithm, but breaks down "robot learning" into a main line that is repeatedly questioned——**What are you going to pay to produce an action?**. The price of real interaction is reinforcement learning; the price of training a world model is model-based planning; the price of human demonstration is imitation learning; the price of large-scale pre-training is the basic robot model.

All the previous content of this course answers "what to see", and this lecture will answer "what to do". The difference between the two is not in the size of the model, but in the direction of causation: the prediction of image classification will not change the picture being predicted, but the robot's actions will change the world it sees next. Each section of the lecture shows the specific form of this difference under different budgets.

## 1. From "predicting" to "changing the world": the extra arrow

*(Reference time: 00:01:36 – 00:11:38｜Lecture 17)*

The success of the first sixteen lectures can be compressed into one sentence: given input, predict output. The instructor first spreads the line across two pages and then breaks it down on the third page.

![Supervised learning review: the data is (x,y) and the goal is to learn a mapping from input to label](</attachments/cs231n-bd257024f2cbf0647848b408.png>)

Classification, regression, target detection, semantic segmentation, and image description all fall into this sentence: the loss measures the distance between the prediction and the label, and the gradient changes the parameters along this distance. This framework has a premise that is not written out——**The data is given by others, the labels are marked by others, and the model cannot touch the data. How is it generated?**.

![Self-supervised learning review: only x without labels, the goal is to find the hidden structure within the data](</attachments/cs231n-8ccb5b6c093a7ee3b916fc5c.png>)

Self-supervision removes the label: clustering, dimensionality reduction, feature learning, density estimation, and autoencoders all rely on auxiliary losses constructed from the data itself to learn representation. Its efficiency in utilizing massive amounts of unlabeled data has been the main source of vision progress in the past few years. But both slides share the same world view: **The model is a bystander**. The distribution it reads is fixed, and the predictions it writes do not in turn change that distribution.

![Problem setting for robot learning: the agent performs actions in the environment, and the environment returns status and rewards.](</attachments/cs231n-c44626769cecd3d879df5516.png>)

Robot learning adds an extra arrow to this picture: action  $a_t$. The lecturer phrased this point very directly - "No matter what action you decide to take in the real world, the world will change because of this action." So the goal is no longer to fit a certain label, but to maximize an objective function under physical constraints; the data is no longer given, but sampled by your own strategy.

```mermaid
flowchart LR
  H["goals given by humans g"] --> A["agent / Strategy π"]
  A -- "action a_t" --> W["physical world"]
  W -- "Status s_t" --> A
  W -- "reward r_t" --> A
  A -. "Training signals come from trial and error" .-> P1["reinforcement learning"]
  A -. "The training signal comes from the forward model" .-> P2["Model learning + planning"]
  A -. "Training signals come from human demonstrations" .-> P3["imitation learning"]
  A -. "The training signal comes from large-scale pre-training" .-> P4["Robot basic model"]
```

This picture is the skeleton of the whole lecture: the loop in the middle remains the same, what changes is **Where does the signal come from?**. The four paradigms replace the "learning signal" line on the same picture, rather than four unrelated fields.

![Four-frame video puzzle: robotic arm pours coffee, stacks cartons, humanoid robot works in laboratory and home environment](</attachments/cs231n-15ce41d9d30211b3801b716f.png>)

The evidence on the first page that "this field is growing" is not a paper, but a video frame: the lower left corner of each of the four grids is marked  `autonomous` (autonomous execution) and double speed, two of which are two-arm robotic arms stacking cartons and grinding coffee on a wooden table, one is a humanoid robot walking around in the laboratory, and the other is two humanoid robots in a home scene. The double-speed mark itself is a signal: these films are played at accelerated speed, and the real speed is much slower - this will be brought up as a question by the lecturer himself in Chapter 6.

![Funding News Collage: Physical Intelligence \$400M, Figure \$675M, Skild AI \$300M, 1X \$100M, The Bot Company \$150M](</attachments/cs231n-b61b0e2bfff95e3ffee3378e.png>)

The second page directly puts the financing titles together: Physical Intelligence takes \$400 million (November 2024, Bezos and OpenAI participated), Figure takes \$675 million (February 2024, Microsoft, NVIDIA, OpenAI participated), Skild AI \$300 million (July 2024), The Bot Company \$150 million, 1X \$100 million B Wheel (January 2024). What the lecturer wants to illustrate with these numbers is not the "bubble", but the cost structure of this type of company: general-purpose robots need to build their own data collection links and iterate their own hardware, and robot data cannot be crawled from the Internet like text - money is spent on "creating data", which is the biggest difference between this industry and pure software AI.

![The respective robotics research departments of major manufacturers: Toyota Research Institute, Meta AI Research, Google Robotics, NVIDIA Research](</attachments/cs231n-fd62bdf8ba30d913600e506e.png>)

The third page changes to major manufacturers: Toyota Research Institute, Meta AI Research, Google Robotics, NVIDIA Research. The purpose of the two pages side by side is not to compare who has more money, but to show that the structure of participants has changed - this direction is no longer a subject of several laboratories, but an industrial track where both start-up companies and the research departments of large companies are betting.

![Outline of this lecture: Problem formalization, robot perception, reinforcement learning, model learning and model-based planning, imitation learning, basic robot model, legacy challenges](</attachments/cs231n-392191eb26700dc434a12ea3.png>)

The order of the seven items in the outline is very particular: first formalization (write "doing an action" as an object that can be optimized), then perception (where the input of the action comes from), then three learning methods that are increasingly less real-interaction-friendly, and finally fall into the part of "this road is not finished yet". Every time you enter a new topic, this outline will appear again, and the progress will be marked with a red box (the red box on page 21 covers the first two items) - this outline appears 8 times in total and is the progress bar of the entire lecture.

### 1.1 A template: goal, status, action, reward

![Formalization of the problem: the agent receives the target g, the state s\_t, outputs the action a\_t, and the environment returns r\_{t+1} and s\_{t+1}](</attachments/cs231n-db8d8025e1ff3d2a8e3c91b4.png>)

The lecturer formalized robot learning into four things: \*\*goal\*\* can be a verbal instruction given by a human, or it can be a scalar function that measures the quality; \*\*state\*\* is the agent's estimate of the current situation of the environment; \*\*action\*\* is the instruction it gives to the actuator; \*\*reward\*\* is the environment's rating of the quality of this step. The four together define a sequential decision-making problem. The difference from computer vision is that vision seeks a representation of the environment, while the robot seeks a set of action sequences based on this representation and subject to physical constraints.

The lecturer gave the only "definition" comparison here: computer vision is mainly about learning the representation of high-dimensional input, while robot learning is about solving a constrained optimization problem. The constraint is the physical world, the objective function is defined by goal, and the solution is a series of actions. This sentence explains why there is almost no talk about network structure later in this lecture, only about **How does the signal come from and how much does it cost?**.

### 1.2 Seven examples: same template, different reward shapes

![Cart-Pole: The state is angle, angular velocity, position, and horizontal speed. The action is horizontal thrust. Each step when the pole is upright is worth 1 point.](</attachments/cs231n-f18e17905c14a6a457c3b041.png>)

The most classic entry-level example is cart-pole: four dimensions of state (angle of the pole, angular velocity, position of the cart, horizontal speed), one dimension of action (horizontal force exerted on the cart), and a reward of 1 for each time step when the pole remains upright. Its value lies in "the state is completely observable, the rewards are dense, and the dynamics are known" - all three conditions are met, so it is just a toy used to calibrate intuition, not a representative problem of robot learning.

![Quadruped locomotion: The state is the angle, position, and speed of all joints, and the action is the joint torque, which is rewarded for standing upright and moving forward.](</attachments/cs231n-5e883a0c3c3319825d581e27.png>)

Switch to a quadruped robot, and the same template immediately becomes heavier: the state is the angle, position, and speed of all joints, the action is the torque applied to each joint, and the reward is 1 for each step when "staying upright and moving forward." The source of the figure is noted in the lower right corner of the slide (Schulman et al.,  *High-Dimensional Continuous Control Using Generalized Advantage Estimation*, ICLR 2016) - This is a key step in pushing the policy gradient method to high-dimensional continuous control, and is also the predecessor of a series of subsequent PPO work.

![Atari: The state is the original pixel of the screen, the action is up, down, left, and right, and the reward is the score increase or decrease for each step.](</attachments/cs231n-0e7d368c41024c8d6a8808ee.png>)

Atari swapped out the nature of states: states were raw pixels on the screen, actions were discrete up, down, left, and right, and rewards were instantaneous increases and decreases in scores. Its significance is to plug "perception" and "decision-making" into the same network - as you will see in Chapter 3 later, this setting directly gave rise to the practice of using CNN to fit the Q function.

![Go: The goal is to win the game](</attachments/cs231n-9db68195512434ddf3b8d32d.png>)

This page only contains goals, without status, actions, or rewards - the lecturer intentionally left it blank. He first released the "wanting to win" thing, and then completed it on the next page into a form that can be read by a machine.

![Formalization of Go: the state is the position of all the pieces on the board, the action is the next move, and the reward is only given in the final game, 1 or 0](</attachments/cs231n-139ef7fd6a77543d73888bf2.png>)

Go is the opposite extreme: the state is the position of all the pieces on the board (discrete, huge), the action is the position of the pieces, and the reward **Only given in the last hand**, win 1 and lose 0. The reward changed from "one for each step" to "only one for the whole game", and the "credit allocation" puzzle in Chapter 3 grew out of this.

![Text generation: The goal is to predict the next word, the prompt is CS231n midterm was \_\_\_](</attachments/cs231n-a1f983c15e3ebb7d8cc20b4c.png>)

The prompt itself is a joke—"The CS231n midterm exam is \_\_\_"—but it lays out what the word "state" means in the language: state is the words that have been written down.

![Formalization of text generation: state is an existing word in the sentence, action is the next word, and 1 point is awarded for correct guessing](</attachments/cs231n-422a6645cef8e1c56f3543c3.png>)

The lecturer also stuffed the large language model into this template: the state is the existing word in the sentence, the action is the next word, and the guess is 1, and the guess is 0. This mapping may look like it was forced together, but it actually points out one important thing——**Autoregressive language models are a special case of "rewards are immediately available at every step"**, so it can be trained in a purely supervised manner; once the reward moves to the end of the trajectory, supervised learning becomes ineffective.

![Chatbot: The goal is to "be a good companion"](</attachments/cs231n-a2eb1c5a9e5857b3a47630d8.png>)

"Being a good companion" is a goal that even humans can't explain, which is the reason for choosing it: the harder it is to write a goal into a formula, the more it can only be scored by people.

![Formalization of the chatbot: the state is the current conversation, the action is the next reply, and the reward is given by human scoring +1 / 0 / -1](</attachments/cs231n-6713e2368c11cd965292907a.png>)

The chatbot gives rewards to humans: the status is the current conversation, the action is the next reply, +1 for satisfaction, -1 for dissatisfaction, and 0 for neutrality. This is the purest form of "rewards are not differentiable and can only be sampled", and it also explains why this type of system requires people to continuously mark preferences in the loop.

![Clothes folding robot: The goal is to fold the clothes](</attachments/cs231n-f6159e90683accf626edb6a1.png>)

From this page on, the goal shifts from abstraction to physical action: folding a piece of cloth into a decipherable shape. The difficulty is not in the action of "folding", but in the state of an object like "cloth" which can hardly be described by low-dimensional vectors.

![Formalization of folding clothes: the state is multi-view RGB/RGB-D observation, the action is the movement of the end effector and the opening and closing of the gripper, and the reward is judged by humans whether it is folded or not.](</attachments/cs231n-166cd9516ecb0a03697ec079.png>)

Folding clothes is the closest example to a "real robot" in this group: the state is a multi-view RGB or RGB-D observation (not a low-dimensional vector, but an image), the action is the movement of the end effector plus the opening and closing of the gripper, and the reward is 1 or 0 when a human judges whether the clothes are folded. The instructor specifically emphasized that "whether to close or open the gripper" is also part of the action - the gripper is not a tool, but a dimension of the action space.

> Editor's note: The State line on page 20 of the slide follows the "Current conversation" on the previous page, which is a copy of the remnants of the production. According to the lecturer's oral instructions, the state here should be multi-view RGB/RGB-D observation, as well as the robot's own position and gripper state.

### 1.3 Reward design: the part that cannot be explained in one sentence

The formalization only stopped when it said "with rewards". The lecturer then added a piece of content that is rarely covered in courses: how to determine rewards is an open question in itself. The same is true for autonomous driving, "reaching as quickly as possible" and "passengers can sit comfortably" are rewards in two opposite directions; the same is for folding clothes, some people require the smallest area after folding, while others require the surface to be as flat as possible. The slide only contains a general criterion of "whether a person considers this piece of clothing folded well." However, in a real product, the details of the reward determine the entire behavior of the strategy.

This paragraph foreshadows a judgment that will appear repeatedly later: the most expensive thing in robot learning is often not the network, but the **Translate a vague human intention into a scalar that does not bias the strategy**. The "non-stationarity" in Chapter 3 and the "difficulty in evaluation" in Chapter 6 are essentially the sequelae of this incident.

## 2. Robot perception: what is rewritten by embodiment, initiative, and contextualization

*(Reference time: 00:12:38 – 00:18:22｜Lecture 17)*

![The outline appears for the second time, and the current entry switches to "Robot Perception"](</attachments/cs231n-64dbe72daa09e65d86076fa1.png>)

### 2.1 Perception is the edge from state to agent

![On the problem formalization diagram, the red arrow points to State s\_t: robot perception is this input edge](</attachments/cs231n-60363ff4a3b5355558476bc0.png>)

The same agent picture is brought up, this time the red arrow points to the left  `State s_t`. The lecturer's definition is very simple: the physical world provides high-dimensional observations (RGB, RGB-D, or maybe touch), and what the robot needs to do in perception is to extract from it **Structured knowledge useful for downstream decisions**——Not to describe the scene more completely, but to bring out the part related to the action.

![Difficulties in robot perception: incomplete object knowledge, imperfect actions, dynamic environments and other agents](</attachments/cs231n-152b6d83d11b1fa3c22a1cee.png>)

The slideshow lists three troubling realities. **incomplete knowledge**: Occlusion, sensor noise, only seeing one side of the object. **Imperfect movements**: Grasping may not be successful. Slipping something with your hand will in turn change the environment. The perception system must be able to handle the state after "I messed up the situation."**The environment will change**: Not only rigid bodies, but also deformable objects such as cloth, ropes, and particles, as well as dogs, children, and other people moving around in the same space.

Together, these three points explain an engineering fact: robots don’t just have a camera. As long as some kind of sensor can provide useful information, install it - the tactile sensation can tell you whether you have a good grip, the camera can tell you the overall situation, and the sound can make up for the moment when the vision is blocked. The real design difficulty is not to "install a few", but to make them in the same representation **complementary**: Touch gives the local contact state, vision gives the global pose, and the time scales of the two are different.

### 2.2 Sensors: Multi-modality is not about stacking materials, but about division of labor

![Commonly used sensors for robots: microphone, camera, tactile, and proximity sensing, depth camera, lidar, ultrasound, event camera, tactile array](</attachments/cs231n-5bf61e1107239d6c1a9bd564.png>)

The left side of the slide depicts the five senses (eyes, ears, nose, tongue, hands) surrounding the brain, and the right side is a row of real devices: inductive proximity sensor, depth camera, lidar, ultrasonic module, event camera, industrial code reader, and gripper attached to the tactile array. What this picture wants to say is the specific meaning of "multimodality" in robots - it is not about piecing together several types of data and feeding them to a large network, but rather each sensor is responsible for a segment of data. **It can only be measured physically** information.

![The humanoid platform of the Advanced Robotics Laboratory of the University of Hong Kong: The fisheye camera, multi-sensor head, perception computer, three-finger gripper, six-axis force/torque sensor, IMU, strain gauge pressure sensor and 3.7 kWh battery are marked one by one.](</attachments/cs231n-ee79400172878bcda2ace561.png>)

The second page gives a specific platform to achieve the ultimate in "multimodality" (the picture source is marked as HKU Advanced Robotics Laboratory). The annotation can read all the accounts of a real machine: two fisheye cameras on the head; a 3D laser scanner and a binocular camera in the multi-sensor head; a perception computer composed of three Intel Core i7s; Robotiq three-finger adaptive gripper; six-axis force/torque sensor; IMU; strain gauge pressure sensor; 30 degrees of freedom driven by 24 hydraulic actuators and 6 motors; 3.7 kWh lithium battery; running Linux + ROS.

What this picture really wants to say is: perception is not a model, but the bandwidth and power supply of a machine. With so many channels of data entering the same computer at the same time, the key to engineering lies in calibration and synchronization - all sensors must fall on the same coordinate system and the same timeline, otherwise "complementarity" will turn into "mutual interference."

### 2.3 Three differences between robot vision and computer vision

![Left: Detectron’s instance segmentation results; Right: Facing a stack of objects, the robot must first move to determine how many objects it is.](</attachments/cs231n-437c43f84207dc8b65df041f.png>)

This page is the sharpest comparison in the entire lecture. On the left is the familiar instance segmentation from the course: given a 2D image, label each pixel as an instance and draw an outline. On the right is what the same type of task looks like in a robot: there is a pile of things on the table that look like "one object", or it may be several parts that are set together——**You can't tell the difference just by looking.**. The robot must decide on its own "what action should I take to see clearly": push it, dial it, change its perspective, and use actions to exchange information.

![Three properties of robot vision: embodied, active, and situated](</attachments/cs231n-90a3eb6c1c59a34b22768fc0.png>)

The slide divides the differences into three adjectives, each with a definition, which is worth taking note of:

- **embodied**: The robot has a physical body and directly experiences the world; its movements are part of the dynamics of the world and are immediately fed back to its own feelings.
- **active**: The robot is an active perceiver; it knows why it wants to perceive, and it chooses what to see, how to see and where to see. The example given by the lecturer is very common - if you want to know what is behind the desk, just stick your head over it.
- **situated**: When robots are in the world, they are not dealing with abstract descriptions, but "here and now"; the world directly shapes the behavior of the system.

In contrast, the vast majority of computer vision data sets are **Passive collection** Of: Someone took the photos and marked them in advance, and the model was only responsible for reading. This difference is not a philosophical rhetoric, it determines who controls the distribution of training data - in the passive data set, the things the model has seen are the same ones it will encounter; the things the robot encounters are picked out by its own strategy.

### 2.4 Perception-Action Loop: Why "Seeing the Whole" Is Wrong

![Three robotic systems: UAV, PR2 robotic arm, dual-arm robot (Sa et al. IROS 2014; Levine et al. JMLR 2016; Bohg et al. ICRA 2018)](</attachments/cs231n-da86f42b59d915ba7c81844b.png>)

The slide shows three systems: a drone flying in the woods, a PR2 doing autonomous grabbing in front of a green screen, and a two-arm robot working next to a human. The source is marked under each picture. What these three examples have in common is that perception is never an independent module, it is embedded in a cycle of "seeing-moving-seeing again".

![Annotations of perception and action are superimposed on the same set of photos: two rings of Perceive and Act are drawn in each frame.](</attachments/cs231n-351c4e63314ea3c8af2b110f.png>)

The next three frames are frame-by-frame annotations of the same picture (this is the typical "construction page" of this lecture). The first frame only has photos and documents; the second frame circles and labels two locations on each photo.  `Perceive`  with  `Act`——In the grid of the drone, the sensor is around the camera on the belly, and the movement is in the rotor; in the grid of the PR2, the sensor is in the head camera, and the movement is in the gripper; in the grid of the arms, the sensor is in the head, and the movement is in the wrist. The two rings are connected by an arrow, pointing to the conclusion of the next frame.

![The third frame adds the title assertion: A key challenge in robot learning is to close the perception-action loop](</attachments/cs231n-69a6eb2b268bbdb8b1a9735f.png>)

In the third frame, a sentence was added to the original image: **A key challenge for robot learning is to close the perception-action loop.**. The lecturer gave a very practical criterion here: the robot does not need to know the complete state of the environment. When buttoning a shirt, one only needs to know the local area around that button; so the accuracy, range, and frequency of perception should be consistent with the task and downstream decisions. **joint design**, instead of making a general perceptron first and then connecting it to the strategy. This sentence will be repeated in different forms in each subsequent chapter: what should the model represent, where should the strategy be looked at, and where should the data be collected? The answers are all determined by the task.

## 3. Reinforcement learning: How far can you go through trial and error, and where do you hit the wall?

*(Reference time: 00:18:31 – 00:37:02｜Lecture 17)*

![The outline appears for the third time, and the current item switches to "Reinforcement Learning"](</attachments/cs231n-e4bdecab046d274a30b6909a.png>)

### 3.1 First write "trial and error" into an algorithm

![Reinforcement learning: The agent interacts with the environment and learns to maximize rewards through trial and error.](</attachments/cs231n-c8be31140a3b1aba940f3271.png>)

The most straightforward solution is to let the robot interact with the world as much as possible: collect empirical data, observe "this action leads to high reward, that action leads to low reward", and then move the behavior in the direction of high reward. Reinforcement learning formalizes this fact—an agent constantly interacts with the environment and uses trial and error to maximize rewards (or minimize costs).

![Reinforcement learning loop: the environment gives a state s\_t, the agent generates an action a\_t, and the environment returns a reward and s\_{t+1}](</attachments/cs231n-bb9dca3ab5350f27a2054ec0.png>)

This diagram unfolds on the timeline: the environment gives  $s_t$, the intelligent agent generates  $a_t$, environment return  $r_{t+1}$  with  $s_{t+1}$, then repeat. Note that it is almost structurally identical to the supervised learning loop - both are a loop of "input in, output out, and feedback received". The difference lies entirely in the nature of the feedback.

![The loop of supervised learning: the data set gives x\_t, the model gives prediction y\_t, and the loss L\_t is obtained by comparing it with the label](</attachments/cs231n-77cb4dc1fddf54c49473d839.png>)

Putting the two side by side, the lecturer asked a question: **Why is reinforcement learning different from ordinary supervised learning?**  The question hangs there on the slide, and is answered one by one on the next four pages.

### 3.2 Four differences, one more fatal than the other

| difference | Specific performance | direct consequences for algorithms |
| :--- | :--- | :--- |
| stochasticity | For the same action, the environment may give different next states and different rewards. | You cannot assume that "one failure = this action is wrong", you can only estimate expectations |
| credit assignment | reward  $r_t$  Not necessarily directly dependent on actions  $a_t$, and may even appear only in the final game | It is necessary to spread the scalar value at the end back to dozens or hundreds of actions. |
| nondifferentiable | It cannot be reflected back to the world, it cannot be calculated  $\partial r_t / \partial a_t$ | Zero-order gradient estimation can only be achieved by relying on large-scale sampling. |
| nonstationary | What the agent experiences depends on how it moves. | The distribution of training data drifts with the policy, and the i.i.d. assumptions of supervised learning are invalid. |

![Randomness: The distribution of support force is different when pushing a box, and the same action will cause the box to rotate to different angles](</attachments/cs231n-98da2e9cf33eefdbd8fe34eb.png>)

The lecturer used pushing boxes to explain randomness: for the same push, if the distribution of the ground support force is slightly different, the angle at which the box turns may be different. So "whether this action is good or not" itself is a random variable, and the strategy should optimize expectations rather than a certain result. This is also the reason why robot strategies inherently need to be "robust" - it's not about engineering mystique, it's about the noise in the problem definition.

![Credit allocation: reward r\_t does not necessarily depend directly on action a\_t](</attachments/cs231n-0594d769368e8a3f2287b740.png>)

The classic scenario of credit allocation is Go: you don’t know whether you won or lost until the last move; and this 0/1 result may have been buried in the first move. It is one of the core difficulties in reinforcement learning theory to fairly distribute a scalar value of the end game back to hundreds of decisions in the middle game or even the beginning.

![Non-differentiable: it cannot be propagated back to the world, so it cannot be directly calculated as dr\_t/da\_t](</attachments/cs231n-1a8d5506e18954a26ac72c35.png>)

The third difference is the most critical in engineering: in supervised learning, the entire chain is differentiable, and the gradients are returned all the way to the parameters; while the environment (the real world or a game simulator) is usually not differentiable. $\partial r_t/\partial a_t$  Doesn't exist at all. The lecturer mentioned the industry's approach - relying on large-scale sampling to make zero-order estimates of the gradient, and using "perturb it to see how the reward changes" to approximate the direction. The price is sample size, and sample size on real robots is time and wear.

![Non-stationarity: What an agent experiences depends on how it acts](</attachments/cs231n-2b2f67fb3dbe6e92796ddc5c.png>)

The fourth is the most hidden: in supervised learning, what you predict will not affect the next sample in the data set; in sequential decision-making, your actions determine what state you will see next. Once the strategy changes, the data distribution changes. The "training set" and "test set" are no longer two batches of independent samples, but the same timeline that is constantly being rewritten by itself.

### 3.3 Atari: Stuffing the Q function into a convolutional network

![Case setting: Atari game, the state is the screen pixel, the action is up, down, left, and right, and the reward is the score increase or decrease (Mnih et al., 2013)](</attachments/cs231n-72f71daf7f9944b65d906e17.png>)

The setting of the Atari case appeared in Chapter 1, and is repeated here as the first "end-to-end" sample: the state is the raw pixel, the action is the four discrete button presses, and the reward is the score change for each step. The source of the slide annotation is the Deep RL work of Mnih et al. in 2013 - the predecessor of DQN.

![Q network structure: 4×84×84 continuous 4-frame input, two layers of convolution followed by FC-256, outputting the Q value of each action](</attachments/cs231n-88f312669f86d2f335da415b.png>)

This page is worth remembering every number, because it is the most classic engineering configuration of "deep reinforcement learning": the network input is  $4\times 84\times 84$——The last 4 frames of grayscale images are stacked (first do RGB→grayscale, downsampling, and cropping). The purpose of stacking 4 frames is to allow the network to see the speed and direction from the differences between frames; the first layer  `Conv(4→16, 8×8, stride 4)`, second floor  `Conv(16→32, 4×4, stride 2)`, then  `FC-256`, finally  `FC-A`  Output the Q value for each action. When there are four actions, the last layer is given  $Q(s_t,a_1),Q(s_t,a_2),Q(s_t,a_3),Q(s_t,a_4)$  Four numbers.

The definition of Q function is "in state  $s$  Execute action next  $a$  Afterwards, the discount builds up to the expectation of future rewards". Its usage is extremely simple: feed the current state, get four numbers, and execute the action with the largest value. The entire set of decisions is therefore compressed into a single forward propagation - this is the biggest engineering attraction of Q-learning: **Training can be expensive, inference must be cheap**.

![Video Demo Page: YouTube link for the Breakout training process](</attachments/cs231n-4156856b9c29217f53b78b17.png>)

There is only a YouTube link on the slide, and the video of the Breakout training process is shown in the class. The lecturer explained it in three stages: after 10 minutes of training, the agent was able to touch the ball, but often missed the ball; after 2 hours of training, the ball became stable and could continue to score points by rebounding; after training for longer, the agent discovered a strategy rarely used by human players - hit the ball above the left wall, let the ball bounce back behind the bricks, and eliminate a large area at a time. This is where reinforcement learning is most convincing: **It can find solutions that humans never thought of**. The lecturer added a piece of trivia by the way: AlphaGo Zero is equivalent to "learning" three thousand years of human Go knowledge in 40 days - at the cost of an order of magnitude of staggering computing power.

### 3.4 AlphaGo pedigree: what was replaced in four steps

![AlphaGo family first page: AlphaGo (2016) uses imitation learning + tree search + RL to defeat Lee Sedol; AlphaGo Zero (2017) removes imitation learning and defeats Ke Jie](</attachments/cs231n-087a4ea074307892912f00c3.png>)

This page ranks four generations of systems together. AlphaGo (January 2016) used imitation learning for initialization, tree search for decision-making, and reinforcement learning for self-improvement, defeating 18-time world champion Lee Sedol. What AlphaGo Zero (October 2017) did was subtraction: it no longer used human chess records for imitation learning, but started playing chess by itself from scratch, defeating Ke Jie, who was ranked number one at the time.

The lecturer inserted a comment here called "the bitter lesson" (Richard Sutton), which is what he really wanted to convey when talking about AlphaGo Zero: **Sometimes the simplest recipe wins**, because it is more compatible with scaling. The imitation learning module is removed not because human knowledge is useless, but because after removing it, the entire pipeline can play unlimited games against itself and increase computing power infinitely; the fewer modules, the easier it is to scale up. This experience will come back in another form in Chapter 6 - pre-training and post-training of the basic robot model, which is essentially "as little manual design as possible + as much data and computing power as possible".

![Second frame: Alpha Zero (2018) extends the same algorithm to chess and shogi](</attachments/cs231n-c7eb676f665e420c0262e802.png>)

The second frame was supplemented by Alpha Zero (December 2018): the same self-playing algorithm is no longer limited to Go, but extended to chess and shogi. The new information added in this frame is "decoupling the algorithm from the game" - there is no need to write heuristics for each type of chess, the rules are the interface.

![Third frame: MuZero (2019) no longer relies on known rules, but learns a latent space model and plans within it](</attachments/cs231n-eeaadbdfe43e622770d7d5bd.png>)

The third frame is the most critical shift in the genealogy: MuZero (November 2019) no longer assumes that the rules of the game are known, but learns a dynamic model of latent space and makes plans in this model. Note the correspondence between this step and the four paradigms at the beginning of this chapter - it moves from "pure trial and error" to "learning model + planning", which is the theme of Chapter 4.

![The fourth frame: citation list on the same page, four papers corresponding to the fourth generation system](</attachments/cs231n-779cb4a036b75e266d74e837.png>)

The fourth frame has no new content, but only completes the complete citations of the four papers (Nature 2016, Nature 2017, Science 2018, arXiv 2019). The purpose of the courseware is to make this pedigree traceable: behind every "removal of a module" there is an independent paper, rather than a gradual adjustment of parameters along the same route.

![Fifth frame: Lee Sedol announced his retirement in November 2019, with two quotes](</attachments/cs231n-636b0ac46fdbe3b40010330e.png>)

The fifth frame added a photo of Lee Sedol and two quotes (quoted from Yonhap News Agency's report on November 27, 2019): "With the emergence of AI in Go, I realized that even if I try my best to become the first, I am not the top"; "Even if I become the first, there is an existence that cannot be defeated." The lecturer did not comment on this passage, but just placed it after the fourth generation system - the end of a technical genealogy and a person's career.

The lecturer inserted a personal experience here, which is a rare "why do you do this" in this lecture: When AlphaGo came out in January 2016, he was deciding the direction of research. He had previously done computer vision; after seeing this news, he turned to decision-making problems and worked his way to today's robot learning. The reason he gave was "I'm not satisfied with just processing passively collected data sets."

![More complex games: AlphaStar for StarCraft II (October 2019) and OpenAI Five for Dota 2 (April 2019)](</attachments/cs231n-bdd12f57d6766ae0d5e78e1e.png>)

Following that are two more complex games: StarCraft II’s AlphaStar and Dota 2’s OpenAI Five. The lecturer's judgment on this step was very straightforward: as long as the computing power is sufficient and the training infrastructure is properly designed, games several orders of magnitude more complex than Go can be conquered; conversely, **If the rules of a domain can be accurately simulated, sooner or later it will be eaten up by reinforcement learning**. This judgment is the baseline for all subsequent "why real robots are different".

### 3.5 Real Robot: Motion control is close to being solved, but operation is still far away

![Quadruped robot crosses snow, brush and gravel (Science Robotics 2020); below right is Unitree’s December 2024 locomotion demonstration](</attachments/cs231n-7faf16a9023e9805fdfe97f8.png>)

On the left is ETH’s work published in Science Robotics 2020: a quadruped robot traverses snow, shrubs, and gravel. The lecturer said that this paper changed his view on reinforcement learning - before this, the success of RL basically stayed in the game, because the game can be infinitely copied, training and testing are equally distributed; while real robots have a simulation-to-real gap. The conclusion of this work is: **The simulation does not have to simulate bushes and snow. As long as the parameters such as friction and geometry are randomized wide enough, the real world is just a sampling point in this distribution.**.

On the right is Unitree’s demonstration in December 2024: the same set of ideas makes more extreme dynamic actions. The lecturer made the boldest judgment in this lecture - in the subfield of locomotion, the problem is close to being solved, and the solution is reinforcement learning. He also gave a limitation: in these demonstrations, there are still people giving high-level instructions (which direction to go in, whether to turn around), and the robot is responsible for translating the high-level instructions into the torque of each joint.

![Dexterous operation: OpenAI’s one-handed Rubik’s Cube operation in 2019, and Visual Dexterity in 2023](</attachments/cs231n-5247160a89c7569f4c153e5d.png>)

Manipulation is less optimistic. In 2019, OpenAI allowed a dexterous hand to learn to turn a Rubik's Cube in simulation, and then transferred it to a real machine; the lecturer specifically pointed out two facts behind the video: the success rate was very low, and the number of trials actually tested in the paper was also very limited. Visual Dexterity (Science Robotics 2023) on the right advances this to "in-hand reorientation of arbitrarily shaped objects", but the instructor still classifies this as "success on an isolated task" rather than a general ability.

### 3.6 Four ceilings of model-free RL

![Two basic problems with model-free reinforcement learning: learning from trial and error and requiring a lot of interaction](</attachments/cs231n-43655d70cf3dae1a41209abc.png>)

The slide begins collecting. The first is the learning method: pure trial and error means that every bit of progress must be exchanged for real interaction. The second one is magnitude: the lecturer used AlphaGo Zero as an example - learning three thousand years of human chess in 40 days sounds very romantic, but converted to a robot it is equivalent to several decades of computer time; if this task still has a huge sim-to-real gap and can only be practiced on a real machine, then this magnitude is a direct death sentence.

![The second frame adds three items: security risks, limited interpretability, and what to do when something goes wrong.](</attachments/cs231n-47d707fdc37df9842cb7bc8e.png>)

Three lines were added to the second frame. **safe**: The class showed a video of the process of a humanoid robot learning to walk. There were a lot of weird postures in the middle - these postures would be a disaster if they happened on a real machine. **Interpretability**: Strategy is a black box. When a problem occurs, it is difficult to locate which decision-making step was broken. **Correction**: When the behavior is wrong, there is no intuitive interface to tell it "what it should be".

![The third frame turns to humans: humans have intuitive models of the world, which are widely applicable and sample efficient.](</attachments/cs231n-45c8ce5833b63aa002fb3d00.png>)

In the third frame, the control object is changed to humans: we don’t just learn by trial and error, we have a knowledge about the world. **intuitive model**, I can "imagine" the result before taking action, so I can learn the same thing once or twice, and can transfer it to scenes I have never seen before. This frame is the turning point of the whole lecture - it changes the question from "How to make trial and error more efficient" to "Can I also learn a model?"

## 4. Model learning and model-based planning: learn to imagine first, then reversely interpret the actions

*(Reference time: 00:37:15 – 00:53:56｜Lecture 17)*

![The outline appears for the fourth time, and the current item switches to "Model Learning and Model-Based Planning"](</attachments/cs231n-8a8f47ba4160c022db6655c9.png>)

### 4.1 Write "Imagine" as a differentiable forward model

![The same agent diagram, this time the red box falls on the Physical World: what we need to learn is the state transition of the world](</attachments/cs231n-96fe3ff787297e71e52fd38f.png>)

The red box has moved from the intelligent agent to the physical world. What we want to learn in this chapter is the state transition function  $P(s_{t+1}\mid s_t,a_t)$: Give me the current state and action, and predict the next state. With it, decision-making changes from "trying" to "calculating".

![Model-based planning: given the current state and goal, use the model to predict the consequences of the candidate action sequence, and then calculate the gradient of the action](</attachments/cs231n-119f923d7c0047e14987f511.png>)

The slide writes the plan as a three-step cycle. The left side is geometric intuition: the gray dot is the current state, the red dot is the target, the several dotted lines are the trajectories of different action sequences in the model, and the green line is the selected one, which is the smallest distance from the target. On the right is the algorithm: **Execute the first action → get the new state from the environment → re-optimize the entire action sequence using gradient descent**. The reason why we only perform the first step is because the model must be inaccurate. It is safer to recalibrate after taking one step than to go all the way to the dark side.

There are two "keys" on this page that are worth remembering separately. `Key: GPU for parallel sampling / gradient descent`——Because the model is differentiable, the cost of the entire trajectory can be derived from the action, and the GPU can simultaneously sample hundreds of candidate trajectories and calculate gradients in batches. This is the direct reason why this type of method suddenly became practical after 2017. `Key question: what should be the form of s_t?`——The entire remaining chapter is devoted to answering this question: What should the state be represented as?

### 4.2 Three status representation, three generations of work

![Pixel dynamics: Deep Visual Foresight’s network structure, inputs the current frame and action, and outputs the next frame](</attachments/cs231n-f5a2c5596bd0104cebea760c.png>)

The earliest option is "state is image". Deep Visual Foresight (Finn & Levine, ICRA 2017) uses an encoder-decoder with LSTM to predict the next frame: the input is  $64\times64\times3$  The current frame, action and terminal state (5 dimensions each) are tiled into feature maps and then put into the middle layer. The decoder uses the CDNA kernel to generate 5 sets of transformed images, and then uses compositing masks to synthesize the final prediction. Its historical status lies in: this is the first batch of work to prove that "pixel-level forward models can be used for planning", and it is also the starting point of the later "world model" line.

![Planning demonstration of pixel dynamics: by comparing the pixel distance between the predicted frame and the target frame, deducing where to push](</attachments/cs231n-2339a240fc6225c88e57c391.png>)

The planning method is very straightforward: feed the candidate action sequence to the model, get a series of predicted frames, calculate the pixel distance between them and the target frame, and select the one with the smallest distance for execution. The lecturer pointed out two hidden costs of this type of method: the pixel distance is not equal to the task distance (a slight change in the background will swamp the displacement of the object), and the error will accumulate after predicting multiple frames.

![Key point dynamics: Use the key points on the object as the state to learn the 3D movement of the key points with the action](</attachments/cs231n-6e83fe65e87722ea5d996a19.png>)

The second generation shrinks the representation from "all pixels" to "a few key points" (Manuelli, Li, Florence, Tedrake, CoRL 2020): Mark a number of key points on the object, track their positions in 3D space, and learn a model of "given thrust and contact points, how the key points move". The state dimension is reduced from tens of thousands to dozens, making the model easier to learn and faster to plan.

![Real screen of key point dynamics: KUKA robotic arm pushing a box, with key point trajectories and "Trajectory 4" annotations superimposed on the screen](</attachments/cs231n-f303cf35649c87b428d8a192.png>)

This page is a video frame: the KUKA robotic arm pushes a paper box on a wooden platform. The fourth candidate trajectory is marked in the upper left corner, and the colored trajectory lines of key points can be seen in the small window in the lower right corner. What it shows is the actual rhythm of "planning-execution-replanning": each frame is re-solved using the current key point positions instead of following a pre-calculated trajectory.

![Particle dynamics: The particle pile is represented by a group of particles. The above picture is a real scene, and the following picture is the corresponding particle state.](</attachments/cs231n-06b4244473b3616496e1b0b5.png>)

The third generation is aimed at objects with a higher degree of freedom: particles, dough, and cloth. The approach is to represent the object as a set of particles (Wang, Li, Driggs-Campbell, Fei-Fei, Wu, RSS 2023), and the state is the position of all particles. The slide lists four moments horizontally: In the real scene, the robotic arm pushes a pile of dark particles from the lower right to the circular target area in the upper left corner (the target area is marked with a goal mask). The lower line is the corresponding particle representation - the distribution shape of the particles corresponds one-to-one with the outline of the real particle pile.

![Different particle media: cereal, rice, carrots, candy, particle size and shape vary greatly](</attachments/cs231n-a51f483d337b20acb60bcf1f.png>)

The same model has to handle particles of different sizes: cereal, rice, diced carrots, candy. The purpose of this page is to illustrate the versatility of "particle representation" - it does not assume that the object is a rigid body, nor does it assume that the particles are of uniform size. As long as the observations can be converted into a set of points, the model can be used.

![Pushing to the alphabet: At 24x speed, the robot pushes the pile of particles into the shape of the letters A to Z](</attachments/cs231n-45580ca7c17f7454af7633e6.png>)

This page is a demonstration of the effect, labeled "24x speed": the robot pushes the pile of particles from one shape to another, eventually spelling out letters. The task is divided into two stages - first do non-trivial overall redistribution (move most particles to the target area), and then align the details (edges, strokes). The lecturer emphasized that this type of task relies on "feedback + re-planning" to be reliable: model predictions will be biased, but new observations can be obtained from the environment at every step, and errors will not accumulate out of control.

### 4.3 From pellets to dough: RoboCook’s two-level decision-making

![RoboCook’s experimental bench: robotic arm, 15 3D printing tools, four RGBD cameras (outlined by yellow dotted circles), dough and fillings in the red box](</attachments/cs231n-8109f1c03b4ac798b2f63b98.png>)

This system (Shi, Xu, Clarke, Li, Wu, CoRL 2023, Best System Paper Award) uses the previous particle model to make dumplings: there are 15 3D printing tools (numbered 1–15, including platens, rollers, hooks, molds) on the workbench, four RGBD cameras reconstruct the geometry from different angles, and the red box is the dough and fillings. Robots have to decide for themselves **Which tool to use**, and **How to use**.

![Particle dynamics prediction: GNN gradually expands from a\_0 to a\_4. The upper line is the prediction, the lower line is the true value, the red dots are tool particles, and the blue dots are object particles.](</attachments/cs231n-0b99cac9fb45ec11d54c8d9b.png>)

This page is the most technically dense in the entire lecture. The model is a graph neural network (GNN): initial state  $s_0$  Expand gradually along the timeline, taking in an action at each step  $a_t$, output  $s_{t+1}$, after five steps we get  $s_5$. In the visualization, the red particles are tools and the blue particles are objects. The three pictures on the left are the initial configurations seen from the top view, side view, and perspective view respectively; the 5 columns on the right are predictions, and the row below them are the true values. The task of this frame is "grabbing". It can be seen that the deformation of the particle pile when the tool is pressed down is predicted to be quite close to the true value.

![The second frame of pressing live: the flat tool is pressed on the particle pile, and the predicted deformation is aligned with the true value frame by frame.](</attachments/cs231n-c959ce6a3fcee81228c38478.png>)

The second frame is changed to "Press": the red plate is pressed down from above, and the pile of blue particles is flattened and spread to both sides. Compared with the previous frame, the new difficulties here are the large contact area and strong deformation nonlinearity - but the prediction column and the true value column are still consistent, indicating that the particle representation is also valid for large-scale contact.

![The third frame of the pressing live: Change to a cylindrical roller tool to press the cloth/dough, and the deformation is transmitted along the rolling direction.](</attachments/cs231n-2f28febff0625152ba932368.png>)

In the third frame, the tool is changed again: the cylindrical roller presses on the blue thin layer, and the deformation is transmitted along the rolling direction. Looking at the three frames together, the selling point of this model is not "accurate prediction", but **There is no need to retrain when changing tools, actions, or materials.**——The physical semantics of particles are universal, tools are just another set of particles.

![Full screen video frame: RoboCook workbench at 12x speed, with a bottom axis of task stages from "Initial Dough" to "Dumplings"](</attachments/cs231n-abbabad0ffa617d796842e03.png>)

This page is the video frame with the most information in this lecture. Don’t be fooled by its lack of title. The upper left corner of the screen is marked  `12x speed`; There is a piece of dough in the middle of the countertop, and on the wooden board in the upper left corner are several dumplings that have been wrapped. There is a metal dumpling mold in the middle, and 15 tools are neatly lined up on the right side. The real key is the stage axis at the bottom: `Initial dough → Knife → Gripper → Press → Roller → Circle cutter → Pusher → Skin spatula → Filling spatula → Hook → Dumpling`, a total of eleven stages.

This axis explains why the decision-making is split into two levels in the ledger in the next section: the entire task is a long-term pipeline. At each step, the robot must decide not only "which stage it is at now and which tool to use" (discrete, few options), but also "how to use this tool specifically" (continuous, multiple degrees of freedom). It also explains how "recovery" is achieved - after a person destroys his face, the senior management judges that the current observations are more consistent with a certain stage upstream, so they turn the pointer back and start going down again from there. The so-called robustness in this system is a stage state machine that can jump back.

### 4.4 The ledger of this method

The lecturer added three engineering details in the Q&A, which was more informative than the slides themselves.

- **No physical simulation**. There is no simulator based on physical equations in the system; the control group used the best deformable body simulator at the time, MPM (Material Point Method). Even though a lot of system identification was done to estimate material parameters, the accuracy of the identified model was still obviously not as good as the model learned directly from real interactions. The lecturer's statement is that "our open-loop predictions align well with the true values, more accurately than any physics simulator."
- **Sampling is done offline, and only strategies are run online.**. Sampling hundreds of trajectories for each decision during testing was too slow, so they did large-scale sampling in the offline phase and used the data to distill a policy network; only one forward propagation was performed during deployment. This is still a neural network strategy, but its training signal comes from the model's predictions rather than human demonstrations.
- **Two-level decision making is trained separately**. The high level is the classifier of "which tool to use", which is trained on data collected 10 times by a human operator; the low level is the strategy of "given the tool, what to do next". The advantage of the two-level separation is recovery ability: after humans destroy the dough that has been kneaded, the high-level classifier can judge from the current observation to "return to an earlier stage" instead of going down the road.

This also explains the most dramatic scene in the video in the class: people keep adding ingredients to the table, pushing the dough away, and even destroying the entire finished product, but the robot can still start over. The lecturer's summary of this scene is "This reflects the patience and robustness of the system" - but what supports it is not patience, but re-evaluating the status, re-selecting tools, and re-planning at every step.

## 5. Imitation learning: turning "how to do it" into a supervision signal

*(Reference time: 00:54:49 – 01:03:08｜Lecture 17)*

![The outline appears for the fifth time, and the current item switches to "Imitation Learning"](</attachments/cs231n-1be6e1940249f2dbee4817e7.png>)

### 5.1 The same circuit diagram, change the frame

![Imitation learning: The red box falls on the agent, labeled "Supervised learning from the demonstration data set"](</attachments/cs231n-7665ebaea2b0fe7d2501a692.png>)

This time the red box falls on  `Agent`  on. The position given by the lecturer is one sentence: **Imitation learning is supervised learning from demonstration data sets**——The state is the input and the action is the label. Chapter 4 uses supervised learning to "learn the world", and this chapter uses supervised learning to "learn strategies"; both share the same premise, that is, the data has been collected.

![Learn from demonstration: Photo of mother and child playing with blocks](</attachments/cs231n-d1f06804dda10b31048d6ef2.png>)

The slideshow showed a very life-like photo: the mother held a red building block to her ear and "made a phone call", and the child held a green building block and followed suit. The lecturer explained that this matter is not new - humans have learned a large number of physical movements and social behaviors through imitation from a very young age, and robots have just moved this process to robotic arms. This also explains why imitation learning has been studied in the field of robotics for decades, but has only really become useful in recent years: what has changed is the ability to express the strategy, not the idea itself.

![Behavioral cloning: The left image compares the training trajectory with the expected trajectory of the policy, and the right image indicates "No data available for recovery"](</attachments/cs231n-1a44dfd6a1f9132725229dab.png>)

The most classic algorithm is behavioral cloning (BC): learn an algorithm from observations  $o_t$  to action  $a_t$  mapping  $\pi_\theta(a_t\mid o_t)$. The picture on the left shows how it breaks down: the black line is the training trajectory, and the red line is the actual trajectory of the strategy. They almost coincide at the beginning, and then diverge sharply after a certain position - because the input of the strategy there has slightly deviated from the training distribution, the actions it gives are even more biased, and the deviation is magnified. The picture on the right draws this matter as a runway: the yellow band is the data coverage area near the expert's trajectory. Once the strategy deviates outside the band, it is directly written on the picture.  `No data on how to recover` (There is no data to teach it how to recover), and finally hit a red cross.

this is **cascading error**: The single-step error is very small, but it pushes the state beyond the training distribution. The error in the next step is larger and exponentially amplified along the time axis. The fundamental difference between it and supervised learning is that in supervised learning, each sample is independently and identically distributed, and the wrong prediction of one sample does not affect the next sample; and here the  $t$  The output of step is  $t+1$  step input.

![Iteratively collect expert demonstrations: experts give feedback → training data → supervised learning → strategy → environment rollout → trajectory, return to experts](</attachments/cs231n-f2c3e29dd991d1ef8849857a.png>)

The engineering solution is to close this loop: first use experts to demonstrate and train a version of the strategy, run it in a real environment, specifically collect failed positions, and then ask experts to provide corrective actions at these positions (or people directly take over the demonstration), and add the corrected data to the training set for retraining. The slide depicts exactly this cycle - experts provide feedback and demonstrations, generate training data, supervised learning obtains strategies, the strategies are rolled out in the environment to generate trajectories, and the trajectories return to the experts. The lecturer said that this is the standard life cycle of "any imitation learning system in the real world".

### 5.2 The other way around: learn rewards first, then learn actions

![Inverse reinforcement learning: RL (reward → behavior) on the left and IRL (behavior → reward) on the right](</attachments/cs231n-231aebab952aba1d3581ae2a.png>)

Behavioral cloning has an implicit penalty: it throws away the task itself. The demonstration only wrote "how to do it", not "why to do it", so what the strategy learned was the superficial statistics of the action, not the goal. Inverse reinforcement learning (IRL) goes in the opposite direction: first derive a reward function from the demonstration, and then use this reward to run standard reinforcement learning. The slide makes this very clear with two arrows - RL is "behaviors algorithmically rewarded" and IRL is "behaviors algorithmically rewarded".

![Early results page of inverse reinforcement learning: the video is not rendered when exporting to PDF, leaving only a black frame](</attachments/cs231n-d8cd72b008ab7f0960b47f71.png>)

This page is a video placeholder: the embedded video is not rendered when exporting the PDF, leaving only a black box on the page. The lesson was about Stanford’s early helicopter aerobatic flying work - the work of Pieter Abbeel, Andrew Ng and others, which allowed model helicopters to learn radical maneuvers such as inverted flight and roll. The lecturer specifically emphasized that this was very old work, but at the time it was amazing to be able to make such an action on a real machine; its methodological significance was to prove that the path of "reversely deducing rewards from human demonstrations" can be closed-loop.

### 5.3 Expression forms of strategies: explicit, implicit, diffusion

![Explicit strategy and implicit strategy: on the left is F\_\\\\theta(o) direct regression action, on the right is \\\\arg\\\\min\_a E\_\\\\theta(o,a)](</attachments/cs231n-e32c2673f5f6e88036b056fb.png>)

The slides divide the strategies into two categories. **explicit strategy** (explicit policy) is a function  $F_\theta(o)$, calculate actions directly from observations - behavioral cloning is this category, and are trained using regression or classification. **implicit strategy** (Implicit policy) does not give actions directly, but gives an energy function  $E_\theta(o,a)$, the action is  $\arg\min_{a\in\mathcal{A}} E_\theta(o,a)$  Find it during inference.

This change solves one of the most embarrassing failure modes of behavioral cloning: **Multimodal presentation**. For the same task, people may go around from the left or from the right; using L2 regression to fit the two demonstrations, what is learned is the average of the two - a middle route that no one has walked, often directly hitting an obstacle. The energy function does not require a single answer, it only requires "the actions used by experts have low energy", so multiple modes can exist at the same time.

![Real machine results of implicit behavioral cloning: blue and yellow building blocks are packed in different trays, and the robot arm grabs and places them one by one](</attachments/cs231n-8eb4381a8622b95c70be093d.png>)

This page shows the effect of IBC on a real machine: there are two black trays on the table, with blue blocks on the left and yellow blocks on the right. The robot arm needs to sort the mixed blocks into colors. This kind of task with "rich contacts and variable initial configurations" is where explicit regression is most likely to collapse - each initial placement corresponds to a slightly different trajectory, and fitting with a single mean will keep hitting the edge of the tray. The lecturer used this set of results to illustrate that after switching to an energy model, the strategy can converge stably on multi-modal demonstrations.

![Diffusion strategies: explicit strategies (regression/mixture of Gaussians/classification histograms), energy surfaces for implicit strategies, and diffusion strategies for generated actions with K-step denoising](</attachments/cs231n-84c9736ffa3f76eb365be480.png>)

The third grid is the most quoted picture in this lecture. It lays out three generations of strategies side by side:

- **(a) Explicit strategy**:Action by  $F_\theta(o)$  Work it out in one go. Three output parameterizations are drawn in the dotted box - scalar regression, mixed Gaussian, and classification histogram; all three are "using one distribution to suppress multiple modes", and when there are more modes, they pull each other away.
- **(b) Implicit strategy**:Learn an energy aspect  $E_\theta(o,a)$, action is the lowest point of energy. The heat map in the middle is the energy terrain, and the white curve is the energy contour; the problem is to perform inner-layer optimization during inference, which is slow and may fall into a local minimum.
- **(c) Diffusion strategy**: Instead of finding the lowest point directly, learn the gradient of the energy field  $\nabla E(a)$, iterating from a noise action  $K$  Step by step "push" it to a low energy area. The arrow diagram on the right is the learned gradient field, the white curve is the target manifold, and the arrows point to it everywhere.

Where this analogy falls is: **Policy learning can borrow the entire toolbox of generative models**. Behavioral cloning corresponds to regression, IBC corresponds to energy model, and diffusion strategy corresponds to diffusion model; every time the generation model is changed, a type of failure mode is replaced. The lecturer added that the work was originally done at Columbia University and that the principals now teach at Stanford—he chose this example in part because "a lot of the work has a connection to Stanford."

![Full-screen video frame: a robotic arm working above a white bin, with green and orange segmentation masks superimposed on the screen](</attachments/cs231n-ec02f76640195391ad3dc537.png>)

The last page is a full-screen video frame: a white robotic arm is suspended above a white material bin, and green and orange instance masks are superimposed on the screen, indicating that the input to the strategy is indeed pixel-level perception, rather than a structured list of objects. It only appears once in the book and serves to pass the scene to the next chapter.

## 6. Basic model of robot: a strategy and an exam with no questions yet

*(Reference time: 01:03:08 – 01:18:25｜Lecture 17)*

![The outline appears for the sixth time, and the current entry switches to "Robot Basic Model"](</attachments/cs231n-b51a32b794eb8cc4db4090c6.png>)

### 6.1 What counts as a "robot basic model"

![The definition of the basic robot model: without explicit state representation and transfer function, it is a strategy that maps (observation, target) to action](</attachments/cs231n-7ceaad585676cfdba865bc93.png>)

The lecturer first draws a clear boundary: the basic model of the robot **No** explicit status representation, also **No** Explicit transition function; it is a strategy, the input is the observation (or state) plus the goal, and the output is the action. This is important - it means that the "world model" of Chapter 4 is abandoned here, and the model squeezes everything about the world into weights.

![Two sources of the same definition: the imitation learning side is Diffusion Policy, and the reinforcement learning side is OpenAI’s Rubik’s Cube](</attachments/cs231n-549f85a79785eb0cfdf2ca87.png>)

The slide then asks: What is the difference between this and the previous imitation learning and reinforcement learning? The answer is **There is no essential difference, only scale and generalization requirements**. The representative of the imitation learning side is Diffusion Policy (Chi et al.), and the representative of the reinforcement learning side is OpenAI's one-handed Rubik's Cube operation. They use the same type of function approximator, but the difference is that the basic model needs to work on a large number of tasks and a large number of embodiments.

![Analogy visual language model: the output is not always perfect, but always reasonable; the robot version is that the actions are not always optimal, but the trajectory is always beautiful and reasonable](</attachments/cs231n-29fcda5c4eb7c53d606908f3.png>)

The lecturer gave a very useful definition - analogy to the current visual language model: the output of VLM is not always perfect, but it will always generate **something reasonable**. The goal of the basic robot model is the same: the synthesized actions are not always optimal, but the generated trajectories are always "beautiful and reasonable". He took apart these two words and explained them on the spot: `beautiful`  Refers to no twitching or shaking, smooth and continuous; `reasonable`  Refers to understanding verbal instructions. The slide lists aliases at the end: Vision-Language-Action Models (VLA), Large Behavior Models (LBM) - different names for the same thing.

![Timeline of basic robot models: RT-1 (2022-12), RT-2 (2023-07), RT-X (2023-10), OpenVLA (2024-06), π0 (2024-10), and Helix, Hi-Robot, Gemini Robotics, π0.5, GR00T, DYNA-1 in 2025](</attachments/cs231n-db8f12ef68eb6325fc8a52f7.png>)

The timeline lays out the rhythm: RT-1 starts in December 2022, and there will be a new model approximately every six months thereafter - RT-2 (July 2023), RT-X (October 2023), OpenVLA (June 2024), π0 (October 2024), and 2025 will be an explosion: Figure's Helix, Physical Intelligence's Hi-Robot, Google’s Gemini Robotics, π0.5, NVIDIA’s GR00T, DYNA-1. The lecturer's evaluation of this paragraph was very restrained: this field is "noisy" because once you call it a basic model, you promise "wide generalization", and this requires a lot of evidence to prove - evidence is exactly what is lacking.

### 6.2 π0: pre-training + post-training, two stages

![π0’s six task screens: laundry, wiping countertops, folding cartons, clearing the table, grinding coffee, and cleaning up debris](</attachments/cs231n-a1e2d8839760352a03a4ab9d.png>)

The lecturer chose π0 as the only expansion example, and the reason was straightforward: this was a piece of work that convinced him that "this type of model can perform reliable and dexterous operations in real environments." The six cells on the slide are laundry, wiping countertops, stacking cartons, clearing the table, grinding coffee, and cleaning up debris. Each cell is labeled  `autonomous`  And double speed - note that the double speed here is mostly 1x to 2x, which is close to the real rhythm, rather than the common accelerated promotional video.

![Panorama of π0, with the red box marking the cross-embodiment dataset on the left: π cross-embodiment robot dataset](</attachments/cs231n-b9d29bd297cd12029317928d.png>)

The left column of the panorama is data: π’s own trans-embodied data set, labeled in the grid  `bus table`, `pack bottles`, `bag groceries`, `open popcorn`, `load dishes`, `sort legos`, `make coffee`, `sweep table`, `empty dryer`, `set table`, `pack shelf`, `flatten box`  and other tasks, from a variety of different robotic arm platforms. The lecturer's statement is: Any model that wants to be called a basic model must have fuel, and the fuel is data - the data here comes from both publicly available data sets and self-collected data in academia.

![In the same picture, the red box is moved to pre-training: Internet-scale pre-training + Open X-Embodiment data set, producing π0 vision-language-action model](</attachments/cs231n-c50210d4987b04b22e61e987.png>)

The red frame moves to the middle. The key design of pre-training is **Don't start from scratch**: The base is a VLM that has been trained on massive visual-language data, and an action expert is connected to the right. The two are trained together with two types of goals - one is action prediction, and the other is a goal moved from the visual question and answer task. The former type allows the model to take actions, while the latter type allows the model to not lose semantic knowledge. The lecturer emphasized the significance of this combination: generalization at the semantic level is "free" because VLM has already learned it; what needs to be supplemented by robot data is generalization at the action level.

![In the same picture, the red box is moved to post-training: high-quality post-training data, including high-dexterity tasks and unseen tasks.](</attachments/cs231n-66aba087a6575b9110f0b353.png>)

The red box moves to "High Quality Post-Training Data" below. The logic of this piece is borrowed from the large language model community: the base model gives a good starting point, but to do a good job on a specific task, you must use the data of the task for post-training. The slide separates the post-training data into two piles - high dexterity tasks and unseen tasks.

![First level evaluation: The red box marks "zero sample, in-distribution tasks", and the top of the page marks simple in-distribution tasks](</attachments/cs231n-1270897cba3518ef6d9f80e4.png>)

On the next three pages, the red box continues to move on the same picture, this time marking the evaluation gear. The first gear is **Zero-sample in-distribution tasks** (zero-shot in-distribution), the top of the page is marked "Simple in-distribution task" - run directly using the base model, an example is clearing the dining table (bus table). The lecturer's statement is: These tasks have most likely seen similar forms in the pre-training stage, and the base model is enough.

![Second level evaluation: The red box marks "Specialized post-training for difficult tasks", and the top of the page marks tasks within complex distributions](</attachments/cs231n-8f6dc826c7be288c5a8f7d52.png>)

The second gear is **Specialized post-training for difficult tasks** (specialized post-training to difficult tasks), marked "Complex intra-distribution tasks" at the top of the page. Examples are emptying the apartment dryer and folding shirts in batches. The tasks are still distributed, but the requirements for dexterity and long-range consistency are much higher and must be fine-tuned with task data.

![Third level evaluation: The red box marks "Efficient post-training for unseen tasks", and the top of the page marks the unseen tasks](</attachments/cs231n-0762da8d50d3637605fc6a05.png>)

The third gear is **Efficient post-training for unseen tasks** (efficient post-training to unseen tasks): Putting things back in drawers, replacing paper towel rolls. The key word for this level is "efficiency" - instead of retraining the model, it uses a small amount of task data to quickly adapt. The three levels together are actually three budgets for the same problem: **Buy as much performance as you have task data**.

![Live video taken by the speaker: two black robotic arms folding cartons on a wooden table with an open laptop on the table](</attachments/cs231n-1dd2eeac87e40d266184fcc4.png>)

This page was taken by the lecturer with his mobile phone in the Physical Intelligence office the day before: two black robotic arms folded a cardboard box on a wooden table, next to an open notebook. Its function is to bring all the previously refined demonstration videos back to the scene - no lighting, no editing, and the camera is still shaking. The lecturer used this material to illustrate that this type of system can already operate in "engineering sites" rather than in "photo studios".

![π0 open source page: Released on February 4, 2025, Apache-2.0 license, warehouse Physical-Intelligence/openpi](</attachments/cs231n-0f7c23c8406995c26243611a.png>)

The last page is the open source announcement: Released on February 4, 2025, repository  `Physical-Intelligence/openpi`,Apache-2.0 license. The README states that the warehouse contains two types of models - π0 (flow-based diffusion VLA) and π0-FAST (autoregressive VLA based on FAST action tokenizer), and provides pre-trained base checkpoints on more than 10,000 hours of robot data, as well as examples of out-of-box use and fine-tuning on your own data set. There is also a very practical disclaimer in the announcement: π0 was developed for their own robots, unlike common platforms such as ALOHA and DROID, so "it may not work for you, but you are welcome to try it."

The lecturer added three questions and answers, which contain more information than the slides:

- **Why is it slower than others?**. The demonstration data was collected by humans remotely operating the same robot. However, remote operation itself is slower than using one's own hands - the body shape is unfamiliar, the robotic arm is far away from the body, and there is obstruction. The operator has to constantly change the perspective to confirm "should we enter the next stage now?" Strategies are learned from this kind of data, and the speed limit is locked by the data collection method.
- **How far can a long-range mission go?**. He was pleased with the performance on a long-range task like folding cardboard boxes, but made it clear that he didn't believe "one giant strategy" could cover everything in a domestic scenario (folding laundry, making beds, cleaning floors). His judgment is that high-level abstractions - scene graphs, symbolic representations and the like are needed as conditions to feed VLA to assign tasks.
- **Where does generalization come from?**. Generalization at the semantic level comes from pre-trained VLM, which is free; generalization at the action level must be supplemented by post-training on robot data, and there is no shortcut in this part.

### 6.3 Evaluation: the real bottleneck in this line of work

![The outline appears for the seventh time, and the current entry switches to "Legacy Challenges"](</attachments/cs231n-d722efddce4ea2bfaca1bed5.png>)

![Real-world evaluation: ALOHA 2’s workstation array, rows of remote operation stations](</attachments/cs231n-c1eed505d990764d503c510b.png>)

The lecturer puts evaluation first among all challenges on the grounds that it determines whether "common progress" can be achieved in this field. The current situation is that evaluation is mainly done in the real world: the picture shows the ALOHA 2 station array of Google Robotics. Rows of remote control stations are arranged in a grid, which is used for both data collection and evaluation. The price is **Expensive and noisy**: The results depend on how the initial configuration is placed, how the lights are turned on, and how much friction the table has. If someone else does the same evaluation, the numbers will be different. He quoted the other party's words - "Our budget is big enough to keep moving forward" - this sentence itself is a commentary on the current situation.

Even more terrible is the second one: **There is only a weak correlation between training loss and true success rate**. In supervised learning, the loss directly measures the quality of the model. The loss here measures the accuracy of single-step action prediction, and the success of the task depends on the accumulation of dozens or hundreds of steps; the training goal is the single-step likelihood, and the evaluation indicator is the task success rate. The short-range is looked at during training, and the long-range is tested during testing. If the three dislocations are stacked together, no cheap indicator can replace the real machine evaluation.

![Simulation evaluation: BEHAVIOR benchmark scene collage, home scene and humanoid robot in Habitat 3.0](</attachments/cs231n-92ab5032762fbabe2f7ffc61.png>)

Can the review be moved to simulation? The slide lists five stuck points: the sim-to-real gap is completely different in rigid bodies, deformable bodies, and cloth; asset generation efficiency is low (a scene takes a long time to build); the digitization of the real world itself is a difficult problem; procedural generation must ensure authenticity and diversity at the same time; and finally and most importantly -**Does the ranking in the simulation correlate with the ranking in the real world?**, no one can guarantee this. The figure gives two representatives: the BEHAVIOR benchmark made by the Stanford Physics Laboratory (virtual scenes of a large number of family activities), and Meta's Habitat 3.0 (family simulation with humanoid robots and humans).

There is a red box in the upper right corner of the slide that says  `ImageNet in Embodied AI?`——This is the landing point of the whole section. ImageNet was successful because for a few years "progress in ImageNet" was almost equivalent to "progress in computer vision"; what embodied intelligence lacks is such a platform: a benchmark on which any progress can be measured and is strongly related to the real world.

### 6.4 From basic strategy to basic world model

![Basic strategy → Basic world model: The robot interaction data of action conditions feeds both at the same time, with a two-way arrow between the two.](</attachments/cs231n-0a398660a737d5ef892de203.png>)

The lecturer gave his own definition here: the world model is **Future prediction of action conditions** (action-conditioned future prediction). The slide shows a very economical structure: the same batch of "robot interaction data for action conditions" is fed all the way to the basic strategy and all the way to the basic world model, with two-way arrows between the two.

The reason he gave was an observation that should not be wasted: now everyone collects large-scale action condition interaction data in order to train strategies; these data contain a lot of dynamic knowledge, and "it would be too wasteful" if they were only used for strategy learning. In turn, the world model can provide an imaginary rollout to the strategy, and the strategy can provide a more relevant data distribution to the world model - this is the replay of Chapter 4 "Learning Model + Planning" on the basic model scale.

![The current state of world models: World Models’ cycling imagination illustrations, 1X’s three-frame foyer prediction, DayDreamer’s latent space codec structure, NVIDIA Cosmos’ humanoid robot images](</attachments/cs231n-f918cfcb7952f81a95236b15.png>)

This page puts four clues side by side: on the left is the famous illustration of World Models (a cyclist thinking about himself riding a bicycle) - the core of the world model is this ability to "go through it in his mind first"; in the upper right corner is the three-frame prediction of the foyer scene by the 1X world model; in the lower left is the structure of DayDreamer (hidden state)  $h_t$  Recursion, encoder/decoder reconstructs observations, predicts next frame  $\hat{x}_t$); The lower right is NVIDIA’s basic model of the Cosmos world.

Listed on the right side of the slide are four unanswered questions that are worth copying down as a research list: Do you want 3D? Do we need structural priors? How much does study and physics account for? How to ensure relevance to the real world? These four questions appeared in Chapter 4 in the form of "What should the state be represented as", but on a larger scale.

![Basic model customized for embodied agents: existing LLM/VLM will fail in geometric and physical interaction, RLHF needs to become "learning from embodied feedback"](</attachments/cs231n-0c06ec972339a36931998952.png>)

In the next three pages, the lecturer made it clear that  `I can maybe skip through` (I can skip quickly), so I just did the stripping, but the judgment on the page still holds. The argument on this page is that the existing basic models are not designed for embodied agents - LLM/VLM will fail on tasks involving geometry, embodiment, and physical interaction; the corresponding research direction is to promote "reinforcement learning from human feedback" (RLHF) to "reinforcement learning from embodied feedback". At the bottom of the page are three iconic models: GPT, Segment Anything, and DINOv2, which means: the success of general vision and language models has not yet been automatically transformed into embodied capabilities.

![Adaptation and lifelong learning: adapting to new scenes (messy kitchen), adapting to human preferences (BEHAVIOR-1K’s preference score curve), becoming stronger through experience (children learn to cook)](</attachments/cs231n-3ce5afbca9581e1790f27aad.png>)

The second page talks about adaptation: adapting to new scenarios, adapting to human preferences, self-improvement/lifelong learning. The middle picture is very interesting - the horizontal axis is the activity ranking (1 to 2090), the vertical axis is the preference score, the blue area is marked BEHAVIOR-1K, and the bubble says "How much will you benefit if the robot does this for you". It is actually asking a question beyond evaluation: **Among the more than two thousand activities, which ones are really worth doing by robots?**.

![System engineering: Figure’s Helix dual system (7B VLM for semantic reasoning, 80M transformer for fast control) and Physical Intelligence’s Hi-Robot two-level strategy](</attachments/cs231n-7845a4c1a8a276eb9832d21f.png>)

The third page is the one that the lecturer thinks is most easily ignored: **Every robot job is a system job**. The left picture is Figure's Helix: System 2 is 7B's pre-trained VLM, running at 7-9 Hz for semantic reasoning; System 1 is an 80M transformer, running at 200 Hz for fast response control; the two communicate through latent vectors, with robot images at 20 Hz, joint angles at 7-9 Hz, and finger positions at 20 Hz. The picture on the right is PI's Hi-Robot: the high-level strategy (VLM) outputs "low-level language instructions", and the low-level strategy (VLA) combines joint status to output actions. What the two pictures have in common is that **frequency stratification**——Think slowly and act quickly. Latency, computing power, and how modules talk to each other are not implementation details, they determine the entire architecture.

![The outline appears for the eighth time as the last navigation before closing.](</attachments/cs231n-cfc5808eaf57515c1ea23922.png>)

![Pictures of the future: eight AI-generated pictures of home robots, covering scenes such as sweeping the floor, cooking, laundry, shoveling snow, accompanying the elderly, etc.](</attachments/cs231n-d635a168ac64912b828bae06.png>)

The penultimate page is a picture of eight AI-generated household robots: sweeping the floor, wiping tables, doing laundry, packing luggage, frying eggs, serving burgers, shoveling snow, and drinking tea with the elderly. The lower left corner of the page is marked honestly  `Images generated using AI`. The lecturer ended it in a very restrained way - this is not a roadmap, but a list of requirements: only a handful of these scenarios can currently be reliably completed by existing systems.

![Preview of the next lecture: Human-Centered AI](</attachments/cs231n-748ed7a553c7daa3fa43d487.png>)

The last page is a preview of the next lecture: Human-Centered AI, presented by Fei-Fei Li.

## 7. Summary

*(Reference time: 01:18:08 – 01:18:25｜Lecture 17)*

- The dividing line between robot learning and computer vision is not the model, but the **The action changes the input for the next step**; All algorithmic problems (non-stationary, credit assignment, non-differentiable) are corollaries of this causal edge.
- The four paradigms are "learning signals" on the same loop diagram: trial and error is the most expensive but has the highest upper limit, the learning model saves the most samples but relies on representation, the copying demonstration is the fastest to implement but will be bitten by distribution deviation, and the basic model is the most versatile but under-evaluated.
- The choice of state representation is the entire method: the three representations of pixels, key points, and particles correspond to three solvable object complexities. Choosing the wrong representation will make subsequent optimizations impossible to learn no matter how you adjust it.
- "The simulation does not have to be perfect, the randomization just needs to be wide enough" This experience has been verified on locomotion, but it is still an open problem in operation - the root of the difference is contact and deformable bodies.
- The failure mode of imitation learning is cascading errors. The engineering solution is not to change the loss function, but **Iteratively collect correction data**;The expression form of the strategy (explicit/energy/diffusion) determines how many presentation modes it can accommodate.
- The basic robot model does not have an explicit world model. It puts physics into the weights; pre-training provides semantic generalization, and post-training buys task performance. "Buy as much performance as you have task data" is its pricing method.
- Evaluation is the real bottleneck in this industry: real-machine evaluation is expensive and noisy, the relevance of simulation evaluation is unknown, and training loss is weakly related to success rate - before the emergence of "embodied ImageNet", progress is difficult to measure together.
