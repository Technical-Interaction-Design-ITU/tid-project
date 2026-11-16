import RecordList from "../components/RecordList";
import { testRecords } from "../data/testRecords.js";
import { useState } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

const titles = {
  hub: "Home",
  collection: "My Collection",
  wantlist: "My Wantlist",
};

function CollectionPage() {
  const [view, setView] = useState("hub");
  const records = view === "collection" ? testRecords : testRecords;

  function handleAdd(id) {
    console.log("Add to collection:", id);
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h1">{titles[view]}</Typography>

      {view === "hub" ? (
        <Stack spacing={2}>
          {["collection", "wantlist"].map((key) => (
            <Card key={key}>
              <CardActionArea onClick={() => setView(key)}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h2" component="h2">
                    {titles[key]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {records.length} records
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      ) : (
        <>
          <Button
            variant="text"
            color="inherit"
            startIcon={<ArrowBackRoundedIcon />}
            onClick={() => setView("hub")}
            sx={{ alignSelf: "flex-start" }}
          >
            Back
          </Button>
          <RecordList
            records={records}
            onAdd={view === "wantlist" ? handleAdd : undefined}
          />
        </>
      )}
    </Stack>
  );
}

export default CollectionPage;
