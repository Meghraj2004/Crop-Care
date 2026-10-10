import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, CheckCircle2, Trash2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ManageUsersPage = () => {
  const { users, deleteAccount } = useAuth();

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch = !searchQuery || 
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.district?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const confirmDelete = () => {
    if (userToDelete) {
      deleteAccount(userToDelete.id);
      setUserToDelete(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Users className="w-6 h-6 text-emerald-600" /> Platform User Directory Management
        </h1>
        <p className="text-xs text-slate-500 font-medium">Manage farmer accounts, certified experts, and department administrators</p>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, district..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-emerald-500 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-emerald-600 shrink-0" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
          >
            <option value="All">All Roles ({users.length})</option>
            <option value="Farmer">Farmers</option>
            <option value="Agricultural Expert / Researcher">Researchers / Experts</option>
            <option value="Agriculture Department Admin">Department Admins</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Location / Institution</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-bold text-slate-900">{u.fullName}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${u.role === 'Farmer' ? 'bg-emerald-100 text-emerald-800' : u.role === 'Agriculture Department Admin' ? 'bg-purple-100 text-purple-800' : 'bg-teal-100 text-teal-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-4 space-y-0.5">
                    <div>{u.email}</div>
                    <div className="text-slate-400">{u.mobileNumber}</div>
                  </td>
                  <td className="p-4">
                    {u.role === 'Farmer' ? `${u.village}, ${u.taluka}, ${u.district}` : u.institution || 'State Dept'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${u.status === 'Approved' || u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => setUserToDelete(u)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete User"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setUserToDelete(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Delete User Account</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently delete <strong>{userToDelete.fullName}</strong> ({userToDelete.email}) from the platform?
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
