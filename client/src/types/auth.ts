export interface LoginDTO {
  userName: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  publisherName: string;
}

export interface UserProfileDTO {
  id: number;
  username: string;
  avatar?: string;
  status: string;
  lastActive: Date;
  friendsCount: number;
  gamesCount: number;
  isOnline: boolean;
}

export interface CreateAccountDTO {
  username: string;
  password: string;
}