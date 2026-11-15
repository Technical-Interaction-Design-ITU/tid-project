function Record({ record, onAddToCollection, onAddToCrate }) {
  return (
    <li>
      {/* Album covers are not stored in Back4App yet:
      {record.pic ? (
        <img src={record.pic} alt={`${record.albumtitle} cover`} />
      ) : (
        <div className="no-cover"></div>
      )}
      */}
      <div className="no-cover"></div>
      <div>
        <strong>{record.albumtitle}</strong>
        <p>{record.artist}</p>
        {record.year && <p>{record.year}</p>}
      </div>
      {/* button "add to collection" (handleAddToCollection), only shown in Wantlist view */}
      {onAddToCollection && (
        <button onClick={() => onAddToCollection(record.id)}>Add to collection</button>
      )}
      {/* button "add to crate" (opens AddToCrateDialog), only shown in Collection view */}
      {onAddToCrate && (
        <button onClick={() => onAddToCrate(record.id)}>Add to crate</button>
      )}
    </li>
  );
}

export default Record;
