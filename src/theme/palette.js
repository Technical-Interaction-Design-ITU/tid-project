// Colours of the theme (dark mode). Colours come from the design picture.
// primary = teal, secondary = lime, info = warm cream/orange accents,
// background = page and surface colours, text = text colours.
// MUI builds hover/disabled shades from these values, so keep contrastText readable on `main`.
export default {
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

  // Alert / Toast severity colours
  // I left out light and dark, Mui apparently auto generates these based on main.
  success: {
    main: "#52A0B2",
    contrastText: "#ffffff",
  },
  error: {
    main: "#FBE7D3",
    contrastText: "#1D1B19",
  },
  warning: {
    main: "#FBE7D3",
    contrastText: "#1D1B19",
  },

  background: {
    default: "#101112",
    paper: "#1E2A2E",
  },
  text: {
    primary: "#ffffff",
    secondary: "#A4A4A3",
  },
};
