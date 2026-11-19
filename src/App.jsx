import { useState } from "react";
import { BrowserRouter } from "react-router";
import AppRoutes from "./routes.jsx";
import Container from "@mui/material/Container";
import BottomNav from "./components/BottomNav.jsx";
import { currentUser, logOut } from "./services/authService.js";

export default function App() {
  const [user, setUser] = useState(() => currentUser());

  async function handleLogOut() {
    await logOut();
    setUser(null);
  }

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Container sx={{ pt: 3, pb: 12 }}>
        <AppRoutes
          user={user}
          onAuthenticated={setUser}
          onLogOut={handleLogOut}
        />
      </Container>
      {/* Outside <Routes> so it stays on every page — but only when logged in. */}
      {user && <BottomNav />}
    </BrowserRouter>
  );
}
