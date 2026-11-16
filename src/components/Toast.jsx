import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

// Reusable confirmation snackbar / toast.

// (Mangler styling)

export default function Toast({ open, message, onClose }) {
  const handleClose = (event, reason) => {
    // Don't close when the user clicks somewhere else on the page
    if (reason === "clickaway") return;
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      message={message}
      onClose={handleClose}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={
        <IconButton
          size="small"
          color="inherit"
          aria-label="close"
          onClick={onClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      }
    />
  );
}
