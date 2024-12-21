// export interface FriendRequest {
//     Id: number;
//     SenderId: number;
//     AddresseeId: number;
//     Status: FriendStatus;
//     CreatedAt: string;
//     RequesterName?: string;
//     AddresseeName?: string;
//   }
  
//   export type FriendStatus = 'pending' | 'accepted' | 'declined';
  
//   export interface UserProfile {
//     id: number;
//     username: string;
//     avatar: string | null;
//     status: UserStatus;
//     lastActive: string;
//     friendsCount: number;
//     gamesCount: number;
//     currentGame?: string;
//     recentActivity?: string;
//     activityTime?: string;
//     mutualFriends?: number;
//   }
  
//   export type UserStatus = 'online' | 'offline' | 'ingame';
  
//   export interface FriendActivity {
//     id: number;
//     userId: number;
//     type: ActivityType;
//     details: string;
//     timestamp: string;
//   }
  
//   export type ActivityType = 'game_started' | 'achievement_unlocked' | 'friend_added' | 'status_changed';