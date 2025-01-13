// src/hooks/useBlog.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../lib/queryClient';
import { blogService } from '../services/blogService';
import { toast } from 'react-hot-toast';
import { CreatePostDto } from '../types/blog';
import { useNavigate } from 'react-router-dom';

export const useBlog = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch all posts
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.blog.posts(),
    queryFn: () => blogService.getPosts(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Create post mutation
  const createPost = useMutation({
    mutationFn: (data: CreatePostDto) => blogService.createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.posts() });
      toast.success('Post created successfully');
      navigate('/blog');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create post');
    },
  });

  // Delete post mutation
  const deletePost = useMutation({
    mutationFn: (postId: string) => blogService.deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.blog.posts() });
      toast.success('Post deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete post');
    },
  });

  // Like post mutation
  const likePost = useMutation({
    mutationFn: (postId: string) => blogService.likePost(postId),
    onSuccess: (data, postId) => {
      queryClient.setQueryData(QUERY_KEYS.blog.post(Number(postId)), (oldData: any) => ({
        ...oldData,
        likes: data.likes,
      }));
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to like post');
    },
  });

  return {
    posts,
    isLoading,
    error,
    createPost: createPost.mutate,
    deletePost: deletePost.mutate,
    likePost: likePost.mutate,
    isCreating: createPost.isPending,
    isDeleting: deletePost.isPending,
  };
};

// Blog post hook for single post
export const useBlogPost = (postId: string) => {
  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: QUERY_KEYS.blog.post(Number(postId)),
    queryFn: () => blogService.getPostById(postId),
    enabled: !!postId,
  });

  return {
    post,
    isLoading,
    error,
  };
};