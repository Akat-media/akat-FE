import React, { useState, useMemo, useEffect, lazy, Suspense, useCallback } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Loader2,
  FileText,
  Settings,
  Filter,
  ChevronDown,
  X,
  ImagePlus,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../constants';
import ContentModeration from '../components/content-management/post-managenment/ContentModeration.tsx';
import { FaThumbsUp, FaComment, FaShare, FaFacebook } from 'react-icons/fa';
import { useOnOutsideClick } from '../hook/use-outside.tsx';
import { Pagination } from 'antd';
import usePagination from '../hook/usePagination.tsx';
import { debounce } from 'lodash';
import defaultImage from '../../public/default-avatar.jpg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PostSchedule = lazy(() => import('../components/PostSchedule'));
const NewPostModal = lazy(() => import('../components/NewPostModal'));
const PageSelector = lazy(() => import('../components/PageSelector'));

function PostManagementPage() {
  const [loading, setLoading] = useState(false);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [selectedPostComments, setSelectedPostComments] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [showContentModeration, setShowContentModeration] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule' | 'utilities'>('content');
  const navigate = useNavigate();
  const [selectedFanpage, setSelectedFanpage] = useState<any>(null);
  const [showFanpageDropdown, setShowFanpageDropdown] = useState(false);
  const [fanpages, setFanpages] = useState<any[]>([]);
  const [total, setTotal] = useState<any>(0);
  const { currentPage, pageSize, handleChange, setCurrentPage, setPageSize } = usePagination(1, 12);
  const [selectedPost, setSelectedPost] = useState<{ content: string; images: string[] } | null>(
    null
  );
  const [setting, setSetting] = useState<any>(null);
  const [refresh, setRefresh] = useState<any>(null);
  const fetchPostsFromConnectedPages = async () => {
    try {
      setLoading(true);
      setError(null);
      const [pageResponse, resSetting] = await Promise.all([
        axios.get(`${BaseUrl}/facebook-page-insight`, {
          params: {
            user_id: JSON.parse(localStorage.getItem('user') || '{}')?.user_id,
          },
        }),
        axios.get(`${BaseUrl}/config-moderation`),
      ]);
      const pages = pageResponse.data.data.data || [];
      setSetting(resSetting.data.data || {});
      setFanpages(pages);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPostsFromConnectedPages();
  }, [refresh]);
  const handleCallPost = async () => {
    setLoading(true);
    try {
      let chosseFanpage = [];
      if (!selectedFanpage) {
        chosseFanpage = fanpages.map((page: any) => page.facebook_fanpage_id);
      } else {
        chosseFanpage.push(selectedFanpage.facebook_fanpage_id);
      }
      const postResponse = await axios.post(
        `${BaseUrl}/facebook-post-list`,
        {
          facebook_fanpage_id: chosseFanpage,
          content: search || '',
        },
        {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        }
      );
      setPosts(postResponse.data.data?.data || []);
      setTotal(postResponse.data.data?.totalCount || 0);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  const debouncedHandleCallPost = useCallback(
    debounce((value) => {
      setSearch(value);
    }, 1500),
    []
  );

  const fetchCommentsByPostId = async (postId: string, accessToken: string) => {
    try {
      setGlobalLoading(true);
      setError(null);
      const response = await axios.get(
        `https://graph.facebook.com/v22.0/${postId}/comments?access_token=${accessToken}`
      );
      setComments(response.data.data || []);
      setSelectedPostComments(postId);
    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error);
      toast.error('Không thể tải bình luận 😭');
      setTimeout(() => navigate('/moderation/posts'), 3000);
    } finally {
      setGlobalLoading(false);
    }
  };

  useEffect(() => {
    debouncedHandleCallPost(searchQuery);
    return () => {
      debouncedHandleCallPost.cancel();
    };
  }, [searchQuery]);

  useEffect(() => {
    if (fanpages.length > 0) {
      handleCallPost();
    }
  }, [fanpages, currentPage, pageSize, selectedFanpage, search]);

  const { innerBorderRef } = useOnOutsideClick(() => setShowFanpageDropdown(false));
  function getFirstImage(input: any) {
    if (!input || input.trim() === '') {
      return defaultImage;
    }
    try {
      const parsed = JSON.parse(input);
      console.log(parsed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed[0];
      }
    } catch (e) {
      if (typeof input === 'string' && input.startsWith('http')) {
        return input;
      }
    }

    return defaultImage;
  }
  function parseAvatarUrls(input: any): string[] {
    if (!input || typeof input !== 'string') return [];

    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      if (typeof input === 'string' && input.startsWith('http')) {
        return [input];
      }
    }

    return [];
  }

  return (
    <div className="px-6 py-4">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý bài đăng</h1>
            <p className="text-gray-600">Quản lý và kiểm duyệt nội dung bài đăng</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'content'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('content')}
            >
              <FileText className="w-4 h-4" />
              Nội dung
            </button>

            <button
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'schedule'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('schedule')}
            >
              <Calendar className="w-4 h-4" />
              Lịch đăng
            </button>

            <button
              className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                activeTab === 'utilities'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setActiveTab('utilities')}
            >
              <Settings className="w-4 h-4" />
              Tiện ích
            </button>
          </div>

          {activeTab === 'content' ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
                <div className="col-span-1 sm:col-span-1">
                  <div className="relative w-full">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bài viết..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <X
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 cursor-pointer"
                        size={20}
                      />
                    )}
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-1 relative">
                  <button
                    onClick={() => setShowFanpageDropdown((prev) => !prev)}
                    className="flex items-center justify-between w-full px-4 py-2 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <Filter size={18} />
                      <span
                        className="text-ellipsis overflow-hidden whitespace-nowrap block"
                        title={selectedFanpage?.name}
                      >
                        {selectedFanpage ? selectedFanpage.name : 'Chọn fanpage'}
                      </span>
                    </div>
                    <ChevronDown size={18} />
                  </button>
                  <div ref={innerBorderRef}>
                    {showFanpageDropdown && (
                      <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto right-0">
                        <ul className="h-[160px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                          <li
                            onClick={() => {
                              setSelectedFanpage(null);
                              setShowFanpageDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            Tất Cả
                          </li>
                          {fanpages?.map((fanpage) => (
                            <li
                              key={fanpage.id}
                              onClick={() => {
                                setSelectedFanpage(fanpage);
                                setShowFanpageDropdown(false);
                              }}
                              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${selectedFanpage?.id === fanpage.id ? 'bg-gray-100' : ''}`}
                              title={fanpage.name}
                            >
                              {fanpage.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-1 flex sm:justify-end">
                  <button
                    onClick={() => setShowPageSelector(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full sm:w-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Bài viết mới</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center text-center min-h-[60vh]">
                  <p className="text-red-500 text-lg height-100">{error}</p>
                </div>
              ) : posts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              getFirstImage(
                                fanpages?.find(
                                  (fanpage) =>
                                    fanpage?.facebook_fanpage_id == post?.facebook_fanpage_id
                                )?.image_url
                              ) || defaultImage
                            }
                            alt={post.page_name || 'Page Avatar'}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {post.page_name || 'Tên Fanpage'}
                            </h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="lucide lucide-clock w-3 h-3"
                                >
                                  <circle cx="12" cy="12" r="10" />
                                  <polyline points="12 6 12 12 16 14" />
                                </svg>
                                <span>{new Date(post.posted_at).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {post.post_avatar_url && (
                        <div
                          className="relative h-48 overflow-hidden cursor-pointer"
                          onClick={() => {
                            try {
                              const images = parseAvatarUrls(post.post_avatar_url);
                              setSelectedPost({
                                content: post.content,
                                images: Array.isArray(images) ? images : [post.post_avatar_url],
                              });
                            } catch (e) {
                              console.error('Error parsing post_avatar_url:', e);
                              setSelectedPost({
                                content: post.content,
                                images: parseAvatarUrls(post.post_avatar_url),
                              });
                            }
                          }}
                        >
                          <img
                            src={getFirstImage(post.post_avatar_url)}
                            alt="Post image"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                          {(() => {
                            try {
                              const images = parseAvatarUrls(post.post_avatar_url);
                              if (images.length > 1) {
                                return (
                                  <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                                    <ImagePlus className="w-4 h-4 text-gray-700" />
                                  </button>
                                );
                              }
                            } catch (e) {
                              console.error('Error parsing post_avatar_url:', e);
                            }
                            return null;
                          })()}
                        </div>
                      )}

                      {/* Content */}
                      <div
                        className="p-4 flex-1 flex items-center justify-center cursor-pointer"
                        onClick={() => {
                          try {
                            const images = JSON.parse(post.post_avatar_url);
                            setSelectedPost({
                              content: post.content,
                              images: Array.isArray(images) ? images : [post.post_avatar_url],
                            });
                          } catch (e) {
                            console.error('Error parsing post_avatar_url:', e);
                            setSelectedPost({
                              content: post.content,
                              images: post.post_avatar_url ? [post.post_avatar_url] : [],
                            });
                          }
                        }}
                      >
                        <p
                          className={`text-sm text-gray-800 break-words ${
                            post.post_avatar_url ? 'line-clamp-5' : ''
                          }`}
                        >
                          {post.content || '[Không có nội dung]'}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div
                          className="flex items-center gap-4"
                          onClick={() => {
                            const accessToken = fanpages.find(
                              (fanpage) => fanpage.facebook_fanpage_id === post.facebook_fanpage_id
                            )?.access_token;
                            if (accessToken) {
                              fetchCommentsByPostId(post.id, accessToken);
                            } else {
                              console.error('Không tìm thấy access_token cho fanpage này.');
                            }
                          }}
                        >
                          <div className="flex items-center gap-1 text-gray-500">
                            <FaThumbsUp className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.likes || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <FaComment className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.comments || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-500">
                            <FaShare className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.shares || 0}</span>
                          </div>
                        </div>
                        <a
                          href={`https://facebook.com/${post.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          <FaFacebook className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 min-h-60">
                  <p className="text-gray-500">Không tìm thấy bài viết nào</p>
                </div>
              )}
            </>
          ) : activeTab === 'schedule' ? (
            <Suspense fallback={<div>Loading...</div>}>
              <PostSchedule />
            </Suspense>
          ) : (
            <>
              <div className="p-6 bg-white">
                <h2 className="text-lg font-semibold mb-6">Tiện ích tự động hóa</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 bg-purple-50 rounded-xl">
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
                          className="lucide lucide-shield w-6 h-6 text-purple-600"
                        >
                          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium">Kiểm duyệt nội dung</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Tự động kiểm duyệt nội dung bài viết và bình luận bằng AI. Phát hiện và xử lý
                      các vi phạm tiêu chuẩn cộng đồng.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Đang hoạt động</span>
                      </div>
                      <button
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        onClick={() => setShowContentModeration(true)}
                      >
                        Cấu hình
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Phân trang */}
        {Boolean(total) && activeTab == 'content' && (
          <div className="mt-4">
            <Pagination
              total={total}
              onChange={handleChange}
              current={currentPage}
              pageSize={pageSize}
            />
          </div>
        )}

        {/* Modal them bai viet moi*/}
        {showPageSelector && (
          <Suspense fallback={<div>Loading...</div>}>
            <PageSelector
              onPageSelect={(page) => {
                setSelectedPage(page);
                setShowPageSelector(false);
                setShowPostModal(true);
              }}
              data={fanpages}
              onClose={() => setShowPageSelector(false)}
            />
          </Suspense>
        )}
        {showPostModal && (
          <Suspense fallback={<div>Loading...</div>}>
            <NewPostModal
              page={selectedPage}
              onClose={() => {
                setShowPostModal(false);
              }}
              onSuccess={() => {
                setSearch('');
                setCurrentPage(1);
              }}
            />
          </Suspense>
        )}
        {/* Modal tien ich: kiem duyet noi dung */}
        {showContentModeration && (
          <ContentModeration
            setRefresh={setRefresh}
            data={setting}
            onClose={() => setShowContentModeration(false)}
          />
        )}
      </div>

      {/* Modal xem chi tiết bài đăng */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPost(null);
            }
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Chi tiết bài đăng:</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedPost(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center justify-center mb-4">
              <p className="text-gray-800 text-sm text-center">
                {selectedPost.content || '[Không có nội dung]'}
              </p>
            </div>
            {selectedPost.images &&
              selectedPost.images.length > 0 &&
              (selectedPost.images.length === 1 ? (
                <div className="flex items-center justify-center">
                  <img
                    src={selectedPost.images[0]}
                    alt="Post image"
                    className="w-auto h-auto max-w-full max-h-[60vh] rounded-lg object-contain"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedPost.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Post image ${index + 1}`}
                      className="w-full h-auto rounded-lg object-cover"
                    />
                  ))}
                </div>
              ))}
          </div>
        </div>
      )}

      {globalLoading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[999]">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
        </div>
      )}

      {selectedPostComments && !loading && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPostComments(null);
            }
          }}
        >
          <div className="bg-white rounded-lg p-4 max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Bình luận:</h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setSelectedPostComments(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : comments.length > 0 ? (
              <ul className="space-y-4">
                {comments.map((comment, index) => (
                  <li
                    key={comment.id}
                    className={`pb-2 border-b px-3 py-2 rounded ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-20'
                    }`}
                  >
                    <div className="text-base font-semibold text-gray-800">
                      {comment.from?.name || 'Người dùng ẩn danh'}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{comment.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center text-gray-500">Không có bình luận nào</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default PostManagementPage;
