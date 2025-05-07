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
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PostSchedule = lazy(() => import('../components/PostSchedule'));
const NewPostModal = lazy(() => import('../components/NewPostModal'));
const PageSelector = lazy(() => import('../components/PageSelector'));

function PostManagementPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule'>('content');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;
  const navigate = useNavigate();

  const posts = [
    {
      id: 1,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Mẫu váy mới về, chất liệu cotton 100%, giá chỉ 299k. Inbox để được tư vấn ngay!',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
      isFacebook: true,
    },
    {
      id: 2,
      page: {
        name: 'Fashion Shop',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Săn sale cuối tuần - Giảm giá sốc toàn bộ sản phẩm',
      status: 'violated',
      violation: {
        type: 'Spam',
        reason: 'Nội dung quảng cáo lặp lại nhiều lần',
      },
      metrics: {
        likes: 123,
        comments: 34,
        shares: 5,
      },
      created_at: '2024-03-22T14:20:00Z',
      isFacebook: false,
      facebookUrl:
        'https://www.facebook.com/permalink.php?story_fbid=pfbid02V4MEHxRRXt25dQPDViRJ4AG9vZYonC87Q1AXmVK11Rs5G2U8R1jPuzybHYvdZVi1l&id=61571645674323',
    },
    {
      id: 3,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Test nội dung bài viết',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 4,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content:
        'Còn gái ơi, đừng bỏ lỡ mẫu váy mới về nhé! Chất liệu cotton 100%, giá chỉ 299k. Inbox để được tư vấn ngay!',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 5,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Ra mắt bộ sưu tập mới - Giảm giá 20% cho đơn hàng đầu tiên',
      status: 'violated',
      violation: {
        type: 'Spam',
        reason: 'Nội dung quảng cáo quá vip, đối thủ bán k lại',
      },
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 6,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Siêu phẩm mới về - Chất liệu cotton 100%, giá chỉ 499k. Inbox để được tư vấn ngay!',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 7,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Cú sốc đầu tuần - Giảm giá 50% cho đơn hàng đầu tiên',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 8,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content: 'Chúng tôi đã có mặt tại đây - Giảm giá 30% cho đơn hàng đầu tiên',
      status: 'approved',
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 9,
      page: {
        name: 'Fashion Shop',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content:
        'Siêu phẩm vừa hạ cánh - Chất liệu cotton 100%, giá chỉ 399k. Inbox để được tư vấn ngay!',
      status: 'violated',
      violation: {
        type: 'Spam',
        reason: 'Sản phẩm mới quá vip, đối thủ lùa không kịp',
      },
      metrics: {
        likes: 369,
        comments: 86,
        shares: 102,
      },
      created_at: '2024-03-22T15:30:00Z',
    },
    {
      id: 10,
      page: {
        name: 'Thỏ Store',
        avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
      },
      content:
        'Đẹp vl mở bát cho mùa hè cháy khét lẹt 2025, duy nhất 30 slot giá 199k. Sau đó sẽ về lại giá 399k, anh chị em tranh thủ nhé!!!',
      status: 'violated',
      violation: {
        type: 'Bán láo',
        reason: 'Giá ảo, có dấu hiệu lừa đảo người tiêu dùng',
      },
      metrics: {
        like: 357,
        comments: 86,
        shares: 98,
      },
      created_at: '2024-03-22T15:30:00Z',
      isFacebook: false,
    },
  ];

  const filteredPosts = useMemo(
    () => posts.filter((post) => post.content.toLowerCase().includes(searchQuery.toLowerCase())),
    [posts, searchQuery]
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  // const handlePostClick = (post: any) => {
  //   setSelectedPage(post);
  //   setShowPostModal(true);
  //   window.history.pushState({}, '', `/moderation/post/${post.id}`);
  // };

  // const closeModal = () => {
  //   setShowPostModal(false);
  //   setSelectedPage(null);
  //   window.history.pushState({}, '', '/moderation/posts');
  // };

  useEffect(() => {
    const handlePopState = () => {
      setShowPostModal(false);
      setSelectedPage(null);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
                          src={post.page.avatar}
                          alt={post.page.name}
                          className="w-12 h-12 rounded-lg object-cover"
                          loading="lazy"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{post.page.name}</h3>
                          <p className="text-gray-800 mb-3">{post.content}</p>
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
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <PostSchedule />
            </Suspense>
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

        {/* Modal */}
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
      </div>
    </div>
  );
}
export default PostManagementPage;
