<<<<<<< HEAD
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
=======
import { useEffect, useRef } from 'react';
import { 
  HubConnection, 
  HubConnectionBuilder, 
  LogLevel 
} from '@microsoft/signalr';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chatService } from '../api/chat';
import { toast } from 'react-hot-toast';
import { UserProfileDTO } from '../types';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17

interface UseChatOptions {
  onMessage?: (message: ChatMessageDTO) => void;
  onUserTyping?: (roomId: number, user: UserProfileDTO) => void;
  onUserOnline?: (user: UserProfileDTO) => void;
}

export const useChat = (options: UseChatOptions = {}) => {
  const connectionRef = useRef<HubConnection | null>(null);
  const queryClient = useQueryClient();

  // Initialize SignalR connection
  useEffect(() => {
    const initConnection = async () => {
      try {
        const connection = new HubConnectionBuilder()
          .withUrl('/hubs/chat', {
            accessTokenFactory: () => localStorage.getItem('token') || ''
          })
          .withAutomaticReconnect()
          .configureLogging(LogLevel.Information)
          .build();

        // Set up event handlers
        connection.on('ReceiveMessage', (message: ChatMessageDTO) => {
          queryClient.setQueryData(
            ['messages', message.chatRoomId],
            (old: ChatMessageDTO[] = []) => [...old, message]
          );
          options.onMessage?.(message);
        });

        connection.on('UserTyping', (roomId: number, user: UserProfileDTO) => {
          options.onUserTyping?.(roomId, user);
        });

        connection.on('UserOnline', (user: UserProfileDTO) => {
          options.onUserOnline?.(user);
        });

        // Start connection
        await connection.start();
        connectionRef.current = connection;
      } catch (error) {
        console.error('SignalR Connection Error:', error);
        toast.error('Failed to connect to chat service');
      }
    };

    initConnection();

    // Cleanup on unmount
    return () => {
      connectionRef.current?.stop();
    };
  }, []);

  // Get chat rooms
  const { data: rooms = [] } = useQuery({
    queryKey: ['chatRooms'],
    queryFn: chatService.getRooms
  });

  // Get messages for a room
  const useMessages = (roomId: number) => useQuery({
    queryKey: ['messages', roomId],
    queryFn: () => chatService.getRoomMessages(roomId),
    enabled: !!roomId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ roomId, content }: { roomId: number; content: string }) => {
      if (!connectionRef.current) throw new Error('Not connected');

      await connectionRef.current.invoke('SendMessage', {
        chatRoomId: roomId,
        content,
        messageType: 'text'
      });
    }
  });

  // Join room mutation
  const joinRoomMutation = useMutation({
    mutationFn: async (roomId: number) => {
      if (!connectionRef.current) throw new Error('Not connected');

      await chatService.joinRoom(roomId);
      await connectionRef.current.invoke('JoinRoom', roomId);
    }
  });

  return {
    rooms,
    useMessages,
    sendMessage: sendMessageMutation.mutateAsync,
    joinRoom: joinRoomMutation.mutateAsync,
    isConnected: !!connectionRef.current?.state
  };
};