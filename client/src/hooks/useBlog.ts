import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogService } from '../services/blogService';
import type { CreateBlogPostDTO, BlogPostDTO } from '../types/blog';
import { toast } from 'react-hot-toast';

export function useBlogPosts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  userId?: number;
}) {
  return useQuery({
    queryKey: ['blogs', params],
    queryFn: () => blogService.getPosts(params),
    keepPreviousData: true
  });
}

export function useBlogPost(id: number) {
  return useQuery({
    queryKey: ['blog', id],
    queryFn: () => blogService.getPost(id),
    enabled: !!id
  });
}

export function useCreateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateBlogPostDTO) => blogService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      toast.success('Blog post created successfully');
    },
    onError: () => {
      toast.error('Failed to create blog post');
    }
  });
}

export function useUpdateBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogPostDTO> }) => 
      blogService.updatePost(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      toast.success('Blog post updated successfully');
    },
    onError: () => {
      toast.error('Failed to update blog post');
    }
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => blogService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blogs']);
      toast.success('Blog post deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete blog post');
    }
  });
}
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { blogService } from '../services/blogService';
// import { toast } from 'react-hot-toast';

// export const useBlog = () => {
//   const queryClient = useQueryClient();

//   // Query for fetching blogs
//   const blogsQuery = useQuery({
//     queryKey: ['blogs'],
//     queryFn: blogService.getAllPosts
//   });

//   // Create mutation
//   const createMutation = useMutation({
//     mutationFn: blogService.createPost,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['blogs']);
//       toast.success('Blog post created successfully');
//     }
//   });

//   // Update mutation
//   const updateMutation = useMutation({
//     mutationFn: blogService.updatePost,
//     onSuccess: () => {
//       queryClient.invalidateQueries(['blogs']);
//       toast.success('Blog post updated successfully');
//     }
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: ({ userId, blogId }: { userId: number; blogId: number }) => 
//       blogService.deletePost(userId, blogId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['blogs']);
//       toast.success('Blog post deleted successfully');
//     }
//   });

//   return {
//     blogs: blogsQuery.data,
//     isLoading: blogsQuery.isLoading,
//     createPost: createMutation.mutate,
//     updatePost: updateMutation.mutate,
//     deletePost: deleteMutation.mutate
//   };
// };

