import React from 'react';
import { Link } from 'react-router-dom';
import { Microscope, ChevronRight } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const ManageResearchPage = () => {
  const { researchCases } = useData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Microscope className="w-6 h-6 text-orange-600" /> Department Research Case Monitoring
        </h1>
        <p className="text-xs text-slate-500 font-medium">Scientific studies and trial progress across universities</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">RC ID</th>
              <th className="p-4">Title / Crop</th>
              <th className="p-4">Researchers</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {researchCases.map(rc => (
              <tr key={rc.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-bold text-orange-800">{rc.id}</td>
                <td className="p-4">
                  <div className="font-extrabold text-slate-900">{rc.title}</div>
                  <div className="text-[11px] text-slate-400">{rc.crop} • {rc.department}</div>
                </td>
                <td className="p-4">{rc.assignedResearchers?.join(', ')}</td>
                <td className="p-4">
                  <span className="bg-orange-100 text-orange-800 font-bold px-2 py-0.5 rounded text-[11px]">
                    {rc.status}
                  </span>
                </td>
                <td className="p-4">
                  <Link to={`/expert/research/${rc.id}`} className="text-orange-700 font-bold hover:underline">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
