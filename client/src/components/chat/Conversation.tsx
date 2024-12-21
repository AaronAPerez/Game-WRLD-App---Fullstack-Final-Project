import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image as ImageIcon, 
  Paperclip,
  ArrowLeft,
  MoreVertical,
  Loader2,
  Check,
  CheckCheck,
  X,
  UserPlus
} from 'lucide-react';
import { useChat } from '../../hooks/useChat';

import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';
import { TypingIndicator } from '../TypingIndicator';
import type { DirectMessage, UserProfileDTO } from '../../types/index';
import { useAuth } from '../../hooks/useAuth';

interface ConversationProps {
  contact: UserProfileDTO;
  onBack?: () => void;
}

export function Conversation({ contact, onBack }: ConversationProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, startTyping } = useChat();

  // Fetch message history
  const { data: messages, isLoading } = useQuery({
    queryKey: ['directMessages', contact.id],
    queryFn: () => chatService.getDirectMessages(contact.id),
    refetchInterval: false,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await sendMessage({
        receiverId: contact.id,
        content,
        type: 'text'
      });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries(['directMessages', contact.id]);
    }
  });

  // Mark messages as read
  useEffect(() => {
    const unreadMessages = messages?.filter(msg => 
      !msg.isRead && msg.sender.id === contact.id
    );

    unreadMessages?.forEach(msg => {
      chatService.markMessageAsRead(msg.id);
    });
  }, [messages, contact.id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      startTyping(contact.id);
      setTimeout(() => setIsTyping(false), 3000);
    }
  };

  // Group messages by date
  const groupedMessages = messages?.reduce((groups, message) => {
    const date = new Date(message.sentAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, DirectMessage[]>);

  return (
    <div className="flex flex-col h-full bg-stone-900">
      {/* Header */}
      <div className="p-4 border-b border-stone-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="relative">
            <img
              src={contact.avatar || '/default-avatar.png'}
              alt={contact.username}
              className="w-10 h-10 rounded-full"
            />
            <div className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
              contact.status === 'online' 
                ? "bg-green-500" 
                : contact.status === 'ingame' 
                  ? "bg-indigo-500" 
                  : "bg-gray-500"
            )} />
          </div>
          <div>
            <h2 className="font-medium text-white">{contact.username}</h2>
            <p className="text-sm text-gray-400">
              {contact.status === 'online' 
                ? 'Online' 
                : contact.status === 'ingame' 
                  ? 'In Game' 
                  : 'Offline'}
            </p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-stone-800 rounded-lg shadow-lg border border-stone-700"
              >
                <button
                  onClick={() => {
                    // Add friend functionality
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-400 hover:text-white hover:bg-stone-700"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Add Friend</span>
                </button>
                <button
                  onClick={() => {
                    // Block user functionality
                    setShowOptions(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-stone-700"
                >
                  <X className="w-4 h-4" />
                  <span>Block User</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No messages yet</p>
            <p className="text-sm">Start a conversation with {contact.username}</p>
          </div>
        ) : (
          Object.entries(groupedMessages || {}).map(([date, dateMessages]) => (
            <div key={date}>
              {/* Date Separator */}
              <div className="flex items-center gap-4 my-4">
                <div className="flex-1 h-px bg-stone-800" />
                <span className="text-xs text-gray-400">{date}</span>
                <div className="flex-1 h-px bg-stone-800" />
              </div>

              {/* Messages */}
              <div className="space-y-4">
                {dateMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex items-end gap-2",
                      msg.sender.id === user?.userId ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.sender.id === contact.id && (
                      <img
                        src={msg.sender.avatar || '/default-avatar.png'}
                        alt={msg.sender.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className={cn(
                      "max-w-[70%] rounded-lg p-3",
                      msg.sender.id === user?.userId 
                        ? "bg-indigo-500 text-white" 
                        : "bg-stone-800 text-white"
                    )}>
                      <p className="break-words">{msg.content}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-xs opacity-70">
                          {new Date(msg.sentAt).toLocaleTimeString()}
                        </span>
                        {msg.sender.id === user?.userId && (
                          msg.isRead ? (
                            <CheckCheck className="w-4 h-4 text-blue-400" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-stone-800">
        <AnimatePresence>
          {isTyping && (
            <TypingIndicator username={contact.username} />
          )}
        </AnimatePresence>
        <div className="flex items-center gap-2">
          <button 
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            title="Send image"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim()) {
                    sendMessageMutation.mutate(message);
                  }
                }
              }}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-stone-800 rounded-lg text-white resize-none"
              rows={1}
            />
          </div>
          <button
            onClick={() => {
              if (message.trim()) {
                sendMessageMutation.mutate(message);
              }
            }}
            disabled={!message.trim() || sendMessageMutation.isPending}
            className={cn(
              "p-2 rounded-lg transition-colors",
              message.trim() && !sendMessageMutation.isPending
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
}