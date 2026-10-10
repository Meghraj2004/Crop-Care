import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  Trash2, 
  AlertTriangle, 
  X, 
  UserPlus, 
  Microscope,
  Lock,
  Mail,
  Building,
  Phone,
  Award
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ManageUsersPage = () => {
  const { users, deleteAccount, addExpert } = useAuth();

  const [roleFilter, setRoleFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);
  const [addExpertModalOpen, setAddExpertModalOpen] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [addingLoading, setAddingLoading] = useState(false);

  const [newExpertForm, setNewExpertForm] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'Plant Pathology',
    specialization: 'Fungal & Bacterial Crop Diseases',
    institution: 'State Agricultural University',
    employeeId: '',
    mobileNumber: ''
  });

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    const matchesSearch = !searchQuery || 
      (u.fullName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.specialization || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesRole && matchesSearch;
  });

  const confirmDelete = async () => {
    if (userToDelete) {
      await deleteAccount(userToDelete.id);
      const deletedName = userToDelete.fullName;
      setUserToDelete(null);
      setActionSuccessMsg(`Account for "${deletedName}" has been successfully removed.`);
      setTimeout(() => setActionSuccessMsg(''), 4000);
    }
  };

  const handleAddExpertSubmit = async (e) => {
    e.preventDefault();
    setAddingLoading(true);

    try {
      const created = await addExpert(newExpertForm);
      setAddingLoading(false);
      setAddExpertModalOpen(false);
      setActionSuccessMsg(`Certified Expert "${created.fullName}" successfully provisioned and added to active queue!`);
      setTimeout(() => setActionSuccessMsg(''), 4500);

      // Reset form
      setNewExpertForm({
        fullName: '',
        email: '',
        password: '',
        department: 'Plant Pathology',
        specialization: 'Fungal & Bacterial Crop Diseases',
        institution: 'State Agricultural University',
        employeeId: '',
        mobileNumber: ''
      });
    } catch (err) {
      setAddingLoading(false);
      alert(`Error adding expert: ${err.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-700" /> Platform User Directory & Scientist Panel
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Manage farmer accounts, certified experts, and department administrators
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddExpertModalOpen(true)}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" /> Provision New Certified Expert
        </button>
      </div>

      {actionSuccessMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, specialization..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-purple-500 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-purple-600 shrink-0" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800 text-xs"
          >
            <option value="All">All Roles ({users.length})</option>
            <option value="Agricultural Expert / Researcher">Experts / Scientists Only ({users.filter(u => u.role === 'Agricultural Expert / Researcher').length})</option>
            <option value="Farmer">Farmers ({users.filter(u => u.role === 'Farmer').length})</option>
            <option value="Agriculture Department Admin">Admins ({users.filter(u => u.role === 'Agriculture Department Admin').length})</option>
          </select>
        </div>
      </div>

      {/* User Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Role</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Department / Institution</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No users matching criteria found in directory.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      {u.employeeId && (
                        <div className="text-[10px] text-teal-700 font-mono">ID: {u.employeeId}</div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        u.role === 'Farmer' ? 'bg-emerald-100 text-emerald-800' : 
                        u.role === 'Agriculture Department Admin' ? 'bg-purple-100 text-purple-800' : 
                        'bg-teal-100 text-teal-800'
                      }`}>
                        {u.role === 'Agricultural Expert / Researcher' ? 'Certified Expert' : u.role}
                      </span>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <div>{u.email}</div>
                      {u.mobileNumber && <div className="text-slate-400">{u.mobileNumber}</div>}
                    </td>
                    <td className="p-4">
                      {u.role === 'Farmer' ? (
                        `${u.village || ''}, ${u.district || ''}`
                      ) : (
                        <div>
                          <div className="font-bold text-slate-900">{u.department || 'Plant Pathology'}</div>
                          <div className="text-slate-400 text-[11px]">{u.institution || 'State Agricultural University'}</div>
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        u.status === 'Approved' || u.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setUserToDelete(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                          u.role === 'Agricultural Expert / Researcher' 
                            ? 'bg-red-50 text-red-700 hover:bg-red-100' 
                            : 'text-red-600 hover:bg-red-50'
                        }`}
                        title={u.role === 'Agricultural Expert / Researcher' ? 'Remove Certified Expert' : 'Delete User'}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{u.role === 'Agricultural Expert / Researcher' ? 'Remove' : 'Delete'}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Add New Expert Modal (Admin Only) */}
      {addExpertModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Microscope className="w-5 h-5 text-teal-600" /> Provision Certified Expert Account
              </h3>
              <button
                onClick={() => setAddExpertModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Experts cannot self-register. As Department Admin, you create official credentials for university scientists and agricultural extension officers.
            </p>

            <form onSubmit={handleAddExpertSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-800">Scientist Full Name *</label>
                <input
                  type="text"
                  required
                  value={newExpertForm.fullName}
                  onChange={e => setNewExpertForm({ ...newExpertForm, fullName: e.target.value })}
                  placeholder="e.g. Dr. Anil Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-800">Official Email *</label>
                  <input
                    type="email"
                    required
                    value={newExpertForm.email}
                    onChange={e => setNewExpertForm({ ...newExpertForm, email: e.target.value })}
                    placeholder="e.g. anil.sharma@agri.gov.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-800">Login Password *</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newExpertForm.password}
                    onChange={e => setNewExpertForm({ ...newExpertForm, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-800">Department *</label>
                  <select
                    value={newExpertForm.department}
                    onChange={e => setNewExpertForm({ ...newExpertForm, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-xs focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Plant Pathology">Plant Pathology</option>
                    <option value="Entomology">Entomology</option>
                    <option value="Soil Science">Soil Science</option>
                    <option value="Agronomy">Agronomy</option>
                    <option value="Agricultural Engg">Agricultural Engineering</option>
                    <option value="Horticulture">Horticulture</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 text-slate-800">Official Employee ID</label>
                  <input
                    type="text"
                    value={newExpertForm.employeeId}
                    onChange={e => setNewExpertForm({ ...newExpertForm, employeeId: e.target.value })}
                    placeholder="e.g. EXP-8842"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Specialization Details</label>
                <input
                  type="text"
                  value={newExpertForm.specialization}
                  onChange={e => setNewExpertForm({ ...newExpertForm, specialization: e.target.value })}
                  placeholder="e.g. Fungal & Bacterial Blights, Spray Formulations"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Institution / University</label>
                <input
                  type="text"
                  value={newExpertForm.institution}
                  onChange={e => setNewExpertForm({ ...newExpertForm, institution: e.target.value })}
                  placeholder="e.g. Maharashtra Agricultural Research Institute"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Mobile Contact Number</label>
                <input
                  type="tel"
                  value={newExpertForm.mobileNumber}
                  onChange={e => setNewExpertForm({ ...newExpertForm, mobileNumber: e.target.value })}
                  placeholder="e.g. 9422011223"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-xs focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setAddExpertModalOpen(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addingLoading}
                  className="flex-1 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> {addingLoading ? "Creating..." : "Issue & Activate Expert"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Delete / Remove User Confirmation Modal */}
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
              <h3 className="text-lg font-black text-slate-900">
                {userToDelete.role === 'Agricultural Expert / Researcher' ? 'Remove Certified Expert' : 'Delete User Account'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Are you sure you want to permanently remove <strong>{userToDelete.fullName}</strong> ({userToDelete.email}) from the platform?
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
                <Trash2 className="w-4 h-4" /> Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
