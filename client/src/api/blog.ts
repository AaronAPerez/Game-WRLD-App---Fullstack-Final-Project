

import { api } from './axios';
import type { BlogItemModel } from '../types/models';

export const blogService = {
  getAllPosts: async () => {
    const response = await api.get<BlogItemModel[]>('/Blog/GetBlogItems');
    return response.data;
  },

  getPublishedPosts: async () => {
    const response = await api.get<BlogItemModel[]>('/Blog/GetPublishedItems');
    return response.data;
  },

  createPost: async (post: Omit<BlogItemModel, 'id'>) => {
    const response = await api.post('/Blog/AddBlogItems', post);
    return response.data;
  },

  updatePost: async (post: BlogItemModel) => {
    const response = await api.post('/Blog/UpdateBlogItems', post);
    return response.data;
  },

  deletePost: async (post: BlogItemModel) => {
    const response = await api.post(`/Blog/DeleteBlogItem/${post.id}`, post);
    return response.data;
  },

  getPostsByUserId: async (userId: number) => {
    const response = await api.get<BlogItemModel[]>(`/Blog/GetItemsByUserId/${userId}`);
    return response.data;
  },

  getPostsByCategory: async (category: string) => {
    const response = await api.get<BlogItemModel[]>(`/Blog/GetBlogItemByCategory/${category}`);
    return response.data;
  }
};