import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, ThumbsUp, Eye } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ManageSolutionsPage = () => {
  const { knowledgeArticles } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-emerald-600" /> Public Knowledge Base Solutions Control
        </h1>
        <p className="text-xs text-slate-500 font-medium">Review verified solutions published to state knowledge base</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {knowledgeArticles.map(art => (
          <div key={art.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {art.id}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
              </span>
            </div>

            <h3 className="font-black text-slate-900 text-base">{art.title}</h3>
            <p className="text-xs text-slate-500 font-semibold">{art.crop} • {art.category} • {art.department}</p>
            <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 font-medium">
              {art.treatment}
            </p>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Verified by {art.verifiedBy}</span>
              <Link to={`/knowledge/${art.id}`} className="text-emerald-700 font-bold hover:underline">
                View Full Article →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
