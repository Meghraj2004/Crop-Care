import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, MapPin, Globe, CheckCircle2, Save, Trash2, AlertTriangle, X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { compressImageToBase64 } from '../../utils/imageCompressor';

export const FarmerProfilePage = () => {
  const { currentUser, updateProfile, deleteAccount } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [compressingAvatar, setCompressingAvatar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    mobileNumber: currentUser?.mobileNumber || '',
    email: currentUser?.email || '',
    district: currentUser?.district || 'Jalgaon',
    taluka: currentUser?.taluka || 'Chalisgaon',
    village: currentUser?.village || 'Patonda',
    preferredLanguage: currentUser?.preferredLanguage || language || 'English',
    avatar: currentUser?.avatar || ''
  });

  const handleAvatarSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressingAvatar(true);
    try {
      const res = await compressImageToBase64(file, { maxWidth: 400, maxHeight: 400, quality: 0.75 });
      setFormData(prev => ({ ...prev, avatar: res.dataUrl }));
      updateProfile({ avatar: res.dataUrl });
    } catch (err) {
      console.error("Avatar compression error:", err);
    } finally {
      setCompressingAvatar(false);
      e.target.value = '';
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    if (formData.preferredLanguage && formData.preferredLanguage !== language) {
      changeLanguage(formData.preferredLanguage);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'DELETE') {
      setDeleteError(t('Please type DELETE to confirm.', 'Please type DELETE to confirm.'));
      return;
    }
    deleteAccount(currentUser?.id);
    navigate('/login', { state: { message: t('Your account has been permanently deleted.', 'Your account has been permanently deleted.') } });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">{t('myProfileTitle')}</h1>
        <p className="text-xs text-slate-500 font-medium">{t('Update your personal contact, farm location, or manage account settings', 'Update your personal contact, farm location, or manage account settings')}</p>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {saved && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {t('Profile details saved successfully!', 'Profile details saved successfully!')}
          </div>
        )}

        <div className="flex items-center gap-5 border-b border-slate-100 pb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-emerald-100 border-2 border-emerald-400 flex items-center justify-center text-emerald-800 font-black text-2xl shadow">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                formData.fullName?.charAt(0) || <User className="w-8 h-8 text-emerald-700" />
              )}
            </div>
            <input 
              type="file" 
              id="farmer-avatar-input" 
              accept="image/jpeg,image/jpg,image/png,image/webp" 
              className="hidden" 
              onChange={handleAvatarSelect}
              disabled={compressingAvatar}
            />
            <label 
              htmlFor="farmer-avatar-input"
              className="absolute -bottom-1 -right-1 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow cursor-pointer transition-colors"
              title="Upload photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </label>
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{formData.fullName || currentUser?.fullName || "Farmer"}</h2>
            <p className="text-xs text-slate-500 font-medium">{t('Farmer Member', 'Farmer Member')} • {formData.district}</p>
            <label htmlFor="farmer-avatar-input" className="text-[11px] text-emerald-700 font-bold hover:underline cursor-pointer inline-flex items-center gap-1 mt-1">
              <Camera className="w-3 h-3" /> {compressingAvatar ? t('Compressing...', 'Compressing...') : t('Upload Profile Photo (Base64)', 'Upload Profile Photo (Base64)')}
            </label>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-700">
          <div>
            <label className="block mb-1">{t('fullNameLabel')}</label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">{t('yourMobile')}</label>
              <input
                type="tel"
                required
                value={formData.mobileNumber}
                onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block mb-1">{t('yourEmail')}</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-3">
            <div className="font-extrabold text-slate-900 text-sm">{t('fieldLocationLabel')}</div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block mb-1">{t('districtLabel')}</label>
                <input
                  type="text"
                  required
                  value={formData.district}
                  onChange={e => setFormData({ ...formData, district: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="block mb-1">{t('talukaLabel')}</label>
                <input
                  type="text"
                  required
                  value={formData.taluka}
                  onChange={e => setFormData({ ...formData, taluka: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
              <div>
                <label className="block mb-1">{t('villageLabel')}</label>
                <input
                  type="text"
                  required
                  value={formData.village}
                  onChange={e => setFormData({ ...formData, village: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1">Preferred Language</label>
            <select
              value={formData.preferredLanguage}
              onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
            >
              <option value="English">English</option>
              <option value="Marathi">मराठी (Marathi)</option>
              <option value="Hindi">हिंदी (Hindi)</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {t('Save Profile Changes', 'Save Profile Changes')}
          </button>
        </form>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="bg-red-50/70 border-2 border-red-200 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-red-900">{t('Danger Zone: Delete Farmer Account', 'Danger Zone: Delete Farmer Account')}</h2>
            <p className="text-xs text-red-700">{t('Permanently delete your user profile and remove your account from the system', 'Permanently delete your user profile and remove your account from the system')}</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {t('Once you delete your account, your profile data, contact details, and session will be completely purged from CropCare. This action cannot be reversed.', 'Once you delete your account, your profile data, contact details, and session will be completely purged from CropCare. This action cannot be reversed.')}
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
          <Trash2 className="w-4 h-4" /> {t('Delete My Account', 'Delete My Account')}
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
              <h3 className="text-lg font-black text-slate-900">{t('Are you absolutely sure?', 'Are you absolutely sure?')}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This action is <strong>permanent</strong>. Your farmer account for <strong>{currentUser?.fullName}</strong> ({currentUser?.email}) will be deleted immediately.
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
                {t('Cancel', 'Cancel')}
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={confirmText !== 'DELETE'}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> {t('Confirm Delete', 'Confirm Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
