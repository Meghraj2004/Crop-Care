import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Building, Award, ShieldCheck, CheckCircle2, Trash2, AlertTriangle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ExpertProfilePage = () => {
  const { currentUser, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleDeleteAccount = () => {
    if (confirmText !== 'DELETE') {
      setDeleteError('Please type DELETE to confirm.');
      return;
    }
    deleteAccount(currentUser?.id);
    navigate('/login', { state: { message: 'Your researcher account has been deleted.' } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Expert / Researcher Credentials</h1>
        <p className="text-xs text-slate-500 font-medium">Official scientific panel profile and institution verification</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-black text-2xl flex items-center justify-center shadow">
            {currentUser?.fullName?.charAt(0) || "D"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-extrabold text-slate-900">{currentUser?.fullName || "Dr. Anil Sharma"}</h2>
              {currentUser?.verifiedBadge && (
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Expert
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-semibold">{currentUser?.specialization || "Fungal & Bacterial Crop Diseases"}</p>
            <p className="text-[11px] text-teal-700 font-bold mt-0.5">ID: {currentUser?.employeeId || "EXP-8842"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
          <div>
            <span className="text-slate-400 block mb-1">Official Email</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold">
              {currentUser?.email || "anil.sharma@agri.gov.in"}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Mobile Contact</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold">
              {currentUser?.mobileNumber || "9422011223"}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Department</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold">
              {currentUser?.department || "Plant Pathology"}
            </div>
          </div>

          <div>
            <span className="text-slate-400 block mb-1">Research Institution</span>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-900 font-bold">
              {currentUser?.institution || "MPKV Rahuri"}
            </div>
          </div>
        </div>

        <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs">
          <span className="font-bold text-emerald-900">Total Farmer Cases Solved & Published:</span>
          <span className="text-lg font-black text-emerald-700">{currentUser?.casesSolved || 48} Cases</span>
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-red-50/70 border-2 border-red-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-red-900">Danger Zone: Delete Expert Account</h2>
            <p className="text-xs text-red-700">Permanently remove your expert credentials from FarmConnect</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Deleting your expert account will remove your login access and profile data.
        </p>

        <button
          type="button"
          onClick={() => {
            setConfirmText('');
            setDeleteError('');
            setShowDeleteModal(true);
          }}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center gap-2"
        >
          <Trash2 className="w-4 h-4" /> Delete Expert Account
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-slate-900">Are you sure?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your researcher profile for <strong>{currentUser?.fullName}</strong> ({currentUser?.email}) will be permanently deleted.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                To confirm deletion, type <span className="font-mono text-red-600 font-extrabold">DELETE</span> below:
              </label>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setDeleteError('');
                }}
                placeholder="Type DELETE"
                className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono font-bold focus:ring-2 focus:ring-red-500"
              />
              {deleteError && (
                <p className="text-xs font-bold text-red-600">{deleteError}</p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE'}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
