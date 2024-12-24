

export interface MessageStatus {
  id: number;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
  timestamp: string;
}

class MessageDeliveryService {
  private messageStatuses: Map<number, MessageStatus> = new Map();
  private statusListeners: Set<(messageId: number, status: MessageStatus) => void> = new Set();

  // Subscribe to status updates
  subscribe(listener: (messageId: number, status: MessageStatus) => void) {
    this.statusListeners.add(listener);
    return () => this.statusListeners.delete(listener);
  }

  // Update message status
  private updateStatus(messageId: number, status: Partial<MessageStatus>) {
    const currentStatus = this.messageStatuses.get(messageId) || {
      id: messageId,
      status: 'sending',
      timestamp: new Date().toISOString()
    };

    const newStatus = { ...currentStatus, ...status };
    this.messageStatuses.set(messageId, newStatus);

    // Notify listeners
    this.statusListeners.forEach(listener => {
      listener(messageId, newStatus);
    });
  }

  // Track new message
  async trackMessage(messageId: number) {
    try {
      // Initial status
      this.updateStatus(messageId, { status: 'sending' });

      // Simulate network delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 500));

      // Update to sent
      this.updateStatus(messageId, { status: 'sent' });

      // Check delivery on server
      const result = await chatService.checkMessageDelivery(messageId);
      this.updateStatus(messageId, { 
        status: result.isDelivered ? 'delivered' : 'sent'
      });

    } catch (error) {
      this.updateStatus(messageId, { status: 'failed' });
      throw error;
    }
  }

  // Mark message as delivered
  markDelivered(messageId: number) {
    this.updateStatus(messageId, { status: 'delivered' });
  }

  // Mark message as read
  markRead(messageId: number) {
    this.updateStatus(messageId, { status: 'read' });
  }

  // Retry failed message
  async retryMessage(messageId: number) {
    try {
      this.updateStatus(messageId, { status: 'sending' });
      await chatService.resendMessage(messageId);
      this.updateStatus(messageId, { status: 'sent' });
    } catch (error) {
      this.updateStatus(messageId, { status: 'failed' });
      throw error;
    }
  }

  // Get current status
  getStatus(messageId: number): MessageStatus | undefined {
    return this.messageStatuses.get(messageId);
  }
}

export const messageDeliveryService = new MessageDeliveryService();