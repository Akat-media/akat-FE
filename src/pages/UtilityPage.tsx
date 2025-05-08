import React, { useState } from 'react';
import { MessageSquare, Shield, Filter, Bot, Settings, Bell, Zap } from 'lucide-react';
import UtilityTools from '../components/UtilityTools';

function UtilityPage() {
  const [activeTab, setActiveTab] = useState<'auto_reply' | 'monitor' | 'filter' | 'settings'>(
    'auto_reply'
  );

  return (
    <div className="p-4 sm:p-8 max-w-[1600px] mx-auto">
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex border-b border-gray-100">
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'auto_reply'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('auto_reply')}
          >
            <MessageSquare className="w-4 h-4" />
            Tự động trả lời
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'monitor'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('monitor')}
          >
            <Shield className="w-4 h-4" />
            Giám sát
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'filter'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('filter')}
          >
            <Filter className="w-4 h-4" />
            Lọc bình luận
          </button>
          <button
            className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings className="w-4 h-4" />
            Cài đặt
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'auto_reply' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Tự động trả lời bình luận</h2>
                  <p className="text-gray-500">Cấu hình quy tắc tự động trả lời bình luận</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Zap className="w-4 h-4" />
                  <span>Thêm quy tắc</span>
                </button>
              </div>
              <UtilityTools initialType="auto_reply" />
            </div>
          )}

          {activeTab === 'monitor' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Giám sát tiêu chuẩn cộng đồng</h2>
                  <p className="text-gray-500">Cấu hình quy tắc giám sát nội dung</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Shield className="w-4 h-4" />
                  <span>Thêm quy tắc</span>
                </button>
              </div>
              <UtilityTools initialType="monitor" />
            </div>
          )}

          {activeTab === 'filter' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Lọc bình luận tự động</h2>
                  <p className="text-gray-500">Cấu hình quy tắc lọc bình luận</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Filter className="w-4 h-4" />
                  <span>Thêm quy tắc</span>
                </button>
              </div>
              <UtilityTools initialType="filter" />
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold">Cài đặt tiện ích</h2>
                  <p className="text-gray-500">Cấu hình chung cho các tiện ích tự động</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="text-lg font-medium mb-4">Thông báo</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Thông báo qua email</h4>
                          <p className="text-sm text-gray-500">
                            Nhận thông báo khi có vi phạm hoặc bình luận cần xử lý
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Bot className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Tự động xử lý</h4>
                          <p className="text-sm text-gray-500">
                            Tự động áp dụng các quy tắc đã cấu hình
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UtilityPage;
