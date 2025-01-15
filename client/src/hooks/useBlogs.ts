import { useQuery } from '@tanstack/react-query';
import { BLOG_KEYS } from '../constants/queryKeys';
import { blogService } from '../services/blogService';
import type { BlogItemModel } from '../types/blog';

export const useBlogs = () => {
  const { data: blogs = [], isLoading, error } = useQuery<BlogItemModel[]>({
    queryKey: BLOG_KEYS.list(),
    queryFn: () => blogService.getPosts(),
  });

  return {
    blogs,
    isLoading,
    error
  };
};