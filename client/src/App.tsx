import { Routes, Route } from "react-router-dom";
import MainPage from "./pages/MainPage";
import ScientistPage from "./pages/ScientistPage";
import DiscoveryPage from "./pages/DiscoveryPage";
import InventionPage from "./pages/InventionPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/scientist/:id" element={<ScientistPage />} />
      <Route path="/discovery/:id" element={<DiscoveryPage />} />
      <Route path="/invention/:id" element={<InventionPage />} />
    </Routes>
  );
}