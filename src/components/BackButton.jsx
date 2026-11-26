import { useLocation, useNavigate } from "react-router";
import IconButton from "@mui/material/IconButton";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

// Small arrow that returns to the previous page (usually Home).
// Goes back in history like the browser/phone back button does. If the page was
// opened directly (refresh, pasted link) there is no history in the app, so it
// goes to "/" instead of leaving the app.
export default function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  function goBack() {
    if (location.key === "default") navigate("/", { replace: true });
    else navigate(-1);
  }

  return (
    <IconButton
      aria-label="Back"
      onClick={goBack}
      sx={{ alignSelf: "flex-start" }}
    >
      <ArrowBackRoundedIcon />
    </IconButton>
  );
}
