import { BlogItemModel } from '@/types/blog';
import axiosInstance from './api/axiosConfig';

export const blogService = {
  // Get all posts
  getPosts: async () => {
    const response = await axiosInstance.get<BlogItemModel[]>('/Blog/GetBlogItems');
    return response.data;
  },

  // Get post by id
  getPost: async (id: number) => {
    const response = await axiosInstance.get<BlogItemModel>(`/Blog/${id}`);
    return response.data;
  },

  // Create post
  createPost: async (data: Partial<BlogItemModel>) => {
    const response = await axiosInstance.post<BlogItemModel>('/Blog/AddBlogItems', data);
    return response.data;
  },

  // Update post
  updatePost: async (data: BlogItemModel) => {
    const response = await axiosInstance.post<BlogItemModel>('/Blog/UpdateBlogItems', data);
    return response.data;
  },

  // Delete post
  deletePost: async (id: number) => {
    const response = await axiosInstance.post<boolean>(`/Blog/DeleteBlogItem/${id}`);
    return response.data;
  },

  // Get posts by category
  getPostsByCategory: async (category: string) => {
    const response = await axiosInstance.get<BlogItemModel[]>(`/Blog/GetBlogItemByCategory/${category}`);
    return response.data;
  },

  // Get user posts
  getUserPosts: async (userId: number) => {
    const response = await axiosInstance.get<BlogItemModel[]>(`/Blog/GetItemsByUserId/${userId}`);
    return response.data;
  },

  getComments: async (postId: number): Promise<Comment[]> => {
    const { data } = await axiosInstance.get(`/Comment/${postId}`);
    return data;
  },

  addComment: async ({ postId, content }: { postId: number; content: string }): Promise<Comment> => {
    const { data } = await axiosInstance.post('/Comment', { postId, content });
    return data;
  },

  likeComment: async (commentId: number): Promise<void> => {
    await axiosInstance.post(`/Comment/${commentId}/like`);
  },

  deleteComment: async (commentId: number): Promise<void> => {
    await axiosInstance.delete(`/Comment/${commentId}`);
  },

  // Placeholder endpoints (need to be implemented)
  likePost: async (postId: number) => {
    const { data } = await axiosInstance.post(`/Blog/${postId}/like`);
    return data;
  },

  unlikePost: async (postId: number) => {
    const { data } = await axiosInstance.delete(`/Blog/${postId}/like`);
    return data;
  },

  // getComments: async (postId: number) => {
  //   const { data } = await axiosInstance.get<Comment[]>(`/Blog/${postId}/comments`);
  //   return data;
  // },

  // addComment: async ({ postId, content }: { postId: number; content: string }) => {
  //   const { data } = await axiosInstance.post(`/Blog/${postId}/comments`, { content });
  //   return data;
  // }

};