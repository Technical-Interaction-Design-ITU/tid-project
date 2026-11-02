// Discogs album search. Query = album and/or artist; most popular (community "have") first.
// Usage: import { searchAlbums } from './fetch-discogs.mjs'   or   node scripts/fetch-discogs.mjs "pink floyd"
// Optional DISCOGS_TOKEN=... raises the limit from 25 to 60 req/min. Node only (keep the token server-side).
const TOKEN = process.env.DISCOGS_TOKEN
const headers = { 'User-Agent': 'tid-project/1.0', ...(TOKEN && { Authorization: `Discogs token=${TOKEN}` }) }

// Never sleeps: a search must answer fast, so a 429 is thrown and the caller decides (retry / local results).
async function get(path, params, signal) {
  const res = await fetch(`https://api.discogs.com${path}?${new URLSearchParams(params)}`, { headers, signal })
  if (!res.ok) throw Object.assign(new Error(`Discogs ${res.status} ${path}`), { status: res.status })
  return res.json()
}

// Discogs names are messy: "The Pink Floyd*", "Artist (25)".
const clean = s => s.replace(/\s\(\d+\)/g, '').replace(/\*$/, '').trim()

const words = s => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) ?? []

export async function searchAlbums(query, { signal, limit = 20 } = {}) {
  query = query.trim()
  if (query.length < 2) return []
  // masters = one entry per album instead of 50 pressings
  const { results } = await get('/database/search', { q: query, type: 'master', per_page: 100 }, signal)
  return results
    .map(r => {
      const [artist, ...title] = r.title.split(' - ') // Discogs titles are "Artist - Album"
      return {
        id: r.id,
        artist: clean(artist),
        title: title.join(' - ') || artist,
        year: Number(r.year) || null,
        cover: r.cover_image || r.thumb || null,
        have: r.community?.have ?? 0,
        want: r.community?.want ?? 0,
        url: `https://www.discogs.com${r.uri}`,
      }
    })
    // q is full-text (tracklists, notes), so drop hits where the query isn't in "artist title" (word prefixes, accent-insensitive)
    .filter(a => words(query).every(w => words(`${a.artist} ${a.title}`).some(t => t.startsWith(w))))
    // ponytail: only ranks Discogs' top 100 relevance hits, Discogs can't sort by popularity. Page further if albums go missing.
    .sort((a, b) => b.have - a.have)
    .slice(0, limit)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const a of await searchAlbums(process.argv.slice(2).join(' '))) console.log(`${a.have}\t${a.artist} - ${a.title} (${a.year})`)
}
