import { useQuery } from "@tanstack/react-query";
import { socialService } from "../services/socialService";

export const useUserPosts = (userId: number) => {
    const { data: posts, isLoading, error } = useQuery({
      queryKey: ['posts', 'user', userId],
      queryFn: () => socialService.getPostsByUser(userId),
      enabled: !!userId,
      staleTime: 1000 * 60, // 1 minute
    });
  
    return {
      posts: posts || [],
      isLoading,
      error,
    };
  };