import { useEffect, useState } from "react";
import Record from "./Record.jsx";
import { getRecordsInList } from "../services/recordListServices.js";

// Turn a Parse Record object into the shape the Record component expects
function toRecordProps(record) {
  return {
    id: record.id,
    albumtitle: record.get("title"),
    artist: record.get("artistName"),
    year: record.get("year"),
    pic: record.get("pic"),
  };
}

// Shows all records stored in the list with the given listId (via Stored_in)
function RecordList({ listId, onAdd }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p>Loading records...</p>;
  if (error) return <p>Could not load records: {error}</p>;
  if (records.length === 0) return <p>No records in this list yet.</p>;

  return (
    <ul className="record-list">
      {records.map((elem) => (
        <Record key={elem.id} record={elem} onAdd={onAdd} />
      ))}
    </ul>
  );
}

export default RecordList;
