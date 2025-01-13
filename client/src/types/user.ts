import { BlogItemModel } from "./blog";

export interface UserProfile {
    id: number;
    username: string;
    publisherName?: string;
    blogPosts?: BlogItemModel[];
  }