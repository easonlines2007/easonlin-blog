---
kind: notes
source: cs231n/lec14
title: "CS231n Computer Vision: Generative Model (2): Adversarial Game and
  Diffusion Flow (Lecture 14)"
description: GAN uses a discriminator instead of likelihood, in exchange for
  clear samples but losing the loss curve; diffusion uses dozens of steps of
  denoising to get back the loss; today's pipeline is VAE compression, DiT
  denoising, and GAN finishing.
sourceHash: 85d22eb809662c0af57a24b25324642baac5d57d7df998cfcf895d76c2a1a1ea
publish: true
translationMethod: machine-assisted
---

> **Course information**
>
> - **Course name**: Stanford CS231n: Deep Learning for Computer Vision(Spring 2025)
> - **Topic of this lecture**: Lecture 14. Generative Models 2
> - **Lecturer**: Justin Johnson
> - **Teaching date**: 2025-05-20
> - **Course homepage**: [cs231n.stanford.edu/2025](https://cs231n.stanford.edu/2025/schedule.html)
> - **Official courseware**: [lecture_14.pdf](https://cs231n.stanford.edu/slides/2025/lecture_14.pdf) (123 pages, page-by-page illustrations in the book)
> - **Subtitle source**: [cs231n_sp25_kor_sub · eng](https://github.com/lpaiu-cs/cs231n_sp25_kor_sub/tree/main/eng) (Publicly transcribed in English, Chinese rewritten by this book)
> - **Copyright statement**: The copyright of the slides and course materials belongs to Stanford University and the instructors; this book is an unofficial study note and is only used for study and research.

![Lecture 14 title page: Generative Models (part 2)](</attachments/cs231n-950cc9cae3e2c7d768a7f3c6.png>)

Lecture 13 only goes halfway down the family tree of generative models: autoregressive models whose density can be calculated, and variational autoencoders that can only calculate lower bounds. Both share the same premise - you can write  $p_\theta(x)$  some explicit form of , and then do maximum likelihood on it. This lecture dismantles this premise and looks at the other half: implicit density. This type of model does not hand over any density values ​​and only promises one thing - being able to sample from the learned distribution.

So the question becomes two. First, if even  $p(x)$  Even if you can't figure it out, what exactly is "training" optimizing? GAN's answer is extreme and beautiful: outsource this to a second neural network and let it act as the loss function. Secondly, if GAN is so easy to use, why did the entire field turn to the diffusion model after 2021, and finally everyone stuffed GAN, VAE, and diffusion into the same assembly line? Answer the first question in the first half and the second question in the second half.

## 1. Give up p(x) first: GAN uses a discriminator instead of likelihood

*(Reference time: 00:00:05 – 00:13:54｜Lecture 14)*

![Course Matters Page: Two Due Dates for Assignment 3 and Project Reports](</attachments/cs231n-d341a825bbfb4da901cc7c1a.png>)

The second page only states two things: Assignment 3 is due on May 30th, and the project report is due on June 4th. The position where it appears illustrates the situation of this lecture - the semester is coming to an end, and there is only one lecture left on the generative model line, so the pace is forced to be compressed: GAN takes up the first half hour, and the diffusion model needs to be taught all the way from intuition to industrial pipelines in less than an hour.

![Review page: discriminative model p(y\|x), generative model p(x), conditional generative model p(x\|y)](</attachments/cs231n-f54633ada5ee22e320230f32.png>)

The review only took two sentences, but the point is very accurate: these three models are all probabilistic models, and the difference is not in the network structure, but in **What do you want to predict, what are the conditions, and most importantly - who to normalize to?**. discriminant modeling  $p(y\mid x)$, the label space is very small, and normalization only distributes the probability among several categories; generative model learning  $p(x)$, must satisfy  $\int_X p(x)\,dx=1$, so every possibility appearing in a picture is competing for the same probability mass. The lecturer regarded this sentence as the introduction of the whole lecture: Generating a model is difficult because it must spread the quality throughout the data space, not just draw a decision boundary correctly.

![The family tree I talked about last time: the two branches of explicit density and implicit density](</attachments/cs231n-556c3197d849bfca9b637d81.png>)

This tree diagram is worth remembering the skeleton first. The first level of bifurcation is explicit density (explicit density) and implicit density (implicit density): the former must actually output a  $p(x)$  Or its approximation, which only requires the ability to sample. Explicit density is divided into two branches - the tractable density corresponds to the autoregressive model, and the density can only be approximated (approximate density) corresponds to the strain autoencoder. The implicit density is also divided into two branches - the direct sampling corresponding GAN, which approximates the corresponding diffusion model of the sample through an iterative process. In the previous lecture, we walked the left half, and in this lecture, we walked the right half.

![Autoregressive model: spread the image into a sequence of pixels, and use the chain rule to split it into a product of conditional probabilities](</attachments/cs231n-31b677b3b732c16a8f8b1ab8.png>)

The approach of the autoregressive model is to flatten the data into a sequence, and then perform chain decomposition on the sequence:



$$
p(x)=\prod_{t=1}^{T} p\left(x_t \mid x_1,\dots,x_{t-1}\right)
$$



For images, this "sequence" is the pixel value - the lecturer specifically emphasized that it is usually **Discrete** In the form, each pixel is treated as an 8-bit integer from 0 to 255, so the entire model is a discrete sequence model, and the backbone uses RNN or Transformer. This explains why its likelihood can be calculated and training is stable, and why its reasoning is slow: to generate a graph, the sequence must be completed in order, without any room for parallelism.

![Variational autoencoder: the encoder outputs the mean and covariance of q(z\|x), and the decoder outputs the Gaussian parameters of p(x\|z)](</attachments/cs231n-dd4c3667ad397d7a59b5a2a3.png>)

VAE took a different approach: not counting directly  $p(x)$, but introduce latent variables  $z$, a lower bound for optimization likelihood—that is, the evidence lower bound (ELBO):



$$
\log p_\theta(x)\ \ge\ \mathbb{E}_{z\sim q_\phi(z\mid x)}\left[\log p_\theta(x\mid z)\right]-D_{KL}\left(q_\phi(z\mid x)\,\|\,p(z)\right)
$$



encoder  $q_\phi(z\mid x)=\mathcal{N}(\mu_{z\mid x},\Sigma_{z\mid x})$  Compress a picture into a Gaussian, decoder  $p_\theta(x\mid z)=\mathcal{N}(\mu_{x\mid z},\sigma^2)$  Then restore the latent code into a picture. The two networks are trained jointly, with the goal of making this lower bound as high as possible. The lecturer added a sentence here that ran through the whole scene: **Maximum likelihood is the common obsession behind it all**, no matter how the form changes, the goal of training the generative model is always to make the probability of the observed data under the model as high as possible.

![The second frame of the family tree: the left half is marked Last Time and the right half is marked Today](</attachments/cs231n-5bc29836443db5ea9c3e59e8.png>)

There is an additional set of annotations on the same tree: Last Time is written on the left half, Today is written on the right half, and the GAN and diffusion model are hung on the "direct" and "indirect" leaves respectively. This page is actually the table of contents of this lecture, but it uses a taxonomy instead of a title list - it also predicts one thing: the commonality of the two on the right is that the density cannot be calculated, the difference is "at what cost to obtain the sample".

### 1.1 Implicit density: The density value cannot be handed over, but the sample can be handed over

![Chapter title page: Generative Adversarial Networks (GANs)](</attachments/cs231n-730c43ee0d48ebca49cd5d9e.png>)

A pure title page is inserted here in the slide, officially switching the topic to GAN. The lecturer's exact words are: This is the first implicit density model we will see.

![The first frame of review: Autoregression directly maximizes the likelihood, VAE maximizes a lower bound](</attachments/cs231n-ae1c6ea7f2504e9829134874.png>)

The review page writes the objective functions of the first two models side by side: autoregression directly maximizes the likelihood of the training data, and VAE maximizes the lower bound of the likelihood. What the two have in common is——**There is a written down goal that you can do gradient descent against.**. This sentence is the counterpoint to all the troubles that follow.

![Second frame of previous review: Adding a line, GAN gives up modeling p(x) and only retains sampling capabilities](</attachments/cs231n-c8e74fd6b9ed2d779b7f8b09.png>)

This frame adds a third line at the bottom: Generative adversarial networks give up modeling  $p(x)$, but allows us to start from  $p(x)$  draw samples from. Note the wording - not "approximately" $p(x)$", but "does not model  $p(x)$". There are no readable density values ​​inside the model, there is only a path from noise to data.

### 1.2 Settings: Push z through the generator and hand over "like or not" to the discriminator

![GAN setting page: There are already samples that obey p\_data, and the goal is to be able to sample from p\_data](</attachments/cs231n-62432995f687cc03c88e2ae6.png>)

The setup is simple: I have a batch of samples on hand  $x_i$, assuming they are drawn from some real distribution  $p_{data}$, and we hope to sample from this distribution. Lecturer  $p_{data}$  The description is the most philosophical in the whole room: it is "the distribution that the universe uses to generate data," mixed with physical, historical, and perhaps sociopolitical constraints. The purpose of this sentence is not rhetoric, but to remind you——**you can never get it  $p_{data}$  The analytical formula of**, there is only a limited data set available. By the way, I answered a class question: It is impossible to generate concepts that have never been seen before (such as unicorns), because  $p_{data}$  Defined by the data set you choose; the model can only generalize between similar things you give it.

![The second frame of GAN settings: introduce the latent variable z, and obtain x = G(z) through the generator](</attachments/cs231n-bd026c247e6ba13b4f7bb3ec.png>)

The second frame introduces latent variables  $z$, it obeys a simple prior that we specify and fully understand  $p(z)$- Usually unit Gaussian, since we both sample and know its analytic properties. Then imagine a data generation process: take a  $z$, through a generator network  $x=G(z)$, get  $x$  It obeys the so-called generator distribution  $p_G$. Changing network parameters, changing architecture, and changing training methods will induce different  $p_G$.**The goal of the entire GAN training is only one sentence: let  $p_G$  approaching  $p_{data}$.**

![The third frame of GAN settings: draw the pipeline of sample z, generator G and image generation](</attachments/cs231n-8efdf7c62c9f3922418a8a5e.png>)

The assembly line is added on the screen: from  $p_z$  Sampling gets specific  $z$, feed into the generator  $G$, output a generated image. The instructor defined it as a network that "converts samples of known distribution into samples of data distribution".

![The fourth frame of GAN settings: add discriminator D, input a true image or a false image, and output a true or false judgment.](</attachments/cs231n-48befbc4445d902df7fbb579.png>)

A key frame: there is an extra discriminator network on the right  $D$, input a picture and output whether it is true or false. The generator is responsible for fooling it, and the discriminator is responsible for seeing through it. Why do you need this network? Because in the first two models, we write an objective function ourselves to force  $p_G$  close  $p_{data}$;The approach of GAN is **Hand over this task**, let another neural network learn a criterion of "resemblance or not" by itself.

![The fifth frame of GAN settings: joint training of the two, hoping that p\_G will converge to p\_data](</attachments/cs231n-52714bb98b58d0d991b4d8ff.png>)

The last frame connects the two networks into one system, labeled "joint training" $G$  and  $D$, hope  $p_G$  converge to  $p_{data}$". Here is a class question: Can the generator get feedback from the discriminator? The answer is yes, and that's exactly why the whole mechanism works - the feedback is in the form of gradients. $G$  and  $D$  They are all just neural networks. When combined, they are still a differentiable system. The gradient can be propagated all the way back from the output of the discriminator, through the generated image, and back to the parameters of the generator. **The only supervision signal of the generator is the gradient chain passing through the discriminator**;Except for the regularization term, there is no auxiliary loss that directly tells it what to generate.

```mermaid
flowchart TD
    Z["z ~ p(z)：Unit Gauss"] --> G["generator G"]
    G --> XF["fake sample x = G(z)"]
    XR["real sample x ~ p_data"] --> D["discriminator D"]
    XF --> D
    D --> V["target V(G,D)"]
    V -->|"Gradient Ascent: Let D judge more accurately"| D
    V -->|"Gradient back propagation through generated image"| G
```

There are two loops in this picture worth keeping an eye on: one that makes the discriminator become stronger on its own, and the other that forces the generator to become stronger. Both loops share the same scalar  $V$, which is the source of all subsequent training difficulties.

### 1.3 minimax: a scalar, two directions

![The minimax objective function appears for the first time: min over G, max over D](</attachments/cs231n-9ddb2b5e923dd604ca5abc29.png>)

The objective function is written as a minimax game:



$$
\min_G \max_D\ \mathbb{E}_{x\sim p_{data}}\left[\log D(x)\right]+\mathbb{E}_{z\sim p(z)}\left[\log\left(1-D(G(z))\right)\right]
$$



The lecturer breaks it down by color: blue belongs to the generator and red belongs to the discriminator.

![The second frame of the objective function: the semantics of D(x) are marked, 0 is false, 1 is true](</attachments/cs231n-74bc2524b7079ba068048dfb.png>)

Define first  $D$  The output meaning of: $D(x)=P(x\ \text{is real})$, the value 0 means it is judged as false, and 1 means it is judged as true; in actual training, it outputs a soft probability between 0 and 1. With this semantics, the two terms in the logarithm are meaningful.

![The third frame of the objective function: fixing G, looking at two respective demands from the perspective of the discriminator](</attachments/cs231n-78392855c4331578596a7c27.png>)

Fixed  $G$, just watch  $D$: The item on the left requires true data  $D(x)=1$, the item on the right requires false data  $D(G(z))=0$. because  $\log$  monotonic, maximizing  $\log D(x)$  Equivalent to maximizing  $D(x)$; but want to  $D(G(z))$  is close to 0, it is necessary to maximize  $\log(1-D(G(z)))$. So the whole  $\max_D$  It is a standard true and false two-category target——**The problem that the discriminator solves is not essentially different from any image classifier.**, except that half of the data set comes from real data and half from the generator.

![The fourth frame of the objective function: fixed D, from the perspective of the generator, the left term has nothing to do with G](</attachments/cs231n-322188edb7e5d4a9a854f215.png>)

Switch to generator perspective, fixed  $D$: The item on the left only involves real data, and  $G$  It's completely irrelevant and can be crossed out directly. The generator only cares about the right side, and its appeal is opposite to the discriminator - it hopes that the false data will be judged to be true, that is, it hopes that  $D(G(z))=1$. So the same  $\log(1-D(G(z)))$, the discriminator should be maximized and the generator should be minimized. This is the full meaning of the word "confrontation".

![The fifth frame of the objective function: abstracted into a V(G,D) scalar, and alternately perform gradient ascent and descent.](</attachments/cs231n-3178acdd3ff05b4544f4feef.png>)

Pack four items into a scalar  $V(G,D)$, the game can be written as  $\min_G \max_D V(G,D)$. The optimization method is to alternately update: the discriminator does gradient ascent, and the generator does gradient descent.

![The sixth frame of the objective function: gives the alternating update pseudocode of while True](</attachments/cs231n-3362eb26a25d7f6c72ae3fa3.png>)

The skeleton code is given on the page:

```python
while True:
    D = D + alpha * dV_dD      # 判别器梯度上升，想把 V 做大
    G = G - alpha * dV_dG      # 生成器梯度下降，想把 V 做小
```

Note that the two rows have opposite signs: the discriminator is  `+`, the generator is  `-`. The instructor calls this structure "all of GAN training" - there are no other loss items, no other auxiliary goals, just these two lines are executed alternately in an infinite loop. Precisely because there are only these two lines, all subsequent complaints about "GAN being difficult to train" are not implementation details, but the nature of the game itself.

## 2. V is not a loss: The theoretical optimality of GAN is beautiful, but it neither guarantees convergence nor tells you the progress.

*(Reference time: 00:14:05 – 00:30:44｜Lecture 14)*

### 2.1 There is no loss curve to see. This is the nature of the objective function rather than an implementation problem.

![The last frame of the objective function: red mark "We are not minimizing any overall loss!"](</attachments/cs231n-b48ee0a2b4906e9aa8c9da65.png>)

There is only one sentence in red on this page, but it is the most important sentence in the entire lecture: **We are not minimizing any total loss, so there is no training curve to see**. The reason is  $V$  The absolute value of is uninformative - it depends on both the generator and the discriminator level. If the discriminator is weak, the generator can get good-looking numbers by just cheating; if the discriminator is strong, the generator must be stronger to get the same number. different  $(G,D)$  The combination can give exactly the same  $V$, so stare at  $V$  Unable to judge  $p_G$  Is it approaching?  $p_{data}$.

The lecturer responded casually, "Then draw two curves and look at them separately.  $G$  and  $D$  OK or not?": You can draw, but it's usually useless. He mentioned that there are hundreds of papers behind this that have tried to change the target, remove  $\log$, replaced by a distance like Wasserstein, five years, and thousands of people’s investment, in the end everyone still used this simplest writing method during training.

![Early training: The generator output is close to random noise, and D(G(z)) is close to 0](</attachments/cs231n-5f3c58bee4a6ad34f011a094.png>)

Spread out training dynamics. At the beginning, the generator is randomly initialized, and the output is basically noise. The discriminator only needs a few rounds of iterations to separate the true from the false, so  $D(G(z))\approx 0$- The discriminator says "this is false" with almost certainty.

![Problem page: The gradient on the generator side is close to 0](</attachments/cs231n-a1d2442f1e0ec0e5104e1b7d.png>)

Herein lies the trouble. What the generator wants to minimize is  $\log(1-D(G(z)))$, and when  $D(G(z))\to 0$  When , this curve is near the origin **almost flat**. The gradient is close to zero, which means that the generator learns almost nothing in the early stages of training: it is indeed doing gradient descent, but each step is small enough to be ignored.

![Patch page: The generator is changed to minimize -log D(G(z)), the discriminator still maximizes log(1-D(G(z)))](</attachments/cs231n-df6493de7f6fd4ed5802f760.png>)

The patch is just one line: change the generator's goal from minimizing  $\log(1-D(G(z)))$  Change to minimize  $-\log D(G(z))$. Both in "hope" $D(G(z))$  get bigger", but the latter is  $D(G(z))\to 0$  The gradient is steep - the more confident the discriminator is in telling falsehoods, the more push the generator gets. The cost is that the generator and discriminator **The optimized ones are no longer the same  $V$** : The discriminator is still maximizing  $\log(1-D(G(z)))$, the generator minimizes another quantity. The lecturer said that this change is extremely important in practice when training GAN from scratch; he also admitted incidentally that this is the specific manifestation of "no uniform loss".

### 2.2 Theoretical optimal: $D^*$  It can be written, but it can never be calculated.

![Question page: Why is this a good objective function?](</attachments/cs231n-39e248bf2a6d82a6d82c4b16.png>)

The next question is: Is this goal mathematically good? The lecturer said that he used to have slides to walk through this proof step by step, but he didn’t have time today, so he only gave the conclusion.

![Optimal discriminator: D\*(x) = p\_data(x) / (p\_data(x) + p\_G(x))](</attachments/cs231n-229435485e2cbab0df46a751.png>)

Put the inner layer  $\max_D$  Solved, for any fixed  $p_G$, the optimal discriminator is



$$
D^*(x)=\frac{p_{data}(x)}{p_{data}(x)+p_G(x)}
$$



The meaning of this formula can be read in one sentence: **At a certain point, the probability of the "true" output by the discriminator is proportional to the relative size of the real density and the generated density at that point.**. If  $p_G=p_{data}$, then  $D^*(x)=1/2$——The discriminator cannot tell the difference at all and can only guess blindly.

The lecturer pointed out an embarrassing point: this formula is beautiful when written on paper, but you can never calculate it because it requires  $p_{data}$  density; whereas if you have  $p_{data}$  density, this has been done long ago.

![Outer goal: minimized if and only if p\_G = p\_data](</attachments/cs231n-8bfd040b9d8e8ab92984dc95.png>)

put  $D^*$  Substituting back to the outer layer, it can be proved that the outer layer target is and only in  $p_G=p_{data}$  When the minimum value is obtained. That is to say, theoretically there is a unique equilibrium point: the generator perfectly reproduces the data distribution, and the discriminator degrades to 1/2. This is the entire theoretical basis for GAN to make people think "this thing should be possible".

![caveats page: two limitations - fixed capacity cannot represent the optimal solution; convergence is not discussed under limited data](</attachments/cs231n-f251af2ec00149ad75fee48b.png>)

The next two caveats discount the beauty above. First, derive the hypothesis  $G$  and  $D$  All have unlimited capacity and can represent any function, while real networks have fixed size and fixed capacity. Second, this conclusion only explains "where the best point is" and does not explain at all "where gradient descent plus gradient ascent can go", especially on limited data. The lecturer's original words are: This gives us a little theoretical comfort, but it is neither strong nor tenable in practice.

There are two follow-up questions in class that are worth remembering. Ask "Does it matter if the discriminator learns too well in the early stages of training?" - It doesn't matter, because this is not an ordinary classification problem: the data set of an ordinary classifier is fixed, and the "data set" here is created by the generator and will continue to change with training, so the entire optimization is **non-stationary** of. Asking "Will it be stuck in a local minimum and can it be kicked out?" - the same hundreds of papers and a bunch of heuristics, none of which really stayed.

### 2.3 Latent space smoothing is an unexpected gift of GAN, but it is not inevitable

![DC-GAN: both the generator and the discriminator are five-layer convolutional networks](</attachments/cs231n-f19faebbb67653e2011249e4.png>)

Back to engineering. $G$  and  $D$  They are all neural networks, and historically they have all been CNNs - the lecturer added: GAN had fallen out of favor before ViT became popular, otherwise ViT would most likely have been used. What really made GAN run smoothly on non-toy data was DC-GAN (Radford et al., ICLR 2016), a five-layer convolutional network that gave quite amazing samples at that time.

![Two additional screenshots of papers on the same page: GPT-1 (2018) and GPT-2 (2019)](</attachments/cs231n-d45a34ca70b4d164c4c0ebb3.png>)

This frame has two paper homepages posted on the right side. It is a joke by the lecturer and a character footnote: Alec Radford, a work of DC-GAN, followed up by making GPT-1 and GPT-2. The lecturer connected a clue from this - the people who did image generation later jumped to discrete text generation, and did the most important work there; **"Modeling a distribution" is the same thing for pixels and tokens**.

![StyleGAN: Injecting style and noise with adaptive normalization AdaIN](</attachments/cs231n-f0da44271b87c406b087ff6b.png>)

The only other article to be singled out by name is StyleGAN. The lecturer did not go into details and only gave one suggestion: if you want to learn the best practices of GAN, read it. Its core is to  $z$  First, the mapping network becomes  $w$, and then use AdaIN at each layer to  $w$  Becomes a set of zooms and translations:



$$
\mathrm{AdaIN}(x,w,b)_i=w_i\,\frac{x_i-\mu(x)}{\sigma(x)}+b_i
$$



Pay attention here  $w_i$  and  $b_i$  with  $x$  Same shape - that is, each layer and each channel has its own scaling and translation, all decoupled from that  $w$  Forecast. Noise is injected from another branch on a pixel-by-pixel basis to control the randomness of details.

![Latent space interpolation: linear interpolation between z0 and z1, point by point through the generator](</attachments/cs231n-ae47e49b7578cb5af1a24090.png>)

A very pleasing property of GANs is that the latent space is usually **Smooth** of. Take two latent vectors  $z_0,z_1$, interpolate between them



$$
z_t=t\,z_0+(1-t)\,z_1,\qquad x_t=G(z_t)
$$



By passing every point along the entire path through the generator, the resulting images will evolve smoothly into each other instead of jumping around.

![Interpolation example in the StyleGAN3 paper: animals continuously deform between frames](</attachments/cs231n-790c2548861a6d513c7ef235.png>)

This page uses an example of StyleGAN3 (Alias-Free GAN): all the way  $z$  Smooth changes, and the animals in the picture will also deform smoothly. The lecturer's interpretation of it is that the model spontaneously organizes some useful structure in the latent space. But he immediately added a counterexample to prevent you from taking this as inevitable: the generator can completely ignore  $z$, only remember the ten pictures in the training set, no matter what  $z$  Everyone vomited one of them. This can also fool the discriminator (the output is the same as the real sample bit by bit), and is a legal solution under this objective function - it is equivalent to stacking several Dirac peaks near a dozen samples, and the probability in the rest of the places is zero. **This solution will not have any smooth latent space.**

![GAN summary page: two advantages and three disadvantages. The mainstream status from 2016 to 2021 is marked below.](</attachments/cs231n-4efec8097d8d938765ed77cf.png>)

The summary page counts the accounts clearly. Advantages: The form is simple; after adjustment, it can produce excellent images (the resolution and texture of the StyleGAN series are evidence of this). Disadvantages: There is no loss curve to see; training is unstable and crashes at any time - mode collapse, NaN/Inf suddenly appears, the discriminator goes crazy, the generator starts outputting pure noise, and you have no curve to diagnose; it is difficult to scale to the scale of truly large models and big data. The sentence in the footer is historical positioning: **From about 2016 to 2021, GAN is the first choice for generative models**.

There are two more class questions and answers worth staying for. Ask "What did we replace?" - VAE replaced latent vectors but the samples were blurry, GAN replaced them with clear samples but lost controllable latent vectors. Ask "What to do with the discriminator during inference" - just throw it away and pick one  $z$  After passing through the generator once, the picture will be produced. **The inference cost is a forward**, this is the only hard advantage of GAN that is still remembered today.

## 3. Diffusion rewrites generation into a path from noise back to data, with only six lines of core code

*(Reference time: 00:30:50 – 00:45:11｜Lecture 14)*

![Chapter title page: Diffusion Models and five founding papers](</attachments/cs231n-1c310d63544de3f8d0cf27ef.png>)

What pushed GAN down from the altar was another type of model. This page lists five papers, which is a timeline in itself: Sohl-Dickstein et al. (2015) proposed using non-equilibrium thermodynamics for deep unsupervised learning; Song & Ermon (NeurIPS 2019) used estimated data distribution gradients for generation; Ho et al.'s DDPM (NeurIPS 2020) made it really useful; Song et al.'s SDE framework (ICLR 2021) and DDIM (ICLR) 2021) give a continuous-time perspective and faster deterministic sampling respectively.

![Warning page: The terminology and notation in this field is a mess](</attachments/cs231n-3134b8de0d72a2549900a9f5.png>)

The lecturer takes the vaccination first: **The terminology and notation for this direction is very confusing**, different papers use different symbols to refer to the same thing, and some papers require five pages of mathematics to tell you what it is doing. Therefore, this lecture does not seek to cover all variants, but only talks about a modern and clean implementation-Rectified Flow. He also stated a position in advance: Some people think that Rectified Flow is not a diffusion model, but he doesn't care. "To me, it is a kind of diffusion."

### 3.1 Intuition: First add noise until it is completely messy, and then learn to erase it bit by bit.

![Intuition first frame: choose a noise distribution, usually unit Gaussian](</attachments/cs231n-722816e96725077225533dc1.png>)

The first hard constraint on the diffusion model is hidden in the details: the noise distribution  $z\sim p_{noise}$  Usually taken as unit Gaussian, and **Must have the same shape as the data**. If your picture is  $H\times W\times 3$, then the noise must also be  $H\times W\times 3$——This is much lower-dimensional than the one in GAN  $z$  Completely different, the source of all "slowness" later lies here.

![Intuition second frame: t=0 no noise, t=1 full noise, in the middle are x\_t with different degrees of damage](</attachments/cs231n-232455a11afe7dadfd3ff035.png>)

Introducing noise levels  $t\in[0,1]$: $t=0$  represents clean data, $t=1$  Represents pure noise, and the middle is obtained by mixing the noise into the data in proportion.  $x_t$. So the same piece of data becomes a family of samples from this perspective, with a continuous transition from clear to completely blurry.

![The third frame of intuition: train the network f\_θ(x\_t, t) to remove a little noise](</attachments/cs231n-c8fa5c1a765771d7cc4603eb.png>)

Training goal: Give the network a noisy image  $x_t$  and noise level  $t$, let it **Just remove a little bit of noise**. Note that it is "a little bit", not "restore to the original image" - this is the difference between diffusion and autoencoders.

![The fourth frame of intuition: starting from pure noise during reasoning, repeatedly calling f\_θ](</attachments/cs231n-8ba87d46daf24d68c22fc2fc.png>)

Reasoning is an iterative process: start with  $p_{noise}$  Take a picture of pure noise  $x_1$, feed it to the network, and it is forced to "see" a little bit of the data structure in this pure noise; get back a slightly cleaner picture, feed it in again, and go a little bit more... Repeat it enough times, and you'll get there  $x_0$. The lecturer's evaluation of this setting was very frank: "This is a very strange setting, but this is the intuition of diffusion."

As for whether the number of steps is a fixed hyperparameter, how to specifically add noise, and how much to remove in one step - this page is deliberately vague, because different formalizations give different answers, and it will be nailed down in the next section.

### 3.2 Rectified Flow: the straight line from data to noise

![Geometric picture: p\_noise and p\_data two clouds, both drawn on a two-dimensional plane](</attachments/cs231n-7b4a753608b400f919af04ce.png>)

In order to make the vague statement above concrete, the lecturer switched to geometric language: draw two distributions, the blue one is  $p_{noise}$, the red one is  $p_{data}$. He also reminded of the dangers of this drawing method - the intuition that is established in two-dimensional space often completely fails in one thousand dimensions, but there is no way, there is only two dimensions on the slide.

![The first step of training: sampling z, x and t in each round](</attachments/cs231n-b79ab70ce29f4475b0b0b3d0.png>)

Each training iteration takes three things: $z\sim p_{noise}$, $x\sim p_{data}$ (That is, extract a picture from the training set), $t\sim\mathrm{Uniform}(0,1)$. The blue dot on the picture is  $z$, the red dot is  $x$.

![The second step of training: take the interpolation point x\_t between x and z, and define the speed v = z - x](</attachments/cs231n-2c5f9acb8a00f20356100777.png>)

Then do two things. First, in  $x$  Arrive  $z$  Take an interpolation point on the connection line of



$$
x_t=(1-t)\,x+t\,z
$$



Second, define the direction of this connection as the speed  $v=z-x$.$t=0$  time  $x_t=x$, $t=1$  time  $x_t=z$, so  $t$  It is indeed the ratio from data to noise.

![The third step of training: let the network predict v, the loss is L2](</attachments/cs231n-ffac7615b71bc8c471f934f5.png>)

The training goal is to let the network watch  $x_t$  and  $t$, predict that velocity vector:



$$
L=\left\|f_\theta(x_t,t)-v\right\|_2^2
$$



The lecturer emphasized: **That's all**. There is no confrontation, no lower bound, and no importance sampling. It is a regression problem.

![Training code page: six lines of PyTorch](</attachments/cs231n-52626984ebfe993fdfcf2188.png>)

The complete implementation is given on the page:

```python
for x in dataset:
    z = torch.randn_like(x)          # 与 x 同形状的单位高斯
    t = random.uniform(0, 1)         # 噪声等级
    xt = (1 - t) * x + t * z         # 直线插值
    v = model(xt, t)                 # 网络预测速度
    loss = (z - x - v).square().sum()  # 目标速度就是 z - x
```

The lecturer made a very valuable comment here: The distance between the obscurity read in the paper and the code needed to actually run it is astonishingly large——**The core training cycle is these six lines**. He also compared the situation of GAN: when training the diffusion model, you have a visible loss curve. As the loss decreases, the model generally gets better; and for those who have experienced the "GAN crazy era", seeing this smooth declining curve for the first time is a touching experience.

### 3.3 Sampling: Take 50 small steps along the predicted speed

![Sampling the first frame: first determine the number of steps T, usually 50](</attachments/cs231n-b3e85d9bc81bff7912d1dc1d.png>)

The inference side is more complex than training, which is the only obvious disadvantage of diffusion relative to GAN. The first thing is to determine the number of steps  $T$, Rectified Flow is usually set to 50; the instructor said that 30 is barely usable.

![Sample the second frame: take an x1 from the noise distribution](</attachments/cs231n-b6295d4f2f480676d6e87408.png>)

from  $p_{noise}$  pick one  $x_1$, which is total noise.

![Sampling the third frame: loop from t=1 to 0, first evaluate v\_t at each step](</attachments/cs231n-17cedc9a27181872ff695374.png>)

Loop from  $t=1$  Decrease to  $0$, step size  $1/T$. At each step, the network is first used to evaluate the speed of the current point.  $v_t=f_\theta(x_t,t)$. The key understanding here is: **network predicted  $v_t$  You will not be sent directly to a clean sample**, it only indicates direction.

![Sample the fourth frame: take a small step in the -v\_t direction to get x\_{2/3}](</attachments/cs231n-4c3a9894596edfde38ecdc64.png>)

So do a step update



$$
x \leftarrow x-\frac{v_t}{T}
$$



because  $v$  The direction is "from data to noise", so we have to go in the opposite direction. The position after the first step is marked on the map.  $x_{2/3}$ (used here  $T=3$  demonstration).

![Sample the fifth frame: evaluate again at x\_{2/3} to get a new v\_{2/3}](</attachments/cs231n-a0ea9c18112a2b84a3ffe296.png>)

Ask the network again at the new location and get  $v_{2/3}$. Pay attention to this step  $v$  Different from the previous step——**The velocity field is a function of position and time, and must be asked again every step**.

![Sample the sixth frame: take another step to x\_{1/3}](</attachments/cs231n-5aa549375f8f0a9ff081ab24.png>)

Continue taking a small step in the new direction and drop to  $x_{1/3}$. At this point the path has clearly shifted towards the red cloud.

![Sampling the seventh frame: the last step falls to x\_0 and marks v\_{1/3}](</attachments/cs231n-f0fe048e5b3e503fe5b36c00.png>)

The last step comes  $x_0$, it has fallen on  $p_{data}$  in the clouds. $x_0$  It is the output sample of the model.

![Sampling eighth frame: complete trajectory, two velocity vectors and four positions are visible simultaneously](</attachments/cs231n-27f90290d5a031dc4a291f6a.png>)

This frame combines the entire trajectory into one picture: $x_1\to x_{2/3}\to x_{1/3}\to x_0$, as well as two evaluations along the way  $v_{2/3}$, $v_{1/3}$. You can see that the trajectory is not a straight line but a polyline - each step is redirected using the local velocity of the current point, which is exactly what "numerical integration" looks like.

![Sampling the ninth frame: Adding Return x, the algorithm description is complete](</attachments/cs231n-47f4e6c61611033b267a28a1.png>)

The algorithm adds the last line  `Return x`. The number "50 moves" now has a concrete meaning: **50 network forwards**, instead of 1 time for GAN.

![Sampling the tenth frame: circle the final sample x\_0 on the right, and fill in the PyTorch sampling code on the lower left](</attachments/cs231n-5fe65e0bce0ec15091c85bf0.png>)

This frame adds two things:  $x_0$  Mark it with a yellow circle (emphasis that it is the deliverable), and the complete sample code:

```python
sample = torch.randn(x_shape)
for t in torch.linspace(1, 0, num_steps):
    v = model(sample, t)
    sample = sample - v / num_steps
```

If you compare it with the training code, you will find a beautiful fact: **Sampling is to use the speed predicted by the model to do gradient descent.**, but the step length is  $1/T$, the goal is to reach  $t=0$. Putting training and sampling on one page makes "diffusion models less intimidating," the instructor said.

![Summary page: training process and sampling process side by side on the same geometric diagram](</attachments/cs231n-5d6c4031f06831d9f38f95b2.png>)

This page juxtaposes training and sampling: training is done from real pairings  $(x,z)$  A velocity field is learned here, and sampling is started from pure noise and integrated along this velocity field. The two pictures are on the same set of distributions so that you can see clearly that they share the same geometric object.

### 3.4 Common difficulty in generating models: z and x are never paired

After finishing the sampling process, the lecturer stopped and said the most abstract and valuable words in the lecture.

He said the really difficult question is: **You have a bunch of things you can sample  $z$, there are also a bunch of things you want to generate  $x$, but you never know which  $z$  Which one should correspond to  $x$**. All generative models work around this dead end - VAE allows the model to predict a  $z$  Re-forecast  $x$, and then force  $z$  Pull it into a distribution that can be sampled (the effect is average); GAN simply does not supervise this relationship, allowing the generator to grow a mapping by itself in the feedforward process, and the discriminator only checks at the distribution level; diffusion turns it into an integral of the curve, using "local direction at each point" to bypass the global pairing. If the pairings had been known from the beginning, this would have been over a long time ago.

This passage explains why each subsequent section is changing the details rather than changing the framework: **The degree of freedom at the framework level is actually only "how to approximate the distribution without pairing"**.

## 4. When the condition signal is too weak, CFG uses the difference between the two velocity vectors to amplify it

*(Reference time: 00:45:19 – 00:52:16｜Lecture 14)*

### 4.1 Conditional Rectified Flow: treat y as an additional input

![Conditional Rectified Flow first frame: both training and sampling codes are still gray, and the data cloud on the right is split into two sub-distributions](</attachments/cs231n-af6fb196585e1b691169b095.png>)

As mentioned in the previous lecture, unconditional generation is basically meaningless. What we really care about is conditional generation. This page first lays out the picture: $p_{data}$  It is not a whole. It is made up of several sub-distributions. For example, "square" and "triangle" are each a group, and they are marked on the picture.  $p_{data}(x\mid y=\blacktriangle)$  with  $p_{data}(x\mid y=\blacksquare)$. At this time, both pieces of code are pressed into gray, which means to first see clearly what the problem looks like.

![Condition Rectified Flow Second frame: The Training section is lit, (x, y) and model(xt, y, t) are marked by red boxes](</attachments/cs231n-5d88a6738266e65b097f1d02.png>)

There are only two changes, both of which are enclosed by red boxes: the iteration object of the data set changes from  `x`  become  `(x, y)`, the model is called from  `model(xt, t)`  become  `model(xt, y, t)`. That is to say, **A condition is nothing more than an additional auxiliary input**, the training objectives (prediction speed, L2 loss) have not changed a word.

![Condition Rectified Flow Frame 3: The Sampling section is lit, y = user\_input() and model(sample, y, t) are framed](</attachments/cs231n-3458282cf62b747517fd2d56.png>)

The sampling end also only adds one thing: `y = user_input()`. This line may seem like nonsense, but it is actually the key point of the entire paragraph——**$y$  From data labels during training to signals that users can control during inference**. It can be a text prompt, an input image, or anything you get during inference. Conditional generation is useful because it hands over control.

![Condition Rectified Flow Frame 4: The green text asks "Can the emphasis on y be controlled?"](</attachments/cs231n-e1db391ad11eee3b10e1f173.png>)

But a new question pops up here, written in green in the middle of the page: Can the model be controlled? **Listen more** Conditions  $y$? The lecturer said that if trained simply like this, the model is often not obedient enough - the generated pictures do not match the prompt words. This leads to the protagonist of the next eleven pages.

### 4.2 CFG: Randomly discard y during training, and subtract two vectors during sampling

![CFG first frame: insert in the training loop if random.random() \< 0.5: y = y\_null](</attachments/cs231n-22c793dd77098f950b7a70c2.png>)

Classifier-less bootstrapping (CFG) only changes the training loop in one line:

```python
if random.random() < 0.5:
    y = y_null      # 以 50% 概率抹掉条件信息
```

The lecturer said that 50% is a super parameter, but in practice everyone basically uses 50. The effect of this line is: **The same model learned both conditional and unconditional modes at the same time**. give it real  $y$, which does conditional generation; give it  `y_null`, it degenerates into an unconditional diffusion model.

![CFG second frame: Noisy x\_t is drawn on the right side, as well as two sub-distributions](</attachments/cs231n-6128ab8464dcf5e434ef5769.png>)

Why does this control the emphasis? Look at the picture first: take a noisy one  $x_t$, it may come from any sub-distribution, or it may be mixed by noise.

![CFG third frame: v∅ points to the body of the entire p\_data](</attachments/cs231n-c5792290223eb3e236e62655.png>)

put  `y_null`  Feed it in and the model gives  $v_\varnothing=f_\theta(x_t,y_\varnothing,t)$. This vector points to **The entire data distribution  $p(x)$ "center of gravity"**——Because it has never seen the conditions, it can only go in the average direction of all data.

![CFG fourth frame: v\_y points to the conditional subdistribution](</attachments/cs231n-958d80f9d8c5acc0dcb92df4.png>)

Replace it with real conditions  $y$, the model gives  $v_y=f_\theta(x_t,y,t)$. This vector points to **The subdistribution corresponding to that condition**, that is, the group of squares.

![CFG fifth frame: v\_cfg is a linear combination of two vectors, pointing in a more conditional direction](</attachments/cs231n-a474ef758a2e53f7a7e2155d.png>)

Now that we have two directions, we can do a little linear algebra:



$$
v_{cfg}=(1+w)\,v_y-w\,v_\varnothing
$$



put  $v_\varnothing$  from  $v_y$  subtract from , equal to **Deduct the common component of "the average trend of all data"**, the remaining part all returns to the condition; then multiply by  $(1+w)$  Amplify it. The result is a ratio  $v_y$  A vector that points to the conditional distribution more biasedly and "forcefully".

![CFG sixth frame: When sampling, follow v\_cfg instead of the original output of the model.](</attachments/cs231n-7454d22f69a2bc0226fae9ef.png>)

Use this when sampling  $v_{cfg}$  Use it as speed. Note  $w=0$  When the formula degenerates into  $v_y$, that is, returning to pure conditional generation; $w$  The larger it is, the more strongly the condition is emphasized.

![CFG Frame 7: The screen cuts to Sampling, and the training half fades to gray.](</attachments/cs231n-283b0e653b5f40ab91c314ae.png>)

This frame switches the emphasis to the sampling side, preparing to show the modified sampling code.

![CFG Frame 8: The model is called twice in the sampling loop, once with y and once with y\_null](</attachments/cs231n-dda91facdbb41a7350f56879.png>)

The code becomes:

```python
for t in torch.linspace(1, 0, num_steps):
    vy = model(sample, y, t)
    v0 = model(sample, y_null, t)
    v  = (1 + w) * vy - w * v0
    sample = sample - v / num_steps
```

Here is an account that must be remembered: **Each iteration requires one more forward run.**. Sampling costs double directly.

![CFG Frame 9: Explain the origin of the name "classifier-free"](</attachments/cs231n-5144c0f019e6e151b273c250.png>)

The lecturer explained the origin of the name and made it clear that the naming was stupid. "No classifier" is relative to the earlier classifier guidance (Dhariwal & Nichol): that type of method additionally trains a discriminant  $p(y\mid x)$, correct it when sampling  $x$  the gradient of  $\partial\log p(y\mid x)/\partial x$  Add to speed. CFG does essentially the same thing, but removes the classifier - using the same generative model in  `y_null`  The output below replaces the role of the classifier. The two papers were only nine months apart, but their names remain to this day.

![CFG Frame 10: Annotation "Used everywhere in practice, extremely important for high-quality output"](</attachments/cs231n-eb9df90a548f1ca85cad6c00.png>)

The lecturer's evaluation of it was unambiguous: This is the most important trick in practice and is used by almost all high-quality diffusion models.

![CFG Frame 11: Marked "The price is doubling the sampling cost"](</attachments/cs231n-c082e81ef20419c64eb6696a.png>)

The cost is also written on the same page: sampling costs double. This explains why distillation is important later - CFG makes each step twice as expensive, distillation makes the number of steps an order of magnitude smaller, and the two just cancel each other out.

### 4.3 The skipped section: What exactly is the optimal prediction predicting?

![Optimal prediction of the first frame: Propose "What is the optimal prediction of the network?"](</attachments/cs231n-f37524922bd5aa30b8c16327.png>)

Next are seven pages of "Optimal Prediction". The lecturer only spent more than ten seconds on this page: "I skipped the optimal prediction section, not because it was not interesting, but because I was afraid of not having enough time." But when he talked about noise scheduling, he went through the conclusion of this section again - because without explaining "why the middle is the hardest", he couldn't explain why it was necessary to change  $t$  distribution. So the content of these seven pages was not lost, it was just squeezed into the opening of the next section.

![Optimal prediction of the second frame: the same x\_t may be obtained by many pairs (x, z), and the network can only average them](</attachments/cs231n-9212209f9862d89333f8f17d.png>)

The question itself is: given  $x_t$  and  $t$, network **optimal** What is the output? Half of the answer is given on the page - due to  $x_t=(1-t)x+tz$  is a many-to-one mapping, the same  $x_t$  May correspond to many groups  $(x,z)$, while the network can only see  $x_t$. Under square loss, the optimal prediction is the conditional expectation of these possibilities, that is **average them**.

![Optimal prediction of the third frame: when t=1, the optimal v points to the mean of p\_data](</attachments/cs231n-7b26d3bed0900795ff9fdc36.png>)

Extreme situations are easy to analyze. $t=1$  time  $x_t=z$  is pure noise, which does not contain anything about  $x$  information, the optimal prediction at this time is  $p_{data}$  direction of the mean - the average of all answers.

![Optimal prediction of the fourth frame: when t=0, the optimal v points to the mean of p\_noise](</attachments/cs231n-2613152328f00df00d17830b.png>)

symmetrically, $t=0$  time  $x_t=x$  is clean data, the noise is completely unknown, and the optimal prediction is  $p_{noise}$  direction of the mean. Only two constant vectors need to be learned at both ends.

![The fifth frame of optimal prediction: the middle noise is the most difficult and blurry](</attachments/cs231n-9c7b972e83c0fd587ae33f45.png>)

The real difficulty is in the middle. $t$  When near 0.5, $x_t$  There is both structure and noise in it. What can explain it?  $(x,z)$  There are so many combinations, and the conditional expectation is to average them all out, and the resulting direction is often a "fuzzy compromise."

![Optimal prediction for frame six: but we give all noise levels the same weight](</attachments/cs231n-24c7f3bc7b98cbc25e84e354.png>)

Herein lies the paradox: uniform sampling  $t$  means **The easy samples at both ends have the same weight as the difficult samples in the middle.**. A lot of training computing power is spent on "learning two constant vectors".

![Optimal prediction of the seventh frame: the solution is to switch to non-uniform noise scheduling](</attachments/cs231n-6888b3856f8ff99ee098ced6.png>)

The solution direction is logical: put  $p(t)$  Change it to non-uniform and weight it towards the middle. This just segues into the next section.

### 4.4 Noise Scheduling: The middle is the most difficult, so you should practice more in the middle

![Noise scheduling page: Draw the p(t) curve and label "Put more weight on the intermediate noise"](</attachments/cs231n-415d7e94a0f1229441f29836.png>)

This page turns the conclusion of the previous section into a curve: the horizontal axis  $t$, vertical axis  $p(t)$, the shape is a bulge with a high middle and low ends.

![Second frame of noise scheduling: added "A common choice is logit-normal sampling"](</attachments/cs231n-13a94471bbed7beca0d03163.png>)

The specific form is called logit-normal sampling - first sample a normal distribution, and then apply logit transformation to  $(0,1)$, the resulting density is exactly this shape with low ends and high middle.

![The third frame of noise scheduling: high-resolution data needs to shift the distribution to the high-noise side](</attachments/cs231n-ec34e1c1bc852b89845ccdff.png>)

There is also a type called shifted scheduling, which has an asymmetric shape and is generally biased towards the noisier side. The reason is resolution: the correlation between adjacent pixels in high-resolution images is very strong, and to truly destroy the information, greater noise is needed; the correlation between low-resolution images is weak, and the same noise is excessive. The lecturer came to a very important judgment from this——**This set of things will not automatically adapt to the resolution**.

![Rectified Flow overview page: All elements of training and sampling are rearranged, with key points on noise scheduling.](</attachments/cs231n-364535f1ed0b4410d17536ff.png>)

This page displays the complete settings of Rectified Flow in one picture: sampling and regression on the training side, iterative integration on the sampling side, plus the information on the right  $p(t)$  Three lessons learned. The instructor's comment is: This is a simple and scalable setting that can be applied to many generative modeling problems.

![Added red question to the same page: This set of settings does not work naively on high-resolution data](</attachments/cs231n-46b6e6807ce2af42dcf08bc5.png>)

The red text added immediately is its weakness: running directly in pixel space and high resolution will not produce good results. This "badness" cannot be smoothed out by fine-tuning noise scheduling. It directly gave rise to the next section - which is also the actual form of almost all image generation systems today.

## 5. Modern pipelines do not run diffusion on pixels: VAE pressure, DiT calculation, GAN finishing

*(Reference time: 00:52:26 – 01:02:25｜Lecture 14)*

### 5.1 Latent space diffusion: compress 256×256×3 into 32×32×16

![LDM first frame: The encoder compresses the image into latent code, and the decoder restores it back to the image](</attachments/cs231n-382e966e1687608b1350ed8a.png>)

The lecturer first corrects his previous sentence: He said that the diffusion model is the most popular generative model, which is "a bit of a lie" - what is really used everywhere is **Latent space diffusion model (LDM)**. It is a multi-stage process. In the first stage, a pair of encoder/decoder is trained.  $H\times W\times 3$  The image is pressed into  $H/D\times W/D\times C$  The latent code is then restored by the decoder.

![LDM second frame: gives common configurations D=8, C=16, and conversion from 256×256×3 to 32×32×16](</attachments/cs231n-42e977c35804003c0195ecea.png>)

Specific Numbers: Spatial Downsampling  $D=8$, number of channels  $C=16$. So  $256\times256\times3$  The picture becomes  $32\times32\times16$  The latent code——**The number of elements dropped from 196608 to 16384, a full 12 times**. This pair of codecs is usually an attention-based CNN, and some work has also switched to ViT in recent years.

![LDM third frame: The diffusion model is changed to denoising on the latent code, and the encoder freezes](</attachments/cs231n-c781dbc1a0cc2c8ebade64bc.png>)

The second stage: the diffusion model no longer looks at pixels, but at latent codes. During training, pass the image through the encoder to obtain the latent code, add noise to the latent code, and let the model learn to denoise. The lecturer emphasized a detail that is easily overlooked——**Encoder is frozen**, the gradient will not be passed back to it, it is only responsible for turning the graph into latent code.

![The fourth frame of LDM: marked "After training is completed", the process on the right is about to begin](</attachments/cs231n-0aed3a1f7d2ed2a3e076ad89.png>)

After training, enter inference.

![LDM fifth frame: sampling a random latent code](</attachments/cs231n-2296fb4719a5fe16f783ca07.png>)

First pick a random latent code, the shape is  $H/D\times W/D\times C$.

![LDM frame six: iteratively calling the diffusion model for denoising](</attachments/cs231n-f2c6d4d8568002deb0c5706a.png>)

Then follow the previous 50-step process to repeatedly denoise. Note that the cost of each step here is calculated based on the latent code size, not pixels——**This is what LDM saves**.

![LDM frame 7: Send the clean latent code to the decoder to obtain the image](</attachments/cs231n-8393d96d09e2370d826a6fdc.png>)

After denoising, we get the clean latent code and pass it through the decoder one last time to get  $H\times W\times 3$  image.

![LDM frame 8: Annotated "Latent space diffusion is the most common form today"](</attachments/cs231n-76c5720f6fbeb9be0acf1f68.png>)

The footer adds a positioning sentence: This is the most common form today.

### 5.2 How to train the encoder/decoder pair: VAE foundation, GAN recovery

![Question page: How to train the encoder and decoder](</attachments/cs231n-4b8ae8bf949b2af7e4dabe91.png>)

The instructor posed the question to the class: What codec structures have we seen? The answer is in the next frame.

![Answer page: It's just a VAE, usually with a very small KL weight](</attachments/cs231n-8a85a174c08e40d79ed94416.png>)

It is a VAE - the architecture in which the encoder outputs Gaussian and the decoder outputs Gaussian as discussed earlier. The only difference is that the weighting of the KL term is very small: we don't really need the latent code to obey a standard Gaussian, just that it is reversible with little information loss.

![Problem page: VAE decoder output is often blurry](</attachments/cs231n-eb1387a9edf694685e9348fc.png>)

But VAE has an old problem: **Decoder output is blurry**. In LDM, this is fatal - the reconstruction quality of the decoder is the upper limit of the entire pipeline. If the image it restores is blurry, it will be useless no matter how well the subsequent diffusion model is generated.

![Solution page: Add a discriminator and use GAN to improve the reconstruction quality](</attachments/cs231n-0fa8d0494fb917fcffda0a7a.png>)

The solution is to bring GAN back: connect a discriminator behind the decoder to determine "reconstructed image vs. real image". The reconstructed image must be pushed to look like the real image, and the problem of ambiguity will be eliminated by the adversarial loss.

![Convergence Page: Modern LDM Pipeline = VAE + GAN + Diffusion](</attachments/cs231n-2689c7a0733495722cb7a1d4.png>)

So the foreshadowing of the whole story ends here. The lecturer's original words were: "The most advanced generative modeling, is it VAE? Is it GAN? Is it diffusion? **All of them.**"Modern pipelines train a VAE, a GAN discriminator and a diffusion model simultaneously - the VAE is responsible for compression, the GAN is responsible for making the decoder unambiguous, and the diffusion is responsible for generating in the latent space. "I'm sorry, this is just a stew," he said.

```mermaid
flowchart LR
    IMG["real image H×W×3"] --> ENC["encoderVAE first half"]
    ENC --> LAT["latent code H/D×W/D×C"]
    LAT --> NOISY["Latent code after adding noise"]
    PROMPT["text prompt"] --> TE["Pretrained text encoder T5 / CLIP，frozen"]
    TE --> DIT["DiT：Inject time steps and text"]
    NOISY --> DIT
    DIT --> CLEAN["clean latent code"]
    CLEAN --> DEC["decoderVAE second half"]
    DEC --> OUT["generate image H×W×3"]
    DISC["discriminatorGAN）"] -.->|"It is only used to improve the reconstruction quality during training."| DEC
```

In this picture, the solid line is the path that is actually run during inference, and the dotted line only exists during the training phase——**The discriminator is discarded during inference**, which is completely consistent with GAN.

### 5.3 DiT: Where do conditions enter Transformer?

![First frame of DiT: The diffusion model uses the standard Transformer block. The core problem is how to inject conditions](</attachments/cs231n-5c67349cf7f978b856f9eca7.png>)

On the contrary, network ontology has become cleaner in recent years: it directly uses the standard Transformer block, which is the so-called DiT. There is only one question that really needs to be designed——**How to inject conditions into it?**. There are three inputs to the network: noisy images and time steps.  $t$, conditional signals (such as text).

![DiT second frame: The first way is to predict scale and shift, which is mainly used to inject time steps](</attachments/cs231n-7a6619c8bce19586be031a05.png>)

The first mechanism is to have the network predict a set of scales and translations to modulate intermediate activations inside the Transformer block. This is basically the time step  $t$  The standard injection method - the same idea as StyleGAN's AdaIN: turning the scalar condition into a channel-by-channel affine transformation.

![DiT third frame: The second way is to stuff the conditions into the sequence and use cross-attention or joint attention](</attachments/cs231n-85f86c14d59df972a8551f77.png>)

The second mechanism takes advantage of the nature of Transformer: it is a sequence model, then **Put everything into the sequence**. Text tokens can be combined with image tokens for joint attention, or they can be used as separate key values ​​for cross-attention. The modern conventions summarized by the lecturer are: scale/shift for time, and sequence splicing for text (usually cross-attention, sometimes joint attention).

### 5.4 Vincentian pictures and Vincentian videos: the same pipeline, but the sequence length differs by two orders of magnitude

![Vincent graph pipeline: The text is encoded by T5/CLIP, enters DiT together with the noisy latent code, and outputs the clean latent code and then decodes it.](</attachments/cs231n-f4be5e0eb6b139c796863bda.png>)

Putting all the above parts together is a Vincentian diagram. The prompt words first pass through a pre-trained text encoder (T5, CLIP, etc., usually frozen), and we get  $D\times L$  text embedding; it and  $h\times w\times c$  The noisy latent code of  $H\times W\times 3$  image. The example prompt words on the page were written by the lecturer the day before: a monkey shook hands with a tiger in front of the Eiffel Tower, the monkey wore a hat made of bananas, and the tiger stood on two legs and wore a suit.

![Vincent figure specific figures: configuration and sequence length of FLUX.1 \[dev\]](</attachments/cs231n-4d248ac67990381287688f0b.png>)

Use a real model to put the numbers down: FLUX.1 \[dev\] uses T5 + CLIP dual text encoder, the codec does 8 times downsampling, and the diffusion model itself is a 12 billion parameter Transformer. The latent code is  $128\times128\times16$, DiT did an extra time before  $2\times2$  For patchify, the sequence length given by the instructor is  **1024 image tokens**.**Remember the number 1024**, will be used for comparison immediately.

![Vincent Video Pipeline: The latent code has one more time dimension, and the decoder becomes a spatiotemporal autoencoder.](</attachments/cs231n-1c2f257dbdfcd9bd3a14d8ca.png>)

The pipelines of Vincent Video are exactly the same. The only difference is that the latent code has an extra time dimension: from  $h\times w\times c$  become  $t\times h\times w\times c$, the decoder also changes from a spatial autoencoder to a spatiotemporal autoencoder, downsampling in time and space simultaneously. The prompt on the page was replaced with a description of a red-faced, white-haired monkey taking a hot spring bath.

![The second frame of Vincent’s video: the generated video clip embedded with Meta Movie Gen on the right](</attachments/cs231n-b27346291642f6e76b14d656.png>)

This frame has the generated results of Meta Movie Gen posted in the lower right corner as evidence.

![Specific numbers of Vincent Video: MovieGen’s 30B DiT and 76K token sequence](</attachments/cs231n-27f4f00bd6d1b2f02666200a.png>)

The comparison of numbers is brutal. MovieGen's text encoder is UL2 + ByT5 + MetaCLIP, and the codec is  $8\times8\times8$  Downsampling, the diffusion model is  **30 billion parameters** of DiT. noisy latent code  $32\times128\times72\times16$, clean latent code  $33\times128\times72\times16$, output  $257\times1024\times576\times3$  video. $1\times2\times2$  After patchify, the sequence length reaches  **76000 tokens**——More than seventy times the 1024 tokens in Vincent’s diagram.

The lecturer thus gave the core conclusion of this line: the cost of the video diffusion model is almost entirely due to the sequence length, not the parameters or architecture. If you want high frame rate, high resolution, and multiple frames, the number of tokens will be expanded simultaneously in these three dimensions.

![Video diffusion model chronology: more than twenty models from January 2024 to May 2025](</attachments/cs231n-2175329567b9f57903a5bbf7.png>)

This page arranges the models in the past year and a half into a timeline. The colors distinguish three categories: green is an open source model, orange is a technical report, and red is no technical information at all. From Google's WALT (460M) in early 2024 to Wan (14B), Hunyuan (13B), Cosmos (14B), and MovieGen (30B) in May 2025, the number of parameters has increased from 460 million to 30 billion, spanning nearly two orders of magnitude. The lecturer said that there had been new models almost every week for 18 months, and that Google had just released Veo 3 at 11 a.m. that day - he read the blog on the car on the way to school. He specifically mentioned that Veo 3 will jointly model sounds and can output audio and images at the same time.

As for Sora's historical status, he said: It was not the first video diffusion model, but it was the first to be shockingly effective, adopting the modern route of DiT + Rectified Flow (he was not sure whether Sora actually used Rectified Flow), "that was the mile-and-four-minute moment of video diffusion," and all major manufacturers were chasing after it.

## 6. Replacing the same process with four functions is another paper: Generalized Diffusion, Distillation and Three Mathematical Perspectives

*(Reference time: 01:02:30 – 01:11:26｜Lecture 14)*

### 6.1 Distillation: Convert 50 steps into 1 step and exchange mass for speed

![Distillation problem page: Sampling requires running the model 30–50 times, which is too slow](</attachments/cs231n-681532407f9320a111bfa5b0.png>)

The biggest engineering problem with diffusion is its slowness: sampling requires 30 to 50 iterations, and the model itself may have tens of billions of parameters and tens of thousands of sequence lengths. The lecturer called it a "disaster in reasoning."

![Distillation solution page: reduce the number of steps to fewer, even 1, and list six references](</attachments/cs231n-b745bc9044f4120332d9103e.png>)

The solution is a type of algorithm called distillation: take a model that takes 30-50 steps, and transform it in some way into a model that requires only a few steps and can still produce good samples. Sometimes it can even be done in one step, and CFG can be "baked" together. The trade-off is a loss in sample quality - the trick with all distillation methods is **Drop as little as possible**. The lecturer listed six documents for 2022–2025 (Progressive Distillation, Consistency Models, Adversarial Diffusion Distillation, LADD, sCM, Moment Matching) and said that this is a very active direction.

### 6.2 Generalized Diffusion: Split Rectified Flow into four function slots

![Generalized Diffusion First Frame: Rewrite the goals of Rectified Flow line by line](</attachments/cs231n-c85a423d7e9c1f7fbbcf9a1d.png>)

After talking about engineering, let’s go back to mathematics. This page rewrites the goals of Rectified Flow as a baseline for comparison: Sampling  $x\sim p_{data}$, $z\sim p_{noise}$, $t\sim p_t$, order  $x_t=(1-t)x+tz$, $v_{gt}=z-x$, prediction  $v_{pred}=f_\theta(x_t,t)$, minimize  $\|v_{gt}-v_{pred}\|_2^2$.

![Second frame of generalized diffusion: A new column is added on the right, and the interpolation coefficients and regression targets become functions of t](</attachments/cs231n-aad0beefcae6c148d9e2994d.png>)

The column on the right is "generalized diffusion": replace the coefficients of the two linear combinations with  $t$  function——



$$
x_t=a(t)\,x+b(t)\,z,\qquad y_{gt}=c(t)\,x+d(t)\,z
$$



network input  $x_t$  with  $t$, output  $y_{pred}$, the loss is still L2. **The difference between all diffusion variants is what functions are plugged into these four slots.**

![The third frame of generalized diffusion: Rectified Flow corresponds to a=1-t, b=t, c=-1, d=1](</attachments/cs231n-76d54ce1ea61f6e17327252a.png>)

Fill in the corresponding form: Rectified Flow Yes  $a(t)=1-t$, $b(t)=t$, $c(t)=-1$, $d(t)=1$, at this time  $y_{gt}=z-x$, it is that velocity vector.

![Generalized Diffusion Frame 4: Variance Preserving folding two coefficients with a single σ\_t](</attachments/cs231n-c9b80364bf2adf5e9964c9ea.png>)

The second type is called variance preserving (VP): $a(t)=\sigma_t$, $b(t)=\sqrt{1-\sigma_t^2}$. There is a definite benefit to choosing this format - if  $x$  with  $z$  are independent and have variances of 1, then  $x_t$  The variance of is also always 1, and the noise will not blow up the numerical scale. The cost is to collapse the two functions into one  $\sigma_t$, and this  $\sigma_t$  It's still up to you to decide.

![The fifth frame of generalized diffusion: Variance Exploding Let a=1, b=σ\_t](</attachments/cs231n-02677b9e643862407fd25a62.png>)

The third type is called variance explosion (VE): $a(t)=1$, $b(t)=\sigma_t$. At this time, the signal remains unchanged and the noise becomes larger and larger, so  $\sigma_1$  must be large enough to submerge  $x$  All signals in , otherwise  $t=1$  Sometimes there is still information left.

![The sixth frame of generalized diffusion: three regression targets—x-prediction, ε-prediction, v-prediction](</attachments/cs231n-0fb2a90286e42e1d7f8ceed5.png>)

In addition to the interpolation method, the regression target can also be changed. The page lists three groups  $(c,d)$: Predict clean data ($c=1,d=0$), which is x-prediction; predicting the noise added ($c=0,d=1$), which is ε-prediction, which is used by DDPM; predicting a mixture of the two ($c=b,d=-a$), which is v-prediction. The three objectives are mathematically equivalent (knowing two of them will solve the third), but the numerical condition numbers on different noise intervals are very different.

![Generalized diffusion seventh frame: How to choose these functions? determined by some mathematical formalization](</attachments/cs231n-0ad134e0146281739ae0bfcf.png>)

The lecturer admitted that this set of parameterization is frustrating: It was difficult enough to choose super parameters, but now we have to choose **to  $t$  is a function of independent variables**, which cannot be set up by intuition at all, and must be guided by mathematics. This brings him to the final section.

### 6.3 Three mathematical perspectives: one algorithm, three sets of explanations

![Perspective 1: Diffusion is a latent variable model, with forward noise addition, reverse denoising, and optimization of variational lower bounds.](</attachments/cs231n-90c10a7155fbb5d336b89b07.png>)

First formalization: Diffusion is a latent variable model. Each clean sample  $x_0$  They all correspond to a whole noise-added trajectory.  $x_1,\dots,x_T$, these intermediate states cannot be observed by us and are latent variables. Therefore, we can copy the VAE derivation and optimize the variational lower bound of the likelihood. This line extends from Sohl-Dickstein et al. (2015) to DDPM.

![Perspective 2: Diffusion is a score function](</attachments/cs231n-14036d7d5998d18ab555af69.png>)

The second formalization completely changes the language. for any distribution  $p(x)$  Define the scoring function



$$
s(x)=\nabla_x \log p(x)
$$



It is a vector field pointing in the direction of high probability density. Diffusion models can be thought of as "learning a score function for the data distribution", one for each of multiple noise levels - so you get a family of score functions, not just one.

![Perspective 3: Diffusion in solving stochastic differential equations](</attachments/cs231n-4bfcd0190efe5007257ef55f.png>)

A third formalization writes the noise addition as a stochastic differential equation (SDE):



$$
d\boldsymbol{x}=f(\boldsymbol{x},t)\,dt+g(t)\,d\boldsymbol{w}
$$



What the network learns is the numerical integrator of this SDE. The lecturer said frankly that he didn't fully understand this. But this perspective has a practical benefit: once you think of sampling as solving an SDE, you can borrow all the more advanced integrators in numerical analysis, and the "edge" in Rectified Flow  $v$ "Take a step" is essentially the simplest forward Euler method.

![Further reading page: Sander Dieleman’s perspectives on diffusion](</attachments/cs231n-924b3c1e7ab8dd6bbf7784b5.png>)

If you want to continue reading, the lecturer recommended Sander Dieleman's blog article, which gives eight different perspectives on the diffusion model, and said that all articles written by this author on diffusion are worth reading.

### 6.4 Counterattack of the autoregressive model

![Autoregressive regression on the first frame: Autoregressive is too slow on raw pixels, but works well on discrete latent codes](</attachments/cs231n-2ade65d631ac956b3ee084b4.png>)

The last half page is a backlash. The autoregressive model in Lecture 13 is too slow on raw pixels - the sequence is spread out pixel by pixel and is too long to be sampled sequentially. But if you replace token with **discrete latent code**, the sequence length immediately decreases by one or two orders of magnitude, and autoregression works again.

![The second frame of autoregressive regression: VQ-VAE pipeline - discrete latent code + autoregressive model](</attachments/cs231n-db86289a5ea1eca6ef3e8566.png>)

Specific method: first train a pair of codecs and compress the image into **integer** Latent code (this step corresponds to the VQ-VAE series); then train an autoregressive model on this discrete sequence; extract the latent code sequence from the autoregressive model during sampling, and pass the decoder to obtain the image. This line has been pushed to a very high quality in work such as Taming Transformers, Parti, etc. The lecturer put it at the end to illustrate **Modern generative modeling takes more than one path: diffusion**, and these two paths share the same skeleton: encoder, decoder, modeling on latent space.

## 7. Summary

*(Reference time: 01:11:38 – 01:12:03｜Lecture 14)*

![Summary page: GAN, diffusion model, and latent space diffusion model are juxtaposed](</attachments/cs231n-dff4da74878d9595176a5798.png>)

The summary page has only three lines: generative adversarial network, diffusion model, and latent space diffusion model. The lecturer characterized the course as a "whirlwind tour" - two broad categories, ending up in a modern pipeline that incorporates both.

![Preview page for next class: Vision + Language](</attachments/cs231n-c13ffc68ddce2da8a8292919.png>)

The next lecture turns to vision and language.

What you should really take away from this class is the following judgments:

- **Normalized object determines difficulty**: The discriminative model divides probabilities between several categories, and the generative model must spread the probability quality throughout the data space. This is the fundamental reason why it must rely on approximation or confrontation.
- **GAN outsources the objective function to the discriminator**, at the expense of readability: $V$  The absolute value of depends on the level of both networks at the same time, and the training curve cannot be used to judge progress.
- **Unsaturated loss is not an aesthetic choice**: $\log(1-D(G(z)))$  in  $D(G(z))\to 0$  When the gradient approaches zero, it is replaced by  $-\log D(G(z))$  Just to make the opening gradient, the price is  $G$  with  $D$  Optimized is no longer the same  $V$.
- **Theoretical optimality only guarantees "where is the best point"**: $D^*=p_{data}/(p_{data}+p_G)$  with "$p_G=p_{data}$ "Time-optimal" all assume infinite capacity, and we have no idea whether we can use gradients to get there.
- **Diffusion uses "iteration" to replace the loss curve**: Training is an L2 regression, the loss is readable and scalable; the cost is that sampling takes dozens of forward times, and CFG will double this number.
- **The difference between the two vectors of CFG is to deduct the common component**: $v_{cfg}=(1+w)v_y-wv_\varnothing$  What is subtracted is the "average trend of all data", and what remains is the purely conditional direction. $w$  It just emphasizes intensity.
- **Resolution will not automatically adapt**: Noise scheduling must translate with the data resolution. This is the direct reason why pixel space diffusion fails at high resolution and must be transferred to latent space.
- **Modern pipelines are made of**: VAE is responsible for compression, GAN is responsible for making the decoder unambiguous, DiT is responsible for denoising in the latent space, and the text encoder is responsible for conditions. Today's picture cannot be produced without any missing link.
