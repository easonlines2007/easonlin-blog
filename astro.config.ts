import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import pure from 'astro-pure'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import config from './src/site.config'
import rehypeLazyImages from './src/lib/rehype-lazy-images'

export default defineConfig({
  site:
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:4321'),
  output: 'static',
  // Pagefind discovers directory-style URLs; accept both forms in dev and preview.
  trailingSlash: 'ignore',
  prefetch: { defaultStrategy: 'hover' },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeLazyImages]
    }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } }
  },
  integrations: [pure(config)]
})
