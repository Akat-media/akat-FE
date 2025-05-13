import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { BaseUrl } from '../../../constants';
import LoadingContent from './LoadingContent';

type Props = {
  onClose: () => void;
  data?: any;
  setRefresh: React.Dispatch<any>;
};

const ContentModeration: React.FC<Props> = ({ onClose, data, setRefresh }) => {
  const [autoModeration, setAutoModeration] = useState(true);
  const [hidePost, setHidePost] = useState(false);
  const [editContent, setEditContent] = useState(false);
  const [notifyAdmin, setNotifyAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [volume, setVolume] = useState(90);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (data) {
      setAutoModeration(data.auto_moderation);
      setHidePost(data.hide_post_violations);
      setEditContent(data.edit_minor_content);
      setNotifyAdmin(data.notify_admin);
      setEmail(data.admin_email);
      setVolume(data.threshold);
      setPrompt(data.prompt || '');
    }
  }, []);
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        auto_moderation: autoModeration,
        edit_minor_content: editContent,
        hide_post_violations: hidePost,
        notify_admin: notifyAdmin,
        admin_email: email,
        threshold: volume,
        prompt,
      };
      const result = await axios.post(`${BaseUrl}/config-moderation`, payload);
      if (result.status === 200) {
        setLoading(false);
        toast.success('Lưu thành công!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
        setRefresh((prev: any) => !prev);
      } else {
        setLoading(false);
        toast.error('Lưu thất bại!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error('Lưu thất bại!', {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
      });
    }
  };
  if (loading) {
    return <LoadingContent />;
  }
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield w-5 h-5 text-blue-600"
              >
                <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Cấu hình kiểm duyệt nội dung</h2>
          </div>
          <button className="text-gray-500 hover:text-gray-700 transition-colors" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x w-5 h-5"
            >
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-blue-900">Tự động kiểm duyệt</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Tự động kiểm duyệt nội dung bài viết và bình luận
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    onChange={() => setAutoModeration(!autoModeration)}
                    checked={autoModeration}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div>
                <h3 className="font-medium mb-3">Hành động tự động</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Tự động ẩn bài vi phạm</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Tự động ẩn bài viết khi phát hiện vi phạm
                      </p>
                    </div>
                    <button onClick={() => setHidePost(!hidePost)} className="text-gray-700">
                      {hidePost ? (
                        // Bật
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="16" cy="12" r="2"></circle>
                        </svg>
                      ) : (
                        // Tắt
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="8" cy="12" r="2"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Tự động sửa nội dung</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Tự động sửa các nội dung vi phạm nhẹ
                      </p>
                    </div>
                    <button onClick={() => setEditContent(!editContent)} className="text-gray-700">
                      {editContent ? (
                        // Bật
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="16" cy="12" r="2"></circle>
                        </svg>
                      ) : (
                        // Tắt
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="8" cy="12" r="2"></circle>
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">Thông báo cho quản trị viên</p>
                      <p className="text-sm text-gray-600 mt-1">
                        Gửi email thông báo khi phát hiện vi phạm
                      </p>
                    </div>
                    <button onClick={() => setNotifyAdmin(!notifyAdmin)} className="text-gray-700">
                      {notifyAdmin ? (
                        // Bật
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-blue-500"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="16" cy="12" r="2"></circle>
                        </svg>
                      ) : (
                        // Tắt
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-10 h-10 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect>
                          <circle cx="8" cy="12" r="2"></circle>
                        </svg>
                      )}
                    </button>
                  </div>

                  <div className="ml-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email quản trị viên
                    </label>
                    <input
                      type="email"
                      className="w-full p-2 border rounded-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Ngưỡng độ tin cậy để tự động xử lý</label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="80"
                    max="100"
                    step="5"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 font-medium">80%</span>
                    <span className="text-blue-600 font-medium">85%</span>
                    <span className="text-blue-600 font-medium">90%</span>
                    <span className="text-gray-600">95%</span>
                    <span className="text-gray-600">100%</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium mb-2">Prompt kiểm duyệt</label>
                <textarea
                  className="w-full p-3 border border-gray-200 rounded-lg h-48 font-mono text-sm"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Prompt này sẽ được sử dụng để hướng dẫn AI kiểm duyệt nội dung
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-save w-4 h-4"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
              <polyline points="17 21 17 13 7 13 7 21"></polyline>
              <polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};
const defaultPrompt =
  'You are a content moderation system for Facebook posts. Your task is to analyze the content of posts and determine if they violate community standards.\n' +
  '\n' +
  'Analyze the post for the following violations:\n' +
  '1. Hate speech or discrimination\n' +
  '2. Violence or threats\n' +
  '3. Nudity or sexual content\n' +
  '4. Harassment or bullying\n' +
  '5. Spam or misleading content\n' +
  '6. Illegal activities\n' +
  '7. Self-harm or suicide\n' +
  '8. Misinformation\n' +
  '\n' +
  'Respond with a JSON object in the following format:\n' +
  '{\n' +
  '"violates": boolean,\n' +
  '"category": string or null,\n' +
  '"reason": string or null,\n' +
  '"confidence": number between 0 and 1\n' +
  '}\n' +
  '\n' +
  'Where:\n' +
  '- "violates" is true if the post violates community standards, false otherwise\n' +
  '- "category" is the category of violation (one of the 8 listed above), or null if no violation\n' +
  '- "reason" is a brief explanation of why the post violates standards, or null if no violation\n' +
  '- "confidence" is your confidence level in the assessment (0.0 to 1.0)\n' +
  '\n' +
  'Be thorough but fair in your assessment. If you are unsure, err on the side of caution.';
export default ContentModeration;
