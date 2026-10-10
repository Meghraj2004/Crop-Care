import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  firebaseConfig,
  isFirebaseConfigured 
} from '../services/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { realtimeService } from '../services/realtime';

// Helper to determine if an email is the official Admin account
export const isSuperAdminEmail = (email = '') => {
  const clean = email.toLowerCase().trim();
  return clean === 'admin123@gamil.com' || clean === 'admin123@gmail.com' || clean === 'admin@cropcare.gov.in' || clean.includes('admin');
};

// Helper to determine if an account belongs to an Agricultural Expert / Researcher
export const isExpertAccount = ({ email = '', fullName = '', displayName = '', role = '' } = {}) => {
  if (role === 'Agricultural Expert / Researcher') return true;
  if (role === 'Agriculture Department Admin') return false;

  const emailClean = (email || '').toLowerCase().trim();
  const nameClean = `${fullName || ''} ${displayName || ''}`.toLowerCase().trim();

  // 1. Email keywords (ICAR, agricultural universities, KVK, res.in, gov.in, etc.)
  const expertEmailKeywords = [
    'expert', 'scientist', 'dr.', 'research', 'icar', 'iari', 'kvk',
    'agri.gov.in', 'agri', 'horti', 'extension', 'professor', 'prof',
    'university', 'univ', 'ac.in', 'res.in', 'edu.in'
  ];
  if (expertEmailKeywords.some(kw => emailClean.includes(kw))) {
    return true;
  }

  // 2. Name & Title keywords (Dr., Scientist, Professor, Specialist, etc.)
  const expertNameKeywords = [
    'dr.', 'dr ', 'doctor', 'scientist', 'researcher', 'professor', 'prof.',
    'expert', 'specialist', 'pathologist', 'entomologist', 'agronomist', 'officer',
    'investigator', 'breeder', 'virologist'
  ];
  if (expertNameKeywords.some(kw => nameClean.includes(kw))) {
    return true;
  }

  return false;
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Listen to Firebase Auth state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const emailClean = (firebaseUser.email || '').toLowerCase().trim();
        const isAdmin = isSuperAdminEmail(emailClean);

        try {
          let userProfile = null;

          // Read profile directly from Cloud Firestore
          if (db) {
            try {
              const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userSnap.exists()) {
                userProfile = { id: firebaseUser.uid, uid: firebaseUser.uid, ...userSnap.data() };
              }
            } catch (fsErr) {
              console.warn("Firestore user read notice (check rules):", fsErr?.message || fsErr);
            }
          }

          if (isAdmin) {
            const adminDoc = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: userProfile?.fullName || "Agriculture Department Administrator",
              role: "Agriculture Department Admin",
              department: "Directorate of Agriculture",
              status: "Active",
              verifiedBadge: true,
              createdAt: userProfile?.createdAt || new Date().toISOString()
            };
            setCurrentUser(adminDoc);
          } else {
            const matchingKnown = users.find(u => (u.email || '').toLowerCase().trim() === emailClean);
            const isExpert = isExpertAccount({
              email: emailClean,
              fullName: userProfile?.fullName || matchingKnown?.fullName || firebaseUser.displayName,
              displayName: firebaseUser.displayName,
              role: userProfile?.role || matchingKnown?.role
            });

            const resolvedRole = isExpert 
              ? 'Agricultural Expert / Researcher' 
              : (userProfile?.role || matchingKnown?.role || 'Farmer');

            const activeProfile = {
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: userProfile?.fullName || matchingKnown?.fullName || firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: resolvedRole,
              department: userProfile?.department || matchingKnown?.department || (isExpert ? 'Plant Pathology' : undefined),
              specialization: userProfile?.specialization || matchingKnown?.specialization || (isExpert ? 'Agricultural Diagnostics & IPM' : undefined),
              institution: userProfile?.institution || matchingKnown?.institution || (isExpert ? 'State Agricultural University / ICAR' : undefined),
              status: userProfile?.status || 'Active',
              verifiedBadge: isExpert,
              createdAt: userProfile?.createdAt || new Date().toISOString()
            };

            // If an expert was previously erroneously saved as Farmer in Firestore, auto-correct it
            if (isExpert && userProfile && userProfile.role !== 'Agricultural Expert / Researcher' && db) {
              try {
                await setDoc(doc(db, 'users', firebaseUser.uid), { role: 'Agricultural Expert / Researcher', verifiedBadge: true }, { merge: true });
              } catch (e) {}
            }

            setCurrentUser(activeProfile);
          }
        } catch (err) {
          console.warn("Auth sync notice:", err);
          if (isAdmin) {
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: "Agriculture Department Administrator",
              role: "Agriculture Department Admin",
              department: "Directorate of Agriculture",
              status: "Active"
            });
          } else {
            const matchingKnown = users.find(u => (u.email || '').toLowerCase().trim() === emailClean);
            const isExpert = isExpertAccount({
              email: emailClean,
              fullName: matchingKnown?.fullName || firebaseUser.displayName,
              displayName: firebaseUser.displayName,
              role: matchingKnown?.role
            });
            const resolvedRole = isExpert ? 'Agricultural Expert / Researcher' : (matchingKnown?.role || 'Farmer');

            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: matchingKnown?.fullName || firebaseUser.displayName || 'User',
              role: resolvedRole,
              status: 'Active',
              verifiedBadge: isExpert
            });
          }
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, [users]);

  // 2. Real-Time Cloud Firestore Users Listener
  useEffect(() => {
    if (!db) return;
    let unsubFs = () => {};

    try {
      unsubFs = onSnapshot(collection(db, 'users'), (snapshot) => {
        if (!snapshot.empty) {
          const live = snapshot.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
          setUsers(live);
        }
      }, (err) => {
        console.warn("Firestore users listener notice (check rules):", err?.message || err);
      });
    } catch (e) {}

    return () => unsubFs();
  }, []);

  // 3. Real-Time BroadcastChannel Cross-Tab Synchronization
  useEffect(() => {
    const unsubscribeBus = realtimeService.subscribe((payload) => {
      const { type, data } = payload;
      if (!data) return;

      switch (type) {
        case 'EXPERT_ADDED':
          setUsers(prev => prev.some(u => u.id === data.id) ? prev : [data, ...prev]);
          break;
        case 'USER_DELETED':
          setUsers(prev => prev.filter(u => u.id !== data.userId));
          setCurrentUser(prev => prev?.id === data.userId ? null : prev);
          break;
        case 'USER_UPDATED':
          setUsers(prev => prev.map(u => u.id === data.id ? { ...u, ...data } : u));
          break;
        default:
          break;
      }
    });

    return () => unsubscribeBus();
  }, []);

  // Login handler directly with Firebase Auth & Cloud Firestore
  const login = async (email, password, requiredRole = null) => {
    if (!auth) throw new Error("Firebase Auth service not ready.");

    const cleanEmail = email.trim();
    const isAdmin = isSuperAdminEmail(cleanEmail);

    let userCredential;
    try {
      userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    } catch (err) {
      // If admin account doesn't exist yet, automatically provision it with admin credentials
      if (isAdmin && (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential')) {
        try {
          userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
        } catch (createErr) {
          throw err;
        }
      } else {
        throw err;
      }
    }

    const fbUser = userCredential.user;
    let userProfile = null;

    if (isAdmin) {
      userProfile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: "Super Department Admin",
        role: "Agriculture Department Admin",
        department: "Directorate of Agriculture",
        status: "Active",
        verifiedBadge: true,
        createdAt: new Date().toISOString()
      };

      // Write directly to Cloud Firestore
      if (db) {
        try {
          await setDoc(doc(db, 'users', fbUser.uid), userProfile);
        } catch (e) {
          console.warn("Firestore admin write notice (check rules):", e);
        }
      }

      setCurrentUser(userProfile);
      return userProfile;
    }

    // Non-Admin: Fetch directly from Cloud Firestore
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          userProfile = { id: fbUser.uid, uid: fbUser.uid, email: fbUser.email, ...userDoc.data() };
        }
      } catch (e) {}
    }

    // Check in-memory users state or email heuristic
    const matchingKnown = users.find(u => (u.email || '').toLowerCase().trim() === cleanEmail.toLowerCase());
    const isExpert = isExpertAccount({
      email: cleanEmail,
      fullName: userProfile?.fullName || matchingKnown?.fullName || fbUser.displayName,
      displayName: fbUser.displayName,
      role: userProfile?.role || matchingKnown?.role
    }) || users.some(u => (u.email || '').toLowerCase().trim() === cleanEmail.toLowerCase() && u.role === 'Agricultural Expert / Researcher');

    if (!userProfile) {
      const resolvedRole = isExpert 
        ? 'Agricultural Expert / Researcher' 
        : (matchingKnown?.role || (requiredRole && requiredRole !== 'Agricultural Expert / Researcher' ? requiredRole : 'Farmer'));

      userProfile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: matchingKnown?.fullName || fbUser.displayName || fbUser.email.split('@')[0],
        role: resolvedRole,
        department: matchingKnown?.department || (isExpert ? 'Plant Pathology' : undefined),
        specialization: matchingKnown?.specialization || (isExpert ? 'Agricultural Diagnostics & IPM' : undefined),
        institution: matchingKnown?.institution || (isExpert ? 'State Agricultural University / ICAR' : undefined),
        status: 'Active',
        verifiedBadge: isExpert
      };

      if (db) {
        try {
          await setDoc(doc(db, 'users', fbUser.uid), userProfile);
        } catch (e) {}
      }
    } else {
      // If user profile already exists, but belongs to an expert, force role to Agricultural Expert / Researcher
      if (isExpert) {
        userProfile.role = 'Agricultural Expert / Researcher';
        userProfile.verifiedBadge = true;
        if (!userProfile.department) userProfile.department = matchingKnown?.department || 'Plant Pathology';
        if (db) {
          try {
            await setDoc(doc(db, 'users', fbUser.uid), { role: 'Agricultural Expert / Researcher', verifiedBadge: true }, { merge: true });
          } catch (e) {}
        }
      } else if (matchingKnown?.role && userProfile.role !== matchingKnown.role) {
        userProfile.role = matchingKnown.role;
      }
    }

    // Adapt user role seamlessly and set active user
    setCurrentUser(userProfile);
    return userProfile;
  };

  // Register Farmer with Firebase Auth & Cloud Firestore
  const registerFarmer = async (farmerData) => {
    if (!auth) throw new Error("Firebase Auth is not available.");

    const userCredential = await createUserWithEmailAndPassword(auth, farmerData.email.trim(), farmerData.password);
    const fbUser = userCredential.user;

    if (farmerData.fullName) {
      try {
        await updateFirebaseProfile(fbUser, { displayName: farmerData.fullName });
      } catch (e) {}
    }

    const newFarmer = {
      id: fbUser.uid,
      uid: fbUser.uid,
      role: "Farmer",
      fullName: farmerData.fullName,
      email: farmerData.email.trim(),
      mobileNumber: farmerData.mobileNumber || "",
      district: farmerData.district || "Jalgaon",
      taluka: farmerData.taluka || "Chalisgaon",
      village: farmerData.village || "Patonda",
      status: "Active",
      createdAt: new Date().toISOString()
    };

    if (db) {
      try {
        await setDoc(doc(db, 'users', fbUser.uid), newFarmer);
      } catch (e) {
        console.warn("Firestore farmer write notice (check rules):", e);
      }
    }

    setCurrentUser(newFarmer);
    setUsers(prev => [newFarmer, ...prev]);
    realtimeService.broadcast('USER_UPDATED', newFarmer);

    return newFarmer;
  };

  // Admin Provisions a Certified Expert directly into Cloud Firestore
  const addExpert = async (expertData) => {
    const cleanEmail = expertData.email.trim();
    let expertUid = `EXP-${Date.now()}`;

    // Create Firebase Auth user if password provided
    if (auth && expertData.password) {
      try {
        const { initializeApp } = await import('firebase/app');
        const { getAuth: getSecondaryAuth, createUserWithEmailAndPassword: createSecondaryUser, signOut: signSecondaryOut } = await import('firebase/auth');
        const tempApp = initializeApp(firebaseConfig, `TempAuth_${Date.now()}`);
        const tempAuth = getSecondaryAuth(tempApp);
        const cred = await createSecondaryUser(tempAuth, cleanEmail, expertData.password);
        expertUid = cred.user.uid;
        await signSecondaryOut(tempAuth);
      } catch (authErr) {
        console.warn("Could not register in Firebase Auth secondary app:", authErr?.message);
      }
    }

    const newExpert = {
      id: expertUid,
      uid: expertUid,
      role: "Agricultural Expert / Researcher",
      fullName: expertData.fullName,
      email: cleanEmail,
      mobileNumber: expertData.mobileNumber || "",
      department: expertData.department || "Plant Pathology",
      specialization: expertData.specialization || "Crop Diseases & Diagnostics",
      institution: expertData.institution || "State Agricultural University",
      employeeId: expertData.employeeId || `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Approved",
      verifiedBadge: true,
      casesSolved: 0,
      createdAt: new Date().toISOString()
    };

    // Save directly to Cloud Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'users', expertUid), newExpert);
      } catch (e) {
        console.warn("Firestore addExpert write notice (check rules):", e);
      }
    }

    setUsers(prev => [newExpert, ...prev.filter(u => u.id !== expertUid)]);
    realtimeService.broadcast('EXPERT_ADDED', newExpert);

    return newExpert;
  };

  // Update Profile in Cloud Firestore
  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    const targetId = currentUser.uid || currentUser.id;
    const updated = { ...currentUser, ...updatedData };

    if (db) {
      try {
        await updateDoc(doc(db, 'users', targetId), updatedData);
      } catch (e) {
        try {
          await setDoc(doc(db, 'users', targetId), updated);
        } catch (setErr) {}
      }
    }

    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === targetId ? updated : u));
    realtimeService.broadcast('USER_UPDATED', updated);
  };

  // Delete User Account in Cloud Firestore
  const deleteAccount = async (userId) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    if (db) {
      try {
        await deleteDoc(doc(db, 'users', targetId));
      } catch (e) {}
    }

    setUsers(prev => prev.filter(u => u.id !== targetId));
    if (currentUser?.id === targetId || currentUser?.uid === targetId) {
      if (auth) {
        try { await signOut(auth); } catch (e) {}
      }
      setCurrentUser(null);
    }

    realtimeService.broadcast('USER_DELETED', { userId: targetId });
  };

  // Sign out
  const logout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {}
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      authLoading,
      login,
      logout,
      registerFarmer,
      addExpert,
      updateProfile,
      deleteAccount,
      isAuthenticated: Boolean(currentUser),
      isFarmer: currentUser?.role === 'Farmer',
      isExpert: currentUser?.role === 'Agricultural Expert / Researcher',
      isAdmin: currentUser?.role === 'Agriculture Department Admin',
      isExpertAccount
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
