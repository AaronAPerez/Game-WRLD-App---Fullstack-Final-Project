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