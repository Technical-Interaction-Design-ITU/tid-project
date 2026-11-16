import { createTheme } from "@mui/material/styles";

// Crates theme: palette (colours), typography (fonts), shape and component defaults.
// Teal = primary, lime = secondary. Letterboxd-inspired: dark, calm surfaces, rounded, bold headings.
const headingFont = '"Archivo", "Helvetica", "Arial", sans-serif';
const bodyFont = '"Figtree", "Helvetica", "Arial", sans-serif';

export default createTheme({
  palette: {
    mode: "dark",
    primary: {
      light: "#92C4CF",
      main: "#52A0B2",
      dark: "#144150",
      contrastText: "#1D1B19",
    },
    secondary: {
      light: "#EBF2A3",
      main: "#BFC765",
      dark: "#767E1C",
      contrastText: "#1C1C19",
    },
    info: {
      light: "#CB9A67",
      main: "#FBE7D3",
      dark: "#81501C",
    },
    background: { default: "#101112", paper: "#1E2A2E" },
    text: { primary: "#ffffff", secondary: "#A4A4A3" },
  },

  typography: {
    fontFamily: bodyFont,
    h1: {
      fontFamily: headingFont,
      fontWeight: 800,
      fontSize: "2rem",
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: headingFont,
      fontWeight: 800,
      fontSize: "1.5rem",
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: headingFont,
      fontWeight: 800,
      fontSize: "1.25rem",
      letterSpacing: "-0.01em",
    },
    subtitle1: { fontWeight: 600, lineHeight: 1.3 },
    button: { textTransform: "none", fontWeight: 600 },
  },

  // Rounded corners everywhere (1 unit = 12px in `sx`, e.g. borderRadius: 1).
  shape: { borderRadius: 12 },

  components: {
    // No ripple, and a clear outline when you tab to something (not colour-only).
    MuiButtonBase: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-focusVisible": {
            outline: `3px solid ${theme.palette.text.primary}`,
            outlineOffset: 2,
          },
        }),
      },
    },

    // Buttons: filled by default, at least 44px tall (touch targets).
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: { minHeight: 44, minWidth: 44, paddingInline: 20 },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { minHeight: 44, minWidth: 44 } },
    },

    // Text fields: full width, always a visible label, readable border.
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.paper,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.secondary,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
          },
        }),
      },
    },

    // Surfaces: no lighter "elevation" overlay in dark mode, thin outline instead.
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
    MuiCard: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
        }),
      },
    },

    // Bottom navigation
    MuiBottomNavigation: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: 64,
          backgroundColor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }),
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: ({ theme }) => ({
          minWidth: 64,
          color: theme.palette.text.secondary,
          "&.Mui-selected": { color: theme.palette.primary.main },
        }),
        label: { fontWeight: 600 },
      },
    },
  },
});
