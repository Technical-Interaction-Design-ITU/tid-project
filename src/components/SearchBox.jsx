import { useEffect, useRef, useState } from "react";
import Alert from "@mui/material/Alert";
import Avatar from "@mui/material/Avatar";
import CircularProgress from "@mui/material/CircularProgress";
import InputAdornment from "@mui/material/InputAdornment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import AlbumRoundedIcon from "@mui/icons-material/AlbumRounded";
import PrimaryButton from "./PrimaryButton.jsx";
import Parse from "../services/parse.js";
// Pure vibe code - for testing purposes
// Album autocomplete. Calls onSelect(album) with a searchAlbums Cloud Function result ({ id, artist, title, year, thumb, cover, ... }).
export default function SearchBox({ onSelect }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  // "live" = debounced search while typing, "submit" = Search button / Enter
  const [loading, setLoading] = useState(null);
  // only the newest request may clear the spinner, so an older one finishing
  // early doesn't hide it while the newest is still running
  const latestRequest = useRef(0);

  const tooShort = q.trim().length < 2;

  async function search(query, signal, source) {
    const requestId = ++latestRequest.current;
    setLoading(source);
    try {
      // Cloud Function (cloud/main.js) so the Discogs token stays server-side.
      // Parse.Cloud.run can't be aborted, so drop the result if the query changed meanwhile.
      const body = await Parse.Cloud.run("searchAlbums", { q: query });
      if (signal?.aborted) return;
      setResults(body);
      setError("");
    } catch (e) {
      if (!signal?.aborted) setError(e.message);
    } finally {
      if (requestId === latestRequest.current) setLoading(null);
    }
  }

  // Live search while typing, debounced: Discogs allows 25-60 req/min
  useEffect(() => {
    if (q.trim().length < 2) return;
    const ctrl = new AbortController();
    const t = setTimeout(() => search(q, ctrl.signal, "live"), 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [q]);

  // Search button / Enter: search right away instead of waiting for the debounce
  function handleSubmit(e) {
    e.preventDefault();
    if (!tooShort) search(q, undefined, "submit");
  }

  const shown = tooShort ? [] : results;
  const searching = tooShort ? null : loading;

  return (
    <Stack spacing={2}>
      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          label="Search albums or artists"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          slotProps={{
            input: {
              endAdornment: searching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} aria-label="Searching" />
                </InputAdornment>
              ),
            },
          }}
        />
        <PrimaryButton
          type="submit"
          disabled={tooShort}
          loading={searching === "submit"}
          loadingIndicator={<CircularProgress size={22} color="inherit" />}
        >
          Search
        </PrimaryButton>
      </Stack>
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
                    slotProps={{
                      primary: { noWrap: true },
                      secondary: { noWrap: true },
                    }}
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
