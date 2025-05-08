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
  Instagram,
  DollarSign,
  Filter,
  ChevronDown,
  MoreVertical,
  XCircle,
  Receipt,
  CreditCard,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  status: 'active' | 'inactive';
  avatar?: string;
}

interface Account {
  id: number;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  type: 'instagram' | 'ad';
  lastSync: string;
  metrics?: {
    followers?: number;
    posts?: number;
    spend?: number;
  };
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  paymentMethod: string;
  campaignName: string;
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
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:bg-gray-50 transition-colors">
      <div className="p-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            {page.avatar ? (
              <img
                src={page.avatar}
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
                page.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {page.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
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
            <div className="p-2 bg-orange-50 rounded-lg">
              <MessageSquare className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <div className="font-medium">{page.metrics.responseRate.toFixed(1)}%</div>
              <div className="text-xs text-gray-500">phản hồi</div>
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
  const [activeTab, setActiveTab] = useState<'facebook' | 'instagram' | 'ads'>('facebook');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [pages, setPages] = useState<FacebookPage[]>([]);
  const [showAddPage, setShowAddPage] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'connected' | 'disconnected' | 'error'>(
    'all'
  );
  const [activeSubTab, setActiveSubTab] = useState<'accounts' | 'billing'>('accounts');

  // Stats for the dashboard based on date range
  const getStats = (range: DateRange): StatCard[] => {
    // In a real app, these values would be calculated based on the date range
    const multiplier = range === '7' ? 0.7 : range === '90' ? 1.3 : 1;

    return [
      {
        title: 'Facebook Pages',
        value: '3',
        icon: Facebook,
        change: { value: '+1', positive: true },
        color: 'blue',
      },
      {
        title: 'Người Theo Dõi',
        value: Math.round(411 * multiplier),
        icon: Users,
        change: { value: '+5.2%', positive: true },
        total: '1.2M',
        color: 'green',
      },
      {
        title: 'Lượt Tương Tác',
        value: Math.round(124 * multiplier),
        icon: MessageCircleHeart,
        change: { value: '+12.3%', positive: true },
        color: 'red',
      },
      {
        title: 'Lượt Tiếp Cận',
        value: Math.round(3452 * multiplier).toLocaleString(),
        icon: Eye,
        change: { value: '+8.1%', positive: true },
        color: 'green',
      },
      {
        title: 'Tỷ Lệ Phản Hồi',
        value: '92.5%',
        icon: MessageSquare,
        change: { value: '-2.4%', positive: false },
        color: 'yellow',
      },
      {
        title: 'Tổng Số Bài Đăng',
        value: Math.round(85 * multiplier),
        icon: FileText,
        change: { value: '+15.2%', positive: true },
        color: 'purple',
      },
    ];
  };

  const [stats, setStats] = useState<StatCard[]>(getStats('30'));

  useEffect(() => {
    setStats(getStats(dateRange));
  }, [dateRange]);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: connections, error: connectionsError } = await supabase.from(
        'facebook_connections'
      ).select(`
          id,
          page_id,
          status,
          facebook_page_details (
            page_name,
            page_category,
            follower_count,
            page_avatar_url
          )
        `);

      if (connectionsError) throw connectionsError;

      const transformedPages: FacebookPage[] =
        connections?.map((conn) => ({
          id: conn.id,
          name: conn.facebook_page_details?.[0]?.page_name || 'Unnamed Page',
          verified: true,
          category: conn.facebook_page_details?.[0]?.page_category || 'Unknown',
          metrics: {
            followers: conn.facebook_page_details?.[0]?.follower_count || 0,
            likes: Math.floor(Math.random() * 10000), // Simulated likes count
            engagement: 124,
            reach: 3452,
            responseRate: 94.8,
            posts: 78,
          },
          status: conn.status === 'connected' ? 'active' : 'inactive',
          avatar: conn.facebook_page_details?.[0]?.page_avatar_url,
        })) || [];

      if (transformedPages.length === 0) {
        transformedPages.push({
          id: 'example',
          name: 'Thỏ Store',
          verified: true,
          category: 'Thời trang',
          metrics: {
            followers: 406,
            likes: 1250,
            engagement: 124,
            reach: 3452,
            responseRate: 94.8,
            posts: 78,
          },
          status: 'active',
        });
      }

      setPages(transformedPages);
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

  // Example data for Instagram and Ad Accounts
  const accounts: Account[] = [
    {
      id: 1,
      name: 'Instagram Business',
      status: 'connected',
      type: 'instagram',
      lastSync: '2024-04-15T09:15:00',
      metrics: {
        followers: 5678,
        posts: 89,
      },
    },
    {
      id: 2,
      name: 'Ad Account 1',
      status: 'connected',
      type: 'ad',
      lastSync: '2024-04-15T11:45:00',
      metrics: {
        spend: 5000000,
      },
    },
    {
      id: 3,
      name: 'Ad Account 2',
      status: 'error',
      type: 'ad',
      lastSync: '2024-04-14T16:30:00',
    },
  ];

  const filteredAccounts = accounts.filter((account) => {
    const matchesType = account.type === activeTab;
    const matchesSearch = account.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || account.status === filterStatus;
    return matchesType && matchesSearch && matchesStatus;
  });

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (status: 'all' | 'connected' | 'disconnected' | 'error') => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-green-50 text-green-600';
      case 'disconnected':
        return 'bg-gray-100 text-gray-600';
      case 'error':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-4 h-4" />;
      case 'disconnected':
        return <XCircle className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const invoices: Invoice[] = [
    {
      id: 1,
      invoiceNumber: 'INV-2024-001',
      date: '2024-04-01',
      dueDate: '2024-04-15',
      amount: 5000000,
      status: 'paid',
      paymentMethod: 'Credit Card',
      campaignName: 'Chiến dịch tháng 4',
    },
    {
      id: 2,
      invoiceNumber: 'INV-2024-002',
      date: '2024-03-15',
      dueDate: '2024-03-30',
      amount: 4000000,
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      campaignName: 'Chiến dịch tháng 3',
    },
    {
      id: 3,
      invoiceNumber: 'INV-2024-003',
      date: '2024-02-28',
      dueDate: '2024-03-15',
      amount: 3000000,
      status: 'overdue',
      paymentMethod: 'Credit Card',
      campaignName: 'Chiến dịch tháng 2',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý tài nguyên</h1>
          <p className="text-gray-600">Kết nối và quản lý các tài khoản mạng xã hội</p>
        </div>
        <div className="sm:ml-auto">
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Thêm tài khoản mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'facebook'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('facebook')}
          >
            <Facebook className="w-4 h-4" />
            Facebook
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'instagram'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('instagram')}
          >
            <Instagram className="w-4 h-4" />
            Instagram
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'ads'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('ads')}
          >
            <DollarSign className="w-4 h-4" />
            Tài khoản quảng cáo
          </button>
        </div>

        {activeTab === 'facebook' ? (
          <>
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

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
                  <div className="relative flex-1 sm:flex-initial">
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
                    onClick={() => setShowAddPage(true)}
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
          </>
        ) : (
          <>
            <div className="flex border-b border-gray-100">
              <button
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeSubTab === 'accounts'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSubTab('accounts')}
              >
                <Users className="w-4 h-4" />
                Tài khoản
              </button>
              <button
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
                  activeSubTab === 'billing'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setActiveSubTab('billing')}
              >
                <Receipt className="w-4 h-4" />
                Hóa đơn & Thanh toán
              </button>
            </div>

            {activeSubTab === 'accounts' ? (
              <div className="p-4 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-grow">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      placeholder="Tìm kiếm tài khoản..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="relative">
                    <button
                      className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={toggleFilterDropdown}
                    >
                      <Filter size={18} className="text-gray-500" />
                      <span className="font-medium">
                        {filterStatus === 'all'
                          ? 'Tất cả'
                          : filterStatus === 'connected'
                            ? 'Đã kết nối'
                            : filterStatus === 'disconnected'
                              ? 'Ngắt kết nối'
                              : 'Lỗi'}
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
                            onClick={() => handleFilterSelect('connected')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'connected' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Đã kết nối
                          </button>
                          <button
                            onClick={() => handleFilterSelect('disconnected')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'disconnected' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Ngắt kết nối
                          </button>
                          <button
                            onClick={() => handleFilterSelect('error')}
                            className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'error' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                          >
                            Lỗi
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {filteredAccounts.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {filteredAccounts.map((account) => (
                      <div key={account.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{account.name}</h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(account.status)}`}
                              >
                                {getStatusIcon(account.status)}
                                {account.status === 'connected'
                                  ? 'Đã kết nối'
                                  : account.status === 'disconnected'
                                    ? 'Ngắt kết nối'
                                    : 'Lỗi'}
                              </span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Cập nhật lần cuối: {new Date(account.lastSync).toLocaleString()}
                            </div>
                          </div>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {account.metrics && (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            {account.metrics.followers !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Người theo dõi</p>
                                <p className="font-medium">
                                  {account.metrics.followers.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {account.metrics.posts !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Bài viết</p>
                                <p className="font-medium">
                                  {account.metrics.posts.toLocaleString()}
                                </p>
                              </div>
                            )}
                            {account.metrics.spend !== undefined && (
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Chi tiêu</p>
                                <p className="font-medium">
                                  {account.metrics.spend.toLocaleString()}đ
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50">
                    <div className="w-12 h-12 text-gray-300 mx-auto mb-3">
                      <DollarSign className="w-full h-full" />
                    </div>
                    <p className="text-gray-500 font-medium">Không tìm thấy tài khoản nào</p>
                    <p className="text-gray-400 text-sm mt-1">
                      Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-lg font-semibold">Hóa đơn & Thanh toán</h2>
                  <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                      <Download className="w-4 h-4" />
                      <span>Xuất hóa đơn</span>
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <CreditCard className="w-4 h-4" />
                      <span>Thanh toán</span>
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Mã hóa đơn
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Chiến dịch
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Ngày tạo
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Hạn thanh toán
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Số tiền
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Phương thức
                        </th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                          Trạng thái
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <span className="font-medium">{invoice.invoiceNumber}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">{invoice.campaignName}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">
                              {new Date(invoice.date).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">
                              {new Date(invoice.dueDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="font-medium">{invoice.amount.toLocaleString()}đ</span>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-gray-600">{invoice.paymentMethod}</span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}
                            >
                              {getStatusIcon(invoice.status)}
                              {invoice.status === 'paid'
                                ? 'Đã thanh toán'
                                : invoice.status === 'pending'
                                  ? 'Chờ thanh toán'
                                  : 'Quá hạn'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ResourcePage;
