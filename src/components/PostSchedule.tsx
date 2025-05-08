import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  Globe,
  Image,
  Video,
  Camera,
  MapPin,
  Tag,
  Users,
  XCircle,
} from 'lucide-react';
import PageSelector from './PageSelector';
import { format, isToday, parseISO } from 'date-fns';

interface Page {
  id: string;
  name: string;
  avatar?: string;
}

interface ScheduledPost {
  id: number;
  content: string;
  scheduledTime: string;
  status: 'scheduled' | 'published' | 'failed';
  platform: 'facebook' | 'instagram' | 'twitter';
  image?: string;
}

function PostSchedule() {
  const [showNewPost, setShowNewPost] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  // Example data - in real app this would come from API
  const scheduledPosts: ScheduledPost[] = [
    {
      id: 1,
      content: 'Chương trình khuyến mãi tháng 4 - Giảm giá 50% cho tất cả sản phẩm',
      scheduledTime: '2024-04-01T09:00:00',
      status: 'scheduled',
      platform: 'facebook',
      image: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
    },
    {
      id: 2,
      content: 'Bộ sưu tập mùa hè 2024 đã có mặt tại cửa hàng',
      scheduledTime: '2024-04-02T14:30:00',
      status: 'scheduled',
      platform: 'instagram',
      image: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
    },
    {
      id: 3,
      content: 'Bài viết đã đăng tuần trước',
      scheduledTime: '2024-03-25T10:00:00',
      status: 'published',
      platform: 'facebook',
    },
    {
      id: 4,
      content: 'Bài viết bị lỗi đăng',
      scheduledTime: '2024-03-26T15:00:00',
      status: 'failed',
      platform: 'twitter',
    },
  ];

  const daysInWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  // const today = new Date();

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startPadding = firstDay.getDay();

    // Add padding for days from previous month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add days of current month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const changeMonth = (delta: number) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + delta);
    setSelectedDate(newDate);
  };

  const getPostsForDate = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());

    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const getPostsForDay = (date: Date) => {
    return scheduledPosts.filter((post) => {
      const postDate = new Date(post.scheduledTime);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const renderWeekView = () => {
    const days = getWeekDays(selectedDate);

    return (
      <div className="flex flex-col h-full">
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day, index) => (
            <div key={index} className="text-center">
              <div className="text-sm font-medium text-gray-500">
                {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
              </div>
              <div
                className={`text-lg font-semibold ${
                  day.toDateString() === new Date().toDateString()
                    ? 'text-blue-600'
                    : 'text-gray-900'
                }`}
              >
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 grid grid-cols-7 gap-2">
          {days.map((day, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-2 min-h-[200px]">
              {getPostsForDay(day).map((post) => (
                <div
                  key={post.id}
                  className="mb-2 p-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-2">
                    {post.image && (
                      <img
                        src={post.image}
                        alt="Post thumbnail"
                        className="w-12 h-12 rounded object-cover"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-xs font-medium text-gray-500">
                          {formatTime(new Date(post.scheduledTime))}
                        </span>
                        {post.status === 'scheduled' && <Clock className="w-3 h-3 text-blue-500" />}
                        {post.status === 'published' && (
                          <CheckCircle className="w-3 h-3 text-green-500" />
                        )}
                        {post.status === 'failed' && <XCircle className="w-3 h-3 text-red-500" />}
                      </div>
                      <p className="text-sm text-gray-800 line-clamp-2">{post.content}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const days = getDaysInMonth(selectedDate);

    return (
      <div className="grid grid-cols-7 gap-2">
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div key={day} className="text-center font-medium text-gray-500">
            {day}
          </div>
        ))}

        {days.map((day, index) => (
          <div
            key={index}
            className={`border border-gray-200 rounded-lg p-2 min-h-[100px] ${
              !day ? 'bg-gray-50' : ''
            }`}
          >
            {day && (
              <>
                <div
                  className={`text-sm font-medium ${
                    day.toDateString() === new Date().toDateString()
                      ? 'text-blue-600'
                      : 'text-gray-900'
                  }`}
                >
                  {day.getDate()}
                </div>
                {getPostsForDay(day).map((post) => (
                  <div key={post.id} className="mt-1 p-1 bg-white border rounded text-xs truncate">
                    {formatTime(new Date(post.scheduledTime))} - {post.content}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">
            {selectedDate.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' })}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white border rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 rounded-md ${
                viewMode === 'week' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 rounded-md ${
                viewMode === 'month' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
              }`}
            >
              Tháng
            </button>
          </div>

          <button
            onClick={() => setShowNewPost(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Lên lịch bài viết</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {viewMode === 'week' ? renderWeekView() : renderMonthView()}
      </div>

      {/* Page Selector Modal */}
      {showPageSelector && (
        <PageSelector
          onPageSelect={(page) => {
            setSelectedPage(page);
            setShowPageSelector(false);
            setShowNewPost(true);
          }}
          onClose={() => setShowPageSelector(false)}
        />
      )}

      {/* New Post Modal */}
      {showNewPost && selectedPage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Lên lịch bài viết mới</h2>
              <button
                onClick={() => {
                  setShowNewPost(false);
                  setSelectedPage(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedPage.avatar || 'https://via.placeholder.com/128'}
                  alt={selectedPage.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
                <div>
                  <h2 className="font-semibold">{selectedPage.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date().toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian đăng
                </label>
                <input
                  type="datetime-local"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowNewPost(false);
                    setSelectedPage(null);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={() => {
                    // Handle post creation
                    setShowNewPost(false);
                    setSelectedPage(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lên lịch
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.image || 'https://via.placeholder.com/128'}
                    alt={selectedPost.content}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                  />
                  <div>
                    <h2 className="font-semibold">{selectedPost.content}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(selectedPost.scheduledTime).toLocaleString()}</span>
                      {selectedPost.status === 'published' ? (
                        <span className="flex items-center gap-1 text-green-600 font-medium">
                          <CheckCircle className="w-4 h-4" />
                          Đã đăng
                        </span>
                      ) : selectedPost.status === 'failed' ? (
                        <span className="flex items-center gap-1 text-red-600 font-medium">
                          <AlertCircle className="w-4 h-4" />
                          Lỗi
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-blue-600 font-medium">
                          <Clock className="w-4 h-4" />
                          Chờ đăng
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
                <p className="text-gray-800">{selectedPost.content}</p>
              </div>
              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Edit2 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                  <span>Xóa</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PostSchedule;
