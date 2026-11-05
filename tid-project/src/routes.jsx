import { Routes, Route } from "react-router";
import Collection from "./pages/CollectionPage";
import AddRecord from "./pages/AddRecordPage";
import Profile from "./pages/ProfilePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CollectionPage />} />
      <Route path="/add" element={<AddPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  );
}
