# 🏛️ System Architecture Document
## CropCare Digital Advisory Platform

- **Architecture Style**: Component-Based Single-Page Architecture (SPA) with Embedded Multi-Sync REST API Middleware
- **Version**: 2.0.0
- **Status**: Production Reference

---

## 1. High-Level System Architecture

The CropCare platform utilizes a modern, resilient multi-tier topology. It combines an embedded Connect/Express-compatible REST API server with Firebase Cloud Services and client-side reactive state management.

```mermaid
graph TB
    subgraph Client ["Client Layer (Browser / Mobile / Desktop)"]
        UI["React 18 SPA (Tailwind CSS, Lucide Icons)"]
        Router["React Router v6 with Role-Protected Guards"]
        AuthCtx["AuthContext (Session Token Engine)"]
        DataCtx["DataContext (On-Demand API Consumer)"]
        LangCtx["LanguageContext (EN / MR / HI)"]
        LocalStorage["LocalStorage (cropcare_auth_session)"]
        BroadcastBus["BroadcastChannel (Cross-Tab Realtime Bus)"]
    end

    subgraph Server ["Backend API Layer (Embedded Vite / Node Server)"]
        APIMiddleware["Vite Connect Middleware (/api/*)"]
        APIRouter["API Router & Request Dispatcher"]
        DataStore["In-Memory & File Data Store"]
        QueryFilter["On-Demand Query & Role-Filtering Engine"]
    end

    subgraph Cloud ["External Cloud Infrastructure"]
        FirebaseAuth["Firebase Authentication (Identity Provider)"]
        Firestore["Cloud Firestore (Real-Time NoSQL Database)"]
        FirebaseStorage["Firebase Storage (Blob / Crop Photos)"]
    end

    UI --> Router
    Router --> AuthCtx
    Router --> DataCtx
    AuthCtx <--> LocalStorage
    AuthCtx <--> FirebaseAuth
    DataCtx <--> BroadcastBus
    DataCtx --> APIMiddleware
    APIMiddleware --> APIRouter
    APIRouter --> QueryFilter
    QueryFilter --> DataStore
    DataCtx -.-> Firestore
```

---

## 2. Component Breakdown

### 2.1 Presentation & Application Layer (`src/`)
- **Pages**: Role-segregated views:
  - `src/pages/farmer/`: `FarmerDashboardPage`, `ReportProblemPage`, `MyProblemsPage`, `IssueDetailsPage`, `SavedSolutionsPage`, `FarmerProfilePage`.
  - `src/pages/expert/`: `ExpertDashboardPage`, `AssignedCasesPage`, `ExpertCaseReviewPage`, `ResearchCasesPage`, `ResearchCaseDetailsPage`, `ExpertProfilePage`.
  - `src/pages/admin/`: `AdminDashboardPage`, `ApproveResearchersPage`, `ManageUsersPage`, `ManageDepartmentsPage`, `ManageIssuesPage`, `ManageResearchPage`, `AdminAnalyticsPage`.
  - `src/pages/public/`: `HomePage`, `KnowledgeBasePage`, `KnowledgeArticleDetailsPage`, `AboutPage`, `ContactPage`.
  - `src/pages/auth/`: `LoginPage`, `AdminLoginPage`, `FarmerRegisterPage`, `ForgotPasswordPage`.
- **Protected Route Guard (`ProtectedRoute.jsx`)**:
  - Enforces role access (`Farmer`, `Agricultural Expert / Researcher`, `Agriculture Department Admin`).
  - Checks `authLoading && !currentUser` to prevent premature redirection during refresh.
  - Intercepts unapproved researchers with a verification status screen.
  - Automatically redirects authenticated users away from incorrect portals into their designated workspace.

---

## 3. Authentication & Session Token Lifecycle

CropCare features a custom **Cryptographic Session Token Engine** designed to solve hard refresh logouts and enforce strict role-based session limits:

### 3.1 Role Session Durations
```javascript
export const SESSION_DURATIONS = {
  'Farmer': 15 * 60 * 1000,                            // 15 Minutes (high turnover)
  'Agricultural Expert / Researcher': 15 * 60 * 1000,  // 15 Minutes (confidential prescriptions)
  'Agriculture Department Admin': 24 * 60 * 60 * 1000  // 24 Hours (command center shift)
};
```

### 3.2 Session Lifecycle Sequence

```mermaid
sequenceDiagram
    autonumber
    actor User as User (Farmer / Expert / Admin)
    participant UI as Login Page / Protected View
    participant Auth as AuthContext
    participant Storage as LocalStorage (cropcare_auth_session)
    participant Sentinel as Expiry Sentinel (5s Interval)
    participant Firebase as Firebase Auth

    User->>UI: Submit credentials (Email / Password)
    UI->>Firebase: signInWithEmailAndPassword()
    Firebase-->>UI: UserCredential (uid, email)
    UI->>Auth: login(email, password, role)
    Auth->>Auth: Generate token cctok_UUID and compute expiresAt
    Auth->>Storage: setItem(cropcare_auth_session, sessionData)
    Auth-->>UI: Resolve userProfile
    UI-->>User: Navigate to Dashboard

    Note over User,Storage: Browser Hard Refresh (F5 / Ctrl + F5)
    User->>UI: Page Reloads
    UI->>Auth: useState initialization
    Auth->>Storage: getStoredSession()
    Storage-->>Auth: Valid session (now < expiresAt)
    Auth->>Auth: Synchronously set currentUser = session.userProfile
    Auth-->>UI: Render authenticated view (0ms delay, no login flash)

    Note over Sentinel,UI: Periodic Check (Every 5 Seconds)
    Sentinel->>Storage: getStoredSession()
    alt now >= session.expiresAt
        Sentinel->>Storage: removeItem(cropcare_auth_session)
        Sentinel->>Firebase: signOut()
        Sentinel->>Auth: setCurrentUser(null)
        Sentinel-->>UI: Redirect to /login with "Session Expired" alert
    else now < session.expiresAt
        Sentinel->>Auth: Keep session active
    end
```

---

## 4. Backend REST API Architecture

The embedded API server runs natively through the Vite Connect middleware pipeline (`server/apiRouter.js`), with data stored in `server/data/store.js`.

### 4.1 On-Demand Data Delivery Model
Instead of subscribing the client to all collections in Firestore, the application queries endpoints tailored to specific contexts:

```mermaid
graph LR
    subgraph Heavy ["Old Monolithic Pattern (Inefficient)"]
        C1["Client"] -->|"Download All 1,000+ Issues"| DB1["Firestore"]
        C1 -->|"Download All Research Cases"| DB1
        C1 -->|"Download All Updates"| DB1
    end

    subgraph Optimized ["New CropCare REST Pattern (Efficient)"]
        C2["Client (Farmer)"] -->|"GET /api/dashboard/farmer?farmerId=123"| API["API Router"]
        API -->|"Returns 4 KPI stats + recent 5 cases"| C2
    end
```

### 4.2 Standard API Response Specification
All endpoints adhere to an enterprise REST contract:
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 42,
    "count": 10,
    "timestamp": "2026-10-11T13:00:00.000Z"
  }
}
```

Error response contract:
```json
{
  "success": false,
  "error": "Resource not found or unauthorized access."
}
```

---

## 5. Multi-Sync Data Resiliency Architecture

CropCare integrates a three-tier synchronization strategy:
1. **Primary REST API Layer**: Clean HTTP client for standard page loads and on-demand queries (`/api/*`).
2. **Cloud Firestore Sync**: Real-time cloud persistence when internet connectivity and Firebase services are active.
3. **BroadcastChannel Bus (`realtimeService`)**: Instant cross-tab event broadcasting (e.g., when an issue is reported in tab A, tab B updates immediately without hitting the network).

---

## 6. Security & Threat Mitigation Architecture

| Threat / Risk | Architectural Defense |
| :--- | :--- |
| **Session Hijacking** | Cryptographically secure tokens (`crypto.randomUUID()`) + automatic 15-minute expiration for field users. |
| **Privilege Escalation** | Two-tier role enforcement: Route-level guards in `ProtectedRoute.jsx` and server-level role verification. |
| **Cross-Site Scripting (XSS)** | React JSX auto-escaping, sanitized text nodes, and rejection of unsafe HTML rendering. |
| **Credential Phishing** | Clear visual separation between public portal (`/login`) and Directorate Administrative Access (`/admin/login`). |
| **Data Scraping** | Parameterized server-side pagination with maximum result boundaries on all collection queries. |
