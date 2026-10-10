import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  User,
  KeyRound,
  Building2,
  Microscope
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage = () => {
  const { login, registerAdmin, currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('Farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin Setup Modal State
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminForm, setAdminForm] = useState({
    fullName: '',
    email: '',
    password: '',
    passkey: ''
  });

  const notificationMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const user = await login(email, password, selectedRole);
      setLoading(false);
      if (user.role === 'Farmer') navigate('/farmer/dashboard');
      else if (user.role === 'Agricultural Expert / Researcher') navigate('/expert/dashboard');
      else if (user.role === 'Agriculture Department Admin') navigate('/admin/dashboard');
      else navigate('/home');
    } catch (err) {
      setLoading(false);
      let message = err.message || 'Login failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'Invalid email address or password. Please verify and try again.';
      } else if (err.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      }
      setErrorMsg(message);
    }
  };

  const handleAdminSetup = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      await registerAdmin({
        fullName: adminForm.fullName,
        email: adminForm.email,
        password: adminForm.password
      }, adminForm.passkey);

      setLoading(false);
      setAdminModalOpen(false);
      setSuccessMsg("Department Admin account created and signed in successfully!");
      setTimeout(() => navigate('/admin/dashboard'), 1200);
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || "Failed to initialize Admin account.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-10">
      <div className="max-w-md w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {t('loginTitle')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Firebase Authentication & Cloud Database Access
          </p>
        </div>

        {currentUser && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs font-semibold">
            <span className="text-emerald-900">
              Active: <strong>{currentUser.fullName}</strong> ({currentUser.role})
            </span>
            <Link
              to={currentUser.role === 'Farmer' ? '/farmer/dashboard' : currentUser.role === 'Agricultural Expert / Researcher' ? '/expert/dashboard' : '/admin/dashboard'}
              className="px-2.5 py-1 bg-emerald-700 text-white rounded-lg text-[11px] font-bold hover:bg-emerald-800 transition-colors"
            >
              {t('navDashboard')} →
            </Link>
          </div>
        )}

        {/* Real Role Selector */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex gap-1 border border-slate-200 text-xs font-extrabold shadow-inner">
          <button
            type="button"
            onClick={() => { setSelectedRole('Farmer'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${selectedRole === 'Farmer' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>👨‍🌾</span> <span>Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole('Agricultural Expert / Researcher'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${selectedRole === 'Agricultural Expert / Researcher' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>👨‍🔬</span> <span>Expert</span>
          </button>
          <button
            type="button"
            onClick={() => { setSelectedRole('Agriculture Department Admin'); setErrorMsg(''); }}
            className={`flex-1 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 ${selectedRole === 'Agriculture Department Admin' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <span>🏛️</span> <span>Admin</span>
          </button>
        </div>

        {/* Role Portal Context Notice */}
        <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
          selectedRole === 'Farmer' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          selectedRole === 'Agricultural Expert / Researcher' ? 'bg-teal-50 border-teal-200 text-teal-800' :
          'bg-purple-50 border-purple-200 text-purple-800'
        }`}>
          <span>
            Signing in to: <strong>{selectedRole} Portal</strong>
          </span>
          <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            RBAC Guard
          </span>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
          {notificationMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{notificationMessage}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1.5 text-slate-800">{t('emailOrMobileLabel')}</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    selectedRole === 'Farmer' ? "e.g. farmer@cropcare.org" :
                    selectedRole === 'Agricultural Expert / Researcher' ? "e.g. expert@agri.gov.in" :
                    "e.g. admin@cropcare.gov.in"
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-800">{t('passwordLabel')}</label>
                <Link to="/forgot-password" className="text-emerald-700 hover:underline text-[11px] font-bold">
                  {t('forgotPasswordLink')}
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 ${
                selectedRole === 'Farmer' ? 'bg-emerald-600 hover:bg-emerald-700' :
                selectedRole === 'Agricultural Expert / Researcher' ? 'bg-teal-600 hover:bg-teal-700' :
                'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              <LogIn className="w-4 h-4" /> {loading ? t('btnLoggingIn') : `Sign in as ${selectedRole.split(' ')[0]}`}
            </button>
          </form>

          {/* Registration Links tailored to Role */}
          <div className="border-t border-slate-100 pt-4 text-center space-y-2 text-xs">
            {selectedRole === 'Farmer' && (
              <div className="space-y-1">
                <span className="text-slate-500">New Farmer? </span>
                <Link to="/register/farmer" className="text-emerald-700 font-extrabold hover:underline inline-flex items-center gap-1">
                  Register Your Farmer Profile <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {selectedRole === 'Agricultural Expert / Researcher' && (
              <div className="space-y-1">
                <span className="text-slate-500">New Agricultural Scientist? </span>
                <Link to="/register/researcher" className="text-teal-700 font-extrabold hover:underline inline-flex items-center gap-1">
                  Apply for Expert Panel <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            )}

            {selectedRole === 'Agriculture Department Admin' && (
              <div className="space-y-1 pt-1">
                <span className="text-slate-500">First time setting up Admin? </span>
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="text-purple-700 font-extrabold hover:underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" /> Initialize Admin Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Admin Initialization Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" /> Initialize Department Admin Account
              </h3>
              <button
                onClick={() => setAdminModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAdminSetup} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-800">Admin Officer Full Name *</label>
                <input
                  type="text"
                  required
                  value={adminForm.fullName}
                  onChange={e => setAdminForm({ ...adminForm, fullName: e.target.value })}
                  placeholder="e.g. M. K. Deshmukh"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Official Admin Email *</label>
                <input
                  type="email"
                  required
                  value={adminForm.email}
                  onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                  placeholder="admin@cropcare.gov.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Set Admin Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={adminForm.password}
                  onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Master Passkey * (Default: <code>ADMIN2026</code>)</label>
                <input
                  type="password"
                  required
                  value={adminForm.passkey}
                  onChange={e => setAdminForm({ ...adminForm, passkey: e.target.value })}
                  placeholder="Enter ADMIN2026"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-purple-300 font-bold text-xs focus:ring-2 focus:ring-purple-500 bg-purple-50/50"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" /> {loading ? "Creating..." : "Create Admin Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
