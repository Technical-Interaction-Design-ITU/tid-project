import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Record from "./Record.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import {
  getRecordsInList,
  getCratesForRecord,
} from "../services/recordListServices.js";

// Turn a Parse Record object into the shape the Record component expects
function toRecordProps(record) {
  return {
    id: record.id,
    albumtitle: record.get("title"),
    artist: record.get("artist_name"),
    year: record.get("year"),
    cover: record.get("cover"),
    cover_url: record.get("cover_url"), // Fallback URL from Discogs
  };
}

// Shows all records stored in the list with the given listId (via Stored_in)
// onAddToCollection(id, record): moves a record out of this list 
// onAddToCrate: adds a record to a crate as well (it stays in this list)
// onDelete(id, record): deletes a record from all lists, after ConfirmDialog
// onRemove(id, record): removes a record from this list only, no confirmation
function RecordList({ listId, onAddToCollection, onAddToCrate, onDelete, onRemove }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  // record for the delete ConfirmDialog. Kept after closing, so the title
  // doesn't flash "undefined" during the fade-out; deleteOpen opens/closes it.
  const [recordToDelete, setRecordToDelete] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  function askDelete(id) {
    setRecordToDelete(findRecord(id));
    setDeleteOpen(true);
  }

  const findRecord = (id) => records.find((r) => r.id === id);
  const removeFromScreen = (id) =>
    setRecords((prev) => prev.filter((r) => r.id !== id));

  // run an action that takes the record out of this list (onAddToCollection / onRemove),
  // then remove it from the screen. The record is passed along, so the parent
  // can use the album title in a confirmation toast.
  async function runAndRemove(action, id) {
    setActionError(null);
    try {
      await action(id, findRecord(id));
      removeFromScreen(id);
    } catch (err) {
      setActionError(err.message);
    }
  }

  // called by ConfirmDialog; errors are shown in the dialog
  async function confirmDelete() {
    await onDelete(recordToDelete.id, recordToDelete);
    removeFromScreen(recordToDelete.id);
    setDeleteOpen(false);
  }

  // dialog text: warn if the record is also in crates, since they lose it too
  function deleteMessage(crates) {
    if (!crates?.length) return "This can't be undone.";
    const names = crates.map((c) => `"${c.get("list_name")}"`).join(", ");
    const word = crates.length === 1 ? "crate" : "crates";
    return `This can't be undone. Deleting this also deletes the record from your ${word} ${names}.`;
  }

  useEffect(() => {
    if (!listId) return;
    let cancelled = false; // ignore old results if listId changes mid-fetch

    setLoading(true);
    setError(null);
    getRecordsInList(listId)
      .then((result) => {
        if (!cancelled) setRecords(result.map(toRecordProps));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listId]);

  // Error handeling
  if (!listId)
    return (
      <Typography color="text.secondary">No records in this list yet.</Typography>
    );
  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress aria-label="Loading records" />
      </Box>
    );
  if (error)
    return <Alert severity="error">Could not load records: {error}</Alert>;
  if (records.length === 0)
    return (
      <Typography color="text.secondary">No records in this list yet.</Typography>
    );

  return (
    <>
      {actionError && <Alert severity="error">{actionError}</Alert>}
      <Box
        component="ul"
        sx={{
          listStyle: "none",
          m: 0,
          p: 0,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {records.map((elem) => (
          <Record
            key={elem.id}
            record={elem}
            onAddToCollection={
              onAddToCollection
                ? (id) => runAndRemove(onAddToCollection, id)
                : undefined
            }
            onAddToCrate={onAddToCrate}
            onDelete={onDelete ? askDelete : undefined}
            onRemove={onRemove ? (id) => runAndRemove(onRemove, id) : undefined}
          />
        ))}
      </Box>
      {onDelete && (
        <ConfirmDialog
          openKey={deleteOpen ? recordToDelete.id : null}
          title={`Delete "${recordToDelete?.albumtitle}"?`}
          load={() => getCratesForRecord(recordToDelete.id)}
          message={deleteMessage}
          onCancel={() => setDeleteOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default RecordList;
