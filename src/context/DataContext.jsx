import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_DEPARTMENTS } from '../data/initialData';
import { db, rtdb } from '../services/firebase';
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
import { 
  ref, 
  set, 
  get, 
  onValue, 
  update as updateRt, 
  remove as removeRt 
} from 'firebase/database';
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
  const [savedSolutions, setSavedSolutions] = useState(() => {
    try {
      const saved = localStorage.getItem('cropcare_saved_solutions') || localStorage.getItem('farmconnect_saved_solutions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Purge legacy dummy mock data from localStorage once on boot
  useEffect(() => {
    try {
      const legacyKeys = [
        'farmconnect_issues',
        'farmconnect_issue_updates',
        'farmconnect_expert_responses',
        'farmconnect_research_cases',
        'farmconnect_knowledge_articles',
        'farmconnect_notifications',
        'farmconnect_users'
      ];
      legacyKeys.forEach(k => localStorage.removeItem(k));
    } catch (e) {}
  }, []);

  // Save Bookmarks
  useEffect(() => {
    try {
      localStorage.setItem('cropcare_saved_solutions', JSON.stringify(savedSolutions));
    } catch (e) {}
  }, [savedSolutions]);

  // 1. Live Firestore + RTDB Dual Listeners
  useEffect(() => {
    let unsubIssuesFs = () => {}, unsubUpdatesFs = () => {}, unsubRespFs = () => {};
    let unsubRcFs = () => {}, unsubKbFs = () => {}, unsubDeptsFs = () => {}, unsubNotifsFs = () => {};

    // Firestore Listeners
    if (db) {
      try {
        unsubIssuesFs = onSnapshot(collection(db, 'issues'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setIssues(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
          }
        }, () => {});

        unsubUpdatesFs = onSnapshot(collection(db, 'issue_updates'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setIssueUpdates(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
          }
        }, () => {});

        unsubRespFs = onSnapshot(collection(db, 'expert_responses'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setExpertResponses(list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
          }
        }, () => {});

        unsubRcFs = onSnapshot(collection(db, 'research_cases'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setResearchCases(list.sort((a, b) => new Date(b.lastUpdated || b.startDate || 0) - new Date(a.lastUpdated || a.startDate || 0)));
          }
        }, () => {});

        unsubKbFs = onSnapshot(collection(db, 'knowledge_articles'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setKnowledgeArticles(list);
          }
        }, () => {});

        unsubDeptsFs = onSnapshot(collection(db, 'departments'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setDepartments(list);
          }
        }, () => {});

        unsubNotifsFs = onSnapshot(collection(db, 'notifications'), (snap) => {
          if (!snap.empty) {
            const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setNotifications(list.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0)));
          }
        }, () => {});
      } catch (e) {}
    }

    // RTDB Fallback / Parallel Sync
    let unsubRtIssues = () => {};
    if (rtdb) {
      try {
        unsubRtIssues = onValue(ref(rtdb, 'issues'), (snap) => {
          if (snap.exists()) {
            const val = snap.val();
            const list = Object.keys(val).map(k => ({ id: k, ...val[k] }));
            setIssues(prev => {
              const map = new Map(prev.map(i => [i.id, i]));
              list.forEach(i => map.set(i.id, i));
              return Array.from(map.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            });
          }
        }, () => {});
      } catch (e) {}
    }

    return () => {
      unsubIssuesFs();
      unsubUpdatesFs();
      unsubRespFs();
      unsubRcFs();
      unsubKbFs();
      unsubDeptsFs();
      unsubNotifsFs();
      unsubRtIssues();
    };
  }, []);

  // 2. Real-Time BroadcastChannel Event Listener
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

  // Add / Report New Problem
  const addIssue = async (newIssueData, user) => {
    const newIssueId = `ISSUE-${Date.now()}`;
    const dept = departments.find(d => d.name === newIssueData.department) || departments[0];

    const issueObj = {
      id: newIssueId,
      farmerId: user.uid || user.id,
      farmerName: user.fullName || "Farmer",
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

    // Save to Firestore
    try {
      if (db) {
        await setDoc(doc(db, 'issues', newIssueId), issueObj);
        await setDoc(doc(db, 'issue_updates', firstUpdate.id), firstUpdate);
        await setDoc(doc(db, 'notifications', notif.id), notif);
      }
    } catch (err) {
      console.warn("Firestore addIssue notice (rule check):", err);
    }

    // Save to Realtime Database
    try {
      if (rtdb) {
        await set(ref(rtdb, `issues/${newIssueId}`), issueObj);
        await set(ref(rtdb, `issue_updates/${firstUpdate.id}`), firstUpdate);
        await set(ref(rtdb, `notifications/${notif.id}`), notif);
      }
    } catch (rtdbErr) {
      console.warn("RTDB addIssue notice:", rtdbErr);
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

  // Add Progress Update to Timeline
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

    const nextStatus = updateData.condition === "Resolved" ? "Resolved" : "Farmer Updating";

    try {
      if (db) {
        await setDoc(doc(db, 'issue_updates', updateObj.id), updateObj);
        await updateDoc(doc(db, 'issues', issueId), {
          status: nextStatus,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {}

    try {
      if (rtdb) {
        await set(ref(rtdb, `issue_updates/${updateObj.id}`), updateObj);
        await updateRt(ref(rtdb, `issues/${issueId}`), {
          status: nextStatus,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {}

    setIssueUpdates(prev => [updateObj, ...prev]);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: nextStatus, updatedAt: new Date().toISOString() } : i));

    realtimeService.broadcast('ISSUE_UPDATE_ADDED', updateObj);
    return updateObj;
  };

  // Expert Response & Treatment Prescription
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

    try {
      if (db) {
        await setDoc(doc(db, 'expert_responses', newResponse.id), newResponse);
        await updateDoc(doc(db, 'issues', responseObj.issueId), {
          status: nextStatus,
          assignedExpertId: expert.uid || expert.id,
          assignedExpertName: expert.fullName,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {}

    try {
      if (rtdb) {
        await set(ref(rtdb, `expert_responses/${newResponse.id}`), newResponse);
        await updateRt(ref(rtdb, `issues/${responseObj.issueId}`), {
          status: nextStatus,
          assignedExpertId: expert.uid || expert.id,
          assignedExpertName: expert.fullName,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {}

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

      try {
        if (db) await setDoc(doc(db, 'knowledge_articles', newKbArticle.id), newKbArticle);
      } catch (e) {}
      try {
        if (rtdb) await set(ref(rtdb, `knowledge_articles/${newKbArticle.id}`), newKbArticle);
      } catch (e) {}

      setKnowledgeArticles(prev => [newKbArticle, ...prev]);
      realtimeService.broadcast('KB_PUBLISHED', newKbArticle);
    }

    realtimeService.broadcast('EXPERT_DIAGNOSED', newResponse);
    return newResponse;
  };

  // Convert Issue to Scientific Research Case
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

    try {
      if (db) {
        await setDoc(doc(db, 'research_cases', newRcId), newRc);
        await updateDoc(doc(db, 'issues', issueId), {
          status: "Research Required",
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {}

    try {
      if (rtdb) {
        await set(ref(rtdb, `research_cases/${newRcId}`), newRc);
        await updateRt(ref(rtdb, `issues/${issueId}`), {
          status: "Research Required",
          updatedAt: new Date().toISOString()
        });
      }
    } catch (e) {}

    setResearchCases(prev => [newRc, ...prev]);
    setIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: "Research Required", updatedAt: new Date().toISOString() } : i));

    realtimeService.broadcast('RESEARCH_ESCALATED', newRc);
    return newRc;
  };

  // Update Research Case
  const updateResearchCase = async (rcId, updatedFields) => {
    try {
      if (db) {
        await updateDoc(doc(db, 'research_cases', rcId), {
          ...updatedFields,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
    } catch (err) {}

    try {
      if (rtdb) {
        await updateRt(ref(rtdb, `research_cases/${rcId}`), {
          ...updatedFields,
          lastUpdated: new Date().toISOString().split('T')[0]
        });
      }
    } catch (e) {}

    setResearchCases(prev => prev.map(rc => rc.id === rcId ? {
      ...rc,
      ...updatedFields,
      lastUpdated: new Date().toISOString().split('T')[0]
    } : rc));

    realtimeService.broadcast('RESEARCH_UPDATED', { rcId, updatedFields });
  };

  // Vote Knowledge Base Article Helpfulness
  const voteKnowledgeArticle = async (articleId, isHelpful) => {
    const target = knowledgeArticles.find(a => a.id === articleId);
    if (!target) return;

    const newYes = isHelpful ? target.helpfulYes + 1 : target.helpfulYes;
    const newNo = !isHelpful ? target.helpfulNo + 1 : target.helpfulNo;

    try {
      if (db) {
        await updateDoc(doc(db, 'knowledge_articles', articleId), {
          helpfulYes: newYes,
          helpfulNo: newNo
        });
      }
    } catch (e) {}

    try {
      if (rtdb) {
        await updateRt(ref(rtdb, `knowledge_articles/${articleId}`), {
          helpfulYes: newYes,
          helpfulNo: newNo
        });
      }
    } catch (e) {}

    setKnowledgeArticles(prev => prev.map(a => a.id === articleId ? { ...a, helpfulYes: newYes, helpfulNo: newNo } : a));
    realtimeService.broadcast('ARTICLE_VOTED', { articleId, isHelpful });
  };

  // Add Department Division
  const addDepartment = async (deptData) => {
    const newDept = {
      id: `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code || deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description || 'Division under State Directorate of Agriculture.',
      expertCount: deptData.expertCount || 0
    };

    try {
      if (db) await setDoc(doc(db, 'departments', newDept.id), newDept);
    } catch (err) {}

    try {
      if (rtdb) await set(ref(rtdb, `departments/${newDept.id}`), newDept);
    } catch (e) {}

    setDepartments(prev => [...prev, newDept]);
    realtimeService.broadcast('DEPARTMENT_ADDED', newDept);
    return newDept;
  };

  // Delete Department Division
  const deleteDepartment = async (deptId) => {
    try {
      if (db) await deleteDoc(doc(db, 'departments', deptId));
    } catch (err) {}

    try {
      if (rtdb) await removeRt(ref(rtdb, `departments/${deptId}`));
    } catch (e) {}

    setDepartments(prev => prev.filter(d => d.id !== deptId));
    realtimeService.broadcast('DEPARTMENT_DELETED', { id: deptId });
  };

  // Toggle Saved Solution Bookmarks
  const toggleSaveSolution = (articleId) => {
    setSavedSolutions(prev => prev.includes(articleId) ? prev.filter(id => id !== articleId) : [...prev, articleId]);
  };

  // Mark Notification Read
  const markNotificationRead = async (notifId) => {
    try {
      if (db) await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (e) {}

    try {
      if (rtdb) await updateRt(ref(rtdb, `notifications/${notifId}`), { read: true });
    } catch (e) {}

    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  return (
    <DataContext.Provider value={{
      departments,
      issues,
      issueUpdates,
      expertResponses,
      researchCases,
      knowledgeArticles,
      notifications,
      savedSolutions,
      addIssue,
      addIssueUpdate,
      addExpertResponse,
      convertToResearchCase,
      updateResearchCase,
      voteKnowledgeArticle,
      addDepartment,
      deleteDepartment,
      toggleSaveSolution,
      markNotificationRead
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
