import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";

const COVER = 88; // px

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
    <Box
      component="li"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        p: 1.5,
        bgcolor: "background.paper",
        borderRadius: 1,
        border: 1,
        borderColor: "divider",
      }}
    >
      {coverUrl ? (
        <Box
          component="img"
          src={coverUrl}
          alt={`${record.albumtitle} by ${record.artist}`}
          onError={(e) => {
            console.error("Failed to load cover image:", coverUrl);
            e.target.style.display = "none";
          }}
          sx={{
            width: COVER,
            height: COVER,
            flexShrink: 0,
            objectFit: "cover",
            borderRadius: 0.5,
          }}
        />
      ) : (
        <Box
          aria-hidden="true"
          sx={{
            width: COVER,
            height: COVER,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "background.default",
            borderRadius: 0.5,
            color: "text.secondary",
          }}
        >
          <AlbumRoundedIcon />
        </Box>
      )}

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="subtitle1" noWrap>
          {record.albumtitle}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {record.artist}
          {record.year && ` · ${record.year}`}
        </Typography>
      </Box>

      {/* "add to collection" (handleAddToCollection), only shown in Wantlist view */}
      {onAddToCollection && (
        <IconButton
          color="secondary"
          aria-label={`Add ${record.albumtitle} to collection`}
          onClick={() => onAddToCollection(record.id)}
        >
          <AddRoundedIcon />
        </IconButton>
      )}
      {/* "add to crate" (opens AddToCrateDialog), only shown in Collection view */}
      {onAddToCrate && (
        <IconButton
          color="secondary"
          aria-label={`Add ${record.albumtitle} to a crate`}
          onClick={() => onAddToCrate(record.id)}
        >
          <PlaylistAddRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default Record;
