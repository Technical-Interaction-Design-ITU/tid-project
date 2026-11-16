import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { logIn } from "../services/authService.js";

export default function AuthPage({ onAuthenticated }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter a username and password.");
      return;
    }
    setLoading(true);
    try {
      const user = await logIn(username.trim(), password);
      onAuthenticated(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h1">Log In</Typography>
      {error && <Alert severity="error">{error}</Alert>}

      <Stack component="form" onSubmit={handleSubmit} spacing={2}>
        <TextField
          label="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" size="large" disabled={loading}>
          Log In
        </Button>
      </Stack>

      <Typography color="text.secondary">
        No account yet?{" "}
        <Link component={RouterLink} to="/signup">
          Sign up
        </Link>
      </Typography>
    </Stack>
  );
}
