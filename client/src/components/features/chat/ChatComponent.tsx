import { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { MessageSquare, Send, X, Users, Settings } from 'lucide-react';
import { cn } from '../../utils/styles';
import type { ChatMessageDTO, UserProfileDTO } from '../../types';

// Main Chat Room Component
export const ChatRoom = ({ roomId }: { roomId: number }) => {
  const { 
    activeRoom,
    messages,
    onlineUsers,
    typingUsers,
    sendMessage,
    joinRoom,
    leaveRoom,
    setTyping 
  } = useChat();
  const { user } = useAuth();
  const [messageText, setMessageText] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Join room on mount
  useEffect(() => {
    joinRoom(roomId);
    return () => {
      leaveRoom(roomId);
    };
  }, [roomId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle typing indicator
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    if (messageText) {
      setTyping(roomId, true);
      typingTimer = setTimeout(() => {
        setTyping(roomId, false);
      }, 2000);
    }
    return () => {
      clearTimeout(typingTimer);
      setTyping(roomId, false);
    };
  }, [messageText]);

  const handleSendMessage = async () => {
    if (!messageText.trim()) return;
    await sendMessage(roomId, messageText);
    setMessageText('');
  };

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {activeRoom?.image && (
              <img 
                src={activeRoom.image} 
                alt={activeRoom.name} 
                className="w-10 h-10 rounded-lg"
              />
            )}
            <div>
              <h2 className="font-medium text-white">{activeRoom?.name}</h2>
              <p className="text-sm text-gray-400">
                {activeRoom?.membersCount} members
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <Users className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages[roomId]?.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
              isOwnMessage={message.sender.id === user?.id}
            />
          ))}
          <div ref={messagesEndRef} />
          
          {/* Typing Indicator */}
          {typingUsers[roomId]?.size > 0 && (
            <TypingIndicator users={Array.from(typingUsers[roomId])} />
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-stone-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-stone-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className={cn(
                "p-2 rounded-lg transition-colors",
                messageText.trim()
                  ? "text-indigo-400 hover:text-white hover:bg-stone-800"
                  : "text-gray-600 cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      {showMembers && (
        <div className="w-64 border-l border-stone-800 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-white">Members</h3>
            <button
              onClick={() => setShowMembers(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-2">
            {activeRoom?.members?.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-800"
              >
                <div className="relative">
                  <img
                    src={member.avatar || '/default-avatar.png'}
                    alt={member.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div
                    className={cn(
                      "absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-stone-900",
                      onlineUsers.has(member.id) ? "bg-green-500" : "bg-gray-500"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {member.username}
                  </p>
                  <p className="text-xs text-gray-400">
                    {onlineUsers.has(member.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


