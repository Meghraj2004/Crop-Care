# FarmConnect (CropCare) Platform Walkthrough

**FarmConnect (CropCare)** is a farmer-friendly digital platform built with React, Vite, Tailwind CSS, and Firebase integration. It connects farmers directly with Agriculture Department officers, plant pathologists, entomologists, and soil scientists.

---

## 🌟 Key Accomplishments

### 1. Role-Based Access Control (RBAC) & Authentication
- **Roles Implemented**:
  - **Farmer**: Submit crop issues, track recovery timelines, save verified solutions.
  - **Agricultural Expert / Researcher**: Diagnose crop diseases, prescribe treatment protocols, publish verified solutions to KB, convert issues into research cases.
  - **Agriculture Department Admin**: Overview metrics, approve researcher credentials, manage departments and user accounts.
- **Quick Demo Role Switcher**: Interactive toolbar in top navigation bar for 1-click evaluation as **Farmer (Ramesh Patil)**, **Expert (Dr. Anil Sharma)**, or **Department Admin**.
- **Auth Pages**: Login, Farmer Registration, Researcher Registration (with mandatory Admin approval warning), and Forgot Password.

### 2. Farmer Portal & 6-Step Report Problem Wizard
- **Farmer Dashboard**: Overview cards (Total Reported, Open Cases, Under Review, Solved Cases, Research Cases), recent expert replies, weather widget.
- **6-Step Problem Report Wizard** (`/farmer/report-problem`):
  1. **Crop Info**: Crop Name, Category, Variety, Growth Stage, Date First Noticed.
  2. **Problem Symptoms**: Title, Category (9 options: Crop Disease, Pest Attack, Nutrient Deficiency, Weather Damage, Irrigation, Soil, Weed, Unknown, Other), large description textarea.
  3. **Photo Uploader**: Multi-image selector with client-side preview, file validation, removal, and client-side compression simulator with progress bar.
  4. **Farm Location**: District, Taluka, Village, optional GPS coordinates.
  5. **Tag Department**: Auto-suggests best department based on problem category (Plant Pathology, Entomology, Soil Science, Agronomy, Agricultural Engg, Extension).
  6. **Preview & Submit**: Generates Issue ID (e.g. `FC-1024`) and redirects to Issue Details page.
- **Issue Details & Recovery Timeline** (`/farmer/issues/:id`):
  - Visual status timeline stepper (`Submitted` → `Assigned` → `Under Review` → `Expert Responded` → `Farmer Updating` → `Resolved`).
  - Interactive **Farmer Progress Log** for adding entries (Day 1, Day 3, Day 6, Day 10) with condition selectors (*Improving*, *Same*, *Getting Worse*, *Resolved*).

### 3. Expert & Researcher Case Review Portal
- **Expert Dashboard** (`/expert/dashboard`): Analytics queue, priority filters (*High*, *Medium*, *Low*).
- **Expert Case Review** (`/expert/cases/:id`):
  - Inspect farmer symptoms, photos, and recovery timeline.
  - Submit official Diagnosis, Cause, Recommended Action, Treatment / Spraying Protocol, and Preventive Measures.
  - **Verified Solution Publishing**: Checkbox to publish verified treatment directly to the Public Knowledge Base.
  - **Convert to Research Case**: Escalates unresolved crop diseases into formal Research Cases (`RC-501`) for laboratory culture and trial studies.
- **Research Case Repository** (`/expert/research` & `/expert/research/:id`): Manage research lifecycle status (*Data Collection*, *Analysis*, *Solution Identified*, *Research Completed*).

### 4. Public Searchable Knowledge Base
- **Knowledge Base** (`/knowledge-base`): Searchable library of verified solutions with instant search autocomplete and filters by Crop, Problem Category, Department, and District Location.
- **Article Details** (`/knowledge/:id`): Full diagnosis, treatment, preventive advice, expert signature, and interactive **"Was this solution helpful?" (Yes/No)** voting buttons.

### 5. Department Admin Panel & Analytics
- **Admin Dashboard** (`/admin/dashboard`): System metrics, distribution breakdown charts (*Problems by Crop*, *Problems by Category*, *Regional Outbreaks by District*).
- **Researcher Approvals** (`/admin/researchers`): Admin verification panel to approve or reject pending scientist applications (e.g., Dr. Smita Patil).
- **User & Department Management** (`/admin/users`, `/admin/departments`).
- **Demo Data Reset** (`/admin/settings`): Reset database to initial clean demo state at any time during testing.

### 6. Weather & Multilingual Architecture
- **Local Weather Widget**: Displays temperature, humidity, rain probability, wind speed, and agricultural advisories for agricultural districts (*Jalgaon*, *Nashik*, *Pune*, *Ahmednagar*, *Nagpur*).
- **Multilingual Support**: Supports **English**, **Marathi (मराठी)**, and **Hindi (हिंदी)**.
- **Mobile-First Design**: Accessible large touch buttons, WCAG high contrast, floating mobile bottom navigation bar.

---

## 🚀 How to Run the Application

1. Open terminal in the project directory:
   ```bash
   cd "d:\MY PROJECTION\CropCare"
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open browser at `http://localhost:3000`.

---

## 🧪 Testing Guidelines

1. **Farmer Flow**:
   - Click **👨‍🌾 Farmer** on top toolbar.
   - Click **Report a Crop Problem**, complete the 6 steps, and submit.
   - On the Issue Details page, click **Add Progress Update** and submit a recovery entry.
2. **Expert Flow**:
   - Click **👨‍🔬 Expert** on top toolbar.
   - Open case `FC-1024` or `FC-1025`, fill in diagnosis and spray treatment, keep "Verified Solution" checked, and submit.
   - Navigate to `/knowledge-base` to view the newly published solution.
3. **Admin Flow**:
   - Click **🏛️ Admin** on top toolbar.
   - Navigate to **Approve Researchers** (`/admin/researchers`) and click **Approve Credentials** for Dr. Smita Patil.
