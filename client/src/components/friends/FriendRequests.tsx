import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Users, 
  Check, 
  X, 
  Search,
  Loader2 
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/styles';
import type { FriendRequest } from '../../types/chat';

export function FriendRequests() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch friend requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: chatService.getFriendRequests,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Send friend request mutation
  const sendRequestMutation = useMutation({
    mutationFn: (username: string) => chatService.sendFriendRequest(username),
    onSuccess: () => {
      toast.success('Friend request sent');
      queryClient.invalidateQueries(['friendRequests']);
    },
  });

  // Respond to friend request mutation
  const respondToRequestMutation = useMutation({
    mutationFn: ({ requestId, accept }: { requestId: number; accept: boolean }) =>
      chatService.respondToFriendRequest(requestId, accept),
    onSuccess: (_, variables) => {
      toast.success(
        variables.accept ? 'Friend request accepted' : 'Friend request declined'
      );
      queryClient.invalidateQueries(['friendRequests']);
    },
  });

  // Search users query
  const { data: searchResults, isLoading: isSearching } = useQuery({
    queryKey: ['userSearch', searchQuery],
    queryFn: () => chatService.searchUsers(searchQuery),
    enabled: searchQuery.length >= 2,
  });

  return (
    <div className="space-y-6">
      {/* Search Users */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search users to add..."
          className="w-full pl-10 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
        />
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {searchQuery.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 overflow-hidden"
          >
            {isSearching ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : searchResults?.length === 0 ? (
              <p className="text-center text-gray-400">No users found</p>
            ) : (
              searchResults?.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-stone-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar || '/default-avatar.png'}
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-white">{user.username}</p>
                      <p className="text-sm text-gray-400">
                        {user.friendsCount} friends • {user.gamesCount} games
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => sendRequestMutation.mutate(user.username)}
                    disabled={sendRequestMutation.isPending}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
                      "bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                    )}
                  >
                    {sendRequestMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        <span>Add Friend</span>
                      </>
                    )}
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pending Requests */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Pending Requests
          </h2>
          {requests?.length > 0 && (
            <span className="px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-sm">
              {requests.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : requests?.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No pending friend requests
          </p>
        ) : (
          <div className="space-y-3">
            {requests?.map((request: FriendRequest) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 bg-stone-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={request.requester.avatar || '/default-avatar.png'}
                    alt={request.requester.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-white">
                      {request.requester.username}
                    </p>
                    <p className="text-sm text-gray-400">
                      Sent {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => 
                      respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: true 
                      })
                    }
                    className="p-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => 
                      respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: false 
                      })
                    }
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}