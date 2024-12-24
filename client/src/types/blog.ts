export interface BlogItemModel {
  id?: number;
  userId: number;
  publisherName: string;
  tag?: string;
  title: string;
  image?: string;
  description: string;
  date: string;
  category: string;
  isPublished: boolean;
  isDeleted?: boolean;
}

export interface CreateBlogPostDTO {
  userId: number;
  publisherName: string;
  title: string;
  description: string;
  category: string;
  tag?: string;
  image?: string;
  date: string;
  isPublished: boolean;
}

export interface BlogListResponse {
  items: BlogItemModel[];
  total: number;
  page: number;
  pageSize: number;
}



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
  likes: number;
  commentsCount: number;
  createdAt: string;
}

// export interface CreateBlogPostDTO extends Omit<BlogPost, 'id'> {
//   tags: string[];
// }

export interface CreateBlogPostDTO {
  title: string;
  description: string;
  category: string;
  image?: string;
  tags?: string[];
}


export interface BlogListResponse {
  data: BlogPostDTO[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export interface BlogCommentDTO {
  id: number;
  blogId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface BlogQueryParams {
  userId?: number;
  category?: string;
  sortBy?: 'recent' | 'popular';
  page?: number;
  pageSize?: number;
}