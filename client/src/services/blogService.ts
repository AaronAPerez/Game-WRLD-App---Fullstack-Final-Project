import type { BlogPostDTO, CreateBlogPostDTO, BlogListResponse, BlogCommentDTO } from '../types/blog';
import apiClient from './apiClient';


export const blogService = {
  // Create new blog post
  async createPost(data: CreateBlogPostDTO) {
    const response = await apiClient.post('/Blog/AddBlogItems', data);
    return response.data;
  },

  // Get all blog posts with pagination
  async getPosts(params?: { 
    page?: number; 
    pageSize?: number;
    category?: string;
    userId?: number;
  }): Promise<BlogListResponse> {
    const response = await apiClient.get('/Blog/GetBlogItems', { params });
    return response.data;
  },

  // Get single blog post
  async getPost(id: number): Promise<BlogPostDTO> {
    const response = await apiClient.get(`/Blog/GetBlogItemByCategory/${id}`);
    return response.data;
  },

  // Update blog post
  async updatePost(id: number, data: Partial<BlogPostDTO>) {
    const response = await apiClient.post('/Blog/UpdateBlogItems', {
      id,
      ...data
    });
    return response.data;
  },

  // Delete blog post
  async deletePost(id: number) {
    const response = await apiClient.post(`/Blog/DeleteBlogItem/${id}`);
    return response.data;
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogPostDTO[]> {
    const response = await apiClient.get(`/Blog/GetBlogItemByCategory/${category}`);
    return response.data;
  },

  // Get user's posts
  async getUserPosts(userId: number): Promise<BlogPostDTO[]> {
    const response = await apiClient.get(`/Blog/GetItemsByUserId/${userId}`);
    return response.data;
  },
   // Get comments for a blog post
   async getBlogComments(blogId: number): Promise<BlogCommentDTO[]> {
    const response = await apiClient.get(`/Blog/${blogId}/comments`);
    return response.data;
  },
    // Add a new comment
    async addComment(blogId: number, content: string): Promise<BlogCommentDTO> {
      const response = await apiClient.post(`/Blog/${blogId}/comments`, { content });
      return response.data;
    },

    // Delete a comment
    async deleteComment(blogId: number, commentId: number): Promise<boolean> {
      const response = await apiClient.delete(`/Blog/${blogId}/comments/${commentId}`);
      return response.data;
    }
  };

// import { BlogItemModel } from "../types/models";
// import { apiClient } from "./userService";


// export const blogService = {
//   // CREATE
//   async createPost(post: Omit<BlogItemModel, 'id'>) {
//     const response = await apiClient.post('/Blog/AddBlogItems', post);
//     return response.data;
//   },

//   // READ
//   async getAllPosts() {
//     const response = await apiClient.get<BlogItemModel[]>('/Blog/GetBlogItems');
//     return response.data;
//   },

//   async getPostsByCategory(category: string) {
//     const response = await apiClient.get<BlogItemModel[]>(`/Blog/GetBlogItemByCategory/${category}`);
//     return response.data;
//   },

//   // UPDATE
//   async updatePost(post: BlogItemModel) {
//     const response = await apiClient.post('/Blog/UpdateBlogItems', post);
//     return response.data;
//   },

//   // DELETE
//   async deletePost(userId: number, blogId: number) {
//     const response = await apiClient.delete(`/Blog/DeleteBlogItem/${userId}/${blogId}`);
//     return response.data;
//   }
// };




