import { useState } from "react";
import { Link } from "react-router-dom";
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
    <div>
      <h1>Log In</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          Log In
        </button>
      </form>

      <p>
        No account yet? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}
