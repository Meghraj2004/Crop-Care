import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, FileText, Calendar, User, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ResearchCasesPage = () => {
  const { researchCases } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Microscope className="w-6 h-6 text-orange-600" /> Agriculture Research Cases Repository
          </h1>
          <p className="text-xs text-slate-500 font-medium">Unresolved crop diseases under active laboratory investigation and trial</p>
        </div>
        <span className="bg-orange-100 text-orange-900 text-xs font-bold px-3 py-1 rounded-full border border-orange-200">
          {researchCases.length} Active Research Cases
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {researchCases.map(rc => {
          let statusBadgeColor = "bg-orange-100 text-orange-800 border-orange-200";
          if (rc.status === 'Solution Identified') statusBadgeColor = "bg-emerald-100 text-emerald-800 border-emerald-200";
          else if (rc.status === 'Investigation Started') statusBadgeColor = "bg-blue-100 text-blue-800 border-blue-200";

          return (
            <div key={rc.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-orange-800 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {rc.id} (Linked: {rc.issueId})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadgeColor}`}>
                    {rc.status}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base leading-snug">
                  {rc.title}
                </h3>

                <p className="text-xs text-slate-500 font-semibold">
                  Crop: <strong className="text-slate-800">{rc.crop}</strong> • Department: <strong>{rc.department}</strong>
                </p>

                <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
                  {rc.researchNotes}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">Researchers: {rc.assignedResearchers?.join(', ')}</span>
                <Link
                  to={`/expert/research/${rc.id}`}
                  className="px-4 py-2 bg-slate-900 hover:bg-orange-600 text-white font-extrabold text-xs rounded-xl transition-colors flex items-center gap-1"
                >
                  Research Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
