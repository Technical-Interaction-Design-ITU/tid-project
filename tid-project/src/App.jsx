import { useState } from "react";
import { BrowserRouter } from "react-router";
import "./App.css";
import AppRoutes from "./routes.jsx";
import BottomNav from "./components/BottomNav.jsx";
import { currentUser, logOut } from "./services/authService.js";

export default function App() {
  const [user, setUser] = useState(() => currentUser());

  async function handleLogOut() {
    await logOut();
    setUser(null);
  }

  return (
    <BrowserRouter>
      <AppRoutes
        user={user}
        onAuthenticated={setUser}
        onLogOut={handleLogOut}
      />
      {/* Outside <Routes> so it stays on every page — but only when logged in. */}
      {user && <BottomNav />}
    </BrowserRouter>
  );
}
