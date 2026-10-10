import React, { useState } from 'react';
import { UserCheck, ShieldAlert, CheckCircle2, XCircle, Building, Award, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ApproveResearchersPage = () => {
  const { users, approveResearcher, rejectResearcher } = useAuth();
  const [msg, setMsg] = useState('');

  const pendingList = users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Pending Approval');
  const approvedList = users.filter(u => u.role === 'Agricultural Expert / Researcher' && u.status === 'Approved');

  const handleApprove = (user) => {
    approveResearcher(user.id);
    setMsg(`Approved credentials for ${user.fullName}! Their researcher dashboard is now active.`);
    setTimeout(() => setMsg(''), 4000);
  };

  const handleReject = (user) => {
    rejectResearcher(user.id);
    setMsg(`Application for ${user.fullName} rejected.`);
    setTimeout(() => setMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <UserCheck className="w-6 h-6 text-purple-600" /> Researcher Credential Approval Queue
        </h1>
        <p className="text-xs text-slate-500 font-medium">Verify employee IDs, research university affiliations, and activate scientist accounts</p>
      </div>

      {msg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> {msg}
        </div>
      )}

      {/* Pending Applications Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-600" /> Pending Researcher Applications ({pendingList.length})
          </h2>
        </div>

        {pendingList.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No pending researcher registrations. All scientist accounts are verified.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingList.map(user => (
              <div key={user.id} className="bg-amber-50/50 p-6 rounded-2xl border border-amber-200 space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-base">{user.fullName}</span>
                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      Employee ID: {user.employeeId || 'EXP-9912'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 font-semibold">
                    <div><span className="text-slate-400 block text-[10px]">Email:</span> {user.email}</div>
                    <div><span className="text-slate-400 block text-[10px]">Mobile:</span> {user.mobileNumber}</div>
                    <div><span className="text-slate-400 block text-[10px]">Department:</span> {user.department}</div>
                    <div><span className="text-slate-400 block text-[10px]">Institution:</span> {user.institution}</div>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Specialization: <strong className="text-slate-900">{user.specialization}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleApprove(user)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve Credentials
                  </button>
                  <button
                    onClick={() => handleReject(user)}
                    className="px-4 py-2.5 bg-slate-200 hover:bg-red-600 hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                  >
                    <XCircle className="w-4 h-4" /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Approved Researchers List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
          Approved Expert Scientists ({approvedList.length})
        </h2>

        <div className="divide-y divide-slate-100">
          {approvedList.map(exp => (
            <div key={exp.id} className="py-3.5 flex items-center justify-between text-xs font-medium text-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                  {exp.fullName.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                    {exp.fullName}
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <div className="text-slate-500">{exp.department} • {exp.institution}</div>
                </div>
              </div>

              <div className="text-right text-slate-500 font-semibold">
                <div>ID: {exp.employeeId}</div>
                <div>Solved: {exp.casesSolved} cases</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
