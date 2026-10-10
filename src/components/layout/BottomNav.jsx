import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, FileText, BookOpen, User, Microscope, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const BottomNav = () => {
  const location = useLocation();
  const { isFarmer, isExpert, isAdmin, currentUser } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
      <Link
        to="/home"
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname === '/home' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navHome')}</span>
      </Link>

      {/* Role-Specific Secondary Link */}
      {isFarmer && (
        <Link
          to="/farmer/issues"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.startsWith('/farmer/issues') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('navCases')}</span>
        </Link>
      )}

      {isExpert && (
        <Link
          to="/expert/cases"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.startsWith('/expert/cases') ? 'text-teal-700 bg-teal-50' : 'text-slate-600'}`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Assigned</span>
        </Link>
      )}

      {isAdmin && (
        <Link
          to="/admin/dashboard"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.startsWith('/admin') ? 'text-purple-700 bg-purple-50' : 'text-slate-600'}`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Admin</span>
        </Link>
      )}

      {/* Center Action Button (Farmer gets Report Problem, Expert gets Assigned, Admin gets Approvals) */}
      {isFarmer ? (
        <Link
          to="/farmer/report-problem"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transform active:scale-95 transition-transform">
            <PlusCircle className="w-7 h-7" />
          </div>
          <span className="text-[10px] font-bold text-emerald-800 mt-0.5">{t('navReport')}</span>
        </Link>
      ) : isExpert ? (
        <Link
          to="/expert/dashboard"
          className="flex flex-col items-center justify-center -mt-5"
        >
          <div className="w-12 h-12 bg-teal-600 hover:bg-teal-700 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white transform active:scale-95 transition-transform">
            <Microscope className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold text-teal-800 mt-0.5">Queue</span>
        </Link>
      ) : (
        <Link
          to="/knowledge-base"
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.startsWith('/knowledge') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">{t('navSolutions')}</span>
        </Link>
      )}

      {/* Knowledge Base */}
      <Link
        to="/knowledge-base"
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.startsWith('/knowledge') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
      >
        <BookOpen className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navSolutions')}</span>
      </Link>

      {/* Profile / Login */}
      <Link
        to={currentUser ? (isFarmer ? "/farmer/profile" : isExpert ? "/expert/profile" : "/admin/settings") : "/login"}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl text-xs font-semibold ${location.pathname.includes('profile') || location.pathname.includes('settings') ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600'}`}
      >
        <User className="w-5 h-5" />
        <span className="text-[10px] mt-0.5">{t('navAccount')}</span>
      </Link>
    </div>
  );
};
