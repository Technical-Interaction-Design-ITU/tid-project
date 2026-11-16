import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

// One crate in the list: title top-left, optional record count bottom-right.
// `count` is optional - nothing is shown until someone passes it in.
export default function CrateCard({ title, count, onClick }) {
  return (
    <Card>
      <CardActionArea
        onClick={onClick}
        sx={{
          minHeight: 88,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="subtitle1">{title}</Typography>
        {count !== undefined && (
          <Box
            sx={{
              alignSelf: "flex-end",
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: 1,
              borderColor: "text.secondary",
              display: "grid",
              placeItems: "center",
            }}
          >
            <Typography variant="caption">{count}</Typography>
          </Box>
        )}
      </CardActionArea>
    </Card>
  );
}
