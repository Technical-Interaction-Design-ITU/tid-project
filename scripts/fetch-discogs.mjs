// Discogs album search. Query = album and/or artist; most popular "have" first.
// Usage: import { searchAlbums } from './fetch-discogs.mjs' or npm run search -- <query>
const TOKEN = process.env.DISCOGS_TOKEN;
const headers = {
  "User-Agent": "tid-project/1.0",
  ...(TOKEN && { Authorization: `Discogs token=${TOKEN}` }),
};

async function get(path, params, signal) {
  const res = await fetch(
    `https://api.discogs.com${path}?${new URLSearchParams(params)}`,
    { headers, signal },
  );
  if (!res.ok)
    throw Object.assign(new Error(`Discogs ${res.status} ${path}`), {
      status: res.status,
    });
  return res.json();
}

// drops discogs weirdness "Artist (25)", "Artist*"
const clean = (s) =>
  s
    .replace(/\s\(\d+\)/g, "")
    .replace(/\*$/, "")
    .trim();

const words = (s) =>
  s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .match(/[\p{L}\p{N}]+/gu) ?? [];

export async function searchAlbums(query, { signal, limit = 20 } = {}) {
  query = query.trim();
  if (query.length < 2) return [];
  // master = one entry per album
  const { results } = await get(
    "/database/search",
    { q: query, type: "master", per_page: 100 },
    signal,
  );
  return (
    results
      .map((r) => {
        const [artist, ...title] = r.title.split(" - "); // Discogs titles are "Artist - Album"
        return {
          id: r.id,
          artist: clean(artist),
          title: title.join(" - ") || artist,
          year: r.year || null,
          thumb: r.thumb || null, // small: use in the dropdown
          cover: r.cover_image || r.thumb || null, // large: fallback in getCover()
          have: r.community?.have ?? 0,
          want: r.community?.want ?? 0,
          url: `https://www.discogs.com${r.uri}`,
        };
      })
      // query must be artist name or title
      .filter((a) =>
        words(query).every((w) =>
          words(`${a.artist} ${a.title}`).some((t) => t.startsWith(w)),
        ),
      )
      .sort((a, b) => b.have - a.have)
      .slice(0, limit)
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const a of await searchAlbums(process.argv.slice(2).join(" ")))
    console.log(`${a.have}\t${a.artist} - ${a.title} (${a.year})`);
}
