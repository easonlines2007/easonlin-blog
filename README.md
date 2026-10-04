# Eason's Notes

一个基于 Astro + Astro Theme Pure 的个人笔记网站。内容以 Markdown 保存，构建为静态网页；不需要数据库。

## 本地运行

需要 Node.js 24 和 pnpm 11。

```sh
pnpm install
pnpm dev
```

完整搜索在构建后可用。检查第一版时使用：

```sh
pnpm test
pnpm build
pnpm preview
```

默认地址：`http://localhost:4321`。Pagefind 在每次构建后生成索引；开发服务器不提供生产搜索索引。

## 添加笔记

在 `src/content/notes/` 中创建 `.md` 文件。文件名决定网址，建议使用稳定的英文短名称。笔记可以分子目录保存。

```yaml
---
title: 我的第一篇笔记
description: 一句话说明这篇笔记的内容。
date: 2026-10-03
topic: 学习记录
tags: [阅读, 整理]
status: growing
publish: true
---
```

- `publish` 默认是 `false`；只有显式为 `true` 的笔记进入网页、导航、RSS 和搜索。
- `status` 为 `growing`（进行中）或 `ready`（已整理），与是否公开独立。
- `updated` 可记录修订日期，列表按更新时间排序。
- `sample: true` 显示示例标识；替换当前三篇示例时可以删除此字段。
- 使用标准 Markdown 内部链接，例如 `[另一篇笔记](/notes/example)`。

正文支持代码高亮/复制、KaTeX 数学公式、表格、折叠区块和文章目录。此版还未包含 Obsidian 仓库自动同步、Wikilink 转换、Dataview 或 Canvas 渲染。

## PDF 附件

将准备公开的 PDF 放入 `public/attachments/`，再在笔记头部填写：

```yaml
pdf: /attachments/my-notes.pdf
```

文件名使用英文字母、数字、下划线或短横线。页面使用 PDF.js 提供翻页、适合宽度和放大阅读，另有独立打开入口。原稿保持纸张颜色；选择文字、打印、编辑批注使用原文件。带密码的文件需独立打开。

PDF.js 仅在附件接近视口时加载。`scripts/prepare-pdf-assets.mjs` 在开发和构建前准备本地字体、CMap、解码器资源，不依赖第三方 CDN；生成的 `public/pdfjs/` 无需提交。

**`public/` 中的文件都会进入构建产物。**未发布笔记关联的私密附件也不要放在这里。`publish` 只控制 Markdown 内容，不能为公开资源提供访问控制。

当前搜索覆盖笔记正文和摘要，不包含 PDF 内部文字，也不执行 OCR。示例 PDF 是独立的演示材料。

## 主题和布局

- 首次访问跟随系统；支持手动浅色、深色及返回跟随系统。
- 偏好保存在浏览器本地；系统变化只影响“跟随系统”模式。
- 在首屏绘制前应用主题，减少闪烁。
- 尊重系统的减少动态效果设置。
- 手机提供独立菜单和可折叠目录。

站点信息与导航在 `src/site.config.ts`；颜色、间距和响应式规则在 `src/styles/global.css`。头像保存在 `src/assets/avatar.png`，使用用户提供的原图，由 Astro 在构建时优化。

视觉采用暖白、炭灰与少量砖红，标题搭配衬线字体。桌面顶栏在悬停或键盘聚焦时沿横轴翻转，从文字切换为插画；手机保留文字。映射集中在 `src/components/NavCharacter.astro`，素材和生成提示词见 [视觉说明](docs/visual-style.md)。

首页首次进入时，头像与姓名先居中出现，再移动到实际布局位置；等两者完全归位后，其余内容才依次淡入，全程约 2.7 秒。一次标签页会话中返回首页不会重复播放，主动刷新可重播。历史返回、锚点访问和减少动态效果模式跳过动画；操作页面或调整窗口会立即结束动画。逻辑独立在 `src/components/HomeEntrance.astro` 和 `src/scripts/home-entrance.ts`，不依赖动画库。

桌面顶栏上方留白为 32px，滚动时固定在距顶部 24px 处。滚动后导航上方显示随主题变化的渐变毛玻璃；导航收起时一起淡出。`--header-top` 和 `--reading-offset` 集中控制顶部位置与阅读锚点间距。

## 项目边界

- `src/lib/notes.ts` 是公开笔记的唯一读取入口。
- `src/lib/note-utils.ts` 集中管理排序、统计和网址。
- `src/layouts/` 负责页面布局，`src/components/` 负责可复用交互。
- `src/pages/` 负责路由；不把内容数据硬编码到展示组件。
- `tests/` 检查主题优先级、未发布内容过滤、排序和链接编码。

使用 `pnpm format` 统一代码格式，`pnpm format:check` 检查格式。第一版的实际检查记录见 [验证记录](docs/verification.md)。

文章页当前为真实空状态，评论服务尚未接入。

## 项目与联系方式

顶栏“项目”指向 `/projects`，展示 GitHub 公开贡献日历、个人项目和标注为 Fork 的学习参考仓库。笔记内部仍按专题归档。`src/data/github.json` 是匿名公开接口生成的数据快照，页面注明更新时间；运行 `pnpm github:update` 后提交更新即可刷新，不需要 GitHub Token，构建也不依赖 GitHub 网络请求。

“关于”页的微信、QQ、Instagram、小红书卡片使用一致的 4:5 展示框，原图以 `object-fit: contain` 完整显示。桌面悬停或键盘聚焦显示图片，点击可打开原比例大图；触屏设备直接显示图片。素材位于 `src/assets/contact/`，请仅放准备公开的联系方式。

浏览器与主屏幕图标使用同一张史努比头像；PNG、ICO 和 iPhone 的 `apple-touch-icon` 已配置。更换头像后运行 `pnpm icons`，提交生成的图标。Manifest 仅提供名称和图标，不包含离线缓存。

## 部署到 Vercel

`vercel.json` 使用 Astro 预设，固定 pnpm 11.25.0，安装时使用冻结锁文件，输出目录为 `dist`。设置环境变量 `SITE_URL` 为正式域名（含 `https://`），用于 canonical、RSS 和 sitemap；未设置时优先使用 Vercel 的生产域名，本地则使用预览地址。环境变量示例见 `.env.example`。

正式网址：[easonlin-blog.vercel.app](https://easonlin-blog.vercel.app)。源码保存在 GitHub 私有仓库 `easonlines2007/easonlin-blog`，Vercel 连接该仓库的 `main` 分支；推送更新后自动构建发布。

Vercel 项目使用 Node.js 24，生产与预览环境均设置 `SITE_URL=https://easonlin-blog.vercel.app`。网站公开访问，GitHub 源码仓库保持私有。

## 参考与许可

视觉参考：https://kbyylin-blog.vercel.app/

主题：https://github.com/cworld1/astro-theme-pure

使用官方 `astro-pure` 包及经过调整的排版配置，保留 Apache-2.0 许可证与 NOTICE。未使用参考博客的个人资料、头像或文章。
