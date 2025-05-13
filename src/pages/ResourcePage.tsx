import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  MessageSquare,
  Eye,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2,
  Facebook,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Heart,
  MessageCircleHeart,
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { BaseUrl } from '../constants';
import usePagination from '../hook/usePagination.tsx';
import { Pagination } from 'antd';

interface StatCard {
  title: string;
  value: string | number;
  icon: React.ElementType;
  change?: {
    value: string;
    positive: boolean;
  };
  total?: string | number;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'yellow';
}

interface FacebookPage {
  id: string;
  name: string;
  verified: boolean;
  category: string;
  metrics: {
    followers: number;
    engagement: number;
    reach: number;
    responseRate: number;
    posts: number;
    likes: number;
  };
  status: string;
  image_url?: string;
  follows: number;
  interactions: number;
  approach: number;
  posts: number;
}

type DateRange = '7' | '30' | '90';

function StatCard({ title, value, icon: Icon, change, total, color }: StatCard) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-sm text-gray-600">{title}</span>
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{value}</span>
            {title === 'Followers' && total && (
              <span className="text-sm text-gray-500">(Tổng: {total})</span>
            )}
          </div>
          {change && (
            <div
              className={`flex items-center text-sm mt-1 ${
                change.positive ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change.positive ? (
                <ArrowUpRight className="w-4 h-4" />
              ) : (
                <ArrowDownRight className="w-4 h-4" />
              )}
              {change.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FacebookPageCard({ page, data }: { page: FacebookPage; data?: any }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/moderation/posts');
  };
  return (
    <div
      className="cursor-pointer bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors"
      onClick={handleClick}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {page.image_url ? (
              <img
                src={page.image_url}
                alt={page.name}
                className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Facebook className="w-7 h-7 text-white" />
              </div>
            )}

            {/* Page Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-medium text-gray-900 truncate">{page.name}</h3>
                {page.verified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>
                    {data
                      .find((item: any) => item.facebook_fanpage_id == page.id)
                      ?.follower_count?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>
                    {data
                      .find((item: any) => item.facebook_fanpage_id == page.id)
                      ?.fan_count?.toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{page.category}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="sm:ml-auto">
            <span
              className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                page.status === 'Hoạt động'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {page.status === 'Hoạt động' ? 'Hoạt động' : 'Không hoạt động'}
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <div className="font-medium">{page.metrics.followers.toLocaleString()}</div>
              <div className="text-xs text-gray-500">followers</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <MessageCircleHeart className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <div className="font-medium">{page.metrics.engagement.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tương tác</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <Eye className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <div className="font-medium">{page.metrics.reach.toLocaleString()}</div>
              <div className="text-xs text-gray-500">tiếp cận</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <FileText className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <div className="font-medium">{page.metrics.posts}</div>
              <div className="text-xs text-gray-500">bài viết</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourcePage() {
  const navigate = useNavigate();
  const user = localStorage.getItem('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState<string>('');
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [results, setResults] = useState<FacebookPage[]>([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [stats, setStats] = useState<StatCard[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [pageIds, setPageIds] = useState<string[]>([]);
  const getStats = async (ids = pageIds) => {
    try {
      const response = await axios.get(`${BaseUrl}/facebook-connection`, {
        params: {
          user_id: JSON.parse(user || '{}')?.user_id,
          status: 'connected',
        },
      });
      const data = response.data.data;
      setData(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  };
  const { currentPage, pageSize, handleChange, setCurrentPage, setPageSize } = usePagination(1, 2);
  const [total, setTotal] = useState<any>(0);

  const formatNumber = (price: any) => {
    if (!price) price = 0;
    const val: any = (price / 1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  // console.log(formatNumber(10000));
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
          page: currentPage,
          pageSize: pageSize,
        },
      });

      const connections = response.data.data.data;
      setTotal(response.data.data.totalCount || 0);

      const transformedPages: FacebookPage[] = connections?.map((conn: any) => ({
        id: conn.id,
        name: conn.name || 'Unnamed Page',
        verified: true,
        category: conn.category || 'Unknown',
        metrics: {
          followers: conn.follows || 0,
          likes: 0,
          engagement: conn.interactions || 0,
          reach: conn.approach || 0,
          responseRate: 94.8,
          posts: conn.posts || 0,
        },
        status: conn.status || 'Không hoạt động',
        image_url: conn.image_url,
        follows: conn.follows || 0,
        interactions: conn.interactions || 0,
        approach: conn.approach || 0,
        posts: conn.posts || 0,
      })) || [];

      setPages(transformedPages);
      setResults(transformedPages);
      const ids = transformedPages.map((page) => page.id);
      setPageIds(ids);

      // Cập nhật stats
      setStats([
        {
          title: 'Fanpages Đã Kết Nối',
          value: connections?.length || 0,
          icon: Facebook,
          color: 'blue',
        },
        {
          title: 'Tổng Số Người Theo Dõi',
          value: formatNumber(connections?.reduce((acc: any, cur: any) => acc + cur?.follows, 0)),
          icon: Users,
          color: 'green',
        },
        {
          title: 'Tổng Lượt Tương Tác',
          value: formatNumber(
            connections?.reduce((acc: any, cur: any) => acc + cur?.interactions, 0)
          ),
          icon: MessageCircleHeart,
          color: 'red',
        },
        {
          title: 'Tổng Lượt Tiếp Cận',
          value: formatNumber(connections?.reduce((acc: any, cur: any) => acc + cur?.approach, 0)),
          icon: Eye,
          color: 'yellow',
        },
        {
          title: 'Tổng Số Bài Đăng',
          value: formatNumber(connections?.reduce((acc: any, cur: any) => acc + cur?.posts, 0)),
          icon: FileText,
          color: 'purple',
        },
      ]);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const search = useCallback(
    async (searchQuery: string) => {
      try {
        setLoading(true);
        setError(null);

        const userId = JSON.parse(user || '{}')?.user_id;
        if (!userId) {
          throw new Error('User ID not found');
        }

        if (!searchQuery.trim()) {
          setResults(pages); // Hiển thị tất cả page khi query rỗng
          return;
        }

        const response = await axios.get(`${BaseUrl}/facebook-page-insight`, {
          params: {
            user_id: userId,
            query: searchQuery,
          },
        });

        const connections = response.data.data.data;

        const transformedResults: FacebookPage[] = connections?.map((conn: any) => ({
          id: conn.id,
          name: conn.name || 'Unnamed Page',
          verified: true,
          category: conn.category || 'Unknown',
          metrics: {
            followers: conn.follows || 0,
            likes: 0,
            engagement: conn.interactions || 0,
            reach: conn.approach || 0,
            responseRate: 94.8,
            posts: conn.posts || 0,
          },
          status: conn.status || 'Không hoạt động',
          image_url: conn.image_url,
          follows: conn.follows || 0,
          interactions: conn.interactions || 0,
          approach: conn.approach || 0,
          posts: conn.posts || 0,
        })) || [];

        setResults(transformedResults);

      } catch (error) {
        console.error('Error searching pages:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    },
    [pages, user]
  );


  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      search(searchQuery);
    }, 500),
    [search]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      debouncedSearch.cancel();
      search(query);
    }
  };

  useEffect(() => {
    fetchPages();
  }, [currentPage]);

  useEffect(() => {
    if (pageIds.length > 0) {
      getStats(pageIds);
    }
  }, [pageIds]);

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Quản lý tài nguyên</h1>
            <p className="text-gray-600">
              Tổng quan về hiệu suất và quản lý các trang Facebook đã kết nối
            </p>
          </div>
          <div className="sm:ml-auto">
            <div className="flex items-center gap-2 bg-white rounded-lg border p-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as DateRange)}
                className="text-sm border-0 focus:ring-0 w-full bg-transparent"
              >
                <option value="7">7 ngày gần nhất</option>
                <option value="30">30 ngày gần nhất</option>
                <option value="90">90 ngày gần nhất</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Facebook Pages Section */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
          <h2 className="text-lg font-semibold">Facebook Pages đã kết nối</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Tìm kiếm trang..."
                value={query}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              />
            </div>
            <button
              onClick={() => setShowExport(true)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Xuất</span>
            </button>
            <button
              onClick={() => {
                setShowAddPage(true);
                navigate('/connection');
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center gap-2 hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Page</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-3">
            {results.map((page) => (
              <FacebookPageCard key={page.id} page={page} data={data} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Facebook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy trang nào</p>
          </div>
        )}

        <div className="mt-4">
          <Pagination
            total={total}
            onChange={handleChange}
            current={currentPage}
            pageSize={pageSize}
          />
        </div>
      </div>

      {/* Modals */}
      {/* {showAddPage && <AddPageModal onClose={() => setShowAddPage(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />} */}
    </div>
  );
}

export default ResourcePage;
