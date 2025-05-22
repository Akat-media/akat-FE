import React, { useState, useMemo, useEffect, useRef } from 'react';
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
  Search,
  XCircle,
  PanelRightClose,
  Loader2,
  Sparkles,
  Bot,
} from 'lucide-react';
import PageSelector from './PageSelector';
import { format, isToday, parseISO } from 'date-fns';
import axios from 'axios';
import { BaseUrl } from '../constants';
import { toast } from 'react-toastify';
import ListPostSchedule from './content-management/post-managenment/ListPostSchedule.tsx';
import { now } from 'lodash';

interface Page {
  id: string;
  name: string;
  avatar?: string;
}

interface ScheduledPost {
  id: string;
  content: string;
  scheduledTime: string;
  page: {
    name: string;
    avatar?: string;
  };
  status: 'pending' | 'published' | 'failed';
  posted_at: string;
  page_name: string;
  post_avatar_url: string;
}

interface PostScheduleProps {
  page: any;
  // onClose: () => void;
  // onSuccess: () => void;
}

function PostSchedule({ page }: PostScheduleProps) {
  const [showNewPost, setShowNewPost] = useState(false);
  const [showPostRelease, setShowPostRelease] = useState(true);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<ScheduledPost | null>(null);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [dataListPage, setDataListPage] = useState<any>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dataPostDraft, setDataPostDraft] = useState<any>([]);
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isImageDisabled, setIsImageDisabled] = useState(false);
  const [isVideoDisabled, setIsVideoDisabled] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);
  const [fileVideos, setFileVideos] = useState<any[]>([]);
  const [status, setStatus] = useState('');
  const [photoStories, setPhotoStories] = useState<string[]>([]);
  const [videoStories, setVideoStories] = useState<string[]>([]);
  const [fileImages, setFileImages] = useState<File[]>([]);
  const storyInputRef = useRef<HTMLInputElement>(null);
  const [contentError, setContentError] = useState(false);
  const [fileVideosStory, setFileVideosStory] = useState<any[]>([]);

  // thêm state để lưu trữ ngày nào đang mở rộng
  const [expandedDates, setExpandedDates] = useState<Record<string, boolean>>({});
  // hàm toggle trạng thái mở rộng của một ngày
  const toggleExpand = (dateKey: string) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateKey]: !prev[dateKey],
    }));
  };
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const [dataListPosts, setDataListPosts] = useState<any>([]);
  const [modalDate, setModalDate] = useState<string | null>(null);
  const [modalPosts, setModalPosts] = useState<ScheduledPost[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log('dataPostDraft', dataPostDraft);
  const fetchPostsFromConnectedPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pageResponse] = await Promise.all([
        axios.get(`${BaseUrl}/facebook-page-insight`, {
          params: {
            user_id: JSON.parse(localStorage.getItem('user') || '{}')?.user_id,
          },
        }),
      ]);
      setDataListPage(pageResponse.data.data.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  const handleCallApi = async () => {
    try {
      setLoading(true);
      setError(null);
      const [postDraftRes] = await Promise.all([
        axios.get(`${BaseUrl}/facebook-schedule`, {
          params: {
            user_id: JSON.parse(localStorage.getItem('user') || '{}')?.user_id,
            type: viewMode,
            date: selectedDate,
            listPageId: [],
          },
        }),
      ]);
      setDataPostDraft(postDraftRes.data.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    }
  };
  useEffect(() => {
    fetchPostsFromConnectedPages();
  }, []);
  useEffect(() => {
    handleCallApi();
  }, [viewMode, selectedDate]);
  const daysInWeek = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

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

  const changeMonthPrev = (delta: number) => {
    if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + delta);
      setSelectedDate(newDate);
    }
  };
  const changeMonthNext = (delta: number) => {
    if (viewMode === 'week') {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      setSelectedDate(newDate);
    } else {
      const newDate = new Date(selectedDate);
      newDate.setMonth(newDate.getMonth() + delta);
      setSelectedDate(newDate);
    }
  };
  const RenderMonth = () => {
    const formattedDate = selectedDate.toLocaleString('vi-VN', { month: 'long', year: 'numeric' });
    const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
    return capitalizedDate;
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
  const renderWeek = () => {
    const days = getWeekDays(selectedDate);
    return (
      <div className="grid grid-cols-7 gap-2 mb-2">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-sm font-medium text-gray-500">
              {day.toLocaleDateString('vi-VN', { weekday: 'short' })}
            </div>
            <div
              className={`text-lg font-semibold ${
                day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-gray-900'
              }`}
            >
              {day.getDate()}
            </div>
          </div>
        ))}
        {days.map((day, index) => {
          return (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-2 min-h-[200px] max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
            >
              {dataPostDraft
                ?.find((item: any) => item.date == format(day, 'yyyy-MM-dd'))
                ?.list.map((post: any) => (
                  <div
                    key={post?.id}
                    className="mb-2 p-2 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h5 className="font-normal text-[14px] text-gray-900 mb-1 truncate">
                      {post?.page_name}
                    </h5>
                    <div
                      className={`flex ${showPostRelease ? 'flex-col' : 'flex-row'} items-start gap-2`}
                    >
                      {typeof post.post_avatar_url === 'string' && (
                        <img
                          src={post.post_avatar_url}
                          alt="Post thumbnail"
                          className={` ${showPostRelease ? 'w-full' : 'w-12'} h-12 rounded object-cover`}
                        />
                      )}
                      {Array.isArray(post.post_avatar_url) && post.post_avatar_url.length > 0 && (
                        <img
                          src={post.post_avatar_url?.[0]}
                          alt="Post thumbnail"
                          className={` ${showPostRelease ? 'w-full' : 'w-12'} h-12 rounded object-cover`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            {format(post.posted_at, 'yyyy-MM-dd')}
                          </span>
                          {post.status === 'pending' && <Clock className="w-3 h-3 text-blue-500" />}
                          {post.status === 'published' && (
                            <CheckCircle className="w-3 h-3 text-green-500" />
                          )}
                          {post.status === 'failed' && <XCircle className="w-3 h-3 text-red-500" />}
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            {format(parseISO(post.posted_at), 'HH:mm')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-800 truncate">{post.content}</p>
                  </div>
                ))}
            </div>
          );
        })}
      </div>
    );
  };
  const renderMonth = () => {
    const days = getDaysInMonth(selectedDate);
    return (
      <div className="grid grid-cols-7 gap-1">
        {/* Tiêu đề thứ */}
        {daysInWeek.map((day) => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}

        {/* Duyệt từng ngày */}
        {days.map((date, idx) => {
          if (!date) return <div key={idx} className="p-2 min-h-[100px]" />;

          const dateKey = format(date, 'yyyy-MM-dd');
          // tìm danh sách bài của ngày này
          const dayData = dataPostDraft.find((item: any) => item.date === dateKey);
          const posts = dayData?.list || [];
          const isExpanded = expandedDates[dateKey] || false;
          // nếu chưa mở rộng thì chỉ lấy 1 bài
          const postsToShow = isExpanded ? posts : posts.slice(0, 1);

          return (
            <div
              key={dateKey}
              className={`p-2 min-h-[100px] rounded-lg transition-all ${
                isToday(date) ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
            >
              {/* Ngày và label “Hôm nay” */}
              <div
                className={`text-sm font-medium mb-2 flex items-center justify-between ${
                  isToday(date) ? 'text-blue-600' : ''
                }`}
              >
                <span>{date.getDate()}</span>
                {isToday(date) && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                    Hôm nay
                  </span>
                )}
              </div>

              {/* Hiển thị các bài */}
              <div className="space-y-1">
                {postsToShow.map((post: ScheduledPost) => (
                  <button
                    key={post.id}
                    // onClick={() => setSelectedPost(post)}
                    className={`w-full text-left p-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                      post.status === 'published'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : post.status === 'failed'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span className="truncate flex-1">
                      {format(parseISO(post.posted_at), 'HH:mm')} – {post.page_name}
                    </span>
                  </button>
                ))}

                {/* Nút Show more / Show less */}
                {posts.length > 1 && (
                  <button
                    onClick={() => {
                      // lưu ngày và danh sách posts tương ứng vào state
                      setModalDate(dateKey);
                      setModalPosts(posts);
                      setOpenScheduleModal(true);
                    }}
                    className="text-blue-600 text-xs font-medium mt-1 hover:underline"
                  >
                    Hiển thị thêm
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Page Selector Modal */}
        {openScheduleModal && (
          <ListPostSchedule
            date={modalDate}
            posts={modalPosts}
            onPageSelect={(page) => {
              setSelectedPage(page);
              setOpenScheduleModal(false);
              setShowNewPost(true);
            }}
            data={dataListPage}
            onClose={() => setOpenScheduleModal(false)}
          />
        )}
      </div>
    );
  };

  const [images, setImages] = useState<any>([]);
  const [files, setFiles] = useState<any>([]);
  const [postDate, setPostDate] = useState('');
  const [postTime, setPostTime] = useState('');
  const [content, setContent] = useState('');

  const handleStoryChange = (e: any) => {
    setIsImageDisabled(true)
    setIsVideoDisabled(true)

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
    e.target.value = null;
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
    e.target.value = null;
    console.log("images",images)
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setImages((prevImages: string[]) => prevImages.filter((_, index) => index !== indexToRemove));
    setFiles((prev: any) => prev.filter((_: any, i: number) => i !== indexToRemove));
    setPhotoStories([]);
    setFileImages([]);
    setIsVideoDisabled(false);
    setContentError(false);
  };

  const handleRemoveImageStory = (indexToRemove: number) => {
    setImages((prevImages: string[]) => prevImages.filter((_, index) => index !== indexToRemove));
    setFiles((prev: any) => prev.filter((_: any, i: number) => i !== indexToRemove));
    setPhotoStories([]);
    setFileImages([]);
    setIsVideoDisabled(false);
    setIsImageDisabled(false);
    setContentError(false);
  };

  const handleVideoChange = (event:any) => {
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
    event.target.value = null;
    console.log("videos",videos)

  };

  const handleRemoveVideo = (index: number) => {
    setVideoStories((prev) => prev.filter((_, i) => i !== index));
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setFileVideos((prev) => prev.filter((_, i) => i !== index));
    setIsImageDisabled(false);
    setContentError(false);
  };

  const handleRemoveVideoStory = (index: number) => {
    setVideoStories((prev) => prev.filter((_, i) => i !== index));
    setVideos((prev) => prev.filter((_, i) => i !== index));
    setFileVideos((prev) => prev.filter((_, i) => i !== index));
    setIsImageDisabled(false);
    setIsVideoDisabled(false)
    setContentError(false);
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
      const now = new Date();
      const combinedDateTime = new Date(`${postDate}T${postTime}:00`);
      // const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      // console.log('combinedDateTime', combinedDateTime.toISOString());
      console.log("files",files);

      const payload: any = {
        files,
        content: content,
        likes: '0',
        comments: '0',
        shares: '0',
        status: 'pending',
        access_token: selectedPage?.access_token[0] || '',
        posted_at: combinedDateTime.toISOString(),
        scheduledTime: combinedDateTime.toISOString(),
        facebook_fanpage_id: selectedPage?.facebook_fanpage_id,
        page_name: selectedPage?.name,
      };
      // console.log("video lenth",videos.length)
      // return
      if (images.length > 0) {
        payload['type'] = '';
      } else if (videos.length > 0) {
        payload['type'] = 'video';
        payload['files'] = fileVideos;
      } else if (photoStories.length > 0) {
        payload['type'] = 'photo_stories';
        payload['files'] = fileImages;
      } else if (videoStories.length > 0) {
        payload['type'] = 'video_stories';
        payload['files'] = fileVideos;
      }
      console.log("payload",payload);
      // return

      if((photoStories.length > 0 && content.length <= 0) || (videoStories.length > 0 && content.length <= 0)) {
        setContentError(true);
        return;
      }

      if (content.length <= 0) {
        setContentError(true);
        return;
      } else {
        setContentError(false);
      }

      const body: any = createFormData(payload);

      const res = await axios.post(`${BaseUrl}/facebook-schedule`, body, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setImages([]);
      setFiles([]);
      setPostDate('');
      setPostTime('');
      setContent('');
      setShowNewPost(false);
      toast.success('Lên lịch đăng thành công!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });

      await handleCallApi();
    } catch (error) {
      setImages([]);
      setFiles([]);
      setPostDate('');
      setPostTime('');
      setContent('');
      setShowNewPost(false);
      console.error('Lỗi khi tải danh sách bài viết:', error);
    }
  };

  // console.log("selectedPage",selectedPage);
  const [showAiSuggestions, setShowAiSuggestions] = useState(false);
  const [visible, setVisible] = useState(false);
  const [suggestionHistory, setSuggestionHistory] = useState<string[]>([]);
  const [generatingSuggestions, setGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [ask, setAsk] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  const generateSuggestions = async () => {
    try {
      if(content.length <= 0) {
        setContentError(true);
        console.log("content error",contentError)
        return;
      } else {
        setContentError(false);
        console.log("content error",contentError)
      }

      setLoading(false);
      setSuggestionHistory([]);
      setGeneratingSuggestions(true);
      const postResponse = await axios.post(`${BaseUrl}/genpost-openai`, {
        question: content,
        facebook_fanpage_id: selectedPage.facebook_fanpage_id || '',
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

  const handleClose = () => {
    setShowAiSuggestions(false);
    setSuggestionHistory([]);
    setSuggestions([]);
    setAsk('');
    setLoading(false);
    setHasSubmitted(false);
    setVisible(false);
  };

  const useSuggestion = (suggestion: string) => {
    setContent(suggestion);
    setShowAiSuggestions(true);
    setVisible(true);
  };

  const toggleHistory = () => {
    setShowHistory((prev) => !prev);
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
          facebook_fanpage_id: selectedPage.facebook_fanpage_id || '',
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

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-md">
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h2 className="text-lg font-semibold">Lịch đăng bài</h2>
          <div className="flex items-center gap-6">
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
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowPageSelector(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Lên lịch mới</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 lg:divide-x min-h-[500px]">
        {/* Calendar */}
        <div className={`${showPostRelease ? 'col-span-5' : 'col-span-7'}  p-4 min-h-full`}>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium">{RenderMonth()}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changeMonthPrev(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => changeMonthNext(1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowPostRelease((prev) => !prev)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <PanelRightClose className="w-5 h-5" />
              </button>
            </div>
          </div>
          {viewMode == 'week' ? renderWeek() : renderMonth()}
        </div>

        {/* Upcoming posts */}
        <div
          className={`${showPostRelease ? '' : 'hidden'} col-span-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-full`}
        >
          <h3 className="font-medium mb-4">Bài đăng sắp tới</h3>
          <div className="space-y-3 max-h-[618px] overflow-y-auto">
            {dataPostDraft
              ?.flatMap((item: any) => item.list)
              ?.filter((item: any) => item.status == 'pending')
              ?.map((post: any) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    {typeof post.post_avatar_url == 'string' && (
                      <img
                        src={post.post_avatar_url}
                        alt="Post thumbnail"
                        className={` ${showPostRelease ? 'w-12' : 'w-12'} h-12 rounded object-cover`}
                      />
                    )}
                    {Array.isArray(post.post_avatar_url) && post.post_avatar_url.length > 0 && (
                      <img
                        src={post.post_avatar_url?.[0]}
                        alt="Post thumbnail"
                        className={` ${showPostRelease ? 'w-12' : 'w-12'} h-12 rounded object-cover`}
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{post.page_name}</h4>
                        <div className="relative">
                          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-2 mt-3 text-xs font-medium text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(post.posted_at).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Page Selector Modal */}
      {showPageSelector && (
        <PageSelector
          onPageSelect={(page) => {
            setSelectedPage(page);
            setShowPageSelector(false);
            setShowNewPost(true);
          }}
          data={dataListPage}
          onClose={() => setShowPageSelector(false)}
        />
      )}

      {/* New Post Modal */}
      {showNewPost && selectedPage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl m-4">
            <div className="p-6 border-b border-gray-200 m-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Lên lịch đăng bài</h2>
                <button
                  onClick={() => {
                    setShowNewPost(false);
                    setContent('');
                    setShowAiSuggestions(false);
                    setVisible(false);
                    setHasSubmitted(false);
                    setLoading(false);
                    setSuggestions([]);
                    setAsk('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="max-h-screen overflow-y-auto px-2 py-2 m-2">
              <div className="space-y-4 overflow-y-auto px-1 py-1 max-h-[500px]">
                {/* Page Selection */}
                <div className="flex items-center gap-4 p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl relative">
                  <img
                    src={
                      selectedPage.image_url ||
                      'https://images.unsplash.com/photo-1441986300917-64674bd600d8'
                    }
                    alt={selectedPage.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white shadow-md"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedPage.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <select className="bg-transparent border-none p-0 pr-6 text-gray-600 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors font-medium">
                        <option>Công khai</option>
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
                    className="w-full h-full min-h-[150px] bg-transparent border-none focus:outline-none ring-0 resize-none text-gray-900 placeholder-gray-500 text-lg"
                  />

                </div>

                {contentError && !content && (
                  <p className="mt-2 text-bg text-red-600">Không được để trống văn bản</p>
                )}

                {images.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {images.map((img: any, index: any) => (
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
                            onClick={() => handleRemoveImageStory(index)}
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
                            onClick={() => handleRemoveVideoStory(index)}
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


                {/* AI suggestion */}
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
                          <p className="text-sm text-gray-500"></p>
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
                      onChange={handleImageChange}
                      disabled={isImageDisabled}
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
                      className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-purple-600 transition-colors cursor-pointer"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-sm">Story</span>
                    </label>

                    {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-blue-600 transition-colors">*/}
                    {/*  <Video className="w-5 h-5" />*/}
                    {/*  <span className="text-sm">Video</span>*/}
                    {/*</button>*/}
                    {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-purple-600 transition-colors">*/}
                    {/*  <Camera className="w-5 h-5" />*/}
                    {/*  <span className="text-sm">Story</span>*/}
                    {/*</button>*/}
                    {/*<button className="flex items-center gap-2 px-3 py-2 hover:bg-white rounded-lg text-orange-600 transition-colors">*/}
                    {/*  <MapPin className="w-5 h-5" />*/}
                    {/*  <span className="text-sm">Check in</span>*/}
                    {/*</button>*/}

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

                {/* Schedule Settings */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <span>Cài đặt thời gian</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày đăng
                      </label>
                      <input
                        type="date"
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                        min={new Date().toISOString().split('T')[0]}
                        value={postDate}
                        onChange={(e) => setPostDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Giờ đăng
                      </label>
                      <input
                        value={postTime}
                        onChange={(e) => setPostTime(e.target.value)}
                        type="time"
                        className="w-full p-3 border rounded-xl bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end gap-4 m-2">
              <button
                onClick={() => {
                  setShowNewPost(false);
                  setSelectedPage(null);
                  setContent('');
                  setShowAiSuggestions(false);
                  setVisible(false);
                  setHasSubmitted(false);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleCreateAndSchedulePost}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Lên lịch
              </button>
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
                    src={selectedPost.page.avatar}
                    alt={selectedPost.page.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                  />
                  <div>
                    <h2 className="font-semibold">{selectedPost.page.name}</h2>
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
