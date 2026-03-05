const HN_API = 'https://hacker-news.firebaseio.com/v0'

export async function fetchHackerNews() {
  const res = await fetch(`${HN_API}/topstories.json`)
  const ids = await res.json()
  const top30 = ids.slice(0, 30)

  const items = await Promise.allSettled(
    top30.map(id =>
      fetch(`${HN_API}/item/${id}.json`).then(r => r.json())
    )
  )

  return items
    .filter(r => r.status === 'fulfilled' && r.value?.type === 'story')
    .map(r => ({
      title: r.value.title,
      url: r.value.url || `https://news.ycombinator.com/item?id=${r.value.id}`,
      score: r.value.score,
      comments: r.value.descendants || 0,
    }))
}

const SUBREDDITS = ['technology', 'artificial', 'MachineLearning', 'wallstreetbets', 'stocks']

export async function fetchReddit() {
  const results = []
  for (const sub of SUBREDDITS) {
    try {
      const res = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=10`, {
        headers: { 'User-Agent': 'KanceDailyBriefing/1.0' }
      })
      if (!res.ok) { console.warn(`Reddit /r/${sub}: ${res.status}`); continue }
      const data = await res.json()
      const posts = data.data.children
        .filter(c => !c.data.stickied)
        .map(c => ({
          title: c.data.title,
          url: c.data.url,
          score: c.data.score,
          subreddit: sub,
          comments: c.data.num_comments,
        }))
      results.push(...posts)
      // 200ms delay between subreddits to avoid rate limiting
      await new Promise(r => setTimeout(r, 200))
    } catch (e) {
      console.warn(`Reddit /r/${sub} failed:`, e.message)
    }
  }
  return results
}
