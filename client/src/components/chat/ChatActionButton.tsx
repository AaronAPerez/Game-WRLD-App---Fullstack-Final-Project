import { useState } from 'react';
import { MessageSquare, Mail, Loader2 } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../../services/chatService';
import { useChatStore } from '../../store/chatStore';
import { cn } from '../../utils/styles';
import { UserProfileDTO } from '../../types';
import { toast } from 'react-hot-toast';
import { SendMessageParams } from '../../types/index';

interface ChatActionButtonProps {
  targetUser: UserProfileDTO;
}

export function ChatActionButton({ targetUser }: ChatActionButtonProps) {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const { setActiveConversation } = useChatStore();

  const startChatMutation = useMutation({
    mutationFn: async () => {
      // Start a direct message conversation
      const conversation = await chatService.startMessage();
      return conversation;
    },
    onSuccess: () => {
      setActiveConversation(targetUser);
      navigate(`/messages/${targetUser.id}`);
      toast.success(`Started chat with ${targetUser.username}`);
    },
    onError: () => {
      toast.error('Failed to start chat');
    }
  });

  return (
    <button
      onClick={() => startChatMutation.mutate()}
      disabled={isStartingChat || startChatMutation.isPending}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg flex-1",
        "transition-colors",
        targetUser.status === 'online'
          ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
          : "bg-stone-800 text-gray-400 hover:bg-stone-700"
      )}
    >
      {startChatMutation.isPending ? (
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