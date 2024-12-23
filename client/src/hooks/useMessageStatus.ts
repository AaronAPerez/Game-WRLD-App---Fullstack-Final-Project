import { useState, useEffect } from 'react';
import { messageDeliveryService, MessageStatus } from '../services/messageDeliveryService';

export function useMessageStatus(messageId: number) {
  const [status, setStatus] = useState<MessageStatus | undefined>(
    messageDeliveryService.getStatus(messageId)
  );

  useEffect(() => {
    // Subscribe to status updates
    const unsubscribe = messageDeliveryService.subscribe((id, newStatus) => {
      if (id === messageId) {
        setStatus(newStatus);
      }
    });

    // Initial status check if not already tracking
    if (!status) {
      messageDeliveryService.trackMessage(messageId).catch(console.error);
    }

    return unsubscribe;
  }, [messageId, status]);

  // Retry handler
  const handleRetry = async () => {
    try {
      await messageDeliveryService.retryMessage(messageId);
    } catch (error) {
      console.error('Failed to retry message:', error);
    }
  };

  return {
    status: status?.status ?? 'sending',
    timestamp: status?.timestamp ?? new Date().toISOString(),
    retry: handleRetry
  };
}