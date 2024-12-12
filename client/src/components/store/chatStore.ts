import { create } from 'zustand';
import type { ChatState, ChatRoom, ChatMessage, ChatUser } from '../types/chat';

interface ChatStore extends ChatState {
  setActiveRoom: (room: ChatRoom | undefined) => void;
  addMessage: (roomId: number, message: ChatMessage) => void;
  setTypingStatus: (roomId: number, userId: number, isTyping: boolean) => void;
  setOnlineStatus: (userId: number, isOnline: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: {},
  typingUsers: {},
  onlineUsers: new Set(),

  setActiveRoom: (room) => set({ activeRoom: room }),

  addMessage: (roomId, message) => set((state) => ({
    messages: {
      ...state.messages,
      [roomId]: [...(state.messages[roomId] || []), message]
    }
  })),

  setTypingStatus: (roomId, userId, isTyping) => set((state) => {
    const roomTyping = new Set(state.typingUsers[roomId] || []);
    if (isTyping) {
      roomTyping.add(userId);
    } else {
      roomTyping.delete(userId);
    }
    return {
      typingUsers: {
        ...state.typingUsers,
        [roomId]: roomTyping
      }
    };
  }),

  setOnlineStatus: (userId, isOnline) => set((state) => {
    const newOnlineUsers = new Set(state.onlineUsers);
    if (isOnline) {
      newOnlineUsers.add(userId);
    } else {
      newOnlineUsers.delete(userId);
    }
    return { onlineUsers: newOnlineUsers };
  }),

  clearChat: () => set({
    activeRoom: undefined,
    messages: {},
    typingUsers: {},
    onlineUsers: new Set()
  })
}));