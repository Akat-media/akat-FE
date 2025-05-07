import React, { useState } from 'react';
import {
  X,
  Image,
  Video,
  Bot,
  Globe,
  Loader2,
  Camera,
  MapPin,
  Tag,
  Users,
  Sparkles,
} from 'lucide-react';

interface NewPostModalProps {
  page: {
    id: string;
    name: string;
    avatar?: string;
  };
  onClose: () => void;
}

function NewPostModal({ page, onClose }: NewPostModalProps) {
  const [content, setContent] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async () => {
    try {
      setGeneratingSuggestions(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setSuggestions([
        '🌟 Mẫu váy mới về, chất liệu cotton 100% mềm mại, thoáng mát. Thiết kế trẻ trung, năng động phù hợp cho mọi dịp. Giá chỉ 299k - Inbox ngay để được tư vấn chi tiết! #ThoStore #VayDep',
        '✨ SALE SHOCK cuối tuần - Giảm giá đến 50% toàn bộ váy đầm. Cơ hội vàng để sở hữu những items thời trang cao cấp với giá cực tốt. Số lượng có hạn - Nhanh tay đặt hàng! 🛍️',
        '🎉 BST Xuân Hè 2024 đã chính thức ra mắt! Đa dạng mẫu mã, kiểu dáng trendy, chất liệu cao cấp. Ưu đãi đặc biệt cho 100 khách hàng đầu tiên. Ghé shop ngay hôm nay! 👗',
      ]);
      setShowAiSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAiSuggestions(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Tạo bài viết mới</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="max-h-[70vh] overflow-auto space-y-4">
            {/* Page Selection */}
            <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl">
              <img
                src={page.avatar || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'}
                alt={page.name}
                className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{page.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Globe className="w-4 h-4" />
                  <select
                    value={privacy}
                    onChange={(e) => setPrivacy(e.target.value as 'public' | 'friends' | 'only_me')}
                    className="bg-transparent border-none p-0 pr-6 text-gray-600 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors font-medium"
                  >
                    <option value="public">Công khai</option>
                    {/* <option value="friends">Bạn bè</option>
                    <option value="only_me">Chỉ mình tôi</option> */}
                  </select>
                </div>
              </div>
            </div>

            {/* Content Input */}
            <div className="min-h-[180px] bg-gray-50 rounded-2xl p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="w-full h-full min-h-[150px] bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-gray-900 placeholder-gray-500 text-lg"
              />
            </div>

            {/* AI Suggestions */}
            {!showAiSuggestions ? (
              <button
                onClick={generateSuggestions}
                disabled={generatingSuggestions}
                className="flex items-center gap-2 px-4 py-4 bg-gradient-to-r from-purple-50 to-blue-50 text-purple-600 rounded-2xl hover:from-purple-100 hover:to-blue-100 transition-all duration-300 w-full justify-center font-medium shadow-sm"
              >
                {generatingSuggestions ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo gợi ý...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Gợi ý nội dung từ AI</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-purple-600" />
                    <h4 className="font-medium">Gợi ý từ AI</h4>
                  </div>
                  <button
                    onClick={() => setShowAiSuggestions(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => useSuggestion(suggestion)}
                      className="w-full p-4 text-left bg-white hover:bg-blue-50 rounded-xl text-sm transition-colors border border-gray-100 shadow-sm hover:shadow-md duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Media Attachments */}
            <div className="flex flex-wrap items-center gap-3 p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <span className="font-medium text-gray-900">Thêm vào bài viết</span>
              <div className="flex-1 flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-green-600 transition-colors">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Ảnh</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-blue-600 transition-colors">
                  <Video className="w-5 h-5" />
                  <span className="text-sm">Video</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-purple-600 transition-colors">
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Story</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-orange-600 transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm">Check in</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-yellow-600 transition-colors">
                  <Tag className="w-5 h-5" />
                  <span className="text-sm">Gắn thẻ</span>
                </button>
                <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-red-600 transition-colors">
                  <Users className="w-5 h-5" />
                  <span className="text-sm">Cảm xúc</span>
                </button>
              </div>
            </div>

            {/* Schedule Option */}
            <div>
              <label className="flex items-center gap-2 text-sm mb-2">
                <input
                  type="checkbox"
                  checked={isScheduled}
                  onChange={(e) => setIsScheduled(e.target.checked)}
                  className="w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="font-medium">Lên lịch đăng bài</span>
              </label>

              {isScheduled && (
                <div className="grid grid-cols-2 gap-4 mt-3 bg-gray-50 p-4 rounded-xl">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày đăng
                    </label>
                    <input
                      type="date"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đăng</label>
                    <input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
            {isScheduled ? 'Lên lịch đăng' : 'Đăng ngay'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPostModal;
