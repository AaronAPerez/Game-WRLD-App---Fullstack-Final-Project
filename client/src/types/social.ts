export interface Post {
    id: number;
    userId: number;
    publisherName: string;
    title: string;
    description: string;
    image?: string;
    date: string;
    tag: string;
    category: string;
    isPublished: boolean;
    likes: number;
    comments: Comment[];
  }
  
  export interface Comment {
    id: number;
    postId: number;
    userId: number;
    username: string;
    content: string;
    createdAt: string;
    likes: number;
  }
  
  export interface CreatePostDto {
    userId: number;
    publisherName: string;
    title: string;
    description: string;
    image?: string;
    tag: string;
    category: string;
  }
  
  export interface CreateCommentDto {
    postId: number;
    userId: number;
    content: string;
  }
  