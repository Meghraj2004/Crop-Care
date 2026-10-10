import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../data/initialData';
import { realtimeService } from '../services/realtime';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('farmconnect_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('farmconnect_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('farmconnect_users', JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users", e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        sessionStorage.setItem('farmconnect_current_user', JSON.stringify(currentUser));
      } else {
        sessionStorage.removeItem('farmconnect_current_user');
      }
    } catch (e) {
      console.error("Failed to save currentUser", e);
    }
  }, [currentUser]);

  // Real-time synchronization listener for user accounts across tabs
  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((payload) => {
      const { type, data } = payload;
      if (!data) return;

      switch (type) {
        case 'RESEARCHER_REGISTERED':
          setUsers(prev => {
            if (prev.some(u => u.id === data.id)) return prev;
            return [data, ...prev];
          });
          break;

        case 'RESEARCHER_APPROVED':
          setUsers(prev => prev.map(u => u.id === data.userId ? { ...u, status: "Approved", verifiedBadge: true } : u));
          setCurrentUser(prev => (prev?.id === data.userId ? { ...prev, status: "Approved", verifiedBadge: true } : prev));
          break;

        case 'RESEARCHER_REJECTED':
          setUsers(prev => prev.map(u => u.id === data.userId ? { ...u, status: "Rejected" } : u));
          setCurrentUser(prev => (prev?.id === data.userId ? { ...prev, status: "Rejected" } : prev));
          break;

        case 'USER_DELETED':
          setUsers(prev => prev.filter(u => u.id !== data.userId));
          setCurrentUser(prev => (prev?.id === data.userId ? null : prev));
          break;

        case 'USER_UPDATED':
          setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
          setCurrentUser(prev => (prev?.id === data.id ? { ...prev, ...data } : prev));
          break;

        case 'DATA_RESET':
          setUsers(INITIAL_USERS);
          break;

        default:
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  // Quick switch role for evaluation/demo
  const switchDemoRole = (userRole) => {
    if (userRole === 'Farmer') {
      const farmer = users.find(u => u.role === 'Farmer') || INITIAL_USERS[0];
      setCurrentUser(farmer);
      return farmer;
    } else if (userRole === 'Expert') {
      const expert = users.find(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Approved') || INITIAL_USERS[5];
      setCurrentUser(expert);
      return expert;
    } else if (userRole === 'Admin') {
      const admin = users.find(u => u.role === 'Agriculture Department Admin') || INITIAL_USERS[9];
      setCurrentUser(admin);
      return admin;
    }
  };

  const login = (email, password) => {
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) {
      throw new Error("No account found with this email address. Please check spelling or register a new account.");
    }
    
    // Strict password verification
    const expectedPassword = found.password || (found.role === 'Agriculture Department Admin' ? 'admin123' : 'password123');
    if (password !== expectedPassword) {
      throw new Error("Incorrect password. Please enter the password you set during registration.");
    }

    if (found.role === 'Agricultural Expert / Researcher' && found.status === 'Pending Approval') {
      throw new Error("Your researcher account is currently pending approval by the Agriculture Department Admin.");
    }
    setCurrentUser(found);
    return found;
  };

  const registerFarmer = (farmerData) => {
    const newUser = {
      id: `usr_farmer_${Date.now()}`,
      role: "Farmer",
      ...farmerData,
      status: "Active",
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);

    realtimeService.broadcast('USER_UPDATED', newUser);
    return newUser;
  };

  const registerResearcher = (researcherData) => {
    const newUser = {
      id: `usr_expert_${Date.now()}`,
      role: "Agricultural Expert / Researcher",
      ...researcherData,
      status: "Pending Approval", // Requires Admin Approval
      casesSolved: 0,
      verifiedBadge: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [newUser, ...prev]);

    // Broadcast in real-time so Admin panel immediately sees pending applicant
    realtimeService.broadcast('RESEARCHER_REGISTERED', newUser);
    return newUser;
  };

  const approveResearcher = (userId) => {
    const target = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Approved", verifiedBadge: true } : u));
    
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, status: "Approved", verifiedBadge: true }));
    }

    realtimeService.broadcast('RESEARCHER_APPROVED', {
      userId,
      fullName: target?.fullName
    });
  };

  const rejectResearcher = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Rejected" } : u));
    realtimeService.broadcast('RESEARCHER_REJECTED', { userId });
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      sessionStorage.removeItem('farmconnect_current_user');
      localStorage.removeItem('farmconnect_current_user');
    } catch (e) {}
  };

  const updateProfile = (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    realtimeService.broadcast('USER_UPDATED', updated);
  };

  const deleteAccount = (userId) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    setUsers(prev => {
      const updated = prev.filter(u => u.id !== targetId);
      localStorage.setItem('farmconnect_users', JSON.stringify(updated));
      return updated;
    });

    if (currentUser?.id === targetId) {
      setCurrentUser(null);
      sessionStorage.removeItem('farmconnect_current_user');
      localStorage.removeItem('farmconnect_current_user');
    }

    realtimeService.broadcast('USER_DELETED', { userId: targetId });
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      logout,
      registerFarmer,
      registerResearcher,
      approveResearcher,
      rejectResearcher,
      switchDemoRole,
      updateProfile,
      deleteAccount,
      isAuthenticated: Boolean(currentUser),
      isFarmer: currentUser?.role === 'Farmer',
      isExpert: currentUser?.role === 'Agricultural Expert / Researcher',
      isAdmin: currentUser?.role === 'Agriculture Department Admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
