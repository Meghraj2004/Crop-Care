import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ContactPage = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', district: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-3">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full">
          {t('contactPageTitle')}
        </span>
        <h1 className="text-3xl font-black text-slate-900">{t('contactMainHeading')}</h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Direct Helplines */}
        <div className="space-y-4">
          <div className="bg-emerald-900 text-white p-6 rounded-2xl space-y-3 shadow-md">
            <h3 className="text-base font-extrabold text-amber-300">{t('tollFreeCallCenter')}</h3>
            <div className="text-3xl font-black flex items-center gap-3">
              <Phone className="w-7 h-7 text-emerald-400" /> 1800-180-1551
            </div>
            <p className="text-xs text-emerald-200">{t('callCenterHours')}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4 text-xs font-semibold text-slate-700">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{t('Email Advisory', 'Email Advisory')}</span>
                <span className="text-sm font-bold text-slate-900">support@cropcare.gov.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-slate-100 pt-3">
              <div className="w-9 h-9 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">{t('Head Office', 'Head Office')}</span>
                <span className="text-sm font-bold text-slate-900">{t('officialAddress')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t('Message Received!', 'Message Received!')}</h3>
              <p className="text-xs text-slate-600">{t('messageSentSuccess')}</p>
              <button 
                onClick={() => setSubmitted(false)}
                className="text-xs text-emerald-700 font-bold hover:underline mt-2 inline-block"
              >
                {t('Send another message', 'Send another message')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">{t('sendUsMessage')}</h3>
              <div>
                <label className="block mb-1">{t('yourName')}</label>
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil" 
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">{t('yourMobile')}</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="9876543210" 
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block mb-1">{t('district')}</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.district}
                    onChange={e => setFormData({ ...formData, district: e.target.value })}
                    placeholder="e.g. Jalgaon" 
                    className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1">{t('messageLabel')}</label>
                <textarea 
                  rows={4} 
                  required 
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your inquiry here..."
                  className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Send className="w-4 h-4" /> {t('btnSendMessage')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
