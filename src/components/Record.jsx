function Record({ record, onAdd }) {
  return (
    <li>
      {record.pic ? (
        <img src={record.pic} alt={`${record.albumtitle} cover`} />
      ) : (
        <div className="no-cover"></div>
      )}
      <div>
        <strong>{record.albumtitle}</strong>
        <p>{record.artist}</p>
        {record.year && <p>{record.year}</p>}
      </div>
      {onAdd && (
        <button onClick={() => onAdd(record.id)}>Add to collection</button>
      )}
    </li>
  );
}

export default Record;
