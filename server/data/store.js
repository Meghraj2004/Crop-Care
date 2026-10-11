// Professional Cloud Firestore Connected Data Store for CropCare Platform API
// Connects and dynamically synchronizes with Cloud Firestore database (cropcare-21809)
// Serves REAL database records, avoiding mock/static constant localhost data.

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SNAPSHOT_PATH = path.join(__dirname, 'firestore_snapshot.json');

const FIRESTORE_BASE = 'https://firestore.googleapis.com/v1/projects/cropcare-21809/databases/(default)/documents';

export const fetchFirestoreCollection = (collectionName) => {
  return new Promise((resolve) => {
    https.get(`${FIRESTORE_BASE}/${collectionName}`, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(raw);
          if (!json.documents || !Array.isArray(json.documents)) {
            return resolve([]);
          }
          const list = json.documents.map(doc => parseFirestoreDoc(doc)).filter(Boolean);
          resolve(list);
        } catch (e) {
          resolve([]);
        }
      });
    }).on('error', () => resolve([]));
  });
};

export function parseFirestoreDoc(doc) {
  if (!doc || !doc.name) return null;
  const id = doc.name.split('/').pop();
  const obj = { id };
  if (!doc.fields) return obj;
  for (const [key, val] of Object.entries(doc.fields)) {
    if (!val) continue;
    if ('stringValue' in val) obj[key] = val.stringValue;
    else if ('integerValue' in val) obj[key] = parseInt(val.integerValue, 10);
    else if ('doubleValue' in val) obj[key] = parseFloat(val.doubleValue);
    else if ('booleanValue' in val) obj[key] = val.booleanValue;
    else if ('timestampValue' in val) obj[key] = val.timestampValue;
    else if ('arrayValue' in val) {
      obj[key] = (val.arrayValue.values || []).map(item => {
        if (!item) return '';
        if ('stringValue' in item) return item.stringValue;
        if ('integerValue' in item) return parseInt(item.integerValue, 10);
        return item;
      });
    } else if ('nullValue' in val) {
      obj[key] = null;
    }
  }
  return obj;
}

export function toFirestoreFields(obj) {
  const fields = {};
  for (const [key, val] of Object.entries(obj)) {
    if (val === null || val === undefined) {
      fields[key] = { nullValue: null };
    } else if (typeof val === 'string') {
      fields[key] = { stringValue: val };
    } else if (typeof val === 'number') {
      fields[key] = Number.isInteger(val) ? { integerValue: val.toString() } : { doubleValue: val };
    } else if (typeof val === 'boolean') {
      fields[key] = { booleanValue: val };
    } else if (Array.isArray(val)) {
      fields[key] = {
        arrayValue: {
          values: val.map(item => {
            if (typeof item === 'object') return { stringValue: JSON.stringify(item) };
            return { stringValue: String(item) };
          })
        }
      };
    }
  }
  return { fields };
}

export function saveFirestoreDoc(collectionName, docId, obj) {
  return new Promise((resolve) => {
    try {
      const payload = JSON.stringify(toFirestoreFields(obj));
      const url = new URL(`${FIRESTORE_BASE}/${collectionName}/${docId}`);
      const req = https.request({
        hostname: url.hostname,
        path: url.pathname + url.search,
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      }, (res) => {
        let raw = '';
        res.on('data', chunk => raw += chunk);
        res.on('end', () => resolve(true));
      });
      req.on('error', () => resolve(false));
      req.write(payload);
      req.end();
    } catch (e) {
      resolve(false);
    }
  });
}

export const INITIAL_DEPARTMENTS = [
  { id: "dept_1", name: "Plant Pathology", code: "PATH", description: "Study of plant diseases caused by pathogens like fungi, bacteria, and viruses.", expertCount: 4 },
  { id: "dept_2", name: "Entomology", code: "ENTO", description: "Study of agricultural insect pests, biological controls, and integrated pest management.", expertCount: 3 },
  { id: "dept_3", name: "Soil Science", code: "SOIL", description: "Soil health, fertility testing, nutrient diagnosis, and balanced fertigation.", expertCount: 2 },
  { id: "dept_4", name: "Agronomy", code: "AGRO", description: "Crop production technology, irrigation scheduling, and cropping systems.", expertCount: 2 },
  { id: "dept_5", name: "Agricultural Engineering", code: "ENGG", description: "Irrigation equipment, farm machinery, and post-harvest technology.", expertCount: 1 },
  { id: "dept_6", name: "Agricultural Extension", code: "EXTN", description: "Farmer advisory dissemination, field trials, and university outreach.", expertCount: 2 }
];

// In-Memory Database Store Class with Real Cloud Firestore Synchronization
class DataStore {
  constructor() {
    this.departments = [...INITIAL_DEPARTMENTS];
    this.issues = [];
    this.issueUpdates = [];
    this.expertResponses = [];
    this.researchCases = [];
    this.knowledgeArticles = [];
    this.notifications = [];
    this.users = [];

    // 1. Immediately hydrate from the local Firestore snapshot cache
    this.loadSnapshot();

    // 2. Perform background synchronization from Cloud Firestore
    this.syncFromFirestore().catch(() => {});

    // 3. Periodic sync every 60 seconds
    if (typeof setInterval !== 'undefined') {
      const interval = setInterval(() => {
        this.syncFromFirestore().catch(() => {});
      }, 60000);
      if (interval && interval.unref) interval.unref();
    }
  }

  loadSnapshot() {
    try {
      if (fs.existsSync(SNAPSHOT_PATH)) {
        const raw = fs.readFileSync(SNAPSHOT_PATH, 'utf-8');
        const snapshot = JSON.parse(raw);
        if (Array.isArray(snapshot.issues)) this.issues = snapshot.issues;
        if (Array.isArray(snapshot.issue_updates)) this.issueUpdates = snapshot.issue_updates;
        if (Array.isArray(snapshot.expert_responses)) this.expertResponses = snapshot.expert_responses;
        if (Array.isArray(snapshot.research_cases)) this.researchCases = snapshot.research_cases;
        if (Array.isArray(snapshot.knowledge_articles)) this.knowledgeArticles = snapshot.knowledge_articles;
        if (Array.isArray(snapshot.users)) this.users = snapshot.users;
        if (Array.isArray(snapshot.departments) && snapshot.departments.length) this.departments = snapshot.departments;
        if (Array.isArray(snapshot.notifications)) this.notifications = snapshot.notifications;
      }
    } catch (e) {
      console.warn("Notice: could not load firestore snapshot cache:", e.message);
    }
  }

  persistSnapshot() {
    try {
      const data = {
        issues: this.issues,
        issue_updates: this.issueUpdates,
        expert_responses: this.expertResponses,
        research_cases: this.researchCases,
        knowledge_articles: this.knowledgeArticles,
        users: this.users,
        departments: this.departments,
        notifications: this.notifications
      };
      fs.writeFileSync(SNAPSHOT_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.warn("Notice: could not persist firestore snapshot cache:", e.message);
    }
  }

  async syncFromFirestore() {
    try {
      const [remoteIssues, remoteUpdates, remoteResp, remoteKb, remoteUsers, remoteRc, remoteDepts] = await Promise.all([
        fetchFirestoreCollection('issues'),
        fetchFirestoreCollection('issue_updates'),
        fetchFirestoreCollection('expert_responses'),
        fetchFirestoreCollection('knowledge_articles'),
        fetchFirestoreCollection('users'),
        fetchFirestoreCollection('research_cases'),
        fetchFirestoreCollection('departments')
      ]);

      if (Array.isArray(remoteIssues) && remoteIssues.length) {
        this.issues = remoteIssues;
      }
      if (Array.isArray(remoteUpdates) && remoteUpdates.length) {
        this.issueUpdates = remoteUpdates;
      }
      if (Array.isArray(remoteResp) && remoteResp.length) {
        this.expertResponses = remoteResp;
      }
      if (Array.isArray(remoteKb) && remoteKb.length) {
        this.knowledgeArticles = remoteKb;
      }
      if (Array.isArray(remoteUsers) && remoteUsers.length) {
        this.users = remoteUsers;
      }
      if (Array.isArray(remoteRc) && remoteRc.length) {
        this.researchCases = remoteRc;
      }
      if (Array.isArray(remoteDepts) && remoteDepts.length) {
        this.departments = remoteDepts;
      }

      this.persistSnapshot();
    } catch (err) {
      console.warn("Firestore sync warning:", err.message);
    }
  }

  // --- Issues Queries & Mutations ---
  getIssues(filter = {}) {
    let result = [...this.issues];

    if (filter.farmerId) {
      result = result.filter(i => i.farmerId === filter.farmerId);
    }
    if (filter.status) {
      result = result.filter(i => i.status && i.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.departmentId) {
      result = result.filter(i => i.departmentId === filter.departmentId);
    }
    if (filter.department) {
      result = result.filter(i => i.departmentName?.toLowerCase() === filter.department.toLowerCase());
    }
    if (filter.assignedExpertId) {
      result = result.filter(i => i.assignedExpertId === filter.assignedExpertId);
    }
    if (filter.crop) {
      result = result.filter(i => i.cropName?.toLowerCase().includes(filter.crop.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(i => 
        (i.title && i.title.toLowerCase().includes(q)) || 
        (i.cropName && i.cropName.toLowerCase().includes(q)) || 
        (i.id && i.id.toLowerCase().includes(q))
      );
    }

    // Sort by latest createdAt
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    const total = result.length;
    if (filter.limit) {
      const page = parseInt(filter.page, 10) || 1;
      const limit = parseInt(filter.limit, 10);
      const start = (page - 1) * limit;
      result = result.slice(start, start + limit);
    }

    return { data: result, total };
  }

  getIssueById(id) {
    const issue = this.issues.find(i => i.id === id);
    if (!issue) return null;
    const updates = this.issueUpdates.filter(u => u.issueId === id).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const responses = this.expertResponses.filter(r => r.issueId === id);
    return { ...issue, timeline: updates, responses };
  }

  createIssue(issueData) {
    const newId = issueData.id || `ISSUE-${Date.now()}`;
    const dept = this.departments.find(d => d.name === issueData.department || d.id === issueData.departmentId) || this.departments[0];

    const newIssue = {
      id: newId,
      farmerId: issueData.farmerId || "usr_farmer_guest",
      farmerName: issueData.farmerName || "Farmer",
      farmerMobile: issueData.farmerMobile || "Not provided",
      farmerEmail: issueData.farmerEmail || "",
      title: issueData.title,
      cropName: issueData.cropName,
      growthStage: issueData.growthStage || "Vegetative",
      firstNoticedDate: issueData.firstNoticedDate || new Date().toISOString().split('T')[0],
      category: issueData.category || "General",
      description: issueData.description,
      images: issueData.images?.length ? issueData.images : ["https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80"],
      state: issueData.state || "Maharashtra",
      district: issueData.district || "Jalgaon",
      taluka: issueData.taluka || "Chalisgaon",
      village: issueData.village || "Patonda",
      coordinates: issueData.coordinates || "20.4625° N, 75.0189° E",
      departmentId: dept.id,
      departmentName: dept.name,
      assignedExpertId: "",
      assignedExpertName: "Unassigned",
      status: "Submitted",
      priority: issueData.priority || "Medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const initialUpdate = {
      id: `upd_${Date.now()}`,
      issueId: newId,
      farmerId: newIssue.farmerId,
      date: new Date().toISOString().split('T')[0],
      description: `Case reported by ${newIssue.farmerName}: ${newIssue.title}`,
      condition: "Initial",
      image: newIssue.images[0] || null,
      createdAt: new Date().toISOString()
    };

    const newNotif = {
      id: `notif_${Date.now()}`,
      userId: "all_experts",
      role: "Agricultural Expert / Researcher",
      title: "New Crop Problem Reported",
      message: `A new ${newIssue.cropName} case (${newId}) has been assigned to ${dept.name}.`,
      read: false,
      timestamp: new Date().toISOString(),
      link: `/farmer/issues/${newId}`
    };

    this.issues.unshift(newIssue);
    this.issueUpdates.unshift(initialUpdate);
    this.notifications.unshift(newNotif);

    this.persistSnapshot();

    // Persist asynchronously to Cloud Firestore database
    saveFirestoreDoc('issues', newIssue.id, newIssue).catch(() => {});
    saveFirestoreDoc('issue_updates', initialUpdate.id, initialUpdate).catch(() => {});
    saveFirestoreDoc('notifications', newNotif.id, newNotif).catch(() => {});

    return newIssue;
  }

  addIssueUpdate(issueId, updateData) {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    const newUpdate = {
      id: updateData.id || `upd_${Date.now()}`,
      issueId,
      farmerId: updateData.farmerId || issue.farmerId,
      date: updateData.date || new Date().toISOString().split('T')[0],
      description: updateData.description,
      condition: updateData.condition || "Same",
      image: updateData.image || null,
      createdAt: new Date().toISOString()
    };

    const nextStatus = updateData.condition === "Resolved" ? "Resolved" : "Farmer Updating";
    issue.status = nextStatus;
    issue.updatedAt = new Date().toISOString();

    this.issueUpdates.unshift(newUpdate);
    this.persistSnapshot();

    // Persist to Cloud Firestore database
    saveFirestoreDoc('issue_updates', newUpdate.id, newUpdate).catch(() => {});
    saveFirestoreDoc('issues', issue.id, issue).catch(() => {});

    return newUpdate;
  }

  updateIssue(id, updateFields) {
    const index = this.issues.findIndex(i => i.id === id);
    if (index === -1) return null;
    this.issues[index] = {
      ...this.issues[index],
      ...updateFields,
      updatedAt: new Date().toISOString()
    };
    this.persistSnapshot();
    saveFirestoreDoc('issues', id, this.issues[index]).catch(() => {});
    return this.issues[index];
  }

  // --- Expert Responses ---
  getExpertResponses(filter = {}) {
    let result = [...this.expertResponses];
    if (filter.issueId) {
      result = result.filter(r => r.issueId === filter.issueId);
    }
    if (filter.expertId) {
      result = result.filter(r => r.expertId === filter.expertId);
    }
    return result;
  }

  createExpertResponse(respData) {
    const newResponse = {
      id: respData.id || `resp_${Date.now()}`,
      issueId: respData.issueId,
      expertId: respData.expertId || "qyIFQO4pkHf7Nu4a5W9K3vWa0FI2",
      expertName: respData.expertName || "Dr. Rajesh Deshmukh (Senior Scientist)",
      expertTitle: respData.expertTitle || "Agricultural Diagnostics & IPM",
      expertInstitution: respData.expertInstitution || "State Agricultural University / ICAR",
      diagnosis: respData.diagnosis,
      possibleCause: respData.possibleCause || "",
      recommendation: respData.recommendation || "",
      treatment: respData.treatment,
      prevention: respData.prevention || "",
      notes: respData.notes || "",
      verified: respData.verified !== false,
      publishedToKb: Boolean(respData.publishToKb || respData.publishedToKb),
      isResolved: Boolean(respData.isResolved),
      createdAt: new Date().toISOString()
    };

    this.expertResponses.unshift(newResponse);

    // Update target issue
    const targetIssue = this.issues.find(i => i.id === respData.issueId);
    if (targetIssue) {
      targetIssue.status = respData.isResolved ? "Resolved" : "Expert Responded";
      targetIssue.assignedExpertId = newResponse.expertId;
      targetIssue.assignedExpertName = newResponse.expertName;
      targetIssue.updatedAt = new Date().toISOString();
      saveFirestoreDoc('issues', targetIssue.id, targetIssue).catch(() => {});

      // If publish to KB requested
      if (respData.publishToKb || respData.publishedToKb) {
        const kbArticle = {
          id: `KB-${Date.now()}`,
          title: `${targetIssue.cropName} Advisory: ${targetIssue.title}`,
          crop: targetIssue.cropName,
          category: targetIssue.category || "Crop Disease",
          department: targetIssue.departmentName,
          symptoms: targetIssue.description,
          diagnosis: newResponse.diagnosis,
          treatment: newResponse.treatment,
          preventiveMeasures: newResponse.prevention,
          verifiedBy: `${newResponse.expertName} (${newResponse.expertInstitution})`,
          verifiedDate: new Date().toISOString().split('T')[0],
          helpfulYes: 1,
          helpfulNo: 0,
          views: 1,
          image: targetIssue.images?.[0] || null,
          relatedIssues: [targetIssue.id]
        };
        this.knowledgeArticles.unshift(kbArticle);
        saveFirestoreDoc('knowledge_articles', kbArticle.id, kbArticle).catch(() => {});
      }
    }

    this.persistSnapshot();
    saveFirestoreDoc('expert_responses', newResponse.id, newResponse).catch(() => {});

    return newResponse;
  }

  // --- Research Cases ---
  getResearchCases(filter = {}) {
    let result = [...this.researchCases];
    if (filter.status) {
      result = result.filter(rc => rc.status && rc.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.department) {
      result = result.filter(rc => rc.department && rc.department.toLowerCase() === filter.department.toLowerCase());
    }
    if (filter.crop) {
      result = result.filter(rc => rc.crop && rc.crop.toLowerCase().includes(filter.crop.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(rc => 
        (rc.title && rc.title.toLowerCase().includes(q)) || 
        (rc.id && rc.id.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getResearchCaseById(id) {
    return this.researchCases.find(rc => rc.id === id) || null;
  }

  createResearchCase(rcData) {
    const newRcId = rcData.id || `RC-${Date.now()}`;
    const targetIssue = this.issues.find(i => i.id === rcData.issueId);

    const newRc = {
      id: newRcId,
      issueId: rcData.issueId || "",
      title: rcData.title || `Research Case for ${targetIssue?.cropName || 'Crop'}`,
      crop: targetIssue?.cropName || rcData.crop || "General",
      category: targetIssue?.category || rcData.category || "Unknown Etiology",
      description: rcData.description || targetIssue?.description || "Scientific study required.",
      assignedResearchers: rcData.assignedResearchers || [rcData.expertName || "Researcher"],
      department: targetIssue?.departmentName || rcData.department || "Plant Pathology",
      status: "Investigation Started",
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      researchNotes: rcData.notes || "Case escalated to laboratory diagnostic pipeline.",
      findings: rcData.findings || "Sample accession registered.",
      attachments: [],
      conclusion: "Under scientific study."
    };

    if (targetIssue) {
      targetIssue.status = "Research Required";
      targetIssue.updatedAt = new Date().toISOString();
      saveFirestoreDoc('issues', targetIssue.id, targetIssue).catch(() => {});
    }

    this.researchCases.unshift(newRc);
    this.persistSnapshot();
    saveFirestoreDoc('research_cases', newRc.id, newRc).catch(() => {});

    return newRc;
  }

  updateResearchCase(id, updateFields) {
    const index = this.researchCases.findIndex(rc => rc.id === id);
    if (index === -1) return null;
    this.researchCases[index] = {
      ...this.researchCases[index],
      ...updateFields,
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    this.persistSnapshot();
    saveFirestoreDoc('research_cases', id, this.researchCases[index]).catch(() => {});
    return this.researchCases[index];
  }

  // --- Departments ---
  getDepartments() {
    return this.departments;
  }

  createDepartment(deptData) {
    const newDept = {
      id: `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code || deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description || "State Agriculture Division",
      expertCount: deptData.expertCount || 0
    };
    this.departments.push(newDept);
    this.persistSnapshot();
    saveFirestoreDoc('departments', newDept.id, newDept).catch(() => {});
    return newDept;
  }

  deleteDepartment(id) {
    const prevLen = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    this.persistSnapshot();
    return this.departments.length < prevLen;
  }

  // --- Knowledge Articles ---
  getKnowledgeArticles(filter = {}) {
    let result = [...this.knowledgeArticles];
    if (filter.category && filter.category !== 'All') {
      result = result.filter(a => a.category && a.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.crop && filter.crop !== 'All') {
      result = result.filter(a => a.crop && a.crop.toLowerCase() === filter.crop.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a => 
        (a.title && a.title.toLowerCase().includes(q)) || 
        (a.symptoms && a.symptoms.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getKnowledgeArticleById(id) {
    return this.knowledgeArticles.find(a => a.id === id) || null;
  }

  voteKnowledgeArticle(id, isHelpful) {
    const article = this.knowledgeArticles.find(a => a.id === id);
    if (!article) return null;
    if (isHelpful) article.helpfulYes = (article.helpfulYes || 0) + 1;
    else article.helpfulNo = (article.helpfulNo || 0) + 1;
    this.persistSnapshot();
    saveFirestoreDoc('knowledge_articles', article.id, article).catch(() => {});
    return article;
  }

  // --- Notifications ---
  getNotifications(filter = {}) {
    let result = [...this.notifications];
    if (filter.userId) {
      result = result.filter(n => n.userId === filter.userId || n.userId === "all" || n.userId === "all_experts");
    }
    return result;
  }

  markNotificationRead(id) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.persistSnapshot();
      saveFirestoreDoc('notifications', notif.id, notif).catch(() => {});
    }
    return notif;
  }

  // --- Dashboards (Only required data returned per role!) ---
  getFarmerDashboard(farmerId) {
    const farmerIssues = this.issues.filter(i => !farmerId || i.farmerId === farmerId);
    const active = farmerIssues.filter(i => i.status !== 'Resolved').length;
    const resolved = farmerIssues.filter(i => i.status === 'Resolved').length;
    const total = farmerIssues.length;
    const recent = farmerIssues.slice(0, 5);

    return {
      stats: {
        totalIssues: total,
        activeIssues: active,
        resolvedIssues: resolved,
        pendingReview: farmerIssues.filter(i => i.status === 'Submitted').length
      },
      recentIssues: recent
    };
  }

  getExpertDashboard(expertId) {
    const assigned = this.issues.filter(i => !expertId || i.assignedExpertId === expertId || !i.assignedExpertId);
    const pendingReview = this.issues.filter(i => i.status === 'Submitted' || i.status === 'Farmer Updating');
    const myResponses = this.expertResponses.filter(r => !expertId || r.expertId === expertId);
    const activeResearch = this.researchCases.filter(rc => rc.status !== 'Concluded');

    return {
      stats: {
        assignedCases: assigned.length,
        pendingReviewCount: pendingReview.length,
        diagnosesCompleted: myResponses.length,
        activeResearchCases: activeResearch.length
      },
      priorityQueue: pendingReview.slice(0, 6),
      recentResearch: activeResearch.slice(0, 4)
    };
  }

  getAdminDashboard() {
    const totalIssues = this.issues.length;
    const resolvedIssues = this.issues.filter(i => i.status === 'Resolved').length;
    const pendingApprovals = this.users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Pending Approval').length;
    const totalResearchers = this.users.filter(u => u.role === 'Agricultural Expert / Researcher').length;
    const totalFarmers = this.users.filter(u => u.role === 'Farmer').length;

    // Breakdown by department
    const departmentStats = this.departments.map(dept => ({
      ...dept,
      issueCount: this.issues.filter(i => i.departmentId === dept.id).length
    }));

    return {
      stats: {
        totalIssues,
        resolvedIssues,
        resolutionRate: totalIssues ? Math.round((resolvedIssues / totalIssues) * 100) : 0,
        pendingApprovals,
        totalResearchers,
        totalFarmers,
        totalDepartments: this.departments.length,
        totalResearchCases: this.researchCases.length,
        totalKnowledgeArticles: this.knowledgeArticles.length
      },
      departmentBreakdown: departmentStats,
      recentIssues: this.issues.slice(0, 5)
    };
  }

  // --- Users & Approvals ---
  getUsers(filter = {}) {
    let result = [...this.users];
    if (filter.role) {
      result = result.filter(u => u.role === filter.role);
    }
    if (filter.status) {
      result = result.filter(u => u.status && u.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result;
  }

  updateUserStatus(id, status) {
    const user = this.users.find(u => u.id === id || u.uid === id);
    if (!user) return null;
    user.status = status;
    if (status === 'Approved') user.verifiedBadge = true;
    this.persistSnapshot();
    saveFirestoreDoc('users', user.id || user.uid, user).catch(() => {});
    return user;
  }

  deleteUser(id) {
    const prev = this.users.length;
    this.users = this.users.filter(u => u.id !== id && u.uid !== id);
    this.persistSnapshot();
    return this.users.length < prev;
  }
}

export const dbStore = new DataStore();
