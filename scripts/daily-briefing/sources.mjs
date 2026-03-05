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
  const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  const results = []
  for (const sub of SUBREDDITS) {
    try {
      // Use old.reddit.com — more lenient with datacenter IPs
      const res = await fetch(`https://old.reddit.com/r/${sub}/hot.json?limit=10`, {
        headers: {
          'User-Agent': UA,
          'Accept': 'application/json',
        }
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
      await new Promise(r => setTimeout(r, 500))
    } catch (e) {
      console.warn(`Reddit /r/${sub} failed:`, e.message)
    }
  }
  return results
}
