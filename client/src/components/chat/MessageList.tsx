import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { ChatMessage } from '../../types/chat';
import { formatChatTime } from '../../utils/chatUtils';
import { cn } from '../../utils/styles';

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId?: number;
}

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <motion.div
          key={message.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "flex",
            message.sender.id === currentUserId ? "justify-end" : "justify-start"
          )}
        >
          <div className={cn(
            "max-w-[70%] rounded-xl p-3",
            message.sender.id === currentUserId
              ? "bg-indigo-500 text-white"
              : "bg-stone-800 text-gray-200"
          )}>
            {message.sender.id !== currentUserId && (
              <p className="text-sm font-medium mb-1">{message.sender.username}</p>
            )}
            <p>{message.content}</p>
            <span className="text-xs opacity-70 mt-1 block">
              {formatChatTime(message.sentAt)}
            </span>
          </div>
        </motion.div>
      ))}
      <div ref={endRef} />
    </div>
  );
};