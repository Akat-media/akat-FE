import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Loader2,
  FileText,
  // CheckCircle,
  // ChevronDown,
  // Filter,
  // XCircle,
  // Eye,
  // MessageSquare,
  // Heart,
  // Share2,
  Settings,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../constants';

const PostSchedule = lazy(() => import('../components/PostSchedule'));
const NewPostModal = lazy(() => import('../components/NewPostModal'));
const PageSelector = lazy(() => import('../components/PageSelector'));
import { create } from 'domain';
import ContentModeration from '../components/content-management/post-managenment/ContentModeration.tsx';

function PostManagementPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [showContentModeration, setShowContentModeration] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule' | 'utilities'>('content');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const navigate = useNavigate();

  const fetchPostsFromConnectedPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const pageResponse = await axios.get(`${BaseUrl}/facebook-page-insight`, {
        params: {
          user_id: JSON.parse(localStorage.getItem('user') || '{}')?.user_id,
        },
      });

      const pages = pageResponse.data.data || [];
      const fanpageIds = pages.map((page: any) => page.facebook_fanpage_id);

      if (fanpageIds.length === 0) {
        setPosts([]);
        return;
      }

      const postResponse = await axios.post(`${BaseUrl}/facebook-post-list`, {
        facebook_fanpage_id: fanpageIds,
      });
      console.log('Post response data:', postResponse.data);
      setPosts(postResponse.data.data?.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách bài viết:', err);
      setError('Không thể tải bài viết. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostsFromConnectedPages();
  }, []);

  const filteredPosts = useMemo(
    () =>
      posts.filter((post) =>
        (post.content || '').toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [posts, searchQuery]
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="px-6 py-4">
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý bài đăng</h1>
            <p className="text-gray-600">Quản lý và kiểm duyệt nội dung bài đăng</p>
          </div>
          <div className="sm:ml-auto flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setShowPageSelector(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              <span>Bài viết mới</span>
            </button>
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
              <div className="flex flex-col sm:flex-row gap-4 p-4">
                <div className="relative flex-grow">
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
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : currentPosts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/moderation/post/${post.id}`)}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={post.post_avatar_url || 'fallback-avatar.jpg'}
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{post.page?.name || '???'}</h3>
                          <p className="text-gray-800 mb-3">
                            {post.content || '[Không có nội dung]'}
                          </p>
                          {post.image_url && (
                            <img
                              src={post.image_url}
                              alt="Post"
                              className="w-full h-auto rounded-lg mb-3"
                              loading="lazy"
                            />
                          )}
                          <div className="flex items-center gap-4 text-gray-600 text-sm">
                            <span className="text-blue-500">{post.likes || 0} lượt thích</span>
                            <span className="text-green-500">{post.comments || 0} bình luận</span>
                            <span className="text-orange-500">{post.shares || 0} lượt chia sẻ</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
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
        {activeTab === 'content' && (
          <nav aria-label="Page navigation example" className="flex justify-center mt-4">
            <ul className="flex items-center -space-x-px h-10 text-base">
              {/* Nút Previous */}
              <li>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <li key={page}>
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`flex items-center justify-center px-4 h-10 leading-tight ${
                      currentPage === page
                        ? 'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                        : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                    currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-3 h-3 rtl:rotate-180"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
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
              onClose={() => setShowPageSelector(false)}
            />
          </Suspense>
        )}

        {showPostModal && selectedPage && (
          <Suspense fallback={<div>Loading...</div>}>
            <NewPostModal
              page={selectedPage}
              onClose={() => {
                setShowPostModal(false);
                setSelectedPage(null);
              }}
            />
          </Suspense>
        )}

        {/* Modal tien ich: kiem duyet noi dung */}
        {showContentModeration && (
          <ContentModeration onClose={() => setShowContentModeration(false)} />
        )}
      </div>
    </div>
  );
}

export default PostManagementPage;
