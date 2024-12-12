export interface CreateRoomRequest {
    name: string;
    description: string;
    image?: string;
    isPrivate: boolean;
  }
  
  export interface UpdateRoomRequest {
    roomId: number;
    name?: string;
    description?: string;
    image?: string;
    isPrivate?: boolean;
  }
  
  export interface SendMessageRequest {
    chatRoomId: number;
    content: string;
    messageType: 'text' | 'image' | 'file';
  }
  
  export interface SendDirectMessageRequest {
    receiverId: number;
    content: string;
    messageType: 'text' | 'image' | 'file';
  }

  export interface Message {
    id: number;
    content: string;
    createdAt: Date;
    isRead: boolean;
    userId: string;
    chatId: number;
  }
  
  export interface ChatRoomResponse {
    id: number;
    name: string;
    description: string;
    image: string | null;
    membersCount: number;
    createdAt: string;
    creator: UserProfileResponse;
    isPrivate: boolean;
  }
  
  export interface ChatMessageResponse {
    id: number;
    chatRoomId: number;
    sender: UserProfileResponse;
    content: string;
    messageType: string;
    sentAt: string;
    isEdited: boolean;
  }
  
  export interface DirectMessageResponse {
    id: number;
    sender: UserProfileResponse;
    receiver: UserProfileResponse;
    content: string;
    messageType: string;
    sentAt: string;
    isRead: boolean;
    isEdited: boolean;
  }
  
  export interface UserProfileResponse {
    id: number;
    username: string;
    avatar: string | null;
    status: string;
    lastActive: string;
    friendsCount: number;
    gamesCount: number;
  }
  
  export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
  
  export interface ChatQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
  }