import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, LayoutDashboard, QrCode, Menu, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  const { center, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <nav style={{
      background: "var(--white)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to={center ? "/dashboard" : "/"} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: 32, height: 32,
          background: "var(--ink)",
          borderRadius: 8,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span style={{ color: "white", fontSize: "1rem" }}>📥</span>
        </div>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.02em" }}>
          SecureDrop
        </span>
      </Link>

      {center && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link to="/dashboard" className={`btn btn-ghost ${location.pathname === "/dashboard" ? "active-link" : ""}`}
            style={{ gap: 6, ...(location.pathname === "/dashboard" ? { color: "var(--text-primary)", fontWeight: 600 } : {}) }}>
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link to="/qr-code" className={`btn btn-ghost ${location.pathname === "/qr-code" ? "active-link" : ""}`}
            style={{ gap: 6, ...(location.pathname === "/qr-code" ? { color: "var(--text-primary)", fontWeight: 600 } : {}) }}>
            <QrCode size={16} /> QR Code
          </Link>
          <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 4px" }} />
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {center.shopName}
          </span>
          <button className="btn btn-ghost" onClick={handleLogout} style={{ color: "var(--accent)", gap: 6 }}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      )}
    </nav>
  );
}
