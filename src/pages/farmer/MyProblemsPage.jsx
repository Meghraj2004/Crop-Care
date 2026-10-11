import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, FileText, Search, Filter, Calendar, MapPin, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const MyProblemsPage = () => {
  const { currentUser } = useAuth();
  const { issues } = useData();
  const { t } = useLanguage();

  const farmerIssues = issues.filter(i => {
    if (!currentUser) return false;
    const currentUid = (currentUser.uid || currentUser.id || '').toString();
    const currentEmail = (currentUser.email || '').toLowerCase().trim();
    const currentName = (currentUser.fullName || '').toLowerCase().trim();

    const matchesId = i.farmerId && (i.farmerId.toString() === currentUid || (currentUser.id && i.farmerId.toString() === currentUser.id.toString()));
    const matchesEmail = currentEmail && i.farmerEmail && i.farmerEmail.toLowerCase().trim() === currentEmail;
    const matchesName = currentName && i.farmerName && i.farmerName.toLowerCase().trim() === currentName;

    return Boolean(matchesId || matchesEmail || matchesName);
  });

  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIssues = farmerIssues.filter(issue => {
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
    const matchesSearch = !searchQuery || 
      (issue.title && issue.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (issue.cropName && issue.cropName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (issue.id && issue.id.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t('myReportedCasesTitle')}</h1>
          <p className="text-xs text-slate-500 font-medium">{t('myReportedCasesSubtitle')}</p>
        </div>

        <Link
          to="/farmer/report-problem"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-2 self-start"
        >
          <PlusCircle className="w-4 h-4" /> {t('reportNewProblem')}
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('searchMyCasesPlaceholder')}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="w-full sm:w-auto bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
          >
            <option value="All">{t('allStatuses')} ({farmerIssues.length})</option>
            <option value="Submitted">{t('Submitted')}</option>
            <option value="Assigned">{t('Assigned')}</option>
            <option value="Under Review">{t('Under Review')}</option>
            <option value="Expert Responded">{t('Expert Responded')}</option>
            <option value="Farmer Updating">{t('Farmer Updating')}</option>
            <option value="Research Required">{t('Research Required')}</option>
            <option value="Resolved">{t('Resolved')}</option>
          </select>
        </div>
      </div>

      {/* Issues Grid / List */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{t('noCasesFound')}</h3>
          <p className="text-xs text-slate-500">{t('tryDifferentSearch')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIssues.map(issue => (
            <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {issue.id}
                  </span>
                  <StatusBadge status={issue.status} size="sm" />
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src={issue.images?.[0] || CROP_IMAGE_FALLBACKS.generalCrop}
                    alt={issue.title}
                    onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                    className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-semibold">
                      {t('Crop', 'Crop')}: <span className="text-slate-800">{t(issue.cropName)}</span> • {t(issue.category)}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {t('reportedOn')} {new Date(issue.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                  {issue.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[11px]">{t('Department', 'Dept')}: <strong>{t(issue.departmentName)}</strong></span>
                <Link
                  to={`/farmer/issues/${issue.id}`}
                  className="px-4 py-2 bg-slate-900 hover:bg-emerald-600 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  {t('viewDetails')} <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
