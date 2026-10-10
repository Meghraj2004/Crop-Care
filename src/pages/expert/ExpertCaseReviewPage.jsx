import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FileText, 
  Microscope, 
  Send, 
  AlertTriangle, 
  Building2, 
  Calendar, 
  MapPin, 
  CheckSquare, 
  TrendingUp,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const ExpertCaseReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { issues, issueUpdates, expertResponses, addExpertResponse, convertToResearchCase } = useData();

  const issue = issues.find(i => i.id === id);
  const updates = issueUpdates.filter(u => u.issueId === id);
  const existingResponse = expertResponses.find(r => r.issueId === id);

  // Dynamic crop-aware initial template
  const getDefaultDiagnosis = () => {
    if (existingResponse?.diagnosis) return existingResponse.diagnosis;
    if (issue?.cropName === 'Tomato') return 'Early Blight of Tomato (Alternaria solani fungal infection)';
    if (issue?.cropName === 'Grape') return 'Downy Mildew of Grapes (Plasmopara viticola)';
    if (issue?.cropName === 'Cotton') return 'Pink Bollworm Infestation (Pectinophora gossypiella)';
    if (issue?.cropName === 'Sugarcane') return 'Red Rot of Sugarcane (Colletotrichum falcatum)';
    if (issue?.cropName === 'Banana') return 'Sigatoka Leaf Spot Disease (Pseudocercospora musae)';
    if (issue?.cropName === 'Pomegranate') return 'Bacterial Blight / Telya Disease (Xanthomonas axonopodis)';
    return `${issue?.category || 'Crop Issue'} observed on ${issue?.cropName || 'crop'}: ${issue?.title || ''}`;
  };

  const getDefaultCause = () => {
    if (existingResponse?.possibleCause) return existingResponse.possibleCause;
    return `Environmental conditions: High humidity and temperature fluctuations favorable for ${issue?.category || 'symptom spread'}.`;
  };

  const getDefaultTreatment = () => {
    if (existingResponse?.treatment) return existingResponse.treatment;
    if (issue?.category === 'Pest Attack') return '1. Spray Neem oil @ 5ml/L as botanical repellent.\n2. Apply recommended systemic insecticide as per label dosage.';
    if (issue?.category === 'Nutrient Deficiency') return '1. Foliar spray of Micronutrient Mixture Grade-II @ 2.5g/L.\n2. Ensure proper soil pH and balanced N:P:K fertigation.';
    return '1. Apply recommended contact fungicide/bactericide.\n2. In severe infection, spray systemic treatment after 7 days.';
  };

  const getDefaultPrevention = () => {
    if (existingResponse?.prevention) return existingResponse.prevention;
    return '1. Maintain balanced irrigation to prevent waterlogging.\n2. Ensure proper crop canopy aeration and weed removal.';
  };

  const [responseForm, setResponseForm] = useState({
    issueId: id,
    diagnosis: getDefaultDiagnosis(),
    possibleCause: getDefaultCause(),
    recommendation: existingResponse?.recommendation || `Apply targeted agricultural protocol for ${issue?.cropName || 'crop'}.`,
    treatment: getDefaultTreatment(),
    prevention: getDefaultPrevention(),
    notes: existingResponse?.notes || '',
    verified: true,
    publishToKb: true,
    isResolved: false
  });

  const [researchModalOpen, setResearchModalOpen] = useState(false);
  const [researchForm, setResearchForm] = useState({
    title: `Research Case for ${issue?.cropName || 'Crop'} - ${issue?.title || 'Unknown Outbreak'}`,
    notes: 'Outbreak unresponsive to standard dosage. Requires laboratory culture isolation and genetic strain identification.',
    findings: `Initial sample collection scheduled at ${currentUser?.institution || 'Agricultural University'} research lab.`
  });

  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!issue) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Case Not Found</h2>
        <Link to="/expert/cases" className="px-4 py-2 bg-teal-600 text-white font-bold text-xs rounded-xl inline-block">
          Back to Assigned Cases
        </Link>
      </div>
    );
  }

  const handleResponseSubmit = (e) => {
    e.preventDefault();
    addExpertResponse(responseForm, currentUser || { id: "usr_expert_1", fullName: "Dr. Anil Sharma", specialization: "Plant Pathology" });
    setSubmittedSuccess(true);
    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 3000);
  };

  const handleCreateResearchCase = (e) => {
    e.preventDefault();
    convertToResearchCase(issue.id, researchForm, currentUser || { id: "usr_expert_1", fullName: "Dr. Anil Sharma", department: "Plant Pathology" });
    setResearchModalOpen(false);
    alert(`Case ${issue.id} successfully converted to Research Case!`);
    navigate('/expert/research');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-teal-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Assigned Queue
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setResearchModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl shadow transition-colors"
          >
            <Microscope className="w-4 h-4" /> Convert to Research Case
          </button>
        </div>
      </div>

      {/* Main Grid: Left Farmer Case Details / Right Expert Response Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 6 Cols: Farmer Problem Info & Images & Progress Timeline */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs font-black text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                  {issue.id}
                </span>
                <h1 className="text-xl font-black text-slate-900 mt-2">{issue.title}</h1>
              </div>
              <StatusBadge status={issue.status} size="md" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 font-semibold">
              <div><span className="text-slate-400 block">Farmer Name:</span> <span className="text-slate-900 font-bold">{issue.farmerName}</span></div>
              <div><span className="text-slate-400 block">Mobile Contact:</span> <span className="text-slate-900 font-bold">{issue.farmerMobile}</span></div>
              <div><span className="text-slate-400 block">Crop & Variety:</span> <span className="text-slate-900 font-bold">{issue.cropName} ({issue.cropVariety})</span></div>
              <div><span className="text-slate-400 block">Growth Stage:</span> <span className="text-slate-900 font-bold">{issue.growthStage}</span></div>
              <div><span className="text-slate-400 block">Location:</span> <span className="text-slate-900 font-bold">{issue.village}, {issue.taluka}, {issue.district}</span></div>
              <div><span className="text-slate-400 block">Tagged Dept:</span> <span className="text-slate-900 font-bold">{issue.departmentName}</span></div>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-700 block">Farmer Symptoms Description:</span>
              <div className="p-3.5 bg-amber-50/50 rounded-2xl border border-amber-200 text-xs text-slate-800 leading-relaxed font-medium">
                {issue.description}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-700 block">Uploaded Crop Photos ({issue.images.length}):</span>
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

          {/* Farmer Timeline Updates */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
              <TrendingUp className="w-4 h-4 text-teal-600" /> Farmer Timeline Updates ({updates.length})
            </h3>
            {updates.length === 0 ? (
              <div className="text-xs text-slate-500 py-4 text-center">No timeline updates added by farmer yet.</div>
            ) : (
              <div className="space-y-3">
                {updates.map(upd => (
                  <div key={upd.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{upd.date}</span>
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px]">
                        Condition: {upd.condition}
                      </span>
                    </div>
                    <p className="text-slate-600 font-medium">{upd.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 6 Cols: Expert Diagnosis & Response Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-white rounded-3xl border border-teal-200 p-6 sm:p-8 shadow-lg space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-600" /> Expert Diagnosis & Recommendation
              </h2>
              <p className="text-xs text-slate-500">Provide official guidance for the farmer & state knowledge base</p>
            </div>

            {submittedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Expert response submitted and published!
              </div>
            )}

            <form onSubmit={handleResponseSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Scientific Diagnosis *</label>
                <textarea
                  rows={2}
                  required
                  value={responseForm.diagnosis}
                  onChange={e => setResponseForm({ ...responseForm, diagnosis: e.target.value })}
                  placeholder="e.g. Early Blight of Tomato (Alternaria solani)"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">Possible Cause / Favorable Factors</label>
                <textarea
                  rows={2}
                  value={responseForm.possibleCause}
                  onChange={e => setResponseForm({ ...responseForm, possibleCause: e.target.value })}
                  placeholder="e.g. High atmospheric humidity and leaf wetness"
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block mb-1">Recommended Treatment / Spraying Protocol *</label>
                <textarea
                  rows={4}
                  required
                  value={responseForm.treatment}
                  onChange={e => setResponseForm({ ...responseForm, treatment: e.target.value })}
                  placeholder="1. Spray Mancozeb 75% WP @ 2.5g/L water..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium leading-relaxed"
                />
              </div>

              <div>
                <label className="block mb-1">Preventive Measures & Agronomic Advice *</label>
                <textarea
                  rows={3}
                  required
                  value={responseForm.prevention}
                  onChange={e => setResponseForm({ ...responseForm, prevention: e.target.value })}
                  placeholder="1. Prune lower leaves... 2. Crop rotation..."
                  className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs font-medium leading-relaxed"
                />
              </div>

              {/* Verified Solution Checkbox */}
              <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="verified-kb-check"
                  checked={responseForm.publishToKb}
                  onChange={e => setResponseForm({ ...responseForm, publishToKb: e.target.checked, verified: e.target.checked })}
                  className="mt-0.5 w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="verified-kb-check" className="cursor-pointer">
                  <span className="font-extrabold text-emerald-900 block text-xs">Mark as "Verified Expert Solution"</span>
                  <span className="text-[11px] text-emerald-700 block font-normal">
                    Automatically publishes this verified diagnosis & treatment to the Public Knowledge Base for all state farmers.
                  </span>
                </label>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-black text-xs rounded-xl shadow transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Recommendation to Farmer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Convert to Research Case Modal */}
      <Modal
        isOpen={researchModalOpen}
        onClose={() => setResearchModalOpen(false)}
        title="Convert Issue to Agriculture Research Case"
      >
        <form onSubmit={handleCreateResearchCase} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1">Research Case Title *</label>
            <input
              type="text"
              required
              value={researchForm.title}
              onChange={e => setResearchForm({ ...researchForm, title: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block mb-1">Research Reason & Notes *</label>
            <textarea
              rows={3}
              required
              value={researchForm.notes}
              onChange={e => setResearchForm({ ...researchForm, notes: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block mb-1">Initial Findings / Lab Trial Plan</label>
            <textarea
              rows={3}
              value={researchForm.findings}
              onChange={e => setResearchForm({ ...researchForm, findings: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setResearchModalOpen(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow"
            >
              Confirm & Create Research Case
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
