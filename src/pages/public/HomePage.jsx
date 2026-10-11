import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  Users, 
  Award, 
  BookOpen, 
  ShieldAlert, 
  ArrowRight, 
  Bug, 
  ThermometerSun, 
  Droplets, 
  Sparkles,
  ChevronRight,
  ShieldCheck,
  FileCheck,
  Microscope,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const HomePage = () => {
  const { t } = useLanguage();
  const { knowledgeArticles, issues, departments, loadKnowledgeArticles } = useData();

  useEffect(() => {
    loadKnowledgeArticles();
  }, []);

  const categoriesList = [
    { name: "Crop Disease", icon: ShieldAlert, color: "text-red-600 bg-red-50 border-red-200", descKey: "descCropDisease" },
    { name: "Pest Attack", icon: Bug, color: "text-amber-600 bg-amber-50 border-amber-200", descKey: "descPestAttack" },
    { name: "Nutrient Deficiency", icon: ThermometerSun, color: "text-emerald-600 bg-emerald-50 border-emerald-200", descKey: "descNutrientDeficiency" },
    { name: "Weather Damage", icon: Droplets, color: "text-sky-600 bg-sky-50 border-sky-200", descKey: "descWeatherDamage" },
    { name: "Irrigation Problem", icon: Droplets, color: "text-blue-600 bg-blue-50 border-blue-200", descKey: "descIrrigationProblem" },
    { name: "Soil Problem", icon: Sprout, color: "text-amber-800 bg-amber-100/50 border-amber-300", descKey: "descSoilProblem" },
    { name: "Weed Problem", icon: Sprout, color: "text-green-700 bg-green-50 border-green-200", descKey: "descWeedProblem" },
    { name: "Unknown Problem", icon: Sparkles, color: "text-purple-600 bg-purple-50 border-purple-200", descKey: "descUnknownProblem" }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden rounded-b-3xl shadow-xl">
        {/* Background Visual Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-700/60 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-200 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {t('govtNetworkShort')}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                {t('tagline')}
              </h1>

              <p className="text-base sm:text-lg text-emerald-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {t('heroDesc')}
              </p>

              {/* Action Buttons with High Contrast & Touch Targets */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/farmer/report-problem"
                  className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-base rounded-2xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center justify-center gap-3 transform active:scale-95"
                >
                  <PlusCircle className="w-6 h-6" />
                  {t('btnReportProblem')}
                </Link>

                <Link
                  to="/knowledge-base"
                  className="w-full sm:w-auto px-8 py-4 bg-emerald-800/80 hover:bg-emerald-700 text-white border border-emerald-500/40 font-bold text-base rounded-2xl transition-all flex items-center justify-center gap-2.5 backdrop-blur-sm"
                >
                  <Search className="w-5 h-5 text-emerald-300" />
                  {t('btnSearchSolutions')}
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-emerald-700/50 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-xl font-black text-amber-300">{t('badgeFreeGovt')}</div>
                  <div className="text-xs text-emerald-200">{t('badgeFreeGovtDesc')}</div>
                </div>
                <div>
                  <div className="text-xl font-black text-emerald-300">{t('badgeFastResponse')}</div>
                  <div className="text-xs text-emerald-200">{t('badgeFastResponseDesc')}</div>
                </div>
                <div>
                  <div className="text-xl font-black text-sky-300">{t('badgeMultilingual')}</div>
                  <div className="text-xs text-emerald-200">{t('badgeMultilingualDesc')}</div>
                </div>
              </div>
            </div>

            {/* Right Card / Visual */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-3xl p-6 shadow-2xl border border-emerald-100 space-y-4 relative">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {t('liveAdvisoryBadge')}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Issue #FC-1024</span>
                </div>

                <div className="flex gap-4 items-start">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d6eb1475a?auto=format&fit=crop&w=400&q=80"
                    alt="Tomato Early Blight"
                    onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.tomato)}
                    className="w-24 h-24 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                      {t('Tomato')} - {t('Yellow & Brown Spots on Tomato Leaves', 'Yellow & Brown Spots on Tomato Leaves')}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">{t('roleFarmer')}: Ramesh Patil ({t('district')}: Jalgaon)</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <StatusBadge status="Expert Responded" size="sm" />
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-50/80 p-3.5 rounded-2xl border border-emerald-100 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>{t('diagnosisTitle')} Early Blight</span>
                  </div>
                  <p className="text-slate-700 leading-normal line-clamp-2">
                    Sprayed Mancozeb 75% WP @ 2.5g/L water. New foliage healthy with 100% recovery.
                  </p>
                </div>

                <Link
                  to="/knowledge/KB-201"
                  className="block text-center w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  {t('viewFullSolution')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW CROPCARE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-full">
            {t('fiveSimpleSteps')}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {t('howItWorksTitle')}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t('howItWorksSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: "01", title: t('step1Title'), desc: t('step1Desc'), icon: PlusCircle, bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
            { step: "02", title: t('step2Title'), desc: t('step2Desc'), icon: Users, bg: "bg-blue-50 text-blue-700 border-blue-200" },
            { step: "03", title: t('step3Title'), desc: t('step3Desc'), icon: FileCheck, bg: "bg-teal-50 text-teal-700 border-teal-200" },
            { step: "04", title: t('step4Title'), desc: t('step4Desc'), icon: TrendingUp, bg: "bg-amber-50 text-amber-700 border-amber-200" },
            { step: "05", title: t('step5Title'), desc: t('step5Desc'), icon: BookOpen, bg: "bg-purple-50 text-purple-700 border-purple-200" }
          ].map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className={`p-5 rounded-2xl border ${s.bg} flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow relative`}>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black opacity-40">{s.step}</span>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CROP PROBLEM CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-3.5 py-1 rounded-full">
              {t('categoryDirectory')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-2">
              {t('commonCropCategories')}
            </h2>
          </div>
          <Link to="/farmer/report-problem" className="text-emerald-700 font-bold text-sm hover:underline flex items-center gap-1">
            {t('reportCategoryIssue')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {categoriesList.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={`/farmer/report-problem?category=${encodeURIComponent(cat.name)}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all group"
              >
                <div className={`w-12 h-12 rounded-2xl ${cat.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {t(cat.name)}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{t(cat.descKey)}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* LATEST VERIFIED SOLUTIONS (KNOWLEDGE BASE HIGHLIGHTS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400 bg-emerald-950 border border-emerald-800 px-3.5 py-1 rounded-full">
                {t('publicKnowledgeBase')}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
                {t('latestVerifiedSolutions')}
              </h2>
            </div>
            <Link
              to="/knowledge-base"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl transition-colors flex items-center gap-2 self-start"
            >
              <BookOpen className="w-4 h-4" /> {t('btnSearchSolutions')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {knowledgeArticles.slice(0, 4).map(article => (
              <div key={article.id} className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 flex flex-col justify-between hover:border-emerald-500 transition-all">
                <div>
                  <div className="h-40 relative">
                    <img 
                      src={article.image || CROP_IMAGE_FALLBACKS.generalCrop} 
                      alt={article.title} 
                      onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                      className="w-full h-full object-cover" 
                    />
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3 h-3" /> {t('verifiedExpertRepo')}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      {t(article.crop)} • {t(article.category)}
                    </span>
                    <h3 className="font-extrabold text-sm text-white line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {article.treatment}
                    </p>
                  </div>
                </div>
                <div className="p-4 pt-0 border-t border-slate-700/50 mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[10px]">Verified: {article.verifiedBy.split('(')[0]}</span>
                  <Link to={`/knowledge/${article.id}`} className="text-emerald-400 font-bold hover:underline">
                    {t('viewDetails')}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-900">12,450+</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">{t('statFarmers')}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-900">180+</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">{t('statExperts')}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-900">8,920+</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">{t('statSolved')}</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-black text-emerald-900">1,450+</div>
              <div className="text-xs sm:text-sm font-semibold text-emerald-700 mt-1">{t('statKnowledge')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl p-8 sm:p-12 text-slate-950 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              {t('Facing Crop Disease or Insect Damage?', 'Facing Crop Disease or Insect Damage?')}
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-900 max-w-xl">
              {t('Do not lose your harvest. Take photo of infected crop and get direct advice from official state agriculture experts.', 'Do not lose your harvest. Take photo of infected crop and get direct advice from official state agriculture experts.')}
            </p>
          </div>
          <Link
            to="/farmer/report-problem"
            className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-white font-black text-base rounded-2xl shadow-lg transition-all flex items-center gap-2 shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-emerald-400" /> {t('btnReportProblem')}
          </Link>
        </div>
      </section>
    </div>
  );
};
