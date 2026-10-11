# 🚀 Production Deployment & Operations Guide
## CropCare Digital Agricultural Advisory Platform

This document describes how to deploy and operate the CropCare platform in staging and production environments across multiple cloud providers.

---

## 1. Production Build Preparation

Before deploying, create and test an optimized production bundle:

```bash
# 1. Clean prior builds
rm -rf dist

# 2. Compile and optimize production bundle
npm run build
```

This generates minified, tree-shaken static assets inside the `dist/` directory:
- `dist/index.html` (Entry single-page document)
- `dist/assets/index-*.js` (Application bundle with code splitting)
- `dist/assets/index-*.css` (Tailwind utility CSS bundle)

Preview locally before uploading:
```bash
npm run preview
```

---

## 2. Deployment Option A: Firebase Hosting (Recommended)

Because CropCare uses Firebase Authentication and Cloud Firestore, Firebase Hosting provides native integration, fast global SSD CDN edges, and zero-configuration SSL.

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Authenticate with Google Cloud
```bash
firebase login
```

### Step 3: Configure `firebase.json`
Verify that `firebase.json` contains single-page application URL rewrites:
```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000, immutable"
          }
        ]
      }
    ]
  }
}
```

### Step 4: Deploy
```bash
firebase deploy --only hosting
```
Your application will be live at `https://cropcare-21809.web.app` with an automated SSL certificate.

---

## 3. Deployment Option B: Vercel

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Configure `vercel.json`
Create a `vercel.json` in the root folder for SPA routing:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 3: Configure Environment Variables
In the Vercel Project Dashboard under **Settings > Environment Variables**, add:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### Step 4: Deploy
```bash
vercel --prod
```

---

## 4. Deployment Option C: Netlify

### Step 1: Configure `netlify.toml`
Create `netlify.toml` in the project root:
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Step 2: Deploy via Netlify CLI
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## 5. Deployment Option D: Docker & Self-Hosted Node.js Server

For enterprise on-premises installations or state government private cloud servers (NIC / MeitY data centers):

### 5.1 Dockerfile
Create `Dockerfile` in the root directory:
```dockerfile
# Multi-stage Docker build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
EXPOSE 3000

ENV PORT=3000
CMD ["node", "server/index.js"]
```

### 5.2 Build & Run Container
```bash
docker build -t cropcare-platform:2.0.0 .
docker run -d -p 3000:3000 --name cropcare-live cropcare-platform:2.0.0
```

---

## 6. Production Security Checklist

Prior to launching in a production environment:

- [x] **Firebase Security Rules**: Ensure `firestore.rules` enforces authenticated writes and disallows anonymous mass document modification.
- [x] **Environment Secrets**: Ensure production API keys and Firebase credentials are populated via secure CI/CD secrets (GitHub Actions / GitLab CI) rather than committed plain-text `.env` files.
- [x] **Session Expiration Guard**: Verify that 15-minute expiration (for Farmers & Experts) and 24-hour expiration (for Admins) are active in `AuthContext.jsx`.
- [x] **HTTPS Enforcement**: Ensure HTTP to HTTPS redirection is enforced at the CDN edge.
- [x] **CORS Configuration**: Verify API responses disallow wildcard origin access from untrusted external domains.
- [x] **Health Check Monitoring**: Configure monitoring alarms (e.g., UptimeRobot, Datadog, Prometheus) targeting `GET https://your-domain.gov.in/api/health`.

---

## 7. Automated CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:
```yaml
name: Production CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Build Application
        run: npm run build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}

      - name: Deploy to Firebase Hosting
        uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: cropcare-21809
```
