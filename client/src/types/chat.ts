// export interface UserProfileDTO {
//   id: number;
//   username: string;
//   avatar?: string;
//   status: 'online' | 'offline' | 'ingame';
//   friendsCount: number;
//   gamesCount: number;
//   lastActive: Date;
// }

// export interface DirectMessage {
//   id: number;
//   sender: UserProfileDTO;
//   receiver: UserProfileDTO;
//   content: string;
//   messageType: 'text' | 'image';
//   sentAt: Date;
//   isRead: boolean;
//   isEdited: boolean;
// }

// export interface ChatRoom {
//   id: number;
//   name: string;
//   description?: string;
//   image?: string;
//   membersCount: number;
//   creator: UserProfileDTO;
//   isPrivate: boolean;
//   createdAt: Date;
// }

// export interface ChatMessage {
//   id: number;
//   chatRoomId: number;
//   sender: UserProfileDTO;
//   content: string;
//   messageType: 'text' | 'image';
//   sentAt: Date;
//   isEdited: boolean;
// }

// export interface SendMessageRequest {
//   roomId?: number;
//   receiverId?: number;
//   content: string;
//   messageType: 'text' | 'image';
// }

// export interface FriendRequest {
//   id: number;
//   requester: UserProfileDTO;
//   addressee: UserProfileDTO;
//   status: 'pending' | 'accepted' | 'rejected';
//   createdAt: Date;
// }