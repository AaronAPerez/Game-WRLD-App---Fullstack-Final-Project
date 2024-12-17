import { create } from 'zustand';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';
import { ChatRoom, UserProfile, ChatMessage, DirectMessage } from '../../types/chat';


interface ChatState {
  connection: HubConnection | null;
  connectionState: HubConnectionState;
  connectionError: string | null;
  activeRoom: ChatRoom | null;
  activeConversation: UserProfile | null;
  messages: Record<number, ChatMessage[]>;
  directMessages: Record<number, DirectMessage[]>;
  isTyping: Record<number, Set<number>>;
  onlineUsers: Set<number>;
  
  setConnection: (connection: HubConnection | null) => void;
  setConnectionState: (state: HubConnectionState) => void;
  setConnectionError: (error: string | null) => void;
  setActiveRoom: (room: ChatRoom | null) => void;
  addMessage: (roomId: number, message: ChatMessage) => void;
  // Method to set active conversation
  setActiveConversation: (user: UserProfile | null) => void;
  addDirectMessage: (userId: number, message: DirectMessage) => void;
  setUserTyping: (roomId: number, userId: number, isTyping: boolean) => void;
  setUserOnline: (userId: number, isOnline: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  connection: null,
  connectionState: HubConnectionState.Disconnected,
  connectionError: null,
  activeRoom: null,
  activeConversation: null,
  messages: {},
  directMessages: {},
  isTyping: {},
  onlineUsers: new Set(),

  setConnection: (connection) => set({ connection }),
  
  setConnectionState: (state) => set({ connectionState: state }),
  
  setConnectionError: (error) => set({ connectionError: error }),
  
  setActiveRoom: (room) => set({ activeRoom: room }),
  
  // Method to set active conversation
  setActiveConversation: (user) => {
    set({ activeConversation: user });
  },

  addMessage: (roomId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: [...(state.messages[roomId] || []), message]
    }
  })),
  
  addDirectMessage: (userId, message) => set((state) => ({
    directMessages: {
      ...state.directMessages,
      [userId]: [...(state.directMessages[userId] || []), message]
    }
  })),

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