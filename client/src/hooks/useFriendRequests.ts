import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from 'react-hot-toast';
import { userService } from '../services/userService';

export function useFriendRequests() {
  const queryClient = useQueryClient();

  const sendRequest = useMutation({
    mutationFn: userService.sendFriendRequest,
    onSuccess: () => {
      toast.success('Friend request sent');
      queryClient.invalidateQueries(['friendRequests']);
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  const respondToRequest = useMutation({
    mutationFn: async ({ requestId, accept }: { requestId: number; accept: boolean }) => {
      await userService.respondToFriendRequest(requestId, accept);
    },
    onSuccess: (_, variables) => {
      toast.success(variables.accept ? 'Friend request accepted' : 'Friend request declined');
      queryClient.invalidateQueries(['friendRequests']);
      queryClient.invalidateQueries(['friends']);
    },
    onError: () => {
      toast.error('Failed to respond to friend request');
    }
  });

  return {
    sendRequest,
    respondToRequest
  };
}