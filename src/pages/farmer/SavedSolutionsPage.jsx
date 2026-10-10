import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, CheckCircle2, ThumbsUp, Eye, Trash2, BookOpen } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const SavedSolutionsPage = () => {
  const { knowledgeArticles, savedSolutions, toggleSaveSolution } = useData();
  const { t } = useLanguage();

  const savedArticles = knowledgeArticles.filter(art => savedSolutions.includes(art.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bookmark className="w-6 h-6 text-amber-500 fill-current" /> {t('savedSolutionsTitle')}
          </h1>
          <p className="text-xs text-slate-500 font-medium">{t('savedSolutionsSubtitle')}</p>
        </div>
        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
          {savedArticles.length} {t('savedToSaved')}
        </span>
      </div>

      {savedArticles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">{t('noSavedSolutions')}</h3>
          <p className="text-xs text-slate-500">{t('noSavedSolutionsDesc')}</p>
          <Link to="/knowledge-base" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
            {t('browseKnowledgeBase')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map(art => (
            <div key={art.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden">
              <div>
                <div className="h-44 relative bg-slate-900">
                  <img 
                    src={art.image || CROP_IMAGE_FALLBACKS.generalCrop} 
                    alt={art.title} 
                    onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {t('verifiedExpertRepo')}
                  </div>
                  <button
                    onClick={() => toggleSaveSolution(art.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-red-600 text-white hover:bg-red-700 shadow transition-colors"
                    title={t('removeSaved')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    {t(art.crop)} • {t(art.category)}
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 line-clamp-2">{art.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{art.treatment}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px]">{t('Saved for quick access', 'Saved for quick access')}</span>
                <Link to={`/knowledge/${art.id}`} className="px-3 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-emerald-600 transition-colors">
                  {t('viewFullSolution')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
