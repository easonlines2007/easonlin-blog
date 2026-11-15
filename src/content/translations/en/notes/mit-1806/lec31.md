---
kind: notes
source: mit-1806/lec31
title: Lecture 31 · Basis transformation and image compression
description: Simplifying matrices with basis transformations and understanding
  low-rank approximations in image compression.
sourceHash: 65580a51773b5f2695102d39fc95290221a13bd046d9fc045d2f11829b7037b8
publish: true
translationMethod: machine-assisted
---

> *Change of basis; image compression* ｜ Gilbert Strang ｜ MIT 18.06 Linear Algebra

**Lecture 31 / Total 35 Lectures** \|Part 3 · Eigenvalues, positive definiteness and linear transformation

**Video of this lecture**: [Bilibili p32 · Basis transformation and image compression](https://www.bilibili.com/video/BV1ix411f7Yp?p=32)(50:14)｜ [MIT OCW official page](https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/resources/lecture-31-change-of-basis-image-compression/)

> Illustration: MIT OCW 18.06SC official lecture summary (CC BY-NC-SA 4.0) and Bilibili classroom video frames (time stamped), about 10 frames per lecture.

<div align="center">

<iframe src="https://player.bilibili.com/player.html?bvid=BV1ix411f7Yp&page=32&autoplay=0&danmaku=0&high_quality=1" width="100%" height="420" frameborder="0" allowfullscreen="true" scrolling="no"></iframe>

</div>

## Introduction to this lecture

Last lecture **linear transformation** (Linear transformation) corresponds to a matrix: given a set of basis, an abstract transformation has a concrete matrix. But here is a question - if the basis is replaced, what will the same transformed matrix become? This lecture answers this question and starts with the most practical scenario: image and video compression.

one piece  $512\times512$  The grayscale image is mathematically a  $262144$  dimensional vector whose standard coordinates are pixel-by-pixel grayscale values. Neighboring pixels tend to have almost the same grayscale, which is where the whole scope of compression comes in. Since the image is a vector, you can use a different set of basis to represent it: rewrite "one coordinate per pixel" as "superposition of a few basis vectors in the direction". JPEG does exactly that - slices an image into  $8\times8$  small pieces, in  $\mathbb{R}^{64}$  Change the basis once, discard a large number of coefficients, and rebuild again.

This lecture draws two conclusions from this. First, a good basis must satisfy two things at the same time: both the transformation and the inverse transformation are fast, and a few basis vectors are enough to approximate the image. Second, back to the abstract level, the two matrices of the same linear transformation under different bases are **similarity matrix** (similar matrices), there is only one basis transformation between them. The last section reiterates the previous lecture on "Writing a Matrix from a Base" and explains that if the base is composed of eigenvectors, the matrix is ​​a diagonal matrix - this is the overall goal of changing the base: to make the matrix simple.

![Official Handout Summary Page 1/3](</attachments/mit1806-bfd76ac90052b50eeceb8d20.png>)

*MIT OCW Official Lecture Notes Summary Page 1/3 (18.06SC Lecture 31 Summary, CC BY-NC-SA 4.0).*

## 1. An image is a vector

Digital images are extremely cumbersome in their raw form. take one  $512\times512$  The picture of it has  $2^9\times2^9$  a **Pixel** (pixel). Record each pixel on the black and white image  $0$  Arrive  $255$  The grayscale between  $2^8=256$  level, occupying exactly 8 bits. Arrange all pixels in a column in a fixed order, and the entire image becomes a vector:



$$
\boldsymbol{x}\in\mathbb{R}^n,\qquad n=512^2=2^{18}.
$$



If the image is colored, each pixel needs three numbers (red, green, blue) to determine the color, and the vector length becomes  $3\times512^2$. Satellite remote sensing, climate simulation, combustion calculations, and various sensors are all continuously generating data of this magnitude; the original format recorded by the camera is extremely unfriendly to transmission. Transmitting the videos of these courses as they are will directly overwhelm the transmission system, so it must be compressed. There are two types of compression: one type only uses the repetition within the data and can be lossless; the other type is really used for images and videos, which makes part of the information disappear permanently, which is called lossy compression.

In this representation, the  $i$  The coordinate is the  $i$  The gray level of pixels, the corresponding basis is  $\mathbb{R}^n$  of **Standard base**(standard basis):



$$
\boldsymbol{e}_1=(1,0,\dots,0)^{\mathsf T},\quad
\boldsymbol{e}_2=(0,1,0,\dots,0)^{\mathsf T},\quad\dots
$$



The problem with the standard basis is that it completely ignores the correlation between pixels. The grayscale of adjacent pixels on a shirt might be  $121$, $124$, $123$, almost the same; the grayscale of the blackboard is completely the same. The most extreme situation is the empty blackboard before class: the gray value of the entire picture is almost the same everywhere, and the amount of information is extremely small. However, it is expressed in standard coordinates and must be given honestly.  $512^2$  Almost the same numbers, and I dare not lose any of them. **Little information, but a lot of coordinates**——This is the reason why the standard basis is not suitable for compression.

![Video 00:05:01: Classroom blackboard writing](</attachments/mit1806-7c47fc42f55c958e33e4c0fd.jpg>)

*Video 00:05:01 \| Approximately corresponding to Section 1 "1. The image is a vector".*

![Video 00:05:56: Classroom blackboard writing](</attachments/mit1806-7a9850c72bd9a8b256fa125a.jpg>)

*Video 00:05:56 \| Approximately corresponding to Section 1 "1. The image is a vector".*

## 2. A solid color only requires one vector

Since the standard basis does not take advantage of correlation, a set of basis should be used that can take advantage of it. $\mathbb{R}^n$  There are infinitely many bases, and the choice is ours. The most worthy vector to put into the base is **all 1 vector**



$$
\boldsymbol{w}_1=(1,1,\dots,1)^{\mathsf T}.
$$



This vector alone can completely describe a solid color image: take  $c_1$  equal to that gray value, $c_1\boldsymbol{w}_1$  It is a uniform picture throughout. Of course, the real image is not a pure color, but the blackboard, the sky, and the entire piece of clothing are all "pure color with a little disturbance"; putting all 1 vectors into the basis, this part of the common information only needs one coefficient, not  $512^2$ . In electrical engineering it is called  **DC vector** (DC vector), that is, the DC component, its corresponding frequency is zero.

The other extreme is that adjacent pixels alternate between positive and negative **Checkerboard vector**



$$
(1,-1,1,-1,\dots,1,-1)^{\mathsf T},
$$



It changes the fastest and represents the highest frequency. If the image is really a huge chessboard, this one vector carries the entire signal; but this component of an ordinary image is extremely small. In between are the slowly changing steps:



$$
(1,\dots,1,-1,\dots,-1)^{\mathsf T},
$$



Take the first half  $1$, take the second half  $-1$, describing the common overall light and dark transition of "half dark, half bright".

These three vectors draw a spectrum of shapes of the basis: from a constant at zero frequency, to slowly varying steps, to alternations at the highest frequencies. **Which set of basis to choose is the most critical decision in compression**, which directly determines whether the coefficients can be discarded in large quantities. Behind this decision are huge industrial interests: the television industry has its own preference for signal scanning methods, and the film industry prefers another. In the end, the debate is still a linear algebra problem.

JPEG has indeed fulfilled its wish to put all 1 vectors into the base. The basis used by JPEG (Joint Photographic Experts Group, Joint Photographic Experts Group) is **Fourierky** (Fourier basis), the all-1 vector is exactly its first column; in addition, its columns are some complex numbers  $w$  Each power of , one by one, gives oscillations of increasingly higher frequency. But JPEG does not capture the entire  $512\times512$  of the diagram, but first cut into  $8\times8$  of small pieces: each piece  $8\times8=64$  pixels, the question starts from  $\mathbb{R}^{512^2}$  down to  $\mathbb{R}^{64}$, using 64 basis vectors to replace the basis in a 64-dimensional space - the shapes of these 64 vectors are predetermined, so the transformation can be completed quickly using a fixed algorithm.

## 3. There is no loss if you change the basis, but there is loss if you lose the coefficients.

for each  $8\times8$  Block, the first step of JPEG is to do only one thing: replace the 64 pixel values ​​with 64 new coordinates (coefficients). This step is **Lossless** (lossless) - the basis has changed, but the vector has not changed. The two sets of coordinates describe the same vector. $\boldsymbol{p}=W\boldsymbol{c}$  Completely reversible. Compression really happens in the next step: **threshold** (thresholding). Set a threshold and set all coefficients whose absolute values are lower than the threshold to zero, and we get  $\hat{\boldsymbol{c}}$. This step is **lossy** (lossy), the information has really been deleted, but it has been deleted so that the human eye can hardly see the difference - how high the threshold should be set is determined by "whether the eyes can distinguish it".

Why do thresholds work? Because the coefficient distribution in good base is extremely uneven. Coefficients in the all-1 direction are almost always large and are rarely thrown away; coefficients in high-frequency alternating directions are small enough to be ignored in smooth images. During reconstruction, the retained coefficients are multiplied back to their respective basis vectors and then added:



$$
\hat{\boldsymbol{p}}=\sum_{\text{保留下来的 }j}\hat{c}_j\,\boldsymbol{w}_j .
$$



This sum usually only has two or three terms left, instead of the original 64. 64 items are reduced to 3 items, the compression ratio is about  $21:1$, which is exactly the order of magnitude pursued by actual systems.

The same train of thought explains other applications. Fingerprint files are a large number of still images, with tens of millions of files accumulated in the United States; pixel-by-pixel storage cannot be stored or retrieved. After being compressed and indexed on a unified basis, the time from submission to search has changed from days to minutes. Video is a sequence of highly correlated still frames: two adjacent frames are almost identical. Instead of compressing each frame independently, it is better to only encode and compress "small corrections after prediction". Regardless of the time direction or the space direction, the essence of compression is to take advantage of the fact that "adjacent values ​​are very close".

## 4. Wavelet basis: a set of orthogonal basis that can be quickly inverted

The strongest competitor of Fourier bases is **wavelet basis** (wavelet basis). In order to see the base-changing action itself, first only take the 8 pixel values ​​of one of the rows, so the problem lies in  $\mathbb{R}^8$  on; in this 8-dimensional space, the simplest 8 wavelet basis vectors can be written one by one:



$$
\boldsymbol{w}_1=(1,1,1,1,1,1,1,1)^{\mathsf T},\qquad
\boldsymbol{w}_2=(1,1,1,1,-1,-1,-1,-1)^{\mathsf T},
$$





$$
\boldsymbol{w}_3=(1,1,-1,-1,0,0,0,0)^{\mathsf T},\qquad
\boldsymbol{w}_4=(0,0,0,0,1,1,-1,-1)^{\mathsf T},
$$





$$
\boldsymbol{w}_5=(1,-1,0,0,0,0,0,0)^{\mathsf T},\quad
\boldsymbol{w}_6=(0,0,1,-1,0,0,0,0)^{\mathsf T},
$$





$$
\boldsymbol{w}_7=(0,0,0,0,1,-1,0,0)^{\mathsf T},\quad
\boldsymbol{w}_8=(0,0,0,0,0,0,1,-1)^{\mathsf T}.
$$



The pattern is very clear: the first two describe the light and dark of the entire block (the difference between the overall brightness and the front and rear halves), the next two describe the contrast inside the front and rear halves, and the last four are each taken on only one adjacent pixel pair.  $\pm1$. All portions are only  $1$, $-1$, $0$, multiplication degenerates into addition and subtraction, and calculation is extremely fast. Arranging these eight vectors in columns, we get **wavelet matrix**(wavelet matrix)$W$:



$$
W=\begin{bmatrix}
1&1&1&0&1&0&0&0\\
1&1&1&0&-1&0&0&0\\
1&1&-1&0&0&1&0&0\\
1&1&-1&0&0&-1&0&0\\
1&-1&0&1&0&0&1&0\\
1&-1&0&1&0&0&-1&0\\
1&-1&0&-1&0&0&0&1\\
1&-1&0&-1&0&0&0&-1
\end{bmatrix}.
$$



They come in twos **orthogonal** (orthogonal), the dot product of any two different vectors is zero: $\boldsymbol{w}_1\cdot\boldsymbol{w}_2=4-4=0$; $\boldsymbol{w}_2\cdot\boldsymbol{w}_3=1+1-1-1=0$; $\boldsymbol{w}_5$  This type is only taken on an adjacent pair  $\pm1$  The vector of , dot product with any "blocked" vector, there will be only one pair left  $+1$  with  $-1$  Cancel. but they are not **orthogonal** (orthonormal), the lengths of each column are not the same:



$$
\|\boldsymbol{w}_1\|=\|\boldsymbol{w}_2\|=\sqrt 8,\quad
\|\boldsymbol{w}_3\|=\|\boldsymbol{w}_4\|=2,\quad
\|\boldsymbol{w}_5\|=\cdots=\|\boldsymbol{w}_8\|=\sqrt 2 .
$$



The one above  $W$  therefore not satisfied  $W^{\mathsf T}W=I$, but



$$
W^{\mathsf T}W=\operatorname{diag}(8,8,4,4,2,2,2,2).
$$



Divide each column by its own length to remedy this. after remediation  $W^{\mathsf T}W=I$, so **The inverse matrix is the transpose**:



$$
W^{-1}=W^{\mathsf T}.
$$



This point is crucial: the basics of changing bases  $\boldsymbol{p}=W\boldsymbol{c}$, that is, calculate  $\boldsymbol{c}=W^{-1}\boldsymbol{p}$; If the inversion is a transpose, the inversion step disappears, leaving only one matrix multiplication vector.

This set of wavelets really spells it all. Taking the alternating vector with the fastest changing Fourier basis as an example,



$$
\boldsymbol{w}_5+\boldsymbol{w}_6+\boldsymbol{w}_7+\boldsymbol{w}_8
=(1,-1,1,-1,1,-1,1,-1)^{\mathsf T},
$$



The direction that "jumps the most" is cleanly split into four here, which is exactly what a basis means: each vector has a unique set of coefficients. As the next generation image compression standard, JPEG 2000 incorporates wavelet bases; the FBI uses smoother wavelets, not from  $1$  Jump directly to  $-1$  rough version. Key’s competition is far from over.

![Official Handout Summary Page 2/3](</attachments/mit1806-abaae6db06e1cff1f8d7c29c.png>)

*MIT OCW Official Lecture Notes Summary Page 2/3 (18.06SC Lecture 31 Summary, CC BY-NC-SA 4.0).*

![Video 00:26:32: Classroom blackboard writing](</attachments/mit1806-e903722548176f1cb1ee6146.jpg>)

*Video 00:26:32 \| Approximately corresponding to Section 4 "4. Wavelet basis: a set of orthogonal basis that can quickly invert".*

## 5. The equation of changing basis and the two criteria of "good basis"

Generalize the above approach. Let the new basis vector  $\boldsymbol{w}_1,\dots,\boldsymbol{w}_n$  Arrange matrix by columns  $W$, called **basis transformation matrix** (change-of-basis matrix). The coordinates of the same vector in the old basis are  $\boldsymbol{x}$, the coordinates under the new basis are  $\boldsymbol{c}$, the two are related by the following formula:



$$
\boldsymbol{x}=c_1\boldsymbol{w}_1+\cdots+c_n\boldsymbol{w}_n=W\boldsymbol{c}.
$$



So the new coordinates are



$$
\boldsymbol{c}=W^{-1}\boldsymbol{x}.
$$



All the mathematics of changing bases is contained in these two lines: **Multiply by the inverse of the basis transformation matrix**. The difference between different compression systems lies in  $W$  How to choose.

Therefore, there are two operable criteria for "good foundation".

**One, fast.**  Must be able to multiply quickly  $W$, can also be quickly multiplied by  $W^{-1}$. Fourier basis **Fast Fourier Transform** (FFT) to do this; the wavelet base has a corresponding fast wavelet transform; the wavelet matrix in the previous section is orthogonal because of the columns. $W^{-1}=W^{\mathsf T}$, two multiplications are equally cheap. If this condition is not met, compression will take an unbearably long time.

**Second, it compresses well.**  Not changing the base at all is of course fastest, but that's the worst kind of compression: throw away 90% of the 8 pixel values, and the image is just black. A good basis allows a few basis vectors to be enough to reconstruct the image, that is, the vast majority of coefficients can be safely set to zero - in  $8\times8$  block, replacing 64 with approximately three coefficients.

Both are indispensable. The Fourier basis is the most familiar choice, and the wavelet basis is a later challenger, but the "best basis" has not yet been determined.

![Video 00:32:39: Classroom blackboard writing](</attachments/mit1806-35cca7a4b5de18d332568f20.jpg>)

*Video 00:32:39 \| Approximately corresponding to Section 5 "5. The equation of changing basis and the two criteria of "good basis"".*

## 6. The same transformation under different bases: similarity matrix

Back to the abstract level. Set  $T$  is  $\mathbb{R}^n$  A linear transformation to itself, which itself has no coordinates, and can be a rotation, projection, or any linear operation. selected basis  $\boldsymbol{v}_1,\dots,\boldsymbol{v}_n$, $T$  There is a matrix  $A$;Change a group of bases  $\boldsymbol{w}_1,\dots,\boldsymbol{w}_n$, the same  $T$  There is a matrix  $B$. The transformation has not changed, only the coordinates describing it have changed, so  $A$  with  $B$  There must be a definite relationship between them.

The conclusion is: $A$  with  $B$ **similar**(similar),



$$
B=M^{-1}AM,
$$



Among them  $M$  It is the base transformation matrix, which can be taken as the one in the previous section  $W$. The definition of similarity matrix is exactly this form: there is an invertible matrix  $M$, so that the difference between the two matrices is once "left multiplied by  $M^{-1}$, multiply right  $M$".

This relationship can be spelled out by the two rules from the previous section. Between the old coordinates and the new coordinates is  $\boldsymbol{x}=W\boldsymbol{c}$. If you put  $T$  The matrix under the old basis is written as  $A$, the matrix under the new basis is recorded as  $B$, then for any new coordinate  $\boldsymbol{c}$: first  $\boldsymbol{c}$  Replace with old coordinates  $W\boldsymbol{c}$, use  $A$  function, and then change the result back to the new basis, we get



$$
B\boldsymbol{c}=W^{-1}A\,(W\boldsymbol{c})
\qquad\Longrightarrow\qquad
B=W^{-1}AW .
$$



Therefore, changing the basis changes two things at the same time: new coordinates for each vector, and new matrices for each transformation; the latter is the former sandwiched between  $W^{-1}$  with  $W$  obtained between. This also shows that "similar" is an appropriate term - the two matrices describe what the same object looks like in different coordinate systems.

![Video 00:40:11: Classroom blackboard writing](</attachments/mit1806-9c3f8a6b7bdb1c2a917f0fd2.jpg>)

*Video 00:40:11 \| Approximately corresponding to Section 6 "6. The same transformation under different basis: similarity matrix".*

![Video 00:40:49: Classroom blackboard writing](</attachments/mit1806-324e528aef2c2dc12c3d89fa.jpg>)

*Video 00:40:49 \| Approximately corresponding to Section 6 "6. The same transformation under different basis: similarity matrix".*

## 7. How the matrix is created; eigenvector basis

The conclusion of Section 6 is based on "how to write a matrix given a given basis", so we will go through the construction method in the previous lecture again. Let the basis be  $\boldsymbol{v}_1,\dots,\boldsymbol{v}_n$. By linearity, any  $\boldsymbol{x}$  are all unique combinations of basis vectors  $\boldsymbol{x}=c_1\boldsymbol{v}_1+\cdots+c_n\boldsymbol{v}_n$, so



$$
T(\boldsymbol{x})=c_1T(\boldsymbol{v}_1)+c_2T(\boldsymbol{v}_2)+\cdots+c_nT(\boldsymbol{v}_n).
$$



**Just know  $T$  here  $n$  By outputting the basis vectors, we know the entire  $T$.**  Next, these outputs are expressed using the same basis:



$$
T(\boldsymbol{v}_j)=a_{1j}\boldsymbol{v}_1+a_{2j}\boldsymbol{v}_2+\cdots+a_{nj}\boldsymbol{v}_n,
\qquad j=1,\dots,n .
$$



coefficient  $a_{1j},a_{2j},\dots,a_{nj}$  It's the matrix  $A$  of the  $j$  column; generally, $A$  of  $(i,j)$  The elements are  $T(\boldsymbol{v}_j)$  in the expansion of  $\boldsymbol{v}_i$  coefficient. $n=8$  Time matrix total  $8\times8=64$  Number: The output of each of the 8 input directions must be written as a combination of base vectors using 8 coordinates.

The best base is **eigenvector** (eigenvector) basis, that is, the basis vector satisfies  $T(\boldsymbol{v}_i)=\lambda_i\boldsymbol{v}_i$, among which  $\lambda_i$  is corresponding **eigenvalue** (eigenvalue). At this time  $T(\boldsymbol{v}_1)=\lambda_1\boldsymbol{v}_1$  The expansion of is  $\lambda_1\boldsymbol{v}_1+0\boldsymbol{v}_2+\cdots+0\boldsymbol{v}_n$, the first column only has the first component  $\lambda_1$;Similarly  $i$  Column only  $i$  components  $\lambda_i$. The matrix becomes a diagonal matrix:



$$
A=\begin{bmatrix}
\lambda_1&0&\cdots&0\\
0&\lambda_2&\cdots&0\\
\vdots&\vdots&\ddots&\vdots\\
0&0&\cdots&\lambda_n
\end{bmatrix}.
$$



Under a diagonal matrix, each basis vector is simply stretched  $\lambda_i$  times, all directions do not interfere with each other, and the transformation is extremely simple. Of course, image processing most wants such a basis, but for  $512^2$  It is too expensive to find all the eigenvectors of dimensional pixel vectors. In fact, we can only take a step back: choose a cheap and easy-to-use basis, such as wavelet basis or Fourier basis. The main line of the whole lecture ends here——**The purpose of changing the basis is to make the matrix simpler, but the price must be paid.**

![Video 00:45:12: Classroom blackboard writing](</attachments/mit1806-98e2b2945c2b219fb57ea7b7.jpg>)

*Video 00:45:12 \| Approximately corresponding to Section 7 "7. How matrices are created; Eigenvector basis".*

![Official Handout Summary Page 3/3](</attachments/mit1806-d7cdbf252846151554f1dae4.png>)

*MIT OCW Official Lecture Notes Summary Page 3/3 (18.06SC Lecture 31 Summary, CC BY-NC-SA 4.0).*

## Summary of this lecture

- one piece  $512\times512$  The grayscale image is  $\mathbb{R}^{262144}$  a vector in , $262144=512^2$;The vector length of the color image is 3 times longer.
- The possibility of compression comes from correlation: adjacent pixels are close in grayscale, and adjacent frames are almost identical. The standard basis gives coordinates pixel by pixel, which is not used. It is especially bad for images where the "entire grayscale is the same".
- The full 1 vector (DC vector, zero frequency) can describe the solid color image with one coefficient; the alternating vector is the highest frequency direction; the half vector  $1$  half  $-1$  The vector describes the slowly changing light and dark steps. Base selection is the most critical and most important decision in compression.
- JPEG Cut the picture into  $8\times8$  blocks (64 pixels each), in  $\mathbb{R}^{64}$  The Fourier basis is used to change the basis; this step of changing the basis is lossless, and then setting the small coefficients to zero (threshold) is lossy.
- Reconstruction is the superposition of a small number of basis vectors; there are usually only two or three coefficients left out of 64, and the compression ratio is about  $21:1$.
- The 8-dimensional wavelet basis consists of all 1 vectors, three block step vectors and four vectors taken only on one adjacent pair.  $\pm1$  consists of vectors, each pair is orthogonal, and the length is  $\sqrt8,\sqrt8,2,2,\sqrt2,\sqrt2,\sqrt2,\sqrt2$;After column-by-column standardization  $W^{-1}=W^{\mathsf T}$.
- The equation for changing the basis is  $\boldsymbol{x}=W\boldsymbol{c}$, that is  $\boldsymbol{c}=W^{-1}\boldsymbol{x}$; A good basis must be fast (FFT, fast wavelet transform, orthogonal inversion or transpose), and it must be compressible (a few basis vectors are enough for reconstruction).
- The matrices of the same transformation under the two families of basis are similar: $B=M^{-1}AM$, among which  $M$  is the base transformation matrix.
- How to write a matrix from bases: put  $T(\boldsymbol{v}_j)$  Expanded into a combination of basis vectors, the coefficient is the  $j$  column, $(i,j)$  The elements are  $\boldsymbol{v}_i$  coefficient.
- If the basis consists of eigenvectors, $T(\boldsymbol{v}_i)=\lambda_i\boldsymbol{v}_i$, the matrix becomes a diagonal matrix  $\Lambda$; This is the best basis, but finding eigenvectors is too expensive, so in practice it is the second best.

## keywords

| English | Chinese | One sentence explanation |
| --- | --- | --- |
| change of basis | basis transformation | Change a set of bases to represent the same vector, and the new coordinates are given by  $\boldsymbol{c}=W^{-1}\boldsymbol{x}$  given |
| standard basis | Standard base | Only one component is taken  $1$, the rest are  $0$  The basis of , corresponding to the pixel-by-pixel grayscale |
| pixel | Pixel | The smallest unit of the image, the grayscale is  $0$  Arrive  $255$ |
| lossless | Lossless | A compression step where the transformation is reversible and information is not really lost |
| lossy | lossy | A compression step in which some coefficients are discarded and information cannot be recovered. |
| thresholding | threshold | Set coefficients whose absolute value is below the threshold to zero |
| DC vector | DC vector | A vector of all 1s, in the zero-frequency direction, describing a solid color image with one coefficient |
| Fourier basis | Fourierky | The basis used by JPEG can be quickly transformed using FFT |
| wavelet basis | wavelet basis | made of lumps  $\pm1$  with  $0$  Orthogonal basis composed of, JPEG 2000 adopts |
| orthonormal | orthogonal | Pairs are orthogonal and the length is  $1$, at this time  $W^{-1}=W^{\mathsf T}$ |
| basis-change matrix | basis transformation matrix | matrix with new basis vectors as columns  $W$, satisfy  $\boldsymbol{x}=W\boldsymbol{c}$ |
| similar matrices | similarity matrix | The matrix of the same transformation under different bases satisfies  $B=M^{-1}AM$ |
| eigenvector basis | Eigenvector basis | A basis composed of eigenvectors, where the matrix is a diagonal matrix |

---

[← Lecture 30](/en/notes/mit-1806/lec30) ｜ [Course Catalog](/en/notes/mit-1806/overview) ｜ [Lecture 32 →](/en/notes/mit-1806/lec32)
