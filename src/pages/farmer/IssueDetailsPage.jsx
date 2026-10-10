import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  MapPin, 
  UserCheck, 
  PlusCircle, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  MessageSquare, 
  Microscope,
  Calendar,
  Image as ImageIcon,
  TrendingUp,
  XCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const IssueDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { issues, issueUpdates, expertResponses, addIssueUpdate } = useData();
  const { t } = useLanguage();

  const issue = issues.find(i => i.id === id);
  const updates = issueUpdates.filter(u => u.issueId === id).sort((a, b) => new Date(a.date) - new Date(b.date));
  const response = expertResponses.find(r => r.issueId === id);

  const [modalOpen, setModalOpen] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    description: '',
    condition: 'Improving',
    image: ''
  });

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('noCasesFound')}</h2>
        <p className="text-slate-500 text-sm">{t('Issue ID does not exist in the database.', 'Issue ID does not exist in the database.')}</p>
        <Link to="/farmer/issues" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
          {t('myReportedCasesTitle')}
        </Link>
      </div>
    );
  }

  const handleAddUpdate = (e) => {
    e.preventDefault();
    if (!updateFormData.description) {
      alert(t('Please enter a progress description.', 'Please enter a progress description.'));
      return;
    }
    addIssueUpdate(issue.id, currentUser?.id || issue.farmerId, updateFormData);
    setModalOpen(false);
    setUpdateFormData({
      date: new Date().toISOString().split('T')[0],
      description: '',
      condition: 'Improving',
      image: ''
    });
  };

  // Timeline Stepper Progress Index
  const stepsList = [
    { key: "Submitted", label: t('Submitted') },
    { key: "Assigned", label: t('Assigned') },
    { key: "Under Review", label: t('Under Review') },
    { key: "Expert Responded", label: t('Expert Responded') },
    { key: "Farmer Updating", label: t('Farmer Updating') },
    { key: "Resolved", label: t('Resolved') }
  ];
  let activeStepIndex = 0;
  if (issue.status === 'Assigned') activeStepIndex = 1;
  else if (issue.status === 'Under Review') activeStepIndex = 2;
  else if (issue.status === 'Expert Responded') activeStepIndex = 3;
  else if (issue.status === 'Farmer Updating') activeStepIndex = 4;
  else if (issue.status === 'Resolved' || issue.status === 'Closed') activeStepIndex = 5;
  else if (issue.status === 'Research Required') activeStepIndex = 4;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('Back', 'Back')}
        </button>

        <div className="flex items-center gap-2">
          {currentUser?.role === 'Agricultural Expert / Researcher' && (
            <Link
              to={`/expert/cases/${issue.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition-colors"
            >
              <Microscope className="w-4 h-4" /> Review & Submit Diagnosis
            </Link>
          )}

          {(currentUser?.role === 'Farmer' || !currentUser?.role) && (
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow transition-colors"
            >
              <PlusCircle className="w-4 h-4" /> {t('addFollowupUpdate')}
            </button>
          )}
        </div>
      </div>

      {/* Main Issue Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {issue.id}
              </span>
              <StatusBadge status={issue.status} size="lg" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-slate-900 leading-snug">
              {issue.title}
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-semibold">
              {t('Crop', 'Crop')}: <span className="text-slate-800 font-extrabold">{t(issue.cropName)}</span> ({issue.cropVariety}) • {t('problemCategoryLabel')}: {t(issue.category)}
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1 shrink-0">
            <div>{t('reportedOn')} <strong>{new Date(issue.createdAt).toLocaleDateString()}</strong></div>
            <div>{t('departmentAssignmentLabel')}: <strong>{t(issue.departmentName)}</strong></div>
            <div>{t('Assigned to', 'Assigned')}: <strong>{issue.assignedExpertName}</strong></div>
          </div>
        </div>

        {/* Visual Status Timeline Stepper */}
        <div className="py-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t('timelineHeading')}</div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs font-semibold">
            {stepsList.map((stepItem, idx) => {
              const isPassed = idx <= activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div key={idx} className={`p-2.5 rounded-2xl border transition-all ${isCurrent ? 'bg-emerald-600 text-white font-extrabold shadow-md border-emerald-600' : isPassed ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}>
                  <div className="text-[10px] font-mono opacity-80">{t('Step', 'Step')} {idx + 1}</div>
                  <div className="text-xs truncate">{stepItem.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Issue Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-2">
          {/* Symptoms & Info */}
          <div className="md:col-span-7 space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              {t('symptomsDescriptionLabel')}
            </h3>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
              {issue.description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <div><span className="text-slate-500 font-semibold block">{t('cropGrowthStage')}:</span> <span className="font-bold text-slate-900">{t(issue.growthStage)}</span></div>
              <div><span className="text-slate-500 font-semibold block">{t('firstNoticedDate')}:</span> <span className="font-bold text-slate-900">{issue.firstNoticedDate}</span></div>
              <div><span className="text-slate-500 font-semibold block">{t('fieldLocationLabel')}:</span> <span className="font-bold text-slate-900">{issue.village}, {issue.taluka}, {issue.district}</span></div>
              <div><span className="text-slate-500 font-semibold block">{t('gpsCoordinatesLabel')}:</span> <span className="font-bold text-slate-900">{issue.coordinates}</span></div>
            </div>
          </div>

          {/* Attached Crop Photos */}
          <div className="md:col-span-5 space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              {t('uploadPhotosLabel')} ({issue.images.length})
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(issue.images || [CROP_IMAGE_FALLBACKS.generalCrop]).map((img, i) => (
                <div key={i} className="relative rounded-2xl overflow-hidden border border-slate-200 aspect-square bg-slate-900">
                  <img 
                    src={img} 
                    alt={`Crop photo ${i + 1}`} 
                    onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expert Response Card (if available) */}
      {response && (
        <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-lg font-black">{t('expertRecommendation')}</h2>
                <p className="text-xs text-emerald-200">{response.expertName} • {response.expertTitle} ({response.expertInstitution})</p>
              </div>
            </div>
            <span className="bg-emerald-700 text-emerald-100 text-xs font-bold px-3 py-1 rounded-full">
              {new Date(response.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="bg-emerald-950/60 p-4 rounded-2xl border border-emerald-700/50">
              <span className="text-emerald-300 font-extrabold block text-xs uppercase tracking-wider mb-1">{t('diagnosisTitle')}</span>
              <p className="font-bold text-white leading-relaxed">{response.diagnosis}</p>
            </div>

            {response.possibleCause && (
              <div className="bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-700/30">
                <span className="text-emerald-300 font-extrabold block text-[11px] uppercase">{t('Cause / Conditions', 'Cause / Conditions')}:</span>
                <p className="text-emerald-100 mt-0.5">{response.possibleCause}</p>
              </div>
            )}

            <div className="bg-amber-500/20 p-4 rounded-2xl border border-amber-400/40 text-amber-100 space-y-1">
              <span className="text-amber-300 font-extrabold block text-xs uppercase tracking-wider">{t('treatmentTitle')}</span>
              <p className="whitespace-pre-line leading-relaxed font-semibold">{response.treatment}</p>
            </div>

            <div className="bg-emerald-950/40 p-4 rounded-2xl border border-emerald-700/30 space-y-1">
              <span className="text-emerald-300 font-extrabold block text-xs uppercase tracking-wider">{t('preventionTitle')}</span>
              <p className="text-emerald-100 whitespace-pre-line leading-relaxed">{response.prevention}</p>
            </div>
          </div>
        </div>
      )}

      {/* FARMER PROGRESS LOG / TIMELINE SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" /> {t('followupUpdates')}
            </h2>
            <p className="text-xs text-slate-500">{t('Record how crop conditions change over time after applying expert advice', 'Record how crop conditions change over time after applying expert advice')}</p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> {t('addFollowupUpdate')}
          </button>
        </div>

        {/* Chronological Timeline */}
        {updates.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            {t('No progress entries added yet. Click Add Timeline Entry to document leaf improvement or spray results.', 'No progress entries added yet. Click Add Timeline Entry to document leaf improvement or spray results.')}
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-emerald-200 space-y-6">
            {updates.map((upd, idx) => {
              let conditionColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
              if (upd.condition === 'Same') conditionColor = "bg-amber-100 text-amber-800 border-amber-300";
              else if (upd.condition === 'Getting Worse') conditionColor = "bg-red-100 text-red-800 border-red-300";
              else if (upd.condition === 'Resolved') conditionColor = "bg-purple-100 text-purple-800 border-purple-300";

              return (
                <div key={upd.id} className="relative group">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow"></div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" /> {t('Entry', 'Entry')} #{idx + 1} • {upd.date}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${conditionColor}`}>
                        {t('Condition', 'Condition')}: {t(upd.condition)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {upd.description}
                    </p>

                    {upd.image && (
                      <div className="pt-2">
                        <img 
                          src={upd.image} 
                          alt="Update photo" 
                          onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                          className="w-24 h-24 rounded-xl object-cover border border-slate-300" 
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Progress Update Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t('addFollowupUpdate')}
      >
        <form onSubmit={handleAddUpdate} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1">{t('firstNoticedDate')} *</label>
            <input
              type="date"
              required
              value={updateFormData.date}
              onChange={e => setUpdateFormData({ ...updateFormData, date: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          <div>
            <label className="block mb-1">{t('Problem Status', 'Crop Condition Status')} *</label>
            <select
              value={updateFormData.condition}
              onChange={e => setUpdateFormData({ ...updateFormData, condition: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-bold"
            >
              <option value="Improving">🟢 {t('Improving', 'Improving (New green leaves appearing)')}</option>
              <option value="Same">🟡 {t('Same', 'Same (No major change)')}</option>
              <option value="Getting Worse">🔴 {t('Getting Worse', 'Getting Worse (Spots or pests increasing)')}</option>
              <option value="Resolved">🟣 {t('Resolved', 'Fully Resolved (Crop cured completely)')}</option>
            </select>
          </div>

          <div>
            <label className="block mb-1">{t('symptomsDescriptionLabel')} *</label>
            <textarea
              rows={4}
              required
              value={updateFormData.description}
              onChange={e => setUpdateFormData({ ...updateFormData, description: e.target.value })}
              placeholder={t('symptomsPlaceholder')}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
            >
              {t('Cancel', 'Cancel')}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow"
            >
              {t('Save', 'Save Timeline Entry')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
