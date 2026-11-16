// Default props and style overrides for MUI components (buttons, fields, cards, nav).
// Applies to every instance in the app. Page-specific layout does NOT belong here.
export default {
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

  // App width: one narrow, centred column on every screen size.
  MuiContainer: {
    defaultProps: { maxWidth: "sm" },
  },

  // Bottom navigation
  MuiBottomNavigation: {
    styleOverrides: {
      root: ({ theme }) => ({
        height: 64,
        // Same width as the page container (the `sm` breakpoint), centred.
        maxWidth: theme.breakpoints.values.sm,
        marginInline: "auto",
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
};
