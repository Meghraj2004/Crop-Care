# 📖 CropCare User Manual & Operations Guide
## A Comprehensive Field & Operations Manual for All User Roles

---

## Table of Contents
1. [General Navigation & Language Selector](#1-general-navigation--language-selector)
2. [Session Security & Login Rules](#2-session-security--login-rules)
3. [Farmer User Guide](#3-farmer-user-guide)
4. [Agricultural Expert & Researcher Guide](#4-agricultural-expert--researcher-guide)
5. [Agriculture Department Admin Guide](#5-agriculture-department-admin-guide)
6. [Frequently Asked Questions (FAQ)](#6-frequently-asked-questions-faq)

---

## 1. General Navigation & Language Selector

CropCare is accessible via standard web browsers on both smartphones and desktop computers.

### Multilingual Support (English, Marathi, Hindi)
- Look at the top navigation bar for the **Globe icon (🌐)** dropdown.
- Click and select your preferred language:
  - **English** (Default)
  - **मराठी (Marathi)** — Ideal for farmers across Maharashtra
  - **हिंदी (Hindi)** — Ideal for central agricultural regions
- The entire interface dynamically updates translations without reloading the page.

---

## 2. Session Security & Login Rules

CropCare implements strict security sessions tailored to the usage profile of each role:

| Role | Session Duration | Renewal Requirement | Intended Usage |
| :--- | :--- | :--- | :--- |
| **Farmer** | **15 Minutes** | Prompted to re-login after 15 min | Prevents unauthorized access on shared village/cyber-cafe devices. |
| **Expert / Researcher** | **15 Minutes** | Prompted to re-login after 15 min | Protects scientific integrity of certified prescriptions. |
| **Department Admin** | **24 Hours** | Renew once per day | Uninterrupted shift-long command center oversight. |

> **Pro Tip**: If you refresh the page (`Ctrl + F5` or `F5`), you will **NOT** be logged out, provided your 15-minute (or 24-hour) session is still within its active validity window.

---

## 3. Farmer User Guide

### 3.1 Creating a Farmer Account
1. Visit the home page and click **"Register as Farmer"** or navigate to `/register/farmer`.
2. Fill in the required fields:
   - **Full Name** (e.g., *Ramesh Patil*)
   - **10-Digit Mobile Number**
   - **State, District, Taluka, and Village**
   - **Email and Password**
3. Click **"Complete Farmer Registration"**. Your 15-minute secure session will begin immediately, and you will be directed to your dashboard.

### 3.2 Reporting a Crop Problem
1. From the navigation bar, click **"Report Problem"** (`/farmer/report-problem`).
2. Complete the step-by-step reporting form:
   - **Crop Name**: (e.g., Tomato, Cotton, Sugarcane, Soybean).
   - **Problem Title**: Short summary of what is visible on the crop.
   - **Growth Stage**: (e.g., Seedling, Vegetative, Flowering, Boll/Fruit Formation).
   - **Category**: Crop Disease, Insect Pest, Nutrient Deficiency, or Weather Damage.
   - **Detailed Description**: Note when symptoms appeared, weather conditions, and spread pattern.
   - **Photographs**: Upload clear, close-up photos of leaves, stems, or pests.
   - **Location**: Verify your detected District and Taluka.
3. Click **"Submit Problem Report"**. Your case is assigned a unique tracking ID (e.g., `ISSUE-1005`) and instantly routed to the state department triage desk.

### 3.3 Tracking Your Problem & Adding Follow-Up Updates
1. Navigate to **"My Cases"** (`/farmer/issues`).
2. Click on your case card to view the **Interactive Progress Timeline**:
   - `Submitted` ➔ `Assigned` ➔ `Expert Responded` ➔ `Farmer Updating` ➔ `Resolved`.
3. Once an expert responds, review the **Verified Treatment Schedule**:
   - Recommended chemical and biological dosages (e.g., *Mancozeb 75% WP @ 2.5 g/L*).
   - Protective steps and spray timing.
4. If you have applied the spray, click **"Add Timeline Update"**:
   - Select condition: *Recovering*, *Same*, or *Resolved*.
   - Add a follow-up note and photo to keep your assigned expert updated.

### 3.4 Browsing & Bookmarking Solutions
1. Click **"Knowledge Base"** (`/knowledge-base`).
2. Search by crop or disease name.
3. Click the **Bookmark (🔖)** icon on any article to save it to your **"Saved Solutions"** tab for offline reference.

---

## 4. Agricultural Expert & Researcher Guide

### 4.1 Applying for Researcher Accreditation
1. Navigate to the login page and choose the **"Expert / Researcher"** tab.
2. If registering as a new scientist, provide your:
   - Full Academic Name (e.g., *Dr. Sunita Deshmukh*)
   - University / Institution Affiliation (e.g., *ICAR / State Agri University*)
   - Department Specialization (e.g., *Plant Pathology, Entomology*)
   - Official Employee ID
3. Upon submission, your account enters **"Pending Verification"** status while the Agriculture Directorate verifies your academic credentials.

### 4.2 Reviewing & Diagnosing Farmer Cases
1. Access the **Expert Dashboard** (`/expert/dashboard`).
2. Review the **Triage Queue** of submitted cases.
3. Click on a case to open the diagnostic review form:
   - **Scientific Diagnosis**: Identify pathogen (e.g., *Alternaria solani*).
   - **Causal Factor**: Note environmental trigger (e.g., *High humidity >90%*).
   - **Prescribed Treatment**: Detail step-by-step fungicidal or biological dosage.
   - **Preventive Recommendations**: Cultural practices to avoid recurrence.
   - **Publish to Knowledge Base**: Check this box if this case is a prime advisory example for other farmers.
4. Click **"Submit Official Diagnosis"**. The farmer receives an instant notification.

### 4.3 Escalating to Laboratory Research Projects
When encountering unidentifiable symptoms, atypical resistance, or suspected new biotypes:
1. In the Case Review screen, click **"Escalate to Research Case"**.
2. Input preliminary trial hypotheses, sample collection notes, and proposed PCR/culturing protocols.
3. The case is converted into an active **Scientific Research Project** (`RC-300+`), visible under **"Research Hub"** (`/expert/research`).

---

## 5. Agriculture Department Admin Guide

### 5.1 Directorate Administrator Login
- Navigate to `/admin/login` (Restricted Directorate Portal).
- Enter official credentials:
  - **Email**: `admin123@gamil.com`
  - **Password**: `admin@123`
- *Automatic 24-hour command session starts.*

### 5.2 Outbreak Analytics & Heatmap
- Access `/admin/dashboard` to monitor:
  - Total reported cases and statewide resolution percentage.
  - Active research projects across universities.
  - Case density distribution per agricultural division (Plant Pathology, Entomology, Agronomy).

### 5.3 Approving Certified Researchers
1. Navigate to **"Approve Researchers"** (`/admin/researchers`).
2. Review pending scientist applications, verify university credentials and institutional affiliation.
3. Click **"Approve & Grant Verified Badge"** to unlock their diagnostic portal, or **"Reject"** if credentials cannot be substantiated.

### 5.4 Division & Platform Administration
- **Manage Divisions** (`/admin/departments`): Add or adjust state agricultural divisions.
- **Admin Settings** (`/admin/settings`): Seed or reset reference baseline data directly into Firestore.

---

## 6. Frequently Asked Questions (FAQ)

**Q1: What happens when my 15-minute session ends?**  
*A*: You will see an amber banner: *"Your 15-minute session has expired for security. Please sign in again."* Simply re-enter your password to continue without losing any saved data.

**Q2: Can I report a problem if I don't know the exact disease?**  
*A*: Yes! Just describe the visible symptoms (e.g., "curling yellow leaves") and attach a photo. Your assigned plant pathologist will make the scientific diagnosis.

**Q3: Are treatment recommendations certified?**  
*A*: Yes. Every prescription carries the verified credentials and institution of the accredited agricultural researcher who diagnosed the case.
