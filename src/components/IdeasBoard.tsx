import React, { useState } from 'react';
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Check,
  Square,
  User,
  Calendar,
  Tag,
  Image as ImageIcon,
  Video,
  Link,
} from 'lucide-react';

interface Task {
  id: number;
  content: string;
  assignedTo: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
}

interface Idea {
  id: number;
  title: string;
  content: string;
  category: 'campaign' | 'content' | 'social' | 'video';
  status: 'planning' | 'in-progress' | 'review' | 'done';
  dueDate: string;
  tasks: Task[];
  media?: {
    type: 'image' | 'video' | 'link';
    url: string;
  }[];
  tags: string[];
}

function IdeasBoard() {
  const [ideas, setIdeas] = useState<Idea[]>([
    {
      id: 1,
      title: 'Chiến dịch tháng 4',
      content: 'Tập trung vào các sản phẩm mùa hè, giảm giá 20% cho toàn bộ sản phẩm',
      category: 'campaign',
      status: 'in-progress',
      dueDate: '2024-04-01',
      tags: ['sale', 'summer', 'campaign'],
      tasks: [
        {
          id: 1,
          content: 'Thiết kế banner',
          assignedTo: 'Design Team',
          dueDate: '2024-03-25',
          status: 'done',
        },
        {
          id: 2,
          content: 'Viết content',
          assignedTo: 'Content Team',
          dueDate: '2024-03-28',
          status: 'in-progress',
        },
        {
          id: 3,
          content: 'Lên lịch đăng',
          assignedTo: 'Social Team',
          dueDate: '2024-03-30',
          status: 'todo',
        },
      ],
      media: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
        },
      ],
    },
  ]);

  const [showNewIdea, setShowNewIdea] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    content: '',
    category: 'campaign',
    dueDate: '',
    tasks: [] as Task[],
  });

  const handleAddIdea = () => {
    if (newIdea.title.trim() && newIdea.content.trim()) {
      const idea: Idea = {
        id: Date.now(),
        title: newIdea.title.trim(),
        content: newIdea.content.trim(),
        category: newIdea.category as Idea['category'],
        status: 'planning',
        dueDate: newIdea.dueDate,
        tasks: newIdea.tasks,
        tags: [],
      };

      setIdeas([...ideas, idea]);
      setNewIdea({ title: '', content: '', category: 'campaign', dueDate: '', tasks: [] });
      setShowNewIdea(false);
    }
  };

  const handleToggleTaskStatus = (ideaId: number, taskId: number) => {
    setIdeas(
      ideas.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            tasks: idea.tasks.map((task) => {
              if (task.id === taskId) {
                const statusOrder = ['todo', 'in-progress', 'review', 'done'];
                const currentIndex = statusOrder.indexOf(task.status);
                const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
                return { ...task, status: nextStatus as Task['status'] };
              }
              return task;
            }),
          };
        }
        return idea;
      })
    );
  };

  const handleDeleteIdea = (id: number) => {
    setIdeas(ideas.filter((idea) => idea.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done':
        return 'bg-green-100 text-green-700';
      case 'in-progress':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'campaign':
        return 'bg-purple-100 text-purple-700';
      case 'content':
        return 'bg-blue-100 text-blue-700';
      case 'social':
        return 'bg-green-100 text-green-700';
      case 'video':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Kế hoạch Marketing</h1>
            <p className="text-gray-500">Quản lý chiến dịch và phân công công việc</p>
          </div>
          <button
            onClick={() => setShowNewIdea(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm kế hoạch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div
              key={idea.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(idea.category)}`}
                      >
                        {idea.category === 'campaign'
                          ? 'Chiến dịch'
                          : idea.category === 'content'
                            ? 'Nội dung'
                            : idea.category === 'social'
                              ? 'Mạng xã hội'
                              : 'Video'}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(idea.status)}`}
                      >
                        {idea.status === 'planning'
                          ? 'Lên kế hoạch'
                          : idea.status === 'in-progress'
                            ? 'Đang thực hiện'
                            : idea.status === 'review'
                              ? 'Kiểm tra'
                              : 'Hoàn thành'}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
                  </div>
                  <button
                    onClick={() => handleDeleteIdea(idea.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-full"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-gray-600 mb-4">{idea.content}</p>

                <div className="space-y-3 mb-4">
                  {idea.tasks.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <button
                        onClick={() => handleToggleTaskStatus(idea.id, task.id)}
                        className={`p-1 rounded-full ${
                          task.status === 'done'
                            ? 'text-green-600'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        {task.status === 'done' ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{task.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <User className="w-3 h-3" />
                            <span>{task.assignedTo}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(task.dueDate).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {idea.media && idea.media.length > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    {idea.media.map((item, index) => (
                      <div key={index} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        {item.type === 'image' && (
                          <img src={item.url} alt="" className="w-full h-full object-cover" />
                        )}
                        {item.type === 'video' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        {item.type === 'link' && (
                          <div className="w-full h-full flex items-center justify-center">
                            <Link className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {idea.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {idea.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {showNewIdea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Thêm kế hoạch mới</h2>
              <button
                onClick={() => setShowNewIdea(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập tiêu đề kế hoạch..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung</label>
                <textarea
                  value={newIdea.content}
                  onChange={(e) => setNewIdea({ ...newIdea, content: e.target.value })}
                  className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả chi tiết kế hoạch..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại</label>
                  <select
                    value={newIdea.category}
                    onChange={(e) =>
                      setNewIdea({ ...newIdea, category: e.target.value as Idea['category'] })
                    }
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="campaign">Chiến dịch</option>
                    <option value="content">Nội dung</option>
                    <option value="social">Mạng xã hội</option>
                    <option value="video">Video</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hạn hoàn thành
                  </label>
                  <input
                    type="date"
                    value={newIdea.dueDate}
                    onChange={(e) => setNewIdea({ ...newIdea, dueDate: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowNewIdea(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAddIdea}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Thêm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeasBoard;
