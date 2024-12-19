import { UserProfile } from '.';

export interface UserProfileDTO {
  id: number;
  username: string;
  avatar?: string;
  status: 'online' | 'offline' | 'ingame';
  friendsCount: number;
  gamesCount: number;
  lastActive: Date;
}

export interface DirectMessage {
  id: number;
  sender: UserProfile;
  receiver: UserProfile;
  content: string;
  messageType: 'text' | 'image';
  sentAt: Date;
  isRead: boolean;
  isEdited: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  image?: string;
  membersCount: number;
  creator: UserProfile;
  isPrivate: boolean;
  createdAt: Date;
}

export interface ChatMessage {
  id: number;
  chatRoomId: number;
  sender: UserProfile;
  content: string;
  messageType: 'text' | 'image';
  sentAt: Date;
  isEdited: boolean;
}

export interface SendMessageRequest {
  roomId?: number;
  receiverId?: number;
  content: string;
  messageType: 'text' | 'image';
}

export interface FriendRequest {
  id: number;
  requester: UserProfile;
  addressee: UserProfile;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}