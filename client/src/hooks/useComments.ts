import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { CommentDTO, CreateCommentDTO } from '../types/social';
import axiosInstance from '@/services/api/axiosConfig';

export const useComments = (postId: number) => {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', postId],
    queryFn: () => axiosInstance.get<CommentDTO[]>(`/comments/${postId}`).then(res => res.data)
  });

  const addComment = useMutation({
    mutationFn: (newComment: CreateCommentDTO) => 
      axiosInstance.post('/comments', newComment),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', postId]);
    }
  });

  return {
    comments,
    isLoading,
    addComment: addComment.mutate
  };
};