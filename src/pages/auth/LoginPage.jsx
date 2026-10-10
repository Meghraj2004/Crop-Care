import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sprout, Mail, Lock, LogIn, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const LoginPage = () => {
  const { login, switchDemoRole, currentUser } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const notificationMessage = location.state?.message;

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = login(email, password);
      setLoading(false);
      if (user.role === 'Farmer') navigate('/farmer/dashboard');
      else if (user.role === 'Agricultural Expert / Researcher') navigate('/expert/dashboard');
      else if (user.role === 'Agriculture Department Admin') navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickDemo = (role) => {
    switchDemoRole(role);
    if (role === 'Farmer') navigate('/farmer/dashboard');
    else if (role === 'Expert') navigate('/expert/dashboard');
    else if (role === 'Admin') navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
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
            {t('loginSubtitle')}
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

        {/* Quick Demo Credentials Toolbar */}
        <div className="bg-amber-50/90 border border-amber-200 p-4 rounded-2xl space-y-2.5 shadow-sm">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900">
            <span className="flex items-center gap-1.5">{t('instantDemoLogin')}</span>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded-full">1-Click Role Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('Farmer')}
              className="px-2.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center flex flex-col items-center justify-center gap-0.5 group"
            >
              <span>👨‍🌾 {t('roleFarmer')}</span>
              <span className="text-[9px] font-normal text-emerald-100 group-hover:text-white">Ramesh Patil</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('Expert')}
              className="px-2.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center flex flex-col items-center justify-center gap-0.5 group"
            >
              <span>👨‍🔬 {t('roleExpert')}</span>
              <span className="text-[9px] font-normal text-teal-100 group-hover:text-white">Dr. Anil Sharma</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('Admin')}
              className="px-2.5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-center flex flex-col items-center justify-center gap-0.5 group"
            >
              <span>🏛️ {t('roleAdmin')}</span>
              <span className="text-[9px] font-normal text-purple-100 group-hover:text-white">Dept Directorate</span>
            </button>
          </div>
          <div className="text-[10px] text-amber-800/80 text-center font-medium pt-0.5">
            Tip: Click any button to test that role, or type manual credentials below (password: <code>password123</code> / <code>admin123</code>).
          </div>
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
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
                  placeholder="e.g. ramesh.patil@farmconnect.org"
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
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" /> {loading ? t('btnLoggingIn') : t('btnLogin')}
            </button>
          </form>

          <div className="border-t border-slate-100 pt-4 text-center space-y-2 text-xs">
            <div className="text-slate-500">{t('dontHaveAccount')}</div>
            <div className="flex items-center justify-center gap-4 font-bold">
              <Link to="/register/farmer" className="text-emerald-700 hover:underline flex items-center gap-1">
                {t('registerFarmerLink')} <ArrowRight className="w-3 h-3" />
              </Link>
              <span className="text-slate-300">|</span>
              <Link to="/register/researcher" className="text-teal-700 hover:underline flex items-center gap-1">
                {t('registerResearcherLink')} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
