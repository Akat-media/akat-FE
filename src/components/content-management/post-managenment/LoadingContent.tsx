import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingContent = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center z-50 space-y-4">
      <Loader2 className="w-10 h-10 text-white animate-spin" />
      <p className="text-white text-lg font-medium">Đang đăng bài...</p>
    </div>
  )

};

export default LoadingContent;
