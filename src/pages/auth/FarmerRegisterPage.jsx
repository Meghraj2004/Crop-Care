import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, User, Phone, Mail, Lock, MapPin, Globe, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';

export const FarmerRegisterPage = () => {
  const { registerFarmer } = useAuth();
  const { t, language, changeLanguage } = useLanguage();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    email: '',
    password: '',
    district: 'Jalgaon',
    taluka: 'Chalisgaon',
    village: '',
    preferredLanguage: language || 'English'
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      await registerFarmer(formData);
      if (formData.preferredLanguage && formData.preferredLanguage !== language) {
        changeLanguage(formData.preferredLanguage);
      }
      setSubmitted(true);
      setTimeout(() => {
        navigate('/farmer/dashboard');
      }, 1500);
    } catch (err) {
      console.error("Farmer register error:", err);
      setErrorMessage(err.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">{t('farmerRegisterTitle')}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {t('farmerRegisterSubtitle')}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{t('Registration Successful!', 'Registration Successful!')}</h3>
              <p className="text-xs text-slate-600">{t('Welcome', 'Welcome')}, {formData.fullName}. {t('Redirecting to your Farmer Dashboard...', 'Redirecting to your Farmer Dashboard...')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold">
                  {errorMessage}
                </div>
              )}
              <div>
                <label className="block mb-1 text-slate-800">{t('fullNameLabel')} *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Ramesh Patil"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-800">{t('yourMobile')} *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={formData.mobileNumber}
                      onChange={e => setFormData({ ...formData, mobileNumber: e.target.value })}
                      placeholder="10-digit mobile number"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-800">{t('yourEmail')} *</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="ramesh@cropcare.gov.in"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">{t('passwordLabel')} *</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create password (min 6 characters)"
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Location Details */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="text-xs font-extrabold text-emerald-800 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-emerald-600" /> {t('fieldLocationLabel')}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block mb-1">{t('districtLabel')} *</label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                    >
                      <option value="Jalgaon">Jalgaon</option>
                      <option value="Nashik">Nashik</option>
                      <option value="Pune">Pune</option>
                      <option value="Ahmednagar">Ahmednagar</option>
                      <option value="Nagpur">Nagpur</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">{t('talukaLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.taluka}
                      onChange={e => setFormData({ ...formData, taluka: e.target.value })}
                      placeholder="e.g. Chalisgaon"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">{t('villageLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={e => setFormData({ ...formData, village: e.target.value })}
                      placeholder="e.g. Patonda"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-800">Preferred Language</label>
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
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-xl shadow-md transition-colors"
              >
                {t('btnRegisterFarmer')}
              </button>
            </form>
          )}

          <div className="border-t border-slate-100 pt-3 text-center text-xs text-slate-500">
            {t('Already registered?', 'Already registered?')} <Link to="/login" className="text-emerald-700 font-bold hover:underline">{t('navLogin')}</Link>
          </div>
        </div>
      </div>
    </div>
  );
};
