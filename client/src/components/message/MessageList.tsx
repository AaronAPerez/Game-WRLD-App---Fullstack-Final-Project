import { useEffect, useRef, useCallback } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';;
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
<<<<<<< HEAD:client/src/components/chat/MessageList.tsx
import { DirectMessage, UserProfileDTO } from '../../types';
=======
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';

import { MessageStatus } from '../message/MessageStatus';
import { MessageReactions } from '../message/MessageReactions';
import type { ChatMessage } from '../../types';
import { MessageBubble } from './MessageBubble';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17:client/src/components/message/MessageList.tsx

interface MessageListProps {
  contactId: number;
  currentUser: UserProfileDTO;
}

export function MessageList({ contactId, currentUser }: MessageListProps) {
  const queryClient = useQueryClient();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loadMoreRef, inView] = useInView();
  const scrollPositionRef = useRef(0);

  // Fetch messages with infinite scroll
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['messages', contactId],
    queryFn: ({ pageParam = 1 }) => 
      chatService.getDirectMessages(contactId, pageParam),
    getNextPageParam: (lastPage) => 
      lastPage.hasMore ? lastPage.nextPage : undefined,
    keepPreviousData: true
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: (messageIds: number[]) =>
      chatService.markMessagesAsRead(messageIds),
    onSuccess: () => {
      queryClient.invalidateQueries(['unreadCount', contactId]);
    }
  });

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    const shouldScroll = scrollPositionRef.current === 0;
    if (shouldScroll) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [data?.pages[0]?.messages]);

  // Load more messages when scrolling up
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Handle message visibility for read status
  const handleMessageVisible = useCallback((messageIds: number[]) => {
    markAsReadMutation.mutate(messageIds);
  }, [markAsReadMutation]);

  // Track scroll position
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    scrollPositionRef.current = e.currentTarget.scrollTop;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 space-y-4"
      onScroll={handleScroll}
    >
      {/* Load more trigger */}
      {hasNextPage && (
        <div ref={loadMoreRef} className="h-1">
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          )}
        </div>
      )}

      {/* Messages */}
      {data?.pages.map((page, i) => (
        <div key={i} className="space-y-4">
          {page.messages.map((message: DirectMessage) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwnMessage={message.sender.id === currentUser.id}
              onVisible={() => handleMessageVisible([message.id])}
            />
          ))}
        </div>
      ))}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  onVisible: () => void;
}

function MessageBubble({ message, isOwnMessage, onVisible }: MessageBubbleProps) {
  const { ref } = useInView({
    onChange: (inView) => {
      if (inView && !isOwnMessage && !message.isRead) {
        onVisible();
      }
    },
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isOwnMessage && "justify-end"
      )}
    >
      {!isOwnMessage && (
        <img
          src={message.sender.avatar || '/default-avatar.png'}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className={cn(
        "max-w-[70%] rounded-xl p-3",
        isOwnMessage
          ? "bg-indigo-500 text-white"
          : "bg-stone-800 text-gray-200"
      )}>
        <p>{message.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs opacity-70">
            {new Date(message.sentAt).toLocaleTimeString()}
          </span>
          {isOwnMessage && message.isRead && (
            <span className="text-xs opacity-70">Read</span>
          )}
        </div>
      </div>
    </motion.div>
  );
}