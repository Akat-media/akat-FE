import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Heart,
  Share2,
  FileText,
  Settings,
} from 'lucide-react';
import PostSchedule from '../components/PostSchedule';
import NewPostModal from '../components/NewPostModal';
import PageSelector from '../components/PageSelector';
import { create } from 'domain';
import ContentModeration from '../components/content-management/post-managenment/ContentModeration.tsx';

function PostManagementPage() {
  const [loading] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [showContentModeration, setShowContentModeration] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [dateRange, setDateRange] = useState<'7' | '30' | '60'>('30');
  const [filterStatus] = useState<'all' | 'approved' | 'violated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule' | 'utilities'>('content');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);
  return (
    <div className="px-6 py-4">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý bài đăng</h1>
            <p className="text-gray-600">Quản lý và kiểm duyệt nội dung bài đăng</p>
          </div>
          <div className="sm:ml-auto flex flex-col sm:flex-row gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7' | '30' | '60')}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm appearance-none bg-no-repeat bg-right pr-8"
              style={{
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>')`,
                backgroundPosition: 'calc(100% - 0.75rem) center',
                backgroundSize: '1rem',
              }}
            >
              <option value="7">7 ngày qua</option>
              <option value="30">30 ngày qua</option>
              <option value="60">60 ngày qua</option>
            </select>
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
              <div className="flex flex-col sm:flex-row gap-4">
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
                <div className="flex gap-3">
                  <div className="relative">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
                      <Filter size={18} />
                      <span>
                        {filterStatus === 'all'
                          ? 'Tất cả'
                          : filterStatus === 'approved'
                            ? 'Đã duyệt'
                            : 'Vi phạm'}
                      </span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
                    <Calendar size={18} />
                    <span>Lọc theo ngày</span>
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : posts.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {currentPosts.map((post) => (
                    <div key={post.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={post.page.avatar}
                          alt={post.page.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{post.page.name}</h3>
                            <span className="text-gray-500">•</span>
                            <span className="text-sm text-gray-500">
                              {new Date(post.created_at).toLocaleString()}
                            </span>
                            {post.status === 'approved' ? (
                              <span className="flex items-center gap-1 text-green-600 text-sm">
                                <CheckCircle className="w-4 h-4" />
                                Đã duyệt
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-red-600 text-sm">
                                <XCircle className="w-4 h-4" />
                                Vi phạm
                              </span>
                            )}
                          </div>
                          {/* <p className="text-gray-800 mb-3">{post.content}</p> */}
                          {post.isFacebook ? (
                            <div
                              className="mb-3"
                              dangerouslySetInnerHTML={{
                                __html: `<iframe src="https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fpermalink.php%3Fstory_fbid%3Dpfbid0SjauP5yhMf4S1xCrFTRhnv1ZFQrYH2pdB4YYyB9Twx5aSH7qrsmaRwhZz8yP9a6cl%26id%3D61571645674323&show_text=true&width=500" width="500" height="571" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>`,
                              }}
                            />
                          ) : (
                            <p className="text-gray-800 mb-3">{post.content}</p>
                          )}

                          {post.status === 'violated' && post.violation && (
                            <div className="mb-3 p-3 bg-red-50 rounded-lg">
                              <div className="flex items-center gap-2 text-red-700 mb-1">
                                <XCircle className="w-4 h-4" />
                                <span className="font-medium">{post.violation.type}</span>
                              </div>
                              <p className="text-sm text-red-600">{post.violation.reason}</p>
                            </div>
                          )}
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm">{post.metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm">{post.metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm">{post.metrics.shares}</span>
                            </div>
                          </div>
                        </div>
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <Eye className="w-5 h-5" />
                        </button>
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
            <PostSchedule />
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
          <PageSelector
            onPageSelect={(page) => {
              setSelectedPage(page);
              setShowPageSelector(false);
              setShowPostModal(true);
            }}
            onClose={() => setShowPageSelector(false)}
          />
        )}

        {showPostModal && selectedPage && (
          <NewPostModal
            page={selectedPage}
            onClose={() => {
              setShowPostModal(false);
              setSelectedPage(null);
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
