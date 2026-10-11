# 🛠️ CropCare Setup & Installation Guide

This document provides a comprehensive, step-by-step technical guide for setting up, configuring, and running the **CropCare** platform on your local development machine or server.

---

## 1. System Requirements & Prerequisites

Before starting, ensure your system meets the following requirements:

| Tool | Minimum Version | Recommended Version | Check Command |
| :--- | :--- | :--- | :--- |
| **Node.js** | `v18.0.0` | `v20.x LTS` | `node -v` |
| **npm** | `v9.0.0` | `v10.x` | `npm -v` |
| **Git** | `v2.30.0` | Latest | `git --version` |
| **Browser** | Chromium 100+ / Firefox 100+ | Chrome / Edge / Brave | — |

---

## 2. Step-by-Step Installation

### Step 1: Clone the Repository
Clone the repository to your local directory:
```bash
git clone https://github.com/Meghraj2004/-Crop-Care.git
cd -Crop-Care
```

### Step 2: Install Node Dependencies
Install all required project packages using `npm`:
```bash
npm install
```
Key packages installed:
- `react`, `react-dom` (v18.3.1) - Frontend core
- `react-router-dom` (v6.26.1) - Single-page client routing
- `firebase` (v10.13.0) - Authentication & Firestore integration
- `lucide-react` (v0.439.0) - Icon system
- `tailwindcss` (v3.4.10), `postcss`, `autoprefixer` - Styling
- `vite` (v5.4.1) - Build tool and development server

---

## 3. Environment Variables Configuration

Create a local `.env` file from `.env.example`:
```bash
cp .env.example .env
```

Open `.env` in your text editor and fill in the Firebase credentials:

```env
# Server Port Configuration
PORT=3000

# Firebase Web App Credentials
VITE_FIREBASE_API_KEY="AIzaSyDUoPMaZ7IWSAXS6bwcaBduUXd_bm_mYGY"
VITE_FIREBASE_AUTH_DOMAIN="cropcare-21809.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="cropcare-21809"
VITE_FIREBASE_STORAGE_BUCKET="cropcare-21809.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="903701833417"
VITE_FIREBASE_APP_ID="1:903701833417:web:a5eb28a0a51aa0c27f0f18"
VITE_FIREBASE_MEASUREMENT_ID="G-MBLTT8EHHM"
```

> **Note**: The application includes built-in fallback configuration and an embedded REST API server, so development runs smoothly even if cloud services are offline.

---

## 4. Firebase Project Setup (Optional for Custom Deployments)

If you are connecting your own Firebase project:

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Click **Add project** and name it `cropcare`.
2. **Enable Authentication**:
   - Navigate to **Build > Authentication > Sign-in method**.
   - Enable **Email/Password**.
3. **Enable Cloud Firestore**:
   - Navigate to **Build > Firestore Database**.
   - Click **Create database** (Start in Test mode or configure rules).
   - Apply the rules in `firestore.rules`:
     ```javascript
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true; // Restrict in production
         }
       }
     }
     ```
4. **Deploy Firestore Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

---

## 5. Running the Application

### Start Development Server
Run Vite with the embedded API server:
```bash
npm run dev
```

Output:
```
  VITE v5.4.1  ready in 420 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

Open your browser and navigate to:
**`http://localhost:3000/`**

---

## 6. Verifying API Endpoints

The development server includes the REST API endpoints running on `/api`. Verify them using `curl` or PowerShell:

### Health Check:
```bash
curl http://localhost:3000/api/health
```
Expected output:
```json
{
  "success": true,
  "service": "CropCare Agricultural Advisory API",
  "version": "2.0.0"
}
```

### Admin Dashboard Stats:
```bash
curl http://localhost:3000/api/dashboard/admin
```

### Farmer Issues (On-Demand Filtered):
```bash
curl http://localhost:3000/api/issues?farmerId=usr_farmer_ramesh
```

---

## 7. Default Credentials for Testing

| Role | Email | Password | Access Portal |
| :--- | :--- | :--- | :--- |
| **Department Admin** | `admin123@gamil.com` | `admin@123` | `/admin/login` |
| **Plant Pathologist (Expert)** | `dr.anil.sharma@cropcare.gov.in` | `expert@123` | `/login` (Expert tab) |
| **Registered Farmer** | `ramesh.patil@cropcare.in` | `farmer@123` | `/login` (Farmer tab) |

---

## 8. Building for Production

To validate and create an optimized production bundle:
```bash
npm run build
```

The production assets will be output to the `dist/` directory:
- `dist/index.html`
- `dist/assets/*.js`
- `dist/assets/*.css`

To preview the production bundle locally:
```bash
npm run preview
```

---

## 9. Troubleshooting Common Issues

### Issue 1: Port 3000 Already in Use
**Symptom**: `Error: listen EADDRINUSE: address already in use :::3000`  
**Solution**: Either kill the process on port 3000 or change the port in `vite.config.js`:
```powershell
# Windows PowerShell command to find and kill process on port 3000:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### Issue 2: Hard Refresh / User Logout
**Symptom**: User gets logged out when pressing `Ctrl + F5`.  
**Solution**: This is already resolved by the session token engine in `src/context/AuthContext.jsx`. Verify that `localStorage` is not disabled or in private incognito strict storage wipe mode.

### Issue 3: Firebase Permission Denied
**Symptom**: Console warnings mentioning `permission-denied`.  
**Solution**: Click **Seed Sample Data** in the Admin Settings page (`/admin/settings`) or update your Firebase Firestore rules in the Firebase console to permit authenticated reads and writes.
