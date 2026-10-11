import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { api } from '../services/api';
import { db } from '../services/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { realtimeService } from '../services/realtime';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [issues, setIssues] = useState([]);
  const [issueUpdates, setIssueUpdates] = useState([]);
  const [expertResponses, setExpertResponses] = useState([]);
  const [researchCases, setResearchCases] = useState([]);
  const [knowledgeArticles, setKnowledgeArticles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [firestorePermissionError, setFirestorePermissionError] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(true);
  const [savedSolutions, setSavedSolutions] = useState(() => {
    try {
      const saved = localStorage.getItem('cropcare_saved_solutions') || localStorage.getItem('farmconnect_saved_solutions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Save Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('cropcare_saved_solutions', JSON.stringify(savedSolutions));
    } catch (e) {}
  }, [savedSolutions]);

  // 1. Primary: Load ONLY baseline departments metadata on initial app boot
  useEffect(() => {
    let isMounted = true;
    const fetchBaseline = async () => {
      try {
        setIsLoadingApi(true);
        const deptsRes = await api.departments.getAll();
        if (isMounted && Array.isArray(deptsRes) && deptsRes.length) {
          setDepartments(deptsRes);
        }
      } catch (err) {
        console.warn("API departments notice:", err?.message || err);
      } finally {
        if (isMounted) setIsLoadingApi(false);
      }
    };

    fetchBaseline();
    return () => { isMounted = false; };
  }, []);

  // 2. On-Demand Separate Loaders per Route & Role (Only required data requested)
  const loadFarmerData = async (farmerId) => {
    if (!farmerId) return;
    try {
      const [issuesRes, notifRes] = await Promise.allSettled([
        api.issues.getAll({ farmerId }),
        api.notifications.getAll({ userId: farmerId })
      ]);
      if (issuesRes.status === 'fulfilled' && issuesRes.value) {
        setIssues(issuesRes.value);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value) {
        setNotifications(notifRes.value);
      }
    } catch (err) {
      console.warn("loadFarmerData notice:", err?.message || err);
    }
  };

  const loadExpertData = async (expertId) => {
    try {
      const [issuesRes, respRes, notifRes] = await Promise.allSettled([
        api.issues.getAll(expertId ? { assignedExpertId: expertId } : {}),
        api.expert.getAll(expertId ? { expertId } : {}),
        api.notifications.getAll({ userId: expertId || 'all_experts' })
      ]);
      if (issuesRes.status === 'fulfilled' && issuesRes.value) {
        setIssues(issuesRes.value);
      }
      if (respRes.status === 'fulfilled' && respRes.value) {
        setExpertResponses(respRes.value);
      }
      if (notifRes.status === 'fulfilled' && notifRes.value) {
        setNotifications(notifRes.value);
      }
    } catch (err) {
      console.warn("loadExpertData notice:", err?.message || err);
    }
  };

  const loadAdminData = async () => {
    try {
      const [issuesRes, deptsRes] = await Promise.allSettled([
        api.issues.getAll(),
        api.departments.getAll()
      ]);
      if (issuesRes.status === 'fulfilled' && issuesRes.value) {
        setIssues(issuesRes.value);
      }
      if (deptsRes.status === 'fulfilled' && deptsRes.value) {
        setDepartments(deptsRes.value);
      }
    } catch (err) {
      console.warn("loadAdminData notice:", err?.message || err);
    }
  };

  const loadKnowledgeArticles = async (filter = {}) => {
    try {
      const articles = await api.knowledge.getAll(filter);
      if (articles) setKnowledgeArticles(articles);
      return articles;
    } catch (err) {
      console.warn("loadKnowledgeArticles notice:", err?.message || err);
      return [];
    }
  };

  const loadResearchCases = async (filter = {}) => {
    try {
      const cases = await api.research.getAll(filter);
      if (cases) setResearchCases(cases);
      return cases;
    } catch (err) {
      console.warn("loadResearchCases notice:", err?.message || err);
      return [];
    }
  };

  const loadIssueById = async (id) => {
    if (!id) return null;
    try {
      const issue = await api.issues.getById(id);
      if (issue) {
        setIssues(prev => {
          const exists = prev.some(i => i.id === issue.id);
          return exists ? prev.map(i => i.id === issue.id ? issue : i) : [issue, ...prev];
        });
        if (issue.timeline && Array.isArray(issue.timeline)) {
          setIssueUpdates(prev => {
            const ids = new Set(prev.map(p => p.id));
            const newOnes = issue.timeline.filter(t => !ids.has(t.id));
            return [...newOnes, ...prev];
          });
        }
        if (issue.responses && Array.isArray(issue.responses)) {
          setExpertResponses(prev => {
            const ids = new Set(prev.map(p => p.id));
            const newOnes = issue.responses.filter(r => !ids.has(r.id));
            return [...newOnes, ...prev];
          });
        }
      }
      return issue;
    } catch (err) {
      console.warn("loadIssueById notice:", err?.message || err);
      return null;
    }
  };

  // 2. Real-Time BroadcastChannel Event Listener (Local cross-tab instant responsiveness)
  useEffect(() => {
    const unsubscribeBus = realtimeService.subscribe((payload) => {
      const { type, data } = payload;
      if (!data) return;

      switch (type) {
        case 'ISSUE_CREATED':
          setIssues(prev => prev.some(i => i.id === data.id) ? prev : [data, ...prev]);
          if (data.firstUpdate) setIssueUpdates(prev => [data.firstUpdate, ...prev]);
          if (data.notification) setNotifications(prev => [data.notification, ...prev]);
          break;
        case 'ISSUE_UPDATE_ADDED':
          setIssueUpdates(prev => prev.some(u => u.id === data.id) ? prev : [data, ...prev]);
          setIssues(prev => prev.map(i => i.id === data.issueId ? { ...i, status: data.condition === 'Resolved' ? 'Resolved' : 'Farmer Updating' } : i));
          break;
        case 'EXPERT_DIAGNOSED':
          setExpertResponses(prev => prev.some(r => r.id === data.id) ? prev : [data, ...prev]);
          setIssues(prev => prev.map(i => i.id === data.issueId ? { ...i, status: data.isResolved ? 'Resolved' : 'Expert Responded', assignedExpertName: data.expertName } : i));
          break;
        case 'RESEARCH_ESCALATED':
          setResearchCases(prev => [data, ...prev]);
          setIssues(prev => prev.map(i => i.id === data.issueId ? { ...i, status: "Research Required" } : i));
          break;
        case 'RESEARCH_UPDATED':
          setResearchCases(prev => prev.map(rc => rc.id === data.rcId ? { ...rc, ...data.updatedFields } : rc));
          break;
        case 'KB_PUBLISHED':
          setKnowledgeArticles(prev => [data, ...prev]);
          break;
        case 'DEPARTMENT_ADDED':
          setDepartments(prev => [...prev, data]);
          break;
        case 'DEPARTMENT_DELETED':
          setDepartments(prev => prev.filter(d => d.id !== data.id));
          break;
        default:
          break;
      }
    });

    return () => unsubscribeBus();
  }, []);

  // Add / Report New Problem directly to Cloud Firestore
  const addIssue = async (newIssueData, user) => {
    const newIssueId = `ISSUE-${Date.now()}`;
    const dept = departments.find(d => d.name === newIssueData.department) || departments[0];

    const issueObj = {
      id: newIssueId,
      farmerId: user.uid || user.id,
      farmerName: user.fullName || "Farmer",
      farmerEmail: user.email || "",
      farmerMobile: user.mobileNumber || "Not provided",
      title: newIssueData.title,
      cropName: newIssueData.cropName,
      growthStage: newIssueData.growthStage || "Not specified",
      firstNoticedDate: newIssueData.firstNoticedDate || new Date().toISOString().split('T')[0],
      category: newIssueData.category,
      description: newIssueData.description,
      images: newIssueData.images?.length > 0 ? newIssueData.images : ["https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80"],
      state: newIssueData.state || "Maharashtra",
      district: newIssueData.district || user.district || "Jalgaon",
      taluka: newIssueData.taluka || user.taluka || "Chalisgaon",
      village: newIssueData.village || user.village || "Patonda",
      coordinates: newIssueData.coordinates || "20.4625° N, 75.0189° E",
      departmentId: dept.id,
      departmentName: dept.name,
      assignedExpertId: "",
      assignedExpertName: "Unassigned",
      status: "Submitted",
      priority: newIssueData.priority || "Medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const firstUpdate = {
      id: `upd_${Date.now()}`,
      issueId: newIssueId,
      farmerId: user.uid || user.id,
      date: new Date().toISOString().split('T')[0],
      description: `Problem first reported by farmer: ${newIssueData.title}`,
      condition: "Same",
      image: issueObj.images[0] || null,
      createdAt: new Date().toISOString()
    };

    const notif = {
      id: `notif_${Date.now()}`,
      userId: "all_experts",
      title: "New Crop Problem Reported",
      message: `A new ${newIssueData.cropName} case (${newIssueId}) has been submitted to ${dept.name}.`,
      read: false,
      timestamp: new Date().toISOString(),
      link: `/farmer/issues/${newIssueId}`
    };

    // Call Backend API Endpoint
    try {
      await api.issues.create({
        ...newIssueData,
        farmerId: user.uid || user.id,
        farmerName: user.fullName || "Farmer",
        farmerMobile: user.mobileNumber || "Not provided",
        farmerEmail: user.email || "",
        departmentId: dept.id,
        departmentName: dept.name
      });
    } catch (apiErr) {
      console.warn("API addIssue notice:", apiErr?.message);
    }

    // Save directly to Cloud Firestore (multi-sync persistence)
    if (db) {
      try {
        await setDoc(doc(db, 'issues', newIssueId), issueObj);
        await setDoc(doc(db, 'issue_updates', firstUpdate.id), firstUpdate);
        await setDoc(doc(db, 'notifications', notif.id), notif);
      } catch (err) {
        console.warn("Firestore addIssue write notice:", err);
        if (err?.code === 'permission-denied') {
          setFirestorePermissionError(true);
        }
      }
    }

    setIssues(prev => [issueObj, ...prev]);
    setIssueUpdates(prev => [firstUpdate, ...prev]);
    setNotifications(prev => [notif, ...prev]);

    realtimeService.broadcast('ISSUE_CREATED', {
      ...issueObj,
      firstUpdate,
      notification: notif
    });

    return issueObj;
  };

  // Add Progress Update to Timeline in Cloud Firestore
  const addIssueUpdate = async (issueId, userId, updateData) => {
    const updateObj = {
      id: `upd_${Date.now()}`,
      issueId,
      farmerId: userId,
      date: updateData.date || new Date().toISOString().split('T')[0],
      description: updateData.description,
      condition: updateData.condition,
      image: updateData.image || null,
      createdAt: new Date().toISOString()
    };

    // Call Backend API Endpoint
    try {
      await api.issues.addUpdate(issueId, updateData);
    } catch (apiErr) {
      console.warn("API addIssueUpdate notice:", apiErr?.message);
    }

    if (db) {
      try {
        await setDoc(doc(db, 'issue_updates', updateObj.id), updateObj);
        await updateDoc(doc(db, 'issues', issueId), {
          status: nextStatus,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        if (err?.code === 'permission-denied') setFirestorePermissionError(true);
      }
    }

    setIssueUpdates(prev => [updateObj, ...prev]);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: nextStatus, updatedAt: new Date().toISOString() } : i));

    realtimeService.broadcast('ISSUE_UPDATE_ADDED', updateObj);
    return updateObj;
  };

  // Expert Response & Treatment Prescription in Cloud Firestore
  const addExpertResponse = async (responseObj, expert) => {
    const newResponse = {
      id: `resp_${Date.now()}`,
      issueId: responseObj.issueId,
      expertId: expert.uid || expert.id,
      expertName: expert.fullName,
      expertTitle: expert.specialization || "Agricultural Expert",
      expertInstitution: expert.institution || "Agriculture Department",
      diagnosis: responseObj.diagnosis,
      possibleCause: responseObj.possibleCause,
      recommendation: responseObj.recommendation,
      treatment: responseObj.treatment,
      prevention: responseObj.prevention,
      notes: responseObj.notes || "",
      verified: responseObj.verified !== false,
      publishedToKb: responseObj.publishToKb || false,
      isResolved: responseObj.isResolved || false,
      createdAt: new Date().toISOString()
    };

    const nextStatus = responseObj.isResolved ? "Resolved" : "Expert Responded";

    // Call Backend API Endpoint
    try {
      await api.expert.create({
        ...responseObj,
        expertId: expert.uid || expert.id,
        expertName: expert.fullName,
        expertTitle: expert.specialization || "Agricultural Expert",
        expertInstitution: expert.institution || "Agriculture Department"
      });
    } catch (apiErr) {
      console.warn("API addExpertResponse notice:", apiErr?.message);
    }

    if (db) {
      try {
        await setDoc(doc(db, 'expert_responses', newResponse.id), newResponse);
        await updateDoc(doc(db, 'issues', responseObj.issueId), {
          status: nextStatus,
          assignedExpertId: expert.uid || expert.id,
          assignedExpertName: expert.fullName,
          updatedAt: new Date().toISOString()
        });
      } catch (err) {
        if (err?.code === 'permission-denied') setFirestorePermissionError(true);
      }
    }

    setExpertResponses(prev => [newResponse, ...prev]);
    setIssues(prev => prev.map(i => i.id === responseObj.issueId ? {
      ...i,
      status: nextStatus,
      assignedExpertId: expert.uid || expert.id,
      assignedExpertName: expert.fullName,
      updatedAt: new Date().toISOString()
    } : i));

    // If published to KB
    if (responseObj.publishToKb) {
      const targetIssue = issues.find(i => i.id === responseObj.issueId);
      const newKbArticle = {
        id: `KB-${100 + knowledgeArticles.length + 1}`,
        title: `${targetIssue?.cropName || "Crop"} Solution: ${targetIssue?.title || responseObj.diagnosis}`,
        crop: targetIssue?.cropName || "General",
        category: targetIssue?.category || "Crop Disease",
        department: targetIssue?.departmentName || "Plant Pathology",
        symptoms: targetIssue?.description || "Observed crop symptoms.",
        diagnosis: responseObj.diagnosis,
        treatment: responseObj.treatment,
        preventiveMeasures: responseObj.prevention,
        verifiedBy: `${expert.fullName} (${expert.institution || 'Agri Dept'})`,
        verifiedDate: new Date().toISOString().split('T')[0],
        helpfulYes: 1,
        helpfulNo: 0,
        views: 1,
        image: targetIssue?.images?.[0] || "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
        relatedIssues: [responseObj.issueId]
      };

      if (db) {
        try {
          await setDoc(doc(db, 'knowledge_articles', newKbArticle.id), newKbArticle);
        } catch (e) {}
      }

      setKnowledgeArticles(prev => [newKbArticle, ...prev]);
      realtimeService.broadcast('KB_PUBLISHED', newKbArticle);
    }

    realtimeService.broadcast('EXPERT_DIAGNOSED', newResponse);
    return newResponse;
  };

  // Convert Issue to Scientific Research Case in Cloud Firestore
  const convertToResearchCase = async (issueId, researchDetails, expert) => {
    const targetIssue = issues.find(i => i.id === issueId);
    const newRcId = `RC-${300 + researchCases.length + 1}`;

    const newRc = {
      id: newRcId,
      issueId,
      title: researchDetails.title || `Research Case for ${targetIssue?.cropName || 'Crop'} - ${targetIssue?.title}`,
      crop: targetIssue?.cropName || "General",
      category: targetIssue?.category || "Unknown Problem",
      description: targetIssue?.description || "Scientific study required.",
      assignedResearchers: [expert.fullName],
      department: targetIssue?.departmentName || expert.department || "Plant Pathology",
      status: "Investigation Started",
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      researchNotes: researchDetails.notes || "Case converted to laboratory study.",
      findings: researchDetails.findings || "Sample isolation under progress.",
      attachments: [],
      conclusion: "Under scientific study."
    };

    // Call Backend API Endpoint
    try {
      await api.research.create({
        issueId,
        title: newRc.title,
        crop: newRc.crop,
        category: newRc.category,
        description: newRc.description,
        assignedResearchers: newRc.assignedResearchers,
        department: newRc.department,
        notes: researchDetails.notes,
        findings: researchDetails.findings
      });
    } catch (e) {
      console.warn("API convertToResearchCase notice:", e?.message);
    }

    if (db) {
      try {
        await setDoc(doc(db, 'research_cases', newRcId), newRc);
        await updateDoc(doc(db, 'issues', issueId), {
          status: "Research Required",
          updatedAt: new Date().toISOString()
        });
      } catch (err) {}
    }

    setResearchCases(prev => [newRc, ...prev]);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: "Research Required", updatedAt: new Date().toISOString() } : i));

    realtimeService.broadcast('RESEARCH_ESCALATED', newRc);
    return newRc;
  };

  // Update Research Case in Cloud Firestore
  const updateResearchCase = async (rcId, updatedFields) => {
    // Call Backend API Endpoint
    try {
      await api.research.update(rcId, updatedFields);
    } catch (e) {
      console.warn("API updateResearchCase notice:", e?.message);
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'research_cases', rcId), {
          ...updatedFields,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      } catch (err) {}
    }

    setResearchCases(prev => prev.map(rc => rc.id === rcId ? {
      ...rc,
      ...updatedFields,
      lastUpdated: new Date().toISOString().split('T')[0]
    } : rc));

    realtimeService.broadcast('RESEARCH_UPDATED', { rcId, updatedFields });
  };

  // Vote Knowledge Base Article Helpfulness in Cloud Firestore
  const voteKnowledgeArticle = async (articleId, isHelpful) => {
    const target = knowledgeArticles.find(a => a.id === articleId);
    if (!target) return;

    const newYes = isHelpful ? target.helpfulYes + 1 : target.helpfulYes;
    const newNo = !isHelpful ? target.helpfulNo + 1 : target.helpfulNo;

    // Call Backend API Endpoint
    try {
      await api.knowledge.vote(articleId, isHelpful);
    } catch (e) {
      console.warn("API voteKnowledgeArticle notice:", e?.message);
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'knowledge_articles', articleId), {
          helpfulYes: newYes,
          helpfulNo: newNo
        });
      } catch (e) {}
    }

    setKnowledgeArticles(prev => prev.map(a => a.id === articleId ? { ...a, helpfulYes: newYes, helpfulNo: newNo } : a));
    realtimeService.broadcast('ARTICLE_VOTED', { articleId, isHelpful });
  };

  // Add Department in Cloud Firestore
  const addDepartment = async (deptData) => {
    const newDept = {
      id: `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code || deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description || 'Division under State Directorate of Agriculture.',
      expertCount: deptData.expertCount || 0
    };

    // Call Backend API Endpoint
    try {
      await api.departments.create(newDept);
    } catch (e) {
      console.warn("API addDepartment notice:", e?.message);
    }

    if (db) {
      try {
        await setDoc(doc(db, 'departments', newDept.id), newDept);
      } catch (err) {}
    }

    setDepartments(prev => [...prev, newDept]);
    realtimeService.broadcast('DEPARTMENT_ADDED', newDept);
    return newDept;
  };

  // Delete Department in Cloud Firestore
  const deleteDepartment = async (deptId) => {
    // Call Backend API Endpoint
    try {
      await api.departments.delete(deptId);
    } catch (e) {
      console.warn("API deleteDepartment notice:", e?.message);
    }

    if (db) {
      try {
        await deleteDoc(doc(db, 'departments', deptId));
      } catch (err) {}
    }

    setDepartments(prev => prev.filter(d => d.id !== deptId));
    realtimeService.broadcast('DEPARTMENT_DELETED', { id: deptId });
  };

  // Toggle Saved Solution Bookmarks
  const toggleSaveSolution = (articleId) => {
    setSavedSolutions(prev => prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]);
  };

  // Mark Notification Read in Cloud Firestore
  const markNotificationRead = async (notifId) => {
    // Call Backend API Endpoint
    try {
      await api.notifications.markRead(notifId);
    } catch (e) {
      console.warn("API markNotificationRead notice:", e?.message);
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'notifications', notifId), { read: true });
      } catch (e) {}
    }
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // Seed baseline sample data directly into Cloud Firestore
  const seedSampleFirestoreData = async () => {
    if (!db) throw new Error("Cloud Firestore is not initialized.");

    const sampleDepts = INITIAL_DEPARTMENTS;
    const sampleIssues = [
      {
        id: "ISSUE-1001",
        farmerId: "usr_farmer_ramesh",
        farmerName: "Ramesh Patil",
        farmerMobile: "9822014589",
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

    const sampleResponses = [
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

    const sampleKb = [
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
        helpfulYes: 24,
        helpfulNo: 1,
        views: 142,
        image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
        relatedIssues: ["ISSUE-1001"]
      }
    ];

    const sampleUsers = [
      {
        id: "usr_farmer_ganesh",
        uid: "usr_farmer_ganesh",
        fullName: "Ganesh Kulkarni",
        email: "ganesh.farmer@cropcare.in",
        role: "Farmer",
        status: "Active",
        state: "Maharashtra",
        district: "Kolhapur",
        taluka: "Karveer",
        village: "Uchgaon",
        mobile: "9890012378",
        createdAt: new Date(Date.now() - 10 * 86400000).toISOString()
      },
      {
        id: "usr_farmer_suresh",
        uid: "usr_farmer_suresh",
        fullName: "Suresh Patil",
        email: "suresh.farmer@cropcare.in",
        role: "Farmer",
        status: "Active",
        state: "Maharashtra",
        district: "Nashik",
        taluka: "Niphad",
        village: "Pimpalgaon",
        mobile: "9822019944",
        createdAt: new Date(Date.now() - 12 * 86400000).toISOString()
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
        createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
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

    try {
      // Write sample users to Cloud Firestore
      for (const u of sampleUsers) {
        await setDoc(doc(db, "users", u.id), u);
      }
      // Write all sample docs to Cloud Firestore
      for (const d of sampleDepts) {
        await setDoc(doc(db, "departments", d.id), d);
      }
      for (const iss of sampleIssues) {
        await setDoc(doc(db, "issues", iss.id), iss);
      }
      for (const resp of sampleResponses) {
        await setDoc(doc(db, "expert_responses", resp.id), resp);
      }
      for (const kb of sampleKb) {
        await setDoc(doc(db, "knowledge_articles", kb.id), kb);
      }

      setFirestorePermissionError(false);
      return { success: true, count: sampleIssues.length };
    } catch (err) {
      console.warn("Firestore seed sample write notice:", err);
      if (err?.code === 'permission-denied') {
        setFirestorePermissionError(true);
      }
      return { success: false, error: err };
    }
  };

  // On-Demand Role-Specific API Methods (Fetching ONLY required data)
  const fetchFarmerDashboard = (farmerId) => api.dashboard.getFarmer(farmerId);
  const fetchExpertDashboard = (expertId) => api.dashboard.getExpert(expertId);
  const fetchAdminDashboard = () => api.dashboard.getAdmin();
  const fetchFarmerIssues = (farmerId) => api.issues.getAll({ farmerId });
  const fetchIssueById = (id) => api.issues.getById(id);
  const fetchResearchCasesByQuery = (params) => api.research.getAll(params);
  const fetchKnowledgeArticlesByQuery = (params) => api.knowledge.getAll(params);

  return (
    <DataContext.Provider value={{
      api,
      departments,
      issues,
      issueUpdates,
      expertResponses,
      researchCases,
      knowledgeArticles,
      notifications,
      savedSolutions,
      firestorePermissionError,
      isLoadingApi,
      loadFarmerData,
      loadExpertData,
      loadAdminData,
      loadKnowledgeArticles,
      loadResearchCases,
      loadIssueById,
      fetchFarmerDashboard,
      fetchExpertDashboard,
      fetchAdminDashboard,
      fetchFarmerIssues,
      fetchIssueById,
      fetchResearchCasesByQuery,
      fetchKnowledgeArticlesByQuery,
      addIssue,
      addIssueUpdate,
      addExpertResponse,
      convertToResearchCase,
      updateResearchCase,
      voteKnowledgeArticle,
      addDepartment,
      deleteDepartment,
      toggleSaveSolution,
      markNotificationRead,
      seedSampleFirestoreData,
      resetDemoData: seedSampleFirestoreData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  return context;
};
