# Eason's Notes

一个基于 Astro + Astro Theme Pure 的个人笔记网站。笔记以 Markdown 保存并构建为静态网页；首页格言通过独立的 Vercel Functions 与私有 Blob 存储保存。

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

日常笔记在 Obsidian Vault 的 `Blog/` 中创建，`src/content/notes/` 保存同步生成的博客副本。文件名决定网址，笔记可以分子目录保存。

最少只需这一项属性：

```yaml
---
publish: true
---
```

标题、简介、日期、分类、标签都可以不填；自动补值只写进博客副本。需要自己指定时，再添加下面这些可选属性：

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

| 属性             | 未填写或留空时                                        |
| ---------------- | ----------------------------------------------------- |
| `title`          | 使用文件名（不含 `.md`）                              |
| `description`    | 留空                                                  |
| `date`           | 初次同步使用源文件修改日（UTC），后续保留已同步的日期 |
| `topic`          | 使用 Blog 下第一层子目录名，根目录笔记归到“随笔”      |
| `tags`           | 无标签，不影响发布                                    |
| `status`         | `growing`                                             |
| `updated`、`pdf` | 不启用相应可选字段                                    |

- `publish` 默认是 `false`；只有显式为 `true` 的笔记进入网页、导航、RSS 和搜索。
- 如果主动填写日期，建议使用 `2026-10-05` 这样的真实日期字符串；数字 `20261005` 和不存在的日期会报错。`tags` 使用列表，如 `[阅读, 整理]`，可以在 Obsidian 属性面板中添加。
- `status` 为 `growing`（进行中）、`ready`（已整理）或 `completed`（已完成），与是否公开独立。
- `updated` 可记录修订日期，列表按更新时间排序。
- `sample: true` 显示示例标识；替换当前三篇示例时可以删除此字段。
- 使用标准 Markdown 内部链接，例如 `[另一篇笔记](/notes/example)`。

正文支持代码高亮/复制、KaTeX 数学公式、Mermaid 流程图、表格、折叠区块和文章目录。图片与流程图接近视口时加载。Obsidian 导入支持公开笔记和附件链接转换；Dataview、Canvas 和 Obsidian 插件动态渲染不在同步范围内。

顶栏“笔记”进入 `/notes`，提供全部笔记、专题、标签和整理状态四个入口；全部专题直接展开。`/notes/all` 按最近更新列出笔记，`/notes/status` 可进入“进行中”、“已整理”和“已完成”。专题内可通过可选的正整数 `order` 指定阅读顺序，不影响首页和全部笔记的时间排序；有顺序的文章提供上一篇／下一篇导航。

笔记列表与随笔列表提供日期、标题的正序和倒序排序，切换时即时重排，状态筛选继续有效。笔记按添加日期排序，随笔按原始写作日期排序；“默认顺序”可恢复页面原有顺序，包括课程专题的讲次排列。

MIT 18.06 原稿按五个一级 Lecture 模块同步为五篇：01–05、06–13、14–20、21–27（含 24b 复习）、28–34。导入规则保存在 `src/data/obsidian-imports.json`，统一专题 `MIT 18.06` 与标签 `lineal algebra`。只拆分网站副本，保留原稿与附件；目录与配置不一致时同步停止并保留上一份结果。不要直接修改生成的五篇笔记。

原稿的板书图片位于 VideoBook 输出目录时，在本机 `.env.local` 设置 `OBSIDIAN_ATTACHMENT_PATH` 为该目录的绝对路径。同步先查找 Vault，再按原引用的相对路径查找这个附件目录，仅复制实际引用的图片/PDF；`watch` 会监控这些附件的更新。路径不进入 Git 或 Vercel，源文件不写回。

### CS61A 课程

CS61A 全书按原稿正文的 Lecture 1–37 拆为 37 篇笔记，专题为 `CS61A`，统一标签 `cs61a`、状态 `completed`（已完成），添加日期为 `2026-10-09`。专题页按讲次排序，每篇提供上一篇／下一篇。原稿总目录的单讲链接转换为站内地址；577 张课堂配图保留原始字节，复制到 `public/attachments/cs61a-*.png`。

从 VideoBook 全书原稿及同目录下的配图重新执行相同导入：

```sh
node scripts/import-cs61a.mjs /绝对路径/CS61A_Structure_and_Interpretation_of_Computer_Programs_Full_Book.md 2026-10-09
```

导入先在临时目录完成分讲、链接转换与附件校验，再复制到博客。相同原稿和添加日期重复执行会跳过相同文件；目标文件有不同内容时停止，避免覆盖。原稿及真实 Obsidian Vault 不写回；CS61A 不加入 `obsidian-sync.json`，后续同步其他笔记时保留本课程。

### CSAPP 与 CS61B 课程

CSAPP 按 Lecture 01–26 收录为 26 篇，CS61B 按 Lecture 01–40 收录为 40 篇，各有独立专题与同名小写标签。添加日期为 `2026-10-21`，状态为 `completed`，专题按讲次排序，每篇提供上一篇／下一篇导航。原稿中的课程目录与分讲链接转换为站内地址，视频时间跳转、代码、公式与 Mermaid 图保留。

```sh
node scripts/import-course-lectures.mjs csapp /绝对路径/csapp_markdown 2026-10-21
node scripts/import-course-lectures.mjs cs61b /绝对路径/cs61b_markdown 2026-10-21
```

导入复用隔离的同步转换流程，只复制正文引用的配图，不写回原稿、附件或真实 Obsidian 清单；重复导入跳过相同文件，已有不同内容时停止。CSAPP 第 3 讲的失效图片引用在博客副本中按讲义主题修正，映射记录在导入脚本中；公式与 Mermaid 标签中的格式问题也在副本中修复。

### 更新 VideoBook 扩充版

2026-10-22 已用前一晚更新的 `csapp_markdown`、`cs61a_markdown`、`cs61b_markdown` 刷新全部 103 讲，保留现有网址、首次添加日期、标签和整理状态，新增 `updated` 日期。新导入器也支持 CS61A 的逐讲目录：

```sh
node scripts/import-course-lectures.mjs csapp /绝对路径/csapp_markdown 2026-10-21 2026-10-22
node scripts/import-course-lectures.mjs cs61a /绝对路径/cs61a_markdown 2026-10-09 2026-10-22
node scripts/import-course-lectures.mjs cs61b /绝对路径/cs61b_markdown 2026-10-21 2026-10-22
```

最后一项是显式更新日期；不提供它仍会拒绝覆盖不同内容。刷新前完整校验讲次、附件与目标文件，期间目标笔记变化时停止。按图片内容复用已有附件，避免因为来源目录改名重复复制 CS61A 的 577 张截图。CS61B 教材的本地链接转为官方网页，清理 GitBook 模板标记；八处已失效的教材旧图改为可阅读的章节链接。已有 CS61A 英文译文保留，页面注明属于扩充前版本，`sourceHash` 保留以继续提示翻译待更新。

## 从 iCloud Obsidian 同步

现有 iCloud Vault 继续作为笔记唯一来源，不移动 Vault，也不修改其中任何文件。在 Vault 中自行创建 `Blog/` 文件夹，准备公开的 Markdown 放在这里，子目录结构会保留。

复制环境配置并填入 Vault 的**绝对路径**（是 Vault 根目录，不是 Blog 目录）：

```sh
cp .env.example .env.local
```

```dotenv
OBSIDIAN_VAULT_PATH="/你的/iCloud/Vault/绝对路径"
```

`.env.local` 已被 Git 忽略，路径只保存在本机，不放进 GitHub 或 Vercel。环境变量 `OBSIDIAN_VAULT_PATH` 也可以直接由 shell 设置，优先于本地文件。

每篇笔记只需上面的最简 frontmatter；只有布尔值 `publish: true` 会导出，缺失或 false 不会发布；字符串 `"true"` 会报错，不能代替布尔值。同步器补齐缺失属性后再按现有博客规则校验；手动填写但类型或格式错误的属性仍会报错，避免把格式错误带进构建。

### 全量发布 FC

按作者后续要求，本机 FC Vault 已启用全量发布。在 `.env.local` 设置：

```dotenv
OBSIDIAN_PUBLISH_ALL=true
```

这会同步整个 Vault 的 Markdown，包含未填写 `publish`、`publish: false` 的笔记；只在博客副本中设置公开，原文件不写回。`.obsidian`、隐藏目录和符号链接仍排除，只有被笔记引用的图片/PDF 会复制。保留源子目录，并保持已有 Blog 笔记网址。将该选项改为 `false` 或移除，即恢复默认的 Blog/publish:true 筛选；再次同步会清理不再符合范围的受管理副本。

全量模式下 `watch` 也监控整个 Vault。后续说“帮我同步 FC 笔记”时，沿用本机当前配置完成导入、构建、提交与推送，并确认 Vercel 部署。

### 运行同步

```sh
pnpm obsidian:sync
pnpm obsidian:watch
```

`sync` 一次同步到 `src/content/notes/`；`watch` 初次同步后持续监控 Blog 和已引用附件，修改后自动同步。开发时在另一个终端运行 `pnpm dev`，Ctrl+C 停止监控。监控只更新项目副本，不自动提交或推送。

两条命令按需选一种：偶尔导入使用 `sync`，持续写作使用 `watch`，无需同时开多个监控进程。属性报错后 `watch` 会继续等待，源文件修改后自动重试。`Unsupported engine` 表示本机 Node 与项目推荐的 Node 24 不一致，是版本提示，与属性校验失败无关；生产环境继续使用 Node 24。

笔记中的图片/PDF、Obsidian `![[附件]]` 和 frontmatter `pdf` 引用会复制到 `public/attachments/`，转换为网站路径。生成附件名使用稳定哈希与原扩展名，以支持中文、空格并兼容现有 PDF viewer。笔记内部链接只连接 Blog 内已公开的笔记。附件解析支持笔记相对路径、Vault 相对路径及唯一文件名；同名歧义或缺失附件会报错，不能猜测。代码块与行内代码保持原样。

`![[笔记]]` 与 `![[文件.pdf]]` 转换为普通链接，不执行 Obsidian 转引；需要内嵌 PDF 阅读器时使用 frontmatter `pdf` 字段。块定位 `#^block-id`、本地 HTML `srcset` 与 CSS `url()` 暂不支持，遇到时会明确报错。页面地址遵循现有 Astro 规则（如 `阅读/index.md` 对应 `/notes/阅读`）；`index`、`all`、`status`、`pdf`、`tags`、`topics` 是已有页面保留的首层名称，不能作为导入笔记地址。

脚本跳过 `.obsidian` 和符号链接，只读取 Blog Markdown 及被公开笔记引用的图片/PDF，不复制整个 Vault。同步清单 `src/data/obsidian-sync.json` 记录生成文件归属，需要随内容提交。把笔记改成草稿或删除源文件时，只清理同步清单拥有的项目副本及不再使用的附件，现有手写/示例内容保留；与手写文件重名或生成副本被手动修改时会报错。缺少 Blog、iCloud 文件尚未下载、链接解析或校验失败时保留上一份同步结果。

不要直接编辑已同步到项目的笔记，回 Obsidian 修改。项目格式化命令跳过笔记目录，避免改动同步副本导致归属校验失败。同步前保证 Blog 和引用附件已经由 iCloud 下载到本机；脚本不接管 iCloud 的下载或同步设置。

完成修改后：

```sh
pnpm obsidian:sync
pnpm verify
git add src/content/notes public/attachments src/data/obsidian-sync.json
git commit -m "Update notes from Obsidian"
git push origin main
```

工作流是 **Obsidian/iCloud → Blog → 本机同步 → Git push → Vercel 自动部署**。Vercel 构建只读取已提交的副本，不需要访问你的 iCloud，也不需要 Vault 路径。新公开笔记引用的附件也会公开；将 `publish` 改回 false 后，需同步并推送清理结果才会从新部署中移除。

## 网页文章管理

点击任意页面底部的“文章管理”，或直接访问 `/admin`，使用与首页格言编辑相同的作者口令登录。后台沿用静态页面与根目录 Vercel Functions，不需要数据库或全站 SSR。登录不依赖格言的 Blob 存储；两个编辑入口共享作者会话，退出会同时注销。

- 查看和搜索全部仓库文章，包括草稿；修改标题、简介、分类、标签及发布状态。标签用逗号分隔，可直接改名或点击 × 移除。
- 展开“专题置顶”，点击专题旁的“置顶”或“取消置顶”。支持多个专题，最新置顶的排在最前；未置顶的维持原有篇数排序。设置独立保存在 `src/data/topic-settings.json`，不修改笔记或 Obsidian；随下一次部署统一更新首页、笔记页、专题页和侧栏，中英文共用。
- 新增时上传或粘贴不超过 256 KB 的 UTF-8 Markdown，填写文章信息，保存到 `src/content/notes/web/`。表单属性优先，保留文件中其余 frontmatter；缺少日期时使用创建日（UTC）。文章网址由文件名决定，第一版不提供重命名与正文编辑。
- 网页／手写文章直接更新 Markdown frontmatter；正文和其他属性保留。可以取消发布，也可以删除整个 Markdown。附件不会随文章自动删除。
- Obsidian 文章只修改 `src/data/note-overrides.json` 中的网站属性，不改同步副本或同步清单。只记录实际改动的字段；标签列表整体替换，空数组表示清空。取消发布表示从网站下架，Vault 原文保留。“恢复 Obsidian 设置”清除这篇文章的全部网站覆盖值，包括下架设置。
- 构建先合并网站设置，再过滤 `publish`。首页、文章、分类、标签、RSS 与 Pagefind 搜索统一生效。源文件不再存在时，覆盖值不会生成文章；源路径重命名后，需在后台重新设置新路径。覆盖值不会写回 Obsidian。

在 **Vercel Production** 环境配置（Preview 禁用管理接口）：

| 变量                                                | 用途                                                    |
| --------------------------------------------------- | ------------------------------------------------------- |
| `BLOG_GITHUB_TOKEN`                                 | 仅限该仓库、具有 Contents 读写权限的 fine-grained Token |
| `BLOG_GITHUB_OWNER`                                 | `easonlines2007`                                        |
| `BLOG_GITHUB_REPO`                                  | `easonlin-blog`                                         |
| `BLOG_GITHUB_BRANCH`                                | `main`                                                  |
| `MOTTO_ADMIN_PASSWORD_HASH`、`MOTTO_SESSION_SECRET` | 沿用已有高强度作者口令哈希与独立签名密钥                |

Token 仅由服务端 `process.env` 读取，不能使用 `PUBLIC_` 前缀，不填写在浏览器或提交到 Git。`/admin` 只输出空页面框架，文章数据在鉴权后读取；API 禁止缓存，并检查写操作的 Origin、路径、属性和请求大小。错误响应不会回显 Token 或 GitHub 原始错误。

每次保存创建 Git 提交，继续由现有 Vercel Git 集成自动部署。界面显示“已提交”只表示 GitHub 保存成功，部署状态在 Vercel 查看；构建失败时旧网站继续服务。GitHub 使用读取时的完整仓库版本作为父提交，更新分支时始终 `force: false`；如果网页、Obsidian 或定时任务已提交新版本，保存返回冲突，保留输入，需核对并重新加载，不自动覆盖。受保护分支必须允许该作者按现有规则提交，后台不会绕过分支规则。

后台提交明确使用作者的 GitHub `noreply` 邮箱作为 author 和 committer，避免 GitHub 默认身份将私人邮箱写入公开历史。

本机后续同步前，先确认工作区并拉取网页端的新提交，再运行现有 `obsidian:sync` / `obsidian:watch`。覆盖文件需要随代码保留，同步脚本不会改写它。下架不是附件访问控制，也不会清除 Git 历史或旧部署。

`pnpm dev` 仍只提供 Astro 页面，不执行根目录 `api/`；完整联调使用已配置环境的 `vercel dev` 或 Vercel Production 部署。自动化测试直接调用同一组管理处理函数和模拟 GitHub API，使用临时 Vault 验证再次同步不会覆盖网站设置，不写真实仓库或 Vault。

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

视觉采用暖白、炭灰与少量砖红，顶栏和标题使用本地托管的霞鹜漫黑与 Schoolbell，中文标题为 22px，首页姓名为 48px；正文保留系统字体。字体许可位于 `public/fonts/`。首页四块内容共用分栏行组件，统一分隔线、箭头和悬停反馈。桌面顶栏在悬停或键盘聚焦时沿横轴翻转，从文字切换为插画；手机保留文字。映射集中在 `src/components/NavCharacter.astro`，素材和生成提示词见 [视觉说明](docs/visual-style.md)。

首页首次进入时，头像与姓名先居中出现，再移动到实际布局位置；等两者完全归位后，其余内容才依次淡入，全程约 2.7 秒。一次标签页会话中返回首页不会重复播放，主动刷新可重播。历史返回、锚点访问和减少动态效果模式跳过动画；操作页面或调整窗口会立即结束动画。逻辑独立在 `src/components/HomeEntrance.astro` 和 `src/scripts/home-entrance.ts`，不依赖动画库。

可进入的卡片与横线条目统一使用整块点击区域，悬停与键盘焦点反馈覆盖相同范围。首页栏目留白进入对应栏目，内层条目进入各自文章或专题；笔记标签、搜索子章节保留独立链接。联系方式图片与下方说明共用一个弹窗按钮。实现共用 `entry-surface` 与 `entry-link`，保留原生链接的键盘操作和新标签页打开方式。

桌面顶栏上方留白为 32px，滚动时固定在距顶部 24px 处。滚动后导航上方显示随主题变化的渐变毛玻璃；导航收起时一起淡出。`--header-top` 和 `--reading-offset` 集中控制顶部位置与阅读锚点间距。

## 首页格言

首页姓名下方的格言保持纯文字外观。点击旁边的“编辑”，输入作者口令后，直接点击文字修改；按 Enter 或离开文字自动保存，Escape 取消当前编辑。普通访客只读。成功保存后，新访客和刷新页面的访客都会读取最新内容，无需重新部署。

私有 Blob 固定保存 `site/motto.json`，读取不使用缓存，写入通过 ETag 防止多个页面互相覆盖。保存失败保留草稿并提供重试；冲突需主动选择最新内容。会话使用 HttpOnly、Secure、SameSite=Strict Cookie，期限七天；服务端检查同源请求和 120 字限制。明文口令不进入代码、Git 或客户端。

在 Vercel 连接私有 Blob（OIDC 方式，注入 `BLOB_STORE_ID`），并配置生产环境的 `MOTTO_ADMIN_PASSWORD_HASH` 和 `MOTTO_SESSION_SECRET`。前者是高强度随机口令的 SHA-256，后者是独立的至少 32 字符随机密钥；不要用日常短密码。修改任一验证变量会使现有会话失效。预览环境未配置作者验证，保持只读。默认文字位于 `src/data/motto.json`，存储暂不可用时使用该内容。

本地 `pnpm dev` 只提供静态 Astro 页面；实际编辑接口由根目录 `api/` 的 Vercel Functions 提供，需要在 Vercel 部署中验证。

## 项目边界

- `src/lib/notes.ts` 是公开笔记的唯一读取入口。
- `src/lib/note-utils.ts` 集中管理排序、统计和网址。
- `src/layouts/` 负责页面布局，`src/components/` 负责可复用交互。
- `src/pages/` 负责路由；不把内容数据硬编码到展示组件。
- `tests/` 检查主题优先级、未发布内容过滤、排序和链接编码。

使用 `pnpm format` 统一代码格式，`pnpm format:check` 检查格式。第一版的实际检查记录见 [验证记录](docs/verification.md)。

文章页当前为真实空状态，评论服务尚未接入。

## 项目与联系方式

顶栏“项目”指向 `/projects`，展示 GitHub 公开贡献日历、个人项目和标注为 Fork 的学习参考仓库。笔记内部仍按专题归档。项目名称、描述、语言与仓库链接跟随 GitHub 更新，不再使用手工覆盖的描述。“关于”页在介绍下方展示 GitHub 个人资料卡，包括公开头像、姓名、用户名、学校、所在地、公开仓库数、关注者及正在关注数，并提供 GitHub 主页链接。资料与现有 GitHub 快照每周同步，头像直接使用 GitHub 的公开头像地址。

`.github/workflows/sync-github.yml` 每周一 UTC 00:17 检查一次，并支持在 Actions 页面手动运行。同步使用匿名公开接口，覆盖分页中的全部公开、未归档仓库；私有仓库不会进入网站。数据有变化时更新 `src/data/github.json` 并推送到 `main`，随后 Vercel 自动构建发布。数据不变时跳过提交和部署。页面日期表示数据最后发生变化的时间，执行记录可在 GitHub Actions 查看；定时执行可能受 GitHub 队列影响而延迟。

同步会重试暂时的网络错误，并在验证仓库字段、日期完整性和贡献数字后原子替换快照。接口异常时工作流失败并保留上一次可用数据，网站构建不依赖 GitHub 网络请求。运行 `pnpm github:update` 仍可手动更新；不需要个人 GitHub Token 或 Vercel Token，工作流仅使用 GitHub 内置的当前仓库写入凭据。

顶栏“友链 / Links”位于“关于”左侧，对应 `/links` 与 `/en/links`。友链数据和样式在 `src/components/FriendLinks.astro`，头像保存在 `src/assets/friends/`。桌面三列，窄屏单列；GYX 的恐龙头像在深浅主题下均使用白底。页面下方提供本站名称、网址、头像地址和简介，供互挂友链使用。本站简介为“史努比的红狗屋”，显示时保留引号。

“关于”页的联系方式按微信、QQ、Instagram、小红书排列，使用一致的 5:7 展示框、不加内边距。素材使用准备好的 5:7 图片，以 `object-fit: contain` 完整显示，不裁切、不局部放大。桌面悬停或键盘聚焦显示图片，点击可打开完整原比例大图；触屏设备直接显示图片。素材位于 `src/assets/contact/`，请仅放准备公开的联系方式。

浏览器与主屏幕图标使用同一张史努比头像；PNG、ICO 和 iPhone 的 `apple-touch-icon` 已配置。更换头像后运行 `pnpm icons`，提交生成的图标。Manifest 仅提供名称和图标，不包含离线缓存。

## 部署到 Vercel

`vercel.json` 使用 Astro 预设，固定 pnpm 11.25.0，安装时使用冻结锁文件，输出目录为 `dist`。设置环境变量 `SITE_URL` 为正式域名（含 `https://`），用于 canonical、RSS 和 sitemap；未设置时优先使用 Vercel 的生产域名，本地则使用预览地址。环境变量示例见 `.env.example`。

正式网址：[easonlin-blog.vercel.app](https://easonlin-blog.vercel.app)。源码保存在 GitHub 私有仓库 `easonlines2007/easonlin-blog`，Vercel 连接该仓库的 `main` 分支；推送更新后自动构建发布。

Vercel 项目使用 Node.js 24，生产与预览环境均设置 `SITE_URL=https://easonlin-blog.vercel.app`。网站公开访问，GitHub 源码仓库保持私有。

## 参考与许可

视觉参考：https://kbyylin-blog.vercel.app/

主题：https://github.com/cworld1/astro-theme-pure

使用官方 `astro-pure` 包及经过调整的排版配置，保留 Apache-2.0 许可证与 NOTICE。未使用参考博客的个人资料、头像或文章。

## 中英文双语

中文页面保留现有网址，英文页面位于 `/en/`。顶栏深浅色按钮旁的语言切换器显示 `中/EN` 或 `EN/中`，当前语言在前，点击后以小幅交换动效进入同一页面的另一种语言；系统减少动态效果时直接跳转。语言由网址决定，不强制按浏览器语言重定向。

所有公共页面以及文章管理、搜索、目录、排序、主题与 PDF 阅读器提示均提供中英文界面。中英文分别生成 Pagefind 索引和 RSS（`/rss.xml`、`/en/rss.xml`），每个真实译文页面有独立 canonical 和双向 hreflang。图片、代码与数学公式共用原始资源，图片和 PDF 内的文字仍属于原附件。

英文正文单独保存于 `src/content/translations/en/{notes,essays}/`，通过 `kind` 和 `source` 关联原文；不是访问时调用翻译服务。原文继续由 Obsidian／网页管理维护，译文不会进入 Obsidian 同步清单。译文标题、简介与正文独立维护，写作日期、专题、标签、状态和附件继承原文。下架或删除原文也会使关联译文从页面、列表、RSS 和搜索消失。缺少译文的新文章只生成中文页，切换器明确提示暂无英文译文。

现有随笔和部分实验笔记使用 AI 辅助译文，其余技术笔记使用机器辅助译文；`translationMethod` 保存来源，英文文章提供返回原文的链接。英文格言通过同一作者会话单独编辑；中文格言修改后应相应更新英文值。

检查译文覆盖和原文更新：

```sh
pnpm translations:check
```

源文件及实际发布的标题、简介哈希保存在译文的 `sourceHash` 中；原文修改或网页管理覆盖标题、简介后，该命令会指出待更新译文。日期、代码和公式不被翻译脚本重写。更新译文时可手动编辑英文 Markdown，或生成可审核的分段翻译草稿：

```sh
pnpm translations:prepare artifacts/translation-draft.json
# 填写 JSON 的 dictionary，保留各原文键，只翻译对应值。
pnpm translations:apply artifacts/translation-draft.json --update
pnpm translations:check
pnpm verify
pnpm translations:verify
```

草稿先按 Markdown 结构提取文字、图注及 Mermaid 中文标签，排除程序代码、行内代码和数学公式，并附带术语表供翻译时参考。应用时先校验原文是否仍与草稿版本一致，再生成整个批次，重写有英文版本的站内链接及标题锚点。已有译文必须显式传入 `--update` 才会覆盖；更新前请保留人工修订。翻译工具不内置远程服务或密钥，构建和读者访问均不调用翻译 API。

`translations:verify` 在构建后检查英文页面链接、锚点、语言与 canonical，并确认机器辅助译文保留原文代码、公式及图片引用。
