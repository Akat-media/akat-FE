import { format, parseISO } from 'date-fns';
import { X } from 'lucide-react';

interface ScheduledPost {
  id: string;
  content: string;
  scheduledTime: string;
  page: {
    name: string;
    avatar?: string;
  };
  status: 'pending' | 'published' | 'failed';
  posted_at: string;
  page_name: string;
  post_avatar_url: string;
}

interface Page {
  id: string;
  name: string;
  avatar?: string;
}

interface ListPostScheduleProps {
  date: string | null;
  posts: ScheduledPost[];
  data: Page[];
  onPageSelect: (page: Page) => void;
  onClose: () => void;
}

export default function ListPostSchedule({
  date,
  posts,
  data,
  onPageSelect,
  onClose,
}: ListPostScheduleProps) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">📅 Lịch đăng bài</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <X size={20} />
          </button>
        </header>

        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-center text-gray-500">🚫 Chưa có bài nào.</p>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded-xl bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {post.page?.avatar ? (
                      <img
                        src={post.page.avatar}
                        alt="Page Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      // <div className="w-8 h-8 rounded-full bg-gray-300" />
                      <div></div>
                    )}
                    <span className="font-medium text-gray-800">{post.page_name}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {format(parseISO(post.posted_at), 'dd-MM-yyyy HH:mm')}
                  </span>
                </div>

                <p className="text-sm text-gray-700 line-clamp-3 mb-2">{post.content}</p>

                {typeof post.post_avatar_url == 'string' && (
                  <img
                    src={post.post_avatar_url}
                    alt="Post"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                {Array.isArray(post.post_avatar_url) && post.post_avatar_url.length > 0 && (
                  <img
                    src={post?.post_avatar_url?.[0]}
                    alt="Post"
                    className="w-full h-40 object-cover rounded-lg mb-2"
                  />
                )}
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    post.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : post.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                  }`}
                >
                  {post.status === 'pending'
                    ? '⏳ Chờ đăng'
                    : post.status === 'published'
                      ? '✅ Đã đăng'
                      : '❌ Thất bại'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
