import type { Locale } from './i18n'

interface ExcerptPart {
  text: string
  strong?: boolean
}

// Directory-only selections; the full essays and homepage excerpts keep their source text.
const excerpts: Record<string, Record<Locale, ExcerptPart[]>> = {
  nineteen: {
    zh: [{ text: '夜半的梦呓，看个笑话罢。\n言归正传，19岁生日快乐。' }],
    en: [
      {
        text: 'Midnight rambling—take it as a joke.\nBack to the point: happy nineteenth birthday.'
      }
    ]
  },
  fantasy: {
    zh: [
      { text: '毕竟，生活从来不如架空世界般的热烈。\n那么，' },
      { text: '“它是不是缺少了一小撮幻想元素呢？”', strong: true }
    ],
    en: [
      { text: 'After all, life has never burned as brightly as fictional worlds do.\nSo, ' },
      { text: '“could it use a little touch of fantasy?”', strong: true }
    ]
  },
  night: {
    zh: [{ text: '上次听这些歌是在哪儿呢？' }],
    en: [{ text: 'Where was I the last time I heard them?' }]
  },
  'no-regrets': {
    zh: [
      {
        text: '未来的不确定性赋予了我们继续生活的意义，每一个未知的选择将我们导向命运的尽头，没有万全的优解，一路的选择塑造了现存的我们。因而我想，不妨大胆些，任何选择，都没有错。'
      }
    ],
    en: [
      {
        text: 'The uncertainty of the future gives us a reason to keep living. Each unknown decision carries us further into our fate. There is no perfectly safe, optimal answer; the choices along the way have made us who we are. So perhaps I can afford to be a little bolder. There is no inherently wrong choice.'
      }
    ]
  },
  unfinished: {
    zh: [{ text: '毕竟你永远无法完全准备好，而“踏上取经路，远比抵达灵山重要。”' }],
    en: [
      {
        text: 'You can never be completely ready, after all, and “setting out on the pilgrimage matters far more than reaching the sacred mountain.”'
      }
    ]
  },
  'ability-and-desire': {
    zh: [
      {
        text: '现实与理想的巨大反差，将给人以无边的痛苦，若不回心转意，可将大抵如贾琏一般溺死于一片幻想的阴湿之上了。'
      }
    ],
    en: [
      {
        text: 'The vast distance between reality and our ideals brings immense pain. Unless we reconsider, we may drown, like Jia Lian, in the damp shadows of our own fantasies.'
      }
    ]
  }
}

export function directoryExcerpt(id: string, locale: Locale): ExcerptPart[] | undefined {
  return excerpts[id]?.[locale]
}
