import React, { createContext, useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'react-hot-toast';


import { ChatMessageDTO, DirectMessage } from '../types/chat';
import { CHAT_HUB_URL } from '../constants';


interface ChatContextType {
  connection: HubConnection | null;
  isConnected: boolean;
  sendMessage: (message: { 
    roomId?: number; 
    receiverId?: number; 
    content: string; 
    type?: string; 
  }) => Promise<void>;
  startTyping: (roomId: number) => Promise<void>;
  onlineUsers: Set<number>;
  typingUsers: Map<number, Set<number>>;
  unreadMessages: DirectMessage[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());
  const [typingUsers, setTypingUsers] = useState<Map<number, Set<number>>>(new Map());
  const [unreadMessages, setUnreadMessages] = useState<DirectMessage[]>([]);

  // Initialize SignalR connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${CHAT_HUB_URL}?access_token=${token}`)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    async function startConnection() {
      try {
        await newConnection.start();
        setIsConnected(true);
        toast.success('Connected to chat server');
      } catch (err) {
        toast.error('Failed to connect to chat server');
        setTimeout(startConnection, 5000);
      }
    }

    // Set up event handlers
    newConnection.on('ReceiveMessage', (message: ChatMessageDTO | DirectMessage) => {
      if ('roomId' in message) {
        // Handle room message
      } else {
        // Handle direct message
        setUnreadMessages(prev => [...prev, message]);
      }
    });

    newConnection.on('UserOnlineStatus', (user: UserProfileDTO, isOnline: boolean) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        isOnline ? newSet.add(user.id) : newSet.delete(user.id);
        return newSet;
      });
    });

    newConnection.on('UserTyping', (roomId: number, userId: number, isTyping: boolean) => {
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        const roomTyping = new Set(newMap.get(roomId) || []);
        isTyping ? roomTyping.add(userId) : roomTyping.delete(userId);
        newMap.set(roomId, roomTyping);
        return newMap;
      });
    });

    startConnection();
    setConnection(newConnection);

    return () => {
      newConnection.stop();
    };
  }, []);

  // Send message handler
  const sendMessage = async (message: { 
    roomId?: number; 
    receiverId?: number; 
    content: string; 
    type?: string; 
  }) => {
    if (!connection) throw new Error('No connection to server');

    try {
      if (message.roomId) {
        await connection.invoke('SendMessage', {
          chatRoomId: message.roomId,
          content: message.content,
          messageType: message.type || 'text'
        });
      } else if (message.receiverId) {
        await connection.invoke('SendDirectMessage', {
          receiverId: message.receiverId,
          content: message.content,
          messageType: message.type || 'text'
        });
      }
    } catch (err) {
      toast.error('Failed to send message');
      throw err;
    }
  };

  // Typing indicator handler
  const startTyping = async (roomId: number) => {
    if (!connection) return;
    try {
      await connection.invoke('UserTyping', roomId, true);
      setTimeout(async () => {
        await connection.invoke('UserTyping', roomId, false);
      }, 3000);
    } catch (err) {
      console.error('Failed to send typing indicator:', err);
    }
  };

  const contextValue: ChatContextType = {
    connection,
    isConnected,
    sendMessage,
    startTyping,
    onlineUsers,
    typingUsers,
    unreadMessages
  };
  // const value = {
  //   connection,
  //   isConnected,
  //   sendMessage,
  //   startTyping,
  //   onlineUsers,
  //   typingUsers,
  //   unreadMessages
  // };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}

// export function useChat() {
//   const context = useContext(ChatContext);
//   if (context === undefined) {
//     throw new Error('useChat must be used within a ChatProvider');
//   }
//   return context;
// }