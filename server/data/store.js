// Professional Data Store for CropCare Platform API
// Manages domain data models, relationships, and queries with on-demand filtering

export const INITIAL_DEPARTMENTS = [
  { id: "dept_1", name: "Plant Pathology", code: "PATH", description: "Study of plant diseases caused by pathogens like fungi, bacteria, and viruses.", expertCount: 4 },
  { id: "dept_2", name: "Entomology", code: "ENTO", description: "Study of agricultural insect pests, biological controls, and integrated pest management.", expertCount: 3 },
  { id: "dept_3", name: "Soil Science", code: "SOIL", description: "Soil health, fertility testing, nutrient diagnosis, and balanced fertigation.", expertCount: 2 },
  { id: "dept_4", name: "Agronomy", code: "AGRO", description: "Crop production technology, irrigation scheduling, and cropping systems.", expertCount: 2 },
  { id: "dept_5", name: "Agricultural Engineering", code: "ENGG", description: "Irrigation equipment, farm machinery, and post-harvest technology.", expertCount: 1 },
  { id: "dept_6", name: "Agricultural Extension", code: "EXTN", description: "Farmer advisory dissemination, field trials, and university outreach.", expertCount: 2 }
];

export const INITIAL_ISSUES = [
  {
    id: "ISSUE-1001",
    farmerId: "usr_farmer_ramesh",
    farmerName: "Ramesh Patil",
    farmerMobile: "9822014589",
    farmerEmail: "ramesh.patil@cropcare.in",
    title: "Severe Early Blight with Concentric Rings on Tomato Leaves",
    cropName: "Tomato",
    growthStage: "Flowering & Fruit Formation",
    firstNoticedDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    category: "Crop Disease",
    description: "Dark brown target-shaped concentric rings appeared on lower leaves after heavy monsoon shower. Lesions are spreading upwards toward stem and young green fruit clusters.",
    images: ["https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80"],
    state: "Maharashtra",
    district: "Nashik",
    taluka: "Dindori",
    village: "Janori",
    coordinates: "20.0063° N, 73.7902° E",
    departmentId: "dept_1",
    departmentName: "Plant Pathology",
    assignedExpertId: "EXP-101",
    assignedExpertName: "Dr. Anil Sharma",
    status: "Expert Responded",
    priority: "High",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "ISSUE-1002",
    farmerId: "usr_farmer_suresh",
    farmerName: "Suresh Chavan",
    farmerMobile: "9422033412",
    farmerEmail: "suresh.chavan@cropcare.in",
    title: "Downy Mildew White Woolly Growth Under Grape Canopies",
    cropName: "Grapes",
    growthStage: "Berry Development",
    firstNoticedDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    category: "Crop Disease",
    description: "Yellow oily spots on upper leaf surface with dense white fungal growth underneath due to morning fog and high humidity. Young clusters turning brown.",
    images: ["https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=800&q=80"],
    state: "Maharashtra",
    district: "Sangli",
    taluka: "Miraj",
    village: "Kupwad",
    coordinates: "16.8524° N, 74.5815° E",
    departmentId: "dept_1",
    departmentName: "Plant Pathology",
    assignedExpertId: "EXP-101",
    assignedExpertName: "Dr. Anil Sharma",
    status: "Submitted",
    priority: "High",
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString()
  },
  {
    id: "ISSUE-1003",
    farmerId: "usr_farmer_vikram",
    farmerName: "Vikram Shinde",
    farmerMobile: "9766041235",
    farmerEmail: "vikram.shinde@cropcare.in",
    title: "Pink Bollworm Larvae Infestation in Cotton Squares",
    cropName: "Cotton",
    growthStage: "Boll Formation",
    firstNoticedDate: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    category: "Pest Attack",
    description: "Rosetted flower blossoms observed in 4 acres. Bolls show boreholes and internal fiber staining caused by pink bollworm caterpillars.",
    images: ["https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80"],
    state: "Maharashtra",
    district: "Jalgaon",
    taluka: "Chalisgaon",
    village: "Patonda",
    coordinates: "20.4625° N, 75.0189° E",
    departmentId: "dept_2",
    departmentName: "Entomology",
    assignedExpertId: "",
    assignedExpertName: "Unassigned",
    status: "Submitted",
    priority: "Urgent",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  },
  {
    id: "ISSUE-1004",
    farmerId: "usr_farmer_ganesh",
    farmerName: "Ganesh Kulkarni",
    farmerMobile: "9890012378",
    farmerEmail: "ganesh.kulkarni@cropcare.in",
    title: "Red Rot Stem Discoloration & Drying in Sugarcane",
    cropName: "Sugarcane",
    growthStage: "Grand Growth",
    firstNoticedDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    category: "Crop Disease",
    description: "Third and fourth leaves from top showing yellowing and withering. Cane split reveals red pith with distinct white transverse bands and alcoholic smell.",
    images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    state: "Maharashtra",
    district: "Kolhapur",
    taluka: "Karveer",
    village: "Uchgaon",
    coordinates: "16.7050° N, 74.2433° E",
    departmentId: "dept_1",
    departmentName: "Plant Pathology",
    assignedExpertId: "EXP-101",
    assignedExpertName: "Dr. Anil Sharma",
    status: "Resolved",
    priority: "High",
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const INITIAL_ISSUE_UPDATES = [
  {
    id: "upd_1001",
    issueId: "ISSUE-1001",
    farmerId: "usr_farmer_ramesh",
    date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    description: "Problem first reported with photos of bottom foliage.",
    condition: "Initial",
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString()
  },
  {
    id: "upd_1002",
    issueId: "ISSUE-1001",
    farmerId: "usr_farmer_ramesh",
    date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    description: "Sprayed Mancozeb as advised by Dr. Anil Sharma. Leaf spotting progression slowed.",
    condition: "Recovering",
    image: null,
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString()
  }
];

export const INITIAL_EXPERT_RESPONSES = [
  {
    id: "resp_1001",
    issueId: "ISSUE-1001",
    expertId: "EXP-101",
    expertName: "Dr. Anil Sharma",
    expertTitle: "Senior Plant Pathologist",
    expertInstitution: "Maharashtra State Agricultural University",
    diagnosis: "Early Blight (Alternaria solani)",
    possibleCause: "High leaf wetness duration combined with warm day temperatures (28-32°C).",
    recommendation: "Immediate prophylactic spray of Mancozeb 75% WP or Azoxystrobin.",
    treatment: "1. Spray Mancozeb 75 WP @ 2.5g/liter or Chlorothalonil 75 WP @ 2g/liter.\n2. In severe infection, spray Difenoconazole 25 EC @ 1ml/liter.\n3. Ensure uniform coverage on underside of leaves.",
    prevention: "Prune bottom leaves touching soil. Avoid overhead sprinkler irrigation during late evenings.",
    verified: true,
    publishedToKb: true,
    isResolved: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

export const INITIAL_RESEARCH_CASES = [
  {
    id: "RC-301",
    issueId: "ISSUE-1004",
    title: "Atypical Sugarcane Red Rot Strain Resistance in Western Maharashtra",
    crop: "Sugarcane",
    category: "Crop Disease",
    description: "Co-0238 variety showing accelerated wilting even under recommended fungicide schedules. Pathogen isolation in progress.",
    assignedResearchers: ["Dr. Anil Sharma", "Dr. Sunita Deshmukh"],
    department: "Plant Pathology",
    status: "Investigation Started",
    startDate: new Date(Date.now() - 15 * 86400000).toISOString().split('T')[0],
    lastUpdated: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    researchNotes: "PCR analysis confirms Colletotrichum falcatum with modified virulence markers.",
    findings: "Field isolates exhibit tolerance up to 400ppm carbendazim.",
    attachments: [],
    conclusion: "Interim recommendation: Substitute with Trichoderma viride seed-sett dip."
  }
];

export const INITIAL_KNOWLEDGE_ARTICLES = [
  {
    id: "KB-101",
    title: "Tomato Early Blight Diagnosis & Complete Fungicidal Schedule",
    crop: "Tomato",
    category: "Crop Disease",
    department: "Plant Pathology",
    symptoms: "Concentric target spots on older leaves, yellow halo around lesions, stem cankers.",
    diagnosis: "Alternaria solani fungal infection.",
    treatment: "Spray Mancozeb 75% WP (2.5 g/L) followed by Difenoconazole 25% EC (1 ml/L) at 10-day intervals.",
    preventiveMeasures: "Crop rotation with non-solanaceous crops, wider plant spacing for aeration.",
    verifiedBy: "Dr. Anil Sharma (Plant Pathology Dept)",
    verifiedDate: new Date().toISOString().split('T')[0],
    helpfulYes: 38,
    helpfulNo: 2,
    views: 215,
    image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
    relatedIssues: ["ISSUE-1001"]
  },
  {
    id: "KB-102",
    title: "Cotton Pink Bollworm Integrated Pest Management (IPM)",
    crop: "Cotton",
    category: "Pest Attack",
    department: "Entomology",
    symptoms: "Rosetted flowers, bore holes in developing bolls, damaged lint.",
    diagnosis: "Pectinophora gossypiella larvae feeding inside bolls.",
    treatment: "Install 5 pheromone traps/acre. Spray Profenofos 50% EC @ 2ml/L if ETL crossed (8 moths/trap/day).",
    preventiveMeasures: "Timely termination of crop by December, avoid ratooning, install light traps.",
    verifiedBy: "Dr. Sunita Deshmukh (Entomology Dept)",
    verifiedDate: new Date().toISOString().split('T')[0],
    helpfulYes: 54,
    helpfulNo: 3,
    views: 310,
    image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80",
    relatedIssues: ["ISSUE-1003"]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: "notif_1",
    userId: "all_experts",
    role: "Agricultural Expert / Researcher",
    title: "New Crop Problem Reported",
    message: "A new Cotton pest case (ISSUE-1003) has been submitted for Entomology review.",
    read: false,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    link: "/farmer/issues/ISSUE-1003"
  },
  {
    id: "notif_2",
    userId: "usr_farmer_ramesh",
    role: "Farmer",
    title: "Expert Response Received",
    message: "Dr. Anil Sharma responded to your Tomato Early Blight case (ISSUE-1001).",
    read: false,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    link: "/farmer/issues/ISSUE-1001"
  }
];

export const INITIAL_USERS = [
  {
    id: "usr_farmer_ramesh",
    uid: "usr_farmer_ramesh",
    fullName: "Ramesh Patil",
    email: "ramesh.patil@cropcare.in",
    role: "Farmer",
    status: "Active",
    district: "Nashik",
    taluka: "Dindori",
    village: "Janori",
    mobileNumber: "9822014589",
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
  },
  {
    id: "EXP-101",
    uid: "EXP-101",
    fullName: "Dr. Anil Sharma",
    email: "dr.anil.sharma@cropcare.gov.in",
    role: "Agricultural Expert / Researcher",
    status: "Approved",
    department: "Plant Pathology",
    departmentId: "dept_1",
    title: "Senior Plant Pathologist",
    institution: "Maharashtra State Agricultural University",
    specialization: "Fungal Diseases & Integrated Pest Management",
    verifiedBadge: true,
    createdAt: new Date(Date.now() - 60 * 86400000).toISOString()
  },
  {
    id: "EXP-102",
    uid: "EXP-102",
    fullName: "Dr. Sunita Deshmukh",
    email: "dr.sunita@cropcare.gov.in",
    role: "Agricultural Expert / Researcher",
    status: "Pending Approval",
    department: "Entomology",
    departmentId: "dept_2",
    title: "Entomology Specialist",
    institution: "Dr. Panjabrao Deshmukh Krishi Vidyapeeth",
    specialization: "Cotton Bollworm & Biological Control",
    verifiedBadge: false,
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString()
  }
];

// In-Memory Database Store Class
class DataStore {
  constructor() {
    this.departments = [...INITIAL_DEPARTMENTS];
    this.issues = [...INITIAL_ISSUES];
    this.issueUpdates = [...INITIAL_ISSUE_UPDATES];
    this.expertResponses = [...INITIAL_EXPERT_RESPONSES];
    this.researchCases = [...INITIAL_RESEARCH_CASES];
    this.knowledgeArticles = [...INITIAL_KNOWLEDGE_ARTICLES];
    this.notifications = [...INITIAL_NOTIFICATIONS];
    this.users = [...INITIAL_USERS];
  }

  // --- Issues Queries & Mutations ---
  getIssues(filter = {}) {
    let result = [...this.issues];

    if (filter.farmerId) {
      result = result.filter(i => i.farmerId === filter.farmerId);
    }
    if (filter.status) {
      result = result.filter(i => i.status.toLowerCase() === filter.status.toLowerCase());
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
        i.title.toLowerCase().includes(q) || 
        i.cropName.toLowerCase().includes(q) || 
        i.id.toLowerCase().includes(q)
      );
    }

    // Sort by latest createdAt
    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
    const updates = this.issueUpdates.filter(u => u.issueId === id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const responses = this.expertResponses.filter(r => r.issueId === id);
    return { ...issue, timeline: updates, responses };
  }

  createIssue(issueData) {
    const newId = `ISSUE-${1000 + this.issues.length + 1}`;
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

    return newIssue;
  }

  addIssueUpdate(issueId, updateData) {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;

    const newUpdate = {
      id: `upd_${Date.now()}`,
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
      id: `resp_${Date.now()}`,
      issueId: respData.issueId,
      expertId: respData.expertId || "EXP-101",
      expertName: respData.expertName || "Dr. Agricultural Specialist",
      expertTitle: respData.expertTitle || "Plant Pathologist",
      expertInstitution: respData.expertInstitution || "State Agricultural University",
      diagnosis: respData.diagnosis,
      possibleCause: respData.possibleCause || "",
      recommendation: respData.recommendation || "",
      treatment: respData.treatment,
      prevention: respData.prevention || "",
      notes: respData.notes || "",
      verified: respData.verified !== false,
      publishedToKb: Boolean(respData.publishToKb),
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

      // If publish to KB requested
      if (respData.publishToKb) {
        const kbArticle = {
          id: `KB-${100 + this.knowledgeArticles.length + 1}`,
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
          image: targetIssue.images[0] || null,
          relatedIssues: [targetIssue.id]
        };
        this.knowledgeArticles.unshift(kbArticle);
      }
    }

    return newResponse;
  }

  // --- Research Cases ---
  getResearchCases(filter = {}) {
    let result = [...this.researchCases];
    if (filter.status) {
      result = result.filter(rc => rc.status.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.department) {
      result = result.filter(rc => rc.department.toLowerCase() === filter.department.toLowerCase());
    }
    if (filter.crop) {
      result = result.filter(rc => rc.crop.toLowerCase().includes(filter.crop.toLowerCase()));
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(rc => rc.title.toLowerCase().includes(q) || rc.id.toLowerCase().includes(q));
    }
    return result;
  }

  getResearchCaseById(id) {
    return this.researchCases.find(rc => rc.id === id) || null;
  }

  createResearchCase(rcData) {
    const newRcId = `RC-${300 + this.researchCases.length + 1}`;
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
    }

    this.researchCases.unshift(newRc);
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
    return newDept;
  }

  deleteDepartment(id) {
    const prevLen = this.departments.length;
    this.departments = this.departments.filter(d => d.id !== id);
    return this.departments.length < prevLen;
  }

  // --- Knowledge Articles ---
  getKnowledgeArticles(filter = {}) {
    let result = [...this.knowledgeArticles];
    if (filter.category && filter.category !== 'All') {
      result = result.filter(a => a.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.crop && filter.crop !== 'All') {
      result = result.filter(a => a.crop.toLowerCase() === filter.crop.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(a => a.title.toLowerCase().includes(q) || a.symptoms.toLowerCase().includes(q));
    }
    return result;
  }

  getKnowledgeArticleById(id) {
    return this.knowledgeArticles.find(a => a.id === id) || null;
  }

  voteKnowledgeArticle(id, isHelpful) {
    const article = this.knowledgeArticles.find(a => a.id === id);
    if (!article) return null;
    if (isHelpful) article.helpfulYes += 1;
    else article.helpfulNo += 1;
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
    if (notif) notif.read = true;
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
      result = result.filter(u => u.status.toLowerCase() === filter.status.toLowerCase());
    }
    return result;
  }

  updateUserStatus(id, status) {
    const user = this.users.find(u => u.id === id || u.uid === id);
    if (!user) return null;
    user.status = status;
    if (status === 'Approved') user.verifiedBadge = true;
    return user;
  }

  deleteUser(id) {
    const prev = this.users.length;
    this.users = this.users.filter(u => u.id !== id && u.uid !== id);
    return this.users.length < prev;
  }
}

export const dbStore = new DataStore();
