import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import HomeView from "../components/HomeView.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useToast } from "../hooks/useToast.js";
import {
  getCrates,
  countRecordsInList,
  deleteCrate,
} from "../services/recordListServices.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// The overview at "/": links to the collection and wantlist, and the user's crates.
// The lists themselves are separate pages (ListPage, CratePage).
function HomePage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [crates, setCrates] = useState([]);
  // crate for the delete ConfirmDialog. Kept after closing, so the title
  // doesn't flash "undefined" during the fade-out; crateDeleteOpen opens/closes it.
  const [crateToDelete, setCrateToDelete] = useState(null);
  const [crateDeleteOpen, setCrateDeleteOpen] = useState(false);

  // load the user's crates (runs again each time we come back to this page)
  useEffect(() => {
    getCrates()
      .then(setCrates)
      .catch((err) => console.error(err));
  }, []);

  // open the delete ConfirmDialog for a crate (from its ⋮ menu)
  function askDeleteCrate(crate) {
    setCrateToDelete(crate);
    setCrateDeleteOpen(true);
  }

  // dialog text, gets the record count from countRecordsInList
  function deleteCrateMessage(count) {
    if (count === 0) return "This can't be undone. The crate is empty.";
    const records = count === 1 ? "record" : "records";
    const stay = count === 1 ? "stays" : "stay";
    return `This can't be undone. The ${count} ${records} in it ${stay} in your collection.`;
  }

  // called by ConfirmDialog; errors are shown in the dialog
  async function confirmDeleteCrate() {
    await deleteCrate(crateToDelete.get("list_id"));
    setCrates((prev) => prev.filter((c) => c.id !== crateToDelete.id));
    setCrateDeleteOpen(false);
    showToast(`Deleted crate "${crateToDelete.get("list_name")}"`);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h1">Home</Typography>
      <HomeView
        crates={crates}
        onOpenCollection={() => navigate("/collection")}
        onOpenWantlist={() => navigate("/wantlist")}
        onOpenCrate={(crate) => navigate(`/crates/${crate.get("list_id")}`)}
        onNewCrate={() => navigate("/new-crate")}
        onDeleteCrate={askDeleteCrate}
      />
      <ConfirmDialog
        openKey={crateDeleteOpen ? crateToDelete.id : null}
        title={`Delete crate "${crateToDelete?.get("list_name")}"?`}
        load={() => countRecordsInList(crateToDelete.get("list_id"))}
        message={deleteCrateMessage}
        onCancel={() => setCrateDeleteOpen(false)}
        onConfirm={confirmDeleteCrate}
      />
    </Stack>
  );
}

export default HomePage;
