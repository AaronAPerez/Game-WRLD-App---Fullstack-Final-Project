import { useState } from 'react';
import { MessageSquare, Mail, Loader2 } from 'lucide-react';
import { cn } from '../../utils/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import { useChatStore } from '../../store/chatStore';
import { UserProfileDTO } from '../../types/index';


interface ChatActionButtonProps {
  targetUser: UserProfileDTO;
}

export function ChatActionButton({ targetUser }: ChatActionButtonProps) {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const { setActiveConversation } = useChatStore();

  const handleStartChat = async () => {
    try {
      setIsStartingChat(true);

      // Set the active conversation to the target user
      setActiveConversation(targetUser);

      // Navigate to messages with the user selected
      navigate('/messages');
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Failed to start chat');
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={isStartingChat}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
        targetUser.status === 'online'
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-stone-800 text-gray-400 hover:bg-stone-700",
        "transition-colors"
      )}
    >
      {isStartingChat ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Starting...</span>
        </>
      ) : targetUser.status === 'online' ? (
        <>
          <MessageSquare className="w-4 h-4" />
          <span>Chat</span>
        </>
      ) : (
        <>
          <Mail className="w-4 h-4" />
          <span>Message</span>
        </>
      )}
    </button>
  );
}