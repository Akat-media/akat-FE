import React, { useState } from 'react';
import {
  Plus,
  X,
  Image as ImageIcon,
  Video,
  File,
  Search,
  Filter,
  Download,
  Trash2,
  MoreVertical,
  Folder,
  FolderOpen,
  Edit2,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

interface Note {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface MediaItem {
  id: number;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  size: string;
  uploadedAt: string;
  tags: string[];
  notes: Note[];
  aiSuggestions: string[];
}

interface Folder {
  id: number;
  name: string;
  items: (MediaItem | Folder)[];
  notes: Note[];
  aiSuggestions: string[];
}

function ContentLibrary() {
  const [currentFolder, setCurrentFolder] = useState<Folder>({
    id: 1,
    name: 'Thư viện nội dung',
    items: [
      {
        id: 2,
        name: 'Chiến dịch tháng 4',
        items: [
          {
            id: 3,
            name: 'banner-summer-sale.jpg',
            type: 'image',
            url: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
            size: '2.5 MB',
            uploadedAt: '2024-03-20',
            tags: ['banner', 'summer', 'sale'],
            notes: [
              {
                id: 1,
                content: 'Banner chính cho chiến dịch tháng 4, cần chỉnh sửa màu sắc',
                createdAt: '2024-03-20',
                updatedAt: '2024-03-20',
              },
            ],
            aiSuggestions: [
              'Có thể thêm hiệu ứng gradient để tăng độ nổi bật',
              'Nên thêm logo công ty ở góc phải',
              'Cân nhắc thêm CTA button',
            ],
          },
        ],
        notes: [
          {
            id: 1,
            content: 'Chiến dịch tập trung vào sản phẩm mùa hè',
            createdAt: '2024-03-15',
            updatedAt: '2024-03-15',
          },
        ],
        aiSuggestions: [
          'Có thể tạo thêm video quảng cáo ngắn',
          'Nên chuẩn bị content cho các kênh social media',
          'Cân nhắc tạo landing page riêng',
        ],
      },
      {
        id: 4,
        name: 'Tài liệu thương hiệu',
        items: [
          {
            id: 5,
            name: 'brand-guidelines.pdf',
            type: 'document',
            url: 'https://example.com/guidelines.pdf',
            size: '1.8 MB',
            uploadedAt: '2024-03-15',
            tags: ['document', 'brand', 'guidelines'],
            notes: [
              {
                id: 1,
                content: 'Cần cập nhật phần màu sắc thương hiệu',
                createdAt: '2024-03-15',
                updatedAt: '2024-03-15',
              },
            ],
            aiSuggestions: [
              'Nên thêm phần hướng dẫn sử dụng trên mobile',
              'Có thể tạo infographic để dễ hiểu hơn',
              'Cân nhắc thêm ví dụ thực tế',
            ],
          },
        ],
        notes: [],
        aiSuggestions: [],
      },
    ],
    notes: [],
    aiSuggestions: [],
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [newNote, setNewNote] = useState('');

  const handleAddNote = () => {
    if (selectedItem && newNote.trim()) {
      const note: Note = {
        id: Date.now(),
        content: newNote.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (selectedItem.type) {
        // Update media item
        setCurrentFolder({
          ...currentFolder,
          items: currentFolder.items.map((item) => {
            if ('items' in item) {
              return {
                ...item,
                items: item.items.map((subItem) => {
                  if (subItem.id === selectedItem.id) {
                    return {
                      ...subItem,
                      notes: [...subItem.notes, note],
                    };
                  }
                  return subItem;
                }),
              };
            }
            return item;
          }),
        });
      } else {
        // Update folder
        setCurrentFolder({
          ...currentFolder,
          items: currentFolder.items.map((item) => {
            if (item.id === selectedItem.id) {
              return {
                ...item,
                notes: [...item.notes, note],
              };
            }
            return item;
          }),
        });
      }

      setNewNote('');
      setShowNoteModal(false);
    }
  };

  const handleDeleteItem = (id: number) => {
    setCurrentFolder({
      ...currentFolder,
      items: currentFolder.items.filter((item) => item.id !== id),
    });
  };

  const renderItem = (item: MediaItem | Folder) => {
    if ('items' in item) {
      return (
        <div
          key={item.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-medium text-gray-900">{item.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowNoteModal(true);
                  }}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedItem(item);
                    setShowAISuggestions(true);
                  }}
                  className="p-1 text-gray-400 hover:text-yellow-600"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {item.notes.length > 0 && (
              <div className="text-sm text-gray-500 mb-2">
                {item.notes[item.notes.length - 1].content}
              </div>
            )}

            <div className="text-xs text-gray-400">{item.items.length} items</div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={item.id}
        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      >
        <div className="aspect-video bg-gray-100 relative">
          {item.type === 'image' && (
            <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
          )}
          {item.type === 'video' && (
            <div className="w-full h-full flex items-center justify-center">
              <Video className="w-12 h-12 text-gray-400" />
            </div>
          )}
          {item.type === 'document' && (
            <div className="w-full h-full flex items-center justify-center">
              <File className="w-12 h-12 text-gray-400" />
            </div>
          )}
          <div className="absolute top-2 right-2 flex items-center gap-1">
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowNoteModal(true);
              }}
              className="p-1 bg-white/80 rounded-full hover:bg-white"
            >
              <MessageSquare className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => {
                setSelectedItem(item);
                setShowAISuggestions(true);
              }}
              className="p-1 bg-white/80 rounded-full hover:bg-white"
            >
              <Sparkles className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
            <button
              onClick={() => handleDeleteItem(item.id)}
              className="p-1 text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {item.notes.length > 0 && (
            <div className="text-sm text-gray-500 mb-2">
              {item.notes[item.notes.length - 1].content}
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <span>{item.size}</span>
            <span>•</span>
            <span>{new Date(item.uploadedAt).toLocaleDateString('vi-VN')}</span>
          </div>

          {item.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
            <Download className="w-4 h-4" />
            <span>Tải xuống</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">{currentFolder.name}</h2>
          <p className="text-gray-500">Quản lý và tổ chức nội dung</p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          <span>Tải lên</span>
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm tệp hoặc thư mục..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="appearance-none pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả</option>
            <option value="image">Hình ảnh</option>
            <option value="video">Video</option>
            <option value="document">Tài liệu</option>
            <option value="folder">Thư mục</option>
          </select>
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentFolder.items.map(renderItem)}
      </div>

      {showNoteModal && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Ghi chú</h2>
              <button
                onClick={() => setShowNoteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedItem.notes.map((note) => (
                <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(note.createdAt).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              ))}

              <div>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Thêm ghi chú mới..."
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm ghi chú
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAISuggestions && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Gợi ý từ AI</h2>
              <button
                onClick={() => setShowAISuggestions(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {selectedItem.aiSuggestions.map((suggestion, index) => (
                <div key={index} className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <p className="text-gray-700">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Tải lên tệp</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                  <Plus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Kéo và thả tệp vào đây</p>
                  <p className="text-sm text-gray-500 mt-1">hoặc nhấp để chọn tệp</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                />
              </div>
            </div>

            <div className="mt-6">
              <p className="text-sm text-gray-500">Hỗ trợ: JPG, PNG, GIF, MP4, PDF, DOC, DOCX</p>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Tải lên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ContentLibrary;
