import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, MessageSquare, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const FarmerNotificationsPage = () => {
  const { currentUser } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const navigate = useNavigate();

  const userNotifs = notifications.filter(n => !currentUser || n.userId === currentUser.id);

  const handleNotifClick = (notif) => {
    markNotificationRead(notif.id);
    if (notif.link) navigate(notif.link);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-emerald-600" /> Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-500 font-medium">Alerts from scientists, department officers, and status updates</p>
        </div>
      </div>

      {userNotifs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-xs text-slate-500">
          No notifications received yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm divide-y divide-slate-100 overflow-hidden">
          {userNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => handleNotifClick(n)}
              className={`p-5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-4 ${!n.read ? 'bg-emerald-50/40' : ''}`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${!n.read ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-500'}`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-sm text-slate-900">{n.title}</h3>
                  <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-xs text-slate-700 font-medium">{n.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
