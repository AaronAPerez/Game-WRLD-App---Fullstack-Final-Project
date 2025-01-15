export interface User {
  id: number;
  username: string;
  avatar?: string;
  bio?: string;
  following: number[];
  followers: number[];
  favorites: number[];
}

export interface Post {
  id: number;
  userId: number;
  gameId?: number;
  type: 'review' | 'discussion' | 'screenshot' | 'achievement';
  content: string;
  media?: string[];
  likes: number;
  comments: Comment[];
  createdAt: string;
  game?: {
    id: number;
    name: string;
    image: string;
  };
}

export interface CommentDTO {
  id: number;
  postId: number;
  userId: number;
  parentCommentId?: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: {
    id: number;
    username: string;
    avatar?: string;
  };
  likes: number;
  replies?: CommentDTO[];
}

export interface CreateCommentDTO {
  postId: number;
  content: string;
  parentCommentId?: number;
}

export interface Comment {
  id: number;
  userId: number;
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


  