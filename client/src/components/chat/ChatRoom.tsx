import { useState, useEffect, useRef } from 'react';
import { Send, Plus, Users, Settings } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../../services/chatService';
import type { ChatRoom } from '../../types/chat';
import { useAuth } from '../../hooks/useAuth';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';

const ChatRoom = () => {
  useAuth();
  const queryClient = useQueryClient();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  // Fetch chat rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatService.getChatRooms(),
  });

  // Fetch messages for selected room
  const { data: messages } = useQuery({
    queryKey: ['chatMessages', selectedRoom?.id],
    queryFn: () => selectedRoom ? 
      chatService.getRoomMessages(selectedRoom.id) : 
      Promise.resolve([]),
    enabled: !!selectedRoom,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ roomId, content }: { roomId: number; content: string }) => {
      await chatService.sendMessage({ chatRoomId: roomId, content });
    },
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['chatMessages', selectedRoom?.id] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  // Handle room selection
  const handleRoomSelect = async (room: ChatRoom) => {
    if (selectedRoom?.id !== room.id) {
      if (selectedRoom) {
        await chatService.leaveRoom(selectedRoom.id);
      }
      setSelectedRoom(room);
      await chatService.joinRoom(room.id);
    }
  };

  // Handle message sending
  const handleSendMessage = async () => {
    if (!selectedRoom || !message.trim()) return;

    sendMessageMutation.mutate({
      roomId: selectedRoom.id,
      content: message.trim(),
    });
  };

  // Handle typing
  const handleTyping = () => {
    if (!selectedRoom || !isTyping) {
      setIsTyping(true);
      if (selectedRoom) {
        chatService.sendTypingStatus(selectedRoom.id, true);
      }
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      if (selectedRoom) {
        chatService.sendTypingStatus(selectedRoom.id, false);
      }
    }, 3000);
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up on unmount or room change
  useEffect(() => {
    return () => {
      if (selectedRoom) {
        chatService.leaveRoom(selectedRoom.id);
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [selectedRoom]);

  if (roomsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl h-[calc(100vh-8rem)]">
      <div className="flex h-full gap-6">
        {/* Rooms Sidebar */}
        <div className="w-80 bg-stone-900 rounded-xl border border-stone-800 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-stone-800">
            <h2 className="text-xl font-bold text-white mb-4">Chat Rooms</h2>
          </div>

          {/* Rooms List */}
          <div className="flex-1 overflow-y-auto">
            {rooms?.map((room: ChatRoom) => (
              <button
                key={room.id}
                onClick={() => handleRoomSelect(room)}
                className={cn(
                  "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
                  selectedRoom?.id === room.id ? 'bg-stone-800' : ''
                )}
              >
                <img
                  src={room.image || '/api/placeholder/48/48'}
                  alt={room.name}
                  className="w-12 h-12 rounded-xl"
                />
                <div className="flex-1 text-left">
                  <h3 className="text-white font-medium">{room.name}</h3>
                  <p className="text-sm text-gray-400 truncate">{room.description}</p>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {room.membersCount}
                </div>
              </button>
            ))}
          </div>

          {/* Create Room Button */}
          <button className="flex items-center gap-2 m-4 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors">
            <Plus className="w-4 h-4" />
            Create Room
          </button>
        </div>

        {/* Chat Area */}
        {selectedRoom ? (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex flex-col">
            {/* Room Header */}
            <div className="p-4 border-b border-stone-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={selectedRoom.image || '/api/placeholder/40/40'}
                  alt={selectedRoom.name}
                  className="w-10 h-10 rounded-xl"
                />
                <div>
                  <h2 className="text-lg font-bold text-white">{selectedRoom.name}</h2>
                  <p className="text-sm text-gray-400">{selectedRoom.membersCount} members</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Messages will be rendered here */}
              <div ref={messageEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-stone-800">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    handleTyping();
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
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
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 bg-stone-900 rounded-xl border border-stone-800 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <h3 className="text-xl font-medium mb-2">Select a chat room</h3>
              <p>Choose a room from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;