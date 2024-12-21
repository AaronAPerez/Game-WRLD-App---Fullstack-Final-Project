// export interface Message {
//     id: number;
//     content: string;
//     createdAt: Date;
//     isRead: boolean;
//     userId: string;
//     user: User;
//     chatId: number;
//     chat: Chat;
//   }
  
//   export interface User {
//     id: string;
//     email: string;
//     firstName: string;
//     lastName: string;
//     profilePicture?: string;
//     bio?: string;
//     joinDate: Date;
//     friends: UserFriend[];
//     chats: Chat[];
//     messages: Message[];
//   }
  
//   export interface Chat {
//     id: number;
//     name?: string;
//     isGroupChat: boolean;
//     createdAt: Date;
//     participants: User[];
//     messages: Message[];
//   }
  
//   export interface UserFriend {
//     userId: string;
//     friendId: string;
//     status: FriendStatus;
//     createdAt: Date;
//   }
  
//   export enum FriendStatus {
//     Pending = 'Pending',
//     Accepted = 'Accepted',
//     Declined = 'Declined'
//   }