import React from 'react';
import { Edit2, Trash2, Calendar, Image as ImageIcon } from 'lucide-react';
import { Post } from '../types/post';

interface PostListProps {
  posts: Post[];
  viewMode: 'grid' | 'list';
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
  onSchedule: (post: Post) => void;
}

function PostList({ posts, viewMode, onEdit, onDelete, onSchedule }: PostListProps) {
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                {post.page.avatar && (
                  <img
                    src={post.page.avatar}
                    alt={post.page.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-gray-900">{post.page.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">{post.content}</p>

              {post.media && post.media.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {post.media.map((url, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {post.metrics && (
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>{post.metrics.likes} lượt thích</span>
                  <span>{post.metrics.comments} bình luận</span>
                  <span>{post.metrics.shares} chia sẻ</span>
                </div>
              )}
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-2">
              <button
                onClick={() => onEdit(post)}
                className="p-1 text-gray-400 hover:text-blue-600"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSchedule(post)}
                className="p-1 text-gray-400 hover:text-green-600"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(post)}
                className="p-1 text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="p-4">
            <div className="flex items-start gap-4">
              {post.media && post.media.length > 0 && (
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={post.media[0]} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {post.page.avatar && (
                    <img
                      src={post.page.avatar}
                      alt={post.page.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <h3 className="font-medium text-gray-900">{post.page.name}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{post.content}</p>
                {post.metrics && (
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>{post.metrics.likes} lượt thích</span>
                    <span>{post.metrics.comments} bình luận</span>
                    <span>{post.metrics.shares} chia sẻ</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onEdit(post)}
                  className="p-1 text-gray-400 hover:text-blue-600"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onSchedule(post)}
                  className="p-1 text-gray-400 hover:text-green-600"
                >
                  <Calendar className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(post)}
                  className="p-1 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
