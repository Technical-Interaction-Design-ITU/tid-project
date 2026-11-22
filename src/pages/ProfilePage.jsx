import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useToast } from "../hooks/useToast.js";

export default function Profile({ user, onLogOut }) {
  const showToast = useToast();

  // onLogOut (from App.jsx) logs out and clears the user, which sends us to /auth.
  // The toast is global, so it stays visible on the login page.
  async function handleLogOut() {
    try {
      await onLogOut();
      showToast("You've been logged out");
    } catch (err) {
      showToast(`Could not log out: ${err.message}`, "error");
    }
  }

  return (
    <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
      <Typography variant="h1">Profile</Typography>
      <Typography color="text.secondary">
        Logged in as {user.get("username")}
      </Typography>
      <Button variant="outlined" onClick={handleLogOut}>
        Log Out
      </Button>
    </Stack>
  );
}
