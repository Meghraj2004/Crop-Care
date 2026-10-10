import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ExternalLink, ShieldCheck, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 text-sm pt-12 pb-24 md:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                {t('appName')} <span className="text-emerald-500 font-bold text-xs">{t('subName')}</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footerMission')}
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-slate-800/80 p-2.5 rounded-xl border border-slate-700">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> {t('footerDeptInitiative')}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">
              {t('quickNavigation')}
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/" className="hover:text-emerald-400 transition-colors">{t('navHome')}</Link></li>
              <li><Link to="/farmer/report-problem" className="hover:text-emerald-400 transition-colors font-bold text-emerald-400">{t('btnReportProblem')}</Link></li>
              <li><Link to="/knowledge-base" className="hover:text-emerald-400 transition-colors">{t('btnSearchSolutions')}</Link></li>
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">{t('aboutPlatformTitle')}</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">{t('contactPageTitle')}</Link></li>
              <li><Link to="/register/researcher" className="hover:text-emerald-400 transition-colors">{t('roleExpert')}</Link></li>
            </ul>
          </div>

          {/* Col 3: Agriculture Categories */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">
              {t('cropProblemDepartments')}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center justify-between">
                <span>{t('Plant Pathology')}</span> 
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-emerald-400">{t('Crop Disease')}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>{t('Entomology')}</span> 
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-amber-400">{t('Pest Attack')}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>{t('Soil Science')}</span> 
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-blue-400">{t('Nutrient Deficiency')}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>{t('Agronomy')}</span> 
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-purple-400">{t('Weather Damage')}</span>
              </li>
              <li className="flex items-center justify-between">
                <span>{t('Extension Dept')}</span> 
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">{t('Unknown Problem')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Farmer Helpline & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-4 border-b border-slate-800 pb-2">
              {t('kisanSupportHelpline')}
            </h4>
            <div className="bg-emerald-950/60 border border-emerald-700/50 p-3.5 rounded-2xl">
              <div className="text-[11px] text-emerald-300 font-semibold uppercase tracking-wider">
                {t('tollFreeCallCenter')}
              </div>
              <div className="text-lg font-black text-white flex items-center gap-2 mt-1">
                <Phone className="w-5 h-5 text-emerald-400" /> 1800-180-1551
              </div>
              <div className="text-[10px] text-emerald-200 mt-1">
                {t('callCenterHours')}
              </div>
            </div>
            <div className="text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> support@cropcare.gov.in</div>
              <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> {t('district')}: Pune, Maharashtra</div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} {t('copyrightText')}
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">{t('privacyPolicy')}</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('termsOfService')}</span>
            <span className="hover:text-slate-400 cursor-pointer">{t('accessibility')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
