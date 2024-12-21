import { HubConnection } from '@microsoft/signalr';




let notificationHandler: NotificationHandler | null = null;

export function setupNotifications(connection: HubConnection) {
  if (!notificationHandler) {
    notificationHandler = new NotificationHandler(connection);
  }
  return notificationHandler;
}