import { BLOG_KEYS, blogService } from "@/services/blogService";
import { useQuery } from "@tanstack/react-query";


export const useBlogs = (options?: { category?: string; tag?: string; userId?: number }) => {
  return useQuery({
    queryKey: BLOG_KEYS.list(JSON.stringify(options)),
    queryFn: async () => {
      if (options?.category) return blogService.getBlogsByCategory(options.category);
      if (options?.tag) return blogService.getBlogsByTag(options.tag);
      if (options?.userId) return blogService.getBlogsByUserId(options.userId);
      return blogService.getAllBlogs();
    }
  });
};