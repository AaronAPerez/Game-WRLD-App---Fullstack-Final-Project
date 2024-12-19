import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { useAuthStore } from '../store/authStore';

export class SignalRService {
  private static instance: SignalRService;
  private hubConnection: HubConnection | null = null;

  private constructor() {}

  static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  async startConnection(hubUrl: string): Promise<void> {
    const token = useAuthStore.getState().token;

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(hubUrl, { accessTokenFactory: () => token || '' })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    try {
      await this.hubConnection.start();
      console.log('SignalR Connected');
    } catch (err) {
      console.error('SignalR Connection Error: ', err);
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection) {
      await this.hubConnection.stop();
    }
  }

  onEvent<T>(eventName: string, callback: (data: T) => void): void {
    this.hubConnection?.on(eventName, callback);
  }

  offEvent(eventName: string): void {
    this.hubConnection?.off(eventName);
  }

  async invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.hubConnection) {
      return await this.hubConnection.invoke(methodName, ...args);
    }
  }

  getConnection(): HubConnection | null {
    return this.hubConnection;
  }
}
