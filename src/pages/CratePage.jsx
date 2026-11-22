import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import RecordList from "../components/RecordList";
import BackButton from "../components/BackButton.jsx";
import { useToast } from "../hooks/useToast.js";
import {
  getCrate,
  removeFromRecordList,
} from "../services/recordListServices.js";

// One crate, at /crates/:listId.
export default function CratePage() {
  const { listId } = useParams();
  const showToast = useToast();
  const [crate, setCrate] = useState(null); // only needed for the title
  const [error, setError] = useState(null);

  // load the crate's name (RecordList loads the records itself from listId)
  useEffect(() => {
    let cancelled = false;
    getCrate(listId)
      .then((result) => {
        if (!cancelled) setCrate(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      });
    return () => {
      cancelled = true;
    };
  }, [listId]);

  // remove a record from this crate only (stays in the collection)
  async function handleRemove(id, record) {
    await removeFromRecordList(id, listId);
    showToast(
      `Removed "${record.albumtitle}" from "${crate.get("list_name")}"`,
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="h1">{crate?.get("list_name") ?? "Crate"}</Typography>
      <BackButton />
      {error ? (
        <Alert severity="error">Could not load crate: {error}</Alert>
      ) : (
        <RecordList listId={listId} onRemove={handleRemove} />
      )}
    </Stack>
  );
}
