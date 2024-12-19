import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Users, 
  Settings, 
  Plus, 
  X,
  Loader2,
  MessageCircle 
} from 'lucide-react';
import { useChatRoom } from '../../hooks/useChatRoom';
import { MessageComponent } from './MessageComponent';
import { cn } from '../../utils/styles';
import { ChatMessage, ChatRoom as ChatRoomType, UserProfileDTO } from '../../types/chat';

interface ChatRoomProps {
  roomId: number;
  onLeave?: () => void;
}

const ChatRoom = ({ roomId, onLeave }: ChatRoomProps) => {
  const {
    room,
    messages,
    members,
    typingUsers,
    sendMessage,
    isLoading,
    error,
    leaveRoom
  } = useChatRoom(roomId);

  const [message, setMessage] = useState('');
  const [showMembers, setShowMembers] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle message submission
  const handleSendMessage = async () => {
    if (!message.trim()) return;

    try {
      await sendMessage(message);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400">
        <X className="w-12 h-12 mb-4" />
        <p>Failed to load chat room</p>
        {onLeave && (
          <button
            onClick={onLeave}
            className="mt-4 text-indigo-400 hover:text-indigo-300"
          >
            Return to room list
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Room Header */}
        <div className="p-4 border-b border-stone-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <h2 className="font-medium text-white">{room.name}</h2>
              <p className="text-sm text-gray-400">{members.length} members</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMembers(!showMembers)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                "hover:bg-stone-800",
                showMembers ? "text-indigo-400" : "text-gray-400"
              )}
            >
              <Users className="w-5 h-5" />
            </button>
            <button 
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-stone-800"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message: ChatMessage) => (
            <MessageComponent
              key={message.id}
              message={message}
            />
          ))}
          <div ref={messageEndRef} />
          
          {/* Typing Indicator */}
          {typingUsers.length > 0 && (
            <div className="text-sm text-gray-400">
              {typingUsers.length === 1
                ? `${typingUsers[0].username} is typing...`
                : `${typingUsers.length} people are typing...`}
            </div>
          )}
        </div>

        {/* Message Input */}
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
            <button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              className={cn(
                "px-4 py-2 rounded-lg transition-colors",
                message.trim()
                  ? "bg-indigo-500 text-white hover:bg-indigo-600"
                  : "bg-stone-800 text-gray-400 cursor-not-allowed"
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Members Sidebar */}
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-l border-stone-800 bg-stone-900"
          >
            <div className="p-4 border-b border-stone-800">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-white">Members</h3>
                <button
                  onClick={() => setShowMembers(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Members List */}
            <div className="p-4 space-y-4">
              {members.map((member: UserProfileDTO) => (
                <div 
                  key={member.id} 
                  className="flex items-center gap-3"
                >
                  <img
                    src={member.avatar || '/default-avatar.png'}
                    alt={member.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-white font-medium">
                      {member.username}
                    </p>
                    <p className={cn(
                      "text-sm",
                      member.status === 'online' 
                        ? "text-green-400" 
                        : "text-gray-400"
                    )}>
                      {member.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatRoom;

// import { useState, useRef, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   Search, 
//   Send, 
//   Users, 
//   Settings, 
//   Plus, 
//   Image as ImageIcon,
//   Smile,
//   Loader2,
//   X
// } from 'lucide-react';
// import { useChat } from '../../contexts/ChatContext';
// import { chatService } from '../../services/chatService';
// import { MessageComponent, DateSeparator } from './MessageComponent';
// import { cn } from '../../utils/styles';
// import { toast } from 'react-hot-toast';
// import type { ChatRoom as ChatRoomType, ChatMessage } from '../../types/chat';
// import { groupMessagesByDate, formatMessageDate } from '../../utils/timeUtils';

// const ChatRoom = () => {
//   const { sendMessage, isConnected } = useChat();
//   const queryClient = useQueryClient();
//   const [message, setMessage] = useState('');
//   const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);
//   const [showMembers, setShowMembers] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   let typingTimeout: NodeJS.Timeout;

//   // Get chat rooms
//   const { data: rooms, isLoading: roomsLoading } = useQuery({
//     queryKey: ['chatRooms'],
//     queryFn: () => chatService.getRooms(),
//     enabled: isConnected
//   });

//   // Get room messages
//   const { data: messages, isLoading: messagesLoading } = useQuery({
//     queryKey: ['roomMessages', selectedRoom?.id],
//     queryFn: () => selectedRoom ? chatService.getRoomMessages(selectedRoom.id) : null,
//     enabled: !!selectedRoom && isConnected
//   });

//   // Join room mutation
//   const joinRoomMutation = useMutation({
//     mutationFn: (roomId: number) => chatService.joinRoom(roomId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['chatRooms']);
//       toast.success('Joined room successfully');
//     }
//   });

//   // Leave room mutation
//   const leaveRoomMutation = useMutation({
//     mutationFn: (roomId: number) => chatService.leaveRoom(roomId),
//     onSuccess: () => {
//       queryClient.invalidateQueries(['chatRooms']);
//       toast.success('Left room');
//     }
//   });

//   // Scroll to bottom on new messages
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Handle room selection
//   const handleRoomSelect = async (room: ChatRoomType) => {
//     try {
//       if (selectedRoom?.id !== room.id) {
//         if (selectedRoom) {
//           await leaveRoomMutation.mutateAsync(selectedRoom.id);
//         }
//         await joinRoomMutation.mutateAsync(room.id);
//         setSelectedRoom(room);
//       }
//     } catch (error) {
//       toast.error('Failed to join room');
//     }
//   };

//   // Handle sending messages
//   const handleSendMessage = async () => {
//     if (!message.trim() || !selectedRoom) return;

//     try {
//       await sendMessage({
//         content: message,
//         roomId: selectedRoom.id,
//         type: 'text'
//       });
//       setMessage('');
//       queryClient.invalidateQueries(['roomMessages', selectedRoom.id]);
//     } catch (error) {
//       toast.error('Failed to send message');
//     }
//   };

//   // Handle typing indicator
//   const handleTyping = () => {
//     if (!selectedRoom) return;

//     startTyping(selectedRoom.id);
//     clearTimeout(typingTimeout);
//     typingTimeout = setTimeout(() => {
//       // Typing stopped
//     }, 2000);
//   };

//   // Filter rooms based on search
//   const filteredRooms = rooms?.filter(room => 
//     room.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Group messages by date
//   const groupedMessages = messages ? groupMessagesByDate(messages) : {};

//   if (!isConnected) {
//     return (
//       <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-500" />
//           <p className="text-gray-400">Connecting to chat...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-[calc(100vh-5rem)] bg-stone-900 rounded-xl overflow-hidden border border-stone-800">
//       {/* Rooms Sidebar */}
//       <div className="w-80 border-r border-stone-800 flex flex-col">
//         <div className="p-4 border-b border-stone-800">
//           <h2 className="text-xl font-bold text-white mb-4">Chat Rooms</h2>
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search rooms..."
//               className="w-full pl-9 pr-4 py-2 bg-stone-800 rounded-lg text-white placeholder:text-gray-400"
//             />
//           </div>
//         </div>

//         <div className="flex-1 overflow-y-auto">
//           {roomsLoading ? (
//             <div className="flex justify-center p-4">
//               <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
//             </div>
//           ) : filteredRooms?.map((room) => (
//             <button
//               key={room.id}
//               onClick={() => handleRoomSelect(room)}
//               className={cn(
//                 "w-full p-4 flex items-center gap-3 hover:bg-stone-800 transition-colors",
//                 selectedRoom?.id === room.id ? "bg-stone-800" : ""
//               )}
//             >
//               <div className="relative">
//                 <img
//                   src={room.image || '/default-room.png'}
//                   alt={room.name}
//                   className="w-12 h-12 rounded-xl object-cover"
//                 />
//                 {room.unreadCount > 0 && (
//                   <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs text-white">
//                     {room.unreadCount}
//                   </span>
//                 )}
//               </div>
//               <div className="flex-1 text-left">
//                 <h3 className="font-medium text-white">{room.name}</h3>
//                 <p className="text-sm text-gray-400 truncate">{room.lastMessage?.content}</p>
//               </div>
//               <div className="text-xs text-gray-500 flex items-center gap-1">
//                 <Users className="w-4 h-4" />
//                 {room.participants.length}
//               </div>
//             </button>
//           ))}
//         </div>

//         <button
//           onClick={() => {/* Create room logic */}}
//           className="m-4 flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
//         >
//           <Plus className="w-4 h-4" />
//           Create Room
//         </button>
//       </div>

//       {/* Chat Area */}
//       {selectedRoom ? (
//         <div className="flex-1 flex flex-col">
//           {/* Room Header */}
//           <div className="p-4 border-b border-stone-800 flex justify-between items-center">
//             <div className="flex items-center gap-3">
//               <img
//                 src={selectedRoom.image || '/default-room.png'}
//                 alt={selectedRoom.name}
//                 className="w-10 h-10 rounded-xl"
//               />
//               <div>
//                 <h2 className="font-medium text-white">{selectedRoom.name}</h2>
//                 <p className="text-sm text-gray-400">
//                   {selectedRoom.participants.length} members
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => setShowMembers(!showMembers)}
//                 className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800"
//               >
//                 <Users className="w-5 h-5" />
//               </button>
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <Settings className="w-5 h-5" />
//               </button>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-4">
//             {messagesLoading ? (
//               <div className="flex justify-center">
//                 <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
//               </div>
//             ) : (
//               Object.entries(groupedMessages).map(([date, msgs]) => (
//                 <div key={date}>
//                   <DateSeparator date={formatMessageDate(date)} />
//                   {msgs.map((msg: ChatMessage) => (
//                     <MessageComponent
//                       key={msg.id}
//                       message={msg}
//                     />
//                   ))}
//                 </div>
//               ))
//             )}
//             <div ref={messagesEndRef} />
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
//                 onChange={(e) => {
//                   setMessage(e.target.value);
//                   handleTyping();
//                 }}
//                 onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
//                 placeholder="Type a message..."
//                 className="flex-1 bg-stone-800 rounded-lg px-4 py-2 text-white placeholder:text-gray-400"
//               />
//               <button className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-stone-800">
//                 <Smile className="w-5 h-5" />
//               </button>
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
//               Select a Chat Room
//             </h3>
//             <p className="text-gray-400">
//               Choose a room from the sidebar to start chatting
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Members Sidebar */}
//       <AnimatePresence>
//         {showMembers && selectedRoom && (
//           <motion.div
//             initial={{ width: 0, opacity: 0 }}
//             animate={{ width: 280, opacity: 1 }}
//             exit={{ width: 0, opacity: 0 }}
//             className="border-l border-stone-800 bg-stone-900"
//           >
//             <div className="p-4 border-b border-stone-800 flex justify-between items-center">
//               <h3 className="font-medium text-white">Members</h3>
//               <button
//                 onClick={() => setShowMembers(false)}
//                 className="p-1 text-gray-400 hover:text-white"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>
//             <div className="p-4 space-y-4">
//               {selectedRoom.participants.map((user: UserProfile) => (
//                 <div key={user.id} className="flex items-center gap-3">
//                   <img
//                     src={user.avatar || '/default-avatar.png'}
//                     alt={user.username}
//                     className="w-8 h-8 rounded-full"
//                   />
//                   <div className="flex-1">
//                     <p className="text-white font-medium">{user.username}</p>
//                     <p className="text-sm text-gray-400">{user.status}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default ChatRoom;