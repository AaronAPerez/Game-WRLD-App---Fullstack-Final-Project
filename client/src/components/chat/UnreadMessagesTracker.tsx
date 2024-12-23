import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useChatStore } from '../../store/chatStore';
import { chatService } from '../../services/chatService';
import { toast } from 'react-hot-toast';
import { useChat } from '../../hooks/useChat';

interface UnreadCount {
  [contactId: number]: number;
}

export function UnreadMessagesTracker() {
  const queryClient = useQueryClient();
  const { connection } = useChat();
  const { activeConversation } = useChatStore();

  // Fetch unread counts
  const { data: unreadCounts = {} } = useQuery<UnreadCount>({
    queryKey: ['unreadCounts'],
    queryFn: chatService.getUnreadCounts,
    refetchInterval: 60000 // Refresh every minute
  });

  // Listen for new messages
  useEffect(() => {
    if (!connection) return;

    connection.on('ReceiveDirectMessage', (message) => {
      // Update unread count if message is not from active conversation
      if (message.sender.id !== activeConversation?.id) {
        queryClient.setQueryData<UnreadCount>(['unreadCounts'], (old = {}) => ({
          ...old,
          [message.sender.id]: (old[message.sender.id] || 0) + 1
        }));

        // Show notification
        toast(
          <div className="flex items-center gap-3">
            <img
              src={message.sender.avatar || '/default-avatar.png'}
              alt={message.sender.username}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="font-medium">{message.sender.username}</p>
              <p className="text-sm opacity-80">{message.content}</p>
            </div>
          </div>,
          {
            duration: 4000,
            icon: '💬'
          }
        );
      }
    });

    return () => {
      connection.off('ReceiveDirectMessage');
    };
  }, [connection, activeConversation, queryClient]);

  // Return unread badge component
  return function UnreadBadge({ contactId }: { contactId: number }) {
    const unreadCount = unreadCounts[contactId] || 0;
    
    if (unreadCount === 0) return null;

    return (
      <div className="px-2 py-0.5 bg-red-500 rounded-full text-white text-xs font-medium">
        {unreadCount > 99 ? '99+' : unreadCount}
      </div>
    );
  };
}