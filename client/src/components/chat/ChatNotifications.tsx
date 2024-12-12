import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, MessageSquare, UserPlus, Check, X, User } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/styles';
import { useChatStore } from '../store/chatStore';
import { UserService } from '../../services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DirectMessage } from '../../types/chat';

const ChatNotifications = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const queryClient = useQueryClient();
  const unreadMessages = useChatStore(state => state.unreadMessages);

  // Get friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: UserService.getFriendRequests
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
            <div className="p-4 border-b border-stone-800">
            <h3 className="text-lg font-medium text-white">Notifications</h3>
            </div>

            {/* Notifications List */}
            <div className="max-h-[400px] overflow-y-auto divide-y divide-stone-800">
              {/* Friend Requests Section */}
              {friendRequests?.received?.map((request) => (
                <div key={request.id} className="p-4 hover:bg-stone-800/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={request.requester.avatar || '/default-avatar.png'}
                        alt={request.requester.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                        <UserPlus className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-white">{request.requester.username}</span>
                        <span className="text-gray-400"> sent you a friend request</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: true 
                      })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Accept
                    </button>
                    <button
                      onClick={() => respondToRequestMutation.mutate({ 
                        requestId: request.id, 
                        accept: false 
                      })}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}

              {/* Unread Messages Section */}
              {unreadMessages?.map((message) => (
                <div key={message.id} className="p-4 hover:bg-stone-800/50">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={message.sender.avatar || '/default-avatar.png'}
                        alt={message.sender.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <MessageSquare className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium text-white">{message.sender.username}</span>
                        <span className="text-gray-400"> sent you a message</span>
                      </p>
                      <p className="text-xs text-gray-400 line-clamp-1">{message.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.sentAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Empty State */}
              {!totalNotifications && (
                <div className="py-12 text-center">
                  <Bell className="w-12 h-12 mx-auto text-gray-600 mb-3" />
                  <p className="text-gray-400">No new notifications</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {totalNotifications > 0 && (
              <div className="p-2 border-t border-stone-800">
                <button
                  onClick={() => {
                    // Mark all as read
                    useChatStore.getState().markAllAsRead();
                    // Close dropdown
                    setShowNotifications(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click Outside Handler */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

// Notification Variants
const notificationVariants = {
  initial: { opacity: 0, y: -10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 }
};

// Toast Notifications
export const showNotificationToast = (notification: {
  type: 'message' | 'friend_request' | 'friend_accepted';
  user: { username: string; avatar?: string };
  message?: string;
}) => {
  const { type, user, message } = notification;

  toast.custom((t) => (
    <motion.div
      variants={notificationVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn(
        "max-w-md w-full bg-stone-900 rounded-lg shadow-lg border border-stone-800",
        "pointer-events-auto flex items-center gap-4 p-4"
      )}
    >
      <div className="relative flex-shrink-0">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt={user.username}
          className="w-12 h-12 rounded-full"
        />
        <div className={cn(
          "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center",
          type === 'message' ? "bg-green-500" : "bg-indigo-500"
        )}>
          {type === 'message' ? (
            <MessageSquare className="w-3 h-3 text-white" />
          ) : (
            <UserPlus className="w-3 h-3 text-white" />
          )}
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">
          {user.username}
        </p>
        <p className="text-sm text-gray-400 truncate">
          {type === 'message' && message}
          {type === 'friend_request' && 'sent you a friend request'}
          {type === 'friend_accepted' && 'accepted your friend request'}
        </p>
      </div>

      <button
        onClick={() => toast.dismiss(t.id)}
        className="flex-shrink-0 text-gray-400 hover:text-white"
      >
        <X className="w-5 h-5" />
      </button>
    </motion.div>
  ), {
    duration: 5000,
    position: 'top-right'
  });
};

export default ChatNotifications;