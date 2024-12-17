import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, Search, Plus, MessageSquare, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '../../utils/styles';
import type { UserProfile, DirectMessage } from '../../types/chat';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { useChatStore } from '../store/chatStore';

export const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { activeConversation } = useChatStore();
  const [selectedContact, setSelectedContact] = useState<UserProfile | null>(activeConversation);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch messages for the selected contact
  const { data: messageResponse, isLoading } = useQuery({
    queryKey: ['messages', selectedContact?.id],
    queryFn: async () => {
      if (!selectedContact?.id) {
        return { data: [], success: true, message: 'No contact selected' };
      }
      return await chatService.getDirectMessages(selectedContact.id);
    },
    enabled: !!selectedContact?.id,
  });

  // Update selected contact when activeConversation changes
  useEffect(() => {
    setSelectedContact(activeConversation);
  }, [activeConversation]);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!selectedContact) throw new Error('No contact selected');
      await chatService.sendDirectMessage(selectedContact.id, content);
    },
    onSuccess: () => {
      setMessageText('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedContact?.id] });
    },
    onError: (error) => {
      toast.error('Failed to send message');
      console.error('Send message error:', error);
    }
  });

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageResponse?.data]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    sendMessageMutation.mutate(messageText);
  };

  const messages = messageResponse?.data ?? [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-stone-900 rounded-xl border border-stone-800 overflow-hidden">
        <div className="flex flex-col h-[600px]">
          {/* Header */}
          <div className="p-4 border-b border-stone-800">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">
                {selectedContact 
                  ? `Messages with ${selectedContact.username}` 
                  : 'Messages'}
              </h2>
              <div className="flex gap-2">
                <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {!selectedContact ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No conversation selected</p>
                <p className="text-sm">Select a user to start messaging</p>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No messages yet</p>
                <p className="text-sm">Start a conversation with {selectedContact.username}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message: DirectMessage) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      message.sender.id === user?.userId && "justify-end"
                    )}
                  >
                    {message.sender.id !== user?.userId && (
                      <img
                        src={message.sender.avatar || '/default-avatar.png'}
                        alt={message.sender.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <div className={cn(
                      "max-w-[70%] rounded-xl p-3",
                      message.sender.id === user?.userId
                        ? "bg-indigo-500 text-white"
                        : "bg-stone-800 text-gray-200"
                    )}>
                      <p>{message.content}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {new Date(message.sentAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-stone-800">
            <div className="flex items-center gap-2">
              <input
                id="message-input"
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                disabled={!selectedContact}
                className="flex-1 px-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleSendMessage}
                disabled={!selectedContact || !messageText.trim() || sendMessageMutation.isPending}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  selectedContact && messageText.trim()
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
      </div>
    </div>
  );
};

export default Messages;