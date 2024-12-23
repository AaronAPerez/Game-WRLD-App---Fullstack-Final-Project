import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, UserPlus, Loader2, X } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../utils/styles';
import { friendService } from '../../services/friendService';
import { toast } from 'react-hot-toast';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddFriendModal({ isOpen, onClose }: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Search users
  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => friendService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: friendService.sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['friendRequests']);
      toast.success('Friend request sent!');
    },
    onError: () => {
      toast.error('Failed to send friend request');
    }
  });

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-stone-900 rounded-xl p-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Add Friend</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

       {/* Search Input */}
       <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by username..."
            className={cn(
              "w-full pl-10 pr-4 py-3 bg-stone-800 rounded-lg",
              "text-white placeholder:text-gray-400",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500"
            )}
          />
        </div>

        {/* Search Results */}
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
          ) : !searchResults?.length ? (
            <div className="text-center py-8 text-gray-400">
              {searchQuery.length < 2 ? (
                <p>Enter at least 2 characters to search</p>
              ) : (
                <p>No users found</p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {searchResults.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-4 p-4 bg-stone-800 rounded-lg"
                >
                  <img
                    src={user.avatar || '/default-avatar.png'}
                    alt={user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-white">
                      {user.username}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {user.mutualFriends} mutual friends
                    </p>
                  </div>
                  <button
                    onClick={() => sendRequestMutation.mutate(user.username)}
                    disabled={sendRequestMutation.isPending}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg",
                      "bg-indigo-500/20 text-indigo-400",
                      "hover:bg-indigo-500/30 transition-colors",
                      "disabled:opacity-50 disabled:cursor-not-allowed"
                    )}
                  >
                    {sendRequestMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Add Friend
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}