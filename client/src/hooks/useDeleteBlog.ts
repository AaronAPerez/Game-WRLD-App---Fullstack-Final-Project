
export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
      mutationFn: blogService.deleteBlog,
      onSuccess: () => {
        queryClient.invalidateQueries(BLOG_KEYS.lists());
      }
    });
  };