import { useState } from 'react';
import { MessageSquare, Mail, Loader2 } from 'lucide-react';
import { cn } from '../utils/styles';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { UserProfile } from '../types/chat';
import { useChatStore } from './store/chatStore';
import { HubConnectionState } from '@microsoft/signalr';



interface ChatActionButtonProps {
  targetUser: UserProfile;
}



export const ChatActionButton = ({ targetUser }: ChatActionButtonProps) => {
  const navigate = useNavigate();
  const [isStartingChat, setIsStartingChat] = useState(false);
  const connectionState = useChatStore(state => state.connectionState);
  const { connect } = useChat();

  const handleStartChat = async () => {
    try {
      setIsStartingChat(true);

      // Check if we need to connect
      if (connectionState !== HubConnectionState.Connected) {
        await connect();
      }

      // Navigate to messages with the user ID
      navigate(`/messages/${targetUser.id}`);
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
};


function useChat(): { connect: any; } {
  throw new Error('Function not implemented.');
}
// User card component
// export const UserCard = ({ user }: { user: UserProfile }) => {
//   return (
//     <div className="bg-stone-900 rounded-xl p-6 border border-stone-800">
//       {/* User info... */}
      
//       {/* Action Buttons */}
//       <div className="flex items-center gap-3 mt-6">
//         <FriendActionButton targetUser={user} />
//         <ChatActionButton targetUser={user} />
//       </div>
//     </div>
//   );
// };