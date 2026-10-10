import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
  rtdb,
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
import { 
  ref, 
  set, 
  get, 
  onValue, 
  remove 
} from 'firebase/database';
import { realtimeService } from '../services/realtime';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // Helper to determine if an email is the official Admin account
  const isSuperAdminEmail = (email = '') => {
    const clean = email.toLowerCase().trim();
    return clean === 'admin123@gamil.com' || clean === 'admin123@gmail.com' || clean === 'admin@cropcare.gov.in';
  };

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

          // Attempt read from Firestore
          if (db) {
            try {
              const userSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
              if (userSnap.exists()) {
                userProfile = { id: firebaseUser.uid, uid: firebaseUser.uid, ...userSnap.data() };
              }
            } catch (fsErr) {
              // Firestore rule might block read
            }
          }

          // Attempt read from RTDB if Firestore yielded nothing
          if (!userProfile && rtdb) {
            try {
              const rtdbSnap = await get(ref(rtdb, `users/${firebaseUser.uid}`));
              if (rtdbSnap.exists()) {
                userProfile = { id: firebaseUser.uid, uid: firebaseUser.uid, ...rtdbSnap.val() };
              }
            } catch (rtErr) {}
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
          } else if (userProfile) {
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userProfile
            });
          } else {
            // Fallback for non-admin
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              role: 'Farmer',
              status: 'Active'
            });
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
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              fullName: firebaseUser.displayName || 'User',
              role: 'Farmer',
              status: 'Active'
            });
          }
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-Time Users sync (Firestore + RTDB listener)
  useEffect(() => {
    let unsubFs = () => {};
    let unsubRt = () => {};

    if (db) {
      try {
        unsubFs = onSnapshot(collection(db, 'users'), (snapshot) => {
          if (!snapshot.empty) {
            const live = snapshot.docs.map(d => ({ id: d.id, uid: d.id, ...d.data() }));
            setUsers(prev => {
              const map = new Map(prev.map(u => [u.id, u]));
              live.forEach(u => map.set(u.id, u));
              return Array.from(map.values());
            });
          }
        }, () => {});
      } catch (e) {}
    }

    if (rtdb) {
      try {
        const usersRef = ref(rtdb, 'users');
        unsubRt = onValue(usersRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const list = Object.keys(data).map(k => ({ id: k, uid: k, ...data[k] }));
            setUsers(prev => {
              const map = new Map(prev.map(u => [u.id, u]));
              list.forEach(u => map.set(u.id, u));
              return Array.from(map.values());
            });
          }
        }, () => {});
      } catch (e) {}
    }

    return () => {
      unsubFs();
      unsubRt();
    };
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

  // Login handler
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

      // Write to both Firestore and RTDB
      try {
        if (db) await setDoc(doc(db, 'users', fbUser.uid), userProfile);
      } catch (e) {}
      try {
        if (rtdb) await set(ref(rtdb, `users/${fbUser.uid}`), userProfile);
      } catch (e) {}

      setCurrentUser(userProfile);
      return userProfile;
    }

    // Non-Admin: Fetch from Firestore or RTDB
    if (db) {
      try {
        const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
        if (userDoc.exists()) {
          userProfile = { id: fbUser.uid, uid: fbUser.uid, email: fbUser.email, ...userDoc.data() };
        }
      } catch (e) {}
    }

    if (!userProfile && rtdb) {
      try {
        const rtSnap = await get(ref(rtdb, `users/${fbUser.uid}`));
        if (rtSnap.exists()) {
          userProfile = { id: fbUser.uid, uid: fbUser.uid, email: fbUser.email, ...rtSnap.val() };
        }
      } catch (e) {}
    }

    if (!userProfile) {
      userProfile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email.split('@')[0],
        role: requiredRole || 'Farmer',
        status: 'Active'
      };
      try {
        if (db) await setDoc(doc(db, 'users', fbUser.uid), userProfile);
      } catch (e) {}
      try {
        if (rtdb) await set(ref(rtdb, `users/${fbUser.uid}`), userProfile);
      } catch (e) {}
    }

    // Role Guard
    if (requiredRole && userProfile.role !== requiredRole) {
      await signOut(auth);
      throw new Error(`Account role mismatch. This portal is for ${requiredRole}s, but this account is registered as a ${userProfile.role}.`);
    }

    setCurrentUser(userProfile);
    return userProfile;
  };

  // Register Farmer with Firebase Auth & Cloud Sync
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

    try {
      if (db) await setDoc(doc(db, 'users', fbUser.uid), newFarmer);
    } catch (e) {
      console.warn("Firestore farmer write notice:", e);
    }

    try {
      if (rtdb) await set(ref(rtdb, `users/${fbUser.uid}`), newFarmer);
    } catch (e) {
      console.warn("RTDB farmer write notice:", e);
    }

    setCurrentUser(newFarmer);
    setUsers(prev => [newFarmer, ...prev]);
    realtimeService.broadcast('USER_UPDATED', newFarmer);

    return newFarmer;
  };

  // Admin Adds / Provisions a Certified Expert / Researcher
  const addExpert = async (expertData) => {
    const cleanEmail = expertData.email.trim();
    let expertUid = `EXP-${Date.now()}`;

    // Create Firebase Auth user if password provided using secondary app
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

    // Save to Firestore
    try {
      if (db) await setDoc(doc(db, 'users', expertUid), newExpert);
    } catch (e) {
      console.warn("Firestore addExpert write notice:", e);
    }

    // Save to Realtime Database
    try {
      if (rtdb) await set(ref(rtdb, `users/${expertUid}`), newExpert);
    } catch (e) {
      console.warn("RTDB addExpert write notice:", e);
    }

    setUsers(prev => [newExpert, ...prev.filter(u => u.id !== expertUid)]);
    realtimeService.broadcast('EXPERT_ADDED', newExpert);

    return newExpert;
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    const targetId = currentUser.uid || currentUser.id;
    const updated = { ...currentUser, ...updatedData };

    try {
      if (db) await updateDoc(doc(db, 'users', targetId), updatedData);
    } catch (e) {}

    try {
      if (rtdb) await set(ref(rtdb, `users/${targetId}`), updated);
    } catch (e) {}

    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === targetId ? updated : u));
    realtimeService.broadcast('USER_UPDATED', updated);
  };

  // Delete User Account / Admin Removes Expert
  const deleteAccount = async (userId) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    try {
      if (db) await deleteDoc(doc(db, 'users', targetId));
    } catch (e) {}

    try {
      if (rtdb) await remove(ref(rtdb, `users/${targetId}`));
    } catch (e) {}

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
