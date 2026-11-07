import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// Full-screen overlay: sits above the bottom nav (MUI modal z-index).
export default function AddRecord() {
  const navigate = useNavigate();
  const close = () => navigate("/");

  return (
    <Dialog fullScreen open onClose={close}>
      <div style={{ padding: 24 }}>
        <IconButton aria-label="Close" onClick={close}>
          <CloseRoundedIcon />
        </IconButton>
        <h1> add record </h1>
      </div>
    </Dialog>
  );
}
