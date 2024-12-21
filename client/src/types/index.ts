import { ReactNode } from "react"
export interface SendMessageParams {
  receiverId: number;
  content: string;
  type: 'text' | 'image';
}
export interface BaseMessage {
  id: number;
  content: string;
  senderId: number;
  sender: UserProfileDTO;
  sentAt: Date;
  type: 'text' | 'image';
  isRead: boolean;
  isEdited: boolean;
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
  conversationId: string;
  sender: string;
  text: string;
}
export interface DirectMessageDTO {
  id: number
  sender: UserProfileDTO
  receiver: UserProfileDTO
  content: string
  isRead: boolean
  sentAt: Date
  isEdited: boolean
  messageType: string
}

export interface DirectMessage extends BaseMessage {
  receiverId: number;
  receiver: UserProfileDTO;
  roomId: number;
  timestamp: Date;
  chatRoomId: number;
  isRead: boolean
}

export interface SendDirectMessageRequest {
  ReceiverId: number
  Content: string
  MessageType: string
  type: 'text'
}

export interface UserIdDTO {
  userId: number;
  publisherName: string;
}

export interface UserProfileDTO{
  id: number;
  username: string;
  avatar: string | null;
  status: 'online' | 'offline' | 'ingame';
  lastActive: Date;
  friendsCount: number;
  gamesCount: number;
  isOnline: boolean;
}

export type UserStatus = 'online' | 'offline' | 'ingame';
export interface User {
  id: string
  username: string | undefined
  email: string
  firstName: string
  lastName: string
  profilePicture?: string
  avatar: string
  bio?: string
  joinDate: Date
  friends: UserFriend[]
  chats: Chat[]
  messages: Message[]
  coverPicture?: string;
  followers: string[];
  followings: string[];
  isAdmin: boolean;
  desc?: string;
  city?: string;
  from?: string;
  relationship?: 1 | 2 | 3;
  createdAt: Date;
  updatedAt: Date;
  gamesCount: ReactNode
  friendsCount: ReactNode
  status: string
}

export interface LoginDTO{
  userName:	string
  password: string
}

export interface LoginResponse {
  token: string;
  avatar?: string;
  userId: number;
  publisherName: string;
}

export interface CreateAccountDTO{
  id: number
  username:	string
  password: string
}
export interface UpdateUserProfileDTO {
  username:	string
  avatar: string
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
  id: number
  username: string
  avatar: string | null
  status: 'online' | 'offline' | 'ingame'
  lastActive: string
}

export interface ChatMessage {
  id: number;
  content: string;
  senderId: number;
  sender: UserProfileDTO;
  sentAt: Date;
  roomId: number
  timestamp: string | number | Date
  chatRoomId: any
   type: 'text' | 'image' | 'file'
  isRead: boolean;
  isEdited: boolean;
}

export interface ChatRoom {
  id: number
  name: string
  description: string
  image: string | null
  membersCount: number
  createdAt: string
  creator: UserProfileDTO
  isPrivate: boolean
}

export interface SendMessageRequest {
  messageType: string
  chatRoomId: any
  roomId?: number
  receiverId?: number
  content: string
  type?: string
}

export interface ChatRoomMember {
  id: number
  userId: number
  roomId: number
  role: 'admin' | 'moderator' | 'member'
  joinedAt: string
}
export interface UserFriend {
  userId: string
  friendId: string
  status: FriendStatus
  createdAt: Date
}

export enum FriendStatus {
  Pending = 'Pending',
  Accepted = 'Accepted',
  Declined = 'Declined',
}

export interface FriendRequests {
  SentAt: Date
  ReceiverName: string
  ReceiverId: string
  SenderName: string
  SenderId: string
  Status: FriendStatus
  Id: string
  AddresseeId: number
  RequestId: number
  Requester: string
  CreatedAt: Date
  IsAccepted: boolean
  RequesterName?: string;
  AddresseeName?: string;
}


export interface FriendRequestDTO {
  requesterName:	string
  AddresseeName: string
  AddresseeId: number
  SentAt: Date
  ReceiverName: string
  ReceiverId: string
  SenderName: string
  SenderId: string
  Status: FriendStatus
  RequestId: number
  Requester: string
  CreatedAt: Date
  }

  export interface FriendResponseDTO{
    requestId: number
  }


export interface Post {
  id: number
  content: string
  imageUrl?: string
  createdAt: string
  userId: string
  user: User
  // likes: Like[];
  comments: Comment[]
}

export interface TokenRefreshResponse {
  token: string
  userId: number
  username: string
}

export interface TokenRefreshRequest {
  token: string
}
