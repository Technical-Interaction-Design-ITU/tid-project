import Button from "@mui/material/Button";

// The main action on a screen ("Create crate", "Search").
// Styling lives in theme/components.js (MuiButton -> contained + large variant).
export default function PrimaryButton({ children, ...props }) {
  return (
    <Button variant="contained" size="large" {...props}>
      {children}
    </Button>
  );
}
