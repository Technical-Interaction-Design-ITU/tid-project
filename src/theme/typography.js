// Fonts and text styles of the theme.
// Figtree is the body font; Archivo (weight 800) is used for headings h1-h3.
// The font files are imported in main.jsx (@fontsource); a weight set here only works if its CSS is imported there.

const headingFont = '"Archivo", "Helvetica", "Arial", sans-serif';
const bodyFont = '"Figtree", "Helvetica", "Arial", sans-serif';

export default {
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
};
