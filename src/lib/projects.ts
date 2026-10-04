import github from '../data/github.json'

export const projects = github.repositories.map((repo) => ({
  ...repo,
  kind: repo.fork ? '学习参考 · Fork' : '个人项目'
}))
export { github }
