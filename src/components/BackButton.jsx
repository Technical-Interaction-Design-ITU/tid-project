import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

// Small arrow that returns to the collection overview.
export default function BackButton({ onClick }) {
  return (
    <IconButton
      aria-label="Back"
      onClick={onClick}
      sx={{ alignSelf: "flex-start" }}
    >
      <ArrowBackRoundedIcon />
    </IconButton>
  );
}
