import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, CheckCircle2, BookOpen, Calendar } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const ExpertResponsesPage = () => {
  const { currentUser } = useAuth();
  const { expertResponses } = useData();

  const myResponses = expertResponses.filter(r => r.expertId === currentUser?.id || r.expertName === currentUser?.fullName);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-teal-600" /> My Published Expert Responses
        </h1>
        <p className="text-xs text-slate-500 font-medium">History of diagnoses and spray guidance provided to farmers</p>
      </div>

      {myResponses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No responses submitted yet. Open an assigned case to provide expert diagnosis.
        </div>
      ) : (
        <div className="space-y-4">
          {myResponses.map(r => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    Case #{r.issueId}
                  </span>
                  {r.publishedToKb && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Published in Public KB
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="font-extrabold text-slate-900 text-sm">Diagnosis: {r.diagnosis}</p>
                <p className="text-slate-700 font-medium whitespace-pre-line bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <strong className="text-slate-900">Treatment Protocol:</strong> {r.treatment}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <Link to={`/expert/cases/${r.issueId}`} className="text-xs font-bold text-teal-700 hover:underline">
                  View Full Case & Farmer Timeline →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
