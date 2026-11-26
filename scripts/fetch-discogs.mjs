// CLI for the Discogs album search in cloud/discogs.cjs.
// Usage: npm run search -- <query>
import discogs from "../cloud/discogs.cjs";

for (const a of await discogs.searchAlbums(process.argv.slice(2).join(" ")))
  console.log(`${a.have}\t${a.artist} - ${a.title} (${a.year})`);
