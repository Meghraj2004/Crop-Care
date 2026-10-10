import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  Microscope, 
  ShieldCheck, 
  CheckCircle2, 
  Bell, 
  X, 
  Radio, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { realtimeService } from '../../services/realtime';
import { useNavigate } from 'react-router-dom';

export const RealtimeToastContainer = () => {
  const [toasts, setToasts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = realtimeService.subscribe((payload) => {
      const { type, data, meta } = payload;
      let toastItem = null;

      switch (type) {
        case 'ISSUE_CREATED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: Sprout,
            iconBg: 'bg-emerald-600',
            title: '🌾 New Crop Problem Reported',
            message: `${data.cropName} issue (${data.id}) reported in ${data.district} by ${data.farmerName}.`,
            link: `/farmer/issues/${data.id}`,
            roleBadge: 'Live Outbreak'
          };
          break;

        case 'ISSUE_UPDATE_ADDED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: Sprout,
            iconBg: 'bg-teal-600',
            title: '📈 Recovery Progress Update',
            message: `Farmer updated case ${data.issueId}: Condition marked as "${data.condition}".`,
            link: `/farmer/issues/${data.issueId}`,
            roleBadge: 'Timeline Update'
          };
          break;

        case 'EXPERT_DIAGNOSED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: Microscope,
            iconBg: 'bg-teal-600',
            title: '👨‍🔬 Expert Prescription Submitted',
            message: `${data.expertName} submitted diagnosis & treatment for case ${data.issueId}.`,
            link: `/farmer/issues/${data.issueId}`,
            roleBadge: 'Expert Advisory'
          };
          break;

        case 'RESEARCH_ESCALATED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: Microscope,
            iconBg: 'bg-orange-600',
            title: '🔬 Case Converted to Research',
            message: `Issue ${data.issueId} has been escalated to Scientific Research Case (${data.id}).`,
            link: `/expert/research/${data.id}`,
            roleBadge: 'Lab Study'
          };
          break;

        case 'RESEARCH_UPDATED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: Microscope,
            iconBg: 'bg-orange-600',
            title: '🔬 Research Case Findings Updated',
            message: `Updated investigation details for Research Case ${data.rcId}.`,
            link: `/expert/research/${data.rcId}`,
            roleBadge: 'Research'
          };
          break;

        case 'KB_PUBLISHED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: CheckCircle2,
            iconBg: 'bg-emerald-600',
            title: '📚 New Solution in Knowledge Base',
            message: `Verified treatment published for ${data.crop}: "${data.title}".`,
            link: `/knowledge/${data.id}`,
            roleBadge: 'Public KB'
          };
          break;

        case 'RESEARCHER_REGISTERED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: UserCheck,
            iconBg: 'bg-amber-600',
            title: '🏛️ New Researcher Awaiting Approval',
            message: `${data.fullName} registered for ${data.department}. Credential verification pending.`,
            link: '/admin/researchers',
            roleBadge: 'Admin Alert'
          };
          break;

        case 'RESEARCHER_APPROVED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: ShieldCheck,
            iconBg: 'bg-purple-600',
            title: '✅ Researcher Credentials Approved',
            message: `Account for ${data.fullName || 'scientist'} has been verified and activated by Admin.`,
            link: '/admin/users',
            roleBadge: 'Admin Verified'
          };
          break;

        case 'DEPARTMENT_ADDED':
          toastItem = {
            id: `toast_${Date.now()}_${Math.random()}`,
            icon: ShieldCheck,
            iconBg: 'bg-blue-600',
            title: '🏛️ New Department Division Added',
            message: `${data.name} (${data.code}) is now active statewide.`,
            link: '/admin/departments',
            roleBadge: 'Directorate'
          };
          break;

        default:
          if (meta?.title) {
            toastItem = {
              id: `toast_${Date.now()}_${Math.random()}`,
              icon: Bell,
              iconBg: 'bg-emerald-600',
              title: meta.title,
              message: meta.message || 'Real-time state updated.',
              link: meta.link,
              roleBadge: 'Sync'
            };
          }
          break;
      }

      if (toastItem) {
        setToasts(prev => [toastItem, ...prev.slice(0, 3)]); // Keep max 4 toasts
        // Auto remove after 5.5 seconds
        setTimeout(() => {
          setToasts(prev => prev.filter(t => t.id !== toastItem.id));
        }, 5500);
      }
    });

    return () => unsubscribe();
  }, []);

  const removeToast = (id, e) => {
    e?.stopPropagation();
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleToastClick = (toast) => {
    if (toast.link) {
      navigate(toast.link);
      removeToast(toast.id);
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const IconComponent = toast.icon;
        return (
          <div
            key={toast.id}
            onClick={() => handleToastClick(toast)}
            className="pointer-events-auto bg-slate-900/95 backdrop-blur-md text-white p-3.5 rounded-2xl shadow-2xl border border-slate-700/80 flex items-start gap-3 cursor-pointer hover:bg-slate-900 transition-all transform animate-fade-in group"
          >
            <div className={`w-9 h-9 rounded-xl ${toast.iconBg} flex items-center justify-center shrink-0 shadow`}>
              <IconComponent className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  {toast.roleBadge}
                </span>
                <button
                  onClick={(e) => removeToast(toast.id, e)}
                  className="p-0.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="font-bold text-xs text-white truncate leading-snug">
                {toast.title}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight mt-0.5">
                {toast.message}
              </p>

              {toast.link && (
                <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-400 group-hover:text-emerald-300">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
