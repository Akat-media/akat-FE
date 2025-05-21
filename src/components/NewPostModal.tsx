import React, { useState, useCallback, useEffect, useRef } from 'react';
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
  Upload,
} from 'lucide-react';
import axios from 'axios';
import { BaseUrl } from '../constants';
import { toast, ToastContainer } from 'react-toastify';
import LoadingContent from './content-management/post-managenment/LoadingContent.tsx';
import { debounce } from 'lodash';
import 'react-toastify/dist/ReactToastify.css';

interface NewPostModalProps {
  page: any;
  onClose: () => void;
  onSuccess: () => void;
}

interface Position {
  displayName?: string;
  latitude: number;
  longitude: number;
}

function NewPostModal({ page, onClose, onSuccess }: NewPostModalProps) {
  const [isScheduled, setIsScheduled] = useState(false);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'only_me'>('public');
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [suggestionHistory, setSuggestionHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [ask, setAsk] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateSuggestions = async () => {
    try {
      setLoading(false);
      setSuggestionHistory([]);
      setGeneratingSuggestions(true);
      const postResponse = await axios.post(`${BaseUrl}/genpost-openai`, {
        question: content,
        facebook_fanpage_id: page.facebook_fanpage_id || '',
      });

      const newSuggestions = postResponse.data.data.posts;
      setSuggestions(newSuggestions);
      setSuggestionHistory((prev) => [...newSuggestions, ...prev]);
      setShowAiSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setGeneratingSuggestions(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAiSuggestions(true);
    setVisible(true);
  };
  const [images, setImages] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // phần video
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState<string[]>([]);
  const [fileVideos, setFileVideos] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [photoStories, setPhotoStories] = useState<string[]>([]);
  const [videoStories, setVideoStories] = useState<string[]>([]);
  const [status, setStatus] = useState('');
  const [isStoryOptionsOpen, setIsStoryOptionsOpen] = useState(false);
  const [fileImages, setFileImages] = useState<File[]>([]);
  const [isImageDisabled, setIsImageDisabled] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);

  const handleStoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Chỉ cho phép upload 1 file
    if (files.length > 1) {
      toast.error('Chỉ được phép upload một ảnh hoặc video duy nhất!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      e.target.value = '';
      return;
    }

    const file = files[0];
    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File "${file.name}" vượt quá ${MAX_SIZE_MB}MB và đã bị từ chối!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      e.target.value = '';
      return;
    }

    const fileURL = URL.createObjectURL(file);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isImage =
      file.type.startsWith('image/') ||
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension || '');
    const isVideo =
      file.type.startsWith('video/') || ['mp4', 'mov', 'avi', 'webm'].includes(fileExtension || '');

    if (isImage) {
      setStatus('photoStories');
      setPhotoStories([fileURL]);
      setFileImages([file]);
    } else if (isVideo) {
      setStatus('videoStories');
      setVideoStories([fileURL]);
      setFileVideos([file]);
    } else {
      toast.error('Vui lòng chọn file ảnh hoặc video hợp lệ!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      e.target.value = '';
      return;
    }
  };

  const handleVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsImageDisabled(true);
    setIsVideoDisabled(false);

    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length > 1) {
      toast.error('Chỉ được phép upload một video duy nhất!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      event.target.value = ''; // Reset input để xóa các file đã chọn
      return;
    }

    const MAX_SIZE_MB = 100;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    const file = files[0];

    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`Video "${file.name}" vượt quá ${MAX_SIZE_MB}MB và đã bị từ chối!`, {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
      event.target.value = ''; // Reset input
      return;
    }

    // Xóa video cũ (nếu có) và chỉ lưu video mới
    const newVideo = URL.createObjectURL(file);
    setVideos([newVideo]);
    setFileVideos([file]);
  };

  const handleRemoveVideo = (index: number) => {
    setVideoStories((prev) => prev.filter((_, i) => i !== index));
    setFileVideos((prev) => prev.filter((_, i) => i !== index));
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setIsImageDisabled(false);
    // if (fileInputRef.current) {
    //   fileInputRef.current.value = '';
    // }
  };

  const handleImageChange = (e: any) => {
    setIsImageDisabled(false);
    setIsVideoDisabled(true);

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
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const payload: any = {
        files: [...files, ...fileVideos],
        content: content,
        likes: '0',
        comments: '0',
        shares: '0',
        status: 'pending',
        access_token: page?.access_token[0] || '',
        posted_at: now.toISOString(),
        scheduledTime: yesterday.toISOString(),
        facebook_fanpage_id: page?.facebook_fanpage_id,
        page_name: page?.name,
      };
      if (images.length > 0) {
        payload['type'] = '';
      } else if (videos.length > 0) {
        payload['type'] = 'video';
      } else if (photoStories.length > 0) {
        payload['type'] = 'photo_stories';
        payload['files'] = fileImages;
      } else if (videoStories.length > 0) {
        payload['type'] = 'video_stories';
        payload['files'] = fileVideos;
      }
      console.log(payload);
      const body: any = createFormData(payload);
      // return;
      const res = await axios
        .post(`${BaseUrl}/facebook-schedule`, body, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percent = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(percent);
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
    setFiles((prev: any) => prev.filter((_: any, i: number) => i !== indexToRemove));
    setPhotoStories([]);
    setFileImages([]);
    setIsVideoDisabled(false);

    // if (fileInputRef.current) {
    //   fileInputRef.current.value = '';
    // }
  };

  const handleChange = (e: any) => {
    setAsk(e.target.value);
  };

  const handleSubmit = async () => {
    if (ask.trim()) {
      try {
        setLoading(true);
        const postResponse = await axios.post(`${BaseUrl}/genpost-openai`, {
          question: ask,
          facebook_fanpage_id: page.facebook_fanpage_id || '',
        });
        const newSuggestions = postResponse.data.data.posts;

        setSuggestions(newSuggestions);
        setSuggestionHistory((prev) => [...newSuggestions, ...prev]);
        setAsk('');
        setShowHistory(false);
        setHasSubmitted(true);
      } catch (error) {
        console.error('Error submitting question:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
  };

  const handleClose = () => {
    setShowAiSuggestions(false);
    setSuggestionHistory([]);
    setSuggestions([]);
    setAsk('');
    setLoading(false);
    setHasSubmitted(false);
    setVisible(false);
  };

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locations, setLocations] = useState('');
  const [lats, setLats] = useState('');
  const [lons, setLons] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Position | null>(null);

  const storyInputRef = useRef<HTMLInputElement>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSearchTerm('');
    setLocations('');
  };

  const search = useCallback(async (searchQuery: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BaseUrl}/places`, {
        params: {
          q: searchQuery,
        },
      });
      setLats(response.data.data.lat);
      setLons(response.data.data.lon);
      setLocations(response.data.data.display_name);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }, []);
  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      search(searchQuery);
    }, 500),
    [search]
  );

  const handleInputChange = async (e: any) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  let iframeUrl = '';
  if (lats && lons) {
    iframeUrl = `https://www.google.com/maps?q=${lats},${lons}&z=13&output=embed`;
  }

  const [selected, setSelected] = useState(false);
  const [showMap, setShowMap] = useState(true);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const getCurrentLocation = async (): Promise<Position> => {
    if (!navigator.geolocation) {
      throw new Error('Trình duyệt không hỗ trợ Geolocation API');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coords: GeolocationCoordinates = position.coords;
          const { latitude, longitude } = coords;
          resolve({ latitude, longitude });
        },
        (error: GeolocationPositionError) => {
          reject(new Error(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  const handleGetLocation = async () => {
    try {
      const position = await getCurrentLocation();

      const response = await axios.get(`${BaseUrl}/places/current`, {
        params: {
          lat: position.latitude,
          lon: position.longitude,
        },
      });
      const displayName = response.data.data?.display_name || 'Không xác định';

      setLocation((prev) => {
        if (
          !prev ||
          prev.latitude !== position.latitude ||
          prev.longitude !== position.longitude ||
          prev.displayName !== displayName
        ) {
          return { ...position, displayName };
        }
        return prev;
      });

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lấy vị trí');
    }
  };

  useEffect(() => {
    handleGetLocation();
    if (!navigator.geolocation) {
      setError('Trình duyệt không hỗ trợ Geolocation API');
      return;
    }
  }, []);

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

            <button
              className={`flex gap-2 px-4 py-2 rounded-full 
                ${uploadProgress === 100 ? 'bg-green-800 text-[white]' : 'bg-slate-200'}`}
            >
              <Upload /> {` ${uploadProgress}%`}
            </button>

            {/* Content Input */}
            <div className="min-h-[180px] bg-gray-50 rounded-2xl p-5">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Bạn đang nghĩ gì?"
                className="w-full h-full min-h-[150px] bg-transparent border-none focus:ring-0 focus:outline-none resize-none text-gray-900 placeholder-gray-500 text-lg"
              />

              {/*map*/}
              {selected && showMap && (
                <div className="relative w-full h-60 rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
                  <button
                    onClick={() => setShowMap(false)}
                    className="absolute top-2 right-2 z-[999] bg-white rounded-full p-1 shadow hover:bg-gray-100"
                  >
                    <X size={20} className="text-gray-700" />
                  </button>

                  {lats && lons && (
                    <div>
                      <iframe
                        src={iframeUrl}
                        width="100%"
                        height="500"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        title="Google Maps"
                      />
                    </div>
                  )}
                </div>
              )}
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
                  <div key={index} className="relative w-32 h-32 image-exist">
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

            {videos.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {videos.map((vid: string, index: number) => (
                  <div key={index} className="relative w-32 h-32 video-exist">
                    <video src={vid} controls className="w-full h-full object-cover rounded-lg" />
                    <button
                      onClick={() => handleRemoveVideo(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-75"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="p-4">
              {status === 'photoStories' && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {photoStories.map((img: any, index: any) => (
                    <div key={index} className="relative w-32 h-32 image-exist">
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

              {status === 'videoStories' && (
                <div className="mt-4 flex flex-wrap gap-3 video">
                  {videoStories.map((vid: string, index: number) => (
                    <div key={index} className="relative w-32 h-32 video-exist">
                      <video src={vid} controls className="w-full h-full object-cover rounded-lg" />
                      <button
                        onClick={() => handleRemoveVideo(index)}
                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-opacity-75"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/*<ToastContainer />*/}
            </div>

            {/* AI Suggestions */}
            {!showAiSuggestions && !visible ? (
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
                  <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {(showHistory ? suggestionHistory : suggestions).map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => useSuggestion(suggestion)}
                      className="w-full p-4 text-left bg-white hover:bg-blue-50 rounded-xl text-sm transition-colors border border-gray-100 shadow-sm hover:shadow-md duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>

                {suggestionHistory.length > 1 && hasSubmitted && (
                  <button
                    onClick={toggleHistory}
                    className="w-full p-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                  >
                    {showHistory ? 'Ẩn lịch sử' : 'Xem thêm'}
                  </button>
                )}
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
                  <div className="flex flex-col gap-4">
                    <textarea
                      value={ask}
                      onChange={handleChange}
                      placeholder="Nhập câu hỏi hoặc yêu cầu của bạn..."
                      className="w-full h-48 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 transition-all duration-200 resize-y"
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">
                        {/*Số ký tự: <span className="font-medium text-blue-600">{ask.length}</span>*/}
                      </p>
                      <button
                        onClick={handleSubmit}
                        disabled={loading || !ask.trim()}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors ${
                          loading || !ask.trim()
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:bg-blue-700'
                        }`}
                      >
                        {loading ? (
                          <>
                            <svg
                              className="animate-spin h-5 w-5 mr-2 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            AI đang tìm kiếm
                          </>
                        ) : (
                          'Gửi'
                        )}
                      </button>
                    </div>
                  </div>
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
                  disabled={isImageDisabled}
                  onChange={handleImageChange}
                  // ref={fileInputRef}
                />
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  id="videoUpload"
                  disabled={isVideoDisabled}
                  onChange={handleVideoChange}
                  // ref={fileInputRef}
                />
                <input
                  ref={storyInputRef}
                  id="storyInput"
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleStoryChange}
                  className="hidden"
                />

                <label
                  htmlFor="imageUpload"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-green-600 transition-colors cursor-pointer"
                >
                  <Image className="w-5 h-5" />
                  <span className="text-sm">Ảnh</span>
                </label>

                <label
                  htmlFor="videoUpload"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-blue-600 transition-colors cursor-pointer"
                >
                  <Video className="w-5 h-5" />
                  <span className="text-sm">Video</span>
                </label>

                <label
                  htmlFor="storyInput"
                  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-blue-600 transition-colors cursor-pointer"
                >
                  <Camera className="w-5 h-5" />
                  <span className="text-sm">Story</span>
                </label>

                {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-purple-600 transition-colors">*/}
                {/*  <Camera className="w-5 h-5" />*/}
                {/*  <span className="text-sm">Story</span>*/}
                {/*</button>*/}
                {/*<button*/}
                {/*  className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-orange-600 transition-colors"*/}
                {/*  onClick={openModal}*/}
                {/*>*/}
                {/*  <MapPin className="w-5 h-5" />*/}
                {/*  <span className="text-sm">Check in</span>*/}
                {/*</button>*/}
                {/* <button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-yellow-600 transition-colors">

                {/* Modal */}
                {isOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg w-full max-w-md mx-4 p-4">
                      {/* Header */}
                      <div className="flex justify-between items-center mb-4">
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <h2 className="text-lg font-semibold text-center flex-1">
                          Tìm kiếm vị trí
                        </h2>
                        <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Ô tìm kiếm */}
                      <div className="relative mb-4">
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={handleInputChange}
                          // onKeyDown={handleKeyDown}
                          placeholder="Nhập tên vị trí..."
                          className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <svg
                          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                          />
                        </svg>
                      </div>

                      <p className="font-medium">Vị trí hiện tại</p>

                      {/* Danh sách vị trí */}
                      <div className="max-h-64 overflow-y-auto">
                        <div>
                          {location ? (
                            <div
                              onClick={() => {
                                search(`${location?.displayName}`);
                                closeModal();
                                setSelected(true);
                                setShowMap(true);
                              }}
                            >
                              {location.displayName}
                            </div>
                          ) : (
                            <p>Đang tải vị trí...</p>
                          )}
                          {error && <p>Lỗi: {error}</p>}
                        </div>

                        {locations ? (
                          <div
                            // key={location.id}
                            className="flex items-center p-2 hover:bg-gray-100 cursor-pointer rounded-lg"
                            onClick={() => {
                              closeModal();
                              setSelected(true);
                              setShowMap(true);
                            }}
                          >
                            <svg
                              className="w-5 h-5 text-gray-500 mr-3"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            <div>
                              <p className="font-medium">{locations}</p>
                            </div>
                          </div>
                        ) : (
                          // <p className="text-gray-500 text-center">Không tìm thấy vị trí</p>
                          <p></p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-yellow-600 transition-colors">*/}
                {/*  <Tag className="w-5 h-5" />*/}
                {/*  <span className="text-sm">Gắn thẻ</span>*/}
                {/*</button>*/}
                {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-red-600 transition-colors">*/}
                {/*  <Users className="w-5 h-5" />*/}
                {/*  <span className="text-sm">Cảm xúc</span>*/}
                {/*</button>*/}
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
