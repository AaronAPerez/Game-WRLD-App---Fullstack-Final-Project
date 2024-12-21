import { motion } from 'framer-motion';
import { cn } from '../../utils/styles';
import { useMessageStatus } from '../../hooks/useMessageStatus';
import { MessageStatus } from './MessageStatus';
import type { DirectMessage } from '../../types/index';

interface MessageBubbleProps {
  message: DirectMessage;
  isOwnMessage: boolean;
  onVisible?: () => void;
}

export function MessageBubble({ 
  message, 
  isOwnMessage, 
  onVisible 
}: MessageBubbleProps) {
  const { status, timestamp, retry } = useMessageStatus(message.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex gap-3",
        isOwnMessage && "justify-end"
      )}
    >
      {!isOwnMessage && (
        <img
          src={message.sender.avatar || '/default-avatar.png'}
          alt={message.sender.username}
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className={cn(
        "max-w-[70%] rounded-xl p-3",
        isOwnMessage
          ? "bg-indigo-500 text-white"
          : "bg-stone-800 text-gray-200",
        status === 'failed' && "opacity-75"
      )}>
        <p>{message.content}</p>
        
        {isOwnMessage && (
          <div className="mt-1 flex justify-end">
            <MessageStatus
              timestamp={timestamp}
              isDelivered={['delivered', 'read'].includes(status)}
              isRead={status === 'read'}
              isFailed={status === 'failed'}
              onRetry={retry}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}