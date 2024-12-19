import axios from 'axios';
import { BASE_URL } from '../constants';


export interface BlogPost {
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

const api = axios.create({
  baseURL: `${BASE_URL}/Blog`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const blogService = {
  async getAllPosts(): Promise<BlogPost[]> {
    const response = await api.get('/GetAllBlogItems');
    return response.data;
  },

  async getPostsByUserId(userId: number): Promise<BlogPost[]> {
    const response = await api.get(`/GetItemsByUserId/${userId}`);
    return response.data;
  },

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    const response = await api.get(`/GetItemByCategory/${category}`);
    return response.data;
  },

  async getPostsByTag(tag: string): Promise<BlogPost[]> {
    const response = await api.get(`/GetItemsByTag/${tag}`);
    return response.data;
  },

  async createPost(post: Omit<BlogPost, 'id'>): Promise<boolean> {
    const response = await api.post('/AddBlogItems', post);
    return response.data;
  },

  async updatePost(post: BlogPost): Promise<boolean> {
    const response = await api.put('/UpdateBlogItems', post);
    return response.data;
  },

  async deletePost(post: BlogPost): Promise<boolean> {
    const response = await api.post('/DeleteBlogItem', post);
    return response.data;
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    const response = await api.get('/GetPublishedItems');
    return response.data;
  }
};