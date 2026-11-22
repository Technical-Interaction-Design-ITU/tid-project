import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import RecordList from "../components/RecordList";
import HomeView from "../components/HomeView.jsx";
import BackButton from "../components/BackButton.jsx";
import { useToast } from "../hooks/useToast.js";
import AddToCrateDialog from "./AddToCrateDialog.jsx";
import {
  getCrates,
  getCollection,
  getWantList,
  moveToRecordList,
  deleteRecordFromLists,
  removeFromRecordList,
} from "../services/recordListServices.js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// This page can render three different views:
const titles = {
  home: "Home",
  collection: "My Collection",
  wantlist: "My Wantlist",
};

function HomePage() {
  const navigate = useNavigate();
  const showToast = useToast();
  const [view, setView] = useState("home");
  const [crates, setCrates] = useState([]);
  const [selectedCrate, setSelectedCrate] = useState(null);
  const [collection, setCollection] = useState(null);
  const [wantList, setWantList] = useState(null);
  const [listError, setListError] = useState(null);
  const [recordForCrate, setRecordForCrate] = useState(null); // record id while AddToCrateDialog is open

  // load the user's collection and wantList once
  useEffect(() => {
    Promise.all([getCollection(), getWantList()])
      .then(([c, w]) => {
        setCollection(c);
        setWantList(w);
      })
      .catch((err) => setListError(err.message));
  }, []);

  // the list shown in the collection / wantlist views
  const currentList = view === "wantlist" ? wantList : collection;

  // load the user's crates (again) whenever we are back on the home view
  useEffect(() => {
    if (view !== "home") return;
    getCrates()
      .then(setCrates)
      .catch((err) => console.error(err));
  }, [view]);

  function openCrate(crate) {
    setSelectedCrate(crate);
    setView("crate");
  }

  // open AddToCrateDialog for a record in the collection
  function openAddToCrate(id) {
    setRecordForCrate(id);
  }

  // move a record from the wantList to the collection
  // (RecordList removes it from the screen once this resolves)
  async function handleAddToCollection(id, record) {
    await moveToRecordList(
      id,
      wantList.get("list_id"),
      collection.get("list_id"),
    );
    showToast(`Moved "${record.albumtitle}" to your collection`);
  }

  // delete a record from the collection / wantList AND all crates
  // (asked for confirmation in ConfirmDeleteDialog; the Record row itself is kept)
  async function handleDelete(id, record) {
    const deletedLinks = await deleteRecordFromLists(id);
    const listName = view === "wantlist" ? "wantlist" : "collection";
    const crateCount = deletedLinks.length - 1; // all links except the collection/wantList one
    const fromCrates =
      crateCount > 0
        ? ` and ${crateCount} ${crateCount === 1 ? "crate" : "crates"}`
        : "";
    showToast(`Deleted "${record.albumtitle}" from your ${listName}${fromCrates}`);
  }

  // remove a record from the current crate only (stays in the collection)
  async function handleRemove(id, record) {
    await removeFromRecordList(id, selectedCrate.get("list_id"));
    showToast(
      `Removed "${record.albumtitle}" from "${selectedCrate.get("list_name")}"`,
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h1">
        {view === "crate" ? selectedCrate.get("list_name") : titles[view]}
      </Typography>
      {view === "home" ? (
        <HomeView
          crates={crates}
          onOpenCollection={() => setView("collection")}
          onOpenWantlist={() => setView("wantlist")}
          onOpenCrate={openCrate}
          onNewCrate={() => navigate("/new-crate")}
        />
      ) : view === "crate" ? (
        <>
          <BackButton onClick={() => setView("home")} />
          <RecordList
            listId={selectedCrate.get("list_id")}
            onRemove={handleRemove}
          />
        </>
      ) : (
        <>
          <BackButton onClick={() => setView("home")} />
          {listError ? (
            <Alert severity="error">Could not load list: {listError}</Alert>
          ) : !currentList ? (
            <Typography color="text.secondary">Loading records...</Typography>
          ) : (
            <RecordList
              listId={currentList.get("list_id")}
              onAddToCollection={
                view === "wantlist" ? handleAddToCollection : undefined
              }
              onAddToCrate={view === "collection" ? openAddToCrate : undefined}
              onDelete={handleDelete}
            />
          )}
          <AddToCrateDialog
            recordId={recordForCrate}
            onClose={() => setRecordForCrate(null)}
            onAdded={(crate) => {
              showToast(`Added to "${crate.get("list_name")}"`);
              setRecordForCrate(null);
            }}
          />
        </>
      )}
    </Stack>
  );
}

export default HomePage;
