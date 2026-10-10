import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, 
  Search, 
  Filter, 
  Microscope, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const ExpertDashboardPage = () => {
  const { currentUser } = useAuth();
  const { issues, researchCases, expertResponses } = useData();

  // Filter issues assigned to this expert or department
  const assignedIssues = issues.filter(i => 
    i.assignedExpertId === currentUser?.id || 
    i.assignedExpertName === currentUser?.fullName ||
    i.departmentName === currentUser?.department
  );

  const pendingReview = assignedIssues.filter(i => ['Submitted', 'Assigned', 'Under Review'].includes(i.status)).length;
  const casesResponded = expertResponses.filter(r => r.expertId === currentUser?.id || r.expertName === currentUser?.fullName).length;
  const researchCasesCount = researchCases.filter(r => r.assignedResearchers?.includes(currentUser?.fullName)).length;
  const resolvedCases = assignedIssues.filter(i => i.status === 'Resolved').length;

  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredAssigned = assignedIssues.filter(i => priorityFilter === 'All' || i.priority === priorityFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-teal-700/80 px-3 py-1 rounded-full text-xs font-bold text-teal-200">
            <span>👨‍🔬 Official Agriculture Expert Portal</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            Welcome, {currentUser?.fullName || "Dr. Anil Sharma"}!
          </h1>
          <p className="text-teal-100 text-xs sm:text-sm font-medium">
            {currentUser?.department || "Plant Pathology"} • {currentUser?.institution || "MPKV Rahuri"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/expert/cases"
            className="px-5 py-3 bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs rounded-2xl shadow transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> View Assigned Queue ({pendingReview})
          </Link>
          <Link
            to="/expert/research"
            className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-2xl shadow transition-colors flex items-center gap-2"
          >
            <Microscope className="w-4 h-4" /> Research Cases ({researchCases.length})
          </Link>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Cases</div>
          <div className="text-3xl font-black text-slate-900">{assignedIssues.length}</div>
          <div className="text-[11px] text-slate-400 font-semibold">Total in queue</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/20">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pending Review</div>
          <div className="text-3xl font-black text-amber-900">{pendingReview}</div>
          <div className="text-[11px] text-amber-700 font-semibold">Requires diagnosis</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm space-y-1 bg-teal-50/20">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">Cases Responded</div>
          <div className="text-3xl font-black text-teal-900">{casesResponded}</div>
          <div className="text-[11px] text-teal-700 font-semibold">Guidance provided</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm space-y-1 bg-orange-50/20">
          <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">Research Cases</div>
          <div className="text-3xl font-black text-orange-900">{researchCasesCount}</div>
          <div className="text-[11px] text-orange-700 font-semibold">Under lab trial</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/20">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Resolved Cases</div>
          <div className="text-3xl font-black text-emerald-900">{resolvedCases}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">Cured crops</div>
        </div>
      </div>

      {/* Main Grid: Priority Cases Queue */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Priority Farmer Reports Queue</h2>
            <p className="text-xs text-slate-500 font-medium">Examine crop symptoms, photos, and provide verified spray treatment</p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-600">Filter Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-800"
            >
              <option value="All">All Priorities</option>
              <option value="High">High Priority Only</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredAssigned.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No assigned farmer reports match your filter criteria.
            </div>
          ) : (
            filteredAssigned.map(issue => (
              <div key={issue.id} className="p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-start gap-4">
                  <img
                    src={issue.images?.[0] || CROP_IMAGE_FALLBACKS.generalCrop}
                    alt={issue.title}
                    onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                        {issue.id}
                      </span>
                      <StatusBadge status={issue.status} size="sm" />
                      {issue.priority === 'High' && (
                        <span className="bg-red-100 text-red-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                          High Priority
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-base">{issue.title}</h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Farmer: <strong className="text-slate-800">{issue.farmerName}</strong> ({issue.village}, {issue.district}) • Crop: <strong>{issue.cropName}</strong>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-1">{issue.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/expert/cases/${issue.id}`}
                    className="w-full sm:w-auto px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors text-center"
                  >
                    Examine & Review Case →
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
