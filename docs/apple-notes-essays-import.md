# Apple Notes 随笔导入

随笔存放于 `src/content/essays/`，图片存放于 `public/essays/<slug>/`，独立于 Obsidian 管理的学习笔记和附件。

本次 9 篇文章来自用户手动导出的 Apple Notes Markdown 包。原始导出和图片转换缓存只保存在被 Git 忽略的 `artifacts/` 中。导入脚本不读取 Notes 数据库、不操作备忘录 App，也不修改 iCloud Vault。

```sh
node scripts/import-apple-essays.mjs artifacts/apple-notes-export-2026-10-09
```

脚本要求 9 个已导出的目录齐全。首行年月或年月日转为带引号的 `written` 字段，正文移除首行日期和文章主标题；标题由文章页显示。日期只精确到月时保留到月，不虚构具体日期。`夜` 的标题移除重复的 `2025.9` 前缀。

图片按原文顺序转换为 WebP，保留完整构图，依据元数据校正方向，最大长边 2000 像素且不放大。HEIC 在 macOS 上用系统 `sips` 转为本机 PNG 缓存后交给 Sharp。WebP 不包含原图 EXIF 信息。脚本保留诗歌换行与正文强调，合并多余空行，并将独立图片放入独立段落。

再次执行相同导出会跳过已有文件。如果目标已有不同内容，脚本停止，避免覆盖网站上的后续编辑；先核对差异后再决定更新。以后新增文章时可使用相同 frontmatter 约定，或明确扩充脚本中的导出目录映射。
