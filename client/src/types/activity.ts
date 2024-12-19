export type ActivityType = 
  | 'GAME_STARTED'
  | 'GAME_ACHIEVEMENT'
  | 'FRIEND_ADDED'
  | 'STATUS_CHANGED'
  | 'BLOG_POSTED'
  | 'GAME_RATED'
  | 'GAME_REVIEWED';

export interface Activity {
  id: number;
  userId: number;
  user: {
    id: number;
    username: string;
    avatar: string | null;
  };
  type: ActivityType;
  data: {
    gameId?: number;
    gameName?: string;
    gameImage?: string;
    achievementName?: string;
    achievementImage?: string;
    rating?: number;
    review?: string;
    friendId?: number;
    friendName?: string;
    friendAvatar?: string;
    blogId?: number;
    blogTitle?: string;
    status?: string;
  };
  createdAt: string;
}