import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Download, Trash2, RefreshCw, FileText, Clock, QrCode, CheckCircle, Printer, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const STATUS_OPTIONS = ["pending", "printing", "printed"];

function formatBytes(bytes) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage() {
  const { center } = useAuth();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? { status: filter } : {};
      const { data } = await api.get("/documents", { params });
      setDocs(data.documents);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await api.delete(`/documents/${id}`);
      toast.success("Document deleted");
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = async (id, name) => {
    try {
      const res = await api.get(`/documents/${id}/download`, { responseType: "blob" });
      const url = URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url; a.download = name; a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed");
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.patch(`/documents/${id}/status`, { status });
      setDocs((prev) => prev.map((d) => d._id === id ? { ...d, status } : d));
      toast.success(`Marked as ${status}`);
    } catch {
      toast.error("Status update failed");
    }
  };

  const counts = docs.reduce((acc, d) => { acc[d.status] = (acc[d.status] || 0) + 1; return acc; }, {});

  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)" }}>
      <Navbar />
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px" }} className="page-fade-in">
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: "1.8rem", marginBottom: 4 }}>Documents</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{center?.shopName} · Drop Box</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button className="btn btn-outline" onClick={fetchDocs} style={{ gap: 6 }}>
              <RefreshCw size={14} /> Refresh
            </button>
            <Link to="/qr-code" className="btn btn-primary" style={{ gap: 6 }}>
              <QrCode size={15} /> View QR Code
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Pending", count: counts.pending || 0, icon: <Clock size={18} />, color: "#f5c542" },
            { label: "Printing", count: counts.printing || 0, icon: <Printer size={18} />, color: "#60a5fa" },
            { label: "Printed", count: counts.printed || 0, icon: <CheckCircle size={18} />, color: "#2ecc71" },
            { label: "Total", count: docs.length, icon: <FileText size={18} />, color: "var(--text-muted)" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "20px 18px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700, fontFamily: "var(--font-display)", lineHeight: 1 }}>{s.count}</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 2 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {["all", "pending", "printing", "printed"].map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: "6px 16px", borderRadius: 100, fontSize: "0.83rem", fontWeight: 500,
              border: "1.5px solid", cursor: "pointer",
              borderColor: filter === f ? "var(--ink)" : "var(--border)",
              background: filter === f ? "var(--ink)" : "var(--white)",
              color: filter === f ? "white" : "var(--text-muted)",
            }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Documents list */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "var(--text-muted)" }}>
            <div className="loading-spinner" style={{ borderColor: "rgba(13,13,20,0.2)", borderTopColor: "var(--ink)", width: 28, height: 28, margin: "0 auto 12px" }} />
            Loading documents…
          </div>
        ) : docs.length === 0 ? (
          <div className="card" style={{ padding: "60px", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16 }}>📭</div>
            <h3 style={{ marginBottom: 8 }}>No documents yet</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Share your QR code with customers to start receiving documents.</p>
            <Link to="/qr-code" className="btn btn-primary" style={{ marginTop: 20, gap: 6 }}><QrCode size={15} /> Get QR Code</Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {docs.map((doc) => (
              <div key={doc._id} className="card" style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ fontSize: "1.8rem", flexShrink: 0 }}>
                  {doc.mimeType?.includes("pdf") ? "📄" : doc.mimeType?.includes("image") ? "🖼️" : "📝"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {doc.originalName}
                  </div>
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>👤 {doc.customerName}</span>
                    {doc.note && <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: 260, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>📋 {doc.note}</span>}
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>{formatBytes(doc.fileSize)}</span>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-light)" }}>🕒 {timeAgo(doc.createdAt)}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <span className={`badge badge-${doc.status}`}>{doc.status}</span>
                  <select
                    value={doc.status}
                    onChange={(e) => handleStatus(doc._id, e.target.value)}
                    style={{ fontSize: "0.8rem", padding: "5px 8px", borderRadius: 6, border: "1px solid var(--border)", background: "var(--surface)", cursor: "pointer", color: "var(--text-primary)" }}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button className="btn btn-outline" onClick={() => handleDownload(doc._id, doc.originalName)} style={{ padding: "7px 12px", gap: 5, fontSize: "0.82rem" }}>
                    <Download size={13} />
                  </button>
                  <button className="btn btn-danger" onClick={() => handleDelete(doc._id)} disabled={deletingId === doc._id} style={{ padding: "7px 12px" }}>
                    {deletingId === doc._id ? <span className="loading-spinner" style={{ width: 13, height: 13 }} /> : <Trash2 size={13} />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
