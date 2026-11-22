import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { getCratesForRecord } from "../services/recordListServices.js";

// Asks before deleting a record from the collection / wantList.
export default function ConfirmDeleteDialog({ record, onCancel, onConfirm }) {
  const open = record !== null;
  const recordId = record?.id;
  // loaded results remember which record they belong to, so opening the
  // dialog for another record shows "checking" again instead of old crates
  const [loaded, setLoaded] = useState({ recordId: null, crates: null, error: null });
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const current = loaded.recordId === recordId ? loaded : {};
  const crates = current.crates ?? null; // null = still checking
  const error = deleteError ?? current.error ?? null;

  // check which crates the record is in, each time the dialog opens
  useEffect(() => {
    if (!recordId) return;
    let cancelled = false;
    getCratesForRecord(recordId)
      .then((result) => {
        if (!cancelled) setLoaded({ recordId, crates: result, error: null });
      })
      .catch((err) => {
        if (!cancelled) setLoaded({ recordId, crates: null, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [recordId]);

  function close() {
    if (deleting) return;
    setDeleteError(null);
    onCancel();
  }

  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onConfirm();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  }

  const crateNames = crates?.map((c) => `"${c.get("list_name")}"`).join(", ");

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>Delete "{record?.albumtitle}"?</DialogTitle>
      <DialogContent>
        {crates === null && !error && (
          <Typography color="text.secondary">Checking your crates...</Typography>
        )}
        {crates?.length === 0 && (
          <Typography>This can't be undone.</Typography>
        )}
        {crates?.length > 0 && (
          <Typography>
            Deleting this also deletes the record from your{" "}
            {crates.length === 1 ? "crate" : "crates"} {crateNames}.
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={deleting} onClick={close}>
          Keep
        </Button>
        <Button
          color="error"
          disabled={deleting || crates === null}
          onClick={handleDelete}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
