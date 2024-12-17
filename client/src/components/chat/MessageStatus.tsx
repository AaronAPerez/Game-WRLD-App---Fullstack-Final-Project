import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useChat } from '../../contexts/ChatContext';

interface MessageStatusProps {
  messageId: number;
  timestamp: Date;
  isDelivered: boolean;
  isRead: boolean;
  isFailed?: boolean;
  onRetry?: () => void;
}

export function MessageStatus({
  messageId,
  timestamp,
  isDelivered,
  isRead,
  isFailed,
  onRetry
}: MessageStatusProps) {
  const [timeAgo, setTimeAgo] = useState('');
  const { connection } = useChat();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const diff = now.getTime() - new Date(timestamp).getTime();
      const minutes = Math.floor(diff / 60000);

      if (minutes < 1) setTimeAgo('now');
      else if (minutes < 60) setTimeAgo(`${minutes}m ago`);
      else if (minutes < 1440) setTimeAgo(`${Math.floor(minutes/60)}h ago`);
      else setTimeAgo(new Date(timestamp).toLocaleDateString());
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  // Listen for read receipts
  useEffect(() => {
    if (!connection) return;

    const handleReadReceipt = (readMessageId: number) => {
      if (readMessageId === messageId) {
        // Update read status
      }
    };

    connection.on('MessageRead', handleReadReceipt);
    return () => {
      connection.off('MessageRead', handleReadReceipt);
    };
  }, [connection, messageId]);

  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-gray-400">{timeAgo}</span>
      
      {isFailed ? (
        <button
          onClick={onRetry}
          className="text-red-400 hover:text-red-300 flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3" />
          <span>Failed - Retry</span>
        </button>
      ) : (
        <motion.div
          initial={false}
          animate={{
            scale: [1, 1.2, 1],
            transition: { duration: 0.2 }
          }}
        >
          {isRead ? (
            <div className="text-blue-400">
              <Check className="w-3 h-3" />
            </div>
          ) : isDelivered ? (
            <div className="text-gray-400">
              <Check className="w-3 h-3" />
            </div>
          ) : (
            <div className="text-gray-500">
              <Clock className="w-3 h-3" />
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}