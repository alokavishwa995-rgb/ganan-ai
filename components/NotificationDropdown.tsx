'use client';

import { useState, useEffect, useRef } from 'react';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  icon?: string;
  createdAt?: any;
  readBy?: string[];
}

export default function NotificationDropdown({ userEmail }: { userEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // අපේ අලුත් API එක හරහා Notifications Fetch කිරීම
  useEffect(() => {
    if (!userEmail) {
      setNotifications([]);
      setLoading(false);
      return;
    }

    const fetchNotifications = async () => {
      try {
        const res = await fetch('/api/notifications');
        const data = await res.json();
        if (data.notifications) {
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error("Notifications Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
    
    // සෑම විනාඩි 2කට වරක් අලුත් notifications තියෙනවද බලන්න
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, [userEmail]);

  // Dropdown එකෙන් පිටත Click කළ විට Close වීම
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // මේ User කියවා නැති Notification ගණන
  const unreadCount = userEmail ? notifications.filter(
    (n) => !n.readBy || !n.readBy.includes(userEmail)
  ).length : 0;

  // Notification එක Read එකක් ලෙස Database එකට Mark කිරීම
  const markAsRead = async (id: string) => {
    if (!userEmail) return;

    // UI එක ඉක්මනින් Update කිරීම
    setNotifications((prev) => 
      prev.map(n => 
        n.id === id 
          ? { ...n, readBy: [...(n.readBy || []), userEmail] }
          : n
      )
    );

    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id, userEmail }),
      });
    } catch (err) {
      console.error("Read status update error:", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 hover:scale-105 active:scale-95 transition"
      >
        <span className="text-xl">🔔</span>

        {/* Dynamic Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Box */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
          
          {/* Header */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-white text-sm">
                දැනුම්දීම්
              </h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {unreadCount} නොකියවූ
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50">
            {loading ? (
              <div className="p-6 text-center text-xs text-indigo-500 animate-pulse">
                Load වෙමින් පවතී... ⌛
              </div>
            ) : notifications.length > 0 ? (
              notifications.map((item) => {
                const isRead = userEmail ? item.readBy?.includes(userEmail) : false;
                return (
                  <div
                    key={item.id}
                    onClick={() => !isRead && markAsRead(item.id)}
                    className={`p-4 flex gap-3 cursor-pointer transition ${
                      !isRead
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/30 font-medium'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/30 opacity-75'
                    }`}
                  >
                    <div className="text-2xl bg-white dark:bg-slate-700 p-2 rounded-2xl h-fit shadow-xs">
                      {item.icon || '📢'}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                          {item.title}
                        </h4>
                        {!isRead && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 dark:bg-indigo-400"></span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        {item.message}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                දැනට කිසිදු දැනුම්දීමක් නැත!
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}