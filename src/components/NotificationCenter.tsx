import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import socket from '../lib/socket';
import axios from 'axios';
import { BaseUrl } from '../constants';
import { useAuth } from '../contexts/AuthContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const userId = user?.user_id;

  const toggleNotificationCenter = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setNotifications((prev) => prev.map((notification) => ({ ...notification, isRead: true })));
    }
  };

  const handleCallNoti = async (userId: string) => {
    try {
      const postResponse = await axios.get(`${BaseUrl}/noti?userId=${userId}`);
      const data = postResponse.data.data.data.map((item: any) => ({
        id: item._id,
        title: item.title,
        message: item.message,
        createdAt: new Date(item.createdAt).toLocaleString(),
        isRead: item.isRead,
      }));

      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      handleCallNoti(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.on('connect', () => {
      console.log('Connected to socket:', socket.id);
      socket.emit('joinRoom', { userId });
    });

    socket.on('fb-sync', (data) => {
      const newNoti = {
        id: data._id,
        title: data.title,
        message: data.message,
        createdAt: new Date(data.createdAt).toLocaleString(),
        isRead: false,
      };
      setNotifications((prev) => [newNoti, ...prev]);
    });

    return () => {
      socket.off('connect');
      socket.off('fb-sync');
    };
  }, [userId]);

  const hasUnreadNotifications = notifications.some((n) => !n.isRead);
  if (!userId) return null;

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
            <h6 className="text-[14px] font-semibold">Thông báo</h6>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer ${
                    notification.isRead ? 'bg-gray-100' : ''
                  }`}
                >
                  <p className="font-bold text-[12px]">{notification.title}</p>
                  <p className="text-sm text-[12px] text-gray-600">{notification.message}</p>
                  <span className="text-xs text-gray-400">{notification.createdAt}</span>
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
