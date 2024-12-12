import { useEffect, useState } from 'react';
import { chatService } from '../services/chatService';
import { useAuth } from './useAuth';

import toast from 'react-hot-toast';

export function useChatConnection() {
  const { user } = useAuth();
  const [connectionState, setConnectionState] = useState(false);

  useEffect(() => {
    if (!user) return;

    const handleConnect = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        await chatService.connect(token);
        setConnectionState(true);
      } catch (error) {
        console.error('Chat connection failed:', error);
        setConnectionState(false);
        toast.error('Failed to connect to chat');
      }
    };

    const handleConnectionStatus = (isConnected: boolean) => {
      setConnectionState(isConnected);
      if (!isConnected) {
        toast.error('Chat connection lost');
      }
    };

    const unsubscribeConnectionStatus = chatService.onConnectionStatusChange(handleConnectionStatus);

    handleConnect();

    return () => {
      unsubscribeConnectionStatus();
      chatService.disconnect();
    };
  }, [user]);

  return {
    connectionState
  };
}