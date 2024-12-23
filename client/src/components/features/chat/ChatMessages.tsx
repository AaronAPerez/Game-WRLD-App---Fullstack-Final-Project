import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image as ImageIcon,
  Loader2,
  Check,
  CheckCheck,
  Clock,
  Smile
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import type { DirectMessageDTO, UserProfileDTO } from '../../types/index';

interface ChatMessagesProps {
  selectedUser: UserProfileDTO;
}

interface MessageBubbleProps {
  message: DirectMessageDTO;
  isOwn: boolean;
}

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-2 max-w-[80%]",
        isOwn ? "ml-auto" : "mr-auto"
      )}
    >
      {!isOwn && (
        <img
          src={message.sender.avatar || '/default-avatar.png'}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full mt-1"
        />
      )}
      <div className={cn(
        "relative group",
        isOwn ? "order-1" : "order-2"
      )}>
        <div className={cn(
          "px-4 py-2 rounded-2xl",
          isOwn 
            ? "bg-indigo-500 text-white" 
            : "bg-stone-800 text-white"
        )}>
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        <div className={cn(
          "flex items-center gap-1 text-xs mt-1",
          isOwn ? "justify-end" : "justify-start",
          "text-gray-400"
        )}>
          <span>{new Date(message.sentAt).toLocaleTimeString()}</span>
          {isOwn && (
            message.isRead ? (
              <CheckCheck className="w-4 h-4 text-indigo-400" />
            ) : (
              <Check className="w-4 h-4" />
            )
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const ChatMessages = ({ selectedUser }: ChatMessagesProps) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ['directMessages', selectedUser.id],
    queryFn: () => chatService.getDirectMessages(selectedUser.id),
    refetchInterval: 3000 // Poll every 3 seconds for new messages
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return chatService.sendDirectMessage(selectedUser.id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['directMessages', selectedUser.id]);
      setMessage('');
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });

  // Handle typing indicator
  useEffect(() => {
    if (message && !isTyping) {
      setIsTyping(true);
      chatService.sendTypingStatus(selectedUser.id, true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        chatService.sendTypingStatus(selectedUser.id, false);
      }
    }, 2000);

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [message, isTyping, selectedUser.id]);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message.trim());
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-stone-800 flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.avatar || '/default-avatar.png'}
            alt={selectedUser.username}
            className="w-10 h-10 rounded-full"
          />
          <div className={cn(
            "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
            selectedUser.isOnline ? "bg-green-500" : "bg-gray-500"
          )} />
        </div>
        <div>
          <h3 className="font-medium text-white">{selectedUser.username}</h3>
          <p className="text-sm text-gray-400">
            {selectedUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation!</p>
          </div>
        ) : (
          messages?.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender.id === user?.userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing Indicator */}
      <AnimatePresence>
        {selectedUser.isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="px-4 py-2 text-sm text-gray-400"
          >
            {selectedUser.username} is typing...
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Input */}
      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
            <Smile className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className={cn(
              "p-2 rounded-lg transition-colors",
              message.trim()
                ? "text-indigo-400 hover:text-white hover:bg-stone-800"
                : "text-gray-600 cursor-not-allowed"
            )}
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};