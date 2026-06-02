import { useState, useEffect } from "react";
import { Download, Copy, RefreshCw, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";
import toast from "react-hot-toast";

export default function QRCodePage() {
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/center/qr");
      setQrData(data);
    } catch {
      toast.error("Failed to load QR code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQR(); }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrData.uploadUrl);
    toast.success("Upload link copied!");
  };

  const handleDownloadQR = () => {
    const a = document.createElement("a");
    a.href = qrData.qrCode;
    a.download = `${qrData.shopName.replace(/\s+/g, "-")}-dropbox-qr.png`;
    a.click();
    toast.success("QR code downloaded");
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      <Navbar />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px" }} className="page-fade-in">
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: "1.8rem", marginBottom: 6 }}>Your QR Code</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Display this at your shop so customers can upload documents without sharing personal contact details.</p>
        </div>

        {loading ? (
          <div className="card" style={{ padding: 80, textAlign: "center" }}>
            <div className="loading-spinner" style={{ borderColor: "rgba(13,13,20,0.15)", borderTopColor: "var(--ink)", width: 32, height: 32, margin: "0 auto 16px" }} />
            <p style={{ color: "var(--text-muted)" }}>Generating QR code…</p>
          </div>
        ) : qrData ? (
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            {/* QR Card - printable */}
            <div className="card" style={{ flex: "0 0 auto", padding: 40, textAlign: "center", minWidth: 280 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem", marginBottom: 4 }}>{qrData.shopName}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>Scan to upload documents</div>
              </div>
              <div style={{ background: "white", borderRadius: 16, padding: 16, display: "inline-block", boxShadow: "var(--shadow-sm)", border: "1px solid var(--border)" }}>
                <img src={qrData.qrCode} alt="Drop Box QR Code" style={{ width: 220, height: 220, display: "block" }} />
              </div>
              <div style={{ marginTop: 20, fontSize: "0.75rem", color: "var(--text-light)", letterSpacing: "0.01em" }}>
                No WhatsApp. No email. Just scan.
              </div>
              <div style={{ marginTop: 12, background: "var(--surface)", borderRadius: 8, padding: "8px 12px", fontFamily: "monospace", fontSize: "0.72rem", color: "var(--text-muted)", wordBreak: "break-all" }}>
                {qrData.uploadUrl}
              </div>
            </div>

            {/* Actions */}
            <div style={{ flex: 1, minWidth: 220, display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "1rem", marginBottom: 6 }}>Download QR</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>Save and print this QR code. Display it at your counter or print it on a card for customers.</p>
                <button className="btn btn-primary" onClick={handleDownloadQR} style={{ width: "100%", justifyContent: "center", gap: 6 }}>
                  <Download size={15} /> Download PNG
                </button>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontSize: "1rem", marginBottom: 6 }}>Share Upload Link</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16, lineHeight: 1.5 }}>Customers can also open this link directly if they can't scan.</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button className="btn btn-outline" onClick={handleCopyLink} style={{ flex: 1, justifyContent: "center", gap: 6, fontSize: "0.85rem" }}>
                    <Copy size={14} /> Copy Link
                  </button>
                  <a href={qrData.uploadUrl} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ gap: 6, fontSize: "0.85rem" }}>
                    <ExternalLink size={14} /> Open
                  </a>
                </div>
              </div>

              <div className="card" style={{ padding: 24, background: "var(--ink)", borderColor: "var(--ink)" }}>
                <h3 style={{ fontSize: "0.95rem", color: "white", marginBottom: 8 }}>🔒 Privacy promise</h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {["No customer phone number stored", "No email address required", "Files auto-delete in 24 hours", "Only you can view uploaded files"].map((item) => (
                    <li key={item} style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.6)", display: "flex", gap: 8, alignItems: "flex-start" }}>
                      <span style={{ color: "#2ecc71", flexShrink: 0 }}>✓</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
