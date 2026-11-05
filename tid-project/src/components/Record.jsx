function Record({ record }) {
  return (
    <li>
      {record.pic ? (
        <img src={record.pic} alt={`${record.albumtitle} cover`} />
      ) : (
        <div></div>
      )}
      <div>
        <p>{record.albumtitle}</p>
        <p>{record.artist}</p>
        {record.year && <p>{record.year}</p>}
      </div>
    </li>
  );
}

export default Record;
