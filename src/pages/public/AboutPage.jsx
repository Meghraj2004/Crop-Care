import React from 'react';
import { Sprout, ShieldCheck, Award, Users, BookOpen, Microscope } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AboutPage = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full">
          {t('aboutPlatformTitle')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          {t('aboutMainHeading')}
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
          {t('aboutMainDesc')}
        </p>
      </div>

      {/* Core Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-xl flex items-center justify-center font-bold">
            <Sprout className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('objective1Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('objective1Desc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-blue-100 text-blue-800 rounded-xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('objective2Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('objective2Desc')}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-purple-100 text-purple-800 rounded-xl flex items-center justify-center font-bold">
            <Microscope className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">{t('objective3Title')}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {t('objective3Desc')}
          </p>
        </div>
      </div>

      {/* Participating Institutions */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-center text-emerald-400">{t('participatingInstitutions')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs font-semibold">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">Mahatma Phule Krishi Vidyapeeth (MPKV) Rahuri</div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">VNMKV Parbhani Agriculture University</div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">ICAR National Research Centre for Grapes</div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">State Directorate of Agriculture, Maharashtra</div>
        </div>
      </div>
    </div>
  );
};
