import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    }
  };

  const addNotification = (title: string, description: string) => {
    const newNotification: Notification = {
      id: Date.now(),
      title,
      description,
      timestamp: new Date().toLocaleString(),
      isRead: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  useEffect(() => {
    const socket = new WebSocket('https://localhost:5173');

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      addNotification(data.title, data.description);
    };

    return () => socket.close();
  }, []);

  const hasUnreadNotifications = notifications.some((notification) => !notification.isRead);

  return (
    <div className="relative">
      <button
        onClick={toggleNotificationCenter}
        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition relative"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {hasUnreadNotifications && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
        )}
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Thông báo</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 ${
                    notification.isRead ? 'bg-gray-100' : ''
                  }`}
                >
                  <h4 className="font-bold">{notification.title}</h4>
                  <p className="text-sm text-gray-600">{notification.description}</p>
                  <span className="text-xs text-gray-400">{notification.timestamp}</span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">Không có thông báo nào</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
