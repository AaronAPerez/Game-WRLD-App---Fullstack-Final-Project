export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// Auth Types
export interface LoginDTO {
  userName: string;
  password: string;
}

export interface CreateAccountDTO {
  id: number;
  username: string;
  password: string;
}

export interface UserIdDTO {
  userId: number;
  publisherName: string;
}

// Blog Types
export interface BlogItemModel {
  id: number;
  userId: number;
  publisherName: string;
  tag: string;
  title: string;
  image: string;
  description: string;
  date: string;
  category: string;
  isPublished: boolean;
  isDeleted: boolean;
}