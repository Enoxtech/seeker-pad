'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function NotificationsModal({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load notifications from localStorage or API
    const saved = localStorage.getItem('seekerpad_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {
        setNotifications([]);
      }
    }
    setLoading(false);
  }, []);

  const markAsRead = (id: string) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem('seekerpad_notifications', JSON.stringify(updated));
  };

  const clearAll = () => {
    setNotifications([]);
    localStorage.removeItem('seekerpad_notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-sm text-purple-400">{unreadCount} unread</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="p-4 text-center text-gray-400">Loading...</div>
          ) : notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <div className="text-4xl mb-2">🔔</div>
              <p>No notifications yet</p>
              <p className="text-sm mt-1">You'll see updates about your launches here</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-700/50 cursor-pointer ${
                    !notification.read ? 'bg-purple-900/20' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">
                      {notification.type === 'success' ? '✅' :
                       notification.type === 'warning' ? '⚠️' :
                       notification.type === 'error' ? '❌' : 'ℹ️'}
                    </span>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium">{notification.title}</h3>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-700 flex justify-between">
            <button
              onClick={clearAll}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear all
            </button>
            <span className="text-sm text-gray-500">
              Click to mark as read
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to add notifications from anywhere
export function addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
  const notifications = JSON.parse(localStorage.getItem('seekerpad_notifications') || '[]');
  
  const newNotification: Notification = {
    ...notification,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString(),
    read: false
  };
  
  notifications.unshift(newNotification);
  localStorage.setItem('seekerpad_notifications', JSON.stringify(notifications.slice(0, 50)));
  
  return newNotification;
}