export interface BlogItemModel {
    id: number;
    userId: number;
    publisherName: string | null;
    tag: string | null;
    title: string | null;
    image: string | null;
    description: string | null;
    date: string | null;
    category: string | null;
    isPublished: boolean;
    isDeleted: boolean;
  }

export interface BlogPost {
    id: number;
    userId: number;
    publisherName: string;
    tag: string;
    title: string;
    image: string;
    description: string;
    date: string;
    category:string;
    isPublished: BooleanConstructor;
    isDeleted: boolean;
}

export interface Comment {
    id: number;
    blogId: number;
    userId: number;
    content: string;
    createdAt: string;
  }
  
  export interface User {
    id: number;
    username: string;
    profileImage?: string;
  }