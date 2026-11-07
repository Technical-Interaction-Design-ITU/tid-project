import { useNavigate } from "react-router";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchBox from "../components/SearchBox.jsx";

// it is a dialog = Full-screen overlay (above the bottom nav)
export default function AddRecordPage() {
  const navigate = useNavigate();
  const close = () => navigate("/");

  function handleSelect(album) {
    // Later: save the chosen album to the collection.
    console.log("Selected album:", album);
  }

  return (
    <Dialog fullScreen open onClose={close}>
      <div style={{ padding: 24 }}>
        <IconButton aria-label="Close" onClick={close}>
          <CloseRoundedIcon />
        </IconButton>

        <h1>Add record</h1>

        <SearchBox onSelect={handleSelect} />
      </div>
    </Dialog>
  );
}
