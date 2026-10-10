// Production Baseline Dataset for CropCare Platform
// Real data is dynamically persisted and loaded from Firebase Firestore & Authentication

export const INITIAL_USERS = [];

export const INITIAL_DEPARTMENTS = [
  { id: "dept_1", name: "Plant Pathology", code: "PATH", description: "Study of plant diseases caused by pathogens like fungi, bacteria, and viruses.", expertCount: 0 },
  { id: "dept_2", name: "Entomology", code: "ENTO", description: "Study of agricultural insect pests, biological controls, and integrated pest management.", expertCount: 0 },
  { id: "dept_3", name: "Soil Science", code: "SOIL", description: "Soil health, fertility testing, nutrient diagnosis, and balanced fertigation.", expertCount: 0 },
  { id: "dept_4", name: "Agronomy", code: "AGRO", description: "Crop production technology, irrigation scheduling, and cropping systems.", expertCount: 0 },
  { id: "dept_5", name: "Agricultural Engineering", code: "ENGG", description: "Irrigation equipment, farm machinery, and post-harvest technology.", expertCount: 0 },
  { id: "dept_6", name: "Agricultural Extension", code: "EXTN", description: "Farmer advisory dissemination, field trials, and university outreach.", expertCount: 0 }
];

export const INITIAL_ISSUES = [];

export const INITIAL_ISSUE_UPDATES = [];

export const INITIAL_EXPERT_RESPONSES = [];

export const INITIAL_RESEARCH_CASES = [];

export const INITIAL_KNOWLEDGE_ARTICLES = [];

export const INITIAL_NOTIFICATIONS = [];
