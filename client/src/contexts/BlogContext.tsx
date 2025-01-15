import gameService from '@/services/api/axiosConfig';
import gameService from '@/services/gameService';
import { BlogItemModel } from '@/types/blog';
import React, { createContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';





interface BlogContextType {
  blogs: BlogItemModel[];
  userBlogs: BlogItemModel[];
  isLoading: boolean;
  createBlog: (data: Omit<BlogItemModel, 'id'>) => Promise<void>;
  updateBlog: (data: BlogItemModel) => Promise<void>;
  deleteBlog: (blogId: string, data: BlogItemModel) => Promise<void>;
  fetchUserBlogs: () => Promise<void>;
  fetchPublishedBlogs: () => Promise<void>;
}

const BlogContext = createContext<BlogContextType | null>(null);

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // const { user } = useAuth();
  const [blogs, setBlogs] = useState<BlogItemModel[]>([]);
  const [userBlogs, setUserBlogs] = useState<BlogItemModel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createBlog = useCallback(async (data: Omit<BlogItemModel, 'id'>) => {
    try {
      setIsLoading(true);
      const success = await gameService.addBlogItem(data);
      if (success) {
        toast.success('Blog post created successfully!');
        if (user?.userId) {
          const updatedBlogs = await gameService.getBlogItemsByUserId(user.userId);
          setUserBlogs(updatedBlogs);
        }
      }
    } catch (error) {
      console.error('Create blog error:', error);
      toast.error('Failed to create blog post');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const updateBlog = useCallback(async (data: BlogItemModel) => {
    try {
      setIsLoading(true);
      const success = await gameService.updateBlogItem(data);
      if (success) {
        toast.success('Blog post updated successfully!');
        if (user?.userId) {
          const updatedBlogs = await gameService.getBlogItemsByUserId(user.userId);
          setUserBlogs(updatedBlogs);
        }
      }
    } catch (error) {
      console.error('Update blog error:', error);
      toast.error('Failed to update blog post');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const deleteBlog = useCallback(async (blogId: string, data: BlogItemModel) => {
    try {
      setIsLoading(true);
      const success = await gameService.deleteBlogItem(blogId, data);
      if (success) {
        toast.success('Blog post deleted successfully!');
        if (user?.userId) {
          const updatedBlogs = await gameService.getBlogItemsByUserId(user.userId);
          setUserBlogs(updatedBlogs);
        }
      }
    } catch (error) {
      console.error('Delete blog error:', error);
      toast.error('Failed to delete blog post');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const fetchUserBlogs = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoading(true);
      const data = await gameService.getBlogItemsByUserId(user.userId);
      setUserBlogs(data);
    } catch (error) {
      console.error('Fetch user blogs error:', error);
      toast.error('Failed to fetch your blog posts');
    } finally {
      setIsLoading(false);
    }
  }, [user?.userId]);

  const fetchPublishedBlogs = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await gameService.getPublishedItems();
      setBlogs(data);
    } catch (error) {
      console.error('Fetch published blogs error:', error);
      toast.error('Failed to fetch blog posts');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <BlogContext.Provider 
      value={{
        blogs,
        userBlogs,
        isLoading,
        createBlog,
        updateBlog,
        deleteBlog,
        fetchUserBlogs,
        fetchPublishedBlogs
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

