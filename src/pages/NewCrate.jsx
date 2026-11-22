import { useState } from "react";
import { useNavigate } from "react-router";
import { createRecordList } from "../services/recordListServices.js";
import { useToast } from "../hooks/useToast.js";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// I have created this page as a Dialog (similar to add record page),
// which is a layer on top of the page (and the bottom bar)

export default function NewCrate() {
  const navigate = useNavigate();
  const close = () => navigate("/");
  const showToast = useToast();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createRecordList(name, "crate");
      // The toast is global, so it stays visible after we navigate back home
      showToast(`Crate "${name.trim()}" created`);
      close();
    } catch (err) {
      console.error(err);
      showToast(`Could not create crate: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog fullScreen open onClose={close}>
      <Container>
        <Stack spacing={3} sx={{ py: 3 }}>
          <IconButton
            aria-label="Close"
            onClick={close}
            sx={{ alignSelf: "flex-start" }}
          >
            <CloseRoundedIcon />
          </IconButton>

          <Typography variant="h1">New crate</Typography>

          <Stack component="form" onSubmit={handleSubmit} spacing={2}>
            <TextField
              label="Crate name"
              placeholder="Give your crate a name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Button
              type="submit"
              size="large"
              disabled={loading || !name.trim()}
            >
              Create crate
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Dialog>
  );
}
