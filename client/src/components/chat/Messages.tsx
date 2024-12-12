import { useState, useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Send, Phone, Video, Image, Smile, Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';
import { chatService } from '../../services/chatService';
import { MessageComponent } from './MessageComponent';
import type { DirectMessage } from '../../types/chat';
import { useAuth } from '../../hooks/useAuth';
import { debounce } from 'lodash'; // Consider using lodash for debouncing

const Messages = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const debouncedStopTyping = useRef<ReturnType<typeof debounce> | null>(null);

  // Initialize debounce function when component mounts
  useEffect(() => {
    debouncedStopTyping.current = debounce(() => {
      if (isTyping) {
        setIsTyping(false);
        chatService.sendTypingStatus(selectedUser.id, false);
      }
    }, 2000); // 2 seconds of inactivity

    return () => {
      if (debouncedStopTyping.current) {
        debouncedStopTyping.current.cancel();
      }
    };
  }, [isTyping]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    // Start typing if not already typing
    if (!isTyping && inputValue.trim().length > 0) {
      setIsTyping(true);
      chatService.sendTypingStatus(selectedUser.id, true);
    }

    // Reset/trigger the debounced stop typing
    if (debouncedStopTyping.current) {
      debouncedStopTyping.current();
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await chatService.sendDirectMessage({
        receiverId: selectedUser.id,
        content: message,
        messageType: 'text'
      });

      // Reset typing state and message
      setMessage('');
      setIsTyping(false);

      if (debouncedStopTyping.current) {
        debouncedStopTyping.current.cancel();
      }

      chatService.sendTypingStatus(selectedUser.id, false);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Listen for typing status from other users
  useEffect(() => {
    const handleUserTyping = (roomId: number, typingUser: UserProfile, isTyping: boolean) => {
      // Update UI to show who is typing
      if (typingUser.id !== user?.userId) {
        // Update state or show typing indicator
        console.log(`${typingUser.username} is ${isTyping ? 'typing...' : 'stopped typing'}`);
      }
    };

    const unsubscribe = chatService.onUserTyping(handleUserTyping);

    return () => {
      unsubscribe();
    };
  }, [user]);

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          {userLoading ? (
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-800 rounded-full" />
              <div className="space-y-2">
                <div className="h-4 w-24 bg-stone-800 rounded" />
                <div className="h-3 w-16 bg-stone-800 rounded" />
              </div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || '/default-avatar.png'}
                alt={user.username}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-medium text-white">{user.username}</h2>
                <p className="text-sm text-green-400">{user.status}</p>
              </div>
            </div>
          ) : null}

          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
              <Phone className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
              <Video className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messagesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {messages?.map((msg: DirectMessage) => (
                <MessageComponent
                  key={msg.id}
                  message={msg}
                  currentUser={user}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
              <Image className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={handleTyping}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-400"
            />
            <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
              <Smile className="w-5 h-5" />
            </button>
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
    </div>
  );
};

export default Messages;