import Box from "@mui/material/Box";
import Record from "./Record.jsx";

function RecordList({ records, onAdd }) {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: "none",
        m: 0,
        p: 0,
        display: "flex",
        flexDirection: "column",
        gap: 1.5,
      }}
    >
      {records.map((elem) => (
        <Record key={elem.id} record={elem} onAdd={onAdd} />
      ))}
    </Box>
  );
}

export default RecordList;
