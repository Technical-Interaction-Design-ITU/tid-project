import { useEffect, useState } from "react";
import Record from "./Record.jsx";
import { getRecordsInList } from "../services/recordListServices.js";

// Turn a Parse Record object into the shape the Record component expects
function toRecordProps(record) {
  return {
    id: record.id,
    albumtitle: record.get("title"),
    artist: record.get("artist_name"),
    year: record.get("year"),
    // pic: record.get("pic"),
  };
}

// Shows all records stored in the list with the given listId (via Stored_in)
// onAddToCollection: moves a record out of this list (it is removed from the screen)
// onAddToCrate: adds a record to a crate as well (it stays in this list)
function RecordList({ listId, onAddToCollection, onAddToCrate }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addError, setAddError] = useState(null);

  // run onAddToCollection, then remove the record from this list on screen
  async function handleAddToCollection(id) {
    setAddError(null);
    try {
      await onAddToCollection(id);
      setRecords((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setAddError(err.message);
    }
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
  if (!listId) return <p>No records in this list yet.</p>;
  if (loading) return <p>Loading records...</p>;
  if (error) return <p>Could not load records: {error}</p>;
  if (records.length === 0) return <p>No records in this list yet.</p>;

  return (
    <>
      {addError && <p style={{ color: "crimson" }}>{addError}</p>}
      <ul className="record-list">
        {records.map((elem) => (
          <Record
            key={elem.id}
            record={elem}
            onAddToCollection={onAddToCollection ? handleAddToCollection : undefined}
            onAddToCrate={onAddToCrate}
          />
        ))}
      </ul>
    </>
  );
}

export default RecordList;
