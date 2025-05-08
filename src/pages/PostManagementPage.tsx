import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import {
  Search,
  Plus,
  Calendar,
  Loader2,
  FileText,
  Settings,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../constants';
import ContentModeration from '../components/content-management/post-managenment/ContentModeration.tsx';
import { FaThumbsUp, FaComment, FaShare, FaFacebook } from 'react-icons/fa';

const PostSchedule = lazy(() => import('../components/PostSchedule'));
const NewPostModal = lazy(() => import('../components/NewPostModal'));
const PageSelector = lazy(() => import('../components/PageSelector'));

function PostManagementPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'violated'>('all');
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
  const postsPerPage = 9;
  const navigate = useNavigate();

  const [selectedFanpage, setSelectedFanpage] = useState<any>(null);
  const [showFanpageDropdown, setShowFanpageDropdown] = useState(false);
  const [fanpages, setFanpages] = useState<any[]>([]);

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
  // Fetch danh sách fanpage khi component được mount
  useEffect(() => {
    const fetchFanpages = async () => {
      try {
        const response = await axios.get(`${BaseUrl}/facebook-page-insight`, {
          params: {
            user_id: JSON.parse(localStorage.getItem('user') || '{}')?.user_id,
          },
        });
        setFanpages(response.data.data || []);
      } catch (err) {
        console.error('Lỗi khi tải danh sách fanpage:', err);
      }
    };
    fetchFanpages();
  }, []);

  useEffect(() => {
    fetchPostsFromConnectedPages();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return posts
      .filter(
        (post) =>
          (!selectedFanpage || post.page_id === selectedFanpage.id) && // Lọc theo fanpage
          ((post.content || '').toLowerCase().includes(query) ||
            (post.page_name || '').toLowerCase().includes(query))
      )
      .sort((a, b) => new Date(b.posted_at).getTime() - new Date(a.posted_at).getTime());
  }, [posts, searchQuery, selectedFanpage]);

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
                  {showFanpageDropdown && (
                    <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto right-0">
                      <ul>
                        <li
                          onClick={() => {
                            setSelectedFanpage(null);
                            setShowFanpageDropdown(false);
                          }}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          Tất Cả
                        </li>
                        {fanpages.map((fanpage) => (
                          <li
                            key={fanpage.id}
                            onClick={() => {
                              setSelectedFanpage(fanpage);
                              setShowFanpageDropdown(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            title={fanpage.name}
                          >
                            {fanpage.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
              ) : currentPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                  {currentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
                    >
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <img
                            src={post.page_avatar_url || '/public/default-avatar.jpg'}
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

                      {/* Image */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={post.post_avatar_url || '/public/default-avatar.jpg'}
                          alt="Post image"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
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
                            className="lucide lucide-bookmark w-4 h-4 text-gray-700"
                          >
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4 flex-1">
                        <p className="text-sm text-gray-800 line-clamp-3 mb-3">
                          {post.content || '[Không có nội dung]'}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
          <div className="flex items-center justify-between px-4 py-2">
            <p className="text-sm text-gray-700">
              Hiển thị <span className="font-medium">{indexOfFirstPost + 1}</span> đến{' '}
              <span className="font-medium">{Math.min(indexOfLastPost, filteredPosts.length)}</span>{' '}
              trong tổng số <span className="font-medium">{filteredPosts.length}</span> bài viết
            </p>
            <nav aria-label="Page navigation example" className="flex">
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
          <NewPostModal
            page={selectedPage}
            onClose={() => {
              setShowPostModal(false);
            }}
          />
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
