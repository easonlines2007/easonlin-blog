import { readFile, rename, writeFile } from 'node:fs/promises'
import { fetchGitHubData, sameGitHubData } from './github-data.mjs'

const target = new URL('../src/data/github.json', import.meta.url)
const previous = JSON.parse(await readFile(target, 'utf8'))
const data = await fetchGitHubData(previous.username)
if (sameGitHubData(previous, data)) {
  console.log('Public GitHub data is unchanged; no commit or deployment needed.')
} else {
  // Fetch and validate everything before replacing the working snapshot.
  const temporary = new URL(`${target.href}.tmp`)
  await writeFile(temporary, `${JSON.stringify(data, null, 2)}\n`)
  await rename(temporary, target)
  console.log(
    `Updated ${data.days.length} contribution days and ${data.repositories.length} public repositories.`
  )
}
