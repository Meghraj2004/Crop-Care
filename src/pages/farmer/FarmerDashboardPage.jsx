import React from 'react';
import { Link } from 'react-router-dom';
import { 
  PlusCircle, 
  FileText, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Microscope, 
  ChevronRight, 
  MessageSquare, 
  ArrowRight,
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { WeatherWidget } from '../../components/common/WeatherWidget';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const FarmerDashboardPage = () => {
  const { currentUser } = useAuth();
  const { issues, expertResponses, notifications, savedSolutions } = useData();
  const { t } = useLanguage();

  // Filter issues for current farmer
  const farmerIssues = issues.filter(i => i.farmerId === currentUser?.id || i.farmerName === currentUser?.fullName);

  // Statistics
  const totalReported = farmerIssues.length;
  const openCases = farmerIssues.filter(i => ['Submitted', 'Assigned', 'Under Review'].includes(i.status)).length;
  const underReview = farmerIssues.filter(i => i.status === 'Under Review').length;
  const solvedCases = farmerIssues.filter(i => i.status === 'Resolved').length;
  const researchCases = farmerIssues.filter(i => i.status === 'Research Required').length;

  const recentReplies = expertResponses.filter(r => farmerIssues.some(i => i.id === r.issueId));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-700/80 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
            <span>👨‍🌾 {t('farmerPortalBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black">
            {t('welcomeBack')}, {currentUser?.fullName || t('roleFarmer')}!
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            {t('locationLabel')}: {currentUser?.village || "Patonda"}, {currentUser?.taluka || "Chalisgaon"}, {currentUser?.district || "Jalgaon"} {t('district')}
          </p>
        </div>

        <Link
          to="/farmer/report-problem"
          className="w-full sm:w-auto px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2.5 shrink-0 transform active:scale-95"
        >
          <PlusCircle className="w-5 h-5" /> {t('reportNewProblem')}
        </Link>
      </div>

      {/* Overview Statistics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('statTotalReported')}</div>
          <div className="text-3xl font-black text-slate-900">{totalReported}</div>
          <div className="text-[11px] text-slate-400 font-semibold">{t('submittedCasesDesc')}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-sm space-y-1 bg-amber-50/20">
          <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">{t('statOpenCases')}</div>
          <div className="text-3xl font-black text-amber-900">{openCases}</div>
          <div className="text-[11px] text-amber-700 font-semibold">{t('awaitingSolutionDesc')}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-teal-200 shadow-sm space-y-1 bg-teal-50/20">
          <div className="text-xs font-bold text-teal-700 uppercase tracking-wider">{t('statUnderReview')}</div>
          <div className="text-3xl font-black text-teal-900">{underReview}</div>
          <div className="text-[11px] text-teal-700 font-semibold">{t('withScientistsDesc')}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-sm space-y-1 bg-emerald-50/20">
          <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{t('statSolvedCases')}</div>
          <div className="text-3xl font-black text-emerald-900">{solvedCases}</div>
          <div className="text-[11px] text-emerald-700 font-semibold">{t('successfullyCuredDesc')}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-200 shadow-sm space-y-1 bg-orange-50/20">
          <div className="text-xs font-bold text-orange-700 uppercase tracking-wider">{t('statResearchCases')}</div>
          <div className="text-3xl font-black text-orange-900">{researchCases}</div>
          <div className="text-[11px] text-orange-700 font-semibold">{t('underLabTrialDesc')}</div>
        </div>
      </div>

      {/* Main Content Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 Cols: Recent Problems & Expert Replies */}
        <div className="lg:col-span-8 space-y-8">
          {/* Recent Reported Problems List */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{t('myReportedCasesTitle')}</h2>
                <p className="text-xs text-slate-500">{t('myReportedCasesSubtitle')}</p>
              </div>
              <Link to="/farmer/issues" className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1">
                {t('viewAllCases')} ({farmerIssues.length}) <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {farmerIssues.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">{t('noCasesFound')}</h3>
                <p className="text-xs text-slate-500">{t('If your crop is showing yellow leaves, pest damage, or rot, submit a report.', 'If your crop is showing yellow leaves, pest damage, or rot, submit a report.')}</p>
                <Link to="/farmer/report-problem" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl">
                  {t('reportNewProblem')}
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {farmerIssues.slice(0, 4).map(issue => (
                  <div key={issue.id} className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group">
                    <div className="flex items-start gap-3.5">
                      <img
                        src={issue.images?.[0] || CROP_IMAGE_FALLBACKS.generalCrop}
                        alt={issue.title}
                        onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                        className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-emerald-800">{issue.id}</span>
                          <StatusBadge status={issue.status} size="sm" />
                        </div>
                        <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {t(issue.cropName)} • {t(issue.category)} • {t('reportedOn')} {new Date(issue.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Link
                      to={`/farmer/issues/${issue.id}`}
                      className="w-full sm:w-auto px-4 py-2 bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-800 text-xs font-extrabold rounded-xl transition-colors text-center shrink-0"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Expert Guidance & Replies */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" /> {t('expertResponsesUpdates')}
              </h2>
            </div>

            {recentReplies.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {t('noRepliesYet')}. {t('expertResponsesWillAppear')}
              </div>
            ) : (
              <div className="space-y-4">
                {recentReplies.slice(0, 3).map(reply => (
                  <div key={reply.id} className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-900">{reply.expertName} ({reply.expertTitle})</span>
                      <span className="text-[11px] text-slate-500">{t('Case', 'Case')} #{reply.issueId}</span>
                    </div>
                    <p className="text-xs text-slate-800 font-semibold">
                      <span className="text-emerald-800">{t('diagnosisTitle')}</span> {reply.diagnosis}
                    </p>
                    <p className="text-xs text-slate-700 line-clamp-2">
                      <span className="font-bold text-slate-900">{t('treatmentTitle')}</span> {reply.treatment}
                    </p>
                    <div className="pt-1">
                      <Link to={`/farmer/issues/${reply.issueId}`} className="text-xs font-bold text-emerald-700 hover:underline">
                        {t('viewFullSolution')}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 4 Cols: Weather Widget & Quick Tools */}
        <div className="lg:col-span-4 space-y-6">
          {/* Weather Widget */}
          <WeatherWidget defaultDistrict={currentUser?.district || "Jalgaon"} />

          {/* Quick Support & Saved Solutions Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-2">
              {t('quickLinks')}
            </h3>

            <div className="space-y-2.5">
              <Link
                to="/knowledge-base"
                className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Search className="w-4 h-4 text-emerald-600" /> {t('btnSearchSolutions')}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/farmer/saved-solutions"
                className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-600" /> {t('savedSolutionsTitle')} ({savedSolutions.length})
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>

              <Link
                to="/contact"
                className="p-3 bg-slate-50 hover:bg-emerald-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs font-bold text-slate-800 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-600" /> {t('contactSupportHelpline')}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
