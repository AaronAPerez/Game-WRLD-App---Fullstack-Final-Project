import { useEffect, useState } from "react";
import { UserProfile } from "../types/chat";
import { chatService } from "../services/chatService";

export function useChatUserStatus() {
    const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([]);
  
    useEffect(() => {
      const handleUserStatus = (user: UserProfile, isOnline: boolean) => {
        setOnlineUsers(prev => {
          if (isOnline) {
            // Add user if not already in the list
            return prev.some(u => u.id === user.id) 
              ? prev 
              : [...prev, user];
          } else {
            // Remove user from online list
            return prev.filter(u => u.id !== user.id);
          }
        });
      };
  
      const unsubscribe = chatService.onUserStatus(handleUserStatus);
  
      return () => {
        unsubscribe();
      };
    }, []);
  
    return { onlineUsers };
  }