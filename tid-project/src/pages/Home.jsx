export default function Home({ user, onLogOut }) {
  return (
    <div>
      <h1>Home</h1>
      <p>Logged in as {user.get("username")}</p>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
}
