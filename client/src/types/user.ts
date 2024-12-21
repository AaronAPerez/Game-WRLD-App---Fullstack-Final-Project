// // types/user.ts
// export interface User {
//     id: string;
//     username: string;
//     email: string;
//     profilePicture?: string;
//     coverPicture?: string;
//     followers: string[];
//     followings: string[];
//     isAdmin: boolean;
//     desc?: string;
//     city?: string;
//     from?: string;
//     relationship?: 1 | 2 | 3;
//     createdAt: Date;
//     updatedAt: Date;
//   }

// export interface UserProfileDTO {
//      Id: string; 
//      Username: string;
//      Avatar: string;
//      Status: string;
//      LastActive: Date;
//      FriendsCount: number; 
//      GamesCount: number; 
//     //  IsOnline: booleon; 
//   }
  
//   // types/message.ts
//   export interface Message {
//     id: string;
//     conversationId: string;
//     sender: string;
//     text: string;
//     createdAt: Date;
//   }
  
//   // types/conversation.ts
//   export interface Conversation {
//     id: string;
//     members: string[];
//     createdAt: Date;
//   }
  
//   // types/post.ts
//   export interface Post {
//     id: string;
//     userId: string;
//     desc?: string;
//     img?: string;
//     likes: string[];
//     createdAt: Date;
//   }