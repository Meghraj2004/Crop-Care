import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  KeyRound,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin123@gamil.com');
  const [password, setPassword] = useState('admin@123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login(email.trim(), password, 'Agriculture Department Admin');
      setLoading(false);
      navigate('/admin/dashboard');
    } catch (err) {
      setLoading(false);
      let message = err.message || 'Admin authentication failed.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password') {
        message = 'Invalid administrator credentials. Please verify your email and password.';
      } else if (err.code === 'auth/user-not-found') {
        message = 'Administrator account not found.';
      }
      setErrorMsg(message);
    }
  };

  const handleFillCredentials = () => {
    setEmail('admin123@gamil.com');
    setPassword('admin@123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Official Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-purple-700 text-white rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-purple-200">
            <Building2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-[10px] font-black rounded-full uppercase tracking-wider">
            Restricted Access • Directorate Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Agriculture Department Admin Portal
          </h1>
          <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Authorized administrative access for scientist panel oversight & state agricultural records
          </p>
        </div>

        {/* Credentials Notice Box */}
        <div className="p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <span className="font-extrabold text-purple-950 block">Official Admin Credentials</span>
            <span className="text-[11px] text-purple-700 font-mono block">
              admin123@gamil.com / admin@123
            </span>
          </div>
          <button
            type="button"
            onClick={handleFillCredentials}
            className="px-2.5 py-1 bg-purple-700 hover:bg-purple-800 text-white rounded-lg text-[10px] font-bold shadow-sm transition-colors"
          >
            Auto Fill
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1.5 text-slate-800">Admin Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin123@gamil.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-xs font-medium"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block mb-1.5 text-slate-800">Admin Secret Password *</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin@123"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 text-xs font-medium"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-xs text-white shadow-md transition-all flex items-center justify-center gap-2 bg-purple-700 hover:bg-purple-800 disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              {loading ? "Authenticating Administrator..." : "Enter Department Administration"}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
            <span>Looking for farmer or expert login? </span>
            <a href="/login" className="text-emerald-700 font-bold hover:underline">
              Standard Login Portal →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
