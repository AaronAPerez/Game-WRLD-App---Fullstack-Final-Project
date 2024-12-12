import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, Send, Phone, Video, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import type { DirectMessage, UserProfile } from '../../types/chat';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';

interface Message {
  id: number;
  senderId: number;
  content: string;
  sender: {
    id: number;
    username: string;
    avatar: string | null;
  };
  sentAt: string;
}

const Messages = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch direct messages for selected user
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['directMessages', selectedUser?.id],
    queryFn: () => selectedUser ? 
      chatService.getDirectMessages(selectedUser.id, 1, 50) : 
      Promise.resolve([]),
    enabled: !!selectedUser,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      await chatService.sendDirectMessage(receiverId, content);
    },
    onSuccess: () => {
      setNewMessage('');
      queryClient.invalidateQueries({ queryKey: ['directMessages', selectedUser?.id] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return;

    sendMessageMutation.mutate({
      receiverId: selectedUser.id,
      content: newMessage.trim(),
    });
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: Message) => (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex",
        message.sender.id === user?.userId ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[70%] rounded-xl p-3",
        message.sender.id === user?.userId
          ? "bg-indigo-500 text-white"
          : "bg-stone-800 text-gray-200"
      )}>
        {message.sender.id !== user?.userId && (
          <p className="text-sm font-medium mb-1">{message.sender.username}</p>
        )}
        <p>{message.content}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </motion.div>
  );

  return (
    <div className="container mx-auto py-8 max-w-7xl h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-6">
        {/* Left Sidebar */}
        <div className="w-80 bg-stone-900 rounded-xl border border-stone-800 overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-4 border-b border-stone-800">
            <h2 className="text-xl font-bold text-white mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto">
            {messagesLoading ? (
              <div className="flex justify-center p-4">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message: DirectMessage) => (
                <div
                  key={message.id}
                  className={cn(
                    "p-4 border-b border-stone-800 hover:bg-stone-800/50 cursor-pointer",
                    message.sender.id === user?.userId ? "bg-stone-800/30" : ""
                  )}
                  onClick={() => setSelectedUser(
                    message.sender.id === user?.userId ? message.receiver : message.sender
                  )}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={message.sender.avatar || '/api/placeholder/40/40'}
                      alt={message.sender.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-white">
                        {message.sender.id === user?.userId ? 
                          message.receiver.username : message.sender.username}
                      </h3>
                      <p className="text-sm text-gray-400 truncate">{message.content}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-400">
                No messages yet
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedUser ? (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.avatar || '/api/placeholder/40/40'}
                  alt={selectedUser.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedUser.username}</h2>
                  <p className="text-sm text-gray-400">{selectedUser.status}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 rounded-lg hover:bg-stone-800 text-gray-400 hover:text-white">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg hover:bg-stone-800 text-gray-400 hover:text-white">
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages?.map((message: Message) => renderMessage(message))}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    newMessage.trim()
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
        ) : (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h3 className="text-xl font-medium mb-2">Select a conversation</h3>
              <p>Choose a user to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;