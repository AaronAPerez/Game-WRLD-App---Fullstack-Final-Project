import { ChatMessage, UserProfileDTO } from "../types";


export const formatChatTime = (date: string | Date): string => {
  const messageDate = new Date(date);
  const now = new Date();
  
  // If same day, show time
  if (messageDate.toDateString() === now.toDateString()) {
    return messageDate.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
  
  // If this week, show day name
  const days = Math.floor((now.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 7) {
    return messageDate.toLocaleDateString([], { weekday: 'long' });
  }
  
  // Otherwise show date
  return messageDate.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    year: messageDate.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
};

export const groupMessagesByDate = (messages: ChatMessage[]) => {
  return messages.reduce((groups, message) => {
    const date = new Date(message.sentAt).toDateString();
    return {
      ...groups,
      [date]: [...(groups[date] || []), message]
    };
  }, {} as Record<string, ChatMessage[]>);
};

export const getTypingIndicator = (users: UserProfileDTO[]): string => {
  if (!users.length) return '';
  if (users.length === 1) return `${users[0].username} is typing...`;
  if (users.length === 2) return `${users[0].username} and ${users[1].username} are typing...`;
  return `${users[0].username} and ${users.length - 1} others are typing...`;
};

export const formatMessagePreview = (message: string, maxLength: number = 50): string => {
  if (message.length <= maxLength) return message;
  return `${message.substring(0, maxLength)}...`;
};

export const getOnlineStatus = (lastActive: string): string => {
  const lastActiveDate = new Date(lastActive);
  const now = new Date();
  const diffMinutes = Math.floor((now.getTime() - lastActiveDate.getTime()) / (1000 * 60));
  
  if (diffMinutes < 5) return 'online';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
  return 'offline';
};

export const sortMessagesByDate = (messages: ChatMessage[]): ChatMessage[] => {
  return [...messages].sort((a, b) => 
    new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );
};