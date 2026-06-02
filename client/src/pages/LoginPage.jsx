import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, LogIn } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--surface)" }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="page-fade-in">
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 40, color: "var(--text-muted)", fontSize: "0.9rem" }}>
          ← Back to home
        </Link>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ width: 44, height: 44, background: "var(--ink)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <span style={{ fontSize: "1.3rem" }}>📥</span>
            </div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>Sign in</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Access your xerox center dashboard</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: "relative" }}>
                <input className="form-input" name="password" type={showPass ? "text" : "password"} placeholder="Your password" value={form.password} onChange={handleChange} required style={{ width: "100%", paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "13px", fontSize: "0.95rem", marginTop: 4 }}>
              {loading ? <span className="loading-spinner" /> : <><LogIn size={16} /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-muted)", fontSize: "0.88rem" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--ink)", fontWeight: 600 }}>Register your shop</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
