# 📋 Product Requirements Document (PRD)
## CropCare: Digital Agricultural Advisory & Scientific Research Platform

- **Product Name**: CropCare Digital Advisory
- **Version**: 2.0.0
- **Document Status**: Approved / Production
- **Target Launch**: Q4 2026

---

## 1. Executive Summary

Smallholder farmers in India suffer up to **30-40% crop yield loss** annually due to preventable pest attacks, fungal blights, and soil nutrient imbalances. Existing extension services rely on manual village visits, leading to delayed diagnoses (often 7–14 days after initial symptom appearance). When exotic or mutated pathogen strains emerge, field officers lack an escalation mechanism to route samples to state agricultural universities.

**CropCare** is a unified digital ecosystem connecting:
1. **Farmers** with instant advisory reporting, geo-tagged symptom logging, and prescriptive timelines.
2. **Agricultural Scientists & Researchers** with triage queues, diagnostic prescribing tools, and a mechanism to escalate unknown threats into formal research cases.
3. **State Agriculture Department Administrators** with territorial analytics, researcher accreditation, and departmental division governance.

---

## 2. Target User Personas

### Persona 1: Farmer (Ramesh Patil)
- **Profile**: 42-year-old cotton and tomato grower in Jalgaon, Maharashtra.
- **Pain Points**: Leaves showing unexplained brown concentric spots; agrochemical store recommendations often fail; needs advice in Marathi/Hindi; unreliable internet in field.
- **Goals**: Report symptoms with photographs from mobile phone; receive verified expert diagnosis within 24 hours; bookmark proven solutions for upcoming seasons.

### Persona 2: Agricultural Scientist / Expert (Dr. Anil Sharma)
- **Profile**: 48-year-old Senior Pathologist at State Agricultural University.
- **Pain Points**: Overwhelmed by repetitive pest queries; lacks structured field sample data; cannot easily escalate unknown disease outbreaks to lab PCR analysis.
- **Goals**: Review prioritized case queues filtered by crop and department; issue standardized chemical and biological treatment schedules; convert unusual symptoms into research projects.

### Persona 3: Agriculture Department Admin (Directorate Officer)
- **Profile**: State Director of Agricultural Extension & Quality Control.
- **Pain Points**: No real-time visibility into state-wide pest outbreaks; unverified self-proclaimed experts advising farmers; fragmented extension reports.
- **Goals**: Monitor real-time district outbreak heatmaps; verify credentials of state researchers; manage agricultural division resources.

---

## 3. Core Functional Requirements

### 3.1 Authentication & Session Security Engine
- **FR-AUTH-01 (Multi-Role Sign-In)**: Support three distinct roles: Farmer, Agricultural Expert / Researcher, and Agriculture Department Admin.
- **FR-AUTH-02 (Smart Auto-Detection)**: Auto-detect expert and admin emails upon typing and auto-switch tabs to eliminate user confusion.
- **FR-AUTH-03 (Role-Based Session Tokens)**:
  - **Farmer & Expert**: Strict **15-minute** session expiration window for enhanced security on shared village devices.
  - **Department Admin**: **24-hour** session duration for uninterrupted administrative command center operations.
- **FR-AUTH-04 (Hard-Refresh Persistence)**: Prevent unintended session destruction on browser reload (`Ctrl + F5`) by synchronously hydrating from verified local session token storage.
- **FR-AUTH-05 (Automatic Expiration Sentinel)**: Live background timer checking session expiry every 5 seconds. Automatically signs out the user upon expiration and presents a clear renewal prompt.

### 3.2 Farmer Problem Reporting & Case Timeline
- **FR-FARM-01 (Structured Issue Intake)**: Capture title, crop name, growth stage, first noticed date, category (Disease, Pest, Nutrient, Weather), symptoms description, photographs, district, taluka, village, and geo-coordinates.
- **FR-FARM-02 (Case Timeline Progression)**: Interactive progression steps: `Submitted` ➔ `Under Review` ➔ `Expert Responded` ➔ `Farmer Updating` ➔ `Resolved`.
- **FR-FARM-03 (Progress Updates)**: Allow farmers to log spray updates, condition changes, and follow-up photographs.
- **FR-FARM-04 (Saved Solutions)**: Bookmark verified solutions from the knowledge base for offline reference.

### 3.3 Expert Diagnosis & Research Escalation
- **FR-EXPT-01 (Triage Queue)**: Filter incoming cases by department (Pathology, Entomology, Soil Science, Agronomy), crop, and urgency.
- **FR-EXPT-02 (Standardized Prescription Form)**: Require scientific diagnosis, causal organism, immediate recommendation, step-by-step chemical/biological treatment, and preventive measures.
- **FR-EXPT-03 (Knowledge Base Publishing)**: Option to transform verified diagnosis into a public knowledge base article with 1 click.
- **FR-EXPT-04 (Research Case Escalation)**: Convert emerging or unresolved cases into scientific laboratory research cases with trial tracking, PCR notes, and interim conclusions.

### 3.4 Directorate Administration & Oversight
- **FR-ADMN-01 (Executive Analytics)**: Total issues, resolution percentage, pending expert approvals, active research cases, and departmental distribution.
- **FR-ADMN-02 (Researcher Verification Panel)**: Review scientist credentials, university affiliations, employee IDs, and grant/reject verified researcher badges.
- **FR-ADMN-03 (Department Divisions Management)**: Add, edit, and configure state agricultural divisions.

### 3.5 Role-Tailored REST API Layer
- **FR-API-01 (On-Demand Data Delivery)**: Discontinue monolithic full-database downloads. Each view requests only the required fields and entities via parameterized REST endpoints (`/api/issues?farmerId=...`, `/api/dashboard/admin`).
- **FR-API-02 (Standard Envelope Format)**: All responses return standardized format:
  ```json
  { "success": true, "data": ..., "meta": { "total": 10 } }
  ```

---

## 4. Non-Functional Requirements (NFR)

| Category | Requirement | Target Metric |
| :--- | :--- | :--- |
| **Performance** | API endpoint response time | `< 120 ms` for 95th percentile |
| **Page Load** | First Contentful Paint (FCP) | `< 1.2 seconds` on 4G networks |
| **Security** | Session token randomness | Cryptographically secure UUIDs (`cctok_*`) |
| **Availability** | Embedded API + Cloud resilience | `99.9%` uptime with local fallback |
| **Internationalization** | Multi-language support | English, Marathi (मराठी), Hindi (हिंदी) |
| **Mobile Responsiveness** | Touch-optimized layouts | Full viewport adaptation (360px to 4K) |

---

## 5. Success Metrics & Key Performance Indicators (KPIs)

1. **Diagnosis Turnaround Time (TAT)**: Reduce average time-to-treatment from 9 days to `< 18 hours`.
2. **Farmer Resolution Rate**: Maintain an issue resolution success rate of `> 85%`.
3. **Session Security Adherence**: 100% adherence to role session limits (15 min for Farmers/Experts, 24 hr for Admins) with zero session leaks.
4. **Knowledge Reuse**: 40% of reported problems resolved directly through the self-service Knowledge Base.
