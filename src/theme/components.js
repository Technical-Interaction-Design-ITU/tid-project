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
};
