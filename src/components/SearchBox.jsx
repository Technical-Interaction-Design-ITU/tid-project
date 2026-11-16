import { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
// Pure vibe code - for testing purposes
// Album autocomplete. Calls onSelect(album) with a /api/search result ({ id, artist, title, year, thumb, cover, ... }).
export default function SearchBox({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (q.trim().length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      // debounce: Discogs allows 25-60 req/min
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: ctrl.signal,
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error);
        setResults(body);
        setError("");
      } catch (e) {
        if (e.name !== "AbortError") setError(e.message);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  const shown = q.trim().length < 2 ? [] : results;

  return (
    <Stack spacing={2}>
      <TextField
        label="Search albums or artists"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
      {error && <Alert severity="error">{error}</Alert>}
      {shown.length > 0 && (
        <Paper variant="outlined" sx={{ maxHeight: 400, overflowY: "auto" }}>
          <List disablePadding>
            {shown.map((a) => (
              <ListItem key={a.id} disablePadding>
                <ListItemButton
                  onClick={() => {
                    onSelect(a);
                    setQ("");
                  }}
                >
                  <ListItemAvatar>
                    <Avatar variant="rounded" src={a.thumb || undefined} alt="">
                      <AlbumRoundedIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={a.title}
                    secondary={`${a.artist}${a.year ? ` · ${a.year}` : ""}`}
                    slotProps={{ primary: { noWrap: true }, secondary: { noWrap: true } }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Stack>
  );
}
