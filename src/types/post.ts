export interface Page {
  id: string;
  name: string;
  avatar?: string;
}

export interface Post {
  id: number;
  content: string;
  media?: string[];
  status: 'draft' | 'scheduled' | 'published';
  createdAt: string;
  page: Page;
  metrics?: {
    likes: number;
    comments: number;
    shares: number;
  };
}
