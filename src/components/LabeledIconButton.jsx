import Button from "@mui/material/Button";

// Icon with a short text label underneath, e.g. "to crate" or "delete".
// Styling lives in theme/components.js (MuiButton -> variant "labeledIcon").
//
// ariaLabel: name for screen readers, e.g. "Add to crate: Abbey Road".
//   Start it with the visible label, so voice control ("click add to crate") still works.
export default function LabeledIconButton({
  icon,
  label,
  ariaLabel,
  color = "secondary",
  ...props
}) {
  return (
    <Button
      variant="labeledIcon"
      color={color}
      aria-label={ariaLabel}
      {...props}
    >
      {icon}
      {label}
    </Button>
  );
}
