# Apple Notes 随笔导入

随笔存放于 `src/content/essays/`，图片存放于 `public/essays/<slug>/`，独立于 Obsidian 管理的学习笔记和附件。

当前 10 篇文章通过 Apple Notes 自带的 Markdown 导出功能保存。原始导出和图片转换缓存只保存在被 Git 忽略的 `artifacts/` 中。导入脚本不读取 Notes 数据库、不操作备忘录 App，也不修改 iCloud Vault。

```sh
node scripts/import-apple-essays.mjs artifacts/apple-notes-export-2026-10-12 --update
```

脚本要求映射中的 10 个已导出目录齐全。首行年月或年月日转为带引号的 `written` 字段，正文移除首行日期和文章主标题；标题由文章页显示。日期只精确到月时保留到月，不虚构具体日期。新文章中重复的日期标题前缀会移除。

图片按原文顺序转换为 WebP，保留完整构图，依据元数据校正方向，最大长边 2000 像素且不放大。HEIC 在 macOS 上用系统 `sips` 转为本机 PNG 缓存后交给 Sharp。WebP 不包含原图 EXIF 信息。脚本保留诗歌换行与正文强调，合并多余空行，并将独立图片放入独立段落。

再次执行相同导出会按文件内容跳过未改动的文章与图片；报告列出实际更新文件。`--update` 允许更新不同的正文与图片，同时保留已有的网站标题和其他 frontmatter，仅按来源刷新写作日期。未传此参数时，存在不同内容仍会停止，避免意外覆盖。

仅清理 Apple 自动添加、无法在网页使用的 `x-apple-data-detectors:` 链接，保留其中的原文字词和正常网页链接。以后新增文章时可使用相同 frontmatter 约定，或扩充脚本中的导出目录映射。

网站已有英文版时，新增文章需补充对应译文；原文增加图片时也要更新英文图片引用，并刷新相关 `sourceHash`。完成后运行 `pnpm translations:check`、`pnpm verify` 和 `pnpm translations:verify`。
