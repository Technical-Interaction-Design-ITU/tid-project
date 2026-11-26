import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import RecordList from "../components/RecordList";
import BackButton from "../components/BackButton.jsx";
import { useToast } from "../hooks/useToast.js";
import AddToCrateDialog from "./AddToCrateDialog.jsx";
import {
  getCollection,
  getWantList,
  moveToRecordList,
  deleteRecordFromLists,
} from "../services/recordListServices.js";

const titles = {
  collection: "My Collection",
  wantlist: "My Wantlist",
};

// The collection (/collection) or the wantlist (/wantlist), picked by `kind`.
// collection: records can be added to a crate
// wantlist: records can be moved to the collection
// both: records can be deleted from all lists
export default function ListPage({ kind }) {
  const showToast = useToast();
  // both lists are loaded, because moving a record needs both list ids
  const [collection, setCollection] = useState(null);
  const [wantList, setWantList] = useState(null);
  const [listError, setListError] = useState(null);
  const [recordForCrate, setRecordForCrate] = useState(null); // record id while AddToCrateDialog is open

  useEffect(() => {
    Promise.all([getCollection(), getWantList()])
      .then(([c, w]) => {
        setCollection(c);
        setWantList(w);
      })
      .catch((err) => setListError(err.message));
  }, []);

  const currentList = kind === "wantlist" ? wantList : collection;

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
  // (asked for confirmation in RecordList's ConfirmDialog; the Record row itself is kept)
  async function handleDelete(id, record) {
    const deletedLinks = await deleteRecordFromLists(id);
    const crateCount = deletedLinks.length - 1; // all links except the collection/wantList one
    const fromCrates =
      crateCount > 0
        ? ` and ${crateCount} ${crateCount === 1 ? "crate" : "crates"}`
        : "";
    showToast(`Deleted "${record.albumtitle}" from your ${kind}${fromCrates}`);
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h1">{titles[kind]}</Typography>
      <BackButton />
      {listError ? (
        <Alert severity="error">Could not load list: {listError}</Alert>
      ) : !currentList ? (
        <Typography color="text.secondary">Loading records...</Typography>
      ) : (
        <RecordList
          listId={currentList.get("list_id")}
          onAddToCollection={
            kind === "wantlist" ? handleAddToCollection : undefined
          }
          onAddToCrate={kind === "collection" ? setRecordForCrate : undefined}
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
    </Stack>
  );
}
