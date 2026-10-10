import React from 'react';
import { Phone, Mail, HelpCircle, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const HelpSupportPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-emerald-600" /> {t('helpSupportTitle')}
        </h1>
        <p className="text-xs text-slate-500 font-medium">{t('Frequently asked questions and toll-free helpline assistance', 'Frequently asked questions and toll-free helpline assistance')}</p>
      </div>

      <div className="bg-emerald-900 text-white p-6 rounded-3xl space-y-2 shadow-lg">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">{t('Emergency Crop Hotline', 'Emergency Crop Hotline')}</span>
        <div className="text-3xl font-black flex items-center gap-3">
          <Phone className="w-7 h-7 text-emerald-400" /> 1800-180-1551 ({t('tollFreeCallCenter')})
        </div>
        <p className="text-xs text-emerald-200">{t('callCenterHours')}</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
          {t('helpSupportTitle')}
        </h2>

        <div className="space-y-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">{t('faq1Q')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('faq1A')}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">{t('faq2Q')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('faq2A')}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <h3 className="font-extrabold text-slate-900 text-sm">{t('faq3Q')}</h3>
            <p className="text-slate-600 leading-relaxed">
              {t('faq3A')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
