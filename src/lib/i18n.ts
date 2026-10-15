import extraEnglish from '../data/ui-en.json' with { type: 'json' }
export type Locale = 'zh' | 'en'

export function localeFromPath(path: string): Locale {
  return /^\/en(?:\/|$)/.test(path) ? 'en' : 'zh'
}

export function localizePath(path: string, locale: Locale): string {
  if (!path.startsWith('/') || path.startsWith('//')) return path
  const base = path.replace(/^\/en(?=\/|$)/, '') || '/'
  return locale === 'en' ? `/en${base === '/' ? '/' : base}` : base
}

const english: Record<string, string> = {
  首页: 'Home',
  笔记: 'Notes',
  项目: 'Projects',
  随笔: 'Essays',
  友链: 'Links',
  '“史努比的红狗屋”': '“Snoopy’s red doghouse”',
  关于: 'About',
  全部笔记: 'All notes',
  全部随笔: 'All essays',
  专题: 'Topics',
  标签: 'Tags',
  全部专题: 'All topics',
  全部标签: 'All tags',
  整理状态: 'Note status',
  进行中: 'Growing',
  已整理: 'Ready',
  已完成: 'Completed',
  'PDF 笔记': 'PDF notes',
  搜索: 'Search',
  搜索文章: 'Search articles',
  跳转到正文: 'Skip to content',
  页脚链接: 'Footer links',
  文章管理: 'Manage articles',
  '订阅 RSS': 'Subscribe via RSS',
  主导航: 'Main navigation',
  手机导航: 'Mobile navigation',
  打开导航菜单: 'Open navigation',
  主题设置: 'Theme settings',
  主题模式: 'Color theme',
  跟随系统: 'System',
  浅色: 'Light',
  深色: 'Dark',
  回到顶部: 'Back to top',
  复制: 'Copy',
  复制代码: 'Copy code',
  已复制: 'Copied',
  请选中后复制: 'Select and copy',
  本页目录: 'On this page',
  文章目录: 'Table of contents',
  '文章目录（手机）': 'Table of contents (mobile)',
  返回全部笔记: 'Back to all notes',
  上一篇: 'Previous',
  下一篇: 'Next',
  较新一篇: 'Newer essay',
  较早一篇: 'Older essay',
  随笔阅读导航: 'Essay navigation',
  专题阅读顺序: 'Topic reading order',
  示例笔记: 'Sample note',
  笔记分类: 'Browse notes',
  按整理状态筛选: 'Filter by note status',
  排序: 'Sort',
  默认顺序: 'Default order',
  添加日期: 'Date added',
  写作日期: 'Date written',
  '暂时还没有随笔。': 'No essays yet.',
  '还没有公开专题。': 'No published topics yet.',
  '这个状态下还没有笔记。': 'No notes with this status yet.',
  '还没有符合条件的公开笔记。': 'No published notes match yet.',
  '一些感受，一些想法，写下来，留在这里。': 'Feelings and thoughts, written down and kept here.',
  '从一篇笔记、一个专题，或一个关键词开始读。': 'Start with a note, a topic, or a keyword.',
  '把相关的笔记放在一起，沿着一个主题慢慢读。':
    'Related notes, gathered around a topic to explore at your own pace.',
  '看看仍在生长的想法，以及已经整理好的笔记。':
    'Ideas still growing, and notes that have taken shape.',
  日常: 'Everyday',
  '学习笔记、阅读批注与零散思考': 'Study notes, reading annotations, and scattered thoughts',
  更多关于这里: 'More about this space',
  最近笔记: 'Recent notes',
  最近随笔: 'Recent essays',
  '全部项目与 GitHub 动态': 'All projects and GitHub activity',
  笔记一览: 'Notes at a glance',
  总计: 'Total',
  'GitHub 动态': 'GitHub activity',
  个人项目: 'Personal projects',
  学习与参考: 'Learning and references',
  '学习参考 · Fork': 'Learning · Fork',
  查看仓库: 'View repository',
  '正在做的项目，以及学习过程中留下的代码。':
    'Projects in progress, and code from the things I am learning.',
  '把想法慢慢做出来，也留下学习的过程。':
    'Turning ideas into projects, and keeping a record of the learning.',
  'Fork 的公开仓库，用来阅读实现与学习；原作者保留各自的署名与许可。':
    'Public repositories forked for reading and learning. Attribution and licenses remain with their original authors.',
  记录的方法: 'How I keep notes',
  如何联系我: 'Get in touch',
  '欢迎交流学习、阅读和日常。添加好友时，请简单说明来意。':
    'Happy to chat about studying, reading, and everyday life. Please include a short introduction when adding me.',
  微信: 'WeChat',
  小红书: 'Xiaohongshu',
  扫码添加好友: 'Scan to add me',
  '查看联系方式 ↗': 'View contact details ↗',
  关闭联系方式大图: 'Close contact image',
  '关闭 ×': 'Close ×',
  '正在准备搜索…': 'Preparing search…',
  '输入一个关键词，找回读过、写过的内容。':
    'Find something you have read or written with a keyword.'
}

export const useTranslations = (locale: Locale) => (text: string) =>
  locale === 'en' ? (english[text] ?? (extraEnglish as Record<string, string>)[text] ?? text) : text

export const noteCount = (count: number, locale: Locale) =>
  locale === 'en' ? `${count} ${count === 1 ? 'note' : 'notes'}` : `${count} 篇笔记`

export const statusLabel = (status: string, locale: Locale) =>
  ({
    growing: locale === 'en' ? 'Growing' : '进行中',
    ready: locale === 'en' ? 'Ready' : '已整理',
    completed: locale === 'en' ? 'Completed' : '已完成'
  })[status] ?? status

export function formatMessage(template: string, values: unknown[]): string {
  return template.replace(/\{(\d+)\}/g, (match, index: string) =>
    String(values[Number(index)] ?? match)
  )
}
