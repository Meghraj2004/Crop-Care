import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Microscope, CheckCircle2, FileText, User, Calendar, Save } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ResearchCaseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { researchCases, updateResearchCase } = useData();

  const rc = researchCases.find(r => r.id === id);

  const [formData, setFormData] = useState({
    status: rc?.status || 'Data Collection',
    researchNotes: rc?.researchNotes || '',
    findings: rc?.findings || '',
    conclusion: rc?.conclusion || ''
  });

  const [saved, setSaved] = useState(false);

  if (!rc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Research Case Not Found</h2>
        <Link to="/expert/research" className="px-4 py-2 bg-orange-600 text-white text-xs font-bold rounded-xl inline-block">
          Back to Research Cases
        </Link>
      </div>
    );
  }

  const handleUpdate = (e) => {
    e.preventDefault();
    updateResearchCase(rc.id, formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-orange-600 bg-white border border-slate-200 px-3.5 py-2 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Research Directory
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-black text-orange-800 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {rc.id}
              </span>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                Linked Issue: {rc.issueId}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">{rc.title}</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Crop: <strong>{rc.crop}</strong> • Department: <strong>{rc.department}</strong>
            </p>
          </div>

          <div className="text-right text-xs text-slate-500 space-y-1">
            <div>Started: <strong>{rc.startDate}</strong></div>
            <div>Last Updated: <strong>{rc.lastUpdated}</strong></div>
          </div>
        </div>

        {/* Update Form */}
        <form onSubmit={handleUpdate} className="space-y-5 text-xs font-semibold text-slate-700">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Research status & findings saved!
            </div>
          )}

          <div>
            <label className="block mb-1 text-slate-900 font-bold">Research Lifecycle Status *</label>
            <select
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-bold"
            >
              <option value="New Research Case">New Research Case</option>
              <option value="Investigation Started">Investigation Started</option>
              <option value="Data Collection">Data Collection & Soil Sampling</option>
              <option value="Analysis">Laboratory Culture & Strain Analysis</option>
              <option value="Solution Identified">Solution Identified / Trial Passed</option>
              <option value="Research Completed">Research Completed & Published</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-slate-900 font-bold">Research Progress Notes *</label>
            <textarea
              rows={3}
              required
              value={formData.researchNotes}
              onChange={e => setFormData({ ...formData, researchNotes: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-900 font-bold">Scientific Findings *</label>
            <textarea
              rows={3}
              required
              value={formData.findings}
              onChange={e => setFormData({ ...formData, findings: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block mb-1 text-slate-900 font-bold">Final Conclusion & Spray Protocol</label>
            <textarea
              rows={3}
              value={formData.conclusion}
              onChange={e => setFormData({ ...formData, conclusion: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-orange-500 text-xs font-medium"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Research Case Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
