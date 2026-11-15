import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {
  getCrates,
  addToRecordList,
  isInRecordList,
} from "../services/recordListServices.js";

/*
    This contains the page for adding a record to a crate.
    Shows all the user's crates; clicking one creates a new Stored_in row,
    so the record stays in the collection and also appears in that crate.
    
 */

// recordId: the Record's objectId, or null when the dialog is closed
// onAdded(crate): called after the record was added to a crate
export default function AddToCrateDialog({ recordId, onClose, onAdded }) {
  const open = recordId !== null;
  const [crates, setCrates] = useState(null); // null = still loading
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // load the crates each time the dialog opens
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    getCrates()
      .then((result) => {
        if (!cancelled) setCrates(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function close() {
    if (saving) return;
    setError(null);
    onClose();
  }

  async function addToCrate(crate) {
    setSaving(true);
    setError(null);
    try {
      const crateId = crate.get("list_id");
      if (await isInRecordList(recordId, crateId)) {
        throw new Error(`Already in "${crate.get("list_name")}"`);
      }
      await addToRecordList(recordId, crateId);
      onAdded(crate);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onClose={close}>
      <DialogTitle>Add to crate</DialogTitle>
      <DialogContent>
        {crates === null && !error && <p>Loading crates...</p>}
        {crates?.length === 0 && <p>You have no crates yet.</p>}
        {crates?.map((crate) => (
          <div key={crate.id}>
            <button disabled={saving} onClick={() => addToCrate(crate)}>
              {crate.get("list_name")}
            </button>
          </div>
        ))}
        {error && <p style={{ color: "crimson" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <button disabled={saving} onClick={close}>
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}
