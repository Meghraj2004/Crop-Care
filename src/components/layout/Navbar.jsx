import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sprout, 
  Search, 
  Bell, 
  Globe, 
  User, 
  LogOut, 
  Menu, 
  X, 
  PlusCircle, 
  BookOpen, 
  LayoutDashboard, 
  ShieldCheck, 
  UserCheck, 
  HelpCircle,
  FileText,
  ChevronDown,
  Microscope,
  Building2,
  BarChart2,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';

export const Navbar = () => {
  const { currentUser, users, logout, switchDemoRole, isFarmer, isExpert, isAdmin } = useAuth();
  const { language, changeLanguage, t } = useLanguage();
  const { notifications, markNotificationRead } = useData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const userNotifs = notifications.filter(n => !currentUser || n.userId === currentUser.id || currentUser.role === 'Agriculture Department Admin');
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const pendingResearchersCount = users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Pending Approval').length;

  const handleNotifClick = (notif) => {
    markNotificationRead(notif.id);
    setNotifDropdownOpen(false);
    if (notif.link) navigate(notif.link);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Banner: Agriculture Department Header, Live Firestore Real-Time Status & Authenticated Role */}
      <div className="bg-emerald-950 text-white text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-emerald-900">
        <div className="flex items-center gap-3 font-medium text-emerald-100">
          <span className="bg-emerald-700/90 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider font-extrabold text-emerald-100 shadow-sm">
            {t('govtPlatformBadge')}
          </span>
          <span className="hidden sm:inline text-emerald-200 text-xs font-semibold">{t('govtNetworkBadge')}</span>

          {/* Real-Time Live Status Pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-900/90 border border-emerald-600/50 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Firestore Live Real-Time</span>
          </div>
        </div>

        {/* Authenticated Active Role Indicator */}
        <div className="flex items-center gap-2">
          {currentUser ? (
            <div className="inline-flex items-center gap-2 bg-emerald-900/90 rounded-lg px-2.5 py-0.5 border border-emerald-700/60 shadow-sm">
              <span className="text-[11px] text-emerald-200 font-medium">Active Session:</span>
              <span className={`px-2 py-0.2 rounded text-[11px] font-black ${
                isFarmer ? 'bg-emerald-600 text-white' :
                isExpert ? 'bg-teal-600 text-white' :
                'bg-purple-600 text-white'
              }`}>
                {isFarmer ? '👨‍🌾 Farmer' : isExpert ? '👨‍🔬 Expert' : '🏛️ Admin'}
              </span>
              <span className="text-white text-[11px] font-bold max-w-[120px] truncate">{currentUser.fullName}</span>
            </div>
          ) : (
            <Link 
              to="/login"
              className="text-emerald-300 hover:text-white font-bold text-[11px] transition-colors"
            >
              Sign In to Your Role Portal →
            </Link>
          )}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-emerald-600 group-hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center shadow-md transition-colors">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-950 block leading-tight">
                CropCare <span className="text-emerald-600 font-bold text-sm">Advisory</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium block uppercase tracking-wider">
                Support & Research Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links - STRICTLY ROLE-BASED */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link 
              to="/home" 
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/home' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              {t('navHome')}
            </Link>

            {/* Farmer Navigation Items */}
            {isFarmer && (
              <>
                <Link 
                  to="/farmer/dashboard" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/farmer/dashboard' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {t('navDashboard')}
                </Link>
                <Link 
                  to="/farmer/report-problem" 
                  className="px-3.5 py-2 rounded-lg text-xs font-extrabold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  {t('navReport')}
                </Link>
                <Link 
                  to="/farmer/issues" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname.startsWith('/farmer/issues') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {t('myReportedCasesTitle')}
                </Link>
              </>
            )}

            {/* Expert Navigation Items */}
            {isExpert && (
              <>
                <Link 
                  to="/expert/dashboard" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/expert/dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {t('navDashboard')}
                </Link>
                <Link 
                  to="/expert/cases" 
                  className={`px-3.5 py-2 rounded-lg text-xs font-extrabold bg-teal-600 text-white hover:bg-teal-700 flex items-center gap-1.5 shadow-sm transition-colors`}
                >
                  <FileText className="w-4 h-4" />
                  Assigned Queue
                </Link>
                <Link 
                  to="/expert/research" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname.startsWith('/expert/research') ? 'bg-orange-50 text-orange-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Research Studies
                </Link>
              </>
            )}

            {/* Admin Navigation Items */}
            {isAdmin && (
              <>
                <Link 
                  to="/admin/dashboard" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/admin/dashboard' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Admin Control
                </Link>
                <Link 
                  to="/admin/researchers" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${location.pathname === '/admin/researchers' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  <UserCheck className="w-4 h-4 text-purple-600" />
                  <span>Approvals</span>
                  {pendingResearchersCount > 0 && (
                    <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-1.5 py-0.2 rounded-full animate-pulse">
                      {pendingResearchersCount}
                    </span>
                  )}
                </Link>
                <Link 
                  to="/admin/users" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/admin/users' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Directory
                </Link>
                <Link 
                  to="/admin/departments" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/admin/departments' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Departments
                </Link>
                <Link 
                  to="/admin/analytics" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/admin/analytics' ? 'bg-purple-50 text-purple-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  Analytics
                </Link>
              </>
            )}

            {/* Public Links */}
            <Link 
              to="/knowledge-base" 
              className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname.startsWith('/knowledge') ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
            >
              {t('navKnowledge')}
            </Link>

            {!currentUser && (
              <>
                <Link 
                  to="/about" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/about' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {t('navAbout')}
                </Link>
                <Link 
                  to="/contact" 
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors ${location.pathname === '/contact' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700 hover:bg-slate-100'}`}
                >
                  {t('navContact')}
                </Link>
              </>
            )}
          </nav>

          {/* Right Actions (Language, Notifications, User Profile / Auth) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Multilingual Selector */}
            <div className="relative">
              <select
                value={language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-1.5 pl-7 pr-3 rounded-xl cursor-pointer border border-slate-200 focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Marathi">मराठी (Marathi)</option>
                <option value="Hindi">हिंदी (Hindi)</option>
              </select>
              <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5 pointer-events-none" />
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 relative transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="font-extrabold text-slate-800 text-xs">Live Notifications ({userNotifs.length})</span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} unread
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifs.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">No notifications available</div>
                    ) : (
                      userNotifs.map(n => (
                        <div
                          key={n.id}
                          onClick={() => handleNotifClick(n)}
                          className={`p-3 hover:bg-slate-50 cursor-pointer text-xs transition-colors ${!n.read ? 'bg-emerald-50/50 font-medium' : ''}`}
                        >
                          <div className="font-bold text-slate-900">{n.title}</div>
                          <div className="text-slate-600 mt-0.5 text-[11px] leading-relaxed">{n.message}</div>
                          <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile / Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 p-1.5 rounded-xl border transition-colors ${isFarmer ? 'border-emerald-300 bg-emerald-50/50' : isExpert ? 'border-teal-300 bg-teal-50/50' : 'border-purple-300 bg-purple-50/50'}`}
                >
                  <div className={`w-8 h-8 rounded-lg font-extrabold flex items-center justify-center text-xs text-white shadow-sm overflow-hidden ${isFarmer ? 'bg-emerald-600' : isExpert ? 'bg-teal-600' : 'bg-purple-600'}`}>
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      currentUser.fullName.charAt(0)
                    )}
                  </div>
                  <div className="text-left hidden md:block pr-1">
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[120px]">{currentUser.fullName}</span>
                    <span className={`text-[10px] font-bold block ${isFarmer ? 'text-emerald-700' : isExpert ? 'text-teal-700' : 'text-purple-700'}`}>
                      {currentUser.role === 'Agriculture Department Admin' ? 'Admin' : currentUser.role === 'Agricultural Expert / Researcher' ? 'Researcher' : 'Farmer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-extrabold text-sm text-slate-900">{currentUser.fullName}</div>
                      <div className="text-[11px] text-slate-500 truncate">{currentUser.email}</div>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${isFarmer ? 'bg-emerald-100 text-emerald-800' : isExpert ? 'bg-teal-100 text-teal-800' : 'bg-purple-100 text-purple-800'}`}>
                          {currentUser.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      {isFarmer && (
                        <>
                          <Link 
                            to="/farmer/dashboard" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-600" /> {t('navDashboard')}
                          </Link>
                          <Link 
                            to="/farmer/report-problem" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-50"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-600" /> Report Problem
                          </Link>
                          <Link 
                            to="/farmer/issues" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <FileText className="w-4 h-4 text-emerald-600" /> My Reported Cases
                          </Link>
                        </>
                      )}

                      {isExpert && (
                        <>
                          <Link 
                            to="/expert/dashboard" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <LayoutDashboard className="w-4 h-4 text-teal-600" /> {t('navDashboard')}
                          </Link>
                          <Link 
                            to="/expert/cases" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <FileText className="w-4 h-4 text-teal-600" /> Assigned Cases Queue
                          </Link>
                          <Link 
                            to="/expert/research" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <Microscope className="w-4 h-4 text-orange-600" /> Research Cases
                          </Link>
                        </>
                      )}

                      {isAdmin && (
                        <>
                          <Link 
                            to="/admin/dashboard" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <ShieldCheck className="w-4 h-4 text-purple-600" /> {t('navDashboard')}
                          </Link>
                          <Link 
                            to="/admin/researchers" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <UserCheck className="w-4 h-4 text-purple-600" /> Researcher Approvals ({pendingResearchersCount})
                          </Link>
                          <Link 
                            to="/admin/users" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <User className="w-4 h-4 text-purple-600" /> User Directory
                          </Link>
                          <Link 
                            to="/admin/departments" 
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                          >
                            <Building2 className="w-4 h-4 text-blue-600" /> Department Divisions
                          </Link>
                        </>
                      )}

                      <Link 
                        to={isFarmer ? "/farmer/profile" : isExpert ? "/expert/profile" : "/admin/settings"} 
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 border-t border-slate-100 mt-1"
                      >
                        <User className="w-4 h-4 text-slate-500" /> {t('navProfile')}
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" /> {t('navLogout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  to="/register/farmer"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                >
                  {t('navRegister')}
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <Link
            to="/home"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-emerald-600"
          >
            {t('navHome')}
          </Link>

          {isFarmer && (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-emerald-800 bg-emerald-50 px-3 rounded-xl"
              >
                🌾 {t('navDashboard')}
              </Link>
              <Link
                to="/farmer/report-problem"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2 text-sm font-bold text-emerald-600"
              >
                <PlusCircle className="w-4 h-4" /> {t('btnReportProblem')}
              </Link>
              <Link
                to="/farmer/issues"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-emerald-600"
              >
                {t('myReportedCasesTitle')}
              </Link>
            </>
          )}

          {isExpert && (
            <>
              <Link
                to="/expert/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-teal-800 bg-teal-50 px-3 rounded-xl"
              >
                🔬 Expert Dashboard
              </Link>
              <Link
                to="/expert/cases"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-teal-600"
              >
                Assigned Cases Queue
              </Link>
              <Link
                to="/expert/research"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-orange-600"
              >
                Research Cases
              </Link>
            </>
          )}

          {isAdmin && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-purple-800 bg-purple-50 px-3 rounded-xl"
              >
                🏛️ Admin Panel
              </Link>
              <Link
                to="/admin/researchers"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-purple-600"
              >
                Researcher Approvals ({pendingResearchersCount})
              </Link>
              <Link
                to="/admin/users"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-purple-600"
              >
                User Directory
              </Link>
              <Link
                to="/admin/departments"
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-bold text-slate-800 hover:text-purple-600"
              >
                Departments
              </Link>
            </>
          )}

          <Link
            to="/knowledge-base"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-800 hover:text-emerald-600"
          >
            {t('navKnowledge')}
          </Link>
        </div>
      )}
    </header>
  );
};
