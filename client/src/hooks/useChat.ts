import { useEffect, useCallback } from 'react';
import { HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';
import { useChatStore } from '../components/store/chatStore';
import { useAuth } from './useAuth';
import { CHAT_HUB_URL } from '../constant';
import { toast } from 'react-hot-toast';

export function useChatConnection() {
  const { user } = useAuth();
  const setConnection = useChatStore(state => state.setConnection);
  const setConnectionState = useChatStore(state => state.setConnectionState);
  const setConnectionError = useChatStore(state => state.setConnectionError);
  const addMessage = useChatStore(state => state.addMessage);
  const addDirectMessage = useChatStore(state => state.addDirectMessage);
  const setUserTyping = useChatStore(state => state.setUserTyping);
  const setUserOnline = useChatStore(state => state.setUserOnline);

  // Get token from local storage - this is where we store it after login
  const getStoredToken = () => localStorage.getItem('token');

  const connect = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      toast.error('Authentication required');
      return;
    }

    try {
      const connection = new HubConnectionBuilder()
        .withUrl(CHAT_HUB_URL, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === 0) {
              return 0;
            } else if (retryContext.previousRetryCount < 3) {
              return 2000;
            } else {
              return 5000;
            }
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Set up message handlers
      connection.on("ReceiveMessage", (message) => {
        addMessage(message.chatRoomId, message);
      });

      connection.on("ReceiveDirectMessage", (message) => {
        const otherUserId = message.sender.id === user?.userId ? 
          message.receiver.id : message.sender.id;
        addDirectMessage(otherUserId, message);
      });

      connection.on("UserTypingStatus", (roomId, user, isTyping) => {
        setUserTyping(roomId, user.id, isTyping);
      });

      connection.on("UserOnlineStatus", (user, isOnline) => {
        setUserOnline(user.id, isOnline);
      });

      connection.on("ErrorOccurred", (error) => {
        setConnectionError(error);
      });

      // Set up connection state handlers
      connection.onreconnecting(() => {
        setConnectionState(HubConnectionState.Reconnecting);
      });

      connection.onreconnected(() => {
        setConnectionState(HubConnectionState.Connected);
      });

      connection.onclose(() => {
        setConnectionState(HubConnectionState.Disconnected);
      });

      await connection.start();
      setConnection(connection);
      setConnectionState(HubConnectionState.Connected);
      setConnectionError(null);

    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to chat');
      setConnectionState(HubConnectionState.Disconnected);
    }
  }, [user?.userId]);

  useEffect(() => {
    connect();

    return () => {
      const connection = useChatStore.getState().connection;
      if (connection) {
        connection.stop();
        setConnection(null);
      }
    };
  }, [connect]);

  const sendMessage = useCallback(async (roomId: number, content: string) => {
    const connection = useChatStore.getState().connection;
    if (connection?.state === HubConnectionState.Connected) {
      try {
        await connection.invoke("SendMessage", {
          chatRoomId: roomId,
          content,
          messageType: "text"
        });
      } catch (error) {
        setConnectionError('Failed to send message');
      }
    }
  }, []);

  const sendDirectMessage = useCallback(async (receiverId: number, content: string) => {
    const connection = useChatStore.getState().connection;
    if (connection?.state === HubConnectionState.Connected) {
      try {
        await connection.invoke("SendDirectMessage", {
          receiverId,
          content,
          messageType: "text"
        });
      } catch (error) {
        setConnectionError('Failed to send direct message');
      }
    }
  }, []);

  return {
    connect,
    sendMessage,
    sendDirectMessage,
    connectionState: useChatStore(state => state.connectionState),
    connectionError: useChatStore(state => state.connectionError)
  };
}