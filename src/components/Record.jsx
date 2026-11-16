import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

const COVER = 88; // px

function Record({ record, onAdd }) {
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
      {record.pic ? (
        <Box
          component="img"
          src={record.pic}
          alt={`${record.albumtitle} by ${record.artist}`}
          sx={{ width: COVER, height: COVER, flexShrink: 0, objectFit: "cover", borderRadius: 0.5 }}
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

      {onAdd && (
        <IconButton
          color="secondary"
          aria-label={`Add ${record.albumtitle} to collection`}
          onClick={() => onAdd(record.id)}
        >
          <AddRoundedIcon />
        </IconButton>
      )}
    </Box>
  );
}

export default Record;
