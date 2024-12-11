import { create } from 'zustand';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { toast } from 'react-hot-toast';
import type { ChatRoom, ChatMessage, DirectMessage, UserProfile } from '../../types/chat';

interface ChatState {
  // Connection state
  connection: HubConnection | null;
  connectionState: HubConnectionState;
  connectionError: string | null;
  
  // Active states
  activeRoom: ChatRoom | null;
  activeConversation: UserProfile | null;
  
  // Messages
  messages: Record<number, ChatMessage[]>;
  directMessages: Record<number, DirectMessage[]>;
  
  // UI states
  isTyping: Record<number, Set<number>>;
  onlineUsers: Set<number>;
  
  // Actions
  setConnection: (connection: HubConnection | null) => void;
  setConnectionState: (state: HubConnectionState) => void;
  setConnectionError: (error: string | null) => void;
  
  // Room actions
  setActiveRoom: (room: ChatRoom | null) => void;
  addMessage: (roomId: number, message: ChatMessage) => void;
  
  // Direct message actions
  setActiveConversation: (user: UserProfile | null) => void;
  addDirectMessage: (userId: number, message: DirectMessage) => void;
  
  // User status actions
  setUserTyping: (roomId: number, userId: number, isTyping: boolean) => void;
  setUserOnline: (userId: number, isOnline: boolean) => void;
  
  // Clear state
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  connection: null,
  connectionState: HubConnectionState.Disconnected,
  connectionError: null,
  activeRoom: null,
  activeConversation: null,
  messages: {},
  directMessages: {},
  isTyping: {},
  onlineUsers: new Set(),

  // Connection management
  setConnection: (connection) => set({ connection }),
  
  setConnectionState: (state) => {
    set({ connectionState: state });
    if (state === HubConnectionState.Connected) {
      toast.success('Connected to chat');
    } else if (state === HubConnectionState.Disconnected) {
      toast.error('Disconnected from chat');
    }
  },
  
  setConnectionError: (error) => {
    set({ connectionError: error });
    if (error) {
      toast.error(`Chat error: ${error}`);
    }
  },

  // Room management
  setActiveRoom: (room) => set({ activeRoom: room }),
  
  addMessage: (roomId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: [...(state.messages[roomId] || []), message]
    }
  })),

  // Direct message management
  setActiveConversation: (user) => set({ activeConversation: user }),
  
  addDirectMessage: (userId, message) => set((state) => ({
    directMessages: {
      ...state.directMessages,
      [userId]: [...(state.directMessages[userId] || []), message]
    }
  })),

  // User status management
  setUserTyping: (roomId, userId, isTyping) => set((state) => {
    const roomTyping = new Set(state.isTyping[roomId] || []);
    if (isTyping) {
      roomTyping.add(userId);
    } else {
      roomTyping.delete(userId);
    }
    return {
      isTyping: {
        ...state.isTyping,
        [roomId]: roomTyping
      }
    };
  }),

  setUserOnline: (userId, isOnline) => set((state) => {
    const newOnlineUsers = new Set(state.onlineUsers);
    if (isOnline) {
      newOnlineUsers.add(userId);
    } else {
      newOnlineUsers.delete(userId);
    }
    return { onlineUsers: newOnlineUsers };
  }),

  // Clear all state
  clearChat: () => set({
    activeRoom: null,
    activeConversation: null,
    messages: {},
    directMessages: {},
    isTyping: {},
    onlineUsers: new Set()
  })
}));

// Selector hooks
export const useActiveRoom = () => useChatStore(state => state.activeRoom);
export const useActiveConversation = () => useChatStore(state => state.activeConversation);
export const useConnectionState = () => useChatStore(state => state.connectionState);