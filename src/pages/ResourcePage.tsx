import React, { useState, useEffect } from 'react';
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
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { BaseUrl } from '../constants';
import { useNavigate } from 'react-router-dom';

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

function FacebookPageCard({ page }: { page: FacebookPage }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/moderation/posts');
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors"
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
                  <span>{page.metrics.followers.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Heart className="w-4 h-4" />
                  <span>{page.metrics.likes.toLocaleString()}</span>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [stats, setStats] = useState<StatCard[]>([]);
  const [pageIds, setPageIds] = useState<string[]>([]);

  const getStats = async (ids = pageIds) => {
    try {
      const response = await axios.post(`${BaseUrl}/resources`, {
        user_id: JSON.parse(user || '{}')?.user_id,
        facebook_fanpage_id: ids,
      });

      const data = response.data.data;

      setStats([
        {
          title: 'Fanpages Đã Kết Nối',
          value: data.fanpage_count,
          icon: Facebook,
          color: 'blue',
        },
        {
          title: 'Tổng Số Người Theo Dõi',
          value: data.follower_count.toLocaleString(),
          icon: Users,
          total: data.fan_count.toLocaleString(),
          color: 'green',
        },
        {
          title: 'Tổng Lượt Tương Tác',
          value: data.interactions.toLocaleString(),
          icon: MessageCircleHeart,
          color: 'red',
        },
        {
          title: 'Tổng Lượt Tiếp Cận',
          value: data.approach.toLocaleString(),
          icon: Eye,
          color: 'yellow',
        },
        {
          title: 'Tổng Số Bài Đăng',
          value: data.posts,
          icon: FileText,
          color: 'purple',
        },
      ]);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch stats');
    }
  };

  useEffect(() => {
    if (pageIds.length > 0) {
      getStats(pageIds);
    }
  }, [pageIds]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${BaseUrl}/facebook-page-insight`, {
        params: {
          user_id: JSON.parse(user || '{}')?.user_id,
        },
      });

      const connections = response.data.data;

      const transformedPages: FacebookPage[] =
        connections?.map((conn: any) => ({
          id: conn.facebook_fanpage_id,
          name: conn.name || 'Unnamed Page',
          verified: true,
          category: conn.category || 'Unknown',
          metrics: {
            followers: conn.follows || 0,
            likes: 0,
            engagement: conn.interactions,
            reach: conn.approach,
            responseRate: 94.8,
            posts: conn.posts,
          },
          status: conn.status,
          image_url: conn.image_url,
        })) || [];

      setPages(transformedPages);

      const ids = transformedPages.map((page) => page.id);
      setPageIds(ids);
    } catch (err) {
      console.error('Error fetching pages:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pages');
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
        ) : filteredPages.length > 0 ? (
          <div className="space-y-3">
            {filteredPages.map((page) => (
              <FacebookPageCard key={page.id} page={page} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Facebook className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Không tìm thấy trang nào</p>
          </div>
        )}
      </div>

      {/* Modals */}
      {/* {showAddPage && <AddPageModal onClose={() => setShowAddPage(false)} />}
      {showExport && <ExportModal onClose={() => setShowExport(false)} />} */}
    </div>
  );
}

export default ResourcePage;
