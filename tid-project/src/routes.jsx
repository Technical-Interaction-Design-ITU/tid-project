import { Routes, Route, Navigate } from "react-router";
import Collection from "./pages/CollectionPage.jsx";
import AddRecord from "./pages/AddRecordPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import SearchTestPage from "./pages/SearchTestPage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h1>Page not found</h1>
    </div>
  );
}

export default function AppRoutes({ user, onAuthenticated, onLogOut }) {
  // Pages that need a login: show the page if logged in, otherwise go to /auth.
  const requireUser = (page) => (user ? page : <Navigate to="/auth" replace />);
  // Login/sign-up pages: once logged in, go to the collection instead.
  const guestOnly = (page) => (user ? <Navigate to="/" replace /> : page);

  return (
    <Routes>
      <Route path="/" element={requireUser(<Collection />)} />
      <Route path="/add" element={requireUser(<AddRecord />)} />
      <Route
        path="/profile"
        element={requireUser(<Profile user={user} onLogOut={onLogOut} />)}
      />
      <Route path="/search-test" element={requireUser(<SearchTestPage />)} />

      <Route
        path="/auth"
        element={guestOnly(<AuthPage onAuthenticated={onAuthenticated} />)}
      />
      <Route
        path="/signup"
        element={guestOnly(<SignUpPage onAuthenticated={onAuthenticated} />)}
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
