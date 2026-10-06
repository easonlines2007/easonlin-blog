# Eason's Notes — Claude 工作说明

中文个人学习笔记网站。Astro 6 + astro-pure，`output: static`；GitHub `main` → Vercel 自动部署到 https://easonlin-blog.vercel.app 。
详细背景见 `artifacts/claude-handoff-2026-10-06/CLAUDE_HANDOFF.md`（git 忽略，仅本机）。判断优先级：当前代码与 Git/线上状态 > 交接文档 > `docs/` > 历史聊天。

## 原则

- 尽量少改，保持静态 Markdown + GitHub + Vercel 架构，不做大重构、不引入 CMS/数据库/全站 SSR。
- `main` 会被后台（GitHub API 提交）和每小时的 GitHub 数据同步 bot 并发写入：动手前先 `git status`，干净时 `git pull --ff-only origin main`；推送冲突先核对再处理。
- 视觉：简洁、MUJI 气质、少量 Peanuts 元素，动画克制并尊重 `prefers-reduced-motion`；深浅色跟随系统。字体霞鹜漫黑 + Schoolbell，正文系统字体。
- 联系图（微信、QQ、Instagram、小红书，按此顺序）为 5:7，必须完整显示，不裁切不放大。
- MIT 标签 `lineal algebra` 是用户指定拼写，保留。

## 内容与 Obsidian 同步

- Obsidian iCloud Vault 是笔记唯一源（路径见本机 `.env.local`，当前 `OBSIDIAN_PUBLISH_ALL=true` 全量发布）。**不修改 Vault 原稿和附件**，需要改时先征得用户同意。
- `src/content/notes/` 下由同步生成的副本、`src/data/obsidian-sync.json` 清单、`public/attachments/` 由同步脚本管理，**不要手改**，也不要删清单来强行同步。
- MIT 18.06 五篇由 `src/data/obsidian-imports.json` 规则从单个源稿拆分生成，不直接编辑。
- `src/data/note-overrides.json` 是后台对 Obsidian 文章的网站设置（标签、下架等），必须保留。
- 后台新建的文章在 `src/content/notes/web/`，可直接编辑。
- 公开笔记统一经 `src/lib/notes.ts` 读取；schema 在 `src/lib/note-schema.ts`。
- 用户说“同步 FC 笔记”= 拉取 → `pnpm obsidian:sync` → 审查 diff → `pnpm verify` → 提交推送 main → 确认 Vercel 部署 READY。

## 动态数据与凭据

- 首页格言存在私有 Vercel Blob（`site/motto.json`），线上值与源码默认值不同，**不要用默认值覆盖**。
- 后台 `/admin` 与格言共用作者口令会话；GitHub PAT 仅在 Vercel 服务端环境变量。不要读取、输出或提交 `.env.local`、`.env.motto.local`、`artifacts/` 中的凭据。

## 常用命令

```sh
pnpm dev            # 仅静态 Astro，不运行 api/ 函数
pnpm test
pnpm check
pnpm build          # PDF 资源准备 + astro check + build + Pagefind
pnpm verify         # test + build，提交前运行
pnpm format         # 会跳过受管理的 notes
pnpm obsidian:sync
pnpm github:update
```

项目要求 Node 24.x（本机 Node 更高会有 engine 提示，可忽略）。本地 admin/格言接口不可用不代表生产有问题。
