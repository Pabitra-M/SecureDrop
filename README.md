# 📥 SecureDrop — QR-Based Document Drop Box for Xerox Centers

<div align="center">

![SecureDrop Banner](https://img.shields.io/badge/SecureDrop-v1.0.0-6c63ff?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**A privacy-first document sharing system for xerox & print shops.**  
Customers scan a QR code → upload documents → shop prints them. No phone number. No email. No login.

</div>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📲 **QR Code Drop Box** | Each shop gets a unique QR code to display at their counter |
| 🔒 **Anonymous Uploads** | Customers upload without sharing phone number or email |
| 📁 **Multi-File Upload** | Customers can upload up to **10 documents** in one go |
| 🗂️ **Document Dashboard** | Shop owner views, downloads, and manages all received files |
| 🔄 **Status Tracking** | Mark documents as Pending → Printing → Printed |
| 🗑️ **Auto-Delete** | MongoDB TTL automatically deletes documents after 24 hours |
| 🛡️ **File Validation** | Only PDF, images, Word docs allowed — executables blocked |
| 🔑 **JWT Auth** | Secure shop login with hashed passwords |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT + bcryptjs |
| **File Upload** | Multer (up to 10 files, 10MB each) |
| **QR Code** | `qrcode` npm package |
| **UI Fonts** | Syne + DM Sans (Google Fonts) |
| **Notifications** | react-hot-toast |
| **Icons** | lucide-react |

---

## 📁 Project Structure

```
secure-xerox-dropbox/
│
├── client/                        # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx    # Home / marketing page
│   │   │   ├── LoginPage.jsx      # Shop login
│   │   │   ├── RegisterPage.jsx   # Shop registration
│   │   │   ├── DashboardPage.jsx  # Document management
│   │   │   ├── QRCodePage.jsx     # QR code display & download
│   │   │   └── UploadPage.jsx     # Public upload page (customer-facing)
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state
│   │   ├── api.js                 # Axios instance
│   │   ├── App.jsx
│   │   └── index.css              # Global design system
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── server/                        # Node.js Backend (Express)
    ├── models/
    │   ├── XeroxCenter.js         # Shop schema
    │   └── Document.js            # Document schema (TTL enabled)
    ├── routes/
    │   ├── authRoutes.js          # Register / Login
    │   ├── centerRoutes.js        # Profile & QR code
    │   └── documentRoutes.js      # Upload, list, download, delete
    ├── middleware/
    │   ├── authMiddleware.js      # JWT verification
    │   └── uploadMiddleware.js    # Multer config & file validation
    ├── uploads/                   # Uploaded files (local, git-ignored)
    ├── .env.example               # Environment variable template
    ├── .env                       # Your secrets (never commit this!)
    ├── server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local installation **or** [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/secure-xerox-dropbox.git
cd secure-xerox-dropbox
```

---

### 2. Setup Backend

```bash
cd server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000

# Option A — Local MongoDB
MONGO_URI=mongodb://localhost:27017/xerox-dropbox

# Option B — MongoDB Atlas (recommended)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?appName=Cluster0

# Generate a strong secret key
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Frontend URL (update this when deploying)
CLIENT_URL=http://localhost:5173
```

---

### 3. Setup Frontend

```bash
cd ../client
npm install
```

---

### 4. Run Both Servers

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# ✅ MongoDB connected
# 🚀 Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# ➜ Local: http://localhost:5173/
```

---

### 5. Open the App

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Frontend app |
| http://localhost:5000/api/health | Backend health check |

---

## 📱 How to Use

### For Xerox Shop Owners

1. Go to **http://localhost:5173** and click **Get Started**
2. **Register** your shop (name, email, password)
3. Go to the **QR Code** page
4. Print or display the QR code at your shop counter
5. Open the **Dashboard** to see incoming documents
6. Download → Print → Mark as **Printed** → Delete

### For Customers

1. Visit the xerox shop and **scan the QR code**
2. The upload page opens in your browser — **no login needed**
3. Select up to **10 documents** (PDF, Image, or Word)
4. Add your name and print instructions (optional)
5. Tap **Send Documents** — done! ✅

---

## 📡 API Reference

### 🔓 Public Routes (no auth required)

```http
POST   /api/auth/register                      Register a new shop
POST   /api/auth/login                         Shop login

POST   /api/documents/upload/:dropboxId        Upload files (up to 10)
GET    /api/documents/center/:dropboxId/info   Get shop name for upload page
```

### 🔐 Protected Routes (JWT Bearer token required)

```http
GET    /api/center/profile                     Get shop profile
GET    /api/center/qr                          Get QR code image + upload URL

GET    /api/documents                          List all received documents
GET    /api/documents/:id/download             Download a document
PATCH  /api/documents/:id/status               Update status (pending/printing/printed)
DELETE /api/documents/:id                      Delete a document
```

---

## 🔒 Security

- ✅ Passwords hashed with **bcryptjs** (12 salt rounds)
- ✅ JWT tokens expire after **7 days**
- ✅ Executable files blocked (`.exe`, `.bat`, `.sh`, `.cmd`, `.msi`, `.php`, etc.)
- ✅ File size limited to **10MB per file**
- ✅ Only **PDF, JPEG, PNG, WebP, DOC, DOCX** allowed
- ✅ File paths **never exposed** in API responses
- ✅ Each shop can **only access their own documents**
- ✅ MongoDB **TTL index** auto-deletes documents after 24 hours
- ✅ `.env` secrets are git-ignored and never pushed to GitHub

---

## 🌐 Enabling Mobile / Phone Access (LAN)

To let customers scan the QR with their phone on the **same WiFi network**:

**1. Find your PC's local IP:**
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

**2. Edit `server/.env`:**
```env
CLIENT_URL=http://YOUR_LOCAL_IP:5173
```

**3. Edit `client/vite.config.js` — add `host: true`:**
```js
server: {
  port: 5173,
  host: true,   // ← add this line
  proxy: { ... }
}
```

> ⚠️ Revert these changes before pushing to GitHub. Your local IP changes on WiFi reconnect.

---

## 🚢 Deployment

When hosting on a real server (Render, Railway, Vercel, etc.):

1. Set `CLIENT_URL` in your backend hosting environment variables to your **actual frontend domain**
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
2. Set all other `.env` values (`MONGO_URI`, `JWT_SECRET`) in your hosting platform's environment settings
3. **Never** push your `.env` file to GitHub

---

## 🔮 Future Improvements

- [ ] Cloud storage (AWS S3 / Cloudinary) instead of local `uploads/`
- [ ] Email / SMS notification when a new document arrives
- [ ] File preview in the dashboard
- [ ] Print job payment integration
- [ ] PWA / Android app for customers
- [ ] Admin analytics panel
- [ ] End-to-end file encryption
- [ ] Malware scanning (ClamAV)
- [ ] Multiple shop branches under one account
- [ ] OTP token for customers to track their print job

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

<div align="center">
  Built with ❤️ for xerox shops and print centers
</div>
