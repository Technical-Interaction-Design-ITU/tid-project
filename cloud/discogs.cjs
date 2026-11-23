// Discogs album search + cover lookup. Runs in Parse Cloud Code (Back4App) so DISCOGS_TOKEN stays server-side.
// CommonJS (.cjs) so Back4App can require() it; scripts/*.mjs import it too for the CLI.

const UA = "tid-project/1.0";

async function get(path, params, signal) {
  const token = process.env.DISCOGS_TOKEN;
  const res = await fetch(
    `https://api.discogs.com${path}?${new URLSearchParams(params)}`,
    {
      headers: {
        "User-Agent": UA,
        ...(token && { Authorization: `Discogs token=${token}` }),
      },
      signal,
    },
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

// Query = album and/or artist; most popular "have" first.
async function searchAlbums(query, { signal, limit = 20 } = {}) {
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

// Cover art for one album: MusicBrainz + Cover Art Archive scan, fallback=Discogs.
// album = a searchAlbums() result ({ id, cover }). Returns an image URL or null. Never throws: a miss just falls back.
async function getCover({ id, cover }, { signal, size = 500 } = {}) {
  const headers = { "User-Agent": UA, Accept: "application/json" };
  try {
    // MusicBrainz stores Discogs master links as url relations, so this matches by id instead of guessing from the title
    const resource = `https://www.discogs.com/master/${id}`;
    const mb = await fetch(
      `https://musicbrainz.org/ws/2/url?${new URLSearchParams({ resource, inc: "release-group-rels", fmt: "json" })}`,
      { headers, signal },
    );
    if (mb.ok) {
      const mbid = (await mb.json()).relations?.find((r) => r.release_group)
        ?.release_group.id;
      if (mbid) {
        const url = `https://coverartarchive.org/release-group/${mbid}/front-${size}`;
        if ((await fetch(url, { method: "HEAD", headers, signal })).ok)
          return url; // 404 = no art uploaded
      }
    }
  } catch (e) {
    if (e.name === "AbortError") throw e;
  }
  return cover ?? null;
}

module.exports = { searchAlbums, getCover };
