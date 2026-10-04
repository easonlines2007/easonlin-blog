import github from '../data/github.json'

const descriptions: Record<string, string> = {
  'catalan-dictionary': '加泰罗尼亚语、中文与西班牙语之间的随身词典。',
  videobook: '参考视频转图文电子书的实现，整理技术学习材料。',
  'CS61A-Assignments': 'UC Berkeley CS61A 课程作业与要求，作为学习参考。'
}

export const projects = github.repositories.map((repo) => ({
  ...repo,
  description: descriptions[repo.name] ?? repo.description,
  kind: repo.fork ? '学习参考 · Fork' : '个人项目'
}))
export { github }
