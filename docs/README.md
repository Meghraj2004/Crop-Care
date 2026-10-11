# 🌾 CropCare Platform Documentation Portal

Welcome to the comprehensive technical and operational documentation suite for **CropCare** — an enterprise-grade digital agricultural advisory and scientific research platform designed for farmers, agricultural scientists, and state agriculture departments.

---

## 📚 Documentation Index

| Document | Description | Target Audience |
| :--- | :--- | :--- |
| [**1. Step-by-Step Setup Guide**](./SETUP_GUIDE.md) | Local installation, prerequisites, environment variables, Firebase setup, and running in development/production. | Developers, DevOps |
| [**2. Product Requirements Document (PRD)**](./PRD.md) | Vision, problem statement, user personas, functional specifications, feature roadmap, and KPIs. | Product Managers, Stakeholders |
| [**3. System Architecture Document**](./SYSTEM_ARCHITECTURE.md) | Multi-tier architecture, component topology, authentication & session engine, data flow, and Mermaid diagrams. | Solution Architects, Engineers |
| [**4. Complete REST API Reference**](./API_REFERENCE.md) | Detailed documentation of all `/api/*` endpoints, query parameters, request/response schemas, and status codes. | Frontend/Backend Engineers |
| [**5. Database Schema & Data Models**](./DATABASE_SCHEMA.md) | Firestore collections, entities, relationships, attributes, validation rules, and indexes. | Data Engineers, DBAs |
| [**6. Comprehensive User Manual**](./USER_MANUAL.md) | Step-by-step operation guide for Farmers, Agricultural Experts/Scientists, and Agriculture Department Admins. | End Users, Support Teams |
| [**7. Deployment & Operations Guide**](./DEPLOYMENT_GUIDE.md) | Production builds, Firebase Hosting, Vercel/Netlify, Docker/Node.js server, CI/CD pipeline, and security audit. | DevOps, SysAdmins |

---

## ⚡ Quick Start Summary

```bash
# 1. Clone the repository
git clone https://github.com/Meghraj2004/-Crop-Care.git
cd -Crop-Care

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your Firebase configuration credentials

# 4. Start Development Server (Vite + Embedded API Server)
npm run dev
# Accessible at http://localhost:3000
```

---

## 🏢 Platform Overview

CropCare bridges the critical gap between smallholder farmers facing emerging agricultural threats and scientific research institutions. It facilitates:
- **Instant crop pest & disease reporting** with multi-image support, geo-tagging, and district/taluka zoning.
- **Expert scientific diagnosis & treatment schedules** with chemical dosages and preventive measures.
- **Conversion to scientific research cases** for emerging or unknown pathogen strains.
- **Role-based session security**: 15-minute high-security sessions for Farmers/Experts, and 24-hour persistent oversight sessions for Department Admins.
- **Role-tailored REST API**: On-demand data fetching where each view receives strictly the data it needs.
