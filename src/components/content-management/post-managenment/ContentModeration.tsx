import React, { useState, useEffect } from 'react';
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Settings,
  Route,
  Send,
} from 'lucide-react';
import { useMonitoringStore } from '../../../store/monitoringStore';
import {
  getModeratedPosts,
  getUserFacebookPages,
  getPageConfig,
  updatePageConfig,
  type FacebookPost,
} from '../../../lib/contentModeration';
import axios from 'axios';
import { BaseUrl } from '../../../constants';

interface MonitoredPage {
  id: string;
  facebook_fanpage_id: string;
  name: string;
  avatarUrl?: string;
  followerCount?: number;
  isMonitored: boolean;
}

type Props = {
  onClose: () => void;
  setRefresh: React.Dispatch<any>;
  data: any;
};

const ContentModeration: React.FC<Props> = ({ onClose }) => {
  const user = localStorage.getItem('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setPageMonitoring, initializeMonitoring } = useMonitoringStore();
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [pages, setPages] = useState<MonitoredPage[]>([]);
  const [posts, setPosts] = useState<FacebookPost[]>([]);
  const [currentStatus, setCurrentStatus] = useState<'all' | 'pending' | 'approved' | 'violated'>(
    'all'
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [confidenceThreshold, setConfidenceThreshold] = useState(90);
  const [autoHideEnabled, setAutoHideEnabled] = useState(true);
  const [autoCorrectEnabled, setAutoCorrectEnabled] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState<string | null>(null);
  const [emails, setEmails] = useState<string[]>(['admin@example.com']);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [loadingAutoHide, setLoadingAutoHide] = useState(false);
  const [loadingAutoCorrect, setLoadingAutoCorrect] = useState(false);
  const [hidePost, setHidePost] = useState(false);
  const [editContent, setEditContent] = useState(false);
  const [notifyAdmin, setNotifyAdmin] = useState(false);
  const [email, setEmail] = useState('akamedia@gmail.com');
  const [volume, setVolume] = useState(90);
  const [threshold, setThreshold] = useState(90);

  const defaultPrompt =
    'Bạn là AI kiểm duyệt nội dung cho mạng xã hội. \n' +
    'Giả sử nội dung đầu vào vi phạm nguyên tắc cộng đồng của Facebook,\n' +
    'hãy giải thích lý do tại sao dựa trên các tiêu chí sau:\n' +
    'Cấu Kết Và Cổ Xúy Tội Ác\n' +
    'Cá Nhân Và Tổ Chức Nguy Hiểm\n' +
    'Bóc Lột Con Người\n' +
    'Bắt Nạt và Quấy Rối\n' +
    'Bóc Lột Tình Dục Người Lớn\n' +
    'Bạo Lực và Kích Động\n' +
    'Ảnh Khỏa Thân, Hành Vi Lạm Dụng Và Bóc Lột Tình Dục Trẻ Em\n' +
    'Hành Vi Tự Tử, Gây Thương Tích và Chứng Rối Loạn ăn Uống\n' +
    'Hành Vi Gây Thù Ghét\n' +
    'Hành Vi Gian Lận, Lừa Đảo và Lừa Gạt\n' +
    'Hành Vi Gạ Gẫm Tình Dục Người Lớn Và Ngôn Ngữ Khiêu Dâm\n' +
    'Hành Động Tình Dục và Ảnh Khỏa Thân Người Lớn\n' +
    'Nội Dung Bạo Lực Và Phản Cảm\n' +
    'Sử Dụng Giấy Phép và Tài Sản Trí Tuệ Của Meta\n' +
    'Vi Phạm Quyền Riêng Tư\n' +
    'Xâm Phạm Quyền Sở Hữu Trí Tuệ Của Bên Thứ 3\n' +
    'Hàng Hóa, Dịch Vụ Bị Hạn Chế\n' +
    'Nội Dung, Sản Phẩm hoặc Dịch Vụ Vi Phạm Luật Pháp Nước Sở Tại: Việt Nam\n' +
    'Tính Toàn Vẹn Của Tài Khoản\n' +
    'Cam Đoan Về Danh Tính Thực\n' +
    'An Ninh Mạng\n' +
    'Hành Vi Gian Dối\n' +
    'Tưởng Nhớ\n' +
    'Thông Tin Sai Lệch\n' +
    'Spam\n' +
    'Biện Pháp Bảo Vệ Bổ Sung Cho Trẻ Vị Thành Niên\n\n' +
    'Yêu Cầu Người Dùng:\n' +
    'Chỉ trả về những dấu hiệu khá rõ ràng, không đưa ra lý do không rõ ràng thiếu cơ sở.\n' +
    'Chỉ trả về JSON object theo định dạng sau nếu có vi phạm:\n' +
    '{\n' +
    '  "hypothetical_violation_reason": "string - lý do chi tiết bằng tiếng Việt",\n' +
    '  "severity": "veryhigh" | "high" | "medium" | "low"\n' +
    '}\n' +
    'Không thêm bất kỳ text, markdown hay giải thích nào khác.';

  const [prompt, setPrompt] = useState(defaultPrompt);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [currentStatus, page, selectedPage]);

  // useEffect(() => {
  //   if (selectedPage) savePageConfig();
  // }, [autoHideEnabled, autoCorrectEnabled, confidenceThreshold]);

  useEffect(() => {
    if (selectedPage) {
      loadPageConfig(selectedPage);
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const userId = JSON.parse(user || '{}')?.user_id;
      if (!userId) {
        throw new Error('User ID not found');
      }

      const response = await axios.get(`${BaseUrl}/facebook-page-insight`, {
        params: {
          user_id: userId,
          page: 1,
          pageSize: 100,
        },
      });

      const connections = response.data.data.data;

      const monitoredPages: MonitoredPage[] =
        connections?.map((conn: any) => ({
          id: conn.id,
          facebook_fanpage_id: conn.facebook_fanpage_id,
          name: conn.name || 'Unnamed Page',
          avatarUrl: conn.image_url,
          followerCount: conn.follows || 0,
          isMonitored: useMonitoringStore.getState().getPageMonitoring(conn.id) ?? false,
        })) || [];

      setPages(monitoredPages);
      initializeMonitoring(monitoredPages.map((page) => page.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      console.error('Error fetching pages:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPosts = async () => {
    try {
      setLoadingPosts(true);
      if (!selectedPage) {
        setPosts([]);
        setTotalPages(1);
        setLoadingPosts(false);
        return;
      }
      const pageObj = pages.find((p) => p.id === selectedPage);
      if (!pageObj) {
        setPosts([]);
        setTotalPages(1);
        setLoadingPosts(false);
        return;
      }
      const response = await axios.post(
        `${BaseUrl}/facebook-post-list`,
        {
          facebook_fanpage_id: [pageObj.facebook_fanpage_id],
          content: '',
        },
        {
          params: {
            page,
            pageSize: 10,
          },
        }
      );
      const postsData = (response.data.data?.data || []).map((post: any) => ({
        post_id: post.facebook_post_id,
        page_name: post.page_name,
        created_at: post.created_at,
        status: post.status,
        message: post.content,
        moderation_result: post.moderation_result || null,
      }));
      setPosts(postsData);
      setTotalPages(Math.ceil((response.data.data?.totalCount || 0) / 10));
    } catch (err) {
      console.error('Error fetching posts:', err);
      setPosts([]);
      setTotalPages(1);
    } finally {
      setLoadingPosts(false);
    }
  };

  const buildModerationConfigPayload = () => {
    const userId = JSON.parse(localStorage.getItem('user') || '{}')?.user_id;
    const page = pages.find((p) => p.id === selectedPage);

    return {
      facebook_fanpage_id: page?.facebook_fanpage_id,
      user_id: userId,
      name: page?.name || 'Tên trang chưa rõ',
      description: 'Cấu hình kiểm duyệt nội dung',
      auto_moderation: autoHideEnabled,
      hide_post_violations: hidePost,
      edit_minor_content: editContent,
      notify_admin: notifyAdmin,
      admin_email: email,
      threshold: 90,
      prompt,
    };
  };

  const togglePageMonitoring = async (pageId: string) => {
    const targetPage = pages.find((page) => page.id === pageId);
    if (!targetPage) return;
    const originalState = targetPage.isMonitored;
    try {
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, isMonitored: !p.isMonitored } : p))
      );
      await setPageMonitoring(pageId, !originalState);
      setShowToggleConfirm(null);
    } catch (err) {
      console.error('Error toggling monitoring:', err);
      setPages((prev) =>
        prev.map((p) => (p.id === pageId ? { ...p, isMonitored: originalState } : p))
      );
      alert('Có lỗi xảy ra khi thay đổi trạng thái giám sát.');
    }
  };

  const loadPageConfig = async (pageId: string) => {
    try {
      const page = pages.find((p) => p.id === pageId);
      if (!page) return;
      const config = await getPageConfig(page.facebook_fanpage_id);

      if (config) {
        setAutoHideEnabled(config.auto_moderation ?? false);
        setHidePost(config.hide_post_violations ?? false);
        setEditContent(config.edit_minor_content ?? false);
        setNotifyAdmin(config.notify_admin ?? false);
        setEmail(config.admin_email || '');
        setPrompt(config.prompt || defaultPrompt);
        setVolume(config.threshold ?? 90);
      } else {
        setAutoHideEnabled(false);
        setAutoCorrectEnabled(false);
        setConfidenceThreshold(90);
        setPrompt(defaultPrompt);
      }
    } catch (err) {
      console.error('Error loading page config:', err);
    }
  };

  const savePageConfig = async () => {
    if (!selectedPage) return;

    try {
      setSavingConfig(true);
      const config = buildModerationConfigPayload();
      await updatePageConfig(config);
      alert('Cấu hình đã được lưu thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu cấu hình:', err);
      alert('Không thể lưu cấu hình.');
    } finally {
      setSavingConfig(false);
    }
  };

  const toggleAutoHide = async () => {
    // setLoadingAutoHide(true);
    // try {
    //   setAutoHideEnabled((prev) => !prev);
    //   await savePageConfig();
    // } catch (err) {
    //   console.error(err);
    //   setAutoHideEnabled((prev) => !prev);
    // } finally {
    //   setLoadingAutoHide(false);
    // }
    setAutoHideEnabled((prev) => !prev);
  };

  const toggleAutoCorrect = async () => {
    setLoadingAutoCorrect(true);
    try {
      setAutoCorrectEnabled((prev) => !prev);
      await savePageConfig();
    } catch (err) {
      console.error(err);
      setAutoCorrectEnabled((prev) => !prev);
    } finally {
      setLoadingAutoCorrect(false);
    }
  };

  const renderPagination = () => {
    const range = 2;
    const pagesArray = [];
    for (let i = Math.max(1, page - range); i <= Math.min(totalPages, page + range); i++) {
      pagesArray.push(i);
    }
    return pagesArray.map((num) => (
      <button
        key={num}
        onClick={() => setPage(num)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
          num === page ? 'bg-blue-100 text-blue-700 font-medium' : 'hover:bg-gray-100'
        }`}
      >
        {num}
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center overflow-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-7xl max-h-[95vh] overflow-auto relative">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl font-semibold">Kiểm duyệt nội dung</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✖
          </button>
        </div>
        <div className="p-6 max-w-7xl mx-auto">
          <div className="mb-1">
            <h1 className="text-2xl font-semibold mb-2">
              Kiểm duyệt tự động bài viết Facebook với AI
            </h1>
            {/* <p className="text-gray-600">
              Tự động giám sát và kiểm duyệt bài viết Facebook bằng AI
            </p> */}
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-5 h-5" />
                <p className="font-medium">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-blue-500" />
                  Facebook Pages
                </h2>

                <div className="space-y-4 max-h-[420px] overflow-y-auto">
                  {pages.map((page) => (
                    <div
                      key={page.id}
                      onClick={() => {
                        setSelectedPage(page.id);
                        setPage(1);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-colors cursor-pointer ${
                        selectedPage === page.id
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden">
                          {page.avatarUrl ? (
                            <img
                              src={page.avatarUrl}
                              alt={page.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                              {page.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="text-left min-w-0 flex-1">
                          <h3 className="font-medium">{page.name}</h3>
                          <p className="text-sm text-gray-500 truncate">
                            {page.followerCount
                              ? `${page.followerCount.toLocaleString()} followers`
                              : 'No follower data'}
                          </p>
                        </div>
                      </div>
                      <div className="ml-auto">
                        {showToggleConfirm === page.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePageMonitoring(page.id);
                              }}
                              className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-red-600"
                            >
                              {page.isMonitored ? 'Tạm dừng' : 'Kích hoạt'}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowToggleConfirm(null);
                              }}
                              className="px-3 py-1.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                            >
                              Hủy
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowToggleConfirm(page.id);
                            }}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors w-full sm:w-auto min-w-[120px] text-sm ${
                              page.isMonitored
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page.isMonitored ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Đang giám sát</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                <span>Đã tạm dừng</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 min-h-[calc(100vh-24rem)]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" />
                    Bài viết đã kiểm duyệt
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setCurrentStatus('all')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentStatus === 'all'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      onClick={() => setCurrentStatus('pending')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentStatus === 'pending'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Đang xử lý
                    </button>
                    <button
                      onClick={() => setCurrentStatus('approved')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentStatus === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Hợp lệ
                    </button>
                    <button
                      onClick={() => setCurrentStatus('violated')}
                      className={`px-3 py-1 rounded-lg text-sm ${
                        currentStatus === 'violated'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      Vi phạm
                    </button>
                  </div>
                </div>

                {loadingPosts ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  </div>
                ) : posts.length > 0 ? (
                  <div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 overflow-x-auto"
                    style={{
                      maxHeight: '490px',
                      minHeight: '160px',
                      overflowY: posts.length > 6 ? 'auto' : 'unset',
                    }}
                  >
                    {posts.map((post) => (
                      <div
                        key={post.post_id}
                        className="border rounded-lg bg-gray-50 hover:bg-white transition p-3 flex flex-col h-[150px] relative"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {post.page_avatar_url ? (
                              <img
                                src={post.page_avatar_url}
                                alt={post.page_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-gray-500 font-bold">
                                {post.page_name?.charAt(0)}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm truncate">{post.page_name}</div>
                            <div className="text-xs text-gray-400 truncate">
                              {new Date(post.created_at).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            {post.status === 'approved' ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : post.status === 'violated' ? (
                              <XCircle className="w-4 h-4 text-red-500" />
                            ) : (
                              <RefreshCw className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                        <div className="flex-1 flex items-center justify-center text-base text-gray-800 mb-2 text-center px-2">
                          <span>
                            {post.message.length > 90
                              ? `${post.message.slice(0, 90)}...`
                              : post.message}
                          </span>
                        </div>

                        <div className="flex justify-between items-center mt-auto">
                          <a
                            href={`https://facebook.com/${post.post_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-xs hover:underline"
                          >
                            Xem Trên Facebook
                          </a>
                          {post.status === 'violated' && (
                            <button className="text-green-600 text-xs hover:underline">
                              Phê duyệt
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <EyeOff className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Chưa có bài viết nào được kiểm duyệt</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex-1 overflow-y-auto p-6 bg-gray-100 rounded-lg shadow-sm">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h2 className="font-medium mb-3 flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-500" />
                      Cấu hình
                    </h2>

                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Tự động kiểm duyệt</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Tự động kiểm duyệt nội dung bài viết và bình luận
                        </p>
                      </div>
                      <button onClick={toggleAutoHide} className="flex items-center">
                        {autoHideEnabled ? (
                          // Bật
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-blue-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                            <circle cx="16" cy="12" r="2"></circle>
                          </svg>
                        ) : (
                          // Tắt
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                            <circle cx="8" cy="12" r="2"></circle>
                          </svg>
                        )}
                      </button>
                    </div>

                    <div>
                      <h3 className="font-medium mb-3 flex items-center gap-2">
                        <Route className="w-5 h-5 text-blue-500" />
                        Hành động tự động
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Tự động ẩn bài vi phạm</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Tự động ẩn bài viết khi phát hiện vi phạm
                            </p>
                          </div>
                          <button onClick={() => setHidePost(!hidePost)} className="text-gray-700">
                            {hidePost ? (
                              // Bật
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="16" cy="12" r="2"></circle>
                              </svg>
                            ) : (
                              // Tắt
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="8" cy="12" r="2"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Tự động sửa nội dung</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Tự động sửa các nội dung vi phạm nhẹ
                            </p>
                          </div>
                          <button
                            onClick={() => setEditContent(!editContent)}
                            className="text-gray-700"
                          >
                            {editContent ? (
                              // Bật
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="16" cy="12" r="2"></circle>
                              </svg>
                            ) : (
                              // Tắt
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="8" cy="12" r="2"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">Thông báo cho quản trị viên</p>
                            <p className="text-sm text-gray-600 mt-1">
                              Gửi email thông báo khi phát hiện vi phạm
                            </p>
                          </div>
                          <button
                            onClick={() => setNotifyAdmin(!notifyAdmin)}
                            className="text-gray-700"
                          >
                            {notifyAdmin ? (
                              // Bật
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-blue-500"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="16" cy="12" r="2"></circle>
                              </svg>
                            ) : (
                              // Tắt
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-10 h-10 text-gray-400"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                                <circle cx="8" cy="12" r="2"></circle>
                              </svg>
                            )}
                          </button>
                        </div>
                        {/* Phần Email quản trị viên */}
                        <div
                          className={`transition-all duration-1000 overflow-hidden ${
                            notifyAdmin ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'
                          }`}
                        >
                          <h3 className="font-medium mb-3 flex items-center gap-2">
                            <Send className="w-5 h-5 text-blue-500" />
                            Email quản trị viên
                          </h3>
                          <input
                            type="email"
                            className="w-full p-2 border rounded-lg text-gray-500"
                            placeholder="Nhập email quản trị viên"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* <div>
                      <label className="block font-medium mb-2">
                        Ngưỡng độ tin cậy để tự động xử lý
                      </label>
                      <div className="space-y-4">
                        <input
                          type="range"
                          min="80"
                          max="100"
                          step="5"
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          value={volume}
                          onChange={(e) => setVolume(Number(e.target.value))}
                        />
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-600 font-medium">80%</span>
                          <span className="text-blue-600 font-medium">85%</span>
                          <span className="text-blue-600 font-medium">90%</span>
                          <span className="text-gray-600">95%</span>
                          <span className="text-gray-600">100%</span>
                        </div>
                      </div>
                    </div> */}

                    <div>
                      <label className="block font-medium mb-2">Prompt kiểm duyệt</label>
                      <textarea
                        className="w-full p-3 border border-gray-200 rounded-lg h-48 font-mono text-sm"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      ></textarea>
                      <p className="text-xs text-gray-500 mt-1">
                        Prompt này sẽ được sử dụng để hướng dẫn AI kiểm duyệt nội dung
                      </p>
                    </div>

                    <div className="flex justify-end mt-5">
                      <button
                        className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
                        onClick={() => {
                          if (selectedPage) {
                            loadPageConfig(selectedPage);
                          }
                        }}
                      >
                        Hủy
                      </button>

                      <button
                        onClick={savePageConfig}
                        disabled={savingConfig}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-save w-4 h-4"
                        >
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        <span>Lưu thay đổi</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-4">Tích hợp trong tương lai</h2>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Zalo OA</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Tích hợp với Zalo Official Account để quản lý tin nhắn và thông báo
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <MessageSquare className="w-5 h-5" />
                      <span className="font-medium">Lark</span>
                    </div>
                    <p className="text-sm text-gray-500">
                      Tích hợp với Lark để quản lý tin nhắn và thông báo
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentModeration;
