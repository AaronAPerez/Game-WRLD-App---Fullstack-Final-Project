import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Image as ImageIcon, 
  Smile, 
  MessageSquare, 
  Loader2 
} from 'lucide-react';
import { chatService } from '../../services/chatService';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';

interface DirectMessagesProps {
  contactId: number;
}

export const DirectMessages = ({ contactId }: DirectMessagesProps) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch direct messages
  const { 
    data: messages, 
    isLoading, 
    fetchNextPage,
    hasNextPage
  } = useQuery(
    ['directMessages', contactId],
    () => chatService.getDirectMessages(contactId),
    {
      getNextPageParam: (lastPage, pages) => 
        lastPage.length === 50 ? pages.length + 1 : undefined
    }
  );

  // Send message mutation
  const sendMessageMutation = useMutation(
    (content: string) => 
      chatService.sendMessage({
        receiverId: contactId,
        content,
        messageType: 'text'
      }),
    {
      onSuccess: () => {
        setMessage('');
        // Invalidate and refetch messages
        queryClient.invalidateQueries(['directMessages', contactId]);
      },
      onError: (error) => {
        toast.error('Failed to send message');
        console.error(error);
      }
    }
  );

  // Scroll to bottom effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessageMutation.mutate(message);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-stone-900 rounded-xl">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : messages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageSquare className="w-16 h-16 mb-4" />
            <p>No messages yet</p>
            <p>Start a conversation</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages?.map((msg) => (
              <div 
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.sender.id === currentUser.id 
                    ? "justify-end" 
                    : "justify-start"
                )}
              >
                {msg.sender.id !== currentUser.id && (
                  <img
                    src={msg.sender.avatar || '/default-avatar.png'}
                    alt={msg.sender.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <div 
                  className={cn(
                    "max-w-[70%] p-3 rounded-xl",
                    msg.sender.id === currentUser.id
                      ? "bg-indigo-500 text-white self-end"
                      : "bg-stone-800 text-white self-start"
                  )}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block text-right">
                    {new Date(msg.sentAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-stone-800">
        <div className="flex items-center gap-2">
          <button className="p-2 text-gray-400 hover:text-white">
            <ImageIcon className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={cn(
              "p-2 rounded-lg transition-colors",
              message.trim()
                ? "text-indigo-400 hover:text-white hover:bg-stone-800"
                : "text-gray-600 cursor-not-allowed"
            )}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};