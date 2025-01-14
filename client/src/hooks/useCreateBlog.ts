
import { blogService, BLOG_KEYS } from "@/services/blogService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: blogService.createBlog,
      onSuccess: () => {
        queryClient.invalidateQueries(BLOG_KEYS.lists());
      }
    });
  };