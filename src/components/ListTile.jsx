import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import Typography from "@mui/material/Typography";

// A big tappable tile, e.g. "My collection" / "Want list".
// Two of them sit side by side on the collection page.
export default function ListTile({ title, onClick }) {
  return (
    <Card sx={{ flex: 1 }}>
      <CardActionArea onClick={onClick} sx={{ height: 120, p: 2 }}>
        <Typography variant="h3">{title}</Typography>
      </CardActionArea>
    </Card>
  );
}
