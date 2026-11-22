import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// Reusable confirmation toast:
// an Alert shown inside a Snackbar (both are mui components).
export default function Toast({
  open,
  message,
  onClose,
  severity = "success",
}) {
  // Keep showing the last message while the Snackbar animates out.
  // Otherwise the parent's setMessage(null) empties the Alert before the fade-out ends.
  const [shownMessage, setShownMessage] = useState(message);
  if (message && message !== shownMessage) setShownMessage(message);

  const handleClose = (_event, reason) => {
    // Don't close when the user clicks somewhere else on the page
    if (reason === "clickaway") return;
    onClose?.();
  };

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      autoHideDuration={3000}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      {/* Passing onClose to Alert gives it a close (X) button */}
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: "100%",
          // vertically center icon, message and close button
          alignItems: "center",
          "& .MuiAlert-action": { pt: 0, alignItems: "center" },
          // lime check icon on success toasts
          ...(severity === "success" && {
            "& .MuiAlert-icon": { color: "secondary.light" },
          }),
        }}
      >
        {shownMessage}
      </Alert>
    </Snackbar>
  );
}
