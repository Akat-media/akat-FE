import React, { useState } from 'react';
import {
  MessageSquare,
  Shield,
  Filter,
  Settings,
  Bell,
  CheckCircle,
  XCircle,
  Plus,
  ChevronDown,
  ChevronRight,
  Bot,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface Rule {
  id: number;
  name: string;
  type: 'auto_reply' | 'monitor' | 'filter';
  status: 'active' | 'inactive';
  description: string;
  conditions: string[];
  actions: string[];
}

interface UtilityToolsProps {
  initialType?: 'auto_reply' | 'monitor' | 'filter';
}

function UtilityTools({ initialType }: UtilityToolsProps) {
  const [rules, setRules] = useState<Rule[]>([
    {
      id: 1,
      name: 'Tự động trả lời bình luận',
      type: 'auto_reply',
      status: 'active',
      description: 'Tự động trả lời bình luận dựa trên từ khóa',
      conditions: ['Chứa từ khóa "giá"', 'Chứa từ khóa "ship"'],
      actions: ['Gửi tin nhắn mẫu', 'Gắn thẻ "cần trả lời"'],
    },
    {
      id: 2,
      name: 'Giám sát tiêu chuẩn cộng đồng',
      type: 'monitor',
      status: 'active',
      description: 'Tự động phát hiện vi phạm tiêu chuẩn cộng đồng',
      conditions: ['Chứa từ ngữ không phù hợp', 'Chứa link spam'],
      actions: ['Ẩn bình luận', 'Gửi cảnh báo'],
    },
    {
      id: 3,
      name: 'Lọc bình luận tự động',
      type: 'filter',
      status: 'inactive',
      description: 'Tự động lọc bình luận theo quy tắc',
      conditions: ['Chứa từ khóa cấm', 'Chứa số điện thoại'],
      actions: ['Ẩn bình luận', 'Gửi thông báo cho admin'],
    },
  ]);

  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [expandedRule, setExpandedRule] = useState<number | null>(null);

  const toggleRule = (id: number) => {
    setExpandedRule(expandedRule === id ? null : id);
  };

  const toggleRuleStatus = (id: number) => {
    setRules(
      rules.map((rule) =>
        rule.id === id
          ? { ...rule, status: rule.status === 'active' ? 'inactive' : 'active' }
          : rule
      )
    );
  };

  const filteredRules = initialType ? rules.filter((rule) => rule.type === initialType) : rules;

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Tiện ích tự động</h2>
          <p className="text-gray-500">Quản lý các công cụ tự động hóa</p>
        </div>
        <button
          onClick={() => setShowAddRuleModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm quy tắc</span>
        </button>
      </div>

      <div className="space-y-4">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      rule.type === 'auto_reply'
                        ? 'bg-green-100'
                        : rule.type === 'monitor'
                          ? 'bg-blue-100'
                          : 'bg-purple-100'
                    }`}
                  >
                    {rule.type === 'auto_reply' && (
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    )}
                    {rule.type === 'monitor' && <Shield className="w-5 h-5 text-blue-600" />}
                    {rule.type === 'filter' && <Filter className="w-5 h-5 text-purple-600" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">{rule.name}</h3>
                      <button
                        onClick={() => toggleRuleStatus(rule.id)}
                        className={`p-1 rounded-full ${
                          rule.status === 'active' ? 'text-green-600' : 'text-gray-400'
                        }`}
                      >
                        {rule.status === 'active' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <XCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500">{rule.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleRule(rule.id)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      expandedRule === rule.id ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {expandedRule === rule.id && (
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Điều kiện</h4>
                    <div className="space-y-2">
                      {rule.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          <span>{condition}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Hành động</h4>
                    <div className="space-y-2">
                      {rule.actions.map((action, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span>{action}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">
                      Chỉnh sửa
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                      Xóa
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UtilityTools;
