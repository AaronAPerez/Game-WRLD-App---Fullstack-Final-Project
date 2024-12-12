import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useChat } from '../../contexts/ChatContext';
import { UserService } from '../../services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();
  const { isConnected } = useChat();

  // Get friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: UserService.getFriendRequests,
    enabled: isConnected
  });

  // Get unread messages
  // Update queries to depend on connection status
  const { data: unreadMessages } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: UserService.getUnreadMessages,
    enabled: isConnected
  });

  // Handle friend request response
  const respondToRequestMutation = useMutation({
    mutationFn: ({ requestId, accept }: { requestId: number; accept: boolean }) =>
      UserService.respondToFriendRequest(requestId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    }
  });

  const totalNotifications = 
    (unreadMessages?.length || 0) + 
    (friendRequests?.received?.length || 0);

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          "hover:bg-stone-800 group"
        )}
      >
        <Bell className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
        {totalNotifications > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-medium text-white">
              {totalNotifications}
            </span>
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-stone-900 rounded-xl border border-stone-800 shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <h3 className="font-medium text-white">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto">
              {friendRequests?.received?.map((request) => (
                <div key={request.id} className="p-4 hover:bg-stone-800/50 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={request.requester.avatar || '/default-avatar.png'}
                      alt={request.requester.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {request.requester.username}
                      </p>
                      <p className="text-sm text-gray-400">
                        Sent you a friend request
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: true 
                      })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: false 
                      })}
                      className="flex-1 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {unreadMessages?.map((message) => (
                <div key={message.id} className="p-4 hover:bg-stone-800/50 border-b border-stone-800">
                  <div className="flex items-center gap-3">
                    <img
                      src={message.sender.avatar || '/default-avatar.png'}
                      alt={message.sender.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {message.sender.username}
                      </p>
                      <p className="text-sm text-gray-400 truncate">
                        {message.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {totalNotifications === 0 && (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};