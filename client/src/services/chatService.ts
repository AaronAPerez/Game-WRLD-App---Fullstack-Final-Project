import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { BASE_URL } from '../constant';
import type { ChatMessage, DirectMessage, SendMessageRequest, UserProfile } from '../types/chat';
import { toast } from 'react-hot-toast';
import { chatErrorHandler, ChatErrorType } from '../utils/chatErrorHandler';


class ChatService {
  getRoomMessages: any;
  getRooms(): any {
    throw new Error('Method not implemented.');
  }
  private hubConnection: HubConnection | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private directMessageHandlers: ((message: DirectMessage) => void)[] = [];
  private typingHandlers: ((roomId: number, userId: number, isTyping: boolean) => void)[] = [];
  private connectionStatusHandlers: ((isConnected: boolean) => void)[] = [];
  private userStatusHandlers: ((user: UserProfile, isOnline: boolean) => void)[] = [];

  onUserStatus(handler: (user: UserProfile, isOnline: boolean) => void) {
    this.userStatusHandlers.push(handler);
    return () => {
      this.userStatusHandlers = this.userStatusHandlers.filter(h => h !== handler);
    };
  }

  async connect(token: string) {
    try {
      const hubUrl = `${BASE_URL.replace('/api', '')}/hubs/chat`;
      console.log('Connecting to chat hub at:', hubUrl);

      // Add more robust connection configuration
      this.hubConnection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          transport: HttpTransportType.WebSockets,
          skipNegotiation: false,
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            const retryCount = retryContext.previousRetryCount;
            return retryCount === 0 ? 0 : Math.min(retryCount * 1000, 30000);
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Setup specific event handlers
      this.hubConnection.onreconnecting((error) => {
        console.log('Reconnecting to chat hub...', error);
        this.connectionStatusHandlers.forEach(handler => handler(false));
      });

      this.hubConnection.onreconnected((connectionId) => {
        console.log('Reconnected to chat hub. Connection ID:', connectionId);
        this.connectionStatusHandlers.forEach(handler => handler(true));
      });

      this.hubConnection.onclose((error) => {
        console.error('Chat connection closed:', error);
        this.connectionStatusHandlers.forEach(handler => handler(false));
      });

      // Add user status event handler
      this.hubConnection.on('UserOnlineStatus', (user: UserProfile, isOnline: boolean) => {
        console.log('User status update:', user, isOnline);
        this.userStatusHandlers.forEach(handler => handler(user, isOnline));
      });

      // Setup other message handlers
      this.setupMessageHandlers();

      // Attempt to start the connection with additional error handling
      await this.startConnection();

    } catch (error) {
      console.error('Failed to connect to chat hub:', error);
      
      // Notify connection status handlers
      this.connectionStatusHandlers.forEach(handler => handler(false));
      
      throw error;
    }
  }

  private async startConnection() {
    if (!this.hubConnection) {
      throw new Error('Hub connection is not initialized');
    }

    try {
      // Add a timeout to the connection attempt
      const connectionTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Connection timeout')), 10000)
      );

      await Promise.race([
        this.hubConnection.start(),
        connectionTimeout
      ]);

      console.log('Connected to chat hub successfully');
      
      // Notify connection status handlers
      this.connectionStatusHandlers.forEach(handler => handler(true));
      
    } catch (error) {
      console.error('Connection start error:', error);
      
      // Additional error details
      if (error instanceof Error) {
        console.error('Detailed error:', {
          name: error.name,
          message: error.message,
          stack: error.stack
        });
      }

      // Notify connection status handlers
      this.connectionStatusHandlers.forEach(handler => handler(false));
      
      throw error;
    }
  }

  private setupMessageHandlers() {
    if (!this.hubConnection) return;

    this.hubConnection.on('ReceiveMessage', (message: ChatMessage) => {
      console.log('Received chat message:', message);
      this.messageHandlers.forEach(handler => handler(message));
    });

    this.hubConnection.on('ReceiveDirectMessage', (message: DirectMessage) => {
      console.log('Received direct message:', message);
      this.directMessageHandlers.forEach(handler => handler(message));
    });

    this.hubConnection.on('UserTyping', (roomId: number, userId: number, isTyping: boolean) => {
      console.log('User typing status:', { roomId, userId, isTyping });
      this.typingHandlers.forEach(handler => handler(roomId, userId, isTyping));
    });
  }

  private setupConnectionHandlers() {
    if (!this.hubConnection) return;

    this.hubConnection.onreconnecting(error => {
      console.log('Reconnecting to chat hub...', error);
      const chatError = {
        type: ChatErrorType.CONNECTION,
        details: error
      };
      chatErrorHandler.handleError(chatError);
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('Reconnected to chat hub. Connection ID:', connectionId);
      
      // Notify connection status handlers
      this.connectionStatusHandlers.forEach(handler => handler(true));
      
      toast.success('Reconnected to chat');
    });

    this.hubConnection.onclose(error => {
      console.log('Chat hub connection closed:', error);
      
      // Notify connection status handlers
      this.connectionStatusHandlers.forEach(handler => handler(false));
      
      const chatError = {
        type: ChatErrorType.CONNECTION,
        details: error
      };
      chatErrorHandler.handleError(chatError);
    });
  }

  async disconnect() {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.hubConnection = null;
        console.log('Disconnected from chat hub');
        
        // Notify connection status handlers
        this.connectionStatusHandlers.forEach(handler => handler(false));
      } catch (error) {
        console.error('Error disconnecting from chat hub:', error);
        const chatError = {
          type: ChatErrorType.CONNECTION,
          details: error
        };
        chatErrorHandler.handleError(chatError);
      }
    }
  }

  async joinRoom(roomId: number) {
    if (!this.hubConnection) {
      throw new Error('Not connected to chat hub');
    }

    try {
      await this.hubConnection.invoke('JoinRoom', roomId);
      console.log('Joined room:', roomId);
    } catch (error) {
      const chatError = {
        type: ChatErrorType.ROOM_JOIN,
        details: error
      };
      chatErrorHandler.handleError(chatError);
      throw error;
    }
  }

  async leaveRoom(roomId: number) {
    if (!this.hubConnection) {
      throw new Error('Not connected to chat hub');
    }

    try {
      await this.hubConnection.invoke('LeaveRoom', roomId);
      console.log('Left room:', roomId);
    } catch (error) {
      const chatError = {
        type: ChatErrorType.ROOM_LEAVE,
        details: error
      };
      chatErrorHandler.handleError(chatError);
      throw error;
    }
  }

  async sendMessage(message: SendMessageRequest) {
    if (!this.hubConnection) {
      throw new Error('Not connected to chat hub');
    }

    try {
      await this.hubConnection.invoke('SendMessage', message);
      console.log('Message sent:', message);
    } catch (error) {
      const chatError = {
        type: ChatErrorType.MESSAGE_SEND,
        details: error
      };
      chatErrorHandler.handleError(chatError);
      throw error;
    }
  }

  async sendDirectMessage(message: SendDirectMessageRequest) {
    if (!this.hubConnection) {
      throw new Error('Not connected to chat hub');
    }

    try {
      await this.hubConnection.invoke('SendDirectMessage', message);
      console.log('Direct message sent to:', message.receiverId);
    } catch (error) {
      const chatError = {
        type: ChatErrorType.MESSAGE_SEND,
        details: error
      };
      chatErrorHandler.handleError(chatError);
      throw error;
    }
  }

  async sendTypingStatus(roomId: number, isTyping: boolean) {
    if (!this.hubConnection) {
      throw new Error('Not connected to chat hub');
    }

    try {
      await this.hubConnection.invoke('SendTypingStatus', roomId, isTyping);
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
  }

  onUserTyping(handler: (roomId: number, user: UserProfile, isTyping: boolean) => void) {
    // Add a method to handle typing status updates from the server
    this.hubConnection?.on('UserTypingStatus', (roomId: number, user: UserProfile, isTyping: boolean) => {
      handler(roomId, user, isTyping);
    });
  }


  // Event handler registration methods
  onMessage(handler: (message: ChatMessage) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  onDirectMessage(handler: (message: DirectMessage) => void) {
    this.directMessageHandlers.push(handler);
    return () => {
      this.directMessageHandlers = this.directMessageHandlers.filter(h => h !== handler);
    };
  }

  onTyping(handler: (roomId: number, userId: number, isTyping: boolean) => void) {
    this.typingHandlers.push(handler);
    return () => {
      this.typingHandlers = this.typingHandlers.filter(h => h !== handler);
    };
  }

  // Connection status handler registration method
  onConnectionStatusChange(handler: (isConnected: boolean) => void) {
    this.connectionStatusHandlers.push(handler);
    return () => {
      this.connectionStatusHandlers = this.connectionStatusHandlers.filter(h => h !== handler);
    };
  }

  // Connection status
  isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }

  // Get current connection
  getConnection(): HubConnection | null {
    return this.hubConnection;
  }
}

export const chatService = new ChatService();