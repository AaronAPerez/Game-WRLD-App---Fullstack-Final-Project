import { toast } from 'react-hot-toast';

export enum ChatErrorType {
  CONNECTION = 'CONNECTION',
  MESSAGE_SEND = 'MESSAGE_SEND',
  MESSAGE_RECEIVE = 'MESSAGE_RECEIVE',
  ROOM_JOIN = 'ROOM_JOIN',
  ROOM_LEAVE = 'ROOM_LEAVE',
  USER_STATUS = 'USER_STATUS',
}

interface ChatError extends Error {
  type: ChatErrorType;
  details?: any;
}

class ChatErrorHandler {
  private handleConnectionError(error: Error) {
    console.error('Chat connection error:', error);
    toast.error('Failed to connect to chat. Please try again later.');
  }

  private handleMessageSendError(error: Error) {
    console.error('Message send error:', error);
    toast.error('Failed to send message. Please try again.');
  }

  private handleMessageReceiveError(error: Error) {
    console.error('Message receive error:', error);
    toast.error('Failed to receive messages. Please refresh the page.');
  }

  private handleRoomJoinError(error: Error) {
    console.error('Room join error:', error);
    toast.error('Failed to join chat room. Please try again.');
  }

  private handleRoomLeaveError(error: Error) {
    console.error('Room leave error:', error);
    toast.error('Failed to leave chat room.');
  }

  private handleUserStatusError(error: Error) {
    console.error('User status error:', error);
    toast.error('Failed to update user status.');
  }

  public handleError(error: ChatError) {
    switch (error.type) {
      case ChatErrorType.CONNECTION:
        this.handleConnectionError(error);
        break;
      case ChatErrorType.MESSAGE_SEND:
        this.handleMessageSendError(error);
        break;
      case ChatErrorType.MESSAGE_RECEIVE:
        this.handleMessageReceiveError(error);
        break;
      case ChatErrorType.ROOM_JOIN:
        this.handleRoomJoinError(error);
        break;
      case ChatErrorType.ROOM_LEAVE:
        this.handleRoomLeaveError(error);
        break;
      case ChatErrorType.USER_STATUS:
        this.handleUserStatusError(error);
        break;
      default:
        console.error('Unhandled chat error:', error);
        toast.error('An unexpected error occurred.');
    }
  }
}

export const chatErrorHandler = new ChatErrorHandler();