import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ shopName: "", ownerName: "", email: "", password: "", phone: "", address: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success("Shop registered successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--surface)" }}>
      <div style={{ width: "100%", maxWidth: 480 }} className="page-fade-in">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 36, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Back to home
        </Link>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, background: "var(--ink)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <span style={{ fontSize: "1.3rem" }}>🏪</span>
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>Register your shop</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Create a secure document drop box for your customers</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Shop Name *</label>
                <input className="form-input" name="shopName" placeholder="ABC Xerox" value={form.shopName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Owner Name *</label>
                <input className="form-input" name="ownerName" placeholder="Your name" value={form.ownerName} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input className="form-input" name="email" type="email" placeholder="shop@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password *</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" name="password" type={showPass ? "text" : "password"} placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required style={{ width: "100%", paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Phone (optional)</label>
                <input className="form-input" name="phone" placeholder="Shop phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address (optional)</label>
                <input className="form-input" name="address" placeholder="Shop address" value={form.address} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "0.95rem", marginTop: 4 }}>
              {loading ? <span className="loading-spinner" /> : <><UserPlus size={16} /> Create Drop Box</>}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--ink)", fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
