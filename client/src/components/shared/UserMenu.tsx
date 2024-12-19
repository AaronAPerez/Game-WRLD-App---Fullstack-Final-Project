import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  MessageSquare, 
  UserPlus, 
  Check, 
  X,
  Loader2 
} from 'lucide-react';
import { cn } from '../../utils/styles';
import { useAuth } from '../../hooks/useAuth';

interface Notification {
  id: string;
  type: 'message' | 'friend_request' | 'system';
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
  sender?: {
    id: string;
    username: string;
    avatar: string;
  };
}

export default function NotificationsDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  // Fetch notifications
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      // Replace with your API call
      return [] as Notification[];
    },
    enabled: Boolean(user)
  });

  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          "hover:bg-stone-800",
          "focus:outline-none focus:ring-2",
          "focus:ring-indigo-500 focus:ring-offset-2",
          "focus:ring-offset-stone-950"
        )}
      >
        <Bell className="w-5 h-5 text-gray-400" />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 w-5 h-5",
            "flex items-center justify-center",
            "bg-red-500 text-white text-xs font-medium",
            "rounded-full"
          )}>
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className={cn(
                "absolute right-0 mt-2 w-80 z-50",
                "bg-stone-900 rounded-lg shadow-lg",
                "border border-stone-800"
              )}
            >
              {/* Header */}
              <div className="p-4 border-b border-stone-800">
                <h3 className="text-lg font-medium text-white">
                  Notifications
                </h3>
              </div>

              {/* Content */}
              <div className="max-h-[60vh] overflow-y-auto">
                {isLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                  </div>
                ) : notifications?.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No notifications</p>
                  </div>
                ) : (
                  <div className="divide-y divide-stone-800">
                    {notifications?.map((notification) => (
                      <NotificationItem 
                        key={notification.id}
                        notification={notification}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({ notification }: { notification: Notification }) {
  const getIcon = () => {
    switch (notification.type) {
      case 'message':
        return MessageSquare;
      case 'friend_request':
        return UserPlus;
      default:
        return Bell;
    }
  };

  const Icon = getIcon();

  return (
    <div className={cn(
      "p-4 hover:bg-stone-800/50 transition-colors",
      !notification.read && "bg-stone-800/20"
    )}>
      <div className="flex gap-3">
        {notification.sender && (
          <img
            src={notification.sender.avatar}
            alt={notification.sender.username}
            className="w-10 h-10 rounded-full"
          />
        )}
        <div className="flex-1">
          <p className="text-sm text-white font-medium">
            {notification.title}
          </p>
          <p className="text-sm text-gray-400">
            {notification.content}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(notification.timestamp).toLocaleTimeString()}
          </p>
        </div>
        <Icon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      </div>
    </div>
  );
}