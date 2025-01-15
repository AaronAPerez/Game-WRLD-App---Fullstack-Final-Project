export interface BlogItemModel {
  id: number;
  userId: number;
  publisherName: string | null;
  tag: string | null;
  title: string | null;
  image: string | null;
  description: string | null;
  date: string | null;
  category: string | null;
  isPublished: boolean;
  isDeleted: boolean;
}

export interface CreateBlogItemDto {
  userId: number;
  publisherName: string;
  title: string;
  description: string;
  image?: string;
  tag: string;
  category: string;
}

export interface Comment {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  createdAt: string;
}

export interface User {
  id: number;
  username: string;
  profileImage?: string;
}

export interface BlogPost {
    id: number;
    userId: number;
    publisherName: string;
    content: string;
    image?: string;
    likes: number;
    comments: number;
    createdAt: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    stats?: {
      views: number;
      reposts: number;
    };
  }
  
  export interface Comment {
    id: number;
    userId: number;
    postId: number;
    publisherName: string;
    content: string;
    createdAt: string;
    likes: number;
    isLiked?: boolean;
  }