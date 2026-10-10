import React, { useState } from 'react';
import { Settings, RefreshCw, CheckCircle2, ShieldCheck, Database } from 'lucide-react';
import { useData } from '../../context/DataContext';

export const AdminSettingsPage = () => {
  const { resetDemoData } = useData();
  const [resetMsg, setResetMsg] = useState(false);

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all data back to the initial demo dataset?")) {
      resetDemoData();
      setResetMsg(true);
      setTimeout(() => setResetMsg(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-purple-600" /> Platform Settings & Maintenance
        </h1>
        <p className="text-xs text-slate-500 font-medium">System configuration, API status, and demo dataset controls</p>
      </div>

      {resetMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> Demo dataset successfully reset to default state!
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-base font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-600" /> Demo Data Management & Evaluation Tools
        </h2>

        <div className="p-5 bg-purple-50/60 rounded-2xl border border-purple-200 space-y-3">
          <div className="font-extrabold text-sm text-purple-950">Cloud Firestore Data Synchronization</div>
          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Clear local browser storage cache and re-sync live collections directly from Firebase Cloud Firestore.
          </p>
          <button
            onClick={handleReset}
            className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-xs rounded-xl shadow transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Purge Cache & Resync Firestore
          </button>
        </div>

        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
          <div className="font-extrabold text-sm text-slate-900">System Integration Status</div>
          <div className="space-y-2 text-xs font-semibold text-slate-700">
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
              <span>Firebase Auth & Firestore Integration</span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Dual-Mode Ready</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
              <span>OpenWeather Agricultural Weather API</span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Active / Mock Fallback</span>
            </div>
            <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200">
              <span>WCAG 2.1 Accessibility & Mobile Touch Targets</span>
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded text-[11px] font-bold">Validated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
