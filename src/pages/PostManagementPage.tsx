import React, { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { Search, Plus, Calendar, Loader2, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BaseUrl } from '../constants';

const PostSchedule = lazy(() => import('../components/PostSchedule'));
const NewPostModal = lazy(() => import('../components/NewPostModal'));
const PageSelector = lazy(() => import('../components/PageSelector'));

function PostManagementPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPageSelector, setShowPageSelector] = useState(false);
  const [posts, setPosts] = useState<any[]>([]);
  const [showPostModal, setShowPostModal] = useState(false);
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'content' | 'schedule'>('content');
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
          ) : (
            <Suspense fallback={<div>Loading...</div>}>
              <PostSchedule />
            </Suspense>
          )}
        </div>
      </div>
    </div>
  );
}

export default PostManagementPage;
