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

// Lobste.rs — HN-like tech community, datacenter-friendly
export async function fetchLobsters() {
  try {
    const res = await fetch('https://lobste.rs/hottest.json')
    if (!res.ok) { console.warn(`Lobsters: ${res.status}`); return [] }
    const data = await res.json()
    return data.slice(0, 20).map(item => ({
      title: item.title,
      url: item.url || item.short_id_url,
      score: item.score,
      comments: item.comment_count,
      tags: item.tags,
      source: 'Lobsters',
    }))
  } catch (e) { console.warn('Lobsters failed:', e.message); return [] }
}

// Dev.to — developer articles, public API
export async function fetchDevTo() {
  try {
    const res = await fetch('https://dev.to/api/articles?top=1&per_page=15')
    if (!res.ok) { console.warn(`Dev.to: ${res.status}`); return [] }
    const data = await res.json()
    return data.map(item => ({
      title: item.title,
      url: item.url,
      score: item.public_reactions_count,
      comments: item.comments_count,
      tags: item.tag_list,
      source: 'Dev.to',
    }))
  } catch (e) { console.warn('Dev.to failed:', e.message); return [] }
}
