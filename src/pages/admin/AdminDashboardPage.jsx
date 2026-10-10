import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck, 
  FileText, 
  CheckCircle2, 
  Microscope, 
  BookOpen, 
  Clock, 
  TrendingUp, 
  Building2, 
  BarChart2, 
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminDashboardPage = () => {
  const { users, approveResearcher } = useAuth();
  const { issues, researchCases, knowledgeArticles, departments } = useData();

  const farmersCount = users.filter(u => u.role === 'Farmer').length;
  const expertsCount = users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Approved').length;
  const pendingResearchers = users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Pending Approval');
  
  const totalIssues = issues.length;
  const openIssues = issues.filter(i => ['Submitted', 'Assigned', 'Under Review'].includes(i.status)).length;
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length;
  const researchCasesCount = researchCases.length;
  const verifiedSolutionsCount = knowledgeArticles.length;

  // Analytics Aggregations
  const cropCounts = issues.reduce((acc, issue) => {
    acc[issue.cropName] = (acc[issue.cropName] || 0) + 1;
    return acc;
  }, {});

  const categoryCounts = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {});

  const districtCounts = issues.reduce((acc, issue) => {
    acc[issue.district] = (acc[issue.district] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-purple-800/80 px-3 py-1 rounded-full text-xs font-bold text-purple-200">
            <ShieldCheck className="w-4 h-4 text-purple-300" />
            <span>State Directorate of Agriculture Admin Panel</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Platform Operations & Analytics
          </h1>
          <p className="text-purple-200 text-xs sm:text-sm font-medium">
            Monitor crop disease outbreaks, approve researcher credentials, and track university advisory metrics
          </p>
        </div>

        {pendingResearchers.length > 0 && (
          <Link
            to="/admin/researchers"
            className="px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 animate-pulse"
          >
            <UserPlus className="w-5 h-5" /> Approve Pending Researchers ({pendingResearchers.length})
          </Link>
        )}
      </div>

      {/* Analytics KPI Metrics Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase">Total Farmers</div>
          <div className="text-2xl font-black text-slate-900">{farmersCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-teal-700 uppercase">Active Experts</div>
          <div className="text-2xl font-black text-teal-900">{expertsCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-slate-500 uppercase">Total Issues</div>
          <div className="text-2xl font-black text-slate-900">{totalIssues}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-amber-800 uppercase">Open Issues</div>
          <div className="text-2xl font-black text-amber-900">{openIssues}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-emerald-800 uppercase">Resolved Cases</div>
          <div className="text-2xl font-black text-emerald-900">{resolvedIssues}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-orange-200 bg-orange-50/20 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-orange-800 uppercase">Research Cases</div>
          <div className="text-2xl font-black text-orange-900">{researchCasesCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-purple-800 uppercase">KB Solutions</div>
          <div className="text-2xl font-black text-purple-900">{verifiedSolutionsCount}</div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-sm space-y-1">
          <div className="text-[10px] font-extrabold text-blue-800 uppercase">Avg Response</div>
          <div className="text-xl font-black text-blue-900">14.5 Hrs</div>
        </div>
      </div>

      {/* Analytics Charts & Outbreak Distribution Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Problems by Crop */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-600" /> Problems by Crop Type
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(cropCounts).map(([crop, count]) => {
              const pct = Math.round((count / totalIssues) * 100);
              return (
                <div key={crop} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-700">
                    <span>{crop}</span>
                    <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Problems by Category */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-600" /> Problems by Category
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = Math.round((count / totalIssues) * 100);
              return (
                <div key={cat} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-700">
                    <span>{cat}</span>
                    <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cases by District */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-600" /> Regional Outbreaks by District
            </h3>
          </div>
          <div className="space-y-3">
            {Object.entries(districtCounts).map(([district, count]) => {
              const pct = Math.round((count / totalIssues) * 100);
              return (
                <div key={district} className="space-y-1 text-xs font-semibold">
                  <div className="flex justify-between text-slate-700">
                    <span>{district} District</span>
                    <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-purple-600 h-full rounded-full" style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Quick Action Navigation Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Department Administrative Management Modules
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/admin/researchers" className="p-4 bg-slate-50 hover:bg-purple-50 rounded-2xl border border-slate-200 space-y-2 text-left transition-colors">
            <div className="w-10 h-10 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">Approve Researchers</div>
            <div className="text-xs text-slate-500 font-medium">Verify employee credentials ({pendingResearchers.length} pending)</div>
          </Link>

          <Link to="/admin/users" className="p-4 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 space-y-2 text-left transition-colors">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">Manage All Users</div>
            <div className="text-xs text-slate-500 font-medium">Farmer & expert accounts directory</div>
          </Link>

          <Link to="/admin/departments" className="p-4 bg-slate-50 hover:bg-blue-50 rounded-2xl border border-slate-200 space-y-2 text-left transition-colors">
            <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">Manage Departments</div>
            <div className="text-xs text-slate-500 font-medium">Assign lead experts to {departments.length} depts</div>
          </Link>

          <Link to="/admin/solutions" className="p-4 bg-slate-50 hover:bg-amber-50 rounded-2xl border border-slate-200 space-y-2 text-left transition-colors">
            <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-xl flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="font-extrabold text-sm text-slate-900">Review Published KB</div>
            <div className="text-xs text-slate-500 font-medium">{verifiedSolutionsCount} verified knowledge articles</div>
          </Link>
        </div>
      </div>
    </div>
  );
};
