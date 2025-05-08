import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  Calendar,
  ChevronDown,
  Loader2,
  BarChart2,
  DollarSign,
  Target,
  Users,
  Grid,
  List,
  Receipt,
  CreditCard,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface AdCampaign {
  id: number;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  startDate: string;
  endDate: string;
  metrics: {
    reach: number;
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
  };
  targetAudience: {
    age: string;
    gender: string;
    location: string;
    interests: string[];
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

function AdsManagerPage() {
  const [loading] = useState(false);
  const [dateRange, setDateRange] = useState<'7' | '30' | '60'>('30');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'paused' | 'completed'>(
    'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'performance' | 'audience' | 'billing'>(
    'campaigns'
  );
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Example data - in real app this would come from API
  const campaigns: AdCampaign[] = [
    {
      id: 1,
      name: 'Chiến dịch tháng 4',
      status: 'active',
      budget: 5000000,
      startDate: '2024-04-01',
      endDate: '2024-04-30',
      metrics: {
        reach: 12345,
        impressions: 23456,
        clicks: 1234,
        conversions: 234,
        spend: 1234000,
      },
      targetAudience: {
        age: '18-35',
        gender: 'Female',
        location: 'Hà Nội, Hồ Chí Minh',
        interests: ['Fashion', 'Beauty', 'Shopping'],
      },
    },
    {
      id: 2,
      name: 'Chiến dịch tháng 3',
      status: 'completed',
      budget: 4000000,
      startDate: '2024-03-01',
      endDate: '2024-03-31',
      metrics: {
        reach: 10987,
        impressions: 19876,
        clicks: 987,
        conversions: 198,
        spend: 1000000,
      },
      targetAudience: {
        age: '25-40',
        gender: 'All',
        location: 'Toàn quốc',
        interests: ['Technology', 'Gaming', 'Entertainment'],
      },
    },
  ];

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

  const toggleFilterDropdown = () => {
    setShowFilterDropdown(!showFilterDropdown);
  };

  const handleFilterSelect = (status: 'all' | 'active' | 'paused' | 'completed') => {
    setFilterStatus(status);
    setShowFilterDropdown(false);
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'list' ? 'grid' : 'list');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-50 text-green-600';
      case 'pending':
        return 'bg-yellow-50 text-yellow-600';
      case 'overdue':
        return 'bg-red-50 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'overdue':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">Quản lý quảng cáo</h1>
          <p className="text-gray-600">Quản lý và theo dõi hiệu suất chiến dịch quảng cáo</p>
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
          <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            <span>Tạo chiến dịch mới</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'campaigns'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('campaigns')}
          >
            <BarChart2 className="w-4 h-4" />
            Chiến dịch
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'performance'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('performance')}
          >
            <DollarSign className="w-4 h-4" />
            Hiệu suất
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'audience'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('audience')}
          >
            <Users className="w-4 h-4" />
            Đối tượng
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'billing'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('billing')}
          >
            <Receipt className="w-4 h-4" />
            Hóa đơn & Thanh toán
          </button>
        </div>

        {activeTab === 'billing' ? (
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
        ) : (
          activeTab === 'campaigns' && (
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
                      placeholder="Tìm kiếm chiến dịch..."
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
                            : filterStatus === 'active'
                              ? 'Đang chạy'
                              : filterStatus === 'paused'
                                ? 'Tạm dừng'
                                : 'Đã hoàn thành'}
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
                              onClick={() => handleFilterSelect('active')}
                              className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'active' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                            >
                              Đang chạy
                            </button>
                            <button
                              onClick={() => handleFilterSelect('paused')}
                              className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'paused' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                            >
                              Tạm dừng
                            </button>
                            <button
                              onClick={() => handleFilterSelect('completed')}
                              className={`w-full text-left px-3 py-2 rounded-md ${filterStatus === 'completed' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                            >
                              Đã hoàn thành
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
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
              ) : campaigns.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {campaigns.map((campaign) => (
                        <div
                          key={campaign.id}
                          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium text-gray-900">{campaign.name}</h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                  campaign.status === 'active'
                                    ? 'bg-green-50 text-green-600'
                                    : campaign.status === 'paused'
                                      ? 'bg-yellow-50 text-yellow-600'
                                      : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {campaign.status === 'active'
                                  ? 'Đang chạy'
                                  : campaign.status === 'paused'
                                    ? 'Tạm dừng'
                                    : 'Đã hoàn thành'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                                {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Ngân sách</p>
                                <p className="font-medium">{campaign.budget.toLocaleString()}đ</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Chi tiêu</p>
                                <p className="font-medium">
                                  {campaign.metrics.spend.toLocaleString()}đ
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Lượt tiếp cận</p>
                                <p className="font-medium">
                                  {campaign.metrics.reach.toLocaleString()}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Lượt tương tác</p>
                                <p className="font-medium">
                                  {campaign.metrics.clicks.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {campaigns.map((campaign) => (
                      <div key={campaign.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{campaign.name}</h3>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                                  campaign.status === 'active'
                                    ? 'bg-green-50 text-green-600'
                                    : campaign.status === 'paused'
                                      ? 'bg-yellow-50 text-yellow-600'
                                      : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {campaign.status === 'active'
                                  ? 'Đang chạy'
                                  : campaign.status === 'paused'
                                    ? 'Tạm dừng'
                                    : 'Đã hoàn thành'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(campaign.startDate).toLocaleDateString()} -{' '}
                                {new Date(campaign.endDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Ngân sách</p>
                            <p className="font-medium">{campaign.budget.toLocaleString()}đ</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Chi tiêu</p>
                            <p className="font-medium">
                              {campaign.metrics.spend.toLocaleString()}đ
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Lượt tiếp cận</p>
                            <p className="font-medium">{campaign.metrics.reach.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600 mb-1">Lượt tương tác</p>
                            <p className="font-medium">
                              {campaign.metrics.clicks.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12 bg-gray-50">
                  <BarChart2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Không tìm thấy chiến dịch nào</p>
                  <p className="text-gray-400 text-sm mt-1">
                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                  </p>
                </div>
              )}
            </>
          )
        )}

        {activeTab === 'performance' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Tổng chi tiêu</h3>
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">2,234,000đ</p>
                <p className="text-sm text-green-600 mt-1">+12% so với tháng trước</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Lượt tiếp cận</h3>
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">45,678</p>
                <p className="text-sm text-green-600 mt-1">+8% so với tháng trước</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-900">Tỷ lệ chuyển đổi</h3>
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <p className="text-2xl font-semibold text-gray-900">2.5%</p>
                <p className="text-sm text-green-600 mt-1">+0.5% so với tháng trước</p>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Hiệu suất theo thời gian</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-lg">
                    7 ngày
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                    30 ngày
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
                    90 ngày
                  </button>
                </div>
              </div>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Biểu đồ hiệu suất sẽ được hiển thị ở đây</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audience' && (
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố độ tuổi</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Biểu đồ phân bố độ tuổi sẽ được hiển thị ở đây</p>
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố giới tính</h3>
                <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Biểu đồ phân bố giới tính sẽ được hiển thị ở đây</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sở thích của đối tượng</h3>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Fashion
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Beauty
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Shopping
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Technology
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Gaming
                </span>
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm">
                  Entertainment
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdsManagerPage;
