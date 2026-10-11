import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, CheckCircle2, ThumbsUp, Eye, BookOpen, Bookmark, Sparkles } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const KnowledgeBasePage = () => {
  const { knowledgeArticles, savedSolutions, toggleSaveSolution, loadKnowledgeArticles } = useData();
  const { t } = useLanguage();

  useEffect(() => {
    loadKnowledgeArticles();
  }, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  // Extract unique filter dropdown values
  const cropsList = useMemo(() => ['All', ...new Set(knowledgeArticles.map(a => a.crop))], [knowledgeArticles]);
  const categoriesList = useMemo(() => ['All', ...new Set(knowledgeArticles.map(a => a.category))], [knowledgeArticles]);
  const departmentsList = useMemo(() => ['All', ...new Set(knowledgeArticles.map(a => a.department))], [knowledgeArticles]);

  // Search and Filter Logic
  const filteredArticles = useMemo(() => {
    return knowledgeArticles.filter(art => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        !searchQuery || 
        art.title.toLowerCase().includes(q) ||
        art.crop.toLowerCase().includes(q) ||
        art.category.toLowerCase().includes(q) ||
        art.symptoms.toLowerCase().includes(q) ||
        art.diagnosis.toLowerCase().includes(q) ||
        art.treatment.toLowerCase().includes(q);

      const matchesCrop = selectedCrop === 'All' || art.crop === selectedCrop;
      const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
      const matchesDept = selectedDepartment === 'All' || art.department === selectedDepartment;

      return matchesSearch && matchesCrop && matchesCategory && matchesDept;
    });
  }, [knowledgeArticles, searchQuery, selectedCrop, selectedCategory, selectedDepartment]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white rounded-3xl p-8 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-1.5 bg-emerald-700/60 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {t('verifiedExpertRepo')}
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          {t('publicKnowledgeBase')}
        </h1>
        <p className="text-sm sm:text-base text-emerald-100 max-w-2xl">
          {t('Search verified diagnoses, chemical & organic treatments, and preventive practices contributed by official agricultural scientists.', 'Search verified diagnoses, chemical & organic treatments, and preventive practices contributed by official agricultural scientists.')}
        </p>

        {/* Global Search Bar with Autocomplete Suggestions */}
        <div className="relative max-w-3xl pt-2">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 placeholder-slate-400 font-semibold text-sm sm:text-base shadow-lg focus:outline-none focus:ring-4 focus:ring-amber-400"
            />
            <Search className="w-6 h-6 text-slate-400 absolute left-4 top-4" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-4 text-xs font-bold text-slate-400 hover:text-slate-600 bg-slate-100 px-2 py-1 rounded-full"
              >
                {t('clearFilter')}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-600" /> {t('filterArticles')}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Crop Filter */}
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">{t('allCrops')}</option>
            {cropsList.filter(c => c !== 'All').map(c => <option key={c} value={c}>{t(c)}</option>)}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">{t('allCategories')}</option>
            {categoriesList.filter(c => c !== 'All').map(c => <option key={c} value={c}>{t(c)}</option>)}
          </select>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={e => setSelectedDepartment(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">{t('allDepartments')}</option>
            {departmentsList.filter(d => d !== 'All').map(d => <option key={d} value={d}>{t(d)}</option>)}
          </select>
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          {t('Showing', 'Showing')} <span className="text-emerald-700 font-bold">{filteredArticles.length}</span> {t('verified solutions', 'verified solutions')}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">{t('noArticlesFound')}</h3>
          <p className="text-xs text-slate-500">{t('tryAdjustingFilters')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map(art => {
            const isSaved = savedSolutions.includes(art.id);
            return (
              <div key={art.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group">
                <div>
                  <div className="h-48 relative overflow-hidden bg-black">
                    <img
                      src={art.image || CROP_IMAGE_FALLBACKS.generalCrop}
                      alt={art.title}
                      onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {t('verifiedExpertRepo')}
                    </div>
                    <button
                      onClick={() => toggleSaveSolution(art.id)}
                      className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-colors ${isSaved ? 'bg-amber-500 text-slate-950' : 'bg-black/50 text-white hover:bg-black/70'}`}
                      title={isSaved ? t('savedToSaved') : t('saveSolution')}
                    >
                      <Bookmark className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-[11px] font-extrabold">
                      <span className="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                        {t(art.crop)}
                      </span>
                      <span className="text-slate-500 uppercase">{t(art.category)}</span>
                    </div>

                    <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-emerald-700 transition-colors">
                      {art.title}
                    </h3>

                    <div className="text-xs text-slate-600 space-y-1">
                      <p><span className="font-bold text-slate-800">{t('symptomsTitle')}</span> {art.symptoms}</p>
                      <p className="line-clamp-2"><span className="font-bold text-emerald-800">{t('treatmentTitle')}</span> {art.treatment}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <ThumbsUp className="w-3.5 h-3.5" /> {art.helpfulYes} {t('upvoteUseful')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> {art.views}
                      </span>
                    </div>
                    <Link
                      to={`/knowledge/${art.id}`}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
