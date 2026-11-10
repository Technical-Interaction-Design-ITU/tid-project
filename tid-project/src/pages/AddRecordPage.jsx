import { useNavigate } from "react-router";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
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
      <Container maxWidth="sm" sx={{ pt: 2, pb: 4 }}>
        <Stack spacing={3}>
          <IconButton
            aria-label="Close"
            onClick={close}
            sx={{ alignSelf: "flex-start", ml: -1 }}
          >
            <CloseRoundedIcon />
          </IconButton>

          <Typography variant="h1">Add record</Typography>

          <SearchBox onSelect={handleSelect} />
        </Stack>
      </Container>
    </Dialog>
  );
}
