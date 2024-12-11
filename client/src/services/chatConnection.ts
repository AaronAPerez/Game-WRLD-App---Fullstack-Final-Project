import {
    HubConnection,
    HubConnectionBuilder,
    HubConnectionState,
    LogLevel,
  } from '@microsoft/signalr';
import { BASE_URL } from '../constant';

  
  export class ChatConnectionManager {
    private connection: HubConnection | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 5000; // 5 seconds
  
    async initializeConnection(token: string): Promise<HubConnection> {
      if (this.connection?.state === HubConnectionState.Connected) {
        return this.connection;
      }
  
      this.connection = new HubConnectionBuilder()
        .withUrl(`${BASE_URL}/hubs/chat`, {
          accessTokenFactory: () => token
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount >= this.maxReconnectAttempts) {
              return null; // Stop trying to reconnect
            }
  
            return this.reconnectInterval;
          }
        })
        .configureLogging(LogLevel.Information)
        .build();
  
      // Set up connection event handlers
      this.connection.onreconnecting(() => {
        console.log('Attempting to reconnect to chat hub...');
        this.reconnectAttempts++;
      });
  
      this.connection.onreconnected(() => {
        console.log('Reconnected to chat hub');
        this.reconnectAttempts = 0;
      });
  
      this.connection.onclose((error) => {
        console.log('Connection closed', error);
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.attemptReconnect();
        }
      });
  
      try {
        await this.connection.start();
        console.log('Connected to chat hub');
        this.reconnectAttempts = 0;
        return this.connection;
      } catch (err) {
        console.error('Error starting connection:', err);
        throw err;
      }
    }
  
    private async attemptReconnect() {
      try {
        if (this.connection?.state === HubConnectionState.Disconnected) {
          await this.connection.start();
        }
      } catch (err) {
        console.error('Reconnection attempt failed:', err);
        setTimeout(() => this.attemptReconnect(), this.reconnectInterval);
      }
    }
  
    async disconnect() {
      if (this.connection?.state === HubConnectionState.Connected) {
        try {
          await this.connection.stop();
          this.connection = null;
        } catch (err) {
          console.error('Error disconnecting:', err);
          throw err;
        }
      }
    }
  
    getConnection(): HubConnection | null {
      return this.connection;
    }
  }
  
  export const chatConnectionManager = new ChatConnectionManager();