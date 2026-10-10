import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  db, 
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

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  // 1. Firebase Authentication State Listener
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch user profile from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setCurrentUser({
              id: firebaseUser.uid,
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userData
            });
          } else {
            // Profile doc doesn't exist yet, fallback to basic auth info
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
          console.warn("Firestore user profile fetch notice:", err?.message || err);
          setCurrentUser({
            id: firebaseUser.uid,
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            fullName: firebaseUser.displayName || 'User',
            role: 'Farmer',
            status: 'Active'
          });
        }
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 2. Real-Time Firestore Users Collection Listener
  useEffect(() => {
    if (!db) return;

    let unsubscribeUsers = () => {};
    try {
      const usersColRef = collection(db, 'users');
      unsubscribeUsers = onSnapshot(usersColRef, (snapshot) => {
        const liveUsers = snapshot.docs.map(d => ({
          id: d.id,
          uid: d.id,
          ...d.data()
        }));
        setUsers(liveUsers);

        // If current user is logged in, sync their latest status (e.g. Approved badge)
        if (auth?.currentUser) {
          const selfDoc = liveUsers.find(u => u.id === auth.currentUser.uid);
          if (selfDoc) {
            setCurrentUser(prev => prev ? { ...prev, ...selfDoc } : selfDoc);
          }
        }
      }, (error) => {
        console.info("Firestore users live sync notice (rule fallback active):", error?.message || error);
      });
    } catch (e) {
      console.warn("Firestore users listener initialization error:", e);
    }

    return () => unsubscribeUsers();
  }, []);

  // 3. Real-Time BroadcastChannel Cross-Tab Synchronization
  useEffect(() => {
    const unsubscribeBus = realtimeService.subscribe((payload) => {
      const { type, data } = payload;
      if (!data) return;

      switch (type) {
        case 'RESEARCHER_REGISTERED':
          setUsers(prev => prev.some(u => u.id === data.id) ? prev : [data, ...prev]);
          break;
        case 'RESEARCHER_APPROVED':
          setUsers(prev => prev.map(u => u.id === data.userId ? { ...u, status: "Approved", verifiedBadge: true } : u));
          setCurrentUser(prev => prev?.id === data.userId ? { ...prev, status: "Approved", verifiedBadge: true } : prev);
          break;
        case 'RESEARCHER_REJECTED':
          setUsers(prev => prev.map(u => u.id === data.userId ? { ...u, status: "Rejected" } : u));
          setCurrentUser(prev => prev?.id === data.userId ? { ...prev, status: "Rejected" } : prev);
          break;
        case 'USER_DELETED':
          setUsers(prev => prev.filter(u => u.id !== data.userId));
          setCurrentUser(prev => prev?.id === data.userId ? null : prev);
          break;
        default:
          break;
      }
    });

    return () => unsubscribeBus();
  }, []);

  // Login with Firebase Auth and verify Firestore Role
  const login = async (email, password, requiredRole = null) => {
    if (!auth) throw new Error("Firebase Auth service not ready.");

    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const fbUser = userCredential.user;

    // Fetch user profile from Firestore
    let userProfile = null;
    try {
      const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
      if (userDoc.exists()) {
        userProfile = { id: fbUser.uid, uid: fbUser.uid, email: fbUser.email, ...userDoc.data() };
      }
    } catch (err) {
      console.warn("Could not retrieve Firestore user document:", err);
    }

    if (!userProfile) {
      // Fallback profile if none stored
      userProfile = {
        id: fbUser.uid,
        uid: fbUser.uid,
        email: fbUser.email,
        fullName: fbUser.displayName || fbUser.email.split('@')[0],
        role: requiredRole || 'Farmer',
        status: 'Active'
      };
      try {
        await setDoc(doc(db, 'users', fbUser.uid), userProfile);
      } catch (e) {}
    }

    // Role-based verification
    if (requiredRole && userProfile.role !== requiredRole) {
      await signOut(auth);
      throw new Error(`Account role mismatch. This portal is for ${requiredRole}s, but this account is registered as a ${userProfile.role}.`);
    }

    // Approval gate for researchers
    if (userProfile.role === 'Agricultural Expert / Researcher' && userProfile.status === 'Pending Approval') {
      await signOut(auth);
      throw new Error("Your researcher account is currently pending approval by the Agriculture Department Admin. You will receive access once credentials are verified.");
    }

    setCurrentUser(userProfile);
    return userProfile;
  };

  // Register Farmer with Firebase Auth & Firestore
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
      await setDoc(doc(db, 'users', fbUser.uid), newFarmer);
    } catch (e) {
      console.warn("Firestore farmer write notice:", e);
    }

    setCurrentUser(newFarmer);
    setUsers(prev => [newFarmer, ...prev]);
    realtimeService.broadcast('USER_UPDATED', newFarmer);

    return newFarmer;
  };

  // Register Researcher / Expert with Firebase Auth & Firestore
  const registerResearcher = async (researcherData) => {
    if (!auth) throw new Error("Firebase Auth is not available.");

    const userCredential = await createUserWithEmailAndPassword(auth, researcherData.email.trim(), researcherData.password);
    const fbUser = userCredential.user;

    if (researcherData.fullName) {
      try {
        await updateFirebaseProfile(fbUser, { displayName: researcherData.fullName });
      } catch (e) {}
    }

    const newResearcher = {
      id: fbUser.uid,
      uid: fbUser.uid,
      role: "Agricultural Expert / Researcher",
      fullName: researcherData.fullName,
      email: researcherData.email.trim(),
      mobileNumber: researcherData.mobileNumber || "",
      department: researcherData.department || "Plant Pathology",
      specialization: researcherData.specialization || "Crop Diseases",
      institution: researcherData.institution || "State Agricultural University",
      employeeId: researcherData.employeeId || `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Pending Approval", // Requires Admin Approval
      casesSolved: 0,
      verifiedBadge: false,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', fbUser.uid), newResearcher);
    } catch (e) {
      console.warn("Firestore researcher write notice:", e);
    }

    // Sign out immediately until admin approves
    await signOut(auth);
    setCurrentUser(null);

    setUsers(prev => [newResearcher, ...prev]);
    realtimeService.broadcast('RESEARCHER_REGISTERED', newResearcher);

    return newResearcher;
  };

  // Register / Provision Department Admin
  const registerAdmin = async (adminData, passkey) => {
    if (!auth) throw new Error("Firebase Auth is not available.");
    if (passkey !== "ADMIN2026" && passkey !== "CROPCARE_ADMIN") {
      throw new Error("Invalid Administrative Passkey. Access denied.");
    }

    const userCredential = await createUserWithEmailAndPassword(auth, adminData.email.trim(), adminData.password);
    const fbUser = userCredential.user;

    const newAdmin = {
      id: fbUser.uid,
      uid: fbUser.uid,
      role: "Agriculture Department Admin",
      fullName: adminData.fullName || "Department Admin Officer",
      email: adminData.email.trim(),
      mobileNumber: adminData.mobileNumber || "",
      department: "State Directorate of Agriculture",
      status: "Active",
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'users', fbUser.uid), newAdmin);
    } catch (e) {
      console.warn("Firestore admin write notice:", e);
    }

    setCurrentUser(newAdmin);
    setUsers(prev => [newAdmin, ...prev]);
    return newAdmin;
  };

  // Approve Researcher
  const approveResearcher = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        status: "Approved",
        verifiedBadge: true
      });
    } catch (e) {
      console.warn("Firestore approve researcher write notice:", e);
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Approved", verifiedBadge: true } : u));
    const target = users.find(u => u.id === userId);
    realtimeService.broadcast('RESEARCHER_APPROVED', { userId, fullName: target?.fullName });
  };

  // Reject Researcher
  const rejectResearcher = async (userId) => {
    try {
      await updateDoc(doc(db, 'users', userId), { status: "Rejected" });
    } catch (e) {
      console.warn("Firestore reject researcher write notice:", e);
    }

    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: "Rejected" } : u));
    realtimeService.broadcast('RESEARCHER_REJECTED', { userId });
  };

  // Update Profile
  const updateProfile = async (updatedData) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };

    try {
      await updateDoc(doc(db, 'users', currentUser.uid || currentUser.id), updatedData);
    } catch (e) {
      console.warn("Firestore update profile notice:", e);
    }

    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === (currentUser.uid || currentUser.id) ? updated : u));
    realtimeService.broadcast('USER_UPDATED', updated);
  };

  // Delete User Account
  const deleteAccount = async (userId) => {
    const targetId = userId || currentUser?.id;
    if (!targetId) return;

    try {
      await deleteDoc(doc(db, 'users', targetId));
    } catch (e) {
      console.warn("Firestore delete user notice:", e);
    }

    setUsers(prev => prev.filter(u => u.id !== targetId));
    if (currentUser?.id === targetId || currentUser?.uid === targetId) {
      await signOut(auth);
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
      registerResearcher,
      registerAdmin,
      approveResearcher,
      rejectResearcher,
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
