import { HubConnectionBuilder, HubConnection, LogLevel, HttpTransportType } from '@microsoft/signalr';
import { BASE_URL } from '../constant';
import type { ChatMessage, DirectMessage, SendMessageRequest } from '../types/chat';
import { toast } from 'react-hot-toast';
import { QueryFunction, skipToken } from '@tanstack/react-query';

class ChatService {
  getConnection() {
    throw new Error('Method not implemented.');
  }
  getRoomMessages(id: number): any {
    throw new Error('Method not implemented.');
  }
  getDirectMessages(_id: number, _arg1: number, _arg2: number): any {
    throw new Error('Method not implemented.');
  }
  getChatRooms: typeof skipToken | QueryFunction<unknown, string[], never> | undefined;
  getChatRoom(_roomId: number): any {
    throw new Error('Method not implemented.');
  }
  private hubConnection: HubConnection | null = null;
  private messageHandlers: ((message: ChatMessage) => void)[] = [];
  private directMessageHandlers: ((message: DirectMessage) => void)[] = [];
  private typingHandlers: ((roomId: number, userId: number, isTyping: boolean) => void)[] = [];

  async connect(token: string) {
    try {
      const hubUrl = `${BASE_URL.replace('/api', '')}/hubs/chat`;
      console.log('Connecting to chat hub at:', hubUrl);

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(hubUrl, {
          transport: HttpTransportType.WebSockets,
          skipNegotiation: false,
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: retryContext => {
            if (retryContext.previousRetryCount === 0) {
              return 0;
            } else if (retryContext.previousRetryCount < 3) {
              return 2000;
            } else {
              return 5000;
            }
          }
        })
        .configureLogging(LogLevel.Information)
        .build();

      // Set up message handlers
      this.setupMessageHandlers();

      // Set up connection event handlers
      this.setupConnectionHandlers();

      await this.hubConnection.start();
      console.log('Connected to chat hub successfully');
      toast.success('Connected to chat');

    } catch (error) {
      console.error('Error connecting to chat hub:', error);
      toast.error('Failed to connect to chat');
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
      toast.loading('Reconnecting to chat...');
    });

    this.hubConnection.onreconnected(connectionId => {
      console.log('Reconnected to chat hub. Connection ID:', connectionId);
      toast.success('Reconnected to chat');
    });

    this.hubConnection.onclose(error => {
      console.log('Chat hub connection closed:', error);
      toast.error('Disconnected from chat');
    });
  }

  async disconnect() {
    if (this.hubConnection) {
      try {
        await this.hubConnection.stop();
        this.hubConnection = null;
        console.log('Disconnected from chat hub');
      } catch (error) {
        console.error('Error disconnecting from chat hub:', error);
      }
    }
  }

  async joinRoom(roomId: number) {
    if (!this.hubConnection) throw new Error('Not connected to chat hub');

    try {
      await this.hubConnection.invoke('JoinRoom', roomId);
      console.log('Joined room:', roomId);
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  }

  async leaveRoom(roomId: number) {
    if (!this.hubConnection) throw new Error('Not connected to chat hub');

    try {
      await this.hubConnection.invoke('LeaveRoom', roomId);
      console.log('Left room:', roomId);
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  }

  async sendMessage(message: SendMessageRequest) {
    if (!this.hubConnection) throw new Error('Not connected to chat hub');

    try {
      await this.hubConnection.invoke('SendMessage', message);
      console.log('Message sent:', message);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  async sendDirectMessage(receiverId: number, content: string) {
    if (!this.hubConnection) throw new Error('Not connected to chat hub');

    try {
      await this.hubConnection.invoke('SendDirectMessage', {
        receiverId,
        content,
        messageType: 'text'
      });
      console.log('Direct message sent to:', receiverId);
    } catch (error) {
      console.error('Error sending direct message:', error);
      throw error;
    }
  }

  async sendTypingStatus(roomId: number, isTyping: boolean) {
    if (!this.hubConnection) throw new Error('Not connected to chat hub');

    try {
      await this.hubConnection.invoke('UserTyping', roomId, isTyping);
    } catch (error) {
      console.error('Error sending typing status:', error);
    }
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

  // Connection status
  isConnected(): boolean {
    return this.hubConnection?.state === 'Connected';
  }
}

export const chatService = new ChatService();