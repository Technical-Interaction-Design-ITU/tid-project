import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ListTile from "./ListTile.jsx";
import CrateCard from "./CrateCard.jsx";

// The overview shown on the collection page: two list tiles, then the user's crates.
// All data and handlers come in as props - this component only draws.
export default function HomeView({
  crates,
  onOpenCollection,
  onOpenWantlist,
  onOpenCrate,
  onNewCrate,
  onDeleteCrate,
}) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2}>
        <ListTile title="My collection" onClick={onOpenCollection} />
        <ListTile title="Want list" onClick={onOpenWantlist} />
      </Stack>

      <Typography variant="subtitle1" color="text.secondary">
        Crates
      </Typography>

      <Button
        variant="dashed"
        startIcon={<AddRoundedIcon />}
        onClick={onNewCrate}
      >
        New crate
      </Button>

      {crates.map((crate) => (
        <CrateCard
          key={crate.id}
          title={crate.get("list_name")}
          onClick={() => onOpenCrate(crate)}
          onDelete={() => onDeleteCrate(crate)}
        />
      ))}
    </Stack>
  );
}
