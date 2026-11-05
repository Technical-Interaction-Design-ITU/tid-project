import { Routes, Route } from "react-router-dom";
import Collection from "./pages/CollectionPage.jsx";
import AddRecord from "./pages/AddRecordPage.jsx";
import Profile from "./pages/ProfilePage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Collection />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
