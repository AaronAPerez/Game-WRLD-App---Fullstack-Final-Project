import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../api/user';
import { toast } from 'react-hot-toast';
import type { 
  UserProfileDTO, 
  FriendRequestDTO, 
  FriendStatus 
} from '../types';

export const useFriends = () => {
  const queryClient = useQueryClient();

  // Get friends list
  const { data: friends = [] } = useQuery({
    queryKey: ['friends'],
    queryFn: userService.getFriends
  });

  // Get friend requests
  const { data: requests = { received: [], sent: [] } } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: userService.getFriendRequests
  });

  // Send friend request
  const sendRequestMutation = useMutation({
    mutationFn: userService.sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      toast.success('Friend request sent!');
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  // Respond to friend request
  const respondToRequestMutation = useMutation({
    mutationFn: userService.respondToFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
  });

  return {
    friends,
    requests,
    sendRequest: sendRequestMutation.mutate,
    respondToRequest: respondToRequestMutation.mutate
  };
};