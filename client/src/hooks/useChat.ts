import { createContext, useContext } from 'react';
import { HubConnectionState } from '@microsoft/signalr';
import type { ChatMessage, ChatRoom } from '../types/chat';

interface ChatContextType {
  connection: any;
  connectionState: HubConnectionState;
  activeRoom: ChatRoom | null;
  messages: Record<number, ChatMessage[]>;
  sendMessage: (roomId: number, content: string) => Promise<void>;
  joinRoom: (roomId: number) => Promise<void>;
  leaveRoom: (roomId: number) => Promise<void>;
  setActiveRoom: (room: ChatRoom | null) => void;
}

const ChatContext = createContext<ChatContextType | null>(null);


// Custom hook
export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
