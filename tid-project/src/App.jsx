import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/AuthPage.jsx";
import Home from "./pages/Home.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import { currentUser, logOut } from "./services/authService.js";

function App() {
  const [user, setUser] = useState(() => currentUser());

  async function handleLogOut() {
    await logOut();
    setUser(null);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Home user={user} onLogOut={handleLogOut} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <AuthPage onAuthenticated={setUser} />
            )
          }
        />
        <Route
          path="/signup"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <SignUpPage onAuthenticated={setUser} />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
