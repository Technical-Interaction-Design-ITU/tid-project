import { Link } from "react-router-dom";

export default function Home({ user, onLogOut }) {
  return (
    <div>
      <h1>Home</h1>
      <p>Logged in as {user.get("username")}</p>
      <Link to="/collection">My Collection</Link>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
}
