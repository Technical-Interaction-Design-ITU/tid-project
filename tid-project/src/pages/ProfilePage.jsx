import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function Profile({ user, onLogOut }) {
  return (
    <Stack spacing={3} sx={{ alignItems: "flex-start" }}>
      <Typography variant="h1">Profile</Typography>
      <Typography color="text.secondary">
        Logged in as {user.get("username")}
      </Typography>
      <Button variant="outlined" onClick={onLogOut}>
        Log Out
      </Button>
    </Stack>
  );
}
