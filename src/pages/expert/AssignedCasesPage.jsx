import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { StatusBadge } from '../../components/common/StatusBadge';
import { handleImageError, CROP_IMAGE_FALLBACKS } from '../../utils/imageFallback';

export const AssignedCasesPage = () => {
  const { currentUser } = useAuth();
  const { issues } = useData();

  const [selectedCrop, setSelectedCrop] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const assignedIssues = issues.filter(i => 
    i.assignedExpertId === currentUser?.id || 
    i.assignedExpertName === currentUser?.fullName ||
    i.departmentName === currentUser?.department
  );

  const filteredIssues = assignedIssues.filter(issue => {
    const matchesCrop = selectedCrop === 'All' || issue.cropName === selectedCrop;
    const matchesCategory = selectedCategory === 'All' || issue.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || issue.status === selectedStatus;
    const matchesSearch = !searchQuery || 
      issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      issue.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCrop && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900">Assigned Farmer Cases Directory</h1>
        <p className="text-xs text-slate-500 font-medium">Filter cases by crop type, disease category, district location, and priority status</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search farmer name, issue ID, crop..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-teal-500 text-xs"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={selectedCrop}
            onChange={e => setSelectedCrop(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
          >
            <option value="All">All Crops</option>
            <option value="Tomato">Tomato</option>
            <option value="Grape">Grape</option>
            <option value="Sugarcane">Sugarcane</option>
            <option value="Cotton">Cotton</option>
            <option value="Banana">Banana</option>
          </select>

          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
          >
            <option value="All">All Categories</option>
            <option value="Crop Disease">Crop Disease</option>
            <option value="Pest Attack">Pest Attack</option>
            <option value="Nutrient Deficiency">Nutrient Deficiency</option>
            <option value="Soil Problem">Soil Problem</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-bold text-slate-800"
          >
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Expert Responded">Expert Responded</option>
            <option value="Research Required">Research Required</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIssues.map(issue => (
          <div key={issue.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {issue.id}
                </span>
                <StatusBadge status={issue.status} size="sm" />
              </div>

              <div className="flex items-start gap-3">
                <img 
                  src={issue.images?.[0] || CROP_IMAGE_FALLBACKS.generalCrop} 
                  alt={issue.title} 
                  onError={(e) => handleImageError(e, CROP_IMAGE_FALLBACKS.generalCrop)}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" 
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{issue.title}</h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Farmer: <strong>{issue.farmerName}</strong> ({issue.district}) • Crop: <strong>{issue.cropName}</strong>
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-medium">
                {issue.description}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">Date: {new Date(issue.createdAt).toLocaleDateString()}</span>
              <Link to={`/expert/cases/${issue.id}`} className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs rounded-xl transition-colors">
                Examine Case →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
