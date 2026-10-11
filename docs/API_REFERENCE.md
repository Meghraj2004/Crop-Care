# 📡 REST API Reference Specification
## CropCare Digital Advisory Platform

- **Base URL**: `/api` (or `http://localhost:3000/api`)
- **Protocol**: HTTP/1.1, HTTP/2
- **Format**: `application/json`
- **Authentication**: Optional Bearer token header (`Authorization: Bearer cctok_...`)

---

## 1. Global Response Envelopes

### Success Envelope (HTTP 200 / 201)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 12,
    "count": 10
  }
}
```

### Error Envelope (HTTP 400 / 404 / 500)
```json
{
  "success": false,
  "error": "Descriptive error message explaining the failure."
}
```

---

## 2. System Endpoints

### `GET /api/health`
Returns system operational status and API version.
- **Query Params**: None
- **Response `200 OK`**:
```json
{
  "success": true,
  "service": "CropCare Agricultural Advisory API",
  "version": "2.0.0",
  "timestamp": "2026-10-11T08:05:29.282Z"
}
```

---

## 3. Role-Specific Dashboard Endpoints

### `GET /api/dashboard/farmer`
Returns aggregated metrics and recent activity for a specific farmer.
- **Query Params**:
  - `farmerId` *(optional, string)*: Filter metrics strictly to this farmer ID.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalIssues": 1,
      "activeIssues": 0,
      "resolvedIssues": 1,
      "pendingReview": 0
    },
    "recentIssues": [
      {
        "id": "ISSUE-1791653114512",
        "title": "Anthropic Pauses Free Claude Startup Perks Days After Launch",
        "cropName": "Potato",
        "status": "Resolved",
        "createdAt": "2026-10-10T17:25:14.512Z"
      }
    ]
  }
}
```

---

### `GET /api/dashboard/expert`
Returns scientific triage counts and active research queues.
- **Query Params**:
  - `expertId` *(optional, string)*: Researcher ID.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "assignedCases": 4,
      "pendingReviewCount": 2,
      "diagnosesCompleted": 1,
      "activeResearchCases": 1
    },
    "priorityQueue": [ ... ],
    "recentResearch": [ ... ]
  }
}
```

---

### `GET /api/dashboard/admin`
Returns state-wide executive statistics and departmental breakdown.
- **Query Params**: None
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "stats": {
      "totalIssues": 4,
      "resolvedIssues": 1,
      "resolutionRate": 25,
      "pendingApprovals": 1,
      "totalResearchers": 2,
      "totalFarmers": 1,
      "totalDepartments": 6,
      "totalResearchCases": 1,
      "totalKnowledgeArticles": 2
    },
    "departmentBreakdown": [
      {
        "id": "dept_1",
        "name": "Plant Pathology",
        "code": "PATH",
        "issueCount": 3
      }
    ],
    "recentIssues": [ ... ]
  }
}
```

---

## 4. Issues & Advisory Case Endpoints

### `GET /api/issues`
Fetches a filtered list of reported crop problems.
- **Query Params**:
  - `farmerId` *(string)*: Restrict results to a single farmer.
  - `status` *(string)*: `Submitted` \| `Under Review` \| `Expert Responded` \| `Resolved` \| `Research Required`
  - `departmentId` *(string)*: Department ID.
  - `department` *(string)*: Department name.
  - `crop` *(string)*: Filter by crop name (e.g. `Potato`, `Tomato`).
  - `search` *(string)*: Text search matching title, crop, or issue ID.
  - `page` *(number)*: Page number (default: 1).
  - `limit` *(number)*: Number of items per page.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "ISSUE-1791653114512",
      "farmerId": "jkvaWP7toANu07LkOTLDSZHxsHG2",
      "farmerName": "Rohit Wagh",
      "farmerMobile": "Not provided",
      "title": "Anthropic Pauses Free Claude Startup Perks Days After Launch",
      "cropName": "Potato",
      "growthStage": "Flowering & Fruiting Stage",
      "category": "Pest Attack",
      "departmentName": "Plant Pathology",
      "assignedExpertName": "Dr. Rajesh Deshmukh (Senior Scientist)",
      "status": "Resolved",
      "priority": "High",
      "createdAt": "2026-10-10T17:25:14.512Z"
    }
  ],
  "meta": { "total": 1, "count": 1 }
}
```

---

### `GET /api/issues/:id`
Retrieves comprehensive details for an issue, including its complete chronological update timeline and expert diagnosis prescriptions.
- **Path Params**: `id` *(string)* - The Issue ID (e.g. `ISSUE-1791653114512`).
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": {
    "id": "ISSUE-1001",
    "title": "Severe Early Blight on Tomato Leaves",
    "cropName": "Tomato",
    "description": "Dark brown target-shaped concentric rings on lower foliage.",
    "images": ["https://images.unsplash.com/..."],
    "status": "Expert Responded",
    "timeline": [
      {
        "id": "upd_1001",
        "date": "2026-10-08",
        "description": "Problem first reported with photos.",
        "condition": "Initial"
      }
    ],
    "responses": [
      {
        "id": "resp_1001",
        "expertName": "Dr. Anil Sharma",
        "diagnosis": "Early Blight (Alternaria solani)",
        "treatment": "Spray Mancozeb 75 WP @ 2.5g/L."
      }
    ]
  }
}
```

---

### `POST /api/issues`
Submits a new problem report.
- **Request Body**:
```json
{
  "farmerId": "usr_farmer_ramesh",
  "farmerName": "Ramesh Patil",
  "farmerMobile": "9822014589",
  "title": "Yellow mosaic discoloration on Soybean foliage",
  "cropName": "Soybean",
  "growthStage": "Pod Development",
  "category": "Crop Disease",
  "description": "Irregular yellow patches spreading rapidly across leaves.",
  "images": ["https://..."],
  "state": "Maharashtra",
  "district": "Amravati",
  "taluka": "Achalpur",
  "village": "Paratwada",
  "department": "Plant Pathology",
  "priority": "High"
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "ISSUE-1005",
    "status": "Submitted",
    "createdAt": "2026-10-11T13:30:00.000Z"
  }
}
```

---

### `POST /api/issues/:id/updates`
Adds a progress update or spray response to an existing case.
- **Path Params**: `id` - Issue ID.
- **Request Body**:
```json
{
  "farmerId": "usr_farmer_ramesh",
  "description": "Applied first dose of recommended fungicide. Symptoms halted.",
  "condition": "Recovering",
  "image": "https://..."
}
```
- **Response `201 Created`**:
```json
{
  "success": true,
  "data": {
    "id": "upd_1728639200",
    "condition": "Recovering"
  }
}
```

---

## 5. Expert Diagnoses & Prescriptions

### `POST /api/expert-responses`
Issues an expert medical/scientific prescription for an issue.
- **Request Body**:
```json
{
  "issueId": "ISSUE-1002",
  "expertId": "EXP-101",
  "expertName": "Dr. Anil Sharma",
  "expertTitle": "Senior Plant Pathologist",
  "expertInstitution": "State Agricultural University",
  "diagnosis": "Downy Mildew (Plasmopara viticola)",
  "possibleCause": "Prolonged morning humidity (>90%) with cool nights.",
  "recommendation": "Prune congested foliage and apply targeted systemic fungicide.",
  "treatment": "Spray Metalaxyl 8% + Mancozeb 64% WP @ 2.5g/L immediately.",
  "prevention": "Ensure good canopy aeration; avoid late-evening sprinkler irrigation.",
  "publishToKb": true,
  "isResolved": false
}
```
- **Response `201 Created`**: Returns the saved response object and automatically advances the target issue status to `Expert Responded`.

---

## 6. Scientific Research Cases

### `GET /api/research-cases`
Returns laboratory and field research projects.
- **Query Params**: `status`, `crop`, `department`, `search`.
- **Response `200 OK`**:
```json
{
  "success": true,
  "data": [
    {
      "id": "RC-301",
      "title": "Atypical Sugarcane Red Rot Strain Resistance",
      "crop": "Sugarcane",
      "department": "Plant Pathology",
      "status": "Investigation Started",
      "startDate": "2026-09-26"
    }
  ]
}
```

### `POST /api/research-cases`
Converts an unresolved case into a formal research case.
- **Request Body**:
```json
{
  "issueId": "ISSUE-1003",
  "title": "Genetic Sequencing of Pyrethroid-Resistant Pink Bollworm",
  "crop": "Cotton",
  "department": "Entomology",
  "notes": "Larval survival noted despite 3x recommended pyrethroid applications.",
  "findings": "Preliminary bioassays indicate elevated esterase activity."
}
```
- **Response `201 Created`**: Creates `RC-302` and marks the related issue as `Research Required`.

---

## 7. Departments API

- **`GET /api/departments`**: Returns all 6 state divisions.
- **`POST /api/departments`**: Creates a new division (`{ name, code, description }`).
- **`DELETE /api/departments/:id`**: Deletes a division by ID.

---

## 8. Knowledge Base API

- **`GET /api/knowledge-base`**: Query by `category`, `crop`, `search`.
- **`GET /api/knowledge-base/:id`**: Single advisory details.
- **`POST /api/knowledge-base/:id/vote`**: Submits upvote/downvote (`{ isHelpful: true }`).

---

## 9. Users & Scientist Accreditation API

- **`GET /api/users?role=...&status=Pending`**: Retrieves pending researcher submissions.
- **`PATCH /api/users/:id/status`**: Updates status (`{ "status": "Approved" }`).
- **`DELETE /api/users/:id`**: Deletes user profile.
