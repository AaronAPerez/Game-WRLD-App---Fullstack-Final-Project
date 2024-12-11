import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, UserPlus, Bell, X, Check, Mail } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cn } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';
import { UserService } from '../../services/userService';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import type { ChatMessage, DirectMessage } from '../../types/chat';

// Types for notifications
interface Notification {
  id: string;
  type: 'friendRequest' | 'message' | 'chat';
  data: any;
  timestamp: Date;
  read: boolean;
}

// NotificationBell Component
export const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { isConnected } = useChat();
  const queryClient = useQueryClient();

  // Query for friend requests
  const { data: friendRequests } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: UserService.getFriendRequests,
    enabled: !!user
  });

  // Mutation for handling friend requests
  const respondToRequestMutation = useMutation({
    mutationFn: ({ requestId, accept }: { requestId: number; accept: boolean }) =>
      UserService.respondToFriendRequest(requestId, accept),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    }
  });

  // Handle incoming chat messages
  useEffect(() => {
    if (!isConnected) return;

    const handleChatMessage = (message: ChatMessage) => {
      const notification: Notification = {
        id: `chat-${Date.now()}`,
        type: 'chat',
        data: message,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      toast.custom((t) => (
        <div
          className={cn(
            'bg-stone-900 border border-stone-800 rounded-lg p-4 flex items-center gap-3',
            t.visible ? 'animate-enter' : 'animate-leave'
          )}
        >
          <MessageSquare className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="font-medium text-white">New message in {message.chatRoomId}</p>
            <p className="text-sm text-gray-400">{message.content}</p>
          </div>
        </div>
      ));
    };

    const handleDirectMessage = (message: DirectMessage) => {
      if (message.sender.id === user?.userId) return;

      const notification: Notification = {
        id: `dm-${Date.now()}`,
        type: 'message',
        data: message,
        timestamp: new Date(),
        read: false
      };
      setNotifications(prev => [notification, ...prev]);
      toast.custom((t) => (
        <div
          className={cn(
            'bg-stone-900 border border-stone-800 rounded-lg p-4 flex items-center gap-3',
            t.visible ? 'animate-enter' : 'animate-leave'
          )}
        >
          <Mail className="w-5 h-5 text-indigo-400" />
          <div>
            <p className="font-medium text-white">Message from {message.sender.username}</p>
            <p className="text-sm text-gray-400">{message.content}</p>
          </div>
        </div>
      ));
    };

    chatService.onMessage(handleChatMessage);
    chatService.onDirectMessage(handleDirectMessage);

    return () => {
      // Clean up listeners
    };
  }, [isConnected, user?.userId]);

  // Handle incoming friend requests
  useEffect(() => {
    if (!friendRequests) return;

    const newRequests = friendRequests.received.filter((request: { isRead: any; }) => !request.isRead);
    newRequests.forEach((request: { id: any; createdAt: string | number | Date; }) => {
      const notification: Notification = {
        id: `friend-${request.id}`,
        type: 'friendRequest',
        data: request,
        timestamp: new Date(request.createdAt),
        read: false
      };
      setNotifications(prev => 
        prev.some(n => n.id === notification.id) 
          ? prev 
          : [notification, ...prev]
      );
    });
  }, [friendRequests]);

  const handleAcceptFriend = async (requestId: number) => {
    try {
      await respondToRequestMutation.mutateAsync({ requestId, accept: true });
      toast.success('Friend request accepted');
      // Remove notification
      setNotifications(prev => prev.filter(n => n.id !== `friend-${requestId}`));
    } catch (error) {
      toast.error('Failed to accept friend request');
    }
  };

  const handleRejectFriend = async (requestId: number) => {
    try {
      await respondToRequestMutation.mutateAsync({ requestId, accept: false });
      toast.success('Friend request rejected');
      // Remove notification
      setNotifications(prev => prev.filter(n => n.id !== `friend-${requestId}`));
    } catch (error) {
      toast.error('Failed to reject friend request');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          "hover:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        )}
      >
        <Bell className="w-6 h-6 text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-80 bg-stone-900 rounded-xl border border-stone-800 shadow-lg overflow-hidden"
          >
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <h3 className="font-medium text-white">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-400">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No new notifications</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-4 border-b border-stone-800",
                      !notification.read && "bg-stone-800/50"
                    )}
                  >
                    {notification.type === 'friendRequest' && (
                      <FriendRequestNotification
                        request={notification.data}
                        onAccept={() => handleAcceptFriend(notification.data.id)}
                        onReject={() => handleRejectFriend(notification.data.id)}
                      />
                    )}
                    {notification.type === 'message' && (
                      <MessageNotification message={notification.data} />
                    )}
                    {notification.type === 'chat' && (
                      <ChatNotification message={notification.data} />
                    )}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Individual notification components
const FriendRequestNotification = ({
  request,
  onAccept,
  onReject
}: {
  request: any;
  onAccept: () => void;
  onReject: () => void;
}) => (
  <div>
    <div className="flex items-center gap-3 mb-3">
      <UserPlus className="w-5 h-5 text-indigo-400" />
      <div>
        <p className="font-medium text-white">{request.requester.username}</p>
        <p className="text-sm text-gray-400">Sent you a friend request</p>
      </div>
    </div>
    <div className="flex gap-2">
      <button
        onClick={onAccept}
        className="flex-1 px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors"
      >
        <Check className="w-4 h-4" />
      </button>
      <button
        onClick={onReject}
        className="flex-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  </div>
);

const MessageNotification = ({ message }: { message: DirectMessage }) => (
  <div className="flex items-center gap-3">
    <Mail className="w-5 h-5 text-indigo-400" />
    <div>
      <p className="font-medium text-white">{message.sender.username}</p>
      <p className="text-sm text-gray-400">{message.content}</p>
    </div>
  </div>
);

const ChatNotification = ({ message }: { message: ChatMessage }) => (
  <div className="flex items-center gap-3">
    <MessageSquare className="w-5 h-5 text-indigo-400" />
    <div>
      <p className="font-medium text-white">New message in chat</p>
      <p className="text-sm text-gray-400">{message.content}</p>
    </div>
  </div>
);

function useChat(): { isConnected: any; } {
  throw new Error('Function not implemented.');
}
