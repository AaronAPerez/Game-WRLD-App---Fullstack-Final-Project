// Formats a date into a relative time string
export const formatRelativeTime = (date: Date | string): string => {
    const now = new Date();
    const timeDate = new Date(date);
    const diff = now.getTime() - timeDate.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    // If more than 7 days, show the actual date
    if (days > 7) {
      return timeDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  
    // If more than 24 hours but less than 7 days, show the day name
    if (days >= 1) {
      if (days === 1) return 'Yesterday';
      return timeDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
  
    // If more than an hour but less than 24 hours
    if (hours >= 1) {
      return `${hours}h ago`;
    }
  
    // If more than a minute but less than an hour
    if (minutes >= 1) {
      return `${minutes}m ago`;
    }
  
    // If less than a minute
    if (seconds >= 30) {
      return `${seconds}s ago`;
    }
  
    return 'Just now';
  };
  
  // Formats a time string to show hours and minutes
  export const formatMessageTime = (date: Date | string): string => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Returns true if the date is today
  export const isToday = (date: Date | string): boolean => {
    const today = new Date();
    const checkDate = new Date(date);
    return (
      checkDate.getDate() === today.getDate() &&
      checkDate.getMonth() === today.getMonth() &&
      checkDate.getFullYear() === today.getFullYear()
    );
  };
  
  // Groups messages by date
  export const groupMessagesByDate = (messages: any[]): Record<string, any[]> => {
    return messages.reduce((groups: Record<string, any[]>, message) => {
      const date = new Date(message.sentAt).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
      return groups;
    }, {});
  };
  
  // Returns true if the user was recently active (within last 5 minutes)
  export const isRecentlyActive = (lastActive: Date | string): boolean => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diff = now.getTime() - lastActiveDate.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    return minutes < 5;
  };
  
  //  Formats a date for chat message groups
  export const formatMessageDate = (date: Date | string): string => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    if (isToday(messageDate)) {
      return 'Today';
    }
  
    if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
  
    // If within the last 7 days, show day name
    if (today.getTime() - messageDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      return messageDate.toLocaleDateString('en-US', { weekday: 'long' });
    }
  
    // Otherwise show full date
    return messageDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };