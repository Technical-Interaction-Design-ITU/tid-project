// Theme entry point.
// Combines palette, typography and shape into one MUI theme with createTheme().
// main.jsx passes this to <ThemeProvider>, so every MUI component reads from it.
// To change colours or fonts, edit palette.js or typography.js instead of this file.

import { createTheme } from "@mui/material/styles";
import palette from "./palette.js";
import typography from "./typography.js";
import components from "./components.js";

export default createTheme({
  palette,
  typography,
  // Rounded corners everywhere (1 unit = 12px in `sx`, e.g. borderRadius: 1).
  shape: { borderRadius: 12 },
  components,
});
