function Record({ record, onAddToCollection, onAddToCrate }) {
  // Try cover first (Parse.File), fall back to cover_url (Discogs URL)
  let coverUrl = null;
  
  if (typeof record.cover === "string") {
    coverUrl = record.cover;
  } else if (record.cover?.url) {
    coverUrl = record.cover.url();
  } else if (record.cover_url) {
    // Fallback to the Discogs URL if cover file isn't set
    coverUrl = record.cover_url;
  }

  return (
    <li>
      {coverUrl ? (
        <img 
          src={coverUrl} 
          alt={`${record.albumtitle} cover`}
          onError={(e) => {
            console.error("Failed to load cover image:", coverUrl);
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="no-cover"></div>
      )}
      <div>
        <strong>{record.albumtitle}</strong>
        <p>{record.artist}</p>
        {record.year && <p>{record.year}</p>}
      </div>
      {/* button "add to collection" (handleAddToCollection), only shown in Wantlist view */}
      {onAddToCollection && (
        <button onClick={() => onAddToCollection(record.id)}>Add to collection</button>
      )}
      {/* button "add to crate" (opens AddToCrateDialog), only shown in Collection view */}
      {onAddToCrate && (
        <button onClick={() => onAddToCrate(record.id)}>Add to crate</button>
      )}
    </li>
  );
}

export default Record;
