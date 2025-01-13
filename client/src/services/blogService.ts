import { BlogItemModel } from "../types/blog";
import { api } from "./api";





export const blogService = {
  // Create new blog post
  async createPost(data: BlogItemModel) {
    const response = await api.post('/Blog/AddBlogItems', data);
    return response.data;
  },

  // Get all blog posts with pagination
  async getPosts(params?: { 
    page?: number; 
    pageSize?: number;
    category?: string;
    userId?: number;
  }): Promise<BlogListResponse> {
    const response = await api.get('/Blog/GetBlogItems', { params });
    return response.data;
  },

  // Get single blog post
  async getPost(id: number): Promise<BlogItemModel> {
    const response = await api.get(`/Blog/GetBlogItemByCategory/${id}`);
    return response.data;
  },

  // Update blog post
  async updatePost(id: number, data: Partial<BlogItemModel>) {
    const response = await api.post('/Blog/UpdateBlogItems', {
      id,
      ...data
    });
    return response.data;
  },

  // Delete blog post
  async deletePost(id: number) {
    const response = await api.post(`/Blog/DeleteBlogItem/${id}`);
    return response.data;
  },

  // Get posts by category
  async getPostsByCategory(category: string): Promise<BlogItemModel[]> {
    const response = await api.get(`/Blog/GetBlogItemByCategory/${category}`);
    return response.data;
  },

  // Get user's posts
  async getUserPosts(userId: number): Promise<BlogItemModel[]> {
    const response = await api.get(`/Blog/GetItemsByUserId/${userId}`);
    return response.data;
  },
   // Get comments for a blog post
   async getBlogComments(blogId: number): Promise<BlogItemModel[]> {
    const response = await api.get(`/Blog/${blogId}/comments`);
    return response.data;
  },
    // Add a new comment
    async addComment(blogId: number, content: string): Promise<BlogItemModel> {
      const response = await api.post(`/Blog/${blogId}/comments`, { content });
      return response.data;
    },

    // Delete a comment
    async deleteComment(blogId: number, commentId: number): Promise<boolean> {
      const response = await api.delete(`/Blog/${blogId}/comments/${commentId}`);
      return response.data;
    }
  };




