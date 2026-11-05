import { createTheme } from "@mui/material/styles";

// Palette from the design picture. Teal is mapped to `info` (MUI has no third brand slot).
export default createTheme({
  palette: {
    mode: "dark",
    secondary: {
      light: "#EBF2A3",
      main: "#BFC765",
      dark: "#767E1C",
      contrastText: "#1C1C19",
    },
    primary: {
      light: "#698E9A",
      main: "#EBF2A3",
      dark: "#144150",
      contrastText: "#1D1B19",
    },
    info: {
      light: "#CB9A67",
      main: "#FBE7D3",
      dark: "#81501C",
    },
    background: { default: "#101112", paper: "#1C1C19" },
    text: { primary: "#FBE7D3", secondary: "#A4A4A3" },
  },
});
