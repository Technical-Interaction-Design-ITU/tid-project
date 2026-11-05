// Cover art for one album: MusicBrainz + Cover Art Archive scan, fallback=Discogs.
// Usage: import { getCover } from './fetch-cover.mjs' or npm run cover -- <artist - album>
import { searchAlbums } from "./fetch-discogs.mjs";

const headers = { "User-Agent": "tid-project/1.0", Accept: "application/json" };

// album = a searchAlbums() result ({ id, cover }). Returns an image URL or null. Never throws: a miss just falls back.
export async function getCover({ id, cover }, { signal, size = 500 } = {}) {
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

if (import.meta.url === `file://${process.argv[1]}`) {
  const [album] = await searchAlbums(process.argv.slice(2).join(" "));
  console.log(
    `${album.artist} - ${album.title}\n  discogs: ${album.cover}\n  chosen:  ${await getCover(album)}`,
  );
}
