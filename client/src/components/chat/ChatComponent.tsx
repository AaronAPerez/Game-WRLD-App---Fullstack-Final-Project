import { useState, useRef } from 'react';
import { Search, Send, Phone, Video, MoreHorizontal, Users, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/styles';
import { useChatStore } from '../store/chatStore';
import { useChat } from '../../hooks/useChat';

const ChatComponent = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { sendMessage, isConnected, startTyping } = useChat();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !activeRoom?.id) return;
    
    try {
      await sendMessage({
        content: message,
        roomId: activeRoom.id,
        type: 'text'
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Add typing indicator
  const handleTyping = () => {
    if (activeRoom?.id) {
      startTyping(activeRoom.id);
    }
  };

  // Show connection status
  if (!isConnected) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <span className="ml-2">Connecting to chat...</span>
      </div>
    );
  }


  return (
    <div className="flex h-[calc(100vh-5rem)] bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
      {/* Sidebar */}
      <div className="w-80 border-r border-stone-800 flex flex-col">
        {/* Search and New Chat */}
        <div className="p-4 border-b border-stone-800">
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

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
                activeConversationId === conv.id ? "bg-stone-800" : ""
              )}
            >
              <div className="relative">
                <img
                  src={conv.avatar}
                  alt={conv.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={cn(
                  "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
                  conv.status === "online" ? "bg-green-500" : "bg-gray-500"
                )} />
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white">{conv.name}</h3>
                <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className="text-xs text-gray-500">
                  {formatRelativeTime(conv.timestamp)}
                </span>
                {conv.unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-indigo-500 rounded-full text-xs text-white">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversationId ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-stone-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img
                src="/avatar1.jpg"
                alt="Current chat"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="font-medium text-white">John Doe</h2>
                <p className="text-sm text-green-400">Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Messages rendered here */}
            <div ref={messageEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-stone-800">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <ImageIcon className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-400"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
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
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              No Conversation Selected
            </h3>
            <p className="text-gray-400">
              Choose a conversation from the sidebar or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;