import { writeFile } from 'node:fs/promises'

const username = 'easonlines2007'
async function get(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'Eason-Notes' },
    signal: AbortSignal.timeout(30000)
  })
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`)
  return response
}
// Only anonymous public endpoints are used. No token or private repository data is needed.
const repos = await (
  await get(`https://api.github.com/users/${username}/repos?type=owner&sort=updated&per_page=100`)
).json()
const html = await (await get(`https://github.com/users/${username}/contributions`)).text()
const counts = new Map(
  [...html.matchAll(/<tool-tip\b[^>]*for="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/g)].map(
    ([, id, text]) => [id, Number(text.match(/^(\d+) contribution/)?.[1] ?? 0)]
  )
)
const days = [
  ...html.matchAll(
    /<td\b[^>]*data-date="(\d{4}-\d{2}-\d{2})"[^>]*id="([^"]+)"[^>]*data-level="([0-4])"[^>]*>/g
  )
]
  .map(([, date, id, level]) => ({ date, level: Number(level), count: counts.get(id) ?? 0 }))
  .sort((a, b) => a.date.localeCompare(b.date))
if (days.length < 350 || counts.size < 350 || !Array.isArray(repos))
  throw new Error('Unexpected public GitHub response; snapshot was not changed.')
const data = {
  username,
  updatedAt: new Date().toISOString(),
  total: days.reduce((sum, day) => sum + day.count, 0),
  days,
  repositories: repos
    .filter((repo) => !repo.private && !repo.archived)
    .map((repo) => ({
      name: repo.name,
      description: repo.description || '',
      url: repo.html_url,
      language: repo.language,
      stars: repo.stargazers_count,
      fork: repo.fork
    }))
}
await writeFile(
  new URL('../src/data/github.json', import.meta.url),
  `${JSON.stringify(data, null, 2)}\n`
)
console.log(
  `Updated ${days.length} contribution days and ${data.repositories.length} public repositories.`
)
