import { UserFriend } from ".";

export interface UserProfile {
  id: number;
  username: string;
  avatar: string | null;
  status: string;
  lastActive: string;
  friendsCount: number;
  gamesCount: number;
  friendStatus?: 'none' | 'pending' | 'accepted';
}

  export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
    bio?: string
    joinDate: Date
    friends: UserFriend[]
    chats: Chat[]
    messages: Message[]
  }

export interface Message {
  id: number
  content: string
  createdAt: Date
  isRead: boolean
  userId: string
  user: User
  chatId: number
  chat: Chat
}

export interface Message {
    id: number;
    content: string;
    sender: {
      id: number;
      username: string;
      avatar: string | null;
      status: string;
    };
    sentAt: string;
  }
export interface Chat {
  id: number
  name?: string
  isGroupChat: boolean
  createdAt: Date
  participants: User[]
  messages: Message[]
}


export interface ChatUser {
  id: number;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'ingame';
  lastActive: string;
}

export interface ChatMessageDTO {
  chatRoomId: any;
  id: number;
  content: string;
  sender: UserProfile;
  sentAt: string;
  isEdited: boolean;
  type: 'text' | 'image' | 'file';
}

export interface DirectMessage extends ChatMessageDTO {
  receiver: any;
  receiverId: number;
  isRead: boolean;
}

export interface SendDirectMessageRequest
{
    ReceiverId: number;
    Content: string;
    MessageType: string
    type: 'text';
}

export interface ChatRoomDTO {
  creatorId: any;
  id: number;
  name: string;
  description: string;
  image: string | null;
  membersCount: number;
  createdAt: string;
  creator: UserProfile;
  isPrivate: boolean;
}

export interface SendMessageRequest {
  messageType: string;
  chatRoomId: any;
  roomId?: number;
  receiverId?: number;
  content: string;
  type?: string;
}

export interface ChatRoomMember {
  id: number;
  userId: number;
  roomId: number;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
}