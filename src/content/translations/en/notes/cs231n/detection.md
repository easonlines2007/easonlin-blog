---
kind: notes
source: cs231n/detection
title: "CS231n Computer Vision: Detection, Segmentation and Interpretability
  (Lecture 9)"
description: Detection compresses the variable-length output into a fixed-length
  tensor, segmentation suppresses the resolution and then raises it back up, and
  interpretability amortizes the category score back to pixels - the three lines
  share the same set of convolutions and attention calculations.
sourceHash: ed2ff220f00370f4218156bfa1652941e018870788e0e36ed4311b284edc6415
publish: true
translationMethod: machine-assisted
---

> **Course information**
>
> - **Course name**: Stanford CS231n: Deep Learning for Computer Vision(Spring 2025)
> - **This module covers**: Lecture 9. Object Detection, Image Segmentation, Visualizing and Understanding (178 slides)
> - **Lecturer**: Ehsan Adeli
> - **Teaching date range**: 2025-04-29
> - **Course homepage**: [cs231n.stanford.edu/2025](https://cs231n.stanford.edu/2025/schedule.html)
> - **Official courseware**: [lecture_9.pdf](https://cs231n.stanford.edu/slides/2025/lecture_9.pdf) (178 pages, page-by-page illustrations in the book)
> - **Subtitle source**: [cs231n_sp25_kor_sub · eng](https://github.com/lpaiu-cs/cs231n_sp25_kor_sub/tree/main/eng) (Publicly transcribed in English, Chinese rewritten by this book)
> - **Copyright statement**: The copyright of the slides and course materials belongs to Stanford University and the instructors; this book is an unofficial study note and is only used for study and research.

![Title page of Lecture 9: Detection, Segmentation, Visualization and Understanding. The four words correspond to the four paragraphs of this module.](</attachments/cs231n-d9fb4463ee8b6bdfeb82fe2f.png>)

The first eight modules dismantle the "one image in, one label out" pipeline to the bottom: scoring function, loss, backpropagation, convolution operator, backbone architecture, and sequence model. This assembly line has a premise that has never been questioned——**The output is fixed length**. The scores of C categories are hard-coded in the weight matrix of the last layer. Whether it is 10 numbers or 1000 numbers is decided at the moment the network is defined. For the three types of tasks to be handled in this module, the first action is to dismantle this premise. Semantic segmentation needs to output H×W labels; target detection needs to output several "categories + boxes", and the number of "several" is determined by the image content; interpretability asks in turn: Since the score is a fixed-length vector, which piece of the image is it supported by? As soon as the output becomes longer, the project accounts all fall into the same place——**How to encode variable-length answers into fixed-length tensors**. This module is organized according to this account and will not be repeated in the order of the slides: Chapter 1 first establishes the "readout" mechanism of Transformer, which is the foundation of DETR at the end of this lecture; Chapters 2-3 deal with the segmentation branch, the core contradiction is resolution; Chapter 4-6 deal with the detection branch, the core contradiction is the output length, four sub-questions (how many, where, what, how to remove duplicates) are answered by fixed-length encoding, box regression, classification header and non-maximum suppression; Chapter 7 Chapter 8-9 separates the two synthetic instances; Chapter 8-9 changes direction and asks why the network answers this way.

![Opening administrative page: Assignment 2 is the longest of the three assignments, with midterm and project milestones following it.](</attachments/cs231n-4cb79a81a85db6ebc6a770f4.png>)

This page has no technical content, but marks the pace of the course: Assignment 2 is followed by midterm and project milestones. The lecturer made an arrangement at 00:03:21 - stop to answer questions after reviewing ViT, and ask homework-related questions together at that time. Therefore, the first half of the following chapter is spoken at a fast pace. It is to catch up with the progress, not to talk about new things.

## 1. The readout end of ViT has only two interfaces: a learnable classification token, or average pooling of patches.
*(Reference time: 00:00:28 – 00:15:53｜Lecture 9)*

Put Transformer at the beginning of the detection module, not because it ranks on the first page, but because it answers the ultimate question of this module. Detecting this line until 2020, the answer is a pure Transformer model: fixed-length does not rely on grids or anchor boxes, but on **a fixed number of query vectors**. To understand "why the query can replace the anchor box", you must first see clearly how Transformer reads an answer from a string of tokens - this is exactly what the seven pages of ViT are doing.

![The closing picture of the previous lecture: The encoder is composed of multi-head self-attention, LayerNorm and MLP, and the decoder has an additional layer of cross-attention for the encoder output.](</attachments/cs231n-c248e13927f5f26929ccd218.png>)

The reason why this picture is replayed is because the last model of this lecture will remove it as it is: the feature map produced by the convolutional backbone becomes the token sequence of the encoder, the detection head becomes the decoder, and the set of "queries" at the input of the decoder will appear again in Chapter 6 under the name of object query. There is only one thing to remember at this moment - the decoder does not copy the output of the encoder, but uses it as a key value and uses queries to retrieve information.

![Three ways of processing sequences side by side: RNN, convolution, and self-attention. Their respective costs are written below.](</attachments/cs231n-318b6a36ca0af05b2baf1b4d.png>)

Separately calculate "expensive" and "good", this page is an accounting table. The recurrent network requires O(N) hidden state memory, and must be serialized moment by moment, and cannot be parallelized; convolution can be parallelized, but the receptive field of a single output is limited, and many layers must be stacked to see the distance; self-attention allows each output to be directly connected to all inputs, at the cost of O(N²) calculation and O(N) memory. The advantage is that four matrix multiplications can be completed in parallel. The lecturer's judgment was straightforward: it is more expensive, but its modeling capabilities are obviously better, so it is selected by default for today's application. There is an inference buried here that will be used later. After the image is cut into patches, the sequence length N is only about 196 (224/16 squared), and O(N²) is completely affordable; but in pixel-level tasks, N will become tens of thousands, and self-attention is unaffordable. **The feasibility of the same operator at two resolutions is completely different**——This constraint will determine why DETR in Chapter 6 must stand on the CNN feature map instead of the original image.

![ViT step one: a 224×224×3 input image](</attachments/cs231n-281c1cb2f796b86974d0a9b6.png>)

There is only one picture and one line of labeling on the entire page. The next seven frames all do the same thing: turn a two-dimensional grid of pixels into a one-dimensional sequence of vectors.

![ViT Step 2: The image is cut into 16×16 non-overlapping blocks, each block retains three color channels](</attachments/cs231n-caa041532c9a9cb1b903e449.png>)

Dicing is the whole secret of this route and its only source of loss. The sequence model can only see "which token", but cannot see "whether this token was originally in the upper left or lower right of the picture" - the position is actively lost in this process.

![ViT Step 3: Get N patches with a shape of 3×16×16](</attachments/cs231n-056cac3be954bc0c8056748b.png>)

224/16 = 14, 14 pieces cut out on each side, N = 196. This digital slide is not written, but it is the benchmark for all subsequent calculation calculations: 196 tokens, each 768 dimensions, and the tensor before entering the Transformer is 196×D.

![ViT step 4: Flatten each patch into 768 dimensions and then linearly project it to D dimension](</attachments/cs231n-99cd86a6c29d546b431faf43.png>)

3×16×16 = 768 is an arithmetic result, not a super parameter; the real super parameter is only D, which is the width of the entire Transformer. This step is the same as word embedding in text - table lookup is replaced by matrix multiplication.

![ViT Step 5: Add a learnable D-dimensional position embedding to each position](</attachments/cs231n-26e46cac11fa39329ff1305a.png>)

The positions are lost by dicing, so they must be explicitly compensated: each position is assigned a D-dimensional learnable vector, which is directly added to the corresponding token. The lecturer added that there is freedom in implementation - position coding does not need to be learned, and can also be specified manually, such as numbering in sequence 1, 2, and 3, or using two sets of (x, y) coordinates to compile one set each and then add them together. The effect is not much different.

![ViT Step 6: This string of tokens enters the standard Transformer, and each patch outputs a vector](</attachments/cs231n-7ffdb2f2fafd2636ad1683b5.png>)

By this frame, the input shape is completely isomorphic to the word vector sequence of a natural language sentence, and there is no need to change a single line in the subsequent layers. The only change is the mask: the language model must cover the future, the image has no "future", and each patch can see all patches.

![ViT Step 7: Insert an additional learnable classification token, the dimension is also D](</attachments/cs231n-0aec3fe07899e2b247c612f2.png>)

How to read the classification results? The most common method is to shoehorn an additional token, which does not correspond to any piece of the graph and is only responsible for "collecting" global information in layers of self-attention. The lecturer answered a very natural question: it is not a bias, but an independent trainable vector, which will eventually be mapped into a class C probability by a feedforward layer or linear layer. This sentence is worth remembering because the object query in Chapter 6 uses exactly the same construct.

![ViT Step 8: Take the output of the classification token and pass it through a D→C linear layer to obtain the category score](</attachments/cs231n-59d1dcc58808a8760122a7e2.png>)

The patch's own output vectors are discarded at this step - they are not wasted, the information has been funneled into the classification token through self-attention. What this architecture diagram really wants to say is "one token represents the entire picture": only one position is left on the reading end, and the remaining positions are sacrificed during reading.

![The first frame of another route: the same input image is re-cut into blocks and annotated back to 16×16×3](</attachments/cs231n-4c464c276e22f1445e919f54.png>)

From here, Slide redraws the entire assembly line just to replace the last head. The first frame is still input and cut, no different from the previous one.

![Second frame: After flattening, perform linear transformation of 768→D](</attachments/cs231n-83d33a8c1a5cb43a85864716.png>)

This step is exactly the same as the previous one, except this time it is re-accounted as the first step in the "pool head" version.

![Third frame: The D-dimensional vector of each patch is marked as the input of Transformer](</attachments/cs231n-0155244d3aa2594680439f2f.png>)

The stringed D-dimensional vector is clearly marked as the input of Transformer in this frame. Up to this point, the two routes are identical, with the divergence occurring only at the output.

![Fourth frame: Add position coding to clearly tell Transformer the position of each patch on the two-dimensional plane](</attachments/cs231n-f2604a8d98a90bbac1336608.png>)

The wording is more straightforward than before: instead of telling it the serial number, tell it the coordinates. This difference will be magnified in the detection - the regression of the frame depends on the coordinates, and the serial number is useless for regression.

![Frame 5: Clearly marked "Do not use any mask"](</attachments/cs231n-6714ebf9db4645212fed867b.png>)

This is a taboo in language models, but it is the default in images: there is no causal order between pixels, and covering a part will not make the task more meaningful, but will only lose information in vain.

![Frame 6: Transformer outputs a vector for each patch, without classification token](</attachments/cs231n-c819d9117f4798e82bdd8675.png>)

The output is N D-dimensional vectors, one per patch, with no additional summary positions. The value of this frame is to turn "reading" into an obvious fact: all information is in N vectors, and how you read it is up to you.

![The seventh frame: average pool N×D into 1×D, and then connect a D→C linear layer for scoring](</attachments/cs231n-9e6e5ce6a658047b45a3d9f1.png>)

There is only one engineering difference between the two routes: classification tokens allow the network to learn to summarize information into one place, making it more expressive; average pooling forces the assumption that each patch contributes equal weight, has fewer parameters, and is less likely to overfit. The instructor said that both are supervised exactly the same way - backpropagation plus Softmax or binary cross-entropy. This pronunciation of "pooling + full connection" is worth remembering first. When talking about CAM in Chapter 8, the premise of the entire derivation is that the classifier follows the global average pooling; in other words, the establishment of CAM relies on this inconspicuous pooling header on this page. Pooling is optional in ViT, but must be used in CAM - same thing, two fates.

![Overview of the four project changes: The architecture has not changed significantly since 2017. What has changed is the normalized position, normalized type, MLP structure and number of experts.](</attachments/cs231n-67fb5cfd89b48966cb1382dc.png>)

The next nine pages are the only part of this lecture that has nothing to do with testing. Their function is to explain "what the Transformer will look like in 2025." The reason it's worth spending nine pages is because the DETR for Chapter 6 is from this edition, not the 2017 edition.

![Pre-Norm first frame: LayerNorm hangs outside the residual connection](</attachments/cs231n-a246e28bd2910b0d307536b0.png>)

The original version places normalization after the addition of residuals, which means that no matter what the sub-layer learns, the output will be re-normalized once, and the network cannot learn a strict identity mapping. Identity mapping is precisely the premise for deep networks to be trained - if a certain layer is really useless, at least it can do nothing. This argument is the same as the motivation for ResNet residuals in the convolution module: **First ensure that the path of "not getting worse" exists, and then talk about getting better.**.

![Second frame: Move the two LayerNorms to the entrances of self-attention and MLP respectively, and put them inside the residual](</attachments/cs231n-6bfa2a5b43927430c4a15ed0.png>)

The residual backbone therefore becomes a clean path, and the gradient can pass through it unchanged; the price is that the backbone value is no longer subject to normalization constraints, and training must be stabilized by means such as warmup. The slide only gives one conclusion: training is more stable.

![RMSNorm: Remove the subtracted mean and keep only dividing by the root mean square](</attachments/cs231n-0c632da479257195a1a303fe.png>)

$y_i = x_i/\mathrm{RMS}(x)\cdot\gamma_i$, among which  $\mathrm{RMS}(x)=\sqrt{\varepsilon+\frac{1}{N}\sum_{i=1}^{N}x_i^2}$. One less averaging and one less subtraction is a real savings in computing power on large models. The lecturer's attitude towards such changes is very honest: most of them are empirically more stable, and the theoretical explanation is an afterthought.

![SwiGLU first frame: Classic MLP is two matrices, D→4D→D](</attachments/cs231n-43424c39cb753fc0f2d393c4.png>)

$Y=\sigma(XW_1)W_2$, $W_1$  is D×4D, $W_2$  It’s 4D×D. The width of the middle layer is four times the input, which is the most parameter-intensive part of Transformer - the number of parameters of MLP in a block is usually more than twice that of self-attention.

![Second frame: Change to three matrices plus a gate, and the middle width is 8D/3, keeping the total parameters unchanged.](</attachments/cs231n-f84555abc822103f9d35c14b.png>)

$Y=\sigma(XW_1)\odot(XW_2)W_3$: One branch is considered activated, and the other is used as a switch. Multiply element by element to determine how much to release. When H is 8D/3, the total number of parameters is the same as the 4D version, but the linearity is stronger - using the same parameter budget for more complex gates.

![MoE first frame: Each block learns E sets of MLP weights, and the parameter amount changes from D×4D to E×D×4D](</attachments/cs231n-31c3d154e822140714d35514.png>)

The fourth change is to change "one MLP" into "a group of MLPs", with each independent set of weights called an expert.

![MoE second frame: Each token is only routed to A experts, the parameters increase by E, and the computing power only increases by A](</attachments/cs231n-c269ae8c2b9e2246b3f1a0e0.png>)

Routing is the core of this trick: each token is only sent to A of E experts (A \< E). Therefore, the number of parameters increases by E, and the amount of calculation only increases by A. This is currently the main means to achieve both "large model" and "inference is not too expensive".

![MoE third frame: Today’s largest LLMs almost certainly use MoE, with more than one trillion parameters and no details will be disclosed.](</attachments/cs231n-7e61a3402bd92f553a7b9e5e.png>)

The third frame makes it clear: GPT-4o, GPT-4.5, Claude 3.7, Gemini 2.5 Pro. This model will almost certainly use MoE, with parameter amounts above 1T, but the details will no longer be announced. The lecturer added two pieces of experience in the Q&A: experts train in parallel and are randomly initialized, so they will be naturally differentiated to learn different aspects; the number of experts E and the number of actives A are both super parameters, which are usually predetermined and not fine-tuned.

![Summary of four changes: one line each for Pre-Norm, RMSNorm, SwiGLU, and MoE](</attachments/cs231n-32e3221c5436ed6cbb96c979.png>)

The summary page juxtaposes these four: Pre-Norm is to move normalization into the residual, RMSNorm is to change the normalization layer, SwiGLU is to change the MLP, and MoE is to learn E MLPs and only use A for each token. The four together represent all the structural differences between the “2017 architecture” and the “2025 model.” For this book, what this chapter takes away is not these four terms, but two things that will be reused in the following chapters: **The readout can be a learnable vector** (classification token → object query), **The position of normalization determines whether the gradient can cleanly pass through the residual backbone.** (Pre-Norm → trainability of deep detectors). Why should we start over from "Output Shape" in the next chapter? Because Transformer gives a fixed-length tensor, and detection requires a variable-length list - the seam between the two is what will be dealt with in the next six chapters.

## 2. The output shape determines the architecture: the four types of tasks are actually four additional conditions of the same classifier.
*(Reference time: 00:15:57 – 00:25:04｜Lecture 9)*

In this section, the lecturer first lays out a four-frame picture, and then lights up each frame one by one. This picture is worthy of being regarded as a map of the entire module: the difference between the four tasks is not how deep the network is, but the shape of the output - one word, H×W words, several (words, boxes), several (words, boxes, masks). Once the shape changes, the loss function, labeling cost, and post-processing methods all change accordingly, while the backbone of the network can remain motionless.

![Today’s agenda: Transformer review, three types of visual tasks, visualization and understanding](</attachments/cs231n-794ff4bb431d7af81b4d5117.png>)

The agenda divides the entire lecture into two parts: Computer Vision Tasks (semantic segmentation, object detection, instance segmentation) and Visualization & Understanding (layer visualization, saliency map, CAM and Grad-CAM). The first part takes up three-quarters of the time, and the second part is only ten minutes. The lecturer himself said that this is "going through the most important parts."

![Comparison of four types of tasks: classification, semantic segmentation, target detection, and instance segmentation. The respective output properties are written below.](</attachments/cs231n-cc8de556de67028b0f77d876.png>)

The most critical of the four lines is the sentence "No objects, just pixels" below the semantic segmentation. It explains two things at the same time: why object detection is needed after semantic segmentation (individuals are needed), and why instance segmentation is needed after detection (shape is needed). The classification box says "No spatial extent", and detection and instance segmentation share the bracket "Multiple Object" - the difference between them is not whether there are multiple objects, but whether there is a pixel-level mask.

![Back to the classification problem in the first lecture: given a picture, pick a word from the fixed label set](</attachments/cs231n-f23a0b356df5900b7176fbae.png>)

Going back to the first lecture: given a label set like {dog, cat, truck, plane, ...}, output a word for a cat picture. This picture is not a review here, but a target - all subsequent tasks are obtained by adding and subtracting conditions to this sentence.

![The definition of semantic segmentation: the words grass, cat, tree, and sky should be attached to each pixel](</attachments/cs231n-3d87d4dcb71c4b8f31f0a2ad.png>)

For the same four-frame picture, the highlight is moved to the second frame. The desired output is not "there are grass, cats, trees, and sky in the picture", but which category each pixel belongs to. This is equivalent to copying H×W copies of the classification problem and spreading it on one picture at once.

![Formalization of the problem: classify new images pixel by pixel during testing; each image is assigned a pixel-by-pixel annotation during training](</attachments/cs231n-9b2299b82aed66d5949abff4.png>)

The formalization has only two lines: classify each pixel of a new image during testing, and each image must have pixel-by-pixel semantic annotation during training. The lecturer mentioned the historical cost by the way - in the early years, such data sets were marked by people sitting down one by one, which was very expensive; now there are tools to assist, but labeling is still the main cost of this route. The differences between the four tasks can be compressed into a table. Note the last column: **The form of the loss function is entirely determined by the output shape**, the network structure is not that important.

| Task | Output shape | Is the output fixed length? | Label cost | loss |
| --- | --- | --- | --- | --- |
| Image classification | 1 label (C-dimensional score) | is | one word per picture | Softmax cross entropy |
| Semantic segmentation | H×W tags | Yes (same size as input) | One pixel label image per image | Pixel-by-pixel Softmax summation |
| Target detection | K (categories, boxes) | No | Several frames per picture | Softmax + L2 (Classification + Regression) |
| Instance splitting | K (category, box, mask) | No | box + one binary mask per instance | The above two items + mask pixel-by-pixel binary loss |

The "fixed length" column in the table is the lever for the entire chapter. The output of semantic segmentation looks very large, but it is actually of fixed length - H×W is determined by the input size, and the network can still spit it out at once; the output of detection looks small, but it is of variable length, and K is determined by the image content. **big and fixed** You can calculate it hard, **small and floating** Instead, redesign the architecture, which is the starting point for all the techniques in the next five chapters.

![The first frame of the sliding window method: the whole picture is there, and the question mark falls on one pixel](</attachments/cs231n-a290249a529cc759551134ba.png>)

The simplest idea is to only look at this one pixel. The first frame only has a picture and a question mark, and the problem has not been exposed yet.

![The second frame of the sliding window method: looking at a pixel in isolation, it is impossible to determine what it belongs to](</attachments/cs231n-a7e3808fae665510aeb89862.png>)

The answer is no: you can’t tell what a pixel value is by looking at it out of context. A patch of green might be grass or a patch of tree canopy. So we need to introduce context, that is, look at the area around it.

![The third frame of the sliding window method: take the patch centered on the pixel as the input of the classifier](</attachments/cs231n-3d1575da3f5df9a6d074e5d4.png>)

The question mark at this frame becomes "How to model this context" - take a patch centered on the target pixel and send it to the classifier as a small image.

![The fourth frame of the sliding window method: Use CNN to extract patches and output the category of the central pixel. This is how the labeling of cows and grass is obtained.](</attachments/cs231n-4f9811816ea66a45104eaecd.png>)

Specific method: patch through CNN and output the category of the central pixel. The slides cite Farabet et al.'s 2013 scene annotation work and Pinheiro and Collobert's 2014 circular convolution version. The lecturer emphasized that you can choose any network - CNN, ResNet, or ViT, because it does something that is familiar to you: classify a small picture.

![The fifth frame of the sliding window method: The problem is that it is extremely inefficient. There are no features shared between overlapping patches.](</attachments/cs231n-e00930d65c69779747257aaf.png>)

The cost is stated in the fifth frame: an H×W picture requires H×W forward runs, and adjacent patches overlap significantly, and the overlapping area is calculated repeatedly countless times. This is not an accuracy issue, it is pure waste - the motivation for all subsequent segmentation architectures starts from here.

![The idea of convolution: the entire image is passed through the convolution network once, and the features are classified pixel by pixel.](</attachments/cs231n-f43519b1d44f34b1763c7c49.png>)

The first step to improve is to replace "run the network once for each pixel" with "run the network once for the entire image". But the page also points out obstacles: in order to make the classification architecture deeper, the spatial size of the feature map is usually reduced midway, while semantic segmentation requires the output to be as large as the input.

![The first frame of the fully convolutional network: only the convolutional layer is used, no downsampling is used, and the scores of all pixels are output at once.](</attachments/cs231n-c89026524ae872b8cb2a3b34.png>)

So there is a fully convolutional network (FCN): there is only convolution in the entire network, no pooling and no strided convolution. The input is 3×H×W, D×H×W is maintained in the middle, the score of C×H×W is output, and the last argmax gets the prediction of H×W.

![The second frame of the fully convolutional network: Convolution on the original resolution is too expensive to bear](</attachments/cs231n-c0306c435924cec07e543f50.png>)

The cost is added to the second frame of the same page: D channels are maintained for convolution at the original resolution, and the video memory and computing power are linearly expanded according to H×W. The lecturer recalled that in the early years, GPU memory was small, which almost directly sentenced FCN to death - which also explains why the split architecture eventually moved towards "first lowering the resolution and then raising it back up."

![The skeleton of downsampling and upsampling: the resolution is reduced all the way to H/4, and then raised all the way back to H](</attachments/cs231n-80412bfe89163eb9ae143f79.png>)

This picture is the main skeleton of the segmentation in this lecture. The left side is already done: D1×H/2×W/2 to D2×H/4×W/4, the channel becomes thicker, the space becomes thinner, and the receptive field becomes larger; the right side needs to go from low resolution back to D1×H/2×W/2 and then to C×H×W. The slide only has a skeleton in this frame, and no operator has been specified yet - the shape is determined first, and then how to fill it in.

![Second frame of the same skeleton diagram: Fill in the downsampling column with pooling and strided convolution, while upsampling is still a question mark.](</attachments/cs231n-355ff7fd9c32867a352490c7.png>)

The left side is completed: pooling and strided convolution are all operators that have been calculated in the second module. The right side is still empty, with "Upsampling: ???" written on the page——**There is a whole set of ready-made tools for downsampling, but none for upsampling.**. This asymmetry is the technical core of the entire chapter and the reason for the existence of the next chapter. The lecturer stopped here and asked: This network starts from a picture and ends at a picture. How to write the loss function? The answer in class was pixel-by-pixel classification loss. The instructor confirmed: Calculate the Softmax loss once for each pixel on the image, and then sum up all pixels. $L=\sum_{i}\ell_{\text{softmax}}(s_i, y_i)$, and then backpropagates as usual. This explains two things: why such tasks must have pixel-by-pixel ground truth label maps; and why the training cost of segmentation is much higher than that of classification - each pixel in a batch is a training sample.

## 3. Semantic segmentation: Lower the resolution and then raise it back up. The shortcut in the middle determines the boundary.
*(Reference time: 00:25:13 – 00:33:07｜Lecture 9)*

There is no ready-made operator for upsampling, which is a gap left by the previous chapter. This chapter arranges the answers in three levels: "no parameters → borrowing encoder information → having parameters": nearest neighbor and bed of nails are purely geometric rearrangements, maximum depooling borrows the positions recorded by the encoder, and transposed convolution turns upsampling into a layer of trainable network. After completing the third level, the horizontal arrow of U-Net has a place to fall.

![Two methods of Unpooling: nearest neighbor copying into 2×2 blocks, or “bed of nails” that only retains the original value in the corners](</attachments/cs231n-ba74a2579c43a72e745ea94e.png>)

Nearest neighbor copies each element of the 2×2 input into a 2×2 block in the output; the “bed of nails” only puts the original value in the upper left corner of each block and fills the rest with zeros. The latter seems more wasteful, but with the subsequent convolutional layers, these zeros will be gradually "filled" with the effective values ​​​​of the neighborhood, which is equivalent to letting the network learn how to interpolate by itself. Both have no parameters and are fixed index mappings.

![Max Unpooling: Record the position of the maximum value during pooling, and put the value back to its original position during unpooling](</attachments/cs231n-542af75e67acb3ba2028a6f8.png>)

If the encoder uses max pooling, the decoder can be more accurate: when pooling, record the position of the maximum value in each window (switch), when unpooling, put the value back to that position, and set the rest to zero. The slide marks this pair of operations with "Remember which element was max!" - this is the only additional information that needs to be passed between the encoder and the decoder, at the cost of an index tensor as large as the feature map.

![The first frame of upsampling can be learned: first review the ordinary convolution of 3×3, stride 1, padding 1, 4×4 in and 4×4 out](</attachments/cs231n-684e1fba1074dfa08256c894.png>)

The second route is to make upsampling also parameterized. The review starts with the most common convolution: 3×3 filter, stride 1, padding 1, input 4×4, output still 4×4.

![Second frame on the same page: Mark the location where the filter does the dot product with the input](</attachments/cs231n-9d46f2225137fb35562fa544.png>)

In the second frame, the word "dot product" is marked at the position where the filter and the input overlap: each grid output of the convolution is the sum of the element-wise products of the filter and a certain 3×3 window of the input.

![Third frame on the same page: The dot product window slides on the input grid by grid, and the output is generated grid by grid.](</attachments/cs231n-45a8d46442009bcd242ed962.png>)

When the window slides once, the output will grow by one grid. A stride of 1 means that every time the input moves one frame, the output also moves one frame, so the input and output sizes are the same - this is the literal meaning of "convolution without subsampling".

![The first frame of strided convolution: the same 3×3 filter, the stride size is changed to 2, 4×4 goes in and 2×2 goes out](</attachments/cs231n-59a1bc898755a7f738aca698.png>)

Change the step size to 2, and the same filter becomes a downsampler: the input is 4×4, and the output is only 2×2.

![The second frame of strided convolution: the filter skips one frame at a time, and the correspondence between the output position and the input is diluted.](</attachments/cs231n-97e6527565e033e4805c27cc.png>)

The position of the tab is marked in this frame. The effect of step size 2 is: two adjacent cells in the output correspond to positions two cells apart in the input.

![The third frame of strided convolution: the stride is the movement ratio between the input and the output. The strided convolution can be read as learnable downsampling.](</attachments/cs231n-991251526f7ed2d85c43a5ce.png>)

The third frame gives this key interpretation: the step size is the ratio of the input movement amount to the output movement amount, so the strided convolution can be read as "learnable downsampling" - it compresses 4×4 into 2×2, and the compression method is determined by the 9 weights, rather than fixed pooling rules.

![The first frame of transposed convolution: input 2×2, output 4×4, filter is still 3×3, stride 2, padding 1](</attachments/cs231n-6f7f271541e45a987fb64bc2.png>)

Reverse this relationship, and you get transposed convolution: input 2×2, output 4×4. The lecturer fast-forwarded this set of pages in class, citing lack of time, and left only one sentence: "It is the inverse operation of conventional convolution. The convolution is applied to the transposed version of the input, so the output is larger." The frame-by-frame construction process was left in the slide. Complete it here because it is the default part for all subsequent decoders.

![Transposed convolution second frame: a value of the input determines the weight of the entire filter, rather than being weighted by the filter](</attachments/cs231n-bbe8de04772e73d44fbee2d5.png>)

The roles are reversed: in ordinary convolution, the filter sweeps over the input and each output takes a weighted sum; in transposed convolution, each value of the input is multiplied by the entire filter, and a whole block is "printed" on the output. The annotation of this frame is "Input gives weight for filter", which is what it says.

![The third frame of the transposed convolution: the filter moves 2 frames at a time on the output and 1 frame at a time on the input.](</attachments/cs231n-7169035f0ec8d42debdb83a3.png>)

The direction of the step size is reversed at this frame: the filter moves 2 spaces on the output at a time, corresponding to the input advancing 1 space. So the step size changes from "compression ratio" to "amplification ratio", and 2×2 is enlarged to 4×4.

![The fourth frame of transposed convolution: where the output overlaps, add the values printed each time.](</attachments/cs231n-925778fe0681d3e3213f73ce.png>)

There will inevitably be overlap after enlarging: the areas of two adjacent "prints" will collide with each other, and the solution is to add them together.

![The fifth frame of transposed convolution: the complete 4×4 output after superposition is completed](</attachments/cs231n-a6090d62424a8811bd995634.png>)

The completion of superposition is the final 4×4 output. Looking at the five frames connected, transposed convolution is not mysterious - it "multiplies each input value by the filter, spreads it to the output according to the step size, and sums up the overlap." It shares the same set of weights as ordinary convolution, but the order of traversal is reversed. This also explains why it is called "transpose": convolution can be written as matrix multiplication, and transposed convolution is simply multiplying the transpose of the same matrix (the appendix on pages 151–152 gives this algebraic version).

![One-dimensional example: input two numbers a, b, filter x, y, z, the output is the result of weighted summation](</attachments/cs231n-07f4c62af16c4a5483d206d0.png>)

The one-dimensional example clears things up: the inputs are just a and b, and the filter is (x, y, z). The three copies of a occupy the output cells 1–3, and we get (ax, ay, az); the three copies of b are moved to the 3–5 cells in steps of 2, and we get (bx, by, bz). The third cell collides with the third cell of a, so the final output is (ax, ay, az+bx, by, bz). Input 2 numbers and output 5 numbers, which is exactly the amplification ratio of "kernel size 3, step size 2": $(2-1)\times 2+3=5$. Given the input length, kernel size, and stride, the output length can be checked immediately.

![Complete FCN: pooling and strided convolution are used for downsampling on the left, and unpooling or transposed convolution is used for upsampling on the right.](</attachments/cs231n-8ec6c66cc06a1cb421736775.png>)

Returning to the skeleton diagram, both columns are filled: downsampling is pooling or strided convolution, and upsampling is unpooling or transposed convolution. At this point, FCN's calculations are completed - it uses one network and one forward pass to output the entire segmentation map, which is several orders of magnitude faster than the sliding window. The real difference between the four upsampling methods is not "who is more advanced", but "who needs the information passed by the encoder": only the maximum unpooling requires the position recorded during pooling, and precisely because of this need, it recovers the boundaries most accurately; nearest neighbor and nail bed have no parameters at all, and the cost is that a large number of positions in the output are zero, which must be filled in by subsequent convolutions; transposed convolution has parameters, leaving "how to interpolate" to training, at the cost of multiplying the kernel once for each output pixel.

![The first frame of U-Net: The entire architecture diagram is U-shaped, with the resolution reduced all the way on the left and raised all the way back on the right](</attachments/cs231n-5756229bb6ac806601d6d895.png>)

U-Net is the best-known example of this route. The whole picture is U-shaped: the left half is the downsampling path, the number of channels increases from 64 to 1024, and the resolution drops all the way from 572×572 to 32×32; the right half rises back symmetrically, and finally outputs a segmentation map of the same size as the input. The lecturer emphasized that it is still a strong baseline in medical imaging - when you don't want to go to the basic model, U-Net and its variants can still give close to the best results.

![The second frame of U-Net: Marking the two consequences of the downsampling stage - the receptive field becomes larger and the spatial information is lost](</attachments/cs231n-c2a219a33c40c119ecc5a90c.png>)

The left half is characterized in this frame: downsampling makes the receptive field larger, and the model can see larger structures; the cost is that spatial information is discarded and the boundary position becomes blurred. These two things are the same coin - if you want to correctly judge "this is a cat", you have to look far enough; if you look far enough, you will inevitably lose "which pixel the cat's ears are at".

![U-Net third frame: Marking the task of the upsampling stage - mapping low-resolution features back to high-resolution](</attachments/cs231n-ff19aa4bba11791b9145f71f.png>)

The task on the right side is therefore clear: reconstruct high-resolution maps from low-resolution, semantically strong features. But the information has been lost, and upsampling alone cannot make it up, and the boundaries will be blurred.

![The fourth frame of U-Net: splicing the high-resolution feature maps of the down-sampling stage into the up-sampling stage](</attachments/cs231n-6c8b3a53893a2c137df0984e.png>)

The solution of U-Net is the horizontal gray arrow: copy the high-resolution feature map of the same resolution on the left, concatenate (concatenate) with the upsampling result on the right, and then convolve them together. This is the form of skip connection in segmentation - it does not change the depth of the network, it just passes the "lost spatial details" to the opposite side unchanged. Note that it is not the same thing as the residual of ResNet: the residual is added, retaining the numerical path; here is splicing, retaining the feature content.

![Semantic segmentation summary page: the same set of filters, a combination of downsampling and upsampling](</attachments/cs231n-8b9ba5e01a2d25871a61c1d6.png>)

The summary page condenses the entire chapter into one sentence: a segmentation network is a set of convolutional layers with downsampling and upsampling sandwiched in between. The lecturer answered another question here - are the transposed convolution filters trained? Yes, it is no different from other convolutional layers, and the gradients are returned as usual.

![Capability boundaries of semantic segmentation: only give pixel categories and do not distinguish instances](</attachments/cs231n-a105feedcb0616773cd69cea.png>)

The last page points out what this route cannot do: the output only has pixel categories. If there are two dogs on the picture, the model will say that both of them are dogs, but it does not know that they are two. The reason is not network capacity, but **There is no concept of "individual" in the supervision signal.**——The two dogs in the label map share the same category number, and the model has no basis to separate them. To answer "Is this the same one or two?", we must first have the concept of "object", so the topic turns to target detection.

## 4. The first problem of detection is the output length, and the sliding window is the first failed attempt at it.
*(Reference time: 00:33:29 – 00:38:37｜Lecture 9)*

The output of semantic segmentation is large and fixed, while the output of detection is small and floating. The latter is really troublesome. This chapter first defines the trouble accurately (one object has 4 numbers, three objects have 12 numbers, and any more is "many numbers"), and then looks at the two most simple fixed-length attempts-single-objective regression and sliding window-at which step each died. They die in different ways, but they lead to the same conclusion: **There must first be a cheap way to screen out "where"**.

![The four-frame diagram appears for the third time: the first two columns have been grayed out, and the brackets of Multiple Object are illuminated below the third and fourth columns.](</attachments/cs231n-f707becb7576c138a3105ef4.png>)

The first two columns were pressed into gray after the explanation, and the images in the third and fourth columns were still dark. Only the brackets of the "Multiple Object" below lit up first - it reminded them of what these two columns have in common: the output quantity is no longer fixed.

![Second frame on the same page: The Object Detection column is lit, and the three boxes of dog, dog, and cat are marked in different colors.](</attachments/cs231n-f94448951eb986dc2ec18328.png>)

The third column lights up: In the same living room photo, two dogs and a cat are surrounded by three different-colored frames, with the labels DOG, DOG, and CAT underneath. Classification only outputs one word, while detection outputs three (category, box) pairs, and the number "three" is unique to this picture.

![The architecture of single target detection: one trunk is connected to two heads, one produces 1000 class scores, and the other produces 4 box coordinates](</attachments/cs231n-33a91446b4d1c3c333bb851b.png>)

Assume that there is only one object in the picture, and the problem immediately degenerates into "classification + positioning". After the trunk, there are two parallel heads: full connection 4096→1000 for the category score, full connection 4096→4 for the box (x, y, w, h). The key understanding is that positioning can be regarded as a regression problem, and the four numbers in the box are four continuous variables.

![Two losses side by side: category score followed by Softmax loss, box coordinate followed by L2 loss](</attachments/cs231n-ab4057f1260ac23baaf4185e.png>)

The loss is also divided into two paths: Softmax cross entropy is used for categories, and L2 distance is used for frames. Because the frame coordinates themselves are real numbers, you can directly calculate the Euclidean distance between the prediction frame and the true value frame. The sentence "Treat localization as a regression problem!" on the page is the only thing you need to remember in this section.

![Multi-task loss: The two-way losses are added to a scalar and are back-transmitted together.](</attachments/cs231n-0dc84b0405a2625f99ed68d3.png>)

Add the two paths to get the multi-task loss  $L=L_{\text{cls}}+\lambda L_{\text{box}}$, a scalar, a backpass. The lecturer did not expand  $\lambda$  How to determine, but this structure remains almost unchanged in today's detectors: the classification head and the regression head share the backbone, and each has its own loss.

![In the case of multiple targets: the output becomes a variable-length list, each line is the category plus four coordinates](</attachments/cs231n-15ef76e3b62b6f18a16620fd.png>)

Once there is more than one object in the picture, the output becomes a list like CAT: (x,y,w,h), DOG: (x,y,w,h), DUCK: (x,y,w,h). The length of the list is not fixed, and the output layer of the network is a fixed-length matrix multiplication - this is the core contradiction to be solved in the entire chapter.

![The specific shape of the contradiction: one object has 4 numbers, three objects have 12 numbers, and any more is "many numbers"](</attachments/cs231n-1b20d3702bd3422c44313982.png>)

The slide draws this contradiction in three lines: 4 numbers for a single object, 12 numbers for three objects, and "many numbers" for more. The number of outputs required for each picture is different, so the path of "setting the output dimension to 4N" will not work - no amount of N is correct: if it is smaller, detection will be missed, if it is larger, it will be wasteful, and during training, the matching problem of "which slot corresponds to which object" must first be solved. Before going any further, it’s worth breaking down “detection” into four sub-questions that can be asked independently. Each subsequent chapter only advances one or two of them, and readers can use this table as a progress bar.

| subproblem | a word | What answer | In which chapter to advance? |
| --- | --- | --- | --- |
| There are several | The output length is determined by the image content, and the network will only spit out fixed-length tensors. | Fixed grid, fixed number of queries, top-K proposals, three fixed-length encodings | Top-300 in Chapter 5, Grids and Queries in Chapter 6 |
| where | The box is four real numbers and cannot be directly used as a category label. | Offset regression relative to proposal box, offset relative to anchor box, direct regression of DETR | Chapter 5 |
| what is | Give each box a category | Classification head, per-class SVM for R-CNN, class score for YOLO | Chapter 5–6 |
| How to remove weight | The same object is answered correctly by many boxes at the same time | Threshold filter + non-maximum suppression (NMS) | End of Chapter 6, Appendix page 170 |

The most underestimated aspect of this table is the last row. Deduplication seems to be just the finishing work, but in fact it bears the side effects of fixed-length encoding: the sliding window will answer the same object thousands of times, YOLO spits out 98 boxes in a picture, and RPN gives 2700 candidates at a time. **The denser the encoding, the more aggressive the deduplication must be.**, the two are two ends of the same account.

![The first frame of the sliding window method: take a background frame and ask the network, Dog? NO, Cat? NO, Background? YES](</attachments/cs231n-ba3baff8d96394e7457c4ef2.png>)

The first remedy is to turn detection into multiple classifications: take various crops on the image and let the CNN determine whether this is an object or background. The first frame is an empty box with three questions answered NO, NO, and YES in sequence.

![The second frame of the sliding window method: the frame slides onto the dog, Dog? YES](</attachments/cs231n-f6dd4c619739a90002cb6f6b.png>)

The box slides over to the dog, and the answer flips over: Dog? YES, Background? NO. The detection is thus split into "enumerating all frames + classifying frame by frame".

![The third frame of the sliding window method: the box moves slightly, but the answer remains the same](</attachments/cs231n-dba31ef7656c3f2c67b6e245.png>)

In the third frame, the frame is only moved a little, and the answer is still Dog? YES. This detail illustrates the hidden cost of the sliding window: adjacent positions are highly redundant, the same object is repeatedly confirmed as YES, and these YES require additional effort to merge into one in post-processing.

![The fourth frame of the sliding window method: the box falls on the cat, Cat? YES, and a question is thrown](</attachments/cs231n-f6f7fcaeb2e3b4cdf93a9d22.png>)

Cat? YES when the box falls on the cat. A question is thrown in the lower right corner of the page: What is the problem with this method?

![The fifth frame of the sliding window method: the combination of position, scale, and aspect ratio is explosive, and it is not feasible to run CNN one by one](</attachments/cs231n-ffed9f659a73b7f26a1572aa.png>)

The problem is written in one sentence: CNN needs to be run on a huge number of positions, scales and aspect ratios, which is completely computationally unacceptable. This is the same disease as the sliding window of semantic segmentation - splitting "one forward" into "tens of thousands of forwards". The difference is that the sliding window for segmentation is H × W times (two-dimensional enumeration), and the sliding window for detection is position × scale × aspect ratio (three-dimensional enumeration), which is more expensive.

![Region proposal: First use a cheap method to find blocky areas that look like objects, and selectively search for 2,000 of them in a few seconds.](</attachments/cs231n-9fd2b8768e8e05f61fff3fd8.png>)

So there is a region proposal: first use a method that does not require a neural network to find the "blocked, object-like" areas on the map. The slide shows a selective search - about 2000 proposal boxes are given in a few seconds on the CPU. The footer also lists three contemporaneous routes of objectness, BING and EdgeBoxes by Alexe et al. This step does not determine the category, but only determines "there may be something here", so it can be done quickly and roughly. The lecturer said that this was the mainstream idea around 2014: split "where" and "what" into two problems, and use the most appropriate tools to solve each problem. The price also comes -**The proposed algorithm and the detection network are two independent systems. The errors of the former cannot be corrected by the latter, and the gradients of the latter cannot be transmitted back to the former.**. This crack won't be patched until the RPN at the end of Chapter 5.

## 5. From R-CNN to RPN: Incorporate "where" from external algorithms into the same feature map
*(Reference time: 00:38:48 – 00:43:12｜Lecture 9)*

With suggestions, detection becomes a three-step process of "cutting out, classifying, and fine-tuning the frame." Each of the three iterations of this chapter reduces repeated calculations: R-CNN calculates the same convolution 2000 times, Fast R-CNN only calculates it once, and Faster R-CNN simply inserts the proposal into this time. Behind the three changes is the same observation——**Convolution preserves spatial correspondence, so the position on the feature map can be used as pixel coordinates**.

![R-CNN first frame: input image](</attachments/cs231n-0652d383e97155d11f3b0be0.png>)

The first frame of R-CNN only has the input image. This picture is from Girshick et al.'s 2014 paper, and the next seven frames are added to it with components.

![R-CNN second frame: about 2000 regions of interest from the proposed method](</attachments/cs231n-1b5ef6547ff34fb612ef92e8.png>)

Regions of interest (RoI) are added at this frame, numbering about 2k. Note that these boxes are of different sizes, and CNN requires a fixed input size, so it must be deformed in the next step.

![R-CNN third frame: Each region is warped into a fixed size of 224×224](</attachments/cs231n-126b058b12f08134f871542a.png>)

The third frame forcibly stretches the pixels in each frame to 224×224. This warp would destroy the aspect ratio - a slender dog would be fattened - and was one of the details that R-CNN was later criticized for, but at the time it allowed "arbitrary boxes" to be fed into the standard classification network.

![The fourth frame of R-CNN: Each region is passed through a convolutional network separately, and the weights come from ImageNet pre-training.](</attachments/cs231n-109ccf3f9e48ba5ff714e488.png>)

The most expensive step occurs in the fourth frame: each area after the warp must pass through the convolutional network completely. 2000 boxes is 2000 forwards, and a large number of pixels among them are duplicates—neighboring proposal boxes often overlap by more than half.

![R-CNN fifth frame: The features of each region are connected to an SVM for classification](</attachments/cs231n-c5502c15149e6d2dd6557934.png>)

The fifth frame connects an SVM classifier to each region and outputs the category. R-CNN does not use Softmax but one SVM for each class, which was the practice of that era; it means that the classifier and the convolutional network are trained separately, and the gradients are not shared.

![R-CNN sixth frame: Add a box regression head to predict (dx, dy, dw, dh) four corrections](</attachments/cs231n-f6467236f951196e16e6467e.png>)

The sixth frame is supplemented with frame correction: it does not directly predict the absolute coordinates, but predicts four correction amounts (dx, dy, dw, dh) relative to the proposed frame, and "moves a little, shrinks a little" the frame. The reason for using relative quantities instead of absolute quantities is that the same object must be correctly returned at different positions. Absolute coordinates will force the network to remember the position. This idea of ​​"predicting relative quantities" will appear twice in different forms in anchor boxes and DETR.

![R-CNN Frame 7: The problem is written on the same page - about 2000 independent forwards per image, very slow](</attachments/cs231n-42aa2d8a8d957a3545123aaf.png>)

In the seventh frame, the cost is written out: each picture requires about 2k independent forward passes. This is the reason why R-CNN is an engineering death sentence and the starting point for all improvements in the next section.

![The breaking point of "slow" R-CNN: first let the entire image go through convolution once, and then crop the feature map](</attachments/cs231n-cf7c25a095a3e4b246c93315.png>)

There is only one idea to break the situation: convolution retains spatial information, and there is a clear correspondence between the position on the feature map and the pixel position, so why not wait until the entire image is convolved before cropping? This page is marked with red letters "Idea: Pass the image through convnet before cropping! Crop the conv feature instead!" - 2000 forwards become 1. The premise for this idea to be established is the translational equivariance of convolution: the pixel coordinates divided by the total step size are the feature map coordinates.

![Fast R-CNN first frame: On the left is the slow R-CNN architecture to be modified](</attachments/cs231n-d5cf160699d126e4fa74c956.png>)

The six frames of Fast R-CNN are layer-by-layer construction of the same architecture diagram. In the first frame, the old architecture is placed on the left for comparison, and the right is the position that the new pipeline will occupy.

![Fast R-CNN second frame: The entire image is passed through the backbone network once to obtain conv5 features](</attachments/cs231n-78d5e512beb0c252c81f0626.png>)

Add the backbone to the second frame: the entire image is passed through ConvNet once to obtain the conv5 feature map. The backbone can be any one of AlexNet, VGG, and ResNet. The slide lists them side by side under "Backbone network" - the accuracy and speed of the detector are largely determined by this choice. This is also the starting point for the "backbone network" to become an independent research direction later.

![Fast R-CNN third frame: RoI given by the proposed method is directly projected onto the feature map](</attachments/cs231n-06e501644c7fbe5b54242caa.png>)

The RoI is projected onto the feature map at this frame. Because convolution is translationally equivariant, the relative position of a box on the two images is the same, so the projection only needs to be divided by the total step size.

![Fast R-CNN fourth frame: crop and scale to fixed size on feature map](</attachments/cs231n-9d880a75353d7199b5252d09.png>)

In the fourth frame, do "cropping + scaling features". This step is the prototype of RoI Pool. Specifically, how to compress a feature area of ​​any size into a fixed size. The slides are left in the appendix (pages 153–159). The core is "cutting the grid + taking the maximum of each grid", at the cost of the dislocation caused by two quantizations.

![Fast R-CNN fifth frame: Each area is connected to a small network, and categories and box offsets are output at the same time](</attachments/cs231n-f205c7692d3fef683a6db76b.png>)

The fifth frame is Per-Region Network: each RoI feature is connected to a very small header, one linear + Softmax output category, and one linear output frame offset. At this point, each picture only passes through the main trunk once, and the cost is reduced from 2000 forward times to 1 time plus 2000 small heads - the calculation amount of the small heads is not of the same order of magnitude as that of the main body.

![The sixth frame of Fast R-CNN: complete pipeline, backbone once, lightweight by region](</attachments/cs231n-b250d0103dad841a3ecd52a0.png>)

The sixth frame puts the entire pipeline together. The lecturer's evaluation of this line is that it advances detection from "impossible in real time" to "can talk about speed", but there is still one bottleneck that has not been solved - the 2,000 proposals still come from an algorithm that has nothing to do with the network. The actual measurement numbers in the appendix make this calculation very clear: Fast R-CNN takes 2.3 seconds end-to-end, and only 0.32 seconds when proposals are removed. **Proposals eat up 85% of the time**.

![The first frame of the region proposal network: a 3×640×480 image is passed through CNN, and 512×20×15 features are obtained](</attachments/cs231n-bbf9d0eff7e656a311facfd7.png>)

The third bottleneck is the proposal itself. Since the backbone has turned the picture into a 512×20×15 feature map, why not directly predict “where there may be objects” on this picture? This is how RPN comes about: input 3×640×480, output 512×20×15, each spatial position corresponds to a 32-pixel square grid on the original image (640/20 = 32).

![RPN second frame: put a fixed-size anchor box on each point of the feature map](</attachments/cs231n-f31878c1a46f2efb4eb67b18.png>)

The anchor box (anchor) was introduced in this frame: a fixed-size box is placed at each point on the feature map. Its function is to turn the "prediction box" into "predicted offset relative to the anchor box." This is the same idea as R-CNN's (dx, dy, dw, dh), except that this time the reference frame is pre-laid, not given by an external algorithm.

![The third frame of RPN: perform a binary classification for each point, determine whether there is an object in the anchor box, and output 1×20×15](</attachments/cs231n-042694dbc3fd557a49c92226.png>)

Add the first head to the third frame: perform two classifications for each position, determine whether there is an object in the corresponding anchor box, and output a 1×20×15 objectness map. Note that there are no specific categories here, only "object/background" - completely separating "is there" and "what is" is the reason why RPN can be done cheaply.

![The fourth frame of RPN: Correct the sample and then regress 4 correction amounts, output 4×20×15](</attachments/cs231n-8f13a4e04ddda324c8356513.png>)

Add the second header to the fourth frame: For the positive box, return it to the four corrections of the true value box, and output 4×20×15.

![RPN fifth frame: Actually using K anchor frames with different scales and aspect ratios, the output becomes K×20×15 and 4K×20×15](</attachments/cs231n-841d17eb97d18e6fa2cc18f7.png>)

The number of anchor boxes changes from one to K, covering different scales and aspect ratios. So the channel numbers of the two output images are multiplied by K respectively: the objectness is K×20×15, and the frame transformation is 4K×20×15. This step changes "multi-scale" from a network structure problem to a channel number problem - the same feature map is explained by K sets of different reference frames.

![RPN sixth frame: Sort K×20×15 boxes by objectness, and take the top 300 as proposals](</attachments/cs231n-c9c2d35da79c5ed9ad9fcfd6.png>)

The sixth frame is the ending: sort the K × 20 × 15 boxes by objectness, and take the top 300 as proposals. Calculating K=9, 20×15=300 positions, there are a total of 2,700 candidate boxes, of which only about 300 enter the second stage——**RPN here suppresses "dense prediction" into "sparse proposal"**, and these 300 boxes are the first formal answer to the sub-question "How many are there?": it is not counted, but the first K ones are sorted. At this point, the calculation of the two-stage detector is completed: the first-stage proposal and the second-stage classification regression share the same feature map and the same forward direction. The lecturer gave a very practical evaluation in the Q&A: This type of model is rarely used today because they still essentially need to be run twice (once to generate proposals and once to classify by region), which is too computationally intensive; but understanding how it got to this point is the prerequisite for understanding all subsequent single-stage models.

## 6. Single stage and query: YOLO uses grid to replace speed, DETR uses query to replace anchor box
*(Reference time: 00:44:35 – 00:57:38｜Lecture 9)*

The remaining question at the end of the previous chapter is: can the second stage also be eliminated? If it could, the proposal wouldn't have to be turned into 300 boxes and then sorted one by one, but the categories and boxes could just be spit out at each location. This chapter gives two answers, in completely opposite directions: YOLO uses **fixed grid** To hardcode "where" into the subscript of the output tensor, DETR uses **Fixed number of queries** Turn "how many" into a learnable slot array. The former writes the prior in geometry, while the latter leaves the prior to training.

![Single-stage detector overview: grid, B reference boxes per grid, 5 numbers per box plus class C score](</attachments/cs231n-ba2e6b2c9f38eb2854be1cd6.png>)

Taking the idea of RPN one step further is a single-stage detector: it is no longer divided into two stages: "proposal" and "classification", and the frame and category are directly displayed on each grid at the same time. The account given in the slide is very clear: the image is cut into a 7×7 grid, each grid has B reference boxes, each box has 5 numbers (dx, dy, dh, dw, confidence), plus C category scores, the output tensor is  $7\times7\times(5B+C)$. Taking B=3 and C=20, there are a total of 7×7×35 = 1715 numbers - a fixed-size tensor, and the problem of variable length is completely eliminated. The last comment on the page is spot on: it's a lot like RPN, but category-related.

![YOLO first frame: title page, focusing on real-time detection](</attachments/cs231n-149a803767498760df6f826e.png>)

YOLO (You Only Look Once) is the most famous name of this route, and the title says real-time object detection. The lecturer said that even today, it is still widely used as a baseline in industrial applications because it is fast and accurate; he also reminded that the literal meaning of the name is its design philosophy - look at the entire picture only once.

![YOLO second frame: the image is divided into an S×S grid](</attachments/cs231n-382699326ff1e105a7b9aaa4.png>)

The secret is all in this frame: divide the picture into an S×S grid (this version is 7×7). Each grid is only responsible for the small area it covers. The allocation problem of "which box belongs to which object" is directly decided by the grid position - no proposal or Hungarian matching is required. The price is that objects on the grid boundary are easily missed or repeated. This defect is later alleviated by multi-scale features and anchor boxes.

![YOLO third frame: Each grid outputs P(object), the coordinates of B boxes, and P(class)](</attachments/cs231n-6411653745453c3078185796.png>)

The third frame lists three outputs for each grid: the probability that there is an object in the box P(object), the B bounding boxes (x, y, h, w), and the probability of belonging to each category P(class). These two items are separated: the former answers "Is there something here?" and the latter answers "What is that thing?" The multiplication is the confidence that this box belongs to a certain category.

![YOLO fourth frame: Take B=2, only two boxes appear in each grid](</attachments/cs231n-be5d93ecc5b18dae64b7fcf5.png>)

B is set to 2 in this frame. This number is small, meaning that each grid is responsible for at most two objects - enough for a 7×7 grid, since the centers of objects usually fall in different grids.

![The fifth frame of YOLO: Each of the two boxes has a probability, and the grids do not interfere with each other.](</attachments/cs231n-bd224ef4b5b2f70789fb06ac.png>)

The fifth frame shows the respective probabilities of two boxes in the same grid. They are output in parallel, and the network does not need to choose between the two boxes, the choice is left to post-processing.

![YOLO 6th frame: The whole picture is covered with boxes, each box has a probability, and the thickness of the line indicates the probability.](</attachments/cs231n-25428a707a01e705731cdb4f.png>)

All grid frames are stacked back to the original image, and the thickness of the line is the probability. At this point, an image yields 7×7×2 = 98 boxes, the vast majority of which are background or repeats – this is the price a single-stage detector pays for speed: **The answer is full of redundancy and needs to be squeezed out later.**.

![YOLO seventh frame: final detection result after threshold plus non-maximum suppression](</attachments/cs231n-04fa918dbaede17a2bb7b026.png>)

The seventh frame is the result of post-processing: first filter by probability threshold, then use non-maximum suppression (NMS) to remove overlapping duplicate frames, and the rest is the final detection. The lecturer did not expand on the details of NMS, only saying that it is the standard finisher of this type of detector; its rules are actually very simple - sort by score, take the highest-scoring box each time, delete all the boxes whose IoU exceeds the threshold, and repeat until the list is empty.

![DETR first frame: CNN extracts features, Transformer encodes and decodes, directly outputs a set of boxes, and uses binary matching to calculate the loss](</attachments/cs231n-3c44e2b51eb2cb4cd88a193f.png>)

The third route deletes the entire "anchor frame". The pipeline of DETR is: CNN extracts features → Transformer encoder-decoder → directly outputs a set of boxes; during training, bipartite matching is used to pair the prediction box with the true value box, and then return the coordinates. The sentence "No anchors, no regression of box transforms" on the page is the key point of this page - it does not even require the concept of "relative anchor box offset". This step is connected to Chapter 1: the decoder input of DETR is the promotion of the classification token in ViT. Classification token is a learnable vector, responsible for collecting global information and outputting a category; object query is a set of learnable vectors, each responsible for collecting **an object** information and output (category, box) or "no object". From "one slot" to "N slots" is the entire difference from classification to detection.

![DETR second frame: amplify the backbone, CNN followed by position encoding](</attachments/cs231n-9ee484e70a4a483df65970a6.png>)

Starting from this frame, the slide zooms in on each of the three components of the pipeline. First zoom in on the backbone: the feature map output by the CNN must be added to the position encoding, otherwise the Transformer cannot distinguish the spatial position - this is the same problem as the position embedding in ViT, except that the token here comes from each spatial position of the feature map.

![DETR third frame: Position encoding and features are added element by element and sent to the encoder](</attachments/cs231n-f9a69a4bb6024abd4b61f022.png>)

The interior of the backbone is completed in the third frame: the feature map and the position encoding are merged at the plus sign. At this point, a picture has been turned into a string of tokens with positions, which is consistent with the input form of ViT.

![DETR fourth frame: Inside the encoder is a standard Transformer encoder](</attachments/cs231n-224746a79be6e9a0bd407e19.png>)

The camera moves one layer closer and falls on the encoder: multi-layer self-attention plus MLP, the input and output are the same string of tokens. The number of tokens here is determined by the feature map (the scale of the previous RPN page is 20×15 = 300), which is much smaller than the number of pixels, so the self-attention of O(N²) is affordable here - this is where the inference in Chapter 1 that "the feasibility of the same operator is different at two resolutions" comes into effect.

![DETR fifth frame: The decoder is connected after the encoder, and the input terminal has a set of learnable object queries.](</attachments/cs231n-c0fcc8fbc6e16f9d3774b6c3.png>)

The fifth frame adds the decoder: it uses the output of the encoder as a key and the input is a small set of learnable query vectors (object queries). The lecturer emphasized this point repeatedly - these queries are not image blocks, nor are they pre-laid frames, but a bunch of trainable parameters, and the network learns "what to focus on for each query" by itself.

![DETR Sixth frame: Each query outputs a (category, box) or no object after FFN, and the right side is the final detection](</attachments/cs231n-f9b8ce418377bc90c42f2ad5.png>)

The last frame is supplemented with the prediction head: the output of each query is passed through an FFN, and a category plus a box is obtained, or it is judged to be no object (∅). The picture on the right is the final result - two seagulls claimed by two queries. The instructor explained the capacity implications of this design: **The number of queries is the maximum number of objects you allow the model to detect in a picture.**, objects exceeding this number can only be discarded, so they must be adjusted according to the data set. There are three boundaries worth remembering during class Q&A. First, there is no explicit one-to-one correspondence between queries and objects. They are naturally staggered through layers of self-attention and cross-attention, and supervision solidifies this division of labor. Second, DETR only uses category labels and frames for training, and does not require pixel-level segmentation; conversely, when there are segmentation labels, it can be converted into frames to feed it. Third, fully supervised detectors cannot generalize to categories that have not appeared in the training set and can only output "no objects" - zero-shot detection is another line of research. Arranging the five generations of models in a table, it can be seen that the only change in each iteration is the "fixed length" move, while the solutions to the two sub-problems of "where/what" are almost unchanged.

| model | Year | How to make variable-length output fixed-length | per picture forward | Do you want external proposals? | main bottleneck |
| --- | --- | --- | --- | --- | --- |
| R-CNN | 2014 | Give 2k suggestions externally and output one frame at a time | about 2000 times | Yes (selective search) | The convolution is recomputed 2000 times |
| Fast R-CNN | 2015 | Same as above, but features only count once | 1 time + small head per area | Yes (selective search) | Proposals account for 85% of the time end-to-end |
| Faster R-CNN | 2015 | RPN produces 2700 candidates, and selects top-300 | 1 time | No | The second stage still needs to be calculated regionally |
| YOLO / SSD / RetinaNet | 2016–2017 | fixed grid  $7\times7\times(5B+C)$ | 1 time | No | There are many redundant boxes and weak small targets. |
| DETR | 2020 | N queries each appear in a box or ∅ | 1 time | No | The number of queries is the upper limit of capacity. If it exceeds the capacity, it will be lost. |

```mermaid
flowchart TD
    A["Variable length output: K category, box,K determined by image"] --> B{"How to compress it into a fixed length tensor"}
    B -->|"Enumerate all locations"| C["Sliding window: location × scale × aspect ratio<br/>Forward once per frame, not feasible"]
    B -->|"Screen candidates first and then classify them"| D["Area Proposal: Selective Search<br/>CPU Give me a few seconds ~2000 box"]
    B -->|"fixed number of slots"| I["DETR：N a object query<br/>Each out of a box or ∅"]
    D --> E["R-CNN：once per frame CNN forward<br/>~2k times/Figure"]
    E -->|"Convolution preserves spatial correspondence"| F["Fast R-CNN：trunk 1 times<br/>Do it on the feature map RoI Pool"]
    F -->|"Proposal becomes a bottleneck"| G["Faster R-CNN：RPN make suggestions<br/>K anchor box → top 300"]
    G -->|"Can the second stage be removed?"| H["YOLO / SSD / RetinaNet<br/>Grid directly out of frame 7×7×(5B+C)"]
    G -.->|"Another way of thinking: don’t lay out the frame, learn to query"| I
    H --> J["Post-processing: Thresholding + NMS Remove duplicates"]
    G --> J
    I --> J
    J --> K["Final inspection: K category, box"]
```

There is an easily overlooked dotted line in the picture: DETR does not evolve from YOLO. It bypasses the entire "frame-regression offset" technology stack and only retains the idea of "a fixed number of output slots". This is also the reason why this module is placed at the end - it proves that fixed-length optimization does not necessarily rely on geometric priors, but can also rely on a set of learnable parameters.

## 7. Instance segmentation: Add a 28×28 branch next to the detection head, and align the boundaries by the way.
*(Reference time: 00:58:01 – 01:01:31｜Lecture 9)*

The detection answers "how many, where, and what", and the rest is "shape". The lecturer's approach to this chapter is very simple: instance segmentation does not require a new architecture, it only requires an additional output on the detector. The real technical content is not in the action of "adding a branch", but in two details - why the mask must be output by class, and what exactly RoI Align has changed compared to RoI Pool. These two details determine whether the border of the mask is clean or blurry.

![The four-segment diagram appears for the fourth time, and the highlight moves to the fourth column. Instance Segmentation](</attachments/cs231n-99d7dcb17c2c99760b3fa2e8.png>)

The fourth column requires both: individual classification and pixel-level masking. Note that it shares the brackets "Multiple Object" with detection. The only difference is that there is an extra mask in the output - this is what this chapter will prove.

![Bridge from detection to instance segmentation: Faster R-CNN’s skeleton is left intact](</attachments/cs231n-5cf78f7bfaccad07e63086b2.png>)

This page has only one line of title, which is used to treat the end of the previous chapter as the starting point of this chapter. The lecturer's logic is: R-CNN's "backbone → proposal → region-by-region classification and regression" pipeline does not move, and only hangs another head in each region.

![Mask R-CNN first frame: Add a small mask network to each RoI and output a 28×28 binary mask](</attachments/cs231n-aafcf2fe328b8da94f258d6b.png>)

So there is Mask R-CNN: in addition to the original classification head and box regression head, a small branch is added to each RoI, and a small fully convolutional network is used to predict a 28×28 binary mask. The lecturer emphasized that this mask is "one per RoI" and has nothing to do with the size of the object in the input image - 28×28 is a fixed resolution. For a person who fills half of the image and a person in the distance, the mask is 28×28.

![Mask R-CNN second frame: CNN plus RPN to get RoI, RoI Align to get 256×14×14 features](</attachments/cs231n-ba4138624a4eda60b41b3fe1.png>)

In the second frame, the account at the input end is clearly written: the backbone plus RPN gives the RoI, and RoI Align aligns and samples the features of each RoI into 256×14×14. Use Align instead of Pool because pooling requires the frame to be "adsorbed" to the integer grid. Two quantizations will cause a few pixels to be misaligned. For classification, a few pixels don't matter, but for masks, misalignment is a blurred boundary.

![Mask R-CNN third frame: after two convolutions, a 28×28 mask is produced for each category](</attachments/cs231n-9d63d51fb58e69ade74c1580.png>)

The third frame is supplemented with a mask branch: the 256×14×14 features are passed through two layers of convolution, and the output is C×28×28—one mask for each category, rather than one shared by all categories. In this way, the mask branch is decoupled from the classification branch. If the classification is wrong, the mask will not be drawn incorrectly; computationally, it only needs to change the output channels of the last two convolutions from 1 to C, which is very costly.

![The first frame of the mask training target: a chair marked with a red box in the bedroom, and on the right is its binary target on the grid](</attachments/cs231n-bb44aa92343f0bf1373422bf.png>)

The true value of the mask is not a semantic label map, but a binary map of "which pixels belong to this object inside this RoI." The first set of examples makes the source clear: the red frame on the left encircles a chair between the bed and the cabinet, and the image on the right is the binary shape of the chair on a 28×28 grid, with jagged edges - this is the quantization brought about by fixed low resolution.

![The second frame of the mask training target: stack another group below, and change a mask when changing a frame.](</attachments/cs231n-6f8b27bc2177c211a615fe3f.png>)

The second frame has another set stacked below: the same room, the frame has been moved slightly, and the edges of the mask have also changed. The lecturer used this to explain the learning goal of the mask branch - it learns "who does this pixel in the frame belong to", rather than memorizing the shape of the entire class of objects.

![Mask training target third frame: complete the third group, and the examples begin to be arranged in a grid](</attachments/cs231n-642dc8cc2acfc9b9a2e587df.png>)

The third frame fills in the third group, and the page changes from vertical layout to grid layout. Putting the three groups together, it becomes clear that "the mask is one-to-one with the frame, not one-to-one with the image."

![Examples of four mask training targets for Mask R-CNN: chair, chair under pine frame, person on bed, bed and person](</attachments/cs231n-f603dcfb7a19fac6283d7962.png>)

The four groups are complete: the upper right group of frames is relaxed, and the mask becomes wider; the lower two groups are replaced by the people on the bed and the bed itself. These four pairs of samples explain the design of "one 28×28 for each category" - in the same frame, different categories should have different masks (a person is sitting on a bed, and there are both human pixels and bed pixels in the frame), so the mask header must output C images by category, not just one.

![Mask R-CNN detection and segmentation results: multiple objects, occlusions, and small targets can be separated](</attachments/cs231n-6fb8d8ae7f7eaae172adf97a.png>)

The results page is the persuasiveness of this chapter: people and objects in the same picture are framed and masked separately, and the occlusion relationship can be handled. The lecturer's original words were "results have been very, very good", but he immediately added a realistic comment - this type of two-stage model is rarely used today because it is too computationally intensive.

![Mask R-CNN can also be used to identify key points of the human body, replacing the mask branch with key point heat maps.](</attachments/cs231n-84c3843215f5107b3c36f9b9.png>)

The same framework can also be used for pose estimation: replace the mask branch with a key point heat map, one for each person, and you will get the human skeleton. This shows that "one small full convolution branch per RoI" is a universal interface, and what is output depends on how you connect the branch - masks, key points, and even coarse-grained versions of segmentation are all different plug-ins for the same slot.

![Open source implementation: TensorFlow Detection API and Detectron2, both with pre-trained weights](</attachments/cs231n-2fefa663adcbb489218ecfcc.png>)

There are ready-made projects for implementation: TensorFlow Detection API includes Faster R-CNN, SSD, RFCN, and Mask R-CNN; Detectron2 (PyTorch) includes Mask R-CNN, RetinaNet, Faster R-CNN, RPN, Fast R-CNN, and R-FCN. In both places, you can use the pre-trained model to fine-tune your own data - this is also the standard posture of transfer learning on detection tasks.

![Review four types of tasks: classification, semantic segmentation, detection, and instance segmentation output morphology comparison](</attachments/cs231n-40711c2e5f4da010ba11cde5.png>)

The review page puts the four types of tasks side by side on the same picture. The lecturer gave a very practical starting point here: the combination of these tasks still appears on industrial assembly lines, such as sorting rotten tomatoes - first detect each tomato, and then classify whether it is good or bad. The two tasks are strung together to form a usable production line. Arrange the split branch line according to "output granularity". This lecture actually goes to three levels. Each time the granularity goes down, the output has one more dimension, and the network only needs one more branch.

| Granularity | output | Individually? | What labeling is needed | This lecture corresponds to |
| --- | --- | --- | --- | --- |
| semantic level | One category per pixel | No | Pixel-by-pixel class map | Chapter 3: FCN and U-Net |
| instance level | One 28×28 mask + one box per instance | is | box + instance mask | Chapter: Mask R-CNN |
| component level | A set of keypoint heatmaps per instance | is | Key point coordinates | Posture branch on page 123 |

The relationship between the three levels is not a substitution, but a superposition: the frame for instance segmentation comes from detection, the backbone of detection comes from classification, and the loss of classification comes from the first module. This also explains why the order of the lecturer is classification → semantic segmentation → detection → instance segmentation - each level treats the output of the previous level as its own input.

## 8. Interpretability: Point gradients to pixels and weights to feature maps
*(Reference time: 01:01:37 – 01:10:14｜Lecture 9)*

The first half asked "What does the network output?", and the second half changed the direction: Why does the network output like this? The motivation given by the lecturer is very practical - in medical imaging, no one cares about the sentence "Is there a tumor?" but what they care about is where the tumor is; and the latter question can only be answered through visualization. The three tools in this chapter are progressive: filter visualization looks at weights, saliency maps find gradients over pixels, and CAM multiplies fully connected weights back into feature maps. The common confidence among the three is the same nature——**Convolutions are spatially consistent, so positions on the feature map can be traced all the way back to the input image**.

![The agenda page appears for the second time, with red falling on Visualization and Understanding](</attachments/cs231n-580be606db61ae35ba53b40f.png>)

The agenda page appears for the second time, and the remaining ten minutes belong to the second block. The lecturer himself said that this was originally content that could be taught in a separate class. Here I only select the most important ones.

![Visual interpretation of the linear classifier: each category corresponds to a template, and the car category is a front-facing car](</attachments/cs231n-d3839ee358d570a93b3f0282.png>)

Returning to the linear classifier in the first lecture: each row of the weight matrix can be reshaped into a graph, which is a template of this type. The template of the car category looks like a front-facing car, because most of these samples in the training set have this posture. This page gives an analogy - if the weights of the linear model can be seen, the weights of the convolution kernel should also be visible.

![First layer filter: AlexNet’s 64 3×11×11 convolution kernels are directly drawn into 64 small pictures](</attachments/cs231n-39d5e3799d25e7e7b3157867.png>)

The convolution kernel of this layer is 64 3×11×11 filters: 64 is the number of filters, which determines the number of output channels; 3 is exactly equal to the number of input channels, so each filter can be directly displayed as an 11×11 color picture. What you see are edges, stripes, patches of color—the most basic detectors of direction and frequency.

![Let’s look at the same layer using three networks: 64×3×7×7 cores of ResNet-18, ResNet-101, and DenseNet-121](</attachments/cs231n-f66d4a1bcaf935cf562f3175.png>)

Switching to ResNet and DenseNet, the core of the first layer becomes 64 3×7×7, and the drawing is still a bunch of stripes and color blocks. Three networks with an order of magnitude difference in depth, but the first layer looks very similar——**The first layer eats pixels directly. What can be learned is limited by the input statistics and has nothing to do with the subsequent depth.**. The lecturer also pointed out the boundaries of this method: only the layer with the number of channels equal to 3 can be directly drawn into an RGB image. The middle layer often has hundreds of channels and cannot be viewed directly.

![The forward part of saliency: the image is passed through the network and the score of the Dog category is obtained](</attachments/cs231n-4cd1bbdaeb1d1a0026e6e83d.png>)

Start with this page and ask a different question: Which pixels on the image contribute to this score? In the first frame, only the forward direction is performed, turning the picture into the probability of the category "Dog".

![The reverse part of saliency: the category score calculates the gradient of the pixel, takes the absolute value, and then takes the maximum of the three RGB channels.](</attachments/cs231n-6935e0885604d504c58a326b.png>)

The key step is to change the object of derivation. What is sought during training is the gradient of the loss versus the weight. What is sought here is the gradient of the category score versus the pixel - "If this pixel moves a little, how much will the dog's score change?" The obtained tensor is of the same shape as the input (3×H×W). The absolute value is taken and the maximum of the three channels is taken, and compressed into an H×W grayscale image, which is the saliency map. In the picture in the lower right corner, the outline of the dog is faintly visible. This step is performed on the same machine as the backpropagation of the second module, but different questions are asked: At that time,  $\partial L/\partial W$  Update parameters, now use  $\partial S_c/\partial x$  Interpret input. Gradient doesn't have to be just for training.

![Saliency map batch results: the subject can be drawn out in different categories and different images](</attachments/cs231n-1a95fa4c6b77af42f0102cb6.png>)

Looking at several pictures, the saliency map can generally outline the subject, but the edges are very fragmented and the background is also responsive. The lecturer commented on it as "very effective in many cases", but did not say that it was reliable - the gradient tells you which pixels are sensitive, but does not tell you which area the network has established a category concept. To answer the latter question, a different weighting method is needed.

![The structure of CAM: the last layer of convolutional features is used for global average pooling, and then a fully connected layer is used to obtain the score.](</attachments/cs231n-9dfa8bbb1789d42d0589c319.png>)

CAM has changed its perspective: it does not change the network, only the reading method. It requires the network to use global average pooling (GAP) at the end to compress the H×W×K feature map into K dimensions, and then pass through a fully connected layer to obtain C scores. This structural constraint is both the reason why CAM works and why it can only be used at the last level. Note that this step has the same structure as the pooling head of ViT in Chapter 1: GAP averages out the spatial information and obtains a fixed-length vector. All derivation of CAM is based on this "average" - precisely because each spatial position pair  $F_k$  Only when the contributions are equally weighted can the summation be broken down and the weight be multiplied back to each position.

![The first step of CAM: Global average pooling compresses each feature map into a number](</attachments/cs231n-775347c6e809d1cd19810b1d.png>)

The first step is the definition of GAP: $F_k=\frac{1}{HW}\sum_{h,w} f_{h,w,k}$  K feature maps become K numbers, and the spatial information is averaged here - but precisely because it is averaged, each spatial position is  $F_k$  The contributions are equally weighted, which leaves the door open for subsequent pushback.

![CAM Step 2: Expand the score into "weight × pooled features"](</attachments/cs231n-0f7e8010904282d3711420c3.png>)

The second step is to write the score as the weighted sum of the pooled features: $S_c=\sum_k w_{k,c}F_k$. At this point, the C category scores are already the weighted sum of K pooling numbers, and the spatial information is not yet visible.

![CAM derives the second frame: Substituting the definition of pooling, the score becomes the double sum of weights and features](</attachments/cs231n-1ab0a6bfc93a59f493808939.png>)

The second frame  $F_k$  Substitute the definition of: $S_c=\frac{1}{HW}\sum_k w_{k,c}\sum_{h,w}f_{h,w,k}$. At this time, the outer layer is still the channel summation, and the space summation is still included in it.

![CAM derives the third frame: exchange the order of the two summations, and the spatial index becomes the outermost layer](</attachments/cs231n-6e775b28b7547cceb34d7302.png>)

The third frame only does one thing - exchange the summing order: $S_c=\frac{1}{HW}\sum_{h,w}\sum_k w_{k,c}f_{h,w,k}$. This step is the key to the entire CAM. Once the spatial index is outer, the term in parentheses is used for each  $(h,w)$  It can be calculated individually, and after calculation, one pixel is a score. The lecturer explained here the confidence of "why we can recover the image space all the way": convolution is spatially consistent, and the position on the feature map has a fixed correspondence with the center of the receptive field on the input map.

![CAM Frame 4: Label the product of w and f as the core term](</attachments/cs231n-1aeecd80899970cd7f385a3c.png>)

The fourth frame  $w_{k,c}f_{h,w,k}$  Frame it separately: the kth feature map is at the position  $(h,w)$ ’s activation, multiplied by its importance weight for class c. After this step, there is only a summation distance between the "category score" and the "spatial position".

![CAM fifth frame: Define the category activation map M, with a shape of C×H×W](</attachments/cs231n-6fa3be894902779758cc7076.png>)

The last frame gives the definition: $M_{c,h,w}=\sum_k w_{k,c}f_{h,w,k},\qquad M\in\mathbb{R}^{C\times H\times W}$. The entire CAM is based on this line of formula - treat the K weights belonging to the c-th category in the fully connected layer as the weighting coefficients of K feature maps, add them and then upsample them back to the original image size. It's not a new network; **A reinterpretation of existing weights**.

![CAM results: heat maps of five categories: palace, dome, church, altar, and monastery.](</attachments/cs231n-36759c3ca940b74a1a7d89ec.png>)

The results page is the most convincing: For the same building photo, the heat map falls on the roof and facade when asked about "palace", the dome when asked about "dome", and the interior when asked about "altar". For the same feature map, changing a set of weights results in a different interpretation. This just shows that the weights encode "which types of features are important to which types."

![Hard constraint of CAM: it can only be used on the last layer of convolution](</attachments/cs231n-bc8bf946ab90340cfb7293f4.png>)

The problem is also written on the same page: this derivation requires the classifier to follow the GAP, so it can only be applied to the last layer of convolution. After the last layer of modern CNN, there are often several layers of fully connected or other operators, and CAM has no way to start there. In addition, the resolution of the feature map of the last layer is inherently low, and the heat map is naturally very thick.

## 9. Grad-CAM and attention: removing the restriction of “only seeing the last layer”
*(Reference time: 01:10:15 – 01:13:11｜Lecture 9)*

The constraints of CAM come from the way it is proved - it must know the exact weights  $w_{k,c}$. The solution of Grad-CAM is to replace the "weight" with a real-time quantity: the gradient of the category score to the activation of a certain layer. So "which layer" is changed from a hard constraint to an adjustable knob: the further back the layer is selected, the stronger the semantics and the lower the resolution; the further forward the layer is selected, the higher the resolution and the weaker the semantics.

![The first step of Grad-CAM: Pick any layer, take its activation A, shape H×W×K](</attachments/cs231n-3f68e321e300b5791a06a74e.png>)

The first move is to remove the restriction of "last layer": pick any layer and record its activation as  $A\in\mathbb{R}^{H\times W\times K}$.

![Grad-CAM Step 2: Calculate the gradient of activation by category score, the shape is still H×W×K](</attachments/cs231n-90e682a68fc513d048367e01.png>)

Step 2: Calculate  $\partial S_c/\partial A$. The shape of the gradient is the same as the activation, and the meaning is "how sensitive is this feature map at this location to the score of class c".

![Grad-CAM Step 3: Perform global average pooling on the gradient to obtain K weights](</attachments/cs231n-7357d53035a3bb7a97efd8f1.png>)

Step 3: Average the gradients over space to obtain K scalars  $\alpha_k=\frac{1}{HW}\sum_{h,w}\frac{\partial S_c}{\partial A_{h,w,k}}$. The shape of this step exactly corresponds to the GAP of CAM - except that CAM uses fully connected weights  $w_{k,c}$, Grad-CAM calculates one using gradient. **The same formula, two weight sources**, this is the most beautiful reuse in the entire chapter.

![Grad-CAM Step 4: Use α-weighted summation activation, and then use ReLU to obtain the heat map](</attachments/cs231n-791b107e17ed96064bfb50c2.png>)

Step 4: $M^c_{h,w}=\mathrm{ReLU}\left(\sum_k \alpha_k A_{h,w,k}\right)$. ReLU is not a decoration - it suppresses all the evidence "against this category" and leaves only positive contributions, so the heatmap looks cleaner. The price is that negative evidence is lost. If the model is judged by "the lack of a certain feature", this picture will be misleading.

![The result of Grad-CAM: the same picture is changed to different categories, and the heat map is changed accordingly.](</attachments/cs231n-068a6365b7c1721f67ab4e81.png>)

The results have the same origin as CAM but have a much wider applicability: any layer can produce a graph, and any network structure can be used, because only one backpropagation is required. The lecturer's original words are that this method is one of the most commonly used tools for understanding CNN and the most worth learning first.

![ViT's attention visualization: Below each picture is the category and confidence given by the model, and superimposed is the attention heat map](</attachments/cs231n-04465686fca6fa056e287a02.png>)

For models such as Transformer, this matter is simple: the self-attention matrix already contains the weight of "which inputs each output depends on", and it can be spread back to the image according to the patch position. No gradient is required, and no need to change the structure. The columns on the left are attention maps of different objects, and the four on the right are examples with confidence levels: basketball 95.13%, beacon 99.81%, American\_black\_bear 92.99%, basketball 87.74%. The lecturer's summary of this comparison is: Transformer has its own interpretation interface, and CNN only needs plug-ins such as Grad-CAM. Five interpretation tools can be compared side by side. Which one you choose depends on how much structural constraints you can accept and how fine a spatial resolution you need.

| Tools | weighted/derivative objects | Applicable network | Heatmap resolution | Do you want to change the network structure? |
| --- | --- | --- | --- | --- |
| Filter visualization | Look directly at the weights without asking for derivatives | First few layers with channel count 3 | Same size as convolution kernel | No |
| saliency map | Gradient of class score with respect to input pixels | Any differentiable network | Original image resolution | No |
| CAM | Fully connected weight × last layer feature map | Must end with GAP | The last layer feature map | Yes (structural constraints) |
| Grad-CAM | Gradient of category scores to arbitrary layer activations | Any differentiable network | The resolution of the selected layer | No |
| ViT attention map | self-attention weight itself | Transformer | patch grid | No |

## Summary: four output shapes, three levels of granularity, five interpretation tools
*(Reference time: 01:13:19 – 01:13:36｜Lecture 9)*

![The agenda page appears for the third time: both pieces of content have been covered](</attachments/cs231n-29e01ca76cd0d2c4cb01cf6b.png>)

The agenda page appears for the last time, with both large blocks crossed out. The lecturer said that he originally thought that the content would be endless.

![Preview of the next lecture: Video Understanding](</attachments/cs231n-1260d1ff40493994a845d2bf.png>)

The last page leads to Lecture 10: Video Comprehension. It is actually an extension of all tasks in this lecture on the timeline - classification, detection, and segmentation must be consistent from frame to frame, and "consistency" is the theme of the next lecture. Compress the entire module into a few judgments that can be taken away:

- The output shape precedes the network structure. Fixed-length output (classification, semantic segmentation) can be calculated by hard calculation, while variable-length output (detection, instance segmentation) must first design a fixed-length encoding, and then talk about how to build the network.
- There are four methods of fixed-length, with different costs: sliding window pays for computing power, proposal pays for delay, grid pays for redundancy, and query pays for capacity limit. There is no free one, only the conversion method is different.
- In the four iterations of detection, only the "fixed length" trick was changed, and the core of "regression box + classification" was almost unchanged - so if you understand R-CNN, the next four models are just its variants.
- The three levels of segmentation (semantics → instances → components) are superpositions rather than substitutions: each level takes the output of the previous level as input, and each level only receives one more small branch.
- Transpose convolution is not a new operator, it is a reverse traversal of the same set of weights; its output size can be used  $(N-1)\times s+K$  Check directly.
- The entire derivation of CAM has only one action - exchanging the summation order; Grad-CAM replaces "weights" with gradients, so any layer can be interpreted.
- Interpretability is not an afterthought, but a by-product of the structure: you can explain which layer you can find the gradient for; Transformer just makes this free.

## engineering laws
*(Reference time: 00:00:05 – 01:13:36｜Lecture 9)*

1. **Ask first about the shape of the answer, then about the shape of the network.**  What the last layer of a model looks like is determined by the semantics of the output. The reason why the detector has evolved three completely different heads: grid, anchor box, and query, is because they give three different answers to "how long is the output?"
2. **The only lever for acceleration is reuse, the rest are corollaries of it.**  R-CNN to Fast R-CNN compresses 2000 forward times into 1 time, relying on "the convolution has already calculated this picture"; RPN and then single-stage, relying on "the proposal can also be calculated on this feature map". Any time "the same tensor is calculated repeatedly" is the place to start.
3. **If you can predict relative quantities, don't predict absolute quantities.**  Frame offset (dx, dy, dw, dh), anchor frame offset, and the stride ratio of transposed convolution are essentially the same trick: replacing "where the target is" with "how much it moves relative to the reference system", the network does not have to carry the position into the weight.
4. **Resolution and semantics are incompatible quantities.**  Downsampling changes the receptive field, while upsampling does not return the lost information; therefore, any architecture that "must have both accurate positioning and strong semantics" will eventually have a shortcut to deliver high-resolution features to the decoder (U-Net's splicing, FPN, DETR's multi-scale).
5. **The readout method is a design choice, not an implementation detail.**  Classification tokens, global average pooling, object query, and top-K proposals are all different ways of compressing variable-length or high-dimensional features into fixed-length vectors. Which one you choose determines whether the model can explain it and to what level it can explain it.
6. **The intensity of post-processing is proportional to the density of encoding.**  The denser the grid and the more anchor boxes there are, the more redundant boxes there will be and the more indispensable NMS will be. Any architecture that "outputs all candidates at once" must set aside a budget for deduplication.
7. **Interpretability comes from the structure, not from add-on modules.**  The saliency map can be used because the network is differentiable, the CAM can be used because the last one is GAP, and the attention map can be used because the attention weight is inherently in the forward direction. To interpret the model at a certain granularity, first make sure there is a readable tensor at that granularity.

```mermaid
mindmap
  root((Detection, Segmentation and Interpretability))
    Output shape
      Classification a word
      Semantic segmentation H×W
      Detection K box
      Instance splitting K masks
    Four tips for making the length fixed
      Sliding window enumeration location scale
      area proposal top-K
      fixed grid 5B+C channel
      Query N slots
    Split three levels
      semantic level FCN with U-Net
      instance level Mask R-CNN
      Component level key point heat map
    upsampling
      nearest neighbor and bed of nails
      max unpooling
      transposed convolution
    Remove duplicates
      probability threshold
      NMS
    Interpretability
      Filter visualization
      saliency map
      CAM
      Grad-CAM
      ViT attention
```

## Appendix: Slides not shown in class

The lecturer explained twice at 00:31:42 and 00:42:42: He deleted the details of coordinates, dimensions and RoI from the text, and put them all at the end of the deck for everyone to read after class. The following 29 pages are these backup pages, which are explained page by page in the original order of the deck. The two groups of RoI Pool and RoI Align are the key to understanding Chapters 5 and 7.

![Reading list page: Only one line title: Additional Reading Material](</attachments/cs231n-565df86e7fbce9fc540b7716.png>)

This page is the entrance to extended reading. The text is not expanded and only the title is left on the page.

![Write 1D convolution as matrix multiplication: kernel size 3, stride 2, padding 1](</attachments/cs231n-895f5a24800a801847040e0a.png>)

After writing convolution as matrix multiplication, "downsampling" corresponds to multiplying the input vector by a sparse matrix: the number of rows is less than the number of columns, and each row only has those non-zero items that overlap with the kernel.

![Transpose convolution is to multiply the transpose of the same matrix. The example uses stride 2 and padding 0.](</attachments/cs231n-3b03f89bd0ea773ab2f40fe2.png>)

This is the algebraic explanation of the three words "transposed": when the transpose of the same matrix is multiplied back, the dimensions naturally become larger, and the overlaps are naturally added - the geometric process of the five frames in Chapter 3 becomes a matrix transpose here.

![RoI Pool first frame: 512×20×15 features of input image and backbone output](</attachments/cs231n-af82b02b49123149316337ef.png>)

The cropping details of Fast R-CNN start here, first laying out the size relationship between the input and the feature map.

![RoI Pool second frame: Project the proposal frame onto the feature map proportionally](</attachments/cs231n-179fbbff7872874804bf5b38.png>)

The projection relies on the total step size: the pixel coordinates divided by the step size are the feature map coordinates.

![RoI Pool third frame: Adsorb the projected frame to the nearest integer grid](</attachments/cs231n-d5855db00f793d979b2b61e4.png>)

"Adsorption" is to align the frame with the grid of the feature map, at the cost of an alignment error of up to half a grid.

![RoI Pool 4th frame: The problem is how to change the 512×5×4 area into 512×2×2](</attachments/cs231n-25130b42ec4a7604cb558cfb.png>)

Fixed size is necessary because the fully connected layer later requires the input dimension to be fixed.

![RoI Pool fifth frame: Cut the area into 2×2 roughly equal sub-areas](</attachments/cs231n-e5e498f91c8101259207a384.png>)

Segmentation does not require integer division, and the sub-region boundaries can fall between grids, which is also one of the sources of errors.

![RoI Pool sixth frame: Take the maximum value of each sub-region to get 512×2×2. In practice, 512×7×7 is commonly used](</attachments/cs231n-8134ff0a4595a306ed7f1e91.png>)

Max pooling ensures that the output size is the same no matter how big the input area is - this is what RoI Pool is all about.

![RoI Pool 7th frame: The problem is that the regional features are slightly misaligned](</attachments/cs231n-caccd4ba41340a8a09dcead6.png>)

The superimposition of two levels of quantization (first adsorbing the frame, then segmenting) will cause the feature to be offset from the real object by a few pixels, which will have little impact on detection, but will be a disaster for masking.

![RoI Align first frame: don’t adsorb at all, project directly](</attachments/cs231n-995eac408f5c98137d544486.png>)

The modification of Mask R-CNN is simple: remove the adsorption step.

![RoI Align second frame: Sampling according to rules in each sub-region, using bilinear interpolation to obtain feature values](</attachments/cs231n-3c8947b45ad3ba9c53aee846.png>)

The coordinates of the sampling point can be decimals, and the value is interpolated from the surrounding four grid points, so there is no quantization error.

![RoI Align third frame: The feature of point (x, y) is a linear combination of the features of four adjacent grid points](</attachments/cs231n-701770d765e9095aa1f2bcec.png>)

This frame gives the definition of bilinearity, and the weight is determined by the distance from the sampling point to the four grid points.

![RoI Align Frame 4: Four corner points and their respective 512-dimensional features](</attachments/cs231n-25bdd48f7549440dfd0450cb.png>)

Each of the four corner points is a 512-dimensional vector, and interpolation is performed independently for each channel.

![RoI Align fifth frame: pooling is still done after sampling, and the output is still a fixed size](</attachments/cs231n-c565b6bee8d745ffc45748ef.png>)

The process is exactly the same as RoI Pool, the only difference is that the sampling points are no longer quantized - this is also the direct reason why Mask R-CNN's mask boundary is cleaner.

![Actual comparison between R-CNN and Fast R-CNN: training 84 hours, 25.5 hours, 8.75 hours](</attachments/cs231n-bc25ec36b573ad5f0a825ae6.png>)

The picture on the left is the training time: 84 hours for R-CNN, 25.5 hours for SPP-Net, and 8.75 hours for Fast R-CNN. The picture on the right shows the test time: R-CNN 49 seconds, SPP-Net 4.3 seconds, Fast R-CNN 2.3 seconds; after excluding the time of region proposal, Fast R-CNN only takes 0.32 seconds. This set of numbers is the measured evidence of Chapter 5 "Three iterations reduce double calculations".

![Another note on the same set of data: the runtime is dominated by zone proposals](</attachments/cs231n-c37d21b83475f64d0f8499ec.png>)

Putting these two sets of pillars together reveals the next bottleneck: Fast R-CNN only takes 0.32 seconds after removing the proposals, and the remaining 2 seconds are almost entirely spent on proposals.

![Fast R-CNN first frame: Insert RPN into Fast R-CNN and let CNN make its own suggestions](</attachments/cs231n-7482ff3e7a79f2e8d1bc6926.png>)

After the proposed network is built into the backbone, the remaining process is exactly the same as Fast R-CNN: feature cutting and region-by-region classification.

![Faster R-CNN second frame: four losses joint training](</attachments/cs231n-663bf7fc8c66f863ad4eeeb4.png>)

The four losses are RPN's object/non-object classification, RPN's box regression, final classification, and final box regression. Four channels of reverse transmission at the same time are the implementation methods of "one forward, two supervision".

![Faster R-CNN third frame: Comparison of test times of four models, Faster R-CNN is 0.2 seconds](</attachments/cs231n-8f9cac205ba4cc5d0532db6f.png>)

The same test time histogram adds the last one: Faster R-CNN 0.2 seconds, another order of magnitude faster than Fast R-CNN.

![Faster R-CNN Frame 4: List of skipped details](</attachments/cs231n-1d0cc961f81d1a8131712c68.png>)

How to remove duplicates in NMS, how to determine anchor frames, how to collect positive and negative samples, and how to parameterize frame regression - these four things determine the success or failure of the implementation, but they are all engineering quantities rather than new ideas. Chapter 4 lists it as the fourth "sub-problem" precisely because although it is skipped, it determines whether a detector can be used.

![Faster R-CNN Frame 5: Definition of two-stage detector](</attachments/cs231n-031cd211edde0f712c1920e8.png>)

The first stage is run once for each image (backbone plus RPN), and the second stage is run once for each region (feature cutting, classification, regression offset). The name "Two Stages" comes from these two lines.

![Faster R-CNN 6th frame: The question is is it possible not to even need the second stage?](</attachments/cs231n-7be5bdac961ac886b0b1b1b8.png>)

This question is the starting point for single-stage detectors - the answer to YOLO and SSD in Chapter 6 is "no".

![Detector variable table: backbone, meta-architecture, input size, number of proposals](</attachments/cs231n-23002c672eaf30b764699fc7.png>)

The three conclusions are straightforward: Faster R-CNN is slower but more accurate, SSD is faster but less accurate, and the larger and deeper the backbone is, the better. This table breaks down the "detector" into four independently selectable knobs, which still holds true today.

![Same variable table plus citations from the 20-year review](</attachments/cs231n-c95d1756d3901789755e7d78.png>)

This supplementary review (Zou et al., Object Detection in 20 Years) strings together the detection routes before 2019 and is suitable for extended reading.

![Guided backprop First frame: Pick a middle channel and find the gradient for the pixels](</attachments/cs231n-313cd350495e0971c889fd66.png>)

The method is the same as that of the saliency map, except that the object of derivation is changed from the category score to the value of an interneuron - the question asked is changed from "Which pixels make a dog more like a dog" to "Which pixels make this channel more exciting".

![Guided backprop second frame: only let positive gradients pass through ReLU during backpropagation](</attachments/cs231n-a2aae43c6dc19584f668d55b.png>)

This is the meaning of guided: negative gradients are always truncated, and the resulting graph is cleaner, at the cost of no longer being a real gradient - it is more like a reconstruction that "only retains supporting evidence".

![Guided backprop Frame 3: Side-by-side comparison of maximum activation patch and guided backprop](</attachments/cs231n-cb720de1af7be550c50fa6c7.png>)

The left side is the real image patch that makes the neuron respond the strongest, and the right side is the synthetic pattern deduced. Comparing the two can tell what the neuron is looking for.

![Guided backprop fourth frame: the last frame of the comparison image](</attachments/cs231n-ca3b68856b28ae73309a8877.png>)

Each row corresponds to a neuron, and the difference between rows is evidence of the division of labor between different channels. This is also a way around the restriction that "the middle layer cannot be directly viewed": instead of drawing weights, draw "what excites it."
