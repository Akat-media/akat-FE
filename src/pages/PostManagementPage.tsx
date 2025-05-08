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
  Grid,
  List,
  Clock,
  Bookmark,
  MoreVertical,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react';
import PostSchedule from '../components/PostSchedule';
import NewPostModal from '../components/NewPostModal';
import PageSelector from '../components/PageSelector';
import IdeasBoard from '../components/IdeasBoard';
import ContentLibrary from '../components/ContentLibrary';
import PostList from '../components/PostList';
import { Post, Page } from '../types/post';

function PostManagementPage() {
  const [loading] = useState(false);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [dateRange, setDateRange] = useState<'7' | '30' | '60'>('30');
  const [filterStatus, setFilterStatus] = useState<'all' | 'approved' | 'violated'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule' | 'ideas' | 'library'>(
    'content'
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      content: 'Mẫu váy mới về, chất liệu cotton 100%, giá chỉ 299k. Inbox để được tư vấn ngay!',
      media: ['https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg'],
      status: 'published',
      createdAt: '2024-03-22T15:30:00Z',
      page: {
        id: '1',
        name: 'Thỏ Store',
        avatar: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
      },
      metrics: {
        likes: 245,
        comments: 56,
        shares: 12,
      },
    },
    {
      id: 2,
      content: 'Săn sale cuối tuần - Giảm giá sốc toàn bộ sản phẩm',
      media: ['https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg'],
      status: 'draft',
      createdAt: '2024-03-22T14:20:00Z',
      page: {
        id: '2',
        name: 'Fashion Shop',
        avatar: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
      },
      metrics: {
        likes: 123,
        comments: 34,
        shares: 5,
      },
    },
    {
      id: 3,
      content:
        'Bộ sản phẩm chăm sóc da mới nhất đã có mặt tại cửa hàng. Giảm 20% cho 50 khách hàng đầu tiên đặt mua online!',
      media: ['https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg'],
      status: 'scheduled',
      createdAt: '2024-03-21T09:15:00Z',
      page: {
        id: '3',
        name: 'Beauty Care',
        avatar: 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg',
      },
      metrics: {
        likes: 189,
        comments: 42,
        shares: 15,
      },
    },
  ]);

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (status: 'all' | 'approved' | 'violated') => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const handleEditPost = (post: Post) => {
    console.log('Edit post:', post);
  };

  const handleDeletePost = (post: Post) => {
    console.log('Delete post:', post);
  };

  const handleSchedulePost = (post: Post) => {
    console.log('Schedule post:', post);
  };

  const handleSavePost = (post: Post) => {
    console.log('Save post:', post);
    setPosts([...posts, post]);
    setIsNewPostModalOpen(false);
  };

  return (
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
              activeTab === 'ideas'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('ideas')}
          >
            <Lightbulb className="w-4 h-4" />Ý tưởng
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'library'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('library')}
          >
            <ImageIcon className="w-4 h-4" />
            Thư viện
          </button>
        </div>

        {activeTab === 'content' && (
          <>
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-3">
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={toggleFilterDropdown}
                    >
                      <Filter size={18} className="text-gray-500" />
                      <span className="font-medium">
                        {filterStatus === 'all'
                          ? 'Tất cả'
                          : filterStatus === 'approved'
                            ? 'Đã duyệt'
                            : 'Vi phạm'}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`text-gray-500 transition-transform duration-200 ${showFilterDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {showFilterDropdown && (
                      <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                        <div className="p-1">
                          <button
                            onClick={() => handleFilterSelect('all')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Tất cả
                          </button>
                          <button
                            onClick={() => handleFilterSelect('approved')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'approved' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Đã duyệt
                          </button>
                          <button
                            onClick={() => handleFilterSelect('violated')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'violated' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Vi phạm
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <Calendar size={18} className="text-gray-500" />
                    <span className="font-medium">Lọc theo ngày</span>
                  </button>
                  <button
                    onClick={toggleViewMode}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    title={
                      viewMode === 'list'
                        ? 'Chuyển sang chế độ lưới'
                        : 'Chuyển sang chế độ danh sách'
                    }
                  >
                    {viewMode === 'list' ? (
                      <Grid size={18} className="text-gray-500" />
                    ) : (
                      <List size={18} className="text-gray-500" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : posts.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                      >
                        {/* Post Header */}
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <img
                              src={post.page.avatar}
                              alt={post.page.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-gray-900 truncate">
                                {post.page.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              {post.status === 'approved' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                  <CheckCircle className="w-3 h-3" />
                                  <span>Đã duyệt</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                  <XCircle className="w-3 h-3" />
                                  <span>Vi phạm</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Post Image */}
                        {post.media && post.media.length > 0 && (
                          <div className="relative h-48 overflow-hidden">
                            <img
                              src={post.media[0]}
                              alt="Post image"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                            <button className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full hover:bg-white transition-colors">
                              <Bookmark className="w-4 h-4 text-gray-700" />
                            </button>
                          </div>
                        )}

                        {/* Post Content */}
                        <div className="p-4">
                          <p className="text-sm text-gray-800 line-clamp-3 mb-3">{post.content}</p>

                          {post.status === 'violated' && post.violation && (
                            <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-xs">
                              <div className="flex items-center gap-1 text-red-700 mb-1">
                                <XCircle className="w-3 h-3" />
                                <span className="font-medium">{post.violation.type}</span>
                              </div>
                              <p className="text-sm text-red-600">{post.violation.reason}</p>
                            </div>
                          )}
                        </div>

                        {/* Post Footer */}
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1 text-gray-500">
                              <Heart className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{post.metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <MessageSquare className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{post.metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1 text-gray-500">
                              <Share2 className="w-3.5 h-3.5" />
                              <span className="text-xs font-medium">{post.metrics.shares}</span>
                            </div>
                          </div>
                          <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 bg-white">
                  {posts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={post.page.avatar}
                            alt={post.page.name}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{post.page.name}</h3>
                              <span className="text-gray-400">•</span>
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{new Date(post.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="ml-auto">
                                {post.status === 'approved' ? (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-green-50 text-green-600 text-xs font-medium rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    Đã duyệt
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded-full">
                                    <XCircle className="w-3 h-3" />
                                    Vi phạm
                                  </span>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-800 mb-3">{post.content}</p>

                            {post.status === 'violated' && post.violation && (
                              <div className="mb-3 p-4 bg-red-50 border border-red-100 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700 mb-1">
                                  <XCircle className="w-4 h-4" />
                                  <span className="font-medium">{post.violation.type}</span>
                                </div>
                                <p className="text-sm text-red-600">{post.violation.reason}</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {post.media && post.media.length > 0 && (
                          <div className="ml-16 grid grid-cols-1 gap-2 mb-3">
                            <img
                              src={post.media[0]}
                              alt="Post image"
                              className="rounded-lg w-full max-w-md h-48 object-cover"
                            />
                          </div>
                        )}

                        <div className="ml-16 flex items-center justify-between">
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                              <Heart className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.metrics.likes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 hover:text-blue-500 transition-colors cursor-pointer">
                              <MessageSquare className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.metrics.comments}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-500 hover:text-green-500 transition-colors cursor-pointer">
                              <Share2 className="w-4 h-4" />
                              <span className="text-sm font-medium">{post.metrics.shares}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://facebook.com/${post.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Xem trên Facebook</span>
                            </a>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-gray-50">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">Không tìm thấy bài viết nào</p>
                <p className="text-gray-400 text-sm mt-1">
                  Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'schedule' && <PostSchedule />}

        {activeTab === 'ideas' && <IdeasBoard />}

        {activeTab === 'library' && <ContentLibrary />}
      </div>

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
          onSave={handleSavePost}
        />
      )}
    </div>
  );
}

export default PostManagementPage;
