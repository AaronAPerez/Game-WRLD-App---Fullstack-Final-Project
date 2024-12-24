// useChatRoom.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { useChatStore } from '../store/chatStore';

import { toast } from 'react-hot-toast';

export function useChatRoom(roomId: number) {
  const queryClient = useQueryClient();
  const [typingUsers, setTypingUsers] = useState<UserProfileDTO[]>([]);
  const { setActiveRoom } = useChatStore();

  // Fetch room details
  const {
    data: room,
    isLoading: isRoomLoading,
    error: roomError
  } = useQuery({
    queryKey: ['chatRoom', roomId],
    queryFn: () => chatService.getRooms().then(rooms => 
      rooms.find(r => r.id === roomId)
    ),
    enabled: !!roomId
  });

  // Fetch room messages
  const {
    data: messages = [],
    isLoading: isMessagesLoading,
    error: messagesError
  } = useQuery({
    queryKey: ['roomMessages', roomId],
    queryFn: () => chatService.getRoomMessages(roomId),
    enabled: !!roomId
  });

  // Fetch room members
  const {
    data: members = [],
    isLoading: isMembersLoading,
    error: membersError
  } = useQuery({
    queryKey: ['roomMembers', roomId],
    queryFn: () => chatService.getRoomMembers(roomId),
    enabled: !!roomId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      if (!room) throw new Error('Room not found');
      
      await chatService.sendMessage({
        roomId: room.id,
        content,
        type: 'text'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['roomMessages', roomId]);
    },
    onError: () => {
      toast.error('Failed to send message');
    }
  });

  // Leave room mutation
  const leaveRoomMutation = useMutation({
    mutationFn: async () => {
      await chatService.leaveRoom(roomId);
    },
    onSuccess: () => {
      setActiveRoom(null);
      queryClient.invalidateQueries(['chatRooms']);
      toast.success('Left room successfully');
    },
    onError: () => {
      toast.error('Failed to leave room');
    }
  });

  // Handle real-time events
  useEffect(() => {
    if (!room) return;

    const conn = chatService.getConnection();
    if (!conn) return;

    // Message handler
    const messageHandler = (message: ChatMessage) => {
      if (message.chatRoomId === roomId) {
        queryClient.invalidateQueries(['roomMessages', roomId]);
      }
    };

    // Typing handler
    const typingHandler = (typingRoomId: number, user: UserProfile, isTyping: boolean) => {
      if (typingRoomId === roomId) {
        setTypingUsers(prev => {
          if (isTyping) {
            return [...prev, user];
          } else {
            return prev.filter(u => u.id !== user.id);
          }
        });
      }
    };

    // Member update handler
    const memberUpdateHandler = () => {
      queryClient.invalidateQueries(['roomMembers', roomId]);
    };

    conn.on('ReceiveMessage', messageHandler);
    conn.on('UserTyping', typingHandler);
    conn.on('MemberJoined', memberUpdateHandler);
    conn.on('MemberLeft', memberUpdateHandler);

    return () => {
      conn.off('ReceiveMessage', messageHandler);
      conn.off('UserTyping', typingHandler);
      conn.off('MemberJoined', memberUpdateHandler);
      conn.off('MemberLeft', memberUpdateHandler);
    };
  }, [room, roomId]);

  // Join room on mount
  useEffect(() => {
    const joinRoom = async () => {
      if (!room) return;
      
      try {
        await chatService.joinRoom(roomId);
        setActiveRoom(room);
      } catch (error) {
        console.error('Failed to join room:', error);
        toast.error('Failed to join room');
      }
    };

    joinRoom();

    // Leave room on unmount
    return () => {
      if (room) {
        chatService.leaveRoom(roomId).catch(error => {
          console.error('Failed to leave room:', error);
        });
      }
    };
  }, [room, roomId]);

  const sendTypingIndicator = useCallback(async () => {
    try {
      await chatService.sendTypingStatus(roomId, true);
      setTimeout(() => {
        chatService.sendTypingStatus(roomId, false).catch(console.error);
      }, 3000);
    } catch (error) {
      console.error('Failed to send typing indicator:', error);
    }
  }, [roomId]);

  return {
    room,
    messages,
    members,
    typingUsers,
    sendMessage: sendMessageMutation.mutate,
    leaveRoom: leaveRoomMutation.mutate,
    sendTypingIndicator,
    isLoading: isRoomLoading || isMessagesLoading || isMembersLoading,
    error: roomError || messagesError || membersError,
    isSending: sendMessageMutation.isPending,
    isLeaving: leaveRoomMutation.isPending
  };
}
// import { useEffect } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { chatService } from '../services/chatService';
// import { useChatStore } from '../components/store/chatStore';

// export function useChatRoom(roomId: number | null) {
//   const { setActiveRoom } = useChatStore();

//   // Fetch room details
//   const {
//     data: room,
//     isLoading,
//     error
//   } = useQuery({
//     queryKey: ['chatRoom', roomId],
//     queryFn: () => roomId ? chatService.getChatRoom(roomId) : null,
//     enabled: !!roomId
//   });

//   // Join room on selection
//   useEffect(() => {
//     if (room) {
//       setActiveRoom(room);
//       chatService.joinRoom(room.id);
      
//       return () => {
//         chatService.leaveRoom(room.id);
//         setActiveRoom(null);
//       };
//     }
//   }, [room?.id]);

//   return {
//     room,
//     isLoading,
//     error
//   };
// }