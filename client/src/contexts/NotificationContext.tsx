import { createContext, useContext, useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { BASE_URL } from '../constants';

interface NotificationContextType {
  connection: HubConnection | null;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!user) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${BASE_URL}/hubs/notification`, {
        accessTokenFactory: () => localStorage.getItem('token') || ''
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    // Setup notification handlers
    newConnection.on('ReceiveFriendRequest', (request) => {
      toast.custom((t) => (
        <div className="bg-stone-800 p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={request.requester.avatar || '/default-avatar.png'}
              alt={request.requester.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-white">
                {request.requester.username}
              </p>
              <p className="text-sm text-gray-400">
                Sent you a friend request
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleFriendRequest(request.id, true)}
              className="px-3 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600"
            >
              Accept
            </button>
            <button
              onClick={() => handleFriendRequest(request.id, false)}
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Decline
            </button>
          </div>
        </div>
      ), { duration: 10000 });
    });

    newConnection.on('ReceiveMessage', (message) => {
      toast.custom((t) => (
        <div 
          onClick={() => {
            window.location.href = `/messages/${message.sender.id}`;
            toast.dismiss(t.id);
          }}
          className="bg-stone-800 p-4 rounded-lg shadow-lg cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <img
              src={message.sender.avatar || '/default-avatar.png'}
              alt={message.sender.username}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium text-white">
                {message.sender.username}
              </p>
              <p className="text-sm text-gray-400">
                {message.content}
              </p>
            </div>
          </div>
        </div>
      ), { duration: 5000 });
    });

    // Start connection
    newConnection.start()
      .then(() => {
        setConnection(newConnection);
        setIsConnected(true);
        console.log('Connected to notification hub');
      })
      .catch(error => {
        console.error('Error connecting to notification hub:', error);
      });

    // Cleanup on unmount
    return () => {
      newConnection.stop();
    };
  }, [user]);

  const handleFriendRequest = async (requestId: number, accept: boolean) => {
    if (!connection) return;

    try {
      await connection.invoke('RespondToFriendRequest', requestId, accept);
      toast.success(accept ? 'Friend request accepted' : 'Friend request declined');
    } catch (error) {
      toast.error('Failed to respond to friend request');
    }
  };

  return (
    <NotificationContext.Provider value={{ connection, isConnected }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};