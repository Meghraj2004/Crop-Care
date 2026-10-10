import React from 'react';
import { 
  Clock, 
  UserCheck, 
  Search, 
  MessageSquare, 
  RefreshCw, 
  Microscope, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const STATUS_CONFIG = {
  "Submitted": { color: "bg-blue-100 text-blue-800 border-blue-200", icon: Clock },
  "Assigned": { color: "bg-purple-100 text-purple-800 border-purple-200", icon: UserCheck },
  "Under Review": { color: "bg-amber-100 text-amber-800 border-amber-200", icon: Search },
  "Expert Responded": { color: "bg-teal-100 text-teal-800 border-teal-200", icon: MessageSquare },
  "Farmer Updating": { color: "bg-sky-100 text-sky-800 border-sky-200", icon: RefreshCw },
  "Research Required": { color: "bg-orange-100 text-orange-800 border-orange-200", icon: Microscope },
  "Resolved": { color: "bg-emerald-100 text-emerald-800 border-emerald-200", icon: CheckCircle2 },
  "Closed": { color: "bg-slate-100 text-slate-700 border-slate-200", icon: XCircle }
};

export const StatusBadge = ({ status, size = "md" }) => {
  const { t } = useLanguage();
  const config = STATUS_CONFIG[status] || STATUS_CONFIG["Submitted"];
  const Icon = config.icon;

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-xs font-semibold" 
    : size === "lg" 
    ? "px-3.5 py-1.5 text-sm font-bold" 
    : "px-2.5 py-1 text-xs font-semibold";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${config.color} ${sizeClasses} shadow-sm transition-all`}>
      <Icon className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />
      <span>{t(status)}</span>
    </span>
  );
};
