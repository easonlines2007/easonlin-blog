const attributes = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map(([, key, double, single]) => [
      key,
      double ?? single
    ])
  )

export function parseContributions(html) {
  const counts = new Map()
  for (const [, tag, body] of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attributes(tag).for
    const text = body
      .replace(/<[^>]+>/g, '')
      .replace(/&nbsp;/g, ' ')
      .trim()
    const count = /^No contributions\b/.test(text)
      ? 0
      : Number(text.match(/^([\d,]+) contributions?\b/)?.[1].replaceAll(',', '') ?? NaN)
    if (id && Number.isSafeInteger(count) && count >= 0) counts.set(id, count)
  }
  const days = [...html.matchAll(/<td\b([^>]*)>/g)]
    .map(([, tag]) => attributes(tag))
    .filter((attrs) => attrs['data-date'])
    .map((attrs) => {
      const date = attrs['data-date']
      const level = Number(attrs['data-level'])
      const count = counts.get(attrs.id)
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        !Number.isInteger(level) ||
        level < 0 ||
        level > 4 ||
        count === undefined
      )
        throw new Error('Unexpected contribution day; previous snapshot is preserved.')
      return { date, level, count }
    })
    .sort((a, b) => a.date.localeCompare(b.date))
  if (days.length < 350 || days.length > 371) throw new Error('Incomplete contribution calendar.')
  for (let i = 0; i < days.length; i++) {
    const timestamp = Date.parse(`${days[i].date}T00:00:00Z`)
    if (
      !Number.isFinite(timestamp) ||
      new Date(timestamp).toISOString().slice(0, 10) !== days[i].date ||
      (i > 0 && timestamp - Date.parse(`${days[i - 1].date}T00:00:00Z`) !== 86400000)
    )
      throw new Error('Contribution dates are invalid, duplicated or incomplete.')
  }
  return days
}

export function normalizeRepositories(repos, username) {
  if (!Array.isArray(repos)) throw new Error('Unexpected repository response.')
  return repos
    .filter((repo) => {
      if (!repo || typeof repo.private !== 'boolean' || typeof repo.archived !== 'boolean')
        throw new Error('Repository visibility is missing; previous snapshot is preserved.')
      return !repo.private && !repo.archived
    })
    .map((repo) => {
      if (
        typeof repo.name !== 'string' ||
        !repo.name ||
        typeof repo.fork !== 'boolean' ||
        typeof repo.html_url !== 'string' ||
        repo.html_url.toLowerCase() !==
          `https://github.com/${username}/${repo.name}`.toLowerCase() ||
        (repo.description !== null && typeof repo.description !== 'string') ||
        (repo.language !== null && typeof repo.language !== 'string') ||
        !Number.isSafeInteger(repo.stargazers_count) ||
        repo.stargazers_count < 0
      )
        throw new Error('Unexpected public repository metadata.')
      return {
        name: repo.name,
        description: repo.description || '',
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        fork: repo.fork
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
}

export function sameGitHubData(previous, next) {
  const { updatedAt: previousTime, ...previousData } = previous
  const { updatedAt: nextTime, ...nextData } = next
  return JSON.stringify(previousData) === JSON.stringify(nextData)
}

async function get(url) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Eason-Notes', 'Accept-Language': 'en-US' },
        signal: AbortSignal.timeout(30000)
      })
      if (response.ok) return response
      if (response.status !== 429 && response.status < 500)
        throw new Error(`GitHub responded ${response.status}; previous snapshot is preserved.`)
      if (attempt === 2) throw new Error(`GitHub responded ${response.status}.`)
    } catch (error) {
      if (attempt === 2 || (error instanceof Error && error.message.includes('previous snapshot')))
        throw error
    }
    await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 1000))
  }
  throw new Error('GitHub could not be reached.')
}

export async function fetchGitHubData(username) {
  const repos = []
  // Public, anonymous endpoint with pagination; private repositories are never fetched.
  for (let page = 1; page <= 100; page++) {
    const batch = await (
      await get(
        `https://api.github.com/users/${username}/repos?type=owner&per_page=100&page=${page}`
      )
    ).json()
    if (!Array.isArray(batch)) throw new Error('Unexpected repository response.')
    repos.push(...batch)
    if (batch.length < 100) break
    if (page === 100) throw new Error('Repository pagination exceeded its safety limit.')
  }
  const repositories = normalizeRepositories(repos, username)
  const days = parseContributions(
    await (await get(`https://github.com/users/${username}/contributions`)).text()
  )
  return {
    username,
    updatedAt: new Date().toISOString(),
    total: days.reduce((sum, day) => sum + day.count, 0),
    days,
    repositories
  }
}
