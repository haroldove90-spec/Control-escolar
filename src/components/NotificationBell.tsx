import React, { useState, useRef, useEffect } from 'react';
import { useSchool } from '../SchoolContext';
import { Bell, Check, Clock, ShieldAlert, BadgeCheck, AlertTriangle } from 'lucide-react';

export const NotificationBell: React.FC = () => {
  const { notifications, currentRole, currentStudentId, markNotificationRead, markAllNotificationsRead } = useSchool();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter notifications based on role & student ID
  const roleNotifications = notifications.filter(notif => {
    if (notif.role !== currentRole) return false;
    if (currentRole === 'estudiante' && notif.studentId !== currentStudentId) return false;
    return true;
  });

  const unreadCount = roleNotifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = () => {
    if (currentRole === 'estudiante') {
      markAllNotificationsRead('estudiante', currentStudentId || undefined);
    } else {
      markAllNotificationsRead('admin');
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'pago_recibido':
        return (
          <div className="h-8 w-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <BadgeCheck className="h-4.5 w-4.5" />
          </div>
        );
      case 'revision_pago':
        return (
          <div className="h-8 w-8 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <Clock className="h-4.5 w-4.5" />
          </div>
        );
      case 'pago_vencido':
      case 'suspension':
        return (
          <div className="h-8 w-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
            <ShieldAlert className="h-4.5 w-4.5" />
          </div>
        );
      case 'pago_por_vencer':
      default:
        return (
          <div className="h-8 w-8 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
            <AlertTriangle className="h-4.5 w-4.5" />
          </div>
        );
    }
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-colors focus:outline-none cursor-pointer"
        aria-label="Notificaciones"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white shadow-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden transform origin-top-right transition-all">
          {/* Header */}
          <div className="p-4 border-b border-slate-150 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-sm text-slate-800">Avisos y Notificaciones</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  {unreadCount} nuevas
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>Marcar leído</span>
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {roleNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300 stroke-1" />
                <p>No tienes notificaciones en este momento.</p>
              </div>
            ) : (
              roleNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.read && markNotificationRead(notif.id)}
                  className={`p-4 flex items-start space-x-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                    !notif.read ? 'bg-indigo-50/20' : ''
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotifIcon(notif.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-bold truncate ${!notif.read ? 'text-slate-900' : 'text-slate-700'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0" />
                      )}
                    </div>
                    <p className={`text-xs leading-relaxed ${!notif.read ? 'text-slate-800 font-medium' : 'text-slate-500'}`}>
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatTime(notif.timestamp)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
