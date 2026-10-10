import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Sprout, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Camera, 
  MapPin, 
  Building2, 
  FileText, 
  AlertCircle,
  HelpCircle,
  Bug,
  Droplets,
  ThermometerSun,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ImageUploader } from '../../components/common/ImageUploader';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const ReportProblemPage = () => {
  const { currentUser } = useAuth();
  const { departments, addIssue } = useData();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCategory = searchParams.get('category') || 'Crop Disease';

  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Crop Info
    cropName: 'Tomato',
    cropCategory: 'Vegetable',
    cropVariety: 'Abhinav Hyb',
    growthStage: 'Flowering & Fruiting Stage',
    firstNoticedDate: new Date().toISOString().split('T')[0],

    // Step 2: Problem Info
    title: '',
    category: preselectedCategory,
    description: '',

    // Step 3: Images
    images: [],

    // Step 4: Location
    state: 'Maharashtra',
    district: currentUser?.district || 'Jalgaon',
    taluka: currentUser?.taluka || 'Chalisgaon',
    village: currentUser?.village || 'Patonda',
    coordinates: '20.4625° N, 75.0189° E',

    // Step 5: Department
    departmentId: 'dept_1',
    priority: 'High'
  });

  // Sync location with authenticated farmer profile
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        district: currentUser.district || prev.district,
        taluka: currentUser.taluka || prev.taluka,
        village: currentUser.village || prev.village
      }));
    }
  }, [currentUser]);

  // Category to Department Auto-Suggestion Map
  useEffect(() => {
    let suggestedDeptId = 'dept_1'; // Plant Pathology default
    if (formData.category === 'Pest Attack') suggestedDeptId = 'dept_2'; // Entomology
    else if (formData.category === 'Nutrient Deficiency' || formData.category === 'Soil Problem') suggestedDeptId = 'dept_3'; // Soil Science
    else if (formData.category === 'Weather Damage' || formData.category === 'Weed Problem') suggestedDeptId = 'dept_4'; // Agronomy
    else if (formData.category === 'Irrigation Problem') suggestedDeptId = 'dept_6'; // Engineering

    setFormData(prev => ({ ...prev, departmentId: suggestedDeptId }));
  }, [formData.category]);

  // Handle Form Submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      alert("Please provide a problem title and symptoms description.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const created = addIssue(formData, currentUser || { id: "usr_farmer_1", fullName: "Ramesh Patil", district: "Jalgaon" });
      setIsSubmitting(false);
      setSubmittedIssue(created);
      setTimeout(() => {
        navigate(`/farmer/issues/${created.id}`);
      }, 1800);
    }, 600);
  };

  const categoriesOptions = [
    { name: "Crop Disease", icon: ShieldAlert, dept: "Plant Pathology" },
    { name: "Pest Attack", icon: Bug, dept: "Entomology" },
    { name: "Nutrient Deficiency", icon: ThermometerSun, dept: "Soil Science" },
    { name: "Weather Damage", icon: Droplets, dept: "Agronomy" },
    { name: "Irrigation Problem", icon: Droplets, dept: "Agricultural Engg" },
    { name: "Soil Problem", icon: Sprout, dept: "Soil Science" },
    { name: "Weed Problem", icon: Sprout, dept: "Agronomy" },
    { name: "Unknown Problem", icon: Sparkles, dept: "Extension Dept" }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3.5 py-1.5 rounded-full">
          {t('Farmer Support Form', 'Farmer Support Form')}
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          {t('reportProblemHeading')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t('reportProblemSubtitle')}
        </p>
      </div>

      {/* Stepper Navigation Indicator */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between gap-1 overflow-x-auto text-xs font-bold">
          {[
            { step: 1, label: t('step1CropInfo') },
            { step: 2, label: t('step2ProblemInfo') },
            { step: 3, label: t('step3Photos') },
            { step: 4, label: t('step4Location') },
            { step: 5, label: t('step5Department') },
            { step: 6, label: t('Review', 'Review') }
          ].map(s => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors shrink-0 ${currentStep === s.step ? 'bg-emerald-600 text-white shadow' : currentStep > s.step ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <span className="w-5 h-5 rounded-full bg-white/20 text-current flex items-center justify-center text-[10px] font-black">
                {s.step}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        {submittedIssue ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">{t('submissionSuccessTitle')}</h2>
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl max-w-md mx-auto space-y-1">
              <div className="text-xs text-slate-500 font-bold uppercase">{t('Generated Issue ID', 'Generated Issue ID')}</div>
              <div className="text-3xl font-black text-emerald-800">{submittedIssue.id}</div>
              <div className="text-xs text-emerald-700 font-semibold mt-1">
                {t('Assigned to', 'Assigned to')}: {submittedIssue.departmentName} Department ({submittedIssue.assignedExpertName})
              </div>
            </div>
            <p className="text-xs text-slate-500">{t('submissionSuccessDesc')}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: CROP INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sprout className="w-5 h-5 text-emerald-600" /> {t('Step 1: Crop Information', 'Step 1: Crop Information')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('Enter details about the crop affected by the problem', 'Enter details about the crop affected by the problem')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block mb-1">{t('selectCropName')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.cropName}
                      onChange={e => setFormData({ ...formData, cropName: e.target.value })}
                      placeholder="e.g. Tomato, Cotton, Sugarcane, Onion, Grapes"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">{t('Crop Category', 'Crop Category')} *</label>
                    <select
                      value={formData.cropCategory}
                      onChange={e => setFormData({ ...formData, cropCategory: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    >
                      <option value="Vegetable">{t('Vegetable', 'Vegetable')}</option>
                      <option value="Fruit">{t('Fruit', 'Fruit')}</option>
                      <option value="Cash Crop">{t('Cash Crop', 'Cash Crop')}</option>
                      <option value="Grain">{t('Grain / Cereal', 'Grain / Cereal')}</option>
                      <option value="Pulse">{t('Pulse / Legume', 'Pulse / Legume')}</option>
                      <option value="Fiber Crop">{t('Fiber Crop', 'Fiber Crop')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">{t('cropVariety')} ({t('Optional', 'Optional')})</label>
                    <input
                      type="text"
                      value={formData.cropVariety}
                      onChange={e => setFormData({ ...formData, cropVariety: e.target.value })}
                      placeholder="e.g. Abhinav Hyb, Co 86032, Thompson Seedless"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">{t('cropGrowthStage')} *</label>
                    <select
                      value={formData.growthStage}
                      onChange={e => setFormData({ ...formData, growthStage: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    >
                      <option value="Seedling Nursery Stage">{t('Seedling Stage')}</option>
                      <option value="Vegetative Canopy Growth">{t('Vegetative Stage')}</option>
                      <option value="Flowering & Fruiting Stage">{t('Flowering & Fruiting Stage')}</option>
                      <option value="Harvesting Stage">{t('Harvesting Stage')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1">{t('firstNoticedDate')} *</label>
                    <input
                      type="date"
                      required
                      value={formData.firstNoticedDate}
                      onChange={e => setFormData({ ...formData, firstNoticedDate: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    {t('btnNextStep')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PROBLEM INFORMATION */}
            {currentStep === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-600" /> {t('step2ProblemInfo')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('symptomsPlaceholder')}</p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block mb-1">{t('problemTitleLabel')} *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      placeholder={t('problemTitlePlaceholder')}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-2">{t('problemCategoryLabel')} *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {categoriesOptions.map(cat => {
                        const Icon = cat.icon;
                        const isSelected = formData.category === cat.name;
                        return (
                          <button
                            key={cat.name}
                            type="button"
                            onClick={() => setFormData({ ...formData, category: cat.name })}
                            className={`p-3 rounded-2xl border text-left flex items-start gap-2.5 transition-all ${isSelected ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'}`}
                          >
                            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-600' : 'text-slate-500'}`} />
                            <div>
                              <div className="text-xs leading-tight">{t(cat.name)}</div>
                              <div className="text-[10px] text-slate-500 font-normal mt-0.5">{t('autoSuggestedDept')} {t(cat.dept)}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block mb-1">{t('symptomsDescriptionLabel')} *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t('symptomsPlaceholder')}
                      className="w-full p-3.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium leading-relaxed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    {t('btnPrevStep')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!formData.title || !formData.description) {
                        alert("Please fill in both title and description.");
                        return;
                      }
                      setCurrentStep(3);
                    }}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    {t('btnNextStep')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: UPLOAD CROP IMAGES */}
            {currentStep === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Camera className="w-5 h-5 text-emerald-600" /> {t('uploadPhotosLabel')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('uploadPhotosSubtitle')}</p>
                </div>

                <ImageUploader
                  images={formData.images}
                  onImagesChange={(newImgs) => setFormData({ ...formData, images: newImgs })}
                  maxImages={5}
                />

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    {t('btnPrevStep')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    {t('btnNextStep')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION */}
            {currentStep === 4 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-600" /> {t('fieldLocationLabel')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('Helps experts check local weather conditions and regional pest alerts', 'Helps experts check local weather conditions and regional pest alerts')}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block mb-1">{t('stateLabel')}</label>
                    <input
                      type="text"
                      disabled
                      value={formData.state}
                      className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="block mb-1">{t('districtLabel')} *</label>
                    <select
                      value={formData.district}
                      onChange={e => setFormData({ ...formData, district: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
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
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
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
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block mb-1">{t('gpsCoordinatesLabel')} ({t('Optional', 'Optional')})</label>
                    <input
                      type="text"
                      value={formData.coordinates}
                      onChange={e => setFormData({ ...formData, coordinates: e.target.value })}
                      placeholder="20.4625° N, 75.0189° E"
                      className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    {t('btnPrevStep')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    {t('btnNextStep')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5: TAG DEPARTMENT */}
            {currentStep === 5 && (
              <div className="space-y-5 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-emerald-600" /> {t('departmentAssignmentLabel')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('autoSuggestedDept')} ({t(formData.category)})</p>
                </div>

                <div className="space-y-3">
                  <label className="block text-xs font-bold text-slate-700">{t('Select Agriculture Department:', 'Select Agriculture Department:')}</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {departments.map(dept => {
                      const isSelected = formData.departmentId === dept.id;
                      return (
                        <div
                          key={dept.id}
                          onClick={() => setFormData({ ...formData, departmentId: dept.id })}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all ${isSelected ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-slate-900">{t(dept.name)}</span>
                            <span className="text-[10px] bg-slate-200 px-2 py-0.5 rounded font-mono">{dept.code}</span>
                          </div>
                          <p className="text-xs text-slate-600 leading-snug">{t(dept.description)}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    {t('btnPrevStep')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(6)}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
                  >
                    {t('btnNextStep')} <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 6: PREVIEW & SUBMIT */}
            {currentStep === 6 && (
              <div className="space-y-6 animate-fade-in">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-emerald-600" /> {t('Final Review & Submission', 'Final Review & Submission')}
                  </h3>
                  <p className="text-xs text-slate-500">{t('Check your crop problem details before sending to scientists', 'Check your crop problem details before sending to scientists')}</p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                        {t(formData.cropName)} • {t(formData.category)}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{formData.title}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-bold text-slate-700 block">{t('cropGrowthStage')}:</span>
                      <span className="text-slate-600">{t(formData.growthStage)}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">{t('firstNoticedDate')}:</span>
                      <span className="text-slate-600">{formData.firstNoticedDate}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">{t('fieldLocationLabel')}:</span>
                      <span className="text-slate-600">{formData.village}, {formData.taluka}, {formData.district}</span>
                    </div>
                    <div>
                      <span className="font-bold text-slate-700 block">{t('departmentAssignmentLabel')}:</span>
                      <span className="text-slate-600">{t(departments.find(d => d.id === formData.departmentId)?.name)}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200 pt-3">
                    <span className="font-bold text-slate-700 block mb-1">{t('symptomsDescriptionLabel')}:</span>
                    <p className="text-slate-800 leading-relaxed font-medium bg-white p-3 rounded-xl border border-slate-200">
                      {formData.description}
                    </p>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="border-t border-slate-200 pt-3">
                      <span className="font-bold text-slate-700 block mb-2">{t('Attached Photos', 'Attached Photos')} ({formData.images.length}):</span>
                      <div className="flex items-center gap-2 overflow-x-auto">
                        {formData.images.map((img, i) => (
                          <img 
                            key={i} 
                            src={img} 
                            alt="preview" 
                            onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-300" 
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="px-5 py-2.5 border border-slate-300 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    {t('btnPrevStep')}
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5" /> {isSubmitting ? t('btnSubmitting') : t('btnSubmitProblem')}
                  </button>
                </div>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
