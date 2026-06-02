import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import QRCodePage from "./pages/QRCodePage";
import UploadPage from "./pages/UploadPage";

const ProtectedRoute = ({ children }) => {
  const { center } = useAuth();
  return center ? children : <Navigate to="/login" replace />;
};

const GuestRoute = ({ children }) => {
  const { center } = useAuth();
  return !center ? children : <Navigate to="/dashboard" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/qr-code" element={<ProtectedRoute><QRCodePage /></ProtectedRoute>} />
      <Route path="/upload/:dropboxId" element={<UploadPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
