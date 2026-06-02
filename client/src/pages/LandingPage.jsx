import { Link } from "react-router-dom";
import { Shield, QrCode, Trash2, Clock, ArrowRight, Lock, Eye, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px", maxWidth: 1100, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, background: "var(--ink)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: "1.1rem" }}>📥</span>
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>SecureDrop</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link to="/login" className="btn btn-ghost">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 48px 60px", textAlign: "center" }} className="page-fade-in">
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "var(--white)", border: "1px solid var(--border)",
          borderRadius: 100, padding: "6px 16px", marginBottom: 32,
          fontSize: "0.82rem", color: "var(--text-muted)", fontWeight: 500,
        }}>
          <Shield size={13} /> Privacy-first document sharing
        </div>
        <h1 style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.03em" }}>
          Send documents to<br />
          <span style={{ color: "var(--accent)" }}>xerox centers</span><br />
          without sharing your number
        </h1>
        <p style={{ fontSize: "1.15rem", color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 40px", lineHeight: 1.7 }}>
          Scan a QR code. Upload your file. Done. No WhatsApp number. No email. No personal details shared.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/register" className="btn btn-primary" style={{ fontSize: "1rem", padding: "14px 32px" }}>
            Register Your Shop <ArrowRight size={16} />
          </Link>
          <Link to="/login" className="btn btn-outline" style={{ fontSize: "1rem", padding: "14px 28px" }}>
            Sign In
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 48px" }}>
        <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: 48, letterSpacing: "-0.02em" }}>How it works</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {[
            { icon: "🏪", step: "01", title: "Shop registers", desc: "Xerox center creates an account and gets a unique QR code for their drop box." },
            { icon: "📱", step: "02", title: "Customer scans", desc: "Customer visits the shop, scans the QR code with their phone camera." },
            { icon: "📄", step: "03", title: "Upload document", desc: "Upload page opens instantly. Customer uploads their file and adds print instructions." },
            { icon: "🖨️", step: "04", title: "Print & delete", desc: "Shop prints the document and deletes it. Files auto-delete after 24 hours." },
          ].map((item) => (
            <div key={item.step} className="card" style={{ padding: "28px 24px" }}>
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>{item.icon}</div>
              <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--text-light)", letterSpacing: "0.1em", marginBottom: 8 }}>STEP {item.step}</div>
              <h3 style={{ fontSize: "1.1rem", marginBottom: 10 }}>{item.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ background: "var(--ink)", color: "white", padding: "80px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: "2rem", marginBottom: 12, letterSpacing: "-0.02em" }}>Built for privacy</h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", marginBottom: 48, fontSize: "1rem" }}>Especially important for women who don't want to share personal contact details with strangers.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
            {[
              { icon: <Lock size={20} />, title: "No phone number", desc: "Customers never share their WhatsApp or phone" },
              { icon: <Eye size={20} />, title: "No email needed", desc: "Zero personal contact info required to upload" },
              { icon: <Shield size={20} />, title: "Secure auth", desc: "Shop logins protected by JWT & bcrypt" },
              { icon: <Clock size={20} />, title: "Auto-delete", desc: "Documents expire after 24 hours automatically" },
              { icon: <Trash2 size={20} />, title: "Manual delete", desc: "Shop can delete any file after printing" },
              { icon: <Zap size={20} />, title: "Instant upload", desc: "No account needed. Scan, upload, done." },
            ].map((f) => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: "24px 20px", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ color: "var(--accent)", marginBottom: 12 }}>{f.icon}</div>
                <h4 style={{ fontSize: "0.95rem", marginBottom: 6 }}>{f.title}</h4>
                <p style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "32px", color: "var(--text-light)", fontSize: "0.85rem", borderTop: "1px solid var(--border)" }}>
        <strong style={{ fontFamily: "var(--font-display)", color: "var(--text-primary)" }}>SecureDrop</strong> · Protecting privacy at every xerox center
      </footer>
    </div>
  );
}
