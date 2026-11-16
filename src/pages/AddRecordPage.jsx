import { useState } from "react";
import { useNavigate } from "react-router";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import SearchBox from "../components/SearchBox.jsx";
import Record from "../components/Record.jsx";
import Toast from "../components/Toast.jsx";
import { newRecord } from "../services/recordServices.js";
import { getCollection, getWantList } from "../services/recordListServices.js";

// it is a dialog = Full-screen overlay (above the bottom nav)
export default function AddRecordPage() {
  const navigate = useNavigate();
  const close = () => navigate("/");

  const [selected, setSelected] = useState(null); // album chosen in the SearchBox
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); // confirmation after saving

  // SearchBox gives us { id, artist, title, year, thumb, cover, ... }
  function handleSelect(album) {
    setSelected(album);
    setError(null);
    setMessage(null);
  }

  function closeSelected() {
    if (!saving) setSelected(null);
  }

  // getList is getCollection or getWantList
  async function addTo(getList, listName) {
    setSaving(true);
    setError(null);
    try {
      const list = await getList();
      await newRecord(
        {
          releaseCode: selected.id,
          title: selected.title,
          artistName: selected.artist,
          cover: selected.cover,
        },
        list,
      );
      setMessage(`Added "${selected.title}" to your ${listName}`);
      setSelected(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog fullScreen open onClose={close}>
      <div style={{ padding: 24 }}>
        <IconButton aria-label="Close" onClick={close}>
          <CloseRoundedIcon />
        </IconButton>

        <h1>Add record</h1>

        <SearchBox onSelect={handleSelect} />
      </div>

      {/* Confirmation toast after a record is saved */}
      <Toast
        open={message !== null}
        message={message}
        onClose={() => setMessage(null)}
      />

      {/* Preview of the chosen album*/}
      <Dialog open={selected !== null} onClose={closeSelected}>
        {selected && (
          <>
            <DialogContent>
              <ul className="record-list">
                <Record
                  record={{
                    id: selected.id,
                    albumtitle: selected.title,
                    artist: selected.artist,
                    year: selected.year,
                    cover: selected.cover,
                  }}
                />
              </ul>
              {error && <p style={{ color: "crimson" }}>{error}</p>}
            </DialogContent>
            <DialogActions>
              <button
                disabled={saving}
                onClick={() => addTo(getCollection, "collection")}
              >
                Add to collection
              </button>
              <button
                disabled={saving}
                onClick={() => addTo(getWantList, "want list")}
              >
                Add to wantlist
              </button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Dialog>
  );
}
