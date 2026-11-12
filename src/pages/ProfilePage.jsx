export default function Profile({ user, onLogOut }) {
  return (
    <div style={{ padding: 24 }}>
      <h1>Profile</h1>
      <p>Logged in as {user.get("username")}</p>
      <button onClick={onLogOut}>Log Out</button>
    </div>
  );
}
