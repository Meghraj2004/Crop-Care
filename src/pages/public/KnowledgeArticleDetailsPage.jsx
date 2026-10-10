import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ThumbsUp, 
  ThumbsDown, 
  Share2, 
  Bookmark, 
  FileText, 
  Award, 
  ShieldAlert, 
  Sprout, 
  UserCheck, 
  Calendar,
  Eye,
  Check
} from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const KnowledgeArticleDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { knowledgeArticles, voteKnowledgeArticle, savedSolutions, toggleSaveSolution } = useData();
  const { t } = useLanguage();

  const article = knowledgeArticles.find(a => a.id === id);
  const [voted, setVoted] = useState(null); // 'yes' or 'no'
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">{t('noArticlesFound')}</h2>
        <p className="text-slate-500 text-sm">{t('The article ID does not exist in the public knowledge base.', 'The article ID does not exist in the public knowledge base.')}</p>
        <Link to="/knowledge-base" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl">
          {t('browseKnowledgeBase')}
        </Link>
      </div>
    );
  }

  const isSaved = savedSolutions.includes(article.id);

  const handleVote = (isHelpful) => {
    if (voted !== null) return;
    voteKnowledgeArticle(article.id, isHelpful);
    setVoted(isHelpful ? 'yes' : 'no');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Back Button & Top Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {t('browseKnowledgeBase')}
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSaveSolution(article.id)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-colors ${isSaved ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
          >
            <Bookmark className="w-4 h-4 fill-current" /> {isSaved ? t('savedToSaved') : t('saveSolution')}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs font-bold bg-white text-slate-700 border border-slate-200 px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            {copied ? t('Link Copied', 'Link Copied') : t('Share', 'Share')}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6">
        {/* Banner Image */}
        <div className="h-64 sm:h-80 relative bg-slate-900">
          <img 
            src={article.image || CROP_IMAGE_FALLBACKS.generalCrop} 
            alt={article.title} 
            onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> {t('verifiedExpertRepo')}
              </span>
              <span className="bg-white/20 text-white backdrop-blur-sm text-xs font-semibold px-3 py-1 rounded-full">
                {t(article.crop)} • {t(article.category)}
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Verification Info Bar */}
        <div className="px-6 py-4 bg-emerald-50 border-y border-emerald-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-emerald-900">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <span>{t('Verified By', 'Verified By')}: {article.verifiedBy}</span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-semibold">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-slate-400" /> {article.verifiedDate}</span>
            <span className="flex items-center gap-1"><Eye className="w-4 h-4 text-slate-400" /> {article.views} {t('views', 'views')}</span>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Section 1: Problem & Symptoms */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> {t('symptomsTitle')}
            </h2>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-sm text-slate-700 leading-relaxed">
              <p className="font-semibold text-slate-900 mb-1">{t('symptomsTitle')}</p>
              <p>{article.symptoms}</p>
            </div>
          </div>

          {/* Section 2: Diagnosis & Cause */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-5 h-5 text-blue-600" /> {t('diagnosisTitle')}
            </h2>
            <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 text-sm text-slate-800 space-y-2">
              <p><span className="font-bold text-blue-950">{t('diagnosisTitle')}</span> {article.diagnosis}</p>
              {article.possibleCause && (
                <p><span className="font-bold text-blue-950">{t('Cause / Conditions', 'Cause / Conditions')}:</span> {article.possibleCause}</p>
              )}
            </div>
          </div>

          {/* Section 3: Recommended Treatment (Key Guidance) */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Sprout className="w-5 h-5 text-emerald-600" /> {t('treatmentTitle')}
            </h2>
            <div className="bg-emerald-50/80 p-5 rounded-2xl border border-emerald-200 text-sm text-emerald-950 whitespace-pre-line leading-relaxed font-medium">
              {article.treatment}
            </div>
          </div>

          {/* Section 4: Preventive Measures */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Award className="w-5 h-5 text-purple-600" /> {t('preventionTitle')}
            </h2>
            <div className="bg-purple-50/40 p-4 rounded-2xl border border-purple-100 text-sm text-slate-800 whitespace-pre-line leading-relaxed">
              {article.preventiveMeasures}
            </div>
          </div>

          {/* Helpfulness Feedback Widget */}
          <div className="pt-6 border-t border-slate-200 text-center space-y-4">
            <h3 className="text-base font-bold text-slate-900">{t('Was this solution helpful to your farming problem?', 'Was this solution helpful to your farming problem?')}</h3>
            
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleVote(true)}
                disabled={voted !== null}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow transition-all ${voted === 'yes' ? 'bg-emerald-600 text-white ring-4 ring-emerald-200' : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'}`}
              >
                <ThumbsUp className="w-5 h-5" /> {t('Yes', 'Yes')} ({article.helpfulYes + (voted === 'yes' ? 1 : 0)})
              </button>

              <button
                onClick={() => handleVote(false)}
                disabled={voted !== null}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow transition-all ${voted === 'no' ? 'bg-red-600 text-white ring-4 ring-red-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
              >
                <ThumbsDown className="w-5 h-5" /> {t('No', 'No')} ({article.helpfulNo + (voted === 'no' ? 1 : 0)})
              </button>
            </div>

            {voted !== null && (
              <p className="text-xs text-emerald-700 font-semibold animate-fade-in">
                {t('Thank you for your feedback! Your response helps improve agricultural guidance for other farmers.', 'Thank you for your feedback! Your response helps improve agricultural guidance for other farmers.')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
