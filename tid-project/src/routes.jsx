import { Routes, Route } from "react-router";
import Collection from "./pages/CollectionPage";
import AddRecord from "./pages/AddRecordPage";
import Profile from "./pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Collection />} />
      <Route path="/add" element={<AddRecord />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
