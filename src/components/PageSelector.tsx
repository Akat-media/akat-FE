import React from 'react';
import { Page } from '../types/post';

interface PageSelectorProps {
  selectedPage: Page | null;
  onPageChange: (page: Page | null) => void;
}

const pages: Page[] = [
  {
    id: '1',
    name: 'Thỏ Store',
    avatar: 'https://images.pexels.com/photos/6214476/pexels-photo-6214476.jpeg',
  },
  {
    id: '2',
    name: 'Fashion Shop',
    avatar: 'https://images.pexels.com/photos/5709661/pexels-photo-5709661.jpeg',
  },
  {
    id: '3',
    name: 'Beauty Care',
    avatar: 'https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg',
  },
];

function PageSelector({ selectedPage, onPageChange }: PageSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedPage?.id || ''}
        onChange={(e) => {
          const pageId = e.target.value;
          const page = pageId ? pages.find((p) => p.id === pageId) || null : null;
          onPageChange(page);
        }}
        className="appearance-none pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        <option value="">Tất cả trang</option>
        {pages.map((page) => (
          <option key={page.id} value={page.id}>
            {page.name}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        {selectedPage?.avatar ? (
          <img
            src={selectedPage.avatar}
            alt={selectedPage.name}
            className="w-4 h-4 rounded-full object-cover"
          />
        ) : (
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z"
            />
          </svg>
        )}
      </div>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export default PageSelector;
