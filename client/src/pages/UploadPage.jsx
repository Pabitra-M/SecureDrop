import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Upload, FileText, Image, FileIcon, X, CheckCircle, Plus } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const ACCEPTED_TYPES = ".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx";
const MAX_SIZE_MB = 10;
const MAX_FILES = 10;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon2({ type }) {
  if (type.includes("pdf")) return <span style={{ fontSize: "1.4rem" }}>📄</span>;
  if (type.includes("image")) return <span style={{ fontSize: "1.4rem" }}>🖼️</span>;
  return <span style={{ fontSize: "1.4rem" }}>📝</span>;
}

export default function UploadPage() {
  const { dropboxId } = useParams();
  const [shopInfo, setShopInfo] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [files, setFiles] = useState([]);
  const [drag, setDrag] = useState(false);
  const [form, setForm] = useState({ customerName: "", note: "" });
  const [loading, setLoading] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [done, setDone] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    axios.get(`/api/documents/center/${dropboxId}/info`)
      .then(({ data }) => setShopInfo(data))
      .catch(() => setNotFound(true));
  }, [dropboxId]);

  const addFiles = (incoming) => {
    const valid = [];
    Array.from(incoming).forEach((f) => {
      if (files.length + valid.length >= MAX_FILES) {
        toast.error(`Maximum ${MAX_FILES} files allowed`);
        return;
      }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) {
        toast.error(`"${f.name}" is too large. Max ${MAX_SIZE_MB}MB per file.`);
        return;
      }
      // avoid duplicates by name+size
      const isDup = files.some((x) => x.name === f.name && x.size === f.size);
      if (isDup) { toast.error(`"${f.name}" already added`); return; }
      valid.push(f);
    });
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleDrop = (e) => {
    e.preventDefault(); setDrag(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (files.length === 0) { toast.error("Please select at least one file"); return; }
    setLoading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("customerName", form.customerName);
      formData.append("note", form.note);
      const { data } = await axios.post(`/api/documents/upload/${dropboxId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadedCount(data.count);
      setDone(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ── NOT FOUND ── */
  if (notFound) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", padding: 24 }}>
      <div style={{ textAlign: "center", maxWidth: 360 }}>
        <div style={{ fontSize: "4rem", marginBottom: 16 }}>❌</div>
        <h2 style={{ marginBottom: 8 }}>Drop box not found</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>This QR code is invalid or has been removed. Please scan the correct QR code at the shop.</p>
      </div>
    </div>
  );

  /* ── SUCCESS ── */
  if (done) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", padding: 24 }} className="page-fade-in">
      <div className="card" style={{ padding: 48, textAlign: "center", maxWidth: 400, width: "100%" }}>
        <div style={{ width: 72, height: 72, background: "#d1fae5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <CheckCircle size={36} color="#065f46" />
        </div>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 10 }}>
          {uploadedCount} document{uploadedCount > 1 ? "s" : ""} sent!
        </h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 20 }}>
          Your {uploadedCount > 1 ? "documents have" : "document has"} been delivered to <strong>{shopInfo?.shopName}</strong>. They'll print {uploadedCount > 1 ? "them" : "it"} shortly.
        </p>
        <div style={{ background: "var(--surface)", borderRadius: 10, padding: "14px 18px", fontSize: "0.82rem", color: "var(--text-muted)", textAlign: "left", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", gap: 8 }}><span>🔒</span> Your phone number was never shared</div>
          <div style={{ display: "flex", gap: 8 }}><span>📧</span> Your email was never shared</div>
          <div style={{ display: "flex", gap: 8 }}><span>🗑️</span> Files auto-delete in 24 hours</div>
        </div>
        <button className="btn btn-outline" onClick={() => { setDone(false); setFiles([]); setForm({ customerName: "", note: "" }); }}
          style={{ marginTop: 24, width: "100%", justifyContent: "center" }}>
          Upload more documents
        </button>
      </div>
    </div>
  );

  /* ── MAIN FORM ── */
  return (
    <div style={{ minHeight: "100vh", background: "var(--surface)", padding: "24px 16px" }} className="page-fade-in">
      <div style={{ maxWidth: 480, margin: "0 auto" }}>

        {/* Shop header */}
        <div style={{ textAlign: "center", marginBottom: 28, paddingTop: 16 }}>
          <div style={{ width: 52, height: 52, background: "var(--ink)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: "1.5rem" }}>🏪</div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: 4 }}>{shopInfo?.shopName || "Loading…"}</h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Upload up to {MAX_FILES} documents · No account needed</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding: 24, marginBottom: 16 }}>

            {/* Drop zone */}
            <div
              onClick={() => files.length < MAX_FILES && fileRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              style={{
                border: `2px dashed ${drag ? "var(--ink)" : files.length > 0 ? "#2ecc71" : "var(--border-dark)"}`,
                borderRadius: 12, padding: files.length > 0 ? "16px 20px" : "32px 20px",
                textAlign: "center", cursor: files.length < MAX_FILES ? "pointer" : "default",
                background: drag ? "rgba(13,13,20,0.03)" : "var(--surface)",
                transition: "all 0.2s", marginBottom: files.length > 0 ? 16 : 0,
              }}>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPTED_TYPES}
                multiple
                style={{ display: "none" }}
                onChange={(e) => { addFiles(e.target.files); e.target.value = ""; }}
              />
              {files.length === 0 ? (
                <div>
                  <Upload size={32} style={{ color: "var(--text-light)", margin: "0 auto 12px", display: "block" }} />
                  <div style={{ fontWeight: 600, marginBottom: 6, fontSize: "0.95rem" }}>Tap to choose files</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>PDF, Image, Word · Max {MAX_SIZE_MB}MB each · Up to {MAX_FILES} files</div>
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <Plus size={16} />
                  {files.length < MAX_FILES ? `Add more files (${files.length}/${MAX_FILES})` : `Maximum ${MAX_FILES} files reached`}
                </div>
              )}
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {files.map((f, idx) => (
                  <div key={idx} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                    background: "var(--white)", border: "1px solid var(--border-light)",
                    borderRadius: 10, transition: "box-shadow 0.15s",
                  }}>
                    <FileIcon2 type={f.type} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatBytes(f.size)}</div>
                    </div>
                    <button type="button" onClick={() => removeFile(idx)}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", display: "flex", alignItems: "center", padding: 4, borderRadius: 6, transition: "color 0.15s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}>
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: 14 }}>
              <label className="form-label">Your Name (optional)</label>
              <input className="form-input" placeholder="e.g. Rahul" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} />
            </div>

            <div className="form-group">
              <label className="form-label">Print Instructions (optional)</label>
              <textarea className="form-input" rows={3} placeholder="e.g. 2 copies, black & white, double sided…"
                value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} style={{ resize: "vertical" }} />
            </div>
          </div>

          {/* Quick note presets */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
            {["2 copies", "Black & white", "Color print", "Single side", "Double side", "A4 size"].map((preset) => (
              <button key={preset} type="button"
                onClick={() => setForm((f) => ({ ...f, note: f.note ? f.note + ", " + preset : preset }))}
                style={{ padding: "5px 12px", borderRadius: 100, fontSize: "0.78rem", border: "1px solid var(--border-dark)", background: "var(--white)", cursor: "pointer", color: "var(--text-muted)", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.target.style.borderColor = "var(--ink)"; e.target.style.color = "var(--text-primary)"; }}
                onMouseLeave={(e) => { e.target.style.borderColor = "var(--border-dark)"; e.target.style.color = "var(--text-muted)"; }}>
                {preset}
              </button>
            ))}
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading || files.length === 0}
            style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", borderRadius: 10 }}>
            {loading
              ? <><span className="loading-spinner" /> Uploading {files.length} file{files.length > 1 ? "s" : ""}…</>
              : <><Upload size={16} /> Send {files.length > 1 ? `${files.length} Documents` : "Document"}</>
            }
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.78rem", color: "var(--text-light)", lineHeight: 1.6 }}>
          🔒 Your phone number and email are never stored or shared.<br />Documents auto-delete after 24 hours.
        </p>
      </div>
    </div>
  );
}
