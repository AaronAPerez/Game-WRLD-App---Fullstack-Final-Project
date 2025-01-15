import { BLOG_KEYS, blogService } from "@/services/blogService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: blogService.deleteBlog,
      onSuccess: () => {
        queryClient.invalidateQueries(BLOG_KEYS.lists());
      }
    });
  };