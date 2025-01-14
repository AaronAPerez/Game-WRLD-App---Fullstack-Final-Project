import type { BlogItemModel, ApiResponse } from '@/types/api';
import axiosInstance from './api/axiosConfig';

export const BLOG_KEYS = {
  all: ['blogs'] as const,
  lists: () => [...BLOG_KEYS.all, 'list'] as const,
  list: (filters: string) => [...BLOG_KEYS.lists(), { filters }] as const,
  details: () => [...BLOG_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...BLOG_KEYS.details(), id] as const,
};

export const blogService = {
  getAllBlogs: async () => {
    const { data } = await axiosInstance.get<BlogItemModel[]>('/Blog/GetBlogItems');
    return data;
  },

  getBlogsByCategory: async (category: string) => {
    const { data } = await axiosInstance.get<BlogItemModel[]>(
      `/Blog/GetBlogItemByCategory/${category}`
    );
    return data;
  },

  getBlogsByTag: async (tag: string) => {
    const { data } = await axiosInstance.get<BlogItemModel[]>(
      `/Blog/GetItemsByTag/${tag}`
    );
    return data;
  },

  getBlogsByUserId: async (userId: number) => {
    const { data } = await axiosInstance.get<BlogItemModel[]>(
      `/Blog/GetItemsByUserId/${userId}`
    );
    return data;
  },

  createBlog: async (blog: Omit<BlogItemModel, 'id'>) => {
    const { data } = await axiosInstance.post<ApiResponse<BlogItemModel>>(
      '/Blog/AddBlogItems',
      blog
    );
    return data;
  },

  updateBlog: async (blog: BlogItemModel) => {
    const { data } = await axiosInstance.post<ApiResponse<boolean>>(
      '/Blog/UpdateBlogItems',
      blog
    );
    return data;
  },

  deleteBlog: async (blogId: number) => {
    const { data } = await axiosInstance.post<ApiResponse<boolean>>(
      `/Blog/DeleteBlogItem/${blogId}`,
      {}
    );
    return data;
  },

  getPublishedBlogs: async () => {
    const { data } = await axiosInstance.get<BlogItemModel[]>(
      '/Blog/GetPublishedItems'
    );
    return data;
  }
};






