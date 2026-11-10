import { createTheme } from "@mui/material/styles";

// Crates theme: palette (colours) and typography (fonts). Teal = primary, lime = secondary.
const headingFont = '"Archivo", "Helvetica", "Arial", sans-serif';

export default createTheme({
  disableRipple: true,
  palette: {
    mode: "dark",
    secondary: {
      light: "#EBF2A3",
      main: "#BFC765",
      dark: "#767E1C",
      contrastText: "#1C1C19",
    },
    primary: {
      light: "#92C4CF",
      main: "#52A0B2",
      dark: "#144150",
      contrastText: "#1D1B19",
    },
    info: {
      light: "#CB9A67",
      main: "#FBE7D3",
      dark: "#81501C",
    },
    background: { default: "#101112", paper: "#1E2A2E" },
    text: { primary: "#FBE7D3", secondary: "#A4A4A3" },
  },
  typography: {
    // Body text: Figtree. Headings: heavy, tight Archivo (Letterboxd-inspired).
    fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
    h1: { fontFamily: headingFont, fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontFamily: headingFont, fontWeight: 800, letterSpacing: "-0.02em" },
    h3: { fontFamily: headingFont, fontWeight: 800, letterSpacing: "-0.01em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
});
