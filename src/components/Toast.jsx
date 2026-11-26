import { useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

// The toast is lifted by the height of the BottomNav
// (see MuiBottomNavigation in theme/components.js)
// so does not cover it.
const BOTTOM_NAV_HEIGHT = 64;

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
      // MUI's default gap is 8px (phone) / 24px (sm and up); add the nav height on top
      sx={{
        bottom: {
          xs: BOTTOM_NAV_HEIGHT + 8,
          sm: BOTTOM_NAV_HEIGHT + 24,
        },
      }}
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
