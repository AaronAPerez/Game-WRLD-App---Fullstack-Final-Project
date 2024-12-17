export interface BlogPost {
  id: number;
  userId: number;
  publisherName: string;
  tags: string[];
  title: string;
  image: string;
  description: string;
  date: string;
  category: string;
  isPublished: boolean;
  isDeleted: boolean;
  commentsCount?: number;
  createdAt?: string;
}

export interface BlogPostDTO extends BlogPost {
  commentsCount: number;
  createdAt: string;
}

export interface CreateBlogPostDTO extends Omit<BlogPost, 'id'> {
  tags: string[];
}

export interface BlogListResponse {
  data: BlogPostDTO[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface BlogQueryParams {
  userId?: number;
  category?: string;
  sortBy?: 'recent' | 'popular';
  page?: number;
  pageSize?: number;
}