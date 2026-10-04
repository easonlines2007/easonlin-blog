import type { IntegrationUserConfig, ThemeUserConfig } from 'astro-pure/types'

export const theme = {
  title: "Eason's Notes",
  author: 'Eason Lin',
  description: '记录、整理，慢慢理解。一个持续生长的个人笔记本。',
  favicon: '/favicon.svg',
  logo: { src: '/favicon.svg', alt: 'Eason Lin' },
  locale: { lang: 'zh-CN', attrs: 'zh_CN', dateLocale: 'zh-CN' },
  prerender: true,
  header: {
    menu: [
      { title: '笔记', link: '/notes' },
      { title: '专题', link: '/notes/topics' },
      { title: '文章', link: '/blog' },
      { title: '关于', link: '/about' }
    ]
  },
  footer: { year: '© 2026', credits: true, social: [] },
  content: { externalLinks: { content: ' ↗' }, share: [] }
} satisfies ThemeUserConfig

export const integ = {
  pagefind: true,
  links: { logbook: [], applyTip: [], cacheAvatar: false },
  quote: { server: '', target: '' },
  typography: { class: 'prose', blockquoteStyle: 'normal', inlineCodeBlockStyle: 'modern' },
  mediumZoom: { enable: false },
  waline: { enable: false }
} satisfies IntegrationUserConfig

export default { ...theme, integ }
