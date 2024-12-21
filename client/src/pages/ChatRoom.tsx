import { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuthStore } from '../store/authStore';
import { Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatRoomProps {
  chatId: number;
}

export function ChatRoom({ chatId }: ChatRoomProps) {
  const { messages, sendMessage, isLoading, isSending } = useChat(chatId);
  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messageInput, setMessageInput] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      sendMessage(messageInput);
      setMessageInput('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-stone-900">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages?.map((message: MessageDto) => (
            <Message
              key={message.id}
              message={message}
              isOwnMessage={message.userId === user?.id}
            />
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSendMessage}
        className="border-t border-stone-800 p-4 bg-stone-900"
      >
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-stone-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSending || !messageInput.trim()}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Message Component
interface MessageProps {
  message: MessageDto;
  isOwnMessage: boolean;
}

function Message({ message, isOwnMessage }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div
        className={`max-w-[70%] rounded-lg px-4 py-2 ${
          isOwnMessage
            ? 'bg-blue-600 text-white'
            : 'bg-stone-800 text-gray-100'
        }`}
      >
        {!isOwnMessage && (
          <div className="text-sm text-gray-400 mb-1">{message.user.firstName}</div>
        )}
        <p>{message.content}</p>
        <div className="text-xs text-gray-400 mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  );
}