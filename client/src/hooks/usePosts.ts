// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useAuth } from '../contexts/AuthContext';

// import { CreatePostDto, Post } from '../types/social';


// export const usePosts = (category?: string) => {
//   const queryClient = useQueryClient();
//   const { user } = useAuth();

//   const queryKey = category ? ['posts', category] : ['posts'];

//   const { data: posts, isLoading, error } = useQuery({
//     queryKey,
//     queryFn: () => category ? socialService.getPostsByCategory(category) : socialService.getPosts(),
//     staleTime: 1000 * 60, // 1 minute
//   });

//   const createPostMutation = useMutation({
//     mutationFn: (newPost: CreatePostDto) => socialService.createPost(newPost),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });

//   const updatePostMutation = useMutation({
//     mutationFn: (post: Post) => socialService.updatePost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });

//   const deletePostMutation = useMutation({
//     mutationFn: (postId: string) => socialService.deletePost(postId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['posts'] });
//     },
//   });

//   return {
//     posts: posts || [],
//     isLoading,
//     error,
//     createPost: createPostMutation.mutate,
//     updatePost: updatePostMutation.mutate,
//     deletePost: deletePostMutation.mutate,
//     isCreating: createPostMutation.isPending,
//     isUpdating: updatePostMutation.isPending,
//     isDeleting: deletePostMutation.isPending,
//   };
// };
