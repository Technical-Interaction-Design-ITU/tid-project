import { useState } from "react";
import { useNavigate } from "react-router";
import { createRecordList } from "../services/recordListServices.js";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

// I have created this page as a Dialog (similar to add record page),
// which is a layer on top of the page (and the bottom bar)

export default function NewCrate() {
  const navigate = useNavigate();
  const close = () => navigate("/");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      await createRecordList(name, "crate");
      close();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog fullScreen open onClose={close}>
      <div style={{ padding: 24 }}>
        <IconButton onClick={close}>
          <CloseRoundedIcon />
        </IconButton>

        <h1>New crate </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Give your crate a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit" disabled={loading || !name.trim()}>
            Create crate
          </button>
        </form>
      </div>
    </Dialog>
  );
}
