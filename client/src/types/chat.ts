export interface UserProfile {
  id: number;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'ingame';
  lastActive: string;
  friendsCount: number;
  gamesCount: number;
  friendStatus?: 'none' | 'pending' | 'accepted';
}

export interface ChatUser {
  id: number;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'ingame';
  lastActive: string;
}

export interface ChatMessage {
  id: number;
  content: string;
  sender: UserProfile;
  sentAt: string;
  isEdited: boolean;
  type: 'text' | 'image' | 'file';
}

export interface DirectMessage extends ChatMessage {
  receiverId: number;
  isRead: boolean;
}

export interface ChatRoom {
  id: number;
  name: string;
  description?: string;
  image?: string;
  lastMessage?: ChatMessage;
  unreadCount: number;
  participants: UserProfile[];
  createdAt: string;
  isPrivate: boolean;
}

export interface SendMessageRequest {
  content: string;
  type?: 'text' | 'image' | 'file';
  roomId?: number;
  receiverId?: number;
}

export interface ChatRoomMember {
  id: number;
  userId: number;
  roomId: number;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}