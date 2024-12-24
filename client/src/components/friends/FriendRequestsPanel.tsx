import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Check, X } from 'lucide-react';
import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';

export const FriendRequestsPanel = () => {
  const queryClient = useQueryClient();

  // Fetch friend requests
  const { data: friendRequests, isLoading } = useQuery(
    ['friendRequests'], 
    chatService.getFriendRequests
  );

  // Respond to friend request mutation
  const respondToRequestMutation = useMutation(
    ({ requestId, accept }: { requestId: number; accept: boolean }) => 
      chatService.respondToFriendRequest(requestId, accept),
    {
      onSuccess: () => {
        // Invalidate and refetch friend requests
        queryClient.invalidateQueries(['friendRequests']);
        toast.success('Friend request processed');
      },
      onError: (error) => {
        toast.error('Failed to process friend request');
        console.error(error);
      }
    }
  );

  const handleResponse = (requestId: number, accept: boolean) => {
    respondToRequestMutation.mutate({ requestId, accept });
  };

  return (
    <div className="bg-stone-900 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <Users className="w-6 h-6 text-indigo-500" />
          Friend Requests
        </h2>
        {friendRequests?.length > 0 && (
          <span className="text-sm text-gray-400">
            {friendRequests.length} pending
          </span>
        )}
      </div>

      <AnimatePresence>
        {isLoading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : friendRequests?.length === 0 ? (
          <div className="text-center text-gray-400">
            No friend requests
          </div>
        ) : (
          friendRequests?.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between p-3 bg-stone-800 rounded-lg mb-2"
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
                    Wants to be your friend
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleResponse(request.id, true)}
                  className="p-2 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/30"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleResponse(request.id, false)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/30"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  );
};