import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { chatService } from '../services/chatService';
import { useChatStore } from '../components/store/chatStore';

export function useChatRoom(roomId: number | null) {
  const { setActiveRoom } = useChatStore();

  // Fetch room details
  const {
    data: room,
    isLoading,
    error
  } = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => roomId ? chatService.getChatRoom(roomId) : null,
    enabled: !!roomId
  });

  // Join room on selection
  useEffect(() => {
    if (room) {
      setActiveRoom(room);
      chatService.joinRoom(room.id);
      
      return () => {
        chatService.leaveRoom(room.id);
        setActiveRoom(null);
      };
    }
  }, [room?.id]);

  return {
    room,
    isLoading,
    error
  };
}