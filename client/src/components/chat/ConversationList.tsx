import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { MessageSquare, Users } from 'lucide-react';
import { cn } from '../../utils/styles';
import type { UserProfileDTO } from '../../types/chat';
import { chatService } from '../../services/chatService';

interface ConversationListProps {
  onUserClick: (user: UserProfileDTO) => void;
}

export function ConversationList({ onUserClick }: ConversationListProps) {
  // Fetch friends and active conversations
  const { data: conversations } = useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getActiveConversations,
  });

  // Get unread message counts
  const { data: unreadCounts } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: chatService.getUnreadMessagesCount,
    refetchInterval: 10000,
  });

  // Get friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: chatService.getFriendRequests,
  });

  const pendingRequests = friendRequests?.filter(req => req.status === 'pending');

  return (
    <div className="h-full overflow-y-auto">
      {/* Friend Requests Section */}
      {pendingRequests && pendingRequests.length > 0 && (
        <div className="p-4 border-b border-stone-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-400">Friend Requests</h3>
            <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full text-xs">
              {pendingRequests.length}
            </span>
          </div>
          <div className="space-y-2">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-stone-800 rounded-lg"
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
                    <p className="text-sm text-gray-400">Wants to be friends</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Active Conversations */}
      <div className="divide-y divide-stone-800">
        {conversations?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-2" />
            <p>No conversations yet</p>
            <p className="text-sm">Search for users to start chatting</p>
          </div>
        ) : (
          conversations?.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserClick(user)}
              className="w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors"
            >
              <div className="relative">
                <img
                  src={user.avatar || '/default-avatar.png'}
                  alt={user.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
                  user.status === 'online'
                    ? "bg-green-500"
                    : user.status === 'ingame'
                      ? "bg-indigo-500"
                      : "bg-gray-500"
                )} />
              </div>

              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-white">{user.username}</h3>
                  {unreadCounts?.[user.id] > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-500 rounded-full text-xs text-white">
                      {unreadCounts[user.id]}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {user.status === 'online'
                    ? 'Online'
                    : user.status === 'ingame'
                      ? 'In Game'
                      : 'Offline'}
                </p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}