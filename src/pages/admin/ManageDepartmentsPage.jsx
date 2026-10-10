import React, { useState } from 'react';
import { Building2, Users, PlusCircle, Trash2, CheckCircle2, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export const ManageDepartmentsPage = () => {
  const { departments, addDepartment, deleteDepartment } = useData();
  const { users } = useAuth();

  const [modalOpen, setModalOpen] = useState(false);
  const [newDept, setNewDept] = useState({
    name: '',
    code: '',
    description: ''
  });
  const [successMsg, setSuccessMsg] = useState('');

  const getExpertCount = (deptName) => {
    return users.filter(u => 
      u.role === 'Agricultural Expert / Researcher' && 
      u.department?.toLowerCase() === deptName?.toLowerCase() &&
      u.status === 'Approved'
    ).length;
  };

  const handleCreateDept = (e) => {
    e.preventDefault();
    if (!newDept.name || !newDept.code) {
      alert("Please provide department name and code.");
      return;
    }

    addDepartment({
      name: newDept.name,
      code: newDept.code.toUpperCase(),
      description: newDept.description || `${newDept.name} division under Agriculture Directorate.`
    });

    setSuccessMsg(`Division "${newDept.name}" created and synced in real-time!`);
    setNewDept({ name: '', code: '', description: '' });
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Agriculture Departments & Science Panels
          </h1>
          <p className="text-xs text-slate-500 font-medium">State agriculture department divisions, research centers, and specialized scientific committees</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" /> Add New Department
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map(d => {
          const liveExpertCount = getExpertCount(d.name);
          const isDefault = ['dept_1', 'dept_2', 'dept_3', 'dept_4'].includes(d.id);

          return (
            <div key={d.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {d.code}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-emerald-700 font-extrabold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <Users className="w-3.5 h-3.5" /> {liveExpertCount} Active {liveExpertCount === 1 ? 'Expert' : 'Experts'}
                    </span>
                    {!isDefault && (
                      <button
                        onClick={() => deleteDepartment(d.id)}
                        className="p-1 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete Department"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <h3 className="font-black text-slate-900 text-lg">{d.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{d.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-semibold">
                <span>ID: {d.id}</span>
                <span className="text-emerald-600 font-bold">🟢 Live Synced</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Department Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-600" /> Add New Department Division
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDept} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-800">Department Name *</label>
                <input
                  type="text"
                  required
                  value={newDept.name}
                  onChange={e => setNewDept({ ...newDept, name: e.target.value })}
                  placeholder="e.g. Horticulture & Fruit Science"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-semibold text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Department Code (3-4 Letters) *</label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={newDept.code}
                  onChange={e => setNewDept({ ...newDept, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. HORT"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold uppercase text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Description</label>
                <textarea
                  rows={3}
                  value={newDept.description}
                  onChange={e => setNewDept({ ...newDept, description: e.target.value })}
                  placeholder="Mandate and scope of this scientific division..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" /> Save Division
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
