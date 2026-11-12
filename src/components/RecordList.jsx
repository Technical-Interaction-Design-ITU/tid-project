import Record from "./Record.jsx";

function RecordList({ records, onAdd }) {
  return (
    <ul className="record-list">
      {records.map((elem) => (
        <Record key={elem.id} record={elem} onAdd={onAdd} />
      ))}
    </ul>
  );
}

export default RecordList;
