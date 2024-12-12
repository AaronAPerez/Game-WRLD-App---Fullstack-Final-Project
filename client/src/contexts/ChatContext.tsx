import { createContext, useContext, useEffect, useState } from 'react';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { chatService } from '../services/chatService';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import type { SendMessageRequest } from '../types/chat';

interface ChatContextType {
  isConnected: boolean;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  sendMessage: (roomId: number, content: string) => Promise<void>;
  sendDirectMessage: (userId: number, content: string) => Promise<void>;
  isTyping: (roomId: number) => Promise<void>;
  connectionState: HubConnectionState;
}

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [connectionState, setConnectionState] = useState<HubConnectionState>(
    HubConnectionState.Disconnected
  );

  // Auto-connect when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        // Using void operator to handle Promise without checking result
        void connect();
      }
    } else {
      void disconnect();
    }
  }, [isAuthenticated]);

  const connect = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      // Connect to chat service
      await chatService.connect(token);

      // Get the connection after connecting
      const conn = chatService.getConnection();
      if (conn) {
        setConnection(conn);
        setConnectionState(HubConnectionState.Connected);
      } else {
        throw new Error('Failed to establish chat connection');
      }
    } catch (error) {
      console.error('Failed to connect to chat:', error);
      setConnectionState(HubConnectionState.Disconnected);
      toast.error('Failed to connect to chat');
    }
  };

  const disconnect = async () => {
    if (connection) {
      await chatService.disconnect();
      setConnection(null);
      setConnectionState(HubConnectionState.Disconnected);
    }
  };

  const sendMessage = async (roomId: number, content: string) => {
    if (!connection || connectionState !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    const message: SendMessageRequest = {
      roomId,
      content,
      type: 'text'
    };

    await chatService.sendMessage(message);
  };

  const sendDirectMessage = async (userId: number, content: string) => {
    if (!connection || connectionState !== HubConnectionState.Connected) {
      throw new Error('Not connected to chat');
    }

    const message: SendMessageRequest = {
      receiverId: userId,
      content,
      type: 'text'
    };

    await chatService.sendMessage(message);
  };

  const isTyping = async (roomId: number) => {
    if (connection?.state === HubConnectionState.Connected) {
      await chatService.sendTypingStatus(roomId, true);
      setTimeout(async () => {
        if (connection?.state === HubConnectionState.Connected) {
          await chatService.sendTypingStatus(roomId, false);
        }
      }, 2000);
    }
  };

  const value: ChatContextType = {
    isConnected: connectionState === HubConnectionState.Connected,
    connect,
    disconnect,
    sendMessage,
    sendDirectMessage,
    isTyping,
    connectionState
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};