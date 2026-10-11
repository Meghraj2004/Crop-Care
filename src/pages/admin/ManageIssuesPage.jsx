import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Search, Filter, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';

export const ManageIssuesPage = () => {
  const { issues, loadAdminData } = useData();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAdminData();
  }, []);

  const filteredIssues = issues.filter(i => 
    !searchQuery ||
    i.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    i.cropName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Manage Reported Issues</h1>
        <p className="text-xs text-slate-500 font-medium">Statewide crop case audit and monitoring panel</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search issue ID, crop, title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 font-semibold text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
            <tr>
              <th className="p-4">Issue ID</th>
              <th className="p-4">Crop / Title</th>
              <th className="p-4">Farmer</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
            {filteredIssues.map(issue => (
              <tr key={issue.id} className="hover:bg-slate-50">
                <td className="p-4 font-mono font-bold text-emerald-800">{issue.id}</td>
                <td className="p-4">
                  <div className="font-extrabold text-slate-900">{issue.title}</div>
                  <div className="text-[11px] text-slate-400">{issue.cropName} • {issue.category}</div>
                </td>
                <td className="p-4">{issue.farmerName} ({issue.district})</td>
                <td className="p-4">{issue.departmentName}</td>
                <td className="p-4"><StatusBadge status={issue.status} size="sm" /></td>
                <td className="p-4">
                  <Link to={`/farmer/issues/${issue.id}`} className="text-emerald-700 font-bold hover:underline">
                    View
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
