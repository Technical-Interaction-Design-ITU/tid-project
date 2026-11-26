import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";

// Shared "are you sure?" dialog, e.g. for deleting a record or a crate.
//
// openKey:  id of the thing being confirmed, or null when the dialog is closed
// title:    e.g. 'Delete crate "Jazz"?'
// load():   optional, async. Runs each time the dialog opens for a new openKey,
//           e.g. to count records. Confirm is disabled until it has finished.
// message(data): what to show, gets the result of load() (undefined without load)
// onConfirm(): async, does the action. If it throws, the error is shown here.
export default function ConfirmDialog({
  openKey,
  title,
  load,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Keep",
  onCancel,
  onConfirm,
}) {
  const open = openKey != null;
  // loaded results remember which openKey they belong to, so opening the
  // dialog for something else shows "loading" again instead of old data
  const [loaded, setLoaded] = useState({ key: null, data: undefined, error: null });
  const [working, setWorking] = useState(false);
  const [confirmError, setConfirmError] = useState(null);

  // (while closing, keep showing the last data so the fade-out doesn't flicker)
  const current = loaded.key === openKey || !open ? loaded : null;
  const isLoading = Boolean(load) && open && !current;
  const error = confirmError ?? current?.error ?? null;

  useEffect(() => {
    if (openKey == null || !load) return;
    let cancelled = false;
    load()
      .then((data) => {
        if (!cancelled) setLoaded({ key: openKey, data, error: null });
      })
      .catch((err) => {
        if (!cancelled) setLoaded({ key: openKey, data: undefined, error: err.message });
      });
    return () => {
      cancelled = true;
    };
    // only reload when the dialog opens for something else, not when the
    // parent re-renders with a new load function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openKey]);

  // keep the data on screen for the fade-out, but don't reuse it next time
  // (it may be out of date by then, e.g. a record was added to a crate)
  const markStale = () => setLoaded((prev) => ({ ...prev, key: null }));

  function close() {
    if (working) return;
    setConfirmError(null);
    markStale();
    onCancel();
  }

  async function handleConfirm() {
    setWorking(true);
    setConfirmError(null);
    try {
      await onConfirm();
      markStale();
    } catch (err) {
      setConfirmError(err.message);
    } finally {
      setWorking(false);
    }
  }

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {isLoading && <Typography color="text.secondary">Loading...</Typography>}
        {/* if load() failed there is nothing to base the message on */}
        {!isLoading && !current?.error && (
          <Typography>{message(current?.data)}</Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="text" disabled={working} onClick={close}>
          {cancelLabel}
        </Button>
        <Button
          color="error"
          disabled={working || isLoading || Boolean(current?.error)}
          onClick={handleConfirm}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
