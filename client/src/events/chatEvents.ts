import { EventEmitter } from "stream";
import type { ChatMessage, UserProfile } from '../types/chat';

export enum ChatEventType {
  MESSAGE_RECEIVED = 'messageReceived',
  MESSAGE_SENT = 'messageSent',
  USER_JOINED = 'userJoined',
  USER_LEFT = 'userLeft',
  USER_TYPING = 'userTyping',
  ROOM_UPDATED = 'roomUpdated',
  CONNECTION_STATE_CHANGED = 'connectionStateChanged',
}

interface ChatEvents {
  [ChatEventType.MESSAGE_RECEIVED]: (message: ChatMessage) => void;
  [ChatEventType.MESSAGE_SENT]: (message: ChatMessage) => void;
  [ChatEventType.USER_JOINED]: (roomId: number, user: UserProfile) => void;
  [ChatEventType.USER_LEFT]: (roomId: number, user: UserProfile) => void;
  [ChatEventType.USER_TYPING]: (roomId: number, user: UserProfile, isTyping: boolean) => void;
  [ChatEventType.ROOM_UPDATED]: (roomId: number) => void;
  [ChatEventType.CONNECTION_STATE_CHANGED]: (isConnected: boolean) => void;
}

class ChatEventManager extends EventEmitter<ChatEvents> {
  private static instance: ChatEventManager;

  private constructor() {
    super();
  }

  public static getInstance(): ChatEventManager {
    if (!ChatEventManager.instance) {
      ChatEventManager.instance = new ChatEventManager();
    }
    return ChatEventManager.instance;
  }

  public emitMessageReceived(message: ChatMessage) {
    this.emit(ChatEventType.MESSAGE_RECEIVED, message);
  }

  public emitMessageSent(message: ChatMessage) {
    this.emit(ChatEventType.MESSAGE_SENT, message);
  }

  public emitUserJoined(roomId: number, user: UserProfile) {
    this.emit(ChatEventType.USER_JOINED, roomId, user);
  }

  public emitUserLeft(roomId: number, user: UserProfile) {
    this.emit(ChatEventType.USER_LEFT, roomId, user);
  }

  public emitUserTyping(roomId: number, user: UserProfile, isTyping: boolean) {
    this.emit(ChatEventType.USER_TYPING, roomId, user, isTyping);
  }

  public emitRoomUpdated(roomId: number) {
    this.emit(ChatEventType.ROOM_UPDATED, roomId);
  }

  public emitConnectionStateChanged(isConnected: boolean) {
    this.emit(ChatEventType.CONNECTION_STATE_CHANGED, isConnected);
  }
}

export const chatEventManager = ChatEventManager.getInstance();