<<<<<<< HEAD
import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Send, 
  Users, 
  Settings, 
  Plus, 
  Image as ImageIcon,
  Smile,
  X,
  Loader2
} from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { chatService } from '../../services/chatService';
import { MessageComponent } from './MessageComponent';
import { cn } from '../../utils/styles';
import { toast } from 'react-hot-toast';
import type { ChatRoom, ChatMessage } from '../../types/index';

const ChatComponent = () => {
  const { sendMessage, isConnected } = useChat();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [showMembers, setShowMembers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get chat rooms
  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: () => chatService.getRooms(),
    enabled: isConnected
  });

  // Get room messages
  const { data: messages, isLoading: messagesLoading } = useQuery({
    queryKey: ['roomMessages', selectedRoom?.id],
    queryFn: () => selectedRoom ? chatService.getRoomMessages(selectedRoom.id) : null,
    enabled: !!selectedRoom && isConnected
  });

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: (roomId: number) => chatService.joinRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      toast.success('Joined room successfully');
    }
  });

  // Leave room mutation
  const leaveRoomMutation = useMutation({
    mutationFn: (roomId: number) => chatService.leaveRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      toast.success('Left room');
    }
  });

=======
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

>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

<<<<<<< HEAD
  // Handle room selection
  const handleRoomSelect = async (room: ChatRoom) => {
    try {
      if (selectedRoom?.id !== room.id) {
        if (selectedRoom) {
          await leaveRoomMutation.mutateAsync(selectedRoom.id);
        }
        await joinRoomMutation.mutateAsync(room.id);
        setSelectedRoom(room);
      }
    } catch (error) {
      toast.error('Failed to join room');
    }
  };
=======
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
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

  // Handle sending messages
  const handleSendMessage = async () => {
<<<<<<< HEAD
    if (!message.trim() || !selectedRoom) return;

    try {
      await sendMessage({
        content: message,
        roomId: selectedRoom.id,
        type: 'text'
      });
      setMessage('');
      queryClient.invalidateQueries(['roomMessages', selectedRoom.id]);
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  // Filter rooms based on search
  const filteredRooms = rooms?.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isConnected) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
          <p className="text-gray-400">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
      {/* Rooms Sidebar */}
      <div className="w-80 border-r border-stone-800 flex flex-col">
        <div className="p-4 border-b border-stone-800">
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

        <div className="flex-1 overflow-y-auto">
          {roomsLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
            </div>
          ) : filteredRooms?.map((room) => (
            <button
              key={room.id}
              onClick={() => handleRoomSelect(room)}
              className={cn(
                "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
                selectedRoom?.id === room.id ? "bg-stone-800" : ""
              )}
            >
              <div className="flex-1 text-left">
                <h3 className="font-medium text-white">{room.name}</h3>
                <p className="text-sm text-gray-400 truncate">{room.description}</p>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <Users className="w-4 h-4" />
                {room.membersCount}
              </div>
=======
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
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
            </button>
          </div>
        </div>

        <button
          onClick={() => {/* Create room logic */}}
          className="m-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Room
        </button>
      </div>

<<<<<<< HEAD
      {/* Chat Area */}
      {selectedRoom ? (
        <div className="flex-1 flex flex-col">
          {/* Room Header */}
          <div className="p-4 border-b border-stone-800 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div>
                <h2 className="font-medium text-white">{selectedRoom.name}</h2>
                <p className="text-sm text-gray-400">
                  {selectedRoom.membersCount} members
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMembers(!showMembers)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800"
              >
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messagesLoading ? (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
              </div>
            ) : (
              messages?.map((message: ChatMessage) => (
                <MessageComponent
                  key={message.id}
                  message={message}
                />
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-stone-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-stone-800 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
                <ImageIcon className="w-5 h-5" />
              </button>
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
      ) : (
        <div className="flex-1 flex items-center justify-center text-center p-8">
          <div>
            <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">
              Select a Chat Room
            </h3>
            <p className="text-gray-400">
              Choose a room from the sidebar to start chatting
            </p>
=======
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
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
          </div>
        </div>
      )}
    </div>
  );
};

<<<<<<< HEAD
export default ChatComponent;
// import { useState, useRef } from 'react';
// import { Search, Send, Phone, Video, MoreHorizontal, Users, Image as ImageIcon } from 'lucide-react';
// import { useAuth } from '../../hooks/useAuth';
// import { cn } from '../../utils/styles';
// import { useChatStore } from '../store/chatStore';
// import { useChat } from '../../hooks/useChat';

// const ChatComponent = () => {
//   const { user } = useAuth();
//   const [message, setMessage] = useState('');
//   const [searchQuery, setSearchQuery] = useState('');
//   const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
//   const messageEndRef = useRef<HTMLDivElement>(null);
//   const { sendMessage, isConnected, startTyping } = useChat();

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleSendMessage = async () => {
//     if (!message.trim() || !activeRoom?.id) return;
    
//     try {
//       await sendMessage({
//         content: message,
//         roomId: activeRoom.id,
//         type: 'text'
//       });
//       setMessage('');
//     } catch (error) {
//       console.error('Failed to send message:', error);
//     }
//   };

//   // Add typing indicator
//   const handleTyping = () => {
//     if (activeRoom?.id) {
//       startTyping(activeRoom.id);
//     }
//   };

//   // Show connection status
//   if (!isConnected) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
//         <span className="ml-2">Connecting to chat...</span>
//       </div>
//     );
//   }


//   return (
//     <div className="flex h-[calc(100vh-5rem)] bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
//       {/* Sidebar */}
//       <div className="w-80 border-r border-stone-800 flex flex-col">
//         {/* Search and New Chat */}
//         <div className="p-4 border-b border-stone-800">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search conversations..."
//               className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
//             />
//           </div>
//         </div>

//         {/* Conversations List */}
//         <div className="flex-1 overflow-y-auto">
//           {conversations.map((conv) => (
//             <button
//               key={conv.id}
//               onClick={() => setActiveConversationId(conv.id)}
//               className={cn(
//                 "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
//                 activeConversationId === conv.id ? "bg-stone-800" : ""
//               )}
//             >
//               <div className="relative">
//                 <img
//                   src={conv.avatar}
//                   alt={conv.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//                 <div className={cn(
//                   "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-stone-900",
//                   conv.status === "online" ? "bg-green-500" : "bg-gray-500"
//                 )} />
//               </div>
              
//               <div className="flex-1 text-left">
//                 <h3 className="font-medium text-white">{conv.name}</h3>
//                 <p className="text-sm text-gray-400 truncate">{conv.lastMessage}</p>
//               </div>

//               <div className="flex flex-col items-end gap-1">
//                 <span className="text-xs text-gray-500">
//                   {formatRelativeTime(conv.timestamp)}
//                 </span>
//                 {conv.unreadCount > 0 && (
//                   <span className="px-2 py-0.5 bg-indigo-500 rounded-full text-xs text-white">
//                     {conv.unreadCount}
//                   </span>
//                 )}
//               </div>
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Chat Area */}
//       {activeConversationId ? (
//         <div className="flex-1 flex flex-col">
//           {/* Chat Header */}
//           <div className="p-4 border-b border-stone-800 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <img
//                 src="/avatar1.jpg"
//                 alt="Current chat"
//                 className="w-10 h-10 rounded-full"
//               />
//               <div>
//                 <h2 className="font-medium text-white">John Doe</h2>
//                 <p className="text-sm text-green-400">Online</p>
//               </div>
//             </div>
            
//             <div className="flex items-center gap-2">
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <Phone className="w-5 h-5" />
//               </button>
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <Video className="w-5 h-5" />
//               </button>
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <MoreHorizontal className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {/* Messages rendered here */}
//             <div ref={messageEndRef} />
//           </div>

//           {/* Input Area */}
//           <div className="p-4 border-t border-stone-800">
//             <div className="flex items-center gap-2">
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <ImageIcon className="w-5 h-5" />
//               </button>
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-400"
//                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
//               />
//               <button
//                 onClick={handleSendMessage}
//                 disabled={!message.trim()}
//                 className={cn(
//                   "p-2 rounded-lg transition-colors",
//                   message.trim()
//                     ? "text-indigo-400 hover:text-white hover:bg-stone-800"
//                     : "text-gray-600 cursor-not-allowed"
//                 )}
//               >
//                 <Send className="w-5 h-5" />
//               </button>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="flex-1 flex items-center justify-center text-center p-8">
//           <div>
//             <Users className="w-16 h-16 mx-auto text-gray-600 mb-4" />
//             <h3 className="text-xl font-medium text-white mb-2">
//               No Conversation Selected
//             </h3>
//             <p className="text-gray-400">
//               Choose a conversation from the sidebar or start a new one
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatComponent;
=======

>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17
