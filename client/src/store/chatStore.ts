import { create } from 'zustand';
<<<<<<< HEAD
import { devtools } from 'zustand/middleware';
import { ChatRoom, DirectMessage } from '../types';
=======
import { HubConnectionState } from '@microsoft/signalr';
import { DirectMessage, UserProfileDTO } from '../types';
>>>>>>> 148c934c91d96d0d5b3f871660dbde30808f4b17


interface ChatState {
  connection: signalR.HubConnection | null;
  connectionState: HubConnectionState;
  activeConversation: UserProfileDTO | null;
  messages: Record<number, DirectMessage[]>;
  typingUsers: Set<number>;

  setConnection: (connection: signalR.HubConnection | null) => void;
  setConnectionState: (state: HubConnectionState) => void;
  setActiveConversation: (user: UserProfileDTO | null) => void;
  addMessage: (message: DirectMessage) => void;
  setTypingUser: (userId: number, isTyping: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  connection: null,
  connectionState: HubConnectionState.Disconnected,
  activeConversation: null,
  messages: {},
  typingUsers: new Set(),

  setConnection: (connection) => set({ connection }),
  setConnectionState: (state) => set({ connectionState: state }),
  setActiveConversation: (user) => set({ activeConversation: user }),
  
  addMessage: (message) => set((state) => {
    const conversationId = message.senderId === state.activeConversation?.id 
      ? message.senderId 
      : message.receiverId;

    return {
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          message
        ]
      }
    };
  }),

  setTypingUser: (userId, isTyping) => set((state) => ({
    typingUsers: new Set(
      isTyping 
        ? [...state.typingUsers, userId]
        : [...state.typingUsers].filter(id => id !== userId)
    )
  })),

  clearMessages: () => set({ messages: {} })
}));


// import { create } from 'zustand';
// import { devtools } from 'zustand/middleware';
// import type { ChatRoom, DirectMessage } from '../types/chat';
// import { UserProfile } from '../types';

// interface ChatState {
//   connectionState: any;
//   // Active conversations
//   activeRoom: ChatRoom | null;
//   activeConversation: UserProfile | null;
  
//   // Messages
//   messages: Record<number, DirectMessage[]>;
//   unreadMessages: DirectMessage[];
  
//   // Typing indicators
//   typingUsers: Map<number, Set<number>>;
  
//   // Online status
//   onlineUsers: Set<number>;
  
//   // Actions
//   setActiveRoom: (room: ChatRoom | null) => void;
//   setActiveConversation: (user: UserProfile | null) => void;
//   addMessage: (conversationId: number, message: DirectMessage) => void;
//   markMessageAsRead: (messageId: number) => void;
//   setUserTyping: (conversationId: number, userId: number, isTyping: boolean) => void;
//   setUserOnline: (userId: number, isOnline: boolean) => void;
//   clearChat: () => void;
// }

// export const useChatStore = create<ChatState>()(
//   devtools(
//     (set) => ({
//       activeRoom: null,
//       activeConversation: null,
//       messages: {},
//       unreadMessages: [],
//       typingUsers: new Map(),
//       onlineUsers: new Set(),

//       setActiveRoom: (room) => set({ activeRoom: room }),
      
//       setActiveConversation: (user) => set({ activeConversation: user }),
      
//       addMessage: (conversationId, message) => set((state) => ({
//         messages: {
//           ...state.messages,
//           [conversationId]: [...(state.messages[conversationId] || []), message]
//         },
//         unreadMessages: message.isRead ? 
//           state.unreadMessages : 
//           [...state.unreadMessages, message]
//       })),
      
//       markMessageAsRead: (messageId) => set((state) => ({
//         unreadMessages: state.unreadMessages.filter(msg => msg.id !== messageId)
//       })),
      
//       setUserTyping: (conversationId, userId, isTyping) => set((state) => {
//         const newTypingUsers = new Map(state.typingUsers);
//         const conversationTyping = new Set(newTypingUsers.get(conversationId) || []);
        
//         if (isTyping) {
//           conversationTyping.add(userId);
//         } else {
//           conversationTyping.delete(userId);
//         }
        
//         newTypingUsers.set(conversationId, conversationTyping);
//         return { typingUsers: newTypingUsers };
//       }),
      
//       setUserOnline: (userId, isOnline) => set((state) => {
//         const newOnlineUsers = new Set(state.onlineUsers);
//         if (isOnline) {
//           newOnlineUsers.add(userId);
//         } else {
//           newOnlineUsers.delete(userId);
//         }
//         return { onlineUsers: newOnlineUsers };
//       }),
      
//       clearChat: () => set({
//         activeRoom: null,
//         activeConversation: null,
//         messages: {},
//         unreadMessages: [],
//         typingUsers: new Map(),
//         onlineUsers: new Set()
//       })
//     }),
//     { name: 'chat-store' }
//   )
// );

// // Selector hooks for common use cases
// export const useActiveRoom = () => useChatStore(state => state.activeRoom);
// export const useActiveConversation = () => useChatStore(state => state.activeConversation);
// export const useUnreadMessages = () => useChatStore(state => state.unreadMessages);