import React from 'react';
import { Navigate, useLocation, Link } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, isAuthenticated, authLoading, logout } = useAuth();
  const location = useLocation();

  // If initial session verification is still resolving, show smooth loader instead of premature redirect
  if (authLoading && !currentUser) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Verifying secure session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const expiredNotice = sessionStorage.getItem('cropcare_session_expired');
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname, 
          message: expiredNotice || 'Please sign in with your role credentials to access this portal.' 
        }} 
        replace 
      />
    );
  }

  // Check if researcher is pending approval
  if (
    currentUser?.role === 'Agricultural Expert / Researcher' && 
    currentUser?.status === 'Pending Approval' &&
    location.pathname.startsWith('/expert')
  ) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-amber-200 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="bg-amber-100 text-amber-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              Verification In Progress
            </span>
            <h2 className="text-xl font-black text-slate-900">
              Researcher Credentials Pending Approval
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Hello, <strong>{currentUser.fullName}</strong>. Your account ({currentUser.employeeId || 'Scientist'}) has been submitted to the <strong>Agriculture Department Admin Panel</strong>. Once verified, your expert case review portal will unlock automatically.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] text-slate-600 font-semibold text-left space-y-1">
            <div>🏛️ Department: <strong>{currentUser.department}</strong></div>
            <div>🏫 Institution: <strong>{currentUser.institution || 'State Agricultural University'}</strong></div>
            <div>⚡ Real-Time Status: <strong className="text-amber-700">Awaiting Admin Verification</strong></div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={() => logout()}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Sign Out & Switch Account
            </button>
            <Link
              to="/knowledge-base"
              className="text-xs text-emerald-700 font-bold hover:underline"
            >
              Browse Public Knowledge Base →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Role Access Guard: Smooth auto-redirect to user's authorized role portal
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    const roleDashboard = 
      currentUser.role === 'Agricultural Expert / Researcher' 
        ? '/expert/dashboard' 
        : currentUser.role === 'Agriculture Department Admin' 
        ? '/admin/dashboard' 
        : '/farmer/dashboard';

    return <Navigate to={roleDashboard} replace />;
  }

  return children;
};
