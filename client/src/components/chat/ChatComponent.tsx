import { useState, useRef, useEffect } from 'react';
import { Search, Send, Phone, Video, MoreHorizontal, Loader2, Users } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { useChatConnection } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { HubConnectionState } from '@microsoft/signalr';
import { cn } from '../../utils/styles';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { RoomList } from './RoomList';

export const ChatComponent = () => {
  const { user } = useAuth();
  const { sendMessage, connectionState } = useChatConnection();
  const activeRoom = useChatStore(state => state.activeRoom);
  const messages = useChatStore(state => 
    state.messages[activeRoom?.id ?? -1] ?? []);
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-scroll to bottom when new messages arrive
  const messageEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    if (activeRoom && content.trim()) {
      await sendMessage(activeRoom.id, content);
    }
  };

  if (connectionState !== HubConnectionState.Connected) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-6">
        {/* Rooms Sidebar */}
        <div className="w-80 bg-stone-900 rounded-xl border border-stone-800 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-stone-800">
            <h2 className="text-xl font-bold text-white mb-4">Chat Rooms</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search rooms..."
                className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
              />
            </div>
          </div>

          <RoomList searchQuery={searchQuery} />
        </div>

        {/* Chat Area */}
        {activeRoom ? (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
            {/* Room Header */}
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={activeRoom.image || '/api/placeholder/40/40'}
                  alt={activeRoom.name}
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">{activeRoom.name}</h2>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>{activeRoom.membersCount} members</span>
                  </div>
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
            <MessageList messages={messages} currentUserId={user?.userId} />

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
          </div>
        ) : (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-medium mb-2">Select a chat room</h3>
              <p>Choose a room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatComponent;