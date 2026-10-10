import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Mail, 
  Lock, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Building2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage = () => {
  const { login, currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('Farmer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const notificationMessage = location.state?.message;

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
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
            CropCare Digital Agricultural Advisory Portal
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

        {/* Public Role Selector: ONLY Farmer & Expert */}
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
            <span>👨‍🔬</span> <span>Expert / Researcher</span>
          </button>
        </div>

        {/* Role Notice */}
        <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-between ${
          selectedRole === 'Farmer' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          'bg-teal-50 border-teal-200 text-teal-800'
        }`}>
          <span>
            Signing in to: <strong>{selectedRole} Portal</strong>
          </span>
          <span className="text-[10px] font-bold opacity-80 uppercase tracking-wider">
            Verified Portal
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
                    selectedRole === 'Farmer' ? "e.g. farmer@cropcare.gov.in" :
                    "e.g. expert@agri.gov.in"
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-800">{t('passwordLabel')}</label>
                <Link to="/forgot-password" className="text-emerald-700 hover:underline font-bold text-[11px]">
                  {t('forgotPassword')}
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
              className={`w-full py-3.5 rounded-xl font-black text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 ${
                selectedRole === 'Farmer' ? 'bg-emerald-600 hover:bg-emerald-700' :
                'bg-teal-600 hover:bg-teal-700'
              } disabled:opacity-50`}
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Authenticating..." : `Sign In as ${selectedRole === 'Farmer' ? 'Farmer' : 'Expert'}`}
            </button>
          </form>

          {/* Registration / Account Notice */}
          <div className="border-t border-slate-100 pt-4 text-center space-y-2 text-xs">
            {selectedRole === 'Farmer' ? (
              <div className="space-y-1">
                <span className="text-slate-500">New Farmer? </span>
                <Link to="/register/farmer" className="text-emerald-700 font-extrabold hover:underline inline-flex items-center gap-1">
                  Register Your Farmer Profile <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-left space-y-1">
                <div className="flex items-center gap-1.5 text-teal-900 font-extrabold">
                  <ShieldAlert className="w-4 h-4 text-teal-700 shrink-0" />
                  <span>Institutional Expert Notice</span>
                </div>
                <p className="text-[11px] text-teal-800 leading-relaxed font-medium">
                  Expert accounts are issued exclusively by Department Administrators. Scientists cannot self-register. Please sign in with your credentials issued by the Directorate.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Subtle Official Footer Link */}
        <div className="text-center">
          <Link 
            to="/admin/login" 
            className="text-[11px] text-slate-400 hover:text-slate-600 transition-colors inline-flex items-center gap-1 font-medium"
          >
            <Building2 className="w-3.5 h-3.5" /> Directorate Official Admin Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
