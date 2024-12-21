// // Custom hook for chat operations
// // good
// import { useCallback, useContext, useEffect, useState } from 'react';
// import { useQueryClient, useMutation } from '@tanstack/react-query';
// import { chatService } from '../services/chatService';
// import { useChatStore } from '../components/store/chatStore';
// import { toast } from 'react-hot-toast';
// import { useAuth } from './useAuth';
// import type { 
//   ChatMessage, 
//   ChatRoom, 
//   SendMessageRequest, 
//   UserProfile 
// } from '../types/chat';

// interface UseChatOptions {
//   onMessageReceived?: (message: ChatMessage) => void;
//   onUserTyping?: (roomId: number, user: UserProfile) => void;
//   onUserStatusChange?: (user: UserProfile, isOnline: boolean) => void;
// }

// export function useChat(options: UseChatOptions = {}) {
//   const { isAuthenticated } = useAuth();
//   const [isConnecting, setIsConnecting] = useState(false);
//   const queryClient = useQueryClient();

//   const {
//     activeRoom,
//     messages,
//     typingUsers,
//     onlineUsers,
//     setActiveRoom,
//     addMessage,
//     setTypingStatus,
//     setUserOnline,
//   } = useChatStore();

//   // Initialize chat connection
//   useEffect(() => {
//     if (isAuthenticated && !chatService.isConnected()) {
//       const initializeChat = async () => {
//         setIsConnecting(true);
//         try {
//           const token = localStorage.getItem('token');
//           if (!token) throw new Error('No auth token found');
          
//           await chatService.connect(token);
//           setupChatHandlers();
//         } catch (error) {
//           console.error('Failed to initialize chat:', error);
//           toast.error('Failed to connect to chat');
//         } finally {
//           setIsConnecting(false);
//         }
//       };

//       initializeChat();
      
//       return () => {
//         chatService.disconnect();
//       };
//     }
//   }, [isAuthenticated]);

//   // Setup chat event handlers
//   const setupChatHandlers = useCallback(() => {
//     // Message handler
//     chatService.onMessage((message) => {
//       addMessage(message);
//       options.onMessageReceived?.(message);

//       // Show notification for new messages if not active room
//       if (message.chatRoomId !== activeRoom?.id) {
//         toast.custom((t) => (
//           <div className="bg-stone-900 border border-stone-800 rounded-lg p-4">
//             <p className="font-medium text-white">{message.sender.username}</p>
//             <p className="text-sm text-gray-400">{message.content}</p>
//           </div>
//         ));
//       }
//     });

//     // Typing indicator handler
//     chatService.onTyping((roomId, user, isTyping) => {
//       setTypingStatus(roomId, user.id, isTyping);
//       if (isTyping) {
//         options.onUserTyping?.(roomId, user);
//       }
//     });

//     // User status handler
//     chatService.onUserStatus((user, isOnline) => {
//       setUserOnline(user.id, isOnline);
//       options.onUserStatusChange?.(user, isOnline);
//     });
//   }, [activeRoom?.id, options]);

//   // Send message mutation
//   const sendMessageMutation = useMutation({
//     mutationFn: async (request: SendMessageRequest) => {
//       await chatService.sendMessage(request);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['messages', activeRoom?.id]);
//     },
//     onError: (error) => {
//       console.error('Failed to send message:', error);
//       toast.error('Failed to send message');
//     }
//   });

//   // Join room mutation
//   const joinRoomMutation = useMutation({
//     mutationFn: async (roomId: number) => {
//       await chatService.joinRoom(roomId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['chatRooms']);
//     },
//     onError: (error) => {
//       console.error('Failed to join room:', error);
//       toast.error('Failed to join room');
//     }
//   });

//   // Leave room mutation
//   const leaveRoomMutation = useMutation({
//     mutationFn: async (roomId: number) => {
//       await chatService.leaveRoom(roomId);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries(['chatRooms']);
//     },
//     onError: (error) => {
//       console.error('Failed to leave room:', error);
//       toast.error('Failed to leave room');
//     }
//   });

//   // Send typing indicator with debounce
//   const sendTypingIndicator = useCallback(async (roomId: number) => {
//     try {
//       await chatService.sendTypingStatus(roomId, true);
//       // Automatically set typing to false after delay
//       setTimeout(async () => {
//         try {
//           await chatService.sendTypingStatus(roomId, false);
//         } catch (error) {
//           console.error('Failed to clear typing status:', error);
//         }
//       }, 3000);
//     } catch (error) {
//       console.error('Failed to send typing indicator:', error);
//     }
//   }, []);

//   // Join chat room
//   const joinRoom = useCallback(async (room: ChatRoom) => {
//     if (activeRoom?.id === room.id) return;

//     try {
//       if (activeRoom) {
//         await leaveRoomMutation.mutateAsync(activeRoom.id);
//       }
//       await joinRoomMutation.mutateAsync(room.id);
//       setActiveRoom(room);
//     } catch (error) {
//       console.error('Failed to switch rooms:', error);
//       toast.error('Failed to switch chat rooms');
//     }
//   }, [activeRoom]);

//   // Check if user is online
//   const isUserOnline = useCallback((userId: number) => {
//     return onlineUsers.has(userId);
//   }, [onlineUsers]);

//   // Get typing users for a room
//   const getTypingUsers = useCallback((roomId: number) => {
//     return Array.from(typingUsers[roomId] || new Set());
//   }, [typingUsers]);

//   return {
//     // Connection state
//     isConnected: chatService.isConnected(),
//     isConnecting,

//     // Room state
//     activeRoom,
//     messages,
//     typingUsers,
//     onlineUsers,

//     // Actions
//     sendMessage: sendMessageMutation.mutate,
//     joinRoom,
//     leaveRoom: leaveRoomMutation.mutate,
//     sendTypingIndicator,

//     // Utilities
//     isUserOnline,
//     getTypingUsers,

//     // Loading states
//     isSending: sendMessageMutation.isPending,
//     isJoining: joinRoomMutation.isPending,
//     isLeaving: leaveRoomMutation.isPending
//   };
// }

// export default useChat;



import { createContext, useContext } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import type { ChatMessage, ChatRoom } from '../types/index';

interface ChatContextType {
  connection: any;
  connectionState: HubConnectionState;
  activeRoom: ChatRoom | null;
  messages: Record<number, ChatMessage[]>;
  sendMessage: (roomId: number, content: string) => Promise<void>;
  joinRoom: (roomId: number) => Promise<void>;
  leaveRoom: (roomId: number) => Promise<void>;
  setActiveRoom: (room: ChatRoom | null) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);


// Custom hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
