import { useState, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useChat } from './useChat';
import { useAuth } from './useAuth';
import { toast } from 'react-hot-toast';
import { NotificationToast } from '../components/NotificationToast';

type NotificationType = 'message' | 'friend_request' | 'friend_accepted';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  sender: {
    id: number;
    username: string;
    avatar?: string;
  };
  createdAt: Date;
  isRead: boolean;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const notificationSound = new Audio('/notification.mp3');

  // Initialize chat connection with notification handlers
  const { connection } = useChat({
    onMessage: (message) => {
      if (message.sender.id !== user?.id) {
        addNotification({
          type: 'message',
          title: 'New Message',
          message: message.content,
          sender: message.sender
        });
      }
    },
    onFriendRequest: (request) => {
      addNotification({
        type: 'friend_request',
        title: 'Friend Request',
        message: `${request.requester.username} sent you a friend request`,
        sender: request.requester
      });
    },
    onFriendAccepted: (user) => {
      addNotification({
        type: 'friend_accepted',
        title: 'Friend Request Accepted',
        message: `${user.username} accepted your friend request`,
        sender: user
      });
    }
  });

  // Add new notification
  const addNotification = useCallback(({ 
    type, 
    title, 
    message, 
    sender 
  }: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      id: crypto.randomUUID(),
      type,
      title,
      message,
      sender,
      createdAt: new Date(),
      isRead: false
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);

    // Play notification sound
    notificationSound.play().catch(() => {
      // Handle autoplay restrictions
      console.warn('Unable to play notification sound');
    });

    // Show toast notification
    toast.custom((t) => (
      <NotificationToast
        notification={newNotification} 
        onDismiss={() => toast.dismiss(t.id)}
      />
    ));
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    setUnreadCount(0);
  }, []);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead
  };
};