import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { ChatRoom, DirectMessage } from '../types';


interface ChatState {
  connectionState: any;
  // Active conversations
  activeRoom: ChatRoom | null;
  activeConversation: UserProfile | null;
  
  // Messages
  messages: Record<number, DirectMessage[]>;
  unreadMessages: DirectMessage[];
  
  // Typing indicators
  typingUsers: Map<number, Set<number>>;
  
  // Online status
  onlineUsers: Set<number>;
  
  // Actions
  setActiveRoom: (room: ChatRoom | null) => void;
  setActiveConversation: (user: UserProfile | null) => void;
  addMessage: (conversationId: number, message: DirectMessage) => void;
  markMessageAsRead: (messageId: number) => void;
  setUserTyping: (conversationId: number, userId: number, isTyping: boolean) => void;
  setUserOnline: (userId: number, isOnline: boolean) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>()(
  devtools(
    (set) => ({
      activeRoom: null,
      activeConversation: null,
      messages: {},
      unreadMessages: [],
      typingUsers: new Map(),
      onlineUsers: new Set(),

      setActiveRoom: (room) => set({ activeRoom: room }),
      
      setActiveConversation: (user) => set({ activeConversation: user }),
      
      addMessage: (conversationId, message) => set((state) => ({
        messages: {
          ...state.messages,
          [conversationId]: [...(state.messages[conversationId] || []), message]
        },
        unreadMessages: message.isRead ? 
          state.unreadMessages : 
          [...state.unreadMessages, message]
      })),
      
      markMessageAsRead: (messageId) => set((state) => ({
        unreadMessages: state.unreadMessages.filter(msg => msg.id !== messageId)
      })),
      
      setUserTyping: (conversationId, userId, isTyping) => set((state) => {
        const newTypingUsers = new Map(state.typingUsers);
        const conversationTyping = new Set(newTypingUsers.get(conversationId) || []);
        
        if (isTyping) {
          conversationTyping.add(userId);
        } else {
          conversationTyping.delete(userId);
        }
        
        newTypingUsers.set(conversationId, conversationTyping);
        return { typingUsers: newTypingUsers };
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
        unreadMessages: [],
        typingUsers: new Map(),
        onlineUsers: new Set()
      })
    }),
    { name: 'chat-store' }
  )
);

// Selector hooks for common use cases
export const useActiveRoom = () => useChatStore(state => state.activeRoom);
export const useActiveConversation = () => useChatStore(state => state.activeConversation);
export const useUnreadMessages = () => useChatStore(state => state.unreadMessages);