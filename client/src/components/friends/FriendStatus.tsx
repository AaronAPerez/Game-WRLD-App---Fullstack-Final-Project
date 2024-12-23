import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';
import { useChat } from '../../hooks/useChat';

interface FriendStatusProps {
  friendId: number;
  initialStatus?: 'online' | 'offline' | 'away';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function FriendStatus({
  friendId,
  initialStatus = 'offline',
  showLabel = false,
  size = 'md'
}: FriendStatusProps) {
  const { connection } = useChat();
  const [status, setStatus] = useState(initialStatus);

  useEffect(() => {
    if (!connection) return;

    // Listen for status updates
    const handleStatusChange = (userId: number, newStatus: string) => {
      if (userId === friendId) {
        setStatus(newStatus as 'online' | 'offline' | 'away');
      }
    };

    connection.on('UserStatusChanged', handleStatusChange);

    return () => {
      connection.off('UserStatusChanged', handleStatusChange);
    };
  }, [connection, friendId]);

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const statusColor = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    away: 'bg-yellow-500'
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={false}
        animate={{
          scale: status === 'online' ? [1, 1.2, 1] : 1,
          transition: { duration: 0.3 }
        }}
        className={cn(
          "rounded-full",
          sizeClasses[size],
          statusColor[status]
        )}
      />
      {showLabel && (
        <span className="text-sm capitalize text-gray-400">
          {status}
        </span>
      )}
    </div>
  );
}