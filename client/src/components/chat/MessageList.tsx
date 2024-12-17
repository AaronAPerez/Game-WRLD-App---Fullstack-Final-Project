import { useCallback, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';

import { MessageStatus } from './MessageStatus';
import { MessageReactions } from './MessageReactions';
import type { ChatMessage } from '../../types';
import { MessageBubble } from './MessageBubble';

interface MessageListProps {
  roomId: number;
  messages: ChatMessage[];
  onLoadMore: () => void;
  hasMore: boolean;
}

export function MessageList({ roomId, messages, onLoadMore, hasMore }: MessageListProps) {
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement>(null);
  const [loadMoreRef, inView] = useInView();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    if (listRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = listRef.current;
      const isNearBottom = scrollHeight - clientHeight - scrollTop < 100;
      
      if (isNearBottom) {
        listRef.current.scrollTop = scrollHeight;
      }
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load more messages when scrolling up
  useEffect(() => {
    if (inView && hasMore) {
      onLoadMore();
    }
  }, [inView, hasMore]);

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (messageIds: number[]) => {
      await chatService.markMessagesAsRead(roomId, messageIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', roomId]);
    }
  });

  // Handle message intersection observer for read receipts
  const handleMessageInView = useCallback((messageId: number) => {
    markAsReadMutation.mutate([messageId]);
  }, []);

  // Message retry functionality
  const retryMessageMutation = useMutation({
    mutationFn: async (messageId: number) => {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;
      
      await chatService.sendMessage(roomId, message.content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['messages', roomId]);
    }
  });

  return (
    <div 
      ref={listRef}
      className="flex-1 overflow-y-auto px-4 py-2 space-y-4"
    >
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="h-1" />
      )}

      {/* Message groups by date */}
      {groupMessagesByDate(messages).map(([date, dayMessages]) => (
        <div key={date}>
          <div className="sticky top-0 flex justify-center my-2">
            <span className="px-2 py-1 text-xs text-gray-400 bg-stone-900 rounded-full">
              {formatMessageDate(date)}
            </span>
          </div>

          {dayMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onInView={() => handleMessageInView(message.id)}
            >
              <MessageStatus
                messageId={message.id}
                timestamp={message.timestamp}
                isDelivered={message.status === 'delivered'}
                isRead={message.status === 'read'}
                isFailed={message.status === 'failed'}
                onRetry={() => retryMessageMutation.mutate(message.id)}
              />
              <MessageReactions
                messageId={message.id}
                reactions={message.reactions}
              />
            </MessageBubble>
          ))}
        </div>
      ))}
    </div>
  );
}

// Helper functions
function groupMessagesByDate(messages: ChatMessage[]) {
  return messages.reduce((groups, message) => {
    const date = new Date(message.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, ChatMessage[]>);
}

function formatMessageDate(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateString === today.toLocaleDateString()) {
    return 'Today';
  } else if (dateString === yesterday.toLocaleDateString()) {
    return 'Yesterday';
  }
  return date.toLocaleDateString(undefined, { 
    month: 'short', 
    day: 'numeric' 
  });
}