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
import axios from 'axios';
import { BaseUrl } from '../constants';
import { toast } from 'react-toastify';
import LoadingContent from './content-management/post-managenment/LoadingContent.tsx';

interface NewPostModalProps {
  page: any;
  onClose: () => void;
  onSuccess: () => void;
}

function NewPostModal({ page, onClose, onSuccess }: NewPostModalProps) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const generateSuggestions = async () => {
    try {
      setGeneratingSuggestions(true);
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
  const [images, setImages] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e: any) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file: any) => URL.createObjectURL(file));
    setImages((prev: any) => [...prev, ...newImages]);
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFiles((prev: any) => [...prev, ...files]);
    }
  };
  function createFormData(data: any) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' || value instanceof Blob) {
        formData.append(key, value);
      }
      if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) {
          formData.append('files', value[i]);
        }
      }
    }
    return formData;
  }
  const handleCreateAndSchedulePost = async () => {
    try {
      setIsLoading(true);
      const now = new Date();
      console.log('now', now.toISOString());
      console.log('Số lượng files gửi đi:', files.length);
      const body: any = createFormData({
        files,
        content: content,
        likes: '0',
        comments: '0',
        shares: '0',
        status: 'pending',
        access_token: page?.access_token[0] || '',
        posted_at: now.toISOString(),
        scheduledTime: now.toISOString(),
        facebook_fanpage_id: page?.facebook_fanpage_id,
        page_name: page?.name,
      });
      for (const [key, value] of body.entries()) {
        console.log(`${key}: ${value}`);
      }
      const res = await axios
        .post(`${BaseUrl}/facebook-schedule`, body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => {
          setImages([]);
          setFiles([]);
          setContent('');
          onSuccess();
          onClose();
          toast.success('Đăng bài thành công!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        })
        .catch(() => {
          setImages([]);
          setFiles([]);
          setContent('');
          onSuccess();
          onClose();
          toast.error('Đăng bài thất bại!', {
            position: 'top-right',
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
          });
        });
    } catch (error) {
      setImages([]);
      setFiles([]);
      setContent('');
      console.error('Lỗi khi tải danh sách bài viết:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages: string[]) => prevImages.filter((_, index) => index !== indexToRemove));
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
                src={
                  page?.image_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
                }
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
            {images.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {images.map((img: any, index: any) => (
                  // <img
                  //   key={index}
                  //   src={img}
                  //   alt={`upload-${index}`}
                  //   className="w-32 h-32 object-cover rounded-lg"
                  // />
                  <div key={index} className="relative w-32 h-32">
                    <img
                      src={img}
                      alt={`upload-${index}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-75"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
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
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  id="imageUpload"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-green-600 transition-colors cursor-pointer"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Ảnh</span>
                </label>
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
          </div>
        </div>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleCreateAndSchedulePost}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-2xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl"
          >
            {/* {isLoading && <Loader2 className="w-4 h-4 animate-spin" />} */}
            {isScheduled ? 'Lên lịch đăng' : 'Đăng ngay'}
          </button>
        </div>

        {isLoading && LoadingContent()}
      </div>
    </div>
  );
}

export default NewPostModal;
