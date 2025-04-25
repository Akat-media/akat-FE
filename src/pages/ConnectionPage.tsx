import React, { useState, useEffect } from 'react';
import {
  Link2,
  AlertCircle,
  Facebook,
  Shield,
  Bell,
  MessageSquare,
  ChevronDown,
  Settings,
} from 'lucide-react';
import FacebookConnect from '../components/FacebookConnect';
import LarkConnect from '../components/LarkConnect';
import ConnectedPages from '../components/ConnectedPages';
import PanCakeConfig from '../components/PanCakeConfig';
import { applyMigrations } from '../lib/migration';
import { supabase } from '../lib/supabase';

interface Guide {
  title: string;
  steps: string[];
  tips: string[];
  links?: { text: string; url: string }[];
}

const guides: Record<string, Guide> = {
  default: {
    title: 'Hướng dẫn thiết lập kết nối',
    steps: [
      'Chọn nền tảng bạn muốn kết nối (Facebook, Lark)',
      'Đọc kỹ hướng dẫn và yêu cầu quyền truy cập',
      'Thực hiện các bước kết nối theo hướng dẫn',
      'Kiểm tra trạng thái kết nối sau khi hoàn tất',
    ],
    tips: [
      'Đảm bảo bạn có đầy đủ quyền quản trị trên nền tảng cần kết nối',
      'Lưu ý các giới hạn và chính sách của từng nền tảng',
      'Kiểm tra kỹ các quyền truy cập được yêu cầu',
      'Đảm bảo kết nối internet ổn định trong quá trình thiết lập',
    ],
  },
  pancake: {
    title: '🚀 Lấy Pancake API Key',
    steps: [
      'Truy cập: https://app.pancake.vn/business/api',
      'Đăng nhập tài khoản Pancake → chọn doanh nghiệp muốn tích hợp',
      'Tạo Key mới hoặc sao chép Key có sẵn',
      'Thêm Key vào phần cấu hình tích hợp của AKA Platform',
    ],
    tips: [
      'Giữ API key an toàn và không chia sẻ với người khác',
      'Đảm bảo doanh nghiệp có quyền truy cập API',
      'Kiểm tra trạng thái kết nối sau khi thêm key',
      'Lưu ý các giới hạn gọi API của PanCake',
    ],
    links: [
      {
        text: 'Trang quản lý API PanCake',
        url: 'https://app.pancake.vn/business/api',
      },
      {
        text: 'Tài liệu API PanCake',
        url: 'https://pancake.vn/api-docs',
      },
    ],
  },
  facebook: {
    title: 'Hướng dẫn kết nối Facebook Page',
    steps: [
      'Đăng nhập vào tài khoản Facebook của bạn',
      'Chọn Page bạn muốn kết nối',
      'Cấp quyền truy cập cho ứng dụng',
      'Xác nhận kết nối',
    ],
    tips: [
      'Đảm bảo bạn là Admin của Facebook Page',
      'Cho phép đầy đủ các quyền được yêu cầu',
      'Kiểm tra trạng thái Page không bị hạn chế',
    ],
    links: [
      {
        text: 'Tìm hiểu thêm về quyền truy cập Facebook Page',
        url: 'https://developers.facebook.com/docs/pages/access-tokens',
      },
      {
        text: 'Trung tâm trợ giúp Facebook',
        url: 'https://www.facebook.com/help',
      },
    ],
  },
  'facebook-manage': {
    title: 'Hướng dẫn quản lý kết nối Facebook Page',
    steps: [
      'Kiểm tra trạng thái kết nối của các Page',
      'Làm mới kết nối nếu cần thiết',
      'Theo dõi số liệu và hoạt động của Page',
      'Quản lý quyền truy cập và cài đặt',
    ],
    tips: [
      'Thường xuyên kiểm tra trạng thái kết nối',
      'Cập nhật token truy cập khi hết hạn',
      'Theo dõi các thông báo từ Facebook về thay đổi chính sách',
      'Lưu ý các giới hạn về API và tần suất gọi',
    ],
    links: [
      {
        text: 'Tài liệu quản lý Facebook Page',
        url: 'https://www.facebook.com/business/help',
      },
    ],
  },
  'facebook-new': {
    title: 'Hướng dẫn thêm kết nối Facebook Page mới',
    steps: [
      'Đảm bảo bạn là Admin của Facebook Page muốn kết nối',
      'Cấp đầy đủ quyền truy cập cho ứng dụng',
      'Xác nhận thông tin và hoàn tất kết nối',
      'Kiểm tra các tính năng sau khi kết nối',
    ],
    tips: [
      'Kiểm tra trạng thái Page không bị hạn chế',
      'Đảm bảo Page không vi phạm chính sách của Facebook',
      'Xem xét các quyền được yêu cầu trước khi cấp phép',
      'Lưu ý giới hạn số lượng Page có thể kết nối',
    ],
    links: [
      {
        text: 'Chính sách Facebook Page',
        url: 'https://www.facebook.com/policies_center',
      },
    ],
  },
  lark: {
    title: 'Hướng dẫn kết nối Lark',
    steps: [
      'Đăng nhập vào tài khoản Lark của bạn',
      'Tạo ứng dụng trong Lark Developer Console',
      'Cấu hình Webhook URL và Event Subscriptions',
      'Xác thực và kích hoạt kết nối',
    ],
    tips: [
      'Đảm bảo ứng dụng đã được phê duyệt',
      'Kiểm tra các quyền cần thiết đã được cấp',
      'Cấu hình đúng URL callback',
    ],
    links: [
      {
        text: 'Tài liệu Lark Open Platform',
        url: 'https://open.larksuite.com/document',
      },
    ],
  },
};

interface ConnectionSection {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  description: string;
  type: string;
  features: { icon: React.ElementType; title: string; description: string }[];
  component: React.ComponentType<any>;
}

function ConnectionPage() {
  const [showConnectForm, setShowConnectForm] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [migrationRunning, setMigrationRunning] = useState(false);
  const [showPanCakeConfig, setShowPanCakeConfig] = useState(false);
  //  const [showGuide, setShowGuide] = useState<string | null>(null);
  const [connectedPagesCount, setConnectedPagesCount] = useState(0);
  const [showConnectedPages, setShowConnectedPages] = useState(false);
  const [currentGuide, setCurrentGuide] = useState<string>('default');

  // dem so luong page facebook da ket noi
  useEffect(() => {
    fetchConnectedPagesCount();
  }, [refreshKey]);

  const fetchConnectedPagesCount = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('facebook_connections')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'connected');

      setConnectedPagesCount(count || 0);
    } catch (err) {
      console.error('Error fetching connected pages count:', err);
    }
  };

  const sections: ConnectionSection[] = [
    {
      id: 'facebook',
      title: `Facebook Pages (${connectedPagesCount})`,
      icon: Facebook,
      color: 'blue',
      description: 'Kết nối và quản lý Facebook Pages',
      type: 'platform',
      features: [
        {
          icon: MessageSquare,
          title: 'Quản lý tin nhắn & bình luận',
          description: 'Trả lời tin nhắn và bình luận tự động',
        },
        {
          icon: Bell,
          title: 'Thông báo',
          description: 'Nhận thông báo về hoạt động của trang',
        },
        {
          icon: Shield,
          title: 'Bảo mật',
          description: 'Kiểm tra và cảnh báo vi phạm',
        },
      ],
      component: FacebookConnect,
    },
    {
      id: 'lark',
      title: 'Lark',
      icon: MessageSquare,
      color: '[#00B0FF]',
      description: 'Tích hợp tin nhắn với Lark',
      type: 'platform',
      features: [
        {
          icon: MessageSquare,
          title: 'Đồng bộ tin nhắn',
          description: 'Quản lý tin nhắn từ nhiều kênh',
        },
        {
          icon: Bell,
          title: 'Thông báo tức thì',
          description: 'Nhận thông báo qua Lark',
        },
      ],
      component: LarkConnect,
    },
    {
      id: 'pancake',
      title: 'PanCake',
      icon: Link2,
      color: 'purple',
      description: 'Tích hợp với PanCake để quản lý đơn hàng',
      type: 'integration',
      features: [
        {
          icon: MessageSquare,
          title: 'Đồng bộ đơn hàng',
          description: 'Tự động đồng bộ đơn hàng từ PanCake',
        },
        {
          icon: Bell,
          title: 'Thông báo đơn hàng',
          description: 'Nhận thông báo khi có đơn hàng mới',
        },
      ],
      component: LarkConnect,
    },
    {
      id: 'nhanh',
      title: 'Nhanh.VN',
      icon: Link2,
      color: 'green',
      description: 'Tích hợp với Nhanh.VN để quản lý kho và đơn hàng',
      type: 'integration',
      features: [
        {
          icon: MessageSquare,
          title: 'Đồng bộ kho',
          description: 'Tự động đồng bộ tồn kho và giá',
        },
        {
          icon: Bell,
          title: 'Thông báo đơn hàng',
          description: 'Nhận thông báo khi có đơn hàng mới',
        },
      ],
      component: LarkConnect,
    },
    {
      id: 'sapo',
      title: 'Sapo',
      icon: Link2,
      color: 'orange',
      description: 'Tích hợp với Sapo để quản lý bán hàng',
      type: 'integration',
      features: [
        {
          icon: MessageSquare,
          title: 'Đồng bộ sản phẩm',
          description: 'Tự động đồng bộ sản phẩm và tồn kho',
        },
        {
          icon: Bell,
          title: 'Thông báo đơn hàng',
          description: 'Nhận thông báo khi có đơn hàng mới',
        },
      ],
      component: LarkConnect,
    },
  ];

  // chay migration tao bang fb_connection, fb_page_details, policy RLS
  useEffect(() => {
    const runMigrations = async () => {
      try {
        setMigrationRunning(true);
        setError(null);

        const result = await applyMigrations();
        if (!result.success) {
          console.error('Migration failed:', result.error);
          setError(`Database setup failed: ${result.error}`);
        }
      } catch (err) {
        console.error('Migration error:', err);
        setError(err instanceof Error ? err.message : 'Failed to set up database');
      } finally {
        setMigrationRunning(false);
      }
    };

    runMigrations();
  }, []);

  const handleConnectSuccess = () => {
    setShowConnectForm(null);
    setRefreshKey((prev) => prev + 1);
    setShowConnectedPages(true);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    // console.log("expandedSection: " + expandedSection);
    setShowConnectForm(null);
    // console.log("showConnectForm: " + showConnectForm);
    setCurrentGuide(sectionId);
    // console.log("currentGuide: " + currentGuide);
    setShowConnectedPages(false);
    // console.log("showConnectedPages: " + showConnectedPages);
  };

  // section huong dan ben phai
  const renderGuide = (guideId: string) => {
    const guide = guides[guideId];
    if (!guide) return null;

    return (
      <div className="space-y-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-medium text-blue-900">{guide.title}</h4>
            <div className="mt-4 space-y-4">
              <div>
                <h5 className="font-medium text-blue-800 mb-2">Các bước thực hiện:</h5>
                <ol className="space-y-2">
                  {guide.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="flex items-center justify-center w-5 h-5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-blue-800">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h5 className="font-medium text-blue-800 mb-2">Lưu ý:</h5>
                <ul className="space-y-1">
                  {guide.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-blue-800">
                      <span className="text-blue-500">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {guide.links && guide.links.length > 0 && (
                <div>
                  <h5 className="font-medium text-blue-800 mb-2">Tài liệu tham khảo:</h5>
                  <ul className="space-y-1">
                    {guide.links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {link.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // icon loading page khi vao trang
  if (migrationRunning) {
    return (
      <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-semibold mb-2">Đang chuẩn bị dữ liệu</h2>
        <p className="text-gray-600">Vui lòng đợi trong giây lát...</p>
      </div>
    );
  }

  /**
   *  Hiển thị nội dung của Facebook Section
   */
  const renderFacebookSection = () => {
    // Trường hợp đang hiển thị form kết nối
    if (showConnectForm === 'facebook') {
      return <FacebookConnect onConnect={handleConnectSuccess} />;
    }

    // Trường hợp đang hiển thị danh sách trang đã kết nối
    if (showConnectedPages) {
      return <ConnectedPages key={refreshKey} />;
    }

    // Trường hợp mặc định - hiển thị các nút tùy chọn
    return (
      <div className="space-y-4 pt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Nút Quản lý kết nối */}
          <button
            onClick={() => {
              setShowConnectedPages(true);
              setCurrentGuide('facebook-manage');
            }}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium">Quản lý kết nối</h3>
              <p className="text-sm text-gray-600">Quản lý các Facebook Pages đã kết nối</p>
            </div>
          </button>

          {/* Nút Thêm kết nối mới */}
          <button
            onClick={() => {
              setShowConnectForm('facebook');
              setCurrentGuide('facebook-new');
            }}
            className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl hover:from-blue-100 hover:to-blue-200/50 transition-all duration-200"
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <div className="relative">
                <Facebook className="w-5 h-5 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-xs font-bold">+</span>
                </div>
              </div>
            </div>
            <div className="text-left">
              <h3 className="font-medium">Thêm kết nối mới</h3>
              <p className="text-sm text-gray-600">Kết nối thêm Facebook Page</p>
            </div>
          </button>
        </div>
      </div>
    );
  };

  // Hiển thị nội dung của các section khác
  const renderOtherSection = () => {
    // return <section.component onConnect={handleConnectSuccess} />;
  };

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Thiết lập kết nối</h1>
      </div>

      <div className="lg:grid lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7 space-y-6">
          {/* Platform Connections */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Kết nối nền tảng</h2>
            <div className="space-y-3">
              {sections
                .filter((section) => section.type === 'platform')
                .map((section) => (
                  <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 bg-${section.color}-100 rounded-lg`}>
                          <section.icon className={`w-4 h-4 text-${section.color}-600`} />
                        </div>
                        <div className="text-left">
                          <h2 className="text-base font-medium">{section.title}</h2>
                          <p className="text-xs text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      {/*mui ten icon*/}
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedSection === section.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {/*HERE*/}
                    {expandedSection === section.id && (
                      <div className="px-4 pb-4">
                        {section.id === 'facebook' ? renderFacebookSection() : renderOtherSection()}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {/* Integrations */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Tích hợp</h2>
            <div className="space-y-3">
              {sections
                .filter((section) => section.type === 'integration')
                .map((section) => (
                  <div key={section.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-1.5 bg-${section.color}-100 rounded-lg`}>
                          <section.icon className={`w-4 h-4 text-${section.color}-600`} />
                        </div>
                        <div className="text-left">
                          <h2 className="text-base font-medium">{section.title}</h2>
                          <p className="text-xs text-gray-600">{section.description}</p>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-4 h-4 text-gray-400 transition-transform ${
                          expandedSection === section.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    {expandedSection === section.id && (
                      <div className="px-4 pb-4">
                        {section.id === 'pancake' ? (
                          <div className="space-y-4">
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                  <Settings className="w-5 h-5 text-purple-600" />
                                </div>
                                <h3 className="font-medium">Cấu hình PanCake API</h3>
                              </div>
                              <p className="text-sm text-gray-600 mb-4">
                                Thêm API key để kết nối với PanCake và quản lý đơn hàng
                              </p>
                              <button
                                onClick={() => setShowPanCakeConfig(true)}
                                className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors"
                              >
                                Thêm API key
                              </button>
                            </div>
                          </div>
                        ) : (
                          <section.component onConnect={handleConnectSuccess} />
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Guide Section - Hidden on mobile, shown on desktop */}
        {/*section huong dan*/}
        <div className="hidden lg:block lg:col-span-5 space-y-4">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Hướng dẫn</h2>
            {renderGuide(!expandedSection ? 'default' : currentGuide)}
          </div>
        </div>

        {/* Guide Section - Shown on mobile only */}
        <div className="mt-6 lg:hidden space-y-4">
          {renderGuide(!expandedSection ? 'default' : currentGuide)}
        </div>
      </div>

      {/* PanCake Config Modal */}
      {showPanCakeConfig && <PanCakeConfig onClose={() => setShowPanCakeConfig(false)} />}
    </div>
  );
}

export default ConnectionPage;
