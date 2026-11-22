import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";
import LabeledIconButton from "./LabeledIconButton.jsx";

const COVER = 88; // px

// onDelete: Wantlist / Collection view, deletes from all the user's lists (asks first)
// onRemove: Crate view, removes from this crate only
function Record({ record, onAddToCollection, onAddToCrate, onDelete, onRemove }) {
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

      {/* Action buttons, grouped closer together than the rest of the row */}
      <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
        {/* "add to collection" (handleAddToCollection), only shown in Wantlist view */}
        {onAddToCollection && (
          <LabeledIconButton
            icon={<AddRoundedIcon />}
            label="Add to collection"
            ariaLabel={`Add to collection: ${record.albumtitle}`}
            onClick={() => onAddToCollection(record.id)}
          />
        )}
        {/* "add to crate" (opens AddToCrateDialog), only shown in Collection view */}
        {onAddToCrate && (
          <LabeledIconButton
            icon={<PlaylistAddRoundedIcon />}
            label="Add to crate"
            ariaLabel={`Add to crate: ${record.albumtitle}`}
            onClick={() => onAddToCrate(record.id)}
          />
        )}
        {/* "delete" (opens ConfirmDeleteDialog), shown in Wantlist and Collection view */}
        {onDelete && (
          <LabeledIconButton
            icon={<DeleteRoundedIcon />}
            label="Delete"
            color="error"
            ariaLabel={`Delete: ${record.albumtitle}`}
            onClick={() => onDelete(record.id)}
          />
        )}
        {/* "remove" (from this crate only), shown in Crate view */}
        {onRemove && (
          <LabeledIconButton
            icon={<RemoveCircleOutlineRoundedIcon />}
            label="Remove"
            color="error"
            ariaLabel={`Remove: ${record.albumtitle}`}
            onClick={() => onRemove(record.id)}
          />
        )}
      </Box>
    </Box>
  );
}

export default Record;
