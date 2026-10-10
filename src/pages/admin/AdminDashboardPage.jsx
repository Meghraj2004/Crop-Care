import React, { useState } from 'react';
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
  UserPlus,
  Database,
  AlertTriangle,
  RefreshCw,
  Copy,
  ExternalLink,
  Radio,
  Eye,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const AdminDashboardPage = () => {
  const { users, approveResearcher } = useAuth();
  const { 
    issues, 
    researchCases, 
    knowledgeArticles, 
    departments, 
    firestorePermissionError, 
    seedSampleFirestoreData 
  } = useData();

  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState(null);
  const [copiedRule, setCopiedRule] = useState(false);

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
    if (issue.cropName) {
      acc[issue.cropName] = (acc[issue.cropName] || 0) + 1;
    }
    return acc;
  }, {});

  const categoryCounts = issues.reduce((acc, issue) => {
    if (issue.category) {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
    }
    return acc;
  }, {});

  const districtCounts = issues.reduce((acc, issue) => {
    if (issue.district) {
      acc[issue.district] = (acc[issue.district] || 0) + 1;
    }
    return acc;
  }, {});

  const sampleRulesText = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;

  const handleCopyRule = () => {
    navigator.clipboard.writeText(sampleRulesText);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 3000);
  };

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedStatus(null);
    try {
      const res = await seedSampleFirestoreData();
      if (res && res.success) {
        setSeedStatus({ 
          type: 'success', 
          message: '✓ Cloud Firestore populated with sample departments, issues, and expert accounts! Dashboard updated.' 
        });
      } else {
        setSeedStatus({ 
          type: 'error', 
          message: 'Could not write to Cloud Firestore. Please update your Firestore Security Rules in Firebase Console to allow write.' 
        });
      }
    } catch (err) {
      setSeedStatus({ 
        type: 'error', 
        message: 'Seeding failed: ' + (err.message || 'Permission denied.') 
      });
    } finally {
      setSeeding(false);
    }
  };

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
            Monitor crop disease outbreaks, approve researcher credentials, and track real-time agricultural metrics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {pendingResearchers.length > 0 && (
            <Link
              to="/admin/researchers"
              className="px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0 animate-pulse"
            >
              <UserPlus className="w-5 h-5" /> Approve Pending Researchers ({pendingResearchers.length})
            </Link>
          )}

          <button
            onClick={handleSeedData}
            disabled={seeding}
            className="px-4 py-3 bg-purple-800/90 hover:bg-purple-700 border border-purple-600 text-white font-extrabold text-xs rounded-2xl shadow transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
            title="Populate test crop issues, departments, and users in Cloud Firestore"
          >
            <RefreshCw className={`w-4 h-4 ${seeding ? 'animate-spin' : ''}`} />
            {seeding ? 'Syncing to Firestore...' : 'Seed Sample Firestore Data'}
          </button>
        </div>
      </div>

      {/* Cloud Firestore Status Notice */}
      {firestorePermissionError ? (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 border-2 border-amber-300 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-900 text-base">
                  Action Required: Cloud Firestore Security Rules are in Locked Mode
                </h3>
                <span className="bg-red-100 text-red-800 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Permission Denied
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                Google Cloud Firestore returned a <strong>PERMISSION_DENIED</strong> error. This happens when Firestore is created in production mode (<code className="bg-white/80 px-1 py-0.5 rounded border border-amber-200">allow read, write: if false;</code>). Because of this, real-time queries and dashboard writes are currently blocked by Google servers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-amber-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <span className="text-xs font-black text-slate-800">
                1. Update your Firestore rules in Firebase Console:
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyRule}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-600" />
                  {copiedRule ? 'Copied!' : 'Copy Rule'}
                </button>
                <a
                  href="https://console.firebase.google.com/project/cropcare-21809/firestore/rules"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Open Firestore Rules Console
                </a>
              </div>
            </div>

            <pre className="text-xs bg-slate-950 text-emerald-400 p-3.5 rounded-xl font-mono overflow-x-auto leading-relaxed">
              {sampleRulesText}
            </pre>
            <p className="text-[11px] text-slate-500 font-medium">
              Paste the code above in <strong>Firebase Console → Firestore Database → Rules</strong> tab and click <strong>Publish</strong>. Once published, click <strong>"Seed Sample Firestore Data"</strong> above or refresh this page to see live real-time sync!
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-medium text-emerald-900 shadow-sm">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="font-bold">Cloud Firestore Live Synchronized</span>
            <span className="text-emerald-700 text-[11px] hidden md:inline">
              (Project: <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-emerald-200">cropcare-21809</code> • Pure Firestore Snapshot Engine)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-emerald-800 font-bold">
              {totalIssues} Active Cases Loaded
            </span>
            {totalIssues === 0 && (
              <button
                onClick={handleSeedData}
                disabled={seeding}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow transition-colors"
              >
                Populate Initial Real-Time Cases
              </button>
            )}
          </div>
        </div>
      )}

      {/* Seeding Feedback Notification */}
      {seedStatus && (
        <div className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 ${
          seedStatus.type === 'success' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' : 'bg-red-100 text-red-900 border border-red-300'
        }`}>
          {seedStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          )}
          <span>{seedStatus.message}</span>
        </div>
      )}

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
          <div className="text-[10px] font-extrabold text-blue-800 uppercase">Departments</div>
          <div className="text-2xl font-black text-blue-900">{departments.length}</div>
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
            <span className="text-[10px] font-bold text-slate-400">Live Breakdown</span>
          </div>
          <div className="space-y-3">
            {Object.keys(cropCounts).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No crop cases recorded in Firestore yet.
              </div>
            ) : (
              Object.entries(cropCounts).map(([crop, count]) => {
                const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                return (
                  <div key={crop} className="space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>{crop}</span>
                      <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Problems by Category */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-600" /> Problems by Category
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Live Outbreaks</span>
          </div>
          <div className="space-y-3">
            {Object.keys(categoryCounts).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No category data recorded in Firestore yet.
              </div>
            ) : (
              Object.entries(categoryCounts).map(([cat, count]) => {
                const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                return (
                  <div key={cat} className="space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>{cat}</span>
                      <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cases by District */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-purple-600" /> Regional Outbreaks by District
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Regional Hotspots</span>
          </div>
          <div className="space-y-3">
            {Object.keys(districtCounts).length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 font-medium">
                No regional data recorded in Firestore yet.
              </div>
            ) : (
              Object.entries(districtCounts).map(([district, count]) => {
                const pct = totalIssues > 0 ? Math.round((count / totalIssues) * 100) : 0;
                return (
                  <div key={district} className="space-y-1 text-xs font-semibold">
                    <div className="flex justify-between text-slate-700">
                      <span>{district} District</span>
                      <span className="font-bold text-slate-900">{count} cases ({pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Live Reported Crop Issues Stream Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Radio className="w-5 h-5 text-emerald-600 animate-pulse" /> Live Reported Crop Cases Stream
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Real-time incoming crop problems submitted by farmers across all districts
            </p>
          </div>
          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-xl self-start sm:self-auto">
            {issues.length} Cases in Cloud Firestore
          </span>
        </div>

        {issues.length === 0 ? (
          <div className="text-center py-12 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-2xl flex items-center justify-center mx-auto font-black text-lg">
              <Database className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="font-black text-slate-900 text-sm">No Crop Issues in Firestore Database Yet</div>
              <p className="text-xs text-slate-500 max-w-md mx-auto font-medium">
                When farmers submit problems from their portal, they will appear here instantaneously via Cloud Firestore real-time listeners.
              </p>
            </div>
            <button
              onClick={handleSeedData}
              disabled={seeding}
              className="px-4 py-2 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
              Seed 4 Sample Issues Now
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-extrabold uppercase text-[10px]">
                  <th className="pb-3 px-3">Issue ID</th>
                  <th className="pb-3 px-3">Crop & Title</th>
                  <th className="pb-3 px-3">Farmer & Location</th>
                  <th className="pb-3 px-3">Category</th>
                  <th className="pb-3 px-3">Priority</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3">Date</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {issues.map(iss => (
                  <tr key={iss.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700 text-[11px]">
                      {iss.id}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-extrabold text-slate-900">{iss.title}</div>
                      <div className="text-[11px] text-emerald-700 font-bold">{iss.cropName}</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="text-slate-900 font-semibold">{iss.farmerName || 'Farmer'}</div>
                      <div className="text-[11px] text-slate-400">{iss.district ? `${iss.district}, ${iss.state || ''}` : 'Location unrecorded'}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {iss.category}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        iss.priority === 'Urgent' ? 'bg-red-100 text-red-800' :
                        iss.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {iss.priority || 'Normal'}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        iss.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' :
                        iss.status === 'Assigned' ? 'bg-blue-100 text-blue-800' :
                        iss.status === 'Under Review' ? 'bg-purple-100 text-purple-800' :
                        'bg-amber-100 text-amber-800'
                      }`}>
                        {iss.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">
                      {iss.createdAt ? new Date(iss.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        to={`/farmer/issues/${iss.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 rounded-lg text-[11px] font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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

