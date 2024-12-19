import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { UserPlus, Loader2, Users } from 'lucide-react';
import { cn } from '../../utils/styles';
import { friendService } from '../../services/friendService';
import { toast } from 'react-hot-toast';

export function FriendSuggestions() {
  const queryClient = useQueryClient();

  // Get friend suggestions based on mutual friends and interests
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['friendSuggestions'],
    queryFn: async () => {
      const response = await friendService.getFriendSuggestions();
      return response.data;
    },
    staleTime: 5 * 60 * 1000 // Cache for 5 minutes
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: friendService.sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['friendSuggestions']);
      toast.success('Friend request sent!');
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!suggestions.length) {
    return (
      <div className="text-center p-8 text-gray-400">
        <Users className="w-12 h-12 mx-auto mb-4" />
        <p>No suggestions available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {suggestions.map((suggestion) => (
        <motion.div
          key={suggestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-stone-900 rounded-lg p-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={suggestion.avatar || '/default-avatar.png'}
              alt={suggestion.username}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-medium text-white">
                {suggestion.username}
              </h3>
              <p className="text-sm text-gray-400">
                {suggestion.mutualFriends} mutual friends
              </p>
            </div>
            <button
              onClick={() => sendRequestMutation.mutate(suggestion.username)}
              disabled={sendRequestMutation.isPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg",
                "bg-indigo-500/20 text-indigo-400",
                "hover:bg-indigo-500/30 transition-colors"
              )}
            >
              <UserPlus className="w-4 h-4" />
              Add Friend
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}