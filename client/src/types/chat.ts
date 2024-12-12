import { Message } from "postcss";
import { ReactNode } from "react";


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
  createdAt: Date;
  participants: User[];
  messages: Message[];
}

export interface ChatRoom {
  id: number;
  name: string;
  description: string;
  image: string | null;
  membersCount: number;
  createdAt: string;
  creator: UserProfile;
  isPrivate: boolean;
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  sender: UserProfile;
  content: string;
  messageType: string;
  sentAt: string;
  isEdited: boolean;
}



export interface DirectMessage {
  id: number;
  sender: UserProfile;
  receiver: UserProfile;
  content: string;
  messageType: string;
  sentAt: string;
  isRead: boolean;
  isEdited: boolean;
}

export interface UserProfile {
  friendsCount: ReactNode;
  id: number;
  username: string;
  avatar: string | null;
  status: string;
  lastActive: string;
}

export interface SendMessageRequest {
  chatRoomId: number;
  content: string;
  messageType?: string;
}

export interface SendDirectMessageRequest {
  receiverId: number;
  content: string;
  messageType?: string;
}