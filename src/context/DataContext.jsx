import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  INITIAL_DEPARTMENTS, 
  INITIAL_ISSUES, 
  INITIAL_ISSUE_UPDATES, 
  INITIAL_EXPERT_RESPONSES, 
  INITIAL_RESEARCH_CASES, 
  INITIAL_KNOWLEDGE_ARTICLES, 
  INITIAL_NOTIFICATIONS 
} from '../data/initialData';
import { realtimeService } from '../services/realtime';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_departments');
      return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
    } catch (e) {
      return INITIAL_DEPARTMENTS;
    }
  });

  const [issues, setIssues] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_issues');
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch (e) {
      return INITIAL_ISSUES;
    }
  });

  const [issueUpdates, setIssueUpdates] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_issue_updates');
      return saved ? JSON.parse(saved) : INITIAL_ISSUE_UPDATES;
    } catch (e) {
      return INITIAL_ISSUE_UPDATES;
    }
  });

  const [expertResponses, setExpertResponses] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_expert_responses');
      return saved ? JSON.parse(saved) : INITIAL_EXPERT_RESPONSES;
    } catch (e) {
      return INITIAL_EXPERT_RESPONSES;
    }
  });

  const [researchCases, setResearchCases] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_research_cases');
      return saved ? JSON.parse(saved) : INITIAL_RESEARCH_CASES;
    } catch (e) {
      return INITIAL_RESEARCH_CASES;
    }
  });

  const [knowledgeArticles, setKnowledgeArticles] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_knowledge_articles');
      return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_ARTICLES;
    } catch (e) {
      return INITIAL_KNOWLEDGE_ARTICLES;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [savedSolutions, setSavedSolutions] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_saved_solutions');
      return saved ? JSON.parse(saved) : ['KB-201', 'KB-203'];
    } catch (e) {
      return ['KB-201', 'KB-203'];
    }
  });

  // Save changes to localStorage safely
  useEffect(() => { try { localStorage.setItem('farmconnect_departments', JSON.stringify(departments)); } catch (e) {} }, [departments]);
  useEffect(() => { try { localStorage.setItem('farmconnect_issues', JSON.stringify(issues)); } catch (e) {} }, [issues]);
  useEffect(() => { try { localStorage.setItem('farmconnect_issue_updates', JSON.stringify(issueUpdates)); } catch (e) {} }, [issueUpdates]);
  useEffect(() => { try { localStorage.setItem('farmconnect_expert_responses', JSON.stringify(expertResponses)); } catch (e) {} }, [expertResponses]);
  useEffect(() => { try { localStorage.setItem('farmconnect_research_cases', JSON.stringify(researchCases)); } catch (e) {} }, [researchCases]);
  useEffect(() => { try { localStorage.setItem('farmconnect_knowledge_articles', JSON.stringify(knowledgeArticles)); } catch (e) {} }, [knowledgeArticles]);
  useEffect(() => { try { localStorage.setItem('farmconnect_notifications', JSON.stringify(notifications)); } catch (e) {} }, [notifications]);
  useEffect(() => { try { localStorage.setItem('farmconnect_saved_solutions', JSON.stringify(savedSolutions)); } catch (e) {} }, [savedSolutions]);

  // Real-time synchronization listener for cross-tab multi-client actions
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((payload) => {
      const { type, data } = payload;
      if (!data) return;

      switch (type) {
        case 'ISSUE_CREATED':
          setIssues(prev => {
            if (prev.some(i => i.id === data.id)) return prev;
            return [data, ...prev];
          });
          if (data.firstUpdate) {
            setIssueUpdates(prev => [data.firstUpdate, ...prev]);
          }
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
          }
          break;

        case 'ISSUE_UPDATE_ADDED':
          setIssueUpdates(prev => {
            if (prev.some(u => u.id === data.id)) return prev;
            return [data, ...prev];
          });
          setIssues(prev => prev.map(issue => {
            if (issue.id === data.issueId) {
              return {
                ...issue,
                status: data.condition === "Resolved" ? "Resolved" : "Farmer Updating",
                updatedAt: new Date().toISOString()
              };
            }
            return issue;
          }));
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
          }
          break;

        case 'EXPERT_DIAGNOSED':
          setExpertResponses(prev => {
            if (prev.some(r => r.id === data.id)) return prev;
            return [data, ...prev];
          });
          setIssues(prev => prev.map(issue => {
            if (issue.id === data.issueId) {
              return {
                ...issue,
                status: data.isResolved ? "Resolved" : "Expert Responded",
                updatedAt: new Date().toISOString()
              };
            }
            return issue;
          }));
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
          }
          break;

        case 'KB_PUBLISHED':
          setKnowledgeArticles(prev => {
            if (prev.some(a => a.id === data.id)) return prev;
            return [data, ...prev];
          });
          break;

        case 'RESEARCH_ESCALATED':
          setResearchCases(prev => {
            if (prev.some(r => r.id === data.id)) return prev;
            return [data, ...prev];
          });
          setIssues(prev => prev.map(issue => {
            if (issue.id === data.issueId) {
              return {
                ...issue,
                status: "Research Required",
                updatedAt: new Date().toISOString()
              };
            }
            return issue;
          }));
          if (data.notification) {
            setNotifications(prev => [data.notification, ...prev]);
          }
          break;

        case 'RESEARCH_UPDATED':
          setResearchCases(prev => prev.map(rc => rc.id === data.rcId ? { ...rc, ...data.updatedFields } : rc));
          break;

        case 'ARTICLE_VOTED':
          setKnowledgeArticles(prev => prev.map(art => {
            if (art.id === data.articleId) {
              return {
                ...art,
                helpfulYes: data.isHelpful ? art.helpfulYes + 1 : art.helpfulYes,
                helpfulNo: !data.isHelpful ? art.helpfulNo + 1 : art.helpfulNo
              };
            }
            return art;
          }));
          break;

        case 'ISSUE_REASSIGNED':
          setIssues(prev => prev.map(issue => {
            if (issue.id === data.issueId) {
              return {
                ...issue,
                assignedExpertId: data.expertId,
                assignedExpertName: data.expertName,
                status: issue.status === 'Submitted' ? 'Assigned' : issue.status,
                updatedAt: new Date().toISOString()
              };
            }
            return issue;
          }));
          break;

        case 'DEPARTMENT_ADDED':
          setDepartments(prev => {
            if (prev.some(d => d.id === data.id)) return prev;
            return [...prev, data];
          });
          break;

        case 'DEPARTMENT_UPDATED':
          setDepartments(prev => prev.map(d => d.id === data.id ? { ...d, ...data.updatedFields } : d));
          break;

        case 'DEPARTMENT_DELETED':
          setDepartments(prev => prev.filter(d => d.id !== data.id));
          break;

        case 'DATA_RESET':
          setDepartments(INITIAL_DEPARTMENTS);
          setIssues(INITIAL_ISSUES);
          setIssueUpdates(INITIAL_ISSUE_UPDATES);
          setExpertResponses(INITIAL_EXPERT_RESPONSES);
          setResearchCases(INITIAL_RESEARCH_CASES);
          setKnowledgeArticles(INITIAL_KNOWLEDGE_ARTICLES);
          setNotifications(INITIAL_NOTIFICATIONS);
          setSavedSolutions(['KB-201', 'KB-203']);
          break;

        default:
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  // Helper to find best expert for a department
  const findExpertForDepartment = (deptName) => {
    try {
      const savedUsers = localStorage.getItem('farmconnect_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        const matchingExpert = parsedUsers.find(u => 
          u.role === 'Agricultural Expert / Researcher' && 
          u.status === 'Approved' && 
          (u.department?.toLowerCase() === deptName?.toLowerCase())
        );
        if (matchingExpert) return matchingExpert;

        // Fallback to any approved expert
        const anyExpert = parsedUsers.find(u => 
          u.role === 'Agricultural Expert / Researcher' && 
          u.status === 'Approved'
        );
        if (anyExpert) return anyExpert;
      }
    } catch (e) {}

    return { id: "usr_expert_1", fullName: "Dr. Anil Sharma" };
  };

  // Report Problem
  const addIssue = (newIssueData, user) => {
    const issueNumber = 1024 + issues.length + Math.floor(Math.random() * 10);
    const newIssueId = `FC-${issueNumber}`;

    const dept = departments.find(d => d.id === newIssueData.departmentId) || departments[0];
    const assignedExpert = findExpertForDepartment(dept.name);

    const issueObj = {
      id: newIssueId,
      farmerId: user.id,
      farmerName: user.fullName || "Farmer",
      farmerMobile: user.mobileNumber || "N/A",
      title: newIssueData.title,
      cropName: newIssueData.cropName,
      cropCategory: newIssueData.cropCategory || "General",
      cropVariety: newIssueData.cropVariety || "Standard",
      growthStage: newIssueData.growthStage || "Not specified",
      firstNoticedDate: newIssueData.firstNoticedDate || new Date().toISOString().split('T')[0],
      category: newIssueData.category,
      description: newIssueData.description,
      images: newIssueData.images?.length > 0 ? newIssueData.images : ["https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80"],
      state: newIssueData.state || "Maharashtra",
      district: newIssueData.district || user.district || "Jalgaon",
      taluka: newIssueData.taluka || user.taluka || "Central",
      village: newIssueData.village || user.village || "Main",
      coordinates: newIssueData.coordinates || "20.4625° N, 75.0189° E",
      departmentId: dept.id,
      departmentName: dept.name,
      assignedExpertId: assignedExpert.id,
      assignedExpertName: assignedExpert.fullName,
      status: "Submitted",
      priority: newIssueData.priority || "Medium",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Initial timeline entry
    const firstUpdate = {
      id: `upd_${Date.now()}`,
      issueId: newIssueId,
      farmerId: user.id,
      date: new Date().toISOString().split('T')[0],
      description: `Problem first reported by farmer: ${newIssueData.title}`,
      condition: "Same",
      image: issueObj.images[0] || null,
      createdAt: new Date().toISOString()
    };

    setIssues(prev => [issueObj, ...prev]);
    setIssueUpdates(prev => [firstUpdate, ...prev]);

    // Send Notification to Experts & Admin
    const notif = {
      id: `notif_${Date.now()}`,
      userId: assignedExpert.id,
      title: "New Crop Problem Assigned",
      message: `A new ${newIssueData.cropName} issue (${newIssueId}) has been assigned to ${dept.name}.`,
      read: false,
      timestamp: new Date().toISOString(),
      link: `/expert/cases/${newIssueId}`
    };
    setNotifications(prev => [notif, ...prev]);

    // Broadcast in Real-Time to all clients and open tabs
    realtimeService.broadcast('ISSUE_CREATED', {
      ...issueObj,
      firstUpdate,
      notification: notif
    });

    return issueObj;
  };

  // Add Progress Update to Timeline
  const addIssueUpdate = (issueId, userId, updateData) => {
    const updateObj = {
      id: `upd_${Date.now()}`,
      issueId,
      farmerId: userId,
      date: updateData.date || new Date().toISOString().split('T')[0],
      description: updateData.description,
      condition: updateData.condition, // Improving, Same, Getting Worse, Resolved
      image: updateData.image || null,
      createdAt: new Date().toISOString()
    };

    setIssueUpdates(prev => [updateObj, ...prev]);

    // Update Issue status
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        let nextStatus = issue.status;
        if (updateData.condition === "Resolved") {
          nextStatus = "Resolved";
        } else {
          nextStatus = "Farmer Updating";
        }
        return {
          ...issue,
          status: nextStatus,
          updatedAt: new Date().toISOString()
        };
      }
      return issue;
    }));

    // Notify assigned expert
    const targetIssue = issues.find(i => i.id === issueId);
    let notif = null;
    if (targetIssue) {
      notif = {
        id: `notif_${Date.now()}`,
        userId: targetIssue.assignedExpertId || "usr_expert_1",
        title: "Farmer Progress Update",
        message: `Farmer added an update ('${updateData.condition}') to case ${issueId}.`,
        read: false,
        timestamp: new Date().toISOString(),
        link: `/expert/cases/${issueId}`
      };
      setNotifications(prev => [notif, ...prev]);
    }

    // Broadcast in Real-Time
    realtimeService.broadcast('ISSUE_UPDATE_ADDED', {
      ...updateObj,
      notification: notif
    });

    return updateObj;
  };

  // Reassign Issue to an Expert
  const reassignIssue = (issueId, expertId, expertName) => {
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          assignedExpertId: expertId,
          assignedExpertName: expertName,
          status: issue.status === 'Submitted' ? 'Assigned' : issue.status,
          updatedAt: new Date().toISOString()
        };
      }
      return issue;
    }));

    const notif = {
      id: `notif_${Date.now()}`,
      userId: expertId,
      title: "Crop Case Reassigned",
      message: `Case ${issueId} has been reassigned to you for diagnosis.`,
      read: false,
      timestamp: new Date().toISOString(),
      link: `/expert/cases/${issueId}`
    };
    setNotifications(prev => [notif, ...prev]);

    realtimeService.broadcast('ISSUE_REASSIGNED', {
      issueId,
      expertId,
      expertName
    });
  };

  // Expert Response
  const addExpertResponse = (responseObj, expert) => {
    const newResponse = {
      id: `resp_${Date.now()}`,
      issueId: responseObj.issueId,
      expertId: expert.id,
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

    setExpertResponses(prev => [newResponse, ...prev]);

    // Update Issue Status
    setIssues(prev => prev.map(issue => {
      if (issue.id === responseObj.issueId) {
        return {
          ...issue,
          status: responseObj.isResolved ? "Resolved" : "Expert Responded",
          updatedAt: new Date().toISOString()
        };
      }
      return issue;
    }));

    // If published to KB, add to knowledge base
    let newKbArticle = null;
    if (responseObj.publishToKb) {
      const targetIssue = issues.find(i => i.id === responseObj.issueId);
      newKbArticle = {
        id: `KB-${200 + knowledgeArticles.length + 1}`,
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
        views: 12,
        image: targetIssue?.images[0] || "https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=800&q=80",
        relatedIssues: [responseObj.issueId]
      };
      setKnowledgeArticles(prev => [newKbArticle, ...prev]);
      realtimeService.broadcast('KB_PUBLISHED', newKbArticle);
    }

    // Notify Farmer
    const targetIssue = issues.find(i => i.id === responseObj.issueId);
    let notif = null;
    if (targetIssue) {
      notif = {
        id: `notif_${Date.now()}`,
        userId: targetIssue.farmerId,
        title: "Expert Response Received",
        message: `${expert.fullName} has submitted expert guidance for your case ${responseObj.issueId}.`,
        read: false,
        timestamp: new Date().toISOString(),
        link: `/farmer/issues/${responseObj.issueId}`
      };
      setNotifications(prev => [notif, ...prev]);
    }

    // Broadcast in Real-Time
    realtimeService.broadcast('EXPERT_DIAGNOSED', {
      ...newResponse,
      notification: notif
    });

    return newResponse;
  };

  // Convert Issue to Research Case
  const convertToResearchCase = (issueId, researchDetails, expert) => {
    const targetIssue = issues.find(i => i.id === issueId);
    const rcNumber = 500 + researchCases.length + 1;
    const newRcId = `RC-${rcNumber}`;

    const newRc = {
      id: newRcId,
      issueId,
      title: researchDetails.title || `Research Case for ${targetIssue?.cropName || 'Crop'} - ${targetIssue?.title}`,
      crop: targetIssue?.cropName || "General",
      category: targetIssue?.category || "Unknown Problem",
      description: targetIssue?.description || "Investigation required.",
      assignedResearchers: [expert.fullName],
      department: targetIssue?.departmentName || expert.department || "Plant Pathology",
      status: "Investigation Started",
      startDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      researchNotes: researchDetails.notes || "Case converted to research investigation.",
      findings: researchDetails.findings || "Initial sample collection under progress.",
      attachments: [],
      conclusion: "Under scientific study."
    };

    setResearchCases(prev => [newRc, ...prev]);

    // Update Issue status to Research Required
    setIssues(prev => prev.map(issue => {
      if (issue.id === issueId) {
        return {
          ...issue,
          status: "Research Required",
          updatedAt: new Date().toISOString()
        };
      }
      return issue;
    }));

    // Notify farmer
    let notif = null;
    if (targetIssue) {
      notif = {
        id: `notif_${Date.now()}`,
        userId: targetIssue.farmerId,
        title: "Case Marked for Research",
        message: `Your issue ${issueId} has been escalated to Agriculture Research Department for detailed study (${newRcId}).`,
        read: false,
        timestamp: new Date().toISOString(),
        link: `/farmer/issues/${issueId}`
      };
      setNotifications(prev => [notif, ...prev]);
    }

    // Broadcast in Real-Time
    realtimeService.broadcast('RESEARCH_ESCALATED', {
      ...newRc,
      notification: notif
    });

    return newRc;
  };

  // Update Research Case status
  const updateResearchCase = (rcId, updatedFields) => {
    setResearchCases(prev => prev.map(rc => {
      if (rc.id === rcId) {
        return {
          ...rc,
          ...updatedFields,
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return rc;
    }));

    realtimeService.broadcast('RESEARCH_UPDATED', {
      rcId,
      updatedFields
    });
  };

  // Vote Knowledge Base Article Helpfulness
  const voteKnowledgeArticle = (articleId, isHelpful) => {
    setKnowledgeArticles(prev => prev.map(art => {
      if (art.id === articleId) {
        return {
          ...art,
          helpfulYes: isHelpful ? art.helpfulYes + 1 : art.helpfulYes,
          helpfulNo: !isHelpful ? art.helpfulNo + 1 : art.helpfulNo
        };
      }
      return art;
    }));

    realtimeService.broadcast('ARTICLE_VOTED', {
      articleId,
      isHelpful
    });
  };

  // Department Management
  const addDepartment = (deptData) => {
    const newDept = {
      id: `dept_${Date.now()}`,
      name: deptData.name,
      code: deptData.code || deptData.name.substring(0, 4).toUpperCase(),
      description: deptData.description || 'Specialized division of State Agriculture Directorate.',
      expertCount: deptData.expertCount || 0
    };

    setDepartments(prev => [...prev, newDept]);
    realtimeService.broadcast('DEPARTMENT_ADDED', newDept);
    return newDept;
  };

  const updateDepartment = (deptId, updatedFields) => {
    setDepartments(prev => prev.map(d => d.id === deptId ? { ...d, ...updatedFields } : d));
    realtimeService.broadcast('DEPARTMENT_UPDATED', { id: deptId, updatedFields });
  };

  const deleteDepartment = (deptId) => {
    setDepartments(prev => prev.filter(d => d.id !== deptId));
    realtimeService.broadcast('DEPARTMENT_DELETED', { id: deptId });
  };

  // Toggle Saved Solution
  const toggleSaveSolution = (articleId) => {
    setSavedSolutions(prev => {
      if (prev.includes(articleId)) {
        return prev.filter(id => id !== articleId);
      } else {
        return [...prev, articleId];
      }
    });
  };

  // Mark notification read
  const markNotificationRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  // Reset to initial demo dataset
  const resetDemoData = () => {
    setDepartments(INITIAL_DEPARTMENTS);
    setIssues(INITIAL_ISSUES);
    setIssueUpdates(INITIAL_ISSUE_UPDATES);
    setExpertResponses(INITIAL_EXPERT_RESPONSES);
    setResearchCases(INITIAL_RESEARCH_CASES);
    setKnowledgeArticles(INITIAL_KNOWLEDGE_ARTICLES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSavedSolutions(['KB-201', 'KB-203']);

    localStorage.removeItem('farmconnect_departments');
    localStorage.removeItem('farmconnect_issues');
    localStorage.removeItem('farmconnect_issue_updates');
    localStorage.removeItem('farmconnect_expert_responses');
    localStorage.removeItem('farmconnect_research_cases');
    localStorage.removeItem('farmconnect_knowledge_articles');
    localStorage.removeItem('farmconnect_notifications');
    localStorage.removeItem('farmconnect_saved_solutions');

    realtimeService.broadcast('DATA_RESET', {});
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
      reassignIssue,
      addExpertResponse,
      convertToResearchCase,
      updateResearchCase,
      voteKnowledgeArticle,
      addDepartment,
      updateDepartment,
      deleteDepartment,
      toggleSaveSolution,
      markNotificationRead,
      resetDemoData
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
