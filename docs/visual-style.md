# 视觉与插画

站点名称保持 **Eason's Notes**，个人姓名为 **Eason Lin**。

采用暖纸色、炭灰文字与砖红点缀；浅色与深色共享同一套语义颜色变量。正文使用系统无衬线字体，首页名字和栏目标题使用系统衬线字体。细分隔线、略带倾斜的照片边框和小号栏目编号作为主要装饰。

## 交互

顶栏文字和图片是同一翻转面的正反两面。鼠标悬停或键盘聚焦时沿横轴旋转 180°，580ms 完成，离开时从当前角度平滑返回。链接点击范围和文字的辅助技术名称保持稳定；插画不响应鼠标事件，并对辅助技术隐藏。600px 及以下隐藏插画，保留常规手机导航。减少动态效果模式直接切换，不播放翻转过程。

首页入场约 2.7 秒：头像与姓名在视口中央淡入、停留和移动，用时 1.8 秒；等待两者动画实际完成后，其他内容再用约 0.9 秒依次淡入，避免移动元素穿过已经显示的文字。每个标签页会话首次进入播放，刷新可重播。普通站内返回、历史返回、锚点访问、减少动态效果模式跳过。滚动、触摸、点击、键盘输入或调整窗口均会结束入场；脚本加载失败有 4 秒回退，无 JavaScript 时内容直接显示。

桌面初始顶部留白由 80px 收紧至 32px，滚动时导航固定在 24px；手机保留原本较紧凑的 24px 留白和 12px 固定位置。阅读偏移同步调整为桌面 112px、手机 100px。导航后方使用独立、不接收点击的固定渐变遮罩层，对上方滚过的正文进行模糊；自上而下减弱，随深浅主题变色，与导航隐藏状态同步。

| 入口          | 插画                     | 文件                                       |
| ------------- | ------------------------ | ------------------------------------------ |
| Eason's Notes | 墨镜、红毛衣的 Woodstock | `src/assets/characters/woodstock-cool.png` |
| 笔记          | 红狗屋                   | `src/assets/characters/doghouse.png`       |
| 专题          | Woodstock                | `src/assets/characters/woodstock.png`      |
| 文章          | 阅读中的 Snoopy          | `src/assets/characters/snoopy-reading.png` |
| 关于          | Charlie Brown            | `src/assets/characters/charlie-brown.png`  |

头像 `src/assets/avatar.png` 是用户提供的史努比原图副本，未改动原始文件。导航品牌图以用户新提供的 Woodstock 刺绣图为目标，用内置 imagegen 去背景；其余插画为此前生成的素材。PNG 保留真实透明通道。Astro 在构建时把导航插画优化为 160px WebP，品牌显示 58px，其余显示 52px。

## 生成提示词

`woodstock-cool.png` 使用内置 imagegen 编辑模式，输入为用户提供的 `E2CA2D2A83B021A885E1DED697A22D65.png`，`transparent_background: true`。最终保存于 `src/assets/characters/woodstock-cool.png`。完整提示词：

```text
Use case: background-extraction. Asset type: small transparent website navigation character. Input image is the edit target. Extract the exact embroidered Woodstock bird wearing black sunglasses and a red sweater from this photograph onto genuine transparency. Preserve the character's pose, silhouette, yellow yarn, red sweater, black outlines, sunglasses, facial proportions and embroidered thread texture as faithfully as possible. Remove only the off-white fabric background and the horizontal ground stitching beneath the feet. Do not redraw as flat vector art. Isolate the complete bird with both feet and tail, centered on square canvas, filling 90 percent of canvas height with a small transparent margin. No added objects, no text, no shadow, no border.
```

以下公共前缀与每张图的独立后缀连接，构成完整提示词；每次调用均设置 `transparent_background: true`。

公共前缀：

```text
Use case: illustration-story. Asset type: a tiny decorative hover illustration for a quiet, MUJI-inspired personal notebook website. A single isolated Peanuts character/object, recognizable proportions, charming clean hand-inked black outline, warm ivory fills, limited muted colors, modest uneven pen character. Very simple flat 2D comic drawing, no embroidery or photographic texture, no shadows, no scene, no panel, no letters, no watermark, no sticker border. Genuine transparent background. Square canvas; entire subject visible, centered, fills 85% of canvas with a small transparent safe margin. It must be readable at 64 pixels.
```

`snoopy-cool.png`，以用户原头像为角色参考（旧版导航素材，现已由 `woodstock-cool.png` 替换）：

```text
Input image is the character-design reference. Reinterpret this exact standing Snoopy / Joe Cool pose wearing black sunglasses and a red sweater as a clean ink drawing. Keep his upward-facing nose, black ear, white body, both hands in sweater pockets, and the small feet. Keep the silhouette faithful. Use a slightly muted brick-red sweater. Remove the fabric background and ground marks. Character only.
```

`doghouse.png`：

```text
Subject: Snoopy's familiar little red doghouse alone, charming simple three-quarter view, red roof and muted brick red plank walls with fine black horizontal plank lines, a dark arched doorway. No dog, no grass, no scenery.
```

`woodstock.png`：

```text
Subject: Woodstock, the tiny yellow Peanuts bird, standing in side view with spiky feathers, a large beak and two tiny feet, looking upward with a curious little tilt. Muted mustard yellow and black outline only. No other objects.
```

`snoopy-reading.png`：

```text
Subject: Snoopy seated on the ground calmly reading a tiny open red book held in his paws. White dog, black floppy ear and nose, classic Peanuts proportions, quiet profile pose. Muted brick red book is the only accent. No clothes, no chair, no background.
```

`charlie-brown.png`：

```text
Subject: Charlie Brown standing quietly, his round head, single curled hair and gentle smile, wearing his mustard-yellow shirt with the familiar black zigzag stripe, black shorts and simple brown shoes. Arms relaxed behind his back. One complete figure only.
```
