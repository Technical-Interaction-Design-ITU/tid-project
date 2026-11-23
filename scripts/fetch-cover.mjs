// CLI for the cover lookup in cloud/discogs.cjs (MusicBrainz + Cover Art Archive, fallback=Discogs).
// Usage: npm run cover -- <artist - album>
import discogs from "../cloud/discogs.cjs";

const [album] = await discogs.searchAlbums(process.argv.slice(2).join(" "));
console.log(
  `${album.artist} - ${album.title}\n  discogs: ${album.cover}\n  chosen:  ${await discogs.getCover(album)}`,
);
