import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Record from "./Record.jsx";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog.jsx";
import { getRecordsInList } from "../services/recordListServices.js";

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
// onDelete(id, record): deletes a record from all lists, after ConfirmDeleteDialog
// onRemove(id, record): removes a record from this list only, no confirmation
function RecordList({ listId, onAddToCollection, onAddToCrate, onDelete, onRemove }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [recordToDelete, setRecordToDelete] = useState(null); // record while ConfirmDeleteDialog is open

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

  // called by ConfirmDeleteDialog; errors are shown in the dialog
  async function confirmDelete() {
    await onDelete(recordToDelete.id, recordToDelete);
    removeFromScreen(recordToDelete.id);
    setRecordToDelete(null);
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
    return <Typography color="text.secondary">Loading records...</Typography>;
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
            onDelete={
              onDelete ? (id) => setRecordToDelete(findRecord(id)) : undefined
            }
            onRemove={onRemove ? (id) => runAndRemove(onRemove, id) : undefined}
          />
        ))}
      </Box>
      {onDelete && (
        <ConfirmDeleteDialog
          record={recordToDelete}
          onCancel={() => setRecordToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}

export default RecordList;
