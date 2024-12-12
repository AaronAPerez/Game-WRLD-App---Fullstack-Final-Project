import { Message } from "postcss";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    bio?: string;
    joinDate: string;
  }
  
  export interface Post {
    id: number;
    content: string;
    imageUrl?: string;
    createdAt: string;
    userId: string;
    user: User;
    // likes: Like[];
    comments: Comment[];
  }
  
  export interface Chat {
    id: number;
    name: string;
    isGroupChat: boolean;
    participants: User[];
    messages: Message[];
  }

  export interface TokenRefreshResponse {
    token: string;
    userId: number;
    username: string;
  }
  
  export interface TokenRefreshRequest {
    token: string;
  }