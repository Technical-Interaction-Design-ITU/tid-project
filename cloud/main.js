// Parse Cloud Functions for tid-project (CommonJS on Back4App; Parse is a global there)
/* global Parse, require */
const { searchAlbums, getCover } = require("./discogs.cjs");

// Album search. DISCOGS_TOKEN is set in Back4App: Server Settings -> Environment Variables.
// Frontend: Parse.Cloud.run("searchAlbums", { q })
Parse.Cloud.define("searchAlbums", async (request) =>
  searchAlbums(String(request.params.q ?? "")),
);

// Better cover for a search result. Frontend: Parse.Cloud.run("getCover", { id, cover })
Parse.Cloud.define("getCover", async (request) => {
  const { id, cover } = request.params;
  if (!/^\d+$/.test(String(id))) throw new Parse.Error(Parse.Error.INVALID_QUERY, "id must be a Discogs master id");
  return getCover({ id, cover: cover || null });
});

// beforeSave hook: when a Record is saved with a cover URL, fetch and upload the image
Parse.Cloud.beforeSave("Record", async (request) => {
  const record = request.object;
  const coverUrl = record.get("cover");

  // Only process if cover is a string URL (not already a Parse.File)
  if (coverUrl && typeof coverUrl === "string") {
    try {
      console.log("beforeSave: Fetching and uploading image:", coverUrl);

      // Fetch the image from the URL (server-side, no CORS issues!)
      const response = await fetch(coverUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const buffer = await response.arrayBuffer();
      const data = Array.from(new Uint8Array(buffer));

      // Create a Parse.File from the binary data
      const coverFile = new Parse.File("cover.jpg", data);
      await coverFile.save();

      // Replace the URL with the actual Parse.File object
      record.set("cover", coverFile);
      console.log("beforeSave: Image uploaded, Parse.File set on record");
    } catch (error) {
      console.error("beforeSave: Could not fetch and upload image:", error);
      // Don't throw - allow record to save without image
      record.set("cover", null);
    }
  }
});

Parse.Cloud.define()

