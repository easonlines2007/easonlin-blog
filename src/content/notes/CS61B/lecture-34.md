---
date: 2026-10-21
tags:
  - cs61b
status: completed
publish: true
title: Lecture 34 · 软件工程 III：软件工程伦理与技术反思：工程师的社会责任、技术伤害账本、算法偏见与安全防范
description: CS61B 第 34 讲：软件工程 III：软件工程伦理与技术反思：工程师的社会责任、技术伤害账本、算法偏见与安全防范
topic: CS61B
order: 34
updated: 2026-10-22
---

> **课程体系**：UC Berkeley CS61B: Data Structures (Spring 2024)  
> **所属模块**：Module 6: 高级数据结构与经典排序 (Tries & Sorting Algorithms)  
> **主讲教师**：Prof. Justin Yokota & Prof. Peyrin Kao (UC Berkeley)  
> **视频时长**：54:00 ｜ **官方原版**：Lecture 34 - Software Engineering III  
> **视频直达**：[📺 在 B 站观看本讲原视频 (P34)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34) ｜ [📑 官方课件 Slides (Google Presentation)](https://docs.google.com/presentation/d/1nE_oD8Mx6tRcO6zOnz7KbSxCtaZpaoDlcPhKzfNXrqI/edit?usp=sharing) ｜ [📖 官方教材章节](https://cs61b-2.gitbook.io/cs61b-textbook/33.-software-engineering-iii)  
> **快速导航**：[← 上一讲 (P33 排序 IV：基于比较排序的理论下界证明)](/notes/cs61b/lecture-33) ｜ [📚 返回全书目录](/notes/topics/CS61B) ｜ [下一讲 (P35 排序 V：非比较排序与基数排序（LSD / MSD）) →](/notes/cs61b/lecture-35)

---

## 1. 工程师的社会契约：从玩具代码到影响现实世界的系统

*(参考时间：00:01:20 · [视频跳转 (P34 00:01:20)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=80))*

随着计算机软件接管现代文明的金融支付、医疗诊断、自动驾驶与司法裁决，代码不再仅仅是终端里的字符。

Josh Hug 教授在 Lecture 34 中开辟了著名的思辨专题：**“工程师的伤害账本（The Ledger of Harms）”**。  
编写代码的工程师必须对软件可能对现实世界个体造成的精神、财产与人身危害保持崇高的敬畏与审慎。

## 2. 算法偏见（Algorithmic Bias）与伦理反思

*(参考时间：00:11:00 · [视频跳转 (P34 00:11:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=660))*

数据不是客观中立的，数据是人类历史偏见的镜像。如果算法被盲目喂入带有偏见的历史数据（如招聘筛选、信用卡额度审批），算法将以数学的高效性成百上千倍地放大这种偏见。

工程团队必须建立伦理审查流程，确保模型的公平性（Fairness）、可解释性（Explainability）与透明度。

## 3. 本讲小结与课后自测

*(参考时间：00:20:00 · [视频跳转 (P34 00:20:00)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34&t=1200))*

### 课后自测
软件工程师应该遵循哪种职业伦理准则？  
**答案**：遵循 ACM/IEEE 软件工程职业道德准则（Software Engineering Code of Ethics），将公众健康、安全与福祉置于任何商业利益之上。

---

## 附录：UC Berkeley 官方教材深度研读 (Official Textbook In-Depth Chapters)

> **导读说明**：本节内容整合自 UC Berkeley CS61B 官方教材库（GitBook Textbook），针对本讲的核心数据结构与算法提供原汁原味的英文理论推导、形式化代码范例与配套章节习题，与前文视频精讲相互补充印证。

## 33. Software Engineering III

By William Lee and Teresa Luo

---

## 33.1 Candy Crush, SnapChat, and Friends

Transitioning away the theoretical analysis of Software Engineering and complexity management, this last section of the Software Engineering series will discuss more on how software has and continue to reshape society in our lifetime.

### A Case Study Series

#### Case Study 1: Candy Crush

The mobile game Candy Crush tracks the number of days you have played in a row. Specifically with the following features:

* Every consecutive day gets you a reward.

* Progress tracking features: 

  * Progress indicator

  * Up to 2 hours worth of a special item for that day that makes the game more fun.

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FLZNvFXwa9yzpeZe3qi9z%2FScreen%20Shot%202023-04-10%20at%2010.22.27%20PM.png?alt=media\&token=a07e0db5-087e-4c90-af82-fd3135f3b470)<br>

More importantly: if you miss a day, the counter resets.

##### Why does this feature exist in Candy Crush?

Specifically, establishing a progress tracker tied with a reward system that punishes you instantly a day is missed? Well, this feature clearly encourages you to engage with the app every day. 

#### Case Study 2: Snapchat

Despite being a slightly outdated example (as people have collectively voted it to be "out of style", unlike Taylor Swift), Snapchat incorporates a very similar feature as Candy Crush to keep users constantly engaged, and stay engaged every day.

Specifically, its "streak" feature has kept many people hooked for a very long time, as seeing the number "509" just makes you can't help but send another random shot of at a random angle that is so blurry with nothing distinguishable but the thick, red "S" sliced across the screen, to a random person from your high school whom you never talk to (True story).

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FO7ZK5or2Fn6eL6Gnv7uJ%2FScreen%20Shot%202023-04-10%20at%2010.28.06%20PM.png?alt=media\&token=c632b36d-6e39-4898-aaf4-0b3121d10dcc)

Classic.

#### Case Study 3: Friends...?

What are some other engagement generating features? Big, social media tech companies definitely give solid answers.

Based on discussions in class, some of such features include:

* LinkedIn: How many searches you appeared in.

* Notifications in general.

* Stories induce you to see them all.

* Infinite scroll. (The most evil)

* Recommendation algorithm on youtube and especially TikTok.

* Playstation trophies.

Then, a natural question to ask here is, **what are some of the positive and negative impacts of these technologies or features on our lives?**

### Impacts: Net Positive?

Every coin has a flip side, and so do the infamous, addictive technologies. 

Going back to the social media case, for example. Some *negative* impacts of certain social media features that people have discussed include:

* Addiction 

* Instead of having conversation with people, you fulfill your need to socialize with junk food socialization.

* Less face to face interaction.

* Toxic comparisons.

* Opens you up to manipulation.

* Fear of missing out (FOMO).

* Disinformation spreads widely.

However, there are also some *positive* aspects of this unique, modern champagne problem:

* Socialize, connection with humans in a way that overcome geographical and sometimes even cultural constraints. 

* Stay up to date with what’s going on.

* Help you stay educated on important topics and issues. 

* See a wide range of diverse perspectives AND cute dogs.

##### Example: Is TikTok a net positive to the world?

According to a free, open discussion in lecture, here are some general thoughts: 

* Yes: Wholesome videos! (some)

* No: Would have to run some numbers, but the time people spend on TikTok could be spent on something more useful.

* Yes: People can create information, can spread information more easily that is counter to existing power structures.

* No: People can spread misinformation / inaccurate information. 

* No: Attention spans are getting shorter.

* No: Company collects massive amounts of information, bad privacy.

* BIG YES: TikTok creates lot of jobs for people graduating from Berkeley with CS degrees (RIP Meta, FTX, Twitter…).

Whether or not these platforms or technology bring a net positive impact on the world is and will continue to be up for debate. The important message here is the importance to reflect on the social impacts of these technology, especially through a dichotomous lens. 

---

## 33.2 The Ledger of Harms

The concerns that we talked about from the previous section are not left unnoticed by leaders of the industry. In fact, the opposite is true: many of them has openly expressed their concerns regarding these not-so-novel technologies that permeate our lives now.

* “I think we have created tools that are ripping apart the social fabric of how society works.” - [Chamath Palihapitiya](https://www.theverge.com/2017/12/11/16761016/former-facebook-exec-ripping-apart-society) (early executive at Facebook)

* “God only knows what it\[Facebook]’s doing to our children’s brains.” - [Sean Parker](https://www.theverge.com/2017/11/9/16627724/sean-parker-facebook-childrens-brains-feedback-loop) (the Napster guy)

* “The technologies we were most excited about 10 years ago are now implicated in just about every catastrophe of the day.” - [Farhad Manjoo](https://www.nytimes.com/2017/10/11/insider/tech-column-dread.html) (technology journalist)

* “These are our lives. These are our precious, finite, mortal little lives. The idea that we are spending them distracted, not accomplishing the thing that we’re trying to do, is just painful. It’s crazy.” - [Justin Rosenstein](https://www.theverge.com/2018/3/28/17172404/justin-rosenstein-asana-social-media-facebook-timeline-gantt), creator of the Like button and founder of Asana

* “Facebook appeals to your lizard brain — primarily fear and anger,” he said. “And with smartphones, they’ve got you for every waking moment.”” -[Roger McNamee](https://www.nytimes.com/2018/02/04/technology/early-facebook-google-employees-fight-tech.html) (early investor in many tech companies, interesting guy)

### The Ledger of Harms

The problems have long been identified. What about the solution? 

The [Center for Humane Technology](https://humanetech.com/) was founded by current and former tech workers to raise awareness and try to combat harmful side effects of internet tech platforms----to develop solutions for these problems. 

In 2018, they created a [Ledger of Harms](https://ledger.humanetech.com/) to “collect those negative impacts of social media and mobile tech that do not show up on the balance sheets of companies, but on the balance sheet of society.” 

The Ledger encompasses the following categories: 

* The Next Generations: Developmental delays, suicide, physical/mental/social changes.

* Making Sense of the World: Misinformation, conspiracies, fake news.

* Attention and Cognition: Loss of ability to focus without distraction.

* Physical and Mental Health: Stress, loneliness, addiction, risky behavior.

* Social Relationships: Less empathy, more confusion and misinterpretation.

* Politics and Elections: Propaganda, distorted dialogue, disrupted democratic processes.

* Systemic Oppression: Amplification of discrimination.

* Do Unto Others: Tech employees limit tech usage in their own homes.

For each category, they provide research and citations for potential harms.

The rest of this section will list quotes from some categories to read through.

#### Making Sense of the World

* “64% of all extremist group joins are due to our recommendation tools...our recommendation systems grow the problem”, noted an internal Facebook presentation in 2016. Yet repeated attempts to counteract this have been repeatedly ignored, diluted, or deliberately shut down by senior Facebook officers, according to a 2020 Wall Street Journal investigation.”

* “Fake news spreads six times faster than true news. According to researchers, this is because fake news grabs our attention more than authentic information: fake news items usually have a higher emotional content and contain unexpected information which inevitably means that they will be shared and reposted more often.”

* “45% of tweets about coronavirus are from bots spreading fake information, according to research from Carnegie Mellon University.”

* “2 minutes of exposure to a conspiracy theory video reduces people’s pro-social attitudes (such as their willingness to help others), as well as reducing their belief in established scientific facts.”

#### Attention

* “The presence of a smartphone, even when off, can reduce cognitive capacity by taxing the attentional resources that reside at the core of both working memory capacity and fluid intelligence.\*\*\*\*\*\*”

* “72% of teens and 48% of parents feel the need to immediately respond to texts, social-networking messages, and other notifications.”

* “1 hour per day is the amount of time most Americans spend dealing with distractions and then getting focused and back on track each day, which comes to a grand total of 5 full weeks in a year.”

#### Mental Health

* “30% of 18-44 year olds feel anxious if they haven’t checked Facebook in the last 2 hours \[in 2020].” 

* “1 month away from Facebook leads to a significant improvement in emotional well-being. In an experimental study of over 1,600 American adults (who normally used Facebook for up to an hour each day), deactivating Facebook accounts led to a significant increase in emotional well-being (including a reduction in loneliness and an increase in happiness), as well as a significant reduction in political polarization.”

* “In just 3 years, there has been a quadrupling in the number of plastic surgeons with patients undergoing cosmetic surgery for the sake of looking good on social media (from 13% in 2016 to 55% in 2019).“

#### Relationships

* “Even the mere presence of smartphone can disrupt the connection between two people, having negative effects on closeness, connection, and conversation quality.”

* “People overestimate their ability to correctly interpret sarcasm, humor, or sincerity over text communication, and this means people tend to believe they can communicate over e-mail more effectively than they actually can.”

* “50% of Americans report that their partner is often or sometimes distracted by their devices when they are trying to talk to them.

* “89% of cellphone users admit to using their phones during their last social gathering.”

#### Politics and Democracy

* “More fake political headlines were shared on Facebook than real ones during the last 3 months of the 2016 US elections.”

* “Exposure to a fake political news story can rewire your memories: in a study, where over 3,000 voters were shown fake stories, many voters later not only “remembered” the fake stories as if they were real events but also "remembered" additional, rich details of how and when the events took place.”

* “Analyzing over 2 million recommendations and 72 million comments on YouTube in 2019, researchers demonstrated that viewers consistently moved from watching moderate to extremist videos;” \[Josh Note: This is much much better now. Good job youtube!]

#### Systemic Oppression

* “Russia's IRA spread false information designed to create outrage about Black Lives Matter and deepen social division in the US. Research indicates that one of the IRA's major strategies was to use social media platforms to target conservative groups who supported the police or veterans and specifically feed them misinformation about BLM.”

* “With over 800 million users, TikTok promotes itself as a place for self-expression and unrestricted creativity, yet its internal documents reveal a policy of downgrading content from users who do not fit normative ideals of gender, race, class, sexuality, or able-bodiedness, with moderators urged to censor users with "abnormal body shape", "too many wrinkles", or whose environment shows signs of poverty such as "cracks in the wall" or "old decorations".”

#### Children

* “58 minutes per day is the average amount of time 2-4 years old spend on mobile devices.“

* “In a longitudinal study tracking over 200 children from the age of 2 years to 5 years old, children with higher levels of screen time showed greater delays in development across a range of important measures, including language, problem-solving, and social interaction. Analyses indicated that the level of screen time was significantly linked to the specific level of developmental delay 12 -14 months later. “<br>

---

## 33.3 Your Life

#### The Power of Software

Unlike other engineering disciplines, software is effectively unconstrained by the laws of physics.

* Programming is an act of almost pure creativity!

The greatest limitation we face in building systems is being able to understand what we’re building!

#### The Limiting Reagent

You are a rare commodity.

Revenue per Employee:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2F1PBY0gwJAfZy52gPzy5K%2Fimage.png?alt=media\&token=ef710cb0-d7b8-4356-a08c-f2c49f4632cc)

Profits per Employee:

![](https://2316889115-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2FCLYj7ccqvV6l4Pt9R0w5%2Fuploads%2FZMb0y8m6lI8FqZoAPAQs%2Fimage.png?alt=media\&token=11b97d18-ff42-4e3a-b497-647b4818aea0)

Sources: [Link](https://www.wolframalpha.com/input/?i=revenue+per+employee+facebook+vs+alphabet+vs+amazon+vs+microsoft+vs+apple), [Link](https://www.wolframalpha.com/input/?i=profits+per+employee+facebook+vs+alphabet+vs+amazon+vs+microsoft+vs+apple)

The skills you are building will be in high demand from companies, non-profits, government agencies, educational institutions, and more.

* The choice of how to spend your career is yours.

#### Some CS61B Data (Spring 2019 vs Spring 2021)

Spring 2021:

<figure><img src="https://lh6.googleusercontent.com/F6YHSAwZH0DsakcD41Da2hdSJr3RSpbaanpG5h-xFUOHBU8-7hu7HOAf3xulNAFPjoqAyavr1NbCwgOJ3LSDblur0PMn-ZTFehaFpyKT8kL1e4yMQIZ3cLPVJvREPzDEyOx3I1rx-YG8wMS7LIbDxYSYhw=s2048" alt=""><figcaption></figcaption></figure>

Spring 2019:

<figure><img src="https://lh4.googleusercontent.com/6S3iPyMdD2mOuqWRBsN97v4iNq4UkRo_nzmUHSZfadjEEk2CVBh1vsdANObMBMIw3JDC7ksCHb7_NFJVFUin6XS1AtNagfUOLDevPBxs-mMKEbY0RtBtQWnbDU8F6f8Usela_tO1FLt9yFqtOM0NG8uc3g=s2048" alt=""><figcaption></figcaption></figure>

#### Steering the Course

Quite a lot of you will likely end up working at some sort of technology company at some point in your life.

There’s nothing (IMO) wrong with working at profit driven tech companies.

* Please do realize that even as a rank and file employee, you have the power to effect change, particularly if you are paid in stock (because then you are a partial owner).

Let’s see some examples.

##### Example 1: Google and the Censored Chinese Search Engine

From 2006 to 2010, Google operated a censored version of Google in China.

* Withdrew in 2010 in response to cyber attacks by the Chinese government on users of Google’s services: “These attacks and the surveillance they have uncovered--combined with the attempts over the past year to further limit free speech on the web--have led us to conclude that we should review the feasibility of our business operations in China. We have decided we are no longer willing to continue censoring our results on Google.cn.”

In Oct 2018, leaked documents published in [The Intercept](https://theintercept.com/2018/08/01/google-china-search-engine-censorship/) revealed a secret project by Google to re-enter the Chinese market.

* This new search engine would be censored, and also allow government officials to hypothetically track Chinese residents making undesired queries.

Some employee responses:

* After the leaks, access within the company to documents related to the project were curtailed: “Everyone’s access to documents got turned off, and is being turned on \[on a] document-by-document basis,” said one source. “There’s been total radio silence from leadership, which is making a lot of people upset and scared. … Our internal meme site and Google Plus are full of talk, and people are a.n.g.r.y.” \[[Link](https://theintercept.com/2018/08/03/google-search-engine-china-censorship-backlash/)]

* Over 1400 employees signed a letter demanding more transparency, and at least five employees resigned in protest \[[Link](https://theintercept.com/2018/09/13/google-china-search-engine-employee-resigns/)].

Jack Poulson (a senior scientist who resigned): ([Link](https://theintercept.com/2018/09/13/google-china-search-engine-employee-resigns/))

* “There are serious worldwide repercussions to this... what are Google’s ethical red lines? We already wrote some down, but now we seem to be crossing those.”

* Poulson said that he “very much agree\[s] with the case Sergey made in 2010. That’s the company I joined, the one that was making that statement.” If the anti-censorship stance is shifting, he said, then he could no longer “be complicit as a shareholder and citizen of the company.”

Ultimately, in response to employee outcry, the project was canceled \[[Link](https://theintercept.com/2018/12/17/google-china-censored-search-engine-2/)].

##### Example 2: Amazon and Climate Change \[[Link](https://www.nytimes.com/2019/04/10/technology/amazon-climate-change-letter.html)]

In 2020, 6,772+ employees at Amazon publicly signed [a letter](https://medium.com/@amazonemployeesclimatejustice/public-letter-to-jeff-bezos-and-the-amazon-board-of-directors-82a8405f5e38) demanding better responses to climate change by Amazon.

* Specifically, they want the company to adopt a shareholder resolution ([link](https://www.scribd.com/document/405804472/Amazon-Climate-Plan-Shareholder-Resolution)) to study how the company will adapt to and reduce its contribution to climate change.

* “Amazon is not a mere victim of climate change—its operations contribute significantly to the problem… Coal still powers Amazon data centers. Diesel, gasoline, and jet fuel still power package delivery.”

* “Amazon has the resources and scale to spark the world’s imagination and redefine what is possible and necessary to address the climate crisis.”

“Like other shareholders, they can file a resolution urging a particular corporate change that investors vote on at a company’s annual meeting.”

#### Time

You get some number of decades on the planet.

Each week is 168 hours.

* \~40 hours of work.

* \~56 hours of sleep. (Anecdotally, most of you will have much more free time after college than you do now)

* \~72 hours for everything else.

Spend your time wisely, in both your career and personal life.

---

## 33.4 Summary

In this fun lecture, we steered a bit away from core CS61B exam material and discussed a high-level overview of the impacts that students can have on society and on their own lives using the skills obtained in CS 61B and beyond.

We covered specific societal impacts in the realm of economics within the context of industry, and social impacts with how humans in our global civilization interact with one another using the digital products that we can create using our coding skills. Most importantly, we delved into the potential *harms* to society that our coding skills could have – from the psychological foundations that could be altered on our youth to the reconfiguration of politics and governmental leaders are elected. 

With great power comes great responsibility, and it is evermore vital that we consider the deep, all-encompassing question of ethics in creating software for humanity. 

With the demand for software engineers and the financial impact that creating software solutions to the worldwide marketplace has, the value added to you as a worker in our society is immense & very fruitful. However, it is important to consider factors beyond just work to create a multifaceted thing called your life. We only work so many hours in the weeks in our lives– so it is incredibly important to ensure that work (and learning CS to become a software engineer, etc.) is just a subpart of what we consider our entire life. Have fun on the journey!

---

## 33.5 Exercises

Note: there are no exercises for this chapter.

For the final exam, there is no need to specifically study this lecture. Any questions relevant to software engineering will be based more on experience with projects than specific terminology and lecture material.


---

## 课程导航与跳转

| 上一讲 | 目录 | 下一讲 | 原视频 |
| :--- | :---: | :--- | :--- |
| [← 上一讲：排序 IV：基于比较排序的理论下界证明](/notes/cs61b/lecture-33) | [📚 返回 CS61B 全书目录](/notes/topics/CS61B) | [下一讲：排序 V：非比较排序与基数排序（LSD / MSD） →](/notes/cs61b/lecture-35) | [🎬 在 B 站观看本讲 (P34)](https://www.bilibili.com/video/BV1hJ4m1M7ZA/?p=34) |
