import { motion } from 'framer-motion';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface MessageStatusProps {
  timestamp: string;
  isDelivered: boolean;
  isRead: boolean;
  isFailed?: boolean;
  onRetry?: () => void;
}

export function MessageStatus({
  timestamp,
  isDelivered,
  isRead,
  isFailed,
  onRetry
}: MessageStatusProps) {
  return (
    <div className="flex items-center gap-1 text-xs">
      <span className="text-gray-400">
        {format(new Date(timestamp), 'HH:mm')}
      </span>
      
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
              <div className="relative">
                <Check className="w-3 h-3" />
                <Check className="w-3 h-3 absolute -right-1 top-0" />
              </div>
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