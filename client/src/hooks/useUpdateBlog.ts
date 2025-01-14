import { BLOG_KEYS, blogService } from "@/services/blogService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: blogService.updateBlog,
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries(BLOG_KEYS.lists());
        queryClient.invalidateQueries(BLOG_KEYS.detail(variables.id));
      }
    });
  };